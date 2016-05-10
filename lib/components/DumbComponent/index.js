import { Affront } from 'affront';

export class DumbComponent extends Affront.NonVisualComponent {
	constructor(routeUrl) {
		super(routeUrl);
	}

	// This method is invoked so the component can set itself up to render content;
	// i.e. boiler plate content (static content) must be displayed
	// ctxt: an UrlContext instance
	urlChangedRender(ctxt) {
		console.log('[DumbComponent.urlChangedRender] invoked | ctxt = ',ctxt,' | routeUrl = ',this.routeUrl);
	}

	// This method is invoked so the component can render the actual data (storeItem)
	// ctxt: a StoreItem instance
	notificationRender(storeItem) {
		console.log('[DumbComponent.notificationRender] invoked | storeItem = ',storeItem,' | routeUrl = ',this.routeUrl);
	}

	hide() {
		console.log('[DumbComponent.hide] invoked | routeUrl = ',this.routeUrl);
	}
};