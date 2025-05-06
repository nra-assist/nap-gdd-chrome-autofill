import FileDrop from "../components/file-drop/file-drop.tsx";

export default function HoldingsPage() {
  return (
    <div className="p-6 text-xl">
      Притежавани акции (Holdings Page)
      <FileDrop onFileChange={() => {}} />
    </div>
  );
}
