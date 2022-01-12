
import state from './state.js'
import * as type from './type.js'
import { setToken, removeToken } from '@/utils/auth'

const reducer = (previousState = state,action) => {
    let newState = {
        ...previousState
    };
    switch (action.type) {
        case type.LOGIN:
            newState.user.token = action.payload[0];
            newState.user.name = action.payload[1]
            setToken(action.payload[0]);
            break;
        case type.CHANGE_COLLAPSED:
            newState.user.collapsed = !action.payload; 
            break;
        case type.LOGIN_OUT:
            newState.user.token = '';
            removeToken();
            break;
        default:
            break;
    }
    return newState
}
export default reducer;

