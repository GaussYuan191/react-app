import React, { Component } from 'react';
import { Form, Button, Select, Row, Col, Space, Divider, Table, Modal} from 'antd';
import './index.less';
import {getLicenseList} from '@/api/getLicenseList.js'
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
    state = {licenseList: [], visible: false, licenseNode: {} }
	onFinish = (values) => {
		console.log(values);
	};
	onReset = () => {
		this.formRef.current.resetFields();
	};
	downloadLicense = () => {
		console.log('开始下载');
	};
	updateLicense = () => {
		console.log('开始更新');
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
        let {licenseNode} = this.state;
        return () => {
            console.log(res);
            data[0].children = res.customerLicenseFunctionList;
            data[1].children = res.customerLicenseDataList;
            data[2].children = res.customerLicenseInterfaceList;
            // licenseNode = data
            console.log(data);
            this.showModal();
        }
        
        
    }
    showModal = () => {
        // setVisible(true);
        this.setState({visible: true})
    };
    handleCancel = () => {

        console.log('Clicked cancel button');
        this.setState({visible: false, licenseNode: {}})
    };
    
    componentDidMount = () => {
        this.dataInit();
    }
    dataInit = () => {
        getLicenseList(1, 1000).then(res => {
            console.log(res); 
            res.list.map(item=> {
                item.key = item.id;
            })
            this.setState({licenseList: res.list})
        })
    }
	render() {
        const {licenseList, visible, licenseNode, } = this.state;
        console.log(visible)
		return (
			<div>
                <Modal
                    title="许可明细"
                    visible={visible}

                    onCancel={this.handleCancel}
                >
                    <Table
						
						rowSelection={undefined}
						pagination={{ position: ['none', 'none'] }}
						scroll={{ y: 400 }}
						dataSource={licenseNode}
					>
<Column title="许可名称" dataIndex="name" key="name" />
<Column title="许可授权" dataIndex="right" key="right" />
                    </Table>
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
										提交
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
				<Space size={20} style={{marginBottom: 20}}>
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
                {
                    console.log(licenseList)
                }
				<Table dataSource={licenseList} bordered="true" size="middle" pagination={{
								total: licenseList.length,
								pageSize: 10,
								showTotal: this.showTotal,
							}} >
					<Column title="客户名" dataIndex="customerName" key="customerName" align="center" />
					<Column title="许可类型" dataIndex="permission" key="permission"  align="center"
                    render={(text, record) => {
                        const {permission} = record;
                        if (permission == 1) {
                            return <span>试用</span>
                        } else {
                            return <span>正式</span>
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
                        dataIndex="demo"
						key="demo"
						align="center"
                        render = {(text, record) => {
                          
                            return <Button type="primary" onClick={this.showPermission(record)}>查看详细</Button>
                        }}
					/>
				</Table>
                
				
			</div>
		);
	}
}
