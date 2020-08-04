import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';

import { BsVolumeUpFill } from "react-icons/bs";
import { FcLike } from 'react-icons/fc';
import { FiHeart } from 'react-icons/fi';

import './pokemon.css';

class Pokemon extends Component {
	state = {
		isOpen: false,
	}
	/**
	 * Plays audio file when click on audio symbol
	 * @returns void
	 */
	playAudio() {
		const audioEl = document.getElementsByClassName("audio-element")[0];
		audioEl.play();
	}

	/**
	 * Toggles to open pokemon Detail in React Modal
	 * @returns void
	 */
	toggleModal = () => {
		this.setState({isOpen: !this.state.isOpen});
	}

	render() {
		let favIcon = null;
		let pokemonDetail = null;
		let audioTag = null;
		let audioSrc = 'http://localhost:4000/sounds/' + parseInt(this.props.pokemon.id);
		if(this.props.isFav) {
			favIcon = (
				<div className='favIcon' onClick={this.props.clicked} >
					<FcLike />
				</div>

			);
		}
		else {
			favIcon = (
				<div className='NonfavIcon' onClick={this.props.clicked} >
					<FiHeart />
				</div>
			);
		}

		if(this.props.detail || this.state.isOpen) {
			audioTag = (
				<div className='autoTag'>
					<BsVolumeUpFill onClick={this.playAudio} style={{position: 'absolute', bottom: '8px', left: '16px', color: 'darkcyan'}} />
					<audio className='audio-element'>
						<source src={audioSrc}></source>
					</audio>
				</div>
			);

			pokemonDetail = (
				<div id='pokemonDetails'>
					<div  className='row' style={{margin: '0px'}}>
						<div className='col-10'>
							{this.state.isOpen ? <b>{this.props.pokemon.name}</b> : (
								<Link
								style={{textDecoration: 'none', color: 'black'}}
								params={{ favNames: this.props.favNames }}
								to={{
									pathname: '/'+this.props.pokemon.name,
								}} >
								<b>{this.props.pokemon.name}</b>
							</Link>
							)}
							<br />
							<span>
								{this.props.pokemon.types.join(', ')}
							</span>
						</div>
						<div className='col-2' id='iconDiv'>
							{favIcon}
						</div>
						<div className='col-md-7'>
							<hr style={{border: '3px solid cornflowerblue', borderRadius: '15px'}} />
						</div>
						<div className='col-md-5'>
							<b>CP: {this.props.pokemon.maxCP}</b>
						</div>
						<div className='col-md-7'>
							<hr style={{border: '3px solid darkcyan', borderRadius: '15px'}} />
						</div>
						<div className='col-md-5'>
							<b>HP: {this.props.pokemon.maxHP}</b>
						</div>
					</div>
					<div className='row' style={{borderTop: '1px solid darkgrey'}}>
						<div className='col-md-6' style={{borderRight: '1px solid darkgrey'}}>
							<b>Weight</b>
							<br/>
							{this.props.pokemon.weight.minimum} - {this.props.pokemon.weight.maximum}
						</div>
						<div className='col-md-6'>
							<b>Height</b>
							<br/>
							{this.props.pokemon.height.minimum} - {this.props.pokemon.height.maximum}
						</div>
					</div>
				</div>
			);
		}
		else {
			pokemonDetail = (
				<div id='pokemonDetails' className='row'>
					<div className='col-10'>
						<Link
							style={{textDecoration: 'none', color: 'black'}}
							to={{
								pathname: '/'+this.props.pokemon.name,
							}} >
							<b>{this.props.pokemon.name}</b>
						</Link>
						<br />
						<span>
							{this.props.pokemon.types.join(', ')}
						</span>
					</div>
					<div className='col-2' id='iconDiv'>
						{favIcon}
					</div>
				</div>
			);
		}

		return (
			<div className='container-fluid'>
				<div className='row' style={{height: '200px', border: '1px solid lightgray', margin: '0px'}}>
					<div className='col-12' style={{padding: '5px 10px 5px 10px'}}>
						<Link
							style={{textDecoration: 'none', color: 'black'}}
							params={{ favNames: this.props.favNames }}
							to={{
								pathname: '/'+this.props.pokemon.name,
							}} >
							<img src={this.props.pokemon.image} alt='PokemonImage' height='100' width='100' />
							{audioTag}
						</Link>
						{!this.props.detail ? <button className='ModalButton' onClick={this.toggleModal}>QuicK View</button> : null}
							<Modal className="quickViewModalDialog" isOpen={this.state.isOpen} onRequestClose={this.toggleModal}>
								<div className='container-fluid'>
									<div>
										<h4>
											Quick View
										</h4>
									</div>
									<div className='row' style={{height: '200px'}}>
										<div className='col-12' style={{padding: '5px 10px 5px 10px'}}>
											<img src={this.props.pokemon.image} alt='PokemonImage' height='100' width='100' />
											{audioTag}
										</div>
									</div>
								</div>
								{pokemonDetail}
								<br />
								<br />
								<div style={{textAlign: 'center'}}>
									<button className='CloseModalButton' onClick={this.toggleModal}>Close</button>
								</div>
							</Modal>
					</div>
				</div>
				{pokemonDetail}
			</div>
		);
	}
}

export default Pokemon;