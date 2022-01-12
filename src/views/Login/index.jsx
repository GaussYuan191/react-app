
import { Form, Input, Button, Checkbox ,Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import React, { Component } from 'react'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import './index.less';
import actionCreators from "../../store/mine/actionCreators"

import store from "../../store";

const { login } = actionCreators;
export default class Login extends Component {
    onFinish = (values) => {
       login(values.username, values.password)(store.dispatch).then(() => {
           this.props.history.push('/')
       })
    
    };
    render() {
        return (
            <div className="login-wrapper">
                <div className="login-content"> 
                <Card className='login'>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={this.onFinish}
                        >
                        <Form.Item className="login-svg-icon">
                            
                            
                            <svg t="1641347405173" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2604" width="64" height="64"><path d="M994.048 857.7024a36.4544 36.4544 0 0 0-70.6048 17.8688c5.5808 22.2208 9.4208 44.9024 11.4176 67.8912H89.1904c18.432-216.1152 199.5776-386.4064 420.096-387.7888 0.9216 0 1.7408 0.256 2.6624 0.256a256 256 0 1 0-256-256c0 84.8896 41.7792 159.5904 105.4208 206.1312C160.6144 570.0096 14.6944 758.1696 14.6944 979.8656c0 20.1216 16.3328 36.4544 36.4544 36.4544h921.6a36.4544 36.4544 0 0 0 36.4544-36.4544 494.1312 494.1312 0 0 0-15.1552-122.1632zM512 120.832c98.816 0 179.2 80.384 179.2 179.2s-80.384 179.2-179.2 179.2-179.2-80.384-179.2-179.2 80.384-179.2 179.2-179.2z" fill="#438CFF" p-id="2605"></path><path d="M579.7376 666.368a38.4 38.4 0 1 0-54.3232 54.3232l129.8432 129.792a38.2976 38.2976 0 0 0 54.272 0l274.6368-274.6368a38.4 38.4 0 1 0-54.3232-54.3232l-247.5008 247.5008-102.6048-102.656z" fill='#409eff' p-id="2606"></path></svg>
                        </Form.Item>
                        <Form.Item className="login-title">
                        许可管理系统
                        </Form.Item>
                        <Form.Item
                            name="username"
                            rules={[
                            {
                                required: true,
                                message: '请输入你的用户名!',
                            },
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" style={{ color: '#409eff' }} />}   placeholder="用户名" />
                            
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                            {
                                required: true,
                                message: '请输入你的密码!',
                            },
                            ]}
                        >
                            
                            <Input.Password
                            placeholder="密码"
                            prefix={<LockOutlined className="site-form-item-icon" style={{ color: '#409eff' }} />}
                            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                            
                        </Form.Item>
                        <Form.Item>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>记住密码</Checkbox>
                            </Form.Item>
                        </Form.Item>

                        <Form.Item className='btn-submit'>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                            </Button>
                            
                        </Form.Item>
                    </Form>
                    </Card>
                </div>
            </div>
        )
    }
}


