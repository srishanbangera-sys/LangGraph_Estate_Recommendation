import React from 'react';
import { Home, Sparkles, AlertCircle, Copy, Check } from 'lucide-react';
import CleanMarkdownText from './CleanMarkdownText';

export default function ChatMessage({ message, onSelectProperty, onActionClick, allProperties = [] }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Find any property cards recommended in this message
  const matchedProps = message.recommendedIds 
    ? allProperties.filter(p => message.recommendedIds.includes(p.id))
    : [];

  return (
    <div className={`flex flex-col mb-6 ${isUser ? 'items-end' : 'items-start'} transition-all duration-300`}>
      <div className={`flex items-start max-w-[90%] md:max-w-[85%] space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className="shrink-0 mt-0.5">
          {isUser ? (
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80"
              alt="User"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100 shadow-sm"
            />
          ) : (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <Sparkles className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Message Bubble Container */}
        <div className="flex flex-col">
          <div
            className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
              isUser
                ? 'bg-slate-900 text-white rounded-tr-sm'
                : message.isError
                ? 'bg-rose-50 text-rose-800 border border-rose-200 rounded-tl-sm'
                : 'bg-white text-slate-800 border border-slate-100 rounded-tl-sm'
            }`}
          >
            {/* Formatted Content */}
            {isUser ? (
              <div className="whitespace-pre-wrap font-medium">{message.content}</div>
            ) : (
              <CleanMarkdownText 
                content={message.content} 
                isStreaming={message.isStreaming} 
                onActionClick={onActionClick}
              />
            )}
          </div>

          {/* Recommended property quick-links if attached */}
          {matchedProps.length > 0 && !message.isStreaming && (
            <div className="mt-2.5 flex flex-wrap gap-2">
              {matchedProps.map(prop => (
                <button
                  key={prop.id}
                  onClick={() => onSelectProperty?.(prop)}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-900 border border-indigo-100 rounded-xl text-xs font-semibold transition-colors shadow-xs"
                >
                  <Home className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{prop.title}</span>
                  <span className="text-indigo-500 font-normal">({prop.location})</span>
                </button>
              ))}
            </div>
          )}

          {/* Bottom Bar: Timestamp & Actions */}
          <div className={`flex items-center space-x-2 mt-1 px-1 text-[11px] text-slate-400 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <span>{message.timestamp}</span>
            {!isUser && !message.isStreaming && message.content && (
              <button
                onClick={handleCopy}
                className="hover:text-slate-600 transition-colors p-0.5 rounded"
                title="Copy response"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
