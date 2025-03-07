import "./SwimLane.css";
import Utility from "../../utilities/DomUtility";
import CardService from "../../services/CardService";

export default class SwimLane {
    #parent;
    #cardService;
    #status;
    #element;
    #cardsContainer;
    #events;

    constructor(parent, cardService, status, events) {
        this.#parent = parent;
        this.#cardService = cardService;
        this.#status = status;
        this.#events = events;
        this.#cardsContainer = null;
        this.#element = this.#createSwimLane();
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

    #createSwimLane() {
        const swimLane = Utility.createElement("div", "swim-lane");
        swimLane.dataset.status = this.#status;

        this.#cardsContainer = Utility.createElement("div", "card-list");

        console.assert(this.#cardsContainer !== null, 'cardsContainer is null or undefined');

        swimLane.appendChild(this.#createHeader());
        swimLane.appendChild(this.#cardsContainer);

        this.#cardsContainer.addEventListener("dragover", (event) => this.#handleDragOver(event));
        this.#cardsContainer.addEventListener("dragleave", (event) => this.#handleDragLeave(event));
        this.#cardsContainer.addEventListener("drop", (event) => this.#handleDrop(event));
        return swimLane;
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

 
    addCard(card) {
        this.#cardService.addCard(card);
        this.renderCards(this.#cardsContainer);
    }

    updateCard(id, newCard) {
        const index = this.#cardService.findIndex(card => card.getTask().getId() === id);
        if (index !== -1) {
            this.#cardService[index] = newCard;
            this.renderCards();
        }
    }

    removeCard(card) {
        this.#cardService.removeCard(card);
        this.renderCards();
    }

    moveCard(card, newSwimlane) {
        this.#cardService.moveCard(card, newSwimlane.getCardService())
        this.renderCards();
        newSwimlane.renderCards();
    }

    renderCards() {
        this.#cardsContainer.innerHTML = "";
        this.#cardService.getCards().forEach(card => card.render(this.#cardsContainer));
    }

    render() {
        if (!this.#parent.contains(this.#element)) {
            this.#parent.appendChild(this.#element);
        }
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
}
