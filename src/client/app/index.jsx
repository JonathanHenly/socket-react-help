'use strict';

import React from 'react';
import {render} from 'react-dom';

const io = require('socket.io-client');
const socket = io();

class Message extends React.createComponent {
	render() {
		return (
			<div className="message">
				<strong>{this.props.message}</strong>		
			</div>
		);
	}
}

class MessageList extends React.Component {
	render() {
		return (
			<div className='messages'>
				<h2> Conversation: </h2>
				{
					this.props.messages.map((message, i) => {
						return (
							<Message
								key={i}
								text={message.text} 
							/>
						);
					})
				} 
			</div>
		);
	}
}

class App extends React.Component {
  
  getInitialState() {
		return {messages:[], text: ''};
	}

	componentDidMount() {
		socket.on('init', this._initialize);
		socket.on('send:message', this._messageRecieve);
	}

	_initialize(data) {
	  var {messages} = this.state;
	  messages.push(data);
	  this.setState({messages});
  }
  
  _messageRecieve(message) {
		var {messages} = this.state;
		messages.push(message);
		this.setState({messages});
  }
  
  render() {
  	return (
			<div>
				<MessageList
					messages={this.state.messages}
				/>
			</div>
		);
  }
  
}

render(<App/>, document.getElementById('app'));  
