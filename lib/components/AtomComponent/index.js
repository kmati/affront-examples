import { Affront } from 'affront';

// create the components that go with the different routes
export class AtomComponent extends Affront.NonVisualComponent {
	constructor(routeUrl) {
		super(routeUrl);
	}

	// This method is invoked so the component can set itself up to render content;
	// i.e. boiler plate content (static content) must be displayed
	// ctxt: an UrlContext instance
	urlChangedRender(ctxt) {
		console.log('[AtomComponent.urlChangedRender] invoked | ctxt = ',ctxt,' | routeUrl = ',this.routeUrl);
	}

	// This method is invoked so the component can render the actual data (storeItem)
	// ctxt: a StoreItem instance
	notificationRender(storeItem) {
		console.log('[AtomComponent.notificationRender] invoked | storeItem = ',storeItem,' | routeUrl = ',this.routeUrl);
	}

	hide() {
		console.log('[AtomComponent.hide] invoked | routeUrl = ',this.routeUrl);
	}
};