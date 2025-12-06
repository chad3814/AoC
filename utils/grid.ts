import { logger } from "aoc-copilot";

export function dumpGrid<T>(grid: T[][]) {
    const widths: number[] = [];
    for (let x = 0; x < grid[0].length; x++) {
        let max = 0;
        for (let y = 0; y < grid.length; y++) {
            if (String(grid[y][x]).length > max) max = String(grid[y][x]).length;
        }
        widths.push(max);
    }
    logger.log(`${grid[0].length}, ${grid.length}`);
    for (let row = 0; row < grid.length; row++) {
        logger.log(grid[row].map((s, i) => String(s).padStart(widths[i], ' ')).join(' '));
    }
}

export function rotateGrid<T>(grid: T[][]): T[][] {
    const width = grid[0].length;
    const height = grid.length;
    const out: T[][] = [];
    for (let y = 0; y < width; y++) {
        const row: T[] = [];
        for (let x = 0; x < height; x++) {
            row.push(grid[x][width - y - 1]);
        }
        out.push(row);
    }
    return out;
}
