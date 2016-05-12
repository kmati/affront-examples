import { Affront } from 'affront';
import styles from './styles.css';

// A template view component
export class MyTemplateViewComponent extends Affront.TemplateViewComponent {
	constructor(routeUrl, domElement) {
		const templates = {
			'placeholder': require('raw!./placeholder-template.html'),
			'view': require('raw!./view-template.html')
		};
		super(routeUrl, domElement, templates, styles);
		this.subscribe('name');
	}

	// This method is invoked so the component can set itself up to render content;
	// i.e. boiler plate content (static content) must be displayed
	// ctxt: an UrlContext instance
	urlChangedRender(ctxt) {
		this.updateDOM(this.renderTemplate('placeholder', {}), this.domElement);
	}

	// This method is invoked so the component can render the actual data (storeItem)
	// ctxt: a StoreItem instance
	notificationRender(storeItem) {
		if (storeItem.key === 'name') {
			this.updateDOM(this.renderTemplate('view', { name: storeItem.value }), this.domElement);
		}
		console.log('[MyTemplateViewComponent.notificationRender] invoked | storeItem = ',storeItem,' | routeUrl = ',this.routeUrl);
	}

	hide() {
		this.updateDOM('', this.domElement);
	}
};