// 一级路由
import Home from '@/views/Home';
import Login from '@/views/Login';
// 二级路由
import { UserManage, ManageLicense, CreateLicense } from "@/views/Manage";

export const ROOT_PAGE = '/';
export const LOGIN_PAGE = '/login';
export const ERROR_PAGE = '/error';
export const HOME_PAGE = '/home';


export const routers =  [
    {
        from: "/",
        to: "/home"
    },
    {
        path: "/home",
        component: Home,
        breadcrumbName: '首页',
        children: [
            {
                from: "/home",
                to: "/home/user-manage"
            },
            {
                path: "/home/user-manage",
                component: UserManage,
                breadcrumbName: "用户管理"
            },
            {
                path: "/home/manage-license",
                component: ManageLicense,
                breadcrumbName: "许可凭证文件管理"
            },
            {
                path: "/home/create-license",
                component: CreateLicense,
                breadcrumbName: "制作许可凭证"
            },
            
        ]
    },
    {
        path: "/login",
        component: Login,
        breadcrumbName: "登录"
    },
]
