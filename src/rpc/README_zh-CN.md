# AaJS RPC 支持

| 特性             | alova                | fetch (原生)               | axios             |
|----------------|----------------------|--------------------------|-------------------|
| **类型**         | 高阶请求库 (基于 fetch/XHR) | 浏览器原生 API                | 第三方 HTTP 库        |
| **设计目标**       | 专注数据交互优化和状态管理        | 基础网络请求                   | 功能完整的 HTTP 客户端    |
| **自动 JSON 处理** | √                    | × (需手动 `.json()`)        | √                 |
| **请求取消**       | √ (支持所有请求模式)         | √ (通过 `AbortController`) | √ (`CancelToken`) |
| **拦截器**        | √ (全局/局部)            | × (需手动封装)                | √                 |
| **缓存策略**       | √ (内存/持久化缓存, 自动失效)   | ×                        | × (需手动实现)         |
| **SSR 支持**     | √                    | √                        | √                 |
| **体积**         | ~10KB (gzipped)      | 0KB (内置)                 | ~4KB (gzipped)    |
| **TypeScript** | √ 完善支持               | √ (需额外类型定义)              | √                 |

| 高级功能        | alova                | fetch     | axios   |
|-------------|----------------------|-----------|---------|
| **智能缓存**    | √ 多级缓存策略             | ×         | ×       |
| **数据预加载**   | √ 提前加载下一页数据          | ×         | ×       |
| **自动重试**    | √ 可配置重试逻辑            | ×         | × (需插件) |
| **乐观更新**    | √ 自动处理 UI 状态         | ×         | ×       |
| **请求共享**    | √ 相同请求自动去重           | ×         | ×       |
| **分页管理**    | √ 内置分页状态维护           | ×         | ×       |
| **文件上传进度**  | ×                    | ×         | √       |
| **CSRF 防御** | ×                    | × (需手动实现) | √       |
| **浏览器兼容性**  | √ IE11+ (需 polyfill) | × 仅现代浏览器  | √ IE11+ |

## Axios 方法和全局配置

| **Axios**                       | 描述                  | 示例                                                                       |
|---------------------------------|---------------------|--------------------------------------------------------------------------|
| `.request(config)`              | 通用请求方法              | ```js axios.request({ method: 'get', url: '/api' })```                   |
| `.get(url[, config])`           | GET 请求              | ```js axios.get('/api', { params: { id: 1 } })```                        |
| `.post(url[, data[, config]])`  | POST 请求             | ```js axios.post('/api', { name: 'John' })```                            |
| `.put(url[, data[, config]])`   | PUT 请求              | ```js axios.put('/api/1', { name: 'John Doe' })```                       |
| `.patch(url[, data[, config]])` | PATCH 请求            | ```js axios.patch('/api/1', { age: 30 })```                              |
| `.delete(url[, config])`        | DELETE 请求           | ```js axios.delete('/api/1')```                                          |
| `.head(url[, config])`          | HEAD 请求             | ```js axios.head('/api')```                                              |
| `.all(iterable)`                | 并行请求，类似 promise.all | ```js axios.all([axios.get(), axios.get()])```                           |
| `.spread(callback)`             | 异步响应解构              | ```js .then(axios.spread((user, posts) => {}))```                        |
| `.create(config)`               | 创新自定义实例             | ```js const instance = axios.create({ baseURL: 'https://luexu.com' })``` |

### 全局配置

```
axios.defaults.baseURL = 'https://api.example.com';
axios.defaults.headers.common['Authorization'] = 'Bearer xxx';
axios.defaults.timeout = 1000;


// 请求拦截器
axios.interceptors.request.use(config=>{
    config.headers.Authorization = 'Bearer token'
    return config
})

// 响应拦截器
axios.interceptors.response.use(response=>{
    return response.data
}, err=>{
    return Promise.reject(err)
)

// 取消请求
const ctrl = new AborController()
axios.get('/user', {
  signal: ctrl.signal
}).catch(error => {
  if (axios.isCancel(error)) {
    console.log('Request canceled')
  }
})
ctrl.abort()
```

## Alova 方法和全局配置

### 基础请求方法

| 方法       | 说明       | 示例                                    |
|----------|----------|---------------------------------------|
| `Get`    | GET请求    | `alovaInstance.Get('/api')`           |
| `Post`   | POST请求   | `alovaInstance.Post('/api', data)`    |
| `Put`    | PUT请求    | `alovaInstance.Put('/api/1', data)`   |
| `Patch`  | PATCH请求  | `alovaInstance.Patch('/api/1', data)` |
| `Delete` | DELETE请求 | `alovaInstance.Delete('/api/1')`      |

### 请求状态管理

| 方法/属性        | 说明        | 示例                                                        |
|--------------|-----------|-----------------------------------------------------------|
| `useRequest` | 发送请求并管理状态 | `const { data } = useRequest(method)`                     |
| `loading`    | 加载状态      | `const { loading } = useRequest(method)`                  |
| `data`       | 响应数据      | `const { data } = useRequest(method)`                     |
| `error`      | 错误信息      | `const { error } = useRequest(method)`                    |
| `send`       | 手动发送请求    | `const { send } = useRequest(method, {immediate: false})` |
| `abort`      | 中止请求      | `const { abort } = useRequest(method)`                    |

