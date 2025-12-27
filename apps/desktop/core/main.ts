import { app, BrowserWindow } from 'electron';
import path from 'path';

// Detecta se estamos em DEV (se a variavel de ambiente existir)
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (isDev) {
    // Em DEV, carrega a URL do Vite (Hot Reload!)
    win.loadURL('http://localhost:5173');
    // Abre o console automaticamente pra ajudar
    win.webContents.openDevTools(); 
  } else {
    // Em PROD, carrega o arquivo buildado
    // Note o '../dist-react' que configuramos no Vite
    win.loadFile(path.join(__dirname, '../dist-react/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});