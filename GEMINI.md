# AGENTS.md / GEMINI.md

## Language Policy

* **User Communication**: Always communicate with the user in **Polish** (unless explicitly requested otherwise).

* **EPLAN Multilingual Fields**: Always populate multilingual EPLAN article attributes (`P_ARTICLE_DESCR1`, `P_ARTICLE_DESCR2`, `P_ARTICLE_NOTE`) in all three required languages: **Polish (`pl_PL`)**, **English (`en_US`)**, and **German (`de_DE`)** using exact syntax:
  `pl_PL@Opis po polsku;en_US@English description;de_DE@Deutsche Beschreibung;`

* **Trilingual Datasheet PDF (DTR)**: Every generated technical datasheet PDF (`<SanitizedPartNr>_datasheet.pdf`) must be a **single PDF file** containing three complete language versions arranged in strict sequential order: **1. Polish (`PL`)** $\rightarrow$ **2. English (`ENG`)** $\rightarrow$ **3. German (`DE`)**, with each language section starting on a new page.

* **Git Commits**: Write commit messages in **Polish** following Conventional Commits (e.g., `feat(edz): dodanie artykułu PXC.3270531`).

## 1. Project Overview & Repository Structure

**EPLAN EDZ Generator** automates the creation of structurally valid **`.edz`** (*EPLAN Data Archive Zipped*) article exchange packages for **EPLAN Electric P8** and **EPLAN Pro Panel** based on PDF datasheets, technical specifications, manufacturer URLs, and product images.

