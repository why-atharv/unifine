// Client-side mock backend for UniFine.
// Completely eliminates the need for an external database, Prisma, or serverless functions.
// Persists changes to localStorage so demoing fine assignments, corrections, notifications, etc. works seamlessly!

import type { SessionUser, StudentT, FineT, OffenceT, AuditT, RuleEntryT, NotificationT, SummaryT } from "@/components/unifine/types";

const STORAGE_PREFIX = "unifine_mock_";

function getStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {}
}

const now = new Date();
const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();
const daysAhead = (n: number) => new Date(Date.now() + n * 86400000).toISOString();

/* ── Pre-seeded Users ── */
export interface MockUserRecord {
  id: string;
  email: string;
  password: string;
  name: string;
  role: "ADMIN" | "FACULTY" | "STUDENT";
  rollNumber?: string | null;
  department?: string | null;
  designation?: string | null;
  status: string;
}

const INITIAL_USERS: MockUserRecord[] = [
  {
    id: "user-admin-1",
    email: "admin@krmu.edu.in",
    password: "Admin@123",
    name: "Dr. Meera Kapoor",
    role: "ADMIN",
    designation: "Dean, Student Affairs",
    department: "Administration",
    status: "ACTIVE",
  },
  {
    id: "user-faculty-1",
    email: "rajesh.choudhary@krmangalam.edu.in",
    password: "Faculty@123",
    name: "Prof. Rajesh Choudhary",
    role: "FACULTY",
    designation: "Associate Professor",
    department: "School of Engineering & Technology",
    status: "ACTIVE",
  },
  {
    id: "user-faculty-2",
    email: "neha.sharma@krmangalam.edu.in",
    password: "Faculty@123",
    name: "Dr. Neha Sharma",
    role: "FACULTY",
    designation: "Professor & Proctor",
    department: "School of Management & Commerce",
    status: "ACTIVE",
  },
  {
    id: "user-student-1",
    email: "2201560042@krmu.edu.in",
    password: "Student@123",
    name: "Aarav Choudhary",
    role: "STUDENT",
    rollNumber: "2201560042",
    department: "School of Engineering & Technology",
    designation: "B.Tech CSE · 3rd Year",
    status: "ACTIVE",
  },
];

/* ── Pre-seeded Students ── */
const INITIAL_STUDENTS: StudentT[] = [
  { id: "std-1", rollNumber: "2201560042", name: "Aarav Choudhary", email: "2201560042@krmu.edu.in", photoColor: "#3b82f6", department: "School of Engineering & Technology", programme: "B.Tech CSE", year: "3rd Year", status: "ACTIVE" },
  { id: "std-2", rollNumber: "2301560117", name: "Priya Sharma", email: "2301560117@krmu.edu.in", photoColor: "#8b5cf6", department: "School of Engineering & Technology", programme: "B.Tech CSE", year: "2nd Year", status: "ACTIVE" },
  { id: "std-3", rollNumber: "2101400089", name: "Rohan Verma", email: "2101400089@krmu.edu.in", photoColor: "#f59e0b", department: "School of Engineering & Technology", programme: "B.Tech ECE", year: "4th Year", status: "ACTIVE" },
  { id: "std-4", rollNumber: "2301410034", name: "Kabir Singh", email: "2301410034@krmu.edu.in", photoColor: "#10b981", department: "School of Engineering & Technology", programme: "B.Tech ME", year: "2nd Year", status: "ACTIVE" },
  { id: "std-5", rollNumber: "2401620206", name: "Ananya Gupta", email: "2401620206@krmu.edu.in", photoColor: "#ec4899", department: "School of Engineering & Technology", programme: "B.Tech CSE (AI/ML)", year: "1st Year", status: "ACTIVE" },
  { id: "std-6", rollNumber: "2202110121", name: "Ishita Jain", email: "2202110121@krmu.edu.in", photoColor: "#06b6d4", department: "School of Management & Commerce", programme: "BBA", year: "3rd Year", status: "ACTIVE" },
  { id: "std-7", rollNumber: "2302160058", name: "Arjun Mehta", email: "2302160058@krmu.edu.in", photoColor: "#ef4444", department: "School of Management & Commerce", programme: "B.Com (Hons)", year: "2nd Year", status: "ACTIVE" },
  { id: "std-8", rollNumber: "2203010093", name: "Sneha Reddy", email: "2203010093@krmu.edu.in", photoColor: "#14b8a6", department: "School of Law", programme: "BA LLB (Hons)", year: "3rd Year", status: "ACTIVE" },
  { id: "std-9", rollNumber: "2103020147", name: "Vikas Yadav", email: "2103020147@krmu.edu.in", photoColor: "#a855f7", department: "School of Law", programme: "BBA LLB", year: "4th Year", status: "ACTIVE" },
  { id: "std-10", rollNumber: "2304010076", name: "Neha Kaur", email: "2304010076@krmu.edu.in", photoColor: "#f97316", department: "School of Pharmacy", programme: "B.Pharm", year: "2nd Year", status: "ACTIVE" },
  { id: "std-11", rollNumber: "2204020102", name: "Aditya Ranjan", email: "2204020102@krmu.edu.in", photoColor: "#0ea5e9", department: "School of Pharmacy", programme: "D.Pharm", year: "3rd Year", status: "ACTIVE" },
  { id: "std-12", rollNumber: "2405010188", name: "Pooja Bhatt", email: "2405010188@krmu.edu.in", photoColor: "#22c55e", department: "School of Basic Sciences", programme: "B.Sc (Hons) Maths", year: "1st Year", status: "ACTIVE" },
];

