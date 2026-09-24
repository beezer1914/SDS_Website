// Run after `npm run build`. Verifies old WordPress URLs still resolve on the new site.
// Extend PUBLIC_URLS during the content migration as pages are kept, cut, or redirected.
import { existsSync, readFileSync } from "node:fs";

const PUBLIC_URLS = ["/", "/history/", "/the-founders/", "/message/", "/chapter-history/", "/contact/", "/events/"];
const REDIRECTED_URLS = [
  "/login/", "/profile/", "/password-recovery/", "/chapter-dues/", "/constitution/",
  "/directory/", "/chapter-report/", "/templates/", "/calendar/",
];

const redirects = readFileSync("out/_redirects", "utf8")
  .split("\n")
  .filter((l) => l.trim() && !l.startsWith("#"))
  .map((l) => l.trim().split(/\s+/)[0].replace("/*", "/"));

const failures = [
  ...PUBLIC_URLS.filter((u) => !existsSync(`out${u}index.html`)).map((u) => `missing page: ${u}`),
  ...REDIRECTED_URLS.filter((u) => !redirects.includes(u)).map((u) => `missing redirect: ${u}`),
];

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`OK: ${PUBLIC_URLS.length} pages present, ${REDIRECTED_URLS.length} redirects defined`);
