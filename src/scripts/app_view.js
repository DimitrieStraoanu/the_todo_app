import { EventEmitter } from './event_emitter.js';

export class AppView extends EventEmitter {
    constructor(appModel, appElementID) {
        super();
        this.element = document.querySelector('#' + appElementID);

        appModel.on('ready', (data) => this.updateAppElement(data));
        appModel.on('data changed', (data) => this.updateAppElement(data));
        appModel.on('data changed new list', (list) => {
            this.clearInput();
            this.createListElement(list);
        });
    }
    updateAppElement(data) {
        this.element.innerHTML = this.generateAppHtml(data);
        this.element.querySelector('#saveBtn').addEventListener('click', () => this.makeNewList());
        this.element.querySelector('#toggleInputBtn').addEventListener('click', () => this.toggleInputFields());
        this.emit('appElement updated');
    }
    generateAppHtml(data) {
        console.log(data);
        return `
            <div class="col-12 col-md-9 col-lg-6 d-flex flex-column p-0 mx-auto">
                <div id="toggleInputBtn" class="bg-primary pointer text-white text-center p-3">
                    <i class="fas fa-plus"></i>
                    <i class="fas fa-chevron-up d-none"></i>
                    <span class="h5 ml-2">Add New ToDoList</span>
                </div>
                <div id="input" class="d-none">
                    <div class="d-flex bg-light text-secondary border-bottom py-5 px-3">
                        <div class="flex-grow-1">
                            <input id="name" class="form-control" type="text" autocomplete="off">
                        </div>
                        <button id="saveBtn" class="btn btn-primary ml-1">Save list</button>
                    </div>
                </div>
                <div id="lists">
                ${data.map(list => `<div id="${list.id}" class="mt-2"></div>`).join('')}
                </div>
            </div>
        `;
    }
    createListElement(list) {
        let div = document.createElement('div');
        div.id = list.id;
        div.classList.add('mt-2');
        this.element.querySelector('#lists').appendChild(div);
        this.emit('listElement created', list);
    }
    toggleInputFields() {
        this.element.querySelector('#input').classList.toggle('d-none');
        this.element.querySelectorAll('i').forEach(i => i.classList.toggle('d-none'));
        this.element.querySelector('#name').focus();
    }
    clearInput() {
        this.element.querySelector('#name').value = '';
    }
    makeNewList() {
        let list = {};
        list.name = this.element.querySelector('#name').value;
        this.emit('new list', list);
    }
}