import { createSlice } from '@reduxjs/toolkit'

// 声明初始化的全局状态
const initialState = {
    adminInfo: null
}

// 通过 createSlice 既创建了actioncreator 也创建了 reducer
export const adminSlice = createSlice({
  name: 'admin',  // 模块名称 这个模块名称是后面生成的action当中的指定的type的前缀部分
  initialState, // reducer的初始的 state
  reducers: {
    setAdminInfo(state,action){
        state.adminInfo =  action.payload;
    }   
  },
})

// Action creators are generated for each case reducer function
// 根据reducer里面声明的函数生成对应的同名的action Createor 
export const { setAdminInfo  } = adminSlice.actions

export default adminSlice.reducer