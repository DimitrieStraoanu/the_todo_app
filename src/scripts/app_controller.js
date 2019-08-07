import { ListModel } from './list_model.js';
import { ListView } from './list_view.js';
import { ListController } from './list_controller.js';

export class AppController {
    constructor(appModel, appView) {
        appModel.getLists();
        appView.on('new list', (list) => {
            if (list.name) appModel.addList(list);
        });
        appView.on('appElement updated', () => {
            appModel.data.forEach(list => {
                let id = list[0];
                let listModel = new ListModel(list);
                let listView = new ListView(listModel, '#' + id);
                let listController = new ListController(listModel, listView);
            });
        });
        appView.on('listElement created', (list) => {
            let id = list[0];
            let listModel = new ListModel(list);
            let listView = new ListView(listModel, '#' + id);
            let listController = new ListController(listModel, listView);
        });
    }
}