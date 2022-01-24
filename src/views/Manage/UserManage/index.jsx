import React, { Component } from 'react';
import './index.less';
import {
	Form,
	Input,
	Button,
	Table,
	Modal,
	message,
	Space,
	Divider,
	Row,
	Col,
} from 'antd';
// 请求接口
import { getPageList } from '@/api/getPageList.js';
import { addCustomer } from '@/api/addCustomer.js';
import { updateCustomer } from '@/api/updateCustomer.js';
import { deleteCustomer } from '@/api/deleteCustomer';
import FromManage from '@/componments/FromManage';
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;
// 设置表格信息
const columns = [
	{
		title: '客户编号',
		dataIndex: 'code',
	},
	{
		title: '客户名称',
		dataIndex: 'name',
	},
	{
		title: '创建人',
		dataIndex: 'createUserName',
	},
	{
		title: '创建时间',
		dataIndex: 'createTime',
	},
	{
		title: '更新时间',
		dataIndex: 'updateTime',
	},
];
export default class UserManage extends Component {
	formRef = React.createRef(); //搜索表单
	formDataRef = {}; //增加、修改表单
	state = {
		selectedRowKeys: [], //保存table勾选行的ID
		loading: false, //table的加载状态
		dataList: [], //table的数据
		visible: false, //Modal的显示状态
		total: 10, //table数据的数量
		currentPage: 1, //当前的页的位置
	};

	// 点击搜索 根据用户名称 模糊匹配
	onFinish = (values) => {
		this.setState({ loading: true });
		// 显示加载的效果
		console.log(values);
		setTimeout(() => {
			this.dataInit(1, 10, values.name);
			this.setState({ loading: false });
		}, 400);
	};
	// 重置搜索
	onReset = () => {
		this.dataInit();
		this.formRef.current.resetFields();
	};
	// 保存勾选行的ID
	onSelectChange = (selectedRowKeys) => {
		this.setState({ selectedRowKeys });
	};
	// 点击分页的处理
	onPageChange = (page, pageSize) => {
		this.dataInit(page, pageSize);
	};
	// 显示数据条数
	showTotal = (total) => {
		return `共 ${total} 条`;
	};
	// 点击取消按钮
	handleCancel = () => {
		//点击取消按钮触发的事件
		console.log('Clicked cancel button');
		this.setState({
			visibleAdd: false,
			visibleUpdate: false,
			loading: false,
		});
	};
	// 点击新增按钮
	addData = () => {
		// 显示新增用户表单
		this.setState({
			ModalText: '新增',
			visibleAdd: true,
		});
	};
	// 新增处理操作
	handleSubmit = () => {
		let userInfo = {};
		this.formDataRef.current.validateFields().then((res) => {
			userInfo = res;
			addCustomer(userInfo.name, userInfo.code).then(
				(res) => {
					message.success('新增成功');
					setTimeout(() => {
						this.handleCancel();
						this.dataInit();
					}, 300);
					this.setState({
						loading: true,
					});
				},
				(err) => {
					message.error(err);
				}
			);
		});
	};
	// 点击修改按钮
	updateData = () => {
		const { selectedRowKeys, dataList } = this.state;
		if (selectedRowKeys.length == 0) {
			message.error('请选择一条记录');
		} else if (selectedRowKeys.length == 1) {
			this.setState({
				ModalText: '更新页面',
				visibleUpdate: true,
			});
			let updateDatas = dataList.find((item) => {
				return item.id == selectedRowKeys[0];
			});
			setTimeout(() => {
				this.formDataRef.current.setFieldsValue({
					name: updateDatas.name,
					code: updateDatas.code,
				});
			}, 300);
		} else {
			message.error('暂不支持多选,请选择一条记录');
		}
	};

