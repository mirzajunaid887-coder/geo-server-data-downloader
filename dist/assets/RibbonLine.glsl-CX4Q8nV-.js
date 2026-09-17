import{eZ as Ne,iI as It,aH as zt,aB as _,aD as Mt,fL as jt,aG as Nt,qe as kt,nR as Jt,aL as Te,ii as Tt,cS as he,kk as Bt,gP as Ut,_ as Ht,hQ as tt,ai as T,ak as Gt,ds as Ce,z as qt,ro as Xt,ex as ee,eu as se,aM as Oe,ev as _e,ew as it,a$ as oe,eC as at,gT as He,vG as Yt,eD as Zt,f_ as re,aP as nt,oz as Qt,vQ as le,j8 as Kt,dW as ei,bN as ti}from"./index-o98Aja7I.js";import{f as ii}from"./computeTranslationToOriginAndRotation-Dsw951Cc.js";import{t as ai,a as ni,b as Se,d as ri,x as si}from"./WebGLLayer-BhtAexHZ.js";import{t as oi}from"./Attribute-DGhdp5lO.js";import{K as Y,F as Pt,ag as li,a8 as pe,ah as rt,u as ci,L as Ge,N as qe,O as di,e as ke,d as pi,f as fi,aa as hi,D as ui,h as mi,b as vi,c as gi,P as Si,g as wt,i as xi,t as yi,z as st,j as bi,r as ot,ai as xe,l as Di,m as zi,n as Ti,aj as Pi,ak as lt,al as wi,am as Li,an as ct,o as $i,s as Ci,ao as Oi,x as Re,q as _i,ap as dt,v as Ri,w as pt,aq as Fi,y as Ai,A as Ei,ar as ft,B as Wi}from"./TriangleTechniqueConfiguration-BbVmpokX.js";import{U as Vi,j as Ii}from"./BufferView-BjlVprna.js";import{h as Fe,l as Mi,x as ji,j as Ni,v as Lt}from"./lineSegment-BmCjyw0h.js";import{k as ye,X as Z,y as ht,v as Pe}from"./plane-BPueD4Ud.js";import{Q as ki,t as Ji}from"./InterleavedLayout-seWAjsA1.js";import{O as be,g as Ae,a as ut}from"./renderState-eKYY9aZU.js";import{t as s,n as A,i as w}from"./oitResolution.glsl-DnN_jdFk.js";import{s as Bi,t as Ui,n as Hi,c as Gi,f as qi,e as Xi}from"./SceneLighting-C8zPZjrj.js";import{s as Yi}from"./ShaderBuilder-C5cjJO7J.js";function rn(t,e,a,i,n,r,l,d,o,c,p){const u=na[p.mode];let v,h,m=0;if(Ne(t,e,a,i,o.spatialReference,n,d))return u!=null&&u.requiresAlignment(p)?(m=u.applyElevationAlignmentBuffer(i,n,r,l,d,o,c,p),v=r,h=l):(v=i,h=n),Ne(v,o.spatialReference,h,r,c.spatialReference,l,d)?m:void 0}function $t(t,e,a,i,n){const r=(ai(t)?t.z:ni(t)?t.array[t.offset+2]:t[2])||0;switch(a.mode){case"on-the-ground":{const l=Se(e,t,"ground")??0;return n.verticalDistanceToGround=0,n.sampledElevation=l,void(n.z=l)}case"relative-to-ground":{const l=Se(e,t,"ground")??0,d=a.geometryZWithOffset(r,i);return n.verticalDistanceToGround=d,n.sampledElevation=l,void(n.z=d+l)}case"relative-to-scene":{const l=Se(e,t,"scene")??0,d=a.geometryZWithOffset(r,i);return n.verticalDistanceToGround=d,n.sampledElevation=l,void(n.z=d+l)}case"absolute-height":{const l=a.geometryZWithOffset(r,i),d=Se(e,t,"ground")??0;return n.verticalDistanceToGround=l-d,n.sampledElevation=d,void(n.z=l)}default:return void(n.z=0)}}function sn(t,e,a,i){return $t(t,e,a,i,ce),ce.z}function on(t,e,a){return e==="on-the-ground"&&a==="on-the-ground"?t.staysOnTheGround:e===a||e!=="on-the-ground"&&a!=="on-the-ground"?e==null||a==null?t.definedChanged:1:t.onTheGroundChanged}function ln(t){return t==="relative-to-ground"||t==="relative-to-scene"}function cn(t){return t!=="absolute-height"}function dn(t,e,a,i,n){$t(e,a,n,i,ce),Zi(t,ce.verticalDistanceToGround);const r=ce.sampledElevation,l=It(ra,t.transformation);return De[0]=e.x,De[1]=e.y,De[2]=ce.z,ii(e.spatialReference,De,l,i.spatialReference)?t.transformation=l:console.warn("Could not locate symbol object properly, it might be misplaced"),r}function Zi(t,e){for(let a=0;a<t.geometries.length;++a){const i=t.geometries[a].getMutableAttribute("groundDistance");i&&i.data[0]!==e&&(i.data[0]=e,t.geometryVertexAttributeUpdated(t.geometries[a],"groundDistance"))}}function Qi(t,e,a,i,n,r){let l=0;const d=r.spatialReference;e*=3,i*=3;for(let o=0;o<n;++o){const c=t[e],p=t[e+1],u=t[e+2],v=r.getElevation(c,p,u,d,"ground")??0;l+=v,a[i]=c,a[i+1]=p,a[i+2]=v,e+=3,i+=3}return l/n}function Ki(t,e,a,i,n,r,l,d){let o=0;const c=d.calculateOffsetRenderUnits(l),p=d.featureExpressionInfoContext,u=r.spatialReference;e*=3,i*=3;for(let v=0;v<n;++v){const h=t[e],m=t[e+1],V=t[e+2],g=r.getElevation(h,m,V,u,"ground")??0;o+=g,a[i]=h,a[i+1]=m,a[i+2]=p==null?V+g+c:g+c,e+=3,i+=3}return o/n}function ea(t,e,a,i,n,r,l,d){let o=0;const c=d.calculateOffsetRenderUnits(l),p=d.featureExpressionInfoContext,u=r.spatialReference;e*=3,i*=3;for(let v=0;v<n;++v){const h=t[e],m=t[e+1],V=t[e+2],g=r.getElevation(h,m,V,u,"scene")??0;o+=g,a[i]=h,a[i+1]=m,a[i+2]=p==null?V+g+c:g+c,e+=3,i+=3}return o/n}function ta(t){const e=t.meterUnitOffset,a=t.featureExpressionInfoContext;return e!==0||a!=null}function ia(t,e,a,i,n,r,l,d){const o=d.calculateOffsetRenderUnits(l),c=d.featureExpressionInfoContext;e*=3,i*=3;for(let p=0;p<n;++p){const u=t[e],v=t[e+1],h=t[e+2];a[i]=u,a[i+1]=v,a[i+2]=c==null?h+o:o,e+=3,i+=3}return 0}class aa{constructor(){this.verticalDistanceToGround=0,this.sampledElevation=0,this.z=0}}const na={"absolute-height":{applyElevationAlignmentBuffer:ia,requiresAlignment:ta},"on-the-ground":{applyElevationAlignmentBuffer:Qi,requiresAlignment:()=>!0},"relative-to-ground":{applyElevationAlignmentBuffer:Ki,requiresAlignment:()=>!0},"relative-to-scene":{applyElevationAlignmentBuffer:ea,requiresAlignment:()=>!0}},ra=zt(),ce=new aa,De=_();let sa=class{constructor(e,a){this.vec3=e,this.id=a}};function mt(t,e,a,i){return new sa(Mt(t,e,a),i)}const W={dash:[4,3],dot:[1,3],"long-dash":[8,3],"short-dash":[4,1],"short-dot":[1,1]},oa={dash:W.dash,"dash-dot":[...W.dash,...W.dot],dot:W.dot,"long-dash":W["long-dash"],"long-dash-dot":[...W["long-dash"],...W.dot],"long-dash-dot-dot":[...W["long-dash"],...W.dot,...W.dot],none:null,"short-dash":W["short-dash"],"short-dash-dot":[...W["short-dash"],...W["short-dot"]],"short-dash-dot-dot":[...W["short-dash"],...W["short-dot"],...W["short-dot"]],"short-dot":W["short-dot"],solid:null},la=8;let ca=class{constructor(e,a,i){this.image=e,this.width=a,this.length=i,this.uuid=jt()}};function Ct(t){return t!=null&&"image"in t}function da(t,e){return t==null?t:{pattern:t.slice(),pixelRatio:e}}function hn(t){return{pattern:[t,t],pixelRatio:2}}function un(t){switch(t==null?void 0:t.type){case"style":return pa(t.style);case"image":return new ca(t.image,t.width,t.length);case void 0:case null:return null}return null}function pa(t){return t!=null?da(oa[t],la):null}const vt=8;function fa(t,e){const{vertex:a,attributes:i}=t;a.uniforms.add(new Y("intrinsicWidth",l=>l.width));const{hasScreenSizePerspective:n,spherical:r}=e;n?(t.include(Bi,e),Ui(a),Pt(a,e),a.uniforms.add(new li("inverseViewMatrix",(l,d)=>Nt(gt,kt(gt,d.camera.viewMatrix,l.origin)))),a.code.add(s`
      float applyLineSizeScreenSizePerspective(float size, vec3 pos) {
        vec3 worldPos = (inverseViewMatrix * vec4(pos, 1)).xyz;
        vec3 groundUp = ${r?s`normalize(worldPos + localOrigin)`:s`vec3(0.0, 0.0, 1.0)`};
        float absCosAngle = abs(dot(groundUp, normalize(worldPos - cameraPosition)));

        return screenSizePerspectiveScaleFloat(size, absCosAngle, length(pos), screenSizePerspective);
      }
    `)):a.code.add(s`float applyLineSizeScreenSizePerspective(float size, vec3 pos) {
return size;
}`),e.hasVVSize?(i.add("sizeFeatureAttribute","float"),a.uniforms.add(new pe("vvSizeMinSize",l=>l.vvSize.minSize),new pe("vvSizeMaxSize",l=>l.vvSize.maxSize),new pe("vvSizeOffset",l=>l.vvSize.offset),new pe("vvSizeFactor",l=>l.vvSize.factor),new pe("vvSizeFallback",l=>l.vvSize.fallback)),a.code.add(s`
    float getSize(${A(n,"vec3 pos")}) {
      float size = isnan(sizeFeatureAttribute)
        ? vvSizeFallback.x
        : intrinsicWidth * clamp(vvSizeOffset + sizeFeatureAttribute * vvSizeFactor, vvSizeMinSize, vvSizeMaxSize).x;

      return ${A(n,"applyLineSizeScreenSizePerspective(size, pos)","size")};
    }
    `)):(i.add("size","float"),a.code.add(s`
    float getSize(${A(n,"vec3 pos")}) {
      float fullSize = intrinsicWidth * size;
      return ${A(n,"applyLineSizeScreenSizePerspective(fullSize, pos)","fullSize")};
    }
    `)),e.hasVVOpacity?(i.add("opacityFeatureAttribute","float"),a.constants.add("vvOpacityNumber","int",8),a.uniforms.add(new rt("vvOpacityValues",vt,l=>l.vvOpacity.values),new rt("vvOpacityOpacities",vt,l=>l.vvOpacity.opacityValues),new Y("vvOpacityFallback",l=>l.vvOpacity.fallback,{supportsNaN:!0})),a.code.add(s`
    float interpolateOpacity(float value) {
      if (value <= vvOpacityValues[0]) {
        return vvOpacityOpacities[0];
      }

      for (int i = 1; i < vvOpacityNumber; ++i) {
        if (vvOpacityValues[i] >= value) {
          float f = (value - vvOpacityValues[i-1]) / (vvOpacityValues[i] - vvOpacityValues[i-1]);
          return mix(vvOpacityOpacities[i-1], vvOpacityOpacities[i], f);
        }
      }

      return vvOpacityOpacities[vvOpacityNumber - 1];
    }

    vec4 applyOpacity(vec4 color) {
      if (isnan(opacityFeatureAttribute)) {
        // If there is a color vv then it will already have taken care of applying the fallback
        return ${A(e.hasVVColor,"color","vec4(color.rgb, vvOpacityFallback)")};
      }

      return vec4(color.rgb, interpolateOpacity(opacityFeatureAttribute));
    }
    `)):a.code.add(s`vec4 applyOpacity(vec4 color) {
return color;
}`),e.hasVVColor?(t.include(ci,e),i.add("colorFeatureAttribute","float"),a.code.add(s`vec4 getColor() {
vec4 color = interpolateVVColor(colorFeatureAttribute);
if (isnan(color.r)) {
return vec4(0);
}
return applyOpacity(color);
}`)):(i.add("color","vec4"),a.code.add(s`vec4 getColor() {
return applyOpacity(color);
}`))}const gt=zt();function ha(t){t.vertex.code.add("#define noPerspectiveWrite(x, w) (x * w)")}function Je(t){t.fragment.code.add("#define noPerspectiveRead(x) (x * gl_FragCoord.w)")}function ua(t){return t.pattern.map(e=>Math.round(e*t.pixelRatio))}function ma(t){if(t==null)return 1;const e=ua(t);return Math.floor(e.reduce((a,i)=>a+i))}function va(t){return t==null?Jt:t.length===4?t:Te(ga,t[0],t[1],t[2],1)}const ga=Tt();function Sa(t,e){if(!e.stippleEnabled)return void t.fragment.code.add(s`float getStippleAlpha(float lineWidth) { return 1.0; }
void discardByStippleAlpha(float stippleAlpha, float threshold) {}
vec4 blendStipple(vec4 color, float stippleAlpha) { return color; }`);const a=!(e.draped&&e.stipplePreferContinuous),{vertex:i,fragment:n}=t;e.draped||(Pt(i,e),i.uniforms.add(new Ge("worldToScreenPerDistanceRatio",({camera:r})=>1/r.perScreenPixelRatio)).code.add(s`float computeWorldToScreenRatio(vec3 segmentCenter) {
float segmentDistanceToCamera = length(segmentCenter - cameraPosition);
return worldToScreenPerDistanceRatio / segmentDistanceToCamera;
}`)),t.varyings.add("vStippleDistance","float"),t.varyings.add("vStippleDistanceLimits","vec2"),t.varyings.add("vStipplePatternStretch","float"),i.code.add(s`
    float discretizeWorldToScreenRatio(float worldToScreenRatio) {
      float step = ${s.float(xa)};

      float discreteWorldToScreenRatio = log(worldToScreenRatio);
      discreteWorldToScreenRatio = ceil(discreteWorldToScreenRatio / step) * step;
      discreteWorldToScreenRatio = exp(discreteWorldToScreenRatio);
      return discreteWorldToScreenRatio;
    }
  `),qe(i),i.code.add(s`
    vec2 computeStippleDistanceLimits(float startPseudoScreen, float segmentLengthPseudoScreen, float segmentLengthScreen, float patternLength) {

      // First check if the segment is long enough to support fully screen space patterns.
      // Force sparse mode for segments that are very large in screen space even if it is not allowed,
      // to avoid imprecision from calculating with large floats.
      if (segmentLengthPseudoScreen >= ${a?"patternLength":"1e4"}) {
        // Round the screen length to get an integer number of pattern repetitions (minimum 1).
        float repetitions = segmentLengthScreen / (patternLength * pixelRatio);
        float flooredRepetitions = max(1.0, floor(repetitions + 0.5));
        float segmentLengthScreenRounded = flooredRepetitions * patternLength;

        float stretch = repetitions / flooredRepetitions;

        // We need to impose a lower bound on the stretch factor to prevent the dots from merging together when there is only 1 repetition.
        // 0.75 is the lowest possible stretch value for flooredRepetitions > 1, so it makes sense as lower bound.
        vStipplePatternStretch = max(0.75, stretch);

        return vec2(0.0, segmentLengthScreenRounded);
      }
      return vec2(startPseudoScreen, startPseudoScreen + segmentLengthPseudoScreen);
    }
  `),n.uniforms.add(new di("stipplePatternTexture",r=>r.stippleTexture),new Y("stipplePatternPixelSizeInv",r=>1/Ot(r))),e.stippleOffColorEnabled&&n.uniforms.add(new ke("stippleOffColor",r=>va(r.stippleOffColor))),t.include(Je),e.worldSizedImagePattern?(t.varyings.add("vStippleV","float"),t.fragment.include(Hi),n.code.add(s`vec4 getStippleColor(out bool isClamped) {
vec2 aaCorrectedLimits = vStippleDistanceLimits + vec2(1.0, -1.0) / gl_FragCoord.w;
isClamped = vStippleDistance < aaCorrectedLimits.x || vStippleDistance > aaCorrectedLimits.y;
float u = vStippleDistance * stipplePatternPixelSizeInv;
float v = vStippleV == -1.0 ? 0.5 : vStippleV;
return texture(stipplePatternTexture, vec2(u, v));
}
vec4 getStippleColor() {
bool ignored;
return getStippleColor(ignored);
}
float getStippleSDF() {
vec4 color = getStippleColor();
return color.a == 0.0 ? -0.5 : 0.5;
}
float getStippleAlpha(float lineWidth) {
return getStippleColor().a;
}
vec4 blendStipple(vec4 color, float stippleAlpha) {
vec4 stippleColor = getStippleColor();
int mixMode  = 1;
vec3 col = mixExternalColor(color.rgb, vec3(1.0), stippleColor.rgb, mixMode);
float opacity = mixExternalOpacity(color.a, 1.0, stippleColor.a, mixMode);
return vec4(col, opacity);
}`)):n.code.add(s`
    float getStippleSDF(out bool isClamped) {
      float stippleDistanceClamped = noPerspectiveRead(clamp(vStippleDistance, vStippleDistanceLimits.x, vStippleDistanceLimits.y));
      float lineSizeInv = noPerspectiveRead(vLineSizeInv);

      vec2 aaCorrectedLimits = vStippleDistanceLimits + vec2(1.0, -1.0) / gl_FragCoord.w;
      isClamped = vStippleDistance < aaCorrectedLimits.x || vStippleDistance > aaCorrectedLimits.y;

      float u = stippleDistanceClamped * stipplePatternPixelSizeInv * lineSizeInv;
      u = fract(u);

      float sdf = texture(stipplePatternTexture, vec2(u, 0.5)).r;

      return (sdf - 0.5) * vStipplePatternStretch + 0.5;
    }

    float getStippleSDF() {
      bool ignored;
      return getStippleSDF(ignored);
    }

    float getStippleAlpha(float lineWidth) {
      bool isClamped;
      float stippleSDF = getStippleSDF(isClamped);
      float antiAliasedResult = clamp(stippleSDF * lineWidth + 0.5, 0.0, 1.0);
      return isClamped ? floor(antiAliasedResult + 0.5) : antiAliasedResult;
    }

    vec4 blendStipple(vec4 color, float stippleAlpha) {
      return ${e.stippleOffColorEnabled?"mix(color, stippleOffColor, stippleAlpha)":"vec4(color.rgb, color.a * stippleAlpha)"};
    }
  `),n.code.add(s`
    void discardByStippleAlpha(float stippleAlpha, float threshold) {
     ${A(!e.stippleOffColorEnabled,"if (stippleAlpha < threshold) { discard; }")}
    }
  `)}function Ot(t){const e=t.stipplePattern;return Ct(e)?e.length:e?ma(e)/e.pixelRatio:1}const xa=.4,_t=64,ya=_t/2,ba=ya/5,Da=_t/ba,mn=.25;function za(t,e){const a=t.vertex,i=e.hasScreenSizePerspective;qe(a),a.uniforms.get("markerScale")==null&&a.constants.add("markerScale","float",1),a.constants.add("markerSizePerLineWidth","float",Da).code.add(s`
  float getLineWidth(${A(i,"vec3 pos")}) {
     return max(getSize(${A(i,"pos")}), 1.0) * pixelRatio;
  }

  float getScreenMarkerSize(float lineWidth) {
    return markerScale * markerSizePerLineWidth * lineWidth;
  }
  `),e.space===2&&(a.constants.add("maxSegmentLengthFraction","float",.45),a.uniforms.add(new Ge("perRenderPixelRatio",n=>n.camera.perRenderPixelRatio)),a.code.add(s`
  bool areWorldMarkersHidden(vec3 pos, vec3 other) {
    vec3 midPoint = mix(pos, other, 0.5);
    float distanceToCamera = length(midPoint);
    float screenToWorldRatio = perRenderPixelRatio * distanceToCamera * 0.5;
    float worldMarkerSize = getScreenMarkerSize(getLineWidth(${A(i,"pos")})) * screenToWorldRatio;
    float segmentLen = length(pos - other);
    return worldMarkerSize > maxSegmentLengthFraction * segmentLen;
  }

  float getWorldMarkerSize(vec3 pos) {
    float distanceToCamera = length(pos);
    float screenToWorldRatio = perRenderPixelRatio * distanceToCamera * 0.5;
    return getScreenMarkerSize(getLineWidth(${A(i,"pos")})) * screenToWorldRatio;
  }
  `))}const Ta=s`vec4(0.0, 0.0, 2.0, 1.0)`,Pa=he(1),wa=he(1);function La(t,e){const{hasAnimation:a,animation:i}=e;if(!a)return;const{attributes:n,varyings:r,vertex:l,fragment:d}=t;n.add("timeStamps","vec4"),r.add("vTimeStamp","float"),r.add("vFirstTime","float"),r.add("vLastTime","float"),r.add("vTransitionType","float"),l.main.add(s`vTimeStamp = timeStamps.x;
vFirstTime = timeStamps.y;
vLastTime = timeStamps.z;
vTransitionType = timeStamps.w;`),i===3&&d.constants.add("decayRate","float",2.3),d.code.add(s`
    float getTrailOpacity(float x) {
      if (x < 0.0) {
        return 0.0;
      }

      ${$a(i)}
    }`),d.uniforms.add(new Y("timeElapsed",o=>o.timeElapsed),new Y("trailLength",o=>o.trailLength),new Y("speed",o=>o.animationSpeed),new Gi("startEndTime",o=>Bt(Ca,o.startTime,o.endTime))),d.constants.add("fadeInTime","float",wa),d.constants.add("fadeOutTime","float",Pa),d.constants.add("incomingTransition","int",0),d.constants.add("outgoingTransition","int",2),d.code.add(s`float fadeIn(float x) {
return smoothstep(0.0, fadeInTime, x);
}
float fadeOut(float x) {
return isinf(fadeOutTime) ? 1.0 : smoothstep(fadeOutTime, 0.0, x);
}
void updateAlphaIf(inout float alpha, bool condition, float newAlpha) {
alpha = condition ? min(alpha, newAlpha) : alpha;
}
vec4 animate(vec4 color) {
float startTime = startEndTime[0];
float endTime = startEndTime[1];
float totalTime = vLastTime - vFirstTime;
float actualFadeOutTime = min(fadeOutTime * speed, trailLength);
float longStreamlineThreshold = (fadeInTime + 1.0) * speed + actualFadeOutTime;
bool longStreamline = totalTime > longStreamlineThreshold;
float totalTimeWithFadeOut = longStreamline && actualFadeOutTime != trailLength ? totalTime : totalTime + actualFadeOutTime;
float fadeOutStartTime = longStreamline ? totalTime - actualFadeOutTime : totalTime;
float originTime =  -vFirstTime;
float actualEndTime = int(vTransitionType) == outgoingTransition ? min(endTime, startTime + vLastTime / speed) : endTime;
vec4 animatedColor = color;
if (speed == 0.0) {
float alpha = getTrailOpacity((totalTimeWithFadeOut - (vTimeStamp - vFirstTime)) / trailLength);
updateAlphaIf(alpha, !isinf(actualEndTime), fadeOut(timeElapsed - actualEndTime));
updateAlphaIf(alpha, true, fadeIn(timeElapsed - startTime));
animatedColor.a *= alpha;
return animatedColor;
}
float relativeStartTime = mod(startTime, totalTimeWithFadeOut);
float shiftedTimeElapsed = timeElapsed - relativeStartTime + originTime;
float headRelativeToFirst = mod(shiftedTimeElapsed * speed, totalTimeWithFadeOut);
float vRelativeToHead = headRelativeToFirst - originTime - vTimeStamp;
float vAbsoluteTime = timeElapsed - vRelativeToHead / speed;
if (startTime > timeElapsed) {
return vec4(0.0);
}
float alpha = getTrailOpacity(vRelativeToHead / trailLength);
updateAlphaIf(alpha, true, fadeIn(timeElapsed - startTime));
updateAlphaIf(alpha, !isinf(actualEndTime), fadeOut(timeElapsed - actualEndTime));
updateAlphaIf(alpha, int(vTransitionType) != incomingTransition, step(startTime, vAbsoluteTime));
updateAlphaIf(alpha, headRelativeToFirst > fadeOutStartTime, fadeOut((headRelativeToFirst - fadeOutStartTime) / speed));
alpha *= fadeIn(vTimeStamp - vFirstTime);
animatedColor.a *= alpha;
return animatedColor;
}`)}function $a(t){switch(t){case 2:return"return x >= 0.0 && x <= 1.0 ? 1.0 : 0.0;";case 3:return`float cutOff = exp(-decayRate);
        return (exp(-decayRate * x) - cutOff) / (1.0 - cutOff);`;default:return"return 1.0;"}}const Ca=Ut(),Xe=1;function Rt(t){const e=new Yi,{attributes:a,varyings:i,vertex:n,fragment:r}=e,{applyMarkerOffset:l,draped:d,output:o,capType:c,stippleEnabled:p,falloffEnabled:u,roundJoins:v,wireframe:h,innerColorEnabled:m,hasAnimation:V,hasScreenSizePerspective:g,worldSizedImagePattern:C}=t;n.inputs.add("position",()=>"position"),r.include(qi),e.include(fa,t),e.include(Sa,t),e.include(pi,t),e.include(La,t);const k=l&&!d;k&&(n.uniforms.add(new Y("markerScale",f=>f.markerScale)),e.include(za,{space:2,hasScreenSizePerspective:g})),fi(n,t),n.uniforms.add(new hi("inverseProjectionMatrix",f=>f.camera.inverseProjectionMatrix),new ui("nearFar",f=>f.camera.nearFar),new Y("miterLimit",f=>f.join!=="miter"?0:f.miterLimit),new Xi("viewport",f=>f.camera.fullViewport)),n.constants.add("LARGE_HALF_FLOAT","float",65500),n.constants.add("EPS","float",.001),n.constants.add("NUM_JOIN_SUBDIVISIONS","float",t.numJoinSubdivisions),a.add("position","vec3"),a.add("previousDelta","vec4"),a.add("nextDelta","vec4"),a.add("lineParameters","vec2"),a.add("u0","float"),i.add("vColor","vec4"),i.add("vpos","vec3",{invariant:!0}),i.add("vLineDistance","float"),i.add("vLineWidth","float"),p||(i.add("vIsInsideJoin","int"),i.add("vStretchFactor","float"),i.add("vJoinCenterLineSDFs","vec2"),i.add("vSubdivisionFactor","float"));const q=p;q&&i.add("vLineSizeInv","float");const b=c===2,x=p&&b,R=u||x;R&&i.add("vLineDistanceNorm","float"),b&&(i.add("vSegmentSDF","float"),i.add("vReverseSegmentSDF","float")),n.code.add(s`vec3 perpendicular(vec3 v) {
return vec3(v.y, -v.x, 0.0);
}
float interp(float ncp, vec4 a, vec4 b) {
return (-ncp - a.z) / (b.z - a.z);
}
vec3 rotateZ(vec3 v, float a) {
float s = sin(a);
float c = cos(a);
mat2 m = mat2(c, -s, s, c);
return vec3(m * v.xy, v.z);
}`),n.code.add(s`vec4 projectAndScale(vec4 pos) {
vec4 posNdc = proj * pos;
posNdc.xy *= viewport.zw / posNdc.w;
posNdc.z /= posNdc.w;
return posNdc;
}`),n.code.add(s`void clip(
inout vec4 pos,
inout vec4 prev,
inout vec4 next,
bool isStartVertex
) {
float vnp = nearFar[0] * 0.99;
if (pos.z > -nearFar[0]) {
if (!isStartVertex) {
if (prev.z < -nearFar[0]) {
pos = mix(prev, pos, interp(vnp, prev, pos));
next = pos;
} else {
pos = vec4(0.0, 0.0, 0.0, 1.0);
}
} else {
if (next.z < -nearFar[0]) {
pos = mix(pos, next, interp(vnp, pos, next));
prev = pos;
} else {
pos = vec4(0.0, 0.0, 0.0, 1.0);
}
}
} else {
if (prev.z > -nearFar[0]) {
prev = mix(pos, prev, interp(vnp, pos, prev));
}
if (next.z > -nearFar[0]) {
next = mix(next, pos, interp(vnp, next, pos));
}
}
}`),qe(n),n.constants.add("aaWidth","float",p?0:1).main.add(s`
    // unpack values from vertex type
    bool isStartVertex = abs(abs(lineParameters.y) - 3.0) == 1.0;
    vec3 prevPosition = position + previousDelta.xyz * previousDelta.w;
    vec3 nextPosition = position + nextDelta.xyz * nextDelta.w;

    float coverage = 1.0;

    // Check for special value of lineParameters.y which is used by the Renderer when graphics are removed before the
    // VBO is recompacted. If this is the case, then we just project outside of clip space.
    if (lineParameters.y == 0.0) {
      gl_Position = ${Ta};
    }
    else {
      vec4 pos  = view * vec4(position, 1.0);
      vec4 prev = view * vec4(prevPosition, 1.0);
      vec4 next = view * vec4(nextPosition, 1.0);

      bool isJoin = abs(lineParameters.y) < 3.0;
  `),k&&n.main.add(s`vec4 other = isStartVertex ? next : prev;
bool markersHidden = areWorldMarkersHidden(pos.xyz, other.xyz);
if (!isJoin && !markersHidden) {
pos.xyz += normalize(other.xyz - pos.xyz) * getWorldMarkerSize(pos.xyz) * 0.5;
}`),e.include(ha),n.main.add(s`
      clip(pos, prev, next, isStartVertex);

      vec3 clippedPos = pos.xyz;
      vec3 clippedCenter = mix(pos.xyz, isStartVertex ? next.xyz : prev.xyz, 0.5);

      pos = projectAndScale(pos);
      next = projectAndScale(next);
      prev = projectAndScale(prev);

      vec3 left = (pos.xyz - prev.xyz);
      vec3 right = (next.xyz - pos.xyz);

      float leftLen = length(left);
      float rightLen = length(right);

      float lineSize = getSize(${A(g,"clippedPos")});
      ${A(p&&g,"float patternLineSize = getSize(clippedCenter);")}
      ${A(p&&!g,"float patternLineSize = lineSize;")}

      ${A(C,s`
          lineSize += aaWidth;
          float lineWidth = lineSize * pixelRatio * worldToScreenRatio;
          if (lineWidth < 1.0) {
            coverage = lineWidth;
            lineWidth = 1.0;
          }
        `,s`
          if (lineSize < 1.0) {
            coverage = lineSize; // convert sub-pixel coverage to alpha
            lineSize = 1.0;
          }

          lineSize += aaWidth;
          float lineWidth = lineSize * pixelRatio;
        `)}

      vLineWidth = noPerspectiveWrite(lineWidth, pos.w);
      ${q?s`vLineSizeInv = noPerspectiveWrite(1.0 / lineSize, pos.w);`:""}
  `),(p||b)&&n.main.add(s`
      float isEndVertex = float(!isStartVertex);
      vec3 segmentOrigin = mix(pos.xyz, prev.xyz, isEndVertex);
      vec3 segment = mix(right, left, isEndVertex);
      ${b?s`vec3 segmentEnd = mix(next.xyz, pos.xyz, isEndVertex);`:""}
    `),n.main.add(s`left = (leftLen > EPS) ? left/leftLen : vec3(0.0, 0.0, 0.0);
right = (rightLen > EPS) ? right/rightLen : vec3(0.0, 0.0, 0.0);
vec3 segmentDirection = isStartVertex ? right : left;
vec3 capDisplacementDir = vec3(0.0, 0.0, 0.0);
vec3 joinDisplacementDir = vec3(0.0, 0.0, 0.0);
float displacementLen = lineWidth;
float miterDisplacementLen = lineWidth;
float innerDisplacementLen = lineWidth;`),p||n.main.add(s`vIsInsideJoin = 0;
vStretchFactor = 1.0;
vSubdivisionFactor = 0.0;
vJoinCenterLineSDFs = vec2(LARGE_HALF_FLOAT);`),n.main.add(s`float subdivisionFactor = 0.0;
bool isOutside = false;
if (isJoin) {
isOutside = (left.x * right.y - left.y * right.x) * lineParameters.y > 0.0;
vec3 joinDirection = normalize(left + right);
joinDisplacementDir = perpendicular(joinDirection);
if (leftLen > EPS && rightLen > EPS) {
float nDotSeg = dot(joinDisplacementDir, left);
displacementLen /= length(nDotSeg * left - joinDisplacementDir);
miterDisplacementLen = displacementLen;
innerDisplacementLen = min(displacementLen, min(leftLen, rightLen)/abs(nDotSeg));
if (!isOutside) {
displacementLen = innerDisplacementLen;
}
}
subdivisionFactor = lineParameters.x;`),p||n.main.add(s`if(subdivisionFactor > 0.0) {
vIsInsideJoin = 1;
}
vSubdivisionFactor = isOutside ? subdivisionFactor : 0.5;
if (miterDisplacementLen > miterLimit * lineWidth) {
vec2 leftScreenDir = left.xy;
vec2 rightScreenDir = right.xy;
float leftScreenLen = length(leftScreenDir);
float rightScreenLen = length(rightScreenDir);
if (leftScreenLen > EPS && rightScreenLen > EPS) {
leftScreenDir /= leftScreenLen;
rightScreenDir /= rightScreenLen;
float theta = acos(clamp(dot(leftScreenDir, rightScreenDir), -1.0, 1.0));
float subdividedTriangleHeight = (innerDisplacementLen + lineWidth) * cos(theta / (2.0 + 2.0 * NUM_JOIN_SUBDIVISIONS));
float bevelTriangleHeight = innerDisplacementLen + lineWidth * cos(theta * 0.5);
float triangleHeight = NUM_JOIN_SUBDIVISIONS > 0.0 ? subdividedTriangleHeight : bevelTriangleHeight;
vStretchFactor = noPerspectiveWrite(max(triangleHeight / (2.0 * lineWidth), 1.0), pos.w);
}
}`),n.main.add(s`if (isOutside && (displacementLen > miterLimit * lineWidth)) {`),v?n.main.add(s`
        vec3 startDir = leftLen < EPS ? right : left;
        startDir = perpendicular(startDir);

        vec3 endDir = rightLen < EPS ? left : right;
        endDir = perpendicular(endDir);

        float factor = ${p?s`min(1.0, subdivisionFactor * ((NUM_JOIN_SUBDIVISIONS + 1.0) / NUM_JOIN_SUBDIVISIONS))`:s`subdivisionFactor`};

        float rotationAngle = acos(clamp(dot(startDir.xy, endDir.xy), -1.0, 1.0));
        joinDisplacementDir = rotateZ(startDir, -sign(lineParameters.y) * factor * rotationAngle);
      `):n.main.add(s`
        vec3 startDir = perpendicular(leftLen < EPS ? right : left);
        vec3 endDir = perpendicular(rightLen < EPS ? left : right);

        ${A(p,s`joinDisplacementDir = (isStartVertex || subdivisionFactor > 0.0) ? endDir : startDir;`,s`joinDisplacementDir = mix(startDir, endDir, subdivisionFactor);`)}
  `);const E=c!==0;return n.main.add(s`
        displacementLen = lineWidth;
      }
    } else {
      // CAP handling ---------------------------------------------------
      joinDisplacementDir = isStartVertex ? right : left;
      joinDisplacementDir = perpendicular(joinDisplacementDir);

      ${E?s`capDisplacementDir = vec3((isStartVertex ? -right : left).xy, 0.0);`:""}
    }
  `),n.main.add(s`
    // Displacement (in pixels) caused by join/or cap
    vec2 dposXY = (joinDisplacementDir.xy * sign(lineParameters.y) + capDisplacementDir.xy) * displacementLen;

    /**
     * To prevent z-fighting between layers, we also adjust the z value.
     * We want to ensure that the orientation of the final triangles is the same, regardless of the line width.
     * To do so, the below formula projects the xy displacement onto the original segment direction
     * to find the z-offset necessary so the triangle orientation is independent of the width.
     */
    float dposZ = dot(dposXY, segmentDirection.xy) / dot(segmentDirection.xy, segmentDirection.xy) * segmentDirection.z;
    vec3 dpos = vec3(dposXY, dposZ);

    float lineDistNorm = noPerspectiveWrite(sign(lineParameters.y), pos.w);

    vLineDistance = lineWidth * lineDistNorm;
    ${R?s`vLineDistanceNorm = lineDistNorm;`:""}

    pos.xyz += dpos;
  `),p||n.main.add(s`if (isJoin) {
vec2 joinCenterToVertex = dposXY;
vec2 leftCenterlineDir = left.xy;
vec2 rightCenterlineDir = right.xy;
float leftCenterlineLen = length(leftCenterlineDir);
float rightCenterlineLen = length(rightCenterlineDir);
leftCenterlineDir = leftCenterlineLen > EPS ? leftCenterlineDir / leftCenterlineLen : vec2(1.0, 0.0);
rightCenterlineDir = rightCenterlineLen > EPS ? rightCenterlineDir / rightCenterlineLen : leftCenterlineDir;
vJoinCenterLineSDFs = noPerspectiveWrite(
vec2(
dot(vec2(rightCenterlineDir.y, -rightCenterlineDir.x), joinCenterToVertex),
dot(vec2(leftCenterlineDir.y, -leftCenterlineDir.x), joinCenterToVertex)
),
pos.w
);
}`),b&&n.main.add(s`vec2 segmentDir = normalize(segment.xy);
vSegmentSDF = noPerspectiveWrite((isJoin && isStartVertex) ? LARGE_HALF_FLOAT : (dot(pos.xy - segmentOrigin.xy, segmentDir)), pos.w);
vReverseSegmentSDF = noPerspectiveWrite((isJoin && !isStartVertex) ? LARGE_HALF_FLOAT : (dot(pos.xy - segmentEnd.xy, -segmentDir)), pos.w);`),p&&(d?n.uniforms.add(new Ge("worldToScreenRatio",f=>1/f.screenToPCSRatio)):n.main.add(s`vec3 segmentCenter = mix((nextPosition + position) * 0.5, (position + prevPosition) * 0.5, isEndVertex);
float worldToScreenRatio = computeWorldToScreenRatio(segmentCenter);`),n.main.add(s`float segmentLengthScreenDouble = length(segment.xy);
float segmentLengthScreen = segmentLengthScreenDouble * 0.5;
float discreteWorldToScreenRatio = discretizeWorldToScreenRatio(worldToScreenRatio);
float segmentLengthRender = length(mix(nextPosition - position, position - prevPosition, isEndVertex));
vStipplePatternStretch = worldToScreenRatio / discreteWorldToScreenRatio;`),d?n.main.add(s`float segmentLengthPseudoScreen = segmentLengthScreen / pixelRatio * discreteWorldToScreenRatio / worldToScreenRatio;
float startPseudoScreen = u0 * discreteWorldToScreenRatio - mix(0.0, segmentLengthPseudoScreen, isEndVertex);`):n.main.add(s`float startPseudoScreen = mix(u0, u0 - segmentLengthRender, isEndVertex) * discreteWorldToScreenRatio;
float segmentLengthPseudoScreen = segmentLengthRender * discreteWorldToScreenRatio;`),n.uniforms.add(new Y("stipplePatternPixelSize",f=>Ot(f))),n.main.add(s`
      float patternLength = patternLineSize * stipplePatternPixelSize;

      ${A(C,s`
          float uu = mix(u0, u0 - segmentLengthRender, isEndVertex);
          vStippleDistanceLimits = vec2(uu, uu + segmentLengthRender);
          vStipplePatternStretch = 1.0;

          // The v-coordinate used in case of an image pattern.
          bool isLeft = sign(lineParameters.y) < 0.0;
          vStippleV = isLeft ? 0.0 : 1.0;
        `,s`
          // Compute the coordinates at both start and end of the line segment, because we need both to clamp to in the
          // fragment shader
          vStippleDistanceLimits = computeStippleDistanceLimits(startPseudoScreen, segmentLengthPseudoScreen, segmentLengthScreen, patternLength);
        `)}

      vStippleDistance = mix(vStippleDistanceLimits.x, vStippleDistanceLimits.y, isEndVertex);

      // Adjust the coordinate to the displaced position (the pattern is shortened/overextended on the in/outside of
      // joins)
      if (segmentLengthScreenDouble >= EPS) {
        // Project the actual vertex position onto the line segment. Note that the resulting factor is within [0..1]
        // at the original vertex positions, and slightly outside of that range at the displaced positions
        vec3 stippleDisplacement = pos.xyz - segmentOrigin;
        float stippleDisplacementFactor = dot(segment.xy, stippleDisplacement.xy) / (segmentLengthScreenDouble * segmentLengthScreenDouble);

        // Apply this offset to the actual vertex coordinate (can be screen or pseudo-screen space)
        vStippleDistance += (stippleDisplacementFactor - isEndVertex) * (vStippleDistanceLimits.y - vStippleDistanceLimits.x);
      }

      // Cancel out perspective correct interpolation because we want this length the really represent the screen
      // distance
      vStippleDistanceLimits = noPerspectiveWrite(vStippleDistanceLimits, pos.w);
      vStippleDistance = noPerspectiveWrite(vStippleDistance, pos.w);

      // Disable stipple distance limits on caps
      vStippleDistanceLimits = isJoin ?
                                 vStippleDistanceLimits :
                                 isStartVertex ?
                                  vec2(-1e34, vStippleDistanceLimits.y) :
                                  vec2(vStippleDistanceLimits.x, 1e34);
    `)),n.main.add(s`
      // Convert back into NDC
      pos.xy = (pos.xy / viewport.zw) * pos.w;
      pos.z = pos.z * pos.w;

      vColor = getColor();
      vColor.a = noPerspectiveWrite(vColor.a * coverage, pos.w);

      ${h&&!d?"pos.z -= EPS * pos.w;":""}

      // transform final position to camera space for slicing
      vpos = (inverseProjectionMatrix * pos).xyz;
      gl_Position = pos;
      forwardObjectAndLayerIdColor();
    }`),e.fragment.include(mi,t),e.include(vi,t),r.include(gi),r.main.add(s`discardBySlice(vpos);`),e.include(Je),r.include(Si),r.main.add(s`
    float lineWidth = noPerspectiveRead(vLineWidth);
    float lineDistance = noPerspectiveRead(vLineDistance);
    ${A(R,s`float lineDistanceNorm = noPerspectiveRead(vLineDistanceNorm);`)}
  `),h?r.main.add(s`vec4 finalColor = vec4(1.0, 0.0, 1.0, 1.0);`):(b&&r.main.add(s`float sdf = noPerspectiveRead(min(vSegmentSDF, vReverseSegmentSDF));
vec2 fragmentPosition = vec2(min(sdf, 0.0), lineDistance);
float fragmentRadius = length(fragmentPosition);
float fragmentCapSDF = (fragmentRadius - lineWidth) * 0.5;
float capCoverage = clamp(0.5 - fragmentCapSDF, 0.0, 1.0);
if (capCoverage < alphaCutoff) {
discard;
}`),x?r.main.add(s`vec2 stipplePosition = vec2(
min(getStippleSDF() * 2.0 - 1.0, 0.0),
lineDistanceNorm
);
float stippleRadius = length(stipplePosition * lineWidth);
float stippleCapSDF = (stippleRadius - lineWidth) * 0.5;
float stippleCoverage = clamp(0.5 - stippleCapSDF, 0.0, 1.0);
float stippleAlpha = step(alphaCutoff, stippleCoverage);`):r.main.add(s`float stippleAlpha = getStippleAlpha(lineWidth);`),o!==11&&r.main.add(s`discardByStippleAlpha(stippleAlpha, alphaCutoff);`),e.include(Je),r.uniforms.add(new ke("intrinsicColor",f=>f.color)).main.add(s`vec4 color = intrinsicColor * vColor;
color.a = noPerspectiveRead(color.a);`),m&&r.uniforms.add(new ke("innerColor",f=>f.innerColor??f.color),new Y("innerWidth",(f,$)=>f.innerWidth*$.camera.pixelRatio)).main.add(s`float distToInner = abs(lineDistance) - innerWidth;
float innerAA = clamp(0.5 - distToInner, 0.0, 1.0);
float innerAlpha = innerColor.a + color.a * (1.0 - innerColor.a);
color = mix(color, vec4(innerColor.rgb, innerAlpha), innerAA);`),r.main.add(s`vec4 finalColor = blendStipple(color, stippleAlpha);`),u&&(r.uniforms.add(new Y("falloff",f=>f.falloff)),r.main.add(s`finalColor.a *= pow(max(0.0, 1.0 - abs(lineDistanceNorm)), falloff);`)),p||r.main.add(s`float stretchFactor = vIsInsideJoin == 1 ? noPerspectiveRead(vStretchFactor) : 1.0;
float featherWidth = 2.0;
float featherStartDistance = max(lineWidth - featherWidth / stretchFactor, 0.0);
float straightFeatherStartDistance = max(lineWidth - featherWidth, 0.0);
float value = abs(lineDistance);
float feather = (value - featherStartDistance) / (lineWidth - featherStartDistance);
vec2 joinCenterSDFs = noPerspectiveRead(vJoinCenterLineSDFs);
float joinCenterDistance = abs(vSubdivisionFactor > 0.5 ? joinCenterSDFs.x : joinCenterSDFs.y);
float straightFeather = (joinCenterDistance - straightFeatherStartDistance) / (lineWidth - straightFeatherStartDistance);
feather = vIsInsideJoin == 1 ? max(feather, straightFeather) : feather;
finalColor.a *= 1.0 - clamp(feather, 0.0, 1.0);`),V&&r.main.add(s`
        finalColor = animate(finalColor);

        ${A(o!==11,s`
            if (finalColor.a <= alphaCutoff) {
              discard;
            }`)}
      `)),r.main.add(s`outputColorHighlightOLID(applySlice(finalColor, vpos), finalColor.rgb);`),e}const Oa=Object.freeze(Object.defineProperty({__proto__:null,build:Rt,ribbonlineNumRoundJoinSubdivisions:Xe},Symbol.toStringTag,{value:"Module"}));function Ft(t){const e=ki().vec3f("position").vec4f16("previousDelta").vec4f16("nextDelta").f32("u0").vec2f16("lineParameters");return t.hasVVColor?e.f32("colorFeatureAttribute"):e.vec4u8("color",{glNormalized:!0}),t.hasVVSize?e.f32("sizeFeatureAttribute"):e.f32("size"),t.hasVVOpacity&&e.f32("opacityFeatureAttribute"),wt()&&e.vec4u8("olidColor"),t.hasAnimation&&e.vec4f16("timeStamps"),e}let Be=class extends xi{constructor(t,e){super(t,e,Ji(Ft(e))),this.shader=new yi(Oa,()=>Ht(()=>Promise.resolve().then(()=>Ba),void 0)),this.ignoreUnused=!0,this.primitiveType=e.wireframe?tt.LINES:tt.TRIANGLE_STRIP}_makePipelineState(t,e){const{output:a,hasOccludees:i}=t;return be({blending:Ti(a,!1,t.emissionDimmingPass),depthTest:zi(a),depthWrite:Di(t),colorWrite:Ae,stencilWrite:i?ot:null,stencilTest:i?e?st:bi:null,polygonOffset:xe(t)})}initializePipeline(t){if(t.occluder){const{hasOccludees:e}=t;this._occluderPipelineTransparent=be({blending:ut,polygonOffset:xe(t),depthTest:lt,depthWrite:null,colorWrite:Ae,stencilWrite:null,stencilTest:e?Pi:null}),this._occluderPipelineOpaque=be({blending:ut,polygonOffset:xe(t),depthTest:e?lt:ct,depthWrite:null,colorWrite:Ae,stencilWrite:e?Li:null,stencilTest:e?wi:null}),this._occluderPipelineMaskWrite=be({blending:null,polygonOffset:xe(t),depthTest:ct,depthWrite:null,colorWrite:null,stencilWrite:e?ot:null,stencilTest:e?st:null})}return this._occludeePipeline=this._makePipelineState(t,!0),this._makePipelineState(t,!1)}getPipeline(t,e,a){if(a)return this._occludeePipeline;switch(t.occluder){case 11:return this._occluderPipelineTransparent??super.getPipeline(t,e,a);case 10:return this._occluderPipelineOpaque??super.getPipeline(t,e,a);default:t.occluder;case void 0:case null:return this._occluderPipelineMaskWrite??super.getPipeline(t,e,a)}}};Be=T([Gt("esri.views.3d.webgl-engine.shaders.RibbonLineTechnique")],Be);const _a=16,Ra=8;class P extends $i{constructor(e){super(),this.spherical=e,this.capType=0,this.emissionSource=0,this.animation=2,this.polygonOffsetIndex=0,this.writeDepth=!1,this.draped=!1,this.stippleEnabled=!1,this.stippleOffColorEnabled=!1,this.stipplePreferContinuous=!0,this.numJoinSubdivisions=1,this.roundJoins=!1,this.applyMarkerOffset=!1,this.hasVVSize=!1,this.hasVVColor=!1,this.hasVVOpacity=!1,this.falloffEnabled=!1,this.innerColorEnabled=!1,this.hasOccludees=!1,this.occluder=!1,this.wireframe=!1,this.discardInvisibleFragments=!1,this.hasScreenSizePerspective=!1,this.worldSizedImagePattern=!1,this.textureCoordinateType=0,this.hasVVInstancing=!1,this.hasSliceTranslatedView=!0,this.overlayEnabled=!1,this.snowCover=!1}get hasAnimation(){return this.animation!==0}}T([w({count:3})],P.prototype,"capType",void 0),T([w({count:8})],P.prototype,"emissionSource",void 0),T([w({count:4})],P.prototype,"animation",void 0),T([w({count:_a})],P.prototype,"polygonOffsetIndex",void 0),T([w()],P.prototype,"writeDepth",void 0),T([w()],P.prototype,"draped",void 0),T([w()],P.prototype,"stippleEnabled",void 0),T([w()],P.prototype,"stippleOffColorEnabled",void 0),T([w()],P.prototype,"stipplePreferContinuous",void 0),T([w({count:Ra})],P.prototype,"numJoinSubdivisions",void 0),T([w()],P.prototype,"roundJoins",void 0),T([w()],P.prototype,"applyMarkerOffset",void 0),T([w()],P.prototype,"hasVVSize",void 0),T([w()],P.prototype,"hasVVColor",void 0),T([w()],P.prototype,"hasVVOpacity",void 0),T([w()],P.prototype,"falloffEnabled",void 0),T([w()],P.prototype,"innerColorEnabled",void 0),T([w()],P.prototype,"hasOccludees",void 0),T([w()],P.prototype,"occluder",void 0),T([w()],P.prototype,"wireframe",void 0),T([w()],P.prototype,"discardInvisibleFragments",void 0),T([w()],P.prototype,"hasScreenSizePerspective",void 0),T([w()],P.prototype,"worldSizedImagePattern",void 0);let Fa=class extends Ci{constructor(e,a){super(e,Ea),this.produces=new Map([[2,i=>Oi(i)||Re(i)&&this.parameters.renderOccluded===8],[3,i=>_i(i)],[10,i=>dt(i)&&this.parameters.renderOccluded===8],[11,i=>dt(i)&&this.parameters.renderOccluded===8],[4,i=>Re(i)&&this.parameters.writeDepth&&this.parameters.renderOccluded!==8],[8,i=>Re(i)&&!this.parameters.writeDepth&&this.parameters.renderOccluded!==8],[18,i=>Ri(i)]]),this._configuration=new P(a)}updateConfiguration(e){super.updateConfiguration(e);const a=e.slot===18,i=this.parameters.stipplePattern!=null&&this.parameters.stippleTexture!=null&&e.output!==10,n=i&&a&&this.parameters.isImagePattern();this._configuration.draped=a,this._configuration.polygonOffset=this.parameters.polygonOffset,this._configuration.stippleEnabled=i,this._configuration.stippleOffColorEnabled=i&&this.parameters.stippleOffColor!=null,this._configuration.stipplePreferContinuous=i&&this.parameters.stipplePreferContinuous,this._configuration.numJoinSubdivisions=At(this.parameters.join,i),this._configuration.hasSlicePlane=this.parameters.hasSlicePlane,this._configuration.roundJoins=this.parameters.join==="round",this._configuration.capType=this.parameters.cap,this._configuration.applyMarkerOffset=this.parameters.markerParameters!=null&&Va(this.parameters.markerParameters),this._configuration.polygonOffsetIndex=this.parameters.polygonOffsetIndex,this._configuration.writeDepth=this.parameters.writeDepth,this._configuration.hasVVSize=this.parameters.hasVVSize,this._configuration.hasVVColor=this.parameters.hasVVColor,this._configuration.hasVVOpacity=this.parameters.hasVVOpacity,this._configuration.innerColorEnabled=this.parameters.innerWidth>0&&this.parameters.innerColor!=null,this._configuration.falloffEnabled=this.parameters.falloff>0,this._configuration.hasOccludees=e.hasOccludees,this._configuration.occluder=this.parameters.renderOccluded===8,this._configuration.wireframe=this.parameters.wireframe,this._configuration.animation=this.parameters.animation,this._configuration.emissionSource=this.emissions?1:0,this._configuration.hasScreenSizePerspective=!!this.parameters.screenSizePerspective&&!n,this._configuration.worldSizedImagePattern=n}get visible(){var e;return this.parameters.color[3]>=pt||this.parameters.stipplePattern!=null&&(((e=this.parameters.stippleOffColor)==null?void 0:e[3])??0)>pt}get emissions(){return this.parameters.emissiveStrength>0?this.parameters.renderOccluded!==8?2:1:0}setParameters(e,a){e.animation=this.parameters.animation,super.setParameters(e,a)}intersectDraped({attributes:e,screenToWorldRatio:a},i,n,r,l){if(!i.options.selectionMode)return;const d=e.get("size");let o=this.parameters.width;if(this.parameters.vvSize){const g=e.get("sizeFeatureAttribute").data[0];Number.isNaN(g)?o*=this.parameters.vvSize.fallback[0]:o*=Ce(this.parameters.vvSize.offset[0]+g*this.parameters.vvSize.factor[0],this.parameters.vvSize.minSize[0],this.parameters.vvSize.maxSize[0])}else d&&(o*=d.data[0]);const c=n[0],p=n[1],u=(o/2+4)*a;let v=Number.MAX_VALUE,h=0;const m=e.get("position").data,V=Ue(this.parameters,e)?m.length-2:m.length-5;for(let g=0;g<V;g+=3){const C=m[g],k=m[g+1],q=(g+3)%m.length,b=c-C,x=p-k,R=m[q]-C,E=m[q+1]-k,f=Ce((R*b+E*x)/(R*R+E*E),0,1),$=R*f-b,I=E*f-x,z=$*$+I*I;z<v&&(v=z,h=g/3)}v<u*u&&r(l.distance,l.renderDistance,l.normal,h)}intersect(e,a,i,n,r,l){const{options:d,camera:o,rayBegin:c,rayEnd:p}=i;if(!d.selectionMode||!e.visible||!o)return;if(!Vi(a))return void qt.getLogger("esri.views.3d.webgl-engine.materials.RibbonLineMaterial").error("intersection assumes a translation-only matrix");const u=e.attributes,v=u.get("position").data;let h=this.parameters.width;if(this.parameters.vvSize){const x=u.get("sizeFeatureAttribute").data[0];Number.isNaN(x)||(h*=Ce(this.parameters.vvSize.offset[0]+x*this.parameters.vvSize.factor[0],this.parameters.vvSize.minSize[0],this.parameters.vvSize.maxSize[0]))}else u.has("size")&&(h*=u.get("size").data[0]);const m=Ia;Xt(m,i.point);const V=h*o.pixelRatio,g=4*o.pixelRatio,C=V/2+g;ee(fe[0],m[0]-C,m[1]+C,0),ee(fe[1],m[0]+C,m[1]+C,0),ee(fe[2],m[0]+C,m[1]-C,0),ee(fe[3],m[0]-C,m[1]-C,0);for(let x=0;x<4;x++)if(!o.unprojectFromRenderScreen(fe[x],ie[x]))return;ye(o.eye,ie[0],ie[1],Ve),ye(o.eye,ie[1],ie[2],Ie),ye(o.eye,ie[2],ie[3],Me),ye(o.eye,ie[3],ie[0],je);let k=Number.MAX_VALUE,q=0;const b=Ue(this.parameters,u)?v.length-2:v.length-5;for(let x=0;x<b;x+=3){M[0]=v[x]+a[12],M[1]=v[x+1]+a[13],M[2]=v[x+2]+a[14];const R=(x+3)%v.length;if(j[0]=v[R]+a[12],j[1]=v[R+1]+a[13],j[2]=v[R+2]+a[14],Z(Ve,M)<0&&Z(Ve,j)<0||Z(Ie,M)<0&&Z(Ie,j)<0||Z(Me,M)<0&&Z(Me,j)<0||Z(je,M)<0&&Z(je,j)<0)continue;const E=o.projectToRenderScreen(M,Ma),f=o.projectToRenderScreen(j,ja);if(E==null||f==null)continue;if(E[2]<0&&f[2]>0){se(Q,M,j);const z=o.frustum,X=-Z(z[4],M)/Oe(Q,ht(z[4]));if(_e(Q,Q,X),it(M,M,Q),!o.projectToRenderScreen(M,E))continue}else if(E[2]>0&&f[2]<0){se(Q,j,M);const z=o.frustum,X=-Z(z[4],j)/Oe(Q,ht(z[4]));if(_e(Q,Q,X),it(j,j,Q),!o.projectToRenderScreen(j,f))continue}else if(E[2]<0&&f[2]<0)continue;E[2]=0,f[2]=0;const $=Fe(E,f,Dt),I=Mi($,m);if(!(I>=k)){if(this.parameters.screenSizePerspective){const z=this.computeScreenSizePerspectiveWidth($,M,j,m,o,h,g);if(I>=z*z)continue}k=I,oe(yt,M),oe(bt,j),q=x/3}}if(k<C*C){let x=Number.MAX_VALUE;if(ji(Fe(yt,bt,Dt),Fe(c,p,Na),K)){se(K,K,c);const R=at(K);_e(K,K,1/R),x=R/He(c,p)}l(x,x,K,q)}}createBufferWriter(){return new Wa(Ft(this.parameters),this.parameters)}createGLMaterial(e){return new Aa(e)}validateParameters(e){e.join!=="miter"&&(e.miterLimit=0),e.markerParameters!=null&&(e.markerScale=e.markerParameters.width/e.width)}update(e){return!!this.parameters.hasAnimation&&(this.setParameters({timeElapsed:Yt(e.time)},!1),e.dt!==0)}computeScreenSizePerspectiveWidth(e,a,i,n,r,l,d){const o=Ni(e,n);Zt(We,a,i,o),re(xt,We,r.viewMatrix);const c=at(xt),p=this.computeCameraAbsCosAngle(We,r,this._configuration.spherical);return St.update(p,c,this.parameters.screenSizePerspective,this.parameters.screenSizePerspectiveMinPixelReferenceSize),St.apply(l)*r.pixelRatio/2+d}computeCameraAbsCosAngle(e,a,i){return i?nt(K,e):ee(K,0,0,1),se(ze,e,a.eye),nt(ze,ze),Math.abs(Oe(K,ze))}};class Aa extends Ei{constructor(){super(...arguments),this._stipplePattern=null}dispose(){var e;super.dispose(),(e=this._stippleTextures)==null||e.release(this._stipplePattern),this._stipplePattern=null}beginSlot(e){const{stipplePattern:a}=this._material.parameters;return this._stipplePattern!==a&&(this._material.setParameters({stippleTexture:this._stippleTextures.swap(a,this._stipplePattern)}),this._stipplePattern=a),this.getTechnique(Be,e)}}class Ea extends Ai{constructor(){super(...arguments),this._width=0,this.color=Qt,this.join="miter",this.cap=0,this.miterLimit=5,this.writeDepth=!0,this.polygonOffset=0,this.polygonOffsetIndex=0,this.stippleTexture=null,this.stipplePreferContinuous=!0,this.markerParameters=null,this.markerScale=1,this.hasSlicePlane=!1,this.vvFastUpdate=!1,this.isClosed=!1,this.falloff=0,this.innerWidth=0,this.wireframe=!1,this.timeElapsed=he(0),this.animation=0,this.animationSpeed=1,this.trailLength=1,this.startTime=he(0),this.endTime=he(1/0),this.emissiveStrength=0}get width(){return this.isImagePattern()?this.stipplePattern.width:this._width}set width(e){this._width=e}get transparent(){var e;return this.color[3]<1||this.hasAnimation||this.stipplePattern!=null&&(((e=this.stippleOffColor)==null?void 0:e[3])??0)<1}get hasAnimation(){return this.animation!==0}isImagePattern(){return Ct(this.stipplePattern)&&this.stippleTexture!=null}}class Wa{constructor(e,a){this.layout=e,this._parameters=a,this.numJoinSubdivisions=At(this._parameters.join,this._parameters.stipplePattern!=null)}_isClosed(e){return Ue(this._parameters,e)}allocate(e){return this.layout.createBuffer(e)}elementCount(e){const i=e.get("position").indices.length/2+1,n=this._isClosed(e);let r=n?2:2*2;return r+=((n?i:i-1)-(n?0:1))*(2*this.numJoinSubdivisions+4),r+=2,this._parameters.wireframe&&(r=2+4*(r-2)),r}write(e,a,i,n,r){var Ze,Qe,Ke,et;if(r==null)return;const{buffer:l,offset:d}=r,o=this.layout,c=i.get("position"),p=c.indices,u=c.data.length/3,v=(Ze=i.get("distanceToStart"))==null?void 0:Ze.data;p&&p.length!==2*(u-1)&&console.warn("RibbonLineMaterial does not support indices");const h=o.fields.has("sizeFeatureAttribute");let m=1,V=null;if(h){const S=i.get("sizeFeatureAttribute");S.data.length===1?m=S.data[0]:V=S.data}else m=((Qe=i.get("size"))==null?void 0:Qe.data[0])??1;let g=[1,1,1,1],C=0,k=null;const q=o.fields.has("colorFeatureAttribute");if(q){const S=i.get("colorFeatureAttribute");S.data.length===1?C=S.data[0]:k=S.data}else g=((Ke=i.get("color"))==null?void 0:Ke.data)??g;const b=(et=i.get("timeStamps"))==null?void 0:et.data,x=b&&o.fields.has("timeStamps"),R=o.fields.has("opacityFeatureAttribute");let E=0,f=null;if(R){const S=i.get("opacityFeatureAttribute");S.data.length===1?E=S.data[0]:f=S.data}const $=new Float32Array(l.buffer),I=Ii(l.buffer),z=new Uint8Array(l.buffer),X=o.stride/4;let D=d*X;const we=D;let J=0;const Le=v?(S,G,ne)=>J=v[ne]:(S,G,ne)=>J+=He(S,G),ae=$.BYTES_PER_ELEMENT/I.BYTES_PER_ELEMENT,Ye=4/ae,Et=wt(),H=(S,G,ne,U,me,Wt,ve,Vt)=>{$[D++]=G[0],$[D++]=G[1],$[D++]=G[2],ft(S,G,I,D*ae),D+=Ye,ft(ne,G,I,D*ae),D+=Ye,$[D++]=Vt;let te=D*ae;if(I[te++]=me,I[te++]=Wt,D=Math.ceil(te/ae),q)$[D]=(k==null?void 0:k[ve])??C;else{const B=Math.min(4*ve,g.length-4),ge=4*D;z[ge]=255*g[B],z[ge+1]=255*g[B+1],z[ge+2]=255*g[B+2],z[ge+3]=255*g[B+3]}if(D++,$[D++]=(V==null?void 0:V[ve])??m,R&&($[D++]=(f==null?void 0:f[ve])??E),Et){let B=4*D;n?(z[B++]=n[0],z[B++]=n[1],z[B++]=n[2],z[B++]=n[3]):(z[B++]=0,z[B++]=0,z[B++]=0,z[B++]=0),D=Math.ceil(.25*B)}x&&(te=D*ae,I[te++]=U[0],I[te++]=U[1],I[te++]=U[2],I[te++]=U[3],D=Math.ceil(te/ae))};D+=X,ee(y,c.data[0],c.data[1],c.data[2]),x&&Te(N,b[0],b[1],b[2],b[3]),e&&re(y,y,e);const ue=this._isClosed(i);if(ue){const S=c.data.length-3;ee(F,c.data[S],c.data[S+1],c.data[S+2]),e&&re(F,F,e)}else ee(L,c.data[3],c.data[4],c.data[5]),e&&re(L,L,e),H(y,y,L,N,1,-4,0,0),H(y,y,L,N,1,4,0,0),oe(F,y),oe(y,L),x&&Te(N,b[4],b[5],b[6],b[7]);const $e=ue?0:1,de=ue?u:u-1;for(let S=$e;S<de;S++){const G=(S+1)%u*3;ee(L,c.data[G],c.data[G+1],c.data[G+2]),e&&re(L,L,e),Le(F,y,S),H(F,y,L,N,0,-1,S,J),H(F,y,L,N,0,1,S,J);const ne=this.numJoinSubdivisions;for(let U=0;U<ne;++U){const me=(U+1)/(ne+1);H(F,y,L,N,me,-1,S,J),H(F,y,L,N,me,1,S,J)}if(H(F,y,L,N,1,-2,S,J),H(F,y,L,N,1,2,S,J),oe(F,y),oe(y,L),x){const U=(S+1)%u*4;Te(N,b[U],b[U+1],b[U+2],b[U+3])}}ue?(ee(L,c.data[3],c.data[4],c.data[5]),e&&re(L,L,e),J=Le(F,y,de),H(F,y,L,N,0,-1,$e,J),H(F,y,L,N,0,1,$e,J)):(J=Le(F,y,de),H(F,y,y,N,0,-5,de,J),H(F,y,y,N,0,5,de,J)),Ee($,we+X,$,we,X),D=Ee($,D-X,$,D,X),this._parameters.wireframe&&this._addWireframeVertices(l,we,D,X)}_addWireframeVertices(e,a,i,n){const r=new Float32Array(e.buffer,i*Float32Array.BYTES_PER_ELEMENT),l=new Float32Array(e.buffer,a*Float32Array.BYTES_PER_ELEMENT,i-a);let d=0;const o=c=>d=Ee(l,c,r,d,n);for(let c=0;c<l.length-1;c+=2*n)o(c),o(c+2*n),o(c+1*n),o(c+2*n),o(c+1*n),o(c+3*n)}}function Ee(t,e,a,i,n){for(let r=0;r<n;r++)a[i++]=t[e++];return i}function Ue(t,e){return t.isClosed?e.get("position").indices.length>2:!1}function Va(t){return t.anchor===1&&t.hideOnShortSegments&&t.placement==="begin-end"&&t.worldSpace}function At(t,e){const a=e?1:0;switch(t){case"miter":case"bevel":return a;case"round":return Xe+a}}const St=new Fi,M=_(),j=_(),We=_(),xt=_(),ze=_(),Q=_(),K=_(),Ia=_(),Ma=le(),ja=le(),yt=_(),bt=_(),Dt=Lt(),Na=Lt(),F=_(),y=_(),L=_(),N=Tt(),fe=[le(),le(),le(),le()],ie=[_(),_(),_(),_()],Ve=Pe(),Ie=Pe(),Me=Pe(),je=Pe();class gn{constructor(e){var i;this._originSR=e,this._rootOriginId="root/"+Kt(),this._origins=new Map,this._objects=new Map,this._gridSize=5e5,(i=this._originSR)!=null&&i.isGeographic&&(this._gridSize/=ei(this._originSR)),this._baselineDistance=.5*this._gridSize;const a=this._baselineDistance*ka;this._baselineObjectSize=a/Ja}getOrigin(e){const a=this._origins.get(this._rootOriginId);if(a==null){const p=mt(e[0]+Math.random()-.5,e[1]+Math.random()-.5,e[2]+Math.random()-.5,this._rootOriginId);return this._origins.set(this._rootOriginId,p),p}const i=this._gridSize,n=Math.round(e[0]/i),r=Math.round(e[1]/i),l=Math.round(e[2]/i),d=`${n}/${r}/${l}`;let o=this._origins.get(d);const c=.5*i;if(se(O,e,a.vec3),O[0]=Math.abs(O[0]),O[1]=Math.abs(O[1]),O[2]=Math.abs(O[2]),O[0]<c&&O[1]<c&&O[2]<c){if(o){const p=Math.max(...O);if(se(O,e,o.vec3),O[0]=Math.abs(O[0]),O[1]=Math.abs(O[1]),O[2]=Math.abs(O[2]),Math.max(...O)<p)return o}return a}return o||(o=mt(n*i,r*i,l*i,d),this._origins.set(d,o)),o}needsOriginUpdate(e,a,i){const n=He(e.vec3,a),r=Math.max(1,i/this._baselineObjectSize);return n>this._baselineDistance*r}_drawOriginBox(e,a=ti(1,1,0,1)){const i=window.view,n=i.stage,r=a.toString();if(!this._objects.has(r)){this._material=new Fa({width:2,color:a},!1);const h=new ri(n,{pickable:!1}),m=new si({castShadow:!1});h.add(m),this._objects.set(r,m)}const l=this._objects.get(r),d=[0,1,5,4,0,2,1,7,6,2,0,1,3,7,5,4,6,2,0],o=d.length,c=new Array(3*o),p=new Array,u=.5*this._gridSize;for(let h=0;h<o;h++)c[3*h]=e[0]+(1&d[h]?u:-u),c[3*h+1]=e[1]+(2&d[h]?u:-u),c[3*h+2]=e[2]+(4&d[h]?u:-u),h>0&&p.push(h-1,h);Ne(c,this._originSR,0,c,i.renderSpatialReference,0,o);const v=new Wi(this._material,[["position",new oi(c,p,3,!0)]],null,2);l.addGeometry(v)}get test(){}}const O=_(),ka=2**-23,Ja=.05,Ba=Object.freeze(Object.defineProperty({__proto__:null,build:Rt,ribbonlineNumRoundJoinSubdivisions:Xe},Symbol.toStringTag,{value:"Module"}));export{aa as A,Fa as H,ln as a,hn as b,sn as c,gn as d,fa as e,on as f,dn as g,za as h,_a as i,ha as j,_t as k,rn as l,cn as m,Je as n,ya as o,Zi as p,mn as q,un as r,Ta as s,mt as t,$t as u};
