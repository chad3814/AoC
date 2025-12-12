import { NotImplemented, run, logger } from "aoc-copilot";
import { comboG, combos } from "../utils/combinations";

type AdditionalInfo = {
    [key: string]: string;
};

const RE = /\[(?<lights>[\.#]+)\] (?<buttons>(\(\d+(,\d+)*\) )+) ?\{(?<joltages>\d+(,\d+)*)\}/u;

class Machine {
    constructor(public readonly desired: number, public readonly buttons: number[], private joltages: number[]) {
        this.state = 0;
    }

    public get lights() {
        return this.state;
    }

    public toggle(lights: number) {
        this.state = this.state ^ lights;
    }

    public check(): boolean {
        return this.state === this.desired;
    }

    public reset() {
        this.state = 0;
    }

    public toString(): string {
        return `[${this.desired.toString(2).replaceAll('0', '.').replaceAll('1', '#')}] ${
            this.buttons.map(
                v => '(' + v.toString(2).replaceAll('0', '-').replaceAll('1', '!') + ')'
            ).join(' ')
        } {${this.joltages.join(', ')}}`;
    }

    private state = 0;
}

// Helper: count number of 1-bits in a number
function popcount(n: number): number {
    let count = 0;
    while (n) {
        count += n & 1;
        n >>= 1;
    }
    return count;
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const machines: Machine[] = [];
    for (const line of input) {
        if (line.trim() === '') continue;
        const matches = line.match(RE);
        if (!matches?.groups?.lights || !matches.groups.buttons || !matches.groups.joltages) {
            console.error('line did not match', line);
            throw new Error('line did not match');
        }
        const lights = matches.groups.lights.split('').map(l => l === '#');
        const desired = lights.map(
            (v, i) => v ? (1 << i) : 0
        ).reduce(
            (v, i) => v + i
        );

        const buttons: number[] = [];
        for (const buttonStr of matches.groups.buttons.split(' ')) {
            const indexes = buttonStr.replace('(', '').replace(')', '').split(',').map(Number);
            buttons.push(indexes.map(
                i => 1 << i
            ).reduce(
                (v, i) => v + i
            ));
        }
        const joltages = matches.groups.joltages.split(',').map(Number);
        machines.push(new Machine(desired, buttons, joltages));
    }
    let total = 0;
    if (part === 1) {
        for (const machine of machines) {
            let found = false;

            // Try progressively larger button combinations
            for (let targetSize = 1; targetSize <= machine.buttons.length && !found; targetSize++) {
                // Try all bit patterns with exactly targetSize bits set
                for (let mask = 0; mask < (1 << machine.buttons.length); mask++) {
                    if (popcount(mask) !== targetSize) continue; // Skip wrong size

                    // Press buttons indicated by the mask
                    machine.reset();
                    for (let i = 0; i < machine.buttons.length; i++) {
                        if (mask & (1 << i)) {
                            machine.toggle(machine.buttons[i]);
                        }
                    }

                    if (machine.check()) {
                        logger.log(machine.toString(), '=>', targetSize);
                        total += targetSize;
                        found = true;
                        break; // Found minimum for this machine
                    }
                }
            }
        }
        return total;
    }
    throw new NotImplemented('Not Implemented');
}

run(__filename, solve);
