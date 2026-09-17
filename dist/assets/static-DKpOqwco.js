import{fi as S}from"./index-o98Aja7I.js";/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const u=Symbol.for(""),d=t=>{if((t==null?void 0:t.r)===u)return t==null?void 0:t._$litStatic$},b=t=>({_$litStatic$:t,r:u}),m=(t,...i)=>({_$litStatic$:i.reduce((o,a,l)=>o+(r=>{if(r._$litStatic$!==void 0)return r._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${r}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`)})(a)+t[l+1],t[0]),r:u}),p=new Map,h=t=>(i,...o)=>{const a=o.length;let l,r;const s=[],$=[];let n,e=0,c=!1;for(;e<a;){for(n=i[e];e<a&&(r=o[e],(l=d(r))!==void 0);)n+=l+i[++e],c=!0;e!==a&&$.push(r),s.push(n),e++}if(e===a&&s.push(i[a]),c){const f=s.join("$$lit$$");(i=p.get(f))===void 0&&(s.raw=s,p.set(f,i=s)),o=$}return t(i,...o)},v=h(S);export{m as i,b as s,v as u};
