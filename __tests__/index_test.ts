import Add from "../index";
import { expect, jest, test } from "@jest/globals";

test("Addition", () => {
    expect(Add(1, 2)).toBe(3);
});
test("Addition Fail", () => {
    expect(Add(2, 2)).toBe(5);
});
