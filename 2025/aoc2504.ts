import { logger, NotImplemented, run } from "aoc-copilot";
import { dumpGrid } from "../utils/grid";

type AdditionalInfo = {
  [key: string]: string;
};

function countRolls(map: string[][], x: number, y: number): number {
  let rolls = 8;
  if (y <= 0 || x <= 0 || map[y - 1][x - 1] === ".") rolls--;
  if (y <= 0 || map[y - 1][x] === ".") rolls--;
  if (y <= 0 || x >= map[y].length - 1 || map[y - 1][x + 1] === ".") rolls--;
  if (x <= 0 || map[y][x - 1] === ".") rolls--;
  if (x >= map[y].length - 1 || map[y][x + 1] === ".") rolls--;
  if (y >= map.length - 1|| x <= 0 || map[y + 1][x - 1] === ".") rolls--;
  if (y >= map.length - 1 || map[y + 1][x] === ".") rolls--;
  if (y >= map.length - 1|| x >= map[y].length - 1 || map[y + 1][x + 1] === ".") rolls--;
  return rolls;
}

export async function solve(
  input: string[],
  part: number,
  test: boolean,
  additionalInfo?: AdditionalInfo
): Promise<string | number> {
  const map: string[][] = [];
  let total = 0;
  for (const line of input) {
    if (line.trim() === "") continue;
    map.push(line.trim().split(""));
  }
  if (test) dumpGrid(map);
  if (part === 1) {
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        try {
          if (map[y][x] === "@") {
            if (test && countRolls(map, x, y) < 4) logger.log("canReach:", x, y);
            total += countRolls(map, x, y) < 4 ? 1 : 0;
          }
        } catch (err) {
          logger.error(`error looking at ${x}, ${y}`, err);
          return 0;
        }
      }
    }
    return total;
  }
  let oldTotal = -1;
  while (oldTotal !== total) {
    oldTotal = total;
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        try {
          if (map[y][x] === "@") {
            if (countRolls(map, x, y) < 4) {
                total++;
                map[y][x] = '.';
            }
          }
        } catch (err) {
          logger.error(`error looking at ${x}, ${y}`, err);
          return 0;
        }
      }
    }
  }
  return total;
}

run(__filename, solve);
