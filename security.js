const pw = document.getElementById('password');
const toggle = document.getElementById('toggleVis');
const meter = document.getElementById('meter');
const strength = document.getElementById('strength-text');
const feedback = document.getElementById('feedback');
const icons = {
  len: document.getElementById('len-icon'),
  lower: document.getElementById('lower-icon'),
  upper: document.getElementById('upper-icon'),
  num: document.getElementById('num-icon'),
  symbol: document.getElementById('symbol-icon'),
};
const container = document.getElementById('container');
const submitBtn = document.getElementById('submitBtn');
const strengthLabels = ['Very weak','Weak','Fair','Good','Strong'];

toggle.addEventListener('click', () => {
  const isPwd = pw.type === 'password';
  pw.type = isPwd ? 'text' : 'password';
  toggle.classList.toggle('fa-eye-slash', isPwd);
  toggle.classList.toggle('fa-eye', !isPwd);
});

pw.addEventListener('input', () => {
  const val = pw.value;
  const res = zxcvbn(val);
  meter.value = res.score;
  strength.textContent = val
    ? `Strength: ${strengthLabels[res.score]} (${res.crack_times_display.offline_slow_hashing_1e4_per_second})`
    : '';
  feedback.innerHTML = '';
  if (res.feedback.warning) feedback.innerHTML += `<p><em>${res.feedback.warning}</em></p>`;
  if (res.feedback.suggestions.length) {
    feedback.innerHTML += '<ul>' + res.feedback.suggestions.map(s => `<li>${s}</li>`).join('') + '</ul>';
  }
  icons.len.textContent = val.length >= 8 ? '✅' : '❌';
  icons.lower.textContent = /[a-z]/.test(val) ? '✅' : '❌';
  icons.upper.textContent = /[A-Z]/.test(val) ? '✅' : '❌';
  icons.num.textContent = /[0-9]/.test(val) ? '✅' : '❌';
  icons.symbol.textContent = /\W|_/.test(val) ? '✅' : '❌';
});

submitBtn.addEventListener('click', () => {
  const val = pw.value;
  const res = zxcvbn(val);
  const isValid = res.score >= 3; // e.g. Good or Strong

  if (!isValid) {
    pw.classList.add('error-border');
    container.classList.remove('shake');
    container.offsetWidth;  // trigger reflow for animation restart
    container.classList.add('shake');
    container.addEventListener('animationend', () => {
      container.classList.remove('shake');
    }, { once: true });
  } else {
    alert('Password is strong enough 👍');
  }
});
