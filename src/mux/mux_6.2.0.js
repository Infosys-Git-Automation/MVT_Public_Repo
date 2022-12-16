/*! @name mux.js @version 6.2.0 @license Apache-2.0 */
!(function (t, e) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = e(require("global/window")))
    : "function" == typeof define && define.amd
    ? define(["global/window"], e)
    : ((t = "undefined" != typeof globalThis ? globalThis : t || self).muxjs = e(t.window));
})(this, function (t) {
  "use strict";
  function e(t) {
    return t && "object" == typeof t && "default" in t ? t : { default: t };
  }
  var i = e(t),
    n = function () {
      this.init = function () {
        var t = {};
        (this.on = function (e, i) {
          t[e] || (t[e] = []), (t[e] = t[e].concat(i));
        }),
          (this.off = function (e, i) {
            var n;
            return !!t[e] && ((n = t[e].indexOf(i)), (t[e] = t[e].slice()), t[e].splice(n, 1), n > -1);
          }),
          (this.trigger = function (e) {
            var i, n, a, r;
            if ((i = t[e]))
              if (2 === arguments.length) for (a = i.length, n = 0; n < a; ++n) i[n].call(this, arguments[1]);
              else {
                for (r = [], n = arguments.length, n = 1; n < arguments.length; ++n) r.push(arguments[n]);
                for (a = i.length, n = 0; n < a; ++n) i[n].apply(this, r);
              }
          }),
          (this.dispose = function () {
            t = {};
          });
      };
    };
  (n.prototype.pipe = function (t) {
    return (
      this.on("data", function (e) {
        t.push(e);
      }),
      this.on("done", function (e) {
        t.flush(e);
      }),
      this.on("partialdone", function (e) {
        t.partialFlush(e);
      }),
      this.on("endedtimeline", function (e) {
        t.endTimeline(e);
      }),
      this.on("reset", function (e) {
        t.reset(e);
      }),
      t
    );
  }),
    (n.prototype.push = function (t) {
      this.trigger("data", t);
    }),
    (n.prototype.flush = function (t) {
      this.trigger("done", t);
    }),
    (n.prototype.partialFlush = function (t) {
      this.trigger("partialdone", t);
    }),
    (n.prototype.endTimeline = function (t) {
      this.trigger("endedtimeline", t);
    }),
    (n.prototype.reset = function (t) {
      this.trigger("reset", t);
    });
  var a,
    r,
    s,
    o,
    d,
    h,
    p,
    u = n,
    l = 9e4;
  (d = function (t, e) {
    return a(o(t, e));
  }),
    (h = function (t, e) {
      return r(s(t), e);
    }),
    (p = function (t, e, i) {
      return s(i ? t : t - e);
    });
  var c,
    f = l,
    g =
      ((a = function (t) {
        return t * l;
      }),
      (r = function (t, e) {
        return t * e;
      }),
      (s = function (t) {
        return t / l;
      })),
    m =
      ((o = function (t, e) {
        return t / e;
      }),
      d),
    y = h,
    b = p,
    v = f,
    S = [96e3, 88200, 64e3, 48e3, 44100, 32e3, 24e3, 22050, 16e3, 12e3, 11025, 8e3, 7350];
  (c = function (t) {
    var e,
      i = 0;
    c.prototype.init.call(this),
      (this.skipWarn_ = function (t, e) {
        this.trigger("log", {
          level: "warn",
          message: "adts skiping bytes " + t + " to " + e + " in frame " + i + " outside syncword",
        });
      }),
      (this.push = function (n) {
        var a,
          r,
          s,
          o,
          d,
          h = 0;
        if ((t || (i = 0), "audio" === n.type)) {
          var p;
          for (
            e && e.length
              ? ((s = e), (e = new Uint8Array(s.byteLength + n.data.byteLength)).set(s), e.set(n.data, s.byteLength))
              : (e = n.data);
            h + 7 < e.length;

          )
            if (255 === e[h] && 240 == (246 & e[h + 1])) {
              if (
                ("number" == typeof p && (this.skipWarn_(p, h), (p = null)),
                (r = 2 * (1 & ~e[h + 1])),
                (a = ((3 & e[h + 3]) << 11) | (e[h + 4] << 3) | ((224 & e[h + 5]) >> 5)),
                (d = ((o = 1024 * (1 + (3 & e[h + 6]))) * v) / S[(60 & e[h + 2]) >>> 2]),
                e.byteLength - h < a)
              )
                break;
              this.trigger("data", {
                pts: n.pts + i * d,
                dts: n.dts + i * d,
                sampleCount: o,
                audioobjecttype: 1 + ((e[h + 2] >>> 6) & 3),
                channelcount: ((1 & e[h + 2]) << 2) | ((192 & e[h + 3]) >>> 6),
                samplerate: S[(60 & e[h + 2]) >>> 2],
                samplingfrequencyindex: (60 & e[h + 2]) >>> 2,
                samplesize: 16,
                data: e.subarray(h + 7 + r, h + a),
              }),
                i++,
                (h += a);
            } else "number" != typeof p && (p = h), h++;
          "number" == typeof p && (this.skipWarn_(p, h), (p = null)), (e = e.subarray(h));
        }
      }),
      (this.flush = function () {
        (i = 0), this.trigger("done");
      }),
      (this.reset = function () {
        (e = void 0), this.trigger("reset");
      }),
      (this.endTimeline = function () {
        (e = void 0), this.trigger("endedtimeline");
      });
  }).prototype = new u();
  var T,
    w,
    _,
    k = c,
    U = function (t) {
      var e = t.byteLength,
        i = 0,
        n = 0;
      (this.length = function () {
        return 8 * e;
      }),
        (this.bitsAvailable = function () {
          return 8 * e + n;
        }),
        (this.loadWord = function () {
          var a = t.byteLength - e,
            r = new Uint8Array(4),
            s = Math.min(4, e);
          if (0 === s) throw new Error("no bytes available");
          r.set(t.subarray(a, a + s)), (i = new DataView(r.buffer).getUint32(0)), (n = 8 * s), (e -= s);
        }),
        (this.skipBits = function (t) {
          var a;
          n > t
            ? ((i <<= t), (n -= t))
            : ((t -= n), (t -= 8 * (a = Math.floor(t / 8))), (e -= a), this.loadWord(), (i <<= t), (n -= t));
        }),
        (this.readBits = function (t) {
          var a = Math.min(n, t),
            r = i >>> (32 - a);
          return (n -= a) > 0 ? (i <<= a) : e > 0 && this.loadWord(), (a = t - a) > 0 ? (r << a) | this.readBits(a) : r;
        }),
        (this.skipLeadingZeros = function () {
          var t;
          for (t = 0; t < n; ++t) if (0 != (i & (2147483648 >>> t))) return (i <<= t), (n -= t), t;
          return this.loadWord(), t + this.skipLeadingZeros();
        }),
        (this.skipUnsignedExpGolomb = function () {
          this.skipBits(1 + this.skipLeadingZeros());
        }),
        (this.skipExpGolomb = function () {
          this.skipBits(1 + this.skipLeadingZeros());
        }),
        (this.readUnsignedExpGolomb = function () {
          var t = this.skipLeadingZeros();
          return this.readBits(t + 1) - 1;
        }),
        (this.readExpGolomb = function () {
          var t = this.readUnsignedExpGolomb();
          return 1 & t ? (1 + t) >>> 1 : -1 * (t >>> 1);
        }),
        (this.readBoolean = function () {
          return 1 === this.readBits(1);
        }),
        (this.readUnsignedByte = function () {
          return this.readBits(8);
        }),
        this.loadWord();
    };
  ((w = function () {
    var t,
      e,
      i = 0;
    w.prototype.init.call(this),
      (this.push = function (n) {
        var a;
        e
          ? ((a = new Uint8Array(e.byteLength + n.data.byteLength)).set(e), a.set(n.data, e.byteLength), (e = a))
          : (e = n.data);
        for (var r = e.byteLength; i < r - 3; i++)
          if (1 === e[i + 2]) {
            t = i + 5;
            break;
          }
        for (; t < r; )
          switch (e[t]) {
            case 0:
              if (0 !== e[t - 1]) {
                t += 2;
                break;
              }
              if (0 !== e[t - 2]) {
                t++;
                break;
              }
              i + 3 !== t - 2 && this.trigger("data", e.subarray(i + 3, t - 2));
              do {
                t++;
              } while (1 !== e[t] && t < r);
              (i = t - 2), (t += 3);
              break;
            case 1:
              if (0 !== e[t - 1] || 0 !== e[t - 2]) {
                t += 3;
                break;
              }
              this.trigger("data", e.subarray(i + 3, t - 2)), (i = t - 2), (t += 3);
              break;
            default:
              t += 3;
          }
        (e = e.subarray(i)), (t -= i), (i = 0);
      }),
      (this.reset = function () {
        (e = null), (i = 0), this.trigger("reset");
      }),
      (this.flush = function () {
        e && e.byteLength > 3 && this.trigger("data", e.subarray(i + 3)), (e = null), (i = 0), this.trigger("done");
      }),
      (this.endTimeline = function () {
        this.flush(), this.trigger("endedtimeline");
      });
  }).prototype = new u()),
    (_ = { 100: !0, 110: !0, 122: !0, 244: !0, 44: !0, 83: !0, 86: !0, 118: !0, 128: !0, 138: !0, 139: !0, 134: !0 }),
    ((T = function () {
      var t,
        e,
        i,
        n,
        a,
        r,
        s,
        o = new w();
      T.prototype.init.call(this),
        (t = this),
        (this.push = function (t) {
          "video" === t.type && ((e = t.trackId), (i = t.pts), (n = t.dts), o.push(t));
        }),
        o.on("data", function (s) {
          var o = { trackId: e, pts: i, dts: n, data: s, nalUnitTypeCode: 31 & s[0] };
          switch (o.nalUnitTypeCode) {
            case 5:
              o.nalUnitType = "slice_layer_without_partitioning_rbsp_idr";
              break;
            case 6:
              (o.nalUnitType = "sei_rbsp"), (o.escapedRBSP = a(s.subarray(1)));
              break;
            case 7:
              (o.nalUnitType = "seq_parameter_set_rbsp"),
                (o.escapedRBSP = a(s.subarray(1))),
                (o.config = r(o.escapedRBSP));
              break;
            case 8:
              o.nalUnitType = "pic_parameter_set_rbsp";
              break;
            case 9:
              o.nalUnitType = "access_unit_delimiter_rbsp";
          }
          t.trigger("data", o);
        }),
        o.on("done", function () {
          t.trigger("done");
        }),
        o.on("partialdone", function () {
          t.trigger("partialdone");
        }),
        o.on("reset", function () {
          t.trigger("reset");
        }),
        o.on("endedtimeline", function () {
          t.trigger("endedtimeline");
        }),
        (this.flush = function () {
          o.flush();
        }),
        (this.partialFlush = function () {
          o.partialFlush();
        }),
        (this.reset = function () {
          o.reset();
        }),
        (this.endTimeline = function () {
          o.endTimeline();
        }),
        (s = function (t, e) {
          var i,
            n = 8,
            a = 8;
          for (i = 0; i < t; i++) 0 !== a && (a = (n + e.readExpGolomb() + 256) % 256), (n = 0 === a ? n : a);
        }),
        (a = function (t) {
          for (var e, i, n = t.byteLength, a = [], r = 1; r < n - 2; )
            0 === t[r] && 0 === t[r + 1] && 3 === t[r + 2] ? (a.push(r + 2), (r += 2)) : r++;
          if (0 === a.length) return t;
          (e = n - a.length), (i = new Uint8Array(e));
          var s = 0;
          for (r = 0; r < e; s++, r++) s === a[0] && (s++, a.shift()), (i[r] = t[s]);
          return i;
        }),
        (r = function (t) {
          var e,
            i,
            n,
            a,
            r,
            o,
            d,
            h,
            p,
            u,
            l,
            c,
            f = 0,
            g = 0,
            m = 0,
            y = 0,
            b = [1, 1];
          if (
            ((i = (e = new U(t)).readUnsignedByte()),
            (a = e.readUnsignedByte()),
            (n = e.readUnsignedByte()),
            e.skipUnsignedExpGolomb(),
            _[i] &&
              (3 === (r = e.readUnsignedExpGolomb()) && e.skipBits(1),
              e.skipUnsignedExpGolomb(),
              e.skipUnsignedExpGolomb(),
              e.skipBits(1),
              e.readBoolean()))
          )
            for (l = 3 !== r ? 8 : 12, c = 0; c < l; c++) e.readBoolean() && s(c < 6 ? 16 : 64, e);
          if ((e.skipUnsignedExpGolomb(), 0 === (o = e.readUnsignedExpGolomb()))) e.readUnsignedExpGolomb();
          else if (1 === o)
            for (e.skipBits(1), e.skipExpGolomb(), e.skipExpGolomb(), d = e.readUnsignedExpGolomb(), c = 0; c < d; c++)
              e.skipExpGolomb();
          if (
            (e.skipUnsignedExpGolomb(),
            e.skipBits(1),
            (h = e.readUnsignedExpGolomb()),
            (p = e.readUnsignedExpGolomb()),
            0 === (u = e.readBits(1)) && e.skipBits(1),
            e.skipBits(1),
            e.readBoolean() &&
              ((f = e.readUnsignedExpGolomb()),
              (g = e.readUnsignedExpGolomb()),
              (m = e.readUnsignedExpGolomb()),
              (y = e.readUnsignedExpGolomb())),
            e.readBoolean() && e.readBoolean())
          ) {
            switch (e.readUnsignedByte()) {
              case 1:
                b = [1, 1];
                break;
              case 2:
                b = [12, 11];
                break;
              case 3:
                b = [10, 11];
                break;
              case 4:
                b = [16, 11];
                break;
              case 5:
                b = [40, 33];
                break;
              case 6:
                b = [24, 11];
                break;
              case 7:
                b = [20, 11];
                break;
              case 8:
                b = [32, 11];
                break;
              case 9:
                b = [80, 33];
                break;
              case 10:
                b = [18, 11];
                break;
              case 11:
                b = [15, 11];
                break;
              case 12:
                b = [64, 33];
                break;
              case 13:
                b = [160, 99];
                break;
              case 14:
                b = [4, 3];
                break;
              case 15:
                b = [3, 2];
                break;
              case 16:
                b = [2, 1];
                break;
              case 255:
                b = [
                  (e.readUnsignedByte() << 8) | e.readUnsignedByte(),
                  (e.readUnsignedByte() << 8) | e.readUnsignedByte(),
                ];
            }
            b && (b[0], b[1]);
          }
          return {
            profileIdc: i,
            levelIdc: n,
            profileCompatibility: a,
            width: 16 * (h + 1) - 2 * f - 2 * g,
            height: (2 - u) * (p + 1) * 16 - 2 * m - 2 * y,
            sarRatio: b,
          };
        });
    }).prototype = new u());
  var A,
    D,
    C,
    P,
    L,
    I,
    O,
    x,
    E,
    M,
    R,
    B,
    N,
    F,
    z,
    V,
    G,
    W,
    j,
    q,
    Y,
    H,
    X,
    K,
    $,
    Z,
    J,
    Q,
    tt,
    et,
    it,
    nt,
    at,
    rt,
    st,
    ot,
    dt,
    ht,
    pt,
    ut,
    lt = { H264Stream: T, NalByteStream: w },
    ct = { Adts: k, h264: lt },
    ft = Math.pow(2, 32),
    gt = {
      getUint64: function (t) {
        var e,
          i = new DataView(t.buffer, t.byteOffset, t.byteLength);
        return i.getBigUint64
          ? (e = i.getBigUint64(0)) < Number.MAX_SAFE_INTEGER
            ? Number(e)
            : e
          : i.getUint32(0) * ft + i.getUint32(4);
      },
      MAX_UINT32: ft,
    },
    mt = gt.MAX_UINT32;
  !(function () {
    var t;
    if (
      ((H = {
        avc1: [],
        avcC: [],
        btrt: [],
        dinf: [],
        dref: [],
        esds: [],
        ftyp: [],
        hdlr: [],
        mdat: [],
        mdhd: [],
        mdia: [],
        mfhd: [],
        minf: [],
        moof: [],
        moov: [],
        mp4a: [],
        mvex: [],
        mvhd: [],
        pasp: [],
        sdtp: [],
        smhd: [],
        stbl: [],
        stco: [],
        stsc: [],
        stsd: [],
        stsz: [],
        stts: [],
        styp: [],
        tfdt: [],
        tfhd: [],
        traf: [],
        trak: [],
        trun: [],
        trex: [],
        tkhd: [],
        vmhd: [],
      }),
      "undefined" != typeof Uint8Array)
    ) {
      for (t in H) H.hasOwnProperty(t) && (H[t] = [t.charCodeAt(0), t.charCodeAt(1), t.charCodeAt(2), t.charCodeAt(3)]);
      (X = new Uint8Array(["i".charCodeAt(0), "s".charCodeAt(0), "o".charCodeAt(0), "m".charCodeAt(0)])),
        ($ = new Uint8Array(["a".charCodeAt(0), "v".charCodeAt(0), "c".charCodeAt(0), "1".charCodeAt(0)])),
        (K = new Uint8Array([0, 0, 0, 1])),
        (Z = new Uint8Array([
          0, 0, 0, 0, 0, 0, 0, 0, 118, 105, 100, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 86, 105, 100, 101, 111, 72,
          97, 110, 100, 108, 101, 114, 0,
        ])),
        (J = new Uint8Array([
          0, 0, 0, 0, 0, 0, 0, 0, 115, 111, 117, 110, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 83, 111, 117, 110, 100, 72,
          97, 110, 100, 108, 101, 114, 0,
        ])),
        (Q = { video: Z, audio: J }),
        (it = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 12, 117, 114, 108, 32, 0, 0, 0, 1])),
        (et = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0])),
        (nt = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0])),
        (at = nt),
        (rt = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
        (st = nt),
        (tt = new Uint8Array([0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]));
    }
  })(),
    (A = function (t) {
      var e,
        i,
        n = [],
        a = 0;
      for (e = 1; e < arguments.length; e++) n.push(arguments[e]);
      for (e = n.length; e--; ) a += n[e].byteLength;
      for (
        i = new Uint8Array(a + 8),
          new DataView(i.buffer, i.byteOffset, i.byteLength).setUint32(0, i.byteLength),
          i.set(t, 4),
          e = 0,
          a = 8;
        e < n.length;
        e++
      )
        i.set(n[e], a), (a += n[e].byteLength);
      return i;
    }),
    (D = function () {
      return A(H.dinf, A(H.dref, it));
    }),
    (C = function (t) {
      return A(
        H.esds,
        new Uint8Array([
          0,
          0,
          0,
          0,
          3,
          25,
          0,
          0,
          0,
          4,
          17,
          64,
          21,
          0,
          6,
          0,
          0,
          0,
          218,
          192,
          0,
          0,
          218,
          192,
          5,
          2,
          (t.audioobjecttype << 3) | (t.samplingfrequencyindex >>> 1),
          (t.samplingfrequencyindex << 7) | (t.channelcount << 3),
          6,
          1,
          2,
        ])
      );
    }),
    (z = function (t) {
      return A(H.hdlr, Q[t]);
    }),
    (F = function (t) {
      var e = new Uint8Array([
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        2,
        0,
        0,
        0,
        3,
        0,
        1,
        95,
        144,
        (t.duration >>> 24) & 255,
        (t.duration >>> 16) & 255,
        (t.duration >>> 8) & 255,
        255 & t.duration,
        85,
        196,
        0,
        0,
      ]);
      return (
        t.samplerate &&
          ((e[12] = (t.samplerate >>> 24) & 255),
          (e[13] = (t.samplerate >>> 16) & 255),
          (e[14] = (t.samplerate >>> 8) & 255),
          (e[15] = 255 & t.samplerate)),
        A(H.mdhd, e)
      );
    }),
    (N = function (t) {
      return A(H.mdia, F(t), z(t.type), I(t));
    }),
    (L = function (t) {
      return A(
        H.mfhd,
        new Uint8Array([0, 0, 0, 0, (4278190080 & t) >> 24, (16711680 & t) >> 16, (65280 & t) >> 8, 255 & t])
      );
    }),
    (I = function (t) {
      return A(H.minf, "video" === t.type ? A(H.vmhd, tt) : A(H.smhd, et), D(), G(t));
    }),
    (O = function (t, e) {
      for (var i = [], n = e.length; n--; ) i[n] = j(e[n]);
      return A.apply(null, [H.moof, L(t)].concat(i));
    }),
    (x = function (t) {
      for (var e = t.length, i = []; e--; ) i[e] = R(t[e]);
      return A.apply(null, [H.moov, M(4294967295)].concat(i).concat(E(t)));
    }),
    (E = function (t) {
      for (var e = t.length, i = []; e--; ) i[e] = q(t[e]);
      return A.apply(null, [H.mvex].concat(i));
    }),
    (M = function (t) {
      var e = new Uint8Array([
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        2,
        0,
        1,
        95,
        144,
        (4278190080 & t) >> 24,
        (16711680 & t) >> 16,
        (65280 & t) >> 8,
        255 & t,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        64,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        255,
        255,
        255,
        255,
      ]);
      return A(H.mvhd, e);
    }),
    (V = function (t) {
      var e,
        i,
        n = t.samples || [],
        a = new Uint8Array(4 + n.length);
      for (i = 0; i < n.length; i++)
        (e = n[i].flags), (a[i + 4] = (e.dependsOn << 4) | (e.isDependedOn << 2) | e.hasRedundancy);
      return A(H.sdtp, a);
    }),
    (G = function (t) {
      return A(H.stbl, W(t), A(H.stts, st), A(H.stsc, at), A(H.stsz, rt), A(H.stco, nt));
    }),
    (W = function (t) {
      return A(H.stsd, new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1]), "video" === t.type ? ot(t) : dt(t));
    }),
    (ot = function (t) {
      var e,
        i,
        n = t.sps || [],
        a = t.pps || [],
        r = [],
        s = [];
      for (e = 0; e < n.length; e++)
        r.push((65280 & n[e].byteLength) >>> 8),
          r.push(255 & n[e].byteLength),
          (r = r.concat(Array.prototype.slice.call(n[e])));
      for (e = 0; e < a.length; e++)
        s.push((65280 & a[e].byteLength) >>> 8),
          s.push(255 & a[e].byteLength),
          (s = s.concat(Array.prototype.slice.call(a[e])));
      if (
        ((i = [
          H.avc1,
          new Uint8Array([
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            (65280 & t.width) >> 8,
            255 & t.width,
            (65280 & t.height) >> 8,
            255 & t.height,
            0,
            72,
            0,
            0,
            0,
            72,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            19,
            118,
            105,
            100,
            101,
            111,
            106,
            115,
            45,
            99,
            111,
            110,
            116,
            114,
            105,
            98,
            45,
            104,
            108,
            115,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            24,
            17,
            17,
          ]),
          A(
            H.avcC,
            new Uint8Array(
              [1, t.profileIdc, t.profileCompatibility, t.levelIdc, 255].concat([n.length], r, [a.length], s)
            )
          ),
          A(H.btrt, new Uint8Array([0, 28, 156, 128, 0, 45, 198, 192, 0, 45, 198, 192])),
        ]),
        t.sarRatio)
      ) {
        var o = t.sarRatio[0],
          d = t.sarRatio[1];
        i.push(
          A(
            H.pasp,
            new Uint8Array([
              (4278190080 & o) >> 24,
              (16711680 & o) >> 16,
              (65280 & o) >> 8,
              255 & o,
              (4278190080 & d) >> 24,
              (16711680 & d) >> 16,
              (65280 & d) >> 8,
              255 & d,
            ])
          )
        );
      }
      return A.apply(null, i);
    }),
    (dt = function (t) {
      return A(
        H.mp4a,
        new Uint8Array([
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          (65280 & t.channelcount) >> 8,
          255 & t.channelcount,
          (65280 & t.samplesize) >> 8,
          255 & t.samplesize,
          0,
          0,
          0,
          0,
          (65280 & t.samplerate) >> 8,
          255 & t.samplerate,
          0,
          0,
        ]),
        C(t)
      );
    }),
    (B = function (t) {
      var e = new Uint8Array([
        0,
        0,
        0,
        7,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        (4278190080 & t.id) >> 24,
        (16711680 & t.id) >> 16,
        (65280 & t.id) >> 8,
        255 & t.id,
        0,
        0,
        0,
        0,
        (4278190080 & t.duration) >> 24,
        (16711680 & t.duration) >> 16,
        (65280 & t.duration) >> 8,
        255 & t.duration,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        64,
        0,
        0,
        0,
        (65280 & t.width) >> 8,
        255 & t.width,
        0,
        0,
        (65280 & t.height) >> 8,
        255 & t.height,
        0,
        0,
      ]);
      return A(H.tkhd, e);
    }),
    (j = function (t) {
      var e, i, n, a, r, s;
      return (
        (e = A(
          H.tfhd,
          new Uint8Array([
            0,
            0,
            0,
            58,
            (4278190080 & t.id) >> 24,
            (16711680 & t.id) >> 16,
            (65280 & t.id) >> 8,
            255 & t.id,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
          ])
        )),
        (r = Math.floor(t.baseMediaDecodeTime / mt)),
        (s = Math.floor(t.baseMediaDecodeTime % mt)),
        (i = A(
          H.tfdt,
          new Uint8Array([
            1,
            0,
            0,
            0,
            (r >>> 24) & 255,
            (r >>> 16) & 255,
            (r >>> 8) & 255,
            255 & r,
            (s >>> 24) & 255,
            (s >>> 16) & 255,
            (s >>> 8) & 255,
            255 & s,
          ])
        )),
        92,
        "audio" === t.type
          ? ((n = Y(t, 92)), A(H.traf, e, i, n))
          : ((a = V(t)), (n = Y(t, a.length + 92)), A(H.traf, e, i, n, a))
      );
    }),
    (R = function (t) {
      return (t.duration = t.duration || 4294967295), A(H.trak, B(t), N(t));
    }),
    (q = function (t) {
      var e = new Uint8Array([
        0,
        0,
        0,
        0,
        (4278190080 & t.id) >> 24,
        (16711680 & t.id) >> 16,
        (65280 & t.id) >> 8,
        255 & t.id,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        1,
      ]);
      return "video" !== t.type && (e[e.length - 1] = 0), A(H.trex, e);
    }),
    (ut = function (t, e) {
      var i = 0,
        n = 0,
        a = 0,
        r = 0;
      return (
        t.length &&
          (void 0 !== t[0].duration && (i = 1),
          void 0 !== t[0].size && (n = 2),
          void 0 !== t[0].flags && (a = 4),
          void 0 !== t[0].compositionTimeOffset && (r = 8)),
        [
          0,
          0,
          i | n | a | r,
          1,
          (4278190080 & t.length) >>> 24,
          (16711680 & t.length) >>> 16,
          (65280 & t.length) >>> 8,
          255 & t.length,
          (4278190080 & e) >>> 24,
          (16711680 & e) >>> 16,
          (65280 & e) >>> 8,
          255 & e,
        ]
      );
    }),
    (pt = function (t, e) {
      var i, n, a, r, s, o;
      for (
        e += 20 + 16 * (r = t.samples || []).length,
          a = ut(r, e),
          (n = new Uint8Array(a.length + 16 * r.length)).set(a),
          i = a.length,
          o = 0;
        o < r.length;
        o++
      )
        (s = r[o]),
          (n[i++] = (4278190080 & s.duration) >>> 24),
          (n[i++] = (16711680 & s.duration) >>> 16),
          (n[i++] = (65280 & s.duration) >>> 8),
          (n[i++] = 255 & s.duration),
          (n[i++] = (4278190080 & s.size) >>> 24),
          (n[i++] = (16711680 & s.size) >>> 16),
          (n[i++] = (65280 & s.size) >>> 8),
          (n[i++] = 255 & s.size),
          (n[i++] = (s.flags.isLeading << 2) | s.flags.dependsOn),
          (n[i++] =
            (s.flags.isDependedOn << 6) |
            (s.flags.hasRedundancy << 4) |
            (s.flags.paddingValue << 1) |
            s.flags.isNonSyncSample),
          (n[i++] = 61440 & s.flags.degradationPriority),
          (n[i++] = 15 & s.flags.degradationPriority),
          (n[i++] = (4278190080 & s.compositionTimeOffset) >>> 24),
          (n[i++] = (16711680 & s.compositionTimeOffset) >>> 16),
          (n[i++] = (65280 & s.compositionTimeOffset) >>> 8),
          (n[i++] = 255 & s.compositionTimeOffset);
      return A(H.trun, n);
    }),
    (ht = function (t, e) {
      var i, n, a, r, s, o;
      for (
        e += 20 + 8 * (r = t.samples || []).length,
          a = ut(r, e),
          (i = new Uint8Array(a.length + 8 * r.length)).set(a),
          n = a.length,
          o = 0;
        o < r.length;
        o++
      )
        (s = r[o]),
          (i[n++] = (4278190080 & s.duration) >>> 24),
          (i[n++] = (16711680 & s.duration) >>> 16),
          (i[n++] = (65280 & s.duration) >>> 8),
          (i[n++] = 255 & s.duration),
          (i[n++] = (4278190080 & s.size) >>> 24),
          (i[n++] = (16711680 & s.size) >>> 16),
          (i[n++] = (65280 & s.size) >>> 8),
          (i[n++] = 255 & s.size);
      return A(H.trun, i);
    }),
    (Y = function (t, e) {
      return "audio" === t.type ? ht(t, e) : pt(t, e);
    });
  var yt,
    bt,
    vt,
    St,
    Tt,
    wt,
    _t = {
      ftyp: (P = function () {
        return A(H.ftyp, X, K, X, $);
      }),
      mdat: function (t) {
        return A(H.mdat, t);
      },
      moof: O,
      moov: x,
      initSegment: function (t) {
        var e,
          i = P(),
          n = x(t);
        return (e = new Uint8Array(i.byteLength + n.byteLength)).set(i), e.set(n, i.byteLength), e;
      },
    },
    kt = function (t) {
      return t >>> 0;
    },
    Ut = function (t) {
      var e = "";
      return (
        (e += String.fromCharCode(t[0])),
        (e += String.fromCharCode(t[1])),
        (e += String.fromCharCode(t[2])),
        (e += String.fromCharCode(t[3]))
      );
    },
    At = kt,
    Dt = function t(e, i) {
      var n,
        a,
        r,
        s,
        o,
        d = [];
      if (!i.length) return null;
      for (n = 0; n < e.byteLength; )
        (a = At((e[n] << 24) | (e[n + 1] << 16) | (e[n + 2] << 8) | e[n + 3])),
          (r = Ut(e.subarray(n + 4, n + 8))),
          (s = a > 1 ? n + a : e.byteLength),
          r === i[0] &&
            (1 === i.length
              ? d.push(e.subarray(n + 8, s))
              : (o = t(e.subarray(n + 8, s), i.slice(1))).length && (d = d.concat(o))),
          (n = s);
      return d;
    },
    Ct = function (t) {
      var e,
        i = new DataView(t.buffer, t.byteOffset, t.byteLength),
        n = { version: t[0], flags: new Uint8Array(t.subarray(1, 4)), trackId: i.getUint32(4) },
        a = 1 & n.flags[2],
        r = 2 & n.flags[2],
        s = 8 & n.flags[2],
        o = 16 & n.flags[2],
        d = 32 & n.flags[2],
        h = 65536 & n.flags[0],
        p = 131072 & n.flags[0];
      return (
        (e = 8),
        a && ((e += 4), (n.baseDataOffset = i.getUint32(12)), (e += 4)),
        r && ((n.sampleDescriptionIndex = i.getUint32(e)), (e += 4)),
        s && ((n.defaultSampleDuration = i.getUint32(e)), (e += 4)),
        o && ((n.defaultSampleSize = i.getUint32(e)), (e += 4)),
        d && (n.defaultSampleFlags = i.getUint32(e)),
        h && (n.durationIsEmpty = !0),
        !a && p && (n.baseDataOffsetIsMoof = !0),
        n
      );
    },
    Pt = function (t) {
      return {
        isLeading: (12 & t[0]) >>> 2,
        dependsOn: 3 & t[0],
        isDependedOn: (192 & t[1]) >>> 6,
        hasRedundancy: (48 & t[1]) >>> 4,
        paddingValue: (14 & t[1]) >>> 1,
        isNonSyncSample: 1 & t[1],
        degradationPriority: (t[2] << 8) | t[3],
      };
    },
    Lt = function (t) {
      var e,
        i = { version: t[0], flags: new Uint8Array(t.subarray(1, 4)), samples: [] },
        n = new DataView(t.buffer, t.byteOffset, t.byteLength),
        a = 1 & i.flags[2],
        r = 4 & i.flags[2],
        s = 1 & i.flags[1],
        o = 2 & i.flags[1],
        d = 4 & i.flags[1],
        h = 8 & i.flags[1],
        p = n.getUint32(4),
        u = 8;
      for (
        a && ((i.dataOffset = n.getInt32(u)), (u += 4)),
          r &&
            p &&
            ((e = { flags: Pt(t.subarray(u, u + 4)) }),
            (u += 4),
            s && ((e.duration = n.getUint32(u)), (u += 4)),
            o && ((e.size = n.getUint32(u)), (u += 4)),
            h &&
              (1 === i.version ? (e.compositionTimeOffset = n.getInt32(u)) : (e.compositionTimeOffset = n.getUint32(u)),
              (u += 4)),
            i.samples.push(e),
            p--);
        p--;

      )
        (e = {}),
          s && ((e.duration = n.getUint32(u)), (u += 4)),
          o && ((e.size = n.getUint32(u)), (u += 4)),
          d && ((e.flags = Pt(t.subarray(u, u + 4))), (u += 4)),
          h &&
            (1 === i.version ? (e.compositionTimeOffset = n.getInt32(u)) : (e.compositionTimeOffset = n.getUint32(u)),
            (u += 4)),
          i.samples.push(e);
      return i;
    },
    It = kt,
    Ot = gt.getUint64,
    xt = function (t) {
      var e = { version: t[0], flags: new Uint8Array(t.subarray(1, 4)) };
      return (
        1 === e.version
          ? (e.baseMediaDecodeTime = Ot(t.subarray(4)))
          : (e.baseMediaDecodeTime = It((t[4] << 24) | (t[5] << 16) | (t[6] << 8) | t[7])),
        e
      );
    },
    Et = kt,
    Mt = function (t) {
      return ("00" + t.toString(16)).slice(-2);
    },
    Rt = gt.getUint64;
  (yt = function (t) {
    return Dt(t, ["moov", "trak"]).reduce(function (t, e) {
      var i, n, a, r, s;
      return (i = Dt(e, ["tkhd"])[0])
        ? ((n = i[0]),
          (r = Et((i[(a = 0 === n ? 12 : 20)] << 24) | (i[a + 1] << 16) | (i[a + 2] << 8) | i[a + 3])),
          (s = Dt(e, ["mdia", "mdhd"])[0])
            ? ((a = 0 === (n = s[0]) ? 12 : 20),
              (t[r] = Et((s[a] << 24) | (s[a + 1] << 16) | (s[a + 2] << 8) | s[a + 3])),
              t)
            : null)
        : null;
    }, {});
  }),
    (bt = function (t, e) {
      var n = Dt(e, ["moof", "traf"]).reduce(function (e, n) {
        var a,
          r,
          s = Dt(n, ["tfhd"])[0],
          o = Et((s[4] << 24) | (s[5] << 16) | (s[6] << 8) | s[7]),
          d = t[o] || 9e4,
          h = Dt(n, ["tfdt"])[0],
          p = new DataView(h.buffer, h.byteOffset, h.byteLength);
        return (
          "bigint" == typeof (a = 1 === h[0] ? Rt(h.subarray(4, 12)) : p.getUint32(4))
            ? (r = a / i.default.BigInt(d))
            : "number" != typeof a || isNaN(a) || (r = a / d),
          r < Number.MAX_SAFE_INTEGER && (r = Number(r)),
          r < e && (e = r),
          e
        );
      }, 1 / 0);
      return "bigint" == typeof n || isFinite(n) ? n : 0;
    }),
    (vt = function (t, e) {
      var n,
        a = Dt(e, ["moof", "traf"]),
        r = 0,
        s = 0;
      if (a && a.length) {
        var o = Dt(a[0], ["tfhd"])[0],
          d = Dt(a[0], ["trun"])[0],
          h = Dt(a[0], ["tfdt"])[0];
        if (o) n = Ct(o).trackId;
        if (h) r = xt(h).baseMediaDecodeTime;
        if (d) {
          var p = Lt(d);
          p.samples && p.samples.length && (s = p.samples[0].compositionTimeOffset || 0);
        }
      }
      var u = t[n] || 9e4;
      "bigint" == typeof r && ((s = i.default.BigInt(s)), (u = i.default.BigInt(u)));
      var l = (r + s) / u;
      return "bigint" == typeof l && l < Number.MAX_SAFE_INTEGER && (l = Number(l)), l;
    }),
    (St = function (t) {
      var e = Dt(t, ["moov", "trak"]),
        i = [];
      return (
        e.forEach(function (t) {
          var e = Dt(t, ["mdia", "hdlr"]),
            n = Dt(t, ["tkhd"]);
          e.forEach(function (t, e) {
            var a,
              r,
              s = Ut(t.subarray(8, 12)),
              o = n[e];
            "vide" === s &&
              ((r =
                0 === (a = new DataView(o.buffer, o.byteOffset, o.byteLength)).getUint8(0)
                  ? a.getUint32(12)
                  : a.getUint32(20)),
              i.push(r));
          });
        }),
        i
      );
    }),
    (Tt = function (t) {
      var e = Dt(t, ["moov", "trak"]),
        i = [];
      return (
        e.forEach(function (t) {
          var e,
            n,
            a = {},
            r = Dt(t, ["tkhd"])[0];
          r &&
            ((n = (e = new DataView(r.buffer, r.byteOffset, r.byteLength)).getUint8(0)),
            (a.id = 0 === n ? e.getUint32(12) : e.getUint32(20)));
          var s = Dt(t, ["mdia", "hdlr"])[0];
          if (s) {
            var o = Ut(s.subarray(8, 12));
            a.type = "vide" === o ? "video" : "soun" === o ? "audio" : o;
          }
          var d = Dt(t, ["mdia", "minf", "stbl", "stsd"])[0];
          if (d) {
            var h = d.subarray(8);
            a.codec = Ut(h.subarray(4, 8));
            var p,
              u = Dt(h, [a.codec])[0];
            u &&
              (/^[asm]vc[1-9]$/i.test(a.codec)
                ? ((p = u.subarray(78)),
                  "avcC" === Ut(p.subarray(4, 8)) && p.length > 11
                    ? ((a.codec += "."), (a.codec += Mt(p[9])), (a.codec += Mt(p[10])), (a.codec += Mt(p[11])))
                    : (a.codec = "avc1.4d400d"))
                : /^mp4[a,v]$/i.test(a.codec)
                ? ((p = u.subarray(28)),
                  "esds" === Ut(p.subarray(4, 8)) && p.length > 20 && 0 !== p[19]
                    ? ((a.codec += "." + Mt(p[19])), (a.codec += "." + Mt((p[20] >>> 2) & 63).replace(/^0/, "")))
                    : (a.codec = "mp4a.40.2"))
                : (a.codec = a.codec.toLowerCase()));
          }
          var l = Dt(t, ["mdia", "mdhd"])[0];
          l && (a.timescale = wt(l)), i.push(a);
        }),
        i
      );
    });
  var Bt,
    Nt = {
      findBox: Dt,
      parseType: Ut,
      timescale: yt,
      startTime: bt,
      compositionStartTime: vt,
      videoTrackIds: St,
      tracks: Tt,
      getTimescaleFromMediaHeader: (wt = function (t) {
        var e = 0 === t[0] ? 12 : 20;
        return Et((t[e] << 24) | (t[e + 1] << 16) | (t[e + 2] << 8) | t[e + 3]);
      }),
    },
    Ft = function (t, e) {
      var i = {
        size: 0,
        flags: {
          isLeading: 0,
          dependsOn: 1,
          isDependedOn: 0,
          hasRedundancy: 0,
          degradationPriority: 0,
          isNonSyncSample: 1,
        },
      };
      return (
        (i.dataOffset = e),
        (i.compositionTimeOffset = t.pts - t.dts),
        (i.duration = t.duration),
        (i.size = 4 * t.length),
        (i.size += t.byteLength),
        t.keyFrame && ((i.flags.dependsOn = 2), (i.flags.isNonSyncSample = 0)),
        i
      );
    },
    zt = function (t) {
      var e,
        i,
        n = [],
        a = [];
      for (a.byteLength = 0, a.nalCount = 0, a.duration = 0, n.byteLength = 0, e = 0; e < t.length; e++)
        "access_unit_delimiter_rbsp" === (i = t[e]).nalUnitType
          ? (n.length &&
              ((n.duration = i.dts - n.dts),
              (a.byteLength += n.byteLength),
              (a.nalCount += n.length),
              (a.duration += n.duration),
              a.push(n)),
            ((n = [i]).byteLength = i.data.byteLength),
            (n.pts = i.pts),
            (n.dts = i.dts))
          : ("slice_layer_without_partitioning_rbsp_idr" === i.nalUnitType && (n.keyFrame = !0),
            (n.duration = i.dts - n.dts),
            (n.byteLength += i.data.byteLength),
            n.push(i));
      return (
        a.length && (!n.duration || n.duration <= 0) && (n.duration = a[a.length - 1].duration),
        (a.byteLength += n.byteLength),
        (a.nalCount += n.length),
        (a.duration += n.duration),
        a.push(n),
        a
      );
    },
    Vt = function (t) {
      var e,
        i,
        n = [],
        a = [];
      for (
        n.byteLength = 0,
          n.nalCount = 0,
          n.duration = 0,
          n.pts = t[0].pts,
          n.dts = t[0].dts,
          a.byteLength = 0,
          a.nalCount = 0,
          a.duration = 0,
          a.pts = t[0].pts,
          a.dts = t[0].dts,
          e = 0;
        e < t.length;
        e++
      )
        (i = t[e]).keyFrame
          ? (n.length &&
              (a.push(n), (a.byteLength += n.byteLength), (a.nalCount += n.nalCount), (a.duration += n.duration)),
            ((n = [i]).nalCount = i.length),
            (n.byteLength = i.byteLength),
            (n.pts = i.pts),
            (n.dts = i.dts),
            (n.duration = i.duration))
          : ((n.duration += i.duration), (n.nalCount += i.length), (n.byteLength += i.byteLength), n.push(i));
      return (
        a.length && n.duration <= 0 && (n.duration = a[a.length - 1].duration),
        (a.byteLength += n.byteLength),
        (a.nalCount += n.nalCount),
        (a.duration += n.duration),
        a.push(n),
        a
      );
    },
    Gt = function (t) {
      var e;
      return (
        !t[0][0].keyFrame &&
          t.length > 1 &&
          ((e = t.shift()),
          (t.byteLength -= e.byteLength),
          (t.nalCount -= e.nalCount),
          (t[0][0].dts = e.dts),
          (t[0][0].pts = e.pts),
          (t[0][0].duration += e.duration)),
        t
      );
    },
    Wt = function (t, e) {
      var i,
        n,
        a,
        r,
        s,
        o = e || 0,
        d = [];
      for (i = 0; i < t.length; i++)
        for (r = t[i], n = 0; n < r.length; n++) (s = r[n]), (o += (a = Ft(s, o)).size), d.push(a);
      return d;
    },
    jt = function (t) {
      var e,
        i,
        n,
        a,
        r,
        s,
        o = 0,
        d = t.byteLength,
        h = t.nalCount,
        p = new Uint8Array(d + 4 * h),
        u = new DataView(p.buffer);
      for (e = 0; e < t.length; e++)
        for (a = t[e], i = 0; i < a.length; i++)
          for (r = a[i], n = 0; n < r.length; n++)
            (s = r[n]), u.setUint32(o, s.data.byteLength), (o += 4), p.set(s.data, o), (o += s.data.byteLength);
      return p;
    },
    qt = function (t, e) {
      var i,
        n = [];
      return (i = Ft(t, e || 0)), n.push(i), n;
    },
    Yt = function (t) {
      var e,
        i,
        n = 0,
        a = t.byteLength,
        r = t.length,
        s = new Uint8Array(a + 4 * r),
        o = new DataView(s.buffer);
      for (e = 0; e < t.length; e++)
        (i = t[e]), o.setUint32(n, i.data.byteLength), (n += 4), s.set(i.data, n), (n += i.data.byteLength);
      return s;
    },
    Ht = [33, 16, 5, 32, 164, 27],
    Xt = [33, 65, 108, 84, 1, 2, 4, 8, 168, 2, 4, 8, 17, 191, 252],
    Kt = function (t) {
      for (var e = []; t--; ) e.push(0);
      return e;
    },
    $t = function () {
      if (!Bt) {
        var t = {
          96e3: [Ht, [227, 64], Kt(154), [56]],
          88200: [Ht, [231], Kt(170), [56]],
          64e3: [Ht, [248, 192], Kt(240), [56]],
          48e3: [Ht, [255, 192], Kt(268), [55, 148, 128], Kt(54), [112]],
          44100: [Ht, [255, 192], Kt(268), [55, 163, 128], Kt(84), [112]],
          32e3: [Ht, [255, 192], Kt(268), [55, 234], Kt(226), [112]],
          24e3: [Ht, [255, 192], Kt(268), [55, 255, 128], Kt(268), [111, 112], Kt(126), [224]],
          16e3: [Ht, [255, 192], Kt(268), [55, 255, 128], Kt(268), [111, 255], Kt(269), [223, 108], Kt(195), [1, 192]],
          12e3: [
            Xt,
            Kt(268),
            [3, 127, 248],
            Kt(268),
            [6, 255, 240],
            Kt(268),
            [13, 255, 224],
            Kt(268),
            [27, 253, 128],
            Kt(259),
            [56],
          ],
          11025: [
            Xt,
            Kt(268),
            [3, 127, 248],
            Kt(268),
            [6, 255, 240],
            Kt(268),
            [13, 255, 224],
            Kt(268),
            [27, 255, 192],
            Kt(268),
            [55, 175, 128],
            Kt(108),
            [112],
          ],
          8e3: [Xt, Kt(268), [3, 121, 16], Kt(47), [7]],
        };
        (e = t),
          (Bt = Object.keys(e).reduce(function (t, i) {
            return (
              (t[i] = new Uint8Array(
                e[i].reduce(function (t, e) {
                  return t.concat(e);
                }, [])
              )),
              t
            );
          }, {}));
      }
      var e;
      return Bt;
    },
    Zt = function (t, e, i, n) {
      var a,
        r,
        s,
        o,
        d,
        h = 0,
        p = 0,
        u = 0;
      if (
        e.length &&
        ((a = m(t.baseMediaDecodeTime, t.samplerate)),
        (r = Math.ceil(f / (t.samplerate / 1024))),
        i && n && ((h = a - Math.max(i, n)), (u = (p = Math.floor(h / r)) * r)),
        !(p < 1 || u > f / 2))
      ) {
        for ((s = $t()[t.samplerate]) || (s = e[0].data), o = 0; o < p; o++)
          (d = e[0]), e.splice(0, 0, { data: s, dts: d.dts - r, pts: d.pts - r });
        return (t.baseMediaDecodeTime -= Math.floor(y(u, t.samplerate))), u;
      }
    },
    Jt = function (t, e, i) {
      return e.minSegmentDts >= i
        ? t
        : ((e.minSegmentDts = 1 / 0),
          t.filter(function (t) {
            return (
              t.dts >= i &&
              ((e.minSegmentDts = Math.min(e.minSegmentDts, t.dts)), (e.minSegmentPts = e.minSegmentDts), !0)
            );
          }));
    },
    Qt = function (t) {
      var e,
        i,
        n = [];
      for (e = 0; e < t.length; e++) (i = t[e]), n.push({ size: i.data.byteLength, duration: 1024 });
      return n;
    },
    te = function (t) {
      var e,
        i,
        n = 0,
        a = new Uint8Array(
          (function (t) {
            var e,
              i = 0;
            for (e = 0; e < t.length; e++) i += t[e].data.byteLength;
            return i;
          })(t)
        );
      for (e = 0; e < t.length; e++) (i = t[e]), a.set(i.data, n), (n += i.data.byteLength);
      return a;
    },
    ee = f,
    ie = function (t) {
      delete t.minSegmentDts, delete t.maxSegmentDts, delete t.minSegmentPts, delete t.maxSegmentPts;
    },
    ne = function (t, e) {
      var i,
        n = t.minSegmentDts;
      return (
        e || (n -= t.timelineStartInfo.dts),
        (i = t.timelineStartInfo.baseMediaDecodeTime),
        (i += n),
        (i = Math.max(0, i)),
        "audio" === t.type && ((i *= t.samplerate / ee), (i = Math.floor(i))),
        i
      );
    },
    ae = function (t, e) {
      "number" == typeof e.pts &&
        (void 0 === t.timelineStartInfo.pts && (t.timelineStartInfo.pts = e.pts),
        void 0 === t.minSegmentPts ? (t.minSegmentPts = e.pts) : (t.minSegmentPts = Math.min(t.minSegmentPts, e.pts)),
        void 0 === t.maxSegmentPts ? (t.maxSegmentPts = e.pts) : (t.maxSegmentPts = Math.max(t.maxSegmentPts, e.pts))),
        "number" == typeof e.dts &&
          (void 0 === t.timelineStartInfo.dts && (t.timelineStartInfo.dts = e.dts),
          void 0 === t.minSegmentDts ? (t.minSegmentDts = e.dts) : (t.minSegmentDts = Math.min(t.minSegmentDts, e.dts)),
          void 0 === t.maxSegmentDts
            ? (t.maxSegmentDts = e.dts)
            : (t.maxSegmentDts = Math.max(t.maxSegmentDts, e.dts)));
    },
    re = function (t) {
      for (var e = 0, i = { payloadType: -1, payloadSize: 0 }, n = 0, a = 0; e < t.byteLength && 128 !== t[e]; ) {
        for (; 255 === t[e]; ) (n += 255), e++;
        for (n += t[e++]; 255 === t[e]; ) (a += 255), e++;
        if (((a += t[e++]), !i.payload && 4 === n)) {
          if ("GA94" === String.fromCharCode(t[e + 3], t[e + 4], t[e + 5], t[e + 6])) {
            (i.payloadType = n), (i.payloadSize = a), (i.payload = t.subarray(e, e + a));
            break;
          }
          i.payload = void 0;
        }
        (e += a), (n = 0), (a = 0);
      }
      return i;
    },
    se = function (t) {
      return 181 !== t.payload[0] ||
        49 != ((t.payload[1] << 8) | t.payload[2]) ||
        "GA94" !== String.fromCharCode(t.payload[3], t.payload[4], t.payload[5], t.payload[6]) ||
        3 !== t.payload[7]
        ? null
        : t.payload.subarray(8, t.payload.length - 1);
    },
    oe = function (t, e) {
      var i,
        n,
        a,
        r,
        s = [];
      if (!(64 & e[0])) return s;
      for (n = 31 & e[0], i = 0; i < n; i++)
        (r = { type: 3 & e[(a = 3 * i) + 2], pts: t }),
          4 & e[a + 2] && ((r.ccData = (e[a + 3] << 8) | e[a + 4]), s.push(r));
      return s;
    },
    de = function (t) {
      for (var e, i, n = t.byteLength, a = [], r = 1; r < n - 2; )
        0 === t[r] && 0 === t[r + 1] && 3 === t[r + 2] ? (a.push(r + 2), (r += 2)) : r++;
      if (0 === a.length) return t;
      (e = n - a.length), (i = new Uint8Array(e));
      var s = 0;
      for (r = 0; r < e; s++, r++) s === a[0] && (s++, a.shift()), (i[r] = t[s]);
      return i;
    },
    he = 4,
    pe = function t(e) {
      (e = e || {}),
        t.prototype.init.call(this),
        (this.parse708captions_ = "boolean" != typeof e.parse708captions || e.parse708captions),
        (this.captionPackets_ = []),
        (this.ccStreams_ = [new Se(0, 0), new Se(0, 1), new Se(1, 0), new Se(1, 1)]),
        this.parse708captions_ && (this.cc708Stream_ = new ge({ captionServices: e.captionServices })),
        this.reset(),
        this.ccStreams_.forEach(function (t) {
          t.on("data", this.trigger.bind(this, "data")),
            t.on("partialdone", this.trigger.bind(this, "partialdone")),
            t.on("done", this.trigger.bind(this, "done"));
        }, this),
        this.parse708captions_ &&
          (this.cc708Stream_.on("data", this.trigger.bind(this, "data")),
          this.cc708Stream_.on("partialdone", this.trigger.bind(this, "partialdone")),
          this.cc708Stream_.on("done", this.trigger.bind(this, "done")));
    };
  ((pe.prototype = new u()).push = function (t) {
    var e, i, n;
    if ("sei_rbsp" === t.nalUnitType && (e = re(t.escapedRBSP)).payload && e.payloadType === he && (i = se(e)))
      if (t.dts < this.latestDts_) this.ignoreNextEqualDts_ = !0;
      else {
        if (t.dts === this.latestDts_ && this.ignoreNextEqualDts_)
          return this.numSameDts_--, void (this.numSameDts_ || (this.ignoreNextEqualDts_ = !1));
        (n = oe(t.pts, i)),
          (this.captionPackets_ = this.captionPackets_.concat(n)),
          this.latestDts_ !== t.dts && (this.numSameDts_ = 0),
          this.numSameDts_++,
          (this.latestDts_ = t.dts);
      }
  }),
    (pe.prototype.flushCCStreams = function (t) {
      this.ccStreams_.forEach(function (e) {
        return "flush" === t ? e.flush() : e.partialFlush();
      }, this);
    }),
    (pe.prototype.flushStream = function (t) {
      this.captionPackets_.length
        ? (this.captionPackets_.forEach(function (t, e) {
            t.presortIndex = e;
          }),
          this.captionPackets_.sort(function (t, e) {
            return t.pts === e.pts ? t.presortIndex - e.presortIndex : t.pts - e.pts;
          }),
          this.captionPackets_.forEach(function (t) {
            t.type < 2 ? this.dispatchCea608Packet(t) : this.dispatchCea708Packet(t);
          }, this),
          (this.captionPackets_.length = 0),
          this.flushCCStreams(t))
        : this.flushCCStreams(t);
    }),
    (pe.prototype.flush = function () {
      return this.flushStream("flush");
    }),
    (pe.prototype.partialFlush = function () {
      return this.flushStream("partialFlush");
    }),
    (pe.prototype.reset = function () {
      (this.latestDts_ = null),
        (this.ignoreNextEqualDts_ = !1),
        (this.numSameDts_ = 0),
        (this.activeCea608Channel_ = [null, null]),
        this.ccStreams_.forEach(function (t) {
          t.reset();
        });
    }),
    (pe.prototype.dispatchCea608Packet = function (t) {
      this.setsTextOrXDSActive(t)
        ? (this.activeCea608Channel_[t.type] = null)
        : this.setsChannel1Active(t)
        ? (this.activeCea608Channel_[t.type] = 0)
        : this.setsChannel2Active(t) && (this.activeCea608Channel_[t.type] = 1),
        null !== this.activeCea608Channel_[t.type] &&
          this.ccStreams_[(t.type << 1) + this.activeCea608Channel_[t.type]].push(t);
    }),
    (pe.prototype.setsChannel1Active = function (t) {
      return 4096 == (30720 & t.ccData);
    }),
    (pe.prototype.setsChannel2Active = function (t) {
      return 6144 == (30720 & t.ccData);
    }),
    (pe.prototype.setsTextOrXDSActive = function (t) {
      return 256 == (28928 & t.ccData) || 4138 == (30974 & t.ccData) || 6186 == (30974 & t.ccData);
    }),
    (pe.prototype.dispatchCea708Packet = function (t) {
      this.parse708captions_ && this.cc708Stream_.push(t);
    });
  var ue = {
      127: 9834,
      4128: 32,
      4129: 160,
      4133: 8230,
      4138: 352,
      4140: 338,
      4144: 9608,
      4145: 8216,
      4146: 8217,
      4147: 8220,
      4148: 8221,
      4149: 8226,
      4153: 8482,
      4154: 353,
      4156: 339,
      4157: 8480,
      4159: 376,
      4214: 8539,
      4215: 8540,
      4216: 8541,
      4217: 8542,
      4218: 9168,
      4219: 9124,
      4220: 9123,
      4221: 9135,
      4222: 9126,
      4223: 9121,
      4256: 12600,
    },
    le = function (t) {
      return (32 <= t && t <= 127) || (160 <= t && t <= 255);
    },
    ce = function (t) {
      (this.windowNum = t), this.reset();
    };
  (ce.prototype.reset = function () {
    this.clearText(),
      (this.pendingNewLine = !1),
      (this.winAttr = {}),
      (this.penAttr = {}),
      (this.penLoc = {}),
      (this.penColor = {}),
      (this.visible = 0),
      (this.rowLock = 0),
      (this.columnLock = 0),
      (this.priority = 0),
      (this.relativePositioning = 0),
      (this.anchorVertical = 0),
      (this.anchorHorizontal = 0),
      (this.anchorPoint = 0),
      (this.rowCount = 1),
      (this.virtualRowCount = this.rowCount + 1),
      (this.columnCount = 41),
      (this.windowStyle = 0),
      (this.penStyle = 0);
  }),
    (ce.prototype.getText = function () {
      return this.rows.join("\n");
    }),
    (ce.prototype.clearText = function () {
      (this.rows = [""]), (this.rowIdx = 0);
    }),
    (ce.prototype.newLine = function (t) {
      for (
        this.rows.length >= this.virtualRowCount &&
          "function" == typeof this.beforeRowOverflow &&
          this.beforeRowOverflow(t),
          this.rows.length > 0 && (this.rows.push(""), this.rowIdx++);
        this.rows.length > this.virtualRowCount;

      )
        this.rows.shift(), this.rowIdx--;
    }),
    (ce.prototype.isEmpty = function () {
      return 0 === this.rows.length || (1 === this.rows.length && "" === this.rows[0]);
    }),
    (ce.prototype.addText = function (t) {
      this.rows[this.rowIdx] += t;
    }),
    (ce.prototype.backspace = function () {
      if (!this.isEmpty()) {
        var t = this.rows[this.rowIdx];
        this.rows[this.rowIdx] = t.substr(0, t.length - 1);
      }
    });
  var fe = function (t, e, i) {
    (this.serviceNum = t),
      (this.text = ""),
      (this.currentWindow = new ce(-1)),
      (this.windows = []),
      (this.stream = i),
      "string" == typeof e && this.createTextDecoder(e);
  };
  (fe.prototype.init = function (t, e) {
    this.startPts = t;
    for (var i = 0; i < 8; i++)
      (this.windows[i] = new ce(i)), "function" == typeof e && (this.windows[i].beforeRowOverflow = e);
  }),
    (fe.prototype.setCurrentWindow = function (t) {
      this.currentWindow = this.windows[t];
    }),
    (fe.prototype.createTextDecoder = function (t) {
      if ("undefined" == typeof TextDecoder)
        this.stream.trigger("log", {
          level: "warn",
          message: "The `encoding` option is unsupported without TextDecoder support",
        });
      else
        try {
          this.textDecoder_ = new TextDecoder(t);
        } catch (e) {
          this.stream.trigger("log", {
            level: "warn",
            message: "TextDecoder could not be created with " + t + " encoding. " + e,
          });
        }
    });
  var ge = function t(e) {
    (e = e || {}), t.prototype.init.call(this);
    var i,
      n = this,
      a = e.captionServices || {},
      r = {};
    Object.keys(a).forEach(function (t) {
      (i = a[t]), /^SERVICE/.test(t) && (r[t] = i.encoding);
    }),
      (this.serviceEncodings = r),
      (this.current708Packet = null),
      (this.services = {}),
      (this.push = function (t) {
        3 === t.type
          ? (n.new708Packet(), n.add708Bytes(t))
          : (null === n.current708Packet && n.new708Packet(), n.add708Bytes(t));
      });
  };
  (ge.prototype = new u()),
    (ge.prototype.new708Packet = function () {
      null !== this.current708Packet && this.push708Packet(), (this.current708Packet = { data: [], ptsVals: [] });
    }),
    (ge.prototype.add708Bytes = function (t) {
      var e = t.ccData,
        i = e >>> 8,
        n = 255 & e;
      this.current708Packet.ptsVals.push(t.pts), this.current708Packet.data.push(i), this.current708Packet.data.push(n);
    }),
    (ge.prototype.push708Packet = function () {
      var t = this.current708Packet,
        e = t.data,
        i = null,
        n = null,
        a = 0,
        r = e[a++];
      for (t.seq = r >> 6, t.sizeCode = 63 & r; a < e.length; a++)
        (n = 31 & (r = e[a++])),
          7 === (i = r >> 5) && n > 0 && (i = r = e[a++]),
          this.pushServiceBlock(i, a, n),
          n > 0 && (a += n - 1);
    }),
    (ge.prototype.pushServiceBlock = function (t, e, i) {
      var n,
        a = e,
        r = this.current708Packet.data,
        s = this.services[t];
      for (s || (s = this.initService(t, a)); a < e + i && a < r.length; a++)
        (n = r[a]),
          le(n)
            ? (a = this.handleText(a, s))
            : 24 === n
            ? (a = this.multiByteCharacter(a, s))
            : 16 === n
            ? (a = this.extendedCommands(a, s))
            : 128 <= n && n <= 135
            ? (a = this.setCurrentWindow(a, s))
            : 152 <= n && n <= 159
            ? (a = this.defineWindow(a, s))
            : 136 === n
            ? (a = this.clearWindows(a, s))
            : 140 === n
            ? (a = this.deleteWindows(a, s))
            : 137 === n
            ? (a = this.displayWindows(a, s))
            : 138 === n
            ? (a = this.hideWindows(a, s))
            : 139 === n
            ? (a = this.toggleWindows(a, s))
            : 151 === n
            ? (a = this.setWindowAttributes(a, s))
            : 144 === n
            ? (a = this.setPenAttributes(a, s))
            : 145 === n
            ? (a = this.setPenColor(a, s))
            : 146 === n
            ? (a = this.setPenLocation(a, s))
            : 143 === n
            ? (s = this.reset(a, s))
            : 8 === n
            ? s.currentWindow.backspace()
            : 12 === n
            ? s.currentWindow.clearText()
            : 13 === n
            ? (s.currentWindow.pendingNewLine = !0)
            : 14 === n
            ? s.currentWindow.clearText()
            : 141 === n && a++;
    }),
    (ge.prototype.extendedCommands = function (t, e) {
      var i = this.current708Packet.data[++t];
      return le(i) && (t = this.handleText(t, e, { isExtended: !0 })), t;
    }),
    (ge.prototype.getPts = function (t) {
      return this.current708Packet.ptsVals[Math.floor(t / 2)];
    }),
    (ge.prototype.initService = function (t, e) {
      var i,
        n,
        a = this;
      return (
        (i = "SERVICE" + t) in this.serviceEncodings && (n = this.serviceEncodings[i]),
        (this.services[t] = new fe(t, n, a)),
        this.services[t].init(this.getPts(e), function (e) {
          a.flushDisplayed(e, a.services[t]);
        }),
        this.services[t]
      );
    }),
    (ge.prototype.handleText = function (t, e, i) {
      var n,
        a,
        r,
        s,
        o = i && i.isExtended,
        d = i && i.isMultiByte,
        h = this.current708Packet.data,
        p = o ? 4096 : 0,
        u = h[t],
        l = h[t + 1],
        c = e.currentWindow;
      return (
        e.textDecoder_ && !o
          ? (d ? ((a = [u, l]), t++) : (a = [u]), (n = e.textDecoder_.decode(new Uint8Array(a))))
          : ((s = ue[(r = p | u)] || r), (n = 4096 & r && r === s ? "" : String.fromCharCode(s))),
        c.pendingNewLine && !c.isEmpty() && c.newLine(this.getPts(t)),
        (c.pendingNewLine = !1),
        c.addText(n),
        t
      );
    }),
    (ge.prototype.multiByteCharacter = function (t, e) {
      var i = this.current708Packet.data,
        n = i[t + 1],
        a = i[t + 2];
      return le(n) && le(a) && (t = this.handleText(++t, e, { isMultiByte: !0 })), t;
    }),
    (ge.prototype.setCurrentWindow = function (t, e) {
      var i = 7 & this.current708Packet.data[t];
      return e.setCurrentWindow(i), t;
    }),
    (ge.prototype.defineWindow = function (t, e) {
      var i = this.current708Packet.data,
        n = i[t],
        a = 7 & n;
      e.setCurrentWindow(a);
      var r = e.currentWindow;
      return (
        (n = i[++t]),
        (r.visible = (32 & n) >> 5),
        (r.rowLock = (16 & n) >> 4),
        (r.columnLock = (8 & n) >> 3),
        (r.priority = 7 & n),
        (n = i[++t]),
        (r.relativePositioning = (128 & n) >> 7),
        (r.anchorVertical = 127 & n),
        (n = i[++t]),
        (r.anchorHorizontal = n),
        (n = i[++t]),
        (r.anchorPoint = (240 & n) >> 4),
        (r.rowCount = 15 & n),
        (n = i[++t]),
        (r.columnCount = 63 & n),
        (n = i[++t]),
        (r.windowStyle = (56 & n) >> 3),
        (r.penStyle = 7 & n),
        (r.virtualRowCount = r.rowCount + 1),
        t
      );
    }),
    (ge.prototype.setWindowAttributes = function (t, e) {
      var i = this.current708Packet.data,
        n = i[t],
        a = e.currentWindow.winAttr;
      return (
        (n = i[++t]),
        (a.fillOpacity = (192 & n) >> 6),
        (a.fillRed = (48 & n) >> 4),
        (a.fillGreen = (12 & n) >> 2),
        (a.fillBlue = 3 & n),
        (n = i[++t]),
        (a.borderType = (192 & n) >> 6),
        (a.borderRed = (48 & n) >> 4),
        (a.borderGreen = (12 & n) >> 2),
        (a.borderBlue = 3 & n),
        (n = i[++t]),
        (a.borderType += (128 & n) >> 5),
        (a.wordWrap = (64 & n) >> 6),
        (a.printDirection = (48 & n) >> 4),
        (a.scrollDirection = (12 & n) >> 2),
        (a.justify = 3 & n),
        (n = i[++t]),
        (a.effectSpeed = (240 & n) >> 4),
        (a.effectDirection = (12 & n) >> 2),
        (a.displayEffect = 3 & n),
        t
      );
    }),
    (ge.prototype.flushDisplayed = function (t, e) {
      for (var i = [], n = 0; n < 8; n++)
        e.windows[n].visible && !e.windows[n].isEmpty() && i.push(e.windows[n].getText());
      (e.endPts = t), (e.text = i.join("\n\n")), this.pushCaption(e), (e.startPts = t);
    }),
    (ge.prototype.pushCaption = function (t) {
      "" !== t.text &&
        (this.trigger("data", {
          startPts: t.startPts,
          endPts: t.endPts,
          text: t.text,
          stream: "cc708_" + t.serviceNum,
        }),
        (t.text = ""),
        (t.startPts = t.endPts));
    }),
    (ge.prototype.displayWindows = function (t, e) {
      var i = this.current708Packet.data[++t],
        n = this.getPts(t);
      this.flushDisplayed(n, e);
      for (var a = 0; a < 8; a++) i & (1 << a) && (e.windows[a].visible = 1);
      return t;
    }),
    (ge.prototype.hideWindows = function (t, e) {
      var i = this.current708Packet.data[++t],
        n = this.getPts(t);
      this.flushDisplayed(n, e);
      for (var a = 0; a < 8; a++) i & (1 << a) && (e.windows[a].visible = 0);
      return t;
    }),
    (ge.prototype.toggleWindows = function (t, e) {
      var i = this.current708Packet.data[++t],
        n = this.getPts(t);
      this.flushDisplayed(n, e);
      for (var a = 0; a < 8; a++) i & (1 << a) && (e.windows[a].visible ^= 1);
      return t;
    }),
    (ge.prototype.clearWindows = function (t, e) {
      var i = this.current708Packet.data[++t],
        n = this.getPts(t);
      this.flushDisplayed(n, e);
      for (var a = 0; a < 8; a++) i & (1 << a) && e.windows[a].clearText();
      return t;
    }),
    (ge.prototype.deleteWindows = function (t, e) {
      var i = this.current708Packet.data[++t],
        n = this.getPts(t);
      this.flushDisplayed(n, e);
      for (var a = 0; a < 8; a++) i & (1 << a) && e.windows[a].reset();
      return t;
    }),
    (ge.prototype.setPenAttributes = function (t, e) {
      var i = this.current708Packet.data,
        n = i[t],
        a = e.currentWindow.penAttr;
      return (
        (n = i[++t]),
        (a.textTag = (240 & n) >> 4),
        (a.offset = (12 & n) >> 2),
        (a.penSize = 3 & n),
        (n = i[++t]),
        (a.italics = (128 & n) >> 7),
        (a.underline = (64 & n) >> 6),
        (a.edgeType = (56 & n) >> 3),
        (a.fontStyle = 7 & n),
        t
      );
    }),
    (ge.prototype.setPenColor = function (t, e) {
      var i = this.current708Packet.data,
        n = i[t],
        a = e.currentWindow.penColor;
      return (
        (n = i[++t]),
        (a.fgOpacity = (192 & n) >> 6),
        (a.fgRed = (48 & n) >> 4),
        (a.fgGreen = (12 & n) >> 2),
        (a.fgBlue = 3 & n),
        (n = i[++t]),
        (a.bgOpacity = (192 & n) >> 6),
        (a.bgRed = (48 & n) >> 4),
        (a.bgGreen = (12 & n) >> 2),
        (a.bgBlue = 3 & n),
        (n = i[++t]),
        (a.edgeRed = (48 & n) >> 4),
        (a.edgeGreen = (12 & n) >> 2),
        (a.edgeBlue = 3 & n),
        t
      );
    }),
    (ge.prototype.setPenLocation = function (t, e) {
      var i = this.current708Packet.data,
        n = i[t],
        a = e.currentWindow.penLoc;
      return (
        (e.currentWindow.pendingNewLine = !0), (n = i[++t]), (a.row = 15 & n), (n = i[++t]), (a.column = 63 & n), t
      );
    }),
    (ge.prototype.reset = function (t, e) {
      var i = this.getPts(t);
      return this.flushDisplayed(i, e), this.initService(e.serviceNum, t);
    });
  var me = {
      42: 225,
      92: 233,
      94: 237,
      95: 243,
      96: 250,
      123: 231,
      124: 247,
      125: 209,
      126: 241,
      127: 9608,
      304: 174,
      305: 176,
      306: 189,
      307: 191,
      308: 8482,
      309: 162,
      310: 163,
      311: 9834,
      312: 224,
      313: 160,
      314: 232,
      315: 226,
      316: 234,
      317: 238,
      318: 244,
      319: 251,
      544: 193,
      545: 201,
      546: 211,
      547: 218,
      548: 220,
      549: 252,
      550: 8216,
      551: 161,
      552: 42,
      553: 39,
      554: 8212,
      555: 169,
      556: 8480,
      557: 8226,
      558: 8220,
      559: 8221,
      560: 192,
      561: 194,
      562: 199,
      563: 200,
      564: 202,
      565: 203,
      566: 235,
      567: 206,
      568: 207,
      569: 239,
      570: 212,
      571: 217,
      572: 249,
      573: 219,
      574: 171,
      575: 187,
      800: 195,
      801: 227,
      802: 205,
      803: 204,
      804: 236,
      805: 210,
      806: 242,
      807: 213,
      808: 245,
      809: 123,
      810: 125,
      811: 92,
      812: 94,
      813: 95,
      814: 124,
      815: 126,
      816: 196,
      817: 228,
      818: 214,
      819: 246,
      820: 223,
      821: 165,
      822: 164,
      823: 9474,
      824: 197,
      825: 229,
      826: 216,
      827: 248,
      828: 9484,
      829: 9488,
      830: 9492,
      831: 9496,
    },
    ye = function (t) {
      return null === t ? "" : ((t = me[t] || t), String.fromCharCode(t));
    },
    be = [4352, 4384, 4608, 4640, 5376, 5408, 5632, 5664, 5888, 5920, 4096, 4864, 4896, 5120, 5152],
    ve = function () {
      for (var t = [], e = 15; e--; ) t.push("");
      return t;
    },
    Se = function t(e, i) {
      t.prototype.init.call(this),
        (this.field_ = e || 0),
        (this.dataChannel_ = i || 0),
        (this.name_ = "CC" + (1 + ((this.field_ << 1) | this.dataChannel_))),
        this.setConstants(),
        this.reset(),
        (this.push = function (t) {
          var e, i, n, a, r;
          if ((e = 32639 & t.ccData) !== this.lastControlCode_) {
            if (
              (4096 == (61440 & e)
                ? (this.lastControlCode_ = e)
                : e !== this.PADDING_ && (this.lastControlCode_ = null),
              (n = e >>> 8),
              (a = 255 & e),
              e !== this.PADDING_)
            )
              if (e === this.RESUME_CAPTION_LOADING_) this.mode_ = "popOn";
              else if (e === this.END_OF_CAPTION_)
                (this.mode_ = "popOn"),
                  this.clearFormatting(t.pts),
                  this.flushDisplayed(t.pts),
                  (i = this.displayed_),
                  (this.displayed_ = this.nonDisplayed_),
                  (this.nonDisplayed_ = i),
                  (this.startPts_ = t.pts);
              else if (e === this.ROLL_UP_2_ROWS_) (this.rollUpRows_ = 2), this.setRollUp(t.pts);
              else if (e === this.ROLL_UP_3_ROWS_) (this.rollUpRows_ = 3), this.setRollUp(t.pts);
              else if (e === this.ROLL_UP_4_ROWS_) (this.rollUpRows_ = 4), this.setRollUp(t.pts);
              else if (e === this.CARRIAGE_RETURN_)
                this.clearFormatting(t.pts), this.flushDisplayed(t.pts), this.shiftRowsUp_(), (this.startPts_ = t.pts);
              else if (e === this.BACKSPACE_)
                "popOn" === this.mode_
                  ? (this.nonDisplayed_[this.row_] = this.nonDisplayed_[this.row_].slice(0, -1))
                  : (this.displayed_[this.row_] = this.displayed_[this.row_].slice(0, -1));
              else if (e === this.ERASE_DISPLAYED_MEMORY_) this.flushDisplayed(t.pts), (this.displayed_ = ve());
              else if (e === this.ERASE_NON_DISPLAYED_MEMORY_) this.nonDisplayed_ = ve();
              else if (e === this.RESUME_DIRECT_CAPTIONING_)
                "paintOn" !== this.mode_ && (this.flushDisplayed(t.pts), (this.displayed_ = ve())),
                  (this.mode_ = "paintOn"),
                  (this.startPts_ = t.pts);
              else if (this.isSpecialCharacter(n, a))
                (r = ye((n = (3 & n) << 8) | a)), this[this.mode_](t.pts, r), this.column_++;
              else if (this.isExtCharacter(n, a))
                "popOn" === this.mode_
                  ? (this.nonDisplayed_[this.row_] = this.nonDisplayed_[this.row_].slice(0, -1))
                  : (this.displayed_[this.row_] = this.displayed_[this.row_].slice(0, -1)),
                  (r = ye((n = (3 & n) << 8) | a)),
                  this[this.mode_](t.pts, r),
                  this.column_++;
              else if (this.isMidRowCode(n, a))
                this.clearFormatting(t.pts),
                  this[this.mode_](t.pts, " "),
                  this.column_++,
                  14 == (14 & a) && this.addFormatting(t.pts, ["i"]),
                  1 == (1 & a) && this.addFormatting(t.pts, ["u"]);
              else if (this.isOffsetControlCode(n, a)) this.column_ += 3 & a;
              else if (this.isPAC(n, a)) {
                var s = be.indexOf(7968 & e);
                "rollUp" === this.mode_ &&
                  (s - this.rollUpRows_ + 1 < 0 && (s = this.rollUpRows_ - 1), this.setRollUp(t.pts, s)),
                  s !== this.row_ && (this.clearFormatting(t.pts), (this.row_ = s)),
                  1 & a && -1 === this.formatting_.indexOf("u") && this.addFormatting(t.pts, ["u"]),
                  16 == (16 & e) && (this.column_ = 4 * ((14 & e) >> 1)),
                  this.isColorPAC(a) && 14 == (14 & a) && this.addFormatting(t.pts, ["i"]);
              } else
                this.isNormalChar(n) &&
                  (0 === a && (a = null),
                  (r = ye(n)),
                  (r += ye(a)),
                  this[this.mode_](t.pts, r),
                  (this.column_ += r.length));
          } else this.lastControlCode_ = null;
        });
    };
  (Se.prototype = new u()),
    (Se.prototype.flushDisplayed = function (t) {
      var e = this.displayed_
        .map(function (t, e) {
          try {
            return t.trim();
          } catch (t) {
            return (
              this.trigger("log", { level: "warn", message: "Skipping a malformed 608 caption at index " + e + "." }),
              ""
            );
          }
        }, this)
        .join("\n")
        .replace(/^\n+|\n+$/g, "");
      e.length && this.trigger("data", { startPts: this.startPts_, endPts: t, text: e, stream: this.name_ });
    }),
    (Se.prototype.reset = function () {
      (this.mode_ = "popOn"),
        (this.topRow_ = 0),
        (this.startPts_ = 0),
        (this.displayed_ = ve()),
        (this.nonDisplayed_ = ve()),
        (this.lastControlCode_ = null),
        (this.column_ = 0),
        (this.row_ = 14),
        (this.rollUpRows_ = 2),
        (this.formatting_ = []);
    }),
    (Se.prototype.setConstants = function () {
      0 === this.dataChannel_
        ? ((this.BASE_ = 16), (this.EXT_ = 17), (this.CONTROL_ = (20 | this.field_) << 8), (this.OFFSET_ = 23))
        : 1 === this.dataChannel_ &&
          ((this.BASE_ = 24), (this.EXT_ = 25), (this.CONTROL_ = (28 | this.field_) << 8), (this.OFFSET_ = 31)),
        (this.PADDING_ = 0),
        (this.RESUME_CAPTION_LOADING_ = 32 | this.CONTROL_),
        (this.END_OF_CAPTION_ = 47 | this.CONTROL_),
        (this.ROLL_UP_2_ROWS_ = 37 | this.CONTROL_),
        (this.ROLL_UP_3_ROWS_ = 38 | this.CONTROL_),
        (this.ROLL_UP_4_ROWS_ = 39 | this.CONTROL_),
        (this.CARRIAGE_RETURN_ = 45 | this.CONTROL_),
        (this.RESUME_DIRECT_CAPTIONING_ = 41 | this.CONTROL_),
        (this.BACKSPACE_ = 33 | this.CONTROL_),
        (this.ERASE_DISPLAYED_MEMORY_ = 44 | this.CONTROL_),
        (this.ERASE_NON_DISPLAYED_MEMORY_ = 46 | this.CONTROL_);
    }),
    (Se.prototype.isSpecialCharacter = function (t, e) {
      return t === this.EXT_ && e >= 48 && e <= 63;
    }),
    (Se.prototype.isExtCharacter = function (t, e) {
      return (t === this.EXT_ + 1 || t === this.EXT_ + 2) && e >= 32 && e <= 63;
    }),
    (Se.prototype.isMidRowCode = function (t, e) {
      return t === this.EXT_ && e >= 32 && e <= 47;
    }),
    (Se.prototype.isOffsetControlCode = function (t, e) {
      return t === this.OFFSET_ && e >= 33 && e <= 35;
    }),
    (Se.prototype.isPAC = function (t, e) {
      return t >= this.BASE_ && t < this.BASE_ + 8 && e >= 64 && e <= 127;
    }),
    (Se.prototype.isColorPAC = function (t) {
      return (t >= 64 && t <= 79) || (t >= 96 && t <= 127);
    }),
    (Se.prototype.isNormalChar = function (t) {
      return t >= 32 && t <= 127;
    }),
    (Se.prototype.setRollUp = function (t, e) {
      if (
        ("rollUp" !== this.mode_ &&
          ((this.row_ = 14),
          (this.mode_ = "rollUp"),
          this.flushDisplayed(t),
          (this.nonDisplayed_ = ve()),
          (this.displayed_ = ve())),
        void 0 !== e && e !== this.row_)
      )
        for (var i = 0; i < this.rollUpRows_; i++)
          (this.displayed_[e - i] = this.displayed_[this.row_ - i]), (this.displayed_[this.row_ - i] = "");
      void 0 === e && (e = this.row_), (this.topRow_ = e - this.rollUpRows_ + 1);
    }),
    (Se.prototype.addFormatting = function (t, e) {
      this.formatting_ = this.formatting_.concat(e);
      var i = e.reduce(function (t, e) {
        return t + "<" + e + ">";
      }, "");
      this[this.mode_](t, i);
    }),
    (Se.prototype.clearFormatting = function (t) {
      if (this.formatting_.length) {
        var e = this.formatting_.reverse().reduce(function (t, e) {
          return t + "</" + e + ">";
        }, "");
        (this.formatting_ = []), this[this.mode_](t, e);
      }
    }),
    (Se.prototype.popOn = function (t, e) {
      var i = this.nonDisplayed_[this.row_];
      (i += e), (this.nonDisplayed_[this.row_] = i);
    }),
    (Se.prototype.rollUp = function (t, e) {
      var i = this.displayed_[this.row_];
      (i += e), (this.displayed_[this.row_] = i);
    }),
    (Se.prototype.shiftRowsUp_ = function () {
      var t;
      for (t = 0; t < this.topRow_; t++) this.displayed_[t] = "";
      for (t = this.row_ + 1; t < 15; t++) this.displayed_[t] = "";
      for (t = this.topRow_; t < this.row_; t++) this.displayed_[t] = this.displayed_[t + 1];
      this.displayed_[this.row_] = "";
    }),
    (Se.prototype.paintOn = function (t, e) {
      var i = this.displayed_[this.row_];
      (i += e), (this.displayed_[this.row_] = i);
    });
  var Te = { CaptionStream: pe, Cea608Stream: Se, Cea708Stream: ge },
    we = { H264_STREAM_TYPE: 27, ADTS_STREAM_TYPE: 15, METADATA_STREAM_TYPE: 21 },
    _e = "shared",
    ke = function (t, e) {
      var i = 1;
      for (t > e && (i = -1); Math.abs(e - t) > 4294967296; ) t += 8589934592 * i;
      return t;
    },
    Ue = function t(e) {
      var i, n;
      t.prototype.init.call(this),
        (this.type_ = e || _e),
        (this.push = function (t) {
          (this.type_ !== _e && t.type !== this.type_) ||
            (void 0 === n && (n = t.dts),
            (t.dts = ke(t.dts, n)),
            (t.pts = ke(t.pts, n)),
            (i = t.dts),
            this.trigger("data", t));
        }),
        (this.flush = function () {
          (n = i), this.trigger("done");
        }),
        (this.endTimeline = function () {
          this.flush(), this.trigger("endedtimeline");
        }),
        (this.discontinuity = function () {
          (n = void 0), (i = void 0);
        }),
        (this.reset = function () {
          this.discontinuity(), this.trigger("reset");
        });
    };
  Ue.prototype = new u();
  var Ae,
    De = Ue,
    Ce = ke,
    Pe = function (t, e, i) {
      if (!t) return -1;
      for (var n = i; n < t.length; n++) if (t[n] === e) return n;
      return -1;
    },
    Le = 3,
    Ie = function (t, e, i) {
      var n,
        a = "";
      for (n = e; n < i; n++) a += "%" + ("00" + t[n].toString(16)).slice(-2);
      return a;
    },
    Oe = function (t, e, i) {
      return decodeURIComponent(Ie(t, e, i));
    },
    xe = function (t, e, i) {
      return unescape(Ie(t, e, i));
    },
    Ee = function (t) {
      return (t[0] << 21) | (t[1] << 14) | (t[2] << 7) | t[3];
    },
    Me = {
      APIC: function (t) {
        var e,
          i,
          n = 1;
        t.data[0] === Le &&
          ((e = Pe(t.data, 0, n)) < 0 ||
            ((t.mimeType = xe(t.data, n, e)),
            (n = e + 1),
            (t.pictureType = t.data[n]),
            n++,
            (i = Pe(t.data, 0, n)) < 0 ||
              ((t.description = Oe(t.data, n, i)),
              (n = i + 1),
              "--\x3e" === t.mimeType
                ? (t.url = xe(t.data, n, t.data.length))
                : (t.pictureData = t.data.subarray(n, t.data.length)))));
      },
      "T*": function (t) {
        t.data[0] === Le &&
          ((t.value = Oe(t.data, 1, t.data.length).replace(/\0*$/, "")), (t.values = t.value.split("\0")));
      },
      TXXX: function (t) {
        var e;
        t.data[0] === Le &&
          -1 !== (e = Pe(t.data, 0, 1)) &&
          ((t.description = Oe(t.data, 1, e)),
          (t.value = Oe(t.data, e + 1, t.data.length).replace(/\0*$/, "")),
          (t.data = t.value));
      },
      "W*": function (t) {
        t.url = xe(t.data, 0, t.data.length).replace(/\0.*$/, "");
      },
      WXXX: function (t) {
        var e;
        t.data[0] === Le &&
          -1 !== (e = Pe(t.data, 0, 1)) &&
          ((t.description = Oe(t.data, 1, e)), (t.url = xe(t.data, e + 1, t.data.length).replace(/\0.*$/, "")));
      },
      PRIV: function (t) {
        var e;
        for (e = 0; e < t.data.length; e++)
          if (0 === t.data[e]) {
            t.owner = xe(t.data, 0, e);
            break;
          }
        (t.privateData = t.data.subarray(e + 1)), (t.data = t.privateData);
      },
    };
  (Ae = function (t) {
    var e,
      i = { descriptor: t && t.descriptor },
      n = 0,
      a = [],
      r = 0;
    if ((Ae.prototype.init.call(this), (this.dispatchType = we.METADATA_STREAM_TYPE.toString(16)), i.descriptor))
      for (e = 0; e < i.descriptor.length; e++) this.dispatchType += ("00" + i.descriptor[e].toString(16)).slice(-2);
    this.push = function (t) {
      var e, i, s, o, d;
      if ("timed-metadata" === t.type)
        if (
          (t.dataAlignmentIndicator && ((r = 0), (a.length = 0)),
          0 === a.length &&
            (t.data.length < 10 ||
              t.data[0] !== "I".charCodeAt(0) ||
              t.data[1] !== "D".charCodeAt(0) ||
              t.data[2] !== "3".charCodeAt(0)))
        )
          this.trigger("log", { level: "warn", message: "Skipping unrecognized metadata packet" });
        else if (
          (a.push(t),
          (r += t.data.byteLength),
          1 === a.length && ((n = Ee(t.data.subarray(6, 10))), (n += 10)),
          !(r < n))
        ) {
          for (e = { data: new Uint8Array(n), frames: [], pts: a[0].pts, dts: a[0].dts }, d = 0; d < n; )
            e.data.set(a[0].data.subarray(0, n - d), d),
              (d += a[0].data.byteLength),
              (r -= a[0].data.byteLength),
              a.shift();
          (i = 10),
            64 & e.data[5] && ((i += 4), (i += Ee(e.data.subarray(10, 14))), (n -= Ee(e.data.subarray(16, 20))));
          do {
            if ((s = Ee(e.data.subarray(i + 4, i + 8))) < 1) {
              this.trigger("log", {
                level: "warn",
                message: "Malformed ID3 frame encountered. Skipping remaining metadata parsing.",
              });
              break;
            }
            if (
              (((o = {
                id: String.fromCharCode(e.data[i], e.data[i + 1], e.data[i + 2], e.data[i + 3]),
                data: e.data.subarray(i + 10, i + s + 10),
              }).key = o.id),
              Me[o.id] ? Me[o.id](o) : "T" === o.id[0] ? Me["T*"](o) : "W" === o.id[0] && Me["W*"](o),
              "com.apple.streaming.transportStreamTimestamp" === o.owner)
            ) {
              var h = o.data,
                p = ((1 & h[3]) << 30) | (h[4] << 22) | (h[5] << 14) | (h[6] << 6) | (h[7] >>> 2);
              (p *= 4),
                (p += 3 & h[7]),
                (o.timeStamp = p),
                void 0 === e.pts && void 0 === e.dts && ((e.pts = o.timeStamp), (e.dts = o.timeStamp)),
                this.trigger("timestamp", o);
            }
            e.frames.push(o), (i += 10), (i += s);
          } while (i < n);
          this.trigger("data", e);
        }
    };
  }).prototype = new u();
  var Re,
    Be,
    Ne,
    Fe = Ae,
    ze = De,
    Ve = 188;
  ((Re = function () {
    var t = new Uint8Array(Ve),
      e = 0;
    Re.prototype.init.call(this),
      (this.push = function (i) {
        var n,
          a = 0,
          r = Ve;
        for (
          e ? ((n = new Uint8Array(i.byteLength + e)).set(t.subarray(0, e)), n.set(i, e), (e = 0)) : (n = i);
          r < n.byteLength;

        )
          71 !== n[a] || 71 !== n[r] ? (a++, r++) : (this.trigger("data", n.subarray(a, r)), (a += Ve), (r += Ve));
        a < n.byteLength && (t.set(n.subarray(a), 0), (e = n.byteLength - a));
      }),
      (this.flush = function () {
        e === Ve && 71 === t[0] && (this.trigger("data", t), (e = 0)), this.trigger("done");
      }),
      (this.endTimeline = function () {
        this.flush(), this.trigger("endedtimeline");
      }),
      (this.reset = function () {
        (e = 0), this.trigger("reset");
      });
  }).prototype = new u()),
    ((Be = function () {
      var t, e, i, n;
      Be.prototype.init.call(this),
        (n = this),
        (this.packetsWaitingForPmt = []),
        (this.programMapTable = void 0),
        (t = function (t, n) {
          var a = 0;
          n.payloadUnitStartIndicator && (a += t[a] + 1), "pat" === n.type ? e(t.subarray(a), n) : i(t.subarray(a), n);
        }),
        (e = function (t, e) {
          (e.section_number = t[7]),
            (e.last_section_number = t[8]),
            (n.pmtPid = ((31 & t[10]) << 8) | t[11]),
            (e.pmtPid = n.pmtPid);
        }),
        (i = function (t, e) {
          var i, a;
          if (1 & t[5]) {
            for (
              n.programMapTable = { video: null, audio: null, "timed-metadata": {} },
                i = 3 + (((15 & t[1]) << 8) | t[2]) - 4,
                a = 12 + (((15 & t[10]) << 8) | t[11]);
              a < i;

            ) {
              var r = t[a],
                s = ((31 & t[a + 1]) << 8) | t[a + 2];
              r === we.H264_STREAM_TYPE && null === n.programMapTable.video
                ? (n.programMapTable.video = s)
                : r === we.ADTS_STREAM_TYPE && null === n.programMapTable.audio
                ? (n.programMapTable.audio = s)
                : r === we.METADATA_STREAM_TYPE && (n.programMapTable["timed-metadata"][s] = r),
                (a += 5 + (((15 & t[a + 3]) << 8) | t[a + 4]));
            }
            e.programMapTable = n.programMapTable;
          }
        }),
        (this.push = function (e) {
          var i = {},
            n = 4;
          if (
            ((i.payloadUnitStartIndicator = !!(64 & e[1])),
            (i.pid = 31 & e[1]),
            (i.pid <<= 8),
            (i.pid |= e[2]),
            (48 & e[3]) >>> 4 > 1 && (n += e[n] + 1),
            0 === i.pid)
          )
            (i.type = "pat"), t(e.subarray(n), i), this.trigger("data", i);
          else if (i.pid === this.pmtPid)
            for (i.type = "pmt", t(e.subarray(n), i), this.trigger("data", i); this.packetsWaitingForPmt.length; )
              this.processPes_.apply(this, this.packetsWaitingForPmt.shift());
          else void 0 === this.programMapTable ? this.packetsWaitingForPmt.push([e, n, i]) : this.processPes_(e, n, i);
        }),
        (this.processPes_ = function (t, e, i) {
          i.pid === this.programMapTable.video
            ? (i.streamType = we.H264_STREAM_TYPE)
            : i.pid === this.programMapTable.audio
            ? (i.streamType = we.ADTS_STREAM_TYPE)
            : (i.streamType = this.programMapTable["timed-metadata"][i.pid]),
            (i.type = "pes"),
            (i.data = t.subarray(e)),
            this.trigger("data", i);
        });
    }).prototype = new u()),
    (Be.STREAM_TYPES = { h264: 27, adts: 15 }),
    ((Ne = function () {
      var t,
        e = this,
        i = !1,
        n = { data: [], size: 0 },
        a = { data: [], size: 0 },
        r = { data: [], size: 0 },
        s = function (t, i, n) {
          var a,
            r,
            s = new Uint8Array(t.size),
            o = { type: i },
            d = 0,
            h = 0;
          if (t.data.length && !(t.size < 9)) {
            for (o.trackId = t.data[0].pid, d = 0; d < t.data.length; d++)
              (r = t.data[d]), s.set(r.data, h), (h += r.data.byteLength);
            var p, u, l, c;
            (u = o),
              (c = ((p = s)[0] << 16) | (p[1] << 8) | p[2]),
              (u.data = new Uint8Array()),
              1 === c &&
                ((u.packetLength = 6 + ((p[4] << 8) | p[5])),
                (u.dataAlignmentIndicator = 0 != (4 & p[6])),
                192 & (l = p[7]) &&
                  ((u.pts =
                    ((14 & p[9]) << 27) |
                    ((255 & p[10]) << 20) |
                    ((254 & p[11]) << 12) |
                    ((255 & p[12]) << 5) |
                    ((254 & p[13]) >>> 3)),
                  (u.pts *= 4),
                  (u.pts += (6 & p[13]) >>> 1),
                  (u.dts = u.pts),
                  64 & l &&
                    ((u.dts =
                      ((14 & p[14]) << 27) |
                      ((255 & p[15]) << 20) |
                      ((254 & p[16]) << 12) |
                      ((255 & p[17]) << 5) |
                      ((254 & p[18]) >>> 3)),
                    (u.dts *= 4),
                    (u.dts += (6 & p[18]) >>> 1))),
                (u.data = p.subarray(9 + p[8]))),
              (a = "video" === i || o.packetLength <= t.size),
              (n || a) && ((t.size = 0), (t.data.length = 0)),
              a && e.trigger("data", o);
          }
        };
      Ne.prototype.init.call(this),
        (this.push = function (o) {
          ({
            pat: function () {},
            pes: function () {
              var t, e;
              switch (o.streamType) {
                case we.H264_STREAM_TYPE:
                  (t = n), (e = "video");
                  break;
                case we.ADTS_STREAM_TYPE:
                  (t = a), (e = "audio");
                  break;
                case we.METADATA_STREAM_TYPE:
                  (t = r), (e = "timed-metadata");
                  break;
                default:
                  return;
              }
              o.payloadUnitStartIndicator && s(t, e, !0), t.data.push(o), (t.size += o.data.byteLength);
            },
            pmt: function () {
              var n = { type: "metadata", tracks: [] };
              null !== (t = o.programMapTable).video &&
                n.tracks.push({
                  timelineStartInfo: { baseMediaDecodeTime: 0 },
                  id: +t.video,
                  codec: "avc",
                  type: "video",
                }),
                null !== t.audio &&
                  n.tracks.push({
                    timelineStartInfo: { baseMediaDecodeTime: 0 },
                    id: +t.audio,
                    codec: "adts",
                    type: "audio",
                  }),
                (i = !0),
                e.trigger("data", n);
            },
          }[o.type]());
        }),
        (this.reset = function () {
          (n.size = 0), (n.data.length = 0), (a.size = 0), (a.data.length = 0), this.trigger("reset");
        }),
        (this.flushStreams_ = function () {
          s(n, "video"), s(a, "audio"), s(r, "timed-metadata");
        }),
        (this.flush = function () {
          if (!i && t) {
            var n = { type: "metadata", tracks: [] };
            null !== t.video &&
              n.tracks.push({
                timelineStartInfo: { baseMediaDecodeTime: 0 },
                id: +t.video,
                codec: "avc",
                type: "video",
              }),
              null !== t.audio &&
                n.tracks.push({
                  timelineStartInfo: { baseMediaDecodeTime: 0 },
                  id: +t.audio,
                  codec: "adts",
                  type: "audio",
                }),
              e.trigger("data", n);
          }
          (i = !1), this.flushStreams_(), this.trigger("done");
        });
    }).prototype = new u());
  var Ge = {
    PAT_PID: 0,
    MP2T_PACKET_LENGTH: Ve,
    TransportPacketStream: Re,
    TransportParseStream: Be,
    ElementaryStream: Ne,
    TimestampRolloverStream: ze,
    CaptionStream: Te.CaptionStream,
    Cea608Stream: Te.Cea608Stream,
    Cea708Stream: Te.Cea708Stream,
    MetadataStream: Fe,
  };
  for (var We in we) we.hasOwnProperty(We) && (Ge[We] = we[We]);
  var je,
    qe = Ge,
    Ye = [96e3, 88200, 64e3, 48e3, 44100, 32e3, 24e3, 22050, 16e3, 12e3, 11025, 8e3, 7350],
    He = function (t, e) {
      var i = (t[e + 6] << 21) | (t[e + 7] << 14) | (t[e + 8] << 7) | t[e + 9];
      return (i = i >= 0 ? i : 0), (16 & t[e + 5]) >> 4 ? i + 20 : i + 10;
    },
    Xe = function t(e, i) {
      return e.length - i < 10 ||
        e[i] !== "I".charCodeAt(0) ||
        e[i + 1] !== "D".charCodeAt(0) ||
        e[i + 2] !== "3".charCodeAt(0)
        ? i
        : t(e, (i += He(e, i)));
    },
    Ke = function (t) {
      return (t[0] << 21) | (t[1] << 14) | (t[2] << 7) | t[3];
    },
    $e = {
      isLikelyAacData: function (t) {
        var e = Xe(t, 0);
        return t.length >= e + 2 && 255 == (255 & t[e]) && 240 == (240 & t[e + 1]) && 16 == (22 & t[e + 1]);
      },
      parseId3TagSize: He,
      parseAdtsSize: function (t, e) {
        var i = (224 & t[e + 5]) >> 5,
          n = t[e + 4] << 3;
        return (6144 & t[e + 3]) | n | i;
      },
      parseType: function (t, e) {
        return t[e] === "I".charCodeAt(0) && t[e + 1] === "D".charCodeAt(0) && t[e + 2] === "3".charCodeAt(0)
          ? "timed-metadata"
          : !0 & t[e] && 240 == (240 & t[e + 1])
          ? "audio"
          : null;
      },
      parseSampleRate: function (t) {
        for (var e = 0; e + 5 < t.length; ) {
          if (255 === t[e] && 240 == (246 & t[e + 1])) return Ye[(60 & t[e + 2]) >>> 2];
          e++;
        }
        return null;
      },
      parseAacTimestamp: function (t) {
        var e, i, n;
        (e = 10), 64 & t[5] && ((e += 4), (e += Ke(t.subarray(10, 14))));
        do {
          if ((i = Ke(t.subarray(e + 4, e + 8))) < 1) return null;
          if ("PRIV" === String.fromCharCode(t[e], t[e + 1], t[e + 2], t[e + 3])) {
            n = t.subarray(e + 10, e + i + 10);
            for (var a = 0; a < n.byteLength; a++)
              if (0 === n[a]) {
                if (
                  "com.apple.streaming.transportStreamTimestamp" ===
                  unescape(
                    (function (t, e, i) {
                      var n,
                        a = "";
                      for (n = e; n < i; n++) a += "%" + ("00" + t[n].toString(16)).slice(-2);
                      return a;
                    })(n, 0, a)
                  )
                ) {
                  var r = n.subarray(a + 1),
                    s = ((1 & r[3]) << 30) | (r[4] << 22) | (r[5] << 14) | (r[6] << 6) | (r[7] >>> 2);
                  return (s *= 4), (s += 3 & r[7]);
                }
                break;
              }
          }
          (e += 10), (e += i);
        } while (e < t.byteLength);
        return null;
      },
    };
  (je = function () {
    var t = new Uint8Array(),
      e = 0;
    je.prototype.init.call(this),
      (this.setTimestamp = function (t) {
        e = t;
      }),
      (this.push = function (i) {
        var n,
          a,
          r,
          s,
          o = 0,
          d = 0;
        for (
          t.length
            ? ((s = t.length), (t = new Uint8Array(i.byteLength + s)).set(t.subarray(0, s)), t.set(i, s))
            : (t = i);
          t.length - d >= 3;

        )
          if (t[d] !== "I".charCodeAt(0) || t[d + 1] !== "D".charCodeAt(0) || t[d + 2] !== "3".charCodeAt(0))
            if (255 != (255 & t[d]) || 240 != (240 & t[d + 1])) d++;
            else {
              if (t.length - d < 7) break;
              if (d + (o = $e.parseAdtsSize(t, d)) > t.length) break;
              (r = { type: "audio", data: t.subarray(d, d + o), pts: e, dts: e }), this.trigger("data", r), (d += o);
            }
          else {
            if (t.length - d < 10) break;
            if (d + (o = $e.parseId3TagSize(t, d)) > t.length) break;
            (a = { type: "timed-metadata", data: t.subarray(d, d + o) }), this.trigger("data", a), (d += o);
          }
        (n = t.length - d), (t = n > 0 ? t.subarray(d) : new Uint8Array());
      }),
      (this.reset = function () {
        (t = new Uint8Array()), this.trigger("reset");
      }),
      (this.endTimeline = function () {
        (t = new Uint8Array()), this.trigger("endedtimeline");
      });
  }).prototype = new u();
  var Ze,
    Je,
    Qe,
    ti,
    ei = je,
    ii = ["audioobjecttype", "channelcount", "samplerate", "samplingfrequencyindex", "samplesize"],
    ni = ["width", "height", "profileIdc", "levelIdc", "profileCompatibility", "sarRatio"],
    ai = lt.H264Stream,
    ri = $e.isLikelyAacData,
    si = f,
    oi = function (t, e) {
      (e.stream = t), this.trigger("log", e);
    },
    di = function (t, e) {
      for (var i = Object.keys(e), n = 0; n < i.length; n++) {
        var a = i[n];
        "headOfPipeline" !== a && e[a].on && e[a].on("log", oi.bind(t, a));
      }
    },
    hi = function (t, e) {
      var i;
      if (t.length !== e.length) return !1;
      for (i = 0; i < t.length; i++) if (t[i] !== e[i]) return !1;
      return !0;
    },
    pi = function (t, e, i, n, a, r) {
      return {
        start: { dts: t, pts: t + (i - e) },
        end: { dts: t + (n - e), pts: t + (a - i) },
        prependedContentDuration: r,
        baseMediaDecodeTime: t,
      };
    };
  ((Je = function (t, e) {
    var i,
      n = [],
      a = 0,
      r = 0,
      s = 1 / 0;
    (i = (e = e || {}).firstSequenceNumber || 0),
      Je.prototype.init.call(this),
      (this.push = function (e) {
        ae(t, e),
          t &&
            ii.forEach(function (i) {
              t[i] = e[i];
            }),
          n.push(e);
      }),
      (this.setEarliestDts = function (t) {
        a = t;
      }),
      (this.setVideoBaseMediaDecodeTime = function (t) {
        s = t;
      }),
      (this.setAudioAppendStart = function (t) {
        r = t;
      }),
      (this.flush = function () {
        var o, d, h, p, u, l, c;
        0 !== n.length
          ? ((o = Jt(n, t, a)),
            (t.baseMediaDecodeTime = ne(t, e.keepOriginalTimestamps)),
            (c = Zt(t, o, r, s)),
            (t.samples = Qt(o)),
            (h = _t.mdat(te(o))),
            (n = []),
            (d = _t.moof(i, [t])),
            (p = new Uint8Array(d.byteLength + h.byteLength)),
            i++,
            p.set(d),
            p.set(h, d.byteLength),
            ie(t),
            (u = Math.ceil((1024 * si) / t.samplerate)),
            o.length &&
              ((l = o.length * u),
              this.trigger(
                "segmentTimingInfo",
                pi(m(t.baseMediaDecodeTime, t.samplerate), o[0].dts, o[0].pts, o[0].dts + l, o[0].pts + l, c || 0)
              ),
              this.trigger("timingInfo", { start: o[0].pts, end: o[0].pts + l })),
            this.trigger("data", { track: t, boxes: p }),
            this.trigger("done", "AudioSegmentStream"))
          : this.trigger("done", "AudioSegmentStream");
      }),
      (this.reset = function () {
        ie(t), (n = []), this.trigger("reset");
      });
  }).prototype = new u()),
    ((Ze = function (t, e) {
      var i,
        n,
        a,
        r = [],
        s = [];
      (i = (e = e || {}).firstSequenceNumber || 0),
        Ze.prototype.init.call(this),
        delete t.minPTS,
        (this.gopCache_ = []),
        (this.push = function (e) {
          ae(t, e),
            "seq_parameter_set_rbsp" !== e.nalUnitType ||
              n ||
              ((n = e.config),
              (t.sps = [e.data]),
              ni.forEach(function (e) {
                t[e] = n[e];
              }, this)),
            "pic_parameter_set_rbsp" !== e.nalUnitType || a || ((a = e.data), (t.pps = [e.data])),
            r.push(e);
        }),
        (this.flush = function () {
          for (var n, a, o, d, h, p, u, l, c = 0; r.length && "access_unit_delimiter_rbsp" !== r[0].nalUnitType; )
            r.shift();
          if (0 === r.length) return this.resetStream_(), void this.trigger("done", "VideoSegmentStream");
          if (
            ((n = zt(r)),
            (o = Vt(n))[0][0].keyFrame ||
              ((a = this.getGopForFusion_(r[0], t))
                ? ((c = a.duration),
                  o.unshift(a),
                  (o.byteLength += a.byteLength),
                  (o.nalCount += a.nalCount),
                  (o.pts = a.pts),
                  (o.dts = a.dts),
                  (o.duration += a.duration))
                : (o = Gt(o))),
            s.length)
          ) {
            var f;
            if (!(f = e.alignGopsAtEnd ? this.alignGopsAtEnd_(o) : this.alignGopsAtStart_(o)))
              return (
                this.gopCache_.unshift({ gop: o.pop(), pps: t.pps, sps: t.sps }),
                (this.gopCache_.length = Math.min(6, this.gopCache_.length)),
                (r = []),
                this.resetStream_(),
                void this.trigger("done", "VideoSegmentStream")
              );
            ie(t), (o = f);
          }
          ae(t, o),
            (t.samples = Wt(o)),
            (h = _t.mdat(jt(o))),
            (t.baseMediaDecodeTime = ne(t, e.keepOriginalTimestamps)),
            this.trigger(
              "processedGopsInfo",
              o.map(function (t) {
                return { pts: t.pts, dts: t.dts, byteLength: t.byteLength };
              })
            ),
            (u = o[0]),
            (l = o[o.length - 1]),
            this.trigger(
              "segmentTimingInfo",
              pi(t.baseMediaDecodeTime, u.dts, u.pts, l.dts + l.duration, l.pts + l.duration, c)
            ),
            this.trigger("timingInfo", { start: o[0].pts, end: o[o.length - 1].pts + o[o.length - 1].duration }),
            this.gopCache_.unshift({ gop: o.pop(), pps: t.pps, sps: t.sps }),
            (this.gopCache_.length = Math.min(6, this.gopCache_.length)),
            (r = []),
            this.trigger("baseMediaDecodeTime", t.baseMediaDecodeTime),
            this.trigger("timelineStartInfo", t.timelineStartInfo),
            (d = _t.moof(i, [t])),
            (p = new Uint8Array(d.byteLength + h.byteLength)),
            i++,
            p.set(d),
            p.set(h, d.byteLength),
            this.trigger("data", { track: t, boxes: p }),
            this.resetStream_(),
            this.trigger("done", "VideoSegmentStream");
        }),
        (this.reset = function () {
          this.resetStream_(), (r = []), (this.gopCache_.length = 0), (s.length = 0), this.trigger("reset");
        }),
        (this.resetStream_ = function () {
          ie(t), (n = void 0), (a = void 0);
        }),
        (this.getGopForFusion_ = function (e) {
          var i,
            n,
            a,
            r,
            s,
            o = 1 / 0;
          for (s = 0; s < this.gopCache_.length; s++)
            (a = (r = this.gopCache_[s]).gop),
              t.pps &&
                hi(t.pps[0], r.pps[0]) &&
                t.sps &&
                hi(t.sps[0], r.sps[0]) &&
                (a.dts < t.timelineStartInfo.dts ||
                  ((i = e.dts - a.dts - a.duration) >= -1e4 && i <= 45e3 && (!n || o > i) && ((n = r), (o = i))));
          return n ? n.gop : null;
        }),
        (this.alignGopsAtStart_ = function (t) {
          var e, i, n, a, r, o, d, h;
          for (
            r = t.byteLength, o = t.nalCount, d = t.duration, e = i = 0;
            e < s.length && i < t.length && ((n = s[e]), (a = t[i]), n.pts !== a.pts);

          )
            a.pts > n.pts ? e++ : (i++, (r -= a.byteLength), (o -= a.nalCount), (d -= a.duration));
          return 0 === i
            ? t
            : i === t.length
            ? null
            : (((h = t.slice(i)).byteLength = r),
              (h.duration = d),
              (h.nalCount = o),
              (h.pts = h[0].pts),
              (h.dts = h[0].dts),
              h);
        }),
        (this.alignGopsAtEnd_ = function (t) {
          var e, i, n, a, r, o, d;
          for (e = s.length - 1, i = t.length - 1, r = null, o = !1; e >= 0 && i >= 0; ) {
            if (((n = s[e]), (a = t[i]), n.pts === a.pts)) {
              o = !0;
              break;
            }
            n.pts > a.pts ? e-- : (e === s.length - 1 && (r = i), i--);
          }
          if (!o && null === r) return null;
          if (0 === (d = o ? i : r)) return t;
          var h = t.slice(d),
            p = h.reduce(
              function (t, e) {
                return (t.byteLength += e.byteLength), (t.duration += e.duration), (t.nalCount += e.nalCount), t;
              },
              { byteLength: 0, duration: 0, nalCount: 0 }
            );
          return (
            (h.byteLength = p.byteLength),
            (h.duration = p.duration),
            (h.nalCount = p.nalCount),
            (h.pts = h[0].pts),
            (h.dts = h[0].dts),
            h
          );
        }),
        (this.alignGopsWith = function (t) {
          s = t;
        });
    }).prototype = new u()),
    ((ti = function (t, e) {
      (this.numberOfTracks = 0),
        (this.metadataStream = e),
        void 0 !== (t = t || {}).remux ? (this.remuxTracks = !!t.remux) : (this.remuxTracks = !0),
        "boolean" == typeof t.keepOriginalTimestamps
          ? (this.keepOriginalTimestamps = t.keepOriginalTimestamps)
          : (this.keepOriginalTimestamps = !1),
        (this.pendingTracks = []),
        (this.videoTrack = null),
        (this.pendingBoxes = []),
        (this.pendingCaptions = []),
        (this.pendingMetadata = []),
        (this.pendingBytes = 0),
        (this.emittedTracks = 0),
        ti.prototype.init.call(this),
        (this.push = function (t) {
          return t.text
            ? this.pendingCaptions.push(t)
            : t.frames
            ? this.pendingMetadata.push(t)
            : (this.pendingTracks.push(t.track),
              (this.pendingBytes += t.boxes.byteLength),
              "video" === t.track.type && ((this.videoTrack = t.track), this.pendingBoxes.push(t.boxes)),
              void ("audio" === t.track.type && ((this.audioTrack = t.track), this.pendingBoxes.unshift(t.boxes))));
        });
    }).prototype = new u()),
    (ti.prototype.flush = function (t) {
      var e,
        i,
        n,
        a,
        r = 0,
        s = { captions: [], captionStreams: {}, metadata: [], info: {} },
        o = 0;
      if (this.pendingTracks.length < this.numberOfTracks) {
        if ("VideoSegmentStream" !== t && "AudioSegmentStream" !== t) return;
        if (this.remuxTracks) return;
        if (0 === this.pendingTracks.length)
          return (
            this.emittedTracks++,
            void (this.emittedTracks >= this.numberOfTracks && (this.trigger("done"), (this.emittedTracks = 0)))
          );
      }
      if (
        (this.videoTrack
          ? ((o = this.videoTrack.timelineStartInfo.pts),
            ni.forEach(function (t) {
              s.info[t] = this.videoTrack[t];
            }, this))
          : this.audioTrack &&
            ((o = this.audioTrack.timelineStartInfo.pts),
            ii.forEach(function (t) {
              s.info[t] = this.audioTrack[t];
            }, this)),
        this.videoTrack || this.audioTrack)
      ) {
        for (
          1 === this.pendingTracks.length ? (s.type = this.pendingTracks[0].type) : (s.type = "combined"),
            this.emittedTracks += this.pendingTracks.length,
            n = _t.initSegment(this.pendingTracks),
            s.initSegment = new Uint8Array(n.byteLength),
            s.initSegment.set(n),
            s.data = new Uint8Array(this.pendingBytes),
            a = 0;
          a < this.pendingBoxes.length;
          a++
        )
          s.data.set(this.pendingBoxes[a], r), (r += this.pendingBoxes[a].byteLength);
        for (a = 0; a < this.pendingCaptions.length; a++)
          ((e = this.pendingCaptions[a]).startTime = b(e.startPts, o, this.keepOriginalTimestamps)),
            (e.endTime = b(e.endPts, o, this.keepOriginalTimestamps)),
            (s.captionStreams[e.stream] = !0),
            s.captions.push(e);
        for (a = 0; a < this.pendingMetadata.length; a++)
          ((i = this.pendingMetadata[a]).cueTime = b(i.pts, o, this.keepOriginalTimestamps)), s.metadata.push(i);
        for (
          s.metadata.dispatchType = this.metadataStream.dispatchType,
            this.pendingTracks.length = 0,
            this.videoTrack = null,
            this.pendingBoxes.length = 0,
            this.pendingCaptions.length = 0,
            this.pendingBytes = 0,
            this.pendingMetadata.length = 0,
            this.trigger("data", s),
            a = 0;
          a < s.captions.length;
          a++
        )
          (e = s.captions[a]), this.trigger("caption", e);
        for (a = 0; a < s.metadata.length; a++) (i = s.metadata[a]), this.trigger("id3Frame", i);
      }
      this.emittedTracks >= this.numberOfTracks && (this.trigger("done"), (this.emittedTracks = 0));
    }),
    (ti.prototype.setRemux = function (t) {
      this.remuxTracks = t;
    }),
    ((Qe = function (t) {
      var e,
        i,
        n = this,
        a = !0;
      Qe.prototype.init.call(this),
        (t = t || {}),
        (this.baseMediaDecodeTime = t.baseMediaDecodeTime || 0),
        (this.transmuxPipeline_ = {}),
        (this.setupAacPipeline = function () {
          var a = {};
          (this.transmuxPipeline_ = a),
            (a.type = "aac"),
            (a.metadataStream = new qe.MetadataStream()),
            (a.aacStream = new ei()),
            (a.audioTimestampRolloverStream = new qe.TimestampRolloverStream("audio")),
            (a.timedMetadataTimestampRolloverStream = new qe.TimestampRolloverStream("timed-metadata")),
            (a.adtsStream = new k()),
            (a.coalesceStream = new ti(t, a.metadataStream)),
            (a.headOfPipeline = a.aacStream),
            a.aacStream.pipe(a.audioTimestampRolloverStream).pipe(a.adtsStream),
            a.aacStream.pipe(a.timedMetadataTimestampRolloverStream).pipe(a.metadataStream).pipe(a.coalesceStream),
            a.metadataStream.on("timestamp", function (t) {
              a.aacStream.setTimestamp(t.timeStamp);
            }),
            a.aacStream.on("data", function (r) {
              ("timed-metadata" !== r.type && "audio" !== r.type) ||
                a.audioSegmentStream ||
                ((i = i || {
                  timelineStartInfo: { baseMediaDecodeTime: n.baseMediaDecodeTime },
                  codec: "adts",
                  type: "audio",
                }),
                a.coalesceStream.numberOfTracks++,
                (a.audioSegmentStream = new Je(i, t)),
                a.audioSegmentStream.on("log", n.getLogTrigger_("audioSegmentStream")),
                a.audioSegmentStream.on("timingInfo", n.trigger.bind(n, "audioTimingInfo")),
                a.adtsStream.pipe(a.audioSegmentStream).pipe(a.coalesceStream),
                n.trigger("trackinfo", { hasAudio: !!i, hasVideo: !!e }));
            }),
            a.coalesceStream.on("data", this.trigger.bind(this, "data")),
            a.coalesceStream.on("done", this.trigger.bind(this, "done")),
            di(this, a);
        }),
        (this.setupTsPipeline = function () {
          var a = {};
          (this.transmuxPipeline_ = a),
            (a.type = "ts"),
            (a.metadataStream = new qe.MetadataStream()),
            (a.packetStream = new qe.TransportPacketStream()),
            (a.parseStream = new qe.TransportParseStream()),
            (a.elementaryStream = new qe.ElementaryStream()),
            (a.timestampRolloverStream = new qe.TimestampRolloverStream()),
            (a.adtsStream = new k()),
            (a.h264Stream = new ai()),
            (a.captionStream = new qe.CaptionStream(t)),
            (a.coalesceStream = new ti(t, a.metadataStream)),
            (a.headOfPipeline = a.packetStream),
            a.packetStream.pipe(a.parseStream).pipe(a.elementaryStream).pipe(a.timestampRolloverStream),
            a.timestampRolloverStream.pipe(a.h264Stream),
            a.timestampRolloverStream.pipe(a.adtsStream),
            a.timestampRolloverStream.pipe(a.metadataStream).pipe(a.coalesceStream),
            a.h264Stream.pipe(a.captionStream).pipe(a.coalesceStream),
            a.elementaryStream.on("data", function (r) {
              var s;
              if ("metadata" === r.type) {
                for (s = r.tracks.length; s--; )
                  e || "video" !== r.tracks[s].type
                    ? i ||
                      "audio" !== r.tracks[s].type ||
                      ((i = r.tracks[s]).timelineStartInfo.baseMediaDecodeTime = n.baseMediaDecodeTime)
                    : ((e = r.tracks[s]).timelineStartInfo.baseMediaDecodeTime = n.baseMediaDecodeTime);
                e &&
                  !a.videoSegmentStream &&
                  (a.coalesceStream.numberOfTracks++,
                  (a.videoSegmentStream = new Ze(e, t)),
                  a.videoSegmentStream.on("log", n.getLogTrigger_("videoSegmentStream")),
                  a.videoSegmentStream.on("timelineStartInfo", function (e) {
                    i &&
                      !t.keepOriginalTimestamps &&
                      ((i.timelineStartInfo = e), a.audioSegmentStream.setEarliestDts(e.dts - n.baseMediaDecodeTime));
                  }),
                  a.videoSegmentStream.on("processedGopsInfo", n.trigger.bind(n, "gopInfo")),
                  a.videoSegmentStream.on("segmentTimingInfo", n.trigger.bind(n, "videoSegmentTimingInfo")),
                  a.videoSegmentStream.on("baseMediaDecodeTime", function (t) {
                    i && a.audioSegmentStream.setVideoBaseMediaDecodeTime(t);
                  }),
                  a.videoSegmentStream.on("timingInfo", n.trigger.bind(n, "videoTimingInfo")),
                  a.h264Stream.pipe(a.videoSegmentStream).pipe(a.coalesceStream)),
                  i &&
                    !a.audioSegmentStream &&
                    (a.coalesceStream.numberOfTracks++,
                    (a.audioSegmentStream = new Je(i, t)),
                    a.audioSegmentStream.on("log", n.getLogTrigger_("audioSegmentStream")),
                    a.audioSegmentStream.on("timingInfo", n.trigger.bind(n, "audioTimingInfo")),
                    a.audioSegmentStream.on("segmentTimingInfo", n.trigger.bind(n, "audioSegmentTimingInfo")),
                    a.adtsStream.pipe(a.audioSegmentStream).pipe(a.coalesceStream)),
                  n.trigger("trackinfo", { hasAudio: !!i, hasVideo: !!e });
              }
            }),
            a.coalesceStream.on("data", this.trigger.bind(this, "data")),
            a.coalesceStream.on("id3Frame", function (t) {
              (t.dispatchType = a.metadataStream.dispatchType), n.trigger("id3Frame", t);
            }),
            a.coalesceStream.on("caption", this.trigger.bind(this, "caption")),
            a.coalesceStream.on("done", this.trigger.bind(this, "done")),
            di(this, a);
        }),
        (this.setBaseMediaDecodeTime = function (n) {
          var a = this.transmuxPipeline_;
          t.keepOriginalTimestamps || (this.baseMediaDecodeTime = n),
            i &&
              ((i.timelineStartInfo.dts = void 0),
              (i.timelineStartInfo.pts = void 0),
              ie(i),
              a.audioTimestampRolloverStream && a.audioTimestampRolloverStream.discontinuity()),
            e &&
              (a.videoSegmentStream && (a.videoSegmentStream.gopCache_ = []),
              (e.timelineStartInfo.dts = void 0),
              (e.timelineStartInfo.pts = void 0),
              ie(e),
              a.captionStream.reset()),
            a.timestampRolloverStream && a.timestampRolloverStream.discontinuity();
        }),
        (this.setAudioAppendStart = function (t) {
          i && this.transmuxPipeline_.audioSegmentStream.setAudioAppendStart(t);
        }),
        (this.setRemux = function (e) {
          var i = this.transmuxPipeline_;
          (t.remux = e), i && i.coalesceStream && i.coalesceStream.setRemux(e);
        }),
        (this.alignGopsWith = function (t) {
          e && this.transmuxPipeline_.videoSegmentStream && this.transmuxPipeline_.videoSegmentStream.alignGopsWith(t);
        }),
        (this.getLogTrigger_ = function (t) {
          var e = this;
          return function (i) {
            (i.stream = t), e.trigger("log", i);
          };
        }),
        (this.push = function (t) {
          if (a) {
            var e = ri(t);
            e && "aac" !== this.transmuxPipeline_.type
              ? this.setupAacPipeline()
              : e || "ts" === this.transmuxPipeline_.type || this.setupTsPipeline(),
              (a = !1);
          }
          this.transmuxPipeline_.headOfPipeline.push(t);
        }),
        (this.flush = function () {
          (a = !0), this.transmuxPipeline_.headOfPipeline.flush();
        }),
        (this.endTimeline = function () {
          this.transmuxPipeline_.headOfPipeline.endTimeline();
        }),
        (this.reset = function () {
          this.transmuxPipeline_.headOfPipeline && this.transmuxPipeline_.headOfPipeline.reset();
        }),
        (this.resetCaptions = function () {
          this.transmuxPipeline_.captionStream && this.transmuxPipeline_.captionStream.reset();
        });
    }).prototype = new u());
  var ui,
    li = {
      Transmuxer: Qe,
      VideoSegmentStream: Ze,
      AudioSegmentStream: Je,
      AUDIO_PROPERTIES: ii,
      VIDEO_PROPERTIES: ni,
      generateSegmentTimingInfo: pi,
    },
    ci = de,
    fi = Te.CaptionStream,
    gi = function (t, e) {
      for (var i = t, n = 0; n < e.length; n++) {
        var a = e[n];
        if (i < a.size) return a;
        i -= a.size;
      }
      return null;
    },
    mi = function (t, e) {
      var n = Dt(t, ["moof", "traf"]),
        a = Dt(t, ["mdat"]),
        r = {},
        s = [];
      return (
        a.forEach(function (t, e) {
          var i = n[e];
          s.push({ mdat: t, traf: i });
        }),
        s.forEach(function (t) {
          var n,
            a = t.mdat,
            s = t.traf,
            o = Dt(s, ["tfhd"]),
            d = Ct(o[0]),
            h = d.trackId,
            p = Dt(s, ["tfdt"]),
            u = p.length > 0 ? xt(p[0]).baseMediaDecodeTime : 0,
            l = Dt(s, ["trun"]);
          e === h &&
            l.length > 0 &&
            ((n = (function (t, e, i) {
              var n,
                a,
                r,
                s,
                o = new DataView(t.buffer, t.byteOffset, t.byteLength),
                d = { logs: [], seiNals: [] };
              for (a = 0; a + 4 < t.length; a += r)
                if (((r = o.getUint32(a)), (a += 4), !(r <= 0)))
                  switch (31 & t[a]) {
                    case 6:
                      var h = t.subarray(a + 1, a + 1 + r),
                        p = gi(a, e);
                      if (((n = { nalUnitType: "sei_rbsp", size: r, data: h, escapedRBSP: ci(h), trackId: i }), p))
                        (n.pts = p.pts), (n.dts = p.dts), (s = p);
                      else {
                        if (!s) {
                          d.logs.push({
                            level: "warn",
                            message:
                              "We've encountered a nal unit without data at " +
                              a +
                              " for trackId " +
                              i +
                              ". See mux.js#223.",
                          });
                          break;
                        }
                        (n.pts = s.pts), (n.dts = s.dts);
                      }
                      d.seiNals.push(n);
                  }
              return d;
            })(
              a,
              (function (t, e, n) {
                var a = e,
                  r = n.defaultSampleDuration || 0,
                  s = n.defaultSampleSize || 0,
                  o = n.trackId,
                  d = [];
                return (
                  t.forEach(function (t) {
                    var e = Lt(t).samples;
                    e.forEach(function (t) {
                      void 0 === t.duration && (t.duration = r),
                        void 0 === t.size && (t.size = s),
                        (t.trackId = o),
                        (t.dts = a),
                        void 0 === t.compositionTimeOffset && (t.compositionTimeOffset = 0),
                        "bigint" == typeof a
                          ? ((t.pts = a + i.default.BigInt(t.compositionTimeOffset)),
                            (a += i.default.BigInt(t.duration)))
                          : ((t.pts = a + t.compositionTimeOffset), (a += t.duration));
                    }),
                      (d = d.concat(e));
                  }),
                  d
                );
              })(l, u, d),
              h
            )),
            r[h] || (r[h] = { seiNals: [], logs: [] }),
            (r[h].seiNals = r[h].seiNals.concat(n.seiNals)),
            (r[h].logs = r[h].logs.concat(n.logs)));
        }),
        r
      );
    },
    yi = {
      generator: _t,
      probe: Nt,
      Transmuxer: li.Transmuxer,
      AudioSegmentStream: li.AudioSegmentStream,
      VideoSegmentStream: li.VideoSegmentStream,
      CaptionParser: function () {
        var t,
          e,
          i,
          n,
          a,
          r,
          s = !1;
        (this.isInitialized = function () {
          return s;
        }),
          (this.init = function (e) {
            (t = new fi()),
              (s = !0),
              (r = !!e && e.isPartial),
              t.on("data", function (t) {
                (t.startTime = t.startPts / n),
                  (t.endTime = t.endPts / n),
                  a.captions.push(t),
                  (a.captionStreams[t.stream] = !0);
              }),
              t.on("log", function (t) {
                a.logs.push(t);
              });
          }),
          (this.isNewInit = function (t, e) {
            return (
              !((t && 0 === t.length) || (e && "object" == typeof e && 0 === Object.keys(e).length)) &&
              (i !== t[0] || n !== e[i])
            );
          }),
          (this.parse = function (t, r, s) {
            var o;
            if (!this.isInitialized()) return null;
            if (!r || !s) return null;
            if (this.isNewInit(r, s)) (i = r[0]), (n = s[i]);
            else if (null === i || !n) return e.push(t), null;
            for (; e.length > 0; ) {
              var d = e.shift();
              this.parse(d, r, s);
            }
            return (
              (o = (function (t, e, i) {
                if (null === e) return null;
                var n = mi(t, e)[e] || {};
                return { seiNals: n.seiNals, logs: n.logs, timescale: i };
              })(t, i, n)) &&
                o.logs &&
                (a.logs = a.logs.concat(o.logs)),
              null !== o && o.seiNals
                ? (this.pushNals(o.seiNals), this.flushStream(), a)
                : a.logs.length
                ? { logs: a.logs, captions: [], captionStreams: [] }
                : null
            );
          }),
          (this.pushNals = function (e) {
            if (!this.isInitialized() || !e || 0 === e.length) return null;
            e.forEach(function (e) {
              t.push(e);
            });
          }),
          (this.flushStream = function () {
            if (!this.isInitialized()) return null;
            r ? t.partialFlush() : t.flush();
          }),
          (this.clearParsedCaptions = function () {
            (a.captions = []), (a.captionStreams = {}), (a.logs = []);
          }),
          (this.resetCaptionStream = function () {
            if (!this.isInitialized()) return null;
            t.reset();
          }),
          (this.clearAllCaptions = function () {
            this.clearParsedCaptions(), this.resetCaptionStream();
          }),
          (this.reset = function () {
            (e = []),
              (i = null),
              (n = null),
              a ? this.clearParsedCaptions() : (a = { captions: [], captionStreams: {}, logs: [] }),
              this.resetCaptionStream();
          }),
          this.reset();
      },
    };
  ((ui = function (t, e) {
    var i,
      n = 0,
      a = 16384,
      r = function (t, e) {
        var i,
          n = t.position + e;
        n < t.bytes.byteLength ||
          ((i = new Uint8Array(2 * n)).set(t.bytes.subarray(0, t.position), 0),
          (t.bytes = i),
          (t.view = new DataView(t.bytes.buffer)));
      },
      s = ui.widthBytes || new Uint8Array("width".length),
      o = ui.heightBytes || new Uint8Array("height".length),
      d = ui.videocodecidBytes || new Uint8Array("videocodecid".length);
    if (!ui.widthBytes) {
      for (i = 0; i < "width".length; i++) s[i] = "width".charCodeAt(i);
      for (i = 0; i < "height".length; i++) o[i] = "height".charCodeAt(i);
      for (i = 0; i < "videocodecid".length; i++) d[i] = "videocodecid".charCodeAt(i);
      (ui.widthBytes = s), (ui.heightBytes = o), (ui.videocodecidBytes = d);
    }
    switch (((this.keyFrame = !1), t)) {
      case ui.VIDEO_TAG:
        (this.length = 16), (a *= 6);
        break;
      case ui.AUDIO_TAG:
        (this.length = 13), (this.keyFrame = !0);
        break;
      case ui.METADATA_TAG:
        (this.length = 29), (this.keyFrame = !0);
        break;
      default:
        throw new Error("Unknown FLV tag type");
    }
    (this.bytes = new Uint8Array(a)),
      (this.view = new DataView(this.bytes.buffer)),
      (this.bytes[0] = t),
      (this.position = this.length),
      (this.keyFrame = e),
      (this.pts = 0),
      (this.dts = 0),
      (this.writeBytes = function (t, e, i) {
        var n,
          a = e || 0;
        (n = a + (i = i || t.byteLength)),
          r(this, i),
          this.bytes.set(t.subarray(a, n), this.position),
          (this.position += i),
          (this.length = Math.max(this.length, this.position));
      }),
      (this.writeByte = function (t) {
        r(this, 1),
          (this.bytes[this.position] = t),
          this.position++,
          (this.length = Math.max(this.length, this.position));
      }),
      (this.writeShort = function (t) {
        r(this, 2),
          this.view.setUint16(this.position, t),
          (this.position += 2),
          (this.length = Math.max(this.length, this.position));
      }),
      (this.negIndex = function (t) {
        return this.bytes[this.length - t];
      }),
      (this.nalUnitSize = function () {
        return 0 === n ? 0 : this.length - (n + 4);
      }),
      (this.startNalUnit = function () {
        if (n > 0) throw new Error("Attempted to create new NAL wihout closing the old one");
        (n = this.length), (this.length += 4), (this.position = this.length);
      }),
      (this.endNalUnit = function (t) {
        var e, i;
        this.length === n + 4
          ? (this.length -= 4)
          : n > 0 &&
            ((e = n + 4),
            (i = this.length - e),
            (this.position = n),
            this.view.setUint32(this.position, i),
            (this.position = this.length),
            t && t.push(this.bytes.subarray(e, e + i))),
          (n = 0);
      }),
      (this.writeMetaDataDouble = function (t, e) {
        var i;
        if (
          (r(this, 2 + t.length + 9), this.view.setUint16(this.position, t.length), (this.position += 2), "width" === t)
        )
          this.bytes.set(s, this.position), (this.position += 5);
        else if ("height" === t) this.bytes.set(o, this.position), (this.position += 6);
        else if ("videocodecid" === t) this.bytes.set(d, this.position), (this.position += 12);
        else for (i = 0; i < t.length; i++) (this.bytes[this.position] = t.charCodeAt(i)), this.position++;
        this.position++,
          this.view.setFloat64(this.position, e),
          (this.position += 8),
          (this.length = Math.max(this.length, this.position)),
          ++n;
      }),
      (this.writeMetaDataBoolean = function (t, e) {
        var i;
        for (r(this, 2), this.view.setUint16(this.position, t.length), this.position += 2, i = 0; i < t.length; i++)
          r(this, 1), (this.bytes[this.position] = t.charCodeAt(i)), this.position++;
        r(this, 2),
          this.view.setUint8(this.position, 1),
          this.position++,
          this.view.setUint8(this.position, e ? 1 : 0),
          this.position++,
          (this.length = Math.max(this.length, this.position)),
          ++n;
      }),
      (this.finalize = function () {
        var t, i;
        switch (this.bytes[0]) {
          case ui.VIDEO_TAG:
            (this.bytes[11] = 7 | (this.keyFrame || e ? 16 : 32)),
              (this.bytes[12] = e ? 0 : 1),
              (t = this.pts - this.dts),
              (this.bytes[13] = (16711680 & t) >>> 16),
              (this.bytes[14] = (65280 & t) >>> 8),
              (this.bytes[15] = (255 & t) >>> 0);
            break;
          case ui.AUDIO_TAG:
            (this.bytes[11] = 175), (this.bytes[12] = e ? 0 : 1);
            break;
          case ui.METADATA_TAG:
            (this.position = 11),
              this.view.setUint8(this.position, 2),
              this.position++,
              this.view.setUint16(this.position, 10),
              (this.position += 2),
              this.bytes.set([111, 110, 77, 101, 116, 97, 68, 97, 116, 97], this.position),
              (this.position += 10),
              (this.bytes[this.position] = 8),
              this.position++,
              this.view.setUint32(this.position, n),
              (this.position = this.length),
              this.bytes.set([0, 0, 9], this.position),
              (this.position += 3),
              (this.length = this.position);
        }
        return (
          (i = this.length - 11),
          (this.bytes[1] = (16711680 & i) >>> 16),
          (this.bytes[2] = (65280 & i) >>> 8),
          (this.bytes[3] = (255 & i) >>> 0),
          (this.bytes[4] = (16711680 & this.dts) >>> 16),
          (this.bytes[5] = (65280 & this.dts) >>> 8),
          (this.bytes[6] = (255 & this.dts) >>> 0),
          (this.bytes[7] = (4278190080 & this.dts) >>> 24),
          (this.bytes[8] = 0),
          (this.bytes[9] = 0),
          (this.bytes[10] = 0),
          r(this, 4),
          this.view.setUint32(this.length, this.length),
          (this.length += 4),
          (this.position += 4),
          (this.bytes = this.bytes.subarray(0, this.length)),
          (this.frameTime = ui.frameTime(this.bytes)),
          this
        );
      });
  }).AUDIO_TAG = 8),
    (ui.VIDEO_TAG = 9),
    (ui.METADATA_TAG = 18),
    (ui.isAudioFrame = function (t) {
      return ui.AUDIO_TAG === t[0];
    }),
    (ui.isVideoFrame = function (t) {
      return ui.VIDEO_TAG === t[0];
    }),
    (ui.isMetaData = function (t) {
      return ui.METADATA_TAG === t[0];
    }),
    (ui.isKeyFrame = function (t) {
      return ui.isVideoFrame(t) ? 23 === t[11] : !!ui.isAudioFrame(t) || !!ui.isMetaData(t);
    }),
    (ui.frameTime = function (t) {
      var e = t[4] << 16;
      return (e |= t[5] << 8), (e |= t[6] << 0), (e |= t[7] << 24);
    });
  var bi = ui,
    vi = function t(e) {
      (this.numberOfTracks = 0),
        (this.metadataStream = e.metadataStream),
        (this.videoTags = []),
        (this.audioTags = []),
        (this.videoTrack = null),
        (this.audioTrack = null),
        (this.pendingCaptions = []),
        (this.pendingMetadata = []),
        (this.pendingTracks = 0),
        (this.processedTracks = 0),
        t.prototype.init.call(this),
        (this.push = function (t) {
          return t.text
            ? this.pendingCaptions.push(t)
            : t.frames
            ? this.pendingMetadata.push(t)
            : ("video" === t.track.type &&
                ((this.videoTrack = t.track), (this.videoTags = t.tags), this.pendingTracks++),
              void (
                "audio" === t.track.type &&
                ((this.audioTrack = t.track), (this.audioTags = t.tags), this.pendingTracks++)
              ));
        });
    };
  (vi.prototype = new u()).flush = function (t) {
    var e,
      i,
      n,
      a,
      r = { tags: {}, captions: [], captionStreams: {}, metadata: [] };
    if (this.pendingTracks < this.numberOfTracks) {
      if ("VideoSegmentStream" !== t && "AudioSegmentStream" !== t) return;
      if (0 === this.pendingTracks && (this.processedTracks++, this.processedTracks < this.numberOfTracks)) return;
    }
    if (
      ((this.processedTracks += this.pendingTracks),
      (this.pendingTracks = 0),
      !(this.processedTracks < this.numberOfTracks))
    ) {
      for (
        this.videoTrack
          ? (a = this.videoTrack.timelineStartInfo.pts)
          : this.audioTrack && (a = this.audioTrack.timelineStartInfo.pts),
          r.tags.videoTags = this.videoTags,
          r.tags.audioTags = this.audioTags,
          n = 0;
        n < this.pendingCaptions.length;
        n++
      )
        ((i = this.pendingCaptions[n]).startTime = i.startPts - a),
          (i.startTime /= 9e4),
          (i.endTime = i.endPts - a),
          (i.endTime /= 9e4),
          (r.captionStreams[i.stream] = !0),
          r.captions.push(i);
      for (n = 0; n < this.pendingMetadata.length; n++)
        ((e = this.pendingMetadata[n]).cueTime = e.pts - a), (e.cueTime /= 9e4), r.metadata.push(e);
      (r.metadata.dispatchType = this.metadataStream.dispatchType),
        (this.videoTrack = null),
        (this.audioTrack = null),
        (this.videoTags = []),
        (this.audioTags = []),
        (this.pendingCaptions.length = 0),
        (this.pendingMetadata.length = 0),
        (this.pendingTracks = 0),
        (this.processedTracks = 0),
        this.trigger("data", r),
        this.trigger("done");
    }
  };
  var Si,
    Ti,
    wi,
    _i,
    ki,
    Ui,
    Ai = vi,
    Di = function () {
      var t = this;
      (this.list = []),
        (this.push = function (t) {
          this.list.push({ bytes: t.bytes, dts: t.dts, pts: t.pts, keyFrame: t.keyFrame, metaDataTag: t.metaDataTag });
        }),
        Object.defineProperty(this, "length", {
          get: function () {
            return t.list.length;
          },
        });
    },
    Ci = lt.H264Stream;
  (_i = function (t, e) {
    "number" == typeof e.pts &&
      (void 0 === t.timelineStartInfo.pts
        ? (t.timelineStartInfo.pts = e.pts)
        : (t.timelineStartInfo.pts = Math.min(t.timelineStartInfo.pts, e.pts))),
      "number" == typeof e.dts &&
        (void 0 === t.timelineStartInfo.dts
          ? (t.timelineStartInfo.dts = e.dts)
          : (t.timelineStartInfo.dts = Math.min(t.timelineStartInfo.dts, e.dts)));
  }),
    (ki = function (t, e) {
      var i = new bi(bi.METADATA_TAG);
      return (
        (i.dts = e),
        (i.pts = e),
        i.writeMetaDataDouble("videocodecid", 7),
        i.writeMetaDataDouble("width", t.width),
        i.writeMetaDataDouble("height", t.height),
        i
      );
    }),
    (Ui = function (t, e) {
      var i,
        n = new bi(bi.VIDEO_TAG, !0);
      for (
        n.dts = e,
          n.pts = e,
          n.writeByte(1),
          n.writeByte(t.profileIdc),
          n.writeByte(t.profileCompatibility),
          n.writeByte(t.levelIdc),
          n.writeByte(255),
          n.writeByte(225),
          n.writeShort(t.sps[0].length),
          n.writeBytes(t.sps[0]),
          n.writeByte(t.pps.length),
          i = 0;
        i < t.pps.length;
        ++i
      )
        n.writeShort(t.pps[i].length), n.writeBytes(t.pps[i]);
      return n;
    }),
    ((wi = function (t) {
      var e,
        i = [],
        n = [];
      wi.prototype.init.call(this),
        (this.push = function (e) {
          _i(t, e),
            t &&
              ((t.audioobjecttype = e.audioobjecttype),
              (t.channelcount = e.channelcount),
              (t.samplerate = e.samplerate),
              (t.samplingfrequencyindex = e.samplingfrequencyindex),
              (t.samplesize = e.samplesize),
              (t.extraData = (t.audioobjecttype << 11) | (t.samplingfrequencyindex << 7) | (t.channelcount << 3))),
            (e.pts = Math.round(e.pts / 90)),
            (e.dts = Math.round(e.dts / 90)),
            i.push(e);
        }),
        (this.flush = function () {
          var a,
            r,
            s,
            o = new Di();
          if (0 !== i.length) {
            for (s = -1 / 0; i.length; )
              (a = i.shift()),
                n.length && a.pts >= n[0] && ((s = n.shift()), this.writeMetaDataTags(o, s)),
                (t.extraData !== e || a.pts - s >= 1e3) &&
                  (this.writeMetaDataTags(o, a.pts), (e = t.extraData), (s = a.pts)),
                ((r = new bi(bi.AUDIO_TAG)).pts = a.pts),
                (r.dts = a.dts),
                r.writeBytes(a.data),
                o.push(r.finalize());
            (n.length = 0),
              (e = null),
              this.trigger("data", { track: t, tags: o.list }),
              this.trigger("done", "AudioSegmentStream");
          } else this.trigger("done", "AudioSegmentStream");
        }),
        (this.writeMetaDataTags = function (e, i) {
          var n;
          ((n = new bi(bi.METADATA_TAG)).pts = i),
            (n.dts = i),
            n.writeMetaDataDouble("audiocodecid", 10),
            n.writeMetaDataBoolean("stereo", 2 === t.channelcount),
            n.writeMetaDataDouble("audiosamplerate", t.samplerate),
            n.writeMetaDataDouble("audiosamplesize", 16),
            e.push(n.finalize()),
            ((n = new bi(bi.AUDIO_TAG, !0)).pts = i),
            (n.dts = i),
            n.view.setUint16(n.position, t.extraData),
            (n.position += 2),
            (n.length = Math.max(n.length, n.position)),
            e.push(n.finalize());
        }),
        (this.onVideoKeyFrame = function (t) {
          n.push(t);
        });
    }).prototype = new u()),
    ((Ti = function (t) {
      var e,
        i,
        n = [];
      Ti.prototype.init.call(this),
        (this.finishFrame = function (n, a) {
          if (a) {
            if (e && t && t.newMetadata && (a.keyFrame || 0 === n.length)) {
              var r = ki(e, a.dts).finalize(),
                s = Ui(t, a.dts).finalize();
              (r.metaDataTag = s.metaDataTag = !0),
                n.push(r),
                n.push(s),
                (t.newMetadata = !1),
                this.trigger("keyframe", a.dts);
            }
            a.endNalUnit(), n.push(a.finalize()), (i = null);
          }
        }),
        (this.push = function (e) {
          _i(t, e), (e.pts = Math.round(e.pts / 90)), (e.dts = Math.round(e.dts / 90)), n.push(e);
        }),
        (this.flush = function () {
          for (var a, r = new Di(); n.length && "access_unit_delimiter_rbsp" !== n[0].nalUnitType; ) n.shift();
          if (0 !== n.length) {
            for (; n.length; )
              "seq_parameter_set_rbsp" === (a = n.shift()).nalUnitType
                ? ((t.newMetadata = !0),
                  (e = a.config),
                  (t.width = e.width),
                  (t.height = e.height),
                  (t.sps = [a.data]),
                  (t.profileIdc = e.profileIdc),
                  (t.levelIdc = e.levelIdc),
                  (t.profileCompatibility = e.profileCompatibility),
                  i.endNalUnit())
                : "pic_parameter_set_rbsp" === a.nalUnitType
                ? ((t.newMetadata = !0), (t.pps = [a.data]), i.endNalUnit())
                : "access_unit_delimiter_rbsp" === a.nalUnitType
                ? (i && this.finishFrame(r, i), ((i = new bi(bi.VIDEO_TAG)).pts = a.pts), (i.dts = a.dts))
                : ("slice_layer_without_partitioning_rbsp_idr" === a.nalUnitType && (i.keyFrame = !0), i.endNalUnit()),
                i.startNalUnit(),
                i.writeBytes(a.data);
            i && this.finishFrame(r, i),
              this.trigger("data", { track: t, tags: r.list }),
              this.trigger("done", "VideoSegmentStream");
          } else this.trigger("done", "VideoSegmentStream");
        });
    }).prototype = new u()),
    ((Si = function (t) {
      var e,
        i,
        n,
        a,
        r,
        s,
        o,
        d,
        h,
        p,
        u,
        l,
        c = this;
      Si.prototype.init.call(this),
        (t = t || {}),
        (this.metadataStream = new qe.MetadataStream()),
        (t.metadataStream = this.metadataStream),
        (e = new qe.TransportPacketStream()),
        (i = new qe.TransportParseStream()),
        (n = new qe.ElementaryStream()),
        (a = new qe.TimestampRolloverStream("video")),
        (r = new qe.TimestampRolloverStream("audio")),
        (s = new qe.TimestampRolloverStream("timed-metadata")),
        (o = new k()),
        (d = new Ci()),
        (l = new Ai(t)),
        e.pipe(i).pipe(n),
        n.pipe(a).pipe(d),
        n.pipe(r).pipe(o),
        n.pipe(s).pipe(this.metadataStream).pipe(l),
        (u = new qe.CaptionStream(t)),
        d.pipe(u).pipe(l),
        n.on("data", function (t) {
          var e, i, n;
          if ("metadata" === t.type) {
            for (e = t.tracks.length; e--; )
              "video" === t.tracks[e].type ? (i = t.tracks[e]) : "audio" === t.tracks[e].type && (n = t.tracks[e]);
            i && !h && (l.numberOfTracks++, (h = new Ti(i)), d.pipe(h).pipe(l)),
              n &&
                !p &&
                (l.numberOfTracks++, (p = new wi(n)), o.pipe(p).pipe(l), h && h.on("keyframe", p.onVideoKeyFrame));
          }
        }),
        (this.push = function (t) {
          e.push(t);
        }),
        (this.flush = function () {
          e.flush();
        }),
        (this.resetCaptions = function () {
          u.reset();
        }),
        l.on("data", function (t) {
          c.trigger("data", t);
        }),
        l.on("done", function () {
          c.trigger("done");
        });
    }).prototype = new u());
  var Pi = function (t, e, i) {
      var n,
        a,
        r,
        s = new Uint8Array(9),
        o = new DataView(s.buffer);
      return (
        (t = t || 0),
        (e = void 0 === e || e),
        (i = void 0 === i || i),
        o.setUint8(0, 70),
        o.setUint8(1, 76),
        o.setUint8(2, 86),
        o.setUint8(3, 1),
        o.setUint8(4, (e ? 4 : 0) | (i ? 1 : 0)),
        o.setUint32(5, s.byteLength),
        t <= 0
          ? ((a = new Uint8Array(s.byteLength + 4)).set(s), a.set([0, 0, 0, 0], s.byteLength), a)
          : (((n = new bi(bi.METADATA_TAG)).pts = n.dts = 0),
            n.writeMetaDataDouble("duration", t),
            (r = n.finalize().length),
            (a = new Uint8Array(s.byteLength + r)).set(s),
            a.set(o.byteLength, r),
            a)
      );
    },
    Li = { tag: bi, Transmuxer: Si, getFlvHeader: Pi },
    Ii = qe,
    Oi = f,
    xi = function t(e, i) {
      var n = [],
        a = 0,
        r = 0,
        s = 0,
        o = 1 / 0,
        d = null,
        h = null;
      (i = i || {}),
        t.prototype.init.call(this),
        (this.push = function (t) {
          ae(e, t),
            e &&
              ii.forEach(function (i) {
                e[i] = t[i];
              }),
            n.push(t);
        }),
        (this.setEarliestDts = function (t) {
          r = t;
        }),
        (this.setVideoBaseMediaDecodeTime = function (t) {
          o = t;
        }),
        (this.setAudioAppendStart = function (t) {
          s = t;
        }),
        (this.processFrames_ = function () {
          var t, p, u, l, c;
          0 !== n.length &&
            0 !== (t = Jt(n, e, r)).length &&
            ((e.baseMediaDecodeTime = ne(e, i.keepOriginalTimestamps)),
            Zt(e, t, s, o),
            (e.samples = Qt(t)),
            (u = _t.mdat(te(t))),
            (n = []),
            (p = _t.moof(a, [e])),
            a++,
            (e.initSegment = _t.initSegment([e])),
            (l = new Uint8Array(p.byteLength + u.byteLength)).set(p),
            l.set(u, p.byteLength),
            ie(e),
            null === d && (h = d = t[0].pts),
            (h += t.length * ((1024 * Oi) / e.samplerate)),
            (c = { start: d }),
            this.trigger("timingInfo", c),
            this.trigger("data", { track: e, boxes: l }));
        }),
        (this.flush = function () {
          this.processFrames_(),
            this.trigger("timingInfo", { start: d, end: h }),
            this.resetTiming_(),
            this.trigger("done", "AudioSegmentStream");
        }),
        (this.partialFlush = function () {
          this.processFrames_(), this.trigger("partialdone", "AudioSegmentStream");
        }),
        (this.endTimeline = function () {
          this.flush(), this.trigger("endedtimeline", "AudioSegmentStream");
        }),
        (this.resetTiming_ = function () {
          ie(e), (d = null), (h = null);
        }),
        (this.reset = function () {
          this.resetTiming_(), (n = []), this.trigger("reset");
        });
    };
  xi.prototype = new u();
  var Ei = xi,
    Mi = function t(e, i) {
      var n,
        a,
        r,
        s = 0,
        o = [],
        d = [],
        h = null,
        p = null,
        u = !0;
      (i = i || {}),
        t.prototype.init.call(this),
        (this.push = function (t) {
          ae(e, t),
            void 0 === e.timelineStartInfo.dts && (e.timelineStartInfo.dts = t.dts),
            "seq_parameter_set_rbsp" !== t.nalUnitType ||
              n ||
              ((n = t.config),
              (e.sps = [t.data]),
              ni.forEach(function (t) {
                e[t] = n[t];
              }, this)),
            "pic_parameter_set_rbsp" !== t.nalUnitType || a || ((a = t.data), (e.pps = [t.data])),
            o.push(t);
        }),
        (this.processNals_ = function (t) {
          var n;
          for (o = d.concat(o); o.length && "access_unit_delimiter_rbsp" !== o[0].nalUnitType; ) o.shift();
          if (0 !== o.length) {
            var a = zt(o);
            if (a.length)
              if (
                ((d = a[a.length - 1]),
                t && (a.pop(), (a.duration -= d.duration), (a.nalCount -= d.length), (a.byteLength -= d.byteLength)),
                a.length)
              ) {
                if ((this.trigger("timelineStartInfo", e.timelineStartInfo), u)) {
                  if (!(r = Vt(a))[0][0].keyFrame) {
                    if (!(r = Gt(r))[0][0].keyFrame) return (o = [].concat.apply([], a).concat(d)), void (d = []);
                    (a = [].concat.apply([], r)).duration = r.duration;
                  }
                  u = !1;
                }
                for (
                  null === h && ((h = a[0].pts), (p = h)),
                    p += a.duration,
                    this.trigger("timingInfo", { start: h, end: p }),
                    n = 0;
                  n < a.length;
                  n++
                ) {
                  var l = a[n];
                  e.samples = qt(l);
                  var c = _t.mdat(Yt(l));
                  ie(e), ae(e, l), (e.baseMediaDecodeTime = ne(e, i.keepOriginalTimestamps));
                  var f = _t.moof(s, [e]);
                  s++, (e.initSegment = _t.initSegment([e]));
                  var g = new Uint8Array(f.byteLength + c.byteLength);
                  g.set(f),
                    g.set(c, f.byteLength),
                    this.trigger("data", {
                      track: e,
                      boxes: g,
                      sequence: s,
                      videoFrameDts: l.dts,
                      videoFramePts: l.pts,
                    });
                }
                o = [];
              } else o = [];
          }
        }),
        (this.resetTimingAndConfig_ = function () {
          (n = void 0), (a = void 0), (h = null), (p = null);
        }),
        (this.partialFlush = function () {
          this.processNals_(!0), this.trigger("partialdone", "VideoSegmentStream");
        }),
        (this.flush = function () {
          this.processNals_(!1), this.resetTimingAndConfig_(), this.trigger("done", "VideoSegmentStream");
        }),
        (this.endTimeline = function () {
          this.flush(), this.trigger("endedtimeline", "VideoSegmentStream");
        }),
        (this.reset = function () {
          this.resetTimingAndConfig_(), (d = []), (o = []), (u = !0), this.trigger("reset");
        });
    };
  Mi.prototype = new u();
  var Ri = Mi,
    Bi = $e.isLikelyAacData,
    Ni = function (t) {
      return (t.prototype = new u()), t.prototype.init.call(t), t;
    },
    Fi = function (t, e) {
      t.on("data", e.trigger.bind(e, "data")),
        t.on("done", e.trigger.bind(e, "done")),
        t.on("partialdone", e.trigger.bind(e, "partialdone")),
        t.on("endedtimeline", e.trigger.bind(e, "endedtimeline")),
        t.on("audioTimingInfo", e.trigger.bind(e, "audioTimingInfo")),
        t.on("videoTimingInfo", e.trigger.bind(e, "videoTimingInfo")),
        t.on("trackinfo", e.trigger.bind(e, "trackinfo")),
        t.on("id3Frame", function (i) {
          (i.dispatchType = t.metadataStream.dispatchType), (i.cueTime = g(i.pts)), e.trigger("id3Frame", i);
        }),
        t.on("caption", function (t) {
          e.trigger("caption", t);
        });
    },
    zi = function t(e) {
      var i = null,
        n = !0;
      (e = e || {}),
        t.prototype.init.call(this),
        (e.baseMediaDecodeTime = e.baseMediaDecodeTime || 0),
        (this.push = function (t) {
          if (n) {
            var a = Bi(t);
            !a || (i && "aac" === i.type)
              ? a ||
                (i && "ts" === i.type) ||
                ((i = (function (t) {
                  var e = {
                    type: "ts",
                    tracks: { audio: null, video: null },
                    packet: new qe.TransportPacketStream(),
                    parse: new qe.TransportParseStream(),
                    elementary: new qe.ElementaryStream(),
                    timestampRollover: new qe.TimestampRolloverStream(),
                    adts: new ct.Adts(),
                    h264: new ct.h264.H264Stream(),
                    captionStream: new qe.CaptionStream(t),
                    metadataStream: new qe.MetadataStream(),
                  };
                  return (
                    (e.headOfPipeline = e.packet),
                    e.packet.pipe(e.parse).pipe(e.elementary).pipe(e.timestampRollover),
                    e.timestampRollover.pipe(e.h264),
                    e.h264.pipe(e.captionStream),
                    e.timestampRollover.pipe(e.metadataStream),
                    e.timestampRollover.pipe(e.adts),
                    e.elementary.on("data", function (i) {
                      if ("metadata" === i.type) {
                        for (var n = 0; n < i.tracks.length; n++)
                          e.tracks[i.tracks[n].type] ||
                            ((e.tracks[i.tracks[n].type] = i.tracks[n]),
                            (e.tracks[i.tracks[n].type].timelineStartInfo.baseMediaDecodeTime = t.baseMediaDecodeTime));
                        e.tracks.video &&
                          !e.videoSegmentStream &&
                          ((e.videoSegmentStream = new Ri(e.tracks.video, t)),
                          e.videoSegmentStream.on("timelineStartInfo", function (i) {
                            e.tracks.audio &&
                              !t.keepOriginalTimestamps &&
                              e.audioSegmentStream.setEarliestDts(i.dts - t.baseMediaDecodeTime);
                          }),
                          e.videoSegmentStream.on("timingInfo", e.trigger.bind(e, "videoTimingInfo")),
                          e.videoSegmentStream.on("data", function (t) {
                            e.trigger("data", { type: "video", data: t });
                          }),
                          e.videoSegmentStream.on("done", e.trigger.bind(e, "done")),
                          e.videoSegmentStream.on("partialdone", e.trigger.bind(e, "partialdone")),
                          e.videoSegmentStream.on("endedtimeline", e.trigger.bind(e, "endedtimeline")),
                          e.h264.pipe(e.videoSegmentStream)),
                          e.tracks.audio &&
                            !e.audioSegmentStream &&
                            ((e.audioSegmentStream = new Ei(e.tracks.audio, t)),
                            e.audioSegmentStream.on("data", function (t) {
                              e.trigger("data", { type: "audio", data: t });
                            }),
                            e.audioSegmentStream.on("done", e.trigger.bind(e, "done")),
                            e.audioSegmentStream.on("partialdone", e.trigger.bind(e, "partialdone")),
                            e.audioSegmentStream.on("endedtimeline", e.trigger.bind(e, "endedtimeline")),
                            e.audioSegmentStream.on("timingInfo", e.trigger.bind(e, "audioTimingInfo")),
                            e.adts.pipe(e.audioSegmentStream)),
                          e.trigger("trackinfo", { hasAudio: !!e.tracks.audio, hasVideo: !!e.tracks.video });
                      }
                    }),
                    e.captionStream.on("data", function (i) {
                      var n;
                      (n = (e.tracks.video && e.tracks.video.timelineStartInfo.pts) || 0),
                        (i.startTime = b(i.startPts, n, t.keepOriginalTimestamps)),
                        (i.endTime = b(i.endPts, n, t.keepOriginalTimestamps)),
                        e.trigger("caption", i);
                    }),
                    (e = Ni(e)).metadataStream.on("data", e.trigger.bind(e, "id3Frame")),
                    e
                  );
                })(e)),
                Fi(i, this))
              : ((i = (function (t) {
                  var e = {
                    type: "aac",
                    tracks: { audio: null },
                    metadataStream: new qe.MetadataStream(),
                    aacStream: new ei(),
                    audioRollover: new qe.TimestampRolloverStream("audio"),
                    timedMetadataRollover: new qe.TimestampRolloverStream("timed-metadata"),
                    adtsStream: new k(!0),
                  };
                  return (
                    (e.headOfPipeline = e.aacStream),
                    e.aacStream.pipe(e.audioRollover).pipe(e.adtsStream),
                    e.aacStream.pipe(e.timedMetadataRollover).pipe(e.metadataStream),
                    e.metadataStream.on("timestamp", function (t) {
                      e.aacStream.setTimestamp(t.timeStamp);
                    }),
                    e.aacStream.on("data", function (i) {
                      ("timed-metadata" !== i.type && "audio" !== i.type) ||
                        e.audioSegmentStream ||
                        ((e.tracks.audio = e.tracks.audio || {
                          timelineStartInfo: { baseMediaDecodeTime: t.baseMediaDecodeTime },
                          codec: "adts",
                          type: "audio",
                        }),
                        (e.audioSegmentStream = new Ei(e.tracks.audio, t)),
                        e.audioSegmentStream.on("data", function (t) {
                          e.trigger("data", { type: "audio", data: t });
                        }),
                        e.audioSegmentStream.on("partialdone", e.trigger.bind(e, "partialdone")),
                        e.audioSegmentStream.on("done", e.trigger.bind(e, "done")),
                        e.audioSegmentStream.on("endedtimeline", e.trigger.bind(e, "endedtimeline")),
                        e.audioSegmentStream.on("timingInfo", e.trigger.bind(e, "audioTimingInfo")),
                        e.adtsStream.pipe(e.audioSegmentStream),
                        e.trigger("trackinfo", { hasAudio: !!e.tracks.audio, hasVideo: !!e.tracks.video }));
                    }),
                    (e = Ni(e)).metadataStream.on("data", e.trigger.bind(e, "id3Frame")),
                    e
                  );
                })(e)),
                Fi(i, this)),
              (n = !1);
          }
          i.headOfPipeline.push(t);
        }),
        (this.flush = function () {
          i && ((n = !0), i.headOfPipeline.flush());
        }),
        (this.partialFlush = function () {
          i && i.headOfPipeline.partialFlush();
        }),
        (this.endTimeline = function () {
          i && i.headOfPipeline.endTimeline();
        }),
        (this.reset = function () {
          i && i.headOfPipeline.reset();
        }),
        (this.setBaseMediaDecodeTime = function (t) {
          e.keepOriginalTimestamps || (e.baseMediaDecodeTime = t),
            i &&
              (i.tracks.audio &&
                ((i.tracks.audio.timelineStartInfo.dts = void 0),
                (i.tracks.audio.timelineStartInfo.pts = void 0),
                ie(i.tracks.audio),
                i.audioRollover && i.audioRollover.discontinuity()),
              i.tracks.video &&
                (i.videoSegmentStream && (i.videoSegmentStream.gopCache_ = []),
                (i.tracks.video.timelineStartInfo.dts = void 0),
                (i.tracks.video.timelineStartInfo.pts = void 0),
                ie(i.tracks.video)),
              i.timestampRollover && i.timestampRollover.discontinuity());
        }),
        (this.setRemux = function (t) {
          (e.remux = t), i && i.coalesceStream && i.coalesceStream.setRemux(t);
        }),
        (this.setAudioAppendStart = function (t) {
          i && i.tracks.audio && i.audioSegmentStream && i.audioSegmentStream.setAudioAppendStart(t);
        }),
        (this.alignGopsWith = function (t) {});
    };
  zi.prototype = new u();
  var Vi,
    Gi,
    Wi = { Transmuxer: zi },
    ji = gt.getUint64,
    qi = gt.getUint64,
    Yi = function (t) {
      return new Date(1e3 * t - 20828448e5);
    },
    Hi = function (t) {
      var e,
        i,
        n = new DataView(t.buffer, t.byteOffset, t.byteLength),
        a = [];
      for (e = 0; e + 4 < t.length; e += i)
        if (((i = n.getUint32(e)), (e += 4), i <= 0)) a.push("<span style='color:red;'>MALFORMED DATA</span>");
        else
          switch (31 & t[e]) {
            case 1:
              a.push("slice_layer_without_partitioning_rbsp");
              break;
            case 5:
              a.push("slice_layer_without_partitioning_rbsp_idr");
              break;
            case 6:
              a.push("sei_rbsp");
              break;
            case 7:
              a.push("seq_parameter_set_rbsp");
              break;
            case 8:
              a.push("pic_parameter_set_rbsp");
              break;
            case 9:
              a.push("access_unit_delimiter_rbsp");
              break;
            default:
              a.push(("UNKNOWN NAL - " + t[e]) & 31);
          }
      return a;
    },
    Xi = {
      avc1: function (t) {
        var e = new DataView(t.buffer, t.byteOffset, t.byteLength);
        return {
          dataReferenceIndex: e.getUint16(6),
          width: e.getUint16(24),
          height: e.getUint16(26),
          horizresolution: e.getUint16(28) + e.getUint16(30) / 16,
          vertresolution: e.getUint16(32) + e.getUint16(34) / 16,
          frameCount: e.getUint16(40),
          depth: e.getUint16(74),
          config: Vi(t.subarray(78, t.byteLength)),
        };
      },
      avcC: function (t) {
        var e,
          i,
          n,
          a,
          r = new DataView(t.buffer, t.byteOffset, t.byteLength),
          s = {
            configurationVersion: t[0],
            avcProfileIndication: t[1],
            profileCompatibility: t[2],
            avcLevelIndication: t[3],
            lengthSizeMinusOne: 3 & t[4],
            sps: [],
            pps: [],
          },
          o = 31 & t[5];
        for (n = 6, a = 0; a < o; a++)
          (i = r.getUint16(n)), (n += 2), s.sps.push(new Uint8Array(t.subarray(n, n + i))), (n += i);
        for (e = t[n], n++, a = 0; a < e; a++)
          (i = r.getUint16(n)), (n += 2), s.pps.push(new Uint8Array(t.subarray(n, n + i))), (n += i);
        return s;
      },
      btrt: function (t) {
        var e = new DataView(t.buffer, t.byteOffset, t.byteLength);
        return { bufferSizeDB: e.getUint32(0), maxBitrate: e.getUint32(4), avgBitrate: e.getUint32(8) };
      },
      edts: function (t) {
        return { boxes: Vi(t) };
      },
      elst: function (t) {
        var e,
          i = new DataView(t.buffer, t.byteOffset, t.byteLength),
          n = { version: i.getUint8(0), flags: new Uint8Array(t.subarray(1, 4)), edits: [] },
          a = i.getUint32(4);
        for (e = 8; a; a--)
          0 === n.version
            ? (n.edits.push({
                segmentDuration: i.getUint32(e),
                mediaTime: i.getInt32(e + 4),
                mediaRate: i.getUint16(e + 8) + i.getUint16(e + 10) / 65536,
              }),
              (e += 12))
            : (n.edits.push({
                segmentDuration: qi(t.subarray(e)),
                mediaTime: qi(t.subarray(e + 8)),
                mediaRate: i.getUint16(e + 16) + i.getUint16(e + 18) / 65536,
              }),
              (e += 20));
        return n;
      },
      esds: function (t) {
        return {
          version: t[0],
          flags: new Uint8Array(t.subarray(1, 4)),
          esId: (t[6] << 8) | t[7],
          streamPriority: 31 & t[8],
          decoderConfig: {
            objectProfileIndication: t[11],
            streamType: (t[12] >>> 2) & 63,
            bufferSize: (t[13] << 16) | (t[14] << 8) | t[15],
            maxBitrate: (t[16] << 24) | (t[17] << 16) | (t[18] << 8) | t[19],
            avgBitrate: (t[20] << 24) | (t[21] << 16) | (t[22] << 8) | t[23],
            decoderConfigDescriptor: {
              tag: t[24],
              length: t[25],
              audioObjectType: (t[26] >>> 3) & 31,
              samplingFrequencyIndex: ((7 & t[26]) << 1) | ((t[27] >>> 7) & 1),
              channelConfiguration: (t[27] >>> 3) & 15,
            },
          },
        };
      },
      ftyp: function (t) {
        for (
          var e = new DataView(t.buffer, t.byteOffset, t.byteLength),
            i = { majorBrand: Ut(t.subarray(0, 4)), minorVersion: e.getUint32(4), compatibleBrands: [] },
            n = 8;
          n < t.byteLength;

        )
          i.compatibleBrands.push(Ut(t.subarray(n, n + 4))), (n += 4);
        return i;
      },
      dinf: function (t) {
        return { boxes: Vi(t) };
      },
      dref: function (t) {
        return { version: t[0], flags: new Uint8Array(t.subarray(1, 4)), dataReferences: Vi(t.subarray(8)) };
      },
      hdlr: function (t) {
        var e = {
            version: new DataView(t.buffer, t.byteOffset, t.byteLength).getUint8(0),
            flags: new Uint8Array(t.subarray(1, 4)),
            handlerType: Ut(t.subarray(8, 12)),
            name: "",
          },
          i = 8;
        for (i = 24; i < t.byteLength; i++) {
          if (0 === t[i]) {
            i++;
            break;
          }
          e.name += String.fromCharCode(t[i]);
        }
        return (e.name = decodeURIComponent(escape(e.name))), e;
      },
      mdat: function (t) {
        return { byteLength: t.byteLength, nals: Hi(t) };
      },
      mdhd: function (t) {
        var e,
          i = new DataView(t.buffer, t.byteOffset, t.byteLength),
          n = 4,
          a = { version: i.getUint8(0), flags: new Uint8Array(t.subarray(1, 4)), language: "" };
        return (
          1 === a.version
            ? ((n += 4),
              (a.creationTime = Yi(i.getUint32(n))),
              (n += 8),
              (a.modificationTime = Yi(i.getUint32(n))),
              (n += 4),
              (a.timescale = i.getUint32(n)),
              (n += 8),
              (a.duration = i.getUint32(n)))
            : ((a.creationTime = Yi(i.getUint32(n))),
              (n += 4),
              (a.modificationTime = Yi(i.getUint32(n))),
              (n += 4),
              (a.timescale = i.getUint32(n)),
              (n += 4),
              (a.duration = i.getUint32(n))),
          (n += 4),
          (e = i.getUint16(n)),
          (a.language += String.fromCharCode(96 + (e >> 10))),
          (a.language += String.fromCharCode(96 + ((992 & e) >> 5))),
          (a.language += String.fromCharCode(96 + (31 & e))),
          a
        );
      },
      mdia: function (t) {
        return { boxes: Vi(t) };
      },
      mfhd: function (t) {
        return {
          version: t[0],
          flags: new Uint8Array(t.subarray(1, 4)),
          sequenceNumber: (t[4] << 24) | (t[5] << 16) | (t[6] << 8) | t[7],
        };
      },
      minf: function (t) {
        return { boxes: Vi(t) };
      },
      mp4a: function (t) {
        var e = new DataView(t.buffer, t.byteOffset, t.byteLength),
          i = {
            dataReferenceIndex: e.getUint16(6),
            channelcount: e.getUint16(16),
            samplesize: e.getUint16(18),
            samplerate: e.getUint16(24) + e.getUint16(26) / 65536,
          };
        return t.byteLength > 28 && (i.streamDescriptor = Vi(t.subarray(28))[0]), i;
      },
      moof: function (t) {
        return { boxes: Vi(t) };
      },
      moov: function (t) {
        return { boxes: Vi(t) };
      },
      mvex: function (t) {
        return { boxes: Vi(t) };
      },
      mvhd: function (t) {
        var e = new DataView(t.buffer, t.byteOffset, t.byteLength),
          i = 4,
          n = { version: e.getUint8(0), flags: new Uint8Array(t.subarray(1, 4)) };
        return (
          1 === n.version
            ? ((i += 4),
              (n.creationTime = Yi(e.getUint32(i))),
              (i += 8),
              (n.modificationTime = Yi(e.getUint32(i))),
              (i += 4),
              (n.timescale = e.getUint32(i)),
              (i += 8),
              (n.duration = e.getUint32(i)))
            : ((n.creationTime = Yi(e.getUint32(i))),
              (i += 4),
              (n.modificationTime = Yi(e.getUint32(i))),
              (i += 4),
              (n.timescale = e.getUint32(i)),
              (i += 4),
              (n.duration = e.getUint32(i))),
          (i += 4),
          (n.rate = e.getUint16(i) + e.getUint16(i + 2) / 16),
          (i += 4),
          (n.volume = e.getUint8(i) + e.getUint8(i + 1) / 8),
          (i += 2),
          (i += 2),
          (i += 8),
          (n.matrix = new Uint32Array(t.subarray(i, i + 36))),
          (i += 36),
          (i += 24),
          (n.nextTrackId = e.getUint32(i)),
          n
        );
      },
      pdin: function (t) {
        var e = new DataView(t.buffer, t.byteOffset, t.byteLength);
        return {
          version: e.getUint8(0),
          flags: new Uint8Array(t.subarray(1, 4)),
          rate: e.getUint32(4),
          initialDelay: e.getUint32(8),
        };
      },
      sdtp: function (t) {
        var e,
          i = { version: t[0], flags: new Uint8Array(t.subarray(1, 4)), samples: [] };
        for (e = 4; e < t.byteLength; e++)
          i.samples.push({ dependsOn: (48 & t[e]) >> 4, isDependedOn: (12 & t[e]) >> 2, hasRedundancy: 3 & t[e] });
        return i;
      },
      sidx: function (t) {
        var e = new DataView(t.buffer, t.byteOffset, t.byteLength),
          i = {
            version: t[0],
            flags: new Uint8Array(t.subarray(1, 4)),
            references: [],
            referenceId: e.getUint32(4),
            timescale: e.getUint32(8),
          },
          n = 12;
        0 === i.version
          ? ((i.earliestPresentationTime = e.getUint32(n)), (i.firstOffset = e.getUint32(n + 4)), (n += 8))
          : ((i.earliestPresentationTime = ji(t.subarray(n))), (i.firstOffset = ji(t.subarray(n + 8))), (n += 16)),
          (n += 2);
        var a = e.getUint16(n);
        for (n += 2; a > 0; n += 12, a--)
          i.references.push({
            referenceType: (128 & t[n]) >>> 7,
            referencedSize: 2147483647 & e.getUint32(n),
            subsegmentDuration: e.getUint32(n + 4),
            startsWithSap: !!(128 & t[n + 8]),
            sapType: (112 & t[n + 8]) >>> 4,
            sapDeltaTime: 268435455 & e.getUint32(n + 8),
          });
        return i;
      },
      smhd: function (t) {
        return { version: t[0], flags: new Uint8Array(t.subarray(1, 4)), balance: t[4] + t[5] / 256 };
      },
      stbl: function (t) {
        return { boxes: Vi(t) };
      },
      ctts: function (t) {
        var e,
          i = new DataView(t.buffer, t.byteOffset, t.byteLength),
          n = { version: i.getUint8(0), flags: new Uint8Array(t.subarray(1, 4)), compositionOffsets: [] },
          a = i.getUint32(4);
        for (e = 8; a; e += 8, a--)
          n.compositionOffsets.push({
            sampleCount: i.getUint32(e),
            sampleOffset: i[0 === n.version ? "getUint32" : "getInt32"](e + 4),
          });
        return n;
      },
      stss: function (t) {
        var e,
          i = new DataView(t.buffer, t.byteOffset, t.byteLength),
          n = { version: i.getUint8(0), flags: new Uint8Array(t.subarray(1, 4)), syncSamples: [] },
          a = i.getUint32(4);
        for (e = 8; a; e += 4, a--) n.syncSamples.push(i.getUint32(e));
        return n;
      },
      stco: function (t) {
        var e,
          i = new DataView(t.buffer, t.byteOffset, t.byteLength),
          n = { version: t[0], flags: new Uint8Array(t.subarray(1, 4)), chunkOffsets: [] },
          a = i.getUint32(4);
        for (e = 8; a; e += 4, a--) n.chunkOffsets.push(i.getUint32(e));
        return n;
      },
      stsc: function (t) {
        var e,
          i = new DataView(t.buffer, t.byteOffset, t.byteLength),
          n = i.getUint32(4),
          a = { version: t[0], flags: new Uint8Array(t.subarray(1, 4)), sampleToChunks: [] };
        for (e = 8; n; e += 12, n--)
          a.sampleToChunks.push({
            firstChunk: i.getUint32(e),
            samplesPerChunk: i.getUint32(e + 4),
            sampleDescriptionIndex: i.getUint32(e + 8),
          });
        return a;
      },
      stsd: function (t) {
        return { version: t[0], flags: new Uint8Array(t.subarray(1, 4)), sampleDescriptions: Vi(t.subarray(8)) };
      },
      stsz: function (t) {
        var e,
          i = new DataView(t.buffer, t.byteOffset, t.byteLength),
          n = { version: t[0], flags: new Uint8Array(t.subarray(1, 4)), sampleSize: i.getUint32(4), entries: [] };
        for (e = 12; e < t.byteLength; e += 4) n.entries.push(i.getUint32(e));
        return n;
      },
      stts: function (t) {
        var e,
          i = new DataView(t.buffer, t.byteOffset, t.byteLength),
          n = { version: t[0], flags: new Uint8Array(t.subarray(1, 4)), timeToSamples: [] },
          a = i.getUint32(4);
        for (e = 8; a; e += 8, a--)
          n.timeToSamples.push({ sampleCount: i.getUint32(e), sampleDelta: i.getUint32(e + 4) });
        return n;
      },
      styp: function (t) {
        return Xi.ftyp(t);
      },
      tfdt: xt,
      tfhd: Ct,
      tkhd: function (t) {
        var e = new DataView(t.buffer, t.byteOffset, t.byteLength),
          i = 4,
          n = { version: e.getUint8(0), flags: new Uint8Array(t.subarray(1, 4)) };
        return (
          1 === n.version
            ? ((i += 4),
              (n.creationTime = Yi(e.getUint32(i))),
              (i += 8),
              (n.modificationTime = Yi(e.getUint32(i))),
              (i += 4),
              (n.trackId = e.getUint32(i)),
              (i += 4),
              (i += 8),
              (n.duration = e.getUint32(i)))
            : ((n.creationTime = Yi(e.getUint32(i))),
              (i += 4),
              (n.modificationTime = Yi(e.getUint32(i))),
              (i += 4),
              (n.trackId = e.getUint32(i)),
              (i += 4),
              (i += 4),
              (n.duration = e.getUint32(i))),
          (i += 4),
          (i += 8),
          (n.layer = e.getUint16(i)),
          (i += 2),
          (n.alternateGroup = e.getUint16(i)),
          (i += 2),
          (n.volume = e.getUint8(i) + e.getUint8(i + 1) / 8),
          (i += 2),
          (i += 2),
          (n.matrix = new Uint32Array(t.subarray(i, i + 36))),
          (i += 36),
          (n.width = e.getUint16(i) + e.getUint16(i + 2) / 65536),
          (i += 4),
          (n.height = e.getUint16(i) + e.getUint16(i + 2) / 65536),
          n
        );
      },
      traf: function (t) {
        return { boxes: Vi(t) };
      },
      trak: function (t) {
        return { boxes: Vi(t) };
      },
      trex: function (t) {
        var e = new DataView(t.buffer, t.byteOffset, t.byteLength);
        return {
          version: t[0],
          flags: new Uint8Array(t.subarray(1, 4)),
          trackId: e.getUint32(4),
          defaultSampleDescriptionIndex: e.getUint32(8),
          defaultSampleDuration: e.getUint32(12),
          defaultSampleSize: e.getUint32(16),
          sampleDependsOn: 3 & t[20],
          sampleIsDependedOn: (192 & t[21]) >> 6,
          sampleHasRedundancy: (48 & t[21]) >> 4,
          samplePaddingValue: (14 & t[21]) >> 1,
          sampleIsDifferenceSample: !!(1 & t[21]),
          sampleDegradationPriority: e.getUint16(22),
        };
      },
      trun: Lt,
      "url ": function (t) {
        return { version: t[0], flags: new Uint8Array(t.subarray(1, 4)) };
      },
      vmhd: function (t) {
        var e = new DataView(t.buffer, t.byteOffset, t.byteLength);
        return {
          version: t[0],
          flags: new Uint8Array(t.subarray(1, 4)),
          graphicsmode: e.getUint16(4),
          opcolor: new Uint16Array([e.getUint16(6), e.getUint16(8), e.getUint16(10)]),
        };
      },
    },
    Ki = {
      inspect: (Vi = function (t) {
        for (
          var e, i, n, a, r, s = 0, o = [], d = new ArrayBuffer(t.length), h = new Uint8Array(d), p = 0;
          p < t.length;
          ++p
        )
          h[p] = t[p];
        for (e = new DataView(d); s < t.byteLength; )
          (i = e.getUint32(s)),
            (n = Ut(t.subarray(s + 4, s + 8))),
            (a = i > 1 ? s + i : t.byteLength),
            ((r = (
              Xi[n] ||
              function (t) {
                return { data: t };
              }
            )(t.subarray(s + 8, a))).size = i),
            (r.type = n),
            o.push(r),
            (s = a);
        return o;
      }),
      textify: (Gi = function (t, e) {
        var i;
        return (
          (e = e || 0),
          (i = new Array(2 * e + 1).join(" ")),
          t
            .map(function (t, n) {
              return (
                i +
                t.type +
                "\n" +
                Object.keys(t)
                  .filter(function (t) {
                    return "type" !== t && "boxes" !== t;
                  })
                  .map(function (e) {
                    var n = i + "  " + e + ": ",
                      a = t[e];
                    if (a instanceof Uint8Array || a instanceof Uint32Array) {
                      var r = Array.prototype.slice
                        .call(new Uint8Array(a.buffer, a.byteOffset, a.byteLength))
                        .map(function (t) {
                          return " " + ("00" + t.toString(16)).slice(-2);
                        })
                        .join("")
                        .match(/.{1,24}/g);
                      return r
                        ? 1 === r.length
                          ? n + "<" + r.join("").slice(1) + ">"
                          : n +
                            "<\n" +
                            r
                              .map(function (t) {
                                return i + "  " + t;
                              })
                              .join("\n") +
                            "\n" +
                            i +
                            "  >"
                        : n + "<>";
                    }
                    return (
                      n +
                      JSON.stringify(a, null, 2)
                        .split("\n")
                        .map(function (t, e) {
                          return 0 === e ? t : i + "  " + t;
                        })
                        .join("\n")
                    );
                  })
                  .join("\n") +
                (t.boxes ? "\n" + Gi(t.boxes, e + 1) : "")
              );
            })
            .join("\n")
        );
      }),
      parseType: Ut,
      findBox: Dt,
      parseTraf: Xi.traf,
      parseTfdt: Xi.tfdt,
      parseHdlr: Xi.hdlr,
      parseTfhd: Xi.tfhd,
      parseTrun: Xi.trun,
      parseSidx: Xi.sidx,
    },
    $i = { 8: "audio", 9: "video", 18: "metadata" },
    Zi = function (t) {
      for (var e, i = []; t.byteLength > 0; )
        (e = 0), i.push("0x" + ("00" + t[e++].toString(16)).slice(-2).toUpperCase()), (t = t.subarray(1));
      return i.join(" ");
    },
    Ji = function (t, e) {
      var i = t[0] & parseInt("00001111", 2);
      return (
        ((e = e || {}).frameType = [
          "Unknown",
          "Keyframe (for AVC, a seekable frame)",
          "Inter frame (for AVC, a nonseekable frame)",
          "Disposable inter frame (H.263 only)",
          "Generated keyframe (reserved for server use only)",
          "Video info/command frame",
        ][(t[0] & parseInt("11110000", 2)) >>> 4]),
        (e.codecID = i),
        7 === i
          ? (function (t, e) {
              var i = (t[1] & (parseInt("01111111", 2) << 16)) | (t[2] << 8) | t[3];
              return (
                ((e = e || {}).avcPacketType = ["AVC Sequence Header", "AVC NALU", "AVC End-of-Sequence"][t[0]]),
                (e.CompositionTime = t[1] & parseInt("10000000", 2) ? -i : i),
                1 === t[0] ? (e.nalUnitTypeRaw = Zi(t.subarray(4, 100))) : (e.data = Zi(t.subarray(4))),
                e
              );
            })(t.subarray(1), e)
          : e
      );
    },
    Qi = function (t, e) {
      var i = (t[0] & parseInt("11110000", 2)) >>> 4;
      return (
        ((e = e || {}).soundFormat = [
          "Linear PCM, platform endian",
          "ADPCM",
          "MP3",
          "Linear PCM, little endian",
          "Nellymoser 16-kHz mono",
          "Nellymoser 8-kHz mono",
          "Nellymoser",
          "G.711 A-law logarithmic PCM",
          "G.711 mu-law logarithmic PCM",
          "reserved",
          "AAC",
          "Speex",
          "MP3 8-Khz",
          "Device-specific sound",
        ][i]),
        (e.soundRate = ["5.5-kHz", "11-kHz", "22-kHz", "44-kHz"][(t[0] & parseInt("00001100", 2)) >>> 2]),
        (e.soundSize = (t[0] & parseInt("00000010", 2)) >>> 1 ? "16-bit" : "8-bit"),
        (e.soundType = t[0] & parseInt("00000001", 2) ? "Stereo" : "Mono"),
        10 === i
          ? (function (t, e) {
              return (
                ((e = e || {}).aacPacketType = ["AAC Sequence Header", "AAC Raw"][t[0]]),
                (e.data = Zi(t.subarray(1))),
                e
              );
            })(t.subarray(1), e)
          : e
      );
    },
    tn = function (t) {
      var e = (function (t) {
        return {
          tagType: $i[t[0]],
          dataSize: (t[1] << 16) | (t[2] << 8) | t[3],
          timestamp: (t[7] << 24) | (t[4] << 16) | (t[5] << 8) | t[6],
          streamID: (t[8] << 16) | (t[9] << 8) | t[10],
        };
      })(t);
      switch (t[0]) {
        case 8:
          Qi(t.subarray(11), e);
          break;
        case 9:
          Ji(t.subarray(11), e);
      }
      return e;
    },
    en = {
      inspectTag: tn,
      inspect: function (t) {
        var e,
          i,
          n = 9,
          a = [];
        for (n += 4; n < t.byteLength; )
          (e = t[n + 1] << 16),
            (e |= t[n + 2] << 8),
            (e |= t[n + 3]),
            (e += 11),
            (i = t.subarray(n, n + e)),
            a.push(tn(i)),
            (n += e + 4);
        return a;
      },
      textify: function (t) {
        return JSON.stringify(t, null, 2);
      },
    },
    nn = function (t) {
      var e = 31 & t[1];
      return (e <<= 8), (e |= t[2]);
    },
    an = function (t) {
      return !!(64 & t[1]);
    },
    rn = function (t) {
      var e = 0;
      return (48 & t[3]) >>> 4 > 1 && (e += t[4] + 1), e;
    },
    sn = function (t) {
      switch (t) {
        case 5:
          return "slice_layer_without_partitioning_rbsp_idr";
        case 6:
          return "sei_rbsp";
        case 7:
          return "seq_parameter_set_rbsp";
        case 8:
          return "pic_parameter_set_rbsp";
        case 9:
          return "access_unit_delimiter_rbsp";
        default:
          return null;
      }
    },
    on = {
      parseType: function (t, e) {
        var i = nn(t);
        return 0 === i ? "pat" : i === e ? "pmt" : e ? "pes" : null;
      },
      parsePat: function (t) {
        var e = an(t),
          i = 4 + rn(t);
        return e && (i += t[i] + 1), ((31 & t[i + 10]) << 8) | t[i + 11];
      },
      parsePmt: function (t) {
        var e = {},
          i = an(t),
          n = 4 + rn(t);
        if ((i && (n += t[n] + 1), 1 & t[n + 5])) {
          var a;
          a = 3 + (((15 & t[n + 1]) << 8) | t[n + 2]) - 4;
          for (var r = 12 + (((15 & t[n + 10]) << 8) | t[n + 11]); r < a; ) {
            var s = n + r;
            (e[((31 & t[s + 1]) << 8) | t[s + 2]] = t[s]), (r += 5 + (((15 & t[s + 3]) << 8) | t[s + 4]));
          }
          return e;
        }
      },
      parsePayloadUnitStartIndicator: an,
      parsePesType: function (t, e) {
        switch (e[nn(t)]) {
          case we.H264_STREAM_TYPE:
            return "video";
          case we.ADTS_STREAM_TYPE:
            return "audio";
          case we.METADATA_STREAM_TYPE:
            return "timed-metadata";
          default:
            return null;
        }
      },
      parsePesTime: function (t) {
        if (!an(t)) return null;
        var e = 4 + rn(t);
        if (e >= t.byteLength) return null;
        var i,
          n = null;
        return (
          192 & (i = t[e + 7]) &&
            (((n = {}).pts =
              ((14 & t[e + 9]) << 27) |
              ((255 & t[e + 10]) << 20) |
              ((254 & t[e + 11]) << 12) |
              ((255 & t[e + 12]) << 5) |
              ((254 & t[e + 13]) >>> 3)),
            (n.pts *= 4),
            (n.pts += (6 & t[e + 13]) >>> 1),
            (n.dts = n.pts),
            64 & i &&
              ((n.dts =
                ((14 & t[e + 14]) << 27) |
                ((255 & t[e + 15]) << 20) |
                ((254 & t[e + 16]) << 12) |
                ((255 & t[e + 17]) << 5) |
                ((254 & t[e + 18]) >>> 3)),
              (n.dts *= 4),
              (n.dts += (6 & t[e + 18]) >>> 1))),
          n
        );
      },
      videoPacketContainsKeyFrame: function (t) {
        for (var e = 4 + rn(t), i = t.subarray(e), n = 0, a = 0, r = !1; a < i.byteLength - 3; a++)
          if (1 === i[a + 2]) {
            n = a + 5;
            break;
          }
        for (; n < i.byteLength; )
          switch (i[n]) {
            case 0:
              if (0 !== i[n - 1]) {
                n += 2;
                break;
              }
              if (0 !== i[n - 2]) {
                n++;
                break;
              }
              a + 3 !== n - 2 && "slice_layer_without_partitioning_rbsp_idr" === sn(31 & i[a + 3]) && (r = !0);
              do {
                n++;
              } while (1 !== i[n] && n < i.length);
              (a = n - 2), (n += 3);
              break;
            case 1:
              if (0 !== i[n - 1] || 0 !== i[n - 2]) {
                n += 3;
                break;
              }
              "slice_layer_without_partitioning_rbsp_idr" === sn(31 & i[a + 3]) && (r = !0), (a = n - 2), (n += 3);
              break;
            default:
              n += 3;
          }
        return (
          (i = i.subarray(a)),
          (n -= a),
          (a = 0),
          i && i.byteLength > 3 && "slice_layer_without_partitioning_rbsp_idr" === sn(31 & i[a + 3]) && (r = !0),
          r
        );
      },
    },
    dn = Ce,
    hn = {};
  (hn.ts = on), (hn.aac = $e);
  var pn = f,
    un = 188,
    ln = 71,
    cn = function (t, e, i) {
      for (var n, a, r, s, o = 0, d = un, h = !1; d <= t.byteLength; )
        if (t[o] !== ln || (t[d] !== ln && d !== t.byteLength)) o++, d++;
        else {
          switch (((n = t.subarray(o, d)), hn.ts.parseType(n, e.pid))) {
            case "pes":
              (a = hn.ts.parsePesType(n, e.table)),
                (r = hn.ts.parsePayloadUnitStartIndicator(n)),
                "audio" === a && r && (s = hn.ts.parsePesTime(n)) && ((s.type = "audio"), i.audio.push(s), (h = !0));
          }
          if (h) break;
          (o += un), (d += un);
        }
      for (o = (d = t.byteLength) - un, h = !1; o >= 0; )
        if (t[o] !== ln || (t[d] !== ln && d !== t.byteLength)) o--, d--;
        else {
          switch (((n = t.subarray(o, d)), hn.ts.parseType(n, e.pid))) {
            case "pes":
              (a = hn.ts.parsePesType(n, e.table)),
                (r = hn.ts.parsePayloadUnitStartIndicator(n)),
                "audio" === a && r && (s = hn.ts.parsePesTime(n)) && ((s.type = "audio"), i.audio.push(s), (h = !0));
          }
          if (h) break;
          (o -= un), (d -= un);
        }
    },
    fn = function (t, e, i) {
      for (var n, a, r, s, o, d, h, p = 0, u = un, l = !1, c = { data: [], size: 0 }; u < t.byteLength; )
        if (t[p] !== ln || t[u] !== ln) p++, u++;
        else {
          switch (((n = t.subarray(p, u)), hn.ts.parseType(n, e.pid))) {
            case "pes":
              if (
                ((a = hn.ts.parsePesType(n, e.table)),
                (r = hn.ts.parsePayloadUnitStartIndicator(n)),
                "video" === a &&
                  (r && !l && (s = hn.ts.parsePesTime(n)) && ((s.type = "video"), i.video.push(s), (l = !0)),
                  !i.firstKeyFrame))
              ) {
                if (r && 0 !== c.size) {
                  for (o = new Uint8Array(c.size), d = 0; c.data.length; )
                    (h = c.data.shift()), o.set(h, d), (d += h.byteLength);
                  if (hn.ts.videoPacketContainsKeyFrame(o)) {
                    var f = hn.ts.parsePesTime(o);
                    f
                      ? ((i.firstKeyFrame = f), (i.firstKeyFrame.type = "video"))
                      : console.warn(
                          "Failed to extract PTS/DTS from PES at first keyframe. This could be an unusual TS segment, or else mux.js did not parse your TS segment correctly. If you know your TS segments do contain PTS/DTS on keyframes please file a bug report! You can try ffprobe to double check for yourself."
                        );
                  }
                  c.size = 0;
                }
                c.data.push(n), (c.size += n.byteLength);
              }
          }
          if (l && i.firstKeyFrame) break;
          (p += un), (u += un);
        }
      for (p = (u = t.byteLength) - un, l = !1; p >= 0; )
        if (t[p] !== ln || t[u] !== ln) p--, u--;
        else {
          switch (((n = t.subarray(p, u)), hn.ts.parseType(n, e.pid))) {
            case "pes":
              (a = hn.ts.parsePesType(n, e.table)),
                (r = hn.ts.parsePayloadUnitStartIndicator(n)),
                "video" === a && r && (s = hn.ts.parsePesTime(n)) && ((s.type = "video"), i.video.push(s), (l = !0));
          }
          if (l) break;
          (p -= un), (u -= un);
        }
    },
    gn = function (t) {
      var e = { pid: null, table: null },
        i = {};
      for (var n in ((function (t, e) {
        for (var i, n = 0, a = un; a < t.byteLength; )
          if (t[n] !== ln || t[a] !== ln) n++, a++;
          else {
            switch (((i = t.subarray(n, a)), hn.ts.parseType(i, e.pid))) {
              case "pat":
                e.pid = hn.ts.parsePat(i);
                break;
              case "pmt":
                var r = hn.ts.parsePmt(i);
                (e.table = e.table || {}),
                  Object.keys(r).forEach(function (t) {
                    e.table[t] = r[t];
                  });
            }
            (n += un), (a += un);
          }
      })(t, e),
      e.table)) {
        if (e.table.hasOwnProperty(n))
          switch (e.table[n]) {
            case we.H264_STREAM_TYPE:
              (i.video = []), fn(t, e, i), 0 === i.video.length && delete i.video;
              break;
            case we.ADTS_STREAM_TYPE:
              (i.audio = []), cn(t, e, i), 0 === i.audio.length && delete i.audio;
          }
      }
      return i;
    },
    mn = {
      inspect: function (t, e) {
        var i;
        return (i = hn.aac.isLikelyAacData(t)
          ? (function (t) {
              for (var e, i = !1, n = 0, a = null, r = null, s = 0, o = 0; t.length - o >= 3; ) {
                switch (hn.aac.parseType(t, o)) {
                  case "timed-metadata":
                    if (t.length - o < 10) {
                      i = !0;
                      break;
                    }
                    if ((s = hn.aac.parseId3TagSize(t, o)) > t.length) {
                      i = !0;
                      break;
                    }
                    null === r && ((e = t.subarray(o, o + s)), (r = hn.aac.parseAacTimestamp(e))), (o += s);
                    break;
                  case "audio":
                    if (t.length - o < 7) {
                      i = !0;
                      break;
                    }
                    if ((s = hn.aac.parseAdtsSize(t, o)) > t.length) {
                      i = !0;
                      break;
                    }
                    null === a && ((e = t.subarray(o, o + s)), (a = hn.aac.parseSampleRate(e))), n++, (o += s);
                    break;
                  default:
                    o++;
                }
                if (i) return null;
              }
              if (null === a || null === r) return null;
              var d = pn / a;
              return {
                audio: [
                  { type: "audio", dts: r, pts: r },
                  { type: "audio", dts: r + 1024 * n * d, pts: r + 1024 * n * d },
                ],
              };
            })(t)
          : gn(t)) &&
          (i.audio || i.video)
          ? ((function (t, e) {
              if (t.audio && t.audio.length) {
                var i = e;
                (void 0 === i || isNaN(i)) && (i = t.audio[0].dts),
                  t.audio.forEach(function (t) {
                    (t.dts = dn(t.dts, i)), (t.pts = dn(t.pts, i)), (t.dtsTime = t.dts / pn), (t.ptsTime = t.pts / pn);
                  });
              }
              if (t.video && t.video.length) {
                var n = e;
                if (
                  ((void 0 === n || isNaN(n)) && (n = t.video[0].dts),
                  t.video.forEach(function (t) {
                    (t.dts = dn(t.dts, n)), (t.pts = dn(t.pts, n)), (t.dtsTime = t.dts / pn), (t.ptsTime = t.pts / pn);
                  }),
                  t.firstKeyFrame)
                ) {
                  var a = t.firstKeyFrame;
                  (a.dts = dn(a.dts, n)), (a.pts = dn(a.pts, n)), (a.dtsTime = a.dts / pn), (a.ptsTime = a.pts / pn);
                }
              }
            })(i, e),
            i)
          : null;
      },
      parseAudioPes_: cn,
    },
    yn = { codecs: ct, mp4: yi, flv: Li, mp2t: Ii, partial: Wi };
  return (yn.mp4.tools = Ki), (yn.flv.tools = en), (yn.mp2t.tools = mn), yn;
});
