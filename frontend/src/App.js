import React from 'react';
import { BrowserRouter, Route} from "react-router-dom";
import { ApolloProvider } from '@apollo/client';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';

import './App.css';
import Pokemons from './pokemons/pokemons';
import PokemonDetail from './pokemonDetail/pokemonDetail';

function App() {
  const cache = new InMemoryCache();
  const link = new HttpLink({
	uri: 'http://localhost:4000/graphql'
  });

  const client = new ApolloClient({
	cache,
	link
  });

  return (
    <div className="App">
		<BrowserRouter>
			<ApolloProvider client={client}>
				<Route path='/' exact component={Pokemons} />
				<Route path='/:name' exact component={PokemonDetail} />
			</ApolloProvider>
		</BrowserRouter>

    </div>
  );
}

export default App;
