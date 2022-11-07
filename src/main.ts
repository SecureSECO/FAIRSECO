import { main } from "./action";

main();

/**
 * Console logs the result of adding a to b
 * @param a : number 1 to add
 * @param b : number 2 to add
 * @returns nothing
 */
export function test(a: number, b: number) {
    console.log(`Stuff:${a + b}`);
}
