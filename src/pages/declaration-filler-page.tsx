import { useRef, useState } from "react";
import {
  fillDeclaration,
  fillPart3Only,
  fillApp5Only,
  fillApp6Only,
  fillApp8Only,
  fillApp13Only,
} from "../components/declaration/fill-declaration.tsx";
import FileDrop, {FileDropRef} from "../components/file-drop/file-drop.tsx";

interface ButtonConfig {
  label: string;
  handler: () => Promise<void>;
  variant: "primary" | "secondary";
}

export default function DeclarationFillerPage() {
  const [files, setFiles] = useState<File[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileDropRef = useRef<FileDropRef>(null);

  function clearUploadedFile() {
    fileDropRef.current?.clearFiles();
  }

  const handleFillAll = async () => {
    if (!files) return;
    await fillDeclaration(files, clearUploadedFile, setIsProcessing);
  };

  const handleFillPart3 = async () => {
    if (!files) return;
    await fillPart3Only(files, setIsProcessing);
  };

  const handleFillApp5 = async () => {
    if (!files) return;
    await fillApp5Only(files, setIsProcessing);
  };

  const handleFillApp6 = async () => {
    if (!files) return;
    await fillApp6Only(files, setIsProcessing);
  };

  const handleFillApp8 = async () => {
    if (!files) return;
    await fillApp8Only(files, setIsProcessing);
  };

  const handleFillApp13 = async () => {
    if (!files) return;
    await fillApp13Only(files, setIsProcessing);
  };

  const buttons: ButtonConfig[] = [
    { label: "Част 3", handler: handleFillPart3, variant: "secondary" },
    { label: "Приложение 5", handler: handleFillApp5, variant: "secondary" },
    { label: "Приложение 6", handler: handleFillApp6, variant: "secondary" },
    { label: "Приложение 8", handler: handleFillApp8, variant: "secondary" },
    { label: "Приложение 13", handler: handleFillApp13, variant: "secondary" },
    { label: "Попълни всички", handler: handleFillAll, variant: "primary" },
  ];

  const getButtonClasses = (variant: "primary" | "secondary", disabled: boolean) => {
    const baseClasses = "w-full rounded-sm px-3 py-1.5 text-xs font-medium transition-colors";

    if (disabled) {
      return `${baseClasses} bg-gray-400 text-white cursor-not-allowed opacity-50`;
    }

    if (variant === "primary") {
      return `${baseClasses} bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600`;
    }

    return `${baseClasses} bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700`;
  };

  return (
    <div className="flex flex-col gap-3 p-2">
      <FileDrop ref={fileDropRef} onFilesChange={setFiles} />

      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          {buttons.map((btn) => (
            <button
              key={btn.label}
              onClick={btn.handler}
              disabled={isProcessing || !files}
              className={getButtonClasses(btn.variant, isProcessing || !files)}
            >
              {isProcessing && btn.label === "Попълни всички" ? (
                <span className="flex items-center justify-center gap-1">
                  <svg
                    className="h-3 w-3 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  ...
                </span>
              ) : (
                btn.label
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
