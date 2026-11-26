-- Xoá toàn bộ dữ liệu demo do scripts/seed-demo-data.mjs tạo (tài khoản email đuôi @demo.worklify.test)
-- cùng hồ sơ, CV, công ty, tin tuyển dụng và đơn ứng tuyển của họ. Không đụng tới dữ liệu khác.
-- Danh mục kỹ năng (reference_values) được giữ lại vì là dữ liệu dùng chung.
--
-- Chạy (PowerShell, trong thư mục backend-core):
--   Get-Content scripts/clean-demo-data.sql | docker exec -i worklify-mysql mysql -uroot -proot123 worklify_db

CREATE TEMPORARY TABLE demo_users AS SELECT id FROM users WHERE email LIKE '%@demo.worklify.test';
CREATE TEMPORARY TABLE demo_profiles AS SELECT id FROM candidate_profiles WHERE user_id IN (SELECT id FROM demo_users);
CREATE TEMPORARY TABLE demo_companies AS SELECT id FROM company_profiles WHERE user_id IN (SELECT id FROM demo_users);
CREATE TEMPORARY TABLE demo_jobs AS SELECT id FROM job_postings WHERE company_id IN (SELECT id FROM demo_companies);

-- applications.candidate_id là ID người dùng; các bảng candidate_* và cv_documents dùng ID hồ sơ ứng viên
DELETE FROM applications WHERE candidate_id IN (SELECT id FROM demo_users) OR job_id IN (SELECT id FROM demo_jobs);
DELETE FROM saved_jobs WHERE job_id IN (SELECT id FROM demo_jobs);
DELETE FROM company_likes WHERE user_id IN (SELECT id FROM demo_users) OR company_id IN (SELECT id FROM demo_companies);

DELETE FROM candidate_activities WHERE candidate_id IN (SELECT id FROM demo_profiles);
DELETE FROM candidate_awards WHERE candidate_id IN (SELECT id FROM demo_profiles);
DELETE FROM candidate_certifications WHERE candidate_id IN (SELECT id FROM demo_profiles);
DELETE FROM candidate_educations WHERE candidate_id IN (SELECT id FROM demo_profiles);
DELETE FROM candidate_experiences WHERE candidate_id IN (SELECT id FROM demo_profiles);
DELETE FROM candidate_hobbies WHERE candidate_id IN (SELECT id FROM demo_profiles);
DELETE FROM candidate_languages WHERE candidate_id IN (SELECT id FROM demo_profiles);
DELETE FROM candidate_profile_layouts WHERE candidate_id IN (SELECT id FROM demo_profiles);
DELETE FROM candidate_projects WHERE candidate_id IN (SELECT id FROM demo_profiles);
DELETE FROM candidate_skills WHERE candidate_id IN (SELECT id FROM demo_profiles);
DELETE FROM cv_documents WHERE candidate_id IN (SELECT id FROM demo_profiles);
DELETE FROM candidate_profiles WHERE id IN (SELECT id FROM demo_profiles);

DELETE FROM job_postings WHERE id IN (SELECT id FROM demo_jobs);
DELETE FROM company_profiles WHERE id IN (SELECT id FROM demo_companies);
DELETE FROM system_logs WHERE user_id IN (SELECT id FROM demo_users);
DELETE FROM users WHERE id IN (SELECT id FROM demo_users);

SELECT CONCAT('Đã xoá dữ liệu demo, còn lại ', COUNT(*), ' tài khoản @demo.worklify.test') AS ket_qua
FROM users WHERE email LIKE '%@demo.worklify.test';
