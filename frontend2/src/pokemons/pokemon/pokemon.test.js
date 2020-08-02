import React from 'react';
import { shallow } from 'enzyme';
import Pokemon from './pokemon';
import Modal from 'react-modal';

describe('pokemon', () => {
	it('renders pokemon', () => {
		const props = {
			pokemon: {
				id: 1,
				name: 'Pokemon Name',
				types: ['Fire'],
				maxCP: 100,
				maxHP: 200,
				image: 'https://test.com'
			}
		}
		const wrapper = shallow(<Pokemon {...props} />);

		expect(wrapper.type()).toEqual('div');
		expect(wrapper.childAt(0).props().className).toEqual('row');
	});

	describe('when user clicks on quick view button', () => {
		it('Should open modal', () => {
			const props = {
				pokemon: {
					id: 1,
					name: 'Pokemon Name',
					types: ['Fire'],
					maxCP: 100,
					maxHP: 200,
					image: 'https://test.com'
				}
			}
			const wrapper = shallow(<Pokemon {...props} />);

			expect(wrapper.find(Modal).props().isOpen).toEqual(false);
			wrapper.find('button.ModalButton').props().onClick();
			expect(wrapper.find(Modal).props().isOpen).toEqual(true);

		});
	});

});
