import React, { FormEventHandler } from "react";
import { backend } from "./sb";

export interface IProps {
	token: string;
	editId: string | null;
	onSave: (article: Article) => void;
}

interface IState {
	article: Article;
	isNew: boolean;
}

export class ArticleEdit extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);

		this.state = {
			article: {
				id: "",
				accountId: "",
				title: "",
				body: "",
				authorName: "",
				created: new Date()
			},
			isNew: props.editId == null
		}
	}

	componentDidMount = async () => {
		if (this.props.editId) {
			const res = await backend.getById(
				this.props.token,
				"articles_770_",
				this.props.editId
			);
			if (!res.ok) {
				alert(res.content);
				return;
			}

			this.setState({
				article: res.content,
				isNew: false
			})
		}
	}

	onChanged(field: "title" | "body" | "authorName", e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		const val = e.currentTarget?.value;
		let { article } = this.state;

		article[field] = val;

		this.setState({
			...this.state,
			article: article,
		});
	}

	save = async (e: any) => {
		e.preventDefault();

		const {token, editId, onSave} = this.props;
		const {isNew, article} = this.state;

		let res = null;
		if (isNew) {
			article.created = new Date();

			res = await backend.create(
				token,
				"articles_770_",
				article
			)
		} else {
			res = await backend.update(
				token,
				"articles_770_",
				editId || "",
				article
			)
		}

		if (!res.ok) {
			alert(res.content);
			return;
		}

		this.props.onSave(res.content);
	}

	renderAuthor() {
		if (this.state.isNew) {
			return (
				<p>
				<input
					type="text"
					value={this.state.article.authorName}
					onChange={this.onChanged.bind(this, "authorName")}
					placeholder="Author name"
					required
				/>
				</p>
			)
		} else {
			<p>{this.state.article.authorName}</p>
		}
	}

	render() {
		const { article, isNew } = this.state;

		return (
			<div>
				<h1>{isNew ? "Create new article" : `Editing ${article.title}`}</h1>
				<form onSubmit={this.save.bind(this)}>
					<p>
					<input
						type="text"
						value={article.title}
						onChange={this.onChanged.bind(this, "title")}
						placeholder="Article title"
					/>
					</p>
					<p>
					<textarea 
						value={article.body}
						onChange={this.onChanged.bind(this, "body")}>
					</textarea>
					</p>
					{this.renderAuthor()}
					<p>
					<button type="submit">
						{isNew ? "Create article" : "Save changes"}
					</button>
					</p>
				</form>
			</div>
		)
	}
}