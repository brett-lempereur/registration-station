/**
 * @file scores.js
 * @author Brett Lempereur
 *
 * Client for the scoreboard service.
 */

/**
 * Update the contents of the named score table with the scores at the
 * given URI.
 */
function updateTable(name, uri) {
  $.get(uri, function (doc) {
    var content = '';
    for (var i = 0; i < Math.min(doc.length, 8); i++) {
      var timestamp = new Date(doc[i].timestamp);
      content += '<tr>';
      content += '<td>' + doc[i].name + '</td>';
      content += '<td>' + timestamp.getHours() + ':' + timestamp.getMinutes() + '</td>';
      content += '<td>' + doc[i].score + '</td>';
      content += '</tr>';
    }
    $(name + ' tbody').html(content);
  });
}

// Update the top score table every fifteen seconds.
window.setInterval(function () {
  updateTable('#top-scores', 'http://localhost:5000/api/top');
}, 5000);

// Update the recent score table every fifteen seconds.
window.setInterval(function () {
  updateTable('#recent-scores', 'http://localhost:5000/api/recent');
}, 5000);
