class GameUI {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.elements = {};
    this.animations = {
      cardSlideDelay: 300,
      battleDelay: 800,
      winnerHighlightDelay: 1200,
    };
    this.isAutoPlaying = false;

    this.initializeElements();
    this.bindEvents();
    this.setupGameEngineListeners();
  }

  initializeElements() {
    this.elements = {
      newGameBtn: document.getElementById("newGameBtn"),
      playBtn: document.getElementById("playBtn"),
      autoPlayBtn: document.getElementById("autoPlayBtn"),
      player1Count: document.getElementById("player1Count"),
      player2Count: document.getElementById("player2Count"),
      player1Deck: document.getElementById("player1Deck"),
      player2Deck: document.getElementById("player2Deck"),
      player1PlayedCards: document.getElementById("player1PlayedCards"),
      player2PlayedCards: document.getElementById("player2PlayedCards"),
      centralBattleCards: document.getElementById("centralBattleCards"),
      roundNumber: document.getElementById("roundNumber"),
      battleMessage: document.getElementById("battleMessage"),
      gameState: document.getElementById("gameState"),
      progressFill: document.getElementById("progressFill"),
      gameOverModal: document.getElementById("gameOverModal"),
      winnerMessage: document.getElementById("winnerMessage"),
      playAgainBtn: document.getElementById("playAgainBtn"),
      closeModalBtn: document.getElementById("closeModalBtn"),
    };
  }

  bindEvents() {
    this.elements.newGameBtn.addEventListener("click", () =>
      this.startNewGame()
    );
    this.elements.playBtn.addEventListener("click", () => this.playRound());
    this.elements.autoPlayBtn.addEventListener("click", () =>
      this.toggleAutoPlay()
    );
    this.elements.playAgainBtn.addEventListener("click", () =>
      this.playAgain()
    );
    this.elements.closeModalBtn.addEventListener("click", () =>
      this.closeModal()
    );

    document.addEventListener("keydown", (e) => {
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        if (this.elements.playBtn.disabled === false) {
          this.playRound();
        }
      }
    });
  }

  setupGameEngineListeners() {
    this.gameEngine.on("gameInitialized", (data) => {
      this.updateGameState(data);
      this.updateUI();
    });

    this.gameEngine.on("roundPlayed", (data) => {
      this.handleRoundResult(data);
    });

    this.gameEngine.on("gameEnded", (data) => {
      this.handleGameEnd(data);
    });

    this.gameEngine.on("autoPlayStarted", () => {
      this.isAutoPlaying = true;
      this.updateAutoPlayButton();
    });

    this.gameEngine.on("autoPlayStopped", () => {
      this.isAutoPlaying = false;
      this.updateAutoPlayButton();
    });
  }

  startNewGame() {
    this.gameEngine.initializeGame();
    this.clearPlayedCards();
    this.closeModal();
    this.updateBattleMessage(
      'Partie lancée! Cliquez "Play Round" pour commencer.'
    );
  }

  playRound() {
    if (
      this.gameEngine.gameState === "ready" ||
      this.gameEngine.gameState === "playing"
    ) {
      this.gameEngine.playRound();
    }
  }

  toggleAutoPlay() {
    if (this.isAutoPlaying) {
      this.gameEngine.stopAutoPlay();
    } else {
      this.gameEngine.startAutoPlay(600);
    }
  }

  handleRoundResult(result) {
    this.updateRoundNumber(result.round);
    this.animateCardPlay(result);

    // Enable battle mode for better layout
    if (result.type.includes("battle")) {
      this.toggleBattleMode(true);
      this.enableBattleLayout();
    }

    setTimeout(() => {
      this.updateUI();
      this.updateBattleMessage(this.getBattleMessage(result));

      if (result.winner) {
        this.highlightWinner(result.winner);
        // Small delay before disabling battle mode
        setTimeout(() => {
          this.toggleBattleMode(false);
          this.disableBattleLayout();
        }, 800);
      }
    }, this.animations.cardSlideDelay);
  }

  animateCardPlay(result) {
    const { playedCards, battleCards, faceDownCards } = result;

    // Animate initial played cards to center
    playedCards.forEach((play, index) => {
      this.createCardElement(play.card, play.player.id, false, false, true);
      this.animateDeckShake(play.player.id);
    });

    // Animate face-down cards in battle
    if (faceDownCards && faceDownCards.length > 0) {
      setTimeout(() => {
        faceDownCards.forEach((faceDown, index) => {
          this.createCardElement(
            faceDown.card,
            faceDown.player.id,
            false,
            true,
            true
          );
        });
      }, this.animations.battleDelay / 2);
    }

    // Animate battle cards
    if (battleCards && battleCards.length > 0) {
      setTimeout(() => {
        battleCards.forEach((battle, index) => {
          this.createCardElement(
            battle.card,
            battle.player.id,
            true,
            false,
            true
          );
        });
      }, this.animations.battleDelay);
    }
  }

  createCardElement(
    card,
    playerId,
    isBattleCard = false,
    isFaceDown = false,
    useCenter = false
  ) {
    const cardElement = document.createElement("div");
    cardElement.className = "card slide-in";
    cardElement.dataset.playerId = playerId;

    if (isFaceDown) {
      cardElement.classList.add("face-down");
      cardElement.style.backgroundImage = `url('./assets/img/dos_de_carte.jpg')`;
      cardElement.title = "Face Down Card";
    } else {
      cardElement.style.backgroundImage = `url('${card.getImagePath()}')`;
      cardElement.title = card.toString();

      if (isBattleCard) {
        cardElement.classList.add("battle-card");
        setTimeout(() => {
          cardElement.classList.add("flip-reveal");
        }, 100);
      }
    }

    // Determine target element - use central area on desktop, player areas on mobile
    let targetElement;
    if (useCenter && window.innerWidth > 768) {
      targetElement = this.elements.centralBattleCards;
    } else {
      targetElement =
        playerId === 1
          ? this.elements.player1PlayedCards
          : this.elements.player2PlayedCards;
    }

    targetElement.appendChild(cardElement);

    setTimeout(() => {
      cardElement.classList.remove("slide-in");
    }, this.animations.cardSlideDelay);
  }

  enableBattleLayout() {
    this.elements.player1PlayedCards.classList.add("battle-mode");
    this.elements.player2PlayedCards.classList.add("battle-mode");
  }

  disableBattleLayout() {
    this.elements.player1PlayedCards.classList.remove("battle-mode");
    this.elements.player2PlayedCards.classList.remove("battle-mode");
  }

  highlightWinner(winner) {
    // Get all played cards from both central area and player areas
    const allPlayedCards = [
      ...this.elements.centralBattleCards.querySelectorAll(".card"),
      ...this.elements.player1PlayedCards.querySelectorAll(".card"),
      ...this.elements.player2PlayedCards.querySelectorAll(".card"),
    ];

    const winnerCountElement =
      winner.id === 1
        ? this.elements.player1Count.parentElement
        : this.elements.player2Count.parentElement;

    const winnerDeck =
      winner.id === 1
        ? this.elements.player1Deck.parentElement
        : this.elements.player2Deck.parentElement;

    // Highlight winner cards
    allPlayedCards.forEach((card) => {
      card.classList.add("winner");
    });

    winnerCountElement.classList.add("winner");
    winnerDeck.classList.add("winner-glow");

    // Animate cards flying to winner's deck
    setTimeout(() => {
      allPlayedCards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add("winning-card");
        }, index * 100);
      });
    }, 300);

    setTimeout(() => {
      this.clearPlayedCards();
      winnerCountElement.classList.remove("winner");
      winnerDeck.classList.remove("winner-glow");
    }, this.animations.winnerHighlightDelay);
  }

  clearPlayedCards() {
    this.elements.player1PlayedCards.innerHTML = "";
    this.elements.player2PlayedCards.innerHTML = "";
    this.elements.centralBattleCards.innerHTML = "";
    this.disableBattleLayout();
  }

  updateUI() {
    const gameState = this.gameEngine.getGameState();

    this.elements.player1Count.textContent =
      gameState.players[0]?.cardCount || 0;
    this.elements.player2Count.textContent =
      gameState.players[1]?.cardCount || 0;

    // Update deck volume effect
    this.updateDeckVolume();
    this.updateDeckVisibility();
    this.updateButtonStates();
    this.updateProgressBar();
    this.updateGameStateText();
  }

  updateDeckVolume() {
    const gameState = this.gameEngine.getGameState();

    // Update player 1 deck volume
    const player1Deck = this.elements.player1Deck.parentElement;
    const player1Cards = gameState.players[0]?.cardCount || 0;
    player1Deck.setAttribute("data-cards", player1Cards);

    // Update player 2 deck volume
    const player2Deck = this.elements.player2Deck.parentElement;
    const player2Cards = gameState.players[1]?.cardCount || 0;
    player2Deck.setAttribute("data-cards", player2Cards);
  }

  updateDeckVisibility() {
    const gameState = this.gameEngine.getGameState();

    if (gameState.players[0]?.cardCount === 0) {
      this.elements.player1Deck.classList.add("empty");
    } else {
      this.elements.player1Deck.classList.remove("empty");
    }

    if (gameState.players[1]?.cardCount === 0) {
      this.elements.player2Deck.classList.add("empty");
    } else {
      this.elements.player2Deck.classList.remove("empty");
    }
  }

  updateButtonStates() {
    const canPlay =
      this.gameEngine.gameState === "ready" ||
      this.gameEngine.gameState === "playing";

    this.elements.playBtn.disabled = !canPlay;
    this.elements.autoPlayBtn.disabled = !canPlay;

    if (this.gameEngine.gameState === "finished") {
      this.elements.playBtn.disabled = true;
      this.elements.autoPlayBtn.disabled = true;
    }
  }

  updateAutoPlayButton() {
    if (this.isAutoPlaying) {
      this.elements.autoPlayBtn.textContent = "Stop Auto";
      this.elements.autoPlayBtn.classList.add("active");
    } else {
      this.elements.autoPlayBtn.textContent = "Auto Play";
      this.elements.autoPlayBtn.classList.remove("active");
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
    const total =
      gameState.players[0]?.cardCount + gameState.players[1]?.cardCount;
    const player1Percentage =
      total > 0 ? (gameState.players[0]?.cardCount / total) * 100 : 50;

    this.elements.progressFill.style.width = `${player1Percentage}%`;
  }

  updateGameStateText() {
    const gameState = this.gameEngine.getGameState();
    let stateText = "";

    switch (gameState.gameState) {
      case "waiting":
        stateText = 'Press "New Game" to start';
        break;
      case "ready":
        stateText = 'Ready to play - Press "Play Round" or Space';
        break;
      case "playing":
        stateText = "Playing round...";
        break;
      case "finished":
        stateText = `Game finished! ${gameState.winner?.name} wins!`;
        break;
      default:
        stateText = "Unknown state";
    }

    this.elements.gameState.textContent = stateText;
  }

  getBattleMessage(result) {
    switch (result.type) {
      case "normal":
        return `${result.winner.name} wins the round!`;
      case "battle_continue":
        return "WAR! New battle in progress...";
      case "battle_resolved":
        return `🎉 ${result.winner.name} wins the battle!`;
      case "battle_insufficient_cards":
        return `${result.winner.name} wins - opponent has no cards!`;
      case "battle_draw":
        return "Battle ended - perfect draw!";
      case "insufficient_cards":
        return "Round impossible - not enough cards!";
      default:
        return "Round ended";
    }
  }

  handleGameEnd(data) {
    const { winner, gameStats, totalRounds } = data;

    let message = "";
    if (winner) {
      message = `🎉 ${winner.name} wins!\n\n`;
      message += `Game Statistics:\n`;
      message += `• Total Rounds: ${totalRounds}\n`;
      message += `• Battles: ${gameStats.battles}\n`;
      message += `• Longest Battle: ${gameStats.longestBattle} cards`;
    } else {
      message = "Game ended in a draw!";
    }

    this.elements.winnerMessage.textContent = message;
    this.showModal();
  }

  showModal() {
    this.elements.gameOverModal.classList.add("active");
  }

  closeModal() {
    this.elements.gameOverModal.classList.remove("active");
  }

  playAgain() {
    this.closeModal();
    this.startNewGame();
  }

  updateGameState(data) {
    this.updateUI();
  }

  toggleBattleMode(enable) {
    const gameBoard = document.querySelector(".game-board");
    const vsIndicator = document.querySelector(".vs-indicator");

    if (enable) {
      gameBoard.classList.add("war-mode");
      vsIndicator.classList.add("battle-mode");
      vsIndicator.textContent = "WAR!";
    } else {
      gameBoard.classList.remove("war-mode");
      vsIndicator.classList.remove("battle-mode");
      vsIndicator.textContent = "VS";
    }
  }

  animateDeckShake(playerId) {
    const deckElement =
      playerId === 1 ? this.elements.player1Deck : this.elements.player2Deck;

    deckElement.classList.add("shake");
    setTimeout(() => {
      deckElement.classList.remove("shake");
    }, 500);
  }
}
