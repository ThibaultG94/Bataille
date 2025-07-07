class GameUI {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.elements = {};
        this.animations = {
            cardSlideDelay: 300,
            battleDelay: 1000,
            winnerHighlightDelay: 1500
        };
        this.isAutoPlaying = false;
        
        this.initializeElements();
        this.bindEvents();
        this.setupGameEngineListeners();
    }

    initializeElements() {
        this.elements = {
            newGameBtn: document.getElementById('newGameBtn'),
            playBtn: document.getElementById('playBtn'),
            autoPlayBtn: document.getElementById('autoPlayBtn'),
            player1Count: document.getElementById('player1Count'),
            player2Count: document.getElementById('player2Count'),
            player1Deck: document.getElementById('player1Deck'),
            player2Deck: document.getElementById('player2Deck'),
            player1PlayedCards: document.getElementById('player1PlayedCards'),
            player2PlayedCards: document.getElementById('player2PlayedCards'),
            roundNumber: document.getElementById('roundNumber'),
            battleMessage: document.getElementById('battleMessage'),
            gameState: document.getElementById('gameState'),
            progressFill: document.getElementById('progressFill'),
            gameOverModal: document.getElementById('gameOverModal'),
            winnerMessage: document.getElementById('winnerMessage'),
            playAgainBtn: document.getElementById('playAgainBtn'),
            closeModalBtn: document.getElementById('closeModalBtn')
        };
    }

    bindEvents() {
        this.elements.newGameBtn.addEventListener('click', () => this.startNewGame());
        this.elements.playBtn.addEventListener('click', () => this.playRound());
        this.elements.autoPlayBtn.addEventListener('click', () => this.toggleAutoPlay());
        this.elements.playAgainBtn.addEventListener('click', () => this.playAgain());
        this.elements.closeModalBtn.addEventListener('click', () => this.closeModal());
        
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !e.repeat) {
                e.preventDefault();
                if (this.elements.playBtn.disabled === false) {
                    this.playRound();
                }
            }
        });
    }

    setupGameEngineListeners() {
        this.gameEngine.on('gameInitialized', (data) => {
            this.updateGameState(data);
            this.updateUI();
        });

        this.gameEngine.on('roundPlayed', (data) => {
            this.handleRoundResult(data);
        });

        this.gameEngine.on('gameEnded', (data) => {
            this.handleGameEnd(data);
        });

        this.gameEngine.on('autoPlayStarted', () => {
            this.isAutoPlaying = true;
            this.updateAutoPlayButton();
        });

        this.gameEngine.on('autoPlayStopped', () => {
            this.isAutoPlaying = false;
            this.updateAutoPlayButton();
        });
    }

    startNewGame() {
        this.gameEngine.initializeGame();
        this.clearPlayedCards();
        this.closeModal();
        this.updateBattleMessage('Game started! Click "Play Round" to begin.');
    }

    playRound() {
        if (this.gameEngine.gameState === 'ready' || this.gameEngine.gameState === 'playing') {
            this.gameEngine.playRound();
        }
    }

    toggleAutoPlay() {
        if (this.isAutoPlaying) {
            this.gameEngine.stopAutoPlay();
        } else {
            this.gameEngine.startAutoPlay(800);
        }
    }

    handleRoundResult(result) {
        this.updateRoundNumber(result.round);
        this.animateCardPlay(result);
        
        setTimeout(() => {
            this.updateUI();
            this.updateBattleMessage(this.getBattleMessage(result));
            
            if (result.winner) {
                this.highlightWinner(result.winner);
            }
        }, this.animations.cardSlideDelay);
    }

    animateCardPlay(result) {
        const { playedCards, battleCards } = result;
        
        playedCards.forEach((play, index) => {
            this.createCardElement(play.card, play.player.id, false);
        });
        
        if (battleCards && battleCards.length > 0) {
            setTimeout(() => {
                battleCards.forEach((battle, index) => {
                    this.createCardElement(battle.card, battle.player.id, true);
                });
            }, this.animations.battleDelay);
        }
    }

    createCardElement(card, playerId, isBattleCard = false) {
        const cardElement = document.createElement('div');
        cardElement.className = 'card slide-in';
        cardElement.style.backgroundImage = `url('${card.getImagePath()}')`;
        cardElement.title = card.toString();
        
        if (isBattleCard) {
            cardElement.classList.add('battle-card');
        }
        
        const targetElement = playerId === 1 ? 
            this.elements.player1PlayedCards : 
            this.elements.player2PlayedCards;
        
        targetElement.appendChild(cardElement);
        
        setTimeout(() => {
            cardElement.classList.remove('slide-in');
        }, this.animations.cardSlideDelay);
    }

    highlightWinner(winner) {
        const winnerCards = winner.id === 1 ? 
            this.elements.player1PlayedCards : 
            this.elements.player2PlayedCards;
        
        winnerCards.querySelectorAll('.card').forEach(card => {
            card.classList.add('winner');
        });
        
        setTimeout(() => {
            this.clearPlayedCards();
        }, this.animations.winnerHighlightDelay);
    }

    clearPlayedCards() {
        this.elements.player1PlayedCards.innerHTML = '';
        this.elements.player2PlayedCards.innerHTML = '';
    }

    updateUI() {
        const gameState = this.gameEngine.getGameState();
        
        this.elements.player1Count.textContent = gameState.players[0]?.cardCount || 0;
        this.elements.player2Count.textContent = gameState.players[1]?.cardCount || 0;
        
        this.updateDeckVisibility();
        this.updateButtonStates();
        this.updateProgressBar();
        this.updateGameStateText();
    }

    updateDeckVisibility() {
        const gameState = this.gameEngine.getGameState();
        
        if (gameState.players[0]?.cardCount === 0) {
            this.elements.player1Deck.classList.add('empty');
        } else {
            this.elements.player1Deck.classList.remove('empty');
        }
        
        if (gameState.players[1]?.cardCount === 0) {
            this.elements.player2Deck.classList.add('empty');
        } else {
            this.elements.player2Deck.classList.remove('empty');
        }
    }

    updateButtonStates() {
        const canPlay = this.gameEngine.gameState === 'ready' || this.gameEngine.gameState === 'playing';
        
        this.elements.playBtn.disabled = !canPlay;
        this.elements.autoPlayBtn.disabled = !canPlay;
        
        if (this.gameEngine.gameState === 'finished') {
            this.elements.playBtn.disabled = true;
            this.elements.autoPlayBtn.disabled = true;
        }
    }

    updateAutoPlayButton() {
        if (this.isAutoPlaying) {
            this.elements.autoPlayBtn.textContent = 'Stop Auto';
            this.elements.autoPlayBtn.classList.add('active');
        } else {
            this.elements.autoPlayBtn.textContent = 'Auto Play';
            this.elements.autoPlayBtn.classList.remove('active');
        }
    }

    updateRoundNumber(round) {
        this.elements.roundNumber.textContent = round;
    }

    updateBattleMessage(message) {
        this.elements.battleMessage.textContent = message;
    }

    updateProgressBar() {
        const gameState = this.gameEngine.getGameState();
        const total = gameState.players[0]?.cardCount + gameState.players[1]?.cardCount;
        const player1Percentage = total > 0 ? (gameState.players[0]?.cardCount / total) * 100 : 50;
        
        this.elements.progressFill.style.width = `${player1Percentage}%`;
    }

    updateGameStateText() {
        const gameState = this.gameEngine.getGameState();
        let stateText = '';
        
        switch (gameState.gameState) {
            case 'waiting':
                stateText = 'Press "New Game" to start';
                break;
            case 'ready':
                stateText = 'Ready to play - Press "Play Round" or Space';
                break;
            case 'playing':
                stateText = 'Playing round...';
                break;
            case 'finished':
                stateText = `Game finished! ${gameState.winner?.name} wins!`;
                break;
            default:
                stateText = 'Unknown state';
        }
        
        this.elements.gameState.textContent = stateText;
    }

    getBattleMessage(result) {
        switch (result.type) {
            case 'normal':
                return `${result.winner.name} wins the round!`;
            case 'battle_continue':
                return 'WAR! Both players draw battle cards!';
            case 'battle_resolved':
                return `${result.winner.name} wins the battle!`;
            case 'battle_insufficient_cards':
                return `${result.winner.name} wins - opponent out of cards!`;
            case 'battle_draw':
                return 'Battle ends in draw - both players out of cards!';
            case 'insufficient_cards':
                return 'Round cannot continue - insufficient cards!';
            default:
                return 'Round completed';
        }
    }

    handleGameEnd(data) {
        const { winner, gameStats, totalRounds } = data;
        
        let message = '';
        if (winner) {
            message = `🎉 ${winner.name} wins!\n\n`;
            message += `Game Statistics:\n`;
            message += `• Total Rounds: ${totalRounds}\n`;
            message += `• Battles: ${gameStats.battles}\n`;
            message += `• Longest Battle: ${gameStats.longestBattle} cards`;
        } else {
            message = 'Game ended in a draw!';
        }
        
        this.elements.winnerMessage.textContent = message;
        this.showModal();
    }

    showModal() {
        this.elements.gameOverModal.classList.add('active');
    }

    closeModal() {
        this.elements.gameOverModal.classList.remove('active');
    }

    playAgain() {
        this.closeModal();
        this.startNewGame();
    }

    updateGameState(data) {
        this.updateUI();
    }
}