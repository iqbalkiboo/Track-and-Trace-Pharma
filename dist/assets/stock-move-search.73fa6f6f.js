import{m as k,o as y,h as g,w as n,k as e,q as t,aG as v,am as x,an as b,v as h,a7 as S,a8 as $,L as w,ak as I,K as M}from"./index.21c0d750.js";const N={methods:{onSaveStockIn(){this.$router.push("/penyimpanan/bin/stock-move-list")}}};function j(_,a,B,C,D,c){const p=v,s=x,u=b,o=h,i=S,m=$,r=w,d=I,f=M;return y(),g(o,{vertical:"",style:{padding:"1rem"}},{default:n(()=>[e(m,{cols:12,style:{display:"flex","justify-content":"space-between","align-items":"center"}},{default:n(()=>[e(i,{span:12},{default:n(()=>[e(o,{vertical:"",size:0},{default:n(()=>[e(p,{style:{"margin-bottom":"0"}},{default:n(()=>[t(" Penyimpanan ")]),_:1}),e(u,null,{default:n(()=>[e(s,{href:"/penyimpanan/detail-bin"},{default:n(()=>[t("Stock Move")]),_:1}),e(s,null,{default:n(()=>[t("Scan")]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),e(r,{style:{"text-align":"center"}},{default:n(()=>[t(" Silahkan masukkan ID Rack pada kolom yang tersedia ")]),_:1}),e(o,{vertical:"",style:{"text-align":"center"}},{default:n(()=>[e(d,{value:_.value,"onUpdate:value":a[0]||(a[0]=l=>_.value=l),type:"text",placeholder:"Masukkan ID Rack",style:{width:"500px","max-width":"200%"}},null,8,["value"]),e(f,{type:"primary",style:{"margin-left":"10px"},onClick:a[1]||(a[1]=l=>c.onSaveStockIn())},{default:n(()=>[t(" Lanjutkan ")]),_:1})]),_:1})]),_:1})}const R=k(N,[["render",j]]);export{R as default};
