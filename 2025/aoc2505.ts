import { NotImplemented, run, logger } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

function inRange(ranges: [number, number][], x: number): boolean {
    for (const [first, last] of ranges) {
        if (last >= x && first <= x) {
            return true;
        }
    }
    return false;
}

function condenseRanges(ranges: [number, number][]): [number, number][] {
    const r = ranges.slice().sort(
        (a, b) => a[0] - b[0]
    );
    const ret: [number, number][] = [];
    let prev = r[0];
    for (let i = 1; i < r.length; i++) {
        if (r[i][0] <= prev[1]) {
            if (r[i][1] <= prev[1]) continue;
            prev[1] = r[i][1];
            continue;
        }
        ret.push(prev);
        prev = r[i];
    }
    ret.push(prev);
    return ret;
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    let total = 0;
    const ranges: [number, number][] = [];
    const lookups: number[] = [];
    let inRanges = true;
    for (const line of input) {
        if (line === '') {
            inRanges = false;
            continue;
        }
        if (inRanges) {
            const [first, last] = line.split('-').map(Number);
            ranges.push([first, last]);
            continue;
        }
        lookups.push(parseInt(line, 10));
    }
    if (part === 1) {
        for (const lookup of lookups) {
            if (inRange(ranges, lookup)) total++;
        }
        return total;
    }
    const condensed = condenseRanges(ranges);
    for (const range of condensed) {
        total += range[1] - range[0] + 1;
    }
    return total;
}

run(__filename, solve);
