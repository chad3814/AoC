import { NotImplemented, run, logger } from "aoc-copilot";
// import { Point } from "../utils/point";

type AdditionalInfo = {
    [key: string]: string;
};

function area(p1: [number, number], p2: [number, number]) {
    return Math.abs(p1[0] - p2[0] + 1) * Math.abs(p1[1] - p2[1] + 1);
}

function intersectH(p1: [number, number], p2: [number, number], x1: number, x2: number, y: number): boolean {
    const minX = Math.min(p1[0], p2[0]);
    const maxX = Math.max(p1[0], p2[0]);
    const minY = Math.min(p1[1], p2[1]);
    const maxY = Math.max(p1[1], p2[1]);
    if (x1 <= minX && x2 <= minX) return false;
    if (x1 >= maxX && x2 >= maxX) return false;
    if (y < minY || y > maxY) return false;
    if (x1 >= minX && x2 >= minX && x1 <= maxX && x2 <= maxX && (y === minY || y === maxY)) return false;
    return true;
}

function intersectV(p1: [number, number], p2: [number, number], y1: number, y2: number, x: number): boolean {
    const minX = Math.min(p1[0], p2[0]);
    const maxX = Math.max(p1[0], p2[0]);
    const minY = Math.min(p1[1], p2[1]);
    const maxY = Math.max(p1[1], p2[1]);
    if (y1 <= minY && y2 <= minY) return false;
    if (y1 >= maxY && y2 >= maxY) return false;
    if (x < minX || x > maxX) return false;
    if (y1 >= minY && y2 >= minY && y1 <= maxY && y2 <= maxY && (x === minX || x === maxX)) return false;
    return true;

}

function isEvenVert(vs: [number, number, number][], p: [number, number]): boolean {
    const verticals = vs.filter(
        ([y1, y2, x]) => x < p[0] && Math.min(y1, y2) <= p[1] && Math.max(y1, y2) > p[1]
    );
    return (verticals.length % 2) === 0;
}

function isEvenHorz(hs: [number, number, number][], p: [number, number]): boolean {
    const horizontals = hs.filter(
        ([x1, x2, y]) => y < p[1] && Math.min(x1, x2) <= p[0] && Math.max(x1, x2) > p[0]
    );
    return (horizontals.length % 2) === 0;
}

function isInterior(horizontals: [number, number, number][], verticals: [number, number, number][], x: number, y: number): boolean {
    // if it lies on one of the horizontal or vertical lines, it is interior
    for (const h of horizontals) {
        if (h[2] === y && Math.min(h[0], h[1]) < x && Math.max(h[0], h[1]) > x) return true;
    }
    for (const v of verticals) {
        if (v[2] === x && Math.min(v[0], v[1]) < y && Math.max(v[0], v[1]) > y) return true;
    }
    return !isEvenHorz(horizontals, [x, y]);
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const points: [number, number][] = [];
    for (const line of input) {
        if (line.trim() === '') continue;
        const [x,y] = line.split(',').map(Number);
        points.push([x, y]);
    }
    const rectangles: [[number, number], [number, number]][] = [];
    for (let i = 0; i < points.length; i++) {
        const p1 = points[i]!;
        for (let j = i + 1; j < points.length; j++) {
            const p2 = points[j];
            rectangles.push([p1, p2]);
        }
    }
    rectangles.sort(
        (a, b) => area(b[0], b[1]) - area(a[0], a[1])
    );
    if (part === 1) {
        return area(...rectangles[0]);
    }
    const horizontals: [number, number, number][] = [];
    const verticals: [number, number, number][] = [];
    for (let i = 1; i < points.length; i++) {
        const p1 = points[i - 1];
        const p2 = points[i];
        if (p1[1] === p2[1]) {
            horizontals.push([p1[0], p2[0], p1[1]]);
        } else {
            verticals.push([p1[1], p2[1], p1[0]]);
        }
    }
    if (points[0][1] === points.at(-1)![1]) {
        horizontals.push([points[0][0], points.at(-1)![0], points[0][1]]);
    } else {
        verticals.push([points[0][1], points.at(-1)![1], points[0][0]]);
    }

    for (const h of horizontals) {
        if (test) logger.log('line:', h);
    }
    const greens = new Set<string>();
    const whites = new Set<string>();
    for (const [p1, p2] of rectangles) {
        const minX = Math.min(p1[0], p2[0]);
        const maxX = Math.max(p1[0], p2[0]);
        const minY = Math.min(p1[1], p2[1]);
        const maxY = Math.max(p1[1], p2[1]);
        let b = false;
        for (let y = minY + 1; y < maxY; y++) {
            for (let x = minX + 1; x < maxX; x++) {
                const isGreen = isInterior(horizontals, verticals, x, y);
                if (!isGreen) {
                    b = true;
                    break;
                }
            }
            if (b) {
                break;
            }
        }
        if (b) continue;
        return area(p1, p2);
    }
    return -1;
}

run(__filename, solve);
