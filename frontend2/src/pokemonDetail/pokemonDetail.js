import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string'

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import gql from 'graphql-tag'
import { FiHeart } from 'react-icons/fi';

import Pokemon from '../pokemons/pokemon/pokemon';
import './pokemonDetail.css';

class PokemonDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pokemon: null
		}
	}

	componentDidMount() {
		this.getPokemon();
	}

	/**
	 * Fetches Pokemon in detail from the backend Service and Saves that in our local State using ApolloClient
	 * @returns void
	 */
	getPokemon() {
		let urlPath= window.location.pathname.split('/');
		const pokemonName = urlPath[1];
		this.setState({pokemonName: pokemonName});
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
				pokemons(query: {limit: 10, offset: 0, search: "${pokemonName}"})
				{
					edges { id, name, image, maxCP, maxHP, types, weight{minimum, maximum}, height{minimum, maximum}, evolutions{name, image} }
			  }
			}`
		  }).then(response => {
			this.setState({pokemon: response.data.pokemons.edges[0]});
		})
		.catch(error => {
			alert('Failed to reach the server. Please try again')
		});
	}

	render () {
		const queryParams = queryString.parse(this.props.location.search);
		let pokemonDetail = null;
		let evolutions = null;
		if(this.state.pokemon != null) {
			if(this.state.pokemon.evolutions.length) {
				evolutions = this.state.pokemon.evolutions.map((evolution, index) => {
					return(
						<div key={index} className='col-md-4' style={{border: '1px solid lightgray', borderRadius: '5px'}} >
							<div className='row' style={{height: '200px'}}>
								<div className='col-12' style={{padding: '5px 10px 5px 10px'}}>
									<img src={evolution.image} height='100' width='100' />
								</div>
							</div>

							<div id='evopokemonDetails' className='row'>
								<div className='col-9'>
									<b>{evolution.name}</b>
								</div>
								<div className='col-3'>
									<FiHeart id='favIcon' />
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
						<Pokemon pokemon={this.state.pokemon} detail={true} isFav={queryParams.isFav} />
					</div>
					<br />
					<div className='container-fluid' style={{width: '100%'}}>
						<div style={{textAlign: 'left'}}>
							<h4>Evolutions</h4>
						</div>

						<div className='row' style={{marginBottom: '10px'}}>
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
			<div id='mainDiv'>
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
			</div>
		);
	}
}

export default PokemonDetail;