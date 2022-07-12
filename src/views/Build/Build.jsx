import { addBuild as _addBuild, getAllBuild, delBuild, editBuild } from '../../api/build'
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button, Modal, Input, notification, message } from 'antd';
import 'antd/dist/antd.css';
import _ from 'lodash'  // 国际惯例 一般使用lodash的库 引入的变量名是 _
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

    // 添加弹框是否显示
    const [showAddBox, setShowAddBox] = useState(false)
    const showAdd = useCallback(() => setShowAddBox(true), []);  // 优化
    const cancelAdd = useCallback(() => setShowAddBox(false), []);

    const [buildName, setBuildName] = useState('');
    console.log(buildName)

    //const _setBuildName = _.debounce((val) => { setBuildName(val) }, 300)

    const addBuild = async () => {
        let res = await _addBuild({ name: buildName, floorInfo: [] })
        const { success } = res;
        if (!success) return message.error('添加失败', 1.5);
        message.success('添加成功', 1.5);
        getBuildList(); // 获取最新的列表
        cancelAdd();// 关闭弹窗
    }



    // 修改的业务逻辑   start
    const [showEditBox, setShowEditBox] = useState(false);
    const [editName, setEditName] = useState('')
    /*    useEffect(()=>{
        if(curBuild.name) setEditName(curBuild.name)
       },[curBuild]) */

    const handleEdit = async () => {
        let res = await editBuild({
            buildid: curBuild._id,
            name: editName,
            floorInfo: curBuild.floorInfo
        })
        const { success } = res;
        if (!success) message.error('修改失败');
        message.success('修改成功')
        getBuildList(); // 刷新楼栋列表
        setShowEditBox(false);
    }
    // 修改的业务逻辑   end


    ///////////////////删除弹出层相关开始
    const [visible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const handleOk = () => {
        setVisible(false);
    };

    const handleCancel = () => {
        setVisible(false);
    };
    //////////////////删除弹出层相关结束


    // 确认删除楼栋
    const confirmDel = async () => {
        let res = await delBuild({
            buildid: curBuild._id
        })
        const { success } = res;
        if (!success) return message.error('删除失败');
        message.success('删除成功');
        getBuildList(); // 刷新楼栋信息
    }


    // 声明一个 删除确认的对话框
    const showDel = () => {
        showModal()

    }



    ////////////////// 当前选中的楼栋
    const [curBuild, setCurBuld] = useState({});

    return (
        <>
            <div className="howmuch" style={{ marginBottom: "20px", fontSize: "20px" }}> 一共有 <span style={{ color: 'blue' }}>{total}</span> 栋楼</div>
            <div className="buildList">
                {
                    buildList.map(item => (
                        <Button
                            style={{ marginRight: '20px', width: '100px', marginBottom: '20PX' }}
                            size="large"
                            key={item._id}
                            onClick={() => setCurBuld(item)}
                        >
                            {item.name}
                        </Button>
                    ))
                }
                {<Button shape="round" type='primary' onClick={showAdd}>添加楼栋</Button>}
                {/* 楼栋的基本信息 */}
                <div style={{ fontSize: '20px' }}>
                    当前楼栋：<span style={{ color: 'blue' }}>{curBuild.name}</span> 共 {curBuild.floorInfo ? curBuild.floorInfo.length : 0} 层 共有客房 : x 间
                    <Button size="small" style={{ marginLeft: '15px' }} type='primary' onClick={() => setShowEditBox(true)}>修改</Button>
                    <Button size="small" style={{ marginLeft: '15px' }} type='primary' onClick={showDel}>删除</Button>
                </div>

                {/* 添加楼栋的弹窗 */}
                <Modal
                    visible={showAddBox}
                    title="添加新楼栋"
                    onOk={handleOk}
                    onCancel={() => {
                        setShowAddBox(false)
                        setBuildName('')
                    }}
                    footer={[
                        <Button key="back" onClick={() => setShowAddBox(false)}>
                            返回
                        </Button>,
                        <Button key="submit" type="primary" onClick={addBuild}>
                            立即添加
                        </Button>,
                    ]}
                >
                    <Input type="text"
                        placeholder="输入楼栋名称"
                        onChange={(ev) => setBuildName(ev.target.value)}
                        /* value={buildName} */ />
                </Modal>

                {/* 修改楼栋的弹窗 */}
                <Modal
                    visible={showEditBox}
                    title="修改当前楼栋"
                    //onOk={handleOk}
                    onCancel={() => {
                        setShowEditBox(false)
                        setBuildName('')
                    }}
                    footer={[
                        <Button key="back" onClick={() => setShowEditBox(false)}>
                            返回
                        </Button>,
                        <Button key="submit" type="primary" onClick={handleEdit}>
                            立即修改
                        </Button>,
                    ]}
                >
                    <Input type="text"
                        placeholder="输入楼栋名称"
                        onChange={(ev) => setEditName(ev.target.value)}
                        /* value={buildName} */ />
                </Modal>



               {/* 删除确认的对话框 */}

                <Modal
                    title="警告"
                    visible={visible}
                    onOk={() => {
                        handleOk()
                        confirmDel()
                    }}
                    onCancel={handleCancel}
                >
                    <p>删除后不可恢复，是否确认删除</p>
                </Modal>

            </div>
        </>
    )
}

export default Build;
