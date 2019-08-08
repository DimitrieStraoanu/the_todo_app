import { EventEmitter } from './event_emitter.js';
import { Listener } from './listener.js';

export class ListView extends EventEmitter {
    constructor(listModel, listElementID) {
        super();

        this.listModel = listModel;
        this.element = document.querySelector(listElementID);
        this.listener = new Listener();

        listModel.on('list changed', (data) => this.updateListElement(data));
        listModel.on('list deleted', () => this.removeListElement());
    }

    updateListElement(data) {
        this.element.innerHTML = this.generateListHtml(data);

        this.listener.addListener({
            element: this.element.querySelector('#newItemBtn'),
            event: 'click',
            callback: () => this.makeNewItem()
        });

        this.listener.addListener({
            element: this.element.querySelector('#listBtn'),
            event: 'click',
            callback: () => this.toggleList()
        });

        this.listener.addListener({
            element: this.element.querySelector('#deleteBtn'),
            event: 'click',
            callback: () => this.confirmDelete()
        });

        this.listener.addListener({
            element: this.element.querySelector('#renameBtn'),
            event: 'click',
            callback: () => this.confirmRename()
        });

        this.listener.addListener({
            element: this.element.querySelector('#sortBtn'),
            event: 'click',
            callback: () => this.emit('sort items')
        });

        this.element.querySelectorAll('.itemBtn').forEach(itemBtn => {
            this.listener.addListener({
                element: itemBtn,
                event: 'click',
                callback: (e) => this.checkItem(e)
            });
        });
    }

    generateListHtml(data) {
        return `
            <div id="listBtn" class="d-flex align-items-center pointer ${data.opened ? '' : 'border-bottom'} p-3">
                <div class="d-flex align-items-center text-secondary m-0">
                    <h5 class="m-0">${data.name}</h5>
                </div>
                ${this.generateStatisticsHtml(data)}
            </div>
            <div id="listOptions" class="${data.opened ? '' : 'd-none'} bg-light">
                <div class="bg-primary p-1 position-relative"><span class="bg-primary marker"></span></div>
                <div class="d-flex justify-content-around border-bottom p-2">
                    <button id="renameBtn" class="btn btn-link p-0">Rename list</button>
                    <button id="deleteBtn" class="btn btn-link p-0">Delete list</button>
                    <button id="sortBtn" class="btn btn-link p-0" ${data.items.length ? '' : 'disabled'}>Sort checked</button>
                </div>
                <div class="d-flex mt-4 mx-3 pb-4">
                    <div class="flex-grow-1">
                        <input id="itemName" class="form-control" type="text" placeholder="Add new todo">
                    </div>
                    <button id="newItemBtn" class="btn btn-primary ml-1">+NewToDo</button>
                </div>
            </div>
            <div id="listItems" class="${data.opened ? '' : 'd-none'} bg-light text-secondary border-bottom">
                ${data.items.map(item => this.generateItemHtml(item)).join('')}
            </div>
        `;
    }

    generateStatisticsHtml(data) {
        if (data.items.length > 0) return `
            <span class="text-secondary ml-auto">${data.items.length} | ${this.getCheckedItems(data)}</span>
            <span class="ml-3 text-secondary">${this.getStatus(data)}</span>
        `;
        else return `
            <span class="text-secondary ml-auto">Add new ToDo</span>
        `;
    }

    generateItemHtml(item) {
        return `
            <div class="d-flex align-items-center border-top py-3">
                <div class="itemBtn d-flex align-items-center pointer" data-id="${item[0]}" data-checked = "${item[1].checked}">
                    <i class="far fa-${item[1].checked ? 'check-' : ''}square fa-125x ml-3"></i>
                    <span class="ml-2 ${item[1].checked ? 'checked' : ''}"> ${item[1].name}</span>
                </div>
                <button class="btn btn-link ml-auto p-0">Rename</button>
                <button class="btn btn-link ml-3 p-0 mr-3">Delete</button>
            </div>
        `;
    }

    makeNewItem() {
        let newItem = {
            name: this.element.querySelector('#itemName').value,
            checked: false
        };
        this.emit('newItem', newItem);
    }

    toggleList() {
        let isOpened = this.listModel.data.opened;
        if (isOpened) {
            this.emit('listElement changed', { opened: false });
        } else {
            this.emit('listElement changed', { opened: true });
        }
    }

    checkItem(e) {
        let id = e.currentTarget.dataset.id;
        let isChecked = e.currentTarget.dataset.checked;
        if (isChecked === 'true') {
            this.emit('itemElement changed', [id, { checked: false }]);
        } else {
            this.emit('itemElement changed', [id, { checked: true }]);
        }
    }

    getCheckedItems(data) {
        let checkedItems = 0;
        data.items.forEach(item => {
            if (item[1].checked) checkedItems++;
        });
        return checkedItems;
    }

    getStatus(data) {
        let checkedItems = this.getCheckedItems(data);
        let totalItems = data.items.length;
        if (checkedItems === totalItems) return 'Completed';
        else return 'In progress';
    }

    confirmDelete() {
        let div = document.createElement('div');
        let html = `
            <div class="fullscreen d-flex justify-content-center align-items-center">
                <div class="text-center p-5 bg-white shadow border">
                    <p class="mb-2">Delete list "${this.listModel.data.name}" ?</p>
                    <hr class="m-0">
                    <div class="mt-2">
                        <button id="cancelBtn" class="btn btn-link p-0">Cancel</button>
                        <button id="confirmBtn" class="btn btn-link p-0">Confirm</button>
                    </div>
                </div>
            </div>
        `;        
        div.innerHTML = html;

        this.listener.addListener({
            element: div.querySelector('#cancelBtn'),
            event: 'click',
            callback: () => div.parentElement.removeChild(div)
        });

        this.listener.addListener({
            element: div.querySelector('#confirmBtn'),
            event: 'click',
            callback: () => this.emit('listElement deleted')
        });

        this.element.appendChild(div);
    }

    removeListElement() {
        this.element.parentElement.removeChild(this.element);
        this.listener.removeAllListeners();
    }

    confirmRename() {
        let div = document.createElement('div');
        let html = `
            <div class="fullscreen d-flex justify-content-center align-items-center">
                <div class="text-center p-5 bg-white shadow border">
                    <input id="listName" class="form-control text-center border-0" type="text" value="${this.listModel.data.name}">
                    <hr class="m-0">
                    <div class="mt-2">
                        <button id="cancelBtn" class="btn btn-link">Cancel</button>
                        <button id="saveBtn" class="btn btn-link">Save</button>
                    </div>
                </div>
            </div>
        `;
        div.innerHTML = html;

        this.listener.addListener({
            element: div.querySelector('#cancelBtn'),
            event: 'click',
            callback: () => div.parentElement.removeChild(div)
        });

        this.listener.addListener({
            element: div.querySelector('#saveBtn'),
            event: 'click',
            callback: () => this.emit('listElement renamed', { name: this.element.querySelector('#listName').value })
        });

        this.element.appendChild(div);
    }
}