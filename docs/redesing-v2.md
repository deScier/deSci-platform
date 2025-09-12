## 1. Navbar

- Logo: DeSci Reviews Logo (redesigned)
- Links: (To be defined after final website structure)
- Primary: Create your scientific journal
- Secondary CTA: submit your paper
- 3rd CTA: for individuals & organizations
- 4th CTA: don’t see a journal for your field? create one now and lead the way!

---

## 2. Hero Area

- Tagline: `Publish. Own 100%. Earn.`
- Headline: `Keep Your Rights. Build Authority. Get Rewarded.`
- Sub-headline (problem / value): `Own 100% of your work with on-chain proof, publish faster with transparent peer review, and pay fair, flat fees—turn your work into a real career asset.`
- Primary CTA: `Submit Your Work`
- Secondary CTA: `Learn how to create authority`
- Note: Keep the search functionality in the hero area (as currently implemented).
- Visual: A clean, professional screenshot of an article and a journal cover on DeSci Reviews highlighting layout and impact metrics.

---

## 3. Social Proof / Trusted by

- Headline: `Trusted by the Pioneers of Decentralized Science`
- Sub-headline: `Built for trailblazing authors, entrepreneurs, and cutting-edge leaders committed to ownership, fairness, and visibility.`
- Logos: Keep the existing journals carousel and consider adding logos of affiliated institutions or advisory board members' organizations if applicable.

---

## 4. Benefits (Focus on Outcomes)

- Headline: `Authority. credibility. publications as assets`
- Sub-headline: `Stop giving away your rights. here’s what you get.`
- Grid of benefits (bento boxes):
    - **Benefit 1 — Own your copyright**
        - Text: Keep 100% rights with permanent, verifiable ownership. your publication: your control.
    - **Benefit 2 — Pay Fair, Flat Fees**
        - Text: Why pay $2k–$12k on legacy journals? our journals range from $50-100 flat submission fees, remove barriers and include revenue share for all authors.
    - **Benefit 3 — Prove Real Impact**
        - Text: Go beyond impact factor. show real impact through likes, reads, shares, comments and citations to signal credibility.
    - **Benefit 4 — Get badges for your work**
        - Text: Turn projects into career assets. gain credibility and authority.
    - **Benefit 5 — Publish Faster with Transparent Review**
        - Text: Track status in real time, see open feedback, cut the delays and opaque reviews.
    - **Benefit 6 — Grow with DeSci spotlight**
        - Text: Feature and promote your publication on DeSci spotlight channels across all major social networks.

---

## 5. How It Works

### For Creating a Journal

- Headline: `From idea to journal in 3 steps`
    - **Step 1: Submit Your Journal**
        - Text: Choose a clear and inspiring title for your journal.
    - **Step 2: Upload Your Journal Cover**
        - Text: Stand out with a cover that attracts authors and readers.
    - **Step 3: Publish, Own, and Earn**
        - Text: Submit for approval even without an editorial board: we can serve as your board until you build your own.

### For Submitting an Article

- Headline: `From manuscript to publication in 3 steps`
    - **Step 1: Submit Your Manuscript**
        - Text: Upload your .docx in one simple flow. no formatting needed. some journals are free, others charge only a small submission fee. We help with formatting for a professional result.
    - **Step 2: Engage in Transparent Peer-Review**
        - Text: Reviews are open and timestamped. track every stage and communicate directly with reviewers.
    - **Step 3: Publish, Own, and Earn**
        - Text: Upon acceptance, your article is published, indexed with permanent links, and you retain 100% of your copyright to build authority and credibility.

---

## 6. Latest Papers (Dynamic Proof)

- Headline: `Explore the latest papers`
- Behavior / copy taken from `components/pages/Home/Home.tsx`:
    - While loading: show article skeleton placeholders.
    - Empty state text: `There are no articles under review at the moment.`
    - Responsive count: display up to 8 articles on large screens (`lg`) and 3 on smaller screens.
    - Each article card displays: authors, image, likes, tags, title, journal, views and document type.
    - CTA text: `View all papers` (prefetches and navigates to the search page).

