import { r as y, g as T } from "./main-NLxo9BaS.js";
import { r as b } from "./token-util-eQlE55tu.js";
function w(o, l) {
  for (var c = 0; c < l.length; c++) {
    const n = l[c];
    if (typeof n != "string" && !Array.isArray(n)) {
      for (const a in n)
        if (a !== "default" && !(a in o)) {
          const s = Object.getOwnPropertyDescriptor(n, a);
          s && Object.defineProperty(o, a, s.get ? s : {
            enumerable: !0,
            get: () => n[a]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(o, Symbol.toStringTag, { value: "Module" }));
}
var k, d;
function P() {
  if (d) return k;
  d = 1;
  var o = Object.defineProperty, l = Object.getOwnPropertyDescriptor, c = Object.getOwnPropertyNames, n = Object.prototype.hasOwnProperty, a = (e, r) => {
    for (var t in r)
      o(e, t, { get: r[t], enumerable: !0 });
  }, s = (e, r, t, f) => {
    if (r && typeof r == "object" || typeof r == "function")
      for (let p of c(r))
        !n.call(e, p) && p !== t && o(e, p, { get: () => r[p], enumerable: !(f = l(r, p)) || f.enumerable });
    return e;
  }, g = (e) => s(o({}, "__esModule", { value: !0 }), e), _ = {};
  a(_, {
    refreshToken: () => v
  }), k = g(_);
  var u = y(), i = b();
  async function v() {
    const { projectId: e, teamId: r } = (0, i.findProjectInfo)();
    let t = (0, i.loadToken)(e);
    if (!t || (0, i.isExpired)((0, i.getTokenPayload)(t.token))) {
      const f = (0, i.getVercelCliToken)();
      if (!f)
        throw new u.VercelOidcTokenError(
          "Failed to refresh OIDC token: login to vercel cli"
        );
      if (!e)
        throw new u.VercelOidcTokenError(
          "Failed to refresh OIDC token: project id not found"
        );
      if (t = await (0, i.getVercelOidcToken)(f, e, r), !t)
        throw new u.VercelOidcTokenError("Failed to refresh OIDC token");
      (0, i.saveToken)(t, e);
    }
    process.env.VERCEL_OIDC_TOKEN = t.token;
  }
  return k;
}
var O = P();
const h = /* @__PURE__ */ T(O), E = /* @__PURE__ */ w({
  __proto__: null,
  default: h
}, [O]);
export {
  E as t
};
