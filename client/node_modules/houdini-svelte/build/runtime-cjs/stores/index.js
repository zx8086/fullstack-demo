"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var stores_exports = {};
__export(stores_exports, {
  FragmentStore: () => import_fragment.FragmentStore,
  MutationStore: () => import_mutation.MutationStore,
  QueryStore: () => import_query.QueryStore,
  SubscriptionStore: () => import_subscription.SubscriptionStore
});
module.exports = __toCommonJS(stores_exports);
__reExport(stores_exports, require("./pagination"), module.exports);
var import_fragment = require("./fragment");
var import_subscription = require("./subscription");
var import_mutation = require("./mutation");
var import_query = require("./query");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FragmentStore,
  MutationStore,
  QueryStore,
  SubscriptionStore
});
