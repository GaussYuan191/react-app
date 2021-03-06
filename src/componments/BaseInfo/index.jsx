import React, { Component } from 'react';
import { Form, Select, Card, DatePicker, Row, Col } from 'antd';
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
	state = { customerList: [], permission: null, licensesTime: [] };
	constructor(props) {
		super(props);
		this.baseInfoForm = React.createRef();
		this.props.wrappedComponentRef(this.baseInfoForm);
	}
	static getDerivedStateFromProps(props, state) {
		return { ...props };
	}

	render() {
		const { customerList, permission, licensesTime } = this.state;
		console.log(this.state, this.baseInfoForm, '基本信息页面');

		console.log('per', permission);

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
								initialValue={permission == '2' ? 'formal' : 'informal'}
							>
								<Select
									placeholder="请选择"
									allowClear
									style={{ width: '200px' }}
								>
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
								initialValue={customerList && customerList[0].value}
							>
								<Select
									showSearch
									placeholder="请选择"
									optionFilterProp="label"
									allowClear
									style={{ width: '200px' }}
									options={customerList}
									disabled={customerList && customerList.length == 1}
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
											initialValue={
												licensesTime
													? licensesTime[0] == null
														? undefined
														: licensesTime
													: undefined
											}
										>
											<RangePicker style={{ width: '200px' }} />
										</Form.Item>
									) : null
								}
							</Form.Item>
						</Col>
					</Row>
				</Card>
			</Form>
		);
	}
}
