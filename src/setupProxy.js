const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
	app.use(
		['/user', '/customer', '/parmeter', '/license'],
		createProxyMiddleware({
			// 要匹配的请求路径片段
			target: 'http://192.168.7.166:10068/', // 要代理到的地址
			changeOrigin: true,
			pathRewrite: {
				// 替换url中匹配片段
				'^/': '/bmtp-license-manage/',
			},
		})
	);
	app.use(
		'/mock',
		createProxyMiddleware({
			target: 'http://localhost:8081/',
			changeOrigin: true,
			pathRewrite: {
				'^/mock': '',
			},
		})
	);
};
