import request from '@/utils/request';

export function getLicenseList(reqPageNum, reqPageSize) {
	return request({
		url: '/license/pageList',
		method: 'post',
		data: {
			reqPageNum: reqPageNum,
			reqPageSize: reqPageSize,
		},
	});
}