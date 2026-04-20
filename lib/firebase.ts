import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, updateDoc, doc, getDocs, deleteDoc, getDoc, setDoc, query, where } from 'firebase/firestore';

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
  try {
    const leadsCollection = collection(db, 'leads');
    const docRef = await addDoc(leadsCollection, {
      ...data,
      submittedAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: docRef.id };
  } catch (error) {
    console.error('Error creating lead:', error);
    throw error;
  }
}

export async function updateLead(leadId: string, data: any) {
  try {
    const leadDoc = doc(db, 'leads', leadId);
    await updateDoc(leadDoc, {
      ...data,
      updatedAt: new Date(),
    });
    return true;
  } catch (error) {
    console.error('Error updating lead:', error);
    throw error;
  }
}

export async function queryLeads(filters: any = {}) {
  try {
    const leadsCollection = collection(db, 'leads');
    let q = leadsCollection;

    const constraints = [];
    if (filters.niche) {
      constraints.push(where('niche', '==', filters.niche));
    }
    if (filters.state) {
      constraints.push(where('state', '==', filters.state));
    }
    if (filters.city) {
      constraints.push(where('city', '==', filters.city));
    }
    if (filters.status) {
      constraints.push(where('status', '==', filters.status));
    }

    const q2 = constraints.length > 0 ? query(leadsCollection, ...constraints) : leadsCollection;
    const snapshot = await getDocs(q2);

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error querying leads:', error);
    return [];
  }
}

export async function deleteLead(leadId: string) {
  try {
    const leadDoc = doc(db, 'leads', leadId);
    await deleteDoc(leadDoc);
    return true;
  } catch (error) {
    console.error('Error deleting lead:', error);
    throw error;
  }
}

export async function getConfig() {
  try {
    const configDoc = doc(db, 'config', 'main');
    const docSnapshot = await getDoc(configDoc);

    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      // Return defaults if config doesn't exist yet
      return getDefaultConfig();
    }
  } catch (error) {
    console.error('Error getting config:', error);
    return getDefaultConfig();
  }
}

export async function updateConfig(data: any) {
  try {
    const configDoc = doc(db, 'config', 'main');
    await setDoc(configDoc, {
      ...data,
      lastUpdated: new Date(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error updating config:', error);
    throw error;
  }
}

function getDefaultConfig() {
  return {
    nicheDefaults: {
      // Home Services
      plumber: { jobCost: 250, callsLostMonthly: 50 },
      electrician: { jobCost: 300, callsLostMonthly: 45 },
      hvac: { jobCost: 400, callsLostMonthly: 40 },
      roofer: { jobCost: 500, callsLostMonthly: 35 },
      painter: { jobCost: 200, callsLostMonthly: 48 },
      handyman: { jobCost: 150, callsLostMonthly: 55 },
      contractor: { jobCost: 800, callsLostMonthly: 38 },
      landscaper: { jobCost: 350, callsLostMonthly: 50 },
      tree_service: { jobCost: 400, callsLostMonthly: 40 },
      pool_service: { jobCost: 150, callsLostMonthly: 48 },
      chimney_sweep: { jobCost: 250, callsLostMonthly: 32 },
      // Cleaning Services
      pest_control: { jobCost: 180, callsLostMonthly: 38 },
      house_cleaning: { jobCost: 200, callsLostMonthly: 52 },
      carpet_cleaner: { jobCost: 150, callsLostMonthly: 48 },
      window_cleaning: { jobCost: 180, callsLostMonthly: 40 },
      pressure_washing: { jobCost: 200, callsLostMonthly: 45 },
      // Auto Services
      auto_mechanic: { jobCost: 350, callsLostMonthly: 55 },
      auto_detailing: { jobCost: 120, callsLostMonthly: 65 },
      car_wash: { jobCost: 25, callsLostMonthly: 150 },
      tire_shop: { jobCost: 200, callsLostMonthly: 50 },
      // Security & Services
      locksmith: { jobCost: 200, callsLostMonthly: 30 },
      security_system: { jobCost: 500, callsLostMonthly: 22 },
      // Professional Services
      lawyer: { jobCost: 500, callsLostMonthly: 28 },
      accountant: { jobCost: 300, callsLostMonthly: 25 },
      dentist: { jobCost: 250, callsLostMonthly: 40 },
      chiropractor: { jobCost: 150, callsLostMonthly: 48 },
      physical_therapist: { jobCost: 120, callsLostMonthly: 42 },
      veterinarian: { jobCost: 200, callsLostMonthly: 52 },
      // Beauty & Wellness
      hair_salon: { jobCost: 80, callsLostMonthly: 80 },
      nail_salon: { jobCost: 60, callsLostMonthly: 100 },
      spa: { jobCost: 150, callsLostMonthly: 50 },
      massage_therapy: { jobCost: 100, callsLostMonthly: 55 },
      personal_trainer: { jobCost: 80, callsLostMonthly: 50 },
      yoga_studio: { jobCost: 120, callsLostMonthly: 42 },
      // Real Estate & Property
      realtor: { jobCost: 5000, callsLostMonthly: 18 },
      property_manager: { jobCost: 800, callsLostMonthly: 28 },
      home_inspector: { jobCost: 400, callsLostMonthly: 24 },
      // Pet Services
      pet_grooming: { jobCost: 80, callsLostMonthly: 65 },
      pet_training: { jobCost: 200, callsLostMonthly: 32 },
      dog_daycare: { jobCost: 40, callsLostMonthly: 90 },
      // Business Services
      web_design: { jobCost: 1500, callsLostMonthly: 18 },
      digital_marketing: { jobCost: 800, callsLostMonthly: 24 },
      tax_preparation: { jobCost: 300, callsLostMonthly: 28 },
    },
    apiToggles: {
      googlePlaces: { enabled: true },
      serpapi: { enabled: false },
      pageSpeed: { enabled: true },
      ghl: { enabled: true },
    },
    lastUpdated: new Date(),
  };
}
