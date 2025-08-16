# Landing Page Redesign: Content Guide (Revised)

This document outlines the content strategy for the redesigned deScier landing page, using a high-converting layout. All text is derived from existing platform documentation and design notes.

---

## 1. Navbar

- Logo: deScier Logo (redesigned)
- Links: (To be defined after final website structure)
- Primary CTA: `Publish Now`

---

## 2. Hero Area

- Tagline: `Decentralized Science Publishing`
- Headline: `Own 100% of Your Research. Publish with Confidence.`
- Sub-headline (problem / value): `The blockchain-native publishing platform for researchers. Retain full copyright via NFT ownership, get published faster through a transparent peer-review, and leave the $26 billion legacy publishing industry behind.`
- Primary CTA: `Publish Now`
- Secondary CTA: `Explore Papers`
- Note: Keep the search functionality in the hero area (as currently implemented).
- Visual: A clean, professional screenshot of an article published on deScier that highlights the layout and impact metrics.

---

## 3. Social Proof / Trusted by

- Headline: `Trusted by the Pioneers of Decentralized Science`
- Sub-headline: `Our platform and advisory board include distinguished researchers, technologists, and publishing experts dedicated to building a better future for science.`
- Logos: Keep the existing journals carousel and consider adding logos of affiliated institutions or advisory board members' organizations if applicable.

---

## 4. Benefits (Focus on Outcomes)

- Headline: `An Ecosystem Built for Researchers, Not for Profit.`
- Sub-headline: `We built deScier to solve the biggest problems in academic publishing. Here’s what that means for you.`

- Grid of benefits (bento boxes):

  - **Benefit 1 — Guarantee Your Ownership with NFTs**
    - Text: Your work is yours. Forever. We use NFT technology to provide immutable, verifiable proof of ownership, giving you full control over your intellectual property. `(Source: technical-documentation.md)`

  - **Benefit 2 — Accelerate Your Publication Timeline**
    - Text: Our streamlined and transparent peer-review process eliminates the bureaucratic delays of traditional journals, getting your research to the world faster. `(Source: user-guide.md)`

  - **Benefit 3 — Escape Exorbitant Publishing Fees**
    - Text: Legacy publishers can charge up to $6,000 per paper. Our model is built to be economically viable and accessible, removing financial barriers to knowledge sharing. `(Source: platform-overview.md)`

  - **Benefit 4 — Measure Your True Impact**
    - Text: Go beyond simple citations. See how your work is being read, shared, and discussed with a real-time dashboard tracking likes, downloads, and engagement. `(Source: team-community.md)`

  - **Benefit 5 — Earn from Your Contributions**
    - Text: Our author-centric model fairly compensates you for your intellectual contributions. Royalties are distributed transparently based on authorship percentages. `(Source: user-guide.md)`

  - **Benefit 6 — Grow with Constructive Peer Review**
    - Text: Our review process is a growth opportunity. Receive expert, constructive feedback in a collaborative environment designed to improve your work and advance your career. `(Source: user-guide.md)`

---

## 5. How It Works (Three Simple Steps)

- Headline: `From Manuscript to Immutable Record in 3 Steps`

  - **Step 1: Submit Your Manuscript**
    - Text: Upload your manuscript in `.docx` format. Our editorial team provides full support with formatting and layout to ensure a professional result. `(Source: user-guide.md)`

  - **Step 2: Engage in Transparent Peer Review**
    - Text: Track your submission’s status in real-time from your author dashboard and communicate directly with reviewers in a constructive, collaborative environment. `(Source: user-guide.md)`

  - **Step 3: Publish, Own, and Earn**
    - Text: Once accepted, your article is published and minted as an NFT that you own. Your research is now a permanent, verifiable contribution to science that you control and can earn from. `(Source: technical-documentation.md)`

---

## 6. Latest Papers (Dynamic Proof)

- Headline: `Explore the Latest Research`

- Behavior / copy taken from `components/pages/Home/Home.tsx`:
  - While loading: show article skeleton placeholders.
  - Empty state text: `There are no articles under review at the moment.`
  - Responsive count: display up to 8 articles on large screens (`lg`) and 3 on smaller screens.
  - Each article card displays: authors, image, likes, tags, title, journal, views and document type.
  - CTA text: `View all papers` (prefetches and navigates to the search page).

---

## 7. Pricing

- Headline: `A Fair and Transparent Model`
- Text: We charge **no fees to submit** a manuscript. A single publication fee is required only *after* your manuscript has been accepted for peer review. **70% of this fee directly compensates** the editors and reviewers from our community. The rest covers platform operations.
- CTA: `Publish Now`

---

## 8. Testimonials

- Headline: `What Our Authors Are Saying`
- Sub-headline: `Researchers from around the world are choosing a better way to publish.`
- (Placeholder for 2-3 short, powerful quotes from authors. Each should include Name, Title, and Institution).
  - **Example Quote Block:**
    - *"The transparency of the review process was a breath of fresh air. Knowing I retained 100% of my copyright was the deciding factor."*
    - **Dr. Jane Doe, Professor of Astrophysics, University of Cambridge**

---

## 9. Final CTA

- Headline: `Join the Movement for Open Science`
- Text: Be part of a paradigm shift in scientific publishing. Publish your work with complete ownership, get the recognition you deserve, and help build a more open and equitable future for research. `(Source: team-community.md)`
- Primary CTA: `Publish Your Paper Now`
- Secondary CTA: `Learn More` (Links to Docs/Whitepaper)

---

## 10. FAQ

- Headline: `Frequently Asked Questions`

- **Q1: How do I really own 100% of my copyright?**
  - A: Your published article is minted as a unique Non-Fungible Token (NFT) on the blockchain. You own this token, providing immutable and publicly verifiable proof of ownership that you completely control. `(Source: technical-documentation.md)`

- **Q2: What are the publication fees?**
  - A: There are no fees to submit. A single publication fee is charged only *after* your manuscript is accepted for peer review. 70% of this fee goes directly to the editors and reviewers. `(Source: user-guide.md)`

- **Q3: How does the peer review process work?**
  - A: Our process is designed for transparency and constructive feedback. You can track every stage from your dashboard and communicate directly with reviewers in a collaborative environment. `(Source: user-guide.md)`

- **Q4: Do I need to understand crypto to use deScier?**
  - A: Not at all. Our platform handles all the technical complexity. You can focus on your research while we seamlessly manage the blockchain integration behind the scenes.

- **Q5: Can I launch my own journal on the platform?**
  - A: Yes. We empower researchers to launch specialized journals, build communities of authors and reviewers, and manage their own decentralized publications.

---

## 11. Footer

- Structure: 4-column layout.

- **Column 1 — Brand**
  - deScier Logo (redesigned)
  - Mission Snippet: `Science belongs to humanity.`
  - Copyright: `© 2024 deScier. All rights reserved.`

- **Column 2 — Social Media**
  - Links to be sourced from `mock/footer_items.ts` (e.g., Twitter, Telegram, Discord).

- **Column 3 — Links**
  - Links to be sourced from `mock/footer_items.ts` (e.g., Home, Search, Documentation).

- **Column 4 — Contact**
  - WhatsApp: link to WhatsApp (redesigned)
  - E-mail: `publishing@descier.science`