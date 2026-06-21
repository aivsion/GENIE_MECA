"use client";

import React, { useState, useEffect } from "react";
import { initializeApp, getApps } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut, 
  User 
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc 
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { AlertTriangle, Car, Plus, LogOut, Cpu, CheckCircle2 } from "lucide-react";

// --- CONFIGURATION FIREBASE ---
// À remplacer par votre propre configuration Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

// --- INTERFACES ---
interface Vehicle {
  id: string;
  immatriculation: string;
  user_id: string;
  brand?: string;
  model?: string;
}

interface DiagnosticResponse {
  identification_validee?: string;
  questions_triage?: string[];
  causes_probables?: { cause: string; probabilite_pourcentage: number }[];
  plan_action?: {
    verifications?: string[];
    outils_requis?: string[];
    pieces_a_changer?: string[];
  };
  alerte_securite_critique?: boolean;
  message_securite?: string;
}

export default function GenieMecaDiagnosticPage() {
  // BLOC 1 : États Auth
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // BLOC 2 : États Garage
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newPlate, setNewPlate] = useState("");
  const [garageLoading, setGarageLoading] = useState(false);

  // BLOC 3 : États Diagnostic
  const [symptoms, setSymptoms] = useState("");
  const [obd, setObd] = useState("");
  const [expertise, setExpertise] = useState("Débutant");
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // BLOC 4 : États Rapport
  const [report, setReport] = useState<DiagnosticResponse | null>(null);

  // --- EFFETS ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) {
        fetchVehicles(currentUser.uid);
      } else {
        setVehicles([]);
        setSelectedVehicle(null);
        setReport(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // --- BLOC 1 : FONCTIONS AUTH ---
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      setErrorMsg("Erreur lors de la connexion : " + error.message);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  // --- BLOC 2 : FONCTIONS GARAGE ---
  const fetchVehicles = async (uid: string) => {
    setGarageLoading(true);
    try {
      const q = query(collection(db, "vehicles"), where("user_id", "==", uid));
      const querySnapshot = await getDocs(q);
      const userVehicles: Vehicle[] = [];
      querySnapshot.forEach((doc) => {
        userVehicles.push({ id: doc.id, ...doc.data() } as Vehicle);
      });
      setVehicles(userVehicles);
    } catch (error: any) {
      setErrorMsg("Erreur lors de la récupération du garage.");
    } finally {
      setGarageLoading(false);
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlate || !user) return;
    try {
      const newVehicleData = {
        immatriculation: newPlate.toUpperCase(),
        user_id: user.uid,
      };
      const docRef = await addDoc(collection(db, "vehicles"), newVehicleData);
      const addedVehicle = { id: docRef.id, ...newVehicleData };
      setVehicles([...vehicles, addedVehicle]);
      setNewPlate("");
      setShowAddVehicle(false);
      setSelectedVehicle(addedVehicle);
    } catch (error: any) {
      setErrorMsg("Erreur lors de l'ajout du véhicule.");
    }
  };

  // --- BLOC 3 : Lancement du Diagnostic ---
  const handleLaunchDiagnostic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle || !symptoms) return;

    setIsDiagnosing(true);
    setErrorMsg("");
    setReport(null);

    try {
      const generateDiagnostic = httpsCallable(functions, "generateDiagnostic");
      const result = await generateDiagnostic({
        expertise,
        vehicle_details: \`Plaque: \${selectedVehicle.immatriculation}\`,
        symptoms,
        obd,
      });

      setReport(result.data as DiagnosticResponse);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "Erreur lors du diagnostic. Veuillez réessayer.");
    } finally {
      setIsDiagnosing(false);
    }
  };

  // --- RENDUS DES BLOCS ---

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // BLOC 1 : ECRAN ONBOARDING (Utilisateur non connecté)
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center mb-4">
            <Car className="text-[#D4AF37] w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Génie Méca</h1>
          <p className="text-slate-500 font-sans text-sm">Connectez-vous pour accéder à votre garage et lancer un diagnostic par intelligence artificielle.</p>
          
          <button 
            onClick={handleGoogleSignIn}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors"
          >
            <svg className="w-5 h-5 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuer avec Google
          </button>

          {errorMsg && <p className="text-red-500 text-xs font-semibold">{errorMsg}</p>}
        </div>
      </div>
    );
  }

  // ECRAN PRINCIPAL (Connecté)
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <Car className="text-[#D4AF37] w-5 h-5" />
            </div>
            <span className="font-black text-slate-900 uppercase tracking-tight">Génie Méca</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-slate-500 hidden sm:block">{user.email}</span>
            <button onClick={handleSignOut} className="text-slate-400 hover:text-slate-700 transition">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        
        {/* Affichage des erreurs globales */}
        {errorMsg && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700 text-sm font-medium">
            {errorMsg}
          </div>
        )}

        {/* BLOC 2 : MON GARAGE */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black uppercase text-slate-900">1. Mon Garage</h2>
            <button 
              onClick={() => setShowAddVehicle(!showAddVehicle)}
              className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
            >
              <Plus className="w-4 h-4" /> Ajouter
            </button>
          </div>

          {showAddVehicle && (
            <form onSubmit={handleAddVehicle} className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-2">
              <input 
                type="text" 
                placeholder="Immatriculation (ex: AB-123-CD)" 
                value={newPlate} 
                onChange={(e) => setNewPlate(e.target.value)}
                className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                required
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition">Valider</button>
            </form>
          )}

          {garageLoading ? (
            <div className="text-center py-4 text-slate-400 text-sm">Chargement du garage...</div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500 text-sm">Aucun véhicule. Ajoutez votre premier véhicule pour commencer.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {vehicles.map((v) => (
                <div 
                  key={v.id} 
                  onClick={() => setSelectedVehicle(v)}
                  className={\`cursor-pointer border-2 rounded-xl p-4 transition-all \${selectedVehicle?.id === v.id ? 'border-blue-600 bg-blue-50' : 'border-slate-100 bg-white hover:border-slate-300'}\`}
                >
                  <div className="flex items-center gap-3">
                    <div className={\`w-10 h-10 rounded-full flex items-center justify-center \${selectedVehicle?.id === v.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}\`}>
                      <Car className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 tracking-wide">{v.immatriculation}</div>
                      <div className="text-[10px] uppercase text-slate-500 font-semibold">{v.brand || "Véhicule enregistré"}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* BLOC 3 : LE DIAGNOSTIC (Seulement si véhicule sélectionné) */}
        {selectedVehicle && (
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-lg font-black uppercase text-slate-900 mb-6">2. Lancer un Diagnostic pour {selectedVehicle.immatriculation}</h2>
            
            <form onSubmit={handleLaunchDiagnostic} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Décrivez les symptômes *</label>
                <textarea 
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Ex: La voiture broute à froid, perte de puissance à l'accélération..."
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Code OBD (Optionnel)</label>
                  <input 
                    type="text" 
                    value={obd}
                    onChange={(e) => setObd(e.target.value)}
                    placeholder="Ex: P0300, DF025..."
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Niveau d'expertise</label>
                  <select 
                    value={expertise}
                    onChange={(e) => setExpertise(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer font-semibold"
                  >
                    <option value="Débutant">Débutant (Vulgarisé)</option>
                    <option value="Intermédiaire">Intermédiaire (Outils standard)</option>
                    <option value="Expert">Expert (Schémas, Couples Nm)</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isDiagnosing}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest text-sm py-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-4 border border-slate-900 shadow-lg"
              >
                {isDiagnosing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Analyse IA en cours...
                  </>
                ) : (
                  <>
                    <Cpu className="w-5 h-5 text-[#D4AF37]" />
                    Lancer le diagnostic
                  </>
                )}
              </button>
            </form>
          </section>
        )}

        {/* BLOC 4 : L'AFFICHAGE DU RAPPORT */}
        {report && (
          <section className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-8">
            <div className="bg-slate-900 text-white p-5 flex items-center gap-3">
              <CheckCircle2 className="text-[#D4AF37] w-6 h-6" />
              <h2 className="text-lg font-black uppercase tracking-wider">Rapport d'Expertise IA</h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Alerte Sécurité */}
              {report.alerte_securite_critique && report.message_securite && (
                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-xl flex gap-3">
                  <AlertTriangle className="text-red-600 w-6 h-6 shrink-0" />
                  <div>
                    <h4 className="text-red-900 font-bold uppercase text-sm mb-1">Alerte Sécurité Critique</h4>
                    <p className="text-red-800 text-sm leading-relaxed">{report.message_securite}</p>
                  </div>
                </div>
              )}

              {/* Identification */}
              {report.identification_validee && (
                <div>
                  <h3 className="text-sm border-b border-slate-100 pb-2 mb-3 font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Identification Validée
                  </h3>
                  <p className="text-slate-600 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {report.identification_validee}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Triage */}
                {report.questions_triage && report.questions_triage.length > 0 && (
                  <div>
                    <h3 className="text-sm border-b border-slate-100 pb-2 mb-3 font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Questions de Triage
                    </h3>
                    <ul className="space-y-2">
                      {report.questions_triage.map((q, idx) => (
                        <li key={idx} className="text-sm text-slate-600 flex gap-2">
                          <span className="font-bold text-slate-300">{idx + 1}.</span> {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Causes probables */}
                {report.causes_probables && report.causes_probables.length > 0 && (
                  <div>
                    <h3 className="text-sm border-b border-slate-100 pb-2 mb-3 font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      Causes Probables
                    </h3>
                    <ul className="space-y-3 relative">
                      {report.causes_probables.map((c, idx) => (
                        <li key={idx} className="text-sm text-slate-700 bg-slate-50 border border-slate-100 rounded-lg p-3 flex justify-between items-center gap-4">
                          <span className="font-medium">{c.cause}</span>
                          <span className="bg-slate-200 text-slate-800 font-bold px-2 py-1 rounded text-xs shrink-0">
                            {c.probabilite_pourcentage}%
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Plan d'action */}
              {report.plan_action && (
                <div>
                  <h3 className="text-sm border-b border-slate-100 pb-2 mb-3 font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2 mt-4">
                     <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Plan d'Action Recommandé
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {report.plan_action.verifications && report.plan_action.verifications.length > 0 && (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Étapes de vérification</h4>
                        <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                          {report.plan_action.verifications.map((v, i) => <li key={i}>{v}</li>)}
                        </ul>
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      {report.plan_action.outils_requis && report.plan_action.outils_requis.length > 0 && (
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Outils Requis</h4>
                          <p className="text-sm text-slate-700">{report.plan_action.outils_requis.join(", ")}</p>
                        </div>
                      )}
                      
                      {report.plan_action.pieces_a_changer && report.plan_action.pieces_a_changer.length > 0 && (
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Pièces Potentielles à Remplacer</h4>
                          <p className="text-sm text-slate-700 font-semibold">{report.plan_action.pieces_a_changer.join(", ")}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Conseil de sécurité si pas critique */}
              {!report.alerte_securite_critique && report.message_securite && (
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mt-4">
                  <h4 className="text-blue-800 font-bold text-xs uppercase mb-1">Conseil Préventif</h4>
                  <p className="text-blue-700 text-sm">{report.message_securite}</p>
                </div>
              )}

            </div>
          </section>
        )}
      </main>
    </div>
  );
}
