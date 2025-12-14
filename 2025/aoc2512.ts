import { NotImplemented, run, logger } from "aoc-copilot";
import { DLX } from "../utils/dlx";
import type { OneOrZero } from "../utils/dlx";

type AdditionalInfo = {
    [key: string]: string;
};

type Shape = string[][];
type Shapes = Shape[];

function rotate(shape: Shape): Shape {
    const ret: Shape = [];
    for (let x = 0; x < shape[0].length; x++) {
        const row: string[] = [];
        for (let y = 0; y < shape.length; y++) {
            row.push(shape[y][x]);
        }
        ret.push(row);
    }
    return ret;
}

function flip(shape: Shape): Shape {
    const ret: Shape = [];
    for (const row of shape) {
        ret.push(row.reverse())
    }
    return ret;
}

type Tree = {
    width: number;
    height: number;
    indexCount: number[];
};

function getRotations(shape: Shape): Shapes {
    const ret: Shapes = [shape];
    for (let i = 0; i < 3; i++) {
        ret.push(rotate(ret.at(-1)!));
    }
    return ret;
}

function getAllVersions(shape: Shape): Shapes {
    const ret: Shapes = getRotations(shape);
    ret.push(...getRotations(flip(shape)));
    return ret;
}

function copyShape(shape: Shape, space: OneOrZero[], sx: number, sy: number, width: number) {
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            space[(sy + y) * width + sx + x] = shape[y][x] === '#' ? 1 : 0;
        }
    }
}

const RE = /(?<width>\d+)x(?<height>\d+): (?<indexes>(\d+)( \d+)*)/u;

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const shapes: Shapes[] = [];
    let current: Shape | null = null;
    const trees: Tree[] = [];

    for (const line of input) {
        if (line.trim() === '') {
            if (current) {
                shapes.push(getAllVersions(current));
                current = null;
            }
            continue;
        }
        const matches = line.match(RE);
        if (!matches) {
            if (!current) current = [];
            current.push(line.split(''));
            continue;
        }
        if (!matches.groups?.width || !matches.groups?.height || !matches.groups?.indexes) {
            logger.error('parse error on line', line);
            return -1;
        }
        trees.push({
            width: parseInt(matches.groups.width, 10),
            height: parseInt(matches.groups.height),
            indexCount: matches.groups.indexes.split(' ').map(Number),
        });
    }
    let total = 0;
    if (part === 1) {
        for (const tree of trees) {
            const shapeIndex = new Map<string, number>();
            const names: string[] = [];
            for (let y = 0; y < tree.height; y++) {
                for (let x = 0; x < tree.width; x++) {
                    names.push(`${x},${y}`);
                }
            }
            for (let index = 0; index < shapes.length; index++) {
                const count = tree.indexCount[index];
                for (let c = 0; c < count; c++) {
                    shapeIndex.set(`${index}_${c}`, names.length);
                    names.push(`${index}_${c}`);
                }
            }
            const dlx = new DLX(names);
            const space: OneOrZero[] = new Array(names.length).fill(0);
            for (let index = 0; index < shapes.length; index++) {
                const shape = shapes[index];
                const count = tree.indexCount[index];

                if (count === 0) continue;
                if (!shape) {
                    throw new Error('bad tree index');
                }

                for (let c = 0; c < count; c++) {
                    const nameIndex = shapeIndex.get(`${index}_${c}`);
                    if (!nameIndex) {
                        throw new Error('Name index error');
                    }
                    for (const shapeVer of shape) {
                        const shapeWidth = shapeVer[0].length;
                        const shapeHeight = shapeVer.length;
                        if (shapeWidth > tree.width || shapeHeight > tree.height) continue;

                        for (let y = shapeHeight; y < tree.height; y++) {
                            for (let x = shapeWidth; x < tree.width; x++) {
                                copyShape(shapeVer, space, x - shapeWidth, y - shapeHeight, tree.width);
                                space[nameIndex] = 1;
                                dlx.addRow(space);
                            }
                        }
                    }
                }
            }
            if (dlx.solveCount() > 0) total++;
        }
        return total;
    }
    throw new NotImplemented('Not Implemented');
}

run(__filename, solve);
