import "./TaskCard.css";
import EventBus from "../../utilities/EventBus";
import TaskModel from "../../data/models/TaskModel";
import getIcons from "../../res/icons/icons";
import DomUtility from "../../utilities/DomUtility";

export default class TaskCard {
    #task;
    #id;
    #element;
    #fields = {};
    #eventListeners = {};

    constructor(task) {
        this.#task = task;
        this.#id = task.getId();
        this.#element = this.#createCardElement();
        this.#cacheFields();
        this.#setData(task);
        this.#bindEvents();
    }

    #bindEvents() {
        this.#eventListeners = {
            cardClick: () => EventBus.emit("viewTask", this.#task),
            dragStart: this.#handleDragStart.bind(this),
            dragEnd: this.#handleDragEnd.bind(this),
            deleteClick: (event) => this.#handleDelete(event)
        };
    
        this.#addEventListeners();
    }
    
    #addEventListeners() {
        this.#element.addEventListener("click", this.#eventListeners.cardClick);
        this.#element.addEventListener("dragstart", this.#eventListeners.dragStart);
        this.#element.addEventListener("dragend", this.#eventListeners.dragEnd);
    
        const deleteIcon = this.#element.querySelector(".delete-icon");
        if (deleteIcon) {
            deleteIcon.addEventListener("click", this.#eventListeners.deleteClick);
        }
    }
    
    #removeEventListeners() {
        this.#element.removeEventListener("click", this.#eventListeners.cardClick);
        this.#element.removeEventListener("dragstart", this.#eventListeners.dragStart);
        this.#element.removeEventListener("dragend", this.#eventListeners.dragEnd);
    
        const deleteIcon = this.#element.querySelector(".delete-icon");
        if (deleteIcon) {
            deleteIcon.removeEventListener("click", this.#eventListeners.deleteClick);
        }
    
        this.#eventListeners = {};
    }

    #cacheFields() {
        this.#fields = {
            summary: this.#element.querySelector(".summary"),
            priority: this.#element.querySelector(".priority"),
            date: this.#element.querySelector(".date"),
            slug: this.#element.querySelector(".slug"),
        };
    }

    #setData(task) {
        if (!task || !task.getSummary() || !task.getPriority()) return;
        this.#fields.slug.textContent = task.getId();
        this.#fields.summary.textContent = task.getSummary();
        this.#fields.priority.textContent = task.getPriority();
        this.#fields.date.textContent = task.getDate();
    }

    #createCardElement() {
        const card = DomUtility.createElement("div", "task-card");
        card.draggable = true;
        card.dataset.taskId = this.#id;

        card.append(this.#createHeaderElement(), this.#createBodyElement(), this.#createFooterElement());
        return card;
    }

    #createHeaderElement() {
        const header = DomUtility.createElement("div", "task-header");
    
        const deleteIcon = DomUtility.createElement("div", "delete-icon");
        deleteIcon.addEventListener("click", (event) => this.#handleDelete(event));
        deleteIcon.appendChild(DomUtility.renderSvg(getIcons().close));

  
    
        header.append(DomUtility.createElement("p", "summary"), deleteIcon);
        return header;
    }

    #createBodyElement() {
        return DomUtility.createElement("div", "task-body");
    }

    #createFooterElement() {
        const footer = DomUtility.createElement("div", "task-footer");
        const fragment = document.createDocumentFragment();
        
        fragment.append(
            DomUtility.createElement("p", "slug"),
            DomUtility.createElement("p", "priority"),
            DomUtility.createElement("p", "date")
        );

        footer.appendChild(fragment);
        return footer;
    }

    #handleDragStart(event) {
        event.dataTransfer.setData("text/plain", this.#id);
        this.#element.classList.add("dragging");
        EventBus.emit("cardDragStart", this.#task.getStatus());
    }

    #handleDragEnd() {
        this.#element.classList.remove("dragging");
        EventBus.emit("cardDragEnd", this.#task.getStatus());
    }

    #handleDelete(event) {
        event.stopPropagation();
        this.destroy();
    }

    destroy() {
        EventBus.emit("deleteTask", this.#task);
        this.#removeEventListeners();
        this.#element?.remove();
        this.#task = null;
    }

    render(parent) {
        parent.appendChild(this.#element);
    }

    getId() {
        return this.#id;
    }

    getTask() {
        return this.#task;
    }

    getCard() {
        return this.#element;
    }

    toJSON() {
        return { task: this.#task.toJSON() };
    }

    static fromJSON(data) {
        return new TaskCard(TaskModel.fromJSON(data.task));
    }
}
