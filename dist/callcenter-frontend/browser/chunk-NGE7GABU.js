import {
  AgentService
} from "./chunk-ESU7E6HN.js";
import {
  AgentState
} from "./chunk-GI66PYSZ.js";
import {
  ContactService
} from "./chunk-DLUNS3KN.js";
import {
  MatTooltipModule
} from "./chunk-C6Q5OSF7.js";
import "./chunk-CRNFYKBD.js";
import "./chunk-2GCPRO7O.js";
import "./chunk-XG3JRR2G.js";
import {
  SipService
} from "./chunk-FHH72WSF.js";
import {
  MatChipsModule
} from "./chunk-SO6AHRRM.js";
import "./chunk-MAXKR5SL.js";
import {
  MatCardModule
} from "./chunk-6IEEJC5K.js";
import {
  WebsocketService
} from "./chunk-NSDE3IOW.js";
import {
  MatButtonModule
} from "./chunk-M2YI7FKS.js";
import "./chunk-Q5NKAKZL.js";
import {
  AuthService
} from "./chunk-55FOSRV6.js";
import "./chunk-OCZLH7K5.js";
import "./chunk-ZQICQP3Y.js";
import "./chunk-GRJ7XAPD.js";
import {
  LucideAngularComponent,
  LucideAngularModule
} from "./chunk-RFBUEVFE.js";
import {
  environment
} from "./chunk-QF774CZR.js";
import {
  AsyncPipe,
  CommonModule,
  Component,
  EventEmitter,
  HttpClient,
  HttpParams,
  Injectable,
  Input,
  NgForOf,
  NgIf,
  Output,
  ViewChild,
  __async,
  __commonJS,
  __export,
  __toESM,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵqueryRefresh,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵviewQuery
} from "./chunk-CTRHJBBW.js";

// node_modules/sdp/sdp.js
var require_sdp = __commonJS({
  "node_modules/sdp/sdp.js"(exports, module) {
    "use strict";
    var SDPUtils2 = {};
    SDPUtils2.generateIdentifier = function() {
      return Math.random().toString(36).substring(2, 12);
    };
    SDPUtils2.localCName = SDPUtils2.generateIdentifier();
    SDPUtils2.splitLines = function(blob) {
      return blob.trim().split("\n").map((line) => line.trim());
    };
    SDPUtils2.splitSections = function(blob) {
      const parts = blob.split("\nm=");
      return parts.map((part, index) => (index > 0 ? "m=" + part : part).trim() + "\r\n");
    };
    SDPUtils2.getDescription = function(blob) {
      const sections = SDPUtils2.splitSections(blob);
      return sections && sections[0];
    };
    SDPUtils2.getMediaSections = function(blob) {
      const sections = SDPUtils2.splitSections(blob);
      sections.shift();
      return sections;
    };
    SDPUtils2.matchPrefix = function(blob, prefix) {
      return SDPUtils2.splitLines(blob).filter((line) => line.indexOf(prefix) === 0);
    };
    SDPUtils2.parseCandidate = function(line) {
      let parts;
      if (line.indexOf("a=candidate:") === 0) {
        parts = line.substring(12).split(" ");
      } else {
        parts = line.substring(10).split(" ");
      }
      const candidate = {
        foundation: parts[0],
        component: { 1: "rtp", 2: "rtcp" }[parts[1]] || parts[1],
        protocol: parts[2].toLowerCase(),
        priority: parseInt(parts[3], 10),
        ip: parts[4],
        address: parts[4],
        // address is an alias for ip.
        port: parseInt(parts[5], 10),
        // skip parts[6] == 'typ'
        type: parts[7]
      };
      for (let i = 8; i < parts.length; i += 2) {
        switch (parts[i]) {
          case "raddr":
            candidate.relatedAddress = parts[i + 1];
            break;
          case "rport":
            candidate.relatedPort = parseInt(parts[i + 1], 10);
            break;
          case "tcptype":
            candidate.tcpType = parts[i + 1];
            break;
          case "ufrag":
            candidate.ufrag = parts[i + 1];
            candidate.usernameFragment = parts[i + 1];
            break;
          default:
            if (candidate[parts[i]] === void 0) {
              candidate[parts[i]] = parts[i + 1];
            }
            break;
        }
      }
      return candidate;
    };
    SDPUtils2.writeCandidate = function(candidate) {
      const sdp2 = [];
      sdp2.push(candidate.foundation);
      const component = candidate.component;
      if (component === "rtp") {
        sdp2.push(1);
      } else if (component === "rtcp") {
        sdp2.push(2);
      } else {
        sdp2.push(component);
      }
      sdp2.push(candidate.protocol.toUpperCase());
      sdp2.push(candidate.priority);
      sdp2.push(candidate.address || candidate.ip);
      sdp2.push(candidate.port);
      const type = candidate.type;
      sdp2.push("typ");
      sdp2.push(type);
      if (type !== "host" && candidate.relatedAddress && candidate.relatedPort) {
        sdp2.push("raddr");
        sdp2.push(candidate.relatedAddress);
        sdp2.push("rport");
        sdp2.push(candidate.relatedPort);
      }
      if (candidate.tcpType && candidate.protocol.toLowerCase() === "tcp") {
        sdp2.push("tcptype");
        sdp2.push(candidate.tcpType);
      }
      if (candidate.usernameFragment || candidate.ufrag) {
        sdp2.push("ufrag");
        sdp2.push(candidate.usernameFragment || candidate.ufrag);
      }
      return "candidate:" + sdp2.join(" ");
    };
    SDPUtils2.parseIceOptions = function(line) {
      return line.substring(14).split(" ");
    };
    SDPUtils2.parseRtpMap = function(line) {
      let parts = line.substring(9).split(" ");
      const parsed = {
        payloadType: parseInt(parts.shift(), 10)
        // was: id
      };
      parts = parts[0].split("/");
      parsed.name = parts[0];
      parsed.clockRate = parseInt(parts[1], 10);
      parsed.channels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
      parsed.numChannels = parsed.channels;
      return parsed;
    };
    SDPUtils2.writeRtpMap = function(codec) {
      let pt = codec.payloadType;
      if (codec.preferredPayloadType !== void 0) {
        pt = codec.preferredPayloadType;
      }
      const channels = codec.channels || codec.numChannels || 1;
      return "a=rtpmap:" + pt + " " + codec.name + "/" + codec.clockRate + (channels !== 1 ? "/" + channels : "") + "\r\n";
    };
    SDPUtils2.parseExtmap = function(line) {
      const parts = line.substring(9).split(" ");
      return {
        id: parseInt(parts[0], 10),
        direction: parts[0].indexOf("/") > 0 ? parts[0].split("/")[1] : "sendrecv",
        uri: parts[1],
        attributes: parts.slice(2).join(" ")
      };
    };
    SDPUtils2.writeExtmap = function(headerExtension) {
      return "a=extmap:" + (headerExtension.id || headerExtension.preferredId) + (headerExtension.direction && headerExtension.direction !== "sendrecv" ? "/" + headerExtension.direction : "") + " " + headerExtension.uri + (headerExtension.attributes ? " " + headerExtension.attributes : "") + "\r\n";
    };
    SDPUtils2.parseFmtp = function(line) {
      const parsed = {};
      let kv;
      const parts = line.substring(line.indexOf(" ") + 1).split(";");
      for (let j = 0; j < parts.length; j++) {
        kv = parts[j].trim().split("=");
        parsed[kv[0].trim()] = kv[1];
      }
      return parsed;
    };
    SDPUtils2.writeFmtp = function(codec) {
      let line = "";
      let pt = codec.payloadType;
      if (codec.preferredPayloadType !== void 0) {
        pt = codec.preferredPayloadType;
      }
      if (codec.parameters && Object.keys(codec.parameters).length) {
        const params = [];
        Object.keys(codec.parameters).forEach((param) => {
          if (codec.parameters[param] !== void 0) {
            params.push(param + "=" + codec.parameters[param]);
          } else {
            params.push(param);
          }
        });
        line += "a=fmtp:" + pt + " " + params.join(";") + "\r\n";
      }
      return line;
    };
    SDPUtils2.parseRtcpFb = function(line) {
      const parts = line.substring(line.indexOf(" ") + 1).split(" ");
      return {
        type: parts.shift(),
        parameter: parts.join(" ")
      };
    };
    SDPUtils2.writeRtcpFb = function(codec) {
      let lines = "";
      let pt = codec.payloadType;
      if (codec.preferredPayloadType !== void 0) {
        pt = codec.preferredPayloadType;
      }
      if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
        codec.rtcpFeedback.forEach((fb) => {
          lines += "a=rtcp-fb:" + pt + " " + fb.type + (fb.parameter && fb.parameter.length ? " " + fb.parameter : "") + "\r\n";
        });
      }
      return lines;
    };
    SDPUtils2.parseSsrcMedia = function(line) {
      const sp = line.indexOf(" ");
      const parts = {
        ssrc: parseInt(line.substring(7, sp), 10)
      };
      const colon = line.indexOf(":", sp);
      if (colon > -1) {
        parts.attribute = line.substring(sp + 1, colon);
        parts.value = line.substring(colon + 1);
      } else {
        parts.attribute = line.substring(sp + 1);
      }
      return parts;
    };
    SDPUtils2.parseSsrcGroup = function(line) {
      const parts = line.substring(13).split(" ");
      return {
        semantics: parts.shift(),
        ssrcs: parts.map((ssrc) => parseInt(ssrc, 10))
      };
    };
    SDPUtils2.getMid = function(mediaSection) {
      const mid = SDPUtils2.matchPrefix(mediaSection, "a=mid:")[0];
      if (mid) {
        return mid.substring(6);
      }
    };
    SDPUtils2.parseFingerprint = function(line) {
      const parts = line.substring(14).split(" ");
      return {
        algorithm: parts[0].toLowerCase(),
        // algorithm is case-sensitive in Edge.
        value: parts[1].toUpperCase()
        // the definition is upper-case in RFC 4572.
      };
    };
    SDPUtils2.getDtlsParameters = function(mediaSection, sessionpart) {
      const lines = SDPUtils2.matchPrefix(
        mediaSection + sessionpart,
        "a=fingerprint:"
      );
      return {
        role: "auto",
        fingerprints: lines.map(SDPUtils2.parseFingerprint)
      };
    };
    SDPUtils2.writeDtlsParameters = function(params, setupType) {
      let sdp2 = "a=setup:" + setupType + "\r\n";
      params.fingerprints.forEach((fp) => {
        sdp2 += "a=fingerprint:" + fp.algorithm + " " + fp.value + "\r\n";
      });
      return sdp2;
    };
    SDPUtils2.parseCryptoLine = function(line) {
      const parts = line.substring(9).split(" ");
      return {
        tag: parseInt(parts[0], 10),
        cryptoSuite: parts[1],
        keyParams: parts[2],
        sessionParams: parts.slice(3)
      };
    };
    SDPUtils2.writeCryptoLine = function(parameters) {
      return "a=crypto:" + parameters.tag + " " + parameters.cryptoSuite + " " + (typeof parameters.keyParams === "object" ? SDPUtils2.writeCryptoKeyParams(parameters.keyParams) : parameters.keyParams) + (parameters.sessionParams ? " " + parameters.sessionParams.join(" ") : "") + "\r\n";
    };
    SDPUtils2.parseCryptoKeyParams = function(keyParams) {
      if (keyParams.indexOf("inline:") !== 0) {
        return null;
      }
      const parts = keyParams.substring(7).split("|");
      return {
        keyMethod: "inline",
        keySalt: parts[0],
        lifeTime: parts[1],
        mkiValue: parts[2] ? parts[2].split(":")[0] : void 0,
        mkiLength: parts[2] ? parts[2].split(":")[1] : void 0
      };
    };
    SDPUtils2.writeCryptoKeyParams = function(keyParams) {
      return keyParams.keyMethod + ":" + keyParams.keySalt + (keyParams.lifeTime ? "|" + keyParams.lifeTime : "") + (keyParams.mkiValue && keyParams.mkiLength ? "|" + keyParams.mkiValue + ":" + keyParams.mkiLength : "");
    };
    SDPUtils2.getCryptoParameters = function(mediaSection, sessionpart) {
      const lines = SDPUtils2.matchPrefix(
        mediaSection + sessionpart,
        "a=crypto:"
      );
      return lines.map(SDPUtils2.parseCryptoLine);
    };
    SDPUtils2.getIceParameters = function(mediaSection, sessionpart) {
      const ufrag = SDPUtils2.matchPrefix(
        mediaSection + sessionpart,
        "a=ice-ufrag:"
      )[0];
      const pwd = SDPUtils2.matchPrefix(
        mediaSection + sessionpart,
        "a=ice-pwd:"
      )[0];
      if (!(ufrag && pwd)) {
        return null;
      }
      return {
        usernameFragment: ufrag.substring(12),
        password: pwd.substring(10)
      };
    };
    SDPUtils2.writeIceParameters = function(params) {
      let sdp2 = "a=ice-ufrag:" + params.usernameFragment + "\r\na=ice-pwd:" + params.password + "\r\n";
      if (params.iceLite) {
        sdp2 += "a=ice-lite\r\n";
      }
      return sdp2;
    };
    SDPUtils2.parseRtpParameters = function(mediaSection) {
      const description = {
        codecs: [],
        headerExtensions: [],
        fecMechanisms: [],
        rtcp: []
      };
      const lines = SDPUtils2.splitLines(mediaSection);
      const mline = lines[0].split(" ");
      description.profile = mline[2];
      for (let i = 3; i < mline.length; i++) {
        const pt = mline[i];
        const rtpmapline = SDPUtils2.matchPrefix(
          mediaSection,
          "a=rtpmap:" + pt + " "
        )[0];
        if (rtpmapline) {
          const codec = SDPUtils2.parseRtpMap(rtpmapline);
          const fmtps = SDPUtils2.matchPrefix(
            mediaSection,
            "a=fmtp:" + pt + " "
          );
          codec.parameters = fmtps.length ? SDPUtils2.parseFmtp(fmtps[0]) : {};
          codec.rtcpFeedback = SDPUtils2.matchPrefix(
            mediaSection,
            "a=rtcp-fb:" + pt + " "
          ).map(SDPUtils2.parseRtcpFb);
          description.codecs.push(codec);
          switch (codec.name.toUpperCase()) {
            case "RED":
            case "ULPFEC":
              description.fecMechanisms.push(codec.name.toUpperCase());
              break;
            default:
              break;
          }
        }
      }
      SDPUtils2.matchPrefix(mediaSection, "a=extmap:").forEach((line) => {
        description.headerExtensions.push(SDPUtils2.parseExtmap(line));
      });
      const wildcardRtcpFb = SDPUtils2.matchPrefix(mediaSection, "a=rtcp-fb:* ").map(SDPUtils2.parseRtcpFb);
      description.codecs.forEach((codec) => {
        wildcardRtcpFb.forEach((fb) => {
          const duplicate = codec.rtcpFeedback.find((existingFeedback) => {
            return existingFeedback.type === fb.type && existingFeedback.parameter === fb.parameter;
          });
          if (!duplicate) {
            codec.rtcpFeedback.push(fb);
          }
        });
      });
      return description;
    };
    SDPUtils2.writeRtpDescription = function(kind, caps) {
      let sdp2 = "";
      sdp2 += "m=" + kind + " ";
      sdp2 += caps.codecs.length > 0 ? "9" : "0";
      sdp2 += " " + (caps.profile || "UDP/TLS/RTP/SAVPF") + " ";
      sdp2 += caps.codecs.map((codec) => {
        if (codec.preferredPayloadType !== void 0) {
          return codec.preferredPayloadType;
        }
        return codec.payloadType;
      }).join(" ") + "\r\n";
      sdp2 += "c=IN IP4 0.0.0.0\r\n";
      sdp2 += "a=rtcp:9 IN IP4 0.0.0.0\r\n";
      caps.codecs.forEach((codec) => {
        sdp2 += SDPUtils2.writeRtpMap(codec);
        sdp2 += SDPUtils2.writeFmtp(codec);
        sdp2 += SDPUtils2.writeRtcpFb(codec);
      });
      let maxptime = 0;
      caps.codecs.forEach((codec) => {
        if (codec.maxptime > maxptime) {
          maxptime = codec.maxptime;
        }
      });
      if (maxptime > 0) {
        sdp2 += "a=maxptime:" + maxptime + "\r\n";
      }
      if (caps.headerExtensions) {
        caps.headerExtensions.forEach((extension) => {
          sdp2 += SDPUtils2.writeExtmap(extension);
        });
      }
      return sdp2;
    };
    SDPUtils2.parseRtpEncodingParameters = function(mediaSection) {
      const encodingParameters = [];
      const description = SDPUtils2.parseRtpParameters(mediaSection);
      const hasRed = description.fecMechanisms.indexOf("RED") !== -1;
      const hasUlpfec = description.fecMechanisms.indexOf("ULPFEC") !== -1;
      const ssrcs = SDPUtils2.matchPrefix(mediaSection, "a=ssrc:").map((line) => SDPUtils2.parseSsrcMedia(line)).filter((parts) => parts.attribute === "cname");
      const primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
      let secondarySsrc;
      const flows = SDPUtils2.matchPrefix(mediaSection, "a=ssrc-group:FID").map((line) => {
        const parts = line.substring(17).split(" ");
        return parts.map((part) => parseInt(part, 10));
      });
      if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) {
        secondarySsrc = flows[0][1];
      }
      description.codecs.forEach((codec) => {
        if (codec.name.toUpperCase() === "RTX" && codec.parameters.apt) {
          let encParam = {
            ssrc: primarySsrc,
            codecPayloadType: parseInt(codec.parameters.apt, 10)
          };
          if (primarySsrc && secondarySsrc) {
            encParam.rtx = { ssrc: secondarySsrc };
          }
          encodingParameters.push(encParam);
          if (hasRed) {
            encParam = JSON.parse(JSON.stringify(encParam));
            encParam.fec = {
              ssrc: primarySsrc,
              mechanism: hasUlpfec ? "red+ulpfec" : "red"
            };
            encodingParameters.push(encParam);
          }
        }
      });
      if (encodingParameters.length === 0 && primarySsrc) {
        encodingParameters.push({
          ssrc: primarySsrc
        });
      }
      let bandwidth = SDPUtils2.matchPrefix(mediaSection, "b=");
      if (bandwidth.length) {
        if (bandwidth[0].indexOf("b=TIAS:") === 0) {
          bandwidth = parseInt(bandwidth[0].substring(7), 10);
        } else if (bandwidth[0].indexOf("b=AS:") === 0) {
          bandwidth = parseInt(bandwidth[0].substring(5), 10) * 1e3 * 0.95 - 50 * 40 * 8;
        } else {
          bandwidth = void 0;
        }
        encodingParameters.forEach((params) => {
          params.maxBitrate = bandwidth;
        });
      }
      return encodingParameters;
    };
    SDPUtils2.parseRtcpParameters = function(mediaSection) {
      const rtcpParameters = {};
      const remoteSsrc = SDPUtils2.matchPrefix(mediaSection, "a=ssrc:").map((line) => SDPUtils2.parseSsrcMedia(line)).filter((obj) => obj.attribute === "cname")[0];
      if (remoteSsrc) {
        rtcpParameters.cname = remoteSsrc.value;
        rtcpParameters.ssrc = remoteSsrc.ssrc;
      }
      const rsize = SDPUtils2.matchPrefix(mediaSection, "a=rtcp-rsize");
      rtcpParameters.reducedSize = rsize.length > 0;
      rtcpParameters.compound = rsize.length === 0;
      const mux = SDPUtils2.matchPrefix(mediaSection, "a=rtcp-mux");
      rtcpParameters.mux = mux.length > 0;
      return rtcpParameters;
    };
    SDPUtils2.writeRtcpParameters = function(rtcpParameters) {
      let sdp2 = "";
      if (rtcpParameters.reducedSize) {
        sdp2 += "a=rtcp-rsize\r\n";
      }
      if (rtcpParameters.mux) {
        sdp2 += "a=rtcp-mux\r\n";
      }
      if (rtcpParameters.ssrc !== void 0 && rtcpParameters.cname) {
        sdp2 += "a=ssrc:" + rtcpParameters.ssrc + " cname:" + rtcpParameters.cname + "\r\n";
      }
      return sdp2;
    };
    SDPUtils2.parseMsid = function(mediaSection) {
      let parts;
      const spec = SDPUtils2.matchPrefix(mediaSection, "a=msid:");
      if (spec.length === 1) {
        parts = spec[0].substring(7).split(" ");
        return { stream: parts[0], track: parts[1] };
      }
      const planB = SDPUtils2.matchPrefix(mediaSection, "a=ssrc:").map((line) => SDPUtils2.parseSsrcMedia(line)).filter((msidParts) => msidParts.attribute === "msid");
      if (planB.length > 0) {
        parts = planB[0].value.split(" ");
        return { stream: parts[0], track: parts[1] };
      }
    };
    SDPUtils2.parseSctpDescription = function(mediaSection) {
      const mline = SDPUtils2.parseMLine(mediaSection);
      const maxSizeLine = SDPUtils2.matchPrefix(mediaSection, "a=max-message-size:");
      let maxMessageSize;
      if (maxSizeLine.length > 0) {
        maxMessageSize = parseInt(maxSizeLine[0].substring(19), 10);
      }
      if (isNaN(maxMessageSize)) {
        maxMessageSize = 65536;
      }
      const sctpPort = SDPUtils2.matchPrefix(mediaSection, "a=sctp-port:");
      if (sctpPort.length > 0) {
        return {
          port: parseInt(sctpPort[0].substring(12), 10),
          protocol: mline.fmt,
          maxMessageSize
        };
      }
      const sctpMapLines = SDPUtils2.matchPrefix(mediaSection, "a=sctpmap:");
      if (sctpMapLines.length > 0) {
        const parts = sctpMapLines[0].substring(10).split(" ");
        return {
          port: parseInt(parts[0], 10),
          protocol: parts[1],
          maxMessageSize
        };
      }
    };
    SDPUtils2.writeSctpDescription = function(media, sctp) {
      let output = [];
      if (media.protocol !== "DTLS/SCTP") {
        output = [
          "m=" + media.kind + " 9 " + media.protocol + " " + sctp.protocol + "\r\n",
          "c=IN IP4 0.0.0.0\r\n",
          "a=sctp-port:" + sctp.port + "\r\n"
        ];
      } else {
        output = [
          "m=" + media.kind + " 9 " + media.protocol + " " + sctp.port + "\r\n",
          "c=IN IP4 0.0.0.0\r\n",
          "a=sctpmap:" + sctp.port + " " + sctp.protocol + " 65535\r\n"
        ];
      }
      if (sctp.maxMessageSize !== void 0) {
        output.push("a=max-message-size:" + sctp.maxMessageSize + "\r\n");
      }
      return output.join("");
    };
    SDPUtils2.generateSessionId = function() {
      return Math.random().toString().substr(2, 22);
    };
    SDPUtils2.writeSessionBoilerplate = function(sessId, sessVer, sessUser) {
      let sessionId;
      const version = sessVer !== void 0 ? sessVer : 2;
      if (sessId) {
        sessionId = sessId;
      } else {
        sessionId = SDPUtils2.generateSessionId();
      }
      const user = sessUser || "thisisadapterortc";
      return "v=0\r\no=" + user + " " + sessionId + " " + version + " IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n";
    };
    SDPUtils2.getDirection = function(mediaSection, sessionpart) {
      const lines = SDPUtils2.splitLines(mediaSection);
      for (let i = 0; i < lines.length; i++) {
        switch (lines[i]) {
          case "a=sendrecv":
          case "a=sendonly":
          case "a=recvonly":
          case "a=inactive":
            return lines[i].substring(2);
          default:
        }
      }
      if (sessionpart) {
        return SDPUtils2.getDirection(sessionpart);
      }
      return "sendrecv";
    };
    SDPUtils2.getKind = function(mediaSection) {
      const lines = SDPUtils2.splitLines(mediaSection);
      const mline = lines[0].split(" ");
      return mline[0].substring(2);
    };
    SDPUtils2.isRejected = function(mediaSection) {
      return mediaSection.split(" ", 2)[1] === "0";
    };
    SDPUtils2.parseMLine = function(mediaSection) {
      const lines = SDPUtils2.splitLines(mediaSection);
      const parts = lines[0].substring(2).split(" ");
      return {
        kind: parts[0],
        port: parseInt(parts[1], 10),
        protocol: parts[2],
        fmt: parts.slice(3).join(" ")
      };
    };
    SDPUtils2.parseOLine = function(mediaSection) {
      const line = SDPUtils2.matchPrefix(mediaSection, "o=")[0];
      const parts = line.substring(2).split(" ");
      return {
        username: parts[0],
        sessionId: parts[1],
        sessionVersion: parseInt(parts[2], 10),
        netType: parts[3],
        addressType: parts[4],
        address: parts[5]
      };
    };
    SDPUtils2.isValidSDP = function(blob) {
      if (typeof blob !== "string" || blob.length === 0) {
        return false;
      }
      const lines = SDPUtils2.splitLines(blob);
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].length < 2 || lines[i].charAt(1) !== "=") {
          return false;
        }
      }
      return true;
    };
    if (typeof module === "object") {
      module.exports = SDPUtils2;
    }
  }
});

