import{r as i,u as V,b as n,c as k,e as E,f as e,w as o,j as p,E as d}from"./vendor.4b90bdc4.js";import{u as B,a as S}from"./index.2fd87507.js";const T={class:"common-layout"},U=p("Social Survey App"),A=p("Login"),N={setup(C){const _=B(),{login:f}=S(),s=i(""),r=i(""),v=V();async function w(){let a;try{a=await f(s.value,r.value)}catch(t){let l="Unknown error...";t.response.data&&t.response.data.message&&(l=t.response.data.message),d.alert(l,"Error",{confirmButtonText:"OK"});return}a&&a.user&&a.user.role==="admin"?(_.setTokens(a.tokens),_.setUser(a.user),v.push("/")):d.alert("User does not have required privileges!","Error",{confirmButtonText:"OK"})}return(a,t)=>{const l=n("el-header"),m=n("el-input"),u=n("el-form-item"),x=n("el-button"),g=n("el-form"),y=n("el-card"),b=n("el-main"),h=n("el-container");return k(),E("div",T,[e(h,null,{default:o(()=>[e(l,null,{default:o(()=>[U]),_:1}),e(b,{class:"login-main"},{default:o(()=>[e(y,{class:"box-card"},{default:o(()=>[e(g,{class:"demo-form-inline","label-width":"80px"},{default:o(()=>[e(u,{label:"E-mail"},{default:o(()=>[e(m,{modelValue:s.value,"onUpdate:modelValue":t[0]||(t[0]=c=>s.value=c)},null,8,["modelValue"])]),_:1}),e(u,{label:"Password"},{default:o(()=>[e(m,{modelValue:r.value,"onUpdate:modelValue":t[1]||(t[1]=c=>r.value=c),type:"password","show-password":""},null,8,["modelValue"])]),_:1}),e(u,{style:{"margin-bottom":"0"}},{default:o(()=>[e(x,{type:"primary",onClick:w},{default:o(()=>[A]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})])}}};export{N as default};
