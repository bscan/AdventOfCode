// Code generated with the assistance of GPT-4
import { readFileSync } from 'fs'

const content = readFileSync('input15.txt', 'utf8')
const steps: string[] = content.split(',');
const hashResults: number[] = steps.map(hashString);
const part1: number = hashResults.reduce((a, b) => a + b);
console.log(`Part 1: ${part1}`);

type lens = {
    label: string,
    focalLength: number
}

type box = lens[]
let boxes: Map<number, box> = new Map()
for(let i=0; i<=255; i++){
    boxes.set(i, [])
}

content.split(',').forEach(step => {
    if (step.includes('=')) {
        const [label, operation] = step.split('=');
        const boxNumber = hashString(label);
        const focalLength = parseInt(operation);
        const newLens = {label, focalLength};
        let current = boxes.get(boxNumber)!
        const lensIndex = current.findIndex(lens => lens.label == label)
        
        if (lensIndex !== -1) {
            current[lensIndex] = newLens;
        } else {
            current.push(newLens);
        }
        
    } else {
        const label = step.slice(0, -1);
        const boxNumber = hashString(label);
        boxes.set(boxNumber, boxes.get(boxNumber)!.filter(lens => lens.label != label));
    }
});

let totalPower = 0;
boxes.forEach((lenses, boxNumber) => {
    lenses.forEach((lens, slotNumber) => {
        totalPower += (boxNumber + 1) * (slotNumber + 1) * lens.focalLength;
    });
});

console.log(`Part 2: ${totalPower}`);

function hashString(s: string): number {
    return s.split('').reduce((val, char) => (val + char.charCodeAt(0)) * 17 % 256, 0);
}
