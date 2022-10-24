import * as fs from 'fs'
import path from 'path'
import { ReturnObject } from './getdata'

// Write the data to a html file
export async function WriteHTML(
    data: ReturnObject[],
    filePath: string
): Promise<void> {
    const templateFilename = path.join(
        __dirname,
        '..',
        'templates',
        'index.html.template'
    )

    const template = await fs.promises.readFile(templateFilename, 'utf8')
    const app = template.replace(
        '{{node inserts the data here}}',
        JSON.stringify(data)
    )

    await fs.promises.writeFile(filePath, app, 'utf8')
}

// Write the local css file also to where the HTML file comes.
export async function WriteCSS(
    filePath: string
): Promise<void> {
    const cssFilename = path.join(
        __dirname,
        '..',
        'templates',
        'style.css'
    )

    const cssContent = await fs.promises.readFile(cssFilename, 'utf8')
    await fs.promises.writeFile(filePath, cssContent, 'utf8')
}