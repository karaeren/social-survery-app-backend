var z=Object.defineProperty,B=Object.defineProperties;var S=Object.getOwnPropertyDescriptors;var h=Object.getOwnPropertySymbols;var k=Object.prototype.hasOwnProperty,C=Object.prototype.propertyIsEnumerable;var y=(o,t,r)=>t in o?z(o,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):o[t]=r,p=(o,t)=>{for(var r in t||(t={}))k.call(t,r)&&y(o,r,t[r]);if(h)for(var r of h(t))C.call(t,r)&&y(o,r,t[r]);return o},v=(o,t)=>B(o,S(t));import{p as u}from"./vendor.9334939d.js";function q(){async function o(e,a,s,n,i,c=1e3,d=1){return(await u.get("https://socialsurveyapp.software/api/v1/survey",{params:v(p(p(p(p({},a&&{name:a}),s&&{searchForName:s}),n&&{categoryId:n}),i&&{sortBy:i}),{includeGeoSpecificSurveys:!0,limit:c,page:d}),headers:{Authorization:`Bearer ${e}`}})).data}async function t(e,a){return(await u.post("https://socialsurveyapp.software/api/v1/survey",a,{headers:{Authorization:`Bearer ${e}`}})).data}async function r(e,a,s,n,i,c){return(await u.patch(`https://socialsurveyapp.software/api/v1/survey/${a}`,v(p(p(p({},s&&{name:s}),n&&{description:n}),i&&{categoryId:i}),{expireDate:c}),{headers:{Authorization:`Bearer ${e}`}})).data}async function f(e,a){return(await u.delete(`https://socialsurveyapp.software/api/v1/survey/${a}`,{headers:{Authorization:`Bearer ${e}`}})).data}async function w(e){return(await u.get("https://socialsurveyapp.software/api/v1/survey/categories",{headers:{Authorization:`Bearer ${e}`}})).data}async function l(e,a){return a.rank&&a.rank==="0"?delete a.rank:a.rank=parseInt(a.rank),(await u.post("https://socialsurveyapp.software/api/v1/survey/categories",a,{headers:{Authorization:`Bearer ${e}`}})).data}async function $(e,a,s,n,i){return(await u.patch(`https://socialsurveyapp.software/api/v1/survey/categories/${a}`,p(p(p({},s&&{name:s}),n&&{color:n}),i&&{rank:i}),{headers:{Authorization:`Bearer ${e}`}})).data}async function g(e,a){return(await u.delete(`https://socialsurveyapp.software/api/v1/survey/categories/${a}`,{headers:{Authorization:`Bearer ${e}`}})).data}return{getSurveys:o,createSurvey:t,updateSurvey:r,deleteSurvey:f,getCategories:w,createCategory:l,updateCategory:$,deleteCategory:g}}export{q as u};
