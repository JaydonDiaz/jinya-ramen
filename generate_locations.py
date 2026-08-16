#!/usr/bin/env python3
"""Generate individual location pages + locations.html grid markup from locations-data.json.
Run from the jinya-ramen project root: python3 generate_locations.py
"""
import json
import re
import os

ROOT = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(ROOT, "locations-data.json")) as f:
    locations = json.load(f)

REGION_LABEL = {
    "west": "West", "southwest": "Southwest", "mountain": "Mountain",
    "texas": "Texas", "midwest": "Midwest", "southeast": "Southeast",
    "mid-atlantic": "Mid-Atlantic", "canada": "Canada",
}

# ---- location card markup for locations.html ----
def location_card_html(loc):
    if loc["status"] == "open":
        badge = '<span class="location-badge">Open Now</span>'
        card_class = "location-card"
    else:
        badge = '<span class="location-badge soon">Coming Soon</span>'
        card_class = "location-card coming-soon"
    phone_html = f'<div class="location-phone"><a href="tel:{re.sub(r"[^0-9]", "", loc["phone"])}">{loc["phone"]}</a></div>' if loc.get("phone") else ''
    link = f'<a href="locations/{loc["slug"]}.html" class="location-link">View Details <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg></a>'
    return f'''        <div class="{card_class} reveal-up" data-region="{loc['region']}">
          {badge}
          <div class="location-name">{loc['name']}</div>
          <div class="location-addr">{loc['street']}<br>{loc['cityline']}</div>
          {phone_html}
          {link}
        </div>
'''

cards_html = ''.join(location_card_html(l) for l in locations)
with open(os.path.join(ROOT, "_locations_cards.html"), "w") as f:
    f.write(cards_html)
print(f"Wrote {len(locations)} location cards to _locations_cards.html")

# ---- individual location page template ----
PAGE_TEMPLATE = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="icon" type="image/svg+xml" href="https://jinyaramenbar.b-cdn.net/cms/wp-content/themes/jinyaramenbar/images/jinya_logo.svg">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{name} — JINYA Ramen Bar</title>
  <meta name="description" content="JINYA Ramen Bar {name} — {street}, {cityline}. Authentic Japanese ramen, slow-simmered broths, and handmade noodles.">
  <link rel="preconnect" href="https://use.typekit.net">
  <link rel="stylesheet" href="https://use.typekit.net/aog7svi.css">
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>

  <!-- ===== NAV ===== -->
  <nav id="nav" class="nav scrolled">
    <div class="container nav-inner">
      <a href="../index.html" class="nav-logo">
        <img src="https://jinyaramenbar.b-cdn.net/cms/wp-content/themes/jinyaramenbar/images/jinya_logo.svg" alt="JINYA Ramen Bar" class="logo-img">
      </a>
      <ul class="nav-links">
        <li><a href="../menu.html" class="nav-link">Menu</a></li>
        <li><a href="../locations.html" class="nav-link active">Locations</a></li>
        <li><a href="../about.html" class="nav-link">About Us</a></li>
        <li><a href="../franchise.html" class="nav-link">Franchise</a></li>
        <li><a href="../rewards.html" class="nav-link">Rewards</a></li>
        <li><a href="../careers.html" class="nav-link">Careers</a></li>
        <li><a href="../press.html" class="nav-link">Press</a></li>
        <li><a href="../contact.html" class="nav-link">Contact</a></li>
      </ul>
      <a href="https://orderjinya.com/" target="_blank" rel="noopener" class="btn btn-primary btn-sm nav-cta">Order Now</a>
      <button class="hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <!-- Mobile Menu -->
  <div class="mobile-menu" id="mobile-menu" aria-hidden="true">
    <div class="mobile-menu-inner">
      <ul>
        <li><a href="../menu.html" class="mobile-link">Menu</a></li>
        <li><a href="../locations.html" class="mobile-link">Locations</a></li>
        <li><a href="../about.html" class="mobile-link">About Us</a></li>
        <li><a href="../franchise.html" class="mobile-link">Franchise</a></li>
        <li><a href="../rewards.html" class="mobile-link">Rewards</a></li>
        <li><a href="../careers.html" class="mobile-link">Careers</a></li>
        <li><a href="../press.html" class="mobile-link">Press</a></li>
        <li><a href="../contact.html" class="mobile-link">Contact</a></li>
      </ul>
      <a href="https://orderjinya.com/" target="_blank" rel="noopener" class="btn btn-primary btn-full mobile-cta">Order Now</a>
    </div>
  </div>

  <!-- ===== LOCATION HERO ===== -->
  <section class="location-hero">
    <div class="container location-hero-inner">
      <span class="eyebrow reveal-up">{status_label}</span>
      <h1 class="reveal-up" style="font-size:clamp(32px, 5vw, 52px);font-weight:700;text-transform:uppercase;margin:8px 0 14px;color:#f5f5f5;">JINYA Ramen Bar <span class="text-red">{name}</span></h1>
      <p class="reveal-up" style="font-size:16px;color:#8c8c8c;max-width:560px;">{hero_desc}</p>

      <div class="location-detail-grid">
        <div class="location-info-block reveal-left">
          <div class="location-info-row">
            <div class="location-info-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
            <div><div class="location-info-label">Address</div><div class="location-info-value">{street}<br>{cityline}</div></div>
          </div>
          {phone_row}
          <div class="location-info-row">
            <div class="location-info-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>
            <div><div class="location-info-label">Order Online</div><div class="location-info-value"><a href="https://orderjinya.com/" target="_blank" rel="noopener">orderjinya.com</a></div></div>
          </div>
        </div>
        <div class="location-info-block reveal-right">
          <div class="location-info-label" style="margin-bottom:16px;">Hours</div>
          <table class="location-hours-table">
            {hours_rows}
          </table>
          {note_html}
        </div>
      </div>
    </div>
  </section>

  <!-- ===== CTA ===== -->
  <section class="cta-section" style="padding:90px 0;">
    <div class="container">
      <div class="cta-inner">
        <span class="eyebrow reveal-up">Ready to Eat?</span>
        <h2 class="cta-title reveal-up" style="font-size:clamp(32px, 5vw, 56px);">See You <span class="text-red">Soon</span></h2>
        <p class="cta-sub reveal-up">Explore our full menu or find another location near you.</p>
        <div class="cta-actions reveal-up">
          <a href="../menu.html" class="btn btn-primary btn-lg">View Menu</a>
          <a href="../locations.html" class="btn btn-outline btn-lg">All Locations</a>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== FOOTER ===== -->
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <img src="https://jinyaramenbar.b-cdn.net/cms/wp-content/themes/jinyaramenbar/images/jinya_logo.svg" alt="JINYA Ramen Bar" class="footer-logo-img">
          <p class="footer-tagline">Slow-simmered broths, handmade noodles, and authentic Japanese ramen culture. We're crazy about ramen.</p>
          <div class="social-row" style="margin-top:20px;">
            <a href="https://facebook.com/JinyaRamenBar" target="_blank" rel="noopener" class="social-btn" aria-label="Facebook"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
            <a href="https://instagram.com/jinyaramenbar" target="_blank" rel="noopener" class="social-btn" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
            <a href="https://tiktok.com/@jinyaramenbar" target="_blank" rel="noopener" class="social-btn" aria-label="TikTok"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z"/></svg></a>
          </div>
        </div>
        <div>
          <div class="footer-heading">Explore</div>
          <div class="footer-links">
            <a href="../menu.html">Menu</a>
            <a href="../locations.html">Locations</a>
            <a href="../about.html">About Us</a>
            <a href="../rewards.html">Rewards</a>
          </div>
        </div>
        <div>
          <div class="footer-heading">Company</div>
          <div class="footer-links">
            <a href="../franchise.html">Franchise</a>
            <a href="../careers.html">Careers</a>
            <a href="../press.html">Press</a>
            <a href="../contact.html">Contact Us</a>
          </div>
        </div>
        <div>
          <div class="footer-heading">Corporate Office</div>
          <div class="footer-links">
            <span style="font-size:14px;color:rgba(245,245,245,0.65);line-height:1.7;display:block;">21045 Erwin Street, Suite 1A<br>Woodland Hills, CA 91367</span>
            <a href="tel:3239302477">(323) 930-2477</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span class="footer-copy">&copy; JINYA Holdings, Inc. All Rights Reserved.</span>
        <div class="footer-legal">
          <a href="../privacy-policy.html">Privacy Policy</a>
          <a href="../nutritional-information.html">Nutrition</a>
          <a href="../sitemap.html">Sitemap</a>
          <a href="../accessibility-statement.html">Accessibility Statement</a>
          <a href="../your-privacy-choices.html">Your Privacy Choices</a>
          <a href="../opt-out-preferences.html">Opt-Out Preferences</a>
        </div>
      </div>
    </div>
  </footer>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="../js/main.js"></script>