// node_modules/webrtc-adapter/src/js/utils.js
var logDisabled_ = true;
var deprecationWarnings_ = true;
function extractVersion(uastring, expr, pos) {
  const match = uastring.match(expr);
  return match && match.length >= pos && parseFloat(match[pos], 10);
}
function wrapPeerConnectionEvent(window2, eventNameToWrap, wrapper) {
  if (!window2.RTCPeerConnection) {
    return;
  }
  const proto = window2.RTCPeerConnection.prototype;
  const nativeAddEventListener = proto.addEventListener;
  proto.addEventListener = function(nativeEventName, cb) {
    if (nativeEventName !== eventNameToWrap) {
      return nativeAddEventListener.apply(this, arguments);
    }
    const wrappedCallback = (e) => {
      const modifiedEvent = wrapper(e);
      if (modifiedEvent) {
        if (cb.handleEvent) {
          cb.handleEvent(modifiedEvent);
        } else {
          cb(modifiedEvent);
        }
      }
    };
    this._eventMap = this._eventMap || {};
    if (!this._eventMap[eventNameToWrap]) {
      this._eventMap[eventNameToWrap] = /* @__PURE__ */ new Map();
    }
    this._eventMap[eventNameToWrap].set(cb, wrappedCallback);
    return nativeAddEventListener.apply(this, [
      nativeEventName,
      wrappedCallback
    ]);
  };
  const nativeRemoveEventListener = proto.removeEventListener;
  proto.removeEventListener = function(nativeEventName, cb) {
    if (nativeEventName !== eventNameToWrap || !this._eventMap || !this._eventMap[eventNameToWrap]) {
      return nativeRemoveEventListener.apply(this, arguments);
    }
    if (!this._eventMap[eventNameToWrap].has(cb)) {
      return nativeRemoveEventListener.apply(this, arguments);
    }
    const unwrappedCb = this._eventMap[eventNameToWrap].get(cb);
    this._eventMap[eventNameToWrap].delete(cb);
    if (this._eventMap[eventNameToWrap].size === 0) {
      delete this._eventMap[eventNameToWrap];
    }
    if (Object.keys(this._eventMap).length === 0) {
      delete this._eventMap;
    }
    return nativeRemoveEventListener.apply(this, [
      nativeEventName,
      unwrappedCb
    ]);
  };
  Object.defineProperty(proto, "on" + eventNameToWrap, {
    get() {
      return this["_on" + eventNameToWrap];
    },
    set(cb) {
      if (this["_on" + eventNameToWrap]) {
        this.removeEventListener(
          eventNameToWrap,
          this["_on" + eventNameToWrap]
        );
        delete this["_on" + eventNameToWrap];
      }
      if (cb) {
        this.addEventListener(
          eventNameToWrap,
          this["_on" + eventNameToWrap] = cb
        );
      }
    },
    enumerable: true,
    configurable: true
  });
}
function disableLog(bool) {
  if (typeof bool !== "boolean") {
    return new Error("Argument type: " + typeof bool + ". Please use a boolean.");
  }
  logDisabled_ = bool;
  return bool ? "adapter.js logging disabled" : "adapter.js logging enabled";
}
function disableWarnings(bool) {
  if (typeof bool !== "boolean") {
    return new Error("Argument type: " + typeof bool + ". Please use a boolean.");
  }
  deprecationWarnings_ = !bool;
  return "adapter.js deprecation warnings " + (bool ? "disabled" : "enabled");
}
function log() {
  if (typeof window === "object") {
    if (logDisabled_) {
      return;
    }
    if (typeof console !== "undefined" && typeof console.log === "function") {
      console.log.apply(console, arguments);
    }
  }
}
function deprecated(oldMethod, newMethod) {
  if (!deprecationWarnings_) {
    return;
  }
  console.warn(oldMethod + " is deprecated, please use " + newMethod + " instead.");
}
function detectBrowser(window2) {
  const result = { browser: null, version: null };
  if (typeof window2 === "undefined" || !window2.navigator || !window2.navigator.userAgent) {
    result.browser = "Not a browser.";
    return result;
  }
  const { navigator: navigator2 } = window2;
  if (navigator2.userAgentData && navigator2.userAgentData.brands) {
    const chromium = navigator2.userAgentData.brands.find((brand) => {
      return brand.brand === "Chromium";
    });
    if (chromium) {
      return { browser: "chrome", version: parseInt(chromium.version, 10) };
    }
  }
  if (navigator2.mozGetUserMedia) {
    result.browser = "firefox";
    result.version = parseInt(extractVersion(
      navigator2.userAgent,
      /Firefox\/(\d+)\./,
      1
    ));
  } else if (navigator2.webkitGetUserMedia || window2.isSecureContext === false && window2.webkitRTCPeerConnection) {
    result.browser = "chrome";
    result.version = parseInt(extractVersion(
      navigator2.userAgent,
      /Chrom(e|ium)\/(\d+)\./,
      2
    ));
  } else if (window2.RTCPeerConnection && navigator2.userAgent.match(/AppleWebKit\/(\d+)\./)) {
    result.browser = "safari";
    result.version = parseInt(extractVersion(
      navigator2.userAgent,
      /AppleWebKit\/(\d+)\./,
      1
    ));
    result.supportsUnifiedPlan = window2.RTCRtpTransceiver && "currentDirection" in window2.RTCRtpTransceiver.prototype;
    result._safariVersion = extractVersion(
      navigator2.userAgent,
      /Version\/(\d+(\.?\d+))/,
      1
    );
  } else {
    result.browser = "Not a supported browser.";
    return result;
  }
  return result;
}
function isObject(val) {
  return Object.prototype.toString.call(val) === "[object Object]";
}
function compactObject(data) {
  if (!isObject(data)) {
    return data;
  }
  return Object.keys(data).reduce(function(accumulator, key) {
    const isObj = isObject(data[key]);
    const value = isObj ? compactObject(data[key]) : data[key];
    const isEmptyObject = isObj && !Object.keys(value).length;
    if (value === void 0 || isEmptyObject) {
      return accumulator;
    }
    return Object.assign(accumulator, { [key]: value });
  }, {});
}
function walkStats(stats, base, resultSet) {
  if (!base || resultSet.has(base.id)) {
    return;
  }
  resultSet.set(base.id, base);
  Object.keys(base).forEach((name) => {
    if (name.endsWith("Id")) {
      walkStats(stats, stats.get(base[name]), resultSet);
    } else if (name.endsWith("Ids")) {
      base[name].forEach((id) => {
        walkStats(stats, stats.get(id), resultSet);
      });
    }
  });
}
function filterStats(result, track, outbound) {
  const streamStatsType = outbound ? "outbound-rtp" : "inbound-rtp";
  const filteredResult = /* @__PURE__ */ new Map();
  if (track === null) {
    return filteredResult;
  }
  const trackStats = [];
  result.forEach((value) => {
    if (value.type === "track" && value.trackIdentifier === track.id) {
      trackStats.push(value);
    }
  });
  trackStats.forEach((trackStat) => {
    result.forEach((stats) => {
      if (stats.type === streamStatsType && stats.trackId === trackStat.id) {
        walkStats(result, stats, filteredResult);
      }
    });
  });
  return filteredResult;
}

// node_modules/webrtc-adapter/src/js/chrome/chrome_shim.js
var chrome_shim_exports = {};
__export(chrome_shim_exports, {
  fixNegotiationNeeded: () => fixNegotiationNeeded,
  shimAddTrackRemoveTrack: () => shimAddTrackRemoveTrack,
  shimAddTrackRemoveTrackWithNative: () => shimAddTrackRemoveTrackWithNative,
  shimGetSendersWithDtmf: () => shimGetSendersWithDtmf,
  shimGetUserMedia: () => shimGetUserMedia,
  shimMediaStream: () => shimMediaStream,
  shimOnTrack: () => shimOnTrack,
  shimPeerConnection: () => shimPeerConnection,
  shimSenderReceiverGetStats: () => shimSenderReceiverGetStats
});

// node_modules/webrtc-adapter/src/js/chrome/getusermedia.js
var logging = log;
function shimGetUserMedia(window2, browserDetails) {
  const navigator2 = window2 && window2.navigator;
  if (!navigator2.mediaDevices) {
    return;
  }
  const constraintsToChrome_ = function(c) {
    if (typeof c !== "object" || c.mandatory || c.optional) {
      return c;
    }
    const cc = {};
    Object.keys(c).forEach((key) => {
      if (key === "require" || key === "advanced" || key === "mediaSource") {
        return;
      }
      const r = typeof c[key] === "object" ? c[key] : { ideal: c[key] };
      if (r.exact !== void 0 && typeof r.exact === "number") {
        r.min = r.max = r.exact;
      }
      const oldname_ = function(prefix, name) {
        if (prefix) {
          return prefix + name.charAt(0).toUpperCase() + name.slice(1);
        }
        return name === "deviceId" ? "sourceId" : name;
      };
      if (r.ideal !== void 0) {
        cc.optional = cc.optional || [];
        let oc = {};
        if (typeof r.ideal === "number") {
          oc[oldname_("min", key)] = r.ideal;
          cc.optional.push(oc);
          oc = {};
          oc[oldname_("max", key)] = r.ideal;
          cc.optional.push(oc);
        } else {
          oc[oldname_("", key)] = r.ideal;
          cc.optional.push(oc);
        }
      }
      if (r.exact !== void 0 && typeof r.exact !== "number") {
        cc.mandatory = cc.mandatory || {};
        cc.mandatory[oldname_("", key)] = r.exact;
      } else {
        ["min", "max"].forEach((mix) => {
          if (r[mix] !== void 0) {
            cc.mandatory = cc.mandatory || {};
            cc.mandatory[oldname_(mix, key)] = r[mix];
          }
        });
      }
    });
    if (c.advanced) {
      cc.optional = (cc.optional || []).concat(c.advanced);
    }
    return cc;
  };
  const shimConstraints_ = function(constraints, func) {
    if (browserDetails.version >= 61) {
      return func(constraints);
    }
    constraints = JSON.parse(JSON.stringify(constraints));
    if (constraints && typeof constraints.audio === "object") {
      const remap = function(obj, a, b) {
        if (a in obj && !(b in obj)) {
          obj[b] = obj[a];
          delete obj[a];
        }
      };
      constraints = JSON.parse(JSON.stringify(constraints));
      remap(constraints.audio, "autoGainControl", "googAutoGainControl");
      remap(constraints.audio, "noiseSuppression", "googNoiseSuppression");
      constraints.audio = constraintsToChrome_(constraints.audio);
    }
    if (constraints && typeof constraints.video === "object") {
      let face = constraints.video.facingMode;
      face = face && (typeof face === "object" ? face : { ideal: face });
      const getSupportedFacingModeLies = browserDetails.version < 66;
      if (face && (face.exact === "user" || face.exact === "environment" || face.ideal === "user" || face.ideal === "environment") && !(navigator2.mediaDevices.getSupportedConstraints && navigator2.mediaDevices.getSupportedConstraints().facingMode && !getSupportedFacingModeLies)) {
        delete constraints.video.facingMode;
        let matches;
        if (face.exact === "environment" || face.ideal === "environment") {
          matches = ["back", "rear"];
        } else if (face.exact === "user" || face.ideal === "user") {
          matches = ["front"];
        }
        if (matches) {
          return navigator2.mediaDevices.enumerateDevices().then((devices) => {
            devices = devices.filter((d) => d.kind === "videoinput");
            let dev = devices.find((d) => matches.some((match) => d.label.toLowerCase().includes(match)));
            if (!dev && devices.length && matches.includes("back")) {
              dev = devices[devices.length - 1];
            }
            if (dev) {
              constraints.video.deviceId = face.exact ? { exact: dev.deviceId } : { ideal: dev.deviceId };
            }
            constraints.video = constraintsToChrome_(constraints.video);
            logging("chrome: " + JSON.stringify(constraints));
            return func(constraints);
          });
        }
      }
      constraints.video = constraintsToChrome_(constraints.video);
    }
    logging("chrome: " + JSON.stringify(constraints));
    return func(constraints);
  };
  const shimError_ = function(e) {
    if (browserDetails.version >= 64) {
      return e;
    }
    return {
      name: {
        PermissionDeniedError: "NotAllowedError",
        PermissionDismissedError: "NotAllowedError",
        InvalidStateError: "NotAllowedError",
        DevicesNotFoundError: "NotFoundError",
        ConstraintNotSatisfiedError: "OverconstrainedError",
        TrackStartError: "NotReadableError",
        MediaDeviceFailedDueToShutdown: "NotAllowedError",
        MediaDeviceKillSwitchOn: "NotAllowedError",
        TabCaptureError: "AbortError",
        ScreenCaptureError: "AbortError",
        DeviceCaptureError: "AbortError"
      }[e.name] || e.name,
      message: e.message,
      constraint: e.constraint || e.constraintName,
      toString() {
        return this.name + (this.message && ": ") + this.message;
      }
    };
  };
  const getUserMedia_ = function(constraints, onSuccess, onError) {
    shimConstraints_(constraints, (c) => {
      navigator2.webkitGetUserMedia(c, onSuccess, (e) => {
        if (onError) {
          onError(shimError_(e));
        }
      });
    });
  };
  navigator2.getUserMedia = getUserMedia_.bind(navigator2);
  if (navigator2.mediaDevices.getUserMedia) {
    const origGetUserMedia = navigator2.mediaDevices.getUserMedia.bind(navigator2.mediaDevices);
    navigator2.mediaDevices.getUserMedia = function(cs) {
      return shimConstraints_(cs, (c) => origGetUserMedia(c).then((stream) => {
        if (c.audio && !stream.getAudioTracks().length || c.video && !stream.getVideoTracks().length) {
          stream.getTracks().forEach((track) => {
            track.stop();
          });
          throw new DOMException("", "NotFoundError");
        }
        return stream;
      }, (e) => Promise.reject(shimError_(e))));
    };
  }
}

