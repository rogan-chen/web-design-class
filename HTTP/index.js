const http = require('http'); // 应用层HTTP模块
const fs = require('fs');
const path = require('path');
const url = require('url');

// 创建HTTP服务器
const server = http.createServer((req, res) => {
    const { pathname } = url.parse(req.url);

    if (['/get.html', '/post.html'].includes(pathname)) {
        // 设置响应头
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');

        /**
         * 同步模式读取文件内容
         * 
         * fileName: get.html/post.html
         */
        const fileName = path.join(__dirname, 'static', pathname.slice(1));
        const content = fs.readFileSync(fileName);

        // 向客户端返回响应并结束响应
        // res.end(content);
        res.write(content);
        res.end();
    } else if (pathname === '/get') {
        // 响应get请求
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('服务器响应get请求');
    } else if (pathname === '/post') {
        // 响应post请求
        const buffers = []; // tcp传输的时候,有可能会分包.客户给服务器发10M 可能分成10次发送,每次发1M
        //on data得到的只有请求体
        req.on('data', (data) => {
            buffers.push(data)
        });
        //Buffer是一个类,类似于字节数组
        req.on('end', () => {
            res.statusCode = 200;
            const body = Buffer.concat(buffers);
            res.setHeader('Content-Type', 'text/plain');
            res.end('服务器响应post请求' + body.toString());
        });
    } else {
        res.statusCode = 404;
        res.end();
    }
});

// 监听8080端口
server.listen(8080);