// Usa a instalação local de sharp do app, sem downloads nem browser.
const path = require('node:path');
const sharp = require(path.resolve(__dirname, '../../../apps/web/node_modules/sharp'));
const root = path.resolve(__dirname, '../../../apps/web/public/atlas/brand');
const routes = process.argv.slice(2);
(async () => {
  for (const route of routes.length ? routes : ['01-portico', '02-vinculo', '03-trilha']) {
    if (!['01-portico', '02-vinculo', '03-trilha'].includes(route)) throw new Error('Rota inválida');
    for (const theme of ['light', 'dark']) {
      for (const size of [16, 32, 48]) {
        await sharp(path.join(root, route, `favicon-${theme}.svg`))
          .resize(size, size).png().toFile(path.join(root, route, `favicon-${size}-${theme}.png`));
      }
    }
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
