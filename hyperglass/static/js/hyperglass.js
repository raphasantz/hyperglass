// Get the list of routers for the selected Network

var progress = ($('#progress'));
var resultsbox = ($('#resultsbox'));
resultsbox.hide();
progress.hide();
listNetworks ();
clientIP ();

function clientIP () {
  $.getJSON("https://jsonip.com?callback=?", function(data) {
    clientip = data.ip
  });
};

function listNetworks () {
  let networklist = $('#network');
  networklist.empty();
  networklist.prop('selectedIndex', 0);
  const url = '/networks';
  $.getJSON(url, function (data) {
    $.each(data, function (key, entry) {
      networklist.append($('<option></option>').attr('value', entry.network).text('AS'+entry.network));
    })
  })
}

// Update the list of routers for the *default* selected network
$( document ).ready(function(){
  var defaultasn = $ ( "#network" ).val();
  $.ajax({
    url: `/routers/${defaultasn}`,
    context: document.body,
    type: 'get',
    success: function (data) {
      selectedRouters = JSON.parse(data)
      console.log(selectedRouters)
      updateRouters(selectedRouters);
    },
    error: function (err) {
      console.log(err)
    }
  })
})

$('#network').on('change', () => {
  var asn = $("select[id=network").val()
  $.ajax({
    url: `/routers/${asn}`,
    type: 'get',
    success: function (data) {
      updateRouters(JSON.parse(data));

    },
    error: function (err) {
      console.log(err)
    }
  })
})

function updateRouters (routers) {
  routers.forEach(function (r) {
    $('#router').append($("<option>").attr('value', r.location).attr('type', r.type).text(r.location))
  })
}

// Submit Form Action
$('#lgForm').on('submit', function () {

  // Regex to match any IPv4 host address or CIDR prefix
  var ipv4_any = new RegExp('^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(/(3[0-2]|2[0-9]|1[0-9]|[0-9]))?$');
  // Regex to match any IPv6 host address or CIDR prefix
  var ipv6_any = new RegExp('^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))(\/((1(1[0-9]|2[0-8]))|([0-9][0-9])|([0-9])))?$');
  // Regex to match an IPv4 CIDR prefix only (excludes a host address)
  var ipv4_cidr = new RegExp('^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/(3[0-2]|2[0-9]|1[0-9]|[0-9])?$');
  // Regex to match an IPv6 CIDR prefix only (excludes a host address)
  var ipv6_cidr = new RegExp('^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/((1(1[0-9]|2[0-8]))|([0-9][0-9])|([0-9]))?$');
  var ipv6_host = new RegExp('^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))?$')
  var cmd = $('#cmd option:selected').val();
  var routerType = $('#router option:selected').attr('type');
  var ipprefix = $('#ipprefix').val();
  var router = $('#router option:selected').val();
  // Filters selectedRouters JSON object to only the selected router, returns all attributes passed from Flask's `get_routers`
  var routersJson = selectedRouters.filter(r => r.location === router);
  // Filters above to value of `requiresIP6Cidr` as passed from Flask's `get_routers`
  var requiresIP6Cidr = routersJson[0].requiresIP6Cidr

  // If BGP lookup, and lookup is an IPv6 address *without* CIDR prefix (e.g. 2001:db8::1, NOT 2001:db8::/48), and requiresIP6Cidr
  // is true, show an error.
  $('#ipprefix_error').hide()
  $('#ipprefix').removeClass('is-danger')
  if (cmd == 'bgp_route' && ipv6_host.test(ipprefix) == true && requiresIP6Cidr == true) {
    console.log('matched requires ipv6 cidr')
    $('#ipprefix_error').show()
    $('#ipprefix').addClass('is-danger')
    $('#ipprefix_error').html(`
      <br>
      <article class="message is-danger is-small" style="display: block;">
        <div class="message-header" style="display: block;">
          Invalid Input
        </div>
        <div id="error" style="display: block;" class="message-body">
          This router requires IPv6 BGP lookups to be and exact match in CIDR notation.
        </div>
      </article>
      `);
  }
  // If ping, and lookup is an IPv4 address *with* CIDR prefix (e.g. 192.0.2.0/24, NOT 192.0.2.1), show an error.
  else if (ipv4_cidr.test(ipprefix) == true && cmd == 'ping') {
    $('#ipprefix_error').show()
    $('#ipprefix').addClass('is-danger')
    $('#ipprefix_error').html(`
      <br>
      <article class="message is-danger is-small" style="display: block;">
        <div class="message-header" style="display: block;">
          Invalid Input
        </div>
        <div id="error" style="display: block;" class="message-body">
          <code>ping</code> does not allow network masks.
        </div>
      </article>
      `);
    }
  // If traceroute, and lookup is an IPv4 address *with* CIDR prefix (e.g. 192.0.2.0/24, NOT 192.0.2.1), show an error.
  else if (ipv4_cidr.test(ipprefix) == true && cmd == 'traceroute') {
    $('#ipprefix_error').show()
    $('#ipprefix').addClass('is-danger')
    $('#ipprefix_error').html(`
      <br>
      <article class="message is-danger is-small" style="display: block;">
        <div class="message-header" style="display: block;">
          Invalid Input
        </div>
        <div id="error" style="display: block;" class="message-body">
          <code>traceroute</code> does not allow network masks.
        </div>
      </article>
      `);
    }
  // If ping, and lookup is an IPv6 address *with* CIDR prefix (e.g. 2001:db8::/48, NOT 2001:db8::1), show an error.
  else if (ipv6_cidr.test(ipprefix) == true && cmd == 'ping') {
    $('#ipprefix_error').show()
    $('#ipprefix').addClass('is-danger')
    $('#ipprefix_error').html(`
      <br>
      <article class="message is-danger is-small" style="display: block;">
        <div class="message-header" style="display: block;">
          Invalid Input
        </div>
        <div id="error" style="display: block;" class="message-body">
          <code>ping</code> does not allow network masks.
        </div>
      </article>
      `);
    }
  // If traceroute, and lookup is an IPv6 address *with* CIDR prefix (e.g. 2001:db8::/48, NOT 2001:db8::1), show an error.
  else if (ipv6_cidr.test(ipprefix) == true && cmd == 'traceroute') {
    $('#ipprefix_error').show()
    $('#ipprefix').addClass('is-danger')
    $('#ipprefix_error').html(`
      <br>
      <article class="message is-danger is-small" style="display: block;">
        <div class="message-header" style="display: block;">
          Invalid Input
        </div>
        <div id="error" style="display: block;" class="message-body">
          <code>traceroute</code> does not allow network masks.
        </div>
      </article>
      `);
    }
    else submitForm();
  });