	// 修改数据操作
	handleUpdate = () => {
		const { selectedRowKeys } = this.state;
		this.formDataRef.current.validateFields().then((res) => {
			let userInfo = res;
			updateCustomer(selectedRowKeys[0], userInfo.name, userInfo.code).then(
				(res) => {
					message.success('修改成功');
					setTimeout(() => {
						this.handleCancel();
						this.dataInit();
					}, 300);
					this.setState({ selectedRowKeys: [] });
				},
				(err) => {
					message.error(err);
				}
			);
		});
	};
	// 点击删除按钮
	deleteData = () => {
		const { selectedRowKeys } = this.state;
		if (selectedRowKeys.length == 0) {
			message.error('请选择一条记录');
		} else {
			confirm({
				title: '你确定要删除吗?',
				icon: <ExclamationCircleOutlined />,
				onOk: this.handleDelete,
				onCancel() {
					console.log('Cancel');
				},
			});
		}
	};

	// 处理删除的逻辑
	handleDelete = () => {
		const { selectedRowKeys } = this.state;
		// 要删除的ids
		let deteleIds = selectedRowKeys.join(',');
		deleteCustomer(deteleIds).then(
			(res) => {
				message.success('删除成功');
				this.dataInit();
				this.setState({ selectedRowKeys: [] });
			},
			(err) => {
				message.error(err);
			}
		);
	};
	// 初始化数据
	componentDidMount = () => {
		this.dataInit();
	};
	// 初始化数据,pageNum 页数 默认为 1, pageSize 一页数组的数量 默认为 10, name 数据的名字 默认为空
	dataInit = (pageNum = 1, pageSize = 10, name = '') => {
		// 初始请求前十条数据
		this.setState({ loading: true });
		let data = getPageList(pageNum, pageSize, name);
		data.then(
			(res) => {
				this.setState({
					dataList: res.list,
					total: res.total,
					currentPage: res.pageNum,
					loading: false,
				});
			},
			(err) => {
				message.error(err);
			}
		);
	};
	render() {
		const {
			loading,
			selectedRowKeys,
			dataList,
			visibleAdd,
			visibleUpdate,
			total,
			currentPage,
		} = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange,
		};
		return (
			<div className="select-content">
				<Modal
					title="新增"
					visible={visibleAdd}
					onOk={this.handleSubmit}
					onCancel={this.handleCancel}
					style={{ minWidth: 580 }}
					destroyOnClose="true"
				>
					<FromManage
						wrappedComponentRef={(ref) => {
							this.formDataRef = ref;
						}}
					></FromManage>
					{/* <WrappedNormalLoginForm />//增加ref属性，目的是获得form对象 */}
				</Modal>
				<Modal
					title="修改"
					visible={visibleUpdate}
					onOk={this.handleUpdate}
					onCancel={this.handleCancel}
					destroyOnClose="true"
				>
					<FromManage
						wrappedComponentRef={(ref) => {
							this.formDataRef = ref;
						}}
					></FromManage>
					{/* <WrappedNormalLoginForm />//增加ref属性，目的是获得form对象 */}
				</Modal>
				<Form
					ref={this.formRef}
					name="control-ref"
					className="form-content"
					onFinish={this.onFinish}
				>
					<Row>
						<Col xl={6} md={12} xs={24}>
							<Form.Item
								name="name"
								label="客户姓名"
								rules={[{ required: true, message: '请输入姓名' }]}
							>
								<Input placeholder="客户名称" allowClear />
							</Form.Item>
						</Col>

						<Col xl={6} md={12} xs={24}>
							<Form.Item className="form-btn">
								<Button type="primary" htmlType="submit" className="btn">
									查询
								</Button>
								<Button
									htmlType="button"
									onClick={this.onReset}
									className="btn"
								>
									重置
								</Button>
							</Form.Item>
						</Col>
					</Row>
				</Form>
				<Divider />
				<Space size={20} style={{ marginBottom: 20 }}>
					<Button type="primary" onClick={this.addData}>
						新增
					</Button>
					<Button type="primary" onClick={this.updateData}>
						修改
					</Button>
					<Button type="primary" onClick={this.deleteData}>
						删除
					</Button>
				</Space>
				<Table
					rowSelection={rowSelection}
					pagination={{
						total: total,
						current: currentPage,
						pageSize: 10,
						showTotal: this.showTotal,
						onChange: this.onPageChange,
					}}
					rowKey="id"
					columns={columns}
					size="small"
					dataSource={dataList}
					bordered="true"
					onChange={this.onTableChange}
					loading={loading}
				/>
			</div>
		);
	}
}
