import { spawn } from 'child_process';

const p = spawn(process.execPath, ['node_modules/vite/bin/vite.js'], { stdio: 'pipe' });
p.stdout.on('data', d => console.log('VITE:', d.toString()));
p.stderr.on('data', d => console.error('VITE ERR:', d.toString()));

setTimeout(async () => {
  try {
    const res = await fetch('http://localhost:3000/SISCEBA/');
    const text = await res.text();
    console.log('STATUS:', res.status);
    console.log('HTML SNIPPET:\n', text.slice(0, 400));
    const match = text.match(/src="([^"]+)"/);
    if (match) {
      console.log('Main script src:', match[1]);
      const scriptUrl = new URL(match[1], 'http://localhost:3000/SISCEBA/').href;
      console.log('Fetching script at:', scriptUrl);
      const scriptRes = await fetch(scriptUrl);
      console.log('Script status:', scriptRes.status);
      const scriptText = await scriptRes.text();
      console.log('Script preview:', scriptText.slice(0, 300));
    }
  } catch (e) {
    console.error('Fetch error:', e);
  }
  p.kill();
  process.exit(0);
}, 3000);
