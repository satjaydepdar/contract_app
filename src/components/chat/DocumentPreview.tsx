import React, { useCallback, useRef, useEffect, useState } from 'react';
import type { UploadedFile } from '../../types/chat';

interface DocumentPreviewProps {
  file: UploadedFile;
  scale: number;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export default function DocumentPreview({ file, scale, onDragStart, onDragEnd }: DocumentPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;

    setIsDragging(true);
    onDragStart?.();

    const rect = containerRef.current.getBoundingClientRect();
    dragRef.current = {
      x: e.clientX - (position.x + rect.left),
      y: e.clientY - (position.y + rect.top)
    };
  }, [position, onDragStart]);

  const handleDrag = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const newX = e.clientX - dragRef.current.x - rect.left;
    const newY = e.clientY - dragRef.current.y - rect.top;

    setPosition({ x: newX, y: newY });
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    onDragEnd?.();
  }, [onDragEnd]);

  useEffect(() => {
    const handleMouseUp = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };

    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [isDragging, handleDragEnd]);

  const transform = `translate(${position.x}px, ${position.y}px) scale(${scale})`;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      onMouseDown={handleDragStart}
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div
        style={{
          position: 'absolute',
          transform,
          transformOrigin: '0 0',
          transition: isDragging ? 'none' : 'transform 0.1s',
          width: '100%',
          height: '100%',
        }}
      >
        <iframe
          src={file.previewUrl}
          className="w-full h-full border-none bg-white"
          title={file.name}
          style={{ pointerEvents: 'none' }}
        />
      </div>
    </div>
  );
}