export class Player {
  constructor(container, props = {}) {
    this.id = props.id;
    this.role = props.role;
    this.name = props.name;
    this.money = props.money || 500000;
    this.image = props.image;

    this.#draw(container);
  }

  #draw(container) {
    const e = document.createElement("div");
    const img = document.createElement("img");
    const name = document.createElement("p");
    const money = document.createElement("p");

    e.classList.add(`player_${this._id}_${this._role}_${this._name}`);

    e.style.margin = "10px";

    img.src = this._image.src;

    img.height = 50;
    img.width = 50;

    name.innerText = this._name;
    name.style.color = "white";
    name.style.margin = "0";
    name.style.fontSize = "12px";
    name.style.textAlign = "center";

    money.innerText = new Intl.NumberFormat("vi-VN", {}).format(this._money);
    money.style.color = "white";
    money.style.margin = "0";
    money.style.fontSize = "12px";
    money.style.alignSelf = "center";

    e.append(img, name, money);

    container.appendChild(e);
  }

  get id() {
    return this._id;
  }

  set id(val) {
    if (typeof val !== "number") {
      throw new Error("Id must be a number");
    }

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
}
