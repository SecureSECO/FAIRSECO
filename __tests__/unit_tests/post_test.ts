import { post } from "../../src/post";
import { expect, test } from "@jest/globals";
import fs from "fs";

test("Generates .FAIRSECO folder", async () => {
    await post([]);
    let FolderExists: Boolean = false;
    FolderExists = fs.existsSync("./.FAIRSECO");
    expect(FolderExists).toBe(true);
});
