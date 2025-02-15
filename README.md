
# **Hospital Backend System**  

A secure backend system for hospitals, handling **user signups, patient-doctor assignments, encrypted doctor notes, and AI-generated actionable steps** with automated reminders.  

## **Features**  
✅ **User Authentication:** Secure signup & login with JWT and bcrypt.  
✅ **Doctor-Patient Assignment:** Patients select doctors, and doctors see assigned patients.  
✅ **AI Integration:** Uses **Google Gemini Flash** to extract actionable steps.  
✅ **Automated Reminders:** Uses **node-cron** for scheduling patient tasks.  



## **1. Authentication & Security**  
- **JWT** for authentication (stateless & secure).  
- **bcrypt** for password hashing.


## **2. Patient–Doctor Assignment**  
- Each **doctor** can have multiple **patients**, but each **patient** selects only one doctor.  
- Prevents **conflicting treatments** and simplifies doctor-patient communication.  


## **3. AI-Powered Actionable Steps**  
- **LLM (Google Gemini Flash)** processes doctor notes to generate:  
  - ✅ **Checklist:** Immediate tasks (e.g., "Buy a drug").  
  - ✅ **Plan:** Scheduled actions (e.g., "Take medicine daily for 7 days").  
- **New doctor notes replace old tasks** to keep plans up to date.  


## **4. Dynamic Scheduling (Node-Cron)**  
- **node-cron** handles automatic reminders based on AI-generated schedules.  
- If a patient **misses a task**, the system **extends** the schedule accordingly.  
- When a **new note is submitted**, old schedules are **canceled and replaced** dynamically.  


## **5. Data Storage**  
- **PostgreSQL + Prisma ORM** for structured and reliable data storage.  
- Ensures **ACID compliance** for data integrity.  




