const lib_cmn = {
  // Utils functions
  hasProperty: function(obj, propName) {
    /* Checks if an object has a property with given name */
      if ( (obj == null) || (!propName) )
        return false
      else if (obj.hasOwnProperty('propName') || propName in obj)
        return true
      else
        return false
  },

  // Go to default page
  goToDefaultPage: function() {
    const baseUri = conf['adminTool']['baseUri']
    sessionStorage.setItem('activeTab', '#link-welcome')
    window.location = baseUri + '/dmt/'
  },

  // Go to home page
  goToHomePage: function() {
    sessionStorage.setItem('activeTab', null)
    window.location = conf['adminTool']['baseUri'] + '/'
  },

  // Loads html snippet
  includeHTML: function(cb) {
    let self = this
    let z, i, elmnt, file, xhttp
    z = document.getElementsByTagName('*')
    for (i = 0; i < z.length; i++) {
      elmnt = z[i]
      file = elmnt.getAttribute('include-html')
      if (file) {
        xhttp = new XMLHttpRequest()
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            elmnt.innerHTML = this.responseText
            elmnt.removeAttribute('include-html')
            self.includeHTML(cb)
            self.includeJs(cb)
          }
        }
        xhttp.open('GET', file, true)
        xhttp.send()
        return
      }
    }
    if (cb) cb()
  },

  // Loads js snippet
  includeJs: function(cb) {
    let self = this
    let z, i, elmnt, file, xhttp
    z = document.querySelectorAll('script')
    for (i = 0; i < z.length; i++) {
      elmnt = z[i]
      file = elmnt.getAttribute('include-js')
      if (file) {
        xhttp = new XMLHttpRequest()
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            const newElmnt = document.createElement('script')
            newElmnt.textContent = this.responseText
            if (elmnt.parentNode) {
              elmnt.parentNode.insertBefore(newElmnt, elmnt.nextSibling)
              elmnt.parentNode.removeChild(elmnt)
            }
            if (cb) cb()
          }
        }
        xhttp.open('GET', file, true)
        xhttp.send()
        return
      }
    }
  }

}
