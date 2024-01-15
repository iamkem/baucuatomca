import { Plate } from "./plate.js";

window.onload = async () => {
  init();
};

function init() {
  const container = document.querySelector(".plate-wrapper");

  const plate = new Plate(container, {
    image: "./img/plate.png",
    width: 300,
    height: 300,
    dices: 3, /// default 3
  });
}
