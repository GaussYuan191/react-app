import React, { Component } from 'react';
import {
	Form,
	Button,
	Select,
	Row,
	Col,
	Space,
	Divider,
	Table,
	Modal,
	Tag,
	message,
} from 'antd';
import './index.less';
import LicenseInfo from '@/componments/LicenseInfo'
import { getLicenseList } from '@/api/getLicenseList.js';
import { listAllSub } from '@/api/listAllSub.js';
import { queryFunctionCode } from '@/api/queryFunctionCode.js';
import { exportLicense } from '@/api/exportLicense.js';

import { saveAs } from 'file-saver';
//保存文件
import JsZip from 'jszip';
//把文件压缩成zip

const { Option } = Select;
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
export default class ManageLicense extends Component {
	formRef = React.createRef();
	state = {
		licenseList: [],
		visible: false,
		licenseNode: {},
		licenseDefault: data,
		licenseData: [],
		selectNode: [],
		visibleUpdate: false
	};
	onFinish = (values) => {
		let { licenseData } = this.state;
		let { permission } = values;
		let isPermission = permission == 'informal' ? '1' : '2';
		let newLicenseList = licenseData.filter((item) => {
			return item.permission == isPermission;
		});
		console.log(newLicenseList);
		this.setState({ licenseList: newLicenseList });
	};
	onReset = () => {
		let { licenseData } = this.state;
		this.setState({ licenseList: licenseData });
		this.formRef.current.resetFields();
	};
	downloadLicense = () => {
		const { selectNode } = this.state;
		if (selectNode.length == 0) {
			message.error('请选择一条记录!');
		} else {
			let ids = selectNode.join();
			exportLicense(ids).then(
				(res) => {
					let url = window.URL.createObjectURL(
						new Blob([res.data], { type: res.data.type })
					);
					// 创建A标签
					let link = document.createElement('a');
					link.style.display = 'none';
					link.href = url;
					// 设置的下载文件文件名
					const fileName = res.headers['content-disposition'].match("[^=]+$")[0].replace(/\"/g, "");
					// 触发点击方法
					link.setAttribute('download', fileName);
					document.body.appendChild(link);
					link.click();
				},
				(err) => {
					console.log(err);
				}
			);
		}
	};
	updateLicense = () => {
		console.log('开始更新');
		let { selectNode } = this.state;
		let {licenseList} = this.state;
		
		if (selectNode.length == 0) {
			message.error('请选择一条记录');
		} else if (selectNode.length >= 2) {
			message.error('请选择且只能选择一条数据');
		} else {
			console.log(selectNode)
			let newLicenseNode = licenseList.find(item => item.key == selectNode[0].key)
			console.log('yaoo', newLicenseNode)
			this.showUpdate()
		}
		
		
	};
	deleteLicense = () => {
		console.log('开始删除');
	};
	// 显示数据条数
	showTotal = (total) => {
		return `共 ${total} 条`;
	};
	// 显示详细的权限树
	showPermission = (res) => {
		return () => {
			console.log('选择的节点', res);
			this.setState({ licenseNode: res });
			this.showModal();
		};
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
		nums.key = nums.menuCode || nums.dicCode;
		nums.right = 1; // 初始化权限
	};
	showModal = () => {
		this.setState({ visible: true });
	};
	showUpdate = () => {
		this.setState({visibleUpdate: true});
	}
	handleCancel = () => {
		console.log('Clicked cancel button');
		this.setState({ visible: false, licenseNode: {} });
	};
	handleUpdateCancel = () => {
		console.log('取消修改');
		this.setState({visibleUpdate: false})
	}
	// 记录选中的值的ID
	onChange = (value) => {
		console.log(value)
		this.setState({ selectNode: value });
	};
	// 深拷贝
	deepCopy = (obj) => {
		if (!obj || typeof obj !== 'object') return;
		let newObj = Array.isArray(obj) ? [] : {};
		for (let key in obj) {
			if (obj.hasOwnProperty(key)) {
				newObj[key] =
					typeof obj[key] === 'object' ? this.deepCopy(obj[key]) : obj[key];
			}
		}

		return newObj;
	};

	componentDidMount = () => {
		this.dataInit();
	};
	dataInit = () => {
		let { licenseDefault } = this.state;
		let resultList = [];
		resultList.push(queryFunctionCode());
		resultList.push(listAllSub(1050006));
		resultList.push(listAllSub(1030308));
		Promise.all(resultList).then(
			(res) => {
				res.forEach((arr, index) => {
					arr.forEach((item) => {
						this.dealTree(item);
					});
					licenseDefault[index].children = arr;
				});
				this.setState({ licenseDefault: licenseDefault });
			},
			(err) => {
				console.log(err);
			}
		);

		getLicenseList(1, 1000).then((res) => {
			console.log(res);
			res.list.map((item) => {
				item.key = item.id;
			});
			this.setState({ licenseList: res.list, licenseData: res.list });
		});
	};
	render() {
		const { licenseList, visible, licenseNode, licenseDefault, visibleUpdate } = this.state;
		console.log(visible);
		return (
			<div>
				<Modal
					title="许可明细"
					visible={visible}
					onCancel={this.handleCancel}
					width={800}
					footer={null}
					destroyOnClose="true"
				>
					<Table
						rowSelection={undefined}
						pagination={{ position: ['none', 'none'] }}
						scroll={{ y: 400 }}
						dataSource={licenseDefault}
						defaultExpandAllRows="true"
						bordered="true"
					>
						<Column title="许可名称" dataIndex="name" key="name" />
						<Column
							title="许可授权"
							dataIndex="right"
							key="right"
							render={(text, record) => {
								if (record.children == null) {
									let hasPermission =
										licenseNode.customerLicenseDataList.some((item) => {
											return item.code == record.key && item.right == 1;
										}) ||
										licenseNode.customerLicenseInterfaceList.some((item) => {
											return item.code == record.key && item.right == 1;
										}) ||
										licenseNode.customerLicenseFunctionList.some((item) => {
											return item.code == record.key && item.right == 1;
										});
									record.right = hasPermission ? 1 : 0;
									return (
										<Tag
											color={record.right == 1 ? 'success' : 'default'}
											key={record.key}
										>
											{record.right == 1 ? '有权限' : '无权限'}
										</Tag>
									);
								}
							}}
						/>
					</Table>
				</Modal>
				<Modal
					title="许可明细"
					visible={visibleUpdate}
					onCancel={this.handleUpdateCancel}
					width={800}
					footer={null}
					destroyOnClose="true"
				>
				<LicenseInfo dataSource={licenseDefault} licenseNode={licenseNode}></LicenseInfo>	
				</Modal>
				<Form ref={this.formRef} name="selectLicense" onFinish={this.onFinish}>
					<Row>
						<Col span={8}>
							<Form.Item
								name="permission"
								label="许可类型"
								labelCol={{ span: 6 }}
								wrapperCol={{ span: 16 }}
							>
								<Select placeholder="请选择" allowClear>
									<Option value="informal">试用</Option>
									<Option value="formal">正式</Option>
								</Select>
							</Form.Item>
						</Col>
						<Col span={4}>
							<Form.Item>
								<Space size={20}>
									<Button type="primary" htmlType="submit">
										查询
									</Button>
									<Button htmlType="button" onClick={this.onReset}>
										重置
									</Button>
								</Space>
							</Form.Item>
						</Col>
					</Row>
				</Form>
				<Divider />
				<Space size={20} style={{ marginBottom: 20 }}>
					<Button
						type="primary"
						htmlType="button"
						onClick={this.downloadLicense}
					>
						下载
					</Button>
					<Button type="primary" htmlType="button" onClick={this.updateLicense}>
						修改
					</Button>
					<Button type="primary" htmlType="button" onClick={this.deleteLicense}>
						删除
					</Button>
				</Space>
				<Table
					dataSource={licenseList}
					bordered="true"
					size="middle"
					rowSelection={({ type: 'checkbox' }, { onChange: this.onChange })}
					pagination={{
						total: licenseList.length,
						pageSize: 10,
						showTotal: this.showTotal,
					}}
				>
					<Column
						title="客户名"
						dataIndex="customerName"
						key="customerName"
						align="center"
					/>
					<Column
						title="许可类型"
						dataIndex="permission"
						key="permission"
						align="center"
						render={(text, record) => {
							const { permission } = record;
							if (permission == 1) {
								return <span>试用</span>;
							} else {
								return <span>正式</span>;
							}
						}}
					/>
					<Column
						title="试用开始时间"
						dataIndex="beginDate"
						key="beginDate"
						align="center"
					/>
					<Column
						title="试用结束日期"
						dataIndex="endDate"
						key="endDate"
						align="center"
					/>
					<Column
						title="创建人"
						dataIndex="createUserId"
						key="createUserId"
						align="center"
					/>
					<Column
						title="	创建时间"
						dataIndex="createTime"
						key="createTime"
						align="center"
					/>
					<Column
						title="操作"
						dataIndex="click"
						key="click"
						align="center"
						render={(text, record) => {
							return (
								<Button type="primary" onClick={this.showPermission(record)}>
									查看详细
								</Button>
							);
						}}
					/>
				</Table>
			</div>
		);
	}
}
