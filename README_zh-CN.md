# aa-js 说明文档

AaJS 是基于 airis Go 框架后端代码的前端调用SDK，主要用于同步后端类型、枚举值，以及快捷调用 airis Go Restful API接口。

* aa
    * atype
        * aerror - AError 类相关类和处理方法
        * arrays - 数组相关处理方法
        * decimal - Decimal 类相关类及处理方法
        * maps - 处理 Map, MapObject 等相关类方法
        * promises - 处理 Promise 相关类的方法
        * strings - 处理字符串的方法
        * xxx.ts - 其他atype通用方法
    * base - 基础函数
    * browser - 浏览器相关方法
    * env - AConfig 全局配置类及环境相关配置和处理方法
    * format - 格式化字符串、数组、对象相关方法
    * translate - 翻译相关方法
    * xxx.ts - 其他aa通用方法
* alog - 日志相关方法
* crypto - 加密、编码相关方法
* maths - 数学计算相关方法
* urls - URL 处理相关方法

若某个目录下存在子目录，则该目录下就不能再直接出现js/ts脚本了，应该使用不同子目录。各子目录间可以相互调用。

## 调用结构

inside aa

```
aa <- aa/atype <-- aa/base 
aa <- aa/format <-- aa/atype
aa <- aa/translate <-- aa/format


aa <- aa/browser   
aa <- aa/env <-- aa/brower
aa <-- aa/atype <- aa/env
aa <- aa/base    


```

```
aa 

arrays <-- aa

aerror <-- aa

alog <-- aerror <-- aa
```

## tsdown 说明

tsdown 是基于 rolldown 专门为简化 typescript 而开发的开箱即用工具

https://tsdown.dev/zh-CN/guide/

```shell
# https://tsdown.dev/zh-CN/options/output-directory
tsdown -d ./dist # 指定输出目录（默认 ./dist）

# https://tsdown.dev/zh-CN/options/output-format
tsdown --format esm # 指定输出格式，默认 esm

tsdown --minify # 压缩

tsdown --silent # 屏蔽非错误日志
```

## jest

```
expect(a).toMatch(b:RegExp)  // b.test(a)
expect(a:Set).toContain(b)  // a.contains(b)   a = new Set([])
expect(()=>a()).toThrow(t?:[string|Error|TypeError|RegExp])

expect(a).toEqual(b)  // 深度比较 a == b，一般适用对象、数组
expect(a).toBe(b)   // a === b
expect(a).toBeGreaterThan(b)  // a>b
expect(a).toBeGreaterThanOrEqual(b)  // a>=b
expect(a).toBeLessThan(b)  // a<b
expect(a).toBeLessThanOrEqual(b)  // a<=b
expect(a).toBeNull()
expect(a).toBeDefined()
expect(a).toBeUndefined()
expect(a).toBeTruthy()
expect(a).toBeFalsy()
```