import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(request: NextRequest) {
  const imagePath = request.nextUrl.searchParams.get("path");

  if (!imagePath) {
    return new NextResponse("Image path is required", { status: 400 });
  }

  try {
    await fs.access(imagePath, fs.constants.R_OK);
    const imageBuffer = await fs.readFile(imagePath);
    const contentType = getContentType(path.extname(imagePath));

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error reading image:", error);
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return new NextResponse(`File not found: ${imagePath}`, { status: 404 });
    }
    return new NextResponse(
      `Error reading image: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      { status: 500 }
    );
  }
}

function getContentType(extension: string): string {
  switch (extension.toLowerCase()) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".gif":
      return "image/gif";
    default:
      return "application/octet-stream";
  }
}
