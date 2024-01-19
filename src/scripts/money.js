export class Money {
  constructor(container, props = {}) {
    this.value = props.value;
    this.image = props.image;

    this.#draw(container);
  }

  #draw(container) {
    this.element = document.createElement("div");

    this.btn = document.createElement("button");

    this.btn.classList.add(`money_${this._value}`);

    this.btn.style.margin = "10px";
    this.btn.style.border = "none";
    this.btn.style.padding = "0";
    this.btn.style.cursor = "pointer";
    this.btn.style.padding = "8px";
    this.btn.style.borderRadius = "5px";
    this.btn.style.backgroundColor = "#f44336";
    this.btn.style.color = "white";
    this.btn.style.textAlign = "center";

    this.btn.innerHTML = new Intl.NumberFormat("vi-VN", {}).format(this._value);

    this.element.append(this.btn);

    container.appendChild(this.element);
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
  }

  get image() {
    return this._image;
  }

  set image(image) {
    this._image = image;
  }
}
