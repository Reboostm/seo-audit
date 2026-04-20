import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export async function createLead(data: any) {
  console.log('Create lead called with:', data);
  return { id: 'lead-' + Date.now() };
}

export async function updateLead(leadId: string, data: any) {
  console.log('Update lead called with:', leadId, data);
  return true;
}

export async function queryLeads(filters: any = {}) {
  console.log('Query leads called with filters:', filters);
  return [];
}

export async function getConfig() {
  return {
    nicheDefaults: {
      plumber: { jobCost: 250, callsLostMonthly: 15 },
      pest_control: { jobCost: 180, callsLostMonthly: 8 },
    },
    apiToggles: {
      googlePlaces: { enabled: true },
      serpapi: { enabled: true },
    },
    lastUpdated: new Date(),
  };
}

export async function updateConfig(data: any) {
  console.log('Update config called with:', data);
  return true;
}
