const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = __dirname;
const srv = http.createServer((req, res) => {
  const f = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!f.startsWith(root) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  const type = f.endsWith('.js') ? 'text/javascript' : 'text/html';
  res.writeHead(200, { 'Content-Type': type }); fs.createReadStream(f).pipe(res);
}).listen(4190);
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  for (const [scene, w, h] of JSON.parse(process.argv[2])) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    p.on('console', m => console.log(scene, m.type(), m.text().slice(0, 160)));
    p.on('pageerror', e => console.log(scene, 'ERR', e.message));
    await p.goto(`http://localhost:4190/scene.html?scene=${scene}&w=${w}&h=${h}`);
    await p.waitForFunction(() => window.__done === true, null, { timeout: 120000 });
    await p.locator('canvas').screenshot({ path: path.join(root, `${scene}.png`), omitBackground: true });
    console.log('rendered', scene);
  }
  await b.close(); srv.close();
})();
