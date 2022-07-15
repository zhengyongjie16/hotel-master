import $api from './server';

// 添加管理员
export const  addAdmin = async (data)=>{
    let res = await $api.post('/admin/add',data)
    return res.data;
}


// 管理员登录
export const loginAdmin = async (data)=>{
    let res = await $api.post('/admin/login',data)
    return res.data;
}//