* **Project Root**: `G:\Mój dysk\Projekty Antigravity\Eplan EDZ generator\`

* **`EDZ/<YYMMDD>/<Manufacturer>.<SanitizedPartNr>/`**: Daily article working directory (e.g., `EDZ/261030/PXC.3270531/`) containing:

  * Trilingual Datasheet / DTR PDF (`PL` $\rightarrow$ `ENG` $\rightarrow$ `DE`): `<SanitizedPartNr>_datasheet.pdf`

  * Product photo PNG: `<SanitizedPartNr>.png`

  * Generated exchange package: `<Manufacturer>.<SanitizedPartNr>.edz`

* **`EDZ/<YYMMDD>/<YYMMDD>-<HHMMSS>.zip`**: Flat batch ZIP archive containing **only** `.edz` files from the current task (zero subfolders inside the ZIP) for one-click user download and EPLAN import.

* **`scripts/generate_edz.js`**: Core `.edz` generator engine with UTF-8 ZIP handling, `KNOWN_MANUFACTURERS` dictionary, and persistent `CATALOG` article registry.

* **`scripts/create_batch_zip.js`**: Packs multiple `.edz` files from a task into a flat `EDZ/<YYMMDD>/<YYMMDD>-<HHMMSS>.zip` archive.

* **`scripts/verify_xml.js`**: Validates XML structure, entity escaping, and tag closure inside generated `.edz` packages.

* **`scripts/verify_grouping.js`**: Audits `Product Grouping` hierarchy across all generated `.edz` files.

* **`scripts/html_to_pdf.js`**: Renders generated trilingual HTML datasheets into vector PDFs using headless Microsoft Edge.

* **`parametry_screeny/`**: Reference EPLAN screenshots (`ogólne.png`, `dane_montażowe.png`) defining mandatory parameter standards.

* **`.agents/skills/eplan-edz-generator/`**: Dedicated agent skill definitions.

## 2. EPLAN Article Parameter & XML Standards

Every generated article must include complete, accurate metadata adhering to the standards below:

### A. "General" Tab (`ogólne.png`)

* **Craft / Discipline**: `P_ARTICLE_CRAFT_ELECTRICAL="1"` (Electrical engineering).

* **Part Number** (`P_ARTICLE_PARTNR`): Exact identifier matching the article subfolder name (`<Manufacturer>.<SanitizedPartNr>`, e.g., `SIE.5SG6206`).

* **Type Number** (`P_ARTICLE_TYPENR`): Exact manufacturer model designation from datasheet (e.g., `5SG6206`).

* **Order Number** (`P_ARTICLE_ORDERNR`): Manufacturer catalog / ordering code.

* **Manufacturer** (`P_ARTICLE_MANUFACTURER`): Short manufacturer code registered in `KNOWN_MANUFACTURERS` (e.g., `SIE`, `PXC`, `ELB`, `ESKA`, `LIN`, `PF`, `EFB`, `HP`, `MURR`).

* **Designation 1** (`P_ARTICLE_DESCR1`) – **Multilingual (`pl_PL`, `en_US`, `de_DE`)**:

  * Concise, accurate functional description (e.g., `Wkładka bezpiecznikowa NEOZED D02 63A gG`).

* **Designation 2** (`P_ARTICLE_DESCR2`) – **Multilingual or Universal**:

  * Series, subtype, rating, or frame size (e.g., `D02, 400V AC / 250V DC`).

* **Description / Note** (`P_ARTICLE_NOTE`) – **Multilingual (`pl_PL`, `en_US`, `de_DE`)**:

  * Comprehensive technical specification: standards, rated voltage/current, tripping characteristic, mounting method, approvals.

### B. Product Grouping Hierarchy (STRICT ENFORCEMENT)

Incorrect classification breaks filtering and navigation in EPLAN Parts Management. Always assign exact official IDs:

1. **Product Top Group (`P_ARTICLE_PRODUCTTOPGROUP`)**:

   * `1` = Electrical engineering (*Elektrotechnika*)

   * `2` = Fluid power (*Płyny*)

   * `3` = Mechanics (*Mechanika*)

   * `4` = Process engineering (*Inżynieria procesowa*)

2. **Product Group (`P_ARTICLE_PRODUCTGROUP`)**:

   * `2` = Relays, contactors (*Przekaźniki, styczniki*)

   * `3` = Terminals (*Zaciski i złączki szynowe*)

   * `4` = Plugs & connectors (*Wtyki i złącza*)

   * `5` = Converters & isolators (*Przetworniki i separatory*)

   * `6` = Protection devices: fuses, MCB, MPCB, RCD (*Zabezpieczenia*)

   * `9` = Electric motors AC/DC, servomotors (*Silniki elektryczne*)

   * `10` = Measuring instruments (*Aparatura pomiarowa*)

   * `12` = Sensors, switches, pushbuttons (*Czujniki, łączniki, przyciski*)

   * `13` = Transformers (*Transformatory*)

   * `26` = PLC, IPC, HMI panels (*Sterowniki PLC, IPC, HMI*)

   * `29` = **Cables** (*Kable*)

   * `30` = Power supplies & converters (*Zasilacze i przetwornice*)

   * `49` = Housings & enclosures (*Obudowy i puszki mechaniczne*)

3. **Critical Product Subgroup Rules (`P_ARTICLE_PRODUCTSUBGROUP`)**:

   * **Electric Motors (asynchronous, synchronous, servomotors)**:

     * `P_ARTICLE_PRODUCTTOPGROUP="1"`, `P_ARTICLE_PRODUCTGROUP="9"`, `P_ARTICLE_PRODUCTSUBGROUP="1"` (*General / Ogólne*).

     * Mandatory code letter: `P_ARTICLE_CODELETTER="M"`.

   * **Pre-assembled Cables with Factory Connectors (copper/fiber patchcords, RJ45, DisplayPort, HDMI, USB, active extension cables, sensor cordsets)**:

     * `P_ARTICLE_PRODUCTTOPGROUP="1"`, `P_ARTICLE_PRODUCTGROUP="29"`, `P_ARTICLE_PRODUCTSUBGROUP="184"` (*Prefabricated / Konfekcjonowane*).

     * **NEVER classify pre-assembled cables as Subgroup `1` (General)!**

   * **Bulk / Spool Cables without Connectors** (e.g., raw industrial Ethernet FC TP cable sold by meter):

     * `P_ARTICLE_PRODUCTTOPGROUP="1"`, `P_ARTICLE_PRODUCTGROUP="29"`, `P_ARTICLE_PRODUCTSUBGROUP="1"` (*General / Ogólne*).

   * **DIN-Rail Terminals**:

     * `P_ARTICLE_PRODUCTTOPGROUP="1"`, `P_ARTICLE_PRODUCTGROUP="3"`, `P_ARTICLE_PRODUCTSUBGROUP="4"` (*Terminal*).

### C. "Mounting Data" Tab (`dane_montażowe.png`) & Media Paths

* **Weight** (`P_ARTICLE_WEIGHT`): Mass in kilograms $[\text{kg}]$ using a dot `.` decimal separator (e.g., $150\text{ g} \rightarrow \text{"0.15"}$).

* **Dimensions**: Width (`P_ARTICLE_WIDTH`), Height (`P_ARTICLE_HEIGHT`), Depth (`P_ARTICLE_DEPTH`) in millimeters $[\text{mm}]$ (dot `.` decimal separator, pure numbers without unit suffixes).

* **Mounting Space** (`P_ARTICLE_MOUNTINGSPACE`): Footprint area $=\text{Width} \times \text{Height}$ in $[\text{mm}^2]$ (e.g., `"2227.5"`).

* **Image File** (`P_ARTICLE_PICTUREFILE`): EPLAN path macro with backslashes: `$(MD_IMG)\<Manufacturer>\<SanitizedPartNr>.png` (bundled inside `.edz` at `items/picture/<Manufacturer>/<SanitizedPartNr>.png`).

* **Datasheet / DTR Document File** (`P_ARTICLE_DOCUMENTFILE`): EPLAN path macro with backslashes: `$(MD_DOC)\<Manufacturer>\<SanitizedPartNr>_datasheet.pdf` (bundled inside `.edz` at `items/documents/<Manufacturer>/<SanitizedPartNr>_datasheet.pdf`).

### D. Terminal Logic & Function Templates (`functiontemplate`)

Define accurate terminal connection points inside `<variant>` based on the official wiring diagram:

* Supply terminals (`A1`, `A2`, `L+`, `M`, etc.),

* Input/control terminals (`E0`, `E1`, `I1`, etc.),

* Output contacts COM/NC/NO (`11, 12, 14`, `13, 14`, etc.) with valid `functiondefcategory`, `functiondefgroup`, and `functiondefid`.

* **3-Phase Motors**: `functiondefcategory="1000"`, `functiondefgroup="1"`, `functiondefid="1"`, terminals `U1, V1, W1, PE` (or 6-terminal block `U1, V1, W1, U2, V2, W2, PE`), symbol `IEC_symbol;1;20;0`.

### E. EPLAN Pro Panel: Clearances, Drilling Patterns & 3D Macros

* **Cooling / Service Clearances**: Populate `P_ARTICLE_CLEARANCE_LEFT`, `P_ARTICLE_CLEARANCE_RIGHT`, `P_ARTICLE_CLEARANCE_TOP`, `P_ARTICLE_CLEARANCE_BOTTOM` (in $[\text{mm}]$) from manufacturer documentation.

* **Drilling Pattern (`.construction.xml`)**: For panel/screw-mounted devices (transformers, open-frame/chassis power supplies, heavy drives), generate `items/partxml/<Manufacturer>.<SanitizedPartNr>.construction.xml` with exact hole spacing and diameters, and link it in `part.xml` via `P_ARTICLE_CONSTRUCTION_FILE`.

* **3D Macros (`.ema` / `.ems` / `.step`)**: EPLAN natively uses `.ema`/`.ems`. If the user provides a `.step` CAD model, bundle it in the working folder and generate a helper C# script automating `.ema` macro creation in EPLAN Pro Panel.

## 3. Standard Execution Workflow

Execute the following 6 steps in strict sequence whenever asked to generate one or more EDZ articles:

### Step 1: Daily Directory Setup

1. Determine current date in `YYMMDD` format (e.g., `261030`).

2. Sanitize `<PartNr>` for filesystem paths (replace `/`, `\`, `:`, `*`, `?`, `"`, `<`, `>`, `|` with `-` or `_`) and create:
   `EDZ/<YYMMDD>/<Manufacturer>.<SanitizedPartNr>/`

