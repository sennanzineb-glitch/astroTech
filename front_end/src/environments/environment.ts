// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // Use relative URLs so they work with port forwarding
  // Services append their resource paths, so only provide base URL
  apiURL: "/api/v1",

  url_client: "/api/v1",
  url_fichier: "/api/v1",
  url_referent: "/api/v1",
  url_technicien: "/api/v1",
  url_affaire: "/api/v1",
  url_upload: "/uploads"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
