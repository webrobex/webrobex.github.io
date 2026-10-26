/**
 * oponiarze.pl - Main JavaScript Logic
 * Obsługuje w pełni niezależne ścieżki wyszukiwania: Kaskadową (Województwo -> Miasto) oraz Promieniową (Kod pocztowy).
 */

let currentWorkshops = [];
let loadedProvince = null;

const provinceToCities = {
  "dolnoslaskie": [
    "Bardo", "Bielawa", "Bierutów", "Bogatynia", "Boguszów-Gorce", 
    "Bolesławiec", "Bolków", "Brzeg Dolny", "Bystrzyca Kłodzka", "Chojnów", 
    "Duszniki-Zdrój", "Dzierżoniów", "Głogów", "Głuszyca", "Góra", 
    "Gryfów Śląski", "Jawor", "Jaworzyna Śląska", "Jelenia Góra", "Jelcz-Laskowice", 
    "Kamienna Góra", "Karpacz", "Kłodzko", "Kowary", "Kudowa-Zdrój", 
    "Lądek-Zdrój", "Legnica", "Leśna", "Lubań", "Lubin", 
    "Lwówek Śląski", "Międzybórz", "Międzylesie", "Milicz", "Mirsk", 
    "Niemcza", "Nowa Ruda", "Oborniki Śląskie", "Oleśnica", "Oława", 
    "Piechowice", "Pieszyce", "Piława Górna", "Polanica-Zdrój", "Polkowice", 
    "Prochowice", "Przemków", "Radków", "Sobótka", "Stronie Śląskie", 
    "Strzegom", "Strzelin", "Syców", "Szczawno-Zdrój", "Szklarska Poręba", 
    "Ścinawa", "Środa Śląska", "Świdnica", "Świebodzice", "Trzebnica", 
    "Twardogóra", "Wałbrzych", "Wąsosz", "Węgliniec", "Wiązów", 
    "Wleń", "Wojcieszów", "Wołów", "Wrocław", "Zawidów", 
    "Ząbkowice Śląskie", "Zgorzelec", "Ziębice", "Złotoryja", "Złoty Stok"
  ],
  "kujawsko-pomorskie": [
    "Aleksandrów Kujawski", "Barcin", "Brodnica", "Brześć Kujawski", "Bydgoszcz", 
    "Chełmno", "Chełmża", "Dobrzyń nad Wisłą", "Gniewkowo", "Golub-Dobrzyń", 
    "Górzno", "Grudziądz", "Inowrocław", "Izbica Kujawska", "Kamień Krajeński", 
    "Kcynia", "Koronowo", "Kruszwica", "Lipno", "Lubień Kujawski", 
    "Łasin", "Mogilno", "Nakło nad Notecią", "Nieszawa", "Piotrków Kujawski", 
    "Radziejów", "Rypin", "Sępólno Krajeńskie", "Skępe", "Solec Kujawski", 
    "Strzelno", "Szubin", "Świecie", "Toruń", "Tuchola", 
    "Wąbrzeźno", "Więcbork", "Włocławek", "Wyrzysk", "Żnin"
  ],
  "lubelskie": [
    "Annopol", "Biała Podlaska", "Biłgoraj", "Bychawa", "Chełm", 
    "Dęblin", "Frampol", "Hrubieszów", "Janów Lubelski", "Józefów", 
    "Kalisz", "Kamionka", "Kazimierz Dolny", "Kock", "Krasnystaw", 
    "Kraśnik", "Lubartów", "Lublin", "Łuków", "Międzyrzec Podlaski", 
    "Nałęczów", "Opole Lubelskie", "Parczew", "Piaski", "Poniatowa", 
    "Puławy", "Radzyń Podlaski", "Rejowiec", "Rejowiec Fabryczny", "Ryki", 
    "Stężyca", "Szczebrzeszyn", "Terespol", "Tomaszów Lubelski", "Włodawa", 
    "Zamość", "Zwierzyniec"
  ],
  "lubuskie": [
    "Babimost", "Bytom Odrzański", "Cybinka", "Dobiegniew", "Drezdenko", 
    "Gorzów Wielkopolski", "Gubin", "Iłowa", "Jasień", "Kargowa", 
    "Kostrzyn nad Odrą", "Kożuchów", "Krosno Odrzańskie", "Lubniewice", "Lubsko", 
    "Łęknica", "Małmice", "Międzyrzecz", "Nowa Sól", "Nowogrodziec", 
    "Ośno Lubuskie", "Skwierzyna", "Sława", "Słubice", "Strzelce Krajeńskie", 
    "Sulechów", "Sulęcin", "Szprotawa", "Świebodzin", "Torzym", 
    "Trzciel", "Witnica", "Wschowa", "Zbąszynek", "Zielona Góra", 
    "Żagań", "Żary"
  ],
  "lodzkie": [
    "Aleksandrów Łódzki", "Bełchatów", "Biała Rawska", "Błaszki", "Bolimów", 
    "Brzeziny", "Drzewica", "Działoszyn", "Koluszki", "Konstantynów Łódzki", 
    "Krośniewice", "Kutno", "Łask", "Łęczyca", "Łódź", 
    "Łowicz", "Opoczno", "Ozorków", "Pabianice", "Pajęczno", 
    "Piotrków Trybunalski", "Przedbórz", "Radomsko", "Rawa Mazowiecka", "Rzgów", 
    "Sadkowice", "Sieradz", "Skierniewice", "Stryków", "Sulejów", 
    "Szadek", "Tomaszów Mazowiecki", "Tuszyn", "Uniejów", "Warta", 
    "Wieluń", "Wieruszów", "Wolbórz", "Zduńska Wola", "Zelów", 
    "Zgierz", "Złoczew", "Żychlin"
  ],
  "malopolskie": [
    "Alwernia", "Andrychów", "Babice", "Bochnia", "Brzesko", 
    "Brzeszcze", "Bukowno", "Chełmek", "Chrzanów", "Ciężkowice", 
    "Czchów", "Dąbrowa Tarnowska", "Dobczyce", "Gorlice", "Grybów", 
    "Jordanów", "Kalwaria Zebrzydowska", "Kęty", "Kraków", "Krynica-Zdrój", 
    "Książ Wielki", "Libiąż", "Limanowa", "Maków Podhalański", "Miechów", 
    "Mszana Dolna", "Muszyna", "Myślenice", "Niepołomice", "Nowa Sarzyna", 
    "Nowy Sącz", "Nowy Targ", "Nowy Wiśnicz", "Olkusz", "Oświęcim", 
    "Piwniczna-Zdrój", "Proszowice", "Rabka-Zdrój", "Radłów", "Ryglice", 
    "Skarżysko", "Skawina", "Słomniki", "Stary Sącz", "Sucha Beskidzka", 
    "Sułkowice", "Szczawnica", "Tarnów", "Trzebinia", "Tuchów", 
    "Wadowice", "Wieliczka", "Wojnicz", "Wolbrom", "Zakliczyn", 
    "Zakopane", "Zator", "Żabno"
  ],
  "mazowieckie": [
    "Białobrzegi", "Bieżuń", "Błonie", "Brok", "Brwinów", 
    "Ciechanów", "Drobin", "Garwolin", "Gąbin", "Góra Kalwaria", 
    "Gostynin", "Grodzisk Mazowiecki", "Grójec", "Halinów", "Iłża", 
    "Kałuszyn", "Karczew", "Kobyłka", "Kozienice", "Legionowo", 
    "Lipsko", "Łaskarzew", "Łomianki", "Łosice", "Maków Mazowiecki", 
    "Marki", "Milanówek", "Mińsk Mazowiecki", "Mława", "Mogielnica", 
    "Mordy", "Mszczonów", "Myszyniec", "Nasielsk", "Nowy Dwór Mazowiecki", 
    "Ostrołęka", "Ostrów Mazowiecka", "Otwock", "Ożarów Mazowiecki", "Piaseczno", 
    "Piastów", "Pilawa", "Pionki", "Płock", "Płońsk", 
    "Płoniawy", "Połaniec", "Pruszków", "Przasnysz", "Przysucha", 
    "Pułtusk", "Raciąż", "Radom", "Radzymin", "Różan", 
    "Sanniki", "Serock", "Siedlce", "Sierpc", "Skaryszew", 
    "Sochaczew", "Sokołów Podlaski", "Sulejówek", "Szydłowiec", "Tarczyn", 
    "Tłuszcz", "Warszawa", "Węgrów", "Wołomin", "Wyszków", 
    "Ząbki", "Zielonka", "Zwoleń", "Żuromin", "Żyrardów"
  ],
  "opolskie": [
    "Biała", "Brzeg", "Byczyna", "Głogówek", "Głubczyce", 
    "Grodków", "Kędzierzyn-Koźle", "Kluczbork", "Kolonowskie", "Korfantów", 
    "Krapkowice", "Leśna", "Namysłów", "Niemodlin", "Nysa", 
    "Olesno", "Opole", "Otmuchów", "Paczków", "Praszka", 
    "Prudnik", "Strzelce Opolskie", "Ujazd", "Wołczyn", "Zawadzkie", 
    "Zdzieszowice"
  ],
  "podkarpackie": [
    "Baranów Sandomierski", "Błażowa", "Boguchwała", "Brzozów", "Cieszanów", 
    "Dębica", "Dukla", "Dynów", "Głogów Małopolski", "Iwonicz-Zdrój", 
    "Jarosław", "Jasło", "Kańczuga", "Kolbuszowa", "Krosno", 
    "Lesko", "Leżajsk", "Lubaczów", "Łańcut", "Mielec", 
    "Narol", "Nisko", "Nowa Dęba", "Oleszyce", "Pilzno", 
    "Przemśl", "Przeworsk", "Radymno", "Ropczyce", "Rudnik nad Sanem", 
    "Rzeszów", "Sanok", "Sędziszów Małopolski", "Sokołów Małopolski", "Stalowa Wola", 
    "Strzyżów", "Tarnobrzeg", "Tyczyn", "Ustrzyki Dolne", "Zagórz"
  ],
  "podlaskie": [
    "Augustów", "Białystok", "Bielsk Podlaski", "Ciechanowiec", "Czarna Białostocka", 
    "Dąbrowa Białostocka", "Drohiczyn", "Grajewo", "Hajnówka", "Kleszczele", 
    "Kolno", "Łapy", "Łomża", "Mońki", "Nowogród", 
    "Sejny", "Siemiatycze", "Sokółka", "Stawiski", "Suwałki", 
    "Szczuczyn", "Tykocin", "Wasilków", "Wysokie Mazowieckie", "Zambrów"
  ],
  "pomorskie": [
    "Brusy", "Bytów", "Chojnice", "Czarna Woda", "Czersk", 
    "Człuchów", "Debrzno", "Dzierzgoń", "Gdańsk", "Gdynia", 
    "Gniew", "Hel", "Jastarnia", "Kartuzy", "Kępice", 
    "Kościerzyna", "Kwidzyn", "Lębork", "Łeba", "Malbork", 
    "Miastko", "Nowy Dwór Gdański", "Pelplin", "Pruszcz Gdański", "Puck", 
    "Reda", "Rumia", "Skarszewy", "Skórcz", "Słupsk", 
    "Sopot", "Starogard Gdański", "Sztum", "Tczew", "Ustka", 
    "Wejherowo", "Władysławowo", "Żukowo"
  ],
  "slaskie": [
    "Będzin", "Bielsko-Biała", "Bieruń", "Blachownia", "Bytom", 
    "Chełmek", "Chorzów", "Cieszyn", "Czeladź", "Czerwionka-Leszczyny", 
    "Częstochowa", "Dąbrowa Górnicza", "Gliwice", "Goleszów", "Imielin", 
    "Jastrzębie-Zdrój", "Jaworzno", "Kalety", "Katowice", "Kłobuck", 
    "Kluczbork", "Knurów", "Koziegłowy", "Krzepice", "Kuźnia Raciborska", 
    "Lędziny", "Lubliniec", "Łaziska Górne", "Łazy", "Miasteczko Śląskie", 
    "Mikołów", "Mysłowice", "Myszków", "Ogrodzieniec", "Orzesze", 
    "Piekary Śląskie", "Pilica", "Pszczyna", "Pszów", "Pyskowice", 
    "Racibórz", "Radlin", "Radzionków", "Ruda Śląska", "Rybnik", 
    "Rydułtowy", "Siemianowice Śląskie", "Siewierz", "Skoczów", "Sosnowiec", 
    "Strumień", "Szczyrk", "Świętochłowice", "Tarnowskie Góry", "Toszek", 
    "Tychy", "Ustroń", "Węgierska Górka", "Wilamowice", "Wisła", 
    "Wodzisław Śląski", "Wojkowice", "Woźniki", "Zabrze", "Zawiercie", 
    "Żarki", "Żory", "Żywiec"
  ],
  "swietokrzyskie": [
    "Bodzentyn", "Busko-Zdrój", "Chmielnik", "Ćmielów", "Daleszyce", 
    "Działoszyce", "Jędrzejów", "Kazimierza Wielka", "Kielce", "Końskie", 
    "Koprzywnica", "Małogoszcz", "Morawica", "Nowa Słupia", "Opatów", 
    "Ostrowiec Świętokrzyski", "Ożarów", "Pińczów", "Połaniec", "Radoszyce", 
    "Sandomierz", "Sędziszów", "Skarżysko-Kamienna", "Starachowice", "Stąporków", 
    "Staszów", "Suchedniów", "Wąchock", "Włoszczowa", "Zawichost"
  ],
  "warminsko-mazurskie": [
    "Bartoszyce", "Biała Piska", "Biskupiec", "Bisztynek", "Braniewo", 
    "Dobre Miasto", "Działdowo", "Elbląg", "Ełk", "Frombork", 
    "Giżycko", "Gołdap", "Górowo Iławeckie", "Iława", "Jeziorany", 
    "Kętrzyn", "Kisielice", "Korsze", "Lidzbark", "Lidzbark Warmiński", 
    "Lubawa", "Mikołajki", "Miłakowo", "Miłomłyn", "Morąg", 
    "Mrągowo", "Nidzica", "Nowe Miasto Lubawskie", "Olecko", "Olsztyn", 
    "Olsztynek", "Ostróda", "Pasłęk", "Pieniężno", "Pisz", 
    "Reszel", "Ryn", "Sępopol", "Susz", "Szczytno", 
    "Tolkmicko", "Węgorzewo", "Zalewo"
  ],
  "wielkopolskie": [
    "Bojanowo", "Buk", "Chocz", "Chodzież", "Czarnków", 
    "Dąbie", "Dobrzyca", "Dolsk", "Gniezno", "Gostyń", 
    "Grabów nad Prosną", "Grodzisk Wielkopolski", "Jaraczewo", "Jarocin", "Jastrowie", 
    "Jutrosin", "Kalisz", "Kępno", "Kleczew", "Kłecko", 
    "Kłodawa", "Kobylin", "Konin", "Kórnik", "Kościan", 
    "Koźmin Wielkopolski", "Krajenka", "Krotoszyn", "Krzyż Wielkopolski", "Książ Wielkopolski", 
    "Leszno", "Luboń", "Margonin", "Miejska Górka", "Międzychód", 
    "Mikstat", "Mosina", "Murowana Goślina", "Nekla", "Nowe Skalmierzyce", 
    "Nowy Tomyśl", "Oborniki", "Obrzycko", "Odolanów", "Okonek", 
    "Opatówek", "Osieczna", "Ostrów Wielkopolski", "Ostrzeszów", "Piła", 
    "Pleszew", "Pniewy", "Pobiedziska", "Pogorzela", "Poniec", 
    "Poznań", "Przedecz", "Pyzdry", "Rakoniewice", "Raszków", 
    "Rawicz", "Rogoźno", "Rychwał", "Rydzyna", "Sieraków", 
    "Słupca", "Sompolno", "Swarzędz", "Szamocin", "Szamotuły", 
    "Ślesin", "Śmigiel", "Śrem", "Środa Wielkopolska", "Trzcianka", 
    "Trzemeszno", "Tuliszków", "Turek", "Ujście", "Wągrowiec", 
    "Wieleń", "Wielichowo", "Wolsztyn", "Wronki", "Września", 
    "Zagórów", "Złotów", "Żerków"
  ],
  "zachodniopomorskie": [
    "Barlinek", "Białogard", "Bobolice", "Borne Sulinowo", "Cedynia", 
    "Choszczno", "Czaplinek", "Darłowo", "Dębno", "Dobrzany", 
    "Drawsko Pomorskie", "Goleniów", "Gryfice", "Gryfino", "Ińsko", 
    "Kalisz Pomorski", "Kamień Pomorski", "Karlino", "Kołobrzeg", "Koszalin", 
    "Lipiany", "Łobez", "Maszewo", "Mieszkowice", "Międzyzdroje", 
    "Mirosławiec", "Moryń", "Nowogard", "Nowe Warpno", "Pełczyce", 
    "Płoty", "Police", "Połczyn-Zdrój", "Pyrzyce", "Recz", 
    "Sławno", "Stargard", "Świdwin", "Świnoujście", "Szczecin", 
    "Szczecinek", "Trzcińsko-Zdrój", "Trzebiatów", "Tuczno", "Wałcz", 
    "Wolin", "Złocieniec"
  ]
};

