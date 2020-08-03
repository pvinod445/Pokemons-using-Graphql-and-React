import React, { Component } from 'react';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import gql from 'graphql-tag'
import { BsGrid3X2GapFill, BsJustify } from "react-icons/bs";

import Pokemon from './pokemon/pokemon';
import './pokemons.css';

class Pokemons extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pokemons: [],
			types: [],
			searchedPokemon: '',
			selectedType: {value: '', label: ''},
			favorites: {
				ids: [],
				names: []
			},
			gridView: true,
			favoritesTab: false,
			currentOffset: 0
		};

	}

	componentDidMount() {
		this.getPokemons();
		window.addEventListener('scroll', this.infiniteScrollHandler, true);
	}

	componentDidUpdate(prevProps, prevState) {
		if(this.state.pokemons.length === 0 || prevState.currentOffset !== this.state.currentOffset) {
			this.getPokemons();
		}
	}

	/**
	 * Fetches Pokemon from the backend Service and Saves that in our local State using ApolloClient
	 * @returns void
	 */
	getPokemons() {
		const cache = new InMemoryCache();
		const link = new HttpLink({
			uri: 'http://localhost:4000/graphql'
		});

		const client = new ApolloClient({
			cache,
			link
		});

		client.query({
			query: gql`
			{
				pokemons(query: { limit: ${parseInt(this.state.currentOffset + 10)}, offset: 0})
				{
					edges { id, name, image, maxCP, maxHP, types, weight{minimum, maximum}, height{minimum, maximum}, evolutions{name, image} }
			  }
			}`
		}).then(response => {
			let pokemonTypes = [''];

			response.data.pokemons.edges.forEach(pokemon => {
				pokemon.types.forEach(pokemonType => {
					if(pokemonTypes.indexOf(pokemonType) < 0) {
						pokemonTypes.push(pokemonType);
					}
				});
		});

			this.setState({pokemons: response.data.pokemons.edges, types: pokemonTypes});
		}).catch(error => {
			alert('Failed to reach the server. Please try again')
		});
	}

	/**
	 * Infinite Scrolling for pokemon. Fetches next set of pokemon when reaching end of table
	 * @returns void
	 */
	infiniteScrollHandler = () => {
		const pokemonDataHeight = document.getElementById("bodyDiv");

		if(pokemonDataHeight !== null && typeof(pokemonDataHeight) !== undefined) {
			const pageHeight = Math.max(pokemonDataHeight.scrollHeight, pokemonDataHeight.offsetHeight);

			if(parseInt(pageHeight) === parseInt(pokemonDataHeight.offsetHeight + pokemonDataHeight.scrollTop)) {
				let currentOffset = parseInt(this.state.currentOffset) + 10
				this.setState({currentOffset: currentOffset});
			}
		}
	}

	/**
	 * Pokemon Search Handler (Pokemon Input field change handler)
	 * @returns void
	 */
	searchPokemonHandler = (event) => {
		this.setState({searchedPokemon: event.target.value});
	}

	/**
	 * Pokemon Selection Handler (Pokemon dropdown change handler)
	 * @returns void
	 */
	pokemonTypeChangeHandler = (event) => {
		const selected = {value: event.target.value, label: event.target.value};
		this.setState({selectedType: selected});
	}

	/**
	 * Changes UI to grid view
	 * @returns void
	 */
	gridViewHandler = (event) => {
		this.setState({gridView: true});
	}

	/**
	 * Changes UI to list view
	 * @returns void
	 */
	listViewHandler = (event) => {
		this.setState({gridView: false});
	}

	/**
	 * Adds or removes pokemon to and from pokemon
	 * @returns void
	 */
	favHandler = (e, pokemonName, index) => {
		let favPokemons = this.state.favorites;
		if(favPokemons.ids.indexOf(index) > -1) {
			favPokemons.ids.splice(favPokemons.ids.indexOf(index), 1);
			favPokemons.names.splice(favPokemons.names.indexOf(pokemonName), 1);
			alert(pokemonName + ' is removed from favorites.');
		}
		else {
			favPokemons.ids.push(index);
			favPokemons.names.push(pokemonName);
			alert(pokemonName + ' is added to favorites.');
		}
		this.setState({favorites: favPokemons});
	}

	/**
	 * Shifts tab between Favorites and All tabs
	 * @returns void
	 */
	favTabHandler = (e) => {
		if(e.target.id === 'FavTab') {
			this.setState({favoritesTab: true});
		}
		else {
			this.setState({favoritesTab: false});
		}
	}

	/**
	 * Filters pokemon based on dropdown and search field
	 * @returns void
	 */
	filterCriterial = (pokemon, pokemonType) => {
		if(this.state.searchedPokemon == null && pokemonType === '') {
			return true;
		}

		if(this.state.searchedPokemon !== '') {

			if(pokemon.name.indexOf(this.state.searchedPokemon) > -1) {
				if(pokemonType !== '') {
					if(pokemon.types.indexOf(pokemonType) > -1) {
						return true;
					}
					else {
						return false;
					}
				}
				return true;
			}

			return false;
		}
		else {
			if(pokemonType !== '') {
				if(pokemon.types.indexOf(pokemonType) > -1) {
					return true;
				}
				else {
					return false;
				}
			}
			return true;
		}

	}

	render () {
		let pokemons = null;
		let allPokemons = null;
		if(this.state.favoritesTab) {
			allPokemons = this.state.favorites.ids;
		}
		else {
			allPokemons = this.state.pokemons;
		}
		pokemons = allPokemons.map((each, index) => {
			let pokemon = null;
			if(this.state.favoritesTab) {
				pokemon = this.state.pokemons[each];
			}
			else {
				pokemon = each;
			}
			if(pokemon != null && this.filterCriterial(pokemon, this.state.selectedType.value)) {
				return (
					<div key={index} className={this.state.gridView ? 'col-md-3' : 'col-sm-12'} style={{padding: '0px'}} >
						<Pokemon
							pokemon={pokemon}
							isFav={this.state.favorites.ids.indexOf(index) > -1}
							clicked={(event) => this.favHandler(event, pokemon.name, index)} />
					</div>
				);
			}
			else {
				return null;
			}
		});

		const typeDropdownChoices = [];
		typeDropdownChoices.push({value: '', label: ''})
		this.state.types.forEach((type, index) => {
			typeDropdownChoices.push({value: type, label: type})
		});

		return (
			<table align='center' style={{border: '1px solid lightgray', margin: '10px', width: '100%'}}>
				<thead>

				</thead>
				<tbody>
					<tr>
						<td>
							<div style={{borderBottom: '1px solid lightgray', width: '100%'}}>
								<h2>List View</h2>
							</div>
						</td>
					</tr>
					<tr>
						<td>
							<div id='bodyDiv'>
								<table align='center' id='pokemonTable'>
									<thead></thead>
									<tbody>
										<tr>
											<td>
												<div id='pokemonDiv' className='container-fluid' style={{width: '100%', borderBottom: '2px solid lightgray'}}>
													<div className='row' style={{marginTop: '20px', display: 'inline-block', width: '100%'}}>
														<div style={{width: '50%', display: 'inline-block'}}>
															<button className={this.state.favoritesTab ? 'inActiveTab' : 'activeTab'} id='allTab' onClick={this.favTabHandler} >All</button>
														</div>
														<div style={{width: '50%', display: 'inline-block'}}>
															<button className={this.state.favoritesTab ? 'activeTab' : 'inActiveTab'} id='FavTab' onClick={this.favTabHandler}>Favorites</button>
														</div>
													</div>
													<div className='row' style={{margin: '20px 0px 20px 0px'}}>
														<div className='col-md-8'>
															<input type='text'
																className='PokemonSearch'
																style={{height: '100%'}}
																placeholder='Search'
																onChange={this.searchPokemonHandler}
																value={this.state.searchedPokemon} />
														</div>
														<div className='col-md-2'>
															<select
																onChange={this.pokemonTypeChangeHandler}
																value={this.state.selectedType.value}
																placeholder='Type'
															>
																{this.state.types.map((option, index) => {
																	return (
																		<option
																			key={index}
																			value={option}
																		>
																			{option === '' ? 'Type' : option}
																		</option>
																	)
																})}
															</select>
														</div>
														<div className='col-md-2'>
															<BsGrid3X2GapFill className='GridView' size='32' style={{color: 'darkcyan', cursor: 'pointer'}} onClick={this.gridViewHandler} />
															<BsJustify className='ListView' size='32' style={{color: 'darkcyan', cursor: 'pointer'}} onClick={this.listViewHandler} />
														</div>
													</div>
												</div>
												<div className='container-fluid' style={{width: '96%', marginTop: '20px'}}>
													<div className='row' style={{marginBottom: '10px'}}>
														{pokemons}
													</div>
												</div>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						 </td>
					</tr>
				</tbody>
			</table>
		);
	}
}

export default Pokemons;