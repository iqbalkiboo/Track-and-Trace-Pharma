import{_ as ii}from"./t-feedback.vue_vue_type_script_setup_true_lang.83eb0b14.js";import{_ as ai}from"./t-loading.vue_vue_type_script_setup_true_lang.71bf4981.js";import{d as ni,b as li,u as oi,E as ri,r as f,W as _i,a1 as di,f as ui,e as ci,p as xs,o,c as d,a as i,i as e,k as n,F as x,w as _,q as v,t as h,g as Ds,h as P,ah as F,j as u,af as pi,s as hi,v as fi,ad as vi,ae as mi,K as wi,aJ as yi,L as bi,ag as gi}from"./index.21c0d750.js";import{s as T}from"./serialisasi.378d5040.js";import{h as M}from"./moment.62d3fb0a.js";import"./id.98144864.js";import{_ as qi}from"./modal-printer-list.vue_vue_type_script_setup_true_lang.ab9b71b5.js";import{_ as zi}from"./modal-integrasi.vue_vue_type_script_setup_true_lang.b793671d.js";import{_ as ki}from"./modal-progress-print.vue_vue_type_script_setup_true_lang.202903e7.js";import{_ as xi}from"./modal-setting-print.vue_vue_type_script_setup_true_lang.b637ce6f.js";import{_ as Di}from"./modal-data-integrasi.vue_vue_type_script_setup_true_lang.038b1199.js";import{_ as Ci}from"./moda-see-data-print.vue_vue_type_script_setup_true_lang.ab38154f.js";import{C as Si}from"./CheckmarkCircleOutline.8fddcae1.js";import{A as Mi}from"./AlertCircleOutline.19cf574c.js";import"./getCompanyId.7d0eb93b.js";import"./getHoldingId.48f570fc.js";import"./PrintOutline.c0cc935d.js";import"./exportFromJSON.6e5672c8.js";const Li={class:"body-tnt"},Ri={key:0,class:"card-tnt"},Ii=i("span",null,"No Perintah Kemas : ",-1),Pi={style:{"font-weight":"500"}},Ti=i("span",null,"Kode Produk : ",-1),$i={style:{"font-weight":"500"}},Ai=i("span",null,"UOM : ",-1),Ni={style:{"font-weight":"500"}},ji=i("span",null,"No Batch Produksi : ",-1),Ei={style:{"font-weight":"500"}},Bi=i("span",null,"Qty : ",-1),Fi={style:{"font-weight":"500"}},Oi={style:{"margin-top":"34px"}},Ki={class:"card-tnt"},Ui={id:"section-to-print"},Hi={class:"qr-box"},Ji={style:{width:"100%",margin:"auto"}},Qi={key:0},Vi={class:"qr-label"},Gi={key:0,style:{width:"54px",display:"flex","justify-content":"space-between"},class:"qr-text"},Yi=i("div",null,":",-1),Wi={key:1,style:{width:"60%"},class:"qr-text"},Xi={class:"qr-label"},Zi={key:0,style:{width:"54px",display:"flex","justify-content":"space-between"},class:"qr-text"},ea=i("div",null,"BATCH",-1),ta=i("div",null,":",-1),sa=[ea,ta],ia={key:1,class:"qr-text"},aa={class:"qr-label"},na={key:0,style:{width:"54px",display:"flex","justify-content":"space-between"},class:"qr-text"},la=i("div",null,"MFG DATE",-1),oa=i("div",null,":",-1),ra=[la,oa],_a={key:1,class:"qr-text"},da={class:"qr-label"},ua={key:0,style:{width:"54px",display:"flex","justify-content":"space-between"},class:"qr-text"},ca=i("div",null,"ED",-1),pa=i("div",null,":",-1),ha=[ca,pa],fa={key:1,class:"qr-text"},va={class:"qr-label"},ma={key:0,style:{width:"54px",display:"flex","justify-content":"space-between"},class:"qr-text"},wa=i("div",null,"HET",-1),ya=i("div",null,":",-1),ba=[wa,ya],ga={key:1,class:"qr-text"},qa={class:"qr-label"},za={key:0,style:{width:"54px",display:"flex","justify-content":"space-between"},class:"qr-text"},ka=i("div",null,"SN",-1),xa=i("div",null,":",-1),Da=[ka,xa],Ca={key:1,style:{width:"60%"},class:"qr-text"},Sa={class:"qr-label"},Ma=i("p",{style:{width:"54px",display:"flex","justify-content":"space-between"},class:"qr-text"},[i("div",null,"QTY MAX"),i("div",null,":")],-1),La={style:{width:"60%"},class:"qr-text"},Ra={class:"qr-label"},Ia={key:0,style:{width:"54px",display:"flex","justify-content":"space-between"},class:"qr-text"},Pa=i("div",null,":",-1),Ta={key:1,style:{width:"60%"},class:"qr-text"},$a={class:"qr-label"},Aa={key:0,style:{width:"54px",display:"flex","justify-content":"space-between"},class:"qr-text"},Na=i("div",null,"BATCH",-1),ja=i("div",null,":",-1),Ea=[Na,ja],Ba={key:1,class:"qr-text"},Fa={class:"qr-label"},Oa={key:0,style:{width:"54px",display:"flex","justify-content":"space-between"},class:"qr-text"},Ka=i("div",null,"MFG DATE",-1),Ua=i("div",null,":",-1),Ha=[Ka,Ua],Ja={key:1,class:"qr-text"},Qa={class:"qr-label"},Va={key:0,style:{width:"54px",display:"flex","justify-content":"space-between"},class:"qr-text"},Ga=i("div",null,"ED",-1),Ya=i("div",null,":",-1),Wa=[Ga,Ya],Xa={key:1,class:"qr-text"},Za={class:"qr-label"},en={key:0,style:{width:"54px",display:"flex","justify-content":"space-between"},class:"qr-text"},tn=i("div",null,"HET",-1),sn=i("div",null,":",-1),an=[tn,sn],nn={key:1,class:"qr-text"},ln={class:"qr-label"},on={key:0,style:{width:"54px",display:"flex","justify-content":"space-between"},class:"qr-text"},rn=i("div",null,"SN",-1),_n=i("div",null,":",-1),dn=[rn,_n],un={key:1,style:{width:"60%"},class:"qr-text"},cn={style:{margin:"auto"}},pn={style:{display:"flex","justify-content":"center","margin-top":"16px"}},hn={class:"bottom-action-button"},fn={class:"action-item"},$n=ni({__name:"barcode",setup(vn){const C=li(),O=oi(),L=ri(),Cs=f(),g=f(!1),w=f(!1),R=f(!1),c=f({}),t=f({}),b=f({}),K=f({}),j=f(0),U=f([]),Ss=_i(()=>U.value.length),m=f({level:1,page:1,limit:10,reception_id:C.params.id}),Ms=f({page:1,limit:10}),E=f({level:0,qty:0}),a=f({show:f(!1),icon:di(),iconColor:"",hideIcon:!1,title:"",subtitle:"",type:""}),H=f({show:!1}),$=f({show:!1,isAfterSend:!1}),J=f({show:!1}),S=f({show:!1,isLog:!1}),W=f({show:!1}),Q=f({show:!1});ui(async()=>{var r,s,p;if(Cs.value=ci.getAuth(),await Ls(),!C.query.level)return O.push({query:{level:(r=c.value)==null?void 0:r.serialize[0].level}});j.value=parseInt((p=C.query.level)!=null?p:(s=c.value)==null?void 0:s.serialize[0].level)});async function Ls(){Is(),await Rs(),Ns()}async function Rs(){g.value=!0;const r=C.params.id;await T.getDetailSerialize(r).then(s=>{var p;c.value=s.data,N((p=parseInt(C.query.level))!=null?p:c.value.serialize[0].level)}).catch(s=>{const p=s.response.data;L.error(p.message)})}async function Is(){const r=C.params.id;await T.getDetailSerializeProduct(r).then(s=>{t.value=s.data}).catch(s=>{const p=s.response.data;L.error(p.message)})}async function N(r){return R.value=!0,w.value=!0,m.value.level=r,await T.getSerializeLevel(m.value).then(s=>(b.value=s.data,g.value=!1,R.value=!1,w.value=!1,s.data)).catch(s=>{g.value=!1,R.value=!1,w.value=!1;const p=s.response.data;L.error(p.message)})}function Ps(r){m.value.page=1,m.value.limit=r,N(m.value.level)}function Ts(r,s){j.value=r,m.value.limit=10,O.push({query:{level:s}}),N(s)}function $s(r,s){E.value.level=r,E.value.qty=s,Vs()}async function As(){w.value=!0;const r=String(C.params.id),s=new FormData;s.append("reception_id",r),s.append("level",E.value.level),T.printSerialize(s).then(async()=>{var p,q,z;if(w.value=!1,I(),j.value===0)setTimeout(()=>{Gs()},300);else{m.value.limit=(q=(p=b.value)==null?void 0:p.total_data)!=null?q:1e3;const y=await N(m.value.level);localStorage.setItem("is_label_open","0"),localStorage.setItem("is_level_print",JSON.stringify(m.value.level)),localStorage.setItem("config",JSON.stringify((z=t.value)==null?void 0:z.serialize)),localStorage.setItem("data",JSON.stringify(t.value)),localStorage.setItem("detail",JSON.stringify(c.value)),localStorage.setItem("labels",JSON.stringify(y.list));const D=document.createElement("a");D.target="_blank",D.href=O.resolve({name:"print-labels"}).href,D.click(),D.remove()}}).catch(p=>{var z;const q=p.message;if((z=p.response)!=null&&z.data){const y=p.response.data;w.value=!1,I(),setTimeout(()=>{Ys(y)},300)}else L.error(q)})}function Ns(){g.value=!0,T.getListDriverPrinter(Ms.value).then(r=>{K.value=r.data,g.value=!1}).catch(r=>{if(r.response){const s=r.response.data;L.error(s.message)}g.value=!1})}function X(r){H.value.show=r}function V(r){$.value.show=r,$.value.isAfterSend=!1}function js(r){S.value.show=r,S.value.isLog=!0}function Es(r){S.value.show=r,J.value.show=!0}function Bs(){a.value.type="send-data",a.value.hideIcon=!0,a.value.title="Kirim Data Berhasil",a.value.subtitle=`Selamat ${b.value.list.length} QR Code berhasil dikirimkan`,a.value.show=!0,setTimeout(()=>{a.value.show=!1,$.value.isAfterSend=!0},3e3)}function G(r){W.value.show=r}async function Fs(r){if(r.form!==0&&r.to!==0){const s={page:1,limit:r.to,level:1,reception_id:C.params.id};g.value=!0,R.value=!0,w.value=!0,await T.getSerializeLevel(s).then(p=>{g.value=!1,R.value=!1,w.value=!1,U.value=p.data.list.map(q=>q.code)}).catch(p=>{g.value=!1,R.value=!1,w.value=!1;const q=p.response.data;L.error(q.message)})}}function Os(){Ss&&(a.value.type="confirm-print",a.value.hideIcon=!0,a.value.title="Konfirmasi Cetak Label",a.value.subtitle="Apakah Anda yakin akan mencetak QR Code?",a.value.show=!0)}function Ks(){a.value.show=!1,G(!1),V(!1),Q.value.show=!0}function Us(){a.value.type="reset-insert",a.value.hideIcon=!0,a.value.title="Konfirmasi Reset Insert Code",a.value.subtitle="Anda akan melakukan reset insert code",a.value.show=!0}function Hs(){a.value.show=!1;const s={printer_key:localStorage.getItem("select-printer")};g.value=!0,T.postResetDriverPrinter(s).then(()=>{a.value.type="success",a.value.hideIcon=!0,a.value.title="Code Telah Direset",a.value.subtitle=`${b.value.list.length} QR Code telah direset`,a.value.show=!0,g.value=!1}).catch(p=>{if(p.response){const q=p.response.data;L.error(q.message)}})}function Js(){S.value.show=!0,S.value.isLog=!0}function Qs(){$.value.show=!0,Q.value.show=!1}function I(){a.value.show=!1}function Vs(){a.value.type="confirm",a.value.hideIcon=!0,a.value.title="Konfirmasi Cetak",a.value.subtitle=`Anda akan mencetak ${E.value.qty} kode`,a.value.show=!0}function Gs(){a.value.type="success",a.value.hideIcon=!1,a.value.iconColor="#219653",a.value.icon=Si,a.value.title="Berhasil Cetak",a.value.subtitle="Proses cetak telah selesai dilakukan",a.value.show=!0}function Ys(r){a.value.type="failed",a.value.hideIcon=!1,a.value.iconColor="#EB5757",a.value.icon=Mi,a.value.title="Gagal",Object.keys(r.validation).length>0?a.value.subtitle=r.validation:a.value.subtitle=r.message,a.value.show=!0}return(r,s)=>{const p=ai,q=pi,z=hi,y=fi,D=vi,B=mi,k=wi,Ws=yi,Xs=xs("vue-qrcode"),Zs=bi,ei=gi,ti=xs("router-link"),si=ii;return o(),d(x,null,[i("div",Li,[e(g)?(o(),d("div",Ri,[n(p)])):(o(),d(x,{key:1},[n(q,{style:{"margin-bottom":"16px"}},{default:_(()=>{var l;return[v(h((l=e(c).product)==null?void 0:l.long_name),1)]}),_:1}),n(B,{cols:"3","item-responsive":"",responsive:"screen","x-gap":"16","y-gap":"16"},{default:_(()=>[n(D,{span:"3 m:1"},{default:_(()=>[n(y,{vertical:"",size:15},{default:_(()=>[n(y,{vertical:"",size:0},{default:_(()=>[n(z,{style:{"margin-bottom":"0"}},{default:_(()=>[Ii,i("span",Pi,h(e(c).pk_id),1)]),_:1})]),_:1}),n(y,{vertical:"",size:0},{default:_(()=>[n(z,{style:{"margin-bottom":"0"}},{default:_(()=>{var l;return[Ti,i("span",$i,h((l=e(c).product)==null?void 0:l.item_code),1)]}),_:1})]),_:1}),n(y,{vertical:"",size:0},{default:_(()=>[n(z,{style:{"margin-bottom":"0"}},{default:_(()=>{var l;return[Ai,i("span",Ni,h((l=e(t).uom)==null?void 0:l.name),1)]}),_:1})]),_:1})]),_:1})]),_:1}),n(D,{span:"3 m:1"},{default:_(()=>[n(y,{vertical:"",size:15},{default:_(()=>[n(y,{vertical:"",size:0},{default:_(()=>[n(z,{style:{"margin-bottom":"0"}},{default:_(()=>[ji,i("span",Ei,h(e(c).batch_number),1)]),_:1})]),_:1}),n(y,{vertical:"",size:0},{default:_(()=>[n(z,{style:{"margin-bottom":"0"}},{default:_(()=>[Bi,i("span",Fi,h(e(c).serialize?e(c).serialize[0].qty:0),1)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),i("div",Oi,[n(B,{cols:"6","item-responsive":"",responsive:"screen","x-gap":"26","y-gap":"16"},{default:_(()=>[(o(!0),d(x,null,Ds(e(c).serialize,(l,A)=>(o(),P(D,{span:"3 s:2 m:1",key:A},{default:_(()=>[n(k,{loading:e(w),block:"",color:"#219653",ghost:e(m).level!==l.level,class:"button-tnt",onClick:Y=>Ts(A,l.level)},{default:_(()=>[v(h(l.name)+" ("+h(l.qty>0?l.qty:0)+") ",1)]),_:2},1032,["loading","ghost","onClick"])]),_:2},1024))),128))]),_:1})]),i("div",Ki,[e(R)?(o(),P(p,{key:0})):(o(),P(y,{key:1,vertical:"",size:20},{default:_(()=>[n(B,{cols:"2","item-responsive":"",responsive:"screen"},{default:_(()=>[n(D,{span:"2 s:1"},{default:_(()=>[n(Ws,{style:{"margin-bottom":"0","margin-top":"0"}},{default:_(()=>[v("Level "+h(e(m).level),1)]),_:1}),n(z,{style:{"margin-bottom":"0","margin-top":"0"}},{default:_(()=>{var l;return[v("Total "+h((l=e(b).list)==null?void 0:l.length),1)]}),_:1})]),_:1}),n(D,{span:"2 s:1"},{default:_(()=>[n(y,{justify:"end"},{default:_(()=>{var l;return[e(m).level===((l=e(c))!=null&&l.serialize?e(c).serialize[0].level:0)?(o(),P(k,{key:0,type:"primary",class:"button-tnt",onClick:s[0]||(s[0]=F(A=>X(!0),["prevent"]))},{default:_(()=>[v(" Integrasi ")]),_:1})):u("",!0),n(k,{color:"#F2C94C","text-color":"#1E1E1E",class:"button-tnt",onClick:s[1]||(s[1]=F(A=>$s(e(m).level,e(b).total_data),["prevent"]))},{default:_(()=>[v(" Cetak Label ")]),_:1})]}),_:1})]),_:1})]),_:1}),i("div",Ui,[n(B,{cols:"20","item-responsive":"",responsive:"screen","x-gap":16,"y-gap":16},{default:_(()=>[(o(!0),d(x,null,Ds(e(b).list,(l,A)=>(o(),P(D,{span:"20 m:4 s:10",key:A},{default:_(()=>[n(Zs,{style:{"border-radius":"12px","margin-top":"0"},"content-style":"padding: 8px"},{default:_(()=>{var Y,Z,ee,te,se,ie,ae,ne,le,oe,re,_e,de,ue,ce,pe,he,fe,ve,me,we,ye,be,ge,qe,ze,ke,xe,De,Ce,Se,Me,Le,Re,Ie,Pe,Te,$e,Ae,Ne,je,Ee,Be,Fe,Oe,Ke,Ue,He,Je,Qe,Ve,Ge,Ye,We,Xe,Ze,et,tt,st,it,at,nt,lt,ot,rt,_t,dt,ut,ct,pt,ht,ft,vt,mt,wt,yt,bt,gt,qt,zt,kt,xt,Dt,Ct,St,Mt,Lt,Rt,It,Pt,Tt,$t,At,Nt,jt,Et,Bt,Ft,Ot,Kt,Ut,Ht,Jt,Qt,Vt,Gt,Yt,Wt,Xt,Zt,es,ts,ss,is,as,ns,ls,os,rs,_s,ds,us,cs,ps,hs,fs,vs,ms,ws,ys,bs,gs,qs,zs,ks;return[i("div",Hi,[i("div",Ji,[((Y=e(t).serialize)==null?void 0:Y.kind.value)!=="authentication_gtin"&&e(j)-1!==0?(o(),d("div",Qi,[i("div",Vi,[((Z=e(t).serialize)==null?void 0:Z.print.show_field_name_in_qr_code)===!0&&((ee=e(t).serialize)==null?void 0:ee.print.show_content_label_in_qr_code.status)===!0&&((te=e(t).serialize)==null?void 0:te.print.show_content_label_in_qr_code.attributes.nie)===!0?(o(),d("p",Gi,[i("div",null,h(((ae=(ie=(se=e(t))==null?void 0:se.serialize)==null?void 0:ie.kind)==null?void 0:ae.value)==="authentication_gtin"?"GTIN":"NIE"),1),Yi])):u("",!0),((ne=e(t).serialize)==null?void 0:ne.print.show_field_name_in_qr_code)===!0&&((le=e(t).serialize)==null?void 0:le.print.show_content_label_in_qr_code.status)===!1||((oe=e(t).serialize)==null?void 0:oe.print.show_field_name_in_qr_code)===!0&&((re=e(t).serialize)==null?void 0:re.print.show_content_label_in_qr_code.status)===!0&&((_e=e(t).serialize)==null?void 0:_e.print.show_content_label_in_qr_code.attributes.nie)===!0?(o(),d("p",Wi,[((de=e(t).serialize)==null?void 0:de.kind.value)==="authentication_gtin"?(o(),d(x,{key:0},[v(h((ue=e(t).serialize)==null?void 0:ue.kind["level"+e(m).level]),1)],64)):(o(),d(x,{key:1},[v(h((ce=e(t).nie)==null?void 0:ce.number),1)],64))])):u("",!0)]),i("div",Xi,[((pe=e(t).serialize)==null?void 0:pe.print.show_field_name_in_qr_code)===!0&&((he=e(t).serialize)==null?void 0:he.print.show_content_label_in_qr_code.status)===!0&&((fe=e(t).serialize)==null?void 0:fe.print.show_content_label_in_qr_code.attributes.batch)===!0?(o(),d("p",Zi,sa)):u("",!0),((ve=e(t).serialize)==null?void 0:ve.print.show_field_name_in_qr_code)===!0&&((me=e(t).serialize)==null?void 0:me.print.show_content_label_in_qr_code.status)===!1||((we=e(t).serialize)==null?void 0:we.print.show_field_name_in_qr_code)===!0&&((ye=e(t).serialize)==null?void 0:ye.print.show_content_label_in_qr_code.status)===!0&&((be=e(t).serialize)==null?void 0:be.print.show_content_label_in_qr_code.attributes.batch)===!0?(o(),d("p",ia,h(e(c).batch_number),1)):u("",!0)]),i("div",aa,[((ge=e(t).serialize)==null?void 0:ge.print.show_field_name_in_qr_code)===!0&&((qe=e(t).serialize)==null?void 0:qe.print.show_content_label_in_qr_code.status)===!0&&((ze=e(t).serialize)==null?void 0:ze.print.show_content_label_in_qr_code.attributes.mfg_date)===!0?(o(),d("p",na,ra)):u("",!0),((ke=e(t).serialize)==null?void 0:ke.print.show_field_name_in_qr_code)===!0&&((xe=e(t).serialize)==null?void 0:xe.print.show_content_label_in_qr_code.status)===!1||((De=e(t).serialize)==null?void 0:De.print.show_field_name_in_qr_code)===!0&&((Ce=e(t).serialize)==null?void 0:Ce.print.show_content_label_in_qr_code.status)===!0&&((Se=e(t).serialize)==null?void 0:Se.print.show_content_label_in_qr_code.attributes.mfg_date)===!0?(o(),d("p",_a,h(((Le=(Me=e(t).serialize)==null?void 0:Me.print)==null?void 0:Le.format_date)==="date"?e(M)((Ie=(Re=e(c))==null?void 0:Re.date)==null?void 0:Ie.manufacture_date).format("D MMM yyyy"):e(M)((Te=(Pe=e(c))==null?void 0:Pe.date)==null?void 0:Te.manufacture_date).format("MMM yyyy")),1)):u("",!0)]),i("div",da,[(($e=e(t).serialize)==null?void 0:$e.print.show_field_name_in_qr_code)===!0&&((Ae=e(t).serialize)==null?void 0:Ae.print.show_content_label_in_qr_code.status)===!0&&((Ne=e(t).serialize)==null?void 0:Ne.print.show_content_label_in_qr_code.attributes.expired_date)===!0?(o(),d("p",ua,ha)):u("",!0),((je=e(t).serialize)==null?void 0:je.print.show_field_name_in_qr_code)===!0&&((Ee=e(t).serialize)==null?void 0:Ee.print.show_content_label_in_qr_code.status)===!1||((Be=e(t).serialize)==null?void 0:Be.print.show_field_name_in_qr_code)===!0&&((Fe=e(t).serialize)==null?void 0:Fe.print.show_content_label_in_qr_code.status)===!0&&((Oe=e(t).serialize)==null?void 0:Oe.print.show_content_label_in_qr_code.attributes.expired_date)===!0?(o(),d("p",fa,h(((Ue=(Ke=e(t).serialize)==null?void 0:Ke.print)==null?void 0:Ue.format_date)==="date"?e(M)((Je=(He=e(c))==null?void 0:He.date)==null?void 0:Je.expired_date).format("D MMM yyyy"):e(M)((Ve=(Qe=e(c))==null?void 0:Qe.date)==null?void 0:Ve.expired_date).format("MMM yyyy")),1)):u("",!0)]),i("div",va,[((Ge=e(t).serialize)==null?void 0:Ge.print.show_field_name_in_qr_code)===!0&&((Ye=e(t).serialize)==null?void 0:Ye.print.show_content_label_in_qr_code.status)===!0&&((We=e(t).serialize)==null?void 0:We.print.show_content_label_in_qr_code.attributes.het)===!0?(o(),d("p",ma,ba)):u("",!0),((Xe=e(t).serialize)==null?void 0:Xe.print.show_field_name_in_qr_code)===!0&&((Ze=e(t).serialize)==null?void 0:Ze.print.show_content_label_in_qr_code.status)===!1||((et=e(t).serialize)==null?void 0:et.print.show_field_name_in_qr_code)===!0&&((tt=e(t).serialize)==null?void 0:tt.print.show_content_label_in_qr_code.status)===!0&&((st=e(t).serialize)==null?void 0:st.print.show_content_label_in_qr_code.attributes.het)===!0?(o(),d("p",ga,h(r.$filters.toRupiah((it=e(c).product)==null?void 0:it.highest_retail_price)),1)):u("",!0)]),i("div",qa,[((at=e(t).serialize)==null?void 0:at.print.show_field_name_in_qr_code)===!0&&((nt=e(t).serialize)==null?void 0:nt.print.show_content_label_in_qr_code.status)===!0&&((lt=e(t).serialize)==null?void 0:lt.print.show_content_label_in_qr_code.attributes.serial_number)===!0?(o(),d("p",za,Da)):u("",!0),((ot=e(t).serialize)==null?void 0:ot.print.show_field_name_in_qr_code)===!0&&((rt=e(t).serialize)==null?void 0:rt.print.show_content_label_in_qr_code.status)===!1||((_t=e(t).serialize)==null?void 0:_t.print.show_field_name_in_qr_code)===!0&&((dt=e(t).serialize)==null?void 0:dt.print.show_content_label_in_qr_code.status)===!0&&((ut=e(t).serialize)==null?void 0:ut.print.show_content_label_in_qr_code.attributes.serial_number)===!0?(o(),d("p",Ca,h(l.code?l.code:"-"),1)):u("",!0)]),i("div",Sa,[Ma,i("p",La,h(r.$filters.isEmpty(l.serialize.maximum)),1)])])):(o(),d(x,{key:1},[i("div",Ra,[((ct=e(t).serialize)==null?void 0:ct.print.show_field_name_in_qr_code)===!0&&((pt=e(t).serialize)==null?void 0:pt.print.show_content_label_in_qr_code.status)===!0&&((ht=e(t).serialize)==null?void 0:ht.print.show_content_label_in_qr_code.attributes.nie)===!0?(o(),d("p",Ia,[i("div",null,h(((mt=(vt=(ft=e(t))==null?void 0:ft.serialize)==null?void 0:vt.kind)==null?void 0:mt.value)==="authentication_gtin"?"GTIN":"NIE"),1),Pa])):u("",!0),((wt=e(t).serialize)==null?void 0:wt.print.show_field_name_in_qr_code)===!0&&((yt=e(t).serialize)==null?void 0:yt.print.show_content_label_in_qr_code.status)===!1||((bt=e(t).serialize)==null?void 0:bt.print.show_field_name_in_qr_code)===!0&&((gt=e(t).serialize)==null?void 0:gt.print.show_content_label_in_qr_code.status)===!0&&((qt=e(t).serialize)==null?void 0:qt.print.show_content_label_in_qr_code.attributes.nie)===!0?(o(),d("p",Ta,[((zt=e(t).serialize)==null?void 0:zt.kind.value)==="authentication_gtin"?(o(),d(x,{key:0},[v(h((kt=e(t).serialize)==null?void 0:kt.kind["level"+e(m).level]),1)],64)):(o(),d(x,{key:1},[v(h((xt=e(t).nie)==null?void 0:xt.number),1)],64))])):u("",!0)]),i("div",$a,[((Dt=e(t).serialize)==null?void 0:Dt.print.show_field_name_in_qr_code)===!0&&((Ct=e(t).serialize)==null?void 0:Ct.print.show_content_label_in_qr_code.status)===!0&&((St=e(t).serialize)==null?void 0:St.print.show_content_label_in_qr_code.attributes.batch)===!0?(o(),d("p",Aa,Ea)):u("",!0),((Mt=e(t).serialize)==null?void 0:Mt.print.show_field_name_in_qr_code)===!0&&((Lt=e(t).serialize)==null?void 0:Lt.print.show_content_label_in_qr_code.status)===!1||((Rt=e(t).serialize)==null?void 0:Rt.print.show_field_name_in_qr_code)===!0&&((It=e(t).serialize)==null?void 0:It.print.show_content_label_in_qr_code.status)===!0&&((Pt=e(t).serialize)==null?void 0:Pt.print.show_content_label_in_qr_code.attributes.batch)===!0?(o(),d("p",Ba,h(e(c).batch_number),1)):u("",!0)]),i("div",Fa,[((Tt=e(t).serialize)==null?void 0:Tt.print.show_field_name_in_qr_code)===!0&&(($t=e(t).serialize)==null?void 0:$t.print.show_content_label_in_qr_code.status)===!0&&((At=e(t).serialize)==null?void 0:At.print.show_content_label_in_qr_code.attributes.mfg_date)===!0?(o(),d("p",Oa,Ha)):u("",!0),((Nt=e(t).serialize)==null?void 0:Nt.print.show_field_name_in_qr_code)===!0&&((jt=e(t).serialize)==null?void 0:jt.print.show_content_label_in_qr_code.status)===!1||((Et=e(t).serialize)==null?void 0:Et.print.show_field_name_in_qr_code)===!0&&((Bt=e(t).serialize)==null?void 0:Bt.print.show_content_label_in_qr_code.status)===!0&&((Ft=e(t).serialize)==null?void 0:Ft.print.show_content_label_in_qr_code.attributes.mfg_date)===!0?(o(),d("p",Ja,h(((Kt=(Ot=e(t).serialize)==null?void 0:Ot.print)==null?void 0:Kt.format_date)==="date"?e(M)((Ht=(Ut=e(c))==null?void 0:Ut.date)==null?void 0:Ht.manufacture_date).format("D MMM yyyy"):e(M)((Qt=(Jt=e(c))==null?void 0:Jt.date)==null?void 0:Qt.manufacture_date).format("MMM yyyy")),1)):u("",!0)]),i("div",Qa,[((Vt=e(t).serialize)==null?void 0:Vt.print.show_field_name_in_qr_code)===!0&&((Gt=e(t).serialize)==null?void 0:Gt.print.show_content_label_in_qr_code.status)===!0&&((Yt=e(t).serialize)==null?void 0:Yt.print.show_content_label_in_qr_code.attributes.expired_date)===!0?(o(),d("p",Va,Wa)):u("",!0),((Wt=e(t).serialize)==null?void 0:Wt.print.show_field_name_in_qr_code)===!0&&((Xt=e(t).serialize)==null?void 0:Xt.print.show_content_label_in_qr_code.status)===!1||((Zt=e(t).serialize)==null?void 0:Zt.print.show_field_name_in_qr_code)===!0&&((es=e(t).serialize)==null?void 0:es.print.show_content_label_in_qr_code.status)===!0&&((ts=e(t).serialize)==null?void 0:ts.print.show_content_label_in_qr_code.attributes.expired_date)===!0?(o(),d("p",Xa,h(((is=(ss=e(t).serialize)==null?void 0:ss.print)==null?void 0:is.format_date)==="date"?e(M)((ns=(as=e(c))==null?void 0:as.date)==null?void 0:ns.expired_date).format("D MMM yyyy"):e(M)((os=(ls=e(c))==null?void 0:ls.date)==null?void 0:os.expired_date).format("MMM yyyy")),1)):u("",!0)]),i("div",Za,[((rs=e(t).serialize)==null?void 0:rs.print.show_field_name_in_qr_code)===!0&&((_s=e(t).serialize)==null?void 0:_s.print.show_content_label_in_qr_code.status)===!0&&((ds=e(t).serialize)==null?void 0:ds.print.show_content_label_in_qr_code.attributes.het)===!0?(o(),d("p",en,an)):u("",!0),((us=e(t).serialize)==null?void 0:us.print.show_field_name_in_qr_code)===!0&&((cs=e(t).serialize)==null?void 0:cs.print.show_content_label_in_qr_code.status)===!1||((ps=e(t).serialize)==null?void 0:ps.print.show_field_name_in_qr_code)===!0&&((hs=e(t).serialize)==null?void 0:hs.print.show_content_label_in_qr_code.status)===!0&&((fs=e(t).serialize)==null?void 0:fs.print.show_content_label_in_qr_code.attributes.het)===!0?(o(),d("p",nn,h(r.$filters.toRupiah((vs=e(c).product)==null?void 0:vs.highest_retail_price)),1)):u("",!0)]),i("div",ln,[((ms=e(t).serialize)==null?void 0:ms.print.show_field_name_in_qr_code)===!0&&((ws=e(t).serialize)==null?void 0:ws.print.show_content_label_in_qr_code.status)===!0&&((ys=e(t).serialize)==null?void 0:ys.print.show_content_label_in_qr_code.attributes.serial_number)===!0?(o(),d("p",on,dn)):u("",!0),((bs=e(t).serialize)==null?void 0:bs.print.show_field_name_in_qr_code)===!0&&((gs=e(t).serialize)==null?void 0:gs.print.show_content_label_in_qr_code.status)===!1||((qs=e(t).serialize)==null?void 0:qs.print.show_field_name_in_qr_code)===!0&&((zs=e(t).serialize)==null?void 0:zs.print.show_content_label_in_qr_code.status)===!0&&((ks=e(t).serialize)==null?void 0:ks.print.show_content_label_in_qr_code.attributes.serial_number)===!0?(o(),d("p",un,h(l.sn?l.sn:"-"),1)):u("",!0)])],64))]),i("div",cn,[n(Xs,{options:{width:75},value:l.code},null,8,["value"])])])]}),_:2},1024)]),_:2},1024))),128))]),_:1})])]),_:1})),i("div",pn,[n(ei,{page:e(m).page,"onUpdate:page":[s[2]||(s[2]=l=>e(m).page=l),s[3]||(s[3]=l=>N(e(m).level))],"page-count":e(b).total_page,"page-slot":7,"show-size-picker":e(b).total_data>10,"page-sizes":[10,20,30,40,50],"onUpdate:pageSize":Ps},null,8,["page","page-count","show-size-picker"])])])],64)),i("div",hn,[i("div",fn,[n(ti,{to:{name:"produksi-serialisasi-id-print"},class:"text-decoration-none"},{default:_(()=>[n(k,{loading:e(w),color:"#828282",class:"button-tnt"},{default:_(()=>[v(" Kembali ")]),_:1},8,["loading"])]),_:1})])])]),n(qi,{show:e(H).show,"onUpdate:show":s[4]||(s[4]=l=>e(H).show=l),data:e(K),isLoading:e(w),"onClick:close":s[5]||(s[5]=l=>X(!1)),"onClick:selectPrinter":s[6]||(s[6]=l=>V(!0))},null,8,["show","data","isLoading"]),n(zi,{show:e($).show,"after-send":e($).isAfterSend,serializeLevelDataRes:e(b),printerDriverDataRes:e(K),"onClick:close":s[7]||(s[7]=l=>V(!1)),"onClick:seeData":s[8]||(s[8]=l=>Es(!0)),"onClick:sendData":Bs,"onClick:print":s[9]||(s[9]=l=>G(!0)),"onClick:resetInsert":Us,"onClick:logPrint":Js},null,8,["show","after-send","serializeLevelDataRes","printerDriverDataRes"]),n(Di,{show:e(S).isLog,"onUpdate:show":s[10]||(s[10]=l=>e(S).isLog=l),"is-log":e(S).isLog,serializeLevelDataRes:e(b),serializeDetailDataRes:e(c),"onClick:close":s[11]||(s[11]=l=>js(!1))},null,8,["show","is-log","serializeLevelDataRes","serializeDetailDataRes"]),n(xi,{show:e(W).show,serializeLevelDataRes:e(b),detailDataRes:e(c),"onClick:close":s[12]||(s[12]=l=>G(!1)),"onClick:next":Os,"onUpdate:serial":Fs},null,8,["show","serializeLevelDataRes","detailDataRes"]),n(ki,{show:e(Q).show,serializeLevelDataRes:e(b),serialArr:e(U),detailProductDataRes:e(t),onConfirmClick:Qs},null,8,["show","serializeLevelDataRes","serialArr","detailProductDataRes"]),n(Ci,{show:e(J).show,"onUpdate:show":s[13]||(s[13]=l=>e(J).show=l),serializeDetailDataRes:e(c)},null,8,["show","serializeDetailDataRes"]),n(si,{show:e(a).show,"onUpdate:show":s[14]||(s[14]=l=>e(a).show=l),icon:e(a).icon,"icon-color":e(a).iconColor,"hide-icon":e(a).hideIcon,title:e(a).title,subtitle:e(a).subtitle},{default:_(()=>[n(y,{justify:"center"},{default:_(()=>[e(a).type=="confirm"?(o(),d(x,{key:0},[n(k,{loading:e(w),color:"#828282",class:"button-tnt",onClick:I},{default:_(()=>[v(" Tutup ")]),_:1},8,["loading"]),n(k,{loading:e(w),color:"#219653",class:"button-tnt",style:{"padding-left":"25px","padding-right":"25px"},onClick:F(As,["prevent"])},{default:_(()=>[v(" Yakin ")]),_:1},8,["loading","onClick"])],64)):u("",!0),e(a).type=="confirm-print"?(o(),d(x,{key:1},[n(k,{loading:e(w),color:"#828282",class:"button-tnt",onClick:I},{default:_(()=>[v(" Tutup ")]),_:1},8,["loading"]),n(k,{loading:e(w),color:"#219653",class:"button-tnt",style:{"padding-left":"25px","padding-right":"25px"},onClick:F(Ks,["prevent"])},{default:_(()=>[v(" Yakin ")]),_:1},8,["loading","onClick"])],64)):u("",!0),e(a).type=="reset-insert"?(o(),d(x,{key:2},[n(k,{color:"#828282",class:"button-tnt",onClick:I},{default:_(()=>[v(" Tutup ")]),_:1}),n(k,{type:"error",class:"button-tnt",onClick:Hs},{default:_(()=>[v(" Reset ")]),_:1})],64)):u("",!0),e(a).type=="success"?(o(),P(k,{key:3,color:"#828282",class:"button-tnt",onClick:I},{default:_(()=>[v(" Tutup ")]),_:1})):u("",!0),e(a).type=="failed"?(o(),P(k,{key:4,color:"#828282",class:"button-tnt",onClick:I},{default:_(()=>[v(" Tutup ")]),_:1})):u("",!0)]),_:1})]),_:1},8,["show","icon","icon-color","hide-icon","title","subtitle"])],64)}}});export{$n as default};
