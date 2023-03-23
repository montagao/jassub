var p=p,Be=e=>console.log(e),xe=e=>console.error(e);function ze(){}self.assert||(self.assert=(e,r)=>{if(!e)throw r});String.prototype.startsWith||(String.prototype.startsWith=function(e,r){return r===void 0&&(r=0),this.substring(r,e.length)===e});String.prototype.includes||(String.prototype.includes=function(e,r){return this.indexOf(e,r)!==-1});if(!ArrayBuffer.isView){const e=[Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array];ArrayBuffer.isView=r=>r&&r.constructor&&e.indexOf(r.constructor)!==-1}Uint8Array.prototype.slice||(Uint8Array.prototype.slice=function(e,r){return new Uint8Array(this.subarray(e,r))});Date.now||(Date.now=()=>new Date().getTime());"performance"in self||(self.performance={now:()=>Date.now()});if(typeof console>"u"){const e=(r,t)=>{postMessage({target:"console",command:r,content:JSON.stringify(Array.prototype.slice.call(t))})};console={log:function(){e("log",arguments)},debug:function(){e("debug",arguments)},info:function(){e("info",arguments)},warn:function(){e("warn",arguments)},error:function(){e("error",arguments)}},console.log("Detected lack of console, overridden console")}const Te=(e,r)=>{const t=new XMLHttpRequest;return t.open("GET",e,!1),t.responseType=r?"arraybuffer":"text",t.send(null),t.response},mr=(e,r,t)=>{const n=new XMLHttpRequest;n.open("GET",e,!0),n.responseType="arraybuffer",n.onload=()=>{if((n.status===200||n.status===0)&&n.response)return r(n.response);t()},n.onerror=t,n.send(null)};p={wasm:WebAssembly&&!WebAssembly.instantiateStreaming&&Te("jassub-worker.wasm",!0)};ze=()=>postMessage({target:"ready"});Be=e=>{e==="JASSUB: No usable fontconfig configuration file found, using fallback."?console.debug(e):console.log(e)};xe=e=>{e==="Fontconfig error: Cannot load default config file: No such file: (null)"?console.debug(e):console.error(e)};let x=0;const br=1;let j=null,Re=!1,Pe=Date.now(),re=24,Ge=!1,Je="js",te={};const Le={};let wr=0,Xe;self.width=0;self.height=0;let E=!1;self.addFont=({font:e})=>$e(e);const we=e=>{e=e.trim().toLowerCase(),e.startsWith("@")&&(e=e.substring(1)),!Le[e]&&(Le[e]=!0,te[e]?$e(te[e]):Ge&&postMessage({target:"getLocalFont",font:e}))},$e=e=>{ArrayBuffer.isView(e)?Ie(e):mr(e,r=>{Ie(new Uint8Array(r))},console.error)},Ie=e=>{const r=ge(e.byteLength);m.set(e,r),self.jassubObj.addFont("font-"+wr++,r,e.byteLength),self.jassubObj.reloadFonts()},qe=e=>{if(!te)return;const r=Pr(e);for(let i=0;i<r.length;i++)for(let s=0;s<r[i].body.length;s++)r[i].body[s].key==="Style"&&we(r[i].body[s].value.Fontname);const t=/\\fn([^\\}]*?)[\\}]/g;let n;for(;(n=t.exec(e))!==null;)we(n[1])};self.setTrack=({content:e})=>{qe(e),self.jassubObj.createTrackMem(e)};self.freeTrack=()=>{self.jassubObj.removeTrack()};self.setTrackByUrl=({url:e})=>{self.setTrack({content:Te(e)})};const _r=(e,r)=>{self.width=e,self.height=r,self.jassubObj.resizeCanvas(e,r)},Cr=()=>{const e=(Date.now()-Pe)/1e3;return ne?x:(e>5&&(console.error("Didn't received currentTime > 5 seconds. Assuming video was paused."),Ye(!0)),x+e*br)},Tr=e=>{x=e,Pe=Date.now(),j||(Re?j=Fe(ie):(ie(),setTimeout(()=>{Re=!1},20)))};let ne=!0;const Ye=e=>{e!==ne&&(ne=e,e?j&&(clearTimeout(j),j=null):(Pe=Date.now(),j=Fe(ie)))},Ae=(e,r)=>{const t=performance.now(),n=Je==="wasm"?self.jassubObj.renderBlend(e,r||0):self.jassubObj.renderImage(e,r||0),i={renderTime:performance.now()-t-self.jassubObj.time,decodeTime:self.jassubObj.time};if(self.jassubObj.changed!==0||r){const s=[];let f=[];const o=performance.now();if(!n)return me({images:s,buffers:f,times:i,decodeStartTime:o});if(E){const a=[];for(let l=n,u=0;u<self.jassubObj.count;l=l.next,++u)s.push({w:l.w,h:l.h,x:l.x,y:l.y}),a.push(createImageBitmap(new ImageData(Se.subarray(l.image,l.image+l.w*l.h*4),l.w,l.h)));Promise.all(a).then(l=>{for(let u=0;u<s.length;u++)s[u].image=l[u];f=l,me({images:s,buffers:f,times:i,decodeStartTime:o})})}else{for(let a=n,l=0;l<self.jassubObj.count;a=a.next,++l){const u={w:a.w,h:a.h,x:a.x,y:a.y,image:a.image};if(!M){const c=X.slice(a.image,a.image+a.w*a.h*4);f.push(c),u.image=c}s.push(u)}me({images:s,buffers:f,times:i,decodeStartTime:o})}}else postMessage({target:"unbusy"})};self.demand=({time:e})=>{x=e,Ae(e)};const ie=e=>{j=0,Ae(Cr(),e),ne||(j=Fe(ie))},me=({times:e,images:r,decodeStartTime:t,buffers:n})=>{if(e.decodeTime=performance.now()-t,M){const i=performance.now();I.width=self.width,I.height!==self.height&&(I.height=self.height),M.clearRect(0,0,self.width,self.height);for(const s of r)s.image&&(E?(M.drawImage(s.image,s.x,s.y),s.image.close()):(self.bufferCanvas.width=s.w,self.bufferCanvas.height=s.h,self.bufferCtx.putImageData(new ImageData(Se.subarray(s.image,s.image+s.w*s.h*4),s.w,s.h),0,0),M.drawImage(self.bufferCanvas,s.x,s.y)));if(Xe){e.drawTime=performance.now()-i;let s=0;for(const f in e)s+=e[f];console.log("Bitmaps: "+r.length+" Total: "+Math.round(s)+"ms",e)}postMessage({target:"unbusy"})}else postMessage({target:"render",async:E,images:r,times:e,width:self.width,height:self.height},n)},Pr=e=>{let r,t,n,i,s,f,o,a,l,u;const c=[],d=e.split(/[\r\n]+/g);for(a=0;a<d.length;a++)if(r=d[a].match(/^\[(.*)\]$/),r)t=null,c.push({name:r[1],body:[]});else{if(/^\s*$/.test(d[a])||c.length===0)continue;if(u=c[c.length-1].body,d[a][0]===";")u.push({type:"comment",value:d[a].substring(1)});else{if(i=d[a].split(":"),s=i[0],f=i.slice(1).join(":").trim(),(t||s==="Format")&&(f=f.split(","),t&&f.length>t.length&&(n=f.slice(t.length-1).join(","),f=f.slice(0,t.length-1),f.push(n)),f=f.map(h=>h.trim()),t)){for(o={},l=0;l<f.length;l++)o[t[l]]=f[l];f=o}s==="Format"&&(t=f),u.push({key:s,value:f})}}return c},Fe=(()=>{let e=0;return r=>{const t=Date.now();if(e===0)e=t+1e3/re;else for(;t+2>=e;)e+=1e3/re;const n=Math.max(e-t,0);return setTimeout(r,n)}})(),le=(e,r)=>{for(const t of Object.keys(e))r[t]=e[t]};self.init=e=>{self.width=e.width,self.height=e.height,Je=e.blendMode,E=e.asyncRender,E&&typeof createImageBitmap>"u"&&(E=!1,console.error("'createImageBitmap' needed for 'asyncRender' unsupported!")),te=e.availableFonts,Xe=e.debug,re=e.targetFps||re,Ge=e.useLocalFonts;const r=e.fallbackFont.toLowerCase();self.jassubObj=new p.JASSUB(self.width,self.height,r||null),r&&we(r);let t=e.subContent;t||(t=Te(e.subUrl)),qe(t);for(const n of e.fonts||[])$e(n);self.jassubObj.createTrackMem(t),self.jassubObj.setDropAnimations(e.dropAllAnimations||0),(e.libassMemoryLimit>0||e.libassGlyphLimit>0)&&self.jassubObj.setMemoryLimits(e.libassGlyphLimit||0,e.libassMemoryLimit||0)};self.canvas=({width:e,height:r,force:t})=>{if(e==null)throw new Error("Invalid canvas size specified");_r(e,r),t&&Ae(x)};self.video=({currentTime:e,isPaused:r,rate:t})=>{e!=null&&Tr(e),r!=null&&Ye(r),t=t||t};let I,M;self.offscreenCanvas=({transferable:e})=>{I=e[0],M=I.getContext("2d",{desynchronized:!0}),E||(self.bufferCanvas=new OffscreenCanvas(self.height,self.width),self.bufferCtx=self.bufferCanvas.getContext("2d",{desynchronized:!0}))};self.destroy=()=>{self.jassubObj.quitLibrary()};self.createEvent=({event:e})=>{le(e,self.jassubObj.getEvent(self.jassubObj.allocEvent()))};self.getEvents=()=>{const e=[];for(let r=0;r<self.jassubObj.getEventCount();r++){const{Start:t,Duration:n,ReadOrder:i,Layer:s,Style:f,MarginL:o,MarginR:a,MarginV:l,Name:u,Text:c,Effect:d}=self.jassubObj.getEvent(r);e.push({Start:t,Duration:n,ReadOrder:i,Layer:s,Style:f,MarginL:o,MarginR:a,MarginV:l,Name:u,Text:c,Effect:d})}postMessage({target:"getEvents",events:e})};self.setEvent=({event:e,index:r})=>{le(e,self.jassubObj.getEvent(r))};self.removeEvent=({index:e})=>{self.jassubObj.removeEvent(e)};self.createStyle=({style:e})=>{le(e,self.jassubObj.getStyle(self.jassubObj.allocStyle()))};self.getStyles=()=>{const e=[];for(let r=0;r<self.jassubObj.getStyleCount();r++){const{Name:t,FontName:n,FontSize:i,PrimaryColour:s,SecondaryColour:f,OutlineColour:o,BackColour:a,Bold:l,Italic:u,Underline:c,StrikeOut:d,ScaleX:h,ScaleY:v,Spacing:y,Angle:b,BorderStyle:_,Outline:k,Shadow:T,Alignment:ye,MarginL:Y,MarginR:K,MarginV:Q,Encoding:pr,treat_fontname_as_pattern:hr,Blur:vr,Justify:yr}=self.jassubObj.getStyle(r);e.push({Name:t,FontName:n,FontSize:i,PrimaryColour:s,SecondaryColour:f,OutlineColour:o,BackColour:a,Bold:l,Italic:u,Underline:c,StrikeOut:d,ScaleX:h,ScaleY:v,Spacing:y,Angle:b,BorderStyle:_,Outline:k,Shadow:T,Alignment:ye,MarginL:Y,MarginR:K,MarginV:Q,Encoding:pr,treat_fontname_as_pattern:hr,Blur:vr,Justify:yr})}postMessage({target:"getStyles",time:Date.now(),styles:e})};self.setStyle=({style:e,index:r})=>{le(e,self.jassubObj.getStyle(r))};self.removeStyle=({index:e})=>{self.jassubObj.removeStyle(e)};onmessage=({data:e})=>{if(self[e.target])self[e.target](e);else throw new Error("Unknown event target "+e.target)};let Se=null;ae=(e=>r=>{e(r),Se=new Uint8ClampedArray(X)})(ae);function Ke(e){throw e}var Qe=new TextDecoder("utf8");function $r(e,r,t){for(var n=r+t,i=r;e[i]&&!(i>=n);)++i;return Qe.decode(e.buffer?e.subarray(r,i):new Uint8Array(e.slice(r,i)))}function ee(e,r){if(!e)return"";for(var t=e+r,n=e;!(n>=t)&&m[n];)++n;return Qe.decode(m.subarray(e,n))}function Ar(e,r,t,n){if(!(n>0))return 0;for(var i=t,s=t+n-1,f=0;f<e.length;++f){var o=e.charCodeAt(f);if(o>=55296&&o<=57343){var a=e.charCodeAt(++f);o=65536+((o&1023)<<10)|a&1023}if(o<=127){if(t>=s)break;r[t++]=o}else if(o<=2047){if(t+1>=s)break;r[t++]=192|o>>6,r[t++]=128|o&63}else if(o<=65535){if(t+2>=s)break;r[t++]=224|o>>12,r[t++]=128|o>>6&63,r[t++]=128|o&63}else{if(t+3>=s)break;r[t++]=240|o>>18,r[t++]=128|o>>12&63,r[t++]=128|o>>6&63,r[t++]=128|o&63}}return r[t]=0,t-i}function Fr(e,r,t){return Ar(e,m,r,t)}function Sr(e){for(var r=0,t=0;t<e.length;++t){var n=e.charCodeAt(t);n<=127?r++:n<=2047?r+=2:n>=55296&&n<=57343?(r+=4,++t):r+=3}return r}var je,z,U,m,ue,C,Ze,Ne,se,X,er;function ae(e){X=e,je=new Int8Array(e),z=new Int16Array(e),U=new Int32Array(e),m=new Uint8Array(e),ue=new Uint16Array(e),C=new Uint32Array(e),Ze=new Float32Array(e),Ne=new Float64Array(e)}function jr(e,r,t,n){Ke("Assertion failed: "+ee(e)+", at: "+[r?ee(r):"unknown filename",t,n?ee(n):"unknown function"])}function Or(e,r,t){return 0}function kr(e,r,t){}function Er(e,r,t){return 0}function Ur(e,r,t,n){}function Dr(e,r,t,n,i){}function Oe(e){switch(e){case 1:return 0;case 2:return 1;case 4:return 2;case 8:return 3;default:throw new TypeError("Unknown type size: "+e)}}function Mr(){for(var e=new Array(256),r=0;r<256;++r)e[r]=String.fromCharCode(r);rr=e}var rr=void 0;function w(e){for(var r="",t=e;m[t];)r+=rr[m[t++]];return r}var W={},R={},oe={},Wr=48,Rr=57;function ke(e){if(e===void 0)return"_unknown";e=e.replace(/[^a-zA-Z0-9_]/g,"$");var r=e.charCodeAt(0);return r>=Wr&&r<=Rr?"_"+e:e}function Ee(e,r){return e=ke(e),new Function("body","return function "+e+`() {
    "use strict";    return body.apply(this, arguments);
};
`)(r)}function Ue(e,r){var t=Ee(r,function(n){this.name=r,this.message=n;var i=new Error(n).stack;i!==void 0&&(this.stack=this.toString()+`
`+i.replace(/^Error(:[^\n]*)?\n/,""))});return t.prototype=Object.create(e.prototype),t.prototype.constructor=t,t.prototype.toString=function(){return this.message===void 0?this.name:this.name+": "+this.message},t}var L=void 0;function g(e){throw new L(e)}var tr=void 0;function fe(e){throw new tr(e)}function D(e,r,t){e.forEach(function(o){oe[o]=r});function n(o){var a=t(o);a.length!==e.length&&fe("Mismatched type converter count");for(var l=0;l<e.length;++l)F(e[l],a[l])}var i=new Array(r.length),s=[],f=0;r.forEach((o,a)=>{R.hasOwnProperty(o)?i[a]=R[o]:(s.push(o),W.hasOwnProperty(o)||(W[o]=[]),W[o].push(()=>{i[a]=R[o],++f,f===s.length&&n(i)}))}),s.length===0&&n(i)}function F(e,r,t={}){if(!("argPackAdvance"in r))throw new TypeError("registerType registeredInstance requires argPackAdvance");var n=r.name;if(e||g('type "'+n+'" must have a positive integer typeid pointer'),R.hasOwnProperty(e)){if(t.ignoreDuplicateRegistrations)return;g("Cannot register type '"+n+"' twice")}if(R[e]=r,delete oe[e],W.hasOwnProperty(e)){var i=W[e];delete W[e],i.forEach(s=>s())}}function Lr(e,r,t,n,i){var s=Oe(t);r=w(r),F(e,{name:r,fromWireType:function(f){return!!f},toWireType:function(f,o){return o?n:i},argPackAdvance:8,readValueFromPointer:function(f){var o;if(t===1)o=je;else if(t===2)o=z;else if(t===4)o=U;else throw new TypeError("Unknown boolean type size: "+r);return this.fromWireType(o[f>>s])},destructorFunction:null})}function Ir(e){if(!(this instanceof S)||!(e instanceof S))return!1;for(var r=this.$$.ptrType.registeredClass,t=this.$$.ptr,n=e.$$.ptrType.registeredClass,i=e.$$.ptr;r.baseClass;)t=r.upcast(t),r=r.baseClass;for(;n.baseClass;)i=n.upcast(i),n=n.baseClass;return r===n&&t===i}function Hr(e){return{count:e.count,deleteScheduled:e.deleteScheduled,preservePointerOnDelete:e.preservePointerOnDelete,ptr:e.ptr,ptrType:e.ptrType,smartPtr:e.smartPtr,smartPtrType:e.smartPtrType}}function De(e){function r(t){return t.$$.ptrType.registeredClass.name}g(r(e)+" instance already deleted")}var be=!1;function nr(e){}function Vr(e){e.smartPtr?e.smartPtrType.rawDestructor(e.smartPtr):e.ptrType.registeredClass.rawDestructor(e.ptr)}function ir(e){e.count.value-=1;var r=e.count.value===0;r&&Vr(e)}function sr(e,r,t){if(r===t)return e;if(t.baseClass===void 0)return null;var n=sr(e,r,t.baseClass);return n===null?null:t.downcast(n)}var ar={};function Br(){return Object.keys(V).length}function xr(){var e=[];for(var r in V)V.hasOwnProperty(r)&&e.push(V[r]);return e}var G=[];function Me(){for(;G.length;){var e=G.pop();e.$$.deleteScheduled=!1,e.delete()}}var H=void 0;function zr(e){H=e,G.length&&H&&H(Me)}function Gr(){p.getInheritedInstanceCount=Br,p.getLiveInheritedInstances=xr,p.flushPendingDeletes=Me,p.setDelayFunction=zr}var V={};function Jr(e,r){for(r===void 0&&g("ptr should not be undefined");e.baseClass;)r=e.upcast(r),e=e.baseClass;return r}function Xr(e,r){return r=Jr(e,r),V[r]}function Z(e,r){(!r.ptrType||!r.ptr)&&fe("makeClassHandle requires ptr and ptrType");var t=!!r.smartPtrType,n=!!r.smartPtr;return t!==n&&fe("Both smartPtrType and smartPtr must be specified"),r.count={value:1},B(Object.create(e,{$$:{value:r}}))}function qr(e){var r=this.getPointee(e);if(!r)return this.destructor(e),null;var t=Xr(this.registeredClass,r);if(t!==void 0){if(t.$$.count.value===0)return t.$$.ptr=r,t.$$.smartPtr=e,t.clone();var n=t.clone();return this.destructor(e),n}function i(){return this.isSmartPointer?Z(this.registeredClass.instancePrototype,{ptrType:this.pointeeType,ptr:r,smartPtrType:this,smartPtr:e}):Z(this.registeredClass.instancePrototype,{ptrType:this,ptr:e})}var s=this.registeredClass.getActualType(r),f=ar[s];if(!f)return i.call(this);var o;this.isConst?o=f.constPointerType:o=f.pointerType;var a=sr(r,this.registeredClass,o.registeredClass);return a===null?i.call(this):this.isSmartPointer?Z(o.registeredClass.instancePrototype,{ptrType:o,ptr:a,smartPtrType:this,smartPtr:e}):Z(o.registeredClass.instancePrototype,{ptrType:o,ptr:a})}function B(e){return typeof FinalizationRegistry>"u"?(B=r=>r,e):(be=new FinalizationRegistry(r=>{ir(r.$$)}),B=r=>{var t=r.$$,n=!!t.smartPtr;if(n){var i={$$:t};be.register(r,i,r)}return r},nr=r=>be.unregister(r),B(e))}function Yr(){if(this.$$.ptr||De(this),this.$$.preservePointerOnDelete)return this.$$.count.value+=1,this;var e=B(Object.create(Object.getPrototypeOf(this),{$$:{value:Hr(this.$$)}}));return e.$$.count.value+=1,e.$$.deleteScheduled=!1,e}function Kr(){this.$$.ptr||De(this),this.$$.deleteScheduled&&!this.$$.preservePointerOnDelete&&g("Object already scheduled for deletion"),nr(this),ir(this.$$),this.$$.preservePointerOnDelete||(this.$$.smartPtr=void 0,this.$$.ptr=void 0)}function Qr(){return!this.$$.ptr}function Zr(){return this.$$.ptr||De(this),this.$$.deleteScheduled&&!this.$$.preservePointerOnDelete&&g("Object already scheduled for deletion"),G.push(this),G.length===1&&H&&H(Me),this.$$.deleteScheduled=!0,this}function Nr(){S.prototype.isAliasOf=Ir,S.prototype.clone=Yr,S.prototype.delete=Kr,S.prototype.isDeleted=Qr,S.prototype.deleteLater=Zr}function S(){}function or(e,r,t){if(e[r].overloadTable===void 0){var n=e[r];e[r]=function(){return e[r].overloadTable.hasOwnProperty(arguments.length)||g("Function '"+t+"' called with an invalid number of arguments ("+arguments.length+") - expects one of ("+e[r].overloadTable+")!"),e[r].overloadTable[arguments.length].apply(this,arguments)},e[r].overloadTable=[],e[r].overloadTable[n.argCount]=n}}function et(e,r,t){p.hasOwnProperty(e)?((t===void 0||p[e].overloadTable!==void 0&&p[e].overloadTable[t]!==void 0)&&g("Cannot register public name '"+e+"' twice"),or(p,e,e),p.hasOwnProperty(t)&&g("Cannot register multiple overloads of a function with the same number of arguments ("+t+")!"),p[e].overloadTable[t]=r):(p[e]=r,t!==void 0&&(p[e].numArguments=t))}function rt(e,r,t,n,i,s,f,o){this.name=e,this.constructor=r,this.instancePrototype=t,this.rawDestructor=n,this.baseClass=i,this.getActualType=s,this.upcast=f,this.downcast=o,this.pureVirtualFunctions=[]}function ce(e,r,t){for(;r!==t;)r.upcast||g("Expected null or instance of "+t.name+", got an instance of "+r.name),e=r.upcast(e),r=r.baseClass;return e}function tt(e,r){if(r===null)return this.isReference&&g("null is not a valid "+this.name),0;r.$$||g('Cannot pass "'+We(r)+'" as a '+this.name),r.$$.ptr||g("Cannot pass deleted object as a pointer of type "+this.name);var t=r.$$.ptrType.registeredClass,n=ce(r.$$.ptr,t,this.registeredClass);return n}function nt(e,r){var t;if(r===null)return this.isReference&&g("null is not a valid "+this.name),this.isSmartPointer?(t=this.rawConstructor(),e!==null&&e.push(this.rawDestructor,t),t):0;r.$$||g('Cannot pass "'+We(r)+'" as a '+this.name),r.$$.ptr||g("Cannot pass deleted object as a pointer of type "+this.name),!this.isConst&&r.$$.ptrType.isConst&&g("Cannot convert argument of type "+(r.$$.smartPtrType?r.$$.smartPtrType.name:r.$$.ptrType.name)+" to parameter type "+this.name);var n=r.$$.ptrType.registeredClass;if(t=ce(r.$$.ptr,n,this.registeredClass),this.isSmartPointer)switch(r.$$.smartPtr===void 0&&g("Passing raw pointer to smart pointer is illegal"),this.sharingPolicy){case 0:r.$$.smartPtrType===this?t=r.$$.smartPtr:g("Cannot convert argument of type "+(r.$$.smartPtrType?r.$$.smartPtrType.name:r.$$.ptrType.name)+" to parameter type "+this.name);break;case 1:t=r.$$.smartPtr;break;case 2:if(r.$$.smartPtrType===this)t=r.$$.smartPtr;else{var i=r.clone();t=this.rawShare(t,Ce.toHandle(function(){i.delete()})),e!==null&&e.push(this.rawDestructor,t)}break;default:g("Unsupporting sharing policy")}return t}function it(e,r){if(r===null)return this.isReference&&g("null is not a valid "+this.name),0;r.$$||g('Cannot pass "'+We(r)+'" as a '+this.name),r.$$.ptr||g("Cannot pass deleted object as a pointer of type "+this.name),r.$$.ptrType.isConst&&g("Cannot convert argument of type "+r.$$.ptrType.name+" to parameter type "+this.name);var t=r.$$.ptrType.registeredClass,n=ce(r.$$.ptr,t,this.registeredClass);return n}function de(e){return this.fromWireType(U[e>>2])}function st(e){return this.rawGetPointee&&(e=this.rawGetPointee(e)),e}function at(e){this.rawDestructor&&this.rawDestructor(e)}function ot(e){e!==null&&e.delete()}function ft(){$.prototype.getPointee=st,$.prototype.destructor=at,$.prototype.argPackAdvance=8,$.prototype.readValueFromPointer=de,$.prototype.deleteObject=ot,$.prototype.fromWireType=qr}function $(e,r,t,n,i,s,f,o,a,l,u){this.name=e,this.registeredClass=r,this.isReference=t,this.isConst=n,this.isSmartPointer=i,this.pointeeType=s,this.sharingPolicy=f,this.rawGetPointee=o,this.rawConstructor=a,this.rawShare=l,this.rawDestructor=u,!i&&r.baseClass===void 0?n?(this.toWireType=tt,this.destructorFunction=null):(this.toWireType=it,this.destructorFunction=null):this.toWireType=nt}function lt(e,r,t){p.hasOwnProperty(e)||fe("Replacing nonexistant public symbol"),p[e].overloadTable!==void 0&&t!==void 0?p[e].overloadTable[t]=r:(p[e]=r,p[e].argCount=t)}function ut(e,r,t){var n=dynCalls[e];return t&&t.length?n.apply(null,[r].concat(t)):n.call(null,r)}var N=[];function q(e){var r=N[e];return r||(e>=N.length&&(N.length=e+1),N[e]=r=er.get(e)),r}function ct(e,r,t){if(e.includes("j"))return ut(e,r,t);var n=q(r).apply(null,t);return n}function dt(e,r){var t=[];return function(){return t.length=0,Object.assign(t,arguments),ct(e,r,t)}}function O(e,r){e=w(e);function t(){return e.includes("j")?dt(e,r):q(r)}var n=t();return typeof n!="function"&&g("unknown function pointer with signature "+e+": "+r),n}var fr=void 0;function gt(e){var r=gr(e),t=w(r);return A(r),t}function J(e,r){var t=[],n={};function i(s){if(!n[s]&&!R[s]){if(oe[s]){oe[s].forEach(i);return}t.push(s),n[s]=!0}}throw r.forEach(i),new fr(e+": "+t.map(gt).join([", "]))}function pt(e,r,t,n,i,s,f,o,a,l,u,c,d){u=w(u),s=O(i,s),o&&(o=O(f,o)),l&&(l=O(a,l)),d=O(c,d);var h=ke(u);et(h,function(){J("Cannot construct "+u+" due to unbound types",[n])}),D([e,r,t],n?[n]:[],function(v){v=v[0];var y,b;n?(y=v.registeredClass,b=y.instancePrototype):b=S.prototype;var _=Ee(h,function(){if(Object.getPrototypeOf(this)!==k)throw new L("Use 'new' to construct "+u);if(T.constructor_body===void 0)throw new L(u+" has no accessible constructor");var Q=T.constructor_body[arguments.length];if(Q===void 0)throw new L("Tried to invoke ctor of "+u+" with invalid number of parameters ("+arguments.length+") - expected ("+Object.keys(T.constructor_body).toString()+") parameters instead!");return Q.apply(this,arguments)}),k=Object.create(b,{constructor:{value:_}});_.prototype=k;var T=new rt(u,_,k,d,y,s,o,l),ye=new $(u,T,!0,!1,!1),Y=new $(u+"*",T,!1,!1,!1),K=new $(u+" const*",T,!1,!0,!1);return ar[e]={pointerType:Y,constPointerType:K},lt(h,_),[ye,Y,K]})}function lr(e,r){for(var t=[],n=0;n<e;n++)t.push(C[r+n*4>>2]);return t}function ur(e){for(;e.length;){var r=e.pop(),t=e.pop();t(r)}}function ht(e,r){if(!(e instanceof Function))throw new TypeError("new_ called with constructor type "+typeof e+" which is not a function");var t=Ee(e.name||"unknownFunctionName",function(){});t.prototype=e.prototype;var n=new t,i=e.apply(n,r);return i instanceof Object?i:n}function cr(e,r,t,n,i){var s=r.length;s<2&&g("argTypes array size mismatch! Must at least get return value and 'this' types!");for(var f=r[1]!==null&&t!==null,o=!1,a=1;a<r.length;++a)if(r[a]!==null&&r[a].destructorFunction===void 0){o=!0;break}for(var l=r[0].name!=="void",u="",c="",a=0;a<s-2;++a)u+=(a!==0?", ":"")+"arg"+a,c+=(a!==0?", ":"")+"arg"+a+"Wired";var d="return function "+ke(e)+"("+u+`) {
if (arguments.length !== `+(s-2)+`) {
throwBindingError('function `+e+" called with ' + arguments.length + ' arguments, expected "+(s-2)+` args!');
}
`;o&&(d+=`var destructors = [];
`);var h=o?"destructors":"null",v=["throwBindingError","invoker","fn","runDestructors","retType","classParam"],y=[g,n,i,ur,r[0],r[1]];f&&(d+="var thisWired = classParam.toWireType("+h+`, this);
`);for(var a=0;a<s-2;++a)d+="var arg"+a+"Wired = argType"+a+".toWireType("+h+", arg"+a+"); // "+r[a+2].name+`
`,v.push("argType"+a),y.push(r[a+2]);if(f&&(c="thisWired"+(c.length>0?", ":"")+c),d+=(l?"var rv = ":"")+"invoker(fn"+(c.length>0?", ":"")+c+`);
`,o)d+=`runDestructors(destructors);
`;else for(var a=f?1:2;a<r.length;++a){var b=a===1?"thisWired":"arg"+(a-2)+"Wired";r[a].destructorFunction!==null&&(d+=b+"_dtor("+b+"); // "+r[a].name+`
`,v.push(b+"_dtor"),y.push(r[a].destructorFunction))}l&&(d+=`var ret = retType.fromWireType(rv);
return ret;
`),d+=`}
`,v.push(d);var _=ht(Function,v).apply(null,y);return _}function vt(e,r,t,n,i,s){assert(r>0);var f=lr(r,t);i=O(n,i),D([],[e],function(o){o=o[0];var a="constructor "+o.name;if(o.registeredClass.constructor_body===void 0&&(o.registeredClass.constructor_body=[]),o.registeredClass.constructor_body[r-1]!==void 0)throw new L("Cannot register multiple constructors with identical number of parameters ("+(r-1)+") for class '"+o.name+"'! Overload resolution is currently only performed using the parameter count, not actual type info!");return o.registeredClass.constructor_body[r-1]=()=>{J("Cannot construct "+o.name+" due to unbound types",f)},D([],f,function(l){return l.splice(1,0,null),o.registeredClass.constructor_body[r-1]=cr(a,l,null,i,s),[]}),[]})}function yt(e,r,t,n,i,s,f,o){var a=lr(t,n);r=w(r),s=O(i,s),D([],[e],function(l){l=l[0];var u=l.name+"."+r;r.startsWith("@@")&&(r=Symbol[r.substring(2)]),o&&l.registeredClass.pureVirtualFunctions.push(r);function c(){J("Cannot call "+u+" due to unbound types",a)}var d=l.registeredClass.instancePrototype,h=d[r];return h===void 0||h.overloadTable===void 0&&h.className!==l.name&&h.argCount===t-2?(c.argCount=t-2,c.className=l.name,d[r]=c):(or(d,r,u),d[r].overloadTable[t-2]=c),D([],a,function(v){var y=cr(u,v,l,s,f);return d[r].overloadTable===void 0?(y.argCount=t-2,d[r]=y):d[r].overloadTable[t-2]=y,[]}),[]})}function He(e,r,t){return e instanceof Object||g(t+' with invalid "this": '+e),e instanceof r.registeredClass.constructor||g(t+' incompatible with "this" of type '+e.constructor.name),e.$$.ptr||g("cannot call emscripten binding method "+t+" on deleted object"),ce(e.$$.ptr,e.$$.ptrType.registeredClass,r.registeredClass)}function mt(e,r,t,n,i,s,f,o,a,l){r=w(r),i=O(n,i),D([],[e],function(u){u=u[0];var c=u.name+"."+r,d={get:function(){J("Cannot access "+c+" due to unbound types",[t,f])},enumerable:!0,configurable:!0};return a?d.set=()=>{J("Cannot access "+c+" due to unbound types",[t,f])}:d.set=h=>{g(c+" is a read-only property")},Object.defineProperty(u.registeredClass.instancePrototype,r,d),D([],a?[t,f]:[t],function(h){var v=h[0],y={get:function(){var _=He(this,u,c+" getter");return v.fromWireType(i(s,_))},enumerable:!0};if(a){a=O(o,a);var b=h[1];y.set=function(_){var k=He(this,u,c+" setter"),T=[];a(l,k,b.toWireType(T,_)),ur(T)}}return Object.defineProperty(u.registeredClass.instancePrototype,r,y),[]}),[]})}var _e=[],P=[{},{value:void 0},{value:null},{value:!0},{value:!1}];function bt(e){e>4&&--P[e].refcount===0&&(P[e]=void 0,_e.push(e))}function wt(){for(var e=0,r=5;r<P.length;++r)P[r]!==void 0&&++e;return e}function _t(){for(var e=5;e<P.length;++e)if(P[e]!==void 0)return P[e];return null}function Ct(){p.count_emval_handles=wt,p.get_first_emval=_t}var Ce={toValue:e=>(e||g("Cannot use deleted val. handle = "+e),P[e].value),toHandle:e=>{switch(e){case void 0:return 1;case null:return 2;case!0:return 3;case!1:return 4;default:{var r=_e.length?_e.pop():P.length;return P[r]={refcount:1,value:e},r}}}};function Tt(e,r){r=w(r),F(e,{name:r,fromWireType:function(t){var n=Ce.toValue(t);return bt(t),n},toWireType:function(t,n){return Ce.toHandle(n)},argPackAdvance:8,readValueFromPointer:de,destructorFunction:null})}function We(e){if(e===null)return"null";var r=typeof e;return r==="object"||r==="array"||r==="function"?e.toString():""+e}function Pt(e,r){switch(r){case 2:return function(t){return this.fromWireType(Ze[t>>2])};case 3:return function(t){return this.fromWireType(Ne[t>>3])};default:throw new TypeError("Unknown float type: "+e)}}function $t(e,r,t){var n=Oe(t);r=w(r),F(e,{name:r,fromWireType:function(i){return i},toWireType:function(i,s){return s},argPackAdvance:8,readValueFromPointer:Pt(r,n),destructorFunction:null})}function At(e,r,t){switch(r){case 0:return t?function(i){return je[i]}:function(i){return m[i]};case 1:return t?function(i){return z[i>>1]}:function(i){return ue[i>>1]};case 2:return t?function(i){return U[i>>2]}:function(i){return C[i>>2]};default:throw new TypeError("Unknown integer type: "+e)}}function Ft(e,r,t,n,i){r=w(r);var s=Oe(t),f=c=>c;if(n===0){var o=32-8*t;f=c=>c<<o>>>o}var a=r.includes("unsigned"),l=(c,d)=>{},u;a?u=function(c,d){return l(d,this.name),d>>>0}:u=function(c,d){return l(d,this.name),d},F(e,{name:r,fromWireType:f,toWireType:u,argPackAdvance:8,readValueFromPointer:At(r,s,n!==0),destructorFunction:null})}function St(e,r,t){var n=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array],i=n[r];function s(f){f=f>>2;var o=C,a=o[f],l=o[f+1];return new i(X,l,a)}t=w(t),F(e,{name:t,fromWireType:s,argPackAdvance:8,readValueFromPointer:s},{ignoreDuplicateRegistrations:!0})}function jt(e,r){r=w(r);var t=r==="std::string";F(e,{name:r,fromWireType:function(n){var i=C[n>>2],s=n+4,f;if(t)for(var o=s,a=0;a<=i;++a){var l=s+a;if(a==i||m[l]==0){var u=l-o,c=ee(o,u);f===void 0?f=c:(f+=String.fromCharCode(0),f+=c),o=l+1}}else{for(var d=new Array(i),a=0;a<i;++a)d[a]=String.fromCharCode(m[s+a]);f=d.join("")}return A(n),f},toWireType:function(n,i){i instanceof ArrayBuffer&&(i=new Uint8Array(i));var s,f=typeof i=="string";f||i instanceof Uint8Array||i instanceof Uint8ClampedArray||i instanceof Int8Array||g("Cannot pass non-string to std::string"),t&&f?s=Sr(i):s=i.length;var o=ge(4+s+1),a=o+4;if(C[o>>2]=s,t&&f)Fr(i,a,s+1);else if(f)for(var l=0;l<s;++l){var u=i.charCodeAt(l);u>255&&(A(a),g("String has UTF-16 code units that do not fit in 8 bits")),m[a+l]=u}else for(var l=0;l<s;++l)m[a+l]=i[l];return n!==null&&n.push(A,o),o},argPackAdvance:8,readValueFromPointer:de,destructorFunction:function(n){A(n)}})}var Ot=new TextDecoder("utf-16le");function kt(e,r){for(var t=e,n=t>>1,i=n+r/2;!(n>=i)&&ue[n];)++n;return t=n<<1,Ot.decode(m.subarray(e,t))}function Et(e,r,t){if(t===void 0&&(t=2147483647),t<2)return 0;t-=2;for(var n=r,i=t<e.length*2?t/2:e.length,s=0;s<i;++s){var f=e.charCodeAt(s);z[r>>1]=f,r+=2}return z[r>>1]=0,r-n}function Ut(e){return e.length*2}function Dt(e,r){for(var t=0,n="";!(t>=r/4);){var i=U[e+t*4>>2];if(i==0)break;if(++t,i>=65536){var s=i-65536;n+=String.fromCharCode(55296|s>>10,56320|s&1023)}else n+=String.fromCharCode(i)}return n}function Mt(e,r,t){if(t===void 0&&(t=2147483647),t<4)return 0;for(var n=r,i=n+t-4,s=0;s<e.length;++s){var f=e.charCodeAt(s);if(f>=55296&&f<=57343){var o=e.charCodeAt(++s);f=65536+((f&1023)<<10)|o&1023}if(U[r>>2]=f,r+=4,r+4>i)break}return U[r>>2]=0,r-n}function Wt(e){for(var r=0,t=0;t<e.length;++t){var n=e.charCodeAt(t);n>=55296&&n<=57343&&++t,r+=4}return r}function Rt(e,r,t){t=w(t);var n,i,s,f,o;r===2?(n=kt,i=Et,f=Ut,s=()=>ue,o=1):r===4&&(n=Dt,i=Mt,f=Wt,s=()=>C,o=2),F(e,{name:t,fromWireType:function(a){for(var l=C[a>>2],u=s(),c,d=a+4,h=0;h<=l;++h){var v=a+4+h*r;if(h==l||u[v>>o]==0){var y=v-d,b=n(d,y);c===void 0?c=b:(c+=String.fromCharCode(0),c+=b),d=v+r}}return A(a),c},toWireType:function(a,l){typeof l!="string"&&g("Cannot pass non-string to C++ string type "+t);var u=f(l),c=ge(4+u+r);return C[c>>2]=u>>o,i(l,c+4,u+r),a!==null&&a.push(A,c),c},argPackAdvance:8,readValueFromPointer:de,destructorFunction:function(a){A(a)}})}function Lt(e,r){r=w(r),F(e,{isVoid:!0,name:r,argPackAdvance:0,fromWireType:function(){},toWireType:function(t,n){}})}function It(){throw 1/0}function Ht(){Ke("")}var dr;dr=()=>performance.now();function Vt(e,r,t){m.copyWithin(e,r,r+t)}function Bt(){return 2147483648}function xt(e){try{return se.grow(e-X.byteLength+65535>>>16),ae(se.buffer),1}catch{}}function zt(e){var r=m.length;e=e>>>0;var t=Bt();if(e>t)return!1;let n=(a,l)=>a+(l-a%l)%l;for(var i=1;i<=4;i*=2){var s=r*(1+.2/i);s=Math.min(s,e+100663296);var f=Math.min(t,n(Math.max(e,s),65536)),o=xt(f);if(o)return!0}return!1}function Gt(e){throw"exit("+e+")"}var Jt=Gt;function Xt(e){return 52}function qt(e,r,t,n){return 52}function Yt(e,r,t,n,i){return 70}var Kt=[null,[],[]];function Qt(e,r){var t=Kt[e];r===0||r===10?((e===1?Be:xe)($r(t,0)),t.length=0):t.push(r)}function Zt(e,r,t,n){for(var i=0,s=0;s<t;s++){var f=C[r>>2],o=C[r+4>>2];r+=8;for(var a=0;a<o;a++)Qt(e,m[f+a]);i+=o}return C[n>>2]=i,0}Mr();L=p.BindingError=Ue(Error,"BindingError");tr=p.InternalError=Ue(Error,"InternalError");Nr();Gr();ft();fr=p.UnboundTypeError=Ue(Error,"UnboundTypeError");Ct();var Nt={a:jr,m:Or,z:kr,D:Er,l:Ur,t:Dr,p:Lr,j:pt,s:vt,c:yt,b:mt,E:Tt,n:$t,f:Ft,d:St,o:jt,k:Rt,q:Lt,x:It,e:Ht,g:dr,A:Vt,y:zt,h:Jt,i:Xt,C:qt,r:Yt,B:Zt,w:en,u:tn,v:rn};function en(e,r,t){var n=he();try{return q(e)(r,t)}catch(i){if(ve(n),i!==i+0)throw i;pe(1,0)}}function rn(e,r,t,n,i){var s=he();try{return q(e)(r,t,n,i)}catch(f){if(ve(s),f!==f+0)throw f;pe(1,0)}}function tn(e,r,t,n){var i=he();try{return q(e)(r,t,n)}catch(s){if(ve(i),s!==s+0)throw s;pe(1,0)}}function nn(e){e.G()}var Ve={a:Nt},ge,A,gr,pe,he,ve;(WebAssembly.instantiateStreaming?WebAssembly.instantiateStreaming(fetch("jassub-worker.wasm"),Ve):WebAssembly.instantiate(p.wasm,Ve)).then(function(e){asm=(e.instance||e).exports,ge=asm.H,A=asm.I,gr=asm.J,asm.K,pe=asm.M,asm.N,he=asm.O,ve=asm.P,asm.Q,asm.R,asm.S,asm.T,er=asm.L,se=asm.F,ae(se.buffer),nn(asm),ze()});
