# mesa.international

Static company site for Mesa International — threat intelligence & abuse response.
Plain HTML/CSS/JS, no build step. Hosted on GitHub Pages.

## Files
- `index.html` — page content (EN/VI via `.en` / `.vi` spans)
- `style.css` — pure black & red theme, scroll fade in/out reveal
- `script.js` — language toggle, scroll reveal, contact form
- `CNAME` — custom domain for GitHub Pages (do not delete)
- `.nojekyll` — tells GitHub Pages to serve files as-is

## Contact form
The form posts to Formspree. Replace `YOUR_FORM_ID` in `index.html`
(`<form action="https://formspree.io/f/YOUR_FORM_ID">`) with your real form ID.

## Local preview
    python3 -m http.server 8000
    # open http://localhost:8000
