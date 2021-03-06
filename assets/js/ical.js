"object" == typeof module ? ICAL = module.exports : "object" != typeof ICAL && (this.ICAL = {}), ICAL.foldLength = 75, ICAL.newLineChar = "\r\n", ICAL.helpers = {
		isStrictlyNaN: function (a) {
			return "number" == typeof a && isNaN(a)
		},
		strictParseInt: function (a) {
			var b = parseInt(a, 10);
			if (ICAL.helpers.isStrictlyNaN(b)) throw new Error('Could not extract integer from "' + a + '"');
			return b
		},
		formatClassType: function (a, b) {
			if ("undefined" != typeof a) return a instanceof b ? a : new b(a)
		},
		unescapedIndexOf: function (a, b, c) {
			for (;
				(c = a.indexOf(b, c)) !== -1;) {
				if (!(c > 0 && "\\" === a[c - 1])) return c;
				c += 1
			}
			return -1
		},
		binsearchInsert: function (a, b, c) {
			if (!a.length) return 0;
			for (var d, e, f = 0, g = a.length - 1; f <= g;)
				if (d = f + Math.floor((g - f) / 2), e = c(b, a[d]), e < 0) g = d - 1;
				else {
					if (!(e > 0)) break;
					f = d + 1
				} return e < 0 ? d : e > 0 ? d + 1 : d
		},
		dumpn: function () {
			ICAL.debug && ("undefined" != typeof console && "log" in console ? ICAL.helpers.dumpn = function (a) {
				console.log(a)
			} : ICAL.helpers.dumpn = function (a) {
				dump(a + "\n")
			}, ICAL.helpers.dumpn(arguments[0]))
		},
		clone: function (a, b) {
			if (a && "object" == typeof a) {
				if (a instanceof Date) return new Date(a.getTime());
				if ("clone" in a) return a.clone();
				if (Array.isArray(a)) {
					for (var c = [], d = 0; d < a.length; d++) c.push(b ? ICAL.helpers.clone(a[d], !0) : a[d]);
					return c
				}
				var e = {};
				for (var f in a) Object.prototype.hasOwnProperty.call(a, f) && (b ? e[f] = ICAL.helpers.clone(a[f], !0) : e[f] = a[f]);
				return e
			}
			return a
		},
		foldline: function (a) {
			for (var b = "", c = a || ""; c.length;) b += ICAL.newLineChar + " " + c.substr(0, ICAL.foldLength), c = c.substr(ICAL.foldLength);
			return b.substr(ICAL.newLineChar.length + 1)
		},
		pad2: function (a) {
			"string" != typeof a && ("number" == typeof a && (a = parseInt(a)), a = String(a));
			var b = a.length;
			switch (b) {
				case 0:
					return "00";
				case 1:
					return "0" + a;
				default:
					return a
			}
		},
		trunc: function (a) {
			return a < 0 ? Math.ceil(a) : Math.floor(a)
		},
		inherits: function (a, b, c) {
			function d() {}
			d.prototype = a.prototype, b.prototype = new d, c && ICAL.helpers.extend(c, b.prototype)
		},
		extend: function (a, b) {
			for (var c in a) {
				var d = Object.getOwnPropertyDescriptor(a, c);
				d && !Object.getOwnPropertyDescriptor(b, c) && Object.defineProperty(b, c, d)
			}
			return b
		}
	}, ICAL.design = function () {
		"use strict";

		function a(a, b) {
			var d = {
				matches: /.*/,
				fromICAL: function (b, d) {
					return c(b, a, d)
				},
				toICAL: function (a, c) {
					var d = b;
					return c && (d = new RegExp(d.source + "|" + c)), a.replace(d, function (a) {
						switch (a) {
							case "\\":
								return "\\\\";
							case ";":
								return "\\;";
							case ",":
								return "\\,";
							case "\n":
								return "\\n";
							default:
								return a
						}
					})
				}
			};
			return d
		}

		function b(a) {
			switch (a) {
				case "\\\\":
					return "\\";
				case "\\;":
					return ";";
				case "\\,":
					return ",";
				case "\\n":
				case "\\N":
					return "\n";
				default:
					return a
			}
		}

		function c(a, c, d) {
			return a.indexOf("\\") === -1 ? a : (d && (c = new RegExp(c.source + "|\\\\" + d)), a.replace(c, b))
		}
		var d = /\\\\|\\;|\\,|\\[Nn]/g,
			e = /\\|;|,|\n/g,
			f = /\\\\|\\,|\\[Nn]/g,
			g = /\\|,|\n/g,
			h = {
				defaultType: "text"
			},
			i = {
				defaultType: "text",
				multiValue: ","
			},
			j = {
				defaultType: "text",
				structuredValue: ";"
			},
			k = {
				defaultType: "integer"
			},
			l = {
				defaultType: "date-time",
				allowedTypes: ["date-time", "date"]
			},
			m = {
				defaultType: "date-time"
			},
			n = {
				defaultType: "uri"
			},
			o = {
				defaultType: "utc-offset"
			},
			p = {
				defaultType: "recur"
			},
			q = {
				defaultType: "date-and-or-time",
				allowedTypes: ["date-time", "date", "text"]
			},
			r = {
				categories: i,
				url: n,
				version: h,
				uid: h
			},
			s = {
				boolean: {
					values: ["TRUE", "FALSE"],
					fromICAL: function (a) {
						switch (a) {
							case "TRUE":
								return !0;
							case "FALSE":
								return !1;
							default:
								return !1
						}
					},
					toICAL: function (a) {
						return a ? "TRUE" : "FALSE"
					}
				},
				float: {
					matches: /^[+-]?\d+\.\d+$/,
					fromICAL: function (a) {
						var b = parseFloat(a);
						return ICAL.helpers.isStrictlyNaN(b) ? 0 : b
					},
					toICAL: function (a) {
						return String(a)
					}
				},
				integer: {
					fromICAL: function (a) {
						var b = parseInt(a);
						return ICAL.helpers.isStrictlyNaN(b) ? 0 : b
					},
					toICAL: function (a) {
						return String(a)
					}
				},
				"utc-offset": {
					toICAL: function (a) {
						return a.length < 7 ? a.substr(0, 3) + a.substr(4, 2) : a.substr(0, 3) + a.substr(4, 2) + a.substr(7, 2)
					},
					fromICAL: function (a) {
						return a.length < 6 ? a.substr(0, 3) + ":" + a.substr(3, 2) : a.substr(0, 3) + ":" + a.substr(3, 2) + ":" + a.substr(5, 2)
					},
					decorate: function (a) {
						return ICAL.UtcOffset.fromString(a)
					},
					undecorate: function (a) {
						return a.toString()
					}
				}
			},
			t = {
				cutype: {
					values: ["INDIVIDUAL", "GROUP", "RESOURCE", "ROOM", "UNKNOWN"],
					allowXName: !0,
					allowIanaToken: !0
				},
				"delegated-from": {
					valueType: "cal-address",
					multiValue: ",",
					multiValueSeparateDQuote: !0
				},
				"delegated-to": {
					valueType: "cal-address",
					multiValue: ",",
					multiValueSeparateDQuote: !0
				},
				encoding: {
					values: ["8BIT", "BASE64"]
				},
				fbtype: {
					values: ["FREE", "BUSY", "BUSY-UNAVAILABLE", "BUSY-TENTATIVE"],
					allowXName: !0,
					allowIanaToken: !0
				},
				member: {
					valueType: "cal-address",
					multiValue: ",",
					multiValueSeparateDQuote: !0
				},
				partstat: {
					values: ["NEEDS-ACTION", "ACCEPTED", "DECLINED", "TENTATIVE", "DELEGATED", "COMPLETED", "IN-PROCESS"],
					allowXName: !0,
					allowIanaToken: !0
				},
				range: {
					values: ["THISLANDFUTURE"]
				},
				related: {
					values: ["START", "END"]
				},
				reltype: {
					values: ["PARENT", "CHILD", "SIBLING"],
					allowXName: !0,
					allowIanaToken: !0
				},
				role: {
					values: ["REQ-PARTICIPANT", "CHAIR", "OPT-PARTICIPANT", "NON-PARTICIPANT"],
					allowXName: !0,
					allowIanaToken: !0
				},
				rsvp: {
					values: ["TRUE", "FALSE"]
				},
				"sent-by": {
					valueType: "cal-address"
				},
				tzid: {
					matches: /^\//
				},
				value: {
					values: ["binary", "boolean", "cal-address", "date", "date-time", "duration", "float", "integer", "period", "recur", "text", "time", "uri", "utc-offset"],
					allowXName: !0,
					allowIanaToken: !0
				}
			},
			u = ICAL.helpers.extend(s, {
				text: a(d, e),
				uri: {},
				binary: {
					decorate: function (a) {
						return ICAL.Binary.fromString(a)
					},
					undecorate: function (a) {
						return a.toString()
					}
				},
				"cal-address": {},
				date: {
					decorate: function (a, b) {
						return ICAL.Time.fromDateString(a, b)
					},
					undecorate: function (a) {
						return a.toString()
					},
					fromICAL: function (a) {
						return a.substr(0, 4) + "-" + a.substr(4, 2) + "-" + a.substr(6, 2)
					},
					toICAL: function (a) {
						return a.length > 11 ? a : a.substr(0, 4) + a.substr(5, 2) + a.substr(8, 2)
					}
				},
				"date-time": {
					fromICAL: function (a) {
						var b = a.substr(0, 4) + "-" + a.substr(4, 2) + "-" + a.substr(6, 2) + "T" + a.substr(9, 2) + ":" + a.substr(11, 2) + ":" + a.substr(13, 2);
						return a[15] && "Z" === a[15] && (b += "Z"), b
					},
					toICAL: function (a) {
						if (a.length < 19) return a;
						var b = a.substr(0, 4) + a.substr(5, 2) + a.substr(8, 5) + a.substr(14, 2) + a.substr(17, 2);
						return a[19] && "Z" === a[19] && (b += "Z"), b
					},
					decorate: function (a, b) {
						return ICAL.Time.fromDateTimeString(a, b)
					},
					undecorate: function (a) {
						return a.toString()
					}
				},
				duration: {
					decorate: function (a) {
						return ICAL.Duration.fromString(a)
					},
					undecorate: function (a) {
						return a.toString()
					}
				},
				period: {
					fromICAL: function (a) {
						var b = a.split("/");
						return b[0] = u["date-time"].fromICAL(b[0]), ICAL.Duration.isValueString(b[1]) || (b[1] = u["date-time"].fromICAL(b[1])), b
					},
					toICAL: function (a) {
						return a[0] = u["date-time"].toICAL(a[0]), ICAL.Duration.isValueString(a[1]) || (a[1] = u["date-time"].toICAL(a[1])), a.join("/")
					},
					decorate: function (a, b) {
						return ICAL.Period.fromJSON(a, b)
					},
					undecorate: function (a) {
						return a.toJSON()
					}
				},
				recur: {
					fromICAL: function (a) {
						return ICAL.Recur._stringToData(a, !0)
					},
					toICAL: function (a) {
						var b = "";
						for (var c in a)
							if (Object.prototype.hasOwnProperty.call(a, c)) {
								var d = a[c];
								"until" == c ? d = d.length > 10 ? u["date-time"].toICAL(d) : u.date.toICAL(d) : "wkst" == c ? "number" == typeof d && (d = ICAL.Recur.numericDayToIcalDay(d)) : Array.isArray(d) && (d = d.join(",")), b += c.toUpperCase() + "=" + d + ";"
							} return b.substr(0, b.length - 1)
					},
					decorate: function (a) {
						return ICAL.Recur.fromData(a)
					},
					undecorate: function (a) {
						return a.toJSON()
					}
				},
				time: {
					fromICAL: function (a) {
						if (a.length < 6) return a;
						var b = a.substr(0, 2) + ":" + a.substr(2, 2) + ":" + a.substr(4, 2);
						return "Z" === a[6] && (b += "Z"), b
					},
					toICAL: function (a) {
						if (a.length < 8) return a;
						var b = a.substr(0, 2) + a.substr(3, 2) + a.substr(6, 2);
						return "Z" === a[8] && (b += "Z"), b
					}
				}
			}),
			v = ICAL.helpers.extend(r, {
				action: h,
				attach: {
					defaultType: "uri"
				},
				attendee: {
					defaultType: "cal-address"
				},
				calscale: h,
				class: h,
				comment: h,
				completed: m,
				contact: h,
				created: m,
				description: h,
				dtend: l,
				dtstamp: m,
				dtstart: l,
				due: l,
				duration: {
					defaultType: "duration"
				},
				exdate: {
					defaultType: "date-time",
					allowedTypes: ["date-time", "date"],
					multiValue: ","
				},
				exrule: p,
				freebusy: {
					defaultType: "period",
					multiValue: ","
				},
				geo: {
					defaultType: "float",
					structuredValue: ";"
				},
				"last-modified": m,
				location: h,
				method: h,
				organizer: {
					defaultType: "cal-address"
				},
				"percent-complete": k,
				priority: k,
				prodid: h,
				"related-to": h,
				repeat: k,
				rdate: {
					defaultType: "date-time",
					allowedTypes: ["date-time", "date", "period"],
					multiValue: ",",
					detectType: function (a) {
						return a.indexOf("/") !== -1 ? "period" : a.indexOf("T") === -1 ? "date" : "date-time"
					}
				},
				"recurrence-id": l,
				resources: i,
				"request-status": j,
				rrule: p,
				sequence: k,
				status: h,
				summary: h,
				transp: h,
				trigger: {
					defaultType: "duration",
					allowedTypes: ["duration", "date-time"]
				},
				tzoffsetfrom: o,
				tzoffsetto: o,
				tzurl: n,
				tzid: h,
				tzname: h
			}),
			w = ICAL.helpers.extend(s, {
				text: a(f, g),
				uri: a(f, g),
				date: {
					decorate: function (a) {
						return ICAL.VCardTime.fromDateAndOrTimeString(a, "date")
					},
					undecorate: function (a) {
						return a.toString()
					},
					fromICAL: function (a) {
						return 8 == a.length ? u.date.fromICAL(a) : "-" == a[0] && 6 == a.length ? a.substr(0, 4) + "-" + a.substr(4) : a
					},
					toICAL: function (a) {
						return 10 == a.length ? u.date.toICAL(a) : "-" == a[0] && 7 == a.length ? a.substr(0, 4) + a.substr(5) : a
					}
				},
				time: {
					decorate: function (a) {
						return ICAL.VCardTime.fromDateAndOrTimeString("T" + a, "time")
					},
					undecorate: function (a) {
						return a.toString()
					},
					fromICAL: function (a) {
						var b = w.time._splitZone(a, !0),
							c = b[0],
							d = b[1];
						return 6 == d.length ? d = d.substr(0, 2) + ":" + d.substr(2, 2) + ":" + d.substr(4, 2) : 4 == d.length && "-" != d[0] ? d = d.substr(0, 2) + ":" + d.substr(2, 2) : 5 == d.length && (d = d.substr(0, 3) + ":" + d.substr(3, 2)), 5 != c.length || "-" != c[0] && "+" != c[0] || (c = c.substr(0, 3) + ":" + c.substr(3)), d + c
					},
					toICAL: function (a) {
						var b = w.time._splitZone(a),
							c = b[0],
							d = b[1];
						return 8 == d.length ? d = d.substr(0, 2) + d.substr(3, 2) + d.substr(6, 2) : 5 == d.length && "-" != d[0] ? d = d.substr(0, 2) + d.substr(3, 2) : 6 == d.length && (d = d.substr(0, 3) + d.substr(4, 2)), 6 != c.length || "-" != c[0] && "+" != c[0] || (c = c.substr(0, 3) + c.substr(4)), d + c
					},
					_splitZone: function (a, b) {
						var c, d, e = a.length - 1,
							f = a.length - (b ? 5 : 6),
							g = a[f];
						return "Z" == a[e] ? (c = a[e], d = a.substr(0, e)) : a.length > 6 && ("-" == g || "+" == g) ? (c = a.substr(f), d = a.substr(0, f)) : (c = "", d = a), [c, d]
					}
				},
				"date-time": {
					decorate: function (a) {
						return ICAL.VCardTime.fromDateAndOrTimeString(a, "date-time")
					},
					undecorate: function (a) {
						return a.toString()
					},
					fromICAL: function (a) {
						return w["date-and-or-time"].fromICAL(a)
					},
					toICAL: function (a) {
						return w["date-and-or-time"].toICAL(a)
					}
				},
				"date-and-or-time": {
					decorate: function (a) {
						return ICAL.VCardTime.fromDateAndOrTimeString(a, "date-and-or-time")
					},
					undecorate: function (a) {
						return a.toString()
					},
					fromICAL: function (a) {
						var b = a.split("T");
						return (b[0] ? w.date.fromICAL(b[0]) : "") + (b[1] ? "T" + w.time.fromICAL(b[1]) : "")
					},
					toICAL: function (a) {
						var b = a.split("T");
						return w.date.toICAL(b[0]) + (b[1] ? "T" + w.time.toICAL(b[1]) : "")
					}
				},
				timestamp: u["date-time"],
				"language-tag": {
					matches: /^[a-zA-Z0-9\-]+$/
				}
			}),
			x = {
				type: {
					valueType: "text",
					multiValue: ","
				},
				value: {
					values: ["text", "uri", "date", "time", "date-time", "date-and-or-time", "timestamp", "boolean", "integer", "float", "utc-offset", "language-tag"],
					allowXName: !0,
					allowIanaToken: !0
				}
			},
			y = ICAL.helpers.extend(r, {
				adr: {
					defaultType: "text",
					structuredValue: ";",
					multiValue: ","
				},
				anniversary: q,
				bday: q,
				caladruri: n,
				caluri: n,
				clientpidmap: j,
				email: h,
				fburl: n,
				fn: h,
				gender: j,
				geo: n,
				impp: n,
				key: n,
				kind: h,
				lang: {
					defaultType: "language-tag"
				},
				logo: n,
				member: n,
				n: {
					defaultType: "text",
					structuredValue: ";",
					multiValue: ","
				},
				nickname: i,
				note: h,
				org: {
					defaultType: "text",
					structuredValue: ";"
				},
				photo: n,
				related: n,
				rev: {
					defaultType: "timestamp"
				},
				role: h,
				sound: n,
				source: n,
				tel: {
					defaultType: "uri",
					allowedTypes: ["uri", "text"]
				},
				title: h,
				tz: {
					defaultType: "text",
					allowedTypes: ["text", "utc-offset", "uri"]
				},
				xml: h
			}),
			z = ICAL.helpers.extend(s, {
				binary: u.binary,
				date: w.date,
				"date-time": w["date-time"],
				"phone-number": {},
				uri: u.uri,
				text: u.text,
				time: u.time,
				vcard: u.text,
				"utc-offset": {
					toICAL: function (a) {
						return a.substr(0, 7)
					},
					fromICAL: function (a) {
						return a.substr(0, 7)
					},
					decorate: function (a) {
						return ICAL.UtcOffset.fromString(a)
					},
					undecorate: function (a) {
						return a.toString()
					}
				}
			}),
			A = {
				type: {
					valueType: "text",
					multiValue: ","
				},
				value: {
					values: ["text", "uri", "date", "date-time", "phone-number", "time", "boolean", "integer", "float", "utc-offset", "vcard", "binary"],
					allowXName: !0,
					allowIanaToken: !0
				}
			},
			B = ICAL.helpers.extend(r, {
				fn: h,
				n: {
					defaultType: "text",
					structuredValue: ";",
					multiValue: ","
				},
				nickname: i,
				photo: {
					defaultType: "binary",
					allowedTypes: ["binary", "uri"]
				},
				bday: {
					defaultType: "date-time",
					allowedTypes: ["date-time", "date"],
					detectType: function (a) {
						return a.indexOf("T") === -1 ? "date" : "date-time"
					}
				},
				adr: {
					defaultType: "text",
					structuredValue: ";",
					multiValue: ","
				},
				label: h,
				tel: {
					defaultType: "phone-number"
				},
				email: h,
				mailer: h,
				tz: {
					defaultType: "utc-offset",
					allowedTypes: ["utc-offset", "text"]
				},
				geo: {
					defaultType: "float",
					structuredValue: ";"
				},
				title: h,
				role: h,
				logo: {
					defaultType: "binary",
					allowedTypes: ["binary", "uri"]
				},
				agent: {
					defaultType: "vcard",
					allowedTypes: ["vcard", "text", "uri"]
				},
				org: j,
				note: i,
				prodid: h,
				rev: {
					defaultType: "date-time",
					allowedTypes: ["date-time", "date"],
					detectType: function (a) {
						return a.indexOf("T") === -1 ? "date" : "date-time"
					}
				},
				"sort-string": h,
				sound: {
					defaultType: "binary",
					allowedTypes: ["binary", "uri"]
				},
				class: h,
				key: {
					defaultType: "binary",
					allowedTypes: ["binary", "text"]
				}
			}),
			C = {
				value: u,
				param: t,
				property: v
			},
			D = {
				value: w,
				param: x,
				property: y
			},
			E = {
				value: z,
				param: A,
				property: B
			},
			F = {
				defaultSet: C,
				defaultType: "unknown",
				components: {
					vcard: D,
					vcard3: E,
					vevent: C,
					vtodo: C,
					vjournal: C,
					valarm: C,
					vtimezone: C,
					daylight: C,
					standard: C
				},
				icalendar: C,
				vcard: D,
				vcard3: E,
				getDesignSet: function (a) {
					var b = a && a in F.components;
					return b ? F.components[a] : F.defaultSet
				}
			};
		return F
	}(), ICAL.stringify = function () {
		"use strict";

		function a(c) {
			"string" == typeof c[0] && (c = [c]);
			for (var d = 0, e = c.length, f = ""; d < e; d++) f += a.component(c[d]) + b;
			return f
		}
		var b = "\r\n",
			c = "unknown",
			d = ICAL.design,
			e = ICAL.helpers;
		a.component = function (c, e) {
			var f = c[0].toUpperCase(),
				g = "BEGIN:" + f + b,
				h = c[1],
				i = 0,
				j = h.length,
				k = c[0];
			for ("vcard" === k && c[1].length > 0 && ("version" !== c[1][0][0] || "4.0" !== c[1][0][3]) && (k = "vcard3"), e = e || d.getDesignSet(k); i < j; i++) g += a.property(h[i], e) + b;
			for (var l = c[2], m = 0, n = l.length; m < n; m++) g += a.component(l[m], e) + b;
			return g += "END:" + f
		}, a.property = function (b, e, f) {
			var g, h = b[0].toUpperCase(),
				i = b[0],
				j = b[1],
				k = h;
			for (g in j) {
				var l = j[g];
				if (j.hasOwnProperty(g)) {
					var m = g in e.param && e.param[g].multiValue;
					m && Array.isArray(l) ? (e.param[g].multiValueSeparateDQuote && (m = '"' + m + '"'), l = l.map(a._rfc6868Unescape), l = a.multiValue(l, m, "unknown", null, e)) : l = a._rfc6868Unescape(l), k += ";" + g.toUpperCase(), k += "=" + a.propertyValue(l)
				}
			}
			if (3 === b.length) return k + ":";
			var n = b[2];
			e || (e = d.defaultSet);
			var o, m = !1,
				p = !1,
				q = !1;
			return i in e.property ? (o = e.property[i], "multiValue" in o && (m = o.multiValue), "structuredValue" in o && Array.isArray(b[3]) && (p = o.structuredValue), "defaultType" in o ? n === o.defaultType && (q = !0) : n === c && (q = !0)) : n === c && (q = !0), q || (k += ";VALUE=" + n.toUpperCase()), k += ":", k += m && p ? a.multiValue(b[3], p, n, m, e, p) : m ? a.multiValue(b.slice(3), m, n, null, e, !1) : p ? a.multiValue(b[3], p, n, null, e, p) : a.value(b[3], n, e, !1), f ? k : ICAL.helpers.foldline(k)
		}, a.propertyValue = function (a) {
			return e.unescapedIndexOf(a, ",") === -1 && e.unescapedIndexOf(a, ":") === -1 && e.unescapedIndexOf(a, ";") === -1 ? a : '"' + a + '"'
		}, a.multiValue = function (b, c, d, e, f, g) {
			for (var h = "", i = b.length, j = 0; j < i; j++) h += e && Array.isArray(b[j]) ? a.multiValue(b[j], e, d, null, f, g) : a.value(b[j], d, f, g), j !== i - 1 && (h += c);
			return h
		}, a.value = function (a, b, c, d) {
			return b in c.value && "toICAL" in c.value[b] ? c.value[b].toICAL(a, d) : a
		}, a._rfc6868Unescape = function (a) {
			return a.replace(/[\n^"]/g, function (a) {
				return f[a]
			})
		};
		var f = {
			'"': "^'",
			"\n": "^n",
			"^": "^^"
		};
		return a
	}(), ICAL.parse = function () {
		"use strict";

		function a(a) {
			this.message = a, this.name = "ParserError";
			try {
				throw new Error
			} catch (a) {
				if (a.stack) {
					var b = a.stack.split("\n");
					b.shift(), this.stack = b.join("\n")
				}
			}
		}

		function b(c) {
			var d = {},
				e = d.component = [];
			if (d.stack = [e], b._eachLine(c, function (a, c) {
					b._handleContentLine(c, d)
				}), d.stack.length > 1) throw new a("invalid ical body. component began but did not end");
			return d = null, 1 == e.length ? e[0] : e
		}
		var c = /[^ \t]/,
			d = ":",
			e = ";",
			f = "=",
			g = "unknown",
			h = "text",
			i = ICAL.design,
			j = ICAL.helpers;
		a.prototype = Error.prototype, b.property = function (a, c) {
			var d = {
				component: [
					[],
					[]
				],
				designSet: c || i.defaultSet
			};
			return b._handleContentLine(a, d), d.component[1][0]
		}, b.component = function (a) {
			return b(a)
		}, b.ParserError = a, b._handleContentLine = function (c, f) {
			var h, j, k, l, m = c.indexOf(d),
				n = c.indexOf(e),
				o = {};
			n !== -1 && m !== -1 && n > m && (n = -1);
			var p;
			if (n !== -1) {
				if (k = c.substring(0, n).toLowerCase(), p = b._parseParameters(c.substring(n), 0, f.designSet), p[2] == -1) throw new a("Invalid parameters in '" + c + "'");
				if (o = p[0], h = p[1].length + p[2] + n, (j = c.substring(h).indexOf(d)) === -1) throw new a("Missing parameter value in '" + c + "'");
				l = c.substring(h + j + 1)
			} else {
				if (m === -1) throw new a('invalid line (no token ";" or ":") "' + c + '"');
				if (k = c.substring(0, m).toLowerCase(), l = c.substring(m + 1), "begin" === k) {
					var q = [l.toLowerCase(), [],
						[]
					];
					return 1 === f.stack.length ? f.component.push(q) : f.component[2].push(q), f.stack.push(f.component), f.component = q, void(f.designSet || (f.designSet = i.getDesignSet(f.component[0])))
				}
				if ("end" === k) return void(f.component = f.stack.pop())
			}
			var r, s, t = !1,
				u = !1;
			k in f.designSet.property && (s = f.designSet.property[k], "multiValue" in s && (t = s.multiValue), "structuredValue" in s && (u = s.structuredValue), l && "detectType" in s && (r = s.detectType(l))), r || (r = "value" in o ? o.value.toLowerCase() : s ? s.defaultType : g), delete o.value;
			var v;
			t && u ? (l = b._parseMultiValue(l, u, r, [], t, f.designSet, u), v = [k, o, r, l]) : t ? (v = [k, o, r], b._parseMultiValue(l, t, r, v, null, f.designSet, !1)) : u ? (l = b._parseMultiValue(l, u, r, [], null, f.designSet, u), v = [k, o, r, l]) : (l = b._parseValue(l, r, f.designSet, !1), v = [k, o, r, l]), "vcard" !== f.component[0] || 0 !== f.component[1].length || "version" === k && "4.0" === l || (f.designSet = i.getDesignSet("vcard3")), f.component[1].push(v)
		}, b._parseValue = function (a, b, c, d) {
			return b in c.value && "fromICAL" in c.value[b] ? c.value[b].fromICAL(a, d) : a
		}, b._parseParameters = function (c, g, i) {
			for (var k, l, m, n, o, p, q = g, r = 0, s = f, t = {}, u = -1; r !== !1 && (r = j.unescapedIndexOf(c, s, r + 1)) !== -1;) {
				if (k = c.substr(q + 1, r - q - 1), 0 == k.length) throw new a("Empty parameter name in '" + c + "'");
				l = k.toLowerCase(), n = l in i.param && i.param[l].valueType ? i.param[l].valueType : h, l in i.param && (o = i.param[l].multiValue, i.param[l].multiValueSeparateDQuote && (p = b._rfc6868Escape('"' + o + '"')));
				var v = c[r + 1];
				if ('"' === v) {
					if (u = r + 2, r = j.unescapedIndexOf(c, '"', u), o && r != -1)
						for (var w = !0; w;) c[r + 1] == o && '"' == c[r + 2] ? r = j.unescapedIndexOf(c, '"', r + 3) : w = !1;
					if (r === -1) throw new a('invalid line (no matching double quote) "' + c + '"');
					m = c.substr(u, r - u), q = j.unescapedIndexOf(c, e, r), q === -1 && (r = !1)
				} else {
					u = r + 1;
					var x = j.unescapedIndexOf(c, e, u),
						y = j.unescapedIndexOf(c, d, u);
					y !== -1 && x > y ? (x = y, r = !1) : x === -1 ? (x = y === -1 ? c.length : y, r = !1) : (q = x, r = x), m = c.substr(u, x - u)
				}
				if (m = b._rfc6868Escape(m), o) {
					var z = p || o;
					t[l] = b._parseMultiValue(m, z, n, [], null, i)
				} else t[l] = b._parseValue(m, n, i)
			}
			return [t, m, u]
		}, b._rfc6868Escape = function (a) {
			return a.replace(/\^['n^]/g, function (a) {
				return k[a]
			})
		};
		var k = {
			"^'": '"',
			"^n": "\n",
			"^^": "^"
		};
		return b._parseMultiValue = function (a, c, d, e, f, g, h) {
			var i, k = 0,
				l = 0;
			if (0 === c.length) return a;
			for (;
				(k = j.unescapedIndexOf(a, c, l)) !== -1;) i = a.substr(l, k - l), i = f ? b._parseMultiValue(i, f, d, [], null, g, h) : b._parseValue(i, d, g, h), e.push(i), l = k + c.length;
			return i = a.substr(l), i = f ? b._parseMultiValue(i, f, d, [], null, g, h) : b._parseValue(i, d, g, h), e.push(i), 1 == e.length ? e[0] : e
		}, b._eachLine = function (a, b) {
			var d, e, f, g = a.length,
				h = a.search(c),
				i = h;
			do i = a.indexOf("\n", h) + 1, f = i > 1 && "\r" === a[i - 2] ? 2 : 1, 0 === i && (i = g, f = 0), e = a[h], " " === e || "\t" === e ? d += a.substr(h + 1, i - h - (f + 1)) : (d && b(null, d), d = a.substr(h, i - h - f)), h = i; while (i !== g);
			d = d.trim(), d.length && b(null, d)
		}, b
	}(), ICAL.Component = function () {
		"use strict";

		function a(a, b) {
			"string" == typeof a && (a = [a, [],
				[]
			]), this.jCal = a, this.parent = b || null
		}
		var b = 1,
			c = 2,
			d = 0;
		return a.prototype = {
			_hydratedPropertyCount: 0,
			_hydratedComponentCount: 0,
			get name() {
				return this.jCal[d]
			},
			get _designSet() {
				var a = this.parent && this.parent._designSet;
				return a || ICAL.design.getDesignSet(this.name)
			},
			_hydrateComponent: function (b) {
				if (this._components || (this._components = [], this._hydratedComponentCount = 0), this._components[b]) return this._components[b];
				var d = new a(this.jCal[c][b], this);
				return this._hydratedComponentCount++, this._components[b] = d
			},
			_hydrateProperty: function (a) {
				if (this._properties || (this._properties = [], this._hydratedPropertyCount = 0), this._properties[a]) return this._properties[a];
				var c = new ICAL.Property(this.jCal[b][a], this);
				return this._hydratedPropertyCount++, this._properties[a] = c
			},
			getFirstSubcomponent: function (a) {
				if (a) {
					for (var b = 0, e = this.jCal[c], f = e.length; b < f; b++)
						if (e[b][d] === a) {
							var g = this._hydrateComponent(b);
							return g
						}
				} else if (this.jCal[c].length) return this._hydrateComponent(0);
				return null
			},
			getAllSubcomponents: function (a) {
				var b = this.jCal[c].length,
					e = 0;
				if (a) {
					for (var f = this.jCal[c], g = []; e < b; e++) a === f[e][d] && g.push(this._hydrateComponent(e));
					return g
				}
				if (!this._components || this._hydratedComponentCount !== b)
					for (; e < b; e++) this._hydrateComponent(e);
				return this._components || []
			},
			hasProperty: function (a) {
				for (var c = this.jCal[b], e = c.length, f = 0; f < e; f++)
					if (c[f][d] === a) return !0;
				return !1
			},
			getFirstProperty: function (a) {
				if (a) {
					for (var c = 0, e = this.jCal[b], f = e.length; c < f; c++)
						if (e[c][d] === a) {
							var g = this._hydrateProperty(c);
							return g
						}
				} else if (this.jCal[b].length) return this._hydrateProperty(0);
				return null
			},
			getFirstPropertyValue: function (a) {
				var b = this.getFirstProperty(a);
				return b ? b.getFirstValue() : null
			},
			getAllProperties: function (a) {
				var c = this.jCal[b].length,
					e = 0;
				if (a) {
					for (var f = this.jCal[b], g = []; e < c; e++) a === f[e][d] && g.push(this._hydrateProperty(e));
					return g
				}
				if (!this._properties || this._hydratedPropertyCount !== c)
					for (; e < c; e++) this._hydrateProperty(e);
				return this._properties || []
			},
			_removeObjectByIndex: function (a, b, c) {
				if (b = b || [], b[c]) {
					var d = b[c];
					"parent" in d && (d.parent = null)
				}
				b.splice(c, 1), this.jCal[a].splice(c, 1)
			},
			_removeObject: function (a, b, c) {
				var e = 0,
					f = this.jCal[a],
					g = f.length,
					h = this[b];
				if ("string" == typeof c) {
					for (; e < g; e++)
						if (f[e][d] === c) return this._removeObjectByIndex(a, h, e), !0
				} else if (h)
					for (; e < g; e++)
						if (h[e] && h[e] === c) return this._removeObjectByIndex(a, h, e), !0;
				return !1
			},
			_removeAllObjects: function (a, b, c) {
				for (var e = this[b], f = this.jCal[a], g = f.length - 1; g >= 0; g--) c && f[g][d] !== c || this._removeObjectByIndex(a, e, g)
			},
			addSubcomponent: function (a) {
				this._components || (this._components = [], this._hydratedComponentCount = 0), a.parent && a.parent.removeSubcomponent(a);
				var b = this.jCal[c].push(a.jCal);
				return this._components[b - 1] = a, this._hydratedComponentCount++, a.parent = this, a
			},
			removeSubcomponent: function (a) {
				var b = this._removeObject(c, "_components", a);
				return b && this._hydratedComponentCount--, b
			},
			removeAllSubcomponents: function (a) {
				var b = this._removeAllObjects(c, "_components", a);
				return this._hydratedComponentCount = 0, b
			},
			addProperty: function (a) {
				if (!(a instanceof ICAL.Property)) throw new TypeError("must instance of ICAL.Property");
				this._properties || (this._properties = [], this._hydratedPropertyCount = 0), a.parent && a.parent.removeProperty(a);
				var c = this.jCal[b].push(a.jCal);
				return this._properties[c - 1] = a, this._hydratedPropertyCount++, a.parent = this, a
			},
			addPropertyWithValue: function (a, b) {
				var c = new ICAL.Property(a);
				return c.setValue(b), this.addProperty(c), c
			},
			updatePropertyWithValue: function (a, b) {
				var c = this.getFirstProperty(a);
				return c ? c.setValue(b) : c = this.addPropertyWithValue(a, b), c
			},
			removeProperty: function (a) {
				var c = this._removeObject(b, "_properties", a);
				return c && this._hydratedPropertyCount--, c
			},
			removeAllProperties: function (a) {
				var c = this._removeAllObjects(b, "_properties", a);
				return this._hydratedPropertyCount = 0, c
			},
			toJSON: function () {
				return this.jCal
			},
			toString: function () {
				return ICAL.stringify.component(this.jCal, this._designSet)
			}
		}, a.fromString = function (b) {
			return new a(ICAL.parse.component(b))
		}, a
	}(), ICAL.Property = function () {
		"use strict";

		function a(a, b) {
			this._parent = b || null, "string" == typeof a ? (this.jCal = [a, {}, f.defaultType], this.jCal[d] = this.getDefaultType()) : this.jCal = a, this._updateType()
		}
		var b = 0,
			c = 1,
			d = 2,
			e = 3,
			f = ICAL.design;
		return a.prototype = {
			get type() {
				return this.jCal[d]
			},
			get name() {
				return this.jCal[b]
			},
			get parent() {
				return this._parent
			},
			set parent(a) {
				var b = !this._parent || a && a._designSet != this._parent._designSet;
				return this._parent = a, this.type == f.defaultType && b && (this.jCal[d] = this.getDefaultType(), this._updateType()), a
			},
			get _designSet() {
				return this.parent ? this.parent._designSet : f.defaultSet
			},
			_updateType: function () {
				var a = this._designSet;
				if (this.type in a.value) {
					a.value[this.type];
					"decorate" in a.value[this.type] ? this.isDecorated = !0 : this.isDecorated = !1, this.name in a.property && (this.isMultiValue = "multiValue" in a.property[this.name], this.isStructuredValue = "structuredValue" in a.property[this.name])
				}
			},
			_hydrateValue: function (a) {
				return this._values && this._values[a] ? this._values[a] : this.jCal.length <= e + a ? null : this.isDecorated ? (this._values || (this._values = []), this._values[a] = this._decorate(this.jCal[e + a])) : this.jCal[e + a]
			},
			_decorate: function (a) {
				return this._designSet.value[this.type].decorate(a, this)
			},
			_undecorate: function (a) {
				return this._designSet.value[this.type].undecorate(a, this)
			},
			_setDecoratedValue: function (a, b) {
				this._values || (this._values = []), "object" == typeof a && "icaltype" in a ? (this.jCal[e + b] = this._undecorate(a), this._values[b] = a) : (this.jCal[e + b] = a, this._values[b] = this._decorate(a))
			},
			getParameter: function (a) {
				return a in this.jCal[c] ? this.jCal[c][a] : void 0
			},
			setParameter: function (a, b) {
				var d = a.toLowerCase();
				"string" == typeof b && d in this._designSet.param && "multiValue" in this._designSet.param[d] && (b = [b]), this.jCal[c][a] = b
			},
			removeParameter: function (a) {
				delete this.jCal[c][a]
			},
			getDefaultType: function () {
				var a = this.jCal[b],
					c = this._designSet;
				if (a in c.property) {
					var d = c.property[a];
					if ("defaultType" in d) return d.defaultType
				}
				return f.defaultType
			},
			resetType: function (a) {
				this.removeAllValues(), this.jCal[d] = a, this._updateType()
			},
			getFirstValue: function () {
				return this._hydrateValue(0)
			},
			getValues: function () {
				var a = this.jCal.length - e;
				if (a < 1) return [];
				for (var b = 0, c = []; b < a; b++) c[b] = this._hydrateValue(b);
				return c
			},
			removeAllValues: function () {
				this._values && (this._values.length = 0), this.jCal.length = 3
			},
			setValues: function (a) {
				if (!this.isMultiValue) throw new Error(this.name + ": does not not support mulitValue.\noverride isMultiValue");
				var b = a.length,
					c = 0;
				if (this.removeAllValues(), b > 0 && "object" == typeof a[0] && "icaltype" in a[0] && this.resetType(a[0].icaltype), this.isDecorated)
					for (; c < b; c++) this._setDecoratedValue(a[c], c);
				else
					for (; c < b; c++) this.jCal[e + c] = a[c]
			},
			setValue: function (a) {
				this.removeAllValues(), "object" == typeof a && "icaltype" in a && this.resetType(a.icaltype), this.isDecorated ? this._setDecoratedValue(a, 0) : this.jCal[e] = a
			},
			toJSON: function () {
				return this.jCal
			},
			toICALString: function () {
				return ICAL.stringify.property(this.jCal, this._designSet, !0)
			}
		}, a.fromString = function (b, c) {
			return new a(ICAL.parse.property(b, c))
		}, a
	}(), ICAL.UtcOffset = function () {
		function a(a) {
			this.fromData(a)
		}
		return a.prototype = {
			hours: 0,
			minutes: 0,
			factor: 1,
			icaltype: "utc-offset",
			clone: function () {
				return ICAL.UtcOffset.fromSeconds(this.toSeconds())
			},
			fromData: function (a) {
				if (a)
					for (var b in a) a.hasOwnProperty(b) && (this[b] = a[b]);
				this._normalize()
			},
			fromSeconds: function (a) {
				var b = Math.abs(a);
				return this.factor = a < 0 ? -1 : 1, this.hours = ICAL.helpers.trunc(b / 3600), b -= 3600 * this.hours, this.minutes = ICAL.helpers.trunc(b / 60), this
			},
			toSeconds: function () {
				return this.factor * (60 * this.minutes + 3600 * this.hours)
			},
			compare: function (a) {
				var b = this.toSeconds(),
					c = a.toSeconds();
				return (b > c) - (c > b)
			},
			_normalize: function () {
				for (var a = this.toSeconds(), b = this.factor; a < -43200;) a += 97200;
				for (; a > 50400;) a -= 97200;
				this.fromSeconds(a), 0 == a && (this.factor = b)
			},
			toICALString: function () {
				return ICAL.design.icalendar.value["utc-offset"].toICAL(this.toString())
			},
			toString: function () {
				return (1 == this.factor ? "+" : "-") + ICAL.helpers.pad2(this.hours) + ":" + ICAL.helpers.pad2(this.minutes)
			}
		}, a.fromString = function (a) {
			var b = {};
			return b.factor = "+" === a[0] ? 1 : -1, b.hours = ICAL.helpers.strictParseInt(a.substr(1, 2)), b.minutes = ICAL.helpers.strictParseInt(a.substr(4, 2)), new ICAL.UtcOffset(b)
		}, a.fromSeconds = function (b) {
			var c = new a;
			return c.fromSeconds(b), c
		}, a
	}(), ICAL.Binary = function () {
		function a(a) {
			this.value = a
		}
		return a.prototype = {
			icaltype: "binary",
			decodeValue: function () {
				return this._b64_decode(this.value)
			},
			setEncodedValue: function (a) {
				this.value = this._b64_encode(a)
			},
			_b64_encode: function (a) {
				var b, c, d, e, f, g, h, i, j = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
					k = 0,
					l = 0,
					m = "",
					n = [];
				if (!a) return a;
				do b = a.charCodeAt(k++), c = a.charCodeAt(k++), d = a.charCodeAt(k++), i = b << 16 | c << 8 | d, e = i >> 18 & 63, f = i >> 12 & 63, g = i >> 6 & 63, h = 63 & i, n[l++] = j.charAt(e) + j.charAt(f) + j.charAt(g) + j.charAt(h); while (k < a.length);
				m = n.join("");
				var o = a.length % 3;
				return (o ? m.slice(0, o - 3) : m) + "===".slice(o || 3)
			},
			_b64_decode: function (a) {
				var b, c, d, e, f, g, h, i, j = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
					k = 0,
					l = 0,
					m = "",
					n = [];
				if (!a) return a;
				a += "";
				do e = j.indexOf(a.charAt(k++)), f = j.indexOf(a.charAt(k++)), g = j.indexOf(a.charAt(k++)), h = j.indexOf(a.charAt(k++)), i = e << 18 | f << 12 | g << 6 | h, b = i >> 16 & 255, c = i >> 8 & 255, d = 255 & i, 64 == g ? n[l++] = String.fromCharCode(b) : 64 == h ? n[l++] = String.fromCharCode(b, c) : n[l++] = String.fromCharCode(b, c, d); while (k < a.length);
				return m = n.join("")
			},
			toString: function () {
				return this.value
			}
		}, a.fromString = function (b) {
			return new a(b)
		}, a
	}(),
	function () {
		ICAL.Period = function (a) {
			if (this.wrappedJSObject = this, a && "start" in a) {
				if (a.start && !(a.start instanceof ICAL.Time)) throw new TypeError(".start must be an instance of ICAL.Time");
				this.start = a.start
			}
			if (a && a.end && a.duration) throw new Error("cannot accept both end and duration");
			if (a && "end" in a) {
				if (a.end && !(a.end instanceof ICAL.Time)) throw new TypeError(".end must be an instance of ICAL.Time");
				this.end = a.end
			}
			if (a && "duration" in a) {
				if (a.duration && !(a.duration instanceof ICAL.Duration)) throw new TypeError(".duration must be an instance of ICAL.Duration");
				this.duration = a.duration
			}
		}, ICAL.Period.prototype = {
			start: null,
			end: null,
			duration: null,
			icalclass: "icalperiod",
			icaltype: "period",
			clone: function () {
				return ICAL.Period.fromData({
					start: this.start ? this.start.clone() : null,
					end: this.end ? this.end.clone() : null,
					duration: this.duration ? this.duration.clone() : null
				})
			},
			getDuration: function () {
				return this.duration ? this.duration : this.end.subtractDate(this.start)
			},
			getEnd: function () {
				if (this.end) return this.end;
				var a = this.start.clone();
				return a.addDuration(this.duration), a
			},
			toString: function () {
				return this.start + "/" + (this.end || this.duration)
			},
			toJSON: function () {
				return [this.start.toString(), (this.end || this.duration).toString()]
			},
			toICALString: function () {
				return this.start.toICALString() + "/" + (this.end || this.duration).toICALString()
			}
		}, ICAL.Period.fromString = function (a, b) {
			var c = a.split("/");
			if (2 !== c.length) throw new Error('Invalid string value: "' + a + '" must contain a "/" char.');
			var d = {
					start: ICAL.Time.fromDateTimeString(c[0], b)
				},
				e = c[1];
			return ICAL.Duration.isValueString(e) ? d.duration = ICAL.Duration.fromString(e) : d.end = ICAL.Time.fromDateTimeString(e, b), new ICAL.Period(d)
		}, ICAL.Period.fromData = function (a) {
			return new ICAL.Period(a)
		}, ICAL.Period.fromJSON = function (a, b) {
			return ICAL.Duration.isValueString(a[1]) ? ICAL.Period.fromData({
				start: ICAL.Time.fromDateTimeString(a[0], b),
				duration: ICAL.Duration.fromString(a[1])
			}) : ICAL.Period.fromData({
				start: ICAL.Time.fromDateTimeString(a[0], b),
				end: ICAL.Time.fromDateTimeString(a[1], b)
			})
		}
	}(),
	function () {
		function a(a, b, c) {
			var d;
			switch (a) {
				case "P":
					b && "-" === b ? c.isNegative = !0 : c.isNegative = !1;
					break;
				case "D":
					d = "days";
					break;
				case "W":
					d = "weeks";
					break;
				case "H":
					d = "hours";
					break;
				case "M":
					d = "minutes";
					break;
				case "S":
					d = "seconds";
					break;
				default:
					return 0
			}
			if (d) {
				if (!b && 0 !== b) throw new Error('invalid duration value: Missing number before "' + a + '"');
				var e = parseInt(b, 10);
				if (ICAL.helpers.isStrictlyNaN(e)) throw new Error('invalid duration value: Invalid number "' + b + '" before "' + a + '"');
				c[d] = e
			}
			return 1
		}
		var b = /([PDWHMTS]{1,1})/;
		ICAL.Duration = function (a) {
			this.wrappedJSObject = this, this.fromData(a)
		}, ICAL.Duration.prototype = {
			weeks: 0,
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 0,
			isNegative: !1,
			icalclass: "icalduration",
			icaltype: "duration",
			clone: function () {
				return ICAL.Duration.fromData(this)
			},
			toSeconds: function () {
				var a = this.seconds + 60 * this.minutes + 3600 * this.hours + 86400 * this.days + 604800 * this.weeks;
				return this.isNegative ? -a : a
			},
			fromSeconds: function (a) {
				var b = Math.abs(a);
				return this.isNegative = a < 0, this.days = ICAL.helpers.trunc(b / 86400), this.days % 7 == 0 ? (this.weeks = this.days / 7, this.days = 0) : this.weeks = 0, b -= 86400 * (this.days + 7 * this.weeks), this.hours = ICAL.helpers.trunc(b / 3600), b -= 3600 * this.hours, this.minutes = ICAL.helpers.trunc(b / 60), b -= 60 * this.minutes, this.seconds = b, this
			},
			fromData: function (a) {
				var b = ["weeks", "days", "hours", "minutes", "seconds", "isNegative"];
				for (var c in b)
					if (b.hasOwnProperty(c)) {
						var d = b[c];
						a && d in a ? this[d] = a[d] : this[d] = 0
					}
			},
			reset: function () {
				this.isNegative = !1, this.weeks = 0, this.days = 0, this.hours = 0, this.minutes = 0, this.seconds = 0
			},
			compare: function (a) {
				var b = this.toSeconds(),
					c = a.toSeconds();
				return (b > c) - (b < c)
			},
			normalize: function () {
				this.fromSeconds(this.toSeconds())
			},
			toString: function () {
				if (0 == this.toSeconds()) return "PT0S";
				var a = "";
				return this.isNegative && (a += "-"),
					a += "P", this.weeks && (a += this.weeks + "W"), this.days && (a += this.days + "D"), (this.hours || this.minutes || this.seconds) && (a += "T", this.hours && (a += this.hours + "H"), this.minutes && (a += this.minutes + "M"), this.seconds && (a += this.seconds + "S")), a
			},
			toICALString: function () {
				return this.toString()
			}
		}, ICAL.Duration.fromSeconds = function (a) {
			return (new ICAL.Duration).fromSeconds(a)
		}, ICAL.Duration.isValueString = function (a) {
			return "P" === a[0] || "P" === a[1]
		}, ICAL.Duration.fromString = function (c) {
			for (var d = 0, e = Object.create(null), f = 0;
				(d = c.search(b)) !== -1;) {
				var g = c[d],
					h = c.substr(0, d);
				c = c.substr(d + 1), f += a(g, h, e)
			}
			if (f < 2) throw new Error('invalid duration value: Not enough duration components in "' + c + '"');
			return new ICAL.Duration(e)
		}, ICAL.Duration.fromData = function (a) {
			return new ICAL.Duration(a)
		}
	}(),
	function () {
		var a = ["tzid", "location", "tznames", "latitude", "longitude"];
		ICAL.Timezone = function (a) {
			this.wrappedJSObject = this, this.fromData(a)
		}, ICAL.Timezone.prototype = {
			tzid: "",
			location: "",
			tznames: "",
			latitude: 0,
			longitude: 0,
			component: null,
			expandedUntilYear: 0,
			icalclass: "icaltimezone",
			fromData: function (b) {
				if (this.expandedUntilYear = 0, this.changes = [], b instanceof ICAL.Component) this.component = b;
				else {
					if (b && "component" in b)
						if ("string" == typeof b.component) {
							var c = ICAL.parse(b.component);
							this.component = new ICAL.Component(c)
						} else b.component instanceof ICAL.Component ? this.component = b.component : this.component = null;
					for (var d in a)
						if (a.hasOwnProperty(d)) {
							var e = a[d];
							b && e in b && (this[e] = b[e])
						}
				}
				return this.component instanceof ICAL.Component && !this.tzid && (this.tzid = this.component.getFirstPropertyValue("tzid")), this
			},
			utcOffset: function (a) {
				if (this == ICAL.Timezone.utcTimezone || this == ICAL.Timezone.localTimezone) return 0;
				if (this._ensureCoverage(a.year), !this.changes.length) return 0;
				for (var b = {
						year: a.year,
						month: a.month,
						day: a.day,
						hour: a.hour,
						minute: a.minute,
						second: a.second
					}, c = this._findNearbyChange(b), d = -1, e = 1;;) {
					var f = ICAL.helpers.clone(this.changes[c], !0);
					f.utcOffset < f.prevUtcOffset ? ICAL.Timezone.adjust_change(f, 0, 0, 0, f.utcOffset) : ICAL.Timezone.adjust_change(f, 0, 0, 0, f.prevUtcOffset);
					var g = ICAL.Timezone._compare_change_fn(b, f);
					if (g >= 0 ? d = c : e = -1, e == -1 && d != -1) break;
					if (c += e, c < 0) return 0;
					if (c >= this.changes.length) break
				}
				var h = this.changes[d],
					i = h.utcOffset - h.prevUtcOffset;
				if (i < 0 && d > 0) {
					var j = ICAL.helpers.clone(h, !0);
					if (ICAL.Timezone.adjust_change(j, 0, 0, 0, j.prevUtcOffset), ICAL.Timezone._compare_change_fn(b, j) < 0) {
						var k = this.changes[d - 1],
							l = !1;
						h.is_daylight != l && k.is_daylight == l && (h = k)
					}
				}
				return h.utcOffset
			},
			_findNearbyChange: function (a) {
				var b = ICAL.helpers.binsearchInsert(this.changes, a, ICAL.Timezone._compare_change_fn);
				return b >= this.changes.length ? this.changes.length - 1 : b
			},
			_ensureCoverage: function (a) {
				if (ICAL.Timezone._minimumExpansionYear == -1) {
					var b = ICAL.Time.now();
					ICAL.Timezone._minimumExpansionYear = b.year
				}
				var c = a;
				if (c < ICAL.Timezone._minimumExpansionYear && (c = ICAL.Timezone._minimumExpansionYear), c += ICAL.Timezone.EXTRA_COVERAGE, c > ICAL.Timezone.MAX_YEAR && (c = ICAL.Timezone.MAX_YEAR), !this.changes.length || this.expandedUntilYear < a) {
					for (var d = this.component.getAllSubcomponents(), e = d.length, f = 0; f < e; f++) this._expandComponent(d[f], c, this.changes);
					this.changes.sort(ICAL.Timezone._compare_change_fn), this.expandedUntilYear = c
				}
			},
			_expandComponent: function (a, b, c) {
				function d(a) {
					return a.factor * (3600 * a.hours + 60 * a.minutes)
				}

				function e() {
					var b = {};
					return b.is_daylight = "daylight" == a.name, b.utcOffset = d(a.getFirstProperty("tzoffsetto").getFirstValue()), b.prevUtcOffset = d(a.getFirstProperty("tzoffsetfrom").getFirstValue()), b
				}
				if (!a.hasProperty("dtstart") || !a.hasProperty("tzoffsetto") || !a.hasProperty("tzoffsetfrom")) return null;
				var f, g = a.getFirstProperty("dtstart").getFirstValue();
				if (a.hasProperty("rrule") || a.hasProperty("rdate")) {
					var h = a.getAllProperties("rdate");
					for (var i in h)
						if (h.hasOwnProperty(i)) {
							var j = h[i],
								k = j.getFirstValue();
							f = e(), f.year = k.year, f.month = k.month, f.day = k.day, k.isDate ? (f.hour = g.hour, f.minute = g.minute, f.second = g.second, g.zone != ICAL.Timezone.utcTimezone && ICAL.Timezone.adjust_change(f, 0, 0, 0, -f.prevUtcOffset)) : (f.hour = k.hour, f.minute = k.minute, f.second = k.second, k.zone != ICAL.Timezone.utcTimezone && ICAL.Timezone.adjust_change(f, 0, 0, 0, -f.prevUtcOffset)), c.push(f)
						} var l = a.getFirstProperty("rrule");
					if (l) {
						l = l.getFirstValue(), f = e(), l.until && l.until.zone == ICAL.Timezone.utcTimezone && (l.until.adjust(0, 0, 0, f.prevUtcOffset), l.until.zone = ICAL.Timezone.localTimezone);
						for (var m, n = l.iterator(g);
							(m = n.next()) && (f = e(), !(m.year > b) && m);) f.year = m.year, f.month = m.month, f.day = m.day, f.hour = m.hour, f.minute = m.minute, f.second = m.second, f.isDate = m.isDate, ICAL.Timezone.adjust_change(f, 0, 0, 0, -f.prevUtcOffset), c.push(f)
					}
				} else f = e(), f.year = g.year, f.month = g.month, f.day = g.day, f.hour = g.hour, f.minute = g.minute, f.second = g.second, ICAL.Timezone.adjust_change(f, 0, 0, 0, -f.prevUtcOffset), c.push(f);
				return c
			},
			toString: function () {
				return this.tznames ? this.tznames : this.tzid
			}
		}, ICAL.Timezone._compare_change_fn = function (a, b) {
			return a.year < b.year ? -1 : a.year > b.year ? 1 : a.month < b.month ? -1 : a.month > b.month ? 1 : a.day < b.day ? -1 : a.day > b.day ? 1 : a.hour < b.hour ? -1 : a.hour > b.hour ? 1 : a.minute < b.minute ? -1 : a.minute > b.minute ? 1 : a.second < b.second ? -1 : a.second > b.second ? 1 : 0
		}, ICAL.Timezone.convert_time = function (a, b, c) {
			if (a.isDate || b.tzid == c.tzid || b == ICAL.Timezone.localTimezone || c == ICAL.Timezone.localTimezone) return a.zone = c, a;
			var d = b.utcOffset(a);
			return a.adjust(0, 0, 0, -d), d = c.utcOffset(a), a.adjust(0, 0, 0, d), null
		}, ICAL.Timezone.fromData = function (a) {
			var b = new ICAL.Timezone;
			return b.fromData(a)
		}, ICAL.Timezone.utcTimezone = ICAL.Timezone.fromData({
			tzid: "UTC"
		}), ICAL.Timezone.localTimezone = ICAL.Timezone.fromData({
			tzid: "floating"
		}), ICAL.Timezone.adjust_change = function (a, b, c, d, e) {
			return ICAL.Time.prototype.adjust.call(a, b, c, d, e, a)
		}, ICAL.Timezone._minimumExpansionYear = -1, ICAL.Timezone.MAX_YEAR = 2035, ICAL.Timezone.EXTRA_COVERAGE = 5
	}(), ICAL.TimezoneService = function () {
		var a, b = {
			reset: function () {
				a = Object.create(null);
				var b = ICAL.Timezone.utcTimezone;
				a.Z = b, a.UTC = b, a.GMT = b
			},
			has: function (b) {
				return !!a[b]
			},
			get: function (b) {
				return a[b]
			},
			register: function (b, c) {
				if (b instanceof ICAL.Component && "vtimezone" === b.name && (c = new ICAL.Timezone(b), b = c.tzid), !(c instanceof ICAL.Timezone)) throw new TypeError("timezone must be ICAL.Timezone or ICAL.Component");
				a[b] = c
			},
			remove: function (b) {
				return delete a[b]
			}
		};
		return b.reset(), b
	}(),
	function () {
		ICAL.Time = function (a, b) {
				this.wrappedJSObject = this;
				var c = this._time = Object.create(null);
				c.year = 0, c.month = 1, c.day = 1, c.hour = 0, c.minute = 0, c.second = 0, c.isDate = !1, this.fromData(a, b)
			}, ICAL.Time._dowCache = {}, ICAL.Time._wnCache = {}, ICAL.Time.prototype = {
				icalclass: "icaltime",
				_cachedUnixTime: null,
				get icaltype() {
					return this.isDate ? "date" : "date-time"
				},
				zone: null,
				_pendingNormalization: !1,
				clone: function () {
					return new ICAL.Time(this._time, this.zone)
				},
				reset: function () {
					this.fromData(ICAL.Time.epochTime), this.zone = ICAL.Timezone.utcTimezone
				},
				resetTo: function (a, b, c, d, e, f, g) {
					this.fromData({
						year: a,
						month: b,
						day: c,
						hour: d,
						minute: e,
						second: f,
						zone: g
					})
				},
				fromJSDate: function (a, b) {
					return a ? b ? (this.zone = ICAL.Timezone.utcTimezone, this.year = a.getUTCFullYear(), this.month = a.getUTCMonth() + 1, this.day = a.getUTCDate(), this.hour = a.getUTCHours(), this.minute = a.getUTCMinutes(), this.second = a.getUTCSeconds()) : (this.zone = ICAL.Timezone.localTimezone, this.year = a.getFullYear(), this.month = a.getMonth() + 1, this.day = a.getDate(), this.hour = a.getHours(), this.minute = a.getMinutes(), this.second = a.getSeconds()) : this.reset(), this._cachedUnixTime = null, this
				},
				fromData: function (a, b) {
					if (a)
						for (var c in a)
							if (Object.prototype.hasOwnProperty.call(a, c)) {
								if ("icaltype" === c) continue;
								this[c] = a[c]
							} if (b && (this.zone = b), !a || "isDate" in a ? a && "isDate" in a && (this.isDate = a.isDate) : this.isDate = !("hour" in a), a && "timezone" in a) {
						var d = ICAL.TimezoneService.get(a.timezone);
						this.zone = d || ICAL.Timezone.localTimezone
					}
					return a && "zone" in a && (this.zone = a.zone), this.zone || (this.zone = ICAL.Timezone.localTimezone), this._cachedUnixTime = null, this
				},
				dayOfWeek: function () {
					var a = (this.year << 9) + (this.month << 5) + this.day;
					if (a in ICAL.Time._dowCache) return ICAL.Time._dowCache[a];
					var b = this.day,
						c = this.month + (this.month < 3 ? 12 : 0),
						d = this.year - (this.month < 3 ? 1 : 0),
						e = b + d + ICAL.helpers.trunc(26 * (c + 1) / 10) + ICAL.helpers.trunc(d / 4);
					return e += 6 * ICAL.helpers.trunc(d / 100) + ICAL.helpers.trunc(d / 400), e = (e + 6) % 7 + 1, ICAL.Time._dowCache[a] = e, e
				},
				dayOfYear: function () {
					var a = ICAL.Time.isLeapYear(this.year) ? 1 : 0,
						b = ICAL.Time.daysInYearPassedMonth;
					return b[a][this.month - 1] + this.day
				},
				startOfWeek: function (a) {
					var b = a || ICAL.Time.SUNDAY,
						c = this.clone();
					return c.day -= (this.dayOfWeek() + 7 - b) % 7, c.isDate = !0, c.hour = 0, c.minute = 0, c.second = 0, c
				},
				endOfWeek: function (a) {
					var b = a || ICAL.Time.SUNDAY,
						c = this.clone();
					return c.day += (7 - this.dayOfWeek() + b - ICAL.Time.SUNDAY) % 7, c.isDate = !0, c.hour = 0, c.minute = 0, c.second = 0, c
				},
				startOfMonth: function () {
					var a = this.clone();
					return a.day = 1, a.isDate = !0, a.hour = 0, a.minute = 0, a.second = 0, a
				},
				endOfMonth: function () {
					var a = this.clone();
					return a.day = ICAL.Time.daysInMonth(a.month, a.year), a.isDate = !0, a.hour = 0, a.minute = 0, a.second = 0, a
				},
				startOfYear: function () {
					var a = this.clone();
					return a.day = 1, a.month = 1, a.isDate = !0, a.hour = 0, a.minute = 0, a.second = 0, a
				},
				endOfYear: function () {
					var a = this.clone();
					return a.day = 31, a.month = 12, a.isDate = !0, a.hour = 0, a.minute = 0, a.second = 0, a
				},
				startDoyWeek: function (a) {
					var b = a || ICAL.Time.SUNDAY,
						c = this.dayOfWeek() - b;
					return c < 0 && (c += 7), this.dayOfYear() - c
				},
				getDominicalLetter: function () {
					return ICAL.Time.getDominicalLetter(this.year)
				},
				nthWeekDay: function (a, b) {
					var c, d = ICAL.Time.daysInMonth(this.month, this.year),
						e = b,
						f = 0,
						g = this.clone();
					if (e >= 0) {
						g.day = 1, 0 != e && e--, f = g.day;
						var h = g.dayOfWeek(),
							i = a - h;
						i < 0 && (i += 7), f += i, f -= a, c = a
					} else {
						g.day = d;
						var j = g.dayOfWeek();
						e++, c = j - a, c < 0 && (c += 7), c = d - c
					}
					return c += 7 * e, f + c
				},
				isNthWeekDay: function (a, b) {
					var c = this.dayOfWeek();
					if (0 === b && c === a) return !0;
					var d = this.nthWeekDay(a, b);
					return d === this.day
				},
				weekNumber: function (a) {
					var b = (this.year << 12) + (this.month << 8) + (this.day << 3) + a;
					if (b in ICAL.Time._wnCache) return ICAL.Time._wnCache[b];
					var c, d = this.clone();
					d.isDate = !0;
					var e = this.year;
					12 == d.month && d.day > 25 ? (c = ICAL.Time.weekOneStarts(e + 1, a), d.compare(c) < 0 ? c = ICAL.Time.weekOneStarts(e, a) : e++) : (c = ICAL.Time.weekOneStarts(e, a), d.compare(c) < 0 && (c = ICAL.Time.weekOneStarts(--e, a)));
					var f = d.subtractDate(c).toSeconds() / 86400,
						g = ICAL.helpers.trunc(f / 7) + 1;
					return ICAL.Time._wnCache[b] = g, g
				},
				addDuration: function (a) {
					var b = a.isNegative ? -1 : 1,
						c = this.second,
						d = this.minute,
						e = this.hour,
						f = this.day;
					c += b * a.seconds, d += b * a.minutes, e += b * a.hours, f += b * a.days, f += 7 * b * a.weeks, this.second = c, this.minute = d, this.hour = e, this.day = f, this._cachedUnixTime = null
				},
				subtractDate: function (a) {
					var b = this.toUnixTime() + this.utcOffset(),
						c = a.toUnixTime() + a.utcOffset();
					return ICAL.Duration.fromSeconds(b - c)
				},
				subtractDateTz: function (a) {
					var b = this.toUnixTime(),
						c = a.toUnixTime();
					return ICAL.Duration.fromSeconds(b - c)
				},
				compare: function (a) {
					var b = this.toUnixTime(),
						c = a.toUnixTime();
					return b > c ? 1 : c > b ? -1 : 0
				},
				compareDateOnlyTz: function (a, b) {
					function c(a) {
						return ICAL.Time._cmp_attr(d, e, a)
					}
					var d = this.convertToZone(b),
						e = a.convertToZone(b),
						f = 0;
					return 0 != (f = c("year")) ? f : 0 != (f = c("month")) ? f : 0 != (f = c("day")) ? f : f
				},
				convertToZone: function (a) {
					var b = this.clone(),
						c = this.zone.tzid == a.tzid;
					return this.isDate || c || ICAL.Timezone.convert_time(b, this.zone, a), b.zone = a, b
				},
				utcOffset: function () {
					return this.zone == ICAL.Timezone.localTimezone || this.zone == ICAL.Timezone.utcTimezone ? 0 : this.zone.utcOffset(this)
				},
				toICALString: function () {
					var a = this.toString();
					return a.length > 10 ? ICAL.design.icalendar.value["date-time"].toICAL(a) : ICAL.design.icalendar.value.date.toICAL(a)
				},
				toString: function () {
					var a = this.year + "-" + ICAL.helpers.pad2(this.month) + "-" + ICAL.helpers.pad2(this.day);
					return this.isDate || (a += "T" + ICAL.helpers.pad2(this.hour) + ":" + ICAL.helpers.pad2(this.minute) + ":" + ICAL.helpers.pad2(this.second), this.zone === ICAL.Timezone.utcTimezone && (a += "Z")), a
				},
				toJSDate: function () {
					return this.zone == ICAL.Timezone.localTimezone ? this.isDate ? new Date(this.year, this.month - 1, this.day) : new Date(this.year, this.month - 1, this.day, this.hour, this.minute, this.second, 0) : new Date(1e3 * this.toUnixTime())
				},
				_normalize: function () {
					this._time.isDate;
					return this._time.isDate && (this._time.hour = 0, this._time.minute = 0, this._time.second = 0), this.adjust(0, 0, 0, 0), this
				},
				adjust: function (a, b, c, d, e) {
					var f, g, h, i, j, k, l, m = 0,
						n = 0,
						o = e || this._time;
					if (o.isDate || (h = o.second + d, o.second = h % 60, f = ICAL.helpers.trunc(h / 60), o.second < 0 && (o.second += 60, f--), i = o.minute + c + f, o.minute = i % 60, g = ICAL.helpers.trunc(i / 60), o.minute < 0 && (o.minute += 60, g--), j = o.hour + b + g, o.hour = j % 24, m = ICAL.helpers.trunc(j / 24), o.hour < 0 && (o.hour += 24, m--)), o.month > 12 ? n = ICAL.helpers.trunc((o.month - 1) / 12) : o.month < 1 && (n = ICAL.helpers.trunc(o.month / 12) - 1), o.year += n, o.month -= 12 * n, k = o.day + a + m, k > 0)
						for (; l = ICAL.Time.daysInMonth(o.month, o.year), !(k <= l);) o.month++, o.month > 12 && (o.year++, o.month = 1), k -= l;
					else
						for (; k <= 0;) 1 == o.month ? (o.year--, o.month = 12) : o.month--, k += ICAL.Time.daysInMonth(o.month, o.year);
					return o.day = k, this._cachedUnixTime = null, this
				},
				fromUnixTime: function (a) {
					this.zone = ICAL.Timezone.utcTimezone;
					var b = ICAL.Time.epochTime.clone();
					b.adjust(0, 0, 0, a), this.year = b.year, this.month = b.month, this.day = b.day, this.hour = b.hour, this.minute = b.minute, this.second = Math.floor(b.second), this._cachedUnixTime = null
				},
				toUnixTime: function () {
					if (null !== this._cachedUnixTime) return this._cachedUnixTime;
					var a = this.utcOffset(),
						b = Date.UTC(this.year, this.month - 1, this.day, this.hour, this.minute, this.second - a);
					return this._cachedUnixTime = b / 1e3, this._cachedUnixTime
				},
				toJSON: function () {
					for (var a, b = ["year", "month", "day", "hour", "minute", "second", "isDate"], c = Object.create(null), d = 0, e = b.length; d < e; d++) a = b[d], c[a] = this[a];
					return this.zone && (c.timezone = this.zone.tzid), c
				}
			},
			function () {
				function a(a) {
					Object.defineProperty(ICAL.Time.prototype, a, {
						get: function () {
							return this._pendingNormalization && (this._normalize(), this._pendingNormalization = !1), this._time[a]
						},
						set: function (b) {
							return this._cachedUnixTime = null, this._pendingNormalization = !0, this._time[a] = b, b
						}
					})
				}
				"defineProperty" in Object && (a("year"), a("month"), a("day"), a("hour"), a("minute"), a("second"), a("isDate"))
			}(), ICAL.Time.daysInMonth = function (a, b) {
				var c = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
					d = 30;
				return a < 1 || a > 12 ? d : (d = c[a], 2 == a && (d += ICAL.Time.isLeapYear(b)), d)
			}, ICAL.Time.isLeapYear = function (a) {
				return a <= 1752 ? a % 4 == 0 : a % 4 == 0 && a % 100 != 0 || a % 400 == 0
			}, ICAL.Time.fromDayOfYear = function (a, b) {
				var c = b,
					d = a,
					e = new ICAL.Time;
				e.auto_normalize = !1;
				var f = ICAL.Time.isLeapYear(c) ? 1 : 0;
				if (d < 1) return c--, f = ICAL.Time.isLeapYear(c) ? 1 : 0, d += ICAL.Time.daysInYearPassedMonth[f][12], ICAL.Time.fromDayOfYear(d, c);
				if (d > ICAL.Time.daysInYearPassedMonth[f][12]) return f = ICAL.Time.isLeapYear(c) ? 1 : 0, d -= ICAL.Time.daysInYearPassedMonth[f][12], c++, ICAL.Time.fromDayOfYear(d, c);
				e.year = c, e.isDate = !0;
				for (var g = 11; g >= 0; g--)
					if (d > ICAL.Time.daysInYearPassedMonth[f][g]) {
						e.month = g + 1, e.day = d - ICAL.Time.daysInYearPassedMonth[f][g];
						break
					} return e.auto_normalize = !0, e
			}, ICAL.Time.fromStringv2 = function (a) {
				return new ICAL.Time({
					year: parseInt(a.substr(0, 4), 10),
					month: parseInt(a.substr(5, 2), 10),
					day: parseInt(a.substr(8, 2), 10),
					isDate: !0
				})
			}, ICAL.Time.fromDateString = function (a) {
				return new ICAL.Time({
					year: ICAL.helpers.strictParseInt(a.substr(0, 4)),
					month: ICAL.helpers.strictParseInt(a.substr(5, 2)),
					day: ICAL.helpers.strictParseInt(a.substr(8, 2)),
					isDate: !0
				})
			}, ICAL.Time.fromDateTimeString = function (a, b) {
				if (a.length < 19) throw new Error('invalid date-time value: "' + a + '"');
				var c;
				a[19] && "Z" === a[19] ? c = "Z" : b && (c = b.getParameter("tzid"));
				var d = new ICAL.Time({
					year: ICAL.helpers.strictParseInt(a.substr(0, 4)),
					month: ICAL.helpers.strictParseInt(a.substr(5, 2)),
					day: ICAL.helpers.strictParseInt(a.substr(8, 2)),
					hour: ICAL.helpers.strictParseInt(a.substr(11, 2)),
					minute: ICAL.helpers.strictParseInt(a.substr(14, 2)),
					second: ICAL.helpers.strictParseInt(a.substr(17, 2)),
					timezone: c
				});
				return d
			}, ICAL.Time.fromString = function (a) {
				return a.length > 10 ? ICAL.Time.fromDateTimeString(a) : ICAL.Time.fromDateString(a)
			}, ICAL.Time.fromJSDate = function (a, b) {
				var c = new ICAL.Time;
				return c.fromJSDate(a, b)
			}, ICAL.Time.fromData = function (a, b) {
				var c = new ICAL.Time;
				return c.fromData(a, b)
			}, ICAL.Time.now = function () {
				return ICAL.Time.fromJSDate(new Date, !1)
			}, ICAL.Time.weekOneStarts = function (a, b) {
				var c = ICAL.Time.fromData({
						year: a,
						month: 1,
						day: 1,
						isDate: !0
					}),
					d = c.dayOfWeek(),
					e = b || ICAL.Time.DEFAULT_WEEK_START;
				return d > ICAL.Time.THURSDAY && (c.day += 7), e > ICAL.Time.THURSDAY && (c.day -= 7), c.day -= d - e, c
			}, ICAL.Time.getDominicalLetter = function (a) {
				var b = "GFEDCBA",
					c = (a + (a / 4 | 0) + (a / 400 | 0) - (a / 100 | 0) - 1) % 7,
					d = ICAL.Time.isLeapYear(a);
				return d ? b[(c + 6) % 7] + b[c] : b[c]
			}, ICAL.Time.epochTime = ICAL.Time.fromData({
				year: 1970,
				month: 1,
				day: 1,
				hour: 0,
				minute: 0,
				second: 0,
				isDate: !1,
				timezone: "Z"
			}), ICAL.Time._cmp_attr = function (a, b, c) {
				return a[c] > b[c] ? 1 : a[c] < b[c] ? -1 : 0
			}, ICAL.Time.daysInYearPassedMonth = [
				[0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365],
				[0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366]
			], ICAL.Time.SUNDAY = 1, ICAL.Time.MONDAY = 2, ICAL.Time.TUESDAY = 3, ICAL.Time.WEDNESDAY = 4, ICAL.Time.THURSDAY = 5, ICAL.Time.FRIDAY = 6, ICAL.Time.SATURDAY = 7, ICAL.Time.DEFAULT_WEEK_START = ICAL.Time.MONDAY
	}(),
	function () {
		ICAL.VCardTime = function (a, b, c) {
			this.wrappedJSObject = this;
			var d = this._time = Object.create(null);
			d.year = null, d.month = null, d.day = null, d.hour = null, d.minute = null, d.second = null, this.icaltype = c || "date-and-or-time", this.fromData(a, b)
		}, ICAL.helpers.inherits(ICAL.Time, ICAL.VCardTime, {
			icalclass: "vcardtime",
			icaltype: "date-and-or-time",
			zone: null,
			clone: function () {
				return new ICAL.VCardTime(this._time, this.zone, this.icaltype)
			},
			_normalize: function () {
				return this
			},
			utcOffset: function () {
				return this.zone instanceof ICAL.UtcOffset ? this.zone.toSeconds() : ICAL.Time.prototype.utcOffset.apply(this, arguments)
			},
			toICALString: function () {
				return ICAL.design.vcard.value[this.icaltype].toICAL(this.toString())
			},
			toString: function () {
				var a, b = ICAL.helpers.pad2,
					c = this.year,
					d = this.month,
					e = this.day,
					f = this.hour,
					g = this.minute,
					h = this.second,
					i = null !== c,
					j = null !== d,
					k = null !== e,
					l = null !== f,
					m = null !== g,
					n = null !== h,
					o = (i ? b(c) + (j || k ? "-" : "") : j || k ? "--" : "") + (j ? b(d) : "") + (k ? "-" + b(e) : ""),
					p = (l ? b(f) : "-") + (l && m ? ":" : "") + (m ? b(g) : "") + (l || m ? "" : "-") + (m && n ? ":" : "") + (n ? b(h) : "");
				if (this.zone === ICAL.Timezone.utcTimezone) a = "Z";
				else if (this.zone instanceof ICAL.UtcOffset) a = this.zone.toString();
				else if (this.zone === ICAL.Timezone.localTimezone) a = "";
				else if (this.zone instanceof ICAL.Timezone) {
					var q = ICAL.UtcOffset.fromSeconds(this.zone.utcOffset(this));
					a = q.toString()
				} else a = "";
				switch (this.icaltype) {
					case "time":
						return p + a;
					case "date-and-or-time":
					case "date-time":
						return o + ("--" == p ? "" : "T" + p + a);
					case "date":
						return o
				}
				return null
			}
		}), ICAL.VCardTime.fromDateAndOrTimeString = function (a, b) {
			function c(a, b, c) {
				return a ? ICAL.helpers.strictParseInt(a.substr(b, c)) : null
			}
			var d = a.split("T"),
				e = d[0],
				f = d[1],
				g = f ? ICAL.design.vcard.value.time._splitZone(f) : [],
				h = g[0],
				i = g[1],
				j = (ICAL.helpers.strictParseInt, e ? e.length : 0),
				k = i ? i.length : 0,
				l = e && "-" == e[0] && "-" == e[1],
				m = i && "-" == i[0],
				n = {
					year: l ? null : c(e, 0, 4),
					month: !l || 4 != j && 7 != j ? 7 == j ? c(e, 5, 2) : 10 == j ? c(e, 5, 2) : null : c(e, 2, 2),
					day: 5 == j ? c(e, 3, 2) : 7 == j && l ? c(e, 5, 2) : 10 == j ? c(e, 8, 2) : null,
					hour: m ? null : c(i, 0, 2),
					minute: m && 3 == k ? c(i, 1, 2) : k > 4 ? m ? c(i, 1, 2) : c(i, 3, 2) : null,
					second: 4 == k ? c(i, 2, 2) : 6 == k ? c(i, 4, 2) : 8 == k ? c(i, 6, 2) : null
				};
			return h = "Z" == h ? ICAL.Timezone.utcTimezone : h && ":" == h[3] ? ICAL.UtcOffset.fromString(h) : null, new ICAL.VCardTime(n, h, b)
		}
	}(),
	function () {
		function a(a, b, c, d) {
			var e = d;
			if ("+" === d[0] && (e = d.substr(1)), e = ICAL.helpers.strictParseInt(e), void 0 !== b && d < b) throw new Error(a + ': invalid value "' + d + '" must be > ' + b);
			if (void 0 !== c && d > c) throw new Error(a + ': invalid value "' + d + '" must be < ' + b);
			return e
		}
		var b = {
				SU: ICAL.Time.SUNDAY,
				MO: ICAL.Time.MONDAY,
				TU: ICAL.Time.TUESDAY,
				WE: ICAL.Time.WEDNESDAY,
				TH: ICAL.Time.THURSDAY,
				FR: ICAL.Time.FRIDAY,
				SA: ICAL.Time.SATURDAY
			},
			c = {};
		for (var d in b) b.hasOwnProperty(d) && (c[b[d]] = d);
		ICAL.Recur = function (a) {
			this.wrappedJSObject = this, this.parts = {}, a && "object" == typeof a && this.fromData(a)
		}, ICAL.Recur.prototype = {
			parts: null,
			interval: 1,
			wkst: ICAL.Time.MONDAY,
			until: null,
			count: null,
			freq: null,
			icalclass: "icalrecur",
			icaltype: "recur",
			iterator: function (a) {
				return new ICAL.RecurIterator({
					rule: this,
					dtstart: a
				})
			},
			clone: function () {
				return new ICAL.Recur(this.toJSON())
			},
			isFinite: function () {
				return !(!this.count && !this.until)
			},
			isByCount: function () {
				return !(!this.count || this.until)
			},
			addComponent: function (a, b) {
				var c = a.toUpperCase();
				c in this.parts ? this.parts[c].push(b) : this.parts[c] = [b]
			},
			setComponent: function (a, b) {
				this.parts[a.toUpperCase()] = b.slice()
			},
			getComponent: function (a) {
				var b = a.toUpperCase();
				return b in this.parts ? this.parts[b].slice() : []
			},
			getNextOccurrence: function (a, b) {
				var c, d = this.iterator(a);
				do c = d.next(); while (c && c.compare(b) <= 0);
				return c && b.zone && (c.zone = b.zone), c
			},
			fromData: function (a) {
				for (var b in a) {
					var c = b.toUpperCase();
					c in i ? Array.isArray(a[b]) ? this.parts[c] = a[b] : this.parts[c] = [a[b]] : this[b] = a[b]
				}
				this.wkst && "number" != typeof this.wkst && (this.wkst = ICAL.Recur.icalDayToNumericDay(this.wkst)), !this.until || this.until instanceof ICAL.Time || (this.until = ICAL.Time.fromString(this.until))
			},
			toJSON: function () {
				var a = Object.create(null);
				a.freq = this.freq, this.count && (a.count = this.count), this.interval > 1 && (a.interval = this.interval);
				for (var b in this.parts)
					if (this.parts.hasOwnProperty(b)) {
						var c = this.parts[b];
						Array.isArray(c) && 1 == c.length ? a[b.toLowerCase()] = c[0] : a[b.toLowerCase()] = ICAL.helpers.clone(this.parts[b])
					} return this.until && (a.until = this.until.toString()), "wkst" in this && this.wkst !== ICAL.Time.DEFAULT_WEEK_START && (a.wkst = ICAL.Recur.numericDayToIcalDay(this.wkst)), a
			},
			toString: function () {
				var a = "FREQ=" + this.freq;
				this.count && (a += ";COUNT=" + this.count), this.interval > 1 && (a += ";INTERVAL=" + this.interval);
				for (var b in this.parts) this.parts.hasOwnProperty(b) && (a += ";" + b + "=" + this.parts[b]);
				return this.until && (a += ";UNTIL=" + this.until.toString()), "wkst" in this && this.wkst !== ICAL.Time.DEFAULT_WEEK_START && (a += ";WKST=" + ICAL.Recur.numericDayToIcalDay(this.wkst)), a
			}
		}, ICAL.Recur.icalDayToNumericDay = function (a) {
			return b[a]
		}, ICAL.Recur.numericDayToIcalDay = function (a) {
			return c[a]
		};
		var e = /^(SU|MO|TU|WE|TH|FR|SA)$/,
			f = /^([+-])?(5[0-3]|[1-4][0-9]|[1-9])?(SU|MO|TU|WE|TH|FR|SA)$/,
			g = ["SECONDLY", "MINUTELY", "HOURLY", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"],
			h = {
				FREQ: function (a, b, c) {
					if (g.indexOf(a) === -1) throw new Error('invalid frequency "' + a + '" expected: "' + g.join(", ") + '"');
					b.freq = a
				},
				COUNT: function (a, b, c) {
					b.count = ICAL.helpers.strictParseInt(a)
				},
				INTERVAL: function (a, b, c) {
					b.interval = ICAL.helpers.strictParseInt(a), b.interval < 1 && (b.interval = 1)
				},
				UNTIL: function (a, b, c) {
					c ? a.length > 10 ? b.until = ICAL.design.icalendar.value["date-time"].fromICAL(a) : b.until = ICAL.design.icalendar.value.date.fromICAL(a) : b.until = ICAL.Time.fromString(a)
				},
				WKST: function (a, b, c) {
					if (!e.test(a)) throw new Error('invalid WKST value "' + a + '"');
					b.wkst = ICAL.Recur.icalDayToNumericDay(a)
				}
			},
			i = {
				BYSECOND: a.bind(this, "BYSECOND", 0, 60),
				BYMINUTE: a.bind(this, "BYMINUTE", 0, 59),
				BYHOUR: a.bind(this, "BYHOUR", 0, 23),
				BYDAY: function (a) {
					if (f.test(a)) return a;
					throw new Error('invalid BYDAY value "' + a + '"')
				},
				BYMONTHDAY: a.bind(this, "BYMONTHDAY", -31, 31),
				BYYEARDAY: a.bind(this, "BYYEARDAY", -366, 366),
				BYWEEKNO: a.bind(this, "BYWEEKNO", -53, 53),
				BYMONTH: a.bind(this, "BYMONTH", 0, 12),
				BYSETPOS: a.bind(this, "BYSETPOS", -366, 366)
			};
		ICAL.Recur.fromString = function (a) {
			var b = ICAL.Recur._stringToData(a, !1);
			return new ICAL.Recur(b)
		}, ICAL.Recur.fromData = function (a) {
			return new ICAL.Recur(a)
		}, ICAL.Recur._stringToData = function (a, b) {
			for (var c = Object.create(null), d = a.split(";"), e = d.length, f = 0; f < e; f++) {
				var g = d[f].split("="),
					j = g[0].toUpperCase(),
					k = g[0].toLowerCase(),
					l = b ? k : j,
					m = g[1];
				if (j in i) {
					for (var n = m.split(","), o = 0, p = n.length; o < p; o++) n[o] = i[j](n[o]);
					c[l] = 1 == n.length ? n[0] : n
				} else j in h ? h[j](m, c, b) : c[k] = m
			}
			return c
		}
	}(), ICAL.RecurIterator = function () {
		function a(a) {
			this.fromData(a)
		}
		return a.prototype = {
			completed: !1,
			rule: null,
			dtstart: null,
			last: null,
			occurrence_number: 0,
			by_indices: null,
			initialized: !1,
			by_data: null,
			days: null,
			days_index: 0,
			fromData: function (a) {
				if (this.rule = ICAL.helpers.formatClassType(a.rule, ICAL.Recur), !this.rule) throw new Error("iterator requires a (ICAL.Recur) rule");
				if (this.dtstart = ICAL.helpers.formatClassType(a.dtstart, ICAL.Time), !this.dtstart) throw new Error("iterator requires a (ICAL.Time) dtstart");
				a.by_data ? this.by_data = a.by_data : this.by_data = ICAL.helpers.clone(this.rule.parts, !0), a.occurrence_number && (this.occurrence_number = a.occurrence_number), this.days = a.days || [], a.last && (this.last = ICAL.helpers.formatClassType(a.last, ICAL.Time)), this.by_indices = a.by_indices, this.by_indices || (this.by_indices = {
					BYSECOND: 0,
					BYMINUTE: 0,
					BYHOUR: 0,
					BYDAY: 0,
					BYMONTH: 0,
					BYWEEKNO: 0,
					BYMONTHDAY: 0
				}), this.initialized = a.initialized || !1, this.initialized || this.init()
			},
			init: function () {
				this.initialized = !0, this.last = this.dtstart.clone();
				var a = this.by_data;
				if ("BYDAY" in a && this.sort_byday_rules(a.BYDAY, this.rule.wkst), "BYYEARDAY" in a && ("BYMONTH" in a || "BYWEEKNO" in a || "BYMONTHDAY" in a || "BYDAY" in a)) throw new Error("Invalid BYYEARDAY rule");
				if ("BYWEEKNO" in a && "BYMONTHDAY" in a) throw new Error("BYWEEKNO does not fit to BYMONTHDAY");
				if ("MONTHLY" == this.rule.freq && ("BYYEARDAY" in a || "BYWEEKNO" in a)) throw new Error("For MONTHLY recurrences neither BYYEARDAY nor BYWEEKNO may appear");
				if ("WEEKLY" == this.rule.freq && ("BYYEARDAY" in a || "BYMONTHDAY" in a)) throw new Error("For WEEKLY recurrences neither BYMONTHDAY nor BYYEARDAY may appear");
				if ("YEARLY" != this.rule.freq && "BYYEARDAY" in a) throw new Error("BYYEARDAY may only appear in YEARLY rules");
				if (this.last.second = this.setup_defaults("BYSECOND", "SECONDLY", this.dtstart.second), this.last.minute = this.setup_defaults("BYMINUTE", "MINUTELY", this.dtstart.minute), this.last.hour = this.setup_defaults("BYHOUR", "HOURLY", this.dtstart.hour), this.last.day = this.setup_defaults("BYMONTHDAY", "DAILY", this.dtstart.day), this.last.month = this.setup_defaults("BYMONTH", "MONTHLY", this.dtstart.month), "WEEKLY" == this.rule.freq)
					if ("BYDAY" in a) {
						var b = this.ruleDayOfWeek(a.BYDAY[0]),
							c = b[0],
							d = b[1],
							e = d - this.last.dayOfWeek();
						(this.last.dayOfWeek() < d && e >= 0 || e < 0) && (this.last.day += e)
					} else {
						var f = ICAL.Recur.numericDayToIcalDay(this.dtstart.dayOfWeek());
						a.BYDAY = [f]
					} if ("YEARLY" == this.rule.freq) {
					for (; this.expand_year_days(this.last.year), !(this.days.length > 0);) this.increment_year(this.rule.interval);
					this._nextByYearDay()
				}
				if ("MONTHLY" == this.rule.freq && this.has_by_data("BYDAY")) {
					var g = null,
						h = this.last.clone(),
						i = ICAL.Time.daysInMonth(this.last.month, this.last.year);
					for (var j in this.by_data.BYDAY)
						if (this.by_data.BYDAY.hasOwnProperty(j)) {
							this.last = h.clone();
							var b = this.ruleDayOfWeek(this.by_data.BYDAY[j]),
								c = b[0],
								d = b[1],
								k = this.last.nthWeekDay(d, c);
							if (c >= 6 || c <= -6) throw new Error("Malformed values in BYDAY part");
							if (k > i || k <= 0) {
								if (g && g.month == h.month) continue;
								for (; k > i || k <= 0;) this.increment_month(), i = ICAL.Time.daysInMonth(this.last.month, this.last.year), k = this.last.nthWeekDay(d, c)
							}
							this.last.day = k, (!g || this.last.compare(g) < 0) && (g = this.last.clone())
						} if (this.last = g.clone(), this.has_by_data("BYMONTHDAY") && this._byDayAndMonthDay(!0), this.last.day > i || 0 == this.last.day) throw new Error("Malformed values in BYDAY part")
				} else if (this.has_by_data("BYMONTHDAY") && this.last.day < 0) {
					var i = ICAL.Time.daysInMonth(this.last.month, this.last.year);
					this.last.day = i + this.last.day + 1
				}
			},
			next: function () {
				var a = this.last ? this.last.clone() : null;
				if (this.rule.count && this.occurrence_number >= this.rule.count || this.rule.until && this.last.compare(this.rule.until) > 0) return this.completed = !0, null;
				if (0 == this.occurrence_number && this.last.compare(this.dtstart) >= 0) return this.occurrence_number++, this.last;
				var b;
				do switch (b = 1, this.rule.freq) {
					case "SECONDLY":
						this.next_second();
						break;
					case "MINUTELY":
						this.next_minute();
						break;
					case "HOURLY":
						this.next_hour();
						break;
					case "DAILY":
						this.next_day();
						break;
					case "WEEKLY":
						this.next_week();
						break;
					case "MONTHLY":
						b = this.next_month();
						break;
					case "YEARLY":
						this.next_year();
						break;
					default:
						return null
				}
				while (!this.check_contracting_rules() || this.last.compare(this.dtstart) < 0 || !b);
				if (0 == this.last.compare(a)) throw new Error("Same occurrence found twice, protecting you from death by recursion");
				return this.rule.until && this.last.compare(this.rule.until) > 0 ? (this.completed = !0, null) : (this.occurrence_number++, this.last)
			},
			next_second: function () {
				return this.next_generic("BYSECOND", "SECONDLY", "second", "minute")
			},
			increment_second: function (a) {
				return this.increment_generic(a, "second", 60, "minute")
			},
			next_minute: function () {
				return this.next_generic("BYMINUTE", "MINUTELY", "minute", "hour", "next_second")
			},
			increment_minute: function (a) {
				return this.increment_generic(a, "minute", 60, "hour")
			},
			next_hour: function () {
				return this.next_generic("BYHOUR", "HOURLY", "hour", "monthday", "next_minute")
			},
			increment_hour: function (a) {
				this.increment_generic(a, "hour", 24, "monthday")
			},
			next_day: function () {
				var a = ("BYDAY" in this.by_data, "DAILY" == this.rule.freq);
				return 0 == this.next_hour() ? 0 : (a ? this.increment_monthday(this.rule.interval) : this.increment_monthday(1), 0)
			},
			next_week: function () {
				var a = 0;
				if (0 == this.next_weekday_by_week()) return a;
				if (this.has_by_data("BYWEEKNO")) {
					++this.by_indices.BYWEEKNO;
					this.by_indices.BYWEEKNO == this.by_data.BYWEEKNO.length && (this.by_indices.BYWEEKNO = 0, a = 1), this.last.month = 1, this.last.day = 1;
					var b = this.by_data.BYWEEKNO[this.by_indices.BYWEEKNO];
					this.last.day += 7 * b, a && this.increment_year(1)
				} else this.increment_monthday(7 * this.rule.interval);
				return a
			},
			normalizeByMonthDayRules: function (a, b, c) {
				for (var d, e = ICAL.Time.daysInMonth(b, a), f = [], g = 0, h = c.length; g < h; g++)
					if (d = c[g], !(Math.abs(d) > e)) {
						if (d < 0) d = e + (d + 1);
						else if (0 === d) continue;
						f.indexOf(d) === -1 && f.push(d)
					} return f.sort(function (a, b) {
					return a - b
				})
			},
			_byDayAndMonthDay: function (a) {
				function b() {
					for (g = ICAL.Time.daysInMonth(l.last.month, l.last.year), d = l.normalizeByMonthDayRules(l.last.year, l.last.month, l.by_data.BYMONTHDAY), f = d.length; d[i] <= m && (!a || d[i] != m) && i < f - 1;) i++
				}

				function c() {
					m = 0, l.increment_month(), i = 0, b()
				}
				var d, e, f, g, h = this.by_data.BYDAY,
					i = 0,
					j = h.length,
					k = 0,
					l = this,
					m = this.last.day;
				b(), a && (m -= 1);
				for (var n = 48; !k && n;)
					if (n--, e = m + 1, e > g) c();
					else {
						var o = d[i++];
						if (o >= e) {
							m = o;
							for (var p = 0; p < j; p++) {
								var q = this.ruleDayOfWeek(h[p]),
									r = q[0],
									s = q[1];
								if (this.last.day = m, this.last.isNthWeekDay(s, r)) {
									k = 1;
									break
								}
							}
							k || i !== f || c()
						} else c()
					} if (n <= 0) throw new Error("Malformed values in BYDAY combined with BYMONTHDAY parts");
				return k
			},
			next_month: function () {
				var a = ("MONTHLY" == this.rule.freq, 1);
				if (0 == this.next_hour()) return a;
				if (this.has_by_data("BYDAY") && this.has_by_data("BYMONTHDAY")) a = this._byDayAndMonthDay();
				else if (this.has_by_data("BYDAY")) {
					var b = ICAL.Time.daysInMonth(this.last.month, this.last.year),
						c = 0,
						d = 0;
					if (this.has_by_data("BYSETPOS")) {
						for (var e = this.last.day, f = 1; f <= b; f++) this.last.day = f, this.is_day_in_byday(this.last) && (d++, f <= e && c++);
						this.last.day = e
					}
					a = 0;
					for (var f = this.last.day + 1; f <= b; f++)
						if (this.last.day = f, this.is_day_in_byday(this.last) && (!this.has_by_data("BYSETPOS") || this.check_set_position(++c) || this.check_set_position(c - d - 1))) {
							a = 1;
							break
						} f > b && (this.last.day = 1, this.increment_month(), this.is_day_in_byday(this.last) ? this.has_by_data("BYSETPOS") && !this.check_set_position(1) || (a = 1) : a = 0)
				} else if (this.has_by_data("BYMONTHDAY")) {
					this.by_indices.BYMONTHDAY++, this.by_indices.BYMONTHDAY >= this.by_data.BYMONTHDAY.length && (this.by_indices.BYMONTHDAY = 0, this.increment_month());
					var b = ICAL.Time.daysInMonth(this.last.month, this.last.year),
						f = this.by_data.BYMONTHDAY[this.by_indices.BYMONTHDAY];
					f < 0 && (f = b + f + 1), f > b ? (this.last.day = 1, a = this.is_day_in_byday(this.last)) : this.last.day = f
				} else {
					this.increment_month();
					var b = ICAL.Time.daysInMonth(this.last.month, this.last.year);
					this.by_data.BYMONTHDAY[0] > b ? a = 0 : this.last.day = this.by_data.BYMONTHDAY[0]
				}
				return a
			},
			next_weekday_by_week: function () {
				var a = 0;
				if (0 == this.next_hour()) return a;
				if (!this.has_by_data("BYDAY")) return 1;
				for (;;) {
					var b = new ICAL.Time;
					this.by_indices.BYDAY++, this.by_indices.BYDAY == Object.keys(this.by_data.BYDAY).length && (this.by_indices.BYDAY = 0, a = 1);
					var c = this.by_data.BYDAY[this.by_indices.BYDAY],
						d = this.ruleDayOfWeek(c),
						e = d[1];
					e -= this.rule.wkst, e < 0 && (e += 7), b.year = this.last.year, b.month = this.last.month, b.day = this.last.day;
					var f = b.startDoyWeek(this.rule.wkst);
					if (!(e + f < 1) || a) {
						var g = ICAL.Time.fromDayOfYear(f + e, this.last.year);
						return this.last.year = g.year, this.last.month = g.month, this.last.day = g.day, a
					}
				}
			},
			next_year: function () {
				if (0 == this.next_hour()) return 0;
				if (++this.days_index == this.days.length) {
					this.days_index = 0;
					do this.increment_year(this.rule.interval), this.expand_year_days(this.last.year); while (0 == this.days.length)
				}
				return this._nextByYearDay(), 1
			},
			_nextByYearDay: function () {
				var a = this.days[this.days_index],
					b = this.last.year;
				a < 1 && (a += 1, b += 1);
				var c = ICAL.Time.fromDayOfYear(a, b);
				this.last.day = c.day, this.last.month = c.month
			},
			ruleDayOfWeek: function (a) {
				var b = a.match(/([+-]?[0-9])?(MO|TU|WE|TH|FR|SA|SU)/);
				if (b) {
					var c = parseInt(b[1] || 0, 10);
					return a = ICAL.Recur.icalDayToNumericDay(b[2]), [c, a]
				}
				return [0, 0]
			},
			next_generic: function (a, b, c, d, e) {
				var f = a in this.by_data,
					g = this.rule.freq == b,
					h = 0;
				if (e && 0 == this[e]()) return h;
				if (f) {
					this.by_indices[a]++;
					var i = (this.by_indices[a], this.by_data[a]);
					this.by_indices[a] == i.length && (this.by_indices[a] = 0, h = 1), this.last[c] = i[this.by_indices[a]]
				} else g && this["increment_" + c](this.rule.interval);
				return f && h && g && this["increment_" + d](1), h
			},
			increment_monthday: function (a) {
				for (var b = 0; b < a; b++) {
					var c = ICAL.Time.daysInMonth(this.last.month, this.last.year);
					this.last.day++, this.last.day > c && (this.last.day -= c, this.increment_month())
				}
			},
			increment_month: function () {
				if (this.last.day = 1, this.has_by_data("BYMONTH")) this.by_indices.BYMONTH++, this.by_indices.BYMONTH == this.by_data.BYMONTH.length && (this.by_indices.BYMONTH = 0, this.increment_year(1)), this.last.month = this.by_data.BYMONTH[this.by_indices.BYMONTH];
				else {
					"MONTHLY" == this.rule.freq ? this.last.month += this.rule.interval : this.last.month++, this.last.month--;
					var a = ICAL.helpers.trunc(this.last.month / 12);
					this.last.month %= 12, this.last.month++, 0 != a && this.increment_year(a)
				}
			},
			increment_year: function (a) {
				this.last.year += a
			},
			increment_generic: function (a, b, c, d) {
				this.last[b] += a;
				var e = ICAL.helpers.trunc(this.last[b] / c);
				this.last[b] %= c, 0 != e && this["increment_" + d](e)
			},
			has_by_data: function (a) {
				return a in this.rule.parts
			},
			expand_year_days: function (a) {
				var b = new ICAL.Time;
				this.days = [];
				var c = {},
					d = ["BYDAY", "BYWEEKNO", "BYMONTHDAY", "BYMONTH", "BYYEARDAY"];
				for (var e in d)
					if (d.hasOwnProperty(e)) {
						var f = d[e];
						f in this.rule.parts && (c[f] = this.rule.parts[f])
					} if ("BYMONTH" in c && "BYWEEKNO" in c) {
					var g = 1,
						h = {};
					b.year = a, b.isDate = !0;
					for (var i = 0; i < this.by_data.BYMONTH.length; i++) {
						var j = this.by_data.BYMONTH[i];
						b.month = j, b.day = 1;
						var k = b.weekNumber(this.rule.wkst);
						b.day = ICAL.Time.daysInMonth(j, a);
						var l = b.weekNumber(this.rule.wkst);
						for (i = k; i < l; i++) h[i] = 1
					}
					for (var m = 0; m < this.by_data.BYWEEKNO.length && g; m++) {
						var n = this.by_data.BYWEEKNO[m];
						n < 52 ? g &= h[m] : g = 0
					}
					g ? delete c.BYMONTH : delete c.BYWEEKNO
				}
				var o = Object.keys(c).length;
				if (0 == o) {
					var p = this.dtstart.clone();
					p.year = this.last.year, this.days.push(p.dayOfYear())
				} else if (1 == o && "BYMONTH" in c) {
					for (var q in this.by_data.BYMONTH)
						if (this.by_data.BYMONTH.hasOwnProperty(q)) {
							var r = this.dtstart.clone();
							r.year = a, r.month = this.by_data.BYMONTH[q], r.isDate = !0, this.days.push(r.dayOfYear())
						}
				} else if (1 == o && "BYMONTHDAY" in c) {
					for (var s in this.by_data.BYMONTHDAY)
						if (this.by_data.BYMONTHDAY.hasOwnProperty(s)) {
							var t = this.dtstart.clone(),
								u = this.by_data.BYMONTHDAY[s];
							if (u < 0) {
								var v = ICAL.Time.daysInMonth(t.month, a);
								u = u + v + 1
							}
							t.day = u, t.year = a, t.isDate = !0, this.days.push(t.dayOfYear())
						}
				} else if (2 == o && "BYMONTHDAY" in c && "BYMONTH" in c) {
					for (var q in this.by_data.BYMONTH)
						if (this.by_data.BYMONTH.hasOwnProperty(q)) {
							var w = this.by_data.BYMONTH[q],
								v = ICAL.Time.daysInMonth(w, a);
							for (var s in this.by_data.BYMONTHDAY)
								if (this.by_data.BYMONTHDAY.hasOwnProperty(s)) {
									var u = this.by_data.BYMONTHDAY[s];
									u < 0 && (u = u + v + 1), b.day = u, b.month = w, b.year = a, b.isDate = !0, this.days.push(b.dayOfYear())
								}
						}
				} else if (1 == o && "BYWEEKNO" in c);
				else if (2 == o && "BYWEEKNO" in c && "BYMONTHDAY" in c);
				else if (1 == o && "BYDAY" in c) this.days = this.days.concat(this.expand_by_day(a));
				else if (2 == o && "BYDAY" in c && "BYMONTH" in c) {
					for (var q in this.by_data.BYMONTH)
						if (this.by_data.BYMONTH.hasOwnProperty(q)) {
							var j = this.by_data.BYMONTH[q],
								v = ICAL.Time.daysInMonth(j, a);
							b.year = a, b.month = this.by_data.BYMONTH[q], b.day = 1, b.isDate = !0;
							var x = b.dayOfWeek(),
								y = b.dayOfYear() - 1;
							b.day = v;
							var z = b.dayOfWeek();
							if (this.has_by_data("BYSETPOS")) {
								for (var A = [], B = 1; B <= v; B++) b.day = B, this.is_day_in_byday(b) && A.push(B);
								for (var C = 0; C < A.length; C++)(this.check_set_position(C + 1) || this.check_set_position(C - A.length)) && this.days.push(y + A[C])
							} else
								for (var D in this.by_data.BYDAY)
									if (this.by_data.BYDAY.hasOwnProperty(D)) {
										var E, F = this.by_data.BYDAY[D],
											G = this.ruleDayOfWeek(F),
											H = G[0],
											I = G[1],
											J = (I + 7 - x) % 7 + 1,
											K = v - (z + 7 - I) % 7;
										if (0 == H)
											for (var B = J; B <= v; B += 7) this.days.push(y + B);
										else H > 0 ? (E = J + 7 * (H - 1), E <= v && this.days.push(y + E)) : (E = K + 7 * (H + 1), E > 0 && this.days.push(y + E))
									}
						} this.days.sort(function (a, b) {
						return a - b
					})
				} else if (2 == o && "BYDAY" in c && "BYMONTHDAY" in c) {
					var L = this.expand_by_day(a);
					for (var M in L)
						if (L.hasOwnProperty(M)) {
							var B = L[M],
								N = ICAL.Time.fromDayOfYear(B, a);
							this.by_data.BYMONTHDAY.indexOf(N.day) >= 0 && this.days.push(B)
						}
				} else if (3 == o && "BYDAY" in c && "BYMONTHDAY" in c && "BYMONTH" in c) {
					var L = this.expand_by_day(a);
					for (var M in L)
						if (L.hasOwnProperty(M)) {
							var B = L[M],
								N = ICAL.Time.fromDayOfYear(B, a);
							this.by_data.BYMONTH.indexOf(N.month) >= 0 && this.by_data.BYMONTHDAY.indexOf(N.day) >= 0 && this.days.push(B)
						}
				} else if (2 == o && "BYDAY" in c && "BYWEEKNO" in c) {
					var L = this.expand_by_day(a);
					for (var M in L)
						if (L.hasOwnProperty(M)) {
							var B = L[M],
								N = ICAL.Time.fromDayOfYear(B, a),
								n = N.weekNumber(this.rule.wkst);
							this.by_data.BYWEEKNO.indexOf(n) && this.days.push(B)
						}
				} else 3 == o && "BYDAY" in c && "BYWEEKNO" in c && "BYMONTHDAY" in c || (1 == o && "BYYEARDAY" in c ? this.days = this.days.concat(this.by_data.BYYEARDAY) : this.days = []);
				return 0
			},
			expand_by_day: function (a) {
				var b = [],
					c = this.last.clone();
				c.year = a, c.month = 1, c.day = 1, c.isDate = !0;
				var d = c.dayOfWeek();
				c.month = 12, c.day = 31, c.isDate = !0;
				var e = c.dayOfWeek(),
					f = c.dayOfYear();
				for (var g in this.by_data.BYDAY)
					if (this.by_data.BYDAY.hasOwnProperty(g)) {
						var h = this.by_data.BYDAY[g],
							i = this.ruleDayOfWeek(h),
							j = i[0],
							k = i[1];
						if (0 == j)
							for (var l = (k + 7 - d) % 7 + 1, m = l; m <= f; m += 7) b.push(m);
						else if (j > 0) {
							var n;
							n = k >= d ? k - d + 1 : k - d + 8, b.push(n + 7 * (j - 1))
						} else {
							var o;
							j = -j, o = k <= e ? f - e + k : f - e + k - 7, b.push(o - 7 * (j - 1))
						}
					} return b
			},
			is_day_in_byday: function (a) {
				for (var b in this.by_data.BYDAY)
					if (this.by_data.BYDAY.hasOwnProperty(b)) {
						var c = this.by_data.BYDAY[b],
							d = this.ruleDayOfWeek(c),
							e = d[0],
							f = d[1],
							g = a.dayOfWeek();
						if (0 == e && f == g || a.nthWeekDay(f, e) == a.day) return 1
					} return 0
			},
			check_set_position: function (a) {
				if (this.has_by_data("BYSETPOS")) {
					var b = this.by_data.BYSETPOS.indexOf(a);
					return b !== -1
				}
				return !1
			},
			sort_byday_rules: function (a, b) {
				for (var c = 0; c < a.length; c++)
					for (var d = 0; d < c; d++) {
						var e = this.ruleDayOfWeek(a[d])[1],
							f = this.ruleDayOfWeek(a[c])[1];
						if (e -= b, f -= b, e < 0 && (e += 7), f < 0 && (f += 7), e > f) {
							var g = a[c];
							a[c] = a[d], a[d] = g
						}
					}
			},
			check_contract_restriction: function (b, c) {
				var d = a._indexMap[b],
					e = a._expandMap[this.rule.freq][d],
					f = !1;
				if (b in this.by_data && e == a.CONTRACT) {
					var g = this.by_data[b];
					for (var h in g)
						if (g.hasOwnProperty(h) && g[h] == c) {
							f = !0;
							break
						}
				} else f = !0;
				return f
			},
			check_contracting_rules: function () {
				var a = this.last.dayOfWeek(),
					b = this.last.weekNumber(this.rule.wkst),
					c = this.last.dayOfYear();
				return this.check_contract_restriction("BYSECOND", this.last.second) && this.check_contract_restriction("BYMINUTE", this.last.minute) && this.check_contract_restriction("BYHOUR", this.last.hour) && this.check_contract_restriction("BYDAY", ICAL.Recur.numericDayToIcalDay(a)) && this.check_contract_restriction("BYWEEKNO", b) && this.check_contract_restriction("BYMONTHDAY", this.last.day) && this.check_contract_restriction("BYMONTH", this.last.month) && this.check_contract_restriction("BYYEARDAY", c)
			},
			setup_defaults: function (b, c, d) {
				var e = a._indexMap[b],
					f = a._expandMap[this.rule.freq][e];
				return f != a.CONTRACT && (b in this.by_data || (this.by_data[b] = [d]), this.rule.freq != c) ? this.by_data[b][0] : d
			},
			toJSON: function () {
				var a = Object.create(null);
				return a.initialized = this.initialized, a.rule = this.rule.toJSON(), a.dtstart = this.dtstart.toJSON(), a.by_data = this.by_data, a.days = this.days, a.last = this.last.toJSON(), a.by_indices = this.by_indices, a.occurrence_number = this.occurrence_number, a
			}
		}, a._indexMap = {
			BYSECOND: 0,
			BYMINUTE: 1,
			BYHOUR: 2,
			BYDAY: 3,
			BYMONTHDAY: 4,
			BYYEARDAY: 5,
			BYWEEKNO: 6,
			BYMONTH: 7,
			BYSETPOS: 8
		}, a._expandMap = {
			SECONDLY: [1, 1, 1, 1, 1, 1, 1, 1],
			MINUTELY: [2, 1, 1, 1, 1, 1, 1, 1],
			HOURLY: [2, 2, 1, 1, 1, 1, 1, 1],
			DAILY: [2, 2, 2, 1, 1, 1, 1, 1],
			WEEKLY: [2, 2, 2, 2, 3, 3, 1, 1],
			MONTHLY: [2, 2, 2, 2, 2, 3, 3, 1],
			YEARLY: [2, 2, 2, 2, 2, 2, 2, 2]
		}, a.UNKNOWN = 0, a.CONTRACT = 1, a.EXPAND = 2, a.ILLEGAL = 3, a
	}(), ICAL.RecurExpansion = function () {
		function a(a) {
			return ICAL.helpers.formatClassType(a, ICAL.Time)
		}

		function b(a, b) {
			return a.compare(b)
		}

		function c(a) {
			return a.hasProperty("rdate") || a.hasProperty("rrule") || a.hasProperty("recurrence-id")
		}

		function d(a) {
			this.ruleDates = [], this.exDates = [], this.fromData(a)
		}
		return d.prototype = {
			complete: !1,
			ruleIterators: null,
			ruleDates: null,
			exDates: null,
			ruleDateInc: 0,
			exDateInc: 0,
			exDate: null,
			ruleDate: null,
			dtstart: null,
			last: null,
			fromData: function (b) {
				var c = ICAL.helpers.formatClassType(b.dtstart, ICAL.Time);
				if (!c) throw new Error(".dtstart (ICAL.Time) must be given");
				if (this.dtstart = c, b.component) this._init(b.component);
				else {
					if (this.last = a(b.last) || c.clone(), !b.ruleIterators) throw new Error(".ruleIterators or .component must be given");
					this.ruleIterators = b.ruleIterators.map(function (a) {
						return ICAL.helpers.formatClassType(a, ICAL.RecurIterator)
					}), this.ruleDateInc = b.ruleDateInc, this.exDateInc = b.exDateInc, b.ruleDates && (this.ruleDates = b.ruleDates.map(a), this.ruleDate = this.ruleDates[this.ruleDateInc]), b.exDates && (this.exDates = b.exDates.map(a), this.exDate = this.exDates[this.exDateInc]), "undefined" != typeof b.complete && (this.complete = b.complete)
				}
			},
			next: function () {
				for (var a, b, c, d = 500, e = 0;;) {
					if (e++ > d) throw new Error("max tries have occured, rule may be impossible to forfill.");
					if (b = this.ruleDate, a = this._nextRecurrenceIter(this.last), !b && !a) {
						this.complete = !0;
						break
					}
					if ((!b || a && b.compare(a.last) > 0) && (b = a.last.clone(), a.next()), this.ruleDate === b && this._nextRuleDay(), this.last = b, !this.exDate || (c = this.exDate.compare(this.last), c < 0 && this._nextExDay(), 0 !== c)) return this.last;
					this._nextExDay()
				}
			},
			toJSON: function () {
				function a(a) {
					return a.toJSON()
				}
				var b = Object.create(null);
				return b.ruleIterators = this.ruleIterators.map(a), this.ruleDates && (b.ruleDates = this.ruleDates.map(a)), this.exDates && (b.exDates = this.exDates.map(a)), b.ruleDateInc = this.ruleDateInc, b.exDateInc = this.exDateInc, b.last = this.last.toJSON(), b.dtstart = this.dtstart.toJSON(), b.complete = this.complete, b
			},
			_extractDates: function (a, c) {
				function d(a) {
					e = ICAL.helpers.binsearchInsert(f, a, b), f.splice(e, 0, a)
				}
				for (var e, f = [], g = a.getAllProperties(c), h = g.length, i = 0; i < h; i++) g[i].getValues().forEach(d);
				return f
			},
			_init: function (a) {
				if (this.ruleIterators = [], this.last = this.dtstart.clone(), !c(a)) return this.ruleDate = this.last.clone(), void(this.complete = !0);
				if (a.hasProperty("rdate") && (this.ruleDates = this._extractDates(a, "rdate"), this.ruleDates[0] && this.ruleDates[0].compare(this.dtstart) < 0 ? (this.ruleDateInc = 0, this.last = this.ruleDates[0].clone()) : this.ruleDateInc = ICAL.helpers.binsearchInsert(this.ruleDates, this.last, b), this.ruleDate = this.ruleDates[this.ruleDateInc]), a.hasProperty("rrule"))
					for (var d, e, f = a.getAllProperties("rrule"), g = 0, h = f.length; g < h; g++) d = f[g].getFirstValue(), e = d.iterator(this.dtstart), this.ruleIterators.push(e), e.next();
				a.hasProperty("exdate") && (this.exDates = this._extractDates(a, "exdate"), this.exDateInc = ICAL.helpers.binsearchInsert(this.exDates, this.last, b), this.exDate = this.exDates[this.exDateInc])
			},
			_nextExDay: function () {
				this.exDate = this.exDates[++this.exDateInc]
			},
			_nextRuleDay: function () {
				this.ruleDate = this.ruleDates[++this.ruleDateInc]
			},
			_nextRecurrenceIter: function () {
				var a = this.ruleIterators;
				if (0 === a.length) return null;
				for (var b, c, d, e = a.length, f = 0; f < e; f++) b = a[f], c = b.last, b.completed ? (e--, 0 !== f && f--, a.splice(f, 1)) : (!d || d.last.compare(c) > 0) && (d = b);
				return d
			}
		}, d
	}(), ICAL.Event = function () {
		function a(a, b) {
			a instanceof ICAL.Component || (b = a, a = null), a ? this.component = a : this.component = new ICAL.Component("vevent"), this._rangeExceptionCache = Object.create(null), this.exceptions = Object.create(null), this.rangeExceptions = [], b && b.strictExceptions && (this.strictExceptions = b.strictExceptions), b && b.exceptions && b.exceptions.forEach(this.relateException, this)
		}

		function b(a, b) {
			return a[0] > b[0] ? 1 : b[0] > a[0] ? -1 : 0
		}
		return a.prototype = {
			THISANDFUTURE: "THISANDFUTURE",
			exceptions: null,
			strictExceptions: !1,
			relateException: function (a) {
				if (this.isRecurrenceException()) throw new Error("cannot relate exception to exceptions");
				if (a instanceof ICAL.Component && (a = new ICAL.Event(a)), this.strictExceptions && a.uid !== this.uid) throw new Error("attempted to relate unrelated exception");
				var c = a.recurrenceId.toString();
				if (this.exceptions[c] = a, a.modifiesFuture()) {
					var d = [a.recurrenceId.toUnixTime(), c],
						e = ICAL.helpers.binsearchInsert(this.rangeExceptions, d, b);
					this.rangeExceptions.splice(e, 0, d)
				}
			},
			modifiesFuture: function () {
				var a = this.component.getFirstPropertyValue("range");
				return a === this.THISANDFUTURE
			},
			findRangeException: function (a) {
				if (!this.rangeExceptions.length) return null;
				var c = a.toUnixTime(),
					d = ICAL.helpers.binsearchInsert(this.rangeExceptions, [c], b);
				if (d -= 1, d < 0) return null;
				var e = this.rangeExceptions[d];
				return c < e[0] ? null : e[1]
			},
			getOccurrenceDetails: function (a) {
				var b, c = a.toString(),
					d = a.convertToZone(ICAL.Timezone.utcTimezone).toString(),
					e = {
						recurrenceId: a
					};
				if (c in this.exceptions) b = e.item = this.exceptions[c], e.startDate = b.startDate, e.endDate = b.endDate, e.item = b;
				else if (d in this.exceptions) b = this.exceptions[d], e.startDate = b.startDate, e.endDate = b.endDate, e.item = b;
				else {
					var f, g = this.findRangeException(a);
					if (g) {
						var h = this.exceptions[g];
						e.item = h;
						var i = this._rangeExceptionCache[g];
						if (!i) {
							var j = h.recurrenceId.clone(),
								k = h.startDate.clone();
							j.zone = k.zone, i = k.subtractDate(j), this._rangeExceptionCache[g] = i
						}
						var l = a.clone();
						l.zone = h.startDate.zone, l.addDuration(i), f = l.clone(), f.addDuration(h.duration), e.startDate = l, e.endDate = f
					} else f = a.clone(), f.addDuration(this.duration), e.endDate = f, e.startDate = a, e.item = this
				}
				return e
			},
			iterator: function (a) {
				return new ICAL.RecurExpansion({
					component: this.component,
					dtstart: a || this.startDate
				})
			},
			isRecurring: function () {
				var a = this.component;
				return a.hasProperty("rrule") || a.hasProperty("rdate")
			},
			isRecurrenceException: function () {
				return this.component.hasProperty("recurrence-id")
			},
			getRecurrenceTypes: function () {
				for (var a = this.component.getAllProperties("rrule"), b = 0, c = a.length, d = Object.create(null); b < c; b++) {
					var e = a[b].getFirstValue();
					d[e.freq] = !0
				}
				return d
			},
			get uid() {
				return this._firstProp("uid")
			},
			set uid(a) {
				this._setProp("uid", a)
			},
			get startDate() {
				return this._firstProp("dtstart")
			},
			set startDate(a) {
				this._setTime("dtstart", a)
			},
			get endDate() {
				var a = this._firstProp("dtend");
				if (!a) {
					var b = this._firstProp("duration");
					a = this.startDate.clone(), b ? a.addDuration(b) : a.isDate && (a.day += 1)
				}
				return a
			},
			set endDate(a) {
				this._setTime("dtend", a)
			},
			get duration() {
				var a = this._firstProp("duration");
				return a ? a : this.endDate.subtractDate(this.startDate)
			},
			get location() {
				return this._firstProp("location")
			},
			set location(a) {
				return this._setProp("location", a)
			},
			get attendees() {
				return this.component.getAllProperties("attendee")
			},
			get summary() {
				return this._firstProp("summary")
			},
			set summary(a) {
				this._setProp("summary", a)
			},
			get description() {
				return this._firstProp("description")
			},
			set description(a) {
				this._setProp("description", a)
			},
			get organizer() {
				return this._firstProp("organizer")
			},
			set organizer(a) {
				this._setProp("organizer", a)
			},
			get sequence() {
				return this._firstProp("sequence")
			},
			set sequence(a) {
				this._setProp("sequence", a)
			},
			get recurrenceId() {
				return this._firstProp("recurrence-id")
			},
			set recurrenceId(a) {
				this._setProp("recurrence-id", a)
			},
			_setTime: function (a, b) {
				var c = this.component.getFirstProperty(a);
				c || (c = new ICAL.Property(a), this.component.addProperty(c)), b.zone === ICAL.Timezone.localTimezone || b.zone === ICAL.Timezone.utcTimezone ? c.removeParameter("tzid") : c.setParameter("tzid", b.zone.tzid), c.setValue(b)
			},
			_setProp: function (a, b) {
				this.component.updatePropertyWithValue(a, b)
			},
			_firstProp: function (a) {
				return this.component.getFirstPropertyValue(a)
			},
			toString: function () {
				return this.component.toString()
			}
		}, a
	}(), ICAL.ComponentParser = function () {
		function a(a) {
			"undefined" == typeof a && (a = {});
			var b;
			for (b in a) a.hasOwnProperty(b) && (this[b] = a[b])
		}
		return a.prototype = {
			parseEvent: !0,
			parseTimezone: !0,
			oncomplete: function () {},
			onerror: function (a) {},
			ontimezone: function (a) {},
			onevent: function (a) {},
			process: function (a) {
				"string" == typeof a && (a = ICAL.parse(a)), a instanceof ICAL.Component || (a = new ICAL.Component(a));
				for (var b, c = a.getAllSubcomponents(), d = 0, e = c.length; d < e; d++) switch (b = c[d], b.name) {
					case "vtimezone":
						if (this.parseTimezone) {
							var f = b.getFirstPropertyValue("tzid");
							f && this.ontimezone(new ICAL.Timezone({
								tzid: f,
								component: b
							}))
						}
						break;
					case "vevent":
						this.parseEvent && this.onevent(new ICAL.Event(b));
						break;
					default:
						continue
				}
				this.oncomplete()
			}
		}, a
	}();
//# sourceMappingURL=ical.min.js.map