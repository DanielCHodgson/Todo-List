import TaskCard from "../components/TaskCard/TaskCard";

export default class CardService {

    #cards

    constructor(cards) {
        this.#cards = cards;
    }

    addCard(card) {
        this.#cards.push(card);
    }

    updateCard(id, newCard) {
        this.#cards = this.#cards.map(card =>
            card.getId() === id ? newCard : card
        );
    }

    moveCard(card, newCardService) {
        this.removeCard(card.getId());
        newCardService.addCard(card);
    }

    removeCard(id) {
        this.#cards = this.#cards.filter(card => card.getId() !== id);
    }

    getCards() {
        return this.#cards;
    }

    toJSON() {
        return {
            cards: this.#cards.map(card => card.toJSON()),
        };
    }

    static fromJSON(data) {
        return new CardService(data.cards.map(card => {
           return TaskCard.fromJSON(card)
        }));
    }
}