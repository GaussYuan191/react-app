import request from '@/utils/request';
export function addLicense (data) {
    return request({
        url: '/license/add',
		method: 'post',
		data: data
    })
}