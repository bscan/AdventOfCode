import { readFileSync } from 'fs'

let content = readFileSync('input11.txt', 'utf8').split("\n");

// Load up the galaxies
let galaxies: number[][] = [];
for (let y = 0; y < content.length; y++) {
    for (let x = 0; x < content[y].length; x++) {
        if (content[y][x] === '#') {
            galaxies.push([y, x]);
        }
    }
}

// Compute cumulative distances across the universe
const colsWithGalaxies: boolean[] = [];
for (let col = 0; col < content[0].length; col++) {
    colsWithGalaxies[col] = content.some(row => row[col] === '#');
}

let sum = 0
const cumulativeRows = content.map(row => row.includes('#')).map((sum = 0, n => sum += n ? 0 : 999999))
const cumulativeCols = colsWithGalaxies.map((sum = 0, n => sum += n ? 0 : 999999))

// Update with new positions
galaxies = galaxies.map(galaxy => [ galaxy[0] + cumulativeRows[galaxy[0]], galaxy[1] + cumulativeCols[galaxy[1]]]);

let totalManhattanDistance: number = 0;
for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
        totalManhattanDistance += manhattanDistance(galaxies[i], galaxies[j]);
    }
}

console.log("Part 2:", totalManhattanDistance);

function manhattanDistance(p1: number[], p2: number[]): number {
    return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
}

