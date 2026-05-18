import { writeFile } from 'node:fs/promises'
import { exportPuristaDefinitions } from './definitions.js'

const definitions = await exportPuristaDefinitions()

await writeFile('purista.definitions.json', `${JSON.stringify(definitions, null, 2)}\n`, 'utf-8')
