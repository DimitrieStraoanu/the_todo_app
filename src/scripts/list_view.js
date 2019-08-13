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
        this.element.innerHTML = this.listTemplate(data);

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

    listTemplate(data) {
        return `
            <div id="listBtn" class="d-flex align-items-center pointer  rounded-more border position-relative text-secondary bg-light p-3">
                <div class="d-flex align-items-center text-${data.color}">
                    <i class="fas fa-plus ${data.opened ? 'd-none' : ''}"></i>
                    <i class="fas fa-chevron-up ${data.opened ? '' : 'd-none'}"></i>
                    <span class="h5 m-0 ml-2">${data.name}</span>
                </div>
                ${this.statisticsTemplate(data)}
            </div>
            <div class="animate-expand ${data.opened ? '' : 'height-0'}">
                <div class="wraper mt-2">
                    <div class="border bg-light rounded-more">
                        <div id="listOptions">
                            <div class="d-flex border-bottom p-3">
                                <button id="renameBtn" class="btn btn-${data.color} btn-sm flex-grow-1 text-white text-nowrap">Rename list</button>
                                <button id="deleteBtn" class="btn btn-${data.color} btn-sm flex-grow-1 text-white text-nowrap ml-2">Delete list</button>
                                <button id="sortBtn" class="btn btn-${data.color} btn-sm flex-grow-1 text-white text-nowrap ml-2" ${data.items.length ? '' : 'disabled'}>Sort checked</button>
                            </div>
                            <div class="mx-3 mb-4 mt-2">
                                <p class="text-center text-secondary mb-1">Input a todo name</p>
                                <input id="itemName" class="form-control mb-2" type="text">
                                <button id="newItemBtn" class="btn btn-${data.color} btn-block text-white text-nowrap">Save ToDo</button>
                            </div>
                        </div>
                        <div id="listItems" class="text-${data.color}">
                            ${data.items.map(item => this.itemTemplate(item, data.color)).join('')}
                        </div>
                    </div>
                    <div class="bg-${data.color} mt-2 p-2 rounded-more"></div>
                </div>
            </div>
        `;
    }

    statisticsTemplate(data) {
        if (data.items.length > 0) return `
            <span class="ml-auto">${data.items.length} | ${this.getCheckedItems(data)}</span>
            <span class="ml-3">${this.getStatus(data)}</span>
        `;
        else return `
            <span class="ml-auto">Empty list</span>
        `;
    }

    itemTemplate(item, color) {
        return `
            <div class="d-flex align-items-center border-top py-3">
                <div class="itemBtn d-flex align-items-center pointer" data-id="${item.id}" data-checked = "${item.checked}">
                    <i class="fas fa-check-square fa-125x ml-3 ${item.checked ? '' : 'd-none'}"></i>
                    <i class="far fa-square fa-125x ml-3 ${item.checked ? 'd-none' : ''}"></i>
                    <span id="itemName" class="ml-3 ${item.checked ? 'checked' : ''} font-weight-bold"> ${item.name}</span>
                </div>
                <button data-id="${item.id}" class="itemRenameBtn btn btn-${color} btn-sm text-white ml-auto">Rename</button>
                <button data-id="${item.id}" class="itemDeleteBtn btn btn-${color} btn-sm text-white ml-1 mr-3">Delete</button>
            </div>
        `;
    }

    makeNewItem() {
        let newItem = {};
        newItem.name = this.element.querySelector('#itemName').value;
        this.emit('newItem', newItem);
    }

    toggleList() {
        let id = this.element.id;
        let opened = this.listModel.data.opened;

        let toggleBtn = this.element.querySelector('#listBtn');
        toggleBtn.querySelectorAll('i').forEach(i => i.classList.toggle('d-none'));

        let wraper = this.element.querySelector('.wraper');
        let height = parseInt(getComputedStyle(wraper).height);
        let marginTop = parseInt(getComputedStyle(wraper).marginTop);
        let marginBottom = parseInt(getComputedStyle(wraper).marginBottom);


        if (opened) {
            wraper.parentElement.style.height = height + marginTop + marginBottom + 'px';
            setTimeout(()=>{
                wraper.parentElement.style.height = '0';
                this.emit('listElement toggled', { id: id, opened: false });
            },0)
        } else {
            wraper.parentElement.style.height = height + marginTop + marginBottom + 'px';
            this.emit('listElement toggled', { id: id, opened: true });
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
    deleteItem(e) {
        let id = e.currentTarget.dataset.id;
        let div = document.createElement('div');
        let html = `
            <div class="fullscreen d-flex justify-content-center align-items-center">
                <div class="text-center p-5 bg-white shadow border rounded-more">
                    <p class="text-secondary">Delete item ?</p>
                    <div class="mt-3">
                        <button id="cancelBtn" class="btn btn-primary">Cancel</button>
                        <button id="confirmBtn" class="btn btn-primary ml-2">Confirm</button>
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
        if (this.editMode) {
            let id = e.currentTarget.dataset.id;
            let name = this.element.querySelector('#newName').value.trim()
            this.emit('item renamed', { id: id, name: name });
            this.editMode = false;
        } else {
            this.editMode = true;
            let editBtn = e.currentTarget;
            editBtn.innerHTML = 'Save';
            let nameElement = e.currentTarget.parentElement.querySelector('#itemName')
            let name = nameElement.innerText;
            let input = document.createElement('div');
            input.innerHTML = `<input id="newName"class="ml-2 bg-transparent border-0 w-100"></input>`;
            input = input.firstChild;
            nameElement.parentElement.insertBefore(input, nameElement);
            input.value = name;
            input.focus();
            nameElement.classList.add('d-none');
            input.addEventListener('click', (e) => e.stopPropagation());
            input.addEventListener('blur', (e) => {
                if (e.relatedTarget && e.relatedTarget.innerHTML === 'Save') return;
                this.emit('canceled');
                this.editMode = false;
            });
        }
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
                <div class="text-center p-5 bg-white shadow border rounded-more">
                    <p class="text-secondary">Delete list "<b>${this.listModel.data.name}</b>" ?</p>
                    <div class="mt-3">
                        <button id="cancelBtn" class="btn btn-primary">Cancel</button>
                        <button id="confirmBtn" class="btn btn-primary ml-2">Confirm</button>
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
                <div class="text-center p-5 bg-white shadow border rounded-more">
                    <input id="listName" class="form-control text-center" type="text">
                    <div class="mt-3">
                        <button id="cancelBtn" class="btn btn-primary">Cancel</button>
                        <button id="saveBtn" class="btn btn-primary ml-2">Save</button>
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