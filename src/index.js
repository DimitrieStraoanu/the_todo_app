import { AppModel } from './scripts/app_model.js';
import { AppView } from './scripts/app_view.js';
import {AppController} from './scripts/app_controller.js';

let appModel = new AppModel();
let appView = new AppView(appModel,'app')
let appController = new AppController(appModel, appView);