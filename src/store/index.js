
import { configureStore } from '@reduxjs/toolkit'

import adminReducer from './adminSlice' // 从userSlice当中导入 对应生成的reducer
import commonReducer from './commonSlice'

// 实现数据持久化
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
    key: 'root',
    storage,
  }

// 将迎来的userReducer 使用  persistReducer进行持久化处理
const persistedAdminReducer = persistReducer(persistConfig, adminReducer)
const persistedCommonReducer = persistReducer(persistConfig, commonReducer)



// 在 toolkit当中 使用的是 configureStore来创建 store对象
 const store = configureStore({
  reducer: {
    admin:persistedAdminReducer ,
    common: persistedCommonReducer
  },
  devTools:true, // 设置true 表示允许使用 devtool进行调试
  middleware: getDefaultMiddleware =>
  getDefaultMiddleware({
    serializableCheck: false,
  }),
})


export default store; // 默认导出 store对象
export const persistor = persistStore(store) // 导出持久化对象