### Step 2: Verification of Official Data, Product Image & Trilingual DTR Generation

1. **Data Extraction & Mandatory Completeness Check (Stop & Ask on Missing Data)**:

   * Extract exact technical parameters, dimensions ($W \times H \times D$), weight, clearances, and terminal logic **exclusively** from provided official manufacturer PDFs or official manufacturer websites.

   * **STOP & ASK PROTOCOL**: If any required parameter (especially physical dimensions, weight, electrical ratings, or terminal connection markings) cannot be found in official manufacturer documentation or on the manufacturer's website, **DO NOT GUESS OR FABRICATE IT**. Immediately halt generation for that item, list the found vs. missing parameters to the user in Polish, and ask the user how to proceed (e.g., whether the user will provide the missing values, supply an alternative datasheet, or authorize leaving specific optional fields blank).

   * Extract or download the official product image and save as a clean PNG in `EDZ/<YYMMDD>/<Manufacturer>.<SanitizedPartNr>/<SanitizedPartNr>.png`.

2. **Mandatory Trilingual Technical Datasheet (DTR) in a Single PDF (`PL`** $\rightarrow$ **`ENG`** $\rightarrow$ **`DE`)**:

   * For every verified article, generate a clean, comprehensive HTML technical specification (`scripts/<SanitizedPartNr>_datasheet.html`) using direct file-writing tools or a Node.js script (**never** use multiline PowerShell echo/heredoc pipes containing `<` or `>`).

   * The HTML document **must** contain three complete, consecutive language sections inside a single file, separated by explicit CSS page breaks (`page-break-after: always;` / `break-after: page;`), in this exact order:

     1. **Section 1 – Polish (`PL`)**: *Karta katalogowa / Dokumentacja Techniczno-Ruchowa (DTR)*

     2. **Section 2 – English (`ENG`)**: *Technical Datasheet / Product Specification*

     3. **Section 3 – German (`DE`)**: *Technisches Datenblatt / Produktdokumentation*

   * Each language section must include: header with Manufacturer, Part Number, Order Number, and embedded product image (`<SanitizedPartNr>.png`), functional description, full verified technical parameters table (electrical, mechanical, environmental), physical dimensions & mounting clearances, terminal connection / pinout table, and compliance standards/approvals.

   * Render the HTML into a single vector PDF via headless Edge:

     ```
     node scripts/html_to_pdf.js "scripts/<SanitizedPartNr>_datasheet.html" "EDZ/<YYMMDD>/<Manufacturer>.<SanitizedPartNr>/<SanitizedPartNr>_datasheet.pdf"
     
     ```

   * Verify the generated PDF exists, has size $> 0\text{ bytes}$, and contains all three language sections (`PL` $\rightarrow$ `ENG` $\rightarrow$ `DE`), then delete the temporary `.html` file from `scripts/`.

