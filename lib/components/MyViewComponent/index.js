import { Affront } from 'affront';
require('./styles.css');

// A visual component
export class MyViewComponent extends Affront.ViewComponent {
	constructor(routeUrl, domElement) {
		super(routeUrl, domElement);
		this.subscribe('name');
	}

	templateStr(data) {
		return `<div class="segment">This is my stuff | name = ${data.name}</div>`;
	}

	// This method is invoked so the component can set itself up to render content;
	// i.e. boiler plate content (static content) must be displayed
	// ctxt: an UrlContext instance
	urlChangedRender(ctxt) {
		this.updateDOM(this.templateStr({}), this.domElement);
	}

	// This method is invoked so the component can render the actual data (storeItem)
	// ctxt: a StoreItem instance
	notificationRender(storeItem) {
		if (storeItem.key === 'name') {
			this.updateDOM(this.templateStr({ name: storeItem.value }), this.domElement);
		}
		console.log('[MyViewComponent.notificationRender] invoked | storeItem = ',storeItem,' | routeUrl = ',this.routeUrl);
	}

	hide() {
		this.updateDOM('', this.domElement);
	}
};