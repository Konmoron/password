// Generated by CoffeeScript 1.7.1
(function() {
  var loadOptions, loadPassword, now, restartRefresh, saveOptions, setProgress, stopRefresh, tick;

  if (window.Storage && window.JSON) {
    window.$storage = function(key) {
      return {
        set: function(value) {
          return localStorage.setItem(key, JSON.stringify(value));
        },
        get: function() {
          var item;
          item = localStorage.getItem(key);
          if (item) {
            return JSON.parse(item);
          }
        }
      };
    };
  }

  $(function() {
    window.lastLoad = now();
    window.refreshPassword = 30000;
    window.tickerInterval = 200;
    window.ticker = setInterval(tick, window.tickerInterval);
    $('#focusedInput').bind('click', stopRefresh);
    $('#focusedInput').bind('blur', restartRefresh);
    $('#optionSave').bind('click', saveOptions);
    loadOptions();
    return loadPassword();
  });

  now = function() {
    var d;
    d = new Date();
    return d.getTime();
  };

  stopRefresh = function() {
    clearInterval(window.ticker);
    $('#focusedInput').select();
    return false;
  };

  restartRefresh = function() {
    window.lastLoad = now();
    return window.ticker = setInterval(tick, window.tickerInterval);
  };

  setProgress = function(perc) {
    return $('.progress-bar').css('width', "" + perc + "%");
  };

  loadPassword = function() {
    var options;
    options = loadOptions();
    return $.get("/v1/getPassword?length=" + options.passwordLength + "&special=" + options.useSpecial, function(data) {
      $('#focusedInput').val(data);
      return window.lastLoad = now();
    });
  };

  saveOptions = function() {
    var options;
    options = {
      passwordLength: $('#passwordLengthOption').val(),
      useSpecial: $('#useSpecialOption')[0].checked
    };
    window.$storage('SecurePasswordOptions').set(options);
    $('#settingsModal').modal('hide');
    return loadPassword();
  };

  loadOptions = function() {
    var options;
    options = window.$storage('SecurePasswordOptions').get();
    if (options === void 0) {
      options = {
        passwordLength: 20,
        useSpecial: false
      };
    }
    $('#passwordLengthOption').val(options.passwordLength);
    $('#useSpecialOption')[0].checked = options.useSpecial;
    return options;
  };

  tick = function() {
    var diff, perc;
    diff = now() - window.lastLoad;
    perc = (window.refreshPassword - diff) / window.refreshPassword * 100;
    setProgress(perc);
    if (diff >= window.refreshPassword) {
      return loadPassword();
    }
  };

}).call(this);