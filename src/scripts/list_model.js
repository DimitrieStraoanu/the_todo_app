import { EventEmitter } from './event_emitter.js';
import { AutosaveService } from './autosave.js';

export class ListModel extends EventEmitter {
    constructor(data) {
        super();
        this.id = data[0];
        this.url = `https://todoapp-dff63.firebaseio.com/${this.id}/.json`;
        this.data = data[1];
        this.autosave = new AutosaveService(this.data, this.url);
    }

    init() {
        this.sortList();
        this.emit('list changed', this.data);
    }

    addItem(item) {
        let url = `https://todoapp-dff63.firebaseio.com/${this.id}/items/.json`;
        fetch(url, { method: 'POST', body: JSON.stringify(item) })
            .then(response => response.json())
            .then(data => {
                let id = data.name;
                if (!this.data.items) this.data.items = [];
                this.data.items.push([id, item])
                this.emit('list changed', this.data);
            });

    }

    deleteList() {
        let url = `https://todoapp-dff63.firebaseio.com/${this.id}/.json`;
        fetch(url, { method: 'DELETE' })
            .then(() => {
                this.emit('list deleted');
            });
    }

    updateList(data) {
        let url = `https://todoapp-dff63.firebaseio.com/${this.id}/.json`;
        fetch(url, { method: 'PATCH', body: JSON.stringify(data) })
            .then(() => {
                this.data = { ...this.data, ...data };
                this.emit('list changed', this.data);
            });

    }

    sortList() {
        this.data.items.sort((firstItem, secondItem) => {
            if (!firstItem[1].checked && secondItem[1].checked) return -1;
        });
        this.emit('list changed', this.data)
    }

    updateItem(modifiedItem) {
        let id = modifiedItem[0];
        let url = `https://todoapp-dff63.firebaseio.com/${this.id}/items/${id}/.json`;
        fetch(url, { method: 'PATCH', body: JSON.stringify(modifiedItem[1]) })
            .then(() => {
                let item = this.data.items.find(currentItem => currentItem[0] === modifiedItem[0]);
                item[1] = Object.assign(item[1], modifiedItem[1]);
                this.emit('list changed', this.data);
            });
    }
}