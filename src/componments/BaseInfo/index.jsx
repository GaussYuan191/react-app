import React, { Component } from 'react'
import {
	Form,
	Select,
	Card,
	DatePicker,
	Row,
	Col,

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

export default class index extends Component {
    state = {customerLists: []}
    constructor(props) {
        super(props);
        this.baseInfoForm = React.createRef();
        this.props.wrappedComponentRef(this.baseInfoForm);
    }
    
    // 处理客户数据
	dealCustomer = (lists) => {
        if ( lists == null || lists == undefined || lists.length == 0 ) return;
		let newList = [];
		// label 为显示的值, value 为选中的值
		lists.map((item) => {
			newList.push({ label: item.name, value: item.id, key: item.id });
		});
		return newList;
	}
    initData = () => {
        let defaultCustomerList =  this.props.customerList
        let newlist = this.dealCustomer(defaultCustomerList);
        this.setState({customerLists: newlist});
    }
    componentDidMount = () => {
        // setTimeout(() => {
            console.log('父组件接收',this.props.customerList);
            this.initData();
        // },1);
    }
	UNSAFE_componentWillReceiveProps = (nextProp) => {
		console.log("props11,", nextProp)
		console.log('默认值11',this.props.licenseList)
	}
    render() {
        
        const {customerLists} = this.state;
        return (
            <Form ref={this.baseInfoForm} name="lincenseList">
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
									options={customerLists}
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
            </Form>
        )
    }
}
