import{_ as Q}from"./t-scan-modal.vue_vue_type_script_setup_true_lang.af24c4ce.js";import{_ as W}from"./t-loading.vue_vue_type_script_setup_true_lang.71bf4981.js";import{d as X,E as Y,b as Z,u as ee,r as l,f as ae,p as te,o as S,c as P,h as ne,k as e,w as a,q as o,t as z,a as D,F as le,as as oe,s as se,v as ie,H as ue,a7 as ce,a8 as de,aN as re,K as pe}from"./index.21c0d750.js";import{d as _e,e as A,f as ve,m as x}from"./reception.0ba4dd71.js";import"./getCompanyId.7d0eb93b.js";const me={key:1,class:"body-tnt"},fe={class:"bottom-action-button"},ge={class:"action-item"},ze=X({__name:"bulk",setup(ye){const N=[{type:"selection"},{title:"Code",key:"code"},{title:"Level",key:"level"},{title:"Status",key:"status"}];function U(i){return i.code}const b=Y(),K=Z(),k=ee(),m=l(!1),s=l({}),f=l([]),p=l(!1),c=l(!1),M=l(!1),R=l(!1),w=l(""),_=l([]);ae(()=>{I()});const d=l({page:1,limit:10,status:null,dir:"desc",sort:"level",level:3}),T=l([{label:"Approved",value:"approved"},{label:"Broken",value:"broken"},{label:"Missing",value:"missing"},{label:"Pending",value:"pending"}]);l([{label:"Level Tertinggi",value:"desc"},{label:"Level Terendah",value:"asc"}]);const B=l([]);async function I(){m.value=!0,await V(),await h(),m.value=!1}async function V(){const i=await _e(K.params.id);s.value=i.data}async function h(){const i=await A({page:1,limit:1,reception_code:s==null?void 0:s.value.code});d.value.limit=i.data.total_data,d.value.reception_code=s==null?void 0:s.value.code;const n=await A(d.value);f.value=n.data.list,B.value=n.data.levels.map(g=>({label:`Level ${g}`,value:g}))}async function $(){const i=await ve(w.value);f.value.findIndex(n=>i.data.id==n.id)!=-1&&f.value.push(i.data)}async function q(){c.value=!0,await x({codes:_.value,status:"approved"}).finally(()=>{c.value=!1}),b.success("Serialize berhasil diupdate."),k.push({name:"penerimaan-reception-id-form"})}async function E(){c.value=!0,await x({codes:_.value,status:"missing"}).finally(()=>{c.value=!1}),b.success("Serialize berhasil diupdate."),k.push({name:"penerimaan-reception-id-form"})}async function F(){p.value=!0,await x({codes:_.value,status:"broken"}).finally(()=>{p.value=!1}),b.success("Serialize berhasil diupdate."),k.push({name:"penerimaan-id"})}return(i,n)=>{const g=W,H=oe,r=se,v=ie,L=ue,C=ce,j=de,O=re,y=pe,G=te("router-link"),J=Q;return S(),P(le,null,[m.value?(S(),ne(g,{key:0})):(S(),P("div",me,[e(H,{style:{"margin-bottom":"4px"}},{default:a(()=>[o("Aksi Masal")]),_:1}),e(v,{vertical:"",size:0},{default:a(()=>[e(v,null,{default:a(()=>[e(r,null,{default:a(()=>[o("ID Manifest : ")]),_:1}),e(r,null,{default:a(()=>{var t,u;return[o(z((u=(t=s.value)==null?void 0:t.manifest)==null?void 0:u.code),1)]}),_:1})]),_:1}),e(v,null,{default:a(()=>[e(r,null,{default:a(()=>[o("ID DO : ")]),_:1}),e(r,null,{default:a(()=>{var t,u;return[o(z((u=(t=s.value)==null?void 0:t.do)==null?void 0:u.code),1)]}),_:1})]),_:1}),e(v,null,{default:a(()=>[e(r,null,{default:a(()=>[o("Total item :")]),_:1}),e(r,null,{default:a(()=>{var t,u;return[o(z((u=(t=s.value)==null?void 0:t.total)==null?void 0:u.qty),1)]}),_:1})]),_:1})]),_:1}),e(j,{gutter:"16",style:{"margin-top":"1rem"}},{default:a(()=>[e(C,{span:6},{default:a(()=>[e(L,{placeholder:"Pilih Status",clearable:"",value:d.value.status,"onUpdate:value":[n[0]||(n[0]=t=>d.value.status=t),h],options:T.value},null,8,["value","options"])]),_:1}),e(C,{span:6},{default:a(()=>[e(L,{placeholder:"Pilih Level",value:d.value.level,"onUpdate:value":[n[1]||(n[1]=t=>d.value.level=t),h],options:B.value},null,8,["value","options"])]),_:1})]),_:1}),e(O,{style:{"margin-top":"1rem"},"checked-row-keys":_.value,"onUpdate:checkedRowKeys":n[2]||(n[2]=t=>_.value=t),columns:N,data:f.value,"row-key":U},null,8,["checked-row-keys","data"]),e(v,{justify:"center",style:{"margin-top":"1rem"}},{default:a(()=>[e(y,{loading:p.value,disabled:c.value,strong:"",secondary:"",type:"warning",class:"button-tnt",onClick:F},{default:a(()=>[o("Broken")]),_:1},8,["loading","disabled"]),e(y,{loading:c.value,strong:"",secondary:"",disabled:p.value,type:"success",class:"button-tnt",onClick:q},{default:a(()=>[o("Approve")]),_:1},8,["loading","disabled"]),e(y,{loading:c.value,strong:"",secondary:"",disabled:p.value,type:"error",class:"button-tnt",onClick:E},{default:a(()=>[o("Missing")]),_:1},8,["loading","disabled"])]),_:1}),D("div",fe,[D("div",ge,[e(G,{to:{name:"penerimaan-reception-id"},class:"text-decoration-none"},{default:a(()=>[e(y,{loading:m.value,color:"#828282",class:"button-tnt",style:{width:"120px"}},{default:a(()=>[o("Kembali")]),_:1},8,["loading"])]),_:1})])])])),e(J,{show:M.value,"onUpdate:show":n[3]||(n[3]=t=>M.value=t),code:w.value,"onUpdate:code":n[4]||(n[4]=t=>w.value=t),loading:R.value,title:"Scan code serialize",onScanned:$},null,8,["show","code","loading"])],64)}}});export{ze as default};
