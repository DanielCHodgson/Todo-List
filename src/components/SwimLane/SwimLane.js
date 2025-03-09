import "./SwimLane.css";
import Utility from "../../utilities/DomUtility";

export default class SwimLane {
    #parent;
    #cardService;
    #status;
    #element;
    #cardsContainer;
    #events;

    constructor(cardService, status, events) {
        this.#cardService = cardService;
        this.#status = status;
        this.#events = events;
        this.#element = this.#createElement();
        this.#cardsContainer = this.#element.querySelector(".card-list");
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
        swimLane.appendChild(this.#createCardsContainer());

        return swimLane;
    }

    #createCardsContainer() {
        const cardsContainer = Utility.createElement("div", "card-list");
        cardsContainer.addEventListener("dragover", (event) => this.#handleDragOver(event));
        cardsContainer.addEventListener("dragleave", (event) => this.#handleDragLeave(event));
        cardsContainer.addEventListener("drop", (event) => this.#handleDrop(event));
        return cardsContainer;
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
        if (event.target === this.#cardsContainer || this.#cardsContainer.contains(event.target)) {
            this.#cardsContainer.classList.add("drag-over");
        }
    }

    #handleDragLeave(event) {
        if (event.target === this.#cardsContainer || this.#cardsContainer.contains(event.target)) {
            this.#cardsContainer.classList.remove("drag-over");
        }
    }

    #handleDrop(event) {

        event.preventDefault();
        if (event.target === this.#cardsContainer || this.#cardsContainer.contains(event.target)) {
            const taskId = event.dataTransfer.getData("text/plain");
            if (!taskId) return;
            this.#events.emit("moveTask", { taskId, newStatus: this.#status });
            this.#cardsContainer.classList.remove("drag-over");
        }
    }

    renderCards() {
        if (this.#cardsContainer) 
            this.#cardsContainer.innerHTML = "";
        this.#cardService.getCards().forEach(card => card.render(this.#cardsContainer));
    }

    render(parent) {
        this.#parent = parent;
        this.#parent.appendChild(this.#element);
        this.renderCards();
    }

    toggleDroppableStyles(status, shouldAdd) {
        if (this.#status !== status) {
            shouldAdd ? this.#cardsContainer.classList.add("droppable") : this.#cardsContainer.classList.remove("droppable");
        }
    }

    destroy() {
        if (this.#parent && this.#element && this.#parent.contains(this.#element)) {
            this.#parent.removeChild(this.#element);
        }
        this.#parent = null;
        this.#element = null;
        this.#cardsContainer = null;
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


    toJSON() {
        return {
           cardService: this.#cardService,
           status: this.#status,
           events: this.#events,
        };
    }

    static fromJSON(data) {
        return new SwimLane(
            data.cardService,
            data.status,
            data.events,
        );
    }
}
