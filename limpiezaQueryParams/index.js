// Capa 2 (limpieza) - Query Params
// Recibe GET /?dato1=..&dato2=.., limpia/valida y reenvía a sumarQueryParams.
const { createServer } = require('node:http');

const port = process.env.PORT || 3003;
const SUMAR_URL = process.env.SUMAR_URL || 'http://127.0.0.1:4003';

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

const server = createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    return responder(res, 405, { error: 'Use GET /?dato1=..&dato2=..' });
  }

  const params = new URL(req.url, 'http://localhost').searchParams;
  const dato1 = limpiar(params.get('dato1'));
  const dato2 = limpiar(params.get('dato2'));

  if (dato1 === null || dato2 === null) {
    return responder(res, 400, { error: 'dato1 y dato2 deben ser números válidos' });
  }

  try {
    const url = `${SUMAR_URL}/?dato1=${encodeURIComponent(dato1)}&dato2=${encodeURIComponent(dato2)}`;
    const r = await fetch(url);
    const resultado = await r.json();
    responder(res, r.status, resultado);
  } catch (e) {
    responder(res, 502, { error: 'No se pudo contactar sumarQueryParams' });
  }
});

server.listen(port, () => {
  console.log(`limpiezaQueryParams escuchando en puerto ${port} -> ${SUMAR_URL}`);
});
