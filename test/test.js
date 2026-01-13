const { convertFile, convertPath } = require('../index.js');
const fs = require('fs');
const path = require('path');

async function runTests() {
  console.log('🧪 Iniciando testes da WebP Light Converter...\n');
  
  try {
    // Teste 1: Conversão de arquivo único
    console.log('📋 Teste 1: Conversão de arquivo único');
    console.log('Convertendo test/example.png...');
    
    const webpBuffer = await convertFile('./test/example.png');
    
    // Criar pasta de output se não existir
    if (!fs.existsSync('./output')) {
      fs.mkdirSync('./output');
    }
    
    fs.writeFileSync('./output/example.webp', webpBuffer);
    
    const stats = fs.statSync('./output/example.webp');
    console.log(`✅ Arquivo convertido com sucesso!`);
    console.log(`   Tamanho: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`   Localização: ./output/example.webp\n`);
    
    // Teste 2: Conversão de diretório
    console.log('📋 Teste 2: Conversão de diretório');
    console.log('Convertendo pasta test/ para output/batch/...');
    
    const results = await convertPath('./test', './output/batch');
    
    console.log('\n📊 Resultados da conversão em lote:');
    results.forEach((result, index) => {
      if (result.success) {
        const stats = fs.statSync(result.path);
        console.log(`   ${index + 1}. ✅ ${result.input} → ${result.output}`);
        console.log(`      Tamanho: ${(stats.size / 1024).toFixed(2)} KB`);
      } else {
        console.log(`   ${index + 1}. ❌ ${result.input}: ${result.error}`);
      }
    });
    
    const successful = results.filter(r => r.success).length;
    console.log(`\n🎉 Testes concluídos: ${successful}/${results.length} conversões bem-sucedidas`);
    
    // Teste 3: Tratamento de erro
    console.log('\n📋 Teste 3: Tratamento de erro (arquivo inexistente)');
    try {
      await convertFile('./inexistente.jpg');
      console.log('❌ Erro: deveria ter lançado exceção');
    } catch (error) {
      console.log(`✅ Erro capturado corretamente: ${error.message}`);
    }
    
    console.log('\n🎯 Todos os testes foram executados com sucesso!');
    console.log('\n📁 Arquivos gerados:');
    console.log('   - ./output/example.webp');
    console.log('   - ./output/batch/example.webp');
    
  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message);
    process.exit(1);
  }
}

// Executar testes
runTests();
