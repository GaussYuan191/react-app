import React, { Component } from 'react'
import { Menu, Button } from 'antd';
import {
  VideoCameraOutlined
} from '@ant-design/icons';
import './index.less';
import store from "@/store";
import { Link } from 'react-router-dom';
import { Route, Redirect, withRouter} from "react-router-dom";

const { SubMenu } = Menu;
const {mine : {user}} = store.getState()
const openKeys = ["/home/user-manage", "/home/create-license" ,"/home/manage-license", ]
class Menus extends Component {
      handleClick = (e) => {
        this.props.history.push(`${e.key}`);
      }
      render() {
        return (
          <div>
          <div className="logo">{user.collapsed ? 'YSS' : '许可管理系统'}</div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} onClick={this.handleClick} >
    

            <SubMenu key="sub1" icon={<VideoCameraOutlined  />} title="客户许可管理">
            <Menu.Item key = {openKeys[0]}>客户管理</Menu.Item>
            <Menu.Item key = {openKeys[1]}>制作许可凭证</Menu.Item>
            <Menu.Item key = {openKeys[2]}>许可凭证文件管理</Menu.Item>
            </SubMenu>
            
          </Menu>
          </div>
        );
      }
}
export default withRouter(Menus);