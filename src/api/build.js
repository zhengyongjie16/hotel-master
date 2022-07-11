import $api from './server';

// 添加楼栋
export const  addBuild = async (data)=>{
    let res = await $api.post('/build/add',data)
    return res.data;
}


// 查询所有的楼栋
export const getAllBuild = async (data)=>{
    let res = await $api.post('/build/getAll',data)
    return res.data;
}

// 删除楼栋

export const delBuild = async (data)=>{
    let res = await $api.post('/build/del',data)
    return res.data;
}

// 修改楼栋信息

export const editBuild = async (data)=>{
    let res = await $api.post('/build/edit',data)
    return res.data;
}
