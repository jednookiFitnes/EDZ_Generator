---
name: eplan-edz-generator
description: >-
  Tworzy i generuje pliki wymiany artykułów EPLAN (.edz) dla EPLAN Electric P8 na podstawie kart katalogowych (PDF, zdjęć, specyfikacji) w projekcie. Używaj tego skilla zawsze, gdy użytkownik prosi o utworzenie pliku EDZ, wygenerowanie artykułu do bazy EPLAN, odczyt parametrów z karty katalogowej lub przygotowanie pakietu artykułu.
---

# EPLAN EDZ Generator Skill

Ten skill służy do automatycznego generowania gotowych plików **`.edz`** (EPLAN Data Archive Zipped) na podstawie kart katalogowych produktów dla programu **EPLAN Electric P8**.

## 1. Konwencja struktury folderów w projekcie
* Artykuły są organizowane i generowane do podfolderów producentów:
  `EDZ/<Producent>/<Producent>.<NumerArtykułu>/` (np. `EDZ/SIE/SIE.5SG6206/`, `EDZ/RIT/RIT.5840600/`).
* Wewnątrz folderu artykułu znajdują się karty katalogowe w formacie PDF, zdjęcia urządzenia oraz wygenerowany plik `.edz`.
* Nazwa podfolderu artykułu jest jednocześnie numerem artykułu (`P_ARTICLE_PARTNR`).
* **Folder roboczy na Pulpicie**: Każdy nowo wygenerowany plik `.edz` z bieżącego zapytania jest automatycznie kopiowany do aktywnego folderu `EDZ` na pulpicie użytkownika (`C:\Users\pswie\OneDrive - Trinitec\Pulpit\EDZ`).
* **BEZWZGLĘDNY ZAKAZ PRZYWRACANIA USUNIĘTYCH PLIKÓW NA PULPICIE**: Gdy użytkownik usunie pliki `.edz` z Pulpitu, oznacza to, że zostały zaimportowane lub nie są potrzebne. Nigdy nie przywracaj, nie uzupełniaj i nie kopiuj ponownie na Pulpit plików z poprzednich zapytań! Na Pulpit trafiają WYŁĄCZNIE artykuły wygenerowane w bieżącym zadaniu.
* **Zakaz generowania paczek ZIP**: W projekcie nie generuje się już archiwów `.zip` (użytkownik pobiera pliki `.edz` bezpośrednio z projektu lub pulpitu).

---

## 2. Standard pól EPLAN do wypełnienia

Każdy generowany artykuł musi posiadać wypełnione pola zgodnie z poniższym standardem:

### A. Zakładka „Ogólnie” (`ogólne.png`) & Klasyfikacja produktów (Product Grouping)

Każdy generowany artykuł musi posiadać precyzyjnie ustaloną hierarchię grup produktów (`P_ARTICLE_PRODUCTTOPGROUP`, `P_ARTICLE_PRODUCTGROUP`, `P_ARTICLE_PRODUCTSUBGROUP`) zgodną z oficjalnym słownikiem platformy EPLAN Electric P8:

#### 1. Nadgrupa produktów (`P_ARTICLE_PRODUCTTOPGROUP`):
* `1` = **Elektrotechnika** (*Electrical engineering*) – aparatura elektryczna, kable, zasilanie, automatyka
* `2` = **Płyny** (*Fluid power*) – hydraulika, pneumatyka, smarowanie, chłodzenie
* `3` = **Mechanika** (*Mechanics*) – szafy, obudowy, szynoprzewody, akcesoria mechaniczne
* `4` = **Inżynieria procesowa** (*Process engineering*) – armatura przemysłowa, rurociągi, zbiorniki

---

#### 2. Kompletny wykaz grup produktów (`P_ARTICLE_PRODUCTGROUP`):

