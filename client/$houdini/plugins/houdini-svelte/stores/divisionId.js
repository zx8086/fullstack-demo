import { QueryStore } from '../runtime/stores/query'
import artifact from '$houdini/artifacts/divisionId'
import { initClient } from '$houdini/plugins/houdini-svelte/runtime/client'

export class divisionIdStore extends QueryStore {
	constructor() {
		super({
			artifact,
			storeName: "divisionIdStore",
			variables: false,
		})
	}
}

export async function load_divisionId(params) {
	await initClient()

	const store = new divisionIdStore()

	await store.fetch(params)

	return {
		divisionId: store,
	}
}