/* ── Pre-seeded Offences ── */
const INITIAL_OFFENCES: OffenceT[] = [
  { id: "off-1", code: "OFF-001", name: "Dress Code Violation", description: "Not adhering to the prescribed dress code / ID dress norms on campus.", ruleRef: "Rule D-07", category: "Dress & Conduct", amount: 200, active: true },
  { id: "off-2", code: "OFF-002", name: "Late Arrival to Class", description: "Reporting to class after the permitted grace period.", ruleRef: "Rule A-03", category: "Academics", amount: 100, active: true },
  { id: "off-3", code: "OFF-003", name: "Mobile Phone Usage in Class", description: "Using mobile phones during lectures without faculty permission.", ruleRef: "Rule D-02", category: "Dress & Conduct", amount: 300, active: true },
  { id: "off-4", code: "OFF-004", name: "Littering on Campus", description: "Disposing waste outside designated bins in campus premises.", ruleRef: "Rule C-05", category: "Campus Discipline", amount: 250, active: true },
  { id: "off-5", code: "OFF-005", name: "Ragging (Major)", description: "Ragging in any form — strict action as per UGC Anti-Ragging norms.", ruleRef: "Rule D-11", category: "Major Discipline", amount: 5000, active: true },
  { id: "off-6", code: "OFF-006", name: "Library Book Overdue", description: "Failure to return borrowed library books within the due period.", ruleRef: "Rule L-04", category: "Library", amount: 50, active: true },
  { id: "off-7", code: "OFF-007", name: "Cafeteria Misconduct", description: "Indiscipline / queue jumping / misconduct inside cafeteria premises.", ruleRef: "Rule C-09", category: "Campus Discipline", amount: 150, active: true },
  { id: "off-8", code: "OFF-008", name: "Parking Violation", description: "Vehicle parked outside designated parking zones.", ruleRef: "Rule V-02", category: "Campus Discipline", amount: 300, active: true },
  { id: "off-9", code: "OFF-009", name: "Hostel Noise Violation", description: "Creating disturbance in hostel premises after quiet hours.", ruleRef: "Rule H-06", category: "Hostel", amount: 400, active: true },
  { id: "off-10", code: "OFF-010", name: "Identity Card Not Carried", description: "Failing to produce valid KRMU identity card on demand.", ruleRef: "Rule D-05", category: "Dress & Conduct", amount: 100, active: true },
  { id: "off-11", code: "OFF-011", name: "Low Attendance (Below 75%)", description: "Attendance below the mandatory 75% as per university norms.", ruleRef: "Rule A-08", category: "Academics", amount: 500, active: true },
  { id: "off-12", code: "OFF-012", name: "Vandalism / Property Damage", description: "Damage to university property — fine plus recovery as applicable.", ruleRef: "Rule P-01", category: "Major Discipline", amount: 2000, active: true },
  { id: "off-13", code: "OFF-013", name: "Exam Hall Misconduct", description: "Unauthorised material / indiscipline inside examination hall.", ruleRef: "Rule E-03", category: "Examinations", amount: 1000, active: true },
  { id: "off-14", code: "OFF-014", name: "Smoking / Tobacco on Campus", description: "Possession or use of tobacco products inside campus (Zero-tolerance).", ruleRef: "Rule H-12", category: "Major Discipline", amount: 3000, active: true },
  { id: "off-15", code: "OFF-015", name: "Corridor Loitering / Rowdyism", description: "Loitering in corridors during class hours and disturbing classes.", ruleRef: "Rule C-03", category: "Campus Discipline", amount: 200, active: false },
];

