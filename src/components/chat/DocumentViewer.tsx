import React, { useState, useCallback } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, FileText, Download, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import type { UploadedFile } from '../../types/chat';
import DocumentPreview from './DocumentPreview';

interface DocumentViewerProps {
  file: UploadedFile;
  isOpen: boolean;
  onToggle: () => void;
}

export default function DocumentViewer({ file, isOpen, onToggle }: DocumentViewerProps) {
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale(prev => Math.min(Math.max(0.5, prev + delta), 3));
    }
  }, []);

  const resetView = useCallback(() => {
    setScale(1);
  }, []);

  const renderPreview = () => {
    if (!file.previewUrl) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>Preview not available for this file type</p>
        </div>
      );
    }

    return (
      <DocumentPreview
        file={file}
        scale={scale}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
      />
    );
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white h-full flex flex-col">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-purple-600" />
          <span className="font-medium text-purple-900">{file.name}</span>
          <span className="text-sm text-purple-700">
            ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-purple-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-purple-600" />
        )}
      </button>

      {isOpen && (
        <div className="flex-1 flex flex-col min-h-0">
          <div 
            className="flex-1 overflow-hidden relative"
            onWheel={handleWheel}
          >
            {renderPreview()}
          </div>
          
          <div className="p-3 bg-gray-50 border-t flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Zoom: {Math.round(scale * 100)}%</span>
              <button
                onClick={() => setScale(prev => Math.min(prev + 0.1, 3))}
                className="p-1 hover:bg-gray-100 rounded"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setScale(prev => Math.max(prev - 0.1, 0.5))}
                className="p-1 hover:bg-gray-100 rounded"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={resetView}
                className="p-1 hover:bg-gray-100 rounded"
                title="Reset View"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center space-x-4">
              {file.previewUrl && (
                <>
                  <a
                    href={file.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-purple-600 hover:text-purple-700"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Open
                  </a>
                  <a
                    href={file.previewUrl}
                    download={file.name}
                    className="flex items-center text-purple-600 hover:text-purple-700"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}