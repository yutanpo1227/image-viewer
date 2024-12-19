"use client";

import { useState, useEffect } from "react";
import FolderPathInput from "@/app/components/FolderPathInput";
import FolderPathList from "@/app/components/FolderPathList";
import ImageDisplay from "@/app/components/ImageDisplay";
import { getFolderPaths, addFolderPath, removeFolderPath } from "@/app/actions";

export default function Home() {
  const [folderPaths, setFolderPaths] = useState<string[]>([]);
  const [showImages, setShowImages] = useState(false);
  const [triggerFetch, setTriggerFetch] = useState(0);

  useEffect(() => {
    const fetchFolderPaths = async () => {
      const paths = await getFolderPaths();
      setFolderPaths(paths);
    };
    fetchFolderPaths();
  }, []);

  const handleAddPath = async (path: string) => {
    await addFolderPath(path);
    const updatedPaths = await getFolderPaths();
    setFolderPaths(updatedPaths);
  };

  const handleRemovePath = async (path: string) => {
    await removeFolderPath(path);
    const updatedPaths = await getFolderPaths();
    setFolderPaths(updatedPaths);
  };

  const handleShowImages = () => {
    setShowImages(true);
    setTriggerFetch((prev) => prev + 1);
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Image Viewer</h1>
      <FolderPathInput onAdd={handleAddPath} />
      <FolderPathList paths={folderPaths} onRemove={handleRemovePath} />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        onClick={handleShowImages}
      >
        画像を{showImages ? "再" : ""}表示
      </button>
      {showImages && (
        <ImageDisplay folderPaths={folderPaths} triggerFetch={triggerFetch} />
      )}
    </main>
  );
}
