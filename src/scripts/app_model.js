import { EventEmitter } from './event_emitter.js';
import { IDGenerator } from './id_generator.js';
import { Autosave } from './autosave.js';

export class AppModel extends EventEmitter {
    constructor() {
        super();
        this.data = [];
        this.url = 'https://todoapp-dff63.firebaseio.com/.json';
        fetch(this.url, { method: 'GET' })
            .then(response => {
                if (response.status === 200) return response.json();
            })
            .then(data => {
                this.data = data || [];
                this.emit('ready', this.data);
            });
    }
    updateStatus(){
        this.emit('status updated', this.data);
    }

    getIDs() {
        let existingIDs = [];
        this.data.forEach(list => {
            existingIDs.push(list.id)
        });
        return existingIDs;
    }

    addList(list) {
        list.id = this.newID();
        list.opened = false;
        list.items = [];
        list.status = 'Empty';
        this.data.unshift(list);
        this.save();
        this.emit('data changed new list', list);
        this.emit('status updated', this.data);
    }


    deleteList(list) {
        let index = this.data.indexOf(list);
        this.data.splice(index, 1);
        this.emit('status updated', this.data);
        this.save();
    }
}

Object.assign(AppModel.prototype, new Autosave(), new IDGenerator());


