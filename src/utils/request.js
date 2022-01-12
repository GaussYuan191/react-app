import axios from "axios";
import store from "@/store";
import { isAuthenticated } from '@/utils/auth'
import loginOut from "@/utils/loginOut"
import { message, Space } from 'antd';
//创建axios实例
const service = axios.create({
    timeout: 15000
})
const {mine : {user}} = store.getState()



// request拦截器
service.interceptors.request.use(config => {
    console.log("发起请求",config, user.token);
    // 判断请求中是否携带token
    if (isAuthenticated) {
      config.headers['Authorization'] = user.token;
    } 
    return config;
}, error => {
    // 错误处理
    console.log(error);
    Promise.reject(error);
})

// respone拦截器

service.interceptors.response.use(
    response => {
      /**
       * code为非200是抛错 可结合自己业务进行修改
       */
      const res = response.data
      
      if (res.code == null) {
        
        return Promise.reject('error')
      } else {
        return Promise.resolve(response.data.data)
      }
    },
    error => {
      const err = error.response;
      console.log('请求失败，请求状态码' +err.status)
      if (err.status === 401) {
        message.error('登录失效，请重新登录！！');
        loginOut();
      }
      
      
    //   Message({
    //     message: error.message,
    //     type: 'error',
    //     duration: 3 * 1000
    //   })
      return Promise.reject(error)
    }
  )

export default service;