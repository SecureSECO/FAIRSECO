import { ReturnObject } from "./getdata";
import YAML from "yaml";
import fs from "fs";

export function post(result: ReturnObject[]): boolean {
    // convert to yaml
    console.log("Creating FairSECO directory.");
    fs.mkdir("./.FairSECO/", (err) => {
        if (err != null) {
            console.log(
                "FairSECO directory already exists, skipping creation."
            );
        }
    });
    fs.open(
        "./.FairSECO/Report.yml",
        "w+",
        (err: NodeJS.ErrnoException | null, fd: number) => {
            if (err != null) {
                console.error("Error writing yaml file");
            } else {
                fs.write(fd, YAML.stringify(result), null, () => {});
                console.log("Successfully wrote YML file to dir");
                fs.close(fd);
            }
        }
    );
    return true;
}
