var P=Object.defineProperty,R=Object.defineProperties;var U=Object.getOwnPropertyDescriptors;var k=Object.getOwnPropertySymbols;var V=Object.prototype.hasOwnProperty,C=Object.prototype.propertyIsEnumerable;var x=(r,e,o)=>e in r?P(r,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):r[e]=o,m=(r,e)=>{for(var o in e||(e={}))V.call(e,o)&&x(r,o,e[o]);if(k)for(var o of k(e))C.call(e,o)&&x(r,o,e[o]);return r},w=(r,e)=>R(r,U(e));import{d as $,E as B,a as N,b as D,o as g,c as y,e as i,w as c,u as f,R as M,f as q,g as z,h as I,i as F,j as _,k as O,l as J,m as K,n as j,p as h,r as H,q as W,s as G,t as Q,v as X,x as v,y as Y,z as Z,A as T,B as ee,C as te,D as se,F as oe}from"./vendor.0d9fb7aa.js";const re=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))n(t);new MutationObserver(t=>{for(const a of t)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function o(t){const a={};return t.integrity&&(a.integrity=t.integrity),t.referrerpolicy&&(a.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?a.credentials="include":t.crossorigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(t){if(t.ep)return;t.ep=!0;const a=o(t);fetch(t.href,a)}};re();const b=$({id:"account",state:()=>({access:{expires:"",token:""},refresh:{expires:"",token:""},user:{id:"",email:"",name:"",role:""},loggedIn:!1}),getters:{},actions:{setTokens(r){this.access=r.access,this.refresh=r.refresh,this.saveTokensToLocalStorage()},setUser(r){this.user=r,this.saveUserToLocalStorage()},saveTokensToLocalStorage(){console.log("Saving Tokens..."),localStorage.setItem("ref",btoa(JSON.stringify(this.refresh)))},saveUserToLocalStorage(){console.log("Saving User..."),localStorage.setItem("usr",btoa(JSON.stringify(this.user)))},getFromLocalStorage(){const r=localStorage.getItem("ref");r&&(this.refresh=JSON.parse(atob(r)));const e=localStorage.getItem("usr");e&&(this.user=JSON.parse(atob(e)))},resetLocalStorage(){localStorage.removeItem("ref"),localStorage.removeItem("usr")}}});const ae=F("div",{class:"logo"},"Social Survey App",-1),ne=_("Surveys "),ie=_("List Surveys"),ce=_("Create a Survey"),le=_("Categories"),ue=_(" List Categories "),_e=_(" Create a Category "),de=_("Users "),pe=_("List Users"),fe=_(" Logout "),ge={name:"MainView"},he=Object.assign(ge,{setup(r){const e=b();function o(){e.resetLocalStorage(),location.reload()}return(n,t)=>{const a=O,s=B,l=N,u=D,d=J,L=K,E=j;return g(),y("div",null,[i(E,{class:"layout-container-main"},{default:c(()=>[i(L,{width:"256px"},{default:c(()=>[i(d,null,{default:c(()=>[i(u,{"default-openeds":["surveys","surveys-categories","users"],style:{"min-height":"100vh"},router:!0},{default:c(()=>[i(f(M),{to:"/"},{default:c(()=>[ae]),_:1}),i(l,{index:"surveys"},{title:c(()=>[i(a,null,{default:c(()=>[i(f(q))]),_:1}),ne]),default:c(()=>[i(s,{index:"list-surveys"},{default:c(()=>[ie]),_:1}),i(s,{index:"create-survey"},{default:c(()=>[ce]),_:1}),i(l,{index:"surveys-categories"},{title:c(()=>[le]),default:c(()=>[i(s,{index:"list-categories"},{default:c(()=>[ue]),_:1}),i(s,{index:"create-category"},{default:c(()=>[_e]),_:1})]),_:1})]),_:1}),i(l,{index:"users"},{title:c(()=>[i(a,null,{default:c(()=>[i(f(z))]),_:1}),de]),default:c(()=>[i(s,{index:"list-users"},{default:c(()=>[pe]),_:1})]),_:1}),i(s,{index:"logout",class:"bottom-item",onClick:o},{default:c(()=>[fe]),_:1})]),_:1})]),_:1})]),_:1}),i(E,null,{default:c(()=>[i(f(I))]),_:1})]),_:1})])}}});function me(){async function r(o,n){return(await h.post("https://socialsurveyapp.software/api/v1/auth/login",{email:o,password:n})).data}async function e(o){return(await h.post("https://socialsurveyapp.software/api/v1/auth/refresh-tokens",{refreshToken:o})).data}return{login:r,refreshTokens:e}}function ve(){async function r(n,t,a,s,l=1e3,u=1){return(await h.get("https://socialsurveyapp.software/api/v1/users",{params:w(m(m(m({},t&&{name:t}),a&&{role:a}),s&&{sortBy:s}),{limit:l,page:u}),headers:{Authorization:`Bearer ${n}`}})).data}async function e(n,t){return(await h.get(`https://socialsurveyapp.software/api/v1/users/${t}`,{headers:{Authorization:`Bearer ${n}`}})).data}async function o(n,t){return(await h.delete(`https://socialsurveyapp.software/api/v1/users/${t}`,{headers:{Authorization:`Bearer ${n}`}})).data}return{getAllUsers:r,getUser:e,deleteUser:o}}const ye={key:0,class:"page-loader"},Se={setup(r){const e=b(),{refreshTokens:o}=me(),{getUser:n}=ve(),t=H(!0),a=W(),s=G();return Q(()=>a.name,async l=>{l==="login"&&e.loggedIn&&s.push("/")}),X(async()=>{if(e.getFromLocalStorage(),e.refresh.token&&e.user.id){let l;try{l=await o(e.refresh.token)}catch(d){return console.error(d),v.alert("Please login again.","Session expired",{confirmButtonText:"OK"}),e.resetLocalStorage(),t.value=!1,s.push("login")}let u;try{u=await n(l.access.token,e.user.id)}catch(d){return console.error(d),v.alert("Please login again.","Unknwon error",{confirmButtonText:"OK"}),e.resetLocalStorage(),t.value=!1,s.push("login")}if(u&&u.role==="admin"){e.setTokens(l),e.setUser(u),t.value=!1,e.loggedIn=!0,a.name==="login"&&s.push("/");return}else return v.alert("User does not have required privileges!","Error",{confirmButtonText:"OK"}),e.resetLocalStorage(),t.value=!1,s.push("login")}else s.push("login"),t.value=!1}),(l,u)=>{const d=O;return g(),y("div",null,[t.value?(g(),y("div",ye,[i(d,{class:"is-loading"},{default:c(()=>[i(f(Y))]),_:1})])):Z("",!0),f(e).loggedIn?(g(),T(he,{key:2})):(g(),T(f(I),{key:1}))])}}},Le="modulepreload",A={},Ee="/admin/",p=function(e,o){return!o||o.length===0?e():Promise.all(o.map(n=>{if(n=`${Ee}${n}`,n in A)return;A[n]=!0;const t=n.endsWith(".css"),a=t?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${n}"]${a}`))return;const s=document.createElement("link");if(s.rel=t?"stylesheet":Le,t||(s.as="script",s.crossOrigin=""),s.href=n,document.head.appendChild(s),t)return new Promise((l,u)=>{s.addEventListener("load",l),s.addEventListener("error",()=>u(new Error(`Unable to preload CSS for ${n}`)))})})).then(()=>e())},ke=ee({history:te(),routes:[{path:"/",name:"home",component:()=>p(()=>import("./HomeView.ef7923df.js"),["assets/HomeView.ef7923df.js","assets/HomeView.8e6928ab.css","assets/el-card.58e797c5.css","assets/vendor.0d9fb7aa.js","assets/vendor.fb521127.css"])},{path:"/login",name:"login",component:()=>p(()=>import("./LoginView.d263cbb7.js"),["assets/LoginView.d263cbb7.js","assets/LoginView.76e75d53.css","assets/el-card.58e797c5.css","assets/el-form-item.1c8e9085.css","assets/vendor.0d9fb7aa.js","assets/vendor.fb521127.css"])},{path:"/list-surveys",name:"list-surveys",component:()=>p(()=>import("./ListSurveys.8abfac55.js"),["assets/ListSurveys.8abfac55.js","assets/el-dialog.af9102a5.css","assets/el-form-item.1c8e9085.css","assets/el-tag.795c0d40.css","assets/el-select.83eadf7f.css","assets/el-table-column.2d8a8829.css","assets/vendor.0d9fb7aa.js","assets/vendor.fb521127.css","assets/survey.d476d253.js"])},{path:"/create-survey",name:"create-survey",component:()=>p(()=>import("./CreateSurvey.454595cf.js"),["assets/CreateSurvey.454595cf.js","assets/CreateSurvey.9316cb9e.css","assets/el-card.58e797c5.css","assets/el-form-item.1c8e9085.css","assets/el-tag.795c0d40.css","assets/el-select.83eadf7f.css","assets/vendor.0d9fb7aa.js","assets/vendor.fb521127.css","assets/survey.d476d253.js"])},{path:"/list-categories",name:"list-categories",component:()=>p(()=>import("./ListCategories.c72f99c9.js"),["assets/ListCategories.c72f99c9.js","assets/el-dialog.af9102a5.css","assets/el-form-item.1c8e9085.css","assets/el-table-column.2d8a8829.css","assets/el-tag.795c0d40.css","assets/vendor.0d9fb7aa.js","assets/vendor.fb521127.css","assets/survey.d476d253.js"])},{path:"/create-category",name:"create-category",component:()=>p(()=>import("./CreateCategory.90b2a91a.js"),["assets/CreateCategory.90b2a91a.js","assets/el-form-item.1c8e9085.css","assets/vendor.0d9fb7aa.js","assets/vendor.fb521127.css","assets/survey.d476d253.js"])},{path:"/list-users",name:"list-users",component:()=>p(()=>import("./ListUsers.fbd80532.js"),["assets/ListUsers.fbd80532.js","assets/el-table-column.2d8a8829.css","assets/el-tag.795c0d40.css","assets/vendor.0d9fb7aa.js","assets/vendor.fb521127.css"])}]});const S=se(Se);S.use(oe());S.use(ke);S.mount("#app");export{me as a,ve as b,b as u};