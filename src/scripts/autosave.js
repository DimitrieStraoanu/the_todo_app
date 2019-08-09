export class Autosave {
    constructor() {
        let timeout = null;
        let dataChanged = false;
        this.save = function(){
            dataChanged = true;
            if (!timeout) {
                timeout = setTimeout(() => {
                    dataChanged = false;
                    fetch(this.url, { method: 'PUT', body: JSON.stringify(this.data) })
                        .then((response) => {
                            if (response.status === 200) {
                                console.log('data saved');
                                timeout = null;
                                if (dataChanged) this.save();
                            }
                        });
                }, 3000);
            }
        }

    }
}