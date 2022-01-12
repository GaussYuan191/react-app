import request from '@/utils/request';
export function addCustomer (name, code) {
    return request({
        url: '/customer/add',
		method: 'post',
		data: {
			name: name,
			code: code,
		},
    })
}