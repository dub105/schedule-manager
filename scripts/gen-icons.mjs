import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dir, '..', 'public');

mkdirSync(publicDir, { recursive: true });

// Simple, clean calendar/schedule icon
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  <!-- Calendar body -->
  <rect x="104" y="152" width="304" height="256" rx="24" fill="white" fill-opacity="0.95"/>
  <!-- Calendar header strip -->
  <rect x="104" y="152" width="304" height="72" rx="24" fill="white" fill-opacity="0.2"/>
  <rect x="104" y="196" width="304" height="28" fill="white" fill-opacity="0.2"/>
  <!-- Hook rings -->
  <rect x="176" y="120" width="20" height="56" rx="10" fill="white"/>
  <rect x="316" y="120" width="20" height="56" rx="10" fill="white"/>
  <!-- Grid dots (calendar dates) -->
  <circle cx="176" cy="276" r="10" fill="#3b82f6"/>
  <circle cx="220" cy="276" r="10" fill="#3b82f6"/>
  <circle cx="264" cy="276" r="10" fill="#3b82f6"/>
  <circle cx="308" cy="276" r="10" fill="#3b82f6"/>
  <circle cx="352" cy="276" r="10" fill="#3b82f6"/>
  <circle cx="176" cy="320" r="10" fill="#94a3b8"/>
  <circle cx="220" cy="320" r="10" fill="#94a3b8"/>
  <circle cx="264" cy="320" r="10" fill="#94a3b8"/>
  <circle cx="308" cy="320" r="10" fill="#94a3b8"/>
  <circle cx="352" cy="320" r="10" fill="#94a3b8"/>
  <circle cx="176" cy="364" r="10" fill="#94a3b8"/>
  <circle cx="220" cy="364" r="10" fill="#94a3b8"/>
  <!-- Highlighted date -->
  <circle cx="264" cy="364" r="20" fill="#3b82f6"/>
  <circle cx="264" cy="364" r="10" fill="white"/>
</svg>`;

const sizes = [180, 192, 512];

for (const size of sizes) {
  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(join(publicDir, `icon-${size}.png`));
  console.log(`Generated icon-${size}.png`);
}

// Also generate maskable icon (no rounded corners - the OS applies them)
const svgMaskable = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bg)"/>
  <rect x="104" y="152" width="304" height="256" rx="24" fill="white" fill-opacity="0.95"/>
  <rect x="104" y="152" width="304" height="72" rx="24" fill="white" fill-opacity="0.2"/>
  <rect x="104" y="196" width="304" height="28" fill="white" fill-opacity="0.2"/>
  <rect x="176" y="120" width="20" height="56" rx="10" fill="white"/>
  <rect x="316" y="120" width="20" height="56" rx="10" fill="white"/>
  <circle cx="176" cy="276" r="10" fill="#3b82f6"/>
  <circle cx="220" cy="276" r="10" fill="#3b82f6"/>
  <circle cx="264" cy="276" r="10" fill="#3b82f6"/>
  <circle cx="308" cy="276" r="10" fill="#3b82f6"/>
  <circle cx="352" cy="276" r="10" fill="#3b82f6"/>
  <circle cx="176" cy="320" r="10" fill="#94a3b8"/>
  <circle cx="220" cy="320" r="10" fill="#94a3b8"/>
  <circle cx="264" cy="320" r="10" fill="#94a3b8"/>
  <circle cx="308" cy="320" r="10" fill="#94a3b8"/>
  <circle cx="352" cy="320" r="10" fill="#94a3b8"/>
  <circle cx="176" cy="364" r="10" fill="#94a3b8"/>
  <circle cx="220" cy="364" r="10" fill="#94a3b8"/>
  <circle cx="264" cy="364" r="20" fill="#3b82f6"/>
  <circle cx="264" cy="364" r="10" fill="white"/>
</svg>`;

await sharp(Buffer.from(svgMaskable))
  .resize(512, 512)
  .png()
  .toFile(join(publicDir, 'icon-maskable.png'));
console.log('Generated icon-maskable.png');

console.log('Done!');
