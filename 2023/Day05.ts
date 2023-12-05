import * as fs from 'fs';
import * as path from 'path';
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';

if (isMainThread) {
    main().catch(console.error);
} else {
    interface SeedFarmer {
        chunk: number[][];
        additionalData: Record<string, number[][]>; 
        sources: string[]; 
    } 
    const { chunk, additionalData, sources } = workerData as SeedFarmer;
    const result = chunk.map(item => processSeed(item, additionalData, sources));
    parentPort!.postMessage(result);
}

async function main(){
    let [x_to_y, sources, seeds] = parseInput()

    const numCores = require('os').cpus().length;
    console.log(`Will run on ${numCores} cores`)

    let tasks: number[][] = []
    for(let i = 0; i <= seeds!.length -1 ; i+=2){
        let starting_seed = seeds![i]
        let ending_seed = starting_seed + seeds![i+1]
        tasks.push([starting_seed, ending_seed])
    }

    const chunkSize = Math.ceil(tasks.length / numCores);
    const chunks = new Array(numCores).fill(null).map((_, index) => {
        return tasks.slice(index * chunkSize, (index + 1) * chunkSize);
    });

    try {
        const results = await Promise.all(chunks.map(chunk => createWorker(chunk, x_to_y, sources))) as number[][]
        const flat = results.flat(2)
        const min = [Math.min(...flat)]
        console.log(`Part 2: ${min}`);
    } catch (err) {
        console.error(`Received Error: ${err}`)
    }
}

async function createWorker(chunk: any, additionalData: Record<string, number[][]>, sources: string[]) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(__filename, {
            workerData: { chunk, additionalData, sources }
        });
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code: any) => {
            if (code !== 0)
                reject(new Error(`Worker stopped with exit code ${code}`));
        });
    });
}

function processSeed(dataChunk: number[], x_to_y: Record<string, number[][]>, sources: string[]): number {
    let min_location = Infinity
    let [starting_seed, ending_seed] = dataChunk
    for(let seed = starting_seed; seed < ending_seed; seed++){
        let current_val = seed;
        let new_val;
        for(let source of sources){
            for(let map of x_to_y[source]){
                // Check if mapping valid for this number
                if( map[1] + map[2] > current_val && map[1] <= current_val){
                    new_val = map[0] + ( current_val - map[1] ) 
                }
            }
            current_val = new_val || current_val
        }
        if(current_val < min_location )
            min_location = current_val
    }
    return min_location
}

function parseInput(): [Record<string, number[][]>, string[], number[]] {
    const filePath = path.join(__dirname, 'input5.txt')
    const content = fs.readFileSync(filePath, 'utf8')
    
    let seeds;
    let sources = []
    let x_to_y: Record<string, number[][]>  = {};
    
    for(let group of content.split("\n\n")) {
        let source;
        let dest;
        for(let row of group.split("\n")) {
            let match;
            if(match = row.match(/seeds: ([\d\s]+)$/)){
                seeds = match[1].match(/\d+/g)!.map(x => parseInt(x) || 0) as number[];
            } else if(match = row.match(/(\w+)-to-(\w+) map:$/)){
                source = match[1]
                sources.push(source);
                dest = match[2]
                x_to_y[source] = []
            } else if(source && row.match(/^[\d\s]+$/g)){
                let vals = row.match(/\d+/g)!.map(x => parseInt(x) || 0) as number[];
                x_to_y[source].push(vals)
            } else {
                throw new Error(`Could not parse row ${row}!`)
            }
        }
    }
    return [x_to_y, sources, seeds!]
}
