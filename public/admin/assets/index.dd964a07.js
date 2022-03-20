var k=Object.defineProperty;var m=Object.getOwnPropertySymbols;var w=Object.prototype.hasOwnProperty,x=Object.prototype.propertyIsEnumerable;var S=(t,e,o)=>e in t?k(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o,u=(t,e)=>{for(var o in e||(e={}))w.call(e,o)&&S(t,o,e[o]);if(m)for(var o of m(e))x.call(e,o)&&S(t,o,e[o]);return t};import{d as $,R as T,m as v,E as h,r as d,o as p,c as g,a as f,w as O,b as E,e as N,f as b,g as U,h as B,i as P,j as V,k as A,s as I,l as R,p as C,n as H}from"./vendor.f331aec2.js";const J=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function o(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerpolicy&&(s.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?s.credentials="include":r.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(r){if(r.ep)return;r.ep=!0;const s=o(r);fetch(r.href,s)}};J();const y=$({id:"account",state:()=>({access:{expires:"",token:""},refresh:{expires:"",token:""},user:{id:"",email:"",name:"",role:""}}),getters:{},actions:{setTokens(t){this.access=t.access,this.refresh=t.refresh,this.saveTokensToLocalStorage()},setUser(t){this.user=t,this.saveUserToLocalStorage()},saveTokensToLocalStorage(){console.log("Saving Tokens..."),localStorage.setItem("ref",btoa(JSON.stringify(this.refresh)))},saveUserToLocalStorage(){console.log("Saving User..."),localStorage.setItem("usr",btoa(JSON.stringify(this.user)))},getFromLocalStorage(){const t=localStorage.getItem("ref");t&&(this.refresh=JSON.parse(atob(t)));const e=localStorage.getItem("usr");e&&(this.user=JSON.parse(atob(e)))},resetLocalStorage(){localStorage.removeItem("ref"),localStorage.removeItem("usr")}}});var K={methods:{async refreshTokens(t){return(await this.axios.post("https://socialsurveyapp.software/api/v1/auth/refresh-tokens",{refreshToken:t})).data},async getUser(t,e){return console.log({headers:{Authorization:`Bearer ${t}`}}),(await this.axios.get(`https://socialsurveyapp.software/api/v1/users/${e}`,{headers:{Authorization:`Bearer ${t}`}})).data}}};var L=(t,e)=>{const o=t.__vccOpts||t;for(const[a,r]of e)o[a]=r;return o};const q={components:{RouterView:T},mixins:[K],computed:u({},v(y)),data(){return{showLoader:!0}},async mounted(){if(this.accountStore.getFromLocalStorage(),this.accountStore.refresh.token&&this.accountStore.user.id){let t;try{t=await this.refreshTokens(this.accountStore.refresh.token)}catch(o){return console.error(o),h.alert("Please login again.","Session expired",{confirmButtonText:"OK"}),this.accountStore.resetLocalStorage(),this.showLoader=!1,this.$router.push("login")}let e;try{e=await this.getUser(t.access.token,this.accountStore.user.id)}catch(o){return console.error(o),h.alert("Please login again.","Unknwon error",{confirmButtonText:"OK"}),this.accountStore.resetLocalStorage(),this.showLoader=!1,this.$router.push("login")}if(e&&e.role==="admin")this.accountStore.setTokens(t),this.accountStore.setUser(e),this.showLoader=!1;else return h.alert("User does not have required privileges!","Error",{confirmButtonText:"OK"}),this.accountStore.resetLocalStorage(),this.showLoader=!1,this.$router.push("login")}else this.$router.push("login"),this.showLoader=!1}},F={key:0,class:"page-loader"};function z(t,e,o,a,r,s){const n=d("loading"),c=d("el-icon"),l=d("RouterView");return p(),g("div",null,[r.showLoader?(p(),g("div",F,[f(c,{class:"is-loading"},{default:O(()=>[f(n)]),_:1})])):E("",!0),f(l)])}var D=L(q,[["render",z]]);const M="modulepreload",_={},W="/admin/",j=function(e,o){return!o||o.length===0?e():Promise.all(o.map(a=>{if(a=`${W}${a}`,a in _)return;_[a]=!0;const r=a.endsWith(".css"),s=r?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${a}"]${s}`))return;const n=document.createElement("link");if(n.rel=r?"stylesheet":M,r||(n.as="script",n.crossOrigin=""),n.href=a,document.head.appendChild(n),r)return new Promise((c,l)=>{n.addEventListener("load",c),n.addEventListener("error",()=>l(new Error(`Unable to preload CSS for ${a}`)))})})).then(()=>e())},G={computed:u({},v(y)),methods:{logout(){this.accountStore.resetLocalStorage(),location.reload()}}},Q=b("Home page ");function X(t,e,o,a,r,s){return p(),g("main",null,[Q,N("a",{href:"#",onClick:e[0]||(e[0]=(...n)=>s.logout&&s.logout(...n))},"Logout")])}var Y=L(G,[["render",X]]);const Z=U({history:B(),routes:[{path:"/",name:"home",component:Y},{path:"/login",name:"login",component:()=>j(()=>import("./LoginView.f6703e68.js"),["assets/LoginView.f6703e68.js","assets/LoginView.76e75d53.css","assets/vendor.f331aec2.js"])}]});const i=P(D);i.use(V());i.use(Z);i.use(A);i.component("search",I).component("loading",R);i.use(C,H);i.mount("#app");export{L as _,y as u};