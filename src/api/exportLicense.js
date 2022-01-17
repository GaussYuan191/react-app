import request from '@/utils/request';
// 数据字典子项查询接口
export function exportLicense(ids) {
	return request({
		url: '/license/generator/export',
		method: 'post',
		data: {  
        },
		params: {
			ids:ids
		}
	});
}