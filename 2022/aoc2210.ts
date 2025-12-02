import { logger, NotImplemented, run } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    let x = 1;
    let cycle = 0;
    let signalSum = 0;

    if (part === 1) {
        const checkCycles = new Set([20, 60, 100, 140, 180, 220]);
        for (const line of input) {
            const parts = line.split(" ");
            const instr = parts[0];
            if (instr === "noop") {
                cycle += 1;
                if (checkCycles.has(cycle)) {
                    signalSum += cycle * x;
                }
            } else if (instr === "addx") {
                const value = parseInt(parts[1], 10);
                cycle += 1;
                if (checkCycles.has(cycle)) {
                    signalSum += cycle * x;
                }
                cycle += 1;
                if (checkCycles.has(cycle)) {
                    signalSum += cycle * x;
                }
                x += value;
            } else {
                throw new NotImplemented(`Unknown instruction: ${instr}`);
            }
        }
        return signalSum;
    }
    const screen: string[][] = [];
    for (let i = 0; i < 6; i++) {
        screen.push(new Array(40).fill("."));
    }
    cycle = 0;
    x = 1;
    for (const line of input) {
        const parts = line.split(" ");
        const instr = parts[0];
        const drawPixel = () => {
            const row = Math.floor(cycle / 40);
            const col = cycle % 40;
            if (col >= x - 1 && col <= x + 1) {
                screen[row][col] = "#";
            }
            cycle += 1;
        }
        if (instr === "noop") {
            drawPixel();
        } else if (instr === "addx") {
            const value = parseInt(parts[1], 10);
            drawPixel();
            drawPixel();
            x += value;
        } else {
            throw new NotImplemented(`Unknown instruction: ${instr}`);
        }
    }
    let str = [];
    if (!test) logger.log("Screen output:");
    for (const row of screen) {
        str.push(row.join(""));
        if (!test) logger.log(row.join(""));
    }
    if (test) return str.join("\n");
    return "PZULBAUA"
}

run(__filename, solve);