### Step 3: Registry Update & `.edz` Generation

1. Append or update the article entry inside `CATALOG` (and manufacturer in `KNOWN_MANUFACTURERS` if new) inside `scripts/generate_edz.js`.

2. Run the generator:

   ```
   node scripts/generate_edz.js "<Manufacturer>.<SanitizedPartNr>"
   
   ```

3. Confirm `EDZ/<YYMMDD>/<Manufacturer>.<SanitizedPartNr>/<Manufacturer>.<SanitizedPartNr>.edz` is created and bundles both `<SanitizedPartNr>.png` and the trilingual `<SanitizedPartNr>_datasheet.pdf`.

### Step 4: Flat Batch ZIP Creation

1. Once all requested `.edz` packages in the current task are built, create a single flat batch ZIP archive containing **only the `.edz` files** (no nested folders):

   ```
   node scripts/create_batch_zip.js "EDZ/<YYMMDD>/<Art1>/<Art1>.edz" "EDZ/<YYMMDD>/<Art2>/<Art2>.edz"
   
   ```

2. Confirm output archive `EDZ/<YYMMDD>/<YYMMDD>-<HHMMSS>.zip` exists.

### Step 5: Integrity & Compliance Verification

1. Validate XML syntax and tag closure:

   ```
   node scripts/verify_xml.js "EDZ/<YYMMDD>/<Manufacturer>.<SanitizedPartNr>/<Manufacturer>.<SanitizedPartNr>.edz"
   
   ```

2. Validate Product Grouping compliance:

   ```
   node scripts/verify_grouping.js
   
   ```

3. Inspect archive entries via `tar.exe -tf "<PathToFile>.edz"` (confirming `manifest.xml`, `part.xml`, `.png`, and trilingual `_datasheet.pdf` are present) and `tar.exe -tf "<PathToBatch>.zip"`.

### Step 6: User Report with MANDATORY Clickable `file:///` Links

At the end of every completion report:

1. Present a clean Markdown summary table of all generated articles (Part Nr, Manufacturer, Grouping `Top/Group/Subgroup`, Dimensions $W \times H \times D\text{ [mm]}$, Weight $[\text{kg}]$, DTR PDF status `PL/ENG/DE`, Description).

