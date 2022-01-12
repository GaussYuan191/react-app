import request from '@/utils/request';
export function updateCustomer (id, name, code) {
    return request({
        url: '/customer/update',
		method: 'put',
		data: {
			name: name,
			code: code,
            id: id
		},
    })
}