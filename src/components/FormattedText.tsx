import React from 'react';

interface FormattedTextProps {
  text: string;
  className?: string;
}

/**
 * Renders text cleanly with bolded important words/phrases,
 * stripping out raw markdown formatting symbols like #, *, **, ---, bullet symbols, etc.
 */
export const FormattedText: React.FC<FormattedTextProps> = ({ text, className = '' }) => {
  if (!text || typeof text !== 'string') return null;

  // Split into lines to preserve structure & paragraph breaks
  const lines = text.split(/\r?\n/);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();

        // Handle empty line
        if (!trimmed) {
          return <div key={lineIdx} className="h-1.5" />;
        }

        // Handle horizontal line dividers like --- or ***
        if (/^[-*_]{3,}\s*$/.test(trimmed)) {
          return <div key={lineIdx} className="my-2 border-b border-slate-200/80 dark:border-slate-800/80" />;
        }

        // Determine line structure before stripping prefix symbols
        const isHeading = /^#+\s*/.test(trimmed);
        const isBullet = /^[-*•]\s+/.test(trimmed);

        // Strip structural prefix symbols
        let cleanLine = trimmed;
        if (isHeading) {
          cleanLine = cleanLine.replace(/^#+\s*/, '');
        }
        if (isBullet) {
          cleanLine = cleanLine.replace(/^[-*•]\s+/, '');
        }

        // Also clean any leading stray symbols like #, *, •, -
        cleanLine = cleanLine.replace(/^[#*•-]+\s*/, '');

        // Render inline contents with bolding and stripped symbols
        const nodes = parseInlineClean(cleanLine);

        if (isHeading) {
          return (
            <div
              key={lineIdx}
              className="font-bold text-sm sm:text-base text-slate-900 dark:text-white pt-2 pb-0.5 tracking-tight"
            >
              {nodes}
            </div>
          );
        }

        if (isBullet) {
          return (
            <div key={lineIdx} className="pl-3 py-0.5 flex items-start">
              <span className="leading-relaxed">{nodes}</span>
            </div>
          );
        }

        return (
          <p key={lineIdx} className="leading-relaxed">
            {nodes}
          </p>
        );
      })}
    </div>
  );
};

/**
 * Parses inline string, converting **bold**, *bold*, <b>bold</b>, <strong>bold</strong> into bold JSX elements
 * while stripping out all raw formatting characters (#, *, **, ---, bullet symbols, backticks).
 */
function parseInlineClean(input: string): React.ReactNode[] {
  if (!input) return [];

  // Match bold patterns (**text**, *text*, <b>text</b>, <strong>text</strong>, `text`)
  const pattern = /(\*\*.*?\*\*|\*.*?\*|<b>.*?<\/b>|<strong>.*?<\/strong>|`.*?`)/g;
  const parts = input.split(pattern);

  return parts.map((part, index) => {
    if (!part) return null;

    const isBold =
      (part.startsWith('**') && part.endsWith('**') && part.length >= 4) ||
      (part.startsWith('*') && part.endsWith('*') && part.length >= 2) ||
      (part.startsWith('<b>') && part.endsWith('</b>')) ||
      (part.startsWith('<strong>') && part.endsWith('</strong>'));

    if (isBold) {
      let inner = part;
      if (inner.startsWith('**') && inner.endsWith('**')) inner = inner.slice(2, -2);
      else if (inner.startsWith('*') && inner.endsWith('*')) inner = inner.slice(1, -1);
      else if (inner.startsWith('<b>') && inner.endsWith('</b>')) inner = inner.slice(3, -4);
      else if (inner.startsWith('<strong>') && inner.endsWith('</strong>')) inner = inner.slice(8, -9);

      // Strip any residual formatting characters from inside bold text
      inner = sanitizeRawSymbols(inner);

      if (!inner.trim()) return null;

      return (
        <strong key={index} className="font-bold">
          {inner}
        </strong>
      );
    }

    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      const inner = sanitizeRawSymbols(part.slice(1, -1));
      if (!inner.trim()) return null;
      return (
        <span key={index} className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[0.9em]">
          {inner}
        </span>
      );
    }

    // Normal text segment: strip out any raw formatting symbols like #, *, **, ---, •, `, etc.
    const cleanText = sanitizeRawSymbols(part);
    return <React.Fragment key={index}>{cleanText}</React.Fragment>;
  });
}

/**
 * Removes raw markdown/formatting characters so they are never displayed as text to the user.
 */
function sanitizeRawSymbols(str: string): string {
  if (!str) return '';
  return str
    .replace(/#+/g, '') // Remove #
    .replace(/\*+/g, '') // Remove *
    .replace(/`+/g, '') // Remove `
    .replace(/~+/g, '') // Remove ~
    .replace(/---+/g, '') // Remove ---
    .replace(/•/g, '') // Remove bullet character
    .replace(/&nbsp;/g, ' '); // Clean html space entity
}
