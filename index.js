const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

/**
 * Converte um único arquivo de imagem para formato WebP com compressão sem perdas.
 * 
 * @param {string} inputPath - Caminho absoluto ou relativo para o arquivo de imagem de entrada
 * @returns {Promise<Buffer>} Buffer contendo a imagem convertida em formato WebP
 * @throws {Error} Lança erro se o arquivo de entrada não for encontrado
 * 
 * @example
 * // Converter uma imagem JPG para WebP
 * const webpBuffer = await convertFile('./images/photo.jpg');
 * fs.writeFileSync('./output/photo.webp', webpBuffer);
 * 
 * @example
 * // Tratamento de erro
 * try {
 *   const buffer = await convertFile('./nonexistent.png');
 * } catch (error) {
 *   console.error('Arquivo não encontrado:', error.message);
 * }
 */
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

/**
 * Converte todas as imagens suportadas de um diretório para formato WebP.
 * Cria o diretório de saída automaticamente se não existir.
 * 
 * @param {string} inputDir - Caminho para o diretório contendo as imagens de entrada
 * @param {string} outputDir - Caminho para o diretório onde as imagens WebP serão salvas
 * @returns {Promise<Array<Object>>} Array com resultados da conversão de cada imagem
 * @throws {Error} Lança erro se o diretório de entrada não existir
 * 
 * @example
 * // Converter todas as imagens de uma pasta
 * const results = await convertPath('./input', './output');
 * console.log(`${results.filter(r => r.success).length} imagens convertidas`);
 * 
 * @example
 * // Verificar resultados individuais
 * const results = await convertPath('./photos', './webp-photos');
 * results.forEach(result => {
 *   if (result.success) {
 *     console.log(`✅ ${result.input} → ${result.output}`);
 *   } else {
 *     console.log(`❌ Erro em ${result.input}: ${result.error}`);
 *   }
 * });
 * 
 * @description
 * Formatos suportados: .jpg, .jpeg, .png, .bmp, .tiff, .gif
 * 
 * Estrutura do resultado:
 * {
 *   success: boolean,     // Se a conversão foi bem-sucedida
 *   input: string,        // Nome do arquivo original
 *   output?: string,      // Nome do arquivo WebP gerado (se success=true)
 *   path?: string,        // Caminho completo do arquivo gerado (se success=true)
 *   error?: string        // Mensagem de erro (se success=false)
 * }
 */
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
