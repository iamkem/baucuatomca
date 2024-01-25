const { ipcRenderer } = require("electron");

const firebase = require("firebase/compat/app");
require("firebase/compat/firestore");

import { Plate } from "./plate.js";
import { Board } from "./board.js";
import { Player } from "./player.js";
import { Money } from "./money.js";

import { StoreManager } from "./store.js";

let plateFront, plateBack, board;

const startBtn = document.getElementById("btn_roll");
const cancelBtn = document.getElementById("btn_cancel");
const exitBtn = document.getElementById("btn_exit_room");
const pbElement = document.querySelector(".plate_back");
const pfElement = document.querySelector(".plate_front");
const boardElement = document.querySelector(".board");
const playersElement = document.querySelector(".players");
const moneyValuesElement = document.querySelector(".money_values");

let isOpen = false;

let currentValues = [];

const moneyValues = [1000, 5000, 10000, 20000, 50000, 100000, 200000, 500000];

let currentMoneyValue = moneyValues[0];

const currentRoomId = StoreManager.get("currentRoomId");

const db = firebase.firestore();

let roomRef, currentRoom;

let me = StoreManager.get("player");

let roomPlayers = [];

const game = {
  winValues: [],
  isRolling: false,
  isOpen: false,
};

async function initGame() {
  plateFront = new Plate(pfElement, {
    image: "./img/plate.png",
    width: 300,
    height: 300,
    dices: 3, /// default 3
  });

  plateBack = new Plate(pbElement, {
    image: "./img/plate_back.png",
    width: 300,
    height: 300,
  });

  board = new Board(boardElement, {
    width: 700,
    height: 300,
    itemsLength: 6,
  });

  if (typeof me.id === "undefined") {
    me.id = me._id;
  }

  initMoneyValues();

  initRoom().then(() => {
    registerRoomListener();
  });

  board.onClick = (event, item) => {
    bet(item.value);
  };

  cancelBtn.addEventListener("click", cancelBet);
}

async function initRoom() {
  roomRef = db.collection("rooms").doc(currentRoomId);

  currentRoom = (await roomRef.get()).data();

  const { players } = currentRoom;

  checkRoomRole();

  players.forEach(addPlayer);

  await roomRef.update({ players });
}

function registerRoomListener() {
  roomRef.onSnapshot((doc) => {
    currentRoom = doc.data();

    console.log("room update", currentRoom);

    const { players } = currentRoom;

    if (players.length > 0) {
      updatePlayers(players);

      players.forEach(updatePlayer);
    }
  });
}

function checkRoomRole() {
  const { host } = currentRoom;

  if (host.id === me.id) {
    cancelBtn.style.display = "none";

    moneyValuesElement.style.display = "none";

    board.disabled = true;
  } else {
    startBtn.style.display = "none";
  }
}

const getRole = () => (currentRoom.host.id === me.id ? "host" : "player");

const updatePlayers = (players) => {
  roomPlayers = roomPlayers.filter((player) => {
    const index = players.findIndex((p) => p.id === player.id);

    if (index === -1) {
      player.exit();

      return false;
    }

    return true;
  });
};

const updatePlayer = (player) => {
  let playerIndex = roomPlayers.findIndex((p) => p.id === player.id);

  if (playerIndex === -1) {
    addPlayer(player);
  } else {
    const p = roomPlayers[playerIndex];

    p.money = player.money;
    p.betItem = player.betItem;

    console.log("update player", p);

    p.update();
  }
};

function addPlayer(data) {
  const player = new Player(playersElement, {
    ...data,
    role: getRole(),
    image: "./img/avatar.png",
  });

  if (data.id === me.id) {
    me = player;

    StoreManager.set("player", me);
  }

  console.log("player added", player);

  roomPlayers.push(player);
}

function bet(value) {
  if (currentMoneyValue > me.money) {
    console.log("Not enough money");

    return;
  }

  const { players } = currentRoom;

  const playerIndex = players.findIndex((player) => player.id === me.id);

  players[playerIndex].betItem = { [value]: currentMoneyValue };

  roomRef.update({ players });
}

