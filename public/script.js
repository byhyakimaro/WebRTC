const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  host: 'webrtc.knownetworkssec.repl.co',
  path: '/peerjs',  
})
const myVideo = document.createElement('video')
const tagVideo = document.getElementsByTagName("video")
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
		video.style.width = (parseInt(99 / (tagVideo.length+1)))+"%";
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        console.log("Removing video");
        video.remove()
      })
    
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
	video.style.width = (parseInt(99 / (tagVideo.length+1)))+"%";
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    console.log("Removing video");
    video.remove()
		$('video').style.width = (parseInt(99 / tagVideo.length))+"%";
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
	$('video').style.width = (parseInt(99 / tagVideo.length))+"%";
}