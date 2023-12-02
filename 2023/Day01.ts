import fs from 'fs';
import path from 'path';

const filePath = path.join(__dirname, 'input1.txt');
let content = fs.readFileSync(filePath, 'utf8');

let map: Map<string, string> = new Map([
    ["one", '1'],
    ["two", '2'],
    ["three", '3'],
    ["four", '4'],
    ["five", '5'],
    ["six", '6'],
    ["seven", '7'],
    ["eight", '8'],
    ["nine", '9']]
);

let part = `(${[...map.keys()].join("|")}|\\d)`;
let merged = new RegExp(`^(?=.*?${part}).*${part}`, 'mg');

let count = 0;
for (let match of content.matchAll(merged)) {
    let m1 = map.get(match[1]) || match[1];
    let m2 = map.get(match[2]) || match[2];
    count += parseInt("".concat(m1, m2));
}

console.log(`Count is ${count}`);
