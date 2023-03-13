

npm, yarn 构建
出现 react 多实例依赖错误
参考: https://zhuanlan.zhihu.com/p/363288266

主要是安装 uim-react 时，其 node_modules 中 多安装了一份 react

pnpm 没有错误，因为合并了版本


### nextjs 下如何 url 导入 png.


### 发消息调通

### 布局 split. 有没有轻量级方案


### 如果不隔离 cjs, esm 打包，scss 文件不会被 postcss 内联


### emoji-data 中的多语言 json 文件，在打包后不能被加载, 打包时要设置什么？




# 打包问题总结

## stream-chat 
### CSS 打包方式：
没有内嵌 CSS, CSS采用额外模块独立构建，缺点是不太容易结合代码做无用样式剔除.

### 输出
只打了 cjs 包，esm的直接 tsc
#### 优点:
支持高效的热更新

#### 缺点:
module模式，自身不做样式预处理, 导致依赖时找不到样式出错

## 腾讯云tim
### CSS 打包方式
SCSS内嵌, 用 postcss 进行预处理压缩合并

### 输出
没有参考 stream-chat, 分成了 cjs 和 esm 两种情况

#### 优点
对 image, css 都完成了自动打包

#### 缺点
热更新开发的情况下，rollup -w -c 的反应稍微有点慢. 


## 总结
### CSS 打包方式
参考腾讯云，结合起来比较方便

### 输出
参考腾讯云, 分为 cjs 和 esm.
备注: 这里为了方便，临时改成直接用源代码依赖.


碰到问题
### @babel/runtime 插入到 esm 文件会导致浏览器报错



### ESM packages need to be imported
参考: https://nextjs.org/docs/messages/import-esm-externals
#### 错误出现原因
Packages in node_modules that are published as EcmaScript Module, need to be imported via import ... from 'package' or import('package').

You get this error when using a different way to reference the package, e. g. require().

#### 如何修复
1. Use import or import() to reference the package instead. (Recommended)
2. If you are already using import, make sure that this is not changed by a transpiler, e. g. TypeScript or Babel.
3. Switch to loose mode (experimental.esmExternals: 'loose'), which tries to automatically correct this error.

目前是在 rollup.config.js 中把对应的包移到 external 中.


#### 打包还有点小瑕疵
dts 会把 index.css 也生成多一份 index.d.css



### 消息失败状态显示


删除
重发


### 发送图片消息