</body>
</html>
'''

def hours_rows_html(loc):
    if not loc.get("all_hours"):
        return '<tr><td colspan="2" style="color:var(--muted);">Hours coming soon</td></tr>'
    # Split "Mon–Thu 11am–10pm; Fri–Sat 11am–11pm; Sun 11am–10pm" into rows
    parts = [p.strip() for p in loc["all_hours"].split(';')]
    rows = []
    for p in parts:
        m = re.match(r'^(.+?)\s+(\d.+)$', p)
        if m:
            rows.append(f'<tr><td>{m.group(1)}</td><td>{m.group(2)}</td></tr>')
        else:
            rows.append(f'<tr><td colspan="2">{p}</td></tr>')
    return ''.join(rows)

locations_dir = os.path.join(ROOT, "locations")
os.makedirs(locations_dir, exist_ok=True)

for loc in locations:
    is_open = loc["status"] == "open"
    status_label = "Now Open" if is_open else "Coming Soon"
    hero_desc = (f"Visit us at {loc['street']}, {loc['cityline']} for authentic, slow-simmered ramen, "
                 f"handmade noodles, and shareable small plates.") if is_open else \
                (f"JINYA Ramen Bar is coming soon to {loc['cityline']}. Authentic, slow-simmered ramen "
                 f"and handmade noodles — stay tuned for our opening date.")
    phone_row = ''
    if loc.get("phone"):
        digits = re.sub(r'[^0-9]', '', loc["phone"])
        phone_row = f'''<div class="location-info-row">
            <div class="location-info-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.5 12.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.4 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>
            <div><div class="location-info-label">Phone</div><div class="location-info-value"><a href="tel:{digits}">{loc['phone']}</a></div></div>
          </div>'''
    note_html = ''
    if loc.get("note"):
        note_html = f'<p style="font-size:12px;color:var(--muted-2);margin-top:16px;">{loc["note"]}</p>'

    page = PAGE_TEMPLATE.format(
        name=loc["name"], street=loc["street"], cityline=loc["cityline"],
        status_label=status_label, hero_desc=hero_desc,
        phone_row=phone_row, hours_rows=hours_rows_html(loc), note_html=note_html,
    )
    with open(os.path.join(locations_dir, f'{loc["slug"]}.html'), "w") as f:
        f.write(page)

print(f"Generated {len(locations)} individual location pages in locations/")