##### A. Elektrotechnika (`P_ARTICLE_PRODUCTTOPGROUP="1"`):
| ID | Nazwa polska | Nazwa angielska (EPLAN) | Zastosowanie / Przykłady |
| :---: | :--- | :--- | :--- |
| `0` | Niezdefiniowane | Undefined | Brak klasyfikacji |
| `1` | Ogólne | General | Elementy ogólne elektrotechniki |
| `2` | Przekaźniki, styczniki | Relays, contactors | Przekaźniki pomocnicze, interfejsowe, miniaturowe, styczniki mocy |
| `3` | Zaciski | Terminals | Listwy i złączki szynowe, zaciski śrubowe/sprężynowe |
| `4` | Wtyki | Plugs | Wtyki wielopinowe, złącza przemysłowe |
| `5` | Przetworniki | Converters | Przetworniki sygnałowe, separatory galwaniczne |
| `6` | Zabezpieczenia | Protection devices | Bezpieczniki topikowe, wyłączniki nadprądowe (MCB), silnikowe (MPCB), różnicowoprądowe (RCD) |
| `7` | Półprzewodniki | Semiconductors | Diody, tyrystory, mostki prostownicze |
| `8` | Sygnalizatory | Signal devices | Lampki sygnalizacyjne, kolumny świetlne, buczki, syreny |
| `9` | Silniki | Motors | Silniki elektryczne AC/DC, serwomotory |
| `10` | Aparatura pomiarowa i probiercza | Measuring instruments, test devices | Mierniki parametrów sieci, analizatory, przekładniki, dławiki probiercze |
| `11` | Rezystory | Resistors | Rezystory hamowania, rezystory bocznikowe |
| `12` | Czujniki, łączniki i przyciski | Sensor, switch, and pushbutton | Przyciski sterownicze, łączniki krzywkowe, wyłączniki krańcowe, czujniki indukcyjne/optyczne |
| `13` | Transformatory | Transformers | Transformatory separacyjne, sterownicze, zasilające |
| `14` | Modulatory | Modulators | Modulatory częstotliwości, modulatory sygnału |
| `15` | Urządzenia mechaniczne sterowane elektrycznie | Electrically-operated mechanical devices | Siłowniki elektryczne, rygle elektromagnetyczne |
| `16` | Artykuły specjalne elektrotechniki | Electrical engineering - special items | Elementy nietypowe elektrotechniki |
| `17` | Różne | Miscellaneous | Elementy dodatkowe |
| `18` | Kondensatory | Capacitors | Kondensatory mocy, kompensacyjne, filtrujące |
| `19` | Elementy logiczne | Logic items | Bramki logiczne, moduły logiczne |
| `20` | Źródła napięcia i generatory | Voltage source and generator | Agregaty prądotwórcze, generatory |
| `21` | Cewki / dławiki | Inductors | Dławiki sieciowe, filtracyjne, kompensacyjne |
| `22` | Wzmacniacze, regulatory | Amplifiers, controllers | Regulatory PID, regulatory temperatury, wzmacniacze sygnału |
| `23` | Aparatura rozdzielcza mocy | Power switchgear | Rozłączniki izolacyjne, wyłączniki powietrzne (ACB), kompaktowe (MCCB) |
| `24` | Terminatory, filtry | Terminators, filters | Filtry EMC/RFI, terminatory magistrali BUS (np. PROFIBUS) |
| `25` | Tory transmisji | Transmission paths | Prowadnice falowodowe, łącza transmisyjne |
| `26` | Sterowniki PLC / Komputery przemysłowe | PLC | Sterowniki PLC, procesory CPU, moduły we/wy, panele HMI, IPC, Thin Client |
| `29` | **Kable** | **Cables** | Kable zasilające, sygnałowe, teleinformatyczne, światłowody, kable wideo/magistralowe |
| `30` | Zasilacze i instalacje | Power units and plants | Zasilacze impulsowe 24V, zasilacze buforowe, UPS, przetwornice DC/DC |

