import React, { Component } from 'react';
import Headers from '../../componments/Header';
import Menus from '@/componments/Menus';
import './index.less';
import { Layout } from 'antd';
import store from '@/store';
import HomeLink from '@/componments/HomeLink';
const { Header, Sider, Content } = Layout;

export default class Home extends Component {
	render() {
		const {
			mine: { user },
		} = store.getState();
		store.subscribe(() => {
			this.setState({});
		});
		return (
			<Layout>
				<Sider trigger={null} collapsible collapsed={user.collapsed}>
					<Menus {...this.props}></Menus>
				</Sider>
				<Layout className="site-layout" style={{}}>
					<Header
						className="site-layout-background"
						style={{ padding: 0, height: 90 }}
					>
						<Headers></Headers>
            <HomeLink></HomeLink>
					</Header>

					<Content
						className="site-layout-background"
						style={{
							margin: 0,
              padding: 24,
							height: 'calc(100vh - 90px)',
							overflow: 'auto',
							backgroundColor: '#fff',
						}}
					>
						
						{this.props.children}
					</Content>
				</Layout>
			</Layout>
		);
	}
}
