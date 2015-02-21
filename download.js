window.onload = function() {
  var file_input   = document.getElementById("load-file");
  var download_btn = document.getElementById("download-now");

  file_input.onchange = function(event) {
    var file = event.target.files[0];

    if (file.type.match(/text.*/)) {
      var reader = new FileReader();

      reader.onload = function(event) {
        var url_list = document.getElementById("url-list");
        url_list.value = reader.result;
      };

      reader.readAsText(file);
    } else {
      alert("File type not supported.");
    }
  };

  download_btn.onclick = function() {
    var url_list = document.getElementById("url-list");

    if (url_list.value.trim().length == 0) return;

    var urls = url_list.value.trim().split(/\s+/gm);
    var urls_count = urls.length;
    var progress = 0;
    var progress_bar = document.getElementById("bar");
    var progress_div = document.getElementById("progress");
    var errors = document.getElementById("errors");

    progress_bar.max = urls_count;
    progress_bar.value = 0;

    download_btn.disabled = true;
    progress_div.style.display = "";
    errors.style.display = "none";
    errors.tBodies[0].innerHTML = "";

    var download_url = function(url) {
      chrome.downloads.download({ url: url, saveAs: false }, function(url) {
        return function(id) {
          progress_bar.value = ++progress;

          if (progress >= urls_count) {
            download_btn.disabled = false;
            progress_div.style.display = "none";
          }

          if (chrome.runtime.lastError.message) {
            errors.style.display = "table";
            errors.tBodies[0].insertRow().insertCell().textContent = chrome.runtime.lastError.message + ": " + url;
          }
        };
      }(url));
    };

    urls.map(download_url);
  };
  document.getElementById("load-file-wrapper").onclick = function() { file_input.click(); };
};

