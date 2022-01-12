import React, { Component } from 'react';
import './index.less';
import { Form, Input, Button, Table, Modal } from 'antd';
import { getPageList } from '@/api/getPageList.js';
import { addCustomer } from '@/api/addCustomer.js';
import { updateCustomer } from '@/api/updateCustomer.js';
import { deleteCustomer } from '@/api/deleteCustomer';
import { message } from 'antd';
import FromManage from '@/componments/FromManage';
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
let newDataList = [];
export default class UserManage extends Component {
	formRef = React.createRef();
	formDataRef = {};
	// 点击搜索 根据用户名称 模糊匹配
	onFinish = (values) => {
		const { dataList } = this.state;
		this.setState({ loading: true });
		// 显示加载的效果
		setTimeout(() => {
			newDataList = dataList.list.filter((item) => {
				return item.name.includes(values.name);
			});
			this.setState({ loading: false });
		}, 400);
	};
	// 重置搜索
	onReset = () => {
		const { dataList } = this.state;
		newDataList = dataList.list;
		this.setState({});
		this.formRef.current.resetFields();
	};
	state = {
		selectedRowKeys: [], // Check here to configure the default column
		loading: false,
		dataList: {},
		visible: false,
		confirmLoading: false,
	};

	addData = () => {
		// 显示新增用户表单
		this.setState({
			ModalText: 'The modal will be closed after two seconds',
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
			this.handleDelete();
		} else {
			message.error('暂不支持多选,请选择一条记录');
		}
	};
	updateData = () => {
		const { selectedRowKeys } = this.state;
		if (selectedRowKeys.length == 0) {
			message.error('请选择一条记录');
		} else if (selectedRowKeys.length == 1) {
			this.setState({
				ModalText: 'The modal will be closed after two seconds',
				confirmLoading: false,
				visibleUpdate: true,
			});
			let updateData = newDataList.filter((item) => {
				return item.key == selectedRowKeys[0];
			})
			setTimeout(()=>{
				this.formDataRef.current.setFieldsValue({name:updateData[0].name,code:updateData[0].code})
			},500)
			console.log('要修改的数据', updateData);
		} else {
			message.error('暂不支持多选,请选择一条记录');
		}
		
	};
	onSelectChange = (selectedRowKeys) => {
		console.log('selectedRowKeys changed: ', selectedRowKeys);
		this.setState({ selectedRowKeys });
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
			loading: false 
		});
	};
	// 新增处理操作
	handleSubmit = () => {
		let userInfo = this.formDataRef.current.getFieldsValue(true);
		this.setState({
			loading: true
		});
		addCustomer(userInfo.name, userInfo.code).then(res=> {
			console.log('新增数据成功',);
			setTimeout(()=> {
				this.handleCancel();
				this.dataInit();
			}, 300);
		})
		
	}
	// 修改数据操作
	handleUpdate = () => {
		const { selectedRowKeys } = this.state;
		let userInfo = this.formDataRef.current.getFieldsValue(true);
		// this.setState({
		// 	loading: true
		// });
		console.log("sss", userInfo)
		updateCustomer(selectedRowKeys[0], userInfo.name, userInfo.code).then((res) => {
			console.log('修改数据成功',);
			setTimeout(()=> {
				this.handleCancel();
				this.dataInit();
			}, 300);
		})
		
	}
	handleDelete = () => {
		const { selectedRowKeys } = this.state;
		deleteCustomer(selectedRowKeys[0]).then(res=>{
			console.log("删除成功！！");
			this.dataInit();
		})
	}
	// 初始化数据
	componentDidMount = () => {
		this.dataInit()
	};
	dataInit = () => {
		let data = getPageList(1, 10);
		data.then((res) => {
			let page = 2;
			let dataList = [];
			// 先记录前十条数据
			newDataList = res.list;
			// 分批请求数据 每次请求10条
			while (page <= res.pages) {
				dataList.push(getPageList(page, 10));
				page++;
			}
			Promise.all(dataList).then((data) => {
				data.forEach((item) => {
					newDataList.push(...item.list);
				});
				// 给所有数据绑定key
				newDataList.map((item) => {
					item.key = item.id;
				});
				// 保存数据到state中
				res.list = newDataList;
				this.setState({ dataList: res });
			});
		});
	}
	render() {
		const { loading, selectedRowKeys, dataList, visibleAdd, visibleUpdate, confirmLoading } =
			this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange,
		};
		const hasSelected = selectedRowKeys.length > 0;
		return (
			<div>
				<div className="select-content">
					<Modal
						title="新增"
						visible={visibleAdd}
						onOk={this.handleSubmit}
						confirmLoading={confirmLoading}
						onCancel={this.handleCancel}
					>
						<FromManage wrappedComponentRef={ ref=>{ this.formDataRef = ref }} ></FromManage>
						{/* <WrappedNormalLoginForm />//增加ref属性，目的是获得form对象 */}
					</Modal>
					<Modal
						title="修改"
						visible={visibleUpdate}
						onOk={this.handleUpdate}
						confirmLoading={confirmLoading}
						onCancel={this.handleCancel}
					>
						<FromManage wrappedComponentRef={ ref=>{ this.formDataRef = ref }} ></FromManage>
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
							<Input />
						</Form.Item>

						<Form.Item className="form-btn">
							<Button type="primary" htmlType="submit" className="btn">
								查询
							</Button>
							<Button htmlType="button" onClick={this.onReset} className="btn">
								重置
							</Button>
							<Button type="primary" onClick={this.addData} className="btn">
								新增
							</Button>
							<Button type="primary" onClick={this.updateData} className="btn">
								修改
							</Button>
							<Button type="primary" onClick={this.deleteData} className="btn">
								删除
							</Button>
						</Form.Item>
					</Form>
					{console.log('sss', newDataList)}
					<div className="table-data">
						<div className="line"></div>
						<Table
							rowSelection={rowSelection}
							pagination={{
								total: dataList.total,
								pageSize: 10,
								showTotal: this.showTotal,
							}}
							columns={columns}
							size="small"
							dataSource={newDataList}
							bordered="true"
							loading={loading}
						/>
					</div>
				</div>
			</div>
		);
	}
}
