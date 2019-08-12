export class ListController {
    constructor(listModel, listView) {
        listView.on('newItem', (item) => {
            if (item.name) listModel.addItem(item);
        });
        listView.on('itemElement changed', (item) => {
            listModel.updateItem(item);
        });
        listView.on('listElement deleted', () => {
            listModel.deleteList();
        });
        listView.on('listElement renamed', (data) => {
            if(data.name) listModel.updateList(data);
        });
        listView.on('listElement changed', (data) => {
            listModel.updateList(data);
        });
        listView.on('sort items', () => {
            listModel.sortList();
        });        
        listView.on('delete item', (id) => {
            listModel.deleteItem(id);
        });
        listView.on('item renamed', (item) => {
            if(item.name) listModel.updateItem(item);
        });

    }
}