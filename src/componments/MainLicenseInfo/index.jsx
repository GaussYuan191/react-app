import React, { Component } from 'react';
import './index.less';
import {
	Form,
	Button,
	Select,
	Card,
	Table,
	Space,
	Divider,
	DatePicker,
	Row,
	Col,
	message,
} from 'antd';

const { Option } = Select;
const { RangePicker } = DatePicker;
// 时间选择器的配置
const rangeConfig = {
	rules: [
		{
			type: 'array',
			required: true,
			message: '请选择许可期限',
		},
	],
};
const columns = [
	{
		title: '许可名称',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: '许可授权',
		dataIndex: 'right',
		key: 'right',
		render: (text, record) => {
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
						checkedNode = record;
						console.log('选择的值', checkedNode);
						chanageData();
					}}
				/>
			);
		},
	},
];

function chanageData() {
	this.chanageTree();
}
let checkedNode = null; // 保存修改的节点
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
// 保存提交的数据
let resultData = {
	version: '1.0',
};
export default class MainLicenseInfo extends Component {
	formRef = React.createRef();
	state = { customerList: [], licenseList: data, loading: false , initFlag: false};
	// 提交
	onFinish = (values) => {
		let { licenseList } = this.state;
		// 如果是正式的权限
		if (values.permission == 'formal') {
			resultData.permission = '2';
			resultData.beginDate = null;
			resultData.endDate = null;
		} else {
			resultData.permission = '1';
			resultData.beginDate = values.times[0].format('YYYY-MM-DD');
			resultData.endDate = values.times[1].format('YYYY-MM-DD');
		}
		let nodeList = [];
		let getNode = (nodes) => {
			if (nodes == null) return null;
			if (nodes.children != null) {
				nodes.children.forEach((item) => {
					getNode(item);
				});
			} else {
				let node = {};
				node.code = nodes.key;
				node.right = nodes.right;
				node.name = nodes.name;
				nodeList.push(node);
			}
		};
		// 处理功能许可集合
		getNode(licenseList[0]);
		resultData.customerLicenseFunctionList = nodeList;
		nodeList = [];
		// 处理接口许可集合
		getNode(licenseList[1]);
		resultData.customerLicenseInterfaceList = nodeList;
		nodeList = [];
		// 处理数据许可集合
		getNode(licenseList[2]);
		resultData.customerLicenseDataList = nodeList;
		nodeList = [];

		resultData.customerId = values.customerId;
		console.log('最后结果', resultData);
		// addLicense(resultData).then((res) => {
		// 	message.success('新增成功！');
		// });
	};
	// 重置
	onReset = () => {
		this.formRef.current.resetFields();
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
		nums.right = 1; // 初始化权限
		nums.parentKey = parentKey; // 绑定祖父节点的key
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
	};
	// 深拷贝对象
	deepCopy = (object) => {
		if (!object || typeof object !== 'object') return;

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
	chanageTree = () => {
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

	// 初始化数据
	dataInit = () => {
		let { licenseList } = this.state;
		let defaultLicenseList = this.props.defaultLicenseList;
		let defaultCustomerList = this.props.defaultCustomerList;
		const {initFlag} = this.setState;
		console.log(initFlag)
		if (initFlag) {
			return;
		}
		console.log('开始处理数据', defaultLicenseList, defaultCustomerList)
		if (defaultLicenseList == undefined || defaultLicenseList.length == 0 || defaultCustomerList == undefined || Object.keys(defaultCustomerList).length == 0) {
			return;
		}

		console.log('权限数据11', defaultLicenseList, defaultCustomerList);
		defaultLicenseList.forEach((arr, index) => {
			arr.forEach((item) => {
				this.dealTree(item, licenseList[index].key);
			});
			licenseList[index].children = arr;
		});
		let newlist = this.dealCustomer(defaultCustomerList.list);
		this.setState({ licenseList: licenseList ,customerList: newlist ,initFlag:true});
	};
	componentDidMount = () => {
		chanageData = chanageData.bind(this);
		// 子组件延时加载数据
		setTimeout(()=> {
			this.dataInit();
		},1000);
	};
	render() {
		const { customerList, licenseList, loading } = this.state;
		return (
			<Form ref={this.formRef} name="lincenseList" onFinish={this.onFinish}>
				<Card title="基本信息" headStyle={{ backgroundColor: '#d9edf7' }}>
					{/* 许可权限选择 */}
					<Row>
						<Col span={12}>
							<Form.Item
								name="permission"
								label="许可权限"
								rules={[
									{
										required: true,
										message: '请选择许可权限',
									},
								]}
								labelCol={{ span: 6 }}
								wrapperCol={{ span: 14 }}
							>
								<Select placeholder="请选择" allowClear>
									<Option value="informal">试用</Option>
									<Option value="formal">正式</Option>
								</Select>
							</Form.Item>
						</Col>

						<Col span={12}>
							{/* 客户选择 */}
							<Form.Item
								name="customerId"
								label="客户"
								rules={[
									{
										required: true,
										message: '请选择客户',
									},
								]}
								labelCol={{ span: 4 }}
								wrapperCol={{ span: 14 }}
							>
								<Select
									showSearch
									placeholder="请选择"
									optionFilterProp="label"
									allowClear
									options={customerList}
									filterOption={(inputValue, option) => {
										return (
											option.label
												.toUpperCase()
												.indexOf(inputValue.toUpperCase()) !== -1
										);
									}}
								></Select>
							</Form.Item>
						</Col>

						{/* 如果选择是试用，出现时间选择框 */}
						<Col span={12}>
							<Form.Item
								noStyle
								shouldUpdate={(prevValues, currentValues) =>
									prevValues.permission !== currentValues.permission
								}
							>
								{({ getFieldValue }) =>
									getFieldValue('permission') === 'informal' ? (
										<Form.Item
											name="times"
											label="许可期限"
											{...rangeConfig}
											labelCol={{ span: 6 }}
											wrapperCol={{ span: 14 }}
										>
											<RangePicker />
										</Form.Item>
									) : null
								}
							</Form.Item>
						</Col>
					</Row>
				</Card>
				<Divider />
				<Card title="许可明细" headStyle={{ backgroundColor: '#d9edf7' }}>
					<Space align="center" style={{ marginBottom: 16 }}></Space>
					<Table
						columns={columns}
						rowSelection={undefined}
						pagination={{ position: ['none', 'none'] }}
						scroll={{ y: 400 }}
						dataSource={licenseList}
						loading={loading}
					/>
				</Card>
				<Divider />
				<Form.Item>
					<Space size={20}>
						<Button type="primary" htmlType="submit">
							提交
						</Button>
						<Button htmlType="button" onClick={this.onReset}>
							重置
						</Button>
					</Space>
				</Form.Item>
			</Form>
		);
	}
}
