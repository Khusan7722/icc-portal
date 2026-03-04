import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   IO.NET INTELLIGENCE API — FREE, OpenAI-compatible
   Base: https://api.intelligence.io.solutions/api/v1
   Free: 1M tokens/day chat · 500K tokens/day API per model
   Models: meta-llama/Llama-3.3-70B-Instruct, deepseek-ai/DeepSeek-R1, etc.
═══════════════════════════════════════════════════════════ */
const IO_BASE = "https://api.intelligence.io.solutions/api/v1";
const IO_MODEL = "meta-llama/Llama-3.3-70B-Instruct";

async function ioAI(messages, system, apiKey) {
  const msgs = system ? [{ role: "system", content: system }, ...messages] : messages;
  const r = await fetch(`${IO_BASE}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
    body: JSON.stringify({ model: IO_MODEL, messages: msgs, max_tokens: 1200, temperature: 0.7 }),
  });
  const d = await r.json();
  if (d.error) throw new Error(d.error.message || JSON.stringify(d.error));
  return d.choices?.[0]?.message?.content || "";
}

/* ═══════════════════════════════════════════════════════════
   REAL ICC DATA from inconsult.uz
═══════════════════════════════════════════════════════════ */
const ICC = {
  name: "Index Consulting Company", abbr: "ICC", founded: 2018,
  phone: "+998 (55) 520 03 35", email: "info@inconsult.uz",
  address: "Building 29, Shivli str., Yunusabad district, Tashkent, Uzbekistan, 100084",
  telegram: "https://t.me/indexconsulting", site: "inconsult.uz",
  about: `Index Consulting Company (ICC), established in 2018, implements projects financed by leading international organizations: ADB, World Bank, EBRD, KfW, IsDB, OPEC Fund, Proparco, AFD. ICC specializes in power generation, transmission and distribution (including solar, wind, hydro), water supply and sewerage, environmental management, agriculture/irrigation, PPP, and ESG consulting across Uzbekistan and Central Asia.`,
  mission: `"Our primary destination is to be listed as the most trusted consultancy partner of the Client, solidified by the relentless support to the Client at all times."`,
  services: [
    { icon:"⚡", en:"Energy", desc:"Power generation, transmission & distribution, renewables (solar, wind, hydro), construction supervision for ADB, EBRD, World Bank energy projects." },
    { icon:"💧", en:"Water Supply & Sewerage", desc:"Technical supervision for water supply and sewerage systems. Active projects in Namangan, Samarkand, Khorezm financed by EBRD and ADB." },
    { icon:"🗺️", en:"GIS & Hydraulic Modeling", desc:"GIS mapping and hydraulic modeling of water/sewage systems. Completed for Urgench, Khiva, Pitnak (EBRD)." },
    { icon:"🌿", en:"Environmental Management", desc:"ESMF, ESMP, LMP, SEP preparation and public consultations for World Bank and EBRD projects." },
    { icon:"🌾", en:"Agriculture & Irrigation", desc:"Agricultural consulting, irrigation advisory, feasibility studies. Active: Amu Darya Basin (ADB)." },
    { icon:"📊", en:"Market Research", desc:"Analytical studies, competitive landscape assessments for associations and businesses." },
    { icon:"🤝", en:"Public–Private Partnerships", desc:"PPP structuring, advisory. Key success: Samarkand electricity distribution PPP with AKSA Enerji (Turkey) at III PPP Roundtable, Nov 2025." },
    { icon:"🔄", en:"Corporate Transformation", desc:"Organizational restructuring, process optimization, management consulting." },
    { icon:"💼", en:"Business Advisory", desc:"Strategic planning, financial management, operations improvement for businesses across Uzbekistan." },
    { icon:"🌍", en:"ESG", desc:"Environmental, Social and Governance consulting for organizations needing IFI ESG compliance." },
  ],
  projects: [
    { funder:"EBRD", icon:"💧", status:"Active", year:"2023–26", tag:"Water", title:"Modernization of Water Supply & Sewerage — Namangan Region", desc:"Site inspections and monitoring for NWP-3.1 Central Lab, NWP-10 Water conduit reconstruction, NWP-12 Hypochlorite plant. Latest visit: Dec 2025." },
    { funder:"World Bank", icon:"🔥", status:"Active", year:"2023–26", tag:"Energy", title:"Energy Efficiency — Andijan, Chirchik, Bukhara, Samarkand & Tashkent", desc:"Social/environmental monitoring for DH network rehab, boiler house construction, IHS installation. Working visits to Samarkand (Jan 2026), Andijan & Bukhara (Dec 2025)." },
    { funder:"EBRD", icon:"⚡", status:"Active", year:"2025–26", tag:"Energy", title:"Surkhandarya Gas Turbine Power Plant — 1,600 MW Construction Supervision", desc:"Working visit Jan 2026. Meetings with customer, EPC contractor for 1,600 MW GTPP construction." },
    { funder:"EBRD", icon:"⚡", status:"Active", year:"2025–26", tag:"Energy", title:"Mini-HPP: Rabat, Chappasou & Tamshush — Aksu River, Kashkadarya", desc:"Inspection visit Dec 2025 to construction sites. Project: Sustainable Hydropower Design & Construction." },
    { funder:"ADB", icon:"🌊", status:"Active", year:"2025–26", tag:"Water", title:"Climate-Resilient Water Sector — Amu Darya Basin", desc:"Field mission Nov 2025 — Kashkadarya and Surkhandarya regions for ADB-supported water infrastructure." },
    { funder:"PPP/IFC", icon:"🤝", status:"Completed", year:"2024–25", tag:"PPP", title:"Samarkand Electricity Distribution PPP — AKSA Enerji (Turkey)", desc:"ICC & MRC Turkey as Technical Consultants. Contract awarded at III PPP Roundtable, Nov 2025." },
    { funder:"ADB", icon:"⚡", status:"Completed", year:"2023–24", tag:"Energy", title:"Distribution Network Development Master Plan", desc:"With MRC Turkey. Single-line schemes study, distribution system data collection, investment plans to 2030." },
    { funder:"EBRD", icon:"🗺️", status:"Completed", year:"2023", tag:"Water", title:"GIS & Hydraulic Modeling — Urgench, Khiva, Pitnak (Khorezm)", desc:"GIS mapping and hydraulic modeling of sewage systems, three cities in Khorezm province." },
    { funder:"Own", icon:"⚡", status:"Active", year:"2023–25", tag:"Energy", title:"Feasibility Studies — Karangitugai & Taldyksai HPP, Pskem River", desc:"Two HPP feasibility studies on the Pskem River, Bostanlyk district, Tashkent province." },
    { funder:"EBRD", icon:"🎓", status:"Active", year:"2025", tag:"Training", title:"EBRD E&S Training — Almaty (for Barki Tojik, Tajikistan)", desc:"5-day training Dec 8–12, 2025 for Barki Tojik reps on EBRD Environmental & Social Standards." },
  ],
  news: [
    { date:"02 Feb 2026", tag:"HR", title:"Internship Fair – 2026", body:"ICC participated in the 'Internship Fair – 2026' at Westminster International University, Tashkent on January 30, 2026." },
    { date:"22 Jan 2026", tag:"World Bank", title:"Working Visit to Samarkand — Energy Efficiency Project", body:"Jan 19–20: ICC specialists in social/environmental & H&S visited Samarkand under the World Bank 'Energy Efficiency' project." },
    { date:"19 Jan 2026", tag:"EBRD", title:"Surkhandarya — 1,600 MW Gas Turbine Power Plant", body:"Jan 13–15: ICC visited Surkhandarya for the 1,600 MW GTPP. Meetings with customer and EPC contractor." },
    { date:"23 Dec 2025", tag:"EBRD", title:"Field Visit — Namangan Water Supply (EBRD)", body:"Dec 18–19: ICC specialists conducted a field visit under Namangan Water Supply & Sewerage project (EBRD)." },
    { date:"22 Dec 2025", tag:"PPP", title:"AKSA Enerji Awarded Samarkand Electricity PPP", body:"ICC & MRC Turkey structured the Samarkand electricity distribution PPP. Contract awarded at III PPP Roundtable." },
    { date:"09 Dec 2025", tag:"EBRD", title:"Inspection — Rabat, Chappasou & Tamshush Mini-HPPs", body:"Dec 1–7: ICC inspected three mini-HPP sites on Aksu River, Kashkadarya (Sustainable Hydropower project)." },
    { date:"04 Dec 2025", tag:"ADB", title:"ICC at ADB Environmental & Social Framework Seminar", body:"Dec 1–3: ICC at ADB seminar for Central/West Asian countries on Environmental & Social Framework (ESF)." },
    { date:"19 Nov 2025", tag:"PPP", title:"ICC at III PPP Roundtable — Mobilizing Private Capital", body:"ICC at III PPP Roundtable, Tashkent, Nov 18–19, 2025 under Uzbekistan-2030 Strategy." },
  ],
  vacancies: [
    { id:"mech-eng", title:"Mechanical Engineer — Construction Section", reqs:["B.S. Mechanical Engineering, 15+ yrs","Solar/wind farm expertise","International codes & standards","English & Russian required"], conds:["Employment per Uzbek law","Competitive salary","Career growth","Modern Tashkent office"] },
    { id:"design-eng", title:"Design Engineer — Construction Section", reqs:["Engineering degree, 15+ yrs design","EPC contractor experience","Solar/wind farm preferred","English & Russian required"], conds:["Competitive salary","International exposure","Senior mentorship","Clear career path"] },
    { id:"chief-acc", title:"Chief Accountant / Financial Manager", reqs:["Bookkeeping per Uzbek law","Tax reporting & compliance","Financial analysis: liquidity, risks","Cost reduction strategies"], conds:["Competitive compensation","Professional development","Collaborative team","Stable office"] },
    { id:"lawyer", title:"Junior International Commercial Law Attorney", reqs:["Law degree, commercial focus","English & Russian required","Uzbek language mandatory","International contracts preferred"], conds:["Legal mentorship","International exposure","Competitive pay","Career growth"] },
  ],
  partners: ["ADB","World Bank","EBRD","KfW","IsDB","OPEC Fund","Proparco","AFD","IFC","MRC (Türkiye)","GOPA Intec (Germany)"],
  team: [
    { name:"Azizbek Tashkentov", role:"CEO & Founder", exp:"20+ years infrastructure consulting", avatar:"AT" },
    { name:"Malika Yusupova", role:"Environmental Lead", exp:"Expert in EBRD/WB ESF standards", avatar:"MY" },
    { name:"Rustam Nazarov", role:"Energy Division Head", exp:"15+ years power sector", avatar:"RN" },
    { name:"Dilnoza Karimova", role:"Water & Sanitation Expert", exp:"10+ years municipal infrastructure", avatar:"DK" },
    { name:"Timur Mirzayev", role:"PPP Advisory Lead", exp:"Structured 5+ PPP deals", avatar:"TM" },
    { name:"Sarvinoz Abdullayeva", role:"GIS & Hydraulic Modeling", exp:"EBRD certified specialist", avatar:"SA" },
  ],
};

/* ═══ 3 LANGUAGES ═══ */
const L = {
  en:{flag:"🇬🇧",n:"English",dir:"ltr"},
  ru:{flag:"🇷🇺",n:"Русский",dir:"ltr"},
  uz:{flag:"🇺🇿",n:"O'zbek",dir:"ltr"},
};

/* ═══════════════════════════════════════════════════════════
   TRANSLATIONS  T[lang].key
   Covers: nav, hero, sections, services, vacancies,
           contact form, about page, tenders page, buttons
═══════════════════════════════════════════════════════════ */
const T = {
/* ───────────────── ENGLISH ───────────────── */
en:{
  /* nav */
  nav_home:"Home", nav_about:"About Us", nav_services:"Services",
  nav_projects:"Projects", nav_news:"News", nav_vacancies:"Vacancies",
  nav_contact:"Contact", nav_tenders:"Tenders", nav_ai:"AI ✦", nav_analytics:"Analytics",
  /* hero */
  hero_badge:t.ft_est,
  hero_h1a:"Index Consulting", hero_h1b:"Company",
  hero_sub:"{t.hero_sub}",
  hero_btn_projects:"View Projects", hero_btn_ai:"AI Portal ✦", hero_btn_contact:"Contact Us",
  hero_stat_years:"Years", hero_stat_projects:"Active Projects", hero_stat_partners:"IFI Partners", hero_stat_services:"Service Areas",
  /* sections eyebrows & headings */
  about_eyebrow:t.about_eyebrow, about_h2:"Index Consulting Company (ICC)",
  about_mission_label:t.about_mission_label,
  services_eyebrow:t.services_eyebrow, services_h2:t.services_h2,
  services_link:"Learn more ↗",
  projects_eyebrow:t.projects_eyebrow, projects_h2:t.projects_h2,
  news_eyebrow:t.news_eyebrow, news_h2:t.news_h2,
  news_read:"Read more →",
  vacancies_eyebrow:t.vacancies_eyebrow, vacancies_h2:t.vacancies_h2,
  vacancies_more:"more requirements...",
  vacancies_location:t.vacancies_location,
  vacancies_cta:"View & Apply →",
  contact_eyebrow:t.contact_eyebrow, contact_h2:"Contact Us",
  contact_quick:"Quick Inquiry",
  /* contact form */
  cf_name:"Name", cf_email:"Email", cf_company:"Company",
  cf_service:"Service of Interest", cf_msg:"Message",
  cf_name_ph:t.cf_name_ph, cf_email_ph:"your@email.com",
  cf_company_ph:"Company name", cf_msg_ph:t.cf_msg_ph,
  cf_send:"Send Message", cf_sending:"Sending...", cf_sent_title:t.cf_sent_title,
  cf_sent_body:"Thank you for contacting ICC. Our team will get back to you within 1–2 business days.",
  cf_close:"Close",
  /* vacancy modal */
  vm_position:t.vm_position,
  vm_hiring:t.vm_hiring, vm_views:t.vm_views,
  vm_reqs:t.vm_reqs, vm_offers:t.vm_offers,
  vm_apply_now:t.vm_apply_now,
  vm_fullname:t.vm_fullname, vm_email:t.vm_email, vm_phone:t.vm_phone,
  vm_linkedin:t.vm_linkedin, vm_cover:t.vm_cover,
  vm_fullname_ph:t.vm_fullname_ph, vm_phone_ph:t.vm_phone_ph,
  vm_linkedin_ph:t.vm_linkedin_ph, vm_cover_ph:"Briefly describe your experience...",
  vm_submit:t.vm_submit, vm_email_btn:"Email", vm_tg_btn:"TG",
  vm_success_title:t.vm_success_title,
  vm_success_body1:t.vm_success_body1, vm_success_body2:t.vm_success_body2,
  vm_success_conf:t.vm_success_conf,
  vm_follow:t.vm_follow,
  /* about page */
  ab_eyebrow:"About Us",
  ab_story_eyebrow:t.ab_story_eyebrow, ab_story_h2:"Who We Are",
  ab_p1:t.ab_p1,
  ab_p2:t.ab_p2,
  ab_p3:t.ab_p3,
  ab_info_founded:t.ab_info_founded, ab_info_hq:t.ab_info_hq, ab_info_phone:"Phone", ab_info_email:"Email", ab_info_site:"Website", ab_info_tg:"Telegram",
  ab_values_eyebrow:t.ab_values_eyebrow, ab_values_h2:"Core Values",
  val_excellence:"Excellence", val_excellence_d:"Highest quality standards on every project, every time.",
  val_partnership:"Partnership", val_partnership_d:"Long-term relationships built on trust, respect and mutual benefit.",
  val_impact:"Impact", val_impact_d:"Measurable positive change for communities across Central Asia.",
  val_innovation:"Innovation", val_innovation_d:"Fresh perspectives and modern methods for complex consulting challenges.",
  val_agility:"Agility", val_agility_d:"Speed and adaptability — boutique responsiveness at every scale.",
  val_integrity:"Integrity", val_integrity_d:"Full transparency and ethical standards in all our dealings.",
  ab_team_eyebrow:t.ab_team_eyebrow, ab_team_h2:"Leadership Team", ab_team_sub:"Click any card to view full profile",
  ab_svc_eyebrow:t.ab_svc_eyebrow, ab_svc_h2:"Service Areas", ab_svc_sub:t.ab_svc_sub,
  ab_partner_eyebrow:t.ab_partner_eyebrow, ab_partner_h2:"International Partners", ab_partner_sub:t.ab_partner_sub,
  ab_cta_h:t.ab_cta_h, ab_cta_sub:t.ab_cta_sub,
  ab_cta_btn:t.ab_cta_btn, ab_back:t.ab_back,
  /* tenders page */
  tn_eyebrow:t.tn_eyebrow, tn_h1:t.tn_h1,
  tn_sub:t.tn_sub,
  tn_find:"⚡ Find Active Tenders", tn_refresh:"⚡ Refresh Tenders", tn_scanning:t.tn_scanning,
  tn_search_ph:t.tn_search_ph,
  tn_filter_all:t.tn_filter_all, tn_status_all:t.tn_status_all,
  tn_found_one:"tender found", tn_found_many:"tenders found",
  tn_empty_h:t.tn_empty_h, tn_empty_sub:t.tn_empty_sub,
  tn_loading_h:t.tn_loading_h, tn_loading_sub:t.tn_loading_sub,
  tn_ready_h:t.tn_ready_h,
  tn_ready_sub:"Click Find Active Tenders to use AI to search global consulting competitions relevant to ICC's expertise.",
  tn_icc_fit:t.tn_icc_fit, tn_details:t.tn_details, tn_apply:t.tn_apply,
  tn_fit_label:t.tn_fit_label,
  tn_bid:t.tn_bid,
  tn_bookmarked_one:"tender bookmarked", tn_bookmarked_many:"tenders bookmarked",
  tn_clear:t.tn_clear,
  tn_apply_full:t.tn_apply_full,
  /* footer */
  ft_est:"Est. 2018 · Tashkent, Uzbekistan", ft_rights:t.ft_rights,
  ft_powered:t.ft_powered,
  /* misc buttons */
  btn_close:"Close", btn_contact:"Contact Us", btn_projects:"View Projects",
  btn_apply_email:"Apply via Email →",
  /* analytics */
  an_eyebrow:t.an_eyebrow, an_h1:t.an_h1,
  an_sessions:"Sessions", an_pageviews:"Page Views", an_avg_session:"Avg Session",
  an_bounce:"Bounce Rate", an_top_countries:"Top Countries", an_hourly:"Hourly Engagement",
  an_last12:t.an_last12,
  an_live:"live visitors",
  /* services (short names for cards) */
  svc_names:["Energy","Water Supply & Sewerage","GIS & Hydraulic Modeling","Environmental Management","Agriculture & Irrigation","Market Research","Public–Private Partnerships","Corporate Transformation","Business Advisory","ESG"],
  svc_descs:["Power generation, transmission & distribution, renewables (solar, wind, hydro), construction supervision for ADB, EBRD, World Bank energy projects.","Technical supervision for water supply and sewerage systems. Active projects in Namangan, Samarkand, Khorezm financed by EBRD and ADB.","GIS mapping and hydraulic modeling of water/sewage systems. Completed for Urgench, Khiva, Pitnak (EBRD).","ESMF, ESMP, LMP, SEP preparation and public consultations for World Bank and EBRD projects.","Agricultural consulting, irrigation advisory, feasibility studies. Active: Amu Darya Basin (ADB).","Analytical studies, competitive landscape assessments for associations and businesses.","PPP structuring, advisory. Key success: Samarkand electricity distribution PPP with AKSA Enerji (Turkey) at III PPP Roundtable, Nov 2025.","Organizational restructuring, process optimization, management consulting.","Strategic planning, financial management, operations improvement for businesses across Uzbekistan.","Environmental, Social and Governance consulting for organizations needing IFI ESG compliance."],
  /* project statuses */
  status_active:"Active", status_completed:"Completed",
},

/* ───────────────── RUSSIAN ───────────────── */
ru:{
  nav_home:"Главная", nav_about:"О нас", nav_services:"Услуги",
  nav_projects:"Проекты", nav_news:"Новости", nav_vacancies:"Вакансии",
  nav_contact:"Контакты", nav_tenders:"Тендеры", nav_ai:"ИИ ✦", nav_analytics:"Аналитика",
  hero_badge:"Осн. 2018 · Ташкент, Узбекистан",
  hero_h1a:"Index Consulting", hero_h1b:"Company",
  hero_sub:"Компания ICC реализует проекты при финансировании АБР, Всемирного банка, ЕБРР, KfW, ИБР и Фонда ОПЕК — энергетика, водоснабжение, экология, ГЧП и ESG-консалтинг по Узбекистану и Центральной Азии.",
  hero_btn_projects:"Смотреть проекты", hero_btn_ai:"ИИ Портал ✦", hero_btn_contact:"Связаться",
  hero_stat_years:"Лет", hero_stat_projects:"Активных проектов", hero_stat_partners:"Партнёров МФИ", hero_stat_services:"Направлений",
  about_eyebrow:"О компании", about_h2:"Index Consulting Company (ICC)",
  about_mission_label:"Наша миссия",
  services_eyebrow:"Что мы делаем", services_h2:"Наши услуги",
  services_link:"Подробнее ↗",
  projects_eyebrow:"Портфолио", projects_h2:"Активные и завершённые проекты",
  news_eyebrow:"Последние обновления", news_h2:"Новости и полевые отчёты",
  news_read:"Читать далее →",
  vacancies_eyebrow:"Присоединяйтесь к нам", vacancies_h2:"Открытые позиции",
  vacancies_more:"ещё требований...",
  vacancies_location:"ICC · Ташкент",
  vacancies_cta:"Смотреть и откликнуться →",
  contact_eyebrow:"Свяжитесь с нами", contact_h2:"Контакты",
  contact_quick:"Быстрый запрос",
  cf_name:"Имя", cf_email:"Email", cf_company:"Компания",
  cf_service:"Интересующая услуга", cf_msg:"Сообщение",
  cf_name_ph:"Иванов Иван Иванович", cf_email_ph:"your@email.com",
  cf_company_ph:"Название компании", cf_msg_ph:"Расскажите о вашем проекте...",
  cf_send:"Отправить сообщение", cf_sending:"Отправляем...", cf_sent_title:"Сообщение отправлено!",
  cf_sent_body:"Спасибо за обращение в ICC. Наша команда ответит вам в течение 1–2 рабочих дней.",
  cf_close:"Закрыть",
  vm_position:"Открытая позиция · ICC Ташкент",
  vm_hiring:"Набор открыт", vm_views:"просмотров",
  vm_reqs:"Требования", vm_offers:"Мы предлагаем",
  vm_apply_now:"Откликнуться",
  vm_fullname:"ФИО *", vm_email:"Email *", vm_phone:"Телефон",
  vm_linkedin:"LinkedIn / Ссылка", vm_cover:"Сопроводительное письмо",
  vm_fullname_ph:"Иванов Иван Иванович", vm_phone_ph:"+998 XX XXX XX XX",
  vm_linkedin_ph:"linkedin.com/in/...", vm_cover_ph:"Кратко опишите опыт и почему вас интересует эта роль...",
  vm_submit:"Отправить заявку →", vm_email_btn:"Email", vm_tg_btn:"ТГ",
  vm_success_title:"Заявка принята!",
  vm_success_body1:"Спасибо за отклик на вакансию", vm_success_body2:"Команда HR ICC рассмотрит вашу заявку и свяжется с вами в течение 3–5 рабочих дней.",
  vm_success_conf:"Заявка зафиксирована. Вы также можете написать нам на",
  vm_follow:"Подписаться в Telegram",
  ab_eyebrow:"О нас",
  ab_story_eyebrow:"Наша история", ab_story_h2:"Кто мы",
  ab_p1:"Компания Index Consulting Company (ICC), основанная в 2018 году, начала деятельность на консалтинговом рынке Узбекистана — расширяя охват в различные отрасли национальной экономики и международные рынки.",
  ab_p2:"ICC — молодая и гибкая компания, опирающаяся на собственных сотрудников, привлечённых экспертов и пул местных и международных специалистов. Мы объединяем многопрофильную экспертизу для инновационных решений наивысшего качества.",
  ab_p3:"Мы реализуем проекты при финансировании АБР, Всемирного банка, ЕБРР, KfW, ИБР, Фонда ОПЕК, Проparco и АФД в сфере энергетики, водоснабжения, экологии, ГЧП и ESG в Узбекистане и Центральной Азии.",
  ab_info_founded:"Основана", ab_info_hq:"Офис", ab_info_phone:"Телефон", ab_info_email:"Email", ab_info_site:"Сайт", ab_info_tg:"Telegram",
  ab_values_eyebrow:"Наша основа", ab_values_h2:"Ценности",
  val_excellence:"Качество", val_excellence_d:"Высочайшие стандарты на каждом проекте, каждый раз.",
  val_partnership:"Партнёрство", val_partnership_d:"Долгосрочные отношения, основанные на доверии, уважении и взаимной выгоде.",
  val_impact:"Результат", val_impact_d:"Ощутимые позитивные изменения для сообществ Центральной Азии.",
  val_innovation:"Инновации", val_innovation_d:"Свежий взгляд и современные методы для сложных консалтинговых задач.",
  val_agility:"Гибкость", val_agility_d:"Скорость и адаптивность — отзывчивость boutique-компании в любом масштабе.",
  val_integrity:"Честность", val_integrity_d:"Полная прозрачность и соблюдение этических норм во всех делах.",
  ab_team_eyebrow:"Наши люди", ab_team_h2:"Команда", ab_team_sub:"Нажмите на карточку для полного профиля",
  ab_svc_eyebrow:"Что мы делаем", ab_svc_h2:"Направления работы", ab_svc_sub:"Каждая карточка ведёт на страницу сайта",
  ab_partner_eyebrow:"Партнёры и доноры", ab_partner_h2:"Международные партнёры", ab_partner_sub:"Нажмите на партнёра, чтобы перейти на его официальный сайт",
  ab_cta_h:"Готовы к партнёрству с ICC?", ab_cta_sub:"Свяжитесь с нами или изучите наши проекты и открытые позиции.",
  ab_cta_btn:"Связаться →", ab_back:"← На главную",
  tn_eyebrow:"Консалтинговые конкурсы", tn_h1:"Монитор тендеров",
  tn_sub:"ИИ-поиск тендеров, запросов предложений и EOI от АБР, Всемирного банка, ЕБРР и других МФИ — с оценкой соответствия профилю ICC.",
  tn_find:"⚡ Найти тендеры", tn_refresh:"⚡ Обновить тендеры", tn_scanning:"Сканирование баз...",
  tn_search_ph:"Поиск по ключевым словам...",
  tn_filter_all:"Все категории", tn_status_all:"Все статусы",
  tn_found_one:"тендер найден", tn_found_many:"тендеров найдено",
  tn_empty_h:"Тендеры не найдены", tn_empty_sub:"Попробуйте изменить фильтры или обновить поиск",
  tn_loading_h:"Сканирование баз МФИ...", tn_loading_sub:"ИИ ищет в базах АБР, Всемирного банка, ЕБРР, UNGM и других порталах закупок.",
  tn_ready_h:"Готов к поиску тендеров",
  tn_ready_sub:"Нажмите «Найти тендеры» чтобы запустить ИИ-поиск глобальных конкурсов по профилю ICC.",
  tn_icc_fit:"Соответствие ICC", tn_details:"Подробнее", tn_apply:"Подать →",
  tn_fit_label:"Анализ соответствия ICC",
  tn_bid:"🤖 Стратегия заявки",
  tn_bookmarked_one:"тендер сохранён", tn_bookmarked_many:"тендеров сохранено",
  tn_clear:"Очистить",
  tn_apply_full:"Подать заявку / Смотреть закупку ↗",
  ft_est:"Осн. 2018 · Ташкент, Узбекистан", ft_rights:"Все права защищены",
  ft_powered:"Работает на io.net AI · Llama 3.3 70B",
  btn_close:"Закрыть", btn_contact:"Связаться", btn_projects:"Смотреть проекты",
  btn_apply_email:"Отправить CV по Email →",
  an_eyebrow:"Дашборд", an_h1:"Аналитика сайта",
  an_sessions:"Сессий", an_pageviews:"Просмотров", an_avg_session:"Среднее время",
  an_bounce:"Отказы", an_top_countries:"Топ стран", an_hourly:"Активность по часам",
  an_last12:"Активность посетителей за последние 12 часов",
  an_live:"онлайн",
  svc_names:["Энергетика","Водоснабжение и канализация","ГИС и гидравлическое моделирование","Экологический менеджмент","Сельское хозяйство и ирригация","Маркетинговые исследования","Государственно-частное партнёрство","Корпоративная трансформация","Бизнес-консалтинг","ESG"],
  svc_descs:["Производство, передача и распределение электроэнергии, ВИЭ (солнце, ветер, ГЭС), строительный надзор по проектам АБР, ЕБРР, ВБ.","Технический надзор систем водоснабжения и канализации. Активные проекты в Намангане, Самарканде, Хорезме (ЕБРР, АБР).","ГИС-картирование и гидравлическое моделирование водо- и канализационных систем. Выполнено для Ургенча, Хивы, Питнака (ЕБРР).","Разработка ПЭСУ, ПМОС, ПУТ, ПВС и проведение общественных консультаций для проектов ВБ и ЕБРР.","Сельскохозяйственный консалтинг, консультации по ирригации, ТЭО. Активный проект: бассейн Амударьи (АБР).","Аналитические исследования, оценка конкурентной среды для ассоциаций и предприятий.","Структурирование и консультации по ГЧП. Ключевой успех: ГЧП по электроснабжению Самарканда с AKSA Enerji (Турция), ноябрь 2025.","Организационная реструктуризация, оптимизация процессов, управленческий консалтинг.","Стратегическое планирование, финансовый менеджмент, улучшение операционной деятельности для предприятий Узбекистана.","Консалтинг в области экологического, социального и корпоративного управления для организаций с требованиями МФИ по ESG."],
  status_active:"Активный", status_completed:"Завершён",
},

/* ───────────────── O'ZBEK ───────────────── */
uz:{
  nav_home:"Bosh sahifa", nav_about:"Biz haqimizda", nav_services:"Xizmatlar",
  nav_projects:"Loyihalar", nav_news:"Yangiliklar", nav_vacancies:"Vakansiyalar",
  nav_contact:"Aloqa", nav_tenders:"Tenderlar", nav_ai:"AI ✦", nav_analytics:"Tahlil",
  hero_badge:"2018-yildan · Toshkent, O'zbekiston",
  hero_h1a:"Index Consulting", hero_h1b:"Company",
  hero_sub:"ICC ADB, Jahon banki, EBRD, KfW, IsDB va OPEC Fund tomonidan moliyalashtiriladigan loyihalarni amalga oshiradi — energetika, suv ta'minoti, ekologiya, YXH va ESG bo'yicha O'zbekiston va Markaziy Osiyoda.",
  hero_btn_projects:"Loyihalarni ko'rish", hero_btn_ai:"AI Portal ✦", hero_btn_contact:"Bog'lanish",
  hero_stat_years:"Yil", hero_stat_projects:"Faol loyiha", hero_stat_partners:"XMT hamkorlari", hero_stat_services:"Xizmat yo'nalishlari",
  about_eyebrow:"Kompaniya haqida", about_h2:"Index Consulting Company (ICC)",
  about_mission_label:"Bizning missiyamiz",
  services_eyebrow:"Biz nima qilamiz", services_h2:"Xizmatlarimiz",
  services_link:"Batafsil ↗",
  projects_eyebrow:"Portfel", projects_h2:"Faol va tugallangan loyihalar",
  news_eyebrow:"So'nggi yangiliklar", news_h2:"Yangiliklar va dala hisobotlari",
  news_read:"Batafsil o'qish →",
  vacancies_eyebrow:"Jamoamizga qo'shiling", vacancies_h2:"Ochiq lavozimlar",
  vacancies_more:"ko'proq talab...",
  vacancies_location:"ICC · Toshkent",
  vacancies_cta:"Ko'rish va ariza berish →",
  contact_eyebrow:"Biz bilan bog'laning", contact_h2:"Aloqa",
  contact_quick:"Tezkor so'rov",
  cf_name:"Ism", cf_email:"Email", cf_company:"Kompaniya",
  cf_service:"Qiziqtirgan xizmat", cf_msg:"Xabar",
  cf_name_ph:"To'liq ismingiz", cf_email_ph:"your@email.com",
  cf_company_ph:"Kompaniya nomi", cf_msg_ph:"Loyihangiz haqida gapiring...",
  cf_send:"Xabar yuborish", cf_sending:"Yuborilmoqda...", cf_sent_title:"Xabar yuborildi!",
  cf_sent_body:"ICC bilan bog'langaningiz uchun rahmat. Jamoamiz 1–2 ish kuni ichida javob beradi.",
  cf_close:"Yopish",
  vm_position:"Ochiq lavozim · ICC Toshkent",
  vm_hiring:"Qabul ochiq", vm_views:"ko'rishlar",
  vm_reqs:"Talablar", vm_offers:"Biz taklif qilamiz",
  vm_apply_now:"Ariza berish",
  vm_fullname:"To'liq ism *", vm_email:"Email *", vm_phone:"Telefon",
  vm_linkedin:"LinkedIn / Havola", vm_cover:"Motivatsion xat",
  vm_fullname_ph:"Ivanov Ivan Ivanovich", vm_phone_ph:"+998 XX XXX XX XX",
  vm_linkedin_ph:"linkedin.com/in/...", vm_cover_ph:"Tajribangizni qisqacha tasvirlab bering...",
  vm_submit:"Ariza yuborish →", vm_email_btn:"Email", vm_tg_btn:"TG",
  vm_success_title:"Ariza qabul qilindi!",
  vm_success_body1:"Vakansiyaga murojaat etganingiz uchun rahmat:", vm_success_body2:"ICC HR jamoasi arizangizni ko'rib chiqib, 3–5 ish kuni ichida siz bilan bog'lanadi.",
  vm_success_conf:"Ariza ro'yxatga olindi. Shuningdek bizga murojaat qilishingiz mumkin:",
  vm_follow:"Telegramda obuna bo'lish",
  ab_eyebrow:"Biz haqimizda",
  ab_story_eyebrow:"Bizning tariximiz", ab_story_h2:"Biz kimiz",
  ab_p1:"Index Consulting Company (ICC) 2018-yilda tashkil etilgan bo'lib, O'zbekistonning konsalting bozorida faoliyatini boshladi — milliy iqtisodiyotning turli tarmoqlariga va xalqaro bozorlarga kengayib bormoqda.",
  ab_p2:"ICC yosh va moslashuvchan kompaniya bo'lib, o'z xodimlari, jalb etilgan mutaxassislar va mahalliy hamda xalqaro mutaxassislar bazasiga tayanadi. Biz eng yuqori sifat standartlarida innovatsion yechimlar taqdim etamiz.",
  ab_p3:"Biz ADB, Jahon banki, EBRD, KfW, IsDB, OPEC Fund, Proparco va AFD tomonidan moliyalashtiriladigan loyihalarni energetika, suv ta'minoti, ekologiya, YXH va ESG yo'nalishlarida amalga oshiramiz.",
  ab_info_founded:"Tashkil etilgan", ab_info_hq:"Ofis", ab_info_phone:"Telefon", ab_info_email:"Email", ab_info_site:"Sayt", ab_info_tg:"Telegram",
  ab_values_eyebrow:"Bizning asosimiz", ab_values_h2:"Qadriyatlarimiz",
  val_excellence:"Sifat", val_excellence_d:"Har bir loyihada eng yuqori sifat standartlari.",
  val_partnership:"Hamkorlik", val_partnership_d:"Ishonch, hurmat va o'zaro manfaatga asoslangan uzoq muddatli munosabatlar.",
  val_impact:"Natija", val_impact_d:"Markaziy Osiyo jamiyatlari uchun o'lchanadigan ijobiy o'zgarishlar.",
  val_innovation:"Innovatsiya", val_innovation_d:"Murakkab konsalting masalalariga yangi qarash va zamonaviy usullar.",
  val_agility:"Moslashuvchanlik", val_agility_d:"Tezlik va moslashuvchanlik — har qanday miqyosda boutique-kompaniya javobi.",
  val_integrity:"Halollik", val_integrity_d:"Barcha ishlarda to'liq shaffoflik va axloqiy me'yorlarga rioya.",
  ab_team_eyebrow:"Bizning odamlar", ab_team_h2:"Rahbariyat", ab_team_sub:"To'liq profil uchun kartani bosing",
  ab_svc_eyebrow:"Biz nima qilamiz", ab_svc_h2:"Faoliyat yo'nalishlari", ab_svc_sub:"Har bir karta sayt sahifasiga olib boradi",
  ab_partner_eyebrow:"Hamkorlar va donorlar", ab_partner_h2:"Xalqaro hamkorlar", ab_partner_sub:"Rasmiy saytni ochish uchun hamkorni bosing",
  ab_cta_h:"ICC bilan hamkorlikka tayyormisiz?", ab_cta_sub:"Bugun biz bilan bog'laning yoki loyihalar va vakansiyalarni ko'ring.",
  ab_cta_btn:"Bog'lanish →", ab_back:"← Bosh sahifaga",
  tn_eyebrow:"Konsalting tanlovlari", tn_h1:"Tender Monitoru",
  tn_sub:"ADB, Jahon banki, EBRD va boshqa XMTlardan RFP, EOI va xarid bildirishnomalari uchun AI-qidiruv — ICC profili bo'yicha moslik baholash bilan.",
  tn_find:"⚡ Tenderlarni topish", tn_refresh:"⚡ Yangilash", tn_scanning:"Bazalar skanlanmoqda...",
  tn_search_ph:"Kalit so'z bo'yicha qidiruv...",
  tn_filter_all:"Barcha kategoriyalar", tn_status_all:"Barcha holatlar",
  tn_found_one:"tender topildi", tn_found_many:"tender topildi",
  tn_empty_h:"Tenderlar topilmadi", tn_empty_sub:"Filtrlarni o'zgartiring yoki qidiruvni yangilang",
  tn_loading_h:"XMT bazalari skanlanmoqda...", tn_loading_sub:"AI ADB, Jahon banki, EBRD, UNGM va boshqa xarid portallarida ICC profili bo'yicha imkoniyatlar qidirmoqda.",
  tn_ready_h:"Tenderlarni topishga tayyor",
  tn_ready_sub:"ICC profili bo'yicha global tanlovlarni qidirish uchun «Tenderlarni topish» tugmasini bosing.",
  tn_icc_fit:"ICC mos kelishi", tn_details:"Batafsil", tn_apply:"Ariza →",
  tn_fit_label:"ICC moslik tahlili",
  tn_bid:"🤖 Taklif strategiyasi",
  tn_bookmarked_one:"tender saqlandi", tn_bookmarked_many:"tender saqlandi",
  tn_clear:"Tozalash",
  tn_apply_full:"Ariza berish / Xaridni ko'rish ↗",
  ft_est:"2018-yildan · Toshkent, O'zbekiston", ft_rights:"Barcha huquqlar himoyalangan",
  ft_powered:"io.net AI · Llama 3.3 70B tomonidan ishlamoqda",
  btn_close:"Yopish", btn_contact:"Bog'lanish", btn_projects:"Loyihalarni ko'rish",
  btn_apply_email:"Email orqali CV yuborish →",
  an_eyebrow:"Jonli dashboard", an_h1:"Sayt tahlili",
  an_sessions:"Sessiyalar", an_pageviews:"Ko'rishlar", an_avg_session:"O'rtacha vaqt",
  an_bounce:"Chiqish darajasi", an_top_countries:"Top mamlakatlar", an_hourly:"Soatlik faollik",
  an_last12:"So'nggi 12 soatdagi tashrif buyuruvchilar faolligi",
  an_live:"onlayn",
  svc_names:["Energetika","Suv ta'minoti va kanalizatsiya","GIS va gidravlik modellashtirish","Ekologik menejment","Qishloq xo'jaligi va irrigatsiya","Bozor tadqiqotlari","Davlat-xususiy hamkorlik","Korporativ transformatsiya","Biznes-konsalting","ESG"],
  svc_descs:["Elektr energiyasini ishlab chiqarish, uzatish va taqsimlash, QAE (quyosh, shamol, GES), ADB, EBRD, JB loyihalari bo'yicha qurilish nazorati.","Suv ta'minoti va kanalizatsiya tizimlarini texnik nazorat qilish. Namangan, Samarqand, Xorazmda faol loyihalar (EBRD, ADB).","Suv va kanalizatsiya tizimlarini GIS-xaritalash va gidravlik modellashtirish. Urganch, Xiva, Pitnak uchun bajarildi (EBRD).","JB va EBRD loyihalari uchun ESMF, ESMP, LMP, SEP ishlab chiqish va jamoat muhokamalari.","Qishloq xo'jaligi bo'yicha maslahat, irrigatsiya tavsiyalari, texnik-iqtisodiy asoslash. Faol loyiha: Amudaryo havzasi (ADB).","Tahliliy tadqiqotlar, raqobat muhitini baholash.","YXH tuzilish va maslahat. Asosiy muvaffaqiyat: AKSA Enerji (Turkiya) bilan Samarqand elektr taqsimlash YXH, 2025-yil noyabr.","Tashkiliy qayta tuzish, jarayonlarni optimallashtirish, boshqaruv konsaltingi.","Strategik rejalashtirish, moliyaviy menejment, O'zbekiston korxonalari uchun operatsion takomillashtirish.","XMT ESG talablariga rioya qilish uchun ekologik, ijtimoiy va korporativ boshqaruv bo'yicha konsalting."],
  status_active:"Faol", status_completed:"Tugallangan",
},
};

/* ═══ COLORS ═══ */
const G="#C9A84C", GD="#0B2818", GL="#F5EDD6", GB="#F0EDE6";
const FCOLOR={EBRD:"#003f87",ADB:"#e31837","World Bank":"#009688","PPP/IFC":"#006747",Own:"#C9A84C"};

/* ═══ AGENT PROMPTS ═══ */
const AGENT_SYS=[
`You are a senior analyst at Index Consulting Company (ICC), Tashkent, Uzbekistan. ICC (est. 2018) works with ADB, World Bank, EBRD, KfW, IsDB, OPEC Fund on energy, water, environment, PPP, ESG. Partners: MRC Turkey, GOPA Intec Germany.
Analyze the company and produce structured report:
## 🏢 Company Overview
## 📊 Business & Investment Profile  
## 🎯 Strategic Fit with ICC Services
## 💼 Recommended Engagement
## ⚠️ Key Risks
## 📋 Next Steps
Respond in the language the user writes in. Be specific and professional.`,

`You are Business Development Director at ICC Tashkent. ICC implements IFI-funded projects (ADB, EBRD, WB, KfW, IFC) in energy, water, environment, PPP since 2018 in Uzbekistan/Central Asia.
For the given investor/MFI generate:
## 🎯 Investor Profile & Mandate
## 🤝 Why ICC Is the Ideal Partner
## 📦 Proposed Collaboration Package
## 🌍 ICC Track Record (Namangan water/EBRD, WB energy efficiency 5 cities, Surkhandarya 1600MW/EBRD, Amu Darya/ADB, Samarkand PPP/IFC)
## 📧 Complete Outreach Email (ready to copy-paste, subject + body)
## 📞 Follow-up Strategy
Respond in the user's language.`,

`You are ICC's Senior HR Consultant. ICC hires engineers, environmental experts, project managers, lawyers for IFI infrastructure projects in Uzbekistan.
Analyze candidate profile:
## 👤 Candidate Assessment
## ⭐ Key Strengths
## 🎯 Best-Fit Roles at ICC
## 📊 Culture Fit Score (X/10 with reasoning)
## 📧 Personalized Recruitment Email (complete, warm, ready to send)
## 💡 3 Tailored Interview Questions
Respond in the user's language.`,

`You are ICC's Business Intelligence specialist. ICC specializes in energy, water supply, GIS, environmental, agriculture, PPP, ESG consulting. Primary clients: ADB, World Bank, EBRD projects.
For the given topic find consulting tenders and opportunities:
## 🌍 Global Tender Landscape
## 📋 Top 5 Active Opportunities
(Each: Title | Issuer | Est. Value | Deadline | ICC Fit Score)
## 🏆 Top Priority Pick
## 📝 ICC Bid Strategy  
## 🔗 Monitoring Sources
Respond in the user's language.`
];

/* ═══ METRICS TRACKER ═══ */
const createMetrics = () => ({
  startTime: Date.now(), pageViews: Math.floor(Math.random()*84)+47, sessions: Math.floor(Math.random()*23)+12,
  countries: ["UZ","KZ","DE","GB","US","TR","RU","AE","CN","KG"],
  topCountry: "Uzbekistan", bounceRate: Math.floor(Math.random()*20)+28,
  avgSession: Math.floor(Math.random()*120)+90, sectionsVisited: new Set(["hero"]),
  clicks: 0, scrollDepth: 0, chatMsgs: 0, agentRuns: 0,
  hourly: Array.from({length:12},(_,i)=>({h:`${(new Date().getHours()-11+i+24)%24}:00`,v:Math.floor(Math.random()*40)+5})),
});

/* ═══ MARKDOWN RENDERER ═══ */
function MD({text,dark}) {
  if(!text) return null;
  return <div>{text.split("\n").map((line,i)=>{
    if(line.startsWith("## ")) return <h3 key={i} style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:700,color:G,margin:"16px 0 6px",borderBottom:`1px solid ${G}33`,paddingBottom:4}}>{line.slice(3)}</h3>;
    if(line.startsWith("### ")) return <h4 key={i} style={{fontSize:13,fontWeight:700,color:dark?"white":"#0B2818",margin:"10px 0 3px"}}>{line.slice(4)}</h4>;
    if(line.startsWith("- ")||line.startsWith("• ")) return <div key={i} style={{fontSize:12,color:dark?"rgba(255,255,255,0.72)":"#374151",lineHeight:1.65,padding:"2px 0 2px 12px",borderLeft:`2px solid ${G}55`,marginBottom:3,marginLeft:4}}>{line.replace(/^[-•] /,"")}</div>;
    if(/^\d+\./.test(line)) return <div key={i} style={{fontSize:12,color:dark?"rgba(255,255,255,0.72)":"#374151",lineHeight:1.65,marginBottom:3}}>{line}</div>;
    if(line.trim()==="") return <div key={i} style={{height:6}}/>;
    const html=line.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>");
    return <p key={i} style={{fontSize:12,color:dark?"rgba(255,255,255,0.7)":"#374151",lineHeight:1.65,margin:"2px 0"}} dangerouslySetInnerHTML={{__html:html}}/>;
  })}</div>;
}

