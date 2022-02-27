import React from 'react';
import logo from './logo.svg';
import './App.css';

import { Auth } from "./auth";
import { ArticleEdit } from "./article_edit";
import { backend } from './sb';
import { isDeepStrictEqual } from 'util';
import { isBoxedPrimitive } from 'util/types';

interface IState {
  token: string | null;
  articles: Array<Article>;
  isEditing: boolean;
  editId: string | null;
}

export class App extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      token: null,
      articles: [],
      isEditing: false,
      editId: null
    }
  }

  onToken(token: string) {
    this.setState({
      ...this.state,
      token: token
    });

    (async () => {
      const res = await backend.list(
        token,
        "articles_770_"
      );
      if (!res.ok) {
        console.error(res.content);
        return;
      }

      let articles = res.content.results;
      if (!articles) {
        articles = [];
      }

      this.setState({
        ...this.state,
        articles: articles
      })
    })();
  }

  onArticleSaved(article: Article) {
    let { articles, editId } = this.state;

    if (editId == null) {
      articles.push(article);
    } else {
      let idx = this.findArticle(articles, editId);
      if (idx > -1) {
        articles[idx] = article;
      }
    }

    this.setState({
      ...this.state,
      articles: articles,
      isEditing: false,
      editId: null
    })
  }

  edit(id: string) {
    this.setState({
      ...this.state,
      isEditing: true,
      editId: id
    })
  }

  del = async (id: string) => {
    const res = await backend.delete(
      this.state.token || "",
      "articles_770_",
      id || ""
    );
    if (!res.ok) {
      alert(res.content);
      return;
    }

    let { articles } = this.state;

    let idx = this.findArticle(articles, id);
    if (idx > -1) {
      articles.splice(idx, 1);
    }

    this.setState({
      ...this.state,
      articles: articles
    })
  }

  findArticle = (articles: Article[], id: string): number => {
    let idx = -1;
    for (var i = 0; i < articles.length; i++) {
      if (articles[i].id == id) {
        idx = i;
        break;
      }
    }
    return idx;
  }

  newArticle() {
    this.setState({
      ...this.state,
      isEditing: true
    })
  }

  renderArticle(a: Article) {
    return (
      <li key={a.id}>
        <h4>{a.title}</h4>
        <p>{a.body}</p>
        <p>By {a.authorName} on {a.created}</p>
        <p>
          <button onClick={this.edit.bind(this, a.id)}>Edit</button>
          <button onClick={this.del.bind(this, a.id)}>Delete</button>
        </p>
      </li>
    )
  }

  render() {
    if (!this.state.token) {
      return <Auth onToken={this.onToken.bind(this)} />;
    } else if (this.state.isEditing) {
      return <ArticleEdit
        token={this.state.token}
        editId={this.state.editId}
        onSave={this.onArticleSaved.bind(this)}
      />;
    }

    return (
      <div>
        <h1>List articles</h1>
        <button onClick={this.newArticle.bind(this)}>
          Create a new article
        </button>
        <p>
          <strong>Todo list articles</strong>
        </p>
        <ul>
          {this.state.articles.map((a) => this.renderArticle(a))}
        </ul>
      </div>
    )
  }
}