document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
});

function setupEventListeners() {
  const provinceSelect = document.getElementById("filter-wojewodztwo");
  const citySelect = document.getElementById("filter-miasto");
  const vehicleSelect = document.getElementById("filter-pojazd");
  const postalInput = document.getElementById("filter-kod-pocztowy");
  const radiusSelect = document.getElementById("filter-promien");

  if (provinceSelect) provinceSelect.addEventListener("change", onProvinceChange);
  if (citySelect) citySelect.addEventListener("change", applyFilters);
  if (vehicleSelect) vehicleSelect.addEventListener("change", applyFilters);
  if (postalInput) postalInput.addEventListener("input", applyFilters);
  if (radiusSelect) radiusSelect.addEventListener("change", applyFilters);
}

function onProvinceChange() {
  const provinceSelect = document.getElementById("filter-wojewodztwo");
  const citySelect = document.getElementById("filter-miasto");
  const selectedProvince = provinceSelect.value;

  if (!selectedProvince || !provinceToCities[selectedProvince]) {
    citySelect.innerHTML = '<option value="">Najpierw wybierz województwo</option>';
    citySelect.disabled = true;
    currentWorkshops = [];
    renderWorkshops([]);
    return;
  }

  citySelect.disabled = false;
  const cities = provinceToCities[selectedProvince].sort((a, b) => a.localeCompare(b, 'pl'));
  
  citySelect.innerHTML = '<option value="">-- Wybierz miasto --</option>' + 
    cities.map(city => `<option value="${city}">${city}</option>`).join('');

  loadProvinceData(selectedProvince);
}

