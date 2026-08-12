import React, { useRef, useEffect, useState, useTransition } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Link as LinkIcon, 
  Sparkles, 
  BookOpen, 
  FileText, 
  Eraser, 
  RotateCcw, 
  RotateCw, 
  Palette, 
  Heading1, 
  Heading2, 
  Heading3, 
  Type,
  HelpCircle,
  Eye,
  Check
} from 'lucide-react';

export interface WysiwygEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  label?: string;
  isUrdu?: boolean;
  minHeight?: string;
}

export const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write content here...',
  label,
  isUrdu = false,
  minHeight = '220px'
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isCodeView, setIsCodeView] = useState<boolean>(false);
  const [direction, setDirection] = useState<'rtl' | 'ltr'>(isUrdu ? 'rtl' : 'ltr');
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [showPresetsMenu, setShowPresetsMenu] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [, startTransition] = useTransition();

  // Color Palette Presets
  const textColors = [
    { name: 'Amber Gold', value: '#f59e0b' },
    { name: 'Emerald Green', value: '#10b981' },
    { name: 'Cyan Blue', value: '#06b6d4' },
    { name: 'White', value: '#ffffff' },
    { name: 'Light Slate', value: '#cbd5e1' },
    { name: 'Rose Red', value: '#f43f5e' },
    { name: 'Purple', value: '#a855f7' }
  ];

  // Initialize and keep editorRef HTML in sync when value changes externally
  useEffect(() => {
    if (editorRef.current && !isCodeView) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value, isCodeView]);

  // Execute formatting command
  const execCmd = (command: string, arg: string | undefined = undefined) => {
    if (isCodeView) return;
    document.execCommand(command, false, arg);
    handleEditorInput();
  };

  // Handle content changes
  const handleEditorInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      startTransition(() => {
        onChange(html === '<br>' ? '' : html);
      });
    }
  };

  // Insert Custom HTML Block at cursor position
  const insertHTML = (htmlToInsert: string) => {
    if (isCodeView) {
      onChange((value || '') + '\n' + htmlToInsert);
      return;
    }

    if (editorRef.current) {
      editorRef.current.focus();
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        range.deleteContents();

        const el = document.createElement('div');
        el.innerHTML = htmlToInsert;
        const frag = document.createDocumentFragment();
        let node, lastNode;
        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node);
        }
        range.insertNode(frag);

        if (lastNode) {
          range.setStartAfter(lastNode);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      } else {
        editorRef.current.innerHTML += htmlToInsert;
      }
      handleEditorInput();
    }
  };

  // Islamic Preset Templates
  const handleInsertBismillah = () => {
    insertHTML(
      `<p class="text-center font-bold my-4 py-2 px-4 rounded-2xl bg-emerald-950/60 border border-amber-500/40 text-amber-400 font-quranic text-2xl leading-relaxed shadow-sm" dir="rtl">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p><p><br></p>`
    );
  };

  const handleInsertDarood = () => {
    insertHTML(`&nbsp;<span class="inline-block px-2 py-0.5 my-0.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold font-quranic text-base" dir="rtl">صَلَّى ٱللَّٰهُ عَلَيْهِ وَآلِهِ وَسَلَّمَ</span>&nbsp;`);
  };

  const handleInsertQuranBox = () => {
    insertHTML(
      `<div class="my-4 p-4.5 rounded-2xl bg-emerald-950/80 border-2 border-amber-500/70 text-center font-quranic text-amber-300 text-xl leading-loose shadow-lg relative" dir="rtl"><span class="block text-xs font-sans text-amber-400 font-bold mb-2 uppercase tracking-wider">﴿ آیۃ کریمہ / QURANIC VERSE ﴾</span>[یہاں قرآنی آیت درج کریں]</div><p><br></p>`
    );
  };

  const handleInsertHadithBox = () => {
    insertHTML(
      `<div class="my-4 p-4.5 rounded-2xl bg-slate-900/90 border-2 border-emerald-500/70 text-right font-nastaliq text-slate-100 text-lg leading-relaxed shadow-lg relative" dir="rtl"><span class="block text-xs font-sans text-emerald-400 font-bold mb-2 uppercase tracking-wider">✨ حدیثِ مبارکہ / HADITH SHARE</span>[یہاں حدیثِ پاک کا ترجمہ و مبارک فرمان درج کریں]</div><p><br></p>`
    );
  };

  const handleInsertHighlightBox = () => {
    insertHTML(
      `<div class="my-3 p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/50 text-amber-200 text-sm font-semibold shadow-inner">💡 <strong>اہم نکات / Important Note:</strong> [یہاں اہم پیغام تحریر کریں]</div><p><br></p>`
    );
  };

  const handleInsertDivider = () => {
    insertHTML(`<hr class="my-5 border-t border-slate-700/80" /><p><br></p>`);
  };

  const handleInsertLink = () => {
    const url = prompt('Enter link URL (e.g., https://example.com):');
    if (url) {
      execCmd('createLink', url);
    }
  };

  // Word & Character Count
  const textOnly = (value || '').replace(/<[^>]*>/g, '').trim();
  const wordCount = textOnly ? textOnly.split(/\s+/).length : 0;
  const charCount = textOnly.length;

  return (
    <div className="w-full space-y-1.5 text-left">
      {/* Label Header */}
      {label && (
        <div className="flex items-center justify-between px-1">
          <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
            <Type size={13} className="text-emerald-400" />
            <span>{label}</span>
          </label>
          <button
            type="button"
            onClick={() => setShowHelpModal(true)}
            className="text-[10px] text-slate-400 hover:text-amber-400 flex items-center gap-1 transition"
          >
            <HelpCircle size={12} />
            <span>Formatting Guide</span>
          </button>
        </div>
      )}

      {/* Main Editor Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg transition-all focus-within:border-emerald-500/70">
        
        {/* TOP TOOLBAR */}
        <div className="bg-slate-950/90 border-b border-slate-800 p-2 flex flex-wrap items-center gap-1.5 select-none">
          
          {/* Text Style Controls */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 gap-0.5">
            <button
              type="button"
              onClick={() => execCmd('bold')}
              title="Bold (CTRL+B)"
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
            >
              <Bold size={15} />
            </button>
            <button
              type="button"
              onClick={() => execCmd('italic')}
              title="Italic (CTRL+I)"
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
            >
              <Italic size={15} />
            </button>
            <button
              type="button"
              onClick={() => execCmd('underline')}
              title="Underline (CTRL+U)"
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
            >
              <Underline size={15} />
            </button>
            <button
              type="button"
              onClick={() => execCmd('strikeThrough')}
              title="Strikethrough"
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
            >
              <Strikethrough size={15} />
            </button>
          </div>

          {/* Heading Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 gap-0.5">
            <button
              type="button"
              onClick={() => execCmd('formatBlock', '<p>')}
              title="Normal Paragraph"
              className="px-2 py-1 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition"
            >
              P
            </button>
            <button
              type="button"
              onClick={() => execCmd('formatBlock', '<h1>')}
              title="Heading 1"
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
            >
              <Heading1 size={15} />
            </button>
            <button
              type="button"
              onClick={() => execCmd('formatBlock', '<h2>')}
              title="Heading 2"
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
            >
              <Heading2 size={15} />
            </button>
            <button
              type="button"
              onClick={() => execCmd('formatBlock', '<h3>')}
              title="Heading 3"
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
            >
              <Heading3 size={15} />
            </button>
          </div>

          {/* Alignment & Direction */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 gap-0.5">
            <button
              type="button"
              onClick={() => execCmd('justifyLeft')}
              title="Align Left"
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
            >
              <AlignLeft size={15} />
            </button>
            <button
              type="button"
              onClick={() => execCmd('justifyCenter')}
              title="Align Center"
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
            >
              <AlignCenter size={15} />
            </button>
            <button
              type="button"
              onClick={() => execCmd('justifyRight')}
              title="Align Right (Urdu)"
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
            >
              <AlignRight size={15} />
            </button>
            <button
              type="button"
              onClick={() => execCmd('justifyFull')}
              title="Justify Text"
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
            >
              <AlignJustify size={15} />
            </button>
            <button
              type="button"
              onClick={() => setDirection(prev => (prev === 'rtl' ? 'ltr' : 'rtl'))}
              title={`Switch Text Direction (Current: ${direction.toUpperCase()})`}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition ${
                direction === 'rtl' 
                  ? 'bg-amber-950/60 border-amber-500/60 text-amber-300' 
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              {direction === 'rtl' ? '🇵🇰 RTL' : '🌐 LTR'}
            </button>
          </div>

          {/* Lists & Quote */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 gap-0.5">
            <button
              type="button"
              onClick={() => execCmd('insertUnorderedList')}
              title="Bullet List"
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
            >
              <List size={15} />
            </button>
            <button
              type="button"
              onClick={() => execCmd('insertOrderedList')}
              title="Numbered List"
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
            >
              <ListOrdered size={15} />
            </button>
            <button
              type="button"
              onClick={() => execCmd('formatBlock', 'blockquote')}
              title="Quote / Blockquote"
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
            >
              <Quote size={15} />
            </button>
          </div>

          {/* Text Color Picker Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              title="Text Color"
              className="p-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 rounded-xl transition flex items-center gap-1"
            >
              <Palette size={15} />
            </button>

            {showColorPicker && (
              <div className="absolute top-full left-0 mt-1.5 z-30 bg-slate-900 border border-slate-700 rounded-xl p-2.5 shadow-2xl space-y-2 w-48 animate-fade-in">
                <span className="text-[10px] font-bold text-slate-400 block border-b border-slate-800 pb-1">Select Text Color</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {textColors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => {
                        execCmd('foreColor', c.value);
                        setShowColorPicker(false);
                      }}
                      title={c.name}
                      className="w-7 h-7 rounded-lg border border-slate-700 hover:scale-110 transition shadow-sm"
                      style={{ backgroundColor: c.value }}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    execCmd('removeFormat');
                    setShowColorPicker(false);
                  }}
                  className="w-full py-1 text-[10px] font-bold text-slate-400 hover:text-white bg-slate-800 rounded-lg transition"
                >
                  Reset Color
                </button>
              </div>
            )}
          </div>

          {/* Links & Clear Formatting */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 gap-0.5">
            <button
              type="button"
              onClick={handleInsertLink}
              title="Insert Hyperlink"
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
            >
              <LinkIcon size={15} />
            </button>
            <button
              type="button"
              onClick={() => execCmd('removeFormat')}
              title="Clear Formatting"
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition text-slate-400 hover:text-red-400"
            >
              <Eraser size={15} />
            </button>
          </div>

          {/* ISLAMIC QUICK PRESETS BUTTON */}
          <div className="relative ml-auto flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowPresetsMenu(!showPresetsMenu)}
              className="px-2.5 py-1.5 bg-gradient-to-r from-emerald-900 to-emerald-800 hover:from-emerald-800 hover:to-emerald-700 text-amber-300 border border-emerald-600/70 rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <Sparkles size={14} className="text-amber-400 animate-pulse" />
              <span>Islamic Blocks 🕌</span>
            </button>

            {showPresetsMenu && (
              <div className="absolute top-full right-0 mt-1.5 z-30 bg-slate-900 border border-emerald-600/60 rounded-2xl p-2 shadow-2xl w-64 space-y-1 animate-fade-in text-right">
                <div className="text-[10px] font-bold text-amber-400 px-2 py-1 border-b border-slate-800 text-left">
                  Quick Islamic Preset Elements
                </div>
                
                <button
                  type="button"
                  onClick={() => { handleInsertBismillah(); setShowPresetsMenu(false); }}
                  className="w-full text-right px-3 py-2 hover:bg-emerald-950/60 text-amber-300 rounded-xl text-xs font-bold transition flex items-center justify-between"
                  dir="rtl"
                >
                  <span className="font-quranic text-sm">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</span>
                  <span className="text-[10px] font-sans text-slate-400">Bismillah</span>
                </button>

                <button
                  type="button"
                  onClick={() => { handleInsertDarood(); setShowPresetsMenu(false); }}
                  className="w-full text-right px-3 py-2 hover:bg-emerald-950/60 text-amber-300 rounded-xl text-xs font-bold transition flex items-center justify-between"
                  dir="rtl"
                >
                  <span className="font-quranic text-sm">صَلَّى ٱللَّٰهُ عَلَيْهِ وَآلِهِ وَسَلَّمَ</span>
                  <span className="text-[10px] font-sans text-slate-400">Darood Pak</span>
                </button>

                <button
                  type="button"
                  onClick={() => { handleInsertQuranBox(); setShowPresetsMenu(false); }}
                  className="w-full text-right px-3 py-2 hover:bg-emerald-950/60 text-emerald-300 rounded-xl text-xs font-bold transition flex items-center justify-between"
                >
                  <span className="font-quranic text-sm">﴿ آیۃ کریمہ باکس ﴾</span>
                  <span className="text-[10px] font-sans text-slate-400">Quran Verse Box</span>
                </button>

                <button
                  type="button"
                  onClick={() => { handleInsertHadithBox(); setShowPresetsMenu(false); }}
                  className="w-full text-right px-3 py-2 hover:bg-emerald-950/60 text-emerald-300 rounded-xl text-xs font-bold transition flex items-center justify-between"
                >
                  <span className="font-nastaliq text-sm">✨ حدیثِ مبارکہ باکس</span>
                  <span className="text-[10px] font-sans text-slate-400">Hadith Box</span>
                </button>

                <button
                  type="button"
                  onClick={() => { handleInsertHighlightBox(); setShowPresetsMenu(false); }}
                  className="w-full text-right px-3 py-2 hover:bg-amber-950/60 text-amber-200 rounded-xl text-xs font-bold transition flex items-center justify-between"
                >
                  <span className="text-xs">💡 اہم نکات (Callout)</span>
                  <span className="text-[10px] font-sans text-slate-400">Highlight Box</span>
                </button>

                <button
                  type="button"
                  onClick={() => { handleInsertDivider(); setShowPresetsMenu(false); }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold transition"
                >
                  ➖ Section Divider Line
                </button>
              </div>
            )}

            {/* Toggle Source HTML View Button */}
            <button
              type="button"
              onClick={() => setIsCodeView(!isCodeView)}
              title={isCodeView ? 'Switch to Visual WYSIWYG Mode' : 'Switch to Raw HTML Code View'}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 border ${
                isCodeView 
                  ? 'bg-amber-500 text-slate-950 border-amber-400' 
                  : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
              }`}
            >
              <Code size={14} />
              <span>{isCodeView ? 'Visual Mode' : 'HTML Code'}</span>
            </button>
          </div>

        </div>

        {/* EDITOR CANVAS AREA */}
        <div className="relative bg-slate-950 p-4">
          {!isCodeView ? (
            <div
              ref={editorRef}
              contentEditable
              onInput={handleEditorInput}
              dir={direction}
              style={{ minHeight }}
              className={`w-full outline-none text-slate-100 text-sm leading-relaxed ${
                isUrdu || direction === 'rtl' ? 'font-nastaliq text-base' : 'font-english'
              } [&_h1]:text-2xl [&_h1]:font-black [&_h1]:text-amber-400 [&_h1]:my-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-emerald-400 [&_h2]:my-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-amber-300 [&_h3]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:border-amber-500 [&_blockquote]:pl-3 [&_blockquote]:py-1 [&_blockquote]:my-3 [&_blockquote]:italic [&_blockquote]:text-slate-300 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_a]:text-emerald-400 [&_a]:underline`}
            />
          ) : (
            <textarea
              rows={8}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="<html>...</html>"
              style={{ minHeight }}
              className="w-full bg-slate-950 text-emerald-400 font-mono text-xs leading-relaxed outline-none p-1 border-none resize-y"
            />
          )}

          {/* Placeholder overlay if empty */}
          {!value && !isCodeView && (
            <div 
              className={`absolute top-4 ${direction === 'rtl' ? 'right-4 text-right font-nastaliq' : 'left-4 text-left font-english'} text-slate-600 text-sm pointer-events-none`}
            >
              {placeholder}
            </div>
          )}
        </div>

        {/* FOOTER STATS BAR */}
        <div className="bg-slate-950/80 border-t border-slate-800/80 px-3 py-1.5 flex items-center justify-between text-[10px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>Words: <strong className="text-slate-200">{wordCount}</strong></span>
            <span>Characters: <strong className="text-slate-200">{charCount}</strong></span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline">Direction: <strong className="text-amber-400 uppercase">{direction}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-medium">
              {isCodeView ? '⚡ Raw HTML Source Editor' : '✨ Rich WYSIWYG Visual Editor'}
            </span>
          </div>
        </div>

      </div>

      {/* Formatting Guide Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                <Sparkles size={16} />
                <span>Islamic Article WYSIWYG Editor Guide</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                This editor allows you to compose beautifully formatted Islamic articles with support for Arabic Quranic verses, Urdu Nastaleeq text, and custom styled boxes.
              </p>
              
              <ul className="space-y-2 list-disc pl-4 text-slate-400">
                <li><strong className="text-amber-300">Islamic Blocks Menu:</strong> Click the <span className="text-amber-300 font-bold">"Islamic Blocks 🕌"</span> button to insert pre-styled Bismillah, Darood Pak, Quranic Verse boxes, and Hadith Callout boxes instantly.</li>
                <li><strong className="text-emerald-300">RTL / LTR Toggle:</strong> Switch between Right-To-Left (for Urdu & Arabic) and Left-To-Right (for English).</li>
                <li><strong className="text-cyan-300">Color Palette:</strong> Highlight sacred titles in Gold (#f59e0b) or Emerald (#10b981).</li>
                <li><strong className="text-white">HTML Source Code Mode:</strong> Toggle <span className="font-mono text-emerald-400">&lt;/&gt; HTML Code</span> to directly inspect or paste raw HTML code.</li>
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition"
              >
                Understood / Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
