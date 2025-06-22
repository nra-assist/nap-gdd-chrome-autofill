import React, { forwardRef, useImperativeHandle, useState } from "react";
import { FaTrashCan } from "react-icons/fa6";
import { FaFileUpload } from "react-icons/fa";

interface FileDropProps {
  onFilesChange: (files: File[]) => void;
  maxFileSize?: number;
  maxFileCount?: number;
}

export interface FileDropRef {
  clearFiles: () => void;
}

const FileDrop = forwardRef<FileDropRef, FileDropProps>(
  ({ onFilesChange, maxFileSize = 50 * 1024 * 1024, maxFileCount = 20 }, ref) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      clearFiles,
    }));

    const handleDragEnter = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const relatedTarget = e.relatedTarget as HTMLElement | null;
      if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
        setIsDragging(false);
      }
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const droppedFiles = Array.from(e.dataTransfer.files);
        addFiles(droppedFiles);
        e.dataTransfer.clearData();
      }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const selectedFiles = Array.from(e.target.files);
        addFiles(selectedFiles);
        e.target.value = "";
      }
    };

    const clearFiles = () => {
      setFiles([]);
      setErrorMessage(null);
      onFilesChange([]);
    };

    const addFiles = (newFiles: File[]) => {
      setErrorMessage(null);

      if (files.length + newFiles.length > maxFileCount) {
        setErrorMessage(`Не може да качвате повече от ${maxFileCount} файла.`);
        return;
      }

      const validFiles = newFiles.filter((file) => file.size <= maxFileSize);
      const invalidFiles = newFiles.filter((file) => file.size > maxFileSize);

      if (invalidFiles.length > 0) {
        setErrorMessage(
          `Следните файлове надвишават ограничението от ${
            maxFileSize / 1024 / 1024
          } MB и няма да бъдат изпратени: ${invalidFiles.map((file) => file.name).join(", ")}`,
        );
      }

      const updatedFiles = [
        ...files,
        ...validFiles.filter((newFile) => !files.some((file) => file.name === newFile.name)),
      ];

      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
    };

    const handleRemoveFile = (fileName: string) => {
      setErrorMessage(null);
      const updatedFiles = files.filter((file) => file.name !== fileName);
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
    };

    return (
      <div>
        <div
          className={`w-full rounded border border-dashed border-gray-300 bg-gray-50 dark:border-gray-400 dark:bg-gray-900 ${
            isDragging ? "bg-gray-700" : ""
          }`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <label
            htmlFor="file-input"
            className="flex cursor-pointer flex-col items-center justify-center gap-1 py-6 text-center"
          >
            <FaFileUpload className="text-gray-500 dark:text-gray-300" size="24" />
            <p className="text-sm text-gray-500 dark:text-gray-300">Дръпни и пусни файлове или натисни тук</p>
            <input id="file-input" type="file" className="hidden" multiple onChange={handleFileInputChange} />
          </label>
        </div>

        {errorMessage && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errorMessage}</p>}

        {files.length > 0 && (
          <div className="mt-5 max-h-[500px] overflow-hidden rounded-lg border border-gray-300 p-2 transition-all duration-700 ease-in-out dark:border-gray-700">
            <div className="mb-1 flex items-center justify-between pr-2">
              <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">Прикачени файлове</h3>
              <button
                type="button"
                onClick={clearFiles}
                className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full p-1 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <FaTrashCan className="text-red-600 dark:text-red-400" size="12" />
              </button>
            </div>

            <hr className="mb-2 border-gray-300 dark:border-gray-700" />

            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.lastModified || file.name}
                  className="flex items-center justify-between rounded-sm bg-gray-100 p-2 dark:bg-gray-700"
                >
                  <span className="text-sm text-gray-800 dark:text-gray-200">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(file.name)}
                    className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    <FaTrashCan className="text-red-600 dark:text-red-400" size="12" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
);

FileDrop.displayName = "FileDrop";

export default FileDrop;
