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

Affront.Router.addComponent(new DumbComponent('/molecule'));

Affront.Router.addComponent(new AtomComponent('/atom'));
Affront.Router.addComponent(new AtomComponent('/atom/:elementSymbol'));

Affront.Router.addComponent(new MyViewComponent('/atom', document.getElementById('divMyView')));
Affront.Router.addComponent(new MyTemplateViewComponent('/atom', document.getElementById('divMyTemplateView')));