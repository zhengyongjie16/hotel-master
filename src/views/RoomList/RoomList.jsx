import Header from "../../components/layout/Header";
import React, { useRef, useState, useMemo, useContext, useEffect, useLayoutEffect } from 'react';
import { getAllRoom, delRoom, addRoom, editRoom } from '../../api/room'
import { getAllBuild } from "../../api/build";
import { getAllType } from "../../api/roomType";
import 'antd/dist/antd.css';
import './RoomList.css';
import { SearchOutlined } from '@ant-design/icons';
import { PlusOutlined } from '@ant-design/icons';
import {
    Button,
    Input,
    Space,
    Table,
    Col,
    Drawer,
    Form,
    Row,
    Select,
    InputNumber,
    Modal,
    message,
    Tag,
    Cascader,
    Radio,
} from 'antd';

import Highlighter from 'react-highlight-words';
const { Option } = Select;


const RoomList = () => {

    //////////// 获取全部的楼栋信息  ///////////////////////////
    const [build, setBuild] = useState([])
    const getBuild = async () => {
        let res = await getAllBuild({});
        console.log('res', res)
        // 实际开发过程当中 得到的数据格式不一定符合我们的要求
        // 我们需要处理成我们要用的数据格式
        const temarr = res.data.map(item => ({
            label: item.name,
            value: item._id,
            children: item.floorInfo.map(it => ({ label: it, value: it }))
        }))
        setBuild(temarr)
    }
    useEffect(() => {
        getBuild();  // 获取楼栋信息
    }, [])


    // 获取全部的房型

    const [type, setType] = useState([]);
    const getTypes = async () => {
        const res = await getAllType({ limit: 2000 });
        setType(res.data.map(item => ({ value: item.name })))
    }
    useEffect(() => {
        getTypes();  // 获取全部的房型信息
    }, [])





    const [datalist, setData] = useState([]);
    const [limit, setLimit] = useState(30);  // 单页数量
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0); // 总数
    /////////// 获取表格数据的主函数
    const getData = async () => {
        const postData = { limit, page };
        if (name) postData.name = name;
        if (price) postData.price = price;

        let res = await getAllRoom(postData)
        const { success, data, count } = res;
        if (success) {
            setData(data);
            setTotal(count)
        };
    }
    console.log('data', datalist)

    // 条件过滤
    const [name, setName] = useState('');
    const [price, setPrice] = useState('')


    useLayoutEffect(() => {
        getData(); // 获取表格数据

    }, [limit, page])


    ///////////////////////////////            抽屉对应布局开始             ///////////////////////////////////
    const [visible, setVisible] = useState(false);

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        ///修改和删除通用
        setVi(false)
    };
    ///////////////////////////////            抽屉对应布局结束            ///////////////////////////////////


    ///////////////////////////////            表单布局开始             ///////////////////////////////////
    
    const data = datalist /////获取数据

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div
                style={{
                    padding: 8,
                }}
            >
                <Input
                    ref={searchInput}
                    placeholder={`查找 ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        查找
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        重置
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        过滤
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    ////////////////////        声明状态以获取行id ****
    const [rowid, setRowid] = useState()
    ////////////////////        声明状态以获取行行数据 ****
    const [row, setRow] = useState()
    console.log('row', row)

    ////////////////////     设置列    ////////////////////
    const columns = [
        {
            title: '房间名称',
            dataIndex: 'roomName',
            key: 'roomName',
            width: '25%',
            ...getColumnSearchProps('roomName'),
        },
        {
            title: '楼层',
            dataIndex: 'floor',
            key: 'floor',
            width: '12.5%',
        },
        {
            title: '是否有窗',
            dataIndex: 'hasWindow',
            key: 'hasWindow',
            width: '12.5%',
            render: (_, record) =>
                <>
                    <Tag color={record.hasWindow ? 'success' : 'error'}>{record.hasWindow ? '是' : '否'}</Tag>
                </>
        },
        {
            title: '靠近马路',
            dataIndex: 'isClose2Road',
            key: 'isClose2Road',
            width: '12.5%',
            render: (_, record) =>
                <>
                    <Tag color={record.isClose2Road ? 'success' : 'error'}>{record.isClose2Road ? '是' : '否'}</Tag>
                </>
        },
        {
            title: '允许吸烟',
            dataIndex: 'isSmoke',
            key: 'isSmoke',
            width: '12.5%',
            render: (_, record) =>
                <>
                    <Tag color={record.isSmoke ? 'success' : 'error'}>{record.isSmoke ? '是' : '否'}</Tag>
                </>
        },
        {
            title: '高温房',
            dataIndex: 'isHigh',
            key: 'isHigh',
            width: '12.5%',
            render: (_, record) =>
                <>
                    <Tag color={record.isHigh ? 'success' : 'error'}>{record.isHigh ? '是' : '否'}</Tag>
                </>
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'x',
            width: '12.5%',
            // 通过record参数获取该行数据，详见antd-Table-render API
            render: (_, record) =>
                <>
                    <a style={{ marginRight: '15px' }} onClick={() => {
                        setRow(record)
                        openEdit(record)                        
                    }
                    }>修改</a>
                    <a onClick={() => {
                        setRowid(record._id)
                        showModal()
                    }
                    }>删除</a>
                </>

        },
    ];


    ///////////////////////////////              表单布局结束               ///////////////////////////////////


    ///////////////////  删除弹出层相关控制状态开始
    const [visi, setVisi] = useState(false);
    const [vis, setVis] = useState(false);

    const showModal = () => {
        setVisi(true);
    };

    const stDel = () => {
        setVis(true)
    }

    const handleOk = () => {
        setVisi(false);
    };

    const handleCancel = () => {
        setVisi(false);
    };
    //////////////////  删除弹出层相关控制状态结束



    ///////////////////  修改弹出层相关控制状态开始
    const [vi, setVi] = useState(false);
    //const [vis, setVis] = useState(false);

    const shModal = () => {
        setVi(true);
    };

    /* const stDel = () => {
        setVis(true)
    } */

    const handOk = () => {
        setVi(false);
    };

    const hCancel = () => {
        setVi(false);
    };
    //////////////////  修改弹出层相关控制状态结束



    ///////////////////////////////删除            删除 房间开始             删除///////////////////////////////////
    const confirmDel = async (id) => {
        let res = await delRoom({ roomid: id });
        const { success } = res;
        if (!success) return message.error('删除失败')
        message.success('删除成功');
        getData();
    }
    ///////////////////////////////删除            删除 房间结束             删除///////////////////////////////////


    ///////////////////////////////添加            添加 房间开始             添加///////////////////////////////////
    const reset = () => {
        form.resetFields();
    }

    const dreset = () => {
        editRef.resetFields();
    }
     
    const [form] = Form.useForm()
    const [listadd,setListadd] = useState()
    
    const handleAdd   = async ()=>{
        
        ///表单验证
        //console.log('listadd',listadd)
        //const whether = await listadd// 表单验证 通过的话返回true 
        //if(whether !== true) return message.error('添加失败，请检查数据是否正确'); 

        const values = listadd; // 得到所有的表单的值
        const { bandf , ...postData} = values;
        const [ buildId, floor ] = bandf;
        let res = await addRoom({
            ...postData,
            floor,
            buildId
        });
        const { success } = res;
        if(!success) return message.error('添加失败，请检查数据是否正确');
        message.success('添加成功');
        getData(); // 刷新表格
    }

    ///////////////////////////////添加            添加 房间结束            添加///////////////////////////////////


    ///////////////////////////////修改            修改 房间开始             修改///////////////////////////////////

    const [editRef] = Form.useForm();
    const openEdit = (row)=>{
        //console.log('row',row)     
        shModal(); //  让修改抽屉弹出
        // 设置 修改表单的内容
        editRef.setFieldsValue({
            ...row,
            bandf:[row.buildId,row.floor]
        })       
    }
    const handleEdit   = async ()=>{
        const ok = listadd // 表单验证 通过的话返回true
        if(ok !== true) return message.error('修改失败，请检查数据是否正确');

        const values = listadd; // 得到所有的表单的值
        const { bandf,...postData } = values;
        const [buildId,floor] = bandf;
        // 发送请求执行修改
        let res = await editRoom({
            ...postData,
            roomid:row._id,
            buildId, 
            floor
        });
        const { success } = res;
        if(!success) return message.error('修改失败，请检查数据是否正确');
        message.success('修改成功');
        getData(); // 刷新表格
    }


    ///////////////////////////////修改            修改 房间结束            修改///////////////////////////////////




    return (
        <>
            <Header title="房间管理" />

            {/* ///////////////////////////////            表单布局开始             /////////////////////////////////// */}
            <Button type='primary' onClick={showDrawer} icon={<PlusOutlined />} style={{ marginBottom: "10px", width: "150px" }}>添加房间</Button>
            <Table rowKey="_id" columns={columns} dataSource={data} />
            {/* ///////////////////////////////            表单布局结束             /////////////////////////////////// */}


            {/* ///////////////////////////////            添加房间抽屉渲染开始             /////////////////////////////////// */}
            <Drawer
                title="添加一个新的房间"
                width={620}
                onClose={onClose}
                visible={visible}
                bodyStyle={{
                    paddingBottom: 80,
                }}
                extra={
                    <Space>
                        <Button onClick={() => {
                            onClose()
                            reset()
                        }}>取消</Button>
                        <Button onClick={() => {
                            reset()
                            onClose()
                            handleAdd()
                        }} type="primary">
                            立即添加
                        </Button>
                    </Space>
                }
            >
                <Form layout="vertical" hideRequiredMark form={form} /* onFinish={(values)=>console.log('values',values)} */
                    onValuesChange={(changedValues, allValues) => {
                        console.log('添加表单', changedValues, allValues)
                        setListadd(allValues)
                    }
                    }>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="roomName"
                                label="房间名称"
                                rules={[
                                    {
                                        required: true,
                                        message: '房间名称不能为空',
                                    },
                                ]}
                            >
                                <Input allowClear={true} placeholder="请输入一个房间名称" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item 
                        name="bandf"
                        label="所在楼栋楼层"
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: '楼栋楼层不能为空',
                            },
                        ]}
                        >
                            <Cascader
                                options={build}
                            />
                        </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item 
                        name="type"
                        label="选择房型"
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: '房型不能为空',
                            },
                        ]}
                        >

                            <Select>
                                <Select options={type} value="demo"></Select>
                            </Select>
                        </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                    <Col span={12}>
                    <Form.Item
                            name="direction"
                            label="方向朝向"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择',
                                },
                            ]}
                        >
                            <Radio.Group>
                                <Radio.Button value="1">东</Radio.Button>
                                <Radio.Button value="2">西</Radio.Button>
                                <Radio.Button value="3">南</Radio.Button>
                                <Radio.Button value="4">北</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                    <Col span={12}>
                    <Form.Item
                            name="hasWindow"
                            label="是否有窗户"
                        >
                            <Radio.Group>
                                <Radio.Button value={true}>是</Radio.Button>
                                <Radio.Button value={false}>否</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                    <Col span={12}>
                    <Form.Item
                            name="isClose2Road"
                            label="是否靠近马路"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择',
                                },
                            ]}
                        >
                            <Radio.Group>
                                <Radio.Button value={true}>是</Radio.Button>
                                <Radio.Button value={false}>否</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                    <Col span={12}>
                    <Form.Item
                            name="isSmoke"
                            label="是否允许吸烟"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择',
                                },
                            ]}
                        >
                            <Radio.Group>
                                <Radio.Button value={true}>是</Radio.Button>
                                <Radio.Button value={false}>否</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                    <Col span={12}>
                    <Form.Item
                            name="isNoise"
                            label="是否是噪音房"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择',
                                },
                            ]}
                        >
                            <Radio.Group>
                                <Radio.Button value={true}>是</Radio.Button>
                                <Radio.Button value={false}>否</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="isHigh"
                            label="是否是高温房"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择',
                                },
                            ]}
                        >
                            <Radio.Group>
                                <Radio.Button value={true}>是</Radio.Button>
                                <Radio.Button value={false}>否</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        </Col>
                    </Row>

                </Form>
            </Drawer>
            {/* ///////////////////////////////            添加房间抽屉渲染结束             /////////////////////////////////// */}







            {/* ///////////////////////////////            修改房型抽屉渲染开始             /////////////////////////////////// */}
            <Drawer
                title="修改该房间"
                width={620}
                onClose={onClose}
                visible={vi}
                bodyStyle={{
                    paddingBottom: 80,
                }}
                extra={
                    <Space>
                        <Button onClick={() => {
                            onClose()
                            dreset()
                        }}>取消</Button>
                        <Button onClick={() => {
                            dreset()
                            onClose()
                            handleEdit()
                        }} type="primary">
                            立即修改
                        </Button>
                    </Space>
                }
            >
                <Form layout="vertical" hideRequiredMark form={editRef} /* onFinish={(values)=>console.log('values',values)} */
                    onValuesChange={(changedValues, allValues) => {
                        console.log('添加表单', changedValues, allValues)
                        setListadd(allValues)
                    }
                    }>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="roomName"
                                label="房间名称"
                                rules={[
                                    {
                                        required: true,
                                        message: '房间名称不能为空',
                                    },
                                ]}
                            >
                                <Input allowClear={true} placeholder="请输入一个房间名称" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item 
                        name="bandf"
                        label="所在楼栋楼层"
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: '楼栋楼层不能为空',
                            },
                        ]}
                        >
                            <Cascader
                                options={build}
                            />
                        </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item 
                        name="type"
                        label="选择房型"
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: '房型不能为空',
                            },
                        ]}
                        >

                            <Select>
                                <Select options={type} value="demo"></Select>
                            </Select>
                        </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                    <Col span={12}>
                    <Form.Item
                            name="direction"
                            label="方向朝向"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择',
                                },
                            ]}
                        >
                            <Radio.Group>
                                <Radio.Button value="1">东</Radio.Button>
                                <Radio.Button value="2">西</Radio.Button>
                                <Radio.Button value="3">南</Radio.Button>
                                <Radio.Button value="4">北</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                    <Col span={12}>
                    <Form.Item
                            name="hasWindow"
                            label="是否有窗户"
                        >
                            <Radio.Group>
                                <Radio.Button value={true}>是</Radio.Button>
                                <Radio.Button value={false}>否</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                    <Col span={12}>
                    <Form.Item
                            name="isClose2Road"
                            label="是否靠近马路"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择',
                                },
                            ]}
                        >
                            <Radio.Group>
                                <Radio.Button value={true}>是</Radio.Button>
                                <Radio.Button value={false}>否</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                    <Col span={12}>
                    <Form.Item
                            name="isSmoke"
                            label="是否允许吸烟"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择',
                                },
                            ]}
                        >
                            <Radio.Group>
                                <Radio.Button value={true}>是</Radio.Button>
                                <Radio.Button value={false}>否</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                    <Col span={12}>
                    <Form.Item
                            name="isNoise"
                            label="是否是噪音房"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择',
                                },
                            ]}
                        >
                            <Radio.Group>
                                <Radio.Button value={true}>是</Radio.Button>
                                <Radio.Button value={false}>否</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="isHigh"
                            label="是否是高温房"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择',
                                },
                            ]}
                        >
                            <Radio.Group>
                                <Radio.Button value={true}>是</Radio.Button>
                                <Radio.Button value={false}>否</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        </Col>
                    </Row>

                </Form>
            </Drawer>
            {/* ///////////////////////////////            修改房型抽屉渲染结束             /////////////////////////////////// */}



            {/*房间删除 删除确认的对话框 */}

            <Modal
                title="警告"
                visible={visi}
                cancelText='取消'
                    okText="立即删除"
                onOk={() => {
                    handleOk()
                    confirmDel(rowid)
                }}
                onCancel={handleCancel}
            >
                <p>删除后不可恢复，是否确认删除</p>
            </Modal>

        </>
    );
};

export default RoomList;