const form = document.querySelector("form");
const scoreLeft = document.querySelector(".left > span");
const scoreRight = document.querySelector(".right > span");
const leftCard = document.querySelector(".left-cards > span");
const rightCard = document.querySelector(".right-cards > span");
let n = 0;
let left = false;
let right = false;

//-------------------------------------------------
// FONCTION AFFICHAGE DU SCORE ET DES CARTES
//-------------------------------------------------

function display() {
  scoreLeft.textContent = deckLeft.length;
  scoreRight.textContent = deckRight.length;
  leftCard.textContent = deckLeft[0];
  rightCard.textContent = deckRight[0];
}

//--------------------------------------------------
// FONCTION RAJOUT DE CARTES EN CAS D'EGALITE
//--------------------------------------------------

function addCards() {
  let newSpanLeft = document.createElement("span");
  let newSpanRight = document.createElement("span");
  document.querySelector(".left-cards").append(newSpanLeft);
  document.querySelector(".right-cards").append(newSpanRight);
  newSpanLeft.classList = "delete";
  newSpanRight.classList = "delete";
  newSpanLeft.textContent = deckLeft[n];
  newSpanRight.textContent = deckRight[n];
}

//----------------------------------------------------
// FONCTION ENLEVEMENT DES CARTES EN CAS D'EGALITE
//----------------------------------------------------

function removeCards() {
  let removeCardsLeft = document.querySelector(".left-cards > .delete");
  let removeCardsRight = document.querySelector(".right-cards > .delete");
  if (removeCardsLeft) {
    removeCardsLeft.remove();
    removeCardsRight.remove();
    removeCards();
  } else if (removeCardsRight) {
    removeCardsLeft.remove();
    removeCardsRight.remove();
    removeCards();
  }
}

//-----------------------------
// FONCTIONS GAGNANTES
//----------------------------

function winLeft(e) {
  deckLeft.push(deckRight[e]);
  deckRight.splice(e, 1);
  let winCard = deckLeft[e];
  deckLeft.splice(e, 1);
  deckLeft.push(winCard);
}

function winRight(e) {
  deckRight.push(deckLeft[e]);
  deckLeft.splice(e, 1);
  let winCard = deckRight[e];
  deckRight.splice(e, 1);
  deckRight.push(winCard);
}

//-----------------------------------------
// FONCTION EGALITE DES CARTES
//-----------------------------------------

function equalBattle() {
  if (n > 0) {
    if (deckLeft[n] > deckRight[n]) {
      for (let i = n; i > 0; i--) {
        winLeft(n);
        n--;
      }
      left = true;
      removeCards();
      equalBattle();
    } else if (deckLeft[n] < deckRight[n]) {
      for (let i = n; i > 0; i--) {
        winRight(n);
        n--;
      }
      right = true;
      removeCards();
      equalBattle();
    } else {
      n++;
      addCards();
    }
  } else {
    if (left) {
      winLeft(0);
      display();
      left = false;
      right = false;
    } else if (right) {
      winRight(0);
      display();
      left = false;
      right = false;
    } else {
      alert("Error");
    }
  }
}

//------------------------------------
// FONCTION PRINCIPALE
//------------------------------------

function battle() {
  if (n > 0) {
    equalBattle();
  } else {
    if (deckLeft[0] > deckRight[0]) {
      winLeft(0);
      display();
    } else if (deckLeft[0] < deckRight[0]) {
      winRight(0);
      display();
    } else {
      n++;
      addCards();
    }
  }
}

//-------------------------
// BOUTON JOUER
//-------------------------

display();

form.addEventListener("submit", () => {
  if (deckLeft.length > 0 && deckRight.length > 0) {
    battle();
  } else if (deckLeft.length > deckRight.length) {
    alert("Left Win !");
  } else if (deckLeft.length < deckRight.length) {
    alert("Right Win !");
  } else {
    alert("Error :(");
  }
});

function battleTest() {
  if (deckLeft.length > n && deckRight.length > n) {
    battle();
  } else if (deckLeft.length > deckRight.length) {
    alert("Left Win !");
    clearInterval(intervalId);
  } else if (deckLeft.length < deckRight.length) {
    alert("Right Win !");
    clearInterval(intervalId);
  } else {
    alert("Error :(");
    clearInterval(intervalId);
  }
}

function speedTest() {
  intervalId = setInterval(battleTest, 1);
}

speedTest();
