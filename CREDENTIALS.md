# GAMS — Test Login Credentials
> **⚠️ Development use only. Never commit to production.**

---

## 🏛️ MANAGE PORTAL
**URL:** http://localhost:3001/manage/login

| Role             | Email                        | Password          | Dashboard                   |
|------------------|------------------------------|-------------------|-----------------------------|
| Super Admin      | admin@gams.gov.in            | Admin@1234        | /manage (Full Dashboard)    |
| Event Manager    | eventmanager@gams.gov.in     | Manager@1234      | /manage (Full Dashboard)    |
| Inspector        | inspector@gams.gov.in        | Inspector@1234    | /manage/inspector           |
| Volunteer        | volunteer@gams.gov.in        | Volunteer@1234    | /manage/volunteer           |
| Warehouse Officer| warehouse@gams.gov.in        | Warehouse@1234    | /manage/viewer              |
| Auditor / Viewer | viewer@gams.gov.in           | Viewer@1234       | /manage/viewer              |

---

## 🛒 PUBLIC PORTAL (Citizen Marketplace)
**URL:** http://localhost:3001/public/login

| Role    | Email                | Password       | Dashboard       |
|---------|----------------------|----------------|-----------------|
| Citizen | citizen@example.com  | Citizen@1234   | /public/account |

---

## 🏢 COMPANY PORTAL (Supplier)
**URL:** http://localhost:3001/company/login

| Role         | Email                | Password       |
|--------------|----------------------|----------------|
| Company Rep  | company@example.com  | Company@1234   |

---

## 🤝 BUYER / NGO PORTAL (Institutional)
**URL:** http://localhost:3001/buyer/login

| Role            | Email            | Password    |
|-----------------|------------------|-------------|
| Institution Rep | ngo@example.com  | Ngo@12345   |

---

## 🗄️ Database (Supabase)
**Project URL:** https://tngrjxbzamkrdkwpyqel.supabase.co  
**Dashboard:**  https://supabase.com/dashboard/project/tngrjxbzamkrdkwpyqel  

| Credential        | Value                                                 |
|-------------------|-------------------------------------------------------|
| DB Host           | db.tngrjxbzamkrdkwpyqel.supabase.co                  |
| DB Port           | 5432                                                  |
| DB Name           | postgres                                              |
| DB User           | postgres                                              |
| DB Password       | xQSUt9WPdwgDYefQ                                     |
| Connection String | postgresql://postgres:xQSUt9WPdwgDYefQ@db.tngrjxbzamkrdkwpyqel.supabase.co:5432/postgres |

---

## 🖥️ Dev Server
| Port | URL                        | Notes                           |
|------|----------------------------|---------------------------------|
| 3001 | http://localhost:3001      | All portals served from one app |

> Run with: `npm run dev` from `d:\GAMS`
