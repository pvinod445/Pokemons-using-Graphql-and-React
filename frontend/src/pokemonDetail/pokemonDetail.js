import React, { Component } from 'react';
import Loader from 'react-loader-spinner'
import { Link } from 'react-router-dom';

import { FcLike } from 'react-icons/fc';
import { FiHeart } from 'react-icons/fi';

import Pokemon from '../pokemons/pokemon/pokemon';
import { getPokemonByName } from '../hoc/apolloclient';
import { favoritePokemon } from '../hoc/apolloclient';
import { unFavoritePokemon } from '../hoc/apolloclient';
import './pokemonDetail.css';

class PokemonDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pokemon: null,
			isLoading: true,
		}
	}

	async componentDidMount() {
		let pokemonByName = await getPokemonByName(this.props.match.params.name);
		this.setState({pokemon: pokemonByName, isLoading: false})
	}

	async componentDidUpdate(prevProps, prevState) {
		if(prevState.pokemon !== this.state.pokemon) {
			let pokemonByName = await getPokemonByName(this.props.match.params.name);
			this.setState({pokemon: pokemonByName})
		}
	}

	/**
	 * Adds or removes pokemon to and from pokemon
	 * @returns void
	 */
	favHandler = async (e, pokemonName, id) => {
		if(e.target.parentElement.parentElement.className === 'favIcon') {
			const removedFromFav = unFavoritePokemon(id);

			alert(pokemonName + ' is removed from favorites.');
			if(removedFromFav) {
				let pokemonByName = await getPokemonByName(this.props.match.params.name);
				this.setState({pokemon: pokemonByName})
			}
		}
		else {
			const addedToFav = favoritePokemon(id);
			alert(pokemonName + ' is added to favorites.');

			if(addedToFav) {
				let pokemonByName = await getPokemonByName(this.props.match.params.name);
				this.setState({pokemon: pokemonByName})
			}
		}
	}

	render () {
		let pokemonDetail = null;
		let evolutions = null;
		if(this.state.pokemon != null) {
			if(this.state.pokemon.evolutions.length) {
				evolutions = this.state.pokemon.evolutions.map((evolution, index) => {
					let favIcon = null;
					if(evolution.isFavorite) {
						favIcon = (
							<div className='favIcon' onClick={(event) => this.favHandler(event, evolution.name, evolution.id)} >
								<FcLike />
							</div>

						);
					}
					else {
						favIcon = (
							<div className='NonfavIcon' onClick={(event) => this.favHandler(event, evolution.name, evolution.id)} >
								<FiHeart />
							</div>
						);
					}
					return(
						<div key={index} className='col-md-4' style={{border: '1px solid lightgray'}} >
							<div className='row' style={{height: '200px'}}>
								<div className='col-12' style={{padding: '5px 10px 5px 10px'}}>
									<img alt='EvolutionImage' src={evolution.image} height='100' width='100' />
								</div>
							</div>

							<div id='evopokemonDetails' className='row'>
								<div className='col-9'>
									<b>{evolution.name}</b>
								</div>
								<div className='col-3'>
									{favIcon}
								</div>
							</div>
						</div>
					);
				});
			}
			else {
				evolutions = (<div>
					No Evolutions found for Pokemon <b style={{color: 'red'}}>{this.state.pokemon.name}</b>
				</div>);
			}

			pokemonDetail = (
				<div>
					<div id='pokeId'>
						<Pokemon
							pokemon={this.state.pokemon}
							detail={true}
							isFav={this.state.pokemon.isFavorite}
							clicked={(event) => this.favHandler(event, this.state.pokemon.name, this.state.pokemon.id)} />
					</div>
					<br />
					<div className='container-fluid' style={{width: '100%', padding: '0px 10px 0px 10px'}}>
						<div style={{textAlign: 'left'}}>
							<h4>Evolutions</h4>
						</div>

						<div className='row' style={{margin: '0px'}}>
							{evolutions}
						</div>
					</div>
				</div>
			);
		}
		else {
			pokemonDetail = <div>Loading.....</div>
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
			(<div id='mainDiv'>
				<div id='backButton'>
					<Link
						style={{textDecoration: 'none', color: 'black'}}
						to={{
							pathname: '/',
						}} >
						Go to Main Page
					</Link>
				</div>

				<table id='pokemonDetailTable' align='center' style={{border: '1px solid lightgray', width: '100%'}}>
					<tbody>

						<tr>
							<td>
								<div style={{borderBottom: '1px solid lightgray', width: '100%'}}>
									<h2>Detail View</h2>
								</div>
							</td>
						</tr>
						<tr>
							<td id='grid'>
								{pokemonDetail}
							</td>
						</tr>
					</tbody>
				</table>
			</div>)
		);
	}
}

export default PokemonDetail;