import{r,f as d,a0 as s,W as t}from"./index.21c0d750.js";function a(){const e=r(window.innerWidth),n=()=>e.value=window.innerWidth;d(()=>window.addEventListener("resize",n)),s(()=>window.removeEventListener("resize",n));const o=t(()=>e.value<=1080?"tablet":e.value>1080?"desktop":null),i=t(()=>e.value);return{type:o,width:i}}export{a as u};