##### B. Płyny / Technika płynów (`P_ARTICLE_PRODUCTTOPGROUP="2"`):
| ID | Nazwa polska | Nazwa angielska (EPLAN) |
| :---: | :--- | :--- |
| `32` | Siłowniki ogólne | Actuators, general |
| `33` | Silniki płynowe | Fluid motor |
| `34` | Filtry płynów | Filters |
| `35` | Terminale / wyspy zaworowe | Fluid Control Terminal |
| `36` | Złącza i szybkozłącza płynów | Couplings |
| `37` | Przyłącza i przewody płynów | Connections |
| `38` | Punkty pomiarowe ciśnienia/przepływu | Measuring connection points |
| `39` | Przyrządy pomiarowe płynów | Measuring instruments |
| `40` | Pompy hydrauliczne | Pumps |
| `41` | Czujniki płynów (ciśnienia, przepływu) | Sensors |
| `42` | Artykuły specjalne techniki płynów | Fluid power - special items |
| `43` | Akumulatory ciśnieniowe | Accumulators |
| `44` | Zawory hydrauliczne i pneumatyczne | Valves |
| `46` | Wymienniki ciepła | Heat exchangers |
| `47` | Akcesoria techniki płynów | Accessories |
| `48` | Płyty przyłączeniowe i blokowe | Sub-plates |

##### C. Mechanika (`P_ARTICLE_PRODUCTTOPGROUP="3"`):
| ID | Nazwa polska | Nazwa angielska (EPLAN) | Zastosowanie / Przykłady |
| :---: | :--- | :--- | :--- |
| `49` | Obudowy | Housings | Skrzynki zaciskowe, obudowy naścienne 19", puszki |
| `50` | Akcesoria obudowy, rozbudowa zewnętrzna | Housing accessories, external extension | Cokoły, daszki, uchwyty naścienne, nóżki |
| `51` | Akcesoria obudowy, rozbudowa wewnętrzna | Housing accessories, internal extension | Płyty montażowe, profile 19", półki, szyny chassis |
| `52` | Systemy zamków | Lock systems | Wkładki zamków, klamki, uchwyty zamykające |
| `53` | Kanały kablowe | Cable ducts | Koryta grzebieniowe, kanały perforowane |
| `54` | Szyny zbiorcze | Busbars | Szyny miedziane, systemy szyn prądowych |
| `55` | Szafa sterownicza | Enclosure | Szafy stojące, szafy szeregowe (np. Rittal VX25) |
| `56` | Osłony odciągowe / okapy | Extraction hood | Osłony wentylacyjne szaf |
| `57` | Komory elektrolityczne | Electrolysis cell | Elementy mechaniczne ogniw |
| `58` | Zawiesia / systemy ramion nośnych | Suspension | Ramiona nośne paneli operatorskich |

##### D. Inżynieria procesowa (`P_ARTICLE_PRODUCTTOPGROUP="4"`):
| ID | Nazwa polska | Nazwa angielska (EPLAN) |
| :---: | :--- | :--- |
| `59` | Komin | Chimney |
| `61` | Silnik procesowy | Engine |
| `62` | Zawór regulacyjny odcinający | Shut-off control valve |
| `63` | Zawór regulacyjny trójdrożny | Three-way control valve |
| `64` | Zawór regulacyjny zwrotny | Check control valve |
| `65` | Zbiornik | Container |
| `66` | Punkt przyłączeniowy zbiornika | Container connection point |
| `67` | Separator | Separator |
| `68` | Filtry procesowe | Filters |
| `69` | Osadnik / filtr siatkowy | Strainer |
| `70` | Przenośnik | Conveyor |
| `71` | Podnośnik | Lifter |
| `72` | Transporter | Transporter |
| `73` | Płaszcz zbiornika | Container sheath |
| `74` | Wężownica zbiornika | Container pipe coil |
| `75` | Kocioł parowy | Steam boiler |
| `76` | Chłodnica procesowa | Cooler |
| `77` | Piec | Furnace |
| `78` | Suszarka przemysłowa | Dryer |
| `79` | Wyparka | Evaporator |
| `80` | Wymiennik ciepła | Heat exchangers |
| `81` | Ugniatarka | Kneader |
| `82` | Mieszalnik | Mixer |
| `83` | Mieszadło | Stirrer |
| `84` | Sprężarka procesowa | Compressor |
| `85` | Pompa procesowa | Pumps |
| `86` | Pompa próżniowa | Vacuum pump |

