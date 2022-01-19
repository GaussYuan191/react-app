import React, { Component } from 'react'
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { routers } from '@/routers/config';

// console.log('ss', routers)
export default class HomeLink extends Component {

    state = {routerLlist: routers};
    itemRender = (route, params, routes, paths) => {
      console.log("route=", route);
      console.log("params=", params);
      console.log('routes=', routes);
      console.log('paths=', paths);
        const last = routes.indexOf(route) === routes.length - 1;
        return last ? (
          <span>{route.breadcrumbName}</span>
        ) : (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        );
      }
    componentDidMount = () => {
      this.dealRouter()
    }  
    dealRouter = () => {
      let {routerLlist} = this.state;
      let newRouters =  routerLlist.filter(item => !item.to)
      console.log("newrouter", newRouters)
      this.setState({routerLlist: newRouters})
    }
    render() {
      console.log('sss', routers)
      const {routerLlist} = this.state;
        return (
            <Breadcrumb itemRender={this.itemRender} routes={routerLlist}/>
        )
    }
}
