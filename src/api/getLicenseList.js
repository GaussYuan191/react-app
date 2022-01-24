import request from '@/utils/request';

export function getLicenseList(reqData) {
	return request({
		url: '/license/pageList',
		method: 'post',
		data: reqData,
	});
}