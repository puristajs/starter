import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createPuristaDefinitions } from './definitions.js'

const outPath = resolve(process.cwd(), process.argv[2] ?? 'purista.definitions.json')
const definitions = await createPuristaDefinitions()

await writeFile(outPath, `${JSON.stringify(definitions, null, 2)}\n`, 'utf-8')
process.stdout.write(`PURISTA definitions exported to ${outPath}\n`)
