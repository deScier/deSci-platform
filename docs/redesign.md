# Landing Page Redesign: Content Guide

This document outlines the content strategy for the redesigned deScier landing page, using a high-converting layout. All text is derived from existing platform documentation and design notes.

---

## 1. Navbar

- Logo: deScier Logo (redesigned)
- Links: (to be defined after final website structure)
- Primary CTA: `Publish now`

---

## 2. Hero Area

- Tagline: `Decentralized Science Publishing`
- Pre-headline (social proof): `Join a global community of researchers and institutions`
- Headline: `Own Your Research. Redefine Publishing.`
- Sub-headline (problem / value): `The first blockchain-enabled platform that combines rigorous peer review with 100% copyright retention via NFT ownership. Stop giving away your rights and paying exorbitant fees.`
- Primary CTA: `Publish now`
- Secondary CTA: `Search papers`
- Note: Keep the search functionality in the hero area (as currently implemented).
- Optional visual: a clean, professional screenshot of an article published on deScier that highlights layout and impact metrics.

---

## 3. Partners / Logos Strip

- Headline: `Trusted by the pioneers of Decentralized Science`
- Keep the existing journals carousel.

---

## 4. Benefits (Focus on Outcomes)

- Headline: `The Future of Publishing is Author-Centric.`
- Sub-headline: `We built deScier to solve the biggest problems in academic publishing. Here’s what you get.`

Grid of benefits (bento boxes):

- Benefit 1 — Keep 100% of Your Copyright
	- Text: Your work is yours. Forever. We use NFT technology to guarantee your ownership, giving you full control over your intellectual property.

- Benefit 2 — Get Published Faster
	- Text: Our streamlined and transparent peer-review process gets your research to the world faster than traditional, bureaucratic journals.

- Benefit 3 — Publish Economically
	- Text: Say goodbye to the exorbitant fees of legacy publishers. Our model is built to be affordable and accessible to researchers worldwide.

- Benefit 4 — Track Your Impact in Real Time
	- Text: Go beyond simple citations. See how your work is being read, shared, and discussed with our real-time impact metrics dashboard.

- Benefit 5 — Earn From Your Contributions
	- Text: Our author-centric economic model ensures you are fairly compensated for your intellectual contributions and the value you bring to the community.

- Benefit 6 — Receive Constructive, Quality Feedback
	- Text: Our peer-review process is a growth opportunity. Receive expert, constructive feedback to improve your work and advance your career.

---

## 5. How It Works (Three Simple Steps)

- Headline: `From Manuscript to Immutable Record in Three Steps`

- Step 1: Submit Your Manuscript
	- Text: Upload your manuscript in `.docx` format. Don’t worry about complex formatting; our editorial team provides support to ensure a professional layout.

- Step 2: Transparent Peer Review
	- Text: Engage in a constructive, open review process. Track your submission status in real time and communicate directly with reviewers.

- Step 3: Publish, Own, and Earn
	- Text: Once accepted, your article is published and minted as an NFT you own. Your research becomes a permanent, verifiable contribution to science that you control.

---

## 6. Latest Papers

- Headline: `Latest papers`

- Behavior / copy taken from `components/pages/Home/Home.tsx`:
	- While loading: show article skeleton placeholders.
	- Empty state text: `There are no articles under review at the moment.`
	- Responsive count: display up to 8 articles on large screens (`lg`) and 3 on smaller screens.
	- Each article card displays: authors, image, likes, tags, title, journal, views and document type.
	- CTA text: `View all papers` (prefetches and navigates to the search page).

- Banner / CTA:
	- After the list, show a prominent banner with a primary action `Publish now` which opens the publishing flow (login/register if necessary).

- Notes for implementation:
	- Keep the grid layout and vertical/horizontal dividers on large screens for visual separation.
	- Preserve the behavior of showing skeletons while `loading` is true and the exact empty-state sentence above.

---

## 7. FAQ

- Headline: `Your Questions, Answered`

- Q1: How do I really keep 100% of my copyright?
	- A: Your published article is minted as a unique Non-Fungible Token (NFT) on the blockchain, and you are the owner of that token. This provides an immutable, publicly verifiable proof of ownership that you control completely.

- Q2: What are the publication fees?
	- A: There are no fees to submit a manuscript. A single publication fee is charged only *after* your manuscript has been accepted for peer review. 70% of this fee goes directly to the editors and reviewers from the community.

- Q3: How does the peer review process work?
	- A: Our process is designed for transparency and constructive feedback. You can track every stage from your author dashboard and communicate directly with reviewers in a collaborative environment.

- Q4: Do I need to be a blockchain expert to use deScier?
	- A: Not at all. Our platform handles all the technical complexity behind the scenes. You can focus on your research while we manage the blockchain integration.

- Q5: Can I create my own journal on the platform?
	- A: Yes. We empower researchers to launch specialized journals, build a community of authors and reviewers, and manage their own decentralized publications.

---

## 8. Final CTA

- Headline: `Ready to Revolutionize Your Research?`
- Text: Join the movement for a more open, equitable, and author-centric future for science. Publish your work with complete ownership and earn from your intellectual contributions.
- CTA: `Publish Your Paper Now`

---

## 9. Footer

- Structure: 4-column layout.

- Column 1 — Brand
	- deScier Logo (redesigned)
	- Copyright: `© 2024 deScier. All rights reserved.`
	- Tag: `Powered by web3`

- Column 2 — Social Media
	- Links to be sourced from `mock/footer_items.ts` (e.g., Twitter, Telegram, Discord).

- Column 3 — Links
	- Links to be sourced from `mock/footer_items.ts` (e.g., Home, Search, Documentation).

- Column 4 — Contact
	- WhatsApp: link to WhatsApp (redesigned)
	- E-mail: `publishing@descier.science`

---

## Notes & Implementation Guidance

- Keep the hero search and article skeleton behavior aligned with current components (`components/pages/Home/Home.tsx`).
- Preserve the journals carousel and partner logos.
- Maintain exact empty-state sentence for the latest papers section to match UX expectations.

