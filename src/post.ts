import { ReturnObject } from "./getdata";
import YAML from "yaml";
import fs from "fs";

export function post(result: ReturnObject[]): boolean {
    // convert to yaml
    fs.open("./stuff.yaml", "w+", (err, fd) => {
        if (err != null) {
            console.error("Error writing yaml file");
        } else {
            fs.write(fd, YAML.stringify(result), null, () => {});
        }
        fs.close(fd);
    });
    return true;
}
