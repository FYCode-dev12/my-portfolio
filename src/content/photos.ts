export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  position?: string;
};

export const photos = {
  itera: {
    src: "/photos/itera-senja.jpg",
    width: 1920,
    height: 1440,
    alt: "Foto udara kampus ITERA saat senja, dengan danau dan gedung-gedung di sekitarnya",
    position: "50% 60%",
  },
  pantai: {
    src: "/photos/pantai-pasir-putih.jpg",
    width: 1920,
    height: 1280,
    alt: "Pantai berpasir di Lampung Selatan dengan sebuah perahu nelayan",
    position: "50% 60%",
  },
  petaTeluk: {
    src: "/photos/peta-teluk-lampung.jpg",
    width: 1920,
    height: 2513,
    alt: "Peta pelayaran Inggris tahun 1774 untuk Teluk Lampung di selatan Sumatra",
    position: "50% 52%",
  },
  petaKeyser: {
    src: "/photos/peta-keysers-bay.jpg",
    width: 1920,
    height: 2692,
    alt: "Peta pelayaran Inggris tahun 1774 untuk Teluk Keyser di pesisir selatan Sumatra",
    position: "50% 62%",
  },
} satisfies Record<string, Photo>;

/** Urutan bingkai di paragraf proyek beranda. */
export const workFrames: Photo[] = [
  photos.itera,
  photos.petaTeluk,
  photos.pantai,
  photos.petaKeyser,
];

export type Credit = {
  title: string;
  creator: string;
  license: string;
  licenseUrl: string;
  page: string;
};

export const credits: Credit[] = [
  {
    title: "Senja di Institut Teknologi Sumatera",
    creator: "Fandiamendra",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    page: "https://commons.wikimedia.org/wiki/File:Senja_di_Institut_Teknologi_Sumatera.jpg",
  },
  {
    title: "Pantai pasir putih, Lampung Selatan 2016",
    creator: "Aufa Bilhaq",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    page: "https://commons.wikimedia.org/w/index.php?curid=60243875",
  },
  {
    title: "Admiralty Chart No 881, Lampoon Bay, 1774",
    creator: "United Kingdom Hydrographic Office",
    license: "domain publik",
    licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/",
    page: "https://commons.wikimedia.org/wiki/File:Admiralty_Chart_No_881_Lampoon_bay_with_a_Plan_of_a_small_Harbour_in_Lagoondy_Island,_Published_1774.jpg",
  },
  {
    title: "Admiralty Chart No 880, Keyser's Bay, 1774",
    creator: "United Kingdom Hydrographic Office",
    license: "domain publik",
    licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/",
    page: "https://commons.wikimedia.org/wiki/File:Admiralty_Chart_No_880_Keyser%27s_Bay_or_Semanko_on_the_South_Coast_of_Sumatra,_Published_1774.jpg",
  },
];
