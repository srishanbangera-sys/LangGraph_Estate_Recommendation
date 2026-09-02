import React, { useState, useRef } from 'react';
import { Plus, Mic, MicOff, Send, Paperclip, Image as ImageIcon } from 'lucide-react';

export default function ChatInput({
  value,
  onChange,
  onSend,
  isStreaming,
  placeholder = 'Ask anything...'
}) {
  const [isListening, setIsListening] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() && !isStreaming) {
      onSend();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleMic = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      // Simulate speech-to-text placeholder for testing
      setTimeout(() => {
        onChange(prev => (prev ? `${prev} ` : '') + 'Show me luxury homes in London with water view');
        setIsListening(false);
      }, 1800);
    }
  };

  return (
    <div className="relative w-full">
      {/* Attachment popover */}
      {showAttachMenu && (
        <div className="absolute bottom-16 left-2 bg-white rounded-2xl p-2 shadow-xl border border-slate-100 flex flex-col space-y-1 text-xs font-medium z-30 min-w-[170px] animate-in fade-in slide-in-from-bottom-2">
          <button
            onClick={() => setShowAttachMenu(false)}
            className="flex items-center space-x-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left"
          >
            <ImageIcon className="w-4 h-4 text-indigo-500" />
            <span>Floorplan / Photo</span>
          </button>
          <button
            onClick={() => setShowAttachMenu(false)}
            className="flex items-center space-x-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left"
          >
            <Paperclip className="w-4 h-4 text-emerald-500" />
            <span>Budget / PDF Doc</span>
          </button>
        </div>
      )}

      {/* Floating Input Pill Form */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-2 shadow-soft-md hover:shadow-soft-lg transition-all duration-200 focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-100"
      >
        {/* Attachment Button */}
        <button
          type="button"
          onClick={() => setShowAttachMenu(!showAttachMenu)}
          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors shrink-0"
          title="Attach media or floor plan"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Text Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? 'Listening... Speak now' : placeholder}
          disabled={isStreaming}
          className="flex-1 bg-transparent border-none outline-none px-3 py-1.5 text-sm text-slate-800 placeholder:text-slate-400 font-normal disabled:opacity-60"
        />

        {/* Right Action Icons: Mic & Send */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0 pr-1">
          {/* Microphone */}
          <button
            type="button"
            onClick={toggleMic}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
              isListening
                ? 'bg-rose-100 text-rose-600 animate-pulse'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title={isListening ? 'Stop listening' : 'Voice search'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!value.trim() || isStreaming}
            className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full transition-all duration-200 ${
              value.trim() && !isStreaming
                ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
            title="Send message"
          >
            <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
          </button>
        </div>
      </form>
    </div>
  );
}
