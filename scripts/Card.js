class Card {
    static SUITS = {
        HEARTS: 'hearts',
        DIAMONDS: 'diamonds',
        CLUBS: 'clubs',
        SPADES: 'spades'
    };

    static RANKS = {
        TWO: 2,
        THREE: 3,
        FOUR: 4,
        FIVE: 5,
        SIX: 6,
        SEVEN: 7,
        EIGHT: 8,
        NINE: 9,
        TEN: 10,
        JACK: 11,
        QUEEN: 12,
        KING: 13,
        ACE: 14
    };

    static FRENCH_SUITS = {
        [Card.SUITS.HEARTS]: 'Coeurs',
        [Card.SUITS.DIAMONDS]: 'Carreaux',
        [Card.SUITS.CLUBS]: 'Trèfles',
        [Card.SUITS.SPADES]: 'Piques'
    };

    static FRENCH_RANKS = {
        [Card.RANKS.TWO]: '02',
        [Card.RANKS.THREE]: '03',
        [Card.RANKS.FOUR]: '04',
        [Card.RANKS.FIVE]: '05',
        [Card.RANKS.SIX]: '06',
        [Card.RANKS.SEVEN]: '07',
        [Card.RANKS.EIGHT]: '08',
        [Card.RANKS.NINE]: '09',
        [Card.RANKS.TEN]: '10',
        [Card.RANKS.JACK]: '11_Jack',
        [Card.RANKS.QUEEN]: '12_Queen',
        [Card.RANKS.KING]: '13_King',
        [Card.RANKS.ACE]: '01'
    };

    constructor(suit, rank) {
        if (!Object.values(Card.SUITS).includes(suit)) {
            throw new Error(`Invalid suit: ${suit}`);
        }
        if (!Object.values(Card.RANKS).includes(rank)) {
            throw new Error(`Invalid rank: ${rank}`);
        }
        
        this.suit = suit;
        this.rank = rank;
    }

    getValue() {
        return this.rank;
    }

    getImagePath() {
        const frenchSuit = Card.FRENCH_SUITS[this.suit];
        const frenchRank = Card.FRENCH_RANKS[this.rank];
        
        let filename;
        const suitName = frenchSuit.slice(0, -1);
        
        // Nouvelle logique SVG
        // On suppose que les fichiers SVG sont nommés comme "2_of_clubs.svg", "jack_of_hearts.svg", etc.
        const suitMap = {
            [Card.SUITS.HEARTS]: 'hearts',
            [Card.SUITS.DIAMONDS]: 'diamonds',
            [Card.SUITS.CLUBS]: 'clubs',
            [Card.SUITS.SPADES]: 'spades'
        };
        const rankMap = {
            [Card.RANKS.ACE]: 'ace',
            [Card.RANKS.JACK]: 'jack',
            [Card.RANKS.QUEEN]: 'queen',
            [Card.RANKS.KING]: 'king',
        };
        let svgName = '';
        if (this.rank in rankMap) {
            svgName = `${rankMap[this.rank]}_of_${suitMap[this.suit]}.svg`;
        } else {
            svgName = `${this.rank}_of_${suitMap[this.suit]}.svg`;
        }
        return `./assets/${svgName}`;
    }

    toString() {
        const suitSymbols = {
            [Card.SUITS.HEARTS]: '♥',
            [Card.SUITS.DIAMONDS]: '♦',
            [Card.SUITS.CLUBS]: '♣',
            [Card.SUITS.SPADES]: '♠'
        };
        
        const rankNames = {
            [Card.RANKS.ACE]: 'A',
            [Card.RANKS.JACK]: 'J',
            [Card.RANKS.QUEEN]: 'Q',
            [Card.RANKS.KING]: 'K'
        };
        
        const rankDisplay = rankNames[this.rank] || this.rank.toString();
        return `${rankDisplay}${suitSymbols[this.suit]}`;
    }

    equals(otherCard) {
        return this.suit === otherCard.suit && this.rank === otherCard.rank;
    }

    compareTo(otherCard) {
        if (this.rank < otherCard.rank) return -1;
        if (this.rank > otherCard.rank) return 1;
        return 0;
    }
}