### 高级请求模式

| 方法              | 说明   | 示例                                                                |
|-----------------|------|-------------------------------------------------------------------|
| `parallel`      | 并行请求 | `useRequest(parallel([method1, method2]))`                        |
| `serial`        | 串行请求 | `useRequest(serial([()=>method1, res=>method2]))`                 |
| `usePagination` | 分页请求 | `const { next } = usePagination((page)=>Get('/list?page='+page))` |

### 缓存管理

| 方法            | 说明   | 示例                                     |
|---------------|------|----------------------------------------|
| `setCache`    | 设置缓存 | `alovaInstance.storage.set(key, data)` |
| `getCache`    | 获取缓存 | `alovaInstance.storage.get(key)`       |
| `removeCache` | 删除缓存 | `alovaInstance.storage.remove(key)`    |

### 全局配置

| 配置项             | 说明    | 示例                                      |
|-----------------|-------|-----------------------------------------|
| `baseURL`       | 基础URL | `createAlova({baseURL:'/api'})`         |
| `timeout`       | 超时时间  | `createAlova({timeout:10000})`          |
| `beforeRequest` | 请求拦截  | `createAlova({beforeRequest: ()=>{} })` |
| `responded`     | 响应拦截  | `createAlova({responded: ()=>{} })`     |

### 事件监听

| 方法          | 说明   | 示例                                        |
|-------------|------|-------------------------------------------|
| `onRequest` | 请求监听 | `alovaInstance.onRequest((method)=>{})`   |
| `onRespond` | 响应监听 | `alovaInstance.onRespond((response)=>{})` |
| `onError`   | 错误监听 | `alovaInstance.onError((error)=>{})`      |

### 实用工具

| 方法         | 说明     | 示例                                                                  |
|------------|--------|---------------------------------------------------------------------|
| `update`   | 手动更新数据 | `const { update } = useRequest(); update(data=>[...data, newItem])` |
| `force`    | 强制重新请求 | `const { force } = useRequest(); force()`                           |
| `debounce` | 防抖配置   | `useRequest(method, {debounce:300})`                                |

## TanStack Query 方法和全局配置

### 核心查询方法

| 方法/属性              | 说明                                     |
|--------------------|----------------------------------------|
| `useQuery`         | 基础查询方法，用于GET请求和数据缓存                    |
| `useInfiniteQuery` | 无限滚动/分页查询专用方法                          |
| `useQueries`       | 并行多个查询                                 |
| `queryKey`         | 数组形式的查询唯一标识符，如`['todos', { page: 1 }]` |
| `queryFn`          | 实际执行数据获取的函数                            |
| `staleTime`        | 数据保鲜时间（毫秒），默认`0`                       |
| `gcTime`           | 缓存保留时间（毫秒），默认`5*60*1000`（5分钟）          |

### 数据变更方法

| 方法/属性         | 说明                       |
|---------------|--------------------------|
| `useMutation` | 数据变更操作（POST/PUT/DELETE等） |
| `mutate`      | 触发变更操作的函数                |
| `mutateAsync` | 返回Promise的变更函数           |
| `onMutate`    | 变更前的回调，常用于乐观更新           |
| `onSuccess`   | 变更成功回调                   |
| `onError`     | 变更失败回调                   |
| `onSettled`   | 变更完成回调（无论成功失败）           |

### 缓存管理方法

| 方法                                         | 说明           |
|--------------------------------------------|--------------|
| `queryClient.getQueryData(queryKey)`       | 获取指定查询的缓存数据  |
| `queryClient.setQueryData(queryKey, data)` | 手动设置查询缓存数据   |
| `queryClient.invalidateQueries(queryKey)`  | 使缓存失效并可选重新获取 |
| `queryClient.refetchQueries(queryKey)`     | 强制重新获取指定查询   |
| `queryClient.cancelQueries(queryKey)`      | 取消进行中的查询     |
| `queryClient.removeQueries(queryKey)`      | 完全移除查询缓存     |
| `queryClient.prefetchQuery(options)`       | 预加载数据到缓存     |

### 状态标识

| 状态属性         | 说明                  |
|--------------|---------------------|
| `isLoading`  | 首次加载中（无缓存数据时）       |
| `isFetching` | 任何请求进行中（包括后台刷新）     |
| `isError`    | 查询失败状态              |
| `isSuccess`  | 查询成功状态              |
| `isPending`  | Mutation进行中状态（v5新增） |
| `isIdle`     | Mutation初始状态（v5新增）  |

### 分页查询专用

| 方法/属性                    | 说明       |
|--------------------------|----------|
| `fetchNextPage`          | 获取下一页数据  |
| `fetchPreviousPage`      | 获取上一页数据  |
| `hasNextPage`            | 是否存在下一页  |
| `hasPreviousPage`        | 是否存在上一页  |
| `isFetchingNextPage`     | 下一页获取中状态 |
| `isFetchingPreviousPage` | 上一页获取中状态 |

### 开发工具

| 组件/方法                     | 说明           |
|---------------------------|--------------|
| `ReactQueryDevtools`      | 可视化调试工具组件    |
| `queryClient.getLogger()` | 获取查询日志（开发环境） |