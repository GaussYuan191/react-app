import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { routers } from './config';
export default class Routers extends Component {
	render() {
		const routerList = routers;
		// 过滤出重定向的数据

		let RedirectList = routerList.filter((item) => item.to);
		// 过滤出展示视图的数据
		let List = routerList.filter((item) => !item.to);

		return (
			<React.Fragment>
				<Switch>
					{List.map((item, index) => {
						let Com = item.component;
						return (
							<Route
								key={index}
								path={item.path}
								render={(pro) => {
									if (item.children) {
										let arr = item.children.filter((item) => !item.to);
										let redirList = item.children.filter((item) => item.to);
										return (
											<Com {...pro}>
												<Switch>
													{arr.map((item, index) => {
														return (
															<Route
																path={item.path}
																component={item.component}
																key={index}
															></Route>
														);
													})}
													{redirList.map((item, index) => {
														return (
															<Redirect
																key={index}
																from={item.from}
																to={item.to}
															/>
														);
													})}
												</Switch>
											</Com>
										);
									} else {
										return <Com {...pro} />;
									}
								}}
							/>
						);
					})}
					{RedirectList.map((item, index) => {
						return <Redirect key={index} from={item.from} to={item.to} />;
					})}
				</Switch>
			</React.Fragment>
		);
	}
}
