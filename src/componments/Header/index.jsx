import React, { Component } from 'react';
import {
	UserOutlined,
	RollbackOutlined,
	MenuUnfoldOutlined,
	MenuFoldOutlined,
} from '@ant-design/icons';
import './index.less';
import store from "@/store";
import actionCreators from "@/store/mine/actionCreators"
import loginOut from "@/utils/loginOut"
const {mine : {user}} = store.getState()
const { changeCollapsed } = actionCreators;

export default class Headers extends Component {
    toggle = () => {
        // 点击右侧导航栏
        changeCollapsed(user.collapsed)(store.dispatch)
        this.setState({})
		console.log(user.name)
      };
	  loginOut = () => {
		  return () => {
			loginOut()
		  }
	  }
	render() {
		return (
			<div className="header">
				{React.createElement(
					 user.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
					{
						className: 'trigger',
						onClick: this.toggle,
                        style:{ color: '#fff' }
					}
				)}
				<div className="header-r fr">
					<div className="user-icon fl">
						<UserOutlined />
						<span className="username">{user.name == '' ? 'username' : user.name}</span>
					</div>

					<div className="back-icon fr" onClick={this.loginOut()}>
						<RollbackOutlined />
						<span className="back-text">退出登入</span>
					</div>
				</div>
			</div>
		);
	}
}