---

#### 3. Podgrupa produktów (`P_ARTICLE_PRODUCTSUBGROUP`):
Podgrupa doprecyzowuje pozycję artykułu w poddrzewie danej grupy:

* **Dla Kabli (`PRODUCTGROUP="29"`)**:
  * **`184`** = **Konfekcjonowane** (*Prefabricated*) $\rightarrow$ **`Electrical engineering > Cables > Prefabricated`**. Należy stosować **zawsze** dla gotowych kabli z wtykami (patchcordy światłowodowe i RJ45, kable DisplayPort, HDMI, USB, gotowe wiązki kablowe)!
  * `1` = **Ogólne** (*General*) $\rightarrow$ **`Electrical engineering > Cables > General`** (dla kabli z metrażu / z bębna bez fabrycznych wtyków).
  * `228` = **Kable taśmowe** (*Ribbon cables*) $\rightarrow$ **`Electrical engineering > Cables > Ribbon cables`**.
* **Dla Przekaźników i styczników (`PRODUCTGROUP="2"`)**:
  * `1` = **Ogólne / Przekaźniki** (*General*) $\rightarrow$ **`Electrical engineering > Relays, contactors > General`**
  * `2` = **Styczniki** (*Contactors*) $\rightarrow$ **`Electrical engineering > Relays, contactors > Contactors`**
  * `3` = **Bloki styków pomocniczych** (*Auxiliary block*)
* **Dla Zacisków (`PRODUCTGROUP="3"`)**:
  * `1` = **Ogólne** (*General*)
  * `4` = **Zacisk / Złączka szynowa** (*Terminal*)
  * `5` = **Szyna montażowa DIN** (*Mounting rail*)
  * `6` = **Trzymacz końcowy** (*End clamp*)
  * `7` = **Oznacznik zacisku** (*Terminal label*)
  * `8` = **Inne oznaczniki** (*Other labels*)
  * `9` = **Oznacznik listwy** (*Strip label*)
  * `10` = **Mostek grzebieniowy / zwieracz** (*Cross-connector*)
  * `11` = **Szyny** (*Rails*)
  * `12` = **Pokrywa / płytka zamykająca** (*Cover*)
  * `13` = **Terminator** (*Terminator*)
  * `14` = **Ścianka rozdzielająca** (*Partition*)
* **Dla Zabezpieczeń (`PRODUCTGROUP="6"`)**:
  * `1` = **Ogólne / Bezpieczniki / Wyłączniki** (*General*) $\rightarrow$ **`Electrical engineering > Protection devices > General`**
* **Dla Silników (`PRODUCTGROUP="9"`)**:
  * `1` = **Ogólne / Silniki AC/DC / Serwo** (*General*) $\rightarrow$ **`Electrical engineering > Motors > General`**
* **Dla Sterowników PLC / IPC (`PRODUCTGROUP="26"`)**:
  * `1` = **Ogólne / CPU / Moduły / Terminale** (*General*) $\rightarrow$ **`Electrical engineering > PLC > General`**
* **Dla Wtyków (`PRODUCTGROUP="4"`)**:
  * `1` = **Ogólne** (*General*)
  * `15` = **Obudowa wtyku** (*Plug housing*)
* **Dla Mechaniki (`PRODUCTGROUP="49"`, `"50"`, `"51"`, `"53"`, `"54"`, `"55"` itp.)**:
  * `1` = **Ogólne** (*General*)
* **Dla pozostałych aparatów elektrotechnicznych (`PRODUCTGROUP="5"`, `"10"`, `"12"`, `"18"`, `"21"`, `"30"` itp.)**:
  * `1` = **Ogólne** (*General*) – domyślna podgrupa standardowa.

---

