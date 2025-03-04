import "./TaskCard.css"
import Utility from "../../utilities/DomUtility";

export default class TaskCard {

  #task
  #events;
  #id = null;
  #element
  #fields = null;

  constructor(task, events) {
    this.#task = task;
    this.#events = events;
    this.#id = this.#task.getId();
    this.#element = this.createCardElement();
    this.cacheFields();
    this.setData(task);
    this.#element.addEventListener("click", () => this.handleCardClick(task));
  }

  cacheFields() {
    this.#fields = {
      "summary": this.#element.querySelector(".summary"),
      "priority": this.#element.querySelector(".priority"),
      "date": this.#element.querySelector(".date"),
      "slug": this.#element.querySelector(".slug")
    };
  }

  setData(task) {
    if (!task) return;
    this.#fields.slug.textContent = `${task.getProject()}-${task.getId()}`;
    this.#fields.summary.textContent = task.getSummary();
    this.#fields.priority.textContent = task.getPriority();
    this.#fields.date.textContent = task.getDueDate();
  }

  createCardElement() {
    const card = Utility.createElement("div", "task-card");
    card.draggable = true;
    card.dataset.taskId = this.#id;

    card.addEventListener("dragstart", this.#handleDragStart.bind(this));
    card.addEventListener("dragend", this.#handleDragEnd.bind(this));

    card.appendChild(this.createHeaderElement());
    card.appendChild(this.createBodyElement());
    card.appendChild(this.createFooterElement());
    return card;
  }

  createHeaderElement() {
    const deleteIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 384 512"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/></svg>`;

    const header = Utility.createElement("div", "task-header");

    const del = Utility.createElement("div", "delete-icon");
    del.appendChild(Utility.renderSvg(deleteIcon));
    del.addEventListener("click", (event) => this.#handleDelete(event));

    header.appendChild(Utility.createElement("p", "summary"));
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
    footer.appendChild(Utility.createElement("p", "slug",));
    footer.appendChild(Utility.createElement("p", "priority"));
    footer.appendChild(Utility.createElement("p", "date"));
    return footer;
  }

  handleCardClick(task) {
    this.#events.emit("viewTask", task)
  }

  #handleDragStart(event) {
    event.dataTransfer.setData("text/plain", this.#id);
    event.target.classList.add("dragging");
    this.#events.emit("cardDragStart", this.#task.getStatus());
  }

  #handleDragEnd(event) {
    event.target.classList.remove("dragging");
    this.#events.emit("cardDragEnd", this.#task.getStatus());
  }

  #handleDelete(event) {
    this.destroy();
    event.stopPropagation();
  }

  render(parent) {
    parent.appendChild(this.#element);
  }

  destroy() {
    this.#events.emit("deleteTask", this.#task);
    if (this.#element) {
      this.#element.remove();
    }
  }

  getTask() {
    return this.#task;
  }

  getCard() {
    return this.#element;
  }
}