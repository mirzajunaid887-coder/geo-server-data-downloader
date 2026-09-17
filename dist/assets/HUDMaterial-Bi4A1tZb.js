const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/HUDMaterial.glsl-DjdQuIvo.js","assets/index-o98Aja7I.js","assets/index-C_3wDn83.css","assets/oitResolution.glsl-DnN_jdFk.js","assets/NoParameters-DB-WZ6gy.js","assets/ShaderBuilder-C5cjJO7J.js","assets/TriangleTechniqueConfiguration-BbVmpokX.js","assets/frustum-XlDNbFbF.js","assets/ray-Dby8PgrY.js","assets/vectorStacks-BqA9dYSo.js","assets/quatf64-aQ5IuZRd.js","assets/plane-BPueD4Ud.js","assets/sphere-CeobQ9KS.js","assets/VertexAttributeLocations-Bwhrszst.js","assets/VertexElementDescriptor-CVzmm3VW.js","assets/renderState-eKYY9aZU.js","assets/Indices-BrDmB24O.js","assets/Attribute-DGhdp5lO.js","assets/BufferView-BjlVprna.js","assets/lineSegment-BmCjyw0h.js","assets/RibbonLine.glsl-CX4Q8nV-.js","assets/computeTranslationToOriginAndRotation-Dsw951Cc.js","assets/localRotationUtils-BGnkIcgC.js","assets/WebGLLayer-BhtAexHZ.js","assets/mathUtils-bklKxcut.js","assets/Octree-rfYTejJf.js","assets/InterleavedLayout-seWAjsA1.js","assets/SceneLighting-C8zPZjrj.js","assets/projectVectorToVector-BcWF-pZ9.js","assets/projectPointToVector-BpfBRTiK.js","assets/dehydratedPoint-Z5ONvFg_.js","assets/orientedBoundingBox-wVCx_nPW.js","assets/quat-DogCw_rr.js","assets/RenderingContext-BIPg9Vgu.js","assets/ProgramCache-BJ6_kEnW.js","assets/VertexArrayObject-D65Ry95E.js","assets/VertexBuffer-DKObKeib.js"])))=>i.map(i=>d[i]);
import{a8 as ft,as as dt,z as ut,er as pt,rn as ht,bY as vt,ai as h,ak as ue,_ as Me,aj as ee,eh as mt,pH as gt,ro as xt,gP as pe,kk as he,nR as Ot,hQ as Ct,fO as Oe,ex as k,f_ as X,aP as Ce,eu as St,ev as N,fy as Se,iA as be,iZ as te,aG as bt,a$ as j,eC as Z,gT as wt,ds as yt,g2 as zt,cI as Pt,aB as U,oz as we,o7 as $t,qX as Be,ii as ve,aZ as At,aM as Vt,dP as _t,b0 as Ft,aH as Dt,aD as Et}from"./index-o98Aja7I.js";import{u as Rt}from"./hydratedFeatures-E0KpbraW.js";import{i as Ut,Q as Tt}from"./BufferView-BjlVprna.js";import{f as It,F as jt,K as G,L as ye,M as Mt,N as He,O as K,i as Le,t as qe,S as Bt,u as Ht,d as Lt,b as qt,c as Gt,e as ae,P as kt,x as ce,Q as ze,R as Nt,g as Wt,k as Yt,n as Xt,T as Qt,U as Zt,s as Kt,V as W,W as Jt,X as ea,Y as ta,w as re,Z as aa,_ as ra,$ as sa,a0 as oa,a1 as ia,a2 as Pe,a3 as $e,a4 as na,a5 as se,a6 as la,a7 as ca}from"./TriangleTechniqueConfiguration-BbVmpokX.js";import{d as fa,r as da,a as ua,l as pa,b as ha}from"./BooleanBindUniform-Ozbc95Th.js";import{s as Ge,e as ke,i as Ne,o as va,a as We,u as ma,b as Y,c as oe,t as ga}from"./SceneLighting-C8zPZjrj.js";import{t as l,n as D,i as x}from"./oitResolution.glsl-DnN_jdFk.js";import{s as xa}from"./RibbonLine.glsl-CX4Q8nV-.js";import{c as Oa}from"./NoParameters-DB-WZ6gy.js";import{s as Ye}from"./ShaderBuilder-C5cjJO7J.js";import{O as Xe,g as Qe,u as Ca}from"./renderState-eKYY9aZU.js";import{Q as Ze,t as Ae}from"./InterleavedLayout-seWAjsA1.js";const Sa=()=>ut.getLogger("esri.views.3d.layers.graphics.featureExpressionInfoUtils");function ba(t){return{cachedResult:t.cachedResult,arcade:t.arcade?{func:t.arcade.func,context:t.arcade.modules.arcadeUtils.createExecContext(null,{sr:t.arcade.context.spatialReference}),modules:t.arcade.modules}:null}}async function rr(t,e,r,a){const s=t==null?void 0:t.expression;if(typeof s!="string")return null;const i=Pa(s);if(i!=null)return{cachedResult:i};const u=await ft();dt(r);const o=u.arcadeUtils,p=o.createSyntaxTree(s);if(!p)return null;if(o.dependsOnView(p))return a!=null&&a.error("Expressions containing '$view' are not supported on ElevationInfo"),{cachedResult:0};const c=o.createFunction(p);return c?{arcade:{modules:u,func:c,context:o.createExecContext(null,{sr:e})}}:null}function wa(t,e,r){return t.arcadeUtils.createFeature(e.attributes,e.geometry,r)}function ya(t,e){if(t!=null&&!Ke(t)){if(!e||!t.arcade)return void Sa().errorOncePerTick("Arcade support required but not provided");const r=e;r._geometry&&(r._geometry=Rt(r._geometry)),t.arcade.modules.arcadeUtils.updateExecContext(t.arcade.context,e)}}function za(t){if(t!=null){if(Ke(t))return t.cachedResult;const e=t.arcade;let r=e==null?void 0:e.modules.arcadeUtils.executeFunction(e.func,e.context);return typeof r!="number"&&(t.cachedResult=0,r=0),r}return 0}function sr(t,e=!1){let r=t==null?void 0:t.featureExpressionInfo;const a=r==null?void 0:r.expression;return e||a==="0"||(r=null),r??null}const or={cachedResult:0};function Ke(t){return t.cachedResult!=null}function Pa(t){return t==="0"?0:null}class Je{constructor(){this._meterUnitOffset=0,this._renderUnitOffset=0,this._unit="meters",this._metersPerElevationInfoUnit=1,this._featureExpressionInfoContext=null,this.mode=null,this.centerInElevationSR=null}get featureExpressionInfoContext(){return this._featureExpressionInfoContext}get meterUnitOffset(){return this._meterUnitOffset}get unit(){return this._unit}set unit(e){this._unit=e,this._metersPerElevationInfoUnit=pt(e)}get requiresSampledElevationInfo(){return this.mode!=="absolute-height"}reset(){this.mode=null,this._meterUnitOffset=0,this._renderUnitOffset=0,this._featureExpressionInfoContext=null,this.unit="meters"}set offsetMeters(e){this._meterUnitOffset=e,this._renderUnitOffset=0}set offsetElevationInfoUnits(e){this._meterUnitOffset=e*this._metersPerElevationInfoUnit,this._renderUnitOffset=0}addOffsetRenderUnits(e){this._renderUnitOffset+=e}geometryZWithOffset(e,r){const a=this.calculateOffsetRenderUnits(r);return this.featureExpressionInfoContext!=null?a:e+a}calculateOffsetRenderUnits(e){let r=this._meterUnitOffset;const a=this.featureExpressionInfoContext;return a!=null&&(r+=za(a)*this._metersPerElevationInfoUnit),r/e.unitInMeters+this._renderUnitOffset}setFromElevationInfo(e){this.mode=e.mode,this.unit=ht(e.unit)?e.unit:"meters",this.offsetElevationInfoUnits=e.offset??0}setFeatureExpressionInfoContext(e){this._featureExpressionInfoContext=e}updateFeatureExpressionInfoContextForGraphic(e,r,a){e.arcade?(this._featureExpressionInfoContext=ba(e),this.updateFeatureExpressionFeature(r,a)):this._featureExpressionInfoContext=e}updateFeatureExpressionFeature(e,r){const a=this.featureExpressionInfoContext;a!=null&&a.arcade&&(a.cachedResult=void 0,ya(this._featureExpressionInfoContext,e.geometry?wa(a.arcade.modules,e,r):null))}static fromElevationInfo(e){const r=new Je;return e!=null&&r.setFromElevationInfo(e),r}}const et=.5;function $a(t,e){const r=t.vertex;t.include(Ge),t.attributes.add("position","vec3"),t.vertex.inputs.add("position",()=>"position"),t.attributes.add("normal","vec3"),e.hasVertexCenterOffset?t.attributes.add("centerOffset","vec3"):r.constants.add("centerOffset","vec3",[0,0,0]),t.attributes.add("groundDistance","float"),It(r,e),jt(r,e),r.uniforms.add(new ke("viewport",a=>a.camera.fullViewport),new G("polygonOffset",a=>a.shaderPolygonOffset),new ye("aboveGround",a=>a.camera.aboveGround?1:-1)),e.hasVerticalOffset&&fa(r),r.code.add(l`struct ProjectHUDAux {
vec3 posModel;
vec3 posView;
vec3 vnormal;
float distanceToCamera;
float absCosAngle;
};`),r.code.add(l`float applyHUDViewDependentPolygonOffset(float pointGroundDistance, float absCosAngle, inout vec3 posView) {
float pointGroundSign = sign(pointGroundDistance);
if (pointGroundSign == 0.0) {
pointGroundSign = aboveGround;
}
float groundRelative = aboveGround * pointGroundSign;
if (polygonOffset > .0) {
float cosAlpha = clamp(absCosAngle, 0.01, 1.0);
float tanAlpha = sqrt(1.0 - cosAlpha * cosAlpha) / cosAlpha;
float factor = (1.0 - tanAlpha / viewport[2]);
if (groundRelative > 0.0) {
posView *= factor;
}
else {
posView /= factor;
}
}
return groundRelative;
}`),e.draped&&!e.hasVerticalOffset||Mt(r),e.draped||(r.uniforms.add(new ye("perDistancePixelRatio",a=>Math.tan(a.camera.fovY/2)/(a.camera.fullViewport[2]/2))),r.code.add(l`
      void applyHUDVerticalGroundOffset(vec3 normalModel, inout vec3 posModel, inout vec3 posView) {
        float distanceToCamera = length(posView);

        // Compute offset in world units for a half pixel shift
        float pixelOffset = distanceToCamera * perDistancePixelRatio * ${l.float(et)};

        // Apply offset along normal in the direction away from the ground surface
        vec3 modelOffset = normalModel * aboveGround * pixelOffset;

        // Apply the same offset also on the view space position
        vec3 viewOffset = (viewNormal * vec4(modelOffset, 1.0)).xyz;

        posModel += modelOffset;
        posView += viewOffset;
      }
    `)),e.screenCenterOffsetUnitsEnabled&&He(r),e.hasScreenSizePerspective&&Ne(r),r.code.add(l`
    vec4 projectPositionHUD(out ProjectHUDAux aux) {
      float pointGroundDistance = groundDistance;
      aux.posModel = position;
      aux.posView = (view * vec4(aux.posModel, 1.0)).xyz;
      aux.vnormal = normal;
      ${e.draped?"":"applyHUDVerticalGroundOffset(aux.vnormal, aux.posModel, aux.posView);"}

      // Screen sized offset in world space, used for example for line callouts
      // Note: keep this implementation in sync with the CPU implementation, see
      //   - MaterialUtil.verticalOffsetAtDistance
      //   - HUDMaterial.applyVerticalOffsetTransformation

      aux.distanceToCamera = length(aux.posView);

      vec3 viewDirObjSpace = normalize(cameraPosition - aux.posModel);
      float cosAngle = dot(aux.vnormal, viewDirObjSpace);

      aux.absCosAngle = abs(cosAngle);

      ${e.hasScreenSizePerspective&&(e.hasVerticalOffset||e.screenCenterOffsetUnitsEnabled)?"vec3 perspectiveFactor = screenSizePerspectiveScaleFactor(aux.absCosAngle, aux.distanceToCamera, screenSizePerspectiveAlignment);":""}

      ${e.hasVerticalOffset?e.hasScreenSizePerspective?"float verticalOffsetScreenHeight = applyScreenSizePerspectiveScaleFactorFloat(verticalOffset.x, perspectiveFactor);":"float verticalOffsetScreenHeight = verticalOffset.x;":""}

      ${e.hasVerticalOffset?l`
            float worldOffset = clamp(verticalOffsetScreenHeight * verticalOffset.y * aux.distanceToCamera, verticalOffset.z, verticalOffset.w);
            vec3 modelOffset = aux.vnormal * worldOffset;
            aux.posModel += modelOffset;
            vec3 viewOffset = (viewNormal * vec4(modelOffset, 1.0)).xyz;
            aux.posView += viewOffset;
            // Since we elevate the object, we need to take that into account
            // in the distance to ground
            pointGroundDistance += worldOffset;`:""}

      float groundRelative = applyHUDViewDependentPolygonOffset(pointGroundDistance, aux.absCosAngle, aux.posView);

      ${e.screenCenterOffsetUnitsEnabled?"":l`
            // Apply x/y in view space, but z in screen space (i.e. along posView direction)
            aux.posView += vec3(centerOffset.x, centerOffset.y, 0.0);

            // Same material all have same z != 0.0 condition so should not lead to
            // branch fragmentation and will save a normalization if it's not needed
            if (centerOffset.z != 0.0) {
              aux.posView -= normalize(aux.posView) * centerOffset.z;
            }
          `}

      vec4 posProj = proj * vec4(aux.posView, 1.0);

      ${e.screenCenterOffsetUnitsEnabled?e.hasScreenSizePerspective?"float centerOffsetY = applyScreenSizePerspectiveScaleFactorFloat(centerOffset.y, perspectiveFactor);":"float centerOffsetY = centerOffset.y;":""}

      ${e.screenCenterOffsetUnitsEnabled?"posProj.xy += vec2(centerOffset.x, centerOffsetY) * pixelRatio * 2.0 / viewport.zw * posProj.w;":""}

      // constant part of polygon offset emulation
      posProj.z -= groundRelative * polygonOffset * posProj.w;
      return posProj;
    }
  `)}function Aa(t){t.uniforms.add(new da("alignPixelEnabled",e=>e.alignPixelEnabled)),t.code.add(l`vec4 alignToPixelCenter(vec4 clipCoord, vec2 widthHeight) {
if (!alignPixelEnabled)
return clipCoord;
vec2 xy = vec2(0.500123) + 0.5 * clipCoord.xy / clipCoord.w;
vec2 pixelSz = vec2(1.0) / widthHeight;
vec2 ij = (floor(xy * widthHeight) + vec2(0.5)) * pixelSz;
vec2 result = (ij * 2.0 - vec2(1.0)) * clipCoord.w;
return vec4(result, clipCoord.zw);
}`),t.code.add(l`vec4 alignToPixelOrigin(vec4 clipCoord, vec2 widthHeight) {
if (!alignPixelEnabled)
return clipCoord;
vec2 xy = vec2(0.5) + 0.5 * clipCoord.xy / clipCoord.w;
vec2 pixelSz = vec2(1.0) / widthHeight;
vec2 ij = floor((xy + 0.5 * pixelSz) * widthHeight) * pixelSz;
vec2 result = (ij * 2.0 - vec2(1.0)) * clipCoord.w;
return vec4(result, clipCoord.zw);
}`)}class tt extends Oa{constructor(){super(...arguments),this.effect=0,this.fadeFactor=vt(1)}}function Va(){const t=new Ye;return t.include(va),t.outputs.add("fragColor","vec4",0),t.fragment.uniforms.add(new K("colorTexture",e=>e.color),new K("focusArea",e=>e.focusArea),new We("focusAreaEffectMode",e=>e.effect),new G("fadeFactor",e=>e.fadeFactor.value)).main.add(l`
      float mask = texture( focusArea, uv, 0.0 ).r;
      vec4 color = texture( colorTexture, uv, 0.0 );
      vec4 colorDeSaturate = vec4(color.r * 0.25 + color.g * 0.5 + color.b * 0.25);
      if (focusAreaEffectMode == ${l.int(0)}) {
        fragColor = mask > 0.0 ? color : mix(color, 0.55 * colorDeSaturate + 0.45, fadeFactor);
      } else {
        fragColor = mask > 0.0 ? color : mix(color, 0.33 * color, fadeFactor);
      }
  `),t}const _a=Object.freeze(Object.defineProperty({__proto__:null,FocusAreaColorPassParameters:tt,build:Va},Symbol.toStringTag,{value:"Module"}));let fe=class extends Le{constructor(){super(...arguments),this.shader=new qe(_a,()=>Me(()=>import("./HUDMaterial.glsl-DjdQuIvo.js").then(t=>t.F),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36]))),this.ignoreUnused=!0}initializePipeline(){return Xe({colorWrite:Qe})}};fe=h([ue("esri.views.3d.webgl-engine.effects.focusArea.FocusAreaColorTechnique")],fe);let L=class extends ma{constructor(t){super({...t,view:t.focusAreasView.view}),this.consumes={required:[Y.FOCUSAREA_COLOR,Y.FOCUSAREA]},this.produces=Y.FOCUSAREA_COLOR,this._fadeDirection=0,this._passParameters=new tt}fadeOut(t){this.removeAllHandles(),this._startTime=null,this._fadeDirection=1,this.addHandles(mt(()=>this._passParameters.fadeFactor.value,e=>{e===0&&(this.removeAllHandles(),t())})),this.requestRender(2)}render(t){var C,F;const e=t.find(({name:$})=>$===this.produces),r=this.techniques.getCompiled(fe);if(!r)return this.requestRender(1),e;const a=this.focusAreasView.style,s=this.bindParameters,i=s.camera,u=i.fullViewport[2],o=i.fullViewport[3];this._startTime??(this._startTime=(C=this.view.stage)==null?void 0:C.renderer.renderContext.time);const p=this.view.qualitySettings.fadeDuration,c=p>0?Math.min(p,((F=this.view.stage)==null?void 0:F.renderer.renderContext.time)-this._startTime)/p:1,v=t.find(({name:$})=>$===Y.FOCUSAREA),f=this.fboCache.acquire(u,o,this.produces),m=this.renderingContext;return m.bindFramebuffer(f.fbo),this._passParameters.color=e.getTexture(),this._passParameters.focusArea=v.getTexture(),this._passParameters.effect=at[a],this._passParameters.fadeFactor.value=this._fadeDirection===0?c:1-c,m.bindTechnique(r,s,this._passParameters),m.screen.draw(),f.attachDepth(e.getAttachment(gt)),c<1&&this.requestRender(2),f}};h([ee()],L.prototype,"consumes",void 0),h([ee()],L.prototype,"produces",void 0),h([ee({constructOnly:!0})],L.prototype,"focusAreasView",void 0),L=h([ue("esri.views.3d.webgl-engine.effects.focusArea.FocusAreaColorNode")],L);const at={bright:0,dark:1},Fa=t=>t?at[t]:0;function Da(t){const e=new Ye;e.include($a,t),e.vertex.include(Bt,t);const{output:r,hasOcclusionTexture:a,signedDistanceFieldEnabled:s,pixelSnappingEnabled:i,hasEmission:u,hasScreenSizePerspective:o,debugDrawLabelBorder:p,hasVVSize:c,hasVVColor:v,hasRotation:f,occludedFragmentFade:m,sampleSignedDistanceFieldTexelCenter:C,hasVertexColor:F,hasVertexSize:$,hasVertexRotation:V,hasVertexUVi:b}=t;e.include(Ge),e.include(Ht,t),e.include(Lt,t),e.include(qt,t);const{vertex:S,fragment:d}=e;d.include(Gt),d.code.add(l`
    vec4 applyFocusAreaStyle(vec4 color, int style) {
      const float factor = 0.46;
      const float factorBright = 0.32;

      if (style == ${l.int(0)}) {
        float luma = (color.r + color.g + color.b) / 3.0;
        float bright = luma * (1.0 - 0.6 * factorBright) + 0.6 * factorBright * color.a;
        float brightScaled = bright * factorBright;
        return vec4(brightScaled, brightScaled, brightScaled, color.a * factorBright);
      }

      float darkScaled = factor * factor;
      return vec4(color.rgb * darkScaled, color.a * factor);
    }
  `),e.varyings.add("vcolor","vec4"),e.varyings.add("vtc","vec2"),e.varyings.add("vsize","vec2");const O=r===10;S.uniforms.add(new ke("viewport",n=>n.camera.fullViewport),new oe("screenOffset",(n,z)=>he(Q,2*n.screenOffset[0]*z.camera.pixelRatio,2*n.screenOffset[1]*z.camera.pixelRatio)),new oe("anchorPosition",n=>J(n)),new ae("materialColor",({color:n})=>n),new G("materialRotation",n=>n.rotation),new oe("materialSize",n=>n.size),new K("tex",n=>n.texture)),He(S),s&&(S.uniforms.add(new ae("outlineColor",n=>n.outlineColor)),d.uniforms.add(new ae("outlineColor",n=>Ve(n)?n.outlineColor:Ot),new G("outlineSize",n=>Ve(n)?n.outlineSize:0))),i&&S.include(Aa),o&&(ga(S),Ne(S)),p&&e.varyings.add("debugBorderCoords","vec4"),e.attributes.add("uv0","vec2"),b&&e.attributes.add("uvi","vec4"),F&&e.attributes.add("color","vec4"),$&&e.attributes.add("size","vec2"),V&&e.attributes.add("rotation","float"),(c||v)&&e.attributes.add("featureAttribute","vec4"),S.main.add(l`
    ProjectHUDAux projectAux;
    vec4 posProj = projectPositionHUD(projectAux);
    forwardObjectAndLayerIdColor();

    if (rejectBySlice(projectAux.posModel)) {
      gl_Position = ${xa};
      return;
    }

    vec2 vertexSize = materialSize${D($," * size")};
    vec2 inputSize;
    ${D(o,l`
        inputSize = screenSizePerspectiveScaleVec2(vertexSize, projectAux.absCosAngle, projectAux.distanceToCamera, screenSizePerspective);
        vec2 screenOffsetScaled = screenSizePerspectiveScaleVec2(screenOffset, projectAux.absCosAngle, projectAux.distanceToCamera, screenSizePerspectiveAlignment);`,l`
        inputSize = vertexSize;
        vec2 screenOffsetScaled = screenOffset;`)}
    ${D(c,l`inputSize *= vvScale(featureAttribute).xx;`)}

    vec2 combinedSize = inputSize * pixelRatio;
    vec4 quadOffset = vec4(0.0);
  `);const _=l`
  ${D(b,l`
    vec2 texSize = vec2(textureSize(tex, 0));
    vec2 uv = mix(uvi.xy, uvi.zw, bvec2(uv0)) / texSize;
    `,l`
    vec2 uv = mix(vec2(0.), vec2(1.), bvec2(uv0));
    `)}

    quadOffset.xy = (uv0 - anchorPosition) * 2.0 * combinedSize;

    ${D(f,l`
        float angle = radians(materialRotation${D(V," + rotation")});
        float cosAngle = cos(angle);
        float sinAngle = sin(angle);
        mat2 rotate = mat2(cosAngle, -sinAngle, sinAngle,  cosAngle);

        quadOffset.xy = rotate * quadOffset.xy;
      `)}

    quadOffset.xy = (quadOffset.xy + screenOffsetScaled) / viewport.zw * posProj.w;
  `,E=i?s?l`posProj = alignToPixelOrigin(posProj, viewport.zw) + quadOffset;`:l`posProj += quadOffset;
if (inputSize.x == vertexSize.x) {
posProj = alignToPixelOrigin(posProj, viewport.zw);
}`:l`posProj += quadOffset;`;S.include(kt),S.main.add(l`
    ${_}
    ${v?"vcolor = interpolateVVColor(featureAttribute.y) * materialColor;":F?"vcolor = color * materialColor;":"vcolor = materialColor;"}

    ${D(r===11,l`vcolor.a = 1.0;`)}

    bool alphaDiscard = vcolor.a < alphaCutoff;
    ${D(s,"alphaDiscard = alphaDiscard && outlineColor.a < alphaCutoff;")}
    if (alphaDiscard) {
      // "early discard" if both symbol color (= fill) and outline color (if applicable) are transparent
      gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
      return;
    } else {
      ${E}
      gl_Position = posProj;
    }

    vtc = uv;

    ${D(p,l`debugBorderCoords = vec4(uv0, 1.5 / combinedSize);`)}
    vsize = inputSize;
  `);const R=ce(r)&&t.hasFocusAreaStyle&&!t.draped;switch(d.uniforms.add(new K("tex",n=>n.texture)),R&&d.uniforms.add(new We("focusAreaStyle",n=>Fa(n.focusAreaStyle))),m&&!O&&(d.include(ua),d.uniforms.add(new ze("depthMap",n=>n.mainDepth),new G("occludedOpacity",n=>{var z;return((z=n.occludedFragmentOpacity)==null?void 0:z.value)??1}))),a&&d.uniforms.add(new ze("texOcclusion",n=>{var z;return(z=n.hudOcclusion)==null?void 0:z.attachment})),p?d.main.add(`
        float isBorder = float(any(lessThan(debugBorderCoords.xy, debugBorderCoords.zw)) || any(greaterThan(debugBorderCoords.xy, 1.0 - debugBorderCoords.zw)));
        // don't discard fragments on debug border
        float textureAlphaCutoff = isBorder > 0.0 ? 0.0 : alphaCutoff;
      `):d.main.add("float textureAlphaCutoff = alphaCutoff;"),d.main.add("vec2 samplePos = vtc;"),C&&d.main.add(l`float txSize = float(textureSize(tex, 0).x);
float texelSize = 1.0 / txSize;
vec2 scaleFactor = (vsize - txSize) * texelSize;
samplePos += (vec2(1.0, -1.0) * texelSize) * scaleFactor;`),s?d.main.add(l`
      vec4 fillPixelColor = vcolor;

      // Get distance in output units (i.e. pixels)

      float sdf = texture(tex, samplePos).r;
      float pixelDistance = sdf * vsize.x;

      // Create smooth transition from the icon into its outline
      float fillAlphaFactor = clamp(0.5 - pixelDistance, 0.0, 1.0);
      fillPixelColor.a *= fillAlphaFactor;

      if (outlineSize > 0.25) {
        vec4 outlinePixelColor = outlineColor;
        float clampedOutlineSize = min(outlineSize, 0.5*vsize.x);

        // Create smooth transition around outline
        float outlineAlphaFactor = clamp(0.5 - (abs(pixelDistance) - 0.5*clampedOutlineSize), 0.0, 1.0);
        outlinePixelColor.a *= outlineAlphaFactor;

        if (
          outlineAlphaFactor + fillAlphaFactor < textureAlphaCutoff ||
          fillPixelColor.a + outlinePixelColor.a < alphaCutoff
        ) {
          discard;
        }

        // perform un-premultiplied over operator (see https://en.wikipedia.org/wiki/Alpha_compositing#Description)
        float compositeAlpha = outlinePixelColor.a + fillPixelColor.a * (1.0 - outlinePixelColor.a);
        vec3 compositeColor = vec3(outlinePixelColor) * outlinePixelColor.a +
                              vec3(fillPixelColor) * fillPixelColor.a * (1.0 - outlinePixelColor.a);

        ${D(!O,l`fragColor = vec4(compositeColor, compositeAlpha);`)}
      } else {
        if (fillAlphaFactor < textureAlphaCutoff) {
          discard;
        }

        ${D(!O,l`fragColor = premultiplyAlpha(fillPixelColor);`)}
      }

      // visualize SDF:
      // fragColor = vec4(clamp(-pixelDistance/vsize.x*2.0, 0.0, 1.0), clamp(pixelDistance/vsize.x*2.0, 0.0, 1.0), 0.0, 1.0);
      `):d.main.add(l`
        vec4 texColor = texture(tex, samplePos, -0.5);
        if (texColor.a < textureAlphaCutoff) {
          discard;
        }
        ${D(!O,l`fragColor = texColor * premultiplyAlpha(vcolor);`)}
      `),m&&!O&&d.main.add(l`
        float zSample = -linearizeDepth(texelFetch(depthMap, ivec2(gl_FragCoord.xy), 0).x);
        float zFragment = -linearizeDepth(gl_FragCoord.z);
        if (zSample < ${l.float(1-Ra)} * zFragment) {
          fragColor *= occludedOpacity;
        }
      `),a&&d.main.add("fragColor *= texelFetch(texOcclusion, ivec2(gl_FragCoord.xy), 0).r;"),!O&&p&&d.main.add("fragColor = mix(fragColor, vec4(1.0, 0.0, 1.0, 1.0), isBorder * 0.5);"),r===2&&d.main.add(l`if (fragColor.a < alphaCutoff) {
discard;
}`),R&&d.main.add(l`fragColor = applyFocusAreaStyle(fragColor, focusAreaStyle);`),ce(r)&&u&&d.main.add("fragEmission = vec4(0.0);"),r){case 1:d.main.add(`
        fragColor = vec4(fragColor.rgb * floatBlendOutputScale, fragColor.a);
        fragAlpha = fragColor.a * floatBlendOutputScale;
      `);break;case 2:d.main.add("fragColor.rgb /= fragColor.a;");break;case 11:d.main.add("outputObjectAndLayerIdColor();");break;case 10:e.include(Nt,t),d.main.add("outputHighlight(false);")}return e}function Ve(t){return t.outlineColor[3]>0&&t.outlineSize>0}function J(t){return t.textureIsSignedDistanceField?Ea(t.anchorPosition,t.distanceFieldBoundingBox,Q):xt(Q,t.anchorPosition),Q}const Q=pe();function Ea(t,e,r){he(r,t[0]*(e[2]-e[0])+e[0],t[1]*(e[3]-e[1])+e[1])}const Ra=.08,Ua=Object.freeze(Object.defineProperty({__proto__:null,anchorPosition:J,build:Da},Symbol.toStringTag,{value:"Module"}));let de=class extends Le{constructor(t,e){super(t,e,Ae(rt).concat(Ae(st(e)))),this.shader=new qe(Ua,()=>Me(()=>import("./HUDMaterial.glsl-DjdQuIvo.js").then(r=>r.H),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36]))),this.ignoreUnused=!0,this.primitiveType=Ct.TRIANGLE_STRIP}initializePipeline(t){const{draped:e,output:r,depthTestEnabled:a}=t,s=Qt(r),i=a&&!e&&!s&&r!==10;return Xe({blending:Xt(r,!0),depthTest:a&&!e?{func:515}:null,depthWrite:i?Ca:null,colorWrite:Qe,polygonOffset:Yt(t)})}};de=h([ue("esri.views.3d.webgl-engine.shaders.HUDMaterialTechnique")],de);const rt=Ze().vec2u8("uv0",{glNormalized:!0});function st(t){let e=Ze().vec3f("position").vec3f("normal").f32("groundDistance");return t.hasVertexCenterOffset&&(e=e.vec3f("centerOffset")),t.hasVertexColor&&(e=e.vec4u8("color",{glNormalized:!0})),t.hasVertexSize&&(e=e.vec2f("size")),t.hasVertexRotation&&(e=e.f32("rotation")),(t.hasVVColor||t.hasVVSize)&&(e=e.vec4f("featureAttribute")),t.hasVertexUVi&&(e=e.vec4i16("uvi")),Wt()?e.vec4u8("olidColor"):e}class g extends Zt{constructor(e,r){super(),this.spherical=e,this.polygonOffset=0,this.enableOITOffset=!1,this.screenCenterOffsetUnitsEnabled=!1,this.signedDistanceFieldEnabled=!1,this.sampleSignedDistanceFieldTexelCenter=!1,this.hasVVSize=!1,this.hasVVColor=!1,this.hasVerticalOffset=!1,this.hasScreenSizePerspective=!1,this.hasRotation=!1,this.debugDrawLabelBorder=!1,this.depthTestEnabled=!0,this.pixelSnappingEnabled=!0,this.draped=!1,this.occludedFragmentFade=!1,this.hasOcclusionTexture=!1,this.hasFocusAreaStyle=!1,this.hasVertexColor=!0,this.hasVertexSize=!0,this.hasVertexRotation=!0,this.hasVertexUVi=!0,this.hasVertexCenterOffset=!0,this.olidColorInstanced=!1,this.textureCoordinateType=0,this.emissionSource=0,this.discardInvisibleFragments=!0,this.hasVVInstancing=!1,this.snowCover=!1,this.transparentOccluded=r}}h([x()],g.prototype,"transparentOccluded",void 0),h([x({count:5})],g.prototype,"polygonOffset",void 0),h([x()],g.prototype,"enableOITOffset",void 0),h([x()],g.prototype,"screenCenterOffsetUnitsEnabled",void 0),h([x()],g.prototype,"signedDistanceFieldEnabled",void 0),h([x()],g.prototype,"sampleSignedDistanceFieldTexelCenter",void 0),h([x()],g.prototype,"hasVVSize",void 0),h([x()],g.prototype,"hasVVColor",void 0),h([x()],g.prototype,"hasVerticalOffset",void 0),h([x()],g.prototype,"hasScreenSizePerspective",void 0),h([x()],g.prototype,"hasRotation",void 0),h([x()],g.prototype,"debugDrawLabelBorder",void 0),h([x()],g.prototype,"depthTestEnabled",void 0),h([x()],g.prototype,"pixelSnappingEnabled",void 0),h([x()],g.prototype,"draped",void 0),h([x()],g.prototype,"occludedFragmentFade",void 0),h([x()],g.prototype,"hasOcclusionTexture",void 0),h([x()],g.prototype,"hasFocusAreaStyle",void 0),h([x()],g.prototype,"hasVertexColor",void 0),h([x()],g.prototype,"hasVertexSize",void 0),h([x()],g.prototype,"hasVertexRotation",void 0),h([x()],g.prototype,"hasVertexUVi",void 0),h([x()],g.prototype,"hasVertexCenterOffset",void 0);class ir extends Kt{constructor(e,r,a=!1){super(e,La),this.produces=new Map([[12,s=>W(s)&&!this.parameters.drawAsLabel&&!this._configuration.transparentOccluded],[13,s=>W(s)&&!this.parameters.drawAsLabel&&this._configuration.transparentOccluded],[14,s=>W(s)&&this.parameters.drawAsLabel],[18,s=>this.parameters.draped&&W(s)]]),this._visible=!0,this._configuration=new g(r,a)}updateConfiguration(e){super.updateConfiguration(e);const{parameters:r,_configuration:a}=this,s=r.draped;a.enableOITOffset=e.enableOITOffset,a.hasSlicePlane=this.parameters.hasSlicePlane,a.hasVerticalOffset=!!this.parameters.verticalOffset,a.hasScreenSizePerspective=!!this.parameters.screenSizePerspective,a.screenCenterOffsetUnitsEnabled=this.parameters.centerOffsetUnits==="screen",a.polygonOffset=this.parameters.polygonOffset,a.draped=s,a.pixelSnappingEnabled=this.parameters.pixelSnappingEnabled,a.signedDistanceFieldEnabled=this.parameters.textureIsSignedDistanceField,a.sampleSignedDistanceFieldTexelCenter=this.parameters.sampleSignedDistanceFieldTexelCenter,a.hasRotation=this.parameters.hasRotation,a.hasVVSize=!!this.parameters.vvSize,a.hasVVColor=!!this.parameters.vvColor,a.occludedFragmentFade=!s&&!!this.parameters.occludedFragmentOpacity,a.hasFocusAreaStyle=this.parameters.focusAreaStyle!=null,a.depthTestEnabled=this.parameters.depthEnabled,a.hasVertexColor=this.parameters.hasVertexColor,a.hasVertexSize=this.parameters.hasVertexSize,a.hasVertexRotation=this.parameters.hasVertexRotation,a.hasVertexUVi=this.parameters.hasVertexUVi,a.hasVertexCenterOffset=this.parameters.hasVertexCenterOffset,ce(e.output)&&(a.debugDrawLabelBorder=!!Jt.LABELS_SHOW_BORDER),a.hasOcclusionTexture=!r.drawAsLabel&&a.transparentOccluded&&ea(e.output)}intersect(e,r,a,s,i,u){const{options:{selectionMode:o,hud:p,excludeLabels:c},point:v,camera:f}=a,{parameters:m}=this;if(!o||!p||c&&m.isLabel||!e.visible||!v||!f)return;const C=e.attributes.get("featureAttribute"),F=C==null?null:Oe(C.data,Ue),{scaleX:$,scaleY:V}=Ie(F,m,f.pixelRatio),b=e.attributes.get("position"),S=e.attributes.get("size"),d=e.attributes.get("normal"),O=e.attributes.get("rotation"),_=e.attributes.get("centerOffset"),E=this.parameters.size;Ut(b.size>=3);const R=this.parameters.centerOffsetUnits==="screen";for(let n=0;n<b.data.length/b.size;n++){const z=n*b.size;if(k(w,b.data[z],b.data[z+1],b.data[z+2]),X(w,w,r),X(w,w,f.viewMatrix),_){const T=n*_.size;k(A,_.data[T],_.data[T+1],_.data[T+2])}else k(A,0,0,0);if(!R&&(w[0]+=A[0],w[1]+=A[1],A[2]!==0)){const T=A[2];Ce(A,w),St(w,w,N(A,A,T))}const M=n*d.size;k(I,d.data[M],d.data[M+1],d.data[M+2]),Se(I,I,be(Re,r));const{normal:ot,cosAngle:it}=_e(I,f,Te),nt=je(this.parameters,w,it,f,ie);if(te(w,w,ot,nt),f.applyProjection(w,P),P[0]>-1){if(R&&(A[0]||A[1])&&(P[0]+=A[0]*f.pixelRatio,A[1]!==0&&(P[1]+=ie.alignmentEvaluator.apply(A[1])*f.pixelRatio),f.unapplyProjection(P,w)),P[0]+=this.parameters.screenOffset[0]*f.pixelRatio,P[1]+=this.parameters.screenOffset[1]*f.pixelRatio,P[0]=Math.floor(P[0]),P[1]=Math.floor(P[1]),y[0]=E[0],y[1]=E[1],S!=null){const B=n*S.size;y[0]*=S.data[B],y[1]*=S.data[B+1]}ie.evaluator.applyVec2(y,y);const T=Ma*f.pixelRatio;let me=0;m.textureIsSignedDistanceField&&(me=Math.min(m.outlineSize,.5*y[0])*f.pixelRatio/2),y[0]*=$,y[1]*=V;const lt=m.rotation+(O!=null?O.data[n*O.size]:0),ct=J(m);if(Fe(v,P[0],P[1],y,T,me,lt,m,ct)){const B=a.ray;if(X(De,w,bt(ja,f.viewMatrix)),P[0]=v[0],P[1]=v[1],f.unprojectFromRenderScreen(P,w)){const H=U();j(H,B.direction);const ge=1/Z(H);N(H,H,ge);const xe=wt(B.origin,w)*ge;u(xe,xe,H,-1,De)}}}}}intersectDraped(e,r,a,s,i){const u=e.attributes.get("position"),o=e.attributes.get("size"),p=e.attributes.get("rotation"),c=this.parameters,v=c.size,f=e.attributes.get("featureAttribute"),m=f==null?null:Oe(f.data,Ue),{scaleX:C,scaleY:F}=Ie(m,c,e.screenToWorldRatio),$=Ba*e.screenToWorldRatio;for(let V=0;V<u.data.length/u.size;V++){const b=V*u.size,S=u.data[b],d=u.data[b+1];if(y[0]=v[0],y[1]=v[1],o!=null){const R=V*o.size;y[0]*=o.data[R],y[1]*=o.data[R+1]}let O=0;c.textureIsSignedDistanceField&&(O=Math.min(c.outlineSize,.5*y[0])*e.screenToWorldRatio/2),y[0]*=C,y[1]*=F;const _=c.rotation+(p!=null?p.data[V*p.size]:0),E=J(c);Fe(a,S,d,y,$,O,_,c,E)&&s(i.distance,i.renderDistance,i.normal,-1)}}createBufferWriter(){return new qa(this.parameters)}applyShaderOffsets(e,r,a,s,i,u,o,p){Se(ne,a,be(Re,s));const c=_e(ne,o,Te),v=Ga(Z(r),o),f=je(this.parameters,r,c.cosAngle,o,p);te(r,r,c.normal,f+v),te(e,e,ne,f+v);const m=u+f;this._applyPolygonOffsetView(r,c,m,o,r),this._applyCenterOffsetView(r,i,r)}applyShaderOffsetsNDC(e,r,a,s,i,u){return this._applyCenterOffsetNDC(e,r,s,i),u!=null&&j(u,i),this._applyPolygonOffsetNDC(i,a,s,i),i}_applyPolygonOffsetView(e,r,a,s,i){const u=s.aboveGround?1:-1;let o=Math.sign(a);o===0&&(o=u);const p=u*o;if(this.parameters.shaderPolygonOffset<=0)return j(i,e);const c=yt(Math.abs(r.cosAngle),.01,1),v=1-Math.sqrt(1-c*c)/c/s.viewport[2];return N(i,e,p>0?v:1/v),i}_applyCenterOffsetView(e,r,a){const s=this.parameters.centerOffsetUnits!=="screen";return a!==e&&j(a,e),s&&(a[0]+=r[0],a[1]+=r[1],r[2]&&(Ce(I,a),zt(a,a,N(I,I,r[2])))),a}_applyCenterOffsetNDC(e,r,a,s){const i=this.parameters.centerOffsetUnits!=="screen";return s!==e&&j(s,e),i||(s[0]+=r[0]/a.fullWidth*2,s[1]+=r[1]/a.fullHeight*2),s}_applyPolygonOffsetNDC(e,r,a,s){const i=this.parameters.shaderPolygonOffset;if(e!==s&&j(s,e),i){const u=a.aboveGround?1:-1,o=u*Math.sign(r);s[2]-=(o||u)*i}return s}set visible(e){this._visible=e}get visible(){const{color:e,outlineSize:r,outlineColor:a}=this.parameters,s=e[3]>=re||r>=re&&a[3]>=re;return this._visible&&s}createGLMaterial(e){return new Ta(e)}calculateRelativeScreenBounds(e,r,a=Pt()){return Ia(this.parameters,e,r,a),a[2]=a[0]+e[0],a[3]=a[1]+e[1],a}}class Ta extends ha{constructor(e){super({...e,...e.material.parameters})}beginSlot(e){return this.updateTexture(this._material.parameters.textureId),this._material.setParameters(this.textureBindParameters),this.getTechnique(de,e)}}function Ia(t,e,r,a){a[0]=t.anchorPosition[0]*-e[0]+t.screenOffset[0]*r,a[1]=t.anchorPosition[1]*-e[1]+t.screenOffset[1]*r}function _e(t,e,r){return X(r.normal,t,e.viewInverseTransposeMatrix),r.cosAngle=Vt(r.normal,Ha),r}function Fe(t,e,r,a,s,i,u,o,p){let c=e-s-a[0]*p[0],v=c+a[0]+2*s,f=r-s-a[1]*p[1],m=f+a[1]+2*s;const C=o.distanceFieldBoundingBox;return o.textureIsSignedDistanceField&&C!=null&&(c+=a[0]*C[0],f+=a[1]*C[1],v-=a[0]*(1-C[2]),m-=a[1]*(1-C[3]),c-=i,v+=i,f-=i,m+=i),he(Ee,e,r),_t(q,t,Ee,Ft(u)),q[0]>c&&q[0]<v&&q[1]>f&&q[1]<m}const ie=new ta,w=U(),I=U(),P=ve(),ne=U(),De=U(),q=pe(),Ee=pe(),Re=At(),ja=Dt(),A=U(),le=U(),Ue=ve(),Te={normal:U(),cosAngle:0},Ma=1,Ba=2,y=Be(0,0),Ha=Et(0,0,1);class La extends pa{constructor(){super(...arguments),this.renderOccluded=1,this.testsTransparentRenderOrder=0,this.isDecoration=!1,this.color=we,this.size=$t,this.polygonOffset=0,this.anchorPosition=Be(.5,.5),this.screenOffset=[0,0],this.shaderPolygonOffset=1e-5,this.textureIsSignedDistanceField=!1,this.sampleSignedDistanceFieldTexelCenter=!1,this.outlineColor=we,this.outlineSize=0,this.distanceFieldBoundingBox=ve(),this.rotation=0,this.hasRotation=!1,this.vvSizeEnabled=!1,this.vvSize=null,this.vvColor=null,this.vvOpacity=null,this.hasVertexColor=!1,this.hasVertexSize=!1,this.hasVertexRotation=!1,this.hasVertexUVi=!1,this.hasVertexCenterOffset=!1,this.hasSlicePlane=!1,this.pixelSnappingEnabled=!0,this.centerOffsetUnits="world",this.drawAsLabel=!1,this.depthEnabled=!0,this.focusAreaStyle=null,this.draped=!1,this.isLabel=!1}get hasVVSize(){return!!this.vvSize}get hasVVColor(){return!!this.vvColor}get hasVVOpacity(){return!!this.vvOpacity}}class qa{constructor(e){this.baseInstanceLayout=rt,this.layout=st(e)}elementCount(e){return e.get("position").indices.length}elementCountBaseInstance(e){return e.get("uv0").indices.length}write(e,r,a,s,i){var S,d;if(i==null)return;const{buffer:u,offset:o}=i,{position:p,normal:c,color:v,size:f,rotation:m,centerOffset:C,groundDistance:F,featureAttribute:$,uvi:V}=u;sa(a.get("position"),e,p,o),oa(a.get("normal"),r,c,o);const b=a.get("position").indices.length;if(V){const O=(S=a.get("uvi"))==null?void 0:S.data;if(O&&O.length>=4){const[_,E,R,n]=O;for(let z=0;z<b;++z){const M=o+z;V.setValues(M,_,E,R,n)}}}if(v&&ia(a.get("color"),4,v,o),f&&Pe(a.get("size"),f,o),m&&$e(a.get("rotation"),m,o),C&&(a.get("centerOffset")?na(a.get("centerOffset"),C,o):se(C,o,b)),a.get("groundDistance")?$e(a.get("groundDistance"),F,o):se(F,o,b),$&&(a.get("featureAttribute")?la(a.get("featureAttribute"),$,o):se($,o,b)),s!=null){const O=(d=a.get("position"))==null?void 0:d.indices;if(O){const _=O.length,E=u.getField("olidColor",Tt);ca(s,E,_,o)}}}writeBaseInstance(e,r){const{uv0:a}=r;Pe(e.get("uv0"),a,0)}}function Ie(t,e,r){return t==null||e.vvSize==null?{scaleX:r,scaleY:r}:(aa(le,e,t),{scaleX:le[0]*r,scaleY:le[1]*r})}function Ga(t,e){const r=e.computeRenderPixelSizeAtDist(t)*et;return(e.aboveGround?1:-1)*r}function je(t,e,r,a,s){var p;if(!((p=t.verticalOffset)!=null&&p.screenLength)){const c=Z(e);return s.update(r,c,t.screenSizePerspective,t.screenSizePerspectiveMinPixelReferenceSize,t.screenSizePerspectiveAlignment,null),0}const i=Z(e),u=t.screenSizePerspectiveAlignment??t.screenSizePerspective,o=ra(a,i,t.verticalOffset,r,u,t.screenSizePerspectiveMinPixelReferenceSize);return s.update(r,i,t.screenSizePerspective,t.screenSizePerspectiveMinPixelReferenceSize,t.screenSizePerspectiveAlignment,null),o}export{Da as $,J as V,$a as a,tt as b,sr as d,or as f,Va as i,Aa as l,Je as o,ir as r,rr as s};
