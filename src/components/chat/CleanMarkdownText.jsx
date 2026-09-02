import React from 'react';
import { ArrowUpRight, Sparkles, MapPin, CheckCircle } from 'lucide-react';

/**
 * Enhanced CleanMarkdownText Component
 * 
 * - Eliminates raw markdown artifacts (###, raw code blocks, raw JSON)
 * - Renders prose with elegant typography & natural line-height
 * - Inlines subtle badges for property highlights (price, sqft, locality, status)
 * - Detects suggested follow-ups and renders them as distinct, clickable action chips
 */
export default function CleanMarkdownText({ 
  content = '', 
  isStreaming = false,
  onActionClick = null 
}) {
  if (!content) return null;

  // 1. Sanitize raw JSON, SSE, or tool artifacts
  let text = content;

  if (text.trim().startsWith('{') && text.trim().endsWith('}')) {
    try {
      const parsed = JSON.parse(text);
      if (parsed.answer) text = parsed.answer;
      else if (parsed.content) text = parsed.content;
      else if (parsed.message) text = parsed.message;
    } catch {
      // streaming or partial
    }
  }

  // Strip code blocks wrapping JSON or incomplete streaming JSON
  text = text.replace(/```(?:json)?\s*[\{\[][\s\S]*?(?:$|```)/gi, '');
  text = text.replace(/data:\s*\{.*?\}\n?/g, '');
  text = text.replace(/\{\s*"tool_calls?[\s\S]*?(?:\}\}|\]\}|\}$)/g, '');
  text = text.replace(/\{"tool_call".*?\}/g, '');
  text = text.replace(/\n{3,}/g, '\n\n');

  // 2. Extract suggested next steps / follow-up prompts into action chips
  const actionChips = [];
  const followUpPattern = /(?:would you like to|next steps|suggested options)[:\s]*([\s\S]*)$/i;
  const followUpMatch = text.match(followUpPattern);

  if (followUpMatch && !isStreaming) {
    const followUpSection = followUpMatch[1];
    const items = followUpSection.match(/(?:^|\n)(?:[-*]|\d+\.)\s*(?:\*\*)?([^\n\*\r]+)(?:\*\*)?/g);
    if (items) {
      items.forEach(item => {
        const cleanItem = item.replace(/^(?:\n)?(?:[-*]|\d+\.)\s*/, '').replace(/[\*\_\:]/g, '').trim();
        if (cleanItem.length > 5 && cleanItem.length < 55) {
          actionChips.push(cleanItem);
        }
      });
    }
  }

  // Split into readable paragraphs/blocks
  const blocks = text.split('\n\n').filter(b => b.trim() !== '');

  return (
    <div className="space-y-3.5 text-slate-800 text-[13.5px] leading-relaxed select-text font-normal">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();

        // 1. Major Title (# Title)
        if (trimmed.startsWith('# ')) {
          const title = trimmed.replace(/^#\s+/, '').replace(/\*\*/g, '');
          return (
            <h2 key={idx} className="text-[15px] font-extrabold text-slate-900 tracking-tight pb-1.5 border-b border-slate-100 flex items-center gap-1.5">
              <span>{title}</span>
            </h2>
          );
        }

        // 2. Section Header (## Header)
        if (trimmed.startsWith('## ')) {
          const title = trimmed.replace(/^##\s+/, '').replace(/\*\*/g, '');
          return (
            <h3 key={idx} className="text-sm font-bold text-slate-900 tracking-tight pt-1">
              {title}
            </h3>
          );
        }

        // 3. Property Subheader (### Property)
        if (trimmed.startsWith('### ')) {
          const title = trimmed.replace(/^###\s+/, '').replace(/\*\*/g, '');
          return (
            <div key={idx} className="pl-3 py-1 border-l-2 border-indigo-500 bg-indigo-50/30 rounded-r-lg mt-2">
              <h4 className="text-[13px] font-bold text-slate-900 flex items-center gap-1">
                {title}
              </h4>
            </div>
          );
        }

        // 4. Bullet List
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
          const lines = trimmed.split('\n');
          return (
            <ul key={idx} className="space-y-1.5 pl-1">
              {lines.map((line, lIdx) => {
                const itemContent = line.replace(/^[-*]\s+|\d+\.\s+/, '');
                return (
                  <li key={lIdx} className="flex items-start text-slate-700 leading-snug">
                    <span className="text-indigo-600 font-bold mr-2 text-xs select-none">•</span>
                    <span className="flex-1">{formatInlineHighlight(itemContent)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // 5. Table Layout
        if (trimmed.includes('|') && trimmed.split('\n').length >= 2) {
          const tableRows = trimmed.split('\n').filter(r => r.includes('|'));
          if (tableRows.length >= 2) {
            return (
              <div key={idx} className="overflow-x-auto my-2 rounded-xl border border-slate-100 shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <tbody>
                    {tableRows.map((row, rIdx) => {
                      const cells = row.split('|').map(c => c.trim()).filter((c, i, a) => !(i === 0 && c === '') && !(i === a.length - 1 && c === ''));
                      if (cells.every(c => /^[-:]+$/.test(c))) return null;
                      const isHeader = rIdx === 0;
                      return (
                        <tr key={rIdx} className={isHeader ? "bg-slate-50 font-bold text-slate-800 border-b border-slate-100" : "border-b border-slate-50 hover:bg-slate-50/50"}>
                          {cells.map((cell, cIdx) => (
                            <td key={cIdx} className="px-3 py-2">
                              {formatInlineHighlight(cell)}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          }
        }

        // 6. Natural Prose Paragraph
        return (
          <p key={idx} className="leading-relaxed">
            {formatInlineHighlight(trimmed)}
          </p>
        );
      })}

      {/* Suggested Follow-Up Action Chips */}
      {actionChips.length > 0 && (
        <div className="pt-2 mt-2 border-t border-slate-100/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Suggested Follow-up:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {actionChips.map((chip, cIdx) => (
              <button
                key={cIdx}
                type="button"
                onClick={() => onActionClick && onActionClick(chip)}
                className="inline-flex items-center space-x-1 px-3 py-1 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-200/60 shadow-2xs transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>{chip}</span>
                <ArrowUpRight className="w-3 h-3 text-indigo-500" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Streaming cursor */}
      {isStreaming && (
        <span className="inline-block w-2 h-4 ml-1 bg-indigo-500 animate-cursor-blink align-middle rounded-xs" />
      )}
    </div>
  );
}

/**
 * Formats inline bold text and styles property highlights with subtle badges.
 */
function formatInlineHighlight(text = '') {
  if (!text) return '';

  let safeText = text;
  const starMatches = safeText.match(/\*\*/g);
  if (starMatches && starMatches.length % 2 !== 0) {
    safeText += '**';
  }

  const parts = safeText.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const inner = part.slice(2, -2);
      
      // Price highlight badge (₹ or £ or $ or numbers)
      if (/(?:₹|rs\.?|£|\$|[0-9]+(?:\.[0-9]+)?\s*(?:cr|crore|lakh|k|\/mo))/i.test(inner)) {
        return (
          <span key={i} className="font-bold text-indigo-700 bg-indigo-50/70 px-1.5 py-0.5 rounded-md border border-indigo-100">
            {inner}
          </span>
        );
      }

      // Status badges (Available / Sold / Verified)
      if (/available|verified/i.test(inner)) {
        return (
          <span key={i} className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200 text-xs inline-flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-600 inline" />
            {inner}
          </span>
        );
      }
      if (/sold|rented/i.test(inner)) {
        return (
          <span key={i} className="font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded-md border border-rose-200 text-xs">
            {inner}
          </span>
        );
      }

      // Area / sqft highlight
      if (/(?:sqft|sq\.?\s*ft|bhk|bedrooms|bathrooms)/i.test(inner)) {
        return (
          <span key={i} className="font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded-md">
            {inner}
          </span>
        );
      }

      return <strong key={i} className="font-bold text-slate-900">{inner}</strong>;
    }

    // Italic
    if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
      return <em key={i} className="text-slate-600">{part.slice(1, -1)}</em>;
    }

    return part;
  });
}
