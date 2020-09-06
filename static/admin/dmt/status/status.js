const statusScript = {

  preparePage: function() {
    this.refreshApiStatus()
    this.refreshPushTxStatus()
    // Refresh API status
    setInterval(() => {this.refreshApiStatus()}, 300000)
    // Refresh PushTx status
    setInterval(() => {this.refreshPushTxStatus()}, 300000)
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
      console.log(e)
    })
  },

  refreshPushTxStatus: function() {
    lib_api.getPushtxStatus().then(pushTxStatus => {
      if (pushTxStatus) {
        $('#node-status-ind').text('UP')
        $('#node-uptime').text(pushTxStatus['uptime'])
        $('#node-chaintip').text(pushTxStatus['bitcoind']['blocks'])
        $('#node-version').text(pushTxStatus['bitcoind']['version'])
        const network = pushTxStatus['bitcoind']['testnet'] == true ? 'testnet' : 'mainnet'
        $('#node-network').text(network)
        $('#node-conn').text(pushTxStatus['bitcoind']['conn'])
        $('#node-relay-fee').text(pushTxStatus['bitcoind']['relayfee'])
      }
    }).catch(e => {
      $('#node-status-ind').text('-')
      $('#node-uptime').text('-')
      $('#node-chaintip').text('-')
      $('#node-version').text('-')
      $('#node-network').text('-')
      $('#node-conn').text('-')
      $('#node-relay-fee').text('-')
      console.log(e)
    })
  },

}

screenScripts.set('#screen-status', statusScript)