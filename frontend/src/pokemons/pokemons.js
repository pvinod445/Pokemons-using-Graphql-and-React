import React, { Component } from 'react';
import Loader from 'react-loader-spinner'
import { BsGrid3X2GapFill, BsJustify } from "react-icons/bs";

import Pokemon from './pokemon/pokemon';
import { getPokemons } from '../hoc/apolloclient';
import { favoritePokemon } from '../hoc/apolloclient';
import { unFavoritePokemon } from '../hoc/apolloclient';
import { getPokemonTypes } from '../hoc/apolloclient';
import './pokemons.css';

class Pokemons extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pokemons: [],
			pokemonTypes: [],
			searchedPokemon: '',
			selectedType: {value: '', label: ''},
			gridView: true,
			favoritesTab: false,
			currentOffset: 0,
			isLoading: true,
		};

	}

	async componentDidMount() {
		let pokemons = await await getPokemons(this.state.currentOffset, this.state.searchedPokemon, this.state.selectedType.value, this.state.favoritesTab);
		let pokemonTypes = await getPokemonTypes();
		this.setState({pokemons: pokemons, pokemonTypes: pokemonTypes, isLoading: false});
		window.addEventListener('scroll', this.infiniteScrollHandler, true);
	}

	async componentDidUpdate(prevProps, prevState) {
		if(this.state.pokemons.length === 0 ||
			prevState.currentOffset !== this.state.currentOffset ||
			prevState.searchedPokemon !== this.state.searchedPokemon ||
			prevState.selectedType !== this.state.selectedType ||
			prevState.favoritesTab !== this.state.favoritesTab
			) {
			const pokemons = await getPokemons(this.state.currentOffset, this.state.searchedPokemon, this.state.selectedType.value, this.state.favoritesTab);
			this.setState({pokemons: pokemons, isLoading: false});
		}
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
	favHandler = async (e, pokemonName, id) => {
		let pokemons = null;
		if(e.target.parentElement.parentElement.className === 'favIcon') {
			const removedFromFav = unFavoritePokemon(id);

			alert(pokemonName + ' is removed from favorites.');
			if(removedFromFav) {
				pokemons = await getPokemons(this.state.currentOffset, this.state.searchedPokemon, this.state.selectedType.value, this.state.favoritesTab);
				this.setState({pokemons: pokemons});
			}
		}
		else {
			const addedToFav = favoritePokemon(id);
			alert(pokemonName + ' is added to favorites.');

			if(addedToFav) {
				pokemons = await getPokemons(this.state.currentOffset, this.state.searchedPokemon, this.state.selectedType.value, this.state.favoritesTab);
				this.setState({pokemons: pokemons});
			}
		}
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

	render () {
		let pokemons = null;

		if(this.state.pokemons.length > 0) {
			pokemons = this.state.pokemons.map((pokemon, index) => {
				if(pokemon != null) {
					return (
						<div key={index} className={this.state.gridView ? 'col-md-3' : 'col-sm-12'} style={{padding: '0px'}} >
							<Pokemon
								pokemon={pokemon}
								isFav={pokemon.isFavorite}
								clicked={(event) => this.favHandler(event, pokemon.name, pokemon.id)} />
						</div>
					);
				}
				else {
					return null;
				}
			});
		}

		return (
			this.state.isLoading ?
				(
				<div style={{position: 'absolute', top: '40%', left: '50%'}}>
						<Loader
							type="Oval"
							color="#00BFFF"
							height={100}
							width={100}
						/>
				</div>
				)
				:
				(
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
																	{this.state.pokemonTypes.map((option, index) => {
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
				)
		);
	}
}

export default Pokemons;