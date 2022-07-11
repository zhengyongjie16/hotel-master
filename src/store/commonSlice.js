import { createSlice } from '@reduxjs/toolkit'

import  menu from './menu'

const initialState = {
    menu,
    //curMenu:'首页'
}

export const commomSlice = createSlice({
  name: 'commom',  
  initialState, // reducer的初始的 state
  reducers: {
    setMenu(state,action){
        state.menu =  action.payload;
    },
    // setCurMenu(state,action){
    //    state.curMenu = action.payload
    // }
  },
})


export const { setMenu } = commomSlice.actions

export default commomSlice.reducer