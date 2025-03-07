export default class CardService {

    #cards

    constructor(cards) {
        this.#cards = cards;
    }

    addCard(card) {
        this.#cards.push(card);
    }

    updateCard(currentCard, newCard) {
        this.#cards = this.#cards.map(card => 
            card.getId() === currentCard.getId() ? newCard : card
        );
    }
    
    moveCard(card, newCardService) {
        this.removeCard(card);
        newCardService.addCard(card);
    }

    removeCard(cardToRemove) {
        this.#cards = this.#cards.filter(card => card.getId() !== cardToRemove.getId());
    }

    getCards() {
        return this.#cards;
    }
}