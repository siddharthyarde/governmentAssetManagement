# GAMS — Test Login Credentials
> **WARNING: Development use only. Never commit to production.**

---

## MANAGE PORTAL
**URL:** http://localhost:3000/manage/login

| Role             | Email                        | Password          |
|------------------|------------------------------|-------------------|
| Super Admin      | admin@gams.gov.in            | Admin@1234        |
| Event Manager    | eventmanager@gams.gov.in     | Manager@1234      |
| Inspector        | inspector@gams.gov.in        | Inspector@1234    |
| Volunteer        | volunteer@gams.gov.in        | Volunteer@1234    |
| Warehouse Officer| warehouse@gams.gov.in        | Warehouse@1234    |
| Auditor/Viewer   | viewer@gams.gov.in           | Viewer@1234       |

---

## PUBLIC PORTAL (Citizen Marketplace)
**URL:** http://localhost:3000/public/login

| Email                | Password       |
|----------------------|----------------|
| citizen@example.com  | Citizen@1234   |

---

## COMPANY PORTAL (Supplier)
**URL:** http://localhost:3000/company/login

| Email                | Password       |
|----------------------|----------------|
| company@example.com  | Company@1234   |

---

## BUYER PORTAL (Institutional / NGO)
**URL:** http://localhost:3000/buyer/login

| Email            | Password    |
|------------------|-------------|
| ngo@example.com  | Ngo@12345   |

---

## Database (Supabase)
**Project URL:** https://tngrjxbzamkrdkwpyqel.supabase.co
**Dashboard:** https://supabase.com/dashboard/project/tngrjxbzamkrdkwpyqel

---

## Dev Server
- **Port 3000:** http://localhost:3000 (all portals on one app, `npm run dev` from `d:/GAMS`)
- **Note:** The app was flattened from a monorepo to a single Next.js app. All portals are served on port 3000.
