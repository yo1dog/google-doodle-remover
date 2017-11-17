// ==UserScript==
// @name         Google Doodle Remover
// @namespace    http://yo1.dog
// @version      1.0.0
// @description  Replaces Google Doodles with the normal logo.
// @author       Mike "yo1dog" Moore
// @match        https://www.google.com/*
// @grant        none
// @icon         https://raw.githubusercontent.com/yo1dog/google-doodle-remover/master/icon.ico
// @run-at       document-start
// ==/UserScript==


// listen for changes to the document element (and all child elements)
const observer = new MutationObserver(mutations => {
  // on each change attempt to remove Google doodles
  const success = removeGoogleDoodle(document);
  if (success) {
    // once the doodle has been removed, stop listening for changes
    observer.disconnect();
  }
});
observer.observe(document.documentElement, {childList: true, subtree: true});


/**
 * Removes Google doodles by replacing the logo container elements with elements
 * that contain the original logo.
 * 
 * @param {Document} doc
 */
function removeGoogleDoodle(doc) {
  // get the logo (main page) and mini logo (search results page) elements
  const containerElem     = getGoogleLogoContainerElem    (doc);
  const miniContainerElem = getGoogleMiniLogoContainerElem(doc);
  
  let success = false;
  
  if (containerElem) {
    // if the logo container exists, replace it with one that does not contain a doodle
    const newContainerElem = createGoogleLogoContainerElem(doc);
    containerElem.parentElement.replaceChild(newContainerElem, containerElem);
    success = true;
  }
  if (miniContainerElem) {
    // if the mini logo container exists, replace it with one that does not contain a doodle
    const newMiniContainerElem = createGoogleMiniLogoContainerElem(doc);
    miniContainerElem.parentElement.replaceChild(newMiniContainerElem, miniContainerElem);
    success = true;
  }
  
  return success;
}


/**
 * Returns the div element that contains the Google logo or doogle.
 * @param {Document} doc
 * @returns {HTMLElement}
 */
function getGoogleLogoContainerElem(doc) {
  return doc.getElementById('lga');
}

/**
 * Returns the div element that contains the Google mini logo or doogle.
 * @param {Document} doc
 * @returns {HTMLElement}
 */
function getGoogleMiniLogoContainerElem(doc) {
  return doc.getElementById('logocont');
}

/**
 * Creates a div element displays the original Google logo.
 * @param {Document} doc
 * @returns {Element}
 */
function createGoogleLogoContainerElem(doc) {
  const template = doc.createElement('template');
  template.innerHTML =  `
    <div id="lga" style="height:233px;margin-top:89px">
      <img
        id="hplogo"
        alt="Google"
        src="/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
        srcset="/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png 1x, /images/branding/googlelogo/2x/googlelogo_color_272x92dp.png 2x"
        style="padding-top:109px"
        width="272"
        height="92"
        onload="window.lol&amp;&amp;lol()"
      >
    </div>
  `;
  
  return template.content.firstElementChild;
}

/**
 * Creates a div element that displays the original Google mini logo.
 * @param {Document} doc
 * @returns {Element}
 */
function createGoogleMiniLogoContainerElem(doc) {
  const template = doc.createElement('template');
  template.innerHTML =  `
    <div id="logocont" class="nojsv logocont">
      <h1>
        <a
          id="logo"
          title="Go to Google Home"
          href="https://www.google.com/webhp?hl=en&amp;sa=X&amp;ved=0ahUKEwjr-8TP2f_WAhVq4YMKHRTXCzMQPAgD"
          data-hveid="3"
        >
          <img
            alt="Google"
            src="/images/branding/googlelogo/2x/googlelogo_color_120x44dp.png"
            width="120"
            height="44"
            onload="typeof google==='object'&amp;&amp;google.aft&amp;&amp;google.aft(this)"
          >
        </a>
      </h1>
    </div>
  `;
  
  return template.content.firstElementChild;
}