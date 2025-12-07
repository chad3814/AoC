import { NotImplemented, run, logger } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};


function countTimeSplits(grid: string[][], y: number, x: number, map = new Map<string, number>): number {
    if (grid.length <= y) {
        return 1;
    }
    const key = `${y},${x}`;
    if (map.has(key)) return map.get(key)!;
    if (grid[y][x] !== '^') {
        const count = countTimeSplits(grid, y + 1, x, map);
        map.set(key, count);
        return count;
    }
    const countLeft = countTimeSplits(grid, y + 1, x - 1, map);
    const countRight = countTimeSplits(grid, y + 1, x + 1, map);
    map.set(key, countLeft + countRight);
    return countLeft + countRight;
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const grid: string[][] = [];
    for (const line of input) {
        if (line.trim() === '') continue;
        grid.push(line.split(''));
    }
    let total = 0;
    if (part === 1) {
        const x: number[] = [grid[0].indexOf('S')];
        for (const row of grid) {
            const nextX = new Set<number>();
            for (const beamX of x) {
                if (row[beamX] === '^') {
                    nextX.add(beamX - 1);
                    nextX.add(beamX + 1);
                    total++;
                } else {
                    nextX.add(beamX);
                }
            }
            x.length = 0;
            x.push(...nextX);
        }
        return total;
    }
    return countTimeSplits(grid, 0, grid[0].indexOf('S'));
}

run(__filename, solve);