function cancelBet() {
  const { players } = currentRoom;

  const playerIndex = players.findIndex((player) => player.id === me.id);

  delete players[playerIndex].betItem;

  roomRef.update({ players });
}

function onMoneyValueChange(value, mIndex) {
  currentMoneyValue = value;

  Array.from(moneyValuesElement.children).forEach((child, childIndex) => {
    const btn = child.querySelector("button");

    if (childIndex === mIndex) {
      btn.style.border = "2px solid white";
    } else {
      btn.style.border = "none";
    }
  });
}

function initMoneyValues() {
  moneyValues.forEach((value, index) => {
    const money = new Money(moneyValuesElement, {
      value,
      currentMoneyValue,
    });

    if (index === 0) {
      money.btn.style.border = "2px solid white";
    }

    money.btn.addEventListener("click", () => {
      onMoneyValueChange(value, index);
    });
  });
}

function checkWin() {
  const { players, host } = currentRoom;

  players.forEach((player) => {
    const { betItem } = player;

    if (betItem) {
      const item = Object.keys(betItem)[0];

      const value = Object.values(betItem)[0];

      const isWin = currentValues.includes(parseInt(item));

      let valueCount = 1;

      if (isWin) {
        valueCount = currentValues.filter((v) => v === parseInt(item)).length;

        player.money += value * valueCount;
        host.money -= value * valueCount;
      } else {
        player.money -= value;
        host.money += value;
      }
    }

    delete player.betItem;
  });

  const hostPlayer = players.find((player) => player.id === host.id);

  hostPlayer.money = host.money;

  roomRef.update({ players, host });
}

const isCanRoll = () => {
  let { players } = currentRoom;

  players = players.filter((player) => player.id !== me.id);

  return players.every((player) => player.betItem);
};

const shakePlate = () => {
  return new Promise((resolve) => {
    pbElement.classList.add("shakePlate");

    setTimeout(resolve, 1000);
  });
};

function generateRandomValues() {
  const values = [];

  for (let i = 0; i < 3; i++) {
    const random = Math.floor(Math.random() * 6) + 1;

    values.push(random);
  }

  return values;
}

function luckyRoll() {
  if (!isCanRoll()) {
    alert("Người chơi chưa đặt cược");

    console.log("Players are not ready");

    return;
  }

  currentValues = generateRandomValues();

  game.winValues = currentValues;
  game.isRolling = true;

  roomRef.update({ game });

  startBtn.disabled = true;
  startBtn.innerText = "Đang xóc...";

  pbElement.classList.add("movePlate");

  setTimeout(() => {
    plateFront.customRoll(currentValues);

    game.isRolling = false;

    roomRef.update({ game });

    shakePlate().then(() => {
      startBtn.innerText = "Mở";
      startBtn.disabled = false;

      isOpen = true;
    });
  }, 1000);
}

function open() {
  console.log("win values:", currentValues);

  game.isOpen = true;

  roomRef.update({ game });

  pbElement.classList.add("openPlate");

  setTimeout(reset, 1000);

  startBtn.innerText = "Xóc";

  isOpen = false;

  checkWin();
}

function reset() {
  pbElement.classList.remove("shakePlate");
  pbElement.classList.remove("movePlate");
  pbElement.classList.remove("openPlate");

  currentValues.length = 0;
}

function exitRoom() {
  const { players } = currentRoom;

  const playerIndex = players.findIndex((player) => player.id === me.id);

  StoreManager.set("player", players[playerIndex]);

  StoreManager.delete("currentRoomId");

  players.splice(playerIndex, 1);

  roomRef.update({ players });

  ipcRenderer.send("exit-room");
}

window.onload = () => {
  initGame();

  startBtn.addEventListener("click", () => {
    if (isOpen) {
      open();
    } else {
      luckyRoll();
    }
  });

  exitBtn.addEventListener("click", () => {
    exitRoom();
  });
};
