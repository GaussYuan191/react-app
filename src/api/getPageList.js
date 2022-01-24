import request from '@/utils/request';

export function getPageList(reqPageNum, reqPageSize, name) {
	return request({
		url: '/customer/pageList',
		method: 'post',
		data: {
			reqPageNum: reqPageNum,
			reqPageSize: reqPageSize,
			name: name
		},
	});
}
