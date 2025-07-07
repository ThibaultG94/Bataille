document.addEventListener('DOMContentLoaded', () => {
    const gameEngine = new GameEngine();
    const gameUI = new GameUI(gameEngine);
    
    window.gameEngine = gameEngine;
    window.gameUI = gameUI;
    
    gameUI.updateBattleMessage('Welcome to War! Click "New Game" to start playing.');
    
    console.log('War Card Game initialized successfully!');
    console.log('Game Engine:', gameEngine);
    console.log('Game UI:', gameUI);
});