---
description: มาตรฐานการเขียนโค้ดสำหรับโปรเจกต์นี้ — Clean Code, บำรุงรักษาง่าย, ต่อยอดง่าย
---

# Coding Standards & Clean Code Guidelines

ทุกครั้งที่เขียนหรือแก้ไขโค้ดในโปรเจกต์นี้ **ต้องปฏิบัติตามหลักการเหล่านี้เสมอ**:

## 1. Clean Code Principles
- ตั้งชื่อตัวแปร, ฟังก์ชัน, คลาส ให้สื่อความหมายชัดเจน (Meaningful Names)
- ฟังก์ชันต้องทำหน้าที่เดียว (Single Responsibility)
- หลีกเลี่ยงโค้ดซ้ำซ้อน (DRY — Don't Repeat Yourself)
- เขียน comment เฉพาะจุดที่จำเป็น โค้ดควรอ่านรู้เรื่องด้วยตัวมันเอง
- ใช้ค่าคงที่ (constants) แทน magic numbers/strings

## 2. โครงสร้างที่บำรุงรักษาง่าย (Maintainability)
- แยก concerns ออกจากกัน — Controller, Model, Service, Config
- ใช้ dependency injection แทน hardcode dependencies
- Config ทั้งหมดอยู่ใน `.env` หรือ config files ไม่ hardcode ในโค้ด
- Error handling ที่ชัดเจน — ใช้ try-catch, return error messages ที่เข้าใจง่าย
- Consistent code style — ใช้ ESLint/Prettier (Frontend), PSR-12 (PHP Backend)

## 3. ต่อยอดง่าย (Extensibility)
- ใช้ pattern ที่รองรับการขยาย — เช่น middleware pattern, component-based architecture
- แยก API routes เป็นกลุ่มๆ เพื่อเพิ่ม endpoint ใหม่ได้ง่าย
- React components ต้อง reusable — รับ props, ไม่ hardcode data
- Database schema ใช้ migration pattern เพื่อปรับแก้ได้ง่ายในอนาคต

## 4. File Organization
- **Frontend (React)**: แยก components/, pages/, context/, api/, hooks/
- **Backend (PHP)**: แยก Controllers/, Models/, Middleware/, Config/, routes/
- ไฟล์เล็กกว่า 300 บรรทัด — ถ้ายาวเกินให้แยกออก

## 5. Checklist ก่อน Commit
- [ ] ไม่มี console.log / var_dump ที่ไม่จำเป็น
- [ ] ไม่มี hardcoded credentials หรือ secrets
- [ ] ตัวแปรและฟังก์ชันตั้งชื่อสื่อความหมาย
- [ ] Error handling ครบถ้วน
- [ ] โค้ดอ่านรู้เรื่องโดยไม่ต้อง comment อธิบาย
