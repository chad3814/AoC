type Params =readonly unknown[];

export interface Memoable {
    toMemo(): string;
}
const isMemoable = (value: Memoable): value is Memoable => typeof value.toMemo === 'function';

function key(x: any): string {
    const s = String(x);
    if (typeof x !== 'object') return s;
    if (Array.isArray(x)) return '[' + x.map(key).join(',') + ']';
    if (isMemoable(x)) return x.toMemo();
    if (!s.startsWith('[object ')) return s;
    let entries = Object.entries(x);
    if (x.entries) {
        entries = x.entries();
    }
    return '{' + [...entries].map(key).join(';') + '}';
}

export function memoize<This, T extends Params, R>(
    numArg = Number.POSITIVE_INFINITY
): (func: (...args: T)=>R) => (this: This, ...args: T) => R {
    return (func: (...args: T) => R) => {
        const map = new Map<string, R>();
        return function(this: This, ...args: T) {
            const k = key(args.slice(0, numArg));
            let ret = map.get(k);
            if (ret) {
                return ret;
            }
            ret = func.call(this, ...args);
            map.set(k, ret);
            return ret;
        }
    }
}

export class MemoSet<T extends Memoable> extends Set<T> implements Memoable {
    toMemo(): string {
        return `ms${[...super.values()].map(v => v.toMemo()).sort().join(',')}`;
    }
}

export class MemoMap<T, U> extends Map<T, U> implements Memoable {
    toMemo(): string {
        const map = new Map<string,string>();
        for (const [k, v] of super.entries()) {
            let key: string;
            let value: string;
            if ((k as {toMemo?: () => string}).toMemo) {
                key = (k as {toMemo: () => string}).toMemo();
            } else {
                key = String(k);
            }
            if ((v as {toMemo?: () => string}).toMemo) {
                value = (v as {toMemo: () => string}).toMemo();
            } else {
                value = String(v);
            }
            map.set(key, value);
        }
        return `mm${[...map.entries()].map(([k, v]) => `${k}-${v}`).sort().join(',')}`;
    }
}
