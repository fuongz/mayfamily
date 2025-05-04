const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp"];

/**
 * Scans all files in the gallery directory and its subdirectories
 * @returns An array of file paths relative to the gallery directory
 */
export function scanGalleryFiles(): Array<{
  folder: string;
  file_url: string;
  filename: string;
  id: string;
}> {
  const galleryDir = Deno.cwd() + "/public/images/gallery";
  return scanDirectory(galleryDir, galleryDir);
}

/**
 * Recursively scans a directory and its subdirectories for files
 * @param dir The directory to scan
 * @param baseDir The base directory to make paths relative to
 * @returns An array of file paths relative to the base directory
 */
function scanDirectory(
  dir: string,
  baseDir: string
): Array<{
  folder: string;
  file_url: string;
  filename: string;
  id: string;
}> {
  const files: Array<{
    folder: string;
    file_url: string;
    filename: string;
    id: string;
  }> = [];

  for (const entry of Deno.readDirSync(dir)) {
    const itemPath = `${dir}/${entry.name}`;

    if (entry.isDirectory) {
      files.push(...scanDirectory(itemPath, baseDir));
    } else if (
      IMAGE_EXTENSIONS.includes(itemPath.toLowerCase().split(".").pop() ?? "")
    ) {
      const relativePath = itemPath.substring(baseDir.length + 1);
      const folderName = relativePath.split("/")[0] ?? "";
      const uuid = crypto.randomUUID();
      files.push({
        folder: folderName,
        file_url: "https://cdn.trinhvaphuong.com/" + relativePath,
        filename: entry.name,
        id: uuid,
      });
    }
  }

  return files;
}

async function main() {
  const files = scanGalleryFiles();

  const homeImages = files.filter((file) => file.folder === "home");
  const galleryImages = files.filter((file) => file.folder !== "home");

  // Export file json file minified
  Deno.writeTextFileSync("gallery.json", JSON.stringify(galleryImages));
  Deno.writeTextFileSync("home.json", JSON.stringify(homeImages));
}

main();