/* ── Pre-seeded Fines ── */
const INITIAL_FINES: FineT[] = [
  {
    id: "fine-1",
    studentId: "std-1",
    offenceId: "off-3",
    issuedById: "user-faculty-1",
    amountSnapshot: 300,
    reason: "Using phone during Data Structures lecture (Block C, Room 214).",
    issueDate: daysAgo(118),
    dueDate: daysAgo(104),
    status: "PAID",
    corrected: false,
    paymentDate: daysAgo(111),
    student: { id: "std-1", name: "Aarav Choudhary", rollNumber: "2201560042", programme: "B.Tech CSE", photoColor: "#3b82f6", department: "School of Engineering & Technology" },
    offence: { id: "off-3", name: "Mobile Phone Usage in Class", code: "OFF-003", ruleRef: "Rule D-02", category: "Dress & Conduct" },
    issuedBy: { id: "user-faculty-1", name: "Prof. Rajesh Choudhary" },
  },
  {
    id: "fine-2",
    studentId: "std-1",
    offenceId: "off-6",
    issuedById: "user-faculty-1",
    amountSnapshot: 50,
    reason: "'Introduction to Algorithms' not returned past due date.",
    issueDate: daysAgo(90),
    dueDate: daysAgo(76),
    status: "PAID",
    corrected: false,
    paymentDate: daysAgo(83),
    student: { id: "std-1", name: "Aarav Choudhary", rollNumber: "2201560042", programme: "B.Tech CSE", photoColor: "#3b82f6", department: "School of Engineering & Technology" },
    offence: { id: "off-6", name: "Library Book Overdue", code: "OFF-006", ruleRef: "Rule L-04", category: "Library" },
    issuedBy: { id: "user-faculty-1", name: "Prof. Rajesh Choudhary" },
  },
  {
    id: "fine-3",
    studentId: "std-1",
    offenceId: "off-1",
    issuedById: "user-faculty-2",
    amountSnapshot: 200,
    reason: "Found in casuals during official university event.",
    issueDate: daysAgo(47),
    dueDate: daysAgo(33),
    status: "PAID",
    corrected: false,
    paymentDate: daysAgo(40),
    student: { id: "std-1", name: "Aarav Choudhary", rollNumber: "2201560042", programme: "B.Tech CSE", photoColor: "#3b82f6", department: "School of Engineering & Technology" },
    offence: { id: "off-1", name: "Dress Code Violation", code: "OFF-001", ruleRef: "Rule D-07", category: "Dress & Conduct" },
    issuedBy: { id: "user-faculty-2", name: "Dr. Neha Sharma" },
  },
  {
    id: "fine-4",
    studentId: "std-1",
    offenceId: "off-2",
    issuedById: "user-faculty-1",
    amountSnapshot: 100,
    reason: "Reported 20 minutes late to OS lab session.",
    issueDate: daysAgo(12),
    dueDate: daysAgo(2),
    status: "OVERDUE",
    corrected: false,
    paymentDate: null,
    student: { id: "std-1", name: "Aarav Choudhary", rollNumber: "2201560042", programme: "B.Tech CSE", photoColor: "#3b82f6", department: "School of Engineering & Technology" },
    offence: { id: "off-2", name: "Late Arrival to Class", code: "OFF-002", ruleRef: "Rule A-03", category: "Academics" },
    issuedBy: { id: "user-faculty-1", name: "Prof. Rajesh Choudhary" },
  },
  {
    id: "fine-5",
    studentId: "std-1",
    offenceId: "off-10",
    issuedById: "user-faculty-2",
    amountSnapshot: 100,
    reason: "ID card not produced at main gate check.",
    issueDate: daysAgo(6),
    dueDate: daysAhead(9),
    status: "PENDING",
    corrected: true,
    paymentDate: null,
    student: { id: "std-1", name: "Aarav Choudhary", rollNumber: "2201560042", programme: "B.Tech CSE", photoColor: "#3b82f6", department: "School of Engineering & Technology" },
    offence: { id: "off-10", name: "Identity Card Not Carried", code: "OFF-010", ruleRef: "Rule D-05", category: "Dress & Conduct" },
    issuedBy: { id: "user-faculty-2", name: "Dr. Neha Sharma" },
  },
  {
    id: "fine-6",
    studentId: "std-2",
    offenceId: "off-1",
    issuedById: "user-faculty-2",
    amountSnapshot: 200,
    reason: "Dress code violation at Academic Block A.",
    issueDate: daysAgo(62),
    dueDate: daysAgo(48),
    status: "PAID",
    corrected: false,
    paymentDate: daysAgo(55),
    student: { id: "std-2", name: "Priya Sharma", rollNumber: "2301560117", programme: "B.Tech CSE", photoColor: "#8b5cf6", department: "School of Engineering & Technology" },
    offence: { id: "off-1", name: "Dress Code Violation", code: "OFF-001", ruleRef: "Rule D-07", category: "Dress & Conduct" },
    issuedBy: { id: "user-faculty-2", name: "Dr. Neha Sharma" },
  },
  {
    id: "fine-7",
    studentId: "std-2",
    offenceId: "off-2",
    issuedById: "user-faculty-1",
    amountSnapshot: 100,
    reason: "Late to morning lecture twice in the same week.",
    issueDate: daysAgo(20),
    dueDate: daysAhead(6),
    status: "PENDING",
    corrected: false,
    paymentDate: null,
    student: { id: "std-2", name: "Priya Sharma", rollNumber: "2301560117", programme: "B.Tech CSE", photoColor: "#8b5cf6", department: "School of Engineering & Technology" },
    offence: { id: "off-2", name: "Late Arrival to Class", code: "OFF-002", ruleRef: "Rule A-03", category: "Academics" },
    issuedBy: { id: "user-faculty-1", name: "Prof. Rajesh Choudhary" },
  },
  {
    id: "fine-8",
    studentId: "std-3",
    offenceId: "off-8",
    issuedById: "user-faculty-2",
    amountSnapshot: 300,
    reason: "Bike parked at Block-B entrance (no-parking zone).",
    issueDate: daysAgo(75),
    dueDate: daysAgo(61),
    status: "PAID",
    corrected: false,
    paymentDate: daysAgo(68),
    student: { id: "std-3", name: "Rohan Verma", rollNumber: "2101400089", programme: "B.Tech ECE", photoColor: "#f59e0b", department: "School of Engineering & Technology" },
    offence: { id: "off-8", name: "Parking Violation", code: "OFF-008", ruleRef: "Rule V-02", category: "Campus Discipline" },
    issuedBy: { id: "user-faculty-2", name: "Dr. Neha Sharma" },
  },
  {
    id: "fine-9",
    studentId: "std-3",
    offenceId: "off-4",
    issuedById: "user-faculty-1",
    amountSnapshot: 250,
    reason: "Littered near food court seating area.",
    issueDate: daysAgo(30),
    dueDate: daysAhead(16),
    status: "PENDING",
    corrected: false,
    paymentDate: null,
    student: { id: "std-3", name: "Rohan Verma", rollNumber: "2101400089", programme: "B.Tech ECE", photoColor: "#f59e0b", department: "School of Engineering & Technology" },
    offence: { id: "off-4", name: "Littering on Campus", code: "OFF-004", ruleRef: "Rule C-05", category: "Campus Discipline" },
    issuedBy: { id: "user-faculty-1", name: "Prof. Rajesh Choudhary" },
  },
  {
    id: "fine-10",
    studentId: "std-3",
    offenceId: "off-11",
    issuedById: "user-faculty-1",
    amountSnapshot: 500,
    reason: "Attendance 68% in Digital Signal Processing — below mandate.",
    issueDate: daysAgo(15),
    dueDate: daysAgo(1),
    status: "OVERDUE",
    corrected: false,
    paymentDate: null,
    student: { id: "std-3", name: "Rohan Verma", rollNumber: "2101400089", programme: "B.Tech ECE", photoColor: "#f59e0b", department: "School of Engineering & Technology" },
    offence: { id: "off-11", name: "Low Attendance (Below 75%)", code: "OFF-011", ruleRef: "Rule A-08", category: "Academics" },
    issuedBy: { id: "user-faculty-1", name: "Prof. Rajesh Choudhary" },
  },
];

