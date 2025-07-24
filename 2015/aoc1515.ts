import { argsToOptions NotImplemented, Options, run } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

type Ingredient = {
    name: string;
    capacity: number;
    durability: number;
    flavor: number;
    texture: number;
    calories: number;
};

const RE = /(?<name>\w+): capacity (?<capacity>-?\d+), durability (?<durability>-?\d+), flavor (?<flavor>-?\d+), texture (?<texture>-?\d+), calories (?<calories>-?\d+)/u;
export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const ingrendients: Ingredient[] = [];
    for (const line of input) {
        const match = line.match(RE);
        if (!match || !match.groups) {
            throw new Error('RE');
        }
        ingrendients.push({
            name: match.groups.name,
            capacity: parseInt(match.groups.capacity, 10),
            durability: parseInt(match.groups.durability, 10),
            flavor: parseInt(match.groups.flavor, 10),
            texture: parseInt(match.groups.texture, 10),
            calories: parseInt(match.groups.calories, 10),
        });
    }
    if (part === 1) {
        
    }
    throw new NotImplemented('Not Implemented');
}

const options = argsToOptions(process.argv);

run(__filename, solve, options);
