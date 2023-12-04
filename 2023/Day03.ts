import fs from 'fs';
import path from 'path';

const filePath = path.join(__dirname, 'input3.txt');
const content = fs.readFileSync(filePath, 'utf8');

let sum1 = 0
let sum2 = 0

let start: string[][] = []
let valid: string[][] = []

let max_r = 0
let max_c = 0

content.split("\n").forEach((row, r) => {
    start[r] = []
    valid[r] = []
    max_r = Math.max(max_r, r);
    row.split('').forEach((letter, c) => {
        start[r][c] = letter
        valid[r][c] = '.'
        max_c = Math.max(max_c, c)
    });
})


let directions = [
    [1, 1],
    [1, 0],
    [1, -1],
    [0, 1],
    [0, -1],
    [-1, 1],
    [-1, 0],
    [-1, -1]
]

start.forEach((row, r) => {
    row.forEach((letter, c) => {
        if (!letter.match(/[\d\.]/)) {
            // I'm a symbol, mark my neighbors as valid;
            let numbers: string[] = []
            for (let direction of directions) {
                let rp = r + direction[0];
                let cp = c + direction[1];
                if (rp > max_r || rp < 0 || cp > max_c || cp < 0)
                    continue;

                if (start[rp][cp].match(/\d/)) {
                    let number: string = start[rp][cp];
                    valid[rp][cp] = start[rp][cp];

                    let cpp = cp;
                    while (--cpp >= 0)
                        if (start[rp][cpp].match(/\d/)) {
                            valid[rp][cpp] = start[rp][cpp];
                            number = start[rp][cpp] + number
                        } else break

                    cpp = cp;
                    while (++cpp <= max_c)
                        if (start[rp][cpp].match(/\d/)) {
                            number = number + start[rp][cpp]
                            valid[rp][cpp] = start[rp][cpp];
                        } else break
                    numbers.push(number)
                }
            }
            numbers = [...new Set(numbers)];
            if (numbers.length == 2 && letter == '*') {
                sum2 += parseInt(numbers[0]) * parseInt(numbers[1])
            }
        }
    })
})

for (let row of valid) {
    let numbers = row.join('').split(/\.+/g).map(x => parseInt(x))
    for (let num of numbers) { if (num) sum1 += num }
}

console.log(`Part 1: ${sum1}   `)
console.log(`Part 2: ${sum2}   `)
