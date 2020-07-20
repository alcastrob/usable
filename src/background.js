'use strict'

import constant from './const.js'

// You have full access to the browser API here but can't access the current page

chrome.browserAction.onClicked.addListener(extensionClicked);

function extensionClicked(tab) {
  //Now we send a message to the contentScript to signal that the user clicked on the extension icon.
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      type: "extensionButtonPressed"
    });
  });
}

chrome.runtime.onMessage.addListener(function (request) {
  switch (request.type) {
    case constant.MSG_DOWNLOADNOTES:
      generateDownload(request.data);
      break;
  }
});

function generateDownload(data) {
  var blob = new Blob(data.fileContents, {
    type: 'text/plain'
  });
  var url = URL.createObjectURL(blob);
  chrome.downloads.download({
    url: url,
    filename: data.fileName
  });
}