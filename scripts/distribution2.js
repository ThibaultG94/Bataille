let cartes = 52;
let deck = [];
let deckLeft = [];
let deckRight = [];
let x = 2;
let y = 0;

class battleCard {
  constructor(family, value) {
    this.family = family;
    this.value = value;
  }
}

function distribution(family) {
  if (x < 15) {
    deck.push(new battleCard(family, x));
    x++;
  } else {
    y++;
  }
}

function initialiseDeck() {
  if (y < 1) {
    distribution(carreaux);
  } else if (y < 2) {
    distribution(coeurs);
  } else if (y < 3) {
    distribution(piques);
  } else if (y < 4) {
    distribution(trefles);
  } else {
    console.log(deck);
  }
}

initialiseDeck();
