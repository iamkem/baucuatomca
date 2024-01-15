import { Dice } from "./dice.js";

export class Plate {
  constructor(container, props = {}) {
    this.height = props.height;
    this.width = props.width;
    this.dices = props.dices;
    this.image = props.image;

    this.add(container);
  }

  add(container) {
    this._plateContainer = container;

    this.canvas = document.createElement("canvas");

    this.canvas.width = this._width;

    this.canvas.height = this._height;

    this._context = this.canvas.getContext("2d");

    this._plateContainer.appendChild(this.canvas);
  }

  init(props = {}) {}

  draw() {
    const ctx = this._context;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.drawImage(this._image, 0, 0, this._width, this._height);

    this.drawDices(ctx);
  }

  drawDices(ctx) {
    this._dices.forEach((dice, index) => {
      const diceWidth = (this._width / this._dices.length) * 0.7;

      const diceHeight = (this._height / this._dices.length) * 0.7;

      let diceX = index * diceWidth * 1.1;

      let diceY = diceHeight * 1.5;

      ctx.drawImage(
        dice.images[dice.value - 1],
        diceX + diceWidth / 2,
        diceY,
        diceWidth,
        diceHeight,
      );
    });
  }

  get dices() {
    return this._dices;
  }

  set dices(value) {
    if (typeof value !== "number") {
      throw new Error("Dices must be a number");
    }

    let dices = [];

    for (let i = 0; i < value; i++) {
      dices.push(new Dice());
    }

    this._dices = dices;
  }

  get image() {
    return this._image;
  }

  set image(value) {
    if (typeof value !== "string") {
      throw new Error("Image must be a string");
    }

    const image = new Image();

    image.onload = () => {
      this.draw();
    };

    image.src = value;

    this._image = image;
  }

  get height() {
    return this._height;
  }

  set height(value) {
    if (typeof value !== "number") {
      throw new Error("Height must be a number");
    }

    this._height = value;
  }

  get width() {
    return this._width;
  }

  set width(value) {
    if (typeof value !== "number") {
      throw new Error("Width must be a number");
    }

    this._width = value;
  }
}
