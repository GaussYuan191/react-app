import React, { Component } from 'react';
import './index.less';
import LicenseInfo from '@/componments/LicenseInfo';
import BaseInfo from '@/componments/BaseInfo';
import { getPageList } from '@/api/getPageList.js';
import { listAllSub } from '@/api/listAllSub.js';
import { queryFunctionCode } from '@/api/queryFunctionCode.js';
import { addLicense } from '@/api/addLicense.js';
import { message, Divider, Space, Button } from 'antd';
import { values } from 'lodash';
let data = [
	{
		key: 'customerLicenseFunctionList',
		name: '功能许可',
		right: "1",
		children: [],
	},
	{
		key: 'customerLicenseInterfaceList',
		name: '接口许可',
		right: "1",
		children: [],
	},
	{
		key: 'customerLicenseDataList',
		name: '数据许可',
		right: "1",
		children: [],
	},
];

export default class CreateLicense extends Component {
	baseInfoForm = React.createRef();
	state = { defaultCustomerList: [], licenseList: data,getLicense: ()=>{} };
	// 深拷贝对象
	deepCopy = (object) => {
		if (!object || typeof object !== 'object') return null;

		let newObject = Array.isArray(object) ? [] : {};

		for (let key in object) {
			// 防止拷贝对象原型链上的属性 hasOwnProperty,不会判断原型链上的属性
			if (object.hasOwnProperty(key)) {
				newObject[key] =
					typeof object[key] === 'object'
						? this.deepCopy(object[key])
						: object[key];
			}
		}

		return newObject;
	};
	// 处理树形数据
	dealTree = (nums, parentKey) => {
		if (nums == null) return;
		if (nums.children != null) {
			nums.children.forEach((item) => {
				this.dealTree(item, parentKey);
			});
		}
		nums.name = nums.menuName || nums.dicExplain;
		nums.key = nums.menuCode || nums.dicCode;
		nums.right = "1"; // 初始化权限
		nums.parentKey = parentKey; // 绑定祖父节点的key
	};
	dealLicense = (defaultLicenseList) => {
		let { licenseList } = this.state;
		let newLicenseList = this.deepCopy(licenseList);
		console.log('开始处理数据', defaultLicenseList);
		if (defaultLicenseList == undefined || defaultLicenseList.length == 0) {
			return;
		}
		defaultLicenseList.forEach((arr, index) => {
			arr.forEach((item) => {
				this.dealTree(item, newLicenseList[index].key);
			});
			newLicenseList[index].children = arr;
		});
		console.log("处理结果", newLicenseList)
		this.setState({ licenseList: newLicenseList });
	};
	// 处理客户数据
	dealCustomer = (lists) => {
        if ( lists == null || lists == undefined || lists.length == 0 ) return;
		let newList = [];
		// label 为显示的值, value 为选中的值
		lists.map((item) => {
			newList.push({ label: item.name, value: item.id, key: item.id });
		});
		return newList;
	}

	dataInit = () => {
		let resultList = [];
		// 构建请求数组
		resultList.push(queryFunctionCode());
		resultList.push(listAllSub(1050006));
		resultList.push(listAllSub(1030308));
		Promise.all(resultList).then(
			(res) => {
				this.dealLicense(res)
			},
			(err) => {
				console.log(err);
			}
		);
		getPageList(1, 1000).then(
			(res) => {
				let newList = this.dealCustomer(res.list)
				console.log('sss',newList)
				this.setState({ customerList: newList });
			},
			(err) => {
				console.log(err);
			}
		);
	};
	dealSubmit = () => {
		let {licenseList} = this.state;
		this.baseInfoForm.current.validateFields().then(res=> {
			console.log('验证',res);
			console.log('aa', licenseList)
		})
	}
	componentDidMount ()  {
		this.dataInit();
	};
	addLicenseInfo = (resultData) => {
		addLicense(resultData).then(
			(res) => {
				message.success('新增成功');
			},
			(err) => {
				console.log('err', err);
			}
		);
	};
	onTableChange = (values) => {
		console.log("从子组件获得", values)
		this.setState({licenseList: values});
	}
	render() {
		const { licenseList, customerList } = this.state;

		return (
			<div>
				<BaseInfo
					wrappedComponentRef={(ref) => {
						this.baseInfoForm = ref;
					}}
					customerList={customerList}
				></BaseInfo>
				<Divider />
				<LicenseInfo licenseList={licenseList} onTableChange={this.onTableChange}></LicenseInfo>
				<Divider />
				<Space size={20}>
					<Button type="primary" htmlType="submit"  onClick={this.dealSubmit}>
						提交
					</Button>
					<Button htmlType="button" onClick={this.onReset}>
						重置
					</Button>
				</Space>
			</div>
		);
		// return <LicenseInfo defaultLicenseList={defaultLicenseList} defaultCustomerList={defaultCustomerList}>

		// </LicenseInfo>
	}
}
