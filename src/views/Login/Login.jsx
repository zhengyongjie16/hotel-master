import React, { Component } from 'react'
import { loginAdmin } from '../../api/admin'
import 'antd/dist/antd.css';
import './Login.scss';
import  withRouter  from '../../util/withRouter'
import { Button, Checkbox, Form, Input, message } from 'antd';
import { connect  } from 'react-redux'
import { setAdminInfo } from '../../store/adminSlice'



class  Login  extends Component {

    onFinish = async (values) => {
        console.log('Success:', values);

        let res = await loginAdmin(values)
        
        const { success } = res;
        if(success){
            message.success('登录成功')
            this.props.dispatch(setAdminInfo(res.data)) 
            this.props.navigate('/index',{replace:true})
    }
        else message.error('用户名或密码错误，登陆失败')
        
    };

    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    render(){
    return (
        <div className='login'>
            <Form
                style={{ marginRight: "50px" }}
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
                onFinish={ this.onFinish }
                onFinishFailed={ this.onFinishFailed }
                autoComplete="off"
            >
                <Form.Item
                    label="用户名"
                    name="name"
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
                    name="pwd"
                    rules={[
                        {
                            required: true,
                            message: '请输入你的密码!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

               {/*  {<Form.Item
                    name="remember"
                    valuePropName="checked"
                    wrapperCol={{
                        offset: 7,
                        span: 16,
                    }}
                >
                    <Checkbox>记住用户名及密码</Checkbox>
                </Form.Item>} */}

                <Form.Item
                    wrapperCol={{
                        offset: 10,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit" style={{ width: '120px' }}>
                        登陆
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
};

const mapStateToProps = (state)=>({...state})

export default connect(mapStateToProps)(withRouter(Login));;