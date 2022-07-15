import $api from './server';

// 添加楼栋
export const  addType = async (data)=>{
    let res = await $api.post('/roomtype/add',data)
    return res.data;
}


// 查询所有
export const getAllType = async (data)=>{
    let res = await $api.post('/roomtype/getAll',data)
    return res.data;
}

// 删除

export const delType = async (data)=>{
    let res = await $api.post('/roomtype/del',data)
    return res.data;
}//

// 修改

export const editType = async (data)=>{
    let res = await $api.post('/roomtype/edit',data)
    return res.data;
}
