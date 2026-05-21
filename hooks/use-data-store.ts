'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Admin, Doctor, Patient, MedicalRecord, User, UserType } from '@/types';
import { admins as initialAdmins, doctors as initialDoctors, patients as initialPatients, medicalRecords as initialRecords } from '@/data/mock-data';

interface DataStore {
  admins: Admin[];
  doctors: Doctor[];
  patients: Patient[];
  medicalRecords: MedicalRecord[];
  initialized: boolean;
  
  // Initialize with mock data
  initializeData: () => void;
  
  // Import/Export operations
  importData: (data: { admins: Admin[]; doctors: Doctor[]; patients: Patient[]; medicalRecords: MedicalRecord[] }) => void;
  clearAllData: () => void;
  
  // User operations
  getAllUsers: () => User[];
  getUserById: (id: string) => User | undefined;
  getUserByEmail: (email: string) => User | undefined;
  addUser: (user: User) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;
  
  // Admin operations
  addAdmin: (admin: Admin) => void;
  updateAdmin: (id: string, data: Partial<Admin>) => void;
  deleteAdmin: (id: string) => void;
  
  // Doctor operations
  addDoctor: (doctor: Doctor) => void;
  updateDoctor: (id: string, data: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;
  
  // Patient operations
  addPatient: (patient: Patient) => void;
  updatePatient: (id: string, data: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  
  // Medical Record operations
  addMedicalRecord: (record: MedicalRecord) => void;
  updateMedicalRecord: (id: string, data: Partial<MedicalRecord>) => void;
  deleteMedicalRecord: (id: string) => void;
  getRecordsByPatientId: (patientId: string) => MedicalRecord[];
  getRecordsByDoctorId: (doctorId: string) => MedicalRecord[];
}

export const useDataStore = create<DataStore>()(
  persist(
    (set, get) => ({
      admins: [],
      doctors: [],
      patients: [],
      medicalRecords: [],
      initialized: false,
      
      initializeData: () => {
        const { initialized } = get();
        if (!initialized) {
          set({
            admins: initialAdmins,
            doctors: initialDoctors,
            patients: initialPatients,
            medicalRecords: initialRecords,
            initialized: true,
          });
        }
      },
      
      importData: (data) => {
        set({
          admins: data.admins,
          doctors: data.doctors,
          patients: data.patients,
          medicalRecords: data.medicalRecords,
          initialized: true,
        });
      },
      
      clearAllData: () => {
        set({
          admins: initialAdmins,
          doctors: initialDoctors,
          patients: initialPatients,
          medicalRecords: initialRecords,
          initialized: true,
        });
      },
      
      getAllUsers: () => {
        const { admins, doctors, patients } = get();
        return [...admins, ...doctors, ...patients];
      },
      
      getUserById: (id: string) => {
        return get().getAllUsers().find(u => u.id === id);
      },
      
      getUserByEmail: (email: string) => {
        return get().getAllUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
      },
      
      addUser: (user: User) => {
        const tipo = user.tipo;
        if (tipo === 'ADMIN') {
          get().addAdmin(user as Admin);
        } else if (tipo === 'DOCTOR') {
          get().addDoctor(user as Doctor);
        } else {
          get().addPatient(user as Patient);
        }
      },
      
      updateUser: (id: string, data: Partial<User>) => {
        const user = get().getUserById(id);
        if (!user) return;
        
        if (user.tipo === 'ADMIN') {
          get().updateAdmin(id, data);
        } else if (user.tipo === 'DOCTOR') {
          get().updateDoctor(id, data);
        } else {
          get().updatePatient(id, data);
        }
      },
      
      deleteUser: (id: string) => {
        const user = get().getUserById(id);
        if (!user) return;
        
        if (user.tipo === 'ADMIN') {
          get().deleteAdmin(id);
        } else if (user.tipo === 'DOCTOR') {
          get().deleteDoctor(id);
        } else {
          get().deletePatient(id);
        }
      },
      
      // Admin operations
      addAdmin: (admin: Admin) => {
        set(state => ({ admins: [...state.admins, admin] }));
      },
      
      updateAdmin: (id: string, data: Partial<Admin>) => {
        set(state => ({
          admins: state.admins.map(a => a.id === id ? { ...a, ...data, atualizadoEm: new Date().toISOString() } : a)
        }));
      },
      
      deleteAdmin: (id: string) => {
        set(state => ({ admins: state.admins.filter(a => a.id !== id) }));
      },
      
      // Doctor operations
      addDoctor: (doctor: Doctor) => {
        set(state => ({ doctors: [...state.doctors, doctor] }));
      },
      
      updateDoctor: (id: string, data: Partial<Doctor>) => {
        set(state => ({
          doctors: state.doctors.map(d => d.id === id ? { ...d, ...data, atualizadoEm: new Date().toISOString() } : d)
        }));
      },
      
      deleteDoctor: (id: string) => {
        set(state => ({ doctors: state.doctors.filter(d => d.id !== id) }));
      },
      
      // Patient operations
      addPatient: (patient: Patient) => {
        set(state => ({ patients: [...state.patients, patient] }));
      },
      
      updatePatient: (id: string, data: Partial<Patient>) => {
        set(state => ({
          patients: state.patients.map(p => p.id === id ? { ...p, ...data, atualizadoEm: new Date().toISOString() } : p)
        }));
      },
      
      deletePatient: (id: string) => {
        set(state => ({ patients: state.patients.filter(p => p.id !== id) }));
      },
      
      // Medical Record operations
      addMedicalRecord: (record: MedicalRecord) => {
        set(state => ({ medicalRecords: [...state.medicalRecords, record] }));
      },
      
      updateMedicalRecord: (id: string, data: Partial<MedicalRecord>) => {
        set(state => ({
          medicalRecords: state.medicalRecords.map(r => r.id === id ? { ...r, ...data, atualizadoEm: new Date().toISOString() } : r)
        }));
      },
      
      deleteMedicalRecord: (id: string) => {
        set(state => ({ medicalRecords: state.medicalRecords.filter(r => r.id !== id) }));
      },
      
      getRecordsByPatientId: (patientId: string) => {
        return get().medicalRecords.filter(r => r.pacienteId === patientId);
      },
      
      getRecordsByDoctorId: (doctorId: string) => {
        return get().medicalRecords.filter(r => r.medicoId === doctorId);
      },
    }),
    {
      name: 'vivabem-data',
    }
  )
);
