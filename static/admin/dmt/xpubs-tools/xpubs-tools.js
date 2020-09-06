const screenXpubsToolsScript = {

  explorerInfo: null,

  preparePage: function() {
    this.getExplorerInfo()
    this.showSearchForm()
    $("#xpub").focus()
    // Sets the event handlers
    $('#btn-go').click(() => {this.searchXpub()})
    $('#btn-reset').click(() => {this.showSearchForm()})
    $('#btn-rescan').click(() => {this.rescanXpub()})
    $('#xpubs-tool').keyup(evt => {
      if (evt.keyCode === 13) {
        this.searchXpub()
      }
    })
  },

  getExplorerInfo: function() {
    lib_api.getExplorerPairingInfo().then(explorerInfo => {
      this.explorerInfo = explorerInfo
      console.log(explorerInfo)
    }).catch(e => {
      lib_msg.displayErrors(lib_msg.extractJqxhrErrorMsg(e))
      console.log(e)
    })
  },

  searchXpub: function() {
    const xpub = $('#xpub').val()
    return lib_api.getXpubInfo(xpub)
      .then(xpubInfo => {
        if (xpubInfo && xpubInfo['tracked']) {
          this.setXpubDetails(xpubInfo)
          this.showXpubDetails()
        } else {

        }
      }).then(() => {
        const jsonData = {'active': xpub}
        return lib_api.getWallet(jsonData).then(walletInfo => {
          // Display the txs
          const txs = walletInfo['txs']
          for (let tx of txs)
            this.setTxDetails(tx)
          // display the UTXOs
          const utxos = walletInfo['unspent_outputs']
          $('#xpub-nb-utxos').text(utxos.length)
          for (let utxo of utxos)
            this.setUtxoDetails(utxo)
        })
      }).catch(e => {
        lib_msg.displayErrors(lib_msg.extractJqxhrErrorMsg(e))
        console.log(e)
      })
  },

  setXpubDetails: function(xpubInfo) {
    $('#xpub-value').text(xpubInfo['xpub'])
    $('#xpub-import-date').text(xpubInfo['created'])
    $('#xpub-deriv-type').text(xpubInfo['derivation'])
    $('#xpub-nb-txs').text(xpubInfo['n_tx'])
    $('#xpub-nb-utxos').text('-')
    const balance = parseInt(xpubInfo['balance']) / 100000000
    $('#xpub-balance').text(`${balance} BTC`)
    $('#xpub-deriv-account').text(xpubInfo['account'])
    $('#xpub-deriv-depth').text(xpubInfo['depth'])
    $('#xpub-idx-unused-ext').text(xpubInfo['unused']['external'])
    $('#xpub-idx-derived-ext').text(xpubInfo['derived']['external'])
    $('#xpub-idx-unused-int').text(xpubInfo['unused']['internal'])
    $('#xpub-idx-derived-int').text(xpubInfo['derived']['internal'])
  },

  setTxDetails: function(tx) {
    const txid = tx['hash']
    const txidDisplay = `${txid.substring(0,50)}...`
    const amount = parseInt(tx['result']) / 100000000
    const amountLabel = amount < 0 ? amount : `+${amount}`
    const amountStyle = amount < 0 ? 'amount-sent' : 'amount-received'
    const date = lib_fmt.unixTsToLocaleString(tx['time'])
    const txUrl = lib_cmn.getExplorerTxUrl(txid, this.explorerInfo)

    const newRow = `<tr><td colspan="2">&nbsp;</td></tr>
      <tr>
        <td class="table-label" colspan="2">
          <a href="${txUrl}" target="_blank">${txidDisplay}</a>
        </td>
      </tr>
      <tr>
        <td class="table-label">Amount</td>
        <td class="table-value ${amountStyle}">${amountLabel} BTC</td>
      </tr>
      <tr>
        <td class="table-label">Block height</td>
        <td class="table-value">${tx['block_height']}</td>
      </tr>
      <tr>
        <td class="table-label">Date</td>
        <td class="table-value">${date}</td>
      </tr>`

    $('#table-list-txs tr:last').after(newRow)
  },

  setUtxoDetails: function(utxo) {
    const txid = utxo['tx_hash']
    const txidVout = `${txid.substring(0,50)}...:${utxo['tx_output_n']}`
    const amount = parseInt(utxo['value']) / 100000000
    const txUrl = lib_cmn.getExplorerTxUrl(txid, this.explorerInfo)

    const newRow = `<tr><td colspan="2">&nbsp;</td></tr>
      <tr>
        <td class="table-label" colspan="2">
          <a href="${txUrl}" target="_blank">${txidVout}</a>
        </td>
      </tr>
      <tr>
        <td class="table-label">Amount</td>
        <td class="table-value">${amount} BTC</td>
      </tr>
      <tr>
        <td class="table-label">Address</td>
        <td class="table-value">${utxo['addr']}</td>
      </tr>
      <tr>
        <td class="table-label">Confirmations</td>
        <td class="table-value">${utxo['confirmations']}</td>
      </tr>`

    $('#table-list-utxos tr:last').after(newRow)
  },

  showSearchForm: function() {
    $('#xpubs-tool-details').hide()
    $('#xpub').val('')
    $('#xpubs-tool-search-form').show()
  },

  showXpubDetails: function() {
    $('#xpubs-tool-search-form').hide()
    $('#xpubs-tool-details').show()
  },

  rescanXpub: function() {

  },

}

screenScripts.set('#screen-xpubs-tools', screenXpubsToolsScript)
