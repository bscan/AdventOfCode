import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const filePath = join(dirname(fileURLToPath(import.meta.url)), 'input8.txt');
const content = readFileSync(filePath, 'utf8').split("\n");

const directions = content.shift()!.split('') as Direction[];
content.shift(); // Skip empty line

interface Node { L: string; R: string; nodename?: string }
type Direction = 'L' | 'R';
const nodes: Record<string, Node> = {}
const start_nodes: string[] = []

for(let line of content){
    let match = line.match(/^(?<nodename>\w+)\s+=\s+\((?<L>\w+),\s+(?<R>\w+)\)$/)!.groups as {nodename: string; L: string; R: string}

    nodes[match.nodename] = {'L': match.L , 'R': match.R}
    if( match.nodename.match(/\w\wA/))
        start_nodes.push(match.nodename)
}

function find_num_steps(start_loc: string) :number {
    let steps = 0;
    let loc = start_loc;
    let max_iter = 1000;
    while(max_iter--){
        for(let direction of directions){
            loc = nodes[loc][direction];
            steps++;
            if(loc.match(/\w\wZ/))
                return steps;
        }
    }
    throw new Error(`Could not figure it for ${start_loc}` );
}

// From https://stackoverflow.com/a/49722579/3884938 
const gcd = (a: number, b: number): number => a ? gcd(b % a, a) : b;
const lcm = (a: number, b: number): number => a * b / gcd(a, b);

let part2 = start_nodes.map(find_num_steps).reduce(lcm);

console.log(`Part 2: ${part2}`);
