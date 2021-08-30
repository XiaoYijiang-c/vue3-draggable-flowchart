import axios from 'axios';
axios.defaults.baseURL = '/api' //此路径为配置代理服务器时的代理路径

export default {
    get(url, data, responseType) { // url: 接口；路径；data: 请求参数；responseType：相应的数据类型，不传默认为json
        return new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url,
                data,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                    withCredentials: true,
                },
                //默认json格式，如果是下载文件，需要传 responseType:'blob'
                responseType: (responseType == null || responseType == '') ? 'json' : responseType
            }).then(response => {
                if (response.status == 200) {
                    //根据实际情况进行更改
                    resolve(response)
                } else {
                    reject(response)
                }
            })
        })
    },

    post(url, data, responseType) { // url: 接口；路径；data: 请求参数；responseType：相应的数据类型，不传默认为json
        return new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url,
                data,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                    withCredentials: true,
                },
                //默认json格式，如果是下载文件，需要传 responseType:'blob'
                responseType: (responseType == null || responseType == '') ? 'json' : responseType
            }).then(response => {
                if (response.status == 200) {
                    //根据实际情况进行更改
                    resolve(response)
                } else {
                    reject(response)
                }
            })
        })
    }
}