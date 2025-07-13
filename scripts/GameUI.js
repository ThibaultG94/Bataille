class GameUI {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.elements = {};
    this.animations = {
      cardSlideDelay: 400,
      battleDelay: 800,
      winnerHighlightDelay: 1500,
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
      this.gameEngine.startAutoPlay(800);
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
        }, 1000);
      }
    }, this.animations.cardSlideDelay);
  }

  animateCardPlay(result) {
    const { playedCards, battleCards, faceDownCards } = result;

    // Animate initial played cards to center avec nouvelles animations
    playedCards.forEach((play, index) => {
      setTimeout(() => {
        this.createCardElement(
          play.card,
          play.player.id,
          false,
          false,
          true,
          "slide-from-deck"
        );
        this.animateDeckShake(play.player.id);
      }, index * 200);
    });

    // Animate face-down cards in battle
    if (faceDownCards && faceDownCards.length > 0) {
      setTimeout(() => {
        faceDownCards.forEach((faceDown, index) => {
          setTimeout(() => {
            this.createCardElement(
              faceDown.card,
              faceDown.player.id,
              false,
              true,
              true,
              "slide-from-deck"
            );
          }, index * 150);
        });
      }, this.animations.battleDelay / 2);
    }

    // Animate battle cards
    if (battleCards && battleCards.length > 0) {
      setTimeout(() => {
        battleCards.forEach((battle, index) => {
          setTimeout(() => {
            this.createCardElement(
              battle.card,
              battle.player.id,
              true,
              false,
              true,
              "slide-from-deck"
            );
          }, index * 150);
        });
      }, this.animations.battleDelay);
    }
  }

  createCardElement(
    card,
    playerId,
    isBattleCard = false,
    isFaceDown = false,
    useCenter = false,
    animationClass = "slide-in"
  ) {
    const cardElement = document.createElement("div");
    cardElement.className = `card ${animationClass}`;
    cardElement.dataset.playerId = playerId;

    // Calculer les positions pour les animations
    if (animationClass === "slide-from-deck") {
      this.setCardAnimationPositions(cardElement, playerId);
    }

    // Ajouter la classe spécifique au joueur pour l'animation
    if (animationClass === "slide-from-deck") {
      cardElement.classList.add(
        playerId === 1 ? "from-player1" : "from-player2"
      );
    }

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

      // En mode bataille, ajuster le layout
      if (isBattleCard || isFaceDown) {
        targetElement.classList.add("battle-mode");
      }
    } else {
      targetElement =
        playerId === 1
          ? this.elements.player1PlayedCards
          : this.elements.player2PlayedCards;
    }

    // Pour les animations depuis le paquet, on ajoute au body puis on déplace vers le target
    if (animationClass === "slide-from-deck" && useCenter) {
      document.body.appendChild(cardElement);

      // Après l'animation, déplacer la carte vers le conteneur cible
      setTimeout(() => {
        if (cardElement.parentNode === document.body) {
          cardElement.style.position = "relative";
          cardElement.style.top = "auto";
          cardElement.style.left = "auto";
          cardElement.style.transform = "none";
          targetElement.appendChild(cardElement);
        }
      }, 1000);
    } else {
      targetElement.appendChild(cardElement);
    }

    setTimeout(() => {
      cardElement.classList.remove(
        animationClass,
        "from-player1",
        "from-player2"
      );
    }, this.animations.cardSlideDelay);
  }

  setCardAnimationPositions(cardElement, playerId) {
    // Calculer les positions des paquets et du centre
    const player1Deck = this.elements.player1Deck;
    const player2Deck = this.elements.player2Deck;
    const centralArea = this.elements.centralBattleCards;

    const player1Rect = player1Deck.getBoundingClientRect();
    const player2Rect = player2Deck.getBoundingClientRect();
    const centralRect = centralArea.getBoundingClientRect();

    // Position du centre de la zone de bataille
    const centerTop = centralRect.top + centralRect.height / 2 - 98; // 98 = moitié de la hauteur de carte
    const centerLeft = centralRect.left + centralRect.width / 2 - 70; // 70 = moitié de la largeur de carte

    // Positions des paquets
    const player1DeckTop = player1Rect.top;
    const player1DeckLeft = player1Rect.left;
    const player2DeckTop = player2Rect.top;
    const player2DeckLeft = player2Rect.left;

    // Injecter les variables CSS personnalisées
    cardElement.style.setProperty("--player1-deck-top", `${player1DeckTop}px`);
    cardElement.style.setProperty(
      "--player1-deck-left",
      `${player1DeckLeft}px`
    );
    cardElement.style.setProperty("--player2-deck-top", `${player2DeckTop}px`);
    cardElement.style.setProperty(
      "--player2-deck-left",
      `${player2DeckLeft}px`
    );
    cardElement.style.setProperty("--center-top", `${centerTop}px`);
    cardElement.style.setProperty("--center-left", `${centerLeft}px`);
  }

  enableBattleLayout() {
    this.elements.player1PlayedCards.classList.add("battle-mode");
    this.elements.player2PlayedCards.classList.add("battle-mode");
  }

  disableBattleLayout() {
    this.elements.player1PlayedCards.classList.remove("battle-mode");
    this.elements.player2PlayedCards.classList.remove("battle-mode");
    this.elements.centralBattleCards.classList.remove("battle-mode");
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

    // Animate cards flying to winner's deck avec nouvelles animations
    setTimeout(() => {
      allPlayedCards.forEach((card, index) => {
        setTimeout(() => {
          // Calculer les positions pour l'animation de retour
          this.setReturnAnimationPositions(card, winner.id);

          // Ajouter les classes spécifiques selon le gagnant
          if (winner.id === 1) {
            card.classList.add("fly-to-winner", "to-player1");
          } else {
            card.classList.add("fly-to-winner", "to-player2");
          }

          // Déplacer vers le body pour l'animation globale
          if (card.parentNode !== document.body) {
            const rect = card.getBoundingClientRect();
            card.style.position = "fixed";
            card.style.top = `${rect.top}px`;
            card.style.left = `${rect.left}px`;
            card.style.setProperty("--center-top", `${rect.top}px`);
            card.style.setProperty("--center-left", `${rect.left}px`);
            document.body.appendChild(card);
          }
        }, index * 100);
      });
    }, 300);

    setTimeout(() => {
      this.clearPlayedCards();
      winnerCountElement.classList.remove("winner");
      winnerDeck.classList.remove("winner-glow");

      // Nettoyer les cartes restantes dans le body
      document.querySelectorAll(".card.fly-to-winner").forEach((card) => {
        if (card.parentNode === document.body) {
          card.remove();
        }
      });
    }, this.animations.winnerHighlightDelay);
  }

  setReturnAnimationPositions(cardElement, winnerId) {
    // Calculer les positions pour l'animation de retour
    const winnerDeck =
      winnerId === 1 ? this.elements.player1Deck : this.elements.player2Deck;
    const winnerRect = winnerDeck.getBoundingClientRect();

    // Position du paquet gagnant
    const winnerDeckTop = winnerRect.top;
    const winnerDeckLeft = winnerRect.left;

    // Injecter les variables CSS pour l'animation de retour
    if (winnerId === 1) {
      cardElement.style.setProperty("--player1-deck-top", `${winnerDeckTop}px`);
      cardElement.style.setProperty(
        "--player1-deck-left",
        `${winnerDeckLeft}px`
      );
    } else {
      cardElement.style.setProperty("--player2-deck-top", `${winnerDeckTop}px`);
      cardElement.style.setProperty(
        "--player2-deck-left",
        `${winnerDeckLeft}px`
      );
    }
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

    deckElement.parentElement.classList.add("shake");
    setTimeout(() => {
      deckElement.parentElement.classList.remove("shake");
    }, 600);
  }
}
