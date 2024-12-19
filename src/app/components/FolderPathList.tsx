"use client";

type FolderPathListProps = {
  paths: string[];
  onRemove: (path: string) => Promise<void>;
};

export default function FolderPathList({
  paths,
  onRemove,
}: FolderPathListProps) {
  return (
    <ul className="mb-4">
      {paths.map((path) => (
        <li
          key={path}
          className="flex justify-between items-center bg-gray-100 p-2 mb-2 rounded"
        >
          <span className="text-black">{path}</span>
          <button
            onClick={() => onRemove(path)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
          >
            削除
          </button>
        </li>
      ))}
    </ul>
  );
}
