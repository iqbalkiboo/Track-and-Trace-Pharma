import{_ as pe}from"./t-permission-modal.bdf6acbc.js";import{_ as ce}from"./t-feedback.vue_vue_type_script_setup_true_lang.83eb0b14.js";import{_ as me}from"./t-loading.vue_vue_type_script_setup_true_lang.71bf4981.js";import{d as ve,b as fe,u as he,E as ge,e as ke,r as p,f as _e,aF as j,a1 as be,p as ye,o as g,c as N,a as F,k as r,w as i,q as m,t as L,i as t,h as C,aY as we,aZ as Ce,j as E,F as I,ah as Ee,af as Ue,am as Pe,an as De,ak as Ae,I as xe,H as Te,J as Me,K as Fe,v as Re}from"./index.21c0d750.js";import{c as R}from"./constant.549d5c21.js";import{m as U}from"./master-user.75b9491b.js";import{a as qe}from"./hak-akses.99e628b7.js";import{m as He}from"./master-warehouse.353b4b3b.js";import{g as Ne}from"./getCompanyId.7d0eb93b.js";import{C as Ie}from"./CheckmarkCircleOutline.8fddcae1.js";import{A as Se}from"./AlertCircleOutline.19cf574c.js";import"./getSuperholdingId.94511ad9.js";import"./getHoldingId.48f570fc.js";const $e={class:"body-tnt"},Be={class:"card-tnt"},Ke={class:"bottom-action-button"},Ve={class:"action-item"},sa=ve({__name:"index",setup(Oe){const q=fe(),Y=he(),_=ge(),A=ke.getAuth(),P=p(!1),f=p(!1),Q=p(""),c=p(""),H=p([]),b=p([]),S=p([]),X=[{label:"Aktif",value:1},{label:"Tidak Aktif",value:0}],D=p({show:!1}),h=p({id:"",key:"",label:""}),x=Ne;_e(()=>{q.params.crud=="create"?(c.value="create",j.isGranted(R.accessPrivileges.driver+".create")?$():D.value.show=!0):(c.value="update",j.isGranted(R.accessPrivileges.driver+".update")?$():D.value.show=!0)});function ee(){D.value.show=!1}async function $(){if(P.value=!0,c.value=="update"){const a=q.params.id;A.xxtype=="5up3r4dm1n"&&await B(),await K(),await U.getDetailUser(a).then(e=>{te(e.data),P.value=!1}).catch(e=>{P.value=!1;const l=e.response.data;_.error(l.message)})}else A.xxtype=="5up3r4dm1n"&&await B(),await K(),P.value=!1}async function B(){s.value.access=null,s.value.roleUser=x;const a={limit:1e3};await qe.getRoleType(a).then(e=>{e.data.list.forEach(n=>{n.key==="driver"&&(c.value==="create"&&(s.value.access=n.id,W(n.key,n)),H.value.push({key:n.key,value:n.id,label:n.name}))})}).catch(e=>{const l=e.response.data;_.error(l.message)})}async function K(){s.value.plant=null;const a={limit:1e3};await He.getWarehouse(a).then(e=>{e.data.list.forEach(n=>{S.value.push({key:n.key,value:n.id,label:n.name})})}).catch(e=>{const l=e.response.data;_.error(l.message)})}async function V(a){const e={limit:1e3};a==="company"?(b.value=[],await U.getCompany(e).then(l=>{l.data.list.forEach(d=>{b.value.push({key:d.name,value:d.id,label:d.name})})}).catch(l=>{const n=l.response.data;_.error(n.message)})):a==="holding"?(b.value=[],await U.getHolding(e).then(l=>{l.data.list.forEach(d=>{b.value.push({key:d.name,value:d.id,label:d.name})})}).catch(l=>{const n=l.response.data;_.error(n.message)})):(b.value=[],U.getSuperHolding(e).then(l=>{l.data.list.forEach(d=>{b.value.push({key:d.name,value:d.id,label:d.name})})}).catch(l=>{const n=l.response.data;_.error(n.message)}))}const O=p(null),s=p({status:1}),T=p(!0),G=p();G.value={name:{required:!0,message:"Nama Driver tidak boleh kosong",trigger:["input","blur"]},username:{required:!0,validator(a,e){const l=/\s/;if(e){if(e.match(l))return new Error("Username tidak boleh menggunakan spasi")}else return new Error("Username tidak boleh kosong");return!0},trigger:["input","blur"]},email:{required:!0,validator(a,e){const l=/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;if(e){if(!e.match(l))return new Error("Email tidak valid")}else return new Error("Email tidak boleh kosong");return!0},trigger:["input","blur"]},phone:{required:!0,validator(a,e){if(e)if(/^\d*$/.test(e)){if(e.length<8)return new Error("No. Hp kurang dari 8 angka")}else return new Error("No. Hp harus angka");else return new Error("No. Hp tidak boleh kosong");return!0},trigger:["input","blur"]},position:{required:!0,message:"Jabatan tidak boleh kosong",trigger:["input","blur"]},access:{required:!0,message:"Hak akses tidak boleh kosong",trigger:["input","blur"]},roleUser:{required:!0,message:"Kolom tidak boleh kosong",trigger:["input","blur"]},plant:{type:"array",required:!0,message:"Nama plant/cabang tidak boleh kosong",trigger:["input","blur"]},password:{required:!0,validator(a,e){const l=/[a-z]/g,n=/[A-Z]/g,d=/[0-9]/g;if(e)if(e.match(l))if(e.match(n))if(e.match(d)){if(e.length<4)return new Error("Password minimal 4 karakter")}else return new Error("Password minimal 1 angka");else return new Error("Password minimal 1 huruf besar");else return new Error("Password minimal 1 huruf kecil");else return new Error("Password tidak boleh kosong");return!0},trigger:["input","blur"]},confirmPassword:{required:!0,validator(a,e){if(e){if(e!==s.value.password)return new Error("Konfirmasi password harus sama dengan password")}else return new Error("Konfirmasi password tidak boleh kosong");return!0},trigger:["input","blur"]},erpCode:{required:!0,message:"Kode ERP tidak boleh kosong",trigger:["input","blur"]},status:{type:"number",required:!0,message:"Status tidak boleh kosong",trigger:["input","blur"]}};function W(a,e){a=="add"?(Y.push({path:"/setting/hak-akses/create/1"}),h.value.key=e.key):(h.value.id=e.id,h.value.label=e.name,h.value.key=e.key,V(e.key))}async function Z(a){var e;a.preventDefault(),await((e=O.value)==null?void 0:e.validate().then(()=>{ne()}).catch(()=>{_.error("Form tidak valid, tolong periksa kembali")}))}function ae(){f.value=!0;const a=new FormData;if(a.append("name",s.value.name),a.append("username",s.value.username),a.append("email",s.value.email),a.append("phone",s.value.phone),a.append("position",s.value.position),A.xxtype=="5up3r4dm1n"&&(a.append("roles",s.value.access),a.append("role_user_type_id",s.value.roleUser)),a.append("status",s.value.status),a.append("erp_code",s.value.erpCode),s.value.plant.forEach(e=>{a.append("warehouse_id[]",e)}),c.value=="create"){let e={};a.append("company_id",x),e.company_id=x,U.createUser(a,e).then(()=>{f.value=!1,se(),y(),setTimeout(()=>{z()},300)}).catch(l=>{const n=l.response.data;f.value=!1,y(),setTimeout(()=>{J(n)},300)})}else{let e={};a.append("company_id",s.value.roleId),e.company_id=s.value.roleId;const l=q.params.id;U.updateUser(l,a,e).then(()=>{f.value=!1,y(),setTimeout(()=>{z()},300)}).catch(n=>{const d=n.response.data;f.value=!1,y(),setTimeout(()=>{J(d)},300)})}}function te(a){var l;A.xxtype=="5up3r4dm1n"&&H.value.forEach(async n=>{n.key==a.role.slug&&(h.value.id=n.value,h.value.key=n.key,h.value.label=n.label,await V(n.key),s.value.roleUser=a.user_type.id=="null"?x:a.user_type.id,s.value.access=h.value.id)});const e=p([]);a.warehouses.forEach(n=>{e.value.push(n.id)}),s.value={name:a.name,username:a.username,email:a.email,phone:a.phone,position:a.position,plant:e.value,is_verified_email:a.is_verified_email?a.is_verified_email:!0,password:"Admin123!",confirmPassword:"Admin123!",erpCode:a.erp_code,status:a.status.value,roleId:(l=a==null?void 0:a.role)==null?void 0:l.id},Q.value=a.email,h.value.key=a.user_type.kind}function se(){s.value={name:"",username:"",email:"",phone:"",position:"",plant:null,password:"",confirmPassword:"",erpCode:"",status:1}}const o=p({show:p(!1),icon:be(),iconColor:"",hideIcon:!1,title:"",subtitle:"",type:""});function y(){o.value.show=!1}function ne(){o.value.type="confirm",o.value.hideIcon=!0,o.value.title="Konfirmasi",c.value=="create"?o.value.subtitle="Apakah Anda yakin untuk menambah data driver?":o.value.subtitle="Apakah Anda yakin untuk mengubah data driver?",o.value.show=!0}function z(){o.value.type="success",o.value.hideIcon=!1,o.value.iconColor="#219653",o.value.icon=Ie,c.value=="create"?(o.value.title="Berhasil Tambah Data",o.value.subtitle="Data driver berhasil ditambahkan"):(o.value.title="Berhasil Ubah Data",o.value.subtitle="Data driver berhasil diubah"),o.value.show=!0}function J(a){o.value.type="failed",o.value.hideIcon=!1,o.value.iconColor="#EB5757",o.value.icon=Se,o.value.title="Gagal",Object.keys(a.validation).length>0?o.value.subtitle=a.validation:o.value.subtitle=a.message,o.value.show=!0}return(a,e)=>{const l=Ue,n=ye("router-link"),d=Pe,oe=De,le=me,w=Ae,v=xe,M=Te,re=Me,k=Fe,ie=Re,ue=ce,de=pe;return g(),N(I,null,[F("div",$e,[r(l,{style:{"margin-bottom":"4px"}},{default:i(()=>[m(L(t(c)=="create"?"Tambah Driver":"Edit Driver"),1)]),_:1}),r(oe,null,{default:i(()=>[r(d,null,{default:i(()=>[r(n,{to:"/setting/master-driver",class:"text-decoration-none"},{default:i(()=>[m(" Master Driver ")]),_:1})]),_:1}),r(d,null,{default:i(()=>[m(L(t(c)=="create"?"Tambah Driver":"Edit Driver"),1)]),_:1})]),_:1}),F("div",Be,[t(P)?(g(),C(le,{key:0})):(g(),C(re,{key:1,ref_key:"formRef",ref:O,class:"form-tnt",model:t(s),rules:t(G),"show-require-mark":!1},{default:i(()=>[r(v,{path:"name",label:"Nama Driver"},{default:i(()=>[r(w,{value:t(s).name,"onUpdate:value":e[0]||(e[0]=u=>t(s).name=u),placeholder:"Masukkan Nama Driver"},null,8,["value"])]),_:1}),r(v,{path:"username",label:"Username"},{default:i(()=>[r(w,{disabled:t(c)==="update",value:t(s).username,"onUpdate:value":e[1]||(e[1]=u=>t(s).username=u),placeholder:"Masukkan Username"},null,8,["disabled","value"])]),_:1}),r(v,{path:"email",label:"Email"},{default:i(()=>[r(w,{readonly:t(T),onFocus:e[2]||(e[2]=u=>T.value=!1),value:t(s).email,"onUpdate:value":e[3]||(e[3]=u=>t(s).email=u),placeholder:"Masukkan Email"},null,8,["readonly","value"])]),_:1}),r(v,{path:"position",label:"Jabatan"},{default:i(()=>[r(w,{value:t(s).position,"onUpdate:value":e[4]||(e[4]=u=>t(s).position=u),placeholder:"Masukkan Jabatan"},null,8,["value"])]),_:1}),r(v,{path:"access",label:"Hak Akses"},{default:i(()=>[r(M,{value:t(s).access,"onUpdate:value":[e[5]||(e[5]=u=>t(s).access=u),W],options:t(H),placeholder:"Tentukan Hak Akses"},null,8,["value","options"])]),_:1}),we(r(v,{path:"roleUser",label:"Company"},{default:i(()=>[r(M,{disabled:"",value:t(s).roleUser,"onUpdate:value":e[6]||(e[6]=u=>t(s).roleUser=u),options:t(b),placeholder:"Company"},null,8,["value","options"])]),_:1},512),[[Ce,!1]]),r(v,{path:"phone",label:"Phone"},{default:i(()=>[r(w,{readonly:t(T),onFocus:e[7]||(e[7]=u=>T.value=!1),value:t(s).phone,"onUpdate:value":e[8]||(e[8]=u=>t(s).phone=u),placeholder:"Masukkan Phone"},null,8,["readonly","value"])]),_:1}),r(v,{path:"plant",label:"Nama Plant/Cabang"},{default:i(()=>[r(M,{filterable:"",multiple:"",value:t(s).plant,"onUpdate:value":e[9]||(e[9]=u=>t(s).plant=u),options:t(S),placeholder:"Pilih Plant/Cabang",style:{width:"100%"}},null,8,["value","options"])]),_:1}),r(v,{label:"Kode ERP",path:"erpCode"},{default:i(()=>[r(w,{value:t(s).erpCode,"onUpdate:value":e[10]||(e[10]=u=>t(s).erpCode=u),placeholder:"Masukkan kode ERP"},null,8,["value"])]),_:1}),r(v,{path:"status",label:"Status"},{default:i(()=>[r(M,{value:t(s).status,"onUpdate:value":e[11]||(e[11]=u=>t(s).status=u),options:X,placeholder:"Pilih Status Driver",style:{width:"100%"}},null,8,["value"])]),_:1})]),_:1},8,["model","rules"]))]),F("div",Ke,[F("div",Ve,[r(n,{to:{name:"setting-master-driver"},class:"text-decoration-none"},{default:i(()=>[r(k,{color:"#828282",class:"button-tnt"},{default:i(()=>[m(" Kembali ")]),_:1})]),_:1}),t(c)==="create"&&a.$filters.isGranted(t(R).accessPrivileges.driver+".create")?(g(),C(k,{key:0,color:"#219653",class:"button-tnt",loading:t(f),onClick:Z},{default:i(()=>[m(" Simpan ")]),_:1},8,["loading"])):E("",!0),t(c)==="update"&&a.$filters.isGranted(t(R).accessPrivileges.driver+".update")?(g(),C(k,{key:1,color:"#219653",class:"button-tnt",loading:t(f),onClick:Z},{default:i(()=>[m(" Simpan ")]),_:1},8,["loading"])):E("",!0)])])]),r(ue,{show:t(o).show,"onUpdate:show":e[12]||(e[12]=u=>t(o).show=u),icon:t(o).icon,"icon-color":t(o).iconColor,"hide-icon":t(o).hideIcon,title:t(o).title,subtitle:t(o).subtitle},{default:i(()=>[r(ie,{justify:"center"},{default:i(()=>[t(o).type=="confirm"?(g(),N(I,{key:0},[r(k,{loading:t(f),color:"#828282",class:"button-tnt",onClick:y},{default:i(()=>[m(" Tutup ")]),_:1},8,["loading"]),r(k,{loading:t(f),color:"#219653",class:"button-tnt",style:{"padding-left":"25px","padding-right":"25px"},onClick:Ee(ae,["prevent"])},{default:i(()=>[m(" Yakin ")]),_:1},8,["loading","onClick"])],64)):E("",!0),t(o).type=="success"?(g(),N(I,{key:1},[t(c)=="create"?(g(),C(k,{key:0,color:"#828282",class:"button-tnt",onClick:y},{default:i(()=>[m(" Tambah Lainya ")]),_:1})):E("",!0),r(n,{to:{name:"setting-master-driver"},class:"text-decoration-none"},{default:i(()=>[r(k,{color:"#219653",class:"button-tnt"},{default:i(()=>[m(" Kembali ke Beranda ")]),_:1})]),_:1})],64)):E("",!0),t(o).type=="failed"?(g(),C(k,{key:2,color:"#828282",class:"button-tnt",onClick:y},{default:i(()=>[m(" Tutup ")]),_:1})):E("",!0)]),_:1})]),_:1},8,["show","icon","icon-color","hide-icon","title","subtitle"]),r(de,{show:t(D).show,"onUpdate:show":e[13]||(e[13]=u=>t(D).show=u),"onClick:close":ee},null,8,["show"])],64)}}});export{sa as default};
