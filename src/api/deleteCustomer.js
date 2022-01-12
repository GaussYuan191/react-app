import request from '@/utils/request';

export function deleteCustomer(id) {
	return request({
		url: '/customer/deleteById/' + id,
		method: 'delete',
        data: {}
	});
}