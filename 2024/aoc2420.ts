import { NotImplemented, run } from "aoc-copilot";
import { dijkstra, MazeNode, parseUnweightedMaze, validMazePoint } from "../utils/maze";
import { Point } from "../utils/point";
import { LinkedList, Node } from "../utils/list-class";
import { DefaultMap } from "../utils/default-map";
import { start } from "repl";
import { manhattanPoints } from "../utils/manhattan";

type AdditionalInfo = {
    [key: string]: string;
};

function wallCheat(
    maxWalls: number,
    input: string[],
    distances: DefaultMap<MazeNode, number>,
    max: number,
    wallPoint: Point,
    prevPoint: Point,
    pathStart: Node<MazeNode>,
    minCheatSize: number,
    path: Set<Point>,
    log = false,
): DefaultMap<MazeNode, number> {
    const pathDistance = distances.get(pathStart.value);
    const mazeHeight = input.length;
    const mazeWidth = input[0].length;
    const endNodes = new DefaultMap<MazeNode, number>(Number.POSITIVE_INFINITY);
    const numWall = Math.abs(pathStart.value.point.x - wallPoint.x) + Math.abs(pathStart.value.point.y - wallPoint.y);
    path.add(wallPoint);
    for (const wallAdjacent of wallPoint.adjacentPoints(mazeWidth - 1, mazeHeight - 1)) {
        if (wallAdjacent === prevPoint || path.has(wallAdjacent)) {
            continue;
        }
        if (input[wallAdjacent.y][wallAdjacent.x] === '#') {
            if (numWall < maxWalls) {
                for (const [endNode, dist] of wallCheat(
                    maxWalls,
                    input,
                    distances,
                    max,
                    wallAdjacent,
                    wallPoint,
                    pathStart,
                    minCheatSize,
                    path,
                    log,
                )
                ) {
                    if (dist < endNodes.get(endNode)) {
                        endNodes.set(endNode, dist);
                    }
                }
            }
        } else {
            let pathNode: Node<MazeNode> | null = pathStart;
            while (pathNode !== null) {
                if (pathNode.value.point === wallAdjacent) {
                    const cheatDistance = Math.abs(pathStart.value.point.x - wallAdjacent.x) + Math.abs(pathStart.value.point.y - wallAdjacent.y);
                    const thisDist = distances.get(pathNode.value);
                    const pathDist = cheatDistance + pathDistance;
                    if (thisDist < pathDist) break;

                    if (thisDist - pathDist > minCheatSize) {
                        if (pathDist < endNodes.get(pathNode.value)) {
                            endNodes.set(pathNode.value, thisDist - pathDist);
                            if ((thisDist - pathDist) === 76) {
                                console.log(
                                    pathStart.value.point, 'to', pathNode.value.point,
                                    'cheatDis:', cheatDistance, 's.dist:', thisDist,
                                    'pathDist:', pathDist, 'numWalls:', numWall,
                                );
                                // console.log(...path.values())
                            }
                        }
                    }
                    break;
                }
                pathNode = pathNode.next;
            }
        }
    }
    return endNodes;
}

function findCheat(
    path: Node<MazeNode>,
    input: string[],
    distances: DefaultMap<MazeNode, number>,
    max: number,
    cheats: DefaultMap<string, number>,
    maxCheats: number,
    minCheatSize: number
): void {
    const node = path.value;
    const mazeHeight = input.length;
    const mazeWidth = input[0].length;
    for (const adjacent of node.point.adjacentPoints(mazeWidth - 1, mazeHeight - 1)) {
        if (input[adjacent.y][adjacent.x] !== '#') {
            continue;
        }
        let log = false;
        const cheatPath = new Set<Point>();
        cheatPath.add(adjacent);
        cheatPath.add(path.value.point);
        if (adjacent === Point.p(1, 4)) log = true;
        const endNodes = wallCheat(maxCheats,
            input,
            distances,
            max,
            adjacent,
            node.point,
            path,
            minCheatSize,
            cheatPath,
            log
        );
        for (const [endNode, dist] of endNodes.entries()) {
            const key = `${adjacent}-${endNode.point}`;
            if (dist < cheats.get(key)) {
                cheats.set(key, dist);
            }
        }
    }
}

