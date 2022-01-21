import React, { Component } from 'react';
import { Form, Input } from 'antd';

export default class FromManage extends Component {
	constructor(props) {
		super(props);
		this.formDataRef = React.createRef();
		this.props.wrappedComponentRef(this.formDataRef);
	}
	render() {
		return (
			<Form name="basic" autoComplete="off" ref={this.formDataRef}>
				<Form.Item
					label="客户名称"
					name="name"
					rules={[
						{
							required: true,
							message: '请输入客户名称',
						},
					]}
				>
					<Input placeholder="客户名全称(限20位)" />
				</Form.Item>

				<Form.Item
					label="客户编码"
					name="code"
					rules={[
						{
							required: true,
							message: '请输入客户编码',
						},
					]}
				>
					<Input placeholder="简称/编码(限18位)" />
				</Form.Item>
			</Form>
		);
	}
}