function loadProvinceData(provinceSlug, callback) {
  if (loadedProvince === provinceSlug && currentWorkshops.length > 0) {
    if (typeof callback === 'function') callback();
    else applyFilters();
    return;
  }

  fetch(`data/${provinceSlug}.json`)
    .then(response => {
      if (!response.ok) throw new Error(`Brak pliku data/${provinceSlug}.json`);
      return response.json();
    })
    .then(data => {
      currentWorkshops = data;
      loadedProvince = provinceSlug;
      if (typeof callback === 'function') callback();
      else applyFilters();
    })
    .catch(error => {
      console.warn("Błąd ładowania pliku JSON:", error);
      currentWorkshops = [];
      renderWorkshops([]);
    });
}

// Słownik mapujący 2 pierwsze cyfry kodu pocztowego na odpowiedni slug województwa
function getProvinceSlugByPostal(postalCode) {
  const clean = postalCode ? postalCode.trim().replace("-", "") : "";
  if (clean.length < 2) return null;
  const prefix = clean.slice(0, 2);

  const map = {
    "85": "kujawsko-pomorskie", "86": "kujawsko-pomorskie", "87": "kujawsko-pomorskie", "88": "kujawsko-pomorskie",
    "80": "pomorskie", "81": "pomorskie", "82": "pomorskie", "83": "pomorskie", "84": "pomorskie",
    "00": "mazowieckie", "01": "mazowieckie", "02": "mazowieckie", "03": "mazowieckie", "04": "mazowieckie", 
    "05": "mazowieckie", "06": "mazowieckie", "07": "mazowieckie", "08": "mazowieckie", "09": "mazowieckie",
    "60": "wielkopolskie", "61": "wielkopolskie", "62": "wielkopolskie", "63": "wielkopolskie", "64": "wielkopolskie",
    "50": "dolnoslaskie", "51": "dolnoslaskie", "52": "dolnoslaskie", "53": "dolnoslaskie", "54": "dolnoslaskie", 
    "55": "dolnoslaskie", "56": "dolnoslaskie", "57": "dolnoslaskie", "58": "dolnoslaskie", "59": "dolnoslaskie",
    "30": "malopolskie", "31": "malopolskie", "32": "malopolskie", "33": "malopolskie", "34": "malopolskie", "38": "malopolskie", "39": "malopolskie",
    "40": "slaskie", "41": "slaskie", "42": "slaskie", "43": "slaskie", "44": "slaskie",
    "90": "lodzkie", "91": "lodzkie", "92": "lodzkie", "93": "lodzkie", "94": "lodzkie", 
    "95": "lodzkie", "96": "lodzkie", "97": "lodzkie", "98": "lodzkie", "99": "lodzkie",
    "20": "lubelskie", "21": "lubelskie", "22": "lubelskie", "23": "lubelskie", "24": "lubelskie",
    "65": "lubuskie", "66": "lubuskie", "67": "lubuskie", "68": "lubuskie", "69": "lubuskie",
    "45": "opolskie", "46": "opolskie", "47": "opolskie", "48": "opolskie", "49": "opolskie",
    "35": "podkarpackie", "36": "podkarpackie", "37": "podkarpackie",
    "15": "podlaskie", "16": "podlaskie", "17": "podlaskie", "18": "podlaskie", "19": "podlaskie",
    "25": "swietokrzyskie", "26": "swietokrzyskie", "27": "swietokrzyskie", "28": "swietokrzyskie", "29": "swietokrzyskie",
    "10": "warminsko-mazurskie", "11": "warminsko-mazurskie", "12": "warminsko-mazurskie", "13": "warminsko-mazurskie", "14": "warminsko-mazurskie",
    "70": "zachodniopomorskie", "71": "zachodniopomorskie", "72": "zachodniopomorskie", "73": "zachodniopomorskie", "74": "zachodniopomorskie", "76": "zachodniopomorskie", "77": "zachodniopomorskie", "78": "zachodniopomorskie"
  };

  return map[prefix] || null;
}

