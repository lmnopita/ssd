# Seattle Sensitive Dogs — website

Static marketing site for **Seattle Sensitive Dogs** — private, force-free dog walking for fearful, reactive, and sensitive dogs in North Seattle. Plain HTML/CSS/vanilla JS, no build step, deployed on GitHub Pages at **seattlesensitivedogs.com**.

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Home |
| `services.html` | Services & Pricing |
| `about.html` | About Lily |
| `faq.html` | FAQ (with `FAQPage` structured data) |
| `contact.html` | Contact + Formspree form |
| `404.html` | Not-found page (GitHub Pages serves this automatically) |

## Structure

- `css/styles.css` — the full design system (brand tokens, components). Documented with a section index and inline "markup contract" comments.
- `js/main.js` — mobile nav, FAQ accordion, footer year, Formspree AJAX submit, scroll-reveal. All progressive enhancement: the site works fully with JS disabled.
- `images/` — logos + favicons. **`images/dogs/`** is where photos of Lily with dogs go (see PHOTO-SLOT comments in `about.html` and `index.html`).
- `CONTENT.md` — the working copy document (draft copy + `DRAFT-REVIEW` notes). Used for the copy work session.
- `PRODUCT.md` — internal design/brand brief.

## Things to finalize before / around launch

Search the code for **`DRAFT-REVIEW`** to find every value that needs Lily's sign-off (pricing numbers, cert wording, weather/home-access/cancellation policies).

- **Pricing** (`services.html`): Meet-and-Greet $35 is set; weekly tiers ($45 / $42) are drafts.
- **Testimonials** (`index.html`): honest "Client story coming soon" placeholders. Replace the `<!-- PLACEHOLDER -->` blocks with real quotes before launch — do not ship fabricated quotes.
- **Booking**: every "Book a Meet-and-Greet" button has class `js-booking-cta` and currently points to `contact.html`. When the Stripe Payment Link exists, update those hrefs (search `js-booking-cta`) — see the `BOOKING_URL` comment in the header.
- **Credentials**: the About and FAQ pages state transparently that the business is not yet licensed/bonded/insured and that certifications are in progress. Update that wording (and the FAQ JSON-LD in `faq.html`) as each item is completed.

## SEO / AEO

- Per-page `<title>`, meta description, canonical, Open Graph + Twitter cards.
- Structured data: `LocalBusiness` (home), `Service` (services), `Person` (about), `FAQPage` (faq), `ContactPage` (contact). **No ratings or credentials are claimed** — add an `aggregateRating` only once real reviews exist.
- `sitemap.xml`, `robots.txt`, `llms.txt` (plain-language summary for AI answer engines).
- If you edit a visible FAQ answer, update the matching answer in the `FAQPage` JSON-LD so they stay in sync.

## Deploy (GitHub Pages)

1. Repo → **Settings → Pages** → Source: `main` / root.
2. `CNAME` (contains `seattlesensitivedogs.com`) sets the custom domain.
3. DNS at the domain registrar:
   - Four `A` records for the apex → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - One `CNAME` record: `www` → `lmnopita.github.io`
4. Once DNS resolves, enable **Enforce HTTPS** in Settings → Pages.

## Local preview

```bash
python3 -m http.server 8137
# then open http://localhost:8137/index.html
```
