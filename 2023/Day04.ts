import fs from 'fs'
import path from 'path'

const filePath = path.join(__dirname, 'input4.txt')
const content = fs.readFileSync(filePath, 'utf8')

let sum1 = 0
let copies: number[] = []

for(let row of content.split("\n")) {

    const matches = row.match(/Card\s+(\d+): ([\d\s]+)\|([\d\s]+)/)
    if(!matches)
      throw new Error(`Could not parse: ${row}`)
    const card_num = parseInt(matches[1])

    copies[card_num] = (copies[card_num] || 0) + 1

    let winning = matches[2].match(/\d+/g) as string[]
    let numbers = matches[3].match(/\d+/g) as string[]
    let match_count = numbers.filter(value => winning.includes(value)).length
    
    for (let i = 1; i <= match_count; i++) {
        copies[card_num+i] = (copies[card_num+i] || 0) + copies[card_num]
    }
    if(match_count)
        sum1 += 2**(match_count-1)
}

let sum2 = copies.reduce((a, b) => a + b)


console.log(`Part 1: ${sum1}`)
console.log(`Part 2: ${sum2}`) 
