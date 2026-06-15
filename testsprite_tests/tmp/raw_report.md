
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** gpa-Calculator
- **Date:** 2026-06-15
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001 Register a new account and reach the dashboard
- **Test Code:** [TC001_Register_a_new_account_and_reach_the_dashboard.py](./TC001_Register_a_new_account_and_reach_the_dashboard.py)
- **Test Error:** TEST BLOCKED

The verification step could not be run to completion — the verification code required to complete email verification cannot be retrieved because the user's email inbox is not accessible and the application does not display the valid code in the UI.

Observations:
- The verification UI shows that a 6-digit code was sent to bhycoder926+test1@gmail.com, but no valid code is shown in the app.
- Repeated 'Resend Code' attempts show success and rate-limit messages, yet entering the visible code (123456) returned 'Invalid or expired verification code' and the mailbox is not accessible to retrieve the correct code.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f9071615-58eb-45d9-aa64-91f84393d31e/309bf71f-05f5-4462-9fb4-86c533766bc3
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002 Sign in with email and password and reach the dashboard
- **Test Code:** [TC002_Sign_in_with_email_and_password_and_reach_the_dashboard.py](./TC002_Sign_in_with_email_and_password_and_reach_the_dashboard.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f9071615-58eb-45d9-aa64-91f84393d31e/a8388b6c-10d0-4af2-b423-7fe559939616
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003 Add a semester with multiple subjects and save the updated CGPA
- **Test Code:** [TC003_Add_a_semester_with_multiple_subjects_and_save_the_updated_CGPA.py](./TC003_Add_a_semester_with_multiple_subjects_and_save_the_updated_CGPA.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f9071615-58eb-45d9-aa64-91f84393d31e/a0857103-66cc-43b5-a080-ad6b1e955925
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004 Edit subject details and see the recalculated CGPA
- **Test Code:** [TC004_Edit_subject_details_and_see_the_recalculated_CGPA.py](./TC004_Edit_subject_details_and_see_the_recalculated_CGPA.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f9071615-58eb-45d9-aa64-91f84393d31e/c84eeb0f-242f-4cc1-b2dd-444d07b921a7
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005 Delete an entire semester and confirm the dashboard updates
- **Test Code:** [TC005_Delete_an_entire_semester_and_confirm_the_dashboard_updates.py](./TC005_Delete_an_entire_semester_and_confirm_the_dashboard_updates.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f9071615-58eb-45d9-aa64-91f84393d31e/df018bd9-c424-4181-b867-eadbe39fb72c
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006 View grade distribution after signing in
- **Test Code:** [TC006_View_grade_distribution_after_signing_in.py](./TC006_View_grade_distribution_after_signing_in.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f9071615-58eb-45d9-aa64-91f84393d31e/7196d8ab-248c-444e-9557-9a30777ef531
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007 Remove a subject from a semester and save the change
- **Test Code:** [TC007_Remove_a_subject_from_a_semester_and_save_the_change.py](./TC007_Remove_a_subject_from_a_semester_and_save_the_change.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f9071615-58eb-45d9-aa64-91f84393d31e/7512256e-6184-45ac-a27e-1bbaf6306a90
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008 Refresh grade distribution after saving academic changes
- **Test Code:** [TC008_Refresh_grade_distribution_after_saving_academic_changes.py](./TC008_Refresh_grade_distribution_after_saving_academic_changes.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f9071615-58eb-45d9-aa64-91f84393d31e/4ee2b410-61b5-4feb-9c17-8a783298719c
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009 Track target CGPA progress with prediction inputs
- **Test Code:** [TC009_Track_target_CGPA_progress_with_prediction_inputs.py](./TC009_Track_target_CGPA_progress_with_prediction_inputs.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f9071615-58eb-45d9-aa64-91f84393d31e/df5668a0-716e-4e96-a888-0e8809367cc8
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010 Export a print-ready transcript from the dashboard
- **Test Code:** [TC010_Export_a_print_ready_transcript_from_the_dashboard.py](./TC010_Export_a_print_ready_transcript_from_the_dashboard.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f9071615-58eb-45d9-aa64-91f84393d31e/760ffbf8-417c-4ff0-bcc3-a0db85d36a5f
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC011 Reset all academic data and return to an empty state
- **Test Code:** [TC011_Reset_all_academic_data_and_return_to_an_empty_state.py](./TC011_Reset_all_academic_data_and_return_to_an_empty_state.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f9071615-58eb-45d9-aa64-91f84393d31e/a3d783d0-81dc-447e-b599-ba35251856f6
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC012 Export a transcript after adding semester data
- **Test Code:** [TC012_Export_a_transcript_after_adding_semester_data.py](./TC012_Export_a_transcript_after_adding_semester_data.py)
- **Test Error:** TEST BLOCKED

The test could not be run — the application's login page is unreachable, preventing authentication and access to the features required by the test.

Observations:
- Navigating to /login displayed a 404 page with the message 'This page could not be found.'
- The page contains no interactive elements (no login form), so sign-in and subsequent actions (adding records, saving, or exporting a transcript) cannot be performed.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f9071615-58eb-45d9-aa64-91f84393d31e/5b600d86-6e8a-45b3-a673-611d6def7ad6
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC013 Update target tracker inputs and see the prediction change
- **Test Code:** [TC013_Update_target_tracker_inputs_and_see_the_prediction_change.py](./TC013_Update_target_tracker_inputs_and_see_the_prediction_change.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f9071615-58eb-45d9-aa64-91f84393d31e/91127f01-3fa3-4558-a507-6cb4b4b7260f
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC014 Reveal and hide the password while signing in
- **Test Code:** [TC014_Reveal_and_hide_the_password_while_signing_in.py](./TC014_Reveal_and_hide_the_password_while_signing_in.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f9071615-58eb-45d9-aa64-91f84393d31e/5b4ed154-5aa7-448a-a4c1-20a88e655b15
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC015 Inspect a grade distribution slice
- **Test Code:** [TC015_Inspect_a_grade_distribution_slice.py](./TC015_Inspect_a_grade_distribution_slice.py)
- **Test Error:** TEST BLOCKED

The sign-in flow could not be reached — the /login page returned a 404 error, so the login form and subsequent grade-chart UI are not accessible.

Observations:
- The /login page displays '404 This page could not be found.' and no login form fields are present.
- The page has 0 interactive elements, preventing any form submission or UI interaction required by the test.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f9071615-58eb-45d9-aa64-91f84393d31e/f84f3919-257b-4325-a0aa-1ea068381692
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **80.00** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---