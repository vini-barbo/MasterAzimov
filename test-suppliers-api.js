#!/usr/bin/env node

const http = require('http');

// Teste simples para verificar se a API está funcionando
async function testSupplierAPI() {
  const baseURL = 'http://localhost:3000/api';
  
  console.log('🧪 Testando conexão com a API de fornecedores...\n');
  
  // Teste 1: Health check
  try {
    console.log('1. Testando health check...');
    const healthResponse = await makeRequest(`${baseURL}/health`);
    console.log('✅ Health check OK:', healthResponse);
  } catch (error) {
    console.log('❌ Health check falhou:', error.message);
  }
  
  // Teste 2: Listar fornecedores
  try {
    console.log('\n2. Testando listagem de fornecedores...');
    const suppliersResponse = await makeRequest(`${baseURL}/suppliers`);
    console.log('✅ Fornecedores OK:', suppliersResponse);
  } catch (error) {
    console.log('❌ Listagem de fornecedores falhou:', error.message);
  }
  
  // Teste 3: Criar fornecedor
  try {
    console.log('\n3. Testando criação de fornecedor...');
    const newSupplier = {
      name: "Fornecedor Teste",
      contactEmail: "teste@fornecedor.com",
      phone: "(11) 99999-9999",
      address: "Rua Teste, 123"
    };
    
    const createResponse = await makeRequest(`${baseURL}/suppliers`, 'POST', newSupplier);
    console.log('✅ Criação de fornecedor OK:', createResponse);
  } catch (error) {
    console.log('❌ Criação de fornecedor falhou:', error.message);
  }
}

// Função helper para fazer requisições HTTP
function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    if (data && method !== 'GET') {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }
    
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = responseData ? JSON.parse(responseData) : null;
          resolve(jsonData);
        } catch (e) {
          resolve(responseData);
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data && method !== 'GET') {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Executar os testes
testSupplierAPI().catch(console.error);
