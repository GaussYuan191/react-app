import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
// 添加路由
import {BrowserRouter} from 'react-router-dom'
// 引入样式
import 'antd/dist/antd.css'
import './index.less';
import './reset.less';
// 全局配置中文
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { ConfigProvider } from 'antd';
moment.locale('zh-cn')

ReactDOM.render(
  <BrowserRouter>

<ConfigProvider locale={zh_CN}>
  <App />
</ConfigProvider>
  </BrowserRouter>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
