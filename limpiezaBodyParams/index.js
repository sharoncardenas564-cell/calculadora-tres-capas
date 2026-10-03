// Capa 2 (limpieza) - Body Params
// Recibe POST con JSON { dato1, dato2 }, limpia/valida y reenvía a sumarBodyParams.
const { createServer } = require('node:http');

const port = process.env.PORT || 3001;
const SUMAR_URL = process.env.SUMAR_URL || 'http://127.0.0.1:4001';

function limpiar(valor) {
  if (valor === undefined || valor === null) return null;
  const texto = String(valor).trim().replace(',', '.');
  if (texto === '') return null;
  const n = Number(texto);
  return Number.isFinite(n) ? n : null;
}

function responder(res, status, objeto) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end(JSON.stringify(objeto));
}

const server = createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    return responder(res, 405, { error: 'Use POST con body JSON { dato1, dato2 }' });
  }

  let body = '';
  req.on('data', (parte) => { body += parte; });

  req.on('end', async () => {
    let datos;
    try {
      datos = JSON.parse(body);
    } catch {
      return responder(res, 400, { error: 'El body no es un JSON válido' });
    }

    const dato1 = limpiar(datos.dato1);
    const dato2 = limpiar(datos.dato2);

    if (dato1 === null || dato2 === null) {
      return responder(res, 400, { error: 'dato1 y dato2 deben ser números válidos' });
    }

    try {
      const r = await fetch(SUMAR_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dato1, dato2 })
      });
      const resultado = await r.json();
      responder(res, r.status, resultado);
    } catch (e) {
      responder(res, 502, { error: 'No se pudo contactar sumarBodyParams' });
    }
  });
});

server.listen(port, () => {
  console.log(`limpiezaBodyParams escuchando en puerto ${port} -> ${SUMAR_URL}`);
});
