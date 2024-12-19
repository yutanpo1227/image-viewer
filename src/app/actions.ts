"use server";

import fs from "fs/promises";
import path from "path";

let folderPaths: string[] = [];

export async function getFolderPaths() {
  return folderPaths;
}

export async function addFolderPath(newPath: string) {
  try {
    await fs.access(newPath, fs.constants.R_OK);
    const stats = await fs.stat(newPath);
    if (stats.isDirectory() && !folderPaths.includes(newPath)) {
      folderPaths.push(newPath);
    } else if (!stats.isDirectory()) {
      throw new Error(`指定されたパスはディレクトリではありません: ${newPath}`);
    }
  } catch (error) {
    console.error(`フォルダーにアクセスできません: ${newPath}`, error);
    throw new Error(`フォルダーにアクセスできません: ${newPath}`);
  }
}

export async function removeFolderPath(pathToRemove: string) {
  folderPaths = folderPaths.filter((path) => path !== pathToRemove);
}

export async function getImagePairs() {
  if (folderPaths.length === 0) {
    return {};
  }

  const imageGroups: { [filename: string]: string[] } = {};

  for (const folderPath of folderPaths) {
    try {
      const files = await fs.readdir(folderPath);
      for (const file of files) {
        if (file.match(/\.(jpg|jpeg|png|gif)$/i)) {
          const fullPath = path.join(folderPath, file);
          try {
            await fs.access(fullPath, fs.constants.R_OK);
            if (!imageGroups[file]) {
              imageGroups[file] = [];
            }
            imageGroups[file].push(fullPath);
          } catch (error) {
            console.error(`ファイルにアクセスできません: ${fullPath}`, error);
          }
        }
      }
    } catch (error) {
      console.error(
        `ディレクトリの読み取り中にエラーが発生しました ${folderPath}:`,
        error
      );
    }
  }

  return imageGroups;
}
