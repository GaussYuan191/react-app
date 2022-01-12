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
	AutoComplete,
} from 'antd';
import { getPageList } from '@/api/getPageList.js';
import { listAllSub } from '@/api/listAllSub.js';
import { queryFunctionCode } from '@/api/queryFunctionCode.js';

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
			const { key, right } = record;
			console.log('ss', right);
			return (
				<Select
					options={[
						{ label: '有权限', value: 0 },
						{ label: '无权限', value: 1 },
					]}
					defaultValue={right}
					Value={right}
					onChange={(value) => {
						record.right = value;
						console.log('选择的值', key, value, record);
						chanageData('ss');
					}}
				/>
			);
		},
	},
];

function chanageData(val) {
	console.log(val);
	this.setState({});
	this.chanageTree();
}
const data = [
	{
		key: 'customerLicenseFunctionList',
		name: '功能许可',
		right: 0,
		children: [],
	},
	{
		key: 'customerLicenseInterfaceList',
		name: '接口许可',
		right: 0,
		children: [],
	},
	{
		key: 'customerLicenseDataList',
		name: '数据许可',
		right: 0,
		children: [],
	},
];

export default class CreateLicense extends Component {
	formRef = React.createRef();
	state = { licenseList: data, customerList: [] };
	// 提交
	onFinish = (values) => {
		console.log(values);
	};
	// 重置
	onReset = () => {
		this.formRef.current.resetFields();
	};
	// 处理树形数据
	dealTree = (nums) => {
		if (nums == null) return;
		if (nums.children != null) {
			nums.children.forEach((item) => {
				this.dealTree(item);
			});
		}
		nums.name = nums.menuName || nums.dicExplain;
		nums.key = nums.menuCode || nums.id;
		nums.right = 1;
	};
	// 处理客户数据
	dealCustomer = (lists) => {
		let newList = [];
		lists.map((item) => {
			newList.push({ value: item.name, key: item.id });
		});
		return newList;
	};
	// 处理权限修改后的数据
	chanageTree = () => {
		let { licenseList } = this.state;
		let dealLicenseList = (record) => {
			if (record == null) return null;
			console.log('record.children', record.children);
			if (record.children != null) {
				let chFlag = -1;
				record.children.forEach((item) => {
					chFlag =
						chFlag == -1 ? item.right : chFlag == item.right ? chFlag : -2;
				});
				console.log('ChFlog1111111', chFlag);
				if (chFlag != -2) {
					record.right = chFlag;
				} 
				record.children.forEach((item) => {
					dealLicenseList(item);
				});
			}
		};
		licenseList.forEach(item=> {
			dealLicenseList(item);
		})
		
		console.log('处理的结果', licenseList);
		this.setState({licenseList: licenseList});
	};

	// 初始化数据
	dataInit = () => {
		let { licenseList } = this.state;
		let resultList = [];
		resultList.push(queryFunctionCode());
		resultList.push(listAllSub(1050006));
		resultList.push(listAllSub(1030308));
		Promise.all(resultList).then(
			(res) => {
				console.log('权限数据', res);
				res.forEach((arr, index) => {
					arr.forEach((item) => {
						this.dealTree(item);
					});
					licenseList[index].children = arr;
				});
				console.log(licenseList);

				this.setState({ licenseList: licenseList });
			},
			(err) => {
				console.log(err);
			}
		);
		getPageList(1, 1000).then((res) => {
			let newlist = this.dealCustomer(res.list);
			console.log('客户数据', res);
			this.setState({ customerList: newlist });
		});
	};
	componentDidMount = () => {
		this.dataInit();
		chanageData = chanageData.bind(this);
	};
	render() {
		const { licenseList, customerList } = this.state;
		console.log('ssssss', licenseList);
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
								name="customer"
								label="客户"
								rules={[
									{
										required: true,
										message: '请选择客户',
									},
								]}
								labelCol={{ span: 4 }}
							>
								<AutoComplete
									allowClear
									autoFocus
									options={customerList}
									placeholder="请选择"
									filterOption={(inputValue, option) =>
										option.value
											.toUpperCase()
											.indexOf(inputValue.toUpperCase()) !== -1
									}
								/>
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
											name="range-picker"
											label="许可期限"
											{...rangeConfig}
											labelCol={{ span: 6 }}
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
