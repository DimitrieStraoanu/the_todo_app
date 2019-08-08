export class Generator {
    constructor(existingIDs = []) {
        let size = 20;
        let baseString = '23456789abdegjkmnpqrvwxyzABDEGJKMNPQRVWXYZ';
        let attempt = 0;
        function generate() {
            let newID = '';
            for (var i = 0; i < size; i++) {
                newID += baseString.charAt(Math.floor(Math.random() * baseString.length));
            }
            if (existingIDs.includes(newID) && attempt < 1000) {
                attempt++;
                return generate();
            }
            else {
                attempt = 0;
                existingIDs.push(newID);
                return newID;
            }
        }
        Object.defineProperty(this, 'newID', {
            get() {
                return generate();
            }
        })
    }
}