// node_modules/webrtc-adapter/src/js/chrome/chrome_shim.js
function shimMediaStream(window2) {
  window2.MediaStream = window2.MediaStream || window2.webkitMediaStream;
}
function shimOnTrack(window2) {
  if (typeof window2 === "object" && window2.RTCPeerConnection && !("ontrack" in window2.RTCPeerConnection.prototype)) {
    Object.defineProperty(window2.RTCPeerConnection.prototype, "ontrack", {
      get() {
        return this._ontrack;
      },
      set(f) {
        if (this._ontrack) {
          this.removeEventListener("track", this._ontrack);
        }
        this.addEventListener("track", this._ontrack = f);
      },
      enumerable: true,
      configurable: true
    });
    const origSetRemoteDescription = window2.RTCPeerConnection.prototype.setRemoteDescription;
    window2.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
      if (!this._ontrackpoly) {
        this._ontrackpoly = (e) => {
          e.stream.addEventListener("addtrack", (te) => {
            let receiver;
            if (window2.RTCPeerConnection.prototype.getReceivers) {
              receiver = this.getReceivers().find((r) => r.track && r.track.id === te.track.id);
            } else {
              receiver = { track: te.track };
            }
            const event = new Event("track");
            event.track = te.track;
            event.receiver = receiver;
            event.transceiver = { receiver };
            event.streams = [e.stream];
            this.dispatchEvent(event);
          });
          e.stream.getTracks().forEach((track) => {
            let receiver;
            if (window2.RTCPeerConnection.prototype.getReceivers) {
              receiver = this.getReceivers().find((r) => r.track && r.track.id === track.id);
            } else {
              receiver = { track };
            }
            const event = new Event("track");
            event.track = track;
            event.receiver = receiver;
            event.transceiver = { receiver };
            event.streams = [e.stream];
            this.dispatchEvent(event);
          });
        };
        this.addEventListener("addstream", this._ontrackpoly);
      }
      return origSetRemoteDescription.apply(this, arguments);
    };
  } else {
    wrapPeerConnectionEvent(window2, "track", (e) => {
      if (!e.transceiver) {
        Object.defineProperty(
          e,
          "transceiver",
          { value: { receiver: e.receiver } }
        );
      }
      return e;
    });
  }
}
function shimGetSendersWithDtmf(window2) {
  if (typeof window2 === "object" && window2.RTCPeerConnection && !("getSenders" in window2.RTCPeerConnection.prototype) && "createDTMFSender" in window2.RTCPeerConnection.prototype) {
    const shimSenderWithDtmf = function(pc, track) {
      return {
        track,
        get dtmf() {
          if (this._dtmf === void 0) {
            if (track.kind === "audio") {
              this._dtmf = pc.createDTMFSender(track);
            } else {
              this._dtmf = null;
            }
          }
          return this._dtmf;
        },
        _pc: pc
      };
    };
    if (!window2.RTCPeerConnection.prototype.getSenders) {
      window2.RTCPeerConnection.prototype.getSenders = function getSenders() {
        this._senders = this._senders || [];
        return this._senders.slice();
      };
      const origAddTrack = window2.RTCPeerConnection.prototype.addTrack;
      window2.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
        let sender = origAddTrack.apply(this, arguments);
        if (!sender) {
          sender = shimSenderWithDtmf(this, track);
          this._senders.push(sender);
        }
        return sender;
      };
      const origRemoveTrack = window2.RTCPeerConnection.prototype.removeTrack;
      window2.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
        origRemoveTrack.apply(this, arguments);
        const idx = this._senders.indexOf(sender);
        if (idx !== -1) {
          this._senders.splice(idx, 1);
        }
      };
    }
    const origAddStream = window2.RTCPeerConnection.prototype.addStream;
    window2.RTCPeerConnection.prototype.addStream = function addStream(stream) {
      this._senders = this._senders || [];
      origAddStream.apply(this, [stream]);
      stream.getTracks().forEach((track) => {
        this._senders.push(shimSenderWithDtmf(this, track));
      });
    };
    const origRemoveStream = window2.RTCPeerConnection.prototype.removeStream;
    window2.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
      this._senders = this._senders || [];
      origRemoveStream.apply(this, [stream]);
      stream.getTracks().forEach((track) => {
        const sender = this._senders.find((s) => s.track === track);
        if (sender) {
          this._senders.splice(this._senders.indexOf(sender), 1);
        }
      });
    };
  } else if (typeof window2 === "object" && window2.RTCPeerConnection && "getSenders" in window2.RTCPeerConnection.prototype && "createDTMFSender" in window2.RTCPeerConnection.prototype && window2.RTCRtpSender && !("dtmf" in window2.RTCRtpSender.prototype)) {
    const origGetSenders = window2.RTCPeerConnection.prototype.getSenders;
    window2.RTCPeerConnection.prototype.getSenders = function getSenders() {
      const senders = origGetSenders.apply(this, []);
      senders.forEach((sender) => sender._pc = this);
      return senders;
    };
    Object.defineProperty(window2.RTCRtpSender.prototype, "dtmf", {
      get() {
        if (this._dtmf === void 0) {
          if (this.track.kind === "audio") {
            this._dtmf = this._pc.createDTMFSender(this.track);
          } else {
            this._dtmf = null;
          }
        }
        return this._dtmf;
      }
    });
  }
}
function shimSenderReceiverGetStats(window2) {
  if (!(typeof window2 === "object" && window2.RTCPeerConnection && window2.RTCRtpSender && window2.RTCRtpReceiver)) {
    return;
  }
  if (!("getStats" in window2.RTCRtpSender.prototype)) {
    const origGetSenders = window2.RTCPeerConnection.prototype.getSenders;
    if (origGetSenders) {
      window2.RTCPeerConnection.prototype.getSenders = function getSenders() {
        const senders = origGetSenders.apply(this, []);
        senders.forEach((sender) => sender._pc = this);
        return senders;
      };
    }
    const origAddTrack = window2.RTCPeerConnection.prototype.addTrack;
    if (origAddTrack) {
      window2.RTCPeerConnection.prototype.addTrack = function addTrack() {
        const sender = origAddTrack.apply(this, arguments);
        sender._pc = this;
        return sender;
      };
    }
    window2.RTCRtpSender.prototype.getStats = function getStats() {
      const sender = this;
      return this._pc.getStats().then((result) => (
        /* Note: this will include stats of all senders that
         *   send a track with the same id as sender.track as
         *   it is not possible to identify the RTCRtpSender.
         */
        filterStats(result, sender.track, true)
      ));
    };
  }
  if (!("getStats" in window2.RTCRtpReceiver.prototype)) {
    const origGetReceivers = window2.RTCPeerConnection.prototype.getReceivers;
    if (origGetReceivers) {
      window2.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
        const receivers = origGetReceivers.apply(this, []);
        receivers.forEach((receiver) => receiver._pc = this);
        return receivers;
      };
    }
    wrapPeerConnectionEvent(window2, "track", (e) => {
      e.receiver._pc = e.srcElement;
      return e;
    });
    window2.RTCRtpReceiver.prototype.getStats = function getStats() {
      const receiver = this;
      return this._pc.getStats().then((result) => filterStats(result, receiver.track, false));
    };
  }
  if (!("getStats" in window2.RTCRtpSender.prototype && "getStats" in window2.RTCRtpReceiver.prototype)) {
    return;
  }
  const origGetStats = window2.RTCPeerConnection.prototype.getStats;
  window2.RTCPeerConnection.prototype.getStats = function getStats() {
    if (arguments.length > 0 && arguments[0] instanceof window2.MediaStreamTrack) {
      const track = arguments[0];
      let sender;
      let receiver;
      let err;
      this.getSenders().forEach((s) => {
        if (s.track === track) {
          if (sender) {
            err = true;
          } else {
            sender = s;
          }
        }
      });
      this.getReceivers().forEach((r) => {
        if (r.track === track) {
          if (receiver) {
            err = true;
          } else {
            receiver = r;
          }
        }
        return r.track === track;
      });
      if (err || sender && receiver) {
        return Promise.reject(new DOMException(
          "There are more than one sender or receiver for the track.",
          "InvalidAccessError"
        ));
      } else if (sender) {
        return sender.getStats();
      } else if (receiver) {
        return receiver.getStats();
      }
      return Promise.reject(new DOMException(
        "There is no sender or receiver for the track.",
        "InvalidAccessError"
      ));
    }
    return origGetStats.apply(this, arguments);
  };
}
function shimAddTrackRemoveTrackWithNative(window2) {
  window2.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
    this._shimmedLocalStreams = this._shimmedLocalStreams || {};
    return Object.keys(this._shimmedLocalStreams).map((streamId) => this._shimmedLocalStreams[streamId][0]);
  };
  const origAddTrack = window2.RTCPeerConnection.prototype.addTrack;
  window2.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
    if (!stream) {
      return origAddTrack.apply(this, arguments);
    }
    this._shimmedLocalStreams = this._shimmedLocalStreams || {};
    const sender = origAddTrack.apply(this, arguments);
    if (!this._shimmedLocalStreams[stream.id]) {
      this._shimmedLocalStreams[stream.id] = [stream, sender];
    } else if (this._shimmedLocalStreams[stream.id].indexOf(sender) === -1) {
      this._shimmedLocalStreams[stream.id].push(sender);
    }
    return sender;
  };
  const origAddStream = window2.RTCPeerConnection.prototype.addStream;
  window2.RTCPeerConnection.prototype.addStream = function addStream(stream) {
    this._shimmedLocalStreams = this._shimmedLocalStreams || {};
    stream.getTracks().forEach((track) => {
      const alreadyExists = this.getSenders().find((s) => s.track === track);
      if (alreadyExists) {
        throw new DOMException(
          "Track already exists.",
          "InvalidAccessError"
        );
      }
    });
    const existingSenders = this.getSenders();
    origAddStream.apply(this, arguments);
    const newSenders = this.getSenders().filter((newSender) => existingSenders.indexOf(newSender) === -1);
    this._shimmedLocalStreams[stream.id] = [stream].concat(newSenders);
  };
  const origRemoveStream = window2.RTCPeerConnection.prototype.removeStream;
  window2.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
    this._shimmedLocalStreams = this._shimmedLocalStreams || {};
    delete this._shimmedLocalStreams[stream.id];
    return origRemoveStream.apply(this, arguments);
  };
  const origRemoveTrack = window2.RTCPeerConnection.prototype.removeTrack;
  window2.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
    this._shimmedLocalStreams = this._shimmedLocalStreams || {};
    if (sender) {
      Object.keys(this._shimmedLocalStreams).forEach((streamId) => {
        const idx = this._shimmedLocalStreams[streamId].indexOf(sender);
        if (idx !== -1) {
          this._shimmedLocalStreams[streamId].splice(idx, 1);
        }
        if (this._shimmedLocalStreams[streamId].length === 1) {
          delete this._shimmedLocalStreams[streamId];
        }
      });
    }
    return origRemoveTrack.apply(this, arguments);
  };
}
function shimAddTrackRemoveTrack(window2, browserDetails) {
  if (!window2.RTCPeerConnection) {
    return;
  }
  if (window2.RTCPeerConnection.prototype.addTrack && browserDetails.version >= 65) {
    return shimAddTrackRemoveTrackWithNative(window2);
  }
  const origGetLocalStreams = window2.RTCPeerConnection.prototype.getLocalStreams;
  window2.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
    const nativeStreams = origGetLocalStreams.apply(this);
    this._reverseStreams = this._reverseStreams || {};
    return nativeStreams.map((stream) => this._reverseStreams[stream.id]);
  };
  const origAddStream = window2.RTCPeerConnection.prototype.addStream;
  window2.RTCPeerConnection.prototype.addStream = function addStream(stream) {
    this._streams = this._streams || {};
    this._reverseStreams = this._reverseStreams || {};
    stream.getTracks().forEach((track) => {
      const alreadyExists = this.getSenders().find((s) => s.track === track);
      if (alreadyExists) {
        throw new DOMException(
          "Track already exists.",
          "InvalidAccessError"
        );
      }
    });
    if (!this._reverseStreams[stream.id]) {
      const newStream = new window2.MediaStream(stream.getTracks());
      this._streams[stream.id] = newStream;
      this._reverseStreams[newStream.id] = stream;
      stream = newStream;
    }
    origAddStream.apply(this, [stream]);
  };
  const origRemoveStream = window2.RTCPeerConnection.prototype.removeStream;
  window2.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
    this._streams = this._streams || {};
    this._reverseStreams = this._reverseStreams || {};
    origRemoveStream.apply(this, [this._streams[stream.id] || stream]);
    delete this._reverseStreams[this._streams[stream.id] ? this._streams[stream.id].id : stream.id];
    delete this._streams[stream.id];
  };
  window2.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
    if (this.signalingState === "closed") {
      throw new DOMException(
        "The RTCPeerConnection's signalingState is 'closed'.",
        "InvalidStateError"
      );
    }
    const streams = [].slice.call(arguments, 1);
    if (streams.length !== 1 || !streams[0].getTracks().find((t) => t === track)) {
      throw new DOMException(
        "The adapter.js addTrack polyfill only supports a single  stream which is associated with the specified track.",
        "NotSupportedError"
      );
    }
    const alreadyExists = this.getSenders().find((s) => s.track === track);
    if (alreadyExists) {
      throw new DOMException(
        "Track already exists.",
        "InvalidAccessError"
      );
    }
    this._streams = this._streams || {};
    this._reverseStreams = this._reverseStreams || {};
    const oldStream = this._streams[stream.id];
    if (oldStream) {
      oldStream.addTrack(track);
      Promise.resolve().then(() => {
        this.dispatchEvent(new Event("negotiationneeded"));
      });
    } else {
      const newStream = new window2.MediaStream([track]);
      this._streams[stream.id] = newStream;
      this._reverseStreams[newStream.id] = stream;
      this.addStream(newStream);
    }
    return this.getSenders().find((s) => s.track === track);
  };
  function replaceInternalStreamId(pc, description) {
    let sdp2 = description.sdp;
    Object.keys(pc._reverseStreams || []).forEach((internalId) => {
      const externalStream = pc._reverseStreams[internalId];
      const internalStream = pc._streams[externalStream.id];
      sdp2 = sdp2.replace(
        new RegExp(internalStream.id, "g"),
        externalStream.id
      );
    });
    return new RTCSessionDescription({
      type: description.type,
      sdp: sdp2
    });
  }
  function replaceExternalStreamId(pc, description) {
    let sdp2 = description.sdp;
    Object.keys(pc._reverseStreams || []).forEach((internalId) => {
      const externalStream = pc._reverseStreams[internalId];
      const internalStream = pc._streams[externalStream.id];
      sdp2 = sdp2.replace(
        new RegExp(externalStream.id, "g"),
        internalStream.id
      );
    });
    return new RTCSessionDescription({
      type: description.type,
      sdp: sdp2
    });
  }
  ["createOffer", "createAnswer"].forEach(function(method) {
    const nativeMethod = window2.RTCPeerConnection.prototype[method];
    const methodObj = { [method]() {
      const args = arguments;
      const isLegacyCall = arguments.length && typeof arguments[0] === "function";
      if (isLegacyCall) {
        return nativeMethod.apply(this, [
          (description) => {
            const desc = replaceInternalStreamId(this, description);
            args[0].apply(null, [desc]);
          },
          (err) => {
            if (args[1]) {
              args[1].apply(null, err);
            }
          },
          arguments[2]
        ]);
      }
      return nativeMethod.apply(this, arguments).then((description) => replaceInternalStreamId(this, description));
    } };
    window2.RTCPeerConnection.prototype[method] = methodObj[method];
  });
  const origSetLocalDescription = window2.RTCPeerConnection.prototype.setLocalDescription;
  window2.RTCPeerConnection.prototype.setLocalDescription = function setLocalDescription() {
    if (!arguments.length || !arguments[0].type) {
      return origSetLocalDescription.apply(this, arguments);
    }
    arguments[0] = replaceExternalStreamId(this, arguments[0]);
    return origSetLocalDescription.apply(this, arguments);
  };
  const origLocalDescription = Object.getOwnPropertyDescriptor(
    window2.RTCPeerConnection.prototype,
    "localDescription"
  );
  Object.defineProperty(
    window2.RTCPeerConnection.prototype,
    "localDescription",
    {
      get() {
        const description = origLocalDescription.get.apply(this);
        if (description.type === "") {
          return description;
        }
        return replaceInternalStreamId(this, description);
      }
    }
  );
  window2.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
    if (this.signalingState === "closed") {
      throw new DOMException(
        "The RTCPeerConnection's signalingState is 'closed'.",
        "InvalidStateError"
      );
    }
    if (!sender._pc) {
      throw new DOMException("Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.", "TypeError");
    }
    const isLocal = sender._pc === this;
    if (!isLocal) {
      throw new DOMException(
        "Sender was not created by this connection.",
        "InvalidAccessError"
      );
    }
    this._streams = this._streams || {};
    let stream;
    Object.keys(this._streams).forEach((streamid) => {
      const hasTrack = this._streams[streamid].getTracks().find((track) => sender.track === track);
      if (hasTrack) {
        stream = this._streams[streamid];
      }
    });
    if (stream) {
      if (stream.getTracks().length === 1) {
        this.removeStream(this._reverseStreams[stream.id]);
      } else {
        stream.removeTrack(sender.track);
      }
      this.dispatchEvent(new Event("negotiationneeded"));
    }
  };
}
function shimPeerConnection(window2, browserDetails) {
  if (!window2.RTCPeerConnection && window2.webkitRTCPeerConnection) {
    window2.RTCPeerConnection = window2.webkitRTCPeerConnection;
  }
  if (!window2.RTCPeerConnection) {
    return;
  }
  if (browserDetails.version < 53) {
    ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function(method) {
      const nativeMethod = window2.RTCPeerConnection.prototype[method];
      const methodObj = { [method]() {
        arguments[0] = new (method === "addIceCandidate" ? window2.RTCIceCandidate : window2.RTCSessionDescription)(arguments[0]);
        return nativeMethod.apply(this, arguments);
      } };
      window2.RTCPeerConnection.prototype[method] = methodObj[method];
    });
  }
}
function fixNegotiationNeeded(window2, browserDetails) {
  wrapPeerConnectionEvent(window2, "negotiationneeded", (e) => {
    const pc = e.target;
    if (browserDetails.version < 72 || pc.getConfiguration && pc.getConfiguration().sdpSemantics === "plan-b") {
      if (pc.signalingState !== "stable") {
        return;
      }
    }
    return e;
  });
}

// node_modules/webrtc-adapter/src/js/firefox/firefox_shim.js
var firefox_shim_exports = {};
__export(firefox_shim_exports, {
  shimAddTransceiver: () => shimAddTransceiver,
  shimCreateAnswer: () => shimCreateAnswer,
  shimCreateOffer: () => shimCreateOffer,
  shimGetDisplayMedia: () => shimGetDisplayMedia,
  shimGetParameters: () => shimGetParameters,
  shimGetUserMedia: () => shimGetUserMedia2,
  shimOnTrack: () => shimOnTrack2,
  shimPeerConnection: () => shimPeerConnection2,
  shimRTCDataChannel: () => shimRTCDataChannel,
  shimReceiverGetStats: () => shimReceiverGetStats,
  shimRemoveStream: () => shimRemoveStream,
  shimSenderGetStats: () => shimSenderGetStats
});

// node_modules/webrtc-adapter/src/js/firefox/getusermedia.js
function shimGetUserMedia2(window2, browserDetails) {
  const navigator2 = window2 && window2.navigator;
  const MediaStreamTrack = window2 && window2.MediaStreamTrack;
  navigator2.getUserMedia = function(constraints, onSuccess, onError) {
    deprecated(
      "navigator.getUserMedia",
      "navigator.mediaDevices.getUserMedia"
    );
    navigator2.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
  };
  if (!(browserDetails.version > 55 && "autoGainControl" in navigator2.mediaDevices.getSupportedConstraints())) {
    const remap = function(obj, a, b) {
      if (a in obj && !(b in obj)) {
        obj[b] = obj[a];
        delete obj[a];
      }
    };
    const nativeGetUserMedia = navigator2.mediaDevices.getUserMedia.bind(navigator2.mediaDevices);
    navigator2.mediaDevices.getUserMedia = function(c) {
      if (typeof c === "object" && typeof c.audio === "object") {
        c = JSON.parse(JSON.stringify(c));
        remap(c.audio, "autoGainControl", "mozAutoGainControl");
        remap(c.audio, "noiseSuppression", "mozNoiseSuppression");
      }
      return nativeGetUserMedia(c);
    };
    if (MediaStreamTrack && MediaStreamTrack.prototype.getSettings) {
      const nativeGetSettings = MediaStreamTrack.prototype.getSettings;
      MediaStreamTrack.prototype.getSettings = function() {
        const obj = nativeGetSettings.apply(this, arguments);
        remap(obj, "mozAutoGainControl", "autoGainControl");
        remap(obj, "mozNoiseSuppression", "noiseSuppression");
        return obj;
      };
    }
    if (MediaStreamTrack && MediaStreamTrack.prototype.applyConstraints) {
      const nativeApplyConstraints = MediaStreamTrack.prototype.applyConstraints;
      MediaStreamTrack.prototype.applyConstraints = function(c) {
        if (this.kind === "audio" && typeof c === "object") {
          c = JSON.parse(JSON.stringify(c));
          remap(c, "autoGainControl", "mozAutoGainControl");
          remap(c, "noiseSuppression", "mozNoiseSuppression");
        }
        return nativeApplyConstraints.apply(this, [c]);
      };
    }
  }
}

// node_modules/webrtc-adapter/src/js/firefox/getdisplaymedia.js
function shimGetDisplayMedia(window2, preferredMediaSource) {
  if (window2.navigator.mediaDevices && "getDisplayMedia" in window2.navigator.mediaDevices) {
    return;
  }
  if (!window2.navigator.mediaDevices) {
    return;
  }
  window2.navigator.mediaDevices.getDisplayMedia = function getDisplayMedia(constraints) {
    if (!(constraints && constraints.video)) {
      const err = new DOMException("getDisplayMedia without video constraints is undefined");
      err.name = "NotFoundError";
      err.code = 8;
      return Promise.reject(err);
    }
    if (constraints.video === true) {
      constraints.video = { mediaSource: preferredMediaSource };
    } else {
      constraints.video.mediaSource = preferredMediaSource;
    }
    return window2.navigator.mediaDevices.getUserMedia(constraints);
  };
}

