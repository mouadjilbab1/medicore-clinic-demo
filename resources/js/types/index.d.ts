export type Role =
    | 'admin'
    | 'director'
    | 'manager'
    | 'doctor'
    | 'dentist'
    | 'nurse'
    | 'receptionist'
    | 'accountant'
    | 'pharmacist'
    | 'lab_tech'
    | 'imaging_tech'
    | 'inventory_mgr'
    | 'patient';

export type Locale = 'ar' | 'fr' | 'en';

export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role: Role;
    locale: Locale;
    branch_id?: number | null;
    branch?: Branch | null;
    is_active: boolean;
    avatar_url?: string;
    doctor_profile?: Doctor | null;
    created_at: string;
}

export interface Branch {
    id: number;
    clinic_id: number;
    name: string;
    code: string;
    phone?: string;
    email?: string;
    address?: string;
    is_main: boolean;
    is_active: boolean;
}

export interface Clinic {
    id: number;
    name: string;
    legal_name?: string;
    tax_number?: string;
    phone?: string;
    email?: string;
    address?: string;
    country: string;
    timezone: string;
    currency: string;
    logo_url?: string;
}

export interface Patient {
    id: number;
    branch_id: number;
    patient_uid: string;
    first_name: string;
    last_name: string;
    full_name?: string;
    age?: number;
    gender: 'male' | 'female' | 'other';
    date_of_birth: string;
    blood_group?: string;
    phone: string;
    email?: string;
    national_id?: string;
    address?: string;
    city?: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    marital_status?: string;
    occupation?: string;
    photo_url?: string;
    insurance_company_id?: number | null;
    insurance_policy_number?: string;
    allergies_summary?: string;
    chronic_conditions_summary?: string;
    medical_notes?: string;
    is_active: boolean;
    created_at: string;
    allergies?: Allergy[];
    documents_count?: number;
    appointments_count?: number;
    outstanding_balance?: number;
}

export interface Allergy {
    id: number;
    patient_id: number;
    allergen: string;
    allergy_type: 'drug' | 'food' | 'environmental' | 'other';
    severity: 'mild' | 'moderate' | 'severe' | 'life_threatening';
    reaction?: string;
}

export interface Doctor {
    id: number;
    user_id: number;
    user?: User;
    specialty: string;
    license_number: string;
    qualifications?: string;
    biography?: string;
    consultation_fee: number;
    followup_fee: number;
    slot_duration_minutes: number;
    commission_rate: number;
    is_available: boolean;
    schedules?: DoctorSchedule[];
}

export interface DoctorSchedule {
    id: number;
    doctor_id: number;
    branch_id: number;
    day_of_week: number; // 0=Sunday..6=Saturday
    start_time: string;
    end_time: string;
    break_start?: string;
    break_end?: string;
    is_active: boolean;
}

export type AppointmentStatus =
    | 'scheduled'
    | 'confirmed'
    | 'arrived'
    | 'waiting'
    | 'in_consultation'
    | 'completed'
    | 'cancelled'
    | 'no_show';

export interface Appointment {
    id: number;
    branch_id: number;
    branch?: Branch;
    patient_id: number;
    patient?: Patient;
    doctor_id: number;
    doctor?: Doctor;
    room_id?: number | null;
    room?: Room | null;
    appointment_date: string;
    start_time: string;
    end_time: string;
    type: 'consultation' | 'follow_up' | 'procedure' | 'emergency' | 'walk_in';
    status: AppointmentStatus;
    reason_for_visit?: string;
    notes?: string;
    cancellation_reason?: string;
    created_at: string;
}

export interface Room {
    id: number;
    branch_id: number;
    name: string;
    room_number: string;
    type: 'consultation' | 'dental' | 'procedure' | 'lab' | 'imaging';
    is_active: boolean;
}

export interface QueueItem {
    id: number;
    branch_id: number;
    appointment_id?: number | null;
    appointment?: Appointment | null;
    patient_id: number;
    patient: Patient;
    doctor_id: number;
    doctor: Doctor;
    queue_number: number;
    priority: 'normal' | 'urgent' | 'emergency' | 'special_needs';
    status: 'waiting' | 'called' | 'in_consultation' | 'completed' | 'skipped';
    check_in_time: string;
    called_time?: string;
    completed_time?: string;
    notes?: string;
}

