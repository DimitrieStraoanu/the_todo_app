export class Listener {
    constructor() {
        this.listeners = [];
    }
    addListener = (listener) => {
        listener.element.addEventListener(listener.event, listener.callback);
        this.listeners.push(listener);
    }
    removeAllListeners = () => {
        this.listeners.forEach(listener => {
            listener.element.removeEventListener(listener.event, listener.callback);
        });
    }
}