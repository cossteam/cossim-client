# 目录结构

```json
|-node_modules                      // 依赖包
|-public                            // 静态资源目录
|-build                             // 打包移动端端文件夹，
|  |-platforms                      // 打包后存放 android ios 目录
|  |-www                            // 项目打包后源文件
|  |-config.xml                     // 项目配置文件
|  |-build.js                       // 打包脚本
|-electron                          // electron 项目目录
|-src                               // 项目源码
|-package.json                      // 项目配置文件
|-README.md                         // 项目说明文件
```

# 命名规范

1. 所有模块都应该使用驼峰命名法，如 `index.js`、`App.jsx`、`AppPage.vue` 等。
2. 所有组件都应该使用 PascalCase 命名法，如 `HelloWorld.jsx` 等。

# 项目结构

```json
|-src                               // 项目源码
|  |-assets                         // 静态资源
|  |-components                     // 组件
|  |-pages                          // 页面
|  |-config                         // 项目配置目录
|  |-store                          // 状态管理
|  |-utils                          // 工具库
|  |-App.jsx                        // 入口文件
|  |-index.js                       // 入口文件
```

# Git 提交规范

- fix: 修复 bug
- feat: 新功能
- docs: 文档
- style: 格式
- refactor: 重构
- perf: 性能优化
- test: 测试
- build: 构建
- ci: 持续集成
- chore: 其他修改

# 国际化规范

- json：一个中文 key 对应其他语言的 value


