import { NotImplemented, run, logger } from "aoc-copilot";
import { comboG, combos } from "../utils/combinations";

type AdditionalInfo = {
    [key: string]: string;
};

const RE = /\[(?<lights>[\.#]+)\] (?<buttons>(\(\d+(,\d+)*\) )+) ?\{(?<joltages>\d+(,\d+)*)\}/u;

class Machine {
    constructor(public readonly desired: number, public readonly buttons: number[], public readonly joltages: number[], public readonly numericButtons: number[][]) {
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
        const numericButtons: number[][] = [];
        for (const buttonStr of matches.groups.buttons.split(' ')) {
            if (!buttonStr || buttonStr.trim() === '') continue;
            const indexes = buttonStr.replace('(', '').replace(')', '').split(',').map(Number);
            numericButtons.push(indexes);
            buttons.push(indexes.map(
                i => 1 << i
            ).reduce(
                (v, i) => v + i
            ));
        }
        const joltages = matches.groups.joltages.split(',').map(Number);
        machines.push(new Machine(desired, buttons, joltages, numericButtons));
    }
    let total = 0;
    if (part === 1) {
        for (const machine of machines) {
            let found = false;

            // Try progressively larger button combinations
            for (let targetSize = 1; targetSize <= machine.buttons.length && !found; targetSize++) {
                let mask = (1 << targetSize) - 1;
                const limit = 1 << machine.buttons.length;
                while (mask < limit) {
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

                    // Gosper's hack: generate next mask with same popcount
                    const c = mask & -mask;
                    const r = mask + c;
                    mask = (((r ^ mask) >>> 2) / c) | r;
                }
            }
        }
        return total;
    }
    for (const machine of machines) {
        const target = machine.joltages;

        // BFS with priority queue (Dijkstra's algorithm)
        type State = { joltages: number[], presses: number };
        const queue: State[] = [{ joltages: new Array(target.length).fill(0), presses: 0 }];
        const visited = new Set<string>();

        const stateKey = (joltages: number[]) => joltages.join(',');
        visited.add(stateKey(queue[0].joltages));

        let found = false;

        while (queue.length > 0 && !found) {
            // Get state with minimum presses (priority queue - simple sort for now)
            queue.sort((a, b) => a.presses - b.presses);
            const state = queue.shift()!;

            // Check if we reached target
            if (state.joltages.every((v, i) => v === target[i])) {
                total += state.presses;
                found = true;
                if (test) logger.log(`Found solution: ${state.presses} presses`);
                break;
            }

            // Try pressing each button
            for (const button of machine.numericButtons) {
                const next = [...state.joltages];

                // Apply button press
                for (const pos of button) {
                    next[pos]++;
                }

                // Only continue if no position exceeds target
                if (next.every((v, i) => v <= target[i])) {
                    const key = stateKey(next);
                    if (!visited.has(key)) {
                        visited.add(key);
                        queue.push({ joltages: next, presses: state.presses + 1 });
                    }
                }
            }
        }

        if (!found) {
            logger.error(`No solution found for machine`);
        }
    }
    return total;
}

run(__filename, solve);