function twentyByTwenty(
    maze: LinkedList<MazeNode>,
    pathPoint: Point,
    centerPoint: Point,
    input: string[],
    distances: DefaultMap<MazeNode, number>,
    minCheat: number,
    cheats: Map<string, number>,
) {
    const startNode = maze.head!;
    const baseDist = distances.get(startNode.value);
    for (let deltaY = -20; deltaY < 20; deltaY++) {
        for (let deltaX = -20; deltaX < 20; deltaX++) {
            const wallDist = Math.abs(deltaX) + Math.abs(deltaY);
            if (wallDist > 20) break;
            const point = Point.p(pathPoint.x + deltaX, pathPoint.y + deltaY);
            if (!validMazePoint(input, point)) continue;
            if (input[point.y][point.x] !== '#') {
                let node: Node<MazeNode> | null = startNode;
                while (node !== null && node.value.point !== point) {
                    node = node.next;
                }
                if (node != null) {
                    // a node further down the original solve path
                    const sDist = distances.get(node.value);
                    const cheatDist = baseDist + wallDist;
                    const cheat = sDist - cheatDist;
                    if (cheat > minCheat) {
                        console.log('found a potential cheat of', cheat, 'from', startNode.value.point, 'to', node.value.point);
                        const key = `${centerPoint}-${point}`;
                        const existingDist = cheats.get(key);
                        if (!existingDist || cheat > existingDist) {
                            console.log('setting cheat', key, cheat);
                            cheats.set(key, cheat);
                        } else {
                            console.log(`didn't set ${key}, ${cheat}; existing: ${existingDist}`);
                        }
                    }
                }
            }
        }
    }
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const maze = parseUnweightedMaze(input);

    const start = maze.find(
        ({value}) => value.value === 'S'
    )?.value;

    const end = maze.find(
        ({value}) => value.value === 'E'
    )?.value;

    if (!start || !end) {
        throw new Error('missing start or end');
    }

    const {distances, previous} = dijkstra(maze, start, end);
    const max = distances.get(end);
    if (max == null) {
        throw new Error('no end');
    }
    console.log('max is:', max);
    const pathNodes = new LinkedList<MazeNode>();
    let node = end;
    while (node !== start) {
        pathNodes.prepend(node);
        node = previous.get(node)![0];
    }
    pathNodes.prepend(start);
    console.log('path nodes:', pathNodes.length);
    const minCheatSize = test ? (part === 2 ? 49 : 0) : 99;
    const maxCheats = part === 1 ? 1 : 19;

    let cheats = new DefaultMap<string, number>(Number.POSITIVE_INFINITY);
    if (part === 2) {
        cheats = new DefaultMap<string, number>(0);
    }
    if (part === 1) {
        for (const path of pathNodes) {
            findCheat(
                path,
                input,
                distances,
                max,
                cheats,
                maxCheats,
                minCheatSize
            );
        }
    } else {
        for (const path of pathNodes) {
            const pathPoint = path.value.point;
            // for (const adjacent of pathPoint.adjacentPoints(input[0].length, input.length)) {
            //     if (input[adjacent.y][adjacent.x] === '#') {
            //         twentyByTwenty(
            //             maze,
            //             pathPoint,
            //             adjacent,
            //             input,
            //             distances,
            //             minCheatSize,
            //             cheats
            //         );
            //     }
            // }
            for (const point of manhattanPoints(20, pathPoint, input[0].length - 1, input.length - 1)) {
                if (input[point.y][point.x] === '#') {
                    continue;
                }
                const node = maze.getNode(point);
                if (!node) {
                    console.log(point, input[point.y][point.x]);
                    throw new Error('failed to find cheat exit node');
                }
                const wallSize = Math.abs(point.x - pathPoint.x) + Math.abs(point.y - pathPoint.y);
                const oldDist = distances.get(node);
                const newDist = distances.get(path.value) + wallSize;
                const cheat = oldDist - newDist;
                const key = `${pathPoint}-${point}`;
                if (cheat > minCheatSize && cheat > cheats.get(key)) {
                    cheats.set(key, cheat);
                }
            }
        }
    }
    // for (const [path, cheat] of cheats.entries()) {
    //     if (path.startsWith('(1, 4)')) {
    //         console.log(path, '=>', cheat);
    //     }
    // }
    const map = new DefaultMap<number, number>(0);
    const keys = [...cheats.entries()].filter(
        ([k, v]) => v === Number.POSITIVE_INFINITY
    ).map(
        ([k, v]) => k
    );
    for (const key of keys)
        cheats.delete(key);

    for (const value of cheats.values()) {
        map.set(value, map.get(value) + 1);
    }
    for (const saved of [...map.keys()].sort((a, b) => a - b)) {
        const count = map.get(saved);
        console.log(count, 'cheats saved', saved);
    }
    return cheats.size;
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
