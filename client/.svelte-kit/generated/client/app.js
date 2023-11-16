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
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12')
];

export const server_loads = [0];

export const dictionary = {
		"/": [2],
		"/graphql-test-totals": [6],
		"/houdini-options": [7],
		"/modular-graphql": [8],
		"/passing-data-refactor": [9],
		"/some-example/movies": [~10],
		"/some-example/shop": [11],
		"/test": [12],
		"/[divisionCode]": [3],
		"/[divisionCode]/looks": [4],
		"/[divisionCode]/styles": [5]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';