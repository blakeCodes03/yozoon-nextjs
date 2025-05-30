import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
}

const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const [fileDetails, setFileDetails] = useState<{
    name: string;
    size: number;
    type: string;
  } | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setFileDetails({
          name: file.name,
          size: file.size,
          type: file.type,
        });
      }
      onFileUpload(acceptedFiles);
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.svg', '.gif'],
    },
    maxSize: 2 * 1024 * 1024, // 2 MB
    maxFiles: 1, // Limit to one file at a time,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors',
        isDragActive
          ? 'border-chatbot-primary bg-blue-50'
          : 'border-gray-300 hover:border-gray-400'
      )}
    >
      <input {...getInputProps()} />
      <Upload className="w-3 h-3 mx-auto mb-2 text-gray-400" />
      <p className="text-sm text-gray-500">
        {isDragActive
          ? 'Drop files here...'
          : 'Drag & drop files here, or click to select. Max size: 2MB'}
      </p>
      {fileDetails && (
        <div className="mt-4">
          <p className="text-sm text-gray-700">
            {fileDetails.name} ({(fileDetails.size / 1024).toFixed(2)} KB)
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
