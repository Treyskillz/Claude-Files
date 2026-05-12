import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { request } from 'node:http';

const url = process.argv[2];
if (!url) {
  console.error('Usage: node scripts/responsive-qa.mjs <url>');
  process.exit(1);
}

const chromium = process.env.CHROMIUM_BIN || 'chromium';
const port = 9333 + Math.floor(Math.random() * 500);
const userDataDir = `/tmp/chrome-responsive-qa-${process.pid}`;
const outDir = new URL('../docs/qa-screens/', import.meta.url);
await mkdir(outDir, { recursive: true });

const proc = spawn(chromium, [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  '--disable-dev-shm-usage',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${userDataDir}`,
  'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] });

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function httpGetJson(path) {
  return new Promise((resolve, reject) => {
    const req = request({ hostname: '127.0.0.1', port, path, method: 'GET' }, res => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (error) { reject(error); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function waitForEndpoint(path, attempts = 80) {
  for (let i = 0; i < attempts; i += 1) {
    try { return await httpGetJson(path); } catch { await sleep(100); }
  }
  throw new Error(`Chrome DevTools endpoint did not become ready: ${path}`);
}

function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();
  ws.addEventListener('message', event => {
    const msg = JSON.parse(String(event.data));
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(JSON.stringify(msg.error)));
      else resolve(msg.result);
    }
  });
  return new Promise((resolve, reject) => {
    ws.addEventListener('open', () => {
      resolve({
        send(method, params = {}) {
          const currentId = ++id;
          ws.send(JSON.stringify({ id: currentId, method, params }));
          return new Promise((res, rej) => pending.set(currentId, { resolve: res, reject: rej }));
        },
        close() { ws.close(); },
      });
    }, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });
}

try {
  const pages = await waitForEndpoint('/json');
  const page = pages.find(p => p.type === 'page') ?? pages[0];
  const cdp = await connect(page.webSocketDebuggerUrl);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  const viewports = [
    { name: 'mobile-390', width: 390, height: 1200, scale: 1, mobile: true },
    { name: 'tablet-768', width: 768, height: 1200, scale: 1, mobile: true },
    { name: 'laptop-1366', width: 1366, height: 900, scale: 1, mobile: false },
    { name: 'wide-1600', width: 1600, height: 1000, scale: 1, mobile: false },
  ];

  const results = [];
  for (const vp of viewports) {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.scale,
      mobile: vp.mobile,
    });
    await cdp.send('Page.navigate', { url });
    await sleep(2500);
    const metrics = await cdp.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const doc = document.documentElement;
        const body = document.body;
        const header = document.querySelector('header');
        const heroHeading = document.querySelector('h1');
        const menuButton = document.querySelector('button[aria-label="Open navigation"]');
        const desktopNav = document.querySelector('header nav:not(.grid)');
        return {
          innerWidth: window.innerWidth,
          clientWidth: doc.clientWidth,
          scrollWidth: Math.max(doc.scrollWidth, body?.scrollWidth || 0),
          hasHorizontalOverflow: Math.max(doc.scrollWidth, body?.scrollWidth || 0) > doc.clientWidth + 1,
          headerRight: header ? Math.round(header.getBoundingClientRect().right) : null,
          headingRight: heroHeading ? Math.round(heroHeading.getBoundingClientRect().right) : null,
          menuButtonVisible: menuButton ? getComputedStyle(menuButton).display !== 'none' : false,
          desktopNavVisible: desktopNav ? getComputedStyle(desktopNav).display !== 'none' : false,
          title: document.title,
        };
      })()`,
    });
    const screenshot = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    const screenshotPath = new URL(`home-${vp.name}-cdp.png`, outDir);
    await writeFile(screenshotPath, Buffer.from(screenshot.data, 'base64'));
    results.push({ viewport: vp.name, screenshot: screenshotPath.pathname, ...metrics.result.value });
  }
  await writeFile(new URL('../docs/qa-responsive-measurements.json', import.meta.url), JSON.stringify(results, null, 2) + '\n');
  console.log(JSON.stringify(results, null, 2));
  cdp.close();
} finally {
  proc.kill('SIGTERM');
}
