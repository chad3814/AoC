import { NotImplemented, run, logger } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

const RE = /\s+/ug;

function rotateGrid(grid: string[][]): string[][] {
    const width = grid[0].length;
    const height = grid.length;
    const out: string[][] = [];
    for (let y = 0; y < width; y++) {
        const row: string[] = [];
        for (let x = 0; x < height; x++) {
            row.push(grid[x][width - y - 1]);
        }
        out.push(row);
    }
    return out;
}

function dumpGrid(grid: string[][]) {
    const widths: number[] = [];
    for (let x = 0; x < grid[0].length; x++) {
        let max = 0;
        for (let y = 0; y < grid.length; y++) {
            if (grid[y][x].length > max) max = grid[y][x].length;
        }
        widths.push(max);
    }
    for (let row = 0; row < grid.length; row++) {
        logger.log(grid[row].map((s, i) => s.padStart(widths[i], ' ')).join(' '));
    }
}

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
