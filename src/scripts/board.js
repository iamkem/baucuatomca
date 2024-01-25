class BoardItem {
  constructor(props = {}) {
    this.image = props.image;
    this.value = props.value;
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

  get value() {
    return this._value;
  }

  set value(val) {
    if (typeof val !== "number") {
      throw new Error("Value must be a number");
    }

    this._value = val;
  }

  get betValue() {
    return this._betValue;
  }

  set betValue(val) {
    if (typeof val !== "number") {
      throw new Error("Value must be a number");
    }

    this._betValue = val;
  }
}

export class Board {
  constructor(container, props = {}) {
    this._height = props.height;
    this._width = props.width;

    this.#items = props.itemsLength;
    this.#init(container);

    this.disabled = props.disabled || false;
    this.onClick = props.onClick;
  }

  #createItem(item) {
    const img = document.createElement("img");

    const imgWidth = this._width / 3;
    const imgHeight = this._height / 2;

    img.style.width = `${imgWidth}px`;
    img.style.height = `${imgHeight}px`;
    img.style.margin = "10px";

    img.src = item.image.src;

    img.addEventListener("click", (event) => {
      if (!this._disabled) {
        this.onClick(event, item);
      }
    });

    return img;
  }

  #init(container) {
    if (this._items.length < 6) {
      throw new Error("Not enough items to display");
    }

    const half = Math.floor(this._items.length / 2);

    const [topImages, bottomImages] = [
      this._items.slice(0, half),
      this._items.slice(half),
    ];

    const rows = [];

    for (let i = 0; i < 2; i++) {
      const row = document.createElement("div");

      row.style.display = "flex";
      row.style.justifyContent = "center";

      rows.push(row);
    }

    const [row1, row2] = rows;

    topImages.forEach((item) => {
      const img = this.#createItem(item);

      row1.appendChild(img);

      container.appendChild(row1);
    });

    bottomImages.forEach((item) => {
      const img = this.#createItem(item);

      row2.appendChild(img);

      container.appendChild(row2);
    });
  }

  get #items() {
    return this._items;
  }

  set #items(val) {
    if (typeof val !== "number") {
      throw new Error("Values must be a number");
    }

    if (typeof val === "undefined") {
      val = 6;
    }

    let items = [];

    for (let i = 0; i < val; i++) {
      const item = new BoardItem({
        image: `./img/${i + 1}.png`,
        value: i + 1,
      });

      items.push(item);
    }

    this._items = items;
  }

  set disabled(val) {
    if (typeof val !== "boolean") {
      throw new Error("Value must be a boolean");
    }

    this._disabled = val;
  }

  get disabled() {
    return this._disabled;
  }
}
