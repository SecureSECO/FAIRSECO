import * as fs from 'fs'
import path from 'path'
import { ReturnObject } from './getdata'

export async function write_overview(
    data: ReturnObject[],
    file_path: string
): Promise<void> {
    const template_filename = path.join(
        __dirname,
        '..',
        'templates',
        'index.html.template'
    )
    const template = await fs.promises.readFile(template_filename, 'utf8')
    const app = template.replace(
        '{{node inserts the data here}}',
        JSON.stringify(data)
    )
    await fs.promises.writeFile(file_path, app, 'utf8')
    return
}

export async function write_css(
    file_path: string
): Promise<void> {
    const css_filename = path.join(
        __dirname,
        '..',
        'templates',
        'style.css'
    )
    const cssContent = await fs.promises.readFile(css_filename, 'utf8')
    await fs.promises.writeFile(file_path, cssContent, 'utf8')
    return
}