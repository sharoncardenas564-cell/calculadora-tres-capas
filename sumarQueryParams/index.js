// Capa 3 (lógica de negocio) - Query Params
// Recibe GET /?dato1=..&dato2=.. y devuelve { resultado }.
const { createServer } = require('node:http');

const port = process.env.PORT || 4003;

function responder(res, status, objeto) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(objeto));
}

const server = createServer((req, res) => {
  if (req.method !== 'GET') {
    return responder(res, 405, { error: 'Use GET /?dato1=..&dato2=..' });
  }

  const params = new URL(req.url, 'http://localhost').searchParams;
  const a = params.get('dato1');
  const b = params.get('dato2');

  if (a === null || b === null || a.trim() === '' || b.trim() === '') {
    return responder(res, 400, { error: 'Faltan dato1 y/o dato2' });
  }

  const dato1 = Number(a);
  const dato2 = Number(b);

  if (!Number.isFinite(dato1) || !Number.isFinite(dato2)) {
    return responder(res, 400, { error: 'dato1 y dato2 deben ser números' });
  }

  responder(res, 200, { resultado: dato1 + dato2 });
});

server.listen(port, () => {
  console.log(`sumarQueryParams escuchando en puerto ${port}`);
});
