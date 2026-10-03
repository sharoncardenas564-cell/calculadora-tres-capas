// Capa 2 (limpieza) - Path Params
// Recibe GET /limpiar/:dato1/:dato2, limpia/valida y reenvía a sumarPathParams.
const { createServer } = require('node:http');

const port = process.env.PORT || 3002;
const SUMAR_URL = process.env.SUMAR_URL || 'http://127.0.0.1:4002';

function limpiar(valor) {
  if (valor === undefined || valor === null) return null;
  const texto = decodeURIComponent(String(valor)).trim().replace(',', '.');
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
    return responder(res, 405, { error: 'Use GET /limpiar/:dato1/:dato2' });
  }

  const partes = new URL(req.url, 'http://localhost').pathname.split('/').filter(Boolean);

  if (partes.length !== 3 || partes[0] !== 'limpiar') {
    return responder(res, 404, { error: 'Ruta esperada: /limpiar/:dato1/:dato2' });
  }

  let dato1, dato2;
  try {
    dato1 = limpiar(partes[1]);
    dato2 = limpiar(partes[2]);
  } catch {
    return responder(res, 400, { error: 'Parámetros mal codificados' });
  }

  if (dato1 === null || dato2 === null) {
    return responder(res, 400, { error: 'dato1 y dato2 deben ser números válidos' });
  }

  try {
    const r = await fetch(`${SUMAR_URL}/sumar/${encodeURIComponent(dato1)}/${encodeURIComponent(dato2)}`);
    const resultado = await r.json();
    responder(res, r.status, resultado);
  } catch (e) {
    responder(res, 502, { error: 'No se pudo contactar sumarPathParams' });
  }
});

server.listen(port, () => {
  console.log(`limpiezaPathParams escuchando en puerto ${port} -> ${SUMAR_URL}`);
});
