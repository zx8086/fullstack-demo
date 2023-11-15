export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10')
];

export const server_loads = [0];

export const dictionary = {
		"/": [2],
		"/graphql-test-totals": [4],
		"/houdini-options": [5],
		"/modular-graphql": [6],
		"/passing-data-refactor": [7],
		"/some-example/movies": [~8],
		"/some-example/shop": [9],
		"/test": [10],
		"/[divisionCode]": [3]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';