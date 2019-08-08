export class AutosaveService {
    constructor(data, url) {
        this.data = data;
        this.url = url;
        this.timeout;
        this.dataIsChanged;

    }
    dataChanged() {
        this.dataIsChanged = true;
        if (!this.timeout) {
            this.dataIsChanged = false;
            this.timeout = setTimeout(() => {
                fetch(this.url, { method: 'PUT', body: JSON.stringify(this.data) })
                    .then((response) => {
                        if (response.status === 200) {
                            console.log('data saved');
                            this.timeout = null;
                            if (this.dataIsChanged) this.dataChanged();
                        }
                    });
            }, 2000);
        }
    }
}