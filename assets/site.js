/* BreadScopeCraft — recipe scaler, unit switch, kitchen converter, baker's calculator, guide search */
(function () {
  function fmt(n) { return n >= 100 ? Math.round(n) : n >= 10 ? Math.round(n * 2) / 2 : Math.round(n * 10) / 10; }

  // Recipe: scale + units
  var ing = document.getElementById('ing-list');
  if (ing) {
    var scale = 1, unit = 'metric';
    var render = function () {
      ing.querySelectorAll('li').forEach(function (li) {
        var g = parseFloat(li.getAttribute('data-g')), m = li.getAttribute('data-m'), u = li.getAttribute('data-us'), amt = li.querySelector('.amt');
        if (!m && !u) { amt.textContent = ''; return; }
        if (unit === 'metric') {
          if (!isNaN(g) && /\b(g|ml)\b/.test(m)) amt.textContent = fmt(g * scale) + (/ml/.test(m) ? ' ml' : ' g');
          else if (!isNaN(g)) amt.textContent = scale === 1 ? m : fmt(g * scale) + (/^\d+$/.test(m) ? '' : '');
          else amt.textContent = m;
        } else {
          amt.textContent = scale === 1 ? u : u + ' × ' + scale;
        }
      });
    };
    document.querySelectorAll('[data-scale]').forEach(function (b) {
      b.addEventListener('click', function () {
        scale = parseFloat(b.getAttribute('data-scale'));
        document.querySelectorAll('[data-scale]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        render();
      });
    });
    document.querySelectorAll('[data-unit]').forEach(function (b) {
      b.addEventListener('click', function () {
        unit = b.getAttribute('data-unit');
        document.querySelectorAll('[data-unit]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        render();
      });
    });
  }

  // Kitchen converter (cups -> grams)
  var conv = document.getElementById('conv');
  if (conv) {
    var G = { 'bread': 127, 'ap': 120, 'ww': 113, 'water': 236, 'milk': 242, 'sugar': 200, 'butter': 227, 'oil': 216 };
    var ingSel = conv.querySelector('#conv-ing'), qty = conv.querySelector('#conv-qty'), out = conv.querySelector('#conv-out');
    var run = function () {
      var c = parseFloat(qty.value) || 0;
      out.textContent = '≈ ' + Math.round(c * G[ingSel.value]) + ' g';
    };
    ingSel.addEventListener('change', run); qty.addEventListener('input', run); run();
  }

  // Baker's percentage calculator
  var calc = document.getElementById('calc');
  if (calc) {
    var f = function (id) { return parseFloat(document.getElementById(id).value) || 0; };
    var set = function (id, v) { document.getElementById(id).textContent = v; };
    var runCalc = function () {
      var flour = f('c-flour'), hyd = f('c-hyd'), salt = f('c-salt'), yeastPct = f('c-yeast'), type = document.getElementById('c-type').value;
      var water = flour * hyd / 100, s = flour * salt / 100, y = flour * yeastPct / 100;
      set('o-flour', Math.round(flour) + ' g');
      set('o-water', Math.round(water) + ' g');
      set('o-salt', fmt(s) + ' g');
      set('o-yeast', fmt(y) + ' g');
      set('o-yeast-l', type === 'sourdough' ? 'Sourdough starter' : 'Instant yeast');
      set('o-total', Math.round(flour + water + s + y) + ' g');
    };
    calc.querySelectorAll('input,select').forEach(function (el) { el.addEventListener('input', runCalc); el.addEventListener('change', function () {
      if (el.id === 'c-type') { document.getElementById('c-yeast').value = el.value === 'sourdough' ? 20 : 1; }
      runCalc();
    }); });
    runCalc();
  }

  // Guide search
  var input = document.getElementById('guide-search');
  if (input) {
    var cards = document.querySelectorAll('[data-search]'), empty = document.getElementById('no-results');
    var q0 = new URLSearchParams(location.search).get('q'); if (q0) input.value = q0;
    var go = function () {
      var q = input.value.trim().toLowerCase(), n = 0;
      cards.forEach(function (c) { var hit = !q || c.getAttribute('data-search').indexOf(q) > -1; c.style.display = hit ? '' : 'none'; if (hit) n++; });
      empty.style.display = n ? 'none' : 'block';
    };
    input.addEventListener('input', go); go();
  }
})();
