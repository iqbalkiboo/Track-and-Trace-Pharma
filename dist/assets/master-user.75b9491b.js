import{a2 as s,a3 as d}from"./index.21c0d750.js";import{g as c}from"./getSuperholdingId.94511ad9.js";import{g as i}from"./getHoldingId.48f570fc.js";import{g as n}from"./getCompanyId.7d0eb93b.js";s.interceptors.request.use(d.auth);const l={async getUser(t){return t.company_id=n,(await s.get("/user/v1/list",{params:t})).data},async getDetailUser(t){const a={company_id:n};return(await s.get(`/user/v1/detail/${t}`,{params:a})).data},async createUser(t,a){return(await s.post("/user/v1/create",t,{headers:{"Content-Type":"multipart/form-data"},params:a})).data},async updateUser(t,a,e){return(await s.put(`/user/v1/update/${t}`,a,{headers:{"Content-Type":"multipart/form-data"},params:e})).data},async deleteUser(t){const a={company_id:n};return(await s.delete(`/user/v1/soft-delete/${t}`,{params:a})).data},async resetPasswordUser(t,a){const e={company_id:n};return(await s.post(`/user/v1/reset-password/${t}`,a,{headers:{"Content-Type":"multipart/form-data"},params:e})).data},async getCompany(t){return t.holding_id=i,(await s.get("/company/v1/list",{params:t})).data},async getHolding(t){return t.superholding_id=c,(await s.get("/company/v1/holding/list",{params:t})).data},async getSuperHolding(t){return(await s.get("/company/v1/super-holding/list",{params:t})).data}};export{l as m};
