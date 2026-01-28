import fs from "fs";
import path from "path";
import { fromPath } from "pdf2pic";

export const convertPdfBufferToImage = async (buffer) => {
  const tempDir = path.join(process.cwd(), "temp");

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const pdfPath = path.join(tempDir, `temp-${Date.now()}.pdf`);
  fs.writeFileSync(pdfPath, buffer);

  const converter = fromPath(pdfPath, {
    density: 150,
    saveFilename: "page",
    savePath: tempDir,
    format: "png",
    width: 800,
    height: 1000,
  });

  const result = await converter(1); // first page only

  const imagePath = result.path;
  const imageBuffer = fs.readFileSync(imagePath);

  fs.unlinkSync(pdfPath);
  fs.unlinkSync(imagePath);

  return imageBuffer;
};
