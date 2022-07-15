
//  一个函数  参数是一个组件 并返回一个新的组件  Hoc

import {  useLocation,useParams ,useNavigate} from 'react-router-dom'

/// 因为在我们的v6版本当中 官方不在支持class组件获取参数 
// 需要我们手动的实现一个 withRouter的高阶组件

const withRouter = (Cp)=>{
    // withRouter一定返回的是一个FC  因为只有FC当中才可以调用hook
    const NewCp = (props)=>{
        // 获取 路由参数
        const location = useLocation();
        const params = useParams();

        // 获取一个导航对象
        const navigate = useNavigate();

        // 把得到的路由参数再传递给最终
        return <Cp {...props} location={location} param={params}  navigate={navigate} />
    }

    return NewCp

}


export default withRouter;
