/**
 * 创建一个tcp服务器,每当有客户端来连接了,就会为他创建一个socket
 */

const net = require('net');
const Parser = require('./utils/Parser');

const server = net.createServer(socket => {
    // socket连接成功之后，监听数据
    socket.on('data', data => {
        // 解析请求报文
        const request = data.toString();
        const [requestLine, ...headerRows] = request.split('\r\n');
        const [method, url] = requestLine.split(' ');
        const headers = headerRows.slice(0, -2).reduce((memo, row) => {
            let [key, value] = row.split(': ');
            memo[key] = value;
            return memo;
        }, {});

        // 构建响应报文
        let body = '';
        const rows = [];
        if (method.toLowerCase() === 'get') {
            body = 'TCP响应get请求';
        } else if (method.toLowerCase() === 'post') {
            // TODO
            const parser = new Parser();
            body = `TCP响应post请求 ${parser.parse(data).body}`;
        }
        rows.push(`HTTP/1.1 200 OK`);
        rows.push(`Content-Type: text/plain`);
        rows.push(`Date: ${new Date().toGMTString()}`);
        rows.push(`Connection: keep-alive`);
        rows.push(`Transfer-Encoding: chunked`);
        //返回body字符串的字节长度 一般body.length
        rows.push(`Content-Length: ${Buffer.byteLength(body)}`);
        rows.push(`\r\n${Buffer.byteLength(body).toString(16)}\r\n${body}\r\n0`);
        const responseMessage = rows.join('\r\n');
        socket.end(responseMessage);
    });
});

server.listen(8080);