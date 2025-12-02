import { run, logger } from "aoc-copilot";
import { log } from "console";
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
    const inp = input.join("");
    const ranges = inp.split(",").map(range => {
        const [min, max] = range.split("-").map(Number);
        return [ min, max ];
    });
    for (const [min, max] of ranges) {
        logger.log(`Checking range ${min}-${max}`);
        for (let i = min; i <= max; i++) {
            const str = i.toString(10);
            const len = Math.floor(str.length / 2);
            for (let j = 1; j <= len; j++) {
                const sstr = str.slice(0, j);
                //logger.log(sstr, str.length / (2 * j));
                if (part === 2 || Math.floor(str.length / (2 * j)) === str.length / (2 * j)) {
                    const repeated = sstr.repeat(str.length / j);
                    if (repeated === str) {
                        total += i;
                        logger.log(`Found ${i} as ${sstr} repeated ${str.length / j} times`);
                        break;
                    }
                }
            }
        }
    }
    return total;
}

run(__filename, solve);
