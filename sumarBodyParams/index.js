// Capa 3 (lógica de negocio) - Body Params
// Recibe POST con JSON { dato1, dato2 } y devuelve { resultado }.
const { createServer } = require('node:http');

const port = process.env.PORT || 4001;

function responder(res, status, objeto) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(objeto));
}

const server = createServer((req, res) => {
  if (req.method !== 'POST') {
    return responder(res, 405, { error: 'Use POST con body JSON { dato1, dato2 }' });
  }

  let body = '';
  req.on('data', (parte) => { body += parte; });

  req.on('end', () => {
    let datos;
    try {
      datos = JSON.parse(body);
    } catch {
      return responder(res, 400, { error: 'El body no es un JSON válido' });
    }

    const dato1 = Number(datos.dato1);
    const dato2 = Number(datos.dato2);

    if (!Number.isFinite(dato1) || !Number.isFinite(dato2)) {
      return responder(res, 400, { error: 'dato1 y dato2 deben ser números' });
    }

    responder(res, 200, { resultado: dato1 + dato2 });
  });
});

server.listen(port, () => {
  console.log(`sumarBodyParams escuchando en puerto ${port}`);
});
