export type ExtensionType = 'js' | 'ts'

export interface TranslationUtilityValues {
  [key: string]: any
}

export interface TranslationUtilityOptions {
  name?: string
  keyColumnName?: string
  ignoreKey?: string
  emptyValue?: string
  missingProp?: string
  extension?: ExtensionType
}