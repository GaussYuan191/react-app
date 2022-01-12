import { getToken} from '@/utils/auth'

const state = {
    user: {
        token: getToken(),
        name: '',
        avatar: '',
        roles: [],
        collapsed: false

    }
}
export default state;