#!/usr/bin/env node
/* Basit statik dosya sunucusu — `npm run dev -- --port 7100 --host 0.0.0.0` */
const http = require('http');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
function argVal(name, def) {
  const i = args.findIndex(a => a === `--${name}` || a === `-${name}`);
  if (i !== -1 && args[i + 1]) return args[i + 1];
  const eq = args.find(a => a.startsWith(`--${name}=`));
  return eq ? eq.split('=')[1] : def;
}
const port = Number(argVal('port', process.env.PORT || 7100));
const host = argVal('host', process.env.HOST || '0.0.0.0');
const root = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.wasm': 'application/wasm',
};

http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  const file = path.normalize(path.join(root, urlPath));
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(port, host, () => console.log(`dev server → http://localhost:${port}/`));
