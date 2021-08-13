
function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

var rand = mulberry32(1337);
var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
for (var node = walker.nextNode(); node; node = walker.nextNode()) {
  const digitsExpr = node.getAttribute('digits');
  const pairs = [];
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
    node.setAttribute('style', `transform: rotate(${rand() - 0.5}deg)`);
  }
}