/* ── Pre-seeded Rules ── */
const INITIAL_RULES: RuleEntryT[] = [
  { id: "rule-1", category: "Code of Conduct", title: "Dress Code & Grooming", content: "Students must wear the prescribed dress code on all working days and university events. Casuals (slippers, ripped jeans, graphic tees) are not permitted in academic blocks, library and administrative offices.", ruleRef: "Rule D-07", active: true, version: 1 },
  { id: "rule-2", category: "Code of Conduct", title: "Identity Card", content: "The KRMU identity card must be carried at all times and produced on demand to any faculty / security / proctorial staff. Loss of card must be reported within 48 hours.", ruleRef: "Rule D-05", active: true, version: 1 },
  { id: "rule-3", category: "Code of Conduct", title: "Mobile Phone Usage", content: "Mobile phones must be on silent mode inside lecture halls, labs and the library. Usage during academic sessions is prohibited without explicit faculty permission.", ruleRef: "Rule D-02", active: true, version: 1 },
  { id: "rule-4", category: "Academics", title: "Attendance Requirement", content: "A minimum of 75% attendance in every course (theory + practical separately) is mandatory to appear in end-term examinations. A fine and parental notice apply below the threshold.", ruleRef: "Rule A-08", active: true, version: 1 },
  { id: "rule-5", category: "Academics", title: "Punctuality", content: "Students arriving after the permitted grace period of 5 minutes may be marked absent and are liable for a late-arrival fine. Repeated instances escalate to proctorial review.", ruleRef: "Rule A-03", active: true, version: 1 },
  { id: "rule-6", category: "Academics", title: "Examination Hall Discipline", content: "Only University-issued hall tickets and transparent pencil pouches are allowed inside examination halls. Possession of unauthorised material constitutes unfair means.", ruleRef: "Rule E-03", active: true, version: 1 },
  { id: "rule-7", category: "Library", title: "Book Return & Overdue", content: "Borrowed books must be returned on or before the due date. An overdue fine per day per book applies as per the library schedule. Reference books are not issuable.", ruleRef: "Rule L-04", active: true, version: 1 },
  { id: "rule-8", category: "Hostel", title: "Quiet Hours", content: "Quiet hours are from 10:30 PM to 6:00 AM. Loud music, speakers and gatherings are prohibited during this window in all hostel blocks.", ruleRef: "Rule H-06", active: true, version: 1 },
  { id: "rule-9", category: "Campus & Facilities", title: "Waste Management", content: "Waste must be disposed only in designated bins. Littering anywhere within the campus is a punishable offence under the campus cleanliness policy.", ruleRef: "Rule C-05", active: true, version: 1 },
  { id: "rule-10", category: "Campus & Facilities", title: "Vehicle Parking", content: "Two-wheelers and four-wheelers must be parked only in marked zones with a valid campus vehicle sticker. Blocking driveways, gates or green zones attracts towing plus fine.", ruleRef: "Rule V-02", active: true, version: 1 },
  { id: "rule-11", category: "Anti-Ragging", title: "UGC Anti-Ragging Norms", content: "Ragging in any form is strictly prohibited as per UGC regulations and Supreme Court directives. Complaints are acted upon within 24 hours by the Anti-Ragging Committee.", ruleRef: "Rule D-11", active: true, version: 1 },
];

/* ── Pre-seeded Notifications ── */
const INITIAL_NOTIFICATIONS: NotificationT[] = [
  { id: "notif-1", audience: "USER", userId: "std-1", type: "FINE_ISSUED", title: "New fine issued — Late Arrival", message: "A fine of ₹100 (Rule A-03) was issued by Prof. Rajesh Choudhary. Due date passed.", read: false, createdAt: daysAgo(12) },
  { id: "notif-2", audience: "USER", userId: "std-1", type: "FINE_ISSUED", title: "New fine issued — Identity Card", message: "A fine of ₹100 (Rule D-05) was issued by Dr. Neha Sharma. Please clear before due date.", read: false, createdAt: daysAgo(6) },
  { id: "notif-3", audience: "USER", userId: "std-1", type: "STATUS", title: "Fine marked OVERDUE", message: "Your fine for 'Late Arrival to Class' crossed its due date. Clear it at accounts counter.", read: false, createdAt: daysAgo(2) },
  { id: "notif-4", audience: "USER", userId: "std-1", type: "PAYMENT", title: "Payment received — thank you!", message: "Your payment of ₹200 for 'Dress Code Violation' was received successfully.", read: true, createdAt: daysAgo(40) },
  { id: "notif-5", audience: "FACULTY", userId: null, type: "GENERAL", title: "Semester fine drive", message: "Proctorial office: please review pending fines for your assigned classes before mid-terms begin.", read: false, createdAt: daysAgo(3) },
  { id: "notif-6", audience: "ADMIN", userId: null, type: "GENERAL", title: "Monthly reconciliation due", message: "Accounts reconciliation for last month is due. Please export the summary report from Reports.", read: false, createdAt: daysAgo(2) },
  { id: "notif-7", audience: "ALL", userId: null, type: "GENERAL", title: "Rule book updated", message: "The KRMU discipline rule book has been updated with the latest Anti-Ragging norms.", read: false, createdAt: daysAgo(1) },
];

