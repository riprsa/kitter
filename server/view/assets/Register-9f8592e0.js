import{N as c,c as d,_ as p,r as m,o as u,a as b,b as _,d as e,w as h,e as a,v as n,F as v}from"./index-35b603f5.js";const f={data(){return{cat:{}}},components:{Navigation:c},methods:{submitForm(){d.Register(this.cat).then(l=>{console.log(l)}).catch(l=>{console.log(l)})}}},x={class:"hero bg-base-200",style:{"min-height":"70vh"}},g={class:"hero-content flex-col lg:flex-row-reverse"},w=e("div",{class:"text-center lg:text-left"},[e("h1",{class:"text-5xl font-bold"},"Register..."),e("p",{class:"py-6"},"...if you love your cat!")],-1),y={class:"card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100"},N={class:"card-body"},F={class:"form-control"},V=e("label",{class:"label"},[e("span",{class:"label-text"},"Name")],-1),U={class:"form-control"},k=e("label",{class:"label"},[e("span",{class:"label-text"},"Username")],-1),q={class:"form-control"},B=e("label",{class:"label"},[e("span",{class:"label-text"},"Password")],-1),R=e("div",{class:"form-control mt-6"},[e("button",{class:"btn btn-primary",type:"submit"},"Login")],-1);function M(l,s,C,D,o,r){const i=m("Navigation");return u(),b(v,null,[_(i),e("div",x,[e("div",g,[w,e("div",y,[e("div",N,[e("form",{onSubmit:s[3]||(s[3]=h((...t)=>r.submitForm&&r.submitForm(...t),["prevent"]))},[e("div",F,[V,a(e("input",{type:"text",placeholder:"username",class:"input input-bordered","onUpdate:modelValue":s[0]||(s[0]=t=>o.cat.name=t),required:""},null,512),[[n,o.cat.name]])]),e("div",U,[k,a(e("input",{type:"text",placeholder:"username",class:"input input-bordered","onUpdate:modelValue":s[1]||(s[1]=t=>o.cat.username=t),required:""},null,512),[[n,o.cat.username]])]),e("div",q,[B,a(e("input",{type:"password",placeholder:"password",class:"input input-bordered","onUpdate:modelValue":s[2]||(s[2]=t=>o.cat.password=t),required:""},null,512),[[n,o.cat.password]])]),R],32)])])])])],64)}const L=p(f,[["render",M]]);export{L as default};