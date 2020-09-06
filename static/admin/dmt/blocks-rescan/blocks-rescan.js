const screenBlocksRescanScript = {

  preparePage: function() {
    $("#rescan-from-height").focus()
    // Sets the event handlers
    $('#btn-go').click(() => {
      this.processRescan()
    })
    $('#blocks-rescan').keyup(evt => {
      if (evt.keyCode === 13) {
        this.processRescan()
      }
    })
  },

  processRescan: function() {
    let fromHeight = $("#rescan-from-height").val()
    let toHeight = $("#rescan-to-height").val()
    fromHeight = parseInt(fromHeight)
    toHeight = (toHeight) ? parseInt(toHeight) : fromHeight;

    lib_msg.displayMessage('Processing...');

    lib_api.getBlocksRescan(fromHeight, toHeight).then(result => {
      if (!result)
        return
      const fromHeightRes = result['fromHeight']
      const toHeightRes = result['toHeight']
      const msg = `successfully rescanned blocks between height ${fromHeightRes} and height ${toHeightRes}`
      lib_msg.displayInfo(msg)
    }).catch(e => {
      lib_msg.displayErrors(lib_msg.extractJqxhrErrorMsg(e))
      console.log(e)
    }).then(() => {
      $('#rescan-from-height').val('')
      $('#rescan-to-height').val('')
    })
  },

}

screenScripts.set('#screen-blocks-rescan', screenBlocksRescanScript)
