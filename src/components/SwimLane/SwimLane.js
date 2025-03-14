import "./SwimLane.css";
import DomUtility from "../../utilities/DomUtility";
import EventBus from "../../utilities/EventBus";
import CardService from "../../services/CardService";
import getIcons from "../../res/icons/icons";

export default class SwimLane {
    #parent;
    #cardService;
    #status;
    #element;
    #cardsContainer;
    #eventListeners = {};

    constructor(cardService, status) {
        this.#cardService = cardService;
        this.#status = status;
        this.#element = this.#createElement();
        this.#cardsContainer = this.#element.querySelector(".card-list");

        this.#bindEvents();
    }

    #bindEvents() {
        this.#eventListeners.dragStart = (status) => this.#toggleDroppableStyles(status, true);
        this.#eventListeners.dragEnd = (status) => this.#toggleDroppableStyles(status, false);

        EventBus.on("cardDragStart", this.#eventListeners.dragStart);
        EventBus.on("cardDragEnd", this.#eventListeners.dragEnd);
    }

    #unbindEvents() {
        EventBus.off("cardDragStart", this.#eventListeners.dragStart);
        EventBus.off("cardDragEnd", this.#eventListeners.dragEnd);
        this.#eventListeners = {};
    }

    #createElement() {
        const swimLane = DomUtility.createElement("div", "swim-lane");
        swimLane.dataset.status = this.#status;
        swimLane.append(this.#createHeader(), this.#createCardsContainer());
        return swimLane;
    }

    #createHeader() {
        const header = DomUtility.createElement("div", "lane-header");
        const title = DomUtility.createElement("h3", "", this.#status.replace(/-/g, " ").toUpperCase());

        const closeBtn = DomUtility.createIconButton("close", getIcons().close, () => this.destroy());

        header.append(title, closeBtn);
        return header;
    }

    #createCardsContainer() {
        const container = DomUtility.createElement("div", "card-list");
        container.addEventListener("dragover", this.#handleDragOver.bind(this));
        container.addEventListener("dragleave", this.#handleDragLeave.bind(this));
        container.addEventListener("drop", this.#handleDrop.bind(this));
        return container;
    }

    #handleDragOver(event) {
        event.preventDefault();
        this.#toggleDragOverEffect(event, true);
    }

    #handleDragLeave(event) {
        this.#toggleDragOverEffect(event, false);
    }

    #handleDrop(event) {
        event.preventDefault();
        const taskId = event.dataTransfer.getData("text/plain");
        if (taskId) {
            EventBus.emit("moveTask", { taskId, newStatus: this.#status });
        }
        this.#toggleDragOverEffect(event, false);
    }

    #toggleDragOverEffect(event, shouldAdd) {
        if (event.target === this.#cardsContainer || this.#cardsContainer.contains(event.target)) {
            this.#cardsContainer.classList.toggle("drag-over", shouldAdd);
        }
    }

    #toggleDroppableStyles(status, shouldAdd) {
        if (this.#status !== status) {
            this.#cardsContainer.classList.toggle("droppable", shouldAdd);
        }
    }

    renderCards() {
        this.#cardsContainer.innerHTML = "";
        this.#cardService.getCards().forEach((card) => card.render(this.#cardsContainer));
    }

    render(parent) {
        this.#parent = parent;
        this.#parent.appendChild(this.#element);
        this.renderCards();
    }

    destroy() {
        if (this.#parent?.contains(this.#element)) {
            this.#parent.removeChild(this.#element);
        }

        this.#unbindEvents();
        this.#parent = null;
        this.#element = null;
        this.#cardsContainer = null;

        EventBus.emit("deleteSwimLane", this.#status);
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
            cardService: this.#cardService.toJSON(),
            status: this.#status,
        };
    }

    static fromJSON(data) {
        return new SwimLane(CardService.fromJSON(data.cardService), data.status);
    }
}
