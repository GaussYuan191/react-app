import React, { Component } from 'react'
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { routers } from '@/routers/config';
export default class HomeLink extends Component {
    itemRender = (route, params, routes, paths) => {
        const last = routes.indexOf(route) === routes.length - 1;
        return last ? (
          <span>{route.breadcrumbName}</span>
        ) : (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        );
      }
      
    render() {
        return (
            <Breadcrumb itemRender={this.itemRender} routes={routers}/>
        )
    }
}
