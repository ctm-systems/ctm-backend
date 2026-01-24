import { randomUUID } from 'node:crypto'
import XLSX from 'xlsx'
import { supabase } from '#start/supabase'

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

    const fileBuffer = XLSX.write(newWorkbook, { type: 'buffer', bookType: 'xlsx' })
    const fileName = `${randomUUID()}.xlsx`

    const { data: uploadData, error } = await supabase.storage
      .from('planilhas')
      .upload(fileName, fileBuffer, {
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        upsert: false,
      })

    if (error) throw error

    return {
      fileName,
      path: uploadData.path,
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