#### 4. Pozostałe pola zakładki „Ogólnie”:
* **Branża** (`P_ARTICLE_CRAFT_ELECTRICAL="1"`): Elektrotechnika
* **Oznaczenie literowe** (`P_ARTICLE_CODELETTER`): Zgodne z IEC 81346 / IEC 61346 (np. `K` dla przekaźników/styczników, `F` dla zabezpieczeń, `W` dla kabli, `M` dla silników).
* **Numer artykułu** (`P_ARTICLE_PARTNR`): Identyczny z nazwą folderu (np. `ELB.KR-163B`).
* **Numer typu** (`P_ARTICLE_TYPENR`): Oznaczenie modelu z karty katalogowej (np. `KR-163B`).
* **Numer katalogowy** (`P_ARTICLE_ORDERNR`): Kod zamówieniowy / katalogowy.
* **Producent** (`P_ARTICLE_MANUFACTURER`): Skrót producenta (np. `ELB`, `SIEMENS`, `PXC`).
* **Oznaczenie 1** (`P_ARTICLE_DESCR1`) – **Wielojęzyczne** (`pl_PL`, `en_US`, `de_DE`):
  * Krótki, zwięzły opis charakteryzujący dany element wraz z najważniejszymi parametrami technicznymi (np. `Obudowa górna revos 24 - boczna, z dławikiem M32, Ø 16 - 25 mm`, `Przekaźnik ochrony styków / przetwornik pomiarowy 1-kanałowy`).
  * Format ciągu wielojęzycznego: `pl_PL@...;en_US@...;de_DE@...;`
* **Oznaczenie 2** (`P_ARTICLE_DESCR2`) – Opcjonalna seria lub podtyp.
* **Opis** (`P_ARTICLE_NOTE`) – **Wielojęzyczne** (`pl_PL`, `en_US`, `de_DE`):
  * Pełny opis techniczny zawierający typ, atesty/normy, sposób montażu, parametry wejściowe, parametry zestyków i zastosowanie.

### B. Zakładka „Dane montażowe” (`dane_montażowe.png`)
* **Ciężar** (`P_ARTICLE_WEIGHT`): waga w kilogramach [kg] (np. `150 g` -> `0.15`).
* **Szerokość** (`P_ARTICLE_WIDTH`): szerokość w [mm] (np. `22.5`).
* **Wysokość** (`P_ARTICLE_HEIGHT`): wysokość w [mm] (np. `99`).
* **Głębokość** (`P_ARTICLE_DEPTH`): głębokość w [mm] (np. `114.5`).
* **Wymagane miejsce** (`P_ARTICLE_MOUNTINGSPACE`): pole powierzchni zabudowy = szerokość × wysokość [mm²] (np. `2227.5`).
* **Plik graficzny** (`P_ARTICLE_PICTUREFILE`): ścieżka makra grafiki `$(MD_IMG)\<Producent>\<NazwaPliku>.png`.

### C. Schemat logiczny / Szablon funkcji (`functiontemplate`)
W sekcji `<variant>` artykułu należy zdefiniować logikę zacisków (odczytaną ze schematu w karcie):
* Zaciski zasilania (`A1`, `A2` itp.)
* Zaciski wejściowe czujników (`E0`, `E1` itp.)
* Zaciski zestyków przełącznych / zwiernych / rozwiernych (`11, 12, 14` itp.)
* Silniki trójfazowe: `functiondefcategory="1000"`, `functiondefgroup="1"`, `functiondefid="1"`, zaciski fazowe `U1, V1, W1, PE` (lub pełna skrzynka 6-zaciskowa `U1, V1, W1, U2, V2, W2, PE`), symbol `IEC_symbol;1;20;0`.

---

## 3. Struktura archiwum `.edz`

