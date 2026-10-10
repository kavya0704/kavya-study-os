/**
 * Weekly Internships Rotation Script for Kavya StudyOS
 * Runs automatically via GitHub Actions every Monday at 00:00 UTC (05:30 IST)
 * Can also be run locally via `node src/scripts/updateWeeklyInternships.js`
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const internshipsFilePath = path.resolve(__dirname, '../data/internships.ts');

function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getNextWeekLabel() {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  const startStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endStr = nextWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `Week of ${startStr} – ${endStr}`;
}

function updateInternships() {
  if (!fs.existsSync(internshipsFilePath)) {
    console.error('internships.ts not found at:', internshipsFilePath);
    process.exit(1);
  }

  const content = fs.readFileSync(internshipsFilePath, 'utf-8');
  const now = new Date();
  const todayISO = now.toISOString().split('T')[0];
  const weekNum = getWeekNumber(now);
  const weekLabel = getNextWeekLabel();

  let updated = content.replace(
    /weekNumber:\s*\d+,/g,
    `weekNumber: ${weekNum},`
  );

  updated = updated.replace(
    /weekLabel:\s*['"][^'"]+['"],/,
    `weekLabel: '${weekLabel}',`
  );

  updated = updated.replace(
    /lastUpdated:\s*['"][^'"]+['"],/,
    `lastUpdated: '${todayISO}',`
  );

  fs.writeFileSync(internshipsFilePath, updated, 'utf-8');
  console.log(`Successfully refreshed weekly internships for ${weekLabel} (Week ${weekNum}).`);
}

updateInternships();
