import{_ as me}from"./t-feedback.vue_vue_type_script_setup_true_lang.83eb0b14.js";import{_ as fe}from"./t-loading.vue_vue_type_script_setup_true_lang.71bf4981.js";import{d as U,o as _,c as f,a as n,b as he,E as ge,r,a1 as ve,f as ye,e as ke,p as be,i as e,k as t,F as L,w as a,q as u,t as d,h as T,g as we,j as A,af as ze,a9 as xe,v as Se,s as Ce,a7 as De,ac as $e,ar as Le,L as Ne,a8 as Be,H as Ee,N as Pe,K as Te,y as Me,aa as Oe}from"./index.21c0d750.js";import{r as Ie}from"./render-icon.8c81e0de.js";import{h as je}from"./moment.62d3fb0a.js";import{s as N}from"./serialisasi-external.c8482290.js";import{_ as qe}from"./modal-edit-serialisasi.vue_vue_type_script_setup_true_lang.8f9a1f4d.js";import{E as Fe}from"./EllipsisVertical.56989e7a.js";import{C as Ke}from"./CheckmarkCircleOutline.8fddcae1.js";import"./getCompanyId.7d0eb93b.js";const Re={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},Ve=n("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32",d:"M364.13 125.25L87 403l-23 45l44.99-23l277.76-277.13l-22.62-22.62z"},null,-1),Ae=n("path",{d:"M420.69 68.69l-22.62 22.62l22.62 22.63l22.62-22.63a16 16 0 0 0 0-22.62h0a16 16 0 0 0-22.62 0z",fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32"},null,-1),Ue=[Ve,Ae],He=U({name:"PencilOutline",render:function(y,k){return _(),f("svg",Re,Ue)}}),Qe={class:"body-tnt"},Ge={key:0,class:"card-tnt"},Je={class:"card-tnt",style:{"margin-top":"0"}},We={class:"table-tnt"},Xe=n("thead",null,[n("tr",null,[n("th",null,"No"),n("th",null,"Kode Serialisasi"),n("th",null,"Batch"),n("th",{style:{"text-align":"center"}},"Level"),n("th",{style:{"text-align":"center"}},"Qty"),n("th",{style:{"text-align":"center",width:"3rem"}},"Aksi")])],-1),Ye={style:{"text-align":"center"}},Ze={style:{"text-align":"center"}},et={"data-label":"Aksi",style:{"text-align":"center"}},tt={key:1},at=n("td",{colspan:"6",style:{"text-align":"center"}}," Belum ada data tersedia ",-1),nt=[at],ot={class:"bottom-action-button"},st={class:"action-item"},ht=U({__name:"detail-produk",setup(H){const y=he(),k=ge(),Q=r(),B=r(!1),h=r(!1),C=r(!1),g=r({}),b=r({}),E=r({}),w=r({sort:"desc",dir:"serialize.level",import_serialization_id:y.params.id,import_serialization_product_id:y.query.product_id,is_scan:null,limit:1e4}),G=r([{label:"Semua",value:null},{label:"Sudah discan",value:!0},{label:"Belum discan",value:!1}]),J=r([{label:"Level Tertinggi",value:"desc"},{label:"Level Terendah",value:"asc"}]),W=[{label:"Edit Serialisasi",key:"edit",icon:Ie(He)}],c=r({show:!1,form:{},data:{},loading:h}),o=r({show:r(!1),type:"",icon:ve(),iconColor:"",hideIcon:!1,title:"",subtitle:"",align:"center"});ye(()=>{Q.value=ke.getAuth(),X()});async function X(){B.value=!0,Y(),await Z(),await D(),B.value=!1}async function Y(){const i=y.params.id;await N.getDetailSerialize(i).then(s=>{g.value=s.data}).catch(s=>{const p=s.response.data;k.error(p.message)})}async function Z(){const i=y.query.product_id;await N.getDetailSerializeProduct(i).then(async s=>{b.value=s.data}).catch(s=>{const p=s.response.data;k.error(p.message)})}async function D(){C.value=!0,await N.getSerializeDetailList(w.value).then(async i=>{E.value=i.data,C.value=!1}).catch(i=>{C.value=!1;const s=i.response.data;k.error(s.message)})}function ee(i,s){switch(i){case"edit":c.value.show=!0,c.value.data=s;break}}function M(){c.value.show=!1}function te(){h.value=!0;const i=c.value.data.id,s={serialize_code:c.value.form.serialize_code};N.updateSerializeCode(i,s).then(()=>{h.value=!1,M(),D(),c.value.form={},setTimeout(()=>{o.value.title="Berhasil Edit",o.value.subtitle="Anda berhasil mengubah kode serialisasi",ne()},300)}).catch(p=>{h.value=!1;const P=p.response.data;k.error(P.message)})}function ae(){o.value.type="confirm",o.value.hideIcon=!0,o.value.show=!0,o.value.title="Konfirmasi",o.value.subtitle=`Anda akan mengedit Serialisasi Level ${c.value.data.serialize.level} "${c.value.data.serialize.code}" menjadi "${c.value.form.serialize_code}"`}function O(){o.value.show=!1}function ne(){o.value.type="success",o.value.hideIcon=!1,o.value.iconColor="#219653",o.value.icon=Ke,o.value.show=!0}return(i,s)=>{const p=fe,P=ze,oe=xe,v=Se,$=Ce,z=De,se=$e,le=Le,ie=Ne,I=Be,j=Ee,re=Pe,x=Te,ce=Me,ue=Oe,de=be("router-link"),_e=me;return _(),f(L,null,[n("div",Qe,[e(B)?(_(),f("div",Ge,[t(p)])):(_(),f(L,{key:1},[t(v,{justify:"space-between"},{default:a(()=>[t(P,{style:{"margin-bottom":"0","margin-top":"5px"}},{default:a(()=>{var l,m;return[u("Nama Produk : "+d((m=(l=e(b))==null?void 0:l.product)==null?void 0:m.short_name),1)]}),_:1}),t(oe,{round:"",bordered:!1,strong:"",type:e(g).status==="complete"?"success":"warning",size:"large"},{default:a(()=>[u(d(i.$filters.toStatus(e(g).status)),1)]),_:1},8,["type"])]),_:1}),t(I,{gutter:"16",style:{"margin-top":"14px"}},{default:a(()=>[t(z,{span:8},{default:a(()=>[t(v,{vertical:"",size:0},{default:a(()=>[t($,null,{default:a(()=>{var l,m;return[u("Kode Produk : "+d((m=(l=e(b))==null?void 0:l.product)==null?void 0:m.item_code),1)]}),_:1}),t($,null,{default:a(()=>[u("No DO Vendor : "+d(e(g).vendor_no),1)]),_:1})]),_:1})]),_:1}),t(z,{span:8},{default:a(()=>[t(v,{vertical:"",size:0},{default:a(()=>[t($,null,{default:a(()=>[u("Tanggal DO : "+d(e(je)(e(g).created_at).format("yyyy-MM-DD")),1)]),_:1}),t($,null,{default:a(()=>[u("No PO : "+d(e(g).code),1)]),_:1})]),_:1})]),_:1}),t(z,{span:8},{default:a(()=>[t(v,{vertical:"",size:10,align:"end"},{default:a(()=>[t(ie,{style:{width:"250px","text-align":"center","border-radius":"15px",background:"#eee"}},{default:a(()=>[t(se,{style:{"font-size":"14px"}},{default:a(()=>[u("Qty Terkonfirmasi/Qyt DO :")]),_:1}),t(le,{style:{"margin-top":"0","margin-bottom":"0"}},{default:a(()=>{var l;return[u(d(i.$filters.toNumber(e(b).current_qty)+"/"+i.$filters.toNumber((l=e(b))==null?void 0:l.qty)),1)]}),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),t(v,{vertical:"",size:24,style:{"margin-top":"24px"}},{default:a(()=>[n("div",Je,[t(I,{gutter:"16"},{default:a(()=>[t(z,{span:6},{default:a(()=>[t(j,{placeholder:"Pilih Status Scan",value:e(w).is_scan,"onUpdate:value":[s[0]||(s[0]=l=>e(w).is_scan=l),D],options:e(G)},null,8,["value","options"])]),_:1}),t(z,{span:6},{default:a(()=>[t(j,{placeholder:"Pilih Urutan Level",value:e(w).sort,"onUpdate:value":[s[1]||(s[1]=l=>e(w).sort=l),D],options:e(J)},null,8,["value","options"])]),_:1})]),_:1}),n("div",We,[e(C)?(_(),T(p,{key:0})):(_(),T(ue,{key:1,"single-line":!1,"bottom-bordered":!1,bordered:!1},{default:a(()=>{var l,m;return[Xe,n("tbody",null,[((m=(l=e(E))==null?void 0:l.list)==null?void 0:m.length)>0?(_(!0),f(L,{key:0},we(e(E).list,(S,q)=>{var F,K,R,V;return _(),f("tr",{key:q},[n("td",null,d(q+1),1),n("td",null,d((F=S.serialize)==null?void 0:F.code),1),n("td",null,d((K=S.serialize)==null?void 0:K.batch),1),n("td",Ye,d((R=S.serialize)==null?void 0:R.level),1),n("td",Ze,d((V=S.serialize)==null?void 0:V.first_level_qty),1),n("td",et,[t(ce,{placement:"bottom-end",options:W,onSelect:pe=>ee(pe,S)},{default:a(()=>[t(x,{tertiary:""},{icon:a(()=>[t(re,null,{default:a(()=>[t(e(Fe))]),_:1})]),_:1})]),_:2},1032,["onSelect"])])])}),128)):(_(),f("tr",tt,nt))])]}),_:1}))])])]),_:1})],64)),n("div",ot,[n("div",st,[t(de,{to:{name:"penerimaan-serialisasi-external-id"},class:"text-decoration-none"},{default:a(()=>[t(x,{color:"#828282",class:"button-tnt",style:{width:"120px"}},{default:a(()=>[u("Kembali")]),_:1})]),_:1})])])]),t(qe,{show:e(c).show,value:e(c).form,data:e(c).data,loading:e(h),"onClick:close":M,"onClick:confirm":ae},null,8,["show","value","data","loading"]),t(_e,{show:e(o).show,"onUpdate:show":s[2]||(s[2]=l=>e(o).show=l),icon:e(o).icon,"hide-icon":e(o).hideIcon,title:e(o).title,subtitle:e(o).subtitle,align:e(o).align},{default:a(()=>[t(v,{justify:"center"},{default:a(()=>[e(o).type=="confirm"?(_(),f(L,{key:0},[t(x,{loading:e(h),color:"#828282",class:"button-tnt",onClick:O},{default:a(()=>[u(" Tutup ")]),_:1},8,["loading"]),t(x,{loading:e(h),type:"primary",class:"button-tnt",onClick:te},{default:a(()=>[u(" Konfirmasi ")]),_:1},8,["loading"])],64)):A("",!0),e(o).type=="success"?(_(),T(x,{key:1,color:"#828282",class:"button-tnt",onClick:O},{default:a(()=>[u(" Tutup ")]),_:1})):A("",!0)]),_:1})]),_:1},8,["show","icon","hide-icon","title","subtitle","align"])],64)}}});export{ht as default};
