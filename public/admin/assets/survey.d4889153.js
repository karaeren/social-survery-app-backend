var B=Object.defineProperty,S=Object.defineProperties;var k=Object.getOwnPropertyDescriptors;var v=Object.getOwnPropertySymbols;var C=Object.prototype.hasOwnProperty,x=Object.prototype.propertyIsEnumerable;var y=(n,t,s)=>t in n?B(n,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):n[t]=s,i=(n,t)=>{for(var s in t||(t={}))C.call(t,s)&&y(n,s,t[s]);if(v)for(var s of v(t))x.call(t,s)&&y(n,s,t[s]);return n},h=(n,t)=>S(n,k(t));import{p}from"./vendor.9334939d.js";function m(){async function n(e,a,r,o,u,c=1e3,d=1){return(await p.get("https://socialsurveyapp.software/api/v1/survey",{params:h(i(i(i(i({},a&&{name:a}),r&&{searchForName:r}),o&&{categoryId:o}),u&&{sortBy:u}),{includeGeoSpecificSurveys:!0,limit:c,page:d}),headers:{Authorization:`Bearer ${e}`}})).data}async function t(e,a){return(await p.post("https://socialsurveyapp.software/api/v1/survey",a,{headers:{Authorization:`Bearer ${e}`}})).data}async function s(e,a,r,o,u,c,d){return(await p.patch(`https://socialsurveyapp.software/api/v1/survey/${a}`,{name:r,description:o,categoryId:u,expireDate:c,geoFeatures:d},{headers:{Authorization:`Bearer ${e}`}})).data}async function f(e,a){return(await p.delete(`https://socialsurveyapp.software/api/v1/survey/${a}`,{headers:{Authorization:`Bearer ${e}`}})).data}async function w(e){return(await p.get("https://socialsurveyapp.software/api/v1/survey/categories",{headers:{Authorization:`Bearer ${e}`}})).data}async function l(e,a){return a.rank&&a.rank==="0"?delete a.rank:a.rank=parseInt(a.rank),(await p.post("https://socialsurveyapp.software/api/v1/survey/categories",a,{headers:{Authorization:`Bearer ${e}`}})).data}async function $(e,a,r,o,u){return(await p.patch(`https://socialsurveyapp.software/api/v1/survey/categories/${a}`,i(i(i({},r&&{name:r}),o&&{color:o}),u&&{rank:u}),{headers:{Authorization:`Bearer ${e}`}})).data}async function g(e,a){return(await p.delete(`https://socialsurveyapp.software/api/v1/survey/categories/${a}`,{headers:{Authorization:`Bearer ${e}`}})).data}return{getSurveys:n,createSurvey:t,updateSurvey:s,deleteSurvey:f,getCategories:w,createCategory:l,updateCategory:$,deleteCategory:g}}export{m as u};
