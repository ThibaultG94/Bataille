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
  if (n > 0) {
    if (deckLeft[n] > deckRight[n]) {
      for (let i = n + 1; i > 0; i--) {
        deckLeft.push(deckRight[n]);
        deckRight.splice(n, 1);
        let winCard = deckLeft[n];
        deckLeft.splice(n, 1);
        deckLeft.push(winCard);
        n--;
      }
    } else if (deckLeft[n] < deckRight[n]) {
      for (let i = n + 1; i > 0; i--) {
        deckRight.push(deckLeft[n]);
        deckRight.splice(n, 1);
        let winCard = deckRight[n];
        deckRight.splice(n, 1);
        deckRight.push(winCard);
        n--;
      }
    } else {
      n++;
      console.log(n);
    }
    console.log(n);
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
    }
  }
}

display();

form.addEventListener("submit", () => {
  battle();
});
