# 用 create-react-app 脚手架创建的 React 项目

- 已通过 ejest 暴露过 webpack 配置文件
- 删除原测试相关文件, 简化目录

### 关于 less

**已安装并在 webpack 中配置 less**

> 由于脚手架创建的项目, 使用的 webpack 版本为 4.X, 最新版的 less-loader 依赖 webpack 5.X 版本, 不兼容,
> 因此该项目将 less-loader 版本降至@6.2.0 (6.0 最终版,也不算很老)

### 关于代理

由于`http-proxy-middleware`插件使用较新版本, 配置文件写法需要注意:

```js
// const proxy = require('http-proxy-middleware'); 仅适用 0.x版本
const { createProxyMiddleware } = require('http-proxy-middleware');
// app.use 使用createProxyMiddleware
```

### 已安装库

除了脚手架创建时安装的模块以外, 给项目安装了模块如下:

- antd
- moment
- axios
- lodash
- styled-components
- @ligua/lugia-web 暂时用不了

### 脚本

`yarn start` 项目启动命令, 自带 webpack-server 有热更新  
`yarn build` 打包命令  
`yarn test` 运行测试(暂无测试文件, 没用到)

### 根目录文件说明

```sh
# 不包含目录
.
├── README.md # readme
├── React-App.code-workspace # vscode工作区文件,用于单个工作区关联多文件夹,这里可以用这个文件快速打开vscode项目
├── lugia.config.js # lugia-web 必要配置文件
├── package.json # 包管理文件
├── src
│   └── setupProxy.js # 本地代理配置文件
└── yarn.lock # 版本锁,自动生成,本项目可删
```
