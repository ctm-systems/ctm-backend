import fs from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import XLSX from 'xlsx'

export class ExcelService {
  async processAndSave(inputPath: string, headerLine: number = 17) {
    const workbook = XLSX.readFile(inputPath)
    const sheet = workbook.Sheets[workbook.SheetNames[0]]

    const rows = XLSX.utils.sheet_to_json<any[]>(sheet, {
      header: 1,
      raw: true,
      defval: null,
    })

    const rawHeaders = rows[headerLine - 1] as string[]
    const headers = this.makeHeadersUnique(rawHeaders)

    const data: any[] = []

    for (let i = headerLine; i < rows.length; i++) {
      const row = rows[i]

      if (!row || row.every((cell) => cell === null)) {
        break
      }

      const obj: Record<string, any> = {}
      headers.forEach((h, idx) => (obj[h] = row[idx]))
      data.push(obj)
    }

    const renamedData = data.map((row) => ({
      'Óxidos': row['Compound'] ?? null,
      '%': row['m/m%'] ?? null,
      'Elementos': row['El'] ?? null,
      '%%': row['m/m%.1'] ?? null,
    }))

    renamedData.forEach((row) => {
      if (typeof row['Elementos'] === 'string') {
        row['Elementos'] = row['Elementos'].trim().replace('Sx', 'S').replace('Px', 'P')
      }
    })

    const worksheet = XLSX.utils.json_to_sheet(renamedData)
    const newWorkbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(newWorkbook, worksheet, 'Tabela')

    const fileName = `${randomUUID()}.xlsx`
    const outputPath = path.resolve('storage/planilhas', fileName)

    fs.mkdirSync(path.dirname(outputPath), { recursive: true })
    XLSX.writeFile(newWorkbook, outputPath)

    return {
      fileName,
      outputPath,
    }
  }

  private makeHeadersUnique(headers: string[]) {
    const counter: Record<string, number> = {}

    return headers.map((h) => {
      const key = String(h).trim()
      if (!counter[key]) {
        counter[key] = 1
        return key
      }
      return `${key}.${counter[key]++}`
    })
  }
}
