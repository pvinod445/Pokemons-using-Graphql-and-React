import React from 'react';
import { BrowserRouter, Route} from "react-router-dom";

import './App.css';
import Pokemons from './pokemons/pokemons';
import PokemonDetail from './pokemonDetail/pokemonDetail';

function App() {
  return (
    <div className="App">
		<BrowserRouter>
			<Route path='/' exact component={Pokemons} />
			<Route path='/:name' exact component={PokemonDetail} />
		</BrowserRouter>

    </div>
  );
}

export default App;
