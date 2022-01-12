import request from '@/utils/request';
// 数据字典子项查询接口
export function listAllSub(parentDicCode) {
	return request({
		url: '/parmeter/dics/listAllSub',
		method: 'post',
		data: {  
        },
		params: {
			parentDicCode:parentDicCode
		}
	});
}