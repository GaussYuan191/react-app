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
} from 'antd';

import { getPageList } from '@/api/getPageList.js';
import { addCustomer } from '@/api/addCustomer.js';
import { updateCustomer } from '@/api/updateCustomer.js';
import { deleteCustomer } from '@/api/deleteCustomer';
import FromManage from '@/componments/FromManage';
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;
// 设置表单的布局
const layout = {
	labelCol: {
		span: 0,
	},
	wrapperCol: {
		span: 24,
	},
};
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
	formRef = React.createRef();
	formDataRef = {};
	state = {
		selectedRowKeys: [], // Check here to configure the default column
		loading: false,
		dataList: [],
		visible: false,
		confirmLoading: false,
		total: 10,
		currentPage: 1
	};

	// 点击搜索 根据用户名称 模糊匹配
	onFinish = (values) => {
		const { dataList } = this.state;
		this.setState({ loading: true });
		// 显示加载的效果
		setTimeout(() => {
			let newDataList = dataList.list.filter((item) => {
				return item.name.includes(values.name);
			});
			this.setState({ loading: false , dataList: newDataList});
		}, 400);
	};
	// 重置搜索
	onReset = () => {
		this.dataInit()
		this.formRef.current.resetFields();
	};
	

	addData = () => {
		// 显示新增用户表单
		this.setState({
			ModalText: '新增',
			confirmLoading: false,
			visibleAdd: true,
		});
	};
	deleteData = () => {
		const { selectedRowKeys } = this.state;
		console.log('删除数据', selectedRowKeys);
		if (selectedRowKeys.length == 0) {
			message.error('请选择一条记录');
		} else if (selectedRowKeys.length == 1) {
			confirm({
				title: '你确定要删除吗?',
				icon: <ExclamationCircleOutlined />,
				onOk: this.handleDelete,
				onCancel() {
					console.log('Cancel');
				},
			});
		} else {
			message.error('暂不支持多选,请选择一条记录');
		}
	};
	updateData = () => {
		const { selectedRowKeys , dataList} = this.state;
		if (selectedRowKeys.length == 0) {
			message.error('请选择一条记录');
		} else if (selectedRowKeys.length == 1) {
			this.setState({
				ModalText: '更新页面',
				confirmLoading: false,
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
	onSelectChange = (selectedRowKeys) => {
		console.log('selectedRowKeys changed: ', selectedRowKeys);
		this.setState({ selectedRowKeys });
	};
	onPageChange = (page, pageSize) =>{
		console.log(page, pageSize)
		this.dataInit(page, pageSize )
	}
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
	// 新增处理操作
	handleSubmit = () => {
		let userInfo = this.formDataRef.current.getFieldsValue(true);
		this.setState({
			loading: true,
		});
		addCustomer(userInfo.name, userInfo.code).then(
			(res) => {
				message.success('新增成功');
				setTimeout(() => {
					this.handleCancel();
					this.dataInit();
				}, 300);
			},
			(err) => {
				message.error(err);
			}
		);
	};
	// 修改数据操作
	handleUpdate = () => {
		const { selectedRowKeys } = this.state;
		let userInfo = this.formDataRef.current.getFieldsValue(true);
		console.log('sss', userInfo);
		updateCustomer(selectedRowKeys[0], userInfo.name, userInfo.code).then(
			(res) => {
				message.success('修改成功');
				setTimeout(() => {
					this.handleCancel();
					this.dataInit();
				}, 300);
				this.setState({selectedRowKeys:[]})
			},
			(err) => {
				message.error(err);
			}
		);
	};
	handleDelete = () => {
		const { selectedRowKeys } = this.state;
		deleteCustomer(selectedRowKeys[0]).then(
			(res) => {
				message.success('删除成功');
				this.dataInit();
				this.setState({selectedRowKeys:[]})
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
	dataInit = (pageNum = 1, pageSize = 10) => {
		// 初始请求前十条数据
		this.setState({loading: true})
		let data = getPageList(pageNum, pageSize);
		data.then((res) => {
			console.log(res)
			this.setState({dataList: res.list, total:res.total,currentPage: res.pageNum, loading: false})		
		}, err => {
			message.error(err)
		});

	};
	render() {
		const {
			loading,
			selectedRowKeys,
			dataList,
			visibleAdd,
			visibleUpdate,
			confirmLoading,
			total,
			currentPage
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
					confirmLoading={confirmLoading}
					onCancel={this.handleCancel}
					style={{ minWidth: 580 }}
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
					confirmLoading={confirmLoading}
					onCancel={this.handleCancel}
				>
					<FromManage
						wrappedComponentRef={(ref) => {
							this.formDataRef = ref;
						}}
					></FromManage>
					{/* <WrappedNormalLoginForm />//增加ref属性，目的是获得form对象 */}
				</Modal>
				<Form
					{...layout}
					ref={this.formRef}
					name="control-ref"
					layout="inline"
					className="form-content"
					onFinish={this.onFinish}
				>
					<Form.Item
						name="name"
						label="客户姓名"
						rules={[{ required: true, message: '请输入姓名' }]}
					>
						<Input placeholder="客户名称" />
					</Form.Item>

					<Form.Item className="form-btn">
						<Button type="primary" htmlType="submit" className="btn">
							查询
						</Button>
						<Button htmlType="button" onClick={this.onReset} className="btn">
							重置
						</Button>
					</Form.Item>
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
						onChange:this.onPageChange
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
