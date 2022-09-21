const form = document.querySelector("form");
const scoreLeft = document.querySelector(".left > span");
const scoreRight = document.querySelector(".right > span");

scoreLeft.textContent = deckLeft.length;
scoreRight.textContent = deckRight.length;

form.addEventListener("submit", () => {
  console.log(scoreLeft, scoreRight);
});
