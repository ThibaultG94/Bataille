class Player {
    constructor(name, id) {
        this.name = name;
        this.id = id;
        this.deck = [];
        this.playedCards = [];
        this.score = 0;
    }

    addCard(card) {
        if (Array.isArray(card)) {
            this.deck.push(...card);
        } else {
            this.deck.push(card);
        }
    }

    addCardToBottom(card) {
        if (Array.isArray(card)) {
            this.deck.unshift(...card);
        } else {
            this.deck.unshift(card);
        }
    }

    playCard() {
        if (this.deck.length === 0) {
            throw new Error(`${this.name} has no cards to play`);
        }
        
        const card = this.deck.shift();
        this.playedCards.push(card);
        return card;
    }

    hasCards() {
        return this.deck.length > 0;
    }

    getCardCount() {
        return this.deck.length;
    }

    getLastPlayedCard() {
        return this.playedCards[this.playedCards.length - 1];
    }

    clearPlayedCards() {
        const cards = [...this.playedCards];
        this.playedCards = [];
        return cards;
    }

    winRound(cards) {
        this.addCardToBottom(cards);
        this.score++;
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    toString() {
        return `${this.name}: ${this.deck.length} cards, Score: ${this.score}`;
    }

    reset() {
        this.deck = [];
        this.playedCards = [];
        this.score = 0;
    }
}