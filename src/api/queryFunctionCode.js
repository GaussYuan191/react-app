import request from '@/utils/request';
// 查询功能菜单
export function queryFunctionCode() {
	return request({
		url: '/parmeter/queryFunctionCode',
		method: 'post',
		data: {}
	});
}
