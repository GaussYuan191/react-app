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
import LicenseInfo from '@/componments/LicenseInfo';
import BaseInfo from '@/componments/BaseInfo';
import { getLicenseList } from '@/api/getLicenseList.js';
import { listAllSub } from '@/api/listAllSub.js';
import { queryFunctionCode } from '@/api/queryFunctionCode.js';
import { exportLicense } from '@/api/exportLicense.js';
import { updateLicense } from '@/api/updateLicense.js';
import moment from 'moment';
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
// 保存提交的数据
let resultData = {
	version: '1.0',
};
export default class ManageLicense extends Component {
	formRef = React.createRef();
	baseInfoForm = React.createRef();
	state = {
		licenseList: [],
		visible: false,
		licenseNode: {},
		licenseDefault: data,
		licenseData: [],
		selectNode: [],
		tempNode: [],
		visibleUpdate: false,
		getLicense: () => {},
		total: 10,
		currentPage: 1,
		loading: false,
	};
	onFinish = (values) => {
		let { licenseData } = this.state;
		let { permission } = values;
		let isPermission = permission == 'informal' ? '1' : '2';
		this.dataInit(1, 10, isPermission);
	};
	// 重置搜索框
	onReset = () => {
		let { licenseData } = this.state;
		this.setState({ licenseList: licenseData });
		this.formRef.current.resetFields();
	};
	// 点击分页的处理
	onPageChange = (page, pageSize) => {
		this.dataInit(page, pageSize);
	};
	// 下载文件
	downloadLicense = () => {
		const { selectNode } = this.state;
		if (selectNode.length == 0) {
			message.error('请选择一条记录!');
		} else {
			let ids = [];
			selectNode.forEach((item) => {
				ids.push(item.id);
			});
			exportLicense(ids.join(',')).then(
				(res) => {
					let url = window.URL.createObjectURL(
						new Blob([res.data], { type: res.data.type })
					);
					// 创建A标签
					let link = document.createElement('a');
					link.style.display = 'none';
					link.href = url;
					// 设置的下载文件文件名
					const fileName = res.headers['content-disposition']
						.match('[^=]+$')[0]
						.replace(/\"/g, '');
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
	// 更新权限数据
	updateLicense = () => {
		const { licenseDefault, selectNode } = this.state;
		console.log('开始更新', licenseDefault);
		if (selectNode.length == 0) {
			message.error('请选择一条记录');
		} else if (selectNode.length >= 2) {
			message.error('请选择且只能选择一条数据');
		} else {
			this.dealLicenseNode(selectNode);
			this.setState({ tempNode: selectNode[0] });
			console.log(this.baseInfoForm.current);
			// setTimeout(() => {
			// 	this.baseInfoForm.current.setFieldsValue({permission:'informal',customerId: '22011723580403000125'})
			// }, 500)
			this.showUpdate();
		}
	};
	// 处理修改提交
	dealSubmit = () => {
		const { licenseDefault, selectNode } = this.state;
		console.log('dd',selectNode)
		this.baseInfoForm.current.validateFields().then((values) => {
			console.log(values, values.permission == 'formal')
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
			getNode(licenseDefault[0]);
			resultData.customerLicenseFunctionList = nodeList;
			nodeList = [];
			// 处理接口许可集合
			getNode(licenseDefault[1]);
			resultData.customerLicenseInterfaceList = nodeList;
			nodeList = [];
			// 处理数据许可集合
			getNode(licenseDefault[2]);
			resultData.customerLicenseDataList = nodeList;
			nodeList = [];

			resultData.customerId = values.customerId;
			resultData.id = selectNode[0].id;
			console.log('最后结果', resultData);
			this.updateLicenseInfo(resultData);
		});
		console.log('开始提交');
	};
	updateLicenseInfo = (resultData) => {
		updateLicense(resultData).then(
			(res) => {
				message.success('修改成功');
				this.dataInit()
				this.handleUpdateCancel()
			},
			(err) => {
				console.log('err', err);
			}
		);
	};
	// 处理修改后的结果
	onTableChange = (data) => {
		this.setState({ licenseDefault: data });
	};
	// 删除权限数据
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
			this.setState({ licenseNode: [res] });
			this.dealLicenseNode([res]);
			this.showModal();
		};
	};
	// 初始化树形数据
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
	// 处理权限数据
	dealLicenseNode = (selectNode) => {
		const { licenseDefault } = this.state;
		console.log('开始处理数据aa', selectNode, licenseDefault);
		// 深拷贝防止setSate时页面数据不更新
		let newLicenseDefault = this.deepCopy(licenseDefault);
		let dealNode = (nodes, licenses) => {
			if (!nodes) return;
			if (nodes.children) {
				// 先序遍历
				nodes.children.forEach((item) => dealNode(item, licenses));
				// 如果孩子节点的right 都相同, 则父亲节点的right与孩子节点的right相同
				// 如果孩子节点的right 不同, 则父亲节点的right保持不变
				let chFlag = -1;
				nodes.children.forEach((item) => {
					chFlag =
						chFlag == -1 ? item.right : chFlag == item.right ? chFlag : -2;
				});
				// chFlag == -2 表示所有孩子节点right不同，!= 2 表示孩子节点right相同，chFlag 保存了 孩子节点的right值
				if (chFlag != -2) {
					nodes.right = chFlag;
				}
			} else {
				// 如果是叶子节点，则通过key到权限列表中找对应的right值,
				let node = licenses.find((item) => item.code == nodes.key);
				nodes.right = node.right;
			}
		};
		newLicenseDefault.forEach((item, index) => {
			dealNode(item, selectNode[0][item.key]);
		});
		console.log('处理结果aaa', newLicenseDefault);
		this.setState({ licenseDefault: newLicenseDefault });
	};
	// 显示详情页面
	showModal = () => {
		this.setState({ visible: true });
	};
	// 显示更新页面
	showUpdate = () => {
		this.setState({ visibleUpdate: true });
	};
	// 取消显示详情页面
	handleCancel = () => {
		this.setState({ visible: false, licenseNode: {} });
	};
	// 取消显示更新页面
	handleUpdateCancel = () => {
		this.setState({ visibleUpdate: false, licenseNode: {} });
	};
	// 记录选中的值的数据
	onChange = (selectedRowKeys, selectedRows) => {
		console.log(selectedRows);
		this.setState({ selectNode: selectedRows });
	};
	// 深拷贝
	deepCopy = (obj) => {
		if (!obj || typeof obj !== 'object') return null;
		let newObj = Array.isArray(obj) ? [] : {};
		for (let key in obj) {
			if (obj.hasOwnProperty(key)) {
				newObj[key] =
					typeof obj[key] === 'object' ? this.deepCopy(obj[key]) : obj[key];
			}
		}

		return newObj;
	};
	// 获取子组件中的权限数据
	getLiceseInfo = (data) => {
		this.setState({ getLicense: data });
	};
	// 组件挂载
	componentDidMount() {
		this.dataInit();
		this.dataTreeInit();
	}
	// 初始化数据
	dataInit = (reqPageNum = 1, reqPageSize = 10, permission = '') => {
		this.setState({ loading: true });
		let reqData = { reqPageNum: reqPageNum, reqPageSize: reqPageSize };
		if (permission !== '') {
			reqData.permission = permission;
		}
		console.log(reqData);
		getLicenseList(reqData).then((res) => {
			res.list.forEach((item) => {
				item.key = item.id;
			});
			console.log(res);
			this.setState({
				licenseList: res.list,
				total: res.total,
				currentPage: res.pageNum,
				loading: false,
			});
		});
	};
	// 初始化树形结构
	dataTreeInit = () => {
		let { licenseDefault } = this.state;
		let resultList = [];
		let newLicenseList = this.deepCopy(licenseDefault);
		resultList.push(queryFunctionCode());
		resultList.push(listAllSub(1050006));
		resultList.push(listAllSub(1030308));
		Promise.all(resultList).then(
			(res) => {
				res.forEach((arr, index) => {
					arr.forEach((item) => {
						this.dealTree(item, licenseDefault[index].key);
					});
					newLicenseList[index].children = arr;
				});
				this.setState({ licenseDefault: newLicenseList });
			},
			(err) => {
				console.log(err);
			}
		);
	};
	render() {
		const {
			licenseList,
			visible,
			licenseNode,
			selectNode,
			licenseDefault,
			visibleUpdate,
			loading,
			total,
			currentPage,
		} = this.state;
		let licensesTime = [],
			key,
			customerName,
			permission;
		if (selectNode.length !== 0) {
			let beginDate =
				selectNode[0].beginDate == null
					? null
					: moment(selectNode[0].beginDate);
			let endDate =
				selectNode[0].endDate == null ? null : moment(selectNode[0].endDate);
			licensesTime.push(beginDate, endDate);
			key = selectNode[0].key;
			customerName = selectNode[0].customerName;
			permission = selectNode[0].permission;
		}
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
					<BaseInfo
						wrappedComponentRef={(ref) => {
							this.baseInfoForm = ref;
						}}
						licensesTime={licensesTime}
						customerList={[{ label: customerName, value: key, key: key }]}
						permission={permission}
					></BaseInfo>
					<Divider />

					<LicenseInfo
						licenseList={licenseDefault}
						onTableChange={this.onTableChange}
					></LicenseInfo>
					<Divider />
					<Space size={20}>
						<Button type="primary" htmlType="submit" onClick={this.dealSubmit}>
							提交
						</Button>
						<Button htmlType="button" onClick={this.handleUpdateCancel}>
							取消
						</Button>
					</Space>
				</Modal>
				<Form ref={this.formRef} name="selectLicense" onFinish={this.onFinish}>
					<Row>
						<Col>
							<Form.Item name="permission" label="许可类型">
								<Select
									placeholder="请选择"
									allowClear
									style={{ width: '200px', marginRight: '40px' }}
								>
									<Option value="informal">试用</Option>
									<Option value="formal">正式</Option>
								</Select>
							</Form.Item>
						</Col>
						<Col>
							<Form.Item>
								<Button
									type="primary"
									htmlType="submit"
									style={{ marginRight: '20px' }}
								>
									查询
								</Button>
								<Button htmlType="button" onClick={this.onReset}>
									重置
								</Button>
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
					loading={loading}
					rowSelection={({ type: 'checkbox' }, { onChange: this.onChange })}
					pagination={{
						total: total,
						current: currentPage,
						pageSize: 10,
						showTotal: this.showTotal,
						onChange: this.onPageChange,
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
