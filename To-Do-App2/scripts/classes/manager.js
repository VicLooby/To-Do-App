// manager class

import { nanoid } from "https://esm.sh/nanoid";
import rfdc from "https://esm.sh/rfdc";
import deepmerge from "https://esm.sh/deepmerge";

const clone = rfdc({ proto: true });

export default class Manager {
  #items = [];

  constructor({ startingData = [], itemClass } = {}) {

    if (!Array.isArray(startingData))
      throw new Error(
        `'startingData' must be an array; instead received ${startingData} (of type ${typeof startingData})`
      );

    if (typeof itemClass !== 'function')
      throw new Error(
        `'itemClass' must be a constructor function or class; instead received ${itemClass} (of type ${typeof itemClass})`
      );


    Object.defineProperty(this, "_id", { value: nanoid(), enumerable: true });

    Object.defineProperty(this, "itemClass", { value: itemClass });

    this.createItems(startingData);
  }

  // * Create
  createItem(data) {
    const newItem = new this.itemClass(data);
    this.#items = this.#items.toSpliced(this.#items.length, 0, newItem);
    return newItem._id;
  }

  createItems(data = []) {
    for (const item of data) {
      this.createItem(item);
    }
  }

  // * Read
  findItemIdByField(field = "", value = "") {
    return clone(
      this.#items.find((item) => {
        return item[field] === value;
      })?._id ?? null
    );
  }

  // * Update
  updateItem(id, updates = {}) {
    console.log(`updating item with id: ${id} with`, updates);

    const idx = this.#items.findIndex((item) => {
      return item._id === id;
    });

    if (idx === -1) {
      throw new Error(`Item with id ${id} not found`);
    }

    const item = this.#items[idx];
    const updatedItem = new this.itemClass(deepmerge(item, updates));
    this.#items = this.#items.toSpliced(idx, 1, updatedItem);
  }

  // * Delete
  removeItem(id) {
    const idx = this.#items.findIndex(({ _id }) => {
      return _id === id;
    });

    console.log("idx", idx);

    if (idx === -1) {
      throw new Error(`Item with id ${id} not found`);
    }
    const removedItem = this.#items[idx];
    this.#items = this.#items.toSpliced(idx, 1);
    return removedItem;
  }

  // Read & print
  render(fn = Manager.consoleRender) {
    const clonedItems = clone(this.#items);
    return fn(clonedItems);
  }

  static consoleRender = (items) => {
    if (!items?.length) return console.log("No items to display");
    console.table(items);
  };
}
