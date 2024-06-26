export enum CardSuit {
  Clubs = "clubs",
  Diamonds = "diamonds",
  Hearts = "hearts",
  Spades = "spades",
}

export enum CardRank {
  Ace = "ace",
  Two = "2",
  Three = "3",
  Four = "4",
  Five = "5",
  Six = "6",
  Seven = "7",
  Eight = "8",
  Nine = "9",
  Ten = "10",
  Jack = "jack",
  Queen = "queen",
  King = "king",
}

export const CardValue = {
  [CardRank.Ace]: 0,
  [CardRank.Two]: 2,
  [CardRank.Three]: 3,
  [CardRank.Four]: 4,
  [CardRank.Five]: 5,
  [CardRank.Six]: 6,
  [CardRank.Seven]: 7,
  [CardRank.Eight]: 8,
  [CardRank.Nine]: 9,
  [CardRank.Ten]: 10,
  [CardRank.Jack]: 10,
  [CardRank.Queen]: 10,
  [CardRank.King]: 10,
} as const;

export type CardValues = (typeof CardValue)[keyof typeof CardValue];

export type GameResult = "no_result" | "player_win" | "dealer_win" | "draw";

export type Turn = "player_turn" | "dealer_turn";

export type Card = {
  suit: CardSuit;
  rank: CardRank;
};

export type CardDeck = Array<Card>;
export type Hand = Array<Card>;
export type GameState = {
  cardDeck: CardDeck;
  playerHand: Hand;
  dealerHand: Hand;
  turn: Turn;
};
