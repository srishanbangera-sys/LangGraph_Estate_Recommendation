import React, { useRef, useEffect } from 'react';
import { Sparkles, UserPlus, HelpCircle, ArrowLeft } from 'lucide-react';
import PromptCard from './PromptCard';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { PROMPT_SUGGESTIONS } from '../../data/promptSuggestions';

export default function ChatInterface({
  messages = [],
  inputValue,
  setInputValue,
  isStreaming,
  onSendMessage,
  onSelectPrompt,
  onResetChat,
  properties = [],
  onSelectProperty,
}) {
  const messagesEndRef = useRef(null);

  // Auto-scroll on new messages or streaming chunks
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isStreaming]);

  const hasMessages = messages.length > 0;

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
      {/* Top Header Bar */}
      <header className="h-16 border-b border-slate-100 flex items-center justify-between px-6 shrink-0 bg-white/90 backdrop-blur-md z-10">
        <div className="flex items-center space-x-3">
          {hasMessages && (
            <button
              onClick={onResetChat}
              className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-lg transition-colors mr-1"
              title="Back to start"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <span className="text-sm font-semibold text-slate-800">
            {hasMessages ? 'Real Estate Advisor' : 'New chat'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors">
            Invite
          </button>
          <button className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help</span>
          </button>
        </div>
      </header>

      {/* Main Conversation Canvas */}
      <main className="flex-1 overflow-y-auto px-6 sm:px-10 pb-28 pt-6 flex flex-col justify-start">
        {!hasMessages ? (
          /* Empty / Welcome State matching Image 1 */
          <div className="max-w-xl mx-auto w-full my-auto flex flex-col justify-center animate-in fade-in duration-500">
            {/* Sparkle Icon */}
            <div className="mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-400 flex items-center justify-center text-white shadow-md shadow-indigo-100">
                <Sparkles className="w-4 h-4 fill-white/20" />
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#4f46e5] tracking-tight mb-3">
              How can I help you today?
            </h1>

            {/* Subtitle */}
            <p className="text-sm text-slate-500 leading-relaxed mb-8 max-w-md">
              I'm here to help you find the perfect home. Ask me anything - from budget to location, I've got your back with smart suggestions.
            </p>

            {/* 2x2 Grid of Prompt Suggestions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
              {PROMPT_SUGGESTIONS.map((item) => (
                <PromptCard
                  key={item.id}
                  item={item}
                  onClick={(prompt) => onSelectPrompt(prompt, true)}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Active Chat Thread */
          <div className="max-w-2xl mx-auto w-full flex flex-col pt-2">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                onSelectProperty={onSelectProperty}
                allProperties={properties}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Fixed-Bottom Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none">
        <div className="max-w-2xl mx-auto w-full pointer-events-auto">
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={() => onSendMessage()}
            isStreaming={isStreaming}
          />
        </div>
      </div>
    </div>
  );
}
