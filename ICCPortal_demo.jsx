import { useState, useEffect, useRef } from "react";

const G="#C9A84C", GD="#0B2818", GL="#F5EDD6", GB="#F0EDE6";

const T = {
en:{
  nav_home:"Home", nav_about:"About Us", nav_services:"Services",
  nav_projects:"Projects", nav_vacancies:"Vacancies", nav_contact:"Contact",
  nav_tenders:"Tenders", nav_ai:"AI ✦",
  hero_h1a:"Index Consulting", hero_h1b:"Company",
  hero_sub:"ICC implements projects financed by ADB, World Bank, EBRD, KfW and OPEC Fund — energy, water, environment, PPP and ESG across Uzbekistan and Central Asia.",
  hero_btn1:"View Projects", hero_btn2:"AI Portal ✦", hero_btn3:"Contact",
  stat_years:"Years", stat_proj:"Active Projects", stat_ifis:"IFI Partners", stat_svc:"Service Areas",
  svc_h:"Our Services", svc_badge:"What We Do",
  proj_h:"Projects", proj_badge:"Track Record",
  status_active:"Active", status_done:"Completed",
  vac_h:"Open Positions", vac_badge:"Join Our Team", vac_cta:"View & Apply →",
  contact_h:"Contact Us", contact_badge:"Get In Touch",
  about_badge:"About Us",
  tenders_badge:"Consulting Competitions", tenders_h:"Global Tender Monitor",
  tenders_sub:"AI-powered search for RFPs and EOIs from ADB, World Bank, EBRD and other IFIs.",
  mission_label:"Our Mission",
  footer_copy:"Index Consulting Company (ICC) · Est. 2018 · Tashkent",
  svc_names:["Energy","Water Supply","GIS & Hydraulic","Environmental","Agriculture","Market Research","PPP","Corporate","Business Advisory","ESG"],
},
ru:{
  nav_home:"Главная", nav_about:"О нас", nav_services:"Услуги",
  nav_projects:"Проекты", nav_vacancies:"Вакансии", nav_contact:"Контакты",
  nav_tenders:"Тендеры", nav_ai:"ИИ ✦",
  hero_h1a:"Index Consulting", hero_h1b:"Company",
  hero_sub:"ICC реализует проекты при финансировании АБР, Всемирного банка, ЕБРР, KfW и Фонда ОПЕК — энергетика, водоснабжение, экология, ГЧП и ESG по всей Центральной Азии.",
  hero_btn1:"Смотреть проекты", hero_btn2:"ИИ Портал ✦", hero_btn3:"Связаться",
  stat_years:"Лет", stat_proj:"Активных проектов", stat_ifis:"Партнёров МФИ", stat_svc:"Направлений",
  svc_h:"Наши услуги", svc_badge:"Что мы делаем",
  proj_h:"Проекты", proj_badge:"Портфолио",
  status_active:"Активный", status_done:"Завершён",
  vac_h:"Открытые позиции", vac_badge:"Присоединяйтесь", vac_cta:"Смотреть и откликнуться →",
  contact_h:"Контакты", contact_badge:"Свяжитесь с нами",
  about_badge:"О нас",
  tenders_badge:"Консалтинговые конкурсы", tenders_h:"Монитор тендеров",
  tenders_sub:"ИИ-поиск тендеров, EOI и RFP от АБР, ВБ, ЕБРР и других МФИ с оценкой соответствия профилю ICC.",
  mission_label:"Наша миссия",
  footer_copy:"Index Consulting Company (ICC) · Осн. 2018 · Ташкент",
  svc_names:["Энергетика","Водоснабжение","ГИС и гидравлика","Экологический менеджмент","Сельское хозяйство","Маркетинг","ГЧП","Корпоративная","Бизнес-консалтинг","ESG"],
},
uz:{
  nav_home:"Bosh sahifa", nav_about:"Biz haqimizda", nav_services:"Xizmatlar",
  nav_projects:"Loyihalar", nav_vacancies:"Vakansiyalar", nav_contact:"Aloqa",
  nav_tenders:"Tenderlar", nav_ai:"AI ✦",
  hero_h1a:"Index Consulting", hero_h1b:"Company",
  hero_sub:"ICC ADB, Jahon banki, EBRD, KfW va OPEC Fund tomonidan moliyalashtiriladigan loyihalarni amalga oshiradi — energetika, suv, ekologiya, YXH va ESG yo'nalishlarida.",
  hero_btn1:"Loyihalarni ko'rish", hero_btn2:"AI Portal ✦", hero_btn3:"Bog'lanish",
  stat_years:"Yil", stat_proj:"Faol loyiha", stat_ifis:"XMT hamkorlari", stat_svc:"Yo'nalishlar",
  svc_h:"Xizmatlarimiz", svc_badge:"Biz nima qilamiz",
  proj_h:"Loyihalar", proj_badge:"Portfel",
  status_active:"Faol", status_done:"Tugallangan",
  vac_h:"Ochiq lavozimlar", vac_badge:"Jamoamizga qo'shiling", vac_cta:"Ko'rish va ariza berish →",
  contact_h:"Aloqa", contact_badge:"Biz bilan bog'laning",
  about_badge:"Biz haqimizda",
  tenders_badge:"Konsalting tanlovlari", tenders_h:"Tender Monitoru",
  tenders_sub:"ADB, Jahon banki, EBRD va boshqa XMTlardan RFP va EOI uchun AI-qidiruv.",
  mission_label:"Bizning missiyamiz",
  footer_copy:"Index Consulting Company (ICC) · 2018-yildan · Toshkent",
  svc_names:["Energetika","Suv ta'minoti","GIS va gidravlik","Ekologik menejment","Qishloq xo'jaligi","Bozor tadqiqoti","YXH","Korporativ","Biznes-konsalting","ESG"],
},
};

