import { readFileSync } from 'fs'

let content = readFileSync('input9.txt', 'utf8').split("\n");

let [sum1, sum2] = [0,0]

for(let line of content){
    let diff = line.match(/(-?\d+)/g)!.map(x => parseInt(x)) as number[]

    let lasts: number[] = []
    let firsts: number[] = []

    while(diff.length){
        lasts.push(diff.at(-1)!)
        firsts.push(diff.at(0)!)
        diff = diff.slice(1).map((value, index) => value - diff[index]);
    }

    sum1 += lasts.reduce((a,b) => a+b)
    sum2 += firsts.reverse().reduce((a,b) => b-a)
}

console.log(`Part 1: ${sum1}`)
console.log(`Part 2: ${sum2}`)
