import { useState, useCallback, useRef, useMemo } from 'react';
import { INITIAL_PROPERTIES } from '../data/mockProperties';
import { streamLangGraphResponse } from '../services/langgraphClient';
import { extractParametersFromConversation, filterProperty } from '../utils/filterExtractor';
import { getPropertyImage, getPropertyCoordinates } from '../utils/imageHelper';
import { calculateInsights } from '../utils/insightsCalculator';

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

  const activeAbortRef = useRef(null);

  // Toggle bookmark / saved property
  const toggleSaveProperty = useCallback((propertyId) => {
    setSavedPropertyIds(prev => {
      const next = new Set(prev);
      if (next.has(propertyId)) {
        next.delete(propertyId);
      } else {
        next.add(propertyId);
      }
      return next;
    });
  }, []);

  // Filter removal helpers
  const clearFilter = useCallback((key) => {
    setActiveFilters(prev => ({ ...prev, [key]: null }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setActiveFilters({
      bhk: null,
      location: null,
      propertyType: null,
      listingType: null,
      maxBudget: null
    });
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
    if (Object.keys(userExtracted).length > 0) {
      setActiveFilters(prev => ({ ...prev, ...userExtracted }));
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
    setMessages(prev => [
      ...prev,
      userMsg,
      {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        isStreaming: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    setIsStreaming(true);

    // Call LangGraph Streaming API
    const abortFn = await streamLangGraphResponse({
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
        if (Object.keys(agentExtracted).length > 0) {
          setActiveFilters(prev => ({ ...prev, ...agentExtracted }));
        }

        setMessages(prev => prev.map(msg => {
          if (msg.id === assistantMessageId) {
            return {
              ...msg,
              content: fullResponse,
              isStreaming: false,
              recommendedIds: matchedPropertyIds
            };
          }
          return msg;
        }));

        // Dynamically highlight or insert recommendations from backend / FAISS
        if (matchedPropertyIds && matchedPropertyIds.length > 0) {
          if (typeof matchedPropertyIds[0] === 'object') {
            // Real FAISS vectorstore properties returned by agent.py
            const mappedNewProps = matchedPropertyIds.map((item, idx) => {
              const baseProp = {
                id: item.property_id || `prop-retrieved-${idx}`,
                title: item.title || 'Featured Property',
                category: item.city ? `For you in ${item.city}` : 'Recommended',
                type: item.property_type || 'Apartment',
                location: item.area ? `${item.area}, ${item.city}` : (item.city || 'Prime Location'),
                country: item.city || 'Real Estate',
                price: Number(item.price) || 2500000,
                priceFormatted: item.price 
                  ? (Number(item.price) > 100000 ? `₹${Number(item.price).toLocaleString('en-IN')}` : `₹${Number(item.price).toLocaleString('en-IN')}/mo`)
                  : 'Price on Request',
                beds: Number(item.bhk) || 3,
                baths: Number(item.bathrooms) || 2,
                sqft: item.area_sqft ? `${item.area_sqft} sqft` : 'Spacious',
                aiMatchScore: 96 - idx * 3,
                tags: item.amenities ? item.amenities.split(';').slice(0, 3) : ['Verified', 'Prime'],
                description: item.description || '',
                amenities: item.amenities ? item.amenities.split(';') : ['Security', 'Modern'],
                status: item.status || 'Available'
              };

              // Inject visual asset & coordinates
              baseProp.image = getPropertyImage(baseProp, idx);
              const coords = getPropertyCoordinates(baseProp, idx);
              baseProp.lat = coords.lat;
              baseProp.lng = coords.lng;

              return baseProp;
            });

            setProperties(prev => {
              const existingIds = new Set(mappedNewProps.map(p => p.id));
              const remaining = prev.filter(p => !existingIds.has(p.id));
              return [...mappedNewProps, ...remaining];
            });
          } else {
            // String IDs (simulated engine)
            setProperties(prev => {
              const prioritized = [...prev].sort((a, b) => {
                const aMatch = matchedPropertyIds.includes(a.id) ? 1 : 0;
                const bMatch = matchedPropertyIds.includes(b.id) ? 1 : 0;
                return bMatch - aMatch;
              });
              return prioritized;
            });
          }
        }
      },
      onError: (err) => {
        console.error('LangGraph streaming error:', err);
        setIsStreaming(false);
        setMessages(prev => prev.map(msg => {
          if (msg.id === assistantMessageId) {
            return {
              ...msg,
              content: "I apologize, but I encountered an error retrieving the latest real estate updates. Please try again.",
              isStreaming: false,
              isError: true
            };
          }
          return msg;
        }));
      }
    });

    activeAbortRef.current = abortFn;
  }, [inputValue, isStreaming, messages]);

  // Click on prompt card: populate input or directly send
  const handleSelectPrompt = useCallback((promptText, autoSend = true) => {
    if (autoSend) {
      handleSendMessage(promptText);
    } else {
      setInputValue(promptText);
    }
  }, [handleSendMessage]);

  // "+ New Chat" button reset
  const handleNewChat = useCallback(() => {
    if (activeAbortRef.current) {
      activeAbortRef.current();
    }
    setMessages([]);
    setInputValue('');
    setIsStreaming(false);
    setProperties(NORMALIZED_INITIAL_PROPERTIES);
    setRightPanelMode('feed');
    clearAllFilters();
  }, [clearAllFilters]);

  // Dynamically Filtered Properties for the 'For You' Feed and Interactive Map
  const filteredProperties = useMemo(() => {
    return properties.filter(p => filterProperty(p, activeFilters));
  }, [properties, activeFilters]);

  // Auto-updating Reactive Insights Metrics
  const insightsMetrics = useMemo(() => {
    return calculateInsights(messages, activeFilters, filteredProperties);
  }, [messages, activeFilters, filteredProperties]);

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
    setSelectedProperty,
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
