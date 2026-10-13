# Hair Art - Hair Restoration & Aesthetic Clinic

A modern, high-converting, mobile-responsive, and local SEO-optimized static website for **Hair Art** led by **Dr. Syed Imran Zahid** in Faisalabad, Pakistan.

Designed and architected according to clinical trust benchmarks, modern healthcare UI aesthetics, and strict local SEO best practices.

---

## 🏥 Clinic & Surgeon Profile

| Field | Value |
| :--- | :--- |
| **Clinic Name** | Hair Art |
| **Doctor** | **Dr. Syed Imran Zahid** (MBBS, RMP, RPMDC) |
| **Doctor** | **Dr. Kashif Hussain** (MBBS, FCPS Dermatology • 10 Years Experience) |
| **Phone Number** | 0309 0054771 (`+92 309 0054771`) |
| **WhatsApp** | 0309 0054771 (`https://wa.me/qr/7AFDUM72QJWYK1`) |
| **Email** | hairartandskincare123@gmail.com |
| **Address** | Pull Abdullah, Samundri Road |
| **City & Country** | Faisalabad, Pakistan |
| **Google Maps** | Pull Abdullah, Samundri Road, Faisalabad |

---

## ⚡ Fast Find & Replace via PowerShell

To quickly swap all placeholders across all HTML and JS files in one command:

```powershell
# Open PowerShell in the project directory:
cd "c:\laragon\www\static website"

# Example: Replace [CITY] with your real city
Get-ChildItem -Recurse -Include *.html,*.js,*.xml | ForEach-Object {
  (Get-Content $_.FullName) -replace '\[CITY\]', 'Manchester' | Set-Content $_.FullName
}

# Example: Replace [CLINIC_NAME]
Get-ChildItem -Recurse -Include *.html,*.js,*.xml | ForEach-Object {
  (Get-Content $_.FullName) -replace '\[CLINIC_NAME\]', 'Manchester Hair Clinic' | Set-Content $_.FullName
}
```

---

## 🌐 Running Locally & Deploying

### Option 1: Laragon (Installed)
The project is located in `c:\laragon\www\static website`.
1. Open Laragon and start Apache / Nginx.
2. Visit `http://static-website.test` (or `http://localhost/static website/index.html`) in any browser.

### Option 2: Live Server or Local Python Server
```powershell
# In PowerShell:
cd "c:\laragon\www\static website"
python -m http.server 8080
# Visit http://localhost:8080
```

### Option 3: Static Hosting Deployment
The website consists of clean, dependency-free HTML5, CSS3, and Vanilla JavaScript. It can be deployed directly to:
- **Netlify** (drag-and-drop folder or git push)
- **Vercel**
- **GitHub Pages**
- **Cloudflare Pages**
- **Traditional cPanel / Apache / Nginx web hosting**

---

## 📬 Connecting Contact Form to a Backend

Because this is a static website, the form includes complete client-side validation out of the box. To receive emails when visitors submit inquiries:

1. **Using Formspree**:
   In `index.html` and `contact.html`, add:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
2. **Using Netlify Forms**:
   Add `netlify` to the form element:
   ```html
   <form name="contact" method="POST" data-netlify="true">
   ```

---

## 🔍 Local SEO & Schema Markup Checklist

- **MedicalBusiness / LocalBusiness JSON-LD:** Implemented on the homepage.
- **FAQPage Schema:** Implemented on `faq.html`.
- **MedicalProcedure Schema:** Implemented on each treatment page.
- **Breadcrumbs Hierarchy:** Implemented on all inner pages.
- **Canonical URLs & Open Graph:** Fully included in all `<head>` sections.
