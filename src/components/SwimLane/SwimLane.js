import "./SwimLane.css";
import Utility from "../../utilities/DomUtility";

export default class SwimLane {
    #parent;
    #cardService;
    #status;
    #element;
    #cardsList;
    #events;

    constructor(parent, cardService, status, events) {
        this.#parent = parent;
        this.#cardService = cardService;
        this.#status = status;
        this.#events = events;
        this.#element = this.#createElement();
        this.#cardsList = this.#element.querySelector(".card-list");
        this.bindEvents();
    }

    bindEvents() {
        this.#events.on("cardDragStart", (status) => {
            this.toggleDroppableStyles(status, true);
        });

        this.#events.on("cardDragEnd", (status) => {
            this.toggleDroppableStyles(status, false);
        });
    }

    #createElement() {
        const swimLane = Utility.createElement("div", "swim-lane");
        swimLane.dataset.status = this.#status;

        swimLane.appendChild(this.#createHeader());
        swimLane.appendChild(this.#createCardsList());

        return swimLane;
    }

    #createCardsList() {
        const cardsList = Utility.createElement("div", "card-list");
        cardsList.addEventListener("dragover", (event) => this.#handleDragOver(event));
        cardsList.addEventListener("dragleave", (event) => this.#handleDragLeave(event));
        cardsList.addEventListener("drop", (event) => this.#handleDrop(event));
        return cardsList;
    }

    #createHeader() {
        const header = Utility.createElement("div", "lane-header");
        const titleStr = this.#status.replace(/-/g, " ");
        const title = Utility.createElement("h3", "", titleStr.toUpperCase());
        header.appendChild(title);
        return header;
    }

    #handleDragOver(event) {
        event.preventDefault();
        if (event.target === this.#cardsList || this.#cardsList.contains(event.target)) {
            this.#cardsList.classList.add("drag-over");
        }
    }

    #handleDragLeave(event) {
        if (event.target === this.#cardsList || this.#cardsList.contains(event.target)) {
            this.#cardsList.classList.remove("drag-over");
        }
    }

    #handleDrop(event) {

        event.preventDefault();
        if (event.target === this.#cardsList || this.#cardsList.contains(event.target)) {
            const taskId = event.dataTransfer.getData("text/plain");
            if (!taskId) return;
            this.#events.emit("moveTask", { taskId, newStatus: this.#status });
            this.#cardsList.classList.remove("drag-over");
        }
    }

    renderCards() {
        if (this.#cardsList) {
            this.#cardsList.innerHTML = "";
        }
        this.#cardService.getCards().forEach(card => {
            card.render(this.#cardsList);
        });
    }

    render() {
        this.#parent.appendChild(this.#element);
        this.renderCards();
    }

    toggleDroppableStyles(status, shouldAdd) {
        if (this.#status !== status) {
            shouldAdd ? this.#cardsList.classList.add("droppable") : this.#cardsList.classList.remove("droppable");
        }
    }

    destroy() {
        if (this.#parent && this.#element && this.#parent.contains(this.#element)) {
            this.#parent.removeChild(this.#element);
        }
        this.#parent = null;
        this.#element = null;
        this.#cardsList = null;
    }

    getStatus() {
        return this.#status;
    }

    getElement() {
        return this.#element;
    }

    getCardService() {
        return this.#cardService;
    }
}
