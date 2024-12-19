"use client";

import { useState } from "react";

type FolderPathInputProps = {
  onAdd: (path: string) => Promise<void>;
};

export default function FolderPathInput({ onAdd }: FolderPathInputProps) {
  const [path, setPath] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (path.trim()) {
      await onAdd(path.trim());
      setPath("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        value={path}
        onChange={(e) => setPath(e.target.value)}
        placeholder="フォルダーパスを入力"
        className="flex-grow border border-gray-300 rounded px-2 py-1 text-black"
      />
      <button
        type="submit"
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded"
      >
        追加
      </button>
    </form>
  );
}