// node_modules/webrtc-adapter/src/js/firefox/firefox_shim.js
function shimOnTrack2(window2) {
  if (typeof window2 === "object" && window2.RTCTrackEvent && "receiver" in window2.RTCTrackEvent.prototype && !("transceiver" in window2.RTCTrackEvent.prototype)) {
    Object.defineProperty(window2.RTCTrackEvent.prototype, "transceiver", {
      get() {
        return { receiver: this.receiver };
      }
    });
  }
}
function shimPeerConnection2(window2, browserDetails) {
  if (typeof window2 !== "object" || !(window2.RTCPeerConnection || window2.mozRTCPeerConnection)) {
    return;
  }
  if (!window2.RTCPeerConnection && window2.mozRTCPeerConnection) {
    window2.RTCPeerConnection = window2.mozRTCPeerConnection;
  }
  if (browserDetails.version < 53) {
    ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function(method) {
      const nativeMethod = window2.RTCPeerConnection.prototype[method];
      const methodObj = { [method]() {
        arguments[0] = new (method === "addIceCandidate" ? window2.RTCIceCandidate : window2.RTCSessionDescription)(arguments[0]);
        return nativeMethod.apply(this, arguments);
      } };
      window2.RTCPeerConnection.prototype[method] = methodObj[method];
    });
  }
  const modernStatsTypes = {
    inboundrtp: "inbound-rtp",
    outboundrtp: "outbound-rtp",
    candidatepair: "candidate-pair",
    localcandidate: "local-candidate",
    remotecandidate: "remote-candidate"
  };
  const nativeGetStats = window2.RTCPeerConnection.prototype.getStats;
  window2.RTCPeerConnection.prototype.getStats = function getStats() {
    const [selector, onSucc, onErr] = arguments;
    return nativeGetStats.apply(this, [selector || null]).then((stats) => {
      if (browserDetails.version < 53 && !onSucc) {
        try {
          stats.forEach((stat) => {
            stat.type = modernStatsTypes[stat.type] || stat.type;
          });
        } catch (e) {
          if (e.name !== "TypeError") {
            throw e;
          }
          stats.forEach((stat, i) => {
            stats.set(i, Object.assign({}, stat, {
              type: modernStatsTypes[stat.type] || stat.type
            }));
          });
        }
      }
      return stats;
    }).then(onSucc, onErr);
  };
}
function shimSenderGetStats(window2) {
  if (!(typeof window2 === "object" && window2.RTCPeerConnection && window2.RTCRtpSender)) {
    return;
  }
  if (window2.RTCRtpSender && "getStats" in window2.RTCRtpSender.prototype) {
    return;
  }
  const origGetSenders = window2.RTCPeerConnection.prototype.getSenders;
  if (origGetSenders) {
    window2.RTCPeerConnection.prototype.getSenders = function getSenders() {
      const senders = origGetSenders.apply(this, []);
      senders.forEach((sender) => sender._pc = this);
      return senders;
    };
  }
  const origAddTrack = window2.RTCPeerConnection.prototype.addTrack;
  if (origAddTrack) {
    window2.RTCPeerConnection.prototype.addTrack = function addTrack() {
      const sender = origAddTrack.apply(this, arguments);
      sender._pc = this;
      return sender;
    };
  }
  window2.RTCRtpSender.prototype.getStats = function getStats() {
    return this.track ? this._pc.getStats(this.track) : Promise.resolve(/* @__PURE__ */ new Map());
  };
}
function shimReceiverGetStats(window2) {
  if (!(typeof window2 === "object" && window2.RTCPeerConnection && window2.RTCRtpSender)) {
    return;
  }
  if (window2.RTCRtpSender && "getStats" in window2.RTCRtpReceiver.prototype) {
    return;
  }
  const origGetReceivers = window2.RTCPeerConnection.prototype.getReceivers;
  if (origGetReceivers) {
    window2.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
      const receivers = origGetReceivers.apply(this, []);
      receivers.forEach((receiver) => receiver._pc = this);
      return receivers;
    };
  }
  wrapPeerConnectionEvent(window2, "track", (e) => {
    e.receiver._pc = e.srcElement;
    return e;
  });
  window2.RTCRtpReceiver.prototype.getStats = function getStats() {
    return this._pc.getStats(this.track);
  };
}
function shimRemoveStream(window2) {
  if (!window2.RTCPeerConnection || "removeStream" in window2.RTCPeerConnection.prototype) {
    return;
  }
  window2.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
    deprecated("removeStream", "removeTrack");
    this.getSenders().forEach((sender) => {
      if (sender.track && stream.getTracks().includes(sender.track)) {
        this.removeTrack(sender);
      }
    });
  };
}
function shimRTCDataChannel(window2) {
  if (window2.DataChannel && !window2.RTCDataChannel) {
    window2.RTCDataChannel = window2.DataChannel;
  }
}
function shimAddTransceiver(window2) {
  if (!(typeof window2 === "object" && window2.RTCPeerConnection)) {
    return;
  }
  const origAddTransceiver = window2.RTCPeerConnection.prototype.addTransceiver;
  if (origAddTransceiver) {
    window2.RTCPeerConnection.prototype.addTransceiver = function addTransceiver() {
      this.setParametersPromises = [];
      let sendEncodings = arguments[1] && arguments[1].sendEncodings;
      if (sendEncodings === void 0) {
        sendEncodings = [];
      }
      sendEncodings = [...sendEncodings];
      const shouldPerformCheck = sendEncodings.length > 0;
      if (shouldPerformCheck) {
        sendEncodings.forEach((encodingParam) => {
          if ("rid" in encodingParam) {
            const ridRegex = /^[a-z0-9]{0,16}$/i;
            if (!ridRegex.test(encodingParam.rid)) {
              throw new TypeError("Invalid RID value provided.");
            }
          }
          if ("scaleResolutionDownBy" in encodingParam) {
            if (!(parseFloat(encodingParam.scaleResolutionDownBy) >= 1)) {
              throw new RangeError("scale_resolution_down_by must be >= 1.0");
            }
          }
          if ("maxFramerate" in encodingParam) {
            if (!(parseFloat(encodingParam.maxFramerate) >= 0)) {
              throw new RangeError("max_framerate must be >= 0.0");
            }
          }
        });
      }
      const transceiver = origAddTransceiver.apply(this, arguments);
      if (shouldPerformCheck) {
        const { sender } = transceiver;
        const params = sender.getParameters();
        if (!("encodings" in params) || // Avoid being fooled by patched getParameters() below.
        params.encodings.length === 1 && Object.keys(params.encodings[0]).length === 0) {
          params.encodings = sendEncodings;
          sender.sendEncodings = sendEncodings;
          this.setParametersPromises.push(
            sender.setParameters(params).then(() => {
              delete sender.sendEncodings;
            }).catch(() => {
              delete sender.sendEncodings;
            })
          );
        }
      }
      return transceiver;
    };
  }
}
function shimGetParameters(window2) {
  if (!(typeof window2 === "object" && window2.RTCRtpSender)) {
    return;
  }
  const origGetParameters = window2.RTCRtpSender.prototype.getParameters;
  if (origGetParameters) {
    window2.RTCRtpSender.prototype.getParameters = function getParameters() {
      const params = origGetParameters.apply(this, arguments);
      if (!("encodings" in params)) {
        params.encodings = [].concat(this.sendEncodings || [{}]);
      }
      return params;
    };
  }
}
function shimCreateOffer(window2) {
  if (!(typeof window2 === "object" && window2.RTCPeerConnection)) {
    return;
  }
  const origCreateOffer = window2.RTCPeerConnection.prototype.createOffer;
  window2.RTCPeerConnection.prototype.createOffer = function createOffer() {
    if (this.setParametersPromises && this.setParametersPromises.length) {
      return Promise.all(this.setParametersPromises).then(() => {
        return origCreateOffer.apply(this, arguments);
      }).finally(() => {
        this.setParametersPromises = [];
      });
    }
    return origCreateOffer.apply(this, arguments);
  };
}
function shimCreateAnswer(window2) {
  if (!(typeof window2 === "object" && window2.RTCPeerConnection)) {
    return;
  }
  const origCreateAnswer = window2.RTCPeerConnection.prototype.createAnswer;
  window2.RTCPeerConnection.prototype.createAnswer = function createAnswer() {
    if (this.setParametersPromises && this.setParametersPromises.length) {
      return Promise.all(this.setParametersPromises).then(() => {
        return origCreateAnswer.apply(this, arguments);
      }).finally(() => {
        this.setParametersPromises = [];
      });
    }
    return origCreateAnswer.apply(this, arguments);
  };
}

// node_modules/webrtc-adapter/src/js/safari/safari_shim.js
var safari_shim_exports = {};
__export(safari_shim_exports, {
  shimAudioContext: () => shimAudioContext,
  shimCallbacksAPI: () => shimCallbacksAPI,
  shimConstraints: () => shimConstraints,
  shimCreateOfferLegacy: () => shimCreateOfferLegacy,
  shimGetUserMedia: () => shimGetUserMedia3,
  shimLocalStreamsAPI: () => shimLocalStreamsAPI,
  shimRTCIceServerUrls: () => shimRTCIceServerUrls,
  shimRemoteStreamsAPI: () => shimRemoteStreamsAPI,
  shimTrackEventTransceiver: () => shimTrackEventTransceiver
});
function shimLocalStreamsAPI(window2) {
  if (typeof window2 !== "object" || !window2.RTCPeerConnection) {
    return;
  }
  if (!("getLocalStreams" in window2.RTCPeerConnection.prototype)) {
    window2.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
      if (!this._localStreams) {
        this._localStreams = [];
      }
      return this._localStreams;
    };
  }
  if (!("addStream" in window2.RTCPeerConnection.prototype)) {
    const _addTrack = window2.RTCPeerConnection.prototype.addTrack;
    window2.RTCPeerConnection.prototype.addStream = function addStream(stream) {
      if (!this._localStreams) {
        this._localStreams = [];
      }
      if (!this._localStreams.includes(stream)) {
        this._localStreams.push(stream);
      }
      stream.getAudioTracks().forEach((track) => _addTrack.call(
        this,
        track,
        stream
      ));
      stream.getVideoTracks().forEach((track) => _addTrack.call(
        this,
        track,
        stream
      ));
    };
    window2.RTCPeerConnection.prototype.addTrack = function addTrack(track, ...streams) {
      if (streams) {
        streams.forEach((stream) => {
          if (!this._localStreams) {
            this._localStreams = [stream];
          } else if (!this._localStreams.includes(stream)) {
            this._localStreams.push(stream);
          }
        });
      }
      return _addTrack.apply(this, arguments);
    };
  }
  if (!("removeStream" in window2.RTCPeerConnection.prototype)) {
    window2.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
      if (!this._localStreams) {
        this._localStreams = [];
      }
      const index = this._localStreams.indexOf(stream);
      if (index === -1) {
        return;
      }
      this._localStreams.splice(index, 1);
      const tracks = stream.getTracks();
      this.getSenders().forEach((sender) => {
        if (tracks.includes(sender.track)) {
          this.removeTrack(sender);
        }
      });
    };
  }
}
function shimRemoteStreamsAPI(window2) {
  if (typeof window2 !== "object" || !window2.RTCPeerConnection) {
    return;
  }
  if (!("getRemoteStreams" in window2.RTCPeerConnection.prototype)) {
    window2.RTCPeerConnection.prototype.getRemoteStreams = function getRemoteStreams() {
      return this._remoteStreams ? this._remoteStreams : [];
    };
  }
  if (!("onaddstream" in window2.RTCPeerConnection.prototype)) {
    Object.defineProperty(window2.RTCPeerConnection.prototype, "onaddstream", {
      get() {
        return this._onaddstream;
      },
      set(f) {
        if (this._onaddstream) {
          this.removeEventListener("addstream", this._onaddstream);
          this.removeEventListener("track", this._onaddstreampoly);
        }
        this.addEventListener("addstream", this._onaddstream = f);
        this.addEventListener("track", this._onaddstreampoly = (e) => {
          e.streams.forEach((stream) => {
            if (!this._remoteStreams) {
              this._remoteStreams = [];
            }
            if (this._remoteStreams.includes(stream)) {
              return;
            }
            this._remoteStreams.push(stream);
            const event = new Event("addstream");
            event.stream = stream;
            this.dispatchEvent(event);
          });
        });
      }
    });
    const origSetRemoteDescription = window2.RTCPeerConnection.prototype.setRemoteDescription;
    window2.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
      const pc = this;
      if (!this._onaddstreampoly) {
        this.addEventListener("track", this._onaddstreampoly = function(e) {
          e.streams.forEach((stream) => {
            if (!pc._remoteStreams) {
              pc._remoteStreams = [];
            }
            if (pc._remoteStreams.indexOf(stream) >= 0) {
              return;
            }
            pc._remoteStreams.push(stream);
            const event = new Event("addstream");
            event.stream = stream;
            pc.dispatchEvent(event);
          });
        });
      }
      return origSetRemoteDescription.apply(pc, arguments);
    };
  }
}
function shimCallbacksAPI(window2) {
  if (typeof window2 !== "object" || !window2.RTCPeerConnection) {
    return;
  }
  const prototype = window2.RTCPeerConnection.prototype;
  const origCreateOffer = prototype.createOffer;
  const origCreateAnswer = prototype.createAnswer;
  const setLocalDescription = prototype.setLocalDescription;
  const setRemoteDescription = prototype.setRemoteDescription;
  const addIceCandidate = prototype.addIceCandidate;
  prototype.createOffer = function createOffer(successCallback, failureCallback) {
    const options = arguments.length >= 2 ? arguments[2] : arguments[0];
    const promise = origCreateOffer.apply(this, [options]);
    if (!failureCallback) {
      return promise;
    }
    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };
  prototype.createAnswer = function createAnswer(successCallback, failureCallback) {
    const options = arguments.length >= 2 ? arguments[2] : arguments[0];
    const promise = origCreateAnswer.apply(this, [options]);
    if (!failureCallback) {
      return promise;
    }
    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };
  let withCallback = function(description, successCallback, failureCallback) {
    const promise = setLocalDescription.apply(this, [description]);
    if (!failureCallback) {
      return promise;
    }
    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };
  prototype.setLocalDescription = withCallback;
  withCallback = function(description, successCallback, failureCallback) {
    const promise = setRemoteDescription.apply(this, [description]);
    if (!failureCallback) {
      return promise;
    }
    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };
  prototype.setRemoteDescription = withCallback;
  withCallback = function(candidate, successCallback, failureCallback) {
    const promise = addIceCandidate.apply(this, [candidate]);
    if (!failureCallback) {
      return promise;
    }
    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };
  prototype.addIceCandidate = withCallback;
}
function shimGetUserMedia3(window2) {
  const navigator2 = window2 && window2.navigator;
  if (navigator2.mediaDevices && navigator2.mediaDevices.getUserMedia) {
    const mediaDevices = navigator2.mediaDevices;
    const _getUserMedia = mediaDevices.getUserMedia.bind(mediaDevices);
    navigator2.mediaDevices.getUserMedia = (constraints) => {
      return _getUserMedia(shimConstraints(constraints));
    };
  }
  if (!navigator2.getUserMedia && navigator2.mediaDevices && navigator2.mediaDevices.getUserMedia) {
    navigator2.getUserMedia = (function getUserMedia(constraints, cb, errcb) {
      navigator2.mediaDevices.getUserMedia(constraints).then(cb, errcb);
    }).bind(navigator2);
  }
}
function shimConstraints(constraints) {
  if (constraints && constraints.video !== void 0) {
    return Object.assign(
      {},
      constraints,
      { video: compactObject(constraints.video) }
    );
  }
  return constraints;
}
function shimRTCIceServerUrls(window2) {
  if (!window2.RTCPeerConnection) {
    return;
  }
  const OrigPeerConnection = window2.RTCPeerConnection;
  window2.RTCPeerConnection = function RTCPeerConnection2(pcConfig, pcConstraints) {
    if (pcConfig && pcConfig.iceServers) {
      const newIceServers = [];
      for (let i = 0; i < pcConfig.iceServers.length; i++) {
        let server = pcConfig.iceServers[i];
        if (server.urls === void 0 && server.url) {
          deprecated("RTCIceServer.url", "RTCIceServer.urls");
          server = JSON.parse(JSON.stringify(server));
          server.urls = server.url;
          delete server.url;
          newIceServers.push(server);
        } else {
          newIceServers.push(pcConfig.iceServers[i]);
        }
      }
      pcConfig.iceServers = newIceServers;
    }
    return new OrigPeerConnection(pcConfig, pcConstraints);
  };
  window2.RTCPeerConnection.prototype = OrigPeerConnection.prototype;
  if ("generateCertificate" in OrigPeerConnection) {
    Object.defineProperty(window2.RTCPeerConnection, "generateCertificate", {
      get() {
        return OrigPeerConnection.generateCertificate;
      }
    });
  }
}
function shimTrackEventTransceiver(window2) {
  if (typeof window2 === "object" && window2.RTCTrackEvent && "receiver" in window2.RTCTrackEvent.prototype && !("transceiver" in window2.RTCTrackEvent.prototype)) {
    Object.defineProperty(window2.RTCTrackEvent.prototype, "transceiver", {
      get() {
        return { receiver: this.receiver };
      }
    });
  }
}
function shimCreateOfferLegacy(window2) {
  const origCreateOffer = window2.RTCPeerConnection.prototype.createOffer;
  window2.RTCPeerConnection.prototype.createOffer = function createOffer(offerOptions) {
    if (offerOptions) {
      if (typeof offerOptions.offerToReceiveAudio !== "undefined") {
        offerOptions.offerToReceiveAudio = !!offerOptions.offerToReceiveAudio;
      }
      const audioTransceiver = this.getTransceivers().find((transceiver) => transceiver.receiver.track.kind === "audio");
      if (offerOptions.offerToReceiveAudio === false && audioTransceiver) {
        if (audioTransceiver.direction === "sendrecv") {
          if (audioTransceiver.setDirection) {
            audioTransceiver.setDirection("sendonly");
          } else {
            audioTransceiver.direction = "sendonly";
          }
        } else if (audioTransceiver.direction === "recvonly") {
          if (audioTransceiver.setDirection) {
            audioTransceiver.setDirection("inactive");
          } else {
            audioTransceiver.direction = "inactive";
          }
        }
      } else if (offerOptions.offerToReceiveAudio === true && !audioTransceiver) {
        this.addTransceiver("audio", { direction: "recvonly" });
      }
      if (typeof offerOptions.offerToReceiveVideo !== "undefined") {
        offerOptions.offerToReceiveVideo = !!offerOptions.offerToReceiveVideo;
      }
      const videoTransceiver = this.getTransceivers().find((transceiver) => transceiver.receiver.track.kind === "video");
      if (offerOptions.offerToReceiveVideo === false && videoTransceiver) {
        if (videoTransceiver.direction === "sendrecv") {
          if (videoTransceiver.setDirection) {
            videoTransceiver.setDirection("sendonly");
          } else {
            videoTransceiver.direction = "sendonly";
          }
        } else if (videoTransceiver.direction === "recvonly") {
          if (videoTransceiver.setDirection) {
            videoTransceiver.setDirection("inactive");
          } else {
            videoTransceiver.direction = "inactive";
          }
        }
      } else if (offerOptions.offerToReceiveVideo === true && !videoTransceiver) {
        this.addTransceiver("video", { direction: "recvonly" });
      }
    }
    return origCreateOffer.apply(this, arguments);
  };
}
function shimAudioContext(window2) {
  if (typeof window2 !== "object" || window2.AudioContext) {
    return;
  }
  window2.AudioContext = window2.webkitAudioContext;
}

