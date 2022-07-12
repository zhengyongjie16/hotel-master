import { addBuild as _addBuild, getAllBuild, delBuild, editBuild } from '../../api/build'
import { useState, useEffect, useCallback, useRef } from "react";
import { Button} from 'antd';
//import './Build.scss'





const Build = () => {

    const [buildList, setBuildList] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        // 挂载完成之后去发送请求获取全部的楼栋信息
        getBuildList();
    }, [])

    const getBuildList = useCallback(async () => {
        const res = await getAllBuild({});
        setBuildList(res.data) // 修改楼栋数组
        setTotal(res.count)
    }, [])

    return (
        <>
            <div className="howmuch" style={{marginBottom:"20px",fontSize:"20px"}}> 一共有 {total} 栋楼</div>
            <div className="buildList">
                {
                    buildList.map(item => (
                        <Button
                            style={{marginRight:'20px'}}
                            size="large"
                            key={item._id}
                            onClick={() => setCurBuld(item)}
                            /* className={item.name === curBuild.name ? 'ac' : ''} */
                        >
                            {item.name}
                        </Button>
                    ))
                }

               {/*  <Button shape="round" onClick={showAdd}>添加楼栋</Button> */}
            </div>
        </>
    )
}

export default Build;
