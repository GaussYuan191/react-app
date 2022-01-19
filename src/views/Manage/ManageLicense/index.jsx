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
import BaseInfo from '@/componments/BaseInfo';
import { getLicenseList } from '@/api/getLicenseList.js';
import { listAllSub } from '@/api/listAllSub.js';
import { queryFunctionCode } from '@/api/queryFunctionCode.js';
import { exportLicense } from '@/api/exportLicense.js';


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
	baseInfoForm = React.createRef();
	state = {
		licenseList: [],
		visible: false,
		licenseNode: {},
		licenseDefault: data,
		licenseData: [],
		selectNode: [],
		visibleUpdate: false,
		getLicense: () => {}
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
	// 重置搜索框
	onReset = () => {
		let { licenseData } = this.state;
		this.setState({ licenseList: licenseData });
		this.formRef.current.resetFields();
	};
	// 下载文件 
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
	// 更新权限数据
	updateLicense = () => {
		const {licenseDefault,selectNode,licenseList} = this.state
		console.log('开始更新', licenseDefault);	
		if (selectNode.length == 0) {
			message.error('请选择一条记录');
		} else if (selectNode.length >= 2) {
			message.error('请选择且只能选择一条数据');
		} else {
			this.dealLicenseNode(selectNode);
			this.showUpdate()
		}
		
		
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
	// 处理权限数据
	dealLicenseNode = (selectNode)=> {
		const {licenseDefault} = this.state;
		const {customerLicenseFunctionList, customerLicenseInterfaceList, customerLicenseDataList} = selectNode;
		console.log("开始处理数据aa", selectNode, licenseDefault)
		// 深拷贝防止setSate时页面数据不更新
		let newLicenseDefault = this.deepCopy(licenseDefault);
		let dealNode = (nodes, licenses) => {
			if (!nodes) return;
			if (nodes.children) {
				// 先序遍历
				nodes.children.forEach(item => dealNode(item, licenses));
				// 如果孩子节点的right 都相同, 则父亲节点的right与孩子节点的right相同
				// 如果孩子节点的right 不同, 则父亲节点的right保持不变
				let chFlag = -1;
				nodes.children.forEach(item => {
					chFlag = chFlag == -1 ? item.right : chFlag == item.right ? chFlag : -2;
				})
				// chFlag == -2 表示所有孩子节点right不同，!= 2 表示孩子节点right相同，chFlag 保存了 孩子节点的right值 
				if (chFlag != -2) {
					nodes.right = chFlag;
				}
			} else {
				// 如果是叶子节点，则通过key到权限列表中找对应的right值,
				let node = licenses.find(item => item.code == nodes.key)
				nodes.right = node.right;
			}
		}
		newLicenseDefault.forEach((item, index) => {
			dealNode(item, selectNode[0][item.key]);
		})
		console.log("处理结果aaa", newLicenseDefault)
		this.setState({licenseDefault: newLicenseDefault})
	}
	// 显示详情页面
	showModal = () => {
		this.setState({ visible: true });
	};
	// 显示更新页面
	showUpdate = () => {
		this.setState({visibleUpdate: true});
	}
	// 取消显示详情页面
	handleCancel = () => {
		this.setState({ visible: false, licenseNode: {} });
	};
	// 取消显示更新页面
	handleUpdateCancel = () => {
		this.setState({visibleUpdate: false, licenseNode: {}})
	}
	// 记录选中的值的数据
	onChange = (selectedRowKeys, selectedRows) => {
		this.setState({ selectNode: selectedRows});
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
		this.setState({getLicense: data})
	}
	// 组件挂载
	componentDidMount() {
		this.dataInit();
	};
	// 初始化数据
	dataInit = () => {
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
						this.dealTree(item);
					});
					newLicenseList[index].children = arr;
				});
				this.setState({ licenseDefault: newLicenseList });
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
			    <BaseInfo wrappedComponentRef={(ref) => {
						this.baseInfoForm = ref;
					}} ></BaseInfo>	
				<Divider />	
			
				<LicenseInfo licenseList={licenseDefault} getLiceseInfo={this.getLiceseInfo}></LicenseInfo>	
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
