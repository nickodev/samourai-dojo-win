const statusScript = {

  preparePage: function() {
    this.refreshApiStatus()
    this.refreshPushTxStatus()
    // Refresh API status
    setInterval(() => {this.refreshApiStatus()}, 60000)
    // Refresh PushTx status
    setInterval(() => {this.refreshPushTxStatus()}, 60000)
  },

  refreshApiStatus: function() {
    return lib_api.getApiStatus().then(apiStatus => {
      if (apiStatus) {
        $('#tracker-status-ind').text('UP')
        $('#tracker-uptime').text(apiStatus['uptime'])
        $('#tracker-chaintip').text(apiStatus['blocks'])
      }
    }).catch(e => {
      $('#tracker-status-ind').text('-')
      $('#tracker-uptime').text('-')
      $('#tracker-chaintip').text('-')
      lib_msg.displayErrors(lib_msg.extractJqxhrErrorMsg(e))
      console.log(e)
    })
  },

  refreshPushTxStatus: function() {
    lib_api.getPushtxStatus().then(pushTxStatus => {
      if (pushTxStatus) {
        const data = pushTxStatus['data']
        $('#node-status-ind').text('UP')
        const uptime = lib_cmn.timePeriod(data['uptime'])
        $('#node-uptime').text(uptime)
        $('#node-chaintip').text(data['bitcoind']['blocks'])
        $('#node-version').text(data['bitcoind']['version'])
        const network = data['bitcoind']['testnet'] == true ? 'testnet' : 'mainnet'
        $('#node-network').text(network)
        $('#node-conn').text(data['bitcoind']['conn'])
        $('#node-relay-fee').text(data['bitcoind']['relayfee'])
      }
    }).catch(e => {
      $('#node-status-ind').text('-')
      $('#node-uptime').text('-')
      $('#node-chaintip').text('-')
      $('#node-version').text('-')
      $('#node-network').text('-')
      $('#node-conn').text('-')
      $('#node-relay-fee').text('-')
      lib_msg.displayErrors(lib_msg.extractJqxhrErrorMsg(e))
      console.log(e)
    })
  },

}

screenScripts.set('#screen-status', statusScript)