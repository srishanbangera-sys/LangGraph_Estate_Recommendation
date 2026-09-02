import React from 'react';

/**
 * CleanMarkdownText Component
 * Sanitizes and renders agent responses into clean, elegant typography.
 * Strips raw JSON artifacts, escaped tokens, or unparsed delimiters.
 */
export default function CleanMarkdownText({ content = '', isStreaming = false }) {
  if (!content) return null;

  // 1. Sanitize raw JSON or SSE artifacts
  let cleanText = content;

  // If the agent returned raw JSON, extract the text payload
  if (cleanText.trim().startsWith('{') && cleanText.trim().endsWith('}')) {
    try {
      const parsed = JSON.parse(cleanText);
      if (parsed.answer) cleanText = parsed.answer;
      else if (parsed.content) cleanText = parsed.content;
      else if (parsed.message) cleanText = parsed.message;
    } catch {
      // Not complete JSON yet (e.g. streaming)
    }
  }

  // Remove code fences that wrap JSON if accidentally generated
  cleanText = cleanText.replace(/```(?:json)?\s*[\{\[](?:.|\n)*?[\}\]]\s*```/gi, '');
  // Remove raw tool call lines
  cleanText = cleanText.replace(/data:\s*\{.*?\}\n?/g, '');
  cleanText = cleanText.replace(/\{"tool_call".*?\}/g, '');

  // Split into paragraphs / blocks
  const blocks = cleanText.split('\n\n').filter(b => b.trim() !== '');

  return (
    <div className="space-y-3.5 text-slate-800 text-[13.5px] leading-relaxed select-text font-normal">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();

        // 1. Heading 1 / Title (# Header)
        if (trimmed.startsWith('# ')) {
          return (
            <h2 key={idx} className="text-base font-bold text-slate-900 tracking-tight pb-1 border-b border-slate-100">
              {formatInline(trimmed.replace(/^#\s+/, ''))}
            </h2>
          );
        }

        // 2. Heading 2 (## Subheader)
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={idx} className="text-[14.5px] font-bold text-slate-900 tracking-tight pt-1">
              {formatInline(trimmed.replace(/^##\s+/, ''))}
            </h3>
          );
        }

        // 3. Heading 3 (### Subheader)
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="text-[13.5px] font-semibold text-indigo-950 flex items-center gap-1.5 pt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />
              {formatInline(trimmed.replace(/^###\s+/, ''))}
            </h4>
          );
        }

        // 4. Bullet List
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
          const lines = trimmed.split('\n');
          return (
            <ul key={idx} className="space-y-1.5 pl-1.5">
              {lines.map((line, lIdx) => {
                const itemContent = line.replace(/^[-*]\s+|\d+\.\s+/, '');
                return (
                  <li key={lIdx} className="flex items-start text-slate-700 leading-snug">
                    <span className="text-indigo-500 font-bold mr-2 text-xs select-none">•</span>
                    <span className="flex-1">{formatInline(itemContent)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // 5. Table block
        if (trimmed.includes('|') && trimmed.split('\n').length >= 2) {
          const tableRows = trimmed.split('\n').filter(r => r.includes('|'));
          if (tableRows.length >= 2) {
            return (
              <div key={idx} className="overflow-x-auto my-2 rounded-xl border border-slate-100 shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <tbody>
                    {tableRows.map((row, rIdx) => {
                      const cells = row.split('|').map(c => c.trim()).filter((c, i, a) => !(i === 0 && c === '') && !(i === a.length - 1 && c === ''));
                      if (cells.every(c => /^[-:]+$/.test(c))) return null; // delimiter row
                      const isHeader = rIdx === 0;
                      return (
                        <tr key={rIdx} className={isHeader ? "bg-slate-50 font-bold text-slate-800 border-b border-slate-100" : "border-b border-slate-50 hover:bg-slate-50/50"}>
                          {cells.map((cell, cIdx) => (
                            <td key={cIdx} className="px-3 py-2">
                              {formatInline(cell)}
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

        // 6. Regular Paragraph
        return (
          <p key={idx} className="leading-relaxed">
            {formatInline(trimmed)}
          </p>
        );
      })}

      {/* Streaming cursor indicator */}
      {isStreaming && (
        <span className="inline-block w-2 h-4 ml-1 bg-indigo-500 animate-cursor-blink align-middle rounded-xs" />
      )}
    </div>
  );
}

/**
 * Formats inline bold, italic, price tags, and badges.
 */
function formatInline(text = '') {
  if (!text) return '';

  // Split by bold tokens **bold**
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const inner = part.slice(2, -2);
      // Highlight prices or status badges
      if (/^₹|Rs|£|\$|Available|Verified|Sold|Rented/i.test(inner)) {
        return (
          <span key={i} className="font-semibold text-indigo-700 bg-indigo-50/60 px-1 py-0.5 rounded-sm">
            {inner}
          </span>
        );
      }
      return <strong key={i} className="font-semibold text-slate-900">{inner}</strong>;
    }

    // Italic *italic*
    if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
      return <em key={i} className="text-slate-600">{part.slice(1, -1)}</em>;
    }

    return part;
  });
}
