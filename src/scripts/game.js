import { Plate } from "./plate.js";
import { Board } from "./board.js";
import { Player } from "./player.js";
import { Money } from "./money.js";

let plateFront, plateBack, board;

const startBtn = document.getElementById("btn-start");
const pbElement = document.querySelector(".plate_back");
const pfElement = document.querySelector(".plate_front");
const boardElement = document.querySelector(".board");
const playersElement = document.querySelector(".players");
const moneyValuesElement = document.querySelector(".money_values");

let isOpen = false;

let currentValues = [];

const moneyValues = [1000, 5000, 10000, 20000, 50000, 100000, 200000, 500000];

let currentMoneyValue = moneyValues[0];

function initGame() {
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

  initPlayers();

  initMoneyValues();
}

function initPlayers() {
  const me = new Player(playersElement, {
    id: 1,
    role: "host",
    name: "Kem",
    money: 500000,
    image: "./img/avatar.png",
  });

  console.log(me);
}

function initMoneyValues() {
  moneyValues.forEach((value, i) => {
    const money = new Money(moneyValuesElement, {
      value,
    });

    money.btn.addEventListener("click", () => {
      currentMoneyValue = value;


    });
  });
}

const shakePlate = () => {
  return new Promise((resolve) => {
    pbElement.classList.add("shakePlate");

    setTimeout(resolve, 1000);
  });
};

function luckyRoll() {
  startBtn.disabled = true;
  startBtn.innerText = "Đang xóc...";

  pbElement.classList.add("movePlate");

  setTimeout(() => {
    plateFront.roll((values) => {
      currentValues = values;
    });

    shakePlate().then(() => {
      startBtn.innerText = "Mở";
      startBtn.disabled = false;

      isOpen = true;
    });
  }, 1000);
}

function open() {
  console.log("win values:", currentValues);

  pbElement.classList.add("openPlate");

  setTimeout(reset, 1000);

  startBtn.innerText = "Xóc";

  isOpen = false;
}

function reset() {
  pbElement.classList.remove("shakePlate");
  pbElement.classList.remove("movePlate");
  pbElement.classList.remove("openPlate");

  currentValues.length = 0;
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
};
