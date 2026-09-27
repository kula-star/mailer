const { parse } = require('csv-parse/sync');

// Extracts email addresses from CSV text. Accepts either a header row with an "email" column,
// or a plain single-column list, or emails scattered across multiple columns.
function extractEmailsFromCsv(csvText) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let records;
  try {
    records = parse(csvText, { skip_empty_lines: true, relax_column_count: true });
  } catch (err) {
    throw new Error('Could not parse CSV file: ' + err.message);
  }

  const found = new Set();
  for (const row of records) {
    for (const cell of row) {
      const val = String(cell).trim();
      if (emailRegex.test(val)) {
        found.add(val.toLowerCase());
      }
    }
  }
  return Array.from(found);
}

module.exports = { extractEmailsFromCsv };
