import { NotImplemented, run, logger } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

class JunctionBox {
    constructor (public readonly x: number, public readonly y: number, public readonly z: number) {
        this.circuitSet = new Set<JunctionBox>();
        this.circuitSet.add(this);
    }
    get circuit(): Set<JunctionBox> {
        return this.circuitSet;
    }

    public connect(otherBox: JunctionBox) {
        if (this.circuitSet !== otherBox.circuitSet) {
            for (const box of otherBox.circuitSet!.values()) {
                this.circuitSet!.add(box);
                box.circuitSet = this.circuitSet;
            }
        }
    }
    public toString(): string {
        return `${this.x},${this.y},${this.z}`;
    }

    protected circuitSet: Set<JunctionBox>;
}

function distance(box1: JunctionBox, box2: JunctionBox): number {
    const x = (box1.x - box2.x)**2;
    const y = (box1.y - box2.y)**2;
    const z = (box1.z - box2.z)**2;
    return Math.sqrt(x + y + z);
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const jumperCount = test ? 10 : 1000;
    const boxes: JunctionBox[] = [];
    const distances = new Map<string,number>();
    const boxMap = new Map<string, JunctionBox>();
    for (const line of input) {
        if (line.trim() === '') continue;
        const [x, y, z] = line.split(',').map(Number);
        const box = new JunctionBox(x, y, z);
        for (const existing of boxes) {
            distances.set(`${existing.toString()}-${box.toString()}`, distance(existing, box));
        }
        boxes.push(box);
        boxMap.set(box.toString(), box);
    }
    const distancePairs = [...distances.entries()].sort(
        (a, b) => a[1] - b[1]
    ).map(d => d[0]);
    if (part === 1) {
        distancePairs.length = jumperCount;
        for (const connection of distancePairs) {
            const [b1, b2] = connection.split('-');
            const box1 = boxMap.get(b1);
            const box2 = boxMap.get(b2);
            if (!box1 || !box2) {
                throw new Error('bad box');
            }
            box1.connect(box2);
        }
        const circuitSets = new Set<Set<JunctionBox>>();
        for (const box of boxes) {
            circuitSets.add(box.circuit);
        }
        const largest = [...circuitSets].sort(
            (a, b) => b.size - a.size
        );
        return largest[0].size * largest[1].size * largest[2].size;
    }
    for (const pair of distancePairs) {
        const [b1, b2] = pair.split('-');
        const box1 = boxMap.get(b1);
        const box2 = boxMap.get(b2);
        if (!box1 || !box2) {
            throw new Error('bad box');
        }
        box1.connect(box2);
        if (box1.circuit.size === boxes.length) {
            return box1.x * box2.x;
        }
    }
    return -1;
}

run(__filename, solve);
