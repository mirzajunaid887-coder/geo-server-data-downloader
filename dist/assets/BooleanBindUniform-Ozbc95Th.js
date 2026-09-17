import{kk as u,gP as x,aL as d,ii as p,fP as g,hW as n,c2 as _}from"./index-o98Aja7I.js";import{D as m,E as v,e as w,F as O,A as z}from"./TriangleTechniqueConfiguration-BbVmpokX.js";import{t as o}from"./oitResolution.glsl-DnN_jdFk.js";import{e as P,s as $,i as S}from"./SceneLighting-C8zPZjrj.js";import{c as T}from"./NoParameters-DB-WZ6gy.js";function C(r){r.uniforms.add(new m("zProjectionMap",e=>M(e.camera))),r.code.add(o`float linearizeDepth(float depth, vec2 zProjectionConstants) {
float depthNdc = depth * 2.0 - 1.0;
return -(zProjectionConstants[0] / (depthNdc + zProjectionConstants[1] + 1e-7));
}
float linearizeDepth(float depth) {
return linearizeDepth(depth, zProjectionMap);
}`),r.code.add(o`float delinearizeDepth(float linearDepth) {
float c1 = zProjectionMap[0];
float c2 = zProjectionMap[1];
float depthNdc = (-c1/linearDepth) - c2 - 1e-7;
float depthNonlinear01 = (depthNdc + 1.0 ) / 2.0;
return depthNonlinear01;
}`),r.code.add(o`float depthFromTexture(sampler2D depthTexture, vec2 uv) {
ivec2 iuv = ivec2(uv * vec2(textureSize(depthTexture, 0)));
return texelFetch(depthTexture, iuv, 0).r;
}`),r.code.add(o`float linearDepthFromTexture(sampler2D depthTexture, vec2 uv) {
return linearizeDepth(depthFromTexture(depthTexture, uv));
}`)}function M(r){const e=r.projectionMatrix;return u(N,e[14],e[10])}const N=x();function H(r){r.fragment.uniforms.add(new P("projInfo",e=>D(e.camera))),r.fragment.uniforms.add(new m("zScale",e=>L(e.camera))),r.fragment.code.add(o`vec3 reconstructPosition(vec2 fragCoord, float depth) {
return vec3((fragCoord * projInfo.xy + projInfo.zw) * (zScale.x * depth + zScale.y), depth);
}`)}function D(r){const e=r.projectionMatrix;return e[11]===0?d(h,2/(r.fullWidth*e[0]),2/(r.fullHeight*e[5]),(1+e[12])/e[0],(1+e[13])/e[5]):d(h,-2/(r.fullWidth*e[0]),-2/(r.fullHeight*e[5]),(1-e[8])/e[0],(1-e[9])/e[5])}const h=p();function L(r){return r.projectionMatrix[11]===0?u(f,0,1):u(f,1,0)}const f=x();class b extends v{constructor(e,t,s){super(e,"mat4",1,(i,a,c)=>i.setUniformMatrix4fv(e,t(a,c),s))}}class A{constructor(e){this.screenLength=g(e.screenLength),this.minWorldLength=e.minWorldLength??0,this.maxWorldLength=e.maxWorldLength??1/0}}function k(r,e){const t=r.vertex;e.hasVerticalOffset?(W(t),e.hasScreenSizePerspective&&(r.include($),S(t),O(r.vertex,e)),t.code.add(o`
      vec3 calculateVerticalOffset(vec3 worldPos, vec3 localOrigin) {
        float viewDistance = length((view * vec4(worldPos, 1.0)).xyz);
        ${e.spherical?o`vec3 worldNormal = normalize(worldPos + localOrigin);`:o`vec3 worldNormal = vec3(0.0, 0.0, 1.0);`}
        ${e.hasScreenSizePerspective?o`
            float cosAngle = dot(worldNormal, normalize(worldPos - cameraPosition));
            float verticalOffsetScreenHeight = screenSizePerspectiveScaleFloat(verticalOffset.x, abs(cosAngle), viewDistance, screenSizePerspectiveAlignment);`:o`
            float verticalOffsetScreenHeight = verticalOffset.x;`}
        // Screen sized offset in world space, used for example for line callouts
        float worldOffset = clamp(verticalOffsetScreenHeight * verticalOffset.y * viewDistance, verticalOffset.z, verticalOffset.w);
        return worldNormal * worldOffset;
      }

      vec3 addVerticalOffset(vec3 worldPos, vec3 localOrigin) {
        return worldPos + calculateVerticalOffset(worldPos, localOrigin);
      }
    `)):t.code.add(o`vec3 addVerticalOffset(vec3 worldPos, vec3 localOrigin) { return worldPos; }`)}const j=p();function W(r){r.uniforms.add(new w("verticalOffset",(e,t)=>{const{minWorldLength:s,maxWorldLength:i,screenLength:a}=e.verticalOffset,c=Math.tan(.5*t.camera.fovY)/(.5*t.camera.fullViewport[3]),l=t.camera.pixelRatio||1;return d(j,a*l,c,s,i)}))}let U=class extends z{constructor(e){super(e),this._numLoading=0,this._disposed=!1,this._textures=e.textures,this.updateTexture(e.textureId),this._acquire(e.normalTextureId,t=>this._textureNormal=t),this._acquire(e.emissiveTextureId,t=>this._textureEmissive=t),this._acquire(e.occlusionTextureId,t=>this._textureOcclusion=t),this._acquire(e.metallicRoughnessTextureId,t=>this._textureMetallicRoughness=t)}dispose(){super.dispose(),this._texture=n(this._texture),this._textureNormal=n(this._textureNormal),this._textureEmissive=n(this._textureEmissive),this._textureOcclusion=n(this._textureOcclusion),this._textureMetallicRoughness=n(this._textureMetallicRoughness),this._disposed=!0}ensureResources(e){return this._numLoading===0?2:1}get textureBindParameters(){var e,t,s,i,a;return new R(((e=this._texture)==null?void 0:e.texture)??null,((t=this._textureNormal)==null?void 0:t.texture)??null,((s=this._textureEmissive)==null?void 0:s.texture)??null,((i=this._textureOcclusion)==null?void 0:i.texture)??null,((a=this._textureMetallicRoughness)==null?void 0:a.texture)??null)}updateTexture(e){this._texture!=null&&e===this._texture.id||(this._texture=n(this._texture),this._acquire(e,t=>this._texture=t))}_acquire(e,t){if(e==null)return void t(null);const s=this._textures.acquire(e);if(_(s))return++this._numLoading,void s.then(i=>{if(this._disposed)return n(i),void t(null);t(i)}).finally(()=>--this._numLoading);t(s)}};class I extends T{constructor(e=null){super(),this.textureEmissive=e}}class R extends I{constructor(e,t,s,i,a,c,l){super(s),this.texture=e,this.textureNormal=t,this.textureOcclusion=i,this.textureMetallicRoughness=a,this.scale=c,this.normalTextureTransformMatrix=l}}class Y extends v{constructor(e,t){super(e,"bool",0,(s,i)=>s.setUniform1b(e,t(i)))}}export{C as a,U as b,H as c,W as d,A as e,M as i,R as l,k as n,Y as r,b as t};
