import { NotImplemented, run, logger } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

function maxJoltage(bank: number[], digits = 2, carryIn = 0): number {
    if (digits < 1) {
        throw new Error('invalid number of digits');
    }
    let max = bank[0];
    let pos = 0;
    for (let i = 1; i <= bank.length - digits; i++) {
        if (bank[i] > max) {
            max = bank[i];
            pos = i;
        }
    }
    if (digits === 1)
        return carryIn * 10 + max;
    return maxJoltage(bank.slice(pos + 1), digits - 1, carryIn * 10 + max);
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const banks: number[][] = [];
    for (const line of input) {
        if (line.trim().length === 0) continue;
        banks.push(line.split('').map(Number));
    }
    let total = 0;
    const digits = part === 1 ? 2 : 12;
    for (const bank of banks) {
        total += maxJoltage(bank, digits);
    }
    return total;
}

run(__filename, solve);
