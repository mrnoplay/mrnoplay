const {
  app,
  BrowserWindow,
  Menu,
  powerSaveBlocker,
  ipcMain,
  globalShortcut,
  Tray,
  shell,
  dialog,
} = require('electron');
const  AutoLaunch = require('auto-launch');
const isDevMode = require('electron-is-dev');
const {
  CapacitorSplashScreen
} = require('@capacitor/electron');
const path = require('path');
const shutdown = require('electron-shutdown-command'); //shutdown windows
var applescript = require('applescript'); //use applescript to shutdown mac
let canQuit = false;

// Place holders for our windows so they don't get garbage collected.
let mainWindow = null;

// Placeholder for SplashScreen ref
let splashScreen = null;

//Change this if you do not wish to have a splash screen
let useSplashScreen = false;

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required') // 允许自动播放音频

powerSaveBlocker.start('prevent-app-suspension') //防止app被挂起，停止计时

let tray = null;

const request = require('request');
const compareVersion = require('compare-version');
const nowtime = new Date().getTime();

var package = require("./package.json");

// Create simple menu for easy devtools access, and for demo
const menuTemplateDev = [{
  label: '选项',
  submenu: [{
    label: '开发者工具',
    click() {
      mainWindow.openDevTools();
    },
  }, ],
}, ];

async function createWindow() {
  if (process.platform === 'darwin') {
    const template = [];
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
    mainWindow.setKiosk(true);
  }

  mainWindow.on('ready-to-show', function () {
    mainWindow.show() // 初始化后再显示
  })  

  mainWindow.on('close', (event) => {
    if (!canQuit) {
      event.preventDefault();
      event.sender.send('closenotification', true);
    } else {
      mainWindow = null;
    }
  });

  const gotTheLock = app.requestSingleInstanceLock()
  if (!gotTheLock) {
    app.quit()
  } else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
        mainWindow.show();
      }
    })
  }

  mainWindow.webContents.on('crashed', (event) => {
    if (mainWindow.isDestroyed()) {
      app.relaunch();
      app.exit(0);
    } else {
      mainWindow.destroy();
      mainWindow.reload();
    }
    event.sender.send('crashback', true);
  });

  mainWindow.setSkipTaskbar(true);
  if (process.platform == 'darwin') {
    app.dock.hide();
  }

  if (process.platform == 'win32') {
    tray = new Tray(path.join(__dirname, 'tray.win.png'));
  } else {
    tray = new Tray(path.join(__dirname, 'tray.mac.Template.png'));
  }
  tray.on('click', () => {
    mainWindow.show();
    mainWindow.focus();
    mainWindow.moveTop();
    mainWindow.center();
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some Electron APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();
  if (process.platform === 'win32') {
    app.setAppUserModelId("com.scrisstudio.mrnoplay");
  }
  update_onstart();
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
ipcMain.on('full-screen', function () {
  if (mainWindow) {
    mainWindow.show();
    mainWindow.setKiosk(true);
  }
});

ipcMain.on('normal-screen', function () {
  if (mainWindow) {
    mainWindow.setKiosk(false);
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
    applescript.execString(script, function (err) {});
    canQuit = true;
    app.quit();
  }
})

var mrlauncher = new AutoLaunch({
  name: 'Mr Noplay',
})

ipcMain.on('startonlogin', () => {
  mrlauncher.enable();
})

ipcMain.on('notstartonlogin', () => {
  mrlauncher.disable();
})

ipcMain.on('focus', () => {
  if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
    mainWindow.moveTop();
    mainWindow.center();
  }
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

ipcMain.on('github', (event,arg) => {
  shell.openExternal('https://github.com/scris/mrnoplay/');
  if(mainWindow) {
    mainWindow.hide();
  }
})

ipcMain.on('website', (event,arg) => {
  shell.openExternal('https://mrnoplay.scris.top');
  if(mainWindow) {
    mainWindow.hide();
  }
})

ipcMain.on('checkupdate', (event, arg) => {
  var signal = 1;
  request('https://gitee.com/scris/mrnoplay-update/raw/master/package.json', function (error, response, body) {
    if (error || response.statusCode != 200) {
      signal = 1;
    } else {
      try {
        let data = JSON.parse(body);
        if (compareVersion(data.version, package.version) == 1) {
          signal = 2;
        } else {
          signal = 3;
        }
      } catch (jsonError) {
        signal = 1;
      }
    }
    if(signal == 1){
      dialog.showMessageBox({
        message: '更新失败，请检查网络设置。\nUpdate failed, please check your network settings.'
      });
    }
    else if(signal == 2) {
      dialog.showMessageBox({
        message: '有更新可用。\nCan be updated.'
      });
      shell.openExternal('https://github.com/scris/mrnoplay/releases');
      if(mainWindow) {
        mainWindow.hide();
      }
    } else {
      dialog.showMessageBox({
        message: '没有更新，过一会再来哦！\nYou\'re up to date.'
      });
    }
  });
});

function update_onstart() {
  var signal = 1;
  request('https://gitee.com/scris/mrnoplay-update/raw/master/package.json', function (error, response, body) {
    if (error || response.statusCode != 200) {
      signal = 1;
    } else {
      try {
        let data = JSON.parse(body);
        if (compareVersion(data.version, package.version) == 1) {
          signal = 2;
        } else {
          signal = 3;
        }
      } catch (jsonError) {
        signal = 1;
      }
    }
    if(signal == 2) {
      dialog.showMessageBox({
        message: '有更新可用。需要下载吗？\nFound an update. Would you like to download it?',
        type: 'question',
        buttons: ['确定 Yes', '取消 No'],
      },(response) => {
        if(response == 0) {
          shell.openExternal('https://github.com/scris/mrnoplay/releases');
          if(mainWindow) {
            mainWindow.hide();
          }
        }
      });
    }
  });
}