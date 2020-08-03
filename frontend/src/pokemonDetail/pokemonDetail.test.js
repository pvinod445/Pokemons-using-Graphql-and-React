import React from 'react';
import { shallow } from 'enzyme';
import PokemonDetail from './pokemonDetail';

describe('pokemon Details', () => {
	it('Renders Pokemon Details', () => {
		const props = {
			pokemon: {
				id: 1,
				name: 'Pikachu',
				types: ['Fire'],
				maxCP: 100,
				maxHP: 200,
				image: 'https://pikachu.com',
			},
			location: {
				search: '?isFav=true'
			},
			match: {
				params: {
					name: 'Bulbasaur'
				}
			}
		}
		const wrapper = shallow(<PokemonDetail {...props} />);

		expect(wrapper.type()).toEqual('div');
	});
});