const L = {
  en:{flag:"🇬🇧",n:"English"},
  ru:{flag:"🇷🇺",n:"Русский"},
  uz:{flag:"🇺🇿",n:"O'zbek"},
};

const ICC = {
  phone:"+998 (55) 520 03 35", email:"info@inconsult.uz",
  telegram:"https://t.me/indexconsulting", site:"inconsult.uz",
  mission:`"Our primary destination is to be listed as the most trusted consultancy partner of the Client, solidified by the relentless support to the Client at all times."`,
  svcIcons:["⚡","💧","🗺️","🌿","🌾","📊","🤝","🔄","💼","🌍"],
  projects:[
    {funder:"EBRD",icon:"💧",status:"active",year:"2023–26",tag:"Water",title:"Water Supply & Sewerage — Namangan"},
    {funder:"World Bank",icon:"🔥",status:"active",year:"2023–26",tag:"Energy",title:"Energy Efficiency — Andijan, Samarkand, Bukhara"},
    {funder:"EBRD",icon:"⚡",status:"active",year:"2025–26",tag:"Energy",title:"Surkhandarya Gas Turbine 1,600 MW"},
    {funder:"ADB",icon:"🌊",status:"active",year:"2025–26",tag:"Water",title:"Climate-Resilient Water — Amu Darya Basin"},
    {funder:"PPP/IFC",icon:"🤝",status:"done",year:"2024–25",tag:"PPP",title:"Samarkand Electricity Distribution PPP"},
    {funder:"EBRD",icon:"🗺️",status:"done",year:"2023",tag:"GIS",title:"GIS & Hydraulic Modeling — Khorezm"},
  ],
  vacancies:[
    {title:"Mechanical Engineer — Construction Section",reqs:["B.S. Mechanical Engineering, 15+ yrs","Solar/wind farm expertise","English & Russian required"],views:0},
    {title:"Design Engineer — Construction Section",reqs:["Engineering degree, 15+ yrs","EPC contractor experience","Solar/wind preferred"],views:0},
    {title:"Chief Accountant / Financial Manager",reqs:["Bookkeeping per Uzbek law","Tax reporting & compliance","Financial analysis"],views:0},
    {title:"Junior International Commercial Law Attorney",reqs:["Law degree, commercial focus","English & Russian required","Uzbek mandatory"],views:0},
  ],
};

const FC={EBRD:"#003f87",ADB:"#e31837","World Bank":"#009688","PPP/IFC":"#006747",Own:G};
const css=`
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}body{overflow-x:hidden}
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@400;500;600;700&display=swap');
  @keyframes fu{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
  .hg:hover{opacity:1!important;color:${G}!important}
  .card{transition:all 0.3s}
  .card:hover{transform:translateY(-3px);box-shadow:0 16px 48px rgba(10,22,40,0.1)!important}
  .modal-overlay{position:fixed;inset:0;background:rgba(10,22,40,0.65);backdrop-filter:blur(6px);z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;animation:fu 0.2s ease}
  .modal-box{background:white;border-radius:18px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 40px 100px rgba(10,22,40,0.3)}
  .live-dot{width:7px;height:7px;background:#22c55e;border-radius:50%;display:inline-block;animation:pulse 2s infinite}
  ::selection{background:rgba(201,168,76,0.25);color:${GD}}
  @media(max-width:860px){.grid2{grid-template-columns:1fr!important}.grid3{grid-template-columns:1fr 1fr!important}}
`;

