document.addEventListener('DOMContentLoaded', () => {
    const gameEngine = new GameEngine();
    const gameUI = new GameUI(gameEngine);
    
    window.gameEngine = gameEngine;
    window.gameUI = gameUI;
    
    gameUI.updateBattleMessage('Bienvenue dans la Bataille! Cliquez "New Game" pour commencer.');
    
    console.log('War Card Game initialized successfully!');
    console.log('Ace is now the highest card (value: 14)');
});