const { app, BrowserWindow, Menu, powerSaveBlocker, ipcMain, globalShortcut } = require('electron');
const isDevMode = require('electron-is-dev');
const { CapacitorSplashScreen } = require('@capacitor/electron');
const path = require('path');
const shutdown = require('electron-shutdown-command');//shutdown windows
var applescript = require('applescript');//use applescript to shutdown mac
let canQuit = false;

// Place holders for our windows so they don't get garbage collected.
let mainWindow = null;

// Placeholder for SplashScreen ref
let splashScreen = null;

//Change this if you do not wish to have a splash screen
let useSplashScreen = false;

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required')// 允许自动播放音频

powerSaveBlocker.start('prevent-app-suspension')//防止app被挂起，停止计时

// Create simple menu for easy devtools access, and for demo
const menuTemplateDev = [
  {
    label: '选项',
    submenu: [
      {
        label: '开发者工具',
        click() {
          mainWindow.openDevTools();
        },
      },
    ],
  },
];

async function createWindow() {
  if (process.platform === 'darwin') {
    const template = [
      {
        label: "程序",
        submenu: [
          { label: "退出", accelerator: "Command+Q", click: function () { app.quit(); } }
        ]
      },
      {
        label: "编辑",
        submenu: [
          { label: "复制", accelerator: "CmdOrCtrl+C", selector: "copy:" },
          { label: "粘贴", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        ]
      }
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
  } else {
    Menu.setApplicationMenu(null)
  }


  // Define our main window size
  mainWindow = new BrowserWindow({
    height: 270,
    width: 270,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'node_modules', '@capacitor', 'electron', 'dist', 'electron-bridge.js')
    },
    frame: false,
    resizable: false,
  });

  if (isDevMode) {
    // Set our above template to the Menu Object if we are in development mode, dont want users having the devtools.
    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplateDev));
    // If we are developers we might as well open the devtools by default.
    //mainWindow.webContents.openDevTools();
  }

  if (useSplashScreen) {
    splashScreen = new CapacitorSplashScreen(mainWindow);
    splashScreen.init(false);
  } else {
    mainWindow.loadURL(`file://${__dirname}/app/index.html`);
    mainWindow.webContents.on('dom-ready', () => {
      mainWindow.show();
    });
  }

  mainWindow.on('close', (event) => {
    if (!canQuit) {
      event.preventDefault();
      event.sender.send('closenotification', true);
    } else {
      mainWindow = null;
    }
  });

  mainWindow.webContents.send('tooManyInstances');
  const gotTheLock = app.requestSingleInstanceLock();
  if (!gotTheLock && mainWindow != null) {
    event.sender.send('toomanyapps', true);
    canQuit = true;
    app.quit();
  }//tip for not recommend more than 1 mrnoplay running
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some Electron APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();
  if (process.platform === 'win32') {
    app.setAppUserModelId("com.scrisstudio.mrnoplay");
  }
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// Define any IPC or other custom functionality below here
const { screen } = require('electron');
ipcMain.on('full-screen', function () {
  if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
    mainWindow.center();
    mainWindow.setAlwaysOnTop(true);
    const { fullwidth, fullheight } = screen.getPrimaryDisplay().workAreaSize;
    mainWindow.setSize(fullwidth, fullheight);
    //setTimeout(function () { mainWindow.setFullScreen(true) }, 500);
  }
});

ipcMain.on('normal-screen', function () {
  if (mainWindow) {
    mainWindow.setAlwaysOnTop(false);
    mainWindow.setSize(270,270);
    //mainWindow.setFullScreen(false);
  }
});

ipcMain.on('exit', () => {
  canQuit = true;
  app.quit();
});

ipcMain.on('shutdown', (event, arg) => {
  if (process.platform === 'win32') {
    var options = {
      name: 'Mr Noplay / 不玩家',
    };
    shutdown.shutdown();
    event.sender.send('timingdone', true);
  } else {
    event.sender.send('timingdone', true);
    var script = 'tell application "Finder" to shut down';
    applescript.execString(script, function(err) {});
    canQuit = true;
    app.quit();
  }
})

ipcMain.on('startonlogin', () => {
  app.setLoginItemSettings({
    openAtLogin: true,
  })
})

ipcMain.on('notstartonlogin', () => {
  app.setLoginItemSettings({
    openAtLogin: false,
  })
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})