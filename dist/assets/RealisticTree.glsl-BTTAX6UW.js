import{aB as T,aZ as pe,ii as Fa,ep as Pa,fm as $a,iL as ja,ex as ce,iA as Oa,qW as Ra,kj as Wa,w$ as Wt,aH as Nt,ai as c,aj as G,ak as j,x0 as Na,x1 as Ea,aq as Et,iR as Qe,iX as de,iJ as wt,iy as Ga,o7 as Mt,lV as K,kk as X,gP as et,_ as B,fK as ge,e2 as Ba,e4 as La,eh as Gt,i9 as Va,pH as Bt,ds as Aa,wb as E,h9 as Ha,hW as We,bN as Ua,a$ as ka,aP as Za,eu as Ne,eC as Ja,ev as St,aM as qa,fy as Ya,aD as Xa}from"./index-o98Aja7I.js";import{L as R,ax as N,g as Lt,ay as Ie,az as Vt,aA as At,a9 as we,aB as Ka,aC as Qa,M as eo,aD as se,K as x,P as Ht,f as U,aE as k,u as le,O as w,h as Z,R as to,d as ao,aF as Ut,ae as W,aG as De,D as tt,i as Q,t as L,Q as O,E as ze,aa as Me,aH as oo,a8 as ue,aI as io,x as Fe,aJ as ro,F as Se,e as kt,aK as Zt,w as at,b as Jt,z as no,j as so,r as lo,k as co,l as uo,m as ho,n as mo,o as po,s as fo,aL as Ee,_ as vo}from"./TriangleTechniqueConfiguration-BbVmpokX.js";import{t as go,c as Pe,a as ee,i as xo,r as ot,n as qt,b as bo}from"./BooleanBindUniform-Ozbc95Th.js";import{o as J,i as yo,r as Yt,s as wo,m as Mo,e as So}from"./VertexColor.glsl-C9KPtUwW.js";import{a as To,c as Xt,d as it,o as fe,u as Kt,b as q,f as rt,_ as _o,e as Co,n as Qt,O as Io}from"./SceneLighting-C8zPZjrj.js";import{t as Ue,Q as nt}from"./InterleavedLayout-seWAjsA1.js";import{i as $,L as ea,Q as Te,J as Tt}from"./BufferView-BjlVprna.js";import{r as Do}from"./VertexBuffer-DKObKeib.js";import{g as zo}from"./mathUtils-bklKxcut.js";import{O as te,g as ae,_ as Fo}from"./renderState-eKYY9aZU.js";import{n as v,t as i,b as Po,i as p,a as ta}from"./oitResolution.glsl-DnN_jdFk.js";import{s as V}from"./ShaderBuilder-C5cjJO7J.js";import{c as A}from"./NoParameters-DB-WZ6gy.js";function $o(t){t.varyings.add("linearDepth","float",{invariant:!0})}function jo(t,e){$o(t),t.vertex.code.add(i`
    void forwardLinearDepth(float _linearDepth) { ${v(e,"linearDepth = _linearDepth;")} }
  `)}function Oo(t){t.uniforms.add(new R("dpDummy",()=>1)).code.add(i`vec3 dpAdd(vec3 hiA, vec3 loA, vec3 hiB, vec3 loB) {
vec3 hiD = hiA + hiB;
vec3 loD = loA + loB;
return  dpDummy * hiD + loD;
}`)}let Ro=class extends A{constructor(){super(...arguments),this.transformWorldFromViewTH=T(),this.transformWorldFromViewTL=T(),this.transformViewFromCameraRelativeRS=pe()}},Wo=class extends A{constructor(){super(...arguments),this.transformWorldFromModelRS=pe(),this.transformWorldFromModelTH=T(),this.transformWorldFromModelTL=T(),this.transformationDrawId=0}};function $e(t,e){switch(t.fragment.code.add(i`vec3 screenDerivativeNormal(vec3 positionView) {
return normalize(cross(dFdx(positionView), dFdy(positionView)));
}`),e.normalType){case 1:t.attributes.add("normalCompressed","vec2"),t.vertex.code.add(i`vec3 decompressNormal(vec2 normal) {
float z = 1.0 - abs(normal.x) - abs(normal.y);
return vec3(normal + sign(normal) * min(z, 0.0), z);
}
vec3 normalModel() {
return decompressNormal(normalCompressed);
}`);break;case 0:t.attributes.add("normal","vec3"),t.vertex.code.add(i`vec3 normalModel() {
return normal;
}`);break;default:e.normalType;case 2:case 3:}}function aa(t,e){const{vertex:a,varyings:o}=t;switch(e.normalType){case 0:case 1:t.include($e,e),o.add("vNormalWorld","vec3"),o.add("vNormalView","vec3"),a.uniforms.add(new N("transformNormalViewFromGlobal",r=>r.transformNormalViewFromGlobal)),a.code.add(i`void forwardNormal() {
vNormalWorld = normalModel();
vNormalView = transformNormalViewFromGlobal * vNormalWorld;
}`);break;case 2:t.vertex.code.add(i`void forwardNormal() {}`);break;default:e.normalType;case 3:}}let No=class extends Ro{constructor(){super(...arguments),this.transformNormalViewFromGlobal=pe()}},Eo=class extends Wo{constructor(){super(...arguments),this.toMapSpace=Fa()}},Go=class{constructor(e,a,o){this.elementSize=a.stride,this._buffer=new Do(e,Ue(a,1)),this.resize(o)}destroy(){this._buffer.dispose()}get capacity(){return this._capacity}get array(){return this._array}get buffer(){return this._buffer}get usedMemory(){return this._array.byteLength+this._buffer.usedMemory}copyRange(e,a,o,r=0){const n=new Uint8Array(this.array,e*this.elementSize,(a-e)*this.elementSize);new Uint8Array(o.array,r*this.elementSize).set(n)}transferAll(){this._buffer.setData(this._array)}transferRange(e,a){const o=e*this.elementSize,r=a*this.elementSize;this._buffer.setSubData(new Uint8Array(this._array),o,o,r)}resize(e){const a=e*this.elementSize,o=new ArrayBuffer(a);this._array&&(e>=this._capacity?new Uint8Array(o).set(new Uint8Array(this._array)):new Uint8Array(o).set(new Uint8Array(this._array).subarray(0,e*this.elementSize))),this._array=o,this._buffer.setSize(a),this._capacity=e}},_t=class{constructor(e){this.localTransform=e.localTransform,this.globalTransform=e.globalTransform,this.modelOrigin=e.modelOrigin,this.model=e.instanceModel,this.modelNormal=e.instanceModelNormal,this.modelScaleFactors=e.modelScaleFactors,this.boundingSphere=e.boundingSphere,this.featureAttribute=e.getField("instanceFeatureAttribute",ea),this.color=e.getField("instanceColor",Te),this.olidColor=e.getField("instanceOlidColor",Te),this.state=e.getField("state",Tt),this.lodLevel=e.getField("lodLevel",Tt)}},ie=class extends Pa{constructor(e,a){super(e),this.events=new $a,this._capacity=0,this._size=0,this._next=0,this._highlightOptionsMap=new Map,this._highlightOptionsMapPrev=new Map,this._layout=Vo(a),this._capacity=_e,this._buffer=this._layout.createBuffer(this._capacity),this._view=new _t(this._buffer)}get capacity(){return this._capacity}get size(){return this._size}get view(){return this._view}addInstance(){this._size+1>this._capacity&&this._grow();const e=this._findSlot();return this._view.state.set(e,1),this._size++,this.events.emit("instances-changed"),e}removeInstance(e){const a=this._view.state;$(e>=0&&e<this._capacity&&!!(1&a.get(e)),"invalid instance handle"),this._getStateFlag(e,18)?this._setStateFlags(e,32):this.freeInstance(e),this.events.emit("instances-changed")}freeInstance(e){const a=this._view.state;$(e>=0&&e<this._capacity&&!!(1&a.get(e)),"invalid instance handle"),a.set(e,0),this._size--}setLocalTransform(e,a,o=!0){this._view.localTransform.setMat(e,a),o&&this.updateModelTransform(e)}getLocalTransform(e,a){this._view.localTransform.getMat(e,a)}setGlobalTransform(e,a,o=!0){this._view.globalTransform.setMat(e,a),o&&this.updateModelTransform(e)}getGlobalTransform(e,a){this._view.globalTransform.getMat(e,a)}updateModelTransform(e){const a=this._view,o=S,r=F;a.localTransform.getMat(e,Ct),a.globalTransform.getMat(e,Ge);const n=ja(Ge,Ge,Ct);ce(o,n[12],n[13],n[14]),a.modelOrigin.setVec(e,o),Oa(r,n),a.model.setMat(e,r);const l=zo(S,n);l.sort(),a.modelScaleFactors.set(e,0,l[1]),a.modelScaleFactors.set(e,1,l[2]),Ra(r,r),Wa(r,r),a.modelNormal.setMat(e,r),this._setStateFlags(e,64),this.events.emit("instance-transform-changed",{index:e})}getModelTransform(e,a){const o=this._view;o.model.getMat(e,F),o.modelOrigin.getVec(e,S),a[0]=F[0],a[1]=F[1],a[2]=F[2],a[3]=0,a[4]=F[3],a[5]=F[4],a[6]=F[5],a[7]=0,a[8]=F[6],a[9]=F[7],a[10]=F[8],a[11]=0,a[12]=S[0],a[13]=S[1],a[14]=S[2],a[15]=1}applyShaderTransformation(e,a){this.shaderTransformation!=null&&this.shaderTransformation.applyTransform(this,e,a)}getCombinedModelTransform(e,a){return this.getModelTransform(e,a),this.shaderTransformation!=null&&this.shaderTransformation.applyTransform(this,e,a),a}getCombinedLocalTransform(e,a){this._view.localTransform.getMat(e,a),this.shaderTransformation!=null&&this.shaderTransformation.applyTransform(this,e,a)}getCombinedMaxScaleFactor(e){let a=this._view.modelScaleFactors.get(e,1);return this.shaderTransformation!=null&&(this.shaderTransformation.scaleFactor(S,this,e),a*=Math.max(S[0],S[1],S[2])),a}getCombinedMedianScaleFactor(e){let a=this._view.modelScaleFactors.get(e,0);return this.shaderTransformation!=null&&(this.shaderTransformation.scaleFactor(S,this,e),a*=Bo(S[0],S[1],S[2])),a}getModel(e,a){this._view.model.getMat(e,a)}setFeatureAttribute(e,a){var o;(o=this._view.featureAttribute)==null||o.setVec(e,a)}getFeatureAttribute(e,a){var o;(o=this._view.featureAttribute)==null||o.getVec(e,a)}setColor(e,a){var o;(o=this._view.color)==null||o.setVec(e,a)}setObjectAndLayerIdColor(e,a){var o;(o=this._view.olidColor)==null||o.setVec(e,a)}setVisible(e,a){a!==this.getVisible(e)&&(this._setStateFlag(e,4,a),this.events.emit("instance-visibility-changed",{index:e}))}getVisible(e){return this._getStateFlag(e,4)}setHighlight(e,a){const{_highlightOptionsMap:o}=this,r=o.get(e);a?a!==r&&(o.set(e,a),this._setStateFlag(e,8,!0),this.events.emit("instance-highlight-changed")):r&&(o.delete(e),this._setStateFlag(e,8,!1),this.events.emit("instance-highlight-changed"))}get highlightOptionsMap(){return this._highlightOptionsMap}getHighlightStateFlag(e){return this._getStateFlag(e,8)}geHighlightOptionsPrev(e){const a=this._highlightOptionsMapPrev.get(e)??null;return this._highlightOptionsMapPrev.delete(e),a}getHighlightName(e){const a=this.highlightOptionsMap.get(e)??null;return a?this._highlightOptionsMapPrev.set(e,a):this._highlightOptionsMapPrev.delete(e),a}getState(e){return this._view.state.get(e)}getLodLevel(e){return this._view.lodLevel.get(e)}countFlags(e){let a=0;for(let o=0;o<this._capacity;++o)this.getState(o)&e&&++a;return a}_setStateFlags(e,a){const o=this._view.state;a=o.get(e)|a,o.set(e,a)}_clearStateFlags(e,a){const o=this._view.state;a=o.get(e)&~a,o.set(e,a)}_setStateFlag(e,a,o){o?this._setStateFlags(e,a):this._clearStateFlags(e,a)}_getStateFlag(e,a){return!!(this._view.state.get(e)&a)}_grow(){this._capacity=Math.max(_e,Math.floor(this._capacity*Wt)),this._buffer=this._layout.createBuffer(this._capacity).copyFrom(this._buffer),this._view=new _t(this._buffer)}_findSlot(){const e=this._view.state;let a=this._next;for(;1&e.get(a);)a=a+1===this._capacity?0:a+1;return this._next=a+1===this._capacity?0:a+1,a}};function Bo(t,e,a){return Math.max(Math.min(t,e),Math.min(Math.max(t,e),a))}c([G({constructOnly:!0})],ie.prototype,"shaderTransformation",void 0),c([G()],ie.prototype,"_size",void 0),c([G({readOnly:!0})],ie.prototype,"size",null),ie=c([j("esri.views.3d.webgl-engine.lib.lodRendering.InstanceData")],ie);const Lo=nt().mat4f64("localTransform").mat4f64("globalTransform").vec4f64("boundingSphere").vec3f64("modelOrigin").mat3f("instanceModel").mat3f("instanceModelNormal").vec2f("modelScaleFactors");function Vo(t){return oa(Lo.clone(),t).u8("state").u8("lodLevel")}function oa(t,e){return e.instancedFeatureAttribute&&t.vec4f("instanceFeatureAttribute"),e.instancedColor&&t.vec4u8("instanceColor"),Lt()&&t.vec4u8("instanceOlidColor"),t}const S=T(),F=pe(),Ct=Nt(),Ge=Nt(),_e=64;let Ao=class{constructor(e){this.model=e.instanceModel,this.modelNormal=e.instanceModelNormal,this.modelOriginHi=e.instanceModelOriginHi,this.modelOriginLo=e.instanceModelOriginLo,this.featureAttribute=e.getField("instanceFeatureAttribute",ea),this.color=e.getField("instanceColor",Te),this.olidColor=e.getField("instanceOlidColor",Te)}},Gr=class{constructor(e,a){this._rctx=e,this._layout=a,this._headIndex=0,this._tailIndex=0,this._firstIndex=null,this._captureFirstIndex=!0,this._updating=!1,this._prevHeadIndex=0,this._resized=!1,this._capacity=1}destroy(){this._buffer&&this._buffer.destroy()}get buffer(){return this._buffer.buffer}get view(){return this._view}get capacity(){return this._capacity}get size(){const e=this._headIndex,a=this._tailIndex;return e>=a?e-a:e+this._capacity-a}get isEmpty(){return this._headIndex===this._tailIndex}get isFull(){return this._tailIndex===(this._headIndex+1)%this._capacity}get headIndex(){return this._headIndex}get tailIndex(){return this._tailIndex}get firstIndex(){return this._firstIndex}get usedMemory(){var e;return((e=this._buffer)==null?void 0:e.usedMemory)??0}reset(){this._headIndex=0,this._tailIndex=0,this._firstIndex=null}startUpdateCycle(){this._captureFirstIndex=!0}beginUpdate(){$(!this._updating,"already updating"),this._updating=!0,this._prevHeadIndex=this._headIndex}endUpdate(){$(this._updating,"not updating"),this.size<Na*this.capacity&&this._shrink(),this._resized?(this._buffer.transferAll(),this._resized=!1):this._transferRange(this._prevHeadIndex,this._headIndex),this._updating=!1}allocateHead(){$(this._updating,"not updating"),this.isFull&&this._grow();const e=this.headIndex;return this._captureFirstIndex&&(this._firstIndex=e,this._captureFirstIndex=!1),this._incrementHead(),$(this._headIndex!==this._tailIndex,"invalid pointers"),e}freeTail(){$(this._updating,"not updating"),$(this.size>0,"invalid size");const e=this._tailIndex===this._firstIndex;this._incrementTail(),e&&(this._firstIndex=this._tailIndex)}_grow(){const e=Math.max(_e,Math.floor(this._capacity*Wt));this._resize(e)}_shrink(){const e=Math.max(_e,Math.floor(this._capacity*Ea));this._resize(e)}_resize(e){if($(this._updating,"not updating"),e===this._capacity)return;const a=new Go(this._rctx,this._layout,e);if(this._buffer){this._firstIndex&&(this._firstIndex=(this._firstIndex+this._capacity-this._tailIndex)%this._capacity);const o=this.size,r=this._compactInstances(a);$(r===o,"invalid compaction"),this._buffer.destroy(),this._tailIndex=0,this._headIndex=r,this._prevHeadIndex=0}this._resized=!0,this._capacity=e,this._buffer=a,this._view=new Ao(this._layout.createView(this._buffer.array))}_compactInstances(e){const a=this._headIndex,o=this._tailIndex;return o<a?(this._buffer.copyRange(o,a,e),a-o):o>a?(this._buffer.copyRange(o,this._capacity,e),a>0&&this._buffer.copyRange(0,a,e,this._capacity-o),a+(this._capacity-o)):0}_incrementHead(e=1){this._headIndex=(this._headIndex+e)%this._capacity}_incrementTail(e=1){this._tailIndex=(this._tailIndex+e)%this._capacity}_transferRange(e,a){e<a?this._buffer.transferRange(e,a):e>a&&(a>0&&this._buffer.transferRange(0,a),this._buffer.transferRange(e,this._capacity))}};const Ho=nt().vec3f("instanceModelOriginHi").vec3f("instanceModelOriginLo").mat3f("instanceModel").mat3f("instanceModelNormal");function Uo(t){return oa(Ho.clone(),t)}function Lr({normalTexture:t,metallicRoughnessTexture:e,metallicFactor:a,roughnessFactor:o,emissiveTexture:r,emissiveFactor:n,occlusionTexture:l}){return t==null&&e==null&&r==null&&(n==null||Et(n,Qe))&&l==null&&(o==null||o===1)&&(a==null||a===1)}const ko=de(1,1,.5),Vr=de(0,.6,.2),Ar=de(0,1,.2);function ia(t){t.vertex.code.add(i`vec4 offsetBackfacingClipPosition(vec4 posClip, vec3 posWorld, vec3 normalWorld, vec3 camPosWorld) {
vec3 camToVert = posWorld - camPosWorld;
bool isBackface = dot(camToVert, normalWorld) > 0.0;
if (isBackface) {
posClip.z += 0.0000003 * posClip.w;
}
return posClip;
}`)}function ra(t,e){e.instancedColor?(t.attributes.add("instanceColor","vec4"),t.vertex.include(Ie),t.vertex.include(Vt),t.vertex.include(At),t.vertex.code.add(i`
      MaskedColor applyInstanceColor(MaskedColor color) {
        return multiplyMaskedColors( color, createMaskedFromUInt8NaNColor(${"instanceColor"}));
      }
    `)):t.vertex.code.add(i`MaskedColor applyInstanceColor(MaskedColor color) {
return color;
}`)}const It=pe();function na(t,e){const{hasModelTransformation:a,instancedDoublePrecision:o,instanced:r,output:n,hasVertexTangents:l}=e;a&&(t.vertex.uniforms.add(new go("model",d=>d.modelTransformation??wt)),t.vertex.uniforms.add(new N("normalLocalOriginFromModel",d=>(Ga(It,d.modelTransformation??wt),It)))),r&&o&&(t.attributes.add("instanceModelOriginHi","vec3"),t.attributes.add("instanceModelOriginLo","vec3"),t.attributes.add("instanceModel","mat3"),t.attributes.add("instanceModelNormal","mat3"));const s=t.vertex;o&&(s.include(Oo),s.uniforms.add(new we("viewOriginHi",d=>Ka(ce(xe,d.camera.viewInverseTransposeMatrix[3],d.camera.viewInverseTransposeMatrix[7],d.camera.viewInverseTransposeMatrix[11]),xe)),new we("viewOriginLo",d=>Qa(ce(xe,d.camera.viewInverseTransposeMatrix[3],d.camera.viewInverseTransposeMatrix[7],d.camera.viewInverseTransposeMatrix[11]),xe)))),s.code.add(i`
    vec3 getVertexInLocalOriginSpace() {
      return ${a?o?"(model * vec4(instanceModel * localPosition().xyz, 1.0)).xyz":"(model * localPosition()).xyz":o?"instanceModel * localPosition().xyz":"localPosition().xyz"};
    }

    vec3 subtractOrigin(vec3 _pos) {
      ${o?i`
          // Issue: (should be resolved now with invariant position) https://devtopia.esri.com/WebGIS/arcgis-js-api/issues/56280
          vec3 originDelta = dpAdd(viewOriginHi, viewOriginLo, -instanceModelOriginHi, -instanceModelOriginLo);
          return _pos - originDelta;`:"return vpos;"}
    }
    `),s.code.add(i`
    vec3 dpNormal(vec4 _normal) {
      return normalize(${a?o?"normalLocalOriginFromModel * (instanceModelNormal * _normal.xyz)":"normalLocalOriginFromModel * _normal.xyz":o?"instanceModelNormal * _normal.xyz":"_normal.xyz"});
    }
    `),n===4&&(eo(s),s.code.add(i`
    vec3 dpNormalView(vec4 _normal) {
      return normalize((viewNormal * ${a?o?"vec4(normalLocalOriginFromModel * (instanceModelNormal * _normal.xyz), 1.0)":"vec4(normalLocalOriginFromModel * _normal.xyz, 1.0)":o?"vec4(instanceModelNormal * _normal.xyz, 1.0)":"_normal"}).xyz);
    }
    `)),l&&s.code.add(i`
    vec4 dpTransformVertexTangent(vec4 _tangent) {
      ${a?o?"return vec4(normalLocalOriginFromModel * (instanceModelNormal * _tangent.xyz), _tangent.w);":"return vec4(normalLocalOriginFromModel * _tangent.xyz, _tangent.w);":o?"return vec4(instanceModelNormal * _tangent.xyz, _tangent.w);":"return _tangent;"}
    }`)}const xe=T();function sa(t,e){t.varyings.add("colorMixMode","int"),t.varyings.add("opacityMixMode","int"),t.vertex.uniforms.add(new To("symbolColorMixMode",a=>se[a.colorMixMode])),e.hasSymbolColors?(t.vertex.include(Ie),t.vertex.include(Vt),t.vertex.include(At),t.attributes.add("symbolColor","vec4"),t.vertex.code.add(i`
    MaskedColor applySymbolColor(MaskedColor color) {
      return multiplyMaskedColors(color, createMaskedFromUInt8NaNColor(${"symbolColor"}));
    }
  `)):t.vertex.code.add(i`MaskedColor applySymbolColor(MaskedColor color) {
return color;
}`),t.vertex.code.add(i`
    void forwardColorMixMode(bvec4 mask) {
      colorMixMode = mask.r ? ${i.int(se.ignore)} : symbolColorMixMode;
      opacityMixMode = mask.a ? ${i.int(se.ignore)} : symbolColorMixMode;
    }
  `)}function Zo(t,e){switch(e.output){case 5:case 6:case 7:case 8:t.fragment.code.add(i`float _calculateFragDepth(const in float depth) {
const float slope_scale = 2.0;
const float bias = 20.0 * .000015259;
float m = max(abs(dFdx(depth)), abs(dFdy(depth)));
return depth + slope_scale * m + bias;
}
void outputDepth(float _linearDepth){
float fragDepth = _calculateFragDepth(_linearDepth);
gl_FragDepth = fragDepth;
}`);break;case 9:t.fragment.code.add(i`void outputDepth(float _linearDepth){
gl_FragDepth = _linearDepth;
}`)}}function Y(t,e){Jo(t,e,new x("textureAlphaCutoff",a=>a.textureAlphaCutoff))}function Jo(t,e,a){const o=t.fragment;switch(o.code.add("void discardOrAdjustAlpha(inout vec4 color) {"),e.alphaDiscardMode){case 1:o.code.add("color.a = 1.0;");break;case 0:o.include(Ht),o.code.add("if (color.a < alphaCutoff) discard;");break;case 3:o.uniforms.add(a).code.add("if (color.a < textureAlphaCutoff) discard;");break;case 2:o.uniforms.add(a).code.add(`
        if (color.a < textureAlphaCutoff) discard;
        color.a = 1.0;
      `);break;case 4:break;default:e.alphaDiscardMode}o.code.add("}")}function la(t,e){const{vertex:a,fragment:o,varyings:r}=t,{hasColorTexture:n,alphaDiscardMode:l}=e,s=n&&l!==1,{output:d,normalType:u,hasColorTextureTransform:h}=e;switch(d){case 3:U(a,e),t.include(J),o.include(Z,e),t.include(k,e),s&&o.uniforms.add(new w("tex",g=>g.texture)),a.main.add(i`vpos = getVertexInLocalOriginSpace();
vpos = subtractOrigin(vpos);
vpos = addVerticalOffset(vpos, localOrigin);
gl_Position = transformPosition(proj, view, vpos);
forwardTextureCoordinates();`),t.include(Y,e),o.main.add(i`
        discardBySlice(vpos);
        ${v(s,i`vec4 texColor = texture(tex, ${h?"colorUV":"vuv0"});
                discardOrAdjustAlpha(texColor);`)}`);break;case 5:case 6:case 7:case 8:case 11:U(a,e),t.include(J),t.include(k,e),t.include(le,e),t.include(Zo,e),o.include(Z,e),t.include(ao,e),yo(t),r.add("depth","float",{invariant:!0}),s&&o.uniforms.add(new w("tex",g=>g.texture)),a.main.add(i`vpos = getVertexInLocalOriginSpace();
vpos = subtractOrigin(vpos);
vpos = addVerticalOffset(vpos, localOrigin);
gl_Position = transformPositionWithDepth(proj, view, vpos, nearFar, depth);
forwardTextureCoordinates();
forwardObjectAndLayerIdColor();`),t.include(Y,e),o.main.add(i`
        discardBySlice(vpos);
        ${v(s,i`vec4 texColor = texture(tex, ${h?"colorUV":"vuv0"});
               discardOrAdjustAlpha(texColor);`)}
        ${d===11?i`outputObjectAndLayerIdColor();`:i`outputDepth(depth);`}`);break;case 4:{U(a,e),t.include(J),t.include($e,e),t.include(aa,e),t.include(k,e),t.include(le,e),s&&o.uniforms.add(new w("tex",m=>m.texture)),u===2&&r.add("vPositionView","vec3",{invariant:!0});const g=u===0||u===1;a.main.add(i`
        vpos = getVertexInLocalOriginSpace();
        ${g?i`vNormalWorld = dpNormalView(vvLocalNormal(normalModel()));`:i`vPositionView = (view * vec4(vpos, 1.0)).xyz;`}
        vpos = subtractOrigin(vpos);
        vpos = addVerticalOffset(vpos, localOrigin);
        gl_Position = transformPosition(proj, view, vpos);
        forwardTextureCoordinates();`),o.include(Z,e),t.include(Y,e),o.main.add(i`
        discardBySlice(vpos);
        ${v(s,i`vec4 texColor = texture(tex, ${h?"colorUV":"vuv0"});
                discardOrAdjustAlpha(texColor);`)}

        ${u===2?i`vec3 normal = screenDerivativeNormal(vPositionView);`:i`vec3 normal = normalize(vNormalWorld);
                    if (gl_FrontFacing == false){
                      normal = -normal;
                    }`}
        fragColor = vec4(0.5 + 0.5 * normal, 1.0);`);break}case 10:U(a,e),t.include(J),t.include(k,e),t.include(le,e),s&&o.uniforms.add(new w("tex",g=>g.texture)),a.main.add(i`vpos = getVertexInLocalOriginSpace();
vpos = subtractOrigin(vpos);
vpos = addVerticalOffset(vpos, localOrigin);
gl_Position = transformPosition(proj, view, vpos);
forwardTextureCoordinates();`),o.include(Z,e),t.include(Y,e),t.include(to,e),o.main.add(i`
        discardBySlice(vpos);
        ${v(s,i`vec4 texColor = texture(tex, ${h?"colorUV":"vuv0"});
                discardOrAdjustAlpha(texColor);`)}
        calculateOcclusionAndOutputHighlight();`)}}function qo(t,e){return Yo(t,e)}function Yo(t,e){const a=t.fragment,{hasVertexTangents:o,doubleSidedMode:r,hasNormalTexture:n,textureCoordinateType:l,bindType:s,hasNormalTextureTransform:d}=e;o?(t.attributes.add("tangent","vec4"),t.varyings.add("vTangent","vec4"),r===2?a.code.add(i`mat3 computeTangentSpace(vec3 normal) {
float tangentHeadedness = gl_FrontFacing ? vTangent.w : -vTangent.w;
vec3 tangent = normalize(gl_FrontFacing ? vTangent.xyz : -vTangent.xyz);
vec3 bitangent = cross(normal, tangent) * tangentHeadedness;
return mat3(tangent, bitangent, normal);
}`):a.code.add(i`mat3 computeTangentSpace(vec3 normal) {
float tangentHeadedness = vTangent.w;
vec3 tangent = normalize(vTangent.xyz);
vec3 bitangent = cross(normal, tangent) * tangentHeadedness;
return mat3(tangent, bitangent, normal);
}`)):a.code.add(i`mat3 computeTangentSpace(vec3 normal, vec3 pos, vec2 st) {
vec3 Q1 = dFdx(pos);
vec3 Q2 = dFdy(pos);
vec2 stx = dFdx(st);
vec2 sty = dFdy(st);
float det = stx.t * sty.s - sty.t * stx.s;
vec3 T = stx.t * Q2 - sty.t * Q1;
T = T - normal * dot(normal, T);
T *= inversesqrt(max(dot(T,T), 1.e-10));
vec3 B = sign(det) * cross(normal, T);
return mat3(T, B, normal);
}`),n&&l!==0&&(t.include(Ut,e),a.uniforms.add(s===1?new w("normalTexture",u=>u.textureNormal):new W("normalTexture",u=>u.textureNormal)),d&&(a.uniforms.add(s===1?new Xt("scale",u=>u.scale??Mt):new it("scale",u=>u.scale??Mt)),a.uniforms.add(new N("normalTextureTransformMatrix",u=>u.normalTextureTransformMatrix??K))),a.code.add(i`vec3 computeTextureNormal(mat3 tangentSpace, vec2 uv) {
vec3 rawNormal = textureLookup(normalTexture, uv).rgb * 2.0 - 1.0;`),d&&a.code.add(i`mat3 normalRotation = mat3(normalTextureTransformMatrix[0][0]/scale[0], normalTextureTransformMatrix[0][1]/scale[1], 0.0,
normalTextureTransformMatrix[1][0]/scale[0], normalTextureTransformMatrix[1][1]/scale[1], 0.0,
0.0, 0.0, 0.0 );
rawNormal.xy = (normalRotation * vec3(rawNormal.x, rawNormal.y, 1.0)).xy;`),a.code.add(i`return tangentSpace * rawNormal;
}`))}const Xo=3e5,Dt=5e5,zt=16;function ca(){const t=new V,e=t.fragment;return t.include(fe),t.include(Pe),e.include(ee),e.include(De),e.uniforms.add(new R("radius",a=>je(a.camera))).code.add(i`vec3 sphere[16] = vec3[16](
vec3(0.186937, 0.0, 0.0),
vec3(0.700542, 0.0, 0.0),
vec3(-0.864858, -0.481795, -0.111713),
vec3(-0.624773, 0.102853, -0.730153),
vec3(-0.387172, 0.260319, 0.007229),
vec3(-0.222367, -0.642631, -0.707697),
vec3(-0.01336, -0.014956, 0.169662),
vec3(0.122575, 0.1544, -0.456944),
vec3(-0.177141, 0.85997, -0.42346),
vec3(-0.131631, 0.814545, 0.524355),
vec3(-0.779469, 0.007991, 0.624833),
vec3(0.308092, 0.209288,0.35969),
vec3(0.359331, -0.184533, -0.377458),
vec3(0.192633, -0.482999, -0.065284),
vec3(0.233538, 0.293706, -0.055139),
vec3(0.417709, -0.386701, 0.442449)
);
float fallOffFunction(float vv, float vn, float bias) {
float f = max(radius * radius - vv, 0.0);
return f * f * f * max(vn - bias, 0.0);
}`),e.code.add(i`float aoValueFromPositionsAndNormal(vec3 C, vec3 n_C, vec3 Q) {
vec3 v = Q - C;
float vv = dot(v, v);
float vn = dot(normalize(v), n_C);
return fallOffFunction(vv, vn, 0.1);
}`),t.outputs.add("fragOcclusion","float"),e.uniforms.add(new w("normalMap",a=>a.normalTexture),new w("depthMap",a=>a.depthTexture),new x("projScale",a=>a.projScale),new w("rnm",a=>a.noiseTexture),new Xt("rnmScale",(a,o)=>X(Ft,o.camera.fullWidth/a.noiseTexture.descriptor.width,o.camera.fullHeight/a.noiseTexture.descriptor.height)),new x("intensity",a=>a.intensity),new tt("screenSize",a=>X(Ft,a.camera.fullWidth,a.camera.fullHeight))).main.add(i`
    float depth = depthFromTexture(depthMap, uv);

    // Early out if depth is out of range, such as in the sky
    if (depth >= 1.0 || depth <= 0.0) {
      fragOcclusion = 1.0;
      return;
    }

    // get the normal of current fragment
    ivec2 iuv = ivec2(uv * vec2(textureSize(normalMap, 0)));
    vec4 norm4 = texelFetch(normalMap, iuv, 0);
    if(norm4.a != 1.0) {
      fragOcclusion = 1.0;
      return;
    }
    vec3 norm = normalize(norm4.xyz * 2.0 - 1.0);

    float currentPixelDepth = linearizeDepth(depth);
    vec3 currentPixelPos = reconstructPosition(gl_FragCoord.xy, currentPixelDepth);

    float sum = 0.0;
    vec3 tapPixelPos;

    vec3 fres = normalize(2.0 * texture(rnm, uv * rnmScale).xyz - 1.0);

    // note: the factor 2.0 should not be necessary, but makes ssao much nicer.
    // bug or deviation from CE somewhere else?
    float ps = projScale / (2.0 * currentPixelPos.z * zScale.x + zScale.y);

    for(int i = 0; i < ${i.int(zt)}; ++i) {
      vec2 unitOffset = reflect(sphere[i], fres).xy;
      vec2 offset = vec2(-unitOffset * radius * ps);

      // don't use current or very nearby samples
      if( abs(offset.x) < 2.0 || abs(offset.y) < 2.0){
        continue;
      }

      vec2 tc = vec2(gl_FragCoord.xy + offset);
      if (tc.x < 0.0 || tc.y < 0.0 || tc.x > screenSize.x || tc.y > screenSize.y) continue;
      vec2 tcTap = tc / screenSize;
      float occluderFragmentDepth = linearDepthFromTexture(depthMap, tcTap);

      tapPixelPos = reconstructPosition(tc, occluderFragmentDepth);

      sum += aoValueFromPositionsAndNormal(currentPixelPos, norm, tapPixelPos);
    }

    // output the result
    float A = max(1.0 - sum * intensity / float(${i.int(zt)}), 0.0);

    // Anti-tone map to reduce contrast and drag dark region farther: (x^0.2 + 1.2 * x^4) / 2.2
    A = (pow(A, 0.2) + 1.2 * pow(A, 4.0)) * INV_GAMMA;

    fragOcclusion = A;
  `),t}function je(t){return Math.max(10,20*t.computeScreenPixelSizeAtDist(Math.abs(4*t.relativeElevation)))}const Ft=et(),Ko=Object.freeze(Object.defineProperty({__proto__:null,build:ca,getRadius:je},Symbol.toStringTag,{value:"Module"})),Be=4;function da(){const t=new V,e=t.fragment;t.include(fe);const a=(Be+1)/2,o=1/(2*a*a);return e.include(ee),e.uniforms.add(new w("depthMap",r=>r.depthTexture),new W("tex",r=>r.colorTexture),new it("blurSize",r=>r.blurSize),new x("projScale",(r,n)=>{const l=n.camera.distance;return l>5e4?Math.max(0,r.projScale-(l-5e4)):r.projScale})),e.code.add(i`
    void blurFunction(vec2 uv, float r, float center_d, float sharpness, inout float wTotal, inout float bTotal) {
      float c = texture(tex, uv).r;
      float d = linearDepthFromTexture(depthMap, uv);

      float ddiff = d - center_d;

      float w = exp(-r * r * ${i.float(o)} - ddiff * ddiff * sharpness);
      wTotal += w;
      bTotal += w * c;
    }
  `),t.outputs.add("fragBlur","float"),e.main.add(i`
    float b = 0.0;
    float w_total = 0.0;

    float center_d = linearDepthFromTexture(depthMap, uv);

    float sharpness = -0.05 * projScale / center_d;
    for (int r = -${i.int(Be)}; r <= ${i.int(Be)}; ++r) {
      float rf = float(r);
      vec2 uvOffset = uv + rf * blurSize;
      blurFunction(uvOffset, rf, center_d, sharpness, w_total, b);
    }
    fragBlur = b / w_total;`),t}const Qo=Object.freeze(Object.defineProperty({__proto__:null,build:da},Symbol.toStringTag,{value:"Module"}));let ke=class extends Q{constructor(){super(...arguments),this.shader=new L(Qo,()=>B(()=>Promise.resolve().then(()=>ur),void 0))}initializePipeline(){return te({colorWrite:ae})}};ke=c([j("esri.views.3d.webgl-engine.effects.ssao.SSAOBlurTechnique")],ke);const ei="eXKEvZaUc66cjIKElE1jlJ6MjJ6Ufkl+jn2fcXp5jBx7c6KEflSGiXuXeW6OWs+tfqZ2Yot2Y7Zzfo2BhniEj3xoiXuXj4eGZpqEaHKDWjSMe7palFlzc3BziYOGlFVzg6Zzg7CUY5JrjFF7eYJ4jIKEcyyEonSXe7qUfqZ7j3xofqZ2c4R5lFZ5Y0WUbppoe1l2cIh2ezyUho+BcHN2cG6DbpqJhqp2e1GcezhrdldzjFGUcyxjc3aRjDyEc1h7Sl17c6aMjH92pb6Mjpd4dnqBjMOEhqZleIOBYzB7gYx+fnqGjJuEkWlwnCx7fGl+c4hjfGyRe5qMlNOMfnqGhIWHc6OMi4GDc6aMfqZuc6aMzqJzlKZ+lJ6Me3qRfoFue0WUhoR5UraEa6qMkXiPjMOMlJOGe7JrUqKMjK6MeYRzdod+Sl17boiPc6qEeYBlcIh2c1WEe7GDiWCDa0WMjEmMdod+Y0WcdntzhmN8WjyMjKJjiXtzgYxYaGd+a89zlEV7e2GJfnd+lF1rcK5zc4p5cHuBhL6EcXp5eYB7fnh8iX6HjIKEeaxuiYOGc66RfG2Ja5hzjlGMjEmMe9OEgXuPfHyGhPeEdl6JY02McGuMfnqGhFiMa3WJfnx2l4hwcG1uhmN8c0WMc39og1GBbrCEjE2EZY+JcIh2cIuGhIWHe0mEhIVrc09+gY5+eYBlnCyMhGCDl3drfmmMgX15aGd+gYx+fnuRfnhzY1SMsluJfnd+hm98WtNrcIuGh4SEj0qPdkqOjFF7jNNjdnqBgaqUjMt7boeBhnZ4jDR7c5pze4GGjEFrhLqMjHyMc0mUhKZze4WEa117kWlwbpqJjHZ2eX2Bc09zeId+e0V7WlF7jHJ2l72BfId8l3eBgXyBe897jGl7c66cgW+Xc76EjKNbgaSEjGx4fId8jFFjgZB8cG6DhlFziZhrcIh2fH6HgUqBgXiPY8dahGFzjEmMhEFre2dxhoBzc5SGfleGe6alc7aUeYBlhKqUdlp+cH5za4OEczxza0Gcc4J2jHZ5iXuXjH2Jh5yRjH2JcFx+hImBjH+MpddCl3dreZeJjIt8ZW18bm1zjoSEeIOBlF9oh3N7hlqBY4+UeYFwhLJjeYFwaGd+gUqBYxiEYot2fqZ2ondzhL6EYyiEY02Ea0VjgZB8doaGjHxoc66cjEGEiXuXiXWMiZhreHx8frGMe75rY02Ec5pzfnhzlEp4a3VzjM+EhFFza3mUY7Zza1V5e2iMfGyRcziEhDyEkXZ2Y4OBnCx7g5t2eyBjgV6EhEFrcIh2dod+c4Z+nJ5zjm15jEmUeYxijJp7nL6clIpjhoR5WrZraGd+fnuRa6pzlIiMg6ZzfHx5foh+eX1ufnB5eX1ufnB5aJt7UqKMjIh+e3aBfm5lbYSBhGFze6J4c39oc0mUc4Z+e0V7fKFVe0WEdoaGY02Ec4Z+Y02EZYWBfH6HgU1+gY5+hIWUgW+XjJ57ebWRhFVScHuBfJ6PhBx7WqJzlM+Ujpd4gHZziX6HjHmEgZN+lJt5boiPe2GJgX+GjIGJgHZzeaxufnB5hF2JtdN7jJ57hp57hK6ElFVzg6ZzbmiEbndzhIWHe3uJfoFue3qRhJd2j3xoc65zlE1jc3p8lE1jhniEgXJ7e657vZaUc3qBh52BhIF4aHKDa9drgY5+c52GWqZzbpqJe8tjnM+UhIeMfo2BfGl+hG1zSmmMjKJjZVaGgX15c1lze0mEp4OHa3mUhIWHhDyclJ6MeYOJkXiPc0VzhFiMlKaEboSJa5Jze41re3qRhn+HZYWBe0mEc4p5fnORbox5lEp4hGFjhGGEjJuEc1WEhLZjeHeGa7KlfHx2hLaMeX1ugY5+hIWHhKGPjMN7c1WEho1zhoBzZYx7fnhzlJt5exyUhFFziXtzfmmMa6qMYyiEiXxweV12kZSMeWqXSl17fnhzxmmMrVGEe1mcc4p5eHeGjK6MgY5+doaGa6pzlGV7g1qBh4KHkXiPeW6OaKqafqZ2eXZ5e1V7jGd7boSJc3BzhJd2e0mcYot2h1RoY8dahK6EQmWEWjx7e1l2lL6UgXyBdnR4eU9zc0VreX1umqaBhld7fo2Bc6KEc5Z+hDyEcIeBWtNrfHyGe5qMhMuMe5qMhEGEbVVupcNzg3aHhIF4boeBe0mEdlptc39ofFl5Y8uUlJOGiYt2UmGEcyxjjGx4jFF7a657ZYWBnElzhp57iXtrgZN+tfOEhIOBjE2HgU1+e8tjjKNbiWCDhE15gUqBgYN7fnqGc66ce9d7iYSBj0qPcG6DnGGcT3eGa6qMZY+JlIiMl4hwc3aRdnqBlGV7eHJ2hLZjfnuRhDyEeX6MSk17g6Z+c6aUjHmEhIF4gXyBc76EZW18fGl+fkl+jCxrhoVwhDyUhIqGlL2DlI6EhJd2tdN7eYORhEGMa2Faa6pzc3Bzc4R5lIRznM+UY9eMhDycc5Z+c4p5c4iGY117pb6MgXuPrbJafnx2eYOJeXZ5e657hDyEcziElKZjfoB5eHeGj4WRhGGEe6KGeX1utTStc76EhFGJnCyMa5hzfH6HnNeceYB7hmN8gYuMhIVrczSMgYF8h3N7c5pza5hzjJqEYIRdgYuMlL2DeYRzhGGEeX1uhLaEc4iGeZ1zdl6JhrVteX6Me2iMfm5lWqJzSpqEa6pzdnmchHx2c6OMhNdrhoR5g3aHczxzeW52gV6Ejm15frGMc0Vzc4Z+l3drfniJe+9rWq5rlF1rhGGEhoVwe9OEfoh+e7pac09+c3qBY0lrhDycdnp2lJ6MiYOGhGCDc3aRlL2DlJt5doaGdnp2gYF8gWeOjF2Uc4R5c5Z+jEmMe7KEc4mEeYJ4dmyBe0mcgXiPbqJ7eYB7fmGGiYSJjICGlF1reZ2PnElzbpqJfH6Hc39oe4WEc5eJhK6EhqyJc3qBgZB8c09+hEmEaHKDhFGJc5SGiXWMUpaEa89zc6OMnCyMiXtrho+Be5qMc7KEjJ57dmN+hKGPjICGbmiEe7prdod+hGCDdnmchBx7eX6MkXZ2hGGEa657hm98jFFjY5JreYOJgY2EjHZ2a295Y3FajJ6Mc1J+YzB7e4WBjF2Uc4R5eV12gYxzg1qBeId+c9OUc5pzjFFjgY5+hFiMlIaPhoR5lIpjjIKBlNdSe7KEeX2BfrGMhIqGc65zjE2UhK6EklZ+QmWEeziMWqZza3VzdnR4foh+gYF8n3iJiZhrnKp7gYF8eId+lJ6Me1lrcIuGjKJjhmN8c66MjFF7a6prjJ6UnJ5zezyUfruRWlF7nI5zfHyGe657h4SEe8tjhBx7jFFjc09+c39ojICMeZeJeXt+YzRzjHZ2c0WEcIeBeXZ5onSXkVR+gYJ+eYFwdldzgYF7eX2BjJ6UiXuXlE1jh4SEe1mchLJjc4Z+hqZ7eXZ5bm1zlL6Ue5p7iWeGhKqUY5pzjKJjcIeBe8t7gXyBYIRdlEp4a3mGnK6EfmmMZpqEfFl5gYxzjKZuhGFjhoKGhHx2fnx2eXuMe3aBiWeGvbKMe6KGa5hzYzB7gZOBlGV7hmN8hqZlYot2Y117a6pzc6KEfId8foB5rctrfneJfJ6PcHN2hFiMc5pzjH92c0VzgY2EcElzdmCBlFVzg1GBc65zY4OBboeBcHiBeYJ4ewxzfHx5lIRzlEmEnLKEbk1zfJ6PhmN8eYBljBiEnMOEiXxwezyUcIeBe76EdsKEeX2BdnR4jGWUrXWMjGd7fkl+j4WRlEGMa5Jzho+BhDyEfnqMeXt+g3aHlE1jczClhNN7ZW18eHx8hGFjZW18iXWMjKJjhH57gYuMcIuGWjyMe4ZtjJuExmmMj4WRdntzi4GDhFFzYIRdnGGcjJp7Y0F7e4WEkbCGiX57fnSHa657a6prhBCMe3Z+SmmMjH92eHJ2hK6EY1FzexhrvbKMnI5za4OEfnd+eXuMhImBe897hLaMjN+EfG+BeIOBhF1+eZeJi4GDkXZ2eXKEgZ6Ejpd4c2GHa1V5e5KUfqZuhCx7jKp7lLZrg11+hHx2hFWUoot2nI5zgbh5mo9zvZaUe3qRbqKMfqZ2kbCGhFiM";let ti=class extends A{constructor(){super(...arguments),this.projScale=1}},ai=class extends ti{constructor(){super(...arguments),this.intensity=1}},oi=class extends A{},ii=class extends oi{constructor(){super(...arguments),this.blurSize=et()}},Ze=class extends Q{constructor(){super(...arguments),this.shader=new L(Ko,()=>B(()=>Promise.resolve().then(()=>hr),void 0))}initializePipeline(){return te({colorWrite:ae})}};Ze=c([j("esri.views.3d.webgl-engine.effects.ssao.SSAOTechnique")],Ze);const re=2;let be=class extends Kt{constructor(e){super(e),this.consumes={required:["normals"]},this.produces=q.AMBIENT_ILLUMINATION,this._enableTime=ge(0),this._passParameters=new ai,this._drawParameters=new ii}initialize(){const e=Uint8Array.from(atob(ei),o=>o.charCodeAt(0)),a=new Ba(32);a.wrapMode=33071,a.pixelFormat=6407,a.wrapMode=10497,a.hasMipmap=!0,this._passParameters.noiseTexture=new La(this.renderingContext,a,e),this.addHandles(Gt(()=>this.view.stage.renderer.hasAmbientIllumination,()=>this._enableTime=ge(0)))}destroy(){this._passParameters.noiseTexture=Va(this._passParameters.noiseTexture)}render(e){const a=e.find(({name:oe})=>oe==="normals"),o=a==null?void 0:a.getTexture(),r=a==null?void 0:a.getTexture(Bt);if(!o||!r)return;const n=this.techniques.getCompiled(Ze),l=this.techniques.getCompiled(ke);if(!n||!l)return this._enableTime=ge(performance.now()),void this.requestRender(1);this._enableTime===0&&(this._enableTime=ge(performance.now()));const s=this.renderingContext,d=this.view.qualitySettings.fadeDuration,u=this.bindParameters,h=u.camera,g=h.relativeElevation,m=Aa((Dt-g)/(Dt-Xo),0,1),_=d>0?Math.min(d,performance.now()-this._enableTime)/d:1,b=_*m;this._passParameters.normalTexture=o,this._passParameters.depthTexture=r,this._passParameters.projScale=1/h.computeScreenPixelSizeAtDist(1),this._passParameters.intensity=4*ri/je(h)**6*b;const C=h.fullViewport[2],I=h.fullViewport[3],P=this.fboCache.acquire(C,I,"ssao input",2);s.bindFramebuffer(P.fbo),s.setViewport(0,0,C,I),s.bindTechnique(n,u,this._passParameters,this._drawParameters),s.screen.draw();const D=Math.round(C/re),z=Math.round(I/re),M=this.fboCache.acquire(D,z,"ssao blur",0);s.bindFramebuffer(M.fbo),this._drawParameters.colorTexture=P.getTexture(),X(this._drawParameters.blurSize,0,re/I),s.bindTechnique(l,u,this._passParameters,this._drawParameters),s.setViewport(0,0,D,z),s.screen.draw(),P.release();const y=this.fboCache.acquire(D,z,q.AMBIENT_ILLUMINATION,0);return s.bindFramebuffer(y.fbo),s.setViewport(0,0,C,I),s.setClearColor(1,1,1,0),s.clear(16384),this._drawParameters.colorTexture=M.getTexture(),X(this._drawParameters.blurSize,re/C,0),s.bindTechnique(l,u,this._passParameters,this._drawParameters),s.setViewport(0,0,D,z),s.screen.draw(),s.setViewport4fv(h.fullViewport),M.release(),_<1&&this.requestRender(2),y}};c([G()],be.prototype,"consumes",void 0),c([G()],be.prototype,"produces",void 0),be=c([j("esri.views.3d.webgl-engine.effects.ssao.SSAO")],be);const ri=.5;function st(t,e){e.receiveAmbientOcclusion?(t.uniforms.add(new O("ssaoTex",a=>{var o;return(o=a.ssao)==null?void 0:o.getTexture()})),t.constants.add("blurSizePixelsInverse","float",1/re),t.code.add(i`float evaluateAmbientOcclusionInverse() {
vec2 ssaoTextureSizeInverse = 1.0 / vec2(textureSize(ssaoTex, 0));
return texture(ssaoTex, gl_FragCoord.xy * blurSizePixelsInverse * ssaoTextureSizeInverse).r;
}
float evaluateAmbientOcclusion() {
return 1.0 - evaluateAmbientOcclusionInverse();
}`)):t.code.add(i`float evaluateAmbientOcclusionInverse() { return 1.0; }
float evaluateAmbientOcclusion() { return 0.0; }`)}let Le=class extends ze{constructor(e,a,o,r){super(e,"float",0,(n,l)=>n.setUniform1fv(e,o(l),r),a)}};function ni(t,e){t.uniforms.add(new Le("shR",9,({lighting:a})=>a.sh.r),new Le("shG",9,({lighting:a})=>a.sh.g),new Le("shB",9,({lighting:a})=>a.sh.b)),t.code.add(i`vec3 calculateAmbientIrradiance(vec3 normal) {
vec3 ambientLight = 0.282095 * vec3(shR[0], shG[0], shB[0]);
vec4 sh1 = vec4(
0.488603 * normal.x,
0.488603 * normal.z,
0.488603 * normal.y,
1.092548 * normal.x * normal.y
);
vec4 sh2 = vec4(
1.092548 * normal.y * normal.z,
0.315392 * (3.0 * normal.z * normal.z - 1.0),
1.092548 * normal.x * normal.z,
0.546274 * (normal.x * normal.x - normal.y * normal.y)
);
vec4 lightingAmbientSH_R1 = vec4(shR[1], shR[2], shR[3], shR[4]);
vec4 lightingAmbientSH_G1 = vec4(shG[1], shG[2], shG[3], shG[4]);
vec4 lightingAmbientSH_B1 = vec4(shB[1], shB[2], shB[3], shB[4]);
ambientLight += vec3(
dot(lightingAmbientSH_R1, sh1),
dot(lightingAmbientSH_G1, sh1),
dot(lightingAmbientSH_B1, sh1)
);
vec4 lightingAmbientSH_R2 = vec4(shR[5], shR[6], shR[7], shR[8]);
vec4 lightingAmbientSH_G2 = vec4(shG[5], shG[6], shG[7], shG[8]);
vec4 lightingAmbientSH_B2 = vec4(shB[5], shB[6], shB[7], shB[8]);
ambientLight += vec3(
dot(lightingAmbientSH_R2, sh2),
dot(lightingAmbientSH_G2, sh2),
dot(lightingAmbientSH_B2, sh2)
);
return ambientLight;
}`),e.pbrMode!==1&&e.pbrMode!==2||t.code.add(i`const vec3 skyTransmittance = vec3(0.9, 0.9, 1.0);
vec3 calculateAmbientRadiance()
{
vec3 ambientLight = 1.2 * (0.282095 * vec3(shR[0], shG[0], shB[0])) - 0.2;
return ambientLight *= skyTransmittance;
}`)}function he(t){t.uniforms.add(new we("mainLightDirection",e=>e.lighting.mainLight.direction))}function me(t){t.uniforms.add(new we("mainLightIntensity",e=>e.lighting.mainLight.intensity))}function si(t){he(t),me(t),t.code.add(i`vec3 applyShading(vec3 shadingNormal, float shadow) {
float dotVal = clamp(dot(shadingNormal, mainLightDirection), 0.0, 1.0);
return mainLightIntensity * ((1.0 - shadow) * dotVal);
}`)}function li(t){t.code.add(i`vec3 evaluateDiffuseIlluminationHemisphere(vec3 ambientGround, vec3 ambientSky, float NdotNG) {
return ((1.0 - NdotNG) * ambientGround + (1.0 + NdotNG) * ambientSky) * 0.5;
}`),t.code.add(i`float integratedRadiance(float cosTheta2, float roughness) {
return (cosTheta2 - 1.0) / (cosTheta2 * (1.0 - roughness * roughness) - 1.0);
}`),t.code.add(i`vec3 evaluateSpecularIlluminationHemisphere(vec3 ambientGround, vec3 ambientSky, float RdotNG, float roughness) {
float cosTheta2 = 1.0 - RdotNG * RdotNG;
float intRadTheta = integratedRadiance(cosTheta2, roughness);
float ground = RdotNG < 0.0 ? 1.0 - intRadTheta : 1.0 + intRadTheta;
float sky = 2.0 - ground;
return (ground * ambientGround + sky * ambientSky) * 0.5;
}`)}function lt(t,e){t.include(De),t.include(rt),e.pbrMode!==1&&e.pbrMode!==2&&e.pbrMode!==5&&e.pbrMode!==6||(t.code.add(i`float normalDistribution(float NdotH, float roughness)
{
float a = NdotH * roughness;
float b = roughness / (1.0 - NdotH * NdotH + a * a);
return b * b * INV_PI;
}`),t.code.add(i`const vec4 c0 = vec4(-1.0, -0.0275, -0.572,  0.022);
const vec4 c1 = vec4( 1.0,  0.0425,  1.040, -0.040);
const vec2 c2 = vec2(-1.04, 1.04);
vec2 prefilteredDFGAnalytical(float roughness, float NdotV) {
vec4 r = roughness * c0 + c1;
float a004 = min(r.x * r.x, exp2(-9.28 * NdotV)) * r.x + r.y;
return c2 * a004 + r.zw;
}`),t.code.add(i`struct PBRShadingInfo
{
float NdotV;
float NdotL;
float LdotH;
float NdotUP;
float RdotUP;
float NdotAmbDir;
float NdotH_Horizon;
float NdotH;
vec3 skyRadianceToSurface;
vec3 groundRadianceToSurface;
vec3 skyIrradianceToSurface;
vec3 groundIrradianceToSurface;
vec3 reflectedView;
float averageAmbientRadiance;
vec3 albedoLinear;
vec3 f0;
vec3 f90;
vec3 diffuseColor;
float metalness;
float roughness;
};`),t.code.add(i`void calculateCommonInputs(out PBRShadingInfo inputs, vec3 normal, vec3 viewDirection, vec3 upDirection, vec3 albedo) {
vec3 h = normalize(mainLightDirection - viewDirection);
inputs.NdotV = clamp(abs(dot(normal, -viewDirection)), 0.001, 1.0);
inputs.NdotUP = clamp(dot(normal, upDirection), -1.0, 1.0);
inputs.reflectedView = normalize(reflect(-viewDirection, normal));
inputs.RdotUP = clamp(dot(inputs.reflectedView, upDirection), -1.0, 1.0);
inputs.albedoLinear = linearizeGamma(albedo);
inputs.NdotH = clamp(dot(normal, h), 0.0, 1.0);
inputs.NdotL = clamp(dot(normal, mainLightDirection), 0.001, 1.0);
}`)),e.pbrMode!==1&&e.pbrMode!==2||(t.include(li),t.code.add(i`vec3 evaluateEnvironmentIllumination(PBRShadingInfo inputs) {
vec3 indirectDiffuse = evaluateDiffuseIlluminationHemisphere(inputs.groundIrradianceToSurface, inputs.skyIrradianceToSurface, inputs.NdotUP);
vec3 indirectSpecular = evaluateSpecularIlluminationHemisphere(inputs.groundRadianceToSurface, inputs.skyRadianceToSurface, inputs.RdotUP, inputs.roughness);
vec3 diffuseComponent = inputs.diffuseColor * indirectDiffuse * INV_PI;
vec2 dfg = prefilteredDFGAnalytical(inputs.roughness, inputs.NdotV);
vec3 specularColor = inputs.f0 * dfg.x + inputs.f90 * dfg.y;
vec3 specularComponent = specularColor * indirectSpecular;
return (diffuseComponent + specularComponent);
}`),t.code.add(i`void calculatePBRInputs(out PBRShadingInfo inputs, vec3 normal, vec3 viewDirection, vec3 upDirection, vec3 albedo, vec3 mrr) {
calculateCommonInputs(inputs, normal, viewDirection, upDirection, albedo);
inputs.metalness = mrr[0];
inputs.roughness = clamp(mrr[1] * mrr[1], 0.001, 0.99);
inputs.f0 = (0.16 * mrr[2] * mrr[2]) * (1.0 - inputs.metalness) + inputs.albedoLinear * inputs.metalness;
inputs.f90 = vec3(clamp(dot(inputs.f0, vec3(50.0 * 0.33)), 0.0, 1.0));
inputs.diffuseColor = inputs.albedoLinear * (vec3(1.0) - inputs.f0) * (1.0 - inputs.metalness);
}`)),e.pbrMode!==5&&e.pbrMode!==6||t.code.add(i`const vec3 fresnelReflectionSimplified = vec3(0.04);
void calculateSimplifiedInputs(out PBRShadingInfo inputs, vec3 normal, vec3 viewDirection, vec3 upDirection, vec3 albedo) {
calculateCommonInputs(inputs, normal, viewDirection, upDirection, albedo);
float lightness = 0.3 * inputs.albedoLinear[0] + 0.5 * inputs.albedoLinear[1] + 0.2 * inputs.albedoLinear[2];
inputs.f0 = (0.85 * lightness + 0.15) * fresnelReflectionSimplified;
inputs.f90 =  vec3(clamp(dot(inputs.f0, vec3(50.0 * 0.33)), 0.0, 1.0));
}`)}function Kr(t,e){t.include(rt),t.code.add(i`
    struct PBRShadingWater {
      float NdotL;   // cos angle between normal and light direction
      float NdotV;   // cos angle between normal and view direction
      float NdotH;   // cos angle between normal and half vector
      float VdotH;   // cos angle between view direction and half vector
      float LdotH;   // cos angle between light direction and half vector
      float VdotN;   // cos angle between view direction and normal vector
    };

    float dtrExponent = ${e.useCustomDTRExponentForWater?"2.2":"2.0"};
  `),t.code.add(i`vec3 fresnelReflection(float angle, vec3 f0, float f90) {
return f0 + (f90 - f0) * pow(1.0 - angle, 5.0);
}`),t.code.add(i`float normalDistributionWater(float NdotH, float roughness) {
float r2 = roughness * roughness;
float NdotH2 = NdotH * NdotH;
float denom = pow((NdotH2 * (r2 - 1.0) + 1.0), dtrExponent) * PI;
return r2 / denom;
}`),t.code.add(i`float geometricOcclusionKelemen(float LoH) {
return 0.25 / (LoH * LoH);
}`),t.code.add(i`vec3 brdfSpecularWater(in PBRShadingWater props, float roughness, vec3 F0, float F0Max) {
vec3  F = fresnelReflection(props.VdotH, F0, F0Max);
float dSun = normalDistributionWater(props.NdotH, roughness);
float V = geometricOcclusionKelemen(props.LdotH);
float diffusionSunHaze = mix(roughness + 0.045, roughness + 0.385, 1.0 - props.VdotH);
float strengthSunHaze  = 1.2;
float dSunHaze = normalDistributionWater(props.NdotH, diffusionSunHaze) * strengthSunHaze;
return ((dSun + dSunHaze) * V) * F;
}`)}function ci(t){t.include(ee),t.uniforms.add(new tt("zProjectionMapLastFrame",e=>xo(e.reprojection.lastFrameCamera))),t.code.add(i`float linearDepthFromTextureLastFrame(sampler2D depthTexture, vec2 uv) {
return linearizeDepth(depthFromTexture(depthTexture, uv), zProjectionMapLastFrame);
}`)}function di(t,e){const a=t.fragment;a.include(ee),a.uniforms.add(new tt("nearFar",o=>o.camera.nearFar),new O("depthMap",o=>{var r;return(r=o.depth)==null?void 0:r.attachment}),new Me("proj",o=>o.camera.projectionMatrix),new R("invResolutionHeight",o=>1/o.camera.height),new Me("reprojectionMatrix",o=>o.reprojection.matrix)).code.add(i`
  vec2 reprojectionCoordinate(vec3 projectionCoordinate) {
    vec4 clipDepthCoordinate = proj * vec4(0.0, 0.0, -projectionCoordinate.z, 1.0);
    vec4 reprojectedCoordinate = reprojectionMatrix * vec4(
      clipDepthCoordinate.w * (projectionCoordinate.xy * 2.0 - 1.0),
      clipDepthCoordinate.z,
      clipDepthCoordinate.w
    );
    reprojectedCoordinate.xy /= reprojectedCoordinate.w;
    return reprojectedCoordinate.xy * 0.5 + 0.5;
  }

  vec4 applyProjectionMat(mat4 projectionMat, vec3 viewPosition) {
    vec4 projectedCoordinate =  projectionMat * vec4(viewPosition, 1.0);
    projectedCoordinate.xy /= projectedCoordinate.w;
    projectedCoordinate.xy = projectedCoordinate.xy*0.5 + 0.5;
    return projectedCoordinate;
  }

  float rayMarchScreenReachFromWorldReach(vec3 startPosition, vec3 rayDirection, float rayMarchWorldReach) {
    float rayDistanceWorld = max(0.0, rayMarchWorldReach);

    // Stop rays towards camera at near plane
    if (rayDirection.z > 0.0) {
      float distanceToNearPlane = (-nearFar[0] - startPosition.z) / rayDirection.z;
      rayDistanceWorld = min(rayDistanceWorld, max(0.0, distanceToNearPlane));
    }

    vec2 projectedCoordStart = applyProjectionMat(proj, startPosition).xy;
    vec2 projectedCoordEnd = applyProjectionMat(proj, startPosition + rayDirection * rayDistanceWorld).xy;
    vec2 projectedCoordOffset = projectedCoordEnd - projectedCoordStart;

    return ${e.useProjectedRayLength?"length(projectedCoordOffset)":"abs(projectedCoordOffset.y)"};
  }

  vec3 screenSpaceIntersectionWithLimits(
    vec3 rayDirection,
    vec3 startPosition,
    vec3 viewDirection,
    vec3 normal,
    float rayStepOffset,
    float rayMarchMaxReach,
    float rayMarchMaxSteps
  ) {
    vec3 viewPosition = startPosition;

    // Project the start position to the screen
    vec4 projectedCoordStart = applyProjectionMat(proj, viewPosition);
    vec3 homogeneousStart = viewPosition / projectedCoordStart.w;
    float inverseWStart = 1.0 / projectedCoordStart.w;

    // Advance the position in the ray direction
    viewPosition += rayDirection;

    vec4 projectedCoordVanishingPoint = applyProjectionMat(proj, rayDirection);

    // Project the advanced position to the screen
    vec4 projectedCoordEnd = applyProjectionMat(proj, viewPosition);
    vec3  homogeneousEnd = viewPosition / projectedCoordEnd.w;
    float inverseWEnd = 1.0 / projectedCoordEnd.w;

    // Calculate the ray direction in screen space
    vec2 projectedCoordDirection = (projectedCoordEnd.xy - projectedCoordStart.xy);
    vec2 vanishingPointScreenOffset = (projectedCoordVanishingPoint.xy - projectedCoordStart.xy);

    float rayMarchDistance = ${e.useProjectedRayLength?"length(vanishingPointScreenOffset.xy)":"abs(vanishingPointScreenOffset.y)"};
    float clampedRayMarchDistance = min(rayMarchDistance, rayMarchMaxReach);

    float projectedCoordDirectionLength = length(projectedCoordDirection);

    // normalize the projection direction depending on maximum steps
    // this determines how blocky the ray march looks
    vec2 projectedStep = clampedRayMarchDistance * projectedCoordDirection / (rayMarchMaxSteps * projectedCoordDirectionLength);

    // Normalize the homogeneous camera space coordinates
    vec3 homogeneousStep = clampedRayMarchDistance * (homogeneousEnd - homogeneousStart) / (rayMarchMaxSteps * projectedCoordDirectionLength);
    float inverseWStep = clampedRayMarchDistance * (inverseWEnd - inverseWStart) / (rayMarchMaxSteps * projectedCoordDirectionLength);

    // initialize the variables for ray marching
    vec2 projectedPosition = projectedCoordStart.xy;
    vec3 homogeneousPosition = homogeneousStart;
    float inverseW = inverseWStart;
    float rayStartZ = -startPosition.z; // estimated ray start depth value
    float rayEndZ = -startPosition.z;   // estimated ray end depth value
    float previousEstimatedZ = -startPosition.z;
    float rayDepthDelta = 0.0;
    float estimatedDepthDifference;
    float sampledDepth;

    if (dot(normal, rayDirection) < 0.0 || dot(-viewDirection, normal) < 0.0) {
      return vec3(projectedPosition, 0.0);
    }

    float previousEstimatedDepthDifference = 0.0;

    projectedPosition = clamp(
      projectedPosition + rayStepOffset * projectedStep,
      vec2(0.0),
      vec2(0.999)
    );
    homogeneousPosition.z += rayStepOffset * homogeneousStep.z;
    inverseW += rayStepOffset * inverseWStep;

    int rayMarchMaxStepsInt = int(rayMarchMaxSteps);
    for(int stepIndex = 0; stepIndex < rayMarchMaxStepsInt - 1; ++stepIndex) {
      sampledDepth = -linearDepthFromTexture(depthMap, projectedPosition); // get linear depth from the depth buffer

      // Estimate depth of the marching ray
      rayStartZ = previousEstimatedZ;
      estimatedDepthDifference = -rayStartZ - sampledDepth;
      rayEndZ = (homogeneousStep.z * 0.5 + homogeneousPosition.z) / (inverseWStep * 0.5 + inverseW);
      rayDepthDelta = rayEndZ - rayStartZ;
      previousEstimatedZ = rayEndZ;

      if(-rayEndZ > nearFar[1] || -rayEndZ < nearFar[0] || projectedPosition.y < 0.0  || projectedPosition.y > 1.0 ) {
        return vec3(projectedPosition, 0.);
      }

      // If we detect a hit - return the intersection point, two conditions:
      //  - estimatedDepthDifference > 0.0 - sampled point depth is in front of estimated depth
      //  - if difference between estimatedDepthDifference and rayDepthDelta is not too large
      //  - if difference between estimatedDepthDifference and 0.025/abs(inverseW) is not too large
      //  - if the sampled depth is not behind far plane or in front of near plane

      if(estimatedDepthDifference < 0.025 / abs(inverseW) + abs(rayDepthDelta) &&
        estimatedDepthDifference > 0.0 &&
        sampledDepth > nearFar[0] &&
        sampledDepth < nearFar[1] &&
        abs(projectedPosition.y - projectedCoordStart.y) > invResolutionHeight) {
        float hitInterpolationWeight = estimatedDepthDifference / (estimatedDepthDifference - previousEstimatedDepthDifference);
        vec2 refinedProjectedPosition = mix(projectedPosition - projectedStep, projectedPosition, 1.0 - hitInterpolationWeight);
        if (abs(refinedProjectedPosition.y - projectedCoordStart.y) > invResolutionHeight) {
          return vec3(refinedProjectedPosition, sampledDepth);
        }
        else {
          return vec3(projectedPosition, sampledDepth);
        }
      }

      ${v(!e.clampRayToScreen,`if (projectedPosition.x <= 0.0  || projectedPosition.x >= 1.0) {
        return vec3(projectedPosition, 0.0);
      }`)}

      // Continue with ray marching
      projectedPosition = projectedPosition + projectedStep;
      homogeneousPosition.z += homogeneousStep.z;
      inverseW += inverseWStep;
      previousEstimatedDepthDifference = estimatedDepthDifference;

      ${v(e.clampRayToScreen,"projectedPosition = clamp(projectedPosition, vec2(0.0), vec2(0.999));")}
    }
    return vec3(projectedPosition, 0.0);
  }

  vec3 screenSpaceIntersection(vec3 rayDirection, vec3 startPosition, vec3 viewDirection, vec3 normal, float rayStepOffset) {
    return screenSpaceIntersectionWithLimits(
      rayDirection,
      startPosition,
      viewDirection,
      normal,
      rayStepOffset,
      ${i.float(e.rayMarchMaxReach)},
      ${i.float(e.rayMarchMaxSteps)}
    );
  }
  `)}const Pt=255;function ct(t){t.code.add(i`
    vec3 quantizeGlobalIlluminationColor(vec3 color) {
      vec3 clampedColor = clamp(color, vec3(0.0), vec3(1.0));
      return floor(clampedColor * ${i.float(Pt)} + 0.5) * ${i.float(1/Pt)};
    }
  `)}const ui=.01,$t=.008,hi=.002,mi=.5,pi=.02,fi=.1,jt=.008,vi=.012,gi=.008,xi=40,bi=.095,yi=.008,wi=60,Mi=2,Si=.0039,Ti=.25,dt=.15,ut=25,ht=.15,Oe=.5,mt=1,pt=1,Re=16;class ft extends A{constructor(){super(...arguments),this.projScale=1,this.scaleGlobalIllumination=1,this.accumulatedFrames=0,this.temporalSampleFrame=0,this.rayMarchMinReach=ht,this.rayMarchMaxReach=Oe,this.rayMarchWorldReach=ut,this.rayMarchMinReachEmissionWeight=mt,this.rayMarchMaxReachEmissionWeight=pt,this.rayMarchMaxSteps=Re,this.colorBleedWeight=dt}}function ua(t){const e=new V,a=e.fragment;return e.include(fe),e.include(Pe),he(a),a.include(ci),a.include(De),a.include(ct),e.include(di,t),a.uniforms.add(new w("normalMap",o=>o.normalTexture),new w("depthMap",o=>o.depthTexture),new O("lastFrameColorTexture",o=>{var r;return(r=o.reprojection.lastFrameColor)==null?void 0:r.getTexture()}),new O("lastFrameDepthTexture",o=>{var r;return(r=o.reprojection.lastFrameDepth)==null?void 0:r.attachment}),new O("lastFrameGlobalIlluminationTexture",o=>{var r;return(r=o.globalIllumination)==null?void 0:r.getTexture()}),new O("lastFrameGlobalIlluminationWeightTexture",o=>{var r;return(r=o.globalIllumination)==null?void 0:r.getTexture(E)}),new Me("reprojectionViewMatrix",o=>o.reprojection.viewMatrix),new Me("view",o=>o.camera.viewMatrix),new x("accumulatedFrames",o=>o.accumulatedFrames),new x("temporalSampleFrame",o=>o.temporalSampleFrame),new x("scaleGlobalIllumination",o=>o.scaleGlobalIllumination)),a.uniforms.add(new x("rayMarchMinReach",o=>o.rayMarchMinReach),new x("rayMarchMaxReach",o=>o.rayMarchMaxReach),new x("rayMarchWorldReach",o=>o.rayMarchWorldReach),new x("rayMarchMinReachEmissionWeight",o=>o.rayMarchMinReachEmissionWeight),new x("rayMarchMaxReachEmissionWeight",o=>o.rayMarchMaxReachEmissionWeight),new x("rayMarchMaxSteps",o=>o.rayMarchMaxSteps),new x("colorBleedWeight",o=>o.colorBleedWeight)),t.hasEmission&&a.uniforms.add(new O("lastFrameEmissionTexture",o=>{var r;return(r=o.reprojection.lastFrameEmission)==null?void 0:r.attachment})),a.code.add(i`
    float computeIdleColorBlendWeight(float accumulatedFrames) {
      float idleColorBlendProgress = clamp(
        accumulatedFrames / ${i.float(xi)},
        0.0,
        1.0
      );
      return mix(
        ${i.float(vi)},
        ${i.float(gi)},
        idleColorBlendProgress
      );
    }

    float computeIdleOcclusionBlendWeight(float accumulatedFrames) {
      float idleOcclusionBlendProgress = clamp(
        accumulatedFrames / ${i.float(wi)},
        0.0,
        1.0
      );
      return mix(
        ${i.float(bi)},
        ${i.float(yi)},
        pow(idleOcclusionBlendProgress, ${i.float(Mi)})
      );
    }

    bool isEdgeDepth(float centerDepth, vec2 sampleUv) {
      vec2 texelSize = 1.0 / vec2(textureSize(depthMap, 0));
      float depthLeft = linearizeDepth(depthFromTexture(depthMap, sampleUv + vec2(-texelSize.x, 0.0)));
      float depthRight = linearizeDepth(depthFromTexture(depthMap, sampleUv + vec2(texelSize.x, 0.0)));
      float depthUp = linearizeDepth(depthFromTexture(depthMap, sampleUv + vec2(0.0, texelSize.y)));
      float depthDown = linearizeDepth(depthFromTexture(depthMap, sampleUv + vec2(0.0, -texelSize.y)));

      float maxDifference = max(max(abs(centerDepth - depthLeft), abs(centerDepth - depthRight)), max(abs(centerDepth - depthUp), abs(centerDepth - depthDown)));

      return abs(maxDifference / centerDepth) > 0.01;
    }

    vec3 sampleCosineHemisphere(vec2 u) {
      float phi = 6.28318530718 * u.x;
      float radius = sqrt(u.y);
      float x = radius * cos(phi);
      float y = radius * sin(phi);
      float z = sqrt(max(0.0, 1.0 - u.y));

      return vec3(x, y, z);
    }

    mat3 basisFromNormal(vec3 n) {
      vec3 up = abs(n.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
      vec3 tangent = normalize(cross(up, n));
      vec3 bitangent = cross(n, tangent);

      return mat3(tangent, bitangent, n);
    }

    float blueNoiseDitherValue(vec2 pixel, float frame, vec2 axis, float phase) {
      float scroll = 5.588238 * mod(frame, 512.0);
      vec2 p = pixel + vec2(scroll);
      vec2 rotated = vec2(
        axis.x * p.x + axis.y * p.y,
        -axis.y * p.x + axis.x * p.y
      );

      return fract(52.9829189 * fract(0.06711056 * rotated.x + 0.00583715 * rotated.y + phase));
    }

    vec4 blueNoiseDither(vec2 pixel, float frame) {
      vec4 value = vec4(
        blueNoiseDitherValue(pixel, frame, vec2(0.9659258, 0.25881904), 0.0),
        blueNoiseDitherValue(pixel, frame, vec2(0.70710677, 0.70710677), 0.17),
        blueNoiseDitherValue(pixel, frame, vec2(0.25881904, 0.9659258), 0.37),
        blueNoiseDitherValue(pixel, frame, vec2(1.0, 0.0), 0.61)
      );

      return value * 2.0 - 1.0;
    }
  `),e.outputs.add("fragGlobalIllumination","vec4",0),e.outputs.add("fragWeight","float",1),a.main.add(i`
    float depth = depthFromTexture(depthMap, uv);

    // Early out if depth is out of range, such as in the sky
    if (depth >= 1.0 || depth <= 0.0) {
      fragGlobalIllumination = vec4(0.0, 0.0, 0.0, 1.0);
      fragWeight = 0.0;
      return;
    }

    // Get the normal of current fragment
    ivec2 iuv = ivec2(uv * vec2(textureSize(normalMap, 0)));
    vec4 normal4 = texelFetch(normalMap, iuv, 0);
    if (normal4.a != 1.0) {
      fragGlobalIllumination = vec4(0.0, 0.0, 0.0, 1.0);
      fragWeight = 0.0;
      return;
    }
    vec3 normal = normalize(normal4.xyz * 2.0 - 1.0);

    // Reconstruct view space position of current fragment
    float currentPixelDepth = linearizeDepth(depth);
    vec3 currentPixelPos = reconstructPosition(uv * vec2(textureSize(normalMap, 0)), currentPixelDepth);
    vec4 viewPos = vec4(currentPixelPos, 1.0);

    // Reproject current view position to last frame
    vec4 reprojectedViewPos = reprojectionViewMatrix * viewPos;
    vec4 reprojectedCoordinate = applyProjectionMat(proj, reprojectedViewPos.xyz);

    // Read last frame reprojected depth and GI history
    float lastFrameDepthViewPos = -linearDepthFromTextureLastFrame(lastFrameDepthTexture, reprojectedCoordinate.xy);
    vec4 lastFrameGlobalIllumination = texture(lastFrameGlobalIlluminationTexture, reprojectedCoordinate.xy);
    float historyOcclusionBlendWeight = texture(lastFrameGlobalIlluminationWeightTexture, reprojectedCoordinate.xy).r;

    int steps;
    float occlusionBlendWeight = 1.0;
    float colorBlendWeight = 1.0;
    float idleColorBlendWeight = computeIdleColorBlendWeight(accumulatedFrames);
    float idleOcclusionBlendWeight = computeIdleOcclusionBlendWeight(accumulatedFrames);
    float reprojectionDepthMismatch = abs((lastFrameDepthViewPos + reprojectedViewPos.z) / max(lastFrameDepthViewPos, reprojectedViewPos.z));
    bool hasReprojectionMismatch = reprojectionDepthMismatch > ${i.float(ui)};
    bool isScaledGlobalIllumination = scaleGlobalIllumination < 1.0;
    bool isLowQualityEdgePixel = isScaledGlobalIllumination && isEdgeDepth(currentPixelDepth, uv);
    bool resetColorHistory = false;

    // Heuristic to determine blending weights and number of steps for occlusion and color
    if (hasReprojectionMismatch) {
      if (isLowQualityEdgePixel) {
        steps = 1;
        occlusionBlendWeight = ${i.float($t)};
        resetColorHistory = true;
      } else {
        steps = 6;
        occlusionBlendWeight = 1.0;
        resetColorHistory = true;
      }
    } else {
      steps = 1;
      if (historyOcclusionBlendWeight > ${i.float(mi)}) {
        occlusionBlendWeight = ${i.float(fi)};
        colorBlendWeight = ${i.float(jt)};
      } else if (historyOcclusionBlendWeight > ${i.float(pi)}) {
        occlusionBlendWeight = historyOcclusionBlendWeight - 0.05;
        colorBlendWeight = ${i.float(jt)};
      } else {
        occlusionBlendWeight = isScaledGlobalIllumination ? ${i.float($t)} : idleOcclusionBlendWeight;
        colorBlendWeight = isScaledGlobalIllumination ? ${i.float(hi)} : idleColorBlendWeight;
      }
    }

    vec4 randomDirectionSample;
    mat3 normalBasis = basisFromNormal(normal);
    int temporalSampleStride = min(64 / steps, 6);
    float temporalFrameOffset = mod(temporalSampleFrame, float(64 / steps));

    // For each ray determine if it hits geometry and accumulate occlusion or color
    float stepSize = 1.0 / float(steps);
    for (int i = 0; i < steps; ++i) {
      float sampleIndex = float(i * temporalSampleStride + int(temporalFrameOffset));
      randomDirectionSample = blueNoiseDither(floor(gl_FragCoord.xy), sampleIndex);
      vec2 hemisphereSample = randomDirectionSample.rg * 0.5 + 0.5;
      float offsetSample = randomDirectionSample.a * 0.5 + 0.5;
      vec3 rayDirection = normalBasis * sampleCosineHemisphere(hemisphereSample);
      float rayMarchScreenReach = rayMarchScreenReachFromWorldReach(viewPos.xyz, rayDirection, rayMarchWorldReach);
      rayMarchScreenReach = clamp(rayMarchScreenReach, rayMarchMinReach, rayMarchMaxReach);
      vec3 hit = screenSpaceIntersectionWithLimits(
        rayDirection,
        viewPos.xyz,
        normalize(viewPos.xyz),
        normal,
        offsetSample,
        rayMarchScreenReach,
        rayMarchMaxSteps
      );

      if (hit.z > 0.0) {
        ${v(t.hasColor,i`
          // Emission and color bleed - Reproject the current receiver and sampled hit to estimate bounced color
          vec3 receiverColor = texture(lastFrameColorTexture, reprojectedCoordinate.xy).rgb;

          vec2 hitReprojectedCoordinate = reprojectionCoordinate(hit);
          vec3 sourceColor = texture(lastFrameColorTexture, hitReprojectedCoordinate).rgb;
          vec3 sourceColorLinear = linearizeGamma(sourceColor);
          vec3 sourceEmission = ${v(t.hasEmission,"texture(lastFrameEmissionTexture, hitReprojectedCoordinate).xyz","vec3(0.0)")};

          float emissionWeight = mix(
            rayMarchMinReachEmissionWeight,
            rayMarchMaxReachEmissionWeight,
            (rayMarchScreenReach - rayMarchMinReach) / max(rayMarchMaxReach - rayMarchMinReach, 0.00001)
          );
          fragGlobalIllumination.rgb += ((sourceColorLinear * colorBleedWeight) + sourceEmission * emissionWeight) * stepSize;
          `)}
      } else {
        // Occlusion - heuristic modulating sky intensity based on angle to main light
        vec4 viewMainLightDirection = view * vec4(mainLightDirection, 0.0);
        float skyModulation = pow(max(dot(rayDirection, viewMainLightDirection.xyz), 0.0), 3.0) * 5.5;
        float skyFacingWeight = clamp(3.5 * dot(viewMainLightDirection.xyz, normal), 0.0, 1.0);
        skyModulation = mix(1.0, skyModulation * 0.2 + 0.8, skyFacingWeight);
        fragGlobalIllumination.a += skyModulation * stepSize;
      }
    }

    // Rendering trick add noise to reduce accumulation artifacts
    float accumulationDither = occlusionBlendWeight < 1.0
      ? randomDirectionSample.b * ${i.float(Si)}
      : 0.0;

    ${v(t.hasColor,i`
      // Accumulate color
      vec3 lastFrameColor = lastFrameGlobalIllumination.rgb;
      float colorDitherScale = isScaledGlobalIllumination ? ${i.float(Ti)} : 1.0;
      fragGlobalIllumination.rgb = resetColorHistory
        ? vec3(0.0)
        : mix(lastFrameColor + accumulationDither * colorDitherScale, fragGlobalIllumination.rgb, colorBlendWeight);
      `,i`
      fragGlobalIllumination.rgb = vec3(0.0);
      `)}
    fragGlobalIllumination.rgb = quantizeGlobalIlluminationColor(fragGlobalIllumination.rgb);

    // Accumulate occlusion
    fragGlobalIllumination.a = mix(lastFrameGlobalIllumination.a + accumulationDither, fragGlobalIllumination.a, occlusionBlendWeight);

    fragWeight = occlusionBlendWeight;
  `),e}const _i=Object.freeze(Object.defineProperty({__proto__:null,GlobalIlluminationPassParameters:ft,build:ua,defaultColorBleedWeight:dt,defaultRayMarchMaxReach:Oe,defaultRayMarchMaxReachEmissionWeight:pt,defaultRayMarchMaxSteps:Re,defaultRayMarchMinReach:ht,defaultRayMarchMinReachEmissionWeight:mt,defaultRayMarchWorldReach:ut},Symbol.toStringTag,{value:"Module"})),Ci=15.3,Ii=5,Di=-.05;function ha(t){t.fragment.code.add(i`
    float globalIlluminationNormalSimilarityWeight(vec3 sampleNormal, vec3 centerNormal) {
      return clamp(1.0 - ${i.float(Ci)} * length(sampleNormal - centerNormal), 0.0, 1.0);
    }

    float globalIlluminationDepthNormalCorrection(vec3 encodedNormal) {
      vec3 decodedNormal = normalize(encodedNormal * 2.0 - 1.0);
      return pow(max((1.0 - abs(decodedNormal.x)) * (1.0 - abs(decodedNormal.y)), 0.01), ${i.float(Ii)});
    }

    float globalIlluminationDepthSharpness(float projScale, float depth) {
      return ${i.float(Di)} * projScale / depth;
    }

    float globalIlluminationDepthSharpness(float projScale, float depth, vec3 encodedNormal) {
      return globalIlluminationDepthSharpness(projScale, depth) * globalIlluminationDepthNormalCorrection(encodedNormal);
    }
  `)}const Ve=4;let vt=class extends A{constructor(){super(...arguments),this.blurSize=et()}};function ma(){const t=new V,e=t.fragment;t.include(fe),t.include(Pe),t.include(ha);const a=(Ve+3)/2,o=1/(2*a*a);e.include(ee),e.include(oo,pa),e.include(ct);const r=5e4;e.uniforms.add(new ot("hasEmission",h=>h.hasEmission),new w("depthMap",h=>h.depthTexture),new w("normalMap",h=>h.normalTexture),new W("globalIlluminationTexture",h=>h.texture),new W("globalIlluminationWeightTexture",h=>h.weightTexture),new it("blurSize",h=>h.blurSize),new x("scaleGlobalIllumination",h=>h.scaleGlobalIllumination),new x("projScale",(h,g)=>{const m=g.camera.distance;return m>r?Math.max(0,h.projScale-(m-r)):h.projScale}));const n=.1,l=400,s=.03;return e.code.add(i`
    void accumulateBlurSample(
      vec2 sampleUv,
      float sampleOffset,
      float centerDepth,
      vec3 centerNormal,
      float depthSharpness,
      bool skipOcclusionBlur,
      inout float emissionWeightSum,
      inout vec3 emissionSum,
      inout float occlusionWeightSum,
      inout float occlusionSum,
      float centerOcclusionBlendWeight
    ) {
      vec4 sampleGlobalIllumination = texture(globalIlluminationTexture, sampleUv);
      vec3 sampleNormal = texture(normalMap, sampleUv).rgb;
      float sampleDepth = linearDepthFromTexture(depthMap, sampleUv);

      float depthDelta = sampleDepth - centerDepth;
      bool isScaledGlobalIllumination = scaleGlobalIllumination < 1.0;
      float normalSimilarityWeight = globalIlluminationNormalSimilarityWeight(sampleNormal, centerNormal);
      float depthNormalCorrection = globalIlluminationDepthNormalCorrection(sampleNormal);
      vec3 emission = sampleGlobalIllumination.rgb;
      float emissionSpatialWeightMultiplier = isScaledGlobalIllumination ? ${i.float(l)} : 1.0;

      float emissionWeight = exp(
        -sampleOffset * sampleOffset * ${i.float(o)} * ${i.float(n)} * emissionSpatialWeightMultiplier
        - depthDelta * depthDelta * depthSharpness * depthNormalCorrection
      );
      emissionWeight *= normalSimilarityWeight;
      emissionWeightSum += emissionWeight;
      emissionSum += emissionWeight * emission;

      if (skipOcclusionBlur) {
        return;
      }

      float occlusionSpatialKernelScale = centerOcclusionBlendWeight > ${i.float(s)}
        ? ${i.float(.08)}
        : ${i.float(1.5)};
      float occlusionWeight = exp(-sampleOffset * sampleOffset * occlusionSpatialKernelScale - depthDelta * depthDelta * depthSharpness);
      occlusionWeight *= normalSimilarityWeight;
      occlusionWeightSum += occlusionWeight;
      occlusionSum += occlusionWeight * sampleGlobalIllumination.a;
    }
  `),e.main.add(i`
    vec3 emissionSum = vec3(0.0);
    float emissionWeightSum = 0.0;

    vec4 centerGlobalIllumination = texture(globalIlluminationTexture, uv);
    float centerOcclusionBlendWeight = texture(globalIlluminationWeightTexture, uv).r;
    bool isScaledGlobalIllumination = scaleGlobalIllumination < 1.0;
    bool shouldReuseCenterOcclusion = isScaledGlobalIllumination && centerOcclusionBlendWeight <= ${i.float(s)};
    bool shouldSkipLowQualityBlur = !hasEmission && shouldReuseCenterOcclusion;
    if (shouldSkipLowQualityBlur) {
      fragColor = vec4(
        quantizeGlobalIlluminationColor(centerGlobalIllumination.rgb),
        centerGlobalIllumination.a
      );
      return;
    }

    float centerDepth = linearDepthFromTexture(depthMap, uv);
    vec3 centerNormal = texture(normalMap, uv).rgb;
    float occlusionSum = 0.0;
    float occlusionWeightSum = 0.0;

    float depthSharpness = globalIlluminationDepthSharpness(projScale, centerDepth);
    for (int sampleOffset = -${i.int(Ve)}; sampleOffset <= ${i.int(Ve)}; ++sampleOffset) {
      float sampleOffsetFloat = float(sampleOffset);
      vec2 sampleUv = uv + sampleOffsetFloat * blurSize;
      accumulateBlurSample(
        sampleUv,
        sampleOffsetFloat,
        centerDepth,
        centerNormal,
        depthSharpness,
        shouldReuseCenterOcclusion,
        emissionWeightSum,
        emissionSum,
        occlusionWeightSum,
        occlusionSum,
        centerOcclusionBlendWeight
      );
    }

    float occlusion = shouldReuseCenterOcclusion ? centerGlobalIllumination.a : occlusionSum / occlusionWeightSum;
    vec3 blurredEmission = (emissionSum / emissionWeightSum).rgb;

    // heuristic dithering of the colors to remove banding, color shifts and wrong color accumulation
    float dither = ditherNoise(vec4(blurredEmission, occlusion)) - 1./32768.0;
    blurredEmission += isScaledGlobalIllumination ? 0.85 * dither : dither;

    fragColor = vec4(quantizeGlobalIlluminationColor(blurredEmission), occlusion);
  `),t}const pa=new Po;pa.useFloatBlend=!1;const zi=Object.freeze(Object.defineProperty({__proto__:null,GlobalIlluminationBlurDrawParameters:vt,build:ma},Symbol.toStringTag,{value:"Module"}));let Je=class extends Q{constructor(){super(...arguments),this.shader=new L(zi,()=>B(()=>Promise.resolve().then(()=>mr),void 0))}initializePipeline(){return te({colorWrite:ae})}};Je=c([j("esri.views.3d.webgl-engine.effects.globalIllumination.GlobalIlluminationBlurTechnique")],Je);let qe=class extends Q{constructor(){super(...arguments),this.shader=new L(_i,()=>B(()=>Promise.resolve().then(()=>pr),void 0))}initializePipeline(){return te({colorWrite:ae})}};qe=c([j("esri.views.3d.webgl-engine.effects.globalIllumination.GlobalIlluminationTechnique")],qe);let Ye=class extends ta{constructor(){super(...arguments),this.hasColor=!0,this.hasEmission=!1,this.rayMarchMaxReach=Oe,this.rayMarchMaxSteps=Re,this.useProjectedRayLength=!0,this.clampRayToScreen=!1}};c([p()],Ye.prototype,"hasColor",void 0),c([p()],Ye.prototype,"hasEmission",void 0);const Ot=5e4,Fi=100;let gt=class extends A{};function fa(){const t=new V,e=t.fragment;return t.include(fe),t.include(Pe),t.include(ha),e.include(ee),e.include(ct),e.uniforms.add(new w("depthMap",a=>a.depthTexture),new w("normalMap",a=>a.normalTexture),new W("tex",a=>a.colorTexture),new W("globalIlluminationWeightTexture",a=>a.weightTexture),new x("projScale",(a,o)=>{const r=o.camera.distance;return r>Ot?Math.max(0,a.projScale-(r-Ot)):a.projScale})),e.code.add(i`
    float computeDepthWeight(float sampleDepth, float centerDepth, float depthSharpness) {
      float depthDelta = abs(sampleDepth - centerDepth);
      return exp(-0.08 - depthDelta * depthDelta * depthSharpness);
    }

    vec3 normalFromTexture(sampler2D normalTexture, vec2 uv) {
      ivec2 normalTextureSize = textureSize(normalTexture, 0);
      ivec2 normalTexel = clamp(ivec2(uv * vec2(normalTextureSize)), ivec2(0), normalTextureSize - ivec2(1));
      return texelFetch(normalTexture, normalTexel, 0).xyz;
    }

    void sampleJointBilateralUpscale(vec2 sampleUv, out vec4 upscaledColor, out float upscaledWeight) {
      float centerDepth = linearDepthFromTexture(depthMap, sampleUv);
      vec3 centerNormal = normalFromTexture(normalMap, sampleUv);
      float depthSharpness = ${i.float(Fi)} * globalIlluminationDepthSharpness(projScale, centerDepth, centerNormal);

      vec2 lowResTextureSize = vec2(textureSize(tex, 0));
      vec2 texelPosition = sampleUv * lowResTextureSize - 0.5;
      vec2 texelBase = floor(texelPosition);
      vec2 bilinearWeightsFraction = fract(texelPosition);

      vec2 uv00 = (texelBase + vec2(0.5, 0.5)) / lowResTextureSize;
      vec2 uv10 = (texelBase + vec2(1.5, 0.5)) / lowResTextureSize;
      vec2 uv01 = (texelBase + vec2(0.5, 1.5)) / lowResTextureSize;
      vec2 uv11 = (texelBase + vec2(1.5, 1.5)) / lowResTextureSize;

      vec4 color00 = texture(tex, uv00);
      vec4 color10 = texture(tex, uv10);
      vec4 color01 = texture(tex, uv01);
      vec4 color11 = texture(tex, uv11);
      float weight00 = texture(globalIlluminationWeightTexture, uv00).r;
      float weight10 = texture(globalIlluminationWeightTexture, uv10).r;
      float weight01 = texture(globalIlluminationWeightTexture, uv01).r;
      float weight11 = texture(globalIlluminationWeightTexture, uv11).r;

      float depth00 = linearDepthFromTexture(depthMap, uv00);
      float depth10 = linearDepthFromTexture(depthMap, uv10);
      float depth01 = linearDepthFromTexture(depthMap, uv01);
      float depth11 = linearDepthFromTexture(depthMap, uv11);

      vec3 normal00 = normalFromTexture(normalMap, uv00);
      vec3 normal10 = normalFromTexture(normalMap, uv10);
      vec3 normal01 = normalFromTexture(normalMap, uv01);
      vec3 normal11 = normalFromTexture(normalMap, uv11);

      float bilinearWeight00 = (1.0 - bilinearWeightsFraction.x) * (1.0 - bilinearWeightsFraction.y);
      float bilinearWeight10 = bilinearWeightsFraction.x * (1.0 - bilinearWeightsFraction.y);
      float bilinearWeight01 = (1.0 - bilinearWeightsFraction.x) * bilinearWeightsFraction.y;
      float bilinearWeight11 = bilinearWeightsFraction.x * bilinearWeightsFraction.y;

      float jointBilateralWeight00 = bilinearWeight00 * computeDepthWeight(depth00, centerDepth, depthSharpness) * globalIlluminationNormalSimilarityWeight(normal00, centerNormal);
      float jointBilateralWeight10 = bilinearWeight10 * computeDepthWeight(depth10, centerDepth, depthSharpness) * globalIlluminationNormalSimilarityWeight(normal10, centerNormal);
      float jointBilateralWeight01 = bilinearWeight01 * computeDepthWeight(depth01, centerDepth, depthSharpness) * globalIlluminationNormalSimilarityWeight(normal01, centerNormal);
      float jointBilateralWeight11 = bilinearWeight11 * computeDepthWeight(depth11, centerDepth, depthSharpness) * globalIlluminationNormalSimilarityWeight(normal11, centerNormal);
      float jointBilateralWeightSum = jointBilateralWeight00 + jointBilateralWeight10 + jointBilateralWeight01 + jointBilateralWeight11;

      if (jointBilateralWeightSum < 0.0001) {
        // Fall back to the nearest low-resolution texel when all bilateral weights collapse.
        vec2 nearestUv = (floor(texelPosition + 0.5) + vec2(0.5)) / lowResTextureSize;
        upscaledColor = texture(tex, nearestUv);
        upscaledWeight = texture(globalIlluminationWeightTexture, nearestUv).r;
        return;
      }

      upscaledColor = (
        color00 * jointBilateralWeight00 +
        color10 * jointBilateralWeight10 +
        color01 * jointBilateralWeight01 +
        color11 * jointBilateralWeight11
      ) / jointBilateralWeightSum;

      upscaledWeight = (
        weight00 * jointBilateralWeight00 +
        weight10 * jointBilateralWeight10 +
        weight01 * jointBilateralWeight01 +
        weight11 * jointBilateralWeight11
      ) / jointBilateralWeightSum;
    }
  `),t.outputs.add("fragColor","vec4",0),t.outputs.add("fragWeight","float",1),e.main.add(i`sampleJointBilateralUpscale(uv, fragColor, fragWeight);
fragColor.rgb = quantizeGlobalIlluminationColor(fragColor.rgb);`),t}const Pi=Object.freeze(Object.defineProperty({__proto__:null,GlobalIlluminationUpscaleDrawParameters:gt,build:fa},Symbol.toStringTag,{value:"Module"}));let Xe=class extends Q{constructor(){super(...arguments),this.shader=new L(Pi,()=>B(()=>Promise.resolve().then(()=>fr),void 0))}initializePipeline(){return te({colorWrite:ae})}};Xe=c([j("esri.views.3d.webgl-engine.effects.globalIllumination.GlobalIlluminationUpscaleTechnique")],Xe);const ne=1;let ye=class extends Kt{constructor(e){super(e),this.consumes={required:["normals"]},this.produces=q.AMBIENT_ILLUMINATION,this._passParameters=new ft,this._drawParameters=new vt,this._drawParametersUpscale=new gt,this._maxFrames=256,this._lowQualityResolutionScale=.25,this._configuration=new Ye,this._globalIllumination=null,this._isGlobalIlluminationUpdate=!1,this._resetBuffer=!1}initialize(){this.addHandles(Gt(()=>this.view.stage.renderer.hasGlobalIllumination,()=>{this._resetAccumulatedFrames(),this._requestRender()},Ha))}destroy(){this._globalIllumination=We(this._globalIllumination)}resetAccumulatedFrames(){this._isGlobalIlluminationUpdate||this._resetAccumulatedFrames()}render(e){var yt;if(this._passParameters.accumulatedFrames>=this._maxFrames)return(yt=this._globalIllumination)==null||yt.retain(),this._globalIllumination;const a=e.find(({name:za})=>za==="normals"),o=a==null?void 0:a.getTexture(),r=a==null?void 0:a.getTexture(Bt),n=this._mode;if(!o||!r)return this._emptyOutput;if(n===0)return this._resetBuffer=!1,this._emptyOutput;if(!this._canRender)return this._resetBuffer=!1,this._requestRender(),this._emptyOutput;const l=this.bindParameters;this._configuration.hasEmission=!!l.reprojection.lastFrameEmission;const s=this.techniques.getCompiled(qe,this._configuration),d=this.techniques.getCompiled(Je),u=n===1,h=u?this._lowQualityResolutionScale:1,g=u?this.techniques.getCompiled(Xe):null;if(!s||!d||u&&!g)return this._requestRender(),this._emptyOutput;const m=this.renderingContext,{camera:_}=l;this._passParameters.normalTexture=o,this._passParameters.depthTexture=r,this._passParameters.projScale=1/_.computeScreenPixelSizeAtDist(1),this._passParameters.scaleGlobalIllumination=h;const{fullWidth:b,fullHeight:C}=_,I=Math.max(1,Math.floor(b*h)),P=Math.max(1,Math.floor(C*h)),D=this.fboCache.acquire(I,P,"global illumination input").acquireColor(E,0);m.bindFramebuffer(D.fbo),m.setViewport(0,0,I,P),m.bindTechnique(s,l,this._passParameters,this._drawParameters),m.screen.draw();const z=D.obtainAttachment(E),M=Math.max(1,Math.round(I/ne)),y=Math.max(1,Math.round(P/ne)),oe=this.fboCache.acquire(M,y,"global illumination blur horizontal");m.bindFramebuffer(oe.fbo),this._drawParameters.texture=D.getTexture(),this._drawParameters.weightTexture=z.attachment,X(this._drawParameters.blurSize,0,ne/P),m.bindTechnique(d,l,this._passParameters,this._drawParameters),m.setViewport(0,0,M,y),m.screen.draw(),D.release();const Da=u?"global illumination blur vertical":q.AMBIENT_ILLUMINATION,H=this.fboCache.acquire(M,y,Da);m.bindFramebuffer(H.fbo),m.setViewport(0,0,M,y),m.setClearColor(1,1,1,0),m.clear(16384),this._drawParameters.texture=oe.getTexture(),this._drawParameters.weightTexture=z.attachment,X(this._drawParameters.blurSize,ne/M,0),m.bindTechnique(d,l,this._passParameters,this._drawParameters),m.setViewport(0,0,M,y),m.screen.draw(),oe.release(),H.attachColor(z,E),z.release();let ve=H;return g&&(ve=this.fboCache.acquire(b,C,q.AMBIENT_ILLUMINATION).acquireColor(E,0),m.bindFramebuffer(ve.fbo),m.setViewport(0,0,b,C),m.setClearColor(1,1,1,0),m.clear(16384),this._drawParametersUpscale.colorTexture=H.getTexture(),this._drawParametersUpscale.weightTexture=H.getTexture(E),m.bindTechnique(g,l,this._passParameters,this._drawParametersUpscale),m.screen.draw(),H.release()),m.setViewport4fv(_.fullViewport),this._passParameters.temporalSampleFrame=(this._passParameters.temporalSampleFrame+1)%64,++this._passParameters.accumulatedFrames,this._cacheGlobalIllumination(ve),this._passParameters.accumulatedFrames<this._maxFrames&&this._requestRender(),ve}_requestRender(){this._isGlobalIlluminationUpdate=!0,this.requestRender(1),this._isGlobalIlluminationUpdate=!1}_cacheGlobalIllumination(e){this._globalIllumination!==e&&(this._globalIllumination=We(this._globalIllumination),this._globalIllumination=e,this._globalIllumination.retain())}get _emptyOutput(){const e=this.renderingContext,{fullWidth:a,fullHeight:o}=this.bindParameters.camera,r=this.fboCache.acquire(a,o,q.AMBIENT_ILLUMINATION).acquireColor(E,0);return e.bindFramebuffer(r.fbo),e.setViewport(0,0,a,o),e.clearBuffer(0,[0,0,0,1]),e.clearBuffer(1,[0,0,0,0]),r}get _canRender(){const{reprojection:e,hasEmission:a,globalIllumination:o}=this.bindParameters;return!(!e.lastFrameColor||a&&!e.lastFrameEmission||!e.lastFrameDepth||!o||this._resetBuffer)}get _mode(){const{hasGlobalIlluminationHighQuality:e,hasGlobalIllumination:a}=this.view.stage.renderer;return e?2:a?1:0}_resetAccumulatedFrames(){this._passParameters.accumulatedFrames=0,this._globalIllumination=We(this._globalIllumination)}get test(){const e=this;return{passParameters:this._passParameters,configuration:this._configuration,get maxFrames(){return e._maxFrames},set maxFrames(a){e._maxFrames=a},get lowQualityResolutionScale(){return e._lowQualityResolutionScale},set lowQualityResolutionScale(a){e._lowQualityResolutionScale=a},get mode(){return e._mode},restartAccumulation:()=>{this._resetAccumulatedFrames(),this._passParameters.temporalSampleFrame=0,this._resetBuffer=!0,this._requestRender()}}}};c([G()],ye.prototype,"consumes",void 0),c([G()],ye.prototype,"produces",void 0),ye=c([j("esri.views.3d.webgl-engine.effects.globalIllumination.GlobalIllumination")],ye);function $i(t,e){e.receiveGlobalIllumination?(t.uniforms.add(new ot("hasGlobalIlluminationTexture",a=>a.globalIllumination!=null),new O("globalIlluminationTexture",a=>{var o;return(o=a.globalIllumination)==null?void 0:o.getTexture()})),t.constants.add("blurSizePixelsInverse","float",1/ne),t.code.add(i`vec3 readGlobalIlluminationOcclusionInverse() {
if (!hasGlobalIlluminationTexture) {
return vec3(1.0);
}
ivec2 texel = ivec2(gl_FragCoord.xy * blurSizePixelsInverse);
return vec3(texelFetch(globalIlluminationTexture, texel, 0).a);
}
vec3 readGlobalIlluminationOcclusion() {
return 1.0 - readGlobalIlluminationOcclusionInverse();
}
vec4 readGlobalIlluminationEmissionInverse() {
if (!hasGlobalIlluminationTexture) {
return vec4(1.0);
}
ivec2 texel = ivec2(gl_FragCoord.xy * blurSizePixelsInverse);
return 1.0 - vec4(texelFetch(globalIlluminationTexture, texel, 0).rgb, 0.0);
}
vec4 readGlobalIlluminationEmission() {
return max((1.0 - readGlobalIlluminationEmissionInverse() - 0.01) / 0.99, 0.0);
}`)):t.code.add(i`vec3 readGlobalIlluminationOcclusionInverse() { return vec3(1.0); }
vec3 readGlobalIlluminationOcclusion() { return vec3(0.0); }
vec4 readGlobalIlluminationEmissionInverse() { return vec4(1.0); }
vec4 readGlobalIlluminationEmission() { return vec4(0.0); }`)}function ji(t){t.code.add(i`float mapChannel(float x, vec2 p) {
if((x < p.x) && (p.x == 0.0) || !(x < p.x) && (p.x == 1.0)) {
return 0.0;
}
float result = (x < p.x) ? mix(0.0, p.y, x/p.x) : mix(p.y, 1.0, (x - p.x) / (1.0 - p.x) );
return max(result, 0.0);
}`),t.code.add(i`vec3 blackLevelSoftCompression(vec3 color, float averageAmbientRadiance) {
vec2 p = vec2(0.02, 0.0075) * averageAmbientRadiance;
return vec3(mapChannel(color.x, p), mapChannel(color.y, p), mapChannel(color.z, p));
}`)}function Oi(t){t.code.add(i`vec3 tonemapACES(vec3 x) {
return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}`),t.code.add(i`vec3 tonemapKhronosNeutral(vec3 color) {
const float startCompression = 0.76;
const float desaturation = 0.15;
float peak = max(color.r, max(color.g, color.b));
if (peak < startCompression) {
return color;
}
float d = 1.0 - startCompression;
float newPeak = 1.0 - d * d / (peak + d - startCompression);
color *= newPeak / peak;
float g = 1.0 - 1.0 / (desaturation * (peak - newPeak) + 1.0 );
return mix(color, vec3(newPeak), g);
}`)}function xt(t){t.constants.add("ambientBoostFactor","float",_o)}function bt(t){t.uniforms.add(new R("lightingGlobalFactor",e=>e.lighting.globalFactor))}function va(t,e){const{pbrMode:a,spherical:o,hasColorTexture:r,receiveGlobalIllumination:n}=e;t.include(De),t.include($i,e),t.include(st,e),a!==0&&t.include(lt,e),t.include(ni,e),t.include(rt),t.include(Oi,e);const l=!(a===2&&!r);l&&t.include(ji),xt(t),bt(t),he(t),t.code.add(i`
    float additionalDirectedAmbientLight(float lightAlignment) {
      return smoothstep(0.0, 1.0, clamp(lightAlignment * 2.5, 0.0, 1.0));
    }

    float additionalDirectedAmbientLight(vec3 vPosWorld) {
      float lightAlignment = dot(${o?i`normalize(vPosWorld)`:i`vec3(0.0, 0.0, 1.0)`}, mainLightDirection);
      return smoothstep(0.0, 1.0, clamp(lightAlignment * 2.5, 0.0, 1.0));
    }
  `),me(t),t.code.add(i`vec3 evaluateAdditionalLighting(float ambientOcclusion, vec3 vPosWorld) {
float additionalAmbientScale = additionalDirectedAmbientLight(vPosWorld);
return (1.0 - ambientOcclusion) * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor * mainLightIntensity;
}`);const s=n?"globalIlluminationOcclusion":"ssao",d=n?.75:1,u=n?1.5:1;switch(a){case 0:case 4:case 3:t.include(si),t.code.add(i`vec3 evaluateSceneLighting(vec3 normalWorld, vec3 albedo, float shadow, float ssao, vec3 additionalLight) {
vec3 mainLighting = applyShading(normalWorld, shadow);
vec3 ambientLighting = calculateAmbientIrradiance(normalWorld) * (1.0 - ssao);
vec3 albedoLinear = linearizeGamma(albedo);
vec3 totalLight = mainLighting + ambientLighting + additionalLight;
totalLight = min(totalLight, vec3(PI));
vec3 outColor = vec3((albedoLinear / PI) * totalLight);
return delinearizeGamma(outColor);
}`);break;case 1:case 2:{const h=n?.35:.2;t.code.add(i`
        const float fillLightIntensity = 0.25;
        const float horizonLightDiffusion = 0.4;
        const float additionalAmbientIrradianceFactor = 0.02;
        const float groundReflectance = ${i.float(h)};

        vec3 evaluateSceneLightingPBR(vec3 normal, vec3 albedo, float shadow, float ssao, vec3 additionalLight,
                                      vec3 viewDirection, vec3 upDirection, vec3 mrr, float additionalAmbientIrradiance) {
          PBRShadingInfo inputs;
          calculatePBRInputs(inputs, normal, viewDirection, upDirection, albedo, mrr);

          ${v(n,i`vec3 globalIlluminationOcclusion = min(1.2 * readGlobalIlluminationOcclusion(), 1.0);`)}
      `),e.useFillLights?t.uniforms.add(new ot("hasFillLights",g=>g.enableFillLights)):t.constants.add("hasFillLights","bool",!1),t.code.add(i`
        vec3 ambientDir = vec3(5.0 * upDirection[1] - upDirection[0] * upDirection[2], - 5.0 * upDirection[0] - upDirection[2] * upDirection[1], upDirection[1] * upDirection[1] + upDirection[0] * upDirection[0]);
        ambientDir = ambientDir != vec3(0.0) ? normalize(ambientDir) : normalize(vec3(5.0, -1.0, 0.0));

        inputs.NdotAmbDir = hasFillLights ? abs(dot(normal, ambientDir)) : 1.0;

        // Calculate the irradiance components: sun, fill lights and the sky.
        vec3 mainLightIrradianceComponent = ${i.float(d)} * inputs.NdotL * (1.0 - shadow) * mainLightIntensity;
        vec3 fillLightsIrradianceComponent = inputs.NdotAmbDir * mainLightIntensity * fillLightIntensity;
        // calculate ambient irradiance for localView and additionalLight for globalView
        vec3 ambientLightIrradianceComponent = ${i.float(u)} * calculateAmbientIrradiance(normal) * (1.0 - ${s}) + additionalLight;

        // Assemble the overall irradiance of the sky that illuminates the surface
        inputs.skyIrradianceToSurface = ambientLightIrradianceComponent + mainLightIrradianceComponent + fillLightsIrradianceComponent ;
        // Assemble the overall irradiance of the ground that illuminates the surface. for this we use the simple model that changes only the sky irradiance by the groundReflectance
        inputs.groundIrradianceToSurface = groundReflectance * ambientLightIrradianceComponent + mainLightIrradianceComponent + fillLightsIrradianceComponent ;
      `),t.uniforms.add(new R("lightingSpecularStrength",g=>g.lighting.mainLight.specularStrength),new R("lightingEnvironmentStrength",g=>g.lighting.mainLight.environmentStrength)).code.add(i`
        vec3 horizonRingDir = inputs.RdotUP * upDirection - inputs.reflectedView;
        vec3 horizonRingH = normalize(horizonRingDir - viewDirection);
        inputs.NdotH_Horizon = dot(normal, horizonRingH);

        vec3 mainLightRadianceComponent = lightingSpecularStrength * normalDistribution(inputs.NdotH, inputs.roughness) * mainLightIntensity * (1.0 - shadow);
        vec3 horizonLightRadianceComponent = lightingEnvironmentStrength * normalDistribution(inputs.NdotH_Horizon, min(inputs.roughness + horizonLightDiffusion, 1.0)) * mainLightIntensity * fillLightIntensity;

        // calculateAmbientRadiance for localView and additionalLight for global view
        vec3 ambientLightRadianceComponent = lightingEnvironmentStrength * calculateAmbientRadiance() * (1.0 - ${s}) + additionalLight;
        float normalDirectionModifier = mix(1., min(mix(0.1, 2.0, (inputs.NdotUP + 1.) * 0.5), 1.0), clamp(inputs.roughness * 5.0, 0.0 , 1.0));

        // Assemble the overall radiance of the sky that illuminates the surface
        inputs.skyRadianceToSurface = (ambientLightRadianceComponent + horizonLightRadianceComponent) * normalDirectionModifier + mainLightRadianceComponent;

        // Assemble the overall radiance of the ground that illuminates the surface. for this we use the simple model that changes only the sky radiance by the groundReflectance
        inputs.groundRadianceToSurface = 0.5 * groundReflectance * (ambientLightRadianceComponent + horizonLightRadianceComponent) * normalDirectionModifier + mainLightRadianceComponent;

        // Calculate average ambient radiance - This is used in the gamut mapping process to determine the black level for compression
        inputs.averageAmbientRadiance = ambientLightIrradianceComponent[1] * (1.0 + groundReflectance);
      `),t.code.add(i`
        vec3 reflectedColorComponent = evaluateEnvironmentIllumination(inputs);
        vec3 additionalMaterialReflectanceComponent = inputs.albedoLinear * additionalAmbientIrradiance;
        vec3 outColorLinear = reflectedColorComponent + additionalMaterialReflectanceComponent;

        ${v(n,i`
        vec3 globalIlluminationEmission = 2.25 * (0.75 * inputs.albedoLinear + 0.25) * readGlobalIlluminationEmission().rgb;
        outColorLinear += globalIlluminationEmission;`)}

      ${l?i`vec3 adjustedOutColorLinear = blackLevelSoftCompression(outColorLinear, inputs.averageAmbientRadiance);`:i`vec3 adjustedOutColorLinear = max(vec3(0.0), outColorLinear - 0.005 * inputs.averageAmbientRadiance);`}

        return delinearizeGamma(adjustedOutColorLinear);
      }
    `);break}case 5:case 6:{const h=n?.35:.5,g=n?.75:1,m=n?1.5:1;he(t),me(t),t.code.add(i`
      const float roughnessTerrain = 0.5;
      const float specularityTerrain = ${i.float(h)};

      vec3 evaluatePBRSimplifiedLighting(vec3 normal, vec3 albedo, float shadow, float ssao, vec3 additionalLight, vec3 viewDirection, vec3 upDirection) {
        PBRShadingInfo inputs;
        calculateSimplifiedInputs(inputs, normal, viewDirection, upDirection, albedo);

        ${v(n,i`vec3 globalIlluminationOcclusion = min(1.2 * readGlobalIlluminationOcclusion(), 1.0);`)}

        vec3 mainLightIrradianceComponent = ${i.float(g)} * (1.0 - shadow) * inputs.NdotL * mainLightIntensity;
        vec3 ambientLightIrradianceComponent = ${i.float(m)} * calculateAmbientIrradiance(normal) * (1.0 - ${s}) + additionalLight;
        vec3 ambientSky = ambientLightIrradianceComponent + mainLightIrradianceComponent;

        vec3 indirectDiffuse = ((1.0 - inputs.NdotUP) * mainLightIrradianceComponent + (1.0 + inputs.NdotUP ) * ambientSky) * 0.5;
        vec3 outDiffColor = inputs.albedoLinear * (1.0 - inputs.f0) * indirectDiffuse / PI;

        vec3 mainLightRadianceComponent = normalDistribution(inputs.NdotH, roughnessTerrain) * mainLightIntensity;
        vec2 dfg = prefilteredDFGAnalytical(roughnessTerrain, inputs.NdotV);
        vec3 specularColor = inputs.f0 * dfg.x + inputs.f90 * dfg.y;
        vec3 specularComponent = specularityTerrain * specularColor * mainLightRadianceComponent;

        vec3 outColorLinear = outDiffColor + specularComponent;

        ${v(n,i`
        vec3 globalIlluminationEmission = 2.25 * (0.75 * inputs.albedoLinear + 0.25) * readGlobalIlluminationEmission().rgb;
        outColorLinear += globalIlluminationEmission;`)}

        return delinearizeGamma(outColorLinear);
      }
      `);break}}}function Ri(t,e){const a=t.fragment;switch(a.code.add(i`struct ShadingNormalParameters {
vec3 normalView;
vec3 viewDirection;
} shadingParams;`),e.doubleSidedMode){case 0:a.code.add(i`vec3 shadingNormal(ShadingNormalParameters params) {
return normalize(params.normalView);
}`);break;case 1:a.code.add(i`vec3 shadingNormal(ShadingNormalParameters params) {
return dot(params.normalView, params.viewDirection) > 0.0 ? normalize(-params.normalView) : normalize(params.normalView);
}`);break;case 2:a.code.add(i`vec3 shadingNormal(ShadingNormalParameters params) {
return gl_FrontFacing ? normalize(params.normalView) : normalize(-params.normalView);
}`);break;default:e.doubleSidedMode;case 3:}}function ga(t,e){const a=e.pbrMode,o=t.fragment;if(a!==2&&a!==0&&a!==1)return void o.code.add(i`void applyPBRFactors() {}`);if(a===0)return void o.code.add(i`void applyPBRFactors() {}
float getBakedOcclusion() { return 1.0; }`);if(a===2)return void o.code.add(i`vec3 mrr = vec3(0.0, 0.6, 0.2);
float occlusion = 1.0;
void applyPBRFactors() {}
float getBakedOcclusion() { return 1.0; }`);const{hasMetallicRoughnessTexture:r,hasMetallicRoughnessTextureTransform:n,hasOcclusionTexture:l,hasOcclusionTextureTransform:s,bindType:d}=e;(r||l)&&t.include(Ut,e),o.code.add(i`vec3 mrr;
float occlusion;`),r&&o.uniforms.add(d===1?new w("texMetallicRoughness",u=>u.textureMetallicRoughness):new W("texMetallicRoughness",u=>u.textureMetallicRoughness)),l&&o.uniforms.add(d===1?new w("texOcclusion",u=>u.textureOcclusion):new W("texOcclusion",u=>u.textureOcclusion)),o.uniforms.add(d===1?new ue("mrrFactors",u=>u.mrrFactors):new io("mrrFactors",u=>u.mrrFactors)),o.code.add(i`
    ${v(r,i`void applyMetallicRoughness(vec2 uv) {
            vec3 metallicRoughness = textureLookup(texMetallicRoughness, uv).rgb;
            mrr[0] *= metallicRoughness.b;
            mrr[1] *= metallicRoughness.g;
          }`)}

    ${v(l,"void applyOcclusion(vec2 uv) { occlusion *= textureLookup(texOcclusion, uv).r; }")}

    float getBakedOcclusion() {
      return ${l?"occlusion":"1.0"};
    }

    void applyPBRFactors() {
      mrr = mrrFactors;
      occlusion = 1.0;

      ${v(r,`applyMetallicRoughness(${n?"metallicRoughnessUV":"vuv0"});`)}
      ${v(l,`applyOcclusion(${s?"occlusionUV":"vuv0"});`)}
    }
  `)}function Wi(t,e){const a=Fe(e.output)&&e.receiveShadows;a&&jo(t,!0),t.vertex.code.add(i`
    void forwardLinearDepthToReadShadowMap() { ${v(a,"forwardLinearDepth(gl_Position.w);")} }
  `)}let Ni=class extends ze{constructor(e,a,o,r){super(e,"mat4",2,(n,l,s,d)=>n.setUniformMatrices4fv(e,a(l,s,d),r),o)}},Ei=class extends ze{constructor(e,a,o,r){super(e,"mat4",1,(n,l,s)=>n.setUniformMatrices4fv(e,a(l,s),r),o)}};function Gi(t){t.uniforms.add(new Ei("shadowMapMatrix",(e,a)=>a.shadowMap.getShadowMapMatrices(e.origin),4)),t.include(xa)}function Bi(t){t.uniforms.add(new Ni("shadowMapMatrix",(e,a)=>a.shadowMap.getShadowMapMatrices(e.origin),4)),t.include(xa)}function xa(t){t.uniforms.add(new Co("cascadeDistances",e=>e.shadowMap.cascadeDistances),new ro("numCascades",e=>e.shadowMap.numCascades)),t.code.add(Li)}const Li=i`const vec3 invalidShadowmapUVZ = vec3(0.0, 0.0, -1.0);
vec3 lightSpacePosition(vec3 _vpos, mat4 mat) {
vec4 lv = mat * vec4(_vpos, 1.0);
lv.xy /= lv.w;
return 0.5 * lv.xyz + vec3(0.5);
}
vec2 cascadeCoordinates(int i, ivec2 textureSize, vec3 lvpos) {
float xScale = float(textureSize.y) / float(textureSize.x);
return vec2((float(i) + lvpos.x) * xScale, lvpos.y);
}
vec3 calculateUVZShadow(in vec3 _worldPos, in float _linearDepth, in ivec2 shadowMapSize) {
int i = _linearDepth < cascadeDistances[1] ? 0 : _linearDepth < cascadeDistances[2] ? 1 : _linearDepth < cascadeDistances[3] ? 2 : 3;
if (i >= numCascades) {
return invalidShadowmapUVZ;
}
mat4 shadowMatrix = i == 0 ? shadowMapMatrix[0] : i == 1 ? shadowMapMatrix[1] : i == 2 ? shadowMapMatrix[2] : shadowMapMatrix[3];
vec3 lvpos = lightSpacePosition(_worldPos, shadowMatrix);
if (lvpos.z >= 1.0 || lvpos.x < 0.0 || lvpos.x > 1.0 || lvpos.y < 0.0 || lvpos.y > 1.0) {
return invalidShadowmapUVZ;
}
vec2 uvShadow = cascadeCoordinates(i, shadowMapSize, lvpos);
return vec3(uvShadow, lvpos.z);
}`;function Vi(t){t.code.add(i`float readShadowMapUVZ(vec3 uvzShadow, sampler2DShadow _shadowMap) {
return texture(_shadowMap, uvzShadow);
}`)}let Ai=class extends ze{constructor(e,a){super(e,"sampler2DShadow",0,(o,r)=>o.bindTexture(e,a(r)))}};function ba(t,e){e.receiveShadows&&t.fragment.include(Gi),wa(t,e)}function ya(t,e){e.receiveShadows&&t.fragment.include(Bi),wa(t,e)}function wa(t,e){t.fragment.uniforms.add(new R("lightingGlobalFactor",n=>n.lighting.globalFactor));const{hasShadowHighlights:a,receiveShadows:o,spherical:r}=e;t.include(Wi,e),o&&Hi(t.fragment,a),t.fragment.code.add(i`
    float readShadow(float additionalAmbientScale, vec3 vpos) {
      return ${o?"max(lightingGlobalFactor * (1.0 - additionalAmbientScale), readShadowMap(vpos, linearDepth))":v(r,"lightingGlobalFactor * (1.0 - additionalAmbientScale)","0.0")};
    }
  `)}function Hi(t,e){ki(t,e),Ui(t)}function Ui(t){t.code.add(i`float readShadowMap(const in vec3 _worldPos, float _linearDepth) {
vec3 uvzShadow = calculateUVZShadow(_worldPos, _linearDepth, textureSize(shadowMap, 0));
return readShadowMaps(uvzShadow);
}`)}function ki(t,e){t.include(Vi),t.uniforms.add(Zi()),e&&t.uniforms.add(new O("shadowHighlight",({shadowHighlight:a})=>a==null?void 0:a.getTexture())),t.code.add(i`
    float readShadowMaps(const in vec3 uvzShadow) {
      if (uvzShadow.z < 0.0) {
        return 0.0;
      }

      float shadow1 = readShadowMapUVZ(uvzShadow, shadowMap);
      ${v(e,`float shadow2 = texelFetch(shadowHighlight, ivec2(gl_FragCoord.xy), 0).r;
         return shadow1 > shadow2 ? shadow1 : shadow2;`,"return shadow1;")}
    }
  `)}function Zi(){return new Ai("shadowMap",({shadowMap:t})=>t.getOutput(5)??t.getOutput(7))}function Ma(t,e){e.hasColorTextureTransform?(t.varyings.add("colorUV","vec2"),t.vertex.uniforms.add(new N("colorTextureTransformMatrix",a=>a.colorTextureTransformMatrix??K)).code.add(i`void forwardColorUV(){
colorUV = (colorTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):t.vertex.code.add(i`void forwardColorUV(){}`)}function Ji(t,e){e.hasNormalTextureTransform&&e.textureCoordinateType!==0?(t.varyings.add("normalUV","vec2"),t.vertex.uniforms.add(new N("normalTextureTransformMatrix",a=>a.normalTextureTransformMatrix??K)).code.add(i`void forwardNormalUV(){
normalUV = (normalTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):t.vertex.code.add(i`void forwardNormalUV(){}`)}function Sa(t,e){e.hasEmissionTextureTransform&&e.textureCoordinateType!==0?(t.varyings.add("emissiveUV","vec2"),t.vertex.uniforms.add(new N("emissiveTextureTransformMatrix",a=>a.emissiveTextureTransformMatrix??K)).code.add(i`void forwardEmissiveUV(){
emissiveUV = (emissiveTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):t.vertex.code.add(i`void forwardEmissiveUV(){}`)}function qi(t,e){e.hasOcclusionTextureTransform&&e.textureCoordinateType!==0?(t.varyings.add("occlusionUV","vec2"),t.vertex.uniforms.add(new N("occlusionTextureTransformMatrix",a=>a.occlusionTextureTransformMatrix??K)).code.add(i`void forwardOcclusionUV(){
occlusionUV = (occlusionTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):t.vertex.code.add(i`void forwardOcclusionUV(){}`)}function Yi(t,e){e.hasMetallicRoughnessTextureTransform&&e.textureCoordinateType!==0?(t.varyings.add("metallicRoughnessUV","vec2"),t.vertex.uniforms.add(new N("metallicRoughnessTextureTransformMatrix",a=>a.metallicRoughnessTextureTransformMatrix??K)).code.add(i`void forwardMetallicRoughnessUV(){
metallicRoughnessUV = (metallicRoughnessTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):t.vertex.code.add(i`void forwardMetallicRoughnessUV(){}`)}function Ta(t,e){e.snowCover&&(t.uniforms.add(new R("snowCover",a=>a.snowCover)).code.add(i`float getSnow(vec3 normal, vec3 groundNormal) {
return smoothstep(0.5, 0.55, dot(normal, groundNormal)) * snowCover;
}
float getRealisticTreeSnow(vec3 faceNormal, vec3 shadingNormal, vec3 groundNormal) {
float snow = min(1.0, smoothstep(0.5, 0.55, dot(faceNormal, groundNormal)) +
smoothstep(0.5, 0.55, dot(-faceNormal, groundNormal)) +
smoothstep(0.0, 0.1, dot(shadingNormal, groundNormal)));
return snow * snowCover;
}`),t.code.add(i`vec3 applySnowToMRR(vec3 mrr, float snow) {
return mix(mrr, vec3(0.0, 1.0, 0.04), snow);
}`))}function _a(t){const e=new V,{attributes:a,vertex:o,fragment:r,varyings:n}=e,{output:l,normalType:s,offsetBackfaces:d,spherical:u,snowCover:h,pbrMode:g,textureAlphaPremultiplied:m,instancedDoublePrecision:_,hasVertexColors:b,hasVertexTangents:C,hasColorTexture:I,hasNormalTexture:P,hasNormalTextureTransform:D,hasColorTextureTransform:z}=t;if(U(o,t),a.add("position","vec3"),o.inputs.add("position",()=>"position"),n.add("vpos","vec3",{invariant:!0}),e.include(le,t),e.include(na,t),e.include(qt,t),e.include(Ma,t),!Fe(l))return e.include(la,t),e;e.include(Ji,t),e.include(Sa,t),e.include(qi,t),e.include(Yi,t),Se(o,t),e.include($e,t),e.include(J);const M=s===0||s===1;return M&&d&&e.include(ia),e.include(qo,t),e.include(aa,t),e.include(ra,t),n.add("vPositionLocal","vec3"),e.include(k,t),e.include(sa,t),e.include(Yt,t),o.uniforms.add(new kt("externalColor",y=>y.externalColor,{supportsNaN:!0})),n.add("vcolorExt","vec4"),o.include(Ie),o.include(Zt),e.include(_?ba:ya,t),o.main.add(i`
    forwardVertexColor();

    MaskedColor maskedColor =
      applySymbolColor(applyVVColor(applyInstanceColor(createMaskedFromNaNColor(externalColor))));

    vcolorExt = maskedColor.color;
    forwardColorMixMode(maskedColor.mask);

    vpos = getVertexInLocalOriginSpace();
    vPositionLocal = vpos - view[3].xyz;
    vpos = subtractOrigin(vpos);
    ${v(M,"vNormalWorld = dpNormal(vvLocalNormal(normalModel()));")}
    vpos = addVerticalOffset(vpos, localOrigin);
    ${v(C,"vTangent = dpTransformVertexTangent(tangent);")}
    gl_Position = transformPosition(proj, view, vpos);
    ${v(M&&d,"gl_Position = offsetBackfacingClipPosition(gl_Position, vpos, vNormalWorld, cameraPosition);")}

    forwardTextureCoordinates();
    forwardColorUV();
    forwardNormalUV();
    forwardEmissiveUV();
    forwardOcclusionUV();
    forwardMetallicRoughnessUV();

    if (opacityMixMode != ${i.int(se.ignore)} && vcolorExt.a < ${i.float(at)}) {
      gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
    }
    forwardLinearDepthToReadShadowMap();
  `),r.include(va,t),r.include(st,t),e.include(Y,t),r.include(Z,t),e.include(Jt,t),Se(r,t),r.uniforms.add(o.uniforms.get("localOrigin"),new ue("ambient",y=>y.ambient),new ue("diffuse",y=>y.diffuse),new x("opacity",y=>y.opacity),new x("layerOpacity",y=>y.layerOpacity)),I&&r.uniforms.add(new w("tex",y=>y.texture)),e.include(ga,t),r.include(lt,t),r.include(Qt),e.include(Ri,t),r.include(Ta,t),xt(r),bt(r),me(r),r.main.add(i`
    discardBySlice(vpos);
    ${I?i`
            vec4 texColor = texture(tex, ${z?"colorUV":"vuv0"});
            ${v(m,"texColor.rgb /= texColor.a;")}
            discardOrAdjustAlpha(texColor);`:i`vec4 texColor = vec4(1.0);`}
    shadingParams.viewDirection = normalize(vpos - cameraPosition);
    ${s===2?i`vec3 normal = screenDerivativeNormal(vPositionLocal);`:i`shadingParams.normalView = vNormalWorld;
                vec3 normal = shadingNormal(shadingParams);`}
    applyPBRFactors();
    float ssao = evaluateAmbientOcclusionInverse() * getBakedOcclusion();

    vec3 posWorld = vpos + localOrigin;

    float additionalAmbientScale = additionalDirectedAmbientLight(posWorld);
    float shadow = readShadow(additionalAmbientScale, vpos);

    vec3 matColor = max(ambient, diffuse);
    vec3 albedo = mixExternalColor(${v(b,"vColor.rgb *")} matColor, texColor.rgb, vcolorExt.rgb, colorMixMode);
    float opacity_ = layerOpacity * mixExternalOpacity(${v(b,"vColor.a * ")} opacity, texColor.a, vcolorExt.a, opacityMixMode);

    ${P?`mat3 tangentSpace = computeTangentSpace(${C?"normal":"normal, vpos, vuv0"});
           vec3 shadingNormal = computeTextureNormal(tangentSpace, ${D?"normalUV":"vuv0"});`:"vec3 shadingNormal = normal;"}
    vec3 normalGround = ${u?"normalize(posWorld);":"vec3(0.0, 0.0, 1.0);"}

    ${v(h,i`
          float snow = getSnow(normal, normalGround);
          albedo = mix(albedo, vec3(1), snow);
          shadingNormal = mix(shadingNormal, normal, snow);
          ssao = mix(ssao, 1.0, snow);`)}

    vec3 additionalLight = ssao * mainLightIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;

    ${g===1||g===2?i`
            float additionalAmbientIrradiance = additionalAmbientIrradianceFactor * mainLightIntensity[2];
            ${v(h,"mrr = applySnowToMRR(mrr, snow);")}
            vec3 shadedColor = evaluateSceneLightingPBR(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight, shadingParams.viewDirection, normalGround, mrr, additionalAmbientIrradiance);`:i`vec3 shadedColor = evaluateSceneLighting(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight);`}
    vec4 finalColor = vec4(shadedColor, opacity_);
    outputColorHighlightOLID(applySlice(finalColor, vpos), albedo ${v(h,", snow")});
  `),e}const Xi=Object.freeze(Object.defineProperty({__proto__:null,build:_a},Symbol.toStringTag,{value:"Module"}));let Ki=class extends No{constructor(){super(...arguments),this.isSchematic=!1,this.usePBR=!1,this.mrrFactors=ko,this.hasVertexColors=!1,this.hasSymbolColors=!1,this.doubleSided=!1,this.doubleSidedType="normal",this.cullFace=2,this.instanced=!1,this.instancedFeatureAttribute=!1,this.instancedColor=!1,this.instanceColorEncodesAlphaIgnore=!1,this.emissiveStrengthFromSymbol=0,this.emissiveStrengthKHR=1,this.emissiveSource=1,this.emissiveBaseColor=Qe,this.instancedDoublePrecision=!1,this.normalType=0,this.receiveShadows=!0,this.receiveAmbientOcclusion=!0,this.castShadows=!0,this.ambient=de(.2,.2,.2),this.diffuse=de(.8,.8,.8),this.externalColor=Ua(1,1,1,1),this.colorMixMode="multiply",this.opacity=1,this.layerOpacity=1,this.origin=T(),this.hasSlicePlane=!1,this.offsetTransparentBackfaces=!1,this.vvSize=null,this.vvColor=null,this.vvOpacity=null,this.modelTransformation=null,this.drivenOpacity=!1,this.writeDepth=!0,this.customDepthTest=0,this.textureAlphaMode=0,this.textureAlphaCutoff=at,this.textureAlphaPremultiplied=!1,this.renderOccluded=1,this.testsTransparentRenderOrder=0,this.isDecoration=!1}get hasVVSize(){return!!this.vvSize}get hasVVColor(){return!!this.vvColor}get hasVVOpacity(){return!!this.vvOpacity}},un=class extends Eo{constructor(){super(...arguments),this.origin=T(),this.slicePlaneLocalOrigin=this.origin}},Ce=class extends Q{constructor(t,e){let a=Ue(Ca(e));e.instanced&&e.instancedDoublePrecision&&(a=a.concat(Ue(Uo(e)))),super(t,e,a),this.shader=new L(Xi,()=>B(()=>Promise.resolve().then(()=>vr),void 0)),this.ignoreUnused=!0}_makePipeline(t,e){const{output:a,transparent:o,cullFace:r,customDepthTest:n,hasOccludees:l}=t;return te({blending:o?mo(a,!1,t.emissionDimmingPass):null,culling:er(t)?Fo(r):null,depthTest:ho(a,Qi(n)),depthWrite:uo(t),colorWrite:ae,stencilWrite:l?lo:null,stencilTest:l?e?no:so:null,polygonOffset:co(t)})}initializePipeline(t){return this._occludeePipelineState=this._makePipeline(t,!0),this._makePipeline(t,!1)}getPipeline(t,e,a){return a?this._occludeePipelineState:super.getPipeline(t,e,a)}};function Qi(t){switch(t){case 1:return 515;case 0:case 3:return 513;case 2:return 516}}function er(t){return t.cullFace!==0||!t.hasSlicePlane&&!t.transparent&&!t.doubleSidedMode}function Ca(t){const e=nt().vec3f("position");return t.normalType===1?e.vec2i16("normalCompressed",{glNormalized:!0}):e.vec3f("normal"),t.hasVertexTangents&&e.vec4f("tangent"),t.hasTextures&&e.vec2f16("uv0"),t.hasVertexColors&&e.vec4u8("color",{glNormalized:!0}),t.hasSymbolColors&&e.vec4u8("symbolColor"),!t.instanced&&Lt()&&e.vec4u8("olidColor"),e}Ce=c([j("esri.views.3d.webgl-engine.shaders.DefaultMaterialTechnique")],Ce);class f extends po{constructor(e){super(),this.spherical=e,this.alphaDiscardMode=1,this.doubleSidedMode=0,this.pbrMode=0,this.cullFace=0,this.normalType=0,this.customDepthTest=0,this.emissionSource=0,this.hasVertexColors=!1,this.hasSymbolColors=!1,this.hasVerticalOffset=!1,this.hasColorTexture=!1,this.hasMetallicRoughnessTexture=!1,this.hasOcclusionTexture=!1,this.hasNormalTexture=!1,this.hasScreenSizePerspective=!1,this.hasVertexTangents=!1,this.hasOccludees=!1,this.instanced=!1,this.instancedDoublePrecision=!1,this.hasModelTransformation=!1,this.offsetBackfaces=!1,this.hasVVSize=!1,this.hasVVColor=!1,this.receiveShadows=!1,this.hasShadowHighlights=!1,this.receiveAmbientOcclusion=!1,this.receiveGlobalIllumination=!1,this.textureAlphaPremultiplied=!1,this.instancedFeatureAttribute=!1,this.instancedColor=!1,this.writeDepth=!0,this.snowCover=!1,this.hasColorTextureTransform=!1,this.hasEmissionTextureTransform=!1,this.hasNormalTextureTransform=!1,this.hasOcclusionTextureTransform=!1,this.hasMetallicRoughnessTextureTransform=!1,this.useCustomDTRExponentForWater=!1,this.useFillLights=!0,this.draped=!1}get textureCoordinateType(){return this.hasTextures?1:0}get hasTextures(){return this.hasColorTexture||this.hasNormalTexture||this.hasMetallicRoughnessTexture||this.emissionSource===3||this.hasOcclusionTexture}get hasVVInstancing(){return this.instanced}get discardInvisibleFragments(){return this.transparent}}c([p({count:4})],f.prototype,"alphaDiscardMode",void 0),c([p({count:3})],f.prototype,"doubleSidedMode",void 0),c([p({count:7})],f.prototype,"pbrMode",void 0),c([p({count:3})],f.prototype,"cullFace",void 0),c([p({count:3})],f.prototype,"normalType",void 0),c([p({count:3})],f.prototype,"customDepthTest",void 0),c([p({count:8})],f.prototype,"emissionSource",void 0),c([p()],f.prototype,"hasVertexColors",void 0),c([p()],f.prototype,"hasSymbolColors",void 0),c([p()],f.prototype,"hasVerticalOffset",void 0),c([p()],f.prototype,"hasColorTexture",void 0),c([p()],f.prototype,"hasMetallicRoughnessTexture",void 0),c([p()],f.prototype,"hasOcclusionTexture",void 0),c([p()],f.prototype,"hasNormalTexture",void 0),c([p()],f.prototype,"hasScreenSizePerspective",void 0),c([p()],f.prototype,"hasVertexTangents",void 0),c([p()],f.prototype,"hasOccludees",void 0),c([p()],f.prototype,"instanced",void 0),c([p()],f.prototype,"instancedDoublePrecision",void 0),c([p()],f.prototype,"hasModelTransformation",void 0),c([p()],f.prototype,"offsetBackfaces",void 0),c([p()],f.prototype,"hasVVSize",void 0),c([p()],f.prototype,"hasVVColor",void 0),c([p()],f.prototype,"receiveShadows",void 0),c([p()],f.prototype,"hasShadowHighlights",void 0),c([p()],f.prototype,"receiveAmbientOcclusion",void 0),c([p()],f.prototype,"receiveGlobalIllumination",void 0),c([p()],f.prototype,"textureAlphaPremultiplied",void 0),c([p()],f.prototype,"instancedFeatureAttribute",void 0),c([p()],f.prototype,"instancedColor",void 0),c([p()],f.prototype,"writeDepth",void 0),c([p()],f.prototype,"snowCover",void 0),c([p()],f.prototype,"hasColorTextureTransform",void 0),c([p()],f.prototype,"hasEmissionTextureTransform",void 0),c([p()],f.prototype,"hasNormalTextureTransform",void 0),c([p()],f.prototype,"hasOcclusionTextureTransform",void 0),c([p()],f.prototype,"hasMetallicRoughnessTextureTransform",void 0);function Ia(t){const e=new V,{attributes:a,vertex:o,fragment:r,varyings:n}=e,{output:l,offsetBackfaces:s,pbrMode:d,snowCover:u,spherical:h}=t,g=d===1||d===2;if(U(o,t),a.add("position","vec3"),o.inputs.add("position",()=>"position"),n.add("vpos","vec3",{invariant:!0}),e.include(le,t),e.include(na,t),e.include(qt,t),e.include(Ma,t),!Fe(l))return e.include(la,t),e;e.include(Sa,t),Se(e.vertex,t),e.include($e,t),e.include(J),s&&e.include(ia),n.add("vNormalWorld","vec3"),n.add("localvpos","vec3",{invariant:!0}),e.include(k,t),e.include(sa,t),e.include(ra,t),e.include(Yt,t),o.include(Ie),o.include(Zt),o.uniforms.add(new kt("externalColor",b=>b.externalColor,{supportsNaN:!0})),n.add("vcolorExt","vec4"),e.include(t.instancedDoublePrecision?ba:ya,t),o.include(Ht),o.main.add(i`
    forwardVertexColor();

    MaskedColor maskedColorExt =
      applySymbolColor(applyVVColor(applyInstanceColor(createMaskedFromNaNColor(externalColor))));

    vcolorExt = maskedColorExt.color;
    forwardColorMixMode(maskedColorExt.mask);

    bool alphaCut = opacityMixMode != ${i.int(se.ignore)} && vcolorExt.a < alphaCutoff;
    vpos = getVertexInLocalOriginSpace();

    localvpos = vpos - view[3].xyz;
    vpos = subtractOrigin(vpos);
    vNormalWorld = dpNormal(vvLocalNormal(normalModel()));
    vpos = addVerticalOffset(vpos, localOrigin);
    vec4 basePosition = transformPosition(proj, view, vpos);

    forwardTextureCoordinates();
    forwardColorUV();
    forwardEmissiveUV();
    forwardLinearDepthToReadShadowMap();
    gl_Position = alphaCut ? vec4(1e38, 1e38, 1e38, 1.0) :
    ${v(s,"offsetBackfacingClipPosition(basePosition, vpos, vNormalWorld, cameraPosition);","basePosition;")}
  `);const{hasColorTexture:m,hasColorTextureTransform:_}=t;return r.include(va,t),r.include(st,t),e.include(Y,t),r.include(Z,t),e.include(Jt,t),Se(r,t),he(r),xt(r),bt(r),r.uniforms.add(o.uniforms.get("localOrigin"),o.uniforms.get("view"),new ue("ambient",b=>b.ambient),new ue("diffuse",b=>b.diffuse),new x("opacity",b=>b.opacity),new x("layerOpacity",b=>b.layerOpacity)),m&&r.uniforms.add(new w("tex",b=>b.texture)),e.include(ga,t),r.include(lt,t),r.include(Qt),r.include(Ta,t),me(r),r.main.add(i`
      discardBySlice(vpos);
      vec4 texColor = ${m?`texture(tex, ${_?"colorUV":"vuv0"})`:" vec4(1.0)"};
      ${v(m,`${v(t.textureAlphaPremultiplied,"texColor.rgb /= texColor.a;")}
        discardOrAdjustAlpha(texColor);`)}
      vec3 viewDirection = normalize(vpos - cameraPosition);
      applyPBRFactors();
      float ssao = evaluateAmbientOcclusionInverse();
      ssao *= getBakedOcclusion();

      float additionalAmbientScale = additionalDirectedAmbientLight(vpos + localOrigin);
      vec3 additionalLight = ssao * mainLightIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;
      float shadow = readShadow(additionalAmbientScale, vpos);
      vec3 matColor = max(ambient, diffuse);
      ${t.hasVertexColors?i`vec3 albedo = mixExternalColor(vColor.rgb * matColor, texColor.rgb, vcolorExt.rgb, colorMixMode);
             float opacity_ = layerOpacity * mixExternalOpacity(vColor.a * opacity, texColor.a, vcolorExt.a, opacityMixMode);`:i`vec3 albedo = mixExternalColor(matColor, texColor.rgb, vcolorExt.rgb, colorMixMode);
             float opacity_ = layerOpacity * mixExternalOpacity(opacity, texColor.a, vcolorExt.a, opacityMixMode);`}

      vec3 shadingNormal = normalize(vNormalWorld);
      vec3 groundNormal = ${h?"normalize(vpos + localOrigin)":"vec3(0.0, 0.0, 1.0)"};

      ${v(u,`vec3 faceNormal = screenDerivativeNormal(vpos);
         float snow = getRealisticTreeSnow(faceNormal, shadingNormal, groundNormal);
         albedo = mix(albedo, vec3(1), snow);`)}

      ${i`albedo *= 1.2;
             vec3 viewForward = vec3(view[0][2], view[1][2], view[2][2]);
             float alignmentLightView = clamp(dot(viewForward, -mainLightDirection), 0.0, 1.0);
             float transmittance = 1.0 - clamp(dot(viewForward, shadingNormal), 0.0, 1.0);
             float treeRadialFalloff = vColor.r;
             float backLightFactor = 0.5 * treeRadialFalloff * alignmentLightView * transmittance * (1.0 - shadow);
             additionalLight += backLightFactor * mainLightIntensity;`}

      ${g?i`float additionalAmbientIrradiance = additionalAmbientIrradianceFactor * mainLightIntensity[2];
            ${v(u,"mrr = applySnowToMRR(mrr, snow);")}
            vec3 shadedColor = evaluateSceneLightingPBR(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight, viewDirection, groundNormal, mrr, additionalAmbientIrradiance);`:i`vec3 shadedColor = evaluateSceneLighting(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight);`}
      vec4 finalColor = vec4(shadedColor, opacity_);
      outputColorHighlightOLID(applySlice(finalColor, vpos), albedo ${v(u,", 1.0")});`),e}const tr=Object.freeze(Object.defineProperty({__proto__:null,build:Ia},Symbol.toStringTag,{value:"Module"}));let Ke=class extends Ce{constructor(){super(...arguments),this.shader=new L(tr,()=>B(()=>Promise.resolve().then(()=>gr),void 0))}};Ke=c([j("esri.views.3d.webgl-engine.shaders.RealisticTreeTechnique")],Ke);class ar extends ta{constructor(){super(...arguments),this.receiveShadows=!0}}function or(t,e){var a;return t.receiveShadows&&((a=e.shadowHighlight)==null?void 0:a.getTexture())!=null}c([p()],ar.prototype,"receiveShadows",void 0);class pn extends fo{constructor(e,a){super(e,rr),this.materialType="default",this.supportsEdges=!0,this.intersectDraped=void 0,this.produces=new Map([[2,o=>Ee(o)&&!this.transparent],[4,o=>Ee(o)&&this.transparent&&this.parameters.writeDepth],[8,o=>Ee(o)&&this.transparent&&!this.parameters.writeDepth]]),this._layout=Ca(this.parameters),this._configuration=new f(a.spherical)}isVisibleForOutput(e){return e!==5&&e!==7&&e!==6||this.parameters.castShadows}get visible(){const{layerOpacity:e,colorMixMode:a,opacity:o,externalColor:r}=this.parameters;return e*(a==="replace"?1:o)*(a==="ignore"||isNaN(r[3])?1:r[3])>=at}get _hasEmissiveBase(){return!!this.parameters.emissiveTextureId||!Et(this.parameters.emissiveBaseColor,Qe)}get emissions(){return this.parameters.emissiveStrength>0&&(this.parameters.emissiveSource===0&&this._hasEmissiveBase||this.parameters.emissiveSource===1)?this.transparent?2:1:0}updateConfiguration(e){super.updateConfiguration(e);const{parameters:a,_configuration:o}=this;o.hasNormalTexture=a.hasNormalTexture,o.hasColorTexture=a.hasColorTexture,o.hasMetallicRoughnessTexture=a.hasMetallicRoughnessTexture,o.hasOcclusionTexture=a.hasOcclusionTexture;const{treeRendering:r,doubleSided:n,doubleSidedType:l}=a;o.hasVertexTangents=!r&&a.hasVertexTangents,o.instanced=a.instanced,o.instancedDoublePrecision=a.instancedDoublePrecision,o.hasVVColor=!!a.vvColor,o.hasVVSize=!!a.vvSize,o.hasVerticalOffset=a.verticalOffset!=null,o.hasScreenSizePerspective=a.screenSizePerspective!=null,o.hasSlicePlane=a.hasSlicePlane,o.alphaDiscardMode=a.textureAlphaMode,o.normalType=r?0:a.normalType,o.transparent=this.transparent,o.enableOITOffset=e.enableOITOffset,o.writeDepth=a.writeDepth,o.customDepthTest=a.customDepthTest??0,o.hasOccludees=e.hasOccludees,o.cullFace=a.hasSlicePlane?0:a.cullFace,o.hasModelTransformation=!r&&a.modelTransformation!=null,o.hasVertexColors=a.hasVertexColors,o.hasSymbolColors=a.hasSymbolColors,o.doubleSidedMode=r?2:n&&l==="normal"?1:n&&l==="winding-order"?2:0,o.instancedFeatureAttribute=a.instancedFeatureAttribute,o.instancedColor=a.instancedColor,Fe(e.output)?(o.receiveShadows=a.receiveShadows,o.hasShadowHighlights=or(o,e),o.receiveAmbientOcclusion=a.receiveAmbientOcclusion&&e.ssao!=null,o.receiveGlobalIllumination=a.receiveAmbientOcclusion&&e.globalIlluminationEnabled):o.receiveShadows=o.hasShadowHighlights=o.receiveAmbientOcclusion=!1,o.textureAlphaPremultiplied=!!a.textureAlphaPremultiplied,o.pbrMode=a.usePBR?a.isSchematic?2:1:0,o.emissionSource=a.emissionSource,o.offsetBackfaces=!(!this.transparent||!a.offsetTransparentBackfaces),o.snowCover=e.snowCover>0,o.hasColorTextureTransform=!!a.colorTextureTransformMatrix,o.hasNormalTextureTransform=!!a.normalTextureTransformMatrix,o.hasEmissionTextureTransform=!!a.emissiveTextureTransformMatrix,o.hasOcclusionTextureTransform=!!a.occlusionTextureTransformMatrix,o.hasMetallicRoughnessTextureTransform=!!a.metallicRoughnessTextureTransformMatrix}intersect(e,a,o,r,n,l){if(this.parameters.verticalOffset!=null){const s=o.camera;ce(He,a[12],a[13],a[14]);let d=null;switch(o.viewingMode){case 1:d=Za(Rt,He);break;case 2:d=ka(Rt,cr)}const u=Ne(dr,He,s.eye),h=Ja(u),g=St(u,u,1/h);let m=null;this.parameters.screenSizePerspective&&(m=qa(d,g));const _=vo(s,h,this.parameters.verticalOffset,m??0,this.parameters.screenSizePerspective,null);St(d,d,_),Ya(Ae,d,o.transform.inverseRotation),r=Ne(sr,r,Ae),n=Ne(lr,n,Ae)}l=wo(l,this._configuration,r,n),Mo(e,o,r,n,Io(o.verticalOffset),l)}createGLMaterial(e){return new ir(e)}createBufferWriter(){return new So(this._layout)}get transparent(){return nr(this.parameters)}}class ir extends bo{constructor(e){super({...e,...e.material.parameters})}beginSlot(e){this._material.setParameters({receiveShadows:e.shadowMap.enabled});const a=this._material.parameters;this.updateTexture(a.textureId);const o=e.camera.viewInverseTransposeMatrix;return ce(a.origin,o[3],o[7],o[11]),this._material.setParameters(this.textureBindParameters),this.getTechnique(a.treeRendering?Ke:Ce,e)}}class rr extends Ki{constructor(){super(...arguments),this.treeRendering=!1,this.useIndexing=!1,this.hasVertexTangents=!1}get hasNormalTexture(){return!this.treeRendering&&!!this.normalTextureId}get hasColorTexture(){return!!this.textureId}get hasMetallicRoughnessTexture(){return!this.treeRendering&&!!this.metallicRoughnessTextureId}get hasOcclusionTexture(){return!this.treeRendering&&!!this.occlusionTextureId}get emissiveStrength(){return this.emissiveStrengthFromSymbol*this.emissiveStrengthKHR}get emissionSource(){return this.emissiveTextureId!=null&&this.emissiveSource===0?3:this.emissiveSource===0?2:1}get hasTextures(){return this.hasColorTexture||this.hasNormalTexture||this.hasMetallicRoughnessTexture||this.emissionSource===3||this.hasOcclusionTexture}}function nr(t){const{drivenOpacity:e,opacity:a,externalColor:o,layerOpacity:r,texture:n,textureId:l,textureAlphaMode:s,colorMixMode:d}=t,u=o[3];return e||a<1&&d!=="replace"||u<1&&d!=="ignore"||r<1||(n!=null||l!=null)&&s!==1&&s!==2&&d!=="replace"}const sr=T(),lr=T(),cr=Xa(0,0,1),Rt=T(),Ae=T(),He=T(),dr=T(),ur=Object.freeze(Object.defineProperty({__proto__:null,build:da},Symbol.toStringTag,{value:"Module"})),hr=Object.freeze(Object.defineProperty({__proto__:null,build:ca,getRadius:je},Symbol.toStringTag,{value:"Module"})),mr=Object.freeze(Object.defineProperty({__proto__:null,GlobalIlluminationBlurDrawParameters:vt,build:ma},Symbol.toStringTag,{value:"Module"})),pr=Object.freeze(Object.defineProperty({__proto__:null,GlobalIlluminationPassParameters:ft,build:ua,defaultColorBleedWeight:dt,defaultRayMarchMaxReach:Oe,defaultRayMarchMaxReachEmissionWeight:pt,defaultRayMarchMaxSteps:Re,defaultRayMarchMinReach:ht,defaultRayMarchMinReachEmissionWeight:mt,defaultRayMarchWorldReach:ut},Symbol.toStringTag,{value:"Module"})),fr=Object.freeze(Object.defineProperty({__proto__:null,GlobalIlluminationUpscaleDrawParameters:gt,build:fa},Symbol.toStringTag,{value:"Module"})),vr=Object.freeze(Object.defineProperty({__proto__:null,build:_a},Symbol.toStringTag,{value:"Module"})),gr=Object.freeze(Object.defineProperty({__proto__:null,build:Ia},Symbol.toStringTag,{value:"Module"}));export{ie as F,er as M,pn as P,un as V,Uo as a,Gr as b,ia as c,Zo as d,st as e,xt as f,bt as g,Ta as h,Ar as i,me as j,or as k,he as l,ya as m,ga as n,ko as o,Kr as p,di as q,Ri as r,Oi as s,Lr as t,Vr as u,va as v,Xo as w,Dt as x,ni as y};
