
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
    node.innerHTML = digits.map(d => `<span class="digit d${d}"></span>`).join('');
  }
  if (node.tagName === 'LABEL') {
    node.setAttribute('style', `transform: rotate(${rand()*1.2 - 0.6}deg)`);
  }
}

function flicker() {
  for (const e of document.querySelectorAll('[digits]')) {
    e.style.opacity = 0.9 + rand() * 0.1;
  }
  window.requestAnimationFrame(flicker);
}

flicker();
