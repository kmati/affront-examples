import { Affront } from 'affront';
import styles from './styles.css';
import { AddressControl } from './controls/AddressControl';

// A template view component
export class ComplexTemplateViewComponent extends Affront.TemplateViewComponent {
	constructor(routeUrl, domElement) {
		const templates = {
			'placeholder': require('raw!./placeholder-template.html'),
			'view': require('raw!./view-template.html')
		};
		super(routeUrl, domElement, templates, styles);
		this.subscribe('person');

		// add the AddressControl instance to this component
		this.addControl(new AddressControl('c1'));
	}

	// This method is invoked so the component can set itself up to render content;
	// i.e. boiler plate content (static content) must be displayed
	// ctxt: an UrlContext instance
	urlChangedRender(ctxt) {
		this.updateDOM(this.renderTemplate('placeholder', {}));
	}

	// This method is invoked so the component can render the actual data (storeItem)
	// ctxt: a StoreItem instance
	notificationRender(storeItem) {
		if (storeItem.key === 'person') {
			this.updateDOM(this.renderTemplate('view', storeItem.value));
		}
		console.log('[ComplexTemplateViewComponent.notificationRender] invoked | storeItem = ',storeItem,' | routeUrl = ',this.routeUrl);
	}

	hide() {
		this.updateDOM('', this.domElement);
	}
};