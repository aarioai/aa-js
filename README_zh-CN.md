# aa-js 说明

AaJS 是基于 airis Go 框架后端代码的前端调用SDK，主要服务于调用 airis Go Restful API接口。

## 调用结构

```
aa (include aa/env)

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