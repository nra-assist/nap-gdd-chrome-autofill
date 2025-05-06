import React, { useState } from "react";
import { FaUpload } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";

interface FileDropProps {
  onFileChange: (file: File | null) => void;
  maxFileSize?: number; // Default: 50MB
}

const FileDrop: React.FC<FileDropProps> = ({ onFileChange, maxFileSize = 50 * 1024 * 1024 }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    e.target.value = "";

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

  const handleRemove = () => {
    setFile(null);
    setError(null);
    onFileChange(null);
  };

  return (
    <div className="w-full">
      <label
        htmlFor="file-input"
        className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded border border-dashed border-gray-300 bg-gray-50 py-6 text-center dark:border-gray-400 dark:bg-gray-900"
      >
        <FaUpload className="mb-2 text-gray-500 dark:text-gray-300" />
        <p className="text-sm text-gray-500 dark:text-gray-300">Дръпни и пусни файл или натисни тук</p>
        <input id="file-input" type="file" className="hidden" onChange={handleFileChange} />
      </label>

      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}

      {file && (
        <div className="mt-4 flex items-center justify-between rounded bg-gray-100 p-2 dark:bg-gray-700">
          <span className="text-sm text-gray-800 dark:text-gray-200">{file.name}</span>
          <button
            type="button"
            onClick={handleRemove}
            className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            <FaTrashCan className="text-gray-600 dark:text-gray-200" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileDrop;