2. **STRICT REQUIREMENT**: Provide clickable `file:///` Markdown links (with URL-encoded spaces `%20` and Polish diacritics, e.g., `M%C3%B3j%20dysk`, and forward slashes `/`) pointing to:

   * Every created article folder:
     `[EDZ/261030/PXC.3270531](file:///g:/M%C3%B3j%20dysk/Projekty%20Antigravity/Eplan%20EDZ%20generator/EDZ/261030/PXC.3270531)`

   * The generated batch ZIP archive:
     `[Pobierz paczkę EDZ: 261030-115721.zip](file:///g:/M%C3%B3j%20dysk/Projekty%20Antigravity/Eplan%20EDZ%20generator/EDZ/261030/261030-115721.zip)`

## 4. Critical Rules & Guardrails

1. **ZERO Hallucination of Technical Data (Stop & Ask User on Missing Data)**:

   * **STRICT PROHIBITION**: Never guess, estimate, extrapolate, or fabricate any technical data—including dimensions (`WIDTH`, `HEIGHT`, `DEPTH`), weight (`WEIGHT`), mounting clearances, drilling hole spacing, electrical ratings (voltage, current, power, tripping curves), order numbers, or terminal markings/pinouts (`functiontemplate`).

   * **Authoritative Sources Only**: Rely exclusively on user-supplied documents, official manufacturer PDF datasheets, and official manufacturer websites.

   * **Mandatory User Consultation**: If any required parameter cannot be verified in official manufacturer sources, **immediately pause execution** for that article, clearly report to the user which parameters were found and which are missing, and ask the user how to proceed (e.g., manual input of missing dimensions/pins, providing another datasheet, or explicit approval to omit specific non-critical fields).

2. **Direct Execution Only (ZERO Subagents)**:

   * Execute all operations (web research, datasheet extraction, image processing, script updates, EDZ generation, and verification) **directly in the main agent thread**.

   * **NEVER** call `invoke_subagent` or delegate tasks to subagents / Boost mode.

3. **Mandatory Trilingual Datasheet PDF (`PL`** $\rightarrow$ **`ENG`** $\rightarrow$ **`DE` in One File)**:

   * Every article **must** have a generated `<SanitizedPartNr>_datasheet.pdf` (DTR) containing all three language versions inside a single PDF file in strict sequential order: **1. Polish (`PL`)** $\rightarrow$ **2. English (`ENG`)** $\rightarrow$ **3. German (`DE`)**, separated by page breaks.

   * Never generate single-language datasheets or split languages into separate PDF files.

4. **Catalog Registry Protection (`scripts/generate_edz.js`)**:

   * **Append / Update Only**: Never delete, overwrite, or truncate existing historical articles in `CATALOG` or entries in `KNOWN_MANUFACTURERS` when adding new parts.

5. **XML & Multilingual String Escaping**:

   * **No Semicolons in Descriptions**: Never use literal semicolons `;` inside the text of `P_ARTICLE_DESCR1`, `P_ARTICLE_DESCR2`, or `P_ARTICLE_NOTE` (use commas `,` or `/` instead), as `;` is EPLAN's language delimiter.

   * Always escape XML special characters (`&amp;`, `&lt;`, `&gt;`, `&quot;`, `&apos;`) in all XML attributes.

6. **Numeric Attribute Formatting**:

   * Always use a dot `.` as the decimal separator (never a comma `,`) and omit unit strings in numeric XML fields (`P_ARTICLE_WEIGHT`, `P_ARTICLE_WIDTH`, `P_ARTICLE_HEIGHT`, `P_ARTICLE_DEPTH`, `P_ARTICLE_MOUNTINGSPACE`, `P_ARTICLE_CLEARANCE_*`).

7. **Internal `.edz` Path Slashes vs EPLAN Macro Slashes**:

   * Inside ZIP archive entry headers (`.edz`), always use forward slashes `/` (`manifest.xml`, `items/partxml/part.xml`, `items/picture/...`, `items/documents/...`).

   * Inside `part.xml` attribute values for `P_ARTICLE_PICTUREFILE` and `P_ARTICLE_DOCUMENTFILE`, always use EPLAN macro backslashes (`$(MD_IMG)\<Mfg>\<File>.png`, `$(MD_DOC)\<Mfg>\<File>.pdf`).