import{_ as _e}from"./t-feedback.vue_vue_type_script_setup_true_lang.83eb0b14.js";import{_ as pe}from"./t-loading.vue_vue_type_script_setup_true_lang.71bf4981.js";import{d as fe,b as me,E as ye,r as w,a1 as he,f as ge,p as ve,o as m,c as v,a as n,i as e,k as l,h as L,w as a,q as i,t as u,j as b,F as E,ak as ke,S as be,al as we,g as ee,aG as Ce,K as Te,v as De,s as xe,a7 as Se,ac as Be,ar as $e,L as Ee,a8 as Ie,aa as Ke}from"./index.21c0d750.js";import{h as V}from"./moment.62d3fb0a.js";import{t as I}from"./transfer-order.a0bc1e69.js";import{C as ze}from"./CheckmarkCircleOutline.8fddcae1.js";import"./getCompanyId.7d0eb93b.js";const Oe={class:"body-tnt"},Ae={key:0,class:"card-tnt"},qe={key:0,class:"card-tnt",style:{"margin-top":"0","background-color":"#eeeeee"}},Re={key:1,class:"card-tnt",style:{"margin-top":"0"}},Me={class:"table-tnt",style:{"margin-top":"10px"}},Ne=n("thead",null,[n("tr",null,[n("th",null,"No"),n("th",null,"Kode Serialisasi"),n("th",null,"Expired Date"),n("th",{style:{"text-align":"center"}},"Level"),n("th",null,"Batch"),n("th",{style:{"text-align":"center"}},"Qty"),n("th",{style:{"text-align":"center"}},"Aksi")])],-1),Fe={style:{"text-align":"center"}},Le={style:{"text-align":"center"}},Qe={style:{"text-align":"center"}},je={key:2,class:"card-tnt",style:{"margin-top":"0"}},He={class:"table-tnt",style:{"margin-top":"10px"}},Pe=n("th",null,"No",-1),Ve=n("th",null,"Kode Serialisasi",-1),Ue=n("th",null,"Expired Date",-1),Ye=n("th",null,"Batch",-1),Ge=n("th",{style:{"text-align":"center"}},"Level",-1),Je=n("th",{style:{"text-align":"center"}},"Qty",-1),We={key:0,style:{"text-align":"center"}},Xe={style:{"text-align":"center"}},Ze={style:{"text-align":"center"}},et={key:0,style:{"text-align":"center"}},tt={class:"bottom-action-button"},at={class:"action-item"},_t=fe({__name:"scan",setup(lt){const U=me(),C=ye(),Q=w(!1),y=w(!1),T=w({}),f=w({}),D=w({}),h=w([]),x=w(""),A=w(""),te=w();te.value={reason:{required:!0,message:"Alasan tidak boleh kosong",trigger:["input","blur"]}};const S=w(null),s=w({show:w(!1),type:"",icon:he(),iconColor:"",hideIcon:!1,title:"",subtitle:"",align:"center"});ge(()=>{Y()});async function Y(){Q.value=!0,ae(),await le(),await ne(),Q.value=!1}async function ae(){const r=U.params.id;await I.getDetailTO(r).then(d=>{T.value=d.data}).catch(d=>{const p=d.response.data;C.error(p.message)})}async function le(){const r=localStorage.getItem("product_id");await I.getDetailProduct(r).then(async d=>{f.value=d.data}).catch(d=>{const p=d.response.data;C.error(p.message)})}async function ne(){const r=localStorage.getItem("product_id"),d={to_id:U.params.id,to_product_id:r,limit:1e3};await I.getListDetailTO(d).then(async p=>{D.value=p.data,setTimeout(()=>{var k;(k=S.value)==null||k.focus()},100)}).catch(p=>{const k=p.response.data;C.error(k.message)})}async function G(){var k;y.value=!0,(k=S.value)==null||k.blur();const r=localStorage.getItem("product_id"),d=x.value,p=r;await I.getDetailByCodeTO(d,p).then(c=>{var g,_,B,q,R;h.value.length>0?parseInt((_=(g=c==null?void 0:c.data)==null?void 0:g.serialize)==null?void 0:_.first_level_qty)+$(D.value.list)+$(h.value)>f.value.qty?C.error("Qty serialisasi tidak dapat melebihi Qty TO"):h.value.forEach(j=>{var M;if(j.code===c.data.code)C.error("Kode serialisasi sudah ada di list");else{const N=h.value.filter(H=>H.code!==c.data.code);h.value=N,h.value.push(c.data),(M=S.value)==null||M.focus()}}):parseInt((q=(B=c==null?void 0:c.data)==null?void 0:B.serialize)==null?void 0:q.first_level_qty)+$(D.value.list)>f.value.qty?C.error("Qty serialisasi tidak dapat melebihi Qty TO"):(h.value.push(c.data),(R=S.value)==null||R.focus()),x.value="",y.value=!1}).catch(c=>{var _;x.value="",y.value=!1,(_=S.value)==null||_.focus();const g=c.response.data;C.error(g.message)}).finally(()=>{var c;(c=S.value)==null||c.focus()})}function oe(r){A.value=r,s.value.type="delete",s.value.hideIcon=!0,s.value.title="Hapus",s.value.subtitle=`Apakah Anda yakin untuk menghapus ${A.value} ?`,s.value.show=!0}async function se(){y.value=!0;const r=localStorage.getItem("product_id"),d=new FormData;d.append("to_product_id",r),d.append("codes[]",A.value),I.deleteItem(d).then(()=>{y.value=!1,setTimeout(()=>{s.value.title="Berhasil Hapus Serialisasi",s.value.subtitle=`${A.value} berhasil dihapus`,W()},300)}).catch(p=>{y.value=!1;const k=p.response.data;C.error(k.message)})}function $(r){let d=0;return r.forEach(p=>{d+=p.serialize.first_level_qty}),d}function ie(){de()}function ue(){y.value=!0;const r=localStorage.getItem("product_id"),d=new FormData;d.append("to_product_id",r),h.value.forEach(p=>{d.append("codes[]",p.code)}),I.updateTO(d).then(()=>{y.value=!1,setTimeout(()=>{s.value.title="Berhasil Transfer Order",s.value.subtitle=`${$(h.value)} kode serialisai berhasil dikonfirmasi`,W()},300)}).catch(p=>{y.value=!1;const k=p.response.data;C.error(k.message)})}function J(){s.value.show=!1}function re(){h.value=[],Y(),s.value.show=!1}function de(){s.value.type="confirm",s.value.hideIcon=!0,s.value.title="Konfirmasi",s.value.subtitle="Apakah Anda yakin untuk melakukan transfer order?",s.value.show=!0}function W(){s.value.type="success",s.value.hideIcon=!1,s.value.iconColor="#219653",s.value.icon=ze,s.value.show=!0}return(r,d)=>{const p=pe,k=Ce,c=Te,g=De,_=xe,B=Se,q=Be,R=$e,j=Ee,M=Ie,N=Ke,H=ve("router-link"),ce=_e;return m(),v(E,null,[n("div",Oe,[e(Q)?(m(),v("div",Ae,[l(p)])):(m(),L(g,{key:1,vertical:"",size:24},{default:a(()=>{var F,X;return[l(g,{justify:"space-between"},{default:a(()=>[l(g,{align:"center"},{default:a(()=>[l(k,{style:{"font-weight":"600","font-size":"18px",margin:"auto"}},{default:a(()=>[i(" Kode Transfer Order : "+u(e(T).to_number),1)]),_:1}),l(c,{strong:"",secondary:"",round:"",type:e(T).status==="complete"?"success":"warning",style:{cursor:"default"}},{default:a(()=>[i(u(r.$filters.toStatus(e(T).status)),1)]),_:1},8,["type"])]),_:1})]),_:1}),l(M,{cols:12},{default:a(()=>[l(B,{span:6},{default:a(()=>[l(g,{vertical:""},{default:a(()=>[l(_,null,{default:a(()=>[i("Tanggal TO : "+u(e(V)(e(f).created_at).format("yyyy-MM-DD")),1)]),_:1}),l(_,null,{default:a(()=>{var t;return[i("Kode Produk : "+u((t=e(f).product)==null?void 0:t.item_code),1)]}),_:1}),l(_,null,{default:a(()=>{var t;return[i("Produk : "+u((t=e(f).product)==null?void 0:t.short_name),1)]}),_:1}),l(_,null,{default:a(()=>[i("Batch : "+u(e(f).batch),1)]),_:1})]),_:1})]),_:1}),l(B,{span:6},{default:a(()=>[l(g,{vertical:""},{default:a(()=>[l(_,null,{default:a(()=>{var t,o;return[i("Plant/Cabang Asal : "+u(r.$filters.isEmpty((o=(t=e(f).from)==null?void 0:t.warehouse)==null?void 0:o.name)),1)]}),_:1}),l(_,null,{default:a(()=>{var t,o;return[i("Building Asal : "+u(r.$filters.isEmpty((o=(t=e(f).from)==null?void 0:t.building)==null?void 0:o.name)),1)]}),_:1}),l(_,null,{default:a(()=>{var t,o;return[i("Room Asal : "+u(r.$filters.isEmpty((o=(t=e(f).from)==null?void 0:t.room)==null?void 0:o.name)),1)]}),_:1}),l(_,null,{default:a(()=>{var t,o;return[i("Rack Asal : "+u(r.$filters.isEmpty((o=(t=e(f).from)==null?void 0:t.rack_pallete)==null?void 0:o.name)),1)]}),_:1}),l(_,null,{default:a(()=>{var t,o;return[i("Bin Asal : "+u(r.$filters.isEmpty((o=(t=e(f).from)==null?void 0:t.bin)==null?void 0:o.name)),1)]}),_:1})]),_:1})]),_:1}),l(B,{span:6},{default:a(()=>[l(g,{vertical:""},{default:a(()=>[l(_,null,{default:a(()=>{var t,o;return[i("Plant/Cabang Tujuan : "+u(r.$filters.isEmpty((o=(t=e(f).to)==null?void 0:t.warehouse)==null?void 0:o.name)),1)]}),_:1}),l(_,null,{default:a(()=>{var t,o;return[i("Building Tujuan : "+u(r.$filters.isEmpty((o=(t=e(f).to)==null?void 0:t.building)==null?void 0:o.name)),1)]}),_:1}),l(_,null,{default:a(()=>{var t,o;return[i("Room Tujuan : "+u(r.$filters.isEmpty((o=(t=e(f).to)==null?void 0:t.room)==null?void 0:o.name)),1)]}),_:1}),l(_,null,{default:a(()=>{var t,o;return[i("Rack Tujuan : "+u(r.$filters.isEmpty((o=(t=e(f).to)==null?void 0:t.rack_pallete)==null?void 0:o.name)),1)]}),_:1}),l(_,null,{default:a(()=>{var t,o;return[i("Bin Tujuan : "+u(r.$filters.isEmpty((o=(t=e(f).to)==null?void 0:t.bin)==null?void 0:o.name)),1)]}),_:1})]),_:1})]),_:1}),l(B,{span:6},{default:a(()=>[l(j,{style:{width:"250px","text-align":"center","border-radius":"15px",background:"#eee"}},{default:a(()=>{var t;return[l(q,{style:{"font-size":"14px"}},{default:a(()=>[i("Qty Terkonfirmasi/Qyt TO :")]),_:1}),(t=e(D))!=null&&t.list?(m(),L(R,{key:0,style:{"margin-top":"0px"}},{default:a(()=>[i(u($(e(D).list)+"/"+e(f).qty),1)]),_:1})):b("",!0)]}),_:1})]),_:1})]),_:1}),((F=e(D))==null?void 0:F.list)&&e(T).status!=="cancel"?(m(),v(E,{key:0},[$(e(D).list)!==e(T).qty?(m(),v("div",qe,[l(g,{vertical:"",align:"center"},{default:a(()=>[l(_,null,{default:a(()=>[i("Silakan masukkan Kode Serialisasi")]),_:1}),l(g,null,{default:a(()=>[l(e(ke),{ref_key:"input",ref:S,value:e(x),"onUpdate:value":d[0]||(d[0]=t=>be(x)?x.value=t:null),disabled:e(y),placeholder:"",clearable:"",onKeyup:we(G,["enter"]),style:{width:"35rem"}},null,8,["value","disabled","onKeyup"]),b("",!0)]),_:1}),b("",!0),l(c,{loading:e(y),disabled:e(x)=="",type:"primary",class:"button-tnt",onClick:G},{default:a(()=>[i(" Scan Kode ")]),_:1},8,["loading","disabled"])]),_:1})])):b("",!0)],64)):b("",!0),e(h).length>0?(m(),v("div",Re,[l(_,null,{default:a(()=>[i("Serialisasi Terscan")]),_:1}),n("div",Me,[l(N,{"single-line":!1,"bottom-bordered":!1,bordered:!1},{default:a(()=>[Ne,n("tbody",null,[(m(!0),v(E,null,ee(e(h),(t,o)=>{var K,z,O;return m(),v("tr",{key:o},[n("td",null,u(o+1),1),n("td",null,u(t.code),1),n("td",null,u(e(V)(t.expired_date).format("yyyy-MM-DD")),1),n("td",Fe,u((K=t.serialize)==null?void 0:K.level),1),n("td",null,u((z=t.reception)==null?void 0:z.batch_number),1),n("td",Le,u((O=t.serialize)==null?void 0:O.first_level_qty),1),n("td",Qe,[l(c,{text:"",type:"error",onClick:P=>e(h).splice(o,1)},{default:a(()=>[i(" Hapus ")]),_:2},1032,["onClick"])])])}),128))])]),_:1})])])):b("",!0),((X=e(D).list)==null?void 0:X.length)>0?(m(),v("div",je,[l(_,null,{default:a(()=>[i("Serialisasi Terkonfirmasi")]),_:1}),n("div",He,[l(N,{"single-line":!1,"bottom-bordered":!1,bordered:!1},{default:a(()=>[n("thead",null,[n("tr",null,[Pe,Ve,Ue,Ye,Ge,Je,e(T).status==="pending"?(m(),v("th",We," Aksi ")):b("",!0)])]),n("tbody",null,[(m(!0),v(E,null,ee(e(D).list,(t,o)=>{var K,z,O,P;return m(),v("tr",{key:o},[n("td",null,u(o+1),1),n("td",null,u((K=t.serialize)==null?void 0:K.code),1),n("td",null,u(e(V)(t.expired_date).format("yyyy-MM-DD")),1),n("td",null,u((z=t.serialize)==null?void 0:z.batch),1),n("td",Xe,u((O=t.serialize)==null?void 0:O.level),1),n("td",Ze,u((P=t.serialize)==null?void 0:P.first_level_qty),1),e(T).status==="pending"?(m(),v("td",et,[l(c,{text:"",type:"error",onClick:nt=>{var Z;return oe((Z=t.serialize)==null?void 0:Z.code)}},{default:a(()=>[i(" Hapus ")]),_:2},1032,["onClick"])])):b("",!0)])}),128))])]),_:1})])])):b("",!0)]}),_:1})),n("div",tt,[n("div",at,[l(H,{to:{name:"penyimpanan-transfer-id"},class:"text-decoration-none"},{default:a(()=>[l(c,{loading:e(y),color:"#828282",class:"button-tnt",style:{width:"120px"}},{default:a(()=>[i("Kembali")]),_:1},8,["loading"])]),_:1}),e(T).status==="pending"?(m(),L(c,{key:0,loading:e(y),disabled:e(h).length===0,type:"primary",class:"button-tnt",style:{width:"120px"},onClick:ie},{default:a(()=>[i(" Konfirmasi ")]),_:1},8,["loading","disabled"])):b("",!0)])])]),l(ce,{show:e(s).show,"onUpdate:show":d[1]||(d[1]=F=>e(s).show=F),icon:e(s).icon,"hide-icon":e(s).hideIcon,title:e(s).title,subtitle:e(s).subtitle,align:e(s).align},{default:a(()=>[l(g,{justify:"center"},{default:a(()=>[e(s).type=="delete"?(m(),v(E,{key:0},[l(c,{loading:e(y),color:"#828282",class:"button-tnt",onClick:J},{default:a(()=>[i(" Tutup ")]),_:1},8,["loading"]),l(c,{loading:e(y),type:"primary",class:"button-tnt",onClick:se},{default:a(()=>[i(" Yakin ")]),_:1},8,["loading"])],64)):b("",!0),e(s).type=="confirm"?(m(),v(E,{key:1},[l(c,{loading:e(y),color:"#828282",class:"button-tnt",onClick:J},{default:a(()=>[i(" Tutup ")]),_:1},8,["loading"]),l(c,{loading:e(y),type:"primary",class:"button-tnt",onClick:ue},{default:a(()=>[i(" Yakin ")]),_:1},8,["loading"])],64)):b("",!0),e(s).type=="success"?(m(),L(c,{key:2,color:"#828282",class:"button-tnt",onClick:re},{default:a(()=>[i(" Tutup ")]),_:1})):b("",!0)]),_:1})]),_:1},8,["show","icon","hide-icon","title","subtitle","align"])],64)}}});export{_t as default};
