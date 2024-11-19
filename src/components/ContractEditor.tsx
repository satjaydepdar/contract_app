import React, { useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Strike from '@tiptap/extension-strike';
import { Save, Upload, FileText, Bold, Italic, List, ListOrdered, Heading, Table as TableIcon, Strikethrough, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import mammoth from 'mammoth';

interface Comment {
  id: string;
  text: string;
  position: { x: number; y: number };
}

const MenuBar = ({ editor, onRedline }: { editor: any; onRedline: () => void }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border-b border-gray-200 p-2 space-x-2 flex flex-wrap">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-100' : ''}`}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-100' : ''}`}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-100' : ''}`}
        title="Heading"
      >
        <Heading className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-gray-100' : ''}`}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('orderedList') ? 'bg-gray-100' : ''}`}
        title="Ordered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        className="p-2 rounded hover:bg-gray-100"
        title="Insert Table"
      >
        <TableIcon className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-gray-200 mx-2" />
      <button
        onClick={() => {
          editor.chain().focus().toggleStrike().run();
          onRedline();
        }}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('strike') ? 'bg-red-100 text-red-600' : ''}`}
        title="Redline (Strikethrough)"
      >
        <Strikethrough className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function ContractEditor() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentPosition, setCommentPosition] = useState({ x: 0, y: 0 });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Strike,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    try {
      if (file.name.endsWith('.docx')) {
        // Handle DOCX files
        reader.onload = async function() {
          if (reader.result instanceof ArrayBuffer) {
            const result = await mammoth.convertToHtml({ arrayBuffer: reader.result });
            editor?.commands.setContent(result.value);
            toast.success('Document loaded successfully');
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        // Handle other text files
        reader.onload = function() {
          if (typeof reader.result === 'string') {
            editor?.commands.setContent(reader.result);
            toast.success('Document loaded successfully');
          }
        };
        reader.readAsText(file);
      }
    } catch (error) {
      console.error('Error reading file:', error);
      toast.error('Error loading document');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    if (!editor) return;

    const content = editor.getHTML();
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    if (downloadLinkRef.current) {
      downloadLinkRef.current.href = url;
      downloadLinkRef.current.download = fileName || 'contract-draft.html';
      downloadLinkRef.current.click();
      URL.revokeObjectURL(url);
      toast.success('Draft saved successfully');
    }
  };

  const handleRedline = () => {
    if (editor?.isActive('strike')) {
      const { top, left } = editor.view.dom.getBoundingClientRect();
      const selection = editor.view.state.selection;
      const { from } = selection;
      const pos = editor.view.coordsAtPos(from);
      
      setCommentPosition({
        x: pos.left - left + 20,
        y: pos.top - top + 20,
      });
      setShowCommentInput(true);
    }
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      const newComment: Comment = {
        id: Date.now().toString(),
        text: commentText,
        position: commentPosition,
      };
      setComments([...comments, newComment]);
      setCommentText('');
      setShowCommentInput(false);
      toast.success('Comment added');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-gray-900">Contract Editor</h2>
          {fileName && (
            <span className="text-sm text-gray-500 flex items-center">
              <FileText className="w-4 h-4 mr-1" />
              {fileName}
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.html,.docx"
            className="hidden"
          />
          <a ref={downloadLinkRef} className="hidden" />
          <button
            onClick={handleUploadClick}
            className="px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors flex items-center"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </button>
        </div>
      </div>

      <MenuBar editor={editor} onRedline={handleRedline} />

      <div className="p-4 relative">
        <div className="border rounded-lg focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent relative">
          <EditorContent editor={editor} />
          
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="absolute bg-yellow-100 p-2 rounded shadow-sm border border-yellow-200 max-w-xs"
              style={{ left: comment.position.x, top: comment.position.y }}
            >
              <div className="flex items-start space-x-2">
                <MessageSquare className="w-4 h-4 text-yellow-600 mt-1 flex-shrink-0" />
                <p className="text-sm text-gray-700">{comment.text}</p>
              </div>
            </div>
          ))}

          {showCommentInput && (
            <div
              className="absolute bg-white p-2 rounded shadow-lg border border-gray-200"
              style={{ left: commentPosition.x, top: commentPosition.y }}
            >
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="w-64 h-24 p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => setShowCommentInput(false)}
                  className="px-2 py-1 text-sm text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddComment}
                  className="px-2 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Add Comment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}