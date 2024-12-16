// app class

import Manager from "./manager.js";
import Todo from "./todo.js";

export default class TodosApp extends Manager {
  constructor({
    owner,
    startingData,
    storageKey = "todos",
    hydrate = true,
  } = {}) {
    super({ startingData, itemClass: Todo });

    if (typeof owner !== "string")
      throw new Error(
        `An app requires an owner (of type 'string'); instead received ${owner} (of type ${typeof owner})`
      );

    if (typeof storageKey !== "string")
      throw new Error(
        `An app requires an storageKey (of type 'string'); instead received ${storageKey} (of type ${typeof storageKey})`
      );

    if (typeof hydrate !== "boolean")
      throw new Error(
        `'hydrate' must be a boolean; instead received ${hydrate} (of type ${typeof hydrate})`
      );

    Object.defineProperty(this, "owner", { value: owner, enumerable: true });
    Object.defineProperty(this, "storageKey", {
      value: `${owner.toLowerCase()}-${storageKey}`,
      enumerable: true,
    });

    Object.freeze(this);

    if (hydrate) {
      this.hydrateApp();
    }
  }

  // Convenience Methods
  markAsDone(id) {
    const result = super.updateItem(id, { done: true });
    this.persistData();
    return result;
  }

  markAsUndone(id) {
    const result = super.updateItem(id, { done: false });
    this.persistData();
    return result;
  }

  // Aliases
  createTodo(data) {
    const itemId = super.createItem(data);
    this.persistData();
    return itemId;
  }

  updateTodo(id, updates) {
    super.updateItem(id, updates);
    this.persistData();
  }

  removeTodo(id) {
    const item = super.removeItem(id);
    this.persistData();
    return item;
  }

  // 'persist' the data
  persistData({ key = this.storageKey } = {}) {
    super.render(function (todos) {
      console.log(todos);
      localStorage.setItem(key, JSON.stringify(todos));
    });
  }

  // 'hydrate' the app
  hydrateApp({ key = this.storageKey } = {}) {
    const todosData = JSON.parse(localStorage.getItem(key)) || [];
    super.createItems(todosData);
  }

  getAllTodos() {
    return super.render(function (todos) {
      return todos;
    });
  }

  getTodoById(id) {
    const todo = super.render(function (todos) {
      const t = todos.find(({ _id }) => _id === id);
      return t;
    });
    return todo;
  }

  render({ fn = function () { console.log(...arguments)} }={}) {
    const { owner } = this;
    return super.render(function (todos) {
      return fn({ todos, owner });
    });
  }
}