---

## 7. Pricing

- Headline: `Fair, Transparent Pricing`
- Text: 
**Authors**: publish smarter, not pricier. pay only $50–$100 after acceptance - up to 10x cheaper than legacy journals. choose fiat or crypto, split into installments, and know your fees reward editors and reviewers. bonus: some journals are free. **Publishers**: right now, creating your own journal on our platform is completely free for individuals and organizations. no setup fees, no hidden costs. this is a limited-time opportunity. start your journal today while it’s free and secure your place at the forefront of decentralized publishing.
- CTA 1: Create your journal.
- CTA 2: Submit your manuscript

---

## 8. Testimonials

- Headline: `What authors and publishers are saying`
- Sub-headline: Students, entrepreneurs, and publishers are embracing our model as a fairer way to publish: keeping 100% of their rights while gaining ownership, authority, and credibility.
- (Placeholder for 2-3 short, powerful quotes from authors. Each should include Name, Title, and Institution).
    - **Example Quote Block:**
        - *"The open review and full ownership flipped the experience. It finally felt fair."*
        - **Dr. Jane Doe, Professor of Astrophysics, University of Cambridge**

---

## 9. Final CTA

- Headline: Take control of your publishing journey
- Text: Whether you’re a publisher ready to launch your own journal or an author eager to publish your work, desci.reviews gives you the tools to keep 100% of your rights, build authority, and gain credibility. publishing has never been this fair, fast, and sovereign.
- Primary CTA: `Create your journal today`
- Secondary CTA: publish your article now. Tertiary CTA: Learn more (Links do Docs/ Whitepaper) Text: [**desci.reviews](http://desci.reviews) empowering knowledge creators everywhere**

---

## 10. FAQ

- Headline: `Frequently Asked Questions`
- **1. why should i publish here instead of a traditional journal?**
traditional journals take all your rights and charge thousands in fees. with desci.reviews, you keep 100% of your ownership, publish for a fraction of the cost, and build visibility, authority, and credibility right away.
- **2. i’m a first-time author, will my work be respected?**
yes. every paper is peer-reviewed to ensure quality and recognition. your work also receives a permanent, verifiable record, a proof that you are the original author, boosting your career and professional reputation. using DeSci Spotlight your publication can also be promoted on social media.
- **3. how much does it cost to publish?**
most journals charge only $50–$100 after acceptance, which is about 10x less than traditional journals. some journals are free. you can even pay in installments to make it easier.
- **4. can i really create my own journal?**
absolutely. any individual or organization can launch a journal with us at no cost (for a limited time). you set the rules, attract authors, and grow a community around your area of knowledge while building authority for yourself and your organization.
- **5. do i need to worry about technical setups or complicated tools?**
no. the process is simple and user-friendly: just upload your document, follow an intuitive submission flow, and you’re done. everything runs seamlessly in the background so you can focus on your work, not the tech.

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
        - X (Twitter) — https://x.com/desciers
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
- Brand
    - DeSci Reviews Logo (redesigned)
    - Mission Snippet: `Empowering knowledge creators everywhere`
    - Copyright: `© 2025 DeSci Reviews. All rights reserved.`
    - Tagline: `Powered by web3`
    - **Contact Information:**
        - WhatsApp:`+1 (303) 525-7908`
        - Email: `publishing@descier.science`

Notes: DeSci Reviews is a decentralized publishing house where authors publish, own 100%, and earn. The platform documents smart contracts, workflow automation, and tokenomics that automate publishing and rewards; DeSci Reviews does not operate or control any DAO, smart contracts, or blockchain networks where those contracts may be deployed. For author support and publishing inquiries, contact `publishing@descier.science`.