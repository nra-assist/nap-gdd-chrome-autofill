import FileDrop from "../components/file-drop/file-drop.tsx";
import FillHoldingsButton from "../components/fill/fill-holdings-button.tsx";
import { useState } from "react";

export default function HoldingsPage() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="flex flex-col gap-2 p-2">
      <FileDrop onFileChange={setFile} />
      <FillHoldingsButton file={file} />
    </div>
  );
}
