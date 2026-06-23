"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import UnderlineExtension from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
  CheckSquare,
} from "lucide-react";

import { useCallback } from "react";

const lowlight = createLowlight(common);

interface TipTapEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  editable?: boolean;
  placeholder?: string;
  minHeightClass?: string;
}

export default function TipTapEditor({
  content = "",
  onChange,
  editable = true,
  placeholder = "Write something amazing...",
  minHeightClass = "min-h-[500px]",
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-brand-blue underline hover:text-brand-blue/80",
        },
      }),
      UnderlineExtension,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "typescript",
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-invert prose-lg max-w-none focus:outline-none ${minHeightClass} px-4 py-3`,
      },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Enter image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addTable = useCallback(() => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-surface-border rounded-2xl bg-surface-card overflow-hidden">
      {editable && (
        <div className="border-b border-surface-border bg-surface-elevated p-2 flex flex-wrap gap-1 sticky top-0 z-10">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            icon={<Bold className="w-4 h-4" />}
            title="Bold"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            icon={<Italic className="w-4 h-4" />}
            title="Italic"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
            icon={<Underline className="w-4 h-4" />}
            title="Underline"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
            icon={<Strikethrough className="w-4 h-4" />}
            title="Strikethrough"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive("code")}
            icon={<Code className="w-4 h-4" />}
            title="Code"
          />

          <div className="w-px h-6 bg-surface-border mx-1" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            active={editor.isActive("heading", { level: 1 })}
            icon={<Heading1 className="w-4 h-4" />}
            title="Heading 1"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive("heading", { level: 2 })}
            icon={<Heading2 className="w-4 h-4" />}
            title="Heading 2"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive("heading", { level: 3 })}
            icon={<Heading3 className="w-4 h-4" />}
            title="Heading 3"
          />

          <div className="w-px h-6 bg-surface-border mx-1" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            icon={<List className="w-4 h-4" />}
            title="Bullet List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            icon={<ListOrdered className="w-4 h-4" />}
            title="Ordered List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            active={editor.isActive("taskList")}
            icon={<CheckSquare className="w-4 h-4" />}
            title="Task List"
          />

          <div className="w-px h-6 bg-surface-border mx-1" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
            icon={<Quote className="w-4 h-4" />}
            title="Quote"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive("codeBlock")}
            icon={<Code className="w-4 h-4" />}
            title="Code Block"
          />

          <div className="w-px h-6 bg-surface-border mx-1" />

          <ToolbarButton
            onClick={setLink}
            active={editor.isActive("link")}
            icon={<LinkIcon className="w-4 h-4" />}
            title="Link"
          />
          <ToolbarButton
            onClick={addImage}
            icon={<ImageIcon className="w-4 h-4" />}
            title="Image"
          />
          <ToolbarButton
            onClick={addTable}
            icon={<TableIcon className="w-4 h-4" />}
            title="Table"
          />

          <div className="w-px h-6 bg-surface-border mx-1" />

          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            active={editor.isActive({ textAlign: "left" })}
            icon={<AlignLeft className="w-4 h-4" />}
            title="Align Left"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            active={editor.isActive({ textAlign: "center" })}
            icon={<AlignCenter className="w-4 h-4" />}
            title="Align Center"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            active={editor.isActive({ textAlign: "right" })}
            icon={<AlignRight className="w-4 h-4" />}
            title="Align Right"
          />

          <div className="w-px h-6 bg-surface-border mx-1" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            active={editor.isActive("highlight")}
            icon={<Highlighter className="w-4 h-4" />}
            title="Highlight"
          />

          <div className="w-px h-6 bg-surface-border mx-1" />

          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            icon={<Undo className="w-4 h-4" />}
            title="Undo"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            icon={<Redo className="w-4 h-4" />}
            title="Redo"
          />
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({
  onClick,
  active,
  icon,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-colors ${
        active
          ? "bg-brand-blue text-white"
          : "text-surface-muted hover:text-white hover:bg-white/[0.1]"
      }`}
    >
      {icon}
    </button>
  );
}
