// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
	  // interface Error {}
	  // interface Locals {}
	  // interface PageData {}
	  // interface Platform {}
	}
  
	// Extend the Window interface to include elasticApm
	interface Window {
	  elasticApm: any; // Replace 'any' with a more specific type if you have one
	}
  }
  
  export {};
  