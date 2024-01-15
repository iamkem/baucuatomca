export class Dice {
  constructor(props = {}) {
    this.init(props);
  }

  init(props = {}) {
    this.value = props.value;
    this.images = props.images;
  }

  roll() {
    this._value = Math.floor(Math.random() * 6) + 1;
  }

  get images() {
    return this._images;
  }

  set images(val) {
    let images = [];

    if (Array.isArray(val)) {
      Array.from(val).map((image) => {
        let img;

        if (typeof image === "string") {
          img = new Image();
          img.src = image;
        }

        images.push(img);
      });
    } else if (typeof val === "undefined") {
      for (let i = 1; i <= 6; i++) {
        let img = new Image();
        img.src = `./img/${i}.png`;

        images.push(img);
      }
    }

    this._images = images;
  }

  get value() {
    return this._value;
  }

  set value(val) {
    if (typeof val !== "undefined") {
      this._value = val;
    } else {
      this.roll();
    }
  }
}
