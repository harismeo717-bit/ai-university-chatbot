/**
 * UniAssist AI — Authoritative Institutional Documents & Chunks
 * Pre-indexed text chunks with token counts, headings, page numbers, and semantic keywords.
 */

import { UniversityDocument } from '../../types/index.ts';

export const INITIAL_DOCUMENTS: UniversityDocument[] = [
  {
    id: 'doc-admissions-2026',
    title: 'Undergraduate & Graduate Admission Regulations Handbook 2026',
    description: 'Official admission requirements, minimum academic criteria for BSCS/SE/EE, entry test weightage, application procedures, and deadlines.',
    fileName: 'Admission_Regulations_2026_Official.pdf',
    fileSize: 2458000,
    mimeType: 'application/pdf',
    category: 'ADMISSIONS',
    accessLevel: 'STUDENT',
    academicYear: '2026-2027',
    version: '2.1.0',
    status: 'INDEXED',
    uploadedBy: 'Directorate of Admissions',
    uploadedAt: '2026-08-15T08:30:00.000Z',
    chunksCount: 4,
    chunks: [
      {
        id: 'chunk-adm-1',
        documentId: 'doc-admissions-2026',
        chunkIndex: 0,
        heading: '1. BS Computer Science (BSCS) & Software Engineering Admission Criteria',
        pageNumber: 4,
        category: 'ADMISSIONS',
        tokens: 220,
        content: `ADMISSION REQUIREMENTS FOR BS COMPUTER SCIENCE (BSCS) & BS SOFTWARE ENGINEERING (BSSE):
1. Minimum Academic Qualification: Candidates must have passed Higher Secondary School Certificate (HSSC / FSc Pre-Engineering / ICS) or equivalent 12-year British A-Levels (Mathematics mandatory) with a minimum of 60% aggregate marks (unadjusted).
2. For Pre-Medical students: Eligible provided they have cleared Additional Mathematics before the commencement of the first academic year.
3. Entry Assessment Weightage:
   - Intermediate / High School Marks: 40% weightage
   - University Aptitude & Computing Entry Test (UET/NAT/SAT-I): 50% weightage
   - Matriculation / O-Level SSC: 10% weightage
4. Merit Cutoff: The expected merit threshold for BSCS in Fall 2026 is an aggregate of 76.5%.
5. Application Procedure: Submit online application via portal.university.edu with verified transcripts, CNIC/B-Form, and payment of the non-refundable processing fee of $40 (or local equivalent).`,
      },
      {
        id: 'chunk-adm-2',
        documentId: 'doc-admissions-2026',
        chunkIndex: 1,
        heading: '2. Application Deadlines & Schedule for Fall 2026',
        pageNumber: 7,
        category: 'ADMISSIONS',
        tokens: 180,
        content: `IMPORTANT ADMISSION DATES FOR FALL 2026 SEMESTER:
- Online Application Portal Opens: June 1, 2026
- Application Submission Deadline: August 10, 2026 (11:59 PM)
- Computerized Entry Test Rounds: August 15 – August 22, 2026
- First Merit List Announcement: August 28, 2026
- Fee Payment for 1st Merit List: September 2, 2026
- Second Merit List Announcement: September 5, 2026
- Orientation Day & Student Registration: September 12, 2026
- Commencement of Classes: September 14, 2026
Late applications are strictly not entertained under any circumstances.`,
      },
      {
        id: 'chunk-adm-3',
        documentId: 'doc-admissions-2026',
        chunkIndex: 2,
        heading: '3. Graduate Programs (MS / Ph.D.) Eligibility & Requirements',
        pageNumber: 12,
        category: 'ADMISSIONS',
        tokens: 195,
        content: `GRADUATE ADMISSIONS (MSCS, MSSE, PH.D. COMPUTING):
1. MS Programs: 16 years of education (BS in CS, SE, IT, CE or closely related computing discipline) from an accredited university with minimum CGPA 2.50/4.00 or 60% in annual system.
2. GAT General or University Graduate Entry Test: Minimum 50% percentile score required.
3. Departmental Interview: Candidates must present an initial statement of purpose and pass the technical interview conducted by the Graduate Studies Committee.
4. Ph.D. Computing: 18 years of relevant education with minimum CGPA 3.0/4.0 and GAT Subject test with min 60% score, plus a defense of doctoral research proposal.`,
      },
      {
        id: 'chunk-adm-4',
        documentId: 'doc-admissions-2026',
        chunkIndex: 3,
        heading: '4. International Students & Equivalency Certificates',
        pageNumber: 15,
        category: 'ADMISSIONS',
        tokens: 160,
        content: `INTERNATIONAL STUDENTS & EQUIVALENCY:
Candidates possessing foreign qualifications (e.g., American High School Diploma, Cambridge International A-Levels, International Baccalaureate IB) must obtain an official Equivalence Certificate from the Inter Board Coordination Commission (IBCC).
International applicants must present a valid passport, valid student visa endorsement, and proof of English proficiency (TOEFL iBT >= 79 or IELTS Academic >= 6.0) unless prior education was conducted in English medium.`,
      },
    ],
  },
  {
    id: 'doc-fees-2026',
    title: 'University Fee Structure & Payment Policies AY 2026-2027',
    description: 'Comprehensive schedule of tuition per credit hour, admission fees, lab charges, hostel mess charges, installment plans, and refund schedules.',
    fileName: 'Tuition_Fee_Structure_2026_2027.pdf',
    fileSize: 1820000,
    mimeType: 'application/pdf',
    category: 'FEES',
    accessLevel: 'STUDENT',
    academicYear: '2026-2027',
    version: '1.4.0',
    status: 'INDEXED',
    uploadedBy: 'Treasurer & Accounts Office',
    uploadedAt: '2026-08-20T10:00:00.000Z',
    chunksCount: 3,
    chunks: [
      {
        id: 'chunk-fee-1',
        documentId: 'doc-fees-2026',
        chunkIndex: 0,
        heading: '1. Undergraduate Tuition & Recurring Semester Fee Breakdown',
        pageNumber: 2,
        category: 'FEES',
        tokens: 240,
        content: `UNDERGRADUATE TUITION & REGULAR SEMESTER CHARGES (FALL 2026 / SPRING 2027):
1. Tuition per Credit Hour:
   - BS Computer Science (BSCS) & BS Software Engineering (BSSE): $180 per credit hour
   - BS Electrical Engineering (BSEE): $175 per credit hour
   - Bachelor of Business Administration (BBA): $160 per credit hour
2. Average Regular Semester Fee (Assuming standard 17 credit hours load for BSCS):
   - Tuition Fee (17 x $180): $3,060
   - Computing Laboratory & Software License Fee: $250
   - Library & Digital Repository Fee: $80
   - Examination & Evaluation Fee: $120
   - Sports & Student Welfare Fund: $50
   - Total Estimated Regular Semester Fee: $3,560
3. One-Time Charges at Admission:
   - Admission Processing & Registration Fee: $350 (Non-refundable)
   - Institutional Security Deposit: $200 (100% Refundable upon graduation/clearance)`,
      },
      {
        id: 'chunk-fee-2',
        documentId: 'doc-fees-2026',
        chunkIndex: 1,
        heading: '2. Fee Payment Deadlines, Installment Plans & Penalties',
        pageNumber: 5,
        category: 'FEES',
        tokens: 190,
        content: `FEE PAYMENT SCHEDULE & PENALTIES:
- Semester Fee Due Date: Due within 10 days of class commencement (for Fall 2026, deadline is September 24, 2026).
- Late Fee Fine:
  - First week after due date: $30 fixed surcharge.
  - Second week after due date: $75 surcharge.
  - After 15 days: Student portal and course registration will be temporarily frozen.
- Installment Policy:
  Students experiencing financial hardship may apply for a 2-installment split (50% upfront, 50% prior to midterm exams) by submitting Form FA-2 to the Accounts Office at least 5 days before the initial deadline.`,
      },
      {
        id: 'chunk-fee-3',
        documentId: 'doc-fees-2026',
        chunkIndex: 2,
        heading: '3. Fee Refund Regulations (HEC Standard Model)',
        pageNumber: 8,
        category: 'FEES',
        tokens: 170,
        content: `FEE REFUND POLICY UPON ADMISSION WITHDRAWAL:
- Up to 7th day of class commencement: 100% tuition refund (excluding admission registration fee).
- From 8th to 15th day of class commencement: 50% tuition refund.
- From 16th day onward: 0% tuition refund (No refund admissible).
Security deposit ($200) is refunded 100% upon clearance of departmental dues, library book returns, and submission of the Clearance Certificate.`,
      },
    ],
  },
  {
    id: 'doc-exams-2026',
    title: 'Academic Regulations, Grading System & Examination Rules',
    description: 'Mandatory 75% attendance policy, grading scale, CGPA calculation, exam hall conduct, debarment rules, and academic probation.',
    fileName: 'Academic_Regulations_Examination_Rules_2026.pdf',
    fileSize: 3120000,
    mimeType: 'application/pdf',
    category: 'EXAMINATIONS',
    accessLevel: 'STUDENT',
    academicYear: '2026-2027',
    version: '3.0.1',
    status: 'INDEXED',
    uploadedBy: 'Office of the Controller of Examinations',
    uploadedAt: '2026-07-10T14:00:00.000Z',
    chunksCount: 3,
    chunks: [
      {
        id: 'chunk-exam-1',
        documentId: 'doc-exams-2026',
        chunkIndex: 0,
        heading: '1. Mandatory 75% Attendance Requirement & Debarment Rule',
        pageNumber: 3,
        category: 'EXAMINATIONS',
        tokens: 210,
        content: `MANDATORY ATTENDANCE RULE (CLAUSE 14.2):
1. A student MUST maintain a minimum of 75% attendance in lectures, tutorials, and practical laboratory sessions for each registered course to be eligible to appear in the Final Examination.
2. Shortage of Attendance:
   - Students whose attendance falls between 65% and 74.9% due to verified medical emergencies or official university representation may submit an appeal to the Dean through their Department Head.
   - Any student with attendance below 65% shall be STRICTLY DEBARRED from sitting in the Final Exam and will be awarded an 'F' grade in the respective subject.
3. Attendance is recorded digitally in every class and updated live on the Student Mobile Portal within 24 hours.`,
      },
      {
        id: 'chunk-exam-2',
        documentId: 'doc-exams-2026',
        chunkIndex: 1,
        heading: '2. Official 4.00 Grading Scale & CGPA Classification',
        pageNumber: 6,
        category: 'EXAMINATIONS',
        tokens: 230,
        content: `SEMESTER GRADING SYSTEM (4.00 MAXIMUM SCALE):
- Grade 'A'  | 85.0% and above | Grade Points: 4.00 (Outstanding)
- Grade 'A-' | 80.0% – 84.9%   | Grade Points: 3.67 (Excellent)
- Grade 'B+' | 75.0% – 79.9%   | Grade Points: 3.33 (Very Good)
- Grade 'B'  | 70.0% – 74.9%   | Grade Points: 3.00 (Good)
- Grade 'B-' | 65.0% – 69.9%   | Grade Points: 2.67 (Above Average)
- Grade 'C+' | 61.0% – 64.9%   | Grade Points: 2.33 (Average)
- Grade 'C'  | 58.0% – 60.9%   | Grade Points: 2.00 (Satisfactory / Min Pass in Major)
- Grade 'D'  | 50.0% – 57.9%   | Grade Points: 1.00 (Pass / Marginal)
- Grade 'F'  | Below 50.0%     | Grade Points: 0.00 (Fail)
- Grade 'W'  | Official Course Withdrawal before Week 10 (No GPA impact)
- Grade 'I'  | Incomplete (Must be cleared within 4 weeks of subsequent semester)`,
      },
      {
        id: 'chunk-exam-3',
        documentId: 'doc-exams-2026',
        chunkIndex: 2,
        heading: '3. Academic Probation, Dismissal & Repeat Policy',
        pageNumber: 9,
        category: 'EXAMINATIONS',
        tokens: 200,
        content: `ACADEMIC PROBATION & COURSE REPEATS:
1. Academic Probation: If a student's Cumulative Grade Point Average (CGPA) falls below 2.00 at the end of any semester, the student is placed on 'First Academic Probation'.
2. If CGPA remains below 2.00 in the consecutive semester, they are placed on 'Final Probation'.
3. Continued failure to raise CGPA above 2.00 after three consecutive probations results in Academic Dismissal from the program.
4. Repeating Courses: Students are permitted to repeat any course in which they received a grade of 'C-' or below ('C-', 'D', or 'F'). The higher grade replaces the previous grade in CGPA computation, though the transcript will display both attempts.`,
      },
    ],
  },
  {
    id: 'doc-scholarships-2026',
    title: 'University Scholarships & Financial Aid Directory 2026-2027',
    description: 'Merit-based scholarships, need-based tuition waivers, Dean’s Honor List, talent awards, and application criteria.',
    fileName: 'Scholarships_Financial_Aid_Manual_2026.pdf',
    fileSize: 1540000,
    mimeType: 'application/pdf',
    category: 'SCHOLARSHIPS',
    accessLevel: 'STUDENT',
    academicYear: '2026-2027',
    version: '1.2.0',
    status: 'INDEXED',
    uploadedBy: 'Financial Aid Office',
    uploadedAt: '2026-08-25T11:00:00.000Z',
    chunksCount: 2,
    chunks: [
      {
        id: 'chunk-sch-1',
        documentId: 'doc-scholarships-2026',
        chunkIndex: 0,
        heading: '1. Academic Merit Scholarships (Top Positions in Batch)',
        pageNumber: 2,
        category: 'SCHOLARSHIPS',
        tokens: 210,
        content: `UNIVERSITY ACADEMIC MERIT SCHOLARSHIPS:
1. Top Performer Awards (Awarded on semester-by-semester GPA evaluation):
   - 1st Position in Program Batch (CGPA >= 3.85): 100% Tuition Fee Waiver for the following semester.
   - 2nd Position in Program Batch (CGPA >= 3.75): 75% Tuition Fee Waiver for the following semester.
   - 3rd Position in Program Batch (CGPA >= 3.65): 50% Tuition Fee Waiver for the following semester.
2. Dean’s Honor Roll: Awarded to students achieving a semester GPA of 3.60 or higher with full registered academic load (minimum 15 credits) and no disciplinary infractions.
3. Freshmen Merit Scholarships: Awarded at the time of admission to candidates scoring in the top 1% of the University Computing Entry Test.`,
      },
      {
        id: 'chunk-sch-2',
        documentId: 'doc-scholarships-2026',
        chunkIndex: 1,
        heading: '2. Need-Based Financial Assistance & HEC Grants',
        pageNumber: 4,
        category: 'SCHOLARSHIPS',
        tokens: 190,
        content: `NEED-BASED FINANCIAL ASSISTANCE:
1. Scope: Covers up to 75% of tuition fees for deserving students with verified financial need (household income below $600/month or equivalent).
2. Required Documentation:
   - Salary slips or verified business income tax returns of parents/guardians.
   - Electricity, gas, and water utility bills for the past 6 months.
   - Bank statements of all family members for the preceding 12 months.
3. Application Deadline for Fall 2026: October 5, 2026.
4. Physical Interview: Shortlisted candidates appear before the University Financial Aid Committee (UFAC) for in-person verification.`,
      },
    ],
  },
  {
    id: 'doc-faculty-dept-2026',
    title: 'Department of Computer Science — Faculty Directory & Administration',
    description: 'Faculty profiles, designations, qualifications, research areas, office locations, and office hours for the Department of Computer Science.',
    fileName: 'CS_Department_Faculty_Directory_2026.pdf',
    fileSize: 1280000,
    mimeType: 'application/pdf',
    category: 'FACULTY',
    accessLevel: 'STUDENT',
    academicYear: '2026-2027',
    version: '2.0.0',
    status: 'INDEXED',
    uploadedBy: 'Department of Computer Science',
    uploadedAt: '2026-09-01T09:00:00.000Z',
    chunksCount: 2,
    chunks: [
      {
        id: 'chunk-fac-1',
        documentId: 'doc-faculty-dept-2026',
        chunkIndex: 0,
        heading: '1. Department Leadership & Head of Department (HOD)',
        pageNumber: 1,
        category: 'FACULTY',
        tokens: 195,
        content: `HEAD OF COMPUTER SCIENCE DEPARTMENT & DEAN:
- Head of the Computer Science Department (Chairperson): Dr. Sarah Chen, Ph.D. in Computer Science (Stanford University).
  Email: sarah.chen@university.edu
  Office: Turing Hall, Block A, Room A-304
  Office Phone: +1 (555) 019-4821 (Ext. 101)
  Office Consultation Hours: Tuesdays & Thursdays from 2:00 PM to 4:00 PM.
  Research Specialization: Distributed Systems, High-Performance Computing, AI Acceleration.
- Dean of the Faculty of Computing & Information Sciences: Dr. Marcus Vance, Ph.D.
  Email: marcus.vance@university.edu
  Office: Administration Complex, 2nd Floor, Suite 210.
  Office Hours: Wednesdays 10:00 AM – 12:00 PM (Prior appointment via dean.computing@university.edu).`,
      },
      {
        id: 'chunk-fac-2',
        documentId: 'doc-faculty-dept-2026',
        chunkIndex: 1,
        heading: '2. Key Faculty Members & Student Academic Advisors',
        pageNumber: 3,
        category: 'FACULTY',
        tokens: 210,
        content: `FACULTY DIRECTORY — COMPUTER SCIENCE & SOFTWARE ENGINEERING:
- Dr. Alan Thorne, Ph.D. (Associate Professor & Head of Software Engineering):
  Office: Lovelace Center, Room B-112 | Email: alan.thorne@university.edu | Hours: Mon & Wed 1:30 PM - 3:30 PM.
- Dr. Fatima Zahra, Ph.D. (Assistant Professor, Data Science & Machine Learning):
  Office: Von Neumann Center, Room D-205 | Email: fatima.zahra@university.edu | Hours: Mon & Fri 11:00 AM - 1:00 PM.
- Prof. David K. Miller (Senior Lecturer & Chief Undergraduate Student Advisor):
  Office: Turing Hall, Room A-108 | Email: david.miller@university.edu | Hours: Daily 9:00 AM - 11:00 AM.
  Specialization: Degree roadmaps, course registration overrides, credit transfers, and probation counseling.`,
      },
    ],
  },
  {
    id: 'doc-hostel-2026',
    title: 'University Residential Hostels Code of Conduct & Bylaws 2026',
    description: 'Hostel room allocation, curfew hours, visitor regulations, mess rules, laundry facilities, and safety guidelines.',
    fileName: 'Hostel_Rules_and_Residential_Handbook_2026.pdf',
    fileSize: 1980000,
    mimeType: 'application/pdf',
    category: 'HOSTEL',
    accessLevel: 'STUDENT',
    academicYear: '2026-2027',
    version: '1.5.0',
    status: 'INDEXED',
    uploadedBy: 'Chief Provost & Residential Life Committee',
    uploadedAt: '2026-08-10T12:00:00.000Z',
    chunksCount: 2,
    chunks: [
      {
        id: 'chunk-hos-1',
        documentId: 'doc-hostel-2026',
        chunkIndex: 0,
        heading: '1. Curfew Timings, Night Passes & Visitor Rules',
        pageNumber: 2,
        category: 'HOSTEL',
        tokens: 220,
        content: `HOSTEL RULES & RESIDENTIAL DISCIPLINE:
1. Curfew & Gate Closure:
   - The hostel main entry gates close strictly at 10:00 PM daily.
   - Biometric attendance is recorded at the hostel gates between 9:00 PM and 10:00 PM.
   - Any resident arriving after 10:00 PM without an authorized pass is issued a disciplinary notice. Three late entries result in cancellation of hostel accommodation.
2. Night-Out / Weekend Passes:
   - Residents traveling home or staying overnight off-campus must submit an e-pass request on the Student Portal at least 24 hours in advance with verified parental consent via SMS/Email.
3. Quiet Hours: 11:00 PM to 6:00 AM. Loud music, noise, and gatherings in corridors during quiet hours are strictly prohibited.
4. Visitor Timings: Authorized visitors are permitted only in the central visitor lounge between 4:00 PM and 7:00 PM. Visitors are not allowed inside resident rooms.`,
      },
      {
        id: 'chunk-hos-2',
        documentId: 'doc-hostel-2026',
        chunkIndex: 1,
        heading: '2. Allotment, Mess Fees & Anti-Ragging Policy',
        pageNumber: 5,
        category: 'HOSTEL',
        tokens: 195,
        content: `HOSTEL FEES, MESS CHARGES & CODE OF CONDUCT:
1. Accommodation Charges:
   - Bi-annual Hostel Room Rent (Shared Occupancy - 2 students): $600 per semester.
   - Monthly Mess & Dining Charges: $250 per month (inclusive of breakfast, lunch, and dinner).
   - Mess dues must be cleared by the 10th of each calendar month.
2. Strictly Prohibited Items: Electric heaters, high-voltage appliances (>500W), tobacco, vapes, narcotics, and weapons.
3. Zero Tolerance Anti-Ragging Regulation: Ragging in any physical, verbal, or mental form is a non-bailable offense leading to immediate expulsion from the university and legal prosecution.`,
      },
    ],
  },
  {
    id: 'doc-campus-lib-trans-2026',
    title: 'Campus Services, Central Library & Transportation Guide 2026',
    description: 'Central library lending rules, opening hours, digital IEEE/ACM access, campus shuttle routes, bus pass fee, and health clinic.',
    fileName: 'Campus_Facilities_Library_Transport_Guide_2026.pdf',
    fileSize: 2150000,
    mimeType: 'application/pdf',
    category: 'CAMPUS',
    accessLevel: 'STUDENT',
    academicYear: '2026-2027',
    version: '1.3.0',
    status: 'INDEXED',
    uploadedBy: 'Campus Facilities Directorate',
    uploadedAt: '2026-08-18T15:00:00.000Z',
    chunksCount: 2,
    chunks: [
      {
        id: 'chunk-camp-1',
        documentId: 'doc-campus-lib-trans-2026',
        chunkIndex: 0,
        heading: '1. Central Library Timings, Borrowing Privileges & Digital Access',
        pageNumber: 3,
        category: 'LIBRARY',
        tokens: 210,
        content: `CENTRAL LIBRARY REGULATIONS:
1. Operational Hours:
   - Monday to Friday: 8:00 AM – 10:00 PM
   - Saturday & Sunday: 9:00 AM – 6:00 PM
   - Exam Weeks (Midterms & Finals): Open 24/7 with overnight study halls.
2. Borrowing Privileges:
   - Undergraduate Students: Up to 4 books for 14 days (renewable once online).
   - Graduate Students: Up to 8 books for 30 days.
   - Late Overdue Fine: $1.00 per book per day.
3. Digital Resources & Research Access:
   - Free campus-wide and VPN access to IEEE Xplore, ACM Digital Library, SpringerLink, ScienceDirect, and JSTOR.
   - High-speed research computer workstations located in the Digital Commons on the 2nd floor.`,
      },
      {
        id: 'chunk-camp-2',
        documentId: 'doc-campus-lib-trans-2026',
        chunkIndex: 1,
        heading: '2. Campus Shuttle Network & City Transportation Passes',
        pageNumber: 6,
        category: 'TRANSPORTATION',
        tokens: 185,
        content: `CAMPUS TRANSPORTATION NETWORK:
1. Fleet & Routes: The university operates 6 dedicated shuttle routes covering all major residential sectors, subway stations, and downtown terminals.
2. Morning Inbound Times: Shuttles depart starting points at 7:00 AM and 7:30 AM to reach campus before 8:30 AM lectures.
3. Evening Outbound Times: Departures from Turing Hall Transport Stand at 3:30 PM, 5:15 PM, and 7:30 PM.
4. Transport Subscription:
   - Semester Transportation Pass: $120 per semester.
   - RFID cards must be scanned upon boarding each shuttle.
   - Emergency medical shuttle to the University Health Center is available 24/7 by calling Ext. 999.`,
      },
    ],
  },
  {
    id: 'doc-calendar-2026',
    title: 'University Academic Calendar AY 2026-2027',
    description: 'Semester timeline, course registration, add/drop week, midterm exam week, final exams, spring break, and convocation.',
    fileName: 'Official_Academic_Calendar_2026_2027.pdf',
    fileSize: 1120000,
    mimeType: 'application/pdf',
    category: 'ACADEMICS',
    accessLevel: 'STUDENT',
    academicYear: '2026-2027',
    version: '1.0.0',
    status: 'INDEXED',
    uploadedBy: 'Registrar Office',
    uploadedAt: '2026-08-01T08:00:00.000Z',
    chunksCount: 1,
    chunks: [
      {
        id: 'chunk-cal-1',
        documentId: 'doc-calendar-2026',
        chunkIndex: 0,
        heading: '1. Fall 2026 & Spring 2027 Academic Timeline',
        pageNumber: 1,
        category: 'ACADEMICS',
        tokens: 220,
        content: `ACADEMIC CALENDAR DATES 2026-2027:
- Fall 2026 Semester:
  - Commencement of Classes: September 14, 2026
  - Course Add / Drop Deadline: September 25, 2026
  - Midterm Examination Week: November 2 – November 7, 2026
  - Last Date to Withdraw from Course (Grade 'W'): November 20, 2026
  - End of Regular Classes: December 11, 2026
  - Final Examination Period: December 14 – December 23, 2026
  - Semester Result Declaration: January 8, 2027
  - Winter Break: December 24, 2026 – January 24, 2027
- Spring 2027 Semester:
  - Course Registration: January 25 – January 29, 2027
  - Commencement of Classes: February 1, 2027
  - Spring Break: March 22 – March 26, 2027
  - Final Examinations: May 24 – June 4, 2027`,
      },
    ],
  },
];
