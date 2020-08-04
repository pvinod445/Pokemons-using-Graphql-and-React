import React from 'react';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import gql from 'graphql-tag';

/**
 * Creates Apollow Client which is used to query Graphql
 * @returns void
 */
function createApolloClient() {
	const cache = new InMemoryCache();
	const link = new HttpLink({
		uri: 'http://localhost:4000/graphql'
	});

	const client = new ApolloClient({
		cache,
		link
	});

	return client;
}

/**
 * Fetches Pokemons from the backend Service and Saves that in our local State using ApolloClient
 * @returns array
 */
export const getPokemons = async (limit, searchText, pokemonType, isFavorite) => {
	const client = createApolloClient();
	let pokemons = null;
	await client.query({
		query: gql`
		{
			pokemons(query: { limit: ${parseInt(limit + 10)}, offset: 0, search: "${searchText}", filter: {type: "${pokemonType}", isFavorite: ${isFavorite}} })
			{
				edges { id, name, image, maxCP, maxHP, types, isFavorite ,weight{minimum, maximum}, height{minimum, maximum}, evolutions{name, image} }
			}
		}`
	}).then(response => {
		pokemons = response.data.pokemons.edges;
	}).catch(error => {
		alert('Failed to reach the server. Please try again')
	});

	return await pokemons;
}

/**
 * Fetches PokemonByName from the backend Service and Saves that in our local State using ApolloClient
 * @returns object
 */
export const getPokemonByName = async (pokemonName) => {
	const client = createApolloClient();
	let pokemonByName = null;
	await client.query({
		query: gql`
		{
			pokemonByName(name: "${pokemonName}")
			{
				id, name, image, maxCP, maxHP, types, isFavorite ,weight{minimum, maximum}, height{minimum, maximum}, evolutions{id, name, image, isFavorite}
			}
		}`
	}).then(response => {
		pokemonByName = response.data.pokemonByName;
	}).catch(error => {
		alert('Failed to reach the server. Please try again')
	});

	return await pokemonByName;
}

/**
 * Gets Unique pokemon Types
 * @returns array
 */
export const getPokemonTypes = async () => {
	const client = createApolloClient();
	let pokemonTypes = null;
	await client.query({
		query: gql`
		{
			pokemonTypes
		}`
	}).then(response => {
		pokemonTypes = [''].concat(response.data.pokemonTypes);
	}).catch(error => {
		alert('Failed to reach the server. Please try again')
	});

	return await pokemonTypes;
}

/**
 * Adds Pokemon to Favorites list
 */
export const favoritePokemon = async (id) => {
	const client = createApolloClient();
	await client.mutate({
		mutation: gql`
			mutation {
				favoritePokemon(id: "${id}") {id, isFavorite}
			  }`
	}).then(response => {

	});
	return true;
}

/**
 * Removes Pokemon from Favorites list
 */
export const unFavoritePokemon = async (id) => {
	const client = createApolloClient();
	await client.mutate({
		mutation: gql`
			mutation {
				unFavoritePokemon(id: "${id}") {id, isFavorite}
			}`
	}).then(response => {
	});

	return true;
}
