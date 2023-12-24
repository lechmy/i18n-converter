# i18n-converter
Easy way to extract translations from project into excel file and generate translation files from excel files, that are ready to be inserted into project

## Features:
- Export translation keys with coresponding translation values into Excel file
- Select Excel file to generate transaltion files that re ready to be inserted into project
- Set custom indicator to ignore translations that are existing in project
- Set custom text for missing values in excel file
- Set custom file name for generated excel file

## Usage
Initialize utility by sending translations and getting separate methods for generating excel file and translation files
```js
import en from 'path/to/file/en.js';
import de from 'path/to/file/de.js';
import fr from 'path/to/file/fr.js';

const { generateExcel, readExcel } = translationUtility({ en, de, fr }, options);
```

### generateExcel
To generate exel file simply place `generateExcel` on `<button>` element
```html
<button onclick="generateExcel">Generate Translations</button>
```

### readExcel
To generate translation files add `readExcel` on `<input type="file" />` element
```html
<input type="file" onchange="readExcel" />
```

## Options
```js
// Name of generated exel file with transaltions
name: "TranslationsSheet",

// Name of column containing translation keys
keyColumnName: "key",

// String value that is used to ignore translations from translation files
// Every translation that starts with value in this property, will be replaced with value in property 'emptyValue' when excel file is generated
ignoreKey: '!',

// String value that will be placed in case there is no translation value
// In case one of the translation files is missing translation, value in this property will be placed in coresponding cell when excel file is generated
emptyValue: "# EMPTY",

// String value that will be placed in case there is no translation key
// In case one of the translation files is missing translation key, value in this property will be placed in coresponding cell when excel file is generated
missingProp: "# MISSING PROP",

// Extension of translation files that are generated
extension: "js"
```
