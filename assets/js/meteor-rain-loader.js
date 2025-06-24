(function() {
  var meteorScriptId = 'meteor-rain-script';
  var meteorCanvasId = 'stars-bg';

  function addMeteorRain() {
    if (!document.getElementById(meteorScriptId)) {
      var script = document.createElement('script');
      script.id = meteorScriptId;
      script.src = (window.METEOR_RAIN_PATH || '/assets/js/meteor-rain.js');
      script.defer = true;
      document.body.appendChild(script);
    }
  }

  function removeMeteorRain() {
    // 移除 canvas
    var canvas = document.getElementById(meteorCanvasId);
    if (canvas) canvas.remove();
    // 移除 script
    var script = document.getElementById(meteorScriptId);
    if (script) script.remove();
  }

  function updateMeteorRain() {
    var isDark = false;
    // 检查 html[data-mode] 或 prefers-color-scheme
    var html = document.documentElement;
    if (html.hasAttribute('data-mode')) {
      isDark = html.getAttribute('data-mode') === 'dark';
    } else {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    if (isDark) {
      addMeteorRain();
    } else {
      removeMeteorRain();
    }
  }

  // 初始
  updateMeteorRain();

  // 监听 data-mode 属性变化（主题切换）
  var observer = new MutationObserver(updateMeteorRain);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode'] });

  // 监听系统主题变化
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateMeteorRain);
})(); 