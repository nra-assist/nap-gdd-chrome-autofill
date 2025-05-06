import React, { useState } from "react";
import { FaTrashCan } from "react-icons/fa6";

interface FileDropProps {
  onFileChange: (file: File | null) => void;
  maxFileSize?: number;
}

const FileDrop: React.FC<FileDropProps> = ({ onFileChange, maxFileSize = 50 * 1024 * 1024 }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const processFile = (selectedFile: File | null) => {
    if (!selectedFile) return;

    if (selectedFile.size > maxFileSize) {
      setError(`Файлът е твърде голям. Максимум ${maxFileSize / 1024 / 1024} MB.`);
      setFile(null);
      onFileChange(null);
    } else {
      setError(null);
      setFile(selectedFile);
      onFileChange(selectedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    e.target.value = "";
    processFile(selectedFile);
  };

  const handleRemove = () => {
    setFile(null);
    setError(null);
    onFileChange(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files?.[0] || null;
    processFile(droppedFile);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-full rounded border-1 ${
        dragOver ? "border-blue-500 bg-blue-50 dark:bg-blue-900" : "border-dashed border-gray-300 dark:border-gray-500"
      } transition-colors`}
    >
      {!file ? (
        <label
          htmlFor="file-input"
          className="flex w-full cursor-pointer flex-row items-center justify-center gap-2 p-2 text-center"
        >
          <span className="text-sm text-gray-500 dark:text-gray-300">Дръпни и пусни файл или натисни тук</span>
          <input id="file-input" type="file" className="hidden" onChange={handleFileChange} />
        </label>
      ) : (
        <div className="flex items-center justify-between p-2">
          <span className="max-w-[400px] truncate text-sm text-gray-800 dark:text-gray-200">{file.name}</span>
          <button
            type="button"
            onClick={handleRemove}
            className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
            title="Премахни файла"
          >
            <FaTrashCan className="text-red-600 dark:text-red-400" size="12" />
          </button>
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default FileDrop;