// Główna funkcja filtrująca działająca niezależnie dla obu trybów
async function applyFilters() {
  const citySelect = document.getElementById("filter-miasto");
  const vehicleSelect = document.getElementById("filter-pojazd");
  const postalInput = document.getElementById("filter-kod-pocztowy");
  const radiusSelect = document.getElementById("filter-promien");

  const selectedCity = citySelect ? citySelect.value : "";
  const selectedVehicle = vehicleSelect ? vehicleSelect.value : "";
  const postalValue = postalInput ? postalInput.value.trim() : "";
  const radiusValue = radiusSelect ? parseFloat(radiusSelect.value) || 10 : 10;

  // SPRAWDZENIE NIEZALEŻNOŚCI: Jeśli wpisano kod pocztowy, a dane odpowiedniego województwa nie są załadowane
  if (postalValue.length >= 5) {
    const targetProvince = getProvinceSlugByPostal(postalValue);
    if (targetProvince && loadedProvince !== targetProvince) {
      // Automatycznie pobierz dane dla tego województwa w tle, a potem uruchom filtrowanie ponownie
      loadProvinceData(targetProvince, () => {
        applyFilters();
      });
      return;
    }
  }

  let results = [...currentWorkshops];

  // Tryb A: Wyszukiwanie po kodzie pocztowym i promieniu (jeśli podano kod >= 5 znaków)
  if (postalValue.length >= 5 && typeof getPostalLocation === 'function') {
    const postalLoc = await getPostalLocation(postalValue);
    
    if (postalLoc) {
      if (selectedVehicle) {
        results = results.filter(w => Array.isArray(w.vehicles) && w.vehicles.includes(selectedVehicle));
      }

      results = results.map(workshop => {
        const distance = typeof calcDistance === 'function' 
          ? calcDistance(postalLoc.lat, postalLoc.lng, workshop.lat, workshop.lng) 
          : 0;
        return { ...workshop, _distance: distance };
      })
      .filter(workshop => workshop._distance <= radiusValue)
      .sort((a, b) => a._distance - b._distance);
    }
  } 
  // Tryb B: Standardowy wybór kaskadowy (Województwo -> Miasto)
  else {
    if (selectedCity) {
      results = results.filter(w => w.city === selectedCity);
    }

    if (selectedVehicle) {
      results = results.filter(w => Array.isArray(w.vehicles) && w.vehicles.includes(selectedVehicle));
    }

    results = results.map(w => { 
      const { _distance, ...rest } = w; 
      return rest; 
    });
  }

  renderWorkshops(results);
}

