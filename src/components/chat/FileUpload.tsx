import React, { useCallback, useState } from 'react';
import { FileUp } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import type { UploadedFile } from '../../types/chat';
import toast from 'react-hot-toast';

interface FileUploadProps {
  onFileUpload: (file: UploadedFile) => void;
}

export default function FileUpload({ onFileUpload }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Create a serializable file object
      const uploadedFile: UploadedFile = {
        id: Date.now().toString(), // Use timestamp string
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        path: file.name, // Use filename as path for demo
        lastModified: new Date(file.lastModified).toISOString()
      };

      onFileUpload(uploadedFile);
      toast.success('Document uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    multiple: false,
    disabled: isUploading
  });

  return (
    <div className="p-4 border-t border-gray-200">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isUploading ? 'opacity-50 cursor-not-allowed' :
          isDragActive ? 'border-purple-500 bg-purple-50' :
          'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
        }`}
      >
        <input {...getInputProps()} />
        <FileUp className="w-8 h-8 mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-gray-600">
          {isUploading ? 'Uploading...' :
           isDragActive ? 'Drop your document here...' :
           'Drag & drop your document here, or click to select'}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Supported formats: PDF, DOC, DOCX, TXT
        </p>
      </div>
    </div>
  );
}