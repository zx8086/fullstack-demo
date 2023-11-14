/** @type {import('houdini').ConfigFile} */
const config = {
    "watchSchema": {
        "url": "http://localhost:8080/graphql"
    },
    "plugins": {
        'houdini-plugin-svelte-global-stores': {
            prefix: 'GQL_',
            generate: ['query', 'mutation', 'subscription', 'fragment']
          },
        "houdini-svelte": {}
    }
}

export default config
