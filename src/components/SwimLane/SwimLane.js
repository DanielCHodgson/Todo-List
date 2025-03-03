import "./SwimLane.css";
import Utility from "../../Utilities/domUtility";

export default class SwimLane {

    #parent;
    #cards;
    #status;
    #element;
    #cardsContainer;

    constructor(parent, cards, status) {
        this.#parent = parent;
        this.#cards = cards;
        this.#status = status;
        this.#element = this.#createSwimLane();
        this.#cardsContainer = this.#element.querySelector(".card-list");
    }

    #createSwimLane() {
        const swimLane = Utility.createElement("div", "swim-lane");
        swimLane.dataset.status = this.#status;

        this.#cardsContainer = Utility.createElement("div", "card-list");

        swimLane.appendChild(this.#createHeader());
        swimLane.appendChild(this.#cardsContainer);
        return swimLane;
    }

    #createHeader() {
        const header = Utility.createElement("div", "lane-header");
        const titleStr = this.#status.replace(/-/g, " ");
        const title = Utility.createElement("h3", "", titleStr.toUpperCase());
        header.appendChild(title);
        return header;
    }

    renderCards() {
        this.#cardsContainer.innerHTML = "";
        this.#cards.forEach(card => card.render(this.#cardsContainer));
    }

    addCard(card) {
        this.#cards.push(card);
        card.render(this.#cardsContainer);
    }

    updateCard(id, newCard) {
        const index = this.#cards.findIndex(card => card.getTask().getId() === id);
        this.#cards[index] = newCard;
        this.renderCards();
    }

    removeCard(id) {
        this.#cards = this.#cards.filter(card => card.getTask().getId() !== id);
        this.#cardsContainer.innerHTML = "";
        this.renderCards();
    }

    render() {
        this.renderCards();
        if (!this.#parent.contains(this.#element)) {
            this.#parent.appendChild(this.#element);
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

    getParent() {
        return this.#parent;
    }

    setParent(value) {
        this.#parent = value;
    }

    getCards() {
        return this.#cards;
    }

    getStatus() {
        return this.#status;
    }


}