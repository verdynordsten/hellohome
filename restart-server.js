import { spawn } from 'child_process';

console.log('Restarting server...');

// Kill any existing server process
const killProcess = spawn('taskkill', ['/F', '/IM', 'node.exe'], { stdio: 'inherit' });

killProcess.on('close', (code) => {
  console.log(`Kill process exited with code ${code}`);
  
  // Start a new server
  setTimeout(() => {
    console.log('Starting new server...');
    const serverProcess = spawn('npm', ['run', 'api'], { stdio: 'inherit' });
    
    serverProcess.on('close', (code) => {
      console.log(`Server process exited with code ${code}`);
    });
  }, 2000); // Wait 2 seconds before starting the new server
});