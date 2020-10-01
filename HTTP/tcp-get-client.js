const XMLHttpRequest = require('./utils/xhr');
const xhr = new XMLHttpRequest();

// 状态改变时执行
xhr.onreadystatechange = () => {
    console.log('onreadystatechange', xhr.readyState);
}
xhr.open('GET', 'http://localhost:8080/get');
// 设置请求头
xhr.setRequestHeader('name', 'zhufeng');
xhr.setRequestHeader('age', 11);
// 请求加载后执行
xhr.onload = () => {
    console.log('readyState', xhr.readyState);
    console.log('status', xhr.status);
    console.log('statusText', xhr.statusText);
    console.log('getAllResponseHeaders', xhr.getAllResponseHeaders());
    console.log('response', xhr.response);
}
// 发送请求
console.log('TCP发起get请求');
xhr.send();