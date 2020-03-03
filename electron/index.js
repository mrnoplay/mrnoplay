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
const {
  ebtMain
} = require('electron-baidu-tongji');
ebtMain(ipcMain);
const AutoLaunch = require('auto-launch');
const isDevMode = require('electron-is-dev');
const i18n = require('i18n');
const Store = require('electron-store');
const store = new Store();
const cmd = require('node-cmd');
const regedit = require('regedit');
var moment = require('moment');
const {
  CapacitorSplashScreen
} = require('@capacitor/electron');
const path = require('path');
const shutdown = require('electron-shutdown-command'); //shutdown windows
var applescript = require('applescript'); //use applescript to shutdown mac
let canQuit = false;
let canBlur = false;

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
  }

  i18n.configure({
    locales: ['en', 'zh'],
    directory: __dirname + '/locale'
  });
  i18n.setLocale(store.get('lang', 'en'));

  if (process.platform != 'win32') {
    mainWindow.hide();
    cmd.get(
      'who -b',
      function (err, data, stderr) {
        if (!err) {
          var reg = /[A-Z]?[a-z]{2}\s{1,}[0-9]{1,}\s[0-9]{1,}:[0-9]{1,}/;
          var datamatched = data.match(reg);
          var startdate = moment(moment().year().toString() + " " + datamatched.toString());
          var nowdate = moment();
          var timepast = Number(nowdate - startdate);
          if (timepast <= 90000 && timepast > 0) {
            setTimeout(() => {
              if (!canBlur) {
                mainWindow.show();
                mainWindow.focus();
              }
              mainWindow.setKiosk(true);
              update_onstart();
            }, 10000);
          } else {
            mainWindow.on('ready-to-show', function () {
              if (!canBlur) {
                mainWindow.show(); // 初始化后再显示
                mainWindow.focus();
              }
              mainWindow.setKiosk(true);
              update_onstart();
            })
          }
        } else {
          mainWindow.on('ready-to-show', function () {
            if (!canBlur) {
              mainWindow.show(); // 初始化后再显示
              mainWindow.focus();
            }
            mainWindow.setKiosk(true);
            update_onstart();
          })
        }
      }
    );
  } else {
    mainWindow.on('ready-to-show', function () {
      if (!canBlur) {
        mainWindow.show(); // 初始化后再显示
        mainWindow.focus();
      }
      mainWindow.setKiosk(true);
      update_onstart();
    })
  }

  // 获得开机时间 mac: who -b win: systeminfo /fo CSV 再处理

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
    mainWindow.hide();
    mainWindow.show();
    mainWindow.focus();
    mainWindow.moveTop();
    mainWindow.center();
  })

  mainWindow.on('blur', (event) => {
    if (mainWindow.isKiosk() && !canBlur) {
      mainWindow.hide();
      mainWindow.setKiosk(false);
      mainWindow.focus();
      mainWindow.setKiosk(true);
      mainWindow.show();
    }
  })

  mainWindow.on('focus', (event) => {
    if (mainWindow.isKiosk() && canBlur) {
      canBlur = false;
    }
  })

  mainWindow.on('show', (event) => {
    if (mainWindow.isKiosk() && canBlur) {
      canBlur = false;
    }
  })

  globalShortcut.register('CommandOrControl+Shift+L', () => {
    mainWindow.openDevTools();
  })

  globalShortcut.register('CommandOrControl+Shift+Q', () => {
    canQuit = true;
    app.quit();
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some Electron APIs can only be used after this event occurs.
app.on('ready', (event, arg) => {
  createWindow(event);
  if (process.platform === 'win32') {
    app.setAppUserModelId("com.scrisstudio.mrnoplay");
  }
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    canQuit = true;
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
  canBlur = false;
  if (mainWindow) {
    mainWindow.show();
    mainWindow.center();
    mainWindow.setKiosk(true);
  }
});

ipcMain.on('normal-screen', function () {
  mainWindow.focus();
  canBlur = true;
  if (mainWindow) {
    mainWindow.setKiosk(false);
  }
  setTimeout(function () {
    canBlur = true;
    if (mainWindow) {
      mainWindow.setKiosk(false);
    }
  }, 1000);
});

ipcMain.on('exit', () => {
  canQuit = true;
  app.quit();
});

function shutdowner() {
  canBlur = true;
  if (mainWindow) {
    mainWindow.setKiosk(false);
  }
  if (process.platform === 'win32') {
    shutdown.shutdown();
  } else {
    var script = 'tell application "Finder" to shut down';
    applescript.execString(script, function (err) {});
    canQuit = true;
    app.quit();
  }
}

ipcMain.on('shutdown', (event, arg) => {
  event.sender.send('timingdone', true);
  shutdowner();
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

ipcMain.on('github', (event, arg) => {
  canBlur = true;
  shell.openExternal('https://github.com/scris/mrnoplay/');
  if (mainWindow) {
    mainWindow.hide();
  }
})

ipcMain.on('website', (event, arg) => {
  canBlur = true;
  shell.openExternal('https://mrnoplay.scris.top');
  if (mainWindow) {
    mainWindow.hide();
  }
})

ipcMain.on('feedback-cn', (event, arg) => {
  canBlur = true;
  shell.openExternal('https://support.qq.com/products/127085?');
  if (mainWindow) {
    mainWindow.hide();
  }
})

ipcMain.on('feedback-en', (event, arg) => {
  canBlur = true;
  shell.openExternal('mailto:tianze@scris.top');
  if (mainWindow) {
    mainWindow.hide();
  }
})

ipcMain.on('askforautolaunch', (event, arg) => {
  dialog.showMessageBox({
    message: i18n.__('askforautolaunch'),
    type: 'question',
    buttons: [i18n.__('yes'), i18n.__('no')],
  }, (response) => {
    if (response == 0) {
      mrlauncher.enable();
    }
  });
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
    if (signal == 1) {
      canBlur = true;
      dialog.showMessageBox({
        message: i18n.__('updatefail')
      });
    } else if (signal == 2) {
      dialog.showMessageBox({
        message: i18n.__('updateok')
      });
      canBlur = true;
      shell.openExternal('https://github.com/scris/mrnoplay/releases');
      if (mainWindow) {
        mainWindow.hide();
      }
    } else {
      canBlur = true;
      dialog.showMessageBox({
        message: i18n.__('noupdate')
      });
    }
  });
});

function update_onstart() {
  var signal = 1;
  var info = '';
  request('https://gitee.com/scris/mrnoplay-update/raw/master/package.json', function (error, response, body) {
    if (error || response.statusCode != 200) {
      signal = 1;
    } else {
      try {
        let data = JSON.parse(body);
        if (compareVersion(data.version, package.version) == 1) {
          signal = 2;
          if (store.get('lang') == 'en') info = data.manifest.en;
          else info = data.manifest.zh;
        } else {
          signal = 3;
        }
      } catch (jsonError) {
        signal = 1;
      }
    }
    if (signal == 2) {
      if(mainWindow) mainWindow.webContents.send('update_onstart', info);
    }
  });
}

ipcMain.on('cn', () => {
  i18n.setLocale('zh');
  store.set('lang', 'zh');
})

ipcMain.on('en', () => {
  i18n.setLocale('en');
  store.set('lang', 'en');
})