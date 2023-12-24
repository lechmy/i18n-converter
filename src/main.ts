import { utils, writeFile, read } from 'xlsx-js'
import { isObject, get, isArray, set } from 'lodash'
import { translationUtilityValues, translationUtilityOptions } from './types' 

export const translationUtility = (
  translationsObject: TranslationUtilityValues,
  setupOptions?: TranslationUtilityOptions
) => {
  const options = Object.assign(
    {
      name: 'TranslationsSheet',
      keyColumnName: 'key',
      ignoreKey: '!',
      emptyValue: '# EMPTY',
      missingProp: '# MISSING PROP',
      extension: 'js'
    },
    setupOptions
  )

  const tableOptions = {
    cellDates: true,
    sheetStubs: true,
  }

  const translationsIds = Object.keys(translationsObject)
  const translationsFiles = Object.values(translationsObject)

  const getValues = (translation: any): void => {
    const translationRows: any = {}
    let repeat = false

    Object.entries(translation).forEach((entrie) => {
      const labelBase = entrie[0]
      const objectBase = entrie[1]

      if (isObject(objectBase)) {
        repeat = true
        Object.entries(objectBase).forEach((item) => (translationRows[`${labelBase}.${item[0]}`] = item[1]))
      } else if (!isArray(objectBase)) {
        translationRows[labelBase] = translationsFiles
          .map((lang: any) => get(lang, labelBase) || options.missingProp)
          .join(',')
      }
    })
    if (repeat) {
      getValues(translationRows)
    } else {
      makeExelFile(translationRows)
    }
  }

  const makeExelFile = (data: { [key: string]: string }): void => {
    const tableHeader = [
      { t: 's', v: options.keyColumnName },
      ...translationsIds.map((id) => {
        return { t: 's', v: id }
      }),
    ]

    const tableData = Object.entries(data).map((entrie) => {
      const label = entrie[0]
      const values = entrie[1].split(',')

      return [
        { t: 's', v: label },
        ...values.map((value: any) => {
          return { t: 's', v: value.startsWith(options.ignoreKey) ? options.emptyValue : value }
        }),
      ]
    })

    const worksheet = utils.aoa_to_sheet([tableHeader, ...tableData], tableOptions)
    const workbook = utils.book_new()
    utils.book_append_sheet(workbook, worksheet, 'Sheet 1')

    const cellWidths = Object.keys(tableData[0]).map((item: any, index: number) => {
      return tableData.reduce(
        (width: any, row: any) => {
          const max = Math.max(width.wch, row[index].v.toString().length)
          return { wch: max }
        },
        { wch: 6 }
      )
    })
    worksheet['!cols'] = cellWidths
    writeFile(workbook, `${options.name}.xlsx`)
  }

  const readExcel = async (e) => {
    const file = e.target.files?.length ? e.target.files[0] : null
    const data = await file?.arrayBuffer()
    const workbook = read(data)
    const translations = utils.sheet_to_json(workbook.Sheets['Sheet 1'])

    translationsIds.forEach((id) => {
      const data: any = {}
      translations.forEach((translation: any) => {
        set(data, translation.value, translation[id])
      })
      const content = `const ${id.toUpperCase()} = ${JSON.stringify(data)} \n export default ${id.toUpperCase()}`
      const blob = new Blob([content], { type: 'text/javascript' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${id}.${options.extension}`)
      document.body.appendChild(link)
      link.click()
      link?.parentNode?.removeChild(link)
    })
  }

  const generateExcel = (): void => {
    getValues(translationsFiles[0])
  }

  return {
    generateExcel,
    readExcel,
  }
}
