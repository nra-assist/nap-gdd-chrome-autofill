import { useRef, useState } from "react";
import { fillDeclaration } from "../components/declaration/fill-declaration.tsx";
import FileDrop, {FileDropRef} from "../components/file-drop/file-drop.tsx";

export default function DeclarationFillerPage() {
  const [files, setFiles] = useState<File[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileDropRef = useRef<FileDropRef>(null);

  const handleClick = async () => {
    if (!files) return;
    await fillDeclaration(files, clearUploadedFile, setIsProcessing);
  };

  function clearUploadedFile() {
    fileDropRef.current?.clearFiles();
  }

  return (
    <div className="flex flex-col gap-2 p-2">
      <FileDrop ref={fileDropRef} onFilesChange={setFiles} />
      <div className="flex flex-col items-center">
        <button
          onClick={handleClick}
          disabled={isProcessing || !files}
          className={`max-w-[400px] min-w-[250px] rounded-sm px-4 py-1.5 text-sm font-medium text-white md:w-1/3 ${isProcessing ? "bg-gray-500 opacity-50" : !files ? "bg-gray-400" : "cursor-pointer bg-indigo-600 dark:bg-indigo-700"} ${!isProcessing && files ? "hover:bg-indigo-700 dark:hover:bg-indigo-600" : ""}`}
          aria-live="polite"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <svg
                className="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
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
              Попълване...
            </div>
          ) : (
            "Попълни декларацията"
          )}
        </button>
      </div>
    </div>
  );
}
