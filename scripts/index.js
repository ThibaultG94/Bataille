let deck = [1, 2, 3, 4, 5, 6];
let deckLeft = [];
let deckRight = [];
let i = 0;

function distribution() {
  if (i < 6) {
    let j = Math.floor(Math.random() * (6 - i));

    if (deckLeft.length > deckRight.length) {
      deckRight.push(deck[j]);
      deck.splice(j, 1);
      i++;
      distribution();
    } else {
      deckLeft.push(deck[j]);
      deck.splice(j, 1);
      i++;
      distribution();
    }
  }
}

distribution();
console.log(deck);
console.log(deckLeft);
console.log(deckRight);
