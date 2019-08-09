export class IDGenerator {
    constructor() {
        let size = 20;
        let baseString = '23456789abdegjkmnpqrvwxyzABDEGJKMNPQRVWXYZ';
        let attempts = 0;
        this.newID = function () {
            let id = '';
            let existingIDs = this.getIDs();
            for (var i = 0; i < size; i++) {
                id += baseString.charAt(Math.floor(Math.random() * baseString.length));
            }
            if (existingIDs.includes(id) && attempts < 1000 || Number(id[0])) {
                attempts++;
                return this.newID();
            }
            else {
                attempts = 0;
                existingIDs.push(id);
                return id;
            }
        }
    }
}