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
        this.element.innerHTML = this.appTemplate(data);
        this.element.querySelector('#saveBtn').addEventListener('click', () => this.makeNewList());
        this.element.querySelector('#toggleInputBtn').addEventListener('click', () => this.toggleInputFields());
        this.element.querySelectorAll('.colorBtn').forEach(colorBtn=> colorBtn.addEventListener('click', (e) => this.setColor(e)));
        this.emit('appElement updated');
    }
    createListElement(list) {
        let div = document.createElement('div');
        div.id = list.id;
        div.classList.add('mt-2');
        this.element.querySelector('#lists').appendChild(div);
        this.emit('listElement created', list);
    }
    toggleInputFields() {
        let toggleBtn = this.element.querySelector('#toggleInputBtn')
        this.element.querySelector('#listInput').classList.toggle('d-none');
        toggleBtn.querySelectorAll('i').forEach(i => i.classList.toggle('d-none'));
        this.element.querySelector('#listName').focus();
    }
    clearInput() {
        this.element.querySelector('#listName').value = '';
    }

    setColor(e) {
        this.element.querySelectorAll('.colorBtn').forEach(colorBtn => colorBtn.classList.remove('selected'));
        e.currentTarget.classList.add('selected');
        this.color = e.currentTarget.dataset.color
    }
    makeNewList() {
        let list = {};
        list.name = this.element.querySelector('#listName').value;
        list.color = this.color || 'primary';
        this.emit('new list', list);
    }
    appTemplate(data) {
        return `
            <div class="col-12 col-md-9 col-lg-6 d-flex flex-column p-2 mx-auto">
                <div id="toggleInputBtn" class="bg-primary border rounded-more pointer text-white text-center p-3">
                    <i class="fas fa-plus"></i>
                    <i class="fas fa-chevron-up d-none"></i>
                    <span class="h5 ml-2">Add New ToDoList</span>
                </div>
                <div id="listInput" class="bg-light border rounded-more p-3 mt-2">
                    <p class="text-center text-secondary m-0 mb-1">Input list name</p>
                    <input id="listName" class="form-control mb-3" type="text" autocomplete="off">
                    <p class="text-center text-secondary m-0 mb-1">Pick a color</p>
                    <div id="colorPicker" class="d-flex align-items-center w-75 mx-auto mb-4">
                        <div data-color="primary" class="colorBtn flex-grow-1 bg-primary marker-lg rounded-lg pointer selected"></div>
                        <div data-color="success" class="colorBtn flex-grow-1 bg-success marker-lg rounded-lg pointer ml-2"></div>
                        <div data-color="warning" class="colorBtn flex-grow-1 bg-warning marker-lg rounded-lg pointer ml-2"></div>
                        <div data-color="danger" class="colorBtn flex-grow-1 bg-danger marker-lg rounded-lg pointer ml-2"></div>
                    </div>
                    <button id="saveBtn" class="btn btn-primary btn-block text-nowrap">Save ToDoList</button>

                </div>
                <div id="lists">
                ${data.map(list => `<div id="${list.id}" class="mt-2"></div>`).join('')}
                </div>
            </div>
        `;
    }
}