# Sivumaku

Production source for `sivumaku.fi` and `reseptit.sivumaku.fi`.

## Structure

- `index.html`: homepage and history links
- `reseptit/index.html`: standalone recipe index
- `reseptit/styles.css`: shared responsive design
- `reseptit/app.js`: shared recipe search and filtering
- `reseptit/hero.js`: hero image loader
- `reseptit/data1.js`–`data7.js`: recipe archive
- `ravintolahistoria/`: separate history application

## Checks

Run `node --test tests/*.test.mjs` and `node --check reseptit/app.js` before merging. GitHub Actions runs these checks on pull requests. Inspect the preview on mobile Safari, Android Chrome, and desktop; automated static tests do not replace interactive browser testing.

Deploy production only after checks and preview review. Avoid duplicating recipe logic or introducing responsive overrides with `!important`.
