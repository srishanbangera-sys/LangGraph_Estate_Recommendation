import { useState, useCallback, useRef } from 'react';
import { INITIAL_PROPERTIES } from '../data/mockProperties';
import { streamLangGraphResponse } from '../services/langgraphClient';

export function useLangGraphChat() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [savedPropertyIds, setSavedPropertyIds] = useState(new Set(['prop-1', 'prop-4']));
  const [selectedProperty, setSelectedProperty] = useState(null);
  
  // Navigation & View mode: 'feed' or 'dashboard'
  const [rightPanelMode, setRightPanelMode] = useState('feed'); // 'feed' | 'dashboard'
  const [activeNav, setActiveNav] = useState('chats'); // 'chats' | 'properties' | 'saved' | 'insights'

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

  /**
   * Main send message handler.
   * Connects cleanly to the LangGraph streaming client.
   */
  const handleSendMessage = useCallback(async (customText) => {
    const textToSend = (typeof customText === 'string' ? customText : inputValue).trim();
    if (!textToSend || isStreaming) return;

    // Reset input immediately
    setInputValue('');

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
      filters: {},
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

        // Dynamically highlight or filter recommendations feed if returned
        if (matchedPropertyIds && matchedPropertyIds.length > 0) {
          setProperties(prev => {
            const prioritized = [...prev].sort((a, b) => {
              const aMatch = matchedPropertyIds.includes(a.id) ? 1 : 0;
              const bMatch = matchedPropertyIds.includes(b.id) ? 1 : 0;
              return bMatch - aMatch;
            });
            return prioritized;
          });
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
    setProperties(INITIAL_PROPERTIES);
    setRightPanelMode('feed');
  }, []);

  return {
    messages,
    inputValue,
    setInputValue,
    isStreaming,
    properties,
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
