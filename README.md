# aa.js  AaGo 后端 JS SDK

A Javascript SDK of AaGo

这里要依赖于抽象，而不具体实现。实现尽量通过外部注入。

[code style guide](https://github.com/aarioai/aa-js/blob/main/code_style_guide.md)

## Entry

* aa = new Aa()

## global variables

### prototype

| prototype           | description |
|---------------------|-------------|
| String.replaceAll() |             |

### type caster functions

| name       | results          | throw      | description                                                          |
|------------|------------------|------------|----------------------------------------------------------------------|
| aerror()   | AError           |            | alias to new AError()                                                | 
| array()    | array            |            |                                                                      |
| bool()     | boolean          |            |                                                                      |
| booln()    | number           |            | 0 on false; 1 on true                                                |
| date()     | time             |            | <YY-MM-DD> compare with types.date()                                 |
| datetime() | time             |            | <YYY-MM-DD HH:II:SS> compare with types.datetime()                   |
| decimal()  | Decimal          |            | alias to new Decimal()                                               |
| float32()  | number           |            |                                                                      |
| float64()  | number           |            |                                                                      |
| func()     | function         |            |                                                                      |
| int8()     | number           | RangeError | integer in range [-128, 127]                                         |
| int16()    | number           | RangeError | integer in range [-32768, 32767]                                     |
| int24()    | number           | RangeError | integer in range [-8388608, 8388607]                                 |
| int32()    | number           | RangeError | integer in range [-2147483648, 2147483647]                           |
| int54()    | number           | RangeError | integer in range [Number.MIN_SAFE_INTEGER+1,Number.MAX_SAFE_INTEGER] |
| uint8()    | number           | RangeError | integer in range [0, 255]                                            |
| uint16()   | number           | RangeError | integer in range [0, 65535]                                          |
| uint24()   | number           | RangeError | integer in range [0, 16777215]                                       |
| uint32()   | number           | RangeError | integer in range [0, 4294967295]                                     |
| uint64()   | string           | RangeError |                                                                      |
| money()    | Money            |            | alias to new Money()                                                 |
| number()   | number           |            |                                                                      |
| percent()  | Percent          |            | alias to new Percent()                                               |
| string()   | string           |            |                                                                      |
| struct()   | {[key:string]:*} |            |                                                                      |
| vmoney()   | VMoney           |            | alias to new VMoney()                                                |

### constants

| name           | type       | description                                                               |
|----------------|------------|---------------------------------------------------------------------------|
| aparam         | struct     | Keep-names of URL parameters                                              |
| AErrorEnum     |            |                                                                           |
| BREAK          | string     | a signal from callback function to break forEach((value,key)) iterator    |
| CONTINUE       | void       | return CONTINUE in a loop is not important, but better for people to read |
| nif            | function   | nil function, a function does nothing                                     |
| nip            | Promise    | nil Promise, a promise does nothing                                       |
| MAX            | string     | a global parameter to indicate passed a MAX value                         |
| MIN            | string     | a global parameter to indicate passed a MIN value                         |
| OPTIONAL       | boolean    | a global parameter to indicate passed a optional value                    |
| REQUIRED       | boolean    | equal to !OPTIONAL                                                        |
| -------------  | ---------- | ------------------------------------------------------------------------  |
| AaFileTypeEnum |            |                                                                           |
|                |            |                                                                           |

### global functions

| name           | return          | description                                   |
|----------------|-----------------|-----------------------------------------------|
| asleep()       | Promise         | a promise sleep for a while                   |
| defval()       | any except null | Return defined value                          |
| eq()           | boolean         | equal or is empty                             |
| forever()      |                 | run forever                                   |
| len()          | number          | length of anything                            |
| loge()         |                 | alias to new log().println()                  |
| ne()           | boolean         | not equal or not empty                        |
| not()          | boolean         | same to !something                            |
| once()         |                 | retry until ready                             |
| Round()        |                 |                                               |
| RoundTrim()    |                 | Trim the tail                                 |
| RoundAway()    |                 | Round away from the origin point              |
| RoundReverse() |                 |                                               |
| trycall()      |                 | try call a method if the method is a function |

### global classes

| name              | type      | description                           |
|-------------------|-----------|---------------------------------------|
| AaLock            |           | a simple lock                         |
| atype             | static    | types detector                        |
| AaLoggerStyle     |           |                                       |
| log               |           |                                       |
| panic             | static    | assert/panic                          |
| ---------------   | --------- | ------------------------------------- |
| [AaEnv]           | private   | use `aa.env` instead                  |
| AError            |           | Error with code                       |
| fmt               | static    | format                                |
| htmls             | static    | handle HTML elements                  |
| map               |           | a map struct                          |
| mathn             | static    | normal mathematics                    |
| maths             | static    | special mathematics                   |
| paths             | static    | handle paths                          |
| strings           | static    | handle strings                        |
| time              |           | handle date and time                  |
| [TimeDiff]        |           | use `aa.timeDiff()` instead           |
| Decimal           |           |                                       |
| Money             |           |                                       |
| Percent           |           |                                       |
| VMoney            |           |                                       |
| ---------------   | --------- | ------------------------------------- |
| [AaArchive]       |           | use `aa.archive()` instead            |
| [AaRegistry]      |           | use `aa.registry()` instead           |
| [AaCookieStorage] |           | use `aa.storage()` instead            |
| [AaStorageEngine] |           | use `aa.storage()` instead            |
| [AaStorageFactor] |           | use `aa.storage()` instead            |
| [AaCache]         |           | use `aa.cache()` or `aa.db()` instead |
| [AaURI]           |           | use `aa.url()` or `aa.URI` instead    |
| [AaValidator]     |           | use `aa.validator()` instead          |
| ---------------   | --------- | ------------------------------------- |
| [AaRawFetch]      |           | use `aa.fetch()` instead              |
| [AaScrollEvent]   |           | use `aa.scrollEvent` instead          |
| [AaAuth]          |           | use `aa.auth` instead                 |
| [AaAuthOpenid]    |           | use `aa.openidAuth` instead           |
| [AaFetch]         |           | use `aa.fetch()` instead              |
| [AaOSS]           |           | use `aa.oss` instead                  |
| [AaAudioSrc]      |           | use `aa.audioSrc` instead             |
| [AaFileSrc]       |           | use `aa.fileSrc` instead              |
| [AaImgSrc]        |           | use `aa.imgSrc` instead               |
| [AaVideoSrc]      |           | use `aa.videoSrc` instead             |
| ---------------   | --------- | ------------------------------------- |
| [AaAccount]       |           | use `aa.account` instead              |
| [AaEditor]        |           | use `aa.editor` instead               |
| [Aa]              |           | use `aa` instead                      |

### extended methods

| name             | return  | description                         |
|------------------|---------|-------------------------------------|
| Promise.asleep() | Promise | make this promise sleep for a while |