import { NotImplemented, run, logger } from "aoc-copilot";
import { Graph, GraphNode } from "../utils/generic-graph";

type AdditionalInfo = {
    [key: string]: string;
};

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const nodes = new Map<string, GraphNode<string>>();
    for (const line of input) {
        if (line.trim() === '') continue;
        const [name, outputs] = line.split(/:\s+/u);
        const node = nodes.get(name) ?? new GraphNode(name);
        for (const exit of outputs.split(/\s+/ug)) {
            const exitNode = nodes.get(exit) ?? new GraphNode(exit);
            node.addExit(exitNode, 0);
            nodes.set(exit, exitNode);
        }
        nodes.set(name, node);
    }
    const graph = new Graph(nodes.values());
    if (part === 1) {
        return graph.pathCount(nodes.get('you')!, nodes.get('out')!);
    }
    const svr = nodes.get('svr');
    const dac = nodes.get('dac');
    const fft = nodes.get('fft');
    const out = nodes.get('out');
    if (!svr) {
        console.error('nodes:', [...nodes.keys()]);
        throw new Error('no svr node');
    }
    if (!dac) {
        throw new Error('no dac node');
    }
    if (!fft) {
        throw new Error('no fft node');
    }
    if (!out) {
        throw new Error('no out node');
    }
    return graph.pathCount(svr, out, (set) => set.has(dac) && set.has(fft));
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
