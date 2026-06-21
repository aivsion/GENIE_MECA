import React, { useState, useEffect, useRef } from "react";
import { 
  Car, 
  Bike, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Wrench, 
  Compass, 
  User, 
  ArrowRight, 
  Plus, 
  Info, 
  HelpCircle, 
  Send, 
  History, 
  Settings, 
  ShieldAlert, 
  Loader2, 
  DollarSign, 
  Check, 
  Sliders, 
  MessageSquare,
  Sparkles,
  FileText,
  BadgePercent,
  Mic,
  MicOff,
  Truck,
  Maximize2,
  Minimize2,
  ExternalLink,
  Motorbike,
  Hammer,
  ClipboardCheck
} from "lucide-react";

// Types for Chat Messages
interface Message {
  role: "user" | "model";
  text: string;
}

// Preset vehicle data for intuitive UX - Comprehensive worldwide historic & modern catalog
const VEHICLE_PRESETS = {
  voiture: {
    brands: [
      "Peugeot", "Renault", "Citroën", "Volkswagen", "Toyota", "Tesla", 
      "BMW", "Audi", "Mercedes-Benz", "Ford", "Dacia", "Abarth", "Acura", "Alfa Romeo", 
      "Alpine", "Aston Martin", "Bentley", "Bugatti", "Buick", "BYD", "Cadillac", 
      "Changan", "Chery", "Chevrolet", "Chrysler", "Cupra", "Daewoo", "Daihatsu", "DeLorean", "Dodge", "DS Automobiles", "Ferrari", 
      "Fiat", "Geely", "Genesis", "GMC", "Great Wall", "Honda", "Hummer", "Hyundai", "Infiniti", "Jaguar", "Jeep", "Kia", "Koenigsegg", "Lamborghini", 
      "Lancia", "Land Rover", "Lexus", "Lincoln", "Lotus", "Lucid", "Maserati", "Mazda", "McLaren", "MG", "Mini", 
      "Mitsubishi", "Nissan", "Opel", "Pagani", "Polestar", "Porsche", "Rolls-Royce", "Rover", "Saab", 
      "Seat", "Skoda", "Smart", "SsangYong", "Subaru", "Suzuki", "Tata", "Venturi", "Volvo", "XPeng", "Delahaye", "Panhard", 
      "Simca", "Talbot", "De Dion-Bouton", "Pontiac", "Plymouth", "Oldsmobile",
      "Autre (Saisie libre)"
    ],
    models: {
      Peugeot: ["208", "308", "508", "2008", "3008", "5008", "e-208", "e-2008", "Partner", "Expert", "Rifter", "205 GTI (Classic)", "404", "504"],
      Renault: ["Clio", "Captur", "Zoe", "Megane", "Megane E-Tech", "Kadjar", "Austral", "Arkana", "Scenic", "Twingo", "Super 5 (Classic)", "Alpine A110"],
      Citroën: ["C3", "C4", "C5 Aircross", "C3 Aircross", "Ami", "Berlingo", "Jumpy", "2CV (Classic)", "DS 21", "Saxo VTS"],
      Volkswagen: ["Golf", "Polo", "ID.3", "ID.4", "Tiguan", "T-Roc", "Passat", "Touran", "Coccinelle (Classic)", "Combi T1"],
      Toyota: ["Yaris", "Prius", "RAV4", "Corolla", "C-HR", "Aygo", "Hilux", "Land Cruiser", "Supra"],
      Tesla: ["Model 3", "Model Y", "Model S", "Model X", "Cybertruck"],
      BMW: ["Série 1", "Série 3", "Série 5", "Série 7", "X1", "X3", "X5", "i4", "iX", "M3", "2002 Tii (Classic)"],
      Audi: ["A1", "A3", "A4", "A6", "Q3", "Q5", "Q7", "e-tron", "TT", "RS6"],
      "Mercedes-Benz": ["Classe A", "Classe C", "Classe E", "Classe S", "GLA", "GLC", "GLE", "EQA", "EQB", "SLK", "190E (Classic)"],
      Ford: ["Fiesta", "Focus", "Puma", "Kuga", "Mustang", "Mustang Mach-E", "Ranger", "Model T (1908)", "Capri"],
      Dacia: ["Sandero", "Duster", "Spring", "Jogger", "Logan"],
      Abarth: ["595", "695", "124 Spider", "Punto Abarth"],
      Acura: ["NSX", "Integra", "MDX", "TLX"],
      "Alfa Romeo": ["Giulia", "Stelvio", "Tonale", "Giulietta", "Mito", "Spider (Classic)"],
      Alpine: ["A110 (Moderne)", "A110 Berlinale (Classic)", "A310"],
      "Aston Martin": ["DB11", "Vantage", "DBX", "DBS", "DB5 (Historic)"],
      Bentley: ["Continental GT", "Bentayga", "Flying Spur"],
      Bugatti: ["Chiron", "Veyron", "Type 35 (Historic)"],
      Buick: ["Regal", "Enclave", "Electra (Historic)", "LeSabre (Classic)"],
      BYD: ["Atto 3", "Han", "Tang", "Dolphin", "Seal"],
      Cadillac: ["Escalade", "XT4", "ATS", "Eldorado (Historic)"],
      Changan: ["UNI-K", "UNI-V", "Benni EV"],
      Chery: ["Tiggo 7", "Tiggo 8", "Omoda 5"],
      Chevrolet: ["Corvette", "Camaro", "Bolt", "Tahoe", "Impala (Historic)"],
      Chrysler: ["300C", "Pacifica", "Voyager"],
      Cupra: ["Formentor", "Born", "Leon", "Ateca"],
      Daewoo: ["Matiz", "Lanos", "Nubira"],
      Daihatsu: ["Copen", "Sirion", "Terios"],
      DeLorean: ["DMC-12 (1981)"],
      Dodge: ["Challenger", "Charger", "Ram", "Durango"],
      "DS Automobiles": ["DS 3 Crossback", "DS 4", "DS 7 Crossback", "DS 9"],
      Ferrari: ["296 GTB", "SF90", "F8 Tributo", "Portofino", "Roma", "Testarossa (Classic)"],
      Fiat: ["500", "500e", "Panda", "Tipo", "Punto", "500 L (Historic)"],
      Geely: ["Geometry C", "Tugella", "Monjaro"],
      Genesis: ["G70", "G80", "GV70", "GV80"],
      GMC: ["Sierra", "Yukon", "Hummer EV"],
      "Great Wall": ["Ora Funky Cat", "Wey 03", "Poer"],
      Honda: ["Civic", "CR-V", "HR-V", "Jazz", "NSX"],
      Hummer: ["H1 (Classic)", "H2", "H3"],
      Hyundai: ["i20", "i30", "Tucson", "Santa Fe", "Kona", "Ioniq 5", "Ioniq 6"],
      Infiniti: ["Q50", "Q60", "QX50", "QX80"],
      Jaguar: ["F-Type", "F-Pace", "E-Pace", "I-Pace", "Type E (Historic)"],
      Jeep: ["Renegade", "Compass", "Wrangler", "Grand Cherokee", "Avenger"],
      Kia: ["Picanto", "Rio", "Ceed", "Sportage", "Sorento", "EV6", "EV9", "Niro"],
      Koenigsegg: ["Jesko", "Agera", "Regera", "Cc8S"],
      Lamborghini: ["Urus", "Huracán", "Aventador", "Revuelto", "Countach (Classic)"],
      Lancia: ["Ypsilon", "Delta HF Integrale (Classic)", "Fulvia"],
      "Land Rover": ["Defender", "Range Rover Evoque", "Range Rover Sport", "Discovery"],
      Lexus: ["UX", "NX", "RX", "ES", "LC"],
      Lincoln: ["Navigator", "Aviator", "Continental"],
      Lotus: ["Elise", "Exige", "Evora", "Emira", "Eletre (Électrique)"],
      Lucid: ["Air", "Gravity"],
      Maserati: ["Ghibli", "Levante", "Quattroporte", "Grecale", "MC20"],
      Mazda: ["Mazda 2", "Mazda 3", "CX-30", "CX-5", "MX-5 Miata"],
      McLaren: ["720S", "570S", "P1", "Artura", "F1 (Classic)"],
      MG: ["MG4", "MG5", "ZS", "EHS", "Marvel R", "MGB (Historic)"],
      Mini: ["Cooper", "Countryman", "Clubman"],
      Mitsubishi: ["Space Star", "ASX", "Eclipse Cross", "Outlander", "L200", "Pajero (Classic)"],
      Nissan: ["Micra", "Juke", "Qashqai", "X-Trail", "Leaf", "Ariya", "GT-R", "370Z"],
      Opel: ["Corsa", "Astra", "Mokka", "Grandland", "Insignia", "GT (Classic)"],
      Pagani: ["Zonda", "Huayra", "Utopia"],
      Polestar: ["Polestar 2", "Polestar 3", "Polestar 4"],
      Porsche: ["911 Carrera", "Cayenne", "Macan", "Panamera", "Taycan", "718 Cayman", "356 (Historic)"],
      "Rolls-Royce": ["Phantom", "Ghost", "Cullinan", "Spectre"],
      Rover: ["Mini Cooper (Classic)", "Rover 75", "SD1", "Defender d'époque"],
      Saab: ["9-3", "9-5", "900 Turbo (Classic)"],
      Seat: ["Ibiza", "Leon", "Arona", "Ateca", "Tarraco"],
      Skoda: ["Fabia", "Scala", "Octavia", "Superb", "Kamiq", "Karoq", "Kodiaq", "Enyaq"],
      Smart: ["Fortwo", "Forfour", "Smart #1", "Smart #3"],
      SsangYong: ["Tivoli", "Korando", "Rexton", "Musso"],
      Subaru: ["Impreza WRX", "Forester", "Outback", "XV"],
      Suzuki: ["Swift", "Ignis", "Vitara", "S-Cross", "Jimny"],
      Tata: ["Nexon", "Harrier", "Safari", "Nano"],
      Venturi: ["Fétish", "Atlantique 300 (Classic)", "Transcup"],
      Volvo: ["XC40", "XC60", "XC90", "V40", "V60", "C40", "EX30"],
      XPeng: ["G6", "G9", "P7"],
      Delahaye: ["Type 135 (Classic)"],
      Panhard: ["PL 17 (Classic)", "Dyna Z"],
      Simca: ["Aronde (Classic)", "1000", "1100"],
      Talbot: ["Horizon", "Samba", "Rancho"],
      "De Dion-Bouton": ["Vis-à-vis (1901)"],
      Pontiac: ["Firebird", "GTO (Classic)", "Soline"],
      Plymouth: ["Barracuda (Classic)", "Fury"],
      Oldsmobile: ["Cutlass (Classic)", "Super 88"],
      "Autre (Saisie libre)": ["Modèle personnalisé ou historique"]
    },
    symptoms: [
      { text: "Le moteur broute / rate d'allumage", code: "P0300" },
      { text: "Voyant moteur allumé - catalyseur fatigué", code: "P0420" },
      { text: "Bruit de sifflement important à l'accélération", code: "" },
      { text: "Bruit de grincement métallique au freinage", code: "" },
      { text: "Fumée noire épaisse et perte de puissance", code: "" }
    ],
    engines: ["Essence PureTech/TSI", "Diesel BlueHDi/TDI", "Hybride", "100% Électrique"]
  },
  moto: {
    brands: [
      "Yamaha", "Honda", "BMW", "Kawasaki", "Suzuki", "Ducati", "Triumph", 
      "Harley-Davidson", "KTM", "Indian", "Aprilia", "Moto Guzzi", "Royal Enfield", 
      "Husqvarna", "MV Agusta", "Benelli", "Norton", "BSA", "Brough Superior",
      "Beta", "Bimota", "Buell", "CF Moto", "GasGas", "Hero", "Hyosung", "Jawa",
      "Keeway", "Laverda", "Mash", "Mondial", "Moto Morini", "Peugeot Motocycles",
      "Rieju", "SWM", "Sherco", "Ural", "Victory", "Voxan", "Zontes",
      "Autre (Saisie libre)"
    ],
    models: {
      Yamaha: ["MT-07", "MT-09", "Tracer 7", "Tracer 9", "Ténéré 700", "R1", "YZF-R125", "XSR700", "XT 500 (Classic)", "VMAX"],
      Honda: ["CB500F", "CB650R", "CBR600RR", "CBR1000RR-R", "Africa Twin", "NC750X", "Transalp", "Goldwing", "CB750 Four (Classic)"],
      BMW: ["F 900 R", "F 850 GS", "R 1250 GS", "R 1300 GS", "R 1250 RT", "S 1000 RR", "S 1000 XR", "R nineT", "R80 G/S (Classic)"],
      Kawasaki: ["Z650", "Z900", "Ninja 650", "Ninja H2", "Versys 650", "Versys 1000", "Vulcan S", "Z1 900 (Classic)"],
      Suzuki: ["SV650", "V-Strom 650", "V-Strom 1050", "GSX-S750", "GSX-S1000", "Hayabusa", "GT750 (Classic)"],
      Ducati: ["Monster", "Multistrada V4", "Panigale V4", "Scrambler", "Diavel", "Streetfighter V4", "DesertX", "916 (Classic)"],
      Triumph: ["Trident 660", "Street Triple", "Speed Twin", "Tiger Sport 660", "Tiger 900", "Bonneville T120", "Thruxton"],
      "Harley-Davidson": ["Sportster S", "Pan America 1250", "Fat Boy", "Street Bob", "Low Rider S", "Electra Glide", "WLA (Historical)"],
      KTM: ["Duke 125", "Duke 390", "Duke 790", "Super Duke 1290", "Adventure 890", "EXC 300"],
      Indian: ["Scout", "Chief", "FTR 1200", "Challenger"],
      Aprilia: ["RS 660", "Tuono 660", "Tuareg 660", "RSV4", "Tuono V4"],
      "Moto Guzzi": ["V7", "V9", "V85 TT", "V100 Mandello"],
      "Royal Enfield": ["Interceptor 650", "Continental GT 650", "Meteor 350", "Himalayan 450", "Bullet 350"],
      Husqvarna: ["Svartpilen 125", "Vitpilen 401", "Norden 901", "701 Supermoto"],
      "MV Agusta": ["Brutale", "Dragster", "Superveloce", "F3"],
      Benelli: ["TRK 502", "Leoncino 500", "Imperiale 400"],
      Norton: ["Commando 961", "V4SV"],
      BSA: ["Gold Star 650", "A65 (Classic)"],
      "Brough Superior": ["SS100 (Historic Luxury)", "Lawrence"],
      Beta: ["RR 300", "Xtrainer", "Alp 4.0"],
      Bimota: ["KB4", "TESI H2"],
      Buell: ["XB12 Lightning", "1125R"],
      "CF Moto": ["NK 450", "MT 800", "CL-X 700"],
      GasGas: ["EC 300", "MC 250", "SM 700"],
      Hero: ["Splendor", "Xpulse 200", "Maestro Edge"],
      Hyosung: ["Aquila GV 125", "GT 650 R"],
      Jawa: ["Classic 300", "Perak", "350 (Classic 2T)"],
      Keeway: ["Superlight 125", "RKF 125"],
      Laverda: ["SFC 750 (Classic)", "Jota"],
      Mash: ["Seventy 125", "Black Seven", "Five Hundred"],
      Mondial: ["HPS 125", "Sport Classic"],
      "Moto Morini": ["X-Cape 650", "Seiemmezzo"],
      "Peugeot Motocycles": ["PM-01 125", "PM-01 300"],
      Rieju: ["MR 300", "Tango 125", "Century 125"],
      SWM: ["Gran Milano 500", "Superdual T"],
      Sherco: ["SE 300", "SE-F 450"],
      Ural: ["Ranger (Avec Side-car)", "Gear Up"],
      Victory: ["Hammer", "Gunner", "Octane"],
      Voxan: ["Cafe Racer", "Charade", "Scrambler"],
      Zontes: ["GK 125", "T2-310", "GK 350"],
      "Autre (Saisie libre)": ["Modèle personnalisé ou historique"]
    },
    symptoms: [
      { text: "Guidon qui tremble / jeu de direction", code: "" },
      { text: "Embrayage qui patine dans les tours", code: "" },
      { text: "Pétarades excessives à la décélération", code: "" },
      { text: "Difficulté à passer les rapports à chaud", code: "" }
    ],
    engines: ["Bicylindre 4 temps", "Monocylindre", "3 cylindres coupleux", "4 cylindres sportif", "Bicylindre en V (V-Twin)", "Moteur 2 temps d'époque"]
  },
  scooter: {
    brands: [
      "Vespa", "Piaggio", "Yamaha", "Peugeot", "Honda", "Kymco", "SYM", 
      "Lambretta", "Garelli", "Motobécane", "Niu", "BMW", "Super Soco", 
      "Silence", "Aprilia", "Gilera", "Malaguti", "Adly", "Baotian", "Daelim", 
      "Derbi", "Generic", "Italjet", "Linhai", "MBK", "Over", "PGO", "Segway", "TGB",
      "Autre (Saisie libre)"
    ],
    models: {
      Vespa: ["Primavera 50", "Sprint 50", "GTS 125", "GTS 300 Super", "Elettrica", "Vespa 125 TAP (Historic)", "PX 125 (Classic 2T)"],
      Piaggio: ["Zip 50", "Liberty 125", "Medley 125", "Beverly 400", "MP3 300 (Trois-Roues)", "MP3 400", "MP3 530", "Ciao (Classic)"],
      Yamaha: ["D'elight", "NMAX 125", "XMAX 125", "XMAX 300", "TMAX 560", "Tricity 125", "Chappy (Classic)", "Aero50"],
      Peugeot: ["Kisbee 50", "Tweet 125", "Django 125", "Pulsion 125", "Metropolis 400", "Speedfight 50", "Ludix"],
      Honda: ["PCX 125", "Forza 125", "SH 125", "ADV 350", "Forza 350", "X-ADV 750", "Spazio 250"],
      Kymco: ["Agility 50", "Like 125", "DTX 360", "AK 550", "CV3", "People S"],
      SYM: ["Orbit III 50", "Symphony 125", "Cruisym 125", "Maxsym TL 508", "Fiddle IV"],
      Lambretta: ["V-Special 125", "X300", "G350 Special", "LI 150 (Classic)"],
      Garelli: ["Capri (Classic)", "Noisette"],
      Motobécane: ["Mobylette AV88 (Classic)", "Cady", "SP93"],
      Niu: ["NQi Sport", "MQi GT", "UQi Sport"],
      BMW: ["C 400 GT", "CE 04 (Électrique)", "C 650 Sport", "C1 (Avec arceau)"],
      "Super Soco": ["CPx", "CUx"],
      Silence: ["S01", "S02"],
      Aprilia: ["SR GT 125", "SXR 50", "SR 50"],
      Gilera: ["Runner 125", "Runner 50", "GP800"],
      Malaguti: ["Madison 125", "Mission 125"],
      Adly: ["Silver Fox", "Noble 50"],
      Baotian: ["BT49QT", "Falcon"],
      Daelim: ["S3 125", "Afour"],
      Derbi: ["GP1", "Atlantis 50", "Senda (Supermot d'époque)"],
      Generic: ["Trigger 50", "Xor"],
      Italjet: ["Dragster 125 (New)", "Dragster 200", "Formula 50 (Classic)"],
      Linhai: ["Main Street 300", "Rusty"],
      MBK: ["Booster 50 (Célèbre d'époque)", "Ovetto 50", "Nitro 50", "Skyliner 125"],
      Over: ["Thor", "B3"],
      PGO: ["Big Max 50", "G-Max 125"],
      Segway: ["E110S", "E125S", "E300SE"],
      TGB: ["Hawk 50", "Express 125"],
      "Autre (Saisie libre)": ["Modèle personnalisé ou historique"]
    },
    symptoms: [
      { text: "Perte de vitesse de pointe (variateur usé)", code: "" },
      { text: "Démarrage difficile ou instable par temps de pluie", code: "" },
      { text: "Bruit métallique sourd côté carter de transmission", code: "" }
    ],
    engines: ["50cc 2 temps", "50cc 4 temps", "125cc injection", "Maxi-scooter 300cc à 400cc", "Maxi-scooter 500cc+", "Électrique (Moteur Brushless)"]
  },
  utilitaire: {
    brands: [
      "Renault", "Peugeot", "Citroën", "Fiat", "Ford", "Mercedes-Benz", 
      "Volkswagen", "Iveco", "Toyota", "Opel", "Nissan", "MAN", "Maxus", 
      "Isuzu", "Fuso", "Citroën (Historique)", "Renault (Historique)", "DFSK",
      "Fiat Professional", "GMC", "LDV", "Mahindra", "Piaggio Commercial",
      "Autre (Saisie libre)"
    ],
    models: {
      Renault: ["Express Van", "Kangoo Van", "Trafic", "Master", "Estafette (Classic)", "Renault Goélette (Historic)"],
      Peugeot: ["Partner", "Expert", "Boxer", "Landtrek", "J7 (Classic)", "J9 (Classic)"],
      Citroën: ["Berlingo Van", "Jumpy", "Jumper", "Type H (Classic Célèbre)", "C35 (Classic)", "Acadiane"],
      Fiat: ["Fiorino", "Doblo", "Scudo", "Ducato", "900T (Historic)"],
      Ford: ["Transit Courier", "Transit Connect", "Transit Custom", "Transit 2T", "Ranger", "Transit MK1 (Classic)"],
      "Mercedes-Benz": ["Citan", "Vito", "Sprinter", "Vario (Classic)", "L319 (Historic)"],
      Volkswagen: ["Caddy Van", "Transporter T6.1", "Crafter", "ID. Buzz Cargo", "Transporter T2 (Combi Split)", "LT35"],
      Iveco: ["Daily Furgone", "Daily Cabinato", "Eurocargo Light dumper"],
      Toyota: ["Proace City", "Proace", "Hilux", "Dyna"],
      Opel: ["Combo Cargo", "Vivaro", "Movano"],
      Nissan: ["Townstar", "Primastar", "Interstar", "Navara", "Cabstar"],
      MAN: ["TGE Furgon", "MAN TGM"],
      Maxus: ["eDeliver 3", "eDeliver 9", "Deliver 9"],
      Isuzu: ["D-Max Pickup", "N-Series Truck"],
      Fuso: ["Canter 3.5t", "Canter Eco Hybrid"],
      "Citroën (Historique)": ["Type H (Nez de cochon)", "2CV Fourgonnette CO", "C25"],
      "Renault (Historique)": ["Estafette", "SG2", "Renault Master 1ère génération"],
      DFSK: ["C31 Truck", "EC35 Électrique"],
      "Fiat Professional": ["Fiorino", "Doblò Cargo", "Scudo Van", "Ducato Maxi"],
      GMC: ["Savana", "Sierra Pro"],
      LDV: ["V80", "Deliver 9", "eDeliver 3"],
      Mahindra: ["Supro", "Bolero Pickup"],
      "Piaggio Commercial": ["Ape 50 (Triporteur mythique)", "Porter NP6"],
      "Autre (Saisie libre)": ["Modèle personnalisé ou historique"]
    },
    symptoms: [
      { text: "Bruit de sifflement turbo important / perte de charge", code: "" },
      { text: "Témoin d'AdBlue allumé - blocage démarrage imminent", code: "P20E8" },
      { text: "Embrayage qui patine sous lourde charge", code: "" },
      { text: "Consommation excessive d'huile et fumée bleue", code: "" },
      { text: "Filtre à Particules obstrué / perte de puissance", code: "P14A3" }
    ],
    engines: ["Diesel dCi/BlueHDi/TDCI", "Essence TCe/TSI", "Hybride rechargeable (PHEV)", "GNC / Carburation Gaz", "100% Électrique (⚡)"]
  }
};

