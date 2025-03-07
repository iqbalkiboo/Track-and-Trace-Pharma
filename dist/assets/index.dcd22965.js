import{_ as ae}from"./t-loading.vue_vue_type_script_setup_true_lang.71bf4981.js";import{d as oe,u as se,E as ne,r as v,f as le,o as p,c as g,k as n,w as l,q as d,a as e,i as c,F as U,g as V,h as W,t as i,ah as C,aY as S,aZ as b,j as T,af as ie,am as re,an as ce,v as ue,ak as de,s as _e,K as pe,a9 as me,aa as ge,L as he,ag as fe}from"./index.21c0d750.js";import{m as A}from"./master-warehouse.353b4b3b.js";import"./getCompanyId.7d0eb93b.js";const ye={class:"body-tnt"},ve={style:{display:"flex","align-items":"end"}},xe={key:0,class:"card-tnt"},ke={style:{display:"flex","align-items":"center","justify-content":"space-between"}},we={style:{"font-weight":"600","font-size":"16px","margin-top":"0","margin-bottom":"0"}},Ce=["value","id"],Se={key:0,style:{"max-height":"260px",overflow:"auto","margin-top":"20px","margin-bottom":"20px"}},be=e("thead",null,[e("tr",null,[e("th",null,"Warehouse Building"),e("th",{style:{"text-align":"right"}},"Qty Room"),e("th",{style:{"text-align":"right"}},"Kapasitas(m\xB3)"),e("th",{style:{"text-align":"right"}},"Terisi(m\xB3)"),e("th",{style:{"text-align":"right"}},"Usage(%)"),e("th",{style:{"text-align":"right"}},"Total SKU"),e("th",{style:{"text-align":"right"}},"Total Stok"),e("th",{style:{width:"12rem","text-align":"center"}},"Aksi")])],-1),Be=["value","id"],$e={style:{"text-align":"right"}},Ie={style:{"text-align":"right"}},Te={style:{"text-align":"right"}},Ne={style:{"text-align":"right"}},ze={style:{"text-align":"right"}},De={style:{"text-align":"right"}},Le={style:{"text-align":"center"}},je={style:{display:"flex","justify-content":"center"}},Ve=oe({__name:"index",setup(Me){const N=se(),h=ne(),B=v(!1),f=v(!1),m=v({}),u=v({search:"",sort:"desc",sort_field:"created_at",page:1,limit:10});le(()=>{localStorage.removeItem("warehouse_name"),localStorage.removeItem("warehouse_type"),localStorage.removeItem("plant_id"),localStorage.removeItem("building_id"),localStorage.removeItem("room_id"),localStorage.removeItem("rack_id"),localStorage.removeItem("bin_id"),localStorage.removeItem("batch_number"),x()});async function x(){B.value=!0,await F(),B.value=!1}async function F(){await A.getWarehouse(u.value).then(t=>{m.value=t.data}).catch(t=>{const a=t.response.data;h.error(a.message)})}async function q(t,a){const r={warehouse_id:"",sort:"desc",sort_field:"created_at",page:1,limit:1e3};f.value=!0,r.warehouse_id=t,A.getBuilding(r).then(_=>{_.data.list.length>0?t===_.data.list[0].warehouse.id&&(m.value.list[a].is_show_detail=!0,m.value.list[a].building=_.data.list,f.value=!1,m.value.list[a].building.forEach(y=>y.is_show_detail=!1)):(f.value=!1,h.error("Plant/Cabang tidak memiliki building"))}).catch(_=>{const y=_.response.data;h.error(y.message),f.value=!1})}function H(t){u.value.page=1,u.value.limit=t,x()}const z=v(0);function Q(){u.value.page=1,clearTimeout(z.value),z.value=setTimeout(function(){x()},600)}function Y(t){const a=document.getElementById("copyCodePlant"+t);a.select(),a.setSelectionRange(0,99999),navigator.clipboard.writeText(a.value),h.success("Kode erp tersalin")}function Z(t,a){const r=document.getElementById("copyCodeBuilding"+t+a);r.select(),r.setSelectionRange(0,99999),navigator.clipboard.writeText(r.value),h.success("Kode erp tersalin")}function G(t,a,r){localStorage.setItem("warehouse_name",r),localStorage.setItem("plant_id",t),N.push({name:"penyimpanan-stok-id-detail-building",params:{id:a}})}function Pe(t,a,r,_){localStorage.setItem("warehouse_type",a),localStorage.setItem("warehouse_name",_),localStorage.setItem("plant_id",t),N.push({name:"penyimpanan-stok-id-detail-list-product",params:{id:r}})}return(t,a)=>{const r=ie,_=re,y=ce,k=ue,J=de,O=ae,$=_e,D=pe,L=me,X=ge,ee=he,te=fe;return p(),g("div",ye,[n(k,{vertical:"",size:14},{default:l(()=>[n(k,{justify:"space-between"},{default:l(()=>[n(k,{vertical:"",size:0},{default:l(()=>[n(r,{style:{"margin-bottom":"4px"}},{default:l(()=>[d("Penyimpanan Stok")]),_:1}),n(y,null,{default:l(()=>[n(_,null,{default:l(()=>[d("Penyimpanan Stok")]),_:1})]),_:1})]),_:1}),e("div",ve,[n(J,{value:c(u).search,"onUpdate:value":[a[0]||(a[0]=s=>c(u).search=s),Q],type:"text",placeholder:"Cari nama plant/cabang",style:{width:"350px","max-width":"200%"}},null,8,["value"])])]),_:1}),c(B)?(p(),g("div",xe,[n(O)])):(p(!0),g(U,{key:1},V(c(m).list,(s,w)=>(p(),W(ee,{key:w,style:{"border-radius":"10px"}},{default:l(()=>[e("div",ke,[e("div",null,[e("h2",we,i(s.name),1),e("div",null,[n($,{type:"primary",strong:"",style:{cursor:"pointer"},onClick:C(o=>Y(w),["prevent"])},{default:l(()=>[d(i(s.erp_code),1)]),_:2},1032,["onClick"])]),S(e("div",null,[S(e("input",{type:"text",value:s.erp_code,id:"copyCodePlant"+w},null,8,Ce),[[b,!1]])],512),[[b,!1]]),e("div",null,[n($,null,{default:l(()=>[d("Lokasi Warehouse : "+i(t.$filters.setAddress(s.address)),1)]),_:2},1024)]),s.counts.building>0&&!s.is_show_detail?(p(),W(D,{key:0,loading:c(f),ghost:"",type:"primary",class:"button-tnt",style:{"margin-top":"8px"},onClick:C(o=>q(s.id,w),["prevent"])},{default:l(()=>[d(" Detail Plant/Cabang ")]),_:2},1032,["loading","onClick"])):T("",!0)]),e("div",null,[n(L,{bordered:!1,style:{"margin-right":"10px",width:"8rem",height:"2rem","justify-content":"center"}},{default:l(()=>[d(i(s.counts.building)+" Building ",1)]),_:2},1024),n(L,{bordered:!1,style:{"margin-right":"10px",width:"8rem",height:"2rem","justify-content":"center"}},{default:l(()=>[d(i(s.counts.room)+" Room ",1)]),_:2},1024)])]),s.building?(p(),g("div",Se,[n(X,{bordered:!1,"single-line":!1},{default:l(()=>[be,e("tbody",null,[(p(!0),g(U,null,V(s.building,(o,I)=>{var j,M,P,R,E;return p(),g("tr",{key:I},[e("td",null,[e("div",null,[d(i(o.name)+" ",1),n($,{type:"primary",strong:"",style:{"font-size":"11px",display:"block",cursor:"pointer"},onClick:C(K=>Z(I,o.erp_code),["prevent"])},{default:l(()=>[d(i(o.erp_code),1)]),_:2},1032,["onClick"])]),S(e("div",null,[S(e("input",{type:"text",value:o.erp_code,id:"copyCodeBuilding"+I+o.erp_code},null,8,Be),[[b,!1]])],512),[[b,!1]])]),e("td",$e,i(t.$filters.toNumber((j=o==null?void 0:o.counts)==null?void 0:j.room)),1),e("td",Ie,i(t.$filters.toNumber(o==null?void 0:o.volume)),1),e("td",Te,i(t.$filters.toNumber((M=o==null?void 0:o.results)==null?void 0:M.total_used_volume)),1),e("td",Ne,i(t.$filters.toNumber((P=o==null?void 0:o.results)==null?void 0:P.total_used_volume_percent)),1),e("td",ze,i(t.$filters.toNumber((R=o.results)==null?void 0:R.total_product)),1),e("td",De,i(t.$filters.toNumber((E=o.results)==null?void 0:E.total_first_level)),1),e("td",Le,[n(k,{justify:"center"},{default:l(()=>[n(D,{tertiary:"",onClick:C(K=>G(s.id,o.id,s.name),["prevent"])},{default:l(()=>[d(" Detail ")]),_:2},1032,["onClick"]),T("",!0)]),_:2},1024)])])}),128))])]),_:2},1024)])):T("",!0)]),_:2},1024))),128)),e("div",je,[n(te,{page:c(u).page,"onUpdate:page":[a[1]||(a[1]=s=>c(u).page=s),x],"page-size":c(u).limit,"onUpdate:pageSize":[a[2]||(a[2]=s=>c(u).limit=s),H],"page-count":c(m).total_page,"page-slot":7,"show-size-picker":c(m).total_data>10,"page-sizes":[10,20,30,40,50]},null,8,["page","page-size","page-count","show-size-picker"])])]),_:1})])}}});export{Ve as default};