// node_modules/webrtc-adapter/src/js/common_shim.js
var common_shim_exports = {};
__export(common_shim_exports, {
  removeExtmapAllowMixed: () => removeExtmapAllowMixed,
  shimAddIceCandidateNullOrEmpty: () => shimAddIceCandidateNullOrEmpty,
  shimConnectionState: () => shimConnectionState,
  shimMaxMessageSize: () => shimMaxMessageSize,
  shimParameterlessSetLocalDescription: () => shimParameterlessSetLocalDescription,
  shimRTCIceCandidate: () => shimRTCIceCandidate,
  shimRTCIceCandidateRelayProtocol: () => shimRTCIceCandidateRelayProtocol,
  shimSendThrowTypeError: () => shimSendThrowTypeError
});
var import_sdp = __toESM(require_sdp());
function shimRTCIceCandidate(window2) {
  if (!window2.RTCIceCandidate || window2.RTCIceCandidate && "foundation" in window2.RTCIceCandidate.prototype) {
    return;
  }
  const NativeRTCIceCandidate = window2.RTCIceCandidate;
  window2.RTCIceCandidate = function RTCIceCandidate2(args) {
    if (typeof args === "object" && args.candidate && args.candidate.indexOf("a=") === 0) {
      args = JSON.parse(JSON.stringify(args));
      args.candidate = args.candidate.substring(2);
    }
    if (args.candidate && args.candidate.length) {
      const nativeCandidate = new NativeRTCIceCandidate(args);
      const parsedCandidate = import_sdp.default.parseCandidate(args.candidate);
      for (const key in parsedCandidate) {
        if (!(key in nativeCandidate)) {
          Object.defineProperty(
            nativeCandidate,
            key,
            { value: parsedCandidate[key] }
          );
        }
      }
      nativeCandidate.toJSON = function toJSON() {
        return {
          candidate: nativeCandidate.candidate,
          sdpMid: nativeCandidate.sdpMid,
          sdpMLineIndex: nativeCandidate.sdpMLineIndex,
          usernameFragment: nativeCandidate.usernameFragment
        };
      };
      return nativeCandidate;
    }
    return new NativeRTCIceCandidate(args);
  };
  window2.RTCIceCandidate.prototype = NativeRTCIceCandidate.prototype;
  wrapPeerConnectionEvent(window2, "icecandidate", (e) => {
    if (e.candidate) {
      Object.defineProperty(e, "candidate", {
        value: new window2.RTCIceCandidate(e.candidate),
        writable: "false"
      });
    }
    return e;
  });
}
function shimRTCIceCandidateRelayProtocol(window2) {
  if (!window2.RTCIceCandidate || window2.RTCIceCandidate && "relayProtocol" in window2.RTCIceCandidate.prototype) {
    return;
  }
  wrapPeerConnectionEvent(window2, "icecandidate", (e) => {
    if (e.candidate) {
      const parsedCandidate = import_sdp.default.parseCandidate(e.candidate.candidate);
      if (parsedCandidate.type === "relay") {
        e.candidate.relayProtocol = {
          0: "tls",
          1: "tcp",
          2: "udp"
        }[parsedCandidate.priority >> 24];
      }
    }
    return e;
  });
}
function shimMaxMessageSize(window2, browserDetails) {
  if (!window2.RTCPeerConnection) {
    return;
  }
  if (!("sctp" in window2.RTCPeerConnection.prototype)) {
    Object.defineProperty(window2.RTCPeerConnection.prototype, "sctp", {
      get() {
        return typeof this._sctp === "undefined" ? null : this._sctp;
      }
    });
  }
  const sctpInDescription = function(description) {
    if (!description || !description.sdp) {
      return false;
    }
    const sections = import_sdp.default.splitSections(description.sdp);
    sections.shift();
    return sections.some((mediaSection) => {
      const mLine = import_sdp.default.parseMLine(mediaSection);
      return mLine && mLine.kind === "application" && mLine.protocol.indexOf("SCTP") !== -1;
    });
  };
  const getRemoteFirefoxVersion = function(description) {
    const match = description.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
    if (match === null || match.length < 2) {
      return -1;
    }
    const version = parseInt(match[1], 10);
    return version !== version ? -1 : version;
  };
  const getCanSendMaxMessageSize = function(remoteIsFirefox) {
    let canSendMaxMessageSize = 65536;
    if (browserDetails.browser === "firefox") {
      if (browserDetails.version < 57) {
        if (remoteIsFirefox === -1) {
          canSendMaxMessageSize = 16384;
        } else {
          canSendMaxMessageSize = 2147483637;
        }
      } else if (browserDetails.version < 60) {
        canSendMaxMessageSize = browserDetails.version === 57 ? 65535 : 65536;
      } else {
        canSendMaxMessageSize = 2147483637;
      }
    }
    return canSendMaxMessageSize;
  };
  const getMaxMessageSize = function(description, remoteIsFirefox) {
    let maxMessageSize = 65536;
    if (browserDetails.browser === "firefox" && browserDetails.version === 57) {
      maxMessageSize = 65535;
    }
    const match = import_sdp.default.matchPrefix(
      description.sdp,
      "a=max-message-size:"
    );
    if (match.length > 0) {
      maxMessageSize = parseInt(match[0].substring(19), 10);
    } else if (browserDetails.browser === "firefox" && remoteIsFirefox !== -1) {
      maxMessageSize = 2147483637;
    }
    return maxMessageSize;
  };
  const origSetRemoteDescription = window2.RTCPeerConnection.prototype.setRemoteDescription;
  window2.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
    this._sctp = null;
    if (browserDetails.browser === "chrome" && browserDetails.version >= 76) {
      const { sdpSemantics } = this.getConfiguration();
      if (sdpSemantics === "plan-b") {
        Object.defineProperty(this, "sctp", {
          get() {
            return typeof this._sctp === "undefined" ? null : this._sctp;
          },
          enumerable: true,
          configurable: true
        });
      }
    }
    if (sctpInDescription(arguments[0])) {
      const isFirefox = getRemoteFirefoxVersion(arguments[0]);
      const canSendMMS = getCanSendMaxMessageSize(isFirefox);
      const remoteMMS = getMaxMessageSize(arguments[0], isFirefox);
      let maxMessageSize;
      if (canSendMMS === 0 && remoteMMS === 0) {
        maxMessageSize = Number.POSITIVE_INFINITY;
      } else if (canSendMMS === 0 || remoteMMS === 0) {
        maxMessageSize = Math.max(canSendMMS, remoteMMS);
      } else {
        maxMessageSize = Math.min(canSendMMS, remoteMMS);
      }
      const sctp = {};
      Object.defineProperty(sctp, "maxMessageSize", {
        get() {
          return maxMessageSize;
        }
      });
      this._sctp = sctp;
    }
    return origSetRemoteDescription.apply(this, arguments);
  };
}
function shimSendThrowTypeError(window2) {
  if (!(window2.RTCPeerConnection && "createDataChannel" in window2.RTCPeerConnection.prototype)) {
    return;
  }
  function wrapDcSend(dc, pc) {
    const origDataChannelSend = dc.send;
    dc.send = function send() {
      const data = arguments[0];
      const length = data.length || data.size || data.byteLength;
      if (dc.readyState === "open" && pc.sctp && length > pc.sctp.maxMessageSize) {
        throw new TypeError("Message too large (can send a maximum of " + pc.sctp.maxMessageSize + " bytes)");
      }
      return origDataChannelSend.apply(dc, arguments);
    };
  }
  const origCreateDataChannel = window2.RTCPeerConnection.prototype.createDataChannel;
  window2.RTCPeerConnection.prototype.createDataChannel = function createDataChannel() {
    const dataChannel = origCreateDataChannel.apply(this, arguments);
    wrapDcSend(dataChannel, this);
    return dataChannel;
  };
  wrapPeerConnectionEvent(window2, "datachannel", (e) => {
    wrapDcSend(e.channel, e.target);
    return e;
  });
}
function shimConnectionState(window2) {
  if (!window2.RTCPeerConnection || "connectionState" in window2.RTCPeerConnection.prototype) {
    return;
  }
  const proto = window2.RTCPeerConnection.prototype;
  Object.defineProperty(proto, "connectionState", {
    get() {
      return {
        completed: "connected",
        checking: "connecting"
      }[this.iceConnectionState] || this.iceConnectionState;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(proto, "onconnectionstatechange", {
    get() {
      return this._onconnectionstatechange || null;
    },
    set(cb) {
      if (this._onconnectionstatechange) {
        this.removeEventListener(
          "connectionstatechange",
          this._onconnectionstatechange
        );
        delete this._onconnectionstatechange;
      }
      if (cb) {
        this.addEventListener(
          "connectionstatechange",
          this._onconnectionstatechange = cb
        );
      }
    },
    enumerable: true,
    configurable: true
  });
  ["setLocalDescription", "setRemoteDescription"].forEach((method) => {
    const origMethod = proto[method];
    proto[method] = function() {
      if (!this._connectionstatechangepoly) {
        this._connectionstatechangepoly = (e) => {
          const pc = e.target;
          if (pc._lastConnectionState !== pc.connectionState) {
            pc._lastConnectionState = pc.connectionState;
            const newEvent = new Event("connectionstatechange", e);
            pc.dispatchEvent(newEvent);
          }
          return e;
        };
        this.addEventListener(
          "iceconnectionstatechange",
          this._connectionstatechangepoly
        );
      }
      return origMethod.apply(this, arguments);
    };
  });
}
function removeExtmapAllowMixed(window2, browserDetails) {
  if (!window2.RTCPeerConnection) {
    return;
  }
  if (browserDetails.browser === "chrome" && browserDetails.version >= 71) {
    return;
  }
  if (browserDetails.browser === "safari" && browserDetails._safariVersion >= 13.1) {
    return;
  }
  const nativeSRD = window2.RTCPeerConnection.prototype.setRemoteDescription;
  window2.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription(desc) {
    if (desc && desc.sdp && desc.sdp.indexOf("\na=extmap-allow-mixed") !== -1) {
      const sdp2 = desc.sdp.split("\n").filter((line) => {
        return line.trim() !== "a=extmap-allow-mixed";
      }).join("\n");
      if (window2.RTCSessionDescription && desc instanceof window2.RTCSessionDescription) {
        arguments[0] = new window2.RTCSessionDescription({
          type: desc.type,
          sdp: sdp2
        });
      } else {
        desc.sdp = sdp2;
      }
    }
    return nativeSRD.apply(this, arguments);
  };
}
function shimAddIceCandidateNullOrEmpty(window2, browserDetails) {
  if (!(window2.RTCPeerConnection && window2.RTCPeerConnection.prototype)) {
    return;
  }
  const nativeAddIceCandidate = window2.RTCPeerConnection.prototype.addIceCandidate;
  if (!nativeAddIceCandidate || nativeAddIceCandidate.length === 0) {
    return;
  }
  window2.RTCPeerConnection.prototype.addIceCandidate = function addIceCandidate() {
    if (!arguments[0]) {
      if (arguments[1]) {
        arguments[1].apply(null);
      }
      return Promise.resolve();
    }
    if ((browserDetails.browser === "chrome" && browserDetails.version < 78 || browserDetails.browser === "firefox" && browserDetails.version < 68 || browserDetails.browser === "safari") && arguments[0] && arguments[0].candidate === "") {
      return Promise.resolve();
    }
    return nativeAddIceCandidate.apply(this, arguments);
  };
}
function shimParameterlessSetLocalDescription(window2, browserDetails) {
  if (!(window2.RTCPeerConnection && window2.RTCPeerConnection.prototype)) {
    return;
  }
  const nativeSetLocalDescription = window2.RTCPeerConnection.prototype.setLocalDescription;
  if (!nativeSetLocalDescription || nativeSetLocalDescription.length === 0) {
    return;
  }
  window2.RTCPeerConnection.prototype.setLocalDescription = function setLocalDescription() {
    let desc = arguments[0] || {};
    if (typeof desc !== "object" || desc.type && desc.sdp) {
      return nativeSetLocalDescription.apply(this, arguments);
    }
    desc = { type: desc.type, sdp: desc.sdp };
    if (!desc.type) {
      switch (this.signalingState) {
        case "stable":
        case "have-local-offer":
        case "have-remote-pranswer":
          desc.type = "offer";
          break;
        default:
          desc.type = "answer";
          break;
      }
    }
    if (desc.sdp || desc.type !== "offer" && desc.type !== "answer") {
      return nativeSetLocalDescription.apply(this, [desc]);
    }
    const func = desc.type === "offer" ? this.createOffer : this.createAnswer;
    return func.apply(this).then((d) => nativeSetLocalDescription.apply(this, [d]));
  };
}

// node_modules/webrtc-adapter/src/js/adapter_factory.js
var sdp = __toESM(require_sdp());
function adapterFactory({ window: window2 } = {}, options = {
  shimChrome: true,
  shimFirefox: true,
  shimSafari: true
}) {
  const logging2 = log;
  const browserDetails = detectBrowser(window2);
  const adapter2 = {
    browserDetails,
    commonShim: common_shim_exports,
    extractVersion,
    disableLog,
    disableWarnings,
    // Expose sdp as a convenience. For production apps include directly.
    sdp
  };
  switch (browserDetails.browser) {
    case "chrome":
      if (!chrome_shim_exports || !shimPeerConnection || !options.shimChrome) {
        logging2("Chrome shim is not included in this adapter release.");
        return adapter2;
      }
      if (browserDetails.version === null) {
        logging2("Chrome shim can not determine version, not shimming.");
        return adapter2;
      }
      logging2("adapter.js shimming chrome.");
      adapter2.browserShim = chrome_shim_exports;
      shimAddIceCandidateNullOrEmpty(window2, browserDetails);
      shimParameterlessSetLocalDescription(window2, browserDetails);
      shimGetUserMedia(window2, browserDetails);
      shimMediaStream(window2, browserDetails);
      shimPeerConnection(window2, browserDetails);
      shimOnTrack(window2, browserDetails);
      shimAddTrackRemoveTrack(window2, browserDetails);
      shimGetSendersWithDtmf(window2, browserDetails);
      shimSenderReceiverGetStats(window2, browserDetails);
      fixNegotiationNeeded(window2, browserDetails);
      shimRTCIceCandidate(window2, browserDetails);
      shimRTCIceCandidateRelayProtocol(window2, browserDetails);
      shimConnectionState(window2, browserDetails);
      shimMaxMessageSize(window2, browserDetails);
      shimSendThrowTypeError(window2, browserDetails);
      removeExtmapAllowMixed(window2, browserDetails);
      break;
    case "firefox":
      if (!firefox_shim_exports || !shimPeerConnection2 || !options.shimFirefox) {
        logging2("Firefox shim is not included in this adapter release.");
        return adapter2;
      }
      logging2("adapter.js shimming firefox.");
      adapter2.browserShim = firefox_shim_exports;
      shimAddIceCandidateNullOrEmpty(window2, browserDetails);
      shimParameterlessSetLocalDescription(window2, browserDetails);
      shimGetUserMedia2(window2, browserDetails);
      shimPeerConnection2(window2, browserDetails);
      shimOnTrack2(window2, browserDetails);
      shimRemoveStream(window2, browserDetails);
      shimSenderGetStats(window2, browserDetails);
      shimReceiverGetStats(window2, browserDetails);
      shimRTCDataChannel(window2, browserDetails);
      shimAddTransceiver(window2, browserDetails);
      shimGetParameters(window2, browserDetails);
      shimCreateOffer(window2, browserDetails);
      shimCreateAnswer(window2, browserDetails);
      shimRTCIceCandidate(window2, browserDetails);
      shimConnectionState(window2, browserDetails);
      shimMaxMessageSize(window2, browserDetails);
      shimSendThrowTypeError(window2, browserDetails);
      break;
    case "safari":
      if (!safari_shim_exports || !options.shimSafari) {
        logging2("Safari shim is not included in this adapter release.");
        return adapter2;
      }
      logging2("adapter.js shimming safari.");
      adapter2.browserShim = safari_shim_exports;
      shimAddIceCandidateNullOrEmpty(window2, browserDetails);
      shimParameterlessSetLocalDescription(window2, browserDetails);
      shimRTCIceServerUrls(window2, browserDetails);
      shimCreateOfferLegacy(window2, browserDetails);
      shimCallbacksAPI(window2, browserDetails);
      shimLocalStreamsAPI(window2, browserDetails);
      shimRemoteStreamsAPI(window2, browserDetails);
      shimTrackEventTransceiver(window2, browserDetails);
      shimGetUserMedia3(window2, browserDetails);
      shimAudioContext(window2, browserDetails);
      shimRTCIceCandidate(window2, browserDetails);
      shimRTCIceCandidateRelayProtocol(window2, browserDetails);
      shimMaxMessageSize(window2, browserDetails);
      shimSendThrowTypeError(window2, browserDetails);
      removeExtmapAllowMixed(window2, browserDetails);
      break;
    default:
      logging2("Unsupported browser!");
      break;
  }
  return adapter2;
}

// node_modules/webrtc-adapter/src/js/adapter_core.js
var adapter = adapterFactory({ window: typeof window === "undefined" ? void 0 : window });

// src/app/core/services/webrtc.service.ts
var CallState;
(function(CallState2) {
  CallState2["IDLE"] = "IDLE";
  CallState2["CONNECTING"] = "CONNECTING";
  CallState2["RINGING"] = "RINGING";
  CallState2["ACTIVE"] = "ACTIVE";
  CallState2["HELD"] = "HELD";
  CallState2["ENDED"] = "ENDED";
})(CallState || (CallState = {}));
var _WebrtcService = class _WebrtcService {
  constructor() {
    this.websocketService = inject(WebsocketService);
    this.peerConnection = null;
    this.localStream = null;
    this.remoteStream = null;
    this.currentCallState = CallState.IDLE;
    this.isMuted = false;
    this.pendingOffer = null;
    this.remoteUserId = null;
    this.targetPhoneNumber = null;
    this.onRemoteStream = new EventEmitter();
    this.onCallStatus = new EventEmitter();
    this.onError = new EventEmitter();
    this.iceServers = {
      iceServers: [
        // Google STUN servers
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        // Twilio STUN
        { urls: "stun:global.stun.twilio.com:3478" },
        // Metered TURN servers (multiple for redundancy)
        {
          urls: "turn:a.relay.metered.ca:80",
          username: "e46b526d9452c5e61c66ce86",
          credential: "BGkz0EQbfYvXvZGu"
        },
        {
          urls: "turn:a.relay.metered.ca:443",
          username: "e46b526d9452c5e61c66ce86",
          credential: "BGkz0EQbfYvXvZGu"
        },
        {
          urls: "turn:a.relay.metered.ca:443?transport=tcp",
          username: "e46b526d9452c5e61c66ce86",
          credential: "BGkz0EQbfYvXvZGu"
        }
      ],
      iceCandidatePoolSize: 10,
      iceTransportPolicy: "all",
      bundlePolicy: "max-bundle",
      rtcpMuxPolicy: "require"
    };
  }
  initialize() {
    return __async(this, null, function* () {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("WebRTC is not supported in this browser or context. Try using HTTPS or a modern browser.");
        }
        this.localStream = yield navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          },
          video: false
        });
        console.log("Microphone access granted");
      } catch (error) {
        console.error("Error accessing microphone:", error);
        const errorMsg = error.message || "Could not access microphone. Please grant permission.";
        this.onError.emit(errorMsg);
        throw error;
      }
    });
  }
  makeCall(phoneNumber) {
    return __async(this, null, function* () {
      if (!this.localStream) {
        yield this.initialize();
      }
      this.targetPhoneNumber = phoneNumber;
      this.currentCallState = CallState.CONNECTING;
      this.onCallStatus.emit(this.currentCallState);
      try {
        this.peerConnection = new RTCPeerConnection(this.iceServers);
        console.log("Adding local tracks to peer connection");
        this.localStream?.getTracks().forEach((track) => {
          console.log("Adding track:", track.kind, "enabled:", track.enabled);
          this.peerConnection?.addTrack(track, this.localStream);
        });
        this.peerConnection.ontrack = (event) => {
          console.log("Received remote track:", event.track.kind);
          console.log("Track enabled:", event.track.enabled);
          console.log("Track readyState:", event.track.readyState);
          if (event.streams && event.streams[0]) {
            this.remoteStream = event.streams[0];
            console.log("Remote stream tracks:", this.remoteStream.getTracks().map((t) => t.kind));
            this.onRemoteStream.emit(this.remoteStream);
          } else {
            console.warn("No streams in track event");
          }
        };
        this.peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            console.log("\u{1F9CA} ICE Candidate:", {
              type: event.candidate.type,
              protocol: event.candidate.protocol,
              address: event.candidate.address,
              port: event.candidate.port,
              relatedAddress: event.candidate.relatedAddress
            });
            this.sendSignalingMessage({
              type: "ice-candidate",
              candidate: event.candidate,
              to: phoneNumber
            });
          } else {
            console.log("\u2705 All ICE candidates have been sent");
          }
        };
        this.peerConnection.oniceconnectionstatechange = () => {
          console.log("\u{1F50C} ICE connection state:", this.peerConnection?.iceConnectionState);
          if (this.peerConnection?.iceConnectionState === "failed") {
            console.error("\u274C ICE connection failed - restarting ICE");
            this.peerConnection?.restartIce();
          }
          if (this.peerConnection?.iceConnectionState === "connected") {
            console.log("\u2705 ICE connected successfully!");
          }
        };
        this.peerConnection.onicegatheringstatechange = () => {
          console.log("ICE gathering state:", this.peerConnection?.iceGatheringState);
        };
        this.peerConnection.onconnectionstatechange = () => {
          console.log("Connection state:", this.peerConnection?.connectionState);
          switch (this.peerConnection?.connectionState) {
            case "connected":
              this.currentCallState = CallState.ACTIVE;
              this.onCallStatus.emit(this.currentCallState);
              break;
            case "disconnected":
            case "failed":
            case "closed":
              this.currentCallState = CallState.ENDED;
              this.onCallStatus.emit(this.currentCallState);
              break;
          }
        };
        const offer = yield this.peerConnection.createOffer();
        yield this.peerConnection.setLocalDescription(offer);
        this.sendSignalingMessage({
          type: "offer",
          sdp: offer,
          to: phoneNumber
        });
        this.currentCallState = CallState.RINGING;
        this.onCallStatus.emit(this.currentCallState);
      } catch (error) {
        console.error("Error making call:", error);
        this.onError.emit("Failed to establish call");
        this.hangupCall();
        throw error;
      }
    });
  }
  sendSignalingMessage(message) {
    console.log("Sending signaling message:", message.type, "to:", message.to);
    this.websocketService.send("/app/webrtc.signal", message);
  }
  handleIncomingOffer(message) {
    console.log("Storing incoming offer from:", message.from);
    this.pendingOffer = message;
    this.remoteUserId = message.fromUsername || message.from;
    console.log("Set remoteUserId to:", this.remoteUserId);
    this.currentCallState = CallState.RINGING;
    this.onCallStatus.emit(this.currentCallState);
  }
  answerCall() {
    return __async(this, null, function* () {
      if (!this.pendingOffer) {
        console.error("No pending offer to answer");
        return;
      }
      if (!this.localStream) {
        yield this.initialize();
      }
      console.log("Answering call...");
      this.currentCallState = CallState.CONNECTING;
      this.onCallStatus.emit(this.currentCallState);
      try {
        this.peerConnection = new RTCPeerConnection(this.iceServers);
        console.log("Adding local tracks to peer connection");
        this.localStream?.getTracks().forEach((track) => {
          console.log("Adding track:", track.kind, "enabled:", track.enabled);
          this.peerConnection?.addTrack(track, this.localStream);
        });
        this.peerConnection.ontrack = (event) => {
          console.log("Received remote track:", event.track.kind);
          console.log("Track enabled:", event.track.enabled);
          console.log("Track readyState:", event.track.readyState);
          if (event.streams && event.streams[0]) {
            this.remoteStream = event.streams[0];
            console.log("Remote stream tracks:", this.remoteStream.getTracks().map((t) => t.kind));
            this.onRemoteStream.emit(this.remoteStream);
          } else {
            console.warn("No streams in track event");
          }
        };
        this.peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            console.log("Sending ICE candidate:", event.candidate.type);
            this.sendSignalingMessage({
              type: "ice-candidate",
              candidate: event.candidate,
              to: this.remoteUserId
            });
          } else {
            console.log("All ICE candidates have been sent");
          }
        };
        this.peerConnection.oniceconnectionstatechange = () => {
          console.log("\u{1F50C} ICE connection state:", this.peerConnection?.iceConnectionState);
          if (this.peerConnection?.iceConnectionState === "failed") {
            console.error("\u274C ICE connection failed - restarting ICE");
            this.peerConnection?.restartIce();
          }
          if (this.peerConnection?.iceConnectionState === "connected") {
            console.log("\u2705 ICE connected successfully!");
          }
        };
        this.peerConnection.onicegatheringstatechange = () => {
          console.log("ICE gathering state:", this.peerConnection?.iceGatheringState);
        };
        this.peerConnection.onconnectionstatechange = () => {
          console.log("Connection state:", this.peerConnection?.connectionState);
          switch (this.peerConnection?.connectionState) {
            case "connected":
              this.currentCallState = CallState.ACTIVE;
              this.onCallStatus.emit(this.currentCallState);
              break;
            case "disconnected":
            case "failed":
            case "closed":
              this.currentCallState = CallState.ENDED;
              this.onCallStatus.emit(this.currentCallState);
              break;
          }
        };
        yield this.peerConnection.setRemoteDescription(new RTCSessionDescription(this.pendingOffer.sdp));
        const answer = yield this.peerConnection.createAnswer();
        yield this.peerConnection.setLocalDescription(answer);
        this.sendSignalingMessage({
          type: "answer",
          sdp: answer,
          to: this.remoteUserId
        });
        this.pendingOffer = null;
        this.currentCallState = CallState.ACTIVE;
        this.onCallStatus.emit(this.currentCallState);
      } catch (error) {
        console.error("Error answering call:", error);
        this.onError.emit("Failed to answer call");
        this.hangupCall();
        throw error;
      }
    });
  }
  handleAnswer(message) {
    return __async(this, null, function* () {
      console.log("Received answer");
      if (this.peerConnection && message.sdp) {
        yield this.peerConnection.setRemoteDescription(new RTCSessionDescription(message.sdp));
        this.currentCallState = CallState.ACTIVE;
        this.onCallStatus.emit(this.currentCallState);
      }
    });
  }
  handleIceCandidate(message) {
    return __async(this, null, function* () {
      console.log("Received ICE candidate");
      if (this.peerConnection && message.candidate) {
        try {
          yield this.peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
        } catch (error) {
          console.error("Error adding ICE candidate:", error);
        }
      }
    });
  }
  hangupCall() {
    console.log("Hanging up call");
    if (this.remoteUserId) {
      this.sendSignalingMessage({
        type: "hangup",
        to: this.remoteUserId
      });
    } else if (this.targetPhoneNumber) {
      this.sendSignalingMessage({
        type: "hangup",
        to: this.targetPhoneNumber
      });
    }
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach((track) => track.stop());
      this.remoteStream = null;
    }
    this.currentCallState = CallState.ENDED;
    this.onCallStatus.emit(this.currentCallState);
    this.remoteUserId = null;
    this.targetPhoneNumber = null;
    this.pendingOffer = null;
    setTimeout(() => {
      this.currentCallState = CallState.IDLE;
      this.onCallStatus.emit(this.currentCallState);
    }, 1e3);
  }
  muteAudio() {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = false;
      });
      this.isMuted = true;
    }
  }
  unmuteAudio() {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = true;
      });
      this.isMuted = false;
    }
  }
  toggleMute() {
    if (this.isMuted) {
      this.unmuteAudio();
    } else {
      this.muteAudio();
    }
    return this.isMuted;
  }
  isMicMuted() {
    return this.isMuted;
  }
  getCallState() {
    return this.currentCallState;
  }
  cleanup() {
    this.hangupCall();
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }
  }
};
_WebrtcService.\u0275fac = function WebrtcService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _WebrtcService)();
};
_WebrtcService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _WebrtcService, factory: _WebrtcService.\u0275fac, providedIn: "root" });
var WebrtcService = _WebrtcService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(WebrtcService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

// src/app/core/models/call.model.ts
var CallStatus;
(function(CallStatus2) {
  CallStatus2["INITIATED"] = "INITIATED";
  CallStatus2["DIALING"] = "DIALING";
  CallStatus2["RINGING"] = "RINGING";
  CallStatus2["ANSWERED"] = "ANSWERED";
  CallStatus2["CONNECTED"] = "CONNECTED";
  CallStatus2["COMPLETED"] = "COMPLETED";
  CallStatus2["FAILED"] = "FAILED";
  CallStatus2["ABANDONED"] = "ABANDONED";
})(CallStatus || (CallStatus = {}));
var CallDisposition;
(function(CallDisposition2) {
  CallDisposition2["CONTACTED"] = "CONTACTED";
  CallDisposition2["NO_ANSWER"] = "NO_ANSWER";
  CallDisposition2["VOICEMAIL"] = "VOICEMAIL";
  CallDisposition2["SALE"] = "SALE";
  CallDisposition2["NOT_INTERESTED"] = "NOT_INTERESTED";
  CallDisposition2["CALLBACK_SCHEDULED"] = "CALLBACK_SCHEDULED";
  CallDisposition2["BUSY"] = "BUSY";
  CallDisposition2["INVALID_NUMBER"] = "INVALID_NUMBER";
  CallDisposition2["DO_NOT_CALL"] = "DO_NOT_CALL";
})(CallDisposition || (CallDisposition = {}));
var CallEventType;
(function(CallEventType2) {
  CallEventType2["CALL_INITIATED"] = "CALL_INITIATED";
  CallEventType2["CALL_RINGING"] = "CALL_RINGING";
  CallEventType2["CALL_ANSWERED"] = "CALL_ANSWERED";
  CallEventType2["CALL_CONNECTED"] = "CALL_CONNECTED";
  CallEventType2["CALL_ENDED"] = "CALL_ENDED";
  CallEventType2["NEW_CONTACT_ASSIGNED"] = "NEW_CONTACT_ASSIGNED";
})(CallEventType || (CallEventType = {}));

// src/app/features/dialer/softphone/softphone.component.ts
var _c0 = () => ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];
function SoftphoneComponent_div_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14)(1, "span", 15);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 16);
    \u0275\u0275text(4, "|");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.dialedNumber);
  }
}
function SoftphoneComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17);
    \u0275\u0275text(1, " Marque un n\xFAmero ");
    \u0275\u0275elementEnd();
  }
}
function SoftphoneComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18)(1, "div", 19);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.phoneNumber);
  }
}
function SoftphoneComponent_div_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.formatDuration(ctx_r0.duration), " ");
  }
}
function SoftphoneComponent_div_11_button_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 27);
    \u0275\u0275listener("click", function SoftphoneComponent_div_11_button_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.onHangup());
    });
    \u0275\u0275element(1, "lucide-angular", 28);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", !ctx_r0.canHangup);
    \u0275\u0275advance();
    \u0275\u0275property("size", 16);
  }
}
function SoftphoneComponent_div_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 21);
    \u0275\u0275template(1, SoftphoneComponent_div_11_button_1_Template, 2, 2, "button", 22);
    \u0275\u0275elementStart(2, "button", 23);
    \u0275\u0275listener("click", function SoftphoneComponent_div_11_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onMute());
    });
    \u0275\u0275element(3, "lucide-angular", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 25);
    \u0275\u0275listener("click", function SoftphoneComponent_div_11_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onHold());
    });
    \u0275\u0275element(5, "lucide-angular", 26);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.canHangup);
    \u0275\u0275advance();
    \u0275\u0275classProp("retro-btn-yellow", ctx_r0.isMuted)("retro-btn-blue", !ctx_r0.isMuted);
    \u0275\u0275property("disabled", !ctx_r0.isActive());
    \u0275\u0275advance();
    \u0275\u0275property("name", ctx_r0.isMuted ? "mic-off" : "mic")("size", 16);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx_r0.isActive());
    \u0275\u0275advance();
    \u0275\u0275property("size", 16);
  }
}
function SoftphoneComponent_button_13_span_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 32);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const key_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.getLetters(key_r5));
  }
}
function SoftphoneComponent_button_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 29);
    \u0275\u0275listener("click", function SoftphoneComponent_button_13_Template_button_click_0_listener() {
      const key_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onDTMF(key_r5));
    });
    \u0275\u0275elementStart(1, "span", 30);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, SoftphoneComponent_button_13_span_3_Template, 2, 1, "span", 31);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const key_r5 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(key_r5);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.getLetters(key_r5));
  }
}
function SoftphoneComponent_div_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 33)(1, "button", 34);
    \u0275\u0275listener("click", function SoftphoneComponent_div_14_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onBackspace());
    });
    \u0275\u0275element(2, "lucide-angular", 35);
    \u0275\u0275elementStart(3, "span", 36);
    \u0275\u0275text(4, "Borrar");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "button", 37);
    \u0275\u0275listener("click", function SoftphoneComponent_div_14_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onCall());
    });
    \u0275\u0275element(6, "lucide-angular", 38);
    \u0275\u0275elementStart(7, "span", 39);
    \u0275\u0275text(8, "Llamar");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "button", 34);
    \u0275\u0275listener("click", function SoftphoneComponent_div_14_Template_button_click_9_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onClear());
    });
    \u0275\u0275element(10, "lucide-angular", 40);
    \u0275\u0275elementStart(11, "span", 36);
    \u0275\u0275text(12, "Limpiar");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx_r0.dialedNumber);
    \u0275\u0275advance();
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", !ctx_r0.dialedNumber);
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", !ctx_r0.dialedNumber);
    \u0275\u0275advance();
    \u0275\u0275property("size", 18);
  }
}
var _SoftphoneComponent = class _SoftphoneComponent {
  constructor() {
    this.callState = CallState.IDLE;
    this.duration = 0;
    this.isMuted = false;
    this.phoneNumber = "";
    this.canHangup = false;
    this.hangupClicked = new EventEmitter();
    this.muteClicked = new EventEmitter();
    this.holdClicked = new EventEmitter();
    this.dtmfClicked = new EventEmitter();
    this.callClicked = new EventEmitter();
    this.CallState = CallState;
    this.dialedNumber = "";
  }
  getStatusText() {
    switch (this.callState) {
      case CallState.IDLE:
        return "Ready to call";
      case CallState.CONNECTING:
        return "Connecting...";
      case CallState.RINGING:
        return "Ringing...";
      case CallState.ACTIVE:
        return "In call";
      case CallState.HELD:
        return "On hold";
      case CallState.ENDED:
        return "Call ended";
      default:
        return "Unknown";
    }
  }
  getStatusColor() {
    switch (this.callState) {
      case CallState.IDLE:
        return "#999";
      case CallState.CONNECTING:
        return "#ff9800";
      case CallState.RINGING:
        return "#2196f3";
      case CallState.ACTIVE:
        return "#4caf50";
      case CallState.HELD:
        return "#ff9800";
      case CallState.ENDED:
        return "#f44336";
      default:
        return "#999";
    }
  }
  formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  onHangup() {
    this.hangupClicked.emit();
  }
  onMute() {
    this.muteClicked.emit();
  }
  onHold() {
    this.holdClicked.emit();
  }
  onDTMF(digit) {
    if (this.callState === CallState.IDLE) {
      this.dialedNumber += digit;
    } else {
      this.dtmfClicked.emit(digit);
    }
  }
  onCall() {
    if (this.dialedNumber.trim()) {
      this.callClicked.emit(this.dialedNumber);
    }
  }
  onBackspace() {
    if (this.dialedNumber.length > 0) {
      this.dialedNumber = this.dialedNumber.slice(0, -1);
    }
  }
  onClear() {
    this.dialedNumber = "";
  }
  isActive() {
    return this.callState === CallState.ACTIVE || this.callState === CallState.HELD;
  }
  getLetters(key) {
    const letters = {
      "2": "ABC",
      "3": "DEF",
      "4": "GHI",
      "5": "JKL",
      "6": "MNO",
      "7": "PQRS",
      "8": "TUV",
      "9": "WXYZ"
    };
    return letters[key] || "";
  }
};
_SoftphoneComponent.\u0275fac = function SoftphoneComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SoftphoneComponent)();
};
_SoftphoneComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SoftphoneComponent, selectors: [["app-softphone"]], inputs: { callState: "callState", duration: "duration", isMuted: "isMuted", phoneNumber: "phoneNumber", canHangup: "canHangup" }, outputs: { hangupClicked: "hangupClicked", muteClicked: "muteClicked", holdClicked: "holdClicked", dtmfClicked: "dtmfClicked", callClicked: "callClicked" }, decls: 15, vars: 11, consts: [[1, "phone-body"], [1, "phone-screen"], [1, "screen-content"], [1, "flex", "items-center", "justify-center", "gap-1", "mb-2"], [1, "text-green-600", "animate-pulse", 3, "name", "size"], [1, "screen-status"], ["class", "screen-number", 4, "ngIf"], ["class", "screen-placeholder", 4, "ngIf"], ["class", "screen-call-info", 4, "ngIf"], ["class", "screen-duration", 4, "ngIf"], ["class", "control-row", 4, "ngIf"], [1, "keypad-container"], ["class", "retro-key", 3, "click", 4, "ngFor", "ngForOf"], ["class", "action-buttons", 4, "ngIf"], [1, "screen-number"], [1, "number-display"], [1, "cursor-blink"], [1, "screen-placeholder"], [1, "screen-call-info"], [1, "screen-number-small"], [1, "screen-duration"], [1, "control-row"], ["class", "retro-btn retro-btn-red", 3, "disabled", "click", 4, "ngIf"], [1, "retro-btn", 3, "click", "disabled"], [1, "text-white", 3, "name", "size"], [1, "retro-btn", "retro-btn-gray", 3, "click", "disabled"], ["name", "pause", 1, "text-white", 3, "size"], [1, "retro-btn", "retro-btn-red", 3, "click", "disabled"], ["name", "phone-off", 1, "text-white", 3, "size"], [1, "retro-key", 3, "click"], [1, "key-digit"], ["class", "key-letters", 4, "ngIf"], [1, "key-letters"], [1, "action-buttons"], [1, "action-btn", "action-btn-secondary", 3, "click", "disabled"], ["name", "delete-back", 3, "size"], [1, "action-label"], [1, "action-btn", "action-btn-call", 3, "click", "disabled"], ["name", "phone", 1, "text-white", 3, "size"], [1, "action-label-white"], ["name", "x-circle", 3, "size"]], template: function SoftphoneComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
    \u0275\u0275element(4, "lucide-angular", 4);
    \u0275\u0275elementStart(5, "span", 5);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(7, SoftphoneComponent_div_7_Template, 5, 1, "div", 6)(8, SoftphoneComponent_div_8_Template, 2, 0, "div", 7)(9, SoftphoneComponent_div_9_Template, 3, 1, "div", 8)(10, SoftphoneComponent_div_10_Template, 2, 1, "div", 9);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(11, SoftphoneComponent_div_11_Template, 6, 10, "div", 10);
    \u0275\u0275elementStart(12, "div", 11);
    \u0275\u0275template(13, SoftphoneComponent_button_13_Template, 4, 2, "button", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275template(14, SoftphoneComponent_div_14_Template, 13, 6, "div", 13);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(4);
    \u0275\u0275property("name", ctx.callState === ctx.CallState.ACTIVE ? "phone-call" : "phone")("size", 14);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx.getStatusText());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.callState === ctx.CallState.IDLE && ctx.dialedNumber);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.callState === ctx.CallState.IDLE && !ctx.dialedNumber);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.phoneNumber && ctx.callState !== ctx.CallState.IDLE);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.isActive());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.isActive());
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", \u0275\u0275pureFunction0(10, _c0));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.callState === ctx.CallState.IDLE);
  }
}, dependencies: [CommonModule, NgForOf, NgIf, MatCardModule, MatButtonModule, LucideAngularModule, LucideAngularComponent, MatTooltipModule], styles: ['\n\n.phone-body[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #e6e9f0,\n      #eef1f5);\n  border-radius: 24px;\n  padding: 20px;\n  box-shadow:\n    12px 12px 24px rgba(174, 174, 192, 0.4),\n    -12px -12px 24px rgba(255, 255, 255, 0.8),\n    inset 2px 2px 4px rgba(255, 255, 255, 0.5);\n  max-width: 320px;\n  margin: 0 auto;\n  border: 2px solid rgba(255, 255, 255, 0.8);\n}\n.dark[_nghost-%COMP%]   .phone-body[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .phone-body[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #1e293b,\n      #0f172a);\n  box-shadow:\n    12px 12px 24px rgba(0, 0, 0, 0.5),\n    -12px -12px 24px rgba(51, 65, 85, 0.3),\n    inset 2px 2px 4px rgba(51, 65, 85, 0.5);\n  border-color: rgba(51, 65, 85, 0.5);\n}\n.phone-screen[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #9ca885,\n      #b4c29d);\n  border-radius: 12px;\n  padding: 16px;\n  margin-bottom: 16px;\n  box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.25), inset -2px -2px 6px rgba(255, 255, 255, 0.4);\n  border: 2px solid rgba(0, 0, 0, 0.15);\n  min-height: 80px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: relative;\n  overflow: hidden;\n}\n.phone-screen[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background:\n    repeating-linear-gradient(\n      0deg,\n      transparent,\n      transparent 1px,\n      rgba(0, 0, 0, 0.03) 1px,\n      rgba(0, 0, 0, 0.03) 2px),\n    repeating-linear-gradient(\n      90deg,\n      transparent,\n      transparent 1px,\n      rgba(0, 0, 0, 0.03) 1px,\n      rgba(0, 0, 0, 0.03) 2px);\n  pointer-events: none;\n}\n.dark[_nghost-%COMP%]   .phone-screen[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .phone-screen[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #2a4a3a,\n      #3a5a4a);\n  box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.5), inset -2px -2px 6px rgba(90, 120, 100, 0.2);\n  border-color: rgba(0, 0, 0, 0.4);\n}\n.screen-content[_ngcontent-%COMP%] {\n  text-align: center;\n  width: 100%;\n  min-height: 60px;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n.screen-status[_ngcontent-%COMP%] {\n  font-size: 9px;\n  font-weight: 700;\n  color: #1f3d2c;\n  text-transform: uppercase;\n  letter-spacing: 1px;\n  font-family:\n    "Courier New",\n    "Consolas",\n    monospace;\n  text-shadow: 0 0 2px rgba(31, 61, 44, 0.5), 1px 1px 0 rgba(255, 255, 255, 0.2);\n}\n.dark[_nghost-%COMP%]   .screen-status[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .screen-status[_ngcontent-%COMP%] {\n  color: #5fd385;\n  text-shadow: 0 0 3px rgba(95, 211, 133, 0.6), 0 0 6px rgba(95, 211, 133, 0.3);\n}\n.screen-number[_ngcontent-%COMP%] {\n  font-size: 26px;\n  font-weight: 900;\n  color: #0d1f17;\n  font-family:\n    "Courier New",\n    "Consolas",\n    "Lucida Console",\n    monospace;\n  letter-spacing: 3px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 2px;\n  text-shadow: 0 0 3px rgba(13, 31, 23, 0.4), 1px 1px 0 rgba(255, 255, 255, 0.15);\n  -webkit-font-smoothing: none;\n  -moz-osx-font-smoothing: grayscale;\n}\n.dark[_nghost-%COMP%]   .screen-number[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .screen-number[_ngcontent-%COMP%] {\n  color: #6ee89a;\n  text-shadow:\n    0 0 4px rgba(110, 232, 154, 0.8),\n    0 0 8px rgba(110, 232, 154, 0.4),\n    0 0 12px rgba(110, 232, 154, 0.2);\n}\n.number-display[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_slideIn 0.2s ease-out;\n}\n@keyframes _ngcontent-%COMP%_slideIn {\n  from {\n    opacity: 0;\n    transform: translateX(-5px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n.cursor-blink[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_blink 0.8s step-start infinite;\n  font-weight: 900;\n  color: #0d1f17;\n}\n.dark[_nghost-%COMP%]   .cursor-blink[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .cursor-blink[_ngcontent-%COMP%] {\n  color: #6ee89a;\n  text-shadow: 0 0 4px rgba(110, 232, 154, 0.8), 0 0 8px rgba(110, 232, 154, 0.4);\n}\n@keyframes _ngcontent-%COMP%_blink {\n  50% {\n    opacity: 0;\n  }\n}\n.screen-placeholder[_ngcontent-%COMP%] {\n  font-size: 10px;\n  color: #4a6b52;\n  font-style: normal;\n  font-family: "Courier New", monospace;\n  text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.15);\n  opacity: 0.6;\n}\n.dark[_nghost-%COMP%]   .screen-placeholder[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .screen-placeholder[_ngcontent-%COMP%] {\n  color: #3d7a52;\n  text-shadow: 0 0 2px rgba(61, 122, 82, 0.5);\n  opacity: 0.8;\n}\n.screen-call-info[_ngcontent-%COMP%] {\n  margin-top: 4px;\n}\n.screen-number-small[_ngcontent-%COMP%] {\n  font-size: 18px;\n  font-weight: 800;\n  color: #0d1f17;\n  font-family:\n    "Courier New",\n    "Consolas",\n    monospace;\n  letter-spacing: 2px;\n  text-shadow: 0 0 2px rgba(13, 31, 23, 0.4), 1px 1px 0 rgba(255, 255, 255, 0.1);\n  -webkit-font-smoothing: none;\n}\n.dark[_nghost-%COMP%]   .screen-number-small[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .screen-number-small[_ngcontent-%COMP%] {\n  color: #6ee89a;\n  text-shadow: 0 0 4px rgba(110, 232, 154, 0.7), 0 0 8px rgba(110, 232, 154, 0.3);\n}\n.screen-duration[_ngcontent-%COMP%] {\n  font-size: 22px;\n  font-weight: 900;\n  color: #0a3a1f;\n  font-family:\n    "Courier New",\n    "Consolas",\n    monospace;\n  letter-spacing: 2px;\n  margin-top: 4px;\n  animation: _ngcontent-%COMP%_fadeIn 0.5s ease-in;\n  text-shadow: 0 0 3px rgba(10, 58, 31, 0.5), 1px 1px 0 rgba(255, 255, 255, 0.15);\n  -webkit-font-smoothing: none;\n}\n.dark[_nghost-%COMP%]   .screen-duration[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .screen-duration[_ngcontent-%COMP%] {\n  color: #5fd385;\n  text-shadow:\n    0 0 5px rgba(95, 211, 133, 0.9),\n    0 0 10px rgba(95, 211, 133, 0.5),\n    0 0 15px rgba(95, 211, 133, 0.3);\n}\n@keyframes _ngcontent-%COMP%_fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n.control-row[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  gap: 12px;\n  margin-bottom: 16px;\n}\n.retro-btn[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n  border-radius: 50%;\n  border: none;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  transition: all 0.1s ease;\n  box-shadow:\n    4px 4px 8px rgba(0, 0, 0, 0.2),\n    -2px -2px 6px rgba(255, 255, 255, 0.7),\n    inset 1px 1px 2px rgba(255, 255, 255, 0.5);\n}\n.retro-btn[_ngcontent-%COMP%]:active:not(:disabled) {\n  box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.2), inset -1px -1px 3px rgba(255, 255, 255, 0.3);\n  transform: scale(0.95);\n}\n.retro-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1), -1px -1px 3px rgba(255, 255, 255, 0.5);\n}\n.retro-btn-red[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #f87171,\n      #dc2626);\n}\n.retro-btn-blue[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #60a5fa,\n      #2563eb);\n}\n.retro-btn-yellow[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #fbbf24,\n      #f59e0b);\n}\n.retro-btn-gray[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #9ca3af,\n      #6b7280);\n}\n.keypad-container[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 10px;\n  padding: 12px;\n  background:\n    linear-gradient(\n      145deg,\n      #dce4ed,\n      #f0f4f8);\n  border-radius: 16px;\n  box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.1), inset -2px -2px 4px rgba(255, 255, 255, 0.8);\n}\n.dark[_nghost-%COMP%]   .keypad-container[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .keypad-container[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #0f172a,\n      #1e293b);\n  box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.5), inset -2px -2px 4px rgba(51, 65, 85, 0.3);\n}\n.retro-key[_ngcontent-%COMP%] {\n  height: 52px;\n  background:\n    linear-gradient(\n      145deg,\n      #f8fafc,\n      #e2e8f0);\n  border: none;\n  border-radius: 12px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  transition: all 0.1s ease;\n  box-shadow:\n    5px 5px 10px rgba(148, 163, 184, 0.4),\n    -3px -3px 8px rgba(255, 255, 255, 0.9),\n    inset 1px 1px 2px rgba(255, 255, 255, 0.7);\n  position: relative;\n  overflow: hidden;\n}\n.dark[_nghost-%COMP%]   .retro-key[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .retro-key[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #334155,\n      #475569);\n  box-shadow:\n    5px 5px 10px rgba(0, 0, 0, 0.4),\n    -3px -3px 8px rgba(71, 85, 105, 0.3),\n    inset 1px 1px 2px rgba(100, 116, 139, 0.5);\n}\n.retro-key[_ngcontent-%COMP%]:hover {\n  background:\n    linear-gradient(\n      145deg,\n      #e0e7ff,\n      #c7d2fe);\n  box-shadow:\n    5px 5px 12px rgba(148, 163, 184, 0.5),\n    -3px -3px 10px rgba(255, 255, 255, 1),\n    inset 1px 1px 3px rgba(255, 255, 255, 0.8);\n}\n.dark[_nghost-%COMP%]   .retro-key[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .retro-key[_ngcontent-%COMP%]:hover {\n  background:\n    linear-gradient(\n      145deg,\n      #475569,\n      #64748b);\n  box-shadow:\n    5px 5px 12px rgba(0, 0, 0, 0.5),\n    -3px -3px 10px rgba(100, 116, 139, 0.4),\n    inset 1px 1px 3px rgba(148, 163, 184, 0.3);\n}\n.retro-key[_ngcontent-%COMP%]:active {\n  box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.15), inset -2px -2px 6px rgba(255, 255, 255, 0.5);\n  transform: scale(0.96);\n}\n.dark[_nghost-%COMP%]   .retro-key[_ngcontent-%COMP%]:active, .dark   [_nghost-%COMP%]   .retro-key[_ngcontent-%COMP%]:active {\n  box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.5), inset -2px -2px 6px rgba(100, 116, 139, 0.3);\n}\n.key-digit[_ngcontent-%COMP%] {\n  font-size: 20px;\n  font-weight: 700;\n  color: #1e293b;\n  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);\n  line-height: 1;\n}\n.dark[_nghost-%COMP%]   .key-digit[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .key-digit[_ngcontent-%COMP%] {\n  color: #f1f5f9;\n  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);\n}\n.key-letters[_ngcontent-%COMP%] {\n  font-size: 8px;\n  font-weight: 600;\n  color: #64748b;\n  text-transform: uppercase;\n  margin-top: 2px;\n  letter-spacing: 0.5px;\n}\n.dark[_nghost-%COMP%]   .key-letters[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .key-letters[_ngcontent-%COMP%] {\n  color: #94a3b8;\n}\n.action-buttons[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1.5fr 1fr;\n  gap: 8px;\n  margin-top: 12px;\n  padding: 0 12px;\n}\n.action-btn[_ngcontent-%COMP%] {\n  height: 48px;\n  border: none;\n  border-radius: 12px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 2px;\n  cursor: pointer;\n  transition: all 0.1s ease;\n  box-shadow:\n    4px 4px 8px rgba(0, 0, 0, 0.15),\n    -2px -2px 6px rgba(255, 255, 255, 0.7),\n    inset 1px 1px 2px rgba(255, 255, 255, 0.3);\n}\n.action-btn[_ngcontent-%COMP%]:active:not(:disabled) {\n  box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.2), inset -1px -1px 3px rgba(255, 255, 255, 0.3);\n  transform: scale(0.96);\n}\n.action-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.4;\n  cursor: not-allowed;\n  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1), -1px -1px 3px rgba(255, 255, 255, 0.5);\n}\n.action-btn-secondary[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #e2e8f0,\n      #cbd5e1);\n}\n.dark[_nghost-%COMP%]   .action-btn-secondary[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .action-btn-secondary[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #475569,\n      #334155);\n}\n.action-btn-call[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #22c55e,\n      #16a34a);\n}\n.dark[_nghost-%COMP%]   .action-btn-call[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .action-btn-call[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #22c55e,\n      #15803d);\n}\n.action-btn-call[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background:\n    linear-gradient(\n      145deg,\n      #16a34a,\n      #15803d);\n  box-shadow:\n    4px 4px 10px rgba(34, 197, 94, 0.3),\n    -2px -2px 8px rgba(255, 255, 255, 0.8),\n    inset 1px 1px 2px rgba(255, 255, 255, 0.4);\n}\n.action-label[_ngcontent-%COMP%] {\n  font-size: 9px;\n  font-weight: 600;\n  color: #475569;\n  text-transform: uppercase;\n  letter-spacing: 0.3px;\n}\n.dark[_nghost-%COMP%]   .action-label[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .action-label[_ngcontent-%COMP%] {\n  color: #cbd5e1;\n}\n.action-label-white[_ngcontent-%COMP%] {\n  font-size: 10px;\n  font-weight: 700;\n  color: white;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);\n}\n@media (max-width: 768px) {\n  .phone-body[_ngcontent-%COMP%] {\n    max-width: 100%;\n    padding: 16px;\n  }\n  .retro-key[_ngcontent-%COMP%] {\n    height: 48px;\n  }\n  .key-digit[_ngcontent-%COMP%] {\n    font-size: 18px;\n  }\n  .action-btn[_ngcontent-%COMP%] {\n    height: 44px;\n  }\n}\n/*# sourceMappingURL=softphone.component.css.map */'] });
var SoftphoneComponent = _SoftphoneComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SoftphoneComponent, [{
    type: Component,
    args: [{ selector: "app-softphone", standalone: true, imports: [CommonModule, MatCardModule, MatButtonModule, LucideAngularModule, MatTooltipModule], template: `<!-- Retro Phone Design -->\r
<div class="phone-body">\r
  <!-- Screen Display - Interactive -->\r
  <div class="phone-screen">\r
    <div class="screen-content">\r
      <!-- Status Icon -->\r
      <div class="flex items-center justify-center gap-1 mb-2">\r
        <lucide-angular\r
          [name]="callState === CallState.ACTIVE ? 'phone-call' : 'phone'"\r
          [size]="14"\r
          class="text-green-600 animate-pulse">\r
        </lucide-angular>\r
        <span class="screen-status">{{ getStatusText() }}</span>\r
      </div>\r
\r
      <!-- Dialed Number Display with Animation -->\r
      <div class="screen-number" *ngIf="callState === CallState.IDLE && dialedNumber">\r
        <span class="number-display">{{ dialedNumber }}</span>\r
        <span class="cursor-blink">|</span>\r
      </div>\r
\r
      <!-- Placeholder when empty -->\r
      <div class="screen-placeholder" *ngIf="callState === CallState.IDLE && !dialedNumber">\r
        Marque un n\xFAmero\r
      </div>\r
\r
      <!-- Active Call Info -->\r
      <div *ngIf="phoneNumber && callState !== CallState.IDLE" class="screen-call-info">\r
        <div class="screen-number-small">{{ phoneNumber }}</div>\r
      </div>\r
\r
      <!-- Call Duration -->\r
      <div class="screen-duration" *ngIf="isActive()">\r
        {{ formatDuration(duration) }}\r
      </div>\r
    </div>\r
  </div>\r
\r
  <!-- Control Buttons Row -->\r
  <div class="control-row" *ngIf="isActive()">\r
    <button\r
      *ngIf="canHangup"\r
      (click)="onHangup()"\r
      class="retro-btn retro-btn-red"\r
      [disabled]="!canHangup">\r
      <lucide-angular name="phone-off" [size]="16" class="text-white"></lucide-angular>\r
    </button>\r
\r
    <button\r
      (click)="onMute()"\r
      [class.retro-btn-yellow]="isMuted"\r
      [class.retro-btn-blue]="!isMuted"\r
      class="retro-btn"\r
      [disabled]="!isActive()">\r
      <lucide-angular [name]="isMuted ? 'mic-off' : 'mic'" [size]="16" class="text-white"></lucide-angular>\r
    </button>\r
\r
    <button\r
      (click)="onHold()"\r
      class="retro-btn retro-btn-gray"\r
      [disabled]="!isActive()">\r
      <lucide-angular name="pause" [size]="16" class="text-white"></lucide-angular>\r
    </button>\r
  </div>\r
\r
  <!-- DTMF Keypad - Retro Style -->\r
  <div class="keypad-container">\r
    <button\r
      *ngFor="let key of ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#']"\r
      (click)="onDTMF(key)"\r
      class="retro-key">\r
      <span class="key-digit">{{ key }}</span>\r
      <span class="key-letters" *ngIf="getLetters(key)">{{ getLetters(key) }}</span>\r
    </button>\r
  </div>\r
\r
  <!-- Action Buttons -->\r
  <div class="action-buttons" *ngIf="callState === CallState.IDLE">\r
    <button\r
      (click)="onBackspace()"\r
      class="action-btn action-btn-secondary"\r
      [disabled]="!dialedNumber">\r
      <lucide-angular name="delete-back" [size]="18"></lucide-angular>\r
      <span class="action-label">Borrar</span>\r
    </button>\r
\r
    <button\r
      (click)="onCall()"\r
      class="action-btn action-btn-call"\r
      [disabled]="!dialedNumber">\r
      <lucide-angular name="phone" [size]="20" class="text-white"></lucide-angular>\r
      <span class="action-label-white">Llamar</span>\r
    </button>\r
\r
    <button\r
      (click)="onClear()"\r
      class="action-btn action-btn-secondary"\r
      [disabled]="!dialedNumber">\r
      <lucide-angular name="x-circle" [size]="18"></lucide-angular>\r
      <span class="action-label">Limpiar</span>\r
    </button>\r
  </div>\r
</div>\r
`, styles: ['/* src/app/features/dialer/softphone/softphone.component.css */\n.phone-body {\n  background:\n    linear-gradient(\n      145deg,\n      #e6e9f0,\n      #eef1f5);\n  border-radius: 24px;\n  padding: 20px;\n  box-shadow:\n    12px 12px 24px rgba(174, 174, 192, 0.4),\n    -12px -12px 24px rgba(255, 255, 255, 0.8),\n    inset 2px 2px 4px rgba(255, 255, 255, 0.5);\n  max-width: 320px;\n  margin: 0 auto;\n  border: 2px solid rgba(255, 255, 255, 0.8);\n}\n:host-context(.dark) .phone-body {\n  background:\n    linear-gradient(\n      145deg,\n      #1e293b,\n      #0f172a);\n  box-shadow:\n    12px 12px 24px rgba(0, 0, 0, 0.5),\n    -12px -12px 24px rgba(51, 65, 85, 0.3),\n    inset 2px 2px 4px rgba(51, 65, 85, 0.5);\n  border-color: rgba(51, 65, 85, 0.5);\n}\n.phone-screen {\n  background:\n    linear-gradient(\n      135deg,\n      #9ca885,\n      #b4c29d);\n  border-radius: 12px;\n  padding: 16px;\n  margin-bottom: 16px;\n  box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.25), inset -2px -2px 6px rgba(255, 255, 255, 0.4);\n  border: 2px solid rgba(0, 0, 0, 0.15);\n  min-height: 80px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: relative;\n  overflow: hidden;\n}\n.phone-screen::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background:\n    repeating-linear-gradient(\n      0deg,\n      transparent,\n      transparent 1px,\n      rgba(0, 0, 0, 0.03) 1px,\n      rgba(0, 0, 0, 0.03) 2px),\n    repeating-linear-gradient(\n      90deg,\n      transparent,\n      transparent 1px,\n      rgba(0, 0, 0, 0.03) 1px,\n      rgba(0, 0, 0, 0.03) 2px);\n  pointer-events: none;\n}\n:host-context(.dark) .phone-screen {\n  background:\n    linear-gradient(\n      135deg,\n      #2a4a3a,\n      #3a5a4a);\n  box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.5), inset -2px -2px 6px rgba(90, 120, 100, 0.2);\n  border-color: rgba(0, 0, 0, 0.4);\n}\n.screen-content {\n  text-align: center;\n  width: 100%;\n  min-height: 60px;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n.screen-status {\n  font-size: 9px;\n  font-weight: 700;\n  color: #1f3d2c;\n  text-transform: uppercase;\n  letter-spacing: 1px;\n  font-family:\n    "Courier New",\n    "Consolas",\n    monospace;\n  text-shadow: 0 0 2px rgba(31, 61, 44, 0.5), 1px 1px 0 rgba(255, 255, 255, 0.2);\n}\n:host-context(.dark) .screen-status {\n  color: #5fd385;\n  text-shadow: 0 0 3px rgba(95, 211, 133, 0.6), 0 0 6px rgba(95, 211, 133, 0.3);\n}\n.screen-number {\n  font-size: 26px;\n  font-weight: 900;\n  color: #0d1f17;\n  font-family:\n    "Courier New",\n    "Consolas",\n    "Lucida Console",\n    monospace;\n  letter-spacing: 3px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 2px;\n  text-shadow: 0 0 3px rgba(13, 31, 23, 0.4), 1px 1px 0 rgba(255, 255, 255, 0.15);\n  -webkit-font-smoothing: none;\n  -moz-osx-font-smoothing: grayscale;\n}\n:host-context(.dark) .screen-number {\n  color: #6ee89a;\n  text-shadow:\n    0 0 4px rgba(110, 232, 154, 0.8),\n    0 0 8px rgba(110, 232, 154, 0.4),\n    0 0 12px rgba(110, 232, 154, 0.2);\n}\n.number-display {\n  animation: slideIn 0.2s ease-out;\n}\n@keyframes slideIn {\n  from {\n    opacity: 0;\n    transform: translateX(-5px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n.cursor-blink {\n  animation: blink 0.8s step-start infinite;\n  font-weight: 900;\n  color: #0d1f17;\n}\n:host-context(.dark) .cursor-blink {\n  color: #6ee89a;\n  text-shadow: 0 0 4px rgba(110, 232, 154, 0.8), 0 0 8px rgba(110, 232, 154, 0.4);\n}\n@keyframes blink {\n  50% {\n    opacity: 0;\n  }\n}\n.screen-placeholder {\n  font-size: 10px;\n  color: #4a6b52;\n  font-style: normal;\n  font-family: "Courier New", monospace;\n  text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.15);\n  opacity: 0.6;\n}\n:host-context(.dark) .screen-placeholder {\n  color: #3d7a52;\n  text-shadow: 0 0 2px rgba(61, 122, 82, 0.5);\n  opacity: 0.8;\n}\n.screen-call-info {\n  margin-top: 4px;\n}\n.screen-number-small {\n  font-size: 18px;\n  font-weight: 800;\n  color: #0d1f17;\n  font-family:\n    "Courier New",\n    "Consolas",\n    monospace;\n  letter-spacing: 2px;\n  text-shadow: 0 0 2px rgba(13, 31, 23, 0.4), 1px 1px 0 rgba(255, 255, 255, 0.1);\n  -webkit-font-smoothing: none;\n}\n:host-context(.dark) .screen-number-small {\n  color: #6ee89a;\n  text-shadow: 0 0 4px rgba(110, 232, 154, 0.7), 0 0 8px rgba(110, 232, 154, 0.3);\n}\n.screen-duration {\n  font-size: 22px;\n  font-weight: 900;\n  color: #0a3a1f;\n  font-family:\n    "Courier New",\n    "Consolas",\n    monospace;\n  letter-spacing: 2px;\n  margin-top: 4px;\n  animation: fadeIn 0.5s ease-in;\n  text-shadow: 0 0 3px rgba(10, 58, 31, 0.5), 1px 1px 0 rgba(255, 255, 255, 0.15);\n  -webkit-font-smoothing: none;\n}\n:host-context(.dark) .screen-duration {\n  color: #5fd385;\n  text-shadow:\n    0 0 5px rgba(95, 211, 133, 0.9),\n    0 0 10px rgba(95, 211, 133, 0.5),\n    0 0 15px rgba(95, 211, 133, 0.3);\n}\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n.control-row {\n  display: flex;\n  justify-content: center;\n  gap: 12px;\n  margin-bottom: 16px;\n}\n.retro-btn {\n  width: 48px;\n  height: 48px;\n  border-radius: 50%;\n  border: none;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  transition: all 0.1s ease;\n  box-shadow:\n    4px 4px 8px rgba(0, 0, 0, 0.2),\n    -2px -2px 6px rgba(255, 255, 255, 0.7),\n    inset 1px 1px 2px rgba(255, 255, 255, 0.5);\n}\n.retro-btn:active:not(:disabled) {\n  box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.2), inset -1px -1px 3px rgba(255, 255, 255, 0.3);\n  transform: scale(0.95);\n}\n.retro-btn:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1), -1px -1px 3px rgba(255, 255, 255, 0.5);\n}\n.retro-btn-red {\n  background:\n    linear-gradient(\n      145deg,\n      #f87171,\n      #dc2626);\n}\n.retro-btn-blue {\n  background:\n    linear-gradient(\n      145deg,\n      #60a5fa,\n      #2563eb);\n}\n.retro-btn-yellow {\n  background:\n    linear-gradient(\n      145deg,\n      #fbbf24,\n      #f59e0b);\n}\n.retro-btn-gray {\n  background:\n    linear-gradient(\n      145deg,\n      #9ca3af,\n      #6b7280);\n}\n.keypad-container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 10px;\n  padding: 12px;\n  background:\n    linear-gradient(\n      145deg,\n      #dce4ed,\n      #f0f4f8);\n  border-radius: 16px;\n  box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.1), inset -2px -2px 4px rgba(255, 255, 255, 0.8);\n}\n:host-context(.dark) .keypad-container {\n  background:\n    linear-gradient(\n      145deg,\n      #0f172a,\n      #1e293b);\n  box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.5), inset -2px -2px 4px rgba(51, 65, 85, 0.3);\n}\n.retro-key {\n  height: 52px;\n  background:\n    linear-gradient(\n      145deg,\n      #f8fafc,\n      #e2e8f0);\n  border: none;\n  border-radius: 12px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  transition: all 0.1s ease;\n  box-shadow:\n    5px 5px 10px rgba(148, 163, 184, 0.4),\n    -3px -3px 8px rgba(255, 255, 255, 0.9),\n    inset 1px 1px 2px rgba(255, 255, 255, 0.7);\n  position: relative;\n  overflow: hidden;\n}\n:host-context(.dark) .retro-key {\n  background:\n    linear-gradient(\n      145deg,\n      #334155,\n      #475569);\n  box-shadow:\n    5px 5px 10px rgba(0, 0, 0, 0.4),\n    -3px -3px 8px rgba(71, 85, 105, 0.3),\n    inset 1px 1px 2px rgba(100, 116, 139, 0.5);\n}\n.retro-key:hover {\n  background:\n    linear-gradient(\n      145deg,\n      #e0e7ff,\n      #c7d2fe);\n  box-shadow:\n    5px 5px 12px rgba(148, 163, 184, 0.5),\n    -3px -3px 10px rgba(255, 255, 255, 1),\n    inset 1px 1px 3px rgba(255, 255, 255, 0.8);\n}\n:host-context(.dark) .retro-key:hover {\n  background:\n    linear-gradient(\n      145deg,\n      #475569,\n      #64748b);\n  box-shadow:\n    5px 5px 12px rgba(0, 0, 0, 0.5),\n    -3px -3px 10px rgba(100, 116, 139, 0.4),\n    inset 1px 1px 3px rgba(148, 163, 184, 0.3);\n}\n.retro-key:active {\n  box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.15), inset -2px -2px 6px rgba(255, 255, 255, 0.5);\n  transform: scale(0.96);\n}\n:host-context(.dark) .retro-key:active {\n  box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.5), inset -2px -2px 6px rgba(100, 116, 139, 0.3);\n}\n.key-digit {\n  font-size: 20px;\n  font-weight: 700;\n  color: #1e293b;\n  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);\n  line-height: 1;\n}\n:host-context(.dark) .key-digit {\n  color: #f1f5f9;\n  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);\n}\n.key-letters {\n  font-size: 8px;\n  font-weight: 600;\n  color: #64748b;\n  text-transform: uppercase;\n  margin-top: 2px;\n  letter-spacing: 0.5px;\n}\n:host-context(.dark) .key-letters {\n  color: #94a3b8;\n}\n.action-buttons {\n  display: grid;\n  grid-template-columns: 1fr 1.5fr 1fr;\n  gap: 8px;\n  margin-top: 12px;\n  padding: 0 12px;\n}\n.action-btn {\n  height: 48px;\n  border: none;\n  border-radius: 12px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 2px;\n  cursor: pointer;\n  transition: all 0.1s ease;\n  box-shadow:\n    4px 4px 8px rgba(0, 0, 0, 0.15),\n    -2px -2px 6px rgba(255, 255, 255, 0.7),\n    inset 1px 1px 2px rgba(255, 255, 255, 0.3);\n}\n.action-btn:active:not(:disabled) {\n  box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.2), inset -1px -1px 3px rgba(255, 255, 255, 0.3);\n  transform: scale(0.96);\n}\n.action-btn:disabled {\n  opacity: 0.4;\n  cursor: not-allowed;\n  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1), -1px -1px 3px rgba(255, 255, 255, 0.5);\n}\n.action-btn-secondary {\n  background:\n    linear-gradient(\n      145deg,\n      #e2e8f0,\n      #cbd5e1);\n}\n:host-context(.dark) .action-btn-secondary {\n  background:\n    linear-gradient(\n      145deg,\n      #475569,\n      #334155);\n}\n.action-btn-call {\n  background:\n    linear-gradient(\n      145deg,\n      #22c55e,\n      #16a34a);\n}\n:host-context(.dark) .action-btn-call {\n  background:\n    linear-gradient(\n      145deg,\n      #22c55e,\n      #15803d);\n}\n.action-btn-call:hover:not(:disabled) {\n  background:\n    linear-gradient(\n      145deg,\n      #16a34a,\n      #15803d);\n  box-shadow:\n    4px 4px 10px rgba(34, 197, 94, 0.3),\n    -2px -2px 8px rgba(255, 255, 255, 0.8),\n    inset 1px 1px 2px rgba(255, 255, 255, 0.4);\n}\n.action-label {\n  font-size: 9px;\n  font-weight: 600;\n  color: #475569;\n  text-transform: uppercase;\n  letter-spacing: 0.3px;\n}\n:host-context(.dark) .action-label {\n  color: #cbd5e1;\n}\n.action-label-white {\n  font-size: 10px;\n  font-weight: 700;\n  color: white;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);\n}\n@media (max-width: 768px) {\n  .phone-body {\n    max-width: 100%;\n    padding: 16px;\n  }\n  .retro-key {\n    height: 48px;\n  }\n  .key-digit {\n    font-size: 18px;\n  }\n  .action-btn {\n    height: 44px;\n  }\n}\n/*# sourceMappingURL=softphone.component.css.map */\n'] }]
  }], null, { callState: [{
    type: Input
  }], duration: [{
    type: Input
  }], isMuted: [{
    type: Input
  }], phoneNumber: [{
    type: Input
  }], canHangup: [{
    type: Input
  }], hangupClicked: [{
    type: Output
  }], muteClicked: [{
    type: Output
  }], holdClicked: [{
    type: Output
  }], dtmfClicked: [{
    type: Output
  }], callClicked: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SoftphoneComponent, { className: "SoftphoneComponent", filePath: "src/app/features/dialer/softphone/softphone.component.ts", lineNumber: 16 });
})();

