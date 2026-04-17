// ============================================================
// lib/atomData.ts — Data mentah 118 unsur kimia
// ============================================================

// Format: "Symbol,Nama Indonesia,Nomor Massa"
export const elementRawData: string[] = [
  "H,Hidrogen,1", "He,Helium,4", "Li,Litium,7", "Be,Berilium,9", "B,Boron,11",
  "C,Karbon,12", "N,Nitrogen,14", "O,Oksigen,16", "F,Fluor,19", "Ne,Neon,20",
  "Na,Natrium,23", "Mg,Magnesium,24", "Al,Aluminium,27", "Si,Silikon,28",
  "P,Fosfor,31", "S,Belerang,32", "Cl,Klorin,35", "Ar,Argon,40",
  "K,Kalium,39", "Ca,Kalsium,40", "Sc,Skandium,45", "Ti,Titanium,48",
  "V,Vanadium,51", "Cr,Kromium,52", "Mn,Mangan,55", "Fe,Besi,56",
  "Co,Kobalt,59", "Ni,Nikel,59", "Cu,Tembaga,64", "Zn,Seng,65",
  "Ga,Galium,70", "Ge,Germanium,73", "As,Arsenik,75", "Se,Selenium,79",
  "Br,Bromin,80", "Kr,Kripton,84",
  "Rb,Rubidium,85", "Sr,Stronsium,88", "Y,Itrium,89", "Zr,Zirkonium,91",
  "Nb,Niobium,93", "Mo,Molibdenum,96", "Tc,Teknesium,98", "Ru,Rutenium,101",
  "Rh,Rodium,103", "Pd,Paladium,106", "Ag,Perak,108", "Cd,Kadmium,112",
  "In,Indium,115", "Sn,Timah,119", "Sb,Antimon,122", "Te,Telurium,128",
  "I,Yodium,127", "Xe,Xenon,131",
  "Cs,Sesium,133", "Ba,Barium,137", "La,Lantanum,139", "Ce,Serium,140",
  "Pr,Praseodimium,141", "Nd,Neodimium,144", "Pm,Prometium,145",
  "Sm,Samarium,150", "Eu,Europium,152", "Gd,Gadolinium,157", "Tb,Terbium,159",
  "Dy,Disprosium,163", "Ho,Holmium,165", "Er,Erbium,167", "Tm,Tulium,169",
  "Yb,Iterbium,173", "Lu,Lutetium,175", "Hf,Hafnium,178", "Ta,Tantalum,181",
  "W,Tungsten,184", "Re,Renium,186", "Os,Osmium,190", "Ir,Iridium,192",
  "Pt,Platina,195", "Au,Emas,197", "Hg,Raksa,201", "Tl,Talium,204",
  "Pb,Timbal,207", "Bi,Bismut,209", "Po,Polonium,209", "At,Astatin,210",
  "Rn,Radon,222",
  "Fr,Fransium,223", "Ra,Radium,226", "Ac,Aktinium,227", "Th,Torium,232",
  "Pa,Protaktinium,231", "U,Uranium,238", "Np,Neptunium,237",
  "Pu,Plutonium,244", "Am,Amerisium,243", "Cm,Kurium,247",
  "Bk,Berkelium,247", "Cf,Kalifornium,251", "Es,Einsteinium,252",
  "Fm,Fermium,257", "Md,Mendelevium,258", "No,Nobelium,259",
  "Lr,Lawrensium,262", "Rf,Rutherfordium,267", "Db,Dubnium,268",
  "Sg,Seaborgium,271", "Bh,Bohrium,272", "Hs,Hassium,270",
  "Mt,Meitnerium,276", "Ds,Darmstadtium,281", "Rg,Roentgenium,280",
  "Cn,Kopernisium,285", "Nh,Nihonium,284", "Fl,Flerovium,289",
  "Mc,Moskovium,288", "Lv,Livermorium,293", "Ts,Tenesin,294",
  "Og,Oganesson,294",
];

// Warna blok Tabel Periodik
export const BLOCK_COLORS: Record<string, string> = {
  s: "bg-blue-500/20 hover:bg-blue-500/40 border-blue-500/50 text-blue-100",
  p: "bg-green-500/20 hover:bg-green-500/40 border-green-500/50 text-green-100",
  d: "bg-yellow-500/20 hover:bg-yellow-500/40 border-yellow-500/50 text-yellow-100",
  f: "bg-purple-500/20 hover:bg-purple-500/40 border-purple-500/50 text-purple-100",
};

// Tema warna panel chat
export const PANEL_THEMES = [
  { bg: "bg-indigo-600", hover: "hover:bg-indigo-700", bubble: "bg-indigo-600", textBtn: "text-indigo-600", borderBtn: "border-indigo-100", hoverBorderBtn: "hover:border-indigo-300", bgLight: "bg-indigo-50" },
  { bg: "bg-emerald-600", hover: "hover:bg-emerald-700", bubble: "bg-emerald-600", textBtn: "text-emerald-600", borderBtn: "border-emerald-100", hoverBorderBtn: "hover:border-emerald-300", bgLight: "bg-emerald-50" },
  { bg: "bg-rose-600", hover: "hover:bg-rose-700", bubble: "bg-rose-600", textBtn: "text-rose-600", borderBtn: "border-rose-100", hoverBorderBtn: "hover:border-rose-300", bgLight: "bg-rose-50" },
  { bg: "bg-amber-600", hover: "hover:bg-amber-700", bubble: "bg-amber-600", textBtn: "text-amber-600", borderBtn: "border-amber-100", hoverBorderBtn: "hover:border-amber-300", bgLight: "bg-amber-50" },
  { bg: "bg-cyan-600", hover: "hover:bg-cyan-700", bubble: "bg-cyan-600", textBtn: "text-cyan-600", borderBtn: "border-cyan-100", hoverBorderBtn: "hover:border-cyan-300", bgLight: "bg-cyan-50" },
  { bg: "bg-purple-600", hover: "hover:bg-purple-700", bubble: "bg-purple-600", textBtn: "text-purple-600", borderBtn: "border-purple-100", hoverBorderBtn: "hover:border-purple-300", bgLight: "bg-purple-50" },
  { bg: "bg-pink-600", hover: "hover:bg-pink-700", bubble: "bg-pink-600", textBtn: "text-pink-600", borderBtn: "border-pink-100", hoverBorderBtn: "hover:border-pink-300", bgLight: "bg-pink-50" },
  { bg: "bg-teal-600", hover: "hover:bg-teal-700", bubble: "bg-teal-600", textBtn: "text-teal-600", borderBtn: "border-teal-100", hoverBorderBtn: "hover:border-teal-300", bgLight: "bg-teal-50" },
];