export interface VitalSign {
    id: number;
    consultation_id?: number | null;
    patient_id: number;
    systolic_bp?: number;
    diastolic_bp?: number;
    heart_rate?: number;
    respiratory_rate?: number;
    temperature?: number;
    oxygen_saturation?: number;
    weight?: number;
    height?: number;
    bmi?: number;
    recorded_at: string;
}

export interface Diagnosis {
    id: number;
    consultation_id: number;
    patient_id: number;
    icd10_code?: string;
    diagnosis_name: string;
    type: 'primary' | 'secondary' | 'differential';
    status: 'active' | 'resolved' | 'chronic';
    notes?: string;
}

export interface Consultation {
    id: number;
    appointment_id?: number | null;
    patient_id: number;
    patient?: Patient;
    doctor_id: number;
    doctor?: Doctor;
    branch_id: number;
    consultation_date: string;
    chief_complaint: string;
    history_present_illness?: string;
    physical_examination?: string;
    clinical_assessment?: string;
    treatment_plan?: string;
    follow_up_instructions?: string;
    follow_up_date?: string;
    is_finalized: boolean;
    signed_at?: string;
    vitals?: VitalSign[];
    diagnoses?: Diagnosis[];
    prescriptions?: Prescription[];
    created_at: string;
}

export interface Department {
    id: number;
    clinic_id: number;
    name: string;
    description?: string;
    is_active: boolean;
}

export interface BackupRecord {
    id: number;
    filename: string;
    disk: string;
    file_size: number;
    size_bytes?: number;
    backup_type: string;
    status: string;
    notes?: string;
    created_at: string;
    creator?: { name: string };
}

export interface PrescriptionItem {
    id?: number;
    medicine_name?: string;
    medication_name?: string;
    dosage: string;
    frequency: string;
    duration: string;
    route: string;
    quantity?: number;
    instructions?: string;
}

export interface Prescription {
    id: number;
    consultation_id?: number | null;
    patient_id: number;
    patient?: Patient;
    doctor_id: number;
    doctor?: Doctor;
    prescription_number: string;
    status: 'active' | 'dispensed' | 'cancelled';
    instructions?: string;
    signed_at?: string;
    items: PrescriptionItem[];
    created_at: string;
}

export interface InvoiceItem {
    id?: number;
    item_name: string;
    item_type: 'consultation' | 'procedure' | 'medication' | 'lab' | 'imaging' | 'dental';
    quantity: number;
    unit_price: number;
    discount: number;
    tax_rate: number;
    total: number;
}

export interface Payment {
    id: number;
    invoice_id: number;
    patient_id: number;
    receipt_number: string;
    amount: number;
    payment_method: 'cash' | 'card' | 'bank_transfer' | 'insurance' | 'cheque' | 'other';
    transaction_reference?: string;
    payment_date: string;
    notes?: string;
}

export interface Invoice {
    id: number;
    branch_id: number;
    branch?: Branch;
    patient_id: number;
    patient?: Patient;
    consultation_id?: number | null;
    invoice_number: string;
    invoice_date: string;
    due_date: string;
    subtotal: number;
    discount_amount: number;
    tax_amount: number;
    total_amount: number;
    paid_amount: number;
    balance_due: number;
    status: 'draft' | 'unpaid' | 'partially_paid' | 'paid' | 'refunded' | 'cancelled';
    notes?: string;
    items: InvoiceItem[];
    payments?: Payment[];
    created_at: string;
}

export interface PageProps<T = Record<string, unknown>> {
    auth: {
        user: User | null;
        role: Role | null;
        permissions: string[];
        current_branch?: Branch | null;
        branches?: Branch[];
    };
    clinic?: Clinic;
    locale: Locale;
    translations: Record<string, string>;
    flash?: {
        success?: string;
        error?: string;
        warning?: string;
    };
    [key: string]: unknown;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

declare global {
    function route(name?: string, params?: any): any;
}
