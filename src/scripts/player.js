export class Player {
  constructor(container, props = {}) {
    this.id = props.id;
    this.role = props.role;
    this.name = props.name;
    this.money = props.money || 500000;
    this.image = props.image;
    this.betItem = props.betItem;

    this.#draw(container);
  }

  #draw(container) {
    const e = document.createElement("div");
    const img = document.createElement("img");
    const name = document.createElement("p");
    const money = document.createElement("p");

    this._className = `player_${this._id}_${this._role}_${this._name}`;

    e.classList.add(this._className);

    e.style.margin = "10px";

    img.src = this._image.src;

    img.height = 60;
    img.width = 60;

    name.innerText = this._name;
    name.style.color = "white";
    name.style.margin = "0";
    name.style.fontSize = "15px";
    name.style.textAlign = "center";

    money.className = "money";
    money.innerText = new Intl.NumberFormat("vi-VN", {}).format(this._money);
    money.style.color = "white";
    money.style.margin = "0";
    money.style.fontSize = "15px";
    money.style.alignSelf = "center";

    e.append(img, name, money);

    container.appendChild(e);
  }

  remove() {
    const e = document.querySelector(`.${this._className}`);

    const imgContainer = e.querySelector(`.${this._betClassName}`);

    if (imgContainer) {
      e.removeChild(imgContainer);
    }
  }

  update() {
    const e = document.querySelector(`.${this._className}`);

    const money = e.querySelector("p:nth-child(3)");

    money.innerText = new Intl.NumberFormat("vi-VN", {}).format(this._money);

    if (this._betItem) {
      this._betClassName = `bet_${this._id}_${this._role}_${this._name}`;

      const item = Object.keys(this._betItem)[0];
      const value = Object.values(this._betItem)[0] / 1000;

      let imgContainer = e.querySelector(`.${this._betClassName}`);

      if (imgContainer) {
        const betImg = imgContainer.querySelector("img:first-child");
        const betValueImg = imgContainer.querySelector("img:last-child");

        betImg.src = `./img/${item}.png`;
        betValueImg.src = `./img/${value}k.jpg`;
      } else {
        imgContainer = document.createElement("div");

        imgContainer.classList.add(this._betClassName);

        imgContainer.style.marginTop = "5px";
        imgContainer.style.display = "flex";
        imgContainer.style.justifyContent = "center";

        const betImg = document.createElement("img");

        betImg.src = `./img/${item}.png`;
        betImg.style.height = "40px";
        betImg.style.width = "40px";
        betImg.style.zIndex = "2";
        betImg.style.marginTop = "5px";

        const betValueImg = document.createElement("img");

        betValueImg.src = `./img/${value}k.jpg`;
        betValueImg.style.height = "50px";
        betValueImg.style.width = "100px";
        betValueImg.style.position = "absolute";
        betValueImg.style.zIndex = "1";

        imgContainer.append(betImg, betValueImg);

        e.appendChild(imgContainer);
      }
    } else {
      this.remove();
    }
  }

  exit() {
    const e = document.querySelector(`.${this._className}`);

    e.remove();
  }

  get id() {
    return this._id;
  }

  set id(val) {
    this._id = val;
  }

  get role() {
    return this._role;
  }

  set role(val) {
    if (typeof val !== "string") {
      throw new Error("Role must be a string");
    }

    this._role = val;
  }

  get name() {
    return this._name;
  }

  set name(val) {
    if (typeof val !== "string") {
      throw new Error("Name must be a string");
    }

    this._name = val;
  }

  get money() {
    return this._money;
  }

  set money(val) {
    if (typeof val !== "number") {
      throw new Error("Money must be a number");
    }

    this._money = val;
  }

  get image() {
    return this._image;
  }

  set image(val) {
    if (typeof val !== "string") {
      throw new Error("Image must be a string");
    }

    const image = new Image();

    image.src = val;

    this._image = image;
  }

  get betItem() {
    return this._betItem;
  }

  set betItem(val) {
    this._betItem = val;
  }
}
