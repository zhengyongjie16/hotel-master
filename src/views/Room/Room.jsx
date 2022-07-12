import Header from "../../components/layout/Header";
import { getAllType, addType, delType, editType } from '../../api/roomType';

import React, {useMemo, useContext, useEffect, useRef, useState,useLayoutEffect } from 'react';
import 'antd/dist/antd.css';
import './Room.css';
import { Button, Form, Input, Popconfirm, Table } from 'antd';



const Room = () => {

    const [data,setData] = useState([]);
    const [limit,setLimit] = useState(30);  // 单页数量
    const [page,setPage] = useState(1); 
    const [total ,setTotal] = useState(0); // 总数

// 获取表格数据的主函数
const getData = async ()=>{
    const postData = { limit,page };
    if(name) postData.name = name;
    if(price) postData.price = price;

    let res = await getAllType(postData)
    const {  success ,data, count} = res;
    if(success) {
        setData(data);
        setTotal(count)
    };   
}

console.log('data',data)

// 条件过滤
const [name,setName] = useState('');
const [price,setPrice] =useState('')

//开局获取数据
useLayoutEffect(()=>{
    getData();
},[limit,page])


///////////////////////////////            表单布局开始             ///////////////////////////////////
const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} 不能为空`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

    const [dataSource, setDataSource] = useState(
        [
        {
            key: '0',
            name: 'Edward King 0',
            num: '32',
            price: '50',
        },
        {
            key: '1',
            name: 'Edward King 1',
            age: '32',
            address: 'London, Park Lane no. 1',
        },
    ]
    //data
    );
    console.log('dataSource',dataSource)
    const [count, setCount] = useState(2);

    const handleDelete = (key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
    };

    const defaultColumns = [
        {
            title: '房型名称',
            dataIndex: 'name',
            width: '30%',
            editable: true,
        },
        {
            title: '床数量',
            dataIndex: 'beds',
            editable: true,
        },
        {
            title: '价格',
            dataIndex: 'price',
            editable: true,
        },
        {
            title: '押金',
            dataIndex: 'yaPrice',
            editable: true,
        },
        {
            title: '入住人数',
            dataIndex: 'liveLimit',
            editable: true,
        },
        {
            title: '早餐券数量',
            dataIndex: 'couponNum',
            editable: true,
        },
        {
            title: '删除',
            dataIndex: 'operation',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                        <a>删除</a>
                    </Popconfirm>
                ) : null,
        },
    ];

    const handleAdd = () => {
        const newData = {
            key: count,
            name: `正规按摩房 ${count}`,
        };
        setDataSource([...dataSource, newData]);
        setCount(count + 1);
    };

    const handleSave = (row) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setDataSource(newData);
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };
    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });
////////////////////////////////////        表单布局开始         ////////////////////////////////////////////////


    return (
        <>
            <Header title="房型维护" />
            <Button
                onClick={handleAdd}
                type="primary"
                style={{
                    marginBottom: 10,
                }}
            >
                添加房间
            </Button>
            <Table
                
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                columns={columns}
            />
        </>
    )
}

export default Room;