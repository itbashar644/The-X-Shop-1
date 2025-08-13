
# Product Page Generator

This script generates static HTML pages for each product in the database.

## Usage

To generate static product pages, run the following command from the project root:

```bash
node scripts/generate-product-pages.js
```

## What it does

1. Fetches all active products from Supabase
2. Generates individual HTML files for each product (e.g., `public/product-123.html`)
3. Includes comprehensive Яндекс microdata (Schema.org) for SEO
4. Creates a sitemap.xml file
5. Provides static pages for better search engine indexing

## Output

- Product pages: `public/product-{id}.html`
- Sitemap: `public/sitemap.xml`

## Features

- Complete microdata markup for products
- Breadcrumb navigation
- Mobile-responsive design
- SEO-optimized meta tags
- Open Graph tags for social sharing
- Automatic redirects to the main React application for interactions

## Requirements

- Node.js (built-in modules only, no additional dependencies)
- Internet connection to fetch data from Supabase
