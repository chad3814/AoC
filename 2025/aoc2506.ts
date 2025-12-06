import { NotImplemented, run, logger } from "aoc-copilot";
import { dumpGrid, rotateGrid } from "../utils/grid";

type AdditionalInfo = {
    [key: string]: string;
};

const RE = /\s+/ug;
type Op = '*' | '+';

function calc(op: Op, nums: number[]): number {
    if (op === '+') {
        return nums.reduce(
            (t, v) => t + v
        );
    } else if (op === '*') {
        return nums.reduce(
            (t, v) => t * v
        );
    }
    throw new Error('bad op');
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const columns: string[][] = [];
    const grid: string[][] = [];
    for (const line of input) {
        if (line.trim() === '') continue;
        columns.push(line.split(''));
        grid.push(line.split(RE).map(s => s.trim()).filter(s => s !== ''));
    }
    if (test) dumpGrid(columns);
    const rColumns = rotateGrid(columns);
    if (test) dumpGrid(rColumns);
    let total = 0;

    if (part === 1) {
        const rGrid = rotateGrid(grid);
        for (const line of rGrid) {
            const op = line.pop() as Op;
            const nums = line.map(Number);
            total += calc(op, nums);
        }
    } else {
        let nums: number[] = [];
        for (let row = 0; row < rColumns.length; row++) {
            const str = rColumns[row].filter(s => s !== ' ');
            if (test) logger.log(`row ${row}: ${str.join('')}`);
            if (str.at(-1) === '*' || str.at(-1) === '+') {
                row++; // skip the blank line
                const op = str.pop() as Op;
                nums.push(Number(str.join('')));
                if (test) logger.log(nums, op);
                total += calc(op, nums);
                nums.length = 0;
                continue;
            }
            nums.push(Number(str.join('')));
        }
    }
    return total;
}

run(__filename, solve);
