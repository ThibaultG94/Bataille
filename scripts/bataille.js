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

//-----------------------------------------
// FONCTION EGALITE DES CARTES
//-----------------------------------------

function equalBattle() {
  if (n > 0) {
    if (deckLeft[n] > deckRight[n]) {
      for (let i = n; i > 0; i--) {
        deckLeft.push(deckRight[n]);
        deckRight.splice(n, 1);
        let winCard = deckLeft[n];
        deckLeft.splice(n, 1);
        deckLeft.push(winCard);
        n--;
      }
      left = true;
      removeCards();
      equalBattle();
    } else if (deckLeft[n] < deckRight[n]) {
      for (let i = n; i > 0; i--) {
        deckRight.push(deckLeft[n]);
        deckLeft.splice(n, 1);
        let winCard = deckRight[n];
        deckRight.splice(n, 1);
        deckRight.push(winCard);
        n--;
      }
      right = true;
      removeCards();
      equalBattle();
    } else {
      n++;
      let newSpanLeft = document.createElement("span");
      let newSpanRight = document.createElement("span");
      document.querySelector(".left-cards").append(newSpanLeft);
      document.querySelector(".right-cards").append(newSpanRight);
      newSpanLeft.classList = "delete";
      newSpanRight.classList = "delete";
      newSpanLeft.textContent = deckLeft[n];
      newSpanRight.textContent = deckRight[n];
    }
  } else {
    if (left) {
      deckLeft.push(deckRight[0]);
      deckRight.splice(0, 1);
      let winCard = deckLeft[0];
      deckLeft.splice(0, 1);
      deckLeft.push(winCard);
      display();
      left = false;
      right = false;
    } else if (right) {
      deckRight.push(deckLeft[0]);
      deckLeft.splice(0, 1);
      let winCard = deckRight[0];
      deckRight.splice(0, 1);
      deckRight.push(winCard);
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
    n = 0;
    if (deckLeft[0] > deckRight[0]) {
      deckLeft.push(deckRight[0]);
      deckRight.splice(0, 1);
      let winCard = deckLeft[0];
      deckLeft.splice(0, 1);
      deckLeft.push(winCard);
      display();
    } else if (deckLeft[0] < deckRight[0]) {
      deckRight.push(deckLeft[0]);
      deckLeft.splice(0, 1);
      let winCard = deckRight[0];
      deckRight.splice(0, 1);
      deckRight.push(winCard);
      display();
    } else {
      n++;
      let newSpanLeft = document.createElement("span");
      let newSpanRight = document.createElement("span");
      document.querySelector(".left-cards").append(newSpanLeft);
      document.querySelector(".right-cards").append(newSpanRight);
      newSpanLeft.classList = "delete";
      newSpanRight.classList = "delete";
      newSpanLeft.textContent = deckLeft[n];
      newSpanRight.textContent = deckRight[n];
    }
  }
}
display();

//-------------------------
// BOUTON JOUER
//-------------------------

form.addEventListener("submit", () => {
  battle();
  console.log(deckLeft);
  console.log(deckRight);
});
