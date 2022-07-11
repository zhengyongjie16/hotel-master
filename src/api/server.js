import axios from "axios";


const $api = axios.create({
    baseURL:'http://127.0.0.1:4000'  // 前置路径
    //baseURL:"http://127.0.0.1:4523/mock/1246251"
})


// // 请求拦截

// $api.interceptors.request.add((config)=>{
//     config.headers.token = 'abc123'
//     return config
// })

// // 响应拦截
// $api.interceptors.response.add(response=>{

//     const { status } = response;

//     let statusTxt = ''

//     switch(status){
//         case 404:
//             statusTxt = '请求为空';
//             break;
//         case  401:
//             statusTxt = '鉴权失败' 
//             break
//     }

//     response.statusTxt = statusTxt;
//     return response
// })


export default $api