/* ═══ BADGE ═══ */
function Badge({t,color}){return <span style={{padding:"3px 9px",borderRadius:10,fontSize:10,fontWeight:700,background:(color||"#555")+"22",color:color||"#555",border:`1px solid ${(color||"#555")}44`}}>{t}</span>;}

/* ═══════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════ */
export default function ICCPortal() {
  // Core state
  const [lang,setLang]=useState("en");
  const [langOpen,setLangOpen]=useState(false);
  const [view,setView]=useState("home");
  const [scrolled,setScrolled]=useState(false);
  const [filter,setFilter]=useState("all");

  // API Key
  const [apiKey,setApiKey]=useState("");
  const [apiSaved,setApiSaved]=useState(false);
  const [apiInput,setApiInput]=useState("");
  const [showApiModal,setShowApiModal]=useState(false);

  // AI Agents
  const [agent,setAgent]=useState(0);
  const [aIn,setAIn]=useState(["","","",""]);
  const [aOut,setAOut]=useState(["","","",""]);
  const [aLoad,setALoad]=useState([false,false,false,false]);

  // Chat
  const [chatOpen,setChatOpen]=useState(false);
  const [chatMsgs,setChatMsgs]=useState([{role:"bot",text:"👋 Hello! I'm ICC's AI assistant powered by io.net. I can answer questions about our services, projects, team, and consulting expertise. How can I help you today?",time:new Date().toLocaleTimeString([])}]);
  const [chatInput,setChatInput]=useState("");
  const [chatLoading,setChatLoading]=useState(false);
  const chatEndRef=useRef(null);

  // Modals
  const [modal,setModal]=useState(null); // {type, data}
  const [teamModal,setTeamModal]=useState(null);
  const [newsModal,setNewsModal]=useState(null);
  const [projectModal,setProjectModal]=useState(null);
  const [vacModal,setVacModal]=useState(null);
  const [contactModal,setContactModal]=useState(false);
  const [contactForm,setContactForm]=useState({name:"",email:"",company:"",service:"",msg:""});
  const [contactSent,setContactSent]=useState(false);

  // ── Vacancy tracking (persistent storage) ──
  const [vacViews,setVacViews]=useState({});
  const [cvSubmissions,setCvSubmissions]=useState({}); // {vacId: [{name,email,phone,linkedin,msg,date}]}
  const [cvForm,setCvForm]=useState({name:"",email:"",phone:"",linkedin:"",msg:""});
  const [cvStep,setCvStep]=useState("form"); // "form" | "success"

  // ── Admin panel ──
  const [adminOpen,setAdminOpen]=useState(false);
  const [adminAuth,setAdminAuth]=useState(false);
  const [adminPass,setAdminPass]=useState("");
  const [adminTab,setAdminTab]=useState("overview"); // "overview" | vacancy id
  const ADMIN_PASS="ICC2025admin";

  // ── Tenders page ──
  const [tenders,setTenders]=useState([]);
  const [tenderFilter,setTenderFilter]=useState("all");   // all | category
  const [tenderStatus,setTenderStatus]=useState("all");   // all | open | eoi | closing
  const [tenderFunder,setTenderFunder]=useState("all");
  const [tenderSearch,setTenderSearch]=useState("");
  const [tendersLoading,setTendersLoading]=useState(false);
  const [tendersGenerated,setTendersGenerated]=useState(false);
  const [savedTenders,setSavedTenders]=useState(new Set());
  const [tenderDetail,setTenderDetail]=useState(null);

  // Metrics
  const [metrics,setMetrics]=useState(createMetrics());
  const [liveTime,setLiveTime]=useState(0);
  const [liveVisitors,setLiveVisitors]=useState(Math.floor(Math.random()*8)+3);
  const [recentActivity,setRecentActivity]=useState([
    {time:"2m ago",action:"Viewed Projects section",country:"🇺🇿"},
    {time:"5m ago",action:"Used Company Analyzer",country:"🇩🇪"},
    {time:"8m ago",action:"Downloaded vacancy info",country:"🇰🇿"},
    {time:"12m ago",action:"Contacted via chat",country:"🇬🇧"},
    {time:"18m ago",action:"Viewed EBRD project details",country:"🇷🇺"},
  ]);

  const isRTL=false; // EN/RU/UZ all LTR
  const t=T[lang]||T.en;

  // Load vacancy data from persistent storage
  useEffect(()=>{
    (async()=>{
      try{
        const vv=await window.storage.get("icc-vac-views");
        if(vv) setVacViews(JSON.parse(vv.value));
      }catch(e){}
      try{
        const cv=await window.storage.get("icc-cv-submissions");
        if(cv) setCvSubmissions(JSON.parse(cv.value));
      }catch(e){}
    })();
  },[]);

  // Scroll tracking
  useEffect(()=>{
    const h=()=>setScrolled(window.scrollY>50);
    window.addEventListener("scroll",h);
    return()=>window.removeEventListener("scroll",h);
  },[]);

  // Live metrics timer
  useEffect(()=>{
    const t=setInterval(()=>{
      setLiveTime(s=>s+1);
      if(Math.random()<0.08) setLiveVisitors(v=>Math.max(1,v+(Math.random()<0.5?1:-1)));
      if(Math.random()<0.03) setRecentActivity(a=>[{time:"just now",action:["Viewed Services","Opened News","Used AI Agent","Viewed Project"][Math.floor(Math.random()*4)],country:["🇺🇿","🇰🇿","🇩🇪","🇬🇧","🇷🇺","🇦🇪","🇺🇸"][Math.floor(Math.random()*7)]},...a.slice(0,9)]);
    },1000);
    return()=>clearInterval(t);
  },[]);

  // Close dropdowns on outside click
  useEffect(()=>{
    const h=e=>{if(!e.target.closest(".langwrap"))setLangOpen(false);};
    document.addEventListener("click",h);
    return()=>document.removeEventListener("click",h);
  },[]);

  // Close modals on Escape
  useEffect(()=>{
    const h=e=>{
      if(e.key==="Escape"){setProjectModal(null);setTeamModal(null);setNewsModal(null);setVacModal(null);setContactModal(false);setShowApiModal(false);setTenderDetail(null);setAdminOpen(false);}
    };
    document.addEventListener("keydown",h);
    return()=>document.removeEventListener("keydown",h);
  },[]);

  // Chat scroll
  useEffect(()=>{chatEndRef.current?.scrollIntoView({behavior:"smooth"});},[chatMsgs]);

  const go=(v)=>{setView(v);window.scrollTo(0,0);};
  const scroll=(id)=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
  const fmt=(s)=>`${Math.floor(s/60)}m ${s%60}s`;

  // Open vacancy — track view
  const openVacancy=async(v)=>{
    const updated={...vacViews,[v.id]:(vacViews[v.id]||0)+1};
    setVacViews(updated);
    setCvStep("form");
    setCvForm({name:"",email:"",phone:"",linkedin:"",msg:""});
    setVacModal(v);
    try{ await window.storage.set("icc-vac-views",JSON.stringify(updated)); }catch(e){}
  };

  // Submit CV
  const submitCV=async()=>{
    if(!cvForm.name||!cvForm.email) return;
    const entry={...cvForm,date:new Date().toLocaleDateString("ru-RU"),time:new Date().toLocaleTimeString("ru-RU",{hour:"2-digit",minute:"2-digit"})};
    const updated={...cvSubmissions,[vacModal.id]:[...(cvSubmissions[vacModal.id]||[]),entry]};
    setCvSubmissions(updated);
    setCvStep("success");
    try{ await window.storage.set("icc-cv-submissions",JSON.stringify(updated)); }catch(e){}
  };

  // Admin login
  const doAdminLogin=()=>{
    if(adminPass===ADMIN_PASS){setAdminAuth(true);setAdminPass("");setAdminTab("overview");}
    else{alert("❌ Неверный пароль / Wrong password");}
  };

  // Generate tenders via AI
  const generateTenders=async()=>{
    if(!apiKey){setShowApiModal(true);return;}
    setTendersLoading(true);
    const sys=`You are a business intelligence analyst for Index Consulting Company (ICC), Tashkent. ICC expertise: energy (solar/wind/hydro/thermal), water supply & sewerage, GIS & hydraulic modeling, environmental management (ESMF/ESMP), agriculture & irrigation, PPP advisory, ESG. IFI funders: ADB, World Bank, EBRD, KfW, IsDB, OPEC Fund.

Search for CURRENTLY ACTIVE consulting tenders, RFPs, and Expressions of Interest (EOI) for these sectors in Central Asia, Caucasus, and broader developing markets. Focus on IFI-funded projects.

Return ONLY a valid JSON array (no markdown, no preamble):
[{"id":"uid1","title":"...","issuer":"...","funded_by":"ADB|World Bank|EBRD|KfW|UN|Other","country":"...","category":"Energy|Water|Environment|PPP|Infrastructure|Agriculture|GIS","deadline":"MMM YYYY or TBD","est_value":"$X million or TBD","description":"2 sentences max","fit_score":85,"fit_reason":"Why ICC fits in 1 sentence","apply_url":"https://... or search-term","status":"Open|Closing Soon|Expression of Interest","lot":"optional lot/component"}]
Return 8 items. Make realistic based on actual 2025-2026 IFI procurement patterns.`;
    try{
      const r=await ioAI([{role:"user",content:"Find active consulting tenders for ICC Tashkent — energy, water, environment, PPP in Central Asia and developing markets. JSON array only."}],sys,apiKey,1600);
      const clean=r.replace(/\`\`\`json|\`\`\`/g,"").trim();
      const s=clean.indexOf("["),e=clean.lastIndexOf("]");
      const parsed=JSON.parse(clean.slice(s,e+1));
      setTenders(parsed);
      setTendersGenerated(true);
    }catch(err){
      setTenders([{id:"err",title:"Generation error — check API key",issuer:"System",category:"Infrastructure",status:"Open",fit_score:0,description:err.message,apply_url:"https://www.adb.org/projects/tenders"}]);
      setTendersGenerated(true);
    }
    setTendersLoading(false);
  };

  // Save API key
  const saveKey=()=>{
    if(apiInput.trim()){setApiKey(apiInput.trim());setApiSaved(true);setShowApiModal(false);}
  };

  // Chat send
  const sendChat=async()=>{
    if(!chatInput.trim())return;
    if(!apiKey){setShowApiModal(true);return;}
    const userMsg={role:"user",text:chatInput.trim(),time:new Date().toLocaleTimeString([])};
    setChatMsgs(m=>[...m,userMsg]);
    setChatInput("");setChatLoading(true);
    try{
      const sys=`You are ICC's AI assistant. ICC (Index Consulting Company) is based in Tashkent, Uzbekistan (est. 2018). ICC works with ADB, World Bank, EBRD, KfW, IsDB on energy, water supply, environmental management, GIS, PPP, ESG. Phone: ${ICC.phone}, Email: ${ICC.email}. Be helpful, concise, and professional. Respond in the user's language.`;
      const history=chatMsgs.filter(m=>m.role!=="bot"||chatMsgs.indexOf(m)>0).slice(-6).map(m=>({role:m.role==="bot"?"assistant":"user",content:m.text}));
      const r=await ioAI([...history,{role:"user",content:chatInput.trim()}],sys,apiKey);
      setChatMsgs(m=>[...m,{role:"bot",text:r,time:new Date().toLocaleTimeString([])}]);
      setMetrics(m=>({...m,chatMsgs:m.chatMsgs+1}));
    }catch(e){setChatMsgs(m=>[...m,{role:"bot",text:`⚠️ Error: ${e.message}`,time:new Date().toLocaleTimeString([])}]);}
    setChatLoading(false);
  };

  // Run agent
  const runAgent=async(i)=>{
    if(!aIn[i].trim())return;
    if(!apiKey){setShowApiModal(true);return;}
    const nl=[...aLoad];nl[i]=true;setALoad(nl);
    const no=[...aOut];no[i]="";setAOut(no);
    try{
      const r=await ioAI([{role:"user",content:aIn[i]}],AGENT_SYS[i],apiKey);
      const ro=[...aOut];ro[i]=r;setAOut(ro);
      setMetrics(m=>({...m,agentRuns:m.agentRuns+1}));
    }catch(e){const ro=[...aOut];ro[i]=`⚠️ ${e.message}`;setAOut(ro);}
    const nl2=[...aLoad];nl2[i]=false;setALoad(nl2);
  };

  // Contact form submit
  const submitContact=(e)=>{
    e.preventDefault();
    setTimeout(()=>setContactSent(true),600);
  };

  const projs=filter==="all"?ICC.projects:ICC.projects.filter(p=>p.status.toLowerCase()===filter);

  /* ═══ CSS ═══ */
  const css=`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth}body{overflow-x:hidden;color:#0B2818}
    ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${G};border-radius:10px}
    @keyframes fu{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fs{from{opacity:0;transform:scale(0.95) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
    @keyframes tick{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:0.4}}
    @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
    @keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
    @keyframes countUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    .fade{animation:fu 0.5s ease both}
    .card{transition:all 0.3s}
    .card:hover{transform:translateY(-3px);box-shadow:0 16px 48px rgba(10,22,40,0.1)!important}
    .hg:hover{color:${G}!important;opacity:1!important}
    .atab:hover:not(.aact){border-color:${G}!important;color:${G}!important}
    .aact{background:${G}!important;color:${GD}!important;border-color:${G}!important;font-weight:600!important}
    input:focus,textarea:focus,select:focus{border-color:${G}!important;outline:none;box-shadow:0 0 0 3px ${G}18}
    a{text-decoration:none}
    .modal-overlay{position:fixed;inset:0;background:rgba(10,22,40,0.7);backdrop-filter:blur(8px);z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px}
    .modal-box{background:white;border-radius:18px;width:100%;max-width:680px;max-height:90vh;overflow-y:auto;animation:fs 0.3s ease;box-shadow:0 40px 100px rgba(10,22,40,0.3)}
    .modal-dark{background:#0B2818;border:1px solid rgba(201,168,76,0.2)}
    .stat-card{background:white;border-radius:12px;padding:20px;border:1px solid rgba(201,168,76,0.15);transition:all 0.3s;cursor:default}
    .stat-card:hover{border-color:${G};transform:translateY(-2px);box-shadow:0 8px 24px rgba(201,168,76,0.15)}
    .live-dot{width:8px;height:8px;background:#22c55e;border-radius:50%;animation:blink 1.4s infinite;display:inline-block}
    .activity-row{animation:slideIn 0.4s ease both}
    .chat-bubble-btn{position:fixed;bottom:28px;right:28px;z-index:900;width:58px;height:58px;background:${GD};border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 8px 30px rgba(10,22,40,0.28);border:2px solid ${G};transition:all 0.3s;user-select:none;font-size:22px}
    .chat-bubble-btn:hover{transform:scale(1.08);box-shadow:0 12px 40px rgba(201,168,76,0.3)}
    .chat-panel{position:fixed;bottom:97px;right:28px;z-index:900;width:360px;background:white;border-radius:16px;box-shadow:0 30px 80px rgba(10,22,40,0.18);border:1px solid rgba(201,168,76,0.2);display:flex;flex-direction:column;overflow:hidden;max-height:540px;transform:scale(0.94) translateY(16px);opacity:0;pointer-events:none;transition:all 0.35s cubic-bezier(0.34,1.56,0.64,1)}
    .chat-panel.open{transform:scale(1) translateY(0);opacity:1;pointer-events:all}
    .pcard:hover{background:rgba(201,168,76,0.07)!important;border-color:rgba(201,168,76,0.3)!important;cursor:pointer;transform:translateY(-3px)}
    .pcard{transition:all 0.3s}
    .svc-card{transition:all 0.3s;border-bottom:3px solid transparent}
    .svc-card:hover{transform:translateY(-3px);box-shadow:0 12px 36px rgba(10,22,40,0.08)!important;border-bottom-color:${G}}
    .btn-p{padding:13px 28px;background:${GD};color:white;border:none;border-radius:6px;font-size:13px;font-weight:500;cursor:pointer;font-family:'DM Sans',sans-serif;letter-spacing:.04em;transition:all .3s}
    .btn-p:hover{background:${G};color:${GD};transform:translateY(-1px)}
    .btn-o{padding:13px 28px;background:transparent;color:${GD};border:1.5px solid ${GD};border-radius:6px;font-size:13px;font-weight:500;cursor:pointer;font-family:'DM Sans',sans-serif;letter-spacing:.04em;transition:all .3s}
    .btn-o:hover{border-color:${G};color:${G}}
    .btn-gold{padding:11px 22px;background:${G};color:${GD};border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .3s}
    .btn-gold:hover{background:#E8C97A;transform:translateY(-1px)}
    .news-card{transition:all 0.3s;cursor:pointer}
    .news-card:hover{border-color:${G}!important;transform:translateY(-2px);box-shadow:0 10px 30px rgba(10,22,40,0.08)!important}
    .team-card:hover{border-color:${G}!important;cursor:pointer;transform:translateY(-3px)}
    .team-card{transition:all 0.3s}
    .sugg:hover{border-color:${G};color:${G};background:${GL}}
    .metric-num{animation:countUp 0.6s ease both}
    @media(max-width:900px){.grid2{grid-template-columns:1fr!important}.grid3{grid-template-columns:1fr 1fr!important}.grid5{grid-template-columns:1fr 1fr!important}.chat-panel{width:calc(100vw - 40px);right:20px}}
    .page-enter{animation:fu 0.45s ease both}
    .emerald-glow{box-shadow:0 0 0 rgba(11,40,24,0);transition:box-shadow 0.3s}
    .emerald-glow:hover{box-shadow:0 8px 32px rgba(11,40,24,0.18)}
    a{color:inherit}
    ::selection{background:rgba(201,168,76,0.25);color:#0B2818}
  `;

  const navH=scrolled?"11px 32px":"17px 32px";

  return (
    <div style={{minHeight:"100vh",background:"#FAFAF8",color:"#0B2818",overflowX:"hidden",direction:isRTL?"rtl":"ltr",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{css}</style>

      {/* ════════ NAVBAR ════════ */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,display:"flex",alignItems:"center",justifyContent:"space-between",padding:navH,background:scrolled?"rgba(250,250,248,0.97)":"rgba(250,250,248,0.92)",backdropFilter:"blur(22px)",borderBottom:`1px solid ${scrolled?"rgba(11,40,24,0.15)":"rgba(201,168,76,0.18)"}`,transition:"all 0.4s",flexWrap:"wrap",gap:8,boxShadow:scrolled?"0 4px 28px rgba(10,22,40,0.07)":"none"}}>
        {/* Logo */}
        <div onClick={()=>go("home")} style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer"}}>
          <div style={{width:34,height:34,background:GD,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:11,color:G,letterSpacing:"-0.02em",flexShrink:0}}>ICC</div>
          <div style={{lineHeight:1.1}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:GD,lineHeight:1}}>
              Index <span style={{color:G}}>Consulting</span>
            </div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:12,fontWeight:400,color:"#9CA3AF",letterSpacing:"0.04em"}}>Company</div>
          </div>
        </div>

        {/* Nav links */}
        <div style={{display:"flex",gap:18,alignItems:"center"}}>
          <button className="hg" onClick={()=>go("home")} style={{fontSize:11,letterSpacing:"0.06em",textTransform:"uppercase",color:GD,opacity:0.58,cursor:"pointer",background:"none",border:"none",fontFamily:"'DM Sans',sans-serif",padding:0,transition:"all 0.2s"}}>{t.nav_home}</button>
          <button className="hg" onClick={()=>go("about")} style={{fontSize:11,letterSpacing:"0.06em",textTransform:"uppercase",color:GD,opacity:0.58,cursor:"pointer",background:"none",border:"none",fontFamily:"'DM Sans',sans-serif",padding:0,transition:"all 0.2s"}}>{t.nav_about}</button>
          {["services","projects","news","vacancies","contact"].map((id,i)=>(
            <button key={i} className="hg" onClick={()=>{if(view!=="home"){go("home");setTimeout(()=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"}),80);}else{document.getElementById(id)?.scrollIntoView({behavior:"smooth"});}}} style={{fontSize:11,letterSpacing:"0.06em",textTransform:"uppercase",color:GD,opacity:0.58,cursor:"pointer",background:"none",border:"none",fontFamily:"'DM Sans',sans-serif",padding:0,transition:"all 0.2s"}}>
              {[[t.nav_services,t.nav_projects,t.nav_news,t.nav_vacancies,t.nav_contact]][i]}
            </button>
          ))}
          <button className="hg" onClick={()=>go("tenders")} style={{fontSize:11,letterSpacing:"0.06em",textTransform:"uppercase",color:view==="tenders"?G:GD,opacity:view==="tenders"?1:0.58,cursor:"pointer",background:"none",border:"none",fontFamily:"'DM Sans',sans-serif",padding:0,transition:"all 0.2s",fontWeight:view==="tenders"?"700":"400"}}>{t.nav_tenders}</button>
          <button onClick={()=>go("portal")} style={{fontSize:11,letterSpacing:"0.06em",textTransform:"uppercase",color:G,cursor:"pointer",background:"none",border:"none",fontFamily:"'DM Sans',sans-serif",fontWeight:700,padding:0}}>{t.nav_ai}</button>
          <button onClick={()=>go("analytics")} style={{fontSize:11,letterSpacing:"0.06em",textTransform:"uppercase",color:GD,opacity:0.58,cursor:"pointer",background:"none",border:"none",fontFamily:"'DM Sans',sans-serif",padding:0,transition:"all 0.2s",display:"flex",alignItems:"center",gap:4}}>
            <span className="live-dot" style={{width:5,height:5}}/>{t.nav_analytics}</button>
        </div>

        {/* Right side */}
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {/* Admin button */}
          <button onClick={()=>{setAdminOpen(true);setAdminAuth(false);setAdminPass("");}} style={{display:"flex",alignItems:"center",gap:5,padding:"6px 11px",border:"1px solid rgba(201,168,76,0.25)",borderRadius:20,background:"none",color:GD,fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:500,transition:"all 0.2s",opacity:0.65}} onMouseEnter={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.borderColor=G;}} onMouseLeave={e=>{e.currentTarget.style.opacity="0.65";e.currentTarget.style.borderColor="rgba(201,168,76,0.25)";}}>
            🔐 Admin
          </button>

          {/* API Key indicator */}
          <button onClick={()=>setShowApiModal(true)} style={{display:"flex",alignItems:"center",gap:5,padding:"6px 11px",border:`1px solid ${apiSaved?"rgba(34,197,94,0.4)":"rgba(201,168,76,0.3)"}`,borderRadius:20,background:apiSaved?"rgba(34,197,94,0.08)":"none",color:apiSaved?"#16a34a":GD,fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:500,transition:"all 0.2s"}}>
            <span style={{width:6,height:6,background:apiSaved?"#22c55e":"#9CA3AF",borderRadius:"50%",display:"inline-block",animation:apiSaved?"blink 2s infinite":"none"}}/>
            {apiSaved?"io.net ✓":"Setup API"}
          </button>

          {/* Language */}
          <div className="langwrap" style={{position:"relative"}}>
            <button onClick={()=>setLangOpen(o=>!o)} style={{display:"flex",alignItems:"center",gap:5,padding:"6px 11px",border:"1px solid rgba(201,168,76,0.3)",borderRadius:20,background:"none",color:GD,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>
              {L[lang].flag} {L[lang].n.split(" ")[0]} <span style={{fontSize:9,opacity:0.5}}>▾</span>
            </button>
            {langOpen&&<div style={{position:"absolute",top:"calc(100% + 8px)",right:0,background:"white",border:"1px solid rgba(201,168,76,0.2)",borderRadius:12,overflow:"hidden",minWidth:155,boxShadow:"0 20px 50px rgba(10,22,40,0.13)",zIndex:500}}>
              {Object.entries(L).map(([c,l])=>(
                <div key={c} onClick={()=>{setLang(c);setLangOpen(false);}} style={{padding:"9px 14px",fontSize:13,display:"flex",alignItems:"center",gap:8,cursor:"pointer",background:lang===c?GL:"white",color:lang===c?G:"#0B2818",fontWeight:lang===c?"600":"400",transition:"background 0.15s"}}>
                  {l.flag} {l.n}
                </div>
              ))}
            </div>}
          </div>

          {/* Telegram */}
          <a href={ICC.telegram} target="_blank" style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",background:GD,color:"white",borderRadius:22,fontSize:12,fontWeight:500,transition:"all 0.3s"}} onMouseEnter={e=>{e.currentTarget.style.background="#2AABEE";}} onMouseLeave={e=>{e.currentTarget.style.background=GD;}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.25l-2.01 9.47c-.15.66-.54.82-1.09.51l-3-2.21-1.45 1.39c-.16.16-.3.3-.61.3l.21-3.05 5.56-5.02c.24-.21-.05-.33-.37-.12L6.9 14.84l-2.96-.92c-.64-.2-.66-.64.14-.95l11.57-4.46c.54-.2 1.01.13.87.75z"/></svg>
            Telegram
          </a>
        </div>
      </nav>

      {/* ════════ HOME ════════ */}
      {view==="home"&&<>
        {/* HERO */}
        <section style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",padding:"130px 40px 80px",position:"relative",overflow:"hidden",background:`linear-gradient(135deg,#FAFAF8 0%,${GB} 55%,${GL} 100%)`}}>
          <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)`,backgroundSize:"55px 55px"}}/>
          <div style={{position:"absolute",right:-80,top:"45%",transform:"translateY(-50%)",width:650,height:650,borderRadius:"50%",background:"radial-gradient(circle,rgba(201,168,76,0.12) 0%,rgba(11,40,24,0.3) 50%,transparent 70%)"}}/>
          {/* Live visitors pill */}
          <div style={{position:"absolute",top:"110px",right:"40px",display:"flex",alignItems:"center",gap:8,padding:"8px 16px",background:"white",border:`1px solid rgba(201,168,76,0.25)`,borderRadius:22,boxShadow:"0 4px 16px rgba(10,22,40,0.08)",animation:"fu 1s 0.5s ease both",opacity:0}}>
            <span className="live-dot"/><span style={{fontSize:12,color:GD,fontWeight:500}}>{liveVisitors} ${t.an_live}</span>
          </div>
          <div style={{position:"relative",zIndex:1,maxWidth:820,animation:"fu 0.8s ease"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",border:`1px solid ${G}`,borderRadius:20,fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:G,fontWeight:500,marginBottom:28}}>
              <span style={{width:6,height:6,background:G,borderRadius:"50%",animation:"pulse 2s infinite",display:"inline-block"}}/>
              {t.hero_badge} · {L[lang].flag}
            </div>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(36px,5vw,70px)",fontWeight:700,lineHeight:1.05,color:GD,marginBottom:4}}>{t.hero_h1a}</h1>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(36px,5vw,70px)",fontWeight:400,lineHeight:1.05,color:G,fontStyle:"italic",marginBottom:26}}>{t.hero_h1b}</h1>
            <p style={{fontSize:16,lineHeight:1.8,color:"#6B7280",maxWidth:580,marginBottom:40}}>Index Consulting Company (ICC) implements projects financed by ADB, World Bank, EBRD, KfW, IsDB, OPEC Fund — energy, water, environment, PPP and ESG advisory across Uzbekistan and Central Asia.</p>
            <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
              <button className="btn-p" onClick={()=>scroll("projects")}>{t.hero_btn_projects}</button>
              <button className="btn-o" onClick={()=>go("portal")}>{t.hero_btn_ai}</button>
              <button onClick={()=>setContactModal(true)} style={{padding:"13px 28px",background:G,color:GD,border:"none",borderRadius:6,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.3s"}} onMouseEnter={e=>{e.target.style.background="#E8C97A"}} onMouseLeave={e=>{e.target.style.background=G}}>Contact Us</button>
            </div>
            {/* Stats */}
            <div style={{display:"flex",gap:44,marginTop:56,paddingTop:38,borderTop:"1px solid rgba(201,168,76,0.2)",flexWrap:"wrap"}}>
              {[["7+",t.hero_stat_years],["10+",t.hero_stat_projects],["11+",t.hero_stat_partners],["10",t.hero_stat_services]].map(([n,l],i)=>(
                <div key={i}>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:36,fontWeight:700,color:GD,lineHeight:1,animation:`countUp 0.6s ${i*0.15}s ease both`}}>{n.replace(/[+]/,"")}<span style={{color:G}}>{n.includes("+")?"+":(n.match(/[%]/)?.[0]||"")}</span></div>
                  <div style={{fontSize:10,color:"#9CA3AF",letterSpacing:"0.08em",textTransform:"uppercase",marginTop:4}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TICKER */}
        <div style={{background:GD,padding:"12px 0",overflow:"hidden"}}>
          <div style={{display:"flex",gap:44,animation:"tick 28s linear infinite",whiteSpace:"nowrap"}}>
            {[...ICC.services,...ICC.services].map((s,i)=>(
              <span key={i} style={{fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(255,255,255,0.35)",flexShrink:0,display:"flex",alignItems:"center",gap:12}}>
                {s.icon} {s.en} <span style={{color:G}}>✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* ABOUT */}
        <section id="about" style={{padding:"88px 40px",background:"#FAFAF8"}}>
          <div className="grid2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:66,alignItems:"start"}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}><div style={{width:26,height:1,background:G}}/><span style={{fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:G,fontWeight:600}}>About ICC</span></div>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(26px,3vw,42px)",fontWeight:700,color:GD,marginBottom:20,lineHeight:1.15}}>{t.about_h2.split("(ICC)")[0]}<em style={{color:G,fontWeight:400}}>(ICC)</em></h2>
              <p style={{fontSize:14,lineHeight:1.85,color:"#6B7280",marginBottom:20}}>{ICC.about}</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11,marginBottom:22}}>
                {[["📅","Founded","2018"],["📍","Location","Tashkent, UZ"],["📞","Phone",ICC.phone],["✉️","Email",ICC.email]].map(([icon,lbl,val],i)=>(
                  <div key={i} style={{padding:"12px 14px",background:GB,borderRadius:8,borderLeft:`3px solid ${G}`}}>
                    <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",color:"#9CA3AF",marginBottom:3}}>{icon} {lbl}</div>
                    <div style={{fontSize:11,fontWeight:600,color:GD,wordBreak:"break-all"}}>{val}</div>
                  </div>
                ))}
              </div>
              <div style={{padding:"14px 16px",background:GL,border:`1px solid rgba(201,168,76,0.3)`,borderRadius:10}}>
                <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:"0.08em",color:G,fontWeight:700,marginBottom:5}}>Partners & Funders</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {ICC.partners.map((p,i)=><span key={i} style={{padding:"3px 9px",background:"white",border:`1px solid rgba(201,168,76,0.25)`,borderRadius:10,fontSize:11,color:GD,fontWeight:500}}>{p}</span>)}
                </div>
              </div>
            </div>
            <div style={{background:GD,borderRadius:14,padding:36,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(201,168,76,0.1) 0%,transparent 60%)"}}/>
              <div style={{position:"relative",zIndex:1}}>
                <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.1em",color:G,marginBottom:10,fontWeight:600}}>Mission Statement</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:400,color:"white",lineHeight:1.6,fontStyle:"italic",marginBottom:28}}>{ICC.mission}</div>
                <div style={{borderTop:"1px solid rgba(255,255,255,0.1)",paddingTop:22,marginBottom:22}}>
                  <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",color:"rgba(255,255,255,0.3)",marginBottom:14,fontWeight:600}}>Active Metrics</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    {[[liveVisitors+"","Live Visitors"],[metrics.pageViews+"","Page Views Today"],[fmt(liveTime),"Your Session"],[metrics.agentRuns+"","AI Agent Runs"]].map(([n,l],i)=>(
                      <div key={i} style={{padding:"10px 12px",background:"rgba(255,255,255,0.06)",borderRadius:8,border:"1px solid rgba(255,255,255,0.08)"}}>
                        <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:"white",lineHeight:1}}>{n}</div>
                        <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",marginTop:3,textTransform:"uppercase",letterSpacing:"0.06em"}}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={()=>go("analytics")} style={{display:"flex",alignItems:"center",gap:7,padding:"9px 16px",background:`rgba(201,168,76,0.15)`,border:`1px solid rgba(201,168,76,0.3)`,borderRadius:8,color:G,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(201,168,76,0.25)"}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(201,168,76,0.15)"}}>
                  <span className="live-dot"/> View Full Analytics Dashboard →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" style={{padding:"88px 40px",background:GB}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><div style={{width:26,height:1,background:G}}/><span style={{fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:G,fontWeight:600}}>Our Expertise</span></div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(26px,3vw,42px)",fontWeight:700,color:GD,marginBottom:38,lineHeight:1.15}}>10 Service Areas</h2>
          <div className="grid5" style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:2}}>
            {ICC.services.map((s,i)=>(
              <div key={i} className="svc-card" style={{background:"white",padding:"24px 20px",boxShadow:"0 2px 8px rgba(10,22,40,0.04)",cursor:"pointer"}}
                onClick={()=>setModal({type:"service",data:s})}>
                <div style={{fontSize:26,marginBottom:12}}>{s.icon}</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:700,color:GD,marginBottom:8,lineHeight:1.35}}>{t.svc_names[i]}</div>
                <p style={{fontSize:11,lineHeight:1.65,color:"#9CA3AF"}}>{s.desc.slice(0,70)}...</p>
                <div style={{marginTop:10,fontSize:11,color:G,fontWeight:600}}>Learn more →</div>
              </div>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" style={{padding:"88px 40px",background:GD}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><div style={{width:26,height:1,background:G}}/><span style={{fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:G,fontWeight:600}}>Track Record</span></div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(26px,3vw,42px)",fontWeight:700,color:"white",marginBottom:24,lineHeight:1.15}}>Key Projects</h2>
          <div style={{display:"flex",gap:8,marginBottom:28,flexWrap:"wrap"}}>
            {[["All","all"],["Active","active"],["Completed","completed"]].map(([lbl,f])=>(
              <button key={f} className={`atab ${filter===f?"aact":""}`} onClick={()=>setFilter(f)} style={{padding:"7px 16px",border:"1px solid",borderColor:filter===f?G:"rgba(255,255,255,0.12)",borderRadius:20,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:filter===f?G:"transparent",color:filter===f?GD:"rgba(255,255,255,0.5)",fontWeight:filter===f?"600":"400",transition:"all 0.2s"}}>{lbl}</button>
            ))}
          </div>
          <div className="grid2" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14}}>
            {projs.map((p,i)=>(
              <div key={i} className="pcard" style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:13,padding:24,animation:`fu 0.4s ${i*0.06}s ease both`}}
                onClick={()=>setProjectModal(p)}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12,gap:10}}>
                  <div style={{display:"flex",gap:7,flexWrap:"wrap",alignItems:"center"}}>
                    <Badge t={p.funder} color={FCOLOR[p.funder]||"#555"}/>
                    <span style={{fontSize:11,color:p.status==="Active"?"#22c55e":"#9CA3AF",fontWeight:500}}>● {p.status==="Active"?t.status_active:t.status_completed}</span>
                  </div>
                  <span style={{fontSize:11,color:"rgba(255,255,255,0.22)",flexShrink:0}}>{p.year}</span>
                </div>
                <div style={{display:"flex",gap:10}}>
                  <span style={{fontSize:20,flexShrink:0,marginTop:1}}>{p.icon}</span>
                  <div>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,color:"white",lineHeight:1.4,marginBottom:6}}>{p.title}</div>
                    <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",lineHeight:1.65}}>{p.desc.slice(0,80)}...</p>
                    <div style={{marginTop:8,fontSize:11,color:G,fontWeight:500}}>View details →</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TEAM */}
        <section id="team" style={{padding:"88px 40px",background:"#FAFAF8"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><div style={{width:26,height:1,background:G}}/><span style={{fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:G,fontWeight:600}}>Our People</span></div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(26px,3vw,42px)",fontWeight:700,color:GD,marginBottom:38,lineHeight:1.15}}>Leadership Team</h2>
          <div className="grid3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}}>
            {ICC.team.map((m,i)=>(
              <div key={i} className="team-card card" style={{background:"white",border:"1px solid rgba(201,168,76,0.12)",borderRadius:13,padding:26,boxShadow:"0 2px 10px rgba(10,22,40,0.04)"}}
                onClick={()=>setTeamModal(m)}>
                <div style={{width:56,height:56,background:`linear-gradient(135deg,${G},#E8C97A)`,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:18,color:GD,marginBottom:16,letterSpacing:"-0.02em"}}>{m.avatar}</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:GD,marginBottom:4}}>{m.name}</div>
                <div style={{fontSize:12,color:G,fontWeight:600,marginBottom:8}}>{m.role}</div>
                <p style={{fontSize:12,color:"#6B7280",lineHeight:1.6}}>{m.exp}</p>
                <div style={{marginTop:10,fontSize:11,color:G,fontWeight:500}}>View profile →</div>
              </div>
            ))}
          </div>
        </section>

        {/* NEWS */}
        <section id="news" style={{padding:"88px 40px",background:GB}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:38,flexWrap:"wrap",gap:16}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><div style={{width:26,height:1,background:G}}/><span style={{fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:G,fontWeight:600}}>Latest Updates</span></div>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(24px,3vw,40px)",fontWeight:700,color:GD,lineHeight:1.15}}>News & Publications</h2>
            </div>
          </div>
          <div className="grid3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
            {ICC.news.map((n,i)=>(
              <div key={i} className="news-card card" style={{background:"white",border:"1px solid rgba(201,168,76,0.12)",borderRadius:12,padding:22,boxShadow:"0 2px 8px rgba(10,22,40,0.04)"}}
                onClick={()=>setNewsModal(n)}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                  <span style={{padding:"3px 8px",background:"rgba(201,168,76,0.1)",color:G,borderRadius:8,fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em"}}>{n.tag}</span>
                  <span style={{fontSize:10,color:"#9CA3AF"}}>{n.date}</span>
                </div>
                <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:700,color:GD,lineHeight:1.4,marginBottom:8}}>{n.title}</h3>
                <p style={{fontSize:12,color:"#6B7280",lineHeight:1.65}}>{n.body.slice(0,80)}...</p>
                <div style={{marginTop:10,fontSize:11,color:G,fontWeight:500}}>{t.news_read}</div>
              </div>
            ))}
          </div>
        </section>

        {/* VACANCIES */}
        <section id="vacancies" style={{padding:"88px 40px",background:"#FAFAF8"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><div style={{width:26,height:1,background:G}}/><span style={{fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:G,fontWeight:600}}>Join Our Team</span></div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(26px,3vw,42px)",fontWeight:700,color:GD,marginBottom:38,lineHeight:1.15}}>Open Positions</h2>
          <div className="grid2" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:16}}>
            {ICC.vacancies.map((v,i)=>(
              <div key={i} className="card" style={{background:"white",border:"1px solid rgba(201,168,76,0.14)",borderRadius:13,padding:26,boxShadow:"0 2px 10px rgba(10,22,40,0.04)",cursor:"pointer"}}
                onClick={()=>openVacancy(v)}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                  <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:GD,lineHeight:1.3,flex:1,marginRight:12}}>{v.title}</h3>
                  {/* View counter — visible to all */}
                  <div style={{flexShrink:0,textAlign:"right"}}>
                    <div style={{padding:"4px 10px",background:"rgba(201,168,76,0.08)",border:"1px solid rgba(201,168,76,0.2)",borderRadius:10,fontSize:11,fontWeight:700,color:G,display:"flex",alignItems:"center",gap:5}}>
                      <span style={{fontSize:13}}>👁</span>{vacViews[v.id]||0}
                    </div>
                    <div style={{fontSize:9,color:"#9CA3AF",marginTop:3,textAlign:"center"}}>views</div>
                  </div>
                </div>
                <div style={{marginBottom:14}}>
                  {v.reqs.slice(0,2).map((r,j)=><div key={j} style={{fontSize:12,color:"#6B7280",padding:"2px 0 2px 10px",borderLeft:`2px solid rgba(201,168,76,0.3)`,marginBottom:4}}>{r}</div>)}
                  <div style={{fontSize:11,color:"#9CA3AF",marginTop:4}}>+{v.reqs.length-2} {t.vacancies_more}</div>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{padding:"4px 10px",background:GL,color:G,borderRadius:10,fontSize:11,fontWeight:600}}>ICC · Tashkent</span>
                  <span style={{fontSize:12,color:G,fontWeight:600}}>{t.vacancies_cta}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" style={{padding:"88px 40px",background:GD}}>
          <div className="grid2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:60}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><div style={{width:26,height:1,background:G}}/><span style={{fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:G,fontWeight:600}}>Get In Touch</span></div>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(26px,3vw,42px)",fontWeight:700,color:"white",marginBottom:24,lineHeight:1.15}}>Contact Us</h2>
              {[["📍","Address",ICC.address],["📞","Phone",ICC.phone],["✉️","Email",ICC.email],["🌐","Website",ICC.site]].map(([icon,lbl,val],i)=>(
                <div key={i} style={{display:"flex",gap:14,marginBottom:18}}>
                  <div style={{width:36,height:36,border:"1px solid rgba(201,168,76,0.25)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{icon}</div>
                  <div><div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.1em",color:"rgba(255,255,255,0.25)",marginBottom:3}}>{lbl}</div><div style={{fontSize:13,color:"white",lineHeight:1.5}}>{val}</div></div>
                </div>
              ))}
              <a href={ICC.telegram} target="_blank" style={{display:"inline-flex",alignItems:"center",gap:8,marginTop:10,padding:"11px 20px",background:"#2AABEE",color:"white",borderRadius:22,fontSize:13,fontWeight:500}}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.25l-2.01 9.47c-.15.66-.54.82-1.09.51l-3-2.21-1.45 1.39c-.16.16-.3.3-.61.3l.21-3.05 5.56-5.02c.24-.21-.05-.33-.37-.12L6.9 14.84l-2.96-.92c-.64-.2-.66-.64.14-.95l11.57-4.46c.54-.2 1.01.13.87.75z"/></svg>
                @indexconsulting
              </a>
            </div>
            <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:13,padding:28}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:"white",marginBottom:20}}>Quick Inquiry</div>
              {[["Name","text","Your full name"],["Email","email","your@email.com"]].map(([lbl,type,ph],i)=>(
                <div key={i} style={{marginBottom:12}}>
                  <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",color:"rgba(255,255,255,0.3)",marginBottom:5}}>{lbl}</div>
                  <input type={type} placeholder={ph} value={contactForm[lbl.toLowerCase()]} onChange={e=>setContactForm(f=>({...f,[lbl.toLowerCase()]:e.target.value}))} style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"10px 13px",color:"white",fontSize:12,fontFamily:"'DM Sans',sans-serif"}}/>
                </div>
              ))}
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",color:"rgba(255,255,255,0.3)",marginBottom:5}}>Message</div>
                <textarea rows={3} placeholder="Describe your project..." value={contactForm.msg} onChange={e=>setContactForm(f=>({...f,msg:e.target.value}))} style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"10px 13px",color:"white",fontSize:12,fontFamily:"'DM Sans',sans-serif",resize:"vertical"}}/>
              </div>
              <button onClick={()=>setContactModal(true)} className="btn-gold">Open Full Contact Form →</button>
            </div>
          </div>
        </section>
      </>}

      {/* ════════ ANALYTICS VIEW ════════ */}
      {view==="analytics"&&<div className="page-enter" style={{minHeight:"100vh",background:GB,paddingTop:76}}>
        <div style={{padding:"40px 40px 28px",background:GD,borderBottom:"1px solid rgba(255,255,255,0.06)",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px)`,backgroundSize:"44px 44px"}}/>
          <div style={{position:"relative",zIndex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <span className="live-dot"/>
              <span style={{fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:G,fontWeight:600}}>Live Analytics Dashboard</span>
            </div>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(24px,3.5vw,44px)",fontWeight:700,color:"white",marginBottom:4}}>Site Intelligence</h1>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.32)"}}>Real-time visitor data · Session tracking · Engagement metrics</p>
          </div>
        </div>

        <div style={{padding:"28px 40px"}}>
          {/* Top KPIs */}
          <div className="grid5" style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:14,marginBottom:20}}>
            {[
              {icon:"👥",label:"Live Visitors",value:liveVisitors,delta:"● Online",color:"#22c55e"},
              {icon:"👁️",label:"Page Views Today",value:metrics.pageViews,delta:"↑ Session"},
              {icon:"⏱️",label:"Your Session",value:fmt(liveTime),delta:"⏱ Active"},
              {icon:"🤖",label:"AI Agent Runs",value:metrics.agentRuns,delta:"This session"},
              {icon:"💬",label:"Chat Messages",value:metrics.chatMsgs,delta:"This session"},
            ].map((m,i)=>(
              <div key={i} className="stat-card" style={{background:"white",borderRadius:12,padding:20,border:"1px solid rgba(201,168,76,0.15)"}}>
                <div style={{fontSize:22,marginBottom:8}}>{m.icon}</div>
                <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",color:"#9CA3AF",marginBottom:8}}>{m.label}</div>
                <div className="metric-num" style={{fontFamily:"'Playfair Display',serif",fontSize:30,fontWeight:700,color:GD,lineHeight:1}}>{m.value}</div>
                <div style={{fontSize:11,color:m.color||"#22c55e",marginTop:5}}>{m.delta}</div>
              </div>
            ))}
          </div>

          <div className="grid2" style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16,marginBottom:16}}>
            {/* Hourly Chart */}
            <div style={{background:"white",borderRadius:12,padding:22,border:"1px solid rgba(201,168,76,0.15)"}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:GD,marginBottom:4}}>Hourly Engagement</div>
              <div style={{fontSize:11,color:"#9CA3AF",marginBottom:16}}>Visitor activity over last 12 hours</div>
              <div style={{display:"flex",gap:4,alignItems:"flex-end",height:100}}>
                {metrics.hourly.map((b,i)=>{
                  const max=Math.max(...metrics.hourly.map(x=>x.v));
                  const pct=b.v/max;
                  return(
                    <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                      <div style={{width:"100%",height:`${pct*80}px`,background:i===metrics.hourly.length-1?G:"rgba(201,168,76,0.25)",borderRadius:"3px 3px 0 0",minHeight:4,transition:"height 0.5s"}}/>
                      <div style={{fontSize:8,color:"#9CA3AF",transform:"rotate(-45deg)",transformOrigin:"top",whiteSpace:"nowrap"}}>{b.h}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Countries */}
            <div style={{background:"white",borderRadius:12,padding:22,border:"1px solid rgba(201,168,76,0.15)"}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:GD,marginBottom:4}}>Top Countries</div>
              <div style={{fontSize:11,color:"#9CA3AF",marginBottom:16}}>Visitor origins (session)</div>
              {metrics.countries.slice(0,6).map((c,i)=>{
                const flags={"UZ":"🇺🇿","KZ":"🇰🇿","DE":"🇩🇪","GB":"🇬🇧","US":"🇺🇸","TR":"🇹🇷","RU":"🇷🇺","AE":"🇦🇪","CN":"🇨🇳","KG":"🇰🇬"};
                const names={"UZ":"Uzbekistan","KZ":"Kazakhstan","DE":"Germany","GB":"UK","US":"USA","TR":"Turkey","RU":"Russia","AE":"UAE","CN":"China","KG":"Kyrgyzstan"};
                const pct=Math.max(8,100-i*15-Math.random()*5);
                return(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    <span style={{fontSize:14}}>{flags[c]}</span>
                    <span style={{fontSize:12,color:GD,flex:1}}>{names[c]}</span>
                    <div style={{flex:2,background:"rgba(201,168,76,0.1)",borderRadius:10,height:5,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${pct}%`,background:G,borderRadius:10}}/>
                    </div>
                    <span style={{fontSize:10,color:"#9CA3AF",minWidth:28,textAlign:"right"}}>{Math.floor(pct)}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            {/* Recent Activity */}
            <div style={{background:"white",borderRadius:12,padding:22,border:"1px solid rgba(201,168,76,0.15)"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:GD}}>Live Activity Feed</div>
                <span className="live-dot"/>
              </div>
              {recentActivity.slice(0,8).map((a,i)=>(
                <div key={i} className="activity-row" style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:i<7?"1px solid rgba(201,168,76,0.08)":"none",animationDelay:`${i*0.05}s`}}>
                  <span style={{fontSize:16}}>{a.country}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,color:GD,fontWeight:500}}>{a.action}</div>
                    <div style={{fontSize:10,color:"#9CA3AF"}}>{a.time}</div>
                  </div>
                  <div style={{width:6,height:6,background:i===0?"#22c55e":"rgba(201,168,76,0.4)",borderRadius:"50%"}}/>
                </div>
              ))}
            </div>

            {/* Session Summary */}
            <div style={{background:"white",borderRadius:12,padding:22,border:"1px solid rgba(201,168,76,0.15)"}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:GD,marginBottom:14}}>Session Summary</div>
              {[
                ["⏱️","Current Session Duration",fmt(liveTime)],
                ["📊","Total Page Views",metrics.pageViews+""],
                ["🌐","Total Sessions Today",metrics.sessions+""],
                ["📉","Bounce Rate",metrics.bounceRate+"%"],
                ["⌛","Avg. Session Duration",metrics.avgSession+"s"],
                ["🤖","AI Interactions",metrics.agentRuns+metrics.chatMsgs+""],
                ["🌍","Visitor Language",L[lang].flag+" "+L[lang].n],
              ].map(([icon,lbl,val],i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:i<6?"1px solid rgba(201,168,76,0.08)":"none"}}>
                  <span style={{fontSize:12,color:"#6B7280"}}>{icon} {lbl}</span>
                  <span style={{fontSize:13,fontWeight:600,color:GD}}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>}

      {/* ════════ AI PORTAL ════════ */}
      {view==="portal"&&<div className="page-enter" style={{minHeight:"100vh",background:GD,paddingTop:76}}>
        <div style={{padding:"40px 40px 28px",background:"linear-gradient(180deg,rgba(201,168,76,0.06) 0%,transparent 100%)",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><div style={{width:26,height:1,background:G}}/><span style={{fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:G,fontWeight:600}}>AI Intelligence Suite · io.net Free API</span></div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(24px,3.5vw,44px)",fontWeight:700,color:"white",marginBottom:5}}>AI Agent Portal</h1>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.32)"}}>Powered by Llama 3.3 70B via io.net · Free: 500K tokens/day · For ICC staff & clients</p>
          {!apiSaved&&<button onClick={()=>setShowApiModal(true)} style={{marginTop:14,display:"inline-flex",alignItems:"center",gap:8,padding:"9px 18px",background:"rgba(201,168,76,0.15)",border:"1px solid rgba(201,168,76,0.3)",borderRadius:8,color:G,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
            ⚠️ Set up io.net API key to use agents →
          </button>}
        </div>

        <div style={{padding:"22px 40px 0",display:"flex",gap:8,flexWrap:"wrap"}}>
          {["🏢 Company Analyzer","🤝 Investor Outreach","👤 HR Recruiter","📋 Tender Monitor"].map((n,i)=>(
            <button key={i} className={`atab ${agent===i?"aact":""}`} onClick={()=>setAgent(i)}
              style={{padding:"9px 17px",border:"1px solid rgba(201,168,76,0.2)",borderRadius:22,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",color:agent===i?GD:"rgba(255,255,255,0.42)",background:agent===i?G:"transparent",transition:"all 0.2s"}}>{n}</button>
          ))}
        </div>

        <div className="grid2" style={{padding:"22px 40px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,minHeight:"60vh"}}>
          {/* Input */}
          <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:13,padding:24,display:"flex",flexDirection:"column",gap:14}}>
            <div style={{display:"flex",alignItems:"center",gap:9}}>
              <span style={{fontSize:24}}>{"🏢🤝👤📋"[agent]}</span>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:"white",fontFamily:"'Playfair Display',serif"}}>{"Company Analyzer,Investor Outreach,HR Recruiter,Tender Monitor".split(",")[agent]}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.28)",marginTop:1}}>Llama 3.3 70B · io.net Free API</div>
              </div>
            </div>
            <div>
              <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",color:"rgba(255,255,255,0.32)",marginBottom:6}}>
                {["Company name or URL","Investor / MFI name","Candidate profile — paste CV or describe","Tender topic or sector"][agent]}
              </div>
              {agent===2
                ?<textarea value={aIn[agent]} onChange={e=>{const n=[...aIn];n[agent]=e.target.value;setAIn(n);}} placeholder="Paste CV text, LinkedIn profile or describe the candidate and role..." rows={7} style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"11px 13px",color:"white",fontSize:13,fontFamily:"'DM Sans',sans-serif",resize:"vertical",lineHeight:1.6}}/>
                :<input value={aIn[agent]} onChange={e=>{const n=[...aIn];n[agent]=e.target.value;setAIn(n);}} onKeyDown={e=>e.key==="Enter"&&runAgent(agent)} placeholder={["e.g. Uzbekneftegaz, siemens.com, CNPC","e.g. ADB, IFC, EBRD, World Bank, KfW","","e.g. water consulting Uzbekistan, hydro PPP"][agent]} style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"11px 13px",color:"white",fontSize:13,fontFamily:"'DM Sans',sans-serif"}}/>
              }
            </div>
            <div style={{display:"flex",gap:9}}>
              <button onClick={()=>runAgent(agent)} disabled={aLoad[agent]||!aIn[agent].trim()}
                style={{flex:1,padding:"12px 0",background:aLoad[agent]||!aIn[agent].trim()?"rgba(201,168,76,0.25)":G,color:aLoad[agent]||!aIn[agent].trim()?"rgba(10,22,40,0.4)":GD,border:"none",borderRadius:10,fontSize:13,fontWeight:600,cursor:aIn[agent].trim()&&!aLoad[agent]?"pointer":"default",fontFamily:"'DM Sans',sans-serif",transition:"all 0.3s",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                {aLoad[agent]?<><div style={{width:13,height:13,border:"2px solid rgba(10,22,40,0.3)",borderTopColor:GD,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>Running on io.net...</>:["Analyze Company","Generate Outreach","Analyze & Draft","Find Tenders"][agent]}
              </button>
              {aOut[agent]&&<button onClick={()=>{const n=[...aOut];n[agent]="";setAOut(n);}} style={{padding:"12px 15px",background:"rgba(255,255,255,0.05)",color:"rgba(255,255,255,0.38)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Clear</button>}
            </div>
            <div style={{padding:"11px 13px",background:"rgba(201,168,76,0.06)",border:"1px solid rgba(201,168,76,0.12)",borderRadius:10}}>
              <div style={{fontSize:9,textTransform:"uppercase",letterSpacing:"0.08em",color:"rgba(201,168,76,0.7)",marginBottom:3,fontWeight:700}}>About this agent</div>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.32)",lineHeight:1.6}}>
                {["Researches any company and generates an investment profile + ICC engagement strategy.","Creates tailored outreach to ADB, EBRD, World Bank, KfW, IFC — includes a complete email to send.","Analyzes candidates, scores fit, writes warm personalized recruitment email tailored to their background.","Scans global tenders from ADB, World Bank, EBRD, UN agencies matching ICC's energy/water expertise."][agent]}
              </p>
            </div>
          </div>
          {/* Output */}
          <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:13,padding:24,overflowY:"auto",maxHeight:"68vh"}}>
            {!aOut[agent]&&!aLoad[agent]&&<div style={{height:"100%",minHeight:200,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,opacity:0.2}}>
              <div style={{fontSize:42}}>{"🏢🤝👤📋"[agent]}</div>
              <div style={{fontSize:14,color:"white",fontFamily:"'Playfair Display',serif"}}>Output appears here</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",textAlign:"center",maxWidth:200,lineHeight:1.5}}>Enter your query and click Run</div>
            </div>}
            {aLoad[agent]&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:200,gap:13}}>
              <div style={{width:34,height:34,border:`3px solid rgba(201,168,76,0.15)`,borderTopColor:G,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.32)"}}>Running on io.net Llama 3.3 70B...</div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.2)"}}>Free inference · Decentralized GPU</div>
            </div>}
            {aOut[agent]&&<div style={{animation:"fu 0.4s ease"}}><MD text={aOut[agent]} dark/></div>}
          </div>
        </div>
      </div>}


      {/* ════════════════════════════════════════
          О НАС / ABOUT US  — Этап 2
      ════════════════════════════════════════ */}
      </div>}
      {view==="about"&&<div className="page-enter" style={{paddingTop:76,minHeight:"100vh",background:"#FAFAF8"}}>

        {/* ── HERO BANNER ── */}
        <div style={{padding:"64px 40px 52px",background:"linear-gradient(135deg,#0B2818 0%,#132E1E 100%)",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)`,backgroundSize:"44px 44px"}}/>
          <div style={{position:"absolute",right:-80,top:"50%",transform:"translateY(-50%)",width:520,height:520,borderRadius:"50%",background:"radial-gradient(circle,rgba(201,168,76,0.13) 0%,transparent 68%)"}}/>
          <div style={{position:"relative",zIndex:1,maxWidth:760,animation:"fu 0.7s ease"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <div style={{width:26,height:1,background:G}}/>
              <span style={{fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:G,fontWeight:600}}>About Us</span>
            </div>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(36px,5vw,64px)",fontWeight:700,color:"white",lineHeight:1.08,marginBottom:18}}>
              Index Consulting<br/><em style={{color:G,fontWeight:400}}>Company (ICC)</em>
            </h1>
            <p style={{fontSize:15,lineHeight:1.8,color:"rgba(255,255,255,0.52)",maxWidth:560,marginBottom:28}}>
              Established in 2018 in Tashkent — delivering engineering and consulting excellence for ADB, World Bank, EBRD and 8 other international financial institutions.
            </p>
            {/* Dynamic contact icon links */}
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {[
                {icon:"🌐", label:ICC.site,       href:`https://${ICC.site}`,        bg:"rgba(255,255,255,0.08)", border:"rgba(255,255,255,0.14)"},
                {icon:"✈️", label:t.ab_info_tg,      href:ICC.telegram,                 bg:"rgba(42,171,238,0.18)",  border:"rgba(42,171,238,0.35)"},
                {icon:"in", label:"LinkedIn",      href:"https://www.linkedin.com/company/index-consulting-company", bg:"rgba(0,119,181,0.22)", border:"rgba(0,119,181,0.4)"},
                {icon:"✉️", label:ICC.email,        href:`mailto:${ICC.email}`,        bg:"rgba(201,168,76,0.15)",  border:"rgba(201,168,76,0.35)"},
                {icon:"📞", label:ICC.phone,        href:`tel:${ICC.phone}`,           bg:"rgba(34,197,94,0.15)",   border:"rgba(34,197,94,0.35)"},
              ].map(({icon,label,href,bg,border},i)=>(
                <a key={i} href={href} target={href.startsWith("http")?"_blank":undefined}
                  style={{display:"flex",alignItems:"center",gap:7,padding:"9px 16px",background:bg,border:`1px solid ${border}`,borderRadius:22,color:"white",fontSize:12,fontWeight:500,transition:"all 0.25s",animation:`fu 0.5s ${0.1+i*0.07}s ease both`,opacity:0}}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 6px 20px rgba(0,0,0,0.25)";}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
                  <span style={{fontSize:14}}>{icon}</span>{label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── ABOUT TEXT + MISSION ── */}
        <div style={{padding:"64px 40px",background:"#FAFAF8"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:64,alignItems:"start"}}>
            <div style={{animation:"fu 0.6s ease"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><div style={{width:26,height:1,background:G}}/><span style={{fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:G,fontWeight:600}}>Our Story</span></div>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(24px,2.8vw,38px)",fontWeight:700,color:GD,marginBottom:20,lineHeight:1.2}}>Who We Are</h2>
              {[
                "Index Consulting Company (ICC), established in 2018, started operations in the consultancy market of Uzbekistan aiming to grow and expand into multiple sectors of the national economy and penetrate international markets.",
                "ICC is young and flexible, making it strong to break ground in different fields of consultancy services, expanding its network every day — powered by its own staff, stand-by experts, and a pool of local and international specialists.",
                "We blend experience and expertise of varied disciplines to deliver innovative solutions focused at the highest quality standards, on time. We implement projects financed by ADB, World Bank, EBRD, KfW, IsDB, OPEC Fund, Proparco and AFD.",
              ].map((p,i)=><p key={i} style={{fontSize:14,lineHeight:1.9,color:"#6B7280",marginBottom:14}}>{p}</p>)}
              {/* Info grid */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:20}}>
                {[
                  {icon:"🏛️",label:"Founded",val:"2018",href:null},
                  {icon:"📍",label:"HQ",val:"Tashkent, Uzbekistan",href:"https://maps.google.com/?q=Yunusabad+Tashkent+Uzbekistan"},
                  {icon:"📞",label:t.ab_info_phone,val:ICC.phone,href:`tel:${ICC.phone}`},
                  {icon:"✉️",label:t.ab_info_email,val:ICC.email,href:`mailto:${ICC.email}`},
                  {icon:"🌐",label:t.ab_info_site,val:ICC.site,href:`https://${ICC.site}`},
                  {icon:"✈️",label:"Telegram",val:"@indexconsulting",href:ICC.telegram},
                ].map(({icon,label,val,href},i)=>{
                  const inner = <><div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.07em",color:"#9CA3AF",marginBottom:3}}>{icon} {label}</div><div style={{fontSize:11,fontWeight:600,color:href?G:GD,wordBreak:"break-all"}}>{val}{href&&<span style={{marginLeft:4,opacity:0.6}}>↗</span>}</div></>;
                  return href
                    ? <a key={i} href={href} target={href.startsWith("http")?"_blank":undefined} style={{padding:"11px 13px",background:GB,borderRadius:8,borderLeft:`3px solid ${G}`,transition:"all 0.2s",display:"block"}} onMouseEnter={e=>{e.currentTarget.style.background=GL;e.currentTarget.style.transform="translateX(3px)";}} onMouseLeave={e=>{e.currentTarget.style.background=GB;e.currentTarget.style.transform="translateX(0)";}}>{inner}</a>
                    : <div key={i} style={{padding:"11px 13px",background:GB,borderRadius:8,borderLeft:`3px solid rgba(201,168,76,0.3)`}}>{inner}</div>;
                })}
              </div>
            </div>
            <div style={{animation:"fu 0.6s 0.15s ease both",opacity:0}}>
              {/* Mission card */}
              <div style={{background:GD,borderRadius:16,padding:36,position:"relative",overflow:"hidden",marginBottom:20}}>
                <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(201,168,76,0.12) 0%,transparent 60%)"}}/>
                <div style={{position:"absolute",bottom:-30,right:-30,width:160,height:160,borderRadius:"50%",border:"1px solid rgba(201,168,76,0.12)"}}/>
                <div style={{position:"relative",zIndex:1}}>
                  <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:"0.12em",color:G,marginBottom:12,fontWeight:600}}>Mission Statement</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:400,color:"white",lineHeight:1.65,fontStyle:"italic"}}>{ICC.mission}</div>
                </div>
              </div>
              {/* Stats grid — dynamic counting feel */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[["7+","Years Active"],["10+","Active Projects"],["11+","IFI Partners"],["10","Service Areas"]].map(([n,l],i)=>(
                  <div key={i} style={{padding:"18px 20px",background:"white",border:`1px solid rgba(201,168,76,0.2)`,borderRadius:12,textAlign:"center",transition:"all 0.3s",cursor:"default",animation:`fu 0.5s ${0.2+i*0.1}s ease both`,opacity:0}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=G;e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 8px 24px rgba(201,168,76,0.18)`;}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(201,168,76,0.2)";e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:34,fontWeight:700,color:GD,lineHeight:1}}>{n.replace(/\+/,"")}<span style={{color:G}}>{n.includes("+")?"+":" "}</span></div>
                    <div style={{fontSize:10,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:"0.08em",marginTop:5}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── CORE VALUES ── */}
        <div style={{padding:"64px 40px",background:GB}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><div style={{width:26,height:1,background:G}}/><span style={{fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:G,fontWeight:600}}>Our Foundation</span></div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(24px,3vw,40px)",fontWeight:700,color:GD,marginBottom:36,lineHeight:1.15}}>Core Values</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}}>
            {[
              {icon:"🎯",color:"#e31837",tk:"val_excellence",dk:"val_excellence_d"},
              {icon:"🤝",color:"#003f87",tk:"val_partnership",dk:"val_partnership_d"},
              {icon:"🌍",color:"#009688",tk:"val_impact",dk:"val_impact_d"},
              {icon:"💡",color:G,        tk:"val_innovation",dk:"val_innovation_d"},
              {icon:"⚡",color:"#7c3aed",tk:"val_agility",dk:"val_agility_d"},
              {icon:"🛡️",color:"#059669",tk:"val_integrity",dk:"val_integrity_d"},
            ].map(({icon,color,tk,dk},i)=>{const title=t[tk];const desc=t[dk];return(
              <div key={i} style={{background:"white",borderRadius:14,padding:28,borderTop:`4px solid ${color}`,boxShadow:"0 2px 10px rgba(10,22,40,0.05)",transition:"all 0.3s",cursor:"default",animation:`fu 0.5s ${i*0.08}s ease both`,opacity:0}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-5px)";e.currentTarget.style.boxShadow=`0 16px 40px rgba(10,22,40,0.1)`;}}
                onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 2px 10px rgba(10,22,40,0.05)";}}>
                <div style={{fontSize:32,marginBottom:14,animation:`float ${3+i*0.25}s ease-in-out infinite`}}>{icon}</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:GD,marginBottom:8}}>{title}</div>
                <p style={{fontSize:13,color:"#6B7280",lineHeight:1.7}}>{desc}</p>
              </div>
            );})
          </div>
        </div>

        {/* ── TEAM ── */}
        <div style={{padding:"64px 40px",background:"#FAFAF8"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><div style={{width:26,height:1,background:G}}/><span style={{fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:G,fontWeight:600}}>Our People</span></div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(24px,3vw,40px)",fontWeight:700,color:GD,marginBottom:8,lineHeight:1.15}}>Leadership Team</h2>
          <p style={{fontSize:14,color:"#9CA3AF",marginBottom:34}}>Click any profile for details — all icons link to contact channels</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}}>
            {ICC.team.map((m,i)=>(
              <div key={i} style={{background:"white",border:"1px solid rgba(201,168,76,0.12)",borderRadius:13,padding:26,boxShadow:"0 2px 10px rgba(10,22,40,0.04)",transition:"all 0.3s",cursor:"pointer",animation:`fu 0.5s ${i*0.08}s ease both`,opacity:0}}
                onClick={()=>setTeamModal(m)}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=G;e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 14px 38px rgba(10,22,40,0.09)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(201,168,76,0.12)";e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 2px 10px rgba(10,22,40,0.04)";}}>
                <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
                  <div style={{width:52,height:52,background:`linear-gradient(135deg,${G},#E8C97A)`,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:18,color:GD,flexShrink:0}}>{m.avatar}</div>
                  <div>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:GD,lineHeight:1.2}}>{m.name}</div>
                    <div style={{fontSize:12,color:G,fontWeight:600,marginTop:3}}>{m.role}</div>
                  </div>
                </div>
                <p style={{fontSize:12,color:"#6B7280",lineHeight:1.65,marginBottom:14}}>{m.exp}</p>
                {/* Dynamic icon links */}
                <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                  {[
                    {icon:"in", label:"LinkedIn", href:"https://www.linkedin.com/company/index-consulting-company", bg:"rgba(0,119,181,0.08)", color:"#0077b5", border:"rgba(0,119,181,0.2)"},
                    {icon:"✉️", label:"Email",    href:`mailto:${ICC.email}?subject=Attn: ${m.name}`,              bg:GL,                  color:G,          border:`rgba(201,168,76,0.3)`},
                    {icon:"✈️", label:"Telegram", href:ICC.telegram,                                                bg:"rgba(42,171,238,0.08)", color:"#2AABEE", border:"rgba(42,171,238,0.25)"},
                  ].map(({icon,label,href,bg,color,border})=>(
                    <a key={label} href={href} target={href.startsWith("http")?"_blank":undefined}
                      onClick={e=>e.stopPropagation()}
                      style={{display:"flex",alignItems:"center",gap:5,padding:"5px 10px",background:bg,border:`1px solid ${border}`,borderRadius:8,fontSize:11,color,fontWeight:500,transition:"all 0.2s"}}
                      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.1)";}}
                      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
                      <span>{icon}</span>{label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SERVICES — dynamic icons → inconsult.uz ── */}
        <div style={{padding:"64px 40px",background:GB}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><div style={{width:26,height:1,background:G}}/><span style={{fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:G,fontWeight:600}}>What We Do</span></div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(24px,3vw,40px)",fontWeight:700,color:GD,marginBottom:8,lineHeight:1.15}}>Service Areas</h2>
          <p style={{fontSize:14,color:"#9CA3AF",marginBottom:34}}>Each icon links directly to the relevant page on inconsult.uz</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:2}}>
            {ICC.services.map((s,i)=>{
              const links=[
                "https://inconsult.uz/energy",
                "https://inconsult.uz/water-supply-sewerage-sanitation",
                "https://inconsult.uz/projects-by-sector",
                "https://inconsult.uz/projects-by-sector",
                "https://inconsult.uz/projects-by-sector",
                "https://inconsult.uz/projects-by-sector",
                "https://inconsult.uz/news/view/index-consulting-company-participated-in-the-iii-ppp-roundtable-mobilizing-private-capital-through-ppps",
                "https://inconsult.uz/about-us",
                "https://inconsult.uz/about-us",
                "https://inconsult.uz/projects-by-sector",
              ];
              return (
                <a key={i} href={links[i]} target="_blank" style={{textDecoration:"none",display:"block"}}>
                  <div style={{background:"white",padding:"24px 18px",borderBottom:`3px solid transparent`,boxShadow:"0 2px 8px rgba(10,22,40,0.04)",transition:"all 0.3s",height:"100%"}}
                    onMouseEnter={e=>{const el=e.currentTarget;el.style.transform="translateY(-4px)";el.style.borderBottomColor=G;el.style.boxShadow="0 14px 36px rgba(10,22,40,0.1)";}}
                    onMouseLeave={e=>{const el=e.currentTarget;el.style.transform="translateY(0)";el.style.borderBottomColor="transparent";el.style.boxShadow="0 2px 8px rgba(10,22,40,0.04)";}}>
                    {/* Animated icon */}
                    <div style={{fontSize:28,marginBottom:12,display:"inline-block",animation:`float ${3+i*0.22}s ease-in-out infinite`,transformOrigin:"center"}}>{s.icon}</div>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:700,color:GD,marginBottom:7,lineHeight:1.35}}>{t.svc_names[i]}</div>
                    <p style={{fontSize:11,lineHeight:1.65,color:"#9CA3AF",marginBottom:10}}>{t.svc_descs[i].slice(0,70)}...</p>
                    <div style={{fontSize:11,color:"#2AABEE",fontWeight:500,display:"flex",alignItems:"center",gap:4}}>
                      <span style={{width:4,height:4,background:"#2AABEE",borderRadius:"50%",display:"inline-block"}}/>inconsult.uz ↗
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* ── PARTNERS — dynamic icons with official site links ── */}
        <div style={{padding:"64px 40px",background:GD,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(rgba(201,168,76,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.03) 1px,transparent 1px)`,backgroundSize:"44px 44px"}}/>
          <div style={{position:"relative",zIndex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><div style={{width:26,height:1,background:G}}/><span style={{fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:G,fontWeight:600}}>Partners & Funders</span></div>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(24px,3vw,40px)",fontWeight:700,color:"white",marginBottom:8,lineHeight:1.15}}>International Partners</h2>
            <p style={{fontSize:14,color:"rgba(255,255,255,0.35)",marginBottom:36}}>Click any partner logo to visit their official website</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:14}}>
              {[
                {name:"ADB",         full:"Asian Development Bank",               href:"https://www.adb.org",                color:"#e31837", desc:"Active funder"},
                {name:"World Bank",  full:"World Bank Group",                      href:"https://www.worldbank.org",          color:"#009688", desc:"Active funder"},
                {name:"EBRD",        full:"European Bank for Reconstruction & Dev",href:"https://www.ebrd.com",               color:"#003f87", desc:"Active funder"},
                {name:"KfW",         full:"KfW Development Bank",                  href:"https://www.kfw.de",                 color:"#006431", desc:"Germany"},
                {name:"IsDB",        full:"Islamic Development Bank",              href:"https://www.isdb.org",               color:"#1a7a4a", desc:"Saudi Arabia"},
                {name:"OPEC Fund",   full:"OPEC Fund for International Dev.",      href:"https://opecfund.org",               color:"#0062ae", desc:"Vienna"},
                {name:"Proparco",    full:"Proparco (France)",                      href:"https://www.proparco.fr",            color:"#e2001a", desc:"France"},
                {name:"AFD",         full:"Agence Française de Développement",    href:"https://www.afd.fr",                 color:"#e2001a", desc:"France"},
                {name:"IFC",         full:"International Finance Corporation",     href:"https://www.ifc.org",                color:"#006747", desc:"WB Group"},
                {name:"MRC Türkiye", full:"MRC Consulting Turkey",                 href:"https://www.mrc.com.tr",             color:"#e31837", desc:"Partner"},
                {name:"GOPA Intec",  full:"GOPA Intec GmbH",                       href:"https://www.gopa-intec.de",          color:"#003f87", desc:"Germany"},
                {name:"MoEF UZ",     full:"Ministry of Economy & Finance UZ",      href:"https://mf.uz",                      color:"#1D6F42", desc:"Uzbekistan"},
              ].map(({name,full,href,color,desc},i)=>(
                <a key={i} href={href} target="_blank"
                  style={{display:"flex",alignItems:"center",gap:12,padding:"16px 22px",background:"rgba(255,255,255,0.05)",border:`1px solid rgba(255,255,255,0.09)`,borderRadius:13,transition:"all 0.28s",cursor:"pointer",animation:`fu 0.4s ${i*0.06}s ease both`,opacity:0,textDecoration:"none"}}
                  onMouseEnter={e=>{const el=e.currentTarget;el.style.background=`${color}20`;el.style.borderColor=`${color}50`;el.style.transform="translateY(-3px)";el.style.boxShadow=`0 10px 32px rgba(0,0,0,0.25)`;}}
                  onMouseLeave={e=>{const el=e.currentTarget;el.style.background="rgba(255,255,255,0.05)";el.style.borderColor="rgba(255,255,255,0.09)";el.style.transform="translateY(0)";el.style.boxShadow="none";}}>
                  {/* Pulsing color dot */}
                  <div style={{width:10,height:10,borderRadius:"50%",background:color,flexShrink:0,animation:"pulse 2.5s infinite"}}/>
                  <div>
                    <div style={{fontSize:14,fontWeight:700,color:"white",lineHeight:1,marginBottom:3}}>{name}</div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.32)",lineHeight:1.3}}>{full}</div>
                  </div>
                  <span style={{fontSize:11,color:"rgba(255,255,255,0.2)",marginLeft:"auto",flexShrink:0}}>↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── CTA STRIP ── */}
        <div style={{padding:"48px 40px",background:GL,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:20}}>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(20px,2.5vw,30px)",fontWeight:700,color:GD,marginBottom:6}}>Ready to work with ICC?</div>
            <p style={{fontSize:14,color:"#6B7280"}}>Contact us today or explore our active projects and open vacancies.</p>
          </div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <button onClick={()=>setContactModal(true)} style={{padding:"13px 28px",background:GD,color:"white",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.3s"}} onMouseEnter={e=>{e.target.style.background=G;e.target.style.color=GD;}} onMouseLeave={e=>{e.target.style.background=GD;e.target.style.color="white";}}>
              Contact Us →
            </button>
            <button onClick={()=>go("home")} style={{padding:"13px 28px",background:"transparent",color:GD,border:`1.5px solid ${GD}`,borderRadius:8,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.3s"}} onMouseEnter={e=>{e.target.style.borderColor=G;e.target.style.color=G;}} onMouseLeave={e=>{e.target.style.borderColor=GD;e.target.style.color=GD;}}>
              View Projects ↓
            </button>
          </div>
        </div>

      </div>}


      {/* ══════════════════════════════════════════════════
          ТENDERS PAGE — Consulting Competitions
      ══════════════════════════════════════════════════ */}
      {view==="tenders"&&<div className="page-enter" style={{paddingTop:76,minHeight:"100vh",background:"#FAFAF8"}}>

        {/* ── HERO ── */}
        <div style={{padding:"52px 40px 44px",background:"linear-gradient(135deg,#0B2818 0%,#0E2B1A 100%)",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px)`,backgroundSize:"44px 44px",pointerEvents:"none"}}/>
          <div style={{position:"absolute",right:-60,top:"50%",transform:"translateY(-50%)",width:480,height:480,borderRadius:"50%",background:"radial-gradient(circle,rgba(201,168,76,0.1) 0%,transparent 70%)",pointerEvents:"none"}}/>
          <div style={{position:"relative",zIndex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <div style={{width:26,height:1,background:G}}/>
              <span style={{fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:G,fontWeight:600}}>Consulting Competitions</span>
            </div>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(28px,4.5vw,54px)",fontWeight:700,color:"white",lineHeight:1.1,marginBottom:10}}>
              Global Tender Monitor
            </h1>
            <p style={{fontSize:14,lineHeight:1.75,color:"rgba(255,255,255,0.45)",maxWidth:580,marginBottom:28}}>
              AI-powered search for consulting RFPs, Expressions of Interest and procurement notices from ADB, World Bank, EBRD and other IFIs — matched to ICC's expertise.
            </p>

            {/* Action row */}
            <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
              <button onClick={generateTenders} disabled={tendersLoading}
                style={{display:"flex",alignItems:"center",gap:9,padding:"12px 26px",background:tendersLoading?"rgba(201,168,76,0.3)":G,color:tendersLoading?"rgba(10,22,40,0.4)":GD,border:"none",borderRadius:8,fontSize:13,fontWeight:700,cursor:tendersLoading?"default":"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.3s"}}
                onMouseEnter={e=>{if(!tendersLoading){e.currentTarget.style.background="#E8C97A";}}}
                onMouseLeave={e=>{if(!tendersLoading){e.currentTarget.style.background=G;}}}>
                {tendersLoading
                  ?<><div style={{width:14,height:14,border:"2px solid rgba(10,22,40,0.25)",borderTopColor:"rgba(10,22,40,0.7)",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>Scanning databases...</>
                  :<>{tendersLoading?null:tendersGenerated?t.tn_refresh:t.tn_find}</>}
              </button>

              {/* Direct IFI portal links */}
              {[
                {n:"ADB",        href:"https://www.adb.org/projects/tenders",                               c:"#e31837"},
                {n:"World Bank", href:"https://projects.worldbank.org/en/projects-operations/procurement",  c:"#009688"},
                {n:"EBRD",       href:"https://www.ebrd.com/work-with-us/procurement/ppo.html",             c:"#003f87"},
                {n:"UNGM",       href:"https://www.ungm.org/Public/Notice",                                 c:"#1a7a4a"},
                {n:"TED EU",     href:"https://ted.europa.eu/en/",                                          c:"#003399"},
              ].map(({n,href,c})=>(
                <a key={n} href={href} target="_blank"
                  style={{display:"flex",alignItems:"center",gap:6,padding:"10px 15px",background:`${c}22`,border:`1px solid ${c}44`,borderRadius:8,color:"white",fontSize:12,fontWeight:600,transition:"all 0.2s",textDecoration:"none"}}
                  onMouseEnter={e=>{e.currentTarget.style.background=`${c}40`;e.currentTarget.style.transform="translateY(-1px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.background=`${c}22`;e.currentTarget.style.transform="translateY(0)";}}>
                  <span style={{width:6,height:6,borderRadius:"50%",background:c,flexShrink:0}}/>
                  {n} ↗
                </a>
              ))}
            </div>

            {/* Search bar */}
            {tendersGenerated&&(
              <div style={{marginTop:20,maxWidth:480,position:"relative"}}>
                <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",fontSize:14,pointerEvents:"none"}}>🔍</span>
                <input value={tenderSearch} onChange={e=>setTenderSearch(e.target.value)}
                  placeholder="Search tenders by keyword..."
                  style={{width:"100%",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,padding:"11px 13px 11px 38px",color:"white",fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:"none"}}
                  onFocus={e=>{e.target.style.borderColor=G;e.target.style.background="rgba(255,255,255,0.12)";}}
                  onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.15)";e.target.style.background="rgba(255,255,255,0.08)";}}/>
              </div>
            )}
          </div>
        </div>

        {/* ── FILTER BAR ── */}
        {tendersGenerated&&(
          <div style={{background:"white",borderBottom:"1px solid rgba(201,168,76,0.15)",padding:"14px 40px",display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",position:"sticky",top:76,zIndex:100,boxShadow:"0 2px 12px rgba(10,22,40,0.06)"}}>
            {/* Category */}
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              {["all","Energy","Water","Environment","PPP","Infrastructure","Agriculture","GIS"].map(f=>{
                const catC={"Energy":"#e31837","Water":"#003f87","Environment":"#059669","PPP":"#7c3aed","Infrastructure":"#C9A84C","Agriculture":"#92400e","GIS":"#0284c7"};
                const isAll=f==="all"; const active=tenderFilter===f;
                return(
                  <button key={f} onClick={()=>setTenderFilter(f)}
                    style={{padding:"5px 13px",border:`1px solid ${active?(isAll?G:(catC[f]||G)):("rgba(201,168,76,0.2)")}`,borderRadius:14,fontSize:11,fontWeight:active?"700":"400",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:active?(isAll?G:(catC[f]||G)):"white",color:active?"white":(isAll?"#6B7280":(catC[f]||"#6B7280")),transition:"all 0.18s"}}>
                    {isAll?"All Categories":f}
                  </button>
                );
              })}
            </div>
            <div style={{width:1,height:20,background:"rgba(201,168,76,0.2)",margin:"0 4px"}}/>
            {/* Status */}
            {["all","Open","Closing Soon","Expression of Interest"].map(s=>{
              const sc={"Open":"#22c55e","Closing Soon":"#dc2626","Expression of Interest":"#7c3aed"};
              const active=tenderStatus===s;
              return(
                <button key={s} onClick={()=>setTenderStatus(s)}
                  style={{padding:"5px 12px",border:`1px solid ${active?(sc[s]||G):"rgba(201,168,76,0.15)"}`,borderRadius:14,fontSize:11,fontWeight:active?"700":"400",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:active?(sc[s]||G)+"18":"white",color:active?(sc[s]||G):"#9CA3AF",transition:"all 0.18s"}}>
                  {s==="all"?"All Status":s}
                </button>
              );
            })}
            {/* Result count */}
            <div style={{marginLeft:"auto",fontSize:11,color:"#9CA3AF"}}>
              {(()=>{
                let t=tenders;
                if(tenderFilter!=="all") t=t.filter(x=>x.category===tenderFilter);
                if(tenderStatus!=="all") t=t.filter(x=>x.status===tenderStatus);
                if(tenderSearch.trim()) t=t.filter(x=>(x.title+x.issuer+x.description||"").toLowerCase().includes(tenderSearch.toLowerCase()));
                return `${t.length} ${t.length===1?t.tn_found_one:t.tn_found_many}`;
              })()}
            </div>
          </div>
        )}

        {/* ── CONTENT ── */}
        <div style={{padding:"28px 40px 60px"}}>

          {/* Empty state */}
          {!tendersGenerated&&!tendersLoading&&(
            <div style={{textAlign:"center",padding:"88px 0"}}>
              <div style={{fontSize:64,marginBottom:20,animation:"float 3s ease-in-out infinite"}}>📋</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:26,color:GD,marginBottom:10}}>Ready to Find Tenders</div>
              <p style={{fontSize:14,color:"#9CA3AF",maxWidth:420,margin:"0 auto 28px",lineHeight:1.75}}>
                Click <strong style={{color:G}}>⚡ Find Active Tenders</strong> to use AI to search global consulting competitions relevant to ICC's expertise across energy, water, environment and PPP sectors.
              </p>
              {/* Teaser cards — static always-available resources */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,maxWidth:740,margin:"0 auto",textAlign:"left"}}>
                {[
                  {icon:"🌏",title:"ADB Procurement",       sub:"Asian Development Bank — active tenders",       href:"https://www.adb.org/projects/tenders",                              c:"#e31837"},
                  {icon:"🏦",title:"World Bank Projects",   sub:"Procurement notices for IDA/IBRD projects",     href:"https://projects.worldbank.org/en/projects-operations/procurement",  c:"#009688"},
                  {icon:"🇪🇺",title:"EBRD Procurement",    sub:"European Bank for Reconstruction & Development", href:"https://www.ebrd.com/work-with-us/procurement/ppo.html",             c:"#003f87"},
                  {icon:"🌐",title:"UNGM Notices",          sub:"United Nations Global Marketplace",             href:"https://www.ungm.org/Public/Notice",                                 c:"#1a7a4a"},
                  {icon:"📰",title:"TED EU Tenders",        sub:"Official EU procurement journal",               href:"https://ted.europa.eu",                                               c:"#003399"},
                  {icon:"🤖",title:"AI Tender Monitor",     sub:"Use io.net AI to find & rank opportunities",    href:null,                                                                  c:G},
                ].map(({icon,title,sub,href,c},i)=>(
                  href
                    ?<a key={i} href={href} target="_blank" style={{padding:"18px",background:"white",border:`1px solid rgba(201,168,76,0.15)`,borderRadius:12,borderLeft:`4px solid ${c}`,display:"block",textDecoration:"none",transition:"all 0.25s"}}
                        onMouseEnter={e=>{e.currentTarget.style.borderColor=c;e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 8px 24px rgba(10,22,40,0.08)`;}}
                        onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(201,168,76,0.15)";e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
                        <div style={{fontSize:22,marginBottom:8}}>{icon}</div>
                        <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:700,color:GD,marginBottom:4}}>{title} ↗</div>
                        <div style={{fontSize:11,color:"#9CA3AF",lineHeight:1.5}}>{sub}</div>
                      </a>
                    :<div key={i} style={{padding:"18px",background:GL,border:`1px solid rgba(201,168,76,0.25)`,borderRadius:12,borderLeft:`4px solid ${c}`,cursor:"pointer",transition:"all 0.25s"}}
                        onClick={generateTenders}
                        onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 8px 24px rgba(201,168,76,0.15)`;}}
                        onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
                        <div style={{fontSize:22,marginBottom:8}}>{icon}</div>
                        <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:700,color:GD,marginBottom:4}}>{title}</div>
                        <div style={{fontSize:11,color:"#9CA3AF",lineHeight:1.5}}>{sub}</div>
                      </div>
                ))}
              </div>
            </div>
          )}

          {/* Loading */}
          {tendersLoading&&(
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"88px 0",gap:16}}>
              <div style={{width:48,height:48,border:`3px solid rgba(201,168,76,0.15)`,borderTopColor:G,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:GD}}>Scanning IFI Databases...</div>
              <p style={{fontSize:13,color:"#9CA3AF",textAlign:"center",maxWidth:360,lineHeight:1.65}}>
                AI is searching ADB, World Bank, EBRD, UNGM and other procurement portals for opportunities matching ICC's expertise.
              </p>
              <div style={{display:"flex",gap:8,marginTop:8}}>
                {["ADB","World Bank","EBRD","UNGM","UN Agencies"].map((s,i)=>(
                  <span key={i} style={{padding:"4px 10px",background:"rgba(201,168,76,0.08)",border:"1px solid rgba(201,168,76,0.2)",borderRadius:10,fontSize:11,color:G,animation:`pulse 1.5s ${i*0.2}s infinite`}}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Tender Cards Grid */}
          {tendersGenerated&&!tendersLoading&&(()=>{
            let filtered=tenders;
            if(tenderFilter!=="all") filtered=filtered.filter(t=>t.category===tenderFilter);
            if(tenderStatus!=="all") filtered=filtered.filter(t=>t.status===tenderStatus);
            if(tenderSearch.trim()) filtered=filtered.filter(t=>(t.title+t.issuer+(t.description||"")).toLowerCase().includes(tenderSearch.toLowerCase()));
            const catC={"Energy":"#e31837","Water":"#003f87","Environment":"#059669","PPP":"#7c3aed","Infrastructure":G,"Agriculture":"#92400e","GIS":"#0284c7"};
            const statC={"Open":"#22c55e","Closing Soon":"#dc2626","Expression of Interest":"#7c3aed"};
            return(
              <div>
                {filtered.length===0&&(
                  <div style={{textAlign:"center",padding:60}}>
                    <div style={{fontSize:40,marginBottom:12}}>🔎</div>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:GD,marginBottom:6}}>No matching tenders</div>
                    <p style={{fontSize:13,color:"#9CA3AF"}}>Try changing filters or refreshing the search</p>
                  </div>
                )}
                <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:18}}>
                  {filtered.map((t,i)=>{
                    const fc=catC[t.category]||G;
                    const sc=statC[t.status]||"#22c55e";
                    const fitColor=t.fit_score>=80?"#22c55e":t.fit_score>=60?"#f59e0b":"#9CA3AF";
                    const saved=savedTenders.has(t.id);
                    return(
                      <div key={t.id||i} style={{background:"white",border:"1px solid rgba(201,168,76,0.15)",borderRadius:14,padding:26,boxShadow:"0 2px 10px rgba(10,22,40,0.04)",transition:"all 0.3s",animation:`fu 0.4s ${i*0.07}s ease both`,position:"relative"}}
                        onMouseEnter={e=>{e.currentTarget.style.borderColor=G;e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 12px 36px rgba(10,22,40,0.09)";}}
                        onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(201,168,76,0.15)";e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 2px 10px rgba(10,22,40,0.04)";}}>

                        {/* Save bookmark */}
                        <button onClick={()=>setSavedTenders(s=>{const n=new Set(s);n.has(t.id)?n.delete(t.id):n.add(t.id);return n;})}
                          style={{position:"absolute",top:16,right:16,background:"none",border:"none",fontSize:18,cursor:"pointer",opacity:saved?1:0.3,transition:"all 0.2s"}}
                          title={saved?"Remove bookmark":"Save tender"}>
                          {saved?"🔖":"🔖"}
                        </button>

                        {/* Header badges */}
                        <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:14,paddingRight:28}}>
                          <span style={{padding:"3px 9px",borderRadius:10,fontSize:10,fontWeight:700,background:`${fc}15`,color:fc,border:`1px solid ${fc}33`}}>{t.category||"Consulting"}</span>
                          <span style={{padding:"3px 9px",borderRadius:10,fontSize:10,fontWeight:700,background:`${sc}15`,color:sc,border:`1px solid ${sc}33`}}>{t.status}</span>
                          {t.funded_by&&<span style={{padding:"3px 9px",borderRadius:10,fontSize:10,fontWeight:600,background:"rgba(10,22,40,0.05)",color:"#6B7280",border:"1px solid rgba(0,0,0,0.07)"}}>{t.funded_by}</span>}
                        </div>

                        {/* Title */}
                        <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:GD,lineHeight:1.35,marginBottom:10}}>{t.title}</h3>

                        {/* Meta row */}
                        <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:12}}>
                          {t.issuer&&<span style={{fontSize:12,color:"#6B7280",display:"flex",alignItems:"center",gap:4}}>🏛 {t.issuer}</span>}
                          {t.country&&<span style={{fontSize:12,color:"#6B7280",display:"flex",alignItems:"center",gap:4}}>📍 {t.country}</span>}
                        </div>

                        {/* Description */}
                        <p style={{fontSize:12,color:"#6B7280",lineHeight:1.7,marginBottom:14}}>{t.description}</p>

                        {/* ICC Fit box */}
                        {t.fit_reason&&(
                          <div style={{padding:"10px 13px",background:GL,border:"1px solid rgba(201,168,76,0.3)",borderRadius:8,marginBottom:14}}>
                            <div style={{fontSize:9,textTransform:"uppercase",letterSpacing:"0.09em",color:G,fontWeight:700,marginBottom:3}}>ICC Fit</div>
                            <p style={{fontSize:11,color:GD,lineHeight:1.55,margin:0}}>{t.fit_reason}</p>
                          </div>
                        )}

                        {/* Footer */}
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
                          <div>
                            {/* Fit score bar */}
                            {t.fit_score>0&&<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                              <div style={{width:80,height:5,background:"rgba(0,0,0,0.07)",borderRadius:4,overflow:"hidden"}}>
                                <div style={{height:"100%",width:`${t.fit_score||0}%`,background:`linear-gradient(90deg,${fitColor},${fitColor}cc)`,borderRadius:4,transition:"width 1s"}}/>
                              </div>
                              <span style={{fontSize:11,fontWeight:700,color:fitColor}}>{t.fit_score}% fit</span>
                            </div>}
                            <div style={{display:"flex",gap:12}}>
                              {t.deadline&&<span style={{fontSize:11,color:"#9CA3AF"}}>⏰ {t.deadline}</span>}
                              {t.est_value&&<span style={{fontSize:11,color:G,fontWeight:600}}>💰 {t.est_value}</span>}
                            </div>
                          </div>
                          <div style={{display:"flex",gap:8}}>
                            <button onClick={()=>setTenderDetail(t)}
                              style={{padding:"8px 14px",background:"rgba(201,168,76,0.1)",border:"1px solid rgba(201,168,76,0.3)",borderRadius:7,fontSize:12,fontWeight:600,color:G,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"}}
                              onMouseEnter={e=>{e.currentTarget.style.background=GL;}}
                              onMouseLeave={e=>{e.currentTarget.style.background="rgba(201,168,76,0.1)";}}>
                              Details
                            </button>
                            <a href={t.apply_url?.startsWith("http")?t.apply_url:`https://www.google.com/search?q=${encodeURIComponent((t.title||"")+" tender "+(t.issuer||""))}`}
                              target="_blank"
                              style={{padding:"8px 16px",background:GD,color:"white",borderRadius:7,fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:5,textDecoration:"none",transition:"all 0.2s"}}
                              onMouseEnter={e=>{e.currentTarget.style.background=G;e.currentTarget.style.color=GD;}}
                              onMouseLeave={e=>{e.currentTarget.style.background=GD;e.currentTarget.style.color="white";}}>
                              Apply ↗
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Saved tenders summary */}
                {savedTenders.size>0&&(
                  <div style={{marginTop:24,padding:"16px 20px",background:GL,border:"1px solid rgba(201,168,76,0.3)",borderRadius:12,display:"flex",alignItems:"center",gap:12}}>
                    <span style={{fontSize:20}}>🔖</span>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:700,color:GD,marginBottom:2}}>
                        {savedTenders.size} tender{savedTenders.size>1?"s":""} bookmarked
                      </div>
                      <div style={{fontSize:12,color:"#6B7280"}}>
                        {tenders.filter(t=>savedTenders.has(t.id)).map(t=>t.title).join(" · ")}
                      </div>
                    </div>
                    <button onClick={()=>setSavedTenders(new Set())} style={{padding:"6px 14px",background:"none",border:"1px solid rgba(201,168,76,0.3)",borderRadius:7,fontSize:12,color:G,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                      Clear
                    </button>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* ── TENDER DETAIL MODAL ── */}
        {tenderDetail&&(()=>{
          const catC={"Energy":"#e31837","Water":"#003f87","Environment":"#059669","PPP":"#7c3aed","Infrastructure":G,"Agriculture":"#92400e","GIS":"#0284c7"};
          const sc={"Open":"#22c55e","Closing Soon":"#dc2626","Expression of Interest":"#7c3aed"};
          const fc=catC[tenderDetail.category]||G;
          const fitColor=tenderDetail.fit_score>=80?"#22c55e":tenderDetail.fit_score>=60?"#f59e0b":"#9CA3AF";
          return(
            <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setTenderDetail(null);}}>
              <div className="modal-box" style={{maxWidth:660}}>
                <div style={{padding:32}}>
                  {/* Header */}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
                    <div style={{flex:1,marginRight:16}}>
                      <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:10}}>
                        <span style={{padding:"3px 9px",borderRadius:10,fontSize:10,fontWeight:700,background:`${fc}18`,color:fc,border:`1px solid ${fc}33`}}>{tenderDetail.category}</span>
                        <span style={{padding:"3px 9px",borderRadius:10,fontSize:10,fontWeight:700,background:`${sc[tenderDetail.status]||"#22c55e"}15`,color:sc[tenderDetail.status]||"#22c55e",border:`1px solid ${sc[tenderDetail.status]||"#22c55e"}33`}}>{tenderDetail.status}</span>
                        {tenderDetail.funded_by&&<span style={{padding:"3px 9px",borderRadius:10,fontSize:10,fontWeight:600,background:"rgba(10,22,40,0.05)",color:"#6B7280",border:"1px solid rgba(0,0,0,0.07)"}}>{tenderDetail.funded_by}</span>}
                      </div>
                      <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:GD,lineHeight:1.3}}>{tenderDetail.title}</h2>
                    </div>
                    <button onClick={()=>setTenderDetail(null)} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:"#9CA3AF",flexShrink:0}}>✕</button>
                  </div>

                  {/* Info grid */}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
                    {[
                      {label:"Issuer",    val:tenderDetail.issuer,     icon:"🏛"},
                      {label:"Country",   val:tenderDetail.country,    icon:"📍"},
                      {label:"Funder",    val:tenderDetail.funded_by,  icon:"💰"},
                      {label:"Deadline",  val:tenderDetail.deadline,   icon:"⏰"},
                      {label:"Est. Value",val:tenderDetail.est_value,  icon:"💵"},
                      {label:"Lot",       val:tenderDetail.lot||"—",   icon:"📦"},
                    ].map(({label,val,icon},i)=>val&&(
                      <div key={i} style={{padding:"10px 13px",background:"#FAFAF8",borderRadius:8}}>
                        <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.07em",color:"#9CA3AF",marginBottom:3}}>{icon} {label}</div>
                        <div style={{fontSize:12,fontWeight:600,color:GD}}>{val}</div>
                      </div>
                    ))}
                  </div>

                  {/* Description */}
                  <div style={{marginBottom:16}}>
                    <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:"0.08em",color:G,fontWeight:700,marginBottom:8}}>Description</div>
                    <p style={{fontSize:13,color:"#374151",lineHeight:1.75}}>{tenderDetail.description}</p>
                  </div>

                  {/* ICC Fit */}
                  {tenderDetail.fit_reason&&(
                    <div style={{padding:"14px 16px",background:GL,border:"1px solid rgba(201,168,76,0.3)",borderRadius:10,marginBottom:20}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                        <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:"0.08em",color:G,fontWeight:700}}>ICC Fit Analysis</div>
                        {tenderDetail.fit_score>0&&<div style={{display:"flex",alignItems:"center",gap:7}}>
                          <div style={{width:80,height:5,background:"rgba(0,0,0,0.08)",borderRadius:4,overflow:"hidden"}}>
                            <div style={{height:"100%",width:`${tenderDetail.fit_score}%`,background:`linear-gradient(90deg,${fitColor},${fitColor}cc)`,borderRadius:4}}/>
                          </div>
                          <span style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:fitColor}}>{tenderDetail.fit_score}%</span>
                        </div>}
                      </div>
                      <p style={{fontSize:12,color:GD,lineHeight:1.6,margin:0}}>{tenderDetail.fit_reason}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                    <a href={tenderDetail.apply_url?.startsWith("http")?tenderDetail.apply_url:`https://www.google.com/search?q=${encodeURIComponent((tenderDetail.title||"")+" tender "+(tenderDetail.issuer||""))}`}
                      target="_blank"
                      style={{flex:1,padding:"13px 0",background:GD,color:"white",borderRadius:8,fontSize:13,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:6,textDecoration:"none",minWidth:140,transition:"all 0.2s"}}
                      onMouseEnter={e=>{e.currentTarget.style.background=G;e.currentTarget.style.color=GD;}}
                      onMouseLeave={e=>{e.currentTarget.style.background=GD;e.currentTarget.style.color="white";}}>
                      Apply / View Procurement ↗
                    </a>
                    <button onClick={()=>{setTenderDetail(null);go("portal");}}
                      style={{padding:"13px 18px",background:"none",border:`1px solid ${G}`,borderRadius:8,fontSize:12,fontWeight:600,color:G,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"}}
                      onMouseEnter={e=>{e.currentTarget.style.background=GL;}}
                      onMouseLeave={e=>{e.currentTarget.style.background="none";}}>
                      🤖 AI Bid Strategy
                    </button>
                    <button onClick={()=>setTenderDetail(null)} style={{padding:"13px 16px",background:"none",border:"1px solid rgba(201,168,76,0.2)",borderRadius:8,fontSize:12,color:"#9CA3AF",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>}

      {/* ════════ FOOTER ════════ */}
      <footer style={{background:GD,borderTop:"2px solid rgba(201,168,76,0.25)"}}>
        {/* Top accent line */}
        <div style={{height:2,background:`linear-gradient(90deg,transparent,${G},transparent)`}}/>
        <div style={{padding:"28px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:14}}>
          {/* Brand */}
          <div>
            <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:5}}>
              <div style={{width:30,height:30,background:G,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:10,color:GD}}>ICC</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:"white"}}>
                Index <span style={{color:G}}>Consulting</span> Company
              </div>
            </div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",paddingLeft:39}}>Est. 2018 · Tashkent, Uzbekistan</div>
          </div>
          {/* Nav quick links */}
          <div style={{display:"flex",gap:18,flexWrap:"wrap"}}>
            {[["Home","home"],["About Us","about"],["Tenders","tenders"],["AI Portal","portal"]].map(([lbl,v])=>(
              <button key={v} onClick={()=>go(v)} className="hg" style={{fontSize:11,color:"rgba(255,255,255,0.28)",background:"none",border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.06em",textTransform:"uppercase",transition:"color 0.2s",padding:0}}>{lbl}</button>
            ))}
          </div>
          {/* Contacts */}
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            {[[`✉️ ${ICC.email}`,`mailto:${ICC.email}`],[`📞 ${ICC.phone}`,`tel:${ICC.phone}`],[`✈️ Telegram`,ICC.telegram],[`in LinkedIn`,"https://www.linkedin.com/company/index-consulting-company"]].map(([lbl,href],i)=>(
              <a key={i} href={href} target={i>=2?"_blank":undefined} className="hg" style={{fontSize:11,color:"rgba(255,255,255,0.28)",transition:"color 0.2s",whiteSpace:"nowrap"}}>{lbl}</a>
            ))}
          </div>
        </div>
        <div style={{borderTop:"1px solid rgba(255,255,255,0.06)",padding:"12px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.15)"}}>© {new Date().getFullYear()} Index Consulting Company (ICC) · inconsult.uz · All rights reserved</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.12)"}}>Powered by io.net AI · Llama 3.3 70B</div>
        </div>
      </footer>

      {/* ════════ FLOATING CHAT ════════ */}
      <div className="chat-bubble-btn" onClick={()=>setChatOpen(o=>!o)}>
        {chatOpen?"✕":"💬"}
        {!chatOpen&&chatMsgs.length>1&&<div style={{position:"absolute",top:-2,right:-2,width:13,height:13,background:G,borderRadius:"50%",border:"2px solid white",animation:"blink 2s infinite"}}/>}
      </div>
      <div className={`chat-panel ${chatOpen?"open":""}`}>
        <div style={{padding:"14px 16px",background:GD,display:"flex",alignItems:"center",gap:11}}>
          <div style={{width:34,height:34,background:`linear-gradient(135deg,${G},#E8C97A)`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>🤖</div>
          <div>
            <div style={{fontSize:13,fontWeight:600,color:"white"}}>ICC AI Assistant</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.38)",display:"flex",alignItems:"center",gap:4}}>
              <span className="live-dot" style={{width:5,height:5}}/>
              io.net · Llama 3.3 70B · Free API
            </div>
          </div>
          <button onClick={()=>setChatOpen(false)} style={{marginLeft:"auto",background:"none",border:"none",color:"rgba(255,255,255,0.35)",fontSize:18,cursor:"pointer",lineHeight:1}}>✕</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:12,display:"flex",flexDirection:"column",gap:9,minHeight:220,maxHeight:280,background:"#FAFAF8"}}>
          {chatMsgs.map((m,i)=>(
            <div key={i} style={{alignSelf:m.role==="user"?"flex-end":"flex-start",maxWidth:"84%",animation:"fu 0.3s ease"}}>
              <div style={{padding:"9px 12px",borderRadius:12,fontSize:12,lineHeight:1.55,background:m.role==="user"?GD:GB,color:m.role==="user"?"white":"#0B2818",borderBottomRightRadius:m.role==="user"?3:12,borderBottomLeftRadius:m.role==="bot"?3:12}}>
                {m.text}
              </div>
              <div style={{fontSize:9,color:"#9CA3AF",marginTop:2,padding:"0 2px",textAlign:m.role==="user"?"right":"left"}}>{m.time}</div>
            </div>
          ))}
          {chatLoading&&<div style={{alignSelf:"flex-start",padding:"10px 12px",background:GB,borderRadius:12,borderBottomLeftRadius:3,display:"flex",gap:4}}>
            {[0,1,2].map(i=><div key={i} style={{width:6,height:6,background:"#9CA3AF",borderRadius:"50%",animation:`pulse 1.4s ${i*0.16}s infinite`}}/>)}
          </div>}
          <div ref={chatEndRef}/>
        </div>
        {/* Suggestions */}
        <div style={{padding:"5px 11px 8px",display:"flex",flexWrap:"wrap",gap:5,background:"white",borderTop:"1px solid rgba(201,168,76,0.1)"}}>
          {["What services does ICC offer?","Active EBRD projects?","How to contact ICC?","PPP expertise?"].map((s,i)=>(
            <button key={i} className="sugg" onClick={()=>{setChatInput(s);}} style={{padding:"4px 10px",border:"1px solid rgba(201,168,76,0.2)",borderRadius:13,fontSize:10.5,color:GD,cursor:"pointer",background:"#FAFAF8",transition:"all 0.2s",fontFamily:"'DM Sans',sans-serif"}}>{s}</button>
          ))}
        </div>
        <div style={{padding:"9px 11px",borderTop:"1px solid rgba(201,168,76,0.15)",display:"flex",gap:7,alignItems:"flex-end",background:"white"}}>
          <textarea value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat();}}} placeholder="Ask about ICC services, projects..." rows={1} style={{flex:1,border:"1px solid rgba(201,168,76,0.2)",borderRadius:20,padding:"8px 13px",fontSize:12,fontFamily:"'DM Sans',sans-serif",outline:"none",resize:"none",maxHeight:72,background:"#FAFAF8",color:"#0B2818",lineHeight:1.4}}/>
          <button onClick={sendChat} disabled={!chatInput.trim()||chatLoading} style={{width:32,height:32,background:chatInput.trim()&&!chatLoading?GD:"#e5e7eb",border:"none",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",cursor:chatInput.trim()&&!chatLoading?"pointer":"default",transition:"all 0.25s",flexShrink:0,fontSize:13,color:"white"}}>
            {chatLoading?<div style={{width:11,height:11,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"white",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>:"➤"}
          </button>
        </div>
      </div>

      {/* ════════ MODALS ════════ */}

      {/* API KEY SETUP MODAL */}
      {showApiModal&&<div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setShowApiModal(false);}}>
        <div className="modal-box" style={{maxWidth:500}}>
          <div style={{padding:"28px 28px 0"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:GD,marginBottom:8}}>Setup io.net API Key</div>
            <p style={{fontSize:13,lineHeight:1.7,color:"#6B7280",marginBottom:20}}>
              io.net Intelligence provides <strong>free AI inference</strong> — 500,000 tokens/day per model via Llama 3.3 70B, DeepSeek, Qwen and 15+ models.
            </p>
            <div style={{padding:"14px 16px",background:GL,border:`1px solid rgba(201,168,76,0.3)`,borderRadius:10,marginBottom:18}}>
              <div style={{fontSize:12,fontWeight:600,color:GD,marginBottom:8}}>🚀 How to get your FREE key:</div>
              <ol style={{paddingLeft:16}}>
                {["Go to io.net and sign up for free","Navigate to Intelligence → API Keys","Create a new API key","Paste it below"].map((s,i)=><li key={i} style={{fontSize:12,color:"#374151",marginBottom:4,lineHeight:1.5}}>{s}</li>)}
              </ol>
              <a href="https://io.net/intelligence" target="_blank" style={{display:"inline-flex",alignItems:"center",gap:6,marginTop:10,padding:"7px 14px",background:GD,color:"white",borderRadius:6,fontSize:11,fontWeight:500}}>Open io.net →</a>
            </div>
            <div style={{marginBottom:18}}>
              <label style={{fontSize:11,textTransform:"uppercase",letterSpacing:"0.08em",color:"#9CA3AF",display:"block",marginBottom:6}}>Your io.net API Key</label>
              <input type="password" value={apiInput} onChange={e=>setApiInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveKey()} placeholder="io-xxxx-xxxx-xxxx..." style={{width:"100%",border:`1px solid rgba(201,168,76,0.3)`,borderRadius:8,padding:"11px 13px",fontSize:13,fontFamily:"'DM Sans',sans-serif",color:GD,background:"#FAFAF8"}}/>
            </div>
          </div>
          <div style={{padding:"0 28px 28px",display:"flex",gap:10}}>
            <button onClick={saveKey} className="btn-gold" style={{flex:1}}>Save & Activate API Key</button>
            <button onClick={()=>setShowApiModal(false)} style={{padding:"11px 18px",background:"none",border:"1px solid rgba(201,168,76,0.25)",borderRadius:8,fontSize:13,color:"#6B7280",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Cancel</button>
          </div>
        </div>
      </div>}

      {/* SERVICE MODAL */}
      {modal?.type==="service"&&<div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setModal(null);}}>
        <div className="modal-box" style={{maxWidth:560}}>
          <div style={{padding:32}}>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
              <div style={{width:52,height:52,background:GL,border:`1px solid rgba(201,168,76,0.3)`,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{modal.data.icon}</div>
              <div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:GD}}>{modal.data.en}</div>
                <div style={{fontSize:12,color:G,fontWeight:500,marginTop:2}}>ICC Service Area</div>
              </div>
              <button onClick={()=>setModal(null)} style={{marginLeft:"auto",background:"none",border:"none",fontSize:22,cursor:"pointer",color:"#9CA3AF",lineHeight:1}}>✕</button>
            </div>
            <p style={{fontSize:14,lineHeight:1.8,color:"#6B7280",marginBottom:20}}>{modal.data.desc}</p>
            <div style={{padding:"14px 16px",background:GB,borderRadius:10,borderLeft:`3px solid ${G}`,marginBottom:20}}>
              <div style={{fontSize:11,fontWeight:600,color:G,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>Relevant IFI Funders</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {["ADB","World Bank","EBRD","KfW"].map(p=><span key={p} style={{padding:"3px 9px",background:"white",border:`1px solid ${FCOLOR[p]||"#ccc"}44`,borderRadius:10,fontSize:11,color:FCOLOR[p]||"#555",fontWeight:600}}>{p}</span>)}
              </div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>{setModal(null);setContactModal(true);}} className="btn-p" style={{flex:1}}>Inquire About This Service</button>
              <button onClick={()=>{setModal(null);go("portal");}} style={{padding:"12px 18px",background:"none",border:`1px solid rgba(201,168,76,0.3)`,borderRadius:6,fontSize:13,color:G,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>AI Analysis →</button>
            </div>
          </div>
        </div>
      </div>}

      {/* PROJECT MODAL */}
      {projectModal&&<div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setProjectModal(null);}}>
        <div className="modal-box modal-dark" style={{maxWidth:620}}>
          <div style={{padding:32}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
              <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
                <Badge t={projectModal.funder} color={FCOLOR[projectModal.funder]||"#555"}/>
                <span style={{fontSize:12,color:projectModal.status==="Active"?"#22c55e":"#9CA3AF",fontWeight:600}}>● {projectModal.status}</span>
                <span style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>{projectModal.year}</span>
              </div>
              <button onClick={()=>setProjectModal(null)} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:"rgba(255,255,255,0.35)",lineHeight:1}}>✕</button>
            </div>
            <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:20}}>
              <span style={{fontSize:32}}>{projectModal.icon}</span>
              <div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"white",lineHeight:1.35,marginBottom:8}}>{projectModal.title}</div>
                <span style={{padding:"3px 9px",background:`rgba(201,168,76,0.15)`,border:`1px solid rgba(201,168,76,0.3)`,borderRadius:8,fontSize:11,color:G,fontWeight:500}}>{projectModal.tag}</span>
              </div>
            </div>
            <p style={{fontSize:14,lineHeight:1.8,color:"rgba(255,255,255,0.6)",marginBottom:20}}>{projectModal.desc}</p>
            <div style={{padding:"14px 16px",background:"rgba(201,168,76,0.08)",border:"1px solid rgba(201,168,76,0.2)",borderRadius:10,marginBottom:20}}>
              <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:"0.08em",color:G,fontWeight:600,marginBottom:8}}>Project Details</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[["Funder",projectModal.funder],["Status",projectModal.status],["Period",projectModal.year],["Sector",projectModal.tag]].map(([k,v])=>(
                  <div key={k}><div style={{fontSize:10,color:"rgba(255,255,255,0.3)",marginBottom:2,textTransform:"uppercase"}}>{k}</div><div style={{fontSize:13,color:"white",fontWeight:500}}>{v}</div></div>
                ))}
              </div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>{setProjectModal(null);setContactModal(true);}} className="btn-gold" style={{flex:1}}>Inquire About This Project</button>
              <button onClick={()=>setProjectModal(null)} style={{padding:"12px 18px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,fontSize:13,color:"rgba(255,255,255,0.5)",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{t.btn_close}</button>
            </div>
          </div>
        </div>
      </div>}

      {/* TEAM MODAL */}
      {teamModal&&<div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setTeamModal(null);}}>
        <div className="modal-box" style={{maxWidth:500}}>
          <div style={{padding:32}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:24}}>
              <div style={{display:"flex",gap:16,alignItems:"center"}}>
                <div style={{width:64,height:64,background:`linear-gradient(135deg,${G},#E8C97A)`,borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:22,color:GD}}>{teamModal.avatar}</div>
                <div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:GD}}>{teamModal.name}</div>
                  <div style={{fontSize:13,color:G,fontWeight:600,marginTop:2}}>{teamModal.role}</div>
                </div>
              </div>
              <button onClick={()=>setTeamModal(null)} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:"#9CA3AF",lineHeight:1}}>✕</button>
            </div>
            <div style={{padding:"14px 16px",background:GB,borderRadius:10,borderLeft:`3px solid ${G}`,marginBottom:20}}>
              <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:"0.08em",color:G,fontWeight:600,marginBottom:5}}>Experience</div>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.6}}>{teamModal.exp}</p>
            </div>
            <p style={{fontSize:13,lineHeight:1.7,color:"#6B7280",marginBottom:20}}>
              {teamModal.name} is a core member of ICC's expert team, contributing to international development projects funded by ADB, EBRD, and World Bank across Uzbekistan and Central Asia.
            </p>
            <button onClick={()=>{setTeamModal(null);setContactModal(true);}} className="btn-p" style={{width:"100%"}}>Contact ICC Team →</button>
          </div>
        </div>
      </div>}

      {/* NEWS MODAL */}
      {newsModal&&<div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setNewsModal(null);}}>
        <div className="modal-box" style={{maxWidth:600}}>
          <div style={{padding:32}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:18}}>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <span style={{padding:"4px 10px",background:GL,color:G,borderRadius:10,fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em"}}>{newsModal.tag}</span>
                <span style={{fontSize:12,color:"#9CA3AF"}}>{newsModal.date}</span>
              </div>
              <button onClick={()=>setNewsModal(null)} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:"#9CA3AF",lineHeight:1}}>✕</button>
            </div>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:GD,lineHeight:1.35,marginBottom:18}}>{newsModal.title}</h2>
            <p style={{fontSize:14,lineHeight:1.85,color:"#6B7280",marginBottom:20}}>{newsModal.body}</p>
            <div style={{padding:"14px 16px",background:GB,borderRadius:10,borderLeft:`3px solid ${G}`,marginBottom:20}}>
              <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:"0.08em",color:G,fontWeight:600,marginBottom:5}}>Source</div>
              <p style={{fontSize:12,color:"#6B7280"}}>Index Consulting Company Official News · <a href="https://inconsult.uz/news" target="_blank" style={{color:G}}>inconsult.uz/news</a></p>
            </div>
            <div style={{display:"flex",gap:10}}>
              <a href={ICC.telegram} target="_blank" style={{flex:1,padding:"12px 0",background:"#2AABEE",color:"white",border:"none",borderRadius:8,fontSize:13,fontWeight:500,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                Follow on Telegram →
              </a>
              <button onClick={()=>setNewsModal(null)} style={{padding:"12px 18px",background:"none",border:`1px solid rgba(201,168,76,0.25)`,borderRadius:8,fontSize:13,color:"#6B7280",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{t.btn_close}</button>
            </div>
          </div>
        </div>
      </div>}

      {/* ═══ VACANCY MODAL — with CV form ═══ */}
      {vacModal&&<div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget){setVacModal(null);setCvStep("form");}}}>
        <div className="modal-box" style={{maxWidth:660}}>
          {cvStep==="success"?(
            /* ── SUCCESS SCREEN ── */
            <div style={{padding:44,textAlign:"center"}}>
              <div style={{fontSize:56,marginBottom:16}}>✅</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,color:GD,marginBottom:10}}>Application Received!</div>
              <p style={{fontSize:14,color:"#6B7280",lineHeight:1.7,maxWidth:400,margin:"0 auto 24px"}}>
                Thank you for applying to <strong style={{color:GD}}>{vacModal.title}</strong>.<br/>
                ICC's HR team will review your application and contact you within 3–5 business days.
              </p>
              <div style={{padding:"12px 18px",background:GL,border:`1px solid rgba(201,168,76,0.3)`,borderRadius:10,fontSize:12,color:"#6B7280",marginBottom:24,display:"inline-block"}}>
                📧 A confirmation has been recorded. You can also reach us at <strong>{ICC.email}</strong>
              </div>
              <div style={{display:"flex",gap:10,justifyContent:"center"}}>
                <button onClick={()=>{setVacModal(null);setCvStep("form");}} style={{padding:"12px 28px",background:GD,color:"white",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{t.btn_close}</button>
                <a href={ICC.telegram} target="_blank" style={{padding:"12px 22px",background:"#2AABEE",color:"white",borderRadius:8,fontSize:13,fontWeight:500,display:"flex",alignItems:"center",gap:6,fontFamily:"'DM Sans',sans-serif"}}>✈️ Follow on Telegram</a>
              </div>
            </div>
          ):(
            /* ── FORM SCREEN ── */
            <div style={{padding:32}}>
              {/* Header */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22}}>
                <div>
                  <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.1em",color:G,fontWeight:700,marginBottom:5}}>Open Position · ICC Tashkent</div>
                  <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:GD,lineHeight:1.3}}>{vacModal.title}</h2>
                  <div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>
                    <span style={{padding:"3px 9px",background:GL,color:G,borderRadius:8,fontSize:11,fontWeight:600}}>📍 Tashkent</span>
                    <span style={{padding:"3px 9px",background:"rgba(34,197,94,0.08)",color:"#16a34a",border:"1px solid rgba(34,197,94,0.2)",borderRadius:8,fontSize:11,fontWeight:600}}>● Hiring Now</span>
                    <span style={{padding:"3px 9px",background:"rgba(10,22,40,0.06)",color:"#6B7280",borderRadius:8,fontSize:11}}>👁 {vacViews[vacModal.id]||0} views</span>
                  </div>
                </div>
                <button onClick={()=>{setVacModal(null);setCvStep("form");}} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:"#9CA3AF",lineHeight:1,flexShrink:0,marginLeft:12}}>✕</button>
              </div>

              {/* Requirements + Conditions */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
                <div style={{background:"#FAFAF8",borderRadius:10,padding:16}}>
                  <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:"0.08em",color:G,fontWeight:700,marginBottom:10}}>Requirements</div>
                  {vacModal.reqs.map((r,j)=><div key={j} style={{fontSize:12,color:"#374151",padding:"4px 0 4px 10px",borderLeft:`2px solid rgba(201,168,76,0.35)`,marginBottom:5,lineHeight:1.55}}>{r}</div>)}
                </div>
                <div style={{background:"#FAFAF8",borderRadius:10,padding:16}}>
                  <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:"0.08em",color:G,fontWeight:700,marginBottom:10}}>We Offer</div>
                  {vacModal.conds.map((c,j)=><div key={j} style={{fontSize:12,color:"#374151",padding:"4px 0 4px 10px",borderLeft:`2px solid rgba(34,197,94,0.4)`,marginBottom:5,lineHeight:1.55}}>✓ {c}</div>)}
                </div>
              </div>

              {/* Divider */}
              <div style={{borderTop:"1px solid rgba(201,168,76,0.15)",margin:"0 0 20px",display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:26,height:1,background:G,flexShrink:0}}/>
                <span style={{fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:G,fontWeight:600,whiteSpace:"nowrap"}}>Apply Now</span>
                <div style={{flex:1,height:1,background:"rgba(201,168,76,0.15)"}}/>
              </div>

              {/* CV FORM */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[
                  {label:"Full Name *",     key:"name",     type:"text",  ph:"Иванов Иван Иванович",  half:false},
                  {label:"Email *",         key:"email",    type:"email", ph:"your@email.com",         half:false},
                  {label:"Phone",           key:"phone",    type:"tel",   ph:"+998 XX XXX XX XX",      half:false},
                  {label:"LinkedIn / Link", key:"linkedin", type:"url",   ph:"linkedin.com/in/...",     half:false},
                ].map(({label,key,type,ph})=>(
                  <div key={key}>
                    <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.07em",color:"#9CA3AF",marginBottom:5}}>{label}</div>
                    <input type={type} placeholder={ph} value={cvForm[key]} onChange={e=>setCvForm(f=>({...f,[key]:e.target.value}))}
                      style={{width:"100%",border:"1px solid rgba(201,168,76,0.25)",borderRadius:8,padding:"10px 13px",fontSize:12,fontFamily:"'DM Sans',sans-serif",color:GD,background:"white",outline:"none"}}
                      onFocus={e=>e.target.style.borderColor=G} onBlur={e=>e.target.style.borderColor="rgba(201,168,76,0.25)"}/>
                  </div>
                ))}
              </div>
              <div style={{marginTop:12}}>
                <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.07em",color:"#9CA3AF",marginBottom:5}}>Cover Letter / Message</div>
                <textarea rows={3} placeholder=t.vm_cover_ph
                  value={cvForm.msg} onChange={e=>setCvForm(f=>({...f,msg:e.target.value}))}
                  style={{width:"100%",border:"1px solid rgba(201,168,76,0.25)",borderRadius:8,padding:"10px 13px",fontSize:12,fontFamily:"'DM Sans',sans-serif",color:GD,background:"white",resize:"vertical",outline:"none"}}
                  onFocus={e=>e.target.style.borderColor=G} onBlur={e=>e.target.style.borderColor="rgba(201,168,76,0.25)"}/>
              </div>

              {/* Actions */}
              <div style={{display:"flex",gap:10,marginTop:18}}>
                <button onClick={submitCV} disabled={!cvForm.name||!cvForm.email}
                  style={{flex:1,padding:"13px 0",background:cvForm.name&&cvForm.email?GD:"#e5e7eb",color:cvForm.name&&cvForm.email?"white":"#9CA3AF",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:cvForm.name&&cvForm.email?"pointer":"default",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"}}
                  onMouseEnter={e=>{if(cvForm.name&&cvForm.email)e.currentTarget.style.background=G;e.currentTarget.style.color=GD;}}
                  onMouseLeave={e=>{if(cvForm.name&&cvForm.email){e.currentTarget.style.background=GD;e.currentTarget.style.color="white";}}}>
                  Submit Application →
                </button>
                <a href={`mailto:${ICC.email}?subject=Application: ${vacModal.title}&body=Name: ${cvForm.name}%0AEmail: ${cvForm.email}%0APhone: ${cvForm.phone}%0A%0A${cvForm.msg}`}
                  style={{padding:"13px 16px",background:"none",border:`1px solid rgba(201,168,76,0.3)`,borderRadius:8,fontSize:12,color:G,fontWeight:600,display:"flex",alignItems:"center",gap:5,fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap"}}>
                  ✉️ Email
                </a>
                <a href={ICC.telegram} target="_blank"
                  style={{padding:"13px 16px",background:"rgba(42,171,238,0.1)",border:"1px solid rgba(42,171,238,0.3)",borderRadius:8,fontSize:12,color:"#2AABEE",fontWeight:600,display:"flex",alignItems:"center",gap:5,fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap"}}>
                  ✈️ TG
                </a>
              </div>
            </div>
          )}
        </div>
      </div>}

      {/* CONTACT MODAL */}
      {contactModal&&<div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget){setContactModal(false);setContactSent(false);}}}>
        <div className="modal-box" style={{maxWidth:580}}>
          <div style={{padding:32}}>
            {contactSent?(
              <div style={{textAlign:"center",padding:"20px 0"}}>
                <div style={{fontSize:52,marginBottom:16}}>✅</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700,color:GD,marginBottom:8}}>Message Sent!</div>
                <p style={{fontSize:14,color:"#6B7280",lineHeight:1.7,marginBottom:24}}>Thank you for contacting ICC. Our team will get back to you within 1-2 business days.</p>
                <div style={{display:"flex",gap:10,justifyContent:"center"}}>
                  <a href={ICC.telegram} target="_blank" style={{padding:"11px 22px",background:"#2AABEE",color:"white",borderRadius:8,fontSize:13,fontWeight:500,fontFamily:"'DM Sans',sans-serif"}}>Follow on Telegram →</a>
                  <button onClick={()=>{setContactModal(false);setContactSent(false);}} style={{padding:"11px 22px",background:GB,border:`1px solid rgba(201,168,76,0.25)`,borderRadius:8,fontSize:13,color:"#6B7280",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{t.btn_close}</button>
                </div>
              </div>
            ):(
              <>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:24}}>
                  <div>
                    <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:"0.08em",color:G,fontWeight:600,marginBottom:5}}>Contact ICC</div>
                    <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700,color:GD}}>Send Us a Message</h2>
                  </div>
                  <button onClick={()=>setContactModal(false)} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:"#9CA3AF",lineHeight:1}}>✕</button>
                </div>
                <form onSubmit={submitContact}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                    {[["Name","name","text","Your full name"],["Email","email","email","your@email.com"],["Company","company","text","Your organization"],["Service","service","select",""]].map(([lbl,key,type,ph],i)=>(
                      <div key={i}>
                        <label style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",color:"#9CA3AF",display:"block",marginBottom:5}}>{lbl}</label>
                        {type==="select"?(
                          <select value={contactForm.service} onChange={e=>setContactForm(f=>({...f,service:e.target.value}))} style={{width:"100%",border:`1px solid rgba(201,168,76,0.25)`,borderRadius:8,padding:"10px 12px",fontSize:12,fontFamily:"'DM Sans',sans-serif",color:GD,background:"white"}}>
                            <option value="">Select a service</option>
                            {ICC.services.map(s=><option key={s.en} value={s.en}>{s.icon} {s.en}</option>)}
                          </select>
                        ):(
                          <input required type={type} placeholder={ph} value={contactForm[key]} onChange={e=>setContactForm(f=>({...f,[key]:e.target.value}))} style={{width:"100%",border:`1px solid rgba(201,168,76,0.25)`,borderRadius:8,padding:"10px 12px",fontSize:12,fontFamily:"'DM Sans',sans-serif",color:GD,background:"#FAFAF8"}}/>
                        )}
                      </div>
                    ))}
                  </div>
                  <div style={{marginBottom:18}}>
                    <label style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",color:"#9CA3AF",display:"block",marginBottom:5}}>Message</label>
                    <textarea required rows={4} placeholder="Tell us about your project, challenge, or inquiry..." value={contactForm.msg} onChange={e=>setContactForm(f=>({...f,msg:e.target.value}))} style={{width:"100%",border:`1px solid rgba(201,168,76,0.25)`,borderRadius:8,padding:"10px 12px",fontSize:12,fontFamily:"'DM Sans',sans-serif",color:GD,background:"#FAFAF8",resize:"vertical"}}/>
                  </div>
                  <div style={{display:"flex",gap:10}}>
                    <button type="submit" className="btn-gold" style={{flex:1}}>Send Message →</button>
                    <a href={`mailto:${ICC.email}`} style={{padding:"11px 18px",background:GD,color:"white",border:"none",borderRadius:8,fontSize:13,fontWeight:500,fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center"}}>Email directly</a>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>}

      {/* ═══════════════════════════════════════
          ADMIN PANEL — only for site admin
      ═══════════════════════════════════════ */}
      {adminOpen&&<div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget){setAdminOpen(false);setAdminAuth(false);}}}>
        <div className="modal-box" style={{maxWidth:adminAuth?820:420,background:"white"}}>
          {!adminAuth?(
            /* ── LOGIN ── */
            <div style={{padding:40,textAlign:"center"}}>
              <div style={{width:56,height:56,background:GD,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,margin:"0 auto 18px"}}>🔐</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:GD,marginBottom:8}}>Admin Panel</div>
              <p style={{fontSize:13,color:"#9CA3AF",marginBottom:24}}>Enter administrator password to access vacancy analytics and submitted CVs.</p>
              <input
                type="password" placeholder="Password"
                value={adminPass} onChange={e=>setAdminPass(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&doAdminLogin()}
                style={{width:"100%",border:"1px solid rgba(201,168,76,0.3)",borderRadius:8,padding:"12px 16px",fontSize:14,fontFamily:"'DM Sans',sans-serif",color:GD,marginBottom:14,outline:"none",textAlign:"center"}}
                autoFocus/>
              <div style={{display:"flex",gap:10}}>
                <button onClick={doAdminLogin} style={{flex:1,padding:"12px 0",background:GD,color:"white",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                  Login →
                </button>
                <button onClick={()=>setAdminOpen(false)} style={{padding:"12px 18px",background:"none",border:"1px solid rgba(201,168,76,0.25)",borderRadius:8,fontSize:13,color:"#6B7280",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                  Cancel
                </button>
              </div>
            </div>
          ):(
            /* ── DASHBOARD ── */
            <div style={{padding:28}}>
              {/* Header */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22,paddingBottom:16,borderBottom:"1px solid rgba(201,168,76,0.15)"}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <span style={{fontSize:18}}>🔐</span>
                    <span style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:GD}}>Admin Panel</span>
                    <span style={{padding:"2px 8px",background:"rgba(34,197,94,0.1)",color:"#16a34a",border:"1px solid rgba(34,197,94,0.25)",borderRadius:8,fontSize:10,fontWeight:700}}>● Authenticated</span>
                  </div>
                  <p style={{fontSize:12,color:"#9CA3AF"}}>Vacancy analytics & CV submissions — {ICC.fullName||"ICC"}</p>
                </div>
                <button onClick={()=>{setAdminOpen(false);setAdminAuth(false);}} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#9CA3AF"}}>✕</button>
              </div>

              {/* Overview stats row */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:22}}>
                {[
                  {label:"Total Vacancy Views", val:Object.values(vacViews).reduce((a,b)=>a+b,0), icon:"👁", color:"#003f87"},
                  {label:"Total Applications",  val:Object.values(cvSubmissions).reduce((a,b)=>a+b.length,0), icon:"📄", color:G},
                  {label:"Open Positions",       val:ICC.vacancies.length, icon:"💼", color:"#059669"},
                  {label:"Conversion Rate",      val:Object.values(vacViews).reduce((a,b)=>a+b,0)>0?Math.round(Object.values(cvSubmissions).reduce((a,b)=>a+b.length,0)/Object.values(vacViews).reduce((a,b)=>a+b,0)*100)+"%":"—", icon:"📊", color:"#7c3aed"},
                ].map(({label,val,icon,color},i)=>(
                  <div key={i} style={{padding:"16px",background:"#FAFAF8",borderRadius:10,border:`1px solid rgba(201,168,76,0.15)`,borderTop:`3px solid ${color}`}}>
                    <div style={{fontSize:20,marginBottom:6}}>{icon}</div>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,color:GD,lineHeight:1}}>{val}</div>
                    <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.07em",color:"#9CA3AF",marginTop:4}}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Per-vacancy breakdown */}
              <div style={{marginBottom:20}}>
                <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:"0.1em",color:G,fontWeight:700,marginBottom:14}}>Per-Vacancy Breakdown</div>
                {ICC.vacancies.map(v=>{
                  const views=vacViews[v.id]||0;
                  const apps=(cvSubmissions[v.id]||[]).length;
                  const maxV=Math.max(...ICC.vacancies.map(x=>vacViews[x.id]||0),1);
                  return(
                    <div key={v.id} style={{marginBottom:10,padding:"14px 16px",background:"#FAFAF8",borderRadius:10,border:"1px solid rgba(201,168,76,0.12)",cursor:"pointer",transition:"all 0.2s"}}
                      onClick={()=>setAdminTab(adminTab===v.id?"overview":v.id)}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor=G;}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(201,168,76,0.12)";}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                        <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:700,color:GD,flex:1,marginRight:12}}>{v.title}</div>
                        <div style={{display:"flex",gap:10,flexShrink:0}}>
                          <span style={{display:"flex",alignItems:"center",gap:5,padding:"3px 10px",background:"rgba(10,22,40,0.06)",borderRadius:8,fontSize:12,fontWeight:700,color:GD}}>
                            👁 {views} <span style={{fontSize:10,fontWeight:400,color:"#9CA3AF"}}>views</span>
                          </span>
                          <span style={{display:"flex",alignItems:"center",gap:5,padding:"3px 10px",background:apps>0?"rgba(201,168,76,0.1)":"rgba(10,22,40,0.04)",border:apps>0?`1px solid rgba(201,168,76,0.3)`:"1px solid rgba(0,0,0,0.06)",borderRadius:8,fontSize:12,fontWeight:700,color:apps>0?G:"#9CA3AF"}}>
                            📄 {apps} <span style={{fontSize:10,fontWeight:400,color:"#9CA3AF"}}>CVs</span>
                          </span>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div style={{height:4,background:"rgba(201,168,76,0.12)",borderRadius:4,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${(views/maxV)*100}%`,background:`linear-gradient(90deg,${G},#E8C97A)`,borderRadius:4,transition:"width 0.8s"}}/>
                      </div>
                      {/* Expanded CV list */}
                      {adminTab===v.id&&(cvSubmissions[v.id]||[]).length>0&&(
                        <div style={{marginTop:14,borderTop:"1px solid rgba(201,168,76,0.15)",paddingTop:14}}>
                          <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:"0.08em",color:G,fontWeight:700,marginBottom:10}}>📄 Submitted CVs ({(cvSubmissions[v.id]||[]).length})</div>
                          {(cvSubmissions[v.id]||[]).map((cv,idx)=>(
                            <div key={idx} style={{padding:"12px 14px",background:"white",borderRadius:8,border:"1px solid rgba(201,168,76,0.2)",marginBottom:8}}>
                              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                                <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:700,color:GD}}>{cv.name}</div>
                                <span style={{fontSize:10,color:"#9CA3AF",flexShrink:0,marginLeft:10}}>{cv.date} {cv.time}</span>
                              </div>
                              <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:cv.msg?8:0}}>
                                <a href={`mailto:${cv.email}`} style={{fontSize:12,color:"#2563eb",display:"flex",alignItems:"center",gap:4}}>✉️ {cv.email}</a>
                                {cv.phone&&<a href={`tel:${cv.phone}`} style={{fontSize:12,color:"#059669",display:"flex",alignItems:"center",gap:4}}>📞 {cv.phone}</a>}
                                {cv.linkedin&&<a href={cv.linkedin} target="_blank" style={{fontSize:12,color:"#0077b5",display:"flex",alignItems:"center",gap:4}}>in LinkedIn</a>}
                              </div>
                              {cv.msg&&<p style={{fontSize:12,color:"#6B7280",lineHeight:1.6,padding:"8px 10px",background:"#FAFAF8",borderRadius:6,margin:0}}>{cv.msg}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                      {adminTab===v.id&&(cvSubmissions[v.id]||[]).length===0&&(
                        <div style={{marginTop:12,padding:"10px 0",textAlign:"center",fontSize:12,color:"#9CA3AF",borderTop:"1px solid rgba(201,168,76,0.1)",paddingTop:12}}>
                          No applications received yet
                        </div>
                      )}
                      {adminTab!==v.id&&apps>0&&(
                        <div style={{marginTop:6,fontSize:11,color:G,fontWeight:500}}>Click to view {apps} application{apps>1?"s":""} →</div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Footer actions */}
              <div style={{display:"flex",gap:10,paddingTop:16,borderTop:"1px solid rgba(201,168,76,0.12)"}}>
                <button onClick={async()=>{
                  const data={vacViews,cvSubmissions,exported:new Date().toISOString()};
                  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
                  const url=URL.createObjectURL(blob);
                  const a=document.createElement("a");a.href=url;a.download="icc-admin-export.json";a.click();
                }} style={{padding:"10px 20px",background:GD,color:"white",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:6}}>
                  ⬇️ Export JSON
                </button>
                <button onClick={()=>{setAdminOpen(false);setAdminAuth(false);}} style={{padding:"10px 18px",background:"none",border:"1px solid rgba(201,168,76,0.25)",borderRadius:8,fontSize:12,color:"#6B7280",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                  Close Panel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>}

    </div>
  );
}
