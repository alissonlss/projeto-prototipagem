const express = require('express');
const app = express();
const { google } = require('googleapis');

const FILE_ID = ''; // Coloque o id do arquivo txt do drive para manipulação

const PORT = process.env.PORT || 3333;
const GOOGLE_KEY = {}; // Coloque sua chave do google api

app.get('/', (req, res) => {
  res.send('Bem-vindo ao meu servidor!');
});

// Função para obter o conteúdo atual do arquivo
async function obterConteudoAtual() {
  try {
    const auth = new google.auth.GoogleAuth({
        credentials: GOOGLE_KEY,
        scopes: ['https://www.googleapis.com/auth/drive']
    });

    const driveService = google.drive({
        version: 'v3',
        auth
    });

    // Obtenha o conteúdo atual do arquivo
    const response = await driveService.files.get({
        fileId: FILE_ID,
        alt: 'media'
    });

    return response.data;
  } catch (erro) {
    console.error('Erro ao tentar obter o conteúdo do arquivo de texto:', erro);
    throw erro;
  }
}

// Configurar as rotas do servidor

// Endpoint para obter conteúdo do arquivo
app.get('/getFileContent', async (req, res) => {
  try {
    const conteudoAtual = await obterConteudoAtual();
    console.log('Conteúdo atual do arquivo:', conteudoAtual);
    return res.json({ conteudoAtual });
  } catch (erro) {
    return res.status(500).json({ erro: 'Erro ao obter o conteúdo do arquivo de texto' });
  }
});


// Endpoint para iniciar o conteúdo do arquivo
app.post('/initialFileContent', async (req, res) => {
  try {
    const conteudoInicial = '0';

    const auth = new google.auth.GoogleAuth({
      credentials: GOOGLE_KEY,
      scopes: ['https://www.googleapis.com/auth/drive']
    });

    const driveService = google.drive({
      version: 'v3',
      auth
    });

    await driveService.files.update({
      fileId: FILE_ID,
      resource: { content: conteudoInicial },
      media: {
        mimeType: 'text/plain',
        body: conteudoInicial
      }
    });

    console.log('Conteúdo do arquivo de texto inicializado com sucesso.');
    return res.json({ conteudoInicial });
  } catch (erro) {
    console.error('Erro ao atualizar o conteúdo do arquivo de texto:', erro);
    return res.status(500).json({ erro: 'Erro ao inicializar o conteúdo do arquivo de texto' });
  }
});


// Endpoint para atualizar conteúdo do arquivo
app.post('/updateFileContent', async (req, res) => {
  try {
    // Obter conteúdo atual do arquivo
    const conteudoAtual = await obterConteudoAtual();
    console.log('Conteúdo atual do arquivo:', conteudoAtual);

    // Atualizar o conteúdo do arquivo
    const novoConteudo = conteudoAtual == '0' ? '1' : '0';

    const auth = new google.auth.GoogleAuth({
      credentials: GOOGLE_KEY,
      scopes: ['https://www.googleapis.com/auth/drive']
    });

    const driveService = google.drive({
      version: 'v3',
      auth
    });

    await driveService.files.update({
      fileId: FILE_ID,
      resource: { content: novoConteudo },
      media: {
        mimeType: 'text/plain',
        body: novoConteudo
      }
    });

    console.log('Conteúdo do arquivo de texto atualizado com sucesso.');
    return res.json({ novoConteudo });
  } catch (erro) {
    console.error('Erro ao atualizar o conteúdo do arquivo de texto:', erro);
    return res.status(500).json({ erro: 'Erro ao atualizar o conteúdo do arquivo de texto' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
