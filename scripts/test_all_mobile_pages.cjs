const cp = require('child_process');
const fs = require('fs');
const path = require('path');

const ROUTES = [
  { path: '/', name: 'mobile_page_home' },
  { path: '/standings', name: 'mobile_page_standings' },
  { path: '/calendar', name: 'mobile_page_calendar' },
  { path: '/drivers', name: 'mobile_page_drivers' },
  { path: '/teams', name: 'mobile_page_teams' },
  { path: '/circuits', name: 'mobile_page_circuits' },
  { path: '/champions', name: 'mobile_page_champions' },
  { path: '/compare', name: 'mobile_page_compare' },
  { path: '/quiz', name: 'mobile_page_quiz' },
  { path: '/guide', name: 'mobile_page_guide' },
];

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

    // Set mobile device emulation (iPhone 14: 390x844, 2x scale, touch)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
      fitWindow: false
    });
    await send('Emulation.setTouchEmulationEnabled', { enabled: true });

    const results = [];

    for (const route of ROUTES) {
      console.log(`Navigating to ${route.path}...`);
      await send('Page.navigate', { url: `http://localhost:5173${route.path}` });
      await new Promise(r => setTimeout(r, 1200));

      const audit = await send('Runtime.evaluate', {
        expression: `(() => {
          const docW = window.innerWidth;
          const scrollW = document.documentElement.scrollWidth;
          const bad = [];
          document.querySelectorAll('*').forEach(el => {
            if (el.closest('.marquee') || el.closest('.chips') || el.classList.contains('marquee-track')) return;
            const r = el.getBoundingClientRect();
            if (r.right > docW + 1.5 && getComputedStyle(el).display !== 'none') {
              bad.push({
                tag: el.tagName,
                cls: (typeof el.className === 'string' ? el.className.slice(0, 30) : ''),
                right: Math.round(r.right),
                text: (el.innerText || '').slice(0, 30).replace(/\\n/g, ' ')
              });
            }
          });
          return {
            innerWidth: docW,
            scrollWidth: scrollW,
            overflow: scrollW > docW,
            badCount: bad.length,
            badSample: bad.slice(0, 5)
          };
        })()`,
        returnByValue: true
      });

      const res = audit.result.value;
      results.push({ ...route, ...res });

      const shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(`f:/my f1 website/${route.name}.png`, Buffer.from(shot.data, 'base64'));
    }

    // Also test opening the mobile menu drawer on homepage
    await send('Page.navigate', { url: 'http://localhost:5173/' });
    await new Promise(r => setTimeout(r, 1000));
    await send('Runtime.evaluate', {
      expression: `document.querySelector('.menu-btn')?.click()`
    });
    await new Promise(r => setTimeout(r, 800));
    const menuShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('f:/my f1 website/mobile_drawer_open.png', Buffer.from(menuShot.data, 'base64'));
    console.log('Mobile menu drawer captured!');

    console.log('\n================ MOBILE AUDIT REPORT ================');
    let allPass = true;
    for (const r of results) {
      const status = r.overflow ? 'FAIL' : 'PASS';
      if (r.overflow) allPass = false;
      console.log(`[${status}] ${r.path.padEnd(12)} - scrollW: ${r.scrollWidth}px, innerW: ${r.innerWidth}px, badEls: ${r.badCount}`);
      if (r.badCount > 0) {
        console.log('   Overflow sample:', JSON.stringify(r.badSample));
      }
    }
    console.log('====================================================');
    console.log(`OVERALL RESULT: ${allPass ? 'ALL PAGES PASSED MOBILE AUDIT' : 'OVERFLOW DETECTED'}`);

    ws.close();
  } catch(e) {
    console.error('Audit failed with error:', e);
  } finally {
    chrome.kill();
  }
}

run();
