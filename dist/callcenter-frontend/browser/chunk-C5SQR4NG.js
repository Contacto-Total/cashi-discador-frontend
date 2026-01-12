import{a as Sc}from"./chunk-LA57DBYT.js";import{a as fc}from"./chunk-KAKL3FYD.js";import{a as cc,c as hc}from"./chunk-IW4UZOVV.js";import"./chunk-UXRZVQCL.js";import{D as yc,F as bc,c as pc,e as lr,f as mc,g as gc,l as xc,o as _c,r as vc}from"./chunk-E2JO3TS2.js";import{pc as dc,qc as uc}from"./chunk-3IYT5ASU.js";import"./chunk-YQKVMPSG.js";import"./chunk-72Z2NTOL.js";import{$a as nc,Da as ec,Db as sc,Kb as Kt,Lb as q,Mb as J,Nb as ce,Ub as uo,Wb as ln,Yb as Fn,a as ho,ab as Pt,ac as fo,b as tc,bc as po,cc as mo,cd as ac,dd as oc,g as is,gb as Dn,hc as rs,ic as cn,kc as st,lc as Je,ld as lc,ma as ar,mc as go,na as or,nb as ic,sb as Ln,wb as rc}from"./chunk-BDAG5FYU.js";var Zc=0,rl=1,Jc=2;var Wr=1,sa=2,Ki=3,En=0,Fe=1,fn=2,pn=0,oi=1,Qi=2,sl=3,al=4,$c=5,Gn=100,Kc=101,Qc=102,jc=103,th=104,eh=200,nh=201,ih=202,rh=203,Rs=204,Is=205,sh=206,ah=207,oh=208,lh=209,ch=210,hh=211,dh=212,uh=213,fh=214,aa=0,oa=1,la=2,li=3,ca=4,ha=5,da=6,ua=7,ol=0,ph=1,mh=2,rn=0,ll=1,cl=2,hl=3,dl=4,ul=5,fl=6,pl=7;var Wo=300,Zn=301,gi=302,fa=303,pa=304,Xr=306,Ps=1e3,dn=1001,Ds=1002,Te=1003,gh=1004;var Yr=1005;var Ce=1006,ma=1007;var Jn=1008;var Be=1009,ml=1010,gl=1011,ji=1012,ga=1013,sn=1014,an=1015,mn=1016,xa=1017,_a=1018,tr=1020,xl=35902,_l=35899,vl=1021,yl=1022,Ke=1023,un=1026,$n=1027,bl=1028,va=1029,xi=1030,ya=1031;var ba=1033,qr=33776,Zr=33777,Jr=33778,$r=33779,Sa=35840,Ma=35841,wa=35842,Ea=35843,Ta=36196,Aa=37492,Ca=37496,Ra=37488,Ia=37489,Pa=37490,Da=37491,La=37808,Fa=37809,Na=37810,Ua=37811,Oa=37812,Ba=37813,ka=37814,za=37815,Va=37816,Ga=37817,Ha=37818,Wa=37819,Xa=37820,Ya=37821,qa=36492,Za=36494,Ja=36495,$a=36283,Ka=36284,Qa=36285,ja=36286;var xr=2300,Ls=2301,Cs=2302,Xo=2400,Yo=2401,qo=2402;var xh=3200;var Sl=0,_h=1,In="",He="srgb",ci="srgb-linear",_r="linear",ne="srgb";var ri=7680;var Zo=519,vh=512,yh=513,bh=514,to=515,Sh=516,Mh=517,eo=518,wh=519,Jo=35044;var Ml="300 es",en=2e3,vr=2001;function wl(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function pd(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function yr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Eh(){let i=yr("canvas");return i.style.display="block",i}var Mc={},Ui=null;function El(...i){let t="THREE."+i.shift();Ui?Ui("log",t,...i):console.log(t,...i)}function Vt(...i){let t="THREE."+i.shift();Ui?Ui("warn",t,...i):console.warn(t,...i)}function kt(...i){let t="THREE."+i.shift();Ui?Ui("error",t,...i):console.error(t,...i)}function Oi(...i){let t=i.join(" ");t in Mc||(Mc[t]=!0,Vt(...i))}function Th(i,t,e){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:n()}}setTimeout(s,e)})}var Tn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let r=n[t];if(r!==void 0){let s=r.indexOf(e);s!==-1&&r.splice(s,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let r=n.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,t);t.target=null}}},Ie=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var xo=Math.PI/180,Fs=180/Math.PI;function er(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ie[i&255]+Ie[i>>8&255]+Ie[i>>16&255]+Ie[i>>24&255]+"-"+Ie[t&255]+Ie[t>>8&255]+"-"+Ie[t>>16&15|64]+Ie[t>>24&255]+"-"+Ie[e&63|128]+Ie[e>>8&255]+"-"+Ie[e>>16&255]+Ie[e>>24&255]+Ie[n&255]+Ie[n>>8&255]+Ie[n>>16&255]+Ie[n>>24&255]).toLowerCase()}function $t(i,t,e){return Math.max(t,Math.min(e,i))}function md(i,t){return(i%t+t)%t}function _o(i,t,e){return(1-e)*i+e*t}function cr(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Oe(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var _t=class i{constructor(t=0,e=0){i.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6],this.y=r[1]*e+r[4]*n+r[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=$t(this.x,t.x,e.x),this.y=$t(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=$t(this.x,t,e),this.y=$t(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar($t(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos($t(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),r=Math.sin(e),s=this.x-t.x,a=this.y-t.y;return this.x=s*n-a*r+t.x,this.y=s*r+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},An=class{constructor(t=0,e=0,n=0,r=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=r}static slerpFlat(t,e,n,r,s,a,o){let l=n[r+0],c=n[r+1],h=n[r+2],d=n[r+3],u=s[a+0],p=s[a+1],x=s[a+2],_=s[a+3];if(o<=0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d;return}if(o>=1){t[e+0]=u,t[e+1]=p,t[e+2]=x,t[e+3]=_;return}if(d!==_||l!==u||c!==p||h!==x){let m=l*u+c*p+h*x+d*_;m<0&&(u=-u,p=-p,x=-x,_=-_,m=-m);let f=1-o;if(m<.9995){let T=Math.acos(m),w=Math.sin(T);f=Math.sin(f*T)/w,o=Math.sin(o*T)/w,l=l*f+u*o,c=c*f+p*o,h=h*f+x*o,d=d*f+_*o}else{l=l*f+u*o,c=c*f+p*o,h=h*f+x*o,d=d*f+_*o;let T=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=T,c*=T,h*=T,d*=T}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,r,s,a){let o=n[r],l=n[r+1],c=n[r+2],h=n[r+3],d=s[a],u=s[a+1],p=s[a+2],x=s[a+3];return t[e]=o*x+h*d+l*p-c*u,t[e+1]=l*x+h*u+c*d-o*p,t[e+2]=c*x+h*p+o*u-l*d,t[e+3]=h*x-o*d-l*u-c*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,r){return this._x=t,this._y=e,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,r=t._y,s=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(r/2),d=o(s/2),u=l(n/2),p=l(r/2),x=l(s/2);switch(a){case"XYZ":this._x=u*h*d+c*p*x,this._y=c*p*d-u*h*x,this._z=c*h*x+u*p*d,this._w=c*h*d-u*p*x;break;case"YXZ":this._x=u*h*d+c*p*x,this._y=c*p*d-u*h*x,this._z=c*h*x-u*p*d,this._w=c*h*d+u*p*x;break;case"ZXY":this._x=u*h*d-c*p*x,this._y=c*p*d+u*h*x,this._z=c*h*x+u*p*d,this._w=c*h*d-u*p*x;break;case"ZYX":this._x=u*h*d-c*p*x,this._y=c*p*d+u*h*x,this._z=c*h*x-u*p*d,this._w=c*h*d+u*p*x;break;case"YZX":this._x=u*h*d+c*p*x,this._y=c*p*d+u*h*x,this._z=c*h*x-u*p*d,this._w=c*h*d-u*p*x;break;case"XZY":this._x=u*h*d-c*p*x,this._y=c*p*d-u*h*x,this._z=c*h*x+u*p*d,this._w=c*h*d+u*p*x;break;default:Vt("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,r=Math.sin(n);return this._x=t.x*r,this._y=t.y*r,this._z=t.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],r=e[4],s=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],d=e[10],u=n+o+d;if(u>0){let p=.5/Math.sqrt(u+1);this._w=.25/p,this._x=(h-l)*p,this._y=(s-c)*p,this._z=(a-r)*p}else if(n>o&&n>d){let p=2*Math.sqrt(1+n-o-d);this._w=(h-l)/p,this._x=.25*p,this._y=(r+a)/p,this._z=(s+c)/p}else if(o>d){let p=2*Math.sqrt(1+o-n-d);this._w=(s-c)/p,this._x=(r+a)/p,this._y=.25*p,this._z=(l+h)/p}else{let p=2*Math.sqrt(1+d-n-o);this._w=(a-r)/p,this._x=(s+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs($t(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let r=Math.min(1,e/n);return this.slerp(t,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,r=t._y,s=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+a*o+r*c-s*l,this._y=r*h+a*l+s*o-n*c,this._z=s*h+a*c+n*l-r*o,this._w=a*h-n*o-r*l-s*c,this._onChangeCallback(),this}slerp(t,e){if(e<=0)return this;if(e>=1)return this.copy(t);let n=t._x,r=t._y,s=t._z,a=t._w,o=this.dot(t);o<0&&(n=-n,r=-r,s=-s,a=-a,o=-o);let l=1-e;if(o<.9995){let c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+n*e,this._y=this._y*l+r*e,this._z=this._z*l+s*e,this._w=this._w*l+a*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+r*e,this._z=this._z*l+s*e,this._w=this._w*l+a*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(t),r*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},L=class i{constructor(t=0,e=0,n=0){i.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(wc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(wc.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6]*r,this.y=s[1]*e+s[4]*n+s[7]*r,this.z=s[2]*e+s[5]*n+s[8]*r,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,r=this.z,s=t.elements,a=1/(s[3]*e+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*e+s[4]*n+s[8]*r+s[12])*a,this.y=(s[1]*e+s[5]*n+s[9]*r+s[13])*a,this.z=(s[2]*e+s[6]*n+s[10]*r+s[14])*a,this}applyQuaternion(t){let e=this.x,n=this.y,r=this.z,s=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*r-o*n),h=2*(o*e-s*r),d=2*(s*n-a*e);return this.x=e+l*c+a*d-o*h,this.y=n+l*h+o*c-s*d,this.z=r+l*d+s*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[4]*n+s[8]*r,this.y=s[1]*e+s[5]*n+s[9]*r,this.z=s[2]*e+s[6]*n+s[10]*r,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=$t(this.x,t.x,e.x),this.y=$t(this.y,t.y,e.y),this.z=$t(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=$t(this.x,t,e),this.y=$t(this.y,t,e),this.z=$t(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar($t(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,r=t.y,s=t.z,a=e.x,o=e.y,l=e.z;return this.x=r*l-s*o,this.y=s*a-n*l,this.z=n*o-r*a,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return vo.copy(this).projectOnVector(t),this.sub(vo)}reflect(t){return this.sub(vo.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos($t(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,r=this.z-t.z;return e*e+n*n+r*r}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let r=Math.sin(e)*t;return this.x=r*Math.sin(n),this.y=Math.cos(e)*t,this.z=r*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),r=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=r,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},vo=new L,wc=new An,Yt=class i{constructor(t,e,n,r,s,a,o,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,a,o,l,c)}set(t,e,n,r,s,a,o,l,c){let h=this.elements;return h[0]=t,h[1]=r,h[2]=o,h[3]=e,h[4]=s,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,r=e.elements,s=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],p=n[5],x=n[8],_=r[0],m=r[3],f=r[6],T=r[1],w=r[4],M=r[7],A=r[2],C=r[5],R=r[8];return s[0]=a*_+o*T+l*A,s[3]=a*m+o*w+l*C,s[6]=a*f+o*M+l*R,s[1]=c*_+h*T+d*A,s[4]=c*m+h*w+d*C,s[7]=c*f+h*M+d*R,s[2]=u*_+p*T+x*A,s[5]=u*m+p*w+x*C,s[8]=u*f+p*M+x*R,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-n*s*h+n*o*l+r*s*c-r*a*l}invert(){let t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],d=h*a-o*c,u=o*l-h*s,p=c*s-a*l,x=e*d+n*u+r*p;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/x;return t[0]=d*_,t[1]=(r*c-h*n)*_,t[2]=(o*n-r*a)*_,t[3]=u*_,t[4]=(h*e-r*l)*_,t[5]=(r*s-o*e)*_,t[6]=p*_,t[7]=(n*l-c*e)*_,t[8]=(a*e-n*s)*_,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,r,s,a,o){let l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-r*c,r*l,-r*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(yo.makeScale(t,e)),this}rotate(t){return this.premultiply(yo.makeRotation(-t)),this}translate(t,e){return this.premultiply(yo.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let r=0;r<9;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},yo=new Yt,Ec=new Yt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Tc=new Yt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function gd(){let i={enabled:!0,workingColorSpace:ci,spaces:{},convert:function(r,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===ne&&(r.r=wn(r.r),r.g=wn(r.g),r.b=wn(r.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ne&&(r.r=Ni(r.r),r.g=Ni(r.g),r.b=Ni(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===In?_r:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,a){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return Oi("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return Oi("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(r,s)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[ci]:{primaries:t,whitePoint:n,transfer:_r,toXYZ:Ec,fromXYZ:Tc,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:He},outputColorSpaceConfig:{drawingBufferColorSpace:He}},[He]:{primaries:t,whitePoint:n,transfer:ne,toXYZ:Ec,fromXYZ:Tc,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:He}}}),i}var te=gd();function wn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ni(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Mi,Ns=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Mi===void 0&&(Mi=yr("canvas")),Mi.width=t.width,Mi.height=t.height;let r=Mi.getContext("2d");t instanceof ImageData?r.putImageData(t,0,0):r.drawImage(t,0,0,t.width,t.height),n=Mi}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=yr("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let r=n.getImageData(0,0,t.width,t.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=wn(s[a]/255)*255;return n.putImageData(r,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(wn(e[n]/255)*255):e[n]=wn(e[n]);return{data:e,width:t.width,height:t.height}}else return Vt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},xd=0,Bi=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:xd++}),this.uuid=er(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(bo(r[a].image)):s.push(bo(r[a]))}else s=bo(r);n.url=s}return e||(t.images[this.uuid]=n),n}};function bo(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Ns.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Vt("Texture: Unable to serialize Texture."),{})}var _d=0,So=new L,Pn=(()=>{class i extends Tn{constructor(e=i.DEFAULT_IMAGE,n=i.DEFAULT_MAPPING,r=dn,s=dn,a=Ce,o=Jn,l=Ke,c=Be,h=i.DEFAULT_ANISOTROPY,d=In){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:_d++}),this.uuid=er(),this.name="",this.source=new Bi(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=s,this.magFilter=a,this.minFilter=o,this.anisotropy=h,this.format=l,this.internalFormat=null,this.type=c,this.offset=new _t(0,0),this.repeat=new _t(1,1),this.center=new _t(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Yt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(So).x}get height(){return this.source.getSize(So).y}get depth(){return this.source.getSize(So).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let n in e){let r=e[n];if(r===void 0){Vt(`Texture.setValues(): parameter '${n}' has value of undefined.`);continue}let s=this[n];if(s===void 0){Vt(`Texture.setValues(): property '${n}' does not exist.`);continue}s&&r&&s.isVector2&&r.isVector2||s&&r&&s.isVector3&&r.isVector3||s&&r&&s.isMatrix3&&r.isMatrix3?s.copy(r):this[n]=r}}toJSON(e){let n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let r={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(r.userData=this.userData),n||(e.textures[this.uuid]=r),r}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Wo)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ps:e.x=e.x-Math.floor(e.x);break;case dn:e.x=e.x<0?0:1;break;case Ds:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ps:e.y=e.y-Math.floor(e.y);break;case dn:e.y=e.y<0?0:1;break;case Ds:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}return i.DEFAULT_IMAGE=null,i.DEFAULT_MAPPING=Wo,i.DEFAULT_ANISOTROPY=1,i})(),me=class i{constructor(t=0,e=0,n=0,r=1){i.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=r}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,r){return this.x=t,this.y=e,this.z=n,this.w=r,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,r=this.z,s=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*r+a[12]*s,this.y=a[1]*e+a[5]*n+a[9]*r+a[13]*s,this.z=a[2]*e+a[6]*n+a[10]*r+a[14]*s,this.w=a[3]*e+a[7]*n+a[11]*r+a[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,r,s,l=t.elements,c=l[0],h=l[4],d=l[8],u=l[1],p=l[5],x=l[9],_=l[2],m=l[6],f=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-_)<.01&&Math.abs(x-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+_)<.1&&Math.abs(x+m)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let w=(c+1)/2,M=(p+1)/2,A=(f+1)/2,C=(h+u)/4,R=(d+_)/4,N=(x+m)/4;return w>M&&w>A?w<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(w),r=C/n,s=R/n):M>A?M<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(M),n=C/r,s=N/r):A<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(A),n=R/s,r=N/s),this.set(n,r,s,e),this}let T=Math.sqrt((m-x)*(m-x)+(d-_)*(d-_)+(u-h)*(u-h));return Math.abs(T)<.001&&(T=1),this.x=(m-x)/T,this.y=(d-_)/T,this.z=(u-h)/T,this.w=Math.acos((c+p+f-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=$t(this.x,t.x,e.x),this.y=$t(this.y,t.y,e.y),this.z=$t(this.z,t.z,e.z),this.w=$t(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=$t(this.x,t,e),this.y=$t(this.y,t,e),this.z=$t(this.z,t,e),this.w=$t(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar($t(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Us=class extends Tn{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ce,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new me(0,0,t,e),this.scissorTest=!1,this.viewport=new me(0,0,t,e);let r={width:t,height:e,depth:n.depth},s=new Pn(r);this.textures=[];let a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){let e={minFilter:Ce,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=t,this.textures[r].image.height=e,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let r=Object.assign({},t.textures[e].image);this.textures[e].source=new Bi(r)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},We=class extends Us{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},br=class extends Pn{constructor(t=null,e=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=Te,this.minFilter=Te,this.wrapR=dn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Os=class extends Pn{constructor(t=null,e=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=Te,this.minFilter=Te,this.wrapR=dn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Hn=class{constructor(t=new L(1/0,1/0,1/0),e=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Qe.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Qe.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=Qe.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let s=n.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Qe):Qe.fromBufferAttribute(s,a),Qe.applyMatrix4(t.matrixWorld),this.expandByPoint(Qe);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ss.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ss.copy(n.boundingBox)),ss.applyMatrix4(t.matrixWorld),this.union(ss)}let r=t.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Qe),Qe.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(hr),as.subVectors(this.max,hr),wi.subVectors(t.a,hr),Ei.subVectors(t.b,hr),Ti.subVectors(t.c,hr),Nn.subVectors(Ei,wi),Un.subVectors(Ti,Ei),ti.subVectors(wi,Ti);let e=[0,-Nn.z,Nn.y,0,-Un.z,Un.y,0,-ti.z,ti.y,Nn.z,0,-Nn.x,Un.z,0,-Un.x,ti.z,0,-ti.x,-Nn.y,Nn.x,0,-Un.y,Un.x,0,-ti.y,ti.x,0];return!Mo(e,wi,Ei,Ti,as)||(e=[1,0,0,0,1,0,0,0,1],!Mo(e,wi,Ei,Ti,as))?!1:(os.crossVectors(Nn,Un),e=[os.x,os.y,os.z],Mo(e,wi,Ei,Ti,as))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Qe).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Qe).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(vn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),vn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),vn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),vn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),vn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),vn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),vn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),vn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(vn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},vn=[new L,new L,new L,new L,new L,new L,new L,new L],Qe=new L,ss=new Hn,wi=new L,Ei=new L,Ti=new L,Nn=new L,Un=new L,ti=new L,hr=new L,as=new L,os=new L,ei=new L;function Mo(i,t,e,n,r){for(let s=0,a=i.length-3;s<=a;s+=3){ei.fromArray(i,s);let o=r.x*Math.abs(ei.x)+r.y*Math.abs(ei.y)+r.z*Math.abs(ei.z),l=t.dot(ei),c=e.dot(ei),h=n.dot(ei);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var vd=new Hn,dr=new L,wo=new L,hi=class{constructor(t=new L,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):vd.setFromPoints(t).getCenter(n);let r=0;for(let s=0,a=t.length;s<a;s++)r=Math.max(r,n.distanceToSquared(t[s]));return this.radius=Math.sqrt(r),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;dr.subVectors(t,this.center);let e=dr.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),r=(n-this.radius)*.5;this.center.addScaledVector(dr,r/n),this.radius+=r}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(wo.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(dr.copy(t.center).add(wo)),this.expandByPoint(dr.copy(t.center).sub(wo))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},yn=new L,Eo=new L,ls=new L,On=new L,To=new L,cs=new L,Ao=new L,Sr=class{constructor(t=new L,e=new L(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,yn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=yn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(yn.copy(this.origin).addScaledVector(this.direction,e),yn.distanceToSquared(t))}distanceSqToSegment(t,e,n,r){Eo.copy(t).add(e).multiplyScalar(.5),ls.copy(e).sub(t).normalize(),On.copy(this.origin).sub(Eo);let s=t.distanceTo(e)*.5,a=-this.direction.dot(ls),o=On.dot(this.direction),l=-On.dot(ls),c=On.lengthSq(),h=Math.abs(1-a*a),d,u,p,x;if(h>0)if(d=a*l-o,u=a*o-l,x=s*h,d>=0)if(u>=-x)if(u<=x){let _=1/h;d*=_,u*=_,p=d*(d+a*u+2*o)+u*(a*d+u+2*l)+c}else u=s,d=Math.max(0,-(a*u+o)),p=-d*d+u*(u+2*l)+c;else u=-s,d=Math.max(0,-(a*u+o)),p=-d*d+u*(u+2*l)+c;else u<=-x?(d=Math.max(0,-(-a*s+o)),u=d>0?-s:Math.min(Math.max(-s,-l),s),p=-d*d+u*(u+2*l)+c):u<=x?(d=0,u=Math.min(Math.max(-s,-l),s),p=u*(u+2*l)+c):(d=Math.max(0,-(a*s+o)),u=d>0?s:Math.min(Math.max(-s,-l),s),p=-d*d+u*(u+2*l)+c);else u=a>0?-s:s,d=Math.max(0,-(a*u+o)),p=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),r&&r.copy(Eo).addScaledVector(ls,u),p}intersectSphere(t,e){yn.subVectors(t.center,this.origin);let n=yn.dot(this.direction),r=yn.dot(yn)-n*n,s=t.radius*t.radius;if(r>s)return null;let a=Math.sqrt(s-r),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,r,s,a,o,l,c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,r=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,r=(t.min.x-u.x)*c),h>=0?(s=(t.min.y-u.y)*h,a=(t.max.y-u.y)*h):(s=(t.max.y-u.y)*h,a=(t.min.y-u.y)*h),n>a||s>r||((s>n||isNaN(n))&&(n=s),(a<r||isNaN(r))&&(r=a),d>=0?(o=(t.min.z-u.z)*d,l=(t.max.z-u.z)*d):(o=(t.max.z-u.z)*d,l=(t.min.z-u.z)*d),n>l||o>r)||((o>n||n!==n)&&(n=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(n>=0?n:r,e)}intersectsBox(t){return this.intersectBox(t,yn)!==null}intersectTriangle(t,e,n,r,s){To.subVectors(e,t),cs.subVectors(n,t),Ao.crossVectors(To,cs);let a=this.direction.dot(Ao),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;On.subVectors(this.origin,t);let l=o*this.direction.dot(cs.crossVectors(On,cs));if(l<0)return null;let c=o*this.direction.dot(To.cross(On));if(c<0||l+c>a)return null;let h=-o*On.dot(Ao);return h<0?null:this.at(h/a,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},fe=class i{constructor(t,e,n,r,s,a,o,l,c,h,d,u,p,x,_,m){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,a,o,l,c,h,d,u,p,x,_,m)}set(t,e,n,r,s,a,o,l,c,h,d,u,p,x,_,m){let f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=r,f[1]=s,f[5]=a,f[9]=o,f[13]=l,f[2]=c,f[6]=h,f[10]=d,f[14]=u,f[3]=p,f[7]=x,f[11]=_,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinant()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinant()===0)return this.identity();let e=this.elements,n=t.elements,r=1/Ai.setFromMatrixColumn(t,0).length(),s=1/Ai.setFromMatrixColumn(t,1).length(),a=1/Ai.setFromMatrixColumn(t,2).length();return e[0]=n[0]*r,e[1]=n[1]*r,e[2]=n[2]*r,e[3]=0,e[4]=n[4]*s,e[5]=n[5]*s,e[6]=n[6]*s,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,r=t.y,s=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(r),c=Math.sin(r),h=Math.cos(s),d=Math.sin(s);if(t.order==="XYZ"){let u=a*h,p=a*d,x=o*h,_=o*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=p+x*c,e[5]=u-_*c,e[9]=-o*l,e[2]=_-u*c,e[6]=x+p*c,e[10]=a*l}else if(t.order==="YXZ"){let u=l*h,p=l*d,x=c*h,_=c*d;e[0]=u+_*o,e[4]=x*o-p,e[8]=a*c,e[1]=a*d,e[5]=a*h,e[9]=-o,e[2]=p*o-x,e[6]=_+u*o,e[10]=a*l}else if(t.order==="ZXY"){let u=l*h,p=l*d,x=c*h,_=c*d;e[0]=u-_*o,e[4]=-a*d,e[8]=x+p*o,e[1]=p+x*o,e[5]=a*h,e[9]=_-u*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){let u=a*h,p=a*d,x=o*h,_=o*d;e[0]=l*h,e[4]=x*c-p,e[8]=u*c+_,e[1]=l*d,e[5]=_*c+u,e[9]=p*c-x,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){let u=a*l,p=a*c,x=o*l,_=o*c;e[0]=l*h,e[4]=_-u*d,e[8]=x*d+p,e[1]=d,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=p*d+x,e[10]=u-_*d}else if(t.order==="XZY"){let u=a*l,p=a*c,x=o*l,_=o*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=u*d+_,e[5]=a*h,e[9]=p*d-x,e[2]=x*d-p,e[6]=o*h,e[10]=_*d+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(yd,t,bd)}lookAt(t,e,n){let r=this.elements;return Ve.subVectors(t,e),Ve.lengthSq()===0&&(Ve.z=1),Ve.normalize(),Bn.crossVectors(n,Ve),Bn.lengthSq()===0&&(Math.abs(n.z)===1?Ve.x+=1e-4:Ve.z+=1e-4,Ve.normalize(),Bn.crossVectors(n,Ve)),Bn.normalize(),hs.crossVectors(Ve,Bn),r[0]=Bn.x,r[4]=hs.x,r[8]=Ve.x,r[1]=Bn.y,r[5]=hs.y,r[9]=Ve.y,r[2]=Bn.z,r[6]=hs.z,r[10]=Ve.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,r=e.elements,s=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],p=n[13],x=n[2],_=n[6],m=n[10],f=n[14],T=n[3],w=n[7],M=n[11],A=n[15],C=r[0],R=r[4],N=r[8],v=r[12],b=r[1],I=r[5],k=r[9],O=r[13],Y=r[2],G=r[6],H=r[10],B=r[14],tt=r[3],mt=r[7],ct=r[11],ut=r[15];return s[0]=a*C+o*b+l*Y+c*tt,s[4]=a*R+o*I+l*G+c*mt,s[8]=a*N+o*k+l*H+c*ct,s[12]=a*v+o*O+l*B+c*ut,s[1]=h*C+d*b+u*Y+p*tt,s[5]=h*R+d*I+u*G+p*mt,s[9]=h*N+d*k+u*H+p*ct,s[13]=h*v+d*O+u*B+p*ut,s[2]=x*C+_*b+m*Y+f*tt,s[6]=x*R+_*I+m*G+f*mt,s[10]=x*N+_*k+m*H+f*ct,s[14]=x*v+_*O+m*B+f*ut,s[3]=T*C+w*b+M*Y+A*tt,s[7]=T*R+w*I+M*G+A*mt,s[11]=T*N+w*k+M*H+A*ct,s[15]=T*v+w*O+M*B+A*ut,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],r=t[8],s=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],d=t[6],u=t[10],p=t[14],x=t[3],_=t[7],m=t[11],f=t[15],T=l*p-c*u,w=o*p-c*d,M=o*u-l*d,A=a*p-c*h,C=a*u-l*h,R=a*d-o*h;return e*(_*T-m*w+f*M)-n*(x*T-m*A+f*C)+r*(x*w-_*A+f*R)-s*(x*M-_*C+m*R)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let r=this.elements;return t.isVector3?(r[12]=t.x,r[13]=t.y,r[14]=t.z):(r[12]=t,r[13]=e,r[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],d=t[9],u=t[10],p=t[11],x=t[12],_=t[13],m=t[14],f=t[15],T=d*m*c-_*u*c+_*l*p-o*m*p-d*l*f+o*u*f,w=x*u*c-h*m*c-x*l*p+a*m*p+h*l*f-a*u*f,M=h*_*c-x*d*c+x*o*p-a*_*p-h*o*f+a*d*f,A=x*d*l-h*_*l-x*o*u+a*_*u+h*o*m-a*d*m,C=e*T+n*w+r*M+s*A;if(C===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let R=1/C;return t[0]=T*R,t[1]=(_*u*s-d*m*s-_*r*p+n*m*p+d*r*f-n*u*f)*R,t[2]=(o*m*s-_*l*s+_*r*c-n*m*c-o*r*f+n*l*f)*R,t[3]=(d*l*s-o*u*s-d*r*c+n*u*c+o*r*p-n*l*p)*R,t[4]=w*R,t[5]=(h*m*s-x*u*s+x*r*p-e*m*p-h*r*f+e*u*f)*R,t[6]=(x*l*s-a*m*s-x*r*c+e*m*c+a*r*f-e*l*f)*R,t[7]=(a*u*s-h*l*s+h*r*c-e*u*c-a*r*p+e*l*p)*R,t[8]=M*R,t[9]=(x*d*s-h*_*s-x*n*p+e*_*p+h*n*f-e*d*f)*R,t[10]=(a*_*s-x*o*s+x*n*c-e*_*c-a*n*f+e*o*f)*R,t[11]=(h*o*s-a*d*s-h*n*c+e*d*c+a*n*p-e*o*p)*R,t[12]=A*R,t[13]=(h*_*r-x*d*r+x*n*u-e*_*u-h*n*m+e*d*m)*R,t[14]=(x*o*r-a*_*r-x*n*l+e*_*l+a*n*m-e*o*m)*R,t[15]=(a*d*r-h*o*r+h*n*l-e*d*l-a*n*u+e*o*u)*R,this}scale(t){let e=this.elements,n=t.x,r=t.y,s=t.z;return e[0]*=n,e[4]*=r,e[8]*=s,e[1]*=n,e[5]*=r,e[9]*=s,e[2]*=n,e[6]*=r,e[10]*=s,e[3]*=n,e[7]*=r,e[11]*=s,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],r=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,r))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),r=Math.sin(e),s=1-n,a=t.x,o=t.y,l=t.z,c=s*a,h=s*o;return this.set(c*a+n,c*o-r*l,c*l+r*o,0,c*o+r*l,h*o+n,h*l-r*a,0,c*l-r*o,h*l+r*a,s*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,r,s,a){return this.set(1,n,s,0,t,1,a,0,e,r,1,0,0,0,0,1),this}compose(t,e,n){let r=this.elements,s=e._x,a=e._y,o=e._z,l=e._w,c=s+s,h=a+a,d=o+o,u=s*c,p=s*h,x=s*d,_=a*h,m=a*d,f=o*d,T=l*c,w=l*h,M=l*d,A=n.x,C=n.y,R=n.z;return r[0]=(1-(_+f))*A,r[1]=(p+M)*A,r[2]=(x-w)*A,r[3]=0,r[4]=(p-M)*C,r[5]=(1-(u+f))*C,r[6]=(m+T)*C,r[7]=0,r[8]=(x+w)*R,r[9]=(m-T)*R,r[10]=(1-(u+_))*R,r[11]=0,r[12]=t.x,r[13]=t.y,r[14]=t.z,r[15]=1,this}decompose(t,e,n){let r=this.elements;if(t.x=r[12],t.y=r[13],t.z=r[14],this.determinant()===0)return n.set(1,1,1),e.identity(),this;let s=Ai.set(r[0],r[1],r[2]).length(),a=Ai.set(r[4],r[5],r[6]).length(),o=Ai.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),je.copy(this);let c=1/s,h=1/a,d=1/o;return je.elements[0]*=c,je.elements[1]*=c,je.elements[2]*=c,je.elements[4]*=h,je.elements[5]*=h,je.elements[6]*=h,je.elements[8]*=d,je.elements[9]*=d,je.elements[10]*=d,e.setFromRotationMatrix(je),n.x=s,n.y=a,n.z=o,this}makePerspective(t,e,n,r,s,a,o=en,l=!1){let c=this.elements,h=2*s/(e-t),d=2*s/(n-r),u=(e+t)/(e-t),p=(n+r)/(n-r),x,_;if(l)x=s/(a-s),_=a*s/(a-s);else if(o===en)x=-(a+s)/(a-s),_=-2*a*s/(a-s);else if(o===vr)x=-a/(a-s),_=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=x,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,r,s,a,o=en,l=!1){let c=this.elements,h=2/(e-t),d=2/(n-r),u=-(e+t)/(e-t),p=-(n+r)/(n-r),x,_;if(l)x=1/(a-s),_=a/(a-s);else if(o===en)x=-2/(a-s),_=-(a+s)/(a-s);else if(o===vr)x=-1/(a-s),_=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=d,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=x,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let r=0;r<16;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},Ai=new L,je=new fe,yd=new L(0,0,0),bd=new L(1,1,1),Bn=new L,hs=new L,Ve=new L,Ac=new fe,Cc=new An,Wn=(()=>{class i{constructor(e=0,n=0,r=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=r,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,r,s=this._order){return this._x=e,this._y=n,this._z=r,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,r=!0){let s=e.elements,a=s[0],o=s[4],l=s[8],c=s[1],h=s[5],d=s[9],u=s[2],p=s[6],x=s[10];switch(n){case"XYZ":this._y=Math.asin($t(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,x),this._z=Math.atan2(-o,a)):(this._x=Math.atan2(p,h),this._z=0);break;case"YXZ":this._x=Math.asin(-$t(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(l,x),this._z=Math.atan2(c,h)):(this._y=Math.atan2(-u,a),this._z=0);break;case"ZXY":this._x=Math.asin($t(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-u,x),this._z=Math.atan2(-o,h)):(this._y=0,this._z=Math.atan2(c,a));break;case"ZYX":this._y=Math.asin(-$t(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(p,x),this._z=Math.atan2(c,a)):(this._x=0,this._z=Math.atan2(-o,h));break;case"YZX":this._z=Math.asin($t(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,h),this._y=Math.atan2(-u,a)):(this._x=0,this._y=Math.atan2(l,x));break;case"XZY":this._z=Math.asin(-$t(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(p,h),this._y=Math.atan2(l,a)):(this._x=Math.atan2(-d,x),this._y=0);break;default:Vt("Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,r===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,r){return Ac.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ac,n,r)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return Cc.setFromEuler(this),this.setFromQuaternion(Cc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}return i.DEFAULT_ORDER="XYZ",i})(),Mr=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Sd=0,Rc=new L,Ci=new An,bn=new fe,ds=new L,ur=new L,Md=new L,wd=new An,Ic=new L(1,0,0),Pc=new L(0,1,0),Dc=new L(0,0,1),Lc={type:"added"},Ed={type:"removed"},Ri={type:"childadded",child:null},Co={type:"childremoved",child:null},nn=(()=>{class i extends Tn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Sd++}),this.uuid=er(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new L,n=new Wn,r=new An,s=new L(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new fe},normalMatrix:{value:new Yt}}),this.matrix=new fe,this.matrixWorld=new fe,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Mr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return Ci.setFromAxisAngle(e,n),this.quaternion.multiply(Ci),this}rotateOnWorldAxis(e,n){return Ci.setFromAxisAngle(e,n),this.quaternion.premultiply(Ci),this}rotateX(e){return this.rotateOnAxis(Ic,e)}rotateY(e){return this.rotateOnAxis(Pc,e)}rotateZ(e){return this.rotateOnAxis(Dc,e)}translateOnAxis(e,n){return Rc.copy(e).applyQuaternion(this.quaternion),this.position.add(Rc.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(Ic,e)}translateY(e){return this.translateOnAxis(Pc,e)}translateZ(e){return this.translateOnAxis(Dc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(bn.copy(this.matrixWorld).invert())}lookAt(e,n,r){e.isVector3?ds.copy(e):ds.set(e,n,r);let s=this.parent;this.updateWorldMatrix(!0,!1),ur.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?bn.lookAt(ur,ds,this.up):bn.lookAt(ds,ur,this.up),this.quaternion.setFromRotationMatrix(bn),s&&(bn.extractRotation(s.matrixWorld),Ci.setFromRotationMatrix(bn),this.quaternion.premultiply(Ci.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(kt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Lc),Ri.child=e,this.dispatchEvent(Ri),Ri.child=null):kt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let r=0;r<arguments.length;r++)this.remove(arguments[r]);return this}let n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(Ed),Co.child=e,this.dispatchEvent(Co),Co.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),bn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),bn.multiply(e.parent.matrixWorld)),e.applyMatrix4(bn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Lc),Ri.child=e,this.dispatchEvent(Ri),Ri.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let r=0,s=this.children.length;r<s;r++){let o=this.children[r].getObjectByProperty(e,n);if(o!==void 0)return o}}getObjectsByProperty(e,n,r=[]){this[e]===n&&r.push(this);let s=this.children;for(let a=0,o=s.length;a<o;a++)s[a].getObjectsByProperty(e,n,r);return r}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ur,e,Md),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ur,wd,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);let n=this.children;for(let r=0,s=n.length;r<s;r++)n[r].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let n=this.children;for(let r=0,s=n.length;r<s;r++)n[r].traverseVisible(e)}traverseAncestors(e){let n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let n=this.children;for(let r=0,s=n.length;r<s;r++)n[r].updateMatrixWorld(e)}updateWorldMatrix(e,n){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),n===!0){let s=this.children;for(let a=0,o=s.length;a<o;a++)s[a].updateWorldMatrix(!1,!0)}}toJSON(e){let n=e===void 0||typeof e=="string",r={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},r.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(l=>tc(ho({},l),{boundingBox:l.boundingBox?l.boundingBox.toJSON():void 0,boundingSphere:l.boundingSphere?l.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(l=>ho({},l)),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function a(l,c){return l[c.uuid]===void 0&&(l[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(e.geometries,this.geometry);let l=this.geometry.parameters;if(l!==void 0&&l.shapes!==void 0){let c=l.shapes;if(Array.isArray(c))for(let h=0,d=c.length;h<d;h++){let u=c[h];a(e.shapes,u)}else a(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let l=[];for(let c=0,h=this.material.length;c<h;c++)l.push(a(e.materials,this.material[c]));s.material=l}else s.material=a(e.materials,this.material);if(this.children.length>0){s.children=[];for(let l=0;l<this.children.length;l++)s.children.push(this.children[l].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let l=0;l<this.animations.length;l++){let c=this.animations[l];s.animations.push(a(e.animations,c))}}if(n){let l=o(e.geometries),c=o(e.materials),h=o(e.textures),d=o(e.images),u=o(e.shapes),p=o(e.skeletons),x=o(e.animations),_=o(e.nodes);l.length>0&&(r.geometries=l),c.length>0&&(r.materials=c),h.length>0&&(r.textures=h),d.length>0&&(r.images=d),u.length>0&&(r.shapes=u),p.length>0&&(r.skeletons=p),x.length>0&&(r.animations=x),_.length>0&&(r.nodes=_)}return r.object=s,r;function o(l){let c=[];for(let h in l){let d=l[h];delete d.metadata,c.push(d)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let r=0;r<e.children.length;r++){let s=e.children[r];this.add(s.clone())}return this}}return i.DEFAULT_UP=new L(0,1,0),i.DEFAULT_MATRIX_AUTO_UPDATE=!0,i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0,i})(),tn=new L,Sn=new L,Ro=new L,Mn=new L,Ii=new L,Pi=new L,Fc=new L,Io=new L,Po=new L,Do=new L,Lo=new me,Fo=new me,No=new me,Vn=class i{constructor(t=new L,e=new L,n=new L){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,r){r.subVectors(n,e),tn.subVectors(t,e),r.cross(tn);let s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(t,e,n,r,s){tn.subVectors(r,e),Sn.subVectors(n,e),Ro.subVectors(t,e);let a=tn.dot(tn),o=tn.dot(Sn),l=tn.dot(Ro),c=Sn.dot(Sn),h=Sn.dot(Ro),d=a*c-o*o;if(d===0)return s.set(0,0,0),null;let u=1/d,p=(c*l-o*h)*u,x=(a*h-o*l)*u;return s.set(1-p-x,x,p)}static containsPoint(t,e,n,r){return this.getBarycoord(t,e,n,r,Mn)===null?!1:Mn.x>=0&&Mn.y>=0&&Mn.x+Mn.y<=1}static getInterpolation(t,e,n,r,s,a,o,l){return this.getBarycoord(t,e,n,r,Mn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Mn.x),l.addScaledVector(a,Mn.y),l.addScaledVector(o,Mn.z),l)}static getInterpolatedAttribute(t,e,n,r,s,a){return Lo.setScalar(0),Fo.setScalar(0),No.setScalar(0),Lo.fromBufferAttribute(t,e),Fo.fromBufferAttribute(t,n),No.fromBufferAttribute(t,r),a.setScalar(0),a.addScaledVector(Lo,s.x),a.addScaledVector(Fo,s.y),a.addScaledVector(No,s.z),a}static isFrontFacing(t,e,n,r){return tn.subVectors(n,e),Sn.subVectors(t,e),tn.cross(Sn).dot(r)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,r){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[r]),this}setFromAttributeAndIndices(t,e,n,r){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,r),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return tn.subVectors(this.c,this.b),Sn.subVectors(this.a,this.b),tn.cross(Sn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,r,s){return i.getInterpolation(t,this.a,this.b,this.c,e,n,r,s)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,r=this.b,s=this.c,a,o;Ii.subVectors(r,n),Pi.subVectors(s,n),Io.subVectors(t,n);let l=Ii.dot(Io),c=Pi.dot(Io);if(l<=0&&c<=0)return e.copy(n);Po.subVectors(t,r);let h=Ii.dot(Po),d=Pi.dot(Po);if(h>=0&&d<=h)return e.copy(r);let u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(n).addScaledVector(Ii,a);Do.subVectors(t,s);let p=Ii.dot(Do),x=Pi.dot(Do);if(x>=0&&p<=x)return e.copy(s);let _=p*c-l*x;if(_<=0&&c>=0&&x<=0)return o=c/(c-x),e.copy(n).addScaledVector(Pi,o);let m=h*x-p*d;if(m<=0&&d-h>=0&&p-x>=0)return Fc.subVectors(s,r),o=(d-h)/(d-h+(p-x)),e.copy(r).addScaledVector(Fc,o);let f=1/(m+_+u);return a=_*f,o=u*f,e.copy(n).addScaledVector(Ii,a).addScaledVector(Pi,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Ah={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},kn={h:0,s:0,l:0},us={h:0,s:0,l:0};function Uo(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var Qt=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let r=t;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=He){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,te.colorSpaceToWorking(this,e),this}setRGB(t,e,n,r=te.workingColorSpace){return this.r=t,this.g=e,this.b=n,te.colorSpaceToWorking(this,r),this}setHSL(t,e,n,r=te.workingColorSpace){if(t=md(t,1),e=$t(e,0,1),n=$t(n,0,1),e===0)this.r=this.g=this.b=n;else{let s=n<=.5?n*(1+e):n+e-n*e,a=2*n-s;this.r=Uo(a,s,t+1/3),this.g=Uo(a,s,t),this.b=Uo(a,s,t-1/3)}return te.colorSpaceToWorking(this,r),this}setStyle(t,e=He){function n(s){s!==void 0&&parseFloat(s)<1&&Vt("Color: Alpha component of "+t+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(t)){let s,a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:Vt("Color: Unknown color model "+t)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(t)){let s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(s,16),e);Vt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=He){let n=Ah[t.toLowerCase()];return n!==void 0?this.setHex(n,e):Vt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=wn(t.r),this.g=wn(t.g),this.b=wn(t.b),this}copyLinearToSRGB(t){return this.r=Ni(t.r),this.g=Ni(t.g),this.b=Ni(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=He){return te.workingToColorSpace(Pe.copy(this),t),Math.round($t(Pe.r*255,0,255))*65536+Math.round($t(Pe.g*255,0,255))*256+Math.round($t(Pe.b*255,0,255))}getHexString(t=He){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=te.workingColorSpace){te.workingToColorSpace(Pe.copy(this),e);let n=Pe.r,r=Pe.g,s=Pe.b,a=Math.max(n,r,s),o=Math.min(n,r,s),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let d=a-o;switch(c=h<=.5?d/(a+o):d/(2-a-o),a){case n:l=(r-s)/d+(r<s?6:0);break;case r:l=(s-n)/d+2;break;case s:l=(n-r)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=te.workingColorSpace){return te.workingToColorSpace(Pe.copy(this),e),t.r=Pe.r,t.g=Pe.g,t.b=Pe.b,t}getStyle(t=He){te.workingToColorSpace(Pe.copy(this),t);let e=Pe.r,n=Pe.g,r=Pe.b;return t!==He?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(t,e,n){return this.getHSL(kn),this.setHSL(kn.h+t,kn.s+e,kn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(kn),t.getHSL(us);let n=_o(kn.h,us.h,e),r=_o(kn.s,us.s,e),s=_o(kn.l,us.l,e);return this.setHSL(n,r,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,r=this.b,s=t.elements;return this.r=s[0]*e+s[3]*n+s[6]*r,this.g=s[1]*e+s[4]*n+s[7]*r,this.b=s[2]*e+s[5]*n+s[8]*r,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Pe=new Qt;Qt.NAMES=Ah;var Td=0,Cn=class extends Tn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Td++}),this.uuid=er(),this.name="",this.type="Material",this.blending=oi,this.side=En,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Rs,this.blendDst=Is,this.blendEquation=Gn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Qt(0,0,0),this.blendAlpha=0,this.depthFunc=li,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Zo,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ri,this.stencilZFail=ri,this.stencilZPass=ri,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){Vt(`Material: parameter '${e}' has value of undefined.`);continue}let r=this[e];if(r===void 0){Vt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==oi&&(n.blending=this.blending),this.side!==En&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Rs&&(n.blendSrc=this.blendSrc),this.blendDst!==Is&&(n.blendDst=this.blendDst),this.blendEquation!==Gn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==li&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Zo&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ri&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ri&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ri&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){let a=[];for(let o in s){let l=s[o];delete l.metadata,a.push(l)}return a}if(e){let s=r(t.textures),a=r(t.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let r=e.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=e[s].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},di=class extends Cn{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Wn,this.combine=ol,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var ve=new L,fs=new _t,Ad=0,Ae=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Ad++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Jo,this.updateRanges=[],this.gpuType=an,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[t+r]=e.array[n+r];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)fs.fromBufferAttribute(this,e),fs.applyMatrix3(t),this.setXY(e,fs.x,fs.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)ve.fromBufferAttribute(this,e),ve.applyMatrix3(t),this.setXYZ(e,ve.x,ve.y,ve.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)ve.fromBufferAttribute(this,e),ve.applyMatrix4(t),this.setXYZ(e,ve.x,ve.y,ve.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ve.fromBufferAttribute(this,e),ve.applyNormalMatrix(t),this.setXYZ(e,ve.x,ve.y,ve.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ve.fromBufferAttribute(this,e),ve.transformDirection(t),this.setXYZ(e,ve.x,ve.y,ve.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=cr(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Oe(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=cr(e,this.array)),e}setX(t,e){return this.normalized&&(e=Oe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=cr(e,this.array)),e}setY(t,e){return this.normalized&&(e=Oe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=cr(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Oe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=cr(e,this.array)),e}setW(t,e){return this.normalized&&(e=Oe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Oe(e,this.array),n=Oe(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,r){return t*=this.itemSize,this.normalized&&(e=Oe(e,this.array),n=Oe(n,this.array),r=Oe(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this}setXYZW(t,e,n,r,s){return t*=this.itemSize,this.normalized&&(e=Oe(e,this.array),n=Oe(n,this.array),r=Oe(r,this.array),s=Oe(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Jo&&(t.usage=this.usage),t}};var wr=class extends Ae{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var Er=class extends Ae{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var ye=class extends Ae{constructor(t,e,n){super(new Float32Array(t),e,n)}},Cd=0,$e=new fe,Oo=new nn,Di=new L,Ge=new Hn,fr=new Hn,we=new L,Re=class i extends Tn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Cd++}),this.uuid=er(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(wl(t)?Er:wr)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let s=new Yt().getNormalMatrix(t);n.applyNormalMatrix(s),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(t),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return $e.makeRotationFromQuaternion(t),this.applyMatrix4($e),this}rotateX(t){return $e.makeRotationX(t),this.applyMatrix4($e),this}rotateY(t){return $e.makeRotationY(t),this.applyMatrix4($e),this}rotateZ(t){return $e.makeRotationZ(t),this.applyMatrix4($e),this}translate(t,e,n){return $e.makeTranslation(t,e,n),this.applyMatrix4($e),this}scale(t,e,n){return $e.makeScale(t,e,n),this.applyMatrix4($e),this}lookAt(t){return Oo.lookAt(t),Oo.updateMatrix(),this.applyMatrix4(Oo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Di).negate(),this.translate(Di.x,Di.y,Di.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let r=0,s=t.length;r<s;r++){let a=t[r];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ye(n,3))}else{let n=Math.min(t.length,e.count);for(let r=0;r<n;r++){let s=t[r];e.setXYZ(r,s.x,s.y,s.z||0)}t.length>e.count&&Vt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Hn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){kt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,r=e.length;n<r;n++){let s=e[n];Ge.setFromBufferAttribute(s),this.morphTargetsRelative?(we.addVectors(this.boundingBox.min,Ge.min),this.boundingBox.expandByPoint(we),we.addVectors(this.boundingBox.max,Ge.max),this.boundingBox.expandByPoint(we)):(this.boundingBox.expandByPoint(Ge.min),this.boundingBox.expandByPoint(Ge.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&kt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new hi);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){kt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(t){let n=this.boundingSphere.center;if(Ge.setFromBufferAttribute(t),e)for(let s=0,a=e.length;s<a;s++){let o=e[s];fr.setFromBufferAttribute(o),this.morphTargetsRelative?(we.addVectors(Ge.min,fr.min),Ge.expandByPoint(we),we.addVectors(Ge.max,fr.max),Ge.expandByPoint(we)):(Ge.expandByPoint(fr.min),Ge.expandByPoint(fr.max))}Ge.getCenter(n);let r=0;for(let s=0,a=t.count;s<a;s++)we.fromBufferAttribute(t,s),r=Math.max(r,n.distanceToSquared(we));if(e)for(let s=0,a=e.length;s<a;s++){let o=e[s],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)we.fromBufferAttribute(o,c),l&&(Di.fromBufferAttribute(t,c),we.add(Di)),r=Math.max(r,n.distanceToSquared(we))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&kt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){kt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,r=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ae(new Float32Array(4*n.count),4));let a=this.getAttribute("tangent"),o=[],l=[];for(let N=0;N<n.count;N++)o[N]=new L,l[N]=new L;let c=new L,h=new L,d=new L,u=new _t,p=new _t,x=new _t,_=new L,m=new L;function f(N,v,b){c.fromBufferAttribute(n,N),h.fromBufferAttribute(n,v),d.fromBufferAttribute(n,b),u.fromBufferAttribute(s,N),p.fromBufferAttribute(s,v),x.fromBufferAttribute(s,b),h.sub(c),d.sub(c),p.sub(u),x.sub(u);let I=1/(p.x*x.y-x.x*p.y);isFinite(I)&&(_.copy(h).multiplyScalar(x.y).addScaledVector(d,-p.y).multiplyScalar(I),m.copy(d).multiplyScalar(p.x).addScaledVector(h,-x.x).multiplyScalar(I),o[N].add(_),o[v].add(_),o[b].add(_),l[N].add(m),l[v].add(m),l[b].add(m))}let T=this.groups;T.length===0&&(T=[{start:0,count:t.count}]);for(let N=0,v=T.length;N<v;++N){let b=T[N],I=b.start,k=b.count;for(let O=I,Y=I+k;O<Y;O+=3)f(t.getX(O+0),t.getX(O+1),t.getX(O+2))}let w=new L,M=new L,A=new L,C=new L;function R(N){A.fromBufferAttribute(r,N),C.copy(A);let v=o[N];w.copy(v),w.sub(A.multiplyScalar(A.dot(v))).normalize(),M.crossVectors(C,v);let I=M.dot(l[N])<0?-1:1;a.setXYZW(N,w.x,w.y,w.z,I)}for(let N=0,v=T.length;N<v;++N){let b=T[N],I=b.start,k=b.count;for(let O=I,Y=I+k;O<Y;O+=3)R(t.getX(O+0)),R(t.getX(O+1)),R(t.getX(O+2))}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ae(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,p=n.count;u<p;u++)n.setXYZ(u,0,0,0);let r=new L,s=new L,a=new L,o=new L,l=new L,c=new L,h=new L,d=new L;if(t)for(let u=0,p=t.count;u<p;u+=3){let x=t.getX(u+0),_=t.getX(u+1),m=t.getX(u+2);r.fromBufferAttribute(e,x),s.fromBufferAttribute(e,_),a.fromBufferAttribute(e,m),h.subVectors(a,s),d.subVectors(r,s),h.cross(d),o.fromBufferAttribute(n,x),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(x,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let u=0,p=e.count;u<p;u+=3)r.fromBufferAttribute(e,u+0),s.fromBufferAttribute(e,u+1),a.fromBufferAttribute(e,u+2),h.subVectors(a,s),d.subVectors(r,s),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)we.fromBufferAttribute(t,e),we.normalize(),t.setXYZ(e,we.x,we.y,we.z)}toNonIndexed(){function t(o,l){let c=o.array,h=o.itemSize,d=o.normalized,u=new c.constructor(l.length*h),p=0,x=0;for(let _=0,m=l.length;_<m;_++){o.isInterleavedBufferAttribute?p=l[_]*o.data.stride+o.offset:p=l[_]*h;for(let f=0;f<h;f++)u[x++]=c[p++]}return new Ae(u,h,d)}if(this.index===null)return Vt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,r=this.attributes;for(let o in r){let l=r[o],c=t(l,n);e.setAttribute(o,c)}let s=this.morphAttributes;for(let o in s){let l=[],c=s[o];for(let h=0,d=c.length;h<d;h++){let u=c[h],p=t(u,n);l.push(p)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let r={},s=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){let p=c[d];h.push(p.toJSON(t.data))}h.length>0&&(r[l]=h,s=!0)}s&&(t.data.morphAttributes=r,t.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let r=t.attributes;for(let c in r){let h=r[c];this.setAttribute(c,h.clone(e))}let s=t.morphAttributes;for(let c in s){let h=[],d=s[c];for(let u=0,p=d.length;u<p;u++)h.push(d[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let a=t.groups;for(let c=0,h=a.length;c<h;c++){let d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Nc=new fe,ni=new Sr,ps=new hi,Uc=new L,ms=new L,gs=new L,xs=new L,Bo=new L,_s=new L,Oc=new L,vs=new L,be=class extends nn{constructor(t=new Re,e=new di){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){let o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(t,e){let n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(r,t);let o=this.morphTargetInfluences;if(s&&o){_s.set(0,0,0);for(let l=0,c=s.length;l<c;l++){let h=o[l],d=s[l];h!==0&&(Bo.fromBufferAttribute(d,t),a?_s.addScaledVector(Bo,h):_s.addScaledVector(Bo.sub(e),h))}e.add(_s)}return e}raycast(t,e){let n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ps.copy(n.boundingSphere),ps.applyMatrix4(s),ni.copy(t.ray).recast(t.near),!(ps.containsPoint(ni.origin)===!1&&(ni.intersectSphere(ps,Uc)===null||ni.origin.distanceToSquared(Uc)>(t.far-t.near)**2))&&(Nc.copy(s).invert(),ni.copy(t.ray).applyMatrix4(Nc),!(n.boundingBox!==null&&ni.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,ni)))}_computeIntersections(t,e,n){let r,s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,d=s.attributes.normal,u=s.groups,p=s.drawRange;if(o!==null)if(Array.isArray(a))for(let x=0,_=u.length;x<_;x++){let m=u[x],f=a[m.materialIndex],T=Math.max(m.start,p.start),w=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let M=T,A=w;M<A;M+=3){let C=o.getX(M),R=o.getX(M+1),N=o.getX(M+2);r=ys(this,f,t,n,c,h,d,C,R,N),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=m.materialIndex,e.push(r))}}else{let x=Math.max(0,p.start),_=Math.min(o.count,p.start+p.count);for(let m=x,f=_;m<f;m+=3){let T=o.getX(m),w=o.getX(m+1),M=o.getX(m+2);r=ys(this,a,t,n,c,h,d,T,w,M),r&&(r.faceIndex=Math.floor(m/3),e.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let x=0,_=u.length;x<_;x++){let m=u[x],f=a[m.materialIndex],T=Math.max(m.start,p.start),w=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let M=T,A=w;M<A;M+=3){let C=M,R=M+1,N=M+2;r=ys(this,f,t,n,c,h,d,C,R,N),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=m.materialIndex,e.push(r))}}else{let x=Math.max(0,p.start),_=Math.min(l.count,p.start+p.count);for(let m=x,f=_;m<f;m+=3){let T=m,w=m+1,M=m+2;r=ys(this,a,t,n,c,h,d,T,w,M),r&&(r.faceIndex=Math.floor(m/3),e.push(r))}}}};function Rd(i,t,e,n,r,s,a,o){let l;if(t.side===Fe?l=n.intersectTriangle(a,s,r,!0,o):l=n.intersectTriangle(r,s,a,t.side===En,o),l===null)return null;vs.copy(o),vs.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(vs);return c<e.near||c>e.far?null:{distance:c,point:vs.clone(),object:i}}function ys(i,t,e,n,r,s,a,o,l,c){i.getVertexPosition(o,ms),i.getVertexPosition(l,gs),i.getVertexPosition(c,xs);let h=Rd(i,t,e,n,ms,gs,xs,Oc);if(h){let d=new L;Vn.getBarycoord(Oc,ms,gs,xs,d),r&&(h.uv=Vn.getInterpolatedAttribute(r,o,l,c,d,new _t)),s&&(h.uv1=Vn.getInterpolatedAttribute(s,o,l,c,d,new _t)),a&&(h.normal=Vn.getInterpolatedAttribute(a,o,l,c,d,new L),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let u={a:o,b:l,c,normal:new L,materialIndex:0};Vn.getNormal(ms,gs,xs,u.normal),h.face=u,h.barycoord=d}return h}var ki=class i extends Re{constructor(t=1,e=1,n=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:r,heightSegments:s,depthSegments:a};let o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);let l=[],c=[],h=[],d=[],u=0,p=0;x("z","y","x",-1,-1,n,e,t,a,s,0),x("z","y","x",1,-1,n,e,-t,a,s,1),x("x","z","y",1,1,t,n,e,r,a,2),x("x","z","y",1,-1,t,n,-e,r,a,3),x("x","y","z",1,-1,t,e,n,r,s,4),x("x","y","z",-1,-1,t,e,-n,r,s,5),this.setIndex(l),this.setAttribute("position",new ye(c,3)),this.setAttribute("normal",new ye(h,3)),this.setAttribute("uv",new ye(d,2));function x(_,m,f,T,w,M,A,C,R,N,v){let b=M/R,I=A/N,k=M/2,O=A/2,Y=C/2,G=R+1,H=N+1,B=0,tt=0,mt=new L;for(let ct=0;ct<H;ct++){let ut=ct*I-O;for(let Wt=0;Wt<G;Wt++){let Gt=Wt*b-k;mt[_]=Gt*T,mt[m]=ut*w,mt[f]=Y,c.push(mt.x,mt.y,mt.z),mt[_]=0,mt[m]=0,mt[f]=C>0?1:-1,h.push(mt.x,mt.y,mt.z),d.push(Wt/R),d.push(1-ct/N),B+=1}}for(let ct=0;ct<N;ct++)for(let ut=0;ut<R;ut++){let Wt=u+ut+G*ct,Gt=u+ut+G*(ct+1),se=u+(ut+1)+G*(ct+1),ae=u+(ut+1)+G*ct;l.push(Wt,Gt,ae),l.push(Gt,se,ae),tt+=6}o.addGroup(p,tt,v),p+=tt,u+=B}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function _i(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let r=i[e][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(Vt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=r.clone():Array.isArray(r)?t[e][n]=r.slice():t[e][n]=r}}return t}function De(i){let t={};for(let e=0;e<i.length;e++){let n=_i(i[e]);for(let r in n)t[r]=n[r]}return t}function Id(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Tl(i){let t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:te.workingColorSpace}var Ch={clone:_i,merge:De},Pd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Dd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Xe=class extends Cn{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Pd,this.fragmentShader=Dd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=_i(t.uniforms),this.uniformsGroups=Id(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let r in this.uniforms){let a=this.uniforms[r].value;a&&a.isTexture?e.uniforms[r]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[r]={type:"m4",value:a.toArray()}:e.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},Tr=class extends nn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new fe,this.projectionMatrix=new fe,this.projectionMatrixInverse=new fe,this.coordinateSystem=en,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},zn=new L,Bc=new _t,kc=new _t,Ee=class extends Tr{constructor(t=50,e=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=Fs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(xo*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Fs*2*Math.atan(Math.tan(xo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){zn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(zn.x,zn.y).multiplyScalar(-t/zn.z),zn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(zn.x,zn.y).multiplyScalar(-t/zn.z)}getViewSize(t,e){return this.getViewBounds(t,Bc,kc),e.subVectors(kc,Bc)}setViewOffset(t,e,n,r,s,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(xo*.5*this.fov)/this.zoom,n=2*e,r=this.aspect*n,s=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*r/l,e-=a.offsetY*n/c,r*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(s+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},Li=-90,Fi=1,Bs=class extends nn{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new Ee(Li,Fi,t,e);r.layers=this.layers,this.add(r);let s=new Ee(Li,Fi,t,e);s.layers=this.layers,this.add(s);let a=new Ee(Li,Fi,t,e);a.layers=this.layers,this.add(a);let o=new Ee(Li,Fi,t,e);o.layers=this.layers,this.add(o);let l=new Ee(Li,Fi,t,e);l.layers=this.layers,this.add(l);let c=new Ee(Li,Fi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,r,s,a,o,l]=e;for(let c of e)this.remove(c);if(t===en)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===vr)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[s,a,o,l,c,h]=this.children,d=t.getRenderTarget(),u=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),x=t.xr.enabled;t.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,r),t.render(e,s),t.setRenderTarget(n,1,r),t.render(e,a),t.setRenderTarget(n,2,r),t.render(e,o),t.setRenderTarget(n,3,r),t.render(e,l),t.setRenderTarget(n,4,r),t.render(e,c),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,r),t.render(e,h),t.setRenderTarget(d,u,p),t.xr.enabled=x,n.texture.needsPMREMUpdate=!0}},Ar=class extends Pn{constructor(t=[],e=Zn,n,r,s,a,o,l,c,h){super(t,e,n,r,s,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},Cr=class extends We{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},r=[n,n,n,n,n,n];this.texture=new Ar(r),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new ki(5,5,5),s=new Xe({name:"CubemapFromEquirect",uniforms:_i(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Fe,blending:pn});s.uniforms.tEquirect.value=e;let a=new be(r,s),o=e.minFilter;return e.minFilter===Jn&&(e.minFilter=Ce),new Bs(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,r=!0){let s=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,r);t.setRenderTarget(s)}},si=class extends nn{constructor(){super(),this.isGroup=!0,this.type="Group"}},Ld={type:"move"},zi=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new si,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new si,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new si,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let r=null,s=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(let _ of t.hand.values()){let m=e.getJointPose(_,n),f=this._getHandJoint(c,_);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}let h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),p=.02,x=.005;c.inputState.pinching&&u>p+x?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=p-x&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(r=e.getPose(t.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Ld)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new si;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}};var Vi=class extends nn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Wn,this.environmentIntensity=1,this.environmentRotation=new Wn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}};var ks=class extends Pn{constructor(t=null,e=1,n=1,r,s,a,o,l,c=Te,h=Te,d,u){super(null,a,o,l,c,h,r,s,d,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var ko=new L,Fd=new L,Nd=new Yt,hn=class{constructor(t=new L(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,r){return this.normal.set(t,e,n),this.constant=r,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let r=ko.subVectors(n,e).cross(Fd.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(r,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(ko),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let s=-(t.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:e.copy(t.start).addScaledVector(n,s)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||Nd.getNormalMatrix(t),r=this.coplanarPoint(ko).applyMatrix4(t),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},ii=new hi,Ud=new _t(.5,.5),bs=new L,Gi=class{constructor(t=new hn,e=new hn,n=new hn,r=new hn,s=new hn,a=new hn){this.planes=[t,e,n,r,s,a]}set(t,e,n,r,s,a){let o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=en,n=!1){let r=this.planes,s=t.elements,a=s[0],o=s[1],l=s[2],c=s[3],h=s[4],d=s[5],u=s[6],p=s[7],x=s[8],_=s[9],m=s[10],f=s[11],T=s[12],w=s[13],M=s[14],A=s[15];if(r[0].setComponents(c-a,p-h,f-x,A-T).normalize(),r[1].setComponents(c+a,p+h,f+x,A+T).normalize(),r[2].setComponents(c+o,p+d,f+_,A+w).normalize(),r[3].setComponents(c-o,p-d,f-_,A-w).normalize(),n)r[4].setComponents(l,u,m,M).normalize(),r[5].setComponents(c-l,p-u,f-m,A-M).normalize();else if(r[4].setComponents(c-l,p-u,f-m,A-M).normalize(),e===en)r[5].setComponents(c+l,p+u,f+m,A+M).normalize();else if(e===vr)r[5].setComponents(l,u,m,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ii.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ii.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ii)}intersectsSprite(t){ii.center.set(0,0,0);let e=Ud.distanceTo(t.center);return ii.radius=.7071067811865476+e,ii.applyMatrix4(t.matrixWorld),this.intersectsSphere(ii)}intersectsSphere(t){let e=this.planes,n=t.center,r=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let r=e[n];if(bs.x=r.normal.x>0?t.max.x:t.min.x,bs.y=r.normal.y>0?t.max.y:t.min.y,bs.z=r.normal.z>0?t.max.z:t.min.z,r.distanceToPoint(bs)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var ui=class extends Cn{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Qt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},zc=new fe,$o=new Sr,Ss=new hi,Ms=new L,Hi=class extends nn{constructor(t=new Re,e=new ui){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){let n=this.geometry,r=this.matrixWorld,s=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ss.copy(n.boundingSphere),Ss.applyMatrix4(r),Ss.radius+=s,t.ray.intersectsSphere(Ss)===!1)return;zc.copy(r).invert(),$o.copy(t.ray).applyMatrix4(zc);let o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,d=n.attributes.position;if(c!==null){let u=Math.max(0,a.start),p=Math.min(c.count,a.start+a.count);for(let x=u,_=p;x<_;x++){let m=c.getX(x);Ms.fromBufferAttribute(d,m),Vc(Ms,m,l,r,t,e,this)}}else{let u=Math.max(0,a.start),p=Math.min(d.count,a.start+a.count);for(let x=u,_=p;x<_;x++)Ms.fromBufferAttribute(d,x),Vc(Ms,x,l,r,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){let o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}};function Vc(i,t,e,n,r,s,a){let o=$o.distanceSqToPoint(i);if(o<e){let l=new L;$o.closestPointToPoint(i,l),l.applyMatrix4(n);let c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}var Xn=class extends Pn{constructor(t,e,n=sn,r,s,a,o=Te,l=Te,c,h=un,d=1){if(h!==un&&h!==$n)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:t,height:e,depth:d};super(u,r,s,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Bi(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},zs=class extends Xn{constructor(t,e=sn,n=Zn,r,s,a=Te,o=Te,l,c=un){let h={width:t,height:t,depth:1},d=[h,h,h,h,h,h];super(t,t,e,n,r,s,a,o,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},Rr=class extends Pn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}};var fi=class i extends Re{constructor(t=1,e=1,n=1,r=32,s=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:r,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:l};let c=this;r=Math.floor(r),s=Math.floor(s);let h=[],d=[],u=[],p=[],x=0,_=[],m=n/2,f=0;T(),a===!1&&(t>0&&w(!0),e>0&&w(!1)),this.setIndex(h),this.setAttribute("position",new ye(d,3)),this.setAttribute("normal",new ye(u,3)),this.setAttribute("uv",new ye(p,2));function T(){let M=new L,A=new L,C=0,R=(e-t)/n;for(let N=0;N<=s;N++){let v=[],b=N/s,I=b*(e-t)+t;for(let k=0;k<=r;k++){let O=k/r,Y=O*l+o,G=Math.sin(Y),H=Math.cos(Y);A.x=I*G,A.y=-b*n+m,A.z=I*H,d.push(A.x,A.y,A.z),M.set(G,R,H).normalize(),u.push(M.x,M.y,M.z),p.push(O,1-b),v.push(x++)}_.push(v)}for(let N=0;N<r;N++)for(let v=0;v<s;v++){let b=_[v][N],I=_[v+1][N],k=_[v+1][N+1],O=_[v][N+1];(t>0||v!==0)&&(h.push(b,I,O),C+=3),(e>0||v!==s-1)&&(h.push(I,k,O),C+=3)}c.addGroup(f,C,0),f+=C}function w(M){let A=x,C=new _t,R=new L,N=0,v=M===!0?t:e,b=M===!0?1:-1;for(let k=1;k<=r;k++)d.push(0,m*b,0),u.push(0,b,0),p.push(.5,.5),x++;let I=x;for(let k=0;k<=r;k++){let Y=k/r*l+o,G=Math.cos(Y),H=Math.sin(Y);R.x=v*H,R.y=m*b,R.z=v*G,d.push(R.x,R.y,R.z),u.push(0,b,0),C.x=G*.5+.5,C.y=H*.5*b+.5,p.push(C.x,C.y),x++}for(let k=0;k<r;k++){let O=A+k,Y=I+k;M===!0?h.push(Y,Y+1,O):h.push(Y+1,Y,O),N+=3}c.addGroup(f,N,M===!0?1:2),f+=N}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Ir=class i extends fi{constructor(t=1,e=1,n=32,r=1,s=!1,a=0,o=Math.PI*2){super(0,t,e,n,r,s,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:r,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(t){return new i(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}};var Ye=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Vt("Curve: .getPoint() not implemented.")}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,r=this.getPoint(0),s=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),s+=n.distanceTo(r),e.push(s),r=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){let n=this.getLengths(),r=0,s=n.length,a;e?a=e:a=t*n[s-1];let o=0,l=s-1,c;for(;o<=l;)if(r=Math.floor(o+(l-o)/2),c=n[r]-a,c<0)o=r+1;else if(c>0)l=r-1;else{l=r;break}if(r=l,n[r]===a)return r/(s-1);let h=n[r],u=n[r+1]-h,p=(a-h)/u;return(r+p)/(s-1)}getTangent(t,e){let r=t-1e-4,s=t+1e-4;r<0&&(r=0),s>1&&(s=1);let a=this.getPoint(r),o=this.getPoint(s),l=e||(a.isVector2?new _t:new L);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){let n=new L,r=[],s=[],a=[],o=new L,l=new fe;for(let p=0;p<=t;p++){let x=p/t;r[p]=this.getTangentAt(x,new L)}s[0]=new L,a[0]=new L;let c=Number.MAX_VALUE,h=Math.abs(r[0].x),d=Math.abs(r[0].y),u=Math.abs(r[0].z);h<=c&&(c=h,n.set(1,0,0)),d<=c&&(c=d,n.set(0,1,0)),u<=c&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),s[0].crossVectors(r[0],o),a[0].crossVectors(r[0],s[0]);for(let p=1;p<=t;p++){if(s[p]=s[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(r[p-1],r[p]),o.length()>Number.EPSILON){o.normalize();let x=Math.acos($t(r[p-1].dot(r[p]),-1,1));s[p].applyMatrix4(l.makeRotationAxis(o,x))}a[p].crossVectors(r[p],s[p])}if(e===!0){let p=Math.acos($t(s[0].dot(s[t]),-1,1));p/=t,r[0].dot(o.crossVectors(s[0],s[t]))>0&&(p=-p);for(let x=1;x<=t;x++)s[x].applyMatrix4(l.makeRotationAxis(r[x],p*x)),a[x].crossVectors(r[x],s[x])}return{tangents:r,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},Wi=class extends Ye{constructor(t=0,e=0,n=1,r=1,s=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new _t){let n=e,r=Math.PI*2,s=this.aEndAngle-this.aStartAngle,a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(a?s=0:s=r),this.aClockwise===!0&&!a&&(s===r?s=-r:s=s-r);let o=this.aStartAngle+t*s,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=l-this.aX,p=c-this.aY;l=u*h-p*d+this.aX,c=u*d+p*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},Vs=class extends Wi{constructor(t,e,n,r,s,a){super(t,e,n,n,r,s,a),this.isArcCurve=!0,this.type="ArcCurve"}};function Al(){let i=0,t=0,e=0,n=0;function r(s,a,o,l){i=s,t=o,e=-3*s+3*a-2*o-l,n=2*s-2*a+o+l}return{initCatmullRom:function(s,a,o,l,c){r(a,o,c*(o-s),c*(l-a))},initNonuniformCatmullRom:function(s,a,o,l,c,h,d){let u=(a-s)/c-(o-s)/(c+h)+(o-a)/h,p=(o-a)/h-(l-a)/(h+d)+(l-o)/d;u*=h,p*=h,r(a,o,u,p)},calc:function(s){let a=s*s,o=a*s;return i+t*s+e*a+n*o}}}var ws=new L,zo=new Al,Vo=new Al,Go=new Al,Gs=class extends Ye{constructor(t=[],e=!1,n="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=r}getPoint(t,e=new L){let n=e,r=this.points,s=r.length,a=(s-(this.closed?0:1))*t,o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/s)+1)*s:l===0&&o===s-1&&(o=s-2,l=1);let c,h;this.closed||o>0?c=r[(o-1)%s]:(ws.subVectors(r[0],r[1]).add(r[0]),c=ws);let d=r[o%s],u=r[(o+1)%s];if(this.closed||o+2<s?h=r[(o+2)%s]:(ws.subVectors(r[s-1],r[s-2]).add(r[s-1]),h=ws),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,x=Math.pow(c.distanceToSquared(d),p),_=Math.pow(d.distanceToSquared(u),p),m=Math.pow(u.distanceToSquared(h),p);_<1e-4&&(_=1),x<1e-4&&(x=_),m<1e-4&&(m=_),zo.initNonuniformCatmullRom(c.x,d.x,u.x,h.x,x,_,m),Vo.initNonuniformCatmullRom(c.y,d.y,u.y,h.y,x,_,m),Go.initNonuniformCatmullRom(c.z,d.z,u.z,h.z,x,_,m)}else this.curveType==="catmullrom"&&(zo.initCatmullRom(c.x,d.x,u.x,h.x,this.tension),Vo.initCatmullRom(c.y,d.y,u.y,h.y,this.tension),Go.initCatmullRom(c.z,d.z,u.z,h.z,this.tension));return n.set(zo.calc(l),Vo.calc(l),Go.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let r=t.points[e];this.points.push(r.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let r=this.points[e];t.points.push(r.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let r=t.points[e];this.points.push(new L().fromArray(r))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function Gc(i,t,e,n,r){let s=(n-t)*.5,a=(r-e)*.5,o=i*i,l=i*o;return(2*e-2*n+s+a)*l+(-3*e+3*n-2*s-a)*o+s*i+e}function Od(i,t){let e=1-i;return e*e*t}function Bd(i,t){return 2*(1-i)*i*t}function kd(i,t){return i*i*t}function mr(i,t,e,n){return Od(i,t)+Bd(i,e)+kd(i,n)}function zd(i,t){let e=1-i;return e*e*e*t}function Vd(i,t){let e=1-i;return 3*e*e*i*t}function Gd(i,t){return 3*(1-i)*i*i*t}function Hd(i,t){return i*i*i*t}function gr(i,t,e,n,r){return zd(i,t)+Vd(i,e)+Gd(i,n)+Hd(i,r)}var Pr=class extends Ye{constructor(t=new _t,e=new _t,n=new _t,r=new _t){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=r}getPoint(t,e=new _t){let n=e,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(gr(t,r.x,s.x,a.x,o.x),gr(t,r.y,s.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Hs=class extends Ye{constructor(t=new L,e=new L,n=new L,r=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=r}getPoint(t,e=new L){let n=e,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(gr(t,r.x,s.x,a.x,o.x),gr(t,r.y,s.y,a.y,o.y),gr(t,r.z,s.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Dr=class extends Ye{constructor(t=new _t,e=new _t){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new _t){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new _t){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Ws=class extends Ye{constructor(t=new L,e=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new L){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new L){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Lr=class extends Ye{constructor(t=new _t,e=new _t,n=new _t){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new _t){let n=e,r=this.v0,s=this.v1,a=this.v2;return n.set(mr(t,r.x,s.x,a.x),mr(t,r.y,s.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Xs=class extends Ye{constructor(t=new L,e=new L,n=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new L){let n=e,r=this.v0,s=this.v1,a=this.v2;return n.set(mr(t,r.x,s.x,a.x),mr(t,r.y,s.y,a.y),mr(t,r.z,s.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Fr=class extends Ye{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new _t){let n=e,r=this.points,s=(r.length-1)*t,a=Math.floor(s),o=s-a,l=r[a===0?a:a-1],c=r[a],h=r[a>r.length-2?r.length-1:a+1],d=r[a>r.length-3?r.length-1:a+2];return n.set(Gc(o,l.x,c.x,h.x,d.x),Gc(o,l.y,c.y,h.y,d.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let r=t.points[e];this.points.push(r.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let r=this.points[e];t.points.push(r.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let r=t.points[e];this.points.push(new _t().fromArray(r))}return this}},Ko=Object.freeze({__proto__:null,ArcCurve:Vs,CatmullRomCurve3:Gs,CubicBezierCurve:Pr,CubicBezierCurve3:Hs,EllipseCurve:Wi,LineCurve:Dr,LineCurve3:Ws,QuadraticBezierCurve:Lr,QuadraticBezierCurve3:Xs,SplineCurve:Fr}),Ys=class extends Ye{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ko[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),r=this.getCurveLengths(),s=0;for(;s<r.length;){if(r[s]>=n){let a=r[s]-n,o=this.curves[s],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,e)}s++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,r=this.curves.length;n<r;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let r=0,s=this.curves;r<s.length;r++){let a=s[r],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let r=t.curves[e];this.curves.push(r.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let r=this.curves[e];t.curves.push(r.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let r=t.curves[e];this.curves.push(new Ko[r.type]().fromJSON(r))}return this}},Nr=class extends Ys{constructor(t){super(),this.type="Path",this.currentPoint=new _t,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new Dr(this.currentPoint.clone(),new _t(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,r){let s=new Lr(this.currentPoint.clone(),new _t(t,e),new _t(n,r));return this.curves.push(s),this.currentPoint.set(n,r),this}bezierCurveTo(t,e,n,r,s,a){let o=new Pr(this.currentPoint.clone(),new _t(t,e),new _t(n,r),new _t(s,a));return this.curves.push(o),this.currentPoint.set(s,a),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new Fr(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,r,s,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,n,r,s,a),this}absarc(t,e,n,r,s,a){return this.absellipse(t,e,n,n,r,s,a),this}ellipse(t,e,n,r,s,a,o,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,r,s,a,o,l),this}absellipse(t,e,n,r,s,a,o,l){let c=new Wi(t,e,n,r,s,a,o,l);if(this.curves.length>0){let d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}},Xi=class extends Nr{constructor(t){super(t),this.uuid=er(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,r=this.holes.length;n<r;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let r=t.holes[e];this.holes.push(r.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let r=this.holes[e];t.holes.push(r.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let r=t.holes[e];this.holes.push(new Nr().fromJSON(r))}return this}};function Wd(i,t,e=2){let n=t&&t.length,r=n?t[0]*e:i.length,s=Rh(i,0,r,e,!0),a=[];if(!s||s.next===s.prev)return a;let o,l,c;if(n&&(s=Jd(i,t,s,e)),i.length>80*e){o=i[0],l=i[1];let h=o,d=l;for(let u=e;u<r;u+=e){let p=i[u],x=i[u+1];p<o&&(o=p),x<l&&(l=x),p>h&&(h=p),x>d&&(d=x)}c=Math.max(h-o,d-l),c=c!==0?32767/c:0}return Ur(s,a,e,o,l,c,0),a}function Rh(i,t,e,n,r){let s;if(r===au(i,t,e,n)>0)for(let a=t;a<e;a+=n)s=Hc(a/n|0,i[a],i[a+1],s);else for(let a=e-n;a>=t;a-=n)s=Hc(a/n|0,i[a],i[a+1],s);return s&&Yi(s,s.next)&&(Br(s),s=s.next),s}function pi(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(Yi(e,e.next)||pe(e.prev,e,e.next)===0)){if(Br(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Ur(i,t,e,n,r,s,a){if(!i)return;!a&&s&&tu(i,n,r,s);let o=i;for(;i.prev!==i.next;){let l=i.prev,c=i.next;if(s?Yd(i,n,r,s):Xd(i)){t.push(l.i,i.i,c.i),Br(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=qd(pi(i),t),Ur(i,t,e,n,r,s,2)):a===2&&Zd(i,t,e,n,r,s):Ur(pi(i),t,e,n,r,s,1);break}}}function Xd(i){let t=i.prev,e=i,n=i.next;if(pe(t,e,n)>=0)return!1;let r=t.x,s=e.x,a=n.x,o=t.y,l=e.y,c=n.y,h=Math.min(r,s,a),d=Math.min(o,l,c),u=Math.max(r,s,a),p=Math.max(o,l,c),x=n.next;for(;x!==t;){if(x.x>=h&&x.x<=u&&x.y>=d&&x.y<=p&&pr(r,o,s,l,a,c,x.x,x.y)&&pe(x.prev,x,x.next)>=0)return!1;x=x.next}return!0}function Yd(i,t,e,n){let r=i.prev,s=i,a=i.next;if(pe(r,s,a)>=0)return!1;let o=r.x,l=s.x,c=a.x,h=r.y,d=s.y,u=a.y,p=Math.min(o,l,c),x=Math.min(h,d,u),_=Math.max(o,l,c),m=Math.max(h,d,u),f=Qo(p,x,t,e,n),T=Qo(_,m,t,e,n),w=i.prevZ,M=i.nextZ;for(;w&&w.z>=f&&M&&M.z<=T;){if(w.x>=p&&w.x<=_&&w.y>=x&&w.y<=m&&w!==r&&w!==a&&pr(o,h,l,d,c,u,w.x,w.y)&&pe(w.prev,w,w.next)>=0||(w=w.prevZ,M.x>=p&&M.x<=_&&M.y>=x&&M.y<=m&&M!==r&&M!==a&&pr(o,h,l,d,c,u,M.x,M.y)&&pe(M.prev,M,M.next)>=0))return!1;M=M.nextZ}for(;w&&w.z>=f;){if(w.x>=p&&w.x<=_&&w.y>=x&&w.y<=m&&w!==r&&w!==a&&pr(o,h,l,d,c,u,w.x,w.y)&&pe(w.prev,w,w.next)>=0)return!1;w=w.prevZ}for(;M&&M.z<=T;){if(M.x>=p&&M.x<=_&&M.y>=x&&M.y<=m&&M!==r&&M!==a&&pr(o,h,l,d,c,u,M.x,M.y)&&pe(M.prev,M,M.next)>=0)return!1;M=M.nextZ}return!0}function qd(i,t){let e=i;do{let n=e.prev,r=e.next.next;!Yi(n,r)&&Ph(n,e,e.next,r)&&Or(n,r)&&Or(r,n)&&(t.push(n.i,e.i,r.i),Br(e),Br(e.next),e=i=r),e=e.next}while(e!==i);return pi(e)}function Zd(i,t,e,n,r,s){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&iu(a,o)){let l=Dh(a,o);a=pi(a,a.next),l=pi(l,l.next),Ur(a,t,e,n,r,s,0),Ur(l,t,e,n,r,s,0);return}o=o.next}a=a.next}while(a!==i)}function Jd(i,t,e,n){let r=[];for(let s=0,a=t.length;s<a;s++){let o=t[s]*n,l=s<a-1?t[s+1]*n:i.length,c=Rh(i,o,l,n,!1);c===c.next&&(c.steiner=!0),r.push(nu(c))}r.sort($d);for(let s=0;s<r.length;s++)e=Kd(r[s],e);return e}function $d(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),r=(t.next.y-t.y)/(t.next.x-t.x);e=n-r}return e}function Kd(i,t){let e=Qd(i,t);if(!e)return t;let n=Dh(e,i);return pi(n,n.next),pi(e,e.next)}function Qd(i,t){let e=t,n=i.x,r=i.y,s=-1/0,a;if(Yi(i,e))return e;do{if(Yi(i,e.next))return e.next;if(r<=e.y&&r>=e.next.y&&e.next.y!==e.y){let d=e.x+(r-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=n&&d>s&&(s=d,a=e.x<e.next.x?e:e.next,d===n))return a}e=e.next}while(e!==t);if(!a)return null;let o=a,l=a.x,c=a.y,h=1/0;e=a;do{if(n>=e.x&&e.x>=l&&n!==e.x&&Ih(r<c?n:s,r,l,c,r<c?s:n,r,e.x,e.y)){let d=Math.abs(r-e.y)/(n-e.x);Or(e,i)&&(d<h||d===h&&(e.x>a.x||e.x===a.x&&jd(a,e)))&&(a=e,h=d)}e=e.next}while(e!==o);return a}function jd(i,t){return pe(i.prev,i,t.prev)<0&&pe(t.next,i,i.next)<0}function tu(i,t,e,n){let r=i;do r.z===0&&(r.z=Qo(r.x,r.y,t,e,n)),r.prevZ=r.prev,r.nextZ=r.next,r=r.next;while(r!==i);r.prevZ.nextZ=null,r.prevZ=null,eu(r)}function eu(i){let t,e=1;do{let n=i,r;i=null;let s=null;for(t=0;n;){t++;let a=n,o=0;for(let c=0;c<e&&(o++,a=a.nextZ,!!a);c++);let l=e;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(r=n,n=n.nextZ,o--):(r=a,a=a.nextZ,l--),s?s.nextZ=r:i=r,r.prevZ=s,s=r;n=a}s.nextZ=null,e*=2}while(t>1);return i}function Qo(i,t,e,n,r){return i=(i-e)*r|0,t=(t-n)*r|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function nu(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Ih(i,t,e,n,r,s,a,o){return(r-a)*(t-o)>=(i-a)*(s-o)&&(i-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(s-o)>=(r-a)*(n-o)}function pr(i,t,e,n,r,s,a,o){return!(i===a&&t===o)&&Ih(i,t,e,n,r,s,a,o)}function iu(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!ru(i,t)&&(Or(i,t)&&Or(t,i)&&su(i,t)&&(pe(i.prev,i,t.prev)||pe(i,t.prev,t))||Yi(i,t)&&pe(i.prev,i,i.next)>0&&pe(t.prev,t,t.next)>0)}function pe(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function Yi(i,t){return i.x===t.x&&i.y===t.y}function Ph(i,t,e,n){let r=Ts(pe(i,t,e)),s=Ts(pe(i,t,n)),a=Ts(pe(e,n,i)),o=Ts(pe(e,n,t));return!!(r!==s&&a!==o||r===0&&Es(i,e,t)||s===0&&Es(i,n,t)||a===0&&Es(e,i,n)||o===0&&Es(e,t,n))}function Es(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Ts(i){return i>0?1:i<0?-1:0}function ru(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Ph(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Or(i,t){return pe(i.prev,i,i.next)<0?pe(i,t,i.next)>=0&&pe(i,i.prev,t)>=0:pe(i,t,i.prev)<0||pe(i,i.next,t)<0}function su(i,t){let e=i,n=!1,r=(i.x+t.x)/2,s=(i.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&r<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Dh(i,t){let e=jo(i.i,i.x,i.y),n=jo(t.i,t.x,t.y),r=i.next,s=t.prev;return i.next=t,t.prev=i,e.next=r,r.prev=e,n.next=e,e.prev=n,s.next=n,n.prev=s,n}function Hc(i,t,e,n){let r=jo(i,t,e);return n?(r.next=n.next,r.prev=n,n.next.prev=r,n.next=r):(r.prev=r,r.next=r),r}function Br(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function jo(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function au(i,t,e,n){let r=0;for(let s=t,a=e-n;s<e;s+=n)r+=(i[a]-i[s])*(i[s+1]+i[a+1]),a=s;return r}var tl=class{static triangulate(t,e,n=2){return Wd(t,e,n)}},ai=class i{static area(t){let e=t.length,n=0;for(let r=e-1,s=0;s<e;r=s++)n+=t[r].x*t[s].y-t[s].x*t[r].y;return n*.5}static isClockWise(t){return i.area(t)<0}static triangulateShape(t,e){let n=[],r=[],s=[];Wc(t),Xc(n,t);let a=t.length;e.forEach(Wc);for(let l=0;l<e.length;l++)r.push(a),a+=e[l].length,Xc(n,e[l]);let o=tl.triangulate(n,r);for(let l=0;l<o.length;l+=3)s.push(o.slice(l,l+3));return s}};function Wc(i){let t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Xc(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}var kr=class i extends Re{constructor(t=new Xi([new _t(.5,.5),new _t(-.5,.5),new _t(-.5,-.5),new _t(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let n=this,r=[],s=[];for(let o=0,l=t.length;o<l;o++){let c=t[o];a(c)}this.setAttribute("position",new ye(r,3)),this.setAttribute("uv",new ye(s,2)),this.computeVertexNormals();function a(o){let l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,d=e.depth!==void 0?e.depth:1,u=e.bevelEnabled!==void 0?e.bevelEnabled:!0,p=e.bevelThickness!==void 0?e.bevelThickness:.2,x=e.bevelSize!==void 0?e.bevelSize:p-.1,_=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3,f=e.extrudePath,T=e.UVGenerator!==void 0?e.UVGenerator:ou,w,M=!1,A,C,R,N;if(f){w=f.getSpacedPoints(h),M=!0,u=!1;let Q=f.isCatmullRomCurve3?f.closed:!1;A=f.computeFrenetFrames(h,Q),C=new L,R=new L,N=new L}u||(m=0,p=0,x=0,_=0);let v=o.extractPoints(c),b=v.shape,I=v.holes;if(!ai.isClockWise(b)){b=b.reverse();for(let Q=0,it=I.length;Q<it;Q++){let j=I[Q];ai.isClockWise(j)&&(I[Q]=j.reverse())}}function O(Q){let j=10000000000000001e-36,xt=Q[0];for(let E=1;E<=Q.length;E++){let Lt=E%Q.length,bt=Q[Lt],Ot=bt.x-xt.x,ot=bt.y-xt.y,S=Ot*Ot+ot*ot,g=Math.max(Math.abs(bt.x),Math.abs(bt.y),Math.abs(xt.x),Math.abs(xt.y)),D=j*g*g;if(S<=D){Q.splice(Lt,1),E--;continue}xt=bt}}O(b),I.forEach(O);let Y=I.length,G=b;for(let Q=0;Q<Y;Q++){let it=I[Q];b=b.concat(it)}function H(Q,it,j){return it||kt("ExtrudeGeometry: vec does not exist"),Q.clone().addScaledVector(it,j)}let B=b.length;function tt(Q,it,j){let xt,E,Lt,bt=Q.x-it.x,Ot=Q.y-it.y,ot=j.x-Q.x,S=j.y-Q.y,g=bt*bt+Ot*Ot,D=bt*S-Ot*ot;if(Math.abs(D)>Number.EPSILON){let W=Math.sqrt(g),$=Math.sqrt(ot*ot+S*S),X=it.x-Ot/W,Rt=it.y+bt/W,lt=j.x-S/$,At=j.y+ot/$,Bt=((lt-X)*S-(At-Rt)*ot)/(bt*S-Ot*ot);xt=X+bt*Bt-Q.x,E=Rt+Ot*Bt-Q.y;let nt=xt*xt+E*E;if(nt<=2)return new _t(xt,E);Lt=Math.sqrt(nt/2)}else{let W=!1;bt>Number.EPSILON?ot>Number.EPSILON&&(W=!0):bt<-Number.EPSILON?ot<-Number.EPSILON&&(W=!0):Math.sign(Ot)===Math.sign(S)&&(W=!0),W?(xt=-Ot,E=bt,Lt=Math.sqrt(g)):(xt=bt,E=Ot,Lt=Math.sqrt(g/2))}return new _t(xt/Lt,E/Lt)}let mt=[];for(let Q=0,it=G.length,j=it-1,xt=Q+1;Q<it;Q++,j++,xt++)j===it&&(j=0),xt===it&&(xt=0),mt[Q]=tt(G[Q],G[j],G[xt]);let ct=[],ut,Wt=mt.concat();for(let Q=0,it=Y;Q<it;Q++){let j=I[Q];ut=[];for(let xt=0,E=j.length,Lt=E-1,bt=xt+1;xt<E;xt++,Lt++,bt++)Lt===E&&(Lt=0),bt===E&&(bt=0),ut[xt]=tt(j[xt],j[Lt],j[bt]);ct.push(ut),Wt=Wt.concat(ut)}let Gt;if(m===0)Gt=ai.triangulateShape(G,I);else{let Q=[],it=[];for(let j=0;j<m;j++){let xt=j/m,E=p*Math.cos(xt*Math.PI/2),Lt=x*Math.sin(xt*Math.PI/2)+_;for(let bt=0,Ot=G.length;bt<Ot;bt++){let ot=H(G[bt],mt[bt],Lt);Ut(ot.x,ot.y,-E),xt===0&&Q.push(ot)}for(let bt=0,Ot=Y;bt<Ot;bt++){let ot=I[bt];ut=ct[bt];let S=[];for(let g=0,D=ot.length;g<D;g++){let W=H(ot[g],ut[g],Lt);Ut(W.x,W.y,-E),xt===0&&S.push(W)}xt===0&&it.push(S)}}Gt=ai.triangulateShape(Q,it)}let se=Gt.length,ae=x+_;for(let Q=0;Q<B;Q++){let it=u?H(b[Q],Wt[Q],ae):b[Q];M?(R.copy(A.normals[0]).multiplyScalar(it.x),C.copy(A.binormals[0]).multiplyScalar(it.y),N.copy(w[0]).add(R).add(C),Ut(N.x,N.y,N.z)):Ut(it.x,it.y,0)}for(let Q=1;Q<=h;Q++)for(let it=0;it<B;it++){let j=u?H(b[it],Wt[it],ae):b[it];M?(R.copy(A.normals[Q]).multiplyScalar(j.x),C.copy(A.binormals[Q]).multiplyScalar(j.y),N.copy(w[Q]).add(R).add(C),Ut(N.x,N.y,N.z)):Ut(j.x,j.y,d/h*Q)}for(let Q=m-1;Q>=0;Q--){let it=Q/m,j=p*Math.cos(it*Math.PI/2),xt=x*Math.sin(it*Math.PI/2)+_;for(let E=0,Lt=G.length;E<Lt;E++){let bt=H(G[E],mt[E],xt);Ut(bt.x,bt.y,d+j)}for(let E=0,Lt=I.length;E<Lt;E++){let bt=I[E];ut=ct[E];for(let Ot=0,ot=bt.length;Ot<ot;Ot++){let S=H(bt[Ot],ut[Ot],xt);M?Ut(S.x,S.y+w[h-1].y,w[h-1].x+j):Ut(S.x,S.y,d+j)}}}Z(),et();function Z(){let Q=r.length/3;if(u){let it=0,j=B*it;for(let xt=0;xt<se;xt++){let E=Gt[xt];Et(E[2]+j,E[1]+j,E[0]+j)}it=h+m*2,j=B*it;for(let xt=0;xt<se;xt++){let E=Gt[xt];Et(E[0]+j,E[1]+j,E[2]+j)}}else{for(let it=0;it<se;it++){let j=Gt[it];Et(j[2],j[1],j[0])}for(let it=0;it<se;it++){let j=Gt[it];Et(j[0]+B*h,j[1]+B*h,j[2]+B*h)}}n.addGroup(Q,r.length/3-Q,0)}function et(){let Q=r.length/3,it=0;Mt(G,it),it+=G.length;for(let j=0,xt=I.length;j<xt;j++){let E=I[j];Mt(E,it),it+=E.length}n.addGroup(Q,r.length/3-Q,1)}function Mt(Q,it){let j=Q.length;for(;--j>=0;){let xt=j,E=j-1;E<0&&(E=Q.length-1);for(let Lt=0,bt=h+m*2;Lt<bt;Lt++){let Ot=B*Lt,ot=B*(Lt+1),S=it+xt+Ot,g=it+E+Ot,D=it+E+ot,W=it+xt+ot;jt(S,g,D,W)}}}function Ut(Q,it,j){l.push(Q),l.push(it),l.push(j)}function Et(Q,it,j){oe(Q),oe(it),oe(j);let xt=r.length/3,E=T.generateTopUV(n,r,xt-3,xt-2,xt-1);Xt(E[0]),Xt(E[1]),Xt(E[2])}function jt(Q,it,j,xt){oe(Q),oe(it),oe(xt),oe(it),oe(j),oe(xt);let E=r.length/3,Lt=T.generateSideWallUV(n,r,E-6,E-3,E-2,E-1);Xt(Lt[0]),Xt(Lt[1]),Xt(Lt[3]),Xt(Lt[1]),Xt(Lt[2]),Xt(Lt[3])}function oe(Q){r.push(l[Q*3+0]),r.push(l[Q*3+1]),r.push(l[Q*3+2])}function Xt(Q){s.push(Q.x),s.push(Q.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return lu(e,n,t)}static fromJSON(t,e){let n=[];for(let s=0,a=t.shapes.length;s<a;s++){let o=e[t.shapes[s]];n.push(o)}let r=t.options.extrudePath;return r!==void 0&&(t.options.extrudePath=new Ko[r.type]().fromJSON(r)),new i(n,t.options)}},ou={generateTopUV:function(i,t,e,n,r){let s=t[e*3],a=t[e*3+1],o=t[n*3],l=t[n*3+1],c=t[r*3],h=t[r*3+1];return[new _t(s,a),new _t(o,l),new _t(c,h)]},generateSideWallUV:function(i,t,e,n,r,s){let a=t[e*3],o=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],d=t[n*3+2],u=t[r*3],p=t[r*3+1],x=t[r*3+2],_=t[s*3],m=t[s*3+1],f=t[s*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new _t(a,1-l),new _t(c,1-d),new _t(u,1-x),new _t(_,1-f)]:[new _t(o,1-l),new _t(h,1-d),new _t(p,1-x),new _t(m,1-f)]}};function lu(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,r=i.length;n<r;n++){let s=i[n];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var zr=class i extends Re{constructor(t=1,e=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:r};let s=t/2,a=e/2,o=Math.floor(n),l=Math.floor(r),c=o+1,h=l+1,d=t/o,u=e/l,p=[],x=[],_=[],m=[];for(let f=0;f<h;f++){let T=f*u-a;for(let w=0;w<c;w++){let M=w*d-s;x.push(M,-T,0),_.push(0,0,1),m.push(w/o),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let T=0;T<o;T++){let w=T+c*f,M=T+c*(f+1),A=T+1+c*(f+1),C=T+1+c*f;p.push(w,M,C),p.push(M,A,C)}this.setIndex(p),this.setAttribute("position",new ye(x,3)),this.setAttribute("normal",new ye(_,3)),this.setAttribute("uv",new ye(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}};var qi=class i extends Re{constructor(t=1,e=32,n=16,r=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let l=Math.min(a+o,Math.PI),c=0,h=[],d=new L,u=new L,p=[],x=[],_=[],m=[];for(let f=0;f<=n;f++){let T=[],w=f/n,M=0;f===0&&a===0?M=.5/e:f===n&&l===Math.PI&&(M=-.5/e);for(let A=0;A<=e;A++){let C=A/e;d.x=-t*Math.cos(r+C*s)*Math.sin(a+w*o),d.y=t*Math.cos(a+w*o),d.z=t*Math.sin(r+C*s)*Math.sin(a+w*o),x.push(d.x,d.y,d.z),u.copy(d).normalize(),_.push(u.x,u.y,u.z),m.push(C+M,1-w),T.push(c++)}h.push(T)}for(let f=0;f<n;f++)for(let T=0;T<e;T++){let w=h[f][T+1],M=h[f][T],A=h[f+1][T],C=h[f+1][T+1];(f!==0||a>0)&&p.push(w,M,C),(f!==n-1||l<Math.PI)&&p.push(M,A,C)}this.setIndex(p),this.setAttribute("position",new ye(x,3)),this.setAttribute("normal",new ye(_,3)),this.setAttribute("uv",new ye(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var qs=class extends Xe{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Rn=class extends Cn{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Qt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Qt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Sl,this.normalScale=new _t(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Wn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};var Zs=class extends Cn{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=xh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Js=class extends Cn{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function As(i,t){return!i||i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}var mi=class{constructor(t,e,n,r){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=r!==void 0?r:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,r=e[n],s=e[n-1];n:{t:{let a;e:{i:if(!(t<r)){for(let o=n+2;;){if(r===void 0){if(t<s)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(s=r,r=e[++n],t<r)break t}a=e.length;break e}if(!(t>=s)){let o=e[1];t<o&&(n=2,s=o);for(let l=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(r=s,s=e[--n-1],t>=s)break t}a=n,n=0;break e}break n}for(;n<a;){let o=n+a>>>1;t<e[o]?a=o:n=o+1}if(r=e[n],s=e[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,r)}return this.interpolate_(n,s,t,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,r=this.valueSize,s=t*r;for(let a=0;a!==r;++a)e[a]=n[s+a];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},$s=class extends mi{constructor(t,e,n,r){super(t,e,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Xo,endingEnd:Xo}}intervalChanged_(t,e,n){let r=this.parameterPositions,s=t-2,a=t+1,o=r[s],l=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case Yo:s=t,o=2*e-n;break;case qo:s=r.length-2,o=e+r[s]-r[s+1];break;default:s=t,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Yo:a=t,l=2*n-e;break;case qo:a=1,l=n+r[1]-r[0];break;default:a=t-1,l=e}let c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-o),this._weightNext=c/(l-n),this._offsetPrev=s*h,this._offsetNext=a*h}interpolate_(t,e,n,r){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,p=this._weightNext,x=(n-e)/(r-e),_=x*x,m=_*x,f=-u*m+2*u*_-u*x,T=(1+u)*m+(-1.5-2*u)*_+(-.5+u)*x+1,w=(-1-p)*m+(1.5+p)*_+.5*x,M=p*m-p*_;for(let A=0;A!==o;++A)s[A]=f*a[h+A]+T*a[c+A]+w*a[l+A]+M*a[d+A];return s}},Ks=class extends mi{constructor(t,e,n,r){super(t,e,n,r)}interpolate_(t,e,n,r){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=(n-e)/(r-e),d=1-h;for(let u=0;u!==o;++u)s[u]=a[c+u]*d+a[l+u]*h;return s}},Qs=class extends mi{constructor(t,e,n,r){super(t,e,n,r)}interpolate_(t){return this.copySampleValue_(t-1)}},qe=class{constructor(t,e,n,r){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=As(e,this.TimeBufferType),this.values=As(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:As(t.times,Array),values:As(t.values,Array)};let r=t.getInterpolation();r!==t.DefaultInterpolation&&(n.interpolation=r)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new Qs(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Ks(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new $s(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case xr:e=this.InterpolantFactoryMethodDiscrete;break;case Ls:e=this.InterpolantFactoryMethodLinear;break;case Cs:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Vt("KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return xr;case this.InterpolantFactoryMethodLinear:return Ls;case this.InterpolantFactoryMethodSmooth:return Cs}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,r=e.length;n!==r;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,r=e.length;n!==r;++n)e[n]*=t}return this}trim(t,e){let n=this.times,r=n.length,s=0,a=r-1;for(;s!==r&&n[s]<t;)++s;for(;a!==-1&&n[a]>e;)--a;if(++a,s!==0||a!==r){s>=a&&(a=Math.max(a,1),s=a-1);let o=this.getValueSize();this.times=n.slice(s,a),this.values=this.values.slice(s*o,a*o)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(kt("KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,r=this.values,s=n.length;s===0&&(kt("KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let o=0;o!==s;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){kt("KeyframeTrack: Time is not a valid number.",this,o,l),t=!1;break}if(a!==null&&a>l){kt("KeyframeTrack: Out of order keys.",this,o,l,a),t=!1;break}a=l}if(r!==void 0&&pd(r))for(let o=0,l=r.length;o!==l;++o){let c=r[o];if(isNaN(c)){kt("KeyframeTrack: Value is not a valid number.",this,o,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===Cs,s=t.length-1,a=1;for(let o=1;o<s;++o){let l=!1,c=t[o],h=t[o+1];if(c!==h&&(o!==1||c!==t[0]))if(r)l=!0;else{let d=o*n,u=d-n,p=d+n;for(let x=0;x!==n;++x){let _=e[d+x];if(_!==e[u+x]||_!==e[p+x]){l=!0;break}}}if(l){if(o!==a){t[a]=t[o];let d=o*n,u=a*n;for(let p=0;p!==n;++p)e[u+p]=e[d+p]}++a}}if(s>0){t[a]=t[s];for(let o=s*n,l=a*n,c=0;c!==n;++c)e[l+c]=e[o+c];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=e.slice(0,a*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,r=new n(this.name,t,e);return r.createInterpolant=this.createInterpolant,r}};qe.prototype.ValueTypeName="";qe.prototype.TimeBufferType=Float32Array;qe.prototype.ValueBufferType=Float32Array;qe.prototype.DefaultInterpolation=Ls;var Yn=class extends qe{constructor(t,e,n){super(t,e,n)}};Yn.prototype.ValueTypeName="bool";Yn.prototype.ValueBufferType=Array;Yn.prototype.DefaultInterpolation=xr;Yn.prototype.InterpolantFactoryMethodLinear=void 0;Yn.prototype.InterpolantFactoryMethodSmooth=void 0;var js=class extends qe{constructor(t,e,n,r){super(t,e,n,r)}};js.prototype.ValueTypeName="color";var ta=class extends qe{constructor(t,e,n,r){super(t,e,n,r)}};ta.prototype.ValueTypeName="number";var ea=class extends mi{constructor(t,e,n,r){super(t,e,n,r)}interpolate_(t,e,n,r){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-e)/(r-e),c=t*o;for(let h=c+o;c!==h;c+=4)An.slerpFlat(s,0,a,c-o,a,c,l);return s}},Vr=class extends qe{constructor(t,e,n,r){super(t,e,n,r)}InterpolantFactoryMethodLinear(t){return new ea(this.times,this.values,this.getValueSize(),t)}};Vr.prototype.ValueTypeName="quaternion";Vr.prototype.InterpolantFactoryMethodSmooth=void 0;var qn=class extends qe{constructor(t,e,n){super(t,e,n)}};qn.prototype.ValueTypeName="string";qn.prototype.ValueBufferType=Array;qn.prototype.DefaultInterpolation=xr;qn.prototype.InterpolantFactoryMethodLinear=void 0;qn.prototype.InterpolantFactoryMethodSmooth=void 0;var na=class extends qe{constructor(t,e,n,r){super(t,e,n,r)}};na.prototype.ValueTypeName="vector";var Zi=class extends nn{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Qt(t),this.intensity=e}dispose(){this.dispatchEvent({type:"dispose"})}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}};var Ho=new fe,Yc=new L,qc=new L,ia=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new _t(512,512),this.mapType=Be,this.map=null,this.mapPass=null,this.matrix=new fe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Gi,this._frameExtents=new _t(1,1),this._viewportCount=1,this._viewports=[new me(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;Yc.setFromMatrixPosition(t.matrixWorld),e.position.copy(Yc),qc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(qc),e.updateMatrixWorld(),Ho.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ho,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ho)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var el=class extends ia{constructor(){super(new Ee(90,1,.5,500)),this.isPointLightShadow=!0}},Ji=class extends Zi{constructor(t,e,n=0,r=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=r,this.shadow=new el}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}},$i=class extends Tr{constructor(t=-1,e=1,n=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,s=n-t,a=n+t,o=r+e,l=r-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},nl=class extends ia{constructor(){super(new $i(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Gr=class extends Zi{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(nn.DEFAULT_UP),this.updateMatrix(),this.target=new nn,this.shadow=new nl}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}},Hr=class extends Zi{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}};var ra=class extends Ee{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}};var Cl="\\[\\]\\.:\\/",cu=new RegExp("["+Cl+"]","g"),Rl="[^"+Cl+"]",hu="[^"+Cl.replace("\\.","")+"]",du=/((?:WC+[\/:])*)/.source.replace("WC",Rl),uu=/(WCOD+)?/.source.replace("WCOD",hu),fu=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Rl),pu=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Rl),mu=new RegExp("^"+du+uu+fu+pu+"$"),gu=["material","materials","bones","map"],il=class{constructor(t,e,n){let r=n||_e.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,r)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,s=n.length;r!==s;++r)n[r].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},_e=(()=>{class i{constructor(e,n,r){this.path=n,this.parsedPath=r||i.parseTrackName(n),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,n,r){return e&&e.isAnimationObjectGroup?new i.Composite(e,n,r):new i(e,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(cu,"")}static parseTrackName(e){let n=mu.exec(e);if(n===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let r={nodeName:n[2],objectName:n[3],objectIndex:n[4],propertyName:n[5],propertyIndex:n[6]},s=r.nodeName&&r.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let a=r.nodeName.substring(s+1);gu.indexOf(a)!==-1&&(r.nodeName=r.nodeName.substring(0,s),r.objectName=a)}if(r.propertyName===null||r.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return r}static findNode(e,n){if(n===void 0||n===""||n==="."||n===-1||n===e.name||n===e.uuid)return e;if(e.skeleton){let r=e.skeleton.getBoneByName(n);if(r!==void 0)return r}if(e.children){let r=function(a){for(let o=0;o<a.length;o++){let l=a[o];if(l.name===n||l.uuid===n)return l;let c=r(l.children);if(c)return c}return null},s=r(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,n){e[n]=this.targetObject[this.propertyName]}_getValue_array(e,n){let r=this.resolvedProperty;for(let s=0,a=r.length;s!==a;++s)e[n++]=r[s]}_getValue_arrayElement(e,n){e[n]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,n){this.resolvedProperty.toArray(e,n)}_setValue_direct(e,n){this.targetObject[this.propertyName]=e[n]}_setValue_direct_setNeedsUpdate(e,n){this.targetObject[this.propertyName]=e[n],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,n){this.targetObject[this.propertyName]=e[n],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,n){let r=this.resolvedProperty;for(let s=0,a=r.length;s!==a;++s)r[s]=e[n++]}_setValue_array_setNeedsUpdate(e,n){let r=this.resolvedProperty;for(let s=0,a=r.length;s!==a;++s)r[s]=e[n++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,n){let r=this.resolvedProperty;for(let s=0,a=r.length;s!==a;++s)r[s]=e[n++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,n){this.resolvedProperty[this.propertyIndex]=e[n]}_setValue_arrayElement_setNeedsUpdate(e,n){this.resolvedProperty[this.propertyIndex]=e[n],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,n){this.resolvedProperty[this.propertyIndex]=e[n],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,n){this.resolvedProperty.fromArray(e,n)}_setValue_fromArray_setNeedsUpdate(e,n){this.resolvedProperty.fromArray(e,n),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,n){this.resolvedProperty.fromArray(e,n),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,n){this.bind(),this.getValue(e,n)}_setValue_unbound(e,n){this.bind(),this.setValue(e,n)}bind(){let e=this.node,n=this.parsedPath,r=n.objectName,s=n.propertyName,a=n.propertyIndex;if(e||(e=i.findNode(this.rootNode,n.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Vt("PropertyBinding: No target node found for track: "+this.path+".");return}if(r){let h=n.objectIndex;switch(r){case"materials":if(!e.material){kt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){kt("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){kt("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let d=0;d<e.length;d++)if(e[d].name===h){h=d;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){kt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){kt("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[r]===void 0){kt("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[r]}if(h!==void 0){if(e[h]===void 0){kt("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[h]}}let o=e[s];if(o===void 0){let h=n.nodeName;kt("PropertyBinding: Trying to update property for track: "+h+"."+s+" but it wasn't found.",e);return}let l=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?l=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(l=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){kt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){kt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[a]!==void 0&&(a=e.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][l]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}return i.Composite=il,i})();_e.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};_e.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};_e.prototype.GetterByBindingType=[_e.prototype._getValue_direct,_e.prototype._getValue_array,_e.prototype._getValue_arrayElement,_e.prototype._getValue_toArray];_e.prototype.SetterByBindingTypeAndVersioning=[[_e.prototype._setValue_direct,_e.prototype._setValue_direct_setNeedsUpdate,_e.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[_e.prototype._setValue_array,_e.prototype._setValue_array_setNeedsUpdate,_e.prototype._setValue_array_setMatrixWorldNeedsUpdate],[_e.prototype._setValue_arrayElement,_e.prototype._setValue_arrayElement_setNeedsUpdate,_e.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[_e.prototype._setValue_fromArray,_e.prototype._setValue_fromArray_setNeedsUpdate,_e.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Bg=new Float32Array(1);function Il(i,t,e,n){let r=xu(n);switch(e){case vl:return i*t;case bl:return i*t/r.components*r.byteLength;case va:return i*t/r.components*r.byteLength;case xi:return i*t*2/r.components*r.byteLength;case ya:return i*t*2/r.components*r.byteLength;case yl:return i*t*3/r.components*r.byteLength;case Ke:return i*t*4/r.components*r.byteLength;case ba:return i*t*4/r.components*r.byteLength;case qr:case Zr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Jr:case $r:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Ma:case Ea:return Math.max(i,16)*Math.max(t,8)/4;case Sa:case wa:return Math.max(i,8)*Math.max(t,8)/2;case Ta:case Aa:case Ra:case Ia:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Ca:case Pa:case Da:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case La:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Fa:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Na:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Ua:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Oa:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Ba:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case ka:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case za:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Va:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Ga:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Ha:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Wa:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Xa:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Ya:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case qa:case Za:case Ja:return Math.ceil(i/4)*Math.ceil(t/4)*16;case $a:case Ka:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Qa:case ja:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function xu(i){switch(i){case Be:case ml:return{byteLength:1,components:1};case ji:case gl:case mn:return{byteLength:2,components:1};case xa:case _a:return{byteLength:2,components:4};case sn:case ga:case an:return{byteLength:4,components:1};case xl:case _l:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"182"}}));typeof window<"u"&&(window.__THREE__?Vt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="182");function ed(){let i=null,t=!1,e=null,n=null;function r(s,a){e(s,a),n=i.requestAnimationFrame(r)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(r),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){i=s}}}function vu(i){let t=new WeakMap;function e(o,l){let c=o.array,h=o.usage,d=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,h),o.onUploadCallback();let p;if(c instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=i.SHORT;else if(c instanceof Uint32Array)p=i.UNSIGNED_INT;else if(c instanceof Int32Array)p=i.INT;else if(c instanceof Int8Array)p=i.BYTE;else if(c instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,l,c){let h=l.array,d=l.updateRanges;if(i.bindBuffer(c,o),d.length===0)i.bufferSubData(c,0,h);else{d.sort((p,x)=>p.start-x.start);let u=0;for(let p=1;p<d.length;p++){let x=d[u],_=d[p];_.start<=x.start+x.count+1?x.count=Math.max(x.count,_.start+_.count-x.start):(++u,d[u]=_)}d.length=u+1;for(let p=0,x=d.length;p<x;p++){let _=d[p];i.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=t.get(o);l&&(i.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:r,remove:s,update:a}}var yu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,bu=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Su=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Mu=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,wu=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Eu=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Tu=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Au=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Cu=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Ru=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Iu=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Pu=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Du=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Lu=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Fu=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Nu=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Uu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ou=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Bu=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ku=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,zu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Vu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Gu=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Hu=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Wu=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Xu=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Yu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,qu=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Zu=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ju=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,$u="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ku=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Qu=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,ju=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,tf=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,ef=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,nf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,rf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,sf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,af=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,of=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,lf=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,cf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,hf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,df=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,uf=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,ff=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,pf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,mf=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,gf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,xf=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,_f=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,vf=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return v;
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( vec3( 1.0 ) - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,yf=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,bf=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Sf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Mf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,wf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ef=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Tf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Af=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Cf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Rf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,If=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Pf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Df=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Lf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Ff=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Nf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Uf=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Of=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Bf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,kf=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,zf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Vf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Gf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Hf=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Wf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Xf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Yf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,qf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Zf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Jf=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,$f=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Kf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Qf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,jf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,tp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ep=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,np=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * 6.28318530718;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * 6.28318530718;
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 0, 5, phi ).x + bitangent * vogelDiskSample( 0, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 1, 5, phi ).x + bitangent * vogelDiskSample( 1, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 2, 5, phi ).x + bitangent * vogelDiskSample( 2, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 3, 5, phi ).x + bitangent * vogelDiskSample( 3, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 4, 5, phi ).x + bitangent * vogelDiskSample( 4, 5, phi ).y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadow = step( depth, dp );
			#else
				shadow = step( dp, depth );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,ip=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,rp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,sp=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,ap=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,op=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,lp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,cp=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,hp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,dp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,up=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,fp=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,pp=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,mp=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,gp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,xp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,_p=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,vp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,yp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,bp=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Sp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Mp=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,wp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ep=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Tp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Ap=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Cp=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Rp=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Ip=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Pp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Dp=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Lp=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Fp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Np=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Up=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Op=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Bp=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,kp=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zp=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Vp=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Gp=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Hp=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Wp=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Xp=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Yp=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,qp=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Zp=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Jp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,$p=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Kp=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Qp=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,jp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,qt={alphahash_fragment:yu,alphahash_pars_fragment:bu,alphamap_fragment:Su,alphamap_pars_fragment:Mu,alphatest_fragment:wu,alphatest_pars_fragment:Eu,aomap_fragment:Tu,aomap_pars_fragment:Au,batching_pars_vertex:Cu,batching_vertex:Ru,begin_vertex:Iu,beginnormal_vertex:Pu,bsdfs:Du,iridescence_fragment:Lu,bumpmap_pars_fragment:Fu,clipping_planes_fragment:Nu,clipping_planes_pars_fragment:Uu,clipping_planes_pars_vertex:Ou,clipping_planes_vertex:Bu,color_fragment:ku,color_pars_fragment:zu,color_pars_vertex:Vu,color_vertex:Gu,common:Hu,cube_uv_reflection_fragment:Wu,defaultnormal_vertex:Xu,displacementmap_pars_vertex:Yu,displacementmap_vertex:qu,emissivemap_fragment:Zu,emissivemap_pars_fragment:Ju,colorspace_fragment:$u,colorspace_pars_fragment:Ku,envmap_fragment:Qu,envmap_common_pars_fragment:ju,envmap_pars_fragment:tf,envmap_pars_vertex:ef,envmap_physical_pars_fragment:ff,envmap_vertex:nf,fog_vertex:rf,fog_pars_vertex:sf,fog_fragment:af,fog_pars_fragment:of,gradientmap_pars_fragment:lf,lightmap_pars_fragment:cf,lights_lambert_fragment:hf,lights_lambert_pars_fragment:df,lights_pars_begin:uf,lights_toon_fragment:pf,lights_toon_pars_fragment:mf,lights_phong_fragment:gf,lights_phong_pars_fragment:xf,lights_physical_fragment:_f,lights_physical_pars_fragment:vf,lights_fragment_begin:yf,lights_fragment_maps:bf,lights_fragment_end:Sf,logdepthbuf_fragment:Mf,logdepthbuf_pars_fragment:wf,logdepthbuf_pars_vertex:Ef,logdepthbuf_vertex:Tf,map_fragment:Af,map_pars_fragment:Cf,map_particle_fragment:Rf,map_particle_pars_fragment:If,metalnessmap_fragment:Pf,metalnessmap_pars_fragment:Df,morphinstance_vertex:Lf,morphcolor_vertex:Ff,morphnormal_vertex:Nf,morphtarget_pars_vertex:Uf,morphtarget_vertex:Of,normal_fragment_begin:Bf,normal_fragment_maps:kf,normal_pars_fragment:zf,normal_pars_vertex:Vf,normal_vertex:Gf,normalmap_pars_fragment:Hf,clearcoat_normal_fragment_begin:Wf,clearcoat_normal_fragment_maps:Xf,clearcoat_pars_fragment:Yf,iridescence_pars_fragment:qf,opaque_fragment:Zf,packing:Jf,premultiplied_alpha_fragment:$f,project_vertex:Kf,dithering_fragment:Qf,dithering_pars_fragment:jf,roughnessmap_fragment:tp,roughnessmap_pars_fragment:ep,shadowmap_pars_fragment:np,shadowmap_pars_vertex:ip,shadowmap_vertex:rp,shadowmask_pars_fragment:sp,skinbase_vertex:ap,skinning_pars_vertex:op,skinning_vertex:lp,skinnormal_vertex:cp,specularmap_fragment:hp,specularmap_pars_fragment:dp,tonemapping_fragment:up,tonemapping_pars_fragment:fp,transmission_fragment:pp,transmission_pars_fragment:mp,uv_pars_fragment:gp,uv_pars_vertex:xp,uv_vertex:_p,worldpos_vertex:vp,background_vert:yp,background_frag:bp,backgroundCube_vert:Sp,backgroundCube_frag:Mp,cube_vert:wp,cube_frag:Ep,depth_vert:Tp,depth_frag:Ap,distance_vert:Cp,distance_frag:Rp,equirect_vert:Ip,equirect_frag:Pp,linedashed_vert:Dp,linedashed_frag:Lp,meshbasic_vert:Fp,meshbasic_frag:Np,meshlambert_vert:Up,meshlambert_frag:Op,meshmatcap_vert:Bp,meshmatcap_frag:kp,meshnormal_vert:zp,meshnormal_frag:Vp,meshphong_vert:Gp,meshphong_frag:Hp,meshphysical_vert:Wp,meshphysical_frag:Xp,meshtoon_vert:Yp,meshtoon_frag:qp,points_vert:Zp,points_frag:Jp,shadow_vert:$p,shadow_frag:Kp,sprite_vert:Qp,sprite_frag:jp},gt={common:{diffuse:{value:new Qt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Yt}},envmap:{envMap:{value:null},envMapRotation:{value:new Yt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Yt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Yt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Yt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Yt},normalScale:{value:new _t(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Yt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Yt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Yt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Yt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Qt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Qt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0},uvTransform:{value:new Yt}},sprite:{diffuse:{value:new Qt(16777215)},opacity:{value:1},center:{value:new _t(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}}},xn={basic:{uniforms:De([gt.common,gt.specularmap,gt.envmap,gt.aomap,gt.lightmap,gt.fog]),vertexShader:qt.meshbasic_vert,fragmentShader:qt.meshbasic_frag},lambert:{uniforms:De([gt.common,gt.specularmap,gt.envmap,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.fog,gt.lights,{emissive:{value:new Qt(0)}}]),vertexShader:qt.meshlambert_vert,fragmentShader:qt.meshlambert_frag},phong:{uniforms:De([gt.common,gt.specularmap,gt.envmap,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.fog,gt.lights,{emissive:{value:new Qt(0)},specular:{value:new Qt(1118481)},shininess:{value:30}}]),vertexShader:qt.meshphong_vert,fragmentShader:qt.meshphong_frag},standard:{uniforms:De([gt.common,gt.envmap,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.roughnessmap,gt.metalnessmap,gt.fog,gt.lights,{emissive:{value:new Qt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:qt.meshphysical_vert,fragmentShader:qt.meshphysical_frag},toon:{uniforms:De([gt.common,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.gradientmap,gt.fog,gt.lights,{emissive:{value:new Qt(0)}}]),vertexShader:qt.meshtoon_vert,fragmentShader:qt.meshtoon_frag},matcap:{uniforms:De([gt.common,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.fog,{matcap:{value:null}}]),vertexShader:qt.meshmatcap_vert,fragmentShader:qt.meshmatcap_frag},points:{uniforms:De([gt.points,gt.fog]),vertexShader:qt.points_vert,fragmentShader:qt.points_frag},dashed:{uniforms:De([gt.common,gt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:qt.linedashed_vert,fragmentShader:qt.linedashed_frag},depth:{uniforms:De([gt.common,gt.displacementmap]),vertexShader:qt.depth_vert,fragmentShader:qt.depth_frag},normal:{uniforms:De([gt.common,gt.bumpmap,gt.normalmap,gt.displacementmap,{opacity:{value:1}}]),vertexShader:qt.meshnormal_vert,fragmentShader:qt.meshnormal_frag},sprite:{uniforms:De([gt.sprite,gt.fog]),vertexShader:qt.sprite_vert,fragmentShader:qt.sprite_frag},background:{uniforms:{uvTransform:{value:new Yt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:qt.background_vert,fragmentShader:qt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Yt}},vertexShader:qt.backgroundCube_vert,fragmentShader:qt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:qt.cube_vert,fragmentShader:qt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:qt.equirect_vert,fragmentShader:qt.equirect_frag},distance:{uniforms:De([gt.common,gt.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:qt.distance_vert,fragmentShader:qt.distance_frag},shadow:{uniforms:De([gt.lights,gt.fog,{color:{value:new Qt(0)},opacity:{value:1}}]),vertexShader:qt.shadow_vert,fragmentShader:qt.shadow_frag}};xn.physical={uniforms:De([xn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Yt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Yt},clearcoatNormalScale:{value:new _t(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Yt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Yt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Yt},sheen:{value:0},sheenColor:{value:new Qt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Yt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Yt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Yt},transmissionSamplerSize:{value:new _t},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Yt},attenuationDistance:{value:0},attenuationColor:{value:new Qt(0)},specularColor:{value:new Qt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Yt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Yt},anisotropyVector:{value:new _t},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Yt}}]),vertexShader:qt.meshphysical_vert,fragmentShader:qt.meshphysical_frag};var no={r:0,b:0,g:0},vi=new Wn,tm=new fe;function em(i,t,e,n,r,s,a){let o=new Qt(0),l=s===!0?0:1,c,h,d=null,u=0,p=null;function x(w){let M=w.isScene===!0?w.background:null;return M&&M.isTexture&&(M=(w.backgroundBlurriness>0?e:t).get(M)),M}function _(w){let M=!1,A=x(w);A===null?f(o,l):A&&A.isColor&&(f(A,1),M=!0);let C=i.xr.getEnvironmentBlendMode();C==="additive"?n.buffers.color.setClear(0,0,0,1,a):C==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||M)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(w,M){let A=x(M);A&&(A.isCubeTexture||A.mapping===Xr)?(h===void 0&&(h=new be(new ki(1,1,1),new Xe({name:"BackgroundCubeMaterial",uniforms:_i(xn.backgroundCube.uniforms),vertexShader:xn.backgroundCube.vertexShader,fragmentShader:xn.backgroundCube.fragmentShader,side:Fe,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(C,R,N){this.matrixWorld.copyPosition(N.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(h)),vi.copy(M.backgroundRotation),vi.x*=-1,vi.y*=-1,vi.z*=-1,A.isCubeTexture&&A.isRenderTargetTexture===!1&&(vi.y*=-1,vi.z*=-1),h.material.uniforms.envMap.value=A,h.material.uniforms.flipEnvMap.value=A.isCubeTexture&&A.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(tm.makeRotationFromEuler(vi)),h.material.toneMapped=te.getTransfer(A.colorSpace)!==ne,(d!==A||u!==A.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,d=A,u=A.version,p=i.toneMapping),h.layers.enableAll(),w.unshift(h,h.geometry,h.material,0,0,null)):A&&A.isTexture&&(c===void 0&&(c=new be(new zr(2,2),new Xe({name:"BackgroundMaterial",uniforms:_i(xn.background.uniforms),vertexShader:xn.background.vertexShader,fragmentShader:xn.background.fragmentShader,side:En,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=A,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.toneMapped=te.getTransfer(A.colorSpace)!==ne,A.matrixAutoUpdate===!0&&A.updateMatrix(),c.material.uniforms.uvTransform.value.copy(A.matrix),(d!==A||u!==A.version||p!==i.toneMapping)&&(c.material.needsUpdate=!0,d=A,u=A.version,p=i.toneMapping),c.layers.enableAll(),w.unshift(c,c.geometry,c.material,0,0,null))}function f(w,M){w.getRGB(no,Tl(i)),n.buffers.color.setClear(no.r,no.g,no.b,M,a)}function T(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(w,M=1){o.set(w),l=M,f(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(w){l=w,f(o,l)},render:_,addToRenderList:m,dispose:T}}function nm(i,t){let e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=u(null),s=r,a=!1;function o(b,I,k,O,Y){let G=!1,H=d(O,k,I);s!==H&&(s=H,c(s.object)),G=p(b,O,k,Y),G&&x(b,O,k,Y),Y!==null&&t.update(Y,i.ELEMENT_ARRAY_BUFFER),(G||a)&&(a=!1,M(b,I,k,O),Y!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(Y).buffer))}function l(){return i.createVertexArray()}function c(b){return i.bindVertexArray(b)}function h(b){return i.deleteVertexArray(b)}function d(b,I,k){let O=k.wireframe===!0,Y=n[b.id];Y===void 0&&(Y={},n[b.id]=Y);let G=Y[I.id];G===void 0&&(G={},Y[I.id]=G);let H=G[O];return H===void 0&&(H=u(l()),G[O]=H),H}function u(b){let I=[],k=[],O=[];for(let Y=0;Y<e;Y++)I[Y]=0,k[Y]=0,O[Y]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:k,attributeDivisors:O,object:b,attributes:{},index:null}}function p(b,I,k,O){let Y=s.attributes,G=I.attributes,H=0,B=k.getAttributes();for(let tt in B)if(B[tt].location>=0){let ct=Y[tt],ut=G[tt];if(ut===void 0&&(tt==="instanceMatrix"&&b.instanceMatrix&&(ut=b.instanceMatrix),tt==="instanceColor"&&b.instanceColor&&(ut=b.instanceColor)),ct===void 0||ct.attribute!==ut||ut&&ct.data!==ut.data)return!0;H++}return s.attributesNum!==H||s.index!==O}function x(b,I,k,O){let Y={},G=I.attributes,H=0,B=k.getAttributes();for(let tt in B)if(B[tt].location>=0){let ct=G[tt];ct===void 0&&(tt==="instanceMatrix"&&b.instanceMatrix&&(ct=b.instanceMatrix),tt==="instanceColor"&&b.instanceColor&&(ct=b.instanceColor));let ut={};ut.attribute=ct,ct&&ct.data&&(ut.data=ct.data),Y[tt]=ut,H++}s.attributes=Y,s.attributesNum=H,s.index=O}function _(){let b=s.newAttributes;for(let I=0,k=b.length;I<k;I++)b[I]=0}function m(b){f(b,0)}function f(b,I){let k=s.newAttributes,O=s.enabledAttributes,Y=s.attributeDivisors;k[b]=1,O[b]===0&&(i.enableVertexAttribArray(b),O[b]=1),Y[b]!==I&&(i.vertexAttribDivisor(b,I),Y[b]=I)}function T(){let b=s.newAttributes,I=s.enabledAttributes;for(let k=0,O=I.length;k<O;k++)I[k]!==b[k]&&(i.disableVertexAttribArray(k),I[k]=0)}function w(b,I,k,O,Y,G,H){H===!0?i.vertexAttribIPointer(b,I,k,Y,G):i.vertexAttribPointer(b,I,k,O,Y,G)}function M(b,I,k,O){_();let Y=O.attributes,G=k.getAttributes(),H=I.defaultAttributeValues;for(let B in G){let tt=G[B];if(tt.location>=0){let mt=Y[B];if(mt===void 0&&(B==="instanceMatrix"&&b.instanceMatrix&&(mt=b.instanceMatrix),B==="instanceColor"&&b.instanceColor&&(mt=b.instanceColor)),mt!==void 0){let ct=mt.normalized,ut=mt.itemSize,Wt=t.get(mt);if(Wt===void 0)continue;let Gt=Wt.buffer,se=Wt.type,ae=Wt.bytesPerElement,Z=se===i.INT||se===i.UNSIGNED_INT||mt.gpuType===ga;if(mt.isInterleavedBufferAttribute){let et=mt.data,Mt=et.stride,Ut=mt.offset;if(et.isInstancedInterleavedBuffer){for(let Et=0;Et<tt.locationSize;Et++)f(tt.location+Et,et.meshPerAttribute);b.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=et.meshPerAttribute*et.count)}else for(let Et=0;Et<tt.locationSize;Et++)m(tt.location+Et);i.bindBuffer(i.ARRAY_BUFFER,Gt);for(let Et=0;Et<tt.locationSize;Et++)w(tt.location+Et,ut/tt.locationSize,se,ct,Mt*ae,(Ut+ut/tt.locationSize*Et)*ae,Z)}else{if(mt.isInstancedBufferAttribute){for(let et=0;et<tt.locationSize;et++)f(tt.location+et,mt.meshPerAttribute);b.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=mt.meshPerAttribute*mt.count)}else for(let et=0;et<tt.locationSize;et++)m(tt.location+et);i.bindBuffer(i.ARRAY_BUFFER,Gt);for(let et=0;et<tt.locationSize;et++)w(tt.location+et,ut/tt.locationSize,se,ct,ut*ae,ut/tt.locationSize*et*ae,Z)}}else if(H!==void 0){let ct=H[B];if(ct!==void 0)switch(ct.length){case 2:i.vertexAttrib2fv(tt.location,ct);break;case 3:i.vertexAttrib3fv(tt.location,ct);break;case 4:i.vertexAttrib4fv(tt.location,ct);break;default:i.vertexAttrib1fv(tt.location,ct)}}}}T()}function A(){N();for(let b in n){let I=n[b];for(let k in I){let O=I[k];for(let Y in O)h(O[Y].object),delete O[Y];delete I[k]}delete n[b]}}function C(b){if(n[b.id]===void 0)return;let I=n[b.id];for(let k in I){let O=I[k];for(let Y in O)h(O[Y].object),delete O[Y];delete I[k]}delete n[b.id]}function R(b){for(let I in n){let k=n[I];if(k[b.id]===void 0)continue;let O=k[b.id];for(let Y in O)h(O[Y].object),delete O[Y];delete k[b.id]}}function N(){v(),a=!0,s!==r&&(s=r,c(s.object))}function v(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:N,resetDefaultState:v,dispose:A,releaseStatesOfGeometry:C,releaseStatesOfProgram:R,initAttributes:_,enableAttribute:m,disableUnusedAttributes:T}}function im(i,t,e){let n;function r(c){n=c}function s(c,h){i.drawArrays(n,c,h),e.update(h,n,1)}function a(c,h,d){d!==0&&(i.drawArraysInstanced(n,c,h,d),e.update(h,n,d))}function o(c,h,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,d);let p=0;for(let x=0;x<d;x++)p+=h[x];e.update(p,n,1)}function l(c,h,d,u){if(d===0)return;let p=t.get("WEBGL_multi_draw");if(p===null)for(let x=0;x<c.length;x++)a(c[x],h[x],u[x]);else{p.multiDrawArraysInstancedWEBGL(n,c,0,h,0,u,0,d);let x=0;for(let _=0;_<d;_++)x+=h[_]*u[_];e.update(x,n,1)}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function rm(i,t,e,n){let r;function s(){if(r!==void 0)return r;if(t.has("EXT_texture_filter_anisotropic")===!0){let R=t.get("EXT_texture_filter_anisotropic");r=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(R){return!(R!==Ke&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){let N=R===mn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(R!==Be&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==an&&!N)}function l(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",h=l(c);h!==c&&(Vt("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let d=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),T=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),w=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),A=i.getParameter(i.MAX_SAMPLES),C=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:p,maxVertexTextures:x,maxTextureSize:_,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:T,maxVaryings:w,maxFragmentUniforms:M,maxSamples:A,samples:C}}function sm(i){let t=this,e=null,n=0,r=!1,s=!1,a=new hn,o=new Yt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){let p=d.length!==0||u||n!==0||r;return r=u,n=d.length,p},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,u){e=h(d,u,0)},this.setState=function(d,u,p){let x=d.clippingPlanes,_=d.clipIntersection,m=d.clipShadows,f=i.get(d);if(!r||x===null||x.length===0||s&&!m)s?h(null):c();else{let T=s?0:n,w=T*4,M=f.clippingState||null;l.value=M,M=h(x,u,w,p);for(let A=0;A!==w;++A)M[A]=e[A];f.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=T}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,u,p,x){let _=d!==null?d.length:0,m=null;if(_!==0){if(m=l.value,x!==!0||m===null){let f=p+_*4,T=u.matrixWorldInverse;o.getNormalMatrix(T),(m===null||m.length<f)&&(m=new Float32Array(f));for(let w=0,M=p;w!==_;++w,M+=4)a.copy(d[w]).applyMatrix4(T,o),a.normal.toArray(m,M),m[M+3]=a.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function am(i){let t=new WeakMap;function e(a,o){return o===fa?a.mapping=Zn:o===pa&&(a.mapping=gi),a}function n(a){if(a&&a.isTexture){let o=a.mapping;if(o===fa||o===pa)if(t.has(a)){let l=t.get(a).texture;return e(l,a.mapping)}else{let l=a.image;if(l&&l.height>0){let c=new Cr(l.height);return c.fromEquirectangularTexture(i,a),t.set(a,c),a.addEventListener("dispose",r),e(c.texture,a.mapping)}else return null}}return a}function r(a){let o=a.target;o.removeEventListener("dispose",r);let l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function s(){t=new WeakMap}return{get:n,dispose:s}}var Kn=4,Lh=[.125,.215,.35,.446,.526,.582],bi=20,om=256,Kr=new $i,Fh=new Qt,Pl=null,Dl=0,Ll=0,Fl=!1,lm=new L,ro=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,r=100,s={}){let{size:a=256,position:o=lm}=s;Pl=this._renderer.getRenderTarget(),Dl=this._renderer.getActiveCubeFace(),Ll=this._renderer.getActiveMipmapLevel(),Fl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,r,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Oh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Uh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(Pl,Dl,Ll),this._renderer.xr.enabled=Fl,t.scissorTest=!1,nr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Zn||t.mapping===gi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Pl=this._renderer.getRenderTarget(),Dl=this._renderer.getActiveCubeFace(),Ll=this._renderer.getActiveMipmapLevel(),Fl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Ce,minFilter:Ce,generateMipmaps:!1,type:mn,format:Ke,colorSpace:ci,depthBuffer:!1},r=Nh(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Nh(t,e,n);let{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=cm(s)),this._blurMaterial=dm(s,t,e),this._ggxMaterial=hm(s,t,e)}return r}_compileMaterial(t){let e=new be(new Re,t);this._renderer.compile(e,Kr)}_sceneToCubeUV(t,e,n,r,s){let l=new Ee(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,p=d.toneMapping;d.getClearColor(Fh),d.toneMapping=rn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(r),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new be(new ki,new di({name:"PMREM.Background",side:Fe,depthWrite:!1,depthTest:!1})));let _=this._backgroundBox,m=_.material,f=!1,T=t.background;T?T.isColor&&(m.color.copy(T),t.background=null,f=!0):(m.color.copy(Fh),f=!0);for(let w=0;w<6;w++){let M=w%3;M===0?(l.up.set(0,c[w],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+h[w],s.y,s.z)):M===1?(l.up.set(0,0,c[w]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+h[w],s.z)):(l.up.set(0,c[w],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+h[w]));let A=this._cubeSize;nr(r,M*A,w>2?A:0,A,A),d.setRenderTarget(r),f&&d.render(_,l),d.render(t,l)}d.toneMapping=p,d.autoClear=u,t.background=T}_textureToCubeUV(t,e){let n=this._renderer,r=t.mapping===Zn||t.mapping===gi;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Oh()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Uh());let s=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=s;let o=s.uniforms;o.envMap.value=t;let l=this._cubeSize;nr(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,Kr)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(t,s-1,s);e.autoClear=n}_applyGGXFilter(t,e,n){let r=this._renderer,s=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let l=a.uniforms,c=n/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),d=Math.sqrt(c*c-h*h),u=0+c*1.25,p=d*u,{_lodMax:x}=this,_=this._sizeLods[n],m=3*_*(n>x-Kn?n-x+Kn:0),f=4*(this._cubeSize-_);l.envMap.value=t.texture,l.roughness.value=p,l.mipInt.value=x-e,nr(s,m,f,3*_,2*_),r.setRenderTarget(s),r.render(o,Kr),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=x-n,nr(t,m,f,3*_,2*_),r.setRenderTarget(t),r.render(o,Kr)}_blur(t,e,n,r,s){let a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,r,"latitudinal",s),this._halfBlur(a,t,n,n,r,"longitudinal",s)}_halfBlur(t,e,n,r,s,a,o){let l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&kt("blur direction must be either latitudinal or longitudinal!");let h=3,d=this._lodMeshes[r];d.material=c;let u=c.uniforms,p=this._sizeLods[n]-1,x=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*bi-1),_=s/x,m=isFinite(s)?1+Math.floor(h*_):bi;m>bi&&Vt(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${bi}`);let f=[],T=0;for(let R=0;R<bi;++R){let N=R/_,v=Math.exp(-N*N/2);f.push(v),R===0?T+=v:R<m&&(T+=2*v)}for(let R=0;R<f.length;R++)f[R]=f[R]/T;u.envMap.value=t.texture,u.samples.value=m,u.weights.value=f,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);let{_lodMax:w}=this;u.dTheta.value=x,u.mipInt.value=w-n;let M=this._sizeLods[r],A=3*M*(r>w-Kn?r-w+Kn:0),C=4*(this._cubeSize-M);nr(e,A,C,3*M,2*M),l.setRenderTarget(e),l.render(d,Kr)}};function cm(i){let t=[],e=[],n=[],r=i,s=i-Kn+1+Lh.length;for(let a=0;a<s;a++){let o=Math.pow(2,r);t.push(o);let l=1/o;a>i-Kn?l=Lh[a-i+Kn-1]:a===0&&(l=0),e.push(l);let c=1/(o-2),h=-c,d=1+c,u=[h,h,d,h,d,d,h,h,d,d,h,d],p=6,x=6,_=3,m=2,f=1,T=new Float32Array(_*x*p),w=new Float32Array(m*x*p),M=new Float32Array(f*x*p);for(let C=0;C<p;C++){let R=C%3*2/3-1,N=C>2?0:-1,v=[R,N,0,R+2/3,N,0,R+2/3,N+1,0,R,N,0,R+2/3,N+1,0,R,N+1,0];T.set(v,_*x*C),w.set(u,m*x*C);let b=[C,C,C,C,C,C];M.set(b,f*x*C)}let A=new Re;A.setAttribute("position",new Ae(T,_)),A.setAttribute("uv",new Ae(w,m)),A.setAttribute("faceIndex",new Ae(M,f)),n.push(new be(A,null)),r>Kn&&r--}return{lodMeshes:n,sizeLods:t,sigmas:e}}function Nh(i,t,e){let n=new We(i,t,e);return n.texture.mapping=Xr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function nr(i,t,e,n,r){i.viewport.set(t,e,n,r),i.scissor.set(t,e,n,r)}function hm(i,t,e){return new Xe({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:om,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:so(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 3.2: Transform view direction to hemisphere configuration
				vec3 Vh = normalize(vec3(alpha * V.x, alpha * V.y, V.z));

				// Section 4.1: Orthonormal basis
				float lensq = Vh.x * Vh.x + Vh.y * Vh.y;
				vec3 T1 = lensq > 0.0 ? vec3(-Vh.y, Vh.x, 0.0) / sqrt(lensq) : vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(Vh, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + Vh.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * Vh;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:pn,depthTest:!1,depthWrite:!1})}function dm(i,t,e){let n=new Float32Array(bi),r=new L(0,1,0);return new Xe({name:"SphericalGaussianBlur",defines:{n:bi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:so(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:pn,depthTest:!1,depthWrite:!1})}function Uh(){return new Xe({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:so(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:pn,depthTest:!1,depthWrite:!1})}function Oh(){return new Xe({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:so(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:pn,depthTest:!1,depthWrite:!1})}function so(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function um(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){let l=o.mapping,c=l===fa||l===pa,h=l===Zn||l===gi;if(c||h){let d=t.get(o),u=d!==void 0?d.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==u)return e===null&&(e=new ro(i)),d=c?e.fromEquirectangular(o,d):e.fromCubemap(o,d),d.texture.pmremVersion=o.pmremVersion,t.set(o,d),d.texture;if(d!==void 0)return d.texture;{let p=o.image;return c&&p&&p.height>0||h&&p&&r(p)?(e===null&&(e=new ro(i)),d=c?e.fromEquirectangular(o):e.fromCubemap(o),d.texture.pmremVersion=o.pmremVersion,t.set(o,d),o.addEventListener("dispose",s),d.texture):null}}}return o}function r(o){let l=0,c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function s(o){let l=o.target;l.removeEventListener("dispose",s);let c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function fm(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let r=i.getExtension(n);return t[n]=r,r}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let r=e(n);return r===null&&Oi("WebGLRenderer: "+n+" extension not supported."),r}}}function pm(i,t,e,n){let r={},s=new WeakMap;function a(d){let u=d.target;u.index!==null&&t.remove(u.index);for(let x in u.attributes)t.remove(u.attributes[x]);u.removeEventListener("dispose",a),delete r[u.id];let p=s.get(u);p&&(t.remove(p),s.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function o(d,u){return r[u.id]===!0||(u.addEventListener("dispose",a),r[u.id]=!0,e.memory.geometries++),u}function l(d){let u=d.attributes;for(let p in u)t.update(u[p],i.ARRAY_BUFFER)}function c(d){let u=[],p=d.index,x=d.attributes.position,_=0;if(p!==null){let T=p.array;_=p.version;for(let w=0,M=T.length;w<M;w+=3){let A=T[w+0],C=T[w+1],R=T[w+2];u.push(A,C,C,R,R,A)}}else if(x!==void 0){let T=x.array;_=x.version;for(let w=0,M=T.length/3-1;w<M;w+=3){let A=w+0,C=w+1,R=w+2;u.push(A,C,C,R,R,A)}}else return;let m=new(wl(u)?Er:wr)(u,1);m.version=_;let f=s.get(d);f&&t.remove(f),s.set(d,m)}function h(d){let u=s.get(d);if(u){let p=d.index;p!==null&&u.version<p.version&&c(d)}else c(d);return s.get(d)}return{get:o,update:l,getWireframeAttribute:h}}function mm(i,t,e){let n;function r(u){n=u}let s,a;function o(u){s=u.type,a=u.bytesPerElement}function l(u,p){i.drawElements(n,p,s,u*a),e.update(p,n,1)}function c(u,p,x){x!==0&&(i.drawElementsInstanced(n,p,s,u*a,x),e.update(p,n,x))}function h(u,p,x){if(x===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,s,u,0,x);let m=0;for(let f=0;f<x;f++)m+=p[f];e.update(m,n,1)}function d(u,p,x,_){if(x===0)return;let m=t.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<u.length;f++)c(u[f]/a,p[f],_[f]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,s,u,0,_,0,x);let f=0;for(let T=0;T<x;T++)f+=p[T]*_[T];e.update(f,n,1)}}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function gm(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(s/3);break;case i.LINES:e.lines+=o*(s/2);break;case i.LINE_STRIP:e.lines+=o*(s-1);break;case i.LINE_LOOP:e.lines+=o*s;break;case i.POINTS:e.points+=o*s;break;default:kt("WebGLInfo: Unknown draw mode:",a);break}}function r(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:r,update:n}}function xm(i,t,e){let n=new WeakMap,r=new me;function s(a,o,l){let c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0,u=n.get(o);if(u===void 0||u.count!==d){let b=function(){N.dispose(),n.delete(o),o.removeEventListener("dispose",b)};var p=b;u!==void 0&&u.texture.dispose();let x=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,f=o.morphAttributes.position||[],T=o.morphAttributes.normal||[],w=o.morphAttributes.color||[],M=0;x===!0&&(M=1),_===!0&&(M=2),m===!0&&(M=3);let A=o.attributes.position.count*M,C=1;A>t.maxTextureSize&&(C=Math.ceil(A/t.maxTextureSize),A=t.maxTextureSize);let R=new Float32Array(A*C*4*d),N=new br(R,A,C,d);N.type=an,N.needsUpdate=!0;let v=M*4;for(let I=0;I<d;I++){let k=f[I],O=T[I],Y=w[I],G=A*C*4*I;for(let H=0;H<k.count;H++){let B=H*v;x===!0&&(r.fromBufferAttribute(k,H),R[G+B+0]=r.x,R[G+B+1]=r.y,R[G+B+2]=r.z,R[G+B+3]=0),_===!0&&(r.fromBufferAttribute(O,H),R[G+B+4]=r.x,R[G+B+5]=r.y,R[G+B+6]=r.z,R[G+B+7]=0),m===!0&&(r.fromBufferAttribute(Y,H),R[G+B+8]=r.x,R[G+B+9]=r.y,R[G+B+10]=r.z,R[G+B+11]=Y.itemSize===4?r.w:1)}}u={count:d,texture:N,size:new _t(A,C)},n.set(o,u),o.addEventListener("dispose",b)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let x=0;for(let m=0;m<c.length;m++)x+=c[m];let _=o.morphTargetsRelative?1:1-x;l.getUniforms().setValue(i,"morphTargetBaseInfluence",_),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:s}}function _m(i,t,e,n){let r=new WeakMap;function s(l){let c=n.render.frame,h=l.geometry,d=t.get(l,h);if(r.get(d)!==c&&(t.update(d),r.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),r.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){let u=l.skeleton;r.get(u)!==c&&(u.update(),r.set(u,c))}return d}function a(){r=new WeakMap}function o(l){let c=l.target;c.removeEventListener("dispose",o),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:s,dispose:a}}var vm={[ll]:"LINEAR_TONE_MAPPING",[cl]:"REINHARD_TONE_MAPPING",[hl]:"CINEON_TONE_MAPPING",[dl]:"ACES_FILMIC_TONE_MAPPING",[fl]:"AGX_TONE_MAPPING",[pl]:"NEUTRAL_TONE_MAPPING",[ul]:"CUSTOM_TONE_MAPPING"};function ym(i,t,e,n,r){let s=new We(t,e,{type:i,depthBuffer:n,stencilBuffer:r}),a=new We(t,e,{type:mn,depthBuffer:!1,stencilBuffer:!1}),o=new Re;o.setAttribute("position",new ye([-1,3,0,-1,-1,0,3,-1,0],3)),o.setAttribute("uv",new ye([0,2,0,0,2,0],2));let l=new qs({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),c=new be(o,l),h=new $i(-1,1,1,-1,0,1),d=null,u=null,p=!1,x,_=null,m=[],f=!1;this.setSize=function(T,w){s.setSize(T,w),a.setSize(T,w);for(let M=0;M<m.length;M++){let A=m[M];A.setSize&&A.setSize(T,w)}},this.setEffects=function(T){m=T,f=m.length>0&&m[0].isRenderPass===!0;let w=s.width,M=s.height;for(let A=0;A<m.length;A++){let C=m[A];C.setSize&&C.setSize(w,M)}},this.begin=function(T,w){if(p||T.toneMapping===rn&&m.length===0)return!1;if(_=w,w!==null){let M=w.width,A=w.height;(s.width!==M||s.height!==A)&&this.setSize(M,A)}return f===!1&&T.setRenderTarget(s),x=T.toneMapping,T.toneMapping=rn,!0},this.hasRenderPass=function(){return f},this.end=function(T,w){T.toneMapping=x,p=!0;let M=s,A=a;for(let C=0;C<m.length;C++){let R=m[C];if(R.enabled!==!1&&(R.render(T,A,M,w),R.needsSwap!==!1)){let N=M;M=A,A=N}}if(d!==T.outputColorSpace||u!==T.toneMapping){d=T.outputColorSpace,u=T.toneMapping,l.defines={},te.getTransfer(d)===ne&&(l.defines.SRGB_TRANSFER="");let C=vm[u];C&&(l.defines[C]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=M.texture,T.setRenderTarget(_),T.render(c,h),_=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){s.dispose(),a.dispose(),o.dispose(),l.dispose()}}var nd=new Pn,Ol=new Xn(1,1),id=new br,rd=new Os,sd=new Ar,Bh=[],kh=[],zh=new Float32Array(16),Vh=new Float32Array(9),Gh=new Float32Array(4);function rr(i,t,e){let n=i[0];if(n<=0||n>0)return i;let r=t*e,s=Bh[r];if(s===void 0&&(s=new Float32Array(r),Bh[r]=s),t!==0){n.toArray(s,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(s,o)}return s}function Se(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Me(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function ao(i,t){let e=kh[t];e===void 0&&(e=new Int32Array(t),kh[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function bm(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Sm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Se(e,t))return;i.uniform2fv(this.addr,t),Me(e,t)}}function Mm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Se(e,t))return;i.uniform3fv(this.addr,t),Me(e,t)}}function wm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Se(e,t))return;i.uniform4fv(this.addr,t),Me(e,t)}}function Em(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Se(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Me(e,t)}else{if(Se(e,n))return;Gh.set(n),i.uniformMatrix2fv(this.addr,!1,Gh),Me(e,n)}}function Tm(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Se(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Me(e,t)}else{if(Se(e,n))return;Vh.set(n),i.uniformMatrix3fv(this.addr,!1,Vh),Me(e,n)}}function Am(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Se(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Me(e,t)}else{if(Se(e,n))return;zh.set(n),i.uniformMatrix4fv(this.addr,!1,zh),Me(e,n)}}function Cm(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Rm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Se(e,t))return;i.uniform2iv(this.addr,t),Me(e,t)}}function Im(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Se(e,t))return;i.uniform3iv(this.addr,t),Me(e,t)}}function Pm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Se(e,t))return;i.uniform4iv(this.addr,t),Me(e,t)}}function Dm(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Lm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Se(e,t))return;i.uniform2uiv(this.addr,t),Me(e,t)}}function Fm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Se(e,t))return;i.uniform3uiv(this.addr,t),Me(e,t)}}function Nm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Se(e,t))return;i.uniform4uiv(this.addr,t),Me(e,t)}}function Um(i,t,e){let n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(Ol.compareFunction=e.isReversedDepthBuffer()?eo:to,s=Ol):s=nd,e.setTexture2D(t||s,r)}function Om(i,t,e){let n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture3D(t||rd,r)}function Bm(i,t,e){let n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTextureCube(t||sd,r)}function km(i,t,e){let n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture2DArray(t||id,r)}function zm(i){switch(i){case 5126:return bm;case 35664:return Sm;case 35665:return Mm;case 35666:return wm;case 35674:return Em;case 35675:return Tm;case 35676:return Am;case 5124:case 35670:return Cm;case 35667:case 35671:return Rm;case 35668:case 35672:return Im;case 35669:case 35673:return Pm;case 5125:return Dm;case 36294:return Lm;case 36295:return Fm;case 36296:return Nm;case 35678:case 36198:case 36298:case 36306:case 35682:return Um;case 35679:case 36299:case 36307:return Om;case 35680:case 36300:case 36308:case 36293:return Bm;case 36289:case 36303:case 36311:case 36292:return km}}function Vm(i,t){i.uniform1fv(this.addr,t)}function Gm(i,t){let e=rr(t,this.size,2);i.uniform2fv(this.addr,e)}function Hm(i,t){let e=rr(t,this.size,3);i.uniform3fv(this.addr,e)}function Wm(i,t){let e=rr(t,this.size,4);i.uniform4fv(this.addr,e)}function Xm(i,t){let e=rr(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Ym(i,t){let e=rr(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function qm(i,t){let e=rr(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Zm(i,t){i.uniform1iv(this.addr,t)}function Jm(i,t){i.uniform2iv(this.addr,t)}function $m(i,t){i.uniform3iv(this.addr,t)}function Km(i,t){i.uniform4iv(this.addr,t)}function Qm(i,t){i.uniform1uiv(this.addr,t)}function jm(i,t){i.uniform2uiv(this.addr,t)}function t0(i,t){i.uniform3uiv(this.addr,t)}function e0(i,t){i.uniform4uiv(this.addr,t)}function n0(i,t,e){let n=this.cache,r=t.length,s=ao(e,r);Se(n,s)||(i.uniform1iv(this.addr,s),Me(n,s));let a;this.type===i.SAMPLER_2D_SHADOW?a=Ol:a=nd;for(let o=0;o!==r;++o)e.setTexture2D(t[o]||a,s[o])}function i0(i,t,e){let n=this.cache,r=t.length,s=ao(e,r);Se(n,s)||(i.uniform1iv(this.addr,s),Me(n,s));for(let a=0;a!==r;++a)e.setTexture3D(t[a]||rd,s[a])}function r0(i,t,e){let n=this.cache,r=t.length,s=ao(e,r);Se(n,s)||(i.uniform1iv(this.addr,s),Me(n,s));for(let a=0;a!==r;++a)e.setTextureCube(t[a]||sd,s[a])}function s0(i,t,e){let n=this.cache,r=t.length,s=ao(e,r);Se(n,s)||(i.uniform1iv(this.addr,s),Me(n,s));for(let a=0;a!==r;++a)e.setTexture2DArray(t[a]||id,s[a])}function a0(i){switch(i){case 5126:return Vm;case 35664:return Gm;case 35665:return Hm;case 35666:return Wm;case 35674:return Xm;case 35675:return Ym;case 35676:return qm;case 5124:case 35670:return Zm;case 35667:case 35671:return Jm;case 35668:case 35672:return $m;case 35669:case 35673:return Km;case 5125:return Qm;case 36294:return jm;case 36295:return t0;case 36296:return e0;case 35678:case 36198:case 36298:case 36306:case 35682:return n0;case 35679:case 36299:case 36307:return i0;case 35680:case 36300:case 36308:case 36293:return r0;case 36289:case 36303:case 36311:case 36292:return s0}}var Bl=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=zm(e.type)}},kl=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=a0(e.type)}},zl=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let r=this.seq;for(let s=0,a=r.length;s!==a;++s){let o=r[s];o.setValue(t,e[o.id],n)}}},Nl=/(\w+)(\])?(\[|\.)?/g;function Hh(i,t){i.seq.push(t),i.map[t.id]=t}function o0(i,t,e){let n=i.name,r=n.length;for(Nl.lastIndex=0;;){let s=Nl.exec(n),a=Nl.lastIndex,o=s[1],l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===r){Hh(e,c===void 0?new Bl(o,i,t):new kl(o,i,t));break}else{let d=e.map[o];d===void 0&&(d=new zl(o),Hh(e,d)),e=d}}}var ir=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=t.getActiveUniform(e,a),l=t.getUniformLocation(e,o.name);o0(o,l,this)}let r=[],s=[];for(let a of this.seq)a.type===t.SAMPLER_2D_SHADOW||a.type===t.SAMPLER_CUBE_SHADOW||a.type===t.SAMPLER_2D_ARRAY_SHADOW?r.push(a):s.push(a);r.length>0&&(this.seq=r.concat(s))}setValue(t,e,n,r){let s=this.map[e];s!==void 0&&s.setValue(t,n,r)}setOptional(t,e,n){let r=e[n];r!==void 0&&this.setValue(t,n,r)}static upload(t,e,n,r){for(let s=0,a=e.length;s!==a;++s){let o=e[s],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,r)}}static seqWithValue(t,e){let n=[];for(let r=0,s=t.length;r!==s;++r){let a=t[r];a.id in e&&n.push(a)}return n}};function Wh(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var l0=37297,c0=0;function h0(i,t){let e=i.split(`
`),n=[],r=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let a=r;a<s;a++){let o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}var Xh=new Yt;function d0(i){te._getMatrix(Xh,te.workingColorSpace,i);let t=`mat3( ${Xh.elements.map(e=>e.toFixed(4))} )`;switch(te.getTransfer(i)){case _r:return[t,"LinearTransferOETF"];case ne:return[t,"sRGBTransferOETF"];default:return Vt("WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Yh(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),s=(i.getShaderInfoLog(t)||"").trim();if(n&&s==="")return"";let a=/ERROR: 0:(\d+)/.exec(s);if(a){let o=parseInt(a[1]);return e.toUpperCase()+`

`+s+`

`+h0(i.getShaderSource(t),o)}else return s}function u0(i,t){let e=d0(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}var f0={[ll]:"Linear",[cl]:"Reinhard",[hl]:"Cineon",[dl]:"ACESFilmic",[fl]:"AgX",[pl]:"Neutral",[ul]:"Custom"};function p0(i,t){let e=f0[t];return e===void 0?(Vt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var io=new L;function m0(){te.getLuminanceCoefficients(io);let i=io.x.toFixed(4),t=io.y.toFixed(4),e=io.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function g0(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(jr).join(`
`)}function x0(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function _0(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){let s=i.getActiveAttrib(t,r),a=s.name,o=1;s.type===i.FLOAT_MAT2&&(o=2),s.type===i.FLOAT_MAT3&&(o=3),s.type===i.FLOAT_MAT4&&(o=4),e[a]={type:s.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function jr(i){return i!==""}function qh(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Zh(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var v0=/^[ \t]*#include +<([\w\d./]+)>/gm;function Vl(i){return i.replace(v0,b0)}var y0=new Map;function b0(i,t){let e=qt[t];if(e===void 0){let n=y0.get(t);if(n!==void 0)e=qt[n],Vt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Vl(e)}var S0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Jh(i){return i.replace(S0,M0)}function M0(i,t,e,n){let r="";for(let s=parseInt(t);s<parseInt(e);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function $h(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}var w0={[Wr]:"SHADOWMAP_TYPE_PCF",[Ki]:"SHADOWMAP_TYPE_VSM"};function E0(i){return w0[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var T0={[Zn]:"ENVMAP_TYPE_CUBE",[gi]:"ENVMAP_TYPE_CUBE",[Xr]:"ENVMAP_TYPE_CUBE_UV"};function A0(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":T0[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var C0={[gi]:"ENVMAP_MODE_REFRACTION"};function R0(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":C0[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var I0={[ol]:"ENVMAP_BLENDING_MULTIPLY",[ph]:"ENVMAP_BLENDING_MIX",[mh]:"ENVMAP_BLENDING_ADD"};function P0(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":I0[i.combine]||"ENVMAP_BLENDING_NONE"}function D0(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function L0(i,t,e,n){let r=i.getContext(),s=e.defines,a=e.vertexShader,o=e.fragmentShader,l=E0(e),c=A0(e),h=R0(e),d=P0(e),u=D0(e),p=g0(e),x=x0(s),_=r.createProgram(),m,f,T=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(jr).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(jr).join(`
`),f.length>0&&(f+=`
`)):(m=[$h(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(jr).join(`
`),f=[$h(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==rn?"#define TONE_MAPPING":"",e.toneMapping!==rn?qt.tonemapping_pars_fragment:"",e.toneMapping!==rn?p0("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",qt.colorspace_pars_fragment,u0("linearToOutputTexel",e.outputColorSpace),m0(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(jr).join(`
`)),a=Vl(a),a=qh(a,e),a=Zh(a,e),o=Vl(o),o=qh(o,e),o=Zh(o,e),a=Jh(a),o=Jh(o),e.isRawShaderMaterial!==!0&&(T=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",e.glslVersion===Ml?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Ml?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);let w=T+m+a,M=T+f+o,A=Wh(r,r.VERTEX_SHADER,w),C=Wh(r,r.FRAGMENT_SHADER,M);r.attachShader(_,A),r.attachShader(_,C),e.index0AttributeName!==void 0?r.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&r.bindAttribLocation(_,0,"position"),r.linkProgram(_);function R(I){if(i.debug.checkShaderErrors){let k=r.getProgramInfoLog(_)||"",O=r.getShaderInfoLog(A)||"",Y=r.getShaderInfoLog(C)||"",G=k.trim(),H=O.trim(),B=Y.trim(),tt=!0,mt=!0;if(r.getProgramParameter(_,r.LINK_STATUS)===!1)if(tt=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,_,A,C);else{let ct=Yh(r,A,"vertex"),ut=Yh(r,C,"fragment");kt("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(_,r.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+G+`
`+ct+`
`+ut)}else G!==""?Vt("WebGLProgram: Program Info Log:",G):(H===""||B==="")&&(mt=!1);mt&&(I.diagnostics={runnable:tt,programLog:G,vertexShader:{log:H,prefix:m},fragmentShader:{log:B,prefix:f}})}r.deleteShader(A),r.deleteShader(C),N=new ir(r,_),v=_0(r,_)}let N;this.getUniforms=function(){return N===void 0&&R(this),N};let v;this.getAttributes=function(){return v===void 0&&R(this),v};let b=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=r.getProgramParameter(_,l0)),b},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=c0++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=A,this.fragmentShader=C,this}var F0=0,Gl=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,r=this._getShaderStage(e),s=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new Hl(t),e.set(t,n)),n}},Hl=class{constructor(t){this.id=F0++,this.code=t,this.usedTimes=0}};function N0(i,t,e,n,r,s,a){let o=new Mr,l=new Gl,c=new Set,h=[],d=new Map,u=r.logarithmicDepthBuffer,p=r.precision,x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(v){return c.add(v),v===0?"uv":`uv${v}`}function m(v,b,I,k,O){let Y=k.fog,G=O.geometry,H=v.isMeshStandardMaterial?k.environment:null,B=(v.isMeshStandardMaterial?e:t).get(v.envMap||H),tt=B&&B.mapping===Xr?B.image.height:null,mt=x[v.type];v.precision!==null&&(p=r.getMaxPrecision(v.precision),p!==v.precision&&Vt("WebGLProgram.getParameters:",v.precision,"not supported, using",p,"instead."));let ct=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,ut=ct!==void 0?ct.length:0,Wt=0;G.morphAttributes.position!==void 0&&(Wt=1),G.morphAttributes.normal!==void 0&&(Wt=2),G.morphAttributes.color!==void 0&&(Wt=3);let Gt,se,ae,Z;if(mt){let ie=xn[mt];Gt=ie.vertexShader,se=ie.fragmentShader}else Gt=v.vertexShader,se=v.fragmentShader,l.update(v),ae=l.getVertexShaderID(v),Z=l.getFragmentShaderID(v);let et=i.getRenderTarget(),Mt=i.state.buffers.depth.getReversed(),Ut=O.isInstancedMesh===!0,Et=O.isBatchedMesh===!0,jt=!!v.map,oe=!!v.matcap,Xt=!!B,Q=!!v.aoMap,it=!!v.lightMap,j=!!v.bumpMap,xt=!!v.normalMap,E=!!v.displacementMap,Lt=!!v.emissiveMap,bt=!!v.metalnessMap,Ot=!!v.roughnessMap,ot=v.anisotropy>0,S=v.clearcoat>0,g=v.dispersion>0,D=v.iridescence>0,W=v.sheen>0,$=v.transmission>0,X=ot&&!!v.anisotropyMap,Rt=S&&!!v.clearcoatMap,lt=S&&!!v.clearcoatNormalMap,At=S&&!!v.clearcoatRoughnessMap,Bt=D&&!!v.iridescenceMap,nt=D&&!!v.iridescenceThicknessMap,ft=W&&!!v.sheenColorMap,Ct=W&&!!v.sheenRoughnessMap,It=!!v.specularMap,dt=!!v.specularColorMap,Zt=!!v.specularIntensityMap,P=$&&!!v.transmissionMap,yt=$&&!!v.thicknessMap,at=!!v.gradientMap,St=!!v.alphaMap,rt=v.alphaTest>0,K=!!v.alphaHash,ht=!!v.extensions,Ht=rn;v.toneMapped&&(et===null||et.isXRRenderTarget===!0)&&(Ht=i.toneMapping);let de={shaderID:mt,shaderType:v.type,shaderName:v.name,vertexShader:Gt,fragmentShader:se,defines:v.defines,customVertexShaderID:ae,customFragmentShaderID:Z,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:p,batching:Et,batchingColor:Et&&O._colorsTexture!==null,instancing:Ut,instancingColor:Ut&&O.instanceColor!==null,instancingMorph:Ut&&O.morphTexture!==null,outputColorSpace:et===null?i.outputColorSpace:et.isXRRenderTarget===!0?et.texture.colorSpace:ci,alphaToCoverage:!!v.alphaToCoverage,map:jt,matcap:oe,envMap:Xt,envMapMode:Xt&&B.mapping,envMapCubeUVHeight:tt,aoMap:Q,lightMap:it,bumpMap:j,normalMap:xt,displacementMap:E,emissiveMap:Lt,normalMapObjectSpace:xt&&v.normalMapType===_h,normalMapTangentSpace:xt&&v.normalMapType===Sl,metalnessMap:bt,roughnessMap:Ot,anisotropy:ot,anisotropyMap:X,clearcoat:S,clearcoatMap:Rt,clearcoatNormalMap:lt,clearcoatRoughnessMap:At,dispersion:g,iridescence:D,iridescenceMap:Bt,iridescenceThicknessMap:nt,sheen:W,sheenColorMap:ft,sheenRoughnessMap:Ct,specularMap:It,specularColorMap:dt,specularIntensityMap:Zt,transmission:$,transmissionMap:P,thicknessMap:yt,gradientMap:at,opaque:v.transparent===!1&&v.blending===oi&&v.alphaToCoverage===!1,alphaMap:St,alphaTest:rt,alphaHash:K,combine:v.combine,mapUv:jt&&_(v.map.channel),aoMapUv:Q&&_(v.aoMap.channel),lightMapUv:it&&_(v.lightMap.channel),bumpMapUv:j&&_(v.bumpMap.channel),normalMapUv:xt&&_(v.normalMap.channel),displacementMapUv:E&&_(v.displacementMap.channel),emissiveMapUv:Lt&&_(v.emissiveMap.channel),metalnessMapUv:bt&&_(v.metalnessMap.channel),roughnessMapUv:Ot&&_(v.roughnessMap.channel),anisotropyMapUv:X&&_(v.anisotropyMap.channel),clearcoatMapUv:Rt&&_(v.clearcoatMap.channel),clearcoatNormalMapUv:lt&&_(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:At&&_(v.clearcoatRoughnessMap.channel),iridescenceMapUv:Bt&&_(v.iridescenceMap.channel),iridescenceThicknessMapUv:nt&&_(v.iridescenceThicknessMap.channel),sheenColorMapUv:ft&&_(v.sheenColorMap.channel),sheenRoughnessMapUv:Ct&&_(v.sheenRoughnessMap.channel),specularMapUv:It&&_(v.specularMap.channel),specularColorMapUv:dt&&_(v.specularColorMap.channel),specularIntensityMapUv:Zt&&_(v.specularIntensityMap.channel),transmissionMapUv:P&&_(v.transmissionMap.channel),thicknessMapUv:yt&&_(v.thicknessMap.channel),alphaMapUv:St&&_(v.alphaMap.channel),vertexTangents:!!G.attributes.tangent&&(xt||ot),vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,pointsUvs:O.isPoints===!0&&!!G.attributes.uv&&(jt||St),fog:!!Y,useFog:v.fog===!0,fogExp2:!!Y&&Y.isFogExp2,flatShading:v.flatShading===!0&&v.wireframe===!1,sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Mt,skinning:O.isSkinnedMesh===!0,morphTargets:G.morphAttributes.position!==void 0,morphNormals:G.morphAttributes.normal!==void 0,morphColors:G.morphAttributes.color!==void 0,morphTargetsCount:ut,morphTextureStride:Wt,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&I.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ht,decodeVideoTexture:jt&&v.map.isVideoTexture===!0&&te.getTransfer(v.map.colorSpace)===ne,decodeVideoTextureEmissive:Lt&&v.emissiveMap.isVideoTexture===!0&&te.getTransfer(v.emissiveMap.colorSpace)===ne,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===fn,flipSided:v.side===Fe,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:ht&&v.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ht&&v.extensions.multiDraw===!0||Et)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return de.vertexUv1s=c.has(1),de.vertexUv2s=c.has(2),de.vertexUv3s=c.has(3),c.clear(),de}function f(v){let b=[];if(v.shaderID?b.push(v.shaderID):(b.push(v.customVertexShaderID),b.push(v.customFragmentShaderID)),v.defines!==void 0)for(let I in v.defines)b.push(I),b.push(v.defines[I]);return v.isRawShaderMaterial===!1&&(T(b,v),w(b,v),b.push(i.outputColorSpace)),b.push(v.customProgramCacheKey),b.join()}function T(v,b){v.push(b.precision),v.push(b.outputColorSpace),v.push(b.envMapMode),v.push(b.envMapCubeUVHeight),v.push(b.mapUv),v.push(b.alphaMapUv),v.push(b.lightMapUv),v.push(b.aoMapUv),v.push(b.bumpMapUv),v.push(b.normalMapUv),v.push(b.displacementMapUv),v.push(b.emissiveMapUv),v.push(b.metalnessMapUv),v.push(b.roughnessMapUv),v.push(b.anisotropyMapUv),v.push(b.clearcoatMapUv),v.push(b.clearcoatNormalMapUv),v.push(b.clearcoatRoughnessMapUv),v.push(b.iridescenceMapUv),v.push(b.iridescenceThicknessMapUv),v.push(b.sheenColorMapUv),v.push(b.sheenRoughnessMapUv),v.push(b.specularMapUv),v.push(b.specularColorMapUv),v.push(b.specularIntensityMapUv),v.push(b.transmissionMapUv),v.push(b.thicknessMapUv),v.push(b.combine),v.push(b.fogExp2),v.push(b.sizeAttenuation),v.push(b.morphTargetsCount),v.push(b.morphAttributeCount),v.push(b.numDirLights),v.push(b.numPointLights),v.push(b.numSpotLights),v.push(b.numSpotLightMaps),v.push(b.numHemiLights),v.push(b.numRectAreaLights),v.push(b.numDirLightShadows),v.push(b.numPointLightShadows),v.push(b.numSpotLightShadows),v.push(b.numSpotLightShadowsWithMaps),v.push(b.numLightProbes),v.push(b.shadowMapType),v.push(b.toneMapping),v.push(b.numClippingPlanes),v.push(b.numClipIntersection),v.push(b.depthPacking)}function w(v,b){o.disableAll(),b.instancing&&o.enable(0),b.instancingColor&&o.enable(1),b.instancingMorph&&o.enable(2),b.matcap&&o.enable(3),b.envMap&&o.enable(4),b.normalMapObjectSpace&&o.enable(5),b.normalMapTangentSpace&&o.enable(6),b.clearcoat&&o.enable(7),b.iridescence&&o.enable(8),b.alphaTest&&o.enable(9),b.vertexColors&&o.enable(10),b.vertexAlphas&&o.enable(11),b.vertexUv1s&&o.enable(12),b.vertexUv2s&&o.enable(13),b.vertexUv3s&&o.enable(14),b.vertexTangents&&o.enable(15),b.anisotropy&&o.enable(16),b.alphaHash&&o.enable(17),b.batching&&o.enable(18),b.dispersion&&o.enable(19),b.batchingColor&&o.enable(20),b.gradientMap&&o.enable(21),v.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.reversedDepthBuffer&&o.enable(4),b.skinning&&o.enable(5),b.morphTargets&&o.enable(6),b.morphNormals&&o.enable(7),b.morphColors&&o.enable(8),b.premultipliedAlpha&&o.enable(9),b.shadowMapEnabled&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),b.decodeVideoTextureEmissive&&o.enable(20),b.alphaToCoverage&&o.enable(21),v.push(o.mask)}function M(v){let b=x[v.type],I;if(b){let k=xn[b];I=Ch.clone(k.uniforms)}else I=v.uniforms;return I}function A(v,b){let I=d.get(b);return I!==void 0?++I.usedTimes:(I=new L0(i,b,v,s),h.push(I),d.set(b,I)),I}function C(v){if(--v.usedTimes===0){let b=h.indexOf(v);h[b]=h[h.length-1],h.pop(),d.delete(v.cacheKey),v.destroy()}}function R(v){l.remove(v)}function N(){l.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:M,acquireProgram:A,releaseProgram:C,releaseShaderCache:R,programs:h,dispose:N}}function U0(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function r(a,o,l){i.get(a)[o]=l}function s(){i=new WeakMap}return{has:t,get:e,remove:n,update:r,dispose:s}}function O0(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Kh(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Qh(){let i=[],t=0,e=[],n=[],r=[];function s(){t=0,e.length=0,n.length=0,r.length=0}function a(d,u,p,x,_,m){let f=i[t];return f===void 0?(f={id:d.id,object:d,geometry:u,material:p,groupOrder:x,renderOrder:d.renderOrder,z:_,group:m},i[t]=f):(f.id=d.id,f.object=d,f.geometry=u,f.material=p,f.groupOrder=x,f.renderOrder=d.renderOrder,f.z=_,f.group=m),t++,f}function o(d,u,p,x,_,m){let f=a(d,u,p,x,_,m);p.transmission>0?n.push(f):p.transparent===!0?r.push(f):e.push(f)}function l(d,u,p,x,_,m){let f=a(d,u,p,x,_,m);p.transmission>0?n.unshift(f):p.transparent===!0?r.unshift(f):e.unshift(f)}function c(d,u){e.length>1&&e.sort(d||O0),n.length>1&&n.sort(u||Kh),r.length>1&&r.sort(u||Kh)}function h(){for(let d=t,u=i.length;d<u;d++){let p=i[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:r,init:s,push:o,unshift:l,finish:h,sort:c}}function B0(){let i=new WeakMap;function t(n,r){let s=i.get(n),a;return s===void 0?(a=new Qh,i.set(n,[a])):r>=s.length?(a=new Qh,s.push(a)):a=s[r],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function k0(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new L,color:new Qt};break;case"SpotLight":e={position:new L,direction:new L,color:new Qt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new L,color:new Qt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new L,skyColor:new Qt,groundColor:new Qt};break;case"RectAreaLight":e={color:new Qt,position:new L,halfWidth:new L,halfHeight:new L};break}return i[t.id]=e,e}}}function z0(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _t};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _t};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _t,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var V0=0;function G0(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function H0(i){let t=new k0,e=z0(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new L);let r=new L,s=new fe,a=new fe;function o(c){let h=0,d=0,u=0;for(let v=0;v<9;v++)n.probe[v].set(0,0,0);let p=0,x=0,_=0,m=0,f=0,T=0,w=0,M=0,A=0,C=0,R=0;c.sort(G0);for(let v=0,b=c.length;v<b;v++){let I=c[v],k=I.color,O=I.intensity,Y=I.distance,G=null;if(I.shadow&&I.shadow.map&&(I.shadow.map.texture.format===xi?G=I.shadow.map.texture:G=I.shadow.map.depthTexture||I.shadow.map.texture),I.isAmbientLight)h+=k.r*O,d+=k.g*O,u+=k.b*O;else if(I.isLightProbe){for(let H=0;H<9;H++)n.probe[H].addScaledVector(I.sh.coefficients[H],O);R++}else if(I.isDirectionalLight){let H=t.get(I);if(H.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let B=I.shadow,tt=e.get(I);tt.shadowIntensity=B.intensity,tt.shadowBias=B.bias,tt.shadowNormalBias=B.normalBias,tt.shadowRadius=B.radius,tt.shadowMapSize=B.mapSize,n.directionalShadow[p]=tt,n.directionalShadowMap[p]=G,n.directionalShadowMatrix[p]=I.shadow.matrix,T++}n.directional[p]=H,p++}else if(I.isSpotLight){let H=t.get(I);H.position.setFromMatrixPosition(I.matrixWorld),H.color.copy(k).multiplyScalar(O),H.distance=Y,H.coneCos=Math.cos(I.angle),H.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),H.decay=I.decay,n.spot[_]=H;let B=I.shadow;if(I.map&&(n.spotLightMap[A]=I.map,A++,B.updateMatrices(I),I.castShadow&&C++),n.spotLightMatrix[_]=B.matrix,I.castShadow){let tt=e.get(I);tt.shadowIntensity=B.intensity,tt.shadowBias=B.bias,tt.shadowNormalBias=B.normalBias,tt.shadowRadius=B.radius,tt.shadowMapSize=B.mapSize,n.spotShadow[_]=tt,n.spotShadowMap[_]=G,M++}_++}else if(I.isRectAreaLight){let H=t.get(I);H.color.copy(k).multiplyScalar(O),H.halfWidth.set(I.width*.5,0,0),H.halfHeight.set(0,I.height*.5,0),n.rectArea[m]=H,m++}else if(I.isPointLight){let H=t.get(I);if(H.color.copy(I.color).multiplyScalar(I.intensity),H.distance=I.distance,H.decay=I.decay,I.castShadow){let B=I.shadow,tt=e.get(I);tt.shadowIntensity=B.intensity,tt.shadowBias=B.bias,tt.shadowNormalBias=B.normalBias,tt.shadowRadius=B.radius,tt.shadowMapSize=B.mapSize,tt.shadowCameraNear=B.camera.near,tt.shadowCameraFar=B.camera.far,n.pointShadow[x]=tt,n.pointShadowMap[x]=G,n.pointShadowMatrix[x]=I.shadow.matrix,w++}n.point[x]=H,x++}else if(I.isHemisphereLight){let H=t.get(I);H.skyColor.copy(I.color).multiplyScalar(O),H.groundColor.copy(I.groundColor).multiplyScalar(O),n.hemi[f]=H,f++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=gt.LTC_FLOAT_1,n.rectAreaLTC2=gt.LTC_FLOAT_2):(n.rectAreaLTC1=gt.LTC_HALF_1,n.rectAreaLTC2=gt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;let N=n.hash;(N.directionalLength!==p||N.pointLength!==x||N.spotLength!==_||N.rectAreaLength!==m||N.hemiLength!==f||N.numDirectionalShadows!==T||N.numPointShadows!==w||N.numSpotShadows!==M||N.numSpotMaps!==A||N.numLightProbes!==R)&&(n.directional.length=p,n.spot.length=_,n.rectArea.length=m,n.point.length=x,n.hemi.length=f,n.directionalShadow.length=T,n.directionalShadowMap.length=T,n.pointShadow.length=w,n.pointShadowMap.length=w,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=T,n.pointShadowMatrix.length=w,n.spotLightMatrix.length=M+A-C,n.spotLightMap.length=A,n.numSpotLightShadowsWithMaps=C,n.numLightProbes=R,N.directionalLength=p,N.pointLength=x,N.spotLength=_,N.rectAreaLength=m,N.hemiLength=f,N.numDirectionalShadows=T,N.numPointShadows=w,N.numSpotShadows=M,N.numSpotMaps=A,N.numLightProbes=R,n.version=V0++)}function l(c,h){let d=0,u=0,p=0,x=0,_=0,m=h.matrixWorldInverse;for(let f=0,T=c.length;f<T;f++){let w=c[f];if(w.isDirectionalLight){let M=n.directional[d];M.direction.setFromMatrixPosition(w.matrixWorld),r.setFromMatrixPosition(w.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(m),d++}else if(w.isSpotLight){let M=n.spot[p];M.position.setFromMatrixPosition(w.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(w.matrixWorld),r.setFromMatrixPosition(w.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(m),p++}else if(w.isRectAreaLight){let M=n.rectArea[x];M.position.setFromMatrixPosition(w.matrixWorld),M.position.applyMatrix4(m),a.identity(),s.copy(w.matrixWorld),s.premultiply(m),a.extractRotation(s),M.halfWidth.set(w.width*.5,0,0),M.halfHeight.set(0,w.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),x++}else if(w.isPointLight){let M=n.point[u];M.position.setFromMatrixPosition(w.matrixWorld),M.position.applyMatrix4(m),u++}else if(w.isHemisphereLight){let M=n.hemi[_];M.direction.setFromMatrixPosition(w.matrixWorld),M.direction.transformDirection(m),_++}}}return{setup:o,setupView:l,state:n}}function jh(i){let t=new H0(i),e=[],n=[];function r(h){c.camera=h,e.length=0,n.length=0}function s(h){e.push(h)}function a(h){n.push(h)}function o(){t.setup(e)}function l(h){t.setupView(e,h)}let c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:o,setupLightsView:l,pushLight:s,pushShadow:a}}function W0(i){let t=new WeakMap;function e(r,s=0){let a=t.get(r),o;return a===void 0?(o=new jh(i),t.set(r,[o])):s>=a.length?(o=new jh(i),a.push(o)):o=a[s],o}function n(){t=new WeakMap}return{get:e,dispose:n}}var X0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Y0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,q0=[new L(1,0,0),new L(-1,0,0),new L(0,1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1)],Z0=[new L(0,-1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1),new L(0,-1,0),new L(0,-1,0)],td=new fe,Qr=new L,Ul=new L;function J0(i,t,e){let n=new Gi,r=new _t,s=new _t,a=new me,o=new Zs,l=new Js,c={},h=e.maxTextureSize,d={[En]:Fe,[Fe]:En,[fn]:fn},u=new Xe({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new _t},radius:{value:4}},vertexShader:X0,fragmentShader:Y0}),p=u.clone();p.defines.HORIZONTAL_PASS=1;let x=new Re;x.setAttribute("position",new Ae(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new be(x,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Wr;let f=this.type;this.render=function(C,R,N){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||C.length===0)return;C.type===sa&&(Vt("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),C.type=Wr);let v=i.getRenderTarget(),b=i.getActiveCubeFace(),I=i.getActiveMipmapLevel(),k=i.state;k.setBlending(pn),k.buffers.depth.getReversed()===!0?k.buffers.color.setClear(0,0,0,0):k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);let O=f!==this.type;O&&R.traverse(function(Y){Y.material&&(Array.isArray(Y.material)?Y.material.forEach(G=>G.needsUpdate=!0):Y.material.needsUpdate=!0)});for(let Y=0,G=C.length;Y<G;Y++){let H=C[Y],B=H.shadow;if(B===void 0){Vt("WebGLShadowMap:",H,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;r.copy(B.mapSize);let tt=B.getFrameExtents();if(r.multiply(tt),s.copy(B.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(s.x=Math.floor(h/tt.x),r.x=s.x*tt.x,B.mapSize.x=s.x),r.y>h&&(s.y=Math.floor(h/tt.y),r.y=s.y*tt.y,B.mapSize.y=s.y)),B.map===null||O===!0){if(B.map!==null&&(B.map.depthTexture!==null&&(B.map.depthTexture.dispose(),B.map.depthTexture=null),B.map.dispose()),this.type===Ki){if(H.isPointLight){Vt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}B.map=new We(r.x,r.y,{format:xi,type:mn,minFilter:Ce,magFilter:Ce,generateMipmaps:!1}),B.map.texture.name=H.name+".shadowMap",B.map.depthTexture=new Xn(r.x,r.y,an),B.map.depthTexture.name=H.name+".shadowMapDepth",B.map.depthTexture.format=un,B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=Te,B.map.depthTexture.magFilter=Te}else{H.isPointLight?(B.map=new Cr(r.x),B.map.depthTexture=new zs(r.x,sn)):(B.map=new We(r.x,r.y),B.map.depthTexture=new Xn(r.x,r.y,sn)),B.map.depthTexture.name=H.name+".shadowMap",B.map.depthTexture.format=un;let ct=i.state.buffers.depth.getReversed();this.type===Wr?(B.map.depthTexture.compareFunction=ct?eo:to,B.map.depthTexture.minFilter=Ce,B.map.depthTexture.magFilter=Ce):(B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=Te,B.map.depthTexture.magFilter=Te)}B.camera.updateProjectionMatrix()}let mt=B.map.isWebGLCubeRenderTarget?6:1;for(let ct=0;ct<mt;ct++){if(B.map.isWebGLCubeRenderTarget)i.setRenderTarget(B.map,ct),i.clear();else{ct===0&&(i.setRenderTarget(B.map),i.clear());let ut=B.getViewport(ct);a.set(s.x*ut.x,s.y*ut.y,s.x*ut.z,s.y*ut.w),k.viewport(a)}if(H.isPointLight){let ut=B.camera,Wt=B.matrix,Gt=H.distance||ut.far;Gt!==ut.far&&(ut.far=Gt,ut.updateProjectionMatrix()),Qr.setFromMatrixPosition(H.matrixWorld),ut.position.copy(Qr),Ul.copy(ut.position),Ul.add(q0[ct]),ut.up.copy(Z0[ct]),ut.lookAt(Ul),ut.updateMatrixWorld(),Wt.makeTranslation(-Qr.x,-Qr.y,-Qr.z),td.multiplyMatrices(ut.projectionMatrix,ut.matrixWorldInverse),B._frustum.setFromProjectionMatrix(td,ut.coordinateSystem,ut.reversedDepth)}else B.updateMatrices(H);n=B.getFrustum(),M(R,N,B.camera,H,this.type)}B.isPointLightShadow!==!0&&this.type===Ki&&T(B,N),B.needsUpdate=!1}f=this.type,m.needsUpdate=!1,i.setRenderTarget(v,b,I)};function T(C,R){let N=t.update(_);u.defines.VSM_SAMPLES!==C.blurSamples&&(u.defines.VSM_SAMPLES=C.blurSamples,p.defines.VSM_SAMPLES=C.blurSamples,u.needsUpdate=!0,p.needsUpdate=!0),C.mapPass===null&&(C.mapPass=new We(r.x,r.y,{format:xi,type:mn})),u.uniforms.shadow_pass.value=C.map.depthTexture,u.uniforms.resolution.value=C.mapSize,u.uniforms.radius.value=C.radius,i.setRenderTarget(C.mapPass),i.clear(),i.renderBufferDirect(R,null,N,u,_,null),p.uniforms.shadow_pass.value=C.mapPass.texture,p.uniforms.resolution.value=C.mapSize,p.uniforms.radius.value=C.radius,i.setRenderTarget(C.map),i.clear(),i.renderBufferDirect(R,null,N,p,_,null)}function w(C,R,N,v){let b=null,I=N.isPointLight===!0?C.customDistanceMaterial:C.customDepthMaterial;if(I!==void 0)b=I;else if(b=N.isPointLight===!0?l:o,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){let k=b.uuid,O=R.uuid,Y=c[k];Y===void 0&&(Y={},c[k]=Y);let G=Y[O];G===void 0&&(G=b.clone(),Y[O]=G,R.addEventListener("dispose",A)),b=G}if(b.visible=R.visible,b.wireframe=R.wireframe,v===Ki?b.side=R.shadowSide!==null?R.shadowSide:R.side:b.side=R.shadowSide!==null?R.shadowSide:d[R.side],b.alphaMap=R.alphaMap,b.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,b.map=R.map,b.clipShadows=R.clipShadows,b.clippingPlanes=R.clippingPlanes,b.clipIntersection=R.clipIntersection,b.displacementMap=R.displacementMap,b.displacementScale=R.displacementScale,b.displacementBias=R.displacementBias,b.wireframeLinewidth=R.wireframeLinewidth,b.linewidth=R.linewidth,N.isPointLight===!0&&b.isMeshDistanceMaterial===!0){let k=i.properties.get(b);k.light=N}return b}function M(C,R,N,v,b){if(C.visible===!1)return;if(C.layers.test(R.layers)&&(C.isMesh||C.isLine||C.isPoints)&&(C.castShadow||C.receiveShadow&&b===Ki)&&(!C.frustumCulled||n.intersectsObject(C))){C.modelViewMatrix.multiplyMatrices(N.matrixWorldInverse,C.matrixWorld);let O=t.update(C),Y=C.material;if(Array.isArray(Y)){let G=O.groups;for(let H=0,B=G.length;H<B;H++){let tt=G[H],mt=Y[tt.materialIndex];if(mt&&mt.visible){let ct=w(C,mt,v,b);C.onBeforeShadow(i,C,R,N,O,ct,tt),i.renderBufferDirect(N,null,O,ct,C,tt),C.onAfterShadow(i,C,R,N,O,ct,tt)}}}else if(Y.visible){let G=w(C,Y,v,b);C.onBeforeShadow(i,C,R,N,O,G,null),i.renderBufferDirect(N,null,O,G,C,null),C.onAfterShadow(i,C,R,N,O,G,null)}}let k=C.children;for(let O=0,Y=k.length;O<Y;O++)M(k[O],R,N,v,b)}function A(C){C.target.removeEventListener("dispose",A);for(let N in c){let v=c[N],b=C.target.uuid;b in v&&(v[b].dispose(),delete v[b])}}}var $0={[aa]:oa,[la]:da,[ca]:ua,[li]:ha,[oa]:aa,[da]:la,[ua]:ca,[ha]:li};function K0(i,t){function e(){let P=!1,yt=new me,at=null,St=new me(0,0,0,0);return{setMask:function(rt){at!==rt&&!P&&(i.colorMask(rt,rt,rt,rt),at=rt)},setLocked:function(rt){P=rt},setClear:function(rt,K,ht,Ht,de){de===!0&&(rt*=Ht,K*=Ht,ht*=Ht),yt.set(rt,K,ht,Ht),St.equals(yt)===!1&&(i.clearColor(rt,K,ht,Ht),St.copy(yt))},reset:function(){P=!1,at=null,St.set(-1,0,0,0)}}}function n(){let P=!1,yt=!1,at=null,St=null,rt=null;return{setReversed:function(K){if(yt!==K){let ht=t.get("EXT_clip_control");K?ht.clipControlEXT(ht.LOWER_LEFT_EXT,ht.ZERO_TO_ONE_EXT):ht.clipControlEXT(ht.LOWER_LEFT_EXT,ht.NEGATIVE_ONE_TO_ONE_EXT),yt=K;let Ht=rt;rt=null,this.setClear(Ht)}},getReversed:function(){return yt},setTest:function(K){K?et(i.DEPTH_TEST):Mt(i.DEPTH_TEST)},setMask:function(K){at!==K&&!P&&(i.depthMask(K),at=K)},setFunc:function(K){if(yt&&(K=$0[K]),St!==K){switch(K){case aa:i.depthFunc(i.NEVER);break;case oa:i.depthFunc(i.ALWAYS);break;case la:i.depthFunc(i.LESS);break;case li:i.depthFunc(i.LEQUAL);break;case ca:i.depthFunc(i.EQUAL);break;case ha:i.depthFunc(i.GEQUAL);break;case da:i.depthFunc(i.GREATER);break;case ua:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}St=K}},setLocked:function(K){P=K},setClear:function(K){rt!==K&&(yt&&(K=1-K),i.clearDepth(K),rt=K)},reset:function(){P=!1,at=null,St=null,rt=null,yt=!1}}}function r(){let P=!1,yt=null,at=null,St=null,rt=null,K=null,ht=null,Ht=null,de=null;return{setTest:function(ie){P||(ie?et(i.STENCIL_TEST):Mt(i.STENCIL_TEST))},setMask:function(ie){yt!==ie&&!P&&(i.stencilMask(ie),yt=ie)},setFunc:function(ie,on,_n){(at!==ie||St!==on||rt!==_n)&&(i.stencilFunc(ie,on,_n),at=ie,St=on,rt=_n)},setOp:function(ie,on,_n){(K!==ie||ht!==on||Ht!==_n)&&(i.stencilOp(ie,on,_n),K=ie,ht=on,Ht=_n)},setLocked:function(ie){P=ie},setClear:function(ie){de!==ie&&(i.clearStencil(ie),de=ie)},reset:function(){P=!1,yt=null,at=null,St=null,rt=null,K=null,ht=null,Ht=null,de=null}}}let s=new e,a=new n,o=new r,l=new WeakMap,c=new WeakMap,h={},d={},u=new WeakMap,p=[],x=null,_=!1,m=null,f=null,T=null,w=null,M=null,A=null,C=null,R=new Qt(0,0,0),N=0,v=!1,b=null,I=null,k=null,O=null,Y=null,G=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),H=!1,B=0,tt=i.getParameter(i.VERSION);tt.indexOf("WebGL")!==-1?(B=parseFloat(/^WebGL (\d)/.exec(tt)[1]),H=B>=1):tt.indexOf("OpenGL ES")!==-1&&(B=parseFloat(/^OpenGL ES (\d)/.exec(tt)[1]),H=B>=2);let mt=null,ct={},ut=i.getParameter(i.SCISSOR_BOX),Wt=i.getParameter(i.VIEWPORT),Gt=new me().fromArray(ut),se=new me().fromArray(Wt);function ae(P,yt,at,St){let rt=new Uint8Array(4),K=i.createTexture();i.bindTexture(P,K),i.texParameteri(P,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(P,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let ht=0;ht<at;ht++)P===i.TEXTURE_3D||P===i.TEXTURE_2D_ARRAY?i.texImage3D(yt,0,i.RGBA,1,1,St,0,i.RGBA,i.UNSIGNED_BYTE,rt):i.texImage2D(yt+ht,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,rt);return K}let Z={};Z[i.TEXTURE_2D]=ae(i.TEXTURE_2D,i.TEXTURE_2D,1),Z[i.TEXTURE_CUBE_MAP]=ae(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Z[i.TEXTURE_2D_ARRAY]=ae(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Z[i.TEXTURE_3D]=ae(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),et(i.DEPTH_TEST),a.setFunc(li),j(!1),xt(rl),et(i.CULL_FACE),Q(pn);function et(P){h[P]!==!0&&(i.enable(P),h[P]=!0)}function Mt(P){h[P]!==!1&&(i.disable(P),h[P]=!1)}function Ut(P,yt){return d[P]!==yt?(i.bindFramebuffer(P,yt),d[P]=yt,P===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=yt),P===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=yt),!0):!1}function Et(P,yt){let at=p,St=!1;if(P){at=u.get(yt),at===void 0&&(at=[],u.set(yt,at));let rt=P.textures;if(at.length!==rt.length||at[0]!==i.COLOR_ATTACHMENT0){for(let K=0,ht=rt.length;K<ht;K++)at[K]=i.COLOR_ATTACHMENT0+K;at.length=rt.length,St=!0}}else at[0]!==i.BACK&&(at[0]=i.BACK,St=!0);St&&i.drawBuffers(at)}function jt(P){return x!==P?(i.useProgram(P),x=P,!0):!1}let oe={[Gn]:i.FUNC_ADD,[Kc]:i.FUNC_SUBTRACT,[Qc]:i.FUNC_REVERSE_SUBTRACT};oe[jc]=i.MIN,oe[th]=i.MAX;let Xt={[eh]:i.ZERO,[nh]:i.ONE,[ih]:i.SRC_COLOR,[Rs]:i.SRC_ALPHA,[ch]:i.SRC_ALPHA_SATURATE,[oh]:i.DST_COLOR,[sh]:i.DST_ALPHA,[rh]:i.ONE_MINUS_SRC_COLOR,[Is]:i.ONE_MINUS_SRC_ALPHA,[lh]:i.ONE_MINUS_DST_COLOR,[ah]:i.ONE_MINUS_DST_ALPHA,[hh]:i.CONSTANT_COLOR,[dh]:i.ONE_MINUS_CONSTANT_COLOR,[uh]:i.CONSTANT_ALPHA,[fh]:i.ONE_MINUS_CONSTANT_ALPHA};function Q(P,yt,at,St,rt,K,ht,Ht,de,ie){if(P===pn){_===!0&&(Mt(i.BLEND),_=!1);return}if(_===!1&&(et(i.BLEND),_=!0),P!==$c){if(P!==m||ie!==v){if((f!==Gn||M!==Gn)&&(i.blendEquation(i.FUNC_ADD),f=Gn,M=Gn),ie)switch(P){case oi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Qi:i.blendFunc(i.ONE,i.ONE);break;case sl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case al:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:kt("WebGLState: Invalid blending: ",P);break}else switch(P){case oi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Qi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case sl:kt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case al:kt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:kt("WebGLState: Invalid blending: ",P);break}T=null,w=null,A=null,C=null,R.set(0,0,0),N=0,m=P,v=ie}return}rt=rt||yt,K=K||at,ht=ht||St,(yt!==f||rt!==M)&&(i.blendEquationSeparate(oe[yt],oe[rt]),f=yt,M=rt),(at!==T||St!==w||K!==A||ht!==C)&&(i.blendFuncSeparate(Xt[at],Xt[St],Xt[K],Xt[ht]),T=at,w=St,A=K,C=ht),(Ht.equals(R)===!1||de!==N)&&(i.blendColor(Ht.r,Ht.g,Ht.b,de),R.copy(Ht),N=de),m=P,v=!1}function it(P,yt){P.side===fn?Mt(i.CULL_FACE):et(i.CULL_FACE);let at=P.side===Fe;yt&&(at=!at),j(at),P.blending===oi&&P.transparent===!1?Q(pn):Q(P.blending,P.blendEquation,P.blendSrc,P.blendDst,P.blendEquationAlpha,P.blendSrcAlpha,P.blendDstAlpha,P.blendColor,P.blendAlpha,P.premultipliedAlpha),a.setFunc(P.depthFunc),a.setTest(P.depthTest),a.setMask(P.depthWrite),s.setMask(P.colorWrite);let St=P.stencilWrite;o.setTest(St),St&&(o.setMask(P.stencilWriteMask),o.setFunc(P.stencilFunc,P.stencilRef,P.stencilFuncMask),o.setOp(P.stencilFail,P.stencilZFail,P.stencilZPass)),Lt(P.polygonOffset,P.polygonOffsetFactor,P.polygonOffsetUnits),P.alphaToCoverage===!0?et(i.SAMPLE_ALPHA_TO_COVERAGE):Mt(i.SAMPLE_ALPHA_TO_COVERAGE)}function j(P){b!==P&&(P?i.frontFace(i.CW):i.frontFace(i.CCW),b=P)}function xt(P){P!==Zc?(et(i.CULL_FACE),P!==I&&(P===rl?i.cullFace(i.BACK):P===Jc?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Mt(i.CULL_FACE),I=P}function E(P){P!==k&&(H&&i.lineWidth(P),k=P)}function Lt(P,yt,at){P?(et(i.POLYGON_OFFSET_FILL),(O!==yt||Y!==at)&&(i.polygonOffset(yt,at),O=yt,Y=at)):Mt(i.POLYGON_OFFSET_FILL)}function bt(P){P?et(i.SCISSOR_TEST):Mt(i.SCISSOR_TEST)}function Ot(P){P===void 0&&(P=i.TEXTURE0+G-1),mt!==P&&(i.activeTexture(P),mt=P)}function ot(P,yt,at){at===void 0&&(mt===null?at=i.TEXTURE0+G-1:at=mt);let St=ct[at];St===void 0&&(St={type:void 0,texture:void 0},ct[at]=St),(St.type!==P||St.texture!==yt)&&(mt!==at&&(i.activeTexture(at),mt=at),i.bindTexture(P,yt||Z[P]),St.type=P,St.texture=yt)}function S(){let P=ct[mt];P!==void 0&&P.type!==void 0&&(i.bindTexture(P.type,null),P.type=void 0,P.texture=void 0)}function g(){try{i.compressedTexImage2D(...arguments)}catch(P){kt("WebGLState:",P)}}function D(){try{i.compressedTexImage3D(...arguments)}catch(P){kt("WebGLState:",P)}}function W(){try{i.texSubImage2D(...arguments)}catch(P){kt("WebGLState:",P)}}function $(){try{i.texSubImage3D(...arguments)}catch(P){kt("WebGLState:",P)}}function X(){try{i.compressedTexSubImage2D(...arguments)}catch(P){kt("WebGLState:",P)}}function Rt(){try{i.compressedTexSubImage3D(...arguments)}catch(P){kt("WebGLState:",P)}}function lt(){try{i.texStorage2D(...arguments)}catch(P){kt("WebGLState:",P)}}function At(){try{i.texStorage3D(...arguments)}catch(P){kt("WebGLState:",P)}}function Bt(){try{i.texImage2D(...arguments)}catch(P){kt("WebGLState:",P)}}function nt(){try{i.texImage3D(...arguments)}catch(P){kt("WebGLState:",P)}}function ft(P){Gt.equals(P)===!1&&(i.scissor(P.x,P.y,P.z,P.w),Gt.copy(P))}function Ct(P){se.equals(P)===!1&&(i.viewport(P.x,P.y,P.z,P.w),se.copy(P))}function It(P,yt){let at=c.get(yt);at===void 0&&(at=new WeakMap,c.set(yt,at));let St=at.get(P);St===void 0&&(St=i.getUniformBlockIndex(yt,P.name),at.set(P,St))}function dt(P,yt){let St=c.get(yt).get(P);l.get(yt)!==St&&(i.uniformBlockBinding(yt,St,P.__bindingPointIndex),l.set(yt,St))}function Zt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},mt=null,ct={},d={},u=new WeakMap,p=[],x=null,_=!1,m=null,f=null,T=null,w=null,M=null,A=null,C=null,R=new Qt(0,0,0),N=0,v=!1,b=null,I=null,k=null,O=null,Y=null,Gt.set(0,0,i.canvas.width,i.canvas.height),se.set(0,0,i.canvas.width,i.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:et,disable:Mt,bindFramebuffer:Ut,drawBuffers:Et,useProgram:jt,setBlending:Q,setMaterial:it,setFlipSided:j,setCullFace:xt,setLineWidth:E,setPolygonOffset:Lt,setScissorTest:bt,activeTexture:Ot,bindTexture:ot,unbindTexture:S,compressedTexImage2D:g,compressedTexImage3D:D,texImage2D:Bt,texImage3D:nt,updateUBOMapping:It,uniformBlockBinding:dt,texStorage2D:lt,texStorage3D:At,texSubImage2D:W,texSubImage3D:$,compressedTexSubImage2D:X,compressedTexSubImage3D:Rt,scissor:ft,viewport:Ct,reset:Zt}}function Q0(i,t,e,n,r,s,a){let o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new _t,h=new WeakMap,d,u=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(S,g){return p?new OffscreenCanvas(S,g):yr("canvas")}function _(S,g,D){let W=1,$=ot(S);if(($.width>D||$.height>D)&&(W=D/Math.max($.width,$.height)),W<1)if(typeof HTMLImageElement<"u"&&S instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&S instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&S instanceof ImageBitmap||typeof VideoFrame<"u"&&S instanceof VideoFrame){let X=Math.floor(W*$.width),Rt=Math.floor(W*$.height);d===void 0&&(d=x(X,Rt));let lt=g?x(X,Rt):d;return lt.width=X,lt.height=Rt,lt.getContext("2d").drawImage(S,0,0,X,Rt),Vt("WebGLRenderer: Texture has been resized from ("+$.width+"x"+$.height+") to ("+X+"x"+Rt+")."),lt}else return"data"in S&&Vt("WebGLRenderer: Image in DataTexture is too big ("+$.width+"x"+$.height+")."),S;return S}function m(S){return S.generateMipmaps}function f(S){i.generateMipmap(S)}function T(S){return S.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:S.isWebGL3DRenderTarget?i.TEXTURE_3D:S.isWebGLArrayRenderTarget||S.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function w(S,g,D,W,$=!1){if(S!==null){if(i[S]!==void 0)return i[S];Vt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+S+"'")}let X=g;if(g===i.RED&&(D===i.FLOAT&&(X=i.R32F),D===i.HALF_FLOAT&&(X=i.R16F),D===i.UNSIGNED_BYTE&&(X=i.R8)),g===i.RED_INTEGER&&(D===i.UNSIGNED_BYTE&&(X=i.R8UI),D===i.UNSIGNED_SHORT&&(X=i.R16UI),D===i.UNSIGNED_INT&&(X=i.R32UI),D===i.BYTE&&(X=i.R8I),D===i.SHORT&&(X=i.R16I),D===i.INT&&(X=i.R32I)),g===i.RG&&(D===i.FLOAT&&(X=i.RG32F),D===i.HALF_FLOAT&&(X=i.RG16F),D===i.UNSIGNED_BYTE&&(X=i.RG8)),g===i.RG_INTEGER&&(D===i.UNSIGNED_BYTE&&(X=i.RG8UI),D===i.UNSIGNED_SHORT&&(X=i.RG16UI),D===i.UNSIGNED_INT&&(X=i.RG32UI),D===i.BYTE&&(X=i.RG8I),D===i.SHORT&&(X=i.RG16I),D===i.INT&&(X=i.RG32I)),g===i.RGB_INTEGER&&(D===i.UNSIGNED_BYTE&&(X=i.RGB8UI),D===i.UNSIGNED_SHORT&&(X=i.RGB16UI),D===i.UNSIGNED_INT&&(X=i.RGB32UI),D===i.BYTE&&(X=i.RGB8I),D===i.SHORT&&(X=i.RGB16I),D===i.INT&&(X=i.RGB32I)),g===i.RGBA_INTEGER&&(D===i.UNSIGNED_BYTE&&(X=i.RGBA8UI),D===i.UNSIGNED_SHORT&&(X=i.RGBA16UI),D===i.UNSIGNED_INT&&(X=i.RGBA32UI),D===i.BYTE&&(X=i.RGBA8I),D===i.SHORT&&(X=i.RGBA16I),D===i.INT&&(X=i.RGBA32I)),g===i.RGB&&(D===i.UNSIGNED_INT_5_9_9_9_REV&&(X=i.RGB9_E5),D===i.UNSIGNED_INT_10F_11F_11F_REV&&(X=i.R11F_G11F_B10F)),g===i.RGBA){let Rt=$?_r:te.getTransfer(W);D===i.FLOAT&&(X=i.RGBA32F),D===i.HALF_FLOAT&&(X=i.RGBA16F),D===i.UNSIGNED_BYTE&&(X=Rt===ne?i.SRGB8_ALPHA8:i.RGBA8),D===i.UNSIGNED_SHORT_4_4_4_4&&(X=i.RGBA4),D===i.UNSIGNED_SHORT_5_5_5_1&&(X=i.RGB5_A1)}return(X===i.R16F||X===i.R32F||X===i.RG16F||X===i.RG32F||X===i.RGBA16F||X===i.RGBA32F)&&t.get("EXT_color_buffer_float"),X}function M(S,g){let D;return S?g===null||g===sn||g===tr?D=i.DEPTH24_STENCIL8:g===an?D=i.DEPTH32F_STENCIL8:g===ji&&(D=i.DEPTH24_STENCIL8,Vt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):g===null||g===sn||g===tr?D=i.DEPTH_COMPONENT24:g===an?D=i.DEPTH_COMPONENT32F:g===ji&&(D=i.DEPTH_COMPONENT16),D}function A(S,g){return m(S)===!0||S.isFramebufferTexture&&S.minFilter!==Te&&S.minFilter!==Ce?Math.log2(Math.max(g.width,g.height))+1:S.mipmaps!==void 0&&S.mipmaps.length>0?S.mipmaps.length:S.isCompressedTexture&&Array.isArray(S.image)?g.mipmaps.length:1}function C(S){let g=S.target;g.removeEventListener("dispose",C),N(g),g.isVideoTexture&&h.delete(g)}function R(S){let g=S.target;g.removeEventListener("dispose",R),b(g)}function N(S){let g=n.get(S);if(g.__webglInit===void 0)return;let D=S.source,W=u.get(D);if(W){let $=W[g.__cacheKey];$.usedTimes--,$.usedTimes===0&&v(S),Object.keys(W).length===0&&u.delete(D)}n.remove(S)}function v(S){let g=n.get(S);i.deleteTexture(g.__webglTexture);let D=S.source,W=u.get(D);delete W[g.__cacheKey],a.memory.textures--}function b(S){let g=n.get(S);if(S.depthTexture&&(S.depthTexture.dispose(),n.remove(S.depthTexture)),S.isWebGLCubeRenderTarget)for(let W=0;W<6;W++){if(Array.isArray(g.__webglFramebuffer[W]))for(let $=0;$<g.__webglFramebuffer[W].length;$++)i.deleteFramebuffer(g.__webglFramebuffer[W][$]);else i.deleteFramebuffer(g.__webglFramebuffer[W]);g.__webglDepthbuffer&&i.deleteRenderbuffer(g.__webglDepthbuffer[W])}else{if(Array.isArray(g.__webglFramebuffer))for(let W=0;W<g.__webglFramebuffer.length;W++)i.deleteFramebuffer(g.__webglFramebuffer[W]);else i.deleteFramebuffer(g.__webglFramebuffer);if(g.__webglDepthbuffer&&i.deleteRenderbuffer(g.__webglDepthbuffer),g.__webglMultisampledFramebuffer&&i.deleteFramebuffer(g.__webglMultisampledFramebuffer),g.__webglColorRenderbuffer)for(let W=0;W<g.__webglColorRenderbuffer.length;W++)g.__webglColorRenderbuffer[W]&&i.deleteRenderbuffer(g.__webglColorRenderbuffer[W]);g.__webglDepthRenderbuffer&&i.deleteRenderbuffer(g.__webglDepthRenderbuffer)}let D=S.textures;for(let W=0,$=D.length;W<$;W++){let X=n.get(D[W]);X.__webglTexture&&(i.deleteTexture(X.__webglTexture),a.memory.textures--),n.remove(D[W])}n.remove(S)}let I=0;function k(){I=0}function O(){let S=I;return S>=r.maxTextures&&Vt("WebGLTextures: Trying to use "+S+" texture units while this GPU supports only "+r.maxTextures),I+=1,S}function Y(S){let g=[];return g.push(S.wrapS),g.push(S.wrapT),g.push(S.wrapR||0),g.push(S.magFilter),g.push(S.minFilter),g.push(S.anisotropy),g.push(S.internalFormat),g.push(S.format),g.push(S.type),g.push(S.generateMipmaps),g.push(S.premultiplyAlpha),g.push(S.flipY),g.push(S.unpackAlignment),g.push(S.colorSpace),g.join()}function G(S,g){let D=n.get(S);if(S.isVideoTexture&&bt(S),S.isRenderTargetTexture===!1&&S.isExternalTexture!==!0&&S.version>0&&D.__version!==S.version){let W=S.image;if(W===null)Vt("WebGLRenderer: Texture marked for update but no image data found.");else if(W.complete===!1)Vt("WebGLRenderer: Texture marked for update but image is incomplete");else{Z(D,S,g);return}}else S.isExternalTexture&&(D.__webglTexture=S.sourceTexture?S.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,D.__webglTexture,i.TEXTURE0+g)}function H(S,g){let D=n.get(S);if(S.isRenderTargetTexture===!1&&S.version>0&&D.__version!==S.version){Z(D,S,g);return}else S.isExternalTexture&&(D.__webglTexture=S.sourceTexture?S.sourceTexture:null);e.bindTexture(i.TEXTURE_2D_ARRAY,D.__webglTexture,i.TEXTURE0+g)}function B(S,g){let D=n.get(S);if(S.isRenderTargetTexture===!1&&S.version>0&&D.__version!==S.version){Z(D,S,g);return}e.bindTexture(i.TEXTURE_3D,D.__webglTexture,i.TEXTURE0+g)}function tt(S,g){let D=n.get(S);if(S.isCubeDepthTexture!==!0&&S.version>0&&D.__version!==S.version){et(D,S,g);return}e.bindTexture(i.TEXTURE_CUBE_MAP,D.__webglTexture,i.TEXTURE0+g)}let mt={[Ps]:i.REPEAT,[dn]:i.CLAMP_TO_EDGE,[Ds]:i.MIRRORED_REPEAT},ct={[Te]:i.NEAREST,[gh]:i.NEAREST_MIPMAP_NEAREST,[Yr]:i.NEAREST_MIPMAP_LINEAR,[Ce]:i.LINEAR,[ma]:i.LINEAR_MIPMAP_NEAREST,[Jn]:i.LINEAR_MIPMAP_LINEAR},ut={[vh]:i.NEVER,[wh]:i.ALWAYS,[yh]:i.LESS,[to]:i.LEQUAL,[bh]:i.EQUAL,[eo]:i.GEQUAL,[Sh]:i.GREATER,[Mh]:i.NOTEQUAL};function Wt(S,g){if(g.type===an&&t.has("OES_texture_float_linear")===!1&&(g.magFilter===Ce||g.magFilter===ma||g.magFilter===Yr||g.magFilter===Jn||g.minFilter===Ce||g.minFilter===ma||g.minFilter===Yr||g.minFilter===Jn)&&Vt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(S,i.TEXTURE_WRAP_S,mt[g.wrapS]),i.texParameteri(S,i.TEXTURE_WRAP_T,mt[g.wrapT]),(S===i.TEXTURE_3D||S===i.TEXTURE_2D_ARRAY)&&i.texParameteri(S,i.TEXTURE_WRAP_R,mt[g.wrapR]),i.texParameteri(S,i.TEXTURE_MAG_FILTER,ct[g.magFilter]),i.texParameteri(S,i.TEXTURE_MIN_FILTER,ct[g.minFilter]),g.compareFunction&&(i.texParameteri(S,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(S,i.TEXTURE_COMPARE_FUNC,ut[g.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(g.magFilter===Te||g.minFilter!==Yr&&g.minFilter!==Jn||g.type===an&&t.has("OES_texture_float_linear")===!1)return;if(g.anisotropy>1||n.get(g).__currentAnisotropy){let D=t.get("EXT_texture_filter_anisotropic");i.texParameterf(S,D.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(g.anisotropy,r.getMaxAnisotropy())),n.get(g).__currentAnisotropy=g.anisotropy}}}function Gt(S,g){let D=!1;S.__webglInit===void 0&&(S.__webglInit=!0,g.addEventListener("dispose",C));let W=g.source,$=u.get(W);$===void 0&&($={},u.set(W,$));let X=Y(g);if(X!==S.__cacheKey){$[X]===void 0&&($[X]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,D=!0),$[X].usedTimes++;let Rt=$[S.__cacheKey];Rt!==void 0&&($[S.__cacheKey].usedTimes--,Rt.usedTimes===0&&v(g)),S.__cacheKey=X,S.__webglTexture=$[X].texture}return D}function se(S,g,D){return Math.floor(Math.floor(S/D)/g)}function ae(S,g,D,W){let X=S.updateRanges;if(X.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,g.width,g.height,D,W,g.data);else{X.sort((nt,ft)=>nt.start-ft.start);let Rt=0;for(let nt=1;nt<X.length;nt++){let ft=X[Rt],Ct=X[nt],It=ft.start+ft.count,dt=se(Ct.start,g.width,4),Zt=se(ft.start,g.width,4);Ct.start<=It+1&&dt===Zt&&se(Ct.start+Ct.count-1,g.width,4)===dt?ft.count=Math.max(ft.count,Ct.start+Ct.count-ft.start):(++Rt,X[Rt]=Ct)}X.length=Rt+1;let lt=i.getParameter(i.UNPACK_ROW_LENGTH),At=i.getParameter(i.UNPACK_SKIP_PIXELS),Bt=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,g.width);for(let nt=0,ft=X.length;nt<ft;nt++){let Ct=X[nt],It=Math.floor(Ct.start/4),dt=Math.ceil(Ct.count/4),Zt=It%g.width,P=Math.floor(It/g.width),yt=dt,at=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Zt),i.pixelStorei(i.UNPACK_SKIP_ROWS,P),e.texSubImage2D(i.TEXTURE_2D,0,Zt,P,yt,at,D,W,g.data)}S.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,lt),i.pixelStorei(i.UNPACK_SKIP_PIXELS,At),i.pixelStorei(i.UNPACK_SKIP_ROWS,Bt)}}function Z(S,g,D){let W=i.TEXTURE_2D;(g.isDataArrayTexture||g.isCompressedArrayTexture)&&(W=i.TEXTURE_2D_ARRAY),g.isData3DTexture&&(W=i.TEXTURE_3D);let $=Gt(S,g),X=g.source;e.bindTexture(W,S.__webglTexture,i.TEXTURE0+D);let Rt=n.get(X);if(X.version!==Rt.__version||$===!0){e.activeTexture(i.TEXTURE0+D);let lt=te.getPrimaries(te.workingColorSpace),At=g.colorSpace===In?null:te.getPrimaries(g.colorSpace),Bt=g.colorSpace===In||lt===At?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Bt);let nt=_(g.image,!1,r.maxTextureSize);nt=Ot(g,nt);let ft=s.convert(g.format,g.colorSpace),Ct=s.convert(g.type),It=w(g.internalFormat,ft,Ct,g.colorSpace,g.isVideoTexture);Wt(W,g);let dt,Zt=g.mipmaps,P=g.isVideoTexture!==!0,yt=Rt.__version===void 0||$===!0,at=X.dataReady,St=A(g,nt);if(g.isDepthTexture)It=M(g.format===$n,g.type),yt&&(P?e.texStorage2D(i.TEXTURE_2D,1,It,nt.width,nt.height):e.texImage2D(i.TEXTURE_2D,0,It,nt.width,nt.height,0,ft,Ct,null));else if(g.isDataTexture)if(Zt.length>0){P&&yt&&e.texStorage2D(i.TEXTURE_2D,St,It,Zt[0].width,Zt[0].height);for(let rt=0,K=Zt.length;rt<K;rt++)dt=Zt[rt],P?at&&e.texSubImage2D(i.TEXTURE_2D,rt,0,0,dt.width,dt.height,ft,Ct,dt.data):e.texImage2D(i.TEXTURE_2D,rt,It,dt.width,dt.height,0,ft,Ct,dt.data);g.generateMipmaps=!1}else P?(yt&&e.texStorage2D(i.TEXTURE_2D,St,It,nt.width,nt.height),at&&ae(g,nt,ft,Ct)):e.texImage2D(i.TEXTURE_2D,0,It,nt.width,nt.height,0,ft,Ct,nt.data);else if(g.isCompressedTexture)if(g.isCompressedArrayTexture){P&&yt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,St,It,Zt[0].width,Zt[0].height,nt.depth);for(let rt=0,K=Zt.length;rt<K;rt++)if(dt=Zt[rt],g.format!==Ke)if(ft!==null)if(P){if(at)if(g.layerUpdates.size>0){let ht=Il(dt.width,dt.height,g.format,g.type);for(let Ht of g.layerUpdates){let de=dt.data.subarray(Ht*ht/dt.data.BYTES_PER_ELEMENT,(Ht+1)*ht/dt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,rt,0,0,Ht,dt.width,dt.height,1,ft,de)}g.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,rt,0,0,0,dt.width,dt.height,nt.depth,ft,dt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,rt,It,dt.width,dt.height,nt.depth,0,dt.data,0,0);else Vt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else P?at&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,rt,0,0,0,dt.width,dt.height,nt.depth,ft,Ct,dt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,rt,It,dt.width,dt.height,nt.depth,0,ft,Ct,dt.data)}else{P&&yt&&e.texStorage2D(i.TEXTURE_2D,St,It,Zt[0].width,Zt[0].height);for(let rt=0,K=Zt.length;rt<K;rt++)dt=Zt[rt],g.format!==Ke?ft!==null?P?at&&e.compressedTexSubImage2D(i.TEXTURE_2D,rt,0,0,dt.width,dt.height,ft,dt.data):e.compressedTexImage2D(i.TEXTURE_2D,rt,It,dt.width,dt.height,0,dt.data):Vt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):P?at&&e.texSubImage2D(i.TEXTURE_2D,rt,0,0,dt.width,dt.height,ft,Ct,dt.data):e.texImage2D(i.TEXTURE_2D,rt,It,dt.width,dt.height,0,ft,Ct,dt.data)}else if(g.isDataArrayTexture)if(P){if(yt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,St,It,nt.width,nt.height,nt.depth),at)if(g.layerUpdates.size>0){let rt=Il(nt.width,nt.height,g.format,g.type);for(let K of g.layerUpdates){let ht=nt.data.subarray(K*rt/nt.data.BYTES_PER_ELEMENT,(K+1)*rt/nt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,K,nt.width,nt.height,1,ft,Ct,ht)}g.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,nt.width,nt.height,nt.depth,ft,Ct,nt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,It,nt.width,nt.height,nt.depth,0,ft,Ct,nt.data);else if(g.isData3DTexture)P?(yt&&e.texStorage3D(i.TEXTURE_3D,St,It,nt.width,nt.height,nt.depth),at&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,nt.width,nt.height,nt.depth,ft,Ct,nt.data)):e.texImage3D(i.TEXTURE_3D,0,It,nt.width,nt.height,nt.depth,0,ft,Ct,nt.data);else if(g.isFramebufferTexture){if(yt)if(P)e.texStorage2D(i.TEXTURE_2D,St,It,nt.width,nt.height);else{let rt=nt.width,K=nt.height;for(let ht=0;ht<St;ht++)e.texImage2D(i.TEXTURE_2D,ht,It,rt,K,0,ft,Ct,null),rt>>=1,K>>=1}}else if(Zt.length>0){if(P&&yt){let rt=ot(Zt[0]);e.texStorage2D(i.TEXTURE_2D,St,It,rt.width,rt.height)}for(let rt=0,K=Zt.length;rt<K;rt++)dt=Zt[rt],P?at&&e.texSubImage2D(i.TEXTURE_2D,rt,0,0,ft,Ct,dt):e.texImage2D(i.TEXTURE_2D,rt,It,ft,Ct,dt);g.generateMipmaps=!1}else if(P){if(yt){let rt=ot(nt);e.texStorage2D(i.TEXTURE_2D,St,It,rt.width,rt.height)}at&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,ft,Ct,nt)}else e.texImage2D(i.TEXTURE_2D,0,It,ft,Ct,nt);m(g)&&f(W),Rt.__version=X.version,g.onUpdate&&g.onUpdate(g)}S.__version=g.version}function et(S,g,D){if(g.image.length!==6)return;let W=Gt(S,g),$=g.source;e.bindTexture(i.TEXTURE_CUBE_MAP,S.__webglTexture,i.TEXTURE0+D);let X=n.get($);if($.version!==X.__version||W===!0){e.activeTexture(i.TEXTURE0+D);let Rt=te.getPrimaries(te.workingColorSpace),lt=g.colorSpace===In?null:te.getPrimaries(g.colorSpace),At=g.colorSpace===In||Rt===lt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,At);let Bt=g.isCompressedTexture||g.image[0].isCompressedTexture,nt=g.image[0]&&g.image[0].isDataTexture,ft=[];for(let K=0;K<6;K++)!Bt&&!nt?ft[K]=_(g.image[K],!0,r.maxCubemapSize):ft[K]=nt?g.image[K].image:g.image[K],ft[K]=Ot(g,ft[K]);let Ct=ft[0],It=s.convert(g.format,g.colorSpace),dt=s.convert(g.type),Zt=w(g.internalFormat,It,dt,g.colorSpace),P=g.isVideoTexture!==!0,yt=X.__version===void 0||W===!0,at=$.dataReady,St=A(g,Ct);Wt(i.TEXTURE_CUBE_MAP,g);let rt;if(Bt){P&&yt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,St,Zt,Ct.width,Ct.height);for(let K=0;K<6;K++){rt=ft[K].mipmaps;for(let ht=0;ht<rt.length;ht++){let Ht=rt[ht];g.format!==Ke?It!==null?P?at&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ht,0,0,Ht.width,Ht.height,It,Ht.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ht,Zt,Ht.width,Ht.height,0,Ht.data):Vt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):P?at&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ht,0,0,Ht.width,Ht.height,It,dt,Ht.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ht,Zt,Ht.width,Ht.height,0,It,dt,Ht.data)}}}else{if(rt=g.mipmaps,P&&yt){rt.length>0&&St++;let K=ot(ft[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,St,Zt,K.width,K.height)}for(let K=0;K<6;K++)if(nt){P?at&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,ft[K].width,ft[K].height,It,dt,ft[K].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Zt,ft[K].width,ft[K].height,0,It,dt,ft[K].data);for(let ht=0;ht<rt.length;ht++){let de=rt[ht].image[K].image;P?at&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ht+1,0,0,de.width,de.height,It,dt,de.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ht+1,Zt,de.width,de.height,0,It,dt,de.data)}}else{P?at&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,It,dt,ft[K]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Zt,It,dt,ft[K]);for(let ht=0;ht<rt.length;ht++){let Ht=rt[ht];P?at&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ht+1,0,0,It,dt,Ht.image[K]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ht+1,Zt,It,dt,Ht.image[K])}}}m(g)&&f(i.TEXTURE_CUBE_MAP),X.__version=$.version,g.onUpdate&&g.onUpdate(g)}S.__version=g.version}function Mt(S,g,D,W,$,X){let Rt=s.convert(D.format,D.colorSpace),lt=s.convert(D.type),At=w(D.internalFormat,Rt,lt,D.colorSpace),Bt=n.get(g),nt=n.get(D);if(nt.__renderTarget=g,!Bt.__hasExternalTextures){let ft=Math.max(1,g.width>>X),Ct=Math.max(1,g.height>>X);$===i.TEXTURE_3D||$===i.TEXTURE_2D_ARRAY?e.texImage3D($,X,At,ft,Ct,g.depth,0,Rt,lt,null):e.texImage2D($,X,At,ft,Ct,0,Rt,lt,null)}e.bindFramebuffer(i.FRAMEBUFFER,S),Lt(g)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,W,$,nt.__webglTexture,0,E(g)):($===i.TEXTURE_2D||$>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&$<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,W,$,nt.__webglTexture,X),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Ut(S,g,D){if(i.bindRenderbuffer(i.RENDERBUFFER,S),g.depthBuffer){let W=g.depthTexture,$=W&&W.isDepthTexture?W.type:null,X=M(g.stencilBuffer,$),Rt=g.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;Lt(g)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,E(g),X,g.width,g.height):D?i.renderbufferStorageMultisample(i.RENDERBUFFER,E(g),X,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,X,g.width,g.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Rt,i.RENDERBUFFER,S)}else{let W=g.textures;for(let $=0;$<W.length;$++){let X=W[$],Rt=s.convert(X.format,X.colorSpace),lt=s.convert(X.type),At=w(X.internalFormat,Rt,lt,X.colorSpace);Lt(g)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,E(g),At,g.width,g.height):D?i.renderbufferStorageMultisample(i.RENDERBUFFER,E(g),At,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,At,g.width,g.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Et(S,g,D){let W=g.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(i.FRAMEBUFFER,S),!(g.depthTexture&&g.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let $=n.get(g.depthTexture);if($.__renderTarget=g,(!$.__webglTexture||g.depthTexture.image.width!==g.width||g.depthTexture.image.height!==g.height)&&(g.depthTexture.image.width=g.width,g.depthTexture.image.height=g.height,g.depthTexture.needsUpdate=!0),W){if($.__webglInit===void 0&&($.__webglInit=!0,g.depthTexture.addEventListener("dispose",C)),$.__webglTexture===void 0){$.__webglTexture=i.createTexture(),e.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),Wt(i.TEXTURE_CUBE_MAP,g.depthTexture);let Bt=s.convert(g.depthTexture.format),nt=s.convert(g.depthTexture.type),ft;g.depthTexture.format===un?ft=i.DEPTH_COMPONENT24:g.depthTexture.format===$n&&(ft=i.DEPTH24_STENCIL8);for(let Ct=0;Ct<6;Ct++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ct,0,ft,g.width,g.height,0,Bt,nt,null)}}else G(g.depthTexture,0);let X=$.__webglTexture,Rt=E(g),lt=W?i.TEXTURE_CUBE_MAP_POSITIVE_X+D:i.TEXTURE_2D,At=g.depthTexture.format===$n?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(g.depthTexture.format===un)Lt(g)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,At,lt,X,0,Rt):i.framebufferTexture2D(i.FRAMEBUFFER,At,lt,X,0);else if(g.depthTexture.format===$n)Lt(g)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,At,lt,X,0,Rt):i.framebufferTexture2D(i.FRAMEBUFFER,At,lt,X,0);else throw new Error("Unknown depthTexture format")}function jt(S){let g=n.get(S),D=S.isWebGLCubeRenderTarget===!0;if(g.__boundDepthTexture!==S.depthTexture){let W=S.depthTexture;if(g.__depthDisposeCallback&&g.__depthDisposeCallback(),W){let $=()=>{delete g.__boundDepthTexture,delete g.__depthDisposeCallback,W.removeEventListener("dispose",$)};W.addEventListener("dispose",$),g.__depthDisposeCallback=$}g.__boundDepthTexture=W}if(S.depthTexture&&!g.__autoAllocateDepthBuffer)if(D)for(let W=0;W<6;W++)Et(g.__webglFramebuffer[W],S,W);else{let W=S.texture.mipmaps;W&&W.length>0?Et(g.__webglFramebuffer[0],S,0):Et(g.__webglFramebuffer,S,0)}else if(D){g.__webglDepthbuffer=[];for(let W=0;W<6;W++)if(e.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer[W]),g.__webglDepthbuffer[W]===void 0)g.__webglDepthbuffer[W]=i.createRenderbuffer(),Ut(g.__webglDepthbuffer[W],S,!1);else{let $=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,X=g.__webglDepthbuffer[W];i.bindRenderbuffer(i.RENDERBUFFER,X),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,X)}}else{let W=S.texture.mipmaps;if(W&&W.length>0?e.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer),g.__webglDepthbuffer===void 0)g.__webglDepthbuffer=i.createRenderbuffer(),Ut(g.__webglDepthbuffer,S,!1);else{let $=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,X=g.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,X),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,X)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function oe(S,g,D){let W=n.get(S);g!==void 0&&Mt(W.__webglFramebuffer,S,S.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),D!==void 0&&jt(S)}function Xt(S){let g=S.texture,D=n.get(S),W=n.get(g);S.addEventListener("dispose",R);let $=S.textures,X=S.isWebGLCubeRenderTarget===!0,Rt=$.length>1;if(Rt||(W.__webglTexture===void 0&&(W.__webglTexture=i.createTexture()),W.__version=g.version,a.memory.textures++),X){D.__webglFramebuffer=[];for(let lt=0;lt<6;lt++)if(g.mipmaps&&g.mipmaps.length>0){D.__webglFramebuffer[lt]=[];for(let At=0;At<g.mipmaps.length;At++)D.__webglFramebuffer[lt][At]=i.createFramebuffer()}else D.__webglFramebuffer[lt]=i.createFramebuffer()}else{if(g.mipmaps&&g.mipmaps.length>0){D.__webglFramebuffer=[];for(let lt=0;lt<g.mipmaps.length;lt++)D.__webglFramebuffer[lt]=i.createFramebuffer()}else D.__webglFramebuffer=i.createFramebuffer();if(Rt)for(let lt=0,At=$.length;lt<At;lt++){let Bt=n.get($[lt]);Bt.__webglTexture===void 0&&(Bt.__webglTexture=i.createTexture(),a.memory.textures++)}if(S.samples>0&&Lt(S)===!1){D.__webglMultisampledFramebuffer=i.createFramebuffer(),D.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,D.__webglMultisampledFramebuffer);for(let lt=0;lt<$.length;lt++){let At=$[lt];D.__webglColorRenderbuffer[lt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,D.__webglColorRenderbuffer[lt]);let Bt=s.convert(At.format,At.colorSpace),nt=s.convert(At.type),ft=w(At.internalFormat,Bt,nt,At.colorSpace,S.isXRRenderTarget===!0),Ct=E(S);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ct,ft,S.width,S.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+lt,i.RENDERBUFFER,D.__webglColorRenderbuffer[lt])}i.bindRenderbuffer(i.RENDERBUFFER,null),S.depthBuffer&&(D.__webglDepthRenderbuffer=i.createRenderbuffer(),Ut(D.__webglDepthRenderbuffer,S,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(X){e.bindTexture(i.TEXTURE_CUBE_MAP,W.__webglTexture),Wt(i.TEXTURE_CUBE_MAP,g);for(let lt=0;lt<6;lt++)if(g.mipmaps&&g.mipmaps.length>0)for(let At=0;At<g.mipmaps.length;At++)Mt(D.__webglFramebuffer[lt][At],S,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,At);else Mt(D.__webglFramebuffer[lt],S,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0);m(g)&&f(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Rt){for(let lt=0,At=$.length;lt<At;lt++){let Bt=$[lt],nt=n.get(Bt),ft=i.TEXTURE_2D;(S.isWebGL3DRenderTarget||S.isWebGLArrayRenderTarget)&&(ft=S.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ft,nt.__webglTexture),Wt(ft,Bt),Mt(D.__webglFramebuffer,S,Bt,i.COLOR_ATTACHMENT0+lt,ft,0),m(Bt)&&f(ft)}e.unbindTexture()}else{let lt=i.TEXTURE_2D;if((S.isWebGL3DRenderTarget||S.isWebGLArrayRenderTarget)&&(lt=S.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(lt,W.__webglTexture),Wt(lt,g),g.mipmaps&&g.mipmaps.length>0)for(let At=0;At<g.mipmaps.length;At++)Mt(D.__webglFramebuffer[At],S,g,i.COLOR_ATTACHMENT0,lt,At);else Mt(D.__webglFramebuffer,S,g,i.COLOR_ATTACHMENT0,lt,0);m(g)&&f(lt),e.unbindTexture()}S.depthBuffer&&jt(S)}function Q(S){let g=S.textures;for(let D=0,W=g.length;D<W;D++){let $=g[D];if(m($)){let X=T(S),Rt=n.get($).__webglTexture;e.bindTexture(X,Rt),f(X),e.unbindTexture()}}}let it=[],j=[];function xt(S){if(S.samples>0){if(Lt(S)===!1){let g=S.textures,D=S.width,W=S.height,$=i.COLOR_BUFFER_BIT,X=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Rt=n.get(S),lt=g.length>1;if(lt)for(let Bt=0;Bt<g.length;Bt++)e.bindFramebuffer(i.FRAMEBUFFER,Rt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Bt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Rt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Bt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Rt.__webglMultisampledFramebuffer);let At=S.texture.mipmaps;At&&At.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Rt.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Rt.__webglFramebuffer);for(let Bt=0;Bt<g.length;Bt++){if(S.resolveDepthBuffer&&(S.depthBuffer&&($|=i.DEPTH_BUFFER_BIT),S.stencilBuffer&&S.resolveStencilBuffer&&($|=i.STENCIL_BUFFER_BIT)),lt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Rt.__webglColorRenderbuffer[Bt]);let nt=n.get(g[Bt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,nt,0)}i.blitFramebuffer(0,0,D,W,0,0,D,W,$,i.NEAREST),l===!0&&(it.length=0,j.length=0,it.push(i.COLOR_ATTACHMENT0+Bt),S.depthBuffer&&S.resolveDepthBuffer===!1&&(it.push(X),j.push(X),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,j)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,it))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),lt)for(let Bt=0;Bt<g.length;Bt++){e.bindFramebuffer(i.FRAMEBUFFER,Rt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Bt,i.RENDERBUFFER,Rt.__webglColorRenderbuffer[Bt]);let nt=n.get(g[Bt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Rt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Bt,i.TEXTURE_2D,nt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Rt.__webglMultisampledFramebuffer)}else if(S.depthBuffer&&S.resolveDepthBuffer===!1&&l){let g=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[g])}}}function E(S){return Math.min(r.maxSamples,S.samples)}function Lt(S){let g=n.get(S);return S.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&g.__useRenderToTexture!==!1}function bt(S){let g=a.render.frame;h.get(S)!==g&&(h.set(S,g),S.update())}function Ot(S,g){let D=S.colorSpace,W=S.format,$=S.type;return S.isCompressedTexture===!0||S.isVideoTexture===!0||D!==ci&&D!==In&&(te.getTransfer(D)===ne?(W!==Ke||$!==Be)&&Vt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):kt("WebGLTextures: Unsupported texture color space:",D)),g}function ot(S){return typeof HTMLImageElement<"u"&&S instanceof HTMLImageElement?(c.width=S.naturalWidth||S.width,c.height=S.naturalHeight||S.height):typeof VideoFrame<"u"&&S instanceof VideoFrame?(c.width=S.displayWidth,c.height=S.displayHeight):(c.width=S.width,c.height=S.height),c}this.allocateTextureUnit=O,this.resetTextureUnits=k,this.setTexture2D=G,this.setTexture2DArray=H,this.setTexture3D=B,this.setTextureCube=tt,this.rebindTextures=oe,this.setupRenderTarget=Xt,this.updateRenderTargetMipmap=Q,this.updateMultisampleRenderTarget=xt,this.setupDepthRenderbuffer=jt,this.setupFrameBufferTexture=Mt,this.useMultisampledRTT=Lt,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function j0(i,t){function e(n,r=In){let s,a=te.getTransfer(r);if(n===Be)return i.UNSIGNED_BYTE;if(n===xa)return i.UNSIGNED_SHORT_4_4_4_4;if(n===_a)return i.UNSIGNED_SHORT_5_5_5_1;if(n===xl)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===_l)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===ml)return i.BYTE;if(n===gl)return i.SHORT;if(n===ji)return i.UNSIGNED_SHORT;if(n===ga)return i.INT;if(n===sn)return i.UNSIGNED_INT;if(n===an)return i.FLOAT;if(n===mn)return i.HALF_FLOAT;if(n===vl)return i.ALPHA;if(n===yl)return i.RGB;if(n===Ke)return i.RGBA;if(n===un)return i.DEPTH_COMPONENT;if(n===$n)return i.DEPTH_STENCIL;if(n===bl)return i.RED;if(n===va)return i.RED_INTEGER;if(n===xi)return i.RG;if(n===ya)return i.RG_INTEGER;if(n===ba)return i.RGBA_INTEGER;if(n===qr||n===Zr||n===Jr||n===$r)if(a===ne)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===qr)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Zr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Jr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===$r)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===qr)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Zr)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Jr)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===$r)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Sa||n===Ma||n===wa||n===Ea)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===Sa)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ma)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===wa)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ea)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ta||n===Aa||n===Ca||n===Ra||n===Ia||n===Pa||n===Da)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(n===Ta||n===Aa)return a===ne?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===Ca)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(n===Ra)return s.COMPRESSED_R11_EAC;if(n===Ia)return s.COMPRESSED_SIGNED_R11_EAC;if(n===Pa)return s.COMPRESSED_RG11_EAC;if(n===Da)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===La||n===Fa||n===Na||n===Ua||n===Oa||n===Ba||n===ka||n===za||n===Va||n===Ga||n===Ha||n===Wa||n===Xa||n===Ya)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(n===La)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Fa)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Na)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ua)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Oa)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ba)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ka)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===za)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Va)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ga)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ha)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Wa)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Xa)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ya)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===qa||n===Za||n===Ja)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(n===qa)return a===ne?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Za)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ja)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===$a||n===Ka||n===Qa||n===ja)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(n===$a)return s.COMPRESSED_RED_RGTC1_EXT;if(n===Ka)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Qa)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ja)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===tr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}var tg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,eg=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Wl=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new Rr(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new Xe({vertexShader:tg,fragmentShader:eg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new be(new zr(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Xl=class extends Tn{constructor(t,e){super();let n=this,r=null,s=1,a=null,o="local-floor",l=1,c=null,h=null,d=null,u=null,p=null,x=null,_=typeof XRWebGLBinding<"u",m=new Wl,f={},T=e.getContextAttributes(),w=null,M=null,A=[],C=[],R=new _t,N=null,v=new Ee;v.viewport=new me;let b=new Ee;b.viewport=new me;let I=[v,b],k=new ra,O=null,Y=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let et=A[Z];return et===void 0&&(et=new zi,A[Z]=et),et.getTargetRaySpace()},this.getControllerGrip=function(Z){let et=A[Z];return et===void 0&&(et=new zi,A[Z]=et),et.getGripSpace()},this.getHand=function(Z){let et=A[Z];return et===void 0&&(et=new zi,A[Z]=et),et.getHandSpace()};function G(Z){let et=C.indexOf(Z.inputSource);if(et===-1)return;let Mt=A[et];Mt!==void 0&&(Mt.update(Z.inputSource,Z.frame,c||a),Mt.dispatchEvent({type:Z.type,data:Z.inputSource}))}function H(){r.removeEventListener("select",G),r.removeEventListener("selectstart",G),r.removeEventListener("selectend",G),r.removeEventListener("squeeze",G),r.removeEventListener("squeezestart",G),r.removeEventListener("squeezeend",G),r.removeEventListener("end",H),r.removeEventListener("inputsourceschange",B);for(let Z=0;Z<A.length;Z++){let et=C[Z];et!==null&&(C[Z]=null,A[Z].disconnect(et))}O=null,Y=null,m.reset();for(let Z in f)delete f[Z];t.setRenderTarget(w),p=null,u=null,d=null,r=null,M=null,ae.stop(),n.isPresenting=!1,t.setPixelRatio(N),t.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){s=Z,n.isPresenting===!0&&Vt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){o=Z,n.isPresenting===!0&&Vt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return u!==null?u:p},this.getBinding=function(){return d===null&&_&&(d=new XRWebGLBinding(r,e)),d},this.getFrame=function(){return x},this.getSession=function(){return r},this.setSession=function(Z){return is(this,null,function*(){if(r=Z,r!==null){if(w=t.getRenderTarget(),r.addEventListener("select",G),r.addEventListener("selectstart",G),r.addEventListener("selectend",G),r.addEventListener("squeeze",G),r.addEventListener("squeezestart",G),r.addEventListener("squeezeend",G),r.addEventListener("end",H),r.addEventListener("inputsourceschange",B),T.xrCompatible!==!0&&(yield e.makeXRCompatible()),N=t.getPixelRatio(),t.getSize(R),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let Mt=null,Ut=null,Et=null;T.depth&&(Et=T.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Mt=T.stencil?$n:un,Ut=T.stencil?tr:sn);let jt={colorFormat:e.RGBA8,depthFormat:Et,scaleFactor:s};d=this.getBinding(),u=d.createProjectionLayer(jt),r.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),M=new We(u.textureWidth,u.textureHeight,{format:Ke,type:Be,depthTexture:new Xn(u.textureWidth,u.textureHeight,Ut,void 0,void 0,void 0,void 0,void 0,void 0,Mt),stencilBuffer:T.stencil,colorSpace:t.outputColorSpace,samples:T.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{let Mt={antialias:T.antialias,alpha:!0,depth:T.depth,stencil:T.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,e,Mt),r.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),M=new We(p.framebufferWidth,p.framebufferHeight,{format:Ke,type:Be,colorSpace:t.outputColorSpace,stencilBuffer:T.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=yield r.requestReferenceSpace(o),ae.setContext(r),ae.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}})},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function B(Z){for(let et=0;et<Z.removed.length;et++){let Mt=Z.removed[et],Ut=C.indexOf(Mt);Ut>=0&&(C[Ut]=null,A[Ut].disconnect(Mt))}for(let et=0;et<Z.added.length;et++){let Mt=Z.added[et],Ut=C.indexOf(Mt);if(Ut===-1){for(let jt=0;jt<A.length;jt++)if(jt>=C.length){C.push(Mt),Ut=jt;break}else if(C[jt]===null){C[jt]=Mt,Ut=jt;break}if(Ut===-1)break}let Et=A[Ut];Et&&Et.connect(Mt)}}let tt=new L,mt=new L;function ct(Z,et,Mt){tt.setFromMatrixPosition(et.matrixWorld),mt.setFromMatrixPosition(Mt.matrixWorld);let Ut=tt.distanceTo(mt),Et=et.projectionMatrix.elements,jt=Mt.projectionMatrix.elements,oe=Et[14]/(Et[10]-1),Xt=Et[14]/(Et[10]+1),Q=(Et[9]+1)/Et[5],it=(Et[9]-1)/Et[5],j=(Et[8]-1)/Et[0],xt=(jt[8]+1)/jt[0],E=oe*j,Lt=oe*xt,bt=Ut/(-j+xt),Ot=bt*-j;if(et.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(Ot),Z.translateZ(bt),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),Et[10]===-1)Z.projectionMatrix.copy(et.projectionMatrix),Z.projectionMatrixInverse.copy(et.projectionMatrixInverse);else{let ot=oe+bt,S=Xt+bt,g=E-Ot,D=Lt+(Ut-Ot),W=Q*Xt/S*ot,$=it*Xt/S*ot;Z.projectionMatrix.makePerspective(g,D,W,$,ot,S),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function ut(Z,et){et===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(et.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(r===null)return;let et=Z.near,Mt=Z.far;m.texture!==null&&(m.depthNear>0&&(et=m.depthNear),m.depthFar>0&&(Mt=m.depthFar)),k.near=b.near=v.near=et,k.far=b.far=v.far=Mt,(O!==k.near||Y!==k.far)&&(r.updateRenderState({depthNear:k.near,depthFar:k.far}),O=k.near,Y=k.far),k.layers.mask=Z.layers.mask|6,v.layers.mask=k.layers.mask&3,b.layers.mask=k.layers.mask&5;let Ut=Z.parent,Et=k.cameras;ut(k,Ut);for(let jt=0;jt<Et.length;jt++)ut(Et[jt],Ut);Et.length===2?ct(k,v,b):k.projectionMatrix.copy(v.projectionMatrix),Wt(Z,k,Ut)};function Wt(Z,et,Mt){Mt===null?Z.matrix.copy(et.matrixWorld):(Z.matrix.copy(Mt.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(et.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(et.projectionMatrix),Z.projectionMatrixInverse.copy(et.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=Fs*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return k},this.getFoveation=function(){if(!(u===null&&p===null))return l},this.setFoveation=function(Z){l=Z,u!==null&&(u.fixedFoveation=Z),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Z)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(k)},this.getCameraTexture=function(Z){return f[Z]};let Gt=null;function se(Z,et){if(h=et.getViewerPose(c||a),x=et,h!==null){let Mt=h.views;p!==null&&(t.setRenderTargetFramebuffer(M,p.framebuffer),t.setRenderTarget(M));let Ut=!1;Mt.length!==k.cameras.length&&(k.cameras.length=0,Ut=!0);for(let Xt=0;Xt<Mt.length;Xt++){let Q=Mt[Xt],it=null;if(p!==null)it=p.getViewport(Q);else{let xt=d.getViewSubImage(u,Q);it=xt.viewport,Xt===0&&(t.setRenderTargetTextures(M,xt.colorTexture,xt.depthStencilTexture),t.setRenderTarget(M))}let j=I[Xt];j===void 0&&(j=new Ee,j.layers.enable(Xt),j.viewport=new me,I[Xt]=j),j.matrix.fromArray(Q.transform.matrix),j.matrix.decompose(j.position,j.quaternion,j.scale),j.projectionMatrix.fromArray(Q.projectionMatrix),j.projectionMatrixInverse.copy(j.projectionMatrix).invert(),j.viewport.set(it.x,it.y,it.width,it.height),Xt===0&&(k.matrix.copy(j.matrix),k.matrix.decompose(k.position,k.quaternion,k.scale)),Ut===!0&&k.cameras.push(j)}let Et=r.enabledFeatures;if(Et&&Et.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&_){d=n.getBinding();let Xt=d.getDepthInformation(Mt[0]);Xt&&Xt.isValid&&Xt.texture&&m.init(Xt,r.renderState)}if(Et&&Et.includes("camera-access")&&_){t.state.unbindTexture(),d=n.getBinding();for(let Xt=0;Xt<Mt.length;Xt++){let Q=Mt[Xt].camera;if(Q){let it=f[Q];it||(it=new Rr,f[Q]=it);let j=d.getCameraImage(Q);it.sourceTexture=j}}}}for(let Mt=0;Mt<A.length;Mt++){let Ut=C[Mt],Et=A[Mt];Ut!==null&&Et!==void 0&&Et.update(Ut,et,c||a)}Gt&&Gt(Z,et),et.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:et}),x=null}let ae=new ed;ae.setAnimationLoop(se),this.setAnimationLoop=function(Z){Gt=Z},this.dispose=function(){}}},yi=new Wn,ng=new fe;function ig(i,t){function e(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,Tl(i)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function r(m,f,T,w,M){f.isMeshBasicMaterial||f.isMeshLambertMaterial?s(m,f):f.isMeshToonMaterial?(s(m,f),d(m,f)):f.isMeshPhongMaterial?(s(m,f),h(m,f)):f.isMeshStandardMaterial?(s(m,f),u(m,f),f.isMeshPhysicalMaterial&&p(m,f,M)):f.isMeshMatcapMaterial?(s(m,f),x(m,f)):f.isMeshDepthMaterial?s(m,f):f.isMeshDistanceMaterial?(s(m,f),_(m,f)):f.isMeshNormalMaterial?s(m,f):f.isLineBasicMaterial?(a(m,f),f.isLineDashedMaterial&&o(m,f)):f.isPointsMaterial?l(m,f,T,w):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function s(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,e(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Fe&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,e(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Fe&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,e(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,e(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);let T=t.get(f),w=T.envMap,M=T.envMapRotation;w&&(m.envMap.value=w,yi.copy(M),yi.x*=-1,yi.y*=-1,yi.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(yi.y*=-1,yi.z*=-1),m.envMapRotation.value.setFromMatrix4(ng.makeRotationFromEuler(yi)),m.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,m.aoMapTransform))}function a(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform))}function o(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,T,w){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*T,m.scale.value=w*.5,f.map&&(m.map.value=f.map,e(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function d(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function u(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,T){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Fe&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=T.texture,m.transmissionSamplerSize.value.set(T.width,T.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,m.specularIntensityMapTransform))}function x(m,f){f.matcap&&(m.matcap.value=f.matcap)}function _(m,f){let T=t.get(f).light;m.referencePosition.value.setFromMatrixPosition(T.matrixWorld),m.nearDistance.value=T.shadow.camera.near,m.farDistance.value=T.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function rg(i,t,e,n){let r={},s={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(T,w){let M=w.program;n.uniformBlockBinding(T,M)}function c(T,w){let M=r[T.id];M===void 0&&(x(T),M=h(T),r[T.id]=M,T.addEventListener("dispose",m));let A=w.program;n.updateUBOMapping(T,A);let C=t.render.frame;s[T.id]!==C&&(u(T),s[T.id]=C)}function h(T){let w=d();T.__bindingPointIndex=w;let M=i.createBuffer(),A=T.__size,C=T.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,A,C),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,w,M),M}function d(){for(let T=0;T<o;T++)if(a.indexOf(T)===-1)return a.push(T),T;return kt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(T){let w=r[T.id],M=T.uniforms,A=T.__cache;i.bindBuffer(i.UNIFORM_BUFFER,w);for(let C=0,R=M.length;C<R;C++){let N=Array.isArray(M[C])?M[C]:[M[C]];for(let v=0,b=N.length;v<b;v++){let I=N[v];if(p(I,C,v,A)===!0){let k=I.__offset,O=Array.isArray(I.value)?I.value:[I.value],Y=0;for(let G=0;G<O.length;G++){let H=O[G],B=_(H);typeof H=="number"||typeof H=="boolean"?(I.__data[0]=H,i.bufferSubData(i.UNIFORM_BUFFER,k+Y,I.__data)):H.isMatrix3?(I.__data[0]=H.elements[0],I.__data[1]=H.elements[1],I.__data[2]=H.elements[2],I.__data[3]=0,I.__data[4]=H.elements[3],I.__data[5]=H.elements[4],I.__data[6]=H.elements[5],I.__data[7]=0,I.__data[8]=H.elements[6],I.__data[9]=H.elements[7],I.__data[10]=H.elements[8],I.__data[11]=0):(H.toArray(I.__data,Y),Y+=B.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,k,I.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(T,w,M,A){let C=T.value,R=w+"_"+M;if(A[R]===void 0)return typeof C=="number"||typeof C=="boolean"?A[R]=C:A[R]=C.clone(),!0;{let N=A[R];if(typeof C=="number"||typeof C=="boolean"){if(N!==C)return A[R]=C,!0}else if(N.equals(C)===!1)return N.copy(C),!0}return!1}function x(T){let w=T.uniforms,M=0,A=16;for(let R=0,N=w.length;R<N;R++){let v=Array.isArray(w[R])?w[R]:[w[R]];for(let b=0,I=v.length;b<I;b++){let k=v[b],O=Array.isArray(k.value)?k.value:[k.value];for(let Y=0,G=O.length;Y<G;Y++){let H=O[Y],B=_(H),tt=M%A,mt=tt%B.boundary,ct=tt+mt;M+=mt,ct!==0&&A-ct<B.storage&&(M+=A-ct),k.__data=new Float32Array(B.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=M,M+=B.storage}}}let C=M%A;return C>0&&(M+=A-C),T.__size=M,T.__cache={},this}function _(T){let w={boundary:0,storage:0};return typeof T=="number"||typeof T=="boolean"?(w.boundary=4,w.storage=4):T.isVector2?(w.boundary=8,w.storage=8):T.isVector3||T.isColor?(w.boundary=16,w.storage=12):T.isVector4?(w.boundary=16,w.storage=16):T.isMatrix3?(w.boundary=48,w.storage=48):T.isMatrix4?(w.boundary=64,w.storage=64):T.isTexture?Vt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Vt("WebGLRenderer: Unsupported uniform value type.",T),w}function m(T){let w=T.target;w.removeEventListener("dispose",m);let M=a.indexOf(w.__bindingPointIndex);a.splice(M,1),i.deleteBuffer(r[w.id]),delete r[w.id],delete s[w.id]}function f(){for(let T in r)i.deleteBuffer(r[T]);a=[],r={},s={}}return{bind:l,update:c,dispose:f}}var sg=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),gn=null;function ag(){return gn===null&&(gn=new ks(sg,16,16,xi,mn),gn.name="DFG_LUT",gn.minFilter=Ce,gn.magFilter=Ce,gn.wrapS=dn,gn.wrapT=dn,gn.generateMipmaps=!1,gn.needsUpdate=!0),gn}var ts=class{constructor(t={}){let{canvas:e=Eh(),context:n=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:p=Be}=t;this.isWebGLRenderer=!0;let x;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");x=n.getContextAttributes().alpha}else x=a;let _=p,m=new Set([ba,ya,va]),f=new Set([Be,sn,ji,tr,xa,_a]),T=new Uint32Array(4),w=new Int32Array(4),M=null,A=null,C=[],R=[],N=null;this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=rn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let v=this,b=!1;this._outputColorSpace=He;let I=0,k=0,O=null,Y=-1,G=null,H=new me,B=new me,tt=null,mt=new Qt(0),ct=0,ut=e.width,Wt=e.height,Gt=1,se=null,ae=null,Z=new me(0,0,ut,Wt),et=new me(0,0,ut,Wt),Mt=!1,Ut=new Gi,Et=!1,jt=!1,oe=new fe,Xt=new L,Q=new me,it={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},j=!1;function xt(){return O===null?Gt:1}let E=n;function Lt(y,F){return e.getContext(y,F)}try{let y={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"182"}`),e.addEventListener("webglcontextlost",Ht,!1),e.addEventListener("webglcontextrestored",de,!1),e.addEventListener("webglcontextcreationerror",ie,!1),E===null){let F="webgl2";if(E=Lt(F,y),E===null)throw Lt(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(y){throw kt("WebGLRenderer: "+y.message),y}let bt,Ot,ot,S,g,D,W,$,X,Rt,lt,At,Bt,nt,ft,Ct,It,dt,Zt,P,yt,at,St,rt;function K(){bt=new fm(E),bt.init(),at=new j0(E,bt),Ot=new rm(E,bt,t,at),ot=new K0(E,bt),Ot.reversedDepthBuffer&&u&&ot.buffers.depth.setReversed(!0),S=new gm(E),g=new U0,D=new Q0(E,bt,ot,g,Ot,at,S),W=new am(v),$=new um(v),X=new vu(E),St=new nm(E,X),Rt=new pm(E,X,S,St),lt=new _m(E,Rt,X,S),Zt=new xm(E,Ot,D),Ct=new sm(g),At=new N0(v,W,$,bt,Ot,St,Ct),Bt=new ig(v,g),nt=new B0,ft=new W0(bt),dt=new em(v,W,$,ot,lt,x,l),It=new J0(v,lt,Ot),rt=new rg(E,S,Ot,ot),P=new im(E,bt,S),yt=new mm(E,bt,S),S.programs=At.programs,v.capabilities=Ot,v.extensions=bt,v.properties=g,v.renderLists=nt,v.shadowMap=It,v.state=ot,v.info=S}K(),_!==Be&&(N=new ym(_,e.width,e.height,r,s));let ht=new Xl(v,E);this.xr=ht,this.getContext=function(){return E},this.getContextAttributes=function(){return E.getContextAttributes()},this.forceContextLoss=function(){let y=bt.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){let y=bt.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return Gt},this.setPixelRatio=function(y){y!==void 0&&(Gt=y,this.setSize(ut,Wt,!1))},this.getSize=function(y){return y.set(ut,Wt)},this.setSize=function(y,F,V=!0){if(ht.isPresenting){Vt("WebGLRenderer: Can't change size while VR device is presenting.");return}ut=y,Wt=F,e.width=Math.floor(y*Gt),e.height=Math.floor(F*Gt),V===!0&&(e.style.width=y+"px",e.style.height=F+"px"),N!==null&&N.setSize(e.width,e.height),this.setViewport(0,0,y,F)},this.getDrawingBufferSize=function(y){return y.set(ut*Gt,Wt*Gt).floor()},this.setDrawingBufferSize=function(y,F,V){ut=y,Wt=F,Gt=V,e.width=Math.floor(y*V),e.height=Math.floor(F*V),this.setViewport(0,0,y,F)},this.setEffects=function(y){if(_===Be){console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(y){for(let F=0;F<y.length;F++)if(y[F].isOutputPass===!0){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}N.setEffects(y||[])},this.getCurrentViewport=function(y){return y.copy(H)},this.getViewport=function(y){return y.copy(Z)},this.setViewport=function(y,F,V,z){y.isVector4?Z.set(y.x,y.y,y.z,y.w):Z.set(y,F,V,z),ot.viewport(H.copy(Z).multiplyScalar(Gt).round())},this.getScissor=function(y){return y.copy(et)},this.setScissor=function(y,F,V,z){y.isVector4?et.set(y.x,y.y,y.z,y.w):et.set(y,F,V,z),ot.scissor(B.copy(et).multiplyScalar(Gt).round())},this.getScissorTest=function(){return Mt},this.setScissorTest=function(y){ot.setScissorTest(Mt=y)},this.setOpaqueSort=function(y){se=y},this.setTransparentSort=function(y){ae=y},this.getClearColor=function(y){return y.copy(dt.getClearColor())},this.setClearColor=function(){dt.setClearColor(...arguments)},this.getClearAlpha=function(){return dt.getClearAlpha()},this.setClearAlpha=function(){dt.setClearAlpha(...arguments)},this.clear=function(y=!0,F=!0,V=!0){let z=0;if(y){let U=!1;if(O!==null){let pt=O.texture.format;U=m.has(pt)}if(U){let pt=O.texture.type,wt=f.has(pt),vt=dt.getClearColor(),Tt=dt.getClearAlpha(),Dt=vt.r,zt=vt.g,Ft=vt.b;wt?(T[0]=Dt,T[1]=zt,T[2]=Ft,T[3]=Tt,E.clearBufferuiv(E.COLOR,0,T)):(w[0]=Dt,w[1]=zt,w[2]=Ft,w[3]=Tt,E.clearBufferiv(E.COLOR,0,w))}else z|=E.COLOR_BUFFER_BIT}F&&(z|=E.DEPTH_BUFFER_BIT),V&&(z|=E.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),E.clear(z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",Ht,!1),e.removeEventListener("webglcontextrestored",de,!1),e.removeEventListener("webglcontextcreationerror",ie,!1),dt.dispose(),nt.dispose(),ft.dispose(),g.dispose(),W.dispose(),$.dispose(),lt.dispose(),St.dispose(),rt.dispose(),At.dispose(),ht.dispose(),ht.removeEventListener("sessionstart",ql),ht.removeEventListener("sessionend",Zl),Qn.stop()};function Ht(y){y.preventDefault(),El("WebGLRenderer: Context Lost."),b=!0}function de(){El("WebGLRenderer: Context Restored."),b=!1;let y=S.autoReset,F=It.enabled,V=It.autoUpdate,z=It.needsUpdate,U=It.type;K(),S.autoReset=y,It.enabled=F,It.autoUpdate=V,It.needsUpdate=z,It.type=U}function ie(y){kt("WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function on(y){let F=y.target;F.removeEventListener("dispose",on),_n(F)}function _n(y){ad(y),g.remove(y)}function ad(y){let F=g.get(y).programs;F!==void 0&&(F.forEach(function(V){At.releaseProgram(V)}),y.isShaderMaterial&&At.releaseShaderCache(y))}this.renderBufferDirect=function(y,F,V,z,U,pt){F===null&&(F=it);let wt=U.isMesh&&U.matrixWorld.determinant()<0,vt=ld(y,F,V,z,U);ot.setMaterial(z,wt);let Tt=V.index,Dt=1;if(z.wireframe===!0){if(Tt=Rt.getWireframeAttribute(V),Tt===void 0)return;Dt=2}let zt=V.drawRange,Ft=V.attributes.position,Jt=zt.start*Dt,le=(zt.start+zt.count)*Dt;pt!==null&&(Jt=Math.max(Jt,pt.start*Dt),le=Math.min(le,(pt.start+pt.count)*Dt)),Tt!==null?(Jt=Math.max(Jt,0),le=Math.min(le,Tt.count)):Ft!=null&&(Jt=Math.max(Jt,0),le=Math.min(le,Ft.count));let ge=le-Jt;if(ge<0||ge===1/0)return;St.setup(U,z,vt,V,Tt);let xe,he=P;if(Tt!==null&&(xe=X.get(Tt),he=yt,he.setIndex(xe)),U.isMesh)z.wireframe===!0?(ot.setLineWidth(z.wireframeLinewidth*xt()),he.setMode(E.LINES)):he.setMode(E.TRIANGLES);else if(U.isLine){let Nt=z.linewidth;Nt===void 0&&(Nt=1),ot.setLineWidth(Nt*xt()),U.isLineSegments?he.setMode(E.LINES):U.isLineLoop?he.setMode(E.LINE_LOOP):he.setMode(E.LINE_STRIP)}else U.isPoints?he.setMode(E.POINTS):U.isSprite&&he.setMode(E.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)Oi("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),he.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(bt.get("WEBGL_multi_draw"))he.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{let Nt=U._multiDrawStarts,re=U._multiDrawCounts,ee=U._multiDrawCount,ke=Tt?X.get(Tt).bytesPerElement:1,Si=g.get(z).currentProgram.getUniforms();for(let ze=0;ze<ee;ze++)Si.setValue(E,"_gl_DrawID",ze),he.render(Nt[ze]/ke,re[ze])}else if(U.isInstancedMesh)he.renderInstances(Jt,ge,U.count);else if(V.isInstancedBufferGeometry){let Nt=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,re=Math.min(V.instanceCount,Nt);he.renderInstances(Jt,ge,re)}else he.render(Jt,ge)};function Yl(y,F,V){y.transparent===!0&&y.side===fn&&y.forceSinglePass===!1?(y.side=Fe,y.needsUpdate=!0,ns(y,F,V),y.side=En,y.needsUpdate=!0,ns(y,F,V),y.side=fn):ns(y,F,V)}this.compile=function(y,F,V=null){V===null&&(V=y),A=ft.get(V),A.init(F),R.push(A),V.traverseVisible(function(U){U.isLight&&U.layers.test(F.layers)&&(A.pushLight(U),U.castShadow&&A.pushShadow(U))}),y!==V&&y.traverseVisible(function(U){U.isLight&&U.layers.test(F.layers)&&(A.pushLight(U),U.castShadow&&A.pushShadow(U))}),A.setupLights();let z=new Set;return y.traverse(function(U){if(!(U.isMesh||U.isPoints||U.isLine||U.isSprite))return;let pt=U.material;if(pt)if(Array.isArray(pt))for(let wt=0;wt<pt.length;wt++){let vt=pt[wt];Yl(vt,V,U),z.add(vt)}else Yl(pt,V,U),z.add(pt)}),A=R.pop(),z},this.compileAsync=function(y,F,V=null){let z=this.compile(y,F,V);return new Promise(U=>{function pt(){if(z.forEach(function(wt){g.get(wt).currentProgram.isReady()&&z.delete(wt)}),z.size===0){U(y);return}setTimeout(pt,10)}bt.get("KHR_parallel_shader_compile")!==null?pt():setTimeout(pt,10)})};let oo=null;function od(y){oo&&oo(y)}function ql(){Qn.stop()}function Zl(){Qn.start()}let Qn=new ed;Qn.setAnimationLoop(od),typeof self<"u"&&Qn.setContext(self),this.setAnimationLoop=function(y){oo=y,ht.setAnimationLoop(y),y===null?Qn.stop():Qn.start()},ht.addEventListener("sessionstart",ql),ht.addEventListener("sessionend",Zl),this.render=function(y,F){if(F!==void 0&&F.isCamera!==!0){kt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(b===!0)return;let V=ht.enabled===!0&&ht.isPresenting===!0,z=N!==null&&(O===null||V)&&N.begin(v,O);if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),ht.enabled===!0&&ht.isPresenting===!0&&(N===null||N.isCompositing()===!1)&&(ht.cameraAutoUpdate===!0&&ht.updateCamera(F),F=ht.getCamera()),y.isScene===!0&&y.onBeforeRender(v,y,F,O),A=ft.get(y,R.length),A.init(F),R.push(A),oe.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),Ut.setFromProjectionMatrix(oe,en,F.reversedDepth),jt=this.localClippingEnabled,Et=Ct.init(this.clippingPlanes,jt),M=nt.get(y,C.length),M.init(),C.push(M),ht.enabled===!0&&ht.isPresenting===!0){let wt=v.xr.getDepthSensingMesh();wt!==null&&lo(wt,F,-1/0,v.sortObjects)}lo(y,F,0,v.sortObjects),M.finish(),v.sortObjects===!0&&M.sort(se,ae),j=ht.enabled===!1||ht.isPresenting===!1||ht.hasDepthSensing()===!1,j&&dt.addToRenderList(M,y),this.info.render.frame++,Et===!0&&Ct.beginShadows();let U=A.state.shadowsArray;if(It.render(U,y,F),Et===!0&&Ct.endShadows(),this.info.autoReset===!0&&this.info.reset(),(z&&N.hasRenderPass())===!1){let wt=M.opaque,vt=M.transmissive;if(A.setupLights(),F.isArrayCamera){let Tt=F.cameras;if(vt.length>0)for(let Dt=0,zt=Tt.length;Dt<zt;Dt++){let Ft=Tt[Dt];$l(wt,vt,y,Ft)}j&&dt.render(y);for(let Dt=0,zt=Tt.length;Dt<zt;Dt++){let Ft=Tt[Dt];Jl(M,y,Ft,Ft.viewport)}}else vt.length>0&&$l(wt,vt,y,F),j&&dt.render(y),Jl(M,y,F)}O!==null&&k===0&&(D.updateMultisampleRenderTarget(O),D.updateRenderTargetMipmap(O)),z&&N.end(v),y.isScene===!0&&y.onAfterRender(v,y,F),St.resetDefaultState(),Y=-1,G=null,R.pop(),R.length>0?(A=R[R.length-1],Et===!0&&Ct.setGlobalState(v.clippingPlanes,A.state.camera)):A=null,C.pop(),C.length>0?M=C[C.length-1]:M=null};function lo(y,F,V,z){if(y.visible===!1)return;if(y.layers.test(F.layers)){if(y.isGroup)V=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(F);else if(y.isLight)A.pushLight(y),y.castShadow&&A.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||Ut.intersectsSprite(y)){z&&Q.setFromMatrixPosition(y.matrixWorld).applyMatrix4(oe);let wt=lt.update(y),vt=y.material;vt.visible&&M.push(y,wt,vt,V,Q.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||Ut.intersectsObject(y))){let wt=lt.update(y),vt=y.material;if(z&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),Q.copy(y.boundingSphere.center)):(wt.boundingSphere===null&&wt.computeBoundingSphere(),Q.copy(wt.boundingSphere.center)),Q.applyMatrix4(y.matrixWorld).applyMatrix4(oe)),Array.isArray(vt)){let Tt=wt.groups;for(let Dt=0,zt=Tt.length;Dt<zt;Dt++){let Ft=Tt[Dt],Jt=vt[Ft.materialIndex];Jt&&Jt.visible&&M.push(y,wt,Jt,V,Q.z,Ft)}}else vt.visible&&M.push(y,wt,vt,V,Q.z,null)}}let pt=y.children;for(let wt=0,vt=pt.length;wt<vt;wt++)lo(pt[wt],F,V,z)}function Jl(y,F,V,z){let{opaque:U,transmissive:pt,transparent:wt}=y;A.setupLightsView(V),Et===!0&&Ct.setGlobalState(v.clippingPlanes,V),z&&ot.viewport(H.copy(z)),U.length>0&&es(U,F,V),pt.length>0&&es(pt,F,V),wt.length>0&&es(wt,F,V),ot.buffers.depth.setTest(!0),ot.buffers.depth.setMask(!0),ot.buffers.color.setMask(!0),ot.setPolygonOffset(!1)}function $l(y,F,V,z){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;if(A.state.transmissionRenderTarget[z.id]===void 0){let Jt=bt.has("EXT_color_buffer_half_float")||bt.has("EXT_color_buffer_float");A.state.transmissionRenderTarget[z.id]=new We(1,1,{generateMipmaps:!0,type:Jt?mn:Be,minFilter:Jn,samples:Ot.samples,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:te.workingColorSpace})}let pt=A.state.transmissionRenderTarget[z.id],wt=z.viewport||H;pt.setSize(wt.z*v.transmissionResolutionScale,wt.w*v.transmissionResolutionScale);let vt=v.getRenderTarget(),Tt=v.getActiveCubeFace(),Dt=v.getActiveMipmapLevel();v.setRenderTarget(pt),v.getClearColor(mt),ct=v.getClearAlpha(),ct<1&&v.setClearColor(16777215,.5),v.clear(),j&&dt.render(V);let zt=v.toneMapping;v.toneMapping=rn;let Ft=z.viewport;if(z.viewport!==void 0&&(z.viewport=void 0),A.setupLightsView(z),Et===!0&&Ct.setGlobalState(v.clippingPlanes,z),es(y,V,z),D.updateMultisampleRenderTarget(pt),D.updateRenderTargetMipmap(pt),bt.has("WEBGL_multisampled_render_to_texture")===!1){let Jt=!1;for(let le=0,ge=F.length;le<ge;le++){let xe=F[le],{object:he,geometry:Nt,material:re,group:ee}=xe;if(re.side===fn&&he.layers.test(z.layers)){let ke=re.side;re.side=Fe,re.needsUpdate=!0,Kl(he,V,z,Nt,re,ee),re.side=ke,re.needsUpdate=!0,Jt=!0}}Jt===!0&&(D.updateMultisampleRenderTarget(pt),D.updateRenderTargetMipmap(pt))}v.setRenderTarget(vt,Tt,Dt),v.setClearColor(mt,ct),Ft!==void 0&&(z.viewport=Ft),v.toneMapping=zt}function es(y,F,V){let z=F.isScene===!0?F.overrideMaterial:null;for(let U=0,pt=y.length;U<pt;U++){let wt=y[U],{object:vt,geometry:Tt,group:Dt}=wt,zt=wt.material;zt.allowOverride===!0&&z!==null&&(zt=z),vt.layers.test(V.layers)&&Kl(vt,F,V,Tt,zt,Dt)}}function Kl(y,F,V,z,U,pt){y.onBeforeRender(v,F,V,z,U,pt),y.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),U.onBeforeRender(v,F,V,z,y,pt),U.transparent===!0&&U.side===fn&&U.forceSinglePass===!1?(U.side=Fe,U.needsUpdate=!0,v.renderBufferDirect(V,F,z,U,y,pt),U.side=En,U.needsUpdate=!0,v.renderBufferDirect(V,F,z,U,y,pt),U.side=fn):v.renderBufferDirect(V,F,z,U,y,pt),y.onAfterRender(v,F,V,z,U,pt)}function ns(y,F,V){F.isScene!==!0&&(F=it);let z=g.get(y),U=A.state.lights,pt=A.state.shadowsArray,wt=U.state.version,vt=At.getParameters(y,U.state,pt,F,V),Tt=At.getProgramCacheKey(vt),Dt=z.programs;z.environment=y.isMeshStandardMaterial?F.environment:null,z.fog=F.fog,z.envMap=(y.isMeshStandardMaterial?$:W).get(y.envMap||z.environment),z.envMapRotation=z.environment!==null&&y.envMap===null?F.environmentRotation:y.envMapRotation,Dt===void 0&&(y.addEventListener("dispose",on),Dt=new Map,z.programs=Dt);let zt=Dt.get(Tt);if(zt!==void 0){if(z.currentProgram===zt&&z.lightsStateVersion===wt)return jl(y,vt),zt}else vt.uniforms=At.getUniforms(y),y.onBeforeCompile(vt,v),zt=At.acquireProgram(vt,Tt),Dt.set(Tt,zt),z.uniforms=vt.uniforms;let Ft=z.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(Ft.clippingPlanes=Ct.uniform),jl(y,vt),z.needsLights=hd(y),z.lightsStateVersion=wt,z.needsLights&&(Ft.ambientLightColor.value=U.state.ambient,Ft.lightProbe.value=U.state.probe,Ft.directionalLights.value=U.state.directional,Ft.directionalLightShadows.value=U.state.directionalShadow,Ft.spotLights.value=U.state.spot,Ft.spotLightShadows.value=U.state.spotShadow,Ft.rectAreaLights.value=U.state.rectArea,Ft.ltc_1.value=U.state.rectAreaLTC1,Ft.ltc_2.value=U.state.rectAreaLTC2,Ft.pointLights.value=U.state.point,Ft.pointLightShadows.value=U.state.pointShadow,Ft.hemisphereLights.value=U.state.hemi,Ft.directionalShadowMap.value=U.state.directionalShadowMap,Ft.directionalShadowMatrix.value=U.state.directionalShadowMatrix,Ft.spotShadowMap.value=U.state.spotShadowMap,Ft.spotLightMatrix.value=U.state.spotLightMatrix,Ft.spotLightMap.value=U.state.spotLightMap,Ft.pointShadowMap.value=U.state.pointShadowMap,Ft.pointShadowMatrix.value=U.state.pointShadowMatrix),z.currentProgram=zt,z.uniformsList=null,zt}function Ql(y){if(y.uniformsList===null){let F=y.currentProgram.getUniforms();y.uniformsList=ir.seqWithValue(F.seq,y.uniforms)}return y.uniformsList}function jl(y,F){let V=g.get(y);V.outputColorSpace=F.outputColorSpace,V.batching=F.batching,V.batchingColor=F.batchingColor,V.instancing=F.instancing,V.instancingColor=F.instancingColor,V.instancingMorph=F.instancingMorph,V.skinning=F.skinning,V.morphTargets=F.morphTargets,V.morphNormals=F.morphNormals,V.morphColors=F.morphColors,V.morphTargetsCount=F.morphTargetsCount,V.numClippingPlanes=F.numClippingPlanes,V.numIntersection=F.numClipIntersection,V.vertexAlphas=F.vertexAlphas,V.vertexTangents=F.vertexTangents,V.toneMapping=F.toneMapping}function ld(y,F,V,z,U){F.isScene!==!0&&(F=it),D.resetTextureUnits();let pt=F.fog,wt=z.isMeshStandardMaterial?F.environment:null,vt=O===null?v.outputColorSpace:O.isXRRenderTarget===!0?O.texture.colorSpace:ci,Tt=(z.isMeshStandardMaterial?$:W).get(z.envMap||wt),Dt=z.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,zt=!!V.attributes.tangent&&(!!z.normalMap||z.anisotropy>0),Ft=!!V.morphAttributes.position,Jt=!!V.morphAttributes.normal,le=!!V.morphAttributes.color,ge=rn;z.toneMapped&&(O===null||O.isXRRenderTarget===!0)&&(ge=v.toneMapping);let xe=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,he=xe!==void 0?xe.length:0,Nt=g.get(z),re=A.state.lights;if(Et===!0&&(jt===!0||y!==G)){let Le=y===G&&z.id===Y;Ct.setState(z,y,Le)}let ee=!1;z.version===Nt.__version?(Nt.needsLights&&Nt.lightsStateVersion!==re.state.version||Nt.outputColorSpace!==vt||U.isBatchedMesh&&Nt.batching===!1||!U.isBatchedMesh&&Nt.batching===!0||U.isBatchedMesh&&Nt.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&Nt.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&Nt.instancing===!1||!U.isInstancedMesh&&Nt.instancing===!0||U.isSkinnedMesh&&Nt.skinning===!1||!U.isSkinnedMesh&&Nt.skinning===!0||U.isInstancedMesh&&Nt.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&Nt.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&Nt.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&Nt.instancingMorph===!1&&U.morphTexture!==null||Nt.envMap!==Tt||z.fog===!0&&Nt.fog!==pt||Nt.numClippingPlanes!==void 0&&(Nt.numClippingPlanes!==Ct.numPlanes||Nt.numIntersection!==Ct.numIntersection)||Nt.vertexAlphas!==Dt||Nt.vertexTangents!==zt||Nt.morphTargets!==Ft||Nt.morphNormals!==Jt||Nt.morphColors!==le||Nt.toneMapping!==ge||Nt.morphTargetsCount!==he)&&(ee=!0):(ee=!0,Nt.__version=z.version);let ke=Nt.currentProgram;ee===!0&&(ke=ns(z,F,U));let Si=!1,ze=!1,sr=!1,ue=ke.getUniforms(),Ne=Nt.uniforms;if(ot.useProgram(ke.program)&&(Si=!0,ze=!0,sr=!0),z.id!==Y&&(Y=z.id,ze=!0),Si||G!==y){ot.buffers.depth.getReversed()&&y.reversedDepth!==!0&&(y._reversedDepth=!0,y.updateProjectionMatrix()),ue.setValue(E,"projectionMatrix",y.projectionMatrix),ue.setValue(E,"viewMatrix",y.matrixWorldInverse);let Ue=ue.map.cameraPosition;Ue!==void 0&&Ue.setValue(E,Xt.setFromMatrixPosition(y.matrixWorld)),Ot.logarithmicDepthBuffer&&ue.setValue(E,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(z.isMeshPhongMaterial||z.isMeshToonMaterial||z.isMeshLambertMaterial||z.isMeshBasicMaterial||z.isMeshStandardMaterial||z.isShaderMaterial)&&ue.setValue(E,"isOrthographic",y.isOrthographicCamera===!0),G!==y&&(G=y,ze=!0,sr=!0)}if(Nt.needsLights&&(re.state.directionalShadowMap.length>0&&ue.setValue(E,"directionalShadowMap",re.state.directionalShadowMap,D),re.state.spotShadowMap.length>0&&ue.setValue(E,"spotShadowMap",re.state.spotShadowMap,D),re.state.pointShadowMap.length>0&&ue.setValue(E,"pointShadowMap",re.state.pointShadowMap,D)),U.isSkinnedMesh){ue.setOptional(E,U,"bindMatrix"),ue.setOptional(E,U,"bindMatrixInverse");let Le=U.skeleton;Le&&(Le.boneTexture===null&&Le.computeBoneTexture(),ue.setValue(E,"boneTexture",Le.boneTexture,D))}U.isBatchedMesh&&(ue.setOptional(E,U,"batchingTexture"),ue.setValue(E,"batchingTexture",U._matricesTexture,D),ue.setOptional(E,U,"batchingIdTexture"),ue.setValue(E,"batchingIdTexture",U._indirectTexture,D),ue.setOptional(E,U,"batchingColorTexture"),U._colorsTexture!==null&&ue.setValue(E,"batchingColorTexture",U._colorsTexture,D));let Ze=V.morphAttributes;if((Ze.position!==void 0||Ze.normal!==void 0||Ze.color!==void 0)&&Zt.update(U,V,ke),(ze||Nt.receiveShadow!==U.receiveShadow)&&(Nt.receiveShadow=U.receiveShadow,ue.setValue(E,"receiveShadow",U.receiveShadow)),z.isMeshGouraudMaterial&&z.envMap!==null&&(Ne.envMap.value=Tt,Ne.flipEnvMap.value=Tt.isCubeTexture&&Tt.isRenderTargetTexture===!1?-1:1),z.isMeshStandardMaterial&&z.envMap===null&&F.environment!==null&&(Ne.envMapIntensity.value=F.environmentIntensity),Ne.dfgLUT!==void 0&&(Ne.dfgLUT.value=ag()),ze&&(ue.setValue(E,"toneMappingExposure",v.toneMappingExposure),Nt.needsLights&&cd(Ne,sr),pt&&z.fog===!0&&Bt.refreshFogUniforms(Ne,pt),Bt.refreshMaterialUniforms(Ne,z,Gt,Wt,A.state.transmissionRenderTarget[y.id]),ir.upload(E,Ql(Nt),Ne,D)),z.isShaderMaterial&&z.uniformsNeedUpdate===!0&&(ir.upload(E,Ql(Nt),Ne,D),z.uniformsNeedUpdate=!1),z.isSpriteMaterial&&ue.setValue(E,"center",U.center),ue.setValue(E,"modelViewMatrix",U.modelViewMatrix),ue.setValue(E,"normalMatrix",U.normalMatrix),ue.setValue(E,"modelMatrix",U.matrixWorld),z.isShaderMaterial||z.isRawShaderMaterial){let Le=z.uniformsGroups;for(let Ue=0,co=Le.length;Ue<co;Ue++){let jn=Le[Ue];rt.update(jn,ke),rt.bind(jn,ke)}}return ke}function cd(y,F){y.ambientLightColor.needsUpdate=F,y.lightProbe.needsUpdate=F,y.directionalLights.needsUpdate=F,y.directionalLightShadows.needsUpdate=F,y.pointLights.needsUpdate=F,y.pointLightShadows.needsUpdate=F,y.spotLights.needsUpdate=F,y.spotLightShadows.needsUpdate=F,y.rectAreaLights.needsUpdate=F,y.hemisphereLights.needsUpdate=F}function hd(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return I},this.getActiveMipmapLevel=function(){return k},this.getRenderTarget=function(){return O},this.setRenderTargetTextures=function(y,F,V){let z=g.get(y);z.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,z.__autoAllocateDepthBuffer===!1&&(z.__useRenderToTexture=!1),g.get(y.texture).__webglTexture=F,g.get(y.depthTexture).__webglTexture=z.__autoAllocateDepthBuffer?void 0:V,z.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,F){let V=g.get(y);V.__webglFramebuffer=F,V.__useDefaultFramebuffer=F===void 0};let dd=E.createFramebuffer();this.setRenderTarget=function(y,F=0,V=0){O=y,I=F,k=V;let z=null,U=!1,pt=!1;if(y){let vt=g.get(y);if(vt.__useDefaultFramebuffer!==void 0){ot.bindFramebuffer(E.FRAMEBUFFER,vt.__webglFramebuffer),H.copy(y.viewport),B.copy(y.scissor),tt=y.scissorTest,ot.viewport(H),ot.scissor(B),ot.setScissorTest(tt),Y=-1;return}else if(vt.__webglFramebuffer===void 0)D.setupRenderTarget(y);else if(vt.__hasExternalTextures)D.rebindTextures(y,g.get(y.texture).__webglTexture,g.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){let zt=y.depthTexture;if(vt.__boundDepthTexture!==zt){if(zt!==null&&g.has(zt)&&(y.width!==zt.image.width||y.height!==zt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");D.setupDepthRenderbuffer(y)}}let Tt=y.texture;(Tt.isData3DTexture||Tt.isDataArrayTexture||Tt.isCompressedArrayTexture)&&(pt=!0);let Dt=g.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Dt[F])?z=Dt[F][V]:z=Dt[F],U=!0):y.samples>0&&D.useMultisampledRTT(y)===!1?z=g.get(y).__webglMultisampledFramebuffer:Array.isArray(Dt)?z=Dt[V]:z=Dt,H.copy(y.viewport),B.copy(y.scissor),tt=y.scissorTest}else H.copy(Z).multiplyScalar(Gt).floor(),B.copy(et).multiplyScalar(Gt).floor(),tt=Mt;if(V!==0&&(z=dd),ot.bindFramebuffer(E.FRAMEBUFFER,z)&&ot.drawBuffers(y,z),ot.viewport(H),ot.scissor(B),ot.setScissorTest(tt),U){let vt=g.get(y.texture);E.framebufferTexture2D(E.FRAMEBUFFER,E.COLOR_ATTACHMENT0,E.TEXTURE_CUBE_MAP_POSITIVE_X+F,vt.__webglTexture,V)}else if(pt){let vt=F;for(let Tt=0;Tt<y.textures.length;Tt++){let Dt=g.get(y.textures[Tt]);E.framebufferTextureLayer(E.FRAMEBUFFER,E.COLOR_ATTACHMENT0+Tt,Dt.__webglTexture,V,vt)}}else if(y!==null&&V!==0){let vt=g.get(y.texture);E.framebufferTexture2D(E.FRAMEBUFFER,E.COLOR_ATTACHMENT0,E.TEXTURE_2D,vt.__webglTexture,V)}Y=-1},this.readRenderTargetPixels=function(y,F,V,z,U,pt,wt,vt=0){if(!(y&&y.isWebGLRenderTarget)){kt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Tt=g.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&wt!==void 0&&(Tt=Tt[wt]),Tt){ot.bindFramebuffer(E.FRAMEBUFFER,Tt);try{let Dt=y.textures[vt],zt=Dt.format,Ft=Dt.type;if(!Ot.textureFormatReadable(zt)){kt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ot.textureTypeReadable(Ft)){kt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=y.width-z&&V>=0&&V<=y.height-U&&(y.textures.length>1&&E.readBuffer(E.COLOR_ATTACHMENT0+vt),E.readPixels(F,V,z,U,at.convert(zt),at.convert(Ft),pt))}finally{let Dt=O!==null?g.get(O).__webglFramebuffer:null;ot.bindFramebuffer(E.FRAMEBUFFER,Dt)}}},this.readRenderTargetPixelsAsync=function(y,F,V,z,U,pt,wt,vt=0){return is(this,null,function*(){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Tt=g.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&wt!==void 0&&(Tt=Tt[wt]),Tt)if(F>=0&&F<=y.width-z&&V>=0&&V<=y.height-U){ot.bindFramebuffer(E.FRAMEBUFFER,Tt);let Dt=y.textures[vt],zt=Dt.format,Ft=Dt.type;if(!Ot.textureFormatReadable(zt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ot.textureTypeReadable(Ft))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Jt=E.createBuffer();E.bindBuffer(E.PIXEL_PACK_BUFFER,Jt),E.bufferData(E.PIXEL_PACK_BUFFER,pt.byteLength,E.STREAM_READ),y.textures.length>1&&E.readBuffer(E.COLOR_ATTACHMENT0+vt),E.readPixels(F,V,z,U,at.convert(zt),at.convert(Ft),0);let le=O!==null?g.get(O).__webglFramebuffer:null;ot.bindFramebuffer(E.FRAMEBUFFER,le);let ge=E.fenceSync(E.SYNC_GPU_COMMANDS_COMPLETE,0);return E.flush(),yield Th(E,ge,4),E.bindBuffer(E.PIXEL_PACK_BUFFER,Jt),E.getBufferSubData(E.PIXEL_PACK_BUFFER,0,pt),E.deleteBuffer(Jt),E.deleteSync(ge),pt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")})},this.copyFramebufferToTexture=function(y,F=null,V=0){let z=Math.pow(2,-V),U=Math.floor(y.image.width*z),pt=Math.floor(y.image.height*z),wt=F!==null?F.x:0,vt=F!==null?F.y:0;D.setTexture2D(y,0),E.copyTexSubImage2D(E.TEXTURE_2D,V,0,0,wt,vt,U,pt),ot.unbindTexture()};let ud=E.createFramebuffer(),fd=E.createFramebuffer();this.copyTextureToTexture=function(y,F,V=null,z=null,U=0,pt=null){pt===null&&(U!==0?(Oi("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),pt=U,U=0):pt=0);let wt,vt,Tt,Dt,zt,Ft,Jt,le,ge,xe=y.isCompressedTexture?y.mipmaps[pt]:y.image;if(V!==null)wt=V.max.x-V.min.x,vt=V.max.y-V.min.y,Tt=V.isBox3?V.max.z-V.min.z:1,Dt=V.min.x,zt=V.min.y,Ft=V.isBox3?V.min.z:0;else{let Ze=Math.pow(2,-U);wt=Math.floor(xe.width*Ze),vt=Math.floor(xe.height*Ze),y.isDataArrayTexture?Tt=xe.depth:y.isData3DTexture?Tt=Math.floor(xe.depth*Ze):Tt=1,Dt=0,zt=0,Ft=0}z!==null?(Jt=z.x,le=z.y,ge=z.z):(Jt=0,le=0,ge=0);let he=at.convert(F.format),Nt=at.convert(F.type),re;F.isData3DTexture?(D.setTexture3D(F,0),re=E.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(D.setTexture2DArray(F,0),re=E.TEXTURE_2D_ARRAY):(D.setTexture2D(F,0),re=E.TEXTURE_2D),E.pixelStorei(E.UNPACK_FLIP_Y_WEBGL,F.flipY),E.pixelStorei(E.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),E.pixelStorei(E.UNPACK_ALIGNMENT,F.unpackAlignment);let ee=E.getParameter(E.UNPACK_ROW_LENGTH),ke=E.getParameter(E.UNPACK_IMAGE_HEIGHT),Si=E.getParameter(E.UNPACK_SKIP_PIXELS),ze=E.getParameter(E.UNPACK_SKIP_ROWS),sr=E.getParameter(E.UNPACK_SKIP_IMAGES);E.pixelStorei(E.UNPACK_ROW_LENGTH,xe.width),E.pixelStorei(E.UNPACK_IMAGE_HEIGHT,xe.height),E.pixelStorei(E.UNPACK_SKIP_PIXELS,Dt),E.pixelStorei(E.UNPACK_SKIP_ROWS,zt),E.pixelStorei(E.UNPACK_SKIP_IMAGES,Ft);let ue=y.isDataArrayTexture||y.isData3DTexture,Ne=F.isDataArrayTexture||F.isData3DTexture;if(y.isDepthTexture){let Ze=g.get(y),Le=g.get(F),Ue=g.get(Ze.__renderTarget),co=g.get(Le.__renderTarget);ot.bindFramebuffer(E.READ_FRAMEBUFFER,Ue.__webglFramebuffer),ot.bindFramebuffer(E.DRAW_FRAMEBUFFER,co.__webglFramebuffer);for(let jn=0;jn<Tt;jn++)ue&&(E.framebufferTextureLayer(E.READ_FRAMEBUFFER,E.COLOR_ATTACHMENT0,g.get(y).__webglTexture,U,Ft+jn),E.framebufferTextureLayer(E.DRAW_FRAMEBUFFER,E.COLOR_ATTACHMENT0,g.get(F).__webglTexture,pt,ge+jn)),E.blitFramebuffer(Dt,zt,wt,vt,Jt,le,wt,vt,E.DEPTH_BUFFER_BIT,E.NEAREST);ot.bindFramebuffer(E.READ_FRAMEBUFFER,null),ot.bindFramebuffer(E.DRAW_FRAMEBUFFER,null)}else if(U!==0||y.isRenderTargetTexture||g.has(y)){let Ze=g.get(y),Le=g.get(F);ot.bindFramebuffer(E.READ_FRAMEBUFFER,ud),ot.bindFramebuffer(E.DRAW_FRAMEBUFFER,fd);for(let Ue=0;Ue<Tt;Ue++)ue?E.framebufferTextureLayer(E.READ_FRAMEBUFFER,E.COLOR_ATTACHMENT0,Ze.__webglTexture,U,Ft+Ue):E.framebufferTexture2D(E.READ_FRAMEBUFFER,E.COLOR_ATTACHMENT0,E.TEXTURE_2D,Ze.__webglTexture,U),Ne?E.framebufferTextureLayer(E.DRAW_FRAMEBUFFER,E.COLOR_ATTACHMENT0,Le.__webglTexture,pt,ge+Ue):E.framebufferTexture2D(E.DRAW_FRAMEBUFFER,E.COLOR_ATTACHMENT0,E.TEXTURE_2D,Le.__webglTexture,pt),U!==0?E.blitFramebuffer(Dt,zt,wt,vt,Jt,le,wt,vt,E.COLOR_BUFFER_BIT,E.NEAREST):Ne?E.copyTexSubImage3D(re,pt,Jt,le,ge+Ue,Dt,zt,wt,vt):E.copyTexSubImage2D(re,pt,Jt,le,Dt,zt,wt,vt);ot.bindFramebuffer(E.READ_FRAMEBUFFER,null),ot.bindFramebuffer(E.DRAW_FRAMEBUFFER,null)}else Ne?y.isDataTexture||y.isData3DTexture?E.texSubImage3D(re,pt,Jt,le,ge,wt,vt,Tt,he,Nt,xe.data):F.isCompressedArrayTexture?E.compressedTexSubImage3D(re,pt,Jt,le,ge,wt,vt,Tt,he,xe.data):E.texSubImage3D(re,pt,Jt,le,ge,wt,vt,Tt,he,Nt,xe):y.isDataTexture?E.texSubImage2D(E.TEXTURE_2D,pt,Jt,le,wt,vt,he,Nt,xe.data):y.isCompressedTexture?E.compressedTexSubImage2D(E.TEXTURE_2D,pt,Jt,le,xe.width,xe.height,he,xe.data):E.texSubImage2D(E.TEXTURE_2D,pt,Jt,le,wt,vt,he,Nt,xe);E.pixelStorei(E.UNPACK_ROW_LENGTH,ee),E.pixelStorei(E.UNPACK_IMAGE_HEIGHT,ke),E.pixelStorei(E.UNPACK_SKIP_PIXELS,Si),E.pixelStorei(E.UNPACK_SKIP_ROWS,ze),E.pixelStorei(E.UNPACK_SKIP_IMAGES,sr),pt===0&&F.generateMipmaps&&E.generateMipmap(re),ot.unbindTexture()},this.initRenderTarget=function(y){g.get(y).__webglFramebuffer===void 0&&D.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?D.setTextureCube(y,0):y.isData3DTexture?D.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?D.setTexture2DArray(y,0):D.setTexture2D(y,0),ot.unbindTexture()},this.resetState=function(){I=0,k=0,O=null,ot.reset(),St.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return en}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=te._getDrawingBufferColorSpace(t),e.unpackColorSpace=te._getUnpackColorSpace()}};var lg=["treeCanvas"],cg=["snowCanvas"];function hg(i,t){i&1&&ce(0,"canvas",58,0)}function dg(i,t){i&1&&(q(0,"div",59)(1,"div",60)(2,"div",61),st(3,"\u2726 \u2726 \u2726"),J(),q(4,"h2",62),st(5,"\xA1Feliz Navidad!"),J(),q(6,"p",63),st(7,"Te desea"),J(),q(8,"div",64)(9,"span",65),st(10,"NSoluciones"),J()(),q(11,"div",66),st(12,"\u{1F384}"),J(),q(13,"p",67),st(14,"Que esta temporada est\xE9 llena de paz, alegr\xEDa y \xE9xito"),J()()())}function ug(i,t){i&1&&(q(0,"div",68),ce(1,"canvas",69,1),J())}function fg(i,t){i&1&&(q(0,"div",70)(1,"div",71),st(2,"\u2744"),J(),q(3,"div",71),st(4,"\u2745"),J(),q(5,"div",71),st(6,"\u2744"),J(),q(7,"div",71),st(8,"\u2745"),J(),q(9,"div",71),st(10,"\u2744"),J(),q(11,"div",71),st(12,"\u2745"),J(),q(13,"div",71),st(14,"\u2744"),J(),q(15,"div",71),st(16,"\u2745"),J(),q(17,"div",71),st(18,"\u2744"),J(),q(19,"div",71),st(20,"\u2745"),J(),q(21,"div",71),st(22,"\u2744"),J(),q(23,"div",71),st(24,"\u2745"),J(),q(25,"div",71),st(26,"\u2744"),J(),q(27,"div",71),st(28,"\u2745"),J(),q(29,"div",71),st(30,"\u2744"),J(),q(31,"div",71),st(32,"\u2745"),J(),q(33,"div",71),st(34,"\u2744"),J(),q(35,"div",71),st(36,"\u2745"),J(),q(37,"div",71),st(38,"\u2744"),J(),q(39,"div",71),st(40,"\u2745"),J(),q(41,"div",71),st(42,"\u2744"),J(),q(43,"div",71),st(44,"\u2745"),J(),q(45,"div",71),st(46,"\u2744"),J(),q(47,"div",71),st(48,"\u2745"),J()())}function pg(i,t){i&1&&(q(0,"div",72)(1,"span",73),st(2,"2"),J(),q(3,"span",73),st(4,"0"),J(),q(5,"span",73),st(6,"2"),J(),q(7,"span",73),st(8,"6"),J()())}function mg(i,t){i&1&&(q(0,"div",74),ce(1,"div",75)(2,"div",75)(3,"div",75)(4,"div",75)(5,"div",75)(6,"div",75),J())}function gg(i,t){i&1&&(q(0,"div",76),ce(1,"div",77)(2,"div",77)(3,"div",77)(4,"div",78)(5,"div",78)(6,"div",78),J())}function xg(i,t){i&1&&(q(0,"div",79),ce(1,"div",80)(2,"div",80)(3,"div",80)(4,"div",80)(5,"div",80)(6,"div",80)(7,"div",80)(8,"div",80)(9,"div",80)(10,"div",80)(11,"div",80)(12,"div",80)(13,"div",80)(14,"div",80)(15,"div",80)(16,"div",80)(17,"div",80)(18,"div",80)(19,"div",80)(20,"div",80),J())}function _g(i,t){if(i&1){let e=uo();q(0,"div",81),ln("click",function(){ar(e);let r=Fn();return or(r.openFullscreenCountdown())}),q(1,"div",82),st(2,"Click para expandir"),J(),q(3,"div",83),st(4),J(),q(5,"div",84)(6,"div",85)(7,"span",86),st(8),J(),q(9,"span",87),st(10,"D\xCDAS"),J()(),q(11,"div",88),st(12,":"),J(),q(13,"div",85)(14,"span",86),st(15),J(),q(16,"span",87),st(17,"HORAS"),J()(),q(18,"div",88),st(19,":"),J(),q(20,"div",85)(21,"span",86),st(22),J(),q(23,"span",87),st(24,"MIN"),J()(),q(25,"div",88),st(26,":"),J(),q(27,"div",85)(28,"span",86),st(29),J(),q(30,"span",87),st(31,"SEG"),J()()()()}if(i&2){let e=Fn();Pt(4),go("A\xD1O NUEVO ",e.newYear),Pt(4),Je(e.countdownDays.toString().padStart(2,"0")),Pt(7),Je(e.countdownHours.toString().padStart(2,"0")),Pt(7),Je(e.countdownMinutes.toString().padStart(2,"0")),Pt(7),Je(e.countdownSeconds.toString().padStart(2,"0"))}}function vg(i,t){if(i&1&&(q(0,"div",89)(1,"div",90),st(2),J()()),i&2){let e=Fn();Pt(2),go("\xA1FELIZ A\xD1O NUEVO ",e.newYear,"!")}}function yg(i,t){if(i&1){let e=uo();q(0,"div",91),ln("click",function(){ar(e);let r=Fn();return or(r.closeFullscreenCountdown())}),q(1,"div",92),ce(2,"div",93)(3,"div",93)(4,"div",93)(5,"div",93)(6,"div",93)(7,"div",93)(8,"div",93)(9,"div",93)(10,"div",93)(11,"div",93),J(),q(12,"div",94),ce(13,"div",95)(14,"div",95)(15,"div",95)(16,"div",95),J(),q(17,"div",96),ln("click",function(r){return ar(e),or(r.stopPropagation())}),q(18,"div",97)(19,"span",98),st(20,"A\xD1O NUEVO"),J(),q(21,"span",99),st(22),J()(),q(23,"div",100)(24,"div",101)(25,"div",102),st(26),J(),q(27,"div",103),st(28,"D\xCDAS"),J()(),q(29,"div",104),st(30,":"),J(),q(31,"div",101)(32,"div",102),st(33),J(),q(34,"div",103),st(35,"HORAS"),J()(),q(36,"div",104),st(37,":"),J(),q(38,"div",101)(39,"div",102),st(40),J(),q(41,"div",103),st(42,"MINUTOS"),J()(),q(43,"div",104),st(44,":"),J(),q(45,"div",101)(46,"div",102),st(47),J(),q(48,"div",103),st(49,"SEGUNDOS"),J()()(),q(50,"div",105),st(51,"\xA1Prep\xE1rate para celebrar!"),J()(),q(52,"button",106),ln("click",function(){ar(e);let r=Fn();return or(r.closeFullscreenCountdown())}),q(53,"span"),st(54,"\u2715"),J()(),q(55,"div",107),st(56,"Click en cualquier lugar para cerrar"),J()()}if(i&2){let e=Fn();Pt(22),Je(e.newYear),Pt(4),Je(e.countdownDays.toString().padStart(2,"0")),Pt(7),Je(e.countdownHours.toString().padStart(2,"0")),Pt(7),Je(e.countdownMinutes.toString().padStart(2,"0")),Pt(7),Je(e.countdownSeconds.toString().padStart(2,"0"))}}function bg(i,t){i&1&&(q(0,"div",108),ce(1,"div",109),q(2,"div",110),ce(3,"div",111)(4,"div",111)(5,"div",111)(6,"div",111)(7,"div",111)(8,"div",111)(9,"div",111)(10,"div",111),J()())}function Sg(i,t){i&1&&(q(0,"div",112)(1,"div",113),st(2,"\u2601"),J(),q(3,"div",114),st(4,"\u2601"),J(),q(5,"div",115),st(6,"\u2601"),J()())}function Mg(i,t){i&1&&(q(0,"div",116),ce(1,"div",117)(2,"div",118)(3,"div",119),J())}function wg(i,t){i&1&&(q(0,"div",120)(1,"div",121),st(2,"\u{1F334}"),J(),q(3,"div",122),st(4,"\u{1F334}"),J()())}function Eg(i,t){i&1&&(q(0,"div",123)(1,"div",124)(2,"div",125),st(3,"\u2600\uFE0F"),J(),q(4,"h2",126),st(5,"\xA1Feliz Verano!"),J(),q(6,"p",127),st(7,"Que estos d\xEDas est\xE9n llenos de energ\xEDa y buenas vibras"),J(),q(8,"div",128),st(9,"\u{1F3D6}\uFE0F \u{1F30A} \u{1F379}"),J()()())}function Tg(i,t){if(i&1&&(q(0,"span",129),st(1),J()),i&2){let e=t.$implicit,n=t.index;rs("animation-delay",n*.05+"s"),Pt(),Je(e)}}function Ag(i,t){i&1&&(q(0,"div",130),ce(1,"div",131)(2,"div",132)(3,"div",133)(4,"div",134),J())}function Cg(i,t){i&1&&(q(0,"div",135),ce(1,"div",136)(2,"div",137)(3,"div",138)(4,"div",139),J())}function Rg(i,t){i&1&&(q(0,"div",140)(1,"div",141)(2,"div",142),st(3,"2"),J(),q(4,"div",142),st(5,"0"),J(),ce(6,"div",143),q(7,"div",142),st(8,"2"),J(),q(9,"div",142),st(10,"6"),J()(),q(11,"div",144),ce(12,"div",145)(13,"div",146),J()())}function Ig(i,t){i&1&&(q(0,"div",147)(1,"div",148),ce(2,"div",149)(3,"div",150)(4,"div",151),J(),q(5,"div",152),ce(6,"div",153)(7,"div",154),J()())}function Pg(i,t){i&1&&(q(0,"span",155),st(1," Por favor ingresa tu usuario "),J())}function Dg(i,t){i&1&&(q(0,"span",155),st(1," El usuario debe tener al menos 3 caracteres "),J())}function Lg(i,t){i&1&&(q(0,"span",155),st(1," Por favor ingresa tu contrase\xF1a "),J())}function Fg(i,t){i&1&&(q(0,"span",155),st(1," La contrase\xF1a debe tener al menos 6 caracteres "),J())}function Ng(i,t){if(i&1&&(q(0,"div",156),ce(1,"lucide-angular",157),q(2,"span"),st(3),J()()),i&2){let e=Fn();Pt(),Kt("size",20),Pt(2),Je(e.errorMessage)}}function Ug(i,t){i&1&&(q(0,"span"),st(1,"Iniciar Sesi\xF3n"),J())}function Og(i,t){i&1&&ce(0,"div",158)}var fy=(()=>{let t=class t{get newYear(){let n=new Date;return n.getMonth()===0?n.getFullYear():n.getFullYear()+1}constructor(n,r,s,a,o,l,c){this.fb=n,this.authService=r,this.menuPermissionService=s,this.router=a,this.route=o,this.elementRef=l,this.ngZone=c,this.loading=!1,this.errorMessage="",this.hidePassword=!0,this.passwordFocused=!1,this.usernameFocused=!1,this.pupilX=0,this.pupilY=0,this.isWaving=!1,this.isGreeting=!0,this.robotMessage="\xA1Hola! Bienvenido",this.displayedMessage="",this.displayedChars=[],this.showBubble=!1,this.showChristmasHat=!1,this.showNewYearTheme=!1,this.showSummerTheme=!1,this.countdownDays=0,this.countdownHours=0,this.countdownMinutes=0,this.countdownSeconds=0,this.isNewYearArrived=!1,this.showFullscreenCountdown=!1,this.animationFrameId=0,this.ornaments=[],this.lights3D=[],this.snowAnimationId=0}detectSeasonalTheme(){let n=new Date,r=n.getMonth(),s=n.getDate(),a=n.getHours();if(this.showChristmasHat=!1,this.showNewYearTheme=!1,this.showSummerTheme=!1,r===11){if(s===1&&a>=12||s>1&&s<=25){this.showChristmasHat=!0;return}if(s>=26&&s<=31){this.showNewYearTheme=!0;return}}if(r===0){if(s>=1&&s<=3){this.showNewYearTheme=!0;return}if(s>=4&&s<=31){this.showSummerTheme=!0;return}}}startNewYearCountdown(){let n=new Date,r=n.getFullYear();if(n.getMonth()===0){this.isNewYearArrived=!0;return}let a=r+1,o=new Date(a,0,1,0,0,0);this.updateCountdown(o),this.countdownInterval=setInterval(()=>{this.updateCountdown(o)},1e3)}updateCountdown(n){let r=new Date,s=n.getTime()-r.getTime();if(s<=0){this.isNewYearArrived=!0,this.countdownDays=0,this.countdownHours=0,this.countdownMinutes=0,this.countdownSeconds=0,this.countdownInterval&&clearInterval(this.countdownInterval);return}this.countdownDays=Math.floor(s/(1e3*60*60*24)),this.countdownHours=Math.floor(s%(1e3*60*60*24)/(1e3*60*60)),this.countdownMinutes=Math.floor(s%(1e3*60*60)/(1e3*60)),this.countdownSeconds=Math.floor(s%(1e3*60)/1e3)}ngOnInit(){if(this.detectSeasonalTheme(),this.showNewYearTheme&&this.startNewYearCountdown(),this.loginForm=this.fb.group({username:["",[lr.required,lr.minLength(3)]],password:["",[lr.required,lr.minLength(6)]]}),this.authService.isAuthenticated()){this.menuPermissionService.loadVisibleMenu().subscribe({next:n=>{let r=null;for(let s of n)if(s.tipo==="LINK"&&s.ruta){r=s.ruta;break}else if(s.tipo==="DROPDOWN"&&s.children?.length>0){let a=s.children.find(o=>o.ruta);if(a?.ruta){r=a.ruta;break}}this.router.navigate([r||"/dashboard"])},error:()=>this.router.navigate(["/dashboard"])});return}this.showBubble=!1,this.isGreeting=!0,this.isWaving=!1,this.robotMessage="\xA1Hola! Bienvenido",this.displayedMessage="",this.displayedChars=[],setTimeout(()=>{this.showBubble=!0,this.typeMessage(this.robotMessage),this.isWaving=!0,setTimeout(()=>{this.isWaving=!1,setTimeout(()=>{this.isGreeting=!1,this.updateRobotMessage()},500)},2500)},1e3),this.loginForm.valueChanges.subscribe(()=>{this.isGreeting||this.updateRobotMessage()})}ngOnDestroy(){this.countdownInterval&&clearInterval(this.countdownInterval),this.typingTimeout&&clearTimeout(this.typingTimeout),this.animationFrameId&&cancelAnimationFrame(this.animationFrameId),this.renderer&&this.renderer.dispose(),this.snowAnimationId&&cancelAnimationFrame(this.snowAnimationId),this.snowRenderer&&this.snowRenderer.dispose()}initThreeJS(){if(!this.treeCanvasRef||!this.showChristmasHat)return;let n=this.treeCanvasRef.nativeElement,r=n.clientWidth||400,s=n.clientHeight||600;this.scene=new Vi,this.camera=new Ee(45,r/s,.1,1e3),this.camera.position.set(0,2,8),this.camera.lookAt(0,1.5,0),this.renderer=new ts({canvas:n,antialias:!0,alpha:!0}),this.renderer.setSize(r,s),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=sa;let a=new Hr(4210784,.4);this.scene.add(a);let o=new Gr(16777215,.6);o.position.set(5,10,5),o.castShadow=!0,this.scene.add(o),this.createTree(),this.createOrnaments(),this.createTreeLights(),this.createStar(),this.createSnow(),this.ngZone.runOutsideAngular(()=>{this.animate()})}createTree(){let n=new Rn({color:1727534,roughness:.8,metalness:.1,flatShading:!1});[{radius:.4,height:.8,y:3.2},{radius:.7,height:1,y:2.6},{radius:1,height:1.2,y:1.8},{radius:1.3,height:1.4,y:.9},{radius:1.6,height:1.5,y:0}].forEach((d,u)=>{let p=new Ir(d.radius,d.height,32),x=new be(p,n.clone()),_=.35+u*.02,m=.7-u*.05,f=.25+u*.03;x.material.color.setHSL(_,m,f),x.position.y=d.y,x.castShadow=!0,x.receiveShadow=!0,this.scene.add(x)});let s=new fi(.2,.25,.6,16),a=new Rn({color:4859920,roughness:.9,metalness:0}),o=new be(s,a);o.position.y=-.55,o.castShadow=!0,this.scene.add(o);let l=new fi(.5,.4,.4,16),c=new Rn({color:9109504,roughness:.6,metalness:.2}),h=new be(l,c);h.position.y=-1,h.castShadow=!0,this.scene.add(h)}createOrnaments(){[{x:.25,y:2.9,z:.2,color:16711680,size:.08},{x:-.2,y:2.7,z:.25,color:16766720,size:.08},{x:.5,y:2.3,z:.3,color:12632256,size:.1},{x:-.4,y:2.1,z:.4,color:16711680,size:.1},{x:.1,y:2,z:.5,color:16766720,size:.09},{x:.7,y:1.5,z:.4,color:16711680,size:.12},{x:-.6,y:1.6,z:.5,color:12632256,size:.11},{x:.3,y:1.4,z:.7,color:16766720,size:.1},{x:-.2,y:1.3,z:.6,color:16711680,size:.12},{x:.9,y:.8,z:.5,color:16766720,size:.13},{x:-.8,y:.9,z:.6,color:16711680,size:.12},{x:.5,y:.7,z:.9,color:12632256,size:.13},{x:-.4,y:.6,z:.8,color:16766720,size:.11},{x:1.1,y:.2,z:.6,color:16711680,size:.14},{x:-1,y:.3,z:.7,color:12632256,size:.13},{x:.7,y:.1,z:1,color:16766720,size:.14},{x:-.5,y:0,z:1.1,color:16711680,size:.12}].forEach(r=>{let s=new qi(r.size,32,32),a=new Rn({color:r.color,roughness:.2,metalness:.8,envMapIntensity:1}),o=new be(s,a);o.position.set(r.x,r.y,r.z),o.castShadow=!0,this.ornaments.push(o),this.scene.add(o)})}createTreeLights(){[{x:.3,y:3,z:.15},{x:-.35,y:2.5,z:.3},{x:.55,y:2,z:.45},{x:-.5,y:1.5,z:.55},{x:.75,y:1,z:.65},{x:-.7,y:.5,z:.75},{x:.95,y:.2,z:.85},{x:-.9,y:0,z:.9}].forEach((r,s)=>{let a=new Ji(16768324,.5,2);a.position.set(r.x,r.y,r.z),this.lights3D.push(a),this.scene.add(a);let o=new qi(.04,16,16),l=new di({color:16772744,transparent:!0,opacity:.9}),c=new be(o,l);c.position.copy(a.position),this.scene.add(c)})}createStar(){let n=new Xi,r=.25,s=.1,a=5;for(let d=0;d<a*2;d++){let u=d%2===0?r:s,p=d*Math.PI/a-Math.PI/2,x=Math.cos(p)*u,_=Math.sin(p)*u;d===0?n.moveTo(x,_):n.lineTo(x,_)}n.closePath();let o={depth:.08,bevelEnabled:!0,bevelThickness:.02,bevelSize:.02,bevelSegments:2},l=new kr(n,o),c=new Rn({color:16766720,roughness:.2,metalness:.9,emissive:16755200,emissiveIntensity:.5});this.star=new be(l,c),this.star.position.set(0,3.7,0),this.star.rotation.x=-.2,this.scene.add(this.star);let h=new Ji(16768256,1,3);h.position.set(0,3.7,.2),this.scene.add(h)}createSnow(){let r=new Float32Array(600);for(let o=0;o<200;o++)r[o*3]=(Math.random()-.5)*8,r[o*3+1]=Math.random()*10,r[o*3+2]=(Math.random()-.5)*8;let s=new Re;s.setAttribute("position",new Ae(r,3));let a=new ui({color:16777215,size:.05,transparent:!0,opacity:.8,blending:Qi});this.snowParticles=new Hi(s,a),this.scene.add(this.snowParticles)}animate(){this.animationFrameId=requestAnimationFrame(()=>this.animate());let n=Date.now()*.001;if(this.ornaments.forEach((r,s)=>{r.position.y+=Math.sin(n*2+s)*5e-4}),this.lights3D.forEach((r,s)=>{r.intensity=.3+Math.sin(n*3+s*.5)*.3}),this.star&&(this.star.rotation.z=Math.sin(n*.5)*.1,this.star.material.emissiveIntensity=.4+Math.sin(n*2)*.2),this.snowParticles){let r=this.snowParticles.geometry.attributes.position.array;for(let s=0;s<r.length;s+=3)r[s+1]-=.02,r[s]+=Math.sin(n+s)*.002,r[s+1]<-2&&(r[s+1]=8,r[s]=(Math.random()-.5)*8);this.snowParticles.geometry.attributes.position.needsUpdate=!0}this.camera.position.x=Math.sin(n*.2)*.3,this.renderer.render(this.scene,this.camera)}initFullscreenSnow(){if(!this.snowCanvasRef||!this.showChristmasHat)return;let n=this.snowCanvasRef.nativeElement,r=window.innerWidth,s=window.innerHeight;this.snowScene=new Vi,this.snowCamera=new Ee(60,r/s,.1,1e3),this.snowCamera.position.z=5,this.snowRenderer=new ts({canvas:n,antialias:!0,alpha:!0}),this.snowRenderer.setSize(r,s),this.snowRenderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.snowRenderer.setClearColor(0,0);let a=500,o=new Float32Array(a*3),l=new Float32Array(a);for(let d=0;d<a;d++)o[d*3]=(Math.random()-.5)*20,o[d*3+1]=(Math.random()-.5)*15,o[d*3+2]=(Math.random()-.5)*10,l[d]=.01+Math.random()*.02;let c=new Re;c.setAttribute("position",new Ae(o,3)),c.setAttribute("velocity",new Ae(l,1));let h=new ui({color:16777215,size:.08,transparent:!0,opacity:.8,blending:Qi,sizeAttenuation:!0});this.fullscreenSnow=new Hi(c,h),this.snowScene.add(this.fullscreenSnow),window.addEventListener("resize",()=>this.onSnowResize()),this.ngZone.runOutsideAngular(()=>{this.animateFullscreenSnow()})}onSnowResize(){if(!this.snowRenderer||!this.snowCamera)return;let n=window.innerWidth,r=window.innerHeight;this.snowCamera.aspect=n/r,this.snowCamera.updateProjectionMatrix(),this.snowRenderer.setSize(n,r)}animateFullscreenSnow(){if(this.snowAnimationId=requestAnimationFrame(()=>this.animateFullscreenSnow()),!this.fullscreenSnow)return;let n=this.fullscreenSnow.geometry.attributes.position.array,r=this.fullscreenSnow.geometry.attributes.velocity.array,s=Date.now()*.001;for(let a=0;a<n.length;a+=3){let o=a/3;n[a+1]-=r[o],n[a]+=Math.sin(s+o*.1)*.003,n[a+1]<-8&&(n[a+1]=8,n[a]=(Math.random()-.5)*20)}this.fullscreenSnow.geometry.attributes.position.needsUpdate=!0,this.fullscreenSnow.rotation.y=Math.sin(s*.1)*.05,this.snowRenderer.render(this.snowScene,this.snowCamera)}updateRobotMessage(){let n=this.loginForm.get("username")?.value,r=this.loginForm.get("password")?.value,s="";this.loginForm.valid?s="\xA1Perfecto! Todo listo":!n&&!r?s="Ingresa tus credenciales":n?n.length<3?s="Usuario muy corto":r?r.length<6?s="Contrase\xF1a muy corta":s="Revisa los campos":s="Falta tu contrase\xF1a":s="Falta tu usuario",s!==this.robotMessage&&(this.robotMessage=s,this.typeMessage(s))}typeMessage(n){this.typingTimeout&&clearTimeout(this.typingTimeout),this.displayedChars=[];let r=n.split(""),s=0,a=()=>{s<r.length&&(this.displayedChars=r.slice(0,s+1),s++,this.typingTimeout=setTimeout(a,50))};a()}ngAfterViewInit(){this.startAutofillPolling(),this.showChristmasHat&&setTimeout(()=>{this.initThreeJS(),this.initFullscreenSnow()},100)}startAutofillPolling(){let n=setInterval(()=>{let r=this.elementRef.nativeElement.querySelector("#username"),s=this.elementRef.nativeElement.querySelector("#password");if(r&&s){let a=r.value&&r.value.length>0,o=s.value&&s.value.length>0;if(a&&o){let l=this.loginForm.get("username")?.value,c=this.loginForm.get("password")?.value;(!l||!c||l!==r.value||c!==s.value)&&(this.loginForm.patchValue({username:r.value,password:s.value}),this.loginForm.updateValueAndValidity()),this.loginForm.valid&&clearInterval(n)}}},100);setTimeout(()=>{clearInterval(n)},1e4)}onSubmit(){if(this.loginForm.invalid)return;this.loading=!0,this.errorMessage="";let{username:n,password:r}=this.loginForm.value;this.authService.login(n,r).subscribe({next:s=>{this.menuPermissionService.loadVisibleMenu().subscribe({next:a=>{this.loading=!1;let o=null;for(let l of a)if(l.tipo==="LINK"&&l.ruta){o=l.ruta;break}else if(l.tipo==="DROPDOWN"&&l.children?.length>0){let c=l.children.find(h=>h.ruta);if(c?.ruta){o=c.ruta;break}}o?(console.log("\u{1F4CD} Navegando a primera opci\xF3n del men\xFA:",o),this.router.navigate([o])):(console.warn("\u26A0\uFE0F No se encontraron items de men\xFA, usando fallback"),this.router.navigate(["/dashboard"]))},error:a=>{this.loading=!1,console.error("Error loading menu:",a),this.router.navigate(["/dashboard"])}})},error:s=>{this.loading=!1,this.errorMessage=s.error?.message||"Invalid username or password",console.error("Login error:",s)}})}get username(){return this.loginForm.get("username")}get password(){return this.loginForm.get("password")}onUsernameFocus(){this.usernameFocused=!0,this.pupilX=-1,this.pupilY=2}onUsernameBlur(){this.usernameFocused=!1,this.pupilY=0,this.pupilX=0}onUsernameInput(n){let s=n.target.value.length,a=1.5;this.pupilX=-1+Math.min(s*.15,a),this.pupilY=2}onPasswordFocus(){this.passwordFocused=!0,console.log("Password focused. isGreeting:",this.isGreeting,"hidePassword:",this.hidePassword,"passwordFocused:",this.passwordFocused),this.pupilX=-1,this.pupilY=2.5}onPasswordBlur(){this.passwordFocused=!1,this.pupilY=0,this.pupilX=0}getPupilTransform(){return`translate(calc(-50% + ${this.pupilX}px), calc(-50% + ${this.pupilY}px))`}togglePasswordVisibility(){this.hidePassword=!this.hidePassword}openFullscreenCountdown(){this.showFullscreenCountdown=!0,document.body.style.overflow="hidden"}closeFullscreenCountdown(){this.showFullscreenCountdown=!1,document.body.style.overflow=""}onMouseMove(n){if(this.usernameFocused||this.passwordFocused)return;let r=this.elementRef.nativeElement.querySelector(".mascot-head");if(!r)return;let s=r.getBoundingClientRect(),a=s.left+s.width/2,o=s.top+s.height/2,l=n.clientX-a,c=n.clientY-o,h=Math.sqrt(l*l+c*c),d=5.5;if(h>0){let u=Math.min(h/60,1);this.pupilX=l/h*u*d,this.pupilY=c/h*u*d}else this.pupilX=0,this.pupilY=0}};t.\u0275fac=function(r){return new(r||t)(Dn(yc),Dn(fc),Dn(Sc),Dn(hc),Dn(cc),Dn(ec),Dn(rc))},t.\u0275cmp=ic({type:t,selectors:[["app-login"]],viewQuery:function(r,s){if(r&1&&(fo(lg,5),fo(cg,5)),r&2){let a;po(a=mo())&&(s.treeCanvasRef=a.first),po(a=mo())&&(s.snowCanvasRef=a.first)}},hostBindings:function(r,s){r&1&&ln("mousemove",function(o){return s.onMouseMove(o)},nc)},decls:68,vars:64,consts:[["snowCanvas",""],["treeCanvas",""],[1,"login-container"],["class","snow-canvas-fullscreen",4,"ngIf"],["class","christmas-greeting-container",4,"ngIf"],["class","christmas-tree-container",4,"ngIf"],["class","snowflakes",4,"ngIf"],["class","year-background",4,"ngIf"],["class","fireworks-container",4,"ngIf"],["class","streamers-container",4,"ngIf"],["class","confetti-container",4,"ngIf"],["class","newyear-countdown",3,"click",4,"ngIf"],["class","newyear-celebration",4,"ngIf"],["class","fullscreen-countdown-overlay",3,"click",4,"ngIf"],["class","summer-sun",4,"ngIf"],["class","summer-clouds",4,"ngIf"],["class","summer-waves",4,"ngIf"],["class","summer-palms",4,"ngIf"],["class","summer-greeting",4,"ngIf"],[1,"login-card"],[1,"login-header"],[1,"mascot-container"],[1,"speech-bubble"],[1,"typing-text"],["class","typing-char",3,"animation-delay",4,"ngFor","ngForOf"],[1,"mascot-body"],[1,"mascot-antenna"],["class","christmas-hat",4,"ngIf"],["class","party-hat",4,"ngIf"],["class","newyear-glasses",4,"ngIf"],["class","summer-sunglasses",4,"ngIf"],[1,"mascot-head"],[1,"mascot-eyes"],[1,"eye","left-eye"],[1,"pupil"],[1,"eye","right-eye"],[1,"mascot-hands"],[1,"hand","left-hand"],[1,"hand","right-hand"],[1,"mascot-mouth"],[1,"mascot-headset"],[1,"headset-right"],[1,"login-form",3,"ngSubmit","formGroup"],[1,"form-group"],["for","username"],[1,"input-wrapper"],["name","user",1,"input-icon",3,"size"],["id","username","type","text","formControlName","username","autocomplete","username",3,"focus","blur","input"],["class","error-text",4,"ngIf"],["for","password"],["name","lock",1,"input-icon",3,"size"],["id","password","formControlName","password","autocomplete","current-password",3,"focus","blur","type"],["type","button",1,"toggle-password",3,"click"],[3,"name","size"],["class","error-message",4,"ngIf"],["type","submit",1,"login-button",3,"disabled"],[4,"ngIf"],["class","w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin",4,"ngIf"],[1,"snow-canvas-fullscreen"],[1,"christmas-greeting-container"],[1,"christmas-greeting"],[1,"greeting-stars"],[1,"greeting-title"],[1,"greeting-subtitle"],[1,"greeting-company"],[1,"company-name"],[1,"greeting-ornament"],[1,"greeting-wish"],[1,"christmas-tree-container"],[1,"tree-canvas"],[1,"snowflakes"],[1,"snowflake"],[1,"year-background"],[1,"year-digit"],[1,"fireworks-container"],[1,"firework"],[1,"streamers-container"],[1,"streamer","left"],[1,"streamer","right"],[1,"confetti-container"],[1,"confetti"],[1,"newyear-countdown",3,"click"],[1,"countdown-hint"],[1,"countdown-title"],[1,"countdown-timer"],[1,"countdown-item"],[1,"countdown-value"],[1,"countdown-label"],[1,"countdown-separator"],[1,"newyear-celebration"],[1,"celebration-text"],[1,"fullscreen-countdown-overlay",3,"click"],[1,"fs-particles"],[1,"fs-particle"],[1,"fs-fireworks"],[1,"fs-firework"],[1,"fs-content",3,"click"],[1,"fs-title"],[1,"fs-title-text"],[1,"fs-year"],[1,"fs-countdown"],[1,"fs-countdown-item"],[1,"fs-countdown-value"],[1,"fs-countdown-label"],[1,"fs-countdown-separator"],[1,"fs-message"],[1,"fs-close",3,"click"],[1,"fs-instruction"],[1,"summer-sun"],[1,"sun-core"],[1,"sun-rays"],[1,"ray"],[1,"summer-clouds"],[1,"cloud","cloud-1"],[1,"cloud","cloud-2"],[1,"cloud","cloud-3"],[1,"summer-waves"],[1,"wave","wave-1"],[1,"wave","wave-2"],[1,"wave","wave-3"],[1,"summer-palms"],[1,"palm","palm-left"],[1,"palm","palm-right"],[1,"summer-greeting"],[1,"summer-greeting-content"],[1,"summer-icon"],[1,"summer-title"],[1,"summer-subtitle"],[1,"summer-decoration"],[1,"typing-char"],[1,"christmas-hat"],[1,"hat-base"],[1,"hat-tip"],[1,"hat-pompom"],[1,"hat-trim"],[1,"party-hat"],[1,"party-hat-cone"],[1,"party-hat-pompom"],[1,"party-hat-band"],[1,"party-hat-stripes"],[1,"newyear-glasses"],[1,"glasses-frame"],[1,"glasses-digit"],[1,"glasses-bridge"],[1,"glasses-arms"],[1,"glasses-arm","left"],[1,"glasses-arm","right"],[1,"summer-sunglasses"],[1,"sunglasses-frame"],[1,"sunglasses-lens","left"],[1,"sunglasses-bridge"],[1,"sunglasses-lens","right"],[1,"sunglasses-arms"],[1,"sunglasses-arm","left"],[1,"sunglasses-arm","right"],[1,"error-text"],[1,"error-message"],["name","alert-circle",3,"size"],[1,"w-5","h-5","border-2","border-white","border-t-transparent","rounded-full","animate-spin"]],template:function(r,s){r&1&&(q(0,"div",2),Ln(1,hg,2,0,"canvas",3)(2,dg,15,0,"div",4)(3,ug,3,0,"div",5)(4,fg,49,0,"div",6)(5,pg,9,0,"div",7)(6,mg,7,0,"div",8)(7,gg,7,0,"div",9)(8,xg,21,0,"div",10)(9,_g,32,5,"div",11)(10,vg,3,1,"div",12)(11,yg,57,5,"div",13)(12,bg,11,0,"div",14)(13,Sg,7,0,"div",15)(14,Mg,4,0,"div",16)(15,wg,5,0,"div",17)(16,Eg,10,0,"div",18),q(17,"div",19)(18,"div",20)(19,"div",21)(20,"div",22)(21,"div",23),Ln(22,Tg,2,3,"span",24),J()(),q(23,"div",25),ce(24,"div",26),Ln(25,Ag,5,0,"div",27)(26,Cg,5,0,"div",28)(27,Rg,14,0,"div",29)(28,Ig,8,0,"div",30),q(29,"div",31)(30,"div",32)(31,"div",33),ce(32,"div",34),J(),q(33,"div",35),ce(34,"div",34),J()(),q(35,"div",36),ce(36,"div",37)(37,"div",38),J(),ce(38,"div",39),J(),q(39,"div",40),ce(40,"div",41),J()()(),q(41,"h1"),st(42,"\xA1Bienvenido de vuelta!"),J(),q(43,"p"),st(44,"Inicia sesi\xF3n para continuar"),J()(),q(45,"form",42),ln("ngSubmit",function(){return s.onSubmit()}),q(46,"div",43)(47,"label",44),st(48,"Usuario"),J(),q(49,"div",45),ce(50,"lucide-angular",46),q(51,"input",47),ln("focus",function(){return s.onUsernameFocus()})("blur",function(){return s.onUsernameBlur()})("input",function(o){return s.onUsernameInput(o)}),J()(),Ln(52,Pg,2,0,"span",48)(53,Dg,2,0,"span",48),J(),q(54,"div",43)(55,"label",49),st(56,"Contrase\xF1a"),J(),q(57,"div",45),ce(58,"lucide-angular",50),q(59,"input",51),ln("focus",function(){return s.onPasswordFocus()})("blur",function(){return s.onPasswordBlur()}),J(),q(60,"button",52),ln("click",function(){return s.togglePasswordVisibility()}),ce(61,"lucide-angular",53),J()(),Ln(62,Lg,2,0,"span",48)(63,Fg,2,0,"span",48),J(),Ln(64,Ng,4,2,"div",54),q(65,"button",55),Ln(66,Ug,2,0,"span",56)(67,Og,1,0,"div",57),J()()()()),r&2&&(cn("christmas",s.showChristmasHat)("newyear",s.showNewYearTheme)("summer",s.showSummerTheme),Pt(),Kt("ngIf",s.showChristmasHat),Pt(),Kt("ngIf",s.showChristmasHat),Pt(),Kt("ngIf",s.showChristmasHat),Pt(),Kt("ngIf",s.showChristmasHat),Pt(),Kt("ngIf",s.showNewYearTheme),Pt(),Kt("ngIf",s.showNewYearTheme),Pt(),Kt("ngIf",s.showNewYearTheme),Pt(),Kt("ngIf",s.showNewYearTheme),Pt(),Kt("ngIf",s.showNewYearTheme&&!s.isNewYearArrived),Pt(),Kt("ngIf",s.showNewYearTheme&&s.isNewYearArrived),Pt(),Kt("ngIf",s.showFullscreenCountdown),Pt(),Kt("ngIf",s.showSummerTheme),Pt(),Kt("ngIf",s.showSummerTheme),Pt(),Kt("ngIf",s.showSummerTheme),Pt(),Kt("ngIf",s.showSummerTheme),Pt(),Kt("ngIf",s.showSummerTheme),Pt(4),cn("visible",s.showBubble),Pt(2),Kt("ngForOf",s.displayedChars),Pt(2),cn("hidden",s.showChristmasHat||s.showNewYearTheme||s.showSummerTheme),Pt(),Kt("ngIf",s.showChristmasHat),Pt(),Kt("ngIf",s.showNewYearTheme),Pt(),Kt("ngIf",s.showNewYearTheme),Pt(),Kt("ngIf",s.showSummerTheme),Pt(2),cn("hiding",!s.isGreeting&&s.hidePassword&&s.passwordFocused),Pt(2),rs("transform",s.getPupilTransform()),Pt(2),rs("transform",s.getPupilTransform()),Pt(),cn("covering",!s.isGreeting&&s.hidePassword&&s.passwordFocused)("waving",s.isWaving),Pt(3),cn("closed",!s.isGreeting&&!s.loginForm.valid),Pt(7),Kt("formGroup",s.loginForm),Pt(5),Kt("size",20),Pt(),cn("error",(s.username==null?null:s.username.invalid)&&(s.username==null?null:s.username.touched)),Pt(),Kt("ngIf",(s.username==null?null:s.username.hasError("required"))&&(s.username==null?null:s.username.touched)),Pt(),Kt("ngIf",(s.username==null?null:s.username.hasError("minlength"))&&(s.username==null?null:s.username.touched)),Pt(5),Kt("size",20),Pt(),cn("error",(s.password==null?null:s.password.invalid)&&(s.password==null?null:s.password.touched)),Kt("type",s.hidePassword?"password":"text"),Pt(),cn("showing",!s.hidePassword),sc("aria-label",s.hidePassword?"Mostrar contrase\xF1a":"Ocultar contrase\xF1a"),Pt(),Kt("name",s.hidePassword?"eye-off":"eye")("size",20),Pt(),Kt("ngIf",(s.password==null?null:s.password.hasError("required"))&&(s.password==null?null:s.password.touched)),Pt(),Kt("ngIf",(s.password==null?null:s.password.hasError("minlength"))&&(s.password==null?null:s.password.touched)),Pt(),Kt("ngIf",s.errorMessage),Pt(),Kt("disabled",s.loading||s.loginForm.invalid),Pt(),Kt("ngIf",!s.loading),Pt(),Kt("ngIf",s.loading))},dependencies:[lc,ac,oc,bc,xc,pc,mc,gc,_c,vc,uc,dc],styles:[`.login-container{display:flex;justify-content:center;align-items:center;height:100dvh;min-height:100vh;padding:4px;position:relative;overflow:hidden;background:#0a0e27}body.light-theme .login-container,:root.light .login-container{background:#f8fafc}.login-container:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 20% 50%,rgba(16,185,129,.15) 0%,transparent 50%),radial-gradient(circle at 80% 80%,rgba(59,130,246,.15) 0%,transparent 50%),radial-gradient(circle at 40% 20%,rgba(139,92,246,.1) 0%,transparent 50%);animation:gradientShift 15s ease infinite}body.light-theme .login-container:before,:root.light .login-container:before{background:radial-gradient(circle at 20% 50%,rgba(16,185,129,.08) 0%,transparent 50%),radial-gradient(circle at 80% 80%,rgba(59,130,246,.08) 0%,transparent 50%),radial-gradient(circle at 40% 20%,rgba(139,92,246,.06) 0%,transparent 50%)}@keyframes gradientShift{0%,to{opacity:1}50%{opacity:.8}}.login-container:after{content:"";position:absolute;width:100%;height:100%;background-image:radial-gradient(2px 2px at 20% 30%,rgba(255,255,255,.1),transparent),radial-gradient(2px 2px at 60% 70%,rgba(255,255,255,.08),transparent),radial-gradient(1px 1px at 50% 50%,rgba(255,255,255,.06),transparent),radial-gradient(2px 2px at 80% 10%,rgba(255,255,255,.09),transparent);background-size:200% 200%;animation:particleFloat 20s ease-in-out infinite}@keyframes particleFloat{0%,to{background-position:0% 0%}50%{background-position:100% 100%}}.login-card{width:100%;max-width:360px;position:relative;z-index:10}.login-card:before{content:"";position:absolute;inset:-2px;background:linear-gradient(135deg,#10b981,#3b82f6,#8b5cf6);border-radius:20px;opacity:.3;filter:blur(20px);animation:glowPulse 3s ease-in-out infinite}:root.light .login-card:before,body.light-theme .login-card:before{opacity:.15;filter:blur(30px)}@keyframes glowPulse{0%,to{opacity:.3;transform:scale(.98)}50%{opacity:.5;transform:scale(1.02)}}.login-card>*{position:relative;background:linear-gradient(135deg,#1e293bf2,#0f172afa);-webkit-backdrop-filter:blur(40px);backdrop-filter:blur(40px);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:20px 18px 18px;box-shadow:0 0 0 1px #ffffff0d inset,0 20px 60px #0009}body.light-theme .login-card>*,:root.light .login-card>*{background:linear-gradient(135deg,#fff,#fefefe);border:1px solid rgba(0,0,0,.08);box-shadow:0 0 0 1px #00000005 inset,0 20px 60px #0000001f}.login-header{text-align:center;margin-bottom:18px}.mascot-container{width:auto;max-width:240px;margin:0 auto 8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;animation:mascotEntry 1s cubic-bezier(.34,1.56,.64,1)}.speech-bubble{position:relative;z-index:50;background:linear-gradient(135deg,#10b981,#059669);padding:8px 14px;border-radius:16px;box-shadow:0 4px 16px #10b9814d,inset 0 1px 2px #ffffff4d;max-width:200px;min-height:40px;display:flex;align-items:center;justify-content:center;opacity:0;transform:scale(.8) translateY(-10px);transition:opacity .5s ease,transform .5s ease}.speech-bubble.visible{opacity:1;transform:scale(1) translateY(0);animation:bubbleFloat 3s ease-in-out infinite}.speech-bubble>div{color:#fff!important;font-size:13px;font-weight:600;text-align:center;line-height:1.4}.typing-text{text-align:center;font-size:13px;font-weight:600;line-height:1.3}.typing-char{display:inline-block;opacity:0;transform:translateY(10px);animation:charAppear .3s ease forwards;color:#fff!important;-webkit-text-fill-color:#ffffff!important;text-shadow:0 1px 2px rgba(0,0,0,.2);white-space:pre;min-width:.3em}@keyframes charAppear{0%{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.speech-bubble:after{content:"";position:absolute;bottom:-8px;left:50%;transform:translate(-50%);width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;border-top:10px solid #059669;filter:drop-shadow(0 2px 4px rgba(16,185,129,.2));opacity:0;transition:opacity .5s ease}.speech-bubble.visible:after{opacity:1}@keyframes bubbleFloat{0%,to{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes fadeInScale{0%{opacity:0;transform:scale(.8) translateY(-10px)}to{opacity:1;transform:scale(1) translateY(0)}}body.light-theme .speech-bubble,:root.light .speech-bubble{box-shadow:0 4px 16px #10b98133,inset 0 1px 2px #fff6}@keyframes mascotEntry{0%{opacity:0;transform:scale(0) translateY(-100px) rotate(-180deg)}60%{transform:scale(1.1) translateY(0) rotate(10deg)}80%{transform:scale(.95) rotate(-5deg)}to{opacity:1;transform:scale(1) translateY(0) rotate(0)}}.mascot-body{position:relative;width:100px;height:100px;z-index:1}.mascot-antenna{position:absolute;top:-12px;left:50%;transform:translate(-50%);width:3px;height:16px;background:linear-gradient(180deg,#10b981,#059669);border-radius:2px;animation:antennaWiggle 2s ease-in-out infinite}.mascot-antenna:after{content:"";position:absolute;top:-6px;left:50%;transform:translate(-50%);width:8px;height:8px;background:#10b981;border-radius:50%;box-shadow:0 0 12px #10b981cc;animation:antennaBlink 1.5s ease-in-out infinite}@keyframes antennaWiggle{0%,to{transform:translate(-50%) rotate(0)}25%{transform:translate(-50%) rotate(-8deg)}75%{transform:translate(-50%) rotate(8deg)}}@keyframes antennaBlink{0%,to{opacity:1}50%{opacity:.3}}.mascot-head{position:relative;width:80px;height:80px;margin:0 auto;background:linear-gradient(135deg,#f8fafc,#e2e8f0);border-radius:20px;box-shadow:0 8px 24px #00000080,0 0 0 3px #10b98199,0 0 0 1px #fff6 inset;display:flex;align-items:center;justify-content:center;overflow:visible;transition:all .4s ease}body.light-theme .mascot-head,:root.light .mascot-head{background:linear-gradient(135deg,#f8fafc,#e2e8f0);box-shadow:0 8px 24px #0000001a,0 0 0 3px #10b9814d,0 0 0 1px #0000000d inset}.mascot-eyes{display:flex;gap:20px;align-items:center;justify-content:center;transition:all .4s cubic-bezier(.34,1.56,.64,1)}.mascot-eyes.hiding{transform:scaleY(.1);opacity:0}.eye{width:18px;height:18px;background:#10b981;border-radius:50%;position:relative;box-shadow:0 2px 8px #10b98166;animation:blink 4s ease-in-out infinite;transition:background .4s ease;overflow:visible}body.light-theme .eye,:root.light .eye{background:#10b981}@keyframes blink{0%,96%,to{transform:scaleY(1)}98%{transform:scaleY(.1)}}.pupil{position:absolute;top:50%;left:50%;width:7px;height:7px;background:#fff;border-radius:50%;transition:transform .15s ease-out;box-shadow:0 0 6px #fffc;will-change:transform}.mascot-hands{position:absolute;inset:0;pointer-events:none;z-index:10}.hand{width:26px;height:26px;background:linear-gradient(135deg,#f8fafc,#e2e8f0);border-radius:50%;box-shadow:0 4px 12px #0006;position:absolute;top:50%;opacity:0;transform:translateY(50px)}body.light-theme .hand,:root.light .hand{background:linear-gradient(135deg,#f8fafc,#e2e8f0);box-shadow:0 4px 12px #00000026}.left-hand{left:-6px}.right-hand{right:-6px}.mascot-hands.waving .right-hand{animation:waveHand 2.5s ease-in-out forwards!important;opacity:1!important}@keyframes waveHand{0%{opacity:0;right:-6px;transform:translateY(50px) rotate(0)}12%{opacity:1;right:-25px;transform:translateY(-50%) rotate(0)}20%{right:-25px;transform:translateY(-50%) rotate(-40deg)}28%{right:-25px;transform:translateY(-50%) rotate(30deg)}36%{right:-25px;transform:translateY(-50%) rotate(-40deg)}44%{right:-25px;transform:translateY(-50%) rotate(30deg)}52%{right:-25px;transform:translateY(-50%) rotate(-40deg)}60%{right:-25px;transform:translateY(-50%) rotate(30deg)}68%{right:-25px;transform:translateY(-50%) rotate(-25deg)}76%{right:-25px;transform:translateY(-50%) rotate(15deg)}84%{right:-25px;transform:translateY(-50%) rotate(0)}92%{opacity:1;right:-6px;transform:translateY(-50%) rotate(0)}to{opacity:0;right:-6px;transform:translateY(50px) rotate(0)}}.mascot-hands.covering .hand{opacity:1!important;animation:coverEyes .5s cubic-bezier(.34,1.56,.64,1) forwards!important}@keyframes coverEyes{0%{opacity:0;transform:translateY(50px)}to{opacity:1;transform:translateY(-50%)}}.mascot-hands.covering .left-hand{left:6px!important}.mascot-hands.covering .right-hand{right:6px!important}.mascot-mouth{position:absolute;bottom:18px;left:50%;transform:translate(-50%);width:24px;height:12px;background:#10b981;border-radius:0 0 24px 24px;transition:all .4s cubic-bezier(.34,1.56,.64,1)}body.light-theme .mascot-mouth,:root.light .mascot-mouth{background:#10b981}.mascot-mouth.closed{width:18px;height:8px;background:transparent;border:2px solid #10B981;border-top:none;border-radius:0 0 18px 18px;animation:closeMouth .4s cubic-bezier(.34,1.56,.64,1)}body.light-theme .mascot-mouth.closed,:root.light .mascot-mouth.closed{border-color:#10b981;background:transparent}@keyframes closeMouth{0%{width:24px;height:12px;background:#10b981;border:none}to{width:18px;height:8px;background:transparent;border:2px solid #10B981;border-top:none}}.mascot-headset{position:absolute;top:-5px;left:50%;transform:translate(-50%);width:100px;height:50px;display:flex;align-items:center;justify-content:center;animation:headsetFloat 3s ease-in-out infinite}.mascot-headset:before{content:"";position:absolute;top:0;left:50%;transform:translate(-50%);width:70px;height:25px;border:3px solid #10B981;border-bottom:none;border-radius:35px 35px 0 0;box-shadow:0 2px 8px #10b9814d}.mascot-headset:after{content:"";position:absolute;left:0;top:20px;width:18px;height:22px;background:linear-gradient(135deg,#10b981,#059669);border-radius:8px;box-shadow:0 3px 10px #10b98166,inset 0 1px 2px #ffffff4d}.headset-right{position:absolute;right:0;top:20px;width:18px;height:22px;background:linear-gradient(135deg,#10b981,#059669);border-radius:8px;box-shadow:0 3px 10px #10b98166,inset 0 1px 2px #ffffff4d}.headset-right:before{content:"";position:absolute;right:0;bottom:2px;width:20px;height:2px;background:#10b981;border-radius:2px;transform-origin:right;transform:rotate(-35deg);box-shadow:0 1px 3px #10b9814d}.headset-right:after{content:"";position:absolute;right:16px;bottom:-4px;width:6px;height:6px;background:#059669;border-radius:50%;box-shadow:0 2px 6px #10b98180}@keyframes headsetFloat{0%,to{transform:translate(-50%) translateY(0)}50%{transform:translate(-50%) translateY(-4px)}}body.light-theme .mascot-headset:before,:root.light .mascot-headset:before{border-color:#10b981;box-shadow:0 2px 8px #10b98133}.login-header h1{font-size:22px;font-weight:800;margin:0;letter-spacing:-.5px;background:linear-gradient(135deg,#fff,#cbd5e1);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:fadeInUp .8s ease .3s backwards}body.light-theme .login-header h1,:root.light .login-header h1{background:linear-gradient(135deg,#020617,#334155)!important;-webkit-background-clip:text!important;-webkit-text-fill-color:transparent!important;background-clip:text!important;color:transparent!important}.login-header p{font-size:12px;color:#94a3b8;margin:0;font-weight:500;animation:fadeInUp .8s ease .4s backwards}body.light-theme .login-header p,:root.light .login-header p{color:#475569!important;font-weight:600}@keyframes fadeInUp{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}.login-form{display:flex;flex-direction:column;gap:12px}.form-group{display:flex;flex-direction:column;gap:4px;animation:fadeInUp .6s ease .3s backwards}.form-group:nth-child(2){animation-delay:.4s}.form-group label{font-size:10px;font-weight:700;color:#e2e8f0;text-transform:uppercase;letter-spacing:.5px;margin-left:2px}body.light-theme .form-group label,:root.light .form-group label{color:#1e293b;font-weight:800}.input-wrapper{position:relative;display:flex;align-items:center;gap:0;background:#0f172a66;border:1.5px solid rgba(148,163,184,.2);border-radius:10px;padding:0 12px;transition:all .4s cubic-bezier(.4,0,.2,1);height:44px;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}body.dark-theme .input-wrapper:hover,:root.dark .input-wrapper:hover,.input-wrapper:hover{background:#0f172a99;border-color:#94a3b859;transform:translateY(-2px);box-shadow:0 8px 24px #0003}body.dark-theme .input-wrapper:focus-within,:root.dark .input-wrapper:focus-within,.input-wrapper:focus-within{background:#0f172ab3;border-color:#10b981;border-width:2px;padding:0 11px;transform:translateY(-2px);box-shadow:0 12px 32px #10b98133,0 0 0 4px #10b9811a}body.light-theme .login-container .input-wrapper,body.light-theme .login-form .input-wrapper,body.light-theme .login-card .input-wrapper,:root.light .login-container .input-wrapper,:root.light .login-form .input-wrapper,:root.light .login-card .input-wrapper{background:#fff!important;background-color:#fff!important;border:2px solid #cbd5e1!important;padding:0 11px!important}body.light-theme .login-container .input-wrapper:hover,body.light-theme .login-form .input-wrapper:hover,body.light-theme .login-card .input-wrapper:hover,:root.light .login-container .input-wrapper:hover,:root.light .login-form .input-wrapper:hover,:root.light .login-card .input-wrapper:hover{background:#f8fafc!important;background-color:#f8fafc!important;border-color:#94a3b8!important;border-width:2px!important;padding:0 11px!important;transform:translateY(-2px);box-shadow:0 8px 24px #00000014}body.light-theme .login-container .input-wrapper:focus-within,body.light-theme .login-form .input-wrapper:focus-within,body.light-theme .login-card .input-wrapper:focus-within,:root.light .login-container .input-wrapper:focus-within,:root.light .login-form .input-wrapper:focus-within,:root.light .login-card .input-wrapper:focus-within{background:#fff!important;background-color:#fff!important;border-color:#10b981!important;border-width:2px!important;padding:0 11px!important;transform:translateY(-2px);box-shadow:0 12px 32px #10b98126,0 0 0 4px #10b98114}.input-wrapper.error,.input-wrapper:has(input.error){border-color:#ef4444;border-width:2px;padding:0 11px;background:#ef44440d;animation:shake .5s ease}@keyframes shake{0%,to{transform:translate(0)}25%{transform:translate(-8px)}75%{transform:translate(8px)}}.input-icon{font-size:18px;width:18px;height:18px;color:#e2e8f0;margin-right:8px;flex-shrink:0;transition:all .4s cubic-bezier(.4,0,.2,1);pointer-events:none}body.light-theme .login-container .input-icon,body.light-theme .login-form .input-icon,body.light-theme .login-card .input-icon,:root.light .login-container .input-icon,:root.light .login-form .input-icon,:root.light .login-card .input-icon{color:#334155!important}.input-wrapper:focus-within .input-icon{color:#10b981!important;transform:scale(1.1) rotate(-5deg)}.input-wrapper input{flex:1;background:transparent!important;border:none!important;outline:none!important;box-shadow:none!important;color:#f8fafc!important;font-size:14px;font-weight:500;padding:0!important;margin:0!important;height:100%;letter-spacing:.3px;width:100%;min-width:0;-webkit-text-fill-color:#f8fafc!important;-webkit-opacity:1!important}.input-wrapper input:focus,.input-wrapper input:active{border:none!important;outline:none!important;box-shadow:none!important}body.light-theme .login-container .input-wrapper input,body.light-theme .login-form .input-wrapper input,body.light-theme .login-card .input-wrapper input,:root.light .login-container .input-wrapper input,:root.light .login-form .input-wrapper input,:root.light .login-card .input-wrapper input{color:#020617!important;font-weight:600!important;-webkit-text-fill-color:#020617!important;background-color:transparent!important;background:transparent!important;opacity:1!important;-webkit-opacity:1!important;border:none!important;outline:none!important;box-shadow:none!important}.input-wrapper input::placeholder{color:#64748b!important;opacity:.5!important;font-weight:400}body.light-theme .login-container .input-wrapper input::placeholder,body.light-theme .login-form .input-wrapper input::placeholder,body.light-theme .login-card .input-wrapper input::placeholder,:root.light .login-container .input-wrapper input::placeholder,:root.light .login-form .input-wrapper input::placeholder,:root.light .login-card .input-wrapper input::placeholder{color:#475569!important;opacity:.7!important;font-weight:500}.input-wrapper input:-webkit-autofill{-webkit-box-shadow:0 0 0 1000px rgba(15,23,42,.9) inset!important;-webkit-text-fill-color:#f8fafc!important;transition:background-color 5000s ease-in-out 0s}body.light-theme .login-container .input-wrapper input:-webkit-autofill,body.light-theme .login-form .input-wrapper input:-webkit-autofill,body.light-theme .login-card .input-wrapper input:-webkit-autofill,:root.light .login-container .input-wrapper input:-webkit-autofill,:root.light .login-form .input-wrapper input:-webkit-autofill,:root.light .login-card .input-wrapper input:-webkit-autofill{-webkit-box-shadow:0 0 0 1000px #ffffff inset!important;-webkit-text-fill-color:#020617!important;transition:background-color 5000s ease-in-out 0s}@keyframes onAutoFillStart{0%{opacity:.99}to{opacity:1}}@keyframes onAutoFillCancel{0%{opacity:.99}to{opacity:1}}.input-wrapper input:-webkit-autofill{animation-name:onAutoFillStart;animation-duration:1ms}.input-wrapper input:not(:-webkit-autofill){animation-name:onAutoFillCancel;animation-duration:1ms}.toggle-password{background:transparent;border:none;cursor:pointer;padding:4px;display:flex;align-items:center;justify-content:center;margin-left:8px;margin-right:-8px;border-radius:6px;transition:all .3s cubic-bezier(.4,0,.2,1);position:relative;overflow:hidden;flex-shrink:0}.toggle-password:before{content:"";position:absolute;inset:0;background:radial-gradient(circle,rgba(16,185,129,.2) 0%,transparent 70%);opacity:0;transform:scale(0);transition:all .5s cubic-bezier(.4,0,.2,1)}.toggle-password:hover:before{opacity:1;transform:scale(1.5)}.toggle-password mat-icon{font-size:18px;width:18px;height:18px;color:#e2e8f0;transition:all .3s cubic-bezier(.4,0,.2,1);position:relative;z-index:1}body.light-theme .login-container .toggle-password mat-icon,body.light-theme .login-form .toggle-password mat-icon,body.light-theme .login-card .toggle-password mat-icon,:root.light .login-container .toggle-password mat-icon,:root.light .login-form .toggle-password mat-icon,:root.light .login-card .toggle-password mat-icon{color:#334155!important}.toggle-password:hover{background:#10b98126;transform:scale(1.15)}.toggle-password:hover mat-icon{color:#10b981!important;transform:scale(1.2) rotate(10deg);filter:drop-shadow(0 0 8px rgba(16,185,129,.6))}.toggle-password:active{transform:scale(.9)}.toggle-password:active mat-icon{transform:scale(1) rotate(-10deg)}.toggle-password.showing mat-icon{animation:peek .7s cubic-bezier(.34,1.56,.64,1);color:#10b981!important}@keyframes peek{0%{transform:scale(1)}30%{transform:scale(1.4) translateY(-4px) rotate(15deg)}60%{transform:scale(1.2) translateY(-2px) rotate(-10deg)}to{transform:scale(1.15) rotate(0)}}.error-text{font-size:11px;color:#fca5a5;margin-top:-2px;margin-left:2px;display:flex;align-items:center;gap:4px;font-weight:500;animation:fadeIn .3s ease}.error-text:before{content:"\\26a0";font-size:12px}@keyframes fadeIn{0%{opacity:0}to{opacity:1}}.error-message{display:flex;align-items:center;gap:8px;padding:10px 12px;background:linear-gradient(135deg,#ef444426,#ef444414);border:1.5px solid rgba(239,68,68,.4);border-radius:10px;color:#fca5a5;font-size:12px;font-weight:500;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);animation:errorSlide .4s cubic-bezier(.34,1.56,.64,1);box-shadow:0 8px 24px #ef444433}@keyframes errorSlide{0%{opacity:0;transform:translateY(-20px) scale(.9)}to{opacity:1;transform:translateY(0) scale(1)}}.error-message mat-icon{font-size:18px;width:18px;height:18px;color:#fca5a5;flex-shrink:0;animation:errorPulse 1s ease infinite}@keyframes errorPulse{0%,to{transform:scale(1)}50%{transform:scale(1.1)}}.login-button{width:100%;height:44px;background:linear-gradient(135deg,#10b981,#059669);border:none;border-radius:10px;color:#fff;font-size:13px;font-weight:700;cursor:pointer;transition:all .4s cubic-bezier(.4,0,.2,1);box-shadow:0 12px 32px #10b98166,0 0 0 1px #ffffff1a inset;position:relative;overflow:hidden;margin-top:4px;text-transform:uppercase;letter-spacing:1px;animation:fadeInUp .6s ease .5s backwards}.login-button:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent);transform:translate(-100%);transition:transform .6s ease}.login-button:after{content:"";position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.1) 0%,transparent 50%);opacity:0;transition:opacity .4s ease}.login-button:hover:not(:disabled):before{transform:translate(100%)}.login-button:hover:not(:disabled):after{opacity:1}.login-button:hover:not(:disabled){background:linear-gradient(135deg,#059669,#047857);box-shadow:0 16px 48px #10b98180,0 0 0 1px #fff3 inset;transform:translateY(-3px)}.login-button:active:not(:disabled){transform:translateY(-1px) scale(.98);box-shadow:0 8px 24px #10b9814d,0 0 0 1px #ffffff1a inset}.login-button:disabled{background:linear-gradient(135deg,#334155,#1e293b);color:#64748b;cursor:not-allowed;opacity:.5;box-shadow:none;transform:none}.login-button mat-spinner{margin:0 auto}::ng-deep .login-button mat-spinner circle{stroke:#fff}@media (max-width: 480px){.login-container{padding:4px}.login-card>*{padding:18px 16px 16px}.login-header{margin-bottom:16px}.login-header h1{font-size:20px}.login-icon{width:44px;height:44px;margin-bottom:10px}.login-icon mat-icon{font-size:22px;width:22px;height:22px}.login-form{gap:10px}.input-wrapper{height:42px}.login-button{height:42px;font-size:12px}}.login-button:focus-visible{outline:3px solid #10B981;outline-offset:4px}.toggle-password:focus-visible{outline:2px solid #10B981;outline-offset:2px}.input-wrapper:focus-within{outline:none}@media (prefers-reduced-motion: reduce){*,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}@media (prefers-contrast: high){.input-wrapper{border-width:2px}.login-button{border:2px solid transparent}}.mascot-antenna.hidden{display:none}.snowflakes{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:100;overflow:hidden}.snowflake{position:absolute;top:-50px;color:#ffffffe6;font-size:1.5rem;text-shadow:0 0 10px rgba(255,255,255,.8);animation:snowfall linear infinite;-webkit-user-select:none;user-select:none}body.light-theme .snowflake,:root.light .snowflake{color:#3b82f699;text-shadow:0 0 8px rgba(59,130,246,.4)}.snowflake:nth-child(1){left:5%;font-size:1.2rem;animation-duration:8s;animation-delay:0s;opacity:.8}.snowflake:nth-child(2){left:15%;font-size:2rem;animation-duration:12s;animation-delay:2s;opacity:.9}.snowflake:nth-child(3){left:25%;font-size:1rem;animation-duration:10s;animation-delay:4s;opacity:.7}.snowflake:nth-child(4){left:35%;font-size:1.8rem;animation-duration:14s;animation-delay:1s;opacity:.85}.snowflake:nth-child(5){left:45%;font-size:1.4rem;animation-duration:9s;animation-delay:3s;opacity:.75}.snowflake:nth-child(6){left:55%;font-size:2.2rem;animation-duration:11s;animation-delay:5s;opacity:.95}.snowflake:nth-child(7){left:65%;font-size:1.1rem;animation-duration:13s;animation-delay:.5s;opacity:.7}.snowflake:nth-child(8){left:75%;font-size:1.6rem;animation-duration:10s;animation-delay:2.5s;opacity:.8}.snowflake:nth-child(9){left:85%;font-size:1.3rem;animation-duration:15s;animation-delay:4.5s;opacity:.85}.snowflake:nth-child(10){left:92%;font-size:1.9rem;animation-duration:8s;animation-delay:1.5s;opacity:.9}.snowflake:nth-child(11){left:10%;font-size:1rem;animation-duration:11s;animation-delay:6s;opacity:.65}.snowflake:nth-child(12){left:50%;font-size:2.5rem;animation-duration:16s;animation-delay:3.5s;opacity:1}.snowflake:nth-child(13){left:3%;font-size:1.5rem;animation-duration:9s;animation-delay:7s;opacity:.8}.snowflake:nth-child(14){left:20%;font-size:1.1rem;animation-duration:11s;animation-delay:8s;opacity:.7}.snowflake:nth-child(15){left:30%;font-size:1.7rem;animation-duration:13s;animation-delay:6.5s;opacity:.85}.snowflake:nth-child(16){left:40%;font-size:1.3rem;animation-duration:10s;animation-delay:9s;opacity:.75}.snowflake:nth-child(17){left:58%;font-size:1.9rem;animation-duration:12s;animation-delay:7.5s;opacity:.9}.snowflake:nth-child(18){left:68%;font-size:1rem;animation-duration:8s;animation-delay:10s;opacity:.65}.snowflake:nth-child(19){left:78%;font-size:2.1rem;animation-duration:14s;animation-delay:8.5s;opacity:.95}.snowflake:nth-child(20){left:88%;font-size:1.4rem;animation-duration:11s;animation-delay:9.5s;opacity:.8}.snowflake:nth-child(21){left:95%;font-size:1.2rem;animation-duration:9s;animation-delay:11s;opacity:.7}.snowflake:nth-child(22){left:12%;font-size:1.6rem;animation-duration:15s;animation-delay:10.5s;opacity:.85}.snowflake:nth-child(23){left:62%;font-size:1.8rem;animation-duration:10s;animation-delay:12s;opacity:.9}.snowflake:nth-child(24){left:82%;font-size:1.1rem;animation-duration:13s;animation-delay:11.5s;opacity:.75}@keyframes snowfall{0%{top:-50px;transform:translate(0) rotate(0);opacity:1}25%{transform:translate(15px) rotate(90deg)}50%{transform:translate(-10px) rotate(180deg);opacity:.8}75%{transform:translate(20px) rotate(270deg)}to{top:100vh;transform:translate(-15px) rotate(360deg);opacity:.3}}.login-container.christmas .speech-bubble{background:linear-gradient(135deg,#dc2626,#b91c1c)!important;box-shadow:0 4px 16px #dc262666,inset 0 1px 2px #ffffff4d!important}.login-container.christmas .speech-bubble:after{border-top-color:#b91c1c!important}.login-container.christmas .mascot-container{gap:16px;margin-bottom:12px}.christmas-hat{position:absolute;top:-52px;left:50%;transform:translate(-50%);width:90px;height:70px;z-index:5;animation:hatBob 3s ease-in-out infinite}@keyframes hatBob{0%,to{transform:translate(-50%) rotate(0)}50%{transform:translate(-50%) rotate(2deg)}}.hat-base{position:absolute;bottom:0;left:50%;transform:translate(-50%);width:85px;height:45px;background:#dc2626;border-radius:50% 50% 5px 5px;box-shadow:0 4px 8px #0003}.hat-tip{position:absolute;top:8px;left:50%;transform:translate(-50%);width:50px;height:35px;background:#dc2626;border-radius:50% 80% 50% 50%;transform-origin:center bottom;box-shadow:0 2px 6px #00000026;z-index:2}.hat-tip:after{content:"";position:absolute;top:-5px;right:-25px;width:40px;height:25px;background:#dc2626;border-radius:50%;animation:tipDroop 3s ease-in-out infinite;transform-origin:left center}@keyframes tipDroop{0%,to{transform:rotate(10deg) translateY(0)}50%{transform:rotate(20deg) translateY(3px)}}.hat-pompom{position:absolute;top:-2px;right:-12px;width:20px;height:20px;background:#fff;border-radius:50%;box-shadow:0 2px 6px #0003,inset -2px -2px 4px #0000001a;animation:pompomBounce 3s ease-in-out infinite;z-index:3}@keyframes pompomBounce{0%,to{transform:translate(0) rotate(10deg)}50%{transform:translate(8px,5px) rotate(20deg)}}.hat-trim{position:absolute;bottom:-6px;left:50%;transform:translate(-50%);width:94px;height:16px;background:#fff;border-radius:10px;box-shadow:0 2px 6px #00000026,inset 0 -2px 4px #0000000d;z-index:4}.confetti-container{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;overflow:hidden}.confetti{position:absolute;width:10px;height:10px;top:-20px;animation:confetti-fall linear infinite}.confetti:nth-child(1){left:5%;width:8px;height:8px;background:gold;animation-duration:6s;animation-delay:0s;border-radius:50%}.confetti:nth-child(2){left:12%;width:12px;height:4px;background:orange;animation-duration:8s;animation-delay:1s;border-radius:2px}.confetti:nth-child(3){left:20%;width:6px;height:6px;background:silver;animation-duration:7s;animation-delay:2s;border-radius:50%}.confetti:nth-child(4){left:28%;width:10px;height:3px;background:gold;animation-duration:9s;animation-delay:.5s;border-radius:2px}.confetti:nth-child(5){left:35%;width:8px;height:8px;background:orange;animation-duration:6.5s;animation-delay:3s;border-radius:50%}.confetti:nth-child(6){left:42%;width:14px;height:5px;background:gold;animation-duration:10s;animation-delay:1.5s;border-radius:2px}.confetti:nth-child(7){left:50%;width:7px;height:7px;background:silver;animation-duration:7.5s;animation-delay:4s;border-radius:50%}.confetti:nth-child(8){left:58%;width:11px;height:4px;background:orange;animation-duration:8.5s;animation-delay:2.5s;border-radius:2px}.confetti:nth-child(9){left:65%;width:9px;height:9px;background:gold;animation-duration:6s;animation-delay:5s;border-radius:50%}.confetti:nth-child(10){left:72%;width:13px;height:4px;background:silver;animation-duration:9.5s;animation-delay:.8s;border-radius:2px}.confetti:nth-child(11){left:78%;width:6px;height:6px;background:gold;animation-duration:7s;animation-delay:3.5s;border-radius:50%}.confetti:nth-child(12){left:85%;width:10px;height:3px;background:orange;animation-duration:8s;animation-delay:6s;border-radius:2px}.confetti:nth-child(13){left:92%;width:8px;height:8px;background:silver;animation-duration:6.8s;animation-delay:1.2s;border-radius:50%}.confetti:nth-child(14){left:8%;width:12px;height:5px;background:gold;animation-duration:9s;animation-delay:4.5s;border-radius:2px}.confetti:nth-child(15){left:25%;width:7px;height:7px;background:orange;animation-duration:7.2s;animation-delay:2s;border-radius:50%}.confetti:nth-child(16){left:38%;width:9px;height:3px;background:silver;animation-duration:8.2s;animation-delay:5.5s;border-radius:2px}.confetti:nth-child(17){left:55%;width:10px;height:10px;background:gold;animation-duration:6.3s;animation-delay:.3s;border-radius:50%}.confetti:nth-child(18){left:68%;width:8px;height:4px;background:orange;animation-duration:9.2s;animation-delay:3.8s;border-radius:2px}.confetti:nth-child(19){left:82%;width:11px;height:11px;background:silver;animation-duration:7.8s;animation-delay:1.8s;border-radius:50%}.confetti:nth-child(20){left:95%;width:6px;height:3px;background:gold;animation-duration:8.8s;animation-delay:4.2s;border-radius:2px}@keyframes confetti-fall{0%{top:-20px;transform:translate(0) rotate(0);opacity:1}25%{transform:translate(15px) rotate(90deg)}50%{transform:translate(-10px) rotate(180deg);opacity:.8}75%{transform:translate(20px) rotate(270deg)}to{top:100vh;transform:translate(-5px) rotate(360deg);opacity:.3}}.newyear-countdown{position:fixed;top:50%;left:30px;transform:translateY(-50%);z-index:100;text-align:center;padding:24px 20px;background:#00000059;border:1px solid rgba(255,215,0,.5);border-radius:20px;box-shadow:0 0 0 1px #ffd70026,0 10px 40px #0003,0 0 40px #ffd7001a;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);animation:countdown-float 4s ease-in-out infinite;transition:all .4s cubic-bezier(.4,0,.2,1)}.newyear-countdown:hover{transform:translateY(-50%) scale(1.05);background:#00000080;border-color:#ffd700cc;box-shadow:0 0 0 2px #ffd7004d,0 15px 50px #0000004d,0 0 80px #ffd70040}.newyear-countdown:hover .countdown-value{animation:value-glow-intense .5s ease-in-out infinite alternate}@keyframes value-glow-intense{0%{filter:drop-shadow(0 2px 8px rgba(255,165,0,.6));transform:scale(1)}to{filter:drop-shadow(0 4px 16px rgba(255,165,0,1));transform:scale(1.05)}}.newyear-countdown:before{content:"";position:absolute;inset:-2px;background:linear-gradient(45deg,gold,orange,gold,orange);background-size:300% 300%;border-radius:22px;z-index:-2;animation:border-glow 3s ease infinite;opacity:.5}@keyframes border-glow{0%,to{background-position:0% 50%}50%{background-position:100% 50%}}@keyframes countdown-float{0%,to{transform:translateY(-50%) translate(0)}50%{transform:translateY(-50%) translate(5px)}}.countdown-title{font-size:11px;font-weight:800;letter-spacing:4px;margin-bottom:16px;background:linear-gradient(90deg,gold,#fff8dc,gold);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 3s linear infinite;position:relative}.countdown-title:after{content:"";position:absolute;bottom:-8px;left:50%;transform:translate(-50%);width:40px;height:2px;background:linear-gradient(90deg,transparent,#FFD700,transparent)}@keyframes shimmer{0%{background-position:-200% center}to{background-position:200% center}}.countdown-timer{display:flex;flex-direction:column;align-items:center;gap:12px}.countdown-item{display:flex;flex-direction:column;align-items:center;padding:8px 16px;background:linear-gradient(180deg,#ffd7001a,#ffa5000d);border-radius:12px;border:1px solid rgba(255,215,0,.2);min-width:70px;position:relative;overflow:hidden}.countdown-item:before{content:"";position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,215,0,.2),transparent);animation:item-shine 2s ease-in-out infinite}@keyframes item-shine{0%{left:-100%}50%,to{left:100%}}.countdown-value{font-size:36px;font-weight:900;font-family:Arial Black,sans-serif;background:linear-gradient(180deg,gold,orange 40%,#ff8c00);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1;filter:drop-shadow(0 2px 4px rgba(255,165,0,.4));animation:value-glow 1s ease-in-out infinite alternate}@keyframes value-glow{0%{filter:drop-shadow(0 2px 4px rgba(255,165,0,.4))}to{filter:drop-shadow(0 2px 8px rgba(255,165,0,.8))}}.countdown-label{font-size:8px;font-weight:700;letter-spacing:2px;color:#ffd700b3;margin-top:4px;text-transform:uppercase}.countdown-separator{display:none}.newyear-celebration{position:fixed;top:20px;left:50%;transform:translate(-50%);z-index:100;text-align:center;padding:20px 40px;background:linear-gradient(135deg,#14141ef2,#0a0a14fa);border:2px solid #FFD700;border-radius:20px;box-shadow:0 8px 40px #ffd70066,0 0 80px #ffa50033;-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);animation:celebration-bounce .6s cubic-bezier(.34,1.56,.64,1)}@keyframes celebration-bounce{0%{transform:translate(-50%) scale(0);opacity:0}60%{transform:translate(-50%) scale(1.1)}to{transform:translate(-50%) scale(1);opacity:1}}.celebration-text{font-size:20px;font-weight:900;letter-spacing:2px;background:linear-gradient(135deg,gold,orange,gold 60%,orange);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shine 2s linear infinite}@keyframes shine{0%{background-position:0% center}to{background-position:200% center}}.party-hat{position:absolute;top:-55px;left:50%;transform:translate(-50%);width:70px;height:70px;z-index:5;animation:party-hat-bob 2s ease-in-out infinite}@keyframes party-hat-bob{0%,to{transform:translate(-50%) rotate(-5deg)}50%{transform:translate(-50%) rotate(5deg)}}.party-hat-cone{position:absolute;bottom:0;left:50%;transform:translate(-50%);width:0;height:0;border-left:30px solid transparent;border-right:30px solid transparent;border-bottom:55px solid #FFD700;filter:drop-shadow(0 4px 8px rgba(0,0,0,.3))}.party-hat-stripes{position:absolute;bottom:0;left:50%;transform:translate(-50%);width:0;height:0;border-left:30px solid transparent;border-right:30px solid transparent;border-bottom:55px solid transparent;background:repeating-linear-gradient(-45deg,transparent,transparent 5px,rgba(255,165,0,.6) 5px,rgba(255,165,0,.6) 10px);-webkit-mask:linear-gradient(to top,black,black);mask:linear-gradient(to top,black,black);clip-path:polygon(50% 0%,0% 100%,100% 100%);width:60px;height:55px}.party-hat-pompom{position:absolute;top:0;left:50%;transform:translate(-50%);width:16px;height:16px;background:radial-gradient(circle,#ff6b6b,#ff4757);border-radius:50%;box-shadow:0 2px 8px #ff475780;animation:pompom-bounce .5s ease-in-out infinite}@keyframes pompom-bounce{0%,to{transform:translate(-50%) translateY(0)}50%{transform:translate(-50%) translateY(-3px)}}.party-hat-band{position:absolute;bottom:-2px;left:50%;transform:translate(-50%);width:64px;height:8px;background:linear-gradient(90deg,orange,gold,orange);border-radius:4px;box-shadow:0 2px 4px #0003}.login-container.newyear .speech-bubble{background:linear-gradient(135deg,gold,orange)!important;box-shadow:0 4px 16px #ffd70066,inset 0 1px 2px #fff6!important}.login-container.newyear .speech-bubble:after{border-top-color:orange!important}.login-container.newyear .speech-bubble .typing-char{color:#1a1a2e!important;-webkit-text-fill-color:#1a1a2e!important;text-shadow:none}.login-container.newyear .mascot-container{gap:16px;margin-bottom:12px}.year-background{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);display:flex;gap:10px;z-index:0;pointer-events:none;opacity:.06}.year-digit{font-size:28vw;font-weight:900;font-family:Arial Black,sans-serif;background:linear-gradient(180deg,gold,orange,#ff8c00);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:.85;animation:digit-pulse 4s ease-in-out infinite}.year-digit:nth-child(1){animation-delay:0s}.year-digit:nth-child(2){animation-delay:.5s}.year-digit:nth-child(3){animation-delay:1s}.year-digit:nth-child(4){animation-delay:1.5s}@keyframes digit-pulse{0%,to{opacity:1;transform:scale(1)}50%{opacity:.7;transform:scale(1.02)}}.fireworks-container{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2;overflow:hidden}.firework{position:absolute;width:4px;height:4px;border-radius:50%;box-shadow:0 0 #fff,0 -70px 0 2px var(--c1, #FFD700),35px -60px 0 2px var(--c2, #FFA500),60px -35px 0 2px var(--c1, #FFD700),70px 0 0 2px var(--c2, #FFA500),60px 35px 0 2px var(--c1, #FFD700),35px 60px 0 2px var(--c2, #FFA500),0 70px 0 2px var(--c1, #FFD700),-35px 60px 0 2px var(--c2, #FFA500),-60px 35px 0 2px var(--c1, #FFD700),-70px 0 0 2px var(--c2, #FFA500),-60px -35px 0 2px var(--c1, #FFD700),-35px -60px 0 2px var(--c2, #FFA500),0 -40px 0 1px var(--c2, #FFA500),28px -28px 0 1px var(--c1, #FFD700),40px 0 0 1px var(--c2, #FFA500),28px 28px 0 1px var(--c1, #FFD700),0 40px 0 1px var(--c2, #FFA500),-28px 28px 0 1px var(--c1, #FFD700),-40px 0 0 1px var(--c2, #FFA500),-28px -28px 0 1px var(--c1, #FFD700);animation:firework-burst 3s ease-out infinite;opacity:0}.firework:before{content:"";position:absolute;width:3px;height:20px;background:linear-gradient(to top,transparent,var(--c1, #FFD700),#fff);border-radius:50%;transform:translate(-50%);animation:firework-trail 3s ease-out infinite}.firework:after{content:"";position:absolute;width:3px;height:3px;border-radius:50%;box-shadow:20px -50px 0 1px var(--c1, #FFD700),-25px -45px 0 1px var(--c2, #FFA500),45px -25px 0 1px var(--c1, #FFD700),-50px -20px 0 1px var(--c2, #FFA500),50px 20px 0 1px var(--c1, #FFD700),-45px 30px 0 1px var(--c2, #FFA500),15px 50px 0 1px var(--c1, #FFD700),-20px 45px 0 1px var(--c2, #FFA500);animation:firework-sparkle 3s ease-out infinite;opacity:0}.firework:nth-child(1){--c1: #FFD700;--c2: #FFA500;left:15%;top:35%;animation-delay:0s}.firework:nth-child(2){--c1: #FFA500;--c2: #FF8C00;left:80%;top:25%;animation-delay:1s}.firework:nth-child(3){--c1: #FFCC00;--c2: #FFD700;left:50%;top:40%;animation-delay:2s}.firework:nth-child(4){--c1: #FFD700;--c2: #FFCC00;left:25%;top:20%;animation-delay:1.5s}.firework:nth-child(5){--c1: #FFA500;--c2: #FFD700;left:70%;top:45%;animation-delay:2.5s}.firework:nth-child(6){--c1: #FF8C00;--c2: #FFA500;left:40%;top:30%;animation-delay:.5s}@keyframes firework-trail{0%{opacity:1;transform:translate(-50%) translateY(100vh)}30%{opacity:1;transform:translate(-50%) translateY(0)}35%,to{opacity:0;transform:translate(-50%) translateY(0)}}@keyframes firework-burst{0%,30%{opacity:0;transform:scale(0)}35%{opacity:1;transform:scale(.3)}50%{opacity:1;transform:scale(1)}70%{opacity:.6;transform:scale(1.2)}to{opacity:0;transform:scale(1.4)}}@keyframes firework-sparkle{0%,30%{opacity:0;transform:scale(0)}40%{opacity:1;transform:scale(1)}60%{opacity:.8;transform:scale(1.5) translateY(10px)}to{opacity:0;transform:scale(.5) translateY(40px)}}.streamers-container{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;overflow:hidden}.streamer{position:absolute;width:8px;height:100px;border-radius:4px;animation:streamer-fall 8s linear infinite}.streamer.left{left:0;transform-origin:top left}.streamer.right{right:0;transform-origin:top right}.streamer:nth-child(1){background:linear-gradient(180deg,gold,orange,gold);top:-100px;left:5%;animation-delay:0s;animation-duration:7s}.streamer:nth-child(2){background:linear-gradient(180deg,orange,#ff8c00,orange);top:-100px;left:12%;animation-delay:2s;animation-duration:9s;width:6px}.streamer:nth-child(3){background:linear-gradient(180deg,silver,#a0a0a0,silver);top:-100px;left:8%;animation-delay:4s;animation-duration:8s;width:5px}.streamer:nth-child(4){background:linear-gradient(180deg,gold,#fc0,gold);top:-100px;right:5%;left:auto;animation-delay:1s;animation-duration:8s}.streamer:nth-child(5){background:linear-gradient(180deg,orange,gold,orange);top:-100px;right:10%;left:auto;animation-delay:3s;animation-duration:7s;width:7px}.streamer:nth-child(6){background:linear-gradient(180deg,silver,#d4af37,silver);top:-100px;right:15%;left:auto;animation-delay:5s;animation-duration:9s;width:5px}@keyframes streamer-fall{0%{top:-100px;transform:rotate(0) translate(0);opacity:1}25%{transform:rotate(15deg) translate(30px)}50%{transform:rotate(-10deg) translate(-20px);opacity:.8}75%{transform:rotate(20deg) translate(40px)}to{top:100vh;transform:rotate(-5deg) translate(-10px);opacity:.3}}.newyear-glasses{position:absolute;top:12px;left:50%;transform:translate(-50%);z-index:15;animation:glasses-bounce 2s ease-in-out infinite}@keyframes glasses-bounce{0%,to{transform:translate(-50%) rotate(-2deg)}50%{transform:translate(-50%) rotate(2deg)}}.glasses-frame{display:flex;align-items:center;gap:2px}.glasses-digit{width:18px;height:22px;background:linear-gradient(180deg,gold,orange,#ff8c00);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;color:#1a1a2e;font-family:Arial Black,sans-serif;box-shadow:0 2px 4px #0000004d,inset 0 1px #ffffff4d;position:relative}.glasses-digit:nth-child(2):after,.glasses-digit:nth-child(4):after{content:"";position:absolute;width:8px;height:10px;background:#0000004d;border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%)}.glasses-bridge{width:8px;height:4px;background:linear-gradient(180deg,gold,orange);border-radius:2px;margin:0 1px}.glasses-arms{position:absolute;top:8px;left:50%;transform:translate(-50%);width:100%;display:flex;justify-content:space-between;pointer-events:none}.glasses-arm{width:20px;height:3px;background:linear-gradient(90deg,gold,orange);border-radius:2px}.glasses-arm.left{transform:rotate(-15deg) translate(-8px);transform-origin:right center}.glasses-arm.right{transform:rotate(15deg) translate(8px);transform-origin:left center}@media (max-width: 480px){.newyear-countdown{position:fixed;top:10px;left:50%;transform:translate(-50%);padding:16px}.countdown-timer{flex-direction:row;flex-wrap:wrap;gap:8px}.countdown-item{min-width:55px;padding:6px 10px}.countdown-value{font-size:24px}.countdown-title{font-size:9px;letter-spacing:2px}.newyear-celebration{padding:16px 24px}.celebration-text{font-size:16px}.newyear-glasses{transform:translate(-50%) scale(.85)}}@media (max-width: 768px){.newyear-countdown{left:50%;transform:translate(-50%);top:15px}}.countdown-hint{font-size:8px;color:#ffd70080;letter-spacing:1px;margin-bottom:8px;opacity:0;transition:opacity .3s ease}.newyear-countdown:hover .countdown-hint{opacity:1}.newyear-countdown{cursor:pointer}.fullscreen-countdown-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:#000000b3;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);z-index:10000;display:flex;align-items:center;justify-content:center;animation:fs-fade-in .5s ease-out;overflow:hidden}@keyframes fs-fade-in{0%{opacity:0;transform:scale(1.1)}to{opacity:1;transform:scale(1)}}.fs-particles{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;overflow:hidden}.fs-particle{position:absolute;width:4px;height:4px;background:gold;border-radius:50%;animation:fs-particle-float 8s ease-in-out infinite;box-shadow:0 0 10px gold,0 0 20px orange}.fs-particle:nth-child(1){left:10%;top:20%;animation-delay:0s;animation-duration:7s}.fs-particle:nth-child(2){left:25%;top:60%;animation-delay:1s;animation-duration:9s}.fs-particle:nth-child(3){left:40%;top:30%;animation-delay:2s;animation-duration:8s}.fs-particle:nth-child(4){left:55%;top:80%;animation-delay:.5s;animation-duration:6s}.fs-particle:nth-child(5){left:70%;top:15%;animation-delay:1.5s;animation-duration:10s}.fs-particle:nth-child(6){left:85%;top:50%;animation-delay:2.5s;animation-duration:7s}.fs-particle:nth-child(7){left:15%;top:70%;animation-delay:.8s;animation-duration:8s;width:6px;height:6px}.fs-particle:nth-child(8){left:45%;top:45%;animation-delay:1.8s;animation-duration:9s;width:5px;height:5px}.fs-particle:nth-child(9){left:75%;top:75%;animation-delay:3s;animation-duration:6s}.fs-particle:nth-child(10){left:90%;top:25%;animation-delay:.3s;animation-duration:7s;width:6px;height:6px}@keyframes fs-particle-float{0%,to{transform:translateY(0) translate(0) scale(1);opacity:.6}25%{transform:translateY(-30px) translate(20px) scale(1.2);opacity:1}50%{transform:translateY(-10px) translate(-15px) scale(.8);opacity:.8}75%{transform:translateY(-40px) translate(10px) scale(1.1);opacity:1}}.fs-fireworks{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none}.fs-firework{position:absolute;width:6px;height:6px;border-radius:50%;box-shadow:0 0 #fff,0 -100px 0 3px var(--c1, #FFD700),50px -87px 0 3px var(--c2, #FFA500),87px -50px 0 3px var(--c1, #FFD700),100px 0 0 3px var(--c2, #FFA500),87px 50px 0 3px var(--c1, #FFD700),50px 87px 0 3px var(--c2, #FFA500),0 100px 0 3px var(--c1, #FFD700),-50px 87px 0 3px var(--c2, #FFA500),-87px 50px 0 3px var(--c1, #FFD700),-100px 0 0 3px var(--c2, #FFA500),-87px -50px 0 3px var(--c1, #FFD700),-50px -87px 0 3px var(--c2, #FFA500),0 -60px 0 2px var(--c2, #FFA500),42px -42px 0 2px var(--c1, #FFD700),60px 0 0 2px var(--c2, #FFA500),42px 42px 0 2px var(--c1, #FFD700),0 60px 0 2px var(--c2, #FFA500),-42px 42px 0 2px var(--c1, #FFD700),-60px 0 0 2px var(--c2, #FFA500),-42px -42px 0 2px var(--c1, #FFD700);animation:fs-firework-burst 2.5s ease-out infinite;opacity:0}.fs-firework:nth-child(1){--c1: #FFD700;--c2: #FFA500;left:15%;top:25%;animation-delay:0s}.fs-firework:nth-child(2){--c1: #FFA500;--c2: #FF8C00;left:80%;top:20%;animation-delay:.6s}.fs-firework:nth-child(3){--c1: #FFCC00;--c2: #FFD700;left:25%;top:70%;animation-delay:1.2s}.fs-firework:nth-child(4){--c1: #FFD700;--c2: #FFCC00;left:70%;top:75%;animation-delay:1.8s}@keyframes fs-firework-burst{0%{transform:scale(0);opacity:0}10%{transform:scale(.2);opacity:1}35%{transform:scale(1);opacity:1}60%{transform:scale(1.3);opacity:.6}to{transform:scale(1.5);opacity:0}}.fs-content{position:relative;z-index:10;text-align:center;animation:fs-content-appear .8s cubic-bezier(.34,1.56,.64,1) .2s backwards}@keyframes fs-content-appear{0%{opacity:0;transform:scale(.5) translateY(50px)}to{opacity:1;transform:scale(1) translateY(0)}}.fs-title{margin-bottom:40px}.fs-title-text{display:block;font-size:24px;font-weight:300;letter-spacing:15px;color:#ffffffb3;margin-bottom:10px;text-transform:uppercase}.fs-year{display:block;font-size:120px;font-weight:900;font-family:Arial Black,sans-serif;background:linear-gradient(180deg,gold,orange,#ff8c00 80%,gold);background-size:100% 200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:fs-year-shine 3s ease-in-out infinite;filter:drop-shadow(0 0 30px rgba(255,215,0,.5));line-height:1}@keyframes fs-year-shine{0%,to{background-position:0% 0%}50%{background-position:0% 100%}}.fs-countdown{display:flex;justify-content:center;align-items:center;gap:20px;margin-bottom:40px}.fs-countdown-item{background:#ffd7001a;border:2px solid rgba(255,215,0,.3);border-radius:20px;padding:30px 25px;min-width:120px;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);position:relative;overflow:hidden}.fs-countdown-item:before{content:"";position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:linear-gradient(45deg,transparent 40%,rgba(255,215,0,.1) 50%,transparent 60%);animation:fs-item-shine 3s ease-in-out infinite}@keyframes fs-item-shine{0%{transform:translate(-100%) rotate(45deg)}to{transform:translate(100%) rotate(45deg)}}.fs-countdown-value{font-size:64px;font-weight:900;font-family:Arial Black,sans-serif;background:linear-gradient(180deg,gold,orange);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1;position:relative;z-index:1}.fs-countdown-label{font-size:12px;font-weight:700;letter-spacing:3px;color:#ffd700b3;margin-top:10px;position:relative;z-index:1}.fs-countdown-separator{font-size:60px;font-weight:900;color:gold;animation:fs-separator-pulse 1s ease-in-out infinite;margin-bottom:30px}@keyframes fs-separator-pulse{0%,to{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.95)}}.fs-message{font-size:18px;font-weight:600;color:#fffc;letter-spacing:2px;animation:fs-message-pulse 2s ease-in-out infinite}@keyframes fs-message-pulse{0%,to{opacity:.8}50%{opacity:1}}.fs-close{position:absolute;top:30px;right:30px;width:50px;height:50px;border:2px solid rgba(255,255,255,.3);background:#0000004d;border-radius:50%;color:#fff;font-size:24px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .3s ease;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);z-index:100}.fs-close:hover{background:#ffd70033;border-color:gold;transform:scale(1.1) rotate(90deg)}.fs-instruction{position:absolute;bottom:30px;left:50%;transform:translate(-50%);font-size:12px;color:#fff6;letter-spacing:2px}@media (max-width: 768px){.fs-year{font-size:80px}.fs-countdown{flex-wrap:wrap;gap:15px}.fs-countdown-item{min-width:80px;padding:20px 15px}.fs-countdown-value{font-size:40px}.fs-countdown-separator{font-size:40px;margin-bottom:20px}.fs-title-text{font-size:16px;letter-spacing:8px}.fs-close{top:15px;right:15px;width:40px;height:40px;font-size:20px}}.snow-canvas-fullscreen{position:fixed;top:0;left:0;width:100%;height:100%;z-index:5;pointer-events:none}.christmas-greeting-container{position:fixed;top:0;left:0;width:30%;height:100vh;display:flex;align-items:center;justify-content:center;z-index:60;pointer-events:none}.christmas-greeting{position:relative;text-align:center;padding:2rem;pointer-events:auto;animation:greetingFadeIn 1.5s ease-out forwards;animation-delay:.5s;opacity:0}.christmas-tree-container{position:fixed;top:0;right:0;width:40%;height:100vh;display:flex;align-items:center;justify-content:center;z-index:50;pointer-events:none;overflow:hidden}.tree-canvas{width:100%;height:100%;display:block}@keyframes greetingFadeIn{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}.greeting-stars{font-size:1.2rem;color:#fbbf24;letter-spacing:.5rem;margin-bottom:.5rem;animation:starsSparkle 2s ease-in-out infinite}@keyframes starsSparkle{0%,to{opacity:1;text-shadow:0 0 10px #fbbf24}50%{opacity:.6;text-shadow:0 0 20px #fbbf24,0 0 30px #f59e0b}}.greeting-title{font-size:2.5rem;font-weight:800;background:linear-gradient(135deg,#dc2626,#ef4444,#fbbf24);-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:none;margin:0;letter-spacing:.05em;animation:titleGlow 3s ease-in-out infinite}@keyframes titleGlow{0%,to{filter:drop-shadow(0 0 10px rgba(220,38,38,.5))}50%{filter:drop-shadow(0 0 20px rgba(239,68,68,.8)) drop-shadow(0 0 30px rgba(251,191,36,.4))}}.greeting-subtitle{font-size:1.1rem;color:#94a3b8;margin:.3rem 0;font-style:italic}.greeting-company{margin:.5rem 0}.company-name{font-size:1.8rem;font-weight:700;background:linear-gradient(90deg,#10b981,#34d399,#6ee7b7,#34d399,#10b981);background-size:200% auto;-webkit-background-clip:text;background-clip:text;color:transparent;animation:companyShine 3s linear infinite}@keyframes companyShine{to{background-position:200% center}}.greeting-ornament{font-size:2rem;margin:.5rem 0;animation:ornamentBounce 2s ease-in-out infinite}@keyframes ornamentBounce{0%,to{transform:translateY(0) rotate(-5deg)}50%{transform:translateY(-5px) rotate(5deg)}}.greeting-wish{font-size:.9rem;color:#cbd5e1;max-width:280px;margin:.5rem auto 0;line-height:1.4}body.light-theme .greeting-subtitle,:root.light .greeting-subtitle{color:#475569}body.light-theme .greeting-wish,:root.light .greeting-wish{color:#64748b}body.light-theme .snowflake,:root.light .snowflake{color:#64748bb3;text-shadow:0 0 8px rgba(59,130,246,.5)}.tree-star{position:absolute;top:-5px;left:50%;transform:translate(-50%);font-size:65px;color:transparent;background:linear-gradient(135deg,#fff7cc,#fbbf24,#f59e0b,#d97706,#fbbf24);-webkit-background-clip:text;background-clip:text;filter:drop-shadow(0 0 15px #fbbf24) drop-shadow(0 0 30px #f59e0b) drop-shadow(0 0 45px rgba(251,191,36,.6));animation:starGlow3D 3s ease-in-out infinite;z-index:100}.tree-star:before{content:"\\2726";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(.4);font-size:65px;color:#fff;opacity:.9;animation:starInnerPulse 2s ease-in-out infinite alternate}.tree-star:after{content:"";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:120px;height:120px;background:radial-gradient(circle,rgba(251,191,36,.4) 0%,transparent 60%);animation:starHalo 4s ease-in-out infinite}@keyframes starGlow3D{0%,to{transform:translate(-50%) scale(1) rotateY(0);filter:drop-shadow(0 0 15px #fbbf24) drop-shadow(0 0 30px #f59e0b)}50%{transform:translate(-50%) scale(1.08) rotateY(15deg);filter:drop-shadow(0 0 25px #fbbf24) drop-shadow(0 0 50px #f59e0b) drop-shadow(0 0 70px rgba(251,191,36,.8))}}@keyframes starInnerPulse{0%{opacity:.7;transform:translate(-50%,-50%) scale(.35)}to{opacity:1;transform:translate(-50%,-50%) scale(.45)}}@keyframes starHalo{0%,to{transform:translate(-50%,-50%) scale(1);opacity:.5}50%{transform:translate(-50%,-50%) scale(1.3);opacity:.8}}.tree-layer{position:absolute;left:50%;transform:translate(-50%);filter:drop-shadow(4px 8px 12px rgba(0,0,0,.4))}.tree-layer:before{content:"";position:absolute;inset:0;background-image:repeating-linear-gradient(85deg,transparent,transparent 2px,rgba(0,50,0,.3) 2px,rgba(0,50,0,.3) 3px),repeating-linear-gradient(95deg,transparent,transparent 2px,rgba(100,200,100,.15) 2px,rgba(100,200,100,.15) 3px),repeating-linear-gradient(90deg,transparent,transparent 4px,rgba(0,80,0,.2) 4px,rgba(0,80,0,.2) 5px);opacity:.7;mix-blend-mode:overlay}.tree-layer:after{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 8% 4% at 15% 20%,rgba(255,255,255,.9) 0%,transparent 100%),radial-gradient(ellipse 10% 5% at 85% 25%,rgba(255,255,255,.85) 0%,transparent 100%),radial-gradient(ellipse 12% 4% at 25% 50%,rgba(255,255,255,.8) 0%,transparent 100%),radial-gradient(ellipse 8% 3% at 75% 55%,rgba(255,255,255,.85) 0%,transparent 100%),radial-gradient(ellipse 15% 5% at 50% 80%,rgba(255,255,255,.7) 0%,transparent 100%),radial-gradient(ellipse 6% 3% at 35% 35%,rgba(255,255,255,.75) 0%,transparent 100%),radial-gradient(ellipse 7% 3% at 65% 40%,rgba(255,255,255,.8) 0%,transparent 100%);pointer-events:none}.tree-layer.layer-1{top:55px;width:90px;height:85px;background:radial-gradient(ellipse 80% 100% at 50% 100%,#0f4c2d,#166534 40%,#1a7d40,#22994d),linear-gradient(180deg,#14532d,#166534,#1a7d40);clip-path:polygon(50% 0%,45% 15%,35% 40%,25% 65%,15% 85%,8% 92%,0% 100%,100% 100%,92% 92%,85% 85%,75% 65%,65% 40%,55% 15%)}.tree-layer.layer-2{top:115px;width:150px;height:105px;background:radial-gradient(ellipse 100% 80% at 50% 20%,#1e8449 0%,transparent 50%),radial-gradient(ellipse 60% 60% at 20% 60%,#145a32 0%,transparent 50%),radial-gradient(ellipse 60% 60% at 80% 60%,#145a32 0%,transparent 50%),linear-gradient(180deg,#1a7d40,#166534,#145a32 60%,#0f4c2d);clip-path:polygon(50% 0%,42% 20%,30% 45%,20% 65%,10% 82%,5% 90%,0% 100%,100% 100%,95% 90%,90% 82%,80% 65%,70% 45%,58% 20%)}.tree-layer.layer-3{top:190px;width:210px;height:125px;background:radial-gradient(ellipse 90% 70% at 50% 30%,#22994d 0%,transparent 50%),radial-gradient(ellipse 50% 50% at 15% 50%,#166534 0%,transparent 60%),radial-gradient(ellipse 50% 50% at 85% 50%,#166534 0%,transparent 60%),linear-gradient(180deg,#1e8449,#1a7d40,#166534,#145a32,#0f4c2d);clip-path:polygon(50% 0%,45% 12%,38% 28%,28% 48%,18% 65%,10% 80%,5% 90%,0% 100%,100% 100%,95% 90%,90% 80%,82% 65%,72% 48%,62% 28%,55% 12%)}.tree-layer.layer-4{top:280px;width:280px;height:165px;background:radial-gradient(ellipse 80% 60% at 50% 20%,#22994d 0%,transparent 40%),radial-gradient(ellipse 40% 40% at 10% 40%,#1a7d40 0%,transparent 50%),radial-gradient(ellipse 40% 40% at 90% 40%,#1a7d40 0%,transparent 50%),radial-gradient(ellipse 50% 50% at 30% 70%,#166534 0%,transparent 50%),radial-gradient(ellipse 50% 50% at 70% 70%,#166534 0%,transparent 50%),linear-gradient(180deg,#1e8449,#1a7d40,#166534 40%,#145a32 65%,#0f4c2d 85%,#0a3d22);clip-path:polygon(50% 0%,46% 8%,40% 20%,33% 35%,25% 50%,17% 65%,10% 78%,5% 88%,0% 100%,100% 100%,95% 88%,90% 78%,83% 65%,75% 50%,67% 35%,60% 20%,54% 8%)}.tree-trunk{position:absolute;bottom:8px;left:50%;transform:translate(-50%);width:60px;height:60px;background:repeating-linear-gradient(0deg,#3d1f0d,#5c3317,#4a2812,#6b3d1a,#3d1f0d 12px),linear-gradient(90deg,#2d1508,#4a2812,#6b3d1a 30%,#8b4513,#6b3d1a 70%,#4a2812,#2d1508);background-blend-mode:overlay;border-radius:6px 6px 12px 12px;box-shadow:0 10px 30px #0009,inset -8px 0 15px #0006,inset 8px 0 15px #8b45134d,inset 0 -10px 20px #00000080}.tree-trunk:before{content:"";position:absolute;top:5px;left:8px;width:10px;height:45px;background:repeating-linear-gradient(175deg,transparent 0px,rgba(0,0,0,.3) 2px,transparent 4px);border-radius:3px}.tree-trunk:after{content:"";position:absolute;top:8px;right:12px;width:8px;height:38px;background:repeating-linear-gradient(185deg,transparent 0px,rgba(0,0,0,.25) 2px,transparent 4px);border-radius:3px}.tree-trunk-base{position:absolute;bottom:-5px;left:50%;transform:translate(-50%);width:120px;height:25px;background:linear-gradient(180deg,#dc2626,#991b1b,#7f1d1d);border-radius:60px 60px 30px 30px/25px 25px 15px 15px;box-shadow:0 5px 15px #0006;z-index:-1}.tree-trunk-base:before{content:"";position:absolute;top:3px;left:10%;width:80%;height:8px;background:repeating-linear-gradient(90deg,transparent 0px,transparent 8px,#fbbf24 8px,#fbbf24 16px);border-radius:4px;opacity:.8}.tree-trunk-base:after{content:"";position:absolute;bottom:5px;left:15%;width:70%;height:6px;background:repeating-linear-gradient(90deg,#fbbf24 0px,#fbbf24 6px,transparent 6px,transparent 14px);border-radius:3px;opacity:.7}.tree-garland{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:5}.garland-strand{position:absolute;height:6px;background:linear-gradient(90deg,#fbbf24,#f59e0b,#fbbf24,#eab308,#fbbf24,#f59e0b);border-radius:3px;box-shadow:0 2px 8px #fbbf2499;transform-origin:center}.garland-strand.g1{top:100px;left:140px;width:100px;transform:rotate(8deg)}.garland-strand.g2{top:175px;left:105px;width:170px;transform:rotate(-5deg)}.garland-strand.g3{top:260px;left:75px;width:230px;transform:rotate(4deg)}.garland-strand.g4{top:355px;left:45px;width:290px;transform:rotate(-3deg)}.tree-lights{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:10}.tree-light{position:absolute;width:12px;height:14px;border-radius:50%/60% 60% 40% 40%;background:radial-gradient(ellipse 50% 40% at 50% 30%,#fff,#fff7cc 20%,#fbbf24,#f59e0b 80%,#d97706);box-shadow:0 0 8px 2px #fbbf24,0 0 15px 4px #fbbf24b3,0 0 30px 8px #f59e0b80,0 0 50px 12px #fbbf244d,inset 0 -3px 5px #d9770680;animation:lightGlow3D 2.5s ease-in-out infinite}.tree-light:before{content:"";position:absolute;top:2px;left:3px;width:4px;height:4px;background:#ffffffe6;border-radius:50%}.tree-light:after{content:"";position:absolute;bottom:-3px;left:50%;transform:translate(-50%);width:4px;height:4px;background:linear-gradient(180deg,#6b7280,#374151);border-radius:1px}.tree-light.light-1{top:95px;left:155px;animation-delay:0s}.tree-light.light-2{top:105px;left:180px;animation-delay:.3s}.tree-light.light-3{top:155px;left:125px;animation-delay:.1s}.tree-light.light-4{top:165px;left:165px;animation-delay:.4s}.tree-light.light-5{top:160px;left:205px;animation-delay:.7s}.tree-light.light-6{top:230px;left:100px;animation-delay:.2s}.tree-light.light-7{top:245px;left:145px;animation-delay:.5s}.tree-light.light-8{top:240px;left:190px;animation-delay:.8s}.tree-light.light-9{top:250px;left:235px;animation-delay:.15s}.tree-light.light-10{top:320px;left:75px;animation-delay:.35s}.tree-light.light-11{top:335px;left:125px;animation-delay:.6s}.tree-light.light-12{top:330px;left:170px;animation-delay:.25s}.tree-light.light-13{top:340px;left:215px;animation-delay:.55s}.tree-light.light-14{top:325px;left:260px;animation-delay:.85s}.tree-light.light-15{top:395px;left:55px;animation-delay:.45s}.tree-light.light-16{top:410px;left:110px;animation-delay:.75s}.tree-light.light-17{top:405px;left:165px;animation-delay:.2s}.tree-light.light-18{top:415px;left:220px;animation-delay:.5s}.tree-light.light-19{top:400px;left:275px;animation-delay:.9s}@keyframes lightGlow3D{0%,to{opacity:1;transform:scale(1);box-shadow:0 0 8px 2px #fbbf24,0 0 15px 4px #fbbf24b3,0 0 30px 8px #f59e0b80,0 0 50px 12px #fbbf244d}50%{opacity:.7;transform:scale(.9);box-shadow:0 0 5px 1px #fbbf24,0 0 10px 2px #fbbf2480,0 0 20px 4px #f59e0b4d}}.tree-ornaments{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:15}.ornament{position:absolute;border-radius:50%;animation:ornamentSway 4s ease-in-out infinite}.ornament:before{content:"";position:absolute;top:-8px;left:50%;transform:translate(-50%);width:8px;height:10px;background:linear-gradient(90deg,#9ca3af,#d1d5db 40%,#f3f4f6,#d1d5db 60%,#9ca3af);border-radius:3px 3px 0 0;box-shadow:0 1px 3px #0000004d}.ornament:after{content:"";position:absolute;top:-12px;left:50%;transform:translate(-50%);width:6px;height:6px;border:2px solid #9ca3af;border-radius:50%;background:transparent}@keyframes ornamentSway{0%,to{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}.ornament.ornament-lg{width:32px;height:32px}.ornament.ornament-md{width:26px;height:26px}.ornament.ornament-sm{width:20px;height:20px}.ornament.red{background:radial-gradient(ellipse 30% 20% at 30% 25%,rgba(255,255,255,.9) 0%,transparent 100%),radial-gradient(ellipse 60% 50% at 35% 35%,#fca5a5 0%,transparent 50%),radial-gradient(ellipse 100% 100% at 50% 50%,#ef4444,#dc2626 40%,#b91c1c,#7f1d1d);box-shadow:inset -6px -6px 15px #7f1d1dcc,inset 3px 3px 8px #fca5a566,0 6px 20px #b91c1c80,0 2px 5px #0000004d}.ornament.gold{background:radial-gradient(ellipse 25% 15% at 28% 22%,rgba(255,255,255,.95) 0%,transparent 100%),radial-gradient(ellipse 50% 40% at 35% 35%,#fef08a 0%,transparent 50%),radial-gradient(ellipse 100% 100% at 50% 50%,#fcd34d,#eab308 35%,#ca8a04,#a16207 85%,#78350f);box-shadow:inset -6px -6px 15px #78350fb3,inset 3px 3px 8px #fef08a80,0 6px 20px #ca8a0480,0 2px 5px #0000004d}.ornament.silver{background:radial-gradient(ellipse 25% 15% at 28% 22%,rgba(255,255,255,1) 0%,transparent 100%),radial-gradient(ellipse 50% 40% at 35% 35%,#ffffff 0%,transparent 50%),radial-gradient(ellipse 100% 100% at 50% 50%,#f1f5f9,#cbd5e1 30%,#94a3b8,#64748b 80%,#475569);box-shadow:inset -6px -6px 15px #475569b3,inset 3px 3px 8px #fff9,0 6px 20px #64748b80,0 2px 5px #0000004d}.ornament-1{top:120px;left:160px}.ornament-2{top:175px;left:130px}.ornament-3{top:180px;left:195px}.ornament-4{top:255px;left:105px}.ornament-5{top:265px;left:165px}.ornament-6{top:260px;left:225px}.ornament-7{top:345px;left:80px}.ornament-8{top:360px;left:145px}.ornament-9{top:355px;left:200px}.ornament-10{top:365px;left:255px}.ornament-11{top:425px;left:70px}.ornament-12{top:435px;left:135px}.ornament-13{top:430px;left:195px}.ornament-14{top:440px;left:260px}.tree-gifts{position:absolute;bottom:-10px;left:50%;transform:translate(-50%);display:flex;align-items:flex-end;gap:12px}.gift{position:relative;border-radius:6px;box-shadow:0 4px 12px #0006}.gift-1{width:50px;height:45px;background:linear-gradient(145deg,#dc2626,#991b1b)}.gift-2{width:40px;height:55px;background:linear-gradient(145deg,#2563eb,#1e40af)}.gift-3{width:55px;height:40px;background:linear-gradient(145deg,#16a34a,#15803d)}.gift-4{width:35px;height:35px;background:linear-gradient(145deg,#9333ea,#7e22ce)}.gift-5{width:45px;height:50px;background:linear-gradient(145deg,#ea580c,#c2410c)}.gift-ribbon{position:absolute;top:0;left:50%;transform:translate(-50%);width:8px;height:100%;background:linear-gradient(90deg,#fbbf24,#f59e0b)}.gift-ribbon:before{content:"";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:200%;height:8px;background:linear-gradient(90deg,#fbbf24,#f59e0b)}.gift-ribbon:after{content:"";position:absolute;top:-12px;left:50%;transform:translate(-50%);width:20px;height:16px;background:linear-gradient(180deg,#fbbf24,#f59e0b);border-radius:50% 50% 10% 10%;clip-path:polygon(0 100%,15% 30%,35% 80%,50% 20%,65% 80%,85% 30%,100% 100%)}@media (max-width: 1200px){.christmas-tree-container{width:35%}.christmas-greeting-container{width:25%}.christmas-tree{width:280px;height:420px;transform:scale(.85)}.greeting-title{font-size:2rem}.company-name{font-size:1.5rem}}@media (max-width: 900px){.christmas-tree-container{width:30%}.christmas-greeting-container{display:none}.christmas-tree{transform:scale(.7)}.greeting-title{font-size:1.6rem}.company-name{font-size:1.3rem}.greeting-wish{display:none}}@media (max-width: 700px){.christmas-tree-container,.christmas-greeting-container{display:none}}.login-container.summer{background:linear-gradient(135deg,#0a0e27,#0d1333,#0f1a3a)}.login-container.summer:before{background:radial-gradient(circle at 80% 20%,rgba(255,193,7,.08) 0%,transparent 40%),radial-gradient(circle at 20% 80%,rgba(0,188,212,.06) 0%,transparent 40%)}.summer-sun{position:fixed;top:30px;right:60px;z-index:5;pointer-events:none;opacity:.7}.sun-core{width:60px;height:60px;background:radial-gradient(circle,#ffd700e6,#ffa50099,#ff8c004d);border-radius:50%;box-shadow:0 0 40px #ffc1074d,0 0 80px #ff980026;animation:sunPulse 4s ease-in-out infinite}.sun-rays{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:120px;height:120px;animation:sunRotate 30s linear infinite}.sun-rays .ray{position:absolute;top:50%;left:50%;width:2px;height:25px;background:linear-gradient(180deg,rgba(255,193,7,.6),transparent);transform-origin:center bottom;border-radius:2px}.sun-rays .ray:nth-child(1){transform:translate(-50%,-100%) rotate(0)}.sun-rays .ray:nth-child(2){transform:translate(-50%,-100%) rotate(45deg)}.sun-rays .ray:nth-child(3){transform:translate(-50%,-100%) rotate(90deg)}.sun-rays .ray:nth-child(4){transform:translate(-50%,-100%) rotate(135deg)}.sun-rays .ray:nth-child(5){transform:translate(-50%,-100%) rotate(180deg)}.sun-rays .ray:nth-child(6){transform:translate(-50%,-100%) rotate(225deg)}.sun-rays .ray:nth-child(7){transform:translate(-50%,-100%) rotate(270deg)}.sun-rays .ray:nth-child(8){transform:translate(-50%,-100%) rotate(315deg)}@keyframes sunPulse{0%,to{transform:scale(1);opacity:.7}50%{transform:scale(1.03);opacity:.8}}@keyframes sunRotate{0%{transform:translate(-50%,-50%) rotate(0)}to{transform:translate(-50%,-50%) rotate(360deg)}}.summer-clouds{position:fixed;top:0;left:0;right:0;height:200px;pointer-events:none;z-index:4;opacity:.15}.cloud{position:absolute;font-size:50px;color:#ffffff80;animation:cloudFloat 50s linear infinite}.cloud-1{top:30px;left:-80px;animation-duration:60s}.cloud-2{top:80px;left:-150px;animation-duration:75s;animation-delay:-20s;font-size:40px}.cloud-3{top:50px;left:-120px;animation-duration:65s;animation-delay:-35s;font-size:45px}@keyframes cloudFloat{0%{transform:translate(0)}to{transform:translate(calc(100vw + 200px))}}.summer-waves{position:fixed;bottom:0;left:0;right:0;height:80px;pointer-events:none;z-index:3;overflow:hidden;opacity:.3}.wave{position:absolute;bottom:0;left:-100%;width:300%;height:100%;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%2300bcd4' fill-opacity='0.3' d='M0,192L48,197.3C96,203,192,213,288,202.7C384,192,480,160,576,165.3C672,171,768,213,864,218.7C960,224,1056,192,1152,165.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E") repeat-x;background-size:50% 100%;animation:waveMove 12s linear infinite}.wave-1{opacity:.5;animation-duration:12s}.wave-2{bottom:5px;opacity:.3;animation-duration:15s;animation-delay:-4s}.wave-3{bottom:10px;opacity:.2;animation-duration:18s;animation-delay:-8s}@keyframes waveMove{0%{transform:translate(0)}to{transform:translate(33.33%)}}.summer-palms{display:none}.summer-greeting{position:fixed;left:40px;top:50%;transform:translateY(-50%);z-index:6;pointer-events:none}.summer-greeting-content{background:#ffffff14;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);padding:32px 40px;border-radius:24px;text-align:center;border:1px solid rgba(255,255,255,.1);box-shadow:0 8px 32px #0003,inset 0 1px #ffffff1a}.summer-icon{font-size:48px;margin-bottom:16px;animation:sunIconPulse 3s ease-in-out infinite;filter:drop-shadow(0 0 20px rgba(255,193,7,.4))}@keyframes sunIconPulse{0%,to{transform:scale(1)}50%{transform:scale(1.05)}}.summer-title{font-size:1.75rem;font-weight:600;background:linear-gradient(135deg,#ffc107,#ff9800,#ffd54f);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin:0 0 8px;letter-spacing:.5px}.summer-subtitle{font-size:.9rem;color:#ffffffb3;margin:0 0 16px;line-height:1.6;max-width:220px}.summer-decoration{font-size:1.25rem;letter-spacing:8px;opacity:.8}body.light-theme .summer-greeting-content,:root:not(.dark) .summer-greeting-content{background:#0000000f;border:1px solid rgba(0,0,0,.1);box-shadow:0 8px 32px #0000001f,inset 0 1px #fff9}body.light-theme .summer-subtitle,:root:not(.dark) .summer-subtitle{color:#475569!important}body.light-theme .summer-decoration,:root:not(.dark) .summer-decoration{opacity:1}.summer-sunglasses{position:absolute;top:32px;left:50%;transform:translate(-50%);z-index:100}.sunglasses-frame{display:flex;align-items:center;gap:3px}.sunglasses-lens{width:24px;height:16px;background:linear-gradient(180deg,#1a1a2ef2,#16213ee6,#0f3460d9);border-radius:6px;border:2px solid #1a1a1a;box-shadow:inset 0 2px 4px #ffffff26,0 2px 6px #0006}.sunglasses-lens.left{border-radius:8px 4px 6px 8px}.sunglasses-lens.right{border-radius:4px 8px 8px 6px}.sunglasses-bridge{width:6px;height:3px;background:#1a1a1a;border-radius:2px;margin-top:2px}.sunglasses-arms{position:absolute;top:6px;left:-16px;right:-16px;display:flex;justify-content:space-between}.sunglasses-arm{width:18px;height:2px;background:#1a1a1a;border-radius:1px}.sunglasses-arm.left{transform:rotate(-20deg);transform-origin:right center}.sunglasses-arm.right{transform:rotate(20deg);transform-origin:left center}@media (max-width: 1200px){.summer-greeting{left:20px}.summer-greeting-content{padding:24px 32px}.summer-title{font-size:1.5rem}.summer-sun{right:40px}.sun-core{width:50px;height:50px}.sun-rays{width:100px;height:100px}}@media (max-width: 900px){.summer-greeting{display:none}.summer-sun{top:20px;right:20px}.sun-core{width:45px;height:45px}.sun-rays{width:90px;height:90px}.sun-rays .ray{height:20px}}@media (max-width: 600px){.summer-sun{top:15px;right:15px;opacity:.5}.sun-core{width:35px;height:35px}.sun-rays{width:70px;height:70px}.sun-rays .ray{height:15px}.summer-clouds,.summer-waves{display:none}}
`],encapsulation:2});let i=t;return i})();export{fy as LoginComponent};
