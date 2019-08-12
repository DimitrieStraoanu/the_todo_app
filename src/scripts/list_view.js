import { EventEmitter } from './event_emitter.js';
import { Listener } from './listener.js';

export class ListView extends EventEmitter {
    constructor(listModel, listElementID) {
        super();

        this.listModel = listModel;
        this.element = document.querySelector('#' + listElementID);
        this.listener = new Listener();

        listModel.on('ready', (data) => this.updateListElement(data));
        listModel.on('data changed', (data) => this.updateListElement(data));
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

        this.element.querySelectorAll('.itemDeleteBtn').forEach(button => {
            this.listener.addListener({
                element: button,
                event: 'click',
                callback: (e) => this.deleteItem(e)
            });
        });

        this.element.querySelectorAll('.itemRenameBtn').forEach(button => {
            this.listener.addListener({
                element: button,
                event: 'click',
                callback: (e) => this.renameItem(e)
            });
        });

        this.element.querySelectorAll('.itemBtn').forEach(button => {
            this.listener.addListener({
                element: button,
                event: 'click',
                callback: (e) => this.checkItem(e)
            });
        });
    }

    generateListHtml(data) {
        return `
            <div id="listBtn" class="d-flex align-items-center pointer ${data.opened ? 'bg-primary text-white' : 'border-bottom border-top text-secondary bg-light'} p-3">
                    <div>
                        <i class="fas fa-plus ${data.opened ? 'd-none' : ''}"></i>
                        <i class="fas fa-chevron-up ${data.opened ? '' : 'd-none'}"></i>
                        <span class="h5 ml-2">${data.name}</span>
                    </div>
                    ${this.generateStatisticsHtml(data)}
            </div>
            <div class="${data.opened ? '' : 'd-none'}">
                <div id="listOptions" class="bg-light">
                    <div class="d-flex justify-content-around border-bottom p-3">
                        <button id="renameBtn" class="btn btn-outline-primary">Rename list</button>
                        <button id="deleteBtn" class="btn btn-outline-primary">Delete list</button>
                        <button id="sortBtn" class="btn btn-outline-primary" ${data.items.length ? '' : 'disabled'}>Sort checked</button>
                    </div>
                    <div class="d-flex mt-4 mx-3 pb-4">
                        <div class="flex-grow-1">
                            <input id="itemName" class="form-control" type="text">
                        </div>
                        <button id="newItemBtn" class="btn btn-primary ml-1">+NewToDo</button>
                    </div>
                </div>
                <div id="listItems" class="bg-light text-secondary border-bottom">
                    ${data.items.map(item => this.generateItemHtml(item)).join('')}
                </div>
            </div>
        `;
    }

    generateStatisticsHtml(data) {
        if (data.items.length > 0) return `
            <span class="ml-auto">${data.items.length} | ${this.getCheckedItems(data)}</span>
            <span class="ml-3">${this.getStatus(data)}</span>
        `;
        else return `
            <span class="ml-auto">Empty list</span>
        `;
    }

    generateItemHtml(item) {
        return `
            <div class="d-flex align-items-center border-top py-3">
                <div class="itemBtn d-flex align-items-center pointer" data-id="${item.id}" data-checked = "${item.checked}">
                    <i class="text-primary far fa-${item.checked ? 'check-' : ''}square fa-125x ml-3"></i>
                    <span id="itemName" class="ml-3 ${item.checked ? 'checked' : ''}"> ${item.name}</span>
                </div>
                <button data-id="${item.id}" class="itemRenameBtn btn btn-outline-primary ml-auto">Rename</button>
                <button data-id="${item.id}" class="itemDeleteBtn btn btn-outline-primary ml-1 mr-3">Delete</button>
            </div>
        `;
    }

    makeNewItem() {
        let newItem = {};
        newItem.name = this.element.querySelector('#itemName').value;
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
            this.emit('itemElement changed', { id: id, checked: false });
        } else {
            this.emit('itemElement changed', { id: id, checked: true });
        }
    }
    deleteItem(e){
        let id = e.currentTarget.dataset.id;
        let div = document.createElement('div');
        let html = `
            <div class="fullscreen d-flex justify-content-center align-items-center">
                <div class="text-center p-5 bg-white shadow border">
                    <p>Delete item ?</p>
                    <div class="mt-3">
                        <button id="cancelBtn" class="btn btn-outline-primary">Cancel</button>
                        <button id="confirmBtn" class="btn btn-outline-primary ml-3">Confirm</button>
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
            callback: () => this.emit('delete item', id)
        });

        this.element.appendChild(div);

    }

    renameItem(e) {
        let editBtn = e.currentTarget;
        editBtn.setAttribute('disabled', '');
        let id = e.currentTarget.dataset.id;
        let nameElement = e.currentTarget.parentElement.querySelector('#itemName')
        let name = nameElement.innerText;
        let input = document.createElement('div');
        input.innerHTML = `<input class="form-control ml-2" size="50"></input>`;
        input = input.firstChild;
        nameElement.parentElement.insertBefore(input, nameElement);
        input.value = name;
        input.focus();
        nameElement.classList.add('d-none');
        input.addEventListener('click', (e) => e.stopPropagation());
        input.addEventListener('focusout', () => {
            this.emit('item renamed', { id: id, name: input.value.trim() });
        });
    }

    getCheckedItems(data) {
        let checkedItems = 0;
        data.items.forEach(item => {
            if (item.checked) checkedItems++;
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
                    <p>Delete list "${this.listModel.data.name}" ?</p>
                    <div class="mt-3">
                        <button id="cancelBtn" class="btn btn-outline-primary">Cancel</button>
                        <button id="confirmBtn" class="btn btn-outline-primary ml-3">Confirm</button>
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
            callback: () => this.removeListElement()
        });

        this.element.appendChild(div);
    }

    removeListElement() {
        this.element.parentElement.removeChild(this.element);
        this.listener.removeAllListeners();
        this.emit('listElement removed')
    }

    confirmRename() {
        let div = document.createElement('div');
        let html = `
            <div class="fullscreen d-flex justify-content-center align-items-center">
                <div class="text-center p-5 bg-white shadow border">
                    <input id="listName" class="form-control text-center" type="text">
                    <div class="mt-3">
                        <button id="cancelBtn" class="btn btn-outline-primary">Cancel</button>
                        <button id="saveBtn" class="btn btn-outline-primary ml-3">Save</button>
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
        
        div.querySelector('#listName').value = this.listModel.data.name;
        div.querySelector('#listName').focus();
    }
}