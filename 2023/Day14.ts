// Code generated with the assistance of GPT-4

import { readFileSync } from 'fs'

type Grid = string[][];

const puzzleInput: Grid = readFileSync('input14.txt', 'utf8').split("\n").map(x => x.split(''));

// Find the repeating pattern
const [cyclesToFindPattern, firstOccurrence, patternGrid] = findRepeatingPattern(puzzleInput);

// Compute the cycle number within the repeating pattern for the 1 billionth cycle
const totalCycles = 1_000_000_000;
const patternLength = cyclesToFindPattern - firstOccurrence;
const remainingCycles = (totalCycles - firstOccurrence) % patternLength;

// Simulate the remaining cycles from the first occurrence of the repeating pattern
let finalGridAfterBillionCycles = patternGrid;
for (let i = 0; i < remainingCycles; i++) {
    finalGridAfterBillionCycles = performSpinCycle(finalGridAfterBillionCycles);
}

// Calculate the total load on the north support beams
const totalLoadAfterBillionCycles = calculateTotalLoad(finalGridAfterBillionCycles);
console.log("Total Load after 1 Billion Cycles:", totalLoadAfterBillionCycles);


function tiltGrid(grid: Grid, direction: string): Grid {
    const height = grid.length;
    const width = grid[0].length;
    let newGrid: Grid = Array.from({ length: height }, () => Array(width).fill('.'));

    if (direction === "north") {
        for (let col = 0; col < width; col++) {
            let nextPosition = 0;
            for (let row = 0; row < height; row++) {
                if (grid[row][col] === 'O') {
                    newGrid[nextPosition][col] = 'O';
                    nextPosition++;
                } else if (grid[row][col] === '#') {
                    newGrid[row][col] = '#';
                    nextPosition = row + 1;
                }
            }
        }
    } else if (direction === "west") {
        for (let row = 0; row < height; row++) {
            let nextPosition = 0;
            for (let col = 0; col < width; col++) {
                if (grid[row][col] === 'O') {
                    newGrid[row][nextPosition] = 'O';
                    nextPosition++;
                } else if (grid[row][col] === '#') {
                    newGrid[row][col] = '#';
                    nextPosition = col + 1;
                }
            }
        }
    } else if (direction === "south") {
        for (let col = 0; col < width; col++) {
            let nextPosition = height - 1;
            for (let row = height - 1; row >= 0; row--) {
                if (grid[row][col] === 'O') {
                    newGrid[nextPosition][col] = 'O';
                    nextPosition--;
                } else if (grid[row][col] === '#') {
                    newGrid[row][col] = '#';
                    nextPosition = row - 1;
                }
            }
        }
    } else if (direction === "east") {
        for (let row = 0; row < height; row++) {
            let nextPosition = width - 1;
            for (let col = width - 1; col >= 0; col--) {
                if (grid[row][col] === 'O') {
                    newGrid[row][nextPosition] = 'O';
                    nextPosition--;
                } else if (grid[row][col] === '#') {
                    newGrid[row][col] = '#';
                    nextPosition = col - 1;
                }
            }
        }
    }

    return newGrid;
}


function performSpinCycle(grid: Grid): Grid {
    const directions = ["north", "west", "south", "east"];
    let currentGrid = grid;

    for (let direction of directions) {
        currentGrid = tiltGrid(currentGrid, direction);
    }

    return currentGrid;
}

function findRepeatingPattern(initialGrid: Grid, maxCycles = 10000): [number, number, Grid] {
    let seenGrids: Map<string, number> = new Map();
    let currentGrid = initialGrid;
    let cycleCount = 0;

    while (cycleCount < maxCycles) {
        currentGrid = performSpinCycle(currentGrid);
        cycleCount++;

        const gridStr = JSON.stringify(currentGrid);
        if (seenGrids.has(gridStr)) {
            return [cycleCount, seenGrids.get(gridStr)!, currentGrid];
        } else {
            seenGrids.set(gridStr, cycleCount);
        }
    }

    return [cycleCount, -1, currentGrid]; // No repeating pattern found within maxCycles
}

function calculateTotalLoad(grid: Grid): number {
    const height = grid.length;
    let totalLoad = 0;

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col] === 'O') {
                totalLoad += height - row;
            }
        }
    }

    return totalLoad;
}
