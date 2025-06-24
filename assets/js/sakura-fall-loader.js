(function() {
  var sakuraScriptId = 'sakura-fall-script';
  var jqueryScriptId = 'sakura-jquery';
  var sakuraFlakeClass = 'snowfall-flakes';
  var sakuraImgs = [
    '/assets/js/sakura/1.png',
    '/assets/js/sakura/2.png',
    '/assets/js/sakura/4.png'
  ];
  var snowfallPath = '/assets/js/snowfall.jquery.js';
  var jqueryPath = '/assets/js/jquery.min.js';

  function addScript(id, src, callback) {
    if (document.getElementById(id)) {
      if (callback) callback();
      return;
    }
    var script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.onload = callback || null;
    document.body.appendChild(script);
  }

  function removeSakura() {
    // 移除樱花 DOM
    var flakes = document.querySelectorAll('.' + sakuraFlakeClass);
    flakes.forEach(function(f){ f.remove(); });
    // 移除 script
    var sakuraScript = document.getElementById(sakuraScriptId);
    if (sakuraScript) sakuraScript.remove();
  }

  function addSakura() {
    // 先加载 jQuery
    if (!window.jQuery) {
      addScript(jqueryScriptId, jqueryPath, function() {
        addScript(sakuraScriptId, snowfallPath, startSakura);
      });
    } else {
      addScript(sakuraScriptId, snowfallPath, startSakura);
    }
  }

  function startSakura() {
    if (!window.jQuery || !window.jQuery.fn || !window.jQuery.fn.snowfall) return;
    // 多种图片叠加
    sakuraImgs.forEach(function(img) {
      window.jQuery(document).snowfall({image: img, flakeCount: 20, minSpeed: 1, minSize: 8, maxSize: 15});
    });
  }

  function updateSakura() {
    var isLight = false;
    var html = document.documentElement;
    if (html.hasAttribute('data-mode')) {
      isLight = html.getAttribute('data-mode') === 'light';
    } else {
      isLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    }
    if (isLight) {
      addSakura();
    } else {
      removeSakura();
    }
  }

  updateSakura();
  var observer = new MutationObserver(updateSakura);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode'] });
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', updateSakura);
})(); 