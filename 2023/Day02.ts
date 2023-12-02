import fs from 'fs';
import path from 'path';

const filePath = path.join(__dirname, 'input2.txt');
const content = fs.readFileSync(filePath, 'utf8');

let game_count = 0;
let power = 0
for (let game of content.split("\n")) {
    const parts = game.split(':');
    const game_id = parseInt(parts[0].match(/Game (\d+)/)![1]);
    const pulls = parts[1].split(';')

    let bag = {red: 0, blue: 0, green: 0};
    for (let pull of pulls){
        const matches = pull.matchAll(/\b(\d+) (red|green|blue)/g);
        for(let match of matches){
            const color = match[2] as 'red' | 'green' | 'blue';
            const val = parseInt(match[1]);
            if(bag[color] < val)
                bag[color] =  val
        }
    }

    if(bag.red <= 12 && bag.green <= 13 && bag.blue <= 14 )
        game_count += game_id
    
    power += bag.red * bag.green * bag.blue
}

console.log(`Part 1: ${game_count}`);
console.log(`Part 2: ${power}`);
