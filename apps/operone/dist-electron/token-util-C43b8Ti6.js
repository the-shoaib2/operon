import { g as f } from "./main-NLxo9BaS.js";
import { r as s } from "./token-util-eQlE55tu.js";
function l(r, i) {
  for (var o = 0; o < i.length; o++) {
    const e = i[o];
    if (typeof e != "string" && !Array.isArray(e)) {
      for (const t in e)
        if (t !== "default" && !(t in r)) {
          const n = Object.getOwnPropertyDescriptor(e, t);
          n && Object.defineProperty(r, t, n.get ? n : {
            enumerable: !0,
            get: () => e[t]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(r, Symbol.toStringTag, { value: "Module" }));
}
var a = s();
const c = /* @__PURE__ */ f(a), g = /* @__PURE__ */ l({
  __proto__: null,
  default: c
}, [a]);
export {
  g as t
};
