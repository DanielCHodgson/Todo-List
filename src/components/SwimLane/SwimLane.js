import "./SwimLane.css";
import Utility from "../../Utilities/domUtility";

export default class SwimLane {

    #parent;
    #cards;
    #status;
    #element;

    constructor(parent, cards, status) {
        this.#parent = parent;
        this.#cards = cards;
        this.#status = status;
        this.#element = this.#createSwimLane();
        this.render();
    }

    #createSwimLane() {
        const swimLane = Utility.createElement("div", "swim-lane");
        swimLane.dataset.status = this.#status;

        const cardsList = Utility.createElement("div", "card-list");

        swimLane.appendChild(this.#createHeader());
        swimLane.appendChild(cardsList)
        return swimLane;
    }

    #createHeader() {
        const header = Utility.createElement("div", "lane-header");
        const titleStr = this.#status.replace(/-/g, " ")
        const title = Utility.createElement("h3", "", titleStr.toUpperCase());
        header.appendChild(title);
        return header;
    }

    #renderCards() {
        this.#cards.forEach(card => card.render(this.#element.querySelector(".card-list")));
    }

    addCard(card) {
        this.#cards.push(card)
    }

    removeCard(cardToRemove) {
        this.#cards = this.#cards.filter(card)
    }


    render() {
        this.#renderCards();
        this.#parent.appendChild(this.#element);
    }

    destroy() {
        if (this.#parent && this.#element) {
            this.#parent.removeChild(this.#element);
            this.#parent = null;
        }
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