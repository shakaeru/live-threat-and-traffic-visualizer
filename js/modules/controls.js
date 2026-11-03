const LABELS = Object.freeze({
  pause: '❚❚ Pause',
  play: '▶ Play',
  live: 'LIVE',
  paused: 'PAUSED',
});

export function initControls(elements, handlers) {
  const {
    toggleButton,
    clearButton,
    speedInput,
    speedOutput,
    severityInputs,
    statusText,
  } = elements;

  let running = true;

  function selectedSeverities() {
    return [...severityInputs]
      .filter((input) => input.checked)
      .map((input) => input.value);
  }

  function renderRunningState() {
    document.body.classList.toggle('is-paused', !running);
    toggleButton.textContent = running ? LABELS.pause : LABELS.play;
    toggleButton.setAttribute('aria-pressed', String(!running));
    statusText.textContent = running ? LABELS.live : LABELS.paused;
  }

  toggleButton.addEventListener('click', () => {
    running = !running;
    renderRunningState();
    handlers.onToggle(running);
  });

  clearButton.addEventListener('click', () => {
    handlers.onClear();
  });

  speedInput.addEventListener('input', () => {
    const speed = Number(speedInput.value);
    speedOutput.textContent = speed;
    handlers.onSpeedChange(speed);
  });

  severityInputs.forEach((input) => {
    input.addEventListener('change', () => {
      handlers.onFilterChange(selectedSeverities());
    });
  });

  renderRunningState();

  return {
    speed: Number(speedInput.value),
    severities: selectedSeverities(),
  };
}
