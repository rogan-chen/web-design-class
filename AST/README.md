## 1. 抽象语法树（Abstract Syntax Tree）

- webpack和lint等工具和库的核心都是通过AST抽象语法树这个概念来实现对代码的检查、分析等操作的
- 通过了解抽象语法树这个概念，你也可以随手编写类似的工具

## 2. 抽象语法树用途

- 代码语法的检查、代码风格的检查、代码格式化、代码高亮、代码错误提示、代码自动补全等等
    - 如JSLint、JSHint对代码错误或者风格的检查，发现一些潜在的错误
    - IDE的错误提示、格式化、高亮、自动补全等等

- 代码混淆压缩
    - UglifyJS2等

- 优化变更代码、改变代码结构达到想要的效果
    - 代码打包工具webpack、rollup等
    - CommonJS、ADM、CMD、UMD等代码规范之间的转化
    - CoffeeScript、TypeScript、JSX等转化为原生JavaScript

## 3. 抽象语法树定义

这些工具的原理都是通过JavaScript Parser把代码转化为一颗抽象语法树，这棵树定义了代码的结构，通过操纵这棵树，我们可以精准的定位到声明语句、赋值语句、运算语句等等。实现对代码的分析、优化、变更等操作

> 在计算机科学中，抽象语法树或者语法树，是源代码的抽象语法结构的树状表现形式，这里特指编程语言的源代码

> JavaScript的语法是为了给开发者更好的编程而设计的，但是不适合程序的理解，所以需要转化为AST来使之更适合程序分析，浏览器编译器一般会把源码转化为AST来进行进一步的分析等其他操作

## 4. JavaScript Parser

- JavaScript Parser，把JS源代码转化为抽象语法树的解析器
- 浏览器器会把JS源码通过解析器转为抽象语法树，在进一步转化为字节码或者直接生成机器码
- 一般来说每个JS引擎都会有自己的抽象语法树格式，Chrome的V8引擎，firefox的SpiderMonkey引擎等等，MDN提供了详细的说明，算是业界标准

#### 4.1 常用的JavaScript Parser

- exprima
- traceur
- acorn
- shift

#### 4.2 esprima

- 通过esprima把源码转化为AST
- 通过extraverse遍历并更新AST
- 通过escodegen将AST重新生成源码
- astexplorer AST的可视化工具

## 5. 转换箭头函数

## 6. 预计算babel插件

## 7. 把类编译成Function

## 8. webpack babel 插件

#### 8.1 实现按需加载

#### 8.2 webpack配置

#### 8.3 babel插件

## 9. AST

#### 9.1 解析过程

#### 9.2 语法单元

#### 9.3 词法分析

#### 9.4 语法分析

#### 9.5 词法分析

## 10. 参考