import { useState } from "react";
import {
  Card,
  CardRank,
  CardDeck,
  CardSuit,
  GameState,
  Hand,
  GameResult,
  CardValue,
} from "./types";

//UI Elements
const CardBackImage = () => (
  <img
    src={process.env.PUBLIC_URL + `/SVG-cards/png/1x/back.png`}
    alt="Card - Back"
  />
);

const CardImage = ({ suit, rank }: Card) => {
  const card = rank === CardRank.Ace ? 1 : rank;
  return (
    <img
      src={
        process.env.PUBLIC_URL +
        `/SVG-cards/png/1x/${suit.slice(0, -1)}_${card}.png`
      }
      alt={`Card - ${suit.slice(0, -1)}_${card}`}
    />
  );
};

//Setup
const newCardDeck = (): CardDeck =>
  Object.values(CardSuit)
    .map((suit) =>
      Object.values(CardRank).map((rank) => ({
        suit,
        rank,
      }))
    )
    .reduce((a, v) => [...a, ...v]);

const shuffle = (deck: CardDeck): CardDeck => {
  return deck.sort(() => Math.random() - 0.5);
};

const takeCard = (deck: CardDeck): { card: Card; remaining: CardDeck } => {
  const card = deck[deck.length - 1];
  const remaining = deck.slice(0, deck.length - 1);
  return { card, remaining };
};

const setupGame = (): GameState => {
  const cardDeck = shuffle(newCardDeck());
  return {
    playerHand: cardDeck.slice(cardDeck.length - 2, cardDeck.length),
    dealerHand: cardDeck.slice(cardDeck.length - 4, cardDeck.length - 2),
    cardDeck: cardDeck.slice(0, cardDeck.length - 4), // remaining cards after player and dealer have been give theirs
    turn: "player_turn",
  };
};

const sumReducer = (accumulator: number, current: Card): number => {
  return accumulator + CardValue[current.rank];
};

//Scoring
const calculateHandScore = (hand: Hand): number => {
  const aces = hand.filter((card) => card.rank === CardRank.Ace);
  const rest = hand.filter((card) => card.rank !== CardRank.Ace);

  let score = rest.reduce(sumReducer, 0);

  if (aces.length) {
    const reminder = 21 - score;

    // There can be only one ace with value 11 before busting the score
    // Check if score is busted by accumulating aces with a single 11 value
    if (11 + (aces.length - 1) <= reminder) {
      score += 11 + (aces.length - 1);
    } else {
      // If score was busted treat all aces as 1
      score += aces.length;
    }
  }

  return score;
};

const determineGameResult = (state: GameState): GameResult => {
  const { dealerHand, playerHand } = state;
  const playerScore = calculateHandScore(playerHand);
  const dealerScore = calculateHandScore(dealerHand);

  if (playerScore > 21 || (dealerScore <= 21 && dealerScore > playerScore)) {
    return "dealer_win";
  }

  if (dealerScore > 21 || playerScore > dealerScore) {
    return "player_win";
  }

  if (dealerScore === playerScore) {
    return "draw";
  }

  return "no_result";
};

//Player Actions
const playerStands = (state: GameState): GameState => {
  const score = calculateHandScore(state.dealerHand);

  if (score <= 16) {
    const { card, remaining } = takeCard(state.cardDeck);
    return {
      ...state,
      cardDeck: remaining,
      dealerHand: [...state.dealerHand, card],
      turn: "dealer_turn",
    };
  }

  return {
    ...state,
    turn: "dealer_turn",
  };
};

const playerHits = (state: GameState): GameState => {
  const { card, remaining } = takeCard(state.cardDeck);
  return {
    ...state,
    cardDeck: remaining,
    playerHand: [...state.playerHand, card],
  };
};

//UI Component
const Game = (): JSX.Element => {
  const [state, setState] = useState(setupGame());

  return (
    <>
      <div>
        <p>There are {state.cardDeck.length} cards left in deck</p>
        <button
          disabled={state.turn === "dealer_turn"}
          onClick={(): void => setState(playerHits)}
        >
          Hit
        </button>
        <button
          disabled={state.turn === "dealer_turn"}
          onClick={(): void => setState(playerStands)}
        >
          Stand
        </button>
        <button onClick={(): void => setState(setupGame())}>Reset</button>
      </div>
      <p>Player Cards</p>
      <div>
        {state.playerHand.map(CardImage)}
        <p>Player Score {calculateHandScore(state.playerHand)}</p>
      </div>
      <p>Dealer Cards</p>
      {state.turn === "player_turn" && state.dealerHand.length > 0 ? (
        <div>
          <CardBackImage />
          <CardImage {...state.dealerHand[1]} />
        </div>
      ) : (
        <div>
          {state.dealerHand.map(CardImage)}
          <p>Dealer Score {calculateHandScore(state.dealerHand)}</p>
        </div>
      )}
      {state.turn === "dealer_turn" &&
      determineGameResult(state) !== "no_result" ? (
        <p>{determineGameResult(state)}</p>
      ) : (
        <p>{state.turn}</p>
      )}
    </>
  );
};

export {
  Game,
  playerHits,
  playerStands,
  determineGameResult,
  calculateHandScore,
  setupGame,
};
