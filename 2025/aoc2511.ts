import { NotImplemented, run, logger } from "aoc-copilot";
import { Graph, GraphNode } from "../utils/generic-graph";
import { MemoMap, MemoSet } from "../utils/memoize";

type AdditionalInfo = {
    [key: string]: string;
};

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const g = new Map<string, Set<string>>();
    for (const line of input) {
        if (line.trim() === '') continue;
        const [name, outputs] = line.split(/:\s+/u);
        g.set(name, new Set(outputs.split(/\s+/ug)));
    }
    if (part === 1) {
        return dp(g, 'you', 'out');
    }

    let route1 = dp(g, 'svr', 'dac');
    route1 *= dp(g, 'dac', 'fft');
    route1 *= dp(g, 'fft', 'out');

    let route2 = dp(g, 'svr', 'fft');
    route2 *= dp(g, 'fft', 'dac');
    route2 *= dp(g, 'dac', 'out');

    return route1 + route2;

    function dp(graph: Map<string, Set<string>>, start: string, end: string) {
        const memo: Map<string, number> = new Map();
        function dfs(current: string): number {
            if (current === end) return 1;
            const memoVal = memo.get(current);
            if (memoVal !== undefined) return memoVal;
            const total = [...graph.get(current) ?? []].reduce((t, c) => t + dfs(c), 0);
            memo.set(current, total);
            return total;
        }
        return dfs(start);
    }

}

run(__filename, solve, {}, {
    reason: 'different test',
    part1length: 1,
    inputs: {
        selector: 'code',
        indexes: [0, 44],
    },
    answers: {
        selector: 'code',
        indexesOrLiterals: [32, 48]
    }
});
