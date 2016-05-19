/*
 * The main entry point for the client-side app
 */
import { Affront } from 'affront';
import {
	DumbComponent,
	AtomComponent,
	MyViewComponent,
	MyTemplateViewComponent,
	ComplexTemplateViewComponent
} from '../lib';

// add the components of the app
Affront.Router.addComponent(new DumbComponent('/molecule'));

Affront.Router.addComponent(new AtomComponent('/atom'));
Affront.Router.addComponent(new AtomComponent('/atom/:elementSymbol'));

Affront.Router.addComponent(new MyViewComponent('/atom', document.getElementById('divMyView')));
Affront.Router.addComponent(new MyTemplateViewComponent('/', document.getElementById('divMyTemplateView')));
Affront.Router.addComponent(new ComplexTemplateViewComponent('/', document.getElementById('divComplexTemplateView')));

// now start the app!
Affront.start();

// set the person state (which will trigger the rendering of the ComplexTemplateViewComponent)
Affront.Store.setItem('person', {
	name: 'Horace Sibbs',
	street1: '18 Fig Leaf Road',
	street2: 'Apt. 3',
	city: 'Boston',
	state: 'Massachusetts',
	zip: '02115',
	country: 'USA'
});