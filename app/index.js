/*
 * The main entry point for the client-side app
 */
import { Affront } from 'affront';
import {
	DumbComponent,
	AtomComponent,
	MyViewComponent,
	MyTemplateViewComponent
} from '../lib';

// add the components of the app
Affront.Router.addComponent(new DumbComponent('/molecule'));

Affront.Router.addComponent(new AtomComponent('/atom'));
Affront.Router.addComponent(new AtomComponent('/atom/:elementSymbol'));

Affront.Router.addComponent(new MyViewComponent('/atom', document.getElementById('divMyView')));
Affront.Router.addComponent(new MyTemplateViewComponent('/', document.getElementById('divMyTemplateView')));

// now start the app!
Affront.start();