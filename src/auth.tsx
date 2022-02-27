import React, {Component} from "react";
import {backend} from "./sb";

export interface IProps {
	onToken: (token: string) => void;
}

interface IState {
	email: string;
	password: string;
}

export class Auth extends Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);

		this.state = {
			email: "",
			password: ""
		}
		
	}

	onChanged(field: "email" | "password", e: React.ChangeEvent<HTMLInputElement>) {
		const val = e.currentTarget?.value;

		if (field == "email") {
			this.setState({
				...this.state,
				email: e.target?.value,
			});
		} else {
			this.setState({
				...this.state,
				password: e.target?.value
			});
		}
	}

	signup = async () => {
		const {email, password} = this.state;

		const res = await backend.register(email, password);
		if (!res.ok) {
			alert(res.content);
			return;
		}

		this.props.onToken(res.content);
	}

	signin = async () => {
		const {email, password} = this.state;

		const res = await backend.login(email, password);
		if (!res.ok) {
			alert(res.content);
			return;
		}

		this.props.onToken(res.content);		
	}

	render() {
		return (
			<div>
				<h1>User authentication</h1>
				<div>
					<label>Email</label><br />
					<input type="email" required value={this.state.email} onChange={this.onChanged.bind(this, "email")} />
				</div>

				<div>
					<label>Password</label><br />
					<input type="password" required value={this.state.password} onChange={this.onChanged.bind(this, "password")} />
				</div>

				<div>
					<button onClick={this.signup.bind(this)}>Create account</button> 
					<button onClick={this.signin.bind(this)}>Login</button>
				</div>
			</div>
		);
	}
}