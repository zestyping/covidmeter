
function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

var date = new Date().toISOString().replace(/\D/g, '').substr(0, 8);
var rand = mulberry32(date - 0);
var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
for (var node = walker.nextNode(); node; node = walker.nextNode()) {
  const contentExpr = node.getAttribute('content');
  if (contentExpr) {
    node.innerText = eval(contentExpr);
  }
  const digitsExpr = node.getAttribute('digits');
  if (digitsExpr) {
    const count = eval(digitsExpr);
    const digits = [
      Math.floor(count/100000) % 10,
      Math.floor(count/10000) % 10,
      Math.floor(count/1000) % 10,
      Math.floor(count/100) % 10,
      Math.floor(count/10) % 10,
      Math.floor(count) % 10
    ];
    for (var z = 0; digits[z] == 0; z++);
    node.innerHTML = digits.map(
      (d, i) => `<span class="digit d${d} ${i < z ? 'leading' : ''}"></span>`
    ).join('');
  }
  if (node.tagName === 'LABEL') {
    const angle = rand()*1.2 - 0.6;
    const x = rand()*0.3 - 0.15;
    const y = rand()*0.3 - 0.15;
    node.setAttribute('style', `transform: rotate(${angle}deg) translate(${x}rem,${y}rem)`);
  }
}

for (const e of document.querySelectorAll('.digit')) {
  e.style.opacity = 1 - rand() * 0.2;
}

var hum = 0;
function flicker() {
  for (const e of document.querySelectorAll('[digits]')) {
    e.style.opacity = (1 - rand() * 0.02 - Math.floor(hum/2) * 0.02)**2;
  }
  hum = (hum + 1) % 4;
  window.requestAnimationFrame(flicker);
}

flicker();
