import React, { Component } from 'react';
import { Select, Card, Table, Space } from 'antd';
const { Column } = Table;
let data = [
	{
		key: 'customerLicenseFunctionList',
		name: '功能许可',
		right: 1,
		children: [],
	},
	{
		key: 'customerLicenseInterfaceList',
		name: '接口许可',
		right: 1,
		children: [],
	},
	{
		key: 'customerLicenseDataList',
		name: '数据许可',
		right: 1,
		children: [],
	},
];
export default class LicenseInfo extends Component {
	state = { licenseList: data, loading: false };
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
		nums.right = 1; // 初始化权限
		nums.parentKey = parentKey; // 绑定祖父节点的key
	};
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
	// 处理权限修改后的数据
	chanageTree = (checkedNode) => {
		console.log('选择', checkedNode);
		console.time('aaa');
		let { licenseList } = this.state;
		let dealLicenseList = (record) => {
			if (record == null) return null;
			// console.log('record.children', record);
			if (checkedNode != null && record.key == checkedNode.key) {
				if (record.children != null) {
					let dealChildren = (list, thisRight) => {
						if (list == null) return;
						if (list.children != null) {
							list.children.forEach((item) => {
								dealChildren(item, thisRight);
							});
						}
						list.right = thisRight;
					};
					record.children.forEach((item) => {
						dealChildren(item, record.right);
					});
				}
				checkedNode = null;
				return;
			}
			if (record.children != null) {
				record.children.forEach((item) => {
					dealLicenseList(item);
				});
				let chFlag = -1;
				record.children.forEach((item) => {
					chFlag =
						chFlag == -1 ? item.right : chFlag == item.right ? chFlag : -2;
				});
				// console.log('ChFlog1111111', chFlag);
				if (chFlag != -2) {
					record.right = chFlag;
				}
			}
		};
		let newLicenseList = this.deepCopy(licenseList);
		for (let i = 0; i < newLicenseList.length; i++) {
			// 判断是哪棵权限树发生了修改
			if (
				newLicenseList[i].key == checkedNode.key ||
				newLicenseList[i].key == checkedNode.parentKey
			) {
				dealLicenseList(newLicenseList[i]);
				break;
			}
		}
		this.setState({ licenseList: newLicenseList });
		console.timeEnd('aaa');
		console.log('处理的结果', licenseList);
	};
    // 如果有传入权限数据，展示初始数据
    dataDefaultInit = () => {
        let { licenseList , licenseNode} = this.props;
        console.log("传入的值",licenseList,licenseNode)
        let dealLicenseList = (record) => {
			if (record == null) return null;
			// console.log('record.children', record);
			// if (checkedNode != null && record.key == checkedNode.key) {
			// 	if (record.children != null) {
			// 		let dealChildren = (list, thisRight) => {
			// 			if (list == null) return;
			// 			if (list.children != null) {
			// 				list.children.forEach((item) => {
			// 					dealChildren(item, thisRight);
			// 				});
			// 			}
			// 			list.right = thisRight;
			// 		};
			// 		record.children.forEach((item) => {
			// 			dealChildren(item, record.right);
			// 		});
			// 	}
			// 	checkedNode = null;
			// 	return;
			// }
			if (record.children != null) {
				record.children.forEach((item) => {
					dealLicenseList(item);
				});
				let chFlag = -1;
				record.children.forEach((item) => {
					chFlag =
						chFlag == -1 ? item.right : chFlag == item.right ? chFlag : -2;
				});
				// console.log('ChFlog1111111', chFlag);
				if (chFlag != -2) {
					record.right = chFlag;
				}
			}
		};
		let newLicenseList = this.deepCopy(licenseList);
		for (let i = 0; i < newLicenseList.length; i++) {	
				dealLicenseList(newLicenseList[i]);	
		}
        console.log("默认处理的结果",newLicenseList);
		this.setState({ licenseList: newLicenseList });
    }
    // 没有传入权限数据，展示默认值
	dataInit = () => {
		let { licenseList } = this.state;
		let defaultLicenseList = this.props.licenseList;
		console.log('开始处理数据', defaultLicenseList);
		if (defaultLicenseList == undefined || defaultLicenseList.length == 0) {
			return;
		}
		defaultLicenseList.forEach((arr, index) => {
			arr.forEach((item) => {
				this.dealTree(item, licenseList[index].key);
			});
			licenseList[index].children = arr;
		});
		this.setState({ licenseList: licenseList });
	};
	getLicenseList = () => {
		let { licenseList } = this.state;

		return licenseList;
	};
	componentDidMount = () => {
		setTimeout(() => {
            if (this.props.licenseList[0].children == null) {
                this.dataInit();
            }
			else {
                console.log('默认值',this.props.licenseList)
                this.dataDefaultInit()
            }
			this.props.getLiceseInfo(this.getLicenseList);
		}, 1000);
	};
	render() {
		let { licenseList, loading } = this.state;
		return (
			<Card title="许可明细" headStyle={{ backgroundColor: '#d9edf7' }}>
				<Space align="center" style={{ marginBottom: 16 }}></Space>
				<Table
					rowSelection={undefined}
					pagination={{ position: ['none', 'none'] }}
					scroll={{ y: 400 }}
					dataSource={licenseList}
					loading={loading}
				>
					<Column title="许可名称" dataIndex="name" key="name" />
					<Column
						title="许可授权"
						dataIndex="right"
						key="right"
						render={(text, record) => {
							const { right } = record;
							return (
								<Select
									options={[
										{ label: '有权限', value: 1 },
										{ label: '无权限', value: 0 },
									]}
									value={right}
									onChange={(value) => {
										record.right = value;
										let checkedNode = record;
										console.log('选择的值', record, value);
										this.chanageTree(checkedNode);
									}}
								/>
							);
						}}
					/>
				</Table>
			</Card>
		);
	}
}
