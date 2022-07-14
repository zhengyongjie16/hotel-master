import { useEffect ,useState} from "react"
import { useNavigate }  from 'react-router-dom'
const Go = ()=>{


    const navigate = useNavigate();
    const [count,setCount] = useState(3);
    const [timer,setTimer ] = useState(null)
    useEffect(()=>{ 
          
            gotoLogin();
            
            // 记得清除定时器
            return ()=>{
                clearInterval(timer)
            }
    },[])

    useEffect(()=>{
        startCount()
    },[count])

    const startCount = ()=>{
        setTimer(setInterval(()=>{ 
            setCount(count-1)
        },1000))
    }

    const gotoLogin = ()=>{
        setTimeout(()=>{
            navigate('/login',{replace:true})
        },3000)
    }
    return (
        <div> 
            <div>即将跳转到 登录页</div> 
            <div>此处有一个倒计时 ：  { count } 秒  后自动跳转到登录页</div>
            <div>立即跳转</div>
        </div>
    )   
}

export default Go