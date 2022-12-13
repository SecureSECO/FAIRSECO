import * as fs from "fs";
import path from "path";
import { ReturnObject } from "./getdata";
import ejs from "ejs";

/**
 * Creates a webapp that reports the data gathered by FairSECO.
 * @param data The gathered data.
 * @param filePath The path to which the HTML file will be written.
 */
export async function WriteHTML(
    data: ReturnObject[],
    filePath: string
): Promise<void> {
    // const templateFilename = path.join(
    //     __dirname,
    //     "..",
    //     "templates",
    //     "index.html.template"
    // );

    // const template = await fs.promises.readFile(templateFilename, "utf8");
    const template = await ejs.renderFile("./templates/index.ejs", { data });
    const template2 = await ejs.renderFile("./templates/citationgraph.ejs", { data });
    const app = template.replace(
        "{{node inserts the data here}}",
        JSON.stringify(data)
    );

    await fs.promises.writeFile(filePath, app, "utf8");
    await fs.promises.writeFile("./.fairSECO/citationgraph.html", template2, "utf8");
}

/**
 * Includes the local CSS file for the webapp.
 * @param filePath The path to the HTML file of the webapp.
 */
export async function WriteCSS(filePath: string): Promise<void> {
    const cssFilename = path.join(__dirname, "..", "templates", "style.css");

    const cssContent = await fs.promises.readFile(cssFilename, "utf8");
    await fs.promises.writeFile(filePath, cssContent, "utf8");
}
