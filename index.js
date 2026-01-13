const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

async function convertFile(inputPath) {
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Arquivo de origem não encontrado: ${inputPath}`);
  }

  return await sharp(inputPath)
    .webp({
      lossless: true,
      quality: 100,
      effort: 6,
    })
    .keepMetadata()
    .toBuffer();
}

async function convertPath(inputDir, outputDir) {
  if (!fs.existsSync(inputDir)) {
    throw new Error(`Pasta de origem não encontrada: ${inputDir}`);
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const supportedExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".bmp",
    ".tiff",
    ".gif",
  ];

  const files = fs.readdirSync(inputDir);

  const imageFiles = files.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return supportedExtensions.includes(ext);
  });

  const results = [];

  for (const imageFile of imageFiles) {
    try {
      const inputPath = path.join(inputDir, imageFile);
      const outputFileName = `${path.parse(imageFile).name}.webp`;
      const outputPath = path.join(outputDir, outputFileName);

      const webpBuffer = await convertFile(inputPath);
      fs.writeFileSync(outputPath, webpBuffer);

      results.push({
        success: true,
        input: imageFile,
        output: outputFileName,
        path: outputPath,
      });
    } catch (error) {
      results.push({
        success: false,
        input: imageFile,
        error: error.message,
      });
    }
  }

  return results;
}

module.exports = {
  convertFile,
  convertPath,
};
