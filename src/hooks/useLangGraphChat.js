import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { INITIAL_PROPERTIES } from '../data/mockProperties';
import { streamLangGraphResponse } from '../services/langgraphClient';
import { extractParametersFromConversation, filterProperty } from '../utils/filterExtractor';
import { getPropertyImage, getPropertyCoordinates } from '../utils/imageHelper';
import { calculateInsights } from '../utils/insightsCalculator';
import { syncClient } from '../services/syncClient';

// Ensure all initial properties have visual assets and geographic coordinates
const NORMALIZED_INITIAL_PROPERTIES = INITIAL_PROPERTIES.map((p, i) => ({
  ...p,
  image: getPropertyImage(p, i),
  ...getPropertyCoordinates(p, i)
}));

export function useLangGraphChat() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [properties, setProperties] = useState(NORMALIZED_INITIAL_PROPERTIES);
  const [savedPropertyIds, setSavedPropertyIds] = useState(new Set(['prop-1', 'prop-4']));
  const [selectedProperty, setSelectedProperty] = useState(null);
  
  // Real-time Map Center coordinates (Mangalore default)
  const [currentMapLocation, setCurrentMapLocation] = useState({
    lat: 12.9141,
    lng: 74.8560,
    zoom: 12
  });

  // Cross-device sync status: 'connected' | 'connecting' | 'disconnected'
  const [syncStatus, setSyncStatus] = useState('disconnected');
  const isRemoteSyncRef = useRef(false);

  // Navigation & View mode: 'feed' or 'dashboard'
  const [rightPanelMode, setRightPanelMode] = useState('feed'); // 'feed' | 'dashboard'
  const [activeNav, setActiveNav] = useState('chats'); // 'chats' | 'properties' | 'saved' | 'insights'

  // Conversational Active Filters: { bhk, location, propertyType, listingType, maxBudget }
  const [activeFilters, setActiveFilters] = useState({
    bhk: null,
    location: null,
    propertyType: null,
    listingType: null,
    maxBudget: null
  });

  // =========================================================================
  // 🔄 REAL-TIME CROSS-DEVICE STATE SYNCHRONIZATION (WebSockets + BroadcastChannel)
  // =========================================================================
  useEffect(() => {
    syncClient.connect();

    const unsubscribe = syncClient.subscribe((remoteState, source) => {
      isRemoteSyncRef.current = true;

      if (remoteState.activeFilters) {
        setActiveFilters(remoteState.activeFilters);
      }
      if (remoteState.savedPropertyIds && Array.isArray(remoteState.savedPropertyIds)) {
        setSavedPropertyIds(new Set(remoteState.savedPropertyIds));
      }
      if (remoteState.messages && Array.isArray(remoteState.messages) && remoteState.messages.length > 0) {
        setMessages(remoteState.messages);
      }
      if (remoteState.currentMapLocation) {
        setCurrentMapLocation(remoteState.currentMapLocation);
      }
      if (remoteState.selectedPropertyId !== undefined) {
        if (!remoteState.selectedPropertyId) {
          setSelectedProperty(null);
        } else {
          const found = properties.find(p => p.id === remoteState.selectedPropertyId);
          if (found) setSelectedProperty(found);
        }
      }

      setTimeout(() => {
        isRemoteSyncRef.current = false;
      }, 80);
    });

    const unsubStatus = syncClient.subscribeStatus(setSyncStatus);

    return () => {
      unsubscribe();
      unsubStatus();
    };
  }, [properties]);

  // Toggle bookmark / saved property
  const toggleSaveProperty = useCallback((propertyId) => {
    setSavedPropertyIds(prev => {
      const next = new Set(prev);
      if (next.has(propertyId)) {
        next.delete(propertyId);
      } else {
        next.add(propertyId);
      }
      if (!isRemoteSyncRef.current) {
        syncClient.sendUpdate({ savedPropertyIds: Array.from(next) });
      }
      return next;
    });
  }, []);

  // Filter removal helpers
  const clearFilter = useCallback((key) => {
    setActiveFilters(prev => {
      const updated = { ...prev, [key]: null };
      if (!isRemoteSyncRef.current) {
        syncClient.sendUpdate({ activeFilters: updated });
      }
      return updated;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    const emptyFilters = {
      bhk: null,
      location: null,
      propertyType: null,
      listingType: null,
      maxBudget: null
    };
    setActiveFilters(emptyFilters);
    if (!isRemoteSyncRef.current) {
      syncClient.sendUpdate({ activeFilters: emptyFilters });
    }
  }, []);

  // Update map coordinates
  const updateMapLocation = useCallback((newCoords) => {
    setCurrentMapLocation(newCoords);
    if (!isRemoteSyncRef.current) {
      syncClient.sendUpdate({ currentMapLocation: newCoords });
    }
  }, []);

  /**
   * Main send message handler.
   * Connects cleanly to the LangGraph streaming client and synchronizes conversational state.
   */
  const handleSendMessage = useCallback(async (customText) => {
    const textToSend = (typeof customText === 'string' ? customText : inputValue).trim();
    if (!textToSend || isStreaming) return;

    // Reset input immediately
    setInputValue('');

    // Pre-extract conversational filters from user message
    const userExtracted = extractParametersFromConversation(textToSend, '');
    let updatedFilters = activeFilters;
    if (Object.keys(userExtracted).length > 0) {
      updatedFilters = { ...activeFilters, ...userExtracted };
      setActiveFilters(updatedFilters);
      if (!isRemoteSyncRef.current) {
        syncClient.sendUpdate({ activeFilters: updatedFilters });
      }
    }

    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `assistant-${Date.now() + 1}`;

    const userMsg = {
      id: userMessageId,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Append user message and placeholder assistant message
    const nextMessages = [
      ...messages,
      userMsg,
      {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        isStreaming: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];

    setMessages(nextMessages);
    setIsStreaming(true);

    // Call LangGraph Streaming API
    await streamLangGraphResponse({
      message: textToSend,
      history: messages,
      filters: userExtracted,
      onChunk: (chunk) => {
        setMessages(prev => prev.map(msg => {
          if (msg.id === assistantMessageId) {
            return {
              ...msg,
              content: msg.content + chunk
            };
          }
          return msg;
        }));
      },
      onToolCall: (toolName, args) => {
        console.log(`[LangGraph Tool Call] ${toolName}:`, args);
      },
      onComplete: (fullResponse, matchedPropertyIds) => {
        setIsStreaming(false);

        // Extract any additional filters inferred from assistant response
        const agentExtracted = extractParametersFromConversation(textToSend, fullResponse);
        let finalFilters = updatedFilters;
        if (Object.keys(agentExtracted).length > 0) {
          finalFilters = { ...updatedFilters, ...agentExtracted };
          setActiveFilters(finalFilters);
        }

        const completedMessages = nextMessages.map(msg => {
          if (msg.id === assistantMessageId) {
            return {
              ...msg,
              content: fullResponse,
              isStreaming: false,
              recommendedIds: matchedPropertyIds || []
            };
          }
          return msg;
        });

        setMessages(completedMessages);

        // 🔄 Sync completed turn across devices
        if (!isRemoteSyncRef.current) {
          syncClient.sendUpdate({
            messages: completedMessages,
            activeFilters: finalFilters
          });
        }
      },
      onError: (err) => {
        setIsStreaming(false);
        setMessages(prev => prev.map(msg => {
          if (msg.id === assistantMessageId) {
            return {
              ...msg,
              content: `⚠️ Error: ${err.message || 'Unable to connect to PropPilot agent. Please verify backend is running on port 8000.'}`,
              isStreaming: false,
              isError: true
            };
          }
          return msg;
        }));
      }
    });
  }, [inputValue, isStreaming, messages, activeFilters]);

  // Derived filtered properties: strictly binds the feed and map
  const filteredProperties = useMemo(() => {
    return properties.filter(p => filterProperty(p, activeFilters));
  }, [properties, activeFilters]);

  // Reactive telemetry subscriber for Insights
  const insightsMetrics = useMemo(() => {
    return calculateInsights(messages, activeFilters, filteredProperties);
  }, [messages, activeFilters, filteredProperties]);

  const handleSelectPrompt = useCallback((promptText, autoSend = false) => {
    if (autoSend) {
      handleSendMessage(promptText);
    } else {
      setInputValue(promptText);
    }
  }, [handleSendMessage]);

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setInputValue('');
    setIsStreaming(false);
    setActiveFilters({
      bhk: null,
      location: null,
      propertyType: null,
      listingType: null,
      maxBudget: null
    });
    if (!isRemoteSyncRef.current) {
      syncClient.sendUpdate({
        messages: [],
        activeFilters: {},
        selectedPropertyId: null
      });
    }
  }, []);

  return {
    messages,
    inputValue,
    setInputValue,
    isStreaming,
    properties,
    filteredProperties,
    activeFilters,
    clearFilter,
    clearAllFilters,
    insightsMetrics,
    savedPropertyIds,
    selectedProperty,
    setSelectedProperty: (prop) => {
      setSelectedProperty(prop);
      if (!isRemoteSyncRef.current) {
        syncClient.sendUpdate({ selectedPropertyId: prop?.id || null });
      }
    },
    currentMapLocation,
    updateMapLocation,
    syncStatus,
    rightPanelMode,
    setRightPanelMode,
    activeNav,
    setActiveNav,
    handleSendMessage,
    handleSelectPrompt,
    handleNewChat,
    toggleSaveProperty
  };
}
