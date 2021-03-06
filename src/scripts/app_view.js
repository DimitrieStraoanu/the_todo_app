import { EventEmitter } from './event_emitter.js';

export class AppView extends EventEmitter {
    constructor(appModel, appElementID) {
        super();
        this.element = document.querySelector('#' + appElementID);
        this.opened = true;

        appModel.on('ready', (data) => this.updateAppElement(data));
        appModel.on('data changed', (data) => this.updateAppElement(data));
        appModel.on('status updated', (data) => this.updateStatusElement(data));
        appModel.on('data changed new list', (list) => {
            this.clearInput();
            this.createListElement(list);
        });
    }
    updateAppElement(data) {
        this.element.innerHTML = this.appTemplate(data);
        this.element.querySelector('#saveBtn').addEventListener('click', () => this.makeNewList());
        this.element.querySelector('#toggleInputBtn').addEventListener('click', () => this.toggleInputFields());
        this.element.querySelectorAll('.colorBtn').forEach(colorBtn => colorBtn.addEventListener('click', (e) => this.setColor(e)));
        this.emit('appElement updated');
    }
    createListElement(list) {
        let div = document.createElement('div');
        div.id = list.id;
        div.classList.add('mt-2');
        this.element.querySelector('#lists').insertBefore(div, this.element.querySelector('#lists').firstElementChild);
        this.emit('listElement created', list);
    }
    toggleInputFields() {
        let toggleBtn = this.element.querySelector('#toggleInputBtn');
        toggleBtn.querySelectorAll('i').forEach(i => i.classList.toggle('d-none'));

        let listInput = this.element.querySelector('#listInput');
        let height = parseInt(getComputedStyle(listInput).height);
        let marginTop = parseInt(getComputedStyle(listInput).marginTop);
        let marginBottom = parseInt(getComputedStyle(listInput).marginBottom);

        if (this.opened) {
            this.opened = false;
            listInput.parentElement.style.height = height + marginTop + marginBottom + 'px';
            setTimeout(() => listInput.parentElement.style.height = '0px', 0);
        } else {
            listInput.parentElement.style.height = height + marginTop + marginBottom + 'px';
            this.opened = true;
        }

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
                    <i class="fas fa-plus d-none"></i>
                    <i class="fas fa-chevron-up"></i>
                    <span class="h5 ml-2">Add New ToDoList</span>
                </div>
                <div class="animate-expand overflow-hidden">
                    <div id="listInput" class="bg-light border rounded-more mt-2 p-3">
                        <p class="text-center text-secondary m-0 mb-1">Input a list name</p>
                        <input id="listName" class="form-control mb-3" type="text" autocomplete="off">
                        <p class="text-center text-secondary m-0 mb-1">Pick a color</p>
                        <div id="colorPicker" class="d-flex align-items-center w-75 mx-auto mb-4">
                            <div data-color="primary" class="colorBtn flex-grow-1 bg-primary marker-lg rounded-lg pointer selected"></div>
                            <div data-color="success" class="colorBtn flex-grow-1 bg-success marker-lg rounded-lg pointer ml-3"></div>
                            <div data-color="warning" class="colorBtn flex-grow-1 bg-warning marker-lg rounded-lg pointer ml-3"></div>
                            <div data-color="danger" class="colorBtn flex-grow-1 bg-danger marker-lg rounded-lg pointer ml-3"></div>
                        </div>
                        <button id="saveBtn" class="btn btn-primary btn-block text-nowrap">Save ToDoList</button>
                    </div>
                </div>
                <div id="lists">
                ${data.map(list => `<div id="${list.id}" class="mt-2"></div>`).join('')}
                </div>
                <div id="status" class="bg-primary rounded-more border text-white text-center p-2 mt-2">
                    ${this.statusTemplate(data)}
                </div>
            </div>
        `;
    }

    statusTemplate(data) {
        return `
            <div>${this.getStatus(data)[1]} completed | ${this.getStatus(data)[2]} in progress | ${this.getStatus(data)[3]} empty</div>
        `;
    }

    getStatus(data) {
        let total = data.length;
        let completed = data.reduce((acc, list) => {
            if (list.status === 'Completed') return acc + 1;
            else return acc;
        }, 0);
        let inProgress = data.reduce((acc, list) => {
            if (list.status === 'In progress') return acc + 1;
            else return acc;
        }, 0);
        let empty = data.reduce((acc, list) => {
            if (list.status === 'Empty') return acc + 1;
            else return acc;
        }, 0);
        return [total, completed, inProgress, empty];
    }

    updateStatusElement(data) {
        let statusElement = this.element.querySelector('#status');
        statusElement.innerHTML = this.statusTemplate(data);
    }

}