const noTodosMessage = document.createElement("div");
noTodosMessage.classList.add("alert", "alert-success");
noTodosMessage.setAttribute("role", "alert");
noTodosMessage.textContent = `You have no todos`;

function serialize(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
      const multis = Array.from(
      form.querySelectorAll('select[multiple], [type="checkbox"]')
    );
    const multiNames = Array.from(new Set(multis.map((input) => input.name)));
    console.log("multis", multis);

    if (multis.length) {
      for (const name of multiNames) {
        formData.set(name, formData.getAll(name));
      }
    }
    return data;
  }

  function populate(form, data = {}) {
    console.log("populate data", data);
    if (!form || !(form instanceof HTMLFormElement)) {
      throw new Error(
        `The populate function requires a form element. Instead received $form} of type ${form?.prototype?.Constructor?.name}`
      );
    }

    for (let [inputName, value] of Object.entries(data)) {
      value ??= "";

      const element = form[inputName];
      if (!element || !element instanceof Element) {
        console.warn(`Could not find element ${inputName}: bailing...`);
        continue;
      }
        const type = element.type || element[0].type;

      switch (type) {
        case "checkbox": {
          const values = Array.isArray(value) ? value : [value];
          const checkboxes = Array.isArray(element) ? element : [element];
          console.log("values", values);
          for (const checkbox of checkboxes) {
            console.log(checkbox.value);
            if (values.includes(checkbox.value)) {
              checkbox.checked = true;
            }
          }
          break;
        }
        case "select-multiple": {
          const values = Array.isArray(value) ? value : [value];

          for (const option of element) {
            if (values.includes(option.value)) {
              option.selected = true;
            }
          }
          break;
        }

        case "select":
        case "select-one":
          element.value = value.toString() || value;
          break;

        case "date":
          element.value = new Date(value).toISOString().split("T")[0];
          break;

        default:
          element.value = value;
          break;
      }
    }
  }

  const resetAllFormFields = (form) => {
    form.reset();

    for (const field of form.querySelectorAll('input[type="hidden"')) {
      field.value = "";
    }
  };

function validate(input) {
  const formRow = input.closest(".form-row");
  const errorLabel = formRow.querySelector("label.error");
  console.log(errorLabel);
  errorLabel.textContent = "";

  const validityState = input.validity;
  console.log("validityState", validityState);

  if (validityState.valueMissing) {
    errorLabel.textContent = "This field is required and cannot be blank!";
  } else if (validityState.tooShort) {
    errorLabel.textContent = `The title must be at least ${input.getAttribute(
      "min-length"
    )} characters long!`;
  }

  if (validityState.valid) {
    console.log("valid", validityState);
    formRow?.classList.remove("invalid");
  } else {
    console.log("invalid", validityState);
    formRow?.classList.add("invalid");
  }
}

function createTodoListItem({ todo = {} } = {}) {
  const { title, duration, done, _id } = todo;
  const row = document.createElement("div");
  row.classList.add("item-row");

  const span = document.createElement("span");
  span.classList.add("me-auto");
  span.textContent = `${title} (${duration})`;

  row.append(span);

  const updateButton = document.createElement("a");
  updateButton.href = `/update.html?id=${_id}`;
  updateButton.classList.add("btn", "btn-warning", "update");

  const updateAccessibilityTextSpan = document.createElement("span");
  updateAccessibilityTextSpan.classList.add("visually-hidden");
  updateAccessibilityTextSpan.textContent = "update";

  const updateIcon = document.createElement("span");
  updateIcon.setAttribute("aria-hidden", "true");
  updateIcon.classList.add("fa-solid", "fa-pen");

  updateButton.append(updateAccessibilityTextSpan, updateIcon);

  const removeButton = document.createElement("button");
  removeButton.classList.add("btn", "btn-danger", "remove");
  removeButton.dataset.id = _id;

  const removeAccessibilityTextSpan =
    updateAccessibilityTextSpan.cloneNode(true);
  removeAccessibilityTextSpan.textContent = "remove";

  const removeIcon = updateIcon.cloneNode(true);
  removeIcon.classList.replace("fa-pen", "fa-trash");

  removeButton.append(removeAccessibilityTextSpan, removeIcon);

  const doneButton = removeButton.cloneNode(false);
  doneButton.classList.replace(
    "btn-danger",
    done ? "btn-secondary" : "btn-success"
  );
  doneButton.classList.replace("remove", "done");
  doneButton.dataset.done = done;

  const doneAccessibilityTextSpan = updateAccessibilityTextSpan.cloneNode(true);
  doneAccessibilityTextSpan.textContent = `mark as ${done ? "" : "not"} done`;

  const doneIcon = updateIcon.cloneNode(true);
  doneIcon.classList.replace("fa-pen", "fa-check");

  doneButton.append(doneAccessibilityTextSpan, doneIcon);

  row.append(doneButton, updateButton, removeButton);

  const li = document.createElement("li");
  li.classList.add("list-group-item", "todo-listing");
  done
    ? li.classList.add("done", "text-decoration-line-through")
    : li.classList.remove("done", "text-decoration-line-through");

  li.append(row);

  return li;
}

function renderList({ todos = [], listElement } = {}) {

  const fragment = document.createDocumentFragment();

  for (const todo of todos) {
    const li = createTodoListItem({ todo });
    fragment.append(li);
  }

  listElement.replaceChildren(fragment);
  return listElement;
}

function renderUI({
  todos = [],
  listElement,
  showTitle = true,
  titleLevel = 1,
  owner = "",
}) {


  if (showTitle) {
    const title = document.createElement(`h${titleLevel}`);
    title.id = `${owner}-title`;
    title.classList.add("list-title", "text-light");
    title.style.textShadow = `1px 1px 5px hsl(0deg 100% 0%)`;
    title.textContent = `${owner}'s Todos`;
    listElement.before(title);
  }

  if (!todos.length) {
    listElement.before(noTodosMessage);
  } else {
    noTodosMessage.remove();
  }

  renderList({
    todos,
    listElement,
  });
}

export {
  serialize,
  populate,
  resetAllFormFields,
  validate,
  renderUI,
  noTodosMessage,
  createTodoListItem,
};
