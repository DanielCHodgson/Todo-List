import "./TaskCard.css"
import Utility from "../../Utilities/domUtility";

export default class TaskCard {

  #task
  #element
  #events;

  constructor(task, events) {
    this.#task = task;
    this.#events = events;
    this.#element = this.createCardElement();
    this.#element.addEventListener("click", () => this.handleCardClick(task));
  }

  createCardElement() {
    const card = Utility.createElement("div", "task-card");
    card.appendChild(this.createHeaderElement());
    card.appendChild(this.createBodyElement());
    card.appendChild(this.createFooterElement());
    return card;
  }

  createHeaderElement() {
    const deleteIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 384 512"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/></svg>`;

    const header = Utility.createElement("div", "task-header");
    const summary = Utility.createElement("p", "task-summary", this.#task.getSummary());

    const del = Utility.createElement("div", "delete-icon");
    del.appendChild(Utility.renderSvg(deleteIcon));

    header.appendChild(summary);
    header.appendChild(del);
    return header;
  }

  createBodyElement() {
    const body = Utility.createElement("div", "task-body");
    //To do: add stuff
    return body;
  }

  createFooterElement() {
    const footer = Utility.createElement("div", "task-footer");

    const dueDate = Utility.createElement("p", "due-date", this.#task.getDueDate());

    const id = Utility.createElement("p", "task-id", this.#task.getId());
    const priority = Utility.createElement("p", "task-priority", this.#task.getPriority());

    footer.appendChild(id);
    footer.appendChild(priority);
    footer.appendChild(dueDate);

    return footer;
  }

  handleCardClick(task) {
    this.#events.emit("viewTask", task)
  }

  render(parent) {
    parent.appendChild(this.#element);
  }

  update() {
    // TODO implement update method
  }

  destroy() {
    this.#element.remove();
  }


  getCard() {
    return this.#element;
  }
}