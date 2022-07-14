import  React , { lazy } from "react";
import { useRoutes , Navigate} from "react-router-dom";
import Login from '../views/Login/Login';
import Home from '../views/Home/Home';
import Layout from '../components/layout/index'
import Build from '../views/Build/Build'
import Room from "../views/Room/Room";
import Go from '../views/Go/Go'
import RoomList from "../views/RoomList/RoomList";
// 原来的引入方法  这样引入会把所有的组件都打包到一个文件当中 会导致文件越来越大 首次加载的时候
// 会把很多不会立即使用到的组件也一并加载了
// import Room from "../views/Room/Room";
// import Build from "../views/Build/Build";

// 推荐除了首页和一些非常必要组件 使用  上面的方式引入以外其他的都通过 react 的lazy的方式引入
// lazy方式的引入会把单独的组件 打包成一个单独的文件 并且仅在需要使用的时候才会动态加载
// 俗称路由(组件)的懒加载
// 这也是面试当中 问到如何实现react的应用的优化的答案之一
// const  Room  = lazy(() => import('../views/Room/Room'));
// const  Build  = lazy(() => import('../views/Build/Build'));
// const RoomList = lazy(()=> import('../views/RoomList/RoomList'))

// 独立页面
const frameOut = [
  { path: '/login', element: <Login />  },
  { path: '/go', element: <Go />}
]



// 功能页面
const frameIn = [
    { path: 'index', element: <Home /> } ,
    { path: 'setroom', element: <Room /> },
    { path: 'setbuild', element: <Build /> },
    { path:'roomlist',element: <RoomList /> },
    { path: '*', element: <Navigate to="/index" /> }
]



const Router = ()=>{

    // 允许我们通过一个数组的方式来进行路由的配置
    // 通过这种方式  能更好的让我们进行模块化的开发 灵活的进行路由 配置
  let element = useRoutes([
    ...frameOut,
    { path: '/', element: <Navigate to="/index" /> }, // 进入到首页的话 就重定向到 /index
    { path: "/*", element: <Layout /> , children: frameIn},  
    

  ]);
  return element

}

export default Router;





