import{a2 as e,a3 as i}from"./index.21c0d750.js";import{g as s}from"./getCompanyId.7d0eb93b.js";e.interceptors.request.use(i.auth);const o={async getManifest(t){return t.company_id=s,(await e.get("/shipping/v1/manifest/list",{params:t})).data},async getDetailManifest(t){const a={company_id:s};return(await e.get(`/shipping/v1/manifest/detail/${t}`,{params:a})).data},async getManifestPacking(t){return t.company_id=s,(await e.get("/shipping/v1/manifest-packing/list",{params:t})).data},async getManifestLog(t){return t.company_id=s,(await e.get("/shipping/v1/manifest-log/list",{params:t})).data},async getPrintLoading(t,a){return a.company_id=s,(await e.get(`/shipping/v1/manifest/print/loading/${t}`,{params:a})).data},async detailReject(t){return(await e.post("/reject/v1/manifest-reject/detail",t,{params:{company_id:s}})).data},async rejectAccept(t){return(await e.post("/reject/v1/manifest-reject/accept",t,{params:{company_id:s}})).data}};export{o as l};