// src/app/core/services/call.service.ts
var _CallService = class _CallService {
  constructor(http) {
    this.http = http;
    this.apiUrl = `${environment.apiUrl}/calls`;
  }
  makeCall(request) {
    return this.http.post(`${this.apiUrl}/make`, request);
  }
  hangupCall(callId) {
    return this.http.post(`${this.apiUrl}/${callId}/hangup`, {});
  }
  completeCall(callId, request) {
    return this.http.post(`${this.apiUrl}/${callId}/complete`, request);
  }
  transferCall(callId, destination) {
    return this.http.post(`${this.apiUrl}/${callId}/transfer`, { destination });
  }
  getCallById(callId) {
    return this.http.get(`${this.apiUrl}/${callId}`);
  }
  getCallHistory(filters) {
    let params = new HttpParams();
    if (filters) {
      if (filters.agentId)
        params = params.set("agentId", filters.agentId.toString());
      if (filters.campaignId)
        params = params.set("campaignId", filters.campaignId.toString());
      if (filters.startDate)
        params = params.set("startDate", filters.startDate.toISOString());
      if (filters.endDate)
        params = params.set("endDate", filters.endDate.toISOString());
      if (filters.status)
        params = params.set("status", filters.status);
      if (filters.page)
        params = params.set("page", filters.page.toString());
      if (filters.size)
        params = params.set("size", filters.size.toString());
    }
    return this.http.get(`${this.apiUrl}/history`, { params });
  }
  getAgentCurrentCall(agentId) {
    return this.http.get(`${this.apiUrl}/agent/${agentId}/current`);
  }
};
_CallService.\u0275fac = function CallService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CallService)(\u0275\u0275inject(HttpClient));
};
_CallService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _CallService, factory: _CallService.\u0275fac, providedIn: "root" });
var CallService = _CallService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CallService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/features/dialer/dialer-main/dialer-main.component.ts
var _c02 = ["audioElement"];
var _DialerMainComponent = class _DialerMainComponent {
  constructor(authService, callService, contactService, websocketService, webrtcService, agentService, sipService) {
    this.authService = authService;
    this.callService = callService;
    this.contactService = contactService;
    this.websocketService = websocketService;
    this.webrtcService = webrtcService;
    this.agentService = agentService;
    this.sipService = sipService;
    this.currentContact = null;
    this.currentCall = null;
    this.agentStatus = AgentState.DISPONIBLE;
    this.campaignId = null;
    this.callState = CallState.IDLE;
    this.callDuration = 0;
    this.callTimer = null;
    this.loading = false;
    this.showNotesForm = false;
    this.subscriptions = [];
    this.agentId = 0;
  }
  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.agentId = user.id;
        console.log("Agent ID loaded:", this.agentId);
      }
    });
    this.initializeDialer();
    this.subscribeToWebSocket();
    this.subscribeToWebRTC();
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.stopCallTimer();
    this.webrtcService.cleanup();
  }
  initializeDialer() {
    return __async(this, null, function* () {
      try {
        yield this.webrtcService.initialize();
        console.log("WebRTC initialized successfully");
      } catch (error) {
        console.error("Failed to initialize WebRTC:", error);
      }
    });
  }
  subscribeToWebSocket() {
    const callsSub = this.websocketService.subscribe("/user/queue/calls").subscribe({
      next: (event) => {
        this.handleCallEvent(event);
      },
      error: (error) => {
        console.error("WebSocket error:", error);
      }
    });
    this.subscriptions.push(callsSub);
  }
  subscribeToWebRTC() {
    this.webrtcService.onCallStatus.subscribe((state) => {
      this.callState = state;
      console.log("Call state changed:", state);
    });
    this.webrtcService.onRemoteStream.subscribe((stream) => {
      if (this.audioElement && this.audioElement.nativeElement) {
        this.audioElement.nativeElement.srcObject = stream;
        this.audioElement.nativeElement.play();
      }
    });
    this.webrtcService.onError.subscribe((error) => {
      console.error("WebRTC error:", error);
      alert(error);
    });
  }
  handleCallEvent(event) {
    console.log("Received call event:", event);
    switch (event.type) {
      case CallEventType.CALL_RINGING:
        this.callState = CallState.RINGING;
        break;
      case CallEventType.CALL_CONNECTED:
        this.callState = CallState.ACTIVE;
        this.startCallTimer();
        break;
      case CallEventType.CALL_ENDED:
        this.onCallEnded();
        break;
      case CallEventType.NEW_CONTACT_ASSIGNED:
        if (event.data && event.data.contact) {
          this.currentContact = event.data.contact;
        }
        break;
    }
  }
  loadNextContact() {
    if (!this.campaignId) {
      console.log("No campaign selected");
      return;
    }
    this.loading = true;
    this.contactService.getNextContact(this.campaignId, this.agentId).subscribe({
      next: (contact) => {
        this.currentContact = contact;
        this.loading = false;
      },
      error: (error) => {
        console.error("Error loading next contact:", error);
        this.loading = false;
      }
    });
  }
  makeCall() {
    return __async(this, null, function* () {
      if (!this.currentContact) {
        alert("No contact available");
        return;
      }
      this.loading = true;
      const request = {
        agentId: this.agentId,
        phoneNumber: this.currentContact.phoneNumber,
        contactId: this.currentContact.id,
        campaignId: this.campaignId || void 0
      };
      try {
        this.callService.makeCall(request).subscribe({
          next: (call) => {
            this.currentCall = call;
            this.callState = CallState.CONNECTING;
            this.webrtcService.makeCall(this.currentContact.phoneNumber).then(() => {
              console.log("WebRTC call initiated");
              this.loading = false;
            }).catch((error) => {
              console.error("WebRTC call failed:", error);
              this.loading = false;
            });
          },
          error: (error) => {
            console.error("Error making call:", error);
            alert("Failed to make call: " + (error.error?.message || "Unknown error"));
            this.loading = false;
          }
        });
      } catch (error) {
        console.error("Error in makeCall:", error);
        this.loading = false;
      }
    });
  }
  makeCallWithNumber(phoneNumber) {
    return __async(this, null, function* () {
      this.loading = true;
      this.sipService.setCurrentOutgoingNumber(phoneNumber);
      const request = {
        agentId: this.agentId,
        phoneNumber,
        contactId: void 0,
        campaignId: this.campaignId || void 0
      };
      try {
        this.callService.makeCall(request).subscribe({
          next: (call) => {
            this.currentCall = call;
            this.callState = CallState.CONNECTING;
            this.currentContact = {
              id: 0,
              phoneNumber,
              firstName: "",
              lastName: "",
              campaignId: 0,
              status: "PENDING"
            };
            this.webrtcService.makeCall(phoneNumber).then(() => {
              console.log("WebRTC call initiated");
              this.loading = false;
            }).catch((error) => {
              console.error("WebRTC call failed:", error);
              this.loading = false;
            });
          },
          error: (error) => {
            console.error("Error making call:", error);
            alert("Failed to make call: " + (error.error?.message || "Unknown error"));
            this.loading = false;
          }
        });
      } catch (error) {
        console.error("Error in makeCall:", error);
        this.loading = false;
      }
    });
  }
  hangupCall() {
    if (!this.currentCall) {
      return;
    }
    this.webrtcService.hangupCall();
    this.callService.hangupCall(this.currentCall.callId).subscribe({
      next: () => {
        console.log("Call hung up successfully");
      },
      error: (error) => {
        console.error("Error hanging up call:", error);
      }
    });
    this.stopCallTimer();
  }
  onCallEnded() {
    this.callState = CallState.ENDED;
    this.stopCallTimer();
    this.showNotesForm = true;
  }
  onNotesComplete() {
    this.showNotesForm = false;
    this.currentCall = null;
    this.currentContact = null;
    this.callDuration = 0;
    this.callState = CallState.IDLE;
    this.loadNextContact();
  }
  skipContact() {
    if (confirm("Are you sure you want to skip this contact?")) {
      this.loadNextContact();
    }
  }
  startCallTimer() {
    this.callDuration = 0;
    this.callTimer = setInterval(() => {
      this.callDuration++;
    }, 1e3);
  }
  stopCallTimer() {
    if (this.callTimer) {
      clearInterval(this.callTimer);
      this.callTimer = null;
    }
  }
  formatTimer(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds % 3600 / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  getAgentStatusLabel() {
    return this.agentStatus;
  }
  getAgentStatusColor() {
    switch (this.agentStatus) {
      case AgentState.DISPONIBLE:
        return "#4caf50";
      case AgentState.EN_LLAMADA:
        return "#f44336";
      case AgentState.REFRIGERIO:
        return "#ff9800";
      default:
        return "#999";
    }
  }
  toggleMute() {
    const isMuted = this.webrtcService.toggleMute();
    console.log("Mute toggled:", isMuted);
  }
  isMuted() {
    return this.webrtcService.isMicMuted();
  }
  canMakeCall() {
    return this.callState === CallState.IDLE && this.currentContact !== null && !this.loading;
  }
  isInCall() {
    return this.callState === CallState.ACTIVE || this.callState === CallState.CONNECTING || this.callState === CallState.RINGING;
  }
};
_DialerMainComponent.\u0275fac = function DialerMainComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _DialerMainComponent)(\u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(CallService), \u0275\u0275directiveInject(ContactService), \u0275\u0275directiveInject(WebsocketService), \u0275\u0275directiveInject(WebrtcService), \u0275\u0275directiveInject(AgentService), \u0275\u0275directiveInject(SipService));
};
_DialerMainComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DialerMainComponent, selectors: [["app-dialer-main"]], viewQuery: function DialerMainComponent_Query(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275viewQuery(_c02, 5);
  }
  if (rf & 2) {
    let _t;
    \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.audioElement = _t.first);
  }
}, decls: 15, vars: 9, consts: [["audioElement", ""], [1, "h-[100dvh]", "bg-gradient-to-br", "from-slate-50", "via-blue-50", "to-slate-100", "dark:from-slate-950", "dark:via-gray-950", "dark:to-black", "flex", "flex-col", "overflow-hidden", "transition-colors", "duration-300"], [1, "flex", "items-center", "gap-2", "p-4"], [1, "w-8", "h-8", "bg-gradient-to-br", "from-blue-600", "to-blue-700", "rounded-lg", "flex", "items-center", "justify-center"], ["name", "phone", 1, "text-white", 3, "size"], [1, "text-lg", "font-bold", "text-gray-900", "dark:text-white"], [1, "text-xs", "text-gray-500", "dark:text-gray-400"], [1, "flex-1", "flex", "items-center", "justify-center", "p-4"], [1, "w-full", "max-w-md"], [3, "muteClicked", "callClicked", "callState", "duration", "isMuted", "phoneNumber", "canHangup"], ["autoplay", ""]], template: function DialerMainComponent_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "div", 3);
    \u0275\u0275element(3, "lucide-angular", 4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div")(5, "h1", 5);
    \u0275\u0275text(6, "Marcaci\xF3n Manual");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 6);
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "async");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 7)(11, "div", 8)(12, "app-softphone", 9);
    \u0275\u0275listener("muteClicked", function DialerMainComponent_Template_app_softphone_muteClicked_12_listener() {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.toggleMute());
    })("callClicked", function DialerMainComponent_Template_app_softphone_callClicked_12_listener($event) {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.makeCallWithNumber($event));
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275element(13, "audio", 10, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(((tmp_2_0 = \u0275\u0275pipeBind1(9, 7, ctx.authService.currentUser$)) == null ? null : tmp_2_0.firstName) || "Agente");
    \u0275\u0275advance(4);
    \u0275\u0275property("callState", ctx.callState)("duration", ctx.callDuration)("isMuted", ctx.isMuted())("phoneNumber", (ctx.currentContact == null ? null : ctx.currentContact.phoneNumber) || "")("canHangup", false);
  }
}, dependencies: [
  CommonModule,
  MatCardModule,
  MatButtonModule,
  LucideAngularModule,
  LucideAngularComponent,
  MatChipsModule,
  SoftphoneComponent,
  AsyncPipe
], styles: ["\n\naudio[_ngcontent-%COMP%] {\n  position: absolute;\n  opacity: 0;\n  pointer-events: none;\n}\n/*# sourceMappingURL=dialer-main.component.css.map */"] });
var DialerMainComponent = _DialerMainComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DialerMainComponent, [{
    type: Component,
    args: [{ selector: "app-dialer-main", standalone: true, imports: [
      CommonModule,
      MatCardModule,
      MatButtonModule,
      LucideAngularModule,
      MatChipsModule,
      SoftphoneComponent
    ], template: `<div class="h-[100dvh] bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-black flex flex-col overflow-hidden transition-colors duration-300">\r
  <!-- Header -->\r
  <div class="flex items-center gap-2 p-4">\r
    <div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">\r
      <lucide-angular name="phone" [size]="16" class="text-white"></lucide-angular>\r
    </div>\r
    <div>\r
      <h1 class="text-lg font-bold text-gray-900 dark:text-white">Marcaci\xF3n Manual</h1>\r
      <p class="text-xs text-gray-500 dark:text-gray-400">{{ (authService.currentUser$ | async)?.firstName || 'Agente' }}</p>\r
    </div>\r
  </div>\r
\r
  <!-- Main Content -->\r
  <div class="flex-1 flex items-center justify-center p-4">\r
    <div class="w-full max-w-md">\r
      <app-softphone\r
        [callState]="callState"\r
        [duration]="callDuration"\r
        [isMuted]="isMuted()"\r
        [phoneNumber]="currentContact?.phoneNumber || ''"\r
        [canHangup]="false"\r
        (muteClicked)="toggleMute()"\r
        (callClicked)="makeCallWithNumber($event)">\r
      </app-softphone>\r
    </div>\r
  </div>\r
\r
  <!-- Hidden audio element for remote stream -->\r
  <audio #audioElement autoplay></audio>\r
</div>\r
`, styles: ["/* src/app/features/dialer/dialer-main/dialer-main.component.css */\naudio {\n  position: absolute;\n  opacity: 0;\n  pointer-events: none;\n}\n/*# sourceMappingURL=dialer-main.component.css.map */\n"] }]
  }], () => [{ type: AuthService }, { type: CallService }, { type: ContactService }, { type: WebsocketService }, { type: WebrtcService }, { type: AgentService }, { type: SipService }], { audioElement: [{
    type: ViewChild,
    args: ["audioElement"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DialerMainComponent, { className: "DialerMainComponent", filePath: "src/app/features/dialer/dialer-main/dialer-main.component.ts", lineNumber: 34 });
})();
export {
  DialerMainComponent
};
//# sourceMappingURL=chunk-NGE7GABU.js.map
