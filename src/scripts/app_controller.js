import { ListModel } from './list_model.js';
import { ListView } from './list_view.js';
import { ListController } from './list_controller.js';

export class AppController {
    constructor(appModel, appView) {
        appView.on('new list', (list) => {
            if (list.name) appModel.addList(list);
        });
        appView.on('appElement updated', () => {
            appModel.data.forEach(list => {
                let listModel = new ListModel(list);
                let listView = new ListView(listModel, list.id);
                let listController = new ListController(listModel, listView);

                listView.on('listElement removed', () => appModel.deleteList(list));
                listModel.on('data changed', () => appModel.save());
            });
        });
        appView.on('listElement created', (list) => {
                let listModel = new ListModel(list);
                let listView = new ListView(listModel, list.id);
                let listController = new ListController(listModel, listView);

                listView.on('listElement removed', () => appModel.deleteList(list));
                listModel.on('data changed', () => appModel.save());
            });
        
    }
}