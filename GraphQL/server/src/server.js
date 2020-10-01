/** 
 * @Author: Rogan
 * @Date: 2020-10-01
 * @Description: express实现GraphQL功能
 */

const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors'); // 解决跨域问题
const schema = require('./schema'); // 模型
const app = express();

// 使用跨域中间件
app.use(cors({
    origin: 'http://localhost:3000',//允许哪个客户端跨域访问
    methods: "GET,PUT,POST,DELETE,OPTIONS"//允许的方法名
}));

// 使用GraphQL中间件
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true, // 查询工具
}))

// 监听端口并启动服务
app.listen(4000, () => console.log('服务器在4000端口中启动'))