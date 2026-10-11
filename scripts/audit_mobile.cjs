const cp = require('child_process');
const fs = require('fs');

async function run() {
  const chrome = cp.spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--window-size=390,844',
    'http://localhost:5173/'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const list = await (await fetch('http://127.0.0.1:9222/json/list')).json();
    const tab = list.find(t => t.url.includes('localhost:5173'));
    if (!tab) {
      console.log('No tab found');
      chrome.kill();
      return;
    }

    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    function send(method, params = {}) {
      return new Promise(resolve => {
        const curId = id++;
        const handler = (msg) => {
          const data = JSON.parse(msg.data);
          if (data.id === curId) {
            ws.removeEventListener('message', handler);
            resolve(data.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }

    // Set mobile device emulation
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });

    await new Promise(r => setTimeout(r, 2000));

    // Evaluate overflowing elements
    const evalResult = await send('Runtime.evaluate', {
      expression: `(() => {
        const docW = window.innerWidth;
        const scrollW = document.documentElement.scrollWidth;
        const bad = [];
        document.querySelectorAll('*').forEach(el => {
          // ignore marquee tracks or intentionally overflowing containers
          if (el.closest('.marquee') || el.closest('.chips') || el.classList.contains('marquee-track')) return;
          const r = el.getBoundingClientRect();
          if (r.right > docW + 1 || (el.scrollWidth > docW + 1 && getComputedStyle(el).overflowX === 'visible')) {
            bad.push({
              tag: el.tagName,
              cls: (typeof el.className === 'string' ? el.className : ''),
              rectRight: Math.round(r.right),
              rectWidth: Math.round(r.width),
              scrollWidth: el.scrollWidth,
              text: (el.innerText || '').slice(0, 50).replace(/\\n/g, ' ')
            });
          }
        });
        return { windowInnerWidth: docW, documentScrollWidth: scrollW, badCount: bad.length, bad: bad.slice(0, 15) };
      })()`,
      returnByValue: true
    });

    console.log('AUDIT RESULT:', JSON.stringify(evalResult.result.value, null, 2));

    // Capture mobile screenshot
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('f:/my f1 website/mobile_cdp_audit.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved screenshot mobile_cdp_audit.png');

    ws.close();
  } catch(e) {
    console.error('Error during test:', e);
  } finally {
    chrome.kill();
  }
}

run();
