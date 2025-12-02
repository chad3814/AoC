import { logger, NotImplemented, run } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

function dump(head: number[], tail: number[]) {
    const size = 6;
    const grid: string[][] = [];
    for (let y = size; y >= -size; y--)
        grid.push(new Array(size).fill("."));
    grid[0][0] = 's';
    grid[tail[1]][tail[0]] = 'T';
    grid[head[1]][head[0]] = 'H';
    for (const row of grid.reverse()) {
        logger.log(row.join(""));
    }
    logger.log("");
}

function moveTail(head: number[], tail: number[]) {
    const dx = Math.abs(head[0] - tail[0]);
    const dy = Math.abs(head[1] - tail[1]);
    if (dx <= 1 && dy <= 1) {
        return tail;
    }
    if (head[0] === tail[0]) {
        return [tail[0], tail[1] + (head[1] > tail[1] ? 1 : -1)];
    }
    if (head[1] === tail[1]) {
        return [tail[0] + (head[0] > tail[0] ? 1 : -1), tail[1]];
    }
    return [
        tail[0] + (head[0] > tail[0] ? 1 : -1),
        tail[1] + (head[1] > tail[1] ? 1 : -1),
    ];
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const tailPositions = new Set<string>();
    const head = [0, 0];
    let tail = [0, 0];
    tailPositions.add(tail.join(","));
    // if (test) dump(head, tail);

    if (part === 1) {
        for (const line of input) {
            const [dir, distStr] = line.split(" ");
            const dist = parseInt(distStr, 10);
            for (let i = 0; i < dist; i++) {
                switch (dir) {
                    case 'U':
                        head[1] += 1;
                        break;
                    case 'D':
                        head[1] -= 1;
                        break;
                    case 'L':
                        head[0] -= 1;
                        break;
                    case 'R':
                        head[0] += 1;
                        break;
                }
                tail = moveTail(head, tail);
                tailPositions.add(tail.join(","));
                if (test) dump(head, tail);
            }
        }
        if (test) logger.log([...tailPositions.values()]);
        return tailPositions.size;
    }
    const knots: number[][] = [];
    for (let i = 0; i < 10; i++) {
        knots.push([0, 0]);
    }
    tailPositions.clear();
    tailPositions.add(knots[9].join(","));
    for (const line of input) {
        const [dir, distStr] = line.split(" ");
        const dist = parseInt(distStr, 10);
        for (let i = 0; i < dist; i++) {
            switch (dir) {
                case 'U':
                    knots[0][1] += 1;
                    break;
                case 'D':
                    knots[0][1] -= 1;
                    break;
                case 'L':
                    knots[0][0] -= 1;
                    break;
                case 'R':
                    knots[0][0] += 1;
                    break;
            }
            for (let k = 1; k < knots.length; k++) {
                knots[k] = moveTail(knots[k - 1], knots[k]);
            }
            tailPositions.add(knots[9].join(","));
        }
    }
    return tailPositions.size;
}

run(__filename, solve);