/* ── Pre-seeded Audits ── */
const INITIAL_AUDITS: AuditT[] = [
  {
    id: "audit-1",
    fineId: "fine-5",
    actorId: "user-admin-1",
    actorName: "Dr. Meera Kapoor",
    action: "CORRECTED",
    oldValues: JSON.stringify({ reason: "Original entry", amount: 100 }),
    newValues: JSON.stringify({ reason: "ID card not produced at main gate check.", amount: 100 }),
    note: "Reason refined after gate-register cross-check.",
    createdAt: daysAgo(4),
    fine: { id: "fine-5", student: { name: "Aarav Choudhary", rollNumber: "2201560042" }, offence: { name: "Identity Card Not Carried", code: "OFF-010" } },
  },
  {
    id: "audit-2",
    fineId: "fine-4",
    actorId: "user-faculty-1",
    actorName: "Prof. Rajesh Choudhary",
    action: "CREATED",
    oldValues: null,
    newValues: JSON.stringify({ status: "PENDING", amount: 100, offence: "Late Arrival to Class" }),
    note: "Fine issued via UniFine portal.",
    createdAt: daysAgo(12),
    fine: { id: "fine-4", student: { name: "Aarav Choudhary", rollNumber: "2201560042" }, offence: { name: "Late Arrival to Class", code: "OFF-002" } },
  },
  {
    id: "audit-3",
    fineId: "fine-1",
    actorId: "user-admin-1",
    actorName: "Dr. Meera Kapoor",
    action: "MARKED_PAID",
    oldValues: JSON.stringify({ status: "PENDING" }),
    newValues: JSON.stringify({ status: "PAID" }),
    note: "Payment confirmed at accounts counter.",
    createdAt: daysAgo(111),
    fine: { id: "fine-1", student: { name: "Aarav Choudhary", rollNumber: "2201560042" }, offence: { name: "Mobile Phone Usage in Class", code: "OFF-003" } },
  },
];

/* ── Storage accessors ── */
export function getMockUsers(): MockUserRecord[] {
  return getStorage("users", INITIAL_USERS);
}
export function saveMockUsers(users: MockUserRecord[]): void {
  setStorage("users", users);
}

export function getMockStudents(): StudentT[] {
  return getStorage("students", INITIAL_STUDENTS);
}
export function saveMockStudents(students: StudentT[]): void {
  setStorage("students", students);
}

export function getMockOffences(): OffenceT[] {
  return getStorage("offences", INITIAL_OFFENCES);
}
export function saveMockOffences(offences: OffenceT[]): void {
  setStorage("offences", offences);
}

export function getMockFines(): FineT[] {
  const fines = getStorage("fines", INITIAL_FINES);
  // Auto-update overdue fines
  const nowTime = Date.now();
  let changed = false;
  for (const f of fines) {
    if (f.status === "PENDING" && new Date(f.dueDate).getTime() < nowTime) {
      f.status = "OVERDUE";
      changed = true;
    }
  }
  if (changed) setStorage("fines", fines);
  return fines;
}
export function saveMockFines(fines: FineT[]): void {
  setStorage("fines", fines);
}

export function getMockRules(): RuleEntryT[] {
  return getStorage("rules", INITIAL_RULES);
}
export function saveMockRules(rules: RuleEntryT[]): void {
  setStorage("rules", rules);
}

export function getMockNotifications(): NotificationT[] {
  return getStorage("notifications", INITIAL_NOTIFICATIONS);
}
export function saveMockNotifications(notifs: NotificationT[]): void {
  setStorage("notifications", notifs);
}

export function getMockAudits(): AuditT[] {
  return getStorage("audits", INITIAL_AUDITS);
}
export function saveMockAudits(audits: AuditT[]): void {
  setStorage("audits", audits);
}

/* ── Authentication ── */
export function mockSignIn(emailOrRoll: string, password: string): { user: SessionUser; student: StudentT | null } {
  const query = emailOrRoll.trim().toLowerCase();
  const users = getMockUsers();
  const students = getMockStudents();

  // match by email or rollNumber
  const user = users.find(
    (u) => u.email.toLowerCase() === query || (u.rollNumber && u.rollNumber.toLowerCase() === query)
  );

  if (!user || user.password !== password) {
    throw new Error("Invalid credentials. Please check and try again.");
  }
  if (user.status !== "ACTIVE") {
    throw new Error("Account is inactive. Contact the administrator.");
  }

  let student: StudentT | null = null;
  if (user.role === "STUDENT" && user.rollNumber) {
    student = students.find((s) => s.rollNumber === user.rollNumber) ?? null;
  }

  const sessionUser: SessionUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    rollNumber: user.rollNumber ?? null,
    department: user.department ?? null,
    designation: user.designation ?? null,
    token: `mock-token-${user.id}-${Date.now()}`,
  };

  return { user: sessionUser, student };
}

