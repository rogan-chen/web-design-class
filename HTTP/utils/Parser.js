/**
 * 使用状态机来解析请求,获取到请求行 请求头 请求体
 * 数据传输的是流式的不连续的，而且可能很大
 * 所以需要边拼接数据边解析数据
 */

// 根据ASCII码转换
const LF = 10,//换行 Line Feed
    CR = 13,//回车  Carriage Return
    SPACE = 32,//空格
    COLON = 58;//冒号

// 当前状态
const INIT = 0, // 初始化状态
    START = 1, // 开始解析请求报文
    REQUEST_LINE = 2, // 开始解析请求行
    HEADER_FIELD_START = 3, // 开始解析请求头部key
    HEADER_FIELD = 4, // 解析完请求头部key
    HEADER_VALUE_START = 5, // 开始解析请求头部value
    HEADER_VALUE = 6, // 解析完请求头部value
    BODY = 7; // 解析Body数据

class Parser {
    constructor() {
        this.state = INIT;
    }
    parse(buffer) {
        let self = this,
            requestLine = '', // POST /post HTTP/1.1
            headers = {}, // {Host: 127.0.0.1:8080}
            body = '', // {"name":"zhufeng","age":11}
            i = 0, // 解析的下标
            char, // 当前解析的字符
            headerField = '', // 头部key
            headerValue = ''; // 头部value
        let state = START;
        for (i = 0; i < buffer.length; i++) {
            char = buffer[i];
            switch (state) {
                case START:
                    state = REQUEST_LINE;
                    self['requestLineMark'] = i;//记录一下请求行开始的索引
                case REQUEST_LINE:
                    if (char === CR) {
                        requestLine = buffer.toString('utf8', self['requestLineMark'], i);
                        break;
                    } else if (char === LF) {
                        state = HEADER_FIELD_START;
                    }
                    break;
                case HEADER_FIELD_START:
                    if (char == CR) {
                        //如果是这样的,说明下面该读请求体了
                        state = BODY;
                        self['bodyMark'] = i + 2;
                    } else {
                        state = HEADER_FIELD;
                        self['headerFieldMark'] = i;
                    }
                case HEADER_FIELD:
                    if (char === COLON) {//如果遇到冒号
                        headerField = buffer.toString('utf8', self['headerFieldMark'], i);
                        state = HEADER_VALUE_START;
                    }
                    break;
                case HEADER_VALUE_START:
                    if (char === SPACE) {
                        break;
                    }
                    self['headerValueMark'] = i;
                    state = HEADER_VALUE;
                case HEADER_VALUE:
                    if (char === CR) {
                        headerValue = buffer.toString('utf8', self['headerValueMark'], i);
                        headers[headerField] = headerValue;
                        headerField = headerValue = '';
                    } else if (char === LF) {
                        state = HEADER_FIELD_START;
                    }
                    break;

            }
        }
        let [method, url] = requestLine.split(' ');
        body = buffer.toString('utf8', self['bodyMark']);
        return { method, url, headers, body }
    }
}

module.exports = Parser;