function renderWorkshops(list) {
  const container = document.getElementById("workshops-container");
  const countBadge = document.getElementById("results-count");

  if (countBadge) countBadge.textContent = list.length;
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12 bg-slate-900/60 rounded-2xl border border-slate-800">
        <p class="text-xl text-slate-400 font-medium">Brak warsztatów spełniających wybrane kryteria.</p>
        <p class="text-sm text-slate-500 mt-2">Wybierz województwo i miasto z listy powyżej lub sprawdź inny kod pocztowy.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(w => `
    <div class="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-orange-500/50 transition-all p-6 shadow-xl flex flex-col justify-between">
      <div>
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-xl font-bold text-white tracking-wide">${w.name}</h3>
            <p class="text-slate-400 text-sm mt-1">📍 ${w.address}, ${w.postal_code} ${w.city}</p>
          </div>
          ${w._distance !== undefined ? `
            <span class="px-3 py-1 bg-brand-500/10 text-brand-400 border border-brand-500/30 rounded-full text-xs font-semibold">
              ${w._distance} km
            </span>
          ` : ''}
        </div>

        <div class="space-y-2 mb-6 text-sm text-slate-300">
          <p class="flex items-center gap-2"><span>🗓️</span> <span>${w.working_days || 'Poniedziałek - Sobota'}</span></p>
          <p class="flex items-center gap-2"><span>⏰</span> <span>${w.working_hours || '08:00 - 18:00'}</span></p>
        </div>

        <div class="flex flex-wrap gap-2 mb-6">
          ${Array.isArray(w.services) ? w.services.map(s => `
            <span class="px-2.5 py-1 bg-slate-800 text-slate-300 text-xs rounded-md border border-slate-700">${s}</span>
          `).join('') : ''}
        </div>
      </div>

      <div class="pt-4 border-t border-slate-800 flex gap-3">
        <a href="tel:${w.phone}" class="flex-1 text-center py-2.5 bg-brand-500 hover:bg-brand-600 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-brand-500/20">
          📞 Zadzwoń (${w.phone})
        </a>
      </div>
    </div>
  `).join("");
}
