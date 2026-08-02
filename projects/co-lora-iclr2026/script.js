const dialog = document.querySelector('.citation-dialog');
const citation = dialog?.querySelector('code')?.textContent.trim();
const copyButton = dialog?.querySelector('.copy-button');

const chartData = {
  table2: {
    label: 'Table 2',
    title: 'Heterogeneous models',
    subtitle: 'DRAKE-Dynamic · LLaVA-Llama 1B / 3B',
    max: { self: 72, others: 55 },
    rows: [
      ['SFT', 65.79, 47.66], ['DITTO', 59.91, 47.45], ['FedSim', 63.98, 47.04],
      ['FedIT', 66.11, 47.63], ['TAKFL', 64.54, 47.38], ['FedDPA', 63.34, 47.61],
      ['FedDAT', 58.47, 48.91], ['PerAda', 59.75, 47.30], ['FedMKT', 61.38, 47.50],
      ['FedMosaic', 67.86, 51.16]
    ]
  },
  table4: {
    label: 'Table 4',
    title: 'Cross-family collaboration',
    subtitle: 'DRAKE-Dynamic · LLaVA-Llama + LLaVA-Qwen',
    max: { self: 75, others: 55 },
    rows: [
      ['SFT', 68.60, 48.34], ['DITTO', 66.77, 49.04], ['FedSim', 66.65, 46.77],
      ['FedIT', 68.72, 48.22], ['TAKFL', 67.77, 48.18], ['FedDPA', 67.38, 48.40],
      ['FedDAT', 66.08, 50.05], ['PerAda', 64.86, 47.89], ['FedMKT', 65.44, 48.09],
      ['FedMosaic', 70.67, 52.31]
    ]
  },
  table6: {
    label: 'Table 6',
    title: 'Large-scale collaboration',
    subtitle: 'Fed-LLM-Large · 52 heterogeneous Llama 1B / 3B clients',
    max: { self: 22, others: 17 },
    rows: [
      ['SFT', 18.03, 14.18], ['FedSim', 16.29, 12.62], ['FedIT', 17.10, 14.03],
      ['TAKFL', 14.04, 11.36], ['FedDPA', 17.60, 13.98], ['FedDAT', 17.06, 13.72],
      ['PerAda', 18.83, 14.66], ['FedMKT', 17.34, 14.38], ['FedMosaic', 20.87, 15.71]
    ]
  },
  table16: {
    label: 'Table 16',
    title: 'Three-model heterogeneity',
    subtitle: 'DRAKE-Dynamic · LLaVA-Llama 1B / 3B / 8B',
    max: { self: 72, others: 55 },
    rows: [
      ['SFT', 66.41, 47.94], ['DITTO', 61.56, 48.19], ['FedSim', 65.00, 47.47],
      ['FedIT', 66.18, 47.54], ['TAKFL', 64.73, 47.85], ['FedDPA', 63.26, 48.04],
      ['FedDAT', 60.43, 49.79], ['PerAda', 58.10, 46.90], ['FedMKT', 63.25, 47.88],
      ['FedMosaic', 68.94, 52.18]
    ]
  }
};

const resultChart = document.querySelector('#result-chart');
const explorerState = { experiment: 'table2', metric: 'self' };

function renderResultChart() {
  if (!resultChart) return;
  const data = chartData[explorerState.experiment];
  const metricIndex = explorerState.metric === 'self' ? 1 : 2;
  const max = data.max[explorerState.metric];
  const rows = data.rows;

  document.querySelector('#chart-table').textContent = data.label;
  document.querySelector('#chart-title').textContent = data.title;
  document.querySelector('#chart-subtitle').textContent = data.subtitle;
  resultChart.setAttribute('aria-label', `${data.label}, ${data.title}: ${explorerState.metric} last accuracy in the method order reported by the paper`);
  resultChart.replaceChildren();

  const scale = document.createElement('div');
  scale.className = 'chart-scale';
  scale.innerHTML = `<span>0</span><span>${max / 2}</span><span>${max}%</span>`;
  resultChart.append(scale);

  rows.forEach((rowData) => {
    const method = rowData[0];
    const value = rowData[metricIndex];
    const row = document.createElement('div');
    row.className = `chart-row${method === 'FedMosaic' ? ' chart-ours' : ''}`;
    row.setAttribute('aria-label', `${method}: ${value}`);
    row.innerHTML = `
      <strong class="chart-method">${method}</strong>
      <div class="chart-value"><span><i style="width:${(value / max) * 100}%"></i></span><b>${value.toFixed(2)}</b></div>`;
    resultChart.append(row);
  });
}

document.querySelectorAll('.result-explorer [data-control]').forEach((control) => {
  control.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    explorerState[control.dataset.control] = button.dataset.value;
    control.querySelectorAll('button').forEach((candidate) => {
      const selected = candidate === button;
      candidate.classList.toggle('active', selected);
      candidate.setAttribute('aria-pressed', String(selected));
    });
    renderResultChart();
  });
});

renderResultChart();

document.querySelectorAll('.cite-button').forEach((button) => {
  button.addEventListener('click', () => dialog?.showModal());
});

copyButton?.addEventListener('click', async () => {
  if (!citation) return;

  try {
    await navigator.clipboard.writeText(citation);
    copyButton.textContent = 'Copied';
    window.setTimeout(() => {
      copyButton.textContent = 'Copy BibTeX';
    }, 1400);
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(dialog.querySelector('code'));
    selection.removeAllRanges();
    selection.addRange(range);
  }
});

dialog?.addEventListener('click', (event) => {
  const bounds = dialog.getBoundingClientRect();
  const outside = event.clientX < bounds.left || event.clientX > bounds.right ||
    event.clientY < bounds.top || event.clientY > bounds.bottom;
  if (outside) dialog.close();
});
