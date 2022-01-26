import React, { Component } from 'react'
import Headers from '../../componments/Header'
import Menus from '@/componments/Menus';
import './index.less';
import { Layout } from 'antd';
import store from "@/store";
import HomeLink from '@/componments/HomeLink';
const { Header, Sider, Content } = Layout;


export default class Home  extends Component {
  render() {
    const {mine : {user}} = store.getState()
    store.subscribe(()=>{
        this.setState({})
    })
    return (
      
      <Layout>
        <Sider trigger={null} collapsible collapsed={user.collapsed} 
      >
        <Menus {...this.props}></Menus>
        </Sider>
        <Layout className="site-layout" style={{}}>
          <Header className="site-layout-background" style={{ padding: 0 , height:50}}>
            
            <Headers></Headers>
          </Header>
          <HomeLink></HomeLink>
          <Content
            className="site-layout-background"
            style={{
              margin: 0,
              padding: 16,
              // minHeight: 300,
              height: 'calc(100vh - 50px)',
              overflow: 'auto',
              backgroundColor: '#fff'
            }}
          >
            {/* <HomeLink></HomeLink> */}

            {
              this.props.children
            }
          </Content>
        </Layout>
      </Layout>
    );
  }
}
