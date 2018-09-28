import React, { Component } from 'react';
import '../styles/App.css';

import { Query } from "react-apollo";
import gql from "graphql-tag";

const GET_SEARCH_TERM = gql`
  query Query($searchTerm: String!){
    search(userInput: $searchTerm) {
      hits {
        artist
        title
        lyrics
      }
    }
  }
`;

const SearchLyrics = ({ searchTerm }) => (
  <Query
    query={ GET_SEARCH_TERM }
    variables={{ searchTerm }}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return data.search.hits.map(({ artist, title, lyrics }, i) => (
        <div style={{border: '1px solid grey', margin: '30px 30px 0 30px'}} key={i}>
          <p>{artist}</p>
          <p>{title}</p>
          <p>{lyrics ? lyrics : 'No lyrics Found :('}</p>
        </div>
      ));
    }}
  </Query>
)

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      search: '',
      newSearch: ''
    }
  }

  handleChange(val) {
    this.setState({ search: val });
  }

  updateLyrics() {
    this.setState({ newSearch: this.state.search })
  }

  render() {
    return (
      <div className="App">
        <input onChange={e => this.handleChange(e.target.value)}></input>
        <button onClick={() => this.updateLyrics()}>Search</button>
        <SearchLyrics searchTerm={this.state.newSearch}/>
      </div>
    );
  }
}

export default App;
