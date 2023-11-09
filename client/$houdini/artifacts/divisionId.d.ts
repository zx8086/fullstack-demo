export type divisionId = {
    readonly "input": divisionId$input;
    readonly "result": divisionId$result | undefined;
};

export type divisionId$result = {
    readonly options: ({
        readonly id: string | null;
        readonly description: string | null;
        readonly documentType: string | null;
        readonly isUpdated: boolean | null;
        readonly isNew: boolean | null;
        readonly isSoldOut: boolean | null;
        readonly isAvailable: boolean | null;
    } | null)[] | null;
};

export type divisionId$input = null;

export type divisionId$artifact = {
    "name": "divisionId";
    "kind": "HoudiniQuery";
    "hash": "5081fbf613af34d0d143207f853c114afb3de46c791f5f1c0e59f02d46194815";
    "raw": `query divisionId {
  options {
    id
    description
    documentType
    isUpdated
    isNew
    isSoldOut
    isAvailable
  }
}
`;
    "rootType": "Query";
    "selection": {
        "fields": {
            "options": {
                "type": "Option";
                "keyRaw": "options";
                "nullable": true;
                "selection": {
                    "fields": {
                        "id": {
                            "type": "String";
                            "keyRaw": "id";
                            "visible": true;
                            "nullable": true;
                        };
                        "description": {
                            "type": "String";
                            "keyRaw": "description";
                            "nullable": true;
                            "visible": true;
                        };
                        "documentType": {
                            "type": "String";
                            "keyRaw": "documentType";
                            "nullable": true;
                            "visible": true;
                        };
                        "isUpdated": {
                            "type": "Boolean";
                            "keyRaw": "isUpdated";
                            "nullable": true;
                            "visible": true;
                        };
                        "isNew": {
                            "type": "Boolean";
                            "keyRaw": "isNew";
                            "nullable": true;
                            "visible": true;
                        };
                        "isSoldOut": {
                            "type": "Boolean";
                            "keyRaw": "isSoldOut";
                            "nullable": true;
                            "visible": true;
                        };
                        "isAvailable": {
                            "type": "Boolean";
                            "keyRaw": "isAvailable";
                            "nullable": true;
                            "visible": true;
                        };
                    };
                };
                "visible": true;
            };
        };
    };
    "pluginData": {
        "houdini-svelte": {};
    };
    "policy": "CacheOrNetwork";
    "partial": false;
};