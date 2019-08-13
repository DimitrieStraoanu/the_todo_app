import { EventEmitter } from './event_emitter.js';
import { IDGenerator } from './id_generator.js';

export class ListModel extends EventEmitter {
    constructor(data) {
        super();
        this.data = data;
        this.data.items = this.data.items || [];

        setTimeout(() => this.emit('ready', this.data), 0);
    }

    getIDs() {
        let existingIDs = [];
        this.data.items.forEach(item => existingIDs.push(item.id));
        return existingIDs;
    }

    addItem(item) {
        item.id = this.newID();
        item.checked = false;
        this.data.items.push(item)
        this.emit('data changed', this.data);
    }
    deleteItem(id) {
        let item = this.data.items.find(item => item.id === id);
        let index = this.data.items.indexOf(item);
        this.data.items.splice(index, 1);
        this.emit('data changed', this.data);
    }

    updateList(data) {
        this.data = Object.assign(this.data, data);
        this.emit('data changed', this.data);
    }

    ready(){
        this.emit('ready',this.data);
    }
    
    sortList() {
        let checkedItems = this.data.items.filter(item => item.checked);
        if (checkedItems.length === 0 || checkedItems.length === this.data.items.length) return;

        if (!this.data.sortDirection) {
            if (this.data.items[0].checked) this.data.sortDirection = -1
            else this.data.sortDirection = 1
        } else if (this.data.sortDirection === -1) this.data.sortDirection = 1;
        else this.data.sortDirection = -1;

        this.data.items.sort((firstItem, secondItem) => {
            if (!firstItem.checked && secondItem.checked) return this.data.sortDirection;
            else if (firstItem.checked && !secondItem.checked) return -this.data.sortDirection;
        });

        this.emit('data changed', this.data)
    }

    updateItem(modifiedItem) {
        let item = this.data.items.find(currentItem => currentItem.id === modifiedItem.id);
        item = Object.assign(item, modifiedItem);
        this.emit('data changed', this.data);
    }
}

Object.assign(ListModel.prototype, new IDGenerator());