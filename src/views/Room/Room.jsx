import Header from "../../components/layout/Header";
import React, { useRef, useState, useMemo, useContext, useEffect, useLayoutEffect } from 'react';
import { getAllType, addType, delType, editType } from '../../api/roomType';
import 'antd/dist/antd.css';
import './Room.css';
import { SearchOutlined } from '@ant-design/icons';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Col, Drawer, Form, Row, Select, InputNumber, Modal, message } from 'antd';

import Highlighter from 'react-highlight-words';
import { useForm } from "antd/lib/form/Form";
const { Option } = Select;


const Room = () => {

    const [datalist, setDatalist] = useState([]);
    const [limit, setLimit] = useState(10);  // 单页数量
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0); // 总数

    // 获取表格数据的主函数
    const getData = async () => {
        const postData = { limit, page };
        if (name) postData.name = name;
        if (price) postData.price = price;

        let res = await getAllType(postData)
        const { success, data, count } = res;
        if (success) {
            setDatalist(data);
            setTotal(count)
        };
    }

    //console.log('data',data)

    // 条件过滤
    const [name, setName] = useState('');
    const [price, setPrice] = useState('')

    //开局获取数据
    useLayoutEffect(() => {
        getData();
    }, [limit, page])

    console.log('datalist', datalist)


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
    /////获取数据
    const data = datalist

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
    

    ////////////////////     设置列
    const columns = [
        {
            title: '房型名称',
            dataIndex: 'name',
            key: 'name',
            width: '25%',
            ...getColumnSearchProps('name'),
        },
        {
            title: '床数量',
            dataIndex: 'beds',
            key: 'beds',
            width: '12.5%',
        },
        {
            title: '价格',
            dataIndex: 'price',
            key: 'price',
            width: '12.5%',
            sorter: {
                compare: (a, b) => a.price - b.price, 
              },
            ...getColumnSearchProps('price'),
        },
        {
            title: '押金',
            dataIndex: 'yaPrice',
            key: 'yaPrice',
            width: '12.5%',
            sorter: {
                compare: (a, b) => a.yaPrice - b.yaPrice, 
              },
        },
        {
            title: '入住人数',
            dataIndex: 'liveLimit',
            key: 'liveLimit',
            width: '12.5%',
        },
        {
            title: '早餐券数量',
            dataIndex: 'couponNum',
            key: 'couponNum',
            width: '12.5%',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'x',
            width: '12.5%',

            // 通过record参数获取该行数据，详见antd-Table-render API
            render: (_, record) =>
                <>
                    <a style={{ marginRight: '15px' }} onClick={()=>{
                        setRow(record) // 异步的
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



    ///////////////////  修改弹出层相关控制状态开始  //////////////////
    const [vi, setVi] = useState(false);

    const shModal = () => {
        setVi(true);
    };

    const handOk = () => {
        setVi(false);
    };

    const hCancel = () => {
        setVi(false);
    };
    //////////////////  修改弹出层相关控制状态结束  //////////////////



    ///////////////////////////////删除            删除 房型开始             删除///////////////////////////////////
    const confirmDel = async (id) => {
        let res = await delType({ typeid: id });
        const { success } = res;
        if (!success) return message.error('删除失败')
        message.success('删除成功');
        getData();
    }
    ///////////////////////////////删除            删除 房型结束             删除///////////////////////////////////

    ///////////////////////////////添加            添加 房型开始             添加///////////////////////////////////
    const reset = ()=>{
		form.resetFields();
	}

    const dreset = ()=>{
		editRef.resetFields();
	}
    
    //const formRef = useRef(null)

    const [form] = Form.useForm()
    const [listadd,setListadd] = useState()
    //console.log('listadd',listadd)
    const handleAdd  = async ()=>{

        ///表单验证
        //const whether = await listadd// 表单验证 通过的话返回true 
        //if(whether !== true) return message.error('添加失败，请检查数据是否正确'); 

        //////添加操作
        const values = listadd; // 得到所有的表单的值
        //console.log('values',values)
        let res = await addType(values);
        const { success } = res;
        if(!success) return message.error('添加失败，请检查数据是否正确');
        message.success('添加成功');
        getData(); // 刷新表格
    }
    ///////////////////////////////添加            添加 房型结束            添加///////////////////////////////////


    ///////////////////////////////修改            修改 房型开始             修改///////////////////////////////////

    const [editRef] = Form.useForm();
    const [row, setRow] = useState();

    //const [curRow,setCurRow] = useState(null)
    const openEdit =  (row)=>{
        shModal();                        //  让修改抽屉弹出
        editRef.setFieldsValue({...row})  // 设置 修改表单的内容
    }
    const handleEdit   = async ()=>{

        const ok = listadd // 表单验证 通过的话返回true
        if(ok !== true) return message.error('修改失败，请检查数据是否正确');

        const values = listadd; // 得到所有的表单的值
        // 发送请求执行修改
        let res = await editType({
            ...values,
            typeid:row._id
        });
        const { success } = res;
        if(!success) return message.error('修改失败，请检查数据是否正确');
        message.success('修改成功');
        getData(); // 刷新表格
    }

    ///////////////////////////////修改            修改 房型结束            修改///////////////////////////////////




    return (
        <>
            <Header title="房型维护" />

            {/* ///////////////////////////////            表单布局开始             /////////////////////////////////// */}
            <Button type='primary' onClick={showDrawer} icon={<PlusOutlined />} style={{ marginBottom: "10px", width: "150px" }}>添加房型</Button>
            <Table rowKey="_id" columns={columns} dataSource={data} />
            {/* ///////////////////////////////            表单布局结束             /////////////////////////////////// */}


            {/* ///////////////////////////////            添加房型抽屉渲染开始             /////////////////////////////////// */}
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
                        <Button onClick={()=>{
                            onClose()
                            reset()
                        }}>取消</Button>
                        <Button onClick={()=>{
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
                onValuesChange={(changedValues, allValues) =>{
                    console.log('添加表单',changedValues, allValues)
                    setListadd(allValues)
                }
                    }>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="房型名称"
                                rules={[
                                    {
                                        required: true,
                                        message: '房型名称不能为空',
                                    },
                                ]}
                            >
                                <Input allowClear={true} placeholder="请输入一个房型名称" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="price"
                                label="价格"
                                rules={[
                                    {
                                        required: true,
                                        message: '价格不能为空',
                                    },
                                ]}
                            >
                                <Input allowClear={true} placeholder="请输入一个价格" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="yaPrice"
                                label="押金"
                            >
                                <Input allowClear={true} placeholder="请输入押金" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="beds"
                                label="床数量"
                            >
                                <InputNumber min={1} max={10} defaultValue={1} style={{ width: '100px' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="liveLimit"
                                label="入住人数"
                            >
                                <InputNumber min={1} max={10} defaultValue={1} style={{ width: '100px' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="couponNum"
                                label="早餐券数量"
                            >
                                <InputNumber min={1} max={10} defaultValue={1} style={{ width: '100px' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                </Form>
            </Drawer>
            {/* ///////////////////////////////            添加房型抽屉渲染结束             /////////////////////////////////// */}







            {/* ///////////////////////////////            修改房型抽屉渲染开始             /////////////////////////////////// */}
            <Drawer
                title="修改该房型"
                width={620}
                onClose={onClose}
                visible={vi}
                bodyStyle={{
                    paddingBottom: 80,
                }}
                extra={
                    <Space>
                        <Button onClick={()=>{
                            onClose()
                            dreset()
                        }}>取消</Button>
                        <Button onClick={()=>{
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
                onValuesChange={(changedValues, allValues) =>{
                    console.log('修改表单',changedValues, allValues)
                    setListadd(allValues)
                }
                    }>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="房型名称"
                                rules={[
                                    {
                                        required: true,
                                        message: '房型名称不能为空',
                                    },
                                ]}
                            >
                                <Input allowClear={true} placeholder="请输入一个房型名称" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="price"
                                label="价格"
                                rules={[
                                    {
                                        required: true,
                                        message: '价格不能为空',
                                    },
                                ]}
                            >
                                <Input allowClear={true} placeholder="请输入一个价格" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="yaPrice"
                                label="押金"
                            >
                                <Input allowClear={true} placeholder="请输入押金" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="beds"
                                label="床数量"
                            >
                                <InputNumber min={1} max={10} defaultValue={1} style={{ width: '100px' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="liveLimit"
                                label="入住人数"
                            >
                                <InputNumber min={1} max={10} defaultValue={1} style={{ width: '100px' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="couponNum"
                                label="早餐券数量"
                            >
                                <InputNumber min={1} max={10} defaultValue={1} style={{ width: '100px' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                </Form>
            </Drawer>
            {/* ///////////////////////////////            修改房型抽屉渲染结束             /////////////////////////////////// */}



            {/*房型删除 删除确认的对话框 */}

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

export default Room;