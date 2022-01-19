import download from '@/utils/download';
// 数据字典子项查询接口
export function exportLicense(ids) {
	return download({
		url: '/license/generator/export',
		method: 'post',
		data: {  
        },
		params: {
			ids:ids
		},
		responseType: 'blob'
	});
}