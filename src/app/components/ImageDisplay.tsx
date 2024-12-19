"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { getImagePairs } from "@/app/actions";

type ImageDisplayProps = {
  folderPaths: string[];
  triggerFetch: number;
};

type ImageGroups = {
  [filename: string]: string[];
};

export default function ImageDisplay({
  folderPaths,
  triggerFetch,
}: ImageDisplayProps) {
  const [imageGroups, setImageGroups] = useState<ImageGroups>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImagePairs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const pairs = await getImagePairs();
        setImageGroups(pairs);
      } catch (error) {
        console.error("画像の取得中にエラーが発生しました:", error);
        setError("画像の取得中にエラーが発生しました。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchImagePairs();
  }, [triggerFetch]);

  if (isLoading) {
    return <div className="mt-8 text-center">画像を読み込み中...</div>;
  }

  if (error) {
    return <div className="mt-8 text-center text-red-500">{error}</div>;
  }

  if (Object.keys(imageGroups).length === 0) {
    return <div className="mt-8 text-center">表示する画像がありません。</div>;
  }

  return (
    <div className="mt-8">
      {Object.entries(imageGroups).map(([filename, paths]) => (
        <div key={filename} className="mb-8">
          <h3 className="text-xl font-bold mb-2">{filename}</h3>
          <div className="flex gap-4 overflow-x-auto">
            {paths.map((path, index) => (
              <div key={index} className="flex-shrink-0">
                <ImageWithFallback
                  src={`/api/image?path=${encodeURIComponent(path)}`}
                  alt={`${filename} from ${path}`}
                  width={200}
                  height={200}
                  className="border border-gray-300 rounded"
                />
                <p className="text-sm text-center mt-1">{path}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ImageWithFallback({
  src,
  alt,
  ...props
}: React.ComponentProps<typeof Image>) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        {...props}
        className="flex items-center justify-center bg-gray-200 text-gray-500"
      >
        画像を読み込めません
      </div>
    );
  }

  return (
    <Image src={src} alt={alt} {...props} onError={() => setError(true)} />
  );
}
