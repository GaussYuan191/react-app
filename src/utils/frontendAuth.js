import { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from '@/utils/auth'

const ROOT_PAGE   = "/";
const LOGIN_PAGE  = "/login";
const ERROR_PAGE  = "/error";
const HOME_PAGE   = "/home";

class FrontendAuth extends Component {

    render() {
        const pathname = this.props.location.pathname;
        const isLogin = isAuthenticated();
        console.log('本地路由配置', this.props.routerConfig);
        // 在非登陆状态下，访问不需要权限校验的路由
        const targetRouterConfig = this.props.routerConfig.find(item => pathname.indexOf(item.path) != -1);
        if (targetRouterConfig && !targetRouterConfig.auth && !isLogin) {
            return <Route exact path={pathname} component={targetRouterConfig.component} />;
        }

        if (isLogin) {
            // 如果是登陆状态，想要跳转到登陆，重定向到主页
            if (pathname === LOGIN_PAGE) {
                return <Redirect to={HOME_PAGE} />;
            } 
            
            if (pathname === ROOT_PAGE) {
                return <Redirect to={HOME_PAGE} />;
            } 
            // 如果路由合法，就跳转到相应的路由
            console.log('路由配置',targetRouterConfig)
            console.log('路径',pathname)
            console.log('ishome',String(pathname).indexOf(HOME_PAGE))
            // if (targetRouterConfig) {
                
            //     return <Route path={pathname} component={targetRouterConfig.component} />;
            // } 
            // 判断是不是/home 路径下的路径
            if (String(pathname).indexOf(HOME_PAGE) != -1) {
                
                return <Route path={pathname} component={targetRouterConfig.component} />;
            } 
            console.log("ddjjdj")

            // 如果路由不合法，重定向到 404 页面
            return <Redirect to={ERROR_PAGE} />;
        }

        if (!isLogin) {
            // 非登陆状态下，当路由合法时且需要权限校验时，跳转到登陆页面，要求登陆
            if (targetRouterConfig && targetRouterConfig.auth) {
                return <Redirect to={LOGIN_PAGE} />;
            } 
            // 非登陆状态下，路由不合法时，重定向至 404
            return <Redirect to={ERROR_PAGE} />;
        }

    }
}
export default FrontendAuth;