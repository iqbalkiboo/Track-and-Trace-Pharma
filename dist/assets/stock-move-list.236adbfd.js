import{d as f,p as k,o as d,h as x,w as n,k as e,q as o,a as t,c as A,F as v,g as N,t as a,aG as B,am as q,an as w,v as C,a7 as S,a8 as E,L as M,aa as T,K as D}from"./index.21c0d750.js";const K=t("thead",null,[t("tr",null,[t("th",null,"No"),t("th",null,"Bin"),t("th",null,"Item"),t("th",null,"Tersier Code"),t("th",null,"Batch"),t("th",null,"Qty")])],-1),L=t("strong",null,"[NAMA RACK SEBELUM]",-1),R=t("strong",null,"[NAMA RACK SESUDAH]",-1),V={style:{"margin-top":"25px"}},P=f({__name:"stock-move-list",setup(F){const p=[{product:"Paracetamol (500)",bin:"A01.02.03",tersier_code:"541726 68299",batch:"57578865",qty:"215"},{product:"Indovac (700)",bin:"A01.02.03",tersier_code:"541726 68299",batch:"57578865",qty:"10"},{product:"Oskadon Oye (1000)",bin:"A01.02.03",tersier_code:"541726 68299",batch:"57578865",qty:"300"},{product:"Napacin (200)",bin:"A01.02.03",tersier_code:"541726 68299",batch:"57578865",qty:"20"},{product:"Neo-remachyl (100)",bin:"A01.02.03",tersier_code:"541726 68299",batch:"57578865",qty:"70"}];return(H,I)=>{const m=B,_=q,h=w,s=C,b=S,y=E,c=M,g=T,r=D,u=k("router-link");return d(),x(s,{vertical:"",style:{padding:"1rem"}},{default:n(()=>[e(y,{cols:12,style:{display:"flex","justify-content":"space-between","align-items":"center"}},{default:n(()=>[e(b,{span:12},{default:n(()=>[e(s,{vertical:"",size:0},{default:n(()=>[e(m,{style:{"margin-bottom":"0"}},{default:n(()=>[o(" Penyimpanan ")]),_:1}),e(h,null,{default:n(()=>[e(_,null,{default:n(()=>[o("Stock Move")]),_:1}),e(_,null,{default:n(()=>[o("Scan")]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),e(c,{style:{"text-align":"center","margin-bottom":"2rem"}},{default:n(()=>[o(" Apakah Anda akan memindahkan item berikut ")]),_:1}),e(g,{bordered:!1,"single-line":!1},{default:n(()=>[K,t("tbody",null,[(d(),A(v,null,N(p,(l,i)=>t("tr",{key:i},[t("td",null,a(i+1),1),t("td",null,a(l.bin),1),t("td",null,a(l.product),1),t("td",null,a(l.tersier_code),1),t("td",null,a(l.batch),1),t("td",null,a(l.qty),1)])),64))])]),_:1}),e(c,{style:{"text-align":"center","margin-bottom":"2rem"}},{default:n(()=>[o(" Dari Rack "),L,o(" ke "),R,t("div",V,[e(u,{to:{name:"penyimpanan-bin-stock-move-search"},style:{"text-decoration":"none"}},{default:n(()=>[e(r,{type:"error",style:{"margin-right":"10px",width:"200px"}},{default:n(()=>[o(" Tidak ")]),_:1})]),_:1}),e(u,{to:{name:"penyimpanan-bin-stock-move-success"},style:{"text-decoration":"none"}},{default:n(()=>[e(r,{type:"primary",style:{"margin-left":"10px",width:"200px"}},{default:n(()=>[o(" Ya, Betul ")]),_:1})]),_:1})])]),_:1})]),_:1})}}});export{P as default};
