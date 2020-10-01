/**
 * 实现XMLHttpRequest的功能
 * 
 * 请求报文格式:
 * GET /get HTTP/1.1\r\n
 * Host: 127.0.0.1:8080\r\n
 * Connection: keep-alive\r\n
 * name: zhufeng\r\n
 * age: 11\r\n
 * \r\n
 * {"name": "zhufeng", "age": 11}
 * 
 * 响应报文格式:
 * HTTP/1.1 200 OK\r\n
 * Content-Type: text/plain\r\n
 * Date: Sat, 15 Aug 2020 12:50:53 GMT\r\n
 * Connection: keep-alive\r\n
 * Content-Length: 24\r\n
 * Transfer-Encoding: chunked\r\n
 * \r\n
 * 24\r\n
 * {"name": "zhufeng", "age": 11}
 * 0
 */

// 属于传输层的net模块，用于实现socket通信
const net = require('net');

// 当前所处的状态
const ReadyState = {
    UNSENT: 0, // 代理被创建，但尚未调用 open() 方法。
    OPENED: 1, // open() 方法已经被调用
    HEADERS_RECEIVED: 2, // send() 方法已经被调用，并且头部和状态已经可获得
    LOADING: 3, // 下载中； responseText 属性已经包含部分数据。
    DONE: 4 // 下载操作已完成。
};

class XMLHttpRequest {
    // 请求方法
    method = ''
    // 请求url
    url = ''
    // 主机名
    hostname = ''
    // 端口号
    host = ''
    // 路径
    path = ''

    // 当前所处状态，默认初始化，未调用open方法
    readyState = ReadyState.UNSENT;
    // 请求头，默认长链接
    headers = { 'Content-Type': 'keep-alive' };

    // socket 请求
    socket = null;
    // 响应头
    responseHeaders = []
    // 响应体
    response = ''
    responseText = ''

    // 初始化请求
    open = (method = 'GET', url = '') => {
        this.method = method;
        this.url = url;
        const { hostname, port, path } = require('url').parse(url);
        this.hostname = hostname;
        this.port = port;
        this.path = path;
        this.headers['Host'] = `${hostname}:${port}`;

        // 通过net模块想传输层发起连接
        this.socket = net.createConnection({ hostname, port }, this.connectSuccess);

        // 状态变化
        this.readyState = ReadyState.OPENED;
        this.onreadystatechange && this.onreadystatechange();
    }

    // socket连接成功之后，监听服务器数据
    connectSuccess = () => {
        this.socket.on('data', data => {
            // Buffer转字符串
            const dataString = data.toString();
            const [response, bodyRows] = dataString.split('\r\n\r\n');
            const [statusLine, ...headerRows] = response.split('\r\n');
            const [, status, statusText] = statusLine.split(' ');

            // 响应头数据解析
            this.status = status;
            this.statusText = statusText;
            this.responseHeaders = headerRows.reduce((memo, row) => {
                const [key, value] = row.split(': ');
                memo[key] = value;
                return memo;
            }, {});

            // 状态变化
            this.readyState = ReadyState.HEADERS_RECEIVED;
            this.onreadystatechange && this.onreadystatechange();

            this.readyState = ReadyState.LOADING;
            this.onreadystatechange && this.onreadystatechange();

            // 响应体数据解析
            let body = '';
            if (this.headers['Transfer-Encoding'] === 'chunked') {
                /**
                 * 分块传输的响应报文:
                 * 内容长度\r\n
                 * 内容\r\n
                 * 结束标志
                 */
                [, body,] = bodyRows.split('\r\n');
            } else {
                body = bodyRows;
            }
            this.response = this.responseText = body;

            this.readyState = ReadyState.DONE;
            this.onreadystatechange && this.onreadystatechange();
            this.onload && this.onload();
        });
    }

    // 设置请求头
    setRequestHeader = (key, value) => {
        this.headers[key] = value;
    }

    /**
     * 根据key获取指定的响应头信息
     * @returns string
     */
    getResponseHeader = key => this.responseHeaders[key]

    /**
     * 获取所有的响应头数据
     * @returns string
     */
    getAllResponseHeaders = () => this.responseHeaders

    // 发送请求
    send = (body = '') => {
        let requestRows = [];
        // 请求行: GET /get HTTP/1.1
        requestRows.push(`${this.method} ${this.url} HTTP/1.1`);
        if (body.length > 0) {
            //告诉 服务器请求体的字节长度
            this.headers['Content-Length'] = Buffer.byteLength(body);
        }
        // 请求头: Host: 127.0.0.1:8080
        requestRows.push(...Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`));
        // 完整的请求报文
        const requestMessage = requestRows.join('\r\n') + '\r\n\r\n' + body
        // 写入数据
        this.socket.write(requestMessage);
    }
}

module.exports = XMLHttpRequest;