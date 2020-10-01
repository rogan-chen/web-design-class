const XMLHttpRequest = require('./utils/xhr');
const xhr = new XMLHttpRequest();
xhr.onreadystatechange = () => {
    console.log('onreadystatechange', xhr.readyState);
}
xhr.open('POST', 'http://localhost:8080/post');
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.onload = () => {
    console.log('readyState', xhr.readyState);
    console.log('status', xhr.status);
    console.log('statusText', xhr.statusText);
    console.log('getAllResponseHeaders', xhr.getAllResponseHeaders());
    console.log('response', xhr.response);
}
console.log('TCP发起post请求');
xhr.send('{"name":"zhufeng","age":11}');