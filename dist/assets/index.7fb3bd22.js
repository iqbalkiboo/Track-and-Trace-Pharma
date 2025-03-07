import{_ as ge}from"./t-feedback.vue_vue_type_script_setup_true_lang.83eb0b14.js";import{_ as ve}from"./t-not-granted.vue_vue_type_script_setup_true_lang.a30cf979.js";import{_ as ke}from"./t-loading.vue_vue_type_script_setup_true_lang.71bf4981.js";import{d as B,o as r,c as m,a as n,u as we,E as ye,r as u,a1 as be,f as xe,aF as C,p as Pe,k as t,w as a,q as d,i as e,h as g,N as $,j as T,F as M,g as Ce,t as p,ah as A,Q as U,af as $e,am as Me,an as ze,K as Ie,v as Te,ak as Ae,a7 as Be,H as Ne,a8 as De,a9 as Ve,y as Ee,aa as Se,ab as Ge,ag as He}from"./index.21c0d750.js";import{c as f}from"./constant.549d5c21.js";import{m as q}from"./index.c20e8c5b.js";import{t as Fe}from"./type.86a7443c.js";import{_ as Oe}from"./modal-import-excel.vue_vue_type_script_setup_true_lang.17dabce3.js";import{A as R}from"./Add.4f3b52cf.js";import{E as Le}from"./EllipsisVertical.56989e7a.js";import{P as Ue}from"./Pencil.0b65f5de.js";import{H as qe}from"./HelpCircleOutline.a54a41ed.js";import{C as Re}from"./CheckmarkCircleOutline.8fddcae1.js";import"./AlertCircleOutline.19cf574c.js";import"./getHoldingId.48f570fc.js";const je={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},Ke=n("path",{d:"M64 164v244a56 56 0 0 0 56 56h272a56 56 0 0 0 56-56V164a4 4 0 0 0-4-4H68a4 4 0 0 0-4 4zm267 151.63l-63.69 63.68a16 16 0 0 1-22.62 0L181 315.63c-6.09-6.09-6.65-16-.85-22.38a16 16 0 0 1 23.16-.56L240 329.37V224.45c0-8.61 6.62-16 15.23-16.43A16 16 0 0 1 272 224v105.37l36.69-36.68a16 16 0 0 1 23.16.56c5.8 6.37 5.24 16.29-.85 22.38z",fill:"currentColor"},null,-1),Qe=n("rect",{x:"32",y:"48",width:"448",height:"80",rx:"32",ry:"32",fill:"currentColor"},null,-1),Je=[Ke,Qe],We=B({name:"Archive",render:function(v,k){return r(),m("svg",je,Je)}}),Xe={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},Ye=n("path",{d:"M428 224H288a48 48 0 0 1-48-48V36a4 4 0 0 0-4-4h-92a64 64 0 0 0-64 64v320a64 64 0 0 0 64 64h224a64 64 0 0 0 64-64V228a4 4 0 0 0-4-4zm-92 160H176a16 16 0 0 1 0-32h160a16 16 0 0 1 0 32zm0-80H176a16 16 0 0 1 0-32h160a16 16 0 0 1 0 32z",fill:"currentColor"},null,-1),Ze=n("path",{d:"M419.22 188.59L275.41 44.78a2 2 0 0 0-3.41 1.41V176a16 16 0 0 0 16 16h129.81a2 2 0 0 0 1.41-3.41z",fill:"currentColor"},null,-1),et=[Ye,Ze],tt=B({name:"DocumentText",render:function(v,k){return r(),m("svg",Xe,et)}}),nt={class:"body-tnt"},at={class:"card-tnt"},ot={class:"table-tnt"},st=n("thead",null,[n("tr",null,[n("th",{style:{"text-align":"center"}},"No"),n("th",null,"Nama Produk"),n("th",null,"Nama Panjang"),n("th",null,"Kode Item"),n("th",null,"Tipe produk"),n("th",null,"UOM"),n("th",{style:{"text-align":"center"}},"Serialisasi"),n("th",{style:{"text-align":"center"}},"Aksi")])],-1),lt={style:{"text-align":"center"}},it={style:{"text-align":"center"}},ct={style:{"text-align":"center"}},rt={class:"table-footer"},Ct=B({__name:"index",setup(N){const v=we(),k=ye(),w=u(!1),y=u(!1),b=u({}),D=u({id:"",name:""}),c=u({q:"",dir:"desc",sort:"created_at",page:1,limit:10,product_type:null}),o=u({show:u(!1),type:"",icon:be(),iconColor:"",hideIcon:!1,title:"",subtitle:""}),V=u([]),z=l=>()=>U($,null,{default:()=>U(l)}),x=u([]);xe(()=>{j(),C.isGranted(f.accessPrivileges.product+".list")&&(_(),K())});function j(){C.isGranted(f.accessPrivileges.product+".detail")&&x.value.push({label:"Detail",key:"detail",icon:z(tt)}),C.isGranted(f.accessPrivileges.product+".update")&&x.value.push({label:"Edit",key:"edit",icon:z(Ue)}),C.isGranted(f.accessPrivileges.product+".archive")&&x.value.push({label:"Arsip",key:"archive",icon:z(We)})}async function _(){w.value=!0,await q.getProduct(c.value).then(l=>{b.value=l.data.data,w.value=!1,o.value.show=!1}).catch(l=>{w.value=!1;const s=l.response.data;k.error(s.message)})}async function K(){await Fe.getType({limit:100}).then(l=>{l.data.data.list.forEach(s=>{V.value.push({label:s.name,value:s.id})}),o.value.show=!1}).catch(l=>{const s=l.response.data;k.error(s.message)})}const E=u(0);function Q(){c.value.page=1,clearTimeout(E.value),E.value=setTimeout(function(){_()},600)}function J(l){c.value.page=1,c.value.limit=l,_()}function W(l,s){switch(l){case"detail":v.push({name:"setting-master-produk-id",params:{id:s}});break;case"edit":v.push({path:`/setting/master-produk/update/${s}`});break;case"delete":D.value.id=s,Y();break}}function S(){o.value.show=!1}function X(){o.value.type="success",o.value.icon=Re,o.value.iconColor="#219653",o.value.title="Berhasil",o.value.subtitle="Anda berhasil menghapus data Produk",o.value.show=!0}function Y(){o.value.type="delete",o.value.icon=qe,o.value.iconColor="#EB5757",o.value.title="Perhatian",o.value.subtitle="Apakah Anda yakin untuk menghapus data Produk?",o.value.show=!0}function Z(){y.value=!0,q.deleteProduct(D.value.id).then(()=>{y.value=!1,_(),setTimeout(()=>{X()},300)})}const I=u(!1);function ee(l){l.preventDefault(),I.value=!0}function te(){I.value=!1}return(l,s)=>{const ne=$e,ae=Me,oe=ze,h=Ie,se=Pe("router-link"),G=Te,le=Ae,H=Be,ie=Ne,ce=De,re=ke,ue=Ve,de=Ee,_e=Se,pe=Ge,me=He,he=ve,fe=ge;return r(),m(M,null,[n("div",nt,[t(ne,{style:{"margin-bottom":"4px"}},{default:a(()=>[d("Master Produk")]),_:1}),t(oe,null,{default:a(()=>[t(ae,null,{default:a(()=>[d("Master Produk")]),_:1})]),_:1}),n("div",at,[l.$filters.isGranted(e(f).accessPrivileges.product+".create")?(r(),g(G,{key:0},{default:a(()=>[t(se,{to:"/setting/master-produk/create/1",class:"text-decoration-none"},{default:a(()=>[t(h,{color:"#219653",class:"button-tnt"},{icon:a(()=>[t(e($),null,{default:a(()=>[t(e(R))]),_:1})]),default:a(()=>[d(" Tambah Produk ")]),_:1})]),_:1}),t(h,{color:"#219653",class:"button-tnt",onClick:ee},{icon:a(()=>[t(e($),null,{default:a(()=>[t(e(R))]),_:1})]),default:a(()=>[d(" Import Data Excel ")]),_:1})]),_:1})):T("",!0),l.$filters.isGranted(e(f).accessPrivileges.product+".list")?(r(),m(M,{key:1},[t(ce,{gutter:"16",style:{"margin-top":"24px"}},{default:a(()=>[t(H,{span:6},{default:a(()=>[t(le,{value:e(c).q,"onUpdate:value":s[0]||(s[0]=i=>e(c).q=i),onInput:Q,type:"text",placeholder:"Cari Nama Produk"},null,8,["value"])]),_:1}),t(H,{span:6},{default:a(()=>[t(ie,{value:e(c).product_type,"onUpdate:value":[s[1]||(s[1]=i=>e(c).product_type=i),s[2]||(s[2]=i=>_())],options:e(V),filterable:"",clearable:"",placeholder:"Pilih Tipe Produk",class:"select-tnt"},null,8,["value","options"])]),_:1})]),_:1}),n("div",ot,[e(w)?(r(),g(re,{key:0})):(r(),g(pe,{key:1,"x-scrollable":""},{default:a(()=>[t(_e,{"single-line":!1},{default:a(()=>[st,n("tbody",null,[(r(!0),m(M,null,Ce(e(b).list,(i,F)=>(r(),m("tr",{key:F},[n("td",lt,p(e(c).limit*(e(c).page-1)+(F+1)),1),n("td",null,p(i.short_name),1),n("td",null,p(l.$filters.isEmpty(i.long_name)),1),n("td",null,p(i.item_code),1),n("td",null,p(i.product_types.name),1),n("td",null,p(i.uom.name),1),n("td",it,[t(ue,{bordered:!1,type:"primary"},{default:a(()=>{var P,O,L;return[d(p(((P=i.serialize.kind)==null?void 0:P.value)=="authentication_bpom"?"Authentication BPOM":((O=i.serialize.kind)==null?void 0:O.value)=="authentication_gtin"?"Authentication GTIN":((L=i.serialize.kind)==null?void 0:L.value)=="identification_bpom"?"Identifikasi BPOM":"-"),1)]}),_:2},1024)]),n("td",ct,[t(de,{placement:"bottom-end",options:e(x),onSelect:P=>W(P,i.id)},{default:a(()=>[t(h,{tertiary:""},{icon:a(()=>[t(e($),null,{default:a(()=>[t(e(Le))]),_:1})]),_:1})]),_:2},1032,["options","onSelect"])])]))),128))])]),_:1})]),_:1})),n("div",rt,[t(me,{page:e(c).page,"onUpdate:page":[s[3]||(s[3]=i=>e(c).page=i),_],"page-count":e(b).total_page,"page-slot":7,"show-size-picker":e(b).total_data>10,"page-sizes":[10,20,30,40,50],"onUpdate:pageSize":J},null,8,["page","page-count","show-size-picker"])])])],64)):(r(),g(he,{key:2}))])]),t(Oe,{"is-show-modal":e(I),onHideModal:te,onGetData:_},null,8,["is-show-modal"]),t(fe,{show:e(o).show,"onUpdate:show":s[4]||(s[4]=i=>e(o).show=i),icon:e(o).icon,"icon-color":e(o).iconColor,"hide-icon":e(o).hideIcon,title:e(o).title,subtitle:e(o).subtitle},{default:a(()=>[t(G,{justify:"center"},{default:a(()=>[e(o).type=="success"?(r(),g(h,{key:0,color:"#828282",class:"button-tnt",onClick:A(S,["prevent"])},{default:a(()=>[d(" Tutup ")]),_:1},8,["onClick"])):T("",!0),e(o).type=="delete"?(r(),m(M,{key:1},[t(h,{color:"#828282",class:"button-tnt",loading:e(y),onClick:A(S,["prevent"])},{default:a(()=>[d(" Tidak ")]),_:1},8,["loading","onClick"]),t(h,{color:"#EB5757",class:"button-tnt",loading:e(y),style:{"padding-left":"25px","padding-right":"25px"},onClick:A(Z,["prevent"])},{default:a(()=>[d(" Iya ")]),_:1},8,["loading","onClick"])],64)):T("",!0)]),_:1})]),_:1},8,["show","icon","icon-color","hide-icon","title","subtitle"])],64)}}});export{Ct as default};
