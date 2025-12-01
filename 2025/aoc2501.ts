import { run } from "aoc-copilot";
import { dir } from "console";
import "dot-env";

type AdditionalInfo = {
    [key: string]: string;
};

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    let total = 0;
    let pointer = 50;
    if (part === 1) {
        for (const line of input) {
            if (!line.trim()) continue;
            const direction = line[0] === 'L' ? -1 : 1;
            const value = parseInt(line.slice(1), 10);
            pointer += direction * value;
            pointer = (pointer + 100) % 100;
            if (pointer === 0) {
                total += 1;
            }
        }
    } else {
        for (const line of input) {
            if (!line.trim()) continue;
            const direction = line[0] === 'L' ? -1 : 1;
            const value = parseInt(line.slice(1), 10);
            for (let i = 0; i < value; i++) {
                pointer += direction;
                pointer = (pointer + 100) % 100;
                if (pointer === 0) {
                    total += 1;
                }
            }
        }
    }
    return total
}

run(__filename, solve);
