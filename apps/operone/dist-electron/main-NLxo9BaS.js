var bg = Object.defineProperty;
var ru = (e) => {
  throw TypeError(e);
};
var wg = (e, t, r) => t in e ? bg(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var ke = (e, t, r) => wg(e, typeof t != "symbol" ? t + "" : t, r), nu = (e, t, r) => t.has(e) || ru("Cannot " + r);
var we = (e, t, r) => (nu(e, t, "read from private field"), r ? r.call(e) : t.get(e)), Ur = (e, t, r) => t.has(e) ? ru("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), Fr = (e, t, r, n) => (nu(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r);
import gp, { app as dt, BrowserWindow as yp, shell as Eg, ipcMain as gr } from "electron";
import * as ou from "path";
import ir from "path";
import Se from "node:process";
import ge from "node:path";
import { promisify as De, isDeepStrictEqual as $g } from "node:util";
import ue from "node:fs";
import Zr from "node:crypto";
import Sg from "node:assert";
import vp from "node:os";
import "node:events";
import "node:stream";
import $i from "fs";
import Ig, { promisify as Tg } from "util";
import * as Gr from "fs/promises";
import { exec as Og } from "child_process";
const ur = (e) => {
  const t = typeof e;
  return e !== null && (t === "object" || t === "function");
}, Ta = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), Rg = new Set("0123456789");
function ia(e) {
  const t = [];
  let r = "", n = "start", o = !1;
  for (const a of e)
    switch (a) {
      case "\\": {
        if (n === "index")
          throw new Error("Invalid character in an index");
        if (n === "indexEnd")
          throw new Error("Invalid character after an index");
        o && (r += a), n = "property", o = !o;
        break;
      }
      case ".": {
        if (n === "index")
          throw new Error("Invalid character in an index");
        if (n === "indexEnd") {
          n = "property";
          break;
        }
        if (o) {
          o = !1, r += a;
          break;
        }
        if (Ta.has(r))
          return [];
        t.push(r), r = "", n = "property";
        break;
      }
      case "[": {
        if (n === "index")
          throw new Error("Invalid character in an index");
        if (n === "indexEnd") {
          n = "index";
          break;
        }
        if (o) {
          o = !1, r += a;
          break;
        }
        if (n === "property") {
          if (Ta.has(r))
            return [];
          t.push(r), r = "";
        }
        n = "index";
        break;
      }
      case "]": {
        if (n === "index") {
          t.push(Number.parseInt(r, 10)), r = "", n = "indexEnd";
          break;
        }
        if (n === "indexEnd")
          throw new Error("Invalid character after an index");
      }
      default: {
        if (n === "index" && !Rg.has(a))
          throw new Error("Invalid character in an index");
        if (n === "indexEnd")
          throw new Error("Invalid character after an index");
        n === "start" && (n = "property"), o && (o = !1, r += "\\"), r += a;
      }
    }
  switch (o && (r += "\\"), n) {
    case "property": {
      if (Ta.has(r))
        return [];
      t.push(r);
      break;
    }
    case "index":
      throw new Error("Index was not closed");
    case "start": {
      t.push("");
      break;
    }
  }
  return t;
}
function Si(e, t) {
  if (typeof t != "number" && Array.isArray(e)) {
    const r = Number.parseInt(t, 10);
    return Number.isInteger(r) && e[r] === e[t];
  }
  return !1;
}
function _p(e, t) {
  if (Si(e, t))
    throw new Error("Cannot use string index");
}
function Pg(e, t, r) {
  if (!ur(e) || typeof t != "string")
    return r === void 0 ? e : r;
  const n = ia(t);
  if (n.length === 0)
    return r;
  for (let o = 0; o < n.length; o++) {
    const a = n[o];
    if (Si(e, a) ? e = o === n.length - 1 ? void 0 : null : e = e[a], e == null) {
      if (o !== n.length - 1)
        return r;
      break;
    }
  }
  return e === void 0 ? r : e;
}
function au(e, t, r) {
  if (!ur(e) || typeof t != "string")
    return e;
  const n = e, o = ia(t);
  for (let a = 0; a < o.length; a++) {
    const s = o[a];
    _p(e, s), a === o.length - 1 ? e[s] = r : ur(e[s]) || (e[s] = typeof o[a + 1] == "number" ? [] : {}), e = e[s];
  }
  return n;
}
function kg(e, t) {
  if (!ur(e) || typeof t != "string")
    return !1;
  const r = ia(t);
  for (let n = 0; n < r.length; n++) {
    const o = r[n];
    if (_p(e, o), n === r.length - 1)
      return delete e[o], !0;
    if (e = e[o], !ur(e))
      return !1;
  }
}
function Ng(e, t) {
  if (!ur(e) || typeof t != "string")
    return !1;
  const r = ia(t);
  if (r.length === 0)
    return !1;
  for (const n of r) {
    if (!ur(e) || !(n in e) || Si(e, n))
      return !1;
    e = e[n];
  }
  return !0;
}
const Vt = vp.homedir(), Ii = vp.tmpdir(), { env: $r } = Se, Ag = (e) => {
  const t = ge.join(Vt, "Library");
  return {
    data: ge.join(t, "Application Support", e),
    config: ge.join(t, "Preferences", e),
    cache: ge.join(t, "Caches", e),
    log: ge.join(t, "Logs", e),
    temp: ge.join(Ii, e)
  };
}, Cg = (e) => {
  const t = $r.APPDATA || ge.join(Vt, "AppData", "Roaming"), r = $r.LOCALAPPDATA || ge.join(Vt, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: ge.join(r, e, "Data"),
    config: ge.join(t, e, "Config"),
    cache: ge.join(r, e, "Cache"),
    log: ge.join(r, e, "Log"),
    temp: ge.join(Ii, e)
  };
}, jg = (e) => {
  const t = ge.basename(Vt);
  return {
    data: ge.join($r.XDG_DATA_HOME || ge.join(Vt, ".local", "share"), e),
    config: ge.join($r.XDG_CONFIG_HOME || ge.join(Vt, ".config"), e),
    cache: ge.join($r.XDG_CACHE_HOME || ge.join(Vt, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: ge.join($r.XDG_STATE_HOME || ge.join(Vt, ".local", "state"), e),
    temp: ge.join(Ii, t, e)
  };
};
function Mg(e, { suffix: t = "nodejs" } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  return t && (e += `-${t}`), Se.platform === "darwin" ? Ag(e) : Se.platform === "win32" ? Cg(e) : jg(e);
}
const xt = (e, t) => {
  const { onError: r } = t;
  return function(...o) {
    return e.apply(void 0, o).catch(r);
  };
}, Et = (e, t) => {
  const { onError: r } = t;
  return function(...o) {
    try {
      return e.apply(void 0, o);
    } catch (a) {
      return r(a);
    }
  };
}, xg = 250, Dt = (e, t) => {
  const { isRetriable: r } = t;
  return function(o) {
    const { timeout: a } = o, s = o.interval ?? xg, i = Date.now() + a;
    return function u(...c) {
      return e.apply(void 0, c).catch((l) => {
        if (!r(l) || Date.now() >= i)
          throw l;
        const y = Math.round(s * Math.random());
        return y > 0 ? new Promise((f) => setTimeout(f, y)).then(() => u.apply(void 0, c)) : u.apply(void 0, c);
      });
    };
  };
}, qt = (e, t) => {
  const { isRetriable: r } = t;
  return function(o) {
    const { timeout: a } = o, s = Date.now() + a;
    return function(...u) {
      for (; ; )
        try {
          return e.apply(void 0, u);
        } catch (c) {
          if (!r(c) || Date.now() >= s)
            throw c;
          continue;
        }
    };
  };
}, Sr = {
  /* API */
  isChangeErrorOk: (e) => {
    if (!Sr.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "ENOSYS" || !Dg && (t === "EINVAL" || t === "EPERM");
  },
  isNodeError: (e) => e instanceof Error,
  isRetriableError: (e) => {
    if (!Sr.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "EMFILE" || t === "ENFILE" || t === "EAGAIN" || t === "EBUSY" || t === "EACCESS" || t === "EACCES" || t === "EACCS" || t === "EPERM";
  },
  onChangeError: (e) => {
    if (!Sr.isNodeError(e))
      throw e;
    if (!Sr.isChangeErrorOk(e))
      throw e;
  }
}, qn = {
  onError: Sr.onChangeError
}, Ye = {
  onError: () => {
  }
}, Dg = Se.getuid ? !Se.getuid() : !1, qe = {
  isRetriable: Sr.isRetriableError
}, Le = {
  attempt: {
    /* ASYNC */
    chmod: xt(De(ue.chmod), qn),
    chown: xt(De(ue.chown), qn),
    close: xt(De(ue.close), Ye),
    fsync: xt(De(ue.fsync), Ye),
    mkdir: xt(De(ue.mkdir), Ye),
    realpath: xt(De(ue.realpath), Ye),
    stat: xt(De(ue.stat), Ye),
    unlink: xt(De(ue.unlink), Ye),
    /* SYNC */
    chmodSync: Et(ue.chmodSync, qn),
    chownSync: Et(ue.chownSync, qn),
    closeSync: Et(ue.closeSync, Ye),
    existsSync: Et(ue.existsSync, Ye),
    fsyncSync: Et(ue.fsync, Ye),
    mkdirSync: Et(ue.mkdirSync, Ye),
    realpathSync: Et(ue.realpathSync, Ye),
    statSync: Et(ue.statSync, Ye),
    unlinkSync: Et(ue.unlinkSync, Ye)
  },
  retry: {
    /* ASYNC */
    close: Dt(De(ue.close), qe),
    fsync: Dt(De(ue.fsync), qe),
    open: Dt(De(ue.open), qe),
    readFile: Dt(De(ue.readFile), qe),
    rename: Dt(De(ue.rename), qe),
    stat: Dt(De(ue.stat), qe),
    write: Dt(De(ue.write), qe),
    writeFile: Dt(De(ue.writeFile), qe),
    /* SYNC */
    closeSync: qt(ue.closeSync, qe),
    fsyncSync: qt(ue.fsyncSync, qe),
    openSync: qt(ue.openSync, qe),
    readFileSync: qt(ue.readFileSync, qe),
    renameSync: qt(ue.renameSync, qe),
    statSync: qt(ue.statSync, qe),
    writeSync: qt(ue.writeSync, qe),
    writeFileSync: qt(ue.writeFileSync, qe)
  }
}, qg = "utf8", su = 438, Lg = 511, zg = {}, Vg = Se.geteuid ? Se.geteuid() : -1, Ug = Se.getegid ? Se.getegid() : -1, Fg = 1e3, Zg = !!Se.getuid;
Se.getuid && Se.getuid();
const iu = 128, Gg = (e) => e instanceof Error && "code" in e, uu = (e) => typeof e == "string", Oa = (e) => e === void 0, Bg = Se.platform === "linux", bp = Se.platform === "win32", Ti = ["SIGHUP", "SIGINT", "SIGTERM"];
bp || Ti.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
Bg && Ti.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
class Hg {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (t) => {
      if (!this.exited) {
        this.exited = !0;
        for (const r of this.callbacks)
          r();
        t && (bp && t !== "SIGINT" && t !== "SIGTERM" && t !== "SIGKILL" ? Se.kill(Se.pid, "SIGTERM") : Se.kill(Se.pid, t));
      }
    }, this.hook = () => {
      Se.once("exit", () => this.exit());
      for (const t of Ti)
        try {
          Se.once(t, () => this.exit(t));
        } catch {
        }
    }, this.register = (t) => (this.callbacks.add(t), () => {
      this.callbacks.delete(t);
    }), this.hook();
  }
}
const Wg = new Hg(), Jg = Wg.register, ze = {
  /* VARIABLES */
  store: {},
  // filePath => purge
  /* API */
  create: (e) => {
    const t = `000000${Math.floor(Math.random() * 16777215).toString(16)}`.slice(-6), o = `.tmp-${Date.now().toString().slice(-10)}${t}`;
    return `${e}${o}`;
  },
  get: (e, t, r = !0) => {
    const n = ze.truncate(t(e));
    return n in ze.store ? ze.get(e, t, r) : (ze.store[n] = r, [n, () => delete ze.store[n]]);
  },
  purge: (e) => {
    ze.store[e] && (delete ze.store[e], Le.attempt.unlink(e));
  },
  purgeSync: (e) => {
    ze.store[e] && (delete ze.store[e], Le.attempt.unlinkSync(e));
  },
  purgeSyncAll: () => {
    for (const e in ze.store)
      ze.purgeSync(e);
  },
  truncate: (e) => {
    const t = ge.basename(e);
    if (t.length <= iu)
      return e;
    const r = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!r)
      return e;
    const n = t.length - iu;
    return `${e.slice(0, -t.length)}${r[1]}${r[2].slice(0, -n)}${r[3]}`;
  }
};
Jg(ze.purgeSyncAll);
function wp(e, t, r = zg) {
  if (uu(r))
    return wp(e, t, { encoding: r });
  const o = { timeout: r.timeout ?? Fg };
  let a = null, s = null, i = null;
  try {
    const u = Le.attempt.realpathSync(e), c = !!u;
    e = u || e, [s, a] = ze.get(e, r.tmpCreate || ze.create, r.tmpPurge !== !1);
    const l = Zg && Oa(r.chown), y = Oa(r.mode);
    if (c && (l || y)) {
      const d = Le.attempt.statSync(e);
      d && (r = { ...r }, l && (r.chown = { uid: d.uid, gid: d.gid }), y && (r.mode = d.mode));
    }
    if (!c) {
      const d = ge.dirname(e);
      Le.attempt.mkdirSync(d, {
        mode: Lg,
        recursive: !0
      });
    }
    i = Le.retry.openSync(o)(s, "w", r.mode || su), r.tmpCreated && r.tmpCreated(s), uu(t) ? Le.retry.writeSync(o)(i, t, 0, r.encoding || qg) : Oa(t) || Le.retry.writeSync(o)(i, t, 0, t.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? Le.retry.fsyncSync(o)(i) : Le.attempt.fsync(i)), Le.retry.closeSync(o)(i), i = null, r.chown && (r.chown.uid !== Vg || r.chown.gid !== Ug) && Le.attempt.chownSync(s, r.chown.uid, r.chown.gid), r.mode && r.mode !== su && Le.attempt.chmodSync(s, r.mode);
    try {
      Le.retry.renameSync(o)(s, e);
    } catch (d) {
      if (!Gg(d) || d.code !== "ENAMETOOLONG")
        throw d;
      Le.retry.renameSync(o)(s, ze.truncate(e));
    }
    a(), s = null;
  } finally {
    i && Le.attempt.closeSync(i), s && ze.purge(s);
  }
}
var Kg = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ep(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ln = { exports: {} }, Ra = {}, $t = {}, Jt = {}, Pa = {}, ka = {}, Na = {}, cu;
function Yo() {
  return cu || (cu = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
    class t {
    }
    e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    class r extends t {
      constructor(p) {
        if (super(), !e.IDENTIFIER.test(p))
          throw new Error("CodeGen: name must be a valid identifier");
        this.str = p;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        return !1;
      }
      get names() {
        return { [this.str]: 1 };
      }
    }
    e.Name = r;
    class n extends t {
      constructor(p) {
        super(), this._items = typeof p == "string" ? [p] : p;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        if (this._items.length > 1)
          return !1;
        const p = this._items[0];
        return p === "" || p === '""';
      }
      get str() {
        var p;
        return (p = this._str) !== null && p !== void 0 ? p : this._str = this._items.reduce((v, $) => `${v}${$}`, "");
      }
      get names() {
        var p;
        return (p = this._names) !== null && p !== void 0 ? p : this._names = this._items.reduce((v, $) => ($ instanceof r && (v[$.str] = (v[$.str] || 0) + 1), v), {});
      }
    }
    e._Code = n, e.nil = new n("");
    function o(h, ...p) {
      const v = [h[0]];
      let $ = 0;
      for (; $ < p.length; )
        i(v, p[$]), v.push(h[++$]);
      return new n(v);
    }
    e._ = o;
    const a = new n("+");
    function s(h, ...p) {
      const v = [f(h[0])];
      let $ = 0;
      for (; $ < p.length; )
        v.push(a), i(v, p[$]), v.push(a, f(h[++$]));
      return u(v), new n(v);
    }
    e.str = s;
    function i(h, p) {
      p instanceof n ? h.push(...p._items) : p instanceof r ? h.push(p) : h.push(y(p));
    }
    e.addCodeArg = i;
    function u(h) {
      let p = 1;
      for (; p < h.length - 1; ) {
        if (h[p] === a) {
          const v = c(h[p - 1], h[p + 1]);
          if (v !== void 0) {
            h.splice(p - 1, 3, v);
            continue;
          }
          h[p++] = "+";
        }
        p++;
      }
    }
    function c(h, p) {
      if (p === '""')
        return h;
      if (h === '""')
        return p;
      if (typeof h == "string")
        return p instanceof r || h[h.length - 1] !== '"' ? void 0 : typeof p != "string" ? `${h.slice(0, -1)}${p}"` : p[0] === '"' ? h.slice(0, -1) + p.slice(1) : void 0;
      if (typeof p == "string" && p[0] === '"' && !(h instanceof r))
        return `"${h}${p.slice(1)}`;
    }
    function l(h, p) {
      return p.emptyStr() ? h : h.emptyStr() ? p : s`${h}${p}`;
    }
    e.strConcat = l;
    function y(h) {
      return typeof h == "number" || typeof h == "boolean" || h === null ? h : f(Array.isArray(h) ? h.join(",") : h);
    }
    function d(h) {
      return new n(f(h));
    }
    e.stringify = d;
    function f(h) {
      return JSON.stringify(h).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    e.safeStringify = f;
    function g(h) {
      return typeof h == "string" && e.IDENTIFIER.test(h) ? new n(`.${h}`) : o`[${h}]`;
    }
    e.getProperty = g;
    function _(h) {
      if (typeof h == "string" && e.IDENTIFIER.test(h))
        return new n(`${h}`);
      throw new Error(`CodeGen: invalid export name: ${h}, use explicit $id name mapping`);
    }
    e.getEsmExportName = _;
    function m(h) {
      return new n(h.toString());
    }
    e.regexpCode = m;
  })(Na)), Na;
}
var Aa = {}, lu;
function du() {
  return lu || (lu = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
    const t = Yo();
    class r extends Error {
      constructor(c) {
        super(`CodeGen: "code" for ${c} not defined`), this.value = c.value;
      }
    }
    var n;
    (function(u) {
      u[u.Started = 0] = "Started", u[u.Completed = 1] = "Completed";
    })(n || (e.UsedValueState = n = {})), e.varKinds = {
      const: new t.Name("const"),
      let: new t.Name("let"),
      var: new t.Name("var")
    };
    class o {
      constructor({ prefixes: c, parent: l } = {}) {
        this._names = {}, this._prefixes = c, this._parent = l;
      }
      toName(c) {
        return c instanceof t.Name ? c : this.name(c);
      }
      name(c) {
        return new t.Name(this._newName(c));
      }
      _newName(c) {
        const l = this._names[c] || this._nameGroup(c);
        return `${c}${l.index++}`;
      }
      _nameGroup(c) {
        var l, y;
        if (!((y = (l = this._parent) === null || l === void 0 ? void 0 : l._prefixes) === null || y === void 0) && y.has(c) || this._prefixes && !this._prefixes.has(c))
          throw new Error(`CodeGen: prefix "${c}" is not allowed in this scope`);
        return this._names[c] = { prefix: c, index: 0 };
      }
    }
    e.Scope = o;
    class a extends t.Name {
      constructor(c, l) {
        super(l), this.prefix = c;
      }
      setValue(c, { property: l, itemIndex: y }) {
        this.value = c, this.scopePath = (0, t._)`.${new t.Name(l)}[${y}]`;
      }
    }
    e.ValueScopeName = a;
    const s = (0, t._)`\n`;
    class i extends o {
      constructor(c) {
        super(c), this._values = {}, this._scope = c.scope, this.opts = { ...c, _n: c.lines ? s : t.nil };
      }
      get() {
        return this._scope;
      }
      name(c) {
        return new a(c, this._newName(c));
      }
      value(c, l) {
        var y;
        if (l.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const d = this.toName(c), { prefix: f } = d, g = (y = l.key) !== null && y !== void 0 ? y : l.ref;
        let _ = this._values[f];
        if (_) {
          const p = _.get(g);
          if (p)
            return p;
        } else
          _ = this._values[f] = /* @__PURE__ */ new Map();
        _.set(g, d);
        const m = this._scope[f] || (this._scope[f] = []), h = m.length;
        return m[h] = l.ref, d.setValue(l, { property: f, itemIndex: h }), d;
      }
      getValue(c, l) {
        const y = this._values[c];
        if (y)
          return y.get(l);
      }
      scopeRefs(c, l = this._values) {
        return this._reduceValues(l, (y) => {
          if (y.scopePath === void 0)
            throw new Error(`CodeGen: name "${y}" has no value`);
          return (0, t._)`${c}${y.scopePath}`;
        });
      }
      scopeCode(c = this._values, l, y) {
        return this._reduceValues(c, (d) => {
          if (d.value === void 0)
            throw new Error(`CodeGen: name "${d}" has no value`);
          return d.value.code;
        }, l, y);
      }
      _reduceValues(c, l, y = {}, d) {
        let f = t.nil;
        for (const g in c) {
          const _ = c[g];
          if (!_)
            continue;
          const m = y[g] = y[g] || /* @__PURE__ */ new Map();
          _.forEach((h) => {
            if (m.has(h))
              return;
            m.set(h, n.Started);
            let p = l(h);
            if (p) {
              const v = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
              f = (0, t._)`${f}${v} ${h} = ${p};${this.opts._n}`;
            } else if (p = d == null ? void 0 : d(h))
              f = (0, t._)`${f}${p}${this.opts._n}`;
            else
              throw new r(h);
            m.set(h, n.Completed);
          });
        }
        return f;
      }
    }
    e.ValueScope = i;
  })(Aa)), Aa;
}
var fu;
function ne() {
  return fu || (fu = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
    const t = Yo(), r = du();
    var n = Yo();
    Object.defineProperty(e, "_", { enumerable: !0, get: function() {
      return n._;
    } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
      return n.str;
    } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
      return n.strConcat;
    } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
      return n.nil;
    } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
      return n.getProperty;
    } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
      return n.stringify;
    } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
      return n.regexpCode;
    } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
      return n.Name;
    } });
    var o = du();
    Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
      return o.Scope;
    } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
      return o.ValueScope;
    } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
      return o.ValueScopeName;
    } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
      return o.varKinds;
    } }), e.operators = {
      GT: new t._Code(">"),
      GTE: new t._Code(">="),
      LT: new t._Code("<"),
      LTE: new t._Code("<="),
      EQ: new t._Code("==="),
      NEQ: new t._Code("!=="),
      NOT: new t._Code("!"),
      OR: new t._Code("||"),
      AND: new t._Code("&&"),
      ADD: new t._Code("+")
    };
    class a {
      optimizeNodes() {
        return this;
      }
      optimizeNames(S, w) {
        return this;
      }
    }
    class s extends a {
      constructor(S, w, A) {
        super(), this.varKind = S, this.name = w, this.rhs = A;
      }
      render({ es5: S, _n: w }) {
        const A = S ? r.varKinds.var : this.varKind, Y = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${A} ${this.name}${Y};` + w;
      }
      optimizeNames(S, w) {
        if (S[this.name.str])
          return this.rhs && (this.rhs = M(this.rhs, S, w)), this;
      }
      get names() {
        return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
      }
    }
    class i extends a {
      constructor(S, w, A) {
        super(), this.lhs = S, this.rhs = w, this.sideEffects = A;
      }
      render({ _n: S }) {
        return `${this.lhs} = ${this.rhs};` + S;
      }
      optimizeNames(S, w) {
        if (!(this.lhs instanceof t.Name && !S[this.lhs.str] && !this.sideEffects))
          return this.rhs = M(this.rhs, S, w), this;
      }
      get names() {
        const S = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
        return K(S, this.rhs);
      }
    }
    class u extends i {
      constructor(S, w, A, Y) {
        super(S, A, Y), this.op = w;
      }
      render({ _n: S }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + S;
      }
    }
    class c extends a {
      constructor(S) {
        super(), this.label = S, this.names = {};
      }
      render({ _n: S }) {
        return `${this.label}:` + S;
      }
    }
    class l extends a {
      constructor(S) {
        super(), this.label = S, this.names = {};
      }
      render({ _n: S }) {
        return `break${this.label ? ` ${this.label}` : ""};` + S;
      }
    }
    class y extends a {
      constructor(S) {
        super(), this.error = S;
      }
      render({ _n: S }) {
        return `throw ${this.error};` + S;
      }
      get names() {
        return this.error.names;
      }
    }
    class d extends a {
      constructor(S) {
        super(), this.code = S;
      }
      render({ _n: S }) {
        return `${this.code};` + S;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(S, w) {
        return this.code = M(this.code, S, w), this;
      }
      get names() {
        return this.code instanceof t._CodeOrName ? this.code.names : {};
      }
    }
    class f extends a {
      constructor(S = []) {
        super(), this.nodes = S;
      }
      render(S) {
        return this.nodes.reduce((w, A) => w + A.render(S), "");
      }
      optimizeNodes() {
        const { nodes: S } = this;
        let w = S.length;
        for (; w--; ) {
          const A = S[w].optimizeNodes();
          Array.isArray(A) ? S.splice(w, 1, ...A) : A ? S[w] = A : S.splice(w, 1);
        }
        return S.length > 0 ? this : void 0;
      }
      optimizeNames(S, w) {
        const { nodes: A } = this;
        let Y = A.length;
        for (; Y--; ) {
          const X = A[Y];
          X.optimizeNames(S, w) || (L(S, X.names), A.splice(Y, 1));
        }
        return A.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((S, w) => W(S, w.names), {});
      }
    }
    class g extends f {
      render(S) {
        return "{" + S._n + super.render(S) + "}" + S._n;
      }
    }
    class _ extends f {
    }
    class m extends g {
    }
    m.kind = "else";
    class h extends g {
      constructor(S, w) {
        super(w), this.condition = S;
      }
      render(S) {
        let w = `if(${this.condition})` + super.render(S);
        return this.else && (w += "else " + this.else.render(S)), w;
      }
      optimizeNodes() {
        super.optimizeNodes();
        const S = this.condition;
        if (S === !0)
          return this.nodes;
        let w = this.else;
        if (w) {
          const A = w.optimizeNodes();
          w = this.else = Array.isArray(A) ? new m(A) : A;
        }
        if (w)
          return S === !1 ? w instanceof h ? w : w.nodes : this.nodes.length ? this : new h(F(S), w instanceof h ? [w] : w.nodes);
        if (!(S === !1 || !this.nodes.length))
          return this;
      }
      optimizeNames(S, w) {
        var A;
        if (this.else = (A = this.else) === null || A === void 0 ? void 0 : A.optimizeNames(S, w), !!(super.optimizeNames(S, w) || this.else))
          return this.condition = M(this.condition, S, w), this;
      }
      get names() {
        const S = super.names;
        return K(S, this.condition), this.else && W(S, this.else.names), S;
      }
    }
    h.kind = "if";
    class p extends g {
    }
    p.kind = "for";
    class v extends p {
      constructor(S) {
        super(), this.iteration = S;
      }
      render(S) {
        return `for(${this.iteration})` + super.render(S);
      }
      optimizeNames(S, w) {
        if (super.optimizeNames(S, w))
          return this.iteration = M(this.iteration, S, w), this;
      }
      get names() {
        return W(super.names, this.iteration.names);
      }
    }
    class $ extends p {
      constructor(S, w, A, Y) {
        super(), this.varKind = S, this.name = w, this.from = A, this.to = Y;
      }
      render(S) {
        const w = S.es5 ? r.varKinds.var : this.varKind, { name: A, from: Y, to: X } = this;
        return `for(${w} ${A}=${Y}; ${A}<${X}; ${A}++)` + super.render(S);
      }
      get names() {
        const S = K(super.names, this.from);
        return K(S, this.to);
      }
    }
    class b extends p {
      constructor(S, w, A, Y) {
        super(), this.loop = S, this.varKind = w, this.name = A, this.iterable = Y;
      }
      render(S) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(S);
      }
      optimizeNames(S, w) {
        if (super.optimizeNames(S, w))
          return this.iterable = M(this.iterable, S, w), this;
      }
      get names() {
        return W(super.names, this.iterable.names);
      }
    }
    class E extends g {
      constructor(S, w, A) {
        super(), this.name = S, this.args = w, this.async = A;
      }
      render(S) {
        return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(S);
      }
    }
    E.kind = "func";
    class I extends f {
      render(S) {
        return "return " + super.render(S);
      }
    }
    I.kind = "return";
    class O extends g {
      render(S) {
        let w = "try" + super.render(S);
        return this.catch && (w += this.catch.render(S)), this.finally && (w += this.finally.render(S)), w;
      }
      optimizeNodes() {
        var S, w;
        return super.optimizeNodes(), (S = this.catch) === null || S === void 0 || S.optimizeNodes(), (w = this.finally) === null || w === void 0 || w.optimizeNodes(), this;
      }
      optimizeNames(S, w) {
        var A, Y;
        return super.optimizeNames(S, w), (A = this.catch) === null || A === void 0 || A.optimizeNames(S, w), (Y = this.finally) === null || Y === void 0 || Y.optimizeNames(S, w), this;
      }
      get names() {
        const S = super.names;
        return this.catch && W(S, this.catch.names), this.finally && W(S, this.finally.names), S;
      }
    }
    class q extends g {
      constructor(S) {
        super(), this.error = S;
      }
      render(S) {
        return `catch(${this.error})` + super.render(S);
      }
    }
    q.kind = "catch";
    class H extends g {
      render(S) {
        return "finally" + super.render(S);
      }
    }
    H.kind = "finally";
    class x {
      constructor(S, w = {}) {
        this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...w, _n: w.lines ? `
` : "" }, this._extScope = S, this._scope = new r.Scope({ parent: S }), this._nodes = [new _()];
      }
      toString() {
        return this._root.render(this.opts);
      }
      // returns unique name in the internal scope
      name(S) {
        return this._scope.name(S);
      }
      // reserves unique name in the external scope
      scopeName(S) {
        return this._extScope.name(S);
      }
      // reserves unique name in the external scope and assigns value to it
      scopeValue(S, w) {
        const A = this._extScope.value(S, w);
        return (this._values[A.prefix] || (this._values[A.prefix] = /* @__PURE__ */ new Set())).add(A), A;
      }
      getScopeValue(S, w) {
        return this._extScope.getValue(S, w);
      }
      // return code that assigns values in the external scope to the names that are used internally
      // (same names that were returned by gen.scopeName or gen.scopeValue)
      scopeRefs(S) {
        return this._extScope.scopeRefs(S, this._values);
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values);
      }
      _def(S, w, A, Y) {
        const X = this._scope.toName(w);
        return A !== void 0 && Y && (this._constants[X.str] = A), this._leafNode(new s(S, X, A)), X;
      }
      // `const` declaration (`var` in es5 mode)
      const(S, w, A) {
        return this._def(r.varKinds.const, S, w, A);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(S, w, A) {
        return this._def(r.varKinds.let, S, w, A);
      }
      // `var` declaration with optional assignment
      var(S, w, A) {
        return this._def(r.varKinds.var, S, w, A);
      }
      // assignment code
      assign(S, w, A) {
        return this._leafNode(new i(S, w, A));
      }
      // `+=` code
      add(S, w) {
        return this._leafNode(new u(S, e.operators.ADD, w));
      }
      // appends passed SafeExpr to code or executes Block
      code(S) {
        return typeof S == "function" ? S() : S !== t.nil && this._leafNode(new d(S)), this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...S) {
        const w = ["{"];
        for (const [A, Y] of S)
          w.length > 1 && w.push(","), w.push(A), (A !== Y || this.opts.es5) && (w.push(":"), (0, t.addCodeArg)(w, Y));
        return w.push("}"), new t._Code(w);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(S, w, A) {
        if (this._blockNode(new h(S)), w && A)
          this.code(w).else().code(A).endIf();
        else if (w)
          this.code(w).endIf();
        else if (A)
          throw new Error('CodeGen: "else" body without "then" body');
        return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(S) {
        return this._elseNode(new h(S));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
        return this._elseNode(new m());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(h, m);
      }
      _for(S, w) {
        return this._blockNode(S), w && this.code(w).endFor(), this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(S, w) {
        return this._for(new v(S), w);
      }
      // `for` statement for a range of values
      forRange(S, w, A, Y, X = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
        const le = this._scope.toName(S);
        return this._for(new $(X, le, w, A), () => Y(le));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(S, w, A, Y = r.varKinds.const) {
        const X = this._scope.toName(S);
        if (this.opts.es5) {
          const le = w instanceof t.Name ? w : this.var("_arr", w);
          return this.forRange("_i", 0, (0, t._)`${le}.length`, (ae) => {
            this.var(X, (0, t._)`${le}[${ae}]`), A(X);
          });
        }
        return this._for(new b("of", Y, X, w), () => A(X));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(S, w, A, Y = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
        if (this.opts.ownProperties)
          return this.forOf(S, (0, t._)`Object.keys(${w})`, A);
        const X = this._scope.toName(S);
        return this._for(new b("in", Y, X, w), () => A(X));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(p);
      }
      // `label` statement
      label(S) {
        return this._leafNode(new c(S));
      }
      // `break` statement
      break(S) {
        return this._leafNode(new l(S));
      }
      // `return` statement
      return(S) {
        const w = new I();
        if (this._blockNode(w), this.code(S), w.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(I);
      }
      // `try` statement
      try(S, w, A) {
        if (!w && !A)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const Y = new O();
        if (this._blockNode(Y), this.code(S), w) {
          const X = this.name("e");
          this._currNode = Y.catch = new q(X), w(X);
        }
        return A && (this._currNode = Y.finally = new H(), this.code(A)), this._endBlockNode(q, H);
      }
      // `throw` statement
      throw(S) {
        return this._leafNode(new y(S));
      }
      // start self-balancing block
      block(S, w) {
        return this._blockStarts.push(this._nodes.length), S && this.code(S).endBlock(w), this;
      }
      // end the current self-balancing block
      endBlock(S) {
        const w = this._blockStarts.pop();
        if (w === void 0)
          throw new Error("CodeGen: not in self-balancing block");
        const A = this._nodes.length - w;
        if (A < 0 || S !== void 0 && A !== S)
          throw new Error(`CodeGen: wrong number of nodes: ${A} vs ${S} expected`);
        return this._nodes.length = w, this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(S, w = t.nil, A, Y) {
        return this._blockNode(new E(S, w, A)), Y && this.code(Y).endFunc(), this;
      }
      // end function definition
      endFunc() {
        return this._endBlockNode(E);
      }
      optimize(S = 1) {
        for (; S-- > 0; )
          this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
      }
      _leafNode(S) {
        return this._currNode.nodes.push(S), this;
      }
      _blockNode(S) {
        this._currNode.nodes.push(S), this._nodes.push(S);
      }
      _endBlockNode(S, w) {
        const A = this._currNode;
        if (A instanceof S || w && A instanceof w)
          return this._nodes.pop(), this;
        throw new Error(`CodeGen: not in block "${w ? `${S.kind}/${w.kind}` : S.kind}"`);
      }
      _elseNode(S) {
        const w = this._currNode;
        if (!(w instanceof h))
          throw new Error('CodeGen: "else" without "if"');
        return this._currNode = w.else = S, this;
      }
      get _root() {
        return this._nodes[0];
      }
      get _currNode() {
        const S = this._nodes;
        return S[S.length - 1];
      }
      set _currNode(S) {
        const w = this._nodes;
        w[w.length - 1] = S;
      }
    }
    e.CodeGen = x;
    function W(k, S) {
      for (const w in S)
        k[w] = (k[w] || 0) + (S[w] || 0);
      return k;
    }
    function K(k, S) {
      return S instanceof t._CodeOrName ? W(k, S.names) : k;
    }
    function M(k, S, w) {
      if (k instanceof t.Name)
        return A(k);
      if (!Y(k))
        return k;
      return new t._Code(k._items.reduce((X, le) => (le instanceof t.Name && (le = A(le)), le instanceof t._Code ? X.push(...le._items) : X.push(le), X), []));
      function A(X) {
        const le = w[X.str];
        return le === void 0 || S[X.str] !== 1 ? X : (delete S[X.str], le);
      }
      function Y(X) {
        return X instanceof t._Code && X._items.some((le) => le instanceof t.Name && S[le.str] === 1 && w[le.str] !== void 0);
      }
    }
    function L(k, S) {
      for (const w in S)
        k[w] = (k[w] || 0) - (S[w] || 0);
    }
    function F(k) {
      return typeof k == "boolean" || typeof k == "number" || k === null ? !k : (0, t._)`!${C(k)}`;
    }
    e.not = F;
    const G = P(e.operators.AND);
    function B(...k) {
      return k.reduce(G);
    }
    e.and = B;
    const Q = P(e.operators.OR);
    function D(...k) {
      return k.reduce(Q);
    }
    e.or = D;
    function P(k) {
      return (S, w) => S === t.nil ? w : w === t.nil ? S : (0, t._)`${C(S)} ${k} ${C(w)}`;
    }
    function C(k) {
      return k instanceof t.Name ? k : (0, t._)`(${k})`;
    }
  })(ka)), ka;
}
var ce = {}, pu;
function pe() {
  if (pu) return ce;
  pu = 1, Object.defineProperty(ce, "__esModule", { value: !0 }), ce.checkStrictMode = ce.getErrorPath = ce.Type = ce.useFunc = ce.setEvaluated = ce.evaluatedPropsToName = ce.mergeEvaluated = ce.eachItem = ce.unescapeJsonPointer = ce.escapeJsonPointer = ce.escapeFragment = ce.unescapeFragment = ce.schemaRefOrVal = ce.schemaHasRulesButRef = ce.schemaHasRules = ce.checkUnknownRules = ce.alwaysValidSchema = ce.toHash = void 0;
  const e = ne(), t = Yo();
  function r(b) {
    const E = {};
    for (const I of b)
      E[I] = !0;
    return E;
  }
  ce.toHash = r;
  function n(b, E) {
    return typeof E == "boolean" ? E : Object.keys(E).length === 0 ? !0 : (o(b, E), !a(E, b.self.RULES.all));
  }
  ce.alwaysValidSchema = n;
  function o(b, E = b.schema) {
    const { opts: I, self: O } = b;
    if (!I.strictSchema || typeof E == "boolean")
      return;
    const q = O.RULES.keywords;
    for (const H in E)
      q[H] || $(b, `unknown keyword: "${H}"`);
  }
  ce.checkUnknownRules = o;
  function a(b, E) {
    if (typeof b == "boolean")
      return !b;
    for (const I in b)
      if (E[I])
        return !0;
    return !1;
  }
  ce.schemaHasRules = a;
  function s(b, E) {
    if (typeof b == "boolean")
      return !b;
    for (const I in b)
      if (I !== "$ref" && E.all[I])
        return !0;
    return !1;
  }
  ce.schemaHasRulesButRef = s;
  function i({ topSchemaRef: b, schemaPath: E }, I, O, q) {
    if (!q) {
      if (typeof I == "number" || typeof I == "boolean")
        return I;
      if (typeof I == "string")
        return (0, e._)`${I}`;
    }
    return (0, e._)`${b}${E}${(0, e.getProperty)(O)}`;
  }
  ce.schemaRefOrVal = i;
  function u(b) {
    return y(decodeURIComponent(b));
  }
  ce.unescapeFragment = u;
  function c(b) {
    return encodeURIComponent(l(b));
  }
  ce.escapeFragment = c;
  function l(b) {
    return typeof b == "number" ? `${b}` : b.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  ce.escapeJsonPointer = l;
  function y(b) {
    return b.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  ce.unescapeJsonPointer = y;
  function d(b, E) {
    if (Array.isArray(b))
      for (const I of b)
        E(I);
    else
      E(b);
  }
  ce.eachItem = d;
  function f({ mergeNames: b, mergeToName: E, mergeValues: I, resultToName: O }) {
    return (q, H, x, W) => {
      const K = x === void 0 ? H : x instanceof e.Name ? (H instanceof e.Name ? b(q, H, x) : E(q, H, x), x) : H instanceof e.Name ? (E(q, x, H), H) : I(H, x);
      return W === e.Name && !(K instanceof e.Name) ? O(q, K) : K;
    };
  }
  ce.mergeEvaluated = {
    props: f({
      mergeNames: (b, E, I) => b.if((0, e._)`${I} !== true && ${E} !== undefined`, () => {
        b.if((0, e._)`${E} === true`, () => b.assign(I, !0), () => b.assign(I, (0, e._)`${I} || {}`).code((0, e._)`Object.assign(${I}, ${E})`));
      }),
      mergeToName: (b, E, I) => b.if((0, e._)`${I} !== true`, () => {
        E === !0 ? b.assign(I, !0) : (b.assign(I, (0, e._)`${I} || {}`), _(b, I, E));
      }),
      mergeValues: (b, E) => b === !0 ? !0 : { ...b, ...E },
      resultToName: g
    }),
    items: f({
      mergeNames: (b, E, I) => b.if((0, e._)`${I} !== true && ${E} !== undefined`, () => b.assign(I, (0, e._)`${E} === true ? true : ${I} > ${E} ? ${I} : ${E}`)),
      mergeToName: (b, E, I) => b.if((0, e._)`${I} !== true`, () => b.assign(I, E === !0 ? !0 : (0, e._)`${I} > ${E} ? ${I} : ${E}`)),
      mergeValues: (b, E) => b === !0 ? !0 : Math.max(b, E),
      resultToName: (b, E) => b.var("items", E)
    })
  };
  function g(b, E) {
    if (E === !0)
      return b.var("props", !0);
    const I = b.var("props", (0, e._)`{}`);
    return E !== void 0 && _(b, I, E), I;
  }
  ce.evaluatedPropsToName = g;
  function _(b, E, I) {
    Object.keys(I).forEach((O) => b.assign((0, e._)`${E}${(0, e.getProperty)(O)}`, !0));
  }
  ce.setEvaluated = _;
  const m = {};
  function h(b, E) {
    return b.scopeValue("func", {
      ref: E,
      code: m[E.code] || (m[E.code] = new t._Code(E.code))
    });
  }
  ce.useFunc = h;
  var p;
  (function(b) {
    b[b.Num = 0] = "Num", b[b.Str = 1] = "Str";
  })(p || (ce.Type = p = {}));
  function v(b, E, I) {
    if (b instanceof e.Name) {
      const O = E === p.Num;
      return I ? O ? (0, e._)`"[" + ${b} + "]"` : (0, e._)`"['" + ${b} + "']"` : O ? (0, e._)`"/" + ${b}` : (0, e._)`"/" + ${b}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
    }
    return I ? (0, e.getProperty)(b).toString() : "/" + l(b);
  }
  ce.getErrorPath = v;
  function $(b, E, I = b.opts.strictSchema) {
    if (I) {
      if (E = `strict mode: ${E}`, I === !0)
        throw new Error(E);
      b.self.logger.warn(E);
    }
  }
  return ce.checkStrictMode = $, ce;
}
var zn = {}, hu;
function pt() {
  if (hu) return zn;
  hu = 1, Object.defineProperty(zn, "__esModule", { value: !0 });
  const e = ne(), t = {
    // validation function arguments
    data: new e.Name("data"),
    // data passed to validation function
    // args passed from referencing schema
    valCxt: new e.Name("valCxt"),
    // validation/data context - should not be used directly, it is destructured to the names below
    instancePath: new e.Name("instancePath"),
    parentData: new e.Name("parentData"),
    parentDataProperty: new e.Name("parentDataProperty"),
    rootData: new e.Name("rootData"),
    // root data - same as the data passed to the first/top validation function
    dynamicAnchors: new e.Name("dynamicAnchors"),
    // used to support recursiveRef and dynamicRef
    // function scoped variables
    vErrors: new e.Name("vErrors"),
    // null or array of validation errors
    errors: new e.Name("errors"),
    // counter of validation errors
    this: new e.Name("this"),
    // "globals"
    self: new e.Name("self"),
    scope: new e.Name("scope"),
    // JTD serialize/parse name for JSON string and position
    json: new e.Name("json"),
    jsonPos: new e.Name("jsonPos"),
    jsonLen: new e.Name("jsonLen"),
    jsonPart: new e.Name("jsonPart")
  };
  return zn.default = t, zn;
}
var mu;
function ua() {
  return mu || (mu = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
    const t = ne(), r = pe(), n = pt();
    e.keywordError = {
      message: ({ keyword: m }) => (0, t.str)`must pass "${m}" keyword validation`
    }, e.keyword$DataError = {
      message: ({ keyword: m, schemaType: h }) => h ? (0, t.str)`"${m}" keyword must be ${h} ($data)` : (0, t.str)`"${m}" keyword is invalid ($data)`
    };
    function o(m, h = e.keywordError, p, v) {
      const { it: $ } = m, { gen: b, compositeRule: E, allErrors: I } = $, O = y(m, h, p);
      v ?? (E || I) ? u(b, O) : c($, (0, t._)`[${O}]`);
    }
    e.reportError = o;
    function a(m, h = e.keywordError, p) {
      const { it: v } = m, { gen: $, compositeRule: b, allErrors: E } = v, I = y(m, h, p);
      u($, I), b || E || c(v, n.default.vErrors);
    }
    e.reportExtraError = a;
    function s(m, h) {
      m.assign(n.default.errors, h), m.if((0, t._)`${n.default.vErrors} !== null`, () => m.if(h, () => m.assign((0, t._)`${n.default.vErrors}.length`, h), () => m.assign(n.default.vErrors, null)));
    }
    e.resetErrorsCount = s;
    function i({ gen: m, keyword: h, schemaValue: p, data: v, errsCount: $, it: b }) {
      if ($ === void 0)
        throw new Error("ajv implementation error");
      const E = m.name("err");
      m.forRange("i", $, n.default.errors, (I) => {
        m.const(E, (0, t._)`${n.default.vErrors}[${I}]`), m.if((0, t._)`${E}.instancePath === undefined`, () => m.assign((0, t._)`${E}.instancePath`, (0, t.strConcat)(n.default.instancePath, b.errorPath))), m.assign((0, t._)`${E}.schemaPath`, (0, t.str)`${b.errSchemaPath}/${h}`), b.opts.verbose && (m.assign((0, t._)`${E}.schema`, p), m.assign((0, t._)`${E}.data`, v));
      });
    }
    e.extendErrors = i;
    function u(m, h) {
      const p = m.const("err", h);
      m.if((0, t._)`${n.default.vErrors} === null`, () => m.assign(n.default.vErrors, (0, t._)`[${p}]`), (0, t._)`${n.default.vErrors}.push(${p})`), m.code((0, t._)`${n.default.errors}++`);
    }
    function c(m, h) {
      const { gen: p, validateName: v, schemaEnv: $ } = m;
      $.$async ? p.throw((0, t._)`new ${m.ValidationError}(${h})`) : (p.assign((0, t._)`${v}.errors`, h), p.return(!1));
    }
    const l = {
      keyword: new t.Name("keyword"),
      schemaPath: new t.Name("schemaPath"),
      // also used in JTD errors
      params: new t.Name("params"),
      propertyName: new t.Name("propertyName"),
      message: new t.Name("message"),
      schema: new t.Name("schema"),
      parentSchema: new t.Name("parentSchema")
    };
    function y(m, h, p) {
      const { createErrors: v } = m.it;
      return v === !1 ? (0, t._)`{}` : d(m, h, p);
    }
    function d(m, h, p = {}) {
      const { gen: v, it: $ } = m, b = [
        f($, p),
        g(m, p)
      ];
      return _(m, h, b), v.object(...b);
    }
    function f({ errorPath: m }, { instancePath: h }) {
      const p = h ? (0, t.str)`${m}${(0, r.getErrorPath)(h, r.Type.Str)}` : m;
      return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, p)];
    }
    function g({ keyword: m, it: { errSchemaPath: h } }, { schemaPath: p, parentSchema: v }) {
      let $ = v ? h : (0, t.str)`${h}/${m}`;
      return p && ($ = (0, t.str)`${$}${(0, r.getErrorPath)(p, r.Type.Str)}`), [l.schemaPath, $];
    }
    function _(m, { params: h, message: p }, v) {
      const { keyword: $, data: b, schemaValue: E, it: I } = m, { opts: O, propertyName: q, topSchemaRef: H, schemaPath: x } = I;
      v.push([l.keyword, $], [l.params, typeof h == "function" ? h(m) : h || (0, t._)`{}`]), O.messages && v.push([l.message, typeof p == "function" ? p(m) : p]), O.verbose && v.push([l.schema, E], [l.parentSchema, (0, t._)`${H}${x}`], [n.default.data, b]), q && v.push([l.propertyName, q]);
    }
  })(Pa)), Pa;
}
var gu;
function Yg() {
  if (gu) return Jt;
  gu = 1, Object.defineProperty(Jt, "__esModule", { value: !0 }), Jt.boolOrEmptySchema = Jt.topBoolOrEmptySchema = void 0;
  const e = ua(), t = ne(), r = pt(), n = {
    message: "boolean schema is false"
  };
  function o(i) {
    const { gen: u, schema: c, validateName: l } = i;
    c === !1 ? s(i, !1) : typeof c == "object" && c.$async === !0 ? u.return(r.default.data) : (u.assign((0, t._)`${l}.errors`, null), u.return(!0));
  }
  Jt.topBoolOrEmptySchema = o;
  function a(i, u) {
    const { gen: c, schema: l } = i;
    l === !1 ? (c.var(u, !1), s(i)) : c.var(u, !0);
  }
  Jt.boolOrEmptySchema = a;
  function s(i, u) {
    const { gen: c, data: l } = i, y = {
      gen: c,
      keyword: "false schema",
      data: l,
      schema: !1,
      schemaCode: !1,
      schemaValue: !1,
      params: {},
      it: i
    };
    (0, e.reportError)(y, n, void 0, u);
  }
  return Jt;
}
var je = {}, Kt = {}, yu;
function $p() {
  if (yu) return Kt;
  yu = 1, Object.defineProperty(Kt, "__esModule", { value: !0 }), Kt.getRules = Kt.isJSONType = void 0;
  const e = ["string", "number", "integer", "boolean", "null", "object", "array"], t = new Set(e);
  function r(o) {
    return typeof o == "string" && t.has(o);
  }
  Kt.isJSONType = r;
  function n() {
    const o = {
      number: { type: "number", rules: [] },
      string: { type: "string", rules: [] },
      array: { type: "array", rules: [] },
      object: { type: "object", rules: [] }
    };
    return {
      types: { ...o, integer: !0, boolean: !0, null: !0 },
      rules: [{ rules: [] }, o.number, o.string, o.array, o.object],
      post: { rules: [] },
      all: {},
      keywords: {}
    };
  }
  return Kt.getRules = n, Kt;
}
var St = {}, vu;
function Sp() {
  if (vu) return St;
  vu = 1, Object.defineProperty(St, "__esModule", { value: !0 }), St.shouldUseRule = St.shouldUseGroup = St.schemaHasRulesForType = void 0;
  function e({ schema: n, self: o }, a) {
    const s = o.RULES.types[a];
    return s && s !== !0 && t(n, s);
  }
  St.schemaHasRulesForType = e;
  function t(n, o) {
    return o.rules.some((a) => r(n, a));
  }
  St.shouldUseGroup = t;
  function r(n, o) {
    var a;
    return n[o.keyword] !== void 0 || ((a = o.definition.implements) === null || a === void 0 ? void 0 : a.some((s) => n[s] !== void 0));
  }
  return St.shouldUseRule = r, St;
}
var _u;
function Xo() {
  if (_u) return je;
  _u = 1, Object.defineProperty(je, "__esModule", { value: !0 }), je.reportTypeError = je.checkDataTypes = je.checkDataType = je.coerceAndCheckDataType = je.getJSONTypes = je.getSchemaTypes = je.DataType = void 0;
  const e = $p(), t = Sp(), r = ua(), n = ne(), o = pe();
  var a;
  (function(p) {
    p[p.Correct = 0] = "Correct", p[p.Wrong = 1] = "Wrong";
  })(a || (je.DataType = a = {}));
  function s(p) {
    const v = i(p.type);
    if (v.includes("null")) {
      if (p.nullable === !1)
        throw new Error("type: null contradicts nullable: false");
    } else {
      if (!v.length && p.nullable !== void 0)
        throw new Error('"nullable" cannot be used without "type"');
      p.nullable === !0 && v.push("null");
    }
    return v;
  }
  je.getSchemaTypes = s;
  function i(p) {
    const v = Array.isArray(p) ? p : p ? [p] : [];
    if (v.every(e.isJSONType))
      return v;
    throw new Error("type must be JSONType or JSONType[]: " + v.join(","));
  }
  je.getJSONTypes = i;
  function u(p, v) {
    const { gen: $, data: b, opts: E } = p, I = l(v, E.coerceTypes), O = v.length > 0 && !(I.length === 0 && v.length === 1 && (0, t.schemaHasRulesForType)(p, v[0]));
    if (O) {
      const q = g(v, b, E.strictNumbers, a.Wrong);
      $.if(q, () => {
        I.length ? y(p, v, I) : m(p);
      });
    }
    return O;
  }
  je.coerceAndCheckDataType = u;
  const c = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
  function l(p, v) {
    return v ? p.filter(($) => c.has($) || v === "array" && $ === "array") : [];
  }
  function y(p, v, $) {
    const { gen: b, data: E, opts: I } = p, O = b.let("dataType", (0, n._)`typeof ${E}`), q = b.let("coerced", (0, n._)`undefined`);
    I.coerceTypes === "array" && b.if((0, n._)`${O} == 'object' && Array.isArray(${E}) && ${E}.length == 1`, () => b.assign(E, (0, n._)`${E}[0]`).assign(O, (0, n._)`typeof ${E}`).if(g(v, E, I.strictNumbers), () => b.assign(q, E))), b.if((0, n._)`${q} !== undefined`);
    for (const x of $)
      (c.has(x) || x === "array" && I.coerceTypes === "array") && H(x);
    b.else(), m(p), b.endIf(), b.if((0, n._)`${q} !== undefined`, () => {
      b.assign(E, q), d(p, q);
    });
    function H(x) {
      switch (x) {
        case "string":
          b.elseIf((0, n._)`${O} == "number" || ${O} == "boolean"`).assign(q, (0, n._)`"" + ${E}`).elseIf((0, n._)`${E} === null`).assign(q, (0, n._)`""`);
          return;
        case "number":
          b.elseIf((0, n._)`${O} == "boolean" || ${E} === null
              || (${O} == "string" && ${E} && ${E} == +${E})`).assign(q, (0, n._)`+${E}`);
          return;
        case "integer":
          b.elseIf((0, n._)`${O} === "boolean" || ${E} === null
              || (${O} === "string" && ${E} && ${E} == +${E} && !(${E} % 1))`).assign(q, (0, n._)`+${E}`);
          return;
        case "boolean":
          b.elseIf((0, n._)`${E} === "false" || ${E} === 0 || ${E} === null`).assign(q, !1).elseIf((0, n._)`${E} === "true" || ${E} === 1`).assign(q, !0);
          return;
        case "null":
          b.elseIf((0, n._)`${E} === "" || ${E} === 0 || ${E} === false`), b.assign(q, null);
          return;
        case "array":
          b.elseIf((0, n._)`${O} === "string" || ${O} === "number"
              || ${O} === "boolean" || ${E} === null`).assign(q, (0, n._)`[${E}]`);
      }
    }
  }
  function d({ gen: p, parentData: v, parentDataProperty: $ }, b) {
    p.if((0, n._)`${v} !== undefined`, () => p.assign((0, n._)`${v}[${$}]`, b));
  }
  function f(p, v, $, b = a.Correct) {
    const E = b === a.Correct ? n.operators.EQ : n.operators.NEQ;
    let I;
    switch (p) {
      case "null":
        return (0, n._)`${v} ${E} null`;
      case "array":
        I = (0, n._)`Array.isArray(${v})`;
        break;
      case "object":
        I = (0, n._)`${v} && typeof ${v} == "object" && !Array.isArray(${v})`;
        break;
      case "integer":
        I = O((0, n._)`!(${v} % 1) && !isNaN(${v})`);
        break;
      case "number":
        I = O();
        break;
      default:
        return (0, n._)`typeof ${v} ${E} ${p}`;
    }
    return b === a.Correct ? I : (0, n.not)(I);
    function O(q = n.nil) {
      return (0, n.and)((0, n._)`typeof ${v} == "number"`, q, $ ? (0, n._)`isFinite(${v})` : n.nil);
    }
  }
  je.checkDataType = f;
  function g(p, v, $, b) {
    if (p.length === 1)
      return f(p[0], v, $, b);
    let E;
    const I = (0, o.toHash)(p);
    if (I.array && I.object) {
      const O = (0, n._)`typeof ${v} != "object"`;
      E = I.null ? O : (0, n._)`!${v} || ${O}`, delete I.null, delete I.array, delete I.object;
    } else
      E = n.nil;
    I.number && delete I.integer;
    for (const O in I)
      E = (0, n.and)(E, f(O, v, $, b));
    return E;
  }
  je.checkDataTypes = g;
  const _ = {
    message: ({ schema: p }) => `must be ${p}`,
    params: ({ schema: p, schemaValue: v }) => typeof p == "string" ? (0, n._)`{type: ${p}}` : (0, n._)`{type: ${v}}`
  };
  function m(p) {
    const v = h(p);
    (0, r.reportError)(v, _);
  }
  je.reportTypeError = m;
  function h(p) {
    const { gen: v, data: $, schema: b } = p, E = (0, o.schemaRefOrVal)(p, b, "type");
    return {
      gen: v,
      keyword: "type",
      data: $,
      schema: b.type,
      schemaCode: E,
      schemaValue: E,
      parentSchema: b,
      params: {},
      it: p
    };
  }
  return je;
}
var Br = {}, bu;
function Xg() {
  if (bu) return Br;
  bu = 1, Object.defineProperty(Br, "__esModule", { value: !0 }), Br.assignDefaults = void 0;
  const e = ne(), t = pe();
  function r(o, a) {
    const { properties: s, items: i } = o.schema;
    if (a === "object" && s)
      for (const u in s)
        n(o, u, s[u].default);
    else a === "array" && Array.isArray(i) && i.forEach((u, c) => n(o, c, u.default));
  }
  Br.assignDefaults = r;
  function n(o, a, s) {
    const { gen: i, compositeRule: u, data: c, opts: l } = o;
    if (s === void 0)
      return;
    const y = (0, e._)`${c}${(0, e.getProperty)(a)}`;
    if (u) {
      (0, t.checkStrictMode)(o, `default is ignored for: ${y}`);
      return;
    }
    let d = (0, e._)`${y} === undefined`;
    l.useDefaults === "empty" && (d = (0, e._)`${d} || ${y} === null || ${y} === ""`), i.if(d, (0, e._)`${y} = ${(0, e.stringify)(s)}`);
  }
  return Br;
}
var at = {}, me = {}, wu;
function ht() {
  if (wu) return me;
  wu = 1, Object.defineProperty(me, "__esModule", { value: !0 }), me.validateUnion = me.validateArray = me.usePattern = me.callValidateCode = me.schemaProperties = me.allSchemaProperties = me.noPropertyInData = me.propertyInData = me.isOwnProperty = me.hasPropFunc = me.reportMissingProp = me.checkMissingProp = me.checkReportMissingProp = void 0;
  const e = ne(), t = pe(), r = pt(), n = pe();
  function o(p, v) {
    const { gen: $, data: b, it: E } = p;
    $.if(l($, b, v, E.opts.ownProperties), () => {
      p.setParams({ missingProperty: (0, e._)`${v}` }, !0), p.error();
    });
  }
  me.checkReportMissingProp = o;
  function a({ gen: p, data: v, it: { opts: $ } }, b, E) {
    return (0, e.or)(...b.map((I) => (0, e.and)(l(p, v, I, $.ownProperties), (0, e._)`${E} = ${I}`)));
  }
  me.checkMissingProp = a;
  function s(p, v) {
    p.setParams({ missingProperty: v }, !0), p.error();
  }
  me.reportMissingProp = s;
  function i(p) {
    return p.scopeValue("func", {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      ref: Object.prototype.hasOwnProperty,
      code: (0, e._)`Object.prototype.hasOwnProperty`
    });
  }
  me.hasPropFunc = i;
  function u(p, v, $) {
    return (0, e._)`${i(p)}.call(${v}, ${$})`;
  }
  me.isOwnProperty = u;
  function c(p, v, $, b) {
    const E = (0, e._)`${v}${(0, e.getProperty)($)} !== undefined`;
    return b ? (0, e._)`${E} && ${u(p, v, $)}` : E;
  }
  me.propertyInData = c;
  function l(p, v, $, b) {
    const E = (0, e._)`${v}${(0, e.getProperty)($)} === undefined`;
    return b ? (0, e.or)(E, (0, e.not)(u(p, v, $))) : E;
  }
  me.noPropertyInData = l;
  function y(p) {
    return p ? Object.keys(p).filter((v) => v !== "__proto__") : [];
  }
  me.allSchemaProperties = y;
  function d(p, v) {
    return y(v).filter(($) => !(0, t.alwaysValidSchema)(p, v[$]));
  }
  me.schemaProperties = d;
  function f({ schemaCode: p, data: v, it: { gen: $, topSchemaRef: b, schemaPath: E, errorPath: I }, it: O }, q, H, x) {
    const W = x ? (0, e._)`${p}, ${v}, ${b}${E}` : v, K = [
      [r.default.instancePath, (0, e.strConcat)(r.default.instancePath, I)],
      [r.default.parentData, O.parentData],
      [r.default.parentDataProperty, O.parentDataProperty],
      [r.default.rootData, r.default.rootData]
    ];
    O.opts.dynamicRef && K.push([r.default.dynamicAnchors, r.default.dynamicAnchors]);
    const M = (0, e._)`${W}, ${$.object(...K)}`;
    return H !== e.nil ? (0, e._)`${q}.call(${H}, ${M})` : (0, e._)`${q}(${M})`;
  }
  me.callValidateCode = f;
  const g = (0, e._)`new RegExp`;
  function _({ gen: p, it: { opts: v } }, $) {
    const b = v.unicodeRegExp ? "u" : "", { regExp: E } = v.code, I = E($, b);
    return p.scopeValue("pattern", {
      key: I.toString(),
      ref: I,
      code: (0, e._)`${E.code === "new RegExp" ? g : (0, n.useFunc)(p, E)}(${$}, ${b})`
    });
  }
  me.usePattern = _;
  function m(p) {
    const { gen: v, data: $, keyword: b, it: E } = p, I = v.name("valid");
    if (E.allErrors) {
      const q = v.let("valid", !0);
      return O(() => v.assign(q, !1)), q;
    }
    return v.var(I, !0), O(() => v.break()), I;
    function O(q) {
      const H = v.const("len", (0, e._)`${$}.length`);
      v.forRange("i", 0, H, (x) => {
        p.subschema({
          keyword: b,
          dataProp: x,
          dataPropType: t.Type.Num
        }, I), v.if((0, e.not)(I), q);
      });
    }
  }
  me.validateArray = m;
  function h(p) {
    const { gen: v, schema: $, keyword: b, it: E } = p;
    if (!Array.isArray($))
      throw new Error("ajv implementation error");
    if ($.some((H) => (0, t.alwaysValidSchema)(E, H)) && !E.opts.unevaluated)
      return;
    const O = v.let("valid", !1), q = v.name("_valid");
    v.block(() => $.forEach((H, x) => {
      const W = p.subschema({
        keyword: b,
        schemaProp: x,
        compositeRule: !0
      }, q);
      v.assign(O, (0, e._)`${O} || ${q}`), p.mergeValidEvaluated(W, q) || v.if((0, e.not)(O));
    })), p.result(O, () => p.reset(), () => p.error(!0));
  }
  return me.validateUnion = h, me;
}
var Eu;
function Qg() {
  if (Eu) return at;
  Eu = 1, Object.defineProperty(at, "__esModule", { value: !0 }), at.validateKeywordUsage = at.validSchemaType = at.funcKeywordCode = at.macroKeywordCode = void 0;
  const e = ne(), t = pt(), r = ht(), n = ua();
  function o(d, f) {
    const { gen: g, keyword: _, schema: m, parentSchema: h, it: p } = d, v = f.macro.call(p.self, m, h, p), $ = c(g, _, v);
    p.opts.validateSchema !== !1 && p.self.validateSchema(v, !0);
    const b = g.name("valid");
    d.subschema({
      schema: v,
      schemaPath: e.nil,
      errSchemaPath: `${p.errSchemaPath}/${_}`,
      topSchemaRef: $,
      compositeRule: !0
    }, b), d.pass(b, () => d.error(!0));
  }
  at.macroKeywordCode = o;
  function a(d, f) {
    var g;
    const { gen: _, keyword: m, schema: h, parentSchema: p, $data: v, it: $ } = d;
    u($, f);
    const b = !v && f.compile ? f.compile.call($.self, h, p, $) : f.validate, E = c(_, m, b), I = _.let("valid");
    d.block$data(I, O), d.ok((g = f.valid) !== null && g !== void 0 ? g : I);
    function O() {
      if (f.errors === !1)
        x(), f.modifying && s(d), W(() => d.error());
      else {
        const K = f.async ? q() : H();
        f.modifying && s(d), W(() => i(d, K));
      }
    }
    function q() {
      const K = _.let("ruleErrs", null);
      return _.try(() => x((0, e._)`await `), (M) => _.assign(I, !1).if((0, e._)`${M} instanceof ${$.ValidationError}`, () => _.assign(K, (0, e._)`${M}.errors`), () => _.throw(M))), K;
    }
    function H() {
      const K = (0, e._)`${E}.errors`;
      return _.assign(K, null), x(e.nil), K;
    }
    function x(K = f.async ? (0, e._)`await ` : e.nil) {
      const M = $.opts.passContext ? t.default.this : t.default.self, L = !("compile" in f && !v || f.schema === !1);
      _.assign(I, (0, e._)`${K}${(0, r.callValidateCode)(d, E, M, L)}`, f.modifying);
    }
    function W(K) {
      var M;
      _.if((0, e.not)((M = f.valid) !== null && M !== void 0 ? M : I), K);
    }
  }
  at.funcKeywordCode = a;
  function s(d) {
    const { gen: f, data: g, it: _ } = d;
    f.if(_.parentData, () => f.assign(g, (0, e._)`${_.parentData}[${_.parentDataProperty}]`));
  }
  function i(d, f) {
    const { gen: g } = d;
    g.if((0, e._)`Array.isArray(${f})`, () => {
      g.assign(t.default.vErrors, (0, e._)`${t.default.vErrors} === null ? ${f} : ${t.default.vErrors}.concat(${f})`).assign(t.default.errors, (0, e._)`${t.default.vErrors}.length`), (0, n.extendErrors)(d);
    }, () => d.error());
  }
  function u({ schemaEnv: d }, f) {
    if (f.async && !d.$async)
      throw new Error("async keyword in sync schema");
  }
  function c(d, f, g) {
    if (g === void 0)
      throw new Error(`keyword "${f}" failed to compile`);
    return d.scopeValue("keyword", typeof g == "function" ? { ref: g } : { ref: g, code: (0, e.stringify)(g) });
  }
  function l(d, f, g = !1) {
    return !f.length || f.some((_) => _ === "array" ? Array.isArray(d) : _ === "object" ? d && typeof d == "object" && !Array.isArray(d) : typeof d == _ || g && typeof d > "u");
  }
  at.validSchemaType = l;
  function y({ schema: d, opts: f, self: g, errSchemaPath: _ }, m, h) {
    if (Array.isArray(m.keyword) ? !m.keyword.includes(h) : m.keyword !== h)
      throw new Error("ajv implementation error");
    const p = m.dependencies;
    if (p != null && p.some((v) => !Object.prototype.hasOwnProperty.call(d, v)))
      throw new Error(`parent schema must have dependencies of ${h}: ${p.join(",")}`);
    if (m.validateSchema && !m.validateSchema(d[h])) {
      const $ = `keyword "${h}" value is invalid at path "${_}": ` + g.errorsText(m.validateSchema.errors);
      if (f.validateSchema === "log")
        g.logger.error($);
      else
        throw new Error($);
    }
  }
  return at.validateKeywordUsage = y, at;
}
var It = {}, $u;
function ey() {
  if ($u) return It;
  $u = 1, Object.defineProperty(It, "__esModule", { value: !0 }), It.extendSubschemaMode = It.extendSubschemaData = It.getSubschema = void 0;
  const e = ne(), t = pe();
  function r(a, { keyword: s, schemaProp: i, schema: u, schemaPath: c, errSchemaPath: l, topSchemaRef: y }) {
    if (s !== void 0 && u !== void 0)
      throw new Error('both "keyword" and "schema" passed, only one allowed');
    if (s !== void 0) {
      const d = a.schema[s];
      return i === void 0 ? {
        schema: d,
        schemaPath: (0, e._)`${a.schemaPath}${(0, e.getProperty)(s)}`,
        errSchemaPath: `${a.errSchemaPath}/${s}`
      } : {
        schema: d[i],
        schemaPath: (0, e._)`${a.schemaPath}${(0, e.getProperty)(s)}${(0, e.getProperty)(i)}`,
        errSchemaPath: `${a.errSchemaPath}/${s}/${(0, t.escapeFragment)(i)}`
      };
    }
    if (u !== void 0) {
      if (c === void 0 || l === void 0 || y === void 0)
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return {
        schema: u,
        schemaPath: c,
        topSchemaRef: y,
        errSchemaPath: l
      };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  It.getSubschema = r;
  function n(a, s, { dataProp: i, dataPropType: u, data: c, dataTypes: l, propertyName: y }) {
    if (c !== void 0 && i !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    const { gen: d } = s;
    if (i !== void 0) {
      const { errorPath: g, dataPathArr: _, opts: m } = s, h = d.let("data", (0, e._)`${s.data}${(0, e.getProperty)(i)}`, !0);
      f(h), a.errorPath = (0, e.str)`${g}${(0, t.getErrorPath)(i, u, m.jsPropertySyntax)}`, a.parentDataProperty = (0, e._)`${i}`, a.dataPathArr = [..._, a.parentDataProperty];
    }
    if (c !== void 0) {
      const g = c instanceof e.Name ? c : d.let("data", c, !0);
      f(g), y !== void 0 && (a.propertyName = y);
    }
    l && (a.dataTypes = l);
    function f(g) {
      a.data = g, a.dataLevel = s.dataLevel + 1, a.dataTypes = [], s.definedProperties = /* @__PURE__ */ new Set(), a.parentData = s.data, a.dataNames = [...s.dataNames, g];
    }
  }
  It.extendSubschemaData = n;
  function o(a, { jtdDiscriminator: s, jtdMetadata: i, compositeRule: u, createErrors: c, allErrors: l }) {
    u !== void 0 && (a.compositeRule = u), c !== void 0 && (a.createErrors = c), l !== void 0 && (a.allErrors = l), a.jtdDiscriminator = s, a.jtdMetadata = i;
  }
  return It.extendSubschemaMode = o, It;
}
var Ze = {}, Ca, Su;
function Ip() {
  return Su || (Su = 1, Ca = function e(t, r) {
    if (t === r) return !0;
    if (t && r && typeof t == "object" && typeof r == "object") {
      if (t.constructor !== r.constructor) return !1;
      var n, o, a;
      if (Array.isArray(t)) {
        if (n = t.length, n != r.length) return !1;
        for (o = n; o-- !== 0; )
          if (!e(t[o], r[o])) return !1;
        return !0;
      }
      if (t.constructor === RegExp) return t.source === r.source && t.flags === r.flags;
      if (t.valueOf !== Object.prototype.valueOf) return t.valueOf() === r.valueOf();
      if (t.toString !== Object.prototype.toString) return t.toString() === r.toString();
      if (a = Object.keys(t), n = a.length, n !== Object.keys(r).length) return !1;
      for (o = n; o-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(r, a[o])) return !1;
      for (o = n; o-- !== 0; ) {
        var s = a[o];
        if (!e(t[s], r[s])) return !1;
      }
      return !0;
    }
    return t !== t && r !== r;
  }), Ca;
}
var ja = { exports: {} }, Iu;
function ty() {
  if (Iu) return ja.exports;
  Iu = 1;
  var e = ja.exports = function(n, o, a) {
    typeof o == "function" && (a = o, o = {}), a = o.cb || a;
    var s = typeof a == "function" ? a : a.pre || function() {
    }, i = a.post || function() {
    };
    t(o, s, i, n, "", n);
  };
  e.keywords = {
    additionalItems: !0,
    items: !0,
    contains: !0,
    additionalProperties: !0,
    propertyNames: !0,
    not: !0,
    if: !0,
    then: !0,
    else: !0
  }, e.arrayKeywords = {
    items: !0,
    allOf: !0,
    anyOf: !0,
    oneOf: !0
  }, e.propsKeywords = {
    $defs: !0,
    definitions: !0,
    properties: !0,
    patternProperties: !0,
    dependencies: !0
  }, e.skipKeywords = {
    default: !0,
    enum: !0,
    const: !0,
    required: !0,
    maximum: !0,
    minimum: !0,
    exclusiveMaximum: !0,
    exclusiveMinimum: !0,
    multipleOf: !0,
    maxLength: !0,
    minLength: !0,
    pattern: !0,
    format: !0,
    maxItems: !0,
    minItems: !0,
    uniqueItems: !0,
    maxProperties: !0,
    minProperties: !0
  };
  function t(n, o, a, s, i, u, c, l, y, d) {
    if (s && typeof s == "object" && !Array.isArray(s)) {
      o(s, i, u, c, l, y, d);
      for (var f in s) {
        var g = s[f];
        if (Array.isArray(g)) {
          if (f in e.arrayKeywords)
            for (var _ = 0; _ < g.length; _++)
              t(n, o, a, g[_], i + "/" + f + "/" + _, u, i, f, s, _);
        } else if (f in e.propsKeywords) {
          if (g && typeof g == "object")
            for (var m in g)
              t(n, o, a, g[m], i + "/" + f + "/" + r(m), u, i, f, s, m);
        } else (f in e.keywords || n.allKeys && !(f in e.skipKeywords)) && t(n, o, a, g, i + "/" + f, u, i, f, s);
      }
      a(s, i, u, c, l, y, d);
    }
  }
  function r(n) {
    return n.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  return ja.exports;
}
var Tu;
function ca() {
  if (Tu) return Ze;
  Tu = 1, Object.defineProperty(Ze, "__esModule", { value: !0 }), Ze.getSchemaRefs = Ze.resolveUrl = Ze.normalizeId = Ze._getFullPath = Ze.getFullPath = Ze.inlineRef = void 0;
  const e = pe(), t = Ip(), r = ty(), n = /* @__PURE__ */ new Set([
    "type",
    "format",
    "pattern",
    "maxLength",
    "minLength",
    "maxProperties",
    "minProperties",
    "maxItems",
    "minItems",
    "maximum",
    "minimum",
    "uniqueItems",
    "multipleOf",
    "required",
    "enum",
    "const"
  ]);
  function o(_, m = !0) {
    return typeof _ == "boolean" ? !0 : m === !0 ? !s(_) : m ? i(_) <= m : !1;
  }
  Ze.inlineRef = o;
  const a = /* @__PURE__ */ new Set([
    "$ref",
    "$recursiveRef",
    "$recursiveAnchor",
    "$dynamicRef",
    "$dynamicAnchor"
  ]);
  function s(_) {
    for (const m in _) {
      if (a.has(m))
        return !0;
      const h = _[m];
      if (Array.isArray(h) && h.some(s) || typeof h == "object" && s(h))
        return !0;
    }
    return !1;
  }
  function i(_) {
    let m = 0;
    for (const h in _) {
      if (h === "$ref")
        return 1 / 0;
      if (m++, !n.has(h) && (typeof _[h] == "object" && (0, e.eachItem)(_[h], (p) => m += i(p)), m === 1 / 0))
        return 1 / 0;
    }
    return m;
  }
  function u(_, m = "", h) {
    h !== !1 && (m = y(m));
    const p = _.parse(m);
    return c(_, p);
  }
  Ze.getFullPath = u;
  function c(_, m) {
    return _.serialize(m).split("#")[0] + "#";
  }
  Ze._getFullPath = c;
  const l = /#\/?$/;
  function y(_) {
    return _ ? _.replace(l, "") : "";
  }
  Ze.normalizeId = y;
  function d(_, m, h) {
    return h = y(h), _.resolve(m, h);
  }
  Ze.resolveUrl = d;
  const f = /^[a-z_][-a-z0-9._]*$/i;
  function g(_, m) {
    if (typeof _ == "boolean")
      return {};
    const { schemaId: h, uriResolver: p } = this.opts, v = y(_[h] || m), $ = { "": v }, b = u(p, v, !1), E = {}, I = /* @__PURE__ */ new Set();
    return r(_, { allKeys: !0 }, (H, x, W, K) => {
      if (K === void 0)
        return;
      const M = b + x;
      let L = $[K];
      typeof H[h] == "string" && (L = F.call(this, H[h])), G.call(this, H.$anchor), G.call(this, H.$dynamicAnchor), $[x] = L;
      function F(B) {
        const Q = this.opts.uriResolver.resolve;
        if (B = y(L ? Q(L, B) : B), I.has(B))
          throw q(B);
        I.add(B);
        let D = this.refs[B];
        return typeof D == "string" && (D = this.refs[D]), typeof D == "object" ? O(H, D.schema, B) : B !== y(M) && (B[0] === "#" ? (O(H, E[B], B), E[B] = H) : this.refs[B] = M), B;
      }
      function G(B) {
        if (typeof B == "string") {
          if (!f.test(B))
            throw new Error(`invalid anchor "${B}"`);
          F.call(this, `#${B}`);
        }
      }
    }), E;
    function O(H, x, W) {
      if (x !== void 0 && !t(H, x))
        throw q(W);
    }
    function q(H) {
      return new Error(`reference "${H}" resolves to more than one schema`);
    }
  }
  return Ze.getSchemaRefs = g, Ze;
}
var Ou;
function Nn() {
  if (Ou) return $t;
  Ou = 1, Object.defineProperty($t, "__esModule", { value: !0 }), $t.getData = $t.KeywordCxt = $t.validateFunctionCode = void 0;
  const e = Yg(), t = Xo(), r = Sp(), n = Xo(), o = Xg(), a = Qg(), s = ey(), i = ne(), u = pt(), c = ca(), l = pe(), y = ua();
  function d(N) {
    if (b(N) && (I(N), $(N))) {
      m(N);
      return;
    }
    f(N, () => (0, e.topBoolOrEmptySchema)(N));
  }
  $t.validateFunctionCode = d;
  function f({ gen: N, validateName: j, schema: U, schemaEnv: J, opts: te }, se) {
    te.code.es5 ? N.func(j, (0, i._)`${u.default.data}, ${u.default.valCxt}`, J.$async, () => {
      N.code((0, i._)`"use strict"; ${p(U, te)}`), _(N, te), N.code(se);
    }) : N.func(j, (0, i._)`${u.default.data}, ${g(te)}`, J.$async, () => N.code(p(U, te)).code(se));
  }
  function g(N) {
    return (0, i._)`{${u.default.instancePath}="", ${u.default.parentData}, ${u.default.parentDataProperty}, ${u.default.rootData}=${u.default.data}${N.dynamicRef ? (0, i._)`, ${u.default.dynamicAnchors}={}` : i.nil}}={}`;
  }
  function _(N, j) {
    N.if(u.default.valCxt, () => {
      N.var(u.default.instancePath, (0, i._)`${u.default.valCxt}.${u.default.instancePath}`), N.var(u.default.parentData, (0, i._)`${u.default.valCxt}.${u.default.parentData}`), N.var(u.default.parentDataProperty, (0, i._)`${u.default.valCxt}.${u.default.parentDataProperty}`), N.var(u.default.rootData, (0, i._)`${u.default.valCxt}.${u.default.rootData}`), j.dynamicRef && N.var(u.default.dynamicAnchors, (0, i._)`${u.default.valCxt}.${u.default.dynamicAnchors}`);
    }, () => {
      N.var(u.default.instancePath, (0, i._)`""`), N.var(u.default.parentData, (0, i._)`undefined`), N.var(u.default.parentDataProperty, (0, i._)`undefined`), N.var(u.default.rootData, u.default.data), j.dynamicRef && N.var(u.default.dynamicAnchors, (0, i._)`{}`);
    });
  }
  function m(N) {
    const { schema: j, opts: U, gen: J } = N;
    f(N, () => {
      U.$comment && j.$comment && K(N), H(N), J.let(u.default.vErrors, null), J.let(u.default.errors, 0), U.unevaluated && h(N), O(N), M(N);
    });
  }
  function h(N) {
    const { gen: j, validateName: U } = N;
    N.evaluated = j.const("evaluated", (0, i._)`${U}.evaluated`), j.if((0, i._)`${N.evaluated}.dynamicProps`, () => j.assign((0, i._)`${N.evaluated}.props`, (0, i._)`undefined`)), j.if((0, i._)`${N.evaluated}.dynamicItems`, () => j.assign((0, i._)`${N.evaluated}.items`, (0, i._)`undefined`));
  }
  function p(N, j) {
    const U = typeof N == "object" && N[j.schemaId];
    return U && (j.code.source || j.code.process) ? (0, i._)`/*# sourceURL=${U} */` : i.nil;
  }
  function v(N, j) {
    if (b(N) && (I(N), $(N))) {
      E(N, j);
      return;
    }
    (0, e.boolOrEmptySchema)(N, j);
  }
  function $({ schema: N, self: j }) {
    if (typeof N == "boolean")
      return !N;
    for (const U in N)
      if (j.RULES.all[U])
        return !0;
    return !1;
  }
  function b(N) {
    return typeof N.schema != "boolean";
  }
  function E(N, j) {
    const { schema: U, gen: J, opts: te } = N;
    te.$comment && U.$comment && K(N), x(N), W(N);
    const se = J.const("_errs", u.default.errors);
    O(N, se), J.var(j, (0, i._)`${se} === ${u.default.errors}`);
  }
  function I(N) {
    (0, l.checkUnknownRules)(N), q(N);
  }
  function O(N, j) {
    if (N.opts.jtd)
      return F(N, [], !1, j);
    const U = (0, t.getSchemaTypes)(N.schema), J = (0, t.coerceAndCheckDataType)(N, U);
    F(N, U, !J, j);
  }
  function q(N) {
    const { schema: j, errSchemaPath: U, opts: J, self: te } = N;
    j.$ref && J.ignoreKeywordsWithRef && (0, l.schemaHasRulesButRef)(j, te.RULES) && te.logger.warn(`$ref: keywords ignored in schema at path "${U}"`);
  }
  function H(N) {
    const { schema: j, opts: U } = N;
    j.default !== void 0 && U.useDefaults && U.strictSchema && (0, l.checkStrictMode)(N, "default is ignored in the schema root");
  }
  function x(N) {
    const j = N.schema[N.opts.schemaId];
    j && (N.baseId = (0, c.resolveUrl)(N.opts.uriResolver, N.baseId, j));
  }
  function W(N) {
    if (N.schema.$async && !N.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function K({ gen: N, schemaEnv: j, schema: U, errSchemaPath: J, opts: te }) {
    const se = U.$comment;
    if (te.$comment === !0)
      N.code((0, i._)`${u.default.self}.logger.log(${se})`);
    else if (typeof te.$comment == "function") {
      const Te = (0, i.str)`${J}/$comment`, Ue = N.scopeValue("root", { ref: j.root });
      N.code((0, i._)`${u.default.self}.opts.$comment(${se}, ${Te}, ${Ue}.schema)`);
    }
  }
  function M(N) {
    const { gen: j, schemaEnv: U, validateName: J, ValidationError: te, opts: se } = N;
    U.$async ? j.if((0, i._)`${u.default.errors} === 0`, () => j.return(u.default.data), () => j.throw((0, i._)`new ${te}(${u.default.vErrors})`)) : (j.assign((0, i._)`${J}.errors`, u.default.vErrors), se.unevaluated && L(N), j.return((0, i._)`${u.default.errors} === 0`));
  }
  function L({ gen: N, evaluated: j, props: U, items: J }) {
    U instanceof i.Name && N.assign((0, i._)`${j}.props`, U), J instanceof i.Name && N.assign((0, i._)`${j}.items`, J);
  }
  function F(N, j, U, J) {
    const { gen: te, schema: se, data: Te, allErrors: Ue, opts: Pe, self: xe } = N, { RULES: Re } = xe;
    if (se.$ref && (Pe.ignoreKeywordsWithRef || !(0, l.schemaHasRulesButRef)(se, Re))) {
      te.block(() => Y(N, "$ref", Re.all.$ref.definition));
      return;
    }
    Pe.jtd || B(N, j), te.block(() => {
      for (const fe of Re.rules)
        wt(fe);
      wt(Re.post);
    });
    function wt(fe) {
      (0, r.shouldUseGroup)(se, fe) && (fe.type ? (te.if((0, n.checkDataType)(fe.type, Te, Pe.strictNumbers)), G(N, fe), j.length === 1 && j[0] === fe.type && U && (te.else(), (0, n.reportTypeError)(N)), te.endIf()) : G(N, fe), Ue || te.if((0, i._)`${u.default.errors} === ${J || 0}`));
    }
  }
  function G(N, j) {
    const { gen: U, schema: J, opts: { useDefaults: te } } = N;
    te && (0, o.assignDefaults)(N, j.type), U.block(() => {
      for (const se of j.rules)
        (0, r.shouldUseRule)(J, se) && Y(N, se.keyword, se.definition, j.type);
    });
  }
  function B(N, j) {
    N.schemaEnv.meta || !N.opts.strictTypes || (Q(N, j), N.opts.allowUnionTypes || D(N, j), P(N, N.dataTypes));
  }
  function Q(N, j) {
    if (j.length) {
      if (!N.dataTypes.length) {
        N.dataTypes = j;
        return;
      }
      j.forEach((U) => {
        k(N.dataTypes, U) || w(N, `type "${U}" not allowed by context "${N.dataTypes.join(",")}"`);
      }), S(N, j);
    }
  }
  function D(N, j) {
    j.length > 1 && !(j.length === 2 && j.includes("null")) && w(N, "use allowUnionTypes to allow union type keyword");
  }
  function P(N, j) {
    const U = N.self.RULES.all;
    for (const J in U) {
      const te = U[J];
      if (typeof te == "object" && (0, r.shouldUseRule)(N.schema, te)) {
        const { type: se } = te.definition;
        se.length && !se.some((Te) => C(j, Te)) && w(N, `missing type "${se.join(",")}" for keyword "${J}"`);
      }
    }
  }
  function C(N, j) {
    return N.includes(j) || j === "number" && N.includes("integer");
  }
  function k(N, j) {
    return N.includes(j) || j === "integer" && N.includes("number");
  }
  function S(N, j) {
    const U = [];
    for (const J of N.dataTypes)
      k(j, J) ? U.push(J) : j.includes("integer") && J === "number" && U.push("integer");
    N.dataTypes = U;
  }
  function w(N, j) {
    const U = N.schemaEnv.baseId + N.errSchemaPath;
    j += ` at "${U}" (strictTypes)`, (0, l.checkStrictMode)(N, j, N.opts.strictTypes);
  }
  class A {
    constructor(j, U, J) {
      if ((0, a.validateKeywordUsage)(j, U, J), this.gen = j.gen, this.allErrors = j.allErrors, this.keyword = J, this.data = j.data, this.schema = j.schema[J], this.$data = U.$data && j.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, l.schemaRefOrVal)(j, this.schema, J, this.$data), this.schemaType = U.schemaType, this.parentSchema = j.schema, this.params = {}, this.it = j, this.def = U, this.$data)
        this.schemaCode = j.gen.const("vSchema", ae(this.$data, j));
      else if (this.schemaCode = this.schemaValue, !(0, a.validSchemaType)(this.schema, U.schemaType, U.allowUndefined))
        throw new Error(`${J} value must be ${JSON.stringify(U.schemaType)}`);
      ("code" in U ? U.trackErrors : U.errors !== !1) && (this.errsCount = j.gen.const("_errs", u.default.errors));
    }
    result(j, U, J) {
      this.failResult((0, i.not)(j), U, J);
    }
    failResult(j, U, J) {
      this.gen.if(j), J ? J() : this.error(), U ? (this.gen.else(), U(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    pass(j, U) {
      this.failResult((0, i.not)(j), void 0, U);
    }
    fail(j) {
      if (j === void 0) {
        this.error(), this.allErrors || this.gen.if(!1);
        return;
      }
      this.gen.if(j), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    fail$data(j) {
      if (!this.$data)
        return this.fail(j);
      const { schemaCode: U } = this;
      this.fail((0, i._)`${U} !== undefined && (${(0, i.or)(this.invalid$data(), j)})`);
    }
    error(j, U, J) {
      if (U) {
        this.setParams(U), this._error(j, J), this.setParams({});
        return;
      }
      this._error(j, J);
    }
    _error(j, U) {
      (j ? y.reportExtraError : y.reportError)(this, this.def.error, U);
    }
    $dataError() {
      (0, y.reportError)(this, this.def.$dataError || y.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0)
        throw new Error('add "trackErrors" to keyword definition');
      (0, y.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(j) {
      this.allErrors || this.gen.if(j);
    }
    setParams(j, U) {
      U ? Object.assign(this.params, j) : this.params = j;
    }
    block$data(j, U, J = i.nil) {
      this.gen.block(() => {
        this.check$data(j, J), U();
      });
    }
    check$data(j = i.nil, U = i.nil) {
      if (!this.$data)
        return;
      const { gen: J, schemaCode: te, schemaType: se, def: Te } = this;
      J.if((0, i.or)((0, i._)`${te} === undefined`, U)), j !== i.nil && J.assign(j, !0), (se.length || Te.validateSchema) && (J.elseIf(this.invalid$data()), this.$dataError(), j !== i.nil && J.assign(j, !1)), J.else();
    }
    invalid$data() {
      const { gen: j, schemaCode: U, schemaType: J, def: te, it: se } = this;
      return (0, i.or)(Te(), Ue());
      function Te() {
        if (J.length) {
          if (!(U instanceof i.Name))
            throw new Error("ajv implementation error");
          const Pe = Array.isArray(J) ? J : [J];
          return (0, i._)`${(0, n.checkDataTypes)(Pe, U, se.opts.strictNumbers, n.DataType.Wrong)}`;
        }
        return i.nil;
      }
      function Ue() {
        if (te.validateSchema) {
          const Pe = j.scopeValue("validate$data", { ref: te.validateSchema });
          return (0, i._)`!${Pe}(${U})`;
        }
        return i.nil;
      }
    }
    subschema(j, U) {
      const J = (0, s.getSubschema)(this.it, j);
      (0, s.extendSubschemaData)(J, this.it, j), (0, s.extendSubschemaMode)(J, j);
      const te = { ...this.it, ...J, items: void 0, props: void 0 };
      return v(te, U), te;
    }
    mergeEvaluated(j, U) {
      const { it: J, gen: te } = this;
      J.opts.unevaluated && (J.props !== !0 && j.props !== void 0 && (J.props = l.mergeEvaluated.props(te, j.props, J.props, U)), J.items !== !0 && j.items !== void 0 && (J.items = l.mergeEvaluated.items(te, j.items, J.items, U)));
    }
    mergeValidEvaluated(j, U) {
      const { it: J, gen: te } = this;
      if (J.opts.unevaluated && (J.props !== !0 || J.items !== !0))
        return te.if(U, () => this.mergeEvaluated(j, i.Name)), !0;
    }
  }
  $t.KeywordCxt = A;
  function Y(N, j, U, J) {
    const te = new A(N, U, j);
    "code" in U ? U.code(te, J) : te.$data && U.validate ? (0, a.funcKeywordCode)(te, U) : "macro" in U ? (0, a.macroKeywordCode)(te, U) : (U.compile || U.validate) && (0, a.funcKeywordCode)(te, U);
  }
  const X = /^\/(?:[^~]|~0|~1)*$/, le = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function ae(N, { dataLevel: j, dataNames: U, dataPathArr: J }) {
    let te, se;
    if (N === "")
      return u.default.rootData;
    if (N[0] === "/") {
      if (!X.test(N))
        throw new Error(`Invalid JSON-pointer: ${N}`);
      te = N, se = u.default.rootData;
    } else {
      const xe = le.exec(N);
      if (!xe)
        throw new Error(`Invalid JSON-pointer: ${N}`);
      const Re = +xe[1];
      if (te = xe[2], te === "#") {
        if (Re >= j)
          throw new Error(Pe("property/index", Re));
        return J[j - Re];
      }
      if (Re > j)
        throw new Error(Pe("data", Re));
      if (se = U[j - Re], !te)
        return se;
    }
    let Te = se;
    const Ue = te.split("/");
    for (const xe of Ue)
      xe && (se = (0, i._)`${se}${(0, i.getProperty)((0, l.unescapeJsonPointer)(xe))}`, Te = (0, i._)`${Te} && ${se}`);
    return Te;
    function Pe(xe, Re) {
      return `Cannot access ${xe} ${Re} levels up, current level is ${j}`;
    }
  }
  return $t.getData = ae, $t;
}
var Vn = {}, Ru;
function la() {
  if (Ru) return Vn;
  Ru = 1, Object.defineProperty(Vn, "__esModule", { value: !0 });
  class e extends Error {
    constructor(r) {
      super("validation failed"), this.errors = r, this.ajv = this.validation = !0;
    }
  }
  return Vn.default = e, Vn;
}
var Un = {}, Pu;
function An() {
  if (Pu) return Un;
  Pu = 1, Object.defineProperty(Un, "__esModule", { value: !0 });
  const e = ca();
  class t extends Error {
    constructor(n, o, a, s) {
      super(s || `can't resolve reference ${a} from id ${o}`), this.missingRef = (0, e.resolveUrl)(n, o, a), this.missingSchema = (0, e.normalizeId)((0, e.getFullPath)(n, this.missingRef));
    }
  }
  return Un.default = t, Un;
}
var Xe = {}, ku;
function da() {
  if (ku) return Xe;
  ku = 1, Object.defineProperty(Xe, "__esModule", { value: !0 }), Xe.resolveSchema = Xe.getCompilingSchema = Xe.resolveRef = Xe.compileSchema = Xe.SchemaEnv = void 0;
  const e = ne(), t = la(), r = pt(), n = ca(), o = pe(), a = Nn();
  class s {
    constructor(h) {
      var p;
      this.refs = {}, this.dynamicAnchors = {};
      let v;
      typeof h.schema == "object" && (v = h.schema), this.schema = h.schema, this.schemaId = h.schemaId, this.root = h.root || this, this.baseId = (p = h.baseId) !== null && p !== void 0 ? p : (0, n.normalizeId)(v == null ? void 0 : v[h.schemaId || "$id"]), this.schemaPath = h.schemaPath, this.localRefs = h.localRefs, this.meta = h.meta, this.$async = v == null ? void 0 : v.$async, this.refs = {};
    }
  }
  Xe.SchemaEnv = s;
  function i(m) {
    const h = l.call(this, m);
    if (h)
      return h;
    const p = (0, n.getFullPath)(this.opts.uriResolver, m.root.baseId), { es5: v, lines: $ } = this.opts.code, { ownProperties: b } = this.opts, E = new e.CodeGen(this.scope, { es5: v, lines: $, ownProperties: b });
    let I;
    m.$async && (I = E.scopeValue("Error", {
      ref: t.default,
      code: (0, e._)`require("ajv/dist/runtime/validation_error").default`
    }));
    const O = E.scopeName("validate");
    m.validateName = O;
    const q = {
      gen: E,
      allErrors: this.opts.allErrors,
      data: r.default.data,
      parentData: r.default.parentData,
      parentDataProperty: r.default.parentDataProperty,
      dataNames: [r.default.data],
      dataPathArr: [e.nil],
      // TODO can its length be used as dataLevel if nil is removed?
      dataLevel: 0,
      dataTypes: [],
      definedProperties: /* @__PURE__ */ new Set(),
      topSchemaRef: E.scopeValue("schema", this.opts.code.source === !0 ? { ref: m.schema, code: (0, e.stringify)(m.schema) } : { ref: m.schema }),
      validateName: O,
      ValidationError: I,
      schema: m.schema,
      schemaEnv: m,
      rootId: p,
      baseId: m.baseId || p,
      schemaPath: e.nil,
      errSchemaPath: m.schemaPath || (this.opts.jtd ? "" : "#"),
      errorPath: (0, e._)`""`,
      opts: this.opts,
      self: this
    };
    let H;
    try {
      this._compilations.add(m), (0, a.validateFunctionCode)(q), E.optimize(this.opts.code.optimize);
      const x = E.toString();
      H = `${E.scopeRefs(r.default.scope)}return ${x}`, this.opts.code.process && (H = this.opts.code.process(H, m));
      const K = new Function(`${r.default.self}`, `${r.default.scope}`, H)(this, this.scope.get());
      if (this.scope.value(O, { ref: K }), K.errors = null, K.schema = m.schema, K.schemaEnv = m, m.$async && (K.$async = !0), this.opts.code.source === !0 && (K.source = { validateName: O, validateCode: x, scopeValues: E._values }), this.opts.unevaluated) {
        const { props: M, items: L } = q;
        K.evaluated = {
          props: M instanceof e.Name ? void 0 : M,
          items: L instanceof e.Name ? void 0 : L,
          dynamicProps: M instanceof e.Name,
          dynamicItems: L instanceof e.Name
        }, K.source && (K.source.evaluated = (0, e.stringify)(K.evaluated));
      }
      return m.validate = K, m;
    } catch (x) {
      throw delete m.validate, delete m.validateName, H && this.logger.error("Error compiling schema, function code:", H), x;
    } finally {
      this._compilations.delete(m);
    }
  }
  Xe.compileSchema = i;
  function u(m, h, p) {
    var v;
    p = (0, n.resolveUrl)(this.opts.uriResolver, h, p);
    const $ = m.refs[p];
    if ($)
      return $;
    let b = d.call(this, m, p);
    if (b === void 0) {
      const E = (v = m.localRefs) === null || v === void 0 ? void 0 : v[p], { schemaId: I } = this.opts;
      E && (b = new s({ schema: E, schemaId: I, root: m, baseId: h }));
    }
    if (b !== void 0)
      return m.refs[p] = c.call(this, b);
  }
  Xe.resolveRef = u;
  function c(m) {
    return (0, n.inlineRef)(m.schema, this.opts.inlineRefs) ? m.schema : m.validate ? m : i.call(this, m);
  }
  function l(m) {
    for (const h of this._compilations)
      if (y(h, m))
        return h;
  }
  Xe.getCompilingSchema = l;
  function y(m, h) {
    return m.schema === h.schema && m.root === h.root && m.baseId === h.baseId;
  }
  function d(m, h) {
    let p;
    for (; typeof (p = this.refs[h]) == "string"; )
      h = p;
    return p || this.schemas[h] || f.call(this, m, h);
  }
  function f(m, h) {
    const p = this.opts.uriResolver.parse(h), v = (0, n._getFullPath)(this.opts.uriResolver, p);
    let $ = (0, n.getFullPath)(this.opts.uriResolver, m.baseId, void 0);
    if (Object.keys(m.schema).length > 0 && v === $)
      return _.call(this, p, m);
    const b = (0, n.normalizeId)(v), E = this.refs[b] || this.schemas[b];
    if (typeof E == "string") {
      const I = f.call(this, m, E);
      return typeof (I == null ? void 0 : I.schema) != "object" ? void 0 : _.call(this, p, I);
    }
    if (typeof (E == null ? void 0 : E.schema) == "object") {
      if (E.validate || i.call(this, E), b === (0, n.normalizeId)(h)) {
        const { schema: I } = E, { schemaId: O } = this.opts, q = I[O];
        return q && ($ = (0, n.resolveUrl)(this.opts.uriResolver, $, q)), new s({ schema: I, schemaId: O, root: m, baseId: $ });
      }
      return _.call(this, p, E);
    }
  }
  Xe.resolveSchema = f;
  const g = /* @__PURE__ */ new Set([
    "properties",
    "patternProperties",
    "enum",
    "dependencies",
    "definitions"
  ]);
  function _(m, { baseId: h, schema: p, root: v }) {
    var $;
    if ((($ = m.fragment) === null || $ === void 0 ? void 0 : $[0]) !== "/")
      return;
    for (const I of m.fragment.slice(1).split("/")) {
      if (typeof p == "boolean")
        return;
      const O = p[(0, o.unescapeFragment)(I)];
      if (O === void 0)
        return;
      p = O;
      const q = typeof p == "object" && p[this.opts.schemaId];
      !g.has(I) && q && (h = (0, n.resolveUrl)(this.opts.uriResolver, h, q));
    }
    let b;
    if (typeof p != "boolean" && p.$ref && !(0, o.schemaHasRulesButRef)(p, this.RULES)) {
      const I = (0, n.resolveUrl)(this.opts.uriResolver, h, p.$ref);
      b = f.call(this, v, I);
    }
    const { schemaId: E } = this.opts;
    if (b = b || new s({ schema: p, schemaId: E, root: v, baseId: h }), b.schema !== b.root.schema)
      return b;
  }
  return Xe;
}
const ry = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", ny = "Meta-schema for $data reference (JSON AnySchema extension proposal)", oy = "object", ay = ["$data"], sy = { $data: { type: "string", anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }] } }, iy = !1, uy = {
  $id: ry,
  description: ny,
  type: oy,
  required: ay,
  properties: sy,
  additionalProperties: iy
};
var Fn = {}, Hr = { exports: {} }, Ma, Nu;
function Tp() {
  if (Nu) return Ma;
  Nu = 1;
  const e = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), t = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
  function r(d) {
    let f = "", g = 0, _ = 0;
    for (_ = 0; _ < d.length; _++)
      if (g = d[_].charCodeAt(0), g !== 48) {
        if (!(g >= 48 && g <= 57 || g >= 65 && g <= 70 || g >= 97 && g <= 102))
          return "";
        f += d[_];
        break;
      }
    for (_ += 1; _ < d.length; _++) {
      if (g = d[_].charCodeAt(0), !(g >= 48 && g <= 57 || g >= 65 && g <= 70 || g >= 97 && g <= 102))
        return "";
      f += d[_];
    }
    return f;
  }
  const n = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
  function o(d) {
    return d.length = 0, !0;
  }
  function a(d, f, g) {
    if (d.length) {
      const _ = r(d);
      if (_ !== "")
        f.push(_);
      else
        return g.error = !0, !1;
      d.length = 0;
    }
    return !0;
  }
  function s(d) {
    let f = 0;
    const g = { error: !1, address: "", zone: "" }, _ = [], m = [];
    let h = !1, p = !1, v = a;
    for (let $ = 0; $ < d.length; $++) {
      const b = d[$];
      if (!(b === "[" || b === "]"))
        if (b === ":") {
          if (h === !0 && (p = !0), !v(m, _, g))
            break;
          if (++f > 7) {
            g.error = !0;
            break;
          }
          $ > 0 && d[$ - 1] === ":" && (h = !0), _.push(":");
          continue;
        } else if (b === "%") {
          if (!v(m, _, g))
            break;
          v = o;
        } else {
          m.push(b);
          continue;
        }
    }
    return m.length && (v === o ? g.zone = m.join("") : p ? _.push(m.join("")) : _.push(r(m))), g.address = _.join(""), g;
  }
  function i(d) {
    if (u(d, ":") < 2)
      return { host: d, isIPV6: !1 };
    const f = s(d);
    if (f.error)
      return { host: d, isIPV6: !1 };
    {
      let g = f.address, _ = f.address;
      return f.zone && (g += "%" + f.zone, _ += "%25" + f.zone), { host: g, isIPV6: !0, escapedHost: _ };
    }
  }
  function u(d, f) {
    let g = 0;
    for (let _ = 0; _ < d.length; _++)
      d[_] === f && g++;
    return g;
  }
  function c(d) {
    let f = d;
    const g = [];
    let _ = -1, m = 0;
    for (; m = f.length; ) {
      if (m === 1) {
        if (f === ".")
          break;
        if (f === "/") {
          g.push("/");
          break;
        } else {
          g.push(f);
          break;
        }
      } else if (m === 2) {
        if (f[0] === ".") {
          if (f[1] === ".")
            break;
          if (f[1] === "/") {
            f = f.slice(2);
            continue;
          }
        } else if (f[0] === "/" && (f[1] === "." || f[1] === "/")) {
          g.push("/");
          break;
        }
      } else if (m === 3 && f === "/..") {
        g.length !== 0 && g.pop(), g.push("/");
        break;
      }
      if (f[0] === ".") {
        if (f[1] === ".") {
          if (f[2] === "/") {
            f = f.slice(3);
            continue;
          }
        } else if (f[1] === "/") {
          f = f.slice(2);
          continue;
        }
      } else if (f[0] === "/" && f[1] === ".") {
        if (f[2] === "/") {
          f = f.slice(2);
          continue;
        } else if (f[2] === "." && f[3] === "/") {
          f = f.slice(3), g.length !== 0 && g.pop();
          continue;
        }
      }
      if ((_ = f.indexOf("/", 1)) === -1) {
        g.push(f);
        break;
      } else
        g.push(f.slice(0, _)), f = f.slice(_);
    }
    return g.join("");
  }
  function l(d, f) {
    const g = f !== !0 ? escape : unescape;
    return d.scheme !== void 0 && (d.scheme = g(d.scheme)), d.userinfo !== void 0 && (d.userinfo = g(d.userinfo)), d.host !== void 0 && (d.host = g(d.host)), d.path !== void 0 && (d.path = g(d.path)), d.query !== void 0 && (d.query = g(d.query)), d.fragment !== void 0 && (d.fragment = g(d.fragment)), d;
  }
  function y(d) {
    const f = [];
    if (d.userinfo !== void 0 && (f.push(d.userinfo), f.push("@")), d.host !== void 0) {
      let g = unescape(d.host);
      if (!t(g)) {
        const _ = i(g);
        _.isIPV6 === !0 ? g = `[${_.escapedHost}]` : g = d.host;
      }
      f.push(g);
    }
    return (typeof d.port == "number" || typeof d.port == "string") && (f.push(":"), f.push(String(d.port))), f.length ? f.join("") : void 0;
  }
  return Ma = {
    nonSimpleDomain: n,
    recomposeAuthority: y,
    normalizeComponentEncoding: l,
    removeDotSegments: c,
    isIPv4: t,
    isUUID: e,
    normalizeIPv6: i,
    stringArrayToHexStripped: r
  }, Ma;
}
var xa, Au;
function cy() {
  if (Au) return xa;
  Au = 1;
  const { isUUID: e } = Tp(), t = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu, r = (
    /** @type {const} */
    [
      "http",
      "https",
      "ws",
      "wss",
      "urn",
      "urn:uuid"
    ]
  );
  function n(b) {
    return r.indexOf(
      /** @type {*} */
      b
    ) !== -1;
  }
  function o(b) {
    return b.secure === !0 ? !0 : b.secure === !1 ? !1 : b.scheme ? b.scheme.length === 3 && (b.scheme[0] === "w" || b.scheme[0] === "W") && (b.scheme[1] === "s" || b.scheme[1] === "S") && (b.scheme[2] === "s" || b.scheme[2] === "S") : !1;
  }
  function a(b) {
    return b.host || (b.error = b.error || "HTTP URIs must have a host."), b;
  }
  function s(b) {
    const E = String(b.scheme).toLowerCase() === "https";
    return (b.port === (E ? 443 : 80) || b.port === "") && (b.port = void 0), b.path || (b.path = "/"), b;
  }
  function i(b) {
    return b.secure = o(b), b.resourceName = (b.path || "/") + (b.query ? "?" + b.query : ""), b.path = void 0, b.query = void 0, b;
  }
  function u(b) {
    if ((b.port === (o(b) ? 443 : 80) || b.port === "") && (b.port = void 0), typeof b.secure == "boolean" && (b.scheme = b.secure ? "wss" : "ws", b.secure = void 0), b.resourceName) {
      const [E, I] = b.resourceName.split("?");
      b.path = E && E !== "/" ? E : void 0, b.query = I, b.resourceName = void 0;
    }
    return b.fragment = void 0, b;
  }
  function c(b, E) {
    if (!b.path)
      return b.error = "URN can not be parsed", b;
    const I = b.path.match(t);
    if (I) {
      const O = E.scheme || b.scheme || "urn";
      b.nid = I[1].toLowerCase(), b.nss = I[2];
      const q = `${O}:${E.nid || b.nid}`, H = $(q);
      b.path = void 0, H && (b = H.parse(b, E));
    } else
      b.error = b.error || "URN can not be parsed.";
    return b;
  }
  function l(b, E) {
    if (b.nid === void 0)
      throw new Error("URN without nid cannot be serialized");
    const I = E.scheme || b.scheme || "urn", O = b.nid.toLowerCase(), q = `${I}:${E.nid || O}`, H = $(q);
    H && (b = H.serialize(b, E));
    const x = b, W = b.nss;
    return x.path = `${O || E.nid}:${W}`, E.skipEscape = !0, x;
  }
  function y(b, E) {
    const I = b;
    return I.uuid = I.nss, I.nss = void 0, !E.tolerant && (!I.uuid || !e(I.uuid)) && (I.error = I.error || "UUID is not valid."), I;
  }
  function d(b) {
    const E = b;
    return E.nss = (b.uuid || "").toLowerCase(), E;
  }
  const f = (
    /** @type {SchemeHandler} */
    {
      scheme: "http",
      domainHost: !0,
      parse: a,
      serialize: s
    }
  ), g = (
    /** @type {SchemeHandler} */
    {
      scheme: "https",
      domainHost: f.domainHost,
      parse: a,
      serialize: s
    }
  ), _ = (
    /** @type {SchemeHandler} */
    {
      scheme: "ws",
      domainHost: !0,
      parse: i,
      serialize: u
    }
  ), m = (
    /** @type {SchemeHandler} */
    {
      scheme: "wss",
      domainHost: _.domainHost,
      parse: _.parse,
      serialize: _.serialize
    }
  ), v = (
    /** @type {Record<SchemeName, SchemeHandler>} */
    {
      http: f,
      https: g,
      ws: _,
      wss: m,
      urn: (
        /** @type {SchemeHandler} */
        {
          scheme: "urn",
          parse: c,
          serialize: l,
          skipNormalize: !0
        }
      ),
      "urn:uuid": (
        /** @type {SchemeHandler} */
        {
          scheme: "urn:uuid",
          parse: y,
          serialize: d,
          skipNormalize: !0
        }
      )
    }
  );
  Object.setPrototypeOf(v, null);
  function $(b) {
    return b && (v[
      /** @type {SchemeName} */
      b
    ] || v[
      /** @type {SchemeName} */
      b.toLowerCase()
    ]) || void 0;
  }
  return xa = {
    wsIsSecure: o,
    SCHEMES: v,
    isValidSchemeName: n,
    getSchemeHandler: $
  }, xa;
}
var Cu;
function ly() {
  if (Cu) return Hr.exports;
  Cu = 1;
  const { normalizeIPv6: e, removeDotSegments: t, recomposeAuthority: r, normalizeComponentEncoding: n, isIPv4: o, nonSimpleDomain: a } = Tp(), { SCHEMES: s, getSchemeHandler: i } = cy();
  function u(m, h) {
    return typeof m == "string" ? m = /** @type {T} */
    d(g(m, h), h) : typeof m == "object" && (m = /** @type {T} */
    g(d(m, h), h)), m;
  }
  function c(m, h, p) {
    const v = p ? Object.assign({ scheme: "null" }, p) : { scheme: "null" }, $ = l(g(m, v), g(h, v), v, !0);
    return v.skipEscape = !0, d($, v);
  }
  function l(m, h, p, v) {
    const $ = {};
    return v || (m = g(d(m, p), p), h = g(d(h, p), p)), p = p || {}, !p.tolerant && h.scheme ? ($.scheme = h.scheme, $.userinfo = h.userinfo, $.host = h.host, $.port = h.port, $.path = t(h.path || ""), $.query = h.query) : (h.userinfo !== void 0 || h.host !== void 0 || h.port !== void 0 ? ($.userinfo = h.userinfo, $.host = h.host, $.port = h.port, $.path = t(h.path || ""), $.query = h.query) : (h.path ? (h.path[0] === "/" ? $.path = t(h.path) : ((m.userinfo !== void 0 || m.host !== void 0 || m.port !== void 0) && !m.path ? $.path = "/" + h.path : m.path ? $.path = m.path.slice(0, m.path.lastIndexOf("/") + 1) + h.path : $.path = h.path, $.path = t($.path)), $.query = h.query) : ($.path = m.path, h.query !== void 0 ? $.query = h.query : $.query = m.query), $.userinfo = m.userinfo, $.host = m.host, $.port = m.port), $.scheme = m.scheme), $.fragment = h.fragment, $;
  }
  function y(m, h, p) {
    return typeof m == "string" ? (m = unescape(m), m = d(n(g(m, p), !0), { ...p, skipEscape: !0 })) : typeof m == "object" && (m = d(n(m, !0), { ...p, skipEscape: !0 })), typeof h == "string" ? (h = unescape(h), h = d(n(g(h, p), !0), { ...p, skipEscape: !0 })) : typeof h == "object" && (h = d(n(h, !0), { ...p, skipEscape: !0 })), m.toLowerCase() === h.toLowerCase();
  }
  function d(m, h) {
    const p = {
      host: m.host,
      scheme: m.scheme,
      userinfo: m.userinfo,
      port: m.port,
      path: m.path,
      query: m.query,
      nid: m.nid,
      nss: m.nss,
      uuid: m.uuid,
      fragment: m.fragment,
      reference: m.reference,
      resourceName: m.resourceName,
      secure: m.secure,
      error: ""
    }, v = Object.assign({}, h), $ = [], b = i(v.scheme || p.scheme);
    b && b.serialize && b.serialize(p, v), p.path !== void 0 && (v.skipEscape ? p.path = unescape(p.path) : (p.path = escape(p.path), p.scheme !== void 0 && (p.path = p.path.split("%3A").join(":")))), v.reference !== "suffix" && p.scheme && $.push(p.scheme, ":");
    const E = r(p);
    if (E !== void 0 && (v.reference !== "suffix" && $.push("//"), $.push(E), p.path && p.path[0] !== "/" && $.push("/")), p.path !== void 0) {
      let I = p.path;
      !v.absolutePath && (!b || !b.absolutePath) && (I = t(I)), E === void 0 && I[0] === "/" && I[1] === "/" && (I = "/%2F" + I.slice(2)), $.push(I);
    }
    return p.query !== void 0 && $.push("?", p.query), p.fragment !== void 0 && $.push("#", p.fragment), $.join("");
  }
  const f = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
  function g(m, h) {
    const p = Object.assign({}, h), v = {
      scheme: void 0,
      userinfo: void 0,
      host: "",
      port: void 0,
      path: "",
      query: void 0,
      fragment: void 0
    };
    let $ = !1;
    p.reference === "suffix" && (p.scheme ? m = p.scheme + ":" + m : m = "//" + m);
    const b = m.match(f);
    if (b) {
      if (v.scheme = b[1], v.userinfo = b[3], v.host = b[4], v.port = parseInt(b[5], 10), v.path = b[6] || "", v.query = b[7], v.fragment = b[8], isNaN(v.port) && (v.port = b[5]), v.host)
        if (o(v.host) === !1) {
          const O = e(v.host);
          v.host = O.host.toLowerCase(), $ = O.isIPV6;
        } else
          $ = !0;
      v.scheme === void 0 && v.userinfo === void 0 && v.host === void 0 && v.port === void 0 && v.query === void 0 && !v.path ? v.reference = "same-document" : v.scheme === void 0 ? v.reference = "relative" : v.fragment === void 0 ? v.reference = "absolute" : v.reference = "uri", p.reference && p.reference !== "suffix" && p.reference !== v.reference && (v.error = v.error || "URI is not a " + p.reference + " reference.");
      const E = i(p.scheme || v.scheme);
      if (!p.unicodeSupport && (!E || !E.unicodeSupport) && v.host && (p.domainHost || E && E.domainHost) && $ === !1 && a(v.host))
        try {
          v.host = URL.domainToASCII(v.host.toLowerCase());
        } catch (I) {
          v.error = v.error || "Host's domain name can not be converted to ASCII: " + I;
        }
      (!E || E && !E.skipNormalize) && (m.indexOf("%") !== -1 && (v.scheme !== void 0 && (v.scheme = unescape(v.scheme)), v.host !== void 0 && (v.host = unescape(v.host))), v.path && (v.path = escape(unescape(v.path))), v.fragment && (v.fragment = encodeURI(decodeURIComponent(v.fragment)))), E && E.parse && E.parse(v, p);
    } else
      v.error = v.error || "URI can not be parsed.";
    return v;
  }
  const _ = {
    SCHEMES: s,
    normalize: u,
    resolve: c,
    resolveComponent: l,
    equal: y,
    serialize: d,
    parse: g
  };
  return Hr.exports = _, Hr.exports.default = _, Hr.exports.fastUri = _, Hr.exports;
}
var ju;
function dy() {
  if (ju) return Fn;
  ju = 1, Object.defineProperty(Fn, "__esModule", { value: !0 });
  const e = ly();
  return e.code = 'require("ajv/dist/runtime/uri").default', Fn.default = e, Fn;
}
var Mu;
function Op() {
  return Mu || (Mu = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
    var t = Nn();
    Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
      return t.KeywordCxt;
    } });
    var r = ne();
    Object.defineProperty(e, "_", { enumerable: !0, get: function() {
      return r._;
    } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
      return r.str;
    } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
      return r.stringify;
    } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
      return r.nil;
    } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
      return r.Name;
    } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
      return r.CodeGen;
    } });
    const n = la(), o = An(), a = $p(), s = da(), i = ne(), u = ca(), c = Xo(), l = pe(), y = uy, d = dy(), f = (D, P) => new RegExp(D, P);
    f.code = "new RegExp";
    const g = ["removeAdditional", "useDefaults", "coerceTypes"], _ = /* @__PURE__ */ new Set([
      "validate",
      "serialize",
      "parse",
      "wrapper",
      "root",
      "schema",
      "keyword",
      "pattern",
      "formats",
      "validate$data",
      "func",
      "obj",
      "Error"
    ]), m = {
      errorDataPath: "",
      format: "`validateFormats: false` can be used instead.",
      nullable: '"nullable" keyword is supported by default.',
      jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
      extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
      missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
      processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
      sourceCode: "Use option `code: {source: true}`",
      strictDefaults: "It is default now, see option `strict`.",
      strictKeywords: "It is default now, see option `strict`.",
      uniqueItems: '"uniqueItems" keyword is always validated.',
      unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
      cache: "Map is used as cache, schema object as key.",
      serialize: "Map is used as cache, schema object as key.",
      ajvErrors: "It is default now."
    }, h = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.'
    }, p = 200;
    function v(D) {
      var P, C, k, S, w, A, Y, X, le, ae, N, j, U, J, te, se, Te, Ue, Pe, xe, Re, wt, fe, ot, pr;
      const Mt = D.strict, hr = (P = D.code) === null || P === void 0 ? void 0 : P.optimize, zr = hr === !0 || hr === void 0 ? 1 : hr || 0, Vr = (k = (C = D.code) === null || C === void 0 ? void 0 : C.regExp) !== null && k !== void 0 ? k : f, Dn = (S = D.uriResolver) !== null && S !== void 0 ? S : d.default;
      return {
        strictSchema: (A = (w = D.strictSchema) !== null && w !== void 0 ? w : Mt) !== null && A !== void 0 ? A : !0,
        strictNumbers: (X = (Y = D.strictNumbers) !== null && Y !== void 0 ? Y : Mt) !== null && X !== void 0 ? X : !0,
        strictTypes: (ae = (le = D.strictTypes) !== null && le !== void 0 ? le : Mt) !== null && ae !== void 0 ? ae : "log",
        strictTuples: (j = (N = D.strictTuples) !== null && N !== void 0 ? N : Mt) !== null && j !== void 0 ? j : "log",
        strictRequired: (J = (U = D.strictRequired) !== null && U !== void 0 ? U : Mt) !== null && J !== void 0 ? J : !1,
        code: D.code ? { ...D.code, optimize: zr, regExp: Vr } : { optimize: zr, regExp: Vr },
        loopRequired: (te = D.loopRequired) !== null && te !== void 0 ? te : p,
        loopEnum: (se = D.loopEnum) !== null && se !== void 0 ? se : p,
        meta: (Te = D.meta) !== null && Te !== void 0 ? Te : !0,
        messages: (Ue = D.messages) !== null && Ue !== void 0 ? Ue : !0,
        inlineRefs: (Pe = D.inlineRefs) !== null && Pe !== void 0 ? Pe : !0,
        schemaId: (xe = D.schemaId) !== null && xe !== void 0 ? xe : "$id",
        addUsedSchema: (Re = D.addUsedSchema) !== null && Re !== void 0 ? Re : !0,
        validateSchema: (wt = D.validateSchema) !== null && wt !== void 0 ? wt : !0,
        validateFormats: (fe = D.validateFormats) !== null && fe !== void 0 ? fe : !0,
        unicodeRegExp: (ot = D.unicodeRegExp) !== null && ot !== void 0 ? ot : !0,
        int32range: (pr = D.int32range) !== null && pr !== void 0 ? pr : !0,
        uriResolver: Dn
      };
    }
    class $ {
      constructor(P = {}) {
        this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), P = this.opts = { ...P, ...v(P) };
        const { es5: C, lines: k } = this.opts.code;
        this.scope = new i.ValueScope({ scope: {}, prefixes: _, es5: C, lines: k }), this.logger = W(P.logger);
        const S = P.validateFormats;
        P.validateFormats = !1, this.RULES = (0, a.getRules)(), b.call(this, m, P, "NOT SUPPORTED"), b.call(this, h, P, "DEPRECATED", "warn"), this._metaOpts = H.call(this), P.formats && O.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), P.keywords && q.call(this, P.keywords), typeof P.meta == "object" && this.addMetaSchema(P.meta), I.call(this), P.validateFormats = S;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data: P, meta: C, schemaId: k } = this.opts;
        let S = y;
        k === "id" && (S = { ...y }, S.id = S.$id, delete S.$id), C && P && this.addMetaSchema(S, S[k], !1);
      }
      defaultMeta() {
        const { meta: P, schemaId: C } = this.opts;
        return this.opts.defaultMeta = typeof P == "object" ? P[C] || P : void 0;
      }
      validate(P, C) {
        let k;
        if (typeof P == "string") {
          if (k = this.getSchema(P), !k)
            throw new Error(`no schema with key or ref "${P}"`);
        } else
          k = this.compile(P);
        const S = k(C);
        return "$async" in k || (this.errors = k.errors), S;
      }
      compile(P, C) {
        const k = this._addSchema(P, C);
        return k.validate || this._compileSchemaEnv(k);
      }
      compileAsync(P, C) {
        if (typeof this.opts.loadSchema != "function")
          throw new Error("options.loadSchema should be a function");
        const { loadSchema: k } = this.opts;
        return S.call(this, P, C);
        async function S(ae, N) {
          await w.call(this, ae.$schema);
          const j = this._addSchema(ae, N);
          return j.validate || A.call(this, j);
        }
        async function w(ae) {
          ae && !this.getSchema(ae) && await S.call(this, { $ref: ae }, !0);
        }
        async function A(ae) {
          try {
            return this._compileSchemaEnv(ae);
          } catch (N) {
            if (!(N instanceof o.default))
              throw N;
            return Y.call(this, N), await X.call(this, N.missingSchema), A.call(this, ae);
          }
        }
        function Y({ missingSchema: ae, missingRef: N }) {
          if (this.refs[ae])
            throw new Error(`AnySchema ${ae} is loaded but ${N} cannot be resolved`);
        }
        async function X(ae) {
          const N = await le.call(this, ae);
          this.refs[ae] || await w.call(this, N.$schema), this.refs[ae] || this.addSchema(N, ae, C);
        }
        async function le(ae) {
          const N = this._loading[ae];
          if (N)
            return N;
          try {
            return await (this._loading[ae] = k(ae));
          } finally {
            delete this._loading[ae];
          }
        }
      }
      // Adds schema to the instance
      addSchema(P, C, k, S = this.opts.validateSchema) {
        if (Array.isArray(P)) {
          for (const A of P)
            this.addSchema(A, void 0, k, S);
          return this;
        }
        let w;
        if (typeof P == "object") {
          const { schemaId: A } = this.opts;
          if (w = P[A], w !== void 0 && typeof w != "string")
            throw new Error(`schema ${A} must be string`);
        }
        return C = (0, u.normalizeId)(C || w), this._checkUnique(C), this.schemas[C] = this._addSchema(P, k, C, S, !0), this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(P, C, k = this.opts.validateSchema) {
        return this.addSchema(P, C, !0, k), this;
      }
      //  Validate schema against its meta-schema
      validateSchema(P, C) {
        if (typeof P == "boolean")
          return !0;
        let k;
        if (k = P.$schema, k !== void 0 && typeof k != "string")
          throw new Error("$schema must be a string");
        if (k = k || this.opts.defaultMeta || this.defaultMeta(), !k)
          return this.logger.warn("meta-schema not available"), this.errors = null, !0;
        const S = this.validate(k, P);
        if (!S && C) {
          const w = "schema is invalid: " + this.errorsText();
          if (this.opts.validateSchema === "log")
            this.logger.error(w);
          else
            throw new Error(w);
        }
        return S;
      }
      // Get compiled schema by `key` or `ref`.
      // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
      getSchema(P) {
        let C;
        for (; typeof (C = E.call(this, P)) == "string"; )
          P = C;
        if (C === void 0) {
          const { schemaId: k } = this.opts, S = new s.SchemaEnv({ schema: {}, schemaId: k });
          if (C = s.resolveSchema.call(this, S, P), !C)
            return;
          this.refs[P] = C;
        }
        return C.validate || this._compileSchemaEnv(C);
      }
      // Remove cached schema(s).
      // If no parameter is passed all schemas but meta-schemas are removed.
      // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
      // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
      removeSchema(P) {
        if (P instanceof RegExp)
          return this._removeAllSchemas(this.schemas, P), this._removeAllSchemas(this.refs, P), this;
        switch (typeof P) {
          case "undefined":
            return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
          case "string": {
            const C = E.call(this, P);
            return typeof C == "object" && this._cache.delete(C.schema), delete this.schemas[P], delete this.refs[P], this;
          }
          case "object": {
            const C = P;
            this._cache.delete(C);
            let k = P[this.opts.schemaId];
            return k && (k = (0, u.normalizeId)(k), delete this.schemas[k], delete this.refs[k]), this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      // add "vocabulary" - a collection of keywords
      addVocabulary(P) {
        for (const C of P)
          this.addKeyword(C);
        return this;
      }
      addKeyword(P, C) {
        let k;
        if (typeof P == "string")
          k = P, typeof C == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), C.keyword = k);
        else if (typeof P == "object" && C === void 0) {
          if (C = P, k = C.keyword, Array.isArray(k) && !k.length)
            throw new Error("addKeywords: keyword must be string or non-empty array");
        } else
          throw new Error("invalid addKeywords parameters");
        if (M.call(this, k, C), !C)
          return (0, l.eachItem)(k, (w) => L.call(this, w)), this;
        G.call(this, C);
        const S = {
          ...C,
          type: (0, c.getJSONTypes)(C.type),
          schemaType: (0, c.getJSONTypes)(C.schemaType)
        };
        return (0, l.eachItem)(k, S.type.length === 0 ? (w) => L.call(this, w, S) : (w) => S.type.forEach((A) => L.call(this, w, S, A))), this;
      }
      getKeyword(P) {
        const C = this.RULES.all[P];
        return typeof C == "object" ? C.definition : !!C;
      }
      // Remove keyword
      removeKeyword(P) {
        const { RULES: C } = this;
        delete C.keywords[P], delete C.all[P];
        for (const k of C.rules) {
          const S = k.rules.findIndex((w) => w.keyword === P);
          S >= 0 && k.rules.splice(S, 1);
        }
        return this;
      }
      // Add format
      addFormat(P, C) {
        return typeof C == "string" && (C = new RegExp(C)), this.formats[P] = C, this;
      }
      errorsText(P = this.errors, { separator: C = ", ", dataVar: k = "data" } = {}) {
        return !P || P.length === 0 ? "No errors" : P.map((S) => `${k}${S.instancePath} ${S.message}`).reduce((S, w) => S + C + w);
      }
      $dataMetaSchema(P, C) {
        const k = this.RULES.all;
        P = JSON.parse(JSON.stringify(P));
        for (const S of C) {
          const w = S.split("/").slice(1);
          let A = P;
          for (const Y of w)
            A = A[Y];
          for (const Y in k) {
            const X = k[Y];
            if (typeof X != "object")
              continue;
            const { $data: le } = X.definition, ae = A[Y];
            le && ae && (A[Y] = Q(ae));
          }
        }
        return P;
      }
      _removeAllSchemas(P, C) {
        for (const k in P) {
          const S = P[k];
          (!C || C.test(k)) && (typeof S == "string" ? delete P[k] : S && !S.meta && (this._cache.delete(S.schema), delete P[k]));
        }
      }
      _addSchema(P, C, k, S = this.opts.validateSchema, w = this.opts.addUsedSchema) {
        let A;
        const { schemaId: Y } = this.opts;
        if (typeof P == "object")
          A = P[Y];
        else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          if (typeof P != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let X = this._cache.get(P);
        if (X !== void 0)
          return X;
        k = (0, u.normalizeId)(A || k);
        const le = u.getSchemaRefs.call(this, P, k);
        return X = new s.SchemaEnv({ schema: P, schemaId: Y, meta: C, baseId: k, localRefs: le }), this._cache.set(X.schema, X), w && !k.startsWith("#") && (k && this._checkUnique(k), this.refs[k] = X), S && this.validateSchema(P, !0), X;
      }
      _checkUnique(P) {
        if (this.schemas[P] || this.refs[P])
          throw new Error(`schema with key or id "${P}" already exists`);
      }
      _compileSchemaEnv(P) {
        if (P.meta ? this._compileMetaSchema(P) : s.compileSchema.call(this, P), !P.validate)
          throw new Error("ajv implementation error");
        return P.validate;
      }
      _compileMetaSchema(P) {
        const C = this.opts;
        this.opts = this._metaOpts;
        try {
          s.compileSchema.call(this, P);
        } finally {
          this.opts = C;
        }
      }
    }
    $.ValidationError = n.default, $.MissingRefError = o.default, e.default = $;
    function b(D, P, C, k = "error") {
      for (const S in D) {
        const w = S;
        w in P && this.logger[k](`${C}: option ${S}. ${D[w]}`);
      }
    }
    function E(D) {
      return D = (0, u.normalizeId)(D), this.schemas[D] || this.refs[D];
    }
    function I() {
      const D = this.opts.schemas;
      if (D)
        if (Array.isArray(D))
          this.addSchema(D);
        else
          for (const P in D)
            this.addSchema(D[P], P);
    }
    function O() {
      for (const D in this.opts.formats) {
        const P = this.opts.formats[D];
        P && this.addFormat(D, P);
      }
    }
    function q(D) {
      if (Array.isArray(D)) {
        this.addVocabulary(D);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const P in D) {
        const C = D[P];
        C.keyword || (C.keyword = P), this.addKeyword(C);
      }
    }
    function H() {
      const D = { ...this.opts };
      for (const P of g)
        delete D[P];
      return D;
    }
    const x = { log() {
    }, warn() {
    }, error() {
    } };
    function W(D) {
      if (D === !1)
        return x;
      if (D === void 0)
        return console;
      if (D.log && D.warn && D.error)
        return D;
      throw new Error("logger must implement log, warn and error methods");
    }
    const K = /^[a-z_$][a-z0-9_$:-]*$/i;
    function M(D, P) {
      const { RULES: C } = this;
      if ((0, l.eachItem)(D, (k) => {
        if (C.keywords[k])
          throw new Error(`Keyword ${k} is already defined`);
        if (!K.test(k))
          throw new Error(`Keyword ${k} has invalid name`);
      }), !!P && P.$data && !("code" in P || "validate" in P))
        throw new Error('$data keyword must have "code" or "validate" function');
    }
    function L(D, P, C) {
      var k;
      const S = P == null ? void 0 : P.post;
      if (C && S)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES: w } = this;
      let A = S ? w.post : w.rules.find(({ type: X }) => X === C);
      if (A || (A = { type: C, rules: [] }, w.rules.push(A)), w.keywords[D] = !0, !P)
        return;
      const Y = {
        keyword: D,
        definition: {
          ...P,
          type: (0, c.getJSONTypes)(P.type),
          schemaType: (0, c.getJSONTypes)(P.schemaType)
        }
      };
      P.before ? F.call(this, A, Y, P.before) : A.rules.push(Y), w.all[D] = Y, (k = P.implements) === null || k === void 0 || k.forEach((X) => this.addKeyword(X));
    }
    function F(D, P, C) {
      const k = D.rules.findIndex((S) => S.keyword === C);
      k >= 0 ? D.rules.splice(k, 0, P) : (D.rules.push(P), this.logger.warn(`rule ${C} is not defined`));
    }
    function G(D) {
      let { metaSchema: P } = D;
      P !== void 0 && (D.$data && this.opts.$data && (P = Q(P)), D.validateSchema = this.compile(P, !0));
    }
    const B = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function Q(D) {
      return { anyOf: [D, B] };
    }
  })(Ra)), Ra;
}
var Zn = {}, Gn = {}, Bn = {}, xu;
function fy() {
  if (xu) return Bn;
  xu = 1, Object.defineProperty(Bn, "__esModule", { value: !0 });
  const e = {
    keyword: "id",
    code() {
      throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
    }
  };
  return Bn.default = e, Bn;
}
var Lt = {}, Du;
function Oi() {
  if (Du) return Lt;
  Du = 1, Object.defineProperty(Lt, "__esModule", { value: !0 }), Lt.callRef = Lt.getValidate = void 0;
  const e = An(), t = ht(), r = ne(), n = pt(), o = da(), a = pe(), s = {
    keyword: "$ref",
    schemaType: "string",
    code(c) {
      const { gen: l, schema: y, it: d } = c, { baseId: f, schemaEnv: g, validateName: _, opts: m, self: h } = d, { root: p } = g;
      if ((y === "#" || y === "#/") && f === p.baseId)
        return $();
      const v = o.resolveRef.call(h, p, f, y);
      if (v === void 0)
        throw new e.default(d.opts.uriResolver, f, y);
      if (v instanceof o.SchemaEnv)
        return b(v);
      return E(v);
      function $() {
        if (g === p)
          return u(c, _, g, g.$async);
        const I = l.scopeValue("root", { ref: p });
        return u(c, (0, r._)`${I}.validate`, p, p.$async);
      }
      function b(I) {
        const O = i(c, I);
        u(c, O, I, I.$async);
      }
      function E(I) {
        const O = l.scopeValue("schema", m.code.source === !0 ? { ref: I, code: (0, r.stringify)(I) } : { ref: I }), q = l.name("valid"), H = c.subschema({
          schema: I,
          dataTypes: [],
          schemaPath: r.nil,
          topSchemaRef: O,
          errSchemaPath: y
        }, q);
        c.mergeEvaluated(H), c.ok(q);
      }
    }
  };
  function i(c, l) {
    const { gen: y } = c;
    return l.validate ? y.scopeValue("validate", { ref: l.validate }) : (0, r._)`${y.scopeValue("wrapper", { ref: l })}.validate`;
  }
  Lt.getValidate = i;
  function u(c, l, y, d) {
    const { gen: f, it: g } = c, { allErrors: _, schemaEnv: m, opts: h } = g, p = h.passContext ? n.default.this : r.nil;
    d ? v() : $();
    function v() {
      if (!m.$async)
        throw new Error("async schema referenced by sync schema");
      const I = f.let("valid");
      f.try(() => {
        f.code((0, r._)`await ${(0, t.callValidateCode)(c, l, p)}`), E(l), _ || f.assign(I, !0);
      }, (O) => {
        f.if((0, r._)`!(${O} instanceof ${g.ValidationError})`, () => f.throw(O)), b(O), _ || f.assign(I, !1);
      }), c.ok(I);
    }
    function $() {
      c.result((0, t.callValidateCode)(c, l, p), () => E(l), () => b(l));
    }
    function b(I) {
      const O = (0, r._)`${I}.errors`;
      f.assign(n.default.vErrors, (0, r._)`${n.default.vErrors} === null ? ${O} : ${n.default.vErrors}.concat(${O})`), f.assign(n.default.errors, (0, r._)`${n.default.vErrors}.length`);
    }
    function E(I) {
      var O;
      if (!g.opts.unevaluated)
        return;
      const q = (O = y == null ? void 0 : y.validate) === null || O === void 0 ? void 0 : O.evaluated;
      if (g.props !== !0)
        if (q && !q.dynamicProps)
          q.props !== void 0 && (g.props = a.mergeEvaluated.props(f, q.props, g.props));
        else {
          const H = f.var("props", (0, r._)`${I}.evaluated.props`);
          g.props = a.mergeEvaluated.props(f, H, g.props, r.Name);
        }
      if (g.items !== !0)
        if (q && !q.dynamicItems)
          q.items !== void 0 && (g.items = a.mergeEvaluated.items(f, q.items, g.items));
        else {
          const H = f.var("items", (0, r._)`${I}.evaluated.items`);
          g.items = a.mergeEvaluated.items(f, H, g.items, r.Name);
        }
    }
  }
  return Lt.callRef = u, Lt.default = s, Lt;
}
var qu;
function Rp() {
  if (qu) return Gn;
  qu = 1, Object.defineProperty(Gn, "__esModule", { value: !0 });
  const e = fy(), t = Oi(), r = [
    "$schema",
    "$id",
    "$defs",
    "$vocabulary",
    { keyword: "$comment" },
    "definitions",
    e.default,
    t.default
  ];
  return Gn.default = r, Gn;
}
var Hn = {}, Wn = {}, Lu;
function py() {
  if (Lu) return Wn;
  Lu = 1, Object.defineProperty(Wn, "__esModule", { value: !0 });
  const e = ne(), t = e.operators, r = {
    maximum: { okStr: "<=", ok: t.LTE, fail: t.GT },
    minimum: { okStr: ">=", ok: t.GTE, fail: t.LT },
    exclusiveMaximum: { okStr: "<", ok: t.LT, fail: t.GTE },
    exclusiveMinimum: { okStr: ">", ok: t.GT, fail: t.LTE }
  }, n = {
    message: ({ keyword: a, schemaCode: s }) => (0, e.str)`must be ${r[a].okStr} ${s}`,
    params: ({ keyword: a, schemaCode: s }) => (0, e._)`{comparison: ${r[a].okStr}, limit: ${s}}`
  }, o = {
    keyword: Object.keys(r),
    type: "number",
    schemaType: "number",
    $data: !0,
    error: n,
    code(a) {
      const { keyword: s, data: i, schemaCode: u } = a;
      a.fail$data((0, e._)`${i} ${r[s].fail} ${u} || isNaN(${i})`);
    }
  };
  return Wn.default = o, Wn;
}
var Jn = {}, zu;
function hy() {
  if (zu) return Jn;
  zu = 1, Object.defineProperty(Jn, "__esModule", { value: !0 });
  const e = ne(), r = {
    keyword: "multipleOf",
    type: "number",
    schemaType: "number",
    $data: !0,
    error: {
      message: ({ schemaCode: n }) => (0, e.str)`must be multiple of ${n}`,
      params: ({ schemaCode: n }) => (0, e._)`{multipleOf: ${n}}`
    },
    code(n) {
      const { gen: o, data: a, schemaCode: s, it: i } = n, u = i.opts.multipleOfPrecision, c = o.let("res"), l = u ? (0, e._)`Math.abs(Math.round(${c}) - ${c}) > 1e-${u}` : (0, e._)`${c} !== parseInt(${c})`;
      n.fail$data((0, e._)`(${s} === 0 || (${c} = ${a}/${s}, ${l}))`);
    }
  };
  return Jn.default = r, Jn;
}
var Kn = {}, Yn = {}, Vu;
function my() {
  if (Vu) return Yn;
  Vu = 1, Object.defineProperty(Yn, "__esModule", { value: !0 });
  function e(t) {
    const r = t.length;
    let n = 0, o = 0, a;
    for (; o < r; )
      n++, a = t.charCodeAt(o++), a >= 55296 && a <= 56319 && o < r && (a = t.charCodeAt(o), (a & 64512) === 56320 && o++);
    return n;
  }
  return Yn.default = e, e.code = 'require("ajv/dist/runtime/ucs2length").default', Yn;
}
var Uu;
function gy() {
  if (Uu) return Kn;
  Uu = 1, Object.defineProperty(Kn, "__esModule", { value: !0 });
  const e = ne(), t = pe(), r = my(), o = {
    keyword: ["maxLength", "minLength"],
    type: "string",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: a, schemaCode: s }) {
        const i = a === "maxLength" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${i} than ${s} characters`;
      },
      params: ({ schemaCode: a }) => (0, e._)`{limit: ${a}}`
    },
    code(a) {
      const { keyword: s, data: i, schemaCode: u, it: c } = a, l = s === "maxLength" ? e.operators.GT : e.operators.LT, y = c.opts.unicode === !1 ? (0, e._)`${i}.length` : (0, e._)`${(0, t.useFunc)(a.gen, r.default)}(${i})`;
      a.fail$data((0, e._)`${y} ${l} ${u}`);
    }
  };
  return Kn.default = o, Kn;
}
var Xn = {}, Fu;
function yy() {
  if (Fu) return Xn;
  Fu = 1, Object.defineProperty(Xn, "__esModule", { value: !0 });
  const e = ht(), t = ne(), n = {
    keyword: "pattern",
    type: "string",
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: o }) => (0, t.str)`must match pattern "${o}"`,
      params: ({ schemaCode: o }) => (0, t._)`{pattern: ${o}}`
    },
    code(o) {
      const { data: a, $data: s, schema: i, schemaCode: u, it: c } = o, l = c.opts.unicodeRegExp ? "u" : "", y = s ? (0, t._)`(new RegExp(${u}, ${l}))` : (0, e.usePattern)(o, i);
      o.fail$data((0, t._)`!${y}.test(${a})`);
    }
  };
  return Xn.default = n, Xn;
}
var Qn = {}, Zu;
function vy() {
  if (Zu) return Qn;
  Zu = 1, Object.defineProperty(Qn, "__esModule", { value: !0 });
  const e = ne(), r = {
    keyword: ["maxProperties", "minProperties"],
    type: "object",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: n, schemaCode: o }) {
        const a = n === "maxProperties" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${a} than ${o} properties`;
      },
      params: ({ schemaCode: n }) => (0, e._)`{limit: ${n}}`
    },
    code(n) {
      const { keyword: o, data: a, schemaCode: s } = n, i = o === "maxProperties" ? e.operators.GT : e.operators.LT;
      n.fail$data((0, e._)`Object.keys(${a}).length ${i} ${s}`);
    }
  };
  return Qn.default = r, Qn;
}
var eo = {}, Gu;
function _y() {
  if (Gu) return eo;
  Gu = 1, Object.defineProperty(eo, "__esModule", { value: !0 });
  const e = ht(), t = ne(), r = pe(), o = {
    keyword: "required",
    type: "object",
    schemaType: "array",
    $data: !0,
    error: {
      message: ({ params: { missingProperty: a } }) => (0, t.str)`must have required property '${a}'`,
      params: ({ params: { missingProperty: a } }) => (0, t._)`{missingProperty: ${a}}`
    },
    code(a) {
      const { gen: s, schema: i, schemaCode: u, data: c, $data: l, it: y } = a, { opts: d } = y;
      if (!l && i.length === 0)
        return;
      const f = i.length >= d.loopRequired;
      if (y.allErrors ? g() : _(), d.strictRequired) {
        const p = a.parentSchema.properties, { definedProperties: v } = a.it;
        for (const $ of i)
          if ((p == null ? void 0 : p[$]) === void 0 && !v.has($)) {
            const b = y.schemaEnv.baseId + y.errSchemaPath, E = `required property "${$}" is not defined at "${b}" (strictRequired)`;
            (0, r.checkStrictMode)(y, E, y.opts.strictRequired);
          }
      }
      function g() {
        if (f || l)
          a.block$data(t.nil, m);
        else
          for (const p of i)
            (0, e.checkReportMissingProp)(a, p);
      }
      function _() {
        const p = s.let("missing");
        if (f || l) {
          const v = s.let("valid", !0);
          a.block$data(v, () => h(p, v)), a.ok(v);
        } else
          s.if((0, e.checkMissingProp)(a, i, p)), (0, e.reportMissingProp)(a, p), s.else();
      }
      function m() {
        s.forOf("prop", u, (p) => {
          a.setParams({ missingProperty: p }), s.if((0, e.noPropertyInData)(s, c, p, d.ownProperties), () => a.error());
        });
      }
      function h(p, v) {
        a.setParams({ missingProperty: p }), s.forOf(p, u, () => {
          s.assign(v, (0, e.propertyInData)(s, c, p, d.ownProperties)), s.if((0, t.not)(v), () => {
            a.error(), s.break();
          });
        }, t.nil);
      }
    }
  };
  return eo.default = o, eo;
}
var to = {}, Bu;
function by() {
  if (Bu) return to;
  Bu = 1, Object.defineProperty(to, "__esModule", { value: !0 });
  const e = ne(), r = {
    keyword: ["maxItems", "minItems"],
    type: "array",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: n, schemaCode: o }) {
        const a = n === "maxItems" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${a} than ${o} items`;
      },
      params: ({ schemaCode: n }) => (0, e._)`{limit: ${n}}`
    },
    code(n) {
      const { keyword: o, data: a, schemaCode: s } = n, i = o === "maxItems" ? e.operators.GT : e.operators.LT;
      n.fail$data((0, e._)`${a}.length ${i} ${s}`);
    }
  };
  return to.default = r, to;
}
var ro = {}, no = {}, Hu;
function Ri() {
  if (Hu) return no;
  Hu = 1, Object.defineProperty(no, "__esModule", { value: !0 });
  const e = Ip();
  return e.code = 'require("ajv/dist/runtime/equal").default', no.default = e, no;
}
var Wu;
function wy() {
  if (Wu) return ro;
  Wu = 1, Object.defineProperty(ro, "__esModule", { value: !0 });
  const e = Xo(), t = ne(), r = pe(), n = Ri(), a = {
    keyword: "uniqueItems",
    type: "array",
    schemaType: "boolean",
    $data: !0,
    error: {
      message: ({ params: { i: s, j: i } }) => (0, t.str)`must NOT have duplicate items (items ## ${i} and ${s} are identical)`,
      params: ({ params: { i: s, j: i } }) => (0, t._)`{i: ${s}, j: ${i}}`
    },
    code(s) {
      const { gen: i, data: u, $data: c, schema: l, parentSchema: y, schemaCode: d, it: f } = s;
      if (!c && !l)
        return;
      const g = i.let("valid"), _ = y.items ? (0, e.getSchemaTypes)(y.items) : [];
      s.block$data(g, m, (0, t._)`${d} === false`), s.ok(g);
      function m() {
        const $ = i.let("i", (0, t._)`${u}.length`), b = i.let("j");
        s.setParams({ i: $, j: b }), i.assign(g, !0), i.if((0, t._)`${$} > 1`, () => (h() ? p : v)($, b));
      }
      function h() {
        return _.length > 0 && !_.some(($) => $ === "object" || $ === "array");
      }
      function p($, b) {
        const E = i.name("item"), I = (0, e.checkDataTypes)(_, E, f.opts.strictNumbers, e.DataType.Wrong), O = i.const("indices", (0, t._)`{}`);
        i.for((0, t._)`;${$}--;`, () => {
          i.let(E, (0, t._)`${u}[${$}]`), i.if(I, (0, t._)`continue`), _.length > 1 && i.if((0, t._)`typeof ${E} == "string"`, (0, t._)`${E} += "_"`), i.if((0, t._)`typeof ${O}[${E}] == "number"`, () => {
            i.assign(b, (0, t._)`${O}[${E}]`), s.error(), i.assign(g, !1).break();
          }).code((0, t._)`${O}[${E}] = ${$}`);
        });
      }
      function v($, b) {
        const E = (0, r.useFunc)(i, n.default), I = i.name("outer");
        i.label(I).for((0, t._)`;${$}--;`, () => i.for((0, t._)`${b} = ${$}; ${b}--;`, () => i.if((0, t._)`${E}(${u}[${$}], ${u}[${b}])`, () => {
          s.error(), i.assign(g, !1).break(I);
        })));
      }
    }
  };
  return ro.default = a, ro;
}
var oo = {}, Ju;
function Ey() {
  if (Ju) return oo;
  Ju = 1, Object.defineProperty(oo, "__esModule", { value: !0 });
  const e = ne(), t = pe(), r = Ri(), o = {
    keyword: "const",
    $data: !0,
    error: {
      message: "must be equal to constant",
      params: ({ schemaCode: a }) => (0, e._)`{allowedValue: ${a}}`
    },
    code(a) {
      const { gen: s, data: i, $data: u, schemaCode: c, schema: l } = a;
      u || l && typeof l == "object" ? a.fail$data((0, e._)`!${(0, t.useFunc)(s, r.default)}(${i}, ${c})`) : a.fail((0, e._)`${l} !== ${i}`);
    }
  };
  return oo.default = o, oo;
}
var ao = {}, Ku;
function $y() {
  if (Ku) return ao;
  Ku = 1, Object.defineProperty(ao, "__esModule", { value: !0 });
  const e = ne(), t = pe(), r = Ri(), o = {
    keyword: "enum",
    schemaType: "array",
    $data: !0,
    error: {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode: a }) => (0, e._)`{allowedValues: ${a}}`
    },
    code(a) {
      const { gen: s, data: i, $data: u, schema: c, schemaCode: l, it: y } = a;
      if (!u && c.length === 0)
        throw new Error("enum must have non-empty array");
      const d = c.length >= y.opts.loopEnum;
      let f;
      const g = () => f ?? (f = (0, t.useFunc)(s, r.default));
      let _;
      if (d || u)
        _ = s.let("valid"), a.block$data(_, m);
      else {
        if (!Array.isArray(c))
          throw new Error("ajv implementation error");
        const p = s.const("vSchema", l);
        _ = (0, e.or)(...c.map((v, $) => h(p, $)));
      }
      a.pass(_);
      function m() {
        s.assign(_, !1), s.forOf("v", l, (p) => s.if((0, e._)`${g()}(${i}, ${p})`, () => s.assign(_, !0).break()));
      }
      function h(p, v) {
        const $ = c[v];
        return typeof $ == "object" && $ !== null ? (0, e._)`${g()}(${i}, ${p}[${v}])` : (0, e._)`${i} === ${$}`;
      }
    }
  };
  return ao.default = o, ao;
}
var Yu;
function Pp() {
  if (Yu) return Hn;
  Yu = 1, Object.defineProperty(Hn, "__esModule", { value: !0 });
  const e = py(), t = hy(), r = gy(), n = yy(), o = vy(), a = _y(), s = by(), i = wy(), u = Ey(), c = $y(), l = [
    // number
    e.default,
    t.default,
    // string
    r.default,
    n.default,
    // object
    o.default,
    a.default,
    // array
    s.default,
    i.default,
    // any
    { keyword: "type", schemaType: ["string", "array"] },
    { keyword: "nullable", schemaType: "boolean" },
    u.default,
    c.default
  ];
  return Hn.default = l, Hn;
}
var so = {}, yr = {}, Xu;
function kp() {
  if (Xu) return yr;
  Xu = 1, Object.defineProperty(yr, "__esModule", { value: !0 }), yr.validateAdditionalItems = void 0;
  const e = ne(), t = pe(), n = {
    keyword: "additionalItems",
    type: "array",
    schemaType: ["boolean", "object"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: a } }) => (0, e.str)`must NOT have more than ${a} items`,
      params: ({ params: { len: a } }) => (0, e._)`{limit: ${a}}`
    },
    code(a) {
      const { parentSchema: s, it: i } = a, { items: u } = s;
      if (!Array.isArray(u)) {
        (0, t.checkStrictMode)(i, '"additionalItems" is ignored when "items" is not an array of schemas');
        return;
      }
      o(a, u);
    }
  };
  function o(a, s) {
    const { gen: i, schema: u, data: c, keyword: l, it: y } = a;
    y.items = !0;
    const d = i.const("len", (0, e._)`${c}.length`);
    if (u === !1)
      a.setParams({ len: s.length }), a.pass((0, e._)`${d} <= ${s.length}`);
    else if (typeof u == "object" && !(0, t.alwaysValidSchema)(y, u)) {
      const g = i.var("valid", (0, e._)`${d} <= ${s.length}`);
      i.if((0, e.not)(g), () => f(g)), a.ok(g);
    }
    function f(g) {
      i.forRange("i", s.length, d, (_) => {
        a.subschema({ keyword: l, dataProp: _, dataPropType: t.Type.Num }, g), y.allErrors || i.if((0, e.not)(g), () => i.break());
      });
    }
  }
  return yr.validateAdditionalItems = o, yr.default = n, yr;
}
var io = {}, vr = {}, Qu;
function Np() {
  if (Qu) return vr;
  Qu = 1, Object.defineProperty(vr, "__esModule", { value: !0 }), vr.validateTuple = void 0;
  const e = ne(), t = pe(), r = ht(), n = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "array", "boolean"],
    before: "uniqueItems",
    code(a) {
      const { schema: s, it: i } = a;
      if (Array.isArray(s))
        return o(a, "additionalItems", s);
      i.items = !0, !(0, t.alwaysValidSchema)(i, s) && a.ok((0, r.validateArray)(a));
    }
  };
  function o(a, s, i = a.schema) {
    const { gen: u, parentSchema: c, data: l, keyword: y, it: d } = a;
    _(c), d.opts.unevaluated && i.length && d.items !== !0 && (d.items = t.mergeEvaluated.items(u, i.length, d.items));
    const f = u.name("valid"), g = u.const("len", (0, e._)`${l}.length`);
    i.forEach((m, h) => {
      (0, t.alwaysValidSchema)(d, m) || (u.if((0, e._)`${g} > ${h}`, () => a.subschema({
        keyword: y,
        schemaProp: h,
        dataProp: h
      }, f)), a.ok(f));
    });
    function _(m) {
      const { opts: h, errSchemaPath: p } = d, v = i.length, $ = v === m.minItems && (v === m.maxItems || m[s] === !1);
      if (h.strictTuples && !$) {
        const b = `"${y}" is ${v}-tuple, but minItems or maxItems/${s} are not specified or different at path "${p}"`;
        (0, t.checkStrictMode)(d, b, h.strictTuples);
      }
    }
  }
  return vr.validateTuple = o, vr.default = n, vr;
}
var ec;
function Sy() {
  if (ec) return io;
  ec = 1, Object.defineProperty(io, "__esModule", { value: !0 });
  const e = Np(), t = {
    keyword: "prefixItems",
    type: "array",
    schemaType: ["array"],
    before: "uniqueItems",
    code: (r) => (0, e.validateTuple)(r, "items")
  };
  return io.default = t, io;
}
var uo = {}, tc;
function Iy() {
  if (tc) return uo;
  tc = 1, Object.defineProperty(uo, "__esModule", { value: !0 });
  const e = ne(), t = pe(), r = ht(), n = kp(), a = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: s } }) => (0, e.str)`must NOT have more than ${s} items`,
      params: ({ params: { len: s } }) => (0, e._)`{limit: ${s}}`
    },
    code(s) {
      const { schema: i, parentSchema: u, it: c } = s, { prefixItems: l } = u;
      c.items = !0, !(0, t.alwaysValidSchema)(c, i) && (l ? (0, n.validateAdditionalItems)(s, l) : s.ok((0, r.validateArray)(s)));
    }
  };
  return uo.default = a, uo;
}
var co = {}, rc;
function Ty() {
  if (rc) return co;
  rc = 1, Object.defineProperty(co, "__esModule", { value: !0 });
  const e = ne(), t = pe(), n = {
    keyword: "contains",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    trackErrors: !0,
    error: {
      message: ({ params: { min: o, max: a } }) => a === void 0 ? (0, e.str)`must contain at least ${o} valid item(s)` : (0, e.str)`must contain at least ${o} and no more than ${a} valid item(s)`,
      params: ({ params: { min: o, max: a } }) => a === void 0 ? (0, e._)`{minContains: ${o}}` : (0, e._)`{minContains: ${o}, maxContains: ${a}}`
    },
    code(o) {
      const { gen: a, schema: s, parentSchema: i, data: u, it: c } = o;
      let l, y;
      const { minContains: d, maxContains: f } = i;
      c.opts.next ? (l = d === void 0 ? 1 : d, y = f) : l = 1;
      const g = a.const("len", (0, e._)`${u}.length`);
      if (o.setParams({ min: l, max: y }), y === void 0 && l === 0) {
        (0, t.checkStrictMode)(c, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
        return;
      }
      if (y !== void 0 && l > y) {
        (0, t.checkStrictMode)(c, '"minContains" > "maxContains" is always invalid'), o.fail();
        return;
      }
      if ((0, t.alwaysValidSchema)(c, s)) {
        let v = (0, e._)`${g} >= ${l}`;
        y !== void 0 && (v = (0, e._)`${v} && ${g} <= ${y}`), o.pass(v);
        return;
      }
      c.items = !0;
      const _ = a.name("valid");
      y === void 0 && l === 1 ? h(_, () => a.if(_, () => a.break())) : l === 0 ? (a.let(_, !0), y !== void 0 && a.if((0, e._)`${u}.length > 0`, m)) : (a.let(_, !1), m()), o.result(_, () => o.reset());
      function m() {
        const v = a.name("_valid"), $ = a.let("count", 0);
        h(v, () => a.if(v, () => p($)));
      }
      function h(v, $) {
        a.forRange("i", 0, g, (b) => {
          o.subschema({
            keyword: "contains",
            dataProp: b,
            dataPropType: t.Type.Num,
            compositeRule: !0
          }, v), $();
        });
      }
      function p(v) {
        a.code((0, e._)`${v}++`), y === void 0 ? a.if((0, e._)`${v} >= ${l}`, () => a.assign(_, !0).break()) : (a.if((0, e._)`${v} > ${y}`, () => a.assign(_, !1).break()), l === 1 ? a.assign(_, !0) : a.if((0, e._)`${v} >= ${l}`, () => a.assign(_, !0)));
      }
    }
  };
  return co.default = n, co;
}
var Da = {}, nc;
function Pi() {
  return nc || (nc = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
    const t = ne(), r = pe(), n = ht();
    e.error = {
      message: ({ params: { property: u, depsCount: c, deps: l } }) => {
        const y = c === 1 ? "property" : "properties";
        return (0, t.str)`must have ${y} ${l} when property ${u} is present`;
      },
      params: ({ params: { property: u, depsCount: c, deps: l, missingProperty: y } }) => (0, t._)`{property: ${u},
    missingProperty: ${y},
    depsCount: ${c},
    deps: ${l}}`
      // TODO change to reference
    };
    const o = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: e.error,
      code(u) {
        const [c, l] = a(u);
        s(u, c), i(u, l);
      }
    };
    function a({ schema: u }) {
      const c = {}, l = {};
      for (const y in u) {
        if (y === "__proto__")
          continue;
        const d = Array.isArray(u[y]) ? c : l;
        d[y] = u[y];
      }
      return [c, l];
    }
    function s(u, c = u.schema) {
      const { gen: l, data: y, it: d } = u;
      if (Object.keys(c).length === 0)
        return;
      const f = l.let("missing");
      for (const g in c) {
        const _ = c[g];
        if (_.length === 0)
          continue;
        const m = (0, n.propertyInData)(l, y, g, d.opts.ownProperties);
        u.setParams({
          property: g,
          depsCount: _.length,
          deps: _.join(", ")
        }), d.allErrors ? l.if(m, () => {
          for (const h of _)
            (0, n.checkReportMissingProp)(u, h);
        }) : (l.if((0, t._)`${m} && (${(0, n.checkMissingProp)(u, _, f)})`), (0, n.reportMissingProp)(u, f), l.else());
      }
    }
    e.validatePropertyDeps = s;
    function i(u, c = u.schema) {
      const { gen: l, data: y, keyword: d, it: f } = u, g = l.name("valid");
      for (const _ in c)
        (0, r.alwaysValidSchema)(f, c[_]) || (l.if(
          (0, n.propertyInData)(l, y, _, f.opts.ownProperties),
          () => {
            const m = u.subschema({ keyword: d, schemaProp: _ }, g);
            u.mergeValidEvaluated(m, g);
          },
          () => l.var(g, !0)
          // TODO var
        ), u.ok(g));
    }
    e.validateSchemaDeps = i, e.default = o;
  })(Da)), Da;
}
var lo = {}, oc;
function Oy() {
  if (oc) return lo;
  oc = 1, Object.defineProperty(lo, "__esModule", { value: !0 });
  const e = ne(), t = pe(), n = {
    keyword: "propertyNames",
    type: "object",
    schemaType: ["object", "boolean"],
    error: {
      message: "property name must be valid",
      params: ({ params: o }) => (0, e._)`{propertyName: ${o.propertyName}}`
    },
    code(o) {
      const { gen: a, schema: s, data: i, it: u } = o;
      if ((0, t.alwaysValidSchema)(u, s))
        return;
      const c = a.name("valid");
      a.forIn("key", i, (l) => {
        o.setParams({ propertyName: l }), o.subschema({
          keyword: "propertyNames",
          data: l,
          dataTypes: ["string"],
          propertyName: l,
          compositeRule: !0
        }, c), a.if((0, e.not)(c), () => {
          o.error(!0), u.allErrors || a.break();
        });
      }), o.ok(c);
    }
  };
  return lo.default = n, lo;
}
var fo = {}, ac;
function Ap() {
  if (ac) return fo;
  ac = 1, Object.defineProperty(fo, "__esModule", { value: !0 });
  const e = ht(), t = ne(), r = pt(), n = pe(), a = {
    keyword: "additionalProperties",
    type: ["object"],
    schemaType: ["boolean", "object"],
    allowUndefined: !0,
    trackErrors: !0,
    error: {
      message: "must NOT have additional properties",
      params: ({ params: s }) => (0, t._)`{additionalProperty: ${s.additionalProperty}}`
    },
    code(s) {
      const { gen: i, schema: u, parentSchema: c, data: l, errsCount: y, it: d } = s;
      if (!y)
        throw new Error("ajv implementation error");
      const { allErrors: f, opts: g } = d;
      if (d.props = !0, g.removeAdditional !== "all" && (0, n.alwaysValidSchema)(d, u))
        return;
      const _ = (0, e.allSchemaProperties)(c.properties), m = (0, e.allSchemaProperties)(c.patternProperties);
      h(), s.ok((0, t._)`${y} === ${r.default.errors}`);
      function h() {
        i.forIn("key", l, (E) => {
          !_.length && !m.length ? $(E) : i.if(p(E), () => $(E));
        });
      }
      function p(E) {
        let I;
        if (_.length > 8) {
          const O = (0, n.schemaRefOrVal)(d, c.properties, "properties");
          I = (0, e.isOwnProperty)(i, O, E);
        } else _.length ? I = (0, t.or)(..._.map((O) => (0, t._)`${E} === ${O}`)) : I = t.nil;
        return m.length && (I = (0, t.or)(I, ...m.map((O) => (0, t._)`${(0, e.usePattern)(s, O)}.test(${E})`))), (0, t.not)(I);
      }
      function v(E) {
        i.code((0, t._)`delete ${l}[${E}]`);
      }
      function $(E) {
        if (g.removeAdditional === "all" || g.removeAdditional && u === !1) {
          v(E);
          return;
        }
        if (u === !1) {
          s.setParams({ additionalProperty: E }), s.error(), f || i.break();
          return;
        }
        if (typeof u == "object" && !(0, n.alwaysValidSchema)(d, u)) {
          const I = i.name("valid");
          g.removeAdditional === "failing" ? (b(E, I, !1), i.if((0, t.not)(I), () => {
            s.reset(), v(E);
          })) : (b(E, I), f || i.if((0, t.not)(I), () => i.break()));
        }
      }
      function b(E, I, O) {
        const q = {
          keyword: "additionalProperties",
          dataProp: E,
          dataPropType: n.Type.Str
        };
        O === !1 && Object.assign(q, {
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }), s.subschema(q, I);
      }
    }
  };
  return fo.default = a, fo;
}
var po = {}, sc;
function Ry() {
  if (sc) return po;
  sc = 1, Object.defineProperty(po, "__esModule", { value: !0 });
  const e = Nn(), t = ht(), r = pe(), n = Ap(), o = {
    keyword: "properties",
    type: "object",
    schemaType: "object",
    code(a) {
      const { gen: s, schema: i, parentSchema: u, data: c, it: l } = a;
      l.opts.removeAdditional === "all" && u.additionalProperties === void 0 && n.default.code(new e.KeywordCxt(l, n.default, "additionalProperties"));
      const y = (0, t.allSchemaProperties)(i);
      for (const m of y)
        l.definedProperties.add(m);
      l.opts.unevaluated && y.length && l.props !== !0 && (l.props = r.mergeEvaluated.props(s, (0, r.toHash)(y), l.props));
      const d = y.filter((m) => !(0, r.alwaysValidSchema)(l, i[m]));
      if (d.length === 0)
        return;
      const f = s.name("valid");
      for (const m of d)
        g(m) ? _(m) : (s.if((0, t.propertyInData)(s, c, m, l.opts.ownProperties)), _(m), l.allErrors || s.else().var(f, !0), s.endIf()), a.it.definedProperties.add(m), a.ok(f);
      function g(m) {
        return l.opts.useDefaults && !l.compositeRule && i[m].default !== void 0;
      }
      function _(m) {
        a.subschema({
          keyword: "properties",
          schemaProp: m,
          dataProp: m
        }, f);
      }
    }
  };
  return po.default = o, po;
}
var ho = {}, ic;
function Py() {
  if (ic) return ho;
  ic = 1, Object.defineProperty(ho, "__esModule", { value: !0 });
  const e = ht(), t = ne(), r = pe(), n = pe(), o = {
    keyword: "patternProperties",
    type: "object",
    schemaType: "object",
    code(a) {
      const { gen: s, schema: i, data: u, parentSchema: c, it: l } = a, { opts: y } = l, d = (0, e.allSchemaProperties)(i), f = d.filter(($) => (0, r.alwaysValidSchema)(l, i[$]));
      if (d.length === 0 || f.length === d.length && (!l.opts.unevaluated || l.props === !0))
        return;
      const g = y.strictSchema && !y.allowMatchingProperties && c.properties, _ = s.name("valid");
      l.props !== !0 && !(l.props instanceof t.Name) && (l.props = (0, n.evaluatedPropsToName)(s, l.props));
      const { props: m } = l;
      h();
      function h() {
        for (const $ of d)
          g && p($), l.allErrors ? v($) : (s.var(_, !0), v($), s.if(_));
      }
      function p($) {
        for (const b in g)
          new RegExp($).test(b) && (0, r.checkStrictMode)(l, `property ${b} matches pattern ${$} (use allowMatchingProperties)`);
      }
      function v($) {
        s.forIn("key", u, (b) => {
          s.if((0, t._)`${(0, e.usePattern)(a, $)}.test(${b})`, () => {
            const E = f.includes($);
            E || a.subschema({
              keyword: "patternProperties",
              schemaProp: $,
              dataProp: b,
              dataPropType: n.Type.Str
            }, _), l.opts.unevaluated && m !== !0 ? s.assign((0, t._)`${m}[${b}]`, !0) : !E && !l.allErrors && s.if((0, t.not)(_), () => s.break());
          });
        });
      }
    }
  };
  return ho.default = o, ho;
}
var mo = {}, uc;
function ky() {
  if (uc) return mo;
  uc = 1, Object.defineProperty(mo, "__esModule", { value: !0 });
  const e = pe(), t = {
    keyword: "not",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    code(r) {
      const { gen: n, schema: o, it: a } = r;
      if ((0, e.alwaysValidSchema)(a, o)) {
        r.fail();
        return;
      }
      const s = n.name("valid");
      r.subschema({
        keyword: "not",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, s), r.failResult(s, () => r.reset(), () => r.error());
    },
    error: { message: "must NOT be valid" }
  };
  return mo.default = t, mo;
}
var go = {}, cc;
function Ny() {
  if (cc) return go;
  cc = 1, Object.defineProperty(go, "__esModule", { value: !0 });
  const t = {
    keyword: "anyOf",
    schemaType: "array",
    trackErrors: !0,
    code: ht().validateUnion,
    error: { message: "must match a schema in anyOf" }
  };
  return go.default = t, go;
}
var yo = {}, lc;
function Ay() {
  if (lc) return yo;
  lc = 1, Object.defineProperty(yo, "__esModule", { value: !0 });
  const e = ne(), t = pe(), n = {
    keyword: "oneOf",
    schemaType: "array",
    trackErrors: !0,
    error: {
      message: "must match exactly one schema in oneOf",
      params: ({ params: o }) => (0, e._)`{passingSchemas: ${o.passing}}`
    },
    code(o) {
      const { gen: a, schema: s, parentSchema: i, it: u } = o;
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      if (u.opts.discriminator && i.discriminator)
        return;
      const c = s, l = a.let("valid", !1), y = a.let("passing", null), d = a.name("_valid");
      o.setParams({ passing: y }), a.block(f), o.result(l, () => o.reset(), () => o.error(!0));
      function f() {
        c.forEach((g, _) => {
          let m;
          (0, t.alwaysValidSchema)(u, g) ? a.var(d, !0) : m = o.subschema({
            keyword: "oneOf",
            schemaProp: _,
            compositeRule: !0
          }, d), _ > 0 && a.if((0, e._)`${d} && ${l}`).assign(l, !1).assign(y, (0, e._)`[${y}, ${_}]`).else(), a.if(d, () => {
            a.assign(l, !0), a.assign(y, _), m && o.mergeEvaluated(m, e.Name);
          });
        });
      }
    }
  };
  return yo.default = n, yo;
}
var vo = {}, dc;
function Cy() {
  if (dc) return vo;
  dc = 1, Object.defineProperty(vo, "__esModule", { value: !0 });
  const e = pe(), t = {
    keyword: "allOf",
    schemaType: "array",
    code(r) {
      const { gen: n, schema: o, it: a } = r;
      if (!Array.isArray(o))
        throw new Error("ajv implementation error");
      const s = n.name("valid");
      o.forEach((i, u) => {
        if ((0, e.alwaysValidSchema)(a, i))
          return;
        const c = r.subschema({ keyword: "allOf", schemaProp: u }, s);
        r.ok(s), r.mergeEvaluated(c);
      });
    }
  };
  return vo.default = t, vo;
}
var _o = {}, fc;
function jy() {
  if (fc) return _o;
  fc = 1, Object.defineProperty(_o, "__esModule", { value: !0 });
  const e = ne(), t = pe(), n = {
    keyword: "if",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    error: {
      message: ({ params: a }) => (0, e.str)`must match "${a.ifClause}" schema`,
      params: ({ params: a }) => (0, e._)`{failingKeyword: ${a.ifClause}}`
    },
    code(a) {
      const { gen: s, parentSchema: i, it: u } = a;
      i.then === void 0 && i.else === void 0 && (0, t.checkStrictMode)(u, '"if" without "then" and "else" is ignored');
      const c = o(u, "then"), l = o(u, "else");
      if (!c && !l)
        return;
      const y = s.let("valid", !0), d = s.name("_valid");
      if (f(), a.reset(), c && l) {
        const _ = s.let("ifClause");
        a.setParams({ ifClause: _ }), s.if(d, g("then", _), g("else", _));
      } else c ? s.if(d, g("then")) : s.if((0, e.not)(d), g("else"));
      a.pass(y, () => a.error(!0));
      function f() {
        const _ = a.subschema({
          keyword: "if",
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }, d);
        a.mergeEvaluated(_);
      }
      function g(_, m) {
        return () => {
          const h = a.subschema({ keyword: _ }, d);
          s.assign(y, d), a.mergeValidEvaluated(h, y), m ? s.assign(m, (0, e._)`${_}`) : a.setParams({ ifClause: _ });
        };
      }
    }
  };
  function o(a, s) {
    const i = a.schema[s];
    return i !== void 0 && !(0, t.alwaysValidSchema)(a, i);
  }
  return _o.default = n, _o;
}
var bo = {}, pc;
function My() {
  if (pc) return bo;
  pc = 1, Object.defineProperty(bo, "__esModule", { value: !0 });
  const e = pe(), t = {
    keyword: ["then", "else"],
    schemaType: ["object", "boolean"],
    code({ keyword: r, parentSchema: n, it: o }) {
      n.if === void 0 && (0, e.checkStrictMode)(o, `"${r}" without "if" is ignored`);
    }
  };
  return bo.default = t, bo;
}
var hc;
function Cp() {
  if (hc) return so;
  hc = 1, Object.defineProperty(so, "__esModule", { value: !0 });
  const e = kp(), t = Sy(), r = Np(), n = Iy(), o = Ty(), a = Pi(), s = Oy(), i = Ap(), u = Ry(), c = Py(), l = ky(), y = Ny(), d = Ay(), f = Cy(), g = jy(), _ = My();
  function m(h = !1) {
    const p = [
      // any
      l.default,
      y.default,
      d.default,
      f.default,
      g.default,
      _.default,
      // object
      s.default,
      i.default,
      a.default,
      u.default,
      c.default
    ];
    return h ? p.push(t.default, n.default) : p.push(e.default, r.default), p.push(o.default), p;
  }
  return so.default = m, so;
}
var wo = {}, _r = {}, mc;
function jp() {
  if (mc) return _r;
  mc = 1, Object.defineProperty(_r, "__esModule", { value: !0 }), _r.dynamicAnchor = void 0;
  const e = ne(), t = pt(), r = da(), n = Oi(), o = {
    keyword: "$dynamicAnchor",
    schemaType: "string",
    code: (i) => a(i, i.schema)
  };
  function a(i, u) {
    const { gen: c, it: l } = i;
    l.schemaEnv.root.dynamicAnchors[u] = !0;
    const y = (0, e._)`${t.default.dynamicAnchors}${(0, e.getProperty)(u)}`, d = l.errSchemaPath === "#" ? l.validateName : s(i);
    c.if((0, e._)`!${y}`, () => c.assign(y, d));
  }
  _r.dynamicAnchor = a;
  function s(i) {
    const { schemaEnv: u, schema: c, self: l } = i.it, { root: y, baseId: d, localRefs: f, meta: g } = u.root, { schemaId: _ } = l.opts, m = new r.SchemaEnv({ schema: c, schemaId: _, root: y, baseId: d, localRefs: f, meta: g });
    return r.compileSchema.call(l, m), (0, n.getValidate)(i, m);
  }
  return _r.default = o, _r;
}
var br = {}, gc;
function Mp() {
  if (gc) return br;
  gc = 1, Object.defineProperty(br, "__esModule", { value: !0 }), br.dynamicRef = void 0;
  const e = ne(), t = pt(), r = Oi(), n = {
    keyword: "$dynamicRef",
    schemaType: "string",
    code: (a) => o(a, a.schema)
  };
  function o(a, s) {
    const { gen: i, keyword: u, it: c } = a;
    if (s[0] !== "#")
      throw new Error(`"${u}" only supports hash fragment reference`);
    const l = s.slice(1);
    if (c.allErrors)
      y();
    else {
      const f = i.let("valid", !1);
      y(f), a.ok(f);
    }
    function y(f) {
      if (c.schemaEnv.root.dynamicAnchors[l]) {
        const g = i.let("_v", (0, e._)`${t.default.dynamicAnchors}${(0, e.getProperty)(l)}`);
        i.if(g, d(g, f), d(c.validateName, f));
      } else
        d(c.validateName, f)();
    }
    function d(f, g) {
      return g ? () => i.block(() => {
        (0, r.callRef)(a, f), i.let(g, !0);
      }) : () => (0, r.callRef)(a, f);
    }
  }
  return br.dynamicRef = o, br.default = n, br;
}
var Eo = {}, yc;
function xy() {
  if (yc) return Eo;
  yc = 1, Object.defineProperty(Eo, "__esModule", { value: !0 });
  const e = jp(), t = pe(), r = {
    keyword: "$recursiveAnchor",
    schemaType: "boolean",
    code(n) {
      n.schema ? (0, e.dynamicAnchor)(n, "") : (0, t.checkStrictMode)(n.it, "$recursiveAnchor: false is ignored");
    }
  };
  return Eo.default = r, Eo;
}
var $o = {}, vc;
function Dy() {
  if (vc) return $o;
  vc = 1, Object.defineProperty($o, "__esModule", { value: !0 });
  const e = Mp(), t = {
    keyword: "$recursiveRef",
    schemaType: "string",
    code: (r) => (0, e.dynamicRef)(r, r.schema)
  };
  return $o.default = t, $o;
}
var _c;
function qy() {
  if (_c) return wo;
  _c = 1, Object.defineProperty(wo, "__esModule", { value: !0 });
  const e = jp(), t = Mp(), r = xy(), n = Dy(), o = [e.default, t.default, r.default, n.default];
  return wo.default = o, wo;
}
var So = {}, Io = {}, bc;
function Ly() {
  if (bc) return Io;
  bc = 1, Object.defineProperty(Io, "__esModule", { value: !0 });
  const e = Pi(), t = {
    keyword: "dependentRequired",
    type: "object",
    schemaType: "object",
    error: e.error,
    code: (r) => (0, e.validatePropertyDeps)(r)
  };
  return Io.default = t, Io;
}
var To = {}, wc;
function zy() {
  if (wc) return To;
  wc = 1, Object.defineProperty(To, "__esModule", { value: !0 });
  const e = Pi(), t = {
    keyword: "dependentSchemas",
    type: "object",
    schemaType: "object",
    code: (r) => (0, e.validateSchemaDeps)(r)
  };
  return To.default = t, To;
}
var Oo = {}, Ec;
function Vy() {
  if (Ec) return Oo;
  Ec = 1, Object.defineProperty(Oo, "__esModule", { value: !0 });
  const e = pe(), t = {
    keyword: ["maxContains", "minContains"],
    type: "array",
    schemaType: "number",
    code({ keyword: r, parentSchema: n, it: o }) {
      n.contains === void 0 && (0, e.checkStrictMode)(o, `"${r}" without "contains" is ignored`);
    }
  };
  return Oo.default = t, Oo;
}
var $c;
function Uy() {
  if ($c) return So;
  $c = 1, Object.defineProperty(So, "__esModule", { value: !0 });
  const e = Ly(), t = zy(), r = Vy(), n = [e.default, t.default, r.default];
  return So.default = n, So;
}
var Ro = {}, Po = {}, Sc;
function Fy() {
  if (Sc) return Po;
  Sc = 1, Object.defineProperty(Po, "__esModule", { value: !0 });
  const e = ne(), t = pe(), r = pt(), o = {
    keyword: "unevaluatedProperties",
    type: "object",
    schemaType: ["boolean", "object"],
    trackErrors: !0,
    error: {
      message: "must NOT have unevaluated properties",
      params: ({ params: a }) => (0, e._)`{unevaluatedProperty: ${a.unevaluatedProperty}}`
    },
    code(a) {
      const { gen: s, schema: i, data: u, errsCount: c, it: l } = a;
      if (!c)
        throw new Error("ajv implementation error");
      const { allErrors: y, props: d } = l;
      d instanceof e.Name ? s.if((0, e._)`${d} !== true`, () => s.forIn("key", u, (m) => s.if(g(d, m), () => f(m)))) : d !== !0 && s.forIn("key", u, (m) => d === void 0 ? f(m) : s.if(_(d, m), () => f(m))), l.props = !0, a.ok((0, e._)`${c} === ${r.default.errors}`);
      function f(m) {
        if (i === !1) {
          a.setParams({ unevaluatedProperty: m }), a.error(), y || s.break();
          return;
        }
        if (!(0, t.alwaysValidSchema)(l, i)) {
          const h = s.name("valid");
          a.subschema({
            keyword: "unevaluatedProperties",
            dataProp: m,
            dataPropType: t.Type.Str
          }, h), y || s.if((0, e.not)(h), () => s.break());
        }
      }
      function g(m, h) {
        return (0, e._)`!${m} || !${m}[${h}]`;
      }
      function _(m, h) {
        const p = [];
        for (const v in m)
          m[v] === !0 && p.push((0, e._)`${h} !== ${v}`);
        return (0, e.and)(...p);
      }
    }
  };
  return Po.default = o, Po;
}
var ko = {}, Ic;
function Zy() {
  if (Ic) return ko;
  Ic = 1, Object.defineProperty(ko, "__esModule", { value: !0 });
  const e = ne(), t = pe(), n = {
    keyword: "unevaluatedItems",
    type: "array",
    schemaType: ["boolean", "object"],
    error: {
      message: ({ params: { len: o } }) => (0, e.str)`must NOT have more than ${o} items`,
      params: ({ params: { len: o } }) => (0, e._)`{limit: ${o}}`
    },
    code(o) {
      const { gen: a, schema: s, data: i, it: u } = o, c = u.items || 0;
      if (c === !0)
        return;
      const l = a.const("len", (0, e._)`${i}.length`);
      if (s === !1)
        o.setParams({ len: c }), o.fail((0, e._)`${l} > ${c}`);
      else if (typeof s == "object" && !(0, t.alwaysValidSchema)(u, s)) {
        const d = a.var("valid", (0, e._)`${l} <= ${c}`);
        a.if((0, e.not)(d), () => y(d, c)), o.ok(d);
      }
      u.items = !0;
      function y(d, f) {
        a.forRange("i", f, l, (g) => {
          o.subschema({ keyword: "unevaluatedItems", dataProp: g, dataPropType: t.Type.Num }, d), u.allErrors || a.if((0, e.not)(d), () => a.break());
        });
      }
    }
  };
  return ko.default = n, ko;
}
var Tc;
function Gy() {
  if (Tc) return Ro;
  Tc = 1, Object.defineProperty(Ro, "__esModule", { value: !0 });
  const e = Fy(), t = Zy(), r = [e.default, t.default];
  return Ro.default = r, Ro;
}
var No = {}, Ao = {}, Oc;
function By() {
  if (Oc) return Ao;
  Oc = 1, Object.defineProperty(Ao, "__esModule", { value: !0 });
  const e = ne(), r = {
    keyword: "format",
    type: ["number", "string"],
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: n }) => (0, e.str)`must match format "${n}"`,
      params: ({ schemaCode: n }) => (0, e._)`{format: ${n}}`
    },
    code(n, o) {
      const { gen: a, data: s, $data: i, schema: u, schemaCode: c, it: l } = n, { opts: y, errSchemaPath: d, schemaEnv: f, self: g } = l;
      if (!y.validateFormats)
        return;
      i ? _() : m();
      function _() {
        const h = a.scopeValue("formats", {
          ref: g.formats,
          code: y.code.formats
        }), p = a.const("fDef", (0, e._)`${h}[${c}]`), v = a.let("fType"), $ = a.let("format");
        a.if((0, e._)`typeof ${p} == "object" && !(${p} instanceof RegExp)`, () => a.assign(v, (0, e._)`${p}.type || "string"`).assign($, (0, e._)`${p}.validate`), () => a.assign(v, (0, e._)`"string"`).assign($, p)), n.fail$data((0, e.or)(b(), E()));
        function b() {
          return y.strictSchema === !1 ? e.nil : (0, e._)`${c} && !${$}`;
        }
        function E() {
          const I = f.$async ? (0, e._)`(${p}.async ? await ${$}(${s}) : ${$}(${s}))` : (0, e._)`${$}(${s})`, O = (0, e._)`(typeof ${$} == "function" ? ${I} : ${$}.test(${s}))`;
          return (0, e._)`${$} && ${$} !== true && ${v} === ${o} && !${O}`;
        }
      }
      function m() {
        const h = g.formats[u];
        if (!h) {
          b();
          return;
        }
        if (h === !0)
          return;
        const [p, v, $] = E(h);
        p === o && n.pass(I());
        function b() {
          if (y.strictSchema === !1) {
            g.logger.warn(O());
            return;
          }
          throw new Error(O());
          function O() {
            return `unknown format "${u}" ignored in schema at path "${d}"`;
          }
        }
        function E(O) {
          const q = O instanceof RegExp ? (0, e.regexpCode)(O) : y.code.formats ? (0, e._)`${y.code.formats}${(0, e.getProperty)(u)}` : void 0, H = a.scopeValue("formats", { key: u, ref: O, code: q });
          return typeof O == "object" && !(O instanceof RegExp) ? [O.type || "string", O.validate, (0, e._)`${H}.validate`] : ["string", O, H];
        }
        function I() {
          if (typeof h == "object" && !(h instanceof RegExp) && h.async) {
            if (!f.$async)
              throw new Error("async format in sync schema");
            return (0, e._)`await ${$}(${s})`;
          }
          return typeof v == "function" ? (0, e._)`${$}(${s})` : (0, e._)`${$}.test(${s})`;
        }
      }
    }
  };
  return Ao.default = r, Ao;
}
var Rc;
function xp() {
  if (Rc) return No;
  Rc = 1, Object.defineProperty(No, "__esModule", { value: !0 });
  const t = [By().default];
  return No.default = t, No;
}
var Yt = {}, Pc;
function Dp() {
  return Pc || (Pc = 1, Object.defineProperty(Yt, "__esModule", { value: !0 }), Yt.contentVocabulary = Yt.metadataVocabulary = void 0, Yt.metadataVocabulary = [
    "title",
    "description",
    "default",
    "deprecated",
    "readOnly",
    "writeOnly",
    "examples"
  ], Yt.contentVocabulary = [
    "contentMediaType",
    "contentEncoding",
    "contentSchema"
  ]), Yt;
}
var kc;
function Hy() {
  if (kc) return Zn;
  kc = 1, Object.defineProperty(Zn, "__esModule", { value: !0 });
  const e = Rp(), t = Pp(), r = Cp(), n = qy(), o = Uy(), a = Gy(), s = xp(), i = Dp(), u = [
    n.default,
    e.default,
    t.default,
    (0, r.default)(!0),
    s.default,
    i.metadataVocabulary,
    i.contentVocabulary,
    o.default,
    a.default
  ];
  return Zn.default = u, Zn;
}
var Co = {}, Wr = {}, Nc;
function Wy() {
  if (Nc) return Wr;
  Nc = 1, Object.defineProperty(Wr, "__esModule", { value: !0 }), Wr.DiscrError = void 0;
  var e;
  return (function(t) {
    t.Tag = "tag", t.Mapping = "mapping";
  })(e || (Wr.DiscrError = e = {})), Wr;
}
var Ac;
function qp() {
  if (Ac) return Co;
  Ac = 1, Object.defineProperty(Co, "__esModule", { value: !0 });
  const e = ne(), t = Wy(), r = da(), n = An(), o = pe(), s = {
    keyword: "discriminator",
    type: "object",
    schemaType: "object",
    error: {
      message: ({ params: { discrError: i, tagName: u } }) => i === t.DiscrError.Tag ? `tag "${u}" must be string` : `value of tag "${u}" must be in oneOf`,
      params: ({ params: { discrError: i, tag: u, tagName: c } }) => (0, e._)`{error: ${i}, tag: ${c}, tagValue: ${u}}`
    },
    code(i) {
      const { gen: u, data: c, schema: l, parentSchema: y, it: d } = i, { oneOf: f } = y;
      if (!d.opts.discriminator)
        throw new Error("discriminator: requires discriminator option");
      const g = l.propertyName;
      if (typeof g != "string")
        throw new Error("discriminator: requires propertyName");
      if (l.mapping)
        throw new Error("discriminator: mapping is not supported");
      if (!f)
        throw new Error("discriminator: requires oneOf keyword");
      const _ = u.let("valid", !1), m = u.const("tag", (0, e._)`${c}${(0, e.getProperty)(g)}`);
      u.if((0, e._)`typeof ${m} == "string"`, () => h(), () => i.error(!1, { discrError: t.DiscrError.Tag, tag: m, tagName: g })), i.ok(_);
      function h() {
        const $ = v();
        u.if(!1);
        for (const b in $)
          u.elseIf((0, e._)`${m} === ${b}`), u.assign(_, p($[b]));
        u.else(), i.error(!1, { discrError: t.DiscrError.Mapping, tag: m, tagName: g }), u.endIf();
      }
      function p($) {
        const b = u.name("valid"), E = i.subschema({ keyword: "oneOf", schemaProp: $ }, b);
        return i.mergeEvaluated(E, e.Name), b;
      }
      function v() {
        var $;
        const b = {}, E = O(y);
        let I = !0;
        for (let x = 0; x < f.length; x++) {
          let W = f[x];
          if (W != null && W.$ref && !(0, o.schemaHasRulesButRef)(W, d.self.RULES)) {
            const M = W.$ref;
            if (W = r.resolveRef.call(d.self, d.schemaEnv.root, d.baseId, M), W instanceof r.SchemaEnv && (W = W.schema), W === void 0)
              throw new n.default(d.opts.uriResolver, d.baseId, M);
          }
          const K = ($ = W == null ? void 0 : W.properties) === null || $ === void 0 ? void 0 : $[g];
          if (typeof K != "object")
            throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${g}"`);
          I = I && (E || O(W)), q(K, x);
        }
        if (!I)
          throw new Error(`discriminator: "${g}" must be required`);
        return b;
        function O({ required: x }) {
          return Array.isArray(x) && x.includes(g);
        }
        function q(x, W) {
          if (x.const)
            H(x.const, W);
          else if (x.enum)
            for (const K of x.enum)
              H(K, W);
          else
            throw new Error(`discriminator: "properties/${g}" must have "const" or "enum"`);
        }
        function H(x, W) {
          if (typeof x != "string" || x in b)
            throw new Error(`discriminator: "${g}" values must be unique strings`);
          b[x] = W;
        }
      }
    }
  };
  return Co.default = s, Co;
}
var jo = {};
const Jy = "https://json-schema.org/draft/2020-12/schema", Ky = "https://json-schema.org/draft/2020-12/schema", Yy = { "https://json-schema.org/draft/2020-12/vocab/core": !0, "https://json-schema.org/draft/2020-12/vocab/applicator": !0, "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0, "https://json-schema.org/draft/2020-12/vocab/validation": !0, "https://json-schema.org/draft/2020-12/vocab/meta-data": !0, "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0, "https://json-schema.org/draft/2020-12/vocab/content": !0 }, Xy = "meta", Qy = "Core and Validation specifications meta-schema", ev = [{ $ref: "meta/core" }, { $ref: "meta/applicator" }, { $ref: "meta/unevaluated" }, { $ref: "meta/validation" }, { $ref: "meta/meta-data" }, { $ref: "meta/format-annotation" }, { $ref: "meta/content" }], tv = ["object", "boolean"], rv = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", nv = { definitions: { $comment: '"definitions" has been replaced by "$defs".', type: "object", additionalProperties: { $dynamicRef: "#meta" }, deprecated: !0, default: {} }, dependencies: { $comment: '"dependencies" has been split and replaced by "dependentSchemas" and "dependentRequired" in order to serve their differing semantics.', type: "object", additionalProperties: { anyOf: [{ $dynamicRef: "#meta" }, { $ref: "meta/validation#/$defs/stringArray" }] }, deprecated: !0, default: {} }, $recursiveAnchor: { $comment: '"$recursiveAnchor" has been replaced by "$dynamicAnchor".', $ref: "meta/core#/$defs/anchorString", deprecated: !0 }, $recursiveRef: { $comment: '"$recursiveRef" has been replaced by "$dynamicRef".', $ref: "meta/core#/$defs/uriReferenceString", deprecated: !0 } }, ov = {
  $schema: Jy,
  $id: Ky,
  $vocabulary: Yy,
  $dynamicAnchor: Xy,
  title: Qy,
  allOf: ev,
  type: tv,
  $comment: rv,
  properties: nv
}, av = "https://json-schema.org/draft/2020-12/schema", sv = "https://json-schema.org/draft/2020-12/meta/applicator", iv = { "https://json-schema.org/draft/2020-12/vocab/applicator": !0 }, uv = "meta", cv = "Applicator vocabulary meta-schema", lv = ["object", "boolean"], dv = { prefixItems: { $ref: "#/$defs/schemaArray" }, items: { $dynamicRef: "#meta" }, contains: { $dynamicRef: "#meta" }, additionalProperties: { $dynamicRef: "#meta" }, properties: { type: "object", additionalProperties: { $dynamicRef: "#meta" }, default: {} }, patternProperties: { type: "object", additionalProperties: { $dynamicRef: "#meta" }, propertyNames: { format: "regex" }, default: {} }, dependentSchemas: { type: "object", additionalProperties: { $dynamicRef: "#meta" }, default: {} }, propertyNames: { $dynamicRef: "#meta" }, if: { $dynamicRef: "#meta" }, then: { $dynamicRef: "#meta" }, else: { $dynamicRef: "#meta" }, allOf: { $ref: "#/$defs/schemaArray" }, anyOf: { $ref: "#/$defs/schemaArray" }, oneOf: { $ref: "#/$defs/schemaArray" }, not: { $dynamicRef: "#meta" } }, fv = { schemaArray: { type: "array", minItems: 1, items: { $dynamicRef: "#meta" } } }, pv = {
  $schema: av,
  $id: sv,
  $vocabulary: iv,
  $dynamicAnchor: uv,
  title: cv,
  type: lv,
  properties: dv,
  $defs: fv
}, hv = "https://json-schema.org/draft/2020-12/schema", mv = "https://json-schema.org/draft/2020-12/meta/unevaluated", gv = { "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0 }, yv = "meta", vv = "Unevaluated applicator vocabulary meta-schema", _v = ["object", "boolean"], bv = { unevaluatedItems: { $dynamicRef: "#meta" }, unevaluatedProperties: { $dynamicRef: "#meta" } }, wv = {
  $schema: hv,
  $id: mv,
  $vocabulary: gv,
  $dynamicAnchor: yv,
  title: vv,
  type: _v,
  properties: bv
}, Ev = "https://json-schema.org/draft/2020-12/schema", $v = "https://json-schema.org/draft/2020-12/meta/content", Sv = { "https://json-schema.org/draft/2020-12/vocab/content": !0 }, Iv = "meta", Tv = "Content vocabulary meta-schema", Ov = ["object", "boolean"], Rv = { contentEncoding: { type: "string" }, contentMediaType: { type: "string" }, contentSchema: { $dynamicRef: "#meta" } }, Pv = {
  $schema: Ev,
  $id: $v,
  $vocabulary: Sv,
  $dynamicAnchor: Iv,
  title: Tv,
  type: Ov,
  properties: Rv
}, kv = "https://json-schema.org/draft/2020-12/schema", Nv = "https://json-schema.org/draft/2020-12/meta/core", Av = { "https://json-schema.org/draft/2020-12/vocab/core": !0 }, Cv = "meta", jv = "Core vocabulary meta-schema", Mv = ["object", "boolean"], xv = { $id: { $ref: "#/$defs/uriReferenceString", $comment: "Non-empty fragments not allowed.", pattern: "^[^#]*#?$" }, $schema: { $ref: "#/$defs/uriString" }, $ref: { $ref: "#/$defs/uriReferenceString" }, $anchor: { $ref: "#/$defs/anchorString" }, $dynamicRef: { $ref: "#/$defs/uriReferenceString" }, $dynamicAnchor: { $ref: "#/$defs/anchorString" }, $vocabulary: { type: "object", propertyNames: { $ref: "#/$defs/uriString" }, additionalProperties: { type: "boolean" } }, $comment: { type: "string" }, $defs: { type: "object", additionalProperties: { $dynamicRef: "#meta" } } }, Dv = { anchorString: { type: "string", pattern: "^[A-Za-z_][-A-Za-z0-9._]*$" }, uriString: { type: "string", format: "uri" }, uriReferenceString: { type: "string", format: "uri-reference" } }, qv = {
  $schema: kv,
  $id: Nv,
  $vocabulary: Av,
  $dynamicAnchor: Cv,
  title: jv,
  type: Mv,
  properties: xv,
  $defs: Dv
}, Lv = "https://json-schema.org/draft/2020-12/schema", zv = "https://json-schema.org/draft/2020-12/meta/format-annotation", Vv = { "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0 }, Uv = "meta", Fv = "Format vocabulary meta-schema for annotation results", Zv = ["object", "boolean"], Gv = { format: { type: "string" } }, Bv = {
  $schema: Lv,
  $id: zv,
  $vocabulary: Vv,
  $dynamicAnchor: Uv,
  title: Fv,
  type: Zv,
  properties: Gv
}, Hv = "https://json-schema.org/draft/2020-12/schema", Wv = "https://json-schema.org/draft/2020-12/meta/meta-data", Jv = { "https://json-schema.org/draft/2020-12/vocab/meta-data": !0 }, Kv = "meta", Yv = "Meta-data vocabulary meta-schema", Xv = ["object", "boolean"], Qv = { title: { type: "string" }, description: { type: "string" }, default: !0, deprecated: { type: "boolean", default: !1 }, readOnly: { type: "boolean", default: !1 }, writeOnly: { type: "boolean", default: !1 }, examples: { type: "array", items: !0 } }, e_ = {
  $schema: Hv,
  $id: Wv,
  $vocabulary: Jv,
  $dynamicAnchor: Kv,
  title: Yv,
  type: Xv,
  properties: Qv
}, t_ = "https://json-schema.org/draft/2020-12/schema", r_ = "https://json-schema.org/draft/2020-12/meta/validation", n_ = { "https://json-schema.org/draft/2020-12/vocab/validation": !0 }, o_ = "meta", a_ = "Validation vocabulary meta-schema", s_ = ["object", "boolean"], i_ = { type: { anyOf: [{ $ref: "#/$defs/simpleTypes" }, { type: "array", items: { $ref: "#/$defs/simpleTypes" }, minItems: 1, uniqueItems: !0 }] }, const: !0, enum: { type: "array", items: !0 }, multipleOf: { type: "number", exclusiveMinimum: 0 }, maximum: { type: "number" }, exclusiveMaximum: { type: "number" }, minimum: { type: "number" }, exclusiveMinimum: { type: "number" }, maxLength: { $ref: "#/$defs/nonNegativeInteger" }, minLength: { $ref: "#/$defs/nonNegativeIntegerDefault0" }, pattern: { type: "string", format: "regex" }, maxItems: { $ref: "#/$defs/nonNegativeInteger" }, minItems: { $ref: "#/$defs/nonNegativeIntegerDefault0" }, uniqueItems: { type: "boolean", default: !1 }, maxContains: { $ref: "#/$defs/nonNegativeInteger" }, minContains: { $ref: "#/$defs/nonNegativeInteger", default: 1 }, maxProperties: { $ref: "#/$defs/nonNegativeInteger" }, minProperties: { $ref: "#/$defs/nonNegativeIntegerDefault0" }, required: { $ref: "#/$defs/stringArray" }, dependentRequired: { type: "object", additionalProperties: { $ref: "#/$defs/stringArray" } } }, u_ = { nonNegativeInteger: { type: "integer", minimum: 0 }, nonNegativeIntegerDefault0: { $ref: "#/$defs/nonNegativeInteger", default: 0 }, simpleTypes: { enum: ["array", "boolean", "integer", "null", "number", "object", "string"] }, stringArray: { type: "array", items: { type: "string" }, uniqueItems: !0, default: [] } }, c_ = {
  $schema: t_,
  $id: r_,
  $vocabulary: n_,
  $dynamicAnchor: o_,
  title: a_,
  type: s_,
  properties: i_,
  $defs: u_
};
var Cc;
function l_() {
  if (Cc) return jo;
  Cc = 1, Object.defineProperty(jo, "__esModule", { value: !0 });
  const e = ov, t = pv, r = wv, n = Pv, o = qv, a = Bv, s = e_, i = c_, u = ["/properties"];
  function c(l) {
    return [
      e,
      t,
      r,
      n,
      o,
      y(this, a),
      s,
      y(this, i)
    ].forEach((d) => this.addMetaSchema(d, void 0, !1)), this;
    function y(d, f) {
      return l ? d.$dataMetaSchema(f, u) : f;
    }
  }
  return jo.default = c, jo;
}
var jc;
function d_() {
  return jc || (jc = 1, (function(e, t) {
    Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv2020 = void 0;
    const r = Op(), n = Hy(), o = qp(), a = l_(), s = "https://json-schema.org/draft/2020-12/schema";
    class i extends r.default {
      constructor(f = {}) {
        super({
          ...f,
          dynamicRef: !0,
          next: !0,
          unevaluated: !0
        });
      }
      _addVocabularies() {
        super._addVocabularies(), n.default.forEach((f) => this.addVocabulary(f)), this.opts.discriminator && this.addKeyword(o.default);
      }
      _addDefaultMetaSchema() {
        super._addDefaultMetaSchema();
        const { $data: f, meta: g } = this.opts;
        g && (a.default.call(this, f), this.refs["http://json-schema.org/schema"] = s);
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(s) ? s : void 0);
      }
    }
    t.Ajv2020 = i, e.exports = t = i, e.exports.Ajv2020 = i, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = i;
    var u = Nn();
    Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
      return u.KeywordCxt;
    } });
    var c = ne();
    Object.defineProperty(t, "_", { enumerable: !0, get: function() {
      return c._;
    } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
      return c.str;
    } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
      return c.stringify;
    } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
      return c.nil;
    } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
      return c.Name;
    } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
      return c.CodeGen;
    } });
    var l = la();
    Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
      return l.default;
    } });
    var y = An();
    Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
      return y.default;
    } });
  })(Ln, Ln.exports)), Ln.exports;
}
var f_ = d_(), Mo = { exports: {} }, qa = {}, Mc;
function p_() {
  return Mc || (Mc = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
    function t(x, W) {
      return { validate: x, compare: W };
    }
    e.fullFormats = {
      // date: http://tools.ietf.org/html/rfc3339#section-5.6
      date: t(a, s),
      // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
      time: t(u(!0), c),
      "date-time": t(d(!0), f),
      "iso-time": t(u(), l),
      "iso-date-time": t(d(), g),
      // duration: https://tools.ietf.org/html/rfc3339#appendix-A
      duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
      uri: h,
      "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
      // uri-template: https://tools.ietf.org/html/rfc6570
      "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
      // For the source: https://gist.github.com/dperini/729294
      // For test cases: https://mathiasbynens.be/demo/url-regex
      url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
      email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
      hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
      // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
      ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
      ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
      regex: H,
      // uuid: http://tools.ietf.org/html/rfc4122
      uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
      // JSON-pointer: https://tools.ietf.org/html/rfc6901
      // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
      "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
      "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
      // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
      "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
      // the following formats are used by the openapi specification: https://spec.openapis.org/oas/v3.0.0#data-types
      // byte: https://github.com/miguelmota/is-base64
      byte: v,
      // signed 32 bit integer
      int32: { type: "number", validate: E },
      // signed 64 bit integer
      int64: { type: "number", validate: I },
      // C-type float
      float: { type: "number", validate: O },
      // C-type double
      double: { type: "number", validate: O },
      // hint to the UI to hide input strings
      password: !0,
      // unchecked string payload
      binary: !0
    }, e.fastFormats = {
      ...e.fullFormats,
      date: t(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, s),
      time: t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, c),
      "date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, f),
      "iso-time": t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, l),
      "iso-date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, g),
      // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
      uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
      "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
      // email (sources from jsen validator):
      // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
      // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
      email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
    }, e.formatNames = Object.keys(e.fullFormats);
    function r(x) {
      return x % 4 === 0 && (x % 100 !== 0 || x % 400 === 0);
    }
    const n = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, o = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function a(x) {
      const W = n.exec(x);
      if (!W)
        return !1;
      const K = +W[1], M = +W[2], L = +W[3];
      return M >= 1 && M <= 12 && L >= 1 && L <= (M === 2 && r(K) ? 29 : o[M]);
    }
    function s(x, W) {
      if (x && W)
        return x > W ? 1 : x < W ? -1 : 0;
    }
    const i = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
    function u(x) {
      return function(K) {
        const M = i.exec(K);
        if (!M)
          return !1;
        const L = +M[1], F = +M[2], G = +M[3], B = M[4], Q = M[5] === "-" ? -1 : 1, D = +(M[6] || 0), P = +(M[7] || 0);
        if (D > 23 || P > 59 || x && !B)
          return !1;
        if (L <= 23 && F <= 59 && G < 60)
          return !0;
        const C = F - P * Q, k = L - D * Q - (C < 0 ? 1 : 0);
        return (k === 23 || k === -1) && (C === 59 || C === -1) && G < 61;
      };
    }
    function c(x, W) {
      if (!(x && W))
        return;
      const K = (/* @__PURE__ */ new Date("2020-01-01T" + x)).valueOf(), M = (/* @__PURE__ */ new Date("2020-01-01T" + W)).valueOf();
      if (K && M)
        return K - M;
    }
    function l(x, W) {
      if (!(x && W))
        return;
      const K = i.exec(x), M = i.exec(W);
      if (K && M)
        return x = K[1] + K[2] + K[3], W = M[1] + M[2] + M[3], x > W ? 1 : x < W ? -1 : 0;
    }
    const y = /t|\s/i;
    function d(x) {
      const W = u(x);
      return function(M) {
        const L = M.split(y);
        return L.length === 2 && a(L[0]) && W(L[1]);
      };
    }
    function f(x, W) {
      if (!(x && W))
        return;
      const K = new Date(x).valueOf(), M = new Date(W).valueOf();
      if (K && M)
        return K - M;
    }
    function g(x, W) {
      if (!(x && W))
        return;
      const [K, M] = x.split(y), [L, F] = W.split(y), G = s(K, L);
      if (G !== void 0)
        return G || c(M, F);
    }
    const _ = /\/|:/, m = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
    function h(x) {
      return _.test(x) && m.test(x);
    }
    const p = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
    function v(x) {
      return p.lastIndex = 0, p.test(x);
    }
    const $ = -2147483648, b = 2 ** 31 - 1;
    function E(x) {
      return Number.isInteger(x) && x <= b && x >= $;
    }
    function I(x) {
      return Number.isInteger(x);
    }
    function O() {
      return !0;
    }
    const q = /[^\\]\\Z/;
    function H(x) {
      if (q.test(x))
        return !1;
      try {
        return new RegExp(x), !0;
      } catch {
        return !1;
      }
    }
  })(qa)), qa;
}
var La = {}, xo = { exports: {} }, Do = {}, xc;
function h_() {
  if (xc) return Do;
  xc = 1, Object.defineProperty(Do, "__esModule", { value: !0 });
  const e = Rp(), t = Pp(), r = Cp(), n = xp(), o = Dp(), a = [
    e.default,
    t.default,
    (0, r.default)(),
    n.default,
    o.metadataVocabulary,
    o.contentVocabulary
  ];
  return Do.default = a, Do;
}
const m_ = "http://json-schema.org/draft-07/schema#", g_ = "http://json-schema.org/draft-07/schema#", y_ = "Core schema meta-schema", v_ = { schemaArray: { type: "array", minItems: 1, items: { $ref: "#" } }, nonNegativeInteger: { type: "integer", minimum: 0 }, nonNegativeIntegerDefault0: { allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }] }, simpleTypes: { enum: ["array", "boolean", "integer", "null", "number", "object", "string"] }, stringArray: { type: "array", items: { type: "string" }, uniqueItems: !0, default: [] } }, __ = ["object", "boolean"], b_ = { $id: { type: "string", format: "uri-reference" }, $schema: { type: "string", format: "uri" }, $ref: { type: "string", format: "uri-reference" }, $comment: { type: "string" }, title: { type: "string" }, description: { type: "string" }, default: !0, readOnly: { type: "boolean", default: !1 }, examples: { type: "array", items: !0 }, multipleOf: { type: "number", exclusiveMinimum: 0 }, maximum: { type: "number" }, exclusiveMaximum: { type: "number" }, minimum: { type: "number" }, exclusiveMinimum: { type: "number" }, maxLength: { $ref: "#/definitions/nonNegativeInteger" }, minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, pattern: { type: "string", format: "regex" }, additionalItems: { $ref: "#" }, items: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }], default: !0 }, maxItems: { $ref: "#/definitions/nonNegativeInteger" }, minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, uniqueItems: { type: "boolean", default: !1 }, contains: { $ref: "#" }, maxProperties: { $ref: "#/definitions/nonNegativeInteger" }, minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, required: { $ref: "#/definitions/stringArray" }, additionalProperties: { $ref: "#" }, definitions: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, properties: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, patternProperties: { type: "object", additionalProperties: { $ref: "#" }, propertyNames: { format: "regex" }, default: {} }, dependencies: { type: "object", additionalProperties: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }] } }, propertyNames: { $ref: "#" }, const: !0, enum: { type: "array", items: !0, minItems: 1, uniqueItems: !0 }, type: { anyOf: [{ $ref: "#/definitions/simpleTypes" }, { type: "array", items: { $ref: "#/definitions/simpleTypes" }, minItems: 1, uniqueItems: !0 }] }, format: { type: "string" }, contentMediaType: { type: "string" }, contentEncoding: { type: "string" }, if: { $ref: "#" }, then: { $ref: "#" }, else: { $ref: "#" }, allOf: { $ref: "#/definitions/schemaArray" }, anyOf: { $ref: "#/definitions/schemaArray" }, oneOf: { $ref: "#/definitions/schemaArray" }, not: { $ref: "#" } }, w_ = {
  $schema: m_,
  $id: g_,
  title: y_,
  definitions: v_,
  type: __,
  properties: b_,
  default: !0
};
var Dc;
function E_() {
  return Dc || (Dc = 1, (function(e, t) {
    Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
    const r = Op(), n = h_(), o = qp(), a = w_, s = ["/properties"], i = "http://json-schema.org/draft-07/schema";
    class u extends r.default {
      _addVocabularies() {
        super._addVocabularies(), n.default.forEach((g) => this.addVocabulary(g)), this.opts.discriminator && this.addKeyword(o.default);
      }
      _addDefaultMetaSchema() {
        if (super._addDefaultMetaSchema(), !this.opts.meta)
          return;
        const g = this.opts.$data ? this.$dataMetaSchema(a, s) : a;
        this.addMetaSchema(g, i, !1), this.refs["http://json-schema.org/schema"] = i;
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(i) ? i : void 0);
      }
    }
    t.Ajv = u, e.exports = t = u, e.exports.Ajv = u, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = u;
    var c = Nn();
    Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
      return c.KeywordCxt;
    } });
    var l = ne();
    Object.defineProperty(t, "_", { enumerable: !0, get: function() {
      return l._;
    } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
      return l.str;
    } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
      return l.stringify;
    } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
      return l.nil;
    } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
      return l.Name;
    } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
      return l.CodeGen;
    } });
    var y = la();
    Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
      return y.default;
    } });
    var d = An();
    Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
      return d.default;
    } });
  })(xo, xo.exports)), xo.exports;
}
var qc;
function $_() {
  return qc || (qc = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
    const t = E_(), r = ne(), n = r.operators, o = {
      formatMaximum: { okStr: "<=", ok: n.LTE, fail: n.GT },
      formatMinimum: { okStr: ">=", ok: n.GTE, fail: n.LT },
      formatExclusiveMaximum: { okStr: "<", ok: n.LT, fail: n.GTE },
      formatExclusiveMinimum: { okStr: ">", ok: n.GT, fail: n.LTE }
    }, a = {
      message: ({ keyword: i, schemaCode: u }) => (0, r.str)`should be ${o[i].okStr} ${u}`,
      params: ({ keyword: i, schemaCode: u }) => (0, r._)`{comparison: ${o[i].okStr}, limit: ${u}}`
    };
    e.formatLimitDefinition = {
      keyword: Object.keys(o),
      type: "string",
      schemaType: "string",
      $data: !0,
      error: a,
      code(i) {
        const { gen: u, data: c, schemaCode: l, keyword: y, it: d } = i, { opts: f, self: g } = d;
        if (!f.validateFormats)
          return;
        const _ = new t.KeywordCxt(d, g.RULES.all.format.definition, "format");
        _.$data ? m() : h();
        function m() {
          const v = u.scopeValue("formats", {
            ref: g.formats,
            code: f.code.formats
          }), $ = u.const("fmt", (0, r._)`${v}[${_.schemaCode}]`);
          i.fail$data((0, r.or)((0, r._)`typeof ${$} != "object"`, (0, r._)`${$} instanceof RegExp`, (0, r._)`typeof ${$}.compare != "function"`, p($)));
        }
        function h() {
          const v = _.schema, $ = g.formats[v];
          if (!$ || $ === !0)
            return;
          if (typeof $ != "object" || $ instanceof RegExp || typeof $.compare != "function")
            throw new Error(`"${y}": format "${v}" does not define "compare" function`);
          const b = u.scopeValue("formats", {
            key: v,
            ref: $,
            code: f.code.formats ? (0, r._)`${f.code.formats}${(0, r.getProperty)(v)}` : void 0
          });
          i.fail$data(p(b));
        }
        function p(v) {
          return (0, r._)`${v}.compare(${c}, ${l}) ${o[y].fail} 0`;
        }
      },
      dependencies: ["format"]
    };
    const s = (i) => (i.addKeyword(e.formatLimitDefinition), i);
    e.default = s;
  })(La)), La;
}
var Lc;
function S_() {
  return Lc || (Lc = 1, (function(e, t) {
    Object.defineProperty(t, "__esModule", { value: !0 });
    const r = p_(), n = $_(), o = ne(), a = new o.Name("fullFormats"), s = new o.Name("fastFormats"), i = (c, l = { keywords: !0 }) => {
      if (Array.isArray(l))
        return u(c, l, r.fullFormats, a), c;
      const [y, d] = l.mode === "fast" ? [r.fastFormats, s] : [r.fullFormats, a], f = l.formats || r.formatNames;
      return u(c, f, y, d), l.keywords && (0, n.default)(c), c;
    };
    i.get = (c, l = "full") => {
      const d = (l === "fast" ? r.fastFormats : r.fullFormats)[c];
      if (!d)
        throw new Error(`Unknown format "${c}"`);
      return d;
    };
    function u(c, l, y, d) {
      var f, g;
      (f = (g = c.opts.code).formats) !== null && f !== void 0 || (g.formats = (0, o._)`require("ajv-formats/dist/formats").${d}`);
      for (const _ of l)
        c.addFormat(_, y[_]);
    }
    e.exports = t = i, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = i;
  })(Mo, Mo.exports)), Mo.exports;
}
var I_ = S_();
const T_ = /* @__PURE__ */ Ep(I_), O_ = (e, t, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  const o = Object.getOwnPropertyDescriptor(e, r), a = Object.getOwnPropertyDescriptor(t, r);
  !R_(o, a) && n || Object.defineProperty(e, r, a);
}, R_ = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, P_ = (e, t) => {
  const r = Object.getPrototypeOf(t);
  r !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, r);
}, k_ = (e, t) => `/* Wrapped ${e}*/
${t}`, N_ = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), A_ = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), C_ = (e, t, r) => {
  const n = r === "" ? "" : `with ${r.trim()}() `, o = k_.bind(null, n, t.toString());
  Object.defineProperty(o, "name", A_);
  const { writable: a, enumerable: s, configurable: i } = N_;
  Object.defineProperty(e, "toString", { value: o, writable: a, enumerable: s, configurable: i });
};
function j_(e, t, { ignoreNonConfigurable: r = !1 } = {}) {
  const { name: n } = e;
  for (const o of Reflect.ownKeys(t))
    O_(e, t, o, r);
  return P_(e, t), C_(e, t, n), e;
}
const zc = (e, t = {}) => {
  if (typeof e != "function")
    throw new TypeError(`Expected the first argument to be a function, got \`${typeof e}\``);
  const {
    wait: r = 0,
    maxWait: n = Number.POSITIVE_INFINITY,
    before: o = !1,
    after: a = !0
  } = t;
  if (r < 0 || n < 0)
    throw new RangeError("`wait` and `maxWait` must not be negative.");
  if (!o && !a)
    throw new Error("Both `before` and `after` are false, function wouldn't be called.");
  let s, i, u;
  const c = function(...l) {
    const y = this, d = () => {
      s = void 0, i && (clearTimeout(i), i = void 0), a && (u = e.apply(y, l));
    }, f = () => {
      i = void 0, s && (clearTimeout(s), s = void 0), a && (u = e.apply(y, l));
    }, g = o && !s;
    return clearTimeout(s), s = setTimeout(d, r), n > 0 && n !== Number.POSITIVE_INFINITY && !i && (i = setTimeout(f, n)), g && (u = e.apply(y, l)), u;
  };
  return j_(c, e), c.cancel = () => {
    s && (clearTimeout(s), s = void 0), i && (clearTimeout(i), i = void 0);
  }, c;
};
var qo = { exports: {} }, za, Vc;
function fa() {
  if (Vc) return za;
  Vc = 1;
  const e = "2.0.0", t = 256, r = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
  9007199254740991, n = 16, o = t - 6;
  return za = {
    MAX_LENGTH: t,
    MAX_SAFE_COMPONENT_LENGTH: n,
    MAX_SAFE_BUILD_LENGTH: o,
    MAX_SAFE_INTEGER: r,
    RELEASE_TYPES: [
      "major",
      "premajor",
      "minor",
      "preminor",
      "patch",
      "prepatch",
      "prerelease"
    ],
    SEMVER_SPEC_VERSION: e,
    FLAG_INCLUDE_PRERELEASE: 1,
    FLAG_LOOSE: 2
  }, za;
}
var Va, Uc;
function pa() {
  return Uc || (Uc = 1, Va = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...t) => console.error("SEMVER", ...t) : () => {
  }), Va;
}
var Fc;
function Cn() {
  return Fc || (Fc = 1, (function(e, t) {
    const {
      MAX_SAFE_COMPONENT_LENGTH: r,
      MAX_SAFE_BUILD_LENGTH: n,
      MAX_LENGTH: o
    } = fa(), a = pa();
    t = e.exports = {};
    const s = t.re = [], i = t.safeRe = [], u = t.src = [], c = t.safeSrc = [], l = t.t = {};
    let y = 0;
    const d = "[a-zA-Z0-9-]", f = [
      ["\\s", 1],
      ["\\d", o],
      [d, n]
    ], g = (m) => {
      for (const [h, p] of f)
        m = m.split(`${h}*`).join(`${h}{0,${p}}`).split(`${h}+`).join(`${h}{1,${p}}`);
      return m;
    }, _ = (m, h, p) => {
      const v = g(h), $ = y++;
      a(m, $, h), l[m] = $, u[$] = h, c[$] = v, s[$] = new RegExp(h, p ? "g" : void 0), i[$] = new RegExp(v, p ? "g" : void 0);
    };
    _("NUMERICIDENTIFIER", "0|[1-9]\\d*"), _("NUMERICIDENTIFIERLOOSE", "\\d+"), _("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${d}*`), _("MAINVERSION", `(${u[l.NUMERICIDENTIFIER]})\\.(${u[l.NUMERICIDENTIFIER]})\\.(${u[l.NUMERICIDENTIFIER]})`), _("MAINVERSIONLOOSE", `(${u[l.NUMERICIDENTIFIERLOOSE]})\\.(${u[l.NUMERICIDENTIFIERLOOSE]})\\.(${u[l.NUMERICIDENTIFIERLOOSE]})`), _("PRERELEASEIDENTIFIER", `(?:${u[l.NONNUMERICIDENTIFIER]}|${u[l.NUMERICIDENTIFIER]})`), _("PRERELEASEIDENTIFIERLOOSE", `(?:${u[l.NONNUMERICIDENTIFIER]}|${u[l.NUMERICIDENTIFIERLOOSE]})`), _("PRERELEASE", `(?:-(${u[l.PRERELEASEIDENTIFIER]}(?:\\.${u[l.PRERELEASEIDENTIFIER]})*))`), _("PRERELEASELOOSE", `(?:-?(${u[l.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${u[l.PRERELEASEIDENTIFIERLOOSE]})*))`), _("BUILDIDENTIFIER", `${d}+`), _("BUILD", `(?:\\+(${u[l.BUILDIDENTIFIER]}(?:\\.${u[l.BUILDIDENTIFIER]})*))`), _("FULLPLAIN", `v?${u[l.MAINVERSION]}${u[l.PRERELEASE]}?${u[l.BUILD]}?`), _("FULL", `^${u[l.FULLPLAIN]}$`), _("LOOSEPLAIN", `[v=\\s]*${u[l.MAINVERSIONLOOSE]}${u[l.PRERELEASELOOSE]}?${u[l.BUILD]}?`), _("LOOSE", `^${u[l.LOOSEPLAIN]}$`), _("GTLT", "((?:<|>)?=?)"), _("XRANGEIDENTIFIERLOOSE", `${u[l.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), _("XRANGEIDENTIFIER", `${u[l.NUMERICIDENTIFIER]}|x|X|\\*`), _("XRANGEPLAIN", `[v=\\s]*(${u[l.XRANGEIDENTIFIER]})(?:\\.(${u[l.XRANGEIDENTIFIER]})(?:\\.(${u[l.XRANGEIDENTIFIER]})(?:${u[l.PRERELEASE]})?${u[l.BUILD]}?)?)?`), _("XRANGEPLAINLOOSE", `[v=\\s]*(${u[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${u[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${u[l.XRANGEIDENTIFIERLOOSE]})(?:${u[l.PRERELEASELOOSE]})?${u[l.BUILD]}?)?)?`), _("XRANGE", `^${u[l.GTLT]}\\s*${u[l.XRANGEPLAIN]}$`), _("XRANGELOOSE", `^${u[l.GTLT]}\\s*${u[l.XRANGEPLAINLOOSE]}$`), _("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), _("COERCE", `${u[l.COERCEPLAIN]}(?:$|[^\\d])`), _("COERCEFULL", u[l.COERCEPLAIN] + `(?:${u[l.PRERELEASE]})?(?:${u[l.BUILD]})?(?:$|[^\\d])`), _("COERCERTL", u[l.COERCE], !0), _("COERCERTLFULL", u[l.COERCEFULL], !0), _("LONETILDE", "(?:~>?)"), _("TILDETRIM", `(\\s*)${u[l.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", _("TILDE", `^${u[l.LONETILDE]}${u[l.XRANGEPLAIN]}$`), _("TILDELOOSE", `^${u[l.LONETILDE]}${u[l.XRANGEPLAINLOOSE]}$`), _("LONECARET", "(?:\\^)"), _("CARETTRIM", `(\\s*)${u[l.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", _("CARET", `^${u[l.LONECARET]}${u[l.XRANGEPLAIN]}$`), _("CARETLOOSE", `^${u[l.LONECARET]}${u[l.XRANGEPLAINLOOSE]}$`), _("COMPARATORLOOSE", `^${u[l.GTLT]}\\s*(${u[l.LOOSEPLAIN]})$|^$`), _("COMPARATOR", `^${u[l.GTLT]}\\s*(${u[l.FULLPLAIN]})$|^$`), _("COMPARATORTRIM", `(\\s*)${u[l.GTLT]}\\s*(${u[l.LOOSEPLAIN]}|${u[l.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", _("HYPHENRANGE", `^\\s*(${u[l.XRANGEPLAIN]})\\s+-\\s+(${u[l.XRANGEPLAIN]})\\s*$`), _("HYPHENRANGELOOSE", `^\\s*(${u[l.XRANGEPLAINLOOSE]})\\s+-\\s+(${u[l.XRANGEPLAINLOOSE]})\\s*$`), _("STAR", "(<|>)?=?\\s*\\*"), _("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), _("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  })(qo, qo.exports)), qo.exports;
}
var Ua, Zc;
function ki() {
  if (Zc) return Ua;
  Zc = 1;
  const e = Object.freeze({ loose: !0 }), t = Object.freeze({});
  return Ua = (n) => n ? typeof n != "object" ? e : n : t, Ua;
}
var Fa, Gc;
function Lp() {
  if (Gc) return Fa;
  Gc = 1;
  const e = /^[0-9]+$/, t = (n, o) => {
    if (typeof n == "number" && typeof o == "number")
      return n === o ? 0 : n < o ? -1 : 1;
    const a = e.test(n), s = e.test(o);
    return a && s && (n = +n, o = +o), n === o ? 0 : a && !s ? -1 : s && !a ? 1 : n < o ? -1 : 1;
  };
  return Fa = {
    compareIdentifiers: t,
    rcompareIdentifiers: (n, o) => t(o, n)
  }, Fa;
}
var Za, Bc;
function We() {
  if (Bc) return Za;
  Bc = 1;
  const e = pa(), { MAX_LENGTH: t, MAX_SAFE_INTEGER: r } = fa(), { safeRe: n, t: o } = Cn(), a = ki(), { compareIdentifiers: s } = Lp();
  class i {
    constructor(c, l) {
      if (l = a(l), c instanceof i) {
        if (c.loose === !!l.loose && c.includePrerelease === !!l.includePrerelease)
          return c;
        c = c.version;
      } else if (typeof c != "string")
        throw new TypeError(`Invalid version. Must be a string. Got type "${typeof c}".`);
      if (c.length > t)
        throw new TypeError(
          `version is longer than ${t} characters`
        );
      e("SemVer", c, l), this.options = l, this.loose = !!l.loose, this.includePrerelease = !!l.includePrerelease;
      const y = c.trim().match(l.loose ? n[o.LOOSE] : n[o.FULL]);
      if (!y)
        throw new TypeError(`Invalid Version: ${c}`);
      if (this.raw = c, this.major = +y[1], this.minor = +y[2], this.patch = +y[3], this.major > r || this.major < 0)
        throw new TypeError("Invalid major version");
      if (this.minor > r || this.minor < 0)
        throw new TypeError("Invalid minor version");
      if (this.patch > r || this.patch < 0)
        throw new TypeError("Invalid patch version");
      y[4] ? this.prerelease = y[4].split(".").map((d) => {
        if (/^[0-9]+$/.test(d)) {
          const f = +d;
          if (f >= 0 && f < r)
            return f;
        }
        return d;
      }) : this.prerelease = [], this.build = y[5] ? y[5].split(".") : [], this.format();
    }
    format() {
      return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
    }
    toString() {
      return this.version;
    }
    compare(c) {
      if (e("SemVer.compare", this.version, this.options, c), !(c instanceof i)) {
        if (typeof c == "string" && c === this.version)
          return 0;
        c = new i(c, this.options);
      }
      return c.version === this.version ? 0 : this.compareMain(c) || this.comparePre(c);
    }
    compareMain(c) {
      return c instanceof i || (c = new i(c, this.options)), this.major < c.major ? -1 : this.major > c.major ? 1 : this.minor < c.minor ? -1 : this.minor > c.minor ? 1 : this.patch < c.patch ? -1 : this.patch > c.patch ? 1 : 0;
    }
    comparePre(c) {
      if (c instanceof i || (c = new i(c, this.options)), this.prerelease.length && !c.prerelease.length)
        return -1;
      if (!this.prerelease.length && c.prerelease.length)
        return 1;
      if (!this.prerelease.length && !c.prerelease.length)
        return 0;
      let l = 0;
      do {
        const y = this.prerelease[l], d = c.prerelease[l];
        if (e("prerelease compare", l, y, d), y === void 0 && d === void 0)
          return 0;
        if (d === void 0)
          return 1;
        if (y === void 0)
          return -1;
        if (y === d)
          continue;
        return s(y, d);
      } while (++l);
    }
    compareBuild(c) {
      c instanceof i || (c = new i(c, this.options));
      let l = 0;
      do {
        const y = this.build[l], d = c.build[l];
        if (e("build compare", l, y, d), y === void 0 && d === void 0)
          return 0;
        if (d === void 0)
          return 1;
        if (y === void 0)
          return -1;
        if (y === d)
          continue;
        return s(y, d);
      } while (++l);
    }
    // preminor will bump the version up to the next minor release, and immediately
    // down to pre-release. premajor and prepatch work the same way.
    inc(c, l, y) {
      if (c.startsWith("pre")) {
        if (!l && y === !1)
          throw new Error("invalid increment argument: identifier is empty");
        if (l) {
          const d = `-${l}`.match(this.options.loose ? n[o.PRERELEASELOOSE] : n[o.PRERELEASE]);
          if (!d || d[1] !== l)
            throw new Error(`invalid identifier: ${l}`);
        }
      }
      switch (c) {
        case "premajor":
          this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", l, y);
          break;
        case "preminor":
          this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", l, y);
          break;
        case "prepatch":
          this.prerelease.length = 0, this.inc("patch", l, y), this.inc("pre", l, y);
          break;
        // If the input is a non-prerelease version, this acts the same as
        // prepatch.
        case "prerelease":
          this.prerelease.length === 0 && this.inc("patch", l, y), this.inc("pre", l, y);
          break;
        case "release":
          if (this.prerelease.length === 0)
            throw new Error(`version ${this.raw} is not a prerelease`);
          this.prerelease.length = 0;
          break;
        case "major":
          (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
          break;
        case "minor":
          (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
          break;
        case "patch":
          this.prerelease.length === 0 && this.patch++, this.prerelease = [];
          break;
        // This probably shouldn't be used publicly.
        // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
        case "pre": {
          const d = Number(y) ? 1 : 0;
          if (this.prerelease.length === 0)
            this.prerelease = [d];
          else {
            let f = this.prerelease.length;
            for (; --f >= 0; )
              typeof this.prerelease[f] == "number" && (this.prerelease[f]++, f = -2);
            if (f === -1) {
              if (l === this.prerelease.join(".") && y === !1)
                throw new Error("invalid increment argument: identifier already exists");
              this.prerelease.push(d);
            }
          }
          if (l) {
            let f = [l, d];
            y === !1 && (f = [l]), s(this.prerelease[0], l) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = f) : this.prerelease = f;
          }
          break;
        }
        default:
          throw new Error(`invalid increment argument: ${c}`);
      }
      return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
    }
  }
  return Za = i, Za;
}
var Ga, Hc;
function jr() {
  if (Hc) return Ga;
  Hc = 1;
  const e = We();
  return Ga = (r, n, o = !1) => {
    if (r instanceof e)
      return r;
    try {
      return new e(r, n);
    } catch (a) {
      if (!o)
        return null;
      throw a;
    }
  }, Ga;
}
var Ba, Wc;
function M_() {
  if (Wc) return Ba;
  Wc = 1;
  const e = jr();
  return Ba = (r, n) => {
    const o = e(r, n);
    return o ? o.version : null;
  }, Ba;
}
var Ha, Jc;
function x_() {
  if (Jc) return Ha;
  Jc = 1;
  const e = jr();
  return Ha = (r, n) => {
    const o = e(r.trim().replace(/^[=v]+/, ""), n);
    return o ? o.version : null;
  }, Ha;
}
var Wa, Kc;
function D_() {
  if (Kc) return Wa;
  Kc = 1;
  const e = We();
  return Wa = (r, n, o, a, s) => {
    typeof o == "string" && (s = a, a = o, o = void 0);
    try {
      return new e(
        r instanceof e ? r.version : r,
        o
      ).inc(n, a, s).version;
    } catch {
      return null;
    }
  }, Wa;
}
var Ja, Yc;
function q_() {
  if (Yc) return Ja;
  Yc = 1;
  const e = jr();
  return Ja = (r, n) => {
    const o = e(r, null, !0), a = e(n, null, !0), s = o.compare(a);
    if (s === 0)
      return null;
    const i = s > 0, u = i ? o : a, c = i ? a : o, l = !!u.prerelease.length;
    if (!!c.prerelease.length && !l) {
      if (!c.patch && !c.minor)
        return "major";
      if (c.compareMain(u) === 0)
        return c.minor && !c.patch ? "minor" : "patch";
    }
    const d = l ? "pre" : "";
    return o.major !== a.major ? d + "major" : o.minor !== a.minor ? d + "minor" : o.patch !== a.patch ? d + "patch" : "prerelease";
  }, Ja;
}
var Ka, Xc;
function L_() {
  if (Xc) return Ka;
  Xc = 1;
  const e = We();
  return Ka = (r, n) => new e(r, n).major, Ka;
}
var Ya, Qc;
function z_() {
  if (Qc) return Ya;
  Qc = 1;
  const e = We();
  return Ya = (r, n) => new e(r, n).minor, Ya;
}
var Xa, el;
function V_() {
  if (el) return Xa;
  el = 1;
  const e = We();
  return Xa = (r, n) => new e(r, n).patch, Xa;
}
var Qa, tl;
function U_() {
  if (tl) return Qa;
  tl = 1;
  const e = jr();
  return Qa = (r, n) => {
    const o = e(r, n);
    return o && o.prerelease.length ? o.prerelease : null;
  }, Qa;
}
var es, rl;
function mt() {
  if (rl) return es;
  rl = 1;
  const e = We();
  return es = (r, n, o) => new e(r, o).compare(new e(n, o)), es;
}
var ts, nl;
function F_() {
  if (nl) return ts;
  nl = 1;
  const e = mt();
  return ts = (r, n, o) => e(n, r, o), ts;
}
var rs, ol;
function Z_() {
  if (ol) return rs;
  ol = 1;
  const e = mt();
  return rs = (r, n) => e(r, n, !0), rs;
}
var ns, al;
function Ni() {
  if (al) return ns;
  al = 1;
  const e = We();
  return ns = (r, n, o) => {
    const a = new e(r, o), s = new e(n, o);
    return a.compare(s) || a.compareBuild(s);
  }, ns;
}
var os, sl;
function G_() {
  if (sl) return os;
  sl = 1;
  const e = Ni();
  return os = (r, n) => r.sort((o, a) => e(o, a, n)), os;
}
var as, il;
function B_() {
  if (il) return as;
  il = 1;
  const e = Ni();
  return as = (r, n) => r.sort((o, a) => e(a, o, n)), as;
}
var ss, ul;
function ha() {
  if (ul) return ss;
  ul = 1;
  const e = mt();
  return ss = (r, n, o) => e(r, n, o) > 0, ss;
}
var is, cl;
function Ai() {
  if (cl) return is;
  cl = 1;
  const e = mt();
  return is = (r, n, o) => e(r, n, o) < 0, is;
}
var us, ll;
function zp() {
  if (ll) return us;
  ll = 1;
  const e = mt();
  return us = (r, n, o) => e(r, n, o) === 0, us;
}
var cs, dl;
function Vp() {
  if (dl) return cs;
  dl = 1;
  const e = mt();
  return cs = (r, n, o) => e(r, n, o) !== 0, cs;
}
var ls, fl;
function Ci() {
  if (fl) return ls;
  fl = 1;
  const e = mt();
  return ls = (r, n, o) => e(r, n, o) >= 0, ls;
}
var ds, pl;
function ji() {
  if (pl) return ds;
  pl = 1;
  const e = mt();
  return ds = (r, n, o) => e(r, n, o) <= 0, ds;
}
var fs, hl;
function Up() {
  if (hl) return fs;
  hl = 1;
  const e = zp(), t = Vp(), r = ha(), n = Ci(), o = Ai(), a = ji();
  return fs = (i, u, c, l) => {
    switch (u) {
      case "===":
        return typeof i == "object" && (i = i.version), typeof c == "object" && (c = c.version), i === c;
      case "!==":
        return typeof i == "object" && (i = i.version), typeof c == "object" && (c = c.version), i !== c;
      case "":
      case "=":
      case "==":
        return e(i, c, l);
      case "!=":
        return t(i, c, l);
      case ">":
        return r(i, c, l);
      case ">=":
        return n(i, c, l);
      case "<":
        return o(i, c, l);
      case "<=":
        return a(i, c, l);
      default:
        throw new TypeError(`Invalid operator: ${u}`);
    }
  }, fs;
}
var ps, ml;
function H_() {
  if (ml) return ps;
  ml = 1;
  const e = We(), t = jr(), { safeRe: r, t: n } = Cn();
  return ps = (a, s) => {
    if (a instanceof e)
      return a;
    if (typeof a == "number" && (a = String(a)), typeof a != "string")
      return null;
    s = s || {};
    let i = null;
    if (!s.rtl)
      i = a.match(s.includePrerelease ? r[n.COERCEFULL] : r[n.COERCE]);
    else {
      const f = s.includePrerelease ? r[n.COERCERTLFULL] : r[n.COERCERTL];
      let g;
      for (; (g = f.exec(a)) && (!i || i.index + i[0].length !== a.length); )
        (!i || g.index + g[0].length !== i.index + i[0].length) && (i = g), f.lastIndex = g.index + g[1].length + g[2].length;
      f.lastIndex = -1;
    }
    if (i === null)
      return null;
    const u = i[2], c = i[3] || "0", l = i[4] || "0", y = s.includePrerelease && i[5] ? `-${i[5]}` : "", d = s.includePrerelease && i[6] ? `+${i[6]}` : "";
    return t(`${u}.${c}.${l}${y}${d}`, s);
  }, ps;
}
var hs, gl;
function W_() {
  if (gl) return hs;
  gl = 1;
  class e {
    constructor() {
      this.max = 1e3, this.map = /* @__PURE__ */ new Map();
    }
    get(r) {
      const n = this.map.get(r);
      if (n !== void 0)
        return this.map.delete(r), this.map.set(r, n), n;
    }
    delete(r) {
      return this.map.delete(r);
    }
    set(r, n) {
      if (!this.delete(r) && n !== void 0) {
        if (this.map.size >= this.max) {
          const a = this.map.keys().next().value;
          this.delete(a);
        }
        this.map.set(r, n);
      }
      return this;
    }
  }
  return hs = e, hs;
}
var ms, yl;
function gt() {
  if (yl) return ms;
  yl = 1;
  const e = /\s+/g;
  class t {
    constructor(L, F) {
      if (F = o(F), L instanceof t)
        return L.loose === !!F.loose && L.includePrerelease === !!F.includePrerelease ? L : new t(L.raw, F);
      if (L instanceof a)
        return this.raw = L.value, this.set = [[L]], this.formatted = void 0, this;
      if (this.options = F, this.loose = !!F.loose, this.includePrerelease = !!F.includePrerelease, this.raw = L.trim().replace(e, " "), this.set = this.raw.split("||").map((G) => this.parseRange(G.trim())).filter((G) => G.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const G = this.set[0];
        if (this.set = this.set.filter((B) => !_(B[0])), this.set.length === 0)
          this.set = [G];
        else if (this.set.length > 1) {
          for (const B of this.set)
            if (B.length === 1 && m(B[0])) {
              this.set = [B];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let L = 0; L < this.set.length; L++) {
          L > 0 && (this.formatted += "||");
          const F = this.set[L];
          for (let G = 0; G < F.length; G++)
            G > 0 && (this.formatted += " "), this.formatted += F[G].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(L) {
      const G = ((this.options.includePrerelease && f) | (this.options.loose && g)) + ":" + L, B = n.get(G);
      if (B)
        return B;
      const Q = this.options.loose, D = Q ? u[c.HYPHENRANGELOOSE] : u[c.HYPHENRANGE];
      L = L.replace(D, W(this.options.includePrerelease)), s("hyphen replace", L), L = L.replace(u[c.COMPARATORTRIM], l), s("comparator trim", L), L = L.replace(u[c.TILDETRIM], y), s("tilde trim", L), L = L.replace(u[c.CARETTRIM], d), s("caret trim", L);
      let P = L.split(" ").map((w) => p(w, this.options)).join(" ").split(/\s+/).map((w) => x(w, this.options));
      Q && (P = P.filter((w) => (s("loose invalid filter", w, this.options), !!w.match(u[c.COMPARATORLOOSE])))), s("range list", P);
      const C = /* @__PURE__ */ new Map(), k = P.map((w) => new a(w, this.options));
      for (const w of k) {
        if (_(w))
          return [w];
        C.set(w.value, w);
      }
      C.size > 1 && C.has("") && C.delete("");
      const S = [...C.values()];
      return n.set(G, S), S;
    }
    intersects(L, F) {
      if (!(L instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((G) => h(G, F) && L.set.some((B) => h(B, F) && G.every((Q) => B.every((D) => Q.intersects(D, F)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(L) {
      if (!L)
        return !1;
      if (typeof L == "string")
        try {
          L = new i(L, this.options);
        } catch {
          return !1;
        }
      for (let F = 0; F < this.set.length; F++)
        if (K(this.set[F], L, this.options))
          return !0;
      return !1;
    }
  }
  ms = t;
  const r = W_(), n = new r(), o = ki(), a = ma(), s = pa(), i = We(), {
    safeRe: u,
    t: c,
    comparatorTrimReplace: l,
    tildeTrimReplace: y,
    caretTrimReplace: d
  } = Cn(), { FLAG_INCLUDE_PRERELEASE: f, FLAG_LOOSE: g } = fa(), _ = (M) => M.value === "<0.0.0-0", m = (M) => M.value === "", h = (M, L) => {
    let F = !0;
    const G = M.slice();
    let B = G.pop();
    for (; F && G.length; )
      F = G.every((Q) => B.intersects(Q, L)), B = G.pop();
    return F;
  }, p = (M, L) => (M = M.replace(u[c.BUILD], ""), s("comp", M, L), M = E(M, L), s("caret", M), M = $(M, L), s("tildes", M), M = O(M, L), s("xrange", M), M = H(M, L), s("stars", M), M), v = (M) => !M || M.toLowerCase() === "x" || M === "*", $ = (M, L) => M.trim().split(/\s+/).map((F) => b(F, L)).join(" "), b = (M, L) => {
    const F = L.loose ? u[c.TILDELOOSE] : u[c.TILDE];
    return M.replace(F, (G, B, Q, D, P) => {
      s("tilde", M, G, B, Q, D, P);
      let C;
      return v(B) ? C = "" : v(Q) ? C = `>=${B}.0.0 <${+B + 1}.0.0-0` : v(D) ? C = `>=${B}.${Q}.0 <${B}.${+Q + 1}.0-0` : P ? (s("replaceTilde pr", P), C = `>=${B}.${Q}.${D}-${P} <${B}.${+Q + 1}.0-0`) : C = `>=${B}.${Q}.${D} <${B}.${+Q + 1}.0-0`, s("tilde return", C), C;
    });
  }, E = (M, L) => M.trim().split(/\s+/).map((F) => I(F, L)).join(" "), I = (M, L) => {
    s("caret", M, L);
    const F = L.loose ? u[c.CARETLOOSE] : u[c.CARET], G = L.includePrerelease ? "-0" : "";
    return M.replace(F, (B, Q, D, P, C) => {
      s("caret", M, B, Q, D, P, C);
      let k;
      return v(Q) ? k = "" : v(D) ? k = `>=${Q}.0.0${G} <${+Q + 1}.0.0-0` : v(P) ? Q === "0" ? k = `>=${Q}.${D}.0${G} <${Q}.${+D + 1}.0-0` : k = `>=${Q}.${D}.0${G} <${+Q + 1}.0.0-0` : C ? (s("replaceCaret pr", C), Q === "0" ? D === "0" ? k = `>=${Q}.${D}.${P}-${C} <${Q}.${D}.${+P + 1}-0` : k = `>=${Q}.${D}.${P}-${C} <${Q}.${+D + 1}.0-0` : k = `>=${Q}.${D}.${P}-${C} <${+Q + 1}.0.0-0`) : (s("no pr"), Q === "0" ? D === "0" ? k = `>=${Q}.${D}.${P}${G} <${Q}.${D}.${+P + 1}-0` : k = `>=${Q}.${D}.${P}${G} <${Q}.${+D + 1}.0-0` : k = `>=${Q}.${D}.${P} <${+Q + 1}.0.0-0`), s("caret return", k), k;
    });
  }, O = (M, L) => (s("replaceXRanges", M, L), M.split(/\s+/).map((F) => q(F, L)).join(" ")), q = (M, L) => {
    M = M.trim();
    const F = L.loose ? u[c.XRANGELOOSE] : u[c.XRANGE];
    return M.replace(F, (G, B, Q, D, P, C) => {
      s("xRange", M, G, B, Q, D, P, C);
      const k = v(Q), S = k || v(D), w = S || v(P), A = w;
      return B === "=" && A && (B = ""), C = L.includePrerelease ? "-0" : "", k ? B === ">" || B === "<" ? G = "<0.0.0-0" : G = "*" : B && A ? (S && (D = 0), P = 0, B === ">" ? (B = ">=", S ? (Q = +Q + 1, D = 0, P = 0) : (D = +D + 1, P = 0)) : B === "<=" && (B = "<", S ? Q = +Q + 1 : D = +D + 1), B === "<" && (C = "-0"), G = `${B + Q}.${D}.${P}${C}`) : S ? G = `>=${Q}.0.0${C} <${+Q + 1}.0.0-0` : w && (G = `>=${Q}.${D}.0${C} <${Q}.${+D + 1}.0-0`), s("xRange return", G), G;
    });
  }, H = (M, L) => (s("replaceStars", M, L), M.trim().replace(u[c.STAR], "")), x = (M, L) => (s("replaceGTE0", M, L), M.trim().replace(u[L.includePrerelease ? c.GTE0PRE : c.GTE0], "")), W = (M) => (L, F, G, B, Q, D, P, C, k, S, w, A) => (v(G) ? F = "" : v(B) ? F = `>=${G}.0.0${M ? "-0" : ""}` : v(Q) ? F = `>=${G}.${B}.0${M ? "-0" : ""}` : D ? F = `>=${F}` : F = `>=${F}${M ? "-0" : ""}`, v(k) ? C = "" : v(S) ? C = `<${+k + 1}.0.0-0` : v(w) ? C = `<${k}.${+S + 1}.0-0` : A ? C = `<=${k}.${S}.${w}-${A}` : M ? C = `<${k}.${S}.${+w + 1}-0` : C = `<=${C}`, `${F} ${C}`.trim()), K = (M, L, F) => {
    for (let G = 0; G < M.length; G++)
      if (!M[G].test(L))
        return !1;
    if (L.prerelease.length && !F.includePrerelease) {
      for (let G = 0; G < M.length; G++)
        if (s(M[G].semver), M[G].semver !== a.ANY && M[G].semver.prerelease.length > 0) {
          const B = M[G].semver;
          if (B.major === L.major && B.minor === L.minor && B.patch === L.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return ms;
}
var gs, vl;
function ma() {
  if (vl) return gs;
  vl = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(l, y) {
      if (y = r(y), l instanceof t) {
        if (l.loose === !!y.loose)
          return l;
        l = l.value;
      }
      l = l.trim().split(/\s+/).join(" "), s("comparator", l, y), this.options = y, this.loose = !!y.loose, this.parse(l), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, s("comp", this);
    }
    parse(l) {
      const y = this.options.loose ? n[o.COMPARATORLOOSE] : n[o.COMPARATOR], d = l.match(y);
      if (!d)
        throw new TypeError(`Invalid comparator: ${l}`);
      this.operator = d[1] !== void 0 ? d[1] : "", this.operator === "=" && (this.operator = ""), d[2] ? this.semver = new i(d[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(l) {
      if (s("Comparator.test", l, this.options.loose), this.semver === e || l === e)
        return !0;
      if (typeof l == "string")
        try {
          l = new i(l, this.options);
        } catch {
          return !1;
        }
      return a(l, this.operator, this.semver, this.options);
    }
    intersects(l, y) {
      if (!(l instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new u(l.value, y).test(this.value) : l.operator === "" ? l.value === "" ? !0 : new u(this.value, y).test(l.semver) : (y = r(y), y.includePrerelease && (this.value === "<0.0.0-0" || l.value === "<0.0.0-0") || !y.includePrerelease && (this.value.startsWith("<0.0.0") || l.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && l.operator.startsWith(">") || this.operator.startsWith("<") && l.operator.startsWith("<") || this.semver.version === l.semver.version && this.operator.includes("=") && l.operator.includes("=") || a(this.semver, "<", l.semver, y) && this.operator.startsWith(">") && l.operator.startsWith("<") || a(this.semver, ">", l.semver, y) && this.operator.startsWith("<") && l.operator.startsWith(">")));
    }
  }
  gs = t;
  const r = ki(), { safeRe: n, t: o } = Cn(), a = Up(), s = pa(), i = We(), u = gt();
  return gs;
}
var ys, _l;
function ga() {
  if (_l) return ys;
  _l = 1;
  const e = gt();
  return ys = (r, n, o) => {
    try {
      n = new e(n, o);
    } catch {
      return !1;
    }
    return n.test(r);
  }, ys;
}
var vs, bl;
function J_() {
  if (bl) return vs;
  bl = 1;
  const e = gt();
  return vs = (r, n) => new e(r, n).set.map((o) => o.map((a) => a.value).join(" ").trim().split(" ")), vs;
}
var _s, wl;
function K_() {
  if (wl) return _s;
  wl = 1;
  const e = We(), t = gt();
  return _s = (n, o, a) => {
    let s = null, i = null, u = null;
    try {
      u = new t(o, a);
    } catch {
      return null;
    }
    return n.forEach((c) => {
      u.test(c) && (!s || i.compare(c) === -1) && (s = c, i = new e(s, a));
    }), s;
  }, _s;
}
var bs, El;
function Y_() {
  if (El) return bs;
  El = 1;
  const e = We(), t = gt();
  return bs = (n, o, a) => {
    let s = null, i = null, u = null;
    try {
      u = new t(o, a);
    } catch {
      return null;
    }
    return n.forEach((c) => {
      u.test(c) && (!s || i.compare(c) === 1) && (s = c, i = new e(s, a));
    }), s;
  }, bs;
}
var ws, $l;
function X_() {
  if ($l) return ws;
  $l = 1;
  const e = We(), t = gt(), r = ha();
  return ws = (o, a) => {
    o = new t(o, a);
    let s = new e("0.0.0");
    if (o.test(s) || (s = new e("0.0.0-0"), o.test(s)))
      return s;
    s = null;
    for (let i = 0; i < o.set.length; ++i) {
      const u = o.set[i];
      let c = null;
      u.forEach((l) => {
        const y = new e(l.semver.version);
        switch (l.operator) {
          case ">":
            y.prerelease.length === 0 ? y.patch++ : y.prerelease.push(0), y.raw = y.format();
          /* fallthrough */
          case "":
          case ">=":
            (!c || r(y, c)) && (c = y);
            break;
          case "<":
          case "<=":
            break;
          /* istanbul ignore next */
          default:
            throw new Error(`Unexpected operation: ${l.operator}`);
        }
      }), c && (!s || r(s, c)) && (s = c);
    }
    return s && o.test(s) ? s : null;
  }, ws;
}
var Es, Sl;
function Q_() {
  if (Sl) return Es;
  Sl = 1;
  const e = gt();
  return Es = (r, n) => {
    try {
      return new e(r, n).range || "*";
    } catch {
      return null;
    }
  }, Es;
}
var $s, Il;
function Mi() {
  if (Il) return $s;
  Il = 1;
  const e = We(), t = ma(), { ANY: r } = t, n = gt(), o = ga(), a = ha(), s = Ai(), i = ji(), u = Ci();
  return $s = (l, y, d, f) => {
    l = new e(l, f), y = new n(y, f);
    let g, _, m, h, p;
    switch (d) {
      case ">":
        g = a, _ = i, m = s, h = ">", p = ">=";
        break;
      case "<":
        g = s, _ = u, m = a, h = "<", p = "<=";
        break;
      default:
        throw new TypeError('Must provide a hilo val of "<" or ">"');
    }
    if (o(l, y, f))
      return !1;
    for (let v = 0; v < y.set.length; ++v) {
      const $ = y.set[v];
      let b = null, E = null;
      if ($.forEach((I) => {
        I.semver === r && (I = new t(">=0.0.0")), b = b || I, E = E || I, g(I.semver, b.semver, f) ? b = I : m(I.semver, E.semver, f) && (E = I);
      }), b.operator === h || b.operator === p || (!E.operator || E.operator === h) && _(l, E.semver))
        return !1;
      if (E.operator === p && m(l, E.semver))
        return !1;
    }
    return !0;
  }, $s;
}
var Ss, Tl;
function e0() {
  if (Tl) return Ss;
  Tl = 1;
  const e = Mi();
  return Ss = (r, n, o) => e(r, n, ">", o), Ss;
}
var Is, Ol;
function t0() {
  if (Ol) return Is;
  Ol = 1;
  const e = Mi();
  return Is = (r, n, o) => e(r, n, "<", o), Is;
}
var Ts, Rl;
function r0() {
  if (Rl) return Ts;
  Rl = 1;
  const e = gt();
  return Ts = (r, n, o) => (r = new e(r, o), n = new e(n, o), r.intersects(n, o)), Ts;
}
var Os, Pl;
function n0() {
  if (Pl) return Os;
  Pl = 1;
  const e = ga(), t = mt();
  return Os = (r, n, o) => {
    const a = [];
    let s = null, i = null;
    const u = r.sort((d, f) => t(d, f, o));
    for (const d of u)
      e(d, n, o) ? (i = d, s || (s = d)) : (i && a.push([s, i]), i = null, s = null);
    s && a.push([s, null]);
    const c = [];
    for (const [d, f] of a)
      d === f ? c.push(d) : !f && d === u[0] ? c.push("*") : f ? d === u[0] ? c.push(`<=${f}`) : c.push(`${d} - ${f}`) : c.push(`>=${d}`);
    const l = c.join(" || "), y = typeof n.raw == "string" ? n.raw : String(n);
    return l.length < y.length ? l : n;
  }, Os;
}
var Rs, kl;
function o0() {
  if (kl) return Rs;
  kl = 1;
  const e = gt(), t = ma(), { ANY: r } = t, n = ga(), o = mt(), a = (y, d, f = {}) => {
    if (y === d)
      return !0;
    y = new e(y, f), d = new e(d, f);
    let g = !1;
    e: for (const _ of y.set) {
      for (const m of d.set) {
        const h = u(_, m, f);
        if (g = g || h !== null, h)
          continue e;
      }
      if (g)
        return !1;
    }
    return !0;
  }, s = [new t(">=0.0.0-0")], i = [new t(">=0.0.0")], u = (y, d, f) => {
    if (y === d)
      return !0;
    if (y.length === 1 && y[0].semver === r) {
      if (d.length === 1 && d[0].semver === r)
        return !0;
      f.includePrerelease ? y = s : y = i;
    }
    if (d.length === 1 && d[0].semver === r) {
      if (f.includePrerelease)
        return !0;
      d = i;
    }
    const g = /* @__PURE__ */ new Set();
    let _, m;
    for (const O of y)
      O.operator === ">" || O.operator === ">=" ? _ = c(_, O, f) : O.operator === "<" || O.operator === "<=" ? m = l(m, O, f) : g.add(O.semver);
    if (g.size > 1)
      return null;
    let h;
    if (_ && m) {
      if (h = o(_.semver, m.semver, f), h > 0)
        return null;
      if (h === 0 && (_.operator !== ">=" || m.operator !== "<="))
        return null;
    }
    for (const O of g) {
      if (_ && !n(O, String(_), f) || m && !n(O, String(m), f))
        return null;
      for (const q of d)
        if (!n(O, String(q), f))
          return !1;
      return !0;
    }
    let p, v, $, b, E = m && !f.includePrerelease && m.semver.prerelease.length ? m.semver : !1, I = _ && !f.includePrerelease && _.semver.prerelease.length ? _.semver : !1;
    E && E.prerelease.length === 1 && m.operator === "<" && E.prerelease[0] === 0 && (E = !1);
    for (const O of d) {
      if (b = b || O.operator === ">" || O.operator === ">=", $ = $ || O.operator === "<" || O.operator === "<=", _) {
        if (I && O.semver.prerelease && O.semver.prerelease.length && O.semver.major === I.major && O.semver.minor === I.minor && O.semver.patch === I.patch && (I = !1), O.operator === ">" || O.operator === ">=") {
          if (p = c(_, O, f), p === O && p !== _)
            return !1;
        } else if (_.operator === ">=" && !n(_.semver, String(O), f))
          return !1;
      }
      if (m) {
        if (E && O.semver.prerelease && O.semver.prerelease.length && O.semver.major === E.major && O.semver.minor === E.minor && O.semver.patch === E.patch && (E = !1), O.operator === "<" || O.operator === "<=") {
          if (v = l(m, O, f), v === O && v !== m)
            return !1;
        } else if (m.operator === "<=" && !n(m.semver, String(O), f))
          return !1;
      }
      if (!O.operator && (m || _) && h !== 0)
        return !1;
    }
    return !(_ && $ && !m && h !== 0 || m && b && !_ && h !== 0 || I || E);
  }, c = (y, d, f) => {
    if (!y)
      return d;
    const g = o(y.semver, d.semver, f);
    return g > 0 ? y : g < 0 || d.operator === ">" && y.operator === ">=" ? d : y;
  }, l = (y, d, f) => {
    if (!y)
      return d;
    const g = o(y.semver, d.semver, f);
    return g < 0 ? y : g > 0 || d.operator === "<" && y.operator === "<=" ? d : y;
  };
  return Rs = a, Rs;
}
var Ps, Nl;
function a0() {
  if (Nl) return Ps;
  Nl = 1;
  const e = Cn(), t = fa(), r = We(), n = Lp(), o = jr(), a = M_(), s = x_(), i = D_(), u = q_(), c = L_(), l = z_(), y = V_(), d = U_(), f = mt(), g = F_(), _ = Z_(), m = Ni(), h = G_(), p = B_(), v = ha(), $ = Ai(), b = zp(), E = Vp(), I = Ci(), O = ji(), q = Up(), H = H_(), x = ma(), W = gt(), K = ga(), M = J_(), L = K_(), F = Y_(), G = X_(), B = Q_(), Q = Mi(), D = e0(), P = t0(), C = r0(), k = n0(), S = o0();
  return Ps = {
    parse: o,
    valid: a,
    clean: s,
    inc: i,
    diff: u,
    major: c,
    minor: l,
    patch: y,
    prerelease: d,
    compare: f,
    rcompare: g,
    compareLoose: _,
    compareBuild: m,
    sort: h,
    rsort: p,
    gt: v,
    lt: $,
    eq: b,
    neq: E,
    gte: I,
    lte: O,
    cmp: q,
    coerce: H,
    Comparator: x,
    Range: W,
    satisfies: K,
    toComparators: M,
    maxSatisfying: L,
    minSatisfying: F,
    minVersion: G,
    validRange: B,
    outside: Q,
    gtr: D,
    ltr: P,
    intersects: C,
    simplifyRange: k,
    subset: S,
    SemVer: r,
    re: e.re,
    src: e.src,
    tokens: e.t,
    SEMVER_SPEC_VERSION: t.SEMVER_SPEC_VERSION,
    RELEASE_TYPES: t.RELEASE_TYPES,
    compareIdentifiers: n.compareIdentifiers,
    rcompareIdentifiers: n.rcompareIdentifiers
  }, Ps;
}
var s0 = a0();
const wr = /* @__PURE__ */ Ep(s0), i0 = Object.prototype.toString, u0 = "[object Uint8Array]", c0 = "[object ArrayBuffer]";
function Fp(e, t, r) {
  return e ? e.constructor === t ? !0 : i0.call(e) === r : !1;
}
function Zp(e) {
  return Fp(e, Uint8Array, u0);
}
function l0(e) {
  return Fp(e, ArrayBuffer, c0);
}
function d0(e) {
  return Zp(e) || l0(e);
}
function f0(e) {
  if (!Zp(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
function p0(e) {
  if (!d0(e))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof e}\``);
}
function Al(e, t) {
  if (e.length === 0)
    return new Uint8Array(0);
  t ?? (t = e.reduce((o, a) => o + a.length, 0));
  const r = new Uint8Array(t);
  let n = 0;
  for (const o of e)
    f0(o), r.set(o, n), n += o.length;
  return r;
}
const Lo = {
  utf8: new globalThis.TextDecoder("utf8")
};
function Cl(e, t = "utf8") {
  return p0(e), Lo[t] ?? (Lo[t] = new globalThis.TextDecoder(t)), Lo[t].decode(e);
}
function h0(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
const m0 = new globalThis.TextEncoder();
function ks(e) {
  return h0(e), m0.encode(e);
}
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
const g0 = T_.default, jl = "aes-256-cbc", Er = () => /* @__PURE__ */ Object.create(null), y0 = (e) => e != null, v0 = (e, t) => {
  const r = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), n = typeof t;
  if (r.has(n))
    throw new TypeError(`Setting a value of type \`${n}\` for key \`${e}\` is not allowed as it's not supported by JSON`);
}, Jo = "__internal__", Ns = `${Jo}.migrations.version`;
var Ft, Rt, Qe, Pt;
class _0 {
  constructor(t = {}) {
    ke(this, "path");
    ke(this, "events");
    Ur(this, Ft);
    Ur(this, Rt);
    Ur(this, Qe);
    Ur(this, Pt, {});
    ke(this, "_deserialize", (t) => JSON.parse(t));
    ke(this, "_serialize", (t) => JSON.stringify(t, void 0, "	"));
    const r = {
      configName: "config",
      fileExtension: "json",
      projectSuffix: "nodejs",
      clearInvalidConfig: !1,
      accessPropertiesByDotNotation: !0,
      configFileMode: 438,
      ...t
    };
    if (!r.cwd) {
      if (!r.projectName)
        throw new Error("Please specify the `projectName` option.");
      r.cwd = Mg(r.projectName, { suffix: r.projectSuffix }).config;
    }
    if (Fr(this, Qe, r), r.schema ?? r.ajvOptions ?? r.rootSchema) {
      if (r.schema && typeof r.schema != "object")
        throw new TypeError("The `schema` option must be an object.");
      const s = new f_.Ajv2020({
        allErrors: !0,
        useDefaults: !0,
        ...r.ajvOptions
      });
      g0(s);
      const i = {
        ...r.rootSchema,
        type: "object",
        properties: r.schema
      };
      Fr(this, Ft, s.compile(i));
      for (const [u, c] of Object.entries(r.schema ?? {}))
        c != null && c.default && (we(this, Pt)[u] = c.default);
    }
    r.defaults && Fr(this, Pt, {
      ...we(this, Pt),
      ...r.defaults
    }), r.serialize && (this._serialize = r.serialize), r.deserialize && (this._deserialize = r.deserialize), this.events = new EventTarget(), Fr(this, Rt, r.encryptionKey);
    const n = r.fileExtension ? `.${r.fileExtension}` : "";
    this.path = ge.resolve(r.cwd, `${r.configName ?? "config"}${n}`);
    const o = this.store, a = Object.assign(Er(), r.defaults, o);
    if (r.migrations) {
      if (!r.projectVersion)
        throw new Error("Please specify the `projectVersion` option.");
      this._migrate(r.migrations, r.projectVersion, r.beforeEachMigration);
    }
    this._validate(a);
    try {
      Sg.deepEqual(o, a);
    } catch {
      this.store = a;
    }
    r.watch && this._watch();
  }
  get(t, r) {
    if (we(this, Qe).accessPropertiesByDotNotation)
      return this._get(t, r);
    const { store: n } = this;
    return t in n ? n[t] : r;
  }
  set(t, r) {
    if (typeof t != "string" && typeof t != "object")
      throw new TypeError(`Expected \`key\` to be of type \`string\` or \`object\`, got ${typeof t}`);
    if (typeof t != "object" && r === void 0)
      throw new TypeError("Use `delete()` to clear values");
    if (this._containsReservedKey(t))
      throw new TypeError(`Please don't use the ${Jo} key, as it's used to manage this module internal operations.`);
    const { store: n } = this, o = (a, s) => {
      v0(a, s), we(this, Qe).accessPropertiesByDotNotation ? au(n, a, s) : n[a] = s;
    };
    if (typeof t == "object") {
      const a = t;
      for (const [s, i] of Object.entries(a))
        o(s, i);
    } else
      o(t, r);
    this.store = n;
  }
  has(t) {
    return we(this, Qe).accessPropertiesByDotNotation ? Ng(this.store, t) : t in this.store;
  }
  /**
      Reset items to their default values, as defined by the `defaults` or `schema` option.
  
      @see `clear()` to reset all items.
  
      @param keys - The keys of the items to reset.
      */
  reset(...t) {
    for (const r of t)
      y0(we(this, Pt)[r]) && this.set(r, we(this, Pt)[r]);
  }
  delete(t) {
    const { store: r } = this;
    we(this, Qe).accessPropertiesByDotNotation ? kg(r, t) : delete r[t], this.store = r;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    this.store = Er();
    for (const t of Object.keys(we(this, Pt)))
      this.reset(t);
  }
  onDidChange(t, r) {
    if (typeof t != "string")
      throw new TypeError(`Expected \`key\` to be of type \`string\`, got ${typeof t}`);
    if (typeof r != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof r}`);
    return this._handleChange(() => this.get(t), r);
  }
  /**
      Watches the whole config object, calling `callback` on any changes.
  
      @param callback - A callback function that is called on any changes. When a `key` is first set `oldValue` will be `undefined`, and when a key is deleted `newValue` will be `undefined`.
      @returns A function, that when called, will unsubscribe.
      */
  onDidAnyChange(t) {
    if (typeof t != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof t}`);
    return this._handleChange(() => this.store, t);
  }
  get size() {
    return Object.keys(this.store).length;
  }
  /**
      Get all the config as an object or replace the current config with an object.
  
      @example
      ```
      console.log(config.store);
      //=> {name: 'John', age: 30}
      ```
  
      @example
      ```
      config.store = {
          hello: 'world'
      };
      ```
      */
  get store() {
    try {
      const t = ue.readFileSync(this.path, we(this, Rt) ? null : "utf8"), r = this._encryptData(t), n = this._deserialize(r);
      return this._validate(n), Object.assign(Er(), n);
    } catch (t) {
      if ((t == null ? void 0 : t.code) === "ENOENT")
        return this._ensureDirectory(), Er();
      if (we(this, Qe).clearInvalidConfig && t.name === "SyntaxError")
        return Er();
      throw t;
    }
  }
  set store(t) {
    this._ensureDirectory(), this._validate(t), this._write(t), this.events.dispatchEvent(new Event("change"));
  }
  *[Symbol.iterator]() {
    for (const [t, r] of Object.entries(this.store))
      yield [t, r];
  }
  _encryptData(t) {
    if (!we(this, Rt))
      return typeof t == "string" ? t : Cl(t);
    try {
      const r = t.slice(0, 16), n = Zr.pbkdf2Sync(we(this, Rt), r.toString(), 1e4, 32, "sha512"), o = Zr.createDecipheriv(jl, n, r), a = t.slice(17), s = typeof a == "string" ? ks(a) : a;
      return Cl(Al([o.update(s), o.final()]));
    } catch {
    }
    return t.toString();
  }
  _handleChange(t, r) {
    let n = t();
    const o = () => {
      const a = n, s = t();
      $g(s, a) || (n = s, r.call(this, s, a));
    };
    return this.events.addEventListener("change", o), () => {
      this.events.removeEventListener("change", o);
    };
  }
  _validate(t) {
    if (!we(this, Ft) || we(this, Ft).call(this, t) || !we(this, Ft).errors)
      return;
    const n = we(this, Ft).errors.map(({ instancePath: o, message: a = "" }) => `\`${o.slice(1)}\` ${a}`);
    throw new Error("Config schema violation: " + n.join("; "));
  }
  _ensureDirectory() {
    ue.mkdirSync(ge.dirname(this.path), { recursive: !0 });
  }
  _write(t) {
    let r = this._serialize(t);
    if (we(this, Rt)) {
      const n = Zr.randomBytes(16), o = Zr.pbkdf2Sync(we(this, Rt), n.toString(), 1e4, 32, "sha512"), a = Zr.createCipheriv(jl, o, n);
      r = Al([n, ks(":"), a.update(ks(r)), a.final()]);
    }
    if (Se.env.SNAP)
      ue.writeFileSync(this.path, r, { mode: we(this, Qe).configFileMode });
    else
      try {
        wp(this.path, r, { mode: we(this, Qe).configFileMode });
      } catch (n) {
        if ((n == null ? void 0 : n.code) === "EXDEV") {
          ue.writeFileSync(this.path, r, { mode: we(this, Qe).configFileMode });
          return;
        }
        throw n;
      }
  }
  _watch() {
    this._ensureDirectory(), ue.existsSync(this.path) || this._write(Er()), Se.platform === "win32" ? ue.watch(this.path, { persistent: !1 }, zc(() => {
      this.events.dispatchEvent(new Event("change"));
    }, { wait: 100 })) : ue.watchFile(this.path, { persistent: !1 }, zc(() => {
      this.events.dispatchEvent(new Event("change"));
    }, { wait: 5e3 }));
  }
  _migrate(t, r, n) {
    let o = this._get(Ns, "0.0.0");
    const a = Object.keys(t).filter((i) => this._shouldPerformMigration(i, o, r));
    let s = { ...this.store };
    for (const i of a)
      try {
        n && n(this, {
          fromVersion: o,
          toVersion: i,
          finalVersion: r,
          versions: a
        });
        const u = t[i];
        u == null || u(this), this._set(Ns, i), o = i, s = { ...this.store };
      } catch (u) {
        throw this.store = s, new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${u}`);
      }
    (this._isVersionInRangeFormat(o) || !wr.eq(o, r)) && this._set(Ns, r);
  }
  _containsReservedKey(t) {
    return typeof t == "object" && Object.keys(t)[0] === Jo ? !0 : typeof t != "string" ? !1 : we(this, Qe).accessPropertiesByDotNotation ? !!t.startsWith(`${Jo}.`) : !1;
  }
  _isVersionInRangeFormat(t) {
    return wr.clean(t) === null;
  }
  _shouldPerformMigration(t, r, n) {
    return this._isVersionInRangeFormat(t) ? r !== "0.0.0" && wr.satisfies(r, t) ? !1 : wr.satisfies(n, t) : !(wr.lte(t, r) || wr.gt(t, n));
  }
  _get(t, r) {
    return Pg(this.store, t, r);
  }
  _set(t, r) {
    const { store: n } = this;
    au(n, t, r), this.store = n;
  }
}
Ft = new WeakMap(), Rt = new WeakMap(), Qe = new WeakMap(), Pt = new WeakMap();
const { app: Ko, ipcMain: fi, shell: b0 } = gp;
let Ml = !1;
const xl = () => {
  if (!fi || !Ko)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: Ko.getPath("userData"),
    appVersion: Ko.getVersion()
  };
  return Ml || (fi.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), Ml = !0), e;
};
class w0 extends _0 {
  constructor(t) {
    let r, n;
    if (Se.type === "renderer") {
      const o = gp.ipcRenderer.sendSync("electron-store-get-data");
      if (!o)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: r, appVersion: n } = o);
    } else fi && Ko && ({ defaultCwd: r, appVersion: n } = xl());
    t = {
      name: "config",
      ...t
    }, t.projectVersion || (t.projectVersion = n), t.cwd ? t.cwd = ge.isAbsolute(t.cwd) ? t.cwd : ge.join(r, t.cwd) : t.cwd = r, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    xl();
  }
  async openInEditor() {
    const t = await b0.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
var zo = { exports: {} };
function Gp(e) {
  throw new Error('Could not dynamically require "' + e + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var Jr = {}, Dl;
function jt() {
  return Dl || (Dl = 1, Jr.getBooleanOption = (e, t) => {
    let r = !1;
    if (t in e && typeof (r = e[t]) != "boolean")
      throw new TypeError(`Expected the "${t}" option to be a boolean`);
    return r;
  }, Jr.cppdb = Symbol(), Jr.inspect = Symbol.for("nodejs.util.inspect.custom")), Jr;
}
var As, ql;
function Bp() {
  if (ql) return As;
  ql = 1;
  const e = { value: "SqliteError", writable: !0, enumerable: !1, configurable: !0 };
  function t(r, n) {
    if (new.target !== t)
      return new t(r, n);
    if (typeof n != "string")
      throw new TypeError("Expected second argument to be a string");
    Error.call(this, r), e.value = "" + r, Object.defineProperty(this, "message", e), Error.captureStackTrace(this, t), this.code = n;
  }
  return Object.setPrototypeOf(t, Error), Object.setPrototypeOf(t.prototype, Error.prototype), Object.defineProperty(t.prototype, "name", e), As = t, As;
}
var Vo = { exports: {} }, Cs, Ll;
function E0() {
  if (Ll) return Cs;
  Ll = 1;
  var e = ir.sep || "/";
  Cs = t;
  function t(r) {
    if (typeof r != "string" || r.length <= 7 || r.substring(0, 7) != "file://")
      throw new TypeError("must pass in a file:// URI to convert to a file path");
    var n = decodeURI(r.substring(7)), o = n.indexOf("/"), a = n.substring(0, o), s = n.substring(o + 1);
    return a == "localhost" && (a = ""), a && (a = e + e + a), s = s.replace(/^(.+)\|/, "$1:"), e == "\\" && (s = s.replace(/\//g, "\\")), /^.+\:/.test(s) || (s = e + s), a + s;
  }
  return Cs;
}
var zl;
function $0() {
  return zl || (zl = 1, (function(e, t) {
    var r = $i, n = ir, o = E0(), a = n.join, s = n.dirname, i = r.accessSync && function(l) {
      try {
        r.accessSync(l);
      } catch {
        return !1;
      }
      return !0;
    } || r.existsSync || n.existsSync, u = {
      arrow: process.env.NODE_BINDINGS_ARROW || " → ",
      compiled: process.env.NODE_BINDINGS_COMPILED_DIR || "compiled",
      platform: process.platform,
      arch: process.arch,
      nodePreGyp: "node-v" + process.versions.modules + "-" + process.platform + "-" + process.arch,
      version: process.versions.node,
      bindings: "bindings.node",
      try: [
        // node-gyp's linked version in the "build" dir
        ["module_root", "build", "bindings"],
        // node-waf and gyp_addon (a.k.a node-gyp)
        ["module_root", "build", "Debug", "bindings"],
        ["module_root", "build", "Release", "bindings"],
        // Debug files, for development (legacy behavior, remove for node v0.9)
        ["module_root", "out", "Debug", "bindings"],
        ["module_root", "Debug", "bindings"],
        // Release files, but manually compiled (legacy behavior, remove for node v0.9)
        ["module_root", "out", "Release", "bindings"],
        ["module_root", "Release", "bindings"],
        // Legacy from node-waf, node <= 0.4.x
        ["module_root", "build", "default", "bindings"],
        // Production "Release" buildtype binary (meh...)
        ["module_root", "compiled", "version", "platform", "arch", "bindings"],
        // node-qbs builds
        ["module_root", "addon-build", "release", "install-root", "bindings"],
        ["module_root", "addon-build", "debug", "install-root", "bindings"],
        ["module_root", "addon-build", "default", "install-root", "bindings"],
        // node-pre-gyp path ./lib/binding/{node_abi}-{platform}-{arch}
        ["module_root", "lib", "binding", "nodePreGyp", "bindings"]
      ]
    };
    function c(l) {
      typeof l == "string" ? l = { bindings: l } : l || (l = {}), Object.keys(u).map(function(p) {
        p in l || (l[p] = u[p]);
      }), l.module_root || (l.module_root = t.getRoot(t.getFileName())), n.extname(l.bindings) != ".node" && (l.bindings += ".node");
      for (var y = typeof __webpack_require__ == "function" ? __non_webpack_require__ : Gp, d = [], f = 0, g = l.try.length, _, m, h; f < g; f++) {
        _ = a.apply(
          null,
          l.try[f].map(function(p) {
            return l[p] || p;
          })
        ), d.push(_);
        try {
          return m = l.path ? y.resolve(_) : y(_), l.path || (m.path = _), m;
        } catch (p) {
          if (p.code !== "MODULE_NOT_FOUND" && p.code !== "QUALIFIED_PATH_RESOLUTION_FAILED" && !/not find/i.test(p.message))
            throw p;
        }
      }
      throw h = new Error(
        `Could not locate the bindings file. Tried:
` + d.map(function(p) {
          return l.arrow + p;
        }).join(`
`)
      ), h.tries = d, h;
    }
    e.exports = t = c, t.getFileName = function(y) {
      var d = Error.prepareStackTrace, f = Error.stackTraceLimit, g = {}, _;
      Error.stackTraceLimit = 10, Error.prepareStackTrace = function(h, p) {
        for (var v = 0, $ = p.length; v < $; v++)
          if (_ = p[v].getFileName(), _ !== __filename)
            if (y) {
              if (_ !== y)
                return;
            } else
              return;
      }, Error.captureStackTrace(g), g.stack, Error.prepareStackTrace = d, Error.stackTraceLimit = f;
      var m = "file://";
      return _.indexOf(m) === 0 && (_ = o(_)), _;
    }, t.getRoot = function(y) {
      for (var d = s(y), f; ; ) {
        if (d === "." && (d = process.cwd()), i(a(d, "package.json")) || i(a(d, "node_modules")))
          return d;
        if (f === d)
          throw new Error(
            'Could not find module root given file: "' + y + '". Do you have a `package.json` file? '
          );
        f = d, d = a(d, "..");
      }
    };
  })(Vo, Vo.exports)), Vo.exports;
}
var Tt = {}, Vl;
function S0() {
  if (Vl) return Tt;
  Vl = 1;
  const { cppdb: e } = jt();
  return Tt.prepare = function(r) {
    return this[e].prepare(r, this, !1);
  }, Tt.exec = function(r) {
    return this[e].exec(r), this;
  }, Tt.close = function() {
    return this[e].close(), this;
  }, Tt.loadExtension = function(...r) {
    return this[e].loadExtension(...r), this;
  }, Tt.defaultSafeIntegers = function(...r) {
    return this[e].defaultSafeIntegers(...r), this;
  }, Tt.unsafeMode = function(...r) {
    return this[e].unsafeMode(...r), this;
  }, Tt.getters = {
    name: {
      get: function() {
        return this[e].name;
      },
      enumerable: !0
    },
    open: {
      get: function() {
        return this[e].open;
      },
      enumerable: !0
    },
    inTransaction: {
      get: function() {
        return this[e].inTransaction;
      },
      enumerable: !0
    },
    readonly: {
      get: function() {
        return this[e].readonly;
      },
      enumerable: !0
    },
    memory: {
      get: function() {
        return this[e].memory;
      },
      enumerable: !0
    }
  }, Tt;
}
var js, Ul;
function I0() {
  if (Ul) return js;
  Ul = 1;
  const { cppdb: e } = jt(), t = /* @__PURE__ */ new WeakMap();
  js = function(a) {
    if (typeof a != "function") throw new TypeError("Expected first argument to be a function");
    const s = this[e], i = r(s, this), { apply: u } = Function.prototype, c = {
      default: { value: n(u, a, s, i.default) },
      deferred: { value: n(u, a, s, i.deferred) },
      immediate: { value: n(u, a, s, i.immediate) },
      exclusive: { value: n(u, a, s, i.exclusive) },
      database: { value: this, enumerable: !0 }
    };
    return Object.defineProperties(c.default.value, c), Object.defineProperties(c.deferred.value, c), Object.defineProperties(c.immediate.value, c), Object.defineProperties(c.exclusive.value, c), c.default.value;
  };
  const r = (o, a) => {
    let s = t.get(o);
    if (!s) {
      const i = {
        commit: o.prepare("COMMIT", a, !1),
        rollback: o.prepare("ROLLBACK", a, !1),
        savepoint: o.prepare("SAVEPOINT `	_bs3.	`", a, !1),
        release: o.prepare("RELEASE `	_bs3.	`", a, !1),
        rollbackTo: o.prepare("ROLLBACK TO `	_bs3.	`", a, !1)
      };
      t.set(o, s = {
        default: Object.assign({ begin: o.prepare("BEGIN", a, !1) }, i),
        deferred: Object.assign({ begin: o.prepare("BEGIN DEFERRED", a, !1) }, i),
        immediate: Object.assign({ begin: o.prepare("BEGIN IMMEDIATE", a, !1) }, i),
        exclusive: Object.assign({ begin: o.prepare("BEGIN EXCLUSIVE", a, !1) }, i)
      });
    }
    return s;
  }, n = (o, a, s, { begin: i, commit: u, rollback: c, savepoint: l, release: y, rollbackTo: d }) => function() {
    let g, _, m;
    s.inTransaction ? (g = l, _ = y, m = d) : (g = i, _ = u, m = c), g.run();
    try {
      const h = o.call(a, this, arguments);
      if (h && typeof h.then == "function")
        throw new TypeError("Transaction function cannot return a promise");
      return _.run(), h;
    } catch (h) {
      throw s.inTransaction && (m.run(), m !== c && _.run()), h;
    }
  };
  return js;
}
var Ms, Fl;
function T0() {
  if (Fl) return Ms;
  Fl = 1;
  const { getBooleanOption: e, cppdb: t } = jt();
  return Ms = function(n, o) {
    if (o == null && (o = {}), typeof n != "string") throw new TypeError("Expected first argument to be a string");
    if (typeof o != "object") throw new TypeError("Expected second argument to be an options object");
    const a = e(o, "simple"), s = this[t].prepare(`PRAGMA ${n}`, this, !0);
    return a ? s.pluck().get() : s.all();
  }, Ms;
}
var xs, Zl;
function O0() {
  if (Zl) return xs;
  Zl = 1;
  const e = $i, t = ir, { promisify: r } = Ig, { cppdb: n } = jt(), o = r(e.access);
  xs = async function(i, u) {
    if (u == null && (u = {}), typeof i != "string") throw new TypeError("Expected first argument to be a string");
    if (typeof u != "object") throw new TypeError("Expected second argument to be an options object");
    i = i.trim();
    const c = "attached" in u ? u.attached : "main", l = "progress" in u ? u.progress : null;
    if (!i) throw new TypeError("Backup filename cannot be an empty string");
    if (i === ":memory:") throw new TypeError('Invalid backup filename ":memory:"');
    if (typeof c != "string") throw new TypeError('Expected the "attached" option to be a string');
    if (!c) throw new TypeError('The "attached" option cannot be an empty string');
    if (l != null && typeof l != "function") throw new TypeError('Expected the "progress" option to be a function');
    await o(t.dirname(i)).catch(() => {
      throw new TypeError("Cannot save backup because the directory does not exist");
    });
    const y = await o(i).then(() => !1, () => !0);
    return a(this[n].backup(this, c, i, y), l || null);
  };
  const a = (s, i) => {
    let u = 0, c = !0;
    return new Promise((l, y) => {
      setImmediate(function d() {
        try {
          const f = s.transfer(u);
          if (!f.remainingPages) {
            s.close(), l(f);
            return;
          }
          if (c && (c = !1, u = 100), i) {
            const g = i(f);
            if (g !== void 0)
              if (typeof g == "number" && g === g) u = Math.max(0, Math.min(2147483647, Math.round(g)));
              else throw new TypeError("Expected progress callback to return a number or undefined");
          }
          setImmediate(d);
        } catch (f) {
          s.close(), y(f);
        }
      });
    });
  };
  return xs;
}
var Ds, Gl;
function R0() {
  if (Gl) return Ds;
  Gl = 1;
  const { cppdb: e } = jt();
  return Ds = function(r) {
    if (r == null && (r = {}), typeof r != "object") throw new TypeError("Expected first argument to be an options object");
    const n = "attached" in r ? r.attached : "main";
    if (typeof n != "string") throw new TypeError('Expected the "attached" option to be a string');
    if (!n) throw new TypeError('The "attached" option cannot be an empty string');
    return this[e].serialize(n);
  }, Ds;
}
var qs, Bl;
function P0() {
  if (Bl) return qs;
  Bl = 1;
  const { getBooleanOption: e, cppdb: t } = jt();
  return qs = function(n, o, a) {
    if (o == null && (o = {}), typeof o == "function" && (a = o, o = {}), typeof n != "string") throw new TypeError("Expected first argument to be a string");
    if (typeof a != "function") throw new TypeError("Expected last argument to be a function");
    if (typeof o != "object") throw new TypeError("Expected second argument to be an options object");
    if (!n) throw new TypeError("User-defined function name cannot be an empty string");
    const s = "safeIntegers" in o ? +e(o, "safeIntegers") : 2, i = e(o, "deterministic"), u = e(o, "directOnly"), c = e(o, "varargs");
    let l = -1;
    if (!c) {
      if (l = a.length, !Number.isInteger(l) || l < 0) throw new TypeError("Expected function.length to be a positive integer");
      if (l > 100) throw new RangeError("User-defined functions cannot have more than 100 arguments");
    }
    return this[t].function(a, n, l, s, i, u), this;
  }, qs;
}
var Ls, Hl;
function k0() {
  if (Hl) return Ls;
  Hl = 1;
  const { getBooleanOption: e, cppdb: t } = jt();
  Ls = function(a, s) {
    if (typeof a != "string") throw new TypeError("Expected first argument to be a string");
    if (typeof s != "object" || s === null) throw new TypeError("Expected second argument to be an options object");
    if (!a) throw new TypeError("User-defined function name cannot be an empty string");
    const i = "start" in s ? s.start : null, u = r(s, "step", !0), c = r(s, "inverse", !1), l = r(s, "result", !1), y = "safeIntegers" in s ? +e(s, "safeIntegers") : 2, d = e(s, "deterministic"), f = e(s, "directOnly"), g = e(s, "varargs");
    let _ = -1;
    if (!g && (_ = Math.max(n(u), c ? n(c) : 0), _ > 0 && (_ -= 1), _ > 100))
      throw new RangeError("User-defined functions cannot have more than 100 arguments");
    return this[t].aggregate(i, u, c, l, a, _, y, d, f), this;
  };
  const r = (o, a, s) => {
    const i = a in o ? o[a] : null;
    if (typeof i == "function") return i;
    if (i != null) throw new TypeError(`Expected the "${a}" option to be a function`);
    if (s) throw new TypeError(`Missing required option "${a}"`);
    return null;
  }, n = ({ length: o }) => {
    if (Number.isInteger(o) && o >= 0) return o;
    throw new TypeError("Expected function.length to be a positive integer");
  };
  return Ls;
}
var zs, Wl;
function N0() {
  if (Wl) return zs;
  Wl = 1;
  const { cppdb: e } = jt();
  zs = function(f, g) {
    if (typeof f != "string") throw new TypeError("Expected first argument to be a string");
    if (!f) throw new TypeError("Virtual table module name cannot be an empty string");
    let _ = !1;
    if (typeof g == "object" && g !== null)
      _ = !0, g = y(r(g, "used", f));
    else {
      if (typeof g != "function") throw new TypeError("Expected second argument to be a function or a table definition object");
      g = t(g);
    }
    return this[e].table(g, f, _), this;
  };
  function t(d) {
    return function(g, _, m, ...h) {
      const p = {
        module: g,
        database: _,
        table: m
      }, v = u.call(d, p, h);
      if (typeof v != "object" || v === null)
        throw new TypeError(`Virtual table module "${g}" did not return a table definition object`);
      return r(v, "returned", g);
    };
  }
  function r(d, f, g) {
    if (!i.call(d, "rows"))
      throw new TypeError(`Virtual table module "${g}" ${f} a table definition without a "rows" property`);
    if (!i.call(d, "columns"))
      throw new TypeError(`Virtual table module "${g}" ${f} a table definition without a "columns" property`);
    const _ = d.rows;
    if (typeof _ != "function" || Object.getPrototypeOf(_) !== c)
      throw new TypeError(`Virtual table module "${g}" ${f} a table definition with an invalid "rows" property (should be a generator function)`);
    let m = d.columns;
    if (!Array.isArray(m) || !(m = [...m]).every((b) => typeof b == "string"))
      throw new TypeError(`Virtual table module "${g}" ${f} a table definition with an invalid "columns" property (should be an array of strings)`);
    if (m.length !== new Set(m).size)
      throw new TypeError(`Virtual table module "${g}" ${f} a table definition with duplicate column names`);
    if (!m.length)
      throw new RangeError(`Virtual table module "${g}" ${f} a table definition with zero columns`);
    let h;
    if (i.call(d, "parameters")) {
      if (h = d.parameters, !Array.isArray(h) || !(h = [...h]).every((b) => typeof b == "string"))
        throw new TypeError(`Virtual table module "${g}" ${f} a table definition with an invalid "parameters" property (should be an array of strings)`);
    } else
      h = s(_);
    if (h.length !== new Set(h).size)
      throw new TypeError(`Virtual table module "${g}" ${f} a table definition with duplicate parameter names`);
    if (h.length > 32)
      throw new RangeError(`Virtual table module "${g}" ${f} a table definition with more than the maximum number of 32 parameters`);
    for (const b of h)
      if (m.includes(b))
        throw new TypeError(`Virtual table module "${g}" ${f} a table definition with column "${b}" which was ambiguously defined as both a column and parameter`);
    let p = 2;
    if (i.call(d, "safeIntegers")) {
      const b = d.safeIntegers;
      if (typeof b != "boolean")
        throw new TypeError(`Virtual table module "${g}" ${f} a table definition with an invalid "safeIntegers" property (should be a boolean)`);
      p = +b;
    }
    let v = !1;
    if (i.call(d, "directOnly") && (v = d.directOnly, typeof v != "boolean"))
      throw new TypeError(`Virtual table module "${g}" ${f} a table definition with an invalid "directOnly" property (should be a boolean)`);
    return [
      `CREATE TABLE x(${[
        ...h.map(l).map((b) => `${b} HIDDEN`),
        ...m.map(l)
      ].join(", ")});`,
      n(_, new Map(m.map((b, E) => [b, h.length + E])), g),
      h,
      p,
      v
    ];
  }
  function n(d, f, g) {
    return function* (...m) {
      const h = m.map((p) => Buffer.isBuffer(p) ? Buffer.from(p) : p);
      for (let p = 0; p < f.size; ++p)
        h.push(null);
      for (const p of d(...m))
        if (Array.isArray(p))
          o(p, h, f.size, g), yield h;
        else if (typeof p == "object" && p !== null)
          a(p, h, f, g), yield h;
        else
          throw new TypeError(`Virtual table module "${g}" yielded something that isn't a valid row object`);
    };
  }
  function o(d, f, g, _) {
    if (d.length !== g)
      throw new TypeError(`Virtual table module "${_}" yielded a row with an incorrect number of columns`);
    const m = f.length - g;
    for (let h = 0; h < g; ++h)
      f[h + m] = d[h];
  }
  function a(d, f, g, _) {
    let m = 0;
    for (const h of Object.keys(d)) {
      const p = g.get(h);
      if (p === void 0)
        throw new TypeError(`Virtual table module "${_}" yielded a row with an undeclared column "${h}"`);
      f[p] = d[h], m += 1;
    }
    if (m !== g.size)
      throw new TypeError(`Virtual table module "${_}" yielded a row with missing columns`);
  }
  function s({ length: d }) {
    if (!Number.isInteger(d) || d < 0)
      throw new TypeError("Expected function.length to be a positive integer");
    const f = [];
    for (let g = 0; g < d; ++g)
      f.push(`$${g + 1}`);
    return f;
  }
  const { hasOwnProperty: i } = Object.prototype, { apply: u } = Function.prototype, c = Object.getPrototypeOf(function* () {
  }), l = (d) => `"${d.replace(/"/g, '""')}"`, y = (d) => () => d;
  return zs;
}
var Vs, Jl;
function A0() {
  if (Jl) return Vs;
  Jl = 1;
  const e = function() {
  };
  return Vs = function(r, n) {
    return Object.assign(new e(), this);
  }, Vs;
}
var Us, Kl;
function C0() {
  if (Kl) return Us;
  Kl = 1;
  const e = $i, t = ir, r = jt(), n = Bp();
  let o;
  function a(i, u) {
    if (new.target == null)
      return new a(i, u);
    let c;
    if (Buffer.isBuffer(i) && (c = i, i = ":memory:"), i == null && (i = ""), u == null && (u = {}), typeof i != "string") throw new TypeError("Expected first argument to be a string");
    if (typeof u != "object") throw new TypeError("Expected second argument to be an options object");
    if ("readOnly" in u) throw new TypeError('Misspelled option "readOnly" should be "readonly"');
    if ("memory" in u) throw new TypeError('Option "memory" was removed in v7.0.0 (use ":memory:" filename instead)');
    const l = i.trim(), y = l === "" || l === ":memory:", d = r.getBooleanOption(u, "readonly"), f = r.getBooleanOption(u, "fileMustExist"), g = "timeout" in u ? u.timeout : 5e3, _ = "verbose" in u ? u.verbose : null, m = "nativeBinding" in u ? u.nativeBinding : null;
    if (d && y && !c) throw new TypeError("In-memory/temporary databases cannot be readonly");
    if (!Number.isInteger(g) || g < 0) throw new TypeError('Expected the "timeout" option to be a positive integer');
    if (g > 2147483647) throw new RangeError('Option "timeout" cannot be greater than 2147483647');
    if (_ != null && typeof _ != "function") throw new TypeError('Expected the "verbose" option to be a function');
    if (m != null && typeof m != "string" && typeof m != "object") throw new TypeError('Expected the "nativeBinding" option to be a string or addon object');
    let h;
    if (m == null ? h = o || (o = $0()("better_sqlite3.node")) : typeof m == "string" ? h = (typeof __non_webpack_require__ == "function" ? __non_webpack_require__ : Gp)(t.resolve(m).replace(/(\.node)?$/, ".node")) : h = m, h.isInitialized || (h.setErrorConstructor(n), h.isInitialized = !0), !y && !l.startsWith("file:") && !e.existsSync(t.dirname(l)))
      throw new TypeError("Cannot open database because the directory does not exist");
    Object.defineProperties(this, {
      [r.cppdb]: { value: new h.Database(l, i, y, d, f, g, _ || null, c || null) },
      ...s.getters
    });
  }
  const s = S0();
  return a.prototype.prepare = s.prepare, a.prototype.transaction = I0(), a.prototype.pragma = T0(), a.prototype.backup = O0(), a.prototype.serialize = R0(), a.prototype.function = P0(), a.prototype.aggregate = k0(), a.prototype.table = N0(), a.prototype.loadExtension = s.loadExtension, a.prototype.exec = s.exec, a.prototype.close = s.close, a.prototype.defaultSafeIntegers = s.defaultSafeIntegers, a.prototype.unsafeMode = s.unsafeMode, a.prototype[r.inspect] = A0(), Us = a, Us;
}
var Yl;
function j0() {
  return Yl || (Yl = 1, zo.exports = C0(), zo.exports.SqliteError = Bp()), zo.exports;
}
j0();
class M0 {
  constructor(t) {
    ke(this, "name", "file");
    ke(this, "description", "Read, write, list, and manage files on the local system");
    ke(this, "allowedPaths", []);
    this.allowedPaths = t || [process.cwd()];
  }
  /**
   * Check if a path is within allowed directories
   */
  isPathAllowed(t) {
    const r = ou.resolve(t);
    return this.allowedPaths.some(
      (n) => r.startsWith(ou.resolve(n))
    );
  }
  async execute(t) {
    const { operation: r, filePath: n, content: o } = t;
    if (!this.isPathAllowed(n))
      throw new Error(`Access denied: ${n} is outside allowed paths`);
    switch (r) {
      case "read":
        return await this.readFile(n);
      case "write":
        if (!o) throw new Error("Content required for write operation");
        return await this.writeFile(n, o);
      case "list":
        return await this.listDirectory(n);
      case "delete":
        return await this.deleteFile(n);
      case "metadata":
        return await this.getMetadata(n);
      default:
        throw new Error(`Unknown operation: ${r}`);
    }
  }
  async readFile(t) {
    return await Gr.readFile(t, "utf-8");
  }
  async writeFile(t, r) {
    return await Gr.writeFile(t, r, "utf-8"), { success: !0, path: t };
  }
  async listDirectory(t) {
    return await Gr.readdir(t);
  }
  async deleteFile(t) {
    return await Gr.unlink(t), { success: !0 };
  }
  async getMetadata(t) {
    const r = await Gr.stat(t);
    return {
      size: r.size,
      created: r.birthtime,
      modified: r.mtime,
      isDirectory: r.isDirectory(),
      isFile: r.isFile()
    };
  }
}
const x0 = Tg(Og);
class D0 {
  constructor(t) {
    ke(this, "name", "shell");
    ke(this, "description", "Execute safe shell commands with restrictions");
    ke(this, "allowedCommands", [
      "ls",
      "pwd",
      "echo",
      "cat",
      "grep",
      "find",
      "wc",
      "head",
      "tail",
      "git",
      "npm",
      "node",
      "python",
      "python3"
    ]);
    ke(this, "blockedPatterns", [
      /rm\s+-rf/i,
      /sudo/i,
      /chmod/i,
      /chown/i,
      />.*\/dev\//i,
      // Prevent writing to device files
      /\|\s*sh/i
      // Prevent piping to shell
    ]);
    t && (this.allowedCommands = t);
  }
  /**
   * Check if command is safe to execute
   */
  isCommandSafe(t) {
    if (this.blockedPatterns.some((n) => n.test(t)))
      return !1;
    const r = t.trim().split(" ")[0];
    return r ? this.allowedCommands.some(
      (n) => r === n || r.endsWith(`/${n}`)
    ) : !1;
  }
  async execute(t) {
    const { command: r, cwd: n, timeout: o = 5e3 } = t;
    if (!this.isCommandSafe(r))
      throw new Error(`Command not allowed: ${r}`);
    try {
      const { stdout: a, stderr: s } = await x0(r, {
        cwd: n || process.cwd(),
        timeout: o,
        maxBuffer: 1048576
        // 1MB max output
      });
      return {
        stdout: a.trim(),
        stderr: s.trim(),
        exitCode: 0
      };
    } catch (a) {
      return {
        stdout: a.stdout || "",
        stderr: a.stderr || a.message,
        exitCode: a.code || 1
      };
    }
  }
  /**
   * Get list of allowed commands
   */
  getAllowedCommands() {
    return [...this.allowedCommands];
  }
}
var Hp = "vercel.ai.error", q0 = Symbol.for(Hp), Wp, L0 = class Jp extends Error {
  /**
   * Creates an AI SDK Error.
   *
   * @param {Object} params - The parameters for creating the error.
   * @param {string} params.name - The name of the error.
   * @param {string} params.message - The error message.
   * @param {unknown} [params.cause] - The underlying cause of the error.
   */
  constructor({
    name: t,
    message: r,
    cause: n
  }) {
    super(r), this[Wp] = !0, this.name = t, this.cause = n;
  }
  /**
   * Checks if the given error is an AI SDK Error.
   * @param {unknown} error - The error to check.
   * @returns {boolean} True if the error is an AI SDK Error, false otherwise.
   */
  static isInstance(t) {
    return Jp.hasMarker(t, Hp);
  }
  static hasMarker(t, r) {
    const n = Symbol.for(r);
    return t != null && typeof t == "object" && n in t && typeof t[n] == "boolean" && t[n] === !0;
  }
};
Wp = q0;
var ie = L0, Kp = "AI_APICallError", Yp = `vercel.ai.error.${Kp}`, z0 = Symbol.for(Yp), Xp, Ae = class extends ie {
  constructor({
    message: e,
    url: t,
    requestBodyValues: r,
    statusCode: n,
    responseHeaders: o,
    responseBody: a,
    cause: s,
    isRetryable: i = n != null && (n === 408 || // request timeout
    n === 409 || // conflict
    n === 429 || // too many requests
    n >= 500),
    // server error
    data: u
  }) {
    super({ name: Kp, message: e, cause: s }), this[Xp] = !0, this.url = t, this.requestBodyValues = r, this.statusCode = n, this.responseHeaders = o, this.responseBody = a, this.isRetryable = i, this.data = u;
  }
  static isInstance(e) {
    return ie.hasMarker(e, Yp);
  }
};
Xp = z0;
var Qp = "AI_EmptyResponseBodyError", eh = `vercel.ai.error.${Qp}`, V0 = Symbol.for(eh), th, U0 = class extends ie {
  // used in isInstance
  constructor({ message: e = "Empty response body" } = {}) {
    super({ name: Qp, message: e }), this[th] = !0;
  }
  static isInstance(e) {
    return ie.hasMarker(e, eh);
  }
};
th = V0;
function jn(e) {
  return e == null ? "unknown error" : typeof e == "string" ? e : e instanceof Error ? e.message : JSON.stringify(e);
}
var rh = "AI_InvalidArgumentError", nh = `vercel.ai.error.${rh}`, F0 = Symbol.for(nh), oh, ah = class extends ie {
  constructor({
    message: t,
    cause: r,
    argument: n
  }) {
    super({ name: rh, message: t, cause: r }), this[oh] = !0, this.argument = n;
  }
  static isInstance(t) {
    return ie.hasMarker(t, nh);
  }
};
oh = F0;
var sh = "AI_InvalidPromptError", ih = `vercel.ai.error.${sh}`, Z0 = Symbol.for(ih), uh, sr = class extends ie {
  constructor({
    prompt: e,
    message: t,
    cause: r
  }) {
    super({ name: sh, message: `Invalid prompt: ${t}`, cause: r }), this[uh] = !0, this.prompt = e;
  }
  static isInstance(e) {
    return ie.hasMarker(e, ih);
  }
};
uh = Z0;
var ch = "AI_InvalidResponseDataError", lh = `vercel.ai.error.${ch}`, G0 = Symbol.for(lh), dh, Fs = class extends ie {
  constructor({
    data: e,
    message: t = `Invalid response data: ${JSON.stringify(e)}.`
  }) {
    super({ name: ch, message: t }), this[dh] = !0, this.data = e;
  }
  static isInstance(e) {
    return ie.hasMarker(e, lh);
  }
};
dh = G0;
var fh = "AI_JSONParseError", ph = `vercel.ai.error.${fh}`, B0 = Symbol.for(ph), hh, Qo = class extends ie {
  constructor({ text: e, cause: t }) {
    super({
      name: fh,
      message: `JSON parsing failed: Text: ${e}.
Error message: ${jn(t)}`,
      cause: t
    }), this[hh] = !0, this.text = e;
  }
  static isInstance(e) {
    return ie.hasMarker(e, ph);
  }
};
hh = B0;
var mh = "AI_LoadAPIKeyError", gh = `vercel.ai.error.${mh}`, H0 = Symbol.for(gh), yh, Uo = class extends ie {
  // used in isInstance
  constructor({ message: e }) {
    super({ name: mh, message: e }), this[yh] = !0;
  }
  static isInstance(e) {
    return ie.hasMarker(e, gh);
  }
};
yh = H0;
var vh = "AI_TooManyEmbeddingValuesForCallError", _h = `vercel.ai.error.${vh}`, W0 = Symbol.for(_h), bh, J0 = class extends ie {
  constructor(e) {
    super({
      name: vh,
      message: `Too many values for a single embedding call. The ${e.provider} model "${e.modelId}" can only embed up to ${e.maxEmbeddingsPerCall} values per call, but ${e.values.length} values were provided.`
    }), this[bh] = !0, this.provider = e.provider, this.modelId = e.modelId, this.maxEmbeddingsPerCall = e.maxEmbeddingsPerCall, this.values = e.values;
  }
  static isInstance(e) {
    return ie.hasMarker(e, _h);
  }
};
bh = W0;
var wh = "AI_TypeValidationError", Eh = `vercel.ai.error.${wh}`, K0 = Symbol.for(Eh), $h, Y0 = class pi extends ie {
  constructor({ value: t, cause: r }) {
    super({
      name: wh,
      message: `Type validation failed: Value: ${JSON.stringify(t)}.
Error message: ${jn(r)}`,
      cause: r
    }), this[$h] = !0, this.value = t;
  }
  static isInstance(t) {
    return ie.hasMarker(t, Eh);
  }
  /**
   * Wraps an error into a TypeValidationError.
   * If the cause is already a TypeValidationError with the same value, it returns the cause.
   * Otherwise, it creates a new TypeValidationError.
   *
   * @param {Object} params - The parameters for wrapping the error.
   * @param {unknown} params.value - The value that failed validation.
   * @param {unknown} params.cause - The original error or cause of the validation failure.
   * @returns {TypeValidationError} A TypeValidationError instance.
   */
  static wrap({
    value: t,
    cause: r
  }) {
    return pi.isInstance(r) && r.value === t ? r : new pi({ value: t, cause: r });
  }
};
$h = K0;
var Tn = Y0, Sh = "AI_UnsupportedFunctionalityError", Ih = `vercel.ai.error.${Sh}`, X0 = Symbol.for(Ih), Th, Nt = class extends ie {
  constructor({
    functionality: e,
    message: t = `'${e}' functionality not supported.`
  }) {
    super({ name: Sh, message: t }), this[Th] = !0, this.functionality = e;
  }
  static isInstance(e) {
    return ie.hasMarker(e, Ih);
  }
};
Th = X0;
class Xl extends Error {
  constructor(t, r) {
    super(t), this.name = "ParseError", this.type = r.type, this.field = r.field, this.value = r.value, this.line = r.line;
  }
}
function Zs(e) {
}
function Q0(e) {
  if (typeof e == "function")
    throw new TypeError(
      "`callbacks` must be an object, got a function instead. Did you mean `{onEvent: fn}`?"
    );
  const { onEvent: t = Zs, onError: r = Zs, onRetry: n = Zs, onComment: o } = e;
  let a = "", s = !0, i, u = "", c = "";
  function l(_) {
    const m = s ? _.replace(/^\xEF\xBB\xBF/, "") : _, [h, p] = eb(`${a}${m}`);
    for (const v of h)
      y(v);
    a = p, s = !1;
  }
  function y(_) {
    if (_ === "") {
      f();
      return;
    }
    if (_.startsWith(":")) {
      o && o(_.slice(_.startsWith(": ") ? 2 : 1));
      return;
    }
    const m = _.indexOf(":");
    if (m !== -1) {
      const h = _.slice(0, m), p = _[m + 1] === " " ? 2 : 1, v = _.slice(m + p);
      d(h, v, _);
      return;
    }
    d(_, "", _);
  }
  function d(_, m, h) {
    switch (_) {
      case "event":
        c = m;
        break;
      case "data":
        u = `${u}${m}
`;
        break;
      case "id":
        i = m.includes("\0") ? void 0 : m;
        break;
      case "retry":
        /^\d+$/.test(m) ? n(parseInt(m, 10)) : r(
          new Xl(`Invalid \`retry\` value: "${m}"`, {
            type: "invalid-retry",
            value: m,
            line: h
          })
        );
        break;
      default:
        r(
          new Xl(
            `Unknown field "${_.length > 20 ? `${_.slice(0, 20)}…` : _}"`,
            { type: "unknown-field", field: _, value: m, line: h }
          )
        );
        break;
    }
  }
  function f() {
    u.length > 0 && t({
      id: i,
      event: c || void 0,
      // If the data buffer's last character is a U+000A LINE FEED (LF) character,
      // then remove the last character from the data buffer.
      data: u.endsWith(`
`) ? u.slice(0, -1) : u
    }), i = void 0, u = "", c = "";
  }
  function g(_ = {}) {
    a && _.consume && y(a), s = !0, i = void 0, u = "", c = "", a = "";
  }
  return { feed: l, reset: g };
}
function eb(e) {
  const t = [];
  let r = "", n = 0;
  for (; n < e.length; ) {
    const o = e.indexOf("\r", n), a = e.indexOf(`
`, n);
    let s = -1;
    if (o !== -1 && a !== -1 ? s = Math.min(o, a) : o !== -1 ? o === e.length - 1 ? s = -1 : s = o : a !== -1 && (s = a), s === -1) {
      r = e.slice(n);
      break;
    } else {
      const i = e.slice(n, s);
      t.push(i), n = s + 1, e[n - 1] === "\r" && e[n] === `
` && n++;
    }
  }
  return [t, r];
}
class tb extends TransformStream {
  constructor({ onError: t, onRetry: r, onComment: n } = {}) {
    let o;
    super({
      start(a) {
        o = Q0({
          onEvent: (s) => {
            a.enqueue(s);
          },
          onError(s) {
            t === "terminate" ? a.error(s) : typeof t == "function" && t(s);
          },
          onRetry: r,
          onComment: n
        });
      },
      transform(a) {
        o.feed(a);
      }
    });
  }
}
function z(e, t, r) {
  function n(i, u) {
    var c;
    Object.defineProperty(i, "_zod", {
      value: i._zod ?? {},
      enumerable: !1
    }), (c = i._zod).traits ?? (c.traits = /* @__PURE__ */ new Set()), i._zod.traits.add(e), t(i, u);
    for (const l in s.prototype)
      l in i || Object.defineProperty(i, l, { value: s.prototype[l].bind(i) });
    i._zod.constr = s, i._zod.def = u;
  }
  const o = (r == null ? void 0 : r.Parent) ?? Object;
  class a extends o {
  }
  Object.defineProperty(a, "name", { value: e });
  function s(i) {
    var u;
    const c = r != null && r.Parent ? new a() : this;
    n(c, i), (u = c._zod).deferred ?? (u.deferred = []);
    for (const l of c._zod.deferred)
      l();
    return c;
  }
  return Object.defineProperty(s, "init", { value: n }), Object.defineProperty(s, Symbol.hasInstance, {
    value: (i) => {
      var u, c;
      return r != null && r.Parent && i instanceof r.Parent ? !0 : (c = (u = i == null ? void 0 : i._zod) == null ? void 0 : u.traits) == null ? void 0 : c.has(e);
    }
  }), Object.defineProperty(s, "name", { value: e }), s;
}
class Pr extends Error {
  constructor() {
    super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");
  }
}
class Oh extends Error {
  constructor(t) {
    super(`Encountered unidirectional transform during encode: ${t}`), this.name = "ZodEncodeError";
  }
}
const Rh = {};
function Zt(e) {
  return Rh;
}
function Ph(e) {
  const t = Object.values(e).filter((n) => typeof n == "number");
  return Object.entries(e).filter(([n, o]) => t.indexOf(+n) === -1).map(([n, o]) => o);
}
function hi(e, t) {
  return typeof t == "bigint" ? t.toString() : t;
}
function ya(e) {
  return {
    get value() {
      {
        const t = e();
        return Object.defineProperty(this, "value", { value: t }), t;
      }
    }
  };
}
function xi(e) {
  return e == null;
}
function Di(e) {
  const t = e.startsWith("^") ? 1 : 0, r = e.endsWith("$") ? e.length - 1 : e.length;
  return e.slice(t, r);
}
function rb(e, t) {
  const r = (e.toString().split(".")[1] || "").length, n = t.toString();
  let o = (n.split(".")[1] || "").length;
  if (o === 0 && /\d?e-\d?/.test(n)) {
    const u = n.match(/\d?e-(\d?)/);
    u != null && u[1] && (o = Number.parseInt(u[1]));
  }
  const a = r > o ? r : o, s = Number.parseInt(e.toFixed(a).replace(".", "")), i = Number.parseInt(t.toFixed(a).replace(".", ""));
  return s % i / 10 ** a;
}
const Ql = Symbol("evaluating");
function he(e, t, r) {
  let n;
  Object.defineProperty(e, t, {
    get() {
      if (n !== Ql)
        return n === void 0 && (n = Ql, n = r()), n;
    },
    set(o) {
      Object.defineProperty(e, t, {
        value: o
        // configurable: true,
      });
    },
    configurable: !0
  });
}
function dr(e, t, r) {
  Object.defineProperty(e, t, {
    value: r,
    writable: !0,
    enumerable: !0,
    configurable: !0
  });
}
function fr(...e) {
  const t = {};
  for (const r of e) {
    const n = Object.getOwnPropertyDescriptors(r);
    Object.assign(t, n);
  }
  return Object.defineProperties({}, t);
}
function ed(e) {
  return JSON.stringify(e);
}
const kh = "captureStackTrace" in Error ? Error.captureStackTrace : (...e) => {
};
function On(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
const nb = ya(() => {
  var e;
  if (typeof navigator < "u" && ((e = navigator == null ? void 0 : navigator.userAgent) != null && e.includes("Cloudflare")))
    return !1;
  try {
    const t = Function;
    return new t(""), !0;
  } catch {
    return !1;
  }
});
function kr(e) {
  if (On(e) === !1)
    return !1;
  const t = e.constructor;
  if (t === void 0)
    return !0;
  const r = t.prototype;
  return !(On(r) === !1 || Object.prototype.hasOwnProperty.call(r, "isPrototypeOf") === !1);
}
function Nh(e) {
  return kr(e) ? { ...e } : Array.isArray(e) ? [...e] : e;
}
const ob = /* @__PURE__ */ new Set(["string", "number", "symbol"]);
function Nr(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Wt(e, t, r) {
  const n = new e._zod.constr(t ?? e._zod.def);
  return (!t || r != null && r.parent) && (n._zod.parent = e), n;
}
function re(e) {
  const t = e;
  if (!t)
    return {};
  if (typeof t == "string")
    return { error: () => t };
  if ((t == null ? void 0 : t.message) !== void 0) {
    if ((t == null ? void 0 : t.error) !== void 0)
      throw new Error("Cannot specify both `message` and `error` params");
    t.error = t.message;
  }
  return delete t.message, typeof t.error == "string" ? { ...t, error: () => t.error } : t;
}
function ab(e) {
  return Object.keys(e).filter((t) => e[t]._zod.optin === "optional" && e[t]._zod.optout === "optional");
}
const sb = {
  safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
  int32: [-2147483648, 2147483647],
  uint32: [0, 4294967295],
  float32: [-34028234663852886e22, 34028234663852886e22],
  float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
};
function ib(e, t) {
  const r = e._zod.def, n = fr(e._zod.def, {
    get shape() {
      const o = {};
      for (const a in t) {
        if (!(a in r.shape))
          throw new Error(`Unrecognized key: "${a}"`);
        t[a] && (o[a] = r.shape[a]);
      }
      return dr(this, "shape", o), o;
    },
    checks: []
  });
  return Wt(e, n);
}
function ub(e, t) {
  const r = e._zod.def, n = fr(e._zod.def, {
    get shape() {
      const o = { ...e._zod.def.shape };
      for (const a in t) {
        if (!(a in r.shape))
          throw new Error(`Unrecognized key: "${a}"`);
        t[a] && delete o[a];
      }
      return dr(this, "shape", o), o;
    },
    checks: []
  });
  return Wt(e, n);
}
function cb(e, t) {
  if (!kr(t))
    throw new Error("Invalid input to extend: expected a plain object");
  const r = e._zod.def.checks;
  if (r && r.length > 0)
    throw new Error("Object schemas containing refinements cannot be extended. Use `.safeExtend()` instead.");
  const o = fr(e._zod.def, {
    get shape() {
      const a = { ...e._zod.def.shape, ...t };
      return dr(this, "shape", a), a;
    },
    checks: []
  });
  return Wt(e, o);
}
function lb(e, t) {
  if (!kr(t))
    throw new Error("Invalid input to safeExtend: expected a plain object");
  const r = {
    ...e._zod.def,
    get shape() {
      const n = { ...e._zod.def.shape, ...t };
      return dr(this, "shape", n), n;
    },
    checks: e._zod.def.checks
  };
  return Wt(e, r);
}
function db(e, t) {
  const r = fr(e._zod.def, {
    get shape() {
      const n = { ...e._zod.def.shape, ...t._zod.def.shape };
      return dr(this, "shape", n), n;
    },
    get catchall() {
      return t._zod.def.catchall;
    },
    checks: []
    // delete existing checks
  });
  return Wt(e, r);
}
function fb(e, t, r) {
  const n = fr(t._zod.def, {
    get shape() {
      const o = t._zod.def.shape, a = { ...o };
      if (r)
        for (const s in r) {
          if (!(s in o))
            throw new Error(`Unrecognized key: "${s}"`);
          r[s] && (a[s] = e ? new e({
            type: "optional",
            innerType: o[s]
          }) : o[s]);
        }
      else
        for (const s in o)
          a[s] = e ? new e({
            type: "optional",
            innerType: o[s]
          }) : o[s];
      return dr(this, "shape", a), a;
    },
    checks: []
  });
  return Wt(t, n);
}
function pb(e, t, r) {
  const n = fr(t._zod.def, {
    get shape() {
      const o = t._zod.def.shape, a = { ...o };
      if (r)
        for (const s in r) {
          if (!(s in a))
            throw new Error(`Unrecognized key: "${s}"`);
          r[s] && (a[s] = new e({
            type: "nonoptional",
            innerType: o[s]
          }));
        }
      else
        for (const s in o)
          a[s] = new e({
            type: "nonoptional",
            innerType: o[s]
          });
      return dr(this, "shape", a), a;
    },
    checks: []
  });
  return Wt(t, n);
}
function Ir(e, t = 0) {
  var r;
  if (e.aborted === !0)
    return !0;
  for (let n = t; n < e.issues.length; n++)
    if (((r = e.issues[n]) == null ? void 0 : r.continue) !== !0)
      return !0;
  return !1;
}
function Tr(e, t) {
  return t.map((r) => {
    var n;
    return (n = r).path ?? (n.path = []), r.path.unshift(e), r;
  });
}
function Fo(e) {
  return typeof e == "string" ? e : e == null ? void 0 : e.message;
}
function Gt(e, t, r) {
  var o, a, s, i, u, c;
  const n = { ...e, path: e.path ?? [] };
  if (!e.message) {
    const l = Fo((s = (a = (o = e.inst) == null ? void 0 : o._zod.def) == null ? void 0 : a.error) == null ? void 0 : s.call(a, e)) ?? Fo((i = t == null ? void 0 : t.error) == null ? void 0 : i.call(t, e)) ?? Fo((u = r.customError) == null ? void 0 : u.call(r, e)) ?? Fo((c = r.localeError) == null ? void 0 : c.call(r, e)) ?? "Invalid input";
    n.message = l;
  }
  return delete n.inst, delete n.continue, t != null && t.reportInput || delete n.input, n;
}
function qi(e) {
  return Array.isArray(e) ? "array" : typeof e == "string" ? "string" : "unknown";
}
function Rn(...e) {
  const [t, r, n] = e;
  return typeof t == "string" ? {
    message: t,
    code: "custom",
    input: r,
    inst: n
  } : { ...t };
}
const Ah = (e, t) => {
  e.name = "$ZodError", Object.defineProperty(e, "_zod", {
    value: e._zod,
    enumerable: !1
  }), Object.defineProperty(e, "issues", {
    value: t,
    enumerable: !1
  }), e.message = JSON.stringify(t, hi, 2), Object.defineProperty(e, "toString", {
    value: () => e.message,
    enumerable: !1
  });
}, Ch = z("$ZodError", Ah), jh = z("$ZodError", Ah, { Parent: Error });
function hb(e, t = (r) => r.message) {
  const r = {}, n = [];
  for (const o of e.issues)
    o.path.length > 0 ? (r[o.path[0]] = r[o.path[0]] || [], r[o.path[0]].push(t(o))) : n.push(t(o));
  return { formErrors: n, fieldErrors: r };
}
function mb(e, t = (r) => r.message) {
  const r = { _errors: [] }, n = (o) => {
    for (const a of o.issues)
      if (a.code === "invalid_union" && a.errors.length)
        a.errors.map((s) => n({ issues: s }));
      else if (a.code === "invalid_key")
        n({ issues: a.issues });
      else if (a.code === "invalid_element")
        n({ issues: a.issues });
      else if (a.path.length === 0)
        r._errors.push(t(a));
      else {
        let s = r, i = 0;
        for (; i < a.path.length; ) {
          const u = a.path[i];
          i === a.path.length - 1 ? (s[u] = s[u] || { _errors: [] }, s[u]._errors.push(t(a))) : s[u] = s[u] || { _errors: [] }, s = s[u], i++;
        }
      }
  };
  return n(e), r;
}
const Li = (e) => (t, r, n, o) => {
  const a = n ? Object.assign(n, { async: !1 }) : { async: !1 }, s = t._zod.run({ value: r, issues: [] }, a);
  if (s instanceof Promise)
    throw new Pr();
  if (s.issues.length) {
    const i = new ((o == null ? void 0 : o.Err) ?? e)(s.issues.map((u) => Gt(u, a, Zt())));
    throw kh(i, o == null ? void 0 : o.callee), i;
  }
  return s.value;
}, zi = (e) => async (t, r, n, o) => {
  const a = n ? Object.assign(n, { async: !0 }) : { async: !0 };
  let s = t._zod.run({ value: r, issues: [] }, a);
  if (s instanceof Promise && (s = await s), s.issues.length) {
    const i = new ((o == null ? void 0 : o.Err) ?? e)(s.issues.map((u) => Gt(u, a, Zt())));
    throw kh(i, o == null ? void 0 : o.callee), i;
  }
  return s.value;
}, va = (e) => (t, r, n) => {
  const o = n ? { ...n, async: !1 } : { async: !1 }, a = t._zod.run({ value: r, issues: [] }, o);
  if (a instanceof Promise)
    throw new Pr();
  return a.issues.length ? {
    success: !1,
    error: new (e ?? Ch)(a.issues.map((s) => Gt(s, o, Zt())))
  } : { success: !0, data: a.value };
}, gb = /* @__PURE__ */ va(jh), _a = (e) => async (t, r, n) => {
  const o = n ? Object.assign(n, { async: !0 }) : { async: !0 };
  let a = t._zod.run({ value: r, issues: [] }, o);
  return a instanceof Promise && (a = await a), a.issues.length ? {
    success: !1,
    error: new e(a.issues.map((s) => Gt(s, o, Zt())))
  } : { success: !0, data: a.value };
}, yb = /* @__PURE__ */ _a(jh), vb = (e) => (t, r, n) => {
  const o = n ? Object.assign(n, { direction: "backward" }) : { direction: "backward" };
  return Li(e)(t, r, o);
}, _b = (e) => (t, r, n) => Li(e)(t, r, n), bb = (e) => async (t, r, n) => {
  const o = n ? Object.assign(n, { direction: "backward" }) : { direction: "backward" };
  return zi(e)(t, r, o);
}, wb = (e) => async (t, r, n) => zi(e)(t, r, n), Eb = (e) => (t, r, n) => {
  const o = n ? Object.assign(n, { direction: "backward" }) : { direction: "backward" };
  return va(e)(t, r, o);
}, $b = (e) => (t, r, n) => va(e)(t, r, n), Sb = (e) => async (t, r, n) => {
  const o = n ? Object.assign(n, { direction: "backward" }) : { direction: "backward" };
  return _a(e)(t, r, o);
}, Ib = (e) => async (t, r, n) => _a(e)(t, r, n), Tb = /^[cC][^\s-]{8,}$/, Ob = /^[0-9a-z]+$/, Rb = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/, Pb = /^[0-9a-vA-V]{20}$/, kb = /^[A-Za-z0-9]{27}$/, Nb = /^[a-zA-Z0-9_-]{21}$/, Ab = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/, Cb = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/, td = (e) => e ? new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`) : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/, jb = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/, Mb = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
function xb() {
  return new RegExp(Mb, "u");
}
const Db = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, qb = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/, Lb = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/, zb = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, Vb = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/, Mh = /^[A-Za-z0-9_-]*$/, Ub = /^(?=.{1,253}\.?$)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[-0-9a-zA-Z]{0,61}[0-9a-zA-Z])?)*\.?$/, Fb = /^\+(?:[0-9]){6,14}[0-9]$/, xh = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))", Zb = /* @__PURE__ */ new RegExp(`^${xh}$`);
function Dh(e) {
  const t = "(?:[01]\\d|2[0-3]):[0-5]\\d";
  return typeof e.precision == "number" ? e.precision === -1 ? `${t}` : e.precision === 0 ? `${t}:[0-5]\\d` : `${t}:[0-5]\\d\\.\\d{${e.precision}}` : `${t}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function Gb(e) {
  return new RegExp(`^${Dh(e)}$`);
}
function Bb(e) {
  const t = Dh({ precision: e.precision }), r = ["Z"];
  e.local && r.push(""), e.offset && r.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
  const n = `${t}(?:${r.join("|")})`;
  return new RegExp(`^${xh}T(?:${n})$`);
}
const Hb = (e) => {
  const t = e ? `[\\s\\S]{${(e == null ? void 0 : e.minimum) ?? 0},${(e == null ? void 0 : e.maximum) ?? ""}}` : "[\\s\\S]*";
  return new RegExp(`^${t}$`);
}, Wb = /^-?\d+$/, Jb = /^-?\d+(?:\.\d+)?/, Kb = /^(?:true|false)$/i, Yb = /^null$/i, Xb = /^[^A-Z]*$/, Qb = /^[^a-z]*$/, Ke = /* @__PURE__ */ z("$ZodCheck", (e, t) => {
  var r;
  e._zod ?? (e._zod = {}), e._zod.def = t, (r = e._zod).onattach ?? (r.onattach = []);
}), qh = {
  number: "number",
  bigint: "bigint",
  object: "date"
}, Lh = /* @__PURE__ */ z("$ZodCheckLessThan", (e, t) => {
  Ke.init(e, t);
  const r = qh[typeof t.value];
  e._zod.onattach.push((n) => {
    const o = n._zod.bag, a = (t.inclusive ? o.maximum : o.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
    t.value < a && (t.inclusive ? o.maximum = t.value : o.exclusiveMaximum = t.value);
  }), e._zod.check = (n) => {
    (t.inclusive ? n.value <= t.value : n.value < t.value) || n.issues.push({
      origin: r,
      code: "too_big",
      maximum: t.value,
      input: n.value,
      inclusive: t.inclusive,
      inst: e,
      continue: !t.abort
    });
  };
}), zh = /* @__PURE__ */ z("$ZodCheckGreaterThan", (e, t) => {
  Ke.init(e, t);
  const r = qh[typeof t.value];
  e._zod.onattach.push((n) => {
    const o = n._zod.bag, a = (t.inclusive ? o.minimum : o.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
    t.value > a && (t.inclusive ? o.minimum = t.value : o.exclusiveMinimum = t.value);
  }), e._zod.check = (n) => {
    (t.inclusive ? n.value >= t.value : n.value > t.value) || n.issues.push({
      origin: r,
      code: "too_small",
      minimum: t.value,
      input: n.value,
      inclusive: t.inclusive,
      inst: e,
      continue: !t.abort
    });
  };
}), ew = /* @__PURE__ */ z("$ZodCheckMultipleOf", (e, t) => {
  Ke.init(e, t), e._zod.onattach.push((r) => {
    var n;
    (n = r._zod.bag).multipleOf ?? (n.multipleOf = t.value);
  }), e._zod.check = (r) => {
    if (typeof r.value != typeof t.value)
      throw new Error("Cannot mix number and bigint in multiple_of check.");
    (typeof r.value == "bigint" ? r.value % t.value === BigInt(0) : rb(r.value, t.value) === 0) || r.issues.push({
      origin: typeof r.value,
      code: "not_multiple_of",
      divisor: t.value,
      input: r.value,
      inst: e,
      continue: !t.abort
    });
  };
}), tw = /* @__PURE__ */ z("$ZodCheckNumberFormat", (e, t) => {
  var s;
  Ke.init(e, t), t.format = t.format || "float64";
  const r = (s = t.format) == null ? void 0 : s.includes("int"), n = r ? "int" : "number", [o, a] = sb[t.format];
  e._zod.onattach.push((i) => {
    const u = i._zod.bag;
    u.format = t.format, u.minimum = o, u.maximum = a, r && (u.pattern = Wb);
  }), e._zod.check = (i) => {
    const u = i.value;
    if (r) {
      if (!Number.isInteger(u)) {
        i.issues.push({
          expected: n,
          format: t.format,
          code: "invalid_type",
          continue: !1,
          input: u,
          inst: e
        });
        return;
      }
      if (!Number.isSafeInteger(u)) {
        u > 0 ? i.issues.push({
          input: u,
          code: "too_big",
          maximum: Number.MAX_SAFE_INTEGER,
          note: "Integers must be within the safe integer range.",
          inst: e,
          origin: n,
          continue: !t.abort
        }) : i.issues.push({
          input: u,
          code: "too_small",
          minimum: Number.MIN_SAFE_INTEGER,
          note: "Integers must be within the safe integer range.",
          inst: e,
          origin: n,
          continue: !t.abort
        });
        return;
      }
    }
    u < o && i.issues.push({
      origin: "number",
      input: u,
      code: "too_small",
      minimum: o,
      inclusive: !0,
      inst: e,
      continue: !t.abort
    }), u > a && i.issues.push({
      origin: "number",
      input: u,
      code: "too_big",
      maximum: a,
      inst: e
    });
  };
}), rw = /* @__PURE__ */ z("$ZodCheckMaxLength", (e, t) => {
  var r;
  Ke.init(e, t), (r = e._zod.def).when ?? (r.when = (n) => {
    const o = n.value;
    return !xi(o) && o.length !== void 0;
  }), e._zod.onattach.push((n) => {
    const o = n._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
    t.maximum < o && (n._zod.bag.maximum = t.maximum);
  }), e._zod.check = (n) => {
    const o = n.value;
    if (o.length <= t.maximum)
      return;
    const s = qi(o);
    n.issues.push({
      origin: s,
      code: "too_big",
      maximum: t.maximum,
      inclusive: !0,
      input: o,
      inst: e,
      continue: !t.abort
    });
  };
}), nw = /* @__PURE__ */ z("$ZodCheckMinLength", (e, t) => {
  var r;
  Ke.init(e, t), (r = e._zod.def).when ?? (r.when = (n) => {
    const o = n.value;
    return !xi(o) && o.length !== void 0;
  }), e._zod.onattach.push((n) => {
    const o = n._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
    t.minimum > o && (n._zod.bag.minimum = t.minimum);
  }), e._zod.check = (n) => {
    const o = n.value;
    if (o.length >= t.minimum)
      return;
    const s = qi(o);
    n.issues.push({
      origin: s,
      code: "too_small",
      minimum: t.minimum,
      inclusive: !0,
      input: o,
      inst: e,
      continue: !t.abort
    });
  };
}), ow = /* @__PURE__ */ z("$ZodCheckLengthEquals", (e, t) => {
  var r;
  Ke.init(e, t), (r = e._zod.def).when ?? (r.when = (n) => {
    const o = n.value;
    return !xi(o) && o.length !== void 0;
  }), e._zod.onattach.push((n) => {
    const o = n._zod.bag;
    o.minimum = t.length, o.maximum = t.length, o.length = t.length;
  }), e._zod.check = (n) => {
    const o = n.value, a = o.length;
    if (a === t.length)
      return;
    const s = qi(o), i = a > t.length;
    n.issues.push({
      origin: s,
      ...i ? { code: "too_big", maximum: t.length } : { code: "too_small", minimum: t.length },
      inclusive: !0,
      exact: !0,
      input: n.value,
      inst: e,
      continue: !t.abort
    });
  };
}), ba = /* @__PURE__ */ z("$ZodCheckStringFormat", (e, t) => {
  var r, n;
  Ke.init(e, t), e._zod.onattach.push((o) => {
    const a = o._zod.bag;
    a.format = t.format, t.pattern && (a.patterns ?? (a.patterns = /* @__PURE__ */ new Set()), a.patterns.add(t.pattern));
  }), t.pattern ? (r = e._zod).check ?? (r.check = (o) => {
    t.pattern.lastIndex = 0, !t.pattern.test(o.value) && o.issues.push({
      origin: "string",
      code: "invalid_format",
      format: t.format,
      input: o.value,
      ...t.pattern ? { pattern: t.pattern.toString() } : {},
      inst: e,
      continue: !t.abort
    });
  }) : (n = e._zod).check ?? (n.check = () => {
  });
}), aw = /* @__PURE__ */ z("$ZodCheckRegex", (e, t) => {
  ba.init(e, t), e._zod.check = (r) => {
    t.pattern.lastIndex = 0, !t.pattern.test(r.value) && r.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "regex",
      input: r.value,
      pattern: t.pattern.toString(),
      inst: e,
      continue: !t.abort
    });
  };
}), sw = /* @__PURE__ */ z("$ZodCheckLowerCase", (e, t) => {
  t.pattern ?? (t.pattern = Xb), ba.init(e, t);
}), iw = /* @__PURE__ */ z("$ZodCheckUpperCase", (e, t) => {
  t.pattern ?? (t.pattern = Qb), ba.init(e, t);
}), uw = /* @__PURE__ */ z("$ZodCheckIncludes", (e, t) => {
  Ke.init(e, t);
  const r = Nr(t.includes), n = new RegExp(typeof t.position == "number" ? `^.{${t.position}}${r}` : r);
  t.pattern = n, e._zod.onattach.push((o) => {
    const a = o._zod.bag;
    a.patterns ?? (a.patterns = /* @__PURE__ */ new Set()), a.patterns.add(n);
  }), e._zod.check = (o) => {
    o.value.includes(t.includes, t.position) || o.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "includes",
      includes: t.includes,
      input: o.value,
      inst: e,
      continue: !t.abort
    });
  };
}), cw = /* @__PURE__ */ z("$ZodCheckStartsWith", (e, t) => {
  Ke.init(e, t);
  const r = new RegExp(`^${Nr(t.prefix)}.*`);
  t.pattern ?? (t.pattern = r), e._zod.onattach.push((n) => {
    const o = n._zod.bag;
    o.patterns ?? (o.patterns = /* @__PURE__ */ new Set()), o.patterns.add(r);
  }), e._zod.check = (n) => {
    n.value.startsWith(t.prefix) || n.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "starts_with",
      prefix: t.prefix,
      input: n.value,
      inst: e,
      continue: !t.abort
    });
  };
}), lw = /* @__PURE__ */ z("$ZodCheckEndsWith", (e, t) => {
  Ke.init(e, t);
  const r = new RegExp(`.*${Nr(t.suffix)}$`);
  t.pattern ?? (t.pattern = r), e._zod.onattach.push((n) => {
    const o = n._zod.bag;
    o.patterns ?? (o.patterns = /* @__PURE__ */ new Set()), o.patterns.add(r);
  }), e._zod.check = (n) => {
    n.value.endsWith(t.suffix) || n.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "ends_with",
      suffix: t.suffix,
      input: n.value,
      inst: e,
      continue: !t.abort
    });
  };
}), dw = /* @__PURE__ */ z("$ZodCheckOverwrite", (e, t) => {
  Ke.init(e, t), e._zod.check = (r) => {
    r.value = t.tx(r.value);
  };
});
class fw {
  constructor(t = []) {
    this.content = [], this.indent = 0, this && (this.args = t);
  }
  indented(t) {
    this.indent += 1, t(this), this.indent -= 1;
  }
  write(t) {
    if (typeof t == "function") {
      t(this, { execution: "sync" }), t(this, { execution: "async" });
      return;
    }
    const n = t.split(`
`).filter((s) => s), o = Math.min(...n.map((s) => s.length - s.trimStart().length)), a = n.map((s) => s.slice(o)).map((s) => " ".repeat(this.indent * 2) + s);
    for (const s of a)
      this.content.push(s);
  }
  compile() {
    const t = Function, r = this == null ? void 0 : this.args, o = [...((this == null ? void 0 : this.content) ?? [""]).map((a) => `  ${a}`)];
    return new t(...r, o.join(`
`));
  }
}
const pw = {
  major: 4,
  minor: 1,
  patch: 12
}, ve = /* @__PURE__ */ z("$ZodType", (e, t) => {
  var o;
  var r;
  e ?? (e = {}), e._zod.def = t, e._zod.bag = e._zod.bag || {}, e._zod.version = pw;
  const n = [...e._zod.def.checks ?? []];
  e._zod.traits.has("$ZodCheck") && n.unshift(e);
  for (const a of n)
    for (const s of a._zod.onattach)
      s(e);
  if (n.length === 0)
    (r = e._zod).deferred ?? (r.deferred = []), (o = e._zod.deferred) == null || o.push(() => {
      e._zod.run = e._zod.parse;
    });
  else {
    const a = (i, u, c) => {
      let l = Ir(i), y;
      for (const d of u) {
        if (d._zod.def.when) {
          if (!d._zod.def.when(i))
            continue;
        } else if (l)
          continue;
        const f = i.issues.length, g = d._zod.check(i);
        if (g instanceof Promise && (c == null ? void 0 : c.async) === !1)
          throw new Pr();
        if (y || g instanceof Promise)
          y = (y ?? Promise.resolve()).then(async () => {
            await g, i.issues.length !== f && (l || (l = Ir(i, f)));
          });
        else {
          if (i.issues.length === f)
            continue;
          l || (l = Ir(i, f));
        }
      }
      return y ? y.then(() => i) : i;
    }, s = (i, u, c) => {
      if (Ir(i))
        return i.aborted = !0, i;
      const l = a(u, n, c);
      if (l instanceof Promise) {
        if (c.async === !1)
          throw new Pr();
        return l.then((y) => e._zod.parse(y, c));
      }
      return e._zod.parse(l, c);
    };
    e._zod.run = (i, u) => {
      if (u.skipChecks)
        return e._zod.parse(i, u);
      if (u.direction === "backward") {
        const l = e._zod.parse({ value: i.value, issues: [] }, { ...u, skipChecks: !0 });
        return l instanceof Promise ? l.then((y) => s(y, i, u)) : s(l, i, u);
      }
      const c = e._zod.parse(i, u);
      if (c instanceof Promise) {
        if (u.async === !1)
          throw new Pr();
        return c.then((l) => a(l, n, u));
      }
      return a(c, n, u);
    };
  }
  e["~standard"] = {
    validate: (a) => {
      var s;
      try {
        const i = gb(e, a);
        return i.success ? { value: i.data } : { issues: (s = i.error) == null ? void 0 : s.issues };
      } catch {
        return yb(e, a).then((u) => {
          var c;
          return u.success ? { value: u.data } : { issues: (c = u.error) == null ? void 0 : c.issues };
        });
      }
    },
    vendor: "zod",
    version: 1
  };
}), Vi = /* @__PURE__ */ z("$ZodString", (e, t) => {
  var r;
  ve.init(e, t), e._zod.pattern = [...((r = e == null ? void 0 : e._zod.bag) == null ? void 0 : r.patterns) ?? []].pop() ?? Hb(e._zod.bag), e._zod.parse = (n, o) => {
    if (t.coerce)
      try {
        n.value = String(n.value);
      } catch {
      }
    return typeof n.value == "string" || n.issues.push({
      expected: "string",
      code: "invalid_type",
      input: n.value,
      inst: e
    }), n;
  };
}), $e = /* @__PURE__ */ z("$ZodStringFormat", (e, t) => {
  ba.init(e, t), Vi.init(e, t);
}), hw = /* @__PURE__ */ z("$ZodGUID", (e, t) => {
  t.pattern ?? (t.pattern = Cb), $e.init(e, t);
}), mw = /* @__PURE__ */ z("$ZodUUID", (e, t) => {
  if (t.version) {
    const n = {
      v1: 1,
      v2: 2,
      v3: 3,
      v4: 4,
      v5: 5,
      v6: 6,
      v7: 7,
      v8: 8
    }[t.version];
    if (n === void 0)
      throw new Error(`Invalid UUID version: "${t.version}"`);
    t.pattern ?? (t.pattern = td(n));
  } else
    t.pattern ?? (t.pattern = td());
  $e.init(e, t);
}), gw = /* @__PURE__ */ z("$ZodEmail", (e, t) => {
  t.pattern ?? (t.pattern = jb), $e.init(e, t);
}), yw = /* @__PURE__ */ z("$ZodURL", (e, t) => {
  $e.init(e, t), e._zod.check = (r) => {
    try {
      const n = r.value.trim(), o = new URL(n);
      t.hostname && (t.hostname.lastIndex = 0, t.hostname.test(o.hostname) || r.issues.push({
        code: "invalid_format",
        format: "url",
        note: "Invalid hostname",
        pattern: Ub.source,
        input: r.value,
        inst: e,
        continue: !t.abort
      })), t.protocol && (t.protocol.lastIndex = 0, t.protocol.test(o.protocol.endsWith(":") ? o.protocol.slice(0, -1) : o.protocol) || r.issues.push({
        code: "invalid_format",
        format: "url",
        note: "Invalid protocol",
        pattern: t.protocol.source,
        input: r.value,
        inst: e,
        continue: !t.abort
      })), t.normalize ? r.value = o.href : r.value = n;
      return;
    } catch {
      r.issues.push({
        code: "invalid_format",
        format: "url",
        input: r.value,
        inst: e,
        continue: !t.abort
      });
    }
  };
}), vw = /* @__PURE__ */ z("$ZodEmoji", (e, t) => {
  t.pattern ?? (t.pattern = xb()), $e.init(e, t);
}), _w = /* @__PURE__ */ z("$ZodNanoID", (e, t) => {
  t.pattern ?? (t.pattern = Nb), $e.init(e, t);
}), bw = /* @__PURE__ */ z("$ZodCUID", (e, t) => {
  t.pattern ?? (t.pattern = Tb), $e.init(e, t);
}), ww = /* @__PURE__ */ z("$ZodCUID2", (e, t) => {
  t.pattern ?? (t.pattern = Ob), $e.init(e, t);
}), Ew = /* @__PURE__ */ z("$ZodULID", (e, t) => {
  t.pattern ?? (t.pattern = Rb), $e.init(e, t);
}), $w = /* @__PURE__ */ z("$ZodXID", (e, t) => {
  t.pattern ?? (t.pattern = Pb), $e.init(e, t);
}), Sw = /* @__PURE__ */ z("$ZodKSUID", (e, t) => {
  t.pattern ?? (t.pattern = kb), $e.init(e, t);
}), Iw = /* @__PURE__ */ z("$ZodISODateTime", (e, t) => {
  t.pattern ?? (t.pattern = Bb(t)), $e.init(e, t);
}), Tw = /* @__PURE__ */ z("$ZodISODate", (e, t) => {
  t.pattern ?? (t.pattern = Zb), $e.init(e, t);
}), Ow = /* @__PURE__ */ z("$ZodISOTime", (e, t) => {
  t.pattern ?? (t.pattern = Gb(t)), $e.init(e, t);
}), Rw = /* @__PURE__ */ z("$ZodISODuration", (e, t) => {
  t.pattern ?? (t.pattern = Ab), $e.init(e, t);
}), Pw = /* @__PURE__ */ z("$ZodIPv4", (e, t) => {
  t.pattern ?? (t.pattern = Db), $e.init(e, t), e._zod.onattach.push((r) => {
    const n = r._zod.bag;
    n.format = "ipv4";
  });
}), kw = /* @__PURE__ */ z("$ZodIPv6", (e, t) => {
  t.pattern ?? (t.pattern = qb), $e.init(e, t), e._zod.onattach.push((r) => {
    const n = r._zod.bag;
    n.format = "ipv6";
  }), e._zod.check = (r) => {
    try {
      new URL(`http://[${r.value}]`);
    } catch {
      r.issues.push({
        code: "invalid_format",
        format: "ipv6",
        input: r.value,
        inst: e,
        continue: !t.abort
      });
    }
  };
}), Nw = /* @__PURE__ */ z("$ZodCIDRv4", (e, t) => {
  t.pattern ?? (t.pattern = Lb), $e.init(e, t);
}), Aw = /* @__PURE__ */ z("$ZodCIDRv6", (e, t) => {
  t.pattern ?? (t.pattern = zb), $e.init(e, t), e._zod.check = (r) => {
    const n = r.value.split("/");
    try {
      if (n.length !== 2)
        throw new Error();
      const [o, a] = n;
      if (!a)
        throw new Error();
      const s = Number(a);
      if (`${s}` !== a)
        throw new Error();
      if (s < 0 || s > 128)
        throw new Error();
      new URL(`http://[${o}]`);
    } catch {
      r.issues.push({
        code: "invalid_format",
        format: "cidrv6",
        input: r.value,
        inst: e,
        continue: !t.abort
      });
    }
  };
});
function Vh(e) {
  if (e === "")
    return !0;
  if (e.length % 4 !== 0)
    return !1;
  try {
    return atob(e), !0;
  } catch {
    return !1;
  }
}
const Cw = /* @__PURE__ */ z("$ZodBase64", (e, t) => {
  t.pattern ?? (t.pattern = Vb), $e.init(e, t), e._zod.onattach.push((r) => {
    r._zod.bag.contentEncoding = "base64";
  }), e._zod.check = (r) => {
    Vh(r.value) || r.issues.push({
      code: "invalid_format",
      format: "base64",
      input: r.value,
      inst: e,
      continue: !t.abort
    });
  };
});
function jw(e) {
  if (!Mh.test(e))
    return !1;
  const t = e.replace(/[-_]/g, (n) => n === "-" ? "+" : "/"), r = t.padEnd(Math.ceil(t.length / 4) * 4, "=");
  return Vh(r);
}
const Mw = /* @__PURE__ */ z("$ZodBase64URL", (e, t) => {
  t.pattern ?? (t.pattern = Mh), $e.init(e, t), e._zod.onattach.push((r) => {
    r._zod.bag.contentEncoding = "base64url";
  }), e._zod.check = (r) => {
    jw(r.value) || r.issues.push({
      code: "invalid_format",
      format: "base64url",
      input: r.value,
      inst: e,
      continue: !t.abort
    });
  };
}), xw = /* @__PURE__ */ z("$ZodE164", (e, t) => {
  t.pattern ?? (t.pattern = Fb), $e.init(e, t);
});
function Dw(e, t = null) {
  try {
    const r = e.split(".");
    if (r.length !== 3)
      return !1;
    const [n] = r;
    if (!n)
      return !1;
    const o = JSON.parse(atob(n));
    return !("typ" in o && (o == null ? void 0 : o.typ) !== "JWT" || !o.alg || t && (!("alg" in o) || o.alg !== t));
  } catch {
    return !1;
  }
}
const qw = /* @__PURE__ */ z("$ZodJWT", (e, t) => {
  $e.init(e, t), e._zod.check = (r) => {
    Dw(r.value, t.alg) || r.issues.push({
      code: "invalid_format",
      format: "jwt",
      input: r.value,
      inst: e,
      continue: !t.abort
    });
  };
}), Uh = /* @__PURE__ */ z("$ZodNumber", (e, t) => {
  ve.init(e, t), e._zod.pattern = e._zod.bag.pattern ?? Jb, e._zod.parse = (r, n) => {
    if (t.coerce)
      try {
        r.value = Number(r.value);
      } catch {
      }
    const o = r.value;
    if (typeof o == "number" && !Number.isNaN(o) && Number.isFinite(o))
      return r;
    const a = typeof o == "number" ? Number.isNaN(o) ? "NaN" : Number.isFinite(o) ? void 0 : "Infinity" : void 0;
    return r.issues.push({
      expected: "number",
      code: "invalid_type",
      input: o,
      inst: e,
      ...a ? { received: a } : {}
    }), r;
  };
}), Lw = /* @__PURE__ */ z("$ZodNumber", (e, t) => {
  tw.init(e, t), Uh.init(e, t);
}), zw = /* @__PURE__ */ z("$ZodBoolean", (e, t) => {
  ve.init(e, t), e._zod.pattern = Kb, e._zod.parse = (r, n) => {
    if (t.coerce)
      try {
        r.value = !!r.value;
      } catch {
      }
    const o = r.value;
    return typeof o == "boolean" || r.issues.push({
      expected: "boolean",
      code: "invalid_type",
      input: o,
      inst: e
    }), r;
  };
}), Vw = /* @__PURE__ */ z("$ZodNull", (e, t) => {
  ve.init(e, t), e._zod.pattern = Yb, e._zod.values = /* @__PURE__ */ new Set([null]), e._zod.parse = (r, n) => {
    const o = r.value;
    return o === null || r.issues.push({
      expected: "null",
      code: "invalid_type",
      input: o,
      inst: e
    }), r;
  };
}), Uw = /* @__PURE__ */ z("$ZodAny", (e, t) => {
  ve.init(e, t), e._zod.parse = (r) => r;
}), Fw = /* @__PURE__ */ z("$ZodUnknown", (e, t) => {
  ve.init(e, t), e._zod.parse = (r) => r;
}), Zw = /* @__PURE__ */ z("$ZodNever", (e, t) => {
  ve.init(e, t), e._zod.parse = (r, n) => (r.issues.push({
    expected: "never",
    code: "invalid_type",
    input: r.value,
    inst: e
  }), r);
});
function rd(e, t, r) {
  e.issues.length && t.issues.push(...Tr(r, e.issues)), t.value[r] = e.value;
}
const Gw = /* @__PURE__ */ z("$ZodArray", (e, t) => {
  ve.init(e, t), e._zod.parse = (r, n) => {
    const o = r.value;
    if (!Array.isArray(o))
      return r.issues.push({
        expected: "array",
        code: "invalid_type",
        input: o,
        inst: e
      }), r;
    r.value = Array(o.length);
    const a = [];
    for (let s = 0; s < o.length; s++) {
      const i = o[s], u = t.element._zod.run({
        value: i,
        issues: []
      }, n);
      u instanceof Promise ? a.push(u.then((c) => rd(c, r, s))) : rd(u, r, s);
    }
    return a.length ? Promise.all(a).then(() => r) : r;
  };
});
function ea(e, t, r, n) {
  e.issues.length && t.issues.push(...Tr(r, e.issues)), e.value === void 0 ? r in n && (t.value[r] = void 0) : t.value[r] = e.value;
}
function Fh(e) {
  var n, o, a, s;
  const t = Object.keys(e.shape);
  for (const i of t)
    if (!((s = (a = (o = (n = e.shape) == null ? void 0 : n[i]) == null ? void 0 : o._zod) == null ? void 0 : a.traits) != null && s.has("$ZodType")))
      throw new Error(`Invalid element at key "${i}": expected a Zod schema`);
  const r = ab(e.shape);
  return {
    ...e,
    keys: t,
    keySet: new Set(t),
    numKeys: t.length,
    optionalKeys: new Set(r)
  };
}
function Zh(e, t, r, n, o, a) {
  const s = [], i = o.keySet, u = o.catchall._zod, c = u.def.type;
  for (const l of Object.keys(t)) {
    if (i.has(l))
      continue;
    if (c === "never") {
      s.push(l);
      continue;
    }
    const y = u.run({ value: t[l], issues: [] }, n);
    y instanceof Promise ? e.push(y.then((d) => ea(d, r, l, t))) : ea(y, r, l, t);
  }
  return s.length && r.issues.push({
    code: "unrecognized_keys",
    keys: s,
    input: t,
    inst: a
  }), e.length ? Promise.all(e).then(() => r) : r;
}
const Bw = /* @__PURE__ */ z("$ZodObject", (e, t) => {
  ve.init(e, t);
  const r = Object.getOwnPropertyDescriptor(t, "shape");
  if (!(r != null && r.get)) {
    const i = t.shape;
    Object.defineProperty(t, "shape", {
      get: () => {
        const u = { ...i };
        return Object.defineProperty(t, "shape", {
          value: u
        }), u;
      }
    });
  }
  const n = ya(() => Fh(t));
  he(e._zod, "propValues", () => {
    const i = t.shape, u = {};
    for (const c in i) {
      const l = i[c]._zod;
      if (l.values) {
        u[c] ?? (u[c] = /* @__PURE__ */ new Set());
        for (const y of l.values)
          u[c].add(y);
      }
    }
    return u;
  });
  const o = On, a = t.catchall;
  let s;
  e._zod.parse = (i, u) => {
    s ?? (s = n.value);
    const c = i.value;
    if (!o(c))
      return i.issues.push({
        expected: "object",
        code: "invalid_type",
        input: c,
        inst: e
      }), i;
    i.value = {};
    const l = [], y = s.shape;
    for (const d of s.keys) {
      const g = y[d]._zod.run({ value: c[d], issues: [] }, u);
      g instanceof Promise ? l.push(g.then((_) => ea(_, i, d, c))) : ea(g, i, d, c);
    }
    return a ? Zh(l, c, i, u, n.value, e) : l.length ? Promise.all(l).then(() => i) : i;
  };
}), Hw = /* @__PURE__ */ z("$ZodObjectJIT", (e, t) => {
  Bw.init(e, t);
  const r = e._zod.parse, n = ya(() => Fh(t)), o = (d) => {
    const f = new fw(["shape", "payload", "ctx"]), g = n.value, _ = (v) => {
      const $ = ed(v);
      return `shape[${$}]._zod.run({ value: input[${$}], issues: [] }, ctx)`;
    };
    f.write("const input = payload.value;");
    const m = /* @__PURE__ */ Object.create(null);
    let h = 0;
    for (const v of g.keys)
      m[v] = `key_${h++}`;
    f.write("const newResult = {};");
    for (const v of g.keys) {
      const $ = m[v], b = ed(v);
      f.write(`const ${$} = ${_(v)};`), f.write(`
        if (${$}.issues.length) {
          payload.issues = payload.issues.concat(${$}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${b}, ...iss.path] : [${b}]
          })));
        }
        
        
        if (${$}.value === undefined) {
          if (${b} in input) {
            newResult[${b}] = undefined;
          }
        } else {
          newResult[${b}] = ${$}.value;
        }
        
      `);
    }
    f.write("payload.value = newResult;"), f.write("return payload;");
    const p = f.compile();
    return (v, $) => p(d, v, $);
  };
  let a;
  const s = On, i = !Rh.jitless, c = i && nb.value, l = t.catchall;
  let y;
  e._zod.parse = (d, f) => {
    y ?? (y = n.value);
    const g = d.value;
    return s(g) ? i && c && (f == null ? void 0 : f.async) === !1 && f.jitless !== !0 ? (a || (a = o(t.shape)), d = a(d, f), l ? Zh([], g, d, f, y, e) : d) : r(d, f) : (d.issues.push({
      expected: "object",
      code: "invalid_type",
      input: g,
      inst: e
    }), d);
  };
});
function nd(e, t, r, n) {
  for (const a of e)
    if (a.issues.length === 0)
      return t.value = a.value, t;
  const o = e.filter((a) => !Ir(a));
  return o.length === 1 ? (t.value = o[0].value, o[0]) : (t.issues.push({
    code: "invalid_union",
    input: t.value,
    inst: r,
    errors: e.map((a) => a.issues.map((s) => Gt(s, n, Zt())))
  }), t);
}
const Gh = /* @__PURE__ */ z("$ZodUnion", (e, t) => {
  ve.init(e, t), he(e._zod, "optin", () => t.options.some((o) => o._zod.optin === "optional") ? "optional" : void 0), he(e._zod, "optout", () => t.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0), he(e._zod, "values", () => {
    if (t.options.every((o) => o._zod.values))
      return new Set(t.options.flatMap((o) => Array.from(o._zod.values)));
  }), he(e._zod, "pattern", () => {
    if (t.options.every((o) => o._zod.pattern)) {
      const o = t.options.map((a) => a._zod.pattern);
      return new RegExp(`^(${o.map((a) => Di(a.source)).join("|")})$`);
    }
  });
  const r = t.options.length === 1, n = t.options[0]._zod.run;
  e._zod.parse = (o, a) => {
    if (r)
      return n(o, a);
    let s = !1;
    const i = [];
    for (const u of t.options) {
      const c = u._zod.run({
        value: o.value,
        issues: []
      }, a);
      if (c instanceof Promise)
        i.push(c), s = !0;
      else {
        if (c.issues.length === 0)
          return c;
        i.push(c);
      }
    }
    return s ? Promise.all(i).then((u) => nd(u, o, e, a)) : nd(i, o, e, a);
  };
}), Ww = /* @__PURE__ */ z("$ZodDiscriminatedUnion", (e, t) => {
  Gh.init(e, t);
  const r = e._zod.parse;
  he(e._zod, "propValues", () => {
    const o = {};
    for (const a of t.options) {
      const s = a._zod.propValues;
      if (!s || Object.keys(s).length === 0)
        throw new Error(`Invalid discriminated union option at index "${t.options.indexOf(a)}"`);
      for (const [i, u] of Object.entries(s)) {
        o[i] || (o[i] = /* @__PURE__ */ new Set());
        for (const c of u)
          o[i].add(c);
      }
    }
    return o;
  });
  const n = ya(() => {
    var s;
    const o = t.options, a = /* @__PURE__ */ new Map();
    for (const i of o) {
      const u = (s = i._zod.propValues) == null ? void 0 : s[t.discriminator];
      if (!u || u.size === 0)
        throw new Error(`Invalid discriminated union option at index "${t.options.indexOf(i)}"`);
      for (const c of u) {
        if (a.has(c))
          throw new Error(`Duplicate discriminator value "${String(c)}"`);
        a.set(c, i);
      }
    }
    return a;
  });
  e._zod.parse = (o, a) => {
    const s = o.value;
    if (!On(s))
      return o.issues.push({
        code: "invalid_type",
        expected: "object",
        input: s,
        inst: e
      }), o;
    const i = n.value.get(s == null ? void 0 : s[t.discriminator]);
    return i ? i._zod.run(o, a) : t.unionFallback ? r(o, a) : (o.issues.push({
      code: "invalid_union",
      errors: [],
      note: "No matching discriminator",
      discriminator: t.discriminator,
      input: s,
      path: [t.discriminator],
      inst: e
    }), o);
  };
}), Jw = /* @__PURE__ */ z("$ZodIntersection", (e, t) => {
  ve.init(e, t), e._zod.parse = (r, n) => {
    const o = r.value, a = t.left._zod.run({ value: o, issues: [] }, n), s = t.right._zod.run({ value: o, issues: [] }, n);
    return a instanceof Promise || s instanceof Promise ? Promise.all([a, s]).then(([u, c]) => od(r, u, c)) : od(r, a, s);
  };
});
function mi(e, t) {
  if (e === t)
    return { valid: !0, data: e };
  if (e instanceof Date && t instanceof Date && +e == +t)
    return { valid: !0, data: e };
  if (kr(e) && kr(t)) {
    const r = Object.keys(t), n = Object.keys(e).filter((a) => r.indexOf(a) !== -1), o = { ...e, ...t };
    for (const a of n) {
      const s = mi(e[a], t[a]);
      if (!s.valid)
        return {
          valid: !1,
          mergeErrorPath: [a, ...s.mergeErrorPath]
        };
      o[a] = s.data;
    }
    return { valid: !0, data: o };
  }
  if (Array.isArray(e) && Array.isArray(t)) {
    if (e.length !== t.length)
      return { valid: !1, mergeErrorPath: [] };
    const r = [];
    for (let n = 0; n < e.length; n++) {
      const o = e[n], a = t[n], s = mi(o, a);
      if (!s.valid)
        return {
          valid: !1,
          mergeErrorPath: [n, ...s.mergeErrorPath]
        };
      r.push(s.data);
    }
    return { valid: !0, data: r };
  }
  return { valid: !1, mergeErrorPath: [] };
}
function od(e, t, r) {
  if (t.issues.length && e.issues.push(...t.issues), r.issues.length && e.issues.push(...r.issues), Ir(e))
    return e;
  const n = mi(t.value, r.value);
  if (!n.valid)
    throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(n.mergeErrorPath)}`);
  return e.value = n.data, e;
}
const Kw = /* @__PURE__ */ z("$ZodRecord", (e, t) => {
  ve.init(e, t), e._zod.parse = (r, n) => {
    const o = r.value;
    if (!kr(o))
      return r.issues.push({
        expected: "record",
        code: "invalid_type",
        input: o,
        inst: e
      }), r;
    const a = [];
    if (t.keyType._zod.values) {
      const s = t.keyType._zod.values;
      r.value = {};
      for (const u of s)
        if (typeof u == "string" || typeof u == "number" || typeof u == "symbol") {
          const c = t.valueType._zod.run({ value: o[u], issues: [] }, n);
          c instanceof Promise ? a.push(c.then((l) => {
            l.issues.length && r.issues.push(...Tr(u, l.issues)), r.value[u] = l.value;
          })) : (c.issues.length && r.issues.push(...Tr(u, c.issues)), r.value[u] = c.value);
        }
      let i;
      for (const u in o)
        s.has(u) || (i = i ?? [], i.push(u));
      i && i.length > 0 && r.issues.push({
        code: "unrecognized_keys",
        input: o,
        inst: e,
        keys: i
      });
    } else {
      r.value = {};
      for (const s of Reflect.ownKeys(o)) {
        if (s === "__proto__")
          continue;
        const i = t.keyType._zod.run({ value: s, issues: [] }, n);
        if (i instanceof Promise)
          throw new Error("Async schemas not supported in object keys currently");
        if (i.issues.length) {
          r.issues.push({
            code: "invalid_key",
            origin: "record",
            issues: i.issues.map((c) => Gt(c, n, Zt())),
            input: s,
            path: [s],
            inst: e
          }), r.value[i.value] = i.value;
          continue;
        }
        const u = t.valueType._zod.run({ value: o[s], issues: [] }, n);
        u instanceof Promise ? a.push(u.then((c) => {
          c.issues.length && r.issues.push(...Tr(s, c.issues)), r.value[i.value] = c.value;
        })) : (u.issues.length && r.issues.push(...Tr(s, u.issues)), r.value[i.value] = u.value);
      }
    }
    return a.length ? Promise.all(a).then(() => r) : r;
  };
}), Yw = /* @__PURE__ */ z("$ZodEnum", (e, t) => {
  ve.init(e, t);
  const r = Ph(t.entries), n = new Set(r);
  e._zod.values = n, e._zod.pattern = new RegExp(`^(${r.filter((o) => ob.has(typeof o)).map((o) => typeof o == "string" ? Nr(o) : o.toString()).join("|")})$`), e._zod.parse = (o, a) => {
    const s = o.value;
    return n.has(s) || o.issues.push({
      code: "invalid_value",
      values: r,
      input: s,
      inst: e
    }), o;
  };
}), Xw = /* @__PURE__ */ z("$ZodLiteral", (e, t) => {
  if (ve.init(e, t), t.values.length === 0)
    throw new Error("Cannot create literal schema with no valid values");
  e._zod.values = new Set(t.values), e._zod.pattern = new RegExp(`^(${t.values.map((r) => typeof r == "string" ? Nr(r) : r ? Nr(r.toString()) : String(r)).join("|")})$`), e._zod.parse = (r, n) => {
    const o = r.value;
    return e._zod.values.has(o) || r.issues.push({
      code: "invalid_value",
      values: t.values,
      input: o,
      inst: e
    }), r;
  };
}), Qw = /* @__PURE__ */ z("$ZodTransform", (e, t) => {
  ve.init(e, t), e._zod.parse = (r, n) => {
    if (n.direction === "backward")
      throw new Oh(e.constructor.name);
    const o = t.transform(r.value, r);
    if (n.async)
      return (o instanceof Promise ? o : Promise.resolve(o)).then((s) => (r.value = s, r));
    if (o instanceof Promise)
      throw new Pr();
    return r.value = o, r;
  };
});
function ad(e, t) {
  return e.issues.length && t === void 0 ? { issues: [], value: void 0 } : e;
}
const eE = /* @__PURE__ */ z("$ZodOptional", (e, t) => {
  ve.init(e, t), e._zod.optin = "optional", e._zod.optout = "optional", he(e._zod, "values", () => t.innerType._zod.values ? /* @__PURE__ */ new Set([...t.innerType._zod.values, void 0]) : void 0), he(e._zod, "pattern", () => {
    const r = t.innerType._zod.pattern;
    return r ? new RegExp(`^(${Di(r.source)})?$`) : void 0;
  }), e._zod.parse = (r, n) => {
    if (t.innerType._zod.optin === "optional") {
      const o = t.innerType._zod.run(r, n);
      return o instanceof Promise ? o.then((a) => ad(a, r.value)) : ad(o, r.value);
    }
    return r.value === void 0 ? r : t.innerType._zod.run(r, n);
  };
}), tE = /* @__PURE__ */ z("$ZodNullable", (e, t) => {
  ve.init(e, t), he(e._zod, "optin", () => t.innerType._zod.optin), he(e._zod, "optout", () => t.innerType._zod.optout), he(e._zod, "pattern", () => {
    const r = t.innerType._zod.pattern;
    return r ? new RegExp(`^(${Di(r.source)}|null)$`) : void 0;
  }), he(e._zod, "values", () => t.innerType._zod.values ? /* @__PURE__ */ new Set([...t.innerType._zod.values, null]) : void 0), e._zod.parse = (r, n) => r.value === null ? r : t.innerType._zod.run(r, n);
}), rE = /* @__PURE__ */ z("$ZodDefault", (e, t) => {
  ve.init(e, t), e._zod.optin = "optional", he(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (r, n) => {
    if (n.direction === "backward")
      return t.innerType._zod.run(r, n);
    if (r.value === void 0)
      return r.value = t.defaultValue, r;
    const o = t.innerType._zod.run(r, n);
    return o instanceof Promise ? o.then((a) => sd(a, t)) : sd(o, t);
  };
});
function sd(e, t) {
  return e.value === void 0 && (e.value = t.defaultValue), e;
}
const nE = /* @__PURE__ */ z("$ZodPrefault", (e, t) => {
  ve.init(e, t), e._zod.optin = "optional", he(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (r, n) => (n.direction === "backward" || r.value === void 0 && (r.value = t.defaultValue), t.innerType._zod.run(r, n));
}), oE = /* @__PURE__ */ z("$ZodNonOptional", (e, t) => {
  ve.init(e, t), he(e._zod, "values", () => {
    const r = t.innerType._zod.values;
    return r ? new Set([...r].filter((n) => n !== void 0)) : void 0;
  }), e._zod.parse = (r, n) => {
    const o = t.innerType._zod.run(r, n);
    return o instanceof Promise ? o.then((a) => id(a, e)) : id(o, e);
  };
});
function id(e, t) {
  return !e.issues.length && e.value === void 0 && e.issues.push({
    code: "invalid_type",
    expected: "nonoptional",
    input: e.value,
    inst: t
  }), e;
}
const aE = /* @__PURE__ */ z("$ZodCatch", (e, t) => {
  ve.init(e, t), he(e._zod, "optin", () => t.innerType._zod.optin), he(e._zod, "optout", () => t.innerType._zod.optout), he(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (r, n) => {
    if (n.direction === "backward")
      return t.innerType._zod.run(r, n);
    const o = t.innerType._zod.run(r, n);
    return o instanceof Promise ? o.then((a) => (r.value = a.value, a.issues.length && (r.value = t.catchValue({
      ...r,
      error: {
        issues: a.issues.map((s) => Gt(s, n, Zt()))
      },
      input: r.value
    }), r.issues = []), r)) : (r.value = o.value, o.issues.length && (r.value = t.catchValue({
      ...r,
      error: {
        issues: o.issues.map((a) => Gt(a, n, Zt()))
      },
      input: r.value
    }), r.issues = []), r);
  };
}), sE = /* @__PURE__ */ z("$ZodPipe", (e, t) => {
  ve.init(e, t), he(e._zod, "values", () => t.in._zod.values), he(e._zod, "optin", () => t.in._zod.optin), he(e._zod, "optout", () => t.out._zod.optout), he(e._zod, "propValues", () => t.in._zod.propValues), e._zod.parse = (r, n) => {
    if (n.direction === "backward") {
      const a = t.out._zod.run(r, n);
      return a instanceof Promise ? a.then((s) => Zo(s, t.in, n)) : Zo(a, t.in, n);
    }
    const o = t.in._zod.run(r, n);
    return o instanceof Promise ? o.then((a) => Zo(a, t.out, n)) : Zo(o, t.out, n);
  };
});
function Zo(e, t, r) {
  return e.issues.length ? (e.aborted = !0, e) : t._zod.run({ value: e.value, issues: e.issues }, r);
}
const iE = /* @__PURE__ */ z("$ZodReadonly", (e, t) => {
  ve.init(e, t), he(e._zod, "propValues", () => t.innerType._zod.propValues), he(e._zod, "values", () => t.innerType._zod.values), he(e._zod, "optin", () => t.innerType._zod.optin), he(e._zod, "optout", () => t.innerType._zod.optout), e._zod.parse = (r, n) => {
    if (n.direction === "backward")
      return t.innerType._zod.run(r, n);
    const o = t.innerType._zod.run(r, n);
    return o instanceof Promise ? o.then(ud) : ud(o);
  };
});
function ud(e) {
  return e.value = Object.freeze(e.value), e;
}
const uE = /* @__PURE__ */ z("$ZodLazy", (e, t) => {
  ve.init(e, t), he(e._zod, "innerType", () => t.getter()), he(e._zod, "pattern", () => e._zod.innerType._zod.pattern), he(e._zod, "propValues", () => e._zod.innerType._zod.propValues), he(e._zod, "optin", () => e._zod.innerType._zod.optin ?? void 0), he(e._zod, "optout", () => e._zod.innerType._zod.optout ?? void 0), e._zod.parse = (r, n) => e._zod.innerType._zod.run(r, n);
}), cE = /* @__PURE__ */ z("$ZodCustom", (e, t) => {
  Ke.init(e, t), ve.init(e, t), e._zod.parse = (r, n) => r, e._zod.check = (r) => {
    const n = r.value, o = t.fn(n);
    if (o instanceof Promise)
      return o.then((a) => cd(a, r, n, e));
    cd(o, r, n, e);
  };
});
function cd(e, t, r, n) {
  if (!e) {
    const o = {
      code: "custom",
      input: r,
      inst: n,
      // incorporates params.error into issue reporting
      path: [...n._zod.def.path ?? []],
      // incorporates params.error into issue reporting
      continue: !n._zod.def.abort
      // params: inst._zod.def.params,
    };
    n._zod.def.params && (o.params = n._zod.def.params), t.issues.push(Rn(o));
  }
}
class Bh {
  constructor() {
    this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map();
  }
  add(t, ...r) {
    const n = r[0];
    if (this._map.set(t, n), n && typeof n == "object" && "id" in n) {
      if (this._idmap.has(n.id))
        throw new Error(`ID ${n.id} already exists in the registry`);
      this._idmap.set(n.id, t);
    }
    return this;
  }
  clear() {
    return this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map(), this;
  }
  remove(t) {
    const r = this._map.get(t);
    return r && typeof r == "object" && "id" in r && this._idmap.delete(r.id), this._map.delete(t), this;
  }
  get(t) {
    const r = t._zod.parent;
    if (r) {
      const n = { ...this.get(r) ?? {} };
      delete n.id;
      const o = { ...n, ...this._map.get(t) };
      return Object.keys(o).length ? o : void 0;
    }
    return this._map.get(t);
  }
  has(t) {
    return this._map.has(t);
  }
}
function lE() {
  return new Bh();
}
const Sn = /* @__PURE__ */ lE();
function dE(e, t) {
  return new e({
    type: "string",
    ...re(t)
  });
}
function fE(e, t) {
  return new e({
    type: "string",
    format: "email",
    check: "string_format",
    abort: !1,
    ...re(t)
  });
}
function ld(e, t) {
  return new e({
    type: "string",
    format: "guid",
    check: "string_format",
    abort: !1,
    ...re(t)
  });
}
function pE(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    ...re(t)
  });
}
function hE(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v4",
    ...re(t)
  });
}
function mE(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v6",
    ...re(t)
  });
}
function gE(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v7",
    ...re(t)
  });
}
function yE(e, t) {
  return new e({
    type: "string",
    format: "url",
    check: "string_format",
    abort: !1,
    ...re(t)
  });
}
function vE(e, t) {
  return new e({
    type: "string",
    format: "emoji",
    check: "string_format",
    abort: !1,
    ...re(t)
  });
}
function _E(e, t) {
  return new e({
    type: "string",
    format: "nanoid",
    check: "string_format",
    abort: !1,
    ...re(t)
  });
}
function bE(e, t) {
  return new e({
    type: "string",
    format: "cuid",
    check: "string_format",
    abort: !1,
    ...re(t)
  });
}
function wE(e, t) {
  return new e({
    type: "string",
    format: "cuid2",
    check: "string_format",
    abort: !1,
    ...re(t)
  });
}
function EE(e, t) {
  return new e({
    type: "string",
    format: "ulid",
    check: "string_format",
    abort: !1,
    ...re(t)
  });
}
function $E(e, t) {
  return new e({
    type: "string",
    format: "xid",
    check: "string_format",
    abort: !1,
    ...re(t)
  });
}
function SE(e, t) {
  return new e({
    type: "string",
    format: "ksuid",
    check: "string_format",
    abort: !1,
    ...re(t)
  });
}
function IE(e, t) {
  return new e({
    type: "string",
    format: "ipv4",
    check: "string_format",
    abort: !1,
    ...re(t)
  });
}
function TE(e, t) {
  return new e({
    type: "string",
    format: "ipv6",
    check: "string_format",
    abort: !1,
    ...re(t)
  });
}
function OE(e, t) {
  return new e({
    type: "string",
    format: "cidrv4",
    check: "string_format",
    abort: !1,
    ...re(t)
  });
}
function RE(e, t) {
  return new e({
    type: "string",
    format: "cidrv6",
    check: "string_format",
    abort: !1,
    ...re(t)
  });
}
function PE(e, t) {
  return new e({
    type: "string",
    format: "base64",
    check: "string_format",
    abort: !1,
    ...re(t)
  });
}
function kE(e, t) {
  return new e({
    type: "string",
    format: "base64url",
    check: "string_format",
    abort: !1,
    ...re(t)
  });
}
function NE(e, t) {
  return new e({
    type: "string",
    format: "e164",
    check: "string_format",
    abort: !1,
    ...re(t)
  });
}
function AE(e, t) {
  return new e({
    type: "string",
    format: "jwt",
    check: "string_format",
    abort: !1,
    ...re(t)
  });
}
function CE(e, t) {
  return new e({
    type: "string",
    format: "datetime",
    check: "string_format",
    offset: !1,
    local: !1,
    precision: null,
    ...re(t)
  });
}
function jE(e, t) {
  return new e({
    type: "string",
    format: "date",
    check: "string_format",
    ...re(t)
  });
}
function ME(e, t) {
  return new e({
    type: "string",
    format: "time",
    check: "string_format",
    precision: null,
    ...re(t)
  });
}
function xE(e, t) {
  return new e({
    type: "string",
    format: "duration",
    check: "string_format",
    ...re(t)
  });
}
function DE(e, t) {
  return new e({
    type: "number",
    checks: [],
    ...re(t)
  });
}
function qE(e, t) {
  return new e({
    type: "number",
    coerce: !0,
    checks: [],
    ...re(t)
  });
}
function LE(e, t) {
  return new e({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "safeint",
    ...re(t)
  });
}
function zE(e, t) {
  return new e({
    type: "boolean",
    ...re(t)
  });
}
function VE(e, t) {
  return new e({
    type: "null",
    ...re(t)
  });
}
function UE(e) {
  return new e({
    type: "any"
  });
}
function FE(e) {
  return new e({
    type: "unknown"
  });
}
function ZE(e, t) {
  return new e({
    type: "never",
    ...re(t)
  });
}
function dd(e, t) {
  return new Lh({
    check: "less_than",
    ...re(t),
    value: e,
    inclusive: !1
  });
}
function Gs(e, t) {
  return new Lh({
    check: "less_than",
    ...re(t),
    value: e,
    inclusive: !0
  });
}
function fd(e, t) {
  return new zh({
    check: "greater_than",
    ...re(t),
    value: e,
    inclusive: !1
  });
}
function Bs(e, t) {
  return new zh({
    check: "greater_than",
    ...re(t),
    value: e,
    inclusive: !0
  });
}
function pd(e, t) {
  return new ew({
    check: "multiple_of",
    ...re(t),
    value: e
  });
}
function Hh(e, t) {
  return new rw({
    check: "max_length",
    ...re(t),
    maximum: e
  });
}
function ta(e, t) {
  return new nw({
    check: "min_length",
    ...re(t),
    minimum: e
  });
}
function Wh(e, t) {
  return new ow({
    check: "length_equals",
    ...re(t),
    length: e
  });
}
function GE(e, t) {
  return new aw({
    check: "string_format",
    format: "regex",
    ...re(t),
    pattern: e
  });
}
function BE(e) {
  return new sw({
    check: "string_format",
    format: "lowercase",
    ...re(e)
  });
}
function HE(e) {
  return new iw({
    check: "string_format",
    format: "uppercase",
    ...re(e)
  });
}
function WE(e, t) {
  return new uw({
    check: "string_format",
    format: "includes",
    ...re(t),
    includes: e
  });
}
function JE(e, t) {
  return new cw({
    check: "string_format",
    format: "starts_with",
    ...re(t),
    prefix: e
  });
}
function KE(e, t) {
  return new lw({
    check: "string_format",
    format: "ends_with",
    ...re(t),
    suffix: e
  });
}
function Mn(e) {
  return new dw({
    check: "overwrite",
    tx: e
  });
}
function YE(e) {
  return Mn((t) => t.normalize(e));
}
function XE() {
  return Mn((e) => e.trim());
}
function QE() {
  return Mn((e) => e.toLowerCase());
}
function e$() {
  return Mn((e) => e.toUpperCase());
}
function t$(e, t, r) {
  return new e({
    type: "array",
    element: t,
    // get element() {
    //   return element;
    // },
    ...re(r)
  });
}
function r$(e, t, r) {
  const n = re(r);
  return n.abort ?? (n.abort = !0), new e({
    type: "custom",
    check: "custom",
    fn: t,
    ...n
  });
}
function n$(e, t, r) {
  return new e({
    type: "custom",
    check: "custom",
    fn: t,
    ...re(r)
  });
}
function o$(e) {
  const t = a$((r) => (r.addIssue = (n) => {
    if (typeof n == "string")
      r.issues.push(Rn(n, r.value, t._zod.def));
    else {
      const o = n;
      o.fatal && (o.continue = !1), o.code ?? (o.code = "custom"), o.input ?? (o.input = r.value), o.inst ?? (o.inst = t), o.continue ?? (o.continue = !t._zod.def.abort), r.issues.push(Rn(o));
    }
  }, e(r.value, r)));
  return t;
}
function a$(e, t) {
  const r = new Ke({
    check: "custom",
    ...re(t)
  });
  return r._zod.check = e, r;
}
class hd {
  constructor(t) {
    this.counter = 0, this.metadataRegistry = (t == null ? void 0 : t.metadata) ?? Sn, this.target = (t == null ? void 0 : t.target) ?? "draft-2020-12", this.unrepresentable = (t == null ? void 0 : t.unrepresentable) ?? "throw", this.override = (t == null ? void 0 : t.override) ?? (() => {
    }), this.io = (t == null ? void 0 : t.io) ?? "output", this.seen = /* @__PURE__ */ new Map();
  }
  process(t, r = { path: [], schemaPath: [] }) {
    var y, d, f;
    var n;
    const o = t._zod.def, a = {
      guid: "uuid",
      url: "uri",
      datetime: "date-time",
      json_string: "json-string",
      regex: ""
      // do not set
    }, s = this.seen.get(t);
    if (s)
      return s.count++, r.schemaPath.includes(t) && (s.cycle = r.path), s.schema;
    const i = { schema: {}, count: 1, cycle: void 0, path: r.path };
    this.seen.set(t, i);
    const u = (d = (y = t._zod).toJSONSchema) == null ? void 0 : d.call(y);
    if (u)
      i.schema = u;
    else {
      const g = {
        ...r,
        schemaPath: [...r.schemaPath, t],
        path: r.path
      }, _ = t._zod.parent;
      if (_)
        i.ref = _, this.process(_, g), this.seen.get(_).isParent = !0;
      else {
        const m = i.schema;
        switch (o.type) {
          case "string": {
            const h = m;
            h.type = "string";
            const { minimum: p, maximum: v, format: $, patterns: b, contentEncoding: E } = t._zod.bag;
            if (typeof p == "number" && (h.minLength = p), typeof v == "number" && (h.maxLength = v), $ && (h.format = a[$] ?? $, h.format === "" && delete h.format), E && (h.contentEncoding = E), b && b.size > 0) {
              const I = [...b];
              I.length === 1 ? h.pattern = I[0].source : I.length > 1 && (i.schema.allOf = [
                ...I.map((O) => ({
                  ...this.target === "draft-7" || this.target === "draft-4" || this.target === "openapi-3.0" ? { type: "string" } : {},
                  pattern: O.source
                }))
              ]);
            }
            break;
          }
          case "number": {
            const h = m, { minimum: p, maximum: v, format: $, multipleOf: b, exclusiveMaximum: E, exclusiveMinimum: I } = t._zod.bag;
            typeof $ == "string" && $.includes("int") ? h.type = "integer" : h.type = "number", typeof I == "number" && (this.target === "draft-4" || this.target === "openapi-3.0" ? (h.minimum = I, h.exclusiveMinimum = !0) : h.exclusiveMinimum = I), typeof p == "number" && (h.minimum = p, typeof I == "number" && this.target !== "draft-4" && (I >= p ? delete h.minimum : delete h.exclusiveMinimum)), typeof E == "number" && (this.target === "draft-4" || this.target === "openapi-3.0" ? (h.maximum = E, h.exclusiveMaximum = !0) : h.exclusiveMaximum = E), typeof v == "number" && (h.maximum = v, typeof E == "number" && this.target !== "draft-4" && (E <= v ? delete h.maximum : delete h.exclusiveMaximum)), typeof b == "number" && (h.multipleOf = b);
            break;
          }
          case "boolean": {
            const h = m;
            h.type = "boolean";
            break;
          }
          case "bigint": {
            if (this.unrepresentable === "throw")
              throw new Error("BigInt cannot be represented in JSON Schema");
            break;
          }
          case "symbol": {
            if (this.unrepresentable === "throw")
              throw new Error("Symbols cannot be represented in JSON Schema");
            break;
          }
          case "null": {
            this.target === "openapi-3.0" ? (m.type = "string", m.nullable = !0, m.enum = [null]) : m.type = "null";
            break;
          }
          case "any":
            break;
          case "unknown":
            break;
          case "undefined": {
            if (this.unrepresentable === "throw")
              throw new Error("Undefined cannot be represented in JSON Schema");
            break;
          }
          case "void": {
            if (this.unrepresentable === "throw")
              throw new Error("Void cannot be represented in JSON Schema");
            break;
          }
          case "never": {
            m.not = {};
            break;
          }
          case "date": {
            if (this.unrepresentable === "throw")
              throw new Error("Date cannot be represented in JSON Schema");
            break;
          }
          case "array": {
            const h = m, { minimum: p, maximum: v } = t._zod.bag;
            typeof p == "number" && (h.minItems = p), typeof v == "number" && (h.maxItems = v), h.type = "array", h.items = this.process(o.element, { ...g, path: [...g.path, "items"] });
            break;
          }
          case "object": {
            const h = m;
            h.type = "object", h.properties = {};
            const p = o.shape;
            for (const b in p)
              h.properties[b] = this.process(p[b], {
                ...g,
                path: [...g.path, "properties", b]
              });
            const v = new Set(Object.keys(p)), $ = new Set([...v].filter((b) => {
              const E = o.shape[b]._zod;
              return this.io === "input" ? E.optin === void 0 : E.optout === void 0;
            }));
            $.size > 0 && (h.required = Array.from($)), ((f = o.catchall) == null ? void 0 : f._zod.def.type) === "never" ? h.additionalProperties = !1 : o.catchall ? o.catchall && (h.additionalProperties = this.process(o.catchall, {
              ...g,
              path: [...g.path, "additionalProperties"]
            })) : this.io === "output" && (h.additionalProperties = !1);
            break;
          }
          case "union": {
            const h = m, p = o.options.map((v, $) => this.process(v, {
              ...g,
              path: [...g.path, "anyOf", $]
            }));
            h.anyOf = p;
            break;
          }
          case "intersection": {
            const h = m, p = this.process(o.left, {
              ...g,
              path: [...g.path, "allOf", 0]
            }), v = this.process(o.right, {
              ...g,
              path: [...g.path, "allOf", 1]
            }), $ = (E) => "allOf" in E && Object.keys(E).length === 1, b = [
              ...$(p) ? p.allOf : [p],
              ...$(v) ? v.allOf : [v]
            ];
            h.allOf = b;
            break;
          }
          case "tuple": {
            const h = m;
            h.type = "array";
            const p = this.target === "draft-2020-12" ? "prefixItems" : "items", v = this.target === "draft-2020-12" || this.target === "openapi-3.0" ? "items" : "additionalItems", $ = o.items.map((O, q) => this.process(O, {
              ...g,
              path: [...g.path, p, q]
            })), b = o.rest ? this.process(o.rest, {
              ...g,
              path: [...g.path, v, ...this.target === "openapi-3.0" ? [o.items.length] : []]
            }) : null;
            this.target === "draft-2020-12" ? (h.prefixItems = $, b && (h.items = b)) : this.target === "openapi-3.0" ? (h.items = {
              anyOf: $
            }, b && h.items.anyOf.push(b), h.minItems = $.length, b || (h.maxItems = $.length)) : (h.items = $, b && (h.additionalItems = b));
            const { minimum: E, maximum: I } = t._zod.bag;
            typeof E == "number" && (h.minItems = E), typeof I == "number" && (h.maxItems = I);
            break;
          }
          case "record": {
            const h = m;
            h.type = "object", (this.target === "draft-7" || this.target === "draft-2020-12") && (h.propertyNames = this.process(o.keyType, {
              ...g,
              path: [...g.path, "propertyNames"]
            })), h.additionalProperties = this.process(o.valueType, {
              ...g,
              path: [...g.path, "additionalProperties"]
            });
            break;
          }
          case "map": {
            if (this.unrepresentable === "throw")
              throw new Error("Map cannot be represented in JSON Schema");
            break;
          }
          case "set": {
            if (this.unrepresentable === "throw")
              throw new Error("Set cannot be represented in JSON Schema");
            break;
          }
          case "enum": {
            const h = m, p = Ph(o.entries);
            p.every((v) => typeof v == "number") && (h.type = "number"), p.every((v) => typeof v == "string") && (h.type = "string"), h.enum = p;
            break;
          }
          case "literal": {
            const h = m, p = [];
            for (const v of o.values)
              if (v === void 0) {
                if (this.unrepresentable === "throw")
                  throw new Error("Literal `undefined` cannot be represented in JSON Schema");
              } else if (typeof v == "bigint") {
                if (this.unrepresentable === "throw")
                  throw new Error("BigInt literals cannot be represented in JSON Schema");
                p.push(Number(v));
              } else
                p.push(v);
            if (p.length !== 0) if (p.length === 1) {
              const v = p[0];
              h.type = v === null ? "null" : typeof v, this.target === "draft-4" || this.target === "openapi-3.0" ? h.enum = [v] : h.const = v;
            } else
              p.every((v) => typeof v == "number") && (h.type = "number"), p.every((v) => typeof v == "string") && (h.type = "string"), p.every((v) => typeof v == "boolean") && (h.type = "string"), p.every((v) => v === null) && (h.type = "null"), h.enum = p;
            break;
          }
          case "file": {
            const h = m, p = {
              type: "string",
              format: "binary",
              contentEncoding: "binary"
            }, { minimum: v, maximum: $, mime: b } = t._zod.bag;
            v !== void 0 && (p.minLength = v), $ !== void 0 && (p.maxLength = $), b ? b.length === 1 ? (p.contentMediaType = b[0], Object.assign(h, p)) : h.anyOf = b.map((E) => ({ ...p, contentMediaType: E })) : Object.assign(h, p);
            break;
          }
          case "transform": {
            if (this.unrepresentable === "throw")
              throw new Error("Transforms cannot be represented in JSON Schema");
            break;
          }
          case "nullable": {
            const h = this.process(o.innerType, g);
            this.target === "openapi-3.0" ? (i.ref = o.innerType, m.nullable = !0) : m.anyOf = [h, { type: "null" }];
            break;
          }
          case "nonoptional": {
            this.process(o.innerType, g), i.ref = o.innerType;
            break;
          }
          case "success": {
            const h = m;
            h.type = "boolean";
            break;
          }
          case "default": {
            this.process(o.innerType, g), i.ref = o.innerType, m.default = JSON.parse(JSON.stringify(o.defaultValue));
            break;
          }
          case "prefault": {
            this.process(o.innerType, g), i.ref = o.innerType, this.io === "input" && (m._prefault = JSON.parse(JSON.stringify(o.defaultValue)));
            break;
          }
          case "catch": {
            this.process(o.innerType, g), i.ref = o.innerType;
            let h;
            try {
              h = o.catchValue(void 0);
            } catch {
              throw new Error("Dynamic catch values are not supported in JSON Schema");
            }
            m.default = h;
            break;
          }
          case "nan": {
            if (this.unrepresentable === "throw")
              throw new Error("NaN cannot be represented in JSON Schema");
            break;
          }
          case "template_literal": {
            const h = m, p = t._zod.pattern;
            if (!p)
              throw new Error("Pattern not found in template literal");
            h.type = "string", h.pattern = p.source;
            break;
          }
          case "pipe": {
            const h = this.io === "input" ? o.in._zod.def.type === "transform" ? o.out : o.in : o.out;
            this.process(h, g), i.ref = h;
            break;
          }
          case "readonly": {
            this.process(o.innerType, g), i.ref = o.innerType, m.readOnly = !0;
            break;
          }
          // passthrough types
          case "promise": {
            this.process(o.innerType, g), i.ref = o.innerType;
            break;
          }
          case "optional": {
            this.process(o.innerType, g), i.ref = o.innerType;
            break;
          }
          case "lazy": {
            const h = t._zod.innerType;
            this.process(h, g), i.ref = h;
            break;
          }
          case "custom": {
            if (this.unrepresentable === "throw")
              throw new Error("Custom types cannot be represented in JSON Schema");
            break;
          }
          case "function": {
            if (this.unrepresentable === "throw")
              throw new Error("Function types cannot be represented in JSON Schema");
            break;
          }
        }
      }
    }
    const c = this.metadataRegistry.get(t);
    return c && Object.assign(i.schema, c), this.io === "input" && Ne(t) && (delete i.schema.examples, delete i.schema.default), this.io === "input" && i.schema._prefault && ((n = i.schema).default ?? (n.default = i.schema._prefault)), delete i.schema._prefault, this.seen.get(t).schema;
  }
  emit(t, r) {
    var l, y, d, f, g, _;
    const n = {
      cycles: (r == null ? void 0 : r.cycles) ?? "ref",
      reused: (r == null ? void 0 : r.reused) ?? "inline",
      // unrepresentable: _params?.unrepresentable ?? "throw",
      // uri: _params?.uri ?? ((id) => `${id}`),
      external: (r == null ? void 0 : r.external) ?? void 0
    }, o = this.seen.get(t);
    if (!o)
      throw new Error("Unprocessed schema. This is a bug in Zod.");
    const a = (m) => {
      var b;
      const h = this.target === "draft-2020-12" ? "$defs" : "definitions";
      if (n.external) {
        const E = (b = n.external.registry.get(m[0])) == null ? void 0 : b.id, I = n.external.uri ?? ((q) => q);
        if (E)
          return { ref: I(E) };
        const O = m[1].defId ?? m[1].schema.id ?? `schema${this.counter++}`;
        return m[1].defId = O, { defId: O, ref: `${I("__shared")}#/${h}/${O}` };
      }
      if (m[1] === o)
        return { ref: "#" };
      const v = `#/${h}/`, $ = m[1].schema.id ?? `__schema${this.counter++}`;
      return { defId: $, ref: v + $ };
    }, s = (m) => {
      if (m[1].schema.$ref)
        return;
      const h = m[1], { ref: p, defId: v } = a(m);
      h.def = { ...h.schema }, v && (h.defId = v);
      const $ = h.schema;
      for (const b in $)
        delete $[b];
      $.$ref = p;
    };
    if (n.cycles === "throw")
      for (const m of this.seen.entries()) {
        const h = m[1];
        if (h.cycle)
          throw new Error(`Cycle detected: #/${(l = h.cycle) == null ? void 0 : l.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
      }
    for (const m of this.seen.entries()) {
      const h = m[1];
      if (t === m[0]) {
        s(m);
        continue;
      }
      if (n.external) {
        const v = (y = n.external.registry.get(m[0])) == null ? void 0 : y.id;
        if (t !== m[0] && v) {
          s(m);
          continue;
        }
      }
      if ((d = this.metadataRegistry.get(m[0])) == null ? void 0 : d.id) {
        s(m);
        continue;
      }
      if (h.cycle) {
        s(m);
        continue;
      }
      if (h.count > 1 && n.reused === "ref") {
        s(m);
        continue;
      }
    }
    const i = (m, h) => {
      const p = this.seen.get(m), v = p.def ?? p.schema, $ = { ...v };
      if (p.ref === null)
        return;
      const b = p.ref;
      if (p.ref = null, b) {
        i(b, h);
        const E = this.seen.get(b).schema;
        E.$ref && (h.target === "draft-7" || h.target === "draft-4" || h.target === "openapi-3.0") ? (v.allOf = v.allOf ?? [], v.allOf.push(E)) : (Object.assign(v, E), Object.assign(v, $));
      }
      p.isParent || this.override({
        zodSchema: m,
        jsonSchema: v,
        path: p.path ?? []
      });
    };
    for (const m of [...this.seen.entries()].reverse())
      i(m[0], { target: this.target });
    const u = {};
    if (this.target === "draft-2020-12" ? u.$schema = "https://json-schema.org/draft/2020-12/schema" : this.target === "draft-7" ? u.$schema = "http://json-schema.org/draft-07/schema#" : this.target === "draft-4" ? u.$schema = "http://json-schema.org/draft-04/schema#" : this.target === "openapi-3.0" || console.warn(`Invalid target: ${this.target}`), (f = n.external) != null && f.uri) {
      const m = (g = n.external.registry.get(t)) == null ? void 0 : g.id;
      if (!m)
        throw new Error("Schema is missing an `id` property");
      u.$id = n.external.uri(m);
    }
    Object.assign(u, o.def);
    const c = ((_ = n.external) == null ? void 0 : _.defs) ?? {};
    for (const m of this.seen.entries()) {
      const h = m[1];
      h.def && h.defId && (c[h.defId] = h.def);
    }
    n.external || Object.keys(c).length > 0 && (this.target === "draft-2020-12" ? u.$defs = c : u.definitions = c);
    try {
      return JSON.parse(JSON.stringify(u));
    } catch {
      throw new Error("Error converting schema to JSON.");
    }
  }
}
function s$(e, t) {
  if (e instanceof Bh) {
    const n = new hd(t), o = {};
    for (const i of e._idmap.entries()) {
      const [u, c] = i;
      n.process(c);
    }
    const a = {}, s = {
      registry: e,
      uri: t == null ? void 0 : t.uri,
      defs: o
    };
    for (const i of e._idmap.entries()) {
      const [u, c] = i;
      a[u] = n.emit(c, {
        ...t,
        external: s
      });
    }
    if (Object.keys(o).length > 0) {
      const i = n.target === "draft-2020-12" ? "$defs" : "definitions";
      a.__shared = {
        [i]: o
      };
    }
    return { schemas: a };
  }
  const r = new hd(t);
  return r.process(e), r.emit(e, t);
}
function Ne(e, t) {
  const r = t ?? { seen: /* @__PURE__ */ new Set() };
  if (r.seen.has(e))
    return !1;
  r.seen.add(e);
  const o = e._zod.def;
  switch (o.type) {
    case "string":
    case "number":
    case "bigint":
    case "boolean":
    case "date":
    case "symbol":
    case "undefined":
    case "null":
    case "any":
    case "unknown":
    case "never":
    case "void":
    case "literal":
    case "enum":
    case "nan":
    case "file":
    case "template_literal":
      return !1;
    case "array":
      return Ne(o.element, r);
    case "object": {
      for (const a in o.shape)
        if (Ne(o.shape[a], r))
          return !0;
      return !1;
    }
    case "union": {
      for (const a of o.options)
        if (Ne(a, r))
          return !0;
      return !1;
    }
    case "intersection":
      return Ne(o.left, r) || Ne(o.right, r);
    case "tuple": {
      for (const a of o.items)
        if (Ne(a, r))
          return !0;
      return !!(o.rest && Ne(o.rest, r));
    }
    case "record":
      return Ne(o.keyType, r) || Ne(o.valueType, r);
    case "map":
      return Ne(o.keyType, r) || Ne(o.valueType, r);
    case "set":
      return Ne(o.valueType, r);
    // inner types
    case "promise":
    case "optional":
    case "nonoptional":
    case "nullable":
    case "readonly":
      return Ne(o.innerType, r);
    case "lazy":
      return Ne(o.getter(), r);
    case "default":
      return Ne(o.innerType, r);
    case "prefault":
      return Ne(o.innerType, r);
    case "custom":
      return !1;
    case "transform":
      return !0;
    case "pipe":
      return Ne(o.in, r) || Ne(o.out, r);
    case "success":
      return !1;
    case "catch":
      return !1;
    case "function":
      return !1;
  }
  throw new Error(`Unknown schema type: ${o.type}`);
}
const i$ = /* @__PURE__ */ z("ZodISODateTime", (e, t) => {
  Iw.init(e, t), Ie.init(e, t);
});
function u$(e) {
  return CE(i$, e);
}
const c$ = /* @__PURE__ */ z("ZodISODate", (e, t) => {
  Tw.init(e, t), Ie.init(e, t);
});
function l$(e) {
  return jE(c$, e);
}
const d$ = /* @__PURE__ */ z("ZodISOTime", (e, t) => {
  Ow.init(e, t), Ie.init(e, t);
});
function f$(e) {
  return ME(d$, e);
}
const p$ = /* @__PURE__ */ z("ZodISODuration", (e, t) => {
  Rw.init(e, t), Ie.init(e, t);
});
function h$(e) {
  return xE(p$, e);
}
const m$ = (e, t) => {
  Ch.init(e, t), e.name = "ZodError", Object.defineProperties(e, {
    format: {
      value: (r) => mb(e, r)
      // enumerable: false,
    },
    flatten: {
      value: (r) => hb(e, r)
      // enumerable: false,
    },
    addIssue: {
      value: (r) => {
        e.issues.push(r), e.message = JSON.stringify(e.issues, hi, 2);
      }
      // enumerable: false,
    },
    addIssues: {
      value: (r) => {
        e.issues.push(...r), e.message = JSON.stringify(e.issues, hi, 2);
      }
      // enumerable: false,
    },
    isEmpty: {
      get() {
        return e.issues.length === 0;
      }
      // enumerable: false,
    }
  });
}, nt = z("ZodError", m$, {
  Parent: Error
}), g$ = /* @__PURE__ */ Li(nt), y$ = /* @__PURE__ */ zi(nt), v$ = /* @__PURE__ */ va(nt), Jh = /* @__PURE__ */ _a(nt), _$ = /* @__PURE__ */ vb(nt), b$ = /* @__PURE__ */ _b(nt), w$ = /* @__PURE__ */ bb(nt), E$ = /* @__PURE__ */ wb(nt), $$ = /* @__PURE__ */ Eb(nt), S$ = /* @__PURE__ */ $b(nt), I$ = /* @__PURE__ */ Sb(nt), T$ = /* @__PURE__ */ Ib(nt), be = /* @__PURE__ */ z("ZodType", (e, t) => (ve.init(e, t), e.def = t, e.type = t.type, Object.defineProperty(e, "_def", { value: t }), e.check = (...r) => e.clone(fr(t, {
  checks: [
    ...t.checks ?? [],
    ...r.map((n) => typeof n == "function" ? { _zod: { check: n, def: { check: "custom" }, onattach: [] } } : n)
  ]
})), e.clone = (r, n) => Wt(e, r, n), e.brand = () => e, e.register = ((r, n) => (r.add(e, n), e)), e.parse = (r, n) => g$(e, r, n, { callee: e.parse }), e.safeParse = (r, n) => v$(e, r, n), e.parseAsync = async (r, n) => y$(e, r, n, { callee: e.parseAsync }), e.safeParseAsync = async (r, n) => Jh(e, r, n), e.spa = e.safeParseAsync, e.encode = (r, n) => _$(e, r, n), e.decode = (r, n) => b$(e, r, n), e.encodeAsync = async (r, n) => w$(e, r, n), e.decodeAsync = async (r, n) => E$(e, r, n), e.safeEncode = (r, n) => $$(e, r, n), e.safeDecode = (r, n) => S$(e, r, n), e.safeEncodeAsync = async (r, n) => I$(e, r, n), e.safeDecodeAsync = async (r, n) => T$(e, r, n), e.refine = (r, n) => e.check(wS(r, n)), e.superRefine = (r) => e.check(ES(r)), e.overwrite = (r) => e.check(Mn(r)), e.optional = () => yd(e), e.nullable = () => vd(e), e.nullish = () => yd(vd(e)), e.nonoptional = (r) => pS(e, r), e.array = () => ee(e), e.or = (r) => _e([e, r]), e.and = (r) => nS(e, r), e.transform = (r) => _d(e, iS(r)), e.default = (r) => lS(e, r), e.prefault = (r) => fS(e, r), e.catch = (r) => mS(e, r), e.pipe = (r) => _d(e, r), e.readonly = () => vS(e), e.describe = (r) => {
  const n = e.clone();
  return Sn.add(n, { description: r }), n;
}, Object.defineProperty(e, "description", {
  get() {
    var r;
    return (r = Sn.get(e)) == null ? void 0 : r.description;
  },
  configurable: !0
}), e.meta = (...r) => {
  if (r.length === 0)
    return Sn.get(e);
  const n = e.clone();
  return Sn.add(n, r[0]), n;
}, e.isOptional = () => e.safeParse(void 0).success, e.isNullable = () => e.safeParse(null).success, e)), Kh = /* @__PURE__ */ z("_ZodString", (e, t) => {
  Vi.init(e, t), be.init(e, t);
  const r = e._zod.bag;
  e.format = r.format ?? null, e.minLength = r.minimum ?? null, e.maxLength = r.maximum ?? null, e.regex = (...n) => e.check(GE(...n)), e.includes = (...n) => e.check(WE(...n)), e.startsWith = (...n) => e.check(JE(...n)), e.endsWith = (...n) => e.check(KE(...n)), e.min = (...n) => e.check(ta(...n)), e.max = (...n) => e.check(Hh(...n)), e.length = (...n) => e.check(Wh(...n)), e.nonempty = (...n) => e.check(ta(1, ...n)), e.lowercase = (n) => e.check(BE(n)), e.uppercase = (n) => e.check(HE(n)), e.trim = () => e.check(XE()), e.normalize = (...n) => e.check(YE(...n)), e.toLowerCase = () => e.check(QE()), e.toUpperCase = () => e.check(e$());
}), O$ = /* @__PURE__ */ z("ZodString", (e, t) => {
  Vi.init(e, t), Kh.init(e, t), e.email = (r) => e.check(fE(R$, r)), e.url = (r) => e.check(yE(P$, r)), e.jwt = (r) => e.check(AE(Z$, r)), e.emoji = (r) => e.check(vE(k$, r)), e.guid = (r) => e.check(ld(md, r)), e.uuid = (r) => e.check(pE(Go, r)), e.uuidv4 = (r) => e.check(hE(Go, r)), e.uuidv6 = (r) => e.check(mE(Go, r)), e.uuidv7 = (r) => e.check(gE(Go, r)), e.nanoid = (r) => e.check(_E(N$, r)), e.guid = (r) => e.check(ld(md, r)), e.cuid = (r) => e.check(bE(A$, r)), e.cuid2 = (r) => e.check(wE(C$, r)), e.ulid = (r) => e.check(EE(j$, r)), e.base64 = (r) => e.check(PE(V$, r)), e.base64url = (r) => e.check(kE(U$, r)), e.xid = (r) => e.check($E(M$, r)), e.ksuid = (r) => e.check(SE(x$, r)), e.ipv4 = (r) => e.check(IE(D$, r)), e.ipv6 = (r) => e.check(TE(q$, r)), e.cidrv4 = (r) => e.check(OE(L$, r)), e.cidrv6 = (r) => e.check(RE(z$, r)), e.e164 = (r) => e.check(NE(F$, r)), e.datetime = (r) => e.check(u$(r)), e.date = (r) => e.check(l$(r)), e.time = (r) => e.check(f$(r)), e.duration = (r) => e.check(h$(r));
});
function T(e) {
  return dE(O$, e);
}
const Ie = /* @__PURE__ */ z("ZodStringFormat", (e, t) => {
  $e.init(e, t), Kh.init(e, t);
}), R$ = /* @__PURE__ */ z("ZodEmail", (e, t) => {
  gw.init(e, t), Ie.init(e, t);
}), md = /* @__PURE__ */ z("ZodGUID", (e, t) => {
  hw.init(e, t), Ie.init(e, t);
}), Go = /* @__PURE__ */ z("ZodUUID", (e, t) => {
  mw.init(e, t), Ie.init(e, t);
}), P$ = /* @__PURE__ */ z("ZodURL", (e, t) => {
  yw.init(e, t), Ie.init(e, t);
}), k$ = /* @__PURE__ */ z("ZodEmoji", (e, t) => {
  vw.init(e, t), Ie.init(e, t);
}), N$ = /* @__PURE__ */ z("ZodNanoID", (e, t) => {
  _w.init(e, t), Ie.init(e, t);
}), A$ = /* @__PURE__ */ z("ZodCUID", (e, t) => {
  bw.init(e, t), Ie.init(e, t);
}), C$ = /* @__PURE__ */ z("ZodCUID2", (e, t) => {
  ww.init(e, t), Ie.init(e, t);
}), j$ = /* @__PURE__ */ z("ZodULID", (e, t) => {
  Ew.init(e, t), Ie.init(e, t);
}), M$ = /* @__PURE__ */ z("ZodXID", (e, t) => {
  $w.init(e, t), Ie.init(e, t);
}), x$ = /* @__PURE__ */ z("ZodKSUID", (e, t) => {
  Sw.init(e, t), Ie.init(e, t);
}), D$ = /* @__PURE__ */ z("ZodIPv4", (e, t) => {
  Pw.init(e, t), Ie.init(e, t);
}), q$ = /* @__PURE__ */ z("ZodIPv6", (e, t) => {
  kw.init(e, t), Ie.init(e, t);
}), L$ = /* @__PURE__ */ z("ZodCIDRv4", (e, t) => {
  Nw.init(e, t), Ie.init(e, t);
}), z$ = /* @__PURE__ */ z("ZodCIDRv6", (e, t) => {
  Aw.init(e, t), Ie.init(e, t);
}), V$ = /* @__PURE__ */ z("ZodBase64", (e, t) => {
  Cw.init(e, t), Ie.init(e, t);
}), U$ = /* @__PURE__ */ z("ZodBase64URL", (e, t) => {
  Mw.init(e, t), Ie.init(e, t);
}), F$ = /* @__PURE__ */ z("ZodE164", (e, t) => {
  xw.init(e, t), Ie.init(e, t);
}), Z$ = /* @__PURE__ */ z("ZodJWT", (e, t) => {
  qw.init(e, t), Ie.init(e, t);
}), Ui = /* @__PURE__ */ z("ZodNumber", (e, t) => {
  Uh.init(e, t), be.init(e, t), e.gt = (n, o) => e.check(fd(n, o)), e.gte = (n, o) => e.check(Bs(n, o)), e.min = (n, o) => e.check(Bs(n, o)), e.lt = (n, o) => e.check(dd(n, o)), e.lte = (n, o) => e.check(Gs(n, o)), e.max = (n, o) => e.check(Gs(n, o)), e.int = (n) => e.check(gd(n)), e.safe = (n) => e.check(gd(n)), e.positive = (n) => e.check(fd(0, n)), e.nonnegative = (n) => e.check(Bs(0, n)), e.negative = (n) => e.check(dd(0, n)), e.nonpositive = (n) => e.check(Gs(0, n)), e.multipleOf = (n, o) => e.check(pd(n, o)), e.step = (n, o) => e.check(pd(n, o)), e.finite = () => e;
  const r = e._zod.bag;
  e.minValue = Math.max(r.minimum ?? Number.NEGATIVE_INFINITY, r.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null, e.maxValue = Math.min(r.maximum ?? Number.POSITIVE_INFINITY, r.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null, e.isInt = (r.format ?? "").includes("int") || Number.isSafeInteger(r.multipleOf ?? 0.5), e.isFinite = !0, e.format = r.format ?? null;
});
function V(e) {
  return DE(Ui, e);
}
const G$ = /* @__PURE__ */ z("ZodNumberFormat", (e, t) => {
  Lw.init(e, t), Ui.init(e, t);
});
function gd(e) {
  return LE(G$, e);
}
const B$ = /* @__PURE__ */ z("ZodBoolean", (e, t) => {
  zw.init(e, t), be.init(e, t);
});
function He(e) {
  return zE(B$, e);
}
const H$ = /* @__PURE__ */ z("ZodNull", (e, t) => {
  Vw.init(e, t), be.init(e, t);
});
function W$(e) {
  return VE(H$, e);
}
const J$ = /* @__PURE__ */ z("ZodAny", (e, t) => {
  Uw.init(e, t), be.init(e, t);
});
function lt() {
  return UE(J$);
}
const K$ = /* @__PURE__ */ z("ZodUnknown", (e, t) => {
  Fw.init(e, t), be.init(e, t);
});
function At() {
  return FE(K$);
}
const Y$ = /* @__PURE__ */ z("ZodNever", (e, t) => {
  Zw.init(e, t), be.init(e, t);
});
function X$(e) {
  return ZE(Y$, e);
}
const Q$ = /* @__PURE__ */ z("ZodArray", (e, t) => {
  Gw.init(e, t), be.init(e, t), e.element = t.element, e.min = (r, n) => e.check(ta(r, n)), e.nonempty = (r) => e.check(ta(1, r)), e.max = (r, n) => e.check(Hh(r, n)), e.length = (r, n) => e.check(Wh(r, n)), e.unwrap = () => e.element;
});
function ee(e, t) {
  return t$(Q$, e, t);
}
const eS = /* @__PURE__ */ z("ZodObject", (e, t) => {
  Hw.init(e, t), be.init(e, t), he(e, "shape", () => t.shape), e.keyof = () => Ee(Object.keys(e._zod.def.shape)), e.catchall = (r) => e.clone({ ...e._zod.def, catchall: r }), e.passthrough = () => e.clone({ ...e._zod.def, catchall: At() }), e.loose = () => e.clone({ ...e._zod.def, catchall: At() }), e.strict = () => e.clone({ ...e._zod.def, catchall: X$() }), e.strip = () => e.clone({ ...e._zod.def, catchall: void 0 }), e.extend = (r) => cb(e, r), e.safeExtend = (r) => lb(e, r), e.merge = (r) => db(e, r), e.pick = (r) => ib(e, r), e.omit = (r) => ub(e, r), e.partial = (...r) => fb(Xh, e, r[0]), e.required = (...r) => pb(Qh, e, r[0]);
});
function R(e, t) {
  const r = {
    type: "object",
    shape: e ?? {},
    ...re(t)
  };
  return new eS(r);
}
const Yh = /* @__PURE__ */ z("ZodUnion", (e, t) => {
  Gh.init(e, t), be.init(e, t), e.options = t.options;
});
function _e(e, t) {
  return new Yh({
    type: "union",
    options: e,
    ...re(t)
  });
}
const tS = /* @__PURE__ */ z("ZodDiscriminatedUnion", (e, t) => {
  Yh.init(e, t), Ww.init(e, t);
});
function Me(e, t, r) {
  return new tS({
    type: "union",
    options: t,
    discriminator: e,
    ...re(r)
  });
}
const rS = /* @__PURE__ */ z("ZodIntersection", (e, t) => {
  Jw.init(e, t), be.init(e, t);
});
function nS(e, t) {
  return new rS({
    type: "intersection",
    left: e,
    right: t
  });
}
const oS = /* @__PURE__ */ z("ZodRecord", (e, t) => {
  Kw.init(e, t), be.init(e, t), e.keyType = t.keyType, e.valueType = t.valueType;
});
function Ce(e, t, r) {
  return new oS({
    type: "record",
    keyType: e,
    valueType: t,
    ...re(r)
  });
}
const gi = /* @__PURE__ */ z("ZodEnum", (e, t) => {
  Yw.init(e, t), be.init(e, t), e.enum = t.entries, e.options = Object.values(t.entries);
  const r = new Set(Object.keys(t.entries));
  e.extract = (n, o) => {
    const a = {};
    for (const s of n)
      if (r.has(s))
        a[s] = t.entries[s];
      else
        throw new Error(`Key ${s} not found in enum`);
    return new gi({
      ...t,
      checks: [],
      ...re(o),
      entries: a
    });
  }, e.exclude = (n, o) => {
    const a = { ...t.entries };
    for (const s of n)
      if (r.has(s))
        delete a[s];
      else
        throw new Error(`Key ${s} not found in enum`);
    return new gi({
      ...t,
      checks: [],
      ...re(o),
      entries: a
    });
  };
});
function Ee(e, t) {
  const r = Array.isArray(e) ? Object.fromEntries(e.map((n) => [n, n])) : e;
  return new gi({
    type: "enum",
    entries: r,
    ...re(t)
  });
}
const aS = /* @__PURE__ */ z("ZodLiteral", (e, t) => {
  Xw.init(e, t), be.init(e, t), e.values = new Set(t.values), Object.defineProperty(e, "value", {
    get() {
      if (t.values.length > 1)
        throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
      return t.values[0];
    }
  });
});
function Z(e, t) {
  return new aS({
    type: "literal",
    values: Array.isArray(e) ? e : [e],
    ...re(t)
  });
}
const sS = /* @__PURE__ */ z("ZodTransform", (e, t) => {
  Qw.init(e, t), be.init(e, t), e._zod.parse = (r, n) => {
    if (n.direction === "backward")
      throw new Oh(e.constructor.name);
    r.addIssue = (a) => {
      if (typeof a == "string")
        r.issues.push(Rn(a, r.value, t));
      else {
        const s = a;
        s.fatal && (s.continue = !1), s.code ?? (s.code = "custom"), s.input ?? (s.input = r.value), s.inst ?? (s.inst = e), r.issues.push(Rn(s));
      }
    };
    const o = t.transform(r.value, r);
    return o instanceof Promise ? o.then((a) => (r.value = a, r)) : (r.value = o, r);
  };
});
function iS(e) {
  return new sS({
    type: "transform",
    transform: e
  });
}
const Xh = /* @__PURE__ */ z("ZodOptional", (e, t) => {
  eE.init(e, t), be.init(e, t), e.unwrap = () => e._zod.def.innerType;
});
function yd(e) {
  return new Xh({
    type: "optional",
    innerType: e
  });
}
const uS = /* @__PURE__ */ z("ZodNullable", (e, t) => {
  tE.init(e, t), be.init(e, t), e.unwrap = () => e._zod.def.innerType;
});
function vd(e) {
  return new uS({
    type: "nullable",
    innerType: e
  });
}
const cS = /* @__PURE__ */ z("ZodDefault", (e, t) => {
  rE.init(e, t), be.init(e, t), e.unwrap = () => e._zod.def.innerType, e.removeDefault = e.unwrap;
});
function lS(e, t) {
  return new cS({
    type: "default",
    innerType: e,
    get defaultValue() {
      return typeof t == "function" ? t() : Nh(t);
    }
  });
}
const dS = /* @__PURE__ */ z("ZodPrefault", (e, t) => {
  nE.init(e, t), be.init(e, t), e.unwrap = () => e._zod.def.innerType;
});
function fS(e, t) {
  return new dS({
    type: "prefault",
    innerType: e,
    get defaultValue() {
      return typeof t == "function" ? t() : Nh(t);
    }
  });
}
const Qh = /* @__PURE__ */ z("ZodNonOptional", (e, t) => {
  oE.init(e, t), be.init(e, t), e.unwrap = () => e._zod.def.innerType;
});
function pS(e, t) {
  return new Qh({
    type: "nonoptional",
    innerType: e,
    ...re(t)
  });
}
const hS = /* @__PURE__ */ z("ZodCatch", (e, t) => {
  aE.init(e, t), be.init(e, t), e.unwrap = () => e._zod.def.innerType, e.removeCatch = e.unwrap;
});
function mS(e, t) {
  return new hS({
    type: "catch",
    innerType: e,
    catchValue: typeof t == "function" ? t : () => t
  });
}
const gS = /* @__PURE__ */ z("ZodPipe", (e, t) => {
  sE.init(e, t), be.init(e, t), e.in = t.in, e.out = t.out;
});
function _d(e, t) {
  return new gS({
    type: "pipe",
    in: e,
    out: t
    // ...util.normalizeParams(params),
  });
}
const yS = /* @__PURE__ */ z("ZodReadonly", (e, t) => {
  iE.init(e, t), be.init(e, t), e.unwrap = () => e._zod.def.innerType;
});
function vS(e) {
  return new yS({
    type: "readonly",
    innerType: e
  });
}
const _S = /* @__PURE__ */ z("ZodLazy", (e, t) => {
  uE.init(e, t), be.init(e, t), e.unwrap = () => e._zod.def.getter();
});
function em(e) {
  return new _S({
    type: "lazy",
    getter: e
  });
}
const Fi = /* @__PURE__ */ z("ZodCustom", (e, t) => {
  cE.init(e, t), be.init(e, t);
});
function bS(e, t) {
  return r$(Fi, e ?? (() => !0), t);
}
function wS(e, t = {}) {
  return n$(Fi, e, t);
}
function ES(e) {
  return o$(e);
}
function ra(e, t = {
  error: `Input not instance of ${e.name}`
}) {
  const r = new Fi({
    type: "custom",
    check: "custom",
    fn: (n) => n instanceof e,
    abort: !0,
    ...re(t)
  });
  return r._zod.bag.Class = e, r;
}
function $S(e) {
  return qE(Ui, e);
}
var Pn;
(function(e) {
  e.assertEqual = (o) => {
  };
  function t(o) {
  }
  e.assertIs = t;
  function r(o) {
    throw new Error();
  }
  e.assertNever = r, e.arrayToEnum = (o) => {
    const a = {};
    for (const s of o)
      a[s] = s;
    return a;
  }, e.getValidEnumValues = (o) => {
    const a = e.objectKeys(o).filter((i) => typeof o[o[i]] != "number"), s = {};
    for (const i of a)
      s[i] = o[i];
    return e.objectValues(s);
  }, e.objectValues = (o) => e.objectKeys(o).map(function(a) {
    return o[a];
  }), e.objectKeys = typeof Object.keys == "function" ? (o) => Object.keys(o) : (o) => {
    const a = [];
    for (const s in o)
      Object.prototype.hasOwnProperty.call(o, s) && a.push(s);
    return a;
  }, e.find = (o, a) => {
    for (const s of o)
      if (a(s))
        return s;
  }, e.isInteger = typeof Number.isInteger == "function" ? (o) => Number.isInteger(o) : (o) => typeof o == "number" && Number.isFinite(o) && Math.floor(o) === o;
  function n(o, a = " | ") {
    return o.map((s) => typeof s == "string" ? `'${s}'` : s).join(a);
  }
  e.joinValues = n, e.jsonStringifyReplacer = (o, a) => typeof a == "bigint" ? a.toString() : a;
})(Pn || (Pn = {}));
var bd;
(function(e) {
  e.mergeShapes = (t, r) => ({
    ...t,
    ...r
    // second overwrites first
  });
})(bd || (bd = {}));
Pn.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
Pn.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
class na extends Error {
  get errors() {
    return this.issues;
  }
  constructor(t) {
    super(), this.issues = [], this.addIssue = (n) => {
      this.issues = [...this.issues, n];
    }, this.addIssues = (n = []) => {
      this.issues = [...this.issues, ...n];
    };
    const r = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, r) : this.__proto__ = r, this.name = "ZodError", this.issues = t;
  }
  format(t) {
    const r = t || function(a) {
      return a.message;
    }, n = { _errors: [] }, o = (a) => {
      for (const s of a.issues)
        if (s.code === "invalid_union")
          s.unionErrors.map(o);
        else if (s.code === "invalid_return_type")
          o(s.returnTypeError);
        else if (s.code === "invalid_arguments")
          o(s.argumentsError);
        else if (s.path.length === 0)
          n._errors.push(r(s));
        else {
          let i = n, u = 0;
          for (; u < s.path.length; ) {
            const c = s.path[u];
            u === s.path.length - 1 ? (i[c] = i[c] || { _errors: [] }, i[c]._errors.push(r(s))) : i[c] = i[c] || { _errors: [] }, i = i[c], u++;
          }
        }
    };
    return o(this), n;
  }
  static assert(t) {
    if (!(t instanceof na))
      throw new Error(`Not a ZodError: ${t}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, Pn.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(t = (r) => r.message) {
    const r = /* @__PURE__ */ Object.create(null), n = [];
    for (const o of this.issues)
      if (o.path.length > 0) {
        const a = o.path[0];
        r[a] = r[a] || [], r[a].push(t(o));
      } else
        n.push(t(o));
    return { formErrors: n, fieldErrors: r };
  }
  get formErrors() {
    return this.flatten();
  }
}
na.create = (e) => new na(e);
var wd;
(function(e) {
  e.errToObj = (t) => typeof t == "string" ? { message: t } : t || {}, e.toString = (t) => typeof t == "string" ? t : t == null ? void 0 : t.message;
})(wd || (wd = {}));
var oe;
(function(e) {
  e.ZodString = "ZodString", e.ZodNumber = "ZodNumber", e.ZodNaN = "ZodNaN", e.ZodBigInt = "ZodBigInt", e.ZodBoolean = "ZodBoolean", e.ZodDate = "ZodDate", e.ZodSymbol = "ZodSymbol", e.ZodUndefined = "ZodUndefined", e.ZodNull = "ZodNull", e.ZodAny = "ZodAny", e.ZodUnknown = "ZodUnknown", e.ZodNever = "ZodNever", e.ZodVoid = "ZodVoid", e.ZodArray = "ZodArray", e.ZodObject = "ZodObject", e.ZodUnion = "ZodUnion", e.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", e.ZodIntersection = "ZodIntersection", e.ZodTuple = "ZodTuple", e.ZodRecord = "ZodRecord", e.ZodMap = "ZodMap", e.ZodSet = "ZodSet", e.ZodFunction = "ZodFunction", e.ZodLazy = "ZodLazy", e.ZodLiteral = "ZodLiteral", e.ZodEnum = "ZodEnum", e.ZodEffects = "ZodEffects", e.ZodNativeEnum = "ZodNativeEnum", e.ZodOptional = "ZodOptional", e.ZodNullable = "ZodNullable", e.ZodDefault = "ZodDefault", e.ZodCatch = "ZodCatch", e.ZodPromise = "ZodPromise", e.ZodBranded = "ZodBranded", e.ZodPipeline = "ZodPipeline", e.ZodReadonly = "ZodReadonly";
})(oe || (oe = {}));
function Je(...e) {
  return e.reduce(
    (t, r) => ({
      ...t,
      ...r ?? {}
    }),
    {}
  );
}
async function SS(e, t) {
  if (e == null)
    return Promise.resolve();
  const r = t == null ? void 0 : t.abortSignal;
  return new Promise((n, o) => {
    if (r != null && r.aborted) {
      o(Ed());
      return;
    }
    const a = setTimeout(() => {
      s(), n();
    }, e), s = () => {
      clearTimeout(a), r == null || r.removeEventListener("abort", i);
    }, i = () => {
      s(), o(Ed());
    };
    r == null || r.addEventListener("abort", i);
  });
}
function Ed() {
  return new DOMException("Delay was aborted", "AbortError");
}
function Mr(e) {
  return Object.fromEntries([...e.headers]);
}
var xn = ({
  prefix: e,
  size: t = 16,
  alphabet: r = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  separator: n = "-"
} = {}) => {
  const o = () => {
    const a = r.length, s = new Array(t);
    for (let i = 0; i < t; i++)
      s[i] = r[Math.random() * a | 0];
    return s.join("");
  };
  if (e == null)
    return o;
  if (r.includes(n))
    throw new ah({
      argument: "separator",
      message: `The separator "${n}" must not be part of the alphabet "${r}".`
    });
  return () => `${e}${n}${o()}`;
}, kt = xn();
function tm(e) {
  return e == null ? "unknown error" : typeof e == "string" ? e : e instanceof Error ? e.message : JSON.stringify(e);
}
function Ar(e) {
  return (e instanceof Error || e instanceof DOMException) && (e.name === "AbortError" || e.name === "ResponseAborted" || // Next.js
  e.name === "TimeoutError");
}
var IS = ["fetch failed", "failed to fetch"];
function rm({
  error: e,
  url: t,
  requestBodyValues: r
}) {
  if (Ar(e))
    return e;
  if (e instanceof TypeError && IS.includes(e.message.toLowerCase())) {
    const n = e.cause;
    if (n != null)
      return new Ae({
        message: `Cannot connect to API: ${n.message}`,
        cause: n,
        url: t,
        requestBodyValues: r,
        isRetryable: !0
        // retry when network error
      });
  }
  return e;
}
function Zi(e = globalThis) {
  var t, r, n;
  return e.window ? "runtime/browser" : (t = e.navigator) != null && t.userAgent ? `runtime/${e.navigator.userAgent.toLowerCase()}` : (n = (r = e.process) == null ? void 0 : r.versions) != null && n.node ? `runtime/node.js/${e.process.version.substring(0)}` : e.EdgeRuntime ? "runtime/vercel-edge" : "runtime/unknown";
}
function TS(e) {
  if (e == null)
    return {};
  const t = {};
  if (e instanceof Headers)
    e.forEach((r, n) => {
      t[n.toLowerCase()] = r;
    });
  else {
    Array.isArray(e) || (e = Object.entries(e));
    for (const [r, n] of e)
      n != null && (t[r.toLowerCase()] = n);
  }
  return t;
}
function xr(e, ...t) {
  const r = new Headers(TS(e)), n = r.get("user-agent") || "";
  return r.set(
    "user-agent",
    [n, ...t].filter(Boolean).join(" ")
  ), Object.fromEntries(r.entries());
}
var nm = "3.0.17", OS = () => globalThis.fetch, $d = async ({
  url: e,
  headers: t = {},
  successfulResponseHandler: r,
  failedResponseHandler: n,
  abortSignal: o,
  fetch: a = OS()
}) => {
  try {
    const s = await a(e, {
      method: "GET",
      headers: xr(
        t,
        `ai-sdk/provider-utils/${nm}`,
        Zi()
      ),
      signal: o
    }), i = Mr(s);
    if (!s.ok) {
      let u;
      try {
        u = await n({
          response: s,
          url: e,
          requestBodyValues: {}
        });
      } catch (c) {
        throw Ar(c) || Ae.isInstance(c) ? c : new Ae({
          message: "Failed to process error response",
          cause: c,
          statusCode: s.status,
          url: e,
          responseHeaders: i,
          requestBodyValues: {}
        });
      }
      throw u.value;
    }
    try {
      return await r({
        response: s,
        url: e,
        requestBodyValues: {}
      });
    } catch (u) {
      throw u instanceof Error && (Ar(u) || Ae.isInstance(u)) ? u : new Ae({
        message: "Failed to process successful response",
        cause: u,
        statusCode: s.status,
        url: e,
        responseHeaders: i,
        requestBodyValues: {}
      });
    }
  } catch (s) {
    throw rm({ error: s, url: e, requestBodyValues: {} });
  }
};
function RS({
  mediaType: e,
  url: t,
  supportedUrls: r
}) {
  return t = t.toLowerCase(), e = e.toLowerCase(), Object.entries(r).map(([n, o]) => {
    const a = n.toLowerCase();
    return a === "*" || a === "*/*" ? { mediaTypePrefix: "", regexes: o } : { mediaTypePrefix: a.replace(/\*/, ""), regexes: o };
  }).filter(({ mediaTypePrefix: n }) => e.startsWith(n)).flatMap(({ regexes: n }) => n).some((n) => n.test(t));
}
function PS({
  apiKey: e,
  environmentVariableName: t,
  apiKeyParameterName: r = "apiKey",
  description: n
}) {
  if (typeof e == "string")
    return e;
  if (e != null)
    throw new Uo({
      message: `${n} API key must be a string.`
    });
  if (typeof process > "u")
    throw new Uo({
      message: `${n} API key is missing. Pass it using the '${r}' parameter. Environment variables is not supported in this environment.`
    });
  if (e = process.env[t], e == null)
    throw new Uo({
      message: `${n} API key is missing. Pass it using the '${r}' parameter or the ${t} environment variable.`
    });
  if (typeof e != "string")
    throw new Uo({
      message: `${n} API key must be a string. The value of the ${t} environment variable is not a string.`
    });
  return e;
}
function In({
  settingValue: e,
  environmentVariableName: t
}) {
  if (typeof e == "string")
    return e;
  if (!(e != null || typeof process > "u") && (e = process.env[t], !(e == null || typeof e != "string")))
    return e;
}
function kS(e) {
  var t;
  const [r, n = ""] = e.toLowerCase().split("/");
  return (t = {
    mpeg: "mp3",
    "x-wav": "wav",
    opus: "ogg",
    mp4: "m4a",
    "x-m4a": "m4a"
  }[n]) != null ? t : n;
}
var NS = /"__proto__"\s*:/, AS = /"constructor"\s*:/;
function Sd(e) {
  const t = JSON.parse(e);
  return t === null || typeof t != "object" || NS.test(e) === !1 && AS.test(e) === !1 ? t : CS(t);
}
function CS(e) {
  let t = [e];
  for (; t.length; ) {
    const r = t;
    t = [];
    for (const n of r) {
      if (Object.prototype.hasOwnProperty.call(n, "__proto__"))
        throw new SyntaxError("Object contains forbidden prototype property");
      if (Object.prototype.hasOwnProperty.call(n, "constructor") && Object.prototype.hasOwnProperty.call(n.constructor, "prototype"))
        throw new SyntaxError("Object contains forbidden prototype property");
      for (const o in n) {
        const a = n[o];
        a && typeof a == "object" && t.push(a);
      }
    }
  }
  return e;
}
function Gi(e) {
  const { stackTraceLimit: t } = Error;
  try {
    Error.stackTraceLimit = 0;
  } catch {
    return Sd(e);
  }
  try {
    return Sd(e);
  } finally {
    Error.stackTraceLimit = t;
  }
}
var oa = Symbol.for("vercel.ai.validator");
function jS(e) {
  return { [oa]: !0, validate: e };
}
function MS(e) {
  return typeof e == "object" && e !== null && oa in e && e[oa] === !0 && "validate" in e;
}
function Oe(e) {
  let t;
  return () => (t == null && (t = e()), t);
}
function xS(e) {
  return MS(e) ? e : typeof e == "function" ? e() : DS(e);
}
function DS(e) {
  return jS(async (t) => {
    const r = await e["~standard"].validate(t);
    return r.issues == null ? { success: !0, value: r.value } : {
      success: !1,
      error: new Tn({
        value: t,
        cause: r.issues
      })
    };
  });
}
async function Ut({
  value: e,
  schema: t
}) {
  const r = await Ct({ value: e, schema: t });
  if (!r.success)
    throw Tn.wrap({ value: e, cause: r.error });
  return r.value;
}
async function Ct({
  value: e,
  schema: t
}) {
  const r = xS(t);
  try {
    if (r.validate == null)
      return { success: !0, value: e, rawValue: e };
    const n = await r.validate(e);
    return n.success ? { success: !0, value: n.value, rawValue: e } : {
      success: !1,
      error: Tn.wrap({ value: e, cause: n.error }),
      rawValue: e
    };
  } catch (n) {
    return {
      success: !1,
      error: Tn.wrap({ value: e, cause: n }),
      rawValue: e
    };
  }
}
async function qS({
  text: e,
  schema: t
}) {
  try {
    const r = Gi(e);
    return t == null ? r : Ut({ value: r, schema: t });
  } catch (r) {
    throw Qo.isInstance(r) || Tn.isInstance(r) ? r : new Qo({ text: e, cause: r });
  }
}
async function cr({
  text: e,
  schema: t
}) {
  try {
    const r = Gi(e);
    return t == null ? { success: !0, value: r, rawValue: r } : await Ct({ value: r, schema: t });
  } catch (r) {
    return {
      success: !1,
      error: Qo.isInstance(r) ? r : new Qo({ text: e, cause: r }),
      rawValue: void 0
    };
  }
}
function Id(e) {
  try {
    return Gi(e), !0;
  } catch {
    return !1;
  }
}
function LS({
  stream: e,
  schema: t
}) {
  return e.pipeThrough(new TextDecoderStream()).pipeThrough(new tb()).pipeThrough(
    new TransformStream({
      async transform({ data: r }, n) {
        r !== "[DONE]" && n.enqueue(await cr({ text: r, schema: t }));
      }
    })
  );
}
async function Bt({
  provider: e,
  providerOptions: t,
  schema: r
}) {
  if ((t == null ? void 0 : t[e]) == null)
    return;
  const n = await Ct({
    value: t[e],
    schema: r
  });
  if (!n.success)
    throw new ah({
      argument: "providerOptions",
      message: `invalid ${e} provider options`,
      cause: n.error
    });
  return n.value;
}
var zS = () => globalThis.fetch, et = async ({
  url: e,
  headers: t,
  body: r,
  failedResponseHandler: n,
  successfulResponseHandler: o,
  abortSignal: a,
  fetch: s
}) => om({
  url: e,
  headers: {
    "Content-Type": "application/json",
    ...t
  },
  body: {
    content: JSON.stringify(r),
    values: r
  },
  failedResponseHandler: n,
  successfulResponseHandler: o,
  abortSignal: a,
  fetch: s
}), VS = async ({
  url: e,
  headers: t,
  formData: r,
  failedResponseHandler: n,
  successfulResponseHandler: o,
  abortSignal: a,
  fetch: s
}) => om({
  url: e,
  headers: t,
  body: {
    content: r,
    values: Object.fromEntries(r.entries())
  },
  failedResponseHandler: n,
  successfulResponseHandler: o,
  abortSignal: a,
  fetch: s
}), om = async ({
  url: e,
  headers: t = {},
  body: r,
  successfulResponseHandler: n,
  failedResponseHandler: o,
  abortSignal: a,
  fetch: s = zS()
}) => {
  try {
    const i = await s(e, {
      method: "POST",
      headers: xr(
        t,
        `ai-sdk/provider-utils/${nm}`,
        Zi()
      ),
      body: r.content,
      signal: a
    }), u = Mr(i);
    if (!i.ok) {
      let c;
      try {
        c = await o({
          response: i,
          url: e,
          requestBodyValues: r.values
        });
      } catch (l) {
        throw Ar(l) || Ae.isInstance(l) ? l : new Ae({
          message: "Failed to process error response",
          cause: l,
          statusCode: i.status,
          url: e,
          responseHeaders: u,
          requestBodyValues: r.values
        });
      }
      throw c.value;
    }
    try {
      return await n({
        response: i,
        url: e,
        requestBodyValues: r.values
      });
    } catch (c) {
      throw c instanceof Error && (Ar(c) || Ae.isInstance(c)) ? c : new Ae({
        message: "Failed to process successful response",
        cause: c,
        statusCode: i.status,
        url: e,
        responseHeaders: u,
        requestBodyValues: r.values
      });
    }
  } catch (i) {
    throw rm({ error: i, url: e, requestBodyValues: r.values });
  }
};
function Dr({
  id: e,
  name: t,
  inputSchema: r,
  outputSchema: n
}) {
  return ({
    execute: o,
    toModelOutput: a,
    onInputStart: s,
    onInputDelta: i,
    onInputAvailable: u,
    ...c
  }) => ({
    type: "provider-defined",
    id: e,
    name: t,
    args: c,
    inputSchema: r,
    outputSchema: n,
    execute: o,
    toModelOutput: a,
    onInputStart: s,
    onInputDelta: i,
    onInputAvailable: u
  });
}
async function vt(e) {
  return typeof e == "function" && (e = e()), Promise.resolve(e);
}
var lr = ({
  errorSchema: e,
  errorToMessage: t,
  isRetryable: r
}) => async ({ response: n, url: o, requestBodyValues: a }) => {
  const s = await n.text(), i = Mr(n);
  if (s.trim() === "")
    return {
      responseHeaders: i,
      value: new Ae({
        message: n.statusText,
        url: o,
        requestBodyValues: a,
        statusCode: n.status,
        responseHeaders: i,
        responseBody: s,
        isRetryable: r == null ? void 0 : r(n)
      })
    };
  try {
    const u = await qS({
      text: s,
      schema: e
    });
    return {
      responseHeaders: i,
      value: new Ae({
        message: t(u),
        url: o,
        requestBodyValues: a,
        statusCode: n.status,
        responseHeaders: i,
        responseBody: s,
        data: u,
        isRetryable: r == null ? void 0 : r(n, u)
      })
    };
  } catch {
    return {
      responseHeaders: i,
      value: new Ae({
        message: n.statusText,
        url: o,
        requestBodyValues: a,
        statusCode: n.status,
        responseHeaders: i,
        responseBody: s,
        isRetryable: r == null ? void 0 : r(n)
      })
    };
  }
}, wa = (e) => async ({ response: t }) => {
  const r = Mr(t);
  if (t.body == null)
    throw new U0({});
  return {
    responseHeaders: r,
    value: LS({
      stream: t.body,
      schema: e
    })
  };
}, ft = (e) => async ({ response: t, url: r, requestBodyValues: n }) => {
  const o = await t.text(), a = await cr({
    text: o,
    schema: e
  }), s = Mr(t);
  if (!a.success)
    throw new Ae({
      message: "Invalid JSON response",
      cause: a.error,
      statusCode: t.status,
      responseHeaders: s,
      responseBody: o,
      url: r,
      requestBodyValues: n
    });
  return {
    responseHeaders: s,
    value: a.value,
    rawValue: a.rawValue
  };
}, US = () => async ({ response: e, url: t, requestBodyValues: r }) => {
  const n = Mr(e);
  if (!e.body)
    throw new Ae({
      message: "Response body is empty",
      url: t,
      requestBodyValues: r,
      statusCode: e.status,
      responseHeaders: n,
      responseBody: void 0
    });
  try {
    const o = await e.arrayBuffer();
    return {
      responseHeaders: n,
      value: new Uint8Array(o)
    };
  } catch (o) {
    throw new Ae({
      message: "Failed to read response as array buffer",
      url: t,
      requestBodyValues: r,
      statusCode: e.status,
      responseHeaders: n,
      responseBody: void 0,
      cause: o
    });
  }
}, FS = (e, t) => {
  let r = 0;
  for (; r < e.length && r < t.length && e[r] === t[r]; r++)
    ;
  return [(e.length - r).toString(), ...t.slice(r)].join("/");
}, ZS = Symbol(
  "Let zodToJsonSchema decide on which parser to use"
), Td = {
  name: void 0,
  $refStrategy: "root",
  basePath: ["#"],
  effectStrategy: "input",
  pipeStrategy: "all",
  dateStrategy: "format:date-time",
  mapStrategy: "entries",
  removeAdditionalStrategy: "passthrough",
  allowedAdditionalProperties: !0,
  rejectedAdditionalProperties: !1,
  definitionPath: "definitions",
  strictUnions: !1,
  definitions: {},
  errorMessages: !1,
  patternStrategy: "escape",
  applyRegexFlags: !1,
  emailStrategy: "format:email",
  base64Strategy: "contentEncoding:base64",
  nameStrategy: "ref"
}, GS = (e) => typeof e == "string" ? {
  ...Td,
  name: e
} : {
  ...Td,
  ...e
};
function tt() {
  return {};
}
function BS(e, t) {
  var r, n, o;
  const a = {
    type: "array"
  };
  return (r = e.type) != null && r._def && ((o = (n = e.type) == null ? void 0 : n._def) == null ? void 0 : o.typeName) !== oe.ZodAny && (a.items = ye(e.type._def, {
    ...t,
    currentPath: [...t.currentPath, "items"]
  })), e.minLength && (a.minItems = e.minLength.value), e.maxLength && (a.maxItems = e.maxLength.value), e.exactLength && (a.minItems = e.exactLength.value, a.maxItems = e.exactLength.value), a;
}
function HS(e) {
  const t = {
    type: "integer",
    format: "int64"
  };
  if (!e.checks) return t;
  for (const r of e.checks)
    switch (r.kind) {
      case "min":
        r.inclusive ? t.minimum = r.value : t.exclusiveMinimum = r.value;
        break;
      case "max":
        r.inclusive ? t.maximum = r.value : t.exclusiveMaximum = r.value;
        break;
      case "multipleOf":
        t.multipleOf = r.value;
        break;
    }
  return t;
}
function WS() {
  return { type: "boolean" };
}
function am(e, t) {
  return ye(e.type._def, t);
}
var JS = (e, t) => ye(e.innerType._def, t);
function sm(e, t, r) {
  const n = r ?? t.dateStrategy;
  if (Array.isArray(n))
    return {
      anyOf: n.map((o, a) => sm(e, t, o))
    };
  switch (n) {
    case "string":
    case "format:date-time":
      return {
        type: "string",
        format: "date-time"
      };
    case "format:date":
      return {
        type: "string",
        format: "date"
      };
    case "integer":
      return KS(e);
  }
}
var KS = (e) => {
  const t = {
    type: "integer",
    format: "unix-time"
  };
  for (const r of e.checks)
    switch (r.kind) {
      case "min":
        t.minimum = r.value;
        break;
      case "max":
        t.maximum = r.value;
        break;
    }
  return t;
};
function YS(e, t) {
  return {
    ...ye(e.innerType._def, t),
    default: e.defaultValue()
  };
}
function XS(e, t) {
  return t.effectStrategy === "input" ? ye(e.schema._def, t) : tt();
}
function QS(e) {
  return {
    type: "string",
    enum: Array.from(e.values)
  };
}
var eI = (e) => "type" in e && e.type === "string" ? !1 : "allOf" in e;
function tI(e, t) {
  const r = [
    ye(e.left._def, {
      ...t,
      currentPath: [...t.currentPath, "allOf", "0"]
    }),
    ye(e.right._def, {
      ...t,
      currentPath: [...t.currentPath, "allOf", "1"]
    })
  ].filter((o) => !!o), n = [];
  return r.forEach((o) => {
    if (eI(o))
      n.push(...o.allOf);
    else {
      let a = o;
      if ("additionalProperties" in o && o.additionalProperties === !1) {
        const { additionalProperties: s, ...i } = o;
        a = i;
      }
      n.push(a);
    }
  }), n.length ? { allOf: n } : void 0;
}
function rI(e) {
  const t = typeof e.value;
  return t !== "bigint" && t !== "number" && t !== "boolean" && t !== "string" ? {
    type: Array.isArray(e.value) ? "array" : "object"
  } : {
    type: t === "bigint" ? "integer" : t,
    const: e.value
  };
}
var Hs = void 0, st = {
  /**
   * `c` was changed to `[cC]` to replicate /i flag
   */
  cuid: /^[cC][^\s-]{8,}$/,
  cuid2: /^[0-9a-z]+$/,
  ulid: /^[0-9A-HJKMNP-TV-Z]{26}$/,
  /**
   * `a-z` was added to replicate /i flag
   */
  email: /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_'+\-\.]*)[a-zA-Z0-9_+-]@([a-zA-Z0-9][a-zA-Z0-9\-]*\.)+[a-zA-Z]{2,}$/,
  /**
   * Constructed a valid Unicode RegExp
   *
   * Lazily instantiate since this type of regex isn't supported
   * in all envs (e.g. React Native).
   *
   * See:
   * https://github.com/colinhacks/zod/issues/2433
   * Fix in Zod:
   * https://github.com/colinhacks/zod/commit/9340fd51e48576a75adc919bff65dbc4a5d4c99b
   */
  emoji: () => (Hs === void 0 && (Hs = RegExp(
    "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$",
    "u"
  )), Hs),
  /**
   * Unused
   */
  uuid: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
  /**
   * Unused
   */
  ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
  ipv4Cidr: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,
  /**
   * Unused
   */
  ipv6: /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/,
  ipv6Cidr: /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
  base64: /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
  base64url: /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,
  nanoid: /^[a-zA-Z0-9_-]{21}$/,
  jwt: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/
};
function im(e, t) {
  const r = {
    type: "string"
  };
  if (e.checks)
    for (const n of e.checks)
      switch (n.kind) {
        case "min":
          r.minLength = typeof r.minLength == "number" ? Math.max(r.minLength, n.value) : n.value;
          break;
        case "max":
          r.maxLength = typeof r.maxLength == "number" ? Math.min(r.maxLength, n.value) : n.value;
          break;
        case "email":
          switch (t.emailStrategy) {
            case "format:email":
              it(r, "email", n.message, t);
              break;
            case "format:idn-email":
              it(r, "idn-email", n.message, t);
              break;
            case "pattern:zod":
              Ge(r, st.email, n.message, t);
              break;
          }
          break;
        case "url":
          it(r, "uri", n.message, t);
          break;
        case "uuid":
          it(r, "uuid", n.message, t);
          break;
        case "regex":
          Ge(r, n.regex, n.message, t);
          break;
        case "cuid":
          Ge(r, st.cuid, n.message, t);
          break;
        case "cuid2":
          Ge(r, st.cuid2, n.message, t);
          break;
        case "startsWith":
          Ge(
            r,
            RegExp(`^${Ws(n.value, t)}`),
            n.message,
            t
          );
          break;
        case "endsWith":
          Ge(
            r,
            RegExp(`${Ws(n.value, t)}$`),
            n.message,
            t
          );
          break;
        case "datetime":
          it(r, "date-time", n.message, t);
          break;
        case "date":
          it(r, "date", n.message, t);
          break;
        case "time":
          it(r, "time", n.message, t);
          break;
        case "duration":
          it(r, "duration", n.message, t);
          break;
        case "length":
          r.minLength = typeof r.minLength == "number" ? Math.max(r.minLength, n.value) : n.value, r.maxLength = typeof r.maxLength == "number" ? Math.min(r.maxLength, n.value) : n.value;
          break;
        case "includes": {
          Ge(
            r,
            RegExp(Ws(n.value, t)),
            n.message,
            t
          );
          break;
        }
        case "ip": {
          n.version !== "v6" && it(r, "ipv4", n.message, t), n.version !== "v4" && it(r, "ipv6", n.message, t);
          break;
        }
        case "base64url":
          Ge(r, st.base64url, n.message, t);
          break;
        case "jwt":
          Ge(r, st.jwt, n.message, t);
          break;
        case "cidr": {
          n.version !== "v6" && Ge(r, st.ipv4Cidr, n.message, t), n.version !== "v4" && Ge(r, st.ipv6Cidr, n.message, t);
          break;
        }
        case "emoji":
          Ge(r, st.emoji(), n.message, t);
          break;
        case "ulid": {
          Ge(r, st.ulid, n.message, t);
          break;
        }
        case "base64": {
          switch (t.base64Strategy) {
            case "format:binary": {
              it(r, "binary", n.message, t);
              break;
            }
            case "contentEncoding:base64": {
              r.contentEncoding = "base64";
              break;
            }
            case "pattern:zod": {
              Ge(r, st.base64, n.message, t);
              break;
            }
          }
          break;
        }
        case "nanoid":
          Ge(r, st.nanoid, n.message, t);
      }
  return r;
}
function Ws(e, t) {
  return t.patternStrategy === "escape" ? oI(e) : e;
}
var nI = new Set(
  "ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789"
);
function oI(e) {
  let t = "";
  for (let r = 0; r < e.length; r++)
    nI.has(e[r]) || (t += "\\"), t += e[r];
  return t;
}
function it(e, t, r, n) {
  var o;
  e.format || (o = e.anyOf) != null && o.some((a) => a.format) ? (e.anyOf || (e.anyOf = []), e.format && (e.anyOf.push({
    format: e.format
  }), delete e.format), e.anyOf.push({
    format: t,
    ...r && n.errorMessages && { errorMessage: { format: r } }
  })) : e.format = t;
}
function Ge(e, t, r, n) {
  var o;
  e.pattern || (o = e.allOf) != null && o.some((a) => a.pattern) ? (e.allOf || (e.allOf = []), e.pattern && (e.allOf.push({
    pattern: e.pattern
  }), delete e.pattern), e.allOf.push({
    pattern: Od(t, n),
    ...r && n.errorMessages && { errorMessage: { pattern: r } }
  })) : e.pattern = Od(t, n);
}
function Od(e, t) {
  var r;
  if (!t.applyRegexFlags || !e.flags)
    return e.source;
  const n = {
    i: e.flags.includes("i"),
    // Case-insensitive
    m: e.flags.includes("m"),
    // `^` and `$` matches adjacent to newline characters
    s: e.flags.includes("s")
    // `.` matches newlines
  }, o = n.i ? e.source.toLowerCase() : e.source;
  let a = "", s = !1, i = !1, u = !1;
  for (let c = 0; c < o.length; c++) {
    if (s) {
      a += o[c], s = !1;
      continue;
    }
    if (n.i) {
      if (i) {
        if (o[c].match(/[a-z]/)) {
          u ? (a += o[c], a += `${o[c - 2]}-${o[c]}`.toUpperCase(), u = !1) : o[c + 1] === "-" && ((r = o[c + 2]) != null && r.match(/[a-z]/)) ? (a += o[c], u = !0) : a += `${o[c]}${o[c].toUpperCase()}`;
          continue;
        }
      } else if (o[c].match(/[a-z]/)) {
        a += `[${o[c]}${o[c].toUpperCase()}]`;
        continue;
      }
    }
    if (n.m) {
      if (o[c] === "^") {
        a += `(^|(?<=[\r
]))`;
        continue;
      } else if (o[c] === "$") {
        a += `($|(?=[\r
]))`;
        continue;
      }
    }
    if (n.s && o[c] === ".") {
      a += i ? `${o[c]}\r
` : `[${o[c]}\r
]`;
      continue;
    }
    a += o[c], o[c] === "\\" ? s = !0 : i && o[c] === "]" ? i = !1 : !i && o[c] === "[" && (i = !0);
  }
  try {
    new RegExp(a);
  } catch {
    return console.warn(
      `Could not convert regex pattern at ${t.currentPath.join(
        "/"
      )} to a flag-independent form! Falling back to the flag-ignorant source`
    ), e.source;
  }
  return a;
}
function um(e, t) {
  var r, n, o, a, s, i;
  const u = {
    type: "object",
    additionalProperties: (r = ye(e.valueType._def, {
      ...t,
      currentPath: [...t.currentPath, "additionalProperties"]
    })) != null ? r : t.allowedAdditionalProperties
  };
  if (((n = e.keyType) == null ? void 0 : n._def.typeName) === oe.ZodString && ((o = e.keyType._def.checks) != null && o.length)) {
    const { type: c, ...l } = im(e.keyType._def, t);
    return {
      ...u,
      propertyNames: l
    };
  } else {
    if (((a = e.keyType) == null ? void 0 : a._def.typeName) === oe.ZodEnum)
      return {
        ...u,
        propertyNames: {
          enum: e.keyType._def.values
        }
      };
    if (((s = e.keyType) == null ? void 0 : s._def.typeName) === oe.ZodBranded && e.keyType._def.type._def.typeName === oe.ZodString && ((i = e.keyType._def.type._def.checks) != null && i.length)) {
      const { type: c, ...l } = am(
        e.keyType._def,
        t
      );
      return {
        ...u,
        propertyNames: l
      };
    }
  }
  return u;
}
function aI(e, t) {
  if (t.mapStrategy === "record")
    return um(e, t);
  const r = ye(e.keyType._def, {
    ...t,
    currentPath: [...t.currentPath, "items", "items", "0"]
  }) || tt(), n = ye(e.valueType._def, {
    ...t,
    currentPath: [...t.currentPath, "items", "items", "1"]
  }) || tt();
  return {
    type: "array",
    maxItems: 125,
    items: {
      type: "array",
      items: [r, n],
      minItems: 2,
      maxItems: 2
    }
  };
}
function sI(e) {
  const t = e.values, n = Object.keys(e.values).filter((a) => typeof t[t[a]] != "number").map((a) => t[a]), o = Array.from(
    new Set(n.map((a) => typeof a))
  );
  return {
    type: o.length === 1 ? o[0] === "string" ? "string" : "number" : ["string", "number"],
    enum: n
  };
}
function iI() {
  return { not: tt() };
}
function uI() {
  return {
    type: "null"
  };
}
var yi = {
  ZodString: "string",
  ZodNumber: "number",
  ZodBigInt: "integer",
  ZodBoolean: "boolean",
  ZodNull: "null"
};
function cI(e, t) {
  const r = e.options instanceof Map ? Array.from(e.options.values()) : e.options;
  if (r.every(
    (n) => n._def.typeName in yi && (!n._def.checks || !n._def.checks.length)
  )) {
    const n = r.reduce((o, a) => {
      const s = yi[a._def.typeName];
      return s && !o.includes(s) ? [...o, s] : o;
    }, []);
    return {
      type: n.length > 1 ? n : n[0]
    };
  } else if (r.every((n) => n._def.typeName === "ZodLiteral" && !n.description)) {
    const n = r.reduce(
      (o, a) => {
        const s = typeof a._def.value;
        switch (s) {
          case "string":
          case "number":
          case "boolean":
            return [...o, s];
          case "bigint":
            return [...o, "integer"];
          case "object":
            if (a._def.value === null) return [...o, "null"];
          case "symbol":
          case "undefined":
          case "function":
          default:
            return o;
        }
      },
      []
    );
    if (n.length === r.length) {
      const o = n.filter((a, s, i) => i.indexOf(a) === s);
      return {
        type: o.length > 1 ? o : o[0],
        enum: r.reduce(
          (a, s) => a.includes(s._def.value) ? a : [...a, s._def.value],
          []
        )
      };
    }
  } else if (r.every((n) => n._def.typeName === "ZodEnum"))
    return {
      type: "string",
      enum: r.reduce(
        (n, o) => [
          ...n,
          ...o._def.values.filter((a) => !n.includes(a))
        ],
        []
      )
    };
  return lI(e, t);
}
var lI = (e, t) => {
  const r = (e.options instanceof Map ? Array.from(e.options.values()) : e.options).map(
    (n, o) => ye(n._def, {
      ...t,
      currentPath: [...t.currentPath, "anyOf", `${o}`]
    })
  ).filter(
    (n) => !!n && (!t.strictUnions || typeof n == "object" && Object.keys(n).length > 0)
  );
  return r.length ? { anyOf: r } : void 0;
};
function dI(e, t) {
  if (["ZodString", "ZodNumber", "ZodBigInt", "ZodBoolean", "ZodNull"].includes(
    e.innerType._def.typeName
  ) && (!e.innerType._def.checks || !e.innerType._def.checks.length))
    return {
      type: [
        yi[e.innerType._def.typeName],
        "null"
      ]
    };
  const r = ye(e.innerType._def, {
    ...t,
    currentPath: [...t.currentPath, "anyOf", "0"]
  });
  return r && { anyOf: [r, { type: "null" }] };
}
function fI(e) {
  const t = {
    type: "number"
  };
  if (!e.checks) return t;
  for (const r of e.checks)
    switch (r.kind) {
      case "int":
        t.type = "integer";
        break;
      case "min":
        r.inclusive ? t.minimum = r.value : t.exclusiveMinimum = r.value;
        break;
      case "max":
        r.inclusive ? t.maximum = r.value : t.exclusiveMaximum = r.value;
        break;
      case "multipleOf":
        t.multipleOf = r.value;
        break;
    }
  return t;
}
function pI(e, t) {
  const r = {
    type: "object",
    properties: {}
  }, n = [], o = e.shape();
  for (const s in o) {
    let i = o[s];
    if (i === void 0 || i._def === void 0)
      continue;
    const u = mI(i), c = ye(i._def, {
      ...t,
      currentPath: [...t.currentPath, "properties", s],
      propertyPath: [...t.currentPath, "properties", s]
    });
    c !== void 0 && (r.properties[s] = c, u || n.push(s));
  }
  n.length && (r.required = n);
  const a = hI(e, t);
  return a !== void 0 && (r.additionalProperties = a), r;
}
function hI(e, t) {
  if (e.catchall._def.typeName !== "ZodNever")
    return ye(e.catchall._def, {
      ...t,
      currentPath: [...t.currentPath, "additionalProperties"]
    });
  switch (e.unknownKeys) {
    case "passthrough":
      return t.allowedAdditionalProperties;
    case "strict":
      return t.rejectedAdditionalProperties;
    case "strip":
      return t.removeAdditionalStrategy === "strict" ? t.allowedAdditionalProperties : t.rejectedAdditionalProperties;
  }
}
function mI(e) {
  try {
    return e.isOptional();
  } catch {
    return !0;
  }
}
var gI = (e, t) => {
  var r;
  if (t.currentPath.toString() === ((r = t.propertyPath) == null ? void 0 : r.toString()))
    return ye(e.innerType._def, t);
  const n = ye(e.innerType._def, {
    ...t,
    currentPath: [...t.currentPath, "anyOf", "1"]
  });
  return n ? { anyOf: [{ not: tt() }, n] } : tt();
}, yI = (e, t) => {
  if (t.pipeStrategy === "input")
    return ye(e.in._def, t);
  if (t.pipeStrategy === "output")
    return ye(e.out._def, t);
  const r = ye(e.in._def, {
    ...t,
    currentPath: [...t.currentPath, "allOf", "0"]
  }), n = ye(e.out._def, {
    ...t,
    currentPath: [...t.currentPath, "allOf", r ? "1" : "0"]
  });
  return {
    allOf: [r, n].filter((o) => o !== void 0)
  };
};
function vI(e, t) {
  return ye(e.type._def, t);
}
function _I(e, t) {
  const n = {
    type: "array",
    uniqueItems: !0,
    items: ye(e.valueType._def, {
      ...t,
      currentPath: [...t.currentPath, "items"]
    })
  };
  return e.minSize && (n.minItems = e.minSize.value), e.maxSize && (n.maxItems = e.maxSize.value), n;
}
function bI(e, t) {
  return e.rest ? {
    type: "array",
    minItems: e.items.length,
    items: e.items.map(
      (r, n) => ye(r._def, {
        ...t,
        currentPath: [...t.currentPath, "items", `${n}`]
      })
    ).reduce(
      (r, n) => n === void 0 ? r : [...r, n],
      []
    ),
    additionalItems: ye(e.rest._def, {
      ...t,
      currentPath: [...t.currentPath, "additionalItems"]
    })
  } : {
    type: "array",
    minItems: e.items.length,
    maxItems: e.items.length,
    items: e.items.map(
      (r, n) => ye(r._def, {
        ...t,
        currentPath: [...t.currentPath, "items", `${n}`]
      })
    ).reduce(
      (r, n) => n === void 0 ? r : [...r, n],
      []
    )
  };
}
function wI() {
  return {
    not: tt()
  };
}
function EI() {
  return tt();
}
var $I = (e, t) => ye(e.innerType._def, t), SI = (e, t, r) => {
  switch (t) {
    case oe.ZodString:
      return im(e, r);
    case oe.ZodNumber:
      return fI(e);
    case oe.ZodObject:
      return pI(e, r);
    case oe.ZodBigInt:
      return HS(e);
    case oe.ZodBoolean:
      return WS();
    case oe.ZodDate:
      return sm(e, r);
    case oe.ZodUndefined:
      return wI();
    case oe.ZodNull:
      return uI();
    case oe.ZodArray:
      return BS(e, r);
    case oe.ZodUnion:
    case oe.ZodDiscriminatedUnion:
      return cI(e, r);
    case oe.ZodIntersection:
      return tI(e, r);
    case oe.ZodTuple:
      return bI(e, r);
    case oe.ZodRecord:
      return um(e, r);
    case oe.ZodLiteral:
      return rI(e);
    case oe.ZodEnum:
      return QS(e);
    case oe.ZodNativeEnum:
      return sI(e);
    case oe.ZodNullable:
      return dI(e, r);
    case oe.ZodOptional:
      return gI(e, r);
    case oe.ZodMap:
      return aI(e, r);
    case oe.ZodSet:
      return _I(e, r);
    case oe.ZodLazy:
      return () => e.getter()._def;
    case oe.ZodPromise:
      return vI(e, r);
    case oe.ZodNaN:
    case oe.ZodNever:
      return iI();
    case oe.ZodEffects:
      return XS(e, r);
    case oe.ZodAny:
      return tt();
    case oe.ZodUnknown:
      return EI();
    case oe.ZodDefault:
      return YS(e, r);
    case oe.ZodBranded:
      return am(e, r);
    case oe.ZodReadonly:
      return $I(e, r);
    case oe.ZodCatch:
      return JS(e, r);
    case oe.ZodPipeline:
      return yI(e, r);
    case oe.ZodFunction:
    case oe.ZodVoid:
    case oe.ZodSymbol:
      return;
    default:
      return /* @__PURE__ */ ((n) => {
      })();
  }
};
function ye(e, t, r = !1) {
  var n;
  const o = t.seen.get(e);
  if (t.override) {
    const u = (n = t.override) == null ? void 0 : n.call(
      t,
      e,
      t,
      o,
      r
    );
    if (u !== ZS)
      return u;
  }
  if (o && !r) {
    const u = II(o, t);
    if (u !== void 0)
      return u;
  }
  const a = { def: e, path: t.currentPath, jsonSchema: void 0 };
  t.seen.set(e, a);
  const s = SI(e, e.typeName, t), i = typeof s == "function" ? ye(s(), t) : s;
  if (i && TI(e, t, i), t.postProcess) {
    const u = t.postProcess(i, e, t);
    return a.jsonSchema = i, u;
  }
  return a.jsonSchema = i, i;
}
var II = (e, t) => {
  switch (t.$refStrategy) {
    case "root":
      return { $ref: e.path.join("/") };
    case "relative":
      return { $ref: FS(t.currentPath, e.path) };
    case "none":
    case "seen":
      return e.path.length < t.currentPath.length && e.path.every((r, n) => t.currentPath[n] === r) ? (console.warn(
        `Recursive reference detected at ${t.currentPath.join(
          "/"
        )}! Defaulting to any`
      ), tt()) : t.$refStrategy === "seen" ? tt() : void 0;
  }
}, TI = (e, t, r) => (e.description && (r.description = e.description), r), OI = (e) => {
  const t = GS(e), r = t.name !== void 0 ? [...t.basePath, t.definitionPath, t.name] : t.basePath;
  return {
    ...t,
    currentPath: r,
    propertyPath: void 0,
    seen: new Map(
      Object.entries(t.definitions).map(([n, o]) => [
        o._def,
        {
          def: o._def,
          path: [...t.basePath, t.definitionPath, n],
          // Resolution of references will be forced even though seen, so it's ok that the schema is undefined here for now.
          jsonSchema: void 0
        }
      ])
    )
  };
}, RI = (e, t) => {
  var r;
  const n = OI(t);
  let o = typeof t == "object" && t.definitions ? Object.entries(t.definitions).reduce(
    (c, [l, y]) => {
      var d;
      return {
        ...c,
        [l]: (d = ye(
          y._def,
          {
            ...n,
            currentPath: [...n.basePath, n.definitionPath, l]
          },
          !0
        )) != null ? d : tt()
      };
    },
    {}
  ) : void 0;
  const a = typeof t == "string" ? t : (t == null ? void 0 : t.nameStrategy) === "title" || t == null ? void 0 : t.name, s = (r = ye(
    e._def,
    a === void 0 ? n : {
      ...n,
      currentPath: [...n.basePath, n.definitionPath, a]
    },
    !1
  )) != null ? r : tt(), i = typeof t == "object" && t.name !== void 0 && t.nameStrategy === "title" ? t.name : void 0;
  i !== void 0 && (s.title = i);
  const u = a === void 0 ? o ? {
    ...s,
    [n.definitionPath]: o
  } : s : {
    $ref: [
      ...n.$refStrategy === "relative" ? [] : n.basePath,
      n.definitionPath,
      a
    ].join("/"),
    [n.definitionPath]: {
      ...o,
      [a]: s
    }
  };
  return u.$schema = "http://json-schema.org/draft-07/schema#", u;
}, PI = RI;
function kI(e, t) {
  var r;
  const n = (r = void 0) != null ? r : !1;
  return Bi(
    // defer json schema creation to avoid unnecessary computation when only validation is needed
    () => PI(e, {
      $refStrategy: n ? "root" : "none"
    }),
    {
      validate: async (o) => {
        const a = await e.safeParseAsync(o);
        return a.success ? { success: !0, value: a.data } : { success: !1, error: a.error };
      }
    }
  );
}
function NI(e, t) {
  var r;
  const n = (r = void 0) != null ? r : !1;
  return Bi(
    // defer json schema creation to avoid unnecessary computation when only validation is needed
    () => s$(e, {
      target: "draft-7",
      io: "output",
      reused: n ? "ref" : "inline"
    }),
    {
      validate: async (o) => {
        const a = await Jh(e, o);
        return a.success ? { success: !0, value: a.data } : { success: !1, error: a.error };
      }
    }
  );
}
function AI(e) {
  return "_zod" in e;
}
function de(e, t) {
  return AI(e) ? NI(e) : kI(e);
}
var vi = Symbol.for("vercel.ai.schema");
function Ve(e) {
  let t;
  return () => (t == null && (t = e()), t);
}
function Bi(e, {
  validate: t
} = {}) {
  return {
    [vi]: !0,
    _type: void 0,
    // should never be used directly
    [oa]: !0,
    get jsonSchema() {
      return typeof e == "function" && (e = e()), e;
    },
    validate: t
  };
}
function CI(e) {
  return typeof e == "object" && e !== null && vi in e && e[vi] === !0 && "jsonSchema" in e && "validate" in e;
}
function Ea(e) {
  return e == null ? Bi({
    properties: {},
    additionalProperties: !1
  }) : CI(e) ? e : typeof e == "function" ? e() : de(e);
}
var { btoa: jI, atob: MI } = globalThis;
function $a(e) {
  const t = e.replace(/-/g, "+").replace(/_/g, "/"), r = MI(t);
  return Uint8Array.from(r, (n) => n.codePointAt(0));
}
function aa(e) {
  let t = "";
  for (let r = 0; r < e.length; r++)
    t += String.fromCodePoint(e[r]);
  return jI(t);
}
function Or(e) {
  return e instanceof Uint8Array ? aa(e) : e;
}
function cm(e) {
  return e == null ? void 0 : e.replace(/\/$/, "");
}
function xI(e) {
  return e != null && typeof e[Symbol.asyncIterator] == "function";
}
async function* DI({
  execute: e,
  input: t,
  options: r
}) {
  const n = e(t, r);
  if (xI(n)) {
    let o;
    for await (const a of n)
      o = a, yield { type: "preliminary", output: a };
    yield { type: "final", output: o };
  } else
    yield { type: "final", output: await n };
}
var Js, Rd;
function lm() {
  if (Rd) return Js;
  Rd = 1;
  var e = Object.defineProperty, t = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, n = Object.prototype.hasOwnProperty, o = (l, y) => {
    for (var d in y)
      e(l, d, { get: y[d], enumerable: !0 });
  }, a = (l, y, d, f) => {
    if (y && typeof y == "object" || typeof y == "function")
      for (let g of r(y))
        !n.call(l, g) && g !== d && e(l, g, { get: () => y[g], enumerable: !(f = t(y, g)) || f.enumerable });
    return l;
  }, s = (l) => a(e({}, "__esModule", { value: !0 }), l), i = {};
  o(i, {
    SYMBOL_FOR_REQ_CONTEXT: () => u,
    getContext: () => c
  }), Js = s(i);
  const u = Symbol.for("@vercel/request-context");
  function c() {
    var y, d;
    return ((d = (y = globalThis[u]) == null ? void 0 : y.get) == null ? void 0 : d.call(y)) ?? {};
  }
  return Js;
}
var Ks, Pd;
function qI() {
  if (Pd) return Ks;
  Pd = 1;
  var e = Object.defineProperty, t = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, n = Object.prototype.hasOwnProperty, o = (c, l) => {
    for (var y in l)
      e(c, y, { get: l[y], enumerable: !0 });
  }, a = (c, l, y, d) => {
    if (l && typeof l == "object" || typeof l == "function")
      for (let f of r(l))
        !n.call(c, f) && f !== y && e(c, f, { get: () => l[f], enumerable: !(d = t(l, f)) || d.enumerable });
    return c;
  }, s = (c) => a(e({}, "__esModule", { value: !0 }), c), i = {};
  o(i, {
    VercelOidcTokenError: () => u
  }), Ks = s(i);
  class u extends Error {
    constructor(l, y) {
      super(l), this.name = "VercelOidcTokenError", this.cause = y;
    }
    toString() {
      return this.cause ? `${this.name}: ${this.message}: ${this.cause}` : `${this.name}: ${this.message}`;
    }
  }
  return Ks;
}
var Ys, kd;
function LI() {
  if (kd) return Ys;
  kd = 1;
  var e = Object.defineProperty, t = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, n = Object.prototype.hasOwnProperty, o = (d, f) => {
    for (var g in f)
      e(d, g, { get: f[g], enumerable: !0 });
  }, a = (d, f, g, _) => {
    if (f && typeof f == "object" || typeof f == "function")
      for (let m of r(f))
        !n.call(d, m) && m !== g && e(d, m, { get: () => f[m], enumerable: !(_ = t(f, m)) || _.enumerable });
    return d;
  }, s = (d) => a(e({}, "__esModule", { value: !0 }), d), i = {};
  o(i, {
    getVercelOidcToken: () => l,
    getVercelOidcTokenSync: () => y
  }), Ys = s(i);
  var u = lm(), c = qI();
  async function l() {
    let d = "", f;
    try {
      d = y();
    } catch (g) {
      f = g;
    }
    try {
      const [{ getTokenPayload: g, isExpired: _ }, { refreshToken: m }] = await Promise.all([
        await import("./token-util-C43b8Ti6.js").then((h) => h.t),
        await import("./token-BynsaKa6.js").then((h) => h.t)
      ]);
      (!d || _(g(d))) && (await m(), d = y());
    } catch (g) {
      throw f != null && f.message && g instanceof Error && (g.message = `${f.message}
${g.message}`), new c.VercelOidcTokenError("Failed to refresh OIDC token", g);
    }
    return d;
  }
  function y() {
    var f;
    const d = ((f = (0, u.getContext)().headers) == null ? void 0 : f["x-vercel-oidc-token"]) ?? process.env.VERCEL_OIDC_TOKEN;
    if (!d)
      throw new Error(
        "The 'x-vercel-oidc-token' header is missing from the request. Do you have the OIDC option enabled in the Vercel project settings?"
      );
    return d;
  }
  return Ys;
}
var Xs, Nd;
function zI() {
  if (Nd) return Xs;
  Nd = 1;
  var e = Object.defineProperty, t = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, n = Object.prototype.hasOwnProperty, o = (l, y) => {
    for (var d in y)
      e(l, d, { get: y[d], enumerable: !0 });
  }, a = (l, y, d, f) => {
    if (y && typeof y == "object" || typeof y == "function")
      for (let g of r(y))
        !n.call(l, g) && g !== d && e(l, g, { get: () => y[g], enumerable: !(f = t(y, g)) || f.enumerable });
    return l;
  }, s = (l) => a(e({}, "__esModule", { value: !0 }), l), i = {};
  o(i, {
    getContext: () => c.getContext,
    getVercelOidcToken: () => u.getVercelOidcToken,
    getVercelOidcTokenSync: () => u.getVercelOidcTokenSync
  }), Xs = s(i);
  var u = LI(), c = lm();
  return Xs;
}
var dm = zI(), VI = "vercel.ai.gateway.error", Qs = Symbol.for(VI), Ad, Cd, rt = class fm extends (Cd = Error, Ad = Qs, Cd) {
  constructor({
    message: t,
    statusCode: r = 500,
    cause: n
  }) {
    super(t), this[Ad] = !0, this.statusCode = r, this.cause = n;
  }
  /**
   * Checks if the given error is a Gateway Error.
   * @param {unknown} error - The error to check.
   * @returns {boolean} True if the error is a Gateway Error, false otherwise.
   */
  static isInstance(t) {
    return fm.hasMarker(t);
  }
  static hasMarker(t) {
    return typeof t == "object" && t !== null && Qs in t && t[Qs] === !0;
  }
}, pm = "GatewayAuthenticationError", UI = `vercel.ai.gateway.error.${pm}`, jd = Symbol.for(UI), Md, xd, Hi = class hm extends (xd = rt, Md = jd, xd) {
  constructor({
    message: t = "Authentication failed",
    statusCode: r = 401,
    cause: n
  } = {}) {
    super({ message: t, statusCode: r, cause: n }), this[Md] = !0, this.name = pm, this.type = "authentication_error";
  }
  static isInstance(t) {
    return rt.hasMarker(t) && jd in t;
  }
  /**
   * Creates a contextual error message when authentication fails
   */
  static createContextualError({
    apiKeyProvided: t,
    oidcTokenProvided: r,
    message: n = "Authentication failed",
    statusCode: o = 401,
    cause: a
  }) {
    let s;
    return t ? s = `AI Gateway authentication failed: Invalid API key.

Create a new API key: https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%2Fapi-keys

Provide via 'apiKey' option or 'AI_GATEWAY_API_KEY' environment variable.` : r ? s = `AI Gateway authentication failed: Invalid OIDC token.

Run 'npx vercel link' to link your project, then 'vc env pull' to fetch the token.

Alternatively, use an API key: https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%2Fapi-keys` : s = `AI Gateway authentication failed: No authentication provided.

Option 1 - API key:
Create an API key: https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%2Fapi-keys
Provide via 'apiKey' option or 'AI_GATEWAY_API_KEY' environment variable.

Option 2 - OIDC token:
Run 'npx vercel link' to link your project, then 'vc env pull' to fetch the token.`, new hm({
      message: s,
      statusCode: o,
      cause: a
    });
  }
}, mm = "GatewayInvalidRequestError", FI = `vercel.ai.gateway.error.${mm}`, Dd = Symbol.for(FI), qd, Ld, ZI = class extends (Ld = rt, qd = Dd, Ld) {
  constructor({
    message: e = "Invalid request",
    statusCode: t = 400,
    cause: r
  } = {}) {
    super({ message: e, statusCode: t, cause: r }), this[qd] = !0, this.name = mm, this.type = "invalid_request_error";
  }
  static isInstance(e) {
    return rt.hasMarker(e) && Dd in e;
  }
}, gm = "GatewayRateLimitError", GI = `vercel.ai.gateway.error.${gm}`, zd = Symbol.for(GI), Vd, Ud, BI = class extends (Ud = rt, Vd = zd, Ud) {
  constructor({
    message: e = "Rate limit exceeded",
    statusCode: t = 429,
    cause: r
  } = {}) {
    super({ message: e, statusCode: t, cause: r }), this[Vd] = !0, this.name = gm, this.type = "rate_limit_exceeded";
  }
  static isInstance(e) {
    return rt.hasMarker(e) && zd in e;
  }
}, ym = "GatewayModelNotFoundError", HI = `vercel.ai.gateway.error.${ym}`, Fd = Symbol.for(HI), WI = Oe(
  () => de(
    R({
      modelId: T()
    })
  )
), Zd, Gd, vm = class extends (Gd = rt, Zd = Fd, Gd) {
  constructor({
    message: e = "Model not found",
    statusCode: t = 404,
    modelId: r,
    cause: n
  } = {}) {
    super({ message: e, statusCode: t, cause: n }), this[Zd] = !0, this.name = ym, this.type = "model_not_found", this.modelId = r;
  }
  static isInstance(e) {
    return rt.hasMarker(e) && Fd in e;
  }
}, _m = "GatewayInternalServerError", JI = `vercel.ai.gateway.error.${_m}`, Bd = Symbol.for(JI), Hd, Wd, Jd = class extends (Wd = rt, Hd = Bd, Wd) {
  constructor({
    message: e = "Internal server error",
    statusCode: t = 500,
    cause: r
  } = {}) {
    super({ message: e, statusCode: t, cause: r }), this[Hd] = !0, this.name = _m, this.type = "internal_server_error";
  }
  static isInstance(e) {
    return rt.hasMarker(e) && Bd in e;
  }
}, bm = "GatewayResponseError", KI = `vercel.ai.gateway.error.${bm}`, Kd = Symbol.for(KI), Yd, Xd, YI = class extends (Xd = rt, Yd = Kd, Xd) {
  constructor({
    message: e = "Invalid response from Gateway",
    statusCode: t = 502,
    response: r,
    validationError: n,
    cause: o
  } = {}) {
    super({ message: e, statusCode: t, cause: o }), this[Yd] = !0, this.name = bm, this.type = "response_error", this.response = r, this.validationError = n;
  }
  static isInstance(e) {
    return rt.hasMarker(e) && Kd in e;
  }
};
async function Qd({
  response: e,
  statusCode: t,
  defaultMessage: r = "Gateway request failed",
  cause: n,
  authMethod: o
}) {
  const a = await Ct({
    value: e,
    schema: XI
  });
  if (!a.success)
    return new YI({
      message: `Invalid error response format: ${r}`,
      statusCode: t,
      response: e,
      validationError: a.error,
      cause: n
    });
  const s = a.value, i = s.error.type, u = s.error.message;
  switch (i) {
    case "authentication_error":
      return Hi.createContextualError({
        apiKeyProvided: o === "api-key",
        oidcTokenProvided: o === "oidc",
        statusCode: t,
        cause: n
      });
    case "invalid_request_error":
      return new ZI({ message: u, statusCode: t, cause: n });
    case "rate_limit_exceeded":
      return new BI({ message: u, statusCode: t, cause: n });
    case "model_not_found": {
      const c = await Ct({
        value: s.error.param,
        schema: WI
      });
      return new vm({
        message: u,
        statusCode: t,
        modelId: c.success ? c.value.modelId : void 0,
        cause: n
      });
    }
    case "internal_server_error":
      return new Jd({ message: u, statusCode: t, cause: n });
    default:
      return new Jd({ message: u, statusCode: t, cause: n });
  }
}
var XI = Oe(
  () => de(
    R({
      error: R({
        message: T(),
        type: T().nullish(),
        param: At().nullish(),
        code: _e([T(), V()]).nullish()
      })
    })
  )
);
function Ht(e, t) {
  var r;
  return rt.isInstance(e) ? e : Ae.isInstance(e) ? Qd({
    response: QI(e),
    statusCode: (r = e.statusCode) != null ? r : 500,
    defaultMessage: "Gateway request failed",
    cause: e,
    authMethod: t
  }) : Qd({
    response: {},
    statusCode: 500,
    defaultMessage: e instanceof Error ? `Gateway request failed: ${e.message}` : "Unknown Gateway error",
    cause: e,
    authMethod: t
  });
}
function QI(e) {
  if (e.data !== void 0)
    return e.data;
  if (e.responseBody != null)
    try {
      return JSON.parse(e.responseBody);
    } catch {
      return e.responseBody;
    }
  return {};
}
var wm = "ai-gateway-auth-method";
async function Cr(e) {
  const t = await Ct({
    value: e[wm],
    schema: eT
  });
  return t.success ? t.value : void 0;
}
var eT = Oe(
  () => de(_e([Z("api-key"), Z("oidc")]))
), ef = class {
  constructor(e) {
    this.config = e;
  }
  async getAvailableModels() {
    try {
      const { value: e } = await $d({
        url: `${this.config.baseURL}/config`,
        headers: await vt(this.config.headers()),
        successfulResponseHandler: ft(
          tT
        ),
        failedResponseHandler: lr({
          errorSchema: lt(),
          errorToMessage: (t) => t
        }),
        fetch: this.config.fetch
      });
      return e;
    } catch (e) {
      throw await Ht(e);
    }
  }
  async getCredits() {
    try {
      const e = new URL(this.config.baseURL), { value: t } = await $d({
        url: `${e.origin}/v1/credits`,
        headers: await vt(this.config.headers()),
        successfulResponseHandler: ft(
          rT
        ),
        failedResponseHandler: lr({
          errorSchema: lt(),
          errorToMessage: (r) => r
        }),
        fetch: this.config.fetch
      });
      return t;
    } catch (e) {
      throw await Ht(e);
    }
  }
}, tT = Oe(
  () => de(
    R({
      models: ee(
        R({
          id: T(),
          name: T(),
          description: T().nullish(),
          pricing: R({
            input: T(),
            output: T(),
            input_cache_read: T().nullish(),
            input_cache_write: T().nullish()
          }).transform(
            ({ input: e, output: t, input_cache_read: r, input_cache_write: n }) => ({
              input: e,
              output: t,
              ...r ? { cachedInputTokens: r } : {},
              ...n ? { cacheCreationInputTokens: n } : {}
            })
          ).nullish(),
          specification: R({
            specificationVersion: Z("v2"),
            provider: T(),
            modelId: T()
          }),
          modelType: Ee(["language", "embedding", "image"]).nullish()
        })
      )
    })
  )
), rT = Oe(
  () => de(
    R({
      balance: T(),
      total_used: T()
    }).transform(({ balance: e, total_used: t }) => ({
      balance: e,
      totalUsed: t
    }))
  )
), nT = class {
  constructor(e, t) {
    this.modelId = e, this.config = t, this.specificationVersion = "v2", this.supportedUrls = { "*/*": [/.*/] };
  }
  get provider() {
    return this.config.provider;
  }
  async getArgs(e) {
    const { abortSignal: t, ...r } = e;
    return {
      args: this.maybeEncodeFileParts(r),
      warnings: []
    };
  }
  async doGenerate(e) {
    const { args: t, warnings: r } = await this.getArgs(e), { abortSignal: n } = e, o = await vt(this.config.headers());
    try {
      const {
        responseHeaders: a,
        value: s,
        rawValue: i
      } = await et({
        url: this.getUrl(),
        headers: Je(
          o,
          e.headers,
          this.getModelConfigHeaders(this.modelId, !1),
          await vt(this.config.o11yHeaders)
        ),
        body: t,
        successfulResponseHandler: ft(lt()),
        failedResponseHandler: lr({
          errorSchema: lt(),
          errorToMessage: (u) => u
        }),
        ...n && { abortSignal: n },
        fetch: this.config.fetch
      });
      return {
        ...s,
        request: { body: t },
        response: { headers: a, body: i },
        warnings: r
      };
    } catch (a) {
      throw await Ht(a, await Cr(o));
    }
  }
  async doStream(e) {
    const { args: t, warnings: r } = await this.getArgs(e), { abortSignal: n } = e, o = await vt(this.config.headers());
    try {
      const { value: a, responseHeaders: s } = await et({
        url: this.getUrl(),
        headers: Je(
          o,
          e.headers,
          this.getModelConfigHeaders(this.modelId, !0),
          await vt(this.config.o11yHeaders)
        ),
        body: t,
        successfulResponseHandler: wa(lt()),
        failedResponseHandler: lr({
          errorSchema: lt(),
          errorToMessage: (i) => i
        }),
        ...n && { abortSignal: n },
        fetch: this.config.fetch
      });
      return {
        stream: a.pipeThrough(
          new TransformStream({
            start(i) {
              r.length > 0 && i.enqueue({ type: "stream-start", warnings: r });
            },
            transform(i, u) {
              if (i.success) {
                const c = i.value;
                if (c.type === "raw" && !e.includeRawChunks)
                  return;
                c.type === "response-metadata" && c.timestamp && typeof c.timestamp == "string" && (c.timestamp = new Date(c.timestamp)), u.enqueue(c);
              } else
                u.error(
                  i.error
                );
            }
          })
        ),
        request: { body: t },
        response: { headers: s }
      };
    } catch (a) {
      throw await Ht(a, await Cr(o));
    }
  }
  isFilePart(e) {
    return e && typeof e == "object" && "type" in e && e.type === "file";
  }
  /**
   * Encodes file parts in the prompt to base64. Mutates the passed options
   * instance directly to avoid copying the file data.
   * @param options - The options to encode.
   * @returns The options with the file parts encoded.
   */
  maybeEncodeFileParts(e) {
    for (const t of e.prompt)
      for (const r of t.content)
        if (this.isFilePart(r)) {
          const n = r;
          if (n.data instanceof Uint8Array) {
            const o = Uint8Array.from(n.data), a = Buffer.from(o).toString("base64");
            n.data = new URL(
              `data:${n.mediaType || "application/octet-stream"};base64,${a}`
            );
          }
        }
    return e;
  }
  getUrl() {
    return `${this.config.baseURL}/language-model`;
  }
  getModelConfigHeaders(e, t) {
    return {
      "ai-language-model-specification-version": "2",
      "ai-language-model-id": e,
      "ai-language-model-streaming": String(t)
    };
  }
}, oT = class {
  constructor(e, t) {
    this.modelId = e, this.config = t, this.specificationVersion = "v2", this.maxEmbeddingsPerCall = 2048, this.supportsParallelCalls = !0;
  }
  get provider() {
    return this.config.provider;
  }
  async doEmbed({
    values: e,
    headers: t,
    abortSignal: r,
    providerOptions: n
  }) {
    var o;
    const a = await vt(this.config.headers());
    try {
      const {
        responseHeaders: s,
        value: i,
        rawValue: u
      } = await et({
        url: this.getUrl(),
        headers: Je(
          a,
          t ?? {},
          this.getModelConfigHeaders(),
          await vt(this.config.o11yHeaders)
        ),
        body: {
          input: e.length === 1 ? e[0] : e,
          ...n ? { providerOptions: n } : {}
        },
        successfulResponseHandler: ft(
          aT
        ),
        failedResponseHandler: lr({
          errorSchema: lt(),
          errorToMessage: (c) => c
        }),
        ...r && { abortSignal: r },
        fetch: this.config.fetch
      });
      return {
        embeddings: i.embeddings,
        usage: (o = i.usage) != null ? o : void 0,
        providerMetadata: i.providerMetadata,
        response: { headers: s, body: u }
      };
    } catch (s) {
      throw await Ht(s, await Cr(a));
    }
  }
  getUrl() {
    return `${this.config.baseURL}/embedding-model`;
  }
  getModelConfigHeaders() {
    return {
      "ai-embedding-model-specification-version": "2",
      "ai-model-id": this.modelId
    };
  }
}, aT = Oe(
  () => de(
    R({
      embeddings: ee(ee(V())),
      usage: R({ tokens: V() }).nullish(),
      providerMetadata: Ce(T(), Ce(T(), At())).optional()
    })
  )
), sT = {
  bfl: 1
};
function iT(e) {
  const t = typeof e == "string" ? e.split("/")[0] : "";
  return sT[t];
}
var uT = class {
  constructor(e, t) {
    this.modelId = e, this.config = t, this.specificationVersion = "v2";
  }
  get maxImagesPerCall() {
    var e;
    return (e = iT(this.modelId)) != null ? e : 4;
  }
  get provider() {
    return this.config.provider;
  }
  async doGenerate({
    prompt: e,
    n: t,
    size: r,
    aspectRatio: n,
    seed: o,
    providerOptions: a,
    headers: s,
    abortSignal: i
  }) {
    var u;
    const c = await vt(this.config.headers());
    try {
      const {
        responseHeaders: l,
        value: y,
        rawValue: d
      } = await et({
        url: this.getUrl(),
        headers: Je(
          c,
          s ?? {},
          this.getModelConfigHeaders(),
          await vt(this.config.o11yHeaders)
        ),
        body: {
          prompt: e,
          n: t,
          ...r && { size: r },
          ...n && { aspectRatio: n },
          ...o && { seed: o },
          ...a && { providerOptions: a }
        },
        successfulResponseHandler: ft(
          lT
        ),
        failedResponseHandler: lr({
          errorSchema: lt(),
          errorToMessage: (f) => f
        }),
        ...i && { abortSignal: i },
        fetch: this.config.fetch
      });
      return {
        images: y.images,
        // Always base64 strings from server
        warnings: (u = y.warnings) != null ? u : [],
        providerMetadata: y.providerMetadata,
        response: {
          timestamp: /* @__PURE__ */ new Date(),
          modelId: this.modelId,
          headers: l
        }
      };
    } catch (l) {
      throw Ht(l, await Cr(c));
    }
  }
  getUrl() {
    return `${this.config.baseURL}/image-model`;
  }
  getModelConfigHeaders() {
    return {
      "ai-image-model-specification-version": "2",
      "ai-model-id": this.modelId
    };
  }
}, cT = R({
  images: ee(At()).optional()
}).catchall(At()), lT = R({
  images: ee(T()),
  // Always base64 strings over the wire
  warnings: ee(
    R({
      type: Z("other"),
      message: T()
    })
  ).optional(),
  providerMetadata: Ce(T(), cT).optional()
});
async function dT() {
  var e;
  return (e = dm.getContext().headers) == null ? void 0 : e["x-vercel-id"];
}
var fT = "2.0.14", pT = "0.0.1";
function hT(e = {}) {
  var t, r;
  let n = null, o = null;
  const a = (t = e.metadataCacheRefreshMillis) != null ? t : 1e3 * 60 * 5;
  let s = 0;
  const i = (r = cm(e.baseURL)) != null ? r : "https://ai-gateway.vercel.sh/v1/ai", u = async () => {
    const g = await gT(e);
    if (g)
      return xr(
        {
          Authorization: `Bearer ${g.token}`,
          "ai-gateway-protocol-version": pT,
          [wm]: g.authMethod,
          ...e.headers
        },
        `ai-sdk/gateway/${fT}`
      );
    throw Hi.createContextualError({
      apiKeyProvided: !1,
      oidcTokenProvided: !1,
      statusCode: 401
    });
  }, c = () => {
    const g = In({
      settingValue: void 0,
      environmentVariableName: "VERCEL_DEPLOYMENT_ID"
    }), _ = In({
      settingValue: void 0,
      environmentVariableName: "VERCEL_ENV"
    }), m = In({
      settingValue: void 0,
      environmentVariableName: "VERCEL_REGION"
    });
    return async () => {
      const h = await dT();
      return {
        ...g && { "ai-o11y-deployment-id": g },
        ..._ && { "ai-o11y-environment": _ },
        ...m && { "ai-o11y-region": m },
        ...h && { "ai-o11y-request-id": h }
      };
    };
  }, l = (g) => new nT(g, {
    provider: "gateway",
    baseURL: i,
    headers: u,
    fetch: e.fetch,
    o11yHeaders: c()
  }), y = async () => {
    var g, _, m;
    const h = (m = (_ = (g = e._internal) == null ? void 0 : g.currentDate) == null ? void 0 : _.call(g).getTime()) != null ? m : Date.now();
    return (!n || h - s > a) && (s = h, n = new ef({
      baseURL: i,
      headers: u,
      fetch: e.fetch
    }).getAvailableModels().then((p) => (o = p, p)).catch(async (p) => {
      throw await Ht(
        p,
        await Cr(await u())
      );
    })), o ? Promise.resolve(o) : n;
  }, d = async () => new ef({
    baseURL: i,
    headers: u,
    fetch: e.fetch
  }).getCredits().catch(async (g) => {
    throw await Ht(
      g,
      await Cr(await u())
    );
  }), f = function(g) {
    if (new.target)
      throw new Error(
        "The Gateway Provider model function cannot be called with the new keyword."
      );
    return l(g);
  };
  return f.getAvailableModels = y, f.getCredits = d, f.imageModel = (g) => new uT(g, {
    provider: "gateway",
    baseURL: i,
    headers: u,
    fetch: e.fetch,
    o11yHeaders: c()
  }), f.languageModel = l, f.textEmbeddingModel = (g) => new oT(g, {
    provider: "gateway",
    baseURL: i,
    headers: u,
    fetch: e.fetch,
    o11yHeaders: c()
  }), f;
}
var mT = hT();
async function gT(e) {
  const t = In({
    settingValue: e.apiKey,
    environmentVariableName: "AI_GATEWAY_API_KEY"
  });
  if (t)
    return {
      token: t,
      authMethod: "api-key"
    };
  try {
    return {
      token: await dm.getVercelOidcToken(),
      authMethod: "oidc"
    };
  } catch {
    return null;
  }
}
var ei = {}, Xt = {}, Kr = {}, Yr = {}, Ot = {}, Qt = {}, er = {}, Xr = {}, tf;
function yT() {
  return tf || (tf = 1, Object.defineProperty(Xr, "__esModule", { value: !0 }), Xr._globalThis = void 0, Xr._globalThis = typeof globalThis == "object" ? globalThis : Kg), Xr;
}
var rf;
function vT() {
  return rf || (rf = 1, (function(e) {
    var t = er && er.__createBinding || (Object.create ? (function(n, o, a, s) {
      s === void 0 && (s = a), Object.defineProperty(n, s, { enumerable: !0, get: function() {
        return o[a];
      } });
    }) : (function(n, o, a, s) {
      s === void 0 && (s = a), n[s] = o[a];
    })), r = er && er.__exportStar || function(n, o) {
      for (var a in n) a !== "default" && !Object.prototype.hasOwnProperty.call(o, a) && t(o, n, a);
    };
    Object.defineProperty(e, "__esModule", { value: !0 }), r(/* @__PURE__ */ yT(), e);
  })(er)), er;
}
var nf;
function _T() {
  return nf || (nf = 1, (function(e) {
    var t = Qt && Qt.__createBinding || (Object.create ? (function(n, o, a, s) {
      s === void 0 && (s = a), Object.defineProperty(n, s, { enumerable: !0, get: function() {
        return o[a];
      } });
    }) : (function(n, o, a, s) {
      s === void 0 && (s = a), n[s] = o[a];
    })), r = Qt && Qt.__exportStar || function(n, o) {
      for (var a in n) a !== "default" && !Object.prototype.hasOwnProperty.call(o, a) && t(o, n, a);
    };
    Object.defineProperty(e, "__esModule", { value: !0 }), r(/* @__PURE__ */ vT(), e);
  })(Qt)), Qt;
}
var Qr = {}, of;
function Em() {
  return of || (of = 1, Object.defineProperty(Qr, "__esModule", { value: !0 }), Qr.VERSION = void 0, Qr.VERSION = "1.9.0"), Qr;
}
var tr = {}, af;
function bT() {
  if (af) return tr;
  af = 1, Object.defineProperty(tr, "__esModule", { value: !0 }), tr.isCompatible = tr._makeCompatibilityCheck = void 0;
  const e = /* @__PURE__ */ Em(), t = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
  function r(n) {
    const o = /* @__PURE__ */ new Set([n]), a = /* @__PURE__ */ new Set(), s = n.match(t);
    if (!s)
      return () => !1;
    const i = {
      major: +s[1],
      minor: +s[2],
      patch: +s[3],
      prerelease: s[4]
    };
    if (i.prerelease != null)
      return function(y) {
        return y === n;
      };
    function u(l) {
      return a.add(l), !1;
    }
    function c(l) {
      return o.add(l), !0;
    }
    return function(y) {
      if (o.has(y))
        return !0;
      if (a.has(y))
        return !1;
      const d = y.match(t);
      if (!d)
        return u(y);
      const f = {
        major: +d[1],
        minor: +d[2],
        patch: +d[3],
        prerelease: d[4]
      };
      return f.prerelease != null || i.major !== f.major ? u(y) : i.major === 0 ? i.minor === f.minor && i.patch <= f.patch ? c(y) : u(y) : i.minor <= f.minor ? c(y) : u(y);
    };
  }
  return tr._makeCompatibilityCheck = r, tr.isCompatible = r(e.VERSION), tr;
}
var sf;
function qr() {
  if (sf) return Ot;
  sf = 1, Object.defineProperty(Ot, "__esModule", { value: !0 }), Ot.unregisterGlobal = Ot.getGlobal = Ot.registerGlobal = void 0;
  const e = /* @__PURE__ */ _T(), t = /* @__PURE__ */ Em(), r = /* @__PURE__ */ bT(), n = t.VERSION.split(".")[0], o = Symbol.for(`opentelemetry.js.api.${n}`), a = e._globalThis;
  function s(c, l, y, d = !1) {
    var f;
    const g = a[o] = (f = a[o]) !== null && f !== void 0 ? f : {
      version: t.VERSION
    };
    if (!d && g[c]) {
      const _ = new Error(`@opentelemetry/api: Attempted duplicate registration of API: ${c}`);
      return y.error(_.stack || _.message), !1;
    }
    if (g.version !== t.VERSION) {
      const _ = new Error(`@opentelemetry/api: Registration of version v${g.version} for ${c} does not match previously registered API v${t.VERSION}`);
      return y.error(_.stack || _.message), !1;
    }
    return g[c] = l, y.debug(`@opentelemetry/api: Registered a global for ${c} v${t.VERSION}.`), !0;
  }
  Ot.registerGlobal = s;
  function i(c) {
    var l, y;
    const d = (l = a[o]) === null || l === void 0 ? void 0 : l.version;
    if (!(!d || !(0, r.isCompatible)(d)))
      return (y = a[o]) === null || y === void 0 ? void 0 : y[c];
  }
  Ot.getGlobal = i;
  function u(c, l) {
    l.debug(`@opentelemetry/api: Unregistering a global for ${c} v${t.VERSION}.`);
    const y = a[o];
    y && delete y[c];
  }
  return Ot.unregisterGlobal = u, Ot;
}
var uf;
function wT() {
  if (uf) return Yr;
  uf = 1, Object.defineProperty(Yr, "__esModule", { value: !0 }), Yr.DiagComponentLogger = void 0;
  const e = /* @__PURE__ */ qr();
  class t {
    constructor(o) {
      this._namespace = o.namespace || "DiagComponentLogger";
    }
    debug(...o) {
      return r("debug", this._namespace, o);
    }
    error(...o) {
      return r("error", this._namespace, o);
    }
    info(...o) {
      return r("info", this._namespace, o);
    }
    warn(...o) {
      return r("warn", this._namespace, o);
    }
    verbose(...o) {
      return r("verbose", this._namespace, o);
    }
  }
  Yr.DiagComponentLogger = t;
  function r(n, o, a) {
    const s = (0, e.getGlobal)("diag");
    if (s)
      return a.unshift(o), s[n](...a);
  }
  return Yr;
}
var en = {}, ti = {}, cf;
function Wi() {
  return cf || (cf = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.DiagLogLevel = void 0, (function(t) {
      t[t.NONE = 0] = "NONE", t[t.ERROR = 30] = "ERROR", t[t.WARN = 50] = "WARN", t[t.INFO = 60] = "INFO", t[t.DEBUG = 70] = "DEBUG", t[t.VERBOSE = 80] = "VERBOSE", t[t.ALL = 9999] = "ALL";
    })(e.DiagLogLevel || (e.DiagLogLevel = {}));
  })(ti)), ti;
}
var lf;
function ET() {
  if (lf) return en;
  lf = 1, Object.defineProperty(en, "__esModule", { value: !0 }), en.createLogLevelDiagLogger = void 0;
  const e = /* @__PURE__ */ Wi();
  function t(r, n) {
    r < e.DiagLogLevel.NONE ? r = e.DiagLogLevel.NONE : r > e.DiagLogLevel.ALL && (r = e.DiagLogLevel.ALL), n = n || {};
    function o(a, s) {
      const i = n[a];
      return typeof i == "function" && r >= s ? i.bind(n) : function() {
      };
    }
    return {
      error: o("error", e.DiagLogLevel.ERROR),
      warn: o("warn", e.DiagLogLevel.WARN),
      info: o("info", e.DiagLogLevel.INFO),
      debug: o("debug", e.DiagLogLevel.DEBUG),
      verbose: o("verbose", e.DiagLogLevel.VERBOSE)
    };
  }
  return en.createLogLevelDiagLogger = t, en;
}
var df;
function Lr() {
  if (df) return Kr;
  df = 1, Object.defineProperty(Kr, "__esModule", { value: !0 }), Kr.DiagAPI = void 0;
  const e = /* @__PURE__ */ wT(), t = /* @__PURE__ */ ET(), r = /* @__PURE__ */ Wi(), n = /* @__PURE__ */ qr(), o = "diag";
  class a {
    /**
     * Private internal constructor
     * @private
     */
    constructor() {
      function i(l) {
        return function(...y) {
          const d = (0, n.getGlobal)("diag");
          if (d)
            return d[l](...y);
        };
      }
      const u = this, c = (l, y = { logLevel: r.DiagLogLevel.INFO }) => {
        var d, f, g;
        if (l === u) {
          const h = new Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
          return u.error((d = h.stack) !== null && d !== void 0 ? d : h.message), !1;
        }
        typeof y == "number" && (y = {
          logLevel: y
        });
        const _ = (0, n.getGlobal)("diag"), m = (0, t.createLogLevelDiagLogger)((f = y.logLevel) !== null && f !== void 0 ? f : r.DiagLogLevel.INFO, l);
        if (_ && !y.suppressOverrideMessage) {
          const h = (g = new Error().stack) !== null && g !== void 0 ? g : "<failed to generate stacktrace>";
          _.warn(`Current logger will be overwritten from ${h}`), m.warn(`Current logger will overwrite one already registered from ${h}`);
        }
        return (0, n.registerGlobal)("diag", m, u, !0);
      };
      u.setLogger = c, u.disable = () => {
        (0, n.unregisterGlobal)(o, u);
      }, u.createComponentLogger = (l) => new e.DiagComponentLogger(l), u.verbose = i("verbose"), u.debug = i("debug"), u.info = i("info"), u.warn = i("warn"), u.error = i("error");
    }
    /** Get the singleton instance of the DiagAPI API */
    static instance() {
      return this._instance || (this._instance = new a()), this._instance;
    }
  }
  return Kr.DiagAPI = a, Kr;
}
var tn = {}, ff;
function $T() {
  if (ff) return tn;
  ff = 1, Object.defineProperty(tn, "__esModule", { value: !0 }), tn.BaggageImpl = void 0;
  class e {
    constructor(r) {
      this._entries = r ? new Map(r) : /* @__PURE__ */ new Map();
    }
    getEntry(r) {
      const n = this._entries.get(r);
      if (n)
        return Object.assign({}, n);
    }
    getAllEntries() {
      return Array.from(this._entries.entries()).map(([r, n]) => [r, n]);
    }
    setEntry(r, n) {
      const o = new e(this._entries);
      return o._entries.set(r, n), o;
    }
    removeEntry(r) {
      const n = new e(this._entries);
      return n._entries.delete(r), n;
    }
    removeEntries(...r) {
      const n = new e(this._entries);
      for (const o of r)
        n._entries.delete(o);
      return n;
    }
    clear() {
      return new e();
    }
  }
  return tn.BaggageImpl = e, tn;
}
var rn = {}, pf;
function ST() {
  return pf || (pf = 1, Object.defineProperty(rn, "__esModule", { value: !0 }), rn.baggageEntryMetadataSymbol = void 0, rn.baggageEntryMetadataSymbol = Symbol("BaggageEntryMetadata")), rn;
}
var hf;
function $m() {
  if (hf) return Xt;
  hf = 1, Object.defineProperty(Xt, "__esModule", { value: !0 }), Xt.baggageEntryMetadataFromString = Xt.createBaggage = void 0;
  const e = /* @__PURE__ */ Lr(), t = /* @__PURE__ */ $T(), r = /* @__PURE__ */ ST(), n = e.DiagAPI.instance();
  function o(s = {}) {
    return new t.BaggageImpl(new Map(Object.entries(s)));
  }
  Xt.createBaggage = o;
  function a(s) {
    return typeof s != "string" && (n.error(`Cannot create baggage metadata from unknown type: ${typeof s}`), s = ""), {
      __TYPE__: r.baggageEntryMetadataSymbol,
      toString() {
        return s;
      }
    };
  }
  return Xt.baggageEntryMetadataFromString = a, Xt;
}
var rr = {}, mf;
function Sa() {
  if (mf) return rr;
  mf = 1, Object.defineProperty(rr, "__esModule", { value: !0 }), rr.ROOT_CONTEXT = rr.createContextKey = void 0;
  function e(r) {
    return Symbol.for(r);
  }
  rr.createContextKey = e;
  class t {
    /**
     * Construct a new context which inherits values from an optional parent context.
     *
     * @param parentContext a context from which to inherit values
     */
    constructor(n) {
      const o = this;
      o._currentContext = n ? new Map(n) : /* @__PURE__ */ new Map(), o.getValue = (a) => o._currentContext.get(a), o.setValue = (a, s) => {
        const i = new t(o._currentContext);
        return i._currentContext.set(a, s), i;
      }, o.deleteValue = (a) => {
        const s = new t(o._currentContext);
        return s._currentContext.delete(a), s;
      };
    }
  }
  return rr.ROOT_CONTEXT = new t(), rr;
}
var nn = {}, gf;
function IT() {
  if (gf) return nn;
  gf = 1, Object.defineProperty(nn, "__esModule", { value: !0 }), nn.DiagConsoleLogger = void 0;
  const e = [
    { n: "error", c: "error" },
    { n: "warn", c: "warn" },
    { n: "info", c: "info" },
    { n: "debug", c: "debug" },
    { n: "verbose", c: "trace" }
  ];
  class t {
    constructor() {
      function n(o) {
        return function(...a) {
          if (console) {
            let s = console[o];
            if (typeof s != "function" && (s = console.log), typeof s == "function")
              return s.apply(console, a);
          }
        };
      }
      for (let o = 0; o < e.length; o++)
        this[e[o].n] = n(e[o].c);
    }
  }
  return nn.DiagConsoleLogger = t, nn;
}
var ri = {}, yf;
function Sm() {
  return yf || (yf = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.createNoopMeter = e.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = e.NOOP_OBSERVABLE_GAUGE_METRIC = e.NOOP_OBSERVABLE_COUNTER_METRIC = e.NOOP_UP_DOWN_COUNTER_METRIC = e.NOOP_HISTOGRAM_METRIC = e.NOOP_GAUGE_METRIC = e.NOOP_COUNTER_METRIC = e.NOOP_METER = e.NoopObservableUpDownCounterMetric = e.NoopObservableGaugeMetric = e.NoopObservableCounterMetric = e.NoopObservableMetric = e.NoopHistogramMetric = e.NoopGaugeMetric = e.NoopUpDownCounterMetric = e.NoopCounterMetric = e.NoopMetric = e.NoopMeter = void 0;
    class t {
      constructor() {
      }
      /**
       * @see {@link Meter.createGauge}
       */
      createGauge(f, g) {
        return e.NOOP_GAUGE_METRIC;
      }
      /**
       * @see {@link Meter.createHistogram}
       */
      createHistogram(f, g) {
        return e.NOOP_HISTOGRAM_METRIC;
      }
      /**
       * @see {@link Meter.createCounter}
       */
      createCounter(f, g) {
        return e.NOOP_COUNTER_METRIC;
      }
      /**
       * @see {@link Meter.createUpDownCounter}
       */
      createUpDownCounter(f, g) {
        return e.NOOP_UP_DOWN_COUNTER_METRIC;
      }
      /**
       * @see {@link Meter.createObservableGauge}
       */
      createObservableGauge(f, g) {
        return e.NOOP_OBSERVABLE_GAUGE_METRIC;
      }
      /**
       * @see {@link Meter.createObservableCounter}
       */
      createObservableCounter(f, g) {
        return e.NOOP_OBSERVABLE_COUNTER_METRIC;
      }
      /**
       * @see {@link Meter.createObservableUpDownCounter}
       */
      createObservableUpDownCounter(f, g) {
        return e.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
      }
      /**
       * @see {@link Meter.addBatchObservableCallback}
       */
      addBatchObservableCallback(f, g) {
      }
      /**
       * @see {@link Meter.removeBatchObservableCallback}
       */
      removeBatchObservableCallback(f) {
      }
    }
    e.NoopMeter = t;
    class r {
    }
    e.NoopMetric = r;
    class n extends r {
      add(f, g) {
      }
    }
    e.NoopCounterMetric = n;
    class o extends r {
      add(f, g) {
      }
    }
    e.NoopUpDownCounterMetric = o;
    class a extends r {
      record(f, g) {
      }
    }
    e.NoopGaugeMetric = a;
    class s extends r {
      record(f, g) {
      }
    }
    e.NoopHistogramMetric = s;
    class i {
      addCallback(f) {
      }
      removeCallback(f) {
      }
    }
    e.NoopObservableMetric = i;
    class u extends i {
    }
    e.NoopObservableCounterMetric = u;
    class c extends i {
    }
    e.NoopObservableGaugeMetric = c;
    class l extends i {
    }
    e.NoopObservableUpDownCounterMetric = l, e.NOOP_METER = new t(), e.NOOP_COUNTER_METRIC = new n(), e.NOOP_GAUGE_METRIC = new a(), e.NOOP_HISTOGRAM_METRIC = new s(), e.NOOP_UP_DOWN_COUNTER_METRIC = new o(), e.NOOP_OBSERVABLE_COUNTER_METRIC = new u(), e.NOOP_OBSERVABLE_GAUGE_METRIC = new c(), e.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new l();
    function y() {
      return e.NOOP_METER;
    }
    e.createNoopMeter = y;
  })(ri)), ri;
}
var ni = {}, vf;
function TT() {
  return vf || (vf = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueType = void 0, (function(t) {
      t[t.INT = 0] = "INT", t[t.DOUBLE = 1] = "DOUBLE";
    })(e.ValueType || (e.ValueType = {}));
  })(ni)), ni;
}
var nr = {}, _f;
function Im() {
  return _f || (_f = 1, Object.defineProperty(nr, "__esModule", { value: !0 }), nr.defaultTextMapSetter = nr.defaultTextMapGetter = void 0, nr.defaultTextMapGetter = {
    get(e, t) {
      if (e != null)
        return e[t];
    },
    keys(e) {
      return e == null ? [] : Object.keys(e);
    }
  }, nr.defaultTextMapSetter = {
    set(e, t, r) {
      e != null && (e[t] = r);
    }
  }), nr;
}
var on = {}, an = {}, sn = {}, un = {}, bf;
function OT() {
  if (bf) return un;
  bf = 1, Object.defineProperty(un, "__esModule", { value: !0 }), un.NoopContextManager = void 0;
  const e = /* @__PURE__ */ Sa();
  let t = class {
    active() {
      return e.ROOT_CONTEXT;
    }
    with(n, o, a, ...s) {
      return o.call(a, ...s);
    }
    bind(n, o) {
      return o;
    }
    enable() {
      return this;
    }
    disable() {
      return this;
    }
  };
  return un.NoopContextManager = t, un;
}
var wf;
function Ia() {
  if (wf) return sn;
  wf = 1, Object.defineProperty(sn, "__esModule", { value: !0 }), sn.ContextAPI = void 0;
  const e = /* @__PURE__ */ OT(), t = /* @__PURE__ */ qr(), r = /* @__PURE__ */ Lr(), n = "context", o = new e.NoopContextManager();
  class a {
    /** Empty private constructor prevents end users from constructing a new instance of the API */
    constructor() {
    }
    /** Get the singleton instance of the Context API */
    static getInstance() {
      return this._instance || (this._instance = new a()), this._instance;
    }
    /**
     * Set the current context manager.
     *
     * @returns true if the context manager was successfully registered, else false
     */
    setGlobalContextManager(i) {
      return (0, t.registerGlobal)(n, i, r.DiagAPI.instance());
    }
    /**
     * Get the currently active context
     */
    active() {
      return this._getContextManager().active();
    }
    /**
     * Execute a function with an active context
     *
     * @param context context to be active during function execution
     * @param fn function to execute in a context
     * @param thisArg optional receiver to be used for calling fn
     * @param args optional arguments forwarded to fn
     */
    with(i, u, c, ...l) {
      return this._getContextManager().with(i, u, c, ...l);
    }
    /**
     * Bind a context to a target function or event emitter
     *
     * @param context context to bind to the event emitter or function. Defaults to the currently active context
     * @param target function or event emitter to bind
     */
    bind(i, u) {
      return this._getContextManager().bind(i, u);
    }
    _getContextManager() {
      return (0, t.getGlobal)(n) || o;
    }
    /** Disable and remove the global context manager */
    disable() {
      this._getContextManager().disable(), (0, t.unregisterGlobal)(n, r.DiagAPI.instance());
    }
  }
  return sn.ContextAPI = a, sn;
}
var Be = {}, cn = {}, oi = {}, ai = {}, Ef;
function Tm() {
  return Ef || (Ef = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.TraceFlags = void 0, (function(t) {
      t[t.NONE = 0] = "NONE", t[t.SAMPLED = 1] = "SAMPLED";
    })(e.TraceFlags || (e.TraceFlags = {}));
  })(ai)), ai;
}
var $f;
function Ji() {
  return $f || ($f = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.INVALID_SPAN_CONTEXT = e.INVALID_TRACEID = e.INVALID_SPANID = void 0;
    const t = /* @__PURE__ */ Tm();
    e.INVALID_SPANID = "0000000000000000", e.INVALID_TRACEID = "00000000000000000000000000000000", e.INVALID_SPAN_CONTEXT = {
      traceId: e.INVALID_TRACEID,
      spanId: e.INVALID_SPANID,
      traceFlags: t.TraceFlags.NONE
    };
  })(oi)), oi;
}
var Sf;
function Ki() {
  if (Sf) return cn;
  Sf = 1, Object.defineProperty(cn, "__esModule", { value: !0 }), cn.NonRecordingSpan = void 0;
  const e = /* @__PURE__ */ Ji();
  let t = class {
    constructor(n = e.INVALID_SPAN_CONTEXT) {
      this._spanContext = n;
    }
    // Returns a SpanContext.
    spanContext() {
      return this._spanContext;
    }
    // By default does nothing
    setAttribute(n, o) {
      return this;
    }
    // By default does nothing
    setAttributes(n) {
      return this;
    }
    // By default does nothing
    addEvent(n, o) {
      return this;
    }
    addLink(n) {
      return this;
    }
    addLinks(n) {
      return this;
    }
    // By default does nothing
    setStatus(n) {
      return this;
    }
    // By default does nothing
    updateName(n) {
      return this;
    }
    // By default does nothing
    end(n) {
    }
    // isRecording always returns false for NonRecordingSpan.
    isRecording() {
      return !1;
    }
    // By default does nothing
    recordException(n, o) {
    }
  };
  return cn.NonRecordingSpan = t, cn;
}
var If;
function Om() {
  if (If) return Be;
  If = 1, Object.defineProperty(Be, "__esModule", { value: !0 }), Be.getSpanContext = Be.setSpanContext = Be.deleteSpan = Be.setSpan = Be.getActiveSpan = Be.getSpan = void 0;
  const e = /* @__PURE__ */ Sa(), t = /* @__PURE__ */ Ki(), r = /* @__PURE__ */ Ia(), n = (0, e.createContextKey)("OpenTelemetry Context Key SPAN");
  function o(l) {
    return l.getValue(n) || void 0;
  }
  Be.getSpan = o;
  function a() {
    return o(r.ContextAPI.getInstance().active());
  }
  Be.getActiveSpan = a;
  function s(l, y) {
    return l.setValue(n, y);
  }
  Be.setSpan = s;
  function i(l) {
    return l.deleteValue(n);
  }
  Be.deleteSpan = i;
  function u(l, y) {
    return s(l, new t.NonRecordingSpan(y));
  }
  Be.setSpanContext = u;
  function c(l) {
    var y;
    return (y = o(l)) === null || y === void 0 ? void 0 : y.spanContext();
  }
  return Be.getSpanContext = c, Be;
}
var ut = {}, Tf;
function Yi() {
  if (Tf) return ut;
  Tf = 1, Object.defineProperty(ut, "__esModule", { value: !0 }), ut.wrapSpanContext = ut.isSpanContextValid = ut.isValidSpanId = ut.isValidTraceId = void 0;
  const e = /* @__PURE__ */ Ji(), t = /* @__PURE__ */ Ki(), r = /^([0-9a-f]{32})$/i, n = /^[0-9a-f]{16}$/i;
  function o(u) {
    return r.test(u) && u !== e.INVALID_TRACEID;
  }
  ut.isValidTraceId = o;
  function a(u) {
    return n.test(u) && u !== e.INVALID_SPANID;
  }
  ut.isValidSpanId = a;
  function s(u) {
    return o(u.traceId) && a(u.spanId);
  }
  ut.isSpanContextValid = s;
  function i(u) {
    return new t.NonRecordingSpan(u);
  }
  return ut.wrapSpanContext = i, ut;
}
var Of;
function Rm() {
  if (Of) return an;
  Of = 1, Object.defineProperty(an, "__esModule", { value: !0 }), an.NoopTracer = void 0;
  const e = /* @__PURE__ */ Ia(), t = /* @__PURE__ */ Om(), r = /* @__PURE__ */ Ki(), n = /* @__PURE__ */ Yi(), o = e.ContextAPI.getInstance();
  let a = class {
    // startSpan starts a noop span.
    startSpan(u, c, l = o.active()) {
      if (!!(c != null && c.root))
        return new r.NonRecordingSpan();
      const d = l && (0, t.getSpanContext)(l);
      return s(d) && (0, n.isSpanContextValid)(d) ? new r.NonRecordingSpan(d) : new r.NonRecordingSpan();
    }
    startActiveSpan(u, c, l, y) {
      let d, f, g;
      if (arguments.length < 2)
        return;
      arguments.length === 2 ? g = c : arguments.length === 3 ? (d = c, g = l) : (d = c, f = l, g = y);
      const _ = f ?? o.active(), m = this.startSpan(u, d, _), h = (0, t.setSpan)(_, m);
      return o.with(h, g, void 0, m);
    }
  };
  an.NoopTracer = a;
  function s(i) {
    return typeof i == "object" && typeof i.spanId == "string" && typeof i.traceId == "string" && typeof i.traceFlags == "number";
  }
  return an;
}
var Rf;
function Pm() {
  if (Rf) return on;
  Rf = 1, Object.defineProperty(on, "__esModule", { value: !0 }), on.ProxyTracer = void 0;
  const e = /* @__PURE__ */ Rm(), t = new e.NoopTracer();
  let r = class {
    constructor(o, a, s, i) {
      this._provider = o, this.name = a, this.version = s, this.options = i;
    }
    startSpan(o, a, s) {
      return this._getTracer().startSpan(o, a, s);
    }
    startActiveSpan(o, a, s, i) {
      const u = this._getTracer();
      return Reflect.apply(u.startActiveSpan, u, arguments);
    }
    /**
     * Try to get a tracer from the proxy tracer provider.
     * If the proxy tracer provider has no delegate, return a noop tracer.
     */
    _getTracer() {
      if (this._delegate)
        return this._delegate;
      const o = this._provider.getDelegateTracer(this.name, this.version, this.options);
      return o ? (this._delegate = o, this._delegate) : t;
    }
  };
  return on.ProxyTracer = r, on;
}
var ln = {}, dn = {}, Pf;
function RT() {
  if (Pf) return dn;
  Pf = 1, Object.defineProperty(dn, "__esModule", { value: !0 }), dn.NoopTracerProvider = void 0;
  const e = /* @__PURE__ */ Rm();
  let t = class {
    getTracer(n, o, a) {
      return new e.NoopTracer();
    }
  };
  return dn.NoopTracerProvider = t, dn;
}
var kf;
function km() {
  if (kf) return ln;
  kf = 1, Object.defineProperty(ln, "__esModule", { value: !0 }), ln.ProxyTracerProvider = void 0;
  const e = /* @__PURE__ */ Pm(), t = /* @__PURE__ */ RT(), r = new t.NoopTracerProvider();
  let n = class {
    /**
     * Get a {@link ProxyTracer}
     */
    getTracer(a, s, i) {
      var u;
      return (u = this.getDelegateTracer(a, s, i)) !== null && u !== void 0 ? u : new e.ProxyTracer(this, a, s, i);
    }
    getDelegate() {
      var a;
      return (a = this._delegate) !== null && a !== void 0 ? a : r;
    }
    /**
     * Set the delegate tracer provider
     */
    setDelegate(a) {
      this._delegate = a;
    }
    getDelegateTracer(a, s, i) {
      var u;
      return (u = this._delegate) === null || u === void 0 ? void 0 : u.getTracer(a, s, i);
    }
  };
  return ln.ProxyTracerProvider = n, ln;
}
var si = {}, Nf;
function PT() {
  return Nf || (Nf = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.SamplingDecision = void 0, (function(t) {
      t[t.NOT_RECORD = 0] = "NOT_RECORD", t[t.RECORD = 1] = "RECORD", t[t.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED";
    })(e.SamplingDecision || (e.SamplingDecision = {}));
  })(si)), si;
}
var ii = {}, Af;
function kT() {
  return Af || (Af = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.SpanKind = void 0, (function(t) {
      t[t.INTERNAL = 0] = "INTERNAL", t[t.SERVER = 1] = "SERVER", t[t.CLIENT = 2] = "CLIENT", t[t.PRODUCER = 3] = "PRODUCER", t[t.CONSUMER = 4] = "CONSUMER";
    })(e.SpanKind || (e.SpanKind = {}));
  })(ii)), ii;
}
var ui = {}, Cf;
function NT() {
  return Cf || (Cf = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.SpanStatusCode = void 0, (function(t) {
      t[t.UNSET = 0] = "UNSET", t[t.OK = 1] = "OK", t[t.ERROR = 2] = "ERROR";
    })(e.SpanStatusCode || (e.SpanStatusCode = {}));
  })(ui)), ui;
}
var fn = {}, pn = {}, or = {}, jf;
function AT() {
  if (jf) return or;
  jf = 1, Object.defineProperty(or, "__esModule", { value: !0 }), or.validateValue = or.validateKey = void 0;
  const e = "[_0-9a-z-*/]", t = `[a-z]${e}{0,255}`, r = `[a-z0-9]${e}{0,240}@[a-z]${e}{0,13}`, n = new RegExp(`^(?:${t}|${r})$`), o = /^[ -~]{0,255}[!-~]$/, a = /,|=/;
  function s(u) {
    return n.test(u);
  }
  or.validateKey = s;
  function i(u) {
    return o.test(u) && !a.test(u);
  }
  return or.validateValue = i, or;
}
var Mf;
function CT() {
  if (Mf) return pn;
  Mf = 1, Object.defineProperty(pn, "__esModule", { value: !0 }), pn.TraceStateImpl = void 0;
  const e = /* @__PURE__ */ AT(), t = 32, r = 512, n = ",", o = "=";
  class a {
    constructor(i) {
      this._internalState = /* @__PURE__ */ new Map(), i && this._parse(i);
    }
    set(i, u) {
      const c = this._clone();
      return c._internalState.has(i) && c._internalState.delete(i), c._internalState.set(i, u), c;
    }
    unset(i) {
      const u = this._clone();
      return u._internalState.delete(i), u;
    }
    get(i) {
      return this._internalState.get(i);
    }
    serialize() {
      return this._keys().reduce((i, u) => (i.push(u + o + this.get(u)), i), []).join(n);
    }
    _parse(i) {
      i.length > r || (this._internalState = i.split(n).reverse().reduce((u, c) => {
        const l = c.trim(), y = l.indexOf(o);
        if (y !== -1) {
          const d = l.slice(0, y), f = l.slice(y + 1, c.length);
          (0, e.validateKey)(d) && (0, e.validateValue)(f) && u.set(d, f);
        }
        return u;
      }, /* @__PURE__ */ new Map()), this._internalState.size > t && (this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, t))));
    }
    _keys() {
      return Array.from(this._internalState.keys()).reverse();
    }
    _clone() {
      const i = new a();
      return i._internalState = new Map(this._internalState), i;
    }
  }
  return pn.TraceStateImpl = a, pn;
}
var xf;
function jT() {
  if (xf) return fn;
  xf = 1, Object.defineProperty(fn, "__esModule", { value: !0 }), fn.createTraceState = void 0;
  const e = /* @__PURE__ */ CT();
  function t(r) {
    return new e.TraceStateImpl(r);
  }
  return fn.createTraceState = t, fn;
}
var hn = {}, Df;
function MT() {
  if (Df) return hn;
  Df = 1, Object.defineProperty(hn, "__esModule", { value: !0 }), hn.context = void 0;
  const e = /* @__PURE__ */ Ia();
  return hn.context = e.ContextAPI.getInstance(), hn;
}
var mn = {}, qf;
function xT() {
  if (qf) return mn;
  qf = 1, Object.defineProperty(mn, "__esModule", { value: !0 }), mn.diag = void 0;
  const e = /* @__PURE__ */ Lr();
  return mn.diag = e.DiagAPI.instance(), mn;
}
var gn = {}, yn = {}, ar = {}, Lf;
function DT() {
  if (Lf) return ar;
  Lf = 1, Object.defineProperty(ar, "__esModule", { value: !0 }), ar.NOOP_METER_PROVIDER = ar.NoopMeterProvider = void 0;
  const e = /* @__PURE__ */ Sm();
  let t = class {
    getMeter(n, o, a) {
      return e.NOOP_METER;
    }
  };
  return ar.NoopMeterProvider = t, ar.NOOP_METER_PROVIDER = new t(), ar;
}
var zf;
function qT() {
  if (zf) return yn;
  zf = 1, Object.defineProperty(yn, "__esModule", { value: !0 }), yn.MetricsAPI = void 0;
  const e = /* @__PURE__ */ DT(), t = /* @__PURE__ */ qr(), r = /* @__PURE__ */ Lr(), n = "metrics";
  class o {
    /** Empty private constructor prevents end users from constructing a new instance of the API */
    constructor() {
    }
    /** Get the singleton instance of the Metrics API */
    static getInstance() {
      return this._instance || (this._instance = new o()), this._instance;
    }
    /**
     * Set the current global meter provider.
     * Returns true if the meter provider was successfully registered, else false.
     */
    setGlobalMeterProvider(s) {
      return (0, t.registerGlobal)(n, s, r.DiagAPI.instance());
    }
    /**
     * Returns the global meter provider.
     */
    getMeterProvider() {
      return (0, t.getGlobal)(n) || e.NOOP_METER_PROVIDER;
    }
    /**
     * Returns a meter from the global meter provider.
     */
    getMeter(s, i, u) {
      return this.getMeterProvider().getMeter(s, i, u);
    }
    /** Remove the global meter provider */
    disable() {
      (0, t.unregisterGlobal)(n, r.DiagAPI.instance());
    }
  }
  return yn.MetricsAPI = o, yn;
}
var Vf;
function LT() {
  if (Vf) return gn;
  Vf = 1, Object.defineProperty(gn, "__esModule", { value: !0 }), gn.metrics = void 0;
  const e = /* @__PURE__ */ qT();
  return gn.metrics = e.MetricsAPI.getInstance(), gn;
}
var vn = {}, _n = {}, bn = {}, Uf;
function zT() {
  if (Uf) return bn;
  Uf = 1, Object.defineProperty(bn, "__esModule", { value: !0 }), bn.NoopTextMapPropagator = void 0;
  let e = class {
    /** Noop inject function does nothing */
    inject(r, n) {
    }
    /** Noop extract function does nothing and returns the input context */
    extract(r, n) {
      return r;
    }
    fields() {
      return [];
    }
  };
  return bn.NoopTextMapPropagator = e, bn;
}
var ct = {}, Ff;
function VT() {
  if (Ff) return ct;
  Ff = 1, Object.defineProperty(ct, "__esModule", { value: !0 }), ct.deleteBaggage = ct.setBaggage = ct.getActiveBaggage = ct.getBaggage = void 0;
  const e = /* @__PURE__ */ Ia(), r = (0, (/* @__PURE__ */ Sa()).createContextKey)("OpenTelemetry Baggage Key");
  function n(i) {
    return i.getValue(r) || void 0;
  }
  ct.getBaggage = n;
  function o() {
    return n(e.ContextAPI.getInstance().active());
  }
  ct.getActiveBaggage = o;
  function a(i, u) {
    return i.setValue(r, u);
  }
  ct.setBaggage = a;
  function s(i) {
    return i.deleteValue(r);
  }
  return ct.deleteBaggage = s, ct;
}
var Zf;
function UT() {
  if (Zf) return _n;
  Zf = 1, Object.defineProperty(_n, "__esModule", { value: !0 }), _n.PropagationAPI = void 0;
  const e = /* @__PURE__ */ qr(), t = /* @__PURE__ */ zT(), r = /* @__PURE__ */ Im(), n = /* @__PURE__ */ VT(), o = /* @__PURE__ */ $m(), a = /* @__PURE__ */ Lr(), s = "propagation", i = new t.NoopTextMapPropagator();
  class u {
    /** Empty private constructor prevents end users from constructing a new instance of the API */
    constructor() {
      this.createBaggage = o.createBaggage, this.getBaggage = n.getBaggage, this.getActiveBaggage = n.getActiveBaggage, this.setBaggage = n.setBaggage, this.deleteBaggage = n.deleteBaggage;
    }
    /** Get the singleton instance of the Propagator API */
    static getInstance() {
      return this._instance || (this._instance = new u()), this._instance;
    }
    /**
     * Set the current propagator.
     *
     * @returns true if the propagator was successfully registered, else false
     */
    setGlobalPropagator(l) {
      return (0, e.registerGlobal)(s, l, a.DiagAPI.instance());
    }
    /**
     * Inject context into a carrier to be propagated inter-process
     *
     * @param context Context carrying tracing data to inject
     * @param carrier carrier to inject context into
     * @param setter Function used to set values on the carrier
     */
    inject(l, y, d = r.defaultTextMapSetter) {
      return this._getGlobalPropagator().inject(l, y, d);
    }
    /**
     * Extract context from a carrier
     *
     * @param context Context which the newly created context will inherit from
     * @param carrier Carrier to extract context from
     * @param getter Function used to extract keys from a carrier
     */
    extract(l, y, d = r.defaultTextMapGetter) {
      return this._getGlobalPropagator().extract(l, y, d);
    }
    /**
     * Return a list of all fields which may be used by the propagator.
     */
    fields() {
      return this._getGlobalPropagator().fields();
    }
    /** Remove the global propagator */
    disable() {
      (0, e.unregisterGlobal)(s, a.DiagAPI.instance());
    }
    _getGlobalPropagator() {
      return (0, e.getGlobal)(s) || i;
    }
  }
  return _n.PropagationAPI = u, _n;
}
var Gf;
function FT() {
  if (Gf) return vn;
  Gf = 1, Object.defineProperty(vn, "__esModule", { value: !0 }), vn.propagation = void 0;
  const e = /* @__PURE__ */ UT();
  return vn.propagation = e.PropagationAPI.getInstance(), vn;
}
var wn = {}, En = {}, Bf;
function ZT() {
  if (Bf) return En;
  Bf = 1, Object.defineProperty(En, "__esModule", { value: !0 }), En.TraceAPI = void 0;
  const e = /* @__PURE__ */ qr(), t = /* @__PURE__ */ km(), r = /* @__PURE__ */ Yi(), n = /* @__PURE__ */ Om(), o = /* @__PURE__ */ Lr(), a = "trace";
  class s {
    /** Empty private constructor prevents end users from constructing a new instance of the API */
    constructor() {
      this._proxyTracerProvider = new t.ProxyTracerProvider(), this.wrapSpanContext = r.wrapSpanContext, this.isSpanContextValid = r.isSpanContextValid, this.deleteSpan = n.deleteSpan, this.getSpan = n.getSpan, this.getActiveSpan = n.getActiveSpan, this.getSpanContext = n.getSpanContext, this.setSpan = n.setSpan, this.setSpanContext = n.setSpanContext;
    }
    /** Get the singleton instance of the Trace API */
    static getInstance() {
      return this._instance || (this._instance = new s()), this._instance;
    }
    /**
     * Set the current global tracer.
     *
     * @returns true if the tracer provider was successfully registered, else false
     */
    setGlobalTracerProvider(u) {
      const c = (0, e.registerGlobal)(a, this._proxyTracerProvider, o.DiagAPI.instance());
      return c && this._proxyTracerProvider.setDelegate(u), c;
    }
    /**
     * Returns the global tracer provider.
     */
    getTracerProvider() {
      return (0, e.getGlobal)(a) || this._proxyTracerProvider;
    }
    /**
     * Returns a tracer from the global tracer provider.
     */
    getTracer(u, c) {
      return this.getTracerProvider().getTracer(u, c);
    }
    /** Remove the global tracer provider */
    disable() {
      (0, e.unregisterGlobal)(a, o.DiagAPI.instance()), this._proxyTracerProvider = new t.ProxyTracerProvider();
    }
  }
  return En.TraceAPI = s, En;
}
var Hf;
function GT() {
  if (Hf) return wn;
  Hf = 1, Object.defineProperty(wn, "__esModule", { value: !0 }), wn.trace = void 0;
  const e = /* @__PURE__ */ ZT();
  return wn.trace = e.TraceAPI.getInstance(), wn;
}
var Wf;
function BT() {
  return Wf || (Wf = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.trace = e.propagation = e.metrics = e.diag = e.context = e.INVALID_SPAN_CONTEXT = e.INVALID_TRACEID = e.INVALID_SPANID = e.isValidSpanId = e.isValidTraceId = e.isSpanContextValid = e.createTraceState = e.TraceFlags = e.SpanStatusCode = e.SpanKind = e.SamplingDecision = e.ProxyTracerProvider = e.ProxyTracer = e.defaultTextMapSetter = e.defaultTextMapGetter = e.ValueType = e.createNoopMeter = e.DiagLogLevel = e.DiagConsoleLogger = e.ROOT_CONTEXT = e.createContextKey = e.baggageEntryMetadataFromString = void 0;
    var t = /* @__PURE__ */ $m();
    Object.defineProperty(e, "baggageEntryMetadataFromString", { enumerable: !0, get: function() {
      return t.baggageEntryMetadataFromString;
    } });
    var r = /* @__PURE__ */ Sa();
    Object.defineProperty(e, "createContextKey", { enumerable: !0, get: function() {
      return r.createContextKey;
    } }), Object.defineProperty(e, "ROOT_CONTEXT", { enumerable: !0, get: function() {
      return r.ROOT_CONTEXT;
    } });
    var n = /* @__PURE__ */ IT();
    Object.defineProperty(e, "DiagConsoleLogger", { enumerable: !0, get: function() {
      return n.DiagConsoleLogger;
    } });
    var o = /* @__PURE__ */ Wi();
    Object.defineProperty(e, "DiagLogLevel", { enumerable: !0, get: function() {
      return o.DiagLogLevel;
    } });
    var a = /* @__PURE__ */ Sm();
    Object.defineProperty(e, "createNoopMeter", { enumerable: !0, get: function() {
      return a.createNoopMeter;
    } });
    var s = /* @__PURE__ */ TT();
    Object.defineProperty(e, "ValueType", { enumerable: !0, get: function() {
      return s.ValueType;
    } });
    var i = /* @__PURE__ */ Im();
    Object.defineProperty(e, "defaultTextMapGetter", { enumerable: !0, get: function() {
      return i.defaultTextMapGetter;
    } }), Object.defineProperty(e, "defaultTextMapSetter", { enumerable: !0, get: function() {
      return i.defaultTextMapSetter;
    } });
    var u = /* @__PURE__ */ Pm();
    Object.defineProperty(e, "ProxyTracer", { enumerable: !0, get: function() {
      return u.ProxyTracer;
    } });
    var c = /* @__PURE__ */ km();
    Object.defineProperty(e, "ProxyTracerProvider", { enumerable: !0, get: function() {
      return c.ProxyTracerProvider;
    } });
    var l = /* @__PURE__ */ PT();
    Object.defineProperty(e, "SamplingDecision", { enumerable: !0, get: function() {
      return l.SamplingDecision;
    } });
    var y = /* @__PURE__ */ kT();
    Object.defineProperty(e, "SpanKind", { enumerable: !0, get: function() {
      return y.SpanKind;
    } });
    var d = /* @__PURE__ */ NT();
    Object.defineProperty(e, "SpanStatusCode", { enumerable: !0, get: function() {
      return d.SpanStatusCode;
    } });
    var f = /* @__PURE__ */ Tm();
    Object.defineProperty(e, "TraceFlags", { enumerable: !0, get: function() {
      return f.TraceFlags;
    } });
    var g = /* @__PURE__ */ jT();
    Object.defineProperty(e, "createTraceState", { enumerable: !0, get: function() {
      return g.createTraceState;
    } });
    var _ = /* @__PURE__ */ Yi();
    Object.defineProperty(e, "isSpanContextValid", { enumerable: !0, get: function() {
      return _.isSpanContextValid;
    } }), Object.defineProperty(e, "isValidTraceId", { enumerable: !0, get: function() {
      return _.isValidTraceId;
    } }), Object.defineProperty(e, "isValidSpanId", { enumerable: !0, get: function() {
      return _.isValidSpanId;
    } });
    var m = /* @__PURE__ */ Ji();
    Object.defineProperty(e, "INVALID_SPANID", { enumerable: !0, get: function() {
      return m.INVALID_SPANID;
    } }), Object.defineProperty(e, "INVALID_TRACEID", { enumerable: !0, get: function() {
      return m.INVALID_TRACEID;
    } }), Object.defineProperty(e, "INVALID_SPAN_CONTEXT", { enumerable: !0, get: function() {
      return m.INVALID_SPAN_CONTEXT;
    } });
    const h = /* @__PURE__ */ MT();
    Object.defineProperty(e, "context", { enumerable: !0, get: function() {
      return h.context;
    } });
    const p = /* @__PURE__ */ xT();
    Object.defineProperty(e, "diag", { enumerable: !0, get: function() {
      return p.diag;
    } });
    const v = /* @__PURE__ */ LT();
    Object.defineProperty(e, "metrics", { enumerable: !0, get: function() {
      return v.metrics;
    } });
    const $ = /* @__PURE__ */ FT();
    Object.defineProperty(e, "propagation", { enumerable: !0, get: function() {
      return $.propagation;
    } });
    const b = /* @__PURE__ */ GT();
    Object.defineProperty(e, "trace", { enumerable: !0, get: function() {
      return b.trace;
    } }), e.default = {
      context: h.context,
      diag: p.diag,
      metrics: v.metrics,
      propagation: $.propagation,
      trace: b.trace
    };
  })(ei)), ei;
}
var _i = /* @__PURE__ */ BT(), HT = Object.defineProperty, WT = (e, t) => {
  for (var r in t)
    HT(e, r, { get: t[r], enumerable: !0 });
}, Nm = "AI_NoOutputSpecifiedError", Am = `vercel.ai.error.${Nm}`, JT = Symbol.for(Am), Cm, KT = class extends ie {
  // used in isInstance
  constructor({ message: e = "No output specified." } = {}) {
    super({ name: Nm, message: e }), this[Cm] = !0;
  }
  static isInstance(e) {
    return ie.hasMarker(e, Am);
  }
};
Cm = JT;
function YT(e) {
  const t = "AI SDK Warning:";
  switch (e.type) {
    case "unsupported-setting": {
      let r = `${t} The "${e.setting}" setting is not supported by this model`;
      return e.details && (r += ` - ${e.details}`), r;
    }
    case "unsupported-tool": {
      const r = "name" in e.tool ? e.tool.name : "unknown tool";
      let n = `${t} The tool "${r}" is not supported by this model`;
      return e.details && (n += ` - ${e.details}`), n;
    }
    case "other":
      return `${t} ${e.message}`;
    default:
      return `${t} ${JSON.stringify(e, null, 2)}`;
  }
}
var XT = "AI SDK Warning System: To turn off warning logging, set the AI_SDK_LOG_WARNINGS global to false.", Jf = !1, QT = (e) => {
  if (e.length === 0)
    return;
  const t = globalThis.AI_SDK_LOG_WARNINGS;
  if (t !== !1) {
    if (typeof t == "function") {
      t(e);
      return;
    }
    Jf || (Jf = !0, console.info(XT));
    for (const r of e)
      console.warn(YT(r));
  }
}, jm = "AI_InvalidArgumentError", Mm = `vercel.ai.error.${jm}`, eO = Symbol.for(Mm), xm, yt = class extends ie {
  constructor({
    parameter: e,
    value: t,
    message: r
  }) {
    super({
      name: jm,
      message: `Invalid argument for parameter ${e}: ${r}`
    }), this[xm] = !0, this.parameter = e, this.value = t;
  }
  static isInstance(e) {
    return ie.hasMarker(e, Mm);
  }
};
xm = eO;
var Dm = "AI_InvalidToolInputError", qm = `vercel.ai.error.${Dm}`, tO = Symbol.for(qm), Lm, zm = class extends ie {
  constructor({
    toolInput: e,
    toolName: t,
    cause: r,
    message: n = `Invalid input for tool ${t}: ${jn(r)}`
  }) {
    super({ name: Dm, message: n, cause: r }), this[Lm] = !0, this.toolInput = e, this.toolName = t;
  }
  static isInstance(e) {
    return ie.hasMarker(e, qm);
  }
};
Lm = tO;
var Vm = "AI_NoObjectGeneratedError", Um = `vercel.ai.error.${Vm}`, rO = Symbol.for(Um), Fm, Kf = class extends ie {
  constructor({
    message: e = "No object generated.",
    cause: t,
    text: r,
    response: n,
    usage: o,
    finishReason: a
  }) {
    super({ name: Vm, message: e, cause: t }), this[Fm] = !0, this.text = r, this.response = n, this.usage = o, this.finishReason = a;
  }
  static isInstance(e) {
    return ie.hasMarker(e, Um);
  }
};
Fm = rO;
var Zm = "AI_NoSuchToolError", Gm = `vercel.ai.error.${Zm}`, nO = Symbol.for(Gm), Bm, bi = class extends ie {
  constructor({
    toolName: e,
    availableTools: t = void 0,
    message: r = `Model tried to call unavailable tool '${e}'. ${t === void 0 ? "No tools are available." : `Available tools: ${t.join(", ")}.`}`
  }) {
    super({ name: Zm, message: r }), this[Bm] = !0, this.toolName = e, this.availableTools = t;
  }
  static isInstance(e) {
    return ie.hasMarker(e, Gm);
  }
};
Bm = nO;
var Hm = "AI_ToolCallRepairError", Wm = `vercel.ai.error.${Hm}`, oO = Symbol.for(Wm), Jm, aO = class extends ie {
  constructor({
    cause: e,
    originalError: t,
    message: r = `Error repairing tool call: ${jn(e)}`
  }) {
    super({ name: Hm, message: r, cause: e }), this[Jm] = !0, this.originalError = t;
  }
  static isInstance(e) {
    return ie.hasMarker(e, Wm);
  }
};
Jm = oO;
var sO = class extends ie {
  constructor(e) {
    super({
      name: "AI_UnsupportedModelVersionError",
      message: `Unsupported model version ${e.version} for provider "${e.provider}" and model "${e.modelId}". AI SDK 5 only supports models that implement specification version "v2".`
    }), this.version = e.version, this.provider = e.provider, this.modelId = e.modelId;
  }
}, Km = "AI_InvalidMessageRoleError", Ym = `vercel.ai.error.${Km}`, iO = Symbol.for(Ym), Xm, uO = class extends ie {
  constructor({
    role: e,
    message: t = `Invalid message role: '${e}'. Must be one of: "system", "user", "assistant", "tool".`
  }) {
    super({ name: Km, message: t }), this[Xm] = !0, this.role = e;
  }
  static isInstance(e) {
    return ie.hasMarker(e, Ym);
  }
};
Xm = iO;
var Qm = "AI_DownloadError", eg = `vercel.ai.error.${Qm}`, cO = Symbol.for(eg), tg, ci = class extends ie {
  constructor({
    url: e,
    statusCode: t,
    statusText: r,
    cause: n,
    message: o = n == null ? `Failed to download ${e}: ${t} ${r}` : `Failed to download ${e}: ${n}`
  }) {
    super({ name: Qm, message: o, cause: n }), this[tg] = !0, this.url = e, this.statusCode = t, this.statusText = r;
  }
  static isInstance(e) {
    return ie.hasMarker(e, eg);
  }
};
tg = cO;
var rg = "AI_RetryError", ng = `vercel.ai.error.${rg}`, lO = Symbol.for(ng), og, Yf = class extends ie {
  constructor({
    message: e,
    reason: t,
    errors: r
  }) {
    super({ name: rg, message: e }), this[og] = !0, this.reason = t, this.errors = r, this.lastError = r[r.length - 1];
  }
  static isInstance(e) {
    return ie.hasMarker(e, ng);
  }
};
og = lO;
function Xf(e) {
  if (typeof e != "string") {
    if (e.specificationVersion !== "v2")
      throw new sO({
        version: e.specificationVersion,
        provider: e.provider,
        modelId: e.modelId
      });
    return e;
  }
  return dO().languageModel(e);
}
function dO() {
  var e;
  return (e = globalThis.AI_SDK_DEFAULT_PROVIDER) != null ? e : mT;
}
var fO = [
  {
    mediaType: "image/gif",
    bytesPrefix: [71, 73, 70]
    // GIF
  },
  {
    mediaType: "image/png",
    bytesPrefix: [137, 80, 78, 71]
    // PNG
  },
  {
    mediaType: "image/jpeg",
    bytesPrefix: [255, 216]
    // JPEG
  },
  {
    mediaType: "image/webp",
    bytesPrefix: [
      82,
      73,
      70,
      70,
      // "RIFF"
      null,
      null,
      null,
      null,
      // file size (variable)
      87,
      69,
      66,
      80
      // "WEBP"
    ]
  },
  {
    mediaType: "image/bmp",
    bytesPrefix: [66, 77]
  },
  {
    mediaType: "image/tiff",
    bytesPrefix: [73, 73, 42, 0]
  },
  {
    mediaType: "image/tiff",
    bytesPrefix: [77, 77, 0, 42]
  },
  {
    mediaType: "image/avif",
    bytesPrefix: [
      0,
      0,
      0,
      32,
      102,
      116,
      121,
      112,
      97,
      118,
      105,
      102
    ]
  },
  {
    mediaType: "image/heic",
    bytesPrefix: [
      0,
      0,
      0,
      32,
      102,
      116,
      121,
      112,
      104,
      101,
      105,
      99
    ]
  }
], pO = (e) => {
  const t = typeof e == "string" ? $a(e) : e, r = (t[6] & 127) << 21 | (t[7] & 127) << 14 | (t[8] & 127) << 7 | t[9] & 127;
  return t.slice(r + 10);
};
function hO(e) {
  return typeof e == "string" && e.startsWith("SUQz") || typeof e != "string" && e.length > 10 && e[0] === 73 && // 'I'
  e[1] === 68 && // 'D'
  e[2] === 51 ? pO(e) : e;
}
function mO({
  data: e,
  signatures: t
}) {
  const r = hO(e), n = typeof r == "string" ? $a(
    r.substring(0, Math.min(r.length, 24))
  ) : r;
  for (const o of t)
    if (n.length >= o.bytesPrefix.length && o.bytesPrefix.every(
      (a, s) => a === null || n[s] === a
    ))
      return o.mediaType;
}
var ag = "5.0.100", gO = async ({ url: e }) => {
  var t;
  const r = e.toString();
  try {
    const n = await fetch(r, {
      headers: xr(
        {},
        `ai-sdk/${ag}`,
        Zi()
      )
    });
    if (!n.ok)
      throw new ci({
        url: r,
        statusCode: n.status,
        statusText: n.statusText
      });
    return {
      data: new Uint8Array(await n.arrayBuffer()),
      mediaType: (t = n.headers.get("content-type")) != null ? t : void 0
    };
  } catch (n) {
    throw ci.isInstance(n) ? n : new ci({ url: r, cause: n });
  }
}, yO = (e = gO) => (t) => Promise.all(
  t.map(
    async (r) => r.isUrlSupportedByModel ? null : e(r)
  )
);
function vO(e) {
  try {
    const [t, r] = e.split(",");
    return {
      mediaType: t.split(";")[0].split(":")[1],
      base64Content: r
    };
  } catch {
    return {
      mediaType: void 0,
      base64Content: void 0
    };
  }
}
var sg = _e([
  T(),
  ra(Uint8Array),
  ra(ArrayBuffer),
  bS(
    // Buffer might not be available in some environments such as CloudFlare:
    (e) => {
      var t, r;
      return (r = (t = globalThis.Buffer) == null ? void 0 : t.isBuffer(e)) != null ? r : !1;
    },
    { message: "Must be a Buffer" }
  )
]);
function ig(e) {
  if (e instanceof Uint8Array)
    return { data: e, mediaType: void 0 };
  if (e instanceof ArrayBuffer)
    return { data: new Uint8Array(e), mediaType: void 0 };
  if (typeof e == "string")
    try {
      e = new URL(e);
    } catch {
    }
  if (e instanceof URL && e.protocol === "data:") {
    const { mediaType: t, base64Content: r } = vO(
      e.toString()
    );
    if (t == null || r == null)
      throw new ie({
        name: "InvalidDataContentError",
        message: `Invalid data URL format in content ${e.toString()}`
      });
    return { data: r, mediaType: t };
  }
  return { data: e, mediaType: void 0 };
}
function _O(e) {
  return typeof e == "string" ? e : e instanceof ArrayBuffer ? aa(new Uint8Array(e)) : aa(e);
}
async function bO({
  prompt: e,
  supportedUrls: t,
  download: r = yO()
}) {
  const n = await EO(
    e.messages,
    r,
    t
  );
  return [
    ...e.system != null ? [{ role: "system", content: e.system }] : [],
    ...e.messages.map(
      (o) => wO({ message: o, downloadedAssets: n })
    )
  ];
}
function wO({
  message: e,
  downloadedAssets: t
}) {
  const r = e.role;
  switch (r) {
    case "system":
      return {
        role: "system",
        content: e.content,
        providerOptions: e.providerOptions
      };
    case "user":
      return typeof e.content == "string" ? {
        role: "user",
        content: [{ type: "text", text: e.content }],
        providerOptions: e.providerOptions
      } : {
        role: "user",
        content: e.content.map((n) => $O(n, t)).filter((n) => n.type !== "text" || n.text !== ""),
        providerOptions: e.providerOptions
      };
    case "assistant":
      return typeof e.content == "string" ? {
        role: "assistant",
        content: [{ type: "text", text: e.content }],
        providerOptions: e.providerOptions
      } : {
        role: "assistant",
        content: e.content.filter(
          // remove empty text parts (no text, and no provider options):
          (n) => n.type !== "text" || n.text !== "" || n.providerOptions != null
        ).map((n) => {
          const o = n.providerOptions;
          switch (n.type) {
            case "file": {
              const { data: a, mediaType: s } = ig(
                n.data
              );
              return {
                type: "file",
                data: a,
                filename: n.filename,
                mediaType: s ?? n.mediaType,
                providerOptions: o
              };
            }
            case "reasoning":
              return {
                type: "reasoning",
                text: n.text,
                providerOptions: o
              };
            case "text":
              return {
                type: "text",
                text: n.text,
                providerOptions: o
              };
            case "tool-call":
              return {
                type: "tool-call",
                toolCallId: n.toolCallId,
                toolName: n.toolName,
                input: n.input,
                providerExecuted: n.providerExecuted,
                providerOptions: o
              };
            case "tool-result":
              return {
                type: "tool-result",
                toolCallId: n.toolCallId,
                toolName: n.toolName,
                output: n.output,
                providerOptions: o
              };
          }
        }),
        providerOptions: e.providerOptions
      };
    case "tool":
      return {
        role: "tool",
        content: e.content.map((n) => ({
          type: "tool-result",
          toolCallId: n.toolCallId,
          toolName: n.toolName,
          output: n.output,
          providerOptions: n.providerOptions
        })),
        providerOptions: e.providerOptions
      };
    default: {
      const n = r;
      throw new uO({ role: n });
    }
  }
}
async function EO(e, t, r) {
  const n = e.filter((a) => a.role === "user").map((a) => a.content).filter(
    (a) => Array.isArray(a)
  ).flat().filter(
    (a) => a.type === "image" || a.type === "file"
  ).map((a) => {
    var s;
    const i = (s = a.mediaType) != null ? s : a.type === "image" ? "image/*" : void 0;
    let u = a.type === "image" ? a.image : a.data;
    if (typeof u == "string")
      try {
        u = new URL(u);
      } catch {
      }
    return { mediaType: i, data: u };
  }).filter(
    (a) => a.data instanceof URL
  ).map((a) => ({
    url: a.data,
    isUrlSupportedByModel: a.mediaType != null && RS({
      url: a.data.toString(),
      mediaType: a.mediaType,
      supportedUrls: r
    })
  })), o = await t(n);
  return Object.fromEntries(
    o.map(
      (a, s) => a == null ? null : [
        n[s].url.toString(),
        { data: a.data, mediaType: a.mediaType }
      ]
    ).filter((a) => a != null)
  );
}
function $O(e, t) {
  var r;
  if (e.type === "text")
    return {
      type: "text",
      text: e.text,
      providerOptions: e.providerOptions
    };
  let n;
  const o = e.type;
  switch (o) {
    case "image":
      n = e.image;
      break;
    case "file":
      n = e.data;
      break;
    default:
      throw new Error(`Unsupported part type: ${o}`);
  }
  const { data: a, mediaType: s } = ig(n);
  let i = s ?? e.mediaType, u = a;
  if (u instanceof URL) {
    const c = t[u.toString()];
    c && (u = c.data, i ?? (i = c.mediaType));
  }
  switch (o) {
    case "image":
      return (u instanceof Uint8Array || typeof u == "string") && (i = (r = mO({ data: u, signatures: fO })) != null ? r : i), {
        type: "file",
        mediaType: i ?? "image/*",
        // any image
        filename: void 0,
        data: u,
        providerOptions: e.providerOptions
      };
    case "file": {
      if (i == null)
        throw new Error("Media type is missing for file part");
      return {
        type: "file",
        mediaType: i,
        filename: e.filename,
        data: u,
        providerOptions: e.providerOptions
      };
    }
  }
}
function Qf({
  maxOutputTokens: e,
  temperature: t,
  topP: r,
  topK: n,
  presencePenalty: o,
  frequencyPenalty: a,
  seed: s,
  stopSequences: i
}) {
  if (e != null) {
    if (!Number.isInteger(e))
      throw new yt({
        parameter: "maxOutputTokens",
        value: e,
        message: "maxOutputTokens must be an integer"
      });
    if (e < 1)
      throw new yt({
        parameter: "maxOutputTokens",
        value: e,
        message: "maxOutputTokens must be >= 1"
      });
  }
  if (t != null && typeof t != "number")
    throw new yt({
      parameter: "temperature",
      value: t,
      message: "temperature must be a number"
    });
  if (r != null && typeof r != "number")
    throw new yt({
      parameter: "topP",
      value: r,
      message: "topP must be a number"
    });
  if (n != null && typeof n != "number")
    throw new yt({
      parameter: "topK",
      value: n,
      message: "topK must be a number"
    });
  if (o != null && typeof o != "number")
    throw new yt({
      parameter: "presencePenalty",
      value: o,
      message: "presencePenalty must be a number"
    });
  if (a != null && typeof a != "number")
    throw new yt({
      parameter: "frequencyPenalty",
      value: a,
      message: "frequencyPenalty must be a number"
    });
  if (s != null && !Number.isInteger(s))
    throw new yt({
      parameter: "seed",
      value: s,
      message: "seed must be an integer"
    });
  return {
    maxOutputTokens: e,
    temperature: t,
    topP: r,
    topK: n,
    presencePenalty: o,
    frequencyPenalty: a,
    stopSequences: i,
    seed: s
  };
}
function SO(e) {
  return e != null && Object.keys(e).length > 0;
}
function IO({
  tools: e,
  toolChoice: t,
  activeTools: r
}) {
  return SO(e) ? {
    tools: (r != null ? Object.entries(e).filter(
      ([o]) => r.includes(o)
    ) : Object.entries(e)).map(([o, a]) => {
      const s = a.type;
      switch (s) {
        case void 0:
        case "dynamic":
        case "function":
          return {
            type: "function",
            name: o,
            description: a.description,
            inputSchema: Ea(a.inputSchema).jsonSchema,
            providerOptions: a.providerOptions
          };
        case "provider-defined":
          return {
            type: "provider-defined",
            name: o,
            id: a.id,
            args: a.args
          };
        default: {
          const i = s;
          throw new Error(`Unsupported tool type: ${i}`);
        }
      }
    }),
    toolChoice: t == null ? { type: "auto" } : typeof t == "string" ? { type: t } : { type: "tool", toolName: t.toolName }
  } : {
    tools: void 0,
    toolChoice: void 0
  };
}
var kn = em(
  () => _e([
    W$(),
    T(),
    V(),
    He(),
    Ce(T(), kn),
    ee(kn)
  ])
), bt = Ce(
  T(),
  Ce(T(), kn)
), ug = R({
  type: Z("text"),
  text: T(),
  providerOptions: bt.optional()
}), TO = R({
  type: Z("image"),
  image: _e([sg, ra(URL)]),
  mediaType: T().optional(),
  providerOptions: bt.optional()
}), cg = R({
  type: Z("file"),
  data: _e([sg, ra(URL)]),
  filename: T().optional(),
  mediaType: T(),
  providerOptions: bt.optional()
}), OO = R({
  type: Z("reasoning"),
  text: T(),
  providerOptions: bt.optional()
}), RO = R({
  type: Z("tool-call"),
  toolCallId: T(),
  toolName: T(),
  input: At(),
  providerOptions: bt.optional(),
  providerExecuted: He().optional()
}), PO = Me("type", [
  R({
    type: Z("text"),
    value: T()
  }),
  R({
    type: Z("json"),
    value: kn
  }),
  R({
    type: Z("error-text"),
    value: T()
  }),
  R({
    type: Z("error-json"),
    value: kn
  }),
  R({
    type: Z("content"),
    value: ee(
      _e([
        R({
          type: Z("text"),
          text: T()
        }),
        R({
          type: Z("media"),
          data: T(),
          mediaType: T()
        })
      ])
    )
  })
]), lg = R({
  type: Z("tool-result"),
  toolCallId: T(),
  toolName: T(),
  output: PO,
  providerOptions: bt.optional()
}), kO = R(
  {
    role: Z("system"),
    content: T(),
    providerOptions: bt.optional()
  }
), NO = R({
  role: Z("user"),
  content: _e([
    T(),
    ee(_e([ug, TO, cg]))
  ]),
  providerOptions: bt.optional()
}), AO = R({
  role: Z("assistant"),
  content: _e([
    T(),
    ee(
      _e([
        ug,
        cg,
        OO,
        RO,
        lg
      ])
    )
  ]),
  providerOptions: bt.optional()
}), CO = R({
  role: Z("tool"),
  content: ee(lg),
  providerOptions: bt.optional()
}), jO = _e([
  kO,
  NO,
  AO,
  CO
]);
async function MO(e) {
  if (e.prompt == null && e.messages == null)
    throw new sr({
      prompt: e,
      message: "prompt or messages must be defined"
    });
  if (e.prompt != null && e.messages != null)
    throw new sr({
      prompt: e,
      message: "prompt and messages cannot be defined at the same time"
    });
  if (e.system != null && typeof e.system != "string")
    throw new sr({
      prompt: e,
      message: "system must be a string"
    });
  let t;
  if (e.prompt != null && typeof e.prompt == "string")
    t = [{ role: "user", content: e.prompt }];
  else if (e.prompt != null && Array.isArray(e.prompt))
    t = e.prompt;
  else if (e.messages != null)
    t = e.messages;
  else
    throw new sr({
      prompt: e,
      message: "prompt or messages must be defined"
    });
  if (t.length === 0)
    throw new sr({
      prompt: e,
      message: "messages must not be empty"
    });
  const r = await Ct({
    value: t,
    schema: ee(jO)
  });
  if (!r.success)
    throw new sr({
      prompt: e,
      message: "The messages must be a ModelMessage[]. If you have passed a UIMessage[], you can use convertToModelMessages to convert them.",
      cause: r.error
    });
  return {
    messages: t,
    system: e.system
  };
}
function xO(e) {
  return Hi.isInstance(e) || vm.isInstance(e) ? new ie({
    name: "GatewayError",
    message: "Vercel AI Gateway access failed. If you want to use AI SDK providers directly, use the providers, e.g. @ai-sdk/openai, or register a different global default provider.",
    cause: e
  }) : e;
}
function wi({
  operationId: e,
  telemetry: t
}) {
  return {
    // standardized operation and resource name:
    "operation.name": `${e}${(t == null ? void 0 : t.functionId) != null ? ` ${t.functionId}` : ""}`,
    "resource.name": t == null ? void 0 : t.functionId,
    // detailed, AI SDK specific data:
    "ai.operationId": e,
    "ai.telemetry.functionId": t == null ? void 0 : t.functionId
  };
}
function DO({
  model: e,
  settings: t,
  telemetry: r,
  headers: n
}) {
  var o;
  return {
    "ai.model.provider": e.provider,
    "ai.model.id": e.modelId,
    // settings:
    ...Object.entries(t).reduce((a, [s, i]) => (a[`ai.settings.${s}`] = i, a), {}),
    // add metadata as attributes:
    ...Object.entries((o = r == null ? void 0 : r.metadata) != null ? o : {}).reduce(
      (a, [s, i]) => (a[`ai.telemetry.metadata.${s}`] = i, a),
      {}
    ),
    // request headers
    ...Object.entries(n ?? {}).reduce((a, [s, i]) => (i !== void 0 && (a[`ai.request.headers.${s}`] = i), a), {})
  };
}
var qO = {
  startSpan() {
    return Bo;
  },
  startActiveSpan(e, t, r, n) {
    if (typeof t == "function")
      return t(Bo);
    if (typeof r == "function")
      return r(Bo);
    if (typeof n == "function")
      return n(Bo);
  }
}, Bo = {
  spanContext() {
    return LO;
  },
  setAttribute() {
    return this;
  },
  setAttributes() {
    return this;
  },
  addEvent() {
    return this;
  },
  addLink() {
    return this;
  },
  addLinks() {
    return this;
  },
  setStatus() {
    return this;
  },
  updateName() {
    return this;
  },
  end() {
    return this;
  },
  isRecording() {
    return !1;
  },
  recordException() {
    return this;
  }
}, LO = {
  traceId: "",
  spanId: "",
  traceFlags: 0
};
function zO({
  isEnabled: e = !1,
  tracer: t
} = {}) {
  return e ? t || _i.trace.getTracer("ai") : qO;
}
function Ei({
  name: e,
  tracer: t,
  attributes: r,
  fn: n,
  endWhenDone: o = !0
}) {
  return t.startActiveSpan(e, { attributes: r }, async (a) => {
    try {
      const s = await n(a);
      return o && a.end(), s;
    } catch (s) {
      try {
        dg(a, s);
      } finally {
        a.end();
      }
      throw s;
    }
  });
}
function dg(e, t) {
  t instanceof Error ? (e.recordException({
    name: t.name,
    message: t.message,
    stack: t.stack
  }), e.setStatus({
    code: _i.SpanStatusCode.ERROR,
    message: t.message
  })) : e.setStatus({ code: _i.SpanStatusCode.ERROR });
}
function Rr({
  telemetry: e,
  attributes: t
}) {
  return (e == null ? void 0 : e.isEnabled) !== !0 ? {} : Object.entries(t).reduce((r, [n, o]) => {
    if (o == null)
      return r;
    if (typeof o == "object" && "input" in o && typeof o.input == "function") {
      if ((e == null ? void 0 : e.recordInputs) === !1)
        return r;
      const a = o.input();
      return a == null ? r : { ...r, [n]: a };
    }
    if (typeof o == "object" && "output" in o && typeof o.output == "function") {
      if ((e == null ? void 0 : e.recordOutputs) === !1)
        return r;
      const a = o.output();
      return a == null ? r : { ...r, [n]: a };
    }
    return { ...r, [n]: o };
  }, {});
}
function VO(e) {
  return JSON.stringify(
    e.map((t) => ({
      ...t,
      content: typeof t.content == "string" ? t.content : t.content.map(
        (r) => r.type === "file" ? {
          ...r,
          data: r.data instanceof Uint8Array ? _O(r.data) : r.data
        } : r
      )
    }))
  );
}
function UO(e, t) {
  return {
    inputTokens: $n(e.inputTokens, t.inputTokens),
    outputTokens: $n(e.outputTokens, t.outputTokens),
    totalTokens: $n(e.totalTokens, t.totalTokens),
    reasoningTokens: $n(
      e.reasoningTokens,
      t.reasoningTokens
    ),
    cachedInputTokens: $n(
      e.cachedInputTokens,
      t.cachedInputTokens
    )
  };
}
function $n(e, t) {
  return e == null && t == null ? void 0 : (e ?? 0) + (t ?? 0);
}
function FO(e) {
  return e === void 0 ? [] : Array.isArray(e) ? e : [e];
}
function ZO({
  error: e,
  exponentialBackoffDelay: t
}) {
  const r = e.responseHeaders;
  if (!r)
    return t;
  let n;
  const o = r["retry-after-ms"];
  if (o) {
    const s = parseFloat(o);
    Number.isNaN(s) || (n = s);
  }
  const a = r["retry-after"];
  if (a && n === void 0) {
    const s = parseFloat(a);
    Number.isNaN(s) ? n = Date.parse(a) - Date.now() : n = s * 1e3;
  }
  return n != null && !Number.isNaN(n) && 0 <= n && (n < 60 * 1e3 || n < t) ? n : t;
}
var GO = ({
  maxRetries: e = 2,
  initialDelayInMs: t = 2e3,
  backoffFactor: r = 2,
  abortSignal: n
} = {}) => async (o) => fg(o, {
  maxRetries: e,
  delayInMs: t,
  backoffFactor: r,
  abortSignal: n
});
async function fg(e, {
  maxRetries: t,
  delayInMs: r,
  backoffFactor: n,
  abortSignal: o
}, a = []) {
  try {
    return await e();
  } catch (s) {
    if (Ar(s) || t === 0)
      throw s;
    const i = tm(s), u = [...a, s], c = u.length;
    if (c > t)
      throw new Yf({
        message: `Failed after ${c} attempts. Last error: ${i}`,
        reason: "maxRetriesExceeded",
        errors: u
      });
    if (s instanceof Error && Ae.isInstance(s) && s.isRetryable === !0 && c <= t)
      return await SS(
        ZO({
          error: s,
          exponentialBackoffDelay: r
        }),
        { abortSignal: o }
      ), fg(
        e,
        {
          maxRetries: t,
          delayInMs: n * r,
          backoffFactor: n,
          abortSignal: o
        },
        u
      );
    throw c === 1 ? s : new Yf({
      message: `Failed after ${c} attempts with non-retryable error: '${i}'`,
      reason: "errorNotRetryable",
      errors: u
    });
  }
}
function BO({
  maxRetries: e,
  abortSignal: t
}) {
  if (e != null) {
    if (!Number.isInteger(e))
      throw new yt({
        parameter: "maxRetries",
        value: e,
        message: "maxRetries must be an integer"
      });
    if (e < 0)
      throw new yt({
        parameter: "maxRetries",
        value: e,
        message: "maxRetries must be >= 0"
      });
  }
  const r = e ?? 2;
  return {
    maxRetries: r,
    retry: GO({
      maxRetries: r,
      abortSignal: t
    })
  };
}
function ep(e) {
  const t = e.filter(
    (r) => r.type === "text"
  );
  if (t.length !== 0)
    return t.map((r) => r.text).join("");
}
var HO = class {
  constructor({
    data: e,
    mediaType: t
  }) {
    const r = e instanceof Uint8Array;
    this.base64Data = r ? void 0 : e, this.uint8ArrayData = r ? e : void 0, this.mediaType = t;
  }
  // lazy conversion with caching to avoid unnecessary conversion overhead:
  get base64() {
    return this.base64Data == null && (this.base64Data = aa(this.uint8ArrayData)), this.base64Data;
  }
  // lazy conversion with caching to avoid unnecessary conversion overhead:
  get uint8Array() {
    return this.uint8ArrayData == null && (this.uint8ArrayData = $a(this.base64Data)), this.uint8ArrayData;
  }
};
async function WO({
  toolCall: e,
  tools: t,
  repairToolCall: r,
  system: n,
  messages: o
}) {
  try {
    if (t == null)
      throw new bi({ toolName: e.toolName });
    try {
      return await tp({ toolCall: e, tools: t });
    } catch (a) {
      if (r == null || !(bi.isInstance(a) || zm.isInstance(a)))
        throw a;
      let s = null;
      try {
        s = await r({
          toolCall: e,
          tools: t,
          inputSchema: ({ toolName: i }) => {
            const { inputSchema: u } = t[i];
            return Ea(u).jsonSchema;
          },
          system: n,
          messages: o,
          error: a
        });
      } catch (i) {
        throw new aO({
          cause: i,
          originalError: a
        });
      }
      if (s == null)
        throw a;
      return await tp({ toolCall: s, tools: t });
    }
  } catch (a) {
    const s = await cr({ text: e.input }), i = s.success ? s.value : e.input;
    return {
      type: "tool-call",
      toolCallId: e.toolCallId,
      toolName: e.toolName,
      input: i,
      dynamic: !0,
      invalid: !0,
      error: a
    };
  }
}
async function tp({
  toolCall: e,
  tools: t
}) {
  const r = e.toolName, n = t[r];
  if (n == null)
    throw new bi({
      toolName: e.toolName,
      availableTools: Object.keys(t)
    });
  const o = Ea(n.inputSchema), a = e.input.trim() === "" ? await Ct({ value: {}, schema: o }) : await cr({ text: e.input, schema: o });
  if (a.success === !1)
    throw new zm({
      toolName: r,
      toolInput: e.input,
      cause: a.error
    });
  return n.type === "dynamic" ? {
    type: "tool-call",
    toolCallId: e.toolCallId,
    toolName: e.toolName,
    input: a.value,
    providerExecuted: e.providerExecuted,
    providerMetadata: e.providerMetadata,
    dynamic: !0
  } : {
    type: "tool-call",
    toolCallId: e.toolCallId,
    toolName: r,
    input: a.value,
    providerExecuted: e.providerExecuted,
    providerMetadata: e.providerMetadata
  };
}
var JO = class {
  constructor({
    content: e,
    finishReason: t,
    usage: r,
    warnings: n,
    request: o,
    response: a,
    providerMetadata: s
  }) {
    this.content = e, this.finishReason = t, this.usage = r, this.warnings = n, this.request = o, this.response = a, this.providerMetadata = s;
  }
  get text() {
    return this.content.filter((e) => e.type === "text").map((e) => e.text).join("");
  }
  get reasoning() {
    return this.content.filter((e) => e.type === "reasoning");
  }
  get reasoningText() {
    return this.reasoning.length === 0 ? void 0 : this.reasoning.map((e) => e.text).join("");
  }
  get files() {
    return this.content.filter((e) => e.type === "file").map((e) => e.file);
  }
  get sources() {
    return this.content.filter((e) => e.type === "source");
  }
  get toolCalls() {
    return this.content.filter((e) => e.type === "tool-call");
  }
  get staticToolCalls() {
    return this.toolCalls.filter(
      (e) => e.dynamic !== !0
    );
  }
  get dynamicToolCalls() {
    return this.toolCalls.filter(
      (e) => e.dynamic === !0
    );
  }
  get toolResults() {
    return this.content.filter((e) => e.type === "tool-result");
  }
  get staticToolResults() {
    return this.toolResults.filter(
      (e) => e.dynamic !== !0
    );
  }
  get dynamicToolResults() {
    return this.toolResults.filter(
      (e) => e.dynamic === !0
    );
  }
};
function KO(e) {
  return ({ steps: t }) => t.length === e;
}
async function YO({
  stopConditions: e,
  steps: t
}) {
  return (await Promise.all(e.map((r) => r({ steps: t })))).some((r) => r);
}
function li({
  output: e,
  tool: t,
  errorMode: r
}) {
  return r === "text" ? { type: "error-text", value: jn(e) } : r === "json" ? { type: "error-json", value: rp(e) } : t != null && t.toModelOutput ? t.toModelOutput(e) : typeof e == "string" ? { type: "text", value: e } : { type: "json", value: rp(e) };
}
function rp(e) {
  return e === void 0 ? null : e;
}
function XO({
  content: e,
  tools: t
}) {
  const r = [], n = e.filter((a) => a.type !== "source").filter(
    (a) => (a.type !== "tool-result" || a.providerExecuted) && (a.type !== "tool-error" || a.providerExecuted)
  ).filter((a) => a.type !== "text" || a.text.length > 0).map((a) => {
    switch (a.type) {
      case "text":
        return {
          type: "text",
          text: a.text,
          providerOptions: a.providerMetadata
        };
      case "reasoning":
        return {
          type: "reasoning",
          text: a.text,
          providerOptions: a.providerMetadata
        };
      case "file":
        return {
          type: "file",
          data: a.file.base64,
          mediaType: a.file.mediaType,
          providerOptions: a.providerMetadata
        };
      case "tool-call":
        return {
          type: "tool-call",
          toolCallId: a.toolCallId,
          toolName: a.toolName,
          input: a.input,
          providerExecuted: a.providerExecuted,
          providerOptions: a.providerMetadata
        };
      case "tool-result":
        return {
          type: "tool-result",
          toolCallId: a.toolCallId,
          toolName: a.toolName,
          output: li({
            tool: t == null ? void 0 : t[a.toolName],
            output: a.output,
            errorMode: "none"
          }),
          providerExecuted: !0,
          providerOptions: a.providerMetadata
        };
      case "tool-error":
        return {
          type: "tool-result",
          toolCallId: a.toolCallId,
          toolName: a.toolName,
          output: li({
            tool: t == null ? void 0 : t[a.toolName],
            output: a.error,
            errorMode: "json"
          }),
          providerOptions: a.providerMetadata
        };
    }
  });
  n.length > 0 && r.push({
    role: "assistant",
    content: n
  });
  const o = e.filter((a) => a.type === "tool-result" || a.type === "tool-error").filter((a) => !a.providerExecuted).map((a) => ({
    type: "tool-result",
    toolCallId: a.toolCallId,
    toolName: a.toolName,
    output: li({
      tool: t == null ? void 0 : t[a.toolName],
      output: a.type === "tool-result" ? a.output : a.error,
      errorMode: a.type === "tool-error" ? "text" : "none"
    }),
    ...a.providerMetadata != null ? { providerOptions: a.providerMetadata } : {}
  }));
  return o.length > 0 && r.push({
    role: "tool",
    content: o
  }), r;
}
var QO = xn({
  prefix: "aitxt",
  size: 24
});
async function eR({
  model: e,
  tools: t,
  toolChoice: r,
  system: n,
  prompt: o,
  messages: a,
  maxRetries: s,
  abortSignal: i,
  headers: u,
  stopWhen: c = KO(1),
  experimental_output: l,
  experimental_telemetry: y,
  providerOptions: d,
  experimental_activeTools: f,
  activeTools: g = f,
  experimental_prepareStep: _,
  prepareStep: m = _,
  experimental_repairToolCall: h,
  experimental_download: p,
  experimental_context: v,
  _internal: {
    generateId: $ = QO,
    currentDate: b = () => /* @__PURE__ */ new Date()
  } = {},
  onStepFinish: E,
  ...I
}) {
  const O = Xf(e), q = FO(c), { maxRetries: H, retry: x } = BO({
    maxRetries: s,
    abortSignal: i
  }), W = Qf(I), K = xr(
    u ?? {},
    `ai/${ag}`
  ), M = DO({
    model: O,
    telemetry: y,
    headers: K,
    settings: { ...W, maxRetries: H }
  }), L = await MO({
    system: n,
    prompt: o,
    messages: a
  }), F = zO(y);
  try {
    return await Ei({
      name: "ai.generateText",
      attributes: Rr({
        telemetry: y,
        attributes: {
          ...wi({
            operationId: "ai.generateText",
            telemetry: y
          }),
          ...M,
          // model:
          "ai.model.provider": O.provider,
          "ai.model.id": O.modelId,
          // specific settings that only make sense on the outer level:
          "ai.prompt": {
            input: () => JSON.stringify({ system: n, prompt: o, messages: a })
          }
        }
      }),
      tracer: F,
      fn: async (G) => {
        var B, Q, D, P, C, k, S;
        const w = Qf(I);
        let A, Y = [], X = [];
        const le = [], ae = [];
        do {
          const U = [
            ...L.messages,
            ...le
          ], J = await (m == null ? void 0 : m({
            model: O,
            steps: ae,
            stepNumber: ae.length,
            messages: U
          })), te = Xf(
            (B = J == null ? void 0 : J.model) != null ? B : O
          ), se = await bO({
            prompt: {
              system: (Q = J == null ? void 0 : J.system) != null ? Q : L.system,
              messages: (D = J == null ? void 0 : J.messages) != null ? D : U
            },
            supportedUrls: await te.supportedUrls,
            download: p
          }), { toolChoice: Te, tools: Ue } = IO({
            tools: t,
            toolChoice: (P = J == null ? void 0 : J.toolChoice) != null ? P : r,
            activeTools: (C = J == null ? void 0 : J.activeTools) != null ? C : g
          });
          A = await x(
            () => {
              var fe;
              return Ei({
                name: "ai.generateText.doGenerate",
                attributes: Rr({
                  telemetry: y,
                  attributes: {
                    ...wi({
                      operationId: "ai.generateText.doGenerate",
                      telemetry: y
                    }),
                    ...M,
                    // model:
                    "ai.model.provider": te.provider,
                    "ai.model.id": te.modelId,
                    // prompt:
                    "ai.prompt.messages": {
                      input: () => VO(se)
                    },
                    "ai.prompt.tools": {
                      // convert the language model level tools:
                      input: () => Ue == null ? void 0 : Ue.map((ot) => JSON.stringify(ot))
                    },
                    "ai.prompt.toolChoice": {
                      input: () => Te != null ? JSON.stringify(Te) : void 0
                    },
                    // standardized gen-ai llm span attributes:
                    "gen_ai.system": te.provider,
                    "gen_ai.request.model": te.modelId,
                    "gen_ai.request.frequency_penalty": I.frequencyPenalty,
                    "gen_ai.request.max_tokens": I.maxOutputTokens,
                    "gen_ai.request.presence_penalty": I.presencePenalty,
                    "gen_ai.request.stop_sequences": I.stopSequences,
                    "gen_ai.request.temperature": (fe = I.temperature) != null ? fe : void 0,
                    "gen_ai.request.top_k": I.topK,
                    "gen_ai.request.top_p": I.topP
                  }
                }),
                tracer: F,
                fn: async (ot) => {
                  var pr, Mt, hr, zr, Vr, Dn, Qi, eu;
                  const Fe = await te.doGenerate({
                    ...w,
                    tools: Ue,
                    toolChoice: Te,
                    responseFormat: l == null ? void 0 : l.responseFormat,
                    prompt: se,
                    providerOptions: d,
                    abortSignal: i,
                    headers: K
                  }), mr = {
                    id: (Mt = (pr = Fe.response) == null ? void 0 : pr.id) != null ? Mt : $(),
                    timestamp: (zr = (hr = Fe.response) == null ? void 0 : hr.timestamp) != null ? zr : b(),
                    modelId: (Dn = (Vr = Fe.response) == null ? void 0 : Vr.modelId) != null ? Dn : te.modelId,
                    headers: (Qi = Fe.response) == null ? void 0 : Qi.headers,
                    body: (eu = Fe.response) == null ? void 0 : eu.body
                  };
                  return ot.setAttributes(
                    Rr({
                      telemetry: y,
                      attributes: {
                        "ai.response.finishReason": Fe.finishReason,
                        "ai.response.text": {
                          output: () => ep(Fe.content)
                        },
                        "ai.response.toolCalls": {
                          output: () => {
                            const tu = np(Fe.content);
                            return tu == null ? void 0 : JSON.stringify(tu);
                          }
                        },
                        "ai.response.id": mr.id,
                        "ai.response.model": mr.modelId,
                        "ai.response.timestamp": mr.timestamp.toISOString(),
                        "ai.response.providerMetadata": JSON.stringify(
                          Fe.providerMetadata
                        ),
                        // TODO rename telemetry attributes to inputTokens and outputTokens
                        "ai.usage.promptTokens": Fe.usage.inputTokens,
                        "ai.usage.completionTokens": Fe.usage.outputTokens,
                        // standardized gen-ai llm span attributes:
                        "gen_ai.response.finish_reasons": [Fe.finishReason],
                        "gen_ai.response.id": mr.id,
                        "gen_ai.response.model": mr.modelId,
                        "gen_ai.usage.input_tokens": Fe.usage.inputTokens,
                        "gen_ai.usage.output_tokens": Fe.usage.outputTokens
                      }
                    })
                  ), { ...Fe, response: mr };
                }
              });
            }
          );
          const Pe = await Promise.all(
            A.content.filter(
              (fe) => fe.type === "tool-call"
            ).map(
              (fe) => WO({
                toolCall: fe,
                tools: t,
                repairToolCall: h,
                system: n,
                messages: U
              })
            )
          );
          for (const fe of Pe) {
            if (fe.invalid)
              continue;
            const ot = t[fe.toolName];
            (ot == null ? void 0 : ot.onInputAvailable) != null && await ot.onInputAvailable({
              input: fe.input,
              toolCallId: fe.toolCallId,
              messages: U,
              abortSignal: i,
              experimental_context: v
            });
          }
          const xe = Pe.filter(
            (fe) => fe.invalid && fe.dynamic
          );
          X = [];
          for (const fe of xe)
            X.push({
              type: "tool-error",
              toolCallId: fe.toolCallId,
              toolName: fe.toolName,
              input: fe.input,
              error: tm(fe.error),
              dynamic: !0
            });
          Y = Pe.filter(
            (fe) => !fe.providerExecuted
          ), t != null && X.push(
            ...await tR({
              toolCalls: Y.filter(
                (fe) => !fe.invalid
              ),
              tools: t,
              tracer: F,
              telemetry: y,
              messages: U,
              abortSignal: i,
              experimental_context: v
            })
          );
          const Re = nR({
            content: A.content,
            toolCalls: Pe,
            toolOutputs: X
          });
          le.push(
            ...XO({
              content: Re,
              tools: t
            })
          );
          const wt = new JO({
            content: Re,
            finishReason: A.finishReason,
            usage: A.usage,
            warnings: A.warnings,
            providerMetadata: A.providerMetadata,
            request: (k = A.request) != null ? k : {},
            response: {
              ...A.response,
              // deep clone msgs to avoid mutating past messages in multi-step:
              messages: structuredClone(le)
            }
          });
          QT((S = A.warnings) != null ? S : []), ae.push(wt), await (E == null ? void 0 : E(wt));
        } while (
          // there are tool calls:
          Y.length > 0 && // all current tool calls have outputs (incl. execution errors):
          X.length === Y.length && // continue until a stop condition is met:
          !await YO({ stopConditions: q, steps: ae })
        );
        G.setAttributes(
          Rr({
            telemetry: y,
            attributes: {
              "ai.response.finishReason": A.finishReason,
              "ai.response.text": {
                output: () => ep(A.content)
              },
              "ai.response.toolCalls": {
                output: () => {
                  const U = np(A.content);
                  return U == null ? void 0 : JSON.stringify(U);
                }
              },
              "ai.response.providerMetadata": JSON.stringify(
                A.providerMetadata
              ),
              // TODO rename telemetry attributes to inputTokens and outputTokens
              "ai.usage.promptTokens": A.usage.inputTokens,
              "ai.usage.completionTokens": A.usage.outputTokens
            }
          })
        );
        const N = ae[ae.length - 1];
        let j;
        return N.finishReason === "stop" && (j = await (l == null ? void 0 : l.parseOutput(
          { text: N.text },
          {
            response: N.response,
            usage: N.usage,
            finishReason: N.finishReason
          }
        ))), new rR({
          steps: ae,
          resolvedOutput: j
        });
      }
    });
  } catch (G) {
    throw xO(G);
  }
}
async function tR({
  toolCalls: e,
  tools: t,
  tracer: r,
  telemetry: n,
  messages: o,
  abortSignal: a,
  experimental_context: s
}) {
  return (await Promise.all(
    e.map(async ({ toolCallId: u, toolName: c, input: l }) => {
      const y = t[c];
      if ((y == null ? void 0 : y.execute) != null)
        return Ei({
          name: "ai.toolCall",
          attributes: Rr({
            telemetry: n,
            attributes: {
              ...wi({
                operationId: "ai.toolCall",
                telemetry: n
              }),
              "ai.toolCall.name": c,
              "ai.toolCall.id": u,
              "ai.toolCall.args": {
                output: () => JSON.stringify(l)
              }
            }
          }),
          tracer: r,
          fn: async (d) => {
            try {
              const f = DI({
                execute: y.execute.bind(y),
                input: l,
                options: {
                  toolCallId: u,
                  messages: o,
                  abortSignal: a,
                  experimental_context: s
                }
              });
              let g;
              for await (const _ of f)
                _.type === "final" && (g = _.output);
              try {
                d.setAttributes(
                  Rr({
                    telemetry: n,
                    attributes: {
                      "ai.toolCall.result": {
                        output: () => JSON.stringify(g)
                      }
                    }
                  })
                );
              } catch {
              }
              return {
                type: "tool-result",
                toolCallId: u,
                toolName: c,
                input: l,
                output: g,
                dynamic: y.type === "dynamic"
              };
            } catch (f) {
              return dg(d, f), {
                type: "tool-error",
                toolCallId: u,
                toolName: c,
                input: l,
                error: f,
                dynamic: y.type === "dynamic"
              };
            }
          }
        });
    })
  )).filter(
    (u) => u != null
  );
}
var rR = class {
  constructor(e) {
    this.steps = e.steps, this.resolvedOutput = e.resolvedOutput;
  }
  get finalStep() {
    return this.steps[this.steps.length - 1];
  }
  get content() {
    return this.finalStep.content;
  }
  get text() {
    return this.finalStep.text;
  }
  get files() {
    return this.finalStep.files;
  }
  get reasoningText() {
    return this.finalStep.reasoningText;
  }
  get reasoning() {
    return this.finalStep.reasoning;
  }
  get toolCalls() {
    return this.finalStep.toolCalls;
  }
  get staticToolCalls() {
    return this.finalStep.staticToolCalls;
  }
  get dynamicToolCalls() {
    return this.finalStep.dynamicToolCalls;
  }
  get toolResults() {
    return this.finalStep.toolResults;
  }
  get staticToolResults() {
    return this.finalStep.staticToolResults;
  }
  get dynamicToolResults() {
    return this.finalStep.dynamicToolResults;
  }
  get sources() {
    return this.finalStep.sources;
  }
  get finishReason() {
    return this.finalStep.finishReason;
  }
  get warnings() {
    return this.finalStep.warnings;
  }
  get providerMetadata() {
    return this.finalStep.providerMetadata;
  }
  get response() {
    return this.finalStep.response;
  }
  get request() {
    return this.finalStep.request;
  }
  get usage() {
    return this.finalStep.usage;
  }
  get totalUsage() {
    return this.steps.reduce(
      (e, t) => UO(e, t.usage),
      {
        inputTokens: void 0,
        outputTokens: void 0,
        totalTokens: void 0,
        reasoningTokens: void 0,
        cachedInputTokens: void 0
      }
    );
  }
  get experimental_output() {
    if (this.resolvedOutput == null)
      throw new KT();
    return this.resolvedOutput;
  }
};
function np(e) {
  const t = e.filter(
    (r) => r.type === "tool-call"
  );
  if (t.length !== 0)
    return t.map((r) => ({
      toolCallId: r.toolCallId,
      toolName: r.toolName,
      input: r.input
    }));
}
function nR({
  content: e,
  toolCalls: t,
  toolOutputs: r
}) {
  return [
    ...e.map((n) => {
      switch (n.type) {
        case "text":
        case "reasoning":
        case "source":
          return n;
        case "file":
          return {
            type: "file",
            file: new HO(n)
          };
        case "tool-call":
          return t.find(
            (o) => o.toolCallId === n.toolCallId
          );
        case "tool-result": {
          const o = t.find(
            (a) => a.toolCallId === n.toolCallId
          );
          if (o == null)
            throw new Error(`Tool call ${n.toolCallId} not found.`);
          return n.isError ? {
            type: "tool-error",
            toolCallId: n.toolCallId,
            toolName: n.toolName,
            input: o.input,
            error: n.result,
            providerExecuted: !0,
            dynamic: o.dynamic
          } : {
            type: "tool-result",
            toolCallId: n.toolCallId,
            toolName: n.toolName,
            input: o.input,
            output: n.result,
            providerExecuted: !0,
            dynamic: o.dynamic
          };
        }
      }
    }),
    ...r
  ];
}
(class extends TransformStream {
  constructor() {
    super({
      transform(e, t) {
        t.enqueue(`data: ${JSON.stringify(e)}

`);
      },
      flush(e) {
        e.enqueue(`data: [DONE]

`);
      }
    });
  }
});
function oR(e) {
  const t = ["ROOT"];
  let r = -1, n = null;
  function o(u, c, l) {
    switch (u) {
      case '"': {
        r = c, t.pop(), t.push(l), t.push("INSIDE_STRING");
        break;
      }
      case "f":
      case "t":
      case "n": {
        r = c, n = c, t.pop(), t.push(l), t.push("INSIDE_LITERAL");
        break;
      }
      case "-": {
        t.pop(), t.push(l), t.push("INSIDE_NUMBER");
        break;
      }
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9": {
        r = c, t.pop(), t.push(l), t.push("INSIDE_NUMBER");
        break;
      }
      case "{": {
        r = c, t.pop(), t.push(l), t.push("INSIDE_OBJECT_START");
        break;
      }
      case "[": {
        r = c, t.pop(), t.push(l), t.push("INSIDE_ARRAY_START");
        break;
      }
    }
  }
  function a(u, c) {
    switch (u) {
      case ",": {
        t.pop(), t.push("INSIDE_OBJECT_AFTER_COMMA");
        break;
      }
      case "}": {
        r = c, t.pop();
        break;
      }
    }
  }
  function s(u, c) {
    switch (u) {
      case ",": {
        t.pop(), t.push("INSIDE_ARRAY_AFTER_COMMA");
        break;
      }
      case "]": {
        r = c, t.pop();
        break;
      }
    }
  }
  for (let u = 0; u < e.length; u++) {
    const c = e[u];
    switch (t[t.length - 1]) {
      case "ROOT":
        o(c, u, "FINISH");
        break;
      case "INSIDE_OBJECT_START": {
        switch (c) {
          case '"': {
            t.pop(), t.push("INSIDE_OBJECT_KEY");
            break;
          }
          case "}": {
            r = u, t.pop();
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_AFTER_COMMA": {
        switch (c) {
          case '"': {
            t.pop(), t.push("INSIDE_OBJECT_KEY");
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_KEY": {
        switch (c) {
          case '"': {
            t.pop(), t.push("INSIDE_OBJECT_AFTER_KEY");
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_AFTER_KEY": {
        switch (c) {
          case ":": {
            t.pop(), t.push("INSIDE_OBJECT_BEFORE_VALUE");
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_BEFORE_VALUE": {
        o(c, u, "INSIDE_OBJECT_AFTER_VALUE");
        break;
      }
      case "INSIDE_OBJECT_AFTER_VALUE": {
        a(c, u);
        break;
      }
      case "INSIDE_STRING": {
        switch (c) {
          case '"': {
            t.pop(), r = u;
            break;
          }
          case "\\": {
            t.push("INSIDE_STRING_ESCAPE");
            break;
          }
          default:
            r = u;
        }
        break;
      }
      case "INSIDE_ARRAY_START": {
        switch (c) {
          case "]": {
            r = u, t.pop();
            break;
          }
          default: {
            r = u, o(c, u, "INSIDE_ARRAY_AFTER_VALUE");
            break;
          }
        }
        break;
      }
      case "INSIDE_ARRAY_AFTER_VALUE": {
        switch (c) {
          case ",": {
            t.pop(), t.push("INSIDE_ARRAY_AFTER_COMMA");
            break;
          }
          case "]": {
            r = u, t.pop();
            break;
          }
          default: {
            r = u;
            break;
          }
        }
        break;
      }
      case "INSIDE_ARRAY_AFTER_COMMA": {
        o(c, u, "INSIDE_ARRAY_AFTER_VALUE");
        break;
      }
      case "INSIDE_STRING_ESCAPE": {
        t.pop(), r = u;
        break;
      }
      case "INSIDE_NUMBER": {
        switch (c) {
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9": {
            r = u;
            break;
          }
          case "e":
          case "E":
          case "-":
          case ".":
            break;
          case ",": {
            t.pop(), t[t.length - 1] === "INSIDE_ARRAY_AFTER_VALUE" && s(c, u), t[t.length - 1] === "INSIDE_OBJECT_AFTER_VALUE" && a(c, u);
            break;
          }
          case "}": {
            t.pop(), t[t.length - 1] === "INSIDE_OBJECT_AFTER_VALUE" && a(c, u);
            break;
          }
          case "]": {
            t.pop(), t[t.length - 1] === "INSIDE_ARRAY_AFTER_VALUE" && s(c, u);
            break;
          }
          default: {
            t.pop();
            break;
          }
        }
        break;
      }
      case "INSIDE_LITERAL": {
        const y = e.substring(n, u + 1);
        !"false".startsWith(y) && !"true".startsWith(y) && !"null".startsWith(y) ? (t.pop(), t[t.length - 1] === "INSIDE_OBJECT_AFTER_VALUE" ? a(c, u) : t[t.length - 1] === "INSIDE_ARRAY_AFTER_VALUE" && s(c, u)) : r = u;
        break;
      }
    }
  }
  let i = e.slice(0, r + 1);
  for (let u = t.length - 1; u >= 0; u--)
    switch (t[u]) {
      case "INSIDE_STRING": {
        i += '"';
        break;
      }
      case "INSIDE_OBJECT_KEY":
      case "INSIDE_OBJECT_AFTER_KEY":
      case "INSIDE_OBJECT_AFTER_COMMA":
      case "INSIDE_OBJECT_START":
      case "INSIDE_OBJECT_BEFORE_VALUE":
      case "INSIDE_OBJECT_AFTER_VALUE": {
        i += "}";
        break;
      }
      case "INSIDE_ARRAY_START":
      case "INSIDE_ARRAY_AFTER_COMMA":
      case "INSIDE_ARRAY_AFTER_VALUE": {
        i += "]";
        break;
      }
      case "INSIDE_LITERAL": {
        const l = e.substring(n, e.length);
        "true".startsWith(l) ? i += "true".slice(l.length) : "false".startsWith(l) ? i += "false".slice(l.length) : "null".startsWith(l) && (i += "null".slice(l.length));
      }
    }
  return i;
}
async function aR(e) {
  if (e === void 0)
    return { value: void 0, state: "undefined-input" };
  let t = await cr({ text: e });
  return t.success ? { value: t.value, state: "successful-parse" } : (t = await cr({ text: oR(e) }), t.success ? { value: t.value, state: "repaired-parse" } : { value: void 0, state: "failed-parse" });
}
xn({
  prefix: "aitxt",
  size: 24
});
xn({ prefix: "aiobj", size: 24 });
xn({ prefix: "aiobj", size: 24 });
var sR = {};
WT(sR, {
  object: () => uR,
  text: () => iR
});
var iR = () => ({
  type: "text",
  responseFormat: { type: "text" },
  async parsePartial({ text: e }) {
    return { partial: e };
  },
  async parseOutput({ text: e }) {
    return e;
  }
}), uR = ({
  schema: e
}) => {
  const t = Ea(e);
  return {
    type: "object",
    responseFormat: {
      type: "json",
      schema: t.jsonSchema
    },
    async parsePartial({ text: r }) {
      const n = await aR(r);
      switch (n.state) {
        case "failed-parse":
        case "undefined-input":
          return;
        case "repaired-parse":
        case "successful-parse":
          return {
            // Note: currently no validation of partial results:
            partial: n.value
          };
        default: {
          const o = n.state;
          throw new Error(`Unsupported parse state: ${o}`);
        }
      }
    },
    async parseOutput({ text: r }, n) {
      const o = await cr({ text: r });
      if (!o.success)
        throw new Kf({
          message: "No object generated: could not parse the response.",
          cause: o.error,
          text: r,
          response: n.response,
          usage: n.usage,
          finishReason: n.finishReason
        });
      const a = await Ct({
        value: o.value,
        schema: t
      });
      if (!a.success)
        throw new Kf({
          message: "No object generated: response did not match schema.",
          cause: a.error,
          text: r,
          response: n.response,
          usage: n.usage,
          finishReason: n.finishReason
        });
      return a.value;
    }
  };
};
class cR {
  constructor(t) {
    ke(this, "id", "os-agent");
    ke(this, "name", "OS Agent");
    ke(this, "role", "os");
    ke(this, "model");
    ke(this, "fileTool");
    ke(this, "shellTool");
    // private logTool: LogTool;
    ke(this, "lastAction", "");
    this.model = t.model, this.fileTool = new M0(t.allowedPaths), this.shellTool = new D0(t.allowedCommands);
  }
  async think(t) {
    const r = `You are an OS Agent responsible for system operations.
You have access to:
- File operations (read, write, list, delete)
- Shell commands (safe execution only)
- System logs (read and search)

Analyze the user's request and determine the best action to take.
If you have a final answer, prefix it with "FINAL ANSWER:".
Otherwise, describe the action you want to take.`, { text: n } = await eR({
      model: this.model,
      system: r,
      prompt: `User request: ${t}

What should I do?`
    });
    return n;
  }
  async act(t) {
    if (this.lastAction = t, t.toLowerCase().includes("read file")) {
      const r = t.match(/['"]([^'"]+)['"]/);
      if (r) {
        const n = await this.fileTool.execute({
          operation: "read",
          filePath: r[1]
        });
        this.lastAction = `Read file: ${n}`;
      }
    } else if (t.toLowerCase().includes("execute") || t.toLowerCase().includes("run command")) {
      const r = t.match(/['"]([^'"]+)['"]/);
      if (r) {
        const n = await this.shellTool.execute({
          command: r[1]
        });
        this.lastAction = `Executed command: ${JSON.stringify(n)}`;
      }
    } else if (t.toLowerCase().includes("list")) {
      const r = t.match(/['"]([^'"]+)['"]/);
      if (r) {
        const n = await this.fileTool.execute({
          operation: "list",
          filePath: r[1]
        });
        this.lastAction = `Listed directory: ${JSON.stringify(n)}`;
      }
    }
  }
  async observe() {
    return this.lastAction || "No action taken yet";
  }
}
var Xi = R({
  error: R({
    message: T(),
    // The additional information below is handled loosely to support
    // OpenAI-compatible providers that have slightly different error
    // responses:
    type: T().nullish(),
    param: lt().nullish(),
    code: _e([T(), V()]).nullish()
  })
}), _t = lr({
  errorSchema: Xi,
  errorToMessage: (e) => e.error.message
});
function lR({
  prompt: e,
  systemMessageMode: t = "system"
}) {
  const r = [], n = [];
  for (const { role: o, content: a } of e)
    switch (o) {
      case "system": {
        switch (t) {
          case "system": {
            r.push({ role: "system", content: a });
            break;
          }
          case "developer": {
            r.push({ role: "developer", content: a });
            break;
          }
          case "remove": {
            n.push({
              type: "other",
              message: "system messages are removed for this model"
            });
            break;
          }
          default: {
            const s = t;
            throw new Error(
              `Unsupported system message mode: ${s}`
            );
          }
        }
        break;
      }
      case "user": {
        if (a.length === 1 && a[0].type === "text") {
          r.push({ role: "user", content: a[0].text });
          break;
        }
        r.push({
          role: "user",
          content: a.map((s, i) => {
            var u, c, l;
            switch (s.type) {
              case "text":
                return { type: "text", text: s.text };
              case "file":
                if (s.mediaType.startsWith("image/")) {
                  const y = s.mediaType === "image/*" ? "image/jpeg" : s.mediaType;
                  return {
                    type: "image_url",
                    image_url: {
                      url: s.data instanceof URL ? s.data.toString() : `data:${y};base64,${Or(s.data)}`,
                      // OpenAI specific extension: image detail
                      detail: (c = (u = s.providerOptions) == null ? void 0 : u.openai) == null ? void 0 : c.imageDetail
                    }
                  };
                } else if (s.mediaType.startsWith("audio/")) {
                  if (s.data instanceof URL)
                    throw new Nt({
                      functionality: "audio file parts with URLs"
                    });
                  switch (s.mediaType) {
                    case "audio/wav":
                      return {
                        type: "input_audio",
                        input_audio: {
                          data: Or(s.data),
                          format: "wav"
                        }
                      };
                    case "audio/mp3":
                    case "audio/mpeg":
                      return {
                        type: "input_audio",
                        input_audio: {
                          data: Or(s.data),
                          format: "mp3"
                        }
                      };
                    default:
                      throw new Nt({
                        functionality: `audio content parts with media type ${s.mediaType}`
                      });
                  }
                } else if (s.mediaType === "application/pdf") {
                  if (s.data instanceof URL)
                    throw new Nt({
                      functionality: "PDF file parts with URLs"
                    });
                  return {
                    type: "file",
                    file: typeof s.data == "string" && s.data.startsWith("file-") ? { file_id: s.data } : {
                      filename: (l = s.filename) != null ? l : `part-${i}.pdf`,
                      file_data: `data:application/pdf;base64,${Or(s.data)}`
                    }
                  };
                } else
                  throw new Nt({
                    functionality: `file part media type ${s.mediaType}`
                  });
            }
          })
        });
        break;
      }
      case "assistant": {
        let s = "";
        const i = [];
        for (const u of a)
          switch (u.type) {
            case "text": {
              s += u.text;
              break;
            }
            case "tool-call": {
              i.push({
                id: u.toolCallId,
                type: "function",
                function: {
                  name: u.toolName,
                  arguments: JSON.stringify(u.input)
                }
              });
              break;
            }
          }
        r.push({
          role: "assistant",
          content: s,
          tool_calls: i.length > 0 ? i : void 0
        });
        break;
      }
      case "tool": {
        for (const s of a) {
          const i = s.output;
          let u;
          switch (i.type) {
            case "text":
            case "error-text":
              u = i.value;
              break;
            case "content":
            case "json":
            case "error-json":
              u = JSON.stringify(i.value);
              break;
          }
          r.push({
            role: "tool",
            tool_call_id: s.toolCallId,
            content: u
          });
        }
        break;
      }
      default: {
        const s = o;
        throw new Error(`Unsupported role: ${s}`);
      }
    }
  return { messages: r, warnings: n };
}
function di({
  id: e,
  model: t,
  created: r
}) {
  return {
    id: e ?? void 0,
    modelId: t ?? void 0,
    timestamp: r ? new Date(r * 1e3) : void 0
  };
}
function op(e) {
  switch (e) {
    case "stop":
      return "stop";
    case "length":
      return "length";
    case "content_filter":
      return "content-filter";
    case "function_call":
    case "tool_calls":
      return "tool-calls";
    default:
      return "unknown";
  }
}
var dR = Oe(
  () => de(
    R({
      id: T().nullish(),
      created: V().nullish(),
      model: T().nullish(),
      choices: ee(
        R({
          message: R({
            role: Z("assistant").nullish(),
            content: T().nullish(),
            tool_calls: ee(
              R({
                id: T().nullish(),
                type: Z("function"),
                function: R({
                  name: T(),
                  arguments: T()
                })
              })
            ).nullish(),
            annotations: ee(
              R({
                type: Z("url_citation"),
                start_index: V(),
                end_index: V(),
                url: T(),
                title: T()
              })
            ).nullish()
          }),
          index: V(),
          logprobs: R({
            content: ee(
              R({
                token: T(),
                logprob: V(),
                top_logprobs: ee(
                  R({
                    token: T(),
                    logprob: V()
                  })
                )
              })
            ).nullish()
          }).nullish(),
          finish_reason: T().nullish()
        })
      ),
      usage: R({
        prompt_tokens: V().nullish(),
        completion_tokens: V().nullish(),
        total_tokens: V().nullish(),
        prompt_tokens_details: R({
          cached_tokens: V().nullish()
        }).nullish(),
        completion_tokens_details: R({
          reasoning_tokens: V().nullish(),
          accepted_prediction_tokens: V().nullish(),
          rejected_prediction_tokens: V().nullish()
        }).nullish()
      }).nullish()
    })
  )
), fR = Oe(
  () => de(
    _e([
      R({
        id: T().nullish(),
        created: V().nullish(),
        model: T().nullish(),
        choices: ee(
          R({
            delta: R({
              role: Ee(["assistant"]).nullish(),
              content: T().nullish(),
              tool_calls: ee(
                R({
                  index: V(),
                  id: T().nullish(),
                  type: Z("function").nullish(),
                  function: R({
                    name: T().nullish(),
                    arguments: T().nullish()
                  })
                })
              ).nullish(),
              annotations: ee(
                R({
                  type: Z("url_citation"),
                  start_index: V(),
                  end_index: V(),
                  url: T(),
                  title: T()
                })
              ).nullish()
            }).nullish(),
            logprobs: R({
              content: ee(
                R({
                  token: T(),
                  logprob: V(),
                  top_logprobs: ee(
                    R({
                      token: T(),
                      logprob: V()
                    })
                  )
                })
              ).nullish()
            }).nullish(),
            finish_reason: T().nullish(),
            index: V()
          })
        ),
        usage: R({
          prompt_tokens: V().nullish(),
          completion_tokens: V().nullish(),
          total_tokens: V().nullish(),
          prompt_tokens_details: R({
            cached_tokens: V().nullish()
          }).nullish(),
          completion_tokens_details: R({
            reasoning_tokens: V().nullish(),
            accepted_prediction_tokens: V().nullish(),
            rejected_prediction_tokens: V().nullish()
          }).nullish()
        }).nullish()
      }),
      Xi
    ])
  )
), pR = Oe(
  () => de(
    R({
      /**
       * Modify the likelihood of specified tokens appearing in the completion.
       *
       * Accepts a JSON object that maps tokens (specified by their token ID in
       * the GPT tokenizer) to an associated bias value from -100 to 100.
       */
      logitBias: Ce($S(), V()).optional(),
      /**
       * Return the log probabilities of the tokens.
       *
       * Setting to true will return the log probabilities of the tokens that
       * were generated.
       *
       * Setting to a number will return the log probabilities of the top n
       * tokens that were generated.
       */
      logprobs: _e([He(), V()]).optional(),
      /**
       * Whether to enable parallel function calling during tool use. Default to true.
       */
      parallelToolCalls: He().optional(),
      /**
       * A unique identifier representing your end-user, which can help OpenAI to
       * monitor and detect abuse.
       */
      user: T().optional(),
      /**
       * Reasoning effort for reasoning models. Defaults to `medium`.
       */
      reasoningEffort: Ee(["none", "minimal", "low", "medium", "high"]).optional(),
      /**
       * Maximum number of completion tokens to generate. Useful for reasoning models.
       */
      maxCompletionTokens: V().optional(),
      /**
       * Whether to enable persistence in responses API.
       */
      store: He().optional(),
      /**
       * Metadata to associate with the request.
       */
      metadata: Ce(T().max(64), T().max(512)).optional(),
      /**
       * Parameters for prediction mode.
       */
      prediction: Ce(T(), lt()).optional(),
      /**
       * Whether to use structured outputs.
       *
       * @default true
       */
      structuredOutputs: He().optional(),
      /**
       * Service tier for the request.
       * - 'auto': Default service tier. The request will be processed with the service tier configured in the
       *           Project settings. Unless otherwise configured, the Project will use 'default'.
       * - 'flex': 50% cheaper processing at the cost of increased latency. Only available for o3 and o4-mini models.
       * - 'priority': Higher-speed processing with predictably low latency at premium cost. Available for Enterprise customers.
       * - 'default': The request will be processed with the standard pricing and performance for the selected model.
       *
       * @default 'auto'
       */
      serviceTier: Ee(["auto", "flex", "priority", "default"]).optional(),
      /**
       * Whether to use strict JSON schema validation.
       *
       * @default false
       */
      strictJsonSchema: He().optional(),
      /**
       * Controls the verbosity of the model's responses.
       * Lower values will result in more concise responses, while higher values will result in more verbose responses.
       */
      textVerbosity: Ee(["low", "medium", "high"]).optional(),
      /**
       * A cache key for prompt caching. Allows manual control over prompt caching behavior.
       * Useful for improving cache hit rates and working around automatic caching issues.
       */
      promptCacheKey: T().optional(),
      /**
       * The retention policy for the prompt cache.
       * - 'in_memory': Default. Standard prompt caching behavior.
       * - '24h': Extended prompt caching that keeps cached prefixes active for up to 24 hours.
       *          Currently only available for 5.1 series models.
       *
       * @default 'in_memory'
       */
      promptCacheRetention: Ee(["in_memory", "24h"]).optional(),
      /**
       * A stable identifier used to help detect users of your application
       * that may be violating OpenAI's usage policies. The IDs should be a
       * string that uniquely identifies each user. We recommend hashing their
       * username or email address, in order to avoid sending us any identifying
       * information.
       */
      safetyIdentifier: T().optional()
    })
  )
);
function hR({
  tools: e,
  toolChoice: t,
  structuredOutputs: r,
  strictJsonSchema: n
}) {
  e = e != null && e.length ? e : void 0;
  const o = [];
  if (e == null)
    return { tools: void 0, toolChoice: void 0, toolWarnings: o };
  const a = [];
  for (const i of e)
    switch (i.type) {
      case "function":
        a.push({
          type: "function",
          function: {
            name: i.name,
            description: i.description,
            parameters: i.inputSchema,
            strict: r ? n : void 0
          }
        });
        break;
      default:
        o.push({ type: "unsupported-tool", tool: i });
        break;
    }
  if (t == null)
    return { tools: a, toolChoice: void 0, toolWarnings: o };
  const s = t.type;
  switch (s) {
    case "auto":
    case "none":
    case "required":
      return { tools: a, toolChoice: s, toolWarnings: o };
    case "tool":
      return {
        tools: a,
        toolChoice: {
          type: "function",
          function: {
            name: t.toolName
          }
        },
        toolWarnings: o
      };
    default: {
      const i = s;
      throw new Nt({
        functionality: `tool choice type: ${i}`
      });
    }
  }
}
var mR = class {
  constructor(e, t) {
    this.specificationVersion = "v2", this.supportedUrls = {
      "image/*": [/^https?:\/\/.*$/]
    }, this.modelId = e, this.config = t;
  }
  get provider() {
    return this.config.provider;
  }
  async getArgs({
    prompt: e,
    maxOutputTokens: t,
    temperature: r,
    topP: n,
    topK: o,
    frequencyPenalty: a,
    presencePenalty: s,
    stopSequences: i,
    responseFormat: u,
    seed: c,
    tools: l,
    toolChoice: y,
    providerOptions: d
  }) {
    var f, g, _, m;
    const h = [], p = (f = await Bt({
      provider: "openai",
      providerOptions: d,
      schema: pR
    })) != null ? f : {}, v = (g = p.structuredOutputs) != null ? g : !0;
    o != null && h.push({
      type: "unsupported-setting",
      setting: "topK"
    }), (u == null ? void 0 : u.type) === "json" && u.schema != null && !v && h.push({
      type: "unsupported-setting",
      setting: "responseFormat",
      details: "JSON response format schema is only supported with structuredOutputs"
    });
    const { messages: $, warnings: b } = lR(
      {
        prompt: e,
        systemMessageMode: vR(this.modelId)
      }
    );
    h.push(...b);
    const E = (_ = p.strictJsonSchema) != null ? _ : !1, I = {
      // model id:
      model: this.modelId,
      // model specific settings:
      logit_bias: p.logitBias,
      logprobs: p.logprobs === !0 || typeof p.logprobs == "number" ? !0 : void 0,
      top_logprobs: typeof p.logprobs == "number" ? p.logprobs : typeof p.logprobs == "boolean" && p.logprobs ? 0 : void 0,
      user: p.user,
      parallel_tool_calls: p.parallelToolCalls,
      // standardized settings:
      max_tokens: t,
      temperature: r,
      top_p: n,
      frequency_penalty: a,
      presence_penalty: s,
      response_format: (u == null ? void 0 : u.type) === "json" ? v && u.schema != null ? {
        type: "json_schema",
        json_schema: {
          schema: u.schema,
          strict: E,
          name: (m = u.name) != null ? m : "response",
          description: u.description
        }
      } : { type: "json_object" } : void 0,
      stop: i,
      seed: c,
      verbosity: p.textVerbosity,
      // openai specific settings:
      // TODO AI SDK 6: remove, we auto-map maxOutputTokens now
      max_completion_tokens: p.maxCompletionTokens,
      store: p.store,
      metadata: p.metadata,
      prediction: p.prediction,
      reasoning_effort: p.reasoningEffort,
      service_tier: p.serviceTier,
      prompt_cache_key: p.promptCacheKey,
      prompt_cache_retention: p.promptCacheRetention,
      safety_identifier: p.safetyIdentifier,
      // messages:
      messages: $
    };
    pg(this.modelId) ? (I.temperature != null && (I.temperature = void 0, h.push({
      type: "unsupported-setting",
      setting: "temperature",
      details: "temperature is not supported for reasoning models"
    })), I.top_p != null && (I.top_p = void 0, h.push({
      type: "unsupported-setting",
      setting: "topP",
      details: "topP is not supported for reasoning models"
    })), I.frequency_penalty != null && (I.frequency_penalty = void 0, h.push({
      type: "unsupported-setting",
      setting: "frequencyPenalty",
      details: "frequencyPenalty is not supported for reasoning models"
    })), I.presence_penalty != null && (I.presence_penalty = void 0, h.push({
      type: "unsupported-setting",
      setting: "presencePenalty",
      details: "presencePenalty is not supported for reasoning models"
    })), I.logit_bias != null && (I.logit_bias = void 0, h.push({
      type: "other",
      message: "logitBias is not supported for reasoning models"
    })), I.logprobs != null && (I.logprobs = void 0, h.push({
      type: "other",
      message: "logprobs is not supported for reasoning models"
    })), I.top_logprobs != null && (I.top_logprobs = void 0, h.push({
      type: "other",
      message: "topLogprobs is not supported for reasoning models"
    })), I.max_tokens != null && (I.max_completion_tokens == null && (I.max_completion_tokens = I.max_tokens), I.max_tokens = void 0)) : (this.modelId.startsWith("gpt-4o-search-preview") || this.modelId.startsWith("gpt-4o-mini-search-preview")) && I.temperature != null && (I.temperature = void 0, h.push({
      type: "unsupported-setting",
      setting: "temperature",
      details: "temperature is not supported for the search preview models and has been removed."
    })), p.serviceTier === "flex" && !gR(this.modelId) && (h.push({
      type: "unsupported-setting",
      setting: "serviceTier",
      details: "flex processing is only available for o3, o4-mini, and gpt-5 models"
    }), I.service_tier = void 0), p.serviceTier === "priority" && !yR(this.modelId) && (h.push({
      type: "unsupported-setting",
      setting: "serviceTier",
      details: "priority processing is only available for supported models (gpt-4, gpt-5, gpt-5-mini, o3, o4-mini) and requires Enterprise access. gpt-5-nano is not supported"
    }), I.service_tier = void 0);
    const {
      tools: O,
      toolChoice: q,
      toolWarnings: H
    } = hR({
      tools: l,
      toolChoice: y,
      structuredOutputs: v,
      strictJsonSchema: E
    });
    return {
      args: {
        ...I,
        tools: O,
        tool_choice: q
      },
      warnings: [...h, ...H]
    };
  }
  async doGenerate(e) {
    var t, r, n, o, a, s, i, u, c, l, y, d, f, g;
    const { args: _, warnings: m } = await this.getArgs(e), {
      responseHeaders: h,
      value: p,
      rawValue: v
    } = await et({
      url: this.config.url({
        path: "/chat/completions",
        modelId: this.modelId
      }),
      headers: Je(this.config.headers(), e.headers),
      body: _,
      failedResponseHandler: _t,
      successfulResponseHandler: ft(
        dR
      ),
      abortSignal: e.abortSignal,
      fetch: this.config.fetch
    }), $ = p.choices[0], b = [], E = $.message.content;
    E != null && E.length > 0 && b.push({ type: "text", text: E });
    for (const H of (t = $.message.tool_calls) != null ? t : [])
      b.push({
        type: "tool-call",
        toolCallId: (r = H.id) != null ? r : kt(),
        toolName: H.function.name,
        input: H.function.arguments
      });
    for (const H of (n = $.message.annotations) != null ? n : [])
      b.push({
        type: "source",
        sourceType: "url",
        id: kt(),
        url: H.url,
        title: H.title
      });
    const I = (o = p.usage) == null ? void 0 : o.completion_tokens_details, O = (a = p.usage) == null ? void 0 : a.prompt_tokens_details, q = { openai: {} };
    return (I == null ? void 0 : I.accepted_prediction_tokens) != null && (q.openai.acceptedPredictionTokens = I == null ? void 0 : I.accepted_prediction_tokens), (I == null ? void 0 : I.rejected_prediction_tokens) != null && (q.openai.rejectedPredictionTokens = I == null ? void 0 : I.rejected_prediction_tokens), ((s = $.logprobs) == null ? void 0 : s.content) != null && (q.openai.logprobs = $.logprobs.content), {
      content: b,
      finishReason: op($.finish_reason),
      usage: {
        inputTokens: (u = (i = p.usage) == null ? void 0 : i.prompt_tokens) != null ? u : void 0,
        outputTokens: (l = (c = p.usage) == null ? void 0 : c.completion_tokens) != null ? l : void 0,
        totalTokens: (d = (y = p.usage) == null ? void 0 : y.total_tokens) != null ? d : void 0,
        reasoningTokens: (f = I == null ? void 0 : I.reasoning_tokens) != null ? f : void 0,
        cachedInputTokens: (g = O == null ? void 0 : O.cached_tokens) != null ? g : void 0
      },
      request: { body: _ },
      response: {
        ...di(p),
        headers: h,
        body: v
      },
      warnings: m,
      providerMetadata: q
    };
  }
  async doStream(e) {
    const { args: t, warnings: r } = await this.getArgs(e), n = {
      ...t,
      stream: !0,
      stream_options: {
        include_usage: !0
      }
    }, { responseHeaders: o, value: a } = await et({
      url: this.config.url({
        path: "/chat/completions",
        modelId: this.modelId
      }),
      headers: Je(this.config.headers(), e.headers),
      body: n,
      failedResponseHandler: _t,
      successfulResponseHandler: wa(
        fR
      ),
      abortSignal: e.abortSignal,
      fetch: this.config.fetch
    }), s = [];
    let i = "unknown";
    const u = {
      inputTokens: void 0,
      outputTokens: void 0,
      totalTokens: void 0
    };
    let c = !1, l = !1;
    const y = { openai: {} };
    return {
      stream: a.pipeThrough(
        new TransformStream({
          start(d) {
            d.enqueue({ type: "stream-start", warnings: r });
          },
          transform(d, f) {
            var g, _, m, h, p, v, $, b, E, I, O, q, H, x, W, K, M, L, F, G, B, Q, D, P;
            if (e.includeRawChunks && f.enqueue({ type: "raw", rawValue: d.rawValue }), !d.success) {
              i = "error", f.enqueue({ type: "error", error: d.error });
              return;
            }
            const C = d.value;
            if ("error" in C) {
              i = "error", f.enqueue({ type: "error", error: C.error });
              return;
            }
            if (!c) {
              const w = di(C);
              Object.values(w).some(Boolean) && (c = !0, f.enqueue({
                type: "response-metadata",
                ...di(C)
              }));
            }
            C.usage != null && (u.inputTokens = (g = C.usage.prompt_tokens) != null ? g : void 0, u.outputTokens = (_ = C.usage.completion_tokens) != null ? _ : void 0, u.totalTokens = (m = C.usage.total_tokens) != null ? m : void 0, u.reasoningTokens = (p = (h = C.usage.completion_tokens_details) == null ? void 0 : h.reasoning_tokens) != null ? p : void 0, u.cachedInputTokens = ($ = (v = C.usage.prompt_tokens_details) == null ? void 0 : v.cached_tokens) != null ? $ : void 0, ((b = C.usage.completion_tokens_details) == null ? void 0 : b.accepted_prediction_tokens) != null && (y.openai.acceptedPredictionTokens = (E = C.usage.completion_tokens_details) == null ? void 0 : E.accepted_prediction_tokens), ((I = C.usage.completion_tokens_details) == null ? void 0 : I.rejected_prediction_tokens) != null && (y.openai.rejectedPredictionTokens = (O = C.usage.completion_tokens_details) == null ? void 0 : O.rejected_prediction_tokens));
            const k = C.choices[0];
            if ((k == null ? void 0 : k.finish_reason) != null && (i = op(k.finish_reason)), ((q = k == null ? void 0 : k.logprobs) == null ? void 0 : q.content) != null && (y.openai.logprobs = k.logprobs.content), (k == null ? void 0 : k.delta) == null)
              return;
            const S = k.delta;
            if (S.content != null && (l || (f.enqueue({ type: "text-start", id: "0" }), l = !0), f.enqueue({
              type: "text-delta",
              id: "0",
              delta: S.content
            })), S.tool_calls != null)
              for (const w of S.tool_calls) {
                const A = w.index;
                if (s[A] == null) {
                  if (w.type !== "function")
                    throw new Fs({
                      data: w,
                      message: "Expected 'function' type."
                    });
                  if (w.id == null)
                    throw new Fs({
                      data: w,
                      message: "Expected 'id' to be a string."
                    });
                  if (((H = w.function) == null ? void 0 : H.name) == null)
                    throw new Fs({
                      data: w,
                      message: "Expected 'function.name' to be a string."
                    });
                  f.enqueue({
                    type: "tool-input-start",
                    id: w.id,
                    toolName: w.function.name
                  }), s[A] = {
                    id: w.id,
                    type: "function",
                    function: {
                      name: w.function.name,
                      arguments: (x = w.function.arguments) != null ? x : ""
                    },
                    hasFinished: !1
                  };
                  const X = s[A];
                  ((W = X.function) == null ? void 0 : W.name) != null && ((K = X.function) == null ? void 0 : K.arguments) != null && (X.function.arguments.length > 0 && f.enqueue({
                    type: "tool-input-delta",
                    id: X.id,
                    delta: X.function.arguments
                  }), Id(X.function.arguments) && (f.enqueue({
                    type: "tool-input-end",
                    id: X.id
                  }), f.enqueue({
                    type: "tool-call",
                    toolCallId: (M = X.id) != null ? M : kt(),
                    toolName: X.function.name,
                    input: X.function.arguments
                  }), X.hasFinished = !0));
                  continue;
                }
                const Y = s[A];
                Y.hasFinished || (((L = w.function) == null ? void 0 : L.arguments) != null && (Y.function.arguments += (G = (F = w.function) == null ? void 0 : F.arguments) != null ? G : ""), f.enqueue({
                  type: "tool-input-delta",
                  id: Y.id,
                  delta: (B = w.function.arguments) != null ? B : ""
                }), ((Q = Y.function) == null ? void 0 : Q.name) != null && ((D = Y.function) == null ? void 0 : D.arguments) != null && Id(Y.function.arguments) && (f.enqueue({
                  type: "tool-input-end",
                  id: Y.id
                }), f.enqueue({
                  type: "tool-call",
                  toolCallId: (P = Y.id) != null ? P : kt(),
                  toolName: Y.function.name,
                  input: Y.function.arguments
                }), Y.hasFinished = !0));
              }
            if (S.annotations != null)
              for (const w of S.annotations)
                f.enqueue({
                  type: "source",
                  sourceType: "url",
                  id: kt(),
                  url: w.url,
                  title: w.title
                });
          },
          flush(d) {
            l && d.enqueue({ type: "text-end", id: "0" }), d.enqueue({
              type: "finish",
              finishReason: i,
              usage: u,
              ...y != null ? { providerMetadata: y } : {}
            });
          }
        })
      ),
      request: { body: n },
      response: { headers: o }
    };
  }
};
function pg(e) {
  return (e.startsWith("o") || e.startsWith("gpt-5")) && !e.startsWith("gpt-5-chat");
}
function gR(e) {
  return e.startsWith("o3") || e.startsWith("o4-mini") || e.startsWith("gpt-5") && !e.startsWith("gpt-5-chat");
}
function yR(e) {
  return e.startsWith("gpt-4") || e.startsWith("gpt-5-mini") || e.startsWith("gpt-5") && !e.startsWith("gpt-5-nano") && !e.startsWith("gpt-5-chat") || e.startsWith("o3") || e.startsWith("o4-mini");
}
function vR(e) {
  var t, r;
  return pg(e) ? (r = (t = _R[e]) == null ? void 0 : t.systemMessageMode) != null ? r : "developer" : "system";
}
var _R = {
  o3: {
    systemMessageMode: "developer"
  },
  "o3-2025-04-16": {
    systemMessageMode: "developer"
  },
  "o3-mini": {
    systemMessageMode: "developer"
  },
  "o3-mini-2025-01-31": {
    systemMessageMode: "developer"
  },
  "o4-mini": {
    systemMessageMode: "developer"
  },
  "o4-mini-2025-04-16": {
    systemMessageMode: "developer"
  }
};
function bR({
  prompt: e,
  user: t = "user",
  assistant: r = "assistant"
}) {
  let n = "";
  e[0].role === "system" && (n += `${e[0].content}

`, e = e.slice(1));
  for (const { role: o, content: a } of e)
    switch (o) {
      case "system":
        throw new sr({
          message: "Unexpected system message in prompt: ${content}",
          prompt: e
        });
      case "user": {
        const s = a.map((i) => {
          switch (i.type) {
            case "text":
              return i.text;
          }
        }).filter(Boolean).join("");
        n += `${t}:
${s}

`;
        break;
      }
      case "assistant": {
        const s = a.map((i) => {
          switch (i.type) {
            case "text":
              return i.text;
            case "tool-call":
              throw new Nt({
                functionality: "tool-call messages"
              });
          }
        }).join("");
        n += `${r}:
${s}

`;
        break;
      }
      case "tool":
        throw new Nt({
          functionality: "tool messages"
        });
      default: {
        const s = o;
        throw new Error(`Unsupported role: ${s}`);
      }
    }
  return n += `${r}:
`, {
    prompt: n,
    stopSequences: [`
${t}:`]
  };
}
function ap({
  id: e,
  model: t,
  created: r
}) {
  return {
    id: e ?? void 0,
    modelId: t ?? void 0,
    timestamp: r != null ? new Date(r * 1e3) : void 0
  };
}
function sp(e) {
  switch (e) {
    case "stop":
      return "stop";
    case "length":
      return "length";
    case "content_filter":
      return "content-filter";
    case "function_call":
    case "tool_calls":
      return "tool-calls";
    default:
      return "unknown";
  }
}
var wR = Oe(
  () => de(
    R({
      id: T().nullish(),
      created: V().nullish(),
      model: T().nullish(),
      choices: ee(
        R({
          text: T(),
          finish_reason: T(),
          logprobs: R({
            tokens: ee(T()),
            token_logprobs: ee(V()),
            top_logprobs: ee(Ce(T(), V())).nullish()
          }).nullish()
        })
      ),
      usage: R({
        prompt_tokens: V(),
        completion_tokens: V(),
        total_tokens: V()
      }).nullish()
    })
  )
), ER = Oe(
  () => de(
    _e([
      R({
        id: T().nullish(),
        created: V().nullish(),
        model: T().nullish(),
        choices: ee(
          R({
            text: T(),
            finish_reason: T().nullish(),
            index: V(),
            logprobs: R({
              tokens: ee(T()),
              token_logprobs: ee(V()),
              top_logprobs: ee(Ce(T(), V())).nullish()
            }).nullish()
          })
        ),
        usage: R({
          prompt_tokens: V(),
          completion_tokens: V(),
          total_tokens: V()
        }).nullish()
      }),
      Xi
    ])
  )
), ip = Oe(
  () => de(
    R({
      /**
      Echo back the prompt in addition to the completion.
         */
      echo: He().optional(),
      /**
      Modify the likelihood of specified tokens appearing in the completion.
      
      Accepts a JSON object that maps tokens (specified by their token ID in
      the GPT tokenizer) to an associated bias value from -100 to 100. You
      can use this tokenizer tool to convert text to token IDs. Mathematically,
      the bias is added to the logits generated by the model prior to sampling.
      The exact effect will vary per model, but values between -1 and 1 should
      decrease or increase likelihood of selection; values like -100 or 100
      should result in a ban or exclusive selection of the relevant token.
      
      As an example, you can pass {"50256": -100} to prevent the <|endoftext|>
      token from being generated.
       */
      logitBias: Ce(T(), V()).optional(),
      /**
      The suffix that comes after a completion of inserted text.
       */
      suffix: T().optional(),
      /**
      A unique identifier representing your end-user, which can help OpenAI to
      monitor and detect abuse. Learn more.
       */
      user: T().optional(),
      /**
      Return the log probabilities of the tokens. Including logprobs will increase
      the response size and can slow down response times. However, it can
      be useful to better understand how the model is behaving.
      Setting to true will return the log probabilities of the tokens that
      were generated.
      Setting to a number will return the log probabilities of the top n
      tokens that were generated.
         */
      logprobs: _e([He(), V()]).optional()
    })
  )
), $R = class {
  constructor(e, t) {
    this.specificationVersion = "v2", this.supportedUrls = {
      // No URLs are supported for completion models.
    }, this.modelId = e, this.config = t;
  }
  get providerOptionsName() {
    return this.config.provider.split(".")[0].trim();
  }
  get provider() {
    return this.config.provider;
  }
  async getArgs({
    prompt: e,
    maxOutputTokens: t,
    temperature: r,
    topP: n,
    topK: o,
    frequencyPenalty: a,
    presencePenalty: s,
    stopSequences: i,
    responseFormat: u,
    tools: c,
    toolChoice: l,
    seed: y,
    providerOptions: d
  }) {
    const f = [], g = {
      ...await Bt({
        provider: "openai",
        providerOptions: d,
        schema: ip
      }),
      ...await Bt({
        provider: this.providerOptionsName,
        providerOptions: d,
        schema: ip
      })
    };
    o != null && f.push({ type: "unsupported-setting", setting: "topK" }), c != null && c.length && f.push({ type: "unsupported-setting", setting: "tools" }), l != null && f.push({ type: "unsupported-setting", setting: "toolChoice" }), u != null && u.type !== "text" && f.push({
      type: "unsupported-setting",
      setting: "responseFormat",
      details: "JSON response format is not supported."
    });
    const { prompt: _, stopSequences: m } = bR({ prompt: e }), h = [...m ?? [], ...i ?? []];
    return {
      args: {
        // model id:
        model: this.modelId,
        // model specific settings:
        echo: g.echo,
        logit_bias: g.logitBias,
        logprobs: (g == null ? void 0 : g.logprobs) === !0 ? 0 : (g == null ? void 0 : g.logprobs) === !1 || g == null ? void 0 : g.logprobs,
        suffix: g.suffix,
        user: g.user,
        // standardized settings:
        max_tokens: t,
        temperature: r,
        top_p: n,
        frequency_penalty: a,
        presence_penalty: s,
        seed: y,
        // prompt:
        prompt: _,
        // stop sequences:
        stop: h.length > 0 ? h : void 0
      },
      warnings: f
    };
  }
  async doGenerate(e) {
    var t, r, n;
    const { args: o, warnings: a } = await this.getArgs(e), {
      responseHeaders: s,
      value: i,
      rawValue: u
    } = await et({
      url: this.config.url({
        path: "/completions",
        modelId: this.modelId
      }),
      headers: Je(this.config.headers(), e.headers),
      body: o,
      failedResponseHandler: _t,
      successfulResponseHandler: ft(
        wR
      ),
      abortSignal: e.abortSignal,
      fetch: this.config.fetch
    }), c = i.choices[0], l = { openai: {} };
    return c.logprobs != null && (l.openai.logprobs = c.logprobs), {
      content: [{ type: "text", text: c.text }],
      usage: {
        inputTokens: (t = i.usage) == null ? void 0 : t.prompt_tokens,
        outputTokens: (r = i.usage) == null ? void 0 : r.completion_tokens,
        totalTokens: (n = i.usage) == null ? void 0 : n.total_tokens
      },
      finishReason: sp(c.finish_reason),
      request: { body: o },
      response: {
        ...ap(i),
        headers: s,
        body: u
      },
      providerMetadata: l,
      warnings: a
    };
  }
  async doStream(e) {
    const { args: t, warnings: r } = await this.getArgs(e), n = {
      ...t,
      stream: !0,
      stream_options: {
        include_usage: !0
      }
    }, { responseHeaders: o, value: a } = await et({
      url: this.config.url({
        path: "/completions",
        modelId: this.modelId
      }),
      headers: Je(this.config.headers(), e.headers),
      body: n,
      failedResponseHandler: _t,
      successfulResponseHandler: wa(
        ER
      ),
      abortSignal: e.abortSignal,
      fetch: this.config.fetch
    });
    let s = "unknown";
    const i = { openai: {} }, u = {
      inputTokens: void 0,
      outputTokens: void 0,
      totalTokens: void 0
    };
    let c = !0;
    return {
      stream: a.pipeThrough(
        new TransformStream({
          start(l) {
            l.enqueue({ type: "stream-start", warnings: r });
          },
          transform(l, y) {
            if (e.includeRawChunks && y.enqueue({ type: "raw", rawValue: l.rawValue }), !l.success) {
              s = "error", y.enqueue({ type: "error", error: l.error });
              return;
            }
            const d = l.value;
            if ("error" in d) {
              s = "error", y.enqueue({ type: "error", error: d.error });
              return;
            }
            c && (c = !1, y.enqueue({
              type: "response-metadata",
              ...ap(d)
            }), y.enqueue({ type: "text-start", id: "0" })), d.usage != null && (u.inputTokens = d.usage.prompt_tokens, u.outputTokens = d.usage.completion_tokens, u.totalTokens = d.usage.total_tokens);
            const f = d.choices[0];
            (f == null ? void 0 : f.finish_reason) != null && (s = sp(f.finish_reason)), (f == null ? void 0 : f.logprobs) != null && (i.openai.logprobs = f.logprobs), (f == null ? void 0 : f.text) != null && f.text.length > 0 && y.enqueue({
              type: "text-delta",
              id: "0",
              delta: f.text
            });
          },
          flush(l) {
            c || l.enqueue({ type: "text-end", id: "0" }), l.enqueue({
              type: "finish",
              finishReason: s,
              providerMetadata: i,
              usage: u
            });
          }
        })
      ),
      request: { body: n },
      response: { headers: o }
    };
  }
}, SR = Oe(
  () => de(
    R({
      /**
      The number of dimensions the resulting output embeddings should have.
      Only supported in text-embedding-3 and later models.
         */
      dimensions: V().optional(),
      /**
      A unique identifier representing your end-user, which can help OpenAI to
      monitor and detect abuse. Learn more.
      */
      user: T().optional()
    })
  )
), IR = Oe(
  () => de(
    R({
      data: ee(R({ embedding: ee(V()) })),
      usage: R({ prompt_tokens: V() }).nullish()
    })
  )
), TR = class {
  constructor(e, t) {
    this.specificationVersion = "v2", this.maxEmbeddingsPerCall = 2048, this.supportsParallelCalls = !0, this.modelId = e, this.config = t;
  }
  get provider() {
    return this.config.provider;
  }
  async doEmbed({
    values: e,
    headers: t,
    abortSignal: r,
    providerOptions: n
  }) {
    var o;
    if (e.length > this.maxEmbeddingsPerCall)
      throw new J0({
        provider: this.provider,
        modelId: this.modelId,
        maxEmbeddingsPerCall: this.maxEmbeddingsPerCall,
        values: e
      });
    const a = (o = await Bt({
      provider: "openai",
      providerOptions: n,
      schema: SR
    })) != null ? o : {}, {
      responseHeaders: s,
      value: i,
      rawValue: u
    } = await et({
      url: this.config.url({
        path: "/embeddings",
        modelId: this.modelId
      }),
      headers: Je(this.config.headers(), t),
      body: {
        model: this.modelId,
        input: e,
        encoding_format: "float",
        dimensions: a.dimensions,
        user: a.user
      },
      failedResponseHandler: _t,
      successfulResponseHandler: ft(
        IR
      ),
      abortSignal: r,
      fetch: this.config.fetch
    });
    return {
      embeddings: i.data.map((c) => c.embedding),
      usage: i.usage ? { tokens: i.usage.prompt_tokens } : void 0,
      response: { headers: s, body: u }
    };
  }
}, OR = Oe(
  () => de(
    R({
      data: ee(
        R({
          b64_json: T(),
          revised_prompt: T().nullish()
        })
      )
    })
  )
), RR = {
  "dall-e-3": 1,
  "dall-e-2": 10,
  "gpt-image-1": 10,
  "gpt-image-1-mini": 10
}, PR = /* @__PURE__ */ new Set([
  "gpt-image-1",
  "gpt-image-1-mini"
]), kR = class {
  constructor(e, t) {
    this.modelId = e, this.config = t, this.specificationVersion = "v2";
  }
  get maxImagesPerCall() {
    var e;
    return (e = RR[this.modelId]) != null ? e : 1;
  }
  get provider() {
    return this.config.provider;
  }
  async doGenerate({
    prompt: e,
    n: t,
    size: r,
    aspectRatio: n,
    seed: o,
    providerOptions: a,
    headers: s,
    abortSignal: i
  }) {
    var u, c, l, y;
    const d = [];
    n != null && d.push({
      type: "unsupported-setting",
      setting: "aspectRatio",
      details: "This model does not support aspect ratio. Use `size` instead."
    }), o != null && d.push({ type: "unsupported-setting", setting: "seed" });
    const f = (l = (c = (u = this.config._internal) == null ? void 0 : u.currentDate) == null ? void 0 : c.call(u)) != null ? l : /* @__PURE__ */ new Date(), { value: g, responseHeaders: _ } = await et({
      url: this.config.url({
        path: "/images/generations",
        modelId: this.modelId
      }),
      headers: Je(this.config.headers(), s),
      body: {
        model: this.modelId,
        prompt: e,
        n: t,
        size: r,
        ...(y = a.openai) != null ? y : {},
        ...PR.has(this.modelId) ? {} : { response_format: "b64_json" }
      },
      failedResponseHandler: _t,
      successfulResponseHandler: ft(
        OR
      ),
      abortSignal: i,
      fetch: this.config.fetch
    });
    return {
      images: g.data.map((m) => m.b64_json),
      warnings: d,
      response: {
        timestamp: f,
        modelId: this.modelId,
        headers: _
      },
      providerMetadata: {
        openai: {
          images: g.data.map(
            (m) => m.revised_prompt ? {
              revisedPrompt: m.revised_prompt
            } : null
          )
        }
      }
    };
  }
}, NR = Ve(
  () => de(
    R({
      code: T().nullish(),
      containerId: T()
    })
  )
), AR = Ve(
  () => de(
    R({
      outputs: ee(
        Me("type", [
          R({ type: Z("logs"), logs: T() }),
          R({ type: Z("image"), url: T() })
        ])
      ).nullish()
    })
  )
), CR = Ve(
  () => de(
    R({
      container: _e([
        T(),
        R({
          fileIds: ee(T()).optional()
        })
      ]).optional()
    })
  )
), jR = Dr({
  id: "openai.code_interpreter",
  name: "code_interpreter",
  inputSchema: NR,
  outputSchema: AR
}), MR = (e = {}) => jR(e), hg = R({
  key: T(),
  type: Ee(["eq", "ne", "gt", "gte", "lt", "lte"]),
  value: _e([T(), V(), He()])
}), mg = R({
  type: Ee(["and", "or"]),
  filters: ee(
    _e([hg, em(() => mg)])
  )
}), xR = Ve(
  () => de(
    R({
      vectorStoreIds: ee(T()),
      maxNumResults: V().optional(),
      ranking: R({
        ranker: T().optional(),
        scoreThreshold: V().optional()
      }).optional(),
      filters: _e([hg, mg]).optional()
    })
  )
), DR = Ve(
  () => de(
    R({
      queries: ee(T()),
      results: ee(
        R({
          attributes: Ce(T(), At()),
          fileId: T(),
          filename: T(),
          score: V(),
          text: T()
        })
      ).nullable()
    })
  )
), qR = Dr({
  id: "openai.file_search",
  name: "file_search",
  inputSchema: R({}),
  outputSchema: DR
}), LR = Ve(
  () => de(
    R({
      background: Ee(["auto", "opaque", "transparent"]).optional(),
      inputFidelity: Ee(["low", "high"]).optional(),
      inputImageMask: R({
        fileId: T().optional(),
        imageUrl: T().optional()
      }).optional(),
      model: T().optional(),
      moderation: Ee(["auto"]).optional(),
      outputCompression: V().int().min(0).max(100).optional(),
      outputFormat: Ee(["png", "jpeg", "webp"]).optional(),
      partialImages: V().int().min(0).max(3).optional(),
      quality: Ee(["auto", "low", "medium", "high"]).optional(),
      size: Ee(["1024x1024", "1024x1536", "1536x1024", "auto"]).optional()
    }).strict()
  )
), zR = Ve(() => de(R({}))), VR = Ve(
  () => de(R({ result: T() }))
), UR = Dr({
  id: "openai.image_generation",
  name: "image_generation",
  inputSchema: zR,
  outputSchema: VR
}), FR = (e = {}) => UR(e), gg = Ve(
  () => de(
    R({
      action: R({
        type: Z("exec"),
        command: ee(T()),
        timeoutMs: V().optional(),
        user: T().optional(),
        workingDirectory: T().optional(),
        env: Ce(T(), T()).optional()
      })
    })
  )
), yg = Ve(
  () => de(R({ output: T() }))
), ZR = Dr({
  id: "openai.local_shell",
  name: "local_shell",
  inputSchema: gg,
  outputSchema: yg
}), GR = Ve(
  () => de(
    R({
      filters: R({ allowedDomains: ee(T()).optional() }).optional(),
      searchContextSize: Ee(["low", "medium", "high"]).optional(),
      userLocation: R({
        type: Z("approximate"),
        country: T().optional(),
        city: T().optional(),
        region: T().optional(),
        timezone: T().optional()
      }).optional()
    })
  )
), BR = Ve(() => de(R({}))), HR = Ve(
  () => de(
    R({
      action: Me("type", [
        R({
          type: Z("search"),
          query: T().optional()
        }),
        R({
          type: Z("openPage"),
          url: T()
        }),
        R({
          type: Z("find"),
          url: T(),
          pattern: T()
        })
      ]),
      sources: ee(
        Me("type", [
          R({ type: Z("url"), url: T() }),
          R({ type: Z("api"), name: T() })
        ])
      ).optional()
    })
  )
), WR = Dr({
  id: "openai.web_search",
  name: "web_search",
  inputSchema: BR,
  outputSchema: HR
}), JR = (e = {}) => WR(e), KR = Ve(
  () => de(
    R({
      searchContextSize: Ee(["low", "medium", "high"]).optional(),
      userLocation: R({
        type: Z("approximate"),
        country: T().optional(),
        city: T().optional(),
        region: T().optional(),
        timezone: T().optional()
      }).optional()
    })
  )
), YR = Ve(
  () => de(R({}))
), XR = Ve(
  () => de(
    R({
      action: Me("type", [
        R({
          type: Z("search"),
          query: T().optional()
        }),
        R({
          type: Z("openPage"),
          url: T()
        }),
        R({
          type: Z("find"),
          url: T(),
          pattern: T()
        })
      ])
    })
  )
), QR = Dr({
  id: "openai.web_search_preview",
  name: "web_search_preview",
  inputSchema: YR,
  outputSchema: XR
}), eP = {
  /**
   * The Code Interpreter tool allows models to write and run Python code in a
   * sandboxed environment to solve complex problems in domains like data analysis,
   * coding, and math.
   *
   * @param container - The container to use for the code interpreter.
   *
   * Must have name `code_interpreter`.
   */
  codeInterpreter: MR,
  /**
   * File search is a tool available in the Responses API. It enables models to
   * retrieve information in a knowledge base of previously uploaded files through
   * semantic and keyword search.
   *
   * Must have name `file_search`.
   *
   * @param vectorStoreIds - The vector store IDs to use for the file search.
   * @param maxNumResults - The maximum number of results to return.
   * @param ranking - The ranking options to use for the file search.
   * @param filters - The filters to use for the file search.
   */
  fileSearch: qR,
  /**
   * The image generation tool allows you to generate images using a text prompt,
   * and optionally image inputs. It leverages the GPT Image model,
   * and automatically optimizes text inputs for improved performance.
   *
   * Must have name `image_generation`.
   *
   * @param size - Image dimensions (e.g., 1024x1024, 1024x1536)
   * @param quality - Rendering quality (e.g. low, medium, high)
   * @param format - File output format
   * @param compression - Compression level (0-100%) for JPEG and WebP formats
   * @param background - Transparent or opaque
   */
  imageGeneration: FR,
  /**
   * Local shell is a tool that allows agents to run shell commands locally
   * on a machine you or the user provides.
   *
   * Supported models: `gpt-5-codex` and `codex-mini-latest`
   *
   * Must have name `local_shell`.
   */
  localShell: ZR,
  /**
   * Web search allows models to access up-to-date information from the internet
   * and provide answers with sourced citations.
   *
   * Must have name `web_search_preview`.
   *
   * @param searchContextSize - The search context size to use for the web search.
   * @param userLocation - The user location to use for the web search.
   *
   * @deprecated Use `webSearch` instead.
   */
  webSearchPreview: QR,
  /**
   * Web search allows models to access up-to-date information from the internet
   * and provide answers with sourced citations.
   *
   * Must have name `web_search`.
   *
   * @param filters - The filters to use for the web search.
   * @param searchContextSize - The search context size to use for the web search.
   * @param userLocation - The user location to use for the web search.
   */
  webSearch: JR
};
function up(e, t) {
  return t ? t.some((r) => e.startsWith(r)) : !1;
}
async function tP({
  prompt: e,
  systemMessageMode: t,
  fileIdPrefixes: r,
  store: n,
  hasLocalShellTool: o = !1
}) {
  var a, s, i, u;
  const c = [], l = [];
  for (const { role: y, content: d } of e)
    switch (y) {
      case "system": {
        switch (t) {
          case "system": {
            c.push({ role: "system", content: d });
            break;
          }
          case "developer": {
            c.push({ role: "developer", content: d });
            break;
          }
          case "remove": {
            l.push({
              type: "other",
              message: "system messages are removed for this model"
            });
            break;
          }
          default: {
            const f = t;
            throw new Error(
              `Unsupported system message mode: ${f}`
            );
          }
        }
        break;
      }
      case "user": {
        c.push({
          role: "user",
          content: d.map((f, g) => {
            var _, m, h;
            switch (f.type) {
              case "text":
                return { type: "input_text", text: f.text };
              case "file":
                if (f.mediaType.startsWith("image/")) {
                  const p = f.mediaType === "image/*" ? "image/jpeg" : f.mediaType;
                  return {
                    type: "input_image",
                    ...f.data instanceof URL ? { image_url: f.data.toString() } : typeof f.data == "string" && up(f.data, r) ? { file_id: f.data } : {
                      image_url: `data:${p};base64,${Or(f.data)}`
                    },
                    detail: (m = (_ = f.providerOptions) == null ? void 0 : _.openai) == null ? void 0 : m.imageDetail
                  };
                } else {
                  if (f.mediaType === "application/pdf")
                    return f.data instanceof URL ? {
                      type: "input_file",
                      file_url: f.data.toString()
                    } : {
                      type: "input_file",
                      ...typeof f.data == "string" && up(f.data, r) ? { file_id: f.data } : {
                        filename: (h = f.filename) != null ? h : `part-${g}.pdf`,
                        file_data: `data:application/pdf;base64,${Or(f.data)}`
                      }
                    };
                  throw new Nt({
                    functionality: `file part media type ${f.mediaType}`
                  });
                }
            }
          })
        });
        break;
      }
      case "assistant": {
        const f = {}, g = {};
        for (const _ of d)
          switch (_.type) {
            case "text": {
              const m = (s = (a = _.providerOptions) == null ? void 0 : a.openai) == null ? void 0 : s.itemId;
              if (n && m != null) {
                c.push({ type: "item_reference", id: m });
                break;
              }
              c.push({
                role: "assistant",
                content: [{ type: "output_text", text: _.text }],
                id: m
              });
              break;
            }
            case "tool-call": {
              if (g[_.toolCallId] = _, _.providerExecuted)
                break;
              const m = (u = (i = _.providerOptions) == null ? void 0 : i.openai) == null ? void 0 : u.itemId;
              if (n && m != null) {
                c.push({ type: "item_reference", id: m });
                break;
              }
              if (o && _.toolName === "local_shell") {
                const h = await Ut({
                  value: _.input,
                  schema: gg
                });
                c.push({
                  type: "local_shell_call",
                  call_id: _.toolCallId,
                  id: m,
                  action: {
                    type: "exec",
                    command: h.action.command,
                    timeout_ms: h.action.timeoutMs,
                    user: h.action.user,
                    working_directory: h.action.workingDirectory,
                    env: h.action.env
                  }
                });
                break;
              }
              c.push({
                type: "function_call",
                call_id: _.toolCallId,
                name: _.toolName,
                arguments: JSON.stringify(_.input),
                id: m
              });
              break;
            }
            // assistant tool result parts are from provider-executed tools:
            case "tool-result": {
              n ? c.push({ type: "item_reference", id: _.toolCallId }) : l.push({
                type: "other",
                message: `Results for OpenAI tool ${_.toolName} are not sent to the API when store is false`
              });
              break;
            }
            case "reasoning": {
              const m = await Bt({
                provider: "openai",
                providerOptions: _.providerOptions,
                schema: rP
              }), h = m == null ? void 0 : m.itemId;
              if (h != null) {
                const p = f[h];
                if (n)
                  p === void 0 && (c.push({ type: "item_reference", id: h }), f[h] = {
                    type: "reasoning",
                    id: h,
                    summary: []
                  });
                else {
                  const v = [];
                  _.text.length > 0 ? v.push({
                    type: "summary_text",
                    text: _.text
                  }) : p !== void 0 && l.push({
                    type: "other",
                    message: `Cannot append empty reasoning part to existing reasoning sequence. Skipping reasoning part: ${JSON.stringify(_)}.`
                  }), p === void 0 ? (f[h] = {
                    type: "reasoning",
                    id: h,
                    encrypted_content: m == null ? void 0 : m.reasoningEncryptedContent,
                    summary: v
                  }, c.push(f[h])) : (p.summary.push(...v), (m == null ? void 0 : m.reasoningEncryptedContent) != null && (p.encrypted_content = m.reasoningEncryptedContent));
                }
              } else
                l.push({
                  type: "other",
                  message: `Non-OpenAI reasoning parts are not supported. Skipping reasoning part: ${JSON.stringify(_)}.`
                });
              break;
            }
          }
        break;
      }
      case "tool": {
        for (const f of d) {
          const g = f.output;
          if (o && f.toolName === "local_shell" && g.type === "json") {
            const m = await Ut({
              value: g.value,
              schema: yg
            });
            c.push({
              type: "local_shell_call_output",
              call_id: f.toolCallId,
              output: m.output
            });
            break;
          }
          let _;
          switch (g.type) {
            case "text":
            case "error-text":
              _ = g.value;
              break;
            case "json":
            case "error-json":
              _ = JSON.stringify(g.value);
              break;
            case "content":
              _ = g.value.map((m) => {
                switch (m.type) {
                  case "text":
                    return { type: "input_text", text: m.text };
                  case "media":
                    return m.mediaType.startsWith("image/") ? {
                      type: "input_image",
                      image_url: `data:${m.mediaType};base64,${m.data}`
                    } : {
                      type: "input_file",
                      filename: "data",
                      file_data: `data:${m.mediaType};base64,${m.data}`
                    };
                }
              });
              break;
          }
          c.push({
            type: "function_call_output",
            call_id: f.toolCallId,
            output: _
          });
        }
        break;
      }
      default: {
        const f = y;
        throw new Error(`Unsupported role: ${f}`);
      }
    }
  return { input: c, warnings: l };
}
var rP = R({
  itemId: T().nullish(),
  reasoningEncryptedContent: T().nullish()
});
function cp({
  finishReason: e,
  hasFunctionCall: t
}) {
  switch (e) {
    case void 0:
    case null:
      return t ? "tool-calls" : "stop";
    case "max_output_tokens":
      return "length";
    case "content_filter":
      return "content-filter";
    default:
      return t ? "tool-calls" : "unknown";
  }
}
var nP = Oe(
  () => de(
    _e([
      R({
        type: Z("response.output_text.delta"),
        item_id: T(),
        delta: T(),
        logprobs: ee(
          R({
            token: T(),
            logprob: V(),
            top_logprobs: ee(
              R({
                token: T(),
                logprob: V()
              })
            )
          })
        ).nullish()
      }),
      R({
        type: Ee(["response.completed", "response.incomplete"]),
        response: R({
          incomplete_details: R({ reason: T() }).nullish(),
          usage: R({
            input_tokens: V(),
            input_tokens_details: R({ cached_tokens: V().nullish() }).nullish(),
            output_tokens: V(),
            output_tokens_details: R({ reasoning_tokens: V().nullish() }).nullish()
          }),
          service_tier: T().nullish()
        })
      }),
      R({
        type: Z("response.created"),
        response: R({
          id: T(),
          created_at: V(),
          model: T(),
          service_tier: T().nullish()
        })
      }),
      R({
        type: Z("response.output_item.added"),
        output_index: V(),
        item: Me("type", [
          R({
            type: Z("message"),
            id: T()
          }),
          R({
            type: Z("reasoning"),
            id: T(),
            encrypted_content: T().nullish()
          }),
          R({
            type: Z("function_call"),
            id: T(),
            call_id: T(),
            name: T(),
            arguments: T()
          }),
          R({
            type: Z("web_search_call"),
            id: T(),
            status: T()
          }),
          R({
            type: Z("computer_call"),
            id: T(),
            status: T()
          }),
          R({
            type: Z("file_search_call"),
            id: T()
          }),
          R({
            type: Z("image_generation_call"),
            id: T()
          }),
          R({
            type: Z("code_interpreter_call"),
            id: T(),
            container_id: T(),
            code: T().nullable(),
            outputs: ee(
              Me("type", [
                R({ type: Z("logs"), logs: T() }),
                R({ type: Z("image"), url: T() })
              ])
            ).nullable(),
            status: T()
          })
        ])
      }),
      R({
        type: Z("response.output_item.done"),
        output_index: V(),
        item: Me("type", [
          R({
            type: Z("message"),
            id: T()
          }),
          R({
            type: Z("reasoning"),
            id: T(),
            encrypted_content: T().nullish()
          }),
          R({
            type: Z("function_call"),
            id: T(),
            call_id: T(),
            name: T(),
            arguments: T(),
            status: Z("completed")
          }),
          R({
            type: Z("code_interpreter_call"),
            id: T(),
            code: T().nullable(),
            container_id: T(),
            outputs: ee(
              Me("type", [
                R({ type: Z("logs"), logs: T() }),
                R({ type: Z("image"), url: T() })
              ])
            ).nullable()
          }),
          R({
            type: Z("image_generation_call"),
            id: T(),
            result: T()
          }),
          R({
            type: Z("web_search_call"),
            id: T(),
            status: T(),
            action: Me("type", [
              R({
                type: Z("search"),
                query: T().nullish(),
                sources: ee(
                  Me("type", [
                    R({ type: Z("url"), url: T() }),
                    R({ type: Z("api"), name: T() })
                  ])
                ).nullish()
              }),
              R({
                type: Z("open_page"),
                url: T()
              }),
              R({
                type: Z("find"),
                url: T(),
                pattern: T()
              })
            ])
          }),
          R({
            type: Z("file_search_call"),
            id: T(),
            queries: ee(T()),
            results: ee(
              R({
                attributes: Ce(T(), At()),
                file_id: T(),
                filename: T(),
                score: V(),
                text: T()
              })
            ).nullish()
          }),
          R({
            type: Z("local_shell_call"),
            id: T(),
            call_id: T(),
            action: R({
              type: Z("exec"),
              command: ee(T()),
              timeout_ms: V().optional(),
              user: T().optional(),
              working_directory: T().optional(),
              env: Ce(T(), T()).optional()
            })
          }),
          R({
            type: Z("computer_call"),
            id: T(),
            status: Z("completed")
          })
        ])
      }),
      R({
        type: Z("response.function_call_arguments.delta"),
        item_id: T(),
        output_index: V(),
        delta: T()
      }),
      R({
        type: Z("response.image_generation_call.partial_image"),
        item_id: T(),
        output_index: V(),
        partial_image_b64: T()
      }),
      R({
        type: Z("response.code_interpreter_call_code.delta"),
        item_id: T(),
        output_index: V(),
        delta: T()
      }),
      R({
        type: Z("response.code_interpreter_call_code.done"),
        item_id: T(),
        output_index: V(),
        code: T()
      }),
      R({
        type: Z("response.output_text.annotation.added"),
        annotation: Me("type", [
          R({
            type: Z("url_citation"),
            start_index: V(),
            end_index: V(),
            url: T(),
            title: T()
          }),
          R({
            type: Z("file_citation"),
            file_id: T(),
            filename: T().nullish(),
            index: V().nullish(),
            start_index: V().nullish(),
            end_index: V().nullish(),
            quote: T().nullish()
          })
        ])
      }),
      R({
        type: Z("response.reasoning_summary_part.added"),
        item_id: T(),
        summary_index: V()
      }),
      R({
        type: Z("response.reasoning_summary_text.delta"),
        item_id: T(),
        summary_index: V(),
        delta: T()
      }),
      R({
        type: Z("response.reasoning_summary_part.done"),
        item_id: T(),
        summary_index: V()
      }),
      R({
        type: Z("error"),
        sequence_number: V(),
        error: R({
          type: T(),
          code: T(),
          message: T(),
          param: T().nullish()
        })
      }),
      R({ type: T() }).loose().transform((e) => ({
        type: "unknown_chunk",
        message: e.type
      }))
      // fallback for unknown chunks
    ])
  )
), oP = Oe(
  () => de(
    R({
      id: T().optional(),
      created_at: V().optional(),
      error: R({
        message: T(),
        type: T(),
        param: T().nullish(),
        code: T()
      }).nullish(),
      model: T().optional(),
      output: ee(
        Me("type", [
          R({
            type: Z("message"),
            role: Z("assistant"),
            id: T(),
            content: ee(
              R({
                type: Z("output_text"),
                text: T(),
                logprobs: ee(
                  R({
                    token: T(),
                    logprob: V(),
                    top_logprobs: ee(
                      R({
                        token: T(),
                        logprob: V()
                      })
                    )
                  })
                ).nullish(),
                annotations: ee(
                  Me("type", [
                    R({
                      type: Z("url_citation"),
                      start_index: V(),
                      end_index: V(),
                      url: T(),
                      title: T()
                    }),
                    R({
                      type: Z("file_citation"),
                      file_id: T(),
                      filename: T().nullish(),
                      index: V().nullish(),
                      start_index: V().nullish(),
                      end_index: V().nullish(),
                      quote: T().nullish()
                    }),
                    R({
                      type: Z("container_file_citation"),
                      container_id: T(),
                      file_id: T(),
                      filename: T().nullish(),
                      start_index: V().nullish(),
                      end_index: V().nullish(),
                      index: V().nullish()
                    }),
                    R({
                      type: Z("file_path"),
                      file_id: T(),
                      index: V().nullish()
                    })
                  ])
                )
              })
            )
          }),
          R({
            type: Z("web_search_call"),
            id: T(),
            status: T(),
            action: Me("type", [
              R({
                type: Z("search"),
                query: T().nullish(),
                sources: ee(
                  Me("type", [
                    R({ type: Z("url"), url: T() }),
                    R({ type: Z("api"), name: T() })
                  ])
                ).nullish()
              }),
              R({
                type: Z("open_page"),
                url: T()
              }),
              R({
                type: Z("find"),
                url: T(),
                pattern: T()
              })
            ])
          }),
          R({
            type: Z("file_search_call"),
            id: T(),
            queries: ee(T()),
            results: ee(
              R({
                attributes: Ce(
                  T(),
                  _e([T(), V(), He()])
                ),
                file_id: T(),
                filename: T(),
                score: V(),
                text: T()
              })
            ).nullish()
          }),
          R({
            type: Z("code_interpreter_call"),
            id: T(),
            code: T().nullable(),
            container_id: T(),
            outputs: ee(
              Me("type", [
                R({ type: Z("logs"), logs: T() }),
                R({ type: Z("image"), url: T() })
              ])
            ).nullable()
          }),
          R({
            type: Z("image_generation_call"),
            id: T(),
            result: T()
          }),
          R({
            type: Z("local_shell_call"),
            id: T(),
            call_id: T(),
            action: R({
              type: Z("exec"),
              command: ee(T()),
              timeout_ms: V().optional(),
              user: T().optional(),
              working_directory: T().optional(),
              env: Ce(T(), T()).optional()
            })
          }),
          R({
            type: Z("function_call"),
            call_id: T(),
            name: T(),
            arguments: T(),
            id: T()
          }),
          R({
            type: Z("computer_call"),
            id: T(),
            status: T().optional()
          }),
          R({
            type: Z("reasoning"),
            id: T(),
            encrypted_content: T().nullish(),
            summary: ee(
              R({
                type: Z("summary_text"),
                text: T()
              })
            )
          })
        ])
      ).optional(),
      service_tier: T().nullish(),
      incomplete_details: R({ reason: T() }).nullish(),
      usage: R({
        input_tokens: V(),
        input_tokens_details: R({ cached_tokens: V().nullish() }).nullish(),
        output_tokens: V(),
        output_tokens_details: R({ reasoning_tokens: V().nullish() }).nullish()
      }).optional()
    })
  )
), vg = 20, aP = Oe(
  () => de(
    R({
      conversation: T().nullish(),
      include: ee(
        Ee([
          "reasoning.encrypted_content",
          // handled internally by default, only needed for unknown reasoning models
          "file_search_call.results",
          "message.output_text.logprobs"
        ])
      ).nullish(),
      instructions: T().nullish(),
      /**
       * Return the log probabilities of the tokens.
       *
       * Setting to true will return the log probabilities of the tokens that
       * were generated.
       *
       * Setting to a number will return the log probabilities of the top n
       * tokens that were generated.
       *
       * @see https://platform.openai.com/docs/api-reference/responses/create
       * @see https://cookbook.openai.com/examples/using_logprobs
       */
      logprobs: _e([He(), V().min(1).max(vg)]).optional(),
      /**
       * The maximum number of total calls to built-in tools that can be processed in a response.
       * This maximum number applies across all built-in tool calls, not per individual tool.
       * Any further attempts to call a tool by the model will be ignored.
       */
      maxToolCalls: V().nullish(),
      metadata: lt().nullish(),
      parallelToolCalls: He().nullish(),
      previousResponseId: T().nullish(),
      promptCacheKey: T().nullish(),
      /**
       * The retention policy for the prompt cache.
       * - 'in_memory': Default. Standard prompt caching behavior.
       * - '24h': Extended prompt caching that keeps cached prefixes active for up to 24 hours.
       *          Currently only available for 5.1 series models.
       *
       * @default 'in_memory'
       */
      promptCacheRetention: Ee(["in_memory", "24h"]).nullish(),
      reasoningEffort: T().nullish(),
      reasoningSummary: T().nullish(),
      safetyIdentifier: T().nullish(),
      serviceTier: Ee(["auto", "flex", "priority", "default"]).nullish(),
      store: He().nullish(),
      strictJsonSchema: He().nullish(),
      textVerbosity: Ee(["low", "medium", "high"]).nullish(),
      truncation: Ee(["auto", "disabled"]).nullish(),
      user: T().nullish()
    })
  )
);
async function sP({
  tools: e,
  toolChoice: t,
  strictJsonSchema: r
}) {
  e = e != null && e.length ? e : void 0;
  const n = [];
  if (e == null)
    return { tools: void 0, toolChoice: void 0, toolWarnings: n };
  const o = [];
  for (const s of e)
    switch (s.type) {
      case "function":
        o.push({
          type: "function",
          name: s.name,
          description: s.description,
          parameters: s.inputSchema,
          strict: r
        });
        break;
      case "provider-defined": {
        switch (s.id) {
          case "openai.file_search": {
            const i = await Ut({
              value: s.args,
              schema: xR
            });
            o.push({
              type: "file_search",
              vector_store_ids: i.vectorStoreIds,
              max_num_results: i.maxNumResults,
              ranking_options: i.ranking ? {
                ranker: i.ranking.ranker,
                score_threshold: i.ranking.scoreThreshold
              } : void 0,
              filters: i.filters
            });
            break;
          }
          case "openai.local_shell": {
            o.push({
              type: "local_shell"
            });
            break;
          }
          case "openai.web_search_preview": {
            const i = await Ut({
              value: s.args,
              schema: KR
            });
            o.push({
              type: "web_search_preview",
              search_context_size: i.searchContextSize,
              user_location: i.userLocation
            });
            break;
          }
          case "openai.web_search": {
            const i = await Ut({
              value: s.args,
              schema: GR
            });
            o.push({
              type: "web_search",
              filters: i.filters != null ? { allowed_domains: i.filters.allowedDomains } : void 0,
              search_context_size: i.searchContextSize,
              user_location: i.userLocation
            });
            break;
          }
          case "openai.code_interpreter": {
            const i = await Ut({
              value: s.args,
              schema: CR
            });
            o.push({
              type: "code_interpreter",
              container: i.container == null ? { type: "auto", file_ids: void 0 } : typeof i.container == "string" ? i.container : { type: "auto", file_ids: i.container.fileIds }
            });
            break;
          }
          case "openai.image_generation": {
            const i = await Ut({
              value: s.args,
              schema: LR
            });
            o.push({
              type: "image_generation",
              background: i.background,
              input_fidelity: i.inputFidelity,
              input_image_mask: i.inputImageMask ? {
                file_id: i.inputImageMask.fileId,
                image_url: i.inputImageMask.imageUrl
              } : void 0,
              model: i.model,
              size: i.size,
              quality: i.quality,
              moderation: i.moderation,
              output_format: i.outputFormat,
              output_compression: i.outputCompression
            });
            break;
          }
        }
        break;
      }
      default:
        n.push({ type: "unsupported-tool", tool: s });
        break;
    }
  if (t == null)
    return { tools: o, toolChoice: void 0, toolWarnings: n };
  const a = t.type;
  switch (a) {
    case "auto":
    case "none":
    case "required":
      return { tools: o, toolChoice: a, toolWarnings: n };
    case "tool":
      return {
        tools: o,
        toolChoice: t.toolName === "code_interpreter" || t.toolName === "file_search" || t.toolName === "image_generation" || t.toolName === "web_search_preview" || t.toolName === "web_search" ? { type: t.toolName } : { type: "function", name: t.toolName },
        toolWarnings: n
      };
    default: {
      const s = a;
      throw new Nt({
        functionality: `tool choice type: ${s}`
      });
    }
  }
}
var iP = class {
  constructor(e, t) {
    this.specificationVersion = "v2", this.supportedUrls = {
      "image/*": [/^https?:\/\/.*$/],
      "application/pdf": [/^https?:\/\/.*$/]
    }, this.modelId = e, this.config = t;
  }
  get provider() {
    return this.config.provider;
  }
  async getArgs({
    maxOutputTokens: e,
    temperature: t,
    stopSequences: r,
    topP: n,
    topK: o,
    presencePenalty: a,
    frequencyPenalty: s,
    seed: i,
    prompt: u,
    providerOptions: c,
    tools: l,
    toolChoice: y,
    responseFormat: d
  }) {
    var f, g, _, m;
    const h = [], p = gP(this.modelId);
    o != null && h.push({ type: "unsupported-setting", setting: "topK" }), i != null && h.push({ type: "unsupported-setting", setting: "seed" }), a != null && h.push({
      type: "unsupported-setting",
      setting: "presencePenalty"
    }), s != null && h.push({
      type: "unsupported-setting",
      setting: "frequencyPenalty"
    }), r != null && h.push({ type: "unsupported-setting", setting: "stopSequences" });
    const v = await Bt({
      provider: "openai",
      providerOptions: c,
      schema: aP
    });
    v != null && v.conversation && (v != null && v.previousResponseId) && h.push({
      type: "unsupported-setting",
      setting: "conversation",
      details: "conversation and previousResponseId cannot be used together"
    });
    const { input: $, warnings: b } = await tP({
      prompt: u,
      systemMessageMode: p.systemMessageMode,
      fileIdPrefixes: this.config.fileIdPrefixes,
      store: (f = v == null ? void 0 : v.store) != null ? f : !0,
      hasLocalShellTool: q("openai.local_shell")
    });
    h.push(...b);
    const E = (g = v == null ? void 0 : v.strictJsonSchema) != null ? g : !1;
    let I = v == null ? void 0 : v.include;
    function O(G) {
      I == null ? I = [G] : I.includes(G) || (I = [...I, G]);
    }
    function q(G) {
      return (l == null ? void 0 : l.find(
        (B) => B.type === "provider-defined" && B.id === G
      )) != null;
    }
    const H = typeof (v == null ? void 0 : v.logprobs) == "number" ? v == null ? void 0 : v.logprobs : (v == null ? void 0 : v.logprobs) === !0 ? vg : void 0;
    H && O("message.output_text.logprobs");
    const x = (_ = l == null ? void 0 : l.find(
      (G) => G.type === "provider-defined" && (G.id === "openai.web_search" || G.id === "openai.web_search_preview")
    )) == null ? void 0 : _.name;
    x && O("web_search_call.action.sources"), q("openai.code_interpreter") && O("code_interpreter_call.outputs");
    const W = v == null ? void 0 : v.store;
    W === !1 && p.isReasoningModel && O("reasoning.encrypted_content");
    const K = {
      model: this.modelId,
      input: $,
      temperature: t,
      top_p: n,
      max_output_tokens: e,
      ...((d == null ? void 0 : d.type) === "json" || (v == null ? void 0 : v.textVerbosity)) && {
        text: {
          ...(d == null ? void 0 : d.type) === "json" && {
            format: d.schema != null ? {
              type: "json_schema",
              strict: E,
              name: (m = d.name) != null ? m : "response",
              description: d.description,
              schema: d.schema
            } : { type: "json_object" }
          },
          ...(v == null ? void 0 : v.textVerbosity) && {
            verbosity: v.textVerbosity
          }
        }
      },
      // provider options:
      conversation: v == null ? void 0 : v.conversation,
      max_tool_calls: v == null ? void 0 : v.maxToolCalls,
      metadata: v == null ? void 0 : v.metadata,
      parallel_tool_calls: v == null ? void 0 : v.parallelToolCalls,
      previous_response_id: v == null ? void 0 : v.previousResponseId,
      store: W,
      user: v == null ? void 0 : v.user,
      instructions: v == null ? void 0 : v.instructions,
      service_tier: v == null ? void 0 : v.serviceTier,
      include: I,
      prompt_cache_key: v == null ? void 0 : v.promptCacheKey,
      prompt_cache_retention: v == null ? void 0 : v.promptCacheRetention,
      safety_identifier: v == null ? void 0 : v.safetyIdentifier,
      top_logprobs: H,
      truncation: v == null ? void 0 : v.truncation,
      // model-specific settings:
      ...p.isReasoningModel && ((v == null ? void 0 : v.reasoningEffort) != null || (v == null ? void 0 : v.reasoningSummary) != null) && {
        reasoning: {
          ...(v == null ? void 0 : v.reasoningEffort) != null && {
            effort: v.reasoningEffort
          },
          ...(v == null ? void 0 : v.reasoningSummary) != null && {
            summary: v.reasoningSummary
          }
        }
      }
    };
    p.isReasoningModel ? (K.temperature != null && (K.temperature = void 0, h.push({
      type: "unsupported-setting",
      setting: "temperature",
      details: "temperature is not supported for reasoning models"
    })), K.top_p != null && (K.top_p = void 0, h.push({
      type: "unsupported-setting",
      setting: "topP",
      details: "topP is not supported for reasoning models"
    }))) : ((v == null ? void 0 : v.reasoningEffort) != null && h.push({
      type: "unsupported-setting",
      setting: "reasoningEffort",
      details: "reasoningEffort is not supported for non-reasoning models"
    }), (v == null ? void 0 : v.reasoningSummary) != null && h.push({
      type: "unsupported-setting",
      setting: "reasoningSummary",
      details: "reasoningSummary is not supported for non-reasoning models"
    })), (v == null ? void 0 : v.serviceTier) === "flex" && !p.supportsFlexProcessing && (h.push({
      type: "unsupported-setting",
      setting: "serviceTier",
      details: "flex processing is only available for o3, o4-mini, and gpt-5 models"
    }), delete K.service_tier), (v == null ? void 0 : v.serviceTier) === "priority" && !p.supportsPriorityProcessing && (h.push({
      type: "unsupported-setting",
      setting: "serviceTier",
      details: "priority processing is only available for supported models (gpt-4, gpt-5, gpt-5-mini, o3, o4-mini) and requires Enterprise access. gpt-5-nano is not supported"
    }), delete K.service_tier);
    const {
      tools: M,
      toolChoice: L,
      toolWarnings: F
    } = await sP({
      tools: l,
      toolChoice: y,
      strictJsonSchema: E
    });
    return {
      webSearchToolName: x,
      args: {
        ...K,
        tools: M,
        tool_choice: L
      },
      warnings: [...h, ...F],
      store: W
    };
  }
  async doGenerate(e) {
    var t, r, n, o, a, s, i, u, c, l, y, d, f, g, _, m, h, p, v;
    const {
      args: $,
      warnings: b,
      webSearchToolName: E
    } = await this.getArgs(e), I = this.config.url({
      path: "/responses",
      modelId: this.modelId
    }), {
      responseHeaders: O,
      value: q,
      rawValue: H
    } = await et({
      url: I,
      headers: Je(this.config.headers(), e.headers),
      body: $,
      failedResponseHandler: _t,
      successfulResponseHandler: ft(
        oP
      ),
      abortSignal: e.abortSignal,
      fetch: this.config.fetch
    });
    if (q.error)
      throw new Ae({
        message: q.error.message,
        url: I,
        requestBodyValues: $,
        statusCode: 400,
        responseHeaders: O,
        responseBody: H,
        isRetryable: !1
      });
    const x = [], W = [];
    let K = !1;
    for (const F of q.output)
      switch (F.type) {
        case "reasoning": {
          F.summary.length === 0 && F.summary.push({ type: "summary_text", text: "" });
          for (const G of F.summary)
            x.push({
              type: "reasoning",
              text: G.text,
              providerMetadata: {
                openai: {
                  itemId: F.id,
                  reasoningEncryptedContent: (t = F.encrypted_content) != null ? t : null
                }
              }
            });
          break;
        }
        case "image_generation_call": {
          x.push({
            type: "tool-call",
            toolCallId: F.id,
            toolName: "image_generation",
            input: "{}",
            providerExecuted: !0
          }), x.push({
            type: "tool-result",
            toolCallId: F.id,
            toolName: "image_generation",
            result: {
              result: F.result
            },
            providerExecuted: !0
          });
          break;
        }
        case "local_shell_call": {
          x.push({
            type: "tool-call",
            toolCallId: F.call_id,
            toolName: "local_shell",
            input: JSON.stringify({
              action: F.action
            }),
            providerMetadata: {
              openai: {
                itemId: F.id
              }
            }
          });
          break;
        }
        case "message": {
          for (const G of F.content) {
            (n = (r = e.providerOptions) == null ? void 0 : r.openai) != null && n.logprobs && G.logprobs && W.push(G.logprobs), x.push({
              type: "text",
              text: G.text,
              providerMetadata: {
                openai: {
                  itemId: F.id
                }
              }
            });
            for (const B of G.annotations)
              B.type === "url_citation" ? x.push({
                type: "source",
                sourceType: "url",
                id: (s = (a = (o = this.config).generateId) == null ? void 0 : a.call(o)) != null ? s : kt(),
                url: B.url,
                title: B.title
              }) : B.type === "file_citation" && x.push({
                type: "source",
                sourceType: "document",
                id: (c = (u = (i = this.config).generateId) == null ? void 0 : u.call(i)) != null ? c : kt(),
                mediaType: "text/plain",
                title: (y = (l = B.quote) != null ? l : B.filename) != null ? y : "Document",
                filename: (d = B.filename) != null ? d : B.file_id,
                ...B.file_id ? {
                  providerMetadata: {
                    openai: {
                      fileId: B.file_id
                    }
                  }
                } : {}
              });
          }
          break;
        }
        case "function_call": {
          K = !0, x.push({
            type: "tool-call",
            toolCallId: F.call_id,
            toolName: F.name,
            input: F.arguments,
            providerMetadata: {
              openai: {
                itemId: F.id
              }
            }
          });
          break;
        }
        case "web_search_call": {
          x.push({
            type: "tool-call",
            toolCallId: F.id,
            toolName: E ?? "web_search",
            input: JSON.stringify({}),
            providerExecuted: !0
          }), x.push({
            type: "tool-result",
            toolCallId: F.id,
            toolName: E ?? "web_search",
            result: fp(F.action),
            providerExecuted: !0
          });
          break;
        }
        case "computer_call": {
          x.push({
            type: "tool-call",
            toolCallId: F.id,
            toolName: "computer_use",
            input: "",
            providerExecuted: !0
          }), x.push({
            type: "tool-result",
            toolCallId: F.id,
            toolName: "computer_use",
            result: {
              type: "computer_use_tool_result",
              status: F.status || "completed"
            },
            providerExecuted: !0
          });
          break;
        }
        case "file_search_call": {
          x.push({
            type: "tool-call",
            toolCallId: F.id,
            toolName: "file_search",
            input: "{}",
            providerExecuted: !0
          }), x.push({
            type: "tool-result",
            toolCallId: F.id,
            toolName: "file_search",
            result: {
              queries: F.queries,
              results: (g = (f = F.results) == null ? void 0 : f.map((G) => ({
                attributes: G.attributes,
                fileId: G.file_id,
                filename: G.filename,
                score: G.score,
                text: G.text
              }))) != null ? g : null
            },
            providerExecuted: !0
          });
          break;
        }
        case "code_interpreter_call": {
          x.push({
            type: "tool-call",
            toolCallId: F.id,
            toolName: "code_interpreter",
            input: JSON.stringify({
              code: F.code,
              containerId: F.container_id
            }),
            providerExecuted: !0
          }), x.push({
            type: "tool-result",
            toolCallId: F.id,
            toolName: "code_interpreter",
            result: {
              outputs: F.outputs
            },
            providerExecuted: !0
          });
          break;
        }
      }
    const M = {
      openai: {
        ...q.id != null ? { responseId: q.id } : {}
      }
    };
    W.length > 0 && (M.openai.logprobs = W), typeof q.service_tier == "string" && (M.openai.serviceTier = q.service_tier);
    const L = q.usage;
    return {
      content: x,
      finishReason: cp({
        finishReason: (_ = q.incomplete_details) == null ? void 0 : _.reason,
        hasFunctionCall: K
      }),
      usage: {
        inputTokens: L.input_tokens,
        outputTokens: L.output_tokens,
        totalTokens: L.input_tokens + L.output_tokens,
        reasoningTokens: (h = (m = L.output_tokens_details) == null ? void 0 : m.reasoning_tokens) != null ? h : void 0,
        cachedInputTokens: (v = (p = L.input_tokens_details) == null ? void 0 : p.cached_tokens) != null ? v : void 0
      },
      request: { body: $ },
      response: {
        id: q.id,
        timestamp: new Date(q.created_at * 1e3),
        modelId: q.model,
        headers: O,
        body: H
      },
      providerMetadata: M,
      warnings: b
    };
  }
  async doStream(e) {
    const {
      args: t,
      warnings: r,
      webSearchToolName: n,
      store: o
    } = await this.getArgs(e), { responseHeaders: a, value: s } = await et({
      url: this.config.url({
        path: "/responses",
        modelId: this.modelId
      }),
      headers: Je(this.config.headers(), e.headers),
      body: {
        ...t,
        stream: !0
      },
      failedResponseHandler: _t,
      successfulResponseHandler: wa(
        nP
      ),
      abortSignal: e.abortSignal,
      fetch: this.config.fetch
    }), i = this;
    let u = "unknown";
    const c = {
      inputTokens: void 0,
      outputTokens: void 0,
      totalTokens: void 0
    }, l = [];
    let y = null;
    const d = {}, f = [];
    let g = !1;
    const _ = {};
    let m;
    return {
      stream: s.pipeThrough(
        new TransformStream({
          start(h) {
            h.enqueue({ type: "stream-start", warnings: r });
          },
          transform(h, p) {
            var v, $, b, E, I, O, q, H, x, W, K, M, L, F, G, B, Q, D, P, C, k, S;
            if (e.includeRawChunks && p.enqueue({ type: "raw", rawValue: h.rawValue }), !h.success) {
              u = "error", p.enqueue({ type: "error", error: h.error });
              return;
            }
            const w = h.value;
            if (dp(w))
              w.item.type === "function_call" ? (d[w.output_index] = {
                toolName: w.item.name,
                toolCallId: w.item.call_id
              }, p.enqueue({
                type: "tool-input-start",
                id: w.item.call_id,
                toolName: w.item.name
              })) : w.item.type === "web_search_call" ? (d[w.output_index] = {
                toolName: n ?? "web_search",
                toolCallId: w.item.id
              }, p.enqueue({
                type: "tool-input-start",
                id: w.item.id,
                toolName: n ?? "web_search",
                providerExecuted: !0
              }), p.enqueue({
                type: "tool-input-end",
                id: w.item.id
              }), p.enqueue({
                type: "tool-call",
                toolCallId: w.item.id,
                toolName: n ?? "web_search",
                input: JSON.stringify({}),
                providerExecuted: !0
              })) : w.item.type === "computer_call" ? (d[w.output_index] = {
                toolName: "computer_use",
                toolCallId: w.item.id
              }, p.enqueue({
                type: "tool-input-start",
                id: w.item.id,
                toolName: "computer_use",
                providerExecuted: !0
              })) : w.item.type === "code_interpreter_call" ? (d[w.output_index] = {
                toolName: "code_interpreter",
                toolCallId: w.item.id,
                codeInterpreter: {
                  containerId: w.item.container_id
                }
              }, p.enqueue({
                type: "tool-input-start",
                id: w.item.id,
                toolName: "code_interpreter",
                providerExecuted: !0
              }), p.enqueue({
                type: "tool-input-delta",
                id: w.item.id,
                delta: `{"containerId":"${w.item.container_id}","code":"`
              })) : w.item.type === "file_search_call" ? p.enqueue({
                type: "tool-call",
                toolCallId: w.item.id,
                toolName: "file_search",
                input: "{}",
                providerExecuted: !0
              }) : w.item.type === "image_generation_call" ? p.enqueue({
                type: "tool-call",
                toolCallId: w.item.id,
                toolName: "image_generation",
                input: "{}",
                providerExecuted: !0
              }) : w.item.type === "message" ? (f.splice(0, f.length), p.enqueue({
                type: "text-start",
                id: w.item.id,
                providerMetadata: {
                  openai: {
                    itemId: w.item.id
                  }
                }
              })) : dp(w) && w.item.type === "reasoning" && (_[w.item.id] = {
                encryptedContent: w.item.encrypted_content,
                summaryParts: { 0: "active" }
              }, p.enqueue({
                type: "reasoning-start",
                id: `${w.item.id}:0`,
                providerMetadata: {
                  openai: {
                    itemId: w.item.id,
                    reasoningEncryptedContent: (v = w.item.encrypted_content) != null ? v : null
                  }
                }
              }));
            else if (lp(w) && w.item.type !== "message") {
              if (w.item.type === "function_call")
                d[w.output_index] = void 0, g = !0, p.enqueue({
                  type: "tool-input-end",
                  id: w.item.call_id
                }), p.enqueue({
                  type: "tool-call",
                  toolCallId: w.item.call_id,
                  toolName: w.item.name,
                  input: w.item.arguments,
                  providerMetadata: {
                    openai: {
                      itemId: w.item.id
                    }
                  }
                });
              else if (w.item.type === "web_search_call")
                d[w.output_index] = void 0, p.enqueue({
                  type: "tool-result",
                  toolCallId: w.item.id,
                  toolName: n ?? "web_search",
                  result: fp(w.item.action),
                  providerExecuted: !0
                });
              else if (w.item.type === "computer_call")
                d[w.output_index] = void 0, p.enqueue({
                  type: "tool-input-end",
                  id: w.item.id
                }), p.enqueue({
                  type: "tool-call",
                  toolCallId: w.item.id,
                  toolName: "computer_use",
                  input: "",
                  providerExecuted: !0
                }), p.enqueue({
                  type: "tool-result",
                  toolCallId: w.item.id,
                  toolName: "computer_use",
                  result: {
                    type: "computer_use_tool_result",
                    status: w.item.status || "completed"
                  },
                  providerExecuted: !0
                });
              else if (w.item.type === "file_search_call")
                d[w.output_index] = void 0, p.enqueue({
                  type: "tool-result",
                  toolCallId: w.item.id,
                  toolName: "file_search",
                  result: {
                    queries: w.item.queries,
                    results: (b = ($ = w.item.results) == null ? void 0 : $.map((A) => ({
                      attributes: A.attributes,
                      fileId: A.file_id,
                      filename: A.filename,
                      score: A.score,
                      text: A.text
                    }))) != null ? b : null
                  },
                  providerExecuted: !0
                });
              else if (w.item.type === "code_interpreter_call")
                d[w.output_index] = void 0, p.enqueue({
                  type: "tool-result",
                  toolCallId: w.item.id,
                  toolName: "code_interpreter",
                  result: {
                    outputs: w.item.outputs
                  },
                  providerExecuted: !0
                });
              else if (w.item.type === "image_generation_call")
                p.enqueue({
                  type: "tool-result",
                  toolCallId: w.item.id,
                  toolName: "image_generation",
                  result: {
                    result: w.item.result
                  },
                  providerExecuted: !0
                });
              else if (w.item.type === "local_shell_call")
                d[w.output_index] = void 0, p.enqueue({
                  type: "tool-call",
                  toolCallId: w.item.call_id,
                  toolName: "local_shell",
                  input: JSON.stringify({
                    action: {
                      type: "exec",
                      command: w.item.action.command,
                      timeoutMs: w.item.action.timeout_ms,
                      user: w.item.action.user,
                      workingDirectory: w.item.action.working_directory,
                      env: w.item.action.env
                    }
                  }),
                  providerMetadata: {
                    openai: { itemId: w.item.id }
                  }
                });
              else if (w.item.type === "reasoning") {
                const A = _[w.item.id], Y = Object.entries(
                  A.summaryParts
                ).filter(
                  ([X, le]) => le === "active" || le === "can-conclude"
                ).map(([X]) => X);
                for (const X of Y)
                  p.enqueue({
                    type: "reasoning-end",
                    id: `${w.item.id}:${X}`,
                    providerMetadata: {
                      openai: {
                        itemId: w.item.id,
                        reasoningEncryptedContent: (E = w.item.encrypted_content) != null ? E : null
                      }
                    }
                  });
                delete _[w.item.id];
              }
            } else if (dP(w)) {
              const A = d[w.output_index];
              A != null && p.enqueue({
                type: "tool-input-delta",
                id: A.toolCallId,
                delta: w.delta
              });
            } else if (fP(w)) {
              const A = d[w.output_index];
              A != null && p.enqueue({
                type: "tool-input-delta",
                id: A.toolCallId,
                // The delta is code, which is embedding in a JSON string.
                // To escape it, we use JSON.stringify and slice to remove the outer quotes.
                delta: JSON.stringify(w.delta).slice(1, -1)
              });
            } else if (pP(w)) {
              const A = d[w.output_index];
              A != null && (p.enqueue({
                type: "tool-input-delta",
                id: A.toolCallId,
                delta: '"}'
              }), p.enqueue({
                type: "tool-input-end",
                id: A.toolCallId
              }), p.enqueue({
                type: "tool-call",
                toolCallId: A.toolCallId,
                toolName: "code_interpreter",
                input: JSON.stringify({
                  code: w.code,
                  containerId: A.codeInterpreter.containerId
                }),
                providerExecuted: !0
              }));
            } else if (lP(w))
              y = w.response.id, p.enqueue({
                type: "response-metadata",
                id: w.response.id,
                timestamp: new Date(w.response.created_at * 1e3),
                modelId: w.response.model
              });
            else if (uP(w))
              p.enqueue({
                type: "text-delta",
                id: w.item_id,
                delta: w.delta
              }), (O = (I = e.providerOptions) == null ? void 0 : I.openai) != null && O.logprobs && w.logprobs && l.push(w.logprobs);
            else if (w.type === "response.reasoning_summary_part.added") {
              if (w.summary_index > 0) {
                const A = _[w.item_id];
                A.summaryParts[w.summary_index] = "active";
                for (const Y of Object.keys(
                  A.summaryParts
                ))
                  A.summaryParts[Y] === "can-conclude" && (p.enqueue({
                    type: "reasoning-end",
                    id: `${w.item_id}:${Y}`,
                    providerMetadata: { openai: { itemId: w.item_id } }
                  }), A.summaryParts[Y] = "concluded");
                p.enqueue({
                  type: "reasoning-start",
                  id: `${w.item_id}:${w.summary_index}`,
                  providerMetadata: {
                    openai: {
                      itemId: w.item_id,
                      reasoningEncryptedContent: (H = (q = _[w.item_id]) == null ? void 0 : q.encryptedContent) != null ? H : null
                    }
                  }
                });
              }
            } else w.type === "response.reasoning_summary_text.delta" ? p.enqueue({
              type: "reasoning-delta",
              id: `${w.item_id}:${w.summary_index}`,
              delta: w.delta,
              providerMetadata: {
                openai: {
                  itemId: w.item_id
                }
              }
            }) : w.type === "response.reasoning_summary_part.done" ? o ? (p.enqueue({
              type: "reasoning-end",
              id: `${w.item_id}:${w.summary_index}`,
              providerMetadata: {
                openai: { itemId: w.item_id }
              }
            }), _[w.item_id].summaryParts[w.summary_index] = "concluded") : _[w.item_id].summaryParts[w.summary_index] = "can-conclude" : cP(w) ? (u = cp({
              finishReason: (x = w.response.incomplete_details) == null ? void 0 : x.reason,
              hasFunctionCall: g
            }), c.inputTokens = w.response.usage.input_tokens, c.outputTokens = w.response.usage.output_tokens, c.totalTokens = w.response.usage.input_tokens + w.response.usage.output_tokens, c.reasoningTokens = (K = (W = w.response.usage.output_tokens_details) == null ? void 0 : W.reasoning_tokens) != null ? K : void 0, c.cachedInputTokens = (L = (M = w.response.usage.input_tokens_details) == null ? void 0 : M.cached_tokens) != null ? L : void 0, typeof w.response.service_tier == "string" && (m = w.response.service_tier)) : hP(w) ? (f.push(w.annotation), w.annotation.type === "url_citation" ? p.enqueue({
              type: "source",
              sourceType: "url",
              id: (B = (G = (F = i.config).generateId) == null ? void 0 : G.call(F)) != null ? B : kt(),
              url: w.annotation.url,
              title: w.annotation.title
            }) : w.annotation.type === "file_citation" && p.enqueue({
              type: "source",
              sourceType: "document",
              id: (P = (D = (Q = i.config).generateId) == null ? void 0 : D.call(Q)) != null ? P : kt(),
              mediaType: "text/plain",
              title: (k = (C = w.annotation.quote) != null ? C : w.annotation.filename) != null ? k : "Document",
              filename: (S = w.annotation.filename) != null ? S : w.annotation.file_id,
              ...w.annotation.file_id ? {
                providerMetadata: {
                  openai: {
                    fileId: w.annotation.file_id
                  }
                }
              } : {}
            })) : lp(w) && w.item.type === "message" ? p.enqueue({
              type: "text-end",
              id: w.item.id,
              providerMetadata: {
                openai: {
                  itemId: w.item.id,
                  ...f.length > 0 && {
                    annotations: f
                  }
                }
              }
            }) : mP(w) && p.enqueue({ type: "error", error: w });
          },
          flush(h) {
            const p = {
              openai: {
                responseId: y
              }
            };
            l.length > 0 && (p.openai.logprobs = l), m !== void 0 && (p.openai.serviceTier = m), h.enqueue({
              type: "finish",
              finishReason: u,
              usage: c,
              providerMetadata: p
            });
          }
        })
      ),
      request: { body: t },
      response: { headers: a }
    };
  }
};
function uP(e) {
  return e.type === "response.output_text.delta";
}
function lp(e) {
  return e.type === "response.output_item.done";
}
function cP(e) {
  return e.type === "response.completed" || e.type === "response.incomplete";
}
function lP(e) {
  return e.type === "response.created";
}
function dP(e) {
  return e.type === "response.function_call_arguments.delta";
}
function fP(e) {
  return e.type === "response.code_interpreter_call_code.delta";
}
function pP(e) {
  return e.type === "response.code_interpreter_call_code.done";
}
function dp(e) {
  return e.type === "response.output_item.added";
}
function hP(e) {
  return e.type === "response.output_text.annotation.added";
}
function mP(e) {
  return e.type === "error";
}
function gP(e) {
  const t = e.startsWith("o3") || e.startsWith("o4-mini") || e.startsWith("gpt-5") && !e.startsWith("gpt-5-chat"), r = e.startsWith("gpt-4") || e.startsWith("gpt-5-mini") || e.startsWith("gpt-5") && !e.startsWith("gpt-5-nano") && !e.startsWith("gpt-5-chat") || e.startsWith("o3") || e.startsWith("o4-mini"), n = {
    systemMessageMode: "system",
    supportsFlexProcessing: t,
    supportsPriorityProcessing: r
  };
  return e.startsWith("gpt-5-chat") ? {
    ...n,
    isReasoningModel: !1
  } : e.startsWith("o") || e.startsWith("gpt-5") || e.startsWith("codex-") || e.startsWith("computer-use") ? {
    ...n,
    isReasoningModel: !0,
    systemMessageMode: "developer"
  } : {
    ...n,
    isReasoningModel: !1
  };
}
function fp(e) {
  var t;
  switch (e.type) {
    case "search":
      return {
        action: { type: "search", query: (t = e.query) != null ? t : void 0 },
        // include sources when provided by the Responses API (behind include flag)
        ...e.sources != null && { sources: e.sources }
      };
    case "open_page":
      return { action: { type: "openPage", url: e.url } };
    case "find":
      return {
        action: { type: "find", url: e.url, pattern: e.pattern }
      };
  }
}
var yP = Oe(
  () => de(
    R({
      instructions: T().nullish(),
      speed: V().min(0.25).max(4).default(1).nullish()
    })
  )
), vP = class {
  constructor(e, t) {
    this.modelId = e, this.config = t, this.specificationVersion = "v2";
  }
  get provider() {
    return this.config.provider;
  }
  async getArgs({
    text: e,
    voice: t = "alloy",
    outputFormat: r = "mp3",
    speed: n,
    instructions: o,
    language: a,
    providerOptions: s
  }) {
    const i = [], u = await Bt({
      provider: "openai",
      providerOptions: s,
      schema: yP
    }), c = {
      model: this.modelId,
      input: e,
      voice: t,
      response_format: "mp3",
      speed: n,
      instructions: o
    };
    if (r && (["mp3", "opus", "aac", "flac", "wav", "pcm"].includes(r) ? c.response_format = r : i.push({
      type: "unsupported-setting",
      setting: "outputFormat",
      details: `Unsupported output format: ${r}. Using mp3 instead.`
    })), u) {
      const l = {};
      for (const y in l) {
        const d = l[y];
        d !== void 0 && (c[y] = d);
      }
    }
    return a && i.push({
      type: "unsupported-setting",
      setting: "language",
      details: `OpenAI speech models do not support language selection. Language parameter "${a}" was ignored.`
    }), {
      requestBody: c,
      warnings: i
    };
  }
  async doGenerate(e) {
    var t, r, n;
    const o = (n = (r = (t = this.config._internal) == null ? void 0 : t.currentDate) == null ? void 0 : r.call(t)) != null ? n : /* @__PURE__ */ new Date(), { requestBody: a, warnings: s } = await this.getArgs(e), {
      value: i,
      responseHeaders: u,
      rawValue: c
    } = await et({
      url: this.config.url({
        path: "/audio/speech",
        modelId: this.modelId
      }),
      headers: Je(this.config.headers(), e.headers),
      body: a,
      failedResponseHandler: _t,
      successfulResponseHandler: US(),
      abortSignal: e.abortSignal,
      fetch: this.config.fetch
    });
    return {
      audio: i,
      warnings: s,
      request: {
        body: JSON.stringify(a)
      },
      response: {
        timestamp: o,
        modelId: this.modelId,
        headers: u,
        body: c
      }
    };
  }
}, _P = Oe(
  () => de(
    R({
      text: T(),
      language: T().nullish(),
      duration: V().nullish(),
      words: ee(
        R({
          word: T(),
          start: V(),
          end: V()
        })
      ).nullish(),
      segments: ee(
        R({
          id: V(),
          seek: V(),
          start: V(),
          end: V(),
          text: T(),
          tokens: ee(V()),
          temperature: V(),
          avg_logprob: V(),
          compression_ratio: V(),
          no_speech_prob: V()
        })
      ).nullish()
    })
  )
), bP = Oe(
  () => de(
    R({
      /**
       * Additional information to include in the transcription response.
       */
      include: ee(T()).optional(),
      /**
       * The language of the input audio in ISO-639-1 format.
       */
      language: T().optional(),
      /**
       * An optional text to guide the model's style or continue a previous audio segment.
       */
      prompt: T().optional(),
      /**
       * The sampling temperature, between 0 and 1.
       * @default 0
       */
      temperature: V().min(0).max(1).default(0).optional(),
      /**
       * The timestamp granularities to populate for this transcription.
       * @default ['segment']
       */
      timestampGranularities: ee(Ee(["word", "segment"])).default(["segment"]).optional()
    })
  )
), pp = {
  afrikaans: "af",
  arabic: "ar",
  armenian: "hy",
  azerbaijani: "az",
  belarusian: "be",
  bosnian: "bs",
  bulgarian: "bg",
  catalan: "ca",
  chinese: "zh",
  croatian: "hr",
  czech: "cs",
  danish: "da",
  dutch: "nl",
  english: "en",
  estonian: "et",
  finnish: "fi",
  french: "fr",
  galician: "gl",
  german: "de",
  greek: "el",
  hebrew: "he",
  hindi: "hi",
  hungarian: "hu",
  icelandic: "is",
  indonesian: "id",
  italian: "it",
  japanese: "ja",
  kannada: "kn",
  kazakh: "kk",
  korean: "ko",
  latvian: "lv",
  lithuanian: "lt",
  macedonian: "mk",
  malay: "ms",
  marathi: "mr",
  maori: "mi",
  nepali: "ne",
  norwegian: "no",
  persian: "fa",
  polish: "pl",
  portuguese: "pt",
  romanian: "ro",
  russian: "ru",
  serbian: "sr",
  slovak: "sk",
  slovenian: "sl",
  spanish: "es",
  swahili: "sw",
  swedish: "sv",
  tagalog: "tl",
  tamil: "ta",
  thai: "th",
  turkish: "tr",
  ukrainian: "uk",
  urdu: "ur",
  vietnamese: "vi",
  welsh: "cy"
}, wP = class {
  constructor(e, t) {
    this.modelId = e, this.config = t, this.specificationVersion = "v2";
  }
  get provider() {
    return this.config.provider;
  }
  async getArgs({
    audio: e,
    mediaType: t,
    providerOptions: r
  }) {
    const n = [], o = await Bt({
      provider: "openai",
      providerOptions: r,
      schema: bP
    }), a = new FormData(), s = e instanceof Uint8Array ? new Blob([e]) : new Blob([$a(e)]);
    a.append("model", this.modelId);
    const i = kS(t);
    if (a.append(
      "file",
      new File([s], "audio", { type: t }),
      `audio.${i}`
    ), o) {
      const u = {
        include: o.include,
        language: o.language,
        prompt: o.prompt,
        // https://platform.openai.com/docs/api-reference/audio/createTranscription#audio_createtranscription-response_format
        // prefer verbose_json to get segments for models that support it
        response_format: [
          "gpt-4o-transcribe",
          "gpt-4o-mini-transcribe"
        ].includes(this.modelId) ? "json" : "verbose_json",
        temperature: o.temperature,
        timestamp_granularities: o.timestampGranularities
      };
      for (const [c, l] of Object.entries(u))
        if (l != null)
          if (Array.isArray(l))
            for (const y of l)
              a.append(`${c}[]`, String(y));
          else
            a.append(c, String(l));
    }
    return {
      formData: a,
      warnings: n
    };
  }
  async doGenerate(e) {
    var t, r, n, o, a, s, i, u;
    const c = (n = (r = (t = this.config._internal) == null ? void 0 : t.currentDate) == null ? void 0 : r.call(t)) != null ? n : /* @__PURE__ */ new Date(), { formData: l, warnings: y } = await this.getArgs(e), {
      value: d,
      responseHeaders: f,
      rawValue: g
    } = await VS({
      url: this.config.url({
        path: "/audio/transcriptions",
        modelId: this.modelId
      }),
      headers: Je(this.config.headers(), e.headers),
      formData: l,
      failedResponseHandler: _t,
      successfulResponseHandler: ft(
        _P
      ),
      abortSignal: e.abortSignal,
      fetch: this.config.fetch
    }), _ = d.language != null && d.language in pp ? pp[d.language] : void 0;
    return {
      text: d.text,
      segments: (i = (s = (o = d.segments) == null ? void 0 : o.map((m) => ({
        text: m.text,
        startSecond: m.start,
        endSecond: m.end
      }))) != null ? s : (a = d.words) == null ? void 0 : a.map((m) => ({
        text: m.word,
        startSecond: m.start,
        endSecond: m.end
      }))) != null ? i : [],
      language: _,
      durationInSeconds: (u = d.duration) != null ? u : void 0,
      warnings: y,
      response: {
        timestamp: c,
        modelId: this.modelId,
        headers: f,
        body: g
      }
    };
  }
}, EP = "2.0.71";
function $P(e = {}) {
  var t, r;
  const n = (t = cm(
    In({
      settingValue: e.baseURL,
      environmentVariableName: "OPENAI_BASE_URL"
    })
  )) != null ? t : "https://api.openai.com/v1", o = (r = e.name) != null ? r : "openai", a = () => xr(
    {
      Authorization: `Bearer ${PS({
        apiKey: e.apiKey,
        environmentVariableName: "OPENAI_API_KEY",
        description: "OpenAI"
      })}`,
      "OpenAI-Organization": e.organization,
      "OpenAI-Project": e.project,
      ...e.headers
    },
    `ai-sdk/openai/${EP}`
  ), s = (_) => new mR(_, {
    provider: `${o}.chat`,
    url: ({ path: m }) => `${n}${m}`,
    headers: a,
    fetch: e.fetch
  }), i = (_) => new $R(_, {
    provider: `${o}.completion`,
    url: ({ path: m }) => `${n}${m}`,
    headers: a,
    fetch: e.fetch
  }), u = (_) => new TR(_, {
    provider: `${o}.embedding`,
    url: ({ path: m }) => `${n}${m}`,
    headers: a,
    fetch: e.fetch
  }), c = (_) => new kR(_, {
    provider: `${o}.image`,
    url: ({ path: m }) => `${n}${m}`,
    headers: a,
    fetch: e.fetch
  }), l = (_) => new wP(_, {
    provider: `${o}.transcription`,
    url: ({ path: m }) => `${n}${m}`,
    headers: a,
    fetch: e.fetch
  }), y = (_) => new vP(_, {
    provider: `${o}.speech`,
    url: ({ path: m }) => `${n}${m}`,
    headers: a,
    fetch: e.fetch
  }), d = (_) => {
    if (new.target)
      throw new Error(
        "The OpenAI model function cannot be called with the new keyword."
      );
    return f(_);
  }, f = (_) => new iP(_, {
    provider: `${o}.responses`,
    url: ({ path: m }) => `${n}${m}`,
    headers: a,
    fetch: e.fetch,
    fileIdPrefixes: ["file-"]
  }), g = function(_) {
    return d(_);
  };
  return g.languageModel = d, g.chat = s, g.completion = i, g.responses = f, g.embedding = u, g.textEmbedding = u, g.textEmbeddingModel = u, g.image = c, g.imageModel = c, g.transcription = l, g.transcriptionModel = l, g.speech = y, g.speechModel = y, g.tools = eP, g;
}
var SP = $P();
const sa = new w0();
let zt = null;
const hp = process.env.VITE_DEV_SERVER_URL;
let Ho = null;
async function Wo() {
  if (Ho) return Ho;
  sa.get("settings.openaiApiKey") || process.env.OPENAI_API_KEY || console.warn("No OpenAI API key found");
  const t = new cR({
    model: SP("gpt-4o"),
    allowedPaths: [dt.getPath("home"), dt.getPath("documents"), dt.getPath("downloads")],
    allowedCommands: ["ls", "echo", "grep", "cat", "git", "npm"]
  });
  return Ho = {
    sendMessage: async (r) => {
      try {
        console.log("User message:", r);
        const n = await t.think(r);
        if (console.log("Agent thought:", n), n.includes("FINAL ANSWER:")) {
          const a = n.split("FINAL ANSWER:")[1];
          return a ? a.trim() : n;
        }
        await t.act(n);
        const o = await t.observe();
        return `Executed: ${n}
Result: ${o}`;
      } catch (n) {
        return console.error("AI Error:", n), `Error: ${n.message}`;
      }
    },
    ingestDocument: async (r) => {
      console.log("Ingesting document:", r.id);
    },
    queryMemory: async (r) => [],
    getStats: async () => ({ vectorDocuments: 0, shortTermMemory: 0 })
  }, Ho;
}
function mp() {
  zt = new yp({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: ir.join(__dirname, "preload.js"),
      nodeIntegration: !1,
      contextIsolation: !0
    }
  }), hp ? (zt.loadURL(hp), zt.webContents.openDevTools()) : zt.loadFile(ir.join(__dirname, "../dist/index.html")), zt.on("closed", () => {
    zt = null;
  });
}
function IP() {
  process.defaultApp ? process.argv.length >= 2 && dt.setAsDefaultProtocolClient("operone", process.execPath, [ir.resolve(process.argv[1])]) : dt.setAsDefaultProtocolClient("operone");
}
function _g(e) {
  if (!e.startsWith("operone://")) return;
  const t = new URL(e);
  if (t.pathname === "auth" || t.host === "auth") {
    const r = t.searchParams.get("token");
    r && zt && (sa.set("authToken", r), zt.webContents.send("auth-success", { token: r }));
  }
}
function TP() {
  gr.handle("ai:sendMessage", async (e, t) => await (await Wo()).sendMessage(t)), gr.handle("ai:ingestDocument", async (e, t) => await (await Wo()).ingestDocument(t)), gr.handle("ai:queryMemory", async (e, t) => await (await Wo()).queryMemory(t)), gr.handle("ai:getStats", async () => await (await Wo()).getStats()), gr.handle("settings:get", async () => sa.get("settings", {})), gr.handle("settings:update", async (e, t) => (sa.set("settings", t), !0));
}
dt.whenReady().then(() => {
  IP(), TP(), mp(), dt.on("activate", () => {
    yp.getAllWindows().length === 0 && mp();
  });
});
dt.on("window-all-closed", () => {
  process.platform !== "darwin" && dt.quit();
});
dt.on("open-url", (e, t) => {
  e.preventDefault(), _g(t);
});
if (process.platform === "win32" || process.platform === "linux") {
  const e = process.argv.find((t) => t.startsWith("operone://"));
  e && _g(e);
}
dt.on("web-contents-created", (e, t) => {
  t.setWindowOpenHandler(({ url: r }) => r.startsWith("http://") || r.startsWith("https://") ? (Eg.openExternal(r), { action: "deny" }) : { action: "allow" });
});
export {
  Ep as g,
  qI as r
};