export function mockSignUp(data: {
  role: "STUDENT" | "FACULTY";
  name: string;
  email: string;
  password: string;
  rollNumber?: string;
  department?: string;
  programme?: string;
  year?: string;
  designation?: string;
}): { user: SessionUser; student: StudentT | null } {
  const users = getMockUsers();
  const students = getMockStudents();

  if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
    throw new Error("An account with this email already exists.");
  }

  const userId = `user-custom-${Date.now()}`;
  let student: StudentT | null = null;

  if (data.role === "STUDENT") {
    const roll = data.rollNumber?.trim() || "";
    if (students.some((s) => s.rollNumber === roll)) {
      throw new Error(`A student with roll number ${roll} is already registered.`);
    }
    const stdId = `std-custom-${Date.now()}`;
    student = {
      id: stdId,
      rollNumber: roll,
      name: data.name,
      email: data.email,
      photoColor: "#3b82f6",
      department: data.department || "School of Engineering & Technology",
      programme: data.programme || "B.Tech CSE",
      year: data.year || "1st Year",
      status: "ACTIVE",
    };
    students.push(student);
    saveMockStudents(students);
  }

  const newUser: MockUserRecord = {
    id: userId,
    email: data.email,
    password: data.password,
    name: data.name,
    role: data.role,
    rollNumber: data.rollNumber ?? null,
    department: data.department ?? null,
    designation: data.role === "STUDENT" ? `${data.programme} · ${data.year}` : data.designation ?? null,
    status: "ACTIVE",
  };
  users.push(newUser);
  saveMockUsers(users);

  const sessionUser: SessionUser = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    rollNumber: newUser.rollNumber ?? null,
    department: newUser.department ?? null,
    designation: newUser.designation ?? null,
    token: `mock-token-${newUser.id}-${Date.now()}`,
  };

  return { user: sessionUser, student };
}

