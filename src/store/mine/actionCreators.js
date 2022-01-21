import * as type from './type.js';
import { login as Login } from '../../api/login.js';

export const login = (username, password) => {
	return async (dispatch) => {
		const result = await Login(username, password);
		console.log(result);
		const action = {
			type: type.LOGIN,
			payload: [result, username],
		};
		dispatch(action);
	};
};
export const changeCollapsed = (collapsed) => {
	return async (dispatch) => {
		const action = {
			type: type.CHANGE_COLLAPSED,
			payload: collapsed,
		};
		dispatch(action);
	};
};
export const loginOut = () => {
	return async (dispatch) => {
		const action = {
			type: type.LOGIN_OUT,
		};
		dispatch(action);
	};
};

const actionCreators = {
	login,
	changeCollapsed,
	loginOut,
};
export default actionCreators;
