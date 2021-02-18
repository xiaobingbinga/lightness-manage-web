import axios from 'axios'
import qs from 'qs'
import {Message} from "element-ui";
import store from "./store";

axios.defaults.baseURL = 'http://www.qingying.com:8080/api'

axios.defaults.timeout = 10000

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// 跨域请求是否需要带上凭证cookie JSESSIONID
// axios.defaults.withCredentials = true

// axios.defaults.headers.common['Authorization'] = 'AUTH_TOKEN'

axios.defaults.paramsSerializer = function (params) {
    return qs.stringify(params)
}
axios.defaults.transformRequest = [function (data) {
    // console.log(data)
    // console.log(headers)
    // return qs.stringify(data);
    return qs.stringify(data,{indices:false})
}]
// 请求拦截处理
axios.interceptors.request.use(
    config => {
        config.headers.common['Authorization'] = store.getters.getToken
        config.headers.common['token'] = store.getters.getToken
        return config
    },

    error => {
        return Promise.error(error)
    }
)

// 响应拦截处理
axios.interceptors.response.use(
    response => {
        if (response.status == 200) {
            if ('code' in response.data) {
                if (response.data.code == 200) {
                    if (response.data.autoShowMessage){
                        Message({
                            showClose:true,
                            message: response.data.message || '操作成功',
                            type: 'success'
                        })
                    }
                    return Promise.resolve(response.data)
                }
                // return Promise.reject(response.data)
                Message({
                    showClose:true,
                    message: response.data.message || '操作失败',
                    type: 'error'
                })
                return Promise.reject(response)
            }
            return Promise.resolve(response)
        } else {
            return Promise.reject(response)
        }
    },
    error => {
        return Promise.reject(error.response)
    }
)

export default axios;