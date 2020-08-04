import React from 'react';
import { shallow } from 'enzyme';
import Pokemons from './pokemons';
import Pokemon from "./pokemon/pokemon";

describe('Pokemons', () => {
	it('Renders Pokemons', () => {
		const wrapper = shallow(<Pokemons />);

		expect(wrapper.type()).toEqual('div');
	});

	describe('When User selects a PokenType from Type Dropdown It filters UI based on selected Type', () => {
		it('Should filter pokenmon based on type', () => {

			const event = {
				target: {
					value: 'Fire'
				},
			}
			const wrapper = shallow(<Pokemons />);

			wrapper.setState({isLoading: false});
			expect(wrapper.state().selectedType).toEqual({value: '', label: ''});
			wrapper.find('select').props().onChange(event);
			expect(wrapper.state().selectedType).toEqual({value: 'Fire', label: 'Fire'})
		});
	});

	describe('When user Clicks on GridView Icon Pokemons display in Grid View', () => {
		it('Should Display user in Grid View', () => {
			const wrapper = shallow(<Pokemons />);

			wrapper.setState({isLoading: false});
			expect(wrapper.state().gridView).toEqual(true);
			wrapper.find('.GridView').props().onClick();
			expect(wrapper.state().gridView).toEqual(true);
		});
	});

	describe('When user Clicks on ListView Icon Pokemons display in List View', () => {
		it('Should Display user in List View', () => {
			const wrapper = shallow(<Pokemons />);

			wrapper.setState({isLoading: false});
			expect(wrapper.state().gridView).toEqual(true);
			wrapper.find('.ListView').props().onClick();
			expect(wrapper.state().gridView).toEqual(false);
		});
	});

	describe('When User clicks on Favorites Tab Displays only Favorite Pokemons', () => {
		it('Should display only favorite Pokemons', () => {
			const event = {
				target: {
					id: 'FavTab'
				}
			}
			const wrapper = shallow(<Pokemons />);

			wrapper.setState({isLoading: false});
			expect(wrapper.state().favoritesTab).toEqual(false);
			wrapper.find('#allTab').props().onClick(event);
			expect(wrapper.state().favoritesTab).toEqual(true);
		});
	});
});
