class Deck {
    constructor() {
        this.cards = [];
        this.createStandardDeck();
    }

    createStandardDeck() {
        this.cards = [];
        
        for (const suit of Object.values(Card.SUITS)) {
            for (const rank of Object.values(Card.RANKS)) {
                this.cards.push(new Card(suit, rank));
            }
        }
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
        return this;
    }

    deal(numberOfCards = 1) {
        if (numberOfCards > this.cards.length) {
            throw new Error('Not enough cards in deck');
        }
        
        const dealtCards = [];
        for (let i = 0; i < numberOfCards; i++) {
            dealtCards.push(this.cards.pop());
        }
        
        return numberOfCards === 1 ? dealtCards[0] : dealtCards;
    }

    dealAll() {
        const allCards = [...this.cards];
        this.cards = [];
        return allCards;
    }

    peek() {
        return this.cards[this.cards.length - 1];
    }

    isEmpty() {
        return this.cards.length === 0;
    }

    size() {
        return this.cards.length;
    }

    split() {
        const halfSize = Math.floor(this.cards.length / 2);
        const firstHalf = this.cards.slice(0, halfSize);
        const secondHalf = this.cards.slice(halfSize);
        
        return [firstHalf, secondHalf];
    }

    toString() {
        return this.cards.map(card => card.toString()).join(', ');
    }

    static createFromCards(cards) {
        const deck = new Deck();
        deck.cards = [...cards];
        return deck;
    }
}