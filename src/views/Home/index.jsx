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
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
      }}>
        <Menus {...this.props}></Menus>
        </Sider>
        <Layout className="site-layout" style={{ marginLeft: 200 }}>
          <Header className="site-layout-background" style={{ padding: 0 , height:50}}>
            
            <Headers></Headers>
          </Header>
          {/* <HomeLink></HomeLink> */}
          <Content
            className="site-layout-background"
            style={{
              margin: 0,
              padding: 16,
              minHeight: 300,
              overflow: 'initial',
              backgroundColor: '#fff'
            }}
          >

            {
              this.props.children
            }
          </Content>
        </Layout>
      </Layout>
    );
  }
}
