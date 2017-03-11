'use strict';

import React from 'react';
import {render} from 'react-dom';

const io = require('socket.io-client');
const socket = io();

class Message extends React.Component {
  constructor(props) {
    super(props);
  }
  
	render() {
		return (
			<div className="message">
				<strong>{this.props.text}</strong>		
			</div>
		);
	}
}

class MessageList extends React.Component {
  constructor(props) {
    super(props);
  }  
  
	render() {
		return (
			<div className='messages'>
				<h2>Client-Server Chit Chat: </h2>
				{
					this.props.messages.map((msg, i) => {
						return (
							<Message
								key={i}
								text={msg.message}
							/>
						);
					})
				} 
			</div>
		);
	}
}

class OutputEntry extends React.Component {
  constructor(props) {
    super(props);
  }
  
	render() {
		return (
			<div className="output-entry">
			  <strong>{this.props.title}</strong>
			  <br />
				<p>{this.props.entry}</p>
			</div>
		);
	}
}


class OutputList extends React.Component {
  constructor(props) {
    super(props);
  }  
  
	render() {
		return (
			<div className='output-list'>
				<h2>Java Output: </h2>
				{
					this.props.output.map((out, i) => {
						return (
							<OutputEntry
								key={i}
								title={out.title}
								entry={out.output}
							/>
						);
					})
				} 
			</div>
		);
	}
}

class WordForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {word: '', count: ''};
    
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  
  handleSubmit(event) {
    event.preventDefault();
    this.props.onWordFormSubmit({word: this.state.word, count: this.state.count});
    this.setState({word: '', count: ''});
  }
  
  render() {
    return(
      <form onSubmit={this.handleSubmit} className='word-form'>
				<label>
				  Enter a word:
				  <input 
				    name="word"
				    type="text"
				    value={this.state.word}
				    onChange={this.handleInputChange} />
		    </label>
		    <br />
		    <label>
				  Enter an optional word count:
				  <input
				    name="count"
				    type="text"
				    value={this.state.count}
				    onChange={this.handleInputChange} />
				</label>
				<br />
				<input type="submit" value="Sumbit" />
			</form>
    );
  }
}

class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      output: [],
      text: ''
    };
    
    this.handleInit = this.handleInit.bind(this);
    this.handleResponseMessage = this.handleResponseMessage.bind(this);
    this.handleWordFormSubmit = this.handleWordFormSubmit.bind(this);
    this.handleResponseOutput = this.handleResponseOutput.bind(this);
	}

	componentDidMount() {
		socket.on('init', this.handleInit);
		socket.on('resp:message', this.handleResponseMessage);
		socket.on('resp:output', this.handleResponseOutput);
	}

	handleInit(data) {
	  var {messages} = this.state;
	  messages.push(data);
	  this.setState({messages});
  }
  
  handleResponseMessage(msg) {
		var {messages} = this.state;
		messages.push(msg);
		this.setState({messages});
  }
  
  handleResponseOutput(out) {
    var {output} = this.state;
    output.push(out);
    this.setState({output});
  }
  
  handleWordFormSubmit(data) {
    var {messages} = this.state;
    var sendWhat = 'Sending: {'
    
    sendWhat += (data.word !== '') ? 'word: ' + data.word : '';
    
    if(data.count !== '') {
      sendWhat += (data.word !== '') ? ', ' : '';
      sendWhat += 'count: ' + data.count;
    }
    
    sendWhat += '}';
    
    messages.push({message: sendWhat});
    this.setState({messages});
    
    socket.emit("unscramble:word", data);
  }
  
  render() {
  	return (
  	  <div>
			  <div>
			    <WordForm
			  	  onWordFormSubmit={this.handleWordFormSubmit}
			    />
		    </div>
		    <br />
			  <div>
				  <MessageList
				  	messages={this.state.messages}
				  />
			  </div>
			  <br />
			  <div>
			    <OutputList
			      output={this.state.output}
			    />
			  </div>
		  </div>
		);
  }
  
}

render(<App />, document.getElementById('app'));