export default function App() {
  const [lang,setLang]=useState("en");
  const [langOpen,setLangOpen]=useState(false);
  const [view,setView]=useState("home");
  const [scrolled,setScrolled]=useState(false);
  const [vacViews,setVacViews]=useState({});
  const [vacModal,setVacModal]=useState(null);
  const [cvForm,setCvForm]=useState({name:"",email:"",phone:"",msg:""});
  const [cvStep,setCvStep]=useState("form");
  const [contactModal,setContactModal]=useState(false);

  const t = T[lang]||T.en;

  useEffect(()=>{
    const h=()=>setScrolled(window.scrollY>50);
    window.addEventListener("scroll",h);
    return()=>window.removeEventListener("scroll",h);
  },[]);

  useEffect(()=>{
    const h=e=>{if(!e.target.closest(".lw"))setLangOpen(false);};
    document.addEventListener("click",h);
    return()=>document.removeEventListener("click",h);
  },[]);

  useEffect(()=>{
    const h=e=>{if(e.key==="Escape"){setVacModal(null);setContactModal(false);}};
    document.addEventListener("keydown",h);
    return()=>document.removeEventListener("keydown",h);
  },[]);

  const go=(v)=>{setView(v);window.scrollTo(0,0);};
  const scroll=(id)=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"});

  const openVac=(v,i)=>{
    const k=`v${i}`;
    setVacViews(p=>({...p,[k]:(p[k]||0)+1}));
    setVacModal({...v,key:k});
    setCvStep("form");
    setCvForm({name:"",email:"",phone:"",msg:""});
  };

  return (
    <div style={{minHeight:"100vh",background:"#FAFAF8",fontFamily:"'DM Sans',sans-serif",color:GD}}>
      <style>{css}</style>

      {/* ══ NAV ══ */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 28px",height:68,background:scrolled?"rgba(250,250,248,0.97)":"rgba(250,250,248,0.85)",backdropFilter:"blur(16px)",borderBottom:`1px solid ${scrolled?"rgba(201,168,76,0.22)":"rgba(201,168,76,0.1)"}`,transition:"all 0.3s"}}>
        <div onClick={()=>go("home")} style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer"}}>
          <div style={{width:32,height:32,background:GD,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:10,color:G,letterSpacing:"-0.02em"}}>ICC</div>
          <div style={{lineHeight:1.1}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:GD}}>Index <span style={{color:G}}>Consulting</span></div>
            <div style={{fontSize:11,fontWeight:400,color:"#9CA3AF"}}>Company</div>
          </div>
        </div>

        <div style={{display:"flex",gap:16,alignItems:"center"}}>
          {["home","about","services","projects","vacancies","contact"].map((id,i)=>{
            const labels=[t.nav_home,t.nav_about,t.nav_services,t.nav_projects,t.nav_vacancies,t.nav_contact];
            const isPage=id==="home"||id==="about";
            return(
              <button key={id} className="hg" onClick={()=>isPage?go(id):scroll(id)}
                style={{fontSize:11,letterSpacing:"0.06em",textTransform:"uppercase",color:GD,opacity:0.55,cursor:"pointer",background:"none",border:"none",fontFamily:"'DM Sans',sans-serif",padding:0,transition:"all 0.2s"}}>
                {labels[i]}
              </button>
            );
          })}
          <button onClick={()=>go("tenders")} className="hg"
            style={{fontSize:11,letterSpacing:"0.06em",textTransform:"uppercase",color:GD,opacity:0.55,cursor:"pointer",background:"none",border:"none",fontFamily:"'DM Sans',sans-serif",padding:0,transition:"all 0.2s"}}>
            {t.nav_tenders}
          </button>
          <button onClick={()=>go("portal")}
            style={{fontSize:11,letterSpacing:"0.06em",textTransform:"uppercase",color:G,cursor:"pointer",background:"none",border:"none",fontFamily:"'DM Sans',sans-serif",fontWeight:700,padding:0}}>
            {t.nav_ai}
          </button>
        </div>

        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {/* Lang switcher */}
          <div className="lw" style={{position:"relative"}}>
            <button onClick={()=>setLangOpen(o=>!o)}
              style={{display:"flex",alignItems:"center",gap:5,padding:"6px 12px",border:`1px solid rgba(201,168,76,0.3)`,borderRadius:20,background:"none",color:GD,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>
              {L[lang].flag} {L[lang].n.split(" ")[0]} <span style={{fontSize:9,opacity:0.5}}>▾</span>
            </button>
            {langOpen&&<div style={{position:"absolute",top:"calc(100% + 8px)",right:0,background:"white",border:"1px solid rgba(201,168,76,0.2)",borderRadius:12,overflow:"hidden",minWidth:140,boxShadow:"0 20px 50px rgba(11,40,24,0.13)",zIndex:500}}>
              {Object.entries(L).map(([c,l])=>(
                <div key={c} onClick={()=>{setLang(c);setLangOpen(false);}}
                  style={{padding:"9px 14px",fontSize:13,display:"flex",alignItems:"center",gap:8,cursor:"pointer",background:lang===c?GL:"white",color:lang===c?G:GD,fontWeight:lang===c?"600":"400",transition:"background 0.15s"}}>
                  {l.flag} {l.n}
                </div>
              ))}
            </div>}
          </div>
          <a href={ICC.telegram} target="_blank"
            style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",background:GD,color:"white",borderRadius:22,fontSize:12,fontWeight:500,transition:"all 0.3s"}}>
            ✈️ Telegram
          </a>
        </div>
      </nav>

      {/* ══ HOME ══ */}
      {view==="home"&&<>
        {/* HERO */}
        <section style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",padding:"130px 40px 80px",position:"relative",overflow:"hidden",background:`linear-gradient(135deg,#FAFAF8 0%,${GB} 55%,${GL} 100%)`}}>
          <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)`,backgroundSize:"55px 55px"}}/>
          <div style={{position:"absolute",right:-80,top:"45%",transform:"translateY(-50%)",width:620,height:620,borderRadius:"50%",background:`radial-gradient(circle,rgba(201,168,76,0.12) 0%,rgba(11,40,24,0.06) 45%,transparent 70%)`}}/>
          <div style={{position:"relative",zIndex:1,maxWidth:680,animation:"fu 0.7s ease"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
              <div style={{width:26,height:1,background:G}}/>
              <span style={{fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:G,fontWeight:600}}>Est. 2018 · Tashkent, Uzbekistan · {L[lang].flag}</span>
            </div>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(36px,5vw,68px)",fontWeight:700,lineHeight:1.05,color:GD,marginBottom:4}}>{t.hero_h1a}</h1>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(36px,5vw,68px)",fontWeight:400,lineHeight:1.05,color:G,fontStyle:"italic",marginBottom:24}}>{t.hero_h1b}</h1>
            <p style={{fontSize:"clamp(14px,1.6vw,17px)",lineHeight:1.8,color:"rgba(11,40,24,0.6)",maxWidth:560,marginBottom:36}}>{t.hero_sub}</p>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <button onClick={()=>scroll("projects")} style={{padding:"14px 28px",background:GD,color:"white",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.3s"}} onMouseEnter={e=>{e.target.style.background=G;e.target.style.color=GD;}} onMouseLeave={e=>{e.target.style.background=GD;e.target.style.color="white;";}}>
                {t.hero_btn1}
              </button>
              <button onClick={()=>go("portal")} style={{padding:"14px 28px",background:"none",color:GD,border:`1.5px solid ${GD}`,borderRadius:8,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.3s"}} onMouseEnter={e=>{e.target.style.borderColor=G;e.target.style.color=G;}} onMouseLeave={e=>{e.target.style.borderColor=GD;e.target.style.color=GD;}}>
                {t.hero_btn2}
              </button>
              <button onClick={()=>setContactModal(true)} style={{padding:"14px 28px",background:"none",color:GD,border:`1.5px solid rgba(201,168,76,0.4)`,borderRadius:8,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.3s"}} onMouseEnter={e=>{e.target.style.borderColor=G;e.target.style.color=G;}} onMouseLeave={e=>{e.target.style.borderColor="rgba(201,168,76,0.4)";e.target.style.color=GD;}}>
                {t.hero_btn3}
              </button>
            </div>
            <div style={{display:"flex",gap:28,marginTop:52,flexWrap:"wrap"}}>
              {[["7+",t.stat_years],["10+",t.stat_proj],["11+",t.stat_ifis],["10",t.stat_svc]].map(([n,l],i)=>(
                <div key={i} style={{textAlign:"center",animation:`fu 0.5s ${0.2+i*0.1}s ease both`}}>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(28px,3.5vw,44px)",fontWeight:700,color:GD,lineHeight:1}}>{n}</div>
                  <div style={{fontSize:11,color:"rgba(11,40,24,0.45)",textTransform:"uppercase",letterSpacing:"0.07em",marginTop:4}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" style={{padding:"80px 40px",background:GB}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><div style={{width:26,height:1,background:G}}/><span style={{fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:G,fontWeight:600}}>{t.svc_badge}</span></div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(26px,3vw,40px)",fontWeight:700,color:GD,marginBottom:36,lineHeight:1.15}}>{t.svc_h}</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:2}}>
            {ICC.svcIcons.map((icon,i)=>(
              <div key={i} style={{background:"white",padding:"22px 16px",borderBottom:"3px solid transparent",boxShadow:"0 2px 8px rgba(11,40,24,0.04)",transition:"all 0.3s",cursor:"default"}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.borderBottomColor=G;e.currentTarget.style.boxShadow="0 14px 36px rgba(11,40,24,0.1)";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.borderBottomColor="transparent";e.currentTarget.style.boxShadow="0 2px 8px rgba(11,40,24,0.04)";}}>
                <div style={{fontSize:26,marginBottom:10,display:"inline-block",animation:`float ${3+i*0.2}s ease-in-out infinite`}}>{icon}</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:12,fontWeight:700,color:GD,lineHeight:1.35}}>{t.svc_names[i]}</div>
              </div>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" style={{padding:"80px 40px",background:"#FAFAF8"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><div style={{width:26,height:1,background:G}}/><span style={{fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:G,fontWeight:600}}>{t.proj_badge}</span></div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(26px,3vw,40px)",fontWeight:700,color:GD,marginBottom:36,lineHeight:1.15}}>{t.proj_h}</h2>
          <div className="grid2" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14}}>
            {ICC.projects.map((p,i)=>(
              <div key={i} className="card" style={{background:"white",border:"1px solid rgba(201,168,76,0.14)",borderRadius:13,padding:22,boxShadow:"0 2px 10px rgba(11,40,24,0.04)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <span style={{fontSize:24}}>{p.icon}</span>
                    <div>
                      <span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:6,background:`${FC[p.funder]||G}18`,color:FC[p.funder]||G}}>{p.funder}</span>
                      <span style={{marginLeft:6,fontSize:10,color:"#9CA3AF"}}>{p.year}</span>
                    </div>
                  </div>
                  <span style={{fontSize:10,padding:"3px 9px",borderRadius:10,background:p.status==="active"?"rgba(34,197,94,0.1)":"rgba(201,168,76,0.1)",color:p.status==="active"?"#16a34a":G,fontWeight:700}}>
                    {p.status==="active"?t.status_active:t.status_done}
                  </span>
                </div>
                <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:700,color:GD,lineHeight:1.35}}>{p.title}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* VACANCIES */}
        <section id="vacancies" style={{padding:"80px 40px",background:GB}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><div style={{width:26,height:1,background:G}}/><span style={{fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:G,fontWeight:600}}>{t.vac_badge}</span></div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(26px,3vw,40px)",fontWeight:700,color:GD,marginBottom:36,lineHeight:1.15}}>{t.vac_h}</h2>
          <div className="grid2" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14}}>
            {ICC.vacancies.map((v,i)=>(
              <div key={i} className="card" onClick={()=>openVac(v,i)} style={{background:"white",border:"1px solid rgba(201,168,76,0.14)",borderRadius:13,padding:24,boxShadow:"0 2px 10px rgba(11,40,24,0.04)",cursor:"pointer"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                  <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:GD,lineHeight:1.3,flex:1,marginRight:10}}>{v.title}</h3>
                  <div style={{flexShrink:0,padding:"4px 10px",background:"rgba(201,168,76,0.08)",border:"1px solid rgba(201,168,76,0.2)",borderRadius:10,fontSize:11,fontWeight:700,color:G,display:"flex",alignItems:"center",gap:5}}>
                    👁 {vacViews[`v${i}`]||0}
                  </div>
                </div>
                {v.reqs.slice(0,2).map((r,j)=><div key={j} style={{fontSize:12,color:"#6B7280",padding:"2px 0 2px 10px",borderLeft:`2px solid rgba(201,168,76,0.3)`,marginBottom:4}}>{r}</div>)}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12}}>
                  <span style={{padding:"4px 10px",background:GL,color:G,borderRadius:10,fontSize:11,fontWeight:600}}>ICC · Tashkent</span>
                  <span style={{fontSize:12,color:G,fontWeight:600}}>{t.vac_cta}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" style={{padding:"80px 40px",background:GD,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px)`,backgroundSize:"44px 44px"}}/>
          <div style={{position:"relative",zIndex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><div style={{width:26,height:1,background:G}}/><span style={{fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:G,fontWeight:600}}>{t.contact_badge}</span></div>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(26px,3vw,40px)",fontWeight:700,color:"white",marginBottom:32,lineHeight:1.15}}>{t.contact_h}</h2>
            <div className="grid2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:48}}>
              <div>
                {[["📍","Address","29 Shivli str., Yunusabad, Tashkent"],["📞","Phone",ICC.phone],["✉️","Email",ICC.email],["🌐","Website",ICC.site]].map(([icon,lbl,val],i)=>(
                  <div key={i} style={{display:"flex",gap:14,marginBottom:18}}>
                    <div style={{width:36,height:36,border:"1px solid rgba(201,168,76,0.25)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{icon}</div>
                    <div><div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.1em",color:"rgba(255,255,255,0.3)",marginBottom:3}}>{lbl}</div><div style={{fontSize:13,color:"white"}}>{val}</div></div>
                  </div>
                ))}
                <a href={ICC.telegram} target="_blank" style={{display:"inline-flex",alignItems:"center",gap:8,marginTop:10,padding:"11px 20px",background:"#2AABEE",color:"white",borderRadius:22,fontSize:13,fontWeight:500,textDecoration:"none"}}>
                  ✈️ @indexconsulting
                </a>
              </div>
              <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:13,padding:28}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:"white",marginBottom:20}}>{t.contact_h}</div>
                {[["Name","text",t.nav_home],["Email","email","email@..."]].map((_,i)=>(
                  <div key={i} style={{marginBottom:12}}>
                    <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",color:"rgba(255,255,255,0.3)",marginBottom:5}}>{["Name","Email"][i]}</div>
                    <input type={["text","email"][i]} style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"10px 13px",color:"white",fontSize:12,fontFamily:"'DM Sans',sans-serif",outline:"none"}}/>
                  </div>
                ))}
                <button onClick={()=>setContactModal(true)} style={{width:"100%",marginTop:8,padding:"12px",background:G,color:GD,border:"none",borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                  {t.contact_h} →
                </button>
              </div>
            </div>
          </div>
        </section>
      </>}

      {/* ══ ABOUT ══ */}
      {view==="about"&&<div style={{paddingTop:76,minHeight:"100vh",background:"#FAFAF8"}}>
        <div style={{padding:"60px 40px 50px",background:`linear-gradient(135deg,${GD} 0%,#132E1E 100%)`,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",right:-60,top:"50%",transform:"translateY(-50%)",width:460,height:460,borderRadius:"50%",background:"radial-gradient(circle,rgba(201,168,76,0.12) 0%,transparent 70%)"}}/>
          <div style={{position:"relative",zIndex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}><div style={{width:26,height:1,background:G}}/><span style={{fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:G,fontWeight:600}}>{t.about_badge}</span></div>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(32px,4.5vw,58px)",fontWeight:700,color:"white",lineHeight:1.1,marginBottom:14}}>
              Index Consulting<br/><em style={{color:G,fontWeight:400}}>Company (ICC)</em>
            </h1>
            <p style={{fontSize:14,lineHeight:1.8,color:"rgba(255,255,255,0.5)",maxWidth:540,marginBottom:26}}>{t.hero_sub}</p>
            <div style={{display:"flex",gap:9,flexWrap:"wrap"}}>
              {[{icon:"🌐",lbl:ICC.site,href:`https://${ICC.site}`},{icon:"✈️",lbl:"Telegram",href:ICC.telegram},{icon:"✉️",lbl:ICC.email,href:`mailto:${ICC.email}`}].map(({icon,lbl,href},i)=>(
                <a key={i} href={href} target="_blank" style={{display:"flex",alignItems:"center",gap:7,padding:"9px 15px",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:22,color:"white",fontSize:12,fontWeight:500,textDecoration:"none",transition:"all 0.25s"}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(201,168,76,0.2)";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.08)";}}>
                  <span>{icon}</span>{lbl}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div style={{padding:"60px 40px"}}>
          <div className="grid2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:56}}>
            <div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(22px,2.5vw,34px)",fontWeight:700,color:GD,marginBottom:18}}>Index Consulting Company</div>
              <p style={{fontSize:14,lineHeight:1.9,color:"#6B7280",marginBottom:14}}>ICC, established in 2018, works across energy, water supply, environmental management, PPP and ESG consulting for ADB, World Bank, EBRD and other IFI-financed projects in Central Asia.</p>
              <div style={{padding:"20px 24px",background:GD,borderRadius:14,marginTop:24}}>
                <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:"0.12em",color:G,marginBottom:10,fontWeight:600}}>{t.mission_label}</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:400,color:"white",lineHeight:1.65,fontStyle:"italic"}}>{ICC.mission}</div>
              </div>
            </div>
            <div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:24}}>
                {[["7+","Years Active"],["10+","Active Projects"],["11+","IFI Partners"],["10","Service Areas"]].map(([n,l],i)=>(
                  <div key={i} style={{padding:"18px",background:"white",border:"1px solid rgba(201,168,76,0.2)",borderRadius:12,textAlign:"center",transition:"all 0.3s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=G;e.currentTarget.style.transform="translateY(-3px)";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(201,168,76,0.2)";e.currentTarget.style.transform="translateY(0)";}}>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:32,fontWeight:700,color:GD}}>{n.replace("+","")}<span style={{color:G}}>{n.includes("+")?"+":""}</span></div>
                    <div style={{fontSize:10,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:"0.07em",marginTop:4}}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {["ADB","World Bank","EBRD","KfW","IsDB","OPEC Fund","Proparco","AFD","IFC"].map((p,i)=>(
                  <span key={i} style={{padding:"4px 10px",background:GB,border:"1px solid rgba(201,168,76,0.2)",borderRadius:8,fontSize:11,color:GD,fontWeight:600}}>{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>}

      {/* ══ TENDERS ══ */}
      {view==="tenders"&&<div style={{paddingTop:76,minHeight:"100vh",background:"#FAFAF8"}}>
        <div style={{padding:"52px 40px 44px",background:`linear-gradient(135deg,${GD} 0%,#0E2B1A 100%)`,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",right:-60,top:"50%",transform:"translateY(-50%)",width:460,height:460,borderRadius:"50%",background:"radial-gradient(circle,rgba(201,168,76,0.1) 0%,transparent 70%)"}}/>
          <div style={{position:"relative",zIndex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}><div style={{width:26,height:1,background:G}}/><span style={{fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:G,fontWeight:600}}>{t.tenders_badge}</span></div>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(28px,4vw,52px)",fontWeight:700,color:"white",lineHeight:1.1,marginBottom:10}}>{t.tenders_h}</h1>
            <p style={{fontSize:14,lineHeight:1.75,color:"rgba(255,255,255,0.45)",maxWidth:560,marginBottom:26}}>{t.tenders_sub}</p>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <button style={{display:"flex",alignItems:"center",gap:9,padding:"12px 26px",background:G,color:GD,border:"none",borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                ⚡ {t.nav_tenders}
              </button>
              {[{n:"ADB",href:"https://www.adb.org/projects/tenders",c:"#e31837"},{n:"World Bank",href:"https://projects.worldbank.org",c:"#009688"},{n:"EBRD",href:"https://www.ebrd.com/work-with-us/procurement/ppo.html",c:"#003f87"},{n:"UNGM",href:"https://www.ungm.org",c:"#1a7a4a"}].map(({n,href,c})=>(
                <a key={n} href={href} target="_blank" style={{display:"flex",alignItems:"center",gap:6,padding:"10px 15px",background:`${c}22`,border:`1px solid ${c}44`,borderRadius:8,color:"white",fontSize:12,fontWeight:600,textDecoration:"none",transition:"all 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.background=`${c}40`;}} onMouseLeave={e=>{e.currentTarget.style.background=`${c}22`;}}>
                  <span style={{width:6,height:6,borderRadius:"50%",background:c,flexShrink:0}}/>
                  {n} ↗
                </a>
              ))}
            </div>
          </div>
        </div>
        <div style={{padding:"52px 40px",textAlign:"center"}}>
          <div style={{fontSize:64,marginBottom:18,animation:"float 3s ease-in-out infinite"}}>📋</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,color:GD,marginBottom:10}}>{t.tenders_h}</div>
          <p style={{fontSize:14,color:"#9CA3AF",maxWidth:420,margin:"0 auto 28px",lineHeight:1.75}}>{t.tenders_sub}</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,maxWidth:720,margin:"0 auto",textAlign:"left"}}>
            {[{icon:"🌏",t:"ADB Procurement",href:"https://www.adb.org/projects/tenders",c:"#e31837"},{icon:"🏦",t:"World Bank",href:"https://projects.worldbank.org",c:"#009688"},{icon:"🇪🇺",t:"EBRD PPO",href:"https://www.ebrd.com/work-with-us/procurement/ppo.html",c:"#003f87"},{icon:"🌐",t:"UNGM",href:"https://www.ungm.org",c:"#1a7a4a"},{icon:"📰",t:"TED EU",href:"https://ted.europa.eu",c:"#003399"},{icon:"🤖",t:"AI Search",href:null,c:G}].map(({icon,t:tt,href,c},i)=>(
              href
                ?<a key={i} href={href} target="_blank" style={{padding:"16px",background:"white",border:`1px solid rgba(201,168,76,0.15)`,borderRadius:12,borderLeft:`4px solid ${c}`,display:"block",textDecoration:"none",transition:"all 0.25s"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";}}>
                    <div style={{fontSize:20,marginBottom:7}}>{icon}</div>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:700,color:GD}}>{tt} ↗</div>
                  </a>
                :<div key={i} style={{padding:"16px",background:GL,border:`1px solid rgba(201,168,76,0.3)`,borderRadius:12,borderLeft:`4px solid ${c}`,cursor:"pointer"}} onClick={()=>{}}>
                    <div style={{fontSize:20,marginBottom:7}}>{icon}</div>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:700,color:GD}}>{tt}</div>
                  </div>
            ))}
          </div>
        </div>
      </div>}

      {/* ══ PORTAL STUB ══ */}
      {view==="portal"&&<div style={{paddingTop:76,minHeight:"100vh",background:GD,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16,padding:"120px 40px"}}>
        <div style={{fontSize:64,animation:"float 3s ease-in-out infinite"}}>🤖</div>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(28px,4vw,48px)",color:"white",textAlign:"center"}}>AI Agent Portal</h1>
        <p style={{fontSize:14,color:"rgba(255,255,255,0.4)",maxWidth:440,textAlign:"center",lineHeight:1.75}}>Powered by Llama 3.3 70B via io.net — Company Analyzer, Investor Outreach, HR Recruiter, Tender Monitor.</p>
        <div style={{padding:"12px 20px",background:"rgba(201,168,76,0.15)",border:"1px solid rgba(201,168,76,0.3)",borderRadius:8,fontSize:13,color:G}}>⚠️ Requires io.net API key — available in full version</div>
        <button onClick={()=>go("home")} style={{marginTop:8,padding:"12px 24px",background:G,color:GD,border:"none",borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>← Back to Home</button>
      </div>}

      {/* ══ FOOTER ══ */}
      <footer style={{background:GD}}>
        <div style={{height:2,background:`linear-gradient(90deg,transparent,${G},transparent)`}}/>
        <div style={{padding:"24px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:"white"}}>
            Index <span style={{color:G}}>Consulting</span> Company
          </div>
          <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
            {[t.nav_home,t.nav_about,t.nav_tenders,t.nav_ai].map((l,i)=>(
              <button key={i} onClick={()=>go(["home","about","tenders","portal"][i])} style={{fontSize:11,color:"rgba(255,255,255,0.3)",background:"none",border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.06em",textTransform:"uppercase",padding:0}}>{l}</button>
            ))}
          </div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.18)"}}>{t.footer_copy}</div>
        </div>
      </footer>

      {/* ══ VACANCY MODAL ══ */}
      {vacModal&&<div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget){setVacModal(null);setCvStep("form");}}}>
        <div className="modal-box" style={{maxWidth:580}}>
          {cvStep==="success"?(
            <div style={{padding:44,textAlign:"center"}}>
              <div style={{fontSize:52,marginBottom:14}}>✅</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700,color:GD,marginBottom:8}}>Application Received!</div>
              <p style={{fontSize:13,color:"#6B7280",lineHeight:1.7,marginBottom:24}}>Thank you for applying to <strong>{vacModal.title}</strong>. ICC HR will contact you within 3–5 business days.</p>
              <button onClick={()=>{setVacModal(null);setCvStep("form");}} style={{padding:"12px 28px",background:GD,color:"white",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Close</button>
            </div>
          ):(
            <div style={{padding:28}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
                <div>
                  <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.1em",color:G,fontWeight:700,marginBottom:5}}>Open Position · ICC Tashkent</div>
                  <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:700,color:GD,lineHeight:1.3}}>{vacModal.title}</h2>
                  <div style={{display:"flex",gap:8,marginTop:8}}>
                    <span style={{padding:"3px 9px",background:GL,color:G,borderRadius:8,fontSize:11,fontWeight:600}}>📍 Tashkent</span>
                    <span style={{padding:"3px 9px",background:"rgba(34,197,94,0.08)",color:"#16a34a",border:"1px solid rgba(34,197,94,0.2)",borderRadius:8,fontSize:11,fontWeight:600}}>● Hiring Now</span>
                    <span style={{padding:"3px 9px",background:"rgba(10,22,40,0.06)",color:"#6B7280",borderRadius:8,fontSize:11}}>👁 {vacViews[vacModal.key]||0} views</span>
                  </div>
                </div>
                <button onClick={()=>{setVacModal(null);setCvStep("form");}} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:"#9CA3AF",flexShrink:0}}>✕</button>
              </div>
              <div style={{background:"#FAFAF8",borderRadius:10,padding:16,marginBottom:18}}>
                <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:"0.08em",color:G,fontWeight:700,marginBottom:10}}>Requirements</div>
                {vacModal.reqs.map((r,j)=><div key={j} style={{fontSize:12,color:"#374151",padding:"4px 0 4px 10px",borderLeft:"2px solid rgba(201,168,76,0.35)",marginBottom:5,lineHeight:1.55}}>{r}</div>)}
              </div>
              <div style={{borderTop:"1px solid rgba(201,168,76,0.15)",margin:"0 0 18px",paddingTop:18}}>
                <div style={{fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:G,fontWeight:600,marginBottom:14}}>Apply Now</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  {[["Full Name *","name","text"],["Email *","email","email"],["Phone","phone","tel"]].map(([lbl,key,type],i)=>(
                    <div key={i} style={{gridColumn:i===0?"1/-1":"auto"}}>
                      <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.07em",color:"#9CA3AF",marginBottom:5}}>{lbl}</div>
                      <input type={type} value={cvForm[key]} onChange={e=>setCvForm(f=>({...f,[key]:e.target.value}))}
                        style={{width:"100%",border:"1px solid rgba(201,168,76,0.25)",borderRadius:8,padding:"10px 13px",fontSize:12,fontFamily:"'DM Sans',sans-serif",color:GD,outline:"none"}}
                        onFocus={e=>e.target.style.borderColor=G} onBlur={e=>e.target.style.borderColor="rgba(201,168,76,0.25)"}/>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:10}}>
                  <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.07em",color:"#9CA3AF",marginBottom:5}}>Cover Letter</div>
                  <textarea rows={3} value={cvForm.msg} onChange={e=>setCvForm(f=>({...f,msg:e.target.value}))}
                    style={{width:"100%",border:"1px solid rgba(201,168,76,0.25)",borderRadius:8,padding:"10px 13px",fontSize:12,fontFamily:"'DM Sans',sans-serif",color:GD,resize:"vertical",outline:"none"}}
                    onFocus={e=>e.target.style.borderColor=G} onBlur={e=>e.target.style.borderColor="rgba(201,168,76,0.25)"}/>
                </div>
              </div>
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>{if(cvForm.name&&cvForm.email)setCvStep("success");}}
                  disabled={!cvForm.name||!cvForm.email}
                  style={{flex:1,padding:"13px 0",background:cvForm.name&&cvForm.email?GD:"#e5e7eb",color:cvForm.name&&cvForm.email?"white":"#9CA3AF",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:cvForm.name&&cvForm.email?"pointer":"default",fontFamily:"'DM Sans',sans-serif"}}>
                  Submit Application →
                </button>
                <a href={`mailto:${ICC.email}?subject=Application: ${vacModal.title}`} style={{padding:"13px 16px",background:"none",border:`1px solid rgba(201,168,76,0.3)`,borderRadius:8,fontSize:12,color:G,fontWeight:600,display:"flex",alignItems:"center",gap:5,fontFamily:"'DM Sans',sans-serif"}}>✉️ Email</a>
              </div>
            </div>
          )}
        </div>
      </div>}

      {/* ══ CONTACT MODAL ══ */}
      {contactModal&&<div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setContactModal(false);}}>
        <div className="modal-box" style={{maxWidth:500}}>
          <div style={{padding:32}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:GD}}>{t.contact_h}</div>
              <button onClick={()=>setContactModal(false)} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:"#9CA3AF"}}>✕</button>
            </div>
            {[["Name","text"],["Email","email"],["Message","textarea"]].map(([lbl,type],i)=>(
              <div key={i} style={{marginBottom:14}}>
                <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",color:"#9CA3AF",marginBottom:6}}>{lbl}</div>
                {type==="textarea"
                  ?<textarea rows={4} style={{width:"100%",border:"1px solid rgba(201,168,76,0.25)",borderRadius:8,padding:"10px 13px",fontSize:12,fontFamily:"'DM Sans',sans-serif",color:GD,resize:"vertical",outline:"none"}}/>
                  :<input type={type} style={{width:"100%",border:"1px solid rgba(201,168,76,0.25)",borderRadius:8,padding:"10px 13px",fontSize:12,fontFamily:"'DM Sans',sans-serif",color:GD,outline:"none"}}/>}
              </div>
            ))}
            <div style={{display:"flex",gap:10,marginTop:8}}>
              <button style={{flex:1,padding:"13px 0",background:GD,color:"white",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}} onClick={()=>setContactModal(false)}>
                {t.contact_h} →
              </button>
              <button onClick={()=>setContactModal(false)} style={{padding:"13px 18px",background:"none",border:"1px solid rgba(201,168,76,0.25)",borderRadius:8,fontSize:13,color:"#6B7280",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>}
    </div>
  );
}
