const EventEmitter = require('events');
const readline = require('readline');

// create readable streams
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// instantiate and pass event emitter to the server
const client = new EventEmitter();
const server = require('./server')(client);

server.on('response', (res) => {
  console.log(res);
});

rl.on('line', (input) => {
  // first arg is the command, rest are arguments to pass to server
  [command, ...args] = input.split(' ');
  client.emit('command', command, args);
});
