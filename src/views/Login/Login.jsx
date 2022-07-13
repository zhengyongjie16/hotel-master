import React,{ Component } from 'react'
import { loginAdmin } from '../../api/admin'
import 'antd/dist/antd.css';
import './Login.scss';
import { Button, Checkbox, Form, Input } from 'antd';



const Login = () => {

    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className='login'>
        <Form
        style={{marginRight:"50px"}}
            name="basic"
            labelCol={{
                span: 7,
            }}
            wrapperCol={{
                span: 15,
            }}
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item
                label="用户名"
                name="username"
                rules={[
                    {
                        required: true,
                        message: '请输入你的用户名!',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="密码"
                name="password"
                rules={[
                    {
                        required: true,
                        message: '请输入你的密码!',
                    },
                ]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                name="remember"
                valuePropName="checked"
                wrapperCol={{
                    offset: 7,
                    span: 16,
                }}
            >
                <Checkbox>记住用户名及密码</Checkbox>
            </Form.Item>

            <Form.Item
                wrapperCol={{
                    offset: 10,
                    span: 16,
                }}
            >
                <Button type="primary" htmlType="submit" style={{width:'120px'}}>
                    登陆
                </Button>
            </Form.Item>
        </Form>
        </div>
    );
};


export default Login;