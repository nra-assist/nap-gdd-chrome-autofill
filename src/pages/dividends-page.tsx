import FileDrop from "../components/file-drop/file-drop.tsx";
import { useState } from "react";
import FillDividendsButton from "../components/fill/fill-dividends-button.tsx";

export default function DividendsPage() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="flex flex-col gap-2 p-2">
      <FileDrop onFileChange={setFile} />
      <FillDividendsButton file={file} />
    </div>
  );
}
