let cartes = 52;
let deck = [];
let deckLeft = [];
let deckRight = [];
let x = 2;
let i = 0;

function initialiseDeck() {
  if (deck.length < cartes) {
    if (x === 14) {
      x = 100;
      initialiseDeck();
    } else {
      deck.push(x, x, x, x);
      x++;
      initialiseDeck();
    }
  }
}

function distribution() {
  if (i < cartes) {
    let j = Math.floor(Math.random() * (cartes - i));

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

initialiseDeck();
distribution();
console.log(deck);
console.log(deckLeft);
console.log(deckRight);
