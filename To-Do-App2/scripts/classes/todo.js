// type class

import { nanoid } from "https://esm.sh/nanoid";

export default class Todo {
  constructor({ title='', duration='not given', done=false, _id= nanoid()}={}) {

    // check
    if (typeof title !== "string") throw new Error(
        `A todo requires an 'title' (of type 'string'); instead received ${title} (of type ${typeof title})`
      );

    if (!title.length) throw new Error(
      `'title' cannot be an empty string`
    );

    if (typeof duration !== "string") throw new Error(
      `A todo requires an 'duration' (of type 'string'); instead received ${duration} (of type ${typeof duration})`
    );

    if (typeof done !== "boolean") throw new Error(
      `A todo requires an 'done' value (of type 'boolean'); instead received ${done} (of type ${typeof done})`
    );

    this._id = _id;

    this.title = title;
    this.duration = duration;
    this.done = done;

    Object.freeze(this);
  }
}
