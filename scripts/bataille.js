const form = document.querySelector("form");
const scoreLeft = document.querySelector(".left > span");
const scoreRight = document.querySelector(".right > span");
const leftCard = document.querySelector(".left-cards > span");
const rightCard = document.querySelector(".right-cards > span");
let n = 0;

function display() {
  scoreLeft.textContent = deckLeft.length;
  scoreRight.textContent = deckRight.length;
  leftCard.textContent = deckLeft[0];
  rightCard.textContent = deckRight[0];
}

function battle() {
  if (deckLeft[n] > deckRight[n]) {
    deckLeft.push(deckRight[0]);
    deckRight.splice(0, 1);
    let winCard = deckLeft[0];
    deckLeft.splice(0, 1);
    deckLeft.push(winCard);
    display();
  } else if (deckLeft[n] < deckRight[n]) {
    deckRight.push(deckLeft[0]);
    deckLeft.splice(0, 1);
    let winCard = deckRight[0];
    deckRight.splice(0, 1);
    deckRight.push(winCard);
    display();
  } else {
    console.log("Egalité");
  }
}

display();

form.addEventListener("submit", () => {
  battle();
});
