/**
 * Global obkjects
 */

// Ordered list of screens
const screens = [
  '#screen-welcome',
  '#screen-status',
  '#screen-pushtx',
  '#screen-pairing',
  '#screen-xpubs-tools',
  '#screen-addresses-tools',
  '#screen-blocks-rescan'
]

// Ordered list of menu items
const tabs = [
  '#link-welcome',
  '#link-status',
  '#link-pushtx',
  '#link-pairing',
  '#link-xpubs-tools',
  '#link-addresses-tools',
  '#link-blocks-rescan'
]

// Mapping of scripts associaed to screens
const screenScripts = new Map()


/**
 * UI initialization
 */
function initTabs() {
  // Activates the current tab
  let currentTab = sessionStorage.getItem('activeTab')
  if (!currentTab)
    currentTab = '#link-welcome'
  $(currentTab).addClass('active')

  // Sets event handlers
  for (let tab of tabs) {
    $(tab).click(function() {
      $(sessionStorage.getItem('activeTab')).removeClass('active')
      sessionStorage.setItem('activeTab', tab)
      $(tab).addClass('active')
      preparePage()
    })
  }
}

function initPages() {
  // Dynamic loading of screens and scripts
  lib_cmn.includeHTML(preparePage)
  //lib_cmn.includeJs()
  // Dojo version
  let lblVersion = sessionStorage.getItem('lblVersion')
  if (lblVersion == null) {
    lib_api.getPairingInfo().then(apiInfo => {
      lblVersion = 'v' + apiInfo['pairing']['version'] + ' beta'
      sessionStorage.setItem('lblVersion', lblVersion)
      $('#dojo-version').text(lblVersion)
    })
  } else {
    $('#dojo-version').text(lblVersion)
  }
}

function preparePage() {
  const activeTab = sessionStorage.getItem('activeTab')
  for (let idxTab in tabs) {
    const screen = screens[idxTab]
    if (tabs[idxTab] == activeTab) {
      $(screen).show()
      if (screenScripts.has(screen))
        screenScripts.get(screen).preparePage()
    } else {
      $(screen).hide()
    }
  }
}


/**
 * Processing on loading completed
 */
$(document).ready(function() {
  // Refresh the access token if needed
  setInterval(() => {
      lib_auth.refreshAccessToken()
  }, 300000)

  initTabs()
  initPages()

  // Set event handlers
  $('#btn-logout').click(function() {
    lib_auth.logout()
  })
})
