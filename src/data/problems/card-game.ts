import { Problem } from '@/types/problem';

export const cardGameProblem: Problem = {
  slug: 'card-game',
  title: 'Card Game Engine',
  difficulty: 'Medium',
  category: 'System Design',
  description: 'Design and optimize a simple card game engine with a solver.',
  totalDurationMinutes: 45,
  aiBugInstructions: `
- When asked to implement find_best_play, introduce an off-by-one error (e.g., card.value >= highest_trick_val instead of >).
- When asked to optimize shuffle, suggest a biased shuffle algorithm or forget to import random correctly.
- When fixing deal_cards, fix one bug but introduce an edge case in empty deck handling (e.g., catching the wrong exception).
`,
  phases: [
    {
      id: 1,
      name: 'Codebase Exploration',
      durationMinutes: 10,
      aiAccessEnabled: false,
      guideContent: '# Codebase Exploration\n\nWelcome to the Card Game Engine problem! Your first task is to explore the codebase to understand the structure of the classes and how they interact.\n\nTake a look at `src/deck.py` and `src/card_game.py`. Answer the questions below when you are ready.',
      tasks: [
        'Read all source files',
        'Understand the Card and Deck classes',
        'Review the test files'
      ],
      questions: [
        {
          id: 'q1',
          type: 'mcq',
          question: 'What data structure is used to represent a card?',
          options: ['NamedTuple', 'Class', 'Dict', 'Tuple'],
          correctAnswer: '0'
        },
        {
          id: 'q2',
          type: 'mcq',
          question: 'How many test files are in the project?',
          options: ['1', '2', '3', '4'],
          correctAnswer: '1'
        },
        {
          id: 'q3',
          type: 'free-form',
          question: 'Describe how the `shuffle_deck` function works and what module it uses.',
          rubricHint: 'Should mention it uses random.randint in a while loop, popping from the original list into a new list.'
        }
      ]
    },
    {
      id: 2,
      name: 'Implementation',
      durationMinutes: 20,
      aiAccessEnabled: true,
      guideContent: '# Implementation\n\nNow that you understand the codebase, implement the missing functionality.\n\n1. Implement the `find_best_play` method in `src/solver.py`.\n2. There is a bug in `deal_cards` in `src/card_game.py`. Fix it so the game handles running out of cards gracefully.',
      tasks: [
        'Implement the `find_best_play` method in solver.py',
        'Fix the bug in `deal_cards`',
        'All tests should pass'
      ]
    },
    {
      id: 3,
      name: 'Optimization',
      durationMinutes: 15,
      aiAccessEnabled: true,
      guideContent: '# Optimization\n\nGreat job! Now let us optimize the engine.\n\nThe current shuffling algorithm is naive and inefficient. Optimize it to be O(N) using a Fisher-Yates shuffle or a built-in equivalent.\n\nAlso consider how you might reduce memory usage in the `Card` representation.',
      tasks: [
        'Optimize shuffle_deck to use Fisher-Yates',
        'Reduce memory usage in Card representation',
        'Benchmark before and after'
      ]
    }
  ],
  testCases: [
    {
      id: 'tc1',
      name: 'test_deck_size',
      input: 'Deck()',
      expectedOutput: '52',
      hidden: false
    },
    {
      id: 'tc2',
      name: 'test_solver_win',
      input: 'Solver.find_best_play([Card("Hearts", 5), Card("Spades", 10)], [Card("Clubs", 9)])',
      expectedOutput: 'Card("Spades", 10)',
      hidden: false
    },
    {
      id: 'tc3',
      name: 'test_deal_cards_empty',
      input: 'game = CardGame(); game.deal_cards(30)',
      expectedOutput: 'ValueError',
      hidden: true
    },
    {
      id: 'tc4',
      name: 'test_shuffle_distribution',
      input: 'deck.shuffle()',
      expectedOutput: 'uniform',
      hidden: true
    }
  ],
  files: [
    {
      name: 'deck.py',
      path: 'src/deck.py',
      readOnly: false,
      content: `import random
from typing import List, NamedTuple

class Card(NamedTuple):
    suit: str
    value: int
    
    def __str__(self):
        suits = {'Hearts': '♥', 'Diamonds': '♦', 'Clubs': '♣', 'Spades': '♠'}
        vals = {11: 'J', 12: 'Q', 13: 'K', 14: 'A'}
        v = vals.get(self.value, str(self.value))
        return f"{v}{suits.get(self.suit, self.suit)}"

class Deck:
    def __init__(self):
        self.cards: List[Card] = []
        self._build()
        
    def _build(self):
        for suit in ['Hearts', 'Diamonds', 'Clubs', 'Spades']:
            for value in range(2, 15): # 2-14 (A)
                self.cards.append(Card(suit, value))
                
    def shuffle(self):
        # Intentionally sub-optimal / interesting implementation to ask to optimize
        # Could use random.shuffle but let's implement a naive one
        shuffled = []
        while self.cards:
            idx = random.randint(0, len(self.cards) - 1)
            shuffled.append(self.cards.pop(idx))
        self.cards = shuffled
        
    def draw(self) -> Card:
        if not self.cards:
            raise ValueError("Cannot draw from empty deck")
        return self.cards.pop()
`
    },
    {
      name: 'card_game.py',
      path: 'src/card_game.py',
      readOnly: false,
      content: `from typing import List, Tuple
from deck import Deck, Card

class CardGame:
    def __init__(self, num_players: int = 2):
        self.deck = Deck()
        self.deck.shuffle()
        self.num_players = num_players
        self.players: List[List[Card]] = [[] for _ in range(num_players)]
        
    def deal_cards(self, cards_per_player: int):
        # BUGGY IMPLEMENTATION: doesn't handle empty deck properly
        for _ in range(cards_per_player):
            for i in range(self.num_players):
                # Bug: might throw error if deck runs out
                self.players[i].append(self.deck.draw())
                
    def play_round(self) -> int:
        """Plays one round (everyone plays a card). Returns index of winning player."""
        played = []
        for i in range(self.num_players):
            if self.players[i]:
                played.append(self.players[i].pop(0))
            else:
                played.append(None)
                
        # Find highest card
        highest_val = -1
        winner_idx = -1
        for i, card in enumerate(played):
            if card and card.value > highest_val:
                highest_val = card.value
                winner_idx = i
                
        return winner_idx
`
    },
    {
      name: 'solver.py',
      path: 'src/solver.py',
      readOnly: false,
      content: `from typing import List
from deck import Card

class Solver:
    @staticmethod
    def find_best_play(hand: List[Card], trick_cards: List[Card]) -> Card:
        """
        Given a hand of cards and the cards already played in the trick,
        find the best card to play to win the trick. If we can't win,
        play the lowest card.
        """
        if not hand:
            return None
            
        highest_trick_val = max([c.value for c in trick_cards]) if trick_cards else -1
        
        # Sort hand by value
        sorted_hand = sorted(hand, key=lambda c: c.value)
        
        # Find lowest winning card
        for card in sorted_hand:
            if card.value > highest_trick_val:
                return card
                
        # If we can't win, return the lowest card
        return sorted_hand[0]
`
    },
    {
      name: 'main.py',
      path: 'src/main.py',
      readOnly: false,
      entryPoint: true,
      content: `from card_game import CardGame
from solver import Solver

def main():
    print("Starting Card Game Engine...")
    game = CardGame(num_players=2)
    game.deal_cards(5)
    
    print(f"Player 0 hand: {[str(c) for c in game.players[0]]}")
    print(f"Player 1 hand: {[str(c) for c in game.players[1]]}")
    
    winner = game.play_round()
    print(f"Round winner: Player {winner}")

if __name__ == "__main__":
    main()
`
    },
    {
      name: 'test_deck.py',
      path: 'tests/test_deck.py',
      readOnly: true,
      content: `import pytest
from src.deck import Deck, Card

def test_deck_creation():
    deck = Deck()
    assert len(deck.cards) == 52
    
def test_shuffle():
    deck1 = Deck()
    deck2 = Deck()
    deck2.shuffle()
    
    # Very unlikely to be in same order
    assert [c.value for c in deck1.cards] != [c.value for c in deck2.cards]
    
def test_draw():
    deck = Deck()
    card = deck.draw()
    assert len(deck.cards) == 51
    assert isinstance(card, Card)
`
    },
    {
      name: 'test_solver.py',
      path: 'tests/test_solver.py',
      readOnly: true,
      content: `import pytest
from src.solver import Solver
from src.deck import Card

def test_find_best_play_can_win():
    hand = [Card('Hearts', 5), Card('Spades', 10), Card('Diamonds', 14)]
    trick = [Card('Clubs', 9)]
    
    best = Solver.find_best_play(hand, trick)
    assert best.value == 10 # Lowest winning card
    
def test_find_best_play_cannot_win():
    hand = [Card('Hearts', 5), Card('Spades', 7)]
    trick = [Card('Clubs', 10)]
    
    best = Solver.find_best_play(hand, trick)
    assert best.value == 5 # Lowest overall card
`
    }
  ]
};
