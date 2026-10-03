# Calculadora de suma - Arquitectura a tres capas

Suma de dos números con **tres capas** y **tres tipos de parámetros**:

```
Front (Calculadora.html)  ->  Microservicio de LIMPIEZA  ->  Microservicio de LÓGICA DE NEGOCIO
```

| Tipo de param | Botón            | Limpieza (capa 2)      | Lógica de negocio (capa 3) | Petición del front                         |
|---------------|------------------|------------------------|----------------------------|--------------------------------------------|
| Body          | + Body Params    | `limpiezaBodyParams`   | `sumarBodyParams`          | `POST /` con `{"dato1":"5","dato2":"2"}`   |
| Path          | + Path Params    | `limpiezaPathParams`   | `sumarPathParams`          | `GET /limpiar/5/2`                         |
| Query         | + Query Params   | `limpiezaQueryParams`  | `sumarQueryParams`         | `GET /?dato1=5&dato2=2`                    |

## Qué hace cada capa

- **Front**: lee los dos datos y llama a la capa de limpieza según el botón.
- **Limpieza**: aplica `trim`, cambia la coma decimal por punto (`2,5` -> `2.5`), valida que sean números y reenvía al servicio de negocio usando el mismo tipo de param. Si algo es inválido responde `400`. Tiene CORS habilitado (es el único que llama el navegador).
- **Lógica de negocio**: valida de nuevo y devuelve `{ "resultado": suma }`.

## Estructura

```
front/Calculadora.html
limpiezaBodyParams/    sumarBodyParams/
limpiezaPathParams/    sumarPathParams/
limpiezaQueryParams/   sumarQueryParams/
render.yaml            (Blueprint de Render)
```

Cada servicio es independiente (Node >= 18, sin dependencias) y usa las variables:
- `PORT` (la inyecta la plataforma; local usa 3001-3003 y 4001-4003)
- `SUMAR_URL` (solo en limpieza): URL base del servicio de negocio correspondiente.

## Ejecutar en local

```bash
for d in sumarBodyParams sumarPathParams sumarQueryParams limpiezaBodyParams limpiezaPathParams limpiezaQueryParams; do
  (cd $d && node index.js &)
done
```
Luego abrir `front/Calculadora.html` en el navegador.

Pruebas rápidas:
```bash
curl -X POST localhost:3001 -H 'Content-Type: application/json' -d '{"dato1":"5","dato2":"2,5"}'
curl localhost:3002/limpiar/5/2.5
curl 'localhost:3003/?dato1=5&dato2=2.5'
```

## Despliegue en la nube (Render)

1. Subir este repositorio a GitHub.
2. En Render: **New > Blueprint** y elegir el repositorio (usa `render.yaml`), o crear 6 **Web Services** manualmente con:
   - *Root Directory*: la carpeta del servicio
   - *Build Command*: `npm install`
   - *Start Command*: `npm start`
3. Despliega primero los tres `sumar-*`. En cada `limpieza-*` ajusta la variable `SUMAR_URL` con la URL pública real del `sumar-*` correspondiente (si Render asignó un nombre distinto, corrige el valor).
4. En `front/Calculadora.html` reemplaza las tres constantes `URL_LIMPIEZA_*` por las URLs públicas de los servicios de limpieza.
5. Abre el front y prueba los tres botones.

> Nota: en el plan gratuito de Render los servicios se duermen por inactividad; la primera petición puede tardar ~30-60 s.

## URLs desplegadas

| Servicio | URL |
|---|---|
| limpiezaBodyParams | _pendiente_ |
| sumarBodyParams | _pendiente_ |
| limpiezaPathParams | _pendiente_ |
| sumarPathParams | _pendiente_ |
| limpiezaQueryParams | _pendiente_ |
| sumarQueryParams | _pendiente_ |
