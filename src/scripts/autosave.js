export class Autosave {
    constructor() {
        let timeout = null;
        this.save = function () {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                fetch(this.url, { method: 'PUT', body: JSON.stringify(this.data) })
                    .then((response) => {
                        if (response.status === 200) {
                            console.log('data saved');
                            timeout = null;
                        }
                    });
            }, 1000);

        }

    }
}