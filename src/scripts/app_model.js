import { EventEmitter } from './event_emitter.js';

export class AppModel extends EventEmitter {
    constructor() {
        super();
        this.data = [];
    }
    getLists() {
        fetch('https://todoapp-dff63.firebaseio.com/.json', { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                this.data = data ? Object.entries(data) : [];
                this.data.forEach(list=>{
                    list[1].items = list[1].items ? Object.entries(list[1].items) : [];
                })
                this.emit('ready', this.data);
            })
    }
    addList(list) {
        fetch('https://todoapp-dff63.firebaseio.com/.json', { method: 'POST', body: JSON.stringify(list) })
            .then(response => response.json())
            .then((data) => {
                let id = data.name;
                this.data.push([id, list]);
                this.emit('list added', [id, list]);
            })
    }
}