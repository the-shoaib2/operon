import I from "path";
import A from "fs";
import { r as U } from "./main-NLxo9BaS.js";
import M from "os";
var m, V;
function F() {
  if (V) return m;
  V = 1;
  var h = Object.create, p = Object.defineProperty, w = Object.getOwnPropertyDescriptor, j = Object.getOwnPropertyNames, g = Object.getPrototypeOf, T = Object.prototype.hasOwnProperty, P = (o, n) => {
    for (var u in n)
      p(o, u, { get: n[u], enumerable: !0 });
  }, v = (o, n, u, y) => {
    if (n && typeof n == "object" || typeof n == "function")
      for (let f of j(n))
        !T.call(o, f) && f !== u && p(o, f, { get: () => n[f], enumerable: !(y = w(n, f)) || y.enumerable });
    return o;
  }, _ = (o, n, u) => (u = o != null ? h(g(o)) : {}, v(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    !o || !o.__esModule ? p(u, "default", { value: o, enumerable: !0 }) : u,
    o
  )), D = (o) => v(p({}, "__esModule", { value: !0 }), o), k = {};
  P(k, {
    findRootDir: () => O,
    getUserDataDir: () => b
  }), m = D(k);
  var c = _(I), s = _(A), a = _(M), d = U();
  function O() {
    try {
      let o = process.cwd();
      for (; o !== c.default.dirname(o); ) {
        const n = c.default.join(o, ".vercel");
        if (s.default.existsSync(n))
          return o;
        o = c.default.dirname(o);
      }
    } catch {
      throw new d.VercelOidcTokenError(
        "Token refresh only supported in node server environments"
      );
    }
    throw new d.VercelOidcTokenError("Unable to find root directory");
  }
  function b() {
    if (process.env.XDG_DATA_HOME)
      return process.env.XDG_DATA_HOME;
    switch (a.default.platform()) {
      case "darwin":
        return c.default.join(a.default.homedir(), "Library/Application Support");
      case "linux":
        return c.default.join(a.default.homedir(), ".local/share");
      case "win32":
        return process.env.LOCALAPPDATA ? process.env.LOCALAPPDATA : null;
      default:
        return null;
    }
  }
  return m;
}
var E, x;
function L() {
  if (x) return E;
  x = 1;
  var h = Object.create, p = Object.defineProperty, w = Object.getOwnPropertyDescriptor, j = Object.getOwnPropertyNames, g = Object.getPrototypeOf, T = Object.prototype.hasOwnProperty, P = (e, r) => {
    for (var t in r)
      p(e, t, { get: r[t], enumerable: !0 });
  }, v = (e, r, t, i) => {
    if (r && typeof r == "object" || typeof r == "function")
      for (let l of j(r))
        !T.call(e, l) && l !== t && p(e, l, { get: () => r[l], enumerable: !(i = w(r, l)) || i.enumerable });
    return e;
  }, _ = (e, r, t) => (t = e != null ? h(g(e)) : {}, v(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    !e || !e.__esModule ? p(t, "default", { value: e, enumerable: !0 }) : t,
    e
  )), D = (e) => v(p({}, "__esModule", { value: !0 }), e), k = {};
  P(k, {
    assertVercelOidcTokenResponse: () => n,
    findProjectInfo: () => u,
    getTokenPayload: () => N,
    getVercelCliToken: () => b,
    getVercelDataDir: () => O,
    getVercelOidcToken: () => o,
    isExpired: () => $,
    loadToken: () => f,
    saveToken: () => y
  }), E = D(k);
  var c = _(I), s = _(A), a = U(), d = F();
  function O() {
    const e = "com.vercel.cli", r = (0, d.getUserDataDir)();
    return r ? c.join(r, e) : null;
  }
  function b() {
    const e = O();
    if (!e)
      return null;
    const r = c.join(e, "auth.json");
    if (!s.existsSync(r))
      return null;
    const t = s.readFileSync(r, "utf8");
    return t ? JSON.parse(t).token : null;
  }
  async function o(e, r, t) {
    try {
      const i = `https://api.vercel.com/v1/projects/${r}/token?source=vercel-oidc-refresh${t ? `&teamId=${t}` : ""}`, l = await fetch(i, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${e}`
        }
      });
      if (!l.ok)
        throw new a.VercelOidcTokenError(
          `Failed to refresh OIDC token: ${l.statusText}`
        );
      const S = await l.json();
      return n(S), S;
    } catch (i) {
      throw new a.VercelOidcTokenError("Failed to refresh OIDC token", i);
    }
  }
  function n(e) {
    if (!e || typeof e != "object")
      throw new TypeError("Expected an object");
    if (!("token" in e) || typeof e.token != "string")
      throw new TypeError("Expected a string-valued token property");
  }
  function u() {
    const e = (0, d.findRootDir)();
    if (!e)
      throw new a.VercelOidcTokenError("Unable to find root directory");
    try {
      const r = c.join(e, ".vercel", "project.json");
      if (!s.existsSync(r))
        throw new a.VercelOidcTokenError("project.json not found");
      const t = JSON.parse(s.readFileSync(r, "utf8"));
      if (typeof t.projectId != "string" && typeof t.orgId != "string")
        throw new TypeError("Expected a string-valued projectId property");
      return { projectId: t.projectId, teamId: t.orgId };
    } catch (r) {
      throw new a.VercelOidcTokenError("Unable to find project ID", r);
    }
  }
  function y(e, r) {
    try {
      const t = (0, d.getUserDataDir)();
      if (!t)
        throw new a.VercelOidcTokenError("Unable to find user data directory");
      const i = c.join(t, "com.vercel.token", `${r}.json`), l = JSON.stringify(e);
      s.mkdirSync(c.dirname(i), { mode: 504, recursive: !0 }), s.writeFileSync(i, l), s.chmodSync(i, 432);
      return;
    } catch (t) {
      throw new a.VercelOidcTokenError("Failed to save token", t);
    }
  }
  function f(e) {
    try {
      const r = (0, d.getUserDataDir)();
      if (!r)
        return null;
      const t = c.join(r, "com.vercel.token", `${e}.json`);
      if (!s.existsSync(t))
        return null;
      const i = JSON.parse(s.readFileSync(t, "utf8"));
      return n(i), i;
    } catch (r) {
      throw new a.VercelOidcTokenError("Failed to load token", r);
    }
  }
  function N(e) {
    const r = e.split(".");
    if (r.length !== 3)
      throw new a.VercelOidcTokenError("Invalid token");
    const t = r[1].replace(/-/g, "+").replace(/_/g, "/"), i = t.padEnd(
      t.length + (4 - t.length % 4) % 4,
      "="
    );
    return JSON.parse(Buffer.from(i, "base64").toString("utf8"));
  }
  function $(e) {
    return e.exp * 1e3 < Date.now();
  }
  return E;
}
export {
  L as r
};