Archiwum `.edz` to archiwum ZIP (kodowanie nazw UTF-8) o następującej strukturze:
```
<NumerArtykułu>.edz
├── manifest.xml
└── items/
    ├── partxml/
    │   ├── <NumerArtykułu>.part.xml
    │   └── <Producent>.manufacturer.xml
    ├── picture/
    │   └── <Producent>/
    │       └── <NazwaObrazka>.png
    └── document/
        └── <Producent>/
            └── <KartaKatalogowa>.pdf
```

### Plik `manifest.xml` (Wersja 2.0)
```xml
<?xml version="1.0" encoding="utf-8" ?>
<manifest version="2.0">
 <packages>
  <package type="part" key="<NumerArtykułu>" name="<NumerArtykułu>">
   <items>
    <item type="partxml" name="part" locator="<NumerArtykułu>.part.xml"/>
    <item type="partxml" name="manufacturer" locator="<Producent>.manufacturer.xml"/>
    <item type="partxml" name="supplier" locator="<Producent>.manufacturer.xml"/>
    <item type="picture" name="picturefile" locator="<Producent>\<NazwaObrazka>.png"/>
    <item type="document" name="externalDocument1" locator="<Producent>\<Dokument>.pdf"/>
   </items>
  </package>
 </packages>
</manifest>
```

---

## 4. Procedura postępowania przy nowym prompcie użytkownika

Gdy użytkownik wskaże folder lub poprosi o utworzenie artykułu EDZ:
1. **Analiza dokumentacji**:
   * Otwórz i przeanalizuj oficjalne pliki PDF lub strony producenta.
   * Zidentyfikuj konkretny model wskazany w zapytaniu.
   * Wypisz kluczowe dane: wymiary gabarytowe, wagę, zasilanie, styki, opis i dane producenta.
2. **Przygotowanie grafiki urządzenia i trójjęzycznej DTR**:
   * Zapisz wykadrowany obraz z przezroczystym tłem w folderze `EDZ/<Producent>/<Producent>.<NumerArtykułu>/<NumerArtykułu>.png`.
   * Wygeneruj trójjęzyczną kartę PDF (`PL` -> `ENG` -> `DE`) w jednym pliku: `..._datasheet.pdf`.
3. **Generowanie pakietu EDZ i synchronizacja na Pulpit**:
   * Wykorzystaj silnik generatora `scripts/generate_edz.js`, konfigurując parametry artykułu.
   * Plik `.edz` zostaje automatycznie zapisany w folderze artykułu oraz skopiowany na Pulpit do folderu `Desktop/EDZ/`.
   * **UWAGA**: Nie tworzymy i nie generujemy żadnych paczek `.zip`!
4. **Weryfikacja**:
   * Sprawdź poprawność archiwum za pomocą `tar.exe -tf "<Plik>.edz"`.
   * Zweryfikuj poprawność XML parserem (`scripts/verify_xml.js`).
   * Zweryfikuj klasyfikację grup produktów (`scripts/verify_grouping.js`).
5. **Raport**:
   * Przedstaw użytkownikowi podsumowanie wprowadzonych wartości i potwierdzenie utworzenia plików `.edz`.
   * **Wymóg obowiązkowy (Clickable links)**: Na koniec odpowiedzi **ZAWSZE** wygeneruj klikalne linki Markdown (ze schematem `file:///...`) bezpośrednio do folderów z nowo utworzonymi plikami EDZ (np. `[EDZ/RIT/RIT.5840600](file:///C:/Dev/Trinitec/Eplan%20EDZ%20generator/EDZ/RIT/RIT.5840600)`), samego pliku `.edz` oraz bezpośredni link do folderu `Desktop/EDZ/` na pulpicie.

---

## 5. Zasada bezpośredniej pracy agenta (BEZ podagentów)

Wszystkie operacje (wyszukiwanie w sieci, pobieranie kart katalogowych, ekstrakcję i obróbkę zdjęć, generowanie EDZ oraz weryfikację) główny agent wykonuje **bezpośrednio we własnym wątku**, bez uruchamiania podagentów (`invoke_subagent`) ani trybu Boost. Zapewnia to maksymalną szybkość realizacji zadań i brak opóźnień komunikacyjnych.
