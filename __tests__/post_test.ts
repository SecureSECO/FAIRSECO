import { post } from "../src/post";
import { expect, test } from "@jest/globals";
import fs from "fs";

test("Generates .FairSECO folder", async () => {
    await post([]);
    let FolderExists: Boolean = false;
    FolderExists = fs.existsSync("./.FairSECO");
    expect(FolderExists).toBe(true);
});
