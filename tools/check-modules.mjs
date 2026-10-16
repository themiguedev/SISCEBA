import { spawn } from 'child_process';

const p = spawn(process.execPath, ['node_modules/vite/bin/vite.js'], { stdio: 'pipe' });
p.stdout.on('data', d => console.log('VITE:', d.toString()));
p.stderr.on('data', d => console.error('VITE ERR:', d.toString()));

setTimeout(async () => {
  try {
    const modules = [
      '/SISCEBA/src/main.tsx',
      '/SISCEBA/src/App.tsx',
      '/SISCEBA/src/context/AppContext.tsx',
      '/SISCEBA/src/context/ThemeContext.tsx',
      '/SISCEBA/src/components/auth/LoginView.tsx',
      '/SISCEBA/src/lib/dbClient.ts'
    ];
    for (const m of modules) {
      const r = await fetch(`http://localhost:3000${m}`);
      console.log(`Module ${m} status: ${r.status}`);
      if (r.status !== 200) {
        console.error(`Error loading ${m}:`, await r.text());
      }
    }
  } catch (e) {
    console.error('Test error:', e);
  } finally {
    p.kill();
    process.exit(0);
  }
}, 4000);
