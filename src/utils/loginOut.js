import { removeToken } from '@/utils/auth'
export default function loginOut () {
    removeToken();
    window.location = '/login';
}