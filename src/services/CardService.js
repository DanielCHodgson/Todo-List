export default class CardService {

    #cards

    constructor(cards) {
        this.#cards = cards;
    }

    addCard(card) {
        this.#cards.push(card);
    }

    updateCard(currentCard, newCard) {
        const index = this.#cards.findIndex(card => card.getId() === currentCard.getId());
        if (index !== -1) {
            this.#cards[index] = newCard;
        }
    }

    moveCard(card, newCardService) {
        this.removeCard(card);
        newCardService.addCard(card);
    }

    removeCard(cardToRemove) {
        console.log(cardToRemove)
        this.#cards = this.#cards.filter(card => card.getId() !== cardToRemove.getId());
    }

    getCards() {
        return this.#cards;
    }
}