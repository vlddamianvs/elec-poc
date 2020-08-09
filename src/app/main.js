const path = require('path')
const {app, BrowserWindow} = require('electron')
const url = require('url')
require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});
const {ipcMain, shell} = require('electron')
const {autoUpdater} = require('electron-updater');

let win

function createWindow() {
    win = new BrowserWindow({
        width: 800, height: 600, webPreferences: {
            nodeIntegration: true
        }
    })
    win.webContents.openDevTools()
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))
}

app.on('ready', () => {
    console.log("app ready, creating main renderer")
    shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture')
    createWindow();
    autoUpdater.checkForUpdatesAndNotify();
    sendStatusToWindow("App REady")
    // setTimeout(() => {
    //     sendStatusToWindow("message from main process")
    // }, 3000)
})

function sendStatusToWindow(msg){
    console.log("Seding " , msg)
    win.webContents.send('message', msg)
}

autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
    sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('Update downloaded');
});


