import { NotImplemented, Options, run } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

function fillContainer(containers: number[], amount: number): number {
    if (containers.length < 1 || amount < 1) return 0;
    let count = 1;
    for (let i = 0; i < containers.length - 1; i++) {
        if (containers[i] <= amount) {
            count += fillContainer(containers.slice(i + 1), amount - containers[i]);
        }
    }
    return count;
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const containers: number[] = input.filter(i => i.trim() !== '').map(Number);
    let total = 0;
    const liters = test ? 25 : 150;
    if (part === 1) {
        return fillContainer(containers, liters);
    }
    throw new NotImplemented('Not Implemented');
}

const options: Options = {};
const args: string[] = process.argv.splice(2);
for (const arg of args) {
    if (arg === '-t') options.testsOnly = true;
    if (arg === '-s') options.skipTests = true;
    if (arg === '1') options.onlyPart = 1;
    if (arg === '2') options.onlyPart = 2;
}

run(__filename, solve, options);
