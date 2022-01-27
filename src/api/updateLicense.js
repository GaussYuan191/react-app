import request from '@/utils/request';
export function updateLicense(data) {
	return request({
		url: '/license/update',
		method: 'put',
		data: data,
	});
}
