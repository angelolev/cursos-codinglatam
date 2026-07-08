"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import { Bold as BoldIcon, Italic as ItalicIcon } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        // Disable everything except basic text
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      Bold,
      Italic,
    ],
    content: value || '<p></p>',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm prose-invert max-w-none focus:outline-none min-h-[80px] p-3 text-zinc-100',
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] overflow-hidden">
      {/* Toolbar */}
      <div className="flex gap-1 p-2 border-b border-white/10 bg-white/[0.02]">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded text-zinc-300 hover:bg-white/10 transition-colors ${
            editor.isActive('bold') ? 'bg-white/15 text-white' : ''
          }`}
          title="Bold (⌘B)"
        >
          <BoldIcon size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded text-zinc-300 hover:bg-white/10 transition-colors ${
            editor.isActive('italic') ? 'bg-white/15 text-white' : ''
          }`}
          title="Italic (⌘I)"
        >
          <ItalicIcon size={16} />
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}
