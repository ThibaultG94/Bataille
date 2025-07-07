class GameEngine {
    constructor() {
        this.players = [];
        this.currentRound = 0;
        this.gameState = 'waiting';
        this.winner = null;
        this.battlePile = [];
        this.eventListeners = {};
        this.autoPlayInterval = null;
        this.gameStats = {
            totalRounds: 0,
            battles: 0,
            longestBattle: 0
        };
    }

    initializeGame() {
        this.reset();
        
        this.players = [
            new Player('Player 1', 1),
            new Player('Player 2', 2)
        ];

        const deck = new Deck();
        deck.shuffle();
        
        const [player1Cards, player2Cards] = deck.split();
        this.players[0].addCard(player1Cards);
        this.players[1].addCard(player2Cards);
        
        this.gameState = 'ready';
        this.emit('gameInitialized', {
            players: this.players,
            gameState: this.gameState
        });
    }

    playRound() {
        if (this.gameState !== 'ready' && this.gameState !== 'playing') {
            throw new Error('Game is not in a playable state');
        }
        
        if (!this.canPlayRound()) {
            this.endGame();
            return;
        }

        this.gameState = 'playing';
        this.currentRound++;
        this.gameStats.totalRounds++;
        
        const roundResult = this.executeRound();
        this.emit('roundPlayed', roundResult);
        
        if (this.isGameOver()) {
            this.endGame();
        } else {
            this.gameState = 'ready';
        }
    }

    executeRound() {
        const playedCards = [];
        const roundBattlePile = [];

        for (const player of this.players) {
            if (player.hasCards()) {
                const card = player.playCard();
                playedCards.push({ player, card });
                roundBattlePile.push(card);
            }
        }

        if (playedCards.length < 2) {
            return this.createRoundResult(playedCards, 'insufficient_cards');
        }

        const [player1Result, player2Result] = playedCards;
        const comparison = player1Result.card.compareTo(player2Result.card);
        
        if (comparison === 0) {
            this.gameStats.battles++;
            return this.handleBattle(playedCards, roundBattlePile);
        }

        const winner = comparison > 0 ? player1Result.player : player2Result.player;
        const loser = comparison > 0 ? player2Result.player : player1Result.player;
        
        winner.winRound([...roundBattlePile, ...this.battlePile]);
        this.battlePile = [];
        
        return this.createRoundResult(playedCards, 'normal', winner, loser);
    }

    handleBattle(playedCards, roundBattlePile) {
        this.battlePile.push(...roundBattlePile);
        
        const faceDownCards = [];
        const battleCards = [];
        let canContinueBattle = true;
        
        for (const player of this.players) {
            if (player.getCardCount() >= 2) {
                const faceDownCard = player.playCard();
                const battleCard = player.playCard();
                
                faceDownCards.push({ player, card: faceDownCard });
                battleCards.push({ player, card: battleCard });
                
                this.battlePile.push(faceDownCard, battleCard);
            } else if (player.hasCards()) {
                const lastCard = player.playCard();
                battleCards.push({ player, card: lastCard });
                this.battlePile.push(lastCard);
            } else {
                canContinueBattle = false;
                break;
            }
        }

        if (!canContinueBattle) {
            const winner = this.players.find(p => p.hasCards());
            if (winner) {
                winner.winRound(this.battlePile);
                this.battlePile = [];
                return this.createRoundResult(playedCards, 'battle_insufficient_cards', winner, null, battleCards, faceDownCards);
            }
            return this.createRoundResult(playedCards, 'battle_draw', null, null, battleCards, faceDownCards);
        }

        if (battleCards.length < 2) {
            const winner = this.players.find(p => p.hasCards());
            if (winner) {
                winner.winRound(this.battlePile);
                this.battlePile = [];
                return this.createRoundResult(playedCards, 'battle_insufficient_cards', winner, null, battleCards, faceDownCards);
            }
            return this.createRoundResult(playedCards, 'battle_draw', null, null, battleCards, faceDownCards);
        }

        const [player1Battle, player2Battle] = battleCards;
        const battleComparison = player1Battle.card.compareTo(player2Battle.card);
        
        if (battleComparison === 0) {
            return this.createRoundResult(
                playedCards,
                'battle_continue',
                null,
                null,
                battleCards,
                faceDownCards
            );
        }

        const winner = battleComparison > 0 ? player1Battle.player : player2Battle.player;
        const loser = battleComparison > 0 ? player2Battle.player : player1Battle.player;
        
        winner.winRound(this.battlePile);
        this.battlePile = [];
        
        const currentBattleLength = (this.battlePile.length + faceDownCards.length + battleCards.length) / 2;
        if (currentBattleLength > this.gameStats.longestBattle) {
            this.gameStats.longestBattle = currentBattleLength;
        }
        
        return this.createRoundResult(
            playedCards,
            'battle_resolved',
            winner,
            loser,
            battleCards,
            faceDownCards
        );
    }

    createRoundResult(playedCards, type, winner = null, loser = null, battleCards = [], faceDownCards = []) {
        return {
            round: this.currentRound,
            type,
            playedCards,
            battleCards,
            faceDownCards,
            winner,
            loser,
            gameState: this.gameState,
            players: this.players.map(p => ({
                name: p.name,
                cardCount: p.getCardCount(),
                score: p.score
            }))
        };
    }

    canPlayRound() {
        return this.players.every(player => player.hasCards());
    }

    isGameOver() {
        return this.players.some(player => !player.hasCards());
    }

    endGame() {
        this.gameState = 'finished';
        this.winner = this.players.find(player => player.hasCards());
        
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
        
        this.emit('gameEnded', {
            winner: this.winner,
            gameStats: this.gameStats,
            totalRounds: this.currentRound
        });
    }

    startAutoPlay(interval = 1000) {
        if (this.autoPlayInterval) {
            this.stopAutoPlay();
        }
        
        this.autoPlayInterval = setInterval(() => {
            if (this.gameState === 'ready' || this.gameState === 'playing') {
                this.playRound();
            } else {
                this.stopAutoPlay();
            }
        }, interval);
        
        this.emit('autoPlayStarted', { interval });
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
            this.emit('autoPlayStopped');
        }
    }

    reset() {
        this.players = [];
        this.currentRound = 0;
        this.gameState = 'waiting';
        this.winner = null;
        this.battlePile = [];
        this.gameStats = {
            totalRounds: 0,
            battles: 0,
            longestBattle: 0
        };
        
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    on(event, callback) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(callback);
    }

    off(event, callback) {
        if (this.eventListeners[event]) {
            this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
        }
    }

    emit(event, data) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
    }

    getGameState() {
        return {
            gameState: this.gameState,
            currentRound: this.currentRound,
            players: this.players.map(p => ({
                name: p.name,
                cardCount: p.getCardCount(),
                score: p.score
            })),
            winner: this.winner,
            gameStats: this.gameStats
        };
    }
}