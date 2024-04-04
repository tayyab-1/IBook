// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiURL: "http://127.0.0.1:8000",
  appURL: "http://localhost:4200",
  rapidApiKey: 'd5d371c906msh0f892d2bd30aae8p119287jsncc17d9c27817',
  rapidApiHost: 'wordsapiv1.p.rapidapi.com',

  pusher: {
    key: 'd9b2e6699e057ec5025d',
    clustor: 'ap2',
  },

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