// Beautiful vector SVG representation of the official Genie Meca Logo
function GenieMecaLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <img src="/Logo%20GENIE%20MECA%20OR.png" alt="Logo Génie Méca" className={`object-contain ${className}`} id="logo-vector-meca" />
  );
}

export default function App() {
  // Navigation active state: "home" or "agent-console"
  const [activeTab, setActiveTab] = useState<"home" | "agent-console">("home");
  
  // Simulated commercial subscription plans
  const [simulatedPlan, setSimulatedPlan] = useState<string>("Découverte (Gratuit / Bridé)");
  
  // Premium subscription state to manage paywall
  const [hasPaidPremium, setHasPaidPremium] = useState<boolean>(false);
  
  // User mechanical expertise level state
  const [expertiseLevel, setExpertiseLevel] = useState<"" | "Débutant" | "Intermédiaire" | "Expert / Pro">("");
  
  // Fullscreen chat toggle state
  const [isChatFullscreen, setIsChatFullscreen] = useState<boolean>(false);
  
  // Guided vehicle builder fields
  const [category, setCategory] = useState<"voiture" | "moto" | "scooter" | "utilitaire">("voiture");
  const [brand, setBrand] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [customBrand, setCustomBrand] = useState<string>("");
  const [customModel, setCustomModel] = useState<string>("");
  const [year, setYear] = useState<string>("2020");
  const [engine, setEngine] = useState<string>("");
  const [obdCode, setObdCode] = useState<string>("");
  const [symptomText, setSymptomText] = useState<string>("");
  
  // API SIV / VIN Identification states
  const [sivVinQuery, setSivVinQuery] = useState<string>("");
  const [isIdentifying, setIsIdentifying] = useState<boolean>(false);
  const [identifiedVehicle, setIdentifiedVehicle] = useState<any | null>(null);
  const [sivError, setSivError] = useState<string>("");
  const [isCookieBlocked, setIsCookieBlocked] = useState<boolean>(false);

  // Custom states for Freemium paywall and notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "info" | null>(null);
  const [isPaywallOpen, setIsPaywallOpen] = useState<boolean>(false);
  const [paywallVehicleName, setPaywallVehicleName] = useState<string>("");
  const [isCheckoutLoading, setIsCheckoutLoading] = useState<boolean>(false);

  // Stripe checkout redirect logic
  const handleStripeCheckout = async (targetVin?: string, amount = 49, planName = "Formule Solo") => {
    setIsCheckoutLoading(true);
    setToastMessage(null);
    try {
      const vinOrPlate = targetVin || identifiedVehicle?.immatriculation || identifiedVehicle?.vin || "Visiteur";
      const res = await fetch(window.location.origin + "/api/stripe-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ vinOrPlate, amount, planName })
      });
      
      const rawText = await res.text();
      // Detect if intercepted by the AI Studio security cookie check page
      if (
        rawText.includes("Cookie check") || 
        rawText.includes("cookie-check") || 
        rawText.includes("aistudio_auth") || 
        rawText.includes("redirectToReturnUrl") ||
        rawText.includes("grantStorageAccess")
      ) {
        setIsCookieBlocked(true);
        throw new Error("COOKIE_BLOCKED_ERROR");
      }

      const data = JSON.parse(rawText);
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Impossible de générer la session de paiement.");
      }
    } catch (err: any) {
      console.error(err);
      if (err.message === "COOKIE_BLOCKED_ERROR" || isCookieBlocked) {
        setToastMessage("⚠️ Les cookies d'identification sont bloqués par votre navigateur. Cliquez sur 'Ouvrir dans un nouvel onglet' en haut à droite !");
      } else {
        setToastMessage("Erreur d'initialisation du paiement Stripe.");
      }
      setToastType("error");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  // Fetch URL query parameters on startup to unlock premium after checkout redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkoutStatus = params.get("checkout");
    const vinParam = params.get("vin");
    const planParam = params.get("plan") || "Formule Solo";
    const amountParam = params.get("amount") || "49";
    const isSimulated = params.get("simulated");

    if (checkoutStatus === "success") {
      setHasPaidPremium(true);
      setSimulatedPlan(`${planParam} (${amountParam} € / an)`);
      
      // Clear query params cleanly
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);

      // Toast feedback
      setToastMessage(
        isSimulated 
          ? `🔐 ACCÈS SIMULÉ ACTIVÉ : Diagnostics illimités débloqués avec le forfait ${planParam} (${amountParam}€ / an).` 
          : `🎉 Paiement Stripe validé ! Forfait ${planParam} (${amountParam}€ / an) débloqué pour diagnostics illimités.`
      );
      setToastType("success");
      setActiveTab("agent-console");
    } else if (checkoutStatus === "cancel") {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
      setToastMessage("Le processus de paiement Stripe a été annulé.");
      setToastType("error");
    }
  }, []);
  
  // Helper to get alphabetical sorted list of brands with 'Autre (Saisie libre)' always kept at the end
  const getSortedBrands = (cat: "voiture" | "moto" | "scooter" | "utilitaire") => {
    const originalBrands = VEHICLE_PRESETS[cat].brands;
    const hasAutre = originalBrands.includes("Autre (Saisie libre)");
    const filtered = originalBrands.filter(b => b !== "Autre (Saisie libre)");
    const sorted = [...filtered].sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }));
    if (hasAutre) {
      sorted.push("Autre (Saisie libre)");
    }
    return sorted;
  };

  // Helper to get alphabetical sorted list of models
  const getSortedModels = (cat: "voiture" | "moto" | "scooter" | "utilitaire", br: string) => {
    const originalModels = VEHICLE_PRESETS[cat].models[br] || [];
    const exclusions = ["Modèle personnalisé ou historique", "Autre (Saisie libre)"];
    const filtered = originalModels.filter(m => !exclusions.includes(m));
    const sorted = [...filtered].sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }));
    
    // Add "Autre (Saisie libre)" at the end for all brands (except when brand itself is 'Autre (Saisie libre)')
    if (br !== "Autre (Saisie libre)" && !sorted.includes("Autre (Saisie libre)")) {
      sorted.push("Autre (Saisie libre)");
    }
    
    if (originalModels.includes("Modèle personnalisé ou historique") && !sorted.includes("Modèle personnalisé ou historique")) {
      sorted.push("Modèle personnalisé ou historique");
    }
    return sorted;
  };

  // Chat state management
  const [chatInput, setChatInput] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Bonjour ! Je suis **Génie Méca**, votre expert en mécanique prédictive.\n\nQuelle panne ou anomalie remarquez-vous sur votre appareil ? Dites-moi tout pour lancer l'orchestrateur de diagnostics."
    }
  ]);
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);
  const [apiWarning, setApiWarning] = useState<string>("");

  // Saved diagnostics logs
  const [savedReports, setSavedReports] = useState<any[]>([
    {
      id: "rep-1",
      date: "Aujourd'hui",
      vehicle: "Peugeot 208 (2019)",
      symptom: "Rapport P0300 : Moteur qui broute",
      status: "Analysé"
    },
    {
      id: "rep-2",
      date: "Hier",
      vehicle: "Yamaha MT-07 (2021)",
      symptom: "Embrayage qui patine à haut régime",
      status: "Archivé"
    }
  ]);

  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat window
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isBotTyping]);

  // Handle dynamic dropdown items based on vehicle categories
  useEffect(() => {
    const sortedBrands = getSortedBrands(category);
    if (!sortedBrands.includes(brand)) {
      setBrand(sortedBrands[0]);
    }
    setCustomBrand("");
    setCustomModel("");
  }, [category]);

  useEffect(() => {
    const sortedModels = getSortedModels(category, brand);
    if (!sortedModels.includes(model)) {
      setModel(sortedModels[0] || "");
    }
  }, [brand, category]);

  // Set default engine option based on category selected
  useEffect(() => {
    const fallbackEngine = VEHICLE_PRESETS[category].engines[0];
    setEngine(fallbackEngine);
  }, [category]);

  const handleQuickSymptom = (sym: { text: string; code: string }) => {
    setSymptomText(sym.text);
    setObdCode(sym.code);
  };

  // API SIV / VIN fetch routine
  const handleIdentifyVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sivVinQuery.trim()) return;

    setIsIdentifying(true);
    setSivError("");
    setIdentifiedVehicle(null);
    setIsCookieBlocked(false);

    try {
      const response = await fetch(window.location.origin + "/api/identify-vehicle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: sivVinQuery })
      });

      const rawText = await response.text();
      // Detect if intercepted by the AI Studio security cookie check page
      if (
        rawText.includes("Cookie check") || 
        rawText.includes("cookie-check") || 
        rawText.includes("aistudio_auth") || 
        rawText.includes("redirectToReturnUrl") ||
        rawText.includes("grantStorageAccess")
      ) {
        setIsCookieBlocked(true);
        throw new Error("COOKIE_BLOCKED_ERROR");
      }

      let data: any;
      try {
        data = JSON.parse(rawText);
      } catch (jsonErr) {
        console.error("Failed to parse SIV response as JSON:", jsonErr, "Raw body was:", rawText);
        throw new Error("Le serveur a renvoyé une réponse illisible. Veuillez patienter 2-3 secondes et cliquer à nouveau sur 'Identifier'.");
      }

      if (!response.ok) {
        throw new Error(data.error || "Une erreur s'est produite lors de la détection.");
      }

      if (data.success && data.vehicle) {
        setIdentifiedVehicle(data.vehicle);
        // Sync manual builder categories dynamically so user has uniform category visibility
        if (data.vehicle.category) {
          setCategory(data.vehicle.category);
        }
      } else {
        throw new Error("Impossible d'identifier ce véhicule. Rentrez vos spécifications manuellement.");
      }
    } catch (err: any) {
      console.error("Vehicle identification caught error:", err);
      let friendlyMessage = "Impossible de se connecter au service SIV. Veuillez réessayer d'ici quelques secondes.";
      if (err.message === "COOKIE_BLOCKED_ERROR" || isCookieBlocked) {
        friendlyMessage = "COOKIE_BLOCKED_ERROR";
      } else if (err.message) {
        if (
          err.message.includes("Load failed") || 
          err.message.includes("Failed to fetch") || 
          err.message.includes("expected pattern") ||
          err.message.includes("pattern")
        ) {
          friendlyMessage = "Le serveur de diagnostic s'initialise (démarrage du conteneur). Veuillez patienter 3 secondes et cliquer à nouveau sur le bouton 'Identifier' !";
        } else {
          friendlyMessage = err.message;
        }
      }
      setSivError(friendlyMessage);
    } finally {
      setIsIdentifying(false);
    }
  };

  // Submit trigger from Guided Form
  const triggerGuidedDiagnostic = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!expertiseLevel) {
      setToastMessage("Veuillez choisir un niveau d'expertise.");
      setToastType("error");
      return;
    }
    
    let compiledPrompt = `[Diagnostic Rapide] `;
    
    if (identifiedVehicle) {
      compiledPrompt += `Catégorie: ${identifiedVehicle.category.toUpperCase()}, `;
      compiledPrompt += `Marque SIV/VIN: ${identifiedVehicle.brand}, Modèle d'usine: ${identifiedVehicle.model || "Non précisé"}, `;
      compiledPrompt += `Année: ${identifiedVehicle.year}, Motorisation: ${identifiedVehicle.engine || "Non précisée"}. `;
      if (identifiedVehicle.cylindree) {
        compiledPrompt += `Cylindrée: ${identifiedVehicle.cylindree}. `;
      }
      if (identifiedVehicle.codeMoteur) {
        compiledPrompt += `Code Constructeur: ${identifiedVehicle.codeMoteur}. `;
      }
      if (identifiedVehicle.immatriculation) {
        compiledPrompt += `Plaque Immatriculation: ${identifiedVehicle.immatriculation}. `;
      } else if (identifiedVehicle.vin) {
        compiledPrompt += `Code VIN: ${identifiedVehicle.vin}. `;
      }
    } else {
      const finalBrand = brand === "Autre (Saisie libre)" ? (customBrand.trim() || "Marque historique/rare") : brand;
      const finalModel = (brand === "Autre (Saisie libre)" || model === "Autre (Saisie libre)") ? (customModel.trim() || "Modèle personnalisé") : model;
      compiledPrompt += `Catégorie: ${category.toUpperCase()}, `;
      compiledPrompt += `Marque: ${finalBrand}, Modèle: ${finalModel || "Non précisé"}, `;
      compiledPrompt += `Année: ${year}, Motorisation: ${engine || "Non précisée"}. `;
    }
    
    if (obdCode) {
      compiledPrompt += `Code OBD: ${obdCode}. `;
    }
    compiledPrompt += `Symptôme : ${symptomText || "Démarrage difficile / hésitation"}.`;

    // Append to messages array
    const updatedMessages: Message[] = [
      ...chatMessages,
      { role: "user", text: compiledPrompt }
    ];
    setChatMessages(updatedMessages);
    
    // Smooth transition to console tab
    setActiveTab("agent-console");
    setTimeout(() => {
      executeBackendDiagnose(compiledPrompt, updatedMessages);
    }, 150);
  };

  // Standard chat message sender
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatInput("");

    const updatedMessages: Message[] = [
      ...chatMessages,
      { role: "user", text: userMsg }
    ];
    setChatMessages(updatedMessages);

    await executeBackendDiagnose(userMsg, updatedMessages);
  };

  // Query Backend API Route
  const executeBackendDiagnose = async (userPrompt: string, historyToSend: Message[]) => {
    setIsBotTyping(true);
    setApiWarning("");

    try {
      const response = await fetch(window.location.origin + "/api/diagnose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userPrompt,
          history: historyToSend.slice(-6, -1), // feed the last occurrences
          subscription: "Premium Intégral",
          vehicleData: identifiedVehicle, // PASS IDENTIFIED VEHICLE OVER THE WIRE TO GEMINI
          expertiseLevel: expertiseLevel,
          hasPaidPremium: hasPaidPremium
        })
      });

      const rawText = await response.text();
      // Detect if intercepted by the AI Studio security cookie check page
      if (
        rawText.includes("Cookie check") || 
        rawText.includes("cookie-check") || 
        rawText.includes("aistudio_auth") || 
        rawText.includes("redirectToReturnUrl") ||
        rawText.includes("grantStorageAccess")
      ) {
        setIsCookieBlocked(true);
        throw new Error("COOKIE_BLOCKED_ERROR");
      }

      let data: any;
      try {
        data = JSON.parse(rawText);
      } catch (jsonErr) {
        console.error("Failed to parse diagnose response as JSON:", jsonErr, "Raw body:", rawText);
        throw new Error("JSON_PARSE_ERROR");
      }

      if (!response.ok) {
        throw new Error(data.error || "Erreur serveur.");
      }

      if (data.limitReached) {
        setIsBotTyping(false);
        const vLabel = identifiedVehicle 
          ? `${identifiedVehicle.brand} ${identifiedVehicle.model} (${identifiedVehicle.immatriculation || identifiedVehicle.vin})`
          : "ce véhicule";
        setPaywallVehicleName(vLabel);
        setIsPaywallOpen(true);

        setChatMessages(prev => [
          ...prev,
          { 
            role: "model", 
            text: `⚠️ **Limite de diagnostic atteinte pour ce véhicule (${identifiedVehicle?.immatriculation || identifiedVehicle?.vin}).**\n\nPour débloquer la suite de ce guide technique de réparation pas-à-pas (références de pièces d'origine constructeur, couples de serrage du manuel d'atelier, pannes similaires), activez votre forfait Premium illimité pour seulement 49€ / an.` 
          }
        ]);
        return;
      }
      
      if (data.warning) {
        setApiWarning(data.warning);
      }

      setChatMessages(prev => [
        ...prev,
        { role: "model", text: data.response }
      ]);

      // Save locally to reports block
      const currentVehicleLabel = identifiedVehicle 
        ? `${identifiedVehicle.brand} ${identifiedVehicle.model}` 
        : `${brand} ${model || ""}`.trim() || `${category.toUpperCase()}`;
      
      const newReport = {
        id: "rep-" + Date.now(),
        date: "Aujourd'hui",
        vehicle: currentVehicleLabel,
        symptom: symptomText || userPrompt.substring(0, 36) + "...",
        status: "Analysé"
      };
      setSavedReports(prev => [newReport, ...prev]);

    } catch (err: any) {
      console.error(err);
      let textToShow = "🔴 **Impossible de joindre le système de secours multi-agent.** Merci de vérifier votre clé API ou de renouveler l'essai.";
      if (err.message === "COOKIE_BLOCKED_ERROR" || isCookieBlocked) {
        textToShow = "⚠️ **Votre navigateur bloque les cookies d'authentification** dans l'aperçu intégré (courant sur Safari, iOS, macOS ou Brave).\n\nPour continuer de chatter avec l'IA et utiliser toutes les fonctions d'identification SIV, cliquez sur le bouton ci-dessous pour ouvrir l'application dans son propre onglet ou autoriser les cookies.";
      }
      setChatMessages(prev => [
        ...prev,
        { 
          role: "model", 
          text: textToShow
        }
      ]);
    } finally {
      setIsBotTyping(false);
    }
  };

  // Fast quick testing links on landing
  const handleFastActionTest = async (topic: string) => {
    let msg = "";
    if (topic === "obd_p0300") {
      msg = "J'ai un code d'erreur P0300 sur une Peugeot 208 de 2019 (motorisation essence) et le moteur tremble à froid.";
    } else if (topic === "suspicious_smoke") {
      msg = "Fumée noire épaisse et grosse perte de puissance sur un véhicule diesel à l'accélération en montée.";
    } else if (topic === "scooter_loss") {
      msg = "Mon scooter de 125cc perd en vitesse de pointe et fait un bruit de sifflement métallique en transmission après 30 km/h.";
    }

    if (!msg) return;

    const updatedMessages: Message[] = [
      ...chatMessages,
      { role: "user", text: msg }
    ];
    setChatMessages(updatedMessages);
    setActiveTab("agent-console");
    setTimeout(() => {
      executeBackendDiagnose(msg, updatedMessages);
    }, 155);
  };

  // Helper to render individual lines of diagnostic markdown safely
  const renderMarkdownLine = (line: string, idx: number) => {
    // Clean safety warning elements red boxes
    if (line.includes("ALERTE SÉCURITÉ") || line.includes("ALERTE ROUGE") || line.includes("[ALERTE ROUGE]")) {
      return (
        <div key={idx} className="my-4 p-4.5 bg-rose-50 border-l-4 border-rose-600 rounded-r-xl text-rose-950 shadow-sm" id={`alert-box-${idx}`}>
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-5.5 h-5.5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-rose-900 font-display text-sm tracking-wide">AVERTISSEMENT SÉCURITÉ CRITIQUE</h4>
              <p className="text-xs sm:text-sm mt-1 leading-relaxed whitespace-pre-line font-sans">
                {line.replace("###", "").replace("🔴", "").replace("[ALERTE ROUGE]", "").trim()}
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Headers parsed as neat section steps
    if (line.startsWith("###") || line.startsWith("####")) {
      const isFourth = line.includes("4.") || line.includes("Plan d'Action");
      return (
        <h3 key={idx} className={`text-sm font-bold text-slate-900 mt-5 mb-2 font-display uppercase tracking-wider border-b border-slate-100 pb-1 flex items-center gap-2`} id={`h3-${idx}`}>
          <span className={`w-2 h-2 rounded-full inline-block ${isFourth ? "bg-[#D4AF37]" : "bg-sky-500"}`}></span>
          {line.replace("####", "").replace("###", "").trim()}
        </h3>
      );
    }

    // Parse bold variables
    let content: React.ReactNode = line;
    if (line.match(/\*\*(.*?)\*\*/)) {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      content = parts.map((part, pIdx) => {
        if (pIdx % 2 === 1) {
          return <strong key={pIdx} className="text-[#0f3f62] font-semibold bg-sky-50/70 px-1 rounded">{part}</strong>;
        }
        return part;
      });
    }

    // Bullets parser
    if (line.startsWith("-")) {
      return (
        <ul key={idx} className="list-disc list-inside ml-3 my-1 text-slate-700 leading-relaxed font-sans text-xs sm:text-sm" id={`bullet-${idx}`}>
          <span className="inline-block pl-1">{content}</span>
        </ul>
      );
    }

    return (
      <p key={idx} className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-sans my-1.5" id={`p-${idx}`}>
        {content}
      </p>
    );
  };

  // Beautiful formatting to render structured reports correctly in the console stream
  const renderFormattedMarkdown = (text: string) => {
    // Attempt to parse as JSON if the prompt triggered JSON format
    try {
      let jsonStr = text.trim();
      if (jsonStr.startsWith("```json")) jsonStr = jsonStr.substring(7);
      if (jsonStr.startsWith("```")) jsonStr = jsonStr.substring(3);
      if (jsonStr.endsWith("```")) jsonStr = jsonStr.substring(0, jsonStr.length - 3);
      
      const data = JSON.parse(jsonStr.trim());
      
      if (data.identification_validee || data.questions_triage) {
        let elements = [];
        let keyCounter = 0;
        
        // 1. Identification
        if (data.identification_validee) {
          elements.push(
            <h3 key={`h-id`} className="text-sm font-bold text-slate-900 mt-5 mb-2 font-display uppercase tracking-wider border-b border-slate-100 pb-1 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full inline-block bg-sky-500"></span>
               1. Identification
            </h3>
          );
          elements.push(
            <p key={`p-id`} className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans my-1.5">
               {data.identification_validee}
            </p>
          );
        }

        // 2. Triage
        if (data.questions_triage && Array.isArray(data.questions_triage)) {
          elements.push(
            <h3 key={`h-tri`} className="text-sm font-bold text-slate-900 mt-5 mb-2 font-display uppercase tracking-wider border-b border-slate-100 pb-1 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full inline-block bg-sky-500"></span>
               2. Triage
            </h3>
          );
          data.questions_triage.forEach((q: string, i: number) => {
            elements.push(
               <p key={`p-tri-${i}`} className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans my-1.5">
                 {q}
               </p>
            );
          });
        }

        // 3. Causes Probables
        if (data.causes_probables && Array.isArray(data.causes_probables)) {
          elements.push(
            <h3 key={`h-caus`} className="text-sm font-bold text-slate-900 mt-5 mb-2 font-display uppercase tracking-wider border-b border-slate-100 pb-1 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full inline-block bg-sky-500"></span>
               3. Diagnostic
            </h3>
          );
          data.causes_probables.forEach((c: any, i: number) => {
            elements.push(
               <ul key={`p-caus-${i}`} className="list-disc list-inside ml-3 my-1 text-slate-700 leading-relaxed font-sans text-xs sm:text-sm">
                 <span className="inline-block pl-1"><strong>{c.probabilite_pourcentage}%</strong> - {c.cause}</span>
               </ul>
            );
          });
        }

        // 4. Plan Action & Pièces (with Paywall)
        if (!hasPaidPremium) {
           // Show paywall UI
           const lockedTeaser = (
             <div className="relative mt-6 select-none" key="paywall-overlay">
               {/* Mock blurred steps underneath */}
               <div className="blur-xs opacity-40 select-none pointer-events-none space-y-3 pb-8">
                 <h3 className="text-sm font-bold text-slate-400 font-display uppercase tracking-wider border-b border-slate-100 pb-1 flex items-center gap-2">
                   <span className="w-2 h-2 bg-amber-300 rounded-full inline-block"></span>
                   4. Plan d'Action & Pièces à remplacer de rechange compatibles (Clé VIN API)
                 </h3>
                 <p className="text-xs sm:text-sm text-slate-500 font-sans">
                   Étape 1 : Mettre le véhicule en sécurité sur chandelles mécaniques rigides...
                 </p>
                 <p className="text-xs sm:text-sm text-slate-500 font-sans">
                   Étape 2 : Mesurer à l'aide d'un multimètre d'atelier la broche sous-jacente...
                 </p>
                 <p className="text-xs sm:text-sm text-slate-500 font-sans">
                   **Pièces du catalogue constructeur OEM identifiées :**
                 </p>
                 <ul className="list-disc list-inside ml-3 text-slate-400 font-sans text-xs">
                   <li>Kit complet de bobines d'impulsion Bosch - réf OEM: 121304 (39,90 €)</li>
                   <li>Bougies d'allumage haute performance iridium de rechange (24,90 €)</li>
                 </ul>
               </div>
     
               {/* Premium Gold Card with high-end border and shadows */}
               <div className="absolute inset-x-0 -top-8 bottom-0 flex items-center justify-center bg-gradient-to-t from-white via-white/80 to-transparent pt-12">
                 <div className="bg-white border-2 border-[#D4AF37] rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 max-w-sm sm:max-w-md w-full text-center relative overflow-hidden flex flex-col items-center">
                   <div className="absolute top-0 left-0 w-full h-1.5 bg-[#D4AF37]"></div>
                   <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-[#8C6B13] border border-[#D4AF37]/35 text-[10px] font-bold uppercase tracking-wider mb-4 animate-pulse select-none" id="garantie-badge">
                     <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                     <span>Garantie 14 jours satisfait ou remboursé</span>
                   </div>
                   <h4 className="font-display font-black text-slate-900 text-sm sm:text-base uppercase tracking-tight mb-2 flex items-center gap-2">
                     🔑 SOLUTION DE RÉPARATION PROUD-LOCKED
                   </h4>
                   <p className="text-xs text-slate-600 font-sans leading-relaxed mb-4">
                     La liste exacte des pièces de rechange d'origine compatibles (avec références OEM d'après votre immatriculation), les couples de serrage (Nm) et le plan technique d'intervention sont réservés aux membres premium.
                   </p>
                   <div className="my-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 w-full flex flex-col items-center justify-center" id="price-anchoring-box">
                     <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C6B13] font-mono leading-none mb-1">ACCÈS PREMIUM ILLIMITÉ</span>
                     <div className="text-3xl font-extrabold text-[#111827] font-display flex items-baseline justify-center gap-1">
                       49 € <span className="text-sm font-semibold text-slate-400 font-sans">/ an</span>
                     </div>
                     <div className="text-[11px] font-semibold text-[#D4AF37] font-sans mt-0.5">
                       (soit seulement 4,08 € / mois !)
                     </div>
                   </div>
                   <button
                     type="button"
                     disabled={isCheckoutLoading}
                     onClick={() => handleStripeCheckout()}
                     className="w-full bg-[#1e293b] hover:bg-[#D4AF37] hover:text-[#111827] text-white py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-md flex items-center justify-center gap-2 border border-[#D4AF37] disabled:opacity-50"
                   >
                     <span>{isCheckoutLoading ? "Initialisation du paiement..." : "Débloquer l'accès avec Stripe (49€/an)"}</span>
                   </button>
                 </div>
               </div>
             </div>
           );
           elements.push(lockedTeaser);
        } else {
          if (data.plan_action) {
            elements.push(
              <h3 key={`h-plan`} className="text-sm font-bold text-slate-900 mt-5 mb-2 font-display uppercase tracking-wider border-b border-slate-100 pb-1 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full inline-block bg-[#D4AF37]"></span>
                 4. Plan d'Action & Pièces
              </h3>
            );
            if (data.plan_action.verifications) {
              data.plan_action.verifications.forEach((v: string, i: number) => {
                elements.push(
                  <ul key={`p-plan-v-${i}`} className="list-disc list-inside ml-3 my-1 text-slate-700 leading-relaxed font-sans text-xs sm:text-sm">
                    <span className="inline-block pl-1">{v}</span>
                  </ul>
                );
              });
            }
            if (data.plan_action.outils_requis) {
              elements.push(
                <p key={`p-plan-outils`} className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans my-1.5 mt-2">
                  <strong>Outils requis :</strong> {data.plan_action.outils_requis.join(", ")}
                </p>
              );
            }
            if (data.plan_action.pieces_a_changer) {
              elements.push(
                <p key={`p-plan-pieces`} className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans my-1.5 mt-2">
                  <strong>Pièces à vérifier/changer :</strong> {data.plan_action.pieces_a_changer.join(", ")}
                </p>
              );
            }
          }
        }
        
        // 5. Alerte Securité
        if (data.alerte_securite_critique) {
          elements.push(
            <div key={`alert-sec`} className="my-4 p-4.5 bg-rose-50 border-l-4 border-rose-600 rounded-r-xl text-rose-950 shadow-sm">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-5.5 h-5.5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-rose-900 font-display text-sm tracking-wide">AVERTISSEMENT SÉCURITÉ CRITIQUE</h4>
                  <p className="text-xs sm:text-sm mt-1 leading-relaxed whitespace-pre-line font-sans">
                    {data.message_securite}
                  </p>
                </div>
              </div>
            </div>
          );
        } else if (data.message_securite) {
          elements.push(
            <p key={`msg-sec`} className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans my-1.5 mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
               <strong className="text-emerald-800">Conseil Préventif :</strong> {data.message_securite}
            </p>
          );
        }

        return elements;
      }
    } catch (e) {
      // Not JSON or missing required fields, fallback to original markdown logic
    }

    const lines = text.split("\n");
    let paywallStartIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (
        line.includes("4. Plan d'Action") || 
        line.startsWith("#### 4.") || 
        line.startsWith("### 4.") ||
        line.includes("🛠️ QUE FAIRE")
      ) {
        paywallStartIndex = i;
        break;
      }
    }

    if (paywallStartIndex !== -1 && !hasPaidPremium) {
      // Slice lines so we only show the unlocked initial steps
      const unlockedLines = lines.slice(0, paywallStartIndex);
      const renderedUnlocked = unlockedLines.map((line, idx) => renderMarkdownLine(line, idx));

      // Append locked placeholder teaser with Golden Paywall Card on top
      const lockedTeaser = (
        <div className="relative mt-6 select-none" key="paywall-overlay">
          {/* Mock blurred steps underneath */}
          <div className="blur-xs opacity-40 select-none pointer-events-none space-y-3 pb-8">
            <h3 className="text-sm font-bold text-slate-400 font-display uppercase tracking-wider border-b border-slate-100 pb-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-300 rounded-full inline-block"></span>
              4. Plan d'Action & Pièces à remplacer de rechange compatibles (Clé VIN API)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-sans">
              Étape 1 : Mettre le véhicule en sécurité sur chandelles mécaniques rigides...
            </p>
            <p className="text-xs sm:text-sm text-slate-500 font-sans">
              Étape 2 : Mesurer à l'aide d'un multimètre d'atelier la broche sous-jacente...
            </p>
            <p className="text-xs sm:text-sm text-slate-500 font-sans">
              **Pièces du catalogue constructeur OEM identifiées :**
            </p>
            <ul className="list-disc list-inside ml-3 text-slate-400 font-sans text-xs">
              <li>Kit complet de bobines d'impulsion Bosch - réf OEM: 121304 (39,90 €)</li>
              <li>Bougies d'allumage haute performance iridium de rechange (24,90 €)</li>
            </ul>
          </div>

          {/* Premium Gold Card with high-end border and shadows */}
          <div className="absolute inset-x-0 -top-8 bottom-0 flex items-center justify-center bg-gradient-to-t from-white via-white/80 to-transparent pt-12">
            <div className="bg-white border-2 border-[#D4AF37] rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 max-w-sm sm:max-w-md w-full text-center relative overflow-hidden flex flex-col items-center">
              {/* Premium Top Line Accent */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#D4AF37]"></div>
              
              {/* Badge Centered "Garantie 14 jours" */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-[#8C6B13] border border-[#D4AF37]/35 text-[10px] font-bold uppercase tracking-wider mb-4 animate-pulse select-none" id="garantie-badge">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Garantie 14 jours satisfait ou remboursé</span>
              </div>

              {/* Title locked */}
              <h4 className="font-display font-black text-slate-900 text-sm sm:text-base uppercase tracking-tight mb-2 flex items-center gap-2">
                🔑 SOLUTION DE RÉPARATION PROUD-LOCKED
              </h4>
              
              <p className="text-xs text-slate-600 font-sans leading-relaxed mb-4">
                La liste exacte des pièces de rechange d'origine compatibles (avec références OEM d'après votre immatriculation), les couples de serrage (Nm) et le plan technique d'intervention sont réservés aux membres premium.
              </p>

              {/* Special price anchoring badge requested */}
              <div className="my-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 w-full flex flex-col items-center justify-center" id="price-anchoring-box">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C6B13] font-mono leading-none mb-1">ACCÈS PREMIUM ILLIMITÉ</span>
                <div className="text-3xl font-extrabold text-[#111827] font-display flex items-baseline justify-center gap-1">
                  49 € <span className="text-sm font-semibold text-slate-400 font-sans">/ an</span>
                </div>
                <div className="text-[11px] font-semibold text-[#D4AF37] font-sans mt-0.5">
                  (soit seulement 4,08 € / mois !)
                </div>
              </div>

              {/* Premium Features Checklist */}
              <ul className="text-left text-slate-700 text-[11px] space-y-2.5 my-3.5 w-full font-sans border-t border-slate-100 pt-4">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span><strong>Plan pas-à-pas de réparation</strong> pour cette panne</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span>Références constructeurs exactes & alternatives après-vente</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span>Suivi et diagnostics illimités d'un an pour toute la famille</span>
                </li>
              </ul>

              {/* Action Button: triggers Stripe payment flow */}
              <button
                type="button"
                disabled={isCheckoutLoading}
                onClick={() => handleStripeCheckout()}
                className="w-full bg-[#1e293b] hover:bg-[#D4AF37] hover:text-[#111827] text-white py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-md flex items-center justify-center gap-2 border border-[#D4AF37] disabled:opacity-50"
              >
                <span>{isCheckoutLoading ? "Initialisation du paiement..." : "Débloquer l'accès avec Stripe (49€/an)"}</span>
              </button>
            </div>
          </div>
        </div>
      );

      return [...renderedUnlocked, lockedTeaser];
    }

    return lines.map((line, idx) => renderMarkdownLine(line, idx));
  };

  return (
    <div className="min-h-screen bg-neutral-light text-rich-black font-sans antialiased flex flex-col">
      {/* Sticky Premium Header matching template specs */}
      <header className="sticky top-0 z-50 bg-neutral-light/95 backdrop-blur border-b border-gray-200" id="header-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo brand and name on the left */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("home")} id="logo-trigger">
            <GenieMecaLogo className="w-16 h-16" />
            <div>
              <span className="text-xl font-bold tracking-tight block text-rich-black font-display uppercase">GÉNIE MÉCA</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex space-x-8 font-semibold text-sm">
            <a href="#pourquoi" onClick={() => setActiveTab("home")} className="text-rich-black/80 hover:text-primary-gold transition font-sans">Pourquoi nous ?</a>
            <a href="#fonctionnement" onClick={() => setActiveTab("home")} className="text-rich-black/80 hover:text-primary-gold transition font-sans">Comment ça marche ?</a>
            <a href="#cas-concrets" onClick={() => setActiveTab("home")} className="text-rich-black/80 hover:text-primary-gold transition font-sans">Cas Concrets</a>
            <a href="#tarifs" onClick={() => setActiveTab("home")} className="text-rich-black/80 hover:text-primary-gold transition font-sans">Forfaits</a>
          </nav>

          {/* Action buttons on the right */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => {
                setSimulatedPlan("Premium Intégral");
                setActiveTab("agent-console");
              }}
              className="text-sm font-semibold hover:text-primary-gold text-rich-black transition hidden sm:inline-block cursor-pointer font-sans"
            >
              Se connecter
            </button>
            <button 
              onClick={() => {
                setSimulatedPlan("Découverte (0 €)");
                setActiveTab("agent-console");
              }}
              className="bg-rich-black text-neutral-light hover:bg-rich-black/90 px-5 py-2.5 rounded-xl font-semibold text-sm transition border border-primary-gold/30 cursor-pointer font-sans"
            >
              Essai Gratuit
            </button>
          </div>
        </div>
      </header>

      {/* Main Page Layout Wrapper */}
      <main className="flex-grow">
        {activeTab === "home" ? (
          <div>
            
            {/* HERO SECTION - Deep Rich Black & Gold theme */}
            <section className="bg-rich-black text-neutral-light py-20 lg:py-32 overflow-hidden bg-grid-pattern relative border-b border-white/5" id="hero-block">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                
                {/* Left content block */}
                <div className="space-y-8 max-w-2xl text-left">
                  <div className="inline-flex items-center space-x-2 bg-neutral-light/10 border border-neutral-light/20 px-3 py-1 rounded-full text-xs font-semibold text-accent-yellow font-sans">
                    <span className="w-2 h-2 bg-accent-yellow rounded-full animate-pulse"></span>
                    <span>Plateforme de Diagnostic Automobile en Ligne</span>
                  </div>
                  
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-none text-white font-display">
                    Votre mécanicien IA personnel, <span className="text-primary-gold">précis et instantané</span>.
                  </h1>
                  
                  <p className="text-base sm:text-lg text-gray-400 leading-relaxed font-sans">
                    Obtenez un diagnostic technique fiable à 98% pour votre voiture, moto ou scooter en quelques secondes. Propulsé par l'IA spécialisée multi-agents et les bases de données constructeurs.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button 
                      onClick={() => setActiveTab("agent-console")}
                      className="bg-primary-gold text-rich-black hover:bg-primary-gold/90 px-8 py-4 rounded-xl font-bold text-center transition shadow-lg shadow-primary-gold/10 hover:scale-[1.02] cursor-pointer text-sm font-sans"
                    >
                      LANCER LE DIAGNOSTIC
                    </button>
                    <a 
                      href="#tarifs"
                      className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold text-center transition text-sm font-sans flex items-center justify-center"
                    >
                      Voir la grille tarifaire
                    </a>
                  </div>
                </div>

                {/* Right side multi-agents panel screenshot visual */}
                <div className="relative lg:ml-8 hidden lg:block text-left" id="isometric-visual">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-gold/10 to-accent-yellow/10 rounded-full filter blur-3xl"></div>
                  <div className="relative border border-white/10 bg-[#1e1e1e] backdrop-blur rounded-3xl p-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <span className="font-semibold text-sm text-primary-gold tracking-wider font-sans">ORCHESTRATEUR MULTI-AGENTS</span>
                      <span className="text-xs text-slate-500 font-mono">v1.0 (Web)</span>
                    </div>
                    <div className="space-y-4">
                      
                      {/* Voiture agent card */}
                      <div 
                        onClick={() => {
                          setCategory("voiture");
                          setActiveTab("agent-console");
                        }}
                        className="p-4 bg-white/5 rounded-xl flex items-center justify-between border border-primary-gold/20 hover:scale-[1.02] hover:bg-white/10 transition cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3">
                          <Car className="text-primary-gold w-5 h-5 group-hover:scale-110 transition" />
                          <span className="text-sm font-medium text-white font-sans">Agent Automobile</span>
                        </div>
                        <span className="text-xs bg-emerald-550/20 text-emerald-400 px-2.5 py-0.5 rounded-full font-bold font-sans">Actif</span>
                      </div>

                      {/* Moto agent card */}
                      <div 
                        onClick={() => {
                          setCategory("moto");
                          setActiveTab("agent-console");
                        }}
                        className="p-4 bg-white/5 rounded-xl flex items-center justify-between border border-white/5 hover:scale-[1.02] hover:bg-white/10 transition cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3">
                          <Bike className="text-primary-gold w-5 h-5 group-hover:scale-110 transition" />
                          <span className="text-sm font-medium text-white font-sans">Agent Moto</span>
                        </div>
                        <span className="text-xs bg-emerald-550/20 text-emerald-400 px-2.5 py-0.5 rounded-full font-bold font-sans">Actif</span>
                      </div>

                      {/* Scooter agent card */}
                      <div 
                        onClick={() => {
                          setCategory("scooter");
                          setActiveTab("agent-console");
                        }}
                        className="p-4 bg-white/5 rounded-xl flex items-center justify-between border border-white/5 hover:scale-[1.02] hover:bg-white/10 transition cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3">
                          <Motorbike className="text-primary-gold w-5 h-5 group-hover:scale-110 transition" />
                          <span className="text-sm font-medium text-white font-sans">Agent Scooter</span>
                        </div>
                        <span className="text-xs bg-emerald-550/20 text-emerald-400 px-2.5 py-0.5 rounded-full font-bold font-sans">Actif</span>
                      </div>

                      {/* Utilitaire agent card */}
                      <div 
                        onClick={() => {
                          setCategory("utilitaire");
                          setActiveTab("agent-console");
                        }}
                        className="p-4 bg-white/5 rounded-xl flex items-center justify-between border border-white/5 hover:scale-[1.02] hover:bg-white/10 transition cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3">
                          <Truck className="text-primary-gold w-5 h-5 group-hover:scale-110 transition" />
                          <span className="text-sm font-medium text-white font-sans">Agent Utilitaire, Van & Fourgons</span>
                        </div>
                        <span className="text-xs bg-emerald-550/20 text-emerald-400 px-2.5 py-0.5 rounded-full font-bold font-sans">Actif</span>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* Pourquoi nous section */}
            <section id="pourquoi" className="py-20 bg-white border-b border-gray-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                  <h2 className="text-3xl font-bold sm:text-4xl text-rich-black font-display">Pourquoi utiliser Génie Méca ?</h2>
                  <p className="text-gray-500 font-sans">L'expertise d'un conseiller technique directement dans votre poche.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Fiabilité card */}
                  <div className="p-8 bg-neutral-light rounded-2xl border border-gray-100 flex flex-col justify-between hover:scale-[1.02] transition duration-300">
                    <div className="space-y-4">
                      <div className="w-12 h-12 bg-primary-gold/10 rounded-xl flex items-center justify-center text-primary-gold text-xl">
                        <Sliders className="w-6 h-6 text-primary-gold" />
                      </div>
                      <h3 className="text-xl font-bold text-rich-black font-display">Fiabilité de 98%</h3>
                      <p className="text-gray-500 text-sm leading-relaxed font-sans">
                        Chaque sous-agent détient des données ciblées, évitant les approximations et les diagnostics erronés des IA généralistes.
                      </p>
                    </div>
                  </div>

                  {/* Economie card */}
                  <div className="p-8 bg-neutral-light rounded-2xl border border-gray-100 flex flex-col justify-between hover:scale-[1.02] transition duration-300">
                    <div className="space-y-4">
                      <div className="w-12 h-12 bg-primary-gold/10 rounded-xl flex items-center justify-center text-primary-gold text-xl">
                        <DollarSign className="w-6 h-6 text-primary-gold" />
                      </div>
                      <h3 className="text-xl font-bold text-rich-black font-display">Économie Immédiate</h3>
                      <p className="text-gray-500 text-sm leading-relaxed font-sans">
                        Comprenez la panne réelle avant d'aller au garage. Évitez les sur-facturations et ciblez précisément les réparations nécessaires.
                      </p>
                    </div>
                  </div>

                  {/* Sécurité card */}
                  <div className="p-8 bg-neutral-light rounded-2xl border border-gray-100 flex flex-col justify-between hover:scale-[1.02] transition duration-300">
                    <div className="space-y-4">
                      <div className="w-12 h-12 bg-primary-gold/10 rounded-xl flex items-center justify-center text-primary-gold text-xl">
                        <ShieldAlert className="w-6 h-6 text-primary-gold" />
                      </div>
                      <h3 className="text-xl font-bold text-rich-black font-display">Sécurité Intégrée</h3>
                      <p className="text-gray-500 text-sm leading-relaxed font-sans">
                        Le système intègre un protocole de sécurité strict : en cas de défaillance d'un organe critique, une Alerte Rouge vous l'indique immédiatement.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Comment ça marche section */}
            <section id="fonctionnement" className="py-20 bg-rich-black text-neutral-light">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                  <h2 className="text-3xl font-bold sm:text-4xl text-white font-display">Comment ça marche ?</h2>
                  <p className="text-gray-400 font-sans">Trois étapes simples pour obtenir votre bilan technique complet.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                  {/* Step 1 */}
                  <div className="space-y-4 text-center md:text-left">
                    <div className="w-14 h-14 bg-primary-gold text-rich-black font-bold text-xl rounded-full flex items-center justify-center mx-auto md:mx-0 shadow-lg shadow-primary-gold/20">
                      <MessageSquare className="w-6 h-6 text-rich-black" />
                    </div>
                    <h3 className="text-xl font-bold text-white font-display">1. Saisie des symptômes</h3>
                    <p className="text-gray-400 text-sm leading-relaxed font-sans">
                      Décrivez le problème (bruits, comportement, odeurs) ou entrez directement un code d'erreur OBD standard (ex: P0300).
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="space-y-4 text-center md:text-left">
                    <div className="w-14 h-14 bg-accent-yellow text-rich-black font-bold text-xl rounded-full flex items-center justify-center mx-auto md:mx-0 shadow-lg shadow-accent-yellow/20">
                      <Cpu className="w-6 h-6 text-rich-black" />
                    </div>
                    <h3 className="text-xl font-bold text-white font-display">2. Analyse Multi-Agents</h3>
                    <p className="text-gray-400 text-sm leading-relaxed font-sans">
                      L'orchestrateur route la demande vers l'agent expert de votre catégorie pour croiser les données constructeurs historiques.
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="space-y-4 text-center md:text-left">
                    <div className="w-14 h-14 bg-primary-gold text-rich-black font-bold text-xl rounded-full flex items-center justify-center mx-auto md:mx-0 shadow-lg shadow-primary-gold/20">
                      <FileText className="w-6 h-6 text-rich-black" />
                    </div>
                    <h3 className="text-xl font-bold text-white font-display">3. Rapport de Diagnostic</h3>
                    <p className="text-gray-400 text-sm leading-relaxed font-sans">
                      Recevez la liste des causes par ordre de probabilité, le plan d'action de vérification, les outils requis et l'estimation du budget.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Cas Concrets Pricing Convincer Section */}
            <section id="cas-concrets" className="py-20 bg-slate-50 border-t border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D4AF37]/10 text-[#8C6B13] border border-[#D4AF37]/35 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    ROI Immédiat
                  </div>
                  <h2 className="text-3xl font-bold sm:text-4xl text-slate-900 font-display">Un diagnostic expert rentabilisé dès le 1er jour</h2>
                  <p className="text-slate-600 font-sans text-lg">Découvrez comment nos utilisateurs résolvent leurs pannes avec succès, quel que soit leur niveau de compétence en mécanique.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Niveau Débutant */}
                  <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-5 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition duration-500">
                      <Wrench className="w-24 h-24 text-blue-900" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-700 rounded-full text-xs font-bold font-sans uppercase mb-6 border border-sky-100">
                        <span className="w-2 h-2 bg-sky-500 rounded-full"></span>
                        Niveau Débutant
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 font-display mb-3">Pédale d'accélérateur sans réponse</h3>
                      <p className="text-slate-600 text-sm leading-relaxed font-sans mb-6">
                        "La voiture ne voulait plus avancer, je pensais devoir payer un remorquage hors de prix. Génie Méca m'a guidé pour identifier un simple capteur récalcitrant. Un coup de WD40 sur le potentiomètre, et c'était réglé en 5 minutes. J'ai économisé le prix de l'abonnement dès mon premier souci !"
                      </p>
                    </div>
                    <div className="pt-5 border-t border-slate-100 flex items-center justify-between mt-auto">
                      <span className="text-xs font-semibold text-slate-500">Frais de dépanneuse : 0€</span>
                      <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Économie ~150€
                      </span>
                    </div>
                  </div>

                  {/* Niveau Intermédiaire */}
                  <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-5 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition duration-500">
                      <Hammer className="w-24 h-24 text-amber-900" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold font-sans uppercase mb-6 border border-amber-100">
                        <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                        Niveau Intermédiaire
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 font-display mb-3">Remplacement de la vanne EGR</h3>
                      <p className="text-slate-600 text-sm leading-relaxed font-sans mb-6">
                        "J'avais une perte de puissance sur mon utilitaire avec voyant moteur. Le diagnostic premium m'a indiqué une vanne EGR encrassée et donné la référence exacte. Avec mon simple coffret à cliquet du quotidien, l'IA m'a guidé étape par étape pour la démonter moi-même."
                      </p>
                    </div>
                    <div className="pt-5 border-t border-slate-100 flex items-center justify-between mt-auto">
                      <span className="text-xs font-semibold text-slate-500">Coût d'intervention : 15€</span>
                      <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Économie ~350€
                      </span>
                    </div>
                  </div>

                  {/* Niveau Expert */}
                  <div className="bg-white rounded-2xl p-8 border border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.15)] relative overflow-hidden flex flex-col justify-between group hover:-translate-y-1 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-5 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition duration-500">
                      <ClipboardCheck className="w-24 h-24 text-[#D4AF37]" />
                    </div>
                    <div className="absolute top-0 w-full h-1.5 bg-[#D4AF37] left-0 drop-shadow-md"></div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-bold font-sans uppercase mb-6 border border-rose-100">
                        <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                        Niveau Expert / Pro
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 font-display mb-3">Diagnostic prêt pour le garage</h3>
                      <p className="text-slate-600 text-sm leading-relaxed font-sans mb-6">
                        "J'avais une panne électronique complexe (faisceau multiplexé). L'application m'a fourni le devis prévisionnel barémé avec les références OEM constructeur validées. Arrivé au garage : plus d'escroquerie possible, j'avais le diagnostic parfait clé en main devant le mécanicien."
                      </p>
                    </div>
                    <div className="pt-5 border-t border-slate-100 flex items-center justify-between mt-auto">
                      <span className="text-xs font-semibold text-slate-500">Devis juste validé</span>
                      <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Sûreté garantie
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-16 text-center">
                   <button 
                     onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setTimeout(() => setActiveTab("console"), 300);
                     }}
                     className="bg-primary-gold hover:bg-accent-yellow text-rich-black font-bold py-4 px-10 rounded-xl shadow-lg transition duration-300 mx-auto font-sans uppercase tracking-widest text-sm flex items-center justify-center gap-3 border border-[#D4AF37]"
                   >
                     <Cpu className="w-5 h-5" />
                     Essayez Gratuitement Maintenant
                   </button>
                </div>
              </div>
            </section>

            {/* Tarifs Section */}
            <section id="tarifs" className="py-20 bg-neutral-light border-t border-gray-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
                  <h2 className="text-3xl font-bold sm:text-4xl text-rich-black font-display">Choisissez votre formule</h2>
                  <p className="text-gray-500 font-sans max-w-xl mx-auto">
                    Rentabilisez instantanément votre investissement en évitant les diagnostics erronés ou les sur-facturations de garage.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                  {/* Carte 1 : Formule Solo */}
                  <div className="bg-white border border-gray-200 rounded-3xl p-8 relative shadow-lg hover:shadow-xl hover:scale-[1.01] transition duration-300 flex flex-col justify-between space-y-6 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-350"></div>
                    <div className="space-y-6 text-left">
                      <div>
                        <h3 className="font-bold text-[#8C6B13] uppercase tracking-wider text-xs font-display">Individuel</h3>
                        <h2 className="text-2xl font-black text-slate-900 font-display">FORMULE SOLO</h2>
                      </div>

                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-center bg-slate-50/70">
                        <div className="text-4xl font-extrabold text-[#111827] font-display flex items-baseline justify-center gap-1.5">
                          49 € <span className="text-sm font-semibold text-slate-400 font-sans">/ an</span>
                        </div>
                        <div className="text-[11px] font-medium text-[#8C6B13] font-sans mt-1">
                          soit seulement 4,08 € / mois
                        </div>
                      </div>

                      <ul className="text-xs sm:text-sm space-y-3.5 pt-2 font-sans font-medium text-slate-700">
                        <li className="flex items-start">
                          <Check className="text-[#D4AF37] w-5 h-5 mr-3 shrink-0 mt-0.5" />
                          <span><strong>1 véhicule</strong> enregistré</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="text-[#D4AF37] w-5 h-5 mr-3 shrink-0 mt-0.5" />
                          <span><strong>Diagnostics illimités</strong></span>
                        </li>
                        <li className="flex items-start">
                          <Check className="text-[#D4AF37] w-5 h-5 mr-3 shrink-0 mt-0.5" />
                          <span>Moteurs IA Auto / Moto / Scooter</span>
                        </li>
                      </ul>
                    </div>

                    <button 
                      disabled={isCheckoutLoading}
                      onClick={() => handleStripeCheckout(undefined, 49, "Formule Solo")}
                      className="block w-full text-center bg-[#111827] hover:bg-slate-800 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-sm cursor-pointer font-sans disabled:opacity-50"
                    >
                      {isCheckoutLoading ? "Redirection Stripe..." : "S'abonner & Diagnostiquer"}
                    </button>
                  </div>

                  {/* Carte 2 : Formule Foyer (Mise en avant centrale) */}
                  <div className="bg-white border-2 border-[#D4AF37] rounded-3xl p-8 relative shadow-2xl hover:scale-[1.02] transition duration-300 flex flex-col justify-between space-y-6 overflow-hidden md:-translate-y-2">
                    {/* Golden top highlight with spark gradient */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-[#D4AF37]"></div>
                    <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl"></div>

                    {/* Popular Badge */}
                    <div className="absolute top-4 right-4" id="pricing-recommend-badge">
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-[#8C6B13] border border-[#D4AF37]/35 text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-sans shadow-2xs">
                        <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                        Popular
                      </span>
                    </div>

                    <div className="space-y-6 text-left">
                      <div>
                        <h3 className="font-bold text-[#8C6B13] uppercase tracking-wider text-xs font-display flex items-center gap-1.5">
                          ✨ RECOMMANDÉ
                        </h3>
                        <h2 className="text-2xl font-black text-slate-900 font-display">FORMULE FOYER</h2>
                      </div>

                      <div className="bg-[#111827] text-white border border-gray-850 rounded-2xl p-5 text-center shadow-md">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] font-mono leading-none block mb-1">Mise en avant</span>
                        <div className="text-4xl font-extrabold text-white font-display flex items-baseline justify-center gap-1.5">
                          79 € <span className="text-sm font-semibold text-slate-400 font-sans">/ an</span>
                        </div>
                        <div className="text-[11px] font-medium text-slate-300 font-sans mt-0.5">
                          soit seulement 6,58 € / mois
                        </div>
                      </div>

                      <ul className="text-xs sm:text-sm space-y-3.5 pt-2 font-sans font-medium text-slate-700">
                        <li className="flex items-start">
                          <Check className="text-[#D4AF37] w-5 h-5 mr-3 shrink-0 mt-0.5" />
                          <span><strong>Jusqu'à 3 véhicules</strong> (idéal couple + deux-roues)</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="text-[#D4AF37] w-5 h-5 mr-3 shrink-0 mt-0.5" />
                          <span><strong>Diagnostics illimités</strong></span>
                        </li>
                        <li className="flex items-start">
                          <Check className="text-[#D4AF37] w-5 h-5 mr-3 shrink-0 mt-0.5" />
                          <span><strong>Suivi séparé par véhicule</strong></span>
                        </li>
                        <li className="flex items-start">
                          <Check className="text-[#D4AF37] w-5 h-5 mr-3 shrink-0 mt-0.5" />
                          <span>IA Auto / Moto / Scooter & Utilitaire</span>
                        </li>
                      </ul>
                    </div>

                    <button 
                      disabled={isCheckoutLoading}
                      onClick={() => handleStripeCheckout(undefined, 79, "Formule Foyer")}
                      className="block w-full text-center bg-[#D4AF37] hover:bg-[#bfa02e] text-[#111827] py-4 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all duration-300 shadow-md cursor-pointer font-sans border border-[#D4AF37] disabled:opacity-50"
                    >
                      {isCheckoutLoading ? "Redirection Stripe..." : "S'abonner & Diagnostiquer"}
                    </button>
                  </div>

                  {/* Carte 3 : Formule Pro */}
                  <div className="bg-white border border-gray-200 rounded-3xl p-8 relative shadow-lg hover:shadow-xl hover:scale-[1.01] transition duration-300 flex flex-col justify-between space-y-6 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-500"></div>
                    <div className="space-y-6 text-left">
                      <div>
                        <h3 className="font-bold text-indigo-600 uppercase tracking-wider text-xs font-display">Atelier / Flotte</h3>
                        <h2 className="text-2xl font-black text-slate-900 font-display">FORMULE PRO</h2>
                      </div>

                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-center flex flex-col justify-center items-center h-[76px] bg-slate-50/70">
                        <div className="text-3xl font-black text-slate-900 font-display">
                          Sur devis
                        </div>
                        <div className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 font-mono mt-0.5">
                          Tarification sur-mesure
                        </div>
                      </div>

                      <ul className="text-xs sm:text-sm space-y-3.5 pt-2 font-sans font-medium text-slate-700">
                        <li className="flex items-start">
                          <Check className="text-indigo-500 w-5 h-5 mr-3 shrink-0 mt-0.5" />
                          <span><strong>Véhicules illimités</strong></span>
                        </li>
                        <li className="flex items-start">
                          <Check className="text-indigo-500 w-5 h-5 mr-3 shrink-0 mt-0.5" />
                          <span>Accès API instantané</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="text-indigo-500 w-5 h-5 mr-3 shrink-0 mt-0.5" />
                          <span><strong>Export de rapports PDF</strong></span>
                        </li>
                      </ul>
                    </div>

                    <button 
                      onClick={() => {
                        setToastMessage("Formulaire de contact Pro : Contactez notre équipe à pro@geniemeca.fr pour recevoir une offre adaptée.");
                        setToastType("info");
                      }}
                      className="block w-full text-center bg-[#111827] hover:bg-slate-800 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-sm cursor-pointer font-sans"
                    >
                      Nous contacter
                    </button>
                  </div>
                </div>
              </div>
            </section>

          </div>
        ) : (
          
          /* DIAGNOSTIC CONSOLE COMPONENT SCREEN */
          <div className="bg-slate-50 min-h-[calc(100vh-5rem)] pb-12" id="console-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
              
              {/* Back Link and Active Configuration overview */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6" id="console-header-details">
                <button 
                  onClick={() => setActiveTab("home")} 
                  className="inline-flex items-center text-xs font-bold text-slate-600 hover:text-[#0052FF] gap-1 cursor-pointer bg-white px-3.5 py-1.5 rounded-lg border border-slate-200 font-sans"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>← Retour à la Landing Page</span>
                </button>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 text-xs bg-blue-50 text-[#0052FF] px-3.5 py-1.5 rounded-lg border border-blue-100 font-mono">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                    <span>Forfait : <strong>{simulatedPlan}</strong></span>
                  </div>
                </div>
              </div>

              {/* Grid block layout: Left contains Form / Right contains Chat interaction system */}
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                
                {/* 1. LEFT COLUMN: DIRECT INTERACTIVE BUILDER FORM (with auto symptom sets) */}
                <div className="lg:col-span-5 bg-white border border-slate-150 rounded-2xl p-5 shadow-xs space-y-6" id="interactive-builder-box">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-base font-extrabold text-[#0F172A] font-display flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-[#0052FF]" />
                      Votre Guide Simplifié
                    </h2>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-sans">Remplissez ce petit guide sans le moindre stress. Si vous ne savez pas, laissez vide : notre IA bienveillante s'adapte à tout !</p>
                  </div>

                  {/* MODULE D’IDENTIFICATION PAR SIV / VIN */}
                  <div className="bg-slate-50 border border-slate-200/85 rounded-2xl p-4 space-y-3 font-sans transition-all relative overflow-hidden" id="siv-vin-locator">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wide flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-[#0052FF] rounded-full"></span>
                        Identification Imm. SIV / VIN d'usine
                      </h3>
                      <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-md font-mono font-medium">API Connexion</span>
                    </div>

                    {!identifiedVehicle ? (
                      <form onSubmit={handleIdentifyVehicle} className="space-y-2">
                        <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                          Saisissez votre plaque d'immatriculation française (ex: <span className="font-mono bg-slate-200 px-1 rounded text-slate-700">AB123CD</span>) ou votre numéro VIN à 17 caractères constructeur.
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={sivVinQuery}
                            onChange={(e) => setSivVinQuery(e.target.value)}
                            placeholder="Ex: AB123CD ou VIN à 17 caractères..."
                            className="bg-white text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#0052FF] focus:outline-hidden flex-1 uppercase font-mono font-bold tracking-wider placeholder:normal-case placeholder:font-sans placeholder:font-normal"
                          />
                          <button
                            type="submit"
                            disabled={isIdentifying || !sivVinQuery.trim()}
                            id="btn-siv-vin-search"
                            className="bg-[#0052FF] hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-[11px] px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                          >
                            {isIdentifying ? (
                              <>
                                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Analyse...
                              </>
                            ) : (
                              "Identifier"
                            )}
                          </button>
                        </div>
                        {isCookieBlocked ? (
                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 space-y-2 text-amber-950 animate-fadeIn" id="cookie-blocked-warning-box">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                              <div className="space-y-1">
                                <h4 className="text-[11px] font-bold">Sécurité du navigateur (Aperçu intégré)</h4>
                                <p className="text-[10px] text-amber-800 leading-normal">
                                  Votre navigateur (Safari, iOS, macOS ou Brave) bloque les cookies tiers obligatoires imposés par l'environnement bac à sable d'AI Studio. Pour débloquer l'identification automatique SIV/VIN et la console d'IA immédiatement, veuillez ouvrir l'application dans son propre onglet 100% fonctionnel en cliquant ci-dessous.
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => window.open(window.location.href, "_blank")}
                              className="w-full bg-[#0052FF] hover:bg-blue-700 text-white font-bold text-[10px] py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              Ouvrir l'application dans un nouvel onglet
                            </button>
                          </div>
                        ) : sivError ? (
                          <div className="text-[10px] bg-red-50 text-red-600 px-2.5 py-1.5 rounded-lg border border-red-100 flex items-center gap-1.5">
                            <span>⚠️ {sivError === "COOKIE_BLOCKED_ERROR" ? "Cookies de sécurité bloqués. Veuillez cliquer sur le bouton ci-dessus pour ouvrir dans un nouvel onglet." : sivError}</span>
                          </div>
                        ) : null}
                      </form>
                    ) : (
                      <div className="bg-amber-50/70 border border-[#D4AF37]/55 rounded-xl p-3.5 space-y-2.5 animate-fadeIn" id="identified-siv-card">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] bg-[#D4AF37] text-white font-extrabold px-20 py-0.5 rounded-full uppercase tracking-wider font-display block text-center mb-1">
                              Véhicule Identifié : {identifiedVehicle.immatriculation ? "Plaque SIV" : "Code VIN"}
                            </span>
                            <h4 className="text-sm font-extrabold text-slate-900 mt-1 font-display">
                              {identifiedVehicle.brand} {identifiedVehicle.model}
                            </h4>
                          </div>
                          <span className="text-xs font-mono font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-md">
                            {identifiedVehicle.year}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px] text-slate-700 font-sans border-t border-slate-200/60 pt-2.5">
                          <div>
                            <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-tight">Motorisation</span>
                            <span className="font-semibold">{identifiedVehicle.engine}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-tight">Cylindrée</span>
                            <span className="font-semibold">{identifiedVehicle.cylindree || "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-tight">Code Moteur</span>
                            <span className="font-mono font-semibold bg-slate-200/60 px-1 rounded text-slate-700 text-[9px]">
                              {identifiedVehicle.codeMoteur || "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-tight">Carburant</span>
                            <span className="font-semibold">{identifiedVehicle.fuel || "N/A"}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              // Accept and automatically preset selection fields in case the user wants to adjust them manually
                              setBrand(identifiedVehicle.brand);
                              setModel(identifiedVehicle.model);
                              setYear(identifiedVehicle.year);
                              setEngine(identifiedVehicle.engine);
                              setSivError("");
                            }}
                            className="bg-[#D4AF37] hover:bg-[#C09F2F] text-slate-950 font-extrabold text-[10px] px-3 py-1.5 rounded-lg flex-1 text-center transition-all cursor-pointer shadow-xs"
                          >
                            🔑 Confirmer cette configuration !
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => {
                              setIdentifiedVehicle(null);
                              setSivVinQuery("");
                              setSivError("");
                            }}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-[10px] px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                          >
                            Effacer
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {identifiedVehicle && (
                    <div className="p-3 bg-emerald-50 border border-emerald-150 rounded-xl text-[10px] text-emerald-800 font-sans flex items-center justify-between">
                      <span className="font-medium">
                        🛡️ <strong>Liaison API active :</strong> Les informations du moteur d'usine ({identifiedVehicle.brand} {identifiedVehicle.model}) sont injectées de façon invisible au modèle.
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setIdentifiedVehicle(null);
                          setSivVinQuery("");
                        }}
                        className="text-[9px] text-amber-700 font-extrabold hover:underline"
                      >
                        Changer
                      </button>
                    </div>
                  )}

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-slate-100"></div>
                    <span className="flex-shrink mx-4 text-[9px] text-slate-400 font-extrabold uppercase tracking-wider font-sans">OU CONFIGURATION MANUELLE</span>
                    <div className="flex-grow border-t border-slate-100"></div>
                  </div>

                  <form onSubmit={triggerGuidedDiagnostic} className="space-y-4">
                    
                    {/* Category selectors built beautifully */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-sans">1. Choisissez votre véhicule</label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {/* Auto */}
                        <button
                          type="button"
                          onClick={() => setCategory("voiture")}
                          className={`py-2.5 px-0.5 border text-[11px] font-bold rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                            category === "voiture" 
                              ? "bg-blue-50/60 border-[#0052FF]/60 text-[#0052FF] font-extrabold" 
                              : "bg-white border-slate-200/60 hover:bg-slate-50 text-slate-600"
                          }`}
                        >
                          <Car className="w-4 h-4" />
                          <span>Voiture</span>
                        </button>
                        
                        {/* Moto */}
                        <button
                          type="button"
                          onClick={() => setCategory("moto")}
                          className={`py-2.5 px-0.5 border text-[11px] font-bold rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                            category === "moto" 
                              ? "bg-blue-50/60 border-[#0052FF]/60 text-[#0052FF] font-extrabold" 
                              : "bg-white border-slate-200/60 hover:bg-slate-50 text-slate-600"
                          }`}
                        >
                          <Bike className="w-4 h-4" />
                          <span>Moto</span>
                        </button>

                        {/* Scooter */}
                        <button
                          type="button"
                          onClick={() => setCategory("scooter")}
                          className={`py-2.5 px-0.5 border text-[11px] font-bold rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                            category === "scooter" 
                              ? "bg-blue-50/60 border-[#0052FF]/60 text-[#0052FF] font-extrabold" 
                              : "bg-white border-slate-200/60 hover:bg-slate-50 text-slate-600"
                          }`}
                        >
                          <Motorbike className="w-4 h-4" />
                          <span>Scooter</span>
                        </button>

                        {/* Utilitaire */}
                        <button
                          type="button"
                          onClick={() => setCategory("utilitaire")}
                          className={`py-2.5 px-0.5 border text-[11px] font-bold rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                            category === "utilitaire" 
                              ? "bg-blue-50/60 border-[#0052FF]/60 text-[#0052FF] font-extrabold" 
                              : "bg-white border-slate-200/60 hover:bg-slate-50 text-slate-600"
                          }`}
                        >
                          <Truck className="w-4 h-4" />
                          <span>Utilitaire</span>
                        </button>
                      </div>
                    </div>

                    {/* Brand and Model selectors inside vehicle presets data */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Marque du véhicule</label>
                          <select
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            className="w-full text-xs p-2.5 bg-white border border-slate-200/65 rounded-lg focus:ring-1 focus:ring-[#0052FF] cursor-pointer"
                          >
                            {getSortedBrands(category).map((b) => (
                              <option key={b} value={b}>{b}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Modèle indicatif</label>
                          {brand === "Autre (Saisie libre)" || model === "Autre (Saisie libre)" ? (
                            <div className="space-y-1.5">
                              <input
                                type="text"
                                value={customModel}
                                onChange={(e) => setCustomModel(e.target.value)}
                                placeholder="Saisissez le modèle (Ex: T-Max, CRX...)"
                                className="w-full text-xs p-2.5 bg-white border border-slate-200/65 rounded-lg focus:ring-1 focus:ring-[#0052FF]"
                                required
                              />
                              {brand !== "Autre (Saisie libre)" && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const devModels = getSortedModels(category, brand);
                                    const defaultModel = devModels[0] || "";
                                    setModel(defaultModel);
                                    setCustomModel("");
                                  }}
                                  className="text-[10px] text-blue-600 hover:text-blue-700 underline flex items-center gap-0.5 cursor-pointer"
                                >
                                  ← Revenir à la liste
                                </button>
                              )}
                            </div>
                          ) : (
                            <select
                              value={model}
                              onChange={(e) => {
                                setModel(e.target.value);
                                if (e.target.value !== "Autre (Saisie libre)") {
                                  setCustomModel("");
                                }
                              }}
                              className="w-full text-xs p-2.5 bg-white border border-slate-200/65 rounded-lg focus:ring-1 focus:ring-[#0052FF] cursor-pointer"
                            >
                              {getSortedModels(category, brand).map((m) => (
                                <option key={m} value={m}>{m}</option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>

                      {brand === "Autre (Saisie libre)" && (
                        <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100/50 space-y-2 animate-fadeIn">
                          <p className="text-[10px] text-blue-700 font-medium">
                            🌍 <strong>Saisie libre activée :</strong> Saisissez n'importe quelle marque ou modèle du monde entier de 1886 à nos jours.
                          </p>
                          <div>
                            <label className="block text-[10px] font-bold text-blue-800 uppercase mb-1">Marque sur-mesure</label>
                            <input
                              type="text"
                              value={customBrand}
                              onChange={(e) => setCustomBrand(e.target.value)}
                              placeholder="Précisez la marque historique ou rare (Ex: Bugatti, Delage...)"
                              className="w-full text-xs p-2 bg-white border border-blue-200 rounded focus:ring-1 focus:ring-[#0052FF]"
                              required
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Year of manufacturing and engine specifications block */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Année (Facultatif)</label>
                        <input
                          type="text"
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          placeholder="Ex: 2018 ou inconnu"
                          className="w-full text-xs p-2.5 bg-white border border-slate-200/65 rounded-lg focus:ring-1 focus:ring-[#0052FF]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Carburant / Énergie</label>
                        <select
                          value={engine}
                          onChange={(e) => setEngine(e.target.value)}
                          className="w-full text-xs p-2.5 bg-white border border-slate-200/65 rounded-lg focus:ring-1 focus:ring-[#0052FF] cursor-pointer"
                        >
                          {VEHICLE_PRESETS[category].engines.map((eng) => (
                            <option key={eng} value={eng}>{eng}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Code OBD error box if user owns electronic tool scanner */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-bold text-slate-700 uppercase">Code panne OBD (Si vous en avez un)</label>
                        <span className="text-[9px] font-mono font-bold bg-blue-50 text-[#0052FF] px-1.5 py-0.5 rounded">Optionnel</span>
                      </div>
                      <input
                        type="text"
                        value={obdCode || ""}
                        onChange={(e) => setObdCode(e.target.value.toUpperCase())}
                        placeholder="Ex: P0300 (laissez vide si vous n'en avez pas)"
                        className="w-full text-xs p-2.5 bg-white border border-slate-200/65 rounded-lg focus:ring-1 focus:ring-[#0052FF] font-mono tracking-wider"
                      />
                    </div>

                    {/* Diagnostic symptom textual prompt container */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Décrivez la panne simplement</label>
                      <textarea
                        value={symptomText}
                        onChange={(e) => setSymptomText(e.target.value)}
                        placeholder="Ex: Ma voiture fait un sifflement quand j'accélère, ou le voyant moteur orange s'est allumé..."
                        rows={2}
                        className="w-full text-xs p-2.5 bg-white border border-slate-200/65 rounded-lg focus:ring-1 focus:ring-[#0052FF]"
                        required
                      />
                    </div>

                    {/* Fast Auto Symptom Injector */}
                    <div className="bg-slate-50/60 p-2.5 rounded-lg border border-slate-150">
                      <span className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-500 mb-1.5">Symptômes fréquents (cliquez pour tester) :</span>
                      <div className="flex flex-wrap gap-1.5">
                        {VEHICLE_PRESETS[category].symptoms.map((sympt, sIdx) => (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => handleQuickSymptom(sympt)}
                            className="bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/60 text-[10px] px-2.5 py-1 rounded transition-colors text-left font-medium cursor-pointer"
                          >
                            {sympt.text} {sympt.code && `(${sympt.code})`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Bouton de sélection d'expertise mécanique (Moved directly above submit button) */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Niveau d'expertise :</label>
                      <select
                        value={expertiseLevel}
                        onChange={(e) => setExpertiseLevel(e.target.value as any)}
                        id="expertise-selector"
                        required
                        className="w-full text-xs p-2.5 bg-white border border-slate-200/65 rounded-lg focus:ring-1 focus:ring-[#0052FF] font-bold text-slate-800 cursor-pointer"
                      >
                        <option value="" disabled hidden>Choisir...</option>
                        <option value="Débutant">Débutant (Sécurité ++ & Vulgarisé)</option>
                        <option value="Intermédiaire">Intermédiaire (Outils & Termes clés)</option>
                        <option value="Expert / Pro">Expert / Pro (Nm, Direct & Schémas)</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={isBotTyping}
                      className="w-full py-3.5 bg-[#0052FF] hover:bg-[#003CFF] disabled:bg-slate-350 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed font-sans"
                    >
                      {isBotTyping ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Calcul expert en cours...</span>
                        </>
                      ) : (
                        <>
                          <Cpu className="w-4 h-4" />
                          <span>Lancer le diagnostic Génie Méca</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* SAVED DIAGNOSTIC REPORTS */}
                  <div className="bg-[#f8fafc]/30 p-4 border border-slate-150 rounded-xl">
                    <span className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1">
                      <History className="w-3.5 h-3.5" />
                      Historique Récent Des Rapports
                    </span>
                    <div className="space-y-2">
                      {savedReports.map((item) => (
                        <div key={item.id} className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                          <div>
                            <span className="block font-bold text-slate-800">{item.vehicle}</span>
                            <span className="text-[10px] text-slate-500 line-clamp-1">{item.symptom}</span>
                          </div>
                          <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded text-[9px]">{item.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* 2. RIGHT COLUMN: DIRECT ACTIVE CONSOLE CHAT STREAM */}
                <div className={`${
                  isChatFullscreen 
                    ? "fixed inset-0 z-50 bg-white flex flex-col h-screen w-screen overflow-hidden" 
                    : "lg:col-span-7 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-[520px] lg:h-[650px] overflow-hidden"
                }`} id="diagnose-chat-console">
                  
                  {/* Console Header layout */}
                  <div className="bg-[#0F172A] text-white p-4 flex items-center justify-between border-b border-[#0F172A]" id="console-head">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center relative">
                        <Cpu className="w-5 h-5 text-[#0052FF] animate-pulse" />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0F172A]"></span>
                      </div>
                      <div>
                        <h3 className="font-bold text-sm tracking-wide font-display">Génie Méca Orchestrateur</h3>
                        <p className="text-[10px] text-slate-350 font-mono">SOUS-AGENTS PRÊTS À 98% DE PRÉCISION</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsChatFullscreen(!isChatFullscreen)}
                        className="flex items-center gap-1.5 text-[10px] font-mono text-slate-300 hover:text-white cursor-pointer bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded border border-white/10 transition-all select-none"
                        title={isChatFullscreen ? "Quitter le plein écran" : "Plein écran"}
                      >
                        {isChatFullscreen ? (
                          <>
                            <Minimize2 className="w-3.5 h-3.5 text-blue-400" />
                            <span>Quitter plein écran</span>
                          </>
                        ) : (
                          <>
                            <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
                            <span>Plein écran</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setChatMessages([
                          {
                            role: "model",
                            text: "Bonjour ! L'historique de la conversation a été effacé. Quel problème souhaitez-vous analyser ?"
                          }
                        ])}
                        className="text-[10px] font-mono text-slate-300 hover:text-white underline cursor-pointer bg-black/10 px-2 py-1.5 rounded transition-all"
                      >
                        Effacer l'historique
                      </button>
                    </div>
                  </div>

                  {/* Warning regarding Demonstration mode (API Key check) */}
                  {apiWarning && (
                    <div className="bg-amber-50 text-amber-900 px-4 py-2 text-xs border-b border-amber-100 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{apiWarning}</span>
                    </div>
                  )}

                  {/* Messaging logs and stream rendering */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70" id="chat-messages-container">
                    {chatMessages.map((msg, idx) => (
                      <div 
                        key={idx} 
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div 
                          className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm shadow-sm transition-all ${
                            msg.role === "user" 
                              ? "bg-slate-900 text-white rounded-tr-none" 
                              : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
                          }`}
                        >
                          <div className="prose prose-sm max-w-none text-xs sm:text-sm">
                            {msg.role === "user" ? (
                              <p className="whitespace-pre-line font-sans">{msg.text}</p>
                            ) : (
                              <div className="space-y-1">
                                {renderFormattedMarkdown(msg.text)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {isBotTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-4 max-w-[80%] flex items-center gap-3 shadow-xs">
                          <Loader2 className="w-4 h-4 animate-spin text-[#0052FF]" />
                          <span className="text-xs text-slate-500 font-mono tracking-wider animate-pulse">
                            Génie Méca rassemble les données de ses capteurs...
                          </span>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {isCookieBlocked && (
                    <div className="bg-amber-50/95 border-t border-b border-amber-200 p-2.5 px-4 text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-amber-950 animate-fadeIn" id="chat-cookie-blocked-banner">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Cookies d'authentification bloqués dans l'aperçu (Safari / iOS).</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => window.open(window.location.href, "_blank")}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] py-1 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all shrink-0 cursor-pointer"
                      >
                        <ExternalLink className="w-3" />
                        Ouvrir dans un nouvel onglet
                      </button>
                    </div>
                  )}

                  {/* Bottom input area form */}
                  <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2">
                    <input 
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Comment l'IA peut-elle vous aider davantage ? Décrivez une alerte, un bruit..."
                      disabled={isBotTyping}
                      className="flex-grow p-3 text-xs sm:text-sm bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0052FF] font-sans"
                    />
                    <button
                      type="submit"
                      disabled={isBotTyping || !chatInput.trim()}
                      className="bg-[#0052FF] hover:bg-[#003CFF] text-white p-3 rounded-xl disabled:bg-slate-200 transition-colors cursor-pointer shadow-xs"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>

                </div>

              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER: Matches exactly layout from the requested template */}
      <footer className="bg-rich-black text-gray-400 py-12 border-t border-white/5 mt-auto" id="footer-menu">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab("home")}>
            <GenieMecaLogo className="w-8 h-8" />
            <span className="text-white font-bold text-sm tracking-widest font-display">GÉNIE MÉCA</span>
          </div>
          <div className="flex space-x-6 text-xs font-semibold">
            <span onClick={() => setActiveTab("home")} className="hover:text-primary-gold cursor-pointer transition font-sans">Notices légales</span>
            <span onClick={() => setActiveTab("home")} className="hover:text-primary-gold cursor-pointer transition font-sans">Contact</span>
            <span onClick={() => {
              setActiveTab("home");
              const el = document.getElementById("pourquoi");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }} className="hover:text-primary-gold cursor-pointer transition font-sans">FAQ</span>
          </div>
          <div className="flex space-x-4 text-xs font-semibold">
            <span className="hover:text-white cursor-pointer transition font-sans">Facebook</span>
            <span className="hover:text-white cursor-pointer transition font-sans">Instagram</span>
            <span className="hover:text-white cursor-pointer transition font-sans">YouTube</span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-white/[0.03] text-center text-xs text-gray-500 font-sans">
          &copy; 2026 Génie Méca. Tous droits réservés.
        </div>
      </footer>

      {/* GLOBAL TOAST ALERTS */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-950 text-white rounded-2xl shadow-2xl border border-slate-800 p-4 transition-all duration-300 flex items-start gap-3">
          <div className="text-lg">
            {toastType === "success" ? "🎉" : toastType === "error" ? "⚠️" : "ℹ️"}
          </div>
          <div className="flex-1">
            <p className="text-xs sm:text-sm font-semibold font-sans leading-relaxed">{toastMessage}</p>
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white font-bold text-xs shrink-0 bg-slate-800 hover:bg-slate-700 px-1.5 py-0.5 rounded cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* FREEMIUM CENTRAL PAYWALL MODAL */}
      {isPaywallOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4" id="paywall-modal">
          <div className="bg-white border-2 border-[#D4AF37] rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden relative flex flex-col p-6 sm:p-8">
            
            {/* Gold Accent Top Strip */}
            <div className="absolute top-0 inset-x-0 h-2 bg-[#D4AF37]"></div>

            {/* Close Button */}
            <button 
              onClick={() => setIsPaywallOpen(false)}
              className="absolute top-4 right-4 text-slate-450 hover:text-slate-700 font-sans p-2 rounded-full cursor-pointer hover:bg-slate-100 transition"
              title="Fermer"
            >
              ✕
            </button>

            {/* Premium Badge */}
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-[#8C6B13] border border-[#D4AF37]/35 text-[10px] sm:text-xs font-black uppercase tracking-wider">
                👑 FORFAIT ILLIMITÉ
              </span>
            </div>

            {/* Header / Notice */}
            <h3 className="text-center font-display font-black text-lg sm:text-xl text-rich-black uppercase tracking-tight mb-2">
              ⚠️ LIMITE DE RECHERCHE ATTEINTE !
            </h3>
            
            <p className="text-center text-xs sm:text-sm text-slate-600 mb-6 font-sans">
              Le véhicule rattaché à la plaque/VIN <strong className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{paywallVehicleName}</strong> a été analysé de façon gratuite. Toutes les requêtes ultérieures pour cette plaque exigent un forfait Premium.
            </p>

            {/* Price Box */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-6 text-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C6B13] font-mono leading-none block mb-1">MEMBRE PREMIUM ANNUEL</span>
              <div className="text-4xl font-extrabold text-[#111827] font-display flex items-baseline justify-center gap-1">
                49 € <span className="text-sm font-semibold text-slate-400 font-sans">/ an</span>
              </div>
              <p className="text-[11px] font-semibold text-[#D4AF37] mt-1 font-sans">
                Accès instantané et diagnostics 100% illimités
              </p>
            </div>

            {/* Benefits list */}
            <ul className="text-left text-slate-705 text-xs sm:text-sm space-y-3 mb-6 font-sans border-b border-gray-100 pb-5">
              <li className="flex items-center gap-2.5">
                <span className="text-emerald-500 font-bold text-base shrink-0">✓</span>
                <span><strong>Appels API Gemini instantanés illimités</strong></span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-emerald-500 font-bold text-base shrink-0">✓</span>
                <span>Détection intelligente de pièces d'origine (SIV/VIN)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-emerald-500 font-bold text-base shrink-0">✓</span>
                <span>Manuel de réparation & couples de serrage (Nm)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-emerald-500 font-bold text-base shrink-0">✓</span>
                <span>Garantie d'accès sans interruption 1 an complet</span>
              </li>
            </ul>

            {/* Buttons */}
            <button
              onClick={() => handleStripeCheckout()}
              disabled={isCheckoutLoading}
              className="w-full bg-[#111827] hover:bg-[#D4AF37] hover:text-[#111827] text-white py-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-md flex items-center justify-center gap-2 border border-[#D4AF37] disabled:opacity-50"
            >
              <span>{isCheckoutLoading ? "Redirection Stripe..." : "Payer 49€ / an via Stripe sécurisé"}</span>
            </button>

            <button
              onClick={() => setIsPaywallOpen(false)}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-800 font-sans mt-3 py-1 cursor-pointer transition font-medium underline"
            >
              Fermer et retourner aux recherches
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
