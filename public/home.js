let $ = document.querySelector.bind(document);

function joinRoom () {
  var roomId = $('#roomId').value;
  if(roomId != '')
  window.location.href='/room/'+roomId;
	else {
    $('roomId').error("required");
	}
}