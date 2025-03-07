import{_ as se}from"./t-feedback.vue_vue_type_script_setup_true_lang.83eb0b14.js";import{_ as le}from"./t-not-granted.vue_vue_type_script_setup_true_lang.a30cf979.js";import{_ as ie}from"./t-loading.vue_vue_type_script_setup_true_lang.71bf4981.js";import{d as ce,u as ue,E as re,r,a1 as _e,f as de,aF as w,p as pe,o as c,c as m,a,k as o,w as n,q as d,i as e,h as f,N as C,j as U,F as b,g as me,t as k,ah as M,Q as B,af as fe,am as ge,an as he,K as ve,v as be,ak as ke,a7 as ye,a8 as we,y as Ce,aa as Ue,ab as Me,ag as xe}from"./index.21c0d750.js";import{c as g}from"./constant.549d5c21.js";import{u as S}from"./uom.5e6088e0.js";import{A as Ne}from"./Add.4f3b52cf.js";import{E as De}from"./EllipsisVertical.56989e7a.js";import{P as Pe}from"./Pencil.0b65f5de.js";import{T as Te}from"./Trash.4f4f705c.js";import{H as $e}from"./HelpCircleOutline.a54a41ed.js";import{C as Be}from"./CheckmarkCircleOutline.8fddcae1.js";import"./AlertCircleOutline.19cf574c.js";import"./getHoldingId.48f570fc.js";const Se={class:"body-tnt"},Ae={class:"card-tnt"},Ee={class:"table-tnt"},Fe=a("thead",null,[a("tr",null,[a("th",{style:{"text-align":"center"}},"No"),a("th",null,"Kode UoM"),a("th",null,"Nama UoM"),a("th",null,"Deskripsi"),a("th",{style:{"text-align":"center"}},"Aksi")])],-1),Ge={"data-label":"No",style:{"text-align":"center"}},Ie={"data-label":"Kode UoM"},Ve={"data-label":"Nama UoM"},ze={"data-label":"Deskripsi"},Oe={"data-label":"Aksi",style:{"text-align":"center"}},qe={class:"table-footer"},at=ce({__name:"index",setup(He){const A=ue(),E=re(),h=r(!1),x=r(!1),v=r({}),t=r({show:r(!1),type:"",icon:_e(),iconColor:"",hideIcon:!1,title:"",subtitle:""}),N=r({id:"",name:""}),u=r({q:"",dir:"desc",sort:"created_at",page:1,limit:10}),y=r([]),D=s=>()=>B(C,null,{default:()=>B(s)});de(()=>{F(),w.isGranted(g.accessPrivileges.uom+".list")&&_()});function F(){w.isGranted(g.accessPrivileges.uom+".update")&&y.value.push({label:"Edit Data",key:"edit",icon:D(Pe)}),w.isGranted(g.accessPrivileges.uom+".delete")&&y.value.push({label:"Hapus Data",key:"delete",icon:D(Te)})}async function _(){h.value=!0,await S.getUom(u.value).then(s=>{v.value=s.data.data,h.value=!1,t.value.show=!1}).catch(s=>{h.value=!1;const l=s.response.data;E.error(l.message)})}const P=r(0);function G(){u.value.page=1,clearTimeout(P.value),P.value=setTimeout(function(){_()},600)}function I(s){u.value.limit=s,_()}function V(s,l){switch(s){case"edit":A.push({path:`/setting/master-uom/update/${l}`});break;case"delete":N.value.id=l,q();break}}function z(){t.value.show=!1}function O(){t.value.type="success",t.value.icon=Be,t.value.iconColor="#219653",t.value.title="Berhasil",t.value.subtitle="Anda berhasil menghapus data UOM",t.value.show=!0}function q(){t.value.type="delete",t.value.icon=$e,t.value.iconColor="#EB5757",t.value.title="Perhatian",t.value.subtitle="Apakah Anda yakin untuk menghapus data UOM?",t.value.show=!0}function H(){x.value=!0,S.deleteUom(N.value.id).then(()=>{x.value=!1,_(),setTimeout(()=>{O()},300)})}return(s,l)=>{const R=fe,K=ge,L=he,p=ve,j=pe("router-link"),T=be,Q=ke,J=ye,W=we,X=ie,Y=Ce,Z=Ue,ee=Me,te=xe,oe=le,ne=se;return c(),m(b,null,[a("div",Se,[o(R,{style:{"margin-bottom":"4px"}},{default:n(()=>[d("Unit of Measurement")]),_:1}),o(L,null,{default:n(()=>[o(K,null,{default:n(()=>[d("Unit of Measurement")]),_:1})]),_:1}),a("div",Ae,[s.$filters.isGranted(e(g).accessPrivileges.uom+".create")?(c(),f(T,{key:0},{default:n(()=>[o(j,{to:"/setting/master-uom/create/1",class:"text-decoration-none"},{default:n(()=>[o(p,{color:"#219653",class:"button-tnt"},{default:n(()=>[o(e(C),{component:e(Ne)},null,8,["component"]),d(" Tambah UoM ")]),_:1})]),_:1})]),_:1})):U("",!0),s.$filters.isGranted(e(g).accessPrivileges.uom+".list")?(c(),m(b,{key:1},[o(W,{gutter:"16",style:{"margin-top":"24px"}},{default:n(()=>[o(J,{span:6},{default:n(()=>[o(Q,{value:e(u).q,"onUpdate:value":[l[0]||(l[0]=i=>e(u).q=i),G],clearable:"",placeholder:"Cari Nama UoM"},null,8,["value"])]),_:1})]),_:1}),a("div",Ee,[e(h)?(c(),f(X,{key:0})):(c(),f(ee,{key:1,"x-scrollable":""},{default:n(()=>[o(Z,{"single-line":!1},{default:n(()=>[Fe,a("tbody",null,[(c(!0),m(b,null,me(e(v).list,(i,$)=>(c(),m("tr",{key:$},[a("td",Ge,k(e(u).limit*(e(u).page-1)+($+1)),1),a("td",Ie,k(i.code),1),a("td",Ve,k(i.name),1),a("td",ze,k(i.description?i.description:"-"),1),a("td",Oe,[o(Y,{placement:"bottom-end","show-arrow":!0,options:e(y),onSelect:ae=>V(ae,i.id)},{default:n(()=>[o(p,{tertiary:""},{icon:n(()=>[o(e(C),null,{default:n(()=>[o(e(De))]),_:1})]),_:1})]),_:2},1032,["options","onSelect"])])]))),128))])]),_:1})]),_:1})),a("div",qe,[o(te,{page:e(u).page,"onUpdate:page":[l[1]||(l[1]=i=>e(u).page=i),_],"page-count":e(v).total_page,"page-slot":10,"show-size-picker":e(v).total_data>10,"page-sizes":[10,20,30,40,50],"onUpdate:pageSize":I},null,8,["page","page-count","show-size-picker"])])])],64)):(c(),f(oe,{key:2}))])]),o(ne,{show:e(t).show,"onUpdate:show":l[2]||(l[2]=i=>e(t).show=i),icon:e(t).icon,"icon-color":e(t).iconColor,"hide-icon":e(t).hideIcon,title:e(t).title,subtitle:e(t).subtitle},{default:n(()=>[o(T,{justify:"center"},{default:n(()=>[e(t).type=="success"?(c(),f(p,{key:0,color:"#828282",class:"button-tnt",onClick:M(_,["prevent"])},{default:n(()=>[d(" Tutup ")]),_:1},8,["onClick"])):U("",!0),e(t).type=="delete"?(c(),m(b,{key:1},[o(p,{color:"#828282",class:"button-tnt",onClick:M(z,["prevent"])},{default:n(()=>[d(" Tidak ")]),_:1},8,["onClick"]),o(p,{color:"#EB5757",class:"button-tnt",style:{"padding-left":"25px","padding-right":"25px"},onClick:M(H,["prevent"])},{default:n(()=>[d(" Iya ")]),_:1},8,["onClick"])],64)):U("",!0)]),_:1})]),_:1},8,["show","icon","icon-color","hide-icon","title","subtitle"])],64)}}});export{at as default};
