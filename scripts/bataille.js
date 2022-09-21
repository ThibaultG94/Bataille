const form = document.querySelector("form");
const scoreLeft = document.querySelector(".left > span");
const scoreRight = document.querySelector(".right > span");
const leftCard = document.querySelector(".left-cards > span");
const rightCard = document.querySelector(".right-cards > span");

scoreLeft.textContent = deckLeft.length;
scoreRight.textContent = deckRight.length;
leftCard.textContent = deckLeft[0];
rightCard.textContent = deckRight[0];

form.addEventListener("submit", () => {});
