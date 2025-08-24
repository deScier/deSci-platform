# Landing Page Redesign: Content Guide (Revised)

This document defines concise, high-impact copy for the DeSci Reviews landing page using a proven, conversion-focused layout. All text reflects the positioning and insights in docs/content.md.

---

## 1. Navbar

- Logo: DeSci Reviews Logo (redesigned)
- Links: (To be defined after final website structure)
- Primary CTA: `Submit Your Work`

---

## 2. Hero Area

- Tagline: `Publish. Own 100%. Earn.`
- Headline: `Keep Your Rights. Build Authority. Get Rewarded.`
- Sub-headline (problem / value): `Own 100% of your work with on-chain proof, publish faster with transparent peer review, and pay fair, flat fees—turn your work into a real career asset.`
- Primary CTA: `Submit Your Work`
- Secondary CTA: `Learn How It Works`
- Note: Keep the search functionality in the hero area (as currently implemented).
- Visual: A clean, professional screenshot of an article on DeSci Reviews highlighting layout and impact metrics.

---

## 3. Social Proof / Trusted by

- Headline: `Trusted by the Pioneers of Decentralized Science`
- Sub-headline: `Built with researchers, technologists, and publishing leaders committed to open, fair, and transparent science.`
- Logos: Keep the existing journals carousel and consider adding logos of affiliated institutions or advisory board members' organizations if applicable.

---

## 4. Benefits (Focus on Outcomes)

- Headline: `Built for Authors, Not Gatekeepers.`
- Sub-headline: `We fix the biggest problems in publishing. Here’s what you get.`

- Grid of benefits (bento boxes):

  - **Benefit 1 — Own 100%—On-Chain**
    - Text: Keep full rights with immutable, verifiable ownership. Your publication mints as an NFT you control.

  - **Benefit 2 — Publish Faster with Transparent Review**
    - Text: Track status in real time, see open feedback, and cut the delays of opaque review.

  - **Benefit 3 — Pay Fair, Flat Fees**
    - Text: Avoid $2k–$12k legacy APCs. Our low, transparent fee removes barriers and includes revenue share.

  - **Benefit 4 — Prove Real Impact**
    - Text: Go beyond citations. Show reads, shares, and on-chain reputation to signal credibility.

  - **Benefit 5 — Earn for Your Work**
    - Text: Royalties and token rewards (revnets) flow transparently based on authorship and contributions.

  - **Benefit 6 — Grow with Constructive Peer Review**
    - Text: Get expert, public feedback that improves your work and builds your authority.

---

## 5. How It Works (Three Simple Steps)

- Headline: `From Manuscript to On‑Chain Asset in 3 Steps`

  - **Step 1: Submit Your Manuscript**
    - Text: Upload `.docx` in a simple, wallet-optional flow. We help with formatting for a professional result.

  - **Step 2: Engage in Transparent Peer Review**
    - Text: Reviews are open and timestamped on-chain. Track every stage and communicate directly with reviewers.

  - **Step 3: Publish, Own, and Earn**
    - Text: Upon acceptance, your article is published and minted as an NFT you own—permanent, verifiable, and monetizable.

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

- Headline: `Fair, Transparent Pricing`
- Text: We charge **no fees to submit**. A single flat publication fee is required only *after* acceptance for peer review. **70% of this fee goes directly** to editors and reviewers; the rest sustains the platform.
- CTA: `Submit Your Work`

---

## 8. Testimonials

- Headline: `What Our Authors Are Saying`
- Sub-headline: `Researchers, students, and creators are choosing a better way to publish.`
- (Placeholder for 2-3 short, powerful quotes from authors. Each should include Name, Title, and Institution).
  - **Example Quote Block:**
    - *"The open review and full ownership flipped the experience. It finally felt fair."*
    - **Dr. Jane Doe, Professor of Astrophysics, University of Cambridge**

---

## 9. Final CTA

- Headline: `Join the Movement for Open Science`
- Text: Publish with full rights, build authority, and help make science open, fair, and sustainable.
- Primary CTA: `Submit Your Work`
- Secondary CTA: `Learn More` (Links to Docs/Whitepaper)

---

## 10. FAQ

- Headline: `Frequently Asked Questions`

- **Q1: Do I really keep 100% of my rights?**
  - A: Yes. Your article is minted on-chain as a unique NFT you own—public, timestamped, and verifiable. You control licensing.

- **Q2: What are the publication fees?**
  - A: No submission fees. A single flat fee applies only after acceptance for peer review, with 70% paid directly to reviewers and editors.

- **Q3: How does the peer review process work?**
  - A: Reviews are open by default, with identities and reports transparent. Track every stage from your dashboard and collaborate with reviewers.

- **Q4: Do I need to understand crypto to use the platform?**
  - A: No. The flow is simple and wallet-optional. You can publish like any web app and connect blockchain features when you’re ready.

- **Q5: Can I launch my own journal on the platform?**
  - A: Yes. Create specialized journals, build communities of authors and reviewers, and run decentralized publications with full ownership.

---

## 11. Footer

- Structure: 4-column layout (group headings and quick links).

- Column groups (adapted for DeSci Reviews):

- Resources | Community & Social | Company | Brand

- Resources
  - Home — `/` (platform home page)
  - Documentation — `docs/technical-documentation.md` (whitepaper, architecture, governance)
  - Platform Overview — `docs/platform-overview.md`
  - User Guide — `docs/user-guide.md` (submission, review, publishing workflow)
  - Team & Community — `docs/team-community.md`
  - FAQ — (See `docs/user-guide.md` or `docs/organized/03-user-guides/`)
  - Help & Support — contact `publishing@descier.science`

- Community & Social
  - **Social Media:**
    - X (Twitter) — `https://twitter.com/desci_reviews` (@desci_reviews)
    - Discord — `https://discord.com/invite/Z6U9P28YtV` (Community)
  - **Developer Resources:**
    - Technical Paper (Whitepaper) — `docs/technical-documentation.md#whitepaper`
    - API & Integrations — `docs/technical-documentation.md#api-access`
    - Security & Hardening — `docs/technical-documentation.md#security-measures`
    - Report Vulnerability / Bug Bounty — contact `publishing@descier.science` (TBD)

- Company
  - Privacy Policy — `https://desci.reviews/policy/` (TBD for platform-specific)
  - Terms of Use — `https://desci.reviews/terms/` (TBD for platform-specific)
  - Contact — `publishing@descier.science` (primary)
  - Careers — (TBD)

- Brand
  - DeSci Reviews Logo (redesigned)
  - Mission Snippet: `Science belongs to its creators.`
  - Copyright: `© 2024 DeSci Reviews. All rights reserved.`
  - Tagline: `Powered by web3`
  - **Contact Information:**
    - WhatsApp: `+55 11 98343-2131` / `+1 (303) 525-7908`
    - Email: `publishing@descier.science`

Notes

DeSci Reviews is a decentralized publishing house where authors publish, own 100%, and earn. The platform documents smart contracts, workflow automation, and tokenomics that automate publishing and rewards; DeSci Reviews does not operate or control any DAO, smart contracts, or blockchain networks where those contracts may be deployed. For author support and publishing inquiries, contact `publishing@descier.science`.

