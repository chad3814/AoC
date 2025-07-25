import { NotImplemented, run } from "aoc-copilot";
import { Direction, Turn } from "../utils/direction";
import { dijkstra, parseWeightedMaze } from "../utils/maze";
import { Point } from "../utils/point";

type AdditionalInfo = {
    [key: string]: string;
};

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const maze = parseWeightedMaze(input);
    const start = maze.find(
        node => node.value.value === 'S' && node.value.facing === Direction.EAST
    )?.value;
    if (!start) {
        throw new Error('no find start');
    }
    const end = maze.find(
        ({value: node}) => node.value === 'E' && node.facing === Direction.NORTH
    )?.value;
    if (!end) {
        throw new Error('no find end');
    }
    const {distances, previous} = dijkstra(maze, start, end);

    if (part === 1) {
        return distances.get(end);
    }

    const points = new Set<Point>();
    const queue = [end];
    while (queue.length > 0) {
        const node = queue.shift()!;
        points.add(node.point);
        if (node === start) break;
        const prevs = previous.get(node);
        if (!prevs) {
            throw new Error('missing previous array');
        }
        queue.push(...prevs);
    }

    return points.size;
}

type AocCopilotOptions = {
    testsOnly?: boolean;
    skipTests?: boolean;
    onlyPart?: 1|2;
};
const options: AocCopilotOptions = {}

const args: string[] = process.argv.splice(2);
for (const arg of args) {
    if (arg === '-t') options.testsOnly = true;
    if (arg === '-s') options.skipTests = true;
    if (arg === '1') options.onlyPart = 1;
    if (arg === '2') options.onlyPart = 2;
}

run(__filename, solve, options);
