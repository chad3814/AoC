import { NotImplemented, run, logger } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

/**
 * Monkey 0:
 *   Starting items: 89, 73, 66, 57, 64, 80
 *   Operation: new = old * 3
 *   Test: divisible by 13
 *     If true: throw to monkey 6
 *     If false: throw to monkey 2
 */

enum Operation {
    ADD,
    MULTIPLY,
    SQUARE,
}

class Monkey {
    constructor(private items: number[], private operation: Operation, private opValue: number, private testDivisor: number, private trueTarget: number, private falseTarget: number) {
    }

    addItem(item: number) {
        this.items.push(item);
    }

    processItems(monkeys: Monkey[], worry = false) {
        for (const item of this.items) {
            let newItem: number;
            switch (this.operation) {
                case Operation.ADD:
                    newItem = item + this.opValue;
                    break;
                case Operation.MULTIPLY:
                    newItem = item * this.opValue;
                    break;
                case Operation.SQUARE:
                    newItem = item * item;
                    break;
                default:
                    throw new NotImplemented(`Unknown operation: ${this.operation}`);
            }
            if (!worry)
                newItem = Math.floor(newItem / 3);
            if (newItem % this.testDivisor === 0) {
                monkeys[this.trueTarget].addItem(newItem);
            } else {
                monkeys[this.falseTarget].addItem(newItem);
            }
            this.processedCount += 1;
        }
        this.items = [];
    }

    get itemCount() {
        return this.processedCount;
    }
    private processedCount = 0;
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const monkeys: Monkey[] = [];
    const numMonkeys = test ? 4 : 8;
    let i = 0;
    for (let m = 0; m < numMonkeys; m++) {
        const offset = m * 7;
        const items = input[offset + 1].split(":")[1].split(",").map(s => parseInt(s.trim(), 10));
        const operationParts = input[offset + 2].split("=");
        const operationStr = operationParts[1].trim();
        let operation: Operation;
        let opValue = 0;
        if (operationStr === "old * old") {
            operation = Operation.SQUARE;
        } else if (operationStr.startsWith("old *")) {
            operation = Operation.MULTIPLY;
            opValue = parseInt(operationStr.split("*")[1].trim(), 10);
        } else if (operationStr.startsWith("old +")) {
            operation = Operation.ADD;
            opValue = parseInt(operationStr.split("+")[1].trim(), 10);
        } else {
            throw new NotImplemented(`Unknown operation string: ${operationStr}`);
        }
        const testDivisor = parseInt(input[offset + 3].split("by")[1].trim(), 10);
        const trueTarget = parseInt(input[offset + 4].split("monkey ")[1].trim(), 10);
        const falseTarget = parseInt(input[offset + 5].split("monkey ")[1].trim(), 10);
        monkeys.push(new Monkey(items, operation, opValue, testDivisor, trueTarget, falseTarget));
    }
    const worry = part === 2;
    const rounds = worry ? 10000 : 20;
    for (let round = 0; round < rounds; round++) {
        for (const monkey of monkeys) {
            monkey.processItems(monkeys, true);
        }
    }
    const order = monkeys.sort(
        (a, b) => b.itemCount - a.itemCount
    );
    return order[0].itemCount * order[1].itemCount;
}

run(__filename, solve);
