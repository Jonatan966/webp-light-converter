# WebP Light Converter

Uma biblioteca leve para converter imagens para formato WebP com compressão sem perdas.

## 🚀 Instalação

```bash
npm install webp-light-converter
```

## 📋 Características

- ✅ Conversão sem perdas (lossless)
- ✅ Máxima qualidade preservada
- ✅ Suporte a múltiplos formatos de entrada
- ✅ Conversão em lote de diretórios
- ✅ Preservação de metadados da imagem
- ✅ API simples e direta
- ⚡ Alta performance com Sharp

## 📁 Formatos Suportados

**Entrada:** JPG, JPEG, PNG, BMP, TIFF, GIF  
**Saída:** WebP

## 📚 Uso

### Importando a biblioteca

```javascript
const { convertFile, convertPath } = require('webp-light-converter');
```

### Converter um arquivo único

```javascript
const { convertFile } = require('webp-light-converter');
const fs = require('fs');

async function exemplo() {
  try {
    // Converte uma imagem para buffer WebP
    const webpBuffer = await convertFile('./input/image.jpg');
    
    // Salva o buffer em um arquivo
    fs.writeFileSync('./output/image.webp', webpBuffer);
    
    console.log('Conversão concluída!');
  } catch (error) {
    console.error('Erro na conversão:', error.message);
  }
}

exemplo();
```

### Converter um diretório inteiro

```javascript
const { convertPath } = require('webp-light-converter');

async function exemploLote() {
  try {
    const resultados = await convertPath('./input', './output');
    
    resultados.forEach(resultado => {
      if (resultado.success) {
        console.log(`✅ ${resultado.input} → ${resultado.output}`);
      } else {
        console.log(`❌ ${resultado.input}: ${resultado.error}`);
      }
    });
  } catch (error) {
    console.error('Erro na conversão:', error.message);
  }
}

exemploLote();
```

## 🔧 API

### `convertFile(inputPath)`

Converte um único arquivo de imagem para formato WebP.

- **inputPath** `{string}` - Caminho para o arquivo de entrada
- **Retorna** `{Promise<Buffer>}` - Buffer contendo a imagem WebP
- **Lança** `{Error}` - Se o arquivo não for encontrado

### `convertPath(inputDir, outputDir)`

Converte todas as imagens de um diretório para formato WebP.

- **inputDir** `{string}` - Diretório de entrada
- **outputDir** `{string}` - Diretório de saída
- **Retorna** `{Promise<Array>}` - Array com resultados da conversão
- **Lança** `{Error}` - Se o diretório de entrada não existir

#### Formato do resultado:

```javascript
[
  {
    success: true,
    input: 'image.jpg',
    output: 'image.webp',
    path: '/path/to/output/image.webp'
  },
  {
    success: false,
    input: 'corrupted.png',
    error: 'Mensagem de erro'
  }
]
```

## ⚙️ Configurações

A biblioteca usa configurações otimizadas para máxima qualidade:

- **Lossless**: `true` (sem perdas)
- **Quality**: `100` (máxima qualidade)
- **Effort**: `6` (máximo esforço de compressão)
- **Metadados**: Preservados

## 📄 Licença

MIT © [Jonatan966](https://ojonatan.dev)

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie sua feature branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 🐛 Reportar Problemas

[Abra uma issue](https://github.com/Jonatan966/webp-light-converter/issues) no GitHub.
