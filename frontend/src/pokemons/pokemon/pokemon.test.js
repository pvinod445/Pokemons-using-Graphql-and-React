import React from 'react';
import { shallow } from 'enzyme';
import Pokemon from './pokemon';
import Modal from 'react-modal';

describe('Pokemon', () => {
	it('Renders Pokemon', () => {
		const props = {
			pokemon: {
				id: 1,
				name: 'Pikachu',
				types: ['Fire'],
				maxCP: 100,
				maxHP: 200,
				image: 'https://pikachu.com'
			}
		}
		const wrapper = shallow(<Pokemon {...props} />);

		expect(wrapper.type()).toEqual('div');
		expect(wrapper.childAt(0).props().className).toEqual('row');
	});

	describe('When user clicks on quick view button', () => {
		it('Should open modal', () => {
			const props = {
				pokemon: {
					id: 1,
					name: 'Pikachu',
					types: ['Fire'],
					maxCP: 100,
					maxHP: 200,
					image: 'https://pikachu.com',
					weight: {
						minimum: 10,
						maximum: 15
					},
					height: {
						minimum: 40,
						maximum: 50
					}
				}
			}
			const wrapper = shallow(<Pokemon {...props} />);

			expect(wrapper.find(Modal).props().isOpen).toEqual(false);
			wrapper.find('button.ModalButton').props().onClick();
			expect(wrapper.find(Modal).props().isOpen).toEqual(true);

		});
	});

});
