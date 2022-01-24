import React, { Component } from 'react';
import { Form, Input } from 'antd';
import { name } from 'file-loader';

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
							len: 20,
							validator: async (rule, value) => {
								if (!value) {
									return Promise.reject(new Error('请输入客户名称'));
								}
								if (value.length > rule.len) {
									return Promise.reject(new Error('客户名全称限20位'));
								}
							},
						},
					]}
				>
					<Input placeholder="客户名全称(限20位)" allowClear />
				</Form.Item>

				<Form.Item
					label="客户编码"
					name="code"
					rules={[
						{
							required: true,
							len: 18,
							validator: async (rule, value) => {
								if (!value) return Promise.reject(new Error('请输入客户编码'));
								if (value.length > rule.len) {
									return Promise.reject(new Error('客户编码限18位'));
								}
							},
						},
					]}
				>
					<Input placeholder="简称/编码(限18位)" allowClear />
				</Form.Item>
			</Form>
		);
	}
}
