# aa-ts 说明文档

AaJS 一个优雅调用 Restful API 的库，包括路由自动填充、鉴权、防抖、限流、自动重试、token过期自动更新等功能。

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
aa <- aa/dynamics <-- aa/aconfig <-- aa/atype

aa <- aa/atype
aa <- aa/format <-- aa/atype
aa <- aa/translate <-- aa/format


aa <- aa/browser   
aa <- aa/env <-- aa/brower
aa <-- aa/atype <- aa/aconfig
aa <- aa/base    


```

```
aa 

arrays <-- aa

aerror <-- aa

alog <-- aerror <-- aa
```

