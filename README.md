# NextSearch - Web Frontend

A modern, scalable search engine frontend built with **Next.js**, **TypeScript**, and **Tailwind CSS**.

## Features

- ⚡ Fast search with real-time autocomplete
- 📊 Statistics dashboard with index metrics
- 📚 Documentation for search tips and API
- 👥 About page with team information
- 🔍 Recent search history
- 🎨 Dark mode glassmorphism UI

## Getting Started

1. Make sure you're in the frontend directory:

```bash
cd NextSearch-web
```

2. Create a `.env.local` file with your API endpoint:

```bash
NEXT_PUBLIC_API_BASE=http://localhost:8080
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
NextSearch-web/
├── app/              # Next.js App Router pages
│   ├── about/        # About/Team page
│   ├── docs/         # Documentation page
│   ├── stats/        # Statistics page
│   ├── globals.css   # Global styles
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Home/Search page
├── components/       # React components
│   ├── ui/           # Reusable UI components
│   └── search/       # Search-related components
├── hooks/            # Custom React hooks
├── lib/              # Utilities, types, API client
└── public/           # Static assets
```

## Technology Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS
- **Lucide React** - Icon library


DO NOT TOUCH!
I'm going to use azure openAI and deploy and get the keys in this format in .env file:

AZURE_OPENAI_ENDPOINT=
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_MODEL=gpt-5.2-chat

Assume I have





Now considering the backend returns results like this:

{
  "cache_lookup_ms": 0.179,
  "cached": true,
  "found": 274271,
  "k": 10,
  "query": "covid",
  "results": [
    {
      "author": "Pfaller et al.",
      "cord_uid": "apj81de8",
      "docId": 129171,
      "json_relpath": "document_parses/pmc_json/PMC9075155.xml.json",
      "publish_time": "2022-05-02",
      "score": 0.7678499817848206,
      "segment": "seg_000001",
      "title": "Impact of COVID-19 on the antifungal susceptibility profiles of isolates collected in a global surveillance program that monitors invasive fungal infections",
      "url": "https://doi.org/10.1093/mmy/myac028"
    },
    {
      "cord_uid": "pzy1y97r",
      "docId": 271576,
      "json_relpath": "document_parses/pmc_json/PMC8501276.xml.json",
      "publish_time": "2021-08-03",
      "score": 0.7675086855888367,
      "segment": "seg_000001",
      "title": "重型/危重型新型冠状病毒肺炎（COVID-19）患者凝血功能障碍与细胞因子风暴综合征关系的研究进展",
      "url": "https://www.ncbi.nlm.nih.gov/pubmed/34547883/"
    },
    {
      "author": "Fernández-Ballesteros et al.",
      "cord_uid": "nn35h009",
      "docId": 175403,
      "json_relpath": "document_parses/pmc_json/PMC7999468.xml.json",
      "publish_time": "2021-03-01",
      "score": 0.7674872875213623,
      "segment": "seg_000001",
      "title": "Health, Psycho-Social Factors, and Ageism in Older Adults in Spain during the COVID-19 Pandemic",
      "url": "https://www.ncbi.nlm.nih.gov/pubmed/33804449/"
    },
    {
      "author": "Hartsgrove et al.",
      "cord_uid": "s8ostotz",
      "docId": 275544,
      "json_relpath": "document_parses/pdf_json/9e2a2b5a283f37bbc0acd22e3e0b2a2e8cce6860.json",
      "publish_time": "2021-07-23",
      "score": 0.7673372030258179,
      "segment": "seg_000001",
      "title": "MEASURING DISCHARGE OUTCOMES, LENGTH OF STAY, AND FUNCTIONAL ADL SCORE DURING COVID-19 IN INPATIENT REHABILITATION HOSPITALS",
      "url": "https://api.elsevier.com/content/article/pii/S0003999321005165"
    },
    {
      "author": "Oda et al.",
      "cord_uid": "cmpxvhmu",
      "docId": 52589,
      "json_relpath": "document_parses/pmc_json/PMC8207129.xml.json",
      "publish_time": "2021-05-13",
      "score": 0.7670263051986694,
      "segment": "seg_000001",
      "title": "COVID–19の第1波への対応についてのJAAM全国調査(JAAM nationwide survey on the response to the first wave of COVID–19 in Japan): ～第2部：医療機関はどのように乗り越えたのか，今後どう備えるべきか～(–Part II: How did medical institutions overcome the first wave and how should they prepare for the future? –)",
      "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8207129/"
    },
    {
      "author": "Ben Mustapha et al.",
      "cord_uid": "egwnwpvz",
      "docId": 161761,
      "json_relpath": "document_parses/pmc_json/PMC8986347.xml.json",
      "publish_time": "2022-03-04",
      "score": 0.766873836517334,
      "segment": "seg_000001",
      "title": "The COVID-19 Status of Patients Is an Essential Determinant for Decision-Making by Radiation Oncologists: A European Survey",
      "url": "https://www.ncbi.nlm.nih.gov/pubmed/35399459/"
    },
    {
      "author": "Mainous et al.",
      "cord_uid": "oxa060jf",
      "docId": 172887,
      "json_relpath": "document_parses/pmc_json/PMC8671141.xml.json",
      "publish_time": "2021-12-01",
      "score": 0.7668697834014893,
      "segment": "seg_000001",
      "title": "COVID-19 Post-acute Sequelae Among Adults: 12 Month Mortality Risk",
      "url": "https://doi.org/10.3389/fmed.2021.778434"
    },
    {
      "author": "Chillakuru et al.",
      "cord_uid": "612ka35i",
      "docId": 291626,
      "json_relpath": "document_parses/pmc_json/PMC8662213.xml.json",
      "publish_time": "2021-10-15",
      "score": 0.7667902708053589,
      "segment": "seg_000001",
      "title": "Impact of COVID‐19 on Otolaryngology Literature",
      "url": "https://doi.org/10.1002/lary.29902"
    },
    {
      "author": "Laestadius et al.",
      "cord_uid": "7wqc1uvh",
      "docId": 186267,
      "json_relpath": "document_parses/pmc_json/PMC9140570.xml.json",
      "publish_time": "2022-05-14",
      "score": 0.7667797207832336,
      "segment": "seg_000001",
      "title": "State Health Department Communication about Long COVID in the United States on Facebook: Risks, Prevention, and Support",
      "url": "https://doi.org/10.3390/ijerph19105973"
    },
    {
      "author": "Stefanini et al.",
      "cord_uid": "ucivizbl",
      "docId": 252612,
      "json_relpath": "document_parses/pmc_json/PMC8467430.xml.json",
      "publish_time": "2021-08-24",
      "score": 0.7666947245597839,
      "segment": "seg_000001",
      "title": "Profile of Bacterial Infections in COVID-19 Patients: Antimicrobial Resistance in the Time of SARS-CoV-2",
      "url": "https://doi.org/10.3390/biology10090822"
    }
  ],
  "search_time_ms": 0.0,
  "segments": 1,
  "total_time_ms": 0.1996
}

Update the types.ts and if the result is cached, the advanced popup should also show (cached) if the results were cached, and total_time_ms too (like it already does)