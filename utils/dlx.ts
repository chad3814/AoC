type ListNode = {
    up: ListNode;
    down: ListNode;
    left: ListNode;
    right: ListNode;
    header: HeaderNode;
};
interface HeaderNode {
    name: string;
    count: number;
    rows?: ListNode;
};

export type OneOrZero = 1 | 0;

export class DLX {
    constructor(columnNames: string[]) {
        this.columns = columnNames.map(
            name => ({name, count: 0})
        );
    }

    addRow(columns: number): void;
    addRow(columns: OneOrZero[]): void;
    addRow(columns: number | OneOrZero[]): void {
        let nums: OneOrZero[];
        if (Array.isArray(columns)) {
            if (columns.length !== this.columns.length) {
                throw new Error('Invalid number of columns in row');
            }
            nums = columns;
        } else {
            nums = [];
            for (let i = this.columns.length - 1; i >= 0; i--) {
                const bit: OneOrZero = 0 === (
                    (1 << i) & columns
                ) ? 0 : 1;
                nums.push(bit);
            }
        }
        const newNodes: Partial<ListNode>[] = [];
        for (let i = 0; i < nums.length; i++) {
            if (nums[i] === 0) continue;
            const node: Partial<ListNode> = {
                header: this.columns[i],
            };
            newNodes.push(node);
            if (this.columns[i].rows) {
                node.down = this.columns[i].rows!;
                node.up = this.columns[i].rows!.up;
                this.columns[i].rows!.up.down = node as ListNode;
                this.columns[i].rows!.up = node as ListNode;
            } else {
                this.columns[i].rows = node as ListNode;
                node.up = node as ListNode;
                node.down = node as ListNode;
            }
            this.columns[i].count++;
        }
        for (let i = 0; i < newNodes.length; i++) {
            const j = (i + newNodes.length - 1) % newNodes.length;
            const k = (i + 1) % newNodes.length;
            newNodes[i].left = newNodes[j] as ListNode;
            newNodes[i].right = newNodes[k] as ListNode;
        }
    }

    solveCount(columns = this.columns.slice()): number {
        if (columns.length === 0) {
            // matrix is empty, a successfull coverage
            return 1;
        }
        const lowest = Math.min(...columns.map(c => c.count));
        if (lowest === 0) {
            // a zero column, an unsuccessfuil coverage
            return 0;
        }
        const header = columns.find(c => c.count === lowest);
        if (!header?.rows) {
            throw new Error('Matrix error');
        }
        const first = header.rows;
        let mainRow = first;
        let count = 0;
        do {
            // find the columns in this row
            const cols: HeaderNode[] = [];
            let cell = mainRow;
            do {
                cols.push(cell.header);
                cell = cell.right;
            } while (cell !== mainRow);
            // remove all the rows in each of the columns
            for (const col of cols) {
                // take the rows out
                if (!col.rows) {
                    throw new Error('Matrix error');
                }
                let row = col.rows
                do {
                    let cel = row;
                    do {
                        cell.up.down = cell.down;
                        cell.down.up = cell.up;
                        cell.header.count--;
                        cell = cell.right;
                    } while (cell !== row);
                    row = row.down;
                } while (row !== first);
            }
            count += this.solveCount(columns.filter(
                col => !cols.includes(col)
            ));
            // reverse
            for (const col of cols.reverse()) {
                if (!col.rows) {
                    throw new Error('Matrix error');
                }
                let row = col.rows;
                do {
                    let cell = row;
                    do {
                        cell.up.down = cell;
                        cell.down.up = cell;
                        cell.header.count++;
                        cell = cell.left;
                    } while (cell !== row);
                    row = row.up;
                } while (row !== col.rows);
            }
            mainRow = mainRow.down;
        } while (mainRow !== first);
        return count;
    }

    private columns: HeaderNode[];
}
