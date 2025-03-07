import{_ as V}from"./t-loading.vue_vue_type_script_setup_true_lang.71bf4981.js";import{e as D}from"./exportFromJSON.6e5672c8.js";import{s as I}from"./serialisasi.378d5040.js";import{h as L}from"./moment.62d3fb0a.js";import{d as J,E as P,r as y,G as N,W as F,o as l,h as k,w as a,k as s,q as f,t as n,j as b,i as d,c as r,F as g,a as t,g as E,s as Q,v as q,a7 as W,a8 as j,K as G,aa as H,ab as O,M as U}from"./index.21c0d750.js";const A={style:{"margin-top":"15px"}},X=t("thead",null,[t("tr",null,[t("th",null,"No"),t("th",null,"Kode Serialisasi"),t("th",null,"Tanggal"),t("th",null,"Jam"),t("th",null,"Status")])],-1),Y={"data-label":"No"},Z={"data-label":"Kode Serialisasi"},tt={"data-label":"Tanggal"},et={"data-label":"Jam"},at={"data-label":"Status"},ot={key:1},st=t("td",{colspan:"4",style:{"text-align":"center"}}," Belum ada data tersedia ",-1),nt=[st],lt={style:{"margin-top":"15px"}},it=t("thead",null,[t("tr",null,[t("th",null,"No"),t("th",null,"Kode Serialisasi"),t("th",null,"Batch"),t("th",null,"Exp Date")])],-1),dt={"data-label":"No"},rt={"data-label":"Kode Serialisasi"},_t={"data-label":"Batch"},pt={"data-label":"Exp Date"},ct={key:1},ut=t("td",{colspan:"4",style:{"text-align":"center"}}," Belum ada data tersedia ",-1),mt=[ut],Bt=J({__name:"modal-data-integrasi",props:{show:{type:Boolean,default:!1},isLog:{type:Boolean,default:!1},serializeDetailDataRes:{},loading:{type:Boolean}},emits:["update:show"],setup(R,{emit:ht}){const u=R,z=P(),x=y(!1),m=y([]),w=y(!1),S=y({});N(()=>u.show,e=>{});const T=F(()=>u.isLog?"Log Cetak":"Data QR Code");function ft(){w.value=!w.value}function gt(){const e=[];S.value.forEach((p,v)=>{e.push({No:v+1,"Wh Building":p.building_name,Room:p.room_name,"Rack/Pallete":p.rack_pallete,Bin:p.bin,"Qty Stok":p.qty,Batch:""})});const c=e,o="Data_Integrasi",_=D.types.csv;c&&D({data:c,fileName:o,exportType:_})}async function $(){const c={printer_key:localStorage.getItem("select-printer")};x.value=!0,I.postReportDriverPrinter(c).then(o=>{m.value=o.data.message}).then(o=>{if(o!=null&&o.response){const _=o.response.data;z.error(_.message)}}).finally(()=>{x.value=!1})}return N(()=>u.show,e=>{e&&$()}),(e,c)=>{const o=Q,_=q,p=W,v=j,K=V,yt=G,B=H,C=O,M=U;return l(),k(M,{"mask-closable":!1,show:u.show,preset:"card",role:"dialog",size:"huge",bordered:!1,title:d(T),style:{width:"800px","max-width":"100%","border-radius":"10px"},"header-style":{paddingLeft:"30px",paddingRight:"30px",paddingBottom:"15px"},"content-style":{paddingLeft:"20px",paddingRight:"20px",paddingBottom:"20px"},"onUpdate:show":c[0]||(c[0]=i=>e.$emit("update:show",i))},{default:a(()=>[s(_,{vertical:"",size:0,style:{"padding-left":"10px","padding-right":"10px"}},{default:a(()=>[s(o,{strong:"",style:{"font-size":"16px"}},{default:a(()=>[f(n(e.serializeDetailDataRes.product.long_name),1)]),_:1}),s(v,{gutter:16},{default:a(()=>[s(p,{span:12},{default:a(()=>[s(_,{vertical:"",size:0},{default:a(()=>[s(o,null,{default:a(()=>[f("Kode Perintah Kemas : "+n(e.serializeDetailDataRes.pk_id),1)]),_:1}),s(o,null,{default:a(()=>[f("Kode Produk : "+n(e.serializeDetailDataRes.product.item_code),1)]),_:1})]),_:1})]),_:1}),u.isLog?b("",!0):(l(),k(p,{key:0,span:12},{default:a(()=>[s(_,{vertical:"",size:0},{default:a(()=>[s(o,null,{default:a(()=>[f("ID Batch : "+n("KHJ67"))]),_:1}),s(o,null,{default:a(()=>[f("Qty Item : "+n(800))]),_:1})]),_:1})]),_:1}))]),_:1}),d(x)?(l(),k(K,{key:0})):(l(),r(g,{key:1},[u.isLog?(l(),r(g,{key:0},[d(m).length>0?(l(),k(_,{key:0,vertical:"",size:0,align:"end"},{default:a(()=>[b("",!0)]),_:1})):b("",!0),t("div",A,[s(C,{"x-scrollable":""},{default:a(()=>[s(B,{"single-line":!1},{default:a(()=>[X,t("tbody",null,[d(m).length>0?(l(!0),r(g,{key:0},E(d(m),(i,h)=>(l(),r("tr",{key:h},[t("td",Y,n(h+1),1),t("td",Z,n(e.$filters.isEmpty(i.message)),1),t("td",tt,n(e.$filters.isEmpty(i.scan_at&&d(L)(i.scan_at).format("L"))),1),t("td",et,n(e.$filters.isEmpty(i.scan_at&&d(L)(i.scan_at).format("LT"))),1),t("td",at,n(e.$filters.isEmpty(i.scan_status)),1)]))),128)):(l(),r("tr",ot,nt))])]),_:1})]),_:1})])],64)):(l(),r(g,{key:1},[b("",!0),t("div",lt,[s(C,{"x-scrollable":""},{default:a(()=>[s(B,{"single-line":!1},{default:a(()=>[it,t("tbody",null,[d(m).length>0?(l(!0),r(g,{key:0},E(d(m),(i,h)=>(l(),r("tr",{key:h},[t("td",dt,n(h+1),1),t("td",rt,n(e.$filters.isEmpty(i.message)),1),t("td",_t,n(e.$filters.isEmpty(i.room_name)),1),t("td",pt,n(e.$filters.isEmpty(i.rack_pallete)),1)]))),128)):(l(),r("tr",ct,mt))])]),_:1})]),_:1})])],64))],64))]),_:1})]),_:1},8,["show","title"])}}});export{Bt as _};
