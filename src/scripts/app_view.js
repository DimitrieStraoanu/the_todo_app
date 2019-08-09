import { EventEmitter } from './event_emitter.js';

export class AppView extends EventEmitter {
    constructor(appModel, appElementID) {
        super();
        this.element = document.querySelector(appElementID);

        appModel.on('ready', (data) => this.updateAppElement(data));
        appModel.on('data changed', (data) => this.updateAppElement(data));
    }
    updateAppElement(data) {
        this.element.innerHTML = this.generateAppHtml(data);
        this.element.querySelector('#saveBtn').addEventListener('click', () => this.makeNewList());
        this.emit('appElement updated');
    }
    generateAppHtml(data) {
        return `
            <div class="col-12 col-md-9 col-lg-6 d-flex flex-column p-3 mx-auto">
                <div class="d-flex flex-column bg-light text-secondary border-top border-bottom p-3">
                    <h4 class="m-0 mx-auto">TheToDoApp</h4>
                    <div class="d-flex mt-3">
                        <div class="flex-grow-1">
                            <input id="name" class="form-control" type="text" placeholder="Add new list">
                        </div>
                        <button id="saveBtn" class="btn btn-primary ml-1">+NewToDoList</button>
                    </div>
                </div>
                <div id="lists">
                ${data.map(list => `<div id="${list.id}"></div>`).join('')}
                </div>
            </div>
        `;
    }
    createListElement(list) {
        let div = document.createElement('div');
        div.id = list.id;
        this.element.querySelector('#lists').appendChild(div);
        this.emit('listElement created', list);
    }
    toggleInputFields() {
        this.element.querySelector('#input').classList.toggle('d-none');
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