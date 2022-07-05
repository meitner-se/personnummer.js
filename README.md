# personnummer.js

This fork changes the format of normalized personal numbers to YYYYMMDD-XXXX

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) ![npm version](https://img.shields.io/npm/v/personnummer.js.svg?style=popout-square) ![Github issues](https://img.shields.io/github/issues/kelszo/personnummer.js.svg?style=popout-square)

JavaScript script (written in TypeScript) to validate and parse Swedish personal identity numbers. Fixes problems other packages fail to fix, e.g.: leap years, co-ordination numbers (samordningsnummer), parsing, and strict validation. All in one small package without dependencies. Works for Swedish personal numbers of all formats, see example below.

Also works with Swedish organisations numbers.

## Installing

Install the module with npm: `npm install personnummer.js`

## Basic usage

```javascript
var personnummer = require("personnummer.js");

// valid personal number formats: yymmdd-nnnn yyyymmdd-nnnn yymmddnnnn yyyymmddnnnn yymmdd+nnnn yyyymmdd+nnnn
// valid personal number formats ex.: 040506-7356, 9912188324, 19780329-2833, 201005047640, 180604+0448

personnummer.validate("970214-9890");
// true

personnummer.validate("0708089396");
// true

personnummer.validate("123456-7890");
// false

personnummer.normalise("870724-1082");
// '198707241082'

personnummer.parse("19710904-5307");
/*
{
  valid: true,
  type: 'PERSONNUMMER',
  input: '19710904-5307',
  normalised: '197109045307',
  date: 1971-09-04T00:00:00.000Z,
  age: 47,
  gender: 'FEMALE',
  birthplace: 'Göteborgs och bohus län'
}
*/

personnummer.parseCIN("556007-3495");
/*
{
  valid: true,
  type: 'Aktiebolag',
  input: '556007-3495',
  normalised: '165560073495'
}
*/
```

## Functions

### Personal Number

#### Description

| Function                      | Description                                                                                       |
| ----------------------------- | ------------------------------------------------------------------------------------------------- |
| **validate(str [, options])** | Checks if the input personal number is a valid Swedish personal number.                           |
| **normalise(str)**            | Normalises the input to the following format `yyyymmddnnnn`. E.g. `960417-5050` -> `199604175050` |
| **parse(str [, options])**    | Parses the personal number and returns an object. See basic usage.                                |

#### Returns

| Function                      | Returns                                                                                                                                                                                                                                                                                                                                                       |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **validate(str [, options])** | boolean. true if valid, false if not.                                                                                                                                                                                                                                                                                                                         |
| **normalise(str)**            | string, can be empty if personal number is not valid.                                                                                                                                                                                                                                                                                                         |
| **parse(str [, options])**    | Returns an object with: `valid` (boolean), `input` (string),`normalised` (string), `date` (Date object), `age` (number), `gender` (string: male or female), `birthplace` (string or undefined if personal number > 1990). If the personal number is invalid: resturns `valid:false` and a `reason:'example reason'` and `input`. See basic usage or examples. |

#### Options

| Option        | Input                  | Description                                                                                                                                                                                                                        |
| ------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **strict**    | boolean: default false | Sets strict validation, i.e. personal number can not be from the future, can not be older than 120 years, and separator must match age (- for age &lt; 100 + for ages >= 100)                                                      |
| **forgiving** | boolean: default false | If the user possibly incorrectly used a '+' separator instead of a '-' separator and produces an age >= 120 forgive them and correct their mistake. Also if the personal number is from the future set it to the previous century. |

Recommended options are: `{strict:true, forgiving:false}`. The `forgiving` option overrides the `strict` option.

### Examples

```javascript
var personnummer = require("personnummer.js");

personnummer.parse("980417+6320", { strict: false, forgiving: false });
/*
{
  valid: true,
  type: 'PERSONNUMMER',
  input: '980417+6320',
  normalised: '189804176320',
  date: 1898-04-17T00:00:00.000Z,
  age: 121,
  gender: 'FEMALE',
  birthplace: 'Värmlands län'
}
*/

personnummer.parse("980417+6320", { strict: true, forgiving: false });
// { valid: false, reason: 'age is too old', input: '980417+6320' }

personnummer.parse("980417+6320", { strict: true, forgiving: true });
/*
{
  valid: true,
  type: 'PERSONNUMMER',
  input: '980417+6320',
  normalised: '199804176320',
  date: 1998-04-17T00:00:00.000Z,
  age: 21,
  gender: 'FEMALE',
  birthplace: undefined
}
*/

personnummer.parse("0411643844");
/*
{
  valid: true,
  type: 'SAMORDNINGSNUMMER',
  input: '0411643844',
  normalised: '200411643844',
  date: 2004-11-04T00:00:00.000Z,
  age: 14,
  gender: 'FEMALE',
  birthplace: undefined
}
*/
```

#### Invalid reasons

Possible reasons the `parse` function could return if personal number is invalid.

| Return         | Reason                                                                      | ex. input        |
| -------------- | --------------------------------------------------------------------------- | ---------------- |
| INPUT_TYPE     | Input type is not string or number.                                         | \[]              |
| FORMAT         | The input personal number is of invalid format.                             | +46-498-xx-34-xx |
| INCORRECT_DATE | The input date is incorrect.                                                | 010143-0987      |
| CHECKSUM       | The personal number is incorrect, checksum of personal number is incorrect. | 050607-4381      |

if `strict` option is enabled:

| Return                      | Reason                                                    | ex. input     |
| --------------------------- | --------------------------------------------------------- | ------------- |
| AGE_SEPARATOR_CONTRADICTION | If the age >= 100 but the separator is '-' or vice versa. | 19181120-1829 |
| BACK_TO_THE_FUTURE          | Personal numbers date is from the future.                 | 20300330-3975 |
| AGE_IS_TOO_OLD              | The age of the personal number is too old.                | 18971224+5472 |

### Corporate Identity Number (CIN)

Note that a CIN in Sweden can be a personal number. This package takes that into account, ex. parsing a valid personal number to this function will return `type:'Enskild firma'` (along with other properties).

#### Description

| Function                         | Description                                                                        |
| -------------------------------- | ---------------------------------------------------------------------------------- |
| **validateCIN(str [, options])** | Checks if the input personal number is a valid Swedish personal number.            |
| **normaliseCIN(str)**            | Normalises the input to the following format. E.g. `802521-6220` -> `168025216220` |
| **parseCIN(str [, options])**    | Parses the personal number and returns an object. See basic usage or examples.     |

#### Returns

| Function                         | Returns                                                                                                               |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **validateCIN(str [, options])** | boolean. true if valid, false if not.                                                                                 |
| **normaliseCIN(str)**            | string, is empty if corporate identity number is not valid                                                            |
| **parseCIN(str [, options])**    | Returns an object with: `valid` (boolean), `input` (string), `normalised` (string), `type` (string). See basic usage. |

#### Invalid reasons

Possible reasons the `parse` function could return if personal number is invalid.

| Return                          | Reason                                                 | ex. input        |
| ------------------------------- | ------------------------------------------------------ | ---------------- |
| INPUT_TYPE                      | Input type is not string or number.                    | \[]              |
| FORMAT                          | The input CIN is of invalid format.                    | +46-498-xx-34-xx |
| GROUP_NUMBER                    | The group number (first of the 10 numbers) is 4        | 426002-7557      |
| ORGANISATIONS_VALIDATION_NUMBER | The CINs 3 and 4 number is &lt; 20                     | 961547-1286      |
| ORGANISATIONS_NUMBER_IDENTIFIER | If the CIN is 12 charachters the first 2 have to be 16 | 13446265-4349    |
| CHECKSUM                        | The CIN is incorrect, checksum of CIN is incorrect.    | 556007-3492      |

#### Examples

```javascript
var personnummer = require("personnummer.js");

personnummer.parseCIN("556007-3495");
/*
{
  valid: true,
  type: 'Aktiebolag',
  input: '556007-3495',
  normalised: '165560073495'
}
*/

personnummer.parseCIN("19870923-7393");
/*
{
  valid: true,
  type: 'Enskild firma',
  input: '19870923-7393',
  normalised: '198709237393',
  date: 1987-09-23T00:00:00.000Z,
  age: 31,
  gender: 'MALE',
  birthplace: 'Kopparbergs län'
}
*/

personnummer.parseCIN("556339-2279");

/*
{
  valid: false,
  reason: 'CHECKSUM',
  input: '556238-2279'
}
*/
```

## Testing

Run `npm test` (make sure you have all devDependencies installed)

## Contributing

See `CONTRIBUTING.md`

## License

[MIT](https://opensource.org/licenses/MIT)
See `LICENSE`
