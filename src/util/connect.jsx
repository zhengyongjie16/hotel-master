import { Component } from "react"
import store from '../store/index'  // 得到一个redux的store对象





const connect = (m2p)=>{
    /// m2p => (state)=>({...state})
    // m2p 这个函数  是形如 state=>返回一个对象  的格式

    const hoc = (Cp1)=>{
        // Cp1 = Login组件
        class newCp   extends Component{
            state = {
                storestate:null
            }
            componentDidMount(){
                // 挂载完成之后 让 storestate 立即等于最新的状态
                this.setState({
                    storestate: store.getState()
                })
                // 使用store.subscribe去订阅(监听) redux的状态的变化 
                store.subscribe(()=>{
                    // 如果之后有变化的话 也更新storestate
                    const curstate = store.getState() // 得到最新的全局状态
                    this.setState({
                        storestate: curstate
                    })
                })
            }
            render(){
                return <Cp1 
                        {...m2p(this.state.storestate)}  
                         disapatch={store.dispatch}
                         />
            }
        }
        return newCp;
    }

    return hoc
        
}
