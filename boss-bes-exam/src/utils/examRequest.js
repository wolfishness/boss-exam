import axios from 'axios';

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    baseURL: 'http://172.16.100.95:10003/boss-bes-exam-center/api/',
  // baseURL: 'http://192.168.1.188:10003/boss-bes-exam-center/api/',
    // baseURL: 'http://www.lujinshan.top:8015/boss-bes-exam-center/api/',
    timeout: 120000
})

//request拦截器
service.interceptors.request.use( config => {
    return config;
}, error => {
    console.log(error);
    return Promise.reject();
})

//request拦截器
service.interceptors.response.use(response => {
    if(response.status === 200){
        return response.data;
    }else{
        Promise.reject();
    }
}, error => {
    console.log(error);
    return Promise.reject();
})


export default service;
