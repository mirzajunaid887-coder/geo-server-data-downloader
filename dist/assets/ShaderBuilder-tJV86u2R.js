import{r as m,z as _}from"./index-GdCjpdJ6.js";const p=()=>_.getLogger("esri.views.3d.webgl-engine.core.shaderModules.shaderBuilder");class b{constructor(){this._includedModules=new Map}include(e,n){this._includedModules.has(e)?this._includedModules.get(e):(this._includedModules.set(e,n),e(this.builder,n))}}class U extends b{constructor(){super(...arguments),this.vertex=new g,this.fragment=new g,this.attributes=new A,this.varyings=new F,this.outputs=new l}get attributeNames(){return this.attributes.names}get builder(){return this}generate(e,n=!1){const t=this.attributes.generateSource(e),r=this.varyings.generateSource(e),i=e==="vertex"?this.vertex:this.fragment,a=i.uniforms.generateSource(),u=i.code.generateSource(),h=i.main.generateSource(n),d=this.debugName?`// ${this.debugName}
`:"",f=e==="vertex"?D:E,$=i.constants.generateSource(),S=this.outputs.generateSource(e);return`#version 300 es
${d}
${f}
${$.join(`
`)}
${a.join(`
`)}
${t.join(`
`)}
${r.join(`
`)}
${S.join(`
`)}
${u.join(`
`)}
${h.join(`
`)}`}generateBind(e){const n=new Map;this.vertex.uniforms.entries.forEach(i=>{const a=i.bind[0];a&&n.set(i.name,a)}),this.fragment.uniforms.entries.forEach(i=>{const a=i.bind[0];a&&n.set(i.name,a)});const t=Array.from(n.values()),r=t.length;return i=>{for(let a=0;a<r;++a)t[a](e,i)}}generateBindPass(e){const n=new Map;this.vertex.uniforms.entries.forEach(i=>{const a=i.bind[1];a&&n.set(i.name,a)}),this.fragment.uniforms.entries.forEach(i=>{const a=i.bind[1];a&&n.set(i.name,a)});const t=Array.from(n.values()),r=t.length;return(i,a)=>{for(let u=0;u<r;++u)t[u](e,i,a)}}generateBindDraw(e){const n=new Map;this.vertex.uniforms.entries.forEach(i=>{const a=i.bind[2];a&&n.set(i.name,a)}),this.fragment.uniforms.entries.forEach(i=>{const a=i.bind[2];a&&n.set(i.name,a)});const t=Array.from(n.values()),r=t.length;return(i,a,u)=>{for(let h=0;h<r;++h)t[h](e,u,i,a)}}}class v{constructor(e){this._stage=e,this._entries=new Map}add(...e){for(const n of e)this._add(n);return this._stage}get(e){return this._entries.get(e)}_add(e){if(e!=null){if(this._entries.has(e.name)&&!this._entries.get(e.name).equals(e))throw new m("shaderbuilder:duplicate-uniform",`Duplicate uniform name ${e.name} for different uniform type`);this._entries.set(e.name,e)}else p().error(`Trying to add null Uniform from ${new Error().stack}.`)}generateSource(){return Array.from(this._entries.values()).map(({name:e,arraySize:n,type:t})=>n!=null?`uniform ${t} ${e}[${n}];`:`uniform ${t} ${e};`)}get entries(){return Array.from(this._entries.values())}}class T{constructor(){this._entries=new Map}add(e,n){if(this._entries.has(e))throw new m("shaderbuilder:duplicate-input",`Duplicate input for ${e}`);this._entries.set(e,n)}get(e){const n=this._entries.get(e);if(n==null)throw new m("shaderbuilder:input-resolver-error",`No resolver for input ${e} found.`);return n()}}class w{constructor(e){this._stage=e,this._bodies=new Array}add(e){return this._bodies.push(e),this._stage}generateSource(e){if(this._bodies.length>0)return[`void main() {
 ${this._bodies.join(`
`)||""} 
}`];if(e)throw new m("shaderbuilder:missing-main","Shader does not contain main function body.");return[]}}class y{constructor(e){this._stage=e,this._entries=new Array}add(e){return this._entries.push(e),this._stage}generateSource(){return this._entries}}class g extends b{constructor(){super(...arguments),this.uniforms=new v(this),this.main=new w(this),this.code=new y(this),this.constants=new s(this),this.inputs=new T}get builder(){return this}}class A{constructor(){this._entries=new Array}add(e,n){this._entries.push([e,n])}generateSource(e){return e==="fragment"?[]:this._entries.map(n=>`in ${n[1]} ${n[0]};`)}get names(){return this._entries.map(([e])=>e)}}class F{constructor(){this._entries=new Map}add(e,n,t){this._entries.has(e)?p().warn(`Ignoring duplicate varying ${n} ${e}`):this._entries.set(e,{type:n,invariant:(t==null?void 0:t.invariant)??!1})}generateSource(e){const n=new Array;return this._entries.forEach((t,r)=>n.push((t.invariant&&e==="vertex"?"invariant ":"")+(t.type==="int"?"flat ":"")+(e==="vertex"?"out":"in")+` ${t.type} ${r};`)),n}}const c=class c{constructor(){this._entries=new Map}add(e,n,t=0){const r=this._entries.get(t);(r==null?void 0:r.name)!==e||(r==null?void 0:r.type)!==n?this._entries.set(t,{name:e,type:n}):p().warn(`Fragment shader output location ${t} occupied`)}generateSource(e){if(e==="vertex")return[];this._entries.size===0&&this._entries.set(0,{name:c.DEFAULT_NAME,type:c.DEFAULT_TYPE});const n=new Array;return this._entries.forEach((t,r)=>n.push(`layout(location = ${r}) out ${t.type} ${t.name};`)),n}};c.DEFAULT_TYPE="vec4",c.DEFAULT_NAME="fragColor";let l=c;class s{constructor(e){this._stage=e,this._entries=new Set}add(e,n,t){let r="ERROR_CONSTRUCTOR_STRING";switch(n){case"float":r=s._numberToFloatStr(t);break;case"int":r=s._numberToIntStr(t);break;case"uint":r=s._numberToUintStr(t);break;case"bool":r=t.toString();break;case"vec2":r=`vec2(${s._numberToFloatStr(t[0])},                            ${s._numberToFloatStr(t[1])})`;break;case"vec3":r=`vec3(${s._numberToFloatStr(t[0])},                            ${s._numberToFloatStr(t[1])},                            ${s._numberToFloatStr(t[2])})`;break;case"vec4":r=`vec4(${s._numberToFloatStr(t[0])},                            ${s._numberToFloatStr(t[1])},                            ${s._numberToFloatStr(t[2])},                            ${s._numberToFloatStr(t[3])})`;break;case"ivec2":r=`ivec2(${s._numberToIntStr(t[0])},                             ${s._numberToIntStr(t[1])})`;break;case"ivec3":r=`ivec3(${s._numberToIntStr(t[0])},                             ${s._numberToIntStr(t[1])},                             ${s._numberToIntStr(t[2])})`;break;case"ivec4":r=`ivec4(${s._numberToIntStr(t[0])},                             ${s._numberToIntStr(t[1])},                             ${s._numberToIntStr(t[2])},                             ${s._numberToIntStr(t[3])})`;break;case"uvec2":r=`uvec2(${s._numberToUintStr(t[0])},                             ${s._numberToUintStr(t[1])})`;break;case"uvec3":r=`uvec3(${s._numberToUintStr(t[0])},                             ${s._numberToUintStr(t[1])},                             ${s._numberToUintStr(t[2])})`;break;case"uvec4":r=`uvec4(${s._numberToUintStr(t[0])},                             ${s._numberToUintStr(t[1])},                             ${s._numberToUintStr(t[2])},                             ${s._numberToUintStr(t[3])})`;break;case"mat2":case"mat3":case"mat4":r=`${n}(${Array.prototype.map.call(t,i=>s._numberToFloatStr(i)).join(", ")})`}return this._entries.add(`const ${n} ${e} = ${r};`),this._stage}static _numberToIntStr(e){return e.toFixed(0)}static _numberToUintStr(e){return`${e.toFixed(0)}u`}static _numberToFloatStr(e){return Number.isInteger(e)?e.toFixed(1):e.toString()}generateSource(){return Array.from(this._entries)}}const E=`#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  precision highp int;
  precision highp sampler2D;
  precision highp usampler2D;
  precision highp sampler2DArray;
  precision highp sampler2DShadow;
#else
  precision mediump float;
  precision mediump int;
  precision mediump sampler2D;
  precision mediump usampler2D;
  precision mediump sampler2DArray;
  precision mediump sampler2DShadow;
#endif`,D=`precision highp float;
 precision highp int;
 precision highp sampler2D;
 precision highp usampler2D;
 precision highp sampler2DArray;
 precision highp sampler2DShadow;


 invariant gl_Position;
 `;export{U as s};
