// Note this is only for Part 1
import { readFileSync } from 'fs'

const modules: Record<string, Module> = {}

type Pulse = { src: string, dest: string, pulseType: 'high' | 'low' }

abstract class Module {
    name: string;
    destinations: string[];

    constructor(name: string) {
        this.name = name;
        this.destinations = [];
    }

    addDestination(moduleName: string): void {
        this.destinations.push(moduleName);
    }

    abstract receivePulse(pulse: Pulse): Pulse[];
}

class FlipFlop extends Module {
    state: boolean;

    constructor(name: string) {
        super(name);
        this.state = false;
    }

    receivePulse(pulse: Pulse): Pulse[] {
        if (pulse.pulseType === 'low') {
            this.state = !this.state;
            const pulseToSend = this.state ? 'high' : 'low';
            return this.destinations.map(dest =>{ return { src: this.name, dest: dest, pulseType: pulseToSend } });
        }
        return [];
    }
}

class Conjunction extends Module {
    inputs: Record<string, string>;

    constructor(name: string) {
        super(name);
        this.inputs = {};
    }

    receivePulse(pulse: Pulse): Pulse[] {
        this.inputs[pulse.src] = pulse.pulseType;
        
        if (Object.values(this.inputs).every(pulse => pulse === 'high')) {
            return this.destinations.map(dest => { return { src: this.name, dest: dest, pulseType: 'low' } });
        }
        return this.destinations.map(dest => { return { src: this.name, dest: dest, pulseType: 'high' } });
    }

    addInput(inputModule: string): void {
        this.inputs[inputModule] = 'low';
    }
}


class Broadcaster extends Module {
    receivePulse(pulse: Pulse): Pulse[] {
        return this.destinations.map(dest =>  { return { src: this.name, dest: dest, pulseType: pulse.pulseType } });
    }
}

function splitString(input: string): [string, string] {

    if(input == 'broadcaster'){
        return ['broadcaster', 'broadcaster']
    }
    const firstChar = input.charAt(0);
    const restOfString = input.slice(1);
    
    return [firstChar, restOfString];
}


function parseConfiguration(configString: string) {
    const configLines = configString.split("\n")
    configLines.forEach(line => {
        const [moduleDesc, destinations] = line.split(' -> ');
        let module: Module;
        let [moduleType, moduleName] = splitString(moduleDesc);

        if (moduleType == '%') {
            module = new FlipFlop(moduleName);
        } else if (moduleType == '&') {
            module = new Conjunction(moduleName);
        } else if (moduleType === 'broadcaster') {
            module = new Broadcaster(moduleName);
        } else {
            throw new Error("Unknown module type")
        }

        modules[moduleName] = module;

        if (destinations) {
            destinations.split(', ').forEach(destName => {
                module.addDestination(destName);
            });
        }
    });

    configLines.forEach(line => {
        const [moduleDesc, destinations] = line.split(' -> ');
        let module: Module;
        let [moduleType, moduleName] = splitString(moduleDesc);
        module = modules[moduleName];

        if (destinations) {
            destinations.split(', ').forEach(destName => {
                const destModule = modules[destName]
                if (destModule instanceof Conjunction) {
                    destModule.addInput(moduleName);
                }
            });
        }
    })
}

function simulateButtonPresses(modules: Record<string, Module>, numPresses: number): [number, number] {
    let [lowPulses, highPulses] = [0, 0];

    for (let i = 0; i < numPresses; i++) {
        const queue: Pulse[] = [{src: 'button', dest: 'broadcaster', pulseType: 'low'}];

        while (queue.length) {
            const pulse = queue.shift()!;
            pulse.pulseType === 'high' ? highPulses++ : lowPulses++;

            const newPulses = modules[pulse.dest]?.receivePulse(pulse);
            if (newPulses) queue.push(...newPulses);
        }
    }

    return [highPulses, lowPulses];
}


parseConfiguration(readFileSync('input20.txt', 'utf8'));

const [highPulses, lowPulses] = simulateButtonPresses(modules, 1000);
console.log(`High Pulses: ${highPulses}, Low Pulses: ${lowPulses}, Part 1: ${highPulses * lowPulses}`);