var submitForm = function() {
  progress.hide();
  var cmd = $('#cmd option:selected').val();
  var cmdtitle = cmd.replace('_', ': ');
  var network = $('#network option:selected').val();
  var router = $('#router option:selected').val();
  var routername = $('#router option:selected').text();
  var ipprefix = $('#ipprefix').val();
  var routerType = $('#router option:selected').attr('type');

  $('#output').text("")
  $('#queryInfo').text("")

  $('#queryInfo').html(`
    <div class="field is-grouped is-grouped-multiline">
      <div class="control">
        <div class="tags has-addons">
          <span class="tag lg-tag-loctitle">AS${network}</span>
          <span class="tag lg-tag-loc">${routername}</span>
        </div>
      </div>
      <div class="control">
        <div class="tags has-addons">
          <span class="tag lg-tag-cmdtitle">${cmdtitle}</span>
          <span class="tag lg-tag-cmd">${ipprefix}</span>
        </div>
      </div>
    </div>
`)

  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/lg', true);
  resultsbox.show()
  progress.show()
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
  xhr.send(JSON.stringify({router: router, cmd: cmd, ipprefix: ipprefix}))
  console.log(JSON.stringify({router: router, cmd: cmd, ipprefix: ipprefix}));

  xhr_timer = window.setInterval(function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      progress.hide();
      window.clearTimeout(xhr_timer);
    }
    var output = document.getElementById('output')
    if (xhr.status == 415){
      console.log(XMLHttpRequest.status, 'error')
      var output = document.getElementById('output')
      $('#ipprefix').addClass('is-danger')
      output.innerHTML =
      '<br>' +
      '<div class="notification is-danger" id="output">' +
      xhr.responseText +
      '</div>'
    }
    if (xhr.status == 405){
      console.log(XMLHttpRequest.status, 'error')
      var output = document.getElementById('output')
      $('#ipprefix').addClass('is-warning')
      output.innerHTML =
      '<br>' +
      '<div class="notification is-warning" id="output">' +
      xhr.responseText +
      '</div>'
    }
    else if (xhr.status == 200){
      console.log(xhr.status, 'success')
      output.innerHTML =
      '<br>' +
      '<div class="content">' +
      '<p class="query-output" id="output">' +
      xhr.responseText +
      '</p>' +
      '</div>'
    }
    else if (xhr.status == 429){
      console.log(xhr.status, 'rate limit reached');
      $("#ratelimit").addClass("is-active");
    }
  }, 500);

  xhr.addEventListener("error", function(e) {
    console.log("error: " + e);
  });
}