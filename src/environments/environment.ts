// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
	isBrowser: true, // Add a flag
	recaptcha_key: '6LdVAeAqAAAAANRiCTIwsrPp7DwcP3jSOpzVk0wi',

	// live
	// baseUrl: 'https://www.neelgund.com:5015',
	// url: 'https://www.neelgund.com',

	frontendUrl: 'https://neelgund.pixtar.ae',

	// Staging
	// baseUrl: 'https://neelgund.pixtar.ae:5015',
	// url: 'https://neelgund.pixtar.ae',

	// Local
	baseUrl: 'http://localhost:5015',
	url: 'http://localhost:4215',



};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
