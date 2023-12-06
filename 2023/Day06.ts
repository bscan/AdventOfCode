import lodash from 'lodash';
const { range } = lodash;

let content = `Time:        61     67     75     71
Distance:   430   1036   1307   1150`

// Parse
const [time, distance] = content.split("\n").map(line => parseInt(line.match(/\d+/g)!.join('')))

// Brute force 
const brute = range(time).map(x => x*(time-x)).filter(x=> x > distance).length
console.log(`Brute Force: ${brute}`)

// Quadratic formula with a=-1, b=time and c = -distance
let d = Math.sqrt(time**2 - 4*distance) / 2;
const analytic =  Math.floor(time/2 + d) - Math.ceil(time/2 - d) + 1;
console.log(`Mathing it out: ${analytic}`)