/* ── Central Mock API Router ── */
export async function handleMockApi<T>(session: SessionUser | null, path: string, init?: RequestInit): Promise<T> {
  const method = (init?.method || "GET").toUpperCase();
  const url = new URL(path, "http://localhost");
  const pathname = url.pathname;
  const body = init?.body ? JSON.parse(init.body as string) : null;

  // 1. Notifications
  if (pathname === "/api/notifications") {
    const notifs = getMockNotifications();
    if (method === "GET") {
      let filtered = notifs;
      if (session) {
        if (session.role === "STUDENT") {
          filtered = notifs.filter((n) => n.audience === "ALL" || (n.audience === "USER" && n.userId === session.rollNumber) || (n.audience === "USER" && n.userId === "std-1"));
        } else if (session.role === "FACULTY") {
          filtered = notifs.filter((n) => n.audience === "ALL" || n.audience === "FACULTY");
        } else if (session.role === "ADMIN") {
          const sent = url.searchParams.get("scope") === "sent";
          filtered = sent ? notifs.filter((n) => n.audience !== "USER") : notifs;
        }
      }
      return { notifications: filtered, unread: filtered.filter((n) => !n.read).length } as T;
    }
    if (method === "POST") {
      const newNotif: NotificationT = {
        id: `notif-${Date.now()}`,
        audience: body?.audience || "ALL",
        userId: body?.userId || null,
        type: body?.type || "GENERAL",
        title: body?.title || "",
        message: body?.message || "",
        read: false,
        createdAt: new Date().toISOString(),
      };
      notifs.unshift(newNotif);
      saveMockNotifications(notifs);
      return { notification: newNotif } as T;
    }
  }

  if (pathname.startsWith("/api/notifications/") && pathname.endsWith("/read-all") && method === "POST") {
    const notifs = getMockNotifications();
    for (const n of notifs) n.read = true;
    saveMockNotifications(notifs);
    return { ok: true } as T;
  }

  if (pathname.startsWith("/api/notifications/") && method === "PATCH") {
    const id = pathname.replace("/api/notifications/", "");
    const notifs = getMockNotifications();
    const found = notifs.find((n) => n.id === id);
    if (found) found.read = true;
    saveMockNotifications(notifs);
    return { ok: true } as T;
  }

  // 2. Fines
  if (pathname === "/api/fines") {
    const fines = getMockFines();
    if (method === "GET") {
      const studentId = url.searchParams.get("studentId");
      const status = url.searchParams.get("status");
      const issuedBy = url.searchParams.get("issuedBy");
      const offenceId = url.searchParams.get("offenceId");
      const q = url.searchParams.get("q")?.trim().toLowerCase();

      let res = fines;
      if (session?.role === "STUDENT") {
        res = res.filter((f) => f.student.rollNumber === session.rollNumber || f.studentId === "std-1");
      } else if (studentId) {
        res = res.filter((f) => f.studentId === studentId);
      }
      if (status && status !== "ALL") res = res.filter((f) => f.status === status);
      if (issuedBy && issuedBy !== "ALL") res = res.filter((f) => f.issuedById === issuedBy);
      if (offenceId && offenceId !== "ALL") res = res.filter((f) => f.offenceId === offenceId);
      if (q) {
        res = res.filter(
          (f) =>
            f.student.name.toLowerCase().includes(q) ||
            f.student.rollNumber.toLowerCase().includes(q) ||
            f.offence.name.toLowerCase().includes(q) ||
            (f.reason && f.reason.toLowerCase().includes(q))
        );
      }
      return { fines: res } as T;
    }

    if (method === "POST") {
      const { studentId, offences: selectedOffences, dueDate } = body;
      const students = getMockStudents();
      const allOffences = getMockOffences();
      const student = students.find((s) => s.id === studentId);
      if (!student) throw new Error("Student not found.");

      const due = dueDate ? new Date(dueDate).toISOString() : daysAhead(14);
      const createdRows: { fineId: string; offence: string; amount: number }[] = [];
      const audits = getMockAudits();

      for (const item of selectedOffences) {
        const off = allOffences.find((o) => o.id === item.offenceId);
        if (!off) continue;
        const fineId = `fine-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const newFine: FineT = {
          id: fineId,
          studentId: student.id,
          offenceId: off.id,
          issuedById: session?.id || "user-faculty-1",
          amountSnapshot: off.amount,
          reason: item.reason || null,
          issueDate: new Date().toISOString(),
          dueDate: due,
          status: "PENDING",
          corrected: false,
          paymentDate: null,
          student: {
            id: student.id,
            name: student.name,
            rollNumber: student.rollNumber,
            programme: student.programme,
            photoColor: student.photoColor,
            department: student.department,
          },
          offence: {
            id: off.id,
            name: off.name,
            code: off.code,
            ruleRef: off.ruleRef,
            category: off.category,
          },
          issuedBy: { id: session?.id || "user-faculty-1", name: session?.name || "Faculty" },
        };
        fines.unshift(newFine);

        audits.unshift({
          id: `audit-${Date.now()}`,
          fineId: newFine.id,
          actorId: session?.id || "user-faculty-1",
          actorName: session?.name || "Faculty",
          action: "CREATED",
          oldValues: null,
          newValues: JSON.stringify({ status: "PENDING", amount: off.amount, offence: off.name }),
          note: "Fine issued via UniFine portal.",
          createdAt: new Date().toISOString(),
          fine: { id: newFine.id, student: { name: student.name, rollNumber: student.rollNumber }, offence: { name: off.name, code: off.code } },
        });

        createdRows.push({ fineId: newFine.id, offence: off.name, amount: off.amount });
      }

      saveMockFines(fines);
      saveMockAudits(audits);

      // Notification
      const notifs = getMockNotifications();
      notifs.unshift({
        id: `notif-${Date.now()}`,
        audience: "USER",
        userId: student.id,
        type: "FINE_ISSUED",
        title: `New fine${createdRows.length > 1 ? "s" : ""} issued`,
        message: `${createdRows.length} fine${createdRows.length > 1 ? "s" : ""} issued for ${student.name} (${student.rollNumber}).`,
        read: false,
        createdAt: new Date().toISOString(),
      });
      saveMockNotifications(notifs);

      return { created: createdRows } as T;
    }
  }

  // 3. Fine PATCH (correction / mark paid)
  if (pathname.startsWith("/api/fines/") && method === "PATCH") {
    const id = pathname.replace("/api/fines/", "");
    const fines = getMockFines();
    const fine = fines.find((f) => f.id === id);
    if (!fine) throw new Error("Fine not found.");

    const audits = getMockAudits();
    const oldValues = { status: fine.status, amount: fine.amountSnapshot, reason: fine.reason };

    if (body.status !== undefined) {
      fine.status = body.status;
      fine.paymentDate = body.status === "PAID" ? new Date().toISOString() : null;
    }
    if (body.amount !== undefined && Number(body.amount) > 0) {
      fine.amountSnapshot = Number(body.amount);
      fine.corrected = true;
    }
    if (body.reason !== undefined) {
      fine.reason = String(body.reason).trim();
      fine.corrected = true;
    }

    saveMockFines(fines);

    audits.unshift({
      id: `audit-${Date.now()}`,
      fineId: fine.id,
      actorId: session?.id || "admin",
      actorName: session?.name || "Admin",
      action: body.status === "PAID" ? "MARKED_PAID" : "CORRECTED",
      oldValues: JSON.stringify(oldValues),
      newValues: JSON.stringify({ status: fine.status, amount: fine.amountSnapshot, reason: fine.reason }),
      note: body.note || (body.status === "PAID" ? "Marked as paid." : "Correction recorded."),
      createdAt: new Date().toISOString(),
      fine: { id: fine.id, student: { name: fine.student.name, rollNumber: fine.student.rollNumber }, offence: { name: fine.offence.name, code: fine.offence.code } },
    });
    saveMockAudits(audits);

    return { fine } as T;
  }

  // 4. Student Search
  if (pathname === "/api/students/search" && method === "GET") {
    const roll = url.searchParams.get("rollNumber")?.trim().toUpperCase();
    const students = getMockStudents();
    const fines = getMockFines();
    const student = students.find((s) => s.rollNumber.toUpperCase() === roll);
    if (!student) throw new Error(`No student found with roll number "${roll}".`);

    const studentFines = fines.filter((f) => f.studentId === student.id || f.student.rollNumber === student.rollNumber);
    const pending = studentFines.filter((f) => f.status === "PENDING").length;
    const overdue = studentFines.filter((f) => f.status === "OVERDUE").length;
    const outstanding = studentFines.filter((f) => f.status !== "PAID").reduce((sum, f) => sum + f.amountSnapshot, 0);

    return {
      student,
      stats: { total: studentFines.length, pending, overdue, outstanding },
    } as T;
  }

  // 5. Offences
  if (pathname === "/api/offences") {
    const offences = getMockOffences();
    if (method === "GET") {
      const activeOnly = url.searchParams.get("active") === "true";
      return { offences: activeOnly ? offences.filter((o) => o.active) : offences } as T;
    }
    if (method === "POST") {
      const newOffence: OffenceT = {
        id: `off-${Date.now()}`,
        code: String(body.code).trim().toUpperCase(),
        name: String(body.name).trim(),
        description: String(body.description || "").trim(),
        ruleRef: String(body.ruleRef || "").trim(),
        category: String(body.category || "").trim(),
        amount: Number(body.amount),
        active: body.active !== undefined ? !!body.active : true,
      };
      offences.push(newOffence);
      saveMockOffences(offences);
      return { offence: newOffence } as T;
    }
  }

  if (pathname.startsWith("/api/offences/") && method === "PATCH") {
    const id = pathname.replace("/api/offences/", "");
    const offences = getMockOffences();
    const off = offences.find((o) => o.id === id);
    if (!off) throw new Error("Offence not found.");
    if (body.name !== undefined) off.name = body.name;
    if (body.description !== undefined) off.description = body.description;
    if (body.amount !== undefined) off.amount = Number(body.amount);
    if (body.category !== undefined) off.category = body.category;
    if (body.ruleRef !== undefined) off.ruleRef = body.ruleRef;
    if (body.active !== undefined) off.active = !!body.active;
    saveMockOffences(offences);
    return { offence: off } as T;
  }

  // 6. Rule Book
  if (pathname === "/api/rule-book") {
    const rules = getMockRules();
    if (method === "GET") {
      const activeOnly = session?.role !== "ADMIN";
      return { entries: activeOnly ? rules.filter((r) => r.active) : rules } as T;
    }
    if (method === "POST") {
      const newRule: RuleEntryT = {
        id: `rule-${Date.now()}`,
        category: String(body.category).trim(),
        title: String(body.title).trim(),
        content: String(body.content).trim(),
        ruleRef: body.ruleRef ? String(body.ruleRef).trim() : null,
        active: true,
        version: 1,
      };
      rules.push(newRule);
      saveMockRules(rules);
      return { entry: newRule } as T;
    }
  }

  if (pathname.startsWith("/api/rule-book/") && method === "PATCH") {
    const id = pathname.replace("/api/rule-book/", "");
    const rules = getMockRules();
    const r = rules.find((rule) => rule.id === id);
    if (!r) throw new Error("Rule not found.");
    if (body.title !== undefined) r.title = body.title;
    if (body.content !== undefined) r.content = body.content;
    if (body.category !== undefined) r.category = body.category;
    if (body.ruleRef !== undefined) r.ruleRef = body.ruleRef;
    if (body.active !== undefined) r.active = !!body.active;
    r.version += 1;
    saveMockRules(rules);
    return { entry: r } as T;
  }

  // 7. Audit Trail
  if (pathname === "/api/audit" && method === "GET") {
    const audits = getMockAudits();
    const fineId = url.searchParams.get("fineId");
    const filtered = fineId ? audits.filter((a) => a.fineId === fineId) : audits;
    return { audits: filtered } as T;
  }

  // 8. Reports Summary
  if (pathname === "/api/reports/summary" && method === "GET") {
    const fines = getMockFines();
    const scope = url.searchParams.get("scope");
    const targetFines = scope === "me" && session ? fines.filter((f) => f.issuedById === session.id) : fines;

    const total = targetFines.length;
    const paid = targetFines.filter((f) => f.status === "PAID");
    const pending = targetFines.filter((f) => f.status === "PENDING");
    const overdue = targetFines.filter((f) => f.status === "OVERDUE");
    const collected = paid.reduce((s, f) => s + f.amountSnapshot, 0);
    const outstanding = [...pending, ...overdue].reduce((s, f) => s + f.amountSnapshot, 0);
    const totalAmount = collected + outstanding;
    const collectionRate = totalAmount > 0 ? Math.round((collected / totalAmount) * 100) : 0;

    const byCategoryMap: Record<string, { count: number; amount: number }> = {};
    for (const f of targetFines) {
      const cat = f.offence.category;
      byCategoryMap[cat] = byCategoryMap[cat] || { count: 0, amount: 0 };
      byCategoryMap[cat].count += 1;
      byCategoryMap[cat].amount += f.amountSnapshot;
    }
    const byCategory = Object.entries(byCategoryMap)
      .map(([category, v]) => ({ category, ...v }))
      .sort((a, b) => b.amount - a.amount);

    const months: { key: string; label: string; issued: number; collected: number }[] = [];
    const curDate = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(curDate.getFullYear(), curDate.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleString("en-IN", { month: "short" }),
        issued: 0,
        collected: 0,
      });
    }
    for (const f of targetFines) {
      const id = new Date(f.issueDate);
      const k = `${id.getFullYear()}-${id.getMonth()}`;
      const m = months.find((x) => x.key === k);
      if (m) m.issued += 1;
      if (f.paymentDate) {
        const pd = new Date(f.paymentDate);
        const pk = `${pd.getFullYear()}-${pd.getMonth()}`;
        const pm = months.find((x) => x.key === pk);
        if (pm) pm.collected += f.amountSnapshot;
      }
    }

    const topOffencesMap: Record<string, { name: string; count: number; amount: number }> = {};
    for (const f of targetFines) {
      topOffencesMap[f.offence.name] = topOffencesMap[f.offence.name] || { name: f.offence.name, count: 0, amount: 0 };
      topOffencesMap[f.offence.name].count += 1;
      topOffencesMap[f.offence.name].amount += f.amountSnapshot;
    }
    const topOffences = Object.values(topOffencesMap).sort((a, b) => b.count - a.count).slice(0, 6);

    const summary: SummaryT = {
      total,
      paidCount: paid.length,
      pendingCount: pending.length,
      overdueCount: overdue.length,
      collected,
      outstanding,
      totalAmount,
      collectionRate,
      studentsWithFines: new Set(targetFines.map((f) => f.student.id)).size,
      byCategory,
      byMonth: months,
      topOffences,
    };
    return summary as T;
  }

  throw new Error(`Unhandled mock route: ${method} ${pathname}`);
}
