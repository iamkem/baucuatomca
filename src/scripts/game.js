import { Plate } from "./plate.js";
import { Board } from "./board.js";

let plateFront, plateBack, board;

const startBtn = document.getElementById("btn-start");
const pbElement = document.querySelector(".plate_back");
const pfElement = document.querySelector(".plate_front");
const boardElement = document.querySelector(".board");

let isOpen = false;

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
}

const shakePlate = () => {
  return new Promise((resolve) => {
    pbElement.classList.add("shakePlate");

    setTimeout(resolve, 1000);
  });
};

function start() {
  startBtn.disabled = true;
  startBtn.innerText = "Đang xóc...";

  pbElement.classList.add("movePlate");

  setTimeout(() => {
    plateFront.roll();

    shakePlate().then(() => {
      startBtn.innerText = "Mở";
      startBtn.disabled = false;

      isOpen = true;
    });
  }, 1000);
}

function open() {
  pbElement.classList.add("openPlate");

  setTimeout(reset, 1000);

  startBtn.innerText = "Xóc";

  isOpen = false;
}

function reset() {
  pbElement.classList.remove("shakePlate");
  pbElement.classList.remove("movePlate");
  pbElement.classList.remove("openPlate");
}

window.onload = () => {
  initGame();

  startBtn.addEventListener("click", () => {
    if (isOpen) {
      open();
    } else {
      start();
    }
  });
};
