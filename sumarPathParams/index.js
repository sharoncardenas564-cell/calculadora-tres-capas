// Capa 3 (lógica de negocio) - Path Params
// Recibe GET /sumar/:dato1/:dato2 y devuelve { resultado }.
const { createServer } = require('node:http');

const port = process.env.PORT || 4002;

function responder(res, status, objeto) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(objeto));
}

const server = createServer((req, res) => {
  if (req.method !== 'GET') {
    return responder(res, 405, { error: 'Use GET /sumar/:dato1/:dato2' });
  }

  const partes = new URL(req.url, 'http://localhost').pathname.split('/').filter(Boolean);

  if (partes.length !== 3 || partes[0] !== 'sumar') {
    return responder(res, 404, { error: 'Ruta esperada: /sumar/:dato1/:dato2' });
  }

  let dato1, dato2;
  try {
    dato1 = Number(decodeURIComponent(partes[1]));
    dato2 = Number(decodeURIComponent(partes[2]));
  } catch {
    return responder(res, 400, { error: 'Parámetros mal codificados' });
  }

  if (!Number.isFinite(dato1) || !Number.isFinite(dato2)) {
    return responder(res, 400, { error: 'dato1 y dato2 deben ser números' });
  }

  responder(res, 200, { resultado: dato1 + dato2 });
});

server.listen(port, () => {
  console.log(`sumarPathParams escuchando en puerto ${port}`);
});
