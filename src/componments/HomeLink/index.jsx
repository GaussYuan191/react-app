import React, { Component } from 'react';
import { Breadcrumb, Menu } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import './index.less'
// console.log('ss', routers)
const routes = [
	{
		path: '/home/user-manage',
		breadcrumbName: '用户管理',
	},
	{
		path: '/home/manage-license',
		breadcrumbName: '许可凭证文件管理',
	},
	{
		path: '/home/create-license',
		breadcrumbName: '制作许可凭证',
	},
];
const menu = (
	<Menu>
		<Menu.Item>
			<Link to={'/home/user-manage'}>用户管理</Link>
		</Menu.Item>
		<Menu.Item>
			<Link to={'/home/manage-license'}>许可凭证文件管理</Link>
		</Menu.Item>
		<Menu.Item>
			<Link to={'/home/create-license'}>制作许可凭证</Link>
		</Menu.Item>
	</Menu>
);
class HomeLink extends Component {
	dealName = () => {
		let path = this.props.location.pathname;
		let breadcrumbName = routes.map((item) => {
			if (item.path === path) return item.breadcrumbName;
		});
		return breadcrumbName;
	};
	render() {
		return (

				<Breadcrumb style={{lineHeight:"40px", marginLeft:"20px"}}>
					<Breadcrumb.Item href="">
						<HomeOutlined style={{color: 'black'}}/>
					</Breadcrumb.Item>
					<Breadcrumb.Item overlay={menu}>
						<UserOutlined />
						<a href="">{this.dealName()}</a>
					</Breadcrumb.Item>
				</Breadcrumb>
		);
	}
}

export default withRouter(HomeLink);
