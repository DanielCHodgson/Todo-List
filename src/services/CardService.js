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
            id === currentCard.getId() ? newCard : card
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
}