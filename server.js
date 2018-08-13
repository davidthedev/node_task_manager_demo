const EventEmitter = require('events');

class Server extends EventEmitter {
  constructor(client) {
    super();

    this.tasks = {};
    this.taskId = 1;

    if (client) {
      // emit a response before the event loop continues
      process.nextTick(() => {
        this.emit('response', 'Type a command (help to list all commands)');
      });

      // process client commands
      client.on('command', (command, args) => {
        switch (command) {
          case 'help':
          case 'ls':
          case 'add':
          case 'delete':
            this[command](args);
            break;
          default:
            this.emit('response', 'Unknown command');
            break;
        }
      });
    }
  }

  /*
   * Format tasks list
   */
  tasksString() {
    return Object.keys(this.tasks).map(key => {
      return `${key}: ${this.tasks[key]}`;
    }).join('\n');
  }

  /*
   * List all available commands
   */
  help() {
    this.emit('response', `Available commands:
      add - add a task
      ls - list task
      delete :id - delete a task`);
  }

  /*
   * List all saved tasks
   */
  ls() {
    this.emit('response', `Tasks:\n${this.tasksString()}`);
  }

  /*
   * Add a task
   */
  add(args) {
    this.tasks[this.taskId] = args.join(' ');
    this.emit('response', args.join(' '));
    this.taskId++;
  }

  /*
   * Delete a task
   */
  delete(args) {
    delete(this.tasks[args[0]]);
    this.emit('response', `Deleted task ${args[0]}`);
  }
}

module.exports = (client) => new Server(client);
