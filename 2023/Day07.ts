import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, 'input7.txt');
const content = readFileSync(filePath, 'utf8').split("\n");

console.log(playCamelCards(content));

type Card = 'A' | 'K' | 'Q' | 'J' | 'T' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2';
type Hand = Card[];
type Bid = number;
type HandRanking = 'FiveOfAKind' | 'FourOfAKind' | 'FullHouse' | 'ThreeOfAKind' | 'TwoPair' | 'OnePair' | 'HighCard';
interface HandBid {
    hand: Hand;
    bid: Bid;
    type: HandRanking;
}


function calculateWinnings(sortedHands: HandBid[]): number {
    return sortedHands.reduce((total, handBid, index) => {
        return total + handBid.bid * (index + 1);
    }, 0);
}


function playCamelCards(input: string[]): number {
    const parsedHands = parseInput(input);
    const sortedHands = sortHands(parsedHands);
    return calculateWinnings(sortedHands);
}


function classifyWithoutJoker(hand: Hand): HandRanking {
    // Create a map to count the frequency of each card
    const cardFrequency: { [card in Card]?: number } = {};

    hand.forEach(card => {
        if (cardFrequency[card]) {
            cardFrequency[card]! += 1;
        } else {
            cardFrequency[card] = 1;
        }
    });

    const frequencies = Object.values(cardFrequency).sort((a, b) => b - a);

    if (frequencies[0] === 5) {
        return 'FiveOfAKind';
    } else if (frequencies[0] === 4) {
        return 'FourOfAKind';
    } else if (frequencies[0] === 3 && frequencies[1] === 2) {
        return 'FullHouse';
    } else if (frequencies[0] === 3) {
        return 'ThreeOfAKind';
    } else if (frequencies[0] === 2 && frequencies[1] === 2) {
        return 'TwoPair';
    } else if (frequencies[0] === 2) {
        return 'OnePair';
    } else {
        return 'HighCard';
    }
}


function classifyHand(hand: Hand): HandRanking {
    // Count the number of Jokers
    const jokerCount = hand.filter(card => card === 'J').length;

    if (jokerCount === 0) {
        // If there are no Jokers, classify normally
        return classifyWithoutJoker(hand);
    } else if (jokerCount === 5 || jokerCount === 4) {
        // Special case for 5 of a kind
        return "FiveOfAKind";
    } else {
        // Generate all possible hands replacing Jokers
        // This is a complex task and requires considering all possible replacements
        const possibleHands = generatePossibleHands(hand, jokerCount);

        // Classify each possible hand and select the strongest type
        let bestHandType: HandRanking = 'HighCard';
        possibleHands.forEach(possibleHand => {
            const currentType = classifyWithoutJoker(possibleHand);
            if (isStrongerHandType(currentType, bestHandType)) {
                bestHandType = currentType;
            }
        });

        return bestHandType;
    }
}

function generatePossibleHands(hand: Hand, jokerCount: number): Hand[] {
    const allCards: Card[] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A'];
    let possibleHands: Hand[] = [];

    // Function to recursively replace jokers with all possible cards
    function replaceJoker(currentHand: Hand, jokersLeft: number): void {
        if (jokersLeft === 0) {
            // No more jokers left to replace, add the hand to the list
            possibleHands.push([...currentHand]);
        } else {
            for (let i = 0; i < allCards.length; i++) {
                let newHand = [...currentHand];
                let replaced = false;
                for (let j = 0; j < newHand.length; j++) {
                    if (newHand[j] === 'J' && !replaced) {
                        newHand[j] = allCards[i];
                        replaced = true;
                    }
                }
                replaceJoker(newHand, jokersLeft - 1);
            }
        }
    }

    // Start the recursive replacement process
    replaceJoker(hand, jokerCount);

    // Eliminate duplicate hands
    return possibleHands.map(hand => hand.sort()).filter((hand, index, self) =>
        index === self.findIndex((t) => (t.join('') === hand.join('')))
    );
}


function isStrongerHandType(type1: HandRanking, type2: HandRanking): boolean {
    const handStrengthOrder: HandRanking[] = ['HighCard', 'OnePair', 'TwoPair', 'ThreeOfAKind', 'FullHouse', 'FourOfAKind', 'FiveOfAKind'];

    const type1Strength = handStrengthOrder.indexOf(type1);
    const type2Strength = handStrengthOrder.indexOf(type2);

    return type1Strength > type2Strength;
}



function sortHands(hands: HandBid[]): HandBid[] {
    // Updated function to get the numeric value of a card for sorting
    const cardValue = (card: Card): number => {
        const order = 'J23456789TQKA'; // 'J' is now the weakest
        return order.indexOf(card);
    };

    // Function to compare two hands
    const compareHands = (hand1: HandBid, hand2: HandBid): number => {
        // First, compare based on hand type
        const typeOrder = ['HighCard', 'OnePair', 'TwoPair', 'ThreeOfAKind', 'FullHouse', 'FourOfAKind', 'FiveOfAKind'];
        const typeDifference = typeOrder.indexOf(hand2.type) - typeOrder.indexOf(hand1.type);

        if (typeDifference !== 0) {
            return typeDifference;
        }

        // If types are the same, compare based on individual card strength
        for (let i = 0; i < hand1.hand.length; i++) {
            const cardDifference = cardValue(hand2.hand[i]) - cardValue(hand1.hand[i]);
            if (cardDifference !== 0) {
                return cardDifference;
            }
        }

        return 0;
    };

    // Sort the hands
    return hands.sort(compareHands).reverse();
}


function parseInput(input: string[]): HandBid[] {
    return input.map(entry => {
        const [handStr, bidStr] = entry.split(' ');
        const hand: Hand = handStr.split('') as Hand;
        const bid: Bid = parseInt(bidStr, 10);
        const type: HandRanking = classifyHand(hand);

        return { hand, bid, type };
    });
}

