import {
  AUTO_STYLE,
  AnimationGroupPlayer,
  AnimationMetadataType,
  AutorizacionService,
  MatProgressBar,
  MatProgressBarModule,
  NoopAnimationPlayer,
  RecordatoriosModalComponent,
  RecordatoriosService,
  sequence,
  style,
  ɵPRE_STYLE
} from "./chunk-SUFYRKBU.js";
import {
  AgentStatusService
} from "./chunk-T6TTP2GO.js";
import {
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle
} from "./chunk-HBS4YI6H.js";
import {
  StatusAlarmClockComponent
} from "./chunk-IRGKDA7E.js";
import "./chunk-CRNFYKBD.js";
import "./chunk-2GCPRO7O.js";
import "./chunk-XG3JRR2G.js";
import {
  CallState,
  SipService
} from "./chunk-FHH72WSF.js";
import {
  WebsocketService
} from "./chunk-NSDE3IOW.js";
import {
  MatButton,
  MatButtonModule
} from "./chunk-M2YI7FKS.js";
import "./chunk-Q5NKAKZL.js";
import {
  AuthService
} from "./chunk-55FOSRV6.js";
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
  RouterOutlet,
  provideRouter
} from "./chunk-OCZLH7K5.js";
import {
  BrowserModule,
  DomRendererFactory2,
  bootstrapApplication
} from "./chunk-ZQICQP3Y.js";
import {
  ThemeService
} from "./chunk-D3RWIMJ4.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-GRJ7XAPD.js";
import {
  Activity,
  AlarmClock,
  Archive,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BadgeCheck,
  Ban,
  Banknote,
  Bell,
  BellOff,
  BookOpen,
  Bookmark,
  Briefcase,
  Building,
  Building2,
  Calendar,
  CalendarCheck,
  CalendarX,
  ChartColumn,
  ChartNoAxesColumn,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circle,
  CircleAlert,
  CircleCheckBig,
  CircleMinus,
  CirclePlus,
  CircleUser,
  CircleX,
  Clipboard,
  ClipboardList,
  ClipboardPen,
  Clock,
  CloudUpload,
  Code,
  Coffee,
  Coins,
  Columns2,
  Copy,
  CornerUpLeft,
  CreditCard,
  Database,
  DollarSign,
  Download,
  EllipsisVertical,
  Eye,
  EyeOff,
  FileBadge,
  FileCheck,
  FilePlus,
  FileText,
  FileX,
  Flag,
  Folder,
  FolderOpen,
  FolderTree,
  Funnel,
  GitBranch,
  Glasses,
  GripVertical,
  HandMetal,
  Handshake,
  Hash,
  Headphones,
  Heart,
  History,
  House,
  Inbox,
  Info,
  Key,
  Landmark,
  Layers,
  LayoutDashboard,
  Link,
  List,
  ListChecks,
  Loader,
  Lock,
  LockOpen,
  LogOut,
  LucideAngularComponent,
  LucideAngularModule,
  Mail,
  Map as Map2,
  MapPin,
  Megaphone,
  Menu,
  MessageCircle,
  MessageSquare,
  Mic,
  Minus,
  Moon,
  Navigation,
  Package,
  Pause,
  Pen,
  PenLine,
  Pencil,
  Phone,
  PhoneCall,
  PhoneForwarded,
  PhoneIncoming,
  PhoneMissed,
  PhoneOff,
  PhoneOutgoing,
  Play,
  Plus,
  QrCode,
  RefreshCw,
  Rocket,
  Save,
  ScanLine,
  Search,
  SearchX,
  Send,
  Settings,
  Shield,
  ShieldBan,
  ShieldCheck,
  ShieldOff,
  ShoppingCart,
  SkipForward,
  SlidersVertical,
  Smartphone,
  Smile,
  Sparkles,
  Square,
  SquareFunction,
  SquarePen,
  Star,
  Sun,
  Table,
  Table2,
  Tag,
  Tags,
  Target,
  ThumbsDown,
  ThumbsUp,
  Timer,
  Trash,
  Trash2,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
  Trophy,
  Type,
  Upload,
  User,
  UserCheck,
  UserCog,
  UserX,
  Users,
  Wallet,
  X,
  Zap
} from "./chunk-RFBUEVFE.js";
import {
  environment
} from "./chunk-QF774CZR.js";
import {
  ANIMATION_MODULE_TYPE,
  AsyncPipe,
  BehaviorSubject,
  CommonModule,
  Component,
  CurrencyPipe,
  DOCUMENT,
  DatePipe,
  EventEmitter,
  HostListener,
  HttpClient,
  Inject,
  Injectable,
  Input,
  NgForOf,
  NgIf,
  NgModule,
  NgZone,
  Output,
  RendererFactory2,
  RuntimeError,
  Subject,
  ViewEncapsulation,
  __async,
  __objRest,
  __spreadValues,
  catchError,
  computed,
  debounceTime,
  fromEvent,
  importProvidersFrom,
  inject,
  interval,
  merge,
  of,
  performanceMarkFeature,
  provideHttpClient,
  provideZoneChangeDetection,
  setClassMetadata,
  signal,
  startWith,
  switchMap,
  tap,
  throwError,
  withInterceptors,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵresolveWindow,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-CTRHJBBW.js";

// node_modules/@angular/animations/fesm2022/util.mjs
var LINE_START = "\n - ";
function invalidTimingValue(exp) {
  return new RuntimeError(3e3, ngDevMode && `The provided timing value "${exp}" is invalid.`);
}
function negativeStepValue() {
  return new RuntimeError(3100, ngDevMode && "Duration values below 0 are not allowed for this animation step.");
}
function negativeDelayValue() {
  return new RuntimeError(3101, ngDevMode && "Delay values below 0 are not allowed for this animation step.");
}
function invalidStyleParams(varName) {
  return new RuntimeError(3001, ngDevMode && `Unable to resolve the local animation param ${varName} in the given list of values`);
}
function invalidParamValue(varName) {
  return new RuntimeError(3003, ngDevMode && `Please provide a value for the animation param ${varName}`);
}
function invalidNodeType(nodeType) {
  return new RuntimeError(3004, ngDevMode && `Unable to resolve animation metadata node #${nodeType}`);
}
function invalidCssUnitValue(userProvidedProperty, value) {
  return new RuntimeError(3005, ngDevMode && `Please provide a CSS unit value for ${userProvidedProperty}:${value}`);
}
function invalidTrigger() {
  return new RuntimeError(3006, ngDevMode && "animation triggers cannot be prefixed with an `@` sign (e.g. trigger('@foo', [...]))");
}
function invalidDefinition() {
  return new RuntimeError(3007, ngDevMode && "only state() and transition() definitions can sit inside of a trigger()");
}
function invalidState(metadataName, missingSubs) {
  return new RuntimeError(3008, ngDevMode && `state("${metadataName}", ...) must define default values for all the following style substitutions: ${missingSubs.join(", ")}`);
}
function invalidStyleValue(value) {
  return new RuntimeError(3002, ngDevMode && `The provided style string value ${value} is not allowed.`);
}
function invalidParallelAnimation(prop, firstStart, firstEnd, secondStart, secondEnd) {
  return new RuntimeError(3010, ngDevMode && `The CSS property "${prop}" that exists between the times of "${firstStart}ms" and "${firstEnd}ms" is also being animated in a parallel animation between the times of "${secondStart}ms" and "${secondEnd}ms"`);
}
function invalidKeyframes() {
  return new RuntimeError(3011, ngDevMode && `keyframes() must be placed inside of a call to animate()`);
}
function invalidOffset() {
  return new RuntimeError(3012, ngDevMode && `Please ensure that all keyframe offsets are between 0 and 1`);
}
function keyframeOffsetsOutOfOrder() {
  return new RuntimeError(3200, ngDevMode && `Please ensure that all keyframe offsets are in order`);
}
function keyframesMissingOffsets() {
  return new RuntimeError(3202, ngDevMode && `Not all style() steps within the declared keyframes() contain offsets`);
}
function invalidStagger() {
  return new RuntimeError(3013, ngDevMode && `stagger() can only be used inside of query()`);
}
function invalidQuery(selector) {
  return new RuntimeError(3014, ngDevMode && `\`query("${selector}")\` returned zero elements. (Use \`query("${selector}", { optional: true })\` if you wish to allow this.)`);
}
function invalidExpression(expr) {
  return new RuntimeError(3015, ngDevMode && `The provided transition expression "${expr}" is not supported`);
}
function invalidTransitionAlias(alias) {
  return new RuntimeError(3016, ngDevMode && `The transition alias value "${alias}" is not supported`);
}
function triggerBuildFailed(name, errors) {
  return new RuntimeError(3404, ngDevMode && `The animation trigger "${name}" has failed to build due to the following errors:
 - ${errors.map((err) => err.message).join("\n - ")}`);
}
function animationFailed(errors) {
  return new RuntimeError(3502, ngDevMode && `Unable to animate due to the following errors:${LINE_START}${errors.map((err) => err.message).join(LINE_START)}`);
}
function registerFailed(errors) {
  return new RuntimeError(3503, ngDevMode && `Unable to build the animation due to the following errors: ${errors.map((err) => err.message).join("\n")}`);
}
function missingOrDestroyedAnimation() {
  return new RuntimeError(3300, ngDevMode && "The requested animation doesn't exist or has already been destroyed");
}
function createAnimationFailed(errors) {
  return new RuntimeError(3504, ngDevMode && `Unable to create the animation due to the following errors:${errors.map((err) => err.message).join("\n")}`);
}
function missingPlayer(id) {
  return new RuntimeError(3301, ngDevMode && `Unable to find the timeline player referenced by ${id}`);
}
function missingTrigger(phase, name) {
  return new RuntimeError(3302, ngDevMode && `Unable to listen on the animation trigger event "${phase}" because the animation trigger "${name}" doesn't exist!`);
}
function missingEvent(name) {
  return new RuntimeError(3303, ngDevMode && `Unable to listen on the animation trigger "${name}" because the provided event is undefined!`);
}
function unsupportedTriggerEvent(phase, name) {
  return new RuntimeError(3400, ngDevMode && `The provided animation trigger event "${phase}" for the animation trigger "${name}" is not supported!`);
}
function unregisteredTrigger(name) {
  return new RuntimeError(3401, ngDevMode && `The provided animation trigger "${name}" has not been registered!`);
}
function triggerTransitionsFailed(errors) {
  return new RuntimeError(3402, ngDevMode && `Unable to process animations due to the following failed trigger transitions
 ${errors.map((err) => err.message).join("\n")}`);
}
function transitionFailed(name, errors) {
  return new RuntimeError(3505, ngDevMode && `@${name} has failed due to:
 ${errors.map((err) => err.message).join("\n- ")}`);
}
var ANIMATABLE_PROP_SET = /* @__PURE__ */ new Set([
  "-moz-outline-radius",
  "-moz-outline-radius-bottomleft",
  "-moz-outline-radius-bottomright",
  "-moz-outline-radius-topleft",
  "-moz-outline-radius-topright",
  "-ms-grid-columns",
  "-ms-grid-rows",
  "-webkit-line-clamp",
  "-webkit-text-fill-color",
  "-webkit-text-stroke",
  "-webkit-text-stroke-color",
  "accent-color",
  "all",
  "backdrop-filter",
  "background",
  "background-color",
  "background-position",
  "background-size",
  "block-size",
  "border",
  "border-block-end",
  "border-block-end-color",
  "border-block-end-width",
  "border-block-start",
  "border-block-start-color",
  "border-block-start-width",
  "border-bottom",
  "border-bottom-color",
  "border-bottom-left-radius",
  "border-bottom-right-radius",
  "border-bottom-width",
  "border-color",
  "border-end-end-radius",
  "border-end-start-radius",
  "border-image-outset",
  "border-image-slice",
  "border-image-width",
  "border-inline-end",
  "border-inline-end-color",
  "border-inline-end-width",
  "border-inline-start",
  "border-inline-start-color",
  "border-inline-start-width",
  "border-left",
  "border-left-color",
  "border-left-width",
  "border-radius",
  "border-right",
  "border-right-color",
  "border-right-width",
  "border-start-end-radius",
  "border-start-start-radius",
  "border-top",
  "border-top-color",
  "border-top-left-radius",
  "border-top-right-radius",
  "border-top-width",
  "border-width",
  "bottom",
  "box-shadow",
  "caret-color",
  "clip",
  "clip-path",
  "color",
  "column-count",
  "column-gap",
  "column-rule",
  "column-rule-color",
  "column-rule-width",
  "column-width",
  "columns",
  "filter",
  "flex",
  "flex-basis",
  "flex-grow",
  "flex-shrink",
  "font",
  "font-size",
  "font-size-adjust",
  "font-stretch",
  "font-variation-settings",
  "font-weight",
  "gap",
  "grid-column-gap",
  "grid-gap",
  "grid-row-gap",
  "grid-template-columns",
  "grid-template-rows",
  "height",
  "inline-size",
  "input-security",
  "inset",
  "inset-block",
  "inset-block-end",
  "inset-block-start",
  "inset-inline",
  "inset-inline-end",
  "inset-inline-start",
  "left",
  "letter-spacing",
  "line-clamp",
  "line-height",
  "margin",
  "margin-block-end",
  "margin-block-start",
  "margin-bottom",
  "margin-inline-end",
  "margin-inline-start",
  "margin-left",
  "margin-right",
  "margin-top",
  "mask",
  "mask-border",
  "mask-position",
  "mask-size",
  "max-block-size",
  "max-height",
  "max-inline-size",
  "max-lines",
  "max-width",
  "min-block-size",
  "min-height",
  "min-inline-size",
  "min-width",
  "object-position",
  "offset",
  "offset-anchor",
  "offset-distance",
  "offset-path",
  "offset-position",
  "offset-rotate",
  "opacity",
  "order",
  "outline",
  "outline-color",
  "outline-offset",
  "outline-width",
  "padding",
  "padding-block-end",
  "padding-block-start",
  "padding-bottom",
  "padding-inline-end",
  "padding-inline-start",
  "padding-left",
  "padding-right",
  "padding-top",
  "perspective",
  "perspective-origin",
  "right",
  "rotate",
  "row-gap",
  "scale",
  "scroll-margin",
  "scroll-margin-block",
  "scroll-margin-block-end",
  "scroll-margin-block-start",
  "scroll-margin-bottom",
  "scroll-margin-inline",
  "scroll-margin-inline-end",
  "scroll-margin-inline-start",
  "scroll-margin-left",
  "scroll-margin-right",
  "scroll-margin-top",
  "scroll-padding",
  "scroll-padding-block",
  "scroll-padding-block-end",
  "scroll-padding-block-start",
  "scroll-padding-bottom",
  "scroll-padding-inline",
  "scroll-padding-inline-end",
  "scroll-padding-inline-start",
  "scroll-padding-left",
  "scroll-padding-right",
  "scroll-padding-top",
  "scroll-snap-coordinate",
  "scroll-snap-destination",
  "scrollbar-color",
  "shape-image-threshold",
  "shape-margin",
  "shape-outside",
  "tab-size",
  "text-decoration",
  "text-decoration-color",
  "text-decoration-thickness",
  "text-emphasis",
  "text-emphasis-color",
  "text-indent",
  "text-shadow",
  "text-underline-offset",
  "top",
  "transform",
  "transform-origin",
  "translate",
  "vertical-align",
  "visibility",
  "width",
  "word-spacing",
  "z-index",
  "zoom"
]);
function optimizeGroupPlayer(players) {
  switch (players.length) {
    case 0:
      return new NoopAnimationPlayer();
    case 1:
      return players[0];
    default:
      return new AnimationGroupPlayer(players);
  }
}
function normalizeKeyframes$1(normalizer, keyframes, preStyles = /* @__PURE__ */ new Map(), postStyles = /* @__PURE__ */ new Map()) {
  const errors = [];
  const normalizedKeyframes = [];
  let previousOffset = -1;
  let previousKeyframe = null;
  keyframes.forEach((kf) => {
    const offset = kf.get("offset");
    const isSameOffset = offset == previousOffset;
    const normalizedKeyframe = isSameOffset && previousKeyframe || /* @__PURE__ */ new Map();
    kf.forEach((val, prop) => {
      let normalizedProp = prop;
      let normalizedValue = val;
      if (prop !== "offset") {
        normalizedProp = normalizer.normalizePropertyName(normalizedProp, errors);
        switch (normalizedValue) {
          case \u0275PRE_STYLE:
            normalizedValue = preStyles.get(prop);
            break;
          case AUTO_STYLE:
            normalizedValue = postStyles.get(prop);
            break;
          default:
            normalizedValue = normalizer.normalizeStyleValue(prop, normalizedProp, normalizedValue, errors);
            break;
        }
      }
      normalizedKeyframe.set(normalizedProp, normalizedValue);
    });
    if (!isSameOffset) {
      normalizedKeyframes.push(normalizedKeyframe);
    }
    previousKeyframe = normalizedKeyframe;
    previousOffset = offset;
  });
  if (errors.length) {
    throw animationFailed(errors);
  }
  return normalizedKeyframes;
}
function listenOnPlayer(player, eventName, event, callback) {
  switch (eventName) {
    case "start":
      player.onStart(() => callback(event && copyAnimationEvent(event, "start", player)));
      break;
    case "done":
      player.onDone(() => callback(event && copyAnimationEvent(event, "done", player)));
      break;
    case "destroy":
      player.onDestroy(() => callback(event && copyAnimationEvent(event, "destroy", player)));
      break;
  }
}
function copyAnimationEvent(e, phaseName, player) {
  const totalTime = player.totalTime;
  const disabled = player.disabled ? true : false;
  const event = makeAnimationEvent(e.element, e.triggerName, e.fromState, e.toState, phaseName || e.phaseName, totalTime == void 0 ? e.totalTime : totalTime, disabled);
  const data = e["_data"];
  if (data != null) {
    event["_data"] = data;
  }
  return event;
}
function makeAnimationEvent(element, triggerName, fromState, toState, phaseName = "", totalTime = 0, disabled) {
  return { element, triggerName, fromState, toState, phaseName, totalTime, disabled: !!disabled };
}
function getOrSetDefaultValue(map, key, defaultValue) {
  let value = map.get(key);
  if (!value) {
    map.set(key, value = defaultValue);
  }
  return value;
}
function parseTimelineCommand(command) {
  const separatorPos = command.indexOf(":");
  const id = command.substring(1, separatorPos);
  const action = command.slice(separatorPos + 1);
  return [id, action];
}
var documentElement = /* @__PURE__ */ (() => typeof document === "undefined" ? null : document.documentElement)();
function getParentElement(element) {
  const parent = element.parentNode || element.host || null;
  if (parent === documentElement) {
    return null;
  }
  return parent;
}
function containsVendorPrefix(prop) {
  return prop.substring(1, 6) == "ebkit";
}
var _CACHED_BODY = null;
var _IS_WEBKIT = false;
function validateStyleProperty(prop) {
  if (!_CACHED_BODY) {
    _CACHED_BODY = getBodyNode() || {};
    _IS_WEBKIT = _CACHED_BODY.style ? "WebkitAppearance" in _CACHED_BODY.style : false;
  }
  let result = true;
  if (_CACHED_BODY.style && !containsVendorPrefix(prop)) {
    result = prop in _CACHED_BODY.style;
    if (!result && _IS_WEBKIT) {
      const camelProp = "Webkit" + prop.charAt(0).toUpperCase() + prop.slice(1);
      result = camelProp in _CACHED_BODY.style;
    }
  }
  return result;
}
function validateWebAnimatableStyleProperty(prop) {
  return ANIMATABLE_PROP_SET.has(prop);
}
function getBodyNode() {
  if (typeof document != "undefined") {
    return document.body;
  }
  return null;
}
function containsElement(elm1, elm2) {
  while (elm2) {
    if (elm2 === elm1) {
      return true;
    }
    elm2 = getParentElement(elm2);
  }
  return false;
}
function invokeQuery(element, selector, multi) {
  if (multi) {
    return Array.from(element.querySelectorAll(selector));
  }
  const elem = element.querySelector(selector);
  return elem ? [elem] : [];
}
var ONE_SECOND = 1e3;
var SUBSTITUTION_EXPR_START = "{{";
var SUBSTITUTION_EXPR_END = "}}";
var ENTER_CLASSNAME = "ng-enter";
var LEAVE_CLASSNAME = "ng-leave";
var NG_TRIGGER_CLASSNAME = "ng-trigger";
var NG_TRIGGER_SELECTOR = ".ng-trigger";
var NG_ANIMATING_CLASSNAME = "ng-animating";
var NG_ANIMATING_SELECTOR = ".ng-animating";
function resolveTimingValue(value) {
  if (typeof value == "number")
    return value;
  const matches = value.match(/^(-?[\.\d]+)(m?s)/);
  if (!matches || matches.length < 2)
    return 0;
  return _convertTimeValueToMS(parseFloat(matches[1]), matches[2]);
}
function _convertTimeValueToMS(value, unit) {
  switch (unit) {
    case "s":
      return value * ONE_SECOND;
    default:
      return value;
  }
}
function resolveTiming(timings, errors, allowNegativeValues) {
  return timings.hasOwnProperty("duration") ? timings : parseTimeExpression(timings, errors, allowNegativeValues);
}
var PARSE_TIME_EXPRESSION_REGEX = /^(-?[\.\d]+)(m?s)(?:\s+(-?[\.\d]+)(m?s))?(?:\s+([-a-z]+(?:\(.+?\))?))?$/i;
function parseTimeExpression(exp, errors, allowNegativeValues) {
  let duration;
  let delay = 0;
  let easing = "";
  if (typeof exp === "string") {
    const matches = exp.match(PARSE_TIME_EXPRESSION_REGEX);
    if (matches === null) {
      errors.push(invalidTimingValue(exp));
      return { duration: 0, delay: 0, easing: "" };
    }
    duration = _convertTimeValueToMS(parseFloat(matches[1]), matches[2]);
    const delayMatch = matches[3];
    if (delayMatch != null) {
      delay = _convertTimeValueToMS(parseFloat(delayMatch), matches[4]);
    }
    const easingVal = matches[5];
    if (easingVal) {
      easing = easingVal;
    }
  } else {
    duration = exp;
  }
  if (!allowNegativeValues) {
    let containsErrors = false;
    let startIndex = errors.length;
    if (duration < 0) {
      errors.push(negativeStepValue());
      containsErrors = true;
    }
    if (delay < 0) {
      errors.push(negativeDelayValue());
      containsErrors = true;
    }
    if (containsErrors) {
      errors.splice(startIndex, 0, invalidTimingValue(exp));
    }
  }
  return { duration, delay, easing };
}
function normalizeKeyframes(keyframes) {
  if (!keyframes.length) {
    return [];
  }
  if (keyframes[0] instanceof Map) {
    return keyframes;
  }
  return keyframes.map((kf) => new Map(Object.entries(kf)));
}
function setStyles(element, styles, formerStyles) {
  styles.forEach((val, prop) => {
    const camelProp = dashCaseToCamelCase(prop);
    if (formerStyles && !formerStyles.has(prop)) {
      formerStyles.set(prop, element.style[camelProp]);
    }
    element.style[camelProp] = val;
  });
}
function eraseStyles(element, styles) {
  styles.forEach((_, prop) => {
    const camelProp = dashCaseToCamelCase(prop);
    element.style[camelProp] = "";
  });
}
function normalizeAnimationEntry(steps) {
  if (Array.isArray(steps)) {
    if (steps.length == 1)
      return steps[0];
    return sequence(steps);
  }
  return steps;
}
function validateStyleParams(value, options, errors) {
  const params = options.params || {};
  const matches = extractStyleParams(value);
  if (matches.length) {
    matches.forEach((varName) => {
      if (!params.hasOwnProperty(varName)) {
        errors.push(invalidStyleParams(varName));
      }
    });
  }
}
var PARAM_REGEX = /* @__PURE__ */ new RegExp(`${SUBSTITUTION_EXPR_START}\\s*(.+?)\\s*${SUBSTITUTION_EXPR_END}`, "g");
function extractStyleParams(value) {
  let params = [];
  if (typeof value === "string") {
    let match;
    while (match = PARAM_REGEX.exec(value)) {
      params.push(match[1]);
    }
    PARAM_REGEX.lastIndex = 0;
  }
  return params;
}
function interpolateParams(value, params, errors) {
  const original = `${value}`;
  const str = original.replace(PARAM_REGEX, (_, varName) => {
    let localVal = params[varName];
    if (localVal == null) {
      errors.push(invalidParamValue(varName));
      localVal = "";
    }
    return localVal.toString();
  });
  return str == original ? value : str;
}
var DASH_CASE_REGEXP = /-+([a-z0-9])/g;
function dashCaseToCamelCase(input) {
  return input.replace(DASH_CASE_REGEXP, (...m) => m[1].toUpperCase());
}
function camelCaseToDashCase(input) {
  return input.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function allowPreviousPlayerStylesMerge(duration, delay) {
  return duration === 0 || delay === 0;
}
function balancePreviousStylesIntoKeyframes(element, keyframes, previousStyles) {
  if (previousStyles.size && keyframes.length) {
    let startingKeyframe = keyframes[0];
    let missingStyleProps = [];
    previousStyles.forEach((val, prop) => {
      if (!startingKeyframe.has(prop)) {
        missingStyleProps.push(prop);
      }
      startingKeyframe.set(prop, val);
    });
    if (missingStyleProps.length) {
      for (let i = 1; i < keyframes.length; i++) {
        let kf = keyframes[i];
        missingStyleProps.forEach((prop) => kf.set(prop, computeStyle(element, prop)));
      }
    }
  }
  return keyframes;
}
function visitDslNode(visitor, node, context) {
  switch (node.type) {
    case AnimationMetadataType.Trigger:
      return visitor.visitTrigger(node, context);
    case AnimationMetadataType.State:
      return visitor.visitState(node, context);
    case AnimationMetadataType.Transition:
      return visitor.visitTransition(node, context);
    case AnimationMetadataType.Sequence:
      return visitor.visitSequence(node, context);
    case AnimationMetadataType.Group:
      return visitor.visitGroup(node, context);
    case AnimationMetadataType.Animate:
      return visitor.visitAnimate(node, context);
    case AnimationMetadataType.Keyframes:
      return visitor.visitKeyframes(node, context);
    case AnimationMetadataType.Style:
      return visitor.visitStyle(node, context);
    case AnimationMetadataType.Reference:
      return visitor.visitReference(node, context);
    case AnimationMetadataType.AnimateChild:
      return visitor.visitAnimateChild(node, context);
    case AnimationMetadataType.AnimateRef:
      return visitor.visitAnimateRef(node, context);
    case AnimationMetadataType.Query:
      return visitor.visitQuery(node, context);
    case AnimationMetadataType.Stagger:
      return visitor.visitStagger(node, context);
    default:
      throw invalidNodeType(node.type);
  }
}
function computeStyle(element, prop) {
  return window.getComputedStyle(element)[prop];
}

// node_modules/@angular/animations/fesm2022/browser.mjs
var NoopAnimationDriver = class _NoopAnimationDriver {
  /**
   * @returns Whether `prop` is a valid CSS property
   */
  validateStyleProperty(prop) {
    return validateStyleProperty(prop);
  }
  /**
   *
   * @returns Whether elm1 contains elm2.
   */
  containsElement(elm1, elm2) {
    return containsElement(elm1, elm2);
  }
  /**
   * @returns Rhe parent of the given element or `null` if the element is the `document`
   */
  getParentElement(element) {
    return getParentElement(element);
  }
  /**
   * @returns The result of the query selector on the element. The array will contain up to 1 item
   *     if `multi` is  `false`.
   */
  query(element, selector, multi) {
    return invokeQuery(element, selector, multi);
  }
  /**
   * @returns The `defaultValue` or empty string
   */
  computeStyle(element, prop, defaultValue) {
    return defaultValue || "";
  }
  /**
   * @returns An `NoopAnimationPlayer`
   */
  animate(element, keyframes, duration, delay, easing, previousPlayers = [], scrubberAccessRequested) {
    return new NoopAnimationPlayer(duration, delay);
  }
  static \u0275fac = function NoopAnimationDriver_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NoopAnimationDriver)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _NoopAnimationDriver,
    factory: _NoopAnimationDriver.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NoopAnimationDriver, [{
    type: Injectable
  }], null, null);
})();
var AnimationDriver = class {
  /**
   * @deprecated Use the NoopAnimationDriver class.
   */
  static NOOP = new NoopAnimationDriver();
};
var AnimationStyleNormalizer = class {
};
var DIMENSIONAL_PROP_SET = /* @__PURE__ */ new Set(["width", "height", "minWidth", "minHeight", "maxWidth", "maxHeight", "left", "top", "bottom", "right", "fontSize", "outlineWidth", "outlineOffset", "paddingTop", "paddingLeft", "paddingBottom", "paddingRight", "marginTop", "marginLeft", "marginBottom", "marginRight", "borderRadius", "borderWidth", "borderTopWidth", "borderLeftWidth", "borderRightWidth", "borderBottomWidth", "textIndent", "perspective"]);
var WebAnimationsStyleNormalizer = class extends AnimationStyleNormalizer {
  normalizePropertyName(propertyName, errors) {
    return dashCaseToCamelCase(propertyName);
  }
  normalizeStyleValue(userProvidedProperty, normalizedProperty, value, errors) {
    let unit = "";
    const strVal = value.toString().trim();
    if (DIMENSIONAL_PROP_SET.has(normalizedProperty) && value !== 0 && value !== "0") {
      if (typeof value === "number") {
        unit = "px";
      } else {
        const valAndSuffixMatch = value.match(/^[+-]?[\d\.]+([a-z]*)$/);
        if (valAndSuffixMatch && valAndSuffixMatch[1].length == 0) {
          errors.push(invalidCssUnitValue(userProvidedProperty, value));
        }
      }
    }
    return strVal + unit;
  }
};
function createListOfWarnings(warnings) {
  const LINE_START2 = "\n - ";
  return `${LINE_START2}${warnings.filter(Boolean).map((warning) => warning).join(LINE_START2)}`;
}
function warnTriggerBuild(name, warnings) {
  console.warn(`The animation trigger "${name}" has built with the following warnings:${createListOfWarnings(warnings)}`);
}
function warnRegister(warnings) {
  console.warn(`Animation built with the following warnings:${createListOfWarnings(warnings)}`);
}
function pushUnrecognizedPropertiesWarning(warnings, props) {
  if (props.length) {
    warnings.push(`The following provided properties are not recognized: ${props.join(", ")}`);
  }
}
var ANY_STATE = "*";
function parseTransitionExpr(transitionValue, errors) {
  const expressions = [];
  if (typeof transitionValue == "string") {
    transitionValue.split(/\s*,\s*/).forEach((str) => parseInnerTransitionStr(str, expressions, errors));
  } else {
    expressions.push(transitionValue);
  }
  return expressions;
}
function parseInnerTransitionStr(eventStr, expressions, errors) {
  if (eventStr[0] == ":") {
    const result = parseAnimationAlias(eventStr, errors);
    if (typeof result == "function") {
      expressions.push(result);
      return;
    }
    eventStr = result;
  }
  const match = eventStr.match(/^(\*|[-\w]+)\s*(<?[=-]>)\s*(\*|[-\w]+)$/);
  if (match == null || match.length < 4) {
    errors.push(invalidExpression(eventStr));
    return expressions;
  }
  const fromState = match[1];
  const separator = match[2];
  const toState = match[3];
  expressions.push(makeLambdaFromStates(fromState, toState));
  const isFullAnyStateExpr = fromState == ANY_STATE && toState == ANY_STATE;
  if (separator[0] == "<" && !isFullAnyStateExpr) {
    expressions.push(makeLambdaFromStates(toState, fromState));
  }
  return;
}
function parseAnimationAlias(alias, errors) {
  switch (alias) {
    case ":enter":
      return "void => *";
    case ":leave":
      return "* => void";
    case ":increment":
      return (fromState, toState) => parseFloat(toState) > parseFloat(fromState);
    case ":decrement":
      return (fromState, toState) => parseFloat(toState) < parseFloat(fromState);
    default:
      errors.push(invalidTransitionAlias(alias));
      return "* => *";
  }
}
var TRUE_BOOLEAN_VALUES = /* @__PURE__ */ new Set(["true", "1"]);
var FALSE_BOOLEAN_VALUES = /* @__PURE__ */ new Set(["false", "0"]);
function makeLambdaFromStates(lhs, rhs) {
  const LHS_MATCH_BOOLEAN = TRUE_BOOLEAN_VALUES.has(lhs) || FALSE_BOOLEAN_VALUES.has(lhs);
  const RHS_MATCH_BOOLEAN = TRUE_BOOLEAN_VALUES.has(rhs) || FALSE_BOOLEAN_VALUES.has(rhs);
  return (fromState, toState) => {
    let lhsMatch = lhs == ANY_STATE || lhs == fromState;
    let rhsMatch = rhs == ANY_STATE || rhs == toState;
    if (!lhsMatch && LHS_MATCH_BOOLEAN && typeof fromState === "boolean") {
      lhsMatch = fromState ? TRUE_BOOLEAN_VALUES.has(lhs) : FALSE_BOOLEAN_VALUES.has(lhs);
    }
    if (!rhsMatch && RHS_MATCH_BOOLEAN && typeof toState === "boolean") {
      rhsMatch = toState ? TRUE_BOOLEAN_VALUES.has(rhs) : FALSE_BOOLEAN_VALUES.has(rhs);
    }
    return lhsMatch && rhsMatch;
  };
}
var SELF_TOKEN = ":self";
var SELF_TOKEN_REGEX = /* @__PURE__ */ new RegExp(`s*${SELF_TOKEN}s*,?`, "g");
function buildAnimationAst(driver, metadata, errors, warnings) {
  return new AnimationAstBuilderVisitor(driver).build(metadata, errors, warnings);
}
var ROOT_SELECTOR = "";
var AnimationAstBuilderVisitor = class {
  _driver;
  constructor(_driver) {
    this._driver = _driver;
  }
  build(metadata, errors, warnings) {
    const context = new AnimationAstBuilderContext(errors);
    this._resetContextStyleTimingState(context);
    const ast = visitDslNode(this, normalizeAnimationEntry(metadata), context);
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      if (context.unsupportedCSSPropertiesFound.size) {
        pushUnrecognizedPropertiesWarning(warnings, [...context.unsupportedCSSPropertiesFound.keys()]);
      }
    }
    return ast;
  }
  _resetContextStyleTimingState(context) {
    context.currentQuerySelector = ROOT_SELECTOR;
    context.collectedStyles = /* @__PURE__ */ new Map();
    context.collectedStyles.set(ROOT_SELECTOR, /* @__PURE__ */ new Map());
    context.currentTime = 0;
  }
  visitTrigger(metadata, context) {
    let queryCount = context.queryCount = 0;
    let depCount = context.depCount = 0;
    const states = [];
    const transitions = [];
    if (metadata.name.charAt(0) == "@") {
      context.errors.push(invalidTrigger());
    }
    metadata.definitions.forEach((def) => {
      this._resetContextStyleTimingState(context);
      if (def.type == AnimationMetadataType.State) {
        const stateDef = def;
        const name = stateDef.name;
        name.toString().split(/\s*,\s*/).forEach((n) => {
          stateDef.name = n;
          states.push(this.visitState(stateDef, context));
        });
        stateDef.name = name;
      } else if (def.type == AnimationMetadataType.Transition) {
        const transition = this.visitTransition(def, context);
        queryCount += transition.queryCount;
        depCount += transition.depCount;
        transitions.push(transition);
      } else {
        context.errors.push(invalidDefinition());
      }
    });
    return {
      type: AnimationMetadataType.Trigger,
      name: metadata.name,
      states,
      transitions,
      queryCount,
      depCount,
      options: null
    };
  }
  visitState(metadata, context) {
    const styleAst = this.visitStyle(metadata.styles, context);
    const astParams = metadata.options && metadata.options.params || null;
    if (styleAst.containsDynamicStyles) {
      const missingSubs = /* @__PURE__ */ new Set();
      const params = astParams || {};
      styleAst.styles.forEach((style2) => {
        if (style2 instanceof Map) {
          style2.forEach((value) => {
            extractStyleParams(value).forEach((sub) => {
              if (!params.hasOwnProperty(sub)) {
                missingSubs.add(sub);
              }
            });
          });
        }
      });
      if (missingSubs.size) {
        context.errors.push(invalidState(metadata.name, [...missingSubs.values()]));
      }
    }
    return {
      type: AnimationMetadataType.State,
      name: metadata.name,
      style: styleAst,
      options: astParams ? {
        params: astParams
      } : null
    };
  }
  visitTransition(metadata, context) {
    context.queryCount = 0;
    context.depCount = 0;
    const animation = visitDslNode(this, normalizeAnimationEntry(metadata.animation), context);
    const matchers = parseTransitionExpr(metadata.expr, context.errors);
    return {
      type: AnimationMetadataType.Transition,
      matchers,
      animation,
      queryCount: context.queryCount,
      depCount: context.depCount,
      options: normalizeAnimationOptions(metadata.options)
    };
  }
  visitSequence(metadata, context) {
    return {
      type: AnimationMetadataType.Sequence,
      steps: metadata.steps.map((s) => visitDslNode(this, s, context)),
      options: normalizeAnimationOptions(metadata.options)
    };
  }
  visitGroup(metadata, context) {
    const currentTime = context.currentTime;
    let furthestTime = 0;
    const steps = metadata.steps.map((step) => {
      context.currentTime = currentTime;
      const innerAst = visitDslNode(this, step, context);
      furthestTime = Math.max(furthestTime, context.currentTime);
      return innerAst;
    });
    context.currentTime = furthestTime;
    return {
      type: AnimationMetadataType.Group,
      steps,
      options: normalizeAnimationOptions(metadata.options)
    };
  }
  visitAnimate(metadata, context) {
    const timingAst = constructTimingAst(metadata.timings, context.errors);
    context.currentAnimateTimings = timingAst;
    let styleAst;
    let styleMetadata = metadata.styles ? metadata.styles : style({});
    if (styleMetadata.type == AnimationMetadataType.Keyframes) {
      styleAst = this.visitKeyframes(styleMetadata, context);
    } else {
      let styleMetadata2 = metadata.styles;
      let isEmpty = false;
      if (!styleMetadata2) {
        isEmpty = true;
        const newStyleData = {};
        if (timingAst.easing) {
          newStyleData["easing"] = timingAst.easing;
        }
        styleMetadata2 = style(newStyleData);
      }
      context.currentTime += timingAst.duration + timingAst.delay;
      const _styleAst = this.visitStyle(styleMetadata2, context);
      _styleAst.isEmptyStep = isEmpty;
      styleAst = _styleAst;
    }
    context.currentAnimateTimings = null;
    return {
      type: AnimationMetadataType.Animate,
      timings: timingAst,
      style: styleAst,
      options: null
    };
  }
  visitStyle(metadata, context) {
    const ast = this._makeStyleAst(metadata, context);
    this._validateStyleAst(ast, context);
    return ast;
  }
  _makeStyleAst(metadata, context) {
    const styles = [];
    const metadataStyles = Array.isArray(metadata.styles) ? metadata.styles : [metadata.styles];
    for (let styleTuple of metadataStyles) {
      if (typeof styleTuple === "string") {
        if (styleTuple === AUTO_STYLE) {
          styles.push(styleTuple);
        } else {
          context.errors.push(invalidStyleValue(styleTuple));
        }
      } else {
        styles.push(new Map(Object.entries(styleTuple)));
      }
    }
    let containsDynamicStyles = false;
    let collectedEasing = null;
    styles.forEach((styleData) => {
      if (styleData instanceof Map) {
        if (styleData.has("easing")) {
          collectedEasing = styleData.get("easing");
          styleData.delete("easing");
        }
        if (!containsDynamicStyles) {
          for (let value of styleData.values()) {
            if (value.toString().indexOf(SUBSTITUTION_EXPR_START) >= 0) {
              containsDynamicStyles = true;
              break;
            }
          }
        }
      }
    });
    return {
      type: AnimationMetadataType.Style,
      styles,
      easing: collectedEasing,
      offset: metadata.offset,
      containsDynamicStyles,
      options: null
    };
  }
  _validateStyleAst(ast, context) {
    const timings = context.currentAnimateTimings;
    let endTime = context.currentTime;
    let startTime = context.currentTime;
    if (timings && startTime > 0) {
      startTime -= timings.duration + timings.delay;
    }
    ast.styles.forEach((tuple) => {
      if (typeof tuple === "string") return;
      tuple.forEach((value, prop) => {
        if (typeof ngDevMode === "undefined" || ngDevMode) {
          if (!this._driver.validateStyleProperty(prop)) {
            tuple.delete(prop);
            context.unsupportedCSSPropertiesFound.add(prop);
            return;
          }
        }
        const collectedStyles = context.collectedStyles.get(context.currentQuerySelector);
        const collectedEntry = collectedStyles.get(prop);
        let updateCollectedStyle = true;
        if (collectedEntry) {
          if (startTime != endTime && startTime >= collectedEntry.startTime && endTime <= collectedEntry.endTime) {
            context.errors.push(invalidParallelAnimation(prop, collectedEntry.startTime, collectedEntry.endTime, startTime, endTime));
            updateCollectedStyle = false;
          }
          startTime = collectedEntry.startTime;
        }
        if (updateCollectedStyle) {
          collectedStyles.set(prop, {
            startTime,
            endTime
          });
        }
        if (context.options) {
          validateStyleParams(value, context.options, context.errors);
        }
      });
    });
  }
  visitKeyframes(metadata, context) {
    const ast = {
      type: AnimationMetadataType.Keyframes,
      styles: [],
      options: null
    };
    if (!context.currentAnimateTimings) {
      context.errors.push(invalidKeyframes());
      return ast;
    }
    const MAX_KEYFRAME_OFFSET = 1;
    let totalKeyframesWithOffsets = 0;
    const offsets = [];
    let offsetsOutOfOrder = false;
    let keyframesOutOfRange = false;
    let previousOffset = 0;
    const keyframes = metadata.steps.map((styles) => {
      const style2 = this._makeStyleAst(styles, context);
      let offsetVal = style2.offset != null ? style2.offset : consumeOffset(style2.styles);
      let offset = 0;
      if (offsetVal != null) {
        totalKeyframesWithOffsets++;
        offset = style2.offset = offsetVal;
      }
      keyframesOutOfRange = keyframesOutOfRange || offset < 0 || offset > 1;
      offsetsOutOfOrder = offsetsOutOfOrder || offset < previousOffset;
      previousOffset = offset;
      offsets.push(offset);
      return style2;
    });
    if (keyframesOutOfRange) {
      context.errors.push(invalidOffset());
    }
    if (offsetsOutOfOrder) {
      context.errors.push(keyframeOffsetsOutOfOrder());
    }
    const length = metadata.steps.length;
    let generatedOffset = 0;
    if (totalKeyframesWithOffsets > 0 && totalKeyframesWithOffsets < length) {
      context.errors.push(keyframesMissingOffsets());
    } else if (totalKeyframesWithOffsets == 0) {
      generatedOffset = MAX_KEYFRAME_OFFSET / (length - 1);
    }
    const limit = length - 1;
    const currentTime = context.currentTime;
    const currentAnimateTimings = context.currentAnimateTimings;
    const animateDuration = currentAnimateTimings.duration;
    keyframes.forEach((kf, i) => {
      const offset = generatedOffset > 0 ? i == limit ? 1 : generatedOffset * i : offsets[i];
      const durationUpToThisFrame = offset * animateDuration;
      context.currentTime = currentTime + currentAnimateTimings.delay + durationUpToThisFrame;
      currentAnimateTimings.duration = durationUpToThisFrame;
      this._validateStyleAst(kf, context);
      kf.offset = offset;
      ast.styles.push(kf);
    });
    return ast;
  }
  visitReference(metadata, context) {
    return {
      type: AnimationMetadataType.Reference,
      animation: visitDslNode(this, normalizeAnimationEntry(metadata.animation), context),
      options: normalizeAnimationOptions(metadata.options)
    };
  }
  visitAnimateChild(metadata, context) {
    context.depCount++;
    return {
      type: AnimationMetadataType.AnimateChild,
      options: normalizeAnimationOptions(metadata.options)
    };
  }
  visitAnimateRef(metadata, context) {
    return {
      type: AnimationMetadataType.AnimateRef,
      animation: this.visitReference(metadata.animation, context),
      options: normalizeAnimationOptions(metadata.options)
    };
  }
  visitQuery(metadata, context) {
    const parentSelector = context.currentQuerySelector;
    const options = metadata.options || {};
    context.queryCount++;
    context.currentQuery = metadata;
    const [selector, includeSelf] = normalizeSelector(metadata.selector);
    context.currentQuerySelector = parentSelector.length ? parentSelector + " " + selector : selector;
    getOrSetDefaultValue(context.collectedStyles, context.currentQuerySelector, /* @__PURE__ */ new Map());
    const animation = visitDslNode(this, normalizeAnimationEntry(metadata.animation), context);
    context.currentQuery = null;
    context.currentQuerySelector = parentSelector;
    return {
      type: AnimationMetadataType.Query,
      selector,
      limit: options.limit || 0,
      optional: !!options.optional,
      includeSelf,
      animation,
      originalSelector: metadata.selector,
      options: normalizeAnimationOptions(metadata.options)
    };
  }
  visitStagger(metadata, context) {
    if (!context.currentQuery) {
      context.errors.push(invalidStagger());
    }
    const timings = metadata.timings === "full" ? {
      duration: 0,
      delay: 0,
      easing: "full"
    } : resolveTiming(metadata.timings, context.errors, true);
    return {
      type: AnimationMetadataType.Stagger,
      animation: visitDslNode(this, normalizeAnimationEntry(metadata.animation), context),
      timings,
      options: null
    };
  }
};
function normalizeSelector(selector) {
  const hasAmpersand = selector.split(/\s*,\s*/).find((token) => token == SELF_TOKEN) ? true : false;
  if (hasAmpersand) {
    selector = selector.replace(SELF_TOKEN_REGEX, "");
  }
  selector = selector.replace(/@\*/g, NG_TRIGGER_SELECTOR).replace(/@\w+/g, (match) => NG_TRIGGER_SELECTOR + "-" + match.slice(1)).replace(/:animating/g, NG_ANIMATING_SELECTOR);
  return [selector, hasAmpersand];
}
function normalizeParams(obj) {
  return obj ? __spreadValues({}, obj) : null;
}
var AnimationAstBuilderContext = class {
  errors;
  queryCount = 0;
  depCount = 0;
  currentTransition = null;
  currentQuery = null;
  currentQuerySelector = null;
  currentAnimateTimings = null;
  currentTime = 0;
  collectedStyles = /* @__PURE__ */ new Map();
  options = null;
  unsupportedCSSPropertiesFound = /* @__PURE__ */ new Set();
  constructor(errors) {
    this.errors = errors;
  }
};
function consumeOffset(styles) {
  if (typeof styles == "string") return null;
  let offset = null;
  if (Array.isArray(styles)) {
    styles.forEach((styleTuple) => {
      if (styleTuple instanceof Map && styleTuple.has("offset")) {
        const obj = styleTuple;
        offset = parseFloat(obj.get("offset"));
        obj.delete("offset");
      }
    });
  } else if (styles instanceof Map && styles.has("offset")) {
    const obj = styles;
    offset = parseFloat(obj.get("offset"));
    obj.delete("offset");
  }
  return offset;
}
function constructTimingAst(value, errors) {
  if (value.hasOwnProperty("duration")) {
    return value;
  }
  if (typeof value == "number") {
    const duration = resolveTiming(value, errors).duration;
    return makeTimingAst(duration, 0, "");
  }
  const strValue = value;
  const isDynamic = strValue.split(/\s+/).some((v) => v.charAt(0) == "{" && v.charAt(1) == "{");
  if (isDynamic) {
    const ast = makeTimingAst(0, 0, "");
    ast.dynamic = true;
    ast.strValue = strValue;
    return ast;
  }
  const timings = resolveTiming(strValue, errors);
  return makeTimingAst(timings.duration, timings.delay, timings.easing);
}
function normalizeAnimationOptions(options) {
  if (options) {
    options = __spreadValues({}, options);
    if (options["params"]) {
      options["params"] = normalizeParams(options["params"]);
    }
  } else {
    options = {};
  }
  return options;
}
function makeTimingAst(duration, delay, easing) {
  return {
    duration,
    delay,
    easing
  };
}
function createTimelineInstruction(element, keyframes, preStyleProps, postStyleProps, duration, delay, easing = null, subTimeline = false) {
  return {
    type: 1,
    element,
    keyframes,
    preStyleProps,
    postStyleProps,
    duration,
    delay,
    totalTime: duration + delay,
    easing,
    subTimeline
  };
}
var ElementInstructionMap = class {
  _map = /* @__PURE__ */ new Map();
  get(element) {
    return this._map.get(element) || [];
  }
  append(element, instructions) {
    let existingInstructions = this._map.get(element);
    if (!existingInstructions) {
      this._map.set(element, existingInstructions = []);
    }
    existingInstructions.push(...instructions);
  }
  has(element) {
    return this._map.has(element);
  }
  clear() {
    this._map.clear();
  }
};
var ONE_FRAME_IN_MILLISECONDS = 1;
var ENTER_TOKEN = ":enter";
var ENTER_TOKEN_REGEX = /* @__PURE__ */ new RegExp(ENTER_TOKEN, "g");
var LEAVE_TOKEN = ":leave";
var LEAVE_TOKEN_REGEX = /* @__PURE__ */ new RegExp(LEAVE_TOKEN, "g");
function buildAnimationTimelines(driver, rootElement, ast, enterClassName, leaveClassName, startingStyles = /* @__PURE__ */ new Map(), finalStyles = /* @__PURE__ */ new Map(), options, subInstructions, errors = []) {
  return new AnimationTimelineBuilderVisitor().buildKeyframes(driver, rootElement, ast, enterClassName, leaveClassName, startingStyles, finalStyles, options, subInstructions, errors);
}
var AnimationTimelineBuilderVisitor = class {
  buildKeyframes(driver, rootElement, ast, enterClassName, leaveClassName, startingStyles, finalStyles, options, subInstructions, errors = []) {
    subInstructions = subInstructions || new ElementInstructionMap();
    const context = new AnimationTimelineContext(driver, rootElement, subInstructions, enterClassName, leaveClassName, errors, []);
    context.options = options;
    const delay = options.delay ? resolveTimingValue(options.delay) : 0;
    context.currentTimeline.delayNextStep(delay);
    context.currentTimeline.setStyles([startingStyles], null, context.errors, options);
    visitDslNode(this, ast, context);
    const timelines = context.timelines.filter((timeline) => timeline.containsAnimation());
    if (timelines.length && finalStyles.size) {
      let lastRootTimeline;
      for (let i = timelines.length - 1; i >= 0; i--) {
        const timeline = timelines[i];
        if (timeline.element === rootElement) {
          lastRootTimeline = timeline;
          break;
        }
      }
      if (lastRootTimeline && !lastRootTimeline.allowOnlyTimelineStyles()) {
        lastRootTimeline.setStyles([finalStyles], null, context.errors, options);
      }
    }
    return timelines.length ? timelines.map((timeline) => timeline.buildKeyframes()) : [createTimelineInstruction(rootElement, [], [], [], 0, delay, "", false)];
  }
  visitTrigger(ast, context) {
  }
  visitState(ast, context) {
  }
  visitTransition(ast, context) {
  }
  visitAnimateChild(ast, context) {
    const elementInstructions = context.subInstructions.get(context.element);
    if (elementInstructions) {
      const innerContext = context.createSubContext(ast.options);
      const startTime = context.currentTimeline.currentTime;
      const endTime = this._visitSubInstructions(elementInstructions, innerContext, innerContext.options);
      if (startTime != endTime) {
        context.transformIntoNewTimeline(endTime);
      }
    }
    context.previousNode = ast;
  }
  visitAnimateRef(ast, context) {
    const innerContext = context.createSubContext(ast.options);
    innerContext.transformIntoNewTimeline();
    this._applyAnimationRefDelays([ast.options, ast.animation.options], context, innerContext);
    this.visitReference(ast.animation, innerContext);
    context.transformIntoNewTimeline(innerContext.currentTimeline.currentTime);
    context.previousNode = ast;
  }
  _applyAnimationRefDelays(animationsRefsOptions, context, innerContext) {
    for (const animationRefOptions of animationsRefsOptions) {
      const animationDelay = animationRefOptions?.delay;
      if (animationDelay) {
        const animationDelayValue = typeof animationDelay === "number" ? animationDelay : resolveTimingValue(interpolateParams(animationDelay, animationRefOptions?.params ?? {}, context.errors));
        innerContext.delayNextStep(animationDelayValue);
      }
    }
  }
  _visitSubInstructions(instructions, context, options) {
    const startTime = context.currentTimeline.currentTime;
    let furthestTime = startTime;
    const duration = options.duration != null ? resolveTimingValue(options.duration) : null;
    const delay = options.delay != null ? resolveTimingValue(options.delay) : null;
    if (duration !== 0) {
      instructions.forEach((instruction) => {
        const instructionTimings = context.appendInstructionToTimeline(instruction, duration, delay);
        furthestTime = Math.max(furthestTime, instructionTimings.duration + instructionTimings.delay);
      });
    }
    return furthestTime;
  }
  visitReference(ast, context) {
    context.updateOptions(ast.options, true);
    visitDslNode(this, ast.animation, context);
    context.previousNode = ast;
  }
  visitSequence(ast, context) {
    const subContextCount = context.subContextCount;
    let ctx = context;
    const options = ast.options;
    if (options && (options.params || options.delay)) {
      ctx = context.createSubContext(options);
      ctx.transformIntoNewTimeline();
      if (options.delay != null) {
        if (ctx.previousNode.type == AnimationMetadataType.Style) {
          ctx.currentTimeline.snapshotCurrentStyles();
          ctx.previousNode = DEFAULT_NOOP_PREVIOUS_NODE;
        }
        const delay = resolveTimingValue(options.delay);
        ctx.delayNextStep(delay);
      }
    }
    if (ast.steps.length) {
      ast.steps.forEach((s) => visitDslNode(this, s, ctx));
      ctx.currentTimeline.applyStylesToKeyframe();
      if (ctx.subContextCount > subContextCount) {
        ctx.transformIntoNewTimeline();
      }
    }
    context.previousNode = ast;
  }
  visitGroup(ast, context) {
    const innerTimelines = [];
    let furthestTime = context.currentTimeline.currentTime;
    const delay = ast.options && ast.options.delay ? resolveTimingValue(ast.options.delay) : 0;
    ast.steps.forEach((s) => {
      const innerContext = context.createSubContext(ast.options);
      if (delay) {
        innerContext.delayNextStep(delay);
      }
      visitDslNode(this, s, innerContext);
      furthestTime = Math.max(furthestTime, innerContext.currentTimeline.currentTime);
      innerTimelines.push(innerContext.currentTimeline);
    });
    innerTimelines.forEach((timeline) => context.currentTimeline.mergeTimelineCollectedStyles(timeline));
    context.transformIntoNewTimeline(furthestTime);
    context.previousNode = ast;
  }
  _visitTiming(ast, context) {
    if (ast.dynamic) {
      const strValue = ast.strValue;
      const timingValue = context.params ? interpolateParams(strValue, context.params, context.errors) : strValue;
      return resolveTiming(timingValue, context.errors);
    } else {
      return {
        duration: ast.duration,
        delay: ast.delay,
        easing: ast.easing
      };
    }
  }
  visitAnimate(ast, context) {
    const timings = context.currentAnimateTimings = this._visitTiming(ast.timings, context);
    const timeline = context.currentTimeline;
    if (timings.delay) {
      context.incrementTime(timings.delay);
      timeline.snapshotCurrentStyles();
    }
    const style2 = ast.style;
    if (style2.type == AnimationMetadataType.Keyframes) {
      this.visitKeyframes(style2, context);
    } else {
      context.incrementTime(timings.duration);
      this.visitStyle(style2, context);
      timeline.applyStylesToKeyframe();
    }
    context.currentAnimateTimings = null;
    context.previousNode = ast;
  }
  visitStyle(ast, context) {
    const timeline = context.currentTimeline;
    const timings = context.currentAnimateTimings;
    if (!timings && timeline.hasCurrentStyleProperties()) {
      timeline.forwardFrame();
    }
    const easing = timings && timings.easing || ast.easing;
    if (ast.isEmptyStep) {
      timeline.applyEmptyStep(easing);
    } else {
      timeline.setStyles(ast.styles, easing, context.errors, context.options);
    }
    context.previousNode = ast;
  }
  visitKeyframes(ast, context) {
    const currentAnimateTimings = context.currentAnimateTimings;
    const startTime = context.currentTimeline.duration;
    const duration = currentAnimateTimings.duration;
    const innerContext = context.createSubContext();
    const innerTimeline = innerContext.currentTimeline;
    innerTimeline.easing = currentAnimateTimings.easing;
    ast.styles.forEach((step) => {
      const offset = step.offset || 0;
      innerTimeline.forwardTime(offset * duration);
      innerTimeline.setStyles(step.styles, step.easing, context.errors, context.options);
      innerTimeline.applyStylesToKeyframe();
    });
    context.currentTimeline.mergeTimelineCollectedStyles(innerTimeline);
    context.transformIntoNewTimeline(startTime + duration);
    context.previousNode = ast;
  }
  visitQuery(ast, context) {
    const startTime = context.currentTimeline.currentTime;
    const options = ast.options || {};
    const delay = options.delay ? resolveTimingValue(options.delay) : 0;
    if (delay && (context.previousNode.type === AnimationMetadataType.Style || startTime == 0 && context.currentTimeline.hasCurrentStyleProperties())) {
      context.currentTimeline.snapshotCurrentStyles();
      context.previousNode = DEFAULT_NOOP_PREVIOUS_NODE;
    }
    let furthestTime = startTime;
    const elms = context.invokeQuery(ast.selector, ast.originalSelector, ast.limit, ast.includeSelf, options.optional ? true : false, context.errors);
    context.currentQueryTotal = elms.length;
    let sameElementTimeline = null;
    elms.forEach((element, i) => {
      context.currentQueryIndex = i;
      const innerContext = context.createSubContext(ast.options, element);
      if (delay) {
        innerContext.delayNextStep(delay);
      }
      if (element === context.element) {
        sameElementTimeline = innerContext.currentTimeline;
      }
      visitDslNode(this, ast.animation, innerContext);
      innerContext.currentTimeline.applyStylesToKeyframe();
      const endTime = innerContext.currentTimeline.currentTime;
      furthestTime = Math.max(furthestTime, endTime);
    });
    context.currentQueryIndex = 0;
    context.currentQueryTotal = 0;
    context.transformIntoNewTimeline(furthestTime);
    if (sameElementTimeline) {
      context.currentTimeline.mergeTimelineCollectedStyles(sameElementTimeline);
      context.currentTimeline.snapshotCurrentStyles();
    }
    context.previousNode = ast;
  }
  visitStagger(ast, context) {
    const parentContext = context.parentContext;
    const tl = context.currentTimeline;
    const timings = ast.timings;
    const duration = Math.abs(timings.duration);
    const maxTime = duration * (context.currentQueryTotal - 1);
    let delay = duration * context.currentQueryIndex;
    let staggerTransformer = timings.duration < 0 ? "reverse" : timings.easing;
    switch (staggerTransformer) {
      case "reverse":
        delay = maxTime - delay;
        break;
      case "full":
        delay = parentContext.currentStaggerTime;
        break;
    }
    const timeline = context.currentTimeline;
    if (delay) {
      timeline.delayNextStep(delay);
    }
    const startingTime = timeline.currentTime;
    visitDslNode(this, ast.animation, context);
    context.previousNode = ast;
    parentContext.currentStaggerTime = tl.currentTime - startingTime + (tl.startTime - parentContext.currentTimeline.startTime);
  }
};
var DEFAULT_NOOP_PREVIOUS_NODE = {};
var AnimationTimelineContext = class _AnimationTimelineContext {
  _driver;
  element;
  subInstructions;
  _enterClassName;
  _leaveClassName;
  errors;
  timelines;
  parentContext = null;
  currentTimeline;
  currentAnimateTimings = null;
  previousNode = DEFAULT_NOOP_PREVIOUS_NODE;
  subContextCount = 0;
  options = {};
  currentQueryIndex = 0;
  currentQueryTotal = 0;
  currentStaggerTime = 0;
  constructor(_driver, element, subInstructions, _enterClassName, _leaveClassName, errors, timelines, initialTimeline) {
    this._driver = _driver;
    this.element = element;
    this.subInstructions = subInstructions;
    this._enterClassName = _enterClassName;
    this._leaveClassName = _leaveClassName;
    this.errors = errors;
    this.timelines = timelines;
    this.currentTimeline = initialTimeline || new TimelineBuilder(this._driver, element, 0);
    timelines.push(this.currentTimeline);
  }
  get params() {
    return this.options.params;
  }
  updateOptions(options, skipIfExists) {
    if (!options) return;
    const newOptions = options;
    let optionsToUpdate = this.options;
    if (newOptions.duration != null) {
      optionsToUpdate.duration = resolveTimingValue(newOptions.duration);
    }
    if (newOptions.delay != null) {
      optionsToUpdate.delay = resolveTimingValue(newOptions.delay);
    }
    const newParams = newOptions.params;
    if (newParams) {
      let paramsToUpdate = optionsToUpdate.params;
      if (!paramsToUpdate) {
        paramsToUpdate = this.options.params = {};
      }
      Object.keys(newParams).forEach((name) => {
        if (!skipIfExists || !paramsToUpdate.hasOwnProperty(name)) {
          paramsToUpdate[name] = interpolateParams(newParams[name], paramsToUpdate, this.errors);
        }
      });
    }
  }
  _copyOptions() {
    const options = {};
    if (this.options) {
      const oldParams = this.options.params;
      if (oldParams) {
        const params = options["params"] = {};
        Object.keys(oldParams).forEach((name) => {
          params[name] = oldParams[name];
        });
      }
    }
    return options;
  }
  createSubContext(options = null, element, newTime) {
    const target = element || this.element;
    const context = new _AnimationTimelineContext(this._driver, target, this.subInstructions, this._enterClassName, this._leaveClassName, this.errors, this.timelines, this.currentTimeline.fork(target, newTime || 0));
    context.previousNode = this.previousNode;
    context.currentAnimateTimings = this.currentAnimateTimings;
    context.options = this._copyOptions();
    context.updateOptions(options);
    context.currentQueryIndex = this.currentQueryIndex;
    context.currentQueryTotal = this.currentQueryTotal;
    context.parentContext = this;
    this.subContextCount++;
    return context;
  }
  transformIntoNewTimeline(newTime) {
    this.previousNode = DEFAULT_NOOP_PREVIOUS_NODE;
    this.currentTimeline = this.currentTimeline.fork(this.element, newTime);
    this.timelines.push(this.currentTimeline);
    return this.currentTimeline;
  }
  appendInstructionToTimeline(instruction, duration, delay) {
    const updatedTimings = {
      duration: duration != null ? duration : instruction.duration,
      delay: this.currentTimeline.currentTime + (delay != null ? delay : 0) + instruction.delay,
      easing: ""
    };
    const builder = new SubTimelineBuilder(this._driver, instruction.element, instruction.keyframes, instruction.preStyleProps, instruction.postStyleProps, updatedTimings, instruction.stretchStartingKeyframe);
    this.timelines.push(builder);
    return updatedTimings;
  }
  incrementTime(time) {
    this.currentTimeline.forwardTime(this.currentTimeline.duration + time);
  }
  delayNextStep(delay) {
    if (delay > 0) {
      this.currentTimeline.delayNextStep(delay);
    }
  }
  invokeQuery(selector, originalSelector, limit, includeSelf, optional, errors) {
    let results = [];
    if (includeSelf) {
      results.push(this.element);
    }
    if (selector.length > 0) {
      selector = selector.replace(ENTER_TOKEN_REGEX, "." + this._enterClassName);
      selector = selector.replace(LEAVE_TOKEN_REGEX, "." + this._leaveClassName);
      const multi = limit != 1;
      let elements = this._driver.query(this.element, selector, multi);
      if (limit !== 0) {
        elements = limit < 0 ? elements.slice(elements.length + limit, elements.length) : elements.slice(0, limit);
      }
      results.push(...elements);
    }
    if (!optional && results.length == 0) {
      errors.push(invalidQuery(originalSelector));
    }
    return results;
  }
};
var TimelineBuilder = class _TimelineBuilder {
  _driver;
  element;
  startTime;
  _elementTimelineStylesLookup;
  duration = 0;
  easing = null;
  _previousKeyframe = /* @__PURE__ */ new Map();
  _currentKeyframe = /* @__PURE__ */ new Map();
  _keyframes = /* @__PURE__ */ new Map();
  _styleSummary = /* @__PURE__ */ new Map();
  _localTimelineStyles = /* @__PURE__ */ new Map();
  _globalTimelineStyles;
  _pendingStyles = /* @__PURE__ */ new Map();
  _backFill = /* @__PURE__ */ new Map();
  _currentEmptyStepKeyframe = null;
  constructor(_driver, element, startTime, _elementTimelineStylesLookup) {
    this._driver = _driver;
    this.element = element;
    this.startTime = startTime;
    this._elementTimelineStylesLookup = _elementTimelineStylesLookup;
    if (!this._elementTimelineStylesLookup) {
      this._elementTimelineStylesLookup = /* @__PURE__ */ new Map();
    }
    this._globalTimelineStyles = this._elementTimelineStylesLookup.get(element);
    if (!this._globalTimelineStyles) {
      this._globalTimelineStyles = this._localTimelineStyles;
      this._elementTimelineStylesLookup.set(element, this._localTimelineStyles);
    }
    this._loadKeyframe();
  }
  containsAnimation() {
    switch (this._keyframes.size) {
      case 0:
        return false;
      case 1:
        return this.hasCurrentStyleProperties();
      default:
        return true;
    }
  }
  hasCurrentStyleProperties() {
    return this._currentKeyframe.size > 0;
  }
  get currentTime() {
    return this.startTime + this.duration;
  }
  delayNextStep(delay) {
    const hasPreStyleStep = this._keyframes.size === 1 && this._pendingStyles.size;
    if (this.duration || hasPreStyleStep) {
      this.forwardTime(this.currentTime + delay);
      if (hasPreStyleStep) {
        this.snapshotCurrentStyles();
      }
    } else {
      this.startTime += delay;
    }
  }
  fork(element, currentTime) {
    this.applyStylesToKeyframe();
    return new _TimelineBuilder(this._driver, element, currentTime || this.currentTime, this._elementTimelineStylesLookup);
  }
  _loadKeyframe() {
    if (this._currentKeyframe) {
      this._previousKeyframe = this._currentKeyframe;
    }
    this._currentKeyframe = this._keyframes.get(this.duration);
    if (!this._currentKeyframe) {
      this._currentKeyframe = /* @__PURE__ */ new Map();
      this._keyframes.set(this.duration, this._currentKeyframe);
    }
  }
  forwardFrame() {
    this.duration += ONE_FRAME_IN_MILLISECONDS;
    this._loadKeyframe();
  }
  forwardTime(time) {
    this.applyStylesToKeyframe();
    this.duration = time;
    this._loadKeyframe();
  }
  _updateStyle(prop, value) {
    this._localTimelineStyles.set(prop, value);
    this._globalTimelineStyles.set(prop, value);
    this._styleSummary.set(prop, {
      time: this.currentTime,
      value
    });
  }
  allowOnlyTimelineStyles() {
    return this._currentEmptyStepKeyframe !== this._currentKeyframe;
  }
  applyEmptyStep(easing) {
    if (easing) {
      this._previousKeyframe.set("easing", easing);
    }
    for (let [prop, value] of this._globalTimelineStyles) {
      this._backFill.set(prop, value || AUTO_STYLE);
      this._currentKeyframe.set(prop, AUTO_STYLE);
    }
    this._currentEmptyStepKeyframe = this._currentKeyframe;
  }
  setStyles(input, easing, errors, options) {
    if (easing) {
      this._previousKeyframe.set("easing", easing);
    }
    const params = options && options.params || {};
    const styles = flattenStyles(input, this._globalTimelineStyles);
    for (let [prop, value] of styles) {
      const val = interpolateParams(value, params, errors);
      this._pendingStyles.set(prop, val);
      if (!this._localTimelineStyles.has(prop)) {
        this._backFill.set(prop, this._globalTimelineStyles.get(prop) ?? AUTO_STYLE);
      }
      this._updateStyle(prop, val);
    }
  }
  applyStylesToKeyframe() {
    if (this._pendingStyles.size == 0) return;
    this._pendingStyles.forEach((val, prop) => {
      this._currentKeyframe.set(prop, val);
    });
    this._pendingStyles.clear();
    this._localTimelineStyles.forEach((val, prop) => {
      if (!this._currentKeyframe.has(prop)) {
        this._currentKeyframe.set(prop, val);
      }
    });
  }
  snapshotCurrentStyles() {
    for (let [prop, val] of this._localTimelineStyles) {
      this._pendingStyles.set(prop, val);
      this._updateStyle(prop, val);
    }
  }
  getFinalKeyframe() {
    return this._keyframes.get(this.duration);
  }
  get properties() {
    const properties = [];
    for (let prop in this._currentKeyframe) {
      properties.push(prop);
    }
    return properties;
  }
  mergeTimelineCollectedStyles(timeline) {
    timeline._styleSummary.forEach((details1, prop) => {
      const details0 = this._styleSummary.get(prop);
      if (!details0 || details1.time > details0.time) {
        this._updateStyle(prop, details1.value);
      }
    });
  }
  buildKeyframes() {
    this.applyStylesToKeyframe();
    const preStyleProps = /* @__PURE__ */ new Set();
    const postStyleProps = /* @__PURE__ */ new Set();
    const isEmpty = this._keyframes.size === 1 && this.duration === 0;
    let finalKeyframes = [];
    this._keyframes.forEach((keyframe, time) => {
      const finalKeyframe = new Map([...this._backFill, ...keyframe]);
      finalKeyframe.forEach((value, prop) => {
        if (value === \u0275PRE_STYLE) {
          preStyleProps.add(prop);
        } else if (value === AUTO_STYLE) {
          postStyleProps.add(prop);
        }
      });
      if (!isEmpty) {
        finalKeyframe.set("offset", time / this.duration);
      }
      finalKeyframes.push(finalKeyframe);
    });
    const preProps = [...preStyleProps.values()];
    const postProps = [...postStyleProps.values()];
    if (isEmpty) {
      const kf0 = finalKeyframes[0];
      const kf1 = new Map(kf0);
      kf0.set("offset", 0);
      kf1.set("offset", 1);
      finalKeyframes = [kf0, kf1];
    }
    return createTimelineInstruction(this.element, finalKeyframes, preProps, postProps, this.duration, this.startTime, this.easing, false);
  }
};
var SubTimelineBuilder = class extends TimelineBuilder {
  keyframes;
  preStyleProps;
  postStyleProps;
  _stretchStartingKeyframe;
  timings;
  constructor(driver, element, keyframes, preStyleProps, postStyleProps, timings, _stretchStartingKeyframe = false) {
    super(driver, element, timings.delay);
    this.keyframes = keyframes;
    this.preStyleProps = preStyleProps;
    this.postStyleProps = postStyleProps;
    this._stretchStartingKeyframe = _stretchStartingKeyframe;
    this.timings = {
      duration: timings.duration,
      delay: timings.delay,
      easing: timings.easing
    };
  }
  containsAnimation() {
    return this.keyframes.length > 1;
  }
  buildKeyframes() {
    let keyframes = this.keyframes;
    let {
      delay,
      duration,
      easing
    } = this.timings;
    if (this._stretchStartingKeyframe && delay) {
      const newKeyframes = [];
      const totalTime = duration + delay;
      const startingGap = delay / totalTime;
      const newFirstKeyframe = new Map(keyframes[0]);
      newFirstKeyframe.set("offset", 0);
      newKeyframes.push(newFirstKeyframe);
      const oldFirstKeyframe = new Map(keyframes[0]);
      oldFirstKeyframe.set("offset", roundOffset(startingGap));
      newKeyframes.push(oldFirstKeyframe);
      const limit = keyframes.length - 1;
      for (let i = 1; i <= limit; i++) {
        let kf = new Map(keyframes[i]);
        const oldOffset = kf.get("offset");
        const timeAtKeyframe = delay + oldOffset * duration;
        kf.set("offset", roundOffset(timeAtKeyframe / totalTime));
        newKeyframes.push(kf);
      }
      duration = totalTime;
      delay = 0;
      easing = "";
      keyframes = newKeyframes;
    }
    return createTimelineInstruction(this.element, keyframes, this.preStyleProps, this.postStyleProps, duration, delay, easing, true);
  }
};
function roundOffset(offset, decimalPoints = 3) {
  const mult = Math.pow(10, decimalPoints - 1);
  return Math.round(offset * mult) / mult;
}
function flattenStyles(input, allStyles) {
  const styles = /* @__PURE__ */ new Map();
  let allProperties;
  input.forEach((token) => {
    if (token === "*") {
      allProperties ??= allStyles.keys();
      for (let prop of allProperties) {
        styles.set(prop, AUTO_STYLE);
      }
    } else {
      for (let [prop, val] of token) {
        styles.set(prop, val);
      }
    }
  });
  return styles;
}
function createTransitionInstruction(element, triggerName, fromState, toState, isRemovalTransition, fromStyles, toStyles, timelines, queriedElements, preStyleProps, postStyleProps, totalTime, errors) {
  return {
    type: 0,
    element,
    triggerName,
    isRemovalTransition,
    fromState,
    fromStyles,
    toState,
    toStyles,
    timelines,
    queriedElements,
    preStyleProps,
    postStyleProps,
    totalTime,
    errors
  };
}
var EMPTY_OBJECT = {};
var AnimationTransitionFactory = class {
  _triggerName;
  ast;
  _stateStyles;
  constructor(_triggerName, ast, _stateStyles) {
    this._triggerName = _triggerName;
    this.ast = ast;
    this._stateStyles = _stateStyles;
  }
  match(currentState, nextState, element, params) {
    return oneOrMoreTransitionsMatch(this.ast.matchers, currentState, nextState, element, params);
  }
  buildStyles(stateName, params, errors) {
    let styler = this._stateStyles.get("*");
    if (stateName !== void 0) {
      styler = this._stateStyles.get(stateName?.toString()) || styler;
    }
    return styler ? styler.buildStyles(params, errors) : /* @__PURE__ */ new Map();
  }
  build(driver, element, currentState, nextState, enterClassName, leaveClassName, currentOptions, nextOptions, subInstructions, skipAstBuild) {
    const errors = [];
    const transitionAnimationParams = this.ast.options && this.ast.options.params || EMPTY_OBJECT;
    const currentAnimationParams = currentOptions && currentOptions.params || EMPTY_OBJECT;
    const currentStateStyles = this.buildStyles(currentState, currentAnimationParams, errors);
    const nextAnimationParams = nextOptions && nextOptions.params || EMPTY_OBJECT;
    const nextStateStyles = this.buildStyles(nextState, nextAnimationParams, errors);
    const queriedElements = /* @__PURE__ */ new Set();
    const preStyleMap = /* @__PURE__ */ new Map();
    const postStyleMap = /* @__PURE__ */ new Map();
    const isRemoval = nextState === "void";
    const animationOptions = {
      params: applyParamDefaults(nextAnimationParams, transitionAnimationParams),
      delay: this.ast.options?.delay
    };
    const timelines = skipAstBuild ? [] : buildAnimationTimelines(driver, element, this.ast.animation, enterClassName, leaveClassName, currentStateStyles, nextStateStyles, animationOptions, subInstructions, errors);
    let totalTime = 0;
    timelines.forEach((tl) => {
      totalTime = Math.max(tl.duration + tl.delay, totalTime);
    });
    if (errors.length) {
      return createTransitionInstruction(element, this._triggerName, currentState, nextState, isRemoval, currentStateStyles, nextStateStyles, [], [], preStyleMap, postStyleMap, totalTime, errors);
    }
    timelines.forEach((tl) => {
      const elm = tl.element;
      const preProps = getOrSetDefaultValue(preStyleMap, elm, /* @__PURE__ */ new Set());
      tl.preStyleProps.forEach((prop) => preProps.add(prop));
      const postProps = getOrSetDefaultValue(postStyleMap, elm, /* @__PURE__ */ new Set());
      tl.postStyleProps.forEach((prop) => postProps.add(prop));
      if (elm !== element) {
        queriedElements.add(elm);
      }
    });
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      checkNonAnimatableInTimelines(timelines, this._triggerName, driver);
    }
    return createTransitionInstruction(element, this._triggerName, currentState, nextState, isRemoval, currentStateStyles, nextStateStyles, timelines, [...queriedElements.values()], preStyleMap, postStyleMap, totalTime);
  }
};
function checkNonAnimatableInTimelines(timelines, triggerName, driver) {
  if (!driver.validateAnimatableStyleProperty) {
    return;
  }
  const allowedNonAnimatableProps = /* @__PURE__ */ new Set([
    // 'easing' is a utility/synthetic prop we use to represent
    // easing functions, it represents a property of the animation
    // which is not animatable but different values can be used
    // in different steps
    "easing"
  ]);
  const invalidNonAnimatableProps = /* @__PURE__ */ new Set();
  timelines.forEach(({
    keyframes
  }) => {
    const nonAnimatablePropsInitialValues = /* @__PURE__ */ new Map();
    keyframes.forEach((keyframe) => {
      const entriesToCheck = Array.from(keyframe.entries()).filter(([prop]) => !allowedNonAnimatableProps.has(prop));
      for (const [prop, value] of entriesToCheck) {
        if (!driver.validateAnimatableStyleProperty(prop)) {
          if (nonAnimatablePropsInitialValues.has(prop) && !invalidNonAnimatableProps.has(prop)) {
            const propInitialValue = nonAnimatablePropsInitialValues.get(prop);
            if (propInitialValue !== value) {
              invalidNonAnimatableProps.add(prop);
            }
          } else {
            nonAnimatablePropsInitialValues.set(prop, value);
          }
        }
      }
    });
  });
  if (invalidNonAnimatableProps.size > 0) {
    console.warn(`Warning: The animation trigger "${triggerName}" is attempting to animate the following not animatable properties: ` + Array.from(invalidNonAnimatableProps).join(", ") + "\n(to check the list of all animatable properties visit https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties)");
  }
}
function oneOrMoreTransitionsMatch(matchFns, currentState, nextState, element, params) {
  return matchFns.some((fn) => fn(currentState, nextState, element, params));
}
function applyParamDefaults(userParams, defaults) {
  const result = __spreadValues({}, defaults);
  Object.entries(userParams).forEach(([key, value]) => {
    if (value != null) {
      result[key] = value;
    }
  });
  return result;
}
var AnimationStateStyles = class {
  styles;
  defaultParams;
  normalizer;
  constructor(styles, defaultParams, normalizer) {
    this.styles = styles;
    this.defaultParams = defaultParams;
    this.normalizer = normalizer;
  }
  buildStyles(params, errors) {
    const finalStyles = /* @__PURE__ */ new Map();
    const combinedParams = applyParamDefaults(params, this.defaultParams);
    this.styles.styles.forEach((value) => {
      if (typeof value !== "string") {
        value.forEach((val, prop) => {
          if (val) {
            val = interpolateParams(val, combinedParams, errors);
          }
          const normalizedProp = this.normalizer.normalizePropertyName(prop, errors);
          val = this.normalizer.normalizeStyleValue(prop, normalizedProp, val, errors);
          finalStyles.set(prop, val);
        });
      }
    });
    return finalStyles;
  }
};
function buildTrigger(name, ast, normalizer) {
  return new AnimationTrigger(name, ast, normalizer);
}
var AnimationTrigger = class {
  name;
  ast;
  _normalizer;
  transitionFactories = [];
  fallbackTransition;
  states = /* @__PURE__ */ new Map();
  constructor(name, ast, _normalizer) {
    this.name = name;
    this.ast = ast;
    this._normalizer = _normalizer;
    ast.states.forEach((ast2) => {
      const defaultParams = ast2.options && ast2.options.params || {};
      this.states.set(ast2.name, new AnimationStateStyles(ast2.style, defaultParams, _normalizer));
    });
    balanceProperties(this.states, "true", "1");
    balanceProperties(this.states, "false", "0");
    ast.transitions.forEach((ast2) => {
      this.transitionFactories.push(new AnimationTransitionFactory(name, ast2, this.states));
    });
    this.fallbackTransition = createFallbackTransition(name, this.states);
  }
  get containsQueries() {
    return this.ast.queryCount > 0;
  }
  matchTransition(currentState, nextState, element, params) {
    const entry = this.transitionFactories.find((f) => f.match(currentState, nextState, element, params));
    return entry || null;
  }
  matchStyles(currentState, params, errors) {
    return this.fallbackTransition.buildStyles(currentState, params, errors);
  }
};
function createFallbackTransition(triggerName, states, normalizer) {
  const matchers = [(fromState, toState) => true];
  const animation = {
    type: AnimationMetadataType.Sequence,
    steps: [],
    options: null
  };
  const transition = {
    type: AnimationMetadataType.Transition,
    animation,
    matchers,
    options: null,
    queryCount: 0,
    depCount: 0
  };
  return new AnimationTransitionFactory(triggerName, transition, states);
}
function balanceProperties(stateMap, key1, key2) {
  if (stateMap.has(key1)) {
    if (!stateMap.has(key2)) {
      stateMap.set(key2, stateMap.get(key1));
    }
  } else if (stateMap.has(key2)) {
    stateMap.set(key1, stateMap.get(key2));
  }
}
var EMPTY_INSTRUCTION_MAP = /* @__PURE__ */ new ElementInstructionMap();
var TimelineAnimationEngine = class {
  bodyNode;
  _driver;
  _normalizer;
  _animations = /* @__PURE__ */ new Map();
  _playersById = /* @__PURE__ */ new Map();
  players = [];
  constructor(bodyNode, _driver, _normalizer) {
    this.bodyNode = bodyNode;
    this._driver = _driver;
    this._normalizer = _normalizer;
  }
  register(id, metadata) {
    const errors = [];
    const warnings = [];
    const ast = buildAnimationAst(this._driver, metadata, errors, warnings);
    if (errors.length) {
      throw registerFailed(errors);
    } else {
      if (typeof ngDevMode === "undefined" || ngDevMode) {
        if (warnings.length) {
          warnRegister(warnings);
        }
      }
      this._animations.set(id, ast);
    }
  }
  _buildPlayer(i, preStyles, postStyles) {
    const element = i.element;
    const keyframes = normalizeKeyframes$1(this._normalizer, i.keyframes, preStyles, postStyles);
    return this._driver.animate(element, keyframes, i.duration, i.delay, i.easing, [], true);
  }
  create(id, element, options = {}) {
    const errors = [];
    const ast = this._animations.get(id);
    let instructions;
    const autoStylesMap = /* @__PURE__ */ new Map();
    if (ast) {
      instructions = buildAnimationTimelines(this._driver, element, ast, ENTER_CLASSNAME, LEAVE_CLASSNAME, /* @__PURE__ */ new Map(), /* @__PURE__ */ new Map(), options, EMPTY_INSTRUCTION_MAP, errors);
      instructions.forEach((inst) => {
        const styles = getOrSetDefaultValue(autoStylesMap, inst.element, /* @__PURE__ */ new Map());
        inst.postStyleProps.forEach((prop) => styles.set(prop, null));
      });
    } else {
      errors.push(missingOrDestroyedAnimation());
      instructions = [];
    }
    if (errors.length) {
      throw createAnimationFailed(errors);
    }
    autoStylesMap.forEach((styles, element2) => {
      styles.forEach((_, prop) => {
        styles.set(prop, this._driver.computeStyle(element2, prop, AUTO_STYLE));
      });
    });
    const players = instructions.map((i) => {
      const styles = autoStylesMap.get(i.element);
      return this._buildPlayer(i, /* @__PURE__ */ new Map(), styles);
    });
    const player = optimizeGroupPlayer(players);
    this._playersById.set(id, player);
    player.onDestroy(() => this.destroy(id));
    this.players.push(player);
    return player;
  }
  destroy(id) {
    const player = this._getPlayer(id);
    player.destroy();
    this._playersById.delete(id);
    const index = this.players.indexOf(player);
    if (index >= 0) {
      this.players.splice(index, 1);
    }
  }
  _getPlayer(id) {
    const player = this._playersById.get(id);
    if (!player) {
      throw missingPlayer(id);
    }
    return player;
  }
  listen(id, element, eventName, callback) {
    const baseEvent = makeAnimationEvent(element, "", "", "");
    listenOnPlayer(this._getPlayer(id), eventName, baseEvent, callback);
    return () => {
    };
  }
  command(id, element, command, args) {
    if (command == "register") {
      this.register(id, args[0]);
      return;
    }
    if (command == "create") {
      const options = args[0] || {};
      this.create(id, element, options);
      return;
    }
    const player = this._getPlayer(id);
    switch (command) {
      case "play":
        player.play();
        break;
      case "pause":
        player.pause();
        break;
      case "reset":
        player.reset();
        break;
      case "restart":
        player.restart();
        break;
      case "finish":
        player.finish();
        break;
      case "init":
        player.init();
        break;
      case "setPosition":
        player.setPosition(parseFloat(args[0]));
        break;
      case "destroy":
        this.destroy(id);
        break;
    }
  }
};
var QUEUED_CLASSNAME = "ng-animate-queued";
var QUEUED_SELECTOR = ".ng-animate-queued";
var DISABLED_CLASSNAME = "ng-animate-disabled";
var DISABLED_SELECTOR = ".ng-animate-disabled";
var STAR_CLASSNAME = "ng-star-inserted";
var STAR_SELECTOR = ".ng-star-inserted";
var EMPTY_PLAYER_ARRAY = [];
var NULL_REMOVAL_STATE = {
  namespaceId: "",
  setForRemoval: false,
  setForMove: false,
  hasAnimation: false,
  removedBeforeQueried: false
};
var NULL_REMOVED_QUERIED_STATE = {
  namespaceId: "",
  setForMove: false,
  setForRemoval: false,
  hasAnimation: false,
  removedBeforeQueried: true
};
var REMOVAL_FLAG = "__ng_removed";
var StateValue = class {
  namespaceId;
  value;
  options;
  get params() {
    return this.options.params;
  }
  constructor(input, namespaceId = "") {
    this.namespaceId = namespaceId;
    const isObj = input && input.hasOwnProperty("value");
    const value = isObj ? input["value"] : input;
    this.value = normalizeTriggerValue(value);
    if (isObj) {
      const _a = input, {
        value: value2
      } = _a, options = __objRest(_a, [
        "value"
      ]);
      this.options = options;
    } else {
      this.options = {};
    }
    if (!this.options.params) {
      this.options.params = {};
    }
  }
  absorbOptions(options) {
    const newParams = options.params;
    if (newParams) {
      const oldParams = this.options.params;
      Object.keys(newParams).forEach((prop) => {
        if (oldParams[prop] == null) {
          oldParams[prop] = newParams[prop];
        }
      });
    }
  }
};
var VOID_VALUE = "void";
var DEFAULT_STATE_VALUE = /* @__PURE__ */ new StateValue(VOID_VALUE);
var AnimationTransitionNamespace = class {
  id;
  hostElement;
  _engine;
  players = [];
  _triggers = /* @__PURE__ */ new Map();
  _queue = [];
  _elementListeners = /* @__PURE__ */ new Map();
  _hostClassName;
  constructor(id, hostElement, _engine) {
    this.id = id;
    this.hostElement = hostElement;
    this._engine = _engine;
    this._hostClassName = "ng-tns-" + id;
    addClass(hostElement, this._hostClassName);
  }
  listen(element, name, phase, callback) {
    if (!this._triggers.has(name)) {
      throw missingTrigger(phase, name);
    }
    if (phase == null || phase.length == 0) {
      throw missingEvent(name);
    }
    if (!isTriggerEventValid(phase)) {
      throw unsupportedTriggerEvent(phase, name);
    }
    const listeners = getOrSetDefaultValue(this._elementListeners, element, []);
    const data = {
      name,
      phase,
      callback
    };
    listeners.push(data);
    const triggersWithStates = getOrSetDefaultValue(this._engine.statesByElement, element, /* @__PURE__ */ new Map());
    if (!triggersWithStates.has(name)) {
      addClass(element, NG_TRIGGER_CLASSNAME);
      addClass(element, NG_TRIGGER_CLASSNAME + "-" + name);
      triggersWithStates.set(name, DEFAULT_STATE_VALUE);
    }
    return () => {
      this._engine.afterFlush(() => {
        const index = listeners.indexOf(data);
        if (index >= 0) {
          listeners.splice(index, 1);
        }
        if (!this._triggers.has(name)) {
          triggersWithStates.delete(name);
        }
      });
    };
  }
  register(name, ast) {
    if (this._triggers.has(name)) {
      return false;
    } else {
      this._triggers.set(name, ast);
      return true;
    }
  }
  _getTrigger(name) {
    const trigger = this._triggers.get(name);
    if (!trigger) {
      throw unregisteredTrigger(name);
    }
    return trigger;
  }
  trigger(element, triggerName, value, defaultToFallback = true) {
    const trigger = this._getTrigger(triggerName);
    const player = new TransitionAnimationPlayer(this.id, triggerName, element);
    let triggersWithStates = this._engine.statesByElement.get(element);
    if (!triggersWithStates) {
      addClass(element, NG_TRIGGER_CLASSNAME);
      addClass(element, NG_TRIGGER_CLASSNAME + "-" + triggerName);
      this._engine.statesByElement.set(element, triggersWithStates = /* @__PURE__ */ new Map());
    }
    let fromState = triggersWithStates.get(triggerName);
    const toState = new StateValue(value, this.id);
    const isObj = value && value.hasOwnProperty("value");
    if (!isObj && fromState) {
      toState.absorbOptions(fromState.options);
    }
    triggersWithStates.set(triggerName, toState);
    if (!fromState) {
      fromState = DEFAULT_STATE_VALUE;
    }
    const isRemoval = toState.value === VOID_VALUE;
    if (!isRemoval && fromState.value === toState.value) {
      if (!objEquals(fromState.params, toState.params)) {
        const errors = [];
        const fromStyles = trigger.matchStyles(fromState.value, fromState.params, errors);
        const toStyles = trigger.matchStyles(toState.value, toState.params, errors);
        if (errors.length) {
          this._engine.reportError(errors);
        } else {
          this._engine.afterFlush(() => {
            eraseStyles(element, fromStyles);
            setStyles(element, toStyles);
          });
        }
      }
      return;
    }
    const playersOnElement = getOrSetDefaultValue(this._engine.playersByElement, element, []);
    playersOnElement.forEach((player2) => {
      if (player2.namespaceId == this.id && player2.triggerName == triggerName && player2.queued) {
        player2.destroy();
      }
    });
    let transition = trigger.matchTransition(fromState.value, toState.value, element, toState.params);
    let isFallbackTransition = false;
    if (!transition) {
      if (!defaultToFallback) return;
      transition = trigger.fallbackTransition;
      isFallbackTransition = true;
    }
    this._engine.totalQueuedPlayers++;
    this._queue.push({
      element,
      triggerName,
      transition,
      fromState,
      toState,
      player,
      isFallbackTransition
    });
    if (!isFallbackTransition) {
      addClass(element, QUEUED_CLASSNAME);
      player.onStart(() => {
        removeClass(element, QUEUED_CLASSNAME);
      });
    }
    player.onDone(() => {
      let index = this.players.indexOf(player);
      if (index >= 0) {
        this.players.splice(index, 1);
      }
      const players = this._engine.playersByElement.get(element);
      if (players) {
        let index2 = players.indexOf(player);
        if (index2 >= 0) {
          players.splice(index2, 1);
        }
      }
    });
    this.players.push(player);
    playersOnElement.push(player);
    return player;
  }
  deregister(name) {
    this._triggers.delete(name);
    this._engine.statesByElement.forEach((stateMap) => stateMap.delete(name));
    this._elementListeners.forEach((listeners, element) => {
      this._elementListeners.set(element, listeners.filter((entry) => {
        return entry.name != name;
      }));
    });
  }
  clearElementCache(element) {
    this._engine.statesByElement.delete(element);
    this._elementListeners.delete(element);
    const elementPlayers = this._engine.playersByElement.get(element);
    if (elementPlayers) {
      elementPlayers.forEach((player) => player.destroy());
      this._engine.playersByElement.delete(element);
    }
  }
  _signalRemovalForInnerTriggers(rootElement, context) {
    const elements = this._engine.driver.query(rootElement, NG_TRIGGER_SELECTOR, true);
    elements.forEach((elm) => {
      if (elm[REMOVAL_FLAG]) return;
      const namespaces = this._engine.fetchNamespacesByElement(elm);
      if (namespaces.size) {
        namespaces.forEach((ns) => ns.triggerLeaveAnimation(elm, context, false, true));
      } else {
        this.clearElementCache(elm);
      }
    });
    this._engine.afterFlushAnimationsDone(() => elements.forEach((elm) => this.clearElementCache(elm)));
  }
  triggerLeaveAnimation(element, context, destroyAfterComplete, defaultToFallback) {
    const triggerStates = this._engine.statesByElement.get(element);
    const previousTriggersValues = /* @__PURE__ */ new Map();
    if (triggerStates) {
      const players = [];
      triggerStates.forEach((state, triggerName) => {
        previousTriggersValues.set(triggerName, state.value);
        if (this._triggers.has(triggerName)) {
          const player = this.trigger(element, triggerName, VOID_VALUE, defaultToFallback);
          if (player) {
            players.push(player);
          }
        }
      });
      if (players.length) {
        this._engine.markElementAsRemoved(this.id, element, true, context, previousTriggersValues);
        if (destroyAfterComplete) {
          optimizeGroupPlayer(players).onDone(() => this._engine.processLeaveNode(element));
        }
        return true;
      }
    }
    return false;
  }
  prepareLeaveAnimationListeners(element) {
    const listeners = this._elementListeners.get(element);
    const elementStates = this._engine.statesByElement.get(element);
    if (listeners && elementStates) {
      const visitedTriggers = /* @__PURE__ */ new Set();
      listeners.forEach((listener) => {
        const triggerName = listener.name;
        if (visitedTriggers.has(triggerName)) return;
        visitedTriggers.add(triggerName);
        const trigger = this._triggers.get(triggerName);
        const transition = trigger.fallbackTransition;
        const fromState = elementStates.get(triggerName) || DEFAULT_STATE_VALUE;
        const toState = new StateValue(VOID_VALUE);
        const player = new TransitionAnimationPlayer(this.id, triggerName, element);
        this._engine.totalQueuedPlayers++;
        this._queue.push({
          element,
          triggerName,
          transition,
          fromState,
          toState,
          player,
          isFallbackTransition: true
        });
      });
    }
  }
  removeNode(element, context) {
    const engine = this._engine;
    if (element.childElementCount) {
      this._signalRemovalForInnerTriggers(element, context);
    }
    if (this.triggerLeaveAnimation(element, context, true)) return;
    let containsPotentialParentTransition = false;
    if (engine.totalAnimations) {
      const currentPlayers = engine.players.length ? engine.playersByQueriedElement.get(element) : [];
      if (currentPlayers && currentPlayers.length) {
        containsPotentialParentTransition = true;
      } else {
        let parent = element;
        while (parent = parent.parentNode) {
          const triggers = engine.statesByElement.get(parent);
          if (triggers) {
            containsPotentialParentTransition = true;
            break;
          }
        }
      }
    }
    this.prepareLeaveAnimationListeners(element);
    if (containsPotentialParentTransition) {
      engine.markElementAsRemoved(this.id, element, false, context);
    } else {
      const removalFlag = element[REMOVAL_FLAG];
      if (!removalFlag || removalFlag === NULL_REMOVAL_STATE) {
        engine.afterFlush(() => this.clearElementCache(element));
        engine.destroyInnerAnimations(element);
        engine._onRemovalComplete(element, context);
      }
    }
  }
  insertNode(element, parent) {
    addClass(element, this._hostClassName);
  }
  drainQueuedTransitions(microtaskId) {
    const instructions = [];
    this._queue.forEach((entry) => {
      const player = entry.player;
      if (player.destroyed) return;
      const element = entry.element;
      const listeners = this._elementListeners.get(element);
      if (listeners) {
        listeners.forEach((listener) => {
          if (listener.name == entry.triggerName) {
            const baseEvent = makeAnimationEvent(element, entry.triggerName, entry.fromState.value, entry.toState.value);
            baseEvent["_data"] = microtaskId;
            listenOnPlayer(entry.player, listener.phase, baseEvent, listener.callback);
          }
        });
      }
      if (player.markedForDestroy) {
        this._engine.afterFlush(() => {
          player.destroy();
        });
      } else {
        instructions.push(entry);
      }
    });
    this._queue = [];
    return instructions.sort((a, b) => {
      const d0 = a.transition.ast.depCount;
      const d1 = b.transition.ast.depCount;
      if (d0 == 0 || d1 == 0) {
        return d0 - d1;
      }
      return this._engine.driver.containsElement(a.element, b.element) ? 1 : -1;
    });
  }
  destroy(context) {
    this.players.forEach((p) => p.destroy());
    this._signalRemovalForInnerTriggers(this.hostElement, context);
  }
};
var TransitionAnimationEngine = class {
  bodyNode;
  driver;
  _normalizer;
  players = [];
  newHostElements = /* @__PURE__ */ new Map();
  playersByElement = /* @__PURE__ */ new Map();
  playersByQueriedElement = /* @__PURE__ */ new Map();
  statesByElement = /* @__PURE__ */ new Map();
  disabledNodes = /* @__PURE__ */ new Set();
  totalAnimations = 0;
  totalQueuedPlayers = 0;
  _namespaceLookup = {};
  _namespaceList = [];
  _flushFns = [];
  _whenQuietFns = [];
  namespacesByHostElement = /* @__PURE__ */ new Map();
  collectedEnterElements = [];
  collectedLeaveElements = [];
  // this method is designed to be overridden by the code that uses this engine
  onRemovalComplete = (element, context) => {
  };
  /** @internal */
  _onRemovalComplete(element, context) {
    this.onRemovalComplete(element, context);
  }
  constructor(bodyNode, driver, _normalizer) {
    this.bodyNode = bodyNode;
    this.driver = driver;
    this._normalizer = _normalizer;
  }
  get queuedPlayers() {
    const players = [];
    this._namespaceList.forEach((ns) => {
      ns.players.forEach((player) => {
        if (player.queued) {
          players.push(player);
        }
      });
    });
    return players;
  }
  createNamespace(namespaceId, hostElement) {
    const ns = new AnimationTransitionNamespace(namespaceId, hostElement, this);
    if (this.bodyNode && this.driver.containsElement(this.bodyNode, hostElement)) {
      this._balanceNamespaceList(ns, hostElement);
    } else {
      this.newHostElements.set(hostElement, ns);
      this.collectEnterElement(hostElement);
    }
    return this._namespaceLookup[namespaceId] = ns;
  }
  _balanceNamespaceList(ns, hostElement) {
    const namespaceList = this._namespaceList;
    const namespacesByHostElement = this.namespacesByHostElement;
    const limit = namespaceList.length - 1;
    if (limit >= 0) {
      let found = false;
      let ancestor = this.driver.getParentElement(hostElement);
      while (ancestor) {
        const ancestorNs = namespacesByHostElement.get(ancestor);
        if (ancestorNs) {
          const index = namespaceList.indexOf(ancestorNs);
          namespaceList.splice(index + 1, 0, ns);
          found = true;
          break;
        }
        ancestor = this.driver.getParentElement(ancestor);
      }
      if (!found) {
        namespaceList.unshift(ns);
      }
    } else {
      namespaceList.push(ns);
    }
    namespacesByHostElement.set(hostElement, ns);
    return ns;
  }
  register(namespaceId, hostElement) {
    let ns = this._namespaceLookup[namespaceId];
    if (!ns) {
      ns = this.createNamespace(namespaceId, hostElement);
    }
    return ns;
  }
  registerTrigger(namespaceId, name, trigger) {
    let ns = this._namespaceLookup[namespaceId];
    if (ns && ns.register(name, trigger)) {
      this.totalAnimations++;
    }
  }
  destroy(namespaceId, context) {
    if (!namespaceId) return;
    this.afterFlush(() => {
    });
    this.afterFlushAnimationsDone(() => {
      const ns = this._fetchNamespace(namespaceId);
      this.namespacesByHostElement.delete(ns.hostElement);
      const index = this._namespaceList.indexOf(ns);
      if (index >= 0) {
        this._namespaceList.splice(index, 1);
      }
      ns.destroy(context);
      delete this._namespaceLookup[namespaceId];
    });
  }
  _fetchNamespace(id) {
    return this._namespaceLookup[id];
  }
  fetchNamespacesByElement(element) {
    const namespaces = /* @__PURE__ */ new Set();
    const elementStates = this.statesByElement.get(element);
    if (elementStates) {
      for (let stateValue of elementStates.values()) {
        if (stateValue.namespaceId) {
          const ns = this._fetchNamespace(stateValue.namespaceId);
          if (ns) {
            namespaces.add(ns);
          }
        }
      }
    }
    return namespaces;
  }
  trigger(namespaceId, element, name, value) {
    if (isElementNode(element)) {
      const ns = this._fetchNamespace(namespaceId);
      if (ns) {
        ns.trigger(element, name, value);
        return true;
      }
    }
    return false;
  }
  insertNode(namespaceId, element, parent, insertBefore) {
    if (!isElementNode(element)) return;
    const details = element[REMOVAL_FLAG];
    if (details && details.setForRemoval) {
      details.setForRemoval = false;
      details.setForMove = true;
      const index = this.collectedLeaveElements.indexOf(element);
      if (index >= 0) {
        this.collectedLeaveElements.splice(index, 1);
      }
    }
    if (namespaceId) {
      const ns = this._fetchNamespace(namespaceId);
      if (ns) {
        ns.insertNode(element, parent);
      }
    }
    if (insertBefore) {
      this.collectEnterElement(element);
    }
  }
  collectEnterElement(element) {
    this.collectedEnterElements.push(element);
  }
  markElementAsDisabled(element, value) {
    if (value) {
      if (!this.disabledNodes.has(element)) {
        this.disabledNodes.add(element);
        addClass(element, DISABLED_CLASSNAME);
      }
    } else if (this.disabledNodes.has(element)) {
      this.disabledNodes.delete(element);
      removeClass(element, DISABLED_CLASSNAME);
    }
  }
  removeNode(namespaceId, element, context) {
    if (isElementNode(element)) {
      const ns = namespaceId ? this._fetchNamespace(namespaceId) : null;
      if (ns) {
        ns.removeNode(element, context);
      } else {
        this.markElementAsRemoved(namespaceId, element, false, context);
      }
      const hostNS = this.namespacesByHostElement.get(element);
      if (hostNS && hostNS.id !== namespaceId) {
        hostNS.removeNode(element, context);
      }
    } else {
      this._onRemovalComplete(element, context);
    }
  }
  markElementAsRemoved(namespaceId, element, hasAnimation, context, previousTriggersValues) {
    this.collectedLeaveElements.push(element);
    element[REMOVAL_FLAG] = {
      namespaceId,
      setForRemoval: context,
      hasAnimation,
      removedBeforeQueried: false,
      previousTriggersValues
    };
  }
  listen(namespaceId, element, name, phase, callback) {
    if (isElementNode(element)) {
      return this._fetchNamespace(namespaceId).listen(element, name, phase, callback);
    }
    return () => {
    };
  }
  _buildInstruction(entry, subTimelines, enterClassName, leaveClassName, skipBuildAst) {
    return entry.transition.build(this.driver, entry.element, entry.fromState.value, entry.toState.value, enterClassName, leaveClassName, entry.fromState.options, entry.toState.options, subTimelines, skipBuildAst);
  }
  destroyInnerAnimations(containerElement) {
    let elements = this.driver.query(containerElement, NG_TRIGGER_SELECTOR, true);
    elements.forEach((element) => this.destroyActiveAnimationsForElement(element));
    if (this.playersByQueriedElement.size == 0) return;
    elements = this.driver.query(containerElement, NG_ANIMATING_SELECTOR, true);
    elements.forEach((element) => this.finishActiveQueriedAnimationOnElement(element));
  }
  destroyActiveAnimationsForElement(element) {
    const players = this.playersByElement.get(element);
    if (players) {
      players.forEach((player) => {
        if (player.queued) {
          player.markedForDestroy = true;
        } else {
          player.destroy();
        }
      });
    }
  }
  finishActiveQueriedAnimationOnElement(element) {
    const players = this.playersByQueriedElement.get(element);
    if (players) {
      players.forEach((player) => player.finish());
    }
  }
  whenRenderingDone() {
    return new Promise((resolve) => {
      if (this.players.length) {
        return optimizeGroupPlayer(this.players).onDone(() => resolve());
      } else {
        resolve();
      }
    });
  }
  processLeaveNode(element) {
    const details = element[REMOVAL_FLAG];
    if (details && details.setForRemoval) {
      element[REMOVAL_FLAG] = NULL_REMOVAL_STATE;
      if (details.namespaceId) {
        this.destroyInnerAnimations(element);
        const ns = this._fetchNamespace(details.namespaceId);
        if (ns) {
          ns.clearElementCache(element);
        }
      }
      this._onRemovalComplete(element, details.setForRemoval);
    }
    if (element.classList?.contains(DISABLED_CLASSNAME)) {
      this.markElementAsDisabled(element, false);
    }
    this.driver.query(element, DISABLED_SELECTOR, true).forEach((node) => {
      this.markElementAsDisabled(node, false);
    });
  }
  flush(microtaskId = -1) {
    let players = [];
    if (this.newHostElements.size) {
      this.newHostElements.forEach((ns, element) => this._balanceNamespaceList(ns, element));
      this.newHostElements.clear();
    }
    if (this.totalAnimations && this.collectedEnterElements.length) {
      for (let i = 0; i < this.collectedEnterElements.length; i++) {
        const elm = this.collectedEnterElements[i];
        addClass(elm, STAR_CLASSNAME);
      }
    }
    if (this._namespaceList.length && (this.totalQueuedPlayers || this.collectedLeaveElements.length)) {
      const cleanupFns = [];
      try {
        players = this._flushAnimations(cleanupFns, microtaskId);
      } finally {
        for (let i = 0; i < cleanupFns.length; i++) {
          cleanupFns[i]();
        }
      }
    } else {
      for (let i = 0; i < this.collectedLeaveElements.length; i++) {
        const element = this.collectedLeaveElements[i];
        this.processLeaveNode(element);
      }
    }
    this.totalQueuedPlayers = 0;
    this.collectedEnterElements.length = 0;
    this.collectedLeaveElements.length = 0;
    this._flushFns.forEach((fn) => fn());
    this._flushFns = [];
    if (this._whenQuietFns.length) {
      const quietFns = this._whenQuietFns;
      this._whenQuietFns = [];
      if (players.length) {
        optimizeGroupPlayer(players).onDone(() => {
          quietFns.forEach((fn) => fn());
        });
      } else {
        quietFns.forEach((fn) => fn());
      }
    }
  }
  reportError(errors) {
    throw triggerTransitionsFailed(errors);
  }
  _flushAnimations(cleanupFns, microtaskId) {
    const subTimelines = new ElementInstructionMap();
    const skippedPlayers = [];
    const skippedPlayersMap = /* @__PURE__ */ new Map();
    const queuedInstructions = [];
    const queriedElements = /* @__PURE__ */ new Map();
    const allPreStyleElements = /* @__PURE__ */ new Map();
    const allPostStyleElements = /* @__PURE__ */ new Map();
    const disabledElementsSet = /* @__PURE__ */ new Set();
    this.disabledNodes.forEach((node) => {
      disabledElementsSet.add(node);
      const nodesThatAreDisabled = this.driver.query(node, QUEUED_SELECTOR, true);
      for (let i2 = 0; i2 < nodesThatAreDisabled.length; i2++) {
        disabledElementsSet.add(nodesThatAreDisabled[i2]);
      }
    });
    const bodyNode = this.bodyNode;
    const allTriggerElements = Array.from(this.statesByElement.keys());
    const enterNodeMap = buildRootMap(allTriggerElements, this.collectedEnterElements);
    const enterNodeMapIds = /* @__PURE__ */ new Map();
    let i = 0;
    enterNodeMap.forEach((nodes, root) => {
      const className = ENTER_CLASSNAME + i++;
      enterNodeMapIds.set(root, className);
      nodes.forEach((node) => addClass(node, className));
    });
    const allLeaveNodes = [];
    const mergedLeaveNodes = /* @__PURE__ */ new Set();
    const leaveNodesWithoutAnimations = /* @__PURE__ */ new Set();
    for (let i2 = 0; i2 < this.collectedLeaveElements.length; i2++) {
      const element = this.collectedLeaveElements[i2];
      const details = element[REMOVAL_FLAG];
      if (details && details.setForRemoval) {
        allLeaveNodes.push(element);
        mergedLeaveNodes.add(element);
        if (details.hasAnimation) {
          this.driver.query(element, STAR_SELECTOR, true).forEach((elm) => mergedLeaveNodes.add(elm));
        } else {
          leaveNodesWithoutAnimations.add(element);
        }
      }
    }
    const leaveNodeMapIds = /* @__PURE__ */ new Map();
    const leaveNodeMap = buildRootMap(allTriggerElements, Array.from(mergedLeaveNodes));
    leaveNodeMap.forEach((nodes, root) => {
      const className = LEAVE_CLASSNAME + i++;
      leaveNodeMapIds.set(root, className);
      nodes.forEach((node) => addClass(node, className));
    });
    cleanupFns.push(() => {
      enterNodeMap.forEach((nodes, root) => {
        const className = enterNodeMapIds.get(root);
        nodes.forEach((node) => removeClass(node, className));
      });
      leaveNodeMap.forEach((nodes, root) => {
        const className = leaveNodeMapIds.get(root);
        nodes.forEach((node) => removeClass(node, className));
      });
      allLeaveNodes.forEach((element) => {
        this.processLeaveNode(element);
      });
    });
    const allPlayers = [];
    const erroneousTransitions = [];
    for (let i2 = this._namespaceList.length - 1; i2 >= 0; i2--) {
      const ns = this._namespaceList[i2];
      ns.drainQueuedTransitions(microtaskId).forEach((entry) => {
        const player = entry.player;
        const element = entry.element;
        allPlayers.push(player);
        if (this.collectedEnterElements.length) {
          const details = element[REMOVAL_FLAG];
          if (details && details.setForMove) {
            if (details.previousTriggersValues && details.previousTriggersValues.has(entry.triggerName)) {
              const previousValue = details.previousTriggersValues.get(entry.triggerName);
              const triggersWithStates = this.statesByElement.get(entry.element);
              if (triggersWithStates && triggersWithStates.has(entry.triggerName)) {
                const state = triggersWithStates.get(entry.triggerName);
                state.value = previousValue;
                triggersWithStates.set(entry.triggerName, state);
              }
            }
            player.destroy();
            return;
          }
        }
        const nodeIsOrphaned = !bodyNode || !this.driver.containsElement(bodyNode, element);
        const leaveClassName = leaveNodeMapIds.get(element);
        const enterClassName = enterNodeMapIds.get(element);
        const instruction = this._buildInstruction(entry, subTimelines, enterClassName, leaveClassName, nodeIsOrphaned);
        if (instruction.errors && instruction.errors.length) {
          erroneousTransitions.push(instruction);
          return;
        }
        if (nodeIsOrphaned) {
          player.onStart(() => eraseStyles(element, instruction.fromStyles));
          player.onDestroy(() => setStyles(element, instruction.toStyles));
          skippedPlayers.push(player);
          return;
        }
        if (entry.isFallbackTransition) {
          player.onStart(() => eraseStyles(element, instruction.fromStyles));
          player.onDestroy(() => setStyles(element, instruction.toStyles));
          skippedPlayers.push(player);
          return;
        }
        const timelines = [];
        instruction.timelines.forEach((tl) => {
          tl.stretchStartingKeyframe = true;
          if (!this.disabledNodes.has(tl.element)) {
            timelines.push(tl);
          }
        });
        instruction.timelines = timelines;
        subTimelines.append(element, instruction.timelines);
        const tuple = {
          instruction,
          player,
          element
        };
        queuedInstructions.push(tuple);
        instruction.queriedElements.forEach((element2) => getOrSetDefaultValue(queriedElements, element2, []).push(player));
        instruction.preStyleProps.forEach((stringMap, element2) => {
          if (stringMap.size) {
            let setVal = allPreStyleElements.get(element2);
            if (!setVal) {
              allPreStyleElements.set(element2, setVal = /* @__PURE__ */ new Set());
            }
            stringMap.forEach((_, prop) => setVal.add(prop));
          }
        });
        instruction.postStyleProps.forEach((stringMap, element2) => {
          let setVal = allPostStyleElements.get(element2);
          if (!setVal) {
            allPostStyleElements.set(element2, setVal = /* @__PURE__ */ new Set());
          }
          stringMap.forEach((_, prop) => setVal.add(prop));
        });
      });
    }
    if (erroneousTransitions.length) {
      const errors = [];
      erroneousTransitions.forEach((instruction) => {
        errors.push(transitionFailed(instruction.triggerName, instruction.errors));
      });
      allPlayers.forEach((player) => player.destroy());
      this.reportError(errors);
    }
    const allPreviousPlayersMap = /* @__PURE__ */ new Map();
    const animationElementMap = /* @__PURE__ */ new Map();
    queuedInstructions.forEach((entry) => {
      const element = entry.element;
      if (subTimelines.has(element)) {
        animationElementMap.set(element, element);
        this._beforeAnimationBuild(entry.player.namespaceId, entry.instruction, allPreviousPlayersMap);
      }
    });
    skippedPlayers.forEach((player) => {
      const element = player.element;
      const previousPlayers = this._getPreviousPlayers(element, false, player.namespaceId, player.triggerName, null);
      previousPlayers.forEach((prevPlayer) => {
        getOrSetDefaultValue(allPreviousPlayersMap, element, []).push(prevPlayer);
        prevPlayer.destroy();
      });
    });
    const replaceNodes = allLeaveNodes.filter((node) => {
      return replacePostStylesAsPre(node, allPreStyleElements, allPostStyleElements);
    });
    const postStylesMap = /* @__PURE__ */ new Map();
    const allLeaveQueriedNodes = cloakAndComputeStyles(postStylesMap, this.driver, leaveNodesWithoutAnimations, allPostStyleElements, AUTO_STYLE);
    allLeaveQueriedNodes.forEach((node) => {
      if (replacePostStylesAsPre(node, allPreStyleElements, allPostStyleElements)) {
        replaceNodes.push(node);
      }
    });
    const preStylesMap = /* @__PURE__ */ new Map();
    enterNodeMap.forEach((nodes, root) => {
      cloakAndComputeStyles(preStylesMap, this.driver, new Set(nodes), allPreStyleElements, \u0275PRE_STYLE);
    });
    replaceNodes.forEach((node) => {
      const post = postStylesMap.get(node);
      const pre = preStylesMap.get(node);
      postStylesMap.set(node, new Map([...post?.entries() ?? [], ...pre?.entries() ?? []]));
    });
    const rootPlayers = [];
    const subPlayers = [];
    const NO_PARENT_ANIMATION_ELEMENT_DETECTED = {};
    queuedInstructions.forEach((entry) => {
      const {
        element,
        player,
        instruction
      } = entry;
      if (subTimelines.has(element)) {
        if (disabledElementsSet.has(element)) {
          player.onDestroy(() => setStyles(element, instruction.toStyles));
          player.disabled = true;
          player.overrideTotalTime(instruction.totalTime);
          skippedPlayers.push(player);
          return;
        }
        let parentWithAnimation = NO_PARENT_ANIMATION_ELEMENT_DETECTED;
        if (animationElementMap.size > 1) {
          let elm = element;
          const parentsToAdd = [];
          while (elm = elm.parentNode) {
            const detectedParent = animationElementMap.get(elm);
            if (detectedParent) {
              parentWithAnimation = detectedParent;
              break;
            }
            parentsToAdd.push(elm);
          }
          parentsToAdd.forEach((parent) => animationElementMap.set(parent, parentWithAnimation));
        }
        const innerPlayer = this._buildAnimation(player.namespaceId, instruction, allPreviousPlayersMap, skippedPlayersMap, preStylesMap, postStylesMap);
        player.setRealPlayer(innerPlayer);
        if (parentWithAnimation === NO_PARENT_ANIMATION_ELEMENT_DETECTED) {
          rootPlayers.push(player);
        } else {
          const parentPlayers = this.playersByElement.get(parentWithAnimation);
          if (parentPlayers && parentPlayers.length) {
            player.parentPlayer = optimizeGroupPlayer(parentPlayers);
          }
          skippedPlayers.push(player);
        }
      } else {
        eraseStyles(element, instruction.fromStyles);
        player.onDestroy(() => setStyles(element, instruction.toStyles));
        subPlayers.push(player);
        if (disabledElementsSet.has(element)) {
          skippedPlayers.push(player);
        }
      }
    });
    subPlayers.forEach((player) => {
      const playersForElement = skippedPlayersMap.get(player.element);
      if (playersForElement && playersForElement.length) {
        const innerPlayer = optimizeGroupPlayer(playersForElement);
        player.setRealPlayer(innerPlayer);
      }
    });
    skippedPlayers.forEach((player) => {
      if (player.parentPlayer) {
        player.syncPlayerEvents(player.parentPlayer);
      } else {
        player.destroy();
      }
    });
    for (let i2 = 0; i2 < allLeaveNodes.length; i2++) {
      const element = allLeaveNodes[i2];
      const details = element[REMOVAL_FLAG];
      removeClass(element, LEAVE_CLASSNAME);
      if (details && details.hasAnimation) continue;
      let players = [];
      if (queriedElements.size) {
        let queriedPlayerResults = queriedElements.get(element);
        if (queriedPlayerResults && queriedPlayerResults.length) {
          players.push(...queriedPlayerResults);
        }
        let queriedInnerElements = this.driver.query(element, NG_ANIMATING_SELECTOR, true);
        for (let j = 0; j < queriedInnerElements.length; j++) {
          let queriedPlayers = queriedElements.get(queriedInnerElements[j]);
          if (queriedPlayers && queriedPlayers.length) {
            players.push(...queriedPlayers);
          }
        }
      }
      const activePlayers = players.filter((p) => !p.destroyed);
      if (activePlayers.length) {
        removeNodesAfterAnimationDone(this, element, activePlayers);
      } else {
        this.processLeaveNode(element);
      }
    }
    allLeaveNodes.length = 0;
    rootPlayers.forEach((player) => {
      this.players.push(player);
      player.onDone(() => {
        player.destroy();
        const index = this.players.indexOf(player);
        this.players.splice(index, 1);
      });
      player.play();
    });
    return rootPlayers;
  }
  afterFlush(callback) {
    this._flushFns.push(callback);
  }
  afterFlushAnimationsDone(callback) {
    this._whenQuietFns.push(callback);
  }
  _getPreviousPlayers(element, isQueriedElement, namespaceId, triggerName, toStateValue) {
    let players = [];
    if (isQueriedElement) {
      const queriedElementPlayers = this.playersByQueriedElement.get(element);
      if (queriedElementPlayers) {
        players = queriedElementPlayers;
      }
    } else {
      const elementPlayers = this.playersByElement.get(element);
      if (elementPlayers) {
        const isRemovalAnimation = !toStateValue || toStateValue == VOID_VALUE;
        elementPlayers.forEach((player) => {
          if (player.queued) return;
          if (!isRemovalAnimation && player.triggerName != triggerName) return;
          players.push(player);
        });
      }
    }
    if (namespaceId || triggerName) {
      players = players.filter((player) => {
        if (namespaceId && namespaceId != player.namespaceId) return false;
        if (triggerName && triggerName != player.triggerName) return false;
        return true;
      });
    }
    return players;
  }
  _beforeAnimationBuild(namespaceId, instruction, allPreviousPlayersMap) {
    const triggerName = instruction.triggerName;
    const rootElement = instruction.element;
    const targetNameSpaceId = instruction.isRemovalTransition ? void 0 : namespaceId;
    const targetTriggerName = instruction.isRemovalTransition ? void 0 : triggerName;
    for (const timelineInstruction of instruction.timelines) {
      const element = timelineInstruction.element;
      const isQueriedElement = element !== rootElement;
      const players = getOrSetDefaultValue(allPreviousPlayersMap, element, []);
      const previousPlayers = this._getPreviousPlayers(element, isQueriedElement, targetNameSpaceId, targetTriggerName, instruction.toState);
      previousPlayers.forEach((player) => {
        const realPlayer = player.getRealPlayer();
        if (realPlayer.beforeDestroy) {
          realPlayer.beforeDestroy();
        }
        player.destroy();
        players.push(player);
      });
    }
    eraseStyles(rootElement, instruction.fromStyles);
  }
  _buildAnimation(namespaceId, instruction, allPreviousPlayersMap, skippedPlayersMap, preStylesMap, postStylesMap) {
    const triggerName = instruction.triggerName;
    const rootElement = instruction.element;
    const allQueriedPlayers = [];
    const allConsumedElements = /* @__PURE__ */ new Set();
    const allSubElements = /* @__PURE__ */ new Set();
    const allNewPlayers = instruction.timelines.map((timelineInstruction) => {
      const element = timelineInstruction.element;
      allConsumedElements.add(element);
      const details = element[REMOVAL_FLAG];
      if (details && details.removedBeforeQueried) return new NoopAnimationPlayer(timelineInstruction.duration, timelineInstruction.delay);
      const isQueriedElement = element !== rootElement;
      const previousPlayers = flattenGroupPlayers((allPreviousPlayersMap.get(element) || EMPTY_PLAYER_ARRAY).map((p) => p.getRealPlayer())).filter((p) => {
        const pp = p;
        return pp.element ? pp.element === element : false;
      });
      const preStyles = preStylesMap.get(element);
      const postStyles = postStylesMap.get(element);
      const keyframes = normalizeKeyframes$1(this._normalizer, timelineInstruction.keyframes, preStyles, postStyles);
      const player2 = this._buildPlayer(timelineInstruction, keyframes, previousPlayers);
      if (timelineInstruction.subTimeline && skippedPlayersMap) {
        allSubElements.add(element);
      }
      if (isQueriedElement) {
        const wrappedPlayer = new TransitionAnimationPlayer(namespaceId, triggerName, element);
        wrappedPlayer.setRealPlayer(player2);
        allQueriedPlayers.push(wrappedPlayer);
      }
      return player2;
    });
    allQueriedPlayers.forEach((player2) => {
      getOrSetDefaultValue(this.playersByQueriedElement, player2.element, []).push(player2);
      player2.onDone(() => deleteOrUnsetInMap(this.playersByQueriedElement, player2.element, player2));
    });
    allConsumedElements.forEach((element) => addClass(element, NG_ANIMATING_CLASSNAME));
    const player = optimizeGroupPlayer(allNewPlayers);
    player.onDestroy(() => {
      allConsumedElements.forEach((element) => removeClass(element, NG_ANIMATING_CLASSNAME));
      setStyles(rootElement, instruction.toStyles);
    });
    allSubElements.forEach((element) => {
      getOrSetDefaultValue(skippedPlayersMap, element, []).push(player);
    });
    return player;
  }
  _buildPlayer(instruction, keyframes, previousPlayers) {
    if (keyframes.length > 0) {
      return this.driver.animate(instruction.element, keyframes, instruction.duration, instruction.delay, instruction.easing, previousPlayers);
    }
    return new NoopAnimationPlayer(instruction.duration, instruction.delay);
  }
};
var TransitionAnimationPlayer = class {
  namespaceId;
  triggerName;
  element;
  _player = new NoopAnimationPlayer();
  _containsRealPlayer = false;
  _queuedCallbacks = /* @__PURE__ */ new Map();
  destroyed = false;
  parentPlayer = null;
  markedForDestroy = false;
  disabled = false;
  queued = true;
  totalTime = 0;
  constructor(namespaceId, triggerName, element) {
    this.namespaceId = namespaceId;
    this.triggerName = triggerName;
    this.element = element;
  }
  setRealPlayer(player) {
    if (this._containsRealPlayer) return;
    this._player = player;
    this._queuedCallbacks.forEach((callbacks, phase) => {
      callbacks.forEach((callback) => listenOnPlayer(player, phase, void 0, callback));
    });
    this._queuedCallbacks.clear();
    this._containsRealPlayer = true;
    this.overrideTotalTime(player.totalTime);
    this.queued = false;
  }
  getRealPlayer() {
    return this._player;
  }
  overrideTotalTime(totalTime) {
    this.totalTime = totalTime;
  }
  syncPlayerEvents(player) {
    const p = this._player;
    if (p.triggerCallback) {
      player.onStart(() => p.triggerCallback("start"));
    }
    player.onDone(() => this.finish());
    player.onDestroy(() => this.destroy());
  }
  _queueEvent(name, callback) {
    getOrSetDefaultValue(this._queuedCallbacks, name, []).push(callback);
  }
  onDone(fn) {
    if (this.queued) {
      this._queueEvent("done", fn);
    }
    this._player.onDone(fn);
  }
  onStart(fn) {
    if (this.queued) {
      this._queueEvent("start", fn);
    }
    this._player.onStart(fn);
  }
  onDestroy(fn) {
    if (this.queued) {
      this._queueEvent("destroy", fn);
    }
    this._player.onDestroy(fn);
  }
  init() {
    this._player.init();
  }
  hasStarted() {
    return this.queued ? false : this._player.hasStarted();
  }
  play() {
    !this.queued && this._player.play();
  }
  pause() {
    !this.queued && this._player.pause();
  }
  restart() {
    !this.queued && this._player.restart();
  }
  finish() {
    this._player.finish();
  }
  destroy() {
    this.destroyed = true;
    this._player.destroy();
  }
  reset() {
    !this.queued && this._player.reset();
  }
  setPosition(p) {
    if (!this.queued) {
      this._player.setPosition(p);
    }
  }
  getPosition() {
    return this.queued ? 0 : this._player.getPosition();
  }
  /** @internal */
  triggerCallback(phaseName) {
    const p = this._player;
    if (p.triggerCallback) {
      p.triggerCallback(phaseName);
    }
  }
};
function deleteOrUnsetInMap(map, key, value) {
  let currentValues = map.get(key);
  if (currentValues) {
    if (currentValues.length) {
      const index = currentValues.indexOf(value);
      currentValues.splice(index, 1);
    }
    if (currentValues.length == 0) {
      map.delete(key);
    }
  }
  return currentValues;
}
function normalizeTriggerValue(value) {
  return value != null ? value : null;
}
function isElementNode(node) {
  return node && node["nodeType"] === 1;
}
function isTriggerEventValid(eventName) {
  return eventName == "start" || eventName == "done";
}
function cloakElement(element, value) {
  const oldValue = element.style.display;
  element.style.display = value != null ? value : "none";
  return oldValue;
}
function cloakAndComputeStyles(valuesMap, driver, elements, elementPropsMap, defaultStyle) {
  const cloakVals = [];
  elements.forEach((element) => cloakVals.push(cloakElement(element)));
  const failedElements = [];
  elementPropsMap.forEach((props, element) => {
    const styles = /* @__PURE__ */ new Map();
    props.forEach((prop) => {
      const value = driver.computeStyle(element, prop, defaultStyle);
      styles.set(prop, value);
      if (!value || value.length == 0) {
        element[REMOVAL_FLAG] = NULL_REMOVED_QUERIED_STATE;
        failedElements.push(element);
      }
    });
    valuesMap.set(element, styles);
  });
  let i = 0;
  elements.forEach((element) => cloakElement(element, cloakVals[i++]));
  return failedElements;
}
function buildRootMap(roots, nodes) {
  const rootMap = /* @__PURE__ */ new Map();
  roots.forEach((root) => rootMap.set(root, []));
  if (nodes.length == 0) return rootMap;
  const NULL_NODE = 1;
  const nodeSet = new Set(nodes);
  const localRootMap = /* @__PURE__ */ new Map();
  function getRoot(node) {
    if (!node) return NULL_NODE;
    let root = localRootMap.get(node);
    if (root) return root;
    const parent = node.parentNode;
    if (rootMap.has(parent)) {
      root = parent;
    } else if (nodeSet.has(parent)) {
      root = NULL_NODE;
    } else {
      root = getRoot(parent);
    }
    localRootMap.set(node, root);
    return root;
  }
  nodes.forEach((node) => {
    const root = getRoot(node);
    if (root !== NULL_NODE) {
      rootMap.get(root).push(node);
    }
  });
  return rootMap;
}
function addClass(element, className) {
  element.classList?.add(className);
}
function removeClass(element, className) {
  element.classList?.remove(className);
}
function removeNodesAfterAnimationDone(engine, element, players) {
  optimizeGroupPlayer(players).onDone(() => engine.processLeaveNode(element));
}
function flattenGroupPlayers(players) {
  const finalPlayers = [];
  _flattenGroupPlayersRecur(players, finalPlayers);
  return finalPlayers;
}
function _flattenGroupPlayersRecur(players, finalPlayers) {
  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    if (player instanceof AnimationGroupPlayer) {
      _flattenGroupPlayersRecur(player.players, finalPlayers);
    } else {
      finalPlayers.push(player);
    }
  }
}
function objEquals(a, b) {
  const k1 = Object.keys(a);
  const k2 = Object.keys(b);
  if (k1.length != k2.length) return false;
  for (let i = 0; i < k1.length; i++) {
    const prop = k1[i];
    if (!b.hasOwnProperty(prop) || a[prop] !== b[prop]) return false;
  }
  return true;
}
function replacePostStylesAsPre(element, allPreStyleElements, allPostStyleElements) {
  const postEntry = allPostStyleElements.get(element);
  if (!postEntry) return false;
  let preEntry = allPreStyleElements.get(element);
  if (preEntry) {
    postEntry.forEach((data) => preEntry.add(data));
  } else {
    allPreStyleElements.set(element, postEntry);
  }
  allPostStyleElements.delete(element);
  return true;
}
var AnimationEngine = class {
  _driver;
  _normalizer;
  _transitionEngine;
  _timelineEngine;
  _triggerCache = {};
  // this method is designed to be overridden by the code that uses this engine
  onRemovalComplete = (element, context) => {
  };
  constructor(doc, _driver, _normalizer) {
    this._driver = _driver;
    this._normalizer = _normalizer;
    this._transitionEngine = new TransitionAnimationEngine(doc.body, _driver, _normalizer);
    this._timelineEngine = new TimelineAnimationEngine(doc.body, _driver, _normalizer);
    this._transitionEngine.onRemovalComplete = (element, context) => this.onRemovalComplete(element, context);
  }
  registerTrigger(componentId, namespaceId, hostElement, name, metadata) {
    const cacheKey = componentId + "-" + name;
    let trigger = this._triggerCache[cacheKey];
    if (!trigger) {
      const errors = [];
      const warnings = [];
      const ast = buildAnimationAst(this._driver, metadata, errors, warnings);
      if (errors.length) {
        throw triggerBuildFailed(name, errors);
      }
      if (typeof ngDevMode === "undefined" || ngDevMode) {
        if (warnings.length) {
          warnTriggerBuild(name, warnings);
        }
      }
      trigger = buildTrigger(name, ast, this._normalizer);
      this._triggerCache[cacheKey] = trigger;
    }
    this._transitionEngine.registerTrigger(namespaceId, name, trigger);
  }
  register(namespaceId, hostElement) {
    this._transitionEngine.register(namespaceId, hostElement);
  }
  destroy(namespaceId, context) {
    this._transitionEngine.destroy(namespaceId, context);
  }
  onInsert(namespaceId, element, parent, insertBefore) {
    this._transitionEngine.insertNode(namespaceId, element, parent, insertBefore);
  }
  onRemove(namespaceId, element, context) {
    this._transitionEngine.removeNode(namespaceId, element, context);
  }
  disableAnimations(element, disable) {
    this._transitionEngine.markElementAsDisabled(element, disable);
  }
  process(namespaceId, element, property, value) {
    if (property.charAt(0) == "@") {
      const [id, action] = parseTimelineCommand(property);
      const args = value;
      this._timelineEngine.command(id, element, action, args);
    } else {
      this._transitionEngine.trigger(namespaceId, element, property, value);
    }
  }
  listen(namespaceId, element, eventName, eventPhase, callback) {
    if (eventName.charAt(0) == "@") {
      const [id, action] = parseTimelineCommand(eventName);
      return this._timelineEngine.listen(id, element, action, callback);
    }
    return this._transitionEngine.listen(namespaceId, element, eventName, eventPhase, callback);
  }
  flush(microtaskId = -1) {
    this._transitionEngine.flush(microtaskId);
  }
  get players() {
    return [...this._transitionEngine.players, ...this._timelineEngine.players];
  }
  whenRenderingDone() {
    return this._transitionEngine.whenRenderingDone();
  }
  afterFlushAnimationsDone(cb) {
    this._transitionEngine.afterFlushAnimationsDone(cb);
  }
};
function packageNonAnimatableStyles(element, styles) {
  let startStyles = null;
  let endStyles = null;
  if (Array.isArray(styles) && styles.length) {
    startStyles = filterNonAnimatableStyles(styles[0]);
    if (styles.length > 1) {
      endStyles = filterNonAnimatableStyles(styles[styles.length - 1]);
    }
  } else if (styles instanceof Map) {
    startStyles = filterNonAnimatableStyles(styles);
  }
  return startStyles || endStyles ? new SpecialCasedStyles(element, startStyles, endStyles) : null;
}
var SpecialCasedStyles = class _SpecialCasedStyles {
  _element;
  _startStyles;
  _endStyles;
  static initialStylesByElement = /* @__PURE__ */ new WeakMap();
  _state = 0;
  _initialStyles;
  constructor(_element, _startStyles, _endStyles) {
    this._element = _element;
    this._startStyles = _startStyles;
    this._endStyles = _endStyles;
    let initialStyles = _SpecialCasedStyles.initialStylesByElement.get(_element);
    if (!initialStyles) {
      _SpecialCasedStyles.initialStylesByElement.set(_element, initialStyles = /* @__PURE__ */ new Map());
    }
    this._initialStyles = initialStyles;
  }
  start() {
    if (this._state < 1) {
      if (this._startStyles) {
        setStyles(this._element, this._startStyles, this._initialStyles);
      }
      this._state = 1;
    }
  }
  finish() {
    this.start();
    if (this._state < 2) {
      setStyles(this._element, this._initialStyles);
      if (this._endStyles) {
        setStyles(this._element, this._endStyles);
        this._endStyles = null;
      }
      this._state = 1;
    }
  }
  destroy() {
    this.finish();
    if (this._state < 3) {
      _SpecialCasedStyles.initialStylesByElement.delete(this._element);
      if (this._startStyles) {
        eraseStyles(this._element, this._startStyles);
        this._endStyles = null;
      }
      if (this._endStyles) {
        eraseStyles(this._element, this._endStyles);
        this._endStyles = null;
      }
      setStyles(this._element, this._initialStyles);
      this._state = 3;
    }
  }
};
function filterNonAnimatableStyles(styles) {
  let result = null;
  styles.forEach((val, prop) => {
    if (isNonAnimatableStyle(prop)) {
      result = result || /* @__PURE__ */ new Map();
      result.set(prop, val);
    }
  });
  return result;
}
function isNonAnimatableStyle(prop) {
  return prop === "display" || prop === "position";
}
var WebAnimationsPlayer = class {
  element;
  keyframes;
  options;
  _specialStyles;
  _onDoneFns = [];
  _onStartFns = [];
  _onDestroyFns = [];
  _duration;
  _delay;
  _initialized = false;
  _finished = false;
  _started = false;
  _destroyed = false;
  _finalKeyframe;
  // the following original fns are persistent copies of the _onStartFns and _onDoneFns
  // and are used to reset the fns to their original values upon reset()
  // (since the _onStartFns and _onDoneFns get deleted after they are called)
  _originalOnDoneFns = [];
  _originalOnStartFns = [];
  // using non-null assertion because it's re(set) by init();
  domPlayer;
  time = 0;
  parentPlayer = null;
  currentSnapshot = /* @__PURE__ */ new Map();
  constructor(element, keyframes, options, _specialStyles) {
    this.element = element;
    this.keyframes = keyframes;
    this.options = options;
    this._specialStyles = _specialStyles;
    this._duration = options["duration"];
    this._delay = options["delay"] || 0;
    this.time = this._duration + this._delay;
  }
  _onFinish() {
    if (!this._finished) {
      this._finished = true;
      this._onDoneFns.forEach((fn) => fn());
      this._onDoneFns = [];
    }
  }
  init() {
    this._buildPlayer();
    this._preparePlayerBeforeStart();
  }
  _buildPlayer() {
    if (this._initialized) return;
    this._initialized = true;
    const keyframes = this.keyframes;
    this.domPlayer = this._triggerWebAnimation(this.element, keyframes, this.options);
    this._finalKeyframe = keyframes.length ? keyframes[keyframes.length - 1] : /* @__PURE__ */ new Map();
    const onFinish = () => this._onFinish();
    this.domPlayer.addEventListener("finish", onFinish);
    this.onDestroy(() => {
      this.domPlayer.removeEventListener("finish", onFinish);
    });
  }
  _preparePlayerBeforeStart() {
    if (this._delay) {
      this._resetDomPlayerState();
    } else {
      this.domPlayer.pause();
    }
  }
  _convertKeyframesToObject(keyframes) {
    const kfs = [];
    keyframes.forEach((frame) => {
      kfs.push(Object.fromEntries(frame));
    });
    return kfs;
  }
  /** @internal */
  _triggerWebAnimation(element, keyframes, options) {
    return element.animate(this._convertKeyframesToObject(keyframes), options);
  }
  onStart(fn) {
    this._originalOnStartFns.push(fn);
    this._onStartFns.push(fn);
  }
  onDone(fn) {
    this._originalOnDoneFns.push(fn);
    this._onDoneFns.push(fn);
  }
  onDestroy(fn) {
    this._onDestroyFns.push(fn);
  }
  play() {
    this._buildPlayer();
    if (!this.hasStarted()) {
      this._onStartFns.forEach((fn) => fn());
      this._onStartFns = [];
      this._started = true;
      if (this._specialStyles) {
        this._specialStyles.start();
      }
    }
    this.domPlayer.play();
  }
  pause() {
    this.init();
    this.domPlayer.pause();
  }
  finish() {
    this.init();
    if (this._specialStyles) {
      this._specialStyles.finish();
    }
    this._onFinish();
    this.domPlayer.finish();
  }
  reset() {
    this._resetDomPlayerState();
    this._destroyed = false;
    this._finished = false;
    this._started = false;
    this._onStartFns = this._originalOnStartFns;
    this._onDoneFns = this._originalOnDoneFns;
  }
  _resetDomPlayerState() {
    if (this.domPlayer) {
      this.domPlayer.cancel();
    }
  }
  restart() {
    this.reset();
    this.play();
  }
  hasStarted() {
    return this._started;
  }
  destroy() {
    if (!this._destroyed) {
      this._destroyed = true;
      this._resetDomPlayerState();
      this._onFinish();
      if (this._specialStyles) {
        this._specialStyles.destroy();
      }
      this._onDestroyFns.forEach((fn) => fn());
      this._onDestroyFns = [];
    }
  }
  setPosition(p) {
    if (this.domPlayer === void 0) {
      this.init();
    }
    this.domPlayer.currentTime = p * this.time;
  }
  getPosition() {
    return +(this.domPlayer.currentTime ?? 0) / this.time;
  }
  get totalTime() {
    return this._delay + this._duration;
  }
  beforeDestroy() {
    const styles = /* @__PURE__ */ new Map();
    if (this.hasStarted()) {
      const finalKeyframe = this._finalKeyframe;
      finalKeyframe.forEach((val, prop) => {
        if (prop !== "offset") {
          styles.set(prop, this._finished ? val : computeStyle(this.element, prop));
        }
      });
    }
    this.currentSnapshot = styles;
  }
  /** @internal */
  triggerCallback(phaseName) {
    const methods = phaseName === "start" ? this._onStartFns : this._onDoneFns;
    methods.forEach((fn) => fn());
    methods.length = 0;
  }
};
var WebAnimationsDriver = class {
  validateStyleProperty(prop) {
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      return validateStyleProperty(prop);
    }
    return true;
  }
  validateAnimatableStyleProperty(prop) {
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      const cssProp = camelCaseToDashCase(prop);
      return validateWebAnimatableStyleProperty(cssProp);
    }
    return true;
  }
  containsElement(elm1, elm2) {
    return containsElement(elm1, elm2);
  }
  getParentElement(element) {
    return getParentElement(element);
  }
  query(element, selector, multi) {
    return invokeQuery(element, selector, multi);
  }
  computeStyle(element, prop, defaultValue) {
    return computeStyle(element, prop);
  }
  animate(element, keyframes, duration, delay, easing, previousPlayers = []) {
    const fill = delay == 0 ? "both" : "forwards";
    const playerOptions = {
      duration,
      delay,
      fill
    };
    if (easing) {
      playerOptions["easing"] = easing;
    }
    const previousStyles = /* @__PURE__ */ new Map();
    const previousWebAnimationPlayers = previousPlayers.filter((player) => player instanceof WebAnimationsPlayer);
    if (allowPreviousPlayerStylesMerge(duration, delay)) {
      previousWebAnimationPlayers.forEach((player) => {
        player.currentSnapshot.forEach((val, prop) => previousStyles.set(prop, val));
      });
    }
    let _keyframes = normalizeKeyframes(keyframes).map((styles) => new Map(styles));
    _keyframes = balancePreviousStylesIntoKeyframes(element, _keyframes, previousStyles);
    const specialStyles = packageNonAnimatableStyles(element, _keyframes);
    return new WebAnimationsPlayer(element, _keyframes, playerOptions, specialStyles);
  }
};
var ANIMATION_PREFIX = "@";
var DISABLE_ANIMATIONS_FLAG = "@.disabled";
var BaseAnimationRenderer = class {
  namespaceId;
  delegate;
  engine;
  _onDestroy;
  // We need to explicitly type this property because of an api-extractor bug
  // See https://github.com/microsoft/rushstack/issues/4390
  \u0275type = 0;
  constructor(namespaceId, delegate, engine, _onDestroy) {
    this.namespaceId = namespaceId;
    this.delegate = delegate;
    this.engine = engine;
    this._onDestroy = _onDestroy;
  }
  get data() {
    return this.delegate.data;
  }
  destroyNode(node) {
    this.delegate.destroyNode?.(node);
  }
  destroy() {
    this.engine.destroy(this.namespaceId, this.delegate);
    this.engine.afterFlushAnimationsDone(() => {
      queueMicrotask(() => {
        this.delegate.destroy();
      });
    });
    this._onDestroy?.();
  }
  createElement(name, namespace) {
    return this.delegate.createElement(name, namespace);
  }
  createComment(value) {
    return this.delegate.createComment(value);
  }
  createText(value) {
    return this.delegate.createText(value);
  }
  appendChild(parent, newChild) {
    this.delegate.appendChild(parent, newChild);
    this.engine.onInsert(this.namespaceId, newChild, parent, false);
  }
  insertBefore(parent, newChild, refChild, isMove = true) {
    this.delegate.insertBefore(parent, newChild, refChild);
    this.engine.onInsert(this.namespaceId, newChild, parent, isMove);
  }
  // TODO(thePunderWoman): remove the requireSynchronousElementRemoval flag after the
  // animations package has been fully deleted post v23.
  removeChild(parent, oldChild, isHostElement, requireSynchronousElementRemoval) {
    if (requireSynchronousElementRemoval) {
      this.delegate.removeChild(parent, oldChild, isHostElement);
      return;
    }
    if (this.parentNode(oldChild)) {
      this.engine.onRemove(this.namespaceId, oldChild, this.delegate);
    }
  }
  selectRootElement(selectorOrNode, preserveContent) {
    return this.delegate.selectRootElement(selectorOrNode, preserveContent);
  }
  parentNode(node) {
    return this.delegate.parentNode(node);
  }
  nextSibling(node) {
    return this.delegate.nextSibling(node);
  }
  setAttribute(el, name, value, namespace) {
    this.delegate.setAttribute(el, name, value, namespace);
  }
  removeAttribute(el, name, namespace) {
    this.delegate.removeAttribute(el, name, namespace);
  }
  addClass(el, name) {
    this.delegate.addClass(el, name);
  }
  removeClass(el, name) {
    this.delegate.removeClass(el, name);
  }
  setStyle(el, style2, value, flags) {
    this.delegate.setStyle(el, style2, value, flags);
  }
  removeStyle(el, style2, flags) {
    this.delegate.removeStyle(el, style2, flags);
  }
  setProperty(el, name, value) {
    if (name.charAt(0) == ANIMATION_PREFIX && name == DISABLE_ANIMATIONS_FLAG) {
      this.disableAnimations(el, !!value);
    } else {
      this.delegate.setProperty(el, name, value);
    }
  }
  setValue(node, value) {
    this.delegate.setValue(node, value);
  }
  listen(target, eventName, callback, options) {
    return this.delegate.listen(target, eventName, callback, options);
  }
  disableAnimations(element, value) {
    this.engine.disableAnimations(element, value);
  }
};
var AnimationRenderer = class extends BaseAnimationRenderer {
  factory;
  constructor(factory, namespaceId, delegate, engine, onDestroy) {
    super(namespaceId, delegate, engine, onDestroy);
    this.factory = factory;
    this.namespaceId = namespaceId;
  }
  setProperty(el, name, value) {
    if (name.charAt(0) == ANIMATION_PREFIX) {
      if (name.charAt(1) == "." && name == DISABLE_ANIMATIONS_FLAG) {
        value = value === void 0 ? true : !!value;
        this.disableAnimations(el, value);
      } else {
        this.engine.process(this.namespaceId, el, name.slice(1), value);
      }
    } else {
      this.delegate.setProperty(el, name, value);
    }
  }
  listen(target, eventName, callback, options) {
    if (eventName.charAt(0) == ANIMATION_PREFIX) {
      const element = resolveElementFromTarget(target);
      let name = eventName.slice(1);
      let phase = "";
      if (name.charAt(0) != ANIMATION_PREFIX) {
        [name, phase] = parseTriggerCallbackName(name);
      }
      return this.engine.listen(this.namespaceId, element, name, phase, (event) => {
        const countId = event["_data"] || -1;
        this.factory.scheduleListenerCallback(countId, callback, event);
      });
    }
    return this.delegate.listen(target, eventName, callback, options);
  }
};
function resolveElementFromTarget(target) {
  switch (target) {
    case "body":
      return document.body;
    case "document":
      return document;
    case "window":
      return window;
    default:
      return target;
  }
}
function parseTriggerCallbackName(triggerName) {
  const dotIndex = triggerName.indexOf(".");
  const trigger = triggerName.substring(0, dotIndex);
  const phase = triggerName.slice(dotIndex + 1);
  return [trigger, phase];
}
var AnimationRendererFactory = class {
  delegate;
  engine;
  _zone;
  _currentId = 0;
  _microtaskId = 1;
  _animationCallbacksBuffer = [];
  _rendererCache = /* @__PURE__ */ new Map();
  _cdRecurDepth = 0;
  constructor(delegate, engine, _zone) {
    this.delegate = delegate;
    this.engine = engine;
    this._zone = _zone;
    engine.onRemovalComplete = (element, delegate2) => {
      delegate2?.removeChild(null, element);
    };
  }
  createRenderer(hostElement, type) {
    const EMPTY_NAMESPACE_ID = "";
    const delegate = this.delegate.createRenderer(hostElement, type);
    if (!hostElement || !type?.data?.["animation"]) {
      const cache = this._rendererCache;
      let renderer = cache.get(delegate);
      if (!renderer) {
        const onRendererDestroy = () => cache.delete(delegate);
        renderer = new BaseAnimationRenderer(EMPTY_NAMESPACE_ID, delegate, this.engine, onRendererDestroy);
        cache.set(delegate, renderer);
      }
      return renderer;
    }
    const componentId = type.id;
    const namespaceId = type.id + "-" + this._currentId;
    this._currentId++;
    this.engine.register(namespaceId, hostElement);
    const registerTrigger = (trigger) => {
      if (Array.isArray(trigger)) {
        trigger.forEach(registerTrigger);
      } else {
        this.engine.registerTrigger(componentId, namespaceId, hostElement, trigger.name, trigger);
      }
    };
    const animationTriggers = type.data["animation"];
    animationTriggers.forEach(registerTrigger);
    return new AnimationRenderer(this, namespaceId, delegate, this.engine);
  }
  begin() {
    this._cdRecurDepth++;
    if (this.delegate.begin) {
      this.delegate.begin();
    }
  }
  _scheduleCountTask() {
    queueMicrotask(() => {
      this._microtaskId++;
    });
  }
  /** @internal */
  scheduleListenerCallback(count, fn, data) {
    if (count >= 0 && count < this._microtaskId) {
      this._zone.run(() => fn(data));
      return;
    }
    const animationCallbacksBuffer = this._animationCallbacksBuffer;
    if (animationCallbacksBuffer.length == 0) {
      queueMicrotask(() => {
        this._zone.run(() => {
          animationCallbacksBuffer.forEach((tuple) => {
            const [fn2, data2] = tuple;
            fn2(data2);
          });
          this._animationCallbacksBuffer = [];
        });
      });
    }
    animationCallbacksBuffer.push([fn, data]);
  }
  end() {
    this._cdRecurDepth--;
    if (this._cdRecurDepth == 0) {
      this._zone.runOutsideAngular(() => {
        this._scheduleCountTask();
        this.engine.flush(this._microtaskId);
      });
    }
    if (this.delegate.end) {
      this.delegate.end();
    }
  }
  whenRenderingDone() {
    return this.engine.whenRenderingDone();
  }
  /**
   * Used during HMR to clear any cached data about a component.
   * @param componentId ID of the component that is being replaced.
   */
  componentReplaced(componentId) {
    this.engine.flush();
    this.delegate.componentReplaced?.(componentId);
  }
};

// node_modules/@angular/platform-browser/fesm2022/animations.mjs
var InjectableAnimationEngine = class _InjectableAnimationEngine extends AnimationEngine {
  // The `ApplicationRef` is injected here explicitly to force the dependency ordering.
  // Since the `ApplicationRef` should be created earlier before the `AnimationEngine`, they
  // both have `ngOnDestroy` hooks and `flush()` must be called after all views are destroyed.
  constructor(doc, driver, normalizer) {
    super(doc, driver, normalizer);
  }
  ngOnDestroy() {
    this.flush();
  }
  static \u0275fac = function InjectableAnimationEngine_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _InjectableAnimationEngine)(\u0275\u0275inject(DOCUMENT), \u0275\u0275inject(AnimationDriver), \u0275\u0275inject(AnimationStyleNormalizer));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _InjectableAnimationEngine,
    factory: _InjectableAnimationEngine.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InjectableAnimationEngine, [{
    type: Injectable
  }], () => [{
    type: Document,
    decorators: [{
      type: Inject,
      args: [DOCUMENT]
    }]
  }, {
    type: AnimationDriver
  }, {
    type: AnimationStyleNormalizer
  }], null);
})();
function instantiateDefaultStyleNormalizer() {
  return new WebAnimationsStyleNormalizer();
}
function instantiateRendererFactory(renderer, engine, zone) {
  return new AnimationRendererFactory(renderer, engine, zone);
}
var SHARED_ANIMATION_PROVIDERS = [{
  provide: AnimationStyleNormalizer,
  useFactory: instantiateDefaultStyleNormalizer
}, {
  provide: AnimationEngine,
  useClass: InjectableAnimationEngine
}, {
  provide: RendererFactory2,
  useFactory: instantiateRendererFactory,
  deps: [DomRendererFactory2, AnimationEngine, NgZone]
}];
var BROWSER_NOOP_ANIMATIONS_PROVIDERS = [{
  provide: AnimationDriver,
  useClass: NoopAnimationDriver
}, {
  provide: ANIMATION_MODULE_TYPE,
  useValue: "NoopAnimations"
}, ...SHARED_ANIMATION_PROVIDERS];
var BROWSER_ANIMATIONS_PROVIDERS = [
  // Note: the `ngServerMode` happen inside factories to give the variable time to initialize.
  {
    provide: AnimationDriver,
    useFactory: () => false ? new NoopAnimationDriver() : new WebAnimationsDriver()
  },
  {
    provide: ANIMATION_MODULE_TYPE,
    useFactory: () => false ? "NoopAnimations" : "BrowserAnimations"
  },
  ...SHARED_ANIMATION_PROVIDERS
];
var BrowserAnimationsModule = class _BrowserAnimationsModule {
  /**
   * Configures the module based on the specified object.
   *
   * @param config Object used to configure the behavior of the `BrowserAnimationsModule`.
   * @see {@link BrowserAnimationsModuleConfig}
   *
   * @usageNotes
   * When registering the `BrowserAnimationsModule`, you can use the `withConfig`
   * function as follows:
   * ```ts
   * @NgModule({
   *   imports: [BrowserAnimationsModule.withConfig(config)]
   * })
   * class MyNgModule {}
   * ```
   */
  static withConfig(config) {
    return {
      ngModule: _BrowserAnimationsModule,
      providers: config.disableAnimations ? BROWSER_NOOP_ANIMATIONS_PROVIDERS : BROWSER_ANIMATIONS_PROVIDERS
    };
  }
  static \u0275fac = function BrowserAnimationsModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrowserAnimationsModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _BrowserAnimationsModule,
    exports: [BrowserModule]
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    providers: BROWSER_ANIMATIONS_PROVIDERS,
    imports: [BrowserModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrowserAnimationsModule, [{
    type: NgModule,
    args: [{
      exports: [BrowserModule],
      providers: BROWSER_ANIMATIONS_PROVIDERS
    }]
  }], null, null);
})();
function provideAnimations() {
  performanceMarkFeature("NgEagerAnimations");
  return [...BROWSER_ANIMATIONS_PROVIDERS];
}
var NoopAnimationsModule = class _NoopAnimationsModule {
  static \u0275fac = function NoopAnimationsModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NoopAnimationsModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _NoopAnimationsModule,
    exports: [BrowserModule]
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    providers: BROWSER_NOOP_ANIMATIONS_PROVIDERS,
    imports: [BrowserModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NoopAnimationsModule, [{
    type: NgModule,
    args: [{
      exports: [BrowserModule],
      providers: BROWSER_NOOP_ANIMATIONS_PROVIDERS
    }]
  }], null, null);
})();

// src/app/core/guards/auth.guard.ts
var authGuard = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated()) {
    return true;
  }
  router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
  return false;
};

// src/app/core/models/user.model.ts
var UserRole;
(function(UserRole2) {
  UserRole2["ADMIN"] = "ADMIN";
  UserRole2["SUPERVISOR"] = "SUPERVISOR";
  UserRole2["AGENT"] = "AGENT";
})(UserRole || (UserRole = {}));

// src/app/core/guards/admin.guard.ts
var adminGuard = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (!authService.isAuthenticated()) {
    router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
    return false;
  }
  const currentUser = authService.getCurrentUser();
  if (currentUser && currentUser.role === UserRole.ADMIN) {
    return true;
  }
  router.navigate(["/agent-dashboard"]);
  return false;
};

// src/app/core/guards/admin-or-supervisor.guard.ts
var adminOrSupervisorGuard = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (!authService.isAuthenticated()) {
    router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
    return false;
  }
  const currentUser = authService.getCurrentUser();
  if (currentUser && (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.SUPERVISOR)) {
    return true;
  }
  router.navigate(["/agent-dashboard"]);
  return false;
};

// src/app/app.routes.ts
var routes = [
  {
    path: "login",
    loadComponent: () => import("./chunk-UQNCTPT2.js").then((m) => m.LoginComponent)
  },
  {
    path: "dialer",
    loadComponent: () => import("./chunk-NGE7GABU.js").then((m) => m.DialerMainComponent),
    canActivate: [authGuard]
  },
  {
    path: "contacts",
    loadComponent: () => import("./chunk-J7MIFE4S.js").then((m) => m.ContactListComponent),
    canActivate: [authGuard]
  },
  {
    path: "admin/monitoring",
    loadComponent: () => import("./chunk-2NXKMVYA.js").then((m) => m.AdminMonitoringComponent),
    canActivate: [authGuard]
  },
  {
    path: "admin/supervision/:callUuid",
    loadComponent: () => import("./chunk-KZAM5EZ4.js").then((m) => m.AdminCallSupervision),
    canActivate: [authGuard]
  },
  {
    path: "admin/campaigns/new",
    loadComponent: () => import("./chunk-7ASS6FFH.js").then((m) => m.CampaignFormComponent),
    canActivate: [authGuard]
  },
  {
    path: "admin/campaigns/generation",
    loadComponent: () => import("./chunk-NQIAR4WC.js").then((m) => m.CampaignPageComponent),
    canActivate: [authGuard, adminOrSupervisorGuard]
  },
  {
    path: "admin/campaigns/:id/edit",
    loadComponent: () => import("./chunk-7ASS6FFH.js").then((m) => m.CampaignFormComponent),
    canActivate: [authGuard]
  },
  {
    path: "admin/campaigns/:id",
    loadComponent: () => import("./chunk-4T2XXYVG.js").then((m) => m.CampaignDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: "admin/campaigns",
    loadComponent: () => import("./chunk-O5FVJQZN.js").then((m) => m.CampaignManagementComponent),
    canActivate: [authGuard]
  },
  {
    path: "admin/campaign-monitoring",
    loadComponent: () => import("./chunk-FTSZEVN5.js").then((m) => m.CampaignMonitoringComponent),
    canActivate: [authGuard]
  },
  // ========================================
  // REPORTES LEGACY
  // ========================================
  {
    path: "reports/contact",
    loadComponent: () => import("./chunk-TGDEAL4T.js").then((m) => m.ContactReportComponent),
    canActivate: [authGuard]
  },
  {
    path: "reports/ranking",
    loadComponent: () => import("./chunk-NUPXCHN5.js").then((m) => m.RankingReportComponent),
    canActivate: [authGuard]
  },
  {
    path: "reports/speech",
    loadComponent: () => import("./chunk-3BUIID5I.js").then((m) => m.SpeechReportComponent),
    canActivate: [authGuard]
  },
  {
    path: "reports/monitoring",
    loadComponent: () => import("./chunk-KFWG3CPI.js").then((m) => m.MonitoringReportComponent),
    canActivate: [authGuard]
  },
  {
    path: "reports/powerbi",
    loadComponent: () => import("./chunk-TRECDHPY.js").then((m) => m.PowerbiReportComponent),
    canActivate: [authGuard]
  },
  {
    path: "reports/cartera-propia",
    loadComponent: () => import("./chunk-K6D6WMIQ.js").then((m) => m.CarteraPropiaReportComponent),
    canActivate: [authGuard]
  },
  // ========================================
  // SMS
  // ========================================
  {
    path: "sms/combos",
    loadComponent: () => import("./chunk-XF5O7UJT.js").then((m) => m.ComboListPageComponent),
    canActivate: [authGuard]
  },
  {
    path: "sms/dynamic",
    loadComponent: () => import("./chunk-ED4U4TKD.js").then((m) => m.DynQueryPageComponent),
    canActivate: [authGuard]
  },
  // ========================================
  // OTROS MÓDULOS LEGACY
  // ========================================
  {
    path: "recordings",
    loadComponent: () => import("./chunk-IJ5YKANY.js").then((m) => m.RecordingsPageComponent),
    canActivate: [authGuard]
  },
  {
    path: "blacklist",
    loadComponent: () => import("./chunk-4QMINOCU.js").then((m) => m.BlacklistComponent),
    canActivate: [authGuard]
  },
  {
    path: "blacklist-main",
    loadComponent: () => import("./chunk-6YQIL66C.js").then((m) => m.BlacklistMainPageComponent),
    canActivate: [authGuard]
  },
  {
    path: "phone-lines",
    loadComponent: () => import("./chunk-HTH4EF6E.js").then((m) => m.PhoneLinesPageComponent),
    canActivate: [authGuard]
  },
  {
    path: "agreements",
    loadComponent: () => import("./chunk-NWLNU3F7.js").then((m) => m.AgreementsComponent),
    canActivate: [authGuard]
  },
  {
    path: "cartas/no-adeudo",
    loadComponent: () => import("./chunk-BEYJ2LZT.js").then((m) => m.NoDebtLetterPageComponent),
    canActivate: [authGuard]
  },
  {
    path: "admin/extensions",
    loadComponent: () => import("./chunk-XJUZFNUS.js").then((m) => m.ExtensionsRegistryComponent),
    canActivate: [authGuard]
  },
  {
    path: "whatsapp",
    loadComponent: () => import("./chunk-CBTUIJAD.js").then((m) => m.MainComponent),
    canActivate: [authGuard]
  },
  {
    path: "agent-dashboard",
    loadComponent: () => import("./chunk-7IPNCEWU.js").then((m) => m.AgentStatusDashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: "collection-management",
    loadComponent: () => import("./chunk-FW5AFBSO.js").then((m) => m.CollectionManagementPage),
    canActivate: [authGuard]
  },
  // ========================================
  // CARGA DE DATOS (Solo Admin)
  // ========================================
  {
    path: "admin/data-load/initial",
    loadComponent: () => import("./chunk-QBW424NX.js").then((m) => m.InitialLoadComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: "admin/data-load/daily",
    loadComponent: () => import("./chunk-KWYRQBOM.js").then((m) => m.DailyLoadComponent),
    canActivate: [authGuard, adminGuard]
  },
  // ========================================
  // MANTENIMIENTO (Solo Admin)
  // ========================================
  {
    path: "admin/maintenance/tenants",
    loadComponent: () => import("./chunk-REOKUV7V.js").then((m) => m.TenantMaintenanceComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: "admin/maintenance/portfolios",
    loadComponent: () => import("./chunk-SORKOYZI.js").then((m) => m.PortfolioMaintenanceComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: "admin/maintenance/subportfolios",
    loadComponent: () => import("./chunk-NTE6SLS2.js").then((m) => m.SubPortfolioMaintenanceComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: "admin/maintenance/headers",
    loadComponent: () => import("./chunk-KUUQOFU6.js").then((m) => m.HeaderConfigurationComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: "admin/maintenance/roles",
    loadComponent: () => import("./chunk-3PTQLZVQ.js").then((m) => m.RolesManagementComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: "admin/maintenance/users",
    loadComponent: () => import("./chunk-4A2Y62AO.js").then((m) => m.UserManagementComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: "admin/maintenance/blacklist",
    loadComponent: () => import("./chunk-CIURFG5G.js").then((m) => m.BlacklistMaintenanceComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: "admin/maintenance/typifications",
    loadComponent: () => import("./chunk-BJNL7XDI.js").then((m) => m.TypificationMaintenanceComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: "admin/maintenance/amount-display",
    loadComponent: () => import("./chunk-WPMK4FP4.js").then((m) => m.AmountDisplayConfigComponent),
    canActivate: [authGuard, adminGuard]
  },
  // ========================================
  // PAGOS BANCARIOS
  // ========================================
  {
    path: "pagos-bancarios",
    loadComponent: () => import("./chunk-2RTEUB7A.js").then((m) => m.PagosBancariosPage),
    canActivate: [authGuard, adminOrSupervisorGuard]
  },
  // ========================================
  // COMISIONES
  // ========================================
  {
    path: "comisiones",
    loadComponent: () => import("./chunk-J6GRPCXG.js").then((m) => m.ComisionesPage),
    canActivate: [authGuard, adminOrSupervisorGuard]
  },
  {
    path: "dashboard/payments",
    loadComponent: () => import("./chunk-E7CJJNIM.js").then((m) => m.PaymentsDashboardComponent),
    canActivate: [authGuard, adminOrSupervisorGuard]
  },
  {
    path: "admin/cartas-cesion",
    loadComponent: () => import("./chunk-2EPL3REI.js").then((m) => m.CartaCesionViewerComponent),
    canActivate: [authGuard, adminOrSupervisorGuard]
  },
  // ========================================
  // GESTIÓN MANUAL (Tipificación sin llamada)
  // ========================================
  {
    path: "manual-management",
    loadComponent: () => import("./chunk-HB7PMDCN.js").then((m) => m.ManualManagementComponent),
    canActivate: [authGuard]
  },
  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full"
  },
  {
    path: "**",
    redirectTo: "/login"
  }
];

// src/app/core/interceptors/auth.interceptor.ts
var authInterceptor = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(req).pipe(catchError((error) => {
    if (error.status === 401) {
      authService.logout();
      router.navigate(["/login"]);
    }
    return throwError(() => error);
  }));
};

// src/app/core/services/session-config.service.ts
var _SessionConfigService = class _SessionConfigService {
  constructor(http) {
    this.http = http;
    this.API_URL = `${environment.apiUrl}/configuracion/sesion`;
    this.configSubject = new BehaviorSubject(null);
    this.config$ = this.configSubject.asObservable();
    this.cargarConfiguracion();
  }
  cargarConfiguracion() {
    return this.http.get(this.API_URL).pipe(tap((config) => this.configSubject.next(config)));
  }
  obtenerConfig() {
    return this.configSubject.value;
  }
  getTimeoutInactividad() {
    return this.configSubject.value?.TIMEOUT_INACTIVIDAD || 900;
  }
  getTimeoutWarning() {
    return this.configSubject.value?.TIMEOUT_WARNING || 60;
  }
  isAutoRefreshEnabled() {
    return this.configSubject.value?.AUTO_REFRESH_ENABLED === 1;
  }
};
_SessionConfigService.\u0275fac = function SessionConfigService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SessionConfigService)(\u0275\u0275inject(HttpClient));
};
_SessionConfigService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SessionConfigService, factory: _SessionConfigService.\u0275fac, providedIn: "root" });
var SessionConfigService = _SessionConfigService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SessionConfigService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/core/interceptors/token-refresh.interceptor.ts
var isRefreshing = false;
var tokenRefreshInterceptor = (req, next) => {
  const authService = inject(AuthService);
  const sessionConfig = inject(SessionConfigService);
  if (req.url.includes("/auth/login") || req.url.includes("/auth/refresh-token")) {
    return next(req);
  }
  if (authService.isAuthenticated() && authService.isTokenExpiringSoon() && sessionConfig.isAutoRefreshEnabled() && !isRefreshing) {
    isRefreshing = true;
    return authService.refreshToken().pipe(switchMap(() => {
      isRefreshing = false;
      const token = authService.getToken();
      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      return next(req);
    }), catchError((error) => {
      isRefreshing = false;
      authService.logout();
      return throwError(() => error);
    }));
  }
  return next(req);
};

// src/app/app.config.ts
var appConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([tokenRefreshInterceptor, authInterceptor])),
    provideAnimations(),
    importProvidersFrom(LucideAngularModule.pick({
      Activity,
      AlarmClock,
      AlertCircle: CircleAlert,
      AlertTriangle: TriangleAlert,
      Archive,
      ArrowLeft,
      ArrowRight,
      ArrowUp,
      Ban,
      Banknote,
      BadgeCheck,
      BarChart2: ChartNoAxesColumn,
      BarChart3: ChartColumn,
      Bell,
      BellOff,
      Bookmark,
      BookOpen,
      Briefcase,
      Building,
      Building2,
      Calendar,
      CalendarCheck,
      CalendarX,
      Check,
      CheckCheck,
      CheckCircle: CircleCheckBig,
      ChevronDown,
      ChevronLeft,
      ChevronRight,
      ChevronUp,
      Circle,
      Clipboard,
      ClipboardEdit: ClipboardPen,
      ClipboardList,
      Clock,
      CloudUpload,
      Code,
      Coffee,
      Coins,
      Columns: Columns2,
      Copy,
      CornerUpLeft,
      CreditCard,
      Database,
      DollarSign,
      Download,
      Edit: SquarePen,
      Edit2: Pen,
      Edit3: PenLine,
      Eye,
      EyeOff,
      FileBadge,
      FileCheck,
      FilePlus,
      FileText,
      FileX,
      Filter: Funnel,
      Flag,
      Folder,
      FolderOpen,
      FolderTree,
      FunctionSquare: SquareFunction,
      GitBranch,
      Glasses,
      GripVertical,
      HandMetal,
      Handshake,
      Hash,
      Headphones,
      Heart,
      History,
      Home: House,
      Inbox,
      Info,
      Key,
      Landmark,
      Layers,
      LayoutDashboard,
      Link,
      List,
      ListChecks,
      Loader,
      Lock,
      LogOut,
      Mail,
      Map: Map2,
      MapPin,
      Megaphone,
      Menu,
      MessageCircle,
      MessageSquare,
      Mic,
      Minus,
      MinusCircle: CircleMinus,
      Moon,
      MoreVertical: EllipsisVertical,
      Navigation,
      Package,
      Pause,
      Pencil,
      Phone,
      PhoneCall,
      PhoneForwarded,
      PhoneIncoming,
      PhoneMissed,
      PhoneOff,
      PhoneOutgoing,
      Play,
      Plus,
      PlusCircle: CirclePlus,
      QrCode,
      RefreshCw,
      Rocket,
      Save,
      ScanLine,
      Search,
      SearchX,
      Send,
      Settings,
      Shield,
      ShieldBan,
      ShieldCheck,
      ShieldOff,
      ShoppingCart,
      SkipForward,
      Sliders: SlidersVertical,
      Smartphone,
      Smile,
      Sparkles,
      Square,
      Star,
      Sun,
      Table,
      Table2,
      Tag,
      Tags,
      Target,
      ThumbsDown,
      ThumbsUp,
      Timer,
      Trash,
      Trash2,
      TrendingDown,
      TrendingUp,
      Trophy,
      Type,
      Unlock: LockOpen,
      Upload,
      User,
      UserCheck,
      UserCircle: CircleUser,
      UserCog,
      Users,
      UserX,
      Wallet,
      X,
      XCircle: CircleX,
      Zap
    }))
  ]
};

// src/app/core/services/inactivity.service.ts
var _InactivityService = class _InactivityService {
  constructor(ngZone, sessionConfig, authService) {
    this.ngZone = ngZone;
    this.sessionConfig = sessionConfig;
    this.authService = authService;
    this.inactivityTimer$ = new Subject();
    this.warningTimer$ = new Subject();
    this.lastActivityTime = Date.now();
    this.warningEmitted = false;
    this.activityEvents$ = merge(fromEvent(document, "mousedown"), fromEvent(document, "keypress"), fromEvent(document, "scroll"), fromEvent(document, "touchstart"), fromEvent(document, "click"));
    this.onWarning$ = this.warningTimer$.asObservable();
    this.onTimeout$ = this.inactivityTimer$.asObservable();
  }
  iniciar() {
    if (!this.authService.isAuthenticated()) {
      return;
    }
    this.lastActivityTime = Date.now();
    this.warningEmitted = false;
    this.activityEvents$.pipe(debounceTime(1e3)).subscribe(() => {
      this.lastActivityTime = Date.now();
    });
    this.ngZone.runOutsideAngular(() => {
      this.checkInterval = setInterval(() => {
        this.verificarInactividad();
      }, 1e3);
    });
  }
  detener() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
  verificarInactividad() {
    const tiempoInactivo = Math.floor((Date.now() - this.lastActivityTime) / 1e3);
    const timeoutInactividad = this.sessionConfig.getTimeoutInactividad();
    const timeoutWarning = this.sessionConfig.getTimeoutWarning();
    const tiempoParaAdvertencia = timeoutInactividad - timeoutWarning;
    if (tiempoInactivo >= timeoutInactividad) {
      this.ngZone.run(() => {
        this.inactivityTimer$.next();
        this.detener();
      });
    } else if (tiempoInactivo >= tiempoParaAdvertencia && !this.warningEmitted) {
      this.warningEmitted = true;
      this.ngZone.run(() => {
        this.warningTimer$.next();
      });
    }
  }
  resetearContador() {
    this.lastActivityTime = Date.now();
    this.warningEmitted = false;
  }
  getTiempoRestante() {
    const tiempoInactivo = Math.floor((Date.now() - this.lastActivityTime) / 1e3);
    const timeoutInactividad = this.sessionConfig.getTimeoutInactividad();
    return Math.max(0, timeoutInactividad - tiempoInactivo);
  }
};
_InactivityService.\u0275fac = function InactivityService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _InactivityService)(\u0275\u0275inject(NgZone), \u0275\u0275inject(SessionConfigService), \u0275\u0275inject(AuthService));
};
_InactivityService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _InactivityService, factory: _InactivityService.\u0275fac, providedIn: "root" });
var InactivityService = _InactivityService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InactivityService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: NgZone }, { type: SessionConfigService }, { type: AuthService }], null);
})();

// src/app/shared/components/session-warning-modal/session-warning-modal.component.ts
var _SessionWarningModalComponent = class _SessionWarningModalComponent {
  constructor(dialogRef, inactivityService, sessionConfig) {
    this.dialogRef = dialogRef;
    this.inactivityService = inactivityService;
    this.sessionConfig = sessionConfig;
    this.tiempoRestante = 0;
    this.progreso = 100;
    this.tiempoTotal = this.sessionConfig.getTimeoutWarning();
  }
  ngOnInit() {
    this.timerSubscription = interval(1e3).subscribe(() => {
      this.tiempoRestante = this.inactivityService.getTiempoRestante();
      const tiempoTranscurrido = this.tiempoTotal - this.tiempoRestante;
      this.progreso = Math.max(0, (this.tiempoTotal - tiempoTranscurrido) / this.tiempoTotal * 100);
      if (this.tiempoRestante <= 0) {
        this.dialogRef.close("timeout");
      }
    });
  }
  ngOnDestroy() {
    this.timerSubscription?.unsubscribe();
  }
  continuarSesion() {
    this.inactivityService.resetearContador();
    this.dialogRef.close("continue");
  }
  cerrarSesion() {
    this.dialogRef.close("logout");
  }
};
_SessionWarningModalComponent.\u0275fac = function SessionWarningModalComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SessionWarningModalComponent)(\u0275\u0275directiveInject(MatDialogRef), \u0275\u0275directiveInject(InactivityService), \u0275\u0275directiveInject(SessionConfigService));
};
_SessionWarningModalComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SessionWarningModalComponent, selectors: [["app-session-warning-modal"]], decls: 20, vars: 4, consts: [[1, "session-warning-dialog"], [1, "warning-header"], ["name", "alert-circle", 1, "warning-icon", 3, "size"], ["mat-dialog-title", ""], [1, "warning-message"], [1, "countdown"], ["mode", "determinate", "color", "warn", 3, "value"], ["align", "end"], ["mat-raised-button", "", "color", "primary", 3, "click"], ["name", "refresh-cw", 3, "size"], ["mat-button", "", 3, "click"]], template: function SessionWarningModalComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
    \u0275\u0275element(2, "lucide-angular", 2);
    \u0275\u0275elementStart(3, "h2", 3);
    \u0275\u0275text(4, "Sesi\xF3n por expirar");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "mat-dialog-content")(6, "p", 4);
    \u0275\u0275text(7, " Tu sesi\xF3n est\xE1 a punto de expirar por inactividad. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 5);
    \u0275\u0275text(9, " Tiempo restante: ");
    \u0275\u0275elementStart(10, "strong");
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275text(12, " segundos ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(13, "mat-progress-bar", 6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "mat-dialog-actions", 7)(15, "button", 8);
    \u0275\u0275listener("click", function SessionWarningModalComponent_Template_button_click_15_listener() {
      return ctx.continuarSesion();
    });
    \u0275\u0275element(16, "lucide-angular", 9);
    \u0275\u0275text(17, " Continuar sesi\xF3n ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "button", 10);
    \u0275\u0275listener("click", function SessionWarningModalComponent_Template_button_click_18_listener() {
      return ctx.cerrarSesion();
    });
    \u0275\u0275text(19, " Cerrar sesi\xF3n ahora ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 48);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(ctx.tiempoRestante);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ctx.progreso);
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 20);
  }
}, dependencies: [
  CommonModule,
  MatDialogModule,
  MatDialogTitle,
  MatDialogActions,
  MatDialogContent,
  MatButtonModule,
  MatButton,
  MatProgressBarModule,
  MatProgressBar,
  LucideAngularModule,
  LucideAngularComponent
], styles: ["\n\n.session-warning-dialog[_ngcontent-%COMP%] {\n  min-width: 400px;\n  padding: 20px;\n}\n.warning-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 16px;\n}\n.warning-icon[_ngcontent-%COMP%] {\n  font-size: 48px;\n  width: 48px;\n  height: 48px;\n  color: #ff9800;\n}\nh2[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #333;\n}\n.warning-message[_ngcontent-%COMP%] {\n  font-size: 16px;\n  margin-bottom: 12px;\n  color: #555;\n}\n.countdown[_ngcontent-%COMP%] {\n  font-size: 18px;\n  margin: 16px 0;\n  text-align: center;\n}\n.countdown[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #f44336;\n  font-size: 24px;\n}\nmat-progress-bar[_ngcontent-%COMP%] {\n  margin: 16px 0;\n}\nmat-dialog-actions[_ngcontent-%COMP%] {\n  padding-top: 16px;\n  gap: 8px;\n}\nbutton[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  margin-right: 8px;\n}\n/*# sourceMappingURL=session-warning-modal.component.css.map */"] });
var SessionWarningModalComponent = _SessionWarningModalComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SessionWarningModalComponent, [{
    type: Component,
    args: [{ selector: "app-session-warning-modal", standalone: true, imports: [
      CommonModule,
      MatDialogModule,
      MatButtonModule,
      MatProgressBarModule,
      LucideAngularModule
    ], template: `
    <div class="session-warning-dialog">
      <div class="warning-header">
        <lucide-angular name="alert-circle" [size]="48" class="warning-icon"></lucide-angular>
        <h2 mat-dialog-title>Sesi\xF3n por expirar</h2>
      </div>

      <mat-dialog-content>
        <p class="warning-message">
          Tu sesi\xF3n est\xE1 a punto de expirar por inactividad.
        </p>
        <p class="countdown">
          Tiempo restante: <strong>{{ tiempoRestante }}</strong> segundos
        </p>
        <mat-progress-bar
          mode="determinate"
          [value]="progreso"
          color="warn">
        </mat-progress-bar>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-raised-button color="primary" (click)="continuarSesion()">
          <lucide-angular name="refresh-cw" [size]="20"></lucide-angular>
          Continuar sesi\xF3n
        </button>
        <button mat-button (click)="cerrarSesion()">
          Cerrar sesi\xF3n ahora
        </button>
      </mat-dialog-actions>
    </div>
  `, styles: ["/* angular:styles/component:css;4632e0051411b57209747c8fed9df77e23e771df210354bf7f74bf3f26127723;C:/Users/HP/Documents/Kubito-2.0-v1/cashi-discador-frontend/cashi-discador-frontend/src/app/shared/components/session-warning-modal/session-warning-modal.component.ts */\n.session-warning-dialog {\n  min-width: 400px;\n  padding: 20px;\n}\n.warning-header {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 16px;\n}\n.warning-icon {\n  font-size: 48px;\n  width: 48px;\n  height: 48px;\n  color: #ff9800;\n}\nh2 {\n  margin: 0;\n  color: #333;\n}\n.warning-message {\n  font-size: 16px;\n  margin-bottom: 12px;\n  color: #555;\n}\n.countdown {\n  font-size: 18px;\n  margin: 16px 0;\n  text-align: center;\n}\n.countdown strong {\n  color: #f44336;\n  font-size: 24px;\n}\nmat-progress-bar {\n  margin: 16px 0;\n}\nmat-dialog-actions {\n  padding-top: 16px;\n  gap: 8px;\n}\nbutton mat-icon {\n  margin-right: 8px;\n}\n/*# sourceMappingURL=session-warning-modal.component.css.map */\n"] }]
  }], () => [{ type: MatDialogRef }, { type: InactivityService }, { type: SessionConfigService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SessionWarningModalComponent, { className: "SessionWarningModalComponent", filePath: "src/app/shared/components/session-warning-modal/session-warning-modal.component.ts", lineNumber: 109 });
})();

// src/app/shared/components/authorization-approval-modal/authorization-approval-modal.component.ts
var _forTrack0 = ($index, $item) => $item.numeroCuota;
function AuthorizationApprovalModalComponent_Conditional_0_Conditional_56_For_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 26);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 27);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const cuota_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(cuota_r2.numeroCuota);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("S/ ", cuota_r2.monto == null ? null : cuota_r2.monto.toFixed(2));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.formatFecha(cuota_r2.fechaPago));
  }
}
function AuthorizationApprovalModalComponent_Conditional_0_Conditional_56_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19)(1, "table", 25)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Cuota");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Monto");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Fecha de Pago");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "tbody");
    \u0275\u0275repeaterCreate(11, AuthorizationApprovalModalComponent_Conditional_0_Conditional_56_For_12_Template, 7, 3, "tr", null, _forTrack0);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(11);
    \u0275\u0275repeater(ctx_r2.solicitud.cuotas);
  }
}
function AuthorizationApprovalModalComponent_Conditional_0_Conditional_57_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8)(1, "h4")(2, "span", 9);
    \u0275\u0275text(3, "\u{1F4AC}");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " Observaciones del Agente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 28);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" ", ctx_r2.solicitud.observacionesAgente, " ");
  }
}
function AuthorizationApprovalModalComponent_Conditional_0_Conditional_69_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 24);
  }
}
function AuthorizationApprovalModalComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "h2");
    \u0275\u0275text(5, "\u{1F4CB} Solicitud de Autorizaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 4)(7, "span", 5);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 6);
    \u0275\u0275text(10, "Solicita Autorizaci\xF3n");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(11, "div", 7)(12, "div", 8)(13, "h4")(14, "span", 9);
    \u0275\u0275text(15, "\u{1FAAA}");
    \u0275\u0275elementEnd();
    \u0275\u0275text(16, " Datos del Cliente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "div", 10)(18, "div", 11)(19, "label");
    \u0275\u0275text(20, "Nombre");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "p");
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "div", 11)(24, "label");
    \u0275\u0275text(25, "Documento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "p");
    \u0275\u0275text(27);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(28, "div", 8)(29, "h4")(30, "span", 9);
    \u0275\u0275text(31, "\u{1F3F7}\uFE0F");
    \u0275\u0275elementEnd();
    \u0275\u0275text(32, " Tipificaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "span", 12);
    \u0275\u0275text(34);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(35, "div", 8)(36, "h4")(37, "span", 9);
    \u0275\u0275text(38, "\u{1F4B0}");
    \u0275\u0275elementEnd();
    \u0275\u0275text(39, " Detalle del Cronograma");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "div", 13)(41, "div", 14)(42, "span", 15);
    \u0275\u0275text(43, "Monto Total");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "span", 16);
    \u0275\u0275text(45);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(46, "div", 14)(47, "span", 15);
    \u0275\u0275text(48, "N\xFAmero de Cuotas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "span", 17);
    \u0275\u0275text(50);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(51, "div", 14)(52, "span", 15);
    \u0275\u0275text(53, "Campo Origen");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(54, "span", 18);
    \u0275\u0275text(55);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(56, AuthorizationApprovalModalComponent_Conditional_0_Conditional_56_Template, 13, 0, "div", 19);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(57, AuthorizationApprovalModalComponent_Conditional_0_Conditional_57_Template, 7, 1, "div", 8);
    \u0275\u0275elementStart(58, "div", 8)(59, "h4")(60, "span", 9);
    \u0275\u0275text(61, "\u270F\uFE0F");
    \u0275\u0275elementEnd();
    \u0275\u0275text(62, " Comentarios (opcional)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(63, "textarea", 20);
    \u0275\u0275twoWayListener("ngModelChange", function AuthorizationApprovalModalComponent_Conditional_0_Template_textarea_ngModelChange_63_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.comentarios, $event) || (ctx_r2.comentarios = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275text(64, "              ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(65, "div", 21)(66, "button", 22);
    \u0275\u0275listener("click", function AuthorizationApprovalModalComponent_Conditional_0_Template_button_click_66_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.rechazar());
    });
    \u0275\u0275text(67, " \u274C Rechazar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(68, "button", 23);
    \u0275\u0275listener("click", function AuthorizationApprovalModalComponent_Conditional_0_Template_button_click_68_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.aprobar());
    });
    \u0275\u0275conditionalCreate(69, AuthorizationApprovalModalComponent_Conditional_0_Conditional_69_Template, 1, 0, "span", 24);
    \u0275\u0275text(70, " \u2705 Aprobar ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1("\u{1F464} ", ctx_r2.solicitud.nombreAgente);
    \u0275\u0275advance(14);
    \u0275\u0275textInterpolate(ctx_r2.solicitud.nombreCliente || "N/A");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r2.solicitud.documentoCliente || "N/A");
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r2.solicitud.nombreTipificacion || "Promesa de Pago");
    \u0275\u0275advance(11);
    \u0275\u0275textInterpolate1("S/ ", ctx_r2.solicitud.montoTotal == null ? null : ctx_r2.solicitud.montoTotal.toFixed(2));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r2.solicitud.numeroCuotas);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r2.solicitud.campoMontoOrigen || "Personalizado");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.solicitud.cuotas && ctx_r2.solicitud.cuotas.length > 0 ? 56 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.solicitud.observacionesAgente ? 57 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.comentarios);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r2.procesando());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.procesando());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.procesando() ? 69 : -1);
  }
}
var _AuthorizationApprovalModalComponent = class _AuthorizationApprovalModalComponent {
  constructor(autorizacionService) {
    this.autorizacionService = autorizacionService;
    this.visible = false;
    this.solicitud = null;
    this.visibleChange = new EventEmitter();
    this.aprobada = new EventEmitter();
    this.rechazada = new EventEmitter();
    this.comentarios = "";
    this.procesando = signal(false, ...ngDevMode ? [{ debugName: "procesando" }] : []);
  }
  formatFecha(fecha) {
    if (!fecha)
      return "N/A";
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    } catch {
      return fecha;
    }
  }
  aprobar() {
    if (!this.solicitud)
      return;
    this.procesando.set(true);
    this.aprobada.emit({
      solicitud: this.solicitud,
      comentarios: this.comentarios
    });
  }
  rechazar() {
    if (!this.solicitud)
      return;
    this.procesando.set(true);
    this.rechazada.emit({
      solicitud: this.solicitud,
      comentarios: this.comentarios
    });
  }
};
_AuthorizationApprovalModalComponent.\u0275fac = function AuthorizationApprovalModalComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AuthorizationApprovalModalComponent)(\u0275\u0275directiveInject(AutorizacionService));
};
_AuthorizationApprovalModalComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AuthorizationApprovalModalComponent, selectors: [["app-authorization-approval-modal"]], inputs: { visible: "visible", solicitud: "solicitud" }, outputs: { visibleChange: "visibleChange", aprobada: "aprobada", rechazada: "rechazada" }, decls: 1, vars: 1, consts: [[1, "modal-overlay"], [1, "modal-container"], [1, "modal-header"], [1, "header-left"], [1, "agent-info"], [1, "agent-name"], [1, "badge-warning"], [1, "modal-content"], [1, "section"], [1, "icon"], [1, "info-grid"], [1, "info-item"], [1, "badge-info"], [1, "summary-box"], [1, "summary-item"], [1, "summary-label"], [1, "summary-value", "highlight"], [1, "summary-value"], [1, "summary-value", "small"], [1, "table-container"], ["rows", "2", "placeholder", "Agrega comentarios para el agente...", 1, "comment-input", 3, "ngModelChange", "ngModel"], [1, "modal-footer"], [1, "btn", "btn-reject", 3, "click", "disabled"], [1, "btn", "btn-approve", 3, "click", "disabled"], [1, "spinner-small"], [1, "cuotas-table"], [1, "text-center"], [1, "font-medium"], [1, "observations-box"]], template: function AuthorizationApprovalModalComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, AuthorizationApprovalModalComponent_Conditional_0_Template, 71, 13, "div", 0);
  }
  if (rf & 2) {
    \u0275\u0275conditional(ctx.visible && ctx.solicitud ? 0 : -1);
  }
}, dependencies: [CommonModule, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel], styles: ["\n\n.modal-overlay[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.6);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 10001;\n  animation: _ngcontent-%COMP%_fadeIn 0.2s ease-out;\n}\n@keyframes _ngcontent-%COMP%_fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n.modal-container[_ngcontent-%COMP%] {\n  background: white;\n  border-radius: 16px;\n  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.35);\n  width: 95%;\n  max-width: 650px;\n  max-height: 90vh;\n  display: flex;\n  flex-direction: column;\n  animation: _ngcontent-%COMP%_slideUp 0.3s ease-out;\n}\n@keyframes _ngcontent-%COMP%_slideUp {\n  from {\n    opacity: 0;\n    transform: translateY(30px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.modal-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  padding: 1.25rem 1.5rem;\n  background:\n    linear-gradient(\n      135deg,\n      #f59e0b,\n      #d97706);\n  border-radius: 16px 16px 0 0;\n  color: white;\n}\n.header-left[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0 0 0.5rem 0;\n  font-size: 1.15rem;\n  font-weight: 600;\n}\n.agent-info[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n}\n.agent-name[_ngcontent-%COMP%] {\n  font-weight: 500;\n  font-size: 0.9rem;\n}\n.badge-warning[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.2);\n  padding: 0.2rem 0.6rem;\n  border-radius: 12px;\n  font-size: 0.7rem;\n  font-weight: 600;\n}\n.badge-info[_ngcontent-%COMP%] {\n  background: #dbeafe;\n  color: #1d4ed8;\n  padding: 0.3rem 0.75rem;\n  border-radius: 6px;\n  font-size: 0.8rem;\n  font-weight: 600;\n}\n.time-remaining[_ngcontent-%COMP%] {\n  text-align: right;\n  min-width: 100px;\n}\n.time-remaining.warning[_ngcontent-%COMP%]   .time-value[_ngcontent-%COMP%] {\n  color: #fef3c7;\n}\n.time-remaining.urgent[_ngcontent-%COMP%]   .time-value[_ngcontent-%COMP%] {\n  color: #fee2e2;\n  animation: _ngcontent-%COMP%_pulse 1s infinite;\n}\n@keyframes _ngcontent-%COMP%_pulse {\n  0%, 100% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0.6;\n  }\n}\n.time-display[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.5rem;\n  margin-bottom: 0.5rem;\n}\n.time-icon[_ngcontent-%COMP%] {\n  font-size: 1rem;\n}\n.time-value[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  font-weight: 700;\n}\n.progress-bar[_ngcontent-%COMP%] {\n  height: 4px;\n  background: rgba(255, 255, 255, 0.3);\n  border-radius: 2px;\n  overflow: hidden;\n}\n.progress-fill[_ngcontent-%COMP%] {\n  height: 100%;\n  background: white;\n  border-radius: 2px;\n  transition: width 1s linear;\n}\n.modal-content[_ngcontent-%COMP%] {\n  padding: 1.5rem;\n  overflow-y: auto;\n  flex: 1;\n}\n.section[_ngcontent-%COMP%] {\n  margin-bottom: 1.25rem;\n}\n.section[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  margin: 0 0 0.75rem 0;\n  font-size: 0.9rem;\n  color: #374151;\n  font-weight: 600;\n}\n.icon[_ngcontent-%COMP%] {\n  font-size: 1rem;\n}\n.info-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 1rem;\n}\n.info-item[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 0.75rem;\n  color: #6b7280;\n  margin-bottom: 0.25rem;\n}\n.info-item[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  font-weight: 600;\n  color: #1f2937;\n}\n.summary-box[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 1rem;\n  background:\n    linear-gradient(\n      135deg,\n      #f0f9ff,\n      #e0f2fe);\n  padding: 1rem;\n  border-radius: 10px;\n  margin-bottom: 1rem;\n}\n.summary-item[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.summary-label[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 0.7rem;\n  color: #64748b;\n  margin-bottom: 0.25rem;\n}\n.summary-value[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  font-weight: 700;\n  color: #1e293b;\n}\n.summary-value.highlight[_ngcontent-%COMP%] {\n  color: #0369a1;\n  font-size: 1.25rem;\n}\n.summary-value.small[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n}\n.table-container[_ngcontent-%COMP%] {\n  max-height: 150px;\n  overflow-y: auto;\n  border: 1px solid #e5e7eb;\n  border-radius: 8px;\n}\n.cuotas-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 0.85rem;\n}\n.cuotas-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  background: #f9fafb;\n  padding: 0.75rem;\n  text-align: left;\n  font-weight: 600;\n  color: #374151;\n  position: sticky;\n  top: 0;\n}\n.cuotas-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 0.6rem 0.75rem;\n  border-top: 1px solid #f3f4f6;\n}\n.cuotas-table[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover {\n  background: #f9fafb;\n}\n.text-center[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.font-medium[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.observations-box[_ngcontent-%COMP%] {\n  background: #f9fafb;\n  padding: 0.75rem;\n  border-radius: 8px;\n  font-size: 0.875rem;\n  color: #374151;\n  border: 1px solid #e5e7eb;\n}\n.comment-input[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 0.75rem;\n  border: 1px solid #d1d5db;\n  border-radius: 8px;\n  font-size: 0.875rem;\n  resize: vertical;\n  font-family: inherit;\n}\n.comment-input[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n}\n.modal-footer[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  padding: 1rem 1.5rem;\n  border-top: 1px solid #e5e7eb;\n  background: #f9fafb;\n  border-radius: 0 0 16px 16px;\n}\n.btn[_ngcontent-%COMP%] {\n  padding: 0.75rem 1.5rem;\n  border-radius: 8px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.btn-reject[_ngcontent-%COMP%] {\n  background: white;\n  border: 2px solid #ef4444;\n  color: #ef4444;\n}\n.btn-reject[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #fef2f2;\n}\n.btn-approve[_ngcontent-%COMP%] {\n  background: #22c55e;\n  border: none;\n  color: white;\n}\n.btn-approve[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #16a34a;\n}\n.btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.spinner-small[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  border: 2px solid rgba(255, 255, 255, 0.3);\n  border-top-color: white;\n  border-radius: 50%;\n  animation: _ngcontent-%COMP%_spin 1s linear infinite;\n}\n@keyframes _ngcontent-%COMP%_spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n@media (max-width: 640px) {\n  .summary-box[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .info-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .modal-header[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 1rem;\n  }\n  .time-remaining[_ngcontent-%COMP%] {\n    text-align: left;\n    width: 100%;\n  }\n  .time-display[_ngcontent-%COMP%] {\n    justify-content: flex-start;\n  }\n}\n/*# sourceMappingURL=authorization-approval-modal.component.css.map */"] });
var AuthorizationApprovalModalComponent = _AuthorizationApprovalModalComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AuthorizationApprovalModalComponent, [{
    type: Component,
    args: [{ selector: "app-authorization-approval-modal", standalone: true, imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe], template: `
    @if (visible && solicitud) {
      <div class="modal-overlay">
        <div class="modal-container">
          <!-- Header -->
          <div class="modal-header">
            <div class="header-left">
              <h2>\u{1F4CB} Solicitud de Autorizaci\xF3n</h2>
              <div class="agent-info">
                <span class="agent-name">\u{1F464} {{ solicitud.nombreAgente }}</span>
                <span class="badge-warning">Solicita Autorizaci\xF3n</span>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="modal-content">
            <!-- Informaci\xF3n del cliente -->
            <div class="section">
              <h4><span class="icon">\u{1FAAA}</span> Datos del Cliente</h4>
              <div class="info-grid">
                <div class="info-item">
                  <label>Nombre</label>
                  <p>{{ solicitud.nombreCliente || 'N/A' }}</p>
                </div>
                <div class="info-item">
                  <label>Documento</label>
                  <p>{{ solicitud.documentoCliente || 'N/A' }}</p>
                </div>
              </div>
            </div>

            <!-- Tipificaci\xF3n -->
            <div class="section">
              <h4><span class="icon">\u{1F3F7}\uFE0F</span> Tipificaci\xF3n</h4>
              <span class="badge-info">{{ solicitud.nombreTipificacion || 'Promesa de Pago' }}</span>
            </div>

            <!-- Detalles del cronograma -->
            <div class="section">
              <h4><span class="icon">\u{1F4B0}</span> Detalle del Cronograma</h4>

              <div class="summary-box">
                <div class="summary-item">
                  <span class="summary-label">Monto Total</span>
                  <span class="summary-value highlight">S/ {{ solicitud.montoTotal?.toFixed(2) }}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">N\xFAmero de Cuotas</span>
                  <span class="summary-value">{{ solicitud.numeroCuotas }}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Campo Origen</span>
                  <span class="summary-value small">{{ solicitud.campoMontoOrigen || 'Personalizado' }}</span>
                </div>
              </div>

              @if (solicitud.cuotas && solicitud.cuotas.length > 0) {
                <div class="table-container">
                  <table class="cuotas-table">
                    <thead>
                      <tr>
                        <th>Cuota</th>
                        <th>Monto</th>
                        <th>Fecha de Pago</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (cuota of solicitud.cuotas; track cuota.numeroCuota) {
                        <tr>
                          <td class="text-center">{{ cuota.numeroCuota }}</td>
                          <td class="font-medium">S/ {{ cuota.monto?.toFixed(2) }}</td>
                          <td>{{ formatFecha(cuota.fechaPago) }}</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              }
            </div>

            <!-- Observaciones del agente -->
            @if (solicitud.observacionesAgente) {
              <div class="section">
                <h4><span class="icon">\u{1F4AC}</span> Observaciones del Agente</h4>
                <div class="observations-box">
                  {{ solicitud.observacionesAgente }}
                </div>
              </div>
            }

            <!-- Comentarios del supervisor -->
            <div class="section">
              <h4><span class="icon">\u270F\uFE0F</span> Comentarios (opcional)</h4>
              <textarea
                [(ngModel)]="comentarios"
                rows="2"
                placeholder="Agrega comentarios para el agente..."
                class="comment-input">
              </textarea>
            </div>
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <button
              class="btn btn-reject"
              [disabled]="procesando()"
              (click)="rechazar()">
              \u274C Rechazar
            </button>
            <button
              class="btn btn-approve"
              [disabled]="procesando()"
              (click)="aprobar()">
              @if (procesando()) {
                <span class="spinner-small"></span>
              }
              \u2705 Aprobar
            </button>
          </div>
        </div>
      </div>
    }
  `, styles: ["/* angular:styles/component:css;28f74a085c2159615cf4d946a6d4f97d6775e120c26a1fbfac73ca4dad057e0a;C:/Users/HP/Documents/Kubito-2.0-v1/cashi-discador-frontend/cashi-discador-frontend/src/app/shared/components/authorization-approval-modal/authorization-approval-modal.component.ts */\n.modal-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.6);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 10001;\n  animation: fadeIn 0.2s ease-out;\n}\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n.modal-container {\n  background: white;\n  border-radius: 16px;\n  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.35);\n  width: 95%;\n  max-width: 650px;\n  max-height: 90vh;\n  display: flex;\n  flex-direction: column;\n  animation: slideUp 0.3s ease-out;\n}\n@keyframes slideUp {\n  from {\n    opacity: 0;\n    transform: translateY(30px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.modal-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  padding: 1.25rem 1.5rem;\n  background:\n    linear-gradient(\n      135deg,\n      #f59e0b,\n      #d97706);\n  border-radius: 16px 16px 0 0;\n  color: white;\n}\n.header-left h2 {\n  margin: 0 0 0.5rem 0;\n  font-size: 1.15rem;\n  font-weight: 600;\n}\n.agent-info {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n}\n.agent-name {\n  font-weight: 500;\n  font-size: 0.9rem;\n}\n.badge-warning {\n  background: rgba(255, 255, 255, 0.2);\n  padding: 0.2rem 0.6rem;\n  border-radius: 12px;\n  font-size: 0.7rem;\n  font-weight: 600;\n}\n.badge-info {\n  background: #dbeafe;\n  color: #1d4ed8;\n  padding: 0.3rem 0.75rem;\n  border-radius: 6px;\n  font-size: 0.8rem;\n  font-weight: 600;\n}\n.time-remaining {\n  text-align: right;\n  min-width: 100px;\n}\n.time-remaining.warning .time-value {\n  color: #fef3c7;\n}\n.time-remaining.urgent .time-value {\n  color: #fee2e2;\n  animation: pulse 1s infinite;\n}\n@keyframes pulse {\n  0%, 100% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0.6;\n  }\n}\n.time-display {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.5rem;\n  margin-bottom: 0.5rem;\n}\n.time-icon {\n  font-size: 1rem;\n}\n.time-value {\n  font-size: 1.1rem;\n  font-weight: 700;\n}\n.progress-bar {\n  height: 4px;\n  background: rgba(255, 255, 255, 0.3);\n  border-radius: 2px;\n  overflow: hidden;\n}\n.progress-fill {\n  height: 100%;\n  background: white;\n  border-radius: 2px;\n  transition: width 1s linear;\n}\n.modal-content {\n  padding: 1.5rem;\n  overflow-y: auto;\n  flex: 1;\n}\n.section {\n  margin-bottom: 1.25rem;\n}\n.section h4 {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  margin: 0 0 0.75rem 0;\n  font-size: 0.9rem;\n  color: #374151;\n  font-weight: 600;\n}\n.icon {\n  font-size: 1rem;\n}\n.info-grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 1rem;\n}\n.info-item label {\n  display: block;\n  font-size: 0.75rem;\n  color: #6b7280;\n  margin-bottom: 0.25rem;\n}\n.info-item p {\n  margin: 0;\n  font-weight: 600;\n  color: #1f2937;\n}\n.summary-box {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 1rem;\n  background:\n    linear-gradient(\n      135deg,\n      #f0f9ff,\n      #e0f2fe);\n  padding: 1rem;\n  border-radius: 10px;\n  margin-bottom: 1rem;\n}\n.summary-item {\n  text-align: center;\n}\n.summary-label {\n  display: block;\n  font-size: 0.7rem;\n  color: #64748b;\n  margin-bottom: 0.25rem;\n}\n.summary-value {\n  font-size: 1.1rem;\n  font-weight: 700;\n  color: #1e293b;\n}\n.summary-value.highlight {\n  color: #0369a1;\n  font-size: 1.25rem;\n}\n.summary-value.small {\n  font-size: 0.85rem;\n}\n.table-container {\n  max-height: 150px;\n  overflow-y: auto;\n  border: 1px solid #e5e7eb;\n  border-radius: 8px;\n}\n.cuotas-table {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 0.85rem;\n}\n.cuotas-table th {\n  background: #f9fafb;\n  padding: 0.75rem;\n  text-align: left;\n  font-weight: 600;\n  color: #374151;\n  position: sticky;\n  top: 0;\n}\n.cuotas-table td {\n  padding: 0.6rem 0.75rem;\n  border-top: 1px solid #f3f4f6;\n}\n.cuotas-table tr:hover {\n  background: #f9fafb;\n}\n.text-center {\n  text-align: center;\n}\n.font-medium {\n  font-weight: 600;\n}\n.observations-box {\n  background: #f9fafb;\n  padding: 0.75rem;\n  border-radius: 8px;\n  font-size: 0.875rem;\n  color: #374151;\n  border: 1px solid #e5e7eb;\n}\n.comment-input {\n  width: 100%;\n  padding: 0.75rem;\n  border: 1px solid #d1d5db;\n  border-radius: 8px;\n  font-size: 0.875rem;\n  resize: vertical;\n  font-family: inherit;\n}\n.comment-input:focus {\n  outline: none;\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n}\n.modal-footer {\n  display: flex;\n  justify-content: space-between;\n  padding: 1rem 1.5rem;\n  border-top: 1px solid #e5e7eb;\n  background: #f9fafb;\n  border-radius: 0 0 16px 16px;\n}\n.btn {\n  padding: 0.75rem 1.5rem;\n  border-radius: 8px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.btn-reject {\n  background: white;\n  border: 2px solid #ef4444;\n  color: #ef4444;\n}\n.btn-reject:hover:not(:disabled) {\n  background: #fef2f2;\n}\n.btn-approve {\n  background: #22c55e;\n  border: none;\n  color: white;\n}\n.btn-approve:hover:not(:disabled) {\n  background: #16a34a;\n}\n.btn:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.spinner-small {\n  width: 16px;\n  height: 16px;\n  border: 2px solid rgba(255, 255, 255, 0.3);\n  border-top-color: white;\n  border-radius: 50%;\n  animation: spin 1s linear infinite;\n}\n@keyframes spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n@media (max-width: 640px) {\n  .summary-box {\n    grid-template-columns: 1fr;\n  }\n  .info-grid {\n    grid-template-columns: 1fr;\n  }\n  .modal-header {\n    flex-direction: column;\n    gap: 1rem;\n  }\n  .time-remaining {\n    text-align: left;\n    width: 100%;\n  }\n  .time-display {\n    justify-content: flex-start;\n  }\n}\n/*# sourceMappingURL=authorization-approval-modal.component.css.map */\n"] }]
  }], () => [{ type: AutorizacionService }], { visible: [{
    type: Input
  }], solicitud: [{
    type: Input
  }], visibleChange: [{
    type: Output
  }], aprobada: [{
    type: Output
  }], rechazada: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AuthorizationApprovalModalComponent, { className: "AuthorizationApprovalModalComponent", filePath: "src/app/shared/components/authorization-approval-modal/authorization-approval-modal.component.ts", lineNumber: 493 });
})();

// src/app/shared/components/authorization-notification/authorization-notification.component.ts
function AuthorizationNotificationComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 3)(2, "div", 4)(3, "div", 5)(4, "span", 6);
    \u0275\u0275text(5, "\u26A0\uFE0F");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 7);
    \u0275\u0275text(7, "Nueva Solicitud de Autorizaci\xF3n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "button", 8);
    \u0275\u0275listener("click", function AuthorizationNotificationComponent_Conditional_0_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cerrarNotificacion());
    });
    \u0275\u0275text(9, "\xD7");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 9)(11, "p", 10)(12, "strong");
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275text(14, " solicita autorizaci\xF3n para: ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 11)(16, "div", 12)(17, "span", 13);
    \u0275\u0275text(18, "Monto:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "span", 14);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "div", 12)(22, "span", 13);
    \u0275\u0275text(23, "Cuotas:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "span", 15);
    \u0275\u0275text(25);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(26, "p", 16);
    \u0275\u0275text(27);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "div", 17)(29, "button", 18);
    \u0275\u0275listener("click", function AuthorizationNotificationComponent_Conditional_0_Template_button_click_29_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.rechazarRapido());
    });
    \u0275\u0275text(30, " \u274C Rechazar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "button", 19);
    \u0275\u0275listener("click", function AuthorizationNotificationComponent_Conditional_0_Template_button_click_31_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.verDetalles());
    });
    \u0275\u0275text(32, " \u{1F441}\uFE0F Ver Detalles ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(13);
    \u0275\u0275textInterpolate((tmp_1_0 = ctx_r1.solicitudActiva()) == null ? null : tmp_1_0.nombreAgente);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1("S/ ", (tmp_2_0 = ctx_r1.solicitudActiva()) == null ? null : tmp_2_0.montoTotal == null ? null : tmp_2_0.montoTotal.toFixed(2));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate((tmp_3_0 = ctx_r1.solicitudActiva()) == null ? null : tmp_3_0.numeroCuotas);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Cliente: ", (tmp_4_0 = ctx_r1.solicitudActiva()) == null ? null : tmp_4_0.nombreCliente, " ");
  }
}
function AuthorizationNotificationComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275listener("click", function AuthorizationNotificationComponent_Conditional_1_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.verSiguientePendiente());
    });
    \u0275\u0275elementStart(1, "span", 21);
    \u0275\u0275text(2, "\u{1F514}");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 22);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.cantidadPendientes());
  }
}
var _AuthorizationNotificationComponent = class _AuthorizationNotificationComponent {
  constructor(autorizacionService, authService) {
    this.autorizacionService = autorizacionService;
    this.authService = authService;
    this.mostrarNotificacion = signal(false, ...ngDevMode ? [{ debugName: "mostrarNotificacion" }] : []);
    this.solicitudActiva = signal(null, ...ngDevMode ? [{ debugName: "solicitudActiva" }] : []);
    this.solicitudParaModal = signal(null, ...ngDevMode ? [{ debugName: "solicitudParaModal" }] : []);
    this.mostrarModal = false;
    this.subscriptions = [];
    this.cantidadPendientes = computed(() => {
      return this.autorizacionService.solicitudesPendientes().length;
    }, ...ngDevMode ? [{ debugName: "cantidadPendientes" }] : []);
    try {
      this.audioNotificacion = new Audio("assets/sounds/notification.mp3");
    } catch (e) {
      console.log("[AUTH-NOTIF] No se pudo cargar audio");
    }
  }
  ngOnInit() {
    this.verificarRolYSuscribir();
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
  verificarRolYSuscribir() {
    const usuario = this.authService.getCurrentUser();
    if (!usuario || usuario.role !== "ADMIN" && usuario.role !== "SUPERVISOR") {
      console.log("[AUTH-NOTIF] Usuario no es supervisor/admin, no se suscriben notificaciones");
      return;
    }
    console.log("[AUTH-NOTIF] Suscribiendo a notificaciones de autorizaci\xF3n para:", usuario.username);
    this.autorizacionService.obtenerSolicitudesPendientes(usuario.id).subscribe();
    const sub = this.autorizacionService.nuevaSolicitud$.subscribe((solicitud) => {
      console.log("[AUTH-NOTIF] Nueva solicitud recibida:", solicitud);
      this.mostrarNuevaSolicitud(solicitud);
    });
    this.subscriptions.push(sub);
  }
  mostrarNuevaSolicitud(solicitud) {
    this.solicitudActiva.set(solicitud);
    this.mostrarNotificacion.set(true);
    this.reproducirSonido();
    setTimeout(() => {
      if (this.solicitudActiva()?.uuid === solicitud.uuid && this.mostrarNotificacion()) {
        this.cerrarNotificacion();
      }
    }, 3e4);
  }
  reproducirSonido() {
    try {
      if (this.audioNotificacion) {
        this.audioNotificacion.currentTime = 0;
        this.audioNotificacion.play().catch(() => {
          console.log("[AUTH-NOTIF] No se pudo reproducir sonido (requiere interacci\xF3n del usuario)");
        });
      }
    } catch (e) {
      console.log("[AUTH-NOTIF] Error reproduciendo sonido:", e);
    }
  }
  cerrarNotificacion() {
    this.mostrarNotificacion.set(false);
    this.solicitudActiva.set(null);
  }
  verDetalles() {
    const solicitud = this.solicitudActiva();
    if (solicitud) {
      this.solicitudParaModal.set(solicitud);
      this.mostrarModal = true;
      this.cerrarNotificacion();
    }
  }
  rechazarRapido() {
    const solicitud = this.solicitudActiva();
    if (!solicitud?.uuid)
      return;
    const usuario = this.authService.getCurrentUser();
    if (!usuario)
      return;
    const request = {
      uuidSolicitud: solicitud.uuid,
      idSupervisor: usuario.id,
      aprobada: false,
      comentarios: "Rechazada r\xE1pidamente"
    };
    this.autorizacionService.responderSolicitud(request).subscribe({
      next: () => {
        console.log("[AUTH-NOTIF] Solicitud rechazada r\xE1pidamente");
        this.cerrarNotificacion();
      },
      error: (err) => {
        console.error("[AUTH-NOTIF] Error al rechazar:", err);
      }
    });
  }
  verSiguientePendiente() {
    const pendientes = this.autorizacionService.solicitudesPendientes();
    if (pendientes.length > 0) {
      this.solicitudParaModal.set(pendientes[0]);
      this.mostrarModal = true;
    }
  }
  onAprobada(event) {
    const usuario = this.authService.getCurrentUser();
    if (!usuario || !event.solicitud.uuid)
      return;
    const request = {
      uuidSolicitud: event.solicitud.uuid,
      idSupervisor: usuario.id,
      aprobada: true,
      comentarios: event.comentarios
    };
    this.autorizacionService.responderSolicitud(request).subscribe({
      next: () => {
        console.log("[AUTH-NOTIF] Solicitud aprobada");
        this.mostrarModal = false;
        this.solicitudParaModal.set(null);
      },
      error: (err) => {
        console.error("[AUTH-NOTIF] Error al aprobar:", err);
      }
    });
  }
  onRechazada(event) {
    const usuario = this.authService.getCurrentUser();
    if (!usuario || !event.solicitud.uuid)
      return;
    const request = {
      uuidSolicitud: event.solicitud.uuid,
      idSupervisor: usuario.id,
      aprobada: false,
      comentarios: event.comentarios
    };
    this.autorizacionService.responderSolicitud(request).subscribe({
      next: () => {
        console.log("[AUTH-NOTIF] Solicitud rechazada");
        this.mostrarModal = false;
        this.solicitudParaModal.set(null);
      },
      error: (err) => {
        console.error("[AUTH-NOTIF] Error al rechazar:", err);
      }
    });
  }
};
_AuthorizationNotificationComponent.\u0275fac = function AuthorizationNotificationComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AuthorizationNotificationComponent)(\u0275\u0275directiveInject(AutorizacionService), \u0275\u0275directiveInject(AuthService));
};
_AuthorizationNotificationComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AuthorizationNotificationComponent, selectors: [["app-authorization-notification"]], decls: 3, vars: 4, consts: [[1, "authorization-notification"], ["title", "Tienes solicitudes de autorizaci\xF3n pendientes", 1, "pending-badge"], [3, "visibleChange", "aprobada", "rechazada", "visible", "solicitud"], [1, "notification-card"], [1, "notification-header"], [1, "header-left"], [1, "alert-icon"], [1, "header-title"], [1, "close-btn", 3, "click"], [1, "notification-body"], [1, "request-info"], [1, "amounts-row"], [1, "amount-item"], [1, "label"], [1, "value", "highlight"], [1, "value"], [1, "client-info"], [1, "notification-footer"], [1, "btn", "btn-reject", 3, "click"], [1, "btn", "btn-primary", 3, "click"], ["title", "Tienes solicitudes de autorizaci\xF3n pendientes", 1, "pending-badge", 3, "click"], [1, "bell-icon"], [1, "badge-count"]], template: function AuthorizationNotificationComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, AuthorizationNotificationComponent_Conditional_0_Template, 33, 4, "div", 0);
    \u0275\u0275conditionalCreate(1, AuthorizationNotificationComponent_Conditional_1_Template, 5, 1, "div", 1);
    \u0275\u0275elementStart(2, "app-authorization-approval-modal", 2);
    \u0275\u0275twoWayListener("visibleChange", function AuthorizationNotificationComponent_Template_app_authorization_approval_modal_visibleChange_2_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.mostrarModal, $event) || (ctx.mostrarModal = $event);
      return $event;
    });
    \u0275\u0275listener("aprobada", function AuthorizationNotificationComponent_Template_app_authorization_approval_modal_aprobada_2_listener($event) {
      return ctx.onAprobada($event);
    })("rechazada", function AuthorizationNotificationComponent_Template_app_authorization_approval_modal_rechazada_2_listener($event) {
      return ctx.onRechazada($event);
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275conditional(ctx.mostrarNotificacion() && ctx.solicitudActiva() ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.cantidadPendientes() > 0 && !ctx.mostrarNotificacion() ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("visible", ctx.mostrarModal);
    \u0275\u0275property("solicitud", ctx.solicitudParaModal());
  }
}, dependencies: [
  CommonModule,
  AuthorizationApprovalModalComponent
], styles: ["\n\n.authorization-notification[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 80px;\n  right: 20px;\n  z-index: 9999;\n  animation: _ngcontent-%COMP%_slideIn 0.3s ease-out;\n}\n@keyframes _ngcontent-%COMP%_slideIn {\n  from {\n    transform: translateX(100%);\n    opacity: 0;\n  }\n  to {\n    transform: translateX(0);\n    opacity: 1;\n  }\n}\n.notification-card[_ngcontent-%COMP%] {\n  width: 380px;\n  background: white;\n  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);\n  border-left: 4px solid #f59e0b;\n  border-radius: 8px;\n  overflow: hidden;\n}\n.notification-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0.75rem 1rem;\n  background: #fffbeb;\n  border-bottom: 1px solid #fef3c7;\n}\n.header-left[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.alert-icon[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n}\n.header-title[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: #92400e;\n}\n.close-btn[_ngcontent-%COMP%] {\n  background: none;\n  border: none;\n  font-size: 1.5rem;\n  color: #92400e;\n  cursor: pointer;\n  padding: 0;\n  line-height: 1;\n  opacity: 0.7;\n  transition: opacity 0.2s;\n}\n.close-btn[_ngcontent-%COMP%]:hover {\n  opacity: 1;\n}\n.notification-body[_ngcontent-%COMP%] {\n  padding: 1rem;\n}\n.request-info[_ngcontent-%COMP%] {\n  margin: 0 0 0.75rem 0;\n  color: #374151;\n}\n.amounts-row[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1.5rem;\n  margin-bottom: 0.5rem;\n}\n.amount-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.amount-item[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  color: #6b7280;\n}\n.amount-item[_ngcontent-%COMP%]   .value[_ngcontent-%COMP%] {\n  font-weight: 700;\n}\n.amount-item[_ngcontent-%COMP%]   .value.highlight[_ngcontent-%COMP%] {\n  color: #0369a1;\n}\n.client-info[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.875rem;\n  color: #6b7280;\n}\n.notification-footer[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.5rem;\n  padding: 0.75rem 1rem;\n  background: #f9fafb;\n  border-top: 1px solid #e5e7eb;\n}\n.btn[_ngcontent-%COMP%] {\n  padding: 0.5rem 1rem;\n  border-radius: 6px;\n  font-size: 0.875rem;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n.btn-reject[_ngcontent-%COMP%] {\n  background: white;\n  border: 1px solid #ef4444;\n  color: #ef4444;\n}\n.btn-reject[_ngcontent-%COMP%]:hover {\n  background: #fef2f2;\n}\n.btn-primary[_ngcontent-%COMP%] {\n  background: #3b82f6;\n  border: none;\n  color: white;\n}\n.btn-primary[_ngcontent-%COMP%]:hover {\n  background: #2563eb;\n}\n.pending-badge[_ngcontent-%COMP%] {\n  position: fixed;\n  bottom: 80px;\n  right: 20px;\n  width: 56px;\n  height: 56px;\n  background:\n    linear-gradient(\n      135deg,\n      #f59e0b,\n      #d97706);\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);\n  z-index: 9998;\n  transition: transform 0.2s, box-shadow 0.2s;\n  animation: _ngcontent-%COMP%_pulse-badge 2s infinite;\n}\n@keyframes _ngcontent-%COMP%_pulse-badge {\n  0%, 100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(1.05);\n  }\n}\n.pending-badge[_ngcontent-%COMP%]:hover {\n  transform: scale(1.1);\n  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);\n  animation: none;\n}\n.bell-icon[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n}\n.badge-count[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -5px;\n  right: -5px;\n  background: #ef4444;\n  color: white;\n  font-size: 0.75rem;\n  font-weight: bold;\n  min-width: 22px;\n  height: 22px;\n  border-radius: 11px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0 5px;\n  border: 2px solid white;\n}\n/*# sourceMappingURL=authorization-notification.component.css.map */"] });
var AuthorizationNotificationComponent = _AuthorizationNotificationComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AuthorizationNotificationComponent, [{
    type: Component,
    args: [{ selector: "app-authorization-notification", standalone: true, imports: [
      CommonModule,
      CurrencyPipe,
      AuthorizationApprovalModalComponent
    ], template: `
    <!-- Notificaci\xF3n flotante cuando llega una nueva solicitud -->
    @if (mostrarNotificacion() && solicitudActiva()) {
      <div class="authorization-notification">
        <div class="notification-card">
          <div class="notification-header">
            <div class="header-left">
              <span class="alert-icon">\u26A0\uFE0F</span>
              <span class="header-title">Nueva Solicitud de Autorizaci\xF3n</span>
            </div>
            <button class="close-btn" (click)="cerrarNotificacion()">&times;</button>
          </div>

          <div class="notification-body">
            <p class="request-info">
              <strong>{{ solicitudActiva()?.nombreAgente }}</strong> solicita autorizaci\xF3n para:
            </p>
            <div class="amounts-row">
              <div class="amount-item">
                <span class="label">Monto:</span>
                <span class="value highlight">S/ {{ solicitudActiva()?.montoTotal?.toFixed(2) }}</span>
              </div>
              <div class="amount-item">
                <span class="label">Cuotas:</span>
                <span class="value">{{ solicitudActiva()?.numeroCuotas }}</span>
              </div>
            </div>
            <p class="client-info">
              Cliente: {{ solicitudActiva()?.nombreCliente }}
            </p>
          </div>

          <div class="notification-footer">
            <button class="btn btn-reject" (click)="rechazarRapido()">
              \u274C Rechazar
            </button>
            <button class="btn btn-primary" (click)="verDetalles()">
              \u{1F441}\uFE0F Ver Detalles
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Indicador de solicitudes pendientes (badge en esquina) -->
    @if (cantidadPendientes() > 0 && !mostrarNotificacion()) {
      <div
        class="pending-badge"
        (click)="verSiguientePendiente()"
        title="Tienes solicitudes de autorizaci\xF3n pendientes">
        <span class="bell-icon">\u{1F514}</span>
        <span class="badge-count">{{ cantidadPendientes() }}</span>
      </div>
    }

    <!-- Modal de aprobaci\xF3n -->
    <app-authorization-approval-modal
      [(visible)]="mostrarModal"
      [solicitud]="solicitudParaModal()"
      (aprobada)="onAprobada($event)"
      (rechazada)="onRechazada($event)">
    </app-authorization-approval-modal>
  `, styles: ["/* angular:styles/component:css;3a89fef843667a0963531a5b3cbe2bdb5ae2cdda0493aab41eb4cb98c3931367;C:/Users/HP/Documents/Kubito-2.0-v1/cashi-discador-frontend/cashi-discador-frontend/src/app/shared/components/authorization-notification/authorization-notification.component.ts */\n.authorization-notification {\n  position: fixed;\n  top: 80px;\n  right: 20px;\n  z-index: 9999;\n  animation: slideIn 0.3s ease-out;\n}\n@keyframes slideIn {\n  from {\n    transform: translateX(100%);\n    opacity: 0;\n  }\n  to {\n    transform: translateX(0);\n    opacity: 1;\n  }\n}\n.notification-card {\n  width: 380px;\n  background: white;\n  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);\n  border-left: 4px solid #f59e0b;\n  border-radius: 8px;\n  overflow: hidden;\n}\n.notification-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0.75rem 1rem;\n  background: #fffbeb;\n  border-bottom: 1px solid #fef3c7;\n}\n.header-left {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.alert-icon {\n  font-size: 1.25rem;\n}\n.header-title {\n  font-weight: 600;\n  color: #92400e;\n}\n.close-btn {\n  background: none;\n  border: none;\n  font-size: 1.5rem;\n  color: #92400e;\n  cursor: pointer;\n  padding: 0;\n  line-height: 1;\n  opacity: 0.7;\n  transition: opacity 0.2s;\n}\n.close-btn:hover {\n  opacity: 1;\n}\n.notification-body {\n  padding: 1rem;\n}\n.request-info {\n  margin: 0 0 0.75rem 0;\n  color: #374151;\n}\n.amounts-row {\n  display: flex;\n  gap: 1.5rem;\n  margin-bottom: 0.5rem;\n}\n.amount-item {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.amount-item .label {\n  font-size: 0.875rem;\n  color: #6b7280;\n}\n.amount-item .value {\n  font-weight: 700;\n}\n.amount-item .value.highlight {\n  color: #0369a1;\n}\n.client-info {\n  margin: 0;\n  font-size: 0.875rem;\n  color: #6b7280;\n}\n.notification-footer {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.5rem;\n  padding: 0.75rem 1rem;\n  background: #f9fafb;\n  border-top: 1px solid #e5e7eb;\n}\n.btn {\n  padding: 0.5rem 1rem;\n  border-radius: 6px;\n  font-size: 0.875rem;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n.btn-reject {\n  background: white;\n  border: 1px solid #ef4444;\n  color: #ef4444;\n}\n.btn-reject:hover {\n  background: #fef2f2;\n}\n.btn-primary {\n  background: #3b82f6;\n  border: none;\n  color: white;\n}\n.btn-primary:hover {\n  background: #2563eb;\n}\n.pending-badge {\n  position: fixed;\n  bottom: 80px;\n  right: 20px;\n  width: 56px;\n  height: 56px;\n  background:\n    linear-gradient(\n      135deg,\n      #f59e0b,\n      #d97706);\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);\n  z-index: 9998;\n  transition: transform 0.2s, box-shadow 0.2s;\n  animation: pulse-badge 2s infinite;\n}\n@keyframes pulse-badge {\n  0%, 100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(1.05);\n  }\n}\n.pending-badge:hover {\n  transform: scale(1.1);\n  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);\n  animation: none;\n}\n.bell-icon {\n  font-size: 1.5rem;\n}\n.badge-count {\n  position: absolute;\n  top: -5px;\n  right: -5px;\n  background: #ef4444;\n  color: white;\n  font-size: 0.75rem;\n  font-weight: bold;\n  min-width: 22px;\n  height: 22px;\n  border-radius: 11px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0 5px;\n  border: 2px solid white;\n}\n/*# sourceMappingURL=authorization-notification.component.css.map */\n"] }]
  }], () => [{ type: AutorizacionService }, { type: AuthService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AuthorizationNotificationComponent, { className: "AuthorizationNotificationComponent", filePath: "src/app/shared/components/authorization-notification/authorization-notification.component.ts", lineNumber: 282 });
})();

// src/app/shared/components/agent-time-alert-overlay/agent-time-alert-overlay.component.ts
function AgentTimeAlertOverlayComponent_div_0_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7)(1, "div", 8);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 9);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.estadoTexto);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.formatTiempo(ctx_r1.segundosEnEstado));
  }
}
function AgentTimeAlertOverlayComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1)(1, "div", 2);
    \u0275\u0275listener("click", function AgentTimeAlertOverlayComponent_div_0_Template_div_click_1_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleExpanded());
    });
    \u0275\u0275element(2, "app-status-alarm-clock", 3);
    \u0275\u0275template(3, AgentTimeAlertOverlayComponent_div_0_div_3_Template, 5, 2, "div", 4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 5);
    \u0275\u0275listener("click", function AgentTimeAlertOverlayComponent_div_0_Template_button_click_4_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleSound($event));
    });
    \u0275\u0275element(5, "lucide-angular", 6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275classProp("warning", ctx_r1.colorIndicador === "amarillo")("critical", ctx_r1.colorIndicador === "rojo");
    \u0275\u0275advance();
    \u0275\u0275property("color", ctx_r1.colorIndicador)("excedido", ctx_r1.excedeTiempoMaximo)("size", 28);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.isExpanded);
    \u0275\u0275advance();
    \u0275\u0275classProp("active", ctx_r1.soundEnabled);
    \u0275\u0275property("title", ctx_r1.soundEnabled ? "Desactivar voz" : "Activar voz de alertas");
    \u0275\u0275advance();
    \u0275\u0275property("name", ctx_r1.soundEnabled ? "volume-2" : "volume-x")("size", 16);
  }
}
var _AgentTimeAlertOverlayComponent = class _AgentTimeAlertOverlayComponent {
  constructor(authService, agentStatusService) {
    this.authService = authService;
    this.agentStatusService = agentStatusService;
    this.isVisible = false;
    this.isExpanded = true;
    this.colorIndicador = "verde";
    this.excedeTiempoMaximo = false;
    this.segundosEnEstado = 0;
    this.estadoActual = "";
    this.estadoTexto = "";
    this.soundEnabled = false;
    this.SOUND_STORAGE_KEY = "agent_sound_enabled";
    this.lastAlertState = "";
    this.userId = null;
    this.userName = "";
  }
  ngOnInit() {
    this.loadSoundPreference();
    const user = this.authService.getCurrentUser();
    if (user?.role === "AGENT" && user.id) {
      this.isVisible = true;
      this.userId = user.id;
      this.userName = user.firstName || user.username || "Agente";
      this.startStatusPolling();
    }
    this.authService.currentUser$.subscribe((user2) => {
      if (user2?.role === "AGENT" && user2.id) {
        this.isVisible = true;
        this.userId = user2.id;
        this.userName = user2.firstName || user2.username || "Agente";
        if (!this.statusSubscription) {
          this.startStatusPolling();
        }
      } else {
        this.isVisible = false;
        this.stopStatusPolling();
      }
    });
  }
  ngOnDestroy() {
    this.stopStatusPolling();
  }
  startStatusPolling() {
    if (!this.userId)
      return;
    this.localTimerSubscription = interval(1e3).subscribe(() => {
      if (this.isVisible && this.estadoActual) {
        this.segundosEnEstado++;
      }
    });
    this.statusSubscription = interval(5e3).pipe(startWith(0), switchMap(() => this.agentStatusService.getAgentStatus(this.userId))).subscribe({
      next: (response) => {
        this.colorIndicador = response.colorIndicador || "verde";
        this.excedeTiempoMaximo = response.excedeTiempoMaximo || false;
        this.segundosEnEstado = response.segundosEnEstado || 0;
        this.estadoActual = response.estadoActual;
        this.estadoTexto = this.getEstadoTexto(response.estadoActual);
        if (this.soundEnabled && this.excedeTiempoMaximo) {
          const alertKey = `${this.estadoActual}-excedido`;
          if (this.lastAlertState !== alertKey) {
            this.lastAlertState = alertKey;
            this.speakAlert();
          }
        }
        if (this.estadoActual !== this.lastAlertState.split("-")[0]) {
          this.lastAlertState = "";
        }
      },
      error: (err) => console.error("Error polling agent status:", err)
    });
  }
  stopStatusPolling() {
    if (this.localTimerSubscription) {
      this.localTimerSubscription.unsubscribe();
      this.localTimerSubscription = void 0;
    }
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
      this.statusSubscription = void 0;
    }
  }
  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
  }
  toggleSound(event) {
    event.stopPropagation();
    this.soundEnabled = !this.soundEnabled;
    this.saveSoundPreference();
    if (this.soundEnabled) {
      this.speak("Alertas de voz activadas");
    }
  }
  /**
   * Carga la preferencia de sonido desde localStorage
   */
  loadSoundPreference() {
    const saved = localStorage.getItem(this.SOUND_STORAGE_KEY);
    this.soundEnabled = saved === "true";
  }
  /**
   * Guarda la preferencia de sonido en localStorage
   */
  saveSoundPreference() {
    localStorage.setItem(this.SOUND_STORAGE_KEY, String(this.soundEnabled));
  }
  /**
   * Usa Text-to-Speech para hablar la alerta
   */
  speakAlert() {
    const estadoHablado = this.getEstadoHablado(this.estadoActual);
    const mensaje = `Atenci\xF3n ${this.userName}. Llevas demasiado tiempo en estado ${estadoHablado}. Por favor, contin\xFAa con tu siguiente gesti\xF3n.`;
    this.speak(mensaje);
  }
  /**
   * Función genérica de Text-to-Speech
   */
  speak(text) {
    if (!("speechSynthesis" in window)) {
      console.warn("Text-to-Speech no soportado en este navegador");
      return;
    }
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    utterance.rate = 0.9;
    utterance.pitch = 0.8;
    utterance.volume = 1;
    const voices = speechSynthesis.getVoices();
    const spanishVoice = voices.find((v) => v.lang.startsWith("es"));
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }
    speechSynthesis.speak(utterance);
  }
  getEstadoTexto(estado) {
    const estados = {
      "DISPONIBLE": "Disponible",
      "EN_LLAMADA": "En Llamada",
      "TIPIFICANDO": "Tipificando",
      "EN_REUNION": "En Reuni\xF3n",
      "REFRIGERIO": "Refrigerio",
      "SSHH": "SSHH",
      "EN_MANUAL": "Modo Manual",
      "PAUSADO": "Pausado"
    };
    return estados[estado] || estado;
  }
  getEstadoHablado(estado) {
    const estados = {
      "DISPONIBLE": "disponible",
      "EN_LLAMADA": "en llamada",
      "TIPIFICANDO": "tipificando",
      "EN_REUNION": "en reuni\xF3n",
      "REFRIGERIO": "refrigerio",
      "SSHH": "ba\xF1o",
      "EN_MANUAL": "modo manual",
      "PAUSADO": "pausado"
    };
    return estados[estado] || estado;
  }
  formatTiempo(segundos) {
    if (!segundos || segundos < 0)
      return "00:00";
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor(segundos % 3600 / 60);
    const segs = segundos % 60;
    if (horas > 0) {
      return `${horas.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")}:${segs.toString().padStart(2, "0")}`;
    } else {
      return `${minutos.toString().padStart(2, "0")}:${segs.toString().padStart(2, "0")}`;
    }
  }
};
_AgentTimeAlertOverlayComponent.\u0275fac = function AgentTimeAlertOverlayComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AgentTimeAlertOverlayComponent)(\u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(AgentStatusService));
};
_AgentTimeAlertOverlayComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AgentTimeAlertOverlayComponent, selectors: [["app-agent-time-alert-overlay"]], decls: 1, vars: 1, consts: [["class", "agent-time-overlay", 4, "ngIf"], [1, "agent-time-overlay"], [1, "alarm-indicator", 3, "click"], [3, "color", "excedido", "size"], ["class", "time-info", 4, "ngIf"], [1, "sound-toggle", 3, "click", "title"], [3, "name", "size"], [1, "time-info"], [1, "estado-actual"], [1, "tiempo"]], template: function AgentTimeAlertOverlayComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, AgentTimeAlertOverlayComponent_div_0_Template, 6, 13, "div", 0);
  }
  if (rf & 2) {
    \u0275\u0275property("ngIf", ctx.isVisible);
  }
}, dependencies: [CommonModule, NgIf, LucideAngularModule, LucideAngularComponent, StatusAlarmClockComponent], styles: ['\n\n.agent-time-overlay[_ngcontent-%COMP%] {\n  position: fixed;\n  bottom: 20px;\n  right: 20px;\n  z-index: 9999;\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  gap: 8px;\n}\n.alarm-indicator[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  background:\n    linear-gradient(\n      135deg,\n      #1e293b 0%,\n      #0f172a 100%);\n  border: 2px solid #334155;\n  border-radius: 50px;\n  padding: 8px 12px;\n  cursor: pointer;\n  transition: all 0.3s ease;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);\n}\n.alarm-indicator[_ngcontent-%COMP%]:hover {\n  transform: scale(1.05);\n  border-color: #475569;\n}\n.alarm-indicator.warning[_ngcontent-%COMP%] {\n  border-color: #f59e0b;\n  box-shadow: 0 4px 20px rgba(245, 158, 11, 0.3);\n}\n.alarm-indicator.critical[_ngcontent-%COMP%] {\n  border-color: #ef4444;\n  box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4);\n  animation: _ngcontent-%COMP%_pulse-border 1.5s ease-in-out infinite;\n}\n@keyframes _ngcontent-%COMP%_pulse-border {\n  0%, 100% {\n    box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4);\n  }\n  50% {\n    box-shadow: 0 4px 30px rgba(239, 68, 68, 0.7);\n  }\n}\n.time-info[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n}\n.estado-actual[_ngcontent-%COMP%] {\n  font-size: 10px;\n  color: #94a3b8;\n  text-transform: uppercase;\n  font-weight: 600;\n}\n.tiempo[_ngcontent-%COMP%] {\n  font-size: 16px;\n  font-weight: bold;\n  color: white;\n  font-family: "Courier New", monospace;\n}\n.sound-toggle[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  border: 1px solid #475569;\n  background: #1e293b;\n  color: #94a3b8;\n  cursor: pointer;\n  transition: all 0.3s ease;\n}\n.sound-toggle[_ngcontent-%COMP%]:hover {\n  background: #334155;\n  color: white;\n}\n.sound-toggle.active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #22c55e 0%,\n      #16a34a 100%);\n  border-color: #22c55e;\n  color: white;\n}\n/*# sourceMappingURL=agent-time-alert-overlay.component.css.map */'] });
var AgentTimeAlertOverlayComponent = _AgentTimeAlertOverlayComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AgentTimeAlertOverlayComponent, [{
    type: Component,
    args: [{ selector: "app-agent-time-alert-overlay", standalone: true, imports: [CommonModule, LucideAngularModule, StatusAlarmClockComponent], template: `
    <!-- Overlay flotante - solo visible para agentes autenticados -->
    <div class="agent-time-overlay" *ngIf="isVisible">
      <!-- Indicador de reloj -->
      <div class="alarm-indicator"
           [class.warning]="colorIndicador === 'amarillo'"
           [class.critical]="colorIndicador === 'rojo'"
           (click)="toggleExpanded()">
        <app-status-alarm-clock
          [color]="colorIndicador"
          [excedido]="excedeTiempoMaximo"
          [size]="28">
        </app-status-alarm-clock>

        <!-- Tiempo en estado (solo cuando est\xE1 expandido) -->
        <div class="time-info" *ngIf="isExpanded">
          <div class="estado-actual">{{ estadoTexto }}</div>
          <div class="tiempo">{{ formatTiempo(segundosEnEstado) }}</div>
        </div>
      </div>

      <!-- Bot\xF3n de sonido -->
      <button class="sound-toggle"
              [class.active]="soundEnabled"
              (click)="toggleSound($event)"
              [title]="soundEnabled ? 'Desactivar voz' : 'Activar voz de alertas'">
        <lucide-angular [name]="soundEnabled ? 'volume-2' : 'volume-x'" [size]="16"></lucide-angular>
      </button>
    </div>
  `, styles: ['/* angular:styles/component:css;2336bea932b5ee577240e412d7ec96efdcd1120753199c91b7a4add138350cc8;C:/Users/HP/Documents/Kubito-2.0-v1/cashi-discador-frontend/cashi-discador-frontend/src/app/shared/components/agent-time-alert-overlay/agent-time-alert-overlay.component.ts */\n.agent-time-overlay {\n  position: fixed;\n  bottom: 20px;\n  right: 20px;\n  z-index: 9999;\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  gap: 8px;\n}\n.alarm-indicator {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  background:\n    linear-gradient(\n      135deg,\n      #1e293b 0%,\n      #0f172a 100%);\n  border: 2px solid #334155;\n  border-radius: 50px;\n  padding: 8px 12px;\n  cursor: pointer;\n  transition: all 0.3s ease;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);\n}\n.alarm-indicator:hover {\n  transform: scale(1.05);\n  border-color: #475569;\n}\n.alarm-indicator.warning {\n  border-color: #f59e0b;\n  box-shadow: 0 4px 20px rgba(245, 158, 11, 0.3);\n}\n.alarm-indicator.critical {\n  border-color: #ef4444;\n  box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4);\n  animation: pulse-border 1.5s ease-in-out infinite;\n}\n@keyframes pulse-border {\n  0%, 100% {\n    box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4);\n  }\n  50% {\n    box-shadow: 0 4px 30px rgba(239, 68, 68, 0.7);\n  }\n}\n.time-info {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n}\n.estado-actual {\n  font-size: 10px;\n  color: #94a3b8;\n  text-transform: uppercase;\n  font-weight: 600;\n}\n.tiempo {\n  font-size: 16px;\n  font-weight: bold;\n  color: white;\n  font-family: "Courier New", monospace;\n}\n.sound-toggle {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  border: 1px solid #475569;\n  background: #1e293b;\n  color: #94a3b8;\n  cursor: pointer;\n  transition: all 0.3s ease;\n}\n.sound-toggle:hover {\n  background: #334155;\n  color: white;\n}\n.sound-toggle.active {\n  background:\n    linear-gradient(\n      135deg,\n      #22c55e 0%,\n      #16a34a 100%);\n  border-color: #22c55e;\n  color: white;\n}\n/*# sourceMappingURL=agent-time-alert-overlay.component.css.map */\n'] }]
  }], () => [{ type: AuthService }, { type: AgentStatusService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AgentTimeAlertOverlayComponent, { className: "AgentTimeAlertOverlayComponent", filePath: "src/app/shared/components/agent-time-alert-overlay/agent-time-alert-overlay.component.ts", lineNumber: 144 });
})();

// src/app/core/services/notificaciones-sistema.service.ts
var _NotificacionesSistemaService = class _NotificacionesSistemaService {
  constructor(http) {
    this.http = http;
    this.apiUrl = `${environment.apiUrl}/notificaciones`;
    this.countSubject = new BehaviorSubject(0);
    this.count$ = this.countSubject.asObservable();
    interval(6e4).subscribe(() => {
      this.refreshCount();
    });
  }
  /**
   * Obtener todas las notificaciones
   * Maneja silenciosamente el error si el endpoint no existe
   */
  getAll() {
    return this.http.get(this.apiUrl).pipe(catchError(() => of([])));
  }
  /**
   * Obtener solo las no leídas
   */
  getNoLeidas() {
    return this.http.get(`${this.apiUrl}/no-leidas`);
  }
  /**
   * Obtener el conteo de no leídas
   * Maneja silenciosamente el error 404 si el endpoint no existe
   */
  getCount() {
    return this.http.get(`${this.apiUrl}/count`).pipe(tap((response) => this.countSubject.next(response.count)), catchError(() => {
      return of({ count: 0 });
    }));
  }
  /**
   * Refrescar el contador (llamar manualmente o desde el polling)
   */
  refreshCount() {
    this.getCount().subscribe();
  }
  /**
   * Marcar una notificación como leída
   */
  marcarComoLeida(id) {
    return this.http.patch(`${this.apiUrl}/${id}/leer`, {}).pipe(tap(() => this.refreshCount()));
  }
  /**
   * Marcar todas como leídas
   */
  marcarTodasComoLeidas() {
    return this.http.patch(`${this.apiUrl}/leer-todas`, {}).pipe(tap(() => this.countSubject.next(0)));
  }
};
_NotificacionesSistemaService.\u0275fac = function NotificacionesSistemaService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _NotificacionesSistemaService)(\u0275\u0275inject(HttpClient));
};
_NotificacionesSistemaService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _NotificacionesSistemaService, factory: _NotificacionesSistemaService.\u0275fac, providedIn: "root" });
var NotificacionesSistemaService = _NotificacionesSistemaService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NotificacionesSistemaService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/app.component.ts
function AppComponent_div_0_span_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 50);
    \u0275\u0275text(1, "CASHI");
    \u0275\u0275elementEnd();
  }
}
function AppComponent_div_0_a_9_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 53);
    \u0275\u0275text(1, "Cobranza");
    \u0275\u0275elementEnd();
  }
}
function AppComponent_div_0_a_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 51);
    \u0275\u0275element(1, "lucide-angular", 52);
    \u0275\u0275template(2, AppComponent_div_0_a_9_span_2_Template, 2, 0, "span", 16);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("title", ctx_r1.isSidebarCollapsed ? "Cobranza" : "");
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.isSidebarCollapsed);
  }
}
function AppComponent_div_0_a_10_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 53);
    \u0275\u0275text(1, "Clientes");
    \u0275\u0275elementEnd();
  }
}
function AppComponent_div_0_a_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 54);
    \u0275\u0275element(1, "lucide-angular", 55);
    \u0275\u0275template(2, AppComponent_div_0_a_10_span_2_Template, 2, 0, "span", 16);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("title", ctx_r1.isSidebarCollapsed ? "Clientes" : "");
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.isSidebarCollapsed);
  }
}
function AppComponent_div_0_span_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 53);
    \u0275\u0275text(1, "Gesti\xF3n Manual");
    \u0275\u0275elementEnd();
  }
}
function AppComponent_div_0_div_14_span_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 53);
    \u0275\u0275text(1, "Monitoreo");
    \u0275\u0275elementEnd();
  }
}
function AppComponent_div_0_div_14_lucide_angular_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "lucide-angular", 63);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("rotated", ctx_r1.isMonitoreoDropdownOpen);
    \u0275\u0275property("size", 18);
  }
}
function AppComponent_div_0_div_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 28)(1, "button", 29);
    \u0275\u0275listener("click", function AppComponent_div_0_div_14_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.toggleMonitoreoDropdown());
    });
    \u0275\u0275element(2, "lucide-angular", 56);
    \u0275\u0275template(3, AppComponent_div_0_div_14_span_3_Template, 2, 0, "span", 16)(4, AppComponent_div_0_div_14_lucide_angular_4_Template, 1, 3, "lucide-angular", 31);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 32)(6, "a", 57);
    \u0275\u0275listener("click", function AppComponent_div_0_div_14_Template_a_click_6_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.closeDropdowns());
    });
    \u0275\u0275element(7, "lucide-angular", 58);
    \u0275\u0275elementStart(8, "span", 59);
    \u0275\u0275text(9, "Llamadas Activas");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "a", 60);
    \u0275\u0275listener("click", function AppComponent_div_0_div_14_Template_a_click_10_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.closeDropdowns());
    });
    \u0275\u0275element(11, "lucide-angular", 61);
    \u0275\u0275elementStart(12, "span", 62);
    \u0275\u0275text(13, "M\xE9tricas en Tiempo Real");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275classProp("active", ctx_r1.isMonitoreoActive());
    \u0275\u0275property("title", ctx_r1.isSidebarCollapsed ? "Monitoreo" : "");
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.isSidebarCollapsed);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.isSidebarCollapsed);
    \u0275\u0275advance();
    \u0275\u0275classProp("show", ctx_r1.isMonitoreoDropdownOpen && !ctx_r1.isSidebarCollapsed);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 18);
  }
}
function AppComponent_div_0_div_16_span_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 53);
    \u0275\u0275text(1, "Carga de Datos");
    \u0275\u0275elementEnd();
  }
}
function AppComponent_div_0_div_16_lucide_angular_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "lucide-angular", 63);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("rotated", ctx_r1.isCargaDatosDropdownOpen);
    \u0275\u0275property("size", 18);
  }
}
function AppComponent_div_0_div_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 28)(1, "button", 29);
    \u0275\u0275listener("click", function AppComponent_div_0_div_16_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.toggleCargaDatosDropdown());
    });
    \u0275\u0275element(2, "lucide-angular", 30);
    \u0275\u0275template(3, AppComponent_div_0_div_16_span_3_Template, 2, 0, "span", 16)(4, AppComponent_div_0_div_16_lucide_angular_4_Template, 1, 3, "lucide-angular", 31);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 32)(6, "a", 64);
    \u0275\u0275listener("click", function AppComponent_div_0_div_16_Template_a_click_6_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.closeDropdowns());
    });
    \u0275\u0275element(7, "lucide-angular", 65);
    \u0275\u0275elementStart(8, "span", 66);
    \u0275\u0275text(9, "Carga Inicial de Mes");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "a", 67);
    \u0275\u0275listener("click", function AppComponent_div_0_div_16_Template_a_click_10_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.closeDropdowns());
    });
    \u0275\u0275element(11, "lucide-angular", 68);
    \u0275\u0275elementStart(12, "span", 69);
    \u0275\u0275text(13, "Carga Diaria");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275classProp("active", ctx_r1.isCargaDatosActive());
    \u0275\u0275property("title", ctx_r1.isSidebarCollapsed ? "Carga de Datos" : "");
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.isSidebarCollapsed);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.isSidebarCollapsed);
    \u0275\u0275advance();
    \u0275\u0275classProp("show", ctx_r1.isCargaDatosDropdownOpen && !ctx_r1.isSidebarCollapsed);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 18);
  }
}
function AppComponent_div_0_a_18_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 53);
    \u0275\u0275text(1, "Pagos Bancarios");
    \u0275\u0275elementEnd();
  }
}
function AppComponent_div_0_a_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 70);
    \u0275\u0275element(1, "lucide-angular", 71);
    \u0275\u0275template(2, AppComponent_div_0_a_18_span_2_Template, 2, 0, "span", 16);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("title", ctx_r1.isSidebarCollapsed ? "Pagos Bancarios" : "");
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.isSidebarCollapsed);
  }
}
function AppComponent_div_0_div_19_span_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 53);
    \u0275\u0275text(1, "Mantenimiento");
    \u0275\u0275elementEnd();
  }
}
function AppComponent_div_0_div_19_lucide_angular_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "lucide-angular", 63);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("rotated", ctx_r1.isMantenimientoDropdownOpen);
    \u0275\u0275property("size", 18);
  }
}
function AppComponent_div_0_div_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 28)(1, "button", 29);
    \u0275\u0275listener("click", function AppComponent_div_0_div_19_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.toggleMantenimientoDropdown());
    });
    \u0275\u0275element(2, "lucide-angular", 72);
    \u0275\u0275template(3, AppComponent_div_0_div_19_span_3_Template, 2, 0, "span", 16)(4, AppComponent_div_0_div_19_lucide_angular_4_Template, 1, 3, "lucide-angular", 31);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 32)(6, "a", 73);
    \u0275\u0275listener("click", function AppComponent_div_0_div_19_Template_a_click_6_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.closeDropdowns());
    });
    \u0275\u0275element(7, "lucide-angular", 74);
    \u0275\u0275elementStart(8, "span", 75);
    \u0275\u0275text(9, "Proveedores");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "a", 76);
    \u0275\u0275listener("click", function AppComponent_div_0_div_19_Template_a_click_10_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.closeDropdowns());
    });
    \u0275\u0275element(11, "lucide-angular", 77);
    \u0275\u0275elementStart(12, "span", 78);
    \u0275\u0275text(13, "Carteras");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "a", 79);
    \u0275\u0275listener("click", function AppComponent_div_0_div_19_Template_a_click_14_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.closeDropdowns());
    });
    \u0275\u0275element(15, "lucide-angular", 80);
    \u0275\u0275elementStart(16, "span", 81);
    \u0275\u0275text(17, "Subcarteras");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "a", 82);
    \u0275\u0275listener("click", function AppComponent_div_0_div_19_Template_a_click_18_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.closeDropdowns());
    });
    \u0275\u0275element(19, "lucide-angular", 83);
    \u0275\u0275elementStart(20, "span", 84);
    \u0275\u0275text(21, "Config. Cabeceras");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "a", 85);
    \u0275\u0275listener("click", function AppComponent_div_0_div_19_Template_a_click_22_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.closeDropdowns());
    });
    \u0275\u0275element(23, "lucide-angular", 86);
    \u0275\u0275elementStart(24, "span", 87);
    \u0275\u0275text(25, "Roles");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "a", 88);
    \u0275\u0275listener("click", function AppComponent_div_0_div_19_Template_a_click_26_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.closeDropdowns());
    });
    \u0275\u0275element(27, "lucide-angular", 55);
    \u0275\u0275elementStart(28, "span", 89);
    \u0275\u0275text(29, "Usuarios");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "a", 90);
    \u0275\u0275listener("click", function AppComponent_div_0_div_19_Template_a_click_30_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.closeDropdowns());
    });
    \u0275\u0275element(31, "lucide-angular", 91);
    \u0275\u0275elementStart(32, "span", 92);
    \u0275\u0275text(33, "Blacklist");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(34, "a", 93);
    \u0275\u0275listener("click", function AppComponent_div_0_div_19_Template_a_click_34_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.closeDropdowns());
    });
    \u0275\u0275element(35, "lucide-angular", 94);
    \u0275\u0275elementStart(36, "span", 95);
    \u0275\u0275text(37, "Tipificaciones");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275classProp("active", ctx_r1.isMantenimientoActive());
    \u0275\u0275property("title", ctx_r1.isSidebarCollapsed ? "Mantenimiento" : "");
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.isSidebarCollapsed);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.isSidebarCollapsed);
    \u0275\u0275advance();
    \u0275\u0275classProp("show", ctx_r1.isMantenimientoDropdownOpen && !ctx_r1.isSidebarCollapsed);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 18);
  }
}
function AppComponent_div_0_div_21_span_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 53);
    \u0275\u0275text(1, "Campa\xF1as");
    \u0275\u0275elementEnd();
  }
}
function AppComponent_div_0_div_21_lucide_angular_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "lucide-angular", 63);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("rotated", ctx_r1.isCampanasDropdownOpen);
    \u0275\u0275property("size", 18);
  }
}
function AppComponent_div_0_div_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 28)(1, "button", 29);
    \u0275\u0275listener("click", function AppComponent_div_0_div_21_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.toggleCampanasDropdown());
    });
    \u0275\u0275element(2, "lucide-angular", 96);
    \u0275\u0275template(3, AppComponent_div_0_div_21_span_3_Template, 2, 0, "span", 16)(4, AppComponent_div_0_div_21_lucide_angular_4_Template, 1, 3, "lucide-angular", 31);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 32)(6, "a", 97);
    \u0275\u0275listener("click", function AppComponent_div_0_div_21_Template_a_click_6_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.closeDropdowns());
    });
    \u0275\u0275element(7, "lucide-angular", 98);
    \u0275\u0275elementStart(8, "span", 99);
    \u0275\u0275text(9, "Gesti\xF3n de Campa\xF1as");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275classProp("active", ctx_r1.isCampanasActive());
    \u0275\u0275property("title", ctx_r1.isSidebarCollapsed ? "Campa\xF1as" : "");
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.isSidebarCollapsed);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.isSidebarCollapsed);
    \u0275\u0275advance();
    \u0275\u0275classProp("show", ctx_r1.isCampanasDropdownOpen && !ctx_r1.isSidebarCollapsed);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 18);
  }
}
function AppComponent_div_0_div_23_span_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 53);
    \u0275\u0275text(1, "Reportes");
    \u0275\u0275elementEnd();
  }
}
function AppComponent_div_0_div_23_lucide_angular_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "lucide-angular", 63);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("rotated", ctx_r1.isReportesDropdownOpen);
    \u0275\u0275property("size", 18);
  }
}
function AppComponent_div_0_div_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 28)(1, "button", 29);
    \u0275\u0275listener("click", function AppComponent_div_0_div_23_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.toggleReportesDropdown());
    });
    \u0275\u0275element(2, "lucide-angular", 100);
    \u0275\u0275template(3, AppComponent_div_0_div_23_span_3_Template, 2, 0, "span", 16)(4, AppComponent_div_0_div_23_lucide_angular_4_Template, 1, 3, "lucide-angular", 31);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 32)(6, "a", 101);
    \u0275\u0275listener("click", function AppComponent_div_0_div_23_Template_a_click_6_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.closeDropdowns());
    });
    \u0275\u0275element(7, "lucide-angular", 102);
    \u0275\u0275elementStart(8, "span", 103);
    \u0275\u0275text(9, "Reporte de Contacto");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "a", 104);
    \u0275\u0275listener("click", function AppComponent_div_0_div_23_Template_a_click_10_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.closeDropdowns());
    });
    \u0275\u0275element(11, "lucide-angular", 105);
    \u0275\u0275elementStart(12, "span", 106);
    \u0275\u0275text(13, "Reporte de Ranking");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "a", 107);
    \u0275\u0275listener("click", function AppComponent_div_0_div_23_Template_a_click_14_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.closeDropdowns());
    });
    \u0275\u0275element(15, "lucide-angular", 23);
    \u0275\u0275elementStart(16, "span", 108);
    \u0275\u0275text(17, "Reporte de Speech");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "a", 109);
    \u0275\u0275listener("click", function AppComponent_div_0_div_23_Template_a_click_18_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.closeDropdowns());
    });
    \u0275\u0275element(19, "lucide-angular", 110);
    \u0275\u0275elementStart(20, "span", 111);
    \u0275\u0275text(21, "Reporte de Monitoreo");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "a", 112);
    \u0275\u0275listener("click", function AppComponent_div_0_div_23_Template_a_click_22_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.closeDropdowns());
    });
    \u0275\u0275element(23, "lucide-angular", 113);
    \u0275\u0275elementStart(24, "span", 114);
    \u0275\u0275text(25, "Reporte PowerBI");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "a", 115);
    \u0275\u0275listener("click", function AppComponent_div_0_div_23_Template_a_click_26_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.closeDropdowns());
    });
    \u0275\u0275element(27, "lucide-angular", 9);
    \u0275\u0275elementStart(28, "span", 116);
    \u0275\u0275text(29, "PowerBI Cartera Propia");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275classProp("active", ctx_r1.isReportesActive());
    \u0275\u0275property("title", ctx_r1.isSidebarCollapsed ? "Reportes" : "");
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.isSidebarCollapsed);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.isSidebarCollapsed);
    \u0275\u0275advance();
    \u0275\u0275classProp("show", ctx_r1.isReportesDropdownOpen && !ctx_r1.isSidebarCollapsed);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 18);
  }
}
function AppComponent_div_0_a_24_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 53);
    \u0275\u0275text(1, "Generaci\xF3n de Campa\xF1as");
    \u0275\u0275elementEnd();
  }
}
function AppComponent_div_0_a_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 117);
    \u0275\u0275element(1, "lucide-angular", 96);
    \u0275\u0275template(2, AppComponent_div_0_a_24_span_2_Template, 2, 0, "span", 16);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("title", ctx_r1.isSidebarCollapsed ? "Generaci\xF3n de Campa\xF1as" : "");
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.isSidebarCollapsed);
  }
}
function AppComponent_div_0_span_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 53);
    \u0275\u0275text(1, "Gesti\xF3n de Tenores");
    \u0275\u0275elementEnd();
  }
}
function AppComponent_div_0_span_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 53);
    \u0275\u0275text(1, "Grabaciones");
    \u0275\u0275elementEnd();
  }
}
function AppComponent_div_0_span_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 53);
    \u0275\u0275text(1, "Blacklist");
    \u0275\u0275elementEnd();
  }
}
function AppComponent_div_0_span_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 53);
    \u0275\u0275text(1, "Consulta L\xEDneas");
    \u0275\u0275elementEnd();
  }
}
function AppComponent_div_0_span_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 53);
    \u0275\u0275text(1, "Cartas");
    \u0275\u0275elementEnd();
  }
}
function AppComponent_div_0_lucide_angular_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "lucide-angular", 63);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("rotated", ctx_r1.isCartasDropdownOpen);
    \u0275\u0275property("size", 18);
  }
}
function AppComponent_div_0_a_51_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "a", 118);
    \u0275\u0275listener("click", function AppComponent_div_0_a_51_Template_a_click_0_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.closeDropdowns());
    });
    \u0275\u0275element(1, "lucide-angular", 34);
    \u0275\u0275elementStart(2, "span", 119);
    \u0275\u0275text(3, "Cartas de Cesi\xF3n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 18);
  }
}
function AppComponent_div_0_a_52_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 53);
    \u0275\u0275text(1, "Extensiones");
    \u0275\u0275elementEnd();
  }
}
function AppComponent_div_0_a_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 120);
    \u0275\u0275element(1, "lucide-angular", 121);
    \u0275\u0275template(2, AppComponent_div_0_a_52_span_2_Template, 2, 0, "span", 16);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("title", ctx_r1.isSidebarCollapsed ? "Extensiones" : "");
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.isSidebarCollapsed);
  }
}
function AppComponent_div_0_a_54_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 53);
    \u0275\u0275text(1, "WhatsApp");
    \u0275\u0275elementEnd();
  }
}
function AppComponent_div_0_a_54_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 122);
    \u0275\u0275element(1, "lucide-angular", 123);
    \u0275\u0275template(2, AppComponent_div_0_a_54_span_2_Template, 2, 0, "span", 16);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("title", ctx_r1.isSidebarCollapsed ? "WhatsApp" : "");
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.isSidebarCollapsed);
  }
}
function AppComponent_div_0_span_59_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 53);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "async");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate((tmp_3_0 = \u0275\u0275pipeBind1(2, 1, ctx_r1.authService.currentUser$)) == null ? null : tmp_3_0.username);
  }
}
function AppComponent_div_0_div_60_span_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 127);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.notificacionesCount > 9 ? "9+" : ctx_r1.notificacionesCount, " ");
  }
}
function AppComponent_div_0_div_60_span_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 53);
    \u0275\u0275text(1, "Notificaciones");
    \u0275\u0275elementEnd();
  }
}
function AppComponent_div_0_div_60_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 28)(1, "button", 29);
    \u0275\u0275listener("click", function AppComponent_div_0_div_60_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.toggleNotificacionesDropdown());
    });
    \u0275\u0275elementStart(2, "div", 124);
    \u0275\u0275element(3, "lucide-angular", 125);
    \u0275\u0275template(4, AppComponent_div_0_div_60_span_4_Template, 2, 1, "span", 126);
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, AppComponent_div_0_div_60_span_5_Template, 2, 0, "span", 16);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("title", ctx_r1.isSidebarCollapsed ? "Notificaciones" : "");
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.notificacionesCount > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.isSidebarCollapsed);
  }
}
function AppComponent_div_0_lucide_angular_63_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "lucide-angular", 128);
  }
  if (rf & 2) {
    \u0275\u0275property("size", 20);
  }
}
function AppComponent_div_0_ng_template_64_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "lucide-angular", 129);
  }
  if (rf & 2) {
    \u0275\u0275property("size", 20);
  }
}
function AppComponent_div_0_span_66_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 53);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.isDarkMode() ? "Modo Claro" : "Modo Oscuro");
  }
}
function AppComponent_div_0_span_69_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 53);
    \u0275\u0275text(1, "Cerrar Sesi\xF3n");
    \u0275\u0275elementEnd();
  }
}
function AppComponent_div_0_div_74_button_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 143);
    \u0275\u0275listener("click", function AppComponent_div_0_div_74_button_8_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.marcarTodasLeidas());
    });
    \u0275\u0275text(1, " Marcar todas como le\xEDdas ");
    \u0275\u0275elementEnd();
  }
}
function AppComponent_div_0_div_74_div_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 144);
    \u0275\u0275element(1, "lucide-angular", 145);
    \u0275\u0275elementStart(2, "p", 146);
    \u0275\u0275text(3, "No hay notificaciones");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 32);
  }
}
function AppComponent_div_0_div_74_div_13_span_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 155);
  }
}
function AppComponent_div_0_div_74_div_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 147);
    \u0275\u0275listener("click", function AppComponent_div_0_div_74_div_13_Template_div_click_0_listener() {
      const notif_r13 = \u0275\u0275restoreView(_r12).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.marcarNotificacionLeida(notif_r13));
    });
    \u0275\u0275elementStart(1, "div", 148)(2, "div", 149);
    \u0275\u0275element(3, "lucide-angular", 5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 150)(5, "div", 133)(6, "span", 151);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275template(8, AppComponent_div_0_div_74_div_13_span_8_Template, 1, 0, "span", 152);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p", 153);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "span", 154);
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "date");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const notif_r13 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("bg-blue-900/20", !notif_r13.leida);
    \u0275\u0275advance(3);
    \u0275\u0275classMap(ctx_r1.getNotificacionColor(notif_r13.tipo));
    \u0275\u0275property("name", ctx_r1.getNotificacionIcon(notif_r13.tipo))("size", 18);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(notif_r13.titulo);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !notif_r13.leida);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(notif_r13.mensaje);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(13, 10, notif_r13.fechaCreacion, "dd/MM/yyyy HH:mm"));
  }
}
function AppComponent_div_0_div_74_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 130)(1, "div", 131);
    \u0275\u0275listener("click", function AppComponent_div_0_div_74_Template_div_click_1_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.isNotificacionesDropdownOpen = false);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 132)(3, "div", 133);
    \u0275\u0275element(4, "lucide-angular", 134);
    \u0275\u0275elementStart(5, "span", 135);
    \u0275\u0275text(6, "Notificaciones");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 136);
    \u0275\u0275template(8, AppComponent_div_0_div_74_button_8_Template, 2, 0, "button", 137);
    \u0275\u0275elementStart(9, "button", 138);
    \u0275\u0275listener("click", function AppComponent_div_0_div_74_Template_button_click_9_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.isNotificacionesDropdownOpen = false);
    });
    \u0275\u0275element(10, "lucide-angular", 139);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "div", 140);
    \u0275\u0275template(12, AppComponent_div_0_div_74_div_12_Template, 4, 1, "div", 141)(13, AppComponent_div_0_div_74_div_13_Template, 14, 13, "div", 142);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(4);
    \u0275\u0275property("ngIf", ctx_r1.notificacionesCount > 0);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r1.notificaciones.length === 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.notificaciones);
  }
}
function AppComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 3)(1, "button", 4);
    \u0275\u0275listener("click", function AppComponent_div_0_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleSidebar());
    });
    \u0275\u0275element(2, "lucide-angular", 5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "aside", 6)(4, "div", 7)(5, "div", 8);
    \u0275\u0275element(6, "lucide-angular", 9);
    \u0275\u0275elementEnd();
    \u0275\u0275template(7, AppComponent_div_0_span_7_Template, 2, 0, "span", 10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "nav", 11);
    \u0275\u0275template(9, AppComponent_div_0_a_9_Template, 3, 3, "a", 12)(10, AppComponent_div_0_a_10_Template, 3, 3, "a", 13);
    \u0275\u0275elementStart(11, "a", 14);
    \u0275\u0275element(12, "lucide-angular", 15);
    \u0275\u0275template(13, AppComponent_div_0_span_13_Template, 2, 0, "span", 16);
    \u0275\u0275elementEnd();
    \u0275\u0275template(14, AppComponent_div_0_div_14_Template, 14, 10, "div", 17);
    \u0275\u0275pipe(15, "async");
    \u0275\u0275template(16, AppComponent_div_0_div_16_Template, 14, 10, "div", 17);
    \u0275\u0275pipe(17, "async");
    \u0275\u0275template(18, AppComponent_div_0_a_18_Template, 3, 3, "a", 18)(19, AppComponent_div_0_div_19_Template, 38, 16, "div", 17);
    \u0275\u0275pipe(20, "async");
    \u0275\u0275template(21, AppComponent_div_0_div_21_Template, 10, 9, "div", 17);
    \u0275\u0275pipe(22, "async");
    \u0275\u0275template(23, AppComponent_div_0_div_23_Template, 30, 14, "div", 17)(24, AppComponent_div_0_a_24_Template, 3, 3, "a", 19);
    \u0275\u0275elementStart(25, "a", 20);
    \u0275\u0275element(26, "lucide-angular", 21);
    \u0275\u0275template(27, AppComponent_div_0_span_27_Template, 2, 0, "span", 16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "a", 22);
    \u0275\u0275element(29, "lucide-angular", 23);
    \u0275\u0275template(30, AppComponent_div_0_span_30_Template, 2, 0, "span", 16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "a", 24);
    \u0275\u0275element(32, "lucide-angular", 25);
    \u0275\u0275template(33, AppComponent_div_0_span_33_Template, 2, 0, "span", 16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "a", 26);
    \u0275\u0275element(35, "lucide-angular", 27);
    \u0275\u0275template(36, AppComponent_div_0_span_36_Template, 2, 0, "span", 16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "div", 28)(38, "button", 29);
    \u0275\u0275listener("click", function AppComponent_div_0_Template_button_click_38_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleCartasDropdown());
    });
    \u0275\u0275element(39, "lucide-angular", 30);
    \u0275\u0275template(40, AppComponent_div_0_span_40_Template, 2, 0, "span", 16)(41, AppComponent_div_0_lucide_angular_41_Template, 1, 3, "lucide-angular", 31);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "div", 32)(43, "a", 33);
    \u0275\u0275listener("click", function AppComponent_div_0_Template_a_click_43_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeDropdowns());
    });
    \u0275\u0275element(44, "lucide-angular", 34);
    \u0275\u0275elementStart(45, "span", 35);
    \u0275\u0275text(46, "Acuerdos de Pago");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(47, "a", 36);
    \u0275\u0275listener("click", function AppComponent_div_0_Template_a_click_47_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeDropdowns());
    });
    \u0275\u0275element(48, "lucide-angular", 37);
    \u0275\u0275elementStart(49, "span", 38);
    \u0275\u0275text(50, "Carta de No Adeudo");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(51, AppComponent_div_0_a_51_Template, 4, 1, "a", 39);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(52, AppComponent_div_0_a_52_Template, 3, 3, "a", 40);
    \u0275\u0275pipe(53, "async");
    \u0275\u0275template(54, AppComponent_div_0_a_54_Template, 3, 3, "a", 41);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(55, "div", 42)(56, "div", 43);
    \u0275\u0275pipe(57, "async");
    \u0275\u0275element(58, "lucide-angular", 44);
    \u0275\u0275template(59, AppComponent_div_0_span_59_Template, 3, 3, "span", 16);
    \u0275\u0275elementEnd();
    \u0275\u0275template(60, AppComponent_div_0_div_60_Template, 6, 4, "div", 17);
    \u0275\u0275pipe(61, "async");
    \u0275\u0275elementStart(62, "button", 29);
    \u0275\u0275listener("click", function AppComponent_div_0_Template_button_click_62_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleTheme());
    });
    \u0275\u0275template(63, AppComponent_div_0_lucide_angular_63_Template, 1, 1, "lucide-angular", 45)(64, AppComponent_div_0_ng_template_64_Template, 1, 1, "ng-template", null, 0, \u0275\u0275templateRefExtractor)(66, AppComponent_div_0_span_66_Template, 2, 1, "span", 16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(67, "button", 46);
    \u0275\u0275listener("click", function AppComponent_div_0_Template_button_click_67_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.logout());
    });
    \u0275\u0275element(68, "lucide-angular", 47);
    \u0275\u0275template(69, AppComponent_div_0_span_69_Template, 2, 0, "span", 16);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(70, "main", 48);
    \u0275\u0275element(71, "router-outlet");
    \u0275\u0275elementEnd();
    \u0275\u0275element(72, "app-authorization-notification")(73, "app-agent-time-alert-overlay");
    \u0275\u0275template(74, AppComponent_div_0_div_74_Template, 14, 5, "div", 49);
    \u0275\u0275pipe(75, "async");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_14_0;
    let tmp_15_0;
    let tmp_17_0;
    let tmp_18_0;
    let tmp_42_0;
    let tmp_44_0;
    let tmp_47_0;
    let tmp_55_0;
    const lightMode_r14 = \u0275\u0275reference(65);
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275classProp("collapsed", ctx_r1.isSidebarCollapsed);
    \u0275\u0275property("title", ctx_r1.isSidebarCollapsed ? "Expandir" : "Colapsar");
    \u0275\u0275advance();
    \u0275\u0275property("name", ctx_r1.isSidebarCollapsed ? "chevron-right" : "chevron-left")("size", 16);
    \u0275\u0275advance();
    \u0275\u0275classProp("collapsed", ctx_r1.isSidebarCollapsed);
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.isSidebarCollapsed);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r1.isAgent());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.isAgent());
    \u0275\u0275advance();
    \u0275\u0275property("title", ctx_r1.isSidebarCollapsed ? "Gesti\xF3n Manual" : "");
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.isSidebarCollapsed);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ((tmp_14_0 = \u0275\u0275pipeBind1(15, 58, ctx_r1.authService.currentUser$)) == null ? null : tmp_14_0.role) === "ADMIN");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ((tmp_15_0 = \u0275\u0275pipeBind1(17, 60, ctx_r1.authService.currentUser$)) == null ? null : tmp_15_0.role) === "ADMIN");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r1.isAdminOrSupervisor());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ((tmp_17_0 = \u0275\u0275pipeBind1(20, 62, ctx_r1.authService.currentUser$)) == null ? null : tmp_17_0.role) === "ADMIN");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ((tmp_18_0 = \u0275\u0275pipeBind1(22, 64, ctx_r1.authService.currentUser$)) == null ? null : tmp_18_0.role) === "ADMIN");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r1.isAdminOrSupervisor());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.isAdminOrSupervisor());
    \u0275\u0275advance();
    \u0275\u0275property("title", ctx_r1.isSidebarCollapsed ? "Gesti\xF3n de Tenores" : "");
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.isSidebarCollapsed);
    \u0275\u0275advance();
    \u0275\u0275property("title", ctx_r1.isSidebarCollapsed ? "Grabaciones" : "");
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.isSidebarCollapsed);
    \u0275\u0275advance();
    \u0275\u0275property("title", ctx_r1.isSidebarCollapsed ? "Blacklist" : "");
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.isSidebarCollapsed);
    \u0275\u0275advance();
    \u0275\u0275property("title", ctx_r1.isSidebarCollapsed ? "Consulta L\xEDneas" : "");
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.isSidebarCollapsed);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("active", ctx_r1.isCartasActive());
    \u0275\u0275property("title", ctx_r1.isSidebarCollapsed ? "Cartas" : "");
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.isSidebarCollapsed);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.isSidebarCollapsed);
    \u0275\u0275advance();
    \u0275\u0275classProp("show", ctx_r1.isCartasDropdownOpen && !ctx_r1.isSidebarCollapsed);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r1.isAdminOrSupervisor());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ((tmp_42_0 = \u0275\u0275pipeBind1(53, 66, ctx_r1.authService.currentUser$)) == null ? null : tmp_42_0.role) === "ADMIN");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r1.isAgent());
    \u0275\u0275advance(2);
    \u0275\u0275property("title", ctx_r1.isSidebarCollapsed ? (tmp_44_0 = \u0275\u0275pipeBind1(57, 68, ctx_r1.authService.currentUser$)) == null ? null : tmp_44_0.username : "");
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.isSidebarCollapsed);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ((tmp_47_0 = \u0275\u0275pipeBind1(61, 70, ctx_r1.authService.currentUser$)) == null ? null : tmp_47_0.role) === "ADMIN");
    \u0275\u0275advance(2);
    \u0275\u0275property("title", ctx_r1.isSidebarCollapsed ? ctx_r1.isDarkMode() ? "Modo Claro" : "Modo Oscuro" : "");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.isDarkMode())("ngIfElse", lightMode_r14);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", !ctx_r1.isSidebarCollapsed);
    \u0275\u0275advance();
    \u0275\u0275property("title", ctx_r1.isSidebarCollapsed ? "Cerrar Sesi\xF3n" : "");
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.isSidebarCollapsed);
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", ctx_r1.isNotificacionesDropdownOpen && ((tmp_55_0 = \u0275\u0275pipeBind1(75, 72, ctx_r1.authService.currentUser$)) == null ? null : tmp_55_0.role) === "ADMIN");
  }
}
function AppComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275element(1, "router-outlet");
    \u0275\u0275elementEnd();
  }
}
var _AppComponent = class _AppComponent {
  constructor(authService, themeService, websocketService, sipService, inactivityService, sessionConfig, agentStatusService, recordatoriosService, notificacionesService, dialog, router) {
    this.authService = authService;
    this.themeService = themeService;
    this.websocketService = websocketService;
    this.sipService = sipService;
    this.inactivityService = inactivityService;
    this.sessionConfig = sessionConfig;
    this.agentStatusService = agentStatusService;
    this.recordatoriosService = recordatoriosService;
    this.notificacionesService = notificacionesService;
    this.dialog = dialog;
    this.router = router;
    this.title = "Call Center";
    this.hasNavigatedToTypification = false;
    this.sessionClosing = false;
    this.callActivatedTimestamp = null;
    this.navigationTimeout = null;
    this.isSidebarCollapsed = false;
    this.isMonitoreoDropdownOpen = false;
    this.isCargaDatosDropdownOpen = false;
    this.isMantenimientoDropdownOpen = false;
    this.isCampanasDropdownOpen = false;
    this.isReportesDropdownOpen = false;
    this.isBlacklistDropdownOpen = false;
    this.isCartasDropdownOpen = false;
    this.isNotificacionesDropdownOpen = false;
    this.notificaciones = [];
    this.notificacionesCount = 0;
  }
  // Notificaciones methods
  toggleNotificacionesDropdown() {
    this.isNotificacionesDropdownOpen = !this.isNotificacionesDropdownOpen;
    if (this.isNotificacionesDropdownOpen) {
      this.loadNotificaciones();
    }
  }
  loadNotificaciones() {
    this.notificacionesService.getAll().subscribe({
      next: (data) => this.notificaciones = data,
      error: (err) => console.error("Error cargando notificaciones:", err)
    });
  }
  refreshNotificacionesCount() {
    this.notificacionesService.getCount().subscribe({
      next: (response) => this.notificacionesCount = response.count,
      error: (err) => console.error("Error obteniendo count:", err)
    });
  }
  marcarNotificacionLeida(notif) {
    if (!notif.leida) {
      this.notificacionesService.marcarComoLeida(notif.id).subscribe({
        next: () => {
          notif.leida = true;
          this.notificacionesCount = Math.max(0, this.notificacionesCount - 1);
        }
      });
    }
  }
  marcarTodasLeidas() {
    this.notificacionesService.marcarTodasComoLeidas().subscribe({
      next: () => {
        this.notificaciones.forEach((n) => n.leida = true);
        this.notificacionesCount = 0;
      }
    });
  }
  getNotificacionIcon(tipo) {
    switch (tipo) {
      case "ARCHIVADO_MENSUAL":
        return "archive";
      case "ERROR":
        return "alert-circle";
      default:
        return "bell";
    }
  }
  getNotificacionColor(tipo) {
    switch (tipo) {
      case "ARCHIVADO_MENSUAL":
        return "text-green-400";
      case "ERROR":
        return "text-red-400";
      default:
        return "text-blue-400";
    }
  }
  ngOnInit() {
    this.sessionConfig.cargarConfiguracion().subscribe();
    this.authService.currentUser$.subscribe((user) => {
      if (user && this.authService.isAuthenticated()) {
        this.websocketService.connect();
        this.iniciarMonitoreoInactividad();
        this.conectarFreeSWITCH(user);
        if (user.role === "ADMIN") {
          this.refreshNotificacionesCount();
        }
      } else {
        this.inactivityService.detener();
        this.websocketService.disconnect();
        this.sipService.unregister();
      }
    });
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.checkTextOverflow();
    }, 100);
  }
  ngOnDestroy() {
    this.warningSubscription?.unsubscribe();
    this.timeoutSubscription?.unsubscribe();
    this.callStatusSubscription?.unsubscribe();
    this.inactivityService.detener();
    if (this.navigationTimeout) {
      clearTimeout(this.navigationTimeout);
      this.navigationTimeout = null;
    }
  }
  onResize() {
    this.checkTextOverflow();
  }
  checkTextOverflow() {
    const textElements = document.querySelectorAll(".item-text");
    textElements.forEach((el) => {
      const element = el;
      if (element.offsetParent === null) {
        return;
      }
      const isOverflowing = element.scrollWidth > element.clientWidth;
      if (isOverflowing) {
        element.classList.add("text-overflowing");
      } else {
        element.classList.remove("text-overflowing");
      }
    });
  }
  iniciarMonitoreoInactividad() {
    this.sessionClosing = false;
    this.inactivityService.iniciar();
    this.warningSubscription = this.inactivityService.onWarning$.subscribe(() => {
      this.mostrarAdvertenciaInactividad();
    });
    this.timeoutSubscription = this.inactivityService.onTimeout$.subscribe(() => {
      this.cerrarSesionPorInactividad();
    });
  }
  mostrarAdvertenciaInactividad() {
    if (this.dialogRef) {
      return;
    }
    this.dialogRef = this.dialog.open(SessionWarningModalComponent, {
      width: "450px",
      disableClose: true,
      hasBackdrop: true
    });
    this.dialogRef.afterClosed().subscribe((result) => {
      this.dialogRef = null;
      if (result === "logout") {
        this.logout();
      }
    });
  }
  cerrarSesionPorInactividad() {
    if (this.sessionClosing) {
      return;
    }
    this.sessionClosing = true;
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
    }
    this.logout();
    setTimeout(() => {
      alert("Tu sesi\xF3n ha expirado por inactividad");
      this.sessionClosing = false;
    }, 500);
  }
  /**
   * Conectar automáticamente a FreeSWITCH al iniciar sesión
   * Igual que en test-softphone.component.ts
   */
  conectarFreeSWITCH(user) {
    return __async(this, null, function* () {
      if (!user.sipExtension) {
        console.warn("\u26A0\uFE0F Usuario sin extensi\xF3n SIP");
        return;
      }
      try {
        console.log("\u{1F50C} Conectando autom\xE1ticamente a FreeSWITCH...");
        yield this.sipService.register(user.sipExtension, "1234", environment.freeswitchWsUrl, environment.freeswitchDomain);
        console.log("\u2705 Conectado a FreeSWITCH exitosamente");
        this.sipService.enableAutoAnswer();
        console.log("\u{1F916} Auto-answer HABILITADO para auto-dialer");
        if (this.callStatusSubscription) {
          console.log("\u{1F9F9} Limpiando subscription anterior de call status");
          this.callStatusSubscription.unsubscribe();
        }
        this.callStatusSubscription = this.sipService.onCallStatus.subscribe((state) => {
          console.log(`\u{1F4E1} [App] Estado de llamada: ${state}`);
          if (state === CallState.ACTIVE && !this.hasNavigatedToTypification) {
            if (this.navigationTimeout) {
              console.log("\u26A0\uFE0F [App] Cancelando timeout de navegaci\xF3n anterior");
              clearTimeout(this.navigationTimeout);
            }
            this.callActivatedTimestamp = Date.now();
            console.log("\u{1F4DE} [App] Llamada ACTIVA, esperando 2s para confirmar conexi\xF3n estable...");
            this.navigationTimeout = setTimeout(() => {
              const callDuration = this.callActivatedTimestamp ? Date.now() - this.callActivatedTimestamp : 0;
              const currentState = this.sipService.getCallState();
              if (callDuration >= 2e3 && currentState === CallState.ACTIVE && !this.hasNavigatedToTypification) {
                console.log(`\u{1F4DE} [App] Llamada estable (${callDuration}ms), navegando a tipificaci\xF3n...`);
                this.hasNavigatedToTypification = true;
                this.router.navigate(["/collection-management"]);
              } else {
                console.log(`\u26A0\uFE0F [App] Llamada termin\xF3 antes de establecerse (${callDuration}ms, estado: ${currentState}), NO navegando`);
              }
            }, 2e3);
          }
          if (state === CallState.ENDED || state === CallState.IDLE) {
            if (this.navigationTimeout && !this.hasNavigatedToTypification) {
              clearTimeout(this.navigationTimeout);
              this.navigationTimeout = null;
              console.log("\u{1F6AB} [App] Navegaci\xF3n cancelada - llamada termin\xF3 sin establecerse");
            }
            this.hasNavigatedToTypification = false;
            this.callActivatedTimestamp = null;
          }
        });
        console.log("\u{1F4DE} Escuchando llamadas entrantes...");
        this.verificarRecordatoriosPendientes(user);
      } catch (error) {
        console.error("\u274C Error al conectar a FreeSWITCH:", error);
      }
    });
  }
  /**
   * Verifica si el agente tiene recordatorios pendientes y muestra el modal
   */
  verificarRecordatoriosPendientes(user) {
    if (!user?.id)
      return;
    if (user.role !== "AGENT")
      return;
    setTimeout(() => {
      this.recordatoriosService.getMisRecordatoriosHoy(user.id).subscribe({
        next: (recordatorios) => {
          const pendientes = recordatorios.filter((r) => !r.yaLlamoHoy).length;
          if (pendientes > 0) {
            console.log(`\u{1F514} Mostrando modal de recordatorios: ${pendientes} pendientes`);
            const dialogRef = this.dialog.open(RecordatoriosModalComponent, {
              width: "450px",
              disableClose: true,
              data: {
                cantidad: recordatorios.length,
                pendientes,
                idAgente: user.id
              },
              panelClass: "recordatorios-modal"
            });
            dialogRef.afterClosed().subscribe((result) => {
              if (result?.action === "call" && result.recordatorio) {
                console.log("\u{1F4DE} Iniciando llamada de recordatorio:", result.recordatorio);
                this.iniciarLlamadaRecordatorio(result.recordatorio, user.id);
              }
            });
          }
        },
        error: (err) => {
          console.error("Error verificando recordatorios:", err);
        }
      });
    }, 2e3);
  }
  /**
   * Inicia una llamada de recordatorio de promesa de pago
   */
  iniciarLlamadaRecordatorio(recordatorio, idAgente) {
    const telefono = recordatorio.telefono;
    if (!telefono) {
      console.error("\u274C No hay tel\xE9fono para el recordatorio");
      return;
    }
    console.log(`\u{1F4DE} Llamando a ${recordatorio.nombreCliente} (${telefono}) para recordatorio de cuota ${recordatorio.numeroCuota}`);
    sessionStorage.setItem("recordatorioEnCurso", JSON.stringify({
      idCuota: recordatorio.idCuota,
      idAgente,
      idCliente: recordatorio.idCliente,
      nombreCliente: recordatorio.nombreCliente,
      telefono,
      monto: recordatorio.monto,
      numeroCuota: recordatorio.numeroCuota,
      totalCuotas: recordatorio.totalCuotas
    }));
    this.agentStatusService.changeStatus(idAgente, {
      estado: "EN_LLAMADA",
      notas: `Recordatorio cuota ${recordatorio.numeroCuota} - ${recordatorio.nombreCliente}`
    }).subscribe({
      next: () => {
        console.log("\u{1F4DE} Estado cambiado a EN_LLAMADA");
        this.sipService.call(telefono);
      },
      error: (err) => {
        console.error("\u274C Error cambiando estado a EN_LLAMADA:", err);
        this.sipService.call(telefono);
      }
    });
  }
  logout() {
    console.log("[LOGOUT] Iniciando proceso de cierre de sesi\xF3n...");
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.id) {
      try {
        this.recordatoriosService.detenerDialer(currentUser.id).subscribe({
          next: () => console.log("[LOGOUT] Dialer de recordatorios detenido"),
          error: () => {
          }
          // Ignorar errores si no había dialer activo
        });
      } catch (e) {
      }
      try {
        this.agentStatusService.disconnectAgent(currentUser.id).subscribe({
          next: () => console.log("[LOGOUT] Estado de agente eliminado en backend"),
          error: (e) => console.error("[LOGOUT] Error eliminando estado de agente:", e)
        });
      } catch (e) {
        console.error("[LOGOUT] Error llamando disconnectAgent:", e);
      }
    }
    try {
      this.inactivityService.detener();
      console.log("[LOGOUT] Servicio de inactividad detenido");
    } catch (e) {
      console.error("[LOGOUT] Error deteniendo inactividad:", e);
    }
    try {
      this.websocketService.disconnect();
      console.log("[LOGOUT] WebSocket desconectado");
    } catch (e) {
      console.error("[LOGOUT] Error desconectando WebSocket:", e);
    }
    try {
      this.sipService.unregister();
      console.log("[LOGOUT] SIP desregistrado");
    } catch (e) {
      console.error("[LOGOUT] Error desregistrando SIP:", e);
    }
    try {
      sessionStorage.removeItem("recordatorioEnCurso");
      console.log("[LOGOUT] SessionStorage limpiado");
    } catch (e) {
    }
    console.log("[LOGOUT] Ejecutando authService.logout()...");
    this.authService.logout();
    setTimeout(() => {
      if (this.router.url !== "/login") {
        console.log("[LOGOUT] Forzando navegaci\xF3n a /login...");
        this.router.navigate(["/login"], { replaceUrl: true });
      }
    }, 100);
  }
  isLoginPage() {
    return this.router.url === "/login";
  }
  // Sidebar methods
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    setTimeout(() => {
      this.checkTextOverflow();
    }, 350);
  }
  // Navbar methods
  toggleMonitoreoDropdown() {
    if (this.isSidebarCollapsed) {
      this.isSidebarCollapsed = false;
    }
    this.isMonitoreoDropdownOpen = !this.isMonitoreoDropdownOpen;
    this.isCargaDatosDropdownOpen = false;
    this.isMantenimientoDropdownOpen = false;
    this.isCampanasDropdownOpen = false;
    this.isReportesDropdownOpen = false;
    this.isBlacklistDropdownOpen = false;
    this.isCartasDropdownOpen = false;
    setTimeout(() => {
      this.checkTextOverflow();
    }, 50);
  }
  toggleCargaDatosDropdown() {
    if (this.isSidebarCollapsed) {
      this.isSidebarCollapsed = false;
    }
    this.isCargaDatosDropdownOpen = !this.isCargaDatosDropdownOpen;
    this.isMonitoreoDropdownOpen = false;
    this.isMantenimientoDropdownOpen = false;
    this.isCampanasDropdownOpen = false;
    this.isReportesDropdownOpen = false;
    this.isBlacklistDropdownOpen = false;
    this.isCartasDropdownOpen = false;
    setTimeout(() => {
      this.checkTextOverflow();
    }, 50);
  }
  toggleMantenimientoDropdown() {
    if (this.isSidebarCollapsed) {
      this.isSidebarCollapsed = false;
    }
    this.isMantenimientoDropdownOpen = !this.isMantenimientoDropdownOpen;
    this.isMonitoreoDropdownOpen = false;
    this.isCargaDatosDropdownOpen = false;
    this.isCampanasDropdownOpen = false;
    this.isReportesDropdownOpen = false;
    this.isBlacklistDropdownOpen = false;
    this.isCartasDropdownOpen = false;
    setTimeout(() => {
      this.checkTextOverflow();
    }, 50);
  }
  toggleCampanasDropdown() {
    if (this.isSidebarCollapsed) {
      this.isSidebarCollapsed = false;
    }
    this.isCampanasDropdownOpen = !this.isCampanasDropdownOpen;
    this.isMonitoreoDropdownOpen = false;
    this.isCargaDatosDropdownOpen = false;
    this.isMantenimientoDropdownOpen = false;
    this.isReportesDropdownOpen = false;
    this.isBlacklistDropdownOpen = false;
    this.isCartasDropdownOpen = false;
    setTimeout(() => this.checkTextOverflow(), 50);
  }
  toggleReportesDropdown() {
    if (this.isSidebarCollapsed) {
      this.isSidebarCollapsed = false;
    }
    this.isReportesDropdownOpen = !this.isReportesDropdownOpen;
    this.isMonitoreoDropdownOpen = false;
    this.isCargaDatosDropdownOpen = false;
    this.isMantenimientoDropdownOpen = false;
    this.isCampanasDropdownOpen = false;
    this.isBlacklistDropdownOpen = false;
    this.isCartasDropdownOpen = false;
    setTimeout(() => this.checkTextOverflow(), 50);
  }
  toggleBlacklistDropdown() {
    if (this.isSidebarCollapsed) {
      this.isSidebarCollapsed = false;
    }
    this.isBlacklistDropdownOpen = !this.isBlacklistDropdownOpen;
    this.isMonitoreoDropdownOpen = false;
    this.isCargaDatosDropdownOpen = false;
    this.isMantenimientoDropdownOpen = false;
    this.isCampanasDropdownOpen = false;
    this.isReportesDropdownOpen = false;
    this.isCartasDropdownOpen = false;
    setTimeout(() => this.checkTextOverflow(), 50);
  }
  toggleCartasDropdown() {
    if (this.isSidebarCollapsed) {
      this.isSidebarCollapsed = false;
    }
    this.isCartasDropdownOpen = !this.isCartasDropdownOpen;
    this.isMonitoreoDropdownOpen = false;
    this.isCargaDatosDropdownOpen = false;
    this.isMantenimientoDropdownOpen = false;
    this.isCampanasDropdownOpen = false;
    this.isReportesDropdownOpen = false;
    this.isBlacklistDropdownOpen = false;
    setTimeout(() => this.checkTextOverflow(), 50);
  }
  closeDropdowns() {
    this.isMonitoreoDropdownOpen = false;
    this.isCargaDatosDropdownOpen = false;
    this.isMantenimientoDropdownOpen = false;
    this.isCampanasDropdownOpen = false;
    this.isReportesDropdownOpen = false;
    this.isBlacklistDropdownOpen = false;
    this.isCartasDropdownOpen = false;
  }
  isMonitoreoActive() {
    return this.router.url.includes("/admin/monitoring") || this.router.url.includes("/admin/campaign-monitoring");
  }
  isCargaDatosActive() {
    return this.router.url.includes("/admin/data-load");
  }
  isMantenimientoActive() {
    return this.router.url.includes("/admin/maintenance");
  }
  isCampanasActive() {
    return this.router.url.includes("/admin/campaigns");
  }
  isReportesActive() {
    return this.router.url.includes("/reports");
  }
  isBlacklistActive() {
    return this.router.url.includes("/blacklist");
  }
  isCartasActive() {
    return this.router.url.includes("/agreements") || this.router.url.includes("/cartas/no-adeudo") || this.router.url.includes("/admin/cartas-cesion");
  }
  toggleTheme() {
    this.themeService.toggleTheme();
  }
  isDarkMode() {
    return this.themeService.isDarkMode();
  }
  isAdminOrSupervisor() {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.role === "ADMIN" || currentUser?.role === "SUPERVISOR";
  }
  isAgent() {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.role === "AGENT";
  }
};
_AppComponent.\u0275fac = function AppComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AppComponent)(\u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(ThemeService), \u0275\u0275directiveInject(WebsocketService), \u0275\u0275directiveInject(SipService), \u0275\u0275directiveInject(InactivityService), \u0275\u0275directiveInject(SessionConfigService), \u0275\u0275directiveInject(AgentStatusService), \u0275\u0275directiveInject(RecordatoriosService), \u0275\u0275directiveInject(NotificacionesSistemaService), \u0275\u0275directiveInject(MatDialog), \u0275\u0275directiveInject(Router));
};
_AppComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppComponent, selectors: [["app-root"]], hostBindings: function AppComponent_HostBindings(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275listener("resize", function AppComponent_resize_HostBindingHandler() {
      return ctx.onResize();
    }, \u0275\u0275resolveWindow);
  }
}, decls: 2, vars: 2, consts: [["lightMode", ""], ["class", "app-container", 4, "ngIf"], [4, "ngIf"], [1, "app-container"], ["type", "button", 1, "sidebar-toggle", 3, "click", "title"], [3, "name", "size"], [1, "cashi-sidebar"], [1, "sidebar-logo"], [1, "logo-icon"], ["name", "wallet", 3, "size"], ["class", "logo-text", 4, "ngIf"], [1, "sidebar-nav"], ["routerLink", "/agent-dashboard", "routerLinkActive", "active", "class", "sidebar-item", 3, "title", 4, "ngIf"], ["routerLink", "/contacts", "routerLinkActive", "active", "class", "sidebar-item", 3, "title", 4, "ngIf"], ["routerLink", "/manual-management", "routerLinkActive", "active", 1, "sidebar-item", 3, "title"], ["name", "clipboard-edit", 3, "size"], ["class", "item-text", 4, "ngIf"], ["class", "sidebar-group", 4, "ngIf"], ["routerLink", "/pagos-bancarios", "routerLinkActive", "active", "class", "sidebar-item", 3, "title", 4, "ngIf"], ["routerLink", "/admin/campaigns/generation", "routerLinkActive", "active", "class", "sidebar-item", 3, "title", 4, "ngIf"], ["routerLink", "/sms/combos", "routerLinkActive", "active", 1, "sidebar-item", 3, "title"], ["name", "mail", 3, "size"], ["routerLink", "/recordings", "routerLinkActive", "active", 1, "sidebar-item", 3, "title"], ["name", "mic", 3, "size"], ["routerLink", "/blacklist-main", "routerLinkActive", "active", 1, "sidebar-item", 3, "title"], ["name", "shield-ban", 3, "size"], ["routerLink", "/phone-lines", "routerLinkActive", "active", 1, "sidebar-item", 3, "title"], ["name", "smartphone", 3, "size"], [1, "sidebar-group"], ["type", "button", 1, "sidebar-item", 3, "click", "title"], ["name", "folder-open", 3, "size"], ["class", "dropdown-arrow", "name", "chevron-down", 3, "rotated", "size", 4, "ngIf"], [1, "sidebar-submenu"], ["routerLink", "/agreements", "routerLinkActive", "active", 1, "sidebar-subitem", 3, "click"], ["name", "file-text", 3, "size"], ["title", "Acuerdos de Pago", 1, "item-text"], ["routerLink", "/cartas/no-adeudo", "routerLinkActive", "active", 1, "sidebar-subitem", 3, "click"], ["name", "file-check", 3, "size"], ["title", "Carta de No Adeudo", 1, "item-text"], ["routerLink", "/admin/cartas-cesion", "routerLinkActive", "active", "class", "sidebar-subitem", 3, "click", 4, "ngIf"], ["routerLink", "/admin/extensions", "routerLinkActive", "active", "class", "sidebar-item", 3, "title", 4, "ngIf"], ["routerLink", "/whatsapp", "routerLinkActive", "active", "class", "sidebar-item", 3, "title", 4, "ngIf"], [1, "sidebar-footer"], [1, "sidebar-item", "user-profile", 3, "title"], ["name", "user", 3, "size"], ["name", "sun", 3, "size", 4, "ngIf", "ngIfElse"], ["type", "button", 1, "sidebar-item", "logout-btn", 3, "click", "title"], ["name", "log-out", 3, "size"], [1, "main-content"], ["class", "fixed z-[9999] w-96 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden", "style", "bottom: 80px; left: 70px;", 4, "ngIf"], [1, "logo-text"], ["routerLink", "/agent-dashboard", "routerLinkActive", "active", 1, "sidebar-item", 3, "title"], ["name", "phone", 3, "size"], [1, "item-text"], ["routerLink", "/contacts", "routerLinkActive", "active", 1, "sidebar-item", 3, "title"], ["name", "users", 3, "size"], ["name", "eye", 3, "size"], ["routerLink", "/admin/monitoring", "routerLinkActive", "active", 1, "sidebar-subitem", 3, "click"], ["name", "phone-call", 3, "size"], ["title", "Llamadas Activas", 1, "item-text"], ["routerLink", "/admin/campaign-monitoring", "routerLinkActive", "active", 1, "sidebar-subitem", 3, "click"], ["name", "bar-chart-2", 3, "size"], ["title", "M\xE9tricas en Tiempo Real", 1, "item-text"], ["name", "chevron-down", 1, "dropdown-arrow", 3, "size"], ["routerLink", "/admin/data-load/initial", "routerLinkActive", "active", 1, "sidebar-subitem", 3, "click"], ["name", "cloud-upload", 3, "size"], ["title", "Carga Inicial de Mes", 1, "item-text"], ["routerLink", "/admin/data-load/daily", "routerLinkActive", "active", 1, "sidebar-subitem", 3, "click"], ["name", "calendar", 3, "size"], ["title", "Carga Diaria", 1, "item-text"], ["routerLink", "/pagos-bancarios", "routerLinkActive", "active", 1, "sidebar-item", 3, "title"], ["name", "landmark", 3, "size"], ["name", "settings", 3, "size"], ["routerLink", "/admin/maintenance/tenants", "routerLinkActive", "active", 1, "sidebar-subitem", 3, "click"], ["name", "building-2", 3, "size"], ["title", "Proveedores", 1, "item-text"], ["routerLink", "/admin/maintenance/portfolios", "routerLinkActive", "active", 1, "sidebar-subitem", 3, "click"], ["name", "briefcase", 3, "size"], ["title", "Carteras", 1, "item-text"], ["routerLink", "/admin/maintenance/subportfolios", "routerLinkActive", "active", 1, "sidebar-subitem", 3, "click"], ["name", "folder", 3, "size"], ["title", "Subcarteras", 1, "item-text"], ["routerLink", "/admin/maintenance/headers", "routerLinkActive", "active", 1, "sidebar-subitem", 3, "click"], ["name", "columns", 3, "size"], ["title", "Config. Cabeceras", 1, "item-text"], ["routerLink", "/admin/maintenance/roles", "routerLinkActive", "active", 1, "sidebar-subitem", 3, "click"], ["name", "shield", 3, "size"], ["title", "Roles", 1, "item-text"], ["routerLink", "/admin/maintenance/users", "routerLinkActive", "active", 1, "sidebar-subitem", 3, "click"], ["title", "Usuarios", 1, "item-text"], ["routerLink", "/admin/maintenance/blacklist", "routerLinkActive", "active", 1, "sidebar-subitem", 3, "click"], ["name", "ban", 3, "size"], ["title", "Blacklist", 1, "item-text"], ["routerLink", "/admin/maintenance/typifications", "routerLinkActive", "active", 1, "sidebar-subitem", 3, "click"], ["name", "tag", 3, "size"], ["title", "Tipificaciones", 1, "item-text"], ["name", "megaphone", 3, "size"], ["routerLink", "/admin/campaigns", "routerLinkActive", "active", 1, "sidebar-subitem", 3, "click"], ["name", "list", 3, "size"], ["title", "Gesti\xF3n de Campa\xF1as", 1, "item-text"], ["name", "bar-chart-3", 3, "size"], ["routerLink", "/reports/contact", "routerLinkActive", "active", 1, "sidebar-subitem", 3, "click"], ["name", "user-circle", 3, "size"], ["title", "Reporte de Contacto", 1, "item-text"], ["routerLink", "/reports/ranking", "routerLinkActive", "active", 1, "sidebar-subitem", 3, "click"], ["name", "trophy", 3, "size"], ["title", "Reporte de Ranking", 1, "item-text"], ["routerLink", "/reports/speech", "routerLinkActive", "active", 1, "sidebar-subitem", 3, "click"], ["title", "Reporte de Speech", 1, "item-text"], ["routerLink", "/reports/monitoring", "routerLinkActive", "active", 1, "sidebar-subitem", 3, "click"], ["name", "activity", 3, "size"], ["title", "Reporte de Monitoreo", 1, "item-text"], ["routerLink", "/reports/powerbi", "routerLinkActive", "active", 1, "sidebar-subitem", 3, "click"], ["name", "zap", 3, "size"], ["title", "Reporte PowerBI", 1, "item-text"], ["routerLink", "/reports/cartera-propia", "routerLinkActive", "active", 1, "sidebar-subitem", 3, "click"], ["title", "PowerBI Cartera Propia", 1, "item-text"], ["routerLink", "/admin/campaigns/generation", "routerLinkActive", "active", 1, "sidebar-item", 3, "title"], ["routerLink", "/admin/cartas-cesion", "routerLinkActive", "active", 1, "sidebar-subitem", 3, "click"], ["title", "Cartas de Cesi\xF3n", 1, "item-text"], ["routerLink", "/admin/extensions", "routerLinkActive", "active", 1, "sidebar-item", 3, "title"], ["name", "phone-forwarded", 3, "size"], ["routerLink", "/whatsapp", "routerLinkActive", "active", 1, "sidebar-item", 3, "title"], ["name", "message-square", 3, "size"], [1, "relative"], ["name", "bell", 3, "size"], ["class", "absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold", 4, "ngIf"], [1, "absolute", "-top-2", "-right-2", "bg-red-500", "text-white", "text-xs", "rounded-full", "h-5", "w-5", "flex", "items-center", "justify-center", "font-bold"], ["name", "sun", 3, "size"], ["name", "moon", 3, "size"], [1, "fixed", "z-[9999]", "w-96", "bg-slate-800", "border", "border-slate-700", "rounded-xl", "shadow-2xl", "overflow-hidden", 2, "bottom", "80px", "left", "70px"], [1, "fixed", "inset-0", "z-[-1]", 3, "click"], [1, "flex", "items-center", "justify-between", "px-4", "py-3", "border-b", "border-slate-700", "bg-slate-900"], [1, "flex", "items-center", "gap-2"], ["name", "bell", 1, "text-blue-400", 3, "size"], [1, "font-semibold", "text-white"], [1, "flex", "items-center", "gap-3"], ["class", "text-xs text-blue-400 hover:text-blue-300 transition-colors", 3, "click", 4, "ngIf"], [1, "text-gray-400", "hover:text-white", "transition-colors", 3, "click"], ["name", "x", 3, "size"], [1, "max-h-80", "overflow-y-auto"], ["class", "p-8 text-center", 4, "ngIf"], ["class", "px-4 py-3 border-b border-slate-700/50 hover:bg-slate-700/50 cursor-pointer transition-colors", 3, "bg-blue-900/20", "click", 4, "ngFor", "ngForOf"], [1, "text-xs", "text-blue-400", "hover:text-blue-300", "transition-colors", 3, "click"], [1, "p-8", "text-center"], ["name", "bell-off", 1, "text-gray-600", "mx-auto", "mb-2", 3, "size"], [1, "text-gray-500"], [1, "px-4", "py-3", "border-b", "border-slate-700/50", "hover:bg-slate-700/50", "cursor-pointer", "transition-colors", 3, "click"], [1, "flex", "items-start", "gap-3"], [1, "mt-0.5"], [1, "flex-1", "min-w-0"], [1, "font-medium", "text-white", "text-sm"], ["class", "w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 animate-pulse", 4, "ngIf"], [1, "text-xs", "text-gray-400", "mt-1", "leading-relaxed"], [1, "text-xs", "text-gray-500", "mt-2", "block"], [1, "w-2", "h-2", "bg-blue-500", "rounded-full", "flex-shrink-0", "animate-pulse"]], template: function AppComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, AppComponent_div_0_Template, 76, 74, "div", 1)(1, AppComponent_div_1_Template, 2, 0, "div", 2);
  }
  if (rf & 2) {
    \u0275\u0275property("ngIf", !ctx.isLoginPage() && ctx.authService.isAuthenticated());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.isLoginPage() || !ctx.authService.isAuthenticated());
  }
}, dependencies: [
  CommonModule,
  NgForOf,
  NgIf,
  RouterOutlet,
  RouterModule,
  RouterLink,
  RouterLinkActive,
  LucideAngularModule,
  LucideAngularComponent,
  AuthorizationNotificationComponent,
  AgentTimeAlertOverlayComponent,
  AsyncPipe,
  DatePipe
], styles: ['/* src/app/app.component.css */\n.app-container {\n  display: flex;\n  height: 100vh;\n  background-color: #0A0E27;\n}\n.cashi-sidebar {\n  width: 240px;\n  height: 100vh;\n  background-color: #0f172a;\n  border-right: 1px solid #1e293b;\n  display: flex;\n  flex-direction: column;\n  position: fixed;\n  left: 0;\n  top: 0;\n  z-index: 1000;\n  transition: width 0.3s ease, transform 0.3s ease;\n  overflow-x: hidden;\n  overflow-y: auto;\n  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.2);\n}\n.cashi-sidebar.collapsed {\n  width: 64px;\n}\n.sidebar-toggle {\n  position: fixed !important;\n  top: 50% !important;\n  left: 228px !important;\n  transform: translateY(-50%) !important;\n  width: 24px !important;\n  height: 24px !important;\n  min-width: 24px !important;\n  min-height: 24px !important;\n  max-width: 24px !important;\n  max-height: 24px !important;\n  background-color: #10B981 !important;\n  background: #10B981 !important;\n  border: 2px solid #1e293b !important;\n  border-radius: 50% !important;\n  display: flex !important;\n  align-items: center !important;\n  justify-content: center !important;\n  cursor: pointer !important;\n  transition: all 0.3s !important;\n  z-index: 1001 !important;\n  padding: 0 !important;\n  margin: 0 !important;\n  font-family: inherit !important;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;\n  text-transform: none !important;\n  letter-spacing: normal !important;\n  line-height: 1 !important;\n}\n.sidebar-toggle.collapsed {\n  left: 52px !important;\n}\n.sidebar-toggle lucide-angular,\n.sidebar-toggle .icon {\n  font-size: 14px !important;\n  color: white !important;\n  line-height: 1 !important;\n  width: 16px !important;\n  height: 16px !important;\n  flex-shrink: 0 !important;\n}\n.sidebar-toggle:hover {\n  background-color: #059669 !important;\n  background: #059669 !important;\n  transform: translateY(-50%) scale(1.1) !important;\n  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4) !important;\n}\n.sidebar-logo {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 20px 16px;\n  margin-bottom: 8px;\n  border-bottom: 1px solid #1e293b;\n}\n.logo-icon {\n  background-color: #10B981;\n  width: 36px;\n  height: 36px;\n  min-width: 36px;\n  border-radius: 8px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);\n}\n.logo-icon .icon {\n  color: #ffffff;\n  font-size: 22px;\n  font-weight: bold;\n  line-height: 1;\n}\n.logo-text {\n  font-size: 18px;\n  font-weight: 700;\n  color: #ffffff;\n  white-space: nowrap;\n  opacity: 1;\n  transition: opacity 0.2s;\n}\n.cashi-sidebar.collapsed .logo-text {\n  opacity: 0;\n  width: 0;\n}\n.sidebar-nav {\n  flex: 1;\n  overflow-y: auto;\n  overflow-x: hidden;\n  padding: 8px;\n}\n.sidebar-nav::-webkit-scrollbar {\n  width: 4px;\n}\n.sidebar-nav::-webkit-scrollbar-track {\n  background: transparent;\n}\n.sidebar-nav::-webkit-scrollbar-thumb {\n  background: #334155;\n  border-radius: 4px;\n}\n.sidebar-nav::-webkit-scrollbar-thumb:hover {\n  background: #475569;\n}\n.sidebar-nav a.sidebar-item,\n.sidebar-nav button.sidebar-item {\n  display: flex !important;\n  align-items: center !important;\n  gap: 12px !important;\n  padding: 10px 12px !important;\n  margin-bottom: 4px;\n  text-decoration: none !important;\n  border-radius: 6px !important;\n  transition: all 0.15s !important;\n  font-size: 14px !important;\n  font-weight: 500 !important;\n  cursor: pointer !important;\n  background-color: transparent !important;\n  background: none !important;\n  border: none !important;\n  width: 100% !important;\n  text-align: left !important;\n  font-family: inherit !important;\n  position: relative !important;\n  box-shadow: none !important;\n  text-transform: none !important;\n  letter-spacing: normal !important;\n  min-width: 0 !important;\n  overflow: hidden !important;\n}\n.sidebar-nav a.sidebar-item,\n.sidebar-nav button.sidebar-item {\n  color: #94a3b8;\n}\n.sidebar-nav .sidebar-item lucide-angular {\n  flex-shrink: 0 !important;\n  color: inherit;\n}\n.sidebar-nav .sidebar-item .item-text {\n  flex: 1;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  display: block;\n  position: relative;\n  min-width: 0;\n}\n.sidebar-nav .sidebar-item:hover .item-text {\n  text-overflow: clip;\n}\n.sidebar-nav .sidebar-item:hover .item-text.text-overflowing {\n  display: block;\n  position: relative;\n  width: 100%;\n}\n.sidebar-nav .sidebar-item .item-text.text-overflowing::after {\n  content: attr(title);\n  position: absolute;\n  left: 0;\n  top: 0;\n  white-space: nowrap;\n  display: none;\n  color: inherit;\n  -webkit-mask-image:\n    linear-gradient(\n      to right,\n      transparent 0px,\n      black 32px,\n      black 100%);\n  mask-image:\n    linear-gradient(\n      to right,\n      transparent 0px,\n      black 32px,\n      black 100%);\n}\n@media (hover: hover) {\n  .sidebar-nav .sidebar-item:hover .item-text.text-overflowing::after {\n    display: block;\n    animation: scrollTextLeft 6s ease-in-out 0.5s infinite;\n  }\n  .sidebar-nav .sidebar-item:hover .item-text.text-overflowing {\n    text-indent: -9999px;\n    overflow: hidden;\n  }\n  .sidebar-nav .sidebar-item:hover .item-text.text-overflowing::after {\n    text-indent: 0;\n  }\n}\n@keyframes scrollTextLeft {\n  0%, 15% {\n    transform: translateX(0);\n  }\n  40%, 60% {\n    transform: translateX(-25%);\n  }\n  85%, 100% {\n    transform: translateX(0);\n  }\n}\n.cashi-sidebar.collapsed .sidebar-nav .sidebar-item .item-text {\n  display: none;\n}\n.cashi-sidebar.collapsed .sidebar-nav a.sidebar-item,\n.cashi-sidebar.collapsed .sidebar-nav button.sidebar-item {\n  justify-content: center !important;\n  padding: 10px !important;\n}\n.sidebar-nav a.sidebar-item:hover,\n.sidebar-nav button.sidebar-item:hover {\n  background-color: rgba(16, 185, 129, 0.1) !important;\n  background: rgba(16, 185, 129, 0.1) !important;\n  color: #10B981;\n}\n.sidebar-nav a.sidebar-item.active,\n.sidebar-nav button.sidebar-item.active {\n  background-color: rgba(16, 185, 129, 0.15) !important;\n  background: rgba(16, 185, 129, 0.15) !important;\n  color: #10B981;\n  font-weight: 600 !important;\n}\n.sidebar-nav .sidebar-item.active::before {\n  content: "";\n  position: absolute;\n  left: 0;\n  top: 50%;\n  transform: translateY(-50%);\n  width: 3px;\n  height: 70%;\n  background-color: #10B981 !important;\n  border-radius: 0 3px 3px 0;\n}\n.dropdown-arrow {\n  margin-left: auto;\n  transition: transform 0.2s;\n  font-size: 14px;\n  line-height: 1;\n  flex-shrink: 0;\n}\n.dropdown-arrow.rotated {\n  transform: rotate(180deg);\n}\n.cashi-sidebar.collapsed .dropdown-arrow {\n  display: none;\n}\n.sidebar-group {\n  margin-bottom: 4px;\n}\n.sidebar-submenu {\n  max-height: 0;\n  overflow: hidden;\n  transition: max-height 0.3s ease;\n  padding-left: 0;\n}\n.sidebar-submenu.show {\n  max-height: 500px;\n}\n.sidebar-submenu a.sidebar-subitem {\n  display: flex !important;\n  align-items: center !important;\n  gap: 12px !important;\n  padding: 8px 12px 8px 36px !important;\n  margin-bottom: 2px;\n  text-decoration: none !important;\n  border-radius: 6px !important;\n  transition: all 0.15s !important;\n  font-size: 13px !important;\n  font-weight: 500 !important;\n  cursor: pointer !important;\n  background-color: transparent !important;\n  background: none !important;\n  overflow: hidden !important;\n}\n.sidebar-submenu a.sidebar-subitem {\n  color: #64748b;\n}\n.sidebar-submenu .sidebar-subitem lucide-angular {\n  flex-shrink: 0 !important;\n  color: inherit;\n}\n.sidebar-submenu .sidebar-subitem .item-text {\n  flex: 1;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  display: block;\n  position: relative;\n  min-width: 0;\n}\n.sidebar-submenu .sidebar-subitem:hover .item-text {\n  text-overflow: clip;\n}\n.sidebar-submenu .sidebar-subitem:hover .item-text.text-overflowing {\n  display: block;\n  position: relative;\n  width: 100%;\n}\n.sidebar-submenu .sidebar-subitem .item-text.text-overflowing::after {\n  content: attr(title);\n  position: absolute;\n  left: 0;\n  top: 0;\n  white-space: nowrap;\n  display: none;\n  color: inherit;\n  -webkit-mask-image:\n    linear-gradient(\n      to right,\n      transparent 0px,\n      black 30px,\n      black 100%);\n  mask-image:\n    linear-gradient(\n      to right,\n      transparent 0px,\n      black 30px,\n      black 100%);\n}\n@media (hover: hover) {\n  .sidebar-submenu .sidebar-subitem:hover .item-text.text-overflowing::after {\n    display: block;\n    animation: scrollTextLeftSubitem 6s ease-in-out 0.5s infinite;\n  }\n  .sidebar-submenu .sidebar-subitem:hover .item-text.text-overflowing {\n    text-indent: -9999px;\n    overflow: hidden;\n  }\n  .sidebar-submenu .sidebar-subitem:hover .item-text.text-overflowing::after {\n    text-indent: 0;\n  }\n}\n@keyframes scrollTextLeftSubitem {\n  0%, 15% {\n    transform: translateX(0);\n  }\n  40%, 60% {\n    transform: translateX(-30%);\n  }\n  85%, 100% {\n    transform: translateX(0);\n  }\n}\n.sidebar-submenu a.sidebar-subitem:hover {\n  background-color: rgba(16, 185, 129, 0.08) !important;\n  background: rgba(16, 185, 129, 0.08) !important;\n  color: #94a3b8;\n}\n.sidebar-submenu a.sidebar-subitem.active {\n  background-color: rgba(16, 185, 129, 0.12) !important;\n  background: rgba(16, 185, 129, 0.12) !important;\n  color: #10B981;\n  font-weight: 600 !important;\n}\n.sidebar-footer {\n  border-top: 1px solid #1e293b;\n  padding: 8px;\n}\n.sidebar-footer .sidebar-item {\n  display: flex !important;\n  align-items: center !important;\n  gap: 12px !important;\n  padding: 10px 12px !important;\n  margin-bottom: 4px;\n  border-radius: 6px !important;\n  transition: all 0.15s !important;\n  font-size: 14px !important;\n  font-weight: 500 !important;\n  cursor: pointer !important;\n  background-color: transparent !important;\n  background: none !important;\n  border: none !important;\n  width: 100% !important;\n  text-align: left !important;\n  font-family: inherit !important;\n  box-shadow: none !important;\n  text-transform: none !important;\n  letter-spacing: normal !important;\n  min-width: 0 !important;\n  overflow: hidden !important;\n}\n.sidebar-footer .sidebar-item {\n  color: #94a3b8;\n}\n.sidebar-footer .sidebar-item lucide-angular {\n  flex-shrink: 0 !important;\n  color: inherit;\n}\n.sidebar-footer .sidebar-item .item-text {\n  flex: 1;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  display: block;\n  position: relative;\n  min-width: 0;\n}\n.sidebar-footer .sidebar-item:hover .item-text {\n  text-overflow: clip;\n}\n.sidebar-footer .sidebar-item:hover .item-text.text-overflowing {\n  display: block;\n  position: relative;\n  width: 100%;\n}\n.sidebar-footer .sidebar-item .item-text.text-overflowing::after {\n  content: attr(title);\n  position: absolute;\n  left: 0;\n  top: 0;\n  white-space: nowrap;\n  display: none;\n  color: inherit;\n  -webkit-mask-image:\n    linear-gradient(\n      to right,\n      transparent 0px,\n      black 32px,\n      black 100%);\n  mask-image:\n    linear-gradient(\n      to right,\n      transparent 0px,\n      black 32px,\n      black 100%);\n}\n@media (hover: hover) {\n  .sidebar-footer .sidebar-item:hover .item-text.text-overflowing::after {\n    display: block;\n    animation: scrollTextLeft 5s ease-in-out 0.5s infinite;\n  }\n  .sidebar-footer .sidebar-item:hover .item-text.text-overflowing {\n    text-indent: -9999px;\n    overflow: hidden;\n  }\n  .sidebar-footer .sidebar-item:hover .item-text.text-overflowing::after {\n    text-indent: 0;\n  }\n}\n.cashi-sidebar.collapsed .sidebar-footer .sidebar-item .item-text {\n  display: none;\n}\n.cashi-sidebar.collapsed .sidebar-footer .sidebar-item {\n  justify-content: center !important;\n  padding: 10px !important;\n}\n.sidebar-footer .sidebar-item.user-profile {\n  background-color: rgba(255, 255, 255, 0.05) !important;\n  background: rgba(255, 255, 255, 0.05) !important;\n  border: 1px solid rgba(255, 255, 255, 0.1) !important;\n}\n.sidebar-footer .sidebar-item.user-profile:hover {\n  background-color: rgba(255, 255, 255, 0.08) !important;\n  background: rgba(255, 255, 255, 0.08) !important;\n}\n.sidebar-footer button.sidebar-item:hover {\n  background-color: rgba(16, 185, 129, 0.1) !important;\n  background: rgba(16, 185, 129, 0.1) !important;\n  color: #10B981;\n}\n.sidebar-footer button.sidebar-item.logout-btn {\n  color: #ef4444;\n}\n.sidebar-footer button.sidebar-item.logout-btn:hover {\n  background-color: rgba(239, 68, 68, 0.1) !important;\n  background: rgba(239, 68, 68, 0.1) !important;\n  color: #ef4444;\n}\n.main-content {\n  margin-left: 240px;\n  width: calc(100% - 240px);\n  height: 100vh;\n  overflow-y: auto;\n  background-color: #0A0E27;\n  transition: margin-left 0.3s ease, width 0.3s ease;\n  padding: 0;\n  box-sizing: border-box;\n}\n.cashi-sidebar.collapsed ~ .main-content {\n  margin-left: 64px;\n  width: calc(100% - 64px);\n}\nhtml:not(.dark) .cashi-sidebar,\nbody.light-theme .cashi-sidebar {\n  background-color: #f8fafc !important;\n  border-right: 1px solid #cbd5e1 !important;\n  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.06) !important;\n}\nhtml:not(.dark) .app-container,\nbody.light-theme .app-container {\n  background-color: #f1f5f9 !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-logo,\nbody.light-theme .cashi-sidebar .sidebar-logo {\n  border-bottom: 1px solid #e2e8f0 !important;\n}\nhtml:not(.dark) .cashi-sidebar .logo-text,\nbody.light-theme .cashi-sidebar .logo-text {\n  color: #1e293b !important;\n}\nhtml:not(.dark) .sidebar-toggle,\nbody.light-theme .sidebar-toggle {\n  background-color: #10B981 !important;\n  background: #10B981 !important;\n  border: 2px solid #e2e8f0 !important;\n}\nhtml:not(.dark) .sidebar-toggle .icon,\nhtml:not(.dark) .sidebar-toggle lucide-angular,\nbody.light-theme .sidebar-toggle .icon,\nbody.light-theme .sidebar-toggle lucide-angular {\n  color: white !important;\n}\nhtml:not(.dark) .sidebar-toggle:hover,\nbody.light-theme .sidebar-toggle:hover {\n  background-color: #059669 !important;\n  background: #059669 !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-nav a.sidebar-item,\nhtml:not(.dark) .cashi-sidebar .sidebar-nav button.sidebar-item,\nhtml:not(.dark) .cashi-sidebar .sidebar-nav .sidebar-item,\nbody.light-theme .cashi-sidebar .sidebar-nav a.sidebar-item,\nbody.light-theme .cashi-sidebar .sidebar-nav button.sidebar-item,\nbody.light-theme .cashi-sidebar .sidebar-nav .sidebar-item {\n  color: #1e293b !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-nav .sidebar-item .item-text,\nbody.light-theme .cashi-sidebar .sidebar-nav .sidebar-item .item-text {\n  color: #1e293b !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-nav .sidebar-item lucide-angular,\nbody.light-theme .cashi-sidebar .sidebar-nav .sidebar-item lucide-angular {\n  color: #1e293b !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-nav .sidebar-item .dropdown-arrow,\nbody.light-theme .cashi-sidebar .sidebar-nav .sidebar-item .dropdown-arrow {\n  color: #1e293b !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-nav .sidebar-item .item-text.text-overflowing::after,\nbody.light-theme .cashi-sidebar .sidebar-nav .sidebar-item .item-text.text-overflowing::after {\n  color: #1e293b !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-nav a.sidebar-item:hover,\nhtml:not(.dark) .cashi-sidebar .sidebar-nav button.sidebar-item:hover,\nbody.light-theme .cashi-sidebar .sidebar-nav a.sidebar-item:hover,\nbody.light-theme .cashi-sidebar .sidebar-nav button.sidebar-item:hover {\n  background-color: rgba(16, 185, 129, 0.15) !important;\n  color: #047857 !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-nav a.sidebar-item:hover .item-text.text-overflowing::after,\nhtml:not(.dark) .cashi-sidebar .sidebar-nav button.sidebar-item:hover .item-text.text-overflowing::after,\nbody.light-theme .cashi-sidebar .sidebar-nav a.sidebar-item:hover .item-text.text-overflowing::after,\nbody.light-theme .cashi-sidebar .sidebar-nav button.sidebar-item:hover .item-text.text-overflowing::after {\n  color: #047857 !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-nav a.sidebar-item.active,\nhtml:not(.dark) .cashi-sidebar .sidebar-nav button.sidebar-item.active,\nbody.light-theme .cashi-sidebar .sidebar-nav a.sidebar-item.active,\nbody.light-theme .cashi-sidebar .sidebar-nav button.sidebar-item.active {\n  background-color: rgba(16, 185, 129, 0.2) !important;\n  color: #065f46 !important;\n  font-weight: 600;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-nav .sidebar-item.active::before,\nbody.light-theme .cashi-sidebar .sidebar-nav .sidebar-item.active::before {\n  background-color: #059669 !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-submenu a.sidebar-subitem,\nbody.light-theme .cashi-sidebar .sidebar-submenu a.sidebar-subitem {\n  color: #334155 !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-submenu .sidebar-subitem .item-text.text-overflowing::after,\nbody.light-theme .cashi-sidebar .sidebar-submenu .sidebar-subitem .item-text.text-overflowing::after {\n  color: #334155 !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-submenu a.sidebar-subitem:hover,\nbody.light-theme .cashi-sidebar .sidebar-submenu a.sidebar-subitem:hover {\n  background-color: rgba(16, 185, 129, 0.12) !important;\n  color: #047857 !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-submenu a.sidebar-subitem:hover .item-text.text-overflowing::after,\nbody.light-theme .cashi-sidebar .sidebar-submenu a.sidebar-subitem:hover .item-text.text-overflowing::after {\n  color: #047857 !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-submenu a.sidebar-subitem.active,\nbody.light-theme .cashi-sidebar .sidebar-submenu a.sidebar-subitem.active {\n  background-color: rgba(16, 185, 129, 0.18) !important;\n  color: #065f46 !important;\n  font-weight: 600 !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-submenu a.sidebar-subitem.active .item-text.text-overflowing::after,\nbody.light-theme .cashi-sidebar .sidebar-submenu a.sidebar-subitem.active .item-text.text-overflowing::after {\n  color: #065f46 !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-footer,\nbody.light-theme .cashi-sidebar .sidebar-footer {\n  border-top: 1px solid #e2e8f0 !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-footer .sidebar-item,\nbody.light-theme .cashi-sidebar .sidebar-footer .sidebar-item {\n  color: #1e293b !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-footer .sidebar-item .item-text.text-overflowing::after,\nbody.light-theme .cashi-sidebar .sidebar-footer .sidebar-item .item-text.text-overflowing::after {\n  color: #1e293b !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-footer .sidebar-item.user-profile,\nbody.light-theme .cashi-sidebar .sidebar-footer .sidebar-item.user-profile {\n  background-color: rgba(15, 23, 42, 0.06) !important;\n  border: 1px solid rgba(15, 23, 42, 0.15) !important;\n  color: #0f172a !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-footer .sidebar-item.user-profile:hover,\nbody.light-theme .cashi-sidebar .sidebar-footer .sidebar-item.user-profile:hover {\n  background-color: rgba(15, 23, 42, 0.1) !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-footer button.sidebar-item:hover,\nbody.light-theme .cashi-sidebar .sidebar-footer button.sidebar-item:hover {\n  background-color: rgba(16, 185, 129, 0.15) !important;\n  color: #047857 !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-footer button.sidebar-item:hover .item-text.text-overflowing::after,\nbody.light-theme .cashi-sidebar .sidebar-footer button.sidebar-item:hover .item-text.text-overflowing::after {\n  color: #047857 !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-footer button.sidebar-item.logout-btn,\nbody.light-theme .cashi-sidebar .sidebar-footer button.sidebar-item.logout-btn {\n  color: #dc2626 !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-footer button.sidebar-item.logout-btn:hover,\nbody.light-theme .cashi-sidebar .sidebar-footer button.sidebar-item.logout-btn:hover {\n  background-color: rgba(220, 38, 38, 0.1) !important;\n  color: #dc2626 !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-nav::-webkit-scrollbar-thumb,\nbody.light-theme .cashi-sidebar .sidebar-nav::-webkit-scrollbar-thumb {\n  background: #cbd5e1 !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-nav::-webkit-scrollbar-thumb:hover,\nbody.light-theme .cashi-sidebar .sidebar-nav::-webkit-scrollbar-thumb:hover {\n  background: #94a3b8 !important;\n}\nhtml:not(.dark) .main-content,\nbody.light-theme .main-content {\n  background-color: #f1f5f9 !important;\n}\nhtml.dark .main-content,\nbody.dark-theme .main-content {\n  background-color: #0A0E27 !important;\n}\n@media (max-width: 768px) {\n  .cashi-sidebar {\n    transform: translateX(-100%);\n  }\n  .cashi-sidebar.collapsed {\n    transform: translateX(0);\n    width: 64px;\n  }\n  .main-content {\n    margin-left: 0;\n    width: 100%;\n  }\n  .cashi-sidebar.collapsed ~ .main-content {\n    margin-left: 64px;\n    width: calc(100% - 64px);\n  }\n  .sidebar-toggle {\n    display: none !important;\n  }\n}\n@media (max-width: 480px) {\n  .cashi-sidebar.collapsed ~ .main-content {\n    margin-left: 0;\n    width: 100%;\n  }\n  .cashi-sidebar.collapsed {\n    transform: translateX(-100%);\n  }\n}\n.sidebar-nav .sidebar-item:focus-visible,\n.sidebar-submenu .sidebar-subitem:focus-visible,\n.sidebar-toggle:focus-visible,\n.sidebar-footer button.sidebar-item:focus-visible {\n  outline: 2px solid #10B981;\n  outline-offset: 2px;\n}\n:root.light .sidebar-nav .sidebar-item:focus-visible,\n:root.light .sidebar-submenu .sidebar-subitem:focus-visible,\n:root.light .sidebar-toggle:focus-visible,\n:root.light .sidebar-footer button.sidebar-item:focus-visible,\nbody.light-theme .sidebar-nav .sidebar-item:focus-visible,\nbody.light-theme .sidebar-submenu .sidebar-subitem:focus-visible,\nbody.light-theme .sidebar-toggle:focus-visible,\nbody.light-theme .sidebar-footer button.sidebar-item:focus-visible {\n  outline: 2px solid #059669;\n  outline-offset: 2px;\n}\n@media (prefers-reduced-motion: reduce) {\n  .cashi-sidebar,\n  .main-content,\n  .sidebar-submenu,\n  .sidebar-item,\n  .dropdown-arrow {\n    transition: none;\n  }\n}\n/*# sourceMappingURL=app.component.css.map */\n'], encapsulation: 2 });
var AppComponent = _AppComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AppComponent, [{
    type: Component,
    args: [{ selector: "app-root", standalone: true, imports: [
      CommonModule,
      DatePipe,
      RouterOutlet,
      RouterModule,
      LucideAngularModule,
      AuthorizationNotificationComponent,
      AgentTimeAlertOverlayComponent
    ], encapsulation: ViewEncapsulation.None, template: `<div class="app-container" *ngIf="!isLoginPage() && authService.isAuthenticated()">\r
  <!-- Toggle Button (fuera del sidebar para evitar overflow) -->\r
  <button type="button" class="sidebar-toggle" [class.collapsed]="isSidebarCollapsed" (click)="toggleSidebar()" [title]="isSidebarCollapsed ? 'Expandir' : 'Colapsar'">\r
    <lucide-angular [name]="isSidebarCollapsed ? 'chevron-right' : 'chevron-left'" [size]="16"></lucide-angular>\r
  </button>\r
\r
  <!-- CASHI Sidebar -->\r
  <aside class="cashi-sidebar" [class.collapsed]="isSidebarCollapsed">\r
    <!-- Logo -->\r
    <div class="sidebar-logo">\r
      <div class="logo-icon">\r
        <lucide-angular name="wallet" [size]="20"></lucide-angular>\r
      </div>\r
      <span class="logo-text" *ngIf="!isSidebarCollapsed">CASHI</span>\r
    </div>\r
\r
    <!-- Navigation Menu -->\r
    <nav class="sidebar-nav">\r
      <!-- Items para AGENTES -->\r
      <a routerLink="/agent-dashboard" routerLinkActive="active" class="sidebar-item" *ngIf="isAgent()" [title]="isSidebarCollapsed ? 'Cobranza' : ''">\r
        <lucide-angular name="phone" [size]="20"></lucide-angular>\r
        <span class="item-text" *ngIf="!isSidebarCollapsed">Cobranza</span>\r
      </a>\r
\r
      <a routerLink="/contacts" routerLinkActive="active" class="sidebar-item" *ngIf="isAgent()" [title]="isSidebarCollapsed ? 'Clientes' : ''">\r
        <lucide-angular name="users" [size]="20"></lucide-angular>\r
        <span class="item-text" *ngIf="!isSidebarCollapsed">Clientes</span>\r
      </a>\r
\r
      <a routerLink="/manual-management" routerLinkActive="active" class="sidebar-item" [title]="isSidebarCollapsed ? 'Gesti\xF3n Manual' : ''">\r
        <lucide-angular name="clipboard-edit" [size]="20"></lucide-angular>\r
        <span class="item-text" *ngIf="!isSidebarCollapsed">Gesti\xF3n Manual</span>\r
      </a>\r
\r
      <!-- Items para ADMIN -->\r
      <!-- Monitoreo Dropdown -->\r
      <div class="sidebar-group" *ngIf="(authService.currentUser$ | async)?.role === 'ADMIN'">\r
        <button type="button" class="sidebar-item" [class.active]="isMonitoreoActive()" (click)="toggleMonitoreoDropdown()" [title]="isSidebarCollapsed ? 'Monitoreo' : ''">\r
          <lucide-angular name="eye" [size]="20"></lucide-angular>\r
          <span class="item-text" *ngIf="!isSidebarCollapsed">Monitoreo</span>\r
          <lucide-angular class="dropdown-arrow" *ngIf="!isSidebarCollapsed" [class.rotated]="isMonitoreoDropdownOpen" name="chevron-down" [size]="18"></lucide-angular>\r
        </button>\r
\r
        <div class="sidebar-submenu" [class.show]="isMonitoreoDropdownOpen && !isSidebarCollapsed">\r
          <a routerLink="/admin/monitoring" routerLinkActive="active" class="sidebar-subitem" (click)="closeDropdowns()">\r
            <lucide-angular name="phone-call" [size]="18"></lucide-angular>\r
            <span class="item-text" title="Llamadas Activas">Llamadas Activas</span>\r
          </a>\r
          <a routerLink="/admin/campaign-monitoring" routerLinkActive="active" class="sidebar-subitem" (click)="closeDropdowns()">\r
            <lucide-angular name="bar-chart-2" [size]="18"></lucide-angular>\r
            <span class="item-text" title="M\xE9tricas en Tiempo Real">M\xE9tricas en Tiempo Real</span>\r
          </a>\r
        </div>\r
      </div>\r
\r
      <!-- Carga de Datos Dropdown -->\r
      <div class="sidebar-group" *ngIf="(authService.currentUser$ | async)?.role === 'ADMIN'">\r
        <button type="button" class="sidebar-item" [class.active]="isCargaDatosActive()" (click)="toggleCargaDatosDropdown()" [title]="isSidebarCollapsed ? 'Carga de Datos' : ''">\r
          <lucide-angular name="folder-open" [size]="20"></lucide-angular>\r
          <span class="item-text" *ngIf="!isSidebarCollapsed">Carga de Datos</span>\r
          <lucide-angular class="dropdown-arrow" *ngIf="!isSidebarCollapsed" [class.rotated]="isCargaDatosDropdownOpen" name="chevron-down" [size]="18"></lucide-angular>\r
        </button>\r
\r
        <div class="sidebar-submenu" [class.show]="isCargaDatosDropdownOpen && !isSidebarCollapsed">\r
          <a routerLink="/admin/data-load/initial" routerLinkActive="active" class="sidebar-subitem" (click)="closeDropdowns()">\r
            <lucide-angular name="cloud-upload" [size]="18"></lucide-angular>\r
            <span class="item-text" title="Carga Inicial de Mes">Carga Inicial de Mes</span>\r
          </a>\r
          <a routerLink="/admin/data-load/daily" routerLinkActive="active" class="sidebar-subitem" (click)="closeDropdowns()">\r
            <lucide-angular name="calendar" [size]="18"></lucide-angular>\r
            <span class="item-text" title="Carga Diaria">Carga Diaria</span>\r
          </a>\r
        </div>\r
      </div>\r
\r
      <!-- Pagos Bancarios (Admin/Supervisor) -->\r
      <a routerLink="/pagos-bancarios" routerLinkActive="active" class="sidebar-item" *ngIf="isAdminOrSupervisor()" [title]="isSidebarCollapsed ? 'Pagos Bancarios' : ''">\r
        <lucide-angular name="landmark" [size]="20"></lucide-angular>\r
        <span class="item-text" *ngIf="!isSidebarCollapsed">Pagos Bancarios</span>\r
      </a>\r
\r
      <!-- Mantenimiento Dropdown -->\r
      <div class="sidebar-group" *ngIf="(authService.currentUser$ | async)?.role === 'ADMIN'">\r
        <button type="button" class="sidebar-item" [class.active]="isMantenimientoActive()" (click)="toggleMantenimientoDropdown()" [title]="isSidebarCollapsed ? 'Mantenimiento' : ''">\r
          <lucide-angular name="settings" [size]="20"></lucide-angular>\r
          <span class="item-text" *ngIf="!isSidebarCollapsed">Mantenimiento</span>\r
          <lucide-angular class="dropdown-arrow" *ngIf="!isSidebarCollapsed" [class.rotated]="isMantenimientoDropdownOpen" name="chevron-down" [size]="18"></lucide-angular>\r
        </button>\r
\r
        <div class="sidebar-submenu" [class.show]="isMantenimientoDropdownOpen && !isSidebarCollapsed">\r
          <a routerLink="/admin/maintenance/tenants" routerLinkActive="active" class="sidebar-subitem" (click)="closeDropdowns()">\r
            <lucide-angular name="building-2" [size]="18"></lucide-angular>\r
            <span class="item-text" title="Proveedores">Proveedores</span>\r
          </a>\r
          <a routerLink="/admin/maintenance/portfolios" routerLinkActive="active" class="sidebar-subitem" (click)="closeDropdowns()">\r
            <lucide-angular name="briefcase" [size]="18"></lucide-angular>\r
            <span class="item-text" title="Carteras">Carteras</span>\r
          </a>\r
          <a routerLink="/admin/maintenance/subportfolios" routerLinkActive="active" class="sidebar-subitem" (click)="closeDropdowns()">\r
            <lucide-angular name="folder" [size]="18"></lucide-angular>\r
            <span class="item-text" title="Subcarteras">Subcarteras</span>\r
          </a>\r
          <a routerLink="/admin/maintenance/headers" routerLinkActive="active" class="sidebar-subitem" (click)="closeDropdowns()">\r
            <lucide-angular name="columns" [size]="18"></lucide-angular>\r
            <span class="item-text" title="Config. Cabeceras">Config. Cabeceras</span>\r
          </a>\r
          <a routerLink="/admin/maintenance/roles" routerLinkActive="active" class="sidebar-subitem" (click)="closeDropdowns()">\r
            <lucide-angular name="shield" [size]="18"></lucide-angular>\r
            <span class="item-text" title="Roles">Roles</span>\r
          </a>\r
          <a routerLink="/admin/maintenance/users" routerLinkActive="active" class="sidebar-subitem" (click)="closeDropdowns()">\r
            <lucide-angular name="users" [size]="18"></lucide-angular>\r
            <span class="item-text" title="Usuarios">Usuarios</span>\r
          </a>\r
          <a routerLink="/admin/maintenance/blacklist" routerLinkActive="active" class="sidebar-subitem" (click)="closeDropdowns()">\r
            <lucide-angular name="ban" [size]="18"></lucide-angular>\r
            <span class="item-text" title="Blacklist">Blacklist</span>\r
          </a>\r
          <a routerLink="/admin/maintenance/typifications" routerLinkActive="active" class="sidebar-subitem" (click)="closeDropdowns()">\r
            <lucide-angular name="tag" [size]="18"></lucide-angular>\r
            <span class="item-text" title="Tipificaciones">Tipificaciones</span>\r
          </a>\r
        </div>\r
      </div>\r
\r
      <!-- Campa\xF1as Dropdown -->\r
      <div class="sidebar-group" *ngIf="(authService.currentUser$ | async)?.role === 'ADMIN'">\r
        <button type="button" class="sidebar-item" [class.active]="isCampanasActive()" (click)="toggleCampanasDropdown()" [title]="isSidebarCollapsed ? 'Campa\xF1as' : ''">\r
          <lucide-angular name="megaphone" [size]="20"></lucide-angular>\r
          <span class="item-text" *ngIf="!isSidebarCollapsed">Campa\xF1as</span>\r
          <lucide-angular class="dropdown-arrow" *ngIf="!isSidebarCollapsed" [class.rotated]="isCampanasDropdownOpen" name="chevron-down" [size]="18"></lucide-angular>\r
        </button>\r
\r
        <div class="sidebar-submenu" [class.show]="isCampanasDropdownOpen && !isSidebarCollapsed">\r
          <a routerLink="/admin/campaigns" routerLinkActive="active" class="sidebar-subitem" (click)="closeDropdowns()">\r
            <lucide-angular name="list" [size]="18"></lucide-angular>\r
            <span class="item-text" title="Gesti\xF3n de Campa\xF1as">Gesti\xF3n de Campa\xF1as</span>\r
          </a>\r
        </div>\r
      </div>\r
\r
      <!-- Reportes Dropdown -->\r
      <div class="sidebar-group" *ngIf="isAdminOrSupervisor()">\r
        <button type="button" class="sidebar-item" [class.active]="isReportesActive()" (click)="toggleReportesDropdown()" [title]="isSidebarCollapsed ? 'Reportes' : ''">\r
          <lucide-angular name="bar-chart-3" [size]="20"></lucide-angular>\r
          <span class="item-text" *ngIf="!isSidebarCollapsed">Reportes</span>\r
          <lucide-angular class="dropdown-arrow" *ngIf="!isSidebarCollapsed" [class.rotated]="isReportesDropdownOpen" name="chevron-down" [size]="18"></lucide-angular>\r
        </button>\r
\r
        <div class="sidebar-submenu" [class.show]="isReportesDropdownOpen && !isSidebarCollapsed">\r
          <a routerLink="/reports/contact" routerLinkActive="active" class="sidebar-subitem" (click)="closeDropdowns()">\r
            <lucide-angular name="user-circle" [size]="18"></lucide-angular>\r
            <span class="item-text" title="Reporte de Contacto">Reporte de Contacto</span>\r
          </a>\r
          <a routerLink="/reports/ranking" routerLinkActive="active" class="sidebar-subitem" (click)="closeDropdowns()">\r
            <lucide-angular name="trophy" [size]="18"></lucide-angular>\r
            <span class="item-text" title="Reporte de Ranking">Reporte de Ranking</span>\r
          </a>\r
          <a routerLink="/reports/speech" routerLinkActive="active" class="sidebar-subitem" (click)="closeDropdowns()">\r
            <lucide-angular name="mic" [size]="18"></lucide-angular>\r
            <span class="item-text" title="Reporte de Speech">Reporte de Speech</span>\r
          </a>\r
          <a routerLink="/reports/monitoring" routerLinkActive="active" class="sidebar-subitem" (click)="closeDropdowns()">\r
            <lucide-angular name="activity" [size]="18"></lucide-angular>\r
            <span class="item-text" title="Reporte de Monitoreo">Reporte de Monitoreo</span>\r
          </a>\r
          <a routerLink="/reports/powerbi" routerLinkActive="active" class="sidebar-subitem" (click)="closeDropdowns()">\r
            <lucide-angular name="zap" [size]="18"></lucide-angular>\r
            <span class="item-text" title="Reporte PowerBI">Reporte PowerBI</span>\r
          </a>\r
          <a routerLink="/reports/cartera-propia" routerLinkActive="active" class="sidebar-subitem" (click)="closeDropdowns()">\r
            <lucide-angular name="wallet" [size]="18"></lucide-angular>\r
            <span class="item-text" title="PowerBI Cartera Propia">PowerBI Cartera Propia</span>\r
          </a>\r
        </div>\r
      </div>\r
\r
      <a routerLink="/admin/campaigns/generation" routerLinkActive="active" class="sidebar-item" *ngIf="isAdminOrSupervisor()" [title]="isSidebarCollapsed ? 'Generaci\xF3n de Campa\xF1as' : ''">\r
        <lucide-angular name="megaphone" [size]="20"></lucide-angular>\r
        <span class="item-text" *ngIf="!isSidebarCollapsed">Generaci\xF3n de Campa\xF1as</span>\r
      </a>\r
\r
      <a routerLink="/sms/combos" routerLinkActive="active" class="sidebar-item" [title]="isSidebarCollapsed ? 'Gesti\xF3n de Tenores' : ''">\r
        <lucide-angular name="mail" [size]="20"></lucide-angular>\r
        <span class="item-text" *ngIf="!isSidebarCollapsed">Gesti\xF3n de Tenores</span>\r
      </a>\r
\r
      <a routerLink="/recordings" routerLinkActive="active" class="sidebar-item" [title]="isSidebarCollapsed ? 'Grabaciones' : ''">\r
        <lucide-angular name="mic" [size]="20"></lucide-angular>\r
        <span class="item-text" *ngIf="!isSidebarCollapsed">Grabaciones</span>\r
      </a>\r
\r
      <a routerLink="/blacklist-main" routerLinkActive="active" class="sidebar-item" [title]="isSidebarCollapsed ? 'Blacklist' : ''">\r
        <lucide-angular name="shield-ban" [size]="20"></lucide-angular>\r
        <span class="item-text" *ngIf="!isSidebarCollapsed">Blacklist</span>\r
      </a>\r
\r
      <a routerLink="/phone-lines" routerLinkActive="active" class="sidebar-item" [title]="isSidebarCollapsed ? 'Consulta L\xEDneas' : ''">\r
        <lucide-angular name="smartphone" [size]="20"></lucide-angular>\r
        <span class="item-text" *ngIf="!isSidebarCollapsed">Consulta L\xEDneas</span>\r
      </a>\r
\r
      <!-- Cartas Dropdown -->\r
      <div class="sidebar-group">\r
        <button type="button" class="sidebar-item" [class.active]="isCartasActive()" (click)="toggleCartasDropdown()" [title]="isSidebarCollapsed ? 'Cartas' : ''">\r
          <lucide-angular name="folder-open" [size]="20"></lucide-angular>\r
          <span class="item-text" *ngIf="!isSidebarCollapsed">Cartas</span>\r
          <lucide-angular class="dropdown-arrow" *ngIf="!isSidebarCollapsed" [class.rotated]="isCartasDropdownOpen" name="chevron-down" [size]="18"></lucide-angular>\r
        </button>\r
\r
        <div class="sidebar-submenu" [class.show]="isCartasDropdownOpen && !isSidebarCollapsed">\r
          <a routerLink="/agreements" routerLinkActive="active" class="sidebar-subitem" (click)="closeDropdowns()">\r
            <lucide-angular name="file-text" [size]="18"></lucide-angular>\r
            <span class="item-text" title="Acuerdos de Pago">Acuerdos de Pago</span>\r
          </a>\r
          <a routerLink="/cartas/no-adeudo" routerLinkActive="active" class="sidebar-subitem" (click)="closeDropdowns()">\r
            <lucide-angular name="file-check" [size]="18"></lucide-angular>\r
            <span class="item-text" title="Carta de No Adeudo">Carta de No Adeudo</span>\r
          </a>\r
          <a routerLink="/admin/cartas-cesion" routerLinkActive="active" class="sidebar-subitem" (click)="closeDropdowns()" *ngIf="isAdminOrSupervisor()">\r
            <lucide-angular name="file-text" [size]="18"></lucide-angular>\r
            <span class="item-text" title="Cartas de Cesi\xF3n">Cartas de Cesi\xF3n</span>\r
          </a>\r
        </div>\r
      </div>\r
\r
      <a routerLink="/admin/extensions" routerLinkActive="active" class="sidebar-item" *ngIf="(authService.currentUser$ | async)?.role === 'ADMIN'" [title]="isSidebarCollapsed ? 'Extensiones' : ''">\r
        <lucide-angular name="phone-forwarded" [size]="20"></lucide-angular>\r
        <span class="item-text" *ngIf="!isSidebarCollapsed">Extensiones</span>\r
      </a>\r
\r
      <a routerLink="/whatsapp" routerLinkActive="active" class="sidebar-item" *ngIf="isAgent()" [title]="isSidebarCollapsed ? 'WhatsApp' : ''">\r
        <lucide-angular name="message-square" [size]="20"></lucide-angular>\r
        <span class="item-text" *ngIf="!isSidebarCollapsed">WhatsApp</span>\r
      </a>\r
    </nav>\r
\r
    <!-- Bottom Actions -->\r
    <div class="sidebar-footer">\r
      <!-- User Profile -->\r
      <div class="sidebar-item user-profile" [title]="isSidebarCollapsed ? (authService.currentUser$ | async)?.username : ''">\r
        <lucide-angular name="user" [size]="20"></lucide-angular>\r
        <span class="item-text" *ngIf="!isSidebarCollapsed">{{ (authService.currentUser$ | async)?.username }}</span>\r
      </div>\r
\r
      <!-- Notificaciones (solo ADMIN) -->\r
      <div class="sidebar-group" *ngIf="(authService.currentUser$ | async)?.role === 'ADMIN'">\r
        <button type="button" class="sidebar-item" (click)="toggleNotificacionesDropdown()" [title]="isSidebarCollapsed ? 'Notificaciones' : ''">\r
          <div class="relative">\r
            <lucide-angular name="bell" [size]="20"></lucide-angular>\r
            <span *ngIf="notificacionesCount > 0"\r
                  class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">\r
              {{ notificacionesCount > 9 ? '9+' : notificacionesCount }}\r
            </span>\r
          </div>\r
          <span class="item-text" *ngIf="!isSidebarCollapsed">Notificaciones</span>\r
        </button>\r
      </div>\r
\r
      <!-- Theme Toggle -->\r
      <button type="button" class="sidebar-item" (click)="toggleTheme()" [title]="isSidebarCollapsed ? (isDarkMode() ? 'Modo Claro' : 'Modo Oscuro') : ''">\r
        <lucide-angular *ngIf="isDarkMode(); else lightMode" name="sun" [size]="20"></lucide-angular>\r
        <ng-template #lightMode>\r
          <lucide-angular name="moon" [size]="20"></lucide-angular>\r
        </ng-template>\r
        <span class="item-text" *ngIf="!isSidebarCollapsed">{{ isDarkMode() ? 'Modo Claro' : 'Modo Oscuro' }}</span>\r
      </button>\r
\r
      <!-- Logout -->\r
      <button type="button" class="sidebar-item logout-btn" (click)="logout()" [title]="isSidebarCollapsed ? 'Cerrar Sesi\xF3n' : ''">\r
        <lucide-angular name="log-out" [size]="20"></lucide-angular>\r
        <span class="item-text" *ngIf="!isSidebarCollapsed">Cerrar Sesi\xF3n</span>\r
      </button>\r
    </div>\r
  </aside>\r
\r
  <!-- Main Content -->\r
  <main class="main-content">\r
    <router-outlet></router-outlet>\r
  </main>\r
\r
  <!-- Notificaciones globales de autorizaci\xF3n (para supervisores) -->\r
  <app-authorization-notification></app-authorization-notification>\r
\r
  <!-- Overlay de alerta de tiempo para agentes -->\r
  <app-agent-time-alert-overlay></app-agent-time-alert-overlay>\r
\r
  <!-- Panel flotante de notificaciones del sistema -->\r
  <div *ngIf="isNotificacionesDropdownOpen && (authService.currentUser$ | async)?.role === 'ADMIN'"\r
       class="fixed z-[9999] w-96 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden"\r
       style="bottom: 80px; left: 70px;">\r
\r
    <!-- Backdrop para cerrar -->\r
    <div class="fixed inset-0 z-[-1]" (click)="isNotificacionesDropdownOpen = false"></div>\r
\r
    <!-- Header -->\r
    <div class="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-900">\r
      <div class="flex items-center gap-2">\r
        <lucide-angular name="bell" [size]="18" class="text-blue-400"></lucide-angular>\r
        <span class="font-semibold text-white">Notificaciones</span>\r
      </div>\r
      <div class="flex items-center gap-3">\r
        <button *ngIf="notificacionesCount > 0"\r
                (click)="marcarTodasLeidas()"\r
                class="text-xs text-blue-400 hover:text-blue-300 transition-colors">\r
          Marcar todas como le\xEDdas\r
        </button>\r
        <button (click)="isNotificacionesDropdownOpen = false"\r
                class="text-gray-400 hover:text-white transition-colors">\r
          <lucide-angular name="x" [size]="18"></lucide-angular>\r
        </button>\r
      </div>\r
    </div>\r
\r
    <!-- Lista de notificaciones -->\r
    <div class="max-h-80 overflow-y-auto">\r
      <div *ngIf="notificaciones.length === 0" class="p-8 text-center">\r
        <lucide-angular name="bell-off" [size]="32" class="text-gray-600 mx-auto mb-2"></lucide-angular>\r
        <p class="text-gray-500">No hay notificaciones</p>\r
      </div>\r
\r
      <div *ngFor="let notif of notificaciones"\r
           (click)="marcarNotificacionLeida(notif)"\r
           class="px-4 py-3 border-b border-slate-700/50 hover:bg-slate-700/50 cursor-pointer transition-colors"\r
           [class.bg-blue-900/20]="!notif.leida">\r
\r
        <div class="flex items-start gap-3">\r
          <div class="mt-0.5">\r
            <lucide-angular [name]="getNotificacionIcon(notif.tipo)"\r
                            [size]="18"\r
                            [class]="getNotificacionColor(notif.tipo)">\r
            </lucide-angular>\r
          </div>\r
          <div class="flex-1 min-w-0">\r
            <div class="flex items-center gap-2">\r
              <span class="font-medium text-white text-sm">{{ notif.titulo }}</span>\r
              <span *ngIf="!notif.leida" class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 animate-pulse"></span>\r
            </div>\r
            <p class="text-xs text-gray-400 mt-1 leading-relaxed">{{ notif.mensaje }}</p>\r
            <span class="text-xs text-gray-500 mt-2 block">{{ notif.fechaCreacion | date:'dd/MM/yyyy HH:mm' }}</span>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
  </div>\r
</div>\r
\r
<div *ngIf="isLoginPage() || !authService.isAuthenticated()">\r
  <router-outlet></router-outlet>\r
</div>\r
\r
`, styles: ['/* src/app/app.component.css */\n.app-container {\n  display: flex;\n  height: 100vh;\n  background-color: #0A0E27;\n}\n.cashi-sidebar {\n  width: 240px;\n  height: 100vh;\n  background-color: #0f172a;\n  border-right: 1px solid #1e293b;\n  display: flex;\n  flex-direction: column;\n  position: fixed;\n  left: 0;\n  top: 0;\n  z-index: 1000;\n  transition: width 0.3s ease, transform 0.3s ease;\n  overflow-x: hidden;\n  overflow-y: auto;\n  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.2);\n}\n.cashi-sidebar.collapsed {\n  width: 64px;\n}\n.sidebar-toggle {\n  position: fixed !important;\n  top: 50% !important;\n  left: 228px !important;\n  transform: translateY(-50%) !important;\n  width: 24px !important;\n  height: 24px !important;\n  min-width: 24px !important;\n  min-height: 24px !important;\n  max-width: 24px !important;\n  max-height: 24px !important;\n  background-color: #10B981 !important;\n  background: #10B981 !important;\n  border: 2px solid #1e293b !important;\n  border-radius: 50% !important;\n  display: flex !important;\n  align-items: center !important;\n  justify-content: center !important;\n  cursor: pointer !important;\n  transition: all 0.3s !important;\n  z-index: 1001 !important;\n  padding: 0 !important;\n  margin: 0 !important;\n  font-family: inherit !important;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;\n  text-transform: none !important;\n  letter-spacing: normal !important;\n  line-height: 1 !important;\n}\n.sidebar-toggle.collapsed {\n  left: 52px !important;\n}\n.sidebar-toggle lucide-angular,\n.sidebar-toggle .icon {\n  font-size: 14px !important;\n  color: white !important;\n  line-height: 1 !important;\n  width: 16px !important;\n  height: 16px !important;\n  flex-shrink: 0 !important;\n}\n.sidebar-toggle:hover {\n  background-color: #059669 !important;\n  background: #059669 !important;\n  transform: translateY(-50%) scale(1.1) !important;\n  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4) !important;\n}\n.sidebar-logo {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 20px 16px;\n  margin-bottom: 8px;\n  border-bottom: 1px solid #1e293b;\n}\n.logo-icon {\n  background-color: #10B981;\n  width: 36px;\n  height: 36px;\n  min-width: 36px;\n  border-radius: 8px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);\n}\n.logo-icon .icon {\n  color: #ffffff;\n  font-size: 22px;\n  font-weight: bold;\n  line-height: 1;\n}\n.logo-text {\n  font-size: 18px;\n  font-weight: 700;\n  color: #ffffff;\n  white-space: nowrap;\n  opacity: 1;\n  transition: opacity 0.2s;\n}\n.cashi-sidebar.collapsed .logo-text {\n  opacity: 0;\n  width: 0;\n}\n.sidebar-nav {\n  flex: 1;\n  overflow-y: auto;\n  overflow-x: hidden;\n  padding: 8px;\n}\n.sidebar-nav::-webkit-scrollbar {\n  width: 4px;\n}\n.sidebar-nav::-webkit-scrollbar-track {\n  background: transparent;\n}\n.sidebar-nav::-webkit-scrollbar-thumb {\n  background: #334155;\n  border-radius: 4px;\n}\n.sidebar-nav::-webkit-scrollbar-thumb:hover {\n  background: #475569;\n}\n.sidebar-nav a.sidebar-item,\n.sidebar-nav button.sidebar-item {\n  display: flex !important;\n  align-items: center !important;\n  gap: 12px !important;\n  padding: 10px 12px !important;\n  margin-bottom: 4px;\n  text-decoration: none !important;\n  border-radius: 6px !important;\n  transition: all 0.15s !important;\n  font-size: 14px !important;\n  font-weight: 500 !important;\n  cursor: pointer !important;\n  background-color: transparent !important;\n  background: none !important;\n  border: none !important;\n  width: 100% !important;\n  text-align: left !important;\n  font-family: inherit !important;\n  position: relative !important;\n  box-shadow: none !important;\n  text-transform: none !important;\n  letter-spacing: normal !important;\n  min-width: 0 !important;\n  overflow: hidden !important;\n}\n.sidebar-nav a.sidebar-item,\n.sidebar-nav button.sidebar-item {\n  color: #94a3b8;\n}\n.sidebar-nav .sidebar-item lucide-angular {\n  flex-shrink: 0 !important;\n  color: inherit;\n}\n.sidebar-nav .sidebar-item .item-text {\n  flex: 1;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  display: block;\n  position: relative;\n  min-width: 0;\n}\n.sidebar-nav .sidebar-item:hover .item-text {\n  text-overflow: clip;\n}\n.sidebar-nav .sidebar-item:hover .item-text.text-overflowing {\n  display: block;\n  position: relative;\n  width: 100%;\n}\n.sidebar-nav .sidebar-item .item-text.text-overflowing::after {\n  content: attr(title);\n  position: absolute;\n  left: 0;\n  top: 0;\n  white-space: nowrap;\n  display: none;\n  color: inherit;\n  -webkit-mask-image:\n    linear-gradient(\n      to right,\n      transparent 0px,\n      black 32px,\n      black 100%);\n  mask-image:\n    linear-gradient(\n      to right,\n      transparent 0px,\n      black 32px,\n      black 100%);\n}\n@media (hover: hover) {\n  .sidebar-nav .sidebar-item:hover .item-text.text-overflowing::after {\n    display: block;\n    animation: scrollTextLeft 6s ease-in-out 0.5s infinite;\n  }\n  .sidebar-nav .sidebar-item:hover .item-text.text-overflowing {\n    text-indent: -9999px;\n    overflow: hidden;\n  }\n  .sidebar-nav .sidebar-item:hover .item-text.text-overflowing::after {\n    text-indent: 0;\n  }\n}\n@keyframes scrollTextLeft {\n  0%, 15% {\n    transform: translateX(0);\n  }\n  40%, 60% {\n    transform: translateX(-25%);\n  }\n  85%, 100% {\n    transform: translateX(0);\n  }\n}\n.cashi-sidebar.collapsed .sidebar-nav .sidebar-item .item-text {\n  display: none;\n}\n.cashi-sidebar.collapsed .sidebar-nav a.sidebar-item,\n.cashi-sidebar.collapsed .sidebar-nav button.sidebar-item {\n  justify-content: center !important;\n  padding: 10px !important;\n}\n.sidebar-nav a.sidebar-item:hover,\n.sidebar-nav button.sidebar-item:hover {\n  background-color: rgba(16, 185, 129, 0.1) !important;\n  background: rgba(16, 185, 129, 0.1) !important;\n  color: #10B981;\n}\n.sidebar-nav a.sidebar-item.active,\n.sidebar-nav button.sidebar-item.active {\n  background-color: rgba(16, 185, 129, 0.15) !important;\n  background: rgba(16, 185, 129, 0.15) !important;\n  color: #10B981;\n  font-weight: 600 !important;\n}\n.sidebar-nav .sidebar-item.active::before {\n  content: "";\n  position: absolute;\n  left: 0;\n  top: 50%;\n  transform: translateY(-50%);\n  width: 3px;\n  height: 70%;\n  background-color: #10B981 !important;\n  border-radius: 0 3px 3px 0;\n}\n.dropdown-arrow {\n  margin-left: auto;\n  transition: transform 0.2s;\n  font-size: 14px;\n  line-height: 1;\n  flex-shrink: 0;\n}\n.dropdown-arrow.rotated {\n  transform: rotate(180deg);\n}\n.cashi-sidebar.collapsed .dropdown-arrow {\n  display: none;\n}\n.sidebar-group {\n  margin-bottom: 4px;\n}\n.sidebar-submenu {\n  max-height: 0;\n  overflow: hidden;\n  transition: max-height 0.3s ease;\n  padding-left: 0;\n}\n.sidebar-submenu.show {\n  max-height: 500px;\n}\n.sidebar-submenu a.sidebar-subitem {\n  display: flex !important;\n  align-items: center !important;\n  gap: 12px !important;\n  padding: 8px 12px 8px 36px !important;\n  margin-bottom: 2px;\n  text-decoration: none !important;\n  border-radius: 6px !important;\n  transition: all 0.15s !important;\n  font-size: 13px !important;\n  font-weight: 500 !important;\n  cursor: pointer !important;\n  background-color: transparent !important;\n  background: none !important;\n  overflow: hidden !important;\n}\n.sidebar-submenu a.sidebar-subitem {\n  color: #64748b;\n}\n.sidebar-submenu .sidebar-subitem lucide-angular {\n  flex-shrink: 0 !important;\n  color: inherit;\n}\n.sidebar-submenu .sidebar-subitem .item-text {\n  flex: 1;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  display: block;\n  position: relative;\n  min-width: 0;\n}\n.sidebar-submenu .sidebar-subitem:hover .item-text {\n  text-overflow: clip;\n}\n.sidebar-submenu .sidebar-subitem:hover .item-text.text-overflowing {\n  display: block;\n  position: relative;\n  width: 100%;\n}\n.sidebar-submenu .sidebar-subitem .item-text.text-overflowing::after {\n  content: attr(title);\n  position: absolute;\n  left: 0;\n  top: 0;\n  white-space: nowrap;\n  display: none;\n  color: inherit;\n  -webkit-mask-image:\n    linear-gradient(\n      to right,\n      transparent 0px,\n      black 30px,\n      black 100%);\n  mask-image:\n    linear-gradient(\n      to right,\n      transparent 0px,\n      black 30px,\n      black 100%);\n}\n@media (hover: hover) {\n  .sidebar-submenu .sidebar-subitem:hover .item-text.text-overflowing::after {\n    display: block;\n    animation: scrollTextLeftSubitem 6s ease-in-out 0.5s infinite;\n  }\n  .sidebar-submenu .sidebar-subitem:hover .item-text.text-overflowing {\n    text-indent: -9999px;\n    overflow: hidden;\n  }\n  .sidebar-submenu .sidebar-subitem:hover .item-text.text-overflowing::after {\n    text-indent: 0;\n  }\n}\n@keyframes scrollTextLeftSubitem {\n  0%, 15% {\n    transform: translateX(0);\n  }\n  40%, 60% {\n    transform: translateX(-30%);\n  }\n  85%, 100% {\n    transform: translateX(0);\n  }\n}\n.sidebar-submenu a.sidebar-subitem:hover {\n  background-color: rgba(16, 185, 129, 0.08) !important;\n  background: rgba(16, 185, 129, 0.08) !important;\n  color: #94a3b8;\n}\n.sidebar-submenu a.sidebar-subitem.active {\n  background-color: rgba(16, 185, 129, 0.12) !important;\n  background: rgba(16, 185, 129, 0.12) !important;\n  color: #10B981;\n  font-weight: 600 !important;\n}\n.sidebar-footer {\n  border-top: 1px solid #1e293b;\n  padding: 8px;\n}\n.sidebar-footer .sidebar-item {\n  display: flex !important;\n  align-items: center !important;\n  gap: 12px !important;\n  padding: 10px 12px !important;\n  margin-bottom: 4px;\n  border-radius: 6px !important;\n  transition: all 0.15s !important;\n  font-size: 14px !important;\n  font-weight: 500 !important;\n  cursor: pointer !important;\n  background-color: transparent !important;\n  background: none !important;\n  border: none !important;\n  width: 100% !important;\n  text-align: left !important;\n  font-family: inherit !important;\n  box-shadow: none !important;\n  text-transform: none !important;\n  letter-spacing: normal !important;\n  min-width: 0 !important;\n  overflow: hidden !important;\n}\n.sidebar-footer .sidebar-item {\n  color: #94a3b8;\n}\n.sidebar-footer .sidebar-item lucide-angular {\n  flex-shrink: 0 !important;\n  color: inherit;\n}\n.sidebar-footer .sidebar-item .item-text {\n  flex: 1;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  display: block;\n  position: relative;\n  min-width: 0;\n}\n.sidebar-footer .sidebar-item:hover .item-text {\n  text-overflow: clip;\n}\n.sidebar-footer .sidebar-item:hover .item-text.text-overflowing {\n  display: block;\n  position: relative;\n  width: 100%;\n}\n.sidebar-footer .sidebar-item .item-text.text-overflowing::after {\n  content: attr(title);\n  position: absolute;\n  left: 0;\n  top: 0;\n  white-space: nowrap;\n  display: none;\n  color: inherit;\n  -webkit-mask-image:\n    linear-gradient(\n      to right,\n      transparent 0px,\n      black 32px,\n      black 100%);\n  mask-image:\n    linear-gradient(\n      to right,\n      transparent 0px,\n      black 32px,\n      black 100%);\n}\n@media (hover: hover) {\n  .sidebar-footer .sidebar-item:hover .item-text.text-overflowing::after {\n    display: block;\n    animation: scrollTextLeft 5s ease-in-out 0.5s infinite;\n  }\n  .sidebar-footer .sidebar-item:hover .item-text.text-overflowing {\n    text-indent: -9999px;\n    overflow: hidden;\n  }\n  .sidebar-footer .sidebar-item:hover .item-text.text-overflowing::after {\n    text-indent: 0;\n  }\n}\n.cashi-sidebar.collapsed .sidebar-footer .sidebar-item .item-text {\n  display: none;\n}\n.cashi-sidebar.collapsed .sidebar-footer .sidebar-item {\n  justify-content: center !important;\n  padding: 10px !important;\n}\n.sidebar-footer .sidebar-item.user-profile {\n  background-color: rgba(255, 255, 255, 0.05) !important;\n  background: rgba(255, 255, 255, 0.05) !important;\n  border: 1px solid rgba(255, 255, 255, 0.1) !important;\n}\n.sidebar-footer .sidebar-item.user-profile:hover {\n  background-color: rgba(255, 255, 255, 0.08) !important;\n  background: rgba(255, 255, 255, 0.08) !important;\n}\n.sidebar-footer button.sidebar-item:hover {\n  background-color: rgba(16, 185, 129, 0.1) !important;\n  background: rgba(16, 185, 129, 0.1) !important;\n  color: #10B981;\n}\n.sidebar-footer button.sidebar-item.logout-btn {\n  color: #ef4444;\n}\n.sidebar-footer button.sidebar-item.logout-btn:hover {\n  background-color: rgba(239, 68, 68, 0.1) !important;\n  background: rgba(239, 68, 68, 0.1) !important;\n  color: #ef4444;\n}\n.main-content {\n  margin-left: 240px;\n  width: calc(100% - 240px);\n  height: 100vh;\n  overflow-y: auto;\n  background-color: #0A0E27;\n  transition: margin-left 0.3s ease, width 0.3s ease;\n  padding: 0;\n  box-sizing: border-box;\n}\n.cashi-sidebar.collapsed ~ .main-content {\n  margin-left: 64px;\n  width: calc(100% - 64px);\n}\nhtml:not(.dark) .cashi-sidebar,\nbody.light-theme .cashi-sidebar {\n  background-color: #f8fafc !important;\n  border-right: 1px solid #cbd5e1 !important;\n  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.06) !important;\n}\nhtml:not(.dark) .app-container,\nbody.light-theme .app-container {\n  background-color: #f1f5f9 !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-logo,\nbody.light-theme .cashi-sidebar .sidebar-logo {\n  border-bottom: 1px solid #e2e8f0 !important;\n}\nhtml:not(.dark) .cashi-sidebar .logo-text,\nbody.light-theme .cashi-sidebar .logo-text {\n  color: #1e293b !important;\n}\nhtml:not(.dark) .sidebar-toggle,\nbody.light-theme .sidebar-toggle {\n  background-color: #10B981 !important;\n  background: #10B981 !important;\n  border: 2px solid #e2e8f0 !important;\n}\nhtml:not(.dark) .sidebar-toggle .icon,\nhtml:not(.dark) .sidebar-toggle lucide-angular,\nbody.light-theme .sidebar-toggle .icon,\nbody.light-theme .sidebar-toggle lucide-angular {\n  color: white !important;\n}\nhtml:not(.dark) .sidebar-toggle:hover,\nbody.light-theme .sidebar-toggle:hover {\n  background-color: #059669 !important;\n  background: #059669 !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-nav a.sidebar-item,\nhtml:not(.dark) .cashi-sidebar .sidebar-nav button.sidebar-item,\nhtml:not(.dark) .cashi-sidebar .sidebar-nav .sidebar-item,\nbody.light-theme .cashi-sidebar .sidebar-nav a.sidebar-item,\nbody.light-theme .cashi-sidebar .sidebar-nav button.sidebar-item,\nbody.light-theme .cashi-sidebar .sidebar-nav .sidebar-item {\n  color: #1e293b !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-nav .sidebar-item .item-text,\nbody.light-theme .cashi-sidebar .sidebar-nav .sidebar-item .item-text {\n  color: #1e293b !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-nav .sidebar-item lucide-angular,\nbody.light-theme .cashi-sidebar .sidebar-nav .sidebar-item lucide-angular {\n  color: #1e293b !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-nav .sidebar-item .dropdown-arrow,\nbody.light-theme .cashi-sidebar .sidebar-nav .sidebar-item .dropdown-arrow {\n  color: #1e293b !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-nav .sidebar-item .item-text.text-overflowing::after,\nbody.light-theme .cashi-sidebar .sidebar-nav .sidebar-item .item-text.text-overflowing::after {\n  color: #1e293b !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-nav a.sidebar-item:hover,\nhtml:not(.dark) .cashi-sidebar .sidebar-nav button.sidebar-item:hover,\nbody.light-theme .cashi-sidebar .sidebar-nav a.sidebar-item:hover,\nbody.light-theme .cashi-sidebar .sidebar-nav button.sidebar-item:hover {\n  background-color: rgba(16, 185, 129, 0.15) !important;\n  color: #047857 !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-nav a.sidebar-item:hover .item-text.text-overflowing::after,\nhtml:not(.dark) .cashi-sidebar .sidebar-nav button.sidebar-item:hover .item-text.text-overflowing::after,\nbody.light-theme .cashi-sidebar .sidebar-nav a.sidebar-item:hover .item-text.text-overflowing::after,\nbody.light-theme .cashi-sidebar .sidebar-nav button.sidebar-item:hover .item-text.text-overflowing::after {\n  color: #047857 !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-nav a.sidebar-item.active,\nhtml:not(.dark) .cashi-sidebar .sidebar-nav button.sidebar-item.active,\nbody.light-theme .cashi-sidebar .sidebar-nav a.sidebar-item.active,\nbody.light-theme .cashi-sidebar .sidebar-nav button.sidebar-item.active {\n  background-color: rgba(16, 185, 129, 0.2) !important;\n  color: #065f46 !important;\n  font-weight: 600;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-nav .sidebar-item.active::before,\nbody.light-theme .cashi-sidebar .sidebar-nav .sidebar-item.active::before {\n  background-color: #059669 !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-submenu a.sidebar-subitem,\nbody.light-theme .cashi-sidebar .sidebar-submenu a.sidebar-subitem {\n  color: #334155 !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-submenu .sidebar-subitem .item-text.text-overflowing::after,\nbody.light-theme .cashi-sidebar .sidebar-submenu .sidebar-subitem .item-text.text-overflowing::after {\n  color: #334155 !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-submenu a.sidebar-subitem:hover,\nbody.light-theme .cashi-sidebar .sidebar-submenu a.sidebar-subitem:hover {\n  background-color: rgba(16, 185, 129, 0.12) !important;\n  color: #047857 !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-submenu a.sidebar-subitem:hover .item-text.text-overflowing::after,\nbody.light-theme .cashi-sidebar .sidebar-submenu a.sidebar-subitem:hover .item-text.text-overflowing::after {\n  color: #047857 !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-submenu a.sidebar-subitem.active,\nbody.light-theme .cashi-sidebar .sidebar-submenu a.sidebar-subitem.active {\n  background-color: rgba(16, 185, 129, 0.18) !important;\n  color: #065f46 !important;\n  font-weight: 600 !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-submenu a.sidebar-subitem.active .item-text.text-overflowing::after,\nbody.light-theme .cashi-sidebar .sidebar-submenu a.sidebar-subitem.active .item-text.text-overflowing::after {\n  color: #065f46 !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-footer,\nbody.light-theme .cashi-sidebar .sidebar-footer {\n  border-top: 1px solid #e2e8f0 !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-footer .sidebar-item,\nbody.light-theme .cashi-sidebar .sidebar-footer .sidebar-item {\n  color: #1e293b !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-footer .sidebar-item .item-text.text-overflowing::after,\nbody.light-theme .cashi-sidebar .sidebar-footer .sidebar-item .item-text.text-overflowing::after {\n  color: #1e293b !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-footer .sidebar-item.user-profile,\nbody.light-theme .cashi-sidebar .sidebar-footer .sidebar-item.user-profile {\n  background-color: rgba(15, 23, 42, 0.06) !important;\n  border: 1px solid rgba(15, 23, 42, 0.15) !important;\n  color: #0f172a !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-footer .sidebar-item.user-profile:hover,\nbody.light-theme .cashi-sidebar .sidebar-footer .sidebar-item.user-profile:hover {\n  background-color: rgba(15, 23, 42, 0.1) !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-footer button.sidebar-item:hover,\nbody.light-theme .cashi-sidebar .sidebar-footer button.sidebar-item:hover {\n  background-color: rgba(16, 185, 129, 0.15) !important;\n  color: #047857 !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-footer button.sidebar-item:hover .item-text.text-overflowing::after,\nbody.light-theme .cashi-sidebar .sidebar-footer button.sidebar-item:hover .item-text.text-overflowing::after {\n  color: #047857 !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-footer button.sidebar-item.logout-btn,\nbody.light-theme .cashi-sidebar .sidebar-footer button.sidebar-item.logout-btn {\n  color: #dc2626 !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-footer button.sidebar-item.logout-btn:hover,\nbody.light-theme .cashi-sidebar .sidebar-footer button.sidebar-item.logout-btn:hover {\n  background-color: rgba(220, 38, 38, 0.1) !important;\n  color: #dc2626 !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-nav::-webkit-scrollbar-thumb,\nbody.light-theme .cashi-sidebar .sidebar-nav::-webkit-scrollbar-thumb {\n  background: #cbd5e1 !important;\n}\nhtml:not(.dark) .cashi-sidebar .sidebar-nav::-webkit-scrollbar-thumb:hover,\nbody.light-theme .cashi-sidebar .sidebar-nav::-webkit-scrollbar-thumb:hover {\n  background: #94a3b8 !important;\n}\nhtml:not(.dark) .main-content,\nbody.light-theme .main-content {\n  background-color: #f1f5f9 !important;\n}\nhtml.dark .main-content,\nbody.dark-theme .main-content {\n  background-color: #0A0E27 !important;\n}\n@media (max-width: 768px) {\n  .cashi-sidebar {\n    transform: translateX(-100%);\n  }\n  .cashi-sidebar.collapsed {\n    transform: translateX(0);\n    width: 64px;\n  }\n  .main-content {\n    margin-left: 0;\n    width: 100%;\n  }\n  .cashi-sidebar.collapsed ~ .main-content {\n    margin-left: 64px;\n    width: calc(100% - 64px);\n  }\n  .sidebar-toggle {\n    display: none !important;\n  }\n}\n@media (max-width: 480px) {\n  .cashi-sidebar.collapsed ~ .main-content {\n    margin-left: 0;\n    width: 100%;\n  }\n  .cashi-sidebar.collapsed {\n    transform: translateX(-100%);\n  }\n}\n.sidebar-nav .sidebar-item:focus-visible,\n.sidebar-submenu .sidebar-subitem:focus-visible,\n.sidebar-toggle:focus-visible,\n.sidebar-footer button.sidebar-item:focus-visible {\n  outline: 2px solid #10B981;\n  outline-offset: 2px;\n}\n:root.light .sidebar-nav .sidebar-item:focus-visible,\n:root.light .sidebar-submenu .sidebar-subitem:focus-visible,\n:root.light .sidebar-toggle:focus-visible,\n:root.light .sidebar-footer button.sidebar-item:focus-visible,\nbody.light-theme .sidebar-nav .sidebar-item:focus-visible,\nbody.light-theme .sidebar-submenu .sidebar-subitem:focus-visible,\nbody.light-theme .sidebar-toggle:focus-visible,\nbody.light-theme .sidebar-footer button.sidebar-item:focus-visible {\n  outline: 2px solid #059669;\n  outline-offset: 2px;\n}\n@media (prefers-reduced-motion: reduce) {\n  .cashi-sidebar,\n  .main-content,\n  .sidebar-submenu,\n  .sidebar-item,\n  .dropdown-arrow {\n    transition: none;\n  }\n}\n/*# sourceMappingURL=app.component.css.map */\n'] }]
  }], () => [{ type: AuthService }, { type: ThemeService }, { type: WebsocketService }, { type: SipService }, { type: InactivityService }, { type: SessionConfigService }, { type: AgentStatusService }, { type: RecordatoriosService }, { type: NotificacionesSistemaService }, { type: MatDialog }, { type: Router }], { onResize: [{
    type: HostListener,
    args: ["window:resize"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppComponent, { className: "AppComponent", filePath: "src/app/app.component.ts", lineNumber: 38 });
})();

// src/main.ts
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
/*! Bundled license information:

@angular/animations/fesm2022/util.mjs:
@angular/animations/fesm2022/browser.mjs:
@angular/platform-browser/fesm2022/animations.mjs:
  (**
   * @license Angular v20.3.3
   * (c) 2010-2025 Google LLC. https://angular.io/
   * License: MIT
   *)
*/
//# sourceMappingURL=main.js.map
