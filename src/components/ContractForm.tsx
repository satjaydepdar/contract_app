import React from 'react';
import { FileText, Send, User } from 'lucide-react';

interface ContractFormProps {
  onSubmit: (data: FormData) => void;
}

export default function ContractForm({ onSubmit }: ContractFormProps) {
  const [content, setContent] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Contract Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="input-primary mt-1"
            placeholder="Enter contract title"
          />
        </div>
        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-700">
            Contract Value
          </label>
          <div className="mt-1 relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              $
            </span>
            <input
              type="number"
              id="value"
              name="value"
              required
              min="0"
              step="0.01"
              className="input-primary pl-7"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            required
            className="input-primary mt-1"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label htmlFor="reviewer" className="block text-sm font-medium text-gray-700">
            Assign Reviewer
          </label>
          <select
            id="reviewer"
            name="reviewer"
            required
            className="input-primary mt-1"
          >
            <option value="john">John Smith</option>
            <option value="jane">Jane Doe</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Contract Content
        </label>
        <div className="mt-1">
          <textarea
            id="content"
            name="content"
            rows={8}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="input-primary"
            placeholder="Enter or paste contract content here..."
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button type="button" className="btn-secondary flex items-center">
          <FileText className="w-4 h-4 mr-2" />
          Upload Document
        </button>
        <button type="submit" className="btn-primary flex items-center">
          <Send className="w-4 h-4 mr-2" />
          Submit for Review
        </button>
      </div>
    </form>
  );
}