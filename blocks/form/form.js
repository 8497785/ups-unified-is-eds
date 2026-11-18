/**
 * form — form embed / native form (source: AEM adaptive-form container, iframe-hosted).
 *
 * Authoring rows (key | value, key matched case-insensitively):
 *   source   | the source adaptive-form path (kept as data-form for the backend hand-off)
 *   action   | the submit endpoint once the owner names one (optional — without it a submit
 *              shows the "no backend connected" notice; no data leaves the page)
 *   text | email | tel | number | textarea | select | radio | checkbox  | field label
 *            (append " *" to the label for a required field; select/radio take a list of
 *            options in a third cell)
 *   submit   | button label
 * With no field rows the block is an empty mount that reserves the captured geometry of the
 * source frame (the source's frames render empty in every capture — dynamics plan D1).
 * Block-class options: quote | calculator | contact (default none) — mount geometry per source
 *   frame (quote 24px, calculator 157px); contact = two-column field grid from 768px
 * @ew-exempt all — form configuration rows (keys, labels, endpoint) are rebuilt as controls
 * Section head: author the title (<h2>) and lede (<p>) as default content before the block in
 * the same section — styled in place as the source's centred section title.
 */

const FIELD_TYPES = ['text', 'email', 'tel', 'number', 'textarea', 'select', 'radio', 'checkbox'];

function readRows(block) {
  return [...block.querySelectorAll(':scope > div')].map((row) => {
    const cells = [...row.children];
    return {
      key: (cells[0]?.textContent || '').trim().toLowerCase(),
      value: (cells[1]?.textContent || '').trim(),
      options: cells[2] ? [...cells[2].querySelectorAll('li')].map((li) => li.textContent.trim())
        : [],
    };
  });
}

function fieldId(base, i) {
  return `form-${base.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${i}`;
}

function buildField(row, i) {
  const required = /\*\s*$/.test(row.value);
  const label = row.value.replace(/\s*\*\s*$/, '');
  const id = fieldId(label || row.key, i);
  const wrap = document.createElement('div');
  wrap.className = `form-field form-field-${row.key}`;
  if (row.key === 'radio') {
    const fs = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.textContent = label;
    fs.append(legend);
    row.options.forEach((opt, j) => {
      const l = document.createElement('label');
      l.className = 'form-radio';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = id;
      input.value = opt;
      input.required = required && j === 0;
      l.append(input, opt);
      fs.append(l);
    });
    wrap.append(fs);
    return wrap;
  }
  let input;
  if (row.key === 'textarea') input = document.createElement('textarea');
  else if (row.key === 'select') {
    input = document.createElement('select');
    const ph = document.createElement('option');
    ph.value = '';
    ph.textContent = label;
    input.append(ph);
    row.options.forEach((opt) => {
      const o = document.createElement('option');
      o.textContent = opt;
      input.append(o);
    });
  } else {
    input = document.createElement('input');
    input.type = row.key;
  }
  input.id = id;
  input.name = id;
  input.required = required;
  const l = document.createElement('label');
  l.htmlFor = id;
  if (row.key === 'checkbox') {
    l.className = 'form-check';
    l.append(input, label);
    wrap.append(l);
    return wrap;
  }
  l.className = 'visually-hidden';
  l.textContent = label;
  if (row.key !== 'select') input.placeholder = `${label}${required ? '*' : ''}`;
  wrap.append(l, input);
  return wrap;
}

export default function decorate(block) {
  const rows = readRows(block);
  const source = rows.find((r) => r.key === 'source');
  const action = rows.find((r) => r.key === 'action');
  const fields = rows.filter((r) => FIELD_TYPES.includes(r.key));
  const submit = rows.find((r) => r.key === 'submit');

  const mount = document.createElement('div');
  mount.className = 'form-mount';
  if (source) mount.dataset.form = source.value;

  if (fields.length) {
    const form = document.createElement('form');
    const grid = document.createElement('div');
    grid.className = 'form-grid';
    fields.forEach((f, i) => grid.append(buildField(f, i)));
    form.append(grid);
    const actions = document.createElement('div');
    actions.className = 'form-actions';
    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.className = 'button primary';
    btn.textContent = submit ? submit.value : 'Submit';
    actions.append(btn);
    const status = document.createElement('p');
    status.className = 'form-status';
    status.setAttribute('role', 'status');
    form.append(actions, status);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!action) {
        status.textContent = 'No backend connected: this form does not send data yet.';
        return;
      }
      btn.disabled = true;
      try {
        const resp = await fetch(action.value, { method: 'POST', body: new FormData(form) });
        if (!resp.ok) throw new Error(resp.status);
        form.reset();
        status.textContent = '';
        document.dispatchEvent(new CustomEvent('form-toast:show'));
      } catch {
        status.textContent = 'Something went wrong. Please try again.';
      } finally {
        btn.disabled = false;
      }
    });
    mount.append(form);
  }
  block.replaceChildren(mount);
}
