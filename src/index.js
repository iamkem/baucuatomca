const {
  app,
  BrowserWindow,
  screen,
  ipcMain,
  ipcRenderer,
} = require("electron");

const path = require("node:path");

const Store = require("electron-store");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

let startWindow, gameWindow, roomListWindow;

const createStartWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  startWindow = new BrowserWindow({
    width,
    height,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  startWindow
    .loadFile(path.join(__dirname, "start.html"))
    .then(() => {
      console.log("Start window loaded");
    })
    .catch(() => {});

  startWindow.webContents.openDevTools();

  startWindow.on("closed", () => {
    startWindow = null;
  });
};

const createRoomListWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  roomListWindow = new BrowserWindow({
    width,
    height,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  roomListWindow
    .loadFile(path.join(__dirname, "room_list.html"))
    .then(() => {
      console.log("Room list window loaded");
    })
    .catch(() => {});

  roomListWindow.webContents.openDevTools();

  roomListWindow.on("closed", () => {
    roomListWindow = null;
  });
};

const createGameWindow = (isHost = true) => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  // const filePath = isHost ? "game_host.html" : "game_client.html";

  gameWindow = new BrowserWindow({
    width,
    height,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  gameWindow
    .loadFile(path.join(__dirname, "game_host.html"))
    .then(() => {
      console.log("Game window loaded");
    })
    .catch(() => {});

  gameWindow.webContents.openDevTools();

  gameWindow.on("closed", () => {
    gameWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createStartWindow();

  Store.initRenderer();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createStartWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on("room-list", () => {
  if (startWindow) {
    startWindow.close();
  }

  createRoomListWindow();
});

ipcMain.on("start-game", (event, data) => {
  if (roomListWindow) {
    roomListWindow.close();
  }

  createGameWindow(data.isHost);
});

ipcMain.on("exit-room", () => {
  if (gameWindow) {
    gameWindow.close();
  }

  createRoomListWindow();
});
