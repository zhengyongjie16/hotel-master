import { addBuild as _addBuild, getAllBuild, delBuild, editBuild } from '../../api/build'
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button, Modal, Input, notification, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, HomeOutlined, SmileOutlined, UndoOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import _ from 'lodash'  // 国际惯例 一般使用lodash的库 引入的变量名是 _
import './Build.scss'
import Header from '../../components/layout/Header';
import { changeConfirmLocale } from 'antd/lib/modal/locale';



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

    //添加楼栋
    const addBuild = async () => {
        if(!buildName) return message.error('楼栋名不能为空');
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
        if(!editName) return message.error('楼栋名不能为空');
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



    // 添加楼层的逻辑  start 
    const fref = useRef(null);
    const addFloor = async () => {
        const floorname = fref.current.value + "层";
        if (!fref.current.value) return message.warning('楼层名称不能为空');

        // 追加新的楼层名称到  当前的楼栋的floorInfo数组当中
        //   curBuild.floorInfo.push(floorname)
        const res = await editBuild({
            buildid: curBuild._id,
            floorInfo: [
                ...curBuild.floorInfo,
                floorname
            ]
        })

        const { success } = res;
        if (!success) message.error('添加失败');
        message.success('添加成功')
        getBuildList(); // 刷新楼栋列表
        fref.current.value = '';
        setCurBuld({
            ...curBuild,
            floorInfo: [
                ...curBuild.floorInfo,
                floorname
            ]
        })

    }
    // 添加楼层的逻辑的 end




    // 编辑楼层的逻辑 start

    const editFloor = async (index) => {
        console.log('curBuild.floorInfo', curBuild.floorInfo[index])
        if (!floor) return message.warning('楼层不能为空')
        const val = floor + "层";
        if (val == curBuild.floorInfo[index]) return message.warning('修改的楼层不能相同')
        const newFloorInfo = curBuild.floorInfo;
        newFloorInfo[index] = val;0


        const res = await editBuild({
            buildid: curBuild._id,
            floorInfo: newFloorInfo,
        })

        const { success } = res;
        if (!success) message.error('修改失败');
        message.success('修改成功')
        setCurBuld({
            ...curBuild,
            floorInfo: newFloorInfo
        })


    }
    // 编辑楼层的逻辑 end



    // 删除楼层  start

    const confirmDelFloor = async (index) => {
        const newFloorInfo = curBuild.floorInfo;
        newFloorInfo.splice(index, 1);
        const res = await editBuild({
            buildid: curBuild._id,
            floorInfo: newFloorInfo,
        })

        const { success } = res;
        if (!success) message.error('删除失败');
        message.success('删除成功')
        setCurBuld({
            ...curBuild,
            floorInfo: newFloorInfo
        })

    }


    // 删除楼层  end




    ///////////////////删除弹出层相关开始
    const [visible, setVisible] = useState(false);
    const [vis, setVis] = useState(false);
    const [floordel,setFloordel] = useState()

    const showModal = () => {
        setVisible(true);
    };

    const stDel = () => {
        setVis(true)
    }

    const handleOk = () => {
        setVisible(false);
    };

    const handleCancel = () => {
        setVisible(false);
    };
    //////////////////删除弹出层相关结束


    // 确认删除楼栋
    const confirmDel = async () => {
        console.log('curBuild._id',curBuild._id)
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
    ////////////////// 修改楼层的状态声明
    const [floor, setFloor] = useState('');
    ////////////////// 修改楼层的状态声明
    const [hide, setHide] = useState(true);

    ///////////////////          修改提示窗         ///////////////////
    const openNotification = () => {
        notification.open({
            message: '编辑楼层提示',
            description:
                <>
                    <p style={{ margin: 0 }}>修改楼层只需填写数字</p>
                    <p style={{ margin: 0 }}>楼层不能为空且不能与原楼层相同</p>
                </>,
            placement: 'topLeft',
            icon: (
                <SmileOutlined
                    style={{
                        color: '#108ee9',
                    }}
                />
            ),
            duration: 5,
        });
    };

    return (
        <>
            <Header title='楼栋楼层管理' />
            <div className="howmuch"
                style={{ marginBottom: "20px", fontSize: "20px" }}>
                一共有
                <span style={{ color: '#1890ff' ,marginLeft:"5px",marginRight:"5px"}}
                >
                    {total}
                </span>
                栋楼
                {<Button
                    style={{marginLeft:"20px", width: "150px"}}
                    icon={<PlusOutlined />}
                    //shape="round" 
                    type='primary'
                    onClick={showAdd}>
                    添加楼栋
                </Button>}
            </div>
            <div className="buildList">
                {
                    buildList.map(item => (
                        <Button
                            icon={<HomeOutlined />}
                            style={{ marginRight: '20px', width: '140px', marginBottom: '20PX' }}
                            size="large"
                            key={item.id}
                            onClick={() => {
                                setCurBuld(item)
                                setHide(false)
                            }}
                        >
                            {item.name}
                        </Button>
                    ))
                }


                {/* 楼栋的基本信息 */}
                <div style={{ fontSize: '20px' }}>
                    当前楼栋：
                    <span
                        style={{
                            color: '#1890ff',
                            marginRight: '20px'
                        }}>
                        {curBuild.name ? curBuild.name : '选择楼栋进行编辑'}
                    </span>
                    共
                    <span style={{
                        color: '#1890ff',
                        marginLeft:"6px"
                    }}>
                        {curBuild.floorInfo ? curBuild.floorInfo.length : 0}
                    </span> 层
                    <Button
                        icon={<EditOutlined />}
                        //shape="round"
                        size="small"
                        style={{ marginLeft: '15px' }}
                        type='primary'
                        onClick={() => {
                            hide == true ? message.warning('未选择楼栋，无法修改') : setShowEditBox(true)
                        }}>修改</Button>
                    <Button
                        icon={<DeleteOutlined />}
                        //shape="round"
                        size="small"
                        style={{ marginLeft: '15px' }}
                        type='primary'
                        onClick={() => {
                            hide == true ? message.warning('未选择楼栋，无法删除') : showDel()
                        }}>删除</Button>
                </div>

                {/******** 指定楼栋的 楼层信息 **********/}
                <div className={hide == true ? 'hide' : 'floorList'}>
                    <span style={{ marginBottom: "10px", color: "green" }}>双击楼层后进行编辑</span>
                    {
                        curBuild.floorInfo?.map((item, index) => (
                            <div key={item} onDoubleClick={ev => {
                                openNotification()
                                const cur = ev.currentTarget; //
                                cur.querySelector('.editbox').classList.remove('hide')
                                cur.querySelector('div').classList.add('hide');
                                cur.querySelector('input').value = item;
                                cur.querySelector('input').focus()
                                console.log(22222, cur.querySelector('div'))
                            }}>
                                <div style={{ fontSize: "20px" }}> {item} </div>
                                <div className="hide editbox" >
                                    <Input
                                        style={{ height: "38px" }}
                                        type="text" onChange={(ev) => {
                                            setFloor(ev.target.value)
                                        }}
                                    />
                                    <Button
                                        size='small'
                                        icon={<EditOutlined />}
                                        onClick={() => {
                                            editFloor(index)
                                        }}
                                        style={{ height: "39px", marginRight: "5px" }}
                                        type="primary">修改</Button>
                                    <Button
                                        size='small'
                                        icon={<DeleteOutlined />}
                                        onClick={() => {
                                            showDel()
                                            setFloordel(index)
                                        }} style={{ height: "39px", marginRight: "5px" }} type="primary">删除</Button>
                                    <Button
                                        size='small'
                                        icon={<UndoOutlined />}
                                        onClick={(ev) => {
                                            const cur = ev.currentTarget;
                                            //console.log(1111,cur.parentElement.previousSibling)
                                            cur.parentElement.classList.toggle('hide')
                                            cur.parentElement.previousSibling.classList.toggle('hide')
                                        }} style={{ height: "39px" }} type="primary">取消</Button>
                                </div>
                            </div>
                        ))
                    }


                    <input ref={fref} placeholder="填写楼层名，只需填入数字" style={{
                        width: "200px",
                        marginBottom: "2px",
                        marginTop: "5px",
                        border: "2px solid #1890ff"
                    }} />
                    <Button type="primary" onClick={addFloor} style={{ width: "200px" }}>立即添加楼层</Button>
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



                {/*楼栋删除 删除确认的对话框 */}

                <Modal
                    title="警告"
                    visible={visible}
                    cancelText='取消'
                    okText="立即删除"
                    onOk={() => {
                        handleOk()
                        confirmDel()
                    }}
                    onCancel={handleCancel}
                >
                    <p>删除后不可恢复，是否确认删除</p>
                </Modal>

                {/*楼层删除 删除确认的对话框 */}

                <Modal
                    title="警告"
                    visible={visible}
                    cancelText='取消'
                    okText="立即删除"
                    onOk={() => {
                        handleOk()
                        confirmDelFloor(floordel)
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
