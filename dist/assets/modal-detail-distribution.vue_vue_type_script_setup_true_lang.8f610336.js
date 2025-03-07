import{h}from"./moment.62d3fb0a.js";import{d as T,p as $,o as r,h as m,w as e,k as t,q as a,j,t as o,i as x,c as i,F as g,g as y,a as C,K as E,v as L,s as V,a7 as R,a8 as q,R as A,ao as F,M as Q}from"./index.21c0d750.js";const U={style:{"margin-top":"14px","background-color":"#eeeeee","border-radius":"8px",padding:".5rem"}},J=T({__name:"modal-detail-distribution",props:{show:{type:Boolean,default:!1},data:{},loading:{type:Boolean}},emits:["click:close"],setup(N,{emit:G}){const d=N;return(p,z)=>{var b,D;const w=E,B=$("router-link"),l=L,n=V,u=R,k=q,M=A,P=F,S=Q;return r(),m(S,{"mask-closable":!1,show:d.show,preset:"card",role:"dialog",size:"huge",bordered:!1,title:(D=(b=d==null?void 0:d.data)==null?void 0:b.do)==null?void 0:D.code,style:{width:"700px","max-width":"100%","border-radius":"10px"},"header-style":{paddingLeft:"30px",paddingRight:"30px",paddingBottom:"15px"},"content-style":{paddingLeft:"20px",paddingRight:"20px",paddingBottom:"20px"},"onUpdate:show":z[0]||(z[0]=c=>p.$emit("click:close",c))},{default:e(()=>[t(l,{vertical:"",size:0,style:{"padding-left":"10px","padding-right":"10px"}},{default:e(()=>{var c;return[t(l,{justify:"end"},{default:e(()=>[d.data.id_pk?(r(),m(B,{key:0,to:{name:"lacak-pk-id",params:{id:d.data.id_pk}},class:"text-decoration-none"},{default:e(()=>[t(w,{strong:"",type:"primary",class:"button-tnt"},{default:e(()=>[a("Lacak PK")]),_:1})]),_:1},8,["to"])):j("",!0)]),_:1}),t(k,{gutter:[16,10],style:{"margin-top":"14px"}},{default:e(()=>[t(u,{span:6},{default:e(()=>[t(l,{vertical:"",size:0},{default:e(()=>[t(n,{strong:""},{default:e(()=>[a("No PK")]),_:1}),t(n,null,{default:e(()=>[a(o(p.$filters.isEmpty(d.data.no_pk)),1)]),_:1})]),_:1})]),_:1}),t(u,{span:6},{default:e(()=>[t(l,{vertical:"",size:0},{default:e(()=>[t(n,{strong:""},{default:e(()=>[a("Kode Produk")]),_:1}),t(n,null,{default:e(()=>[a(o(d.data.do.products[0].code),1)]),_:1})]),_:1})]),_:1}),t(u,{span:6},{default:e(()=>[t(l,{vertical:"",size:0},{default:e(()=>[t(n,{strong:""},{default:e(()=>[a("Nama Produk")]),_:1}),t(n,null,{default:e(()=>[a(o(d.data.do.products[0].name),1)]),_:1})]),_:1})]),_:1}),t(u,{span:6},{default:e(()=>[t(l,{vertical:"",size:0},{default:e(()=>[t(n,{strong:""},{default:e(()=>[a("Nomor Batch")]),_:1}),t(n,null,{default:e(()=>[a(o(d.data.do.products[0].batch),1)]),_:1})]),_:1})]),_:1}),t(u,{span:6},{default:e(()=>[t(l,{vertical:"",size:0},{default:e(()=>[t(n,{strong:""},{default:e(()=>[a("Exp Date")]),_:1}),t(n,null,{default:e(()=>[a(o(x(h)(d.data.do.products[0].expired_date).format("yyyy-MM-DD")),1)]),_:1})]),_:1})]),_:1}),t(u,{span:6},{default:e(()=>[t(l,{vertical:"",size:0},{default:e(()=>[t(n,{strong:""},{default:e(()=>[a("Qty")]),_:1}),t(n,null,{default:e(()=>{var s,_;return[a(o((_=(s=d.data.do)==null?void 0:s.total)==null?void 0:_.qty_packed),1)]}),_:1})]),_:1})]),_:1}),t(u,{span:6},{default:e(()=>[t(l,{vertical:"",size:0},{default:e(()=>[t(n,{strong:""},{default:e(()=>[a("Tujuan")]),_:1}),t(n,null,{default:e(()=>[a(o(d.data.do.destination.name),1)]),_:1})]),_:1})]),_:1}),t(u,{span:24},{default:e(()=>[t(l,{vertical:"",size:0},{default:e(()=>[t(n,{strong:""},{default:e(()=>[a("Alamat Tujuan")]),_:1}),t(n,null,{default:e(()=>[a(o(p.$filters.setAddress(d.data.do.destination.address)),1)]),_:1})]),_:1})]),_:1})]),_:1}),(r(!0),i(g,null,y((c=d.data)==null?void 0:c.details,(s,_)=>(r(),i("div",{key:_,style:{"margin-top":"14px","background-color":"#eeeeee","border-radius":"8px",padding:".5rem"}},[t(k,{gutter:[16,10]},{default:e(()=>[t(u,{span:6},{default:e(()=>[t(l,{vertical:"",size:0},{default:e(()=>[t(n,{strong:""},{default:e(()=>[a("Tanggal Pickup")]),_:1}),t(n,null,{default:e(()=>[a(o(x(h)(s.pickup_date).format("yyyy-MM-DD")),1)]),_:2},1024)]),_:2},1024)]),_:2},1024),t(u,{span:6},{default:e(()=>[t(l,{vertical:"",size:0},{default:e(()=>[t(n,{strong:""},{default:e(()=>[a("Suhu Saat Pickup")]),_:1}),t(n,null,{default:e(()=>[a(o(p.$filters.toNumber(s.temperature_pickup_date)),1)]),_:2},1024)]),_:2},1024)]),_:2},1024),t(u,{span:6},{default:e(()=>[t(l,{vertical:"",size:0},{default:e(()=>[t(n,{strong:""},{default:e(()=>[a("Tanggal Diterima")]),_:1}),t(n,null,{default:e(()=>[a(o(x(h)(s.receive_date).format("yyyy-MM-DD")),1)]),_:2},1024)]),_:2},1024)]),_:2},1024),t(u,{span:6},{default:e(()=>[t(l,{vertical:"",size:0},{default:e(()=>[t(n,{strong:""},{default:e(()=>[a("Suhu Saat Diterima")]),_:1}),t(n,null,{default:e(()=>[a(o(p.$filters.toNumber(s.temperature_received_date)),1)]),_:2},1024)]),_:2},1024)]),_:2},1024),t(u,{span:6},{default:e(()=>[t(l,{vertical:"",size:0},{default:e(()=>[t(n,{strong:""},{default:e(()=>[a("Nama Penerima")]),_:1}),t(n,null,{default:e(()=>[a(o(s.receiver_name),1)]),_:2},1024)]),_:2},1024)]),_:2},1024),t(u,{span:24},{default:e(()=>[t(l,{vertical:"",size:0},{default:e(()=>[t(n,{strong:""},{default:e(()=>[a("Data Driver")]),_:1}),(r(!0),i(g,null,y(s.driver_detail,(f,v)=>(r(),m(l,{key:v},{default:e(()=>[t(n,null,{default:e(()=>[a("Nama Driver : "+o(f.name),1)]),_:2},1024),t(n,null,{default:e(()=>[a("Plat Nomor : "+o(f.plate_number),1)]),_:2},1024)]),_:2},1024))),128))]),_:2},1024)]),_:2},1024)]),_:2},1024)]))),128)),C("div",U,[t(k,{gutter:[16,10]},{default:e(()=>[t(u,{span:24},{default:e(()=>{var s,_;return[t(l,{vertical:""},{default:e(()=>[t(n,{strong:""},{default:e(()=>[a("Evidence Saat Diterima")]),_:1})]),_:1}),(r(!0),i(g,null,y((_=(s=d.data)==null?void 0:s.do)==null?void 0:_.finish_info,(f,v)=>(r(),i("div",{key:v,style:{"margin-top":"14px","background-color":"#ffffff","border-radius":"8px",padding:".5rem"}},[t(l,{vertical:"",size:0},{default:e(()=>[t(n,{strong:""},{default:e(()=>[a("Kode Manifest")]),_:1}),t(n,null,{default:e(()=>[a(o(f.manifest_id),1)]),_:2},1024)]),_:2},1024),t(l,{style:{"margin-top":"14px"}},{default:e(()=>[t(P,null,{default:e(()=>[t(l,null,{default:e(()=>[(r(!0),i(g,null,y(f.images,K=>(r(),m(M,{width:"60",src:K.url},null,8,["src"]))),256))]),_:2},1024)]),_:2},1024)]),_:2},1024)]))),128))]}),_:1})]),_:1})])]}),_:1})]),_:1},8,["show","title"])}}});export{J as _};
