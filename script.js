/*
  COMP 4610 GUI I - HW3: Dynamic Multiplication Table
  Author: Alexi Montesinos
  Email: alexi_montesinos@student.uml.edu
  Description: Reads four range values from the form, validates them,
               and dynamically builds a multiplication table in the DOM.
               All errors are shown inline — no popup windows.
*/

const LIMIT = 50; // valid input range: -LIMIT to LIMIT

document.getElementById('generateBtn').addEventListener('click', generateTable);

/* ── Main entry point ─────────────────────────────────────── */

function generateTable() {
  const inputs = {
    minCol: document.getElementById('minCol'),
    maxCol: document.getElementById('maxCol'),
    minRow: document.getElementById('minRow'),
    maxRow: document.getElementById('maxRow'),
  };

  clearErrors(inputs);

  const errors = [];
  const values = parseAndValidate(inputs, errors);

  if (errors.length > 0) {
    showErrors(errors);
    document.getElementById('table-section').classList.add('hidden');
    return;
  }

  clearErrors(inputs);
  buildTable(values.minCol, values.maxCol, values.minRow, values.maxRow);
}

/* ── Validation ───────────────────────────────────────────── */

/*
  Parses each input field and runs all validation checks.
  Marks invalid fields with a CSS class and pushes error messages.
  Returns an object with the four parsed integers, or null on failure.
*/
function parseAndValidate(inputs, errors) {
  const parsed = {};

  // Step 1: check that every field contains a valid integer
  for (const [key, el] of Object.entries(inputs)) {
    const val = parseInteger(el.value);
    if (val === null) {
      errors.push(`${labelFor(key)} must be a valid whole number.`);
      el.classList.add('input-error');
    } else {
      parsed[key] = val;
    }
  }

  if (errors.length > 0) return null;

  // Step 2: check each value is within [-LIMIT, LIMIT]
  for (const [key, el] of Object.entries(inputs)) {
    if (parsed[key] < -LIMIT || parsed[key] > LIMIT) {
      errors.push(`${labelFor(key)} must be between -${LIMIT} and ${LIMIT}.`);
      el.classList.add('input-error');
    }
  }

  if (errors.length > 0) return null;

  // Step 3: check that min <= max for each axis
  if (parsed.minCol > parsed.maxCol) {
    errors.push('Minimum Column Value must be ≤ Maximum Column Value.');
    inputs.minCol.classList.add('input-error');
    inputs.maxCol.classList.add('input-error');
  }
  if (parsed.minRow > parsed.maxRow) {
    errors.push('Minimum Row Value must be ≤ Maximum Row Value.');
    inputs.minRow.classList.add('input-error');
    inputs.maxRow.classList.add('input-error');
  }

  return errors.length === 0 ? parsed : null;
}

/* ── Table builder ────────────────────────────────────────── */

/*
  Constructs the <table> element entirely in JavaScript and inserts it
  into the page. Columns run from minCol to maxCol (top header row),
  rows run from minRow to maxRow (left header column).
*/
function buildTable(minCol, maxCol, minRow, maxRow) {
  const container = document.getElementById('table-container');
  container.innerHTML = '';

  const table = document.createElement('table');

  // ── Header row (multipliers along the top) ──────────────
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  // Corner cell
  const corner = document.createElement('th');
  corner.textContent = '×';
  headerRow.appendChild(corner);

  for (let col = minCol; col <= maxCol; col++) {
    const th = document.createElement('th');
    th.textContent = col;
    headerRow.appendChild(th);
  }

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // ── Body rows (multiplicands down the left) ─────────────
  const tbody = document.createElement('tbody');

  for (let row = minRow; row <= maxRow; row++) {
    const tr = document.createElement('tr');

    // Row header cell (sticky left column)
    const rowHeader = document.createElement('td');
    rowHeader.textContent = row;
    tr.appendChild(rowHeader);

    // Product cells
    for (let col = minCol; col <= maxCol; col++) {
      const td = document.createElement('td');
      td.textContent = row * col;
      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  }

  table.appendChild(tbody);
  container.appendChild(table);
  document.getElementById('table-section').classList.remove('hidden');
}

/* ── Helper utilities ─────────────────────────────────────── */

/*
  Returns the integer value of a string, or null if the string is
  empty, non-numeric, or not a whole number (ex: "3.5" is rejected).
*/
function parseInteger(value) {
  const trimmed = value.trim();
  if (trimmed === '') return null;
  const num = Number(trimmed);
  if (!Number.isFinite(num) || !Number.isInteger(num)) return null;
  return num;
}

function labelFor(key) {
  const labels = {
    minCol: 'Minimum Column Value',
    maxCol: 'Maximum Column Value',
    minRow: 'Minimum Row Value',
    maxRow: 'Maximum Row Value',
  };
  return labels[key] || key;
}

function clearErrors(inputs) {
  document.getElementById('error-container').innerHTML = '';
  Object.values(inputs).forEach(el => el.classList.remove('input-error'));
}

function showErrors(errors) {
  const container = document.getElementById('error-container');
  const items = errors.map(e => `<li>${e}</li>`).join('');
  container.innerHTML = `
    <div class="error-message">
      <strong>Please fix the following errors:</strong>
      <ul>${items}</ul>
    </div>`;
}
