import { NotImplemented, run, logger } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    if (part === 1) {
        throw new NotImplemented('Not Implemented');
    }
    throw new NotImplemented('Not Implemented');
}

run(__filename, solve);
