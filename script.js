let currentSong=new Audio();

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
      return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3"))
      songs.push(element.href.split("/songs/")[1]);
  }
  return songs;
}
const playMusic = (track,pause=false) => {
    // let audio=new Audio("/songs/"+track)
    currentSong.src="/songs/"+track
    if(!false){
      currentSong.play();
      play.src=pause.svg
    }
    currentSong.play();
    play.src="pause.svg"
    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00/00:00"
};
async function main() {
  let songs = await getSongs();
  playMusic(songs[0],true)
  console.log(songs);
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
    // console.log(songUL)
  for (const song of songs) {
    songUL.innerHTML += `<li>
    <img class="invert" src="music.svg" alt="" />
    <div class="info">
      <div>${song.replaceAll("%20", " ")}</div>
      <div>Varun</div>
    </div>
      <div class="playNow">
        <span>Play Now</span>
        <img class="invert" src="play.svg" alt="">
      </div>
    </li>`;
  }
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
    //   console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
  play.addEventListener("click",()=>{
    if(currentSong.paused){
        currentSong.play()
        play.src="pause.svg"
    }
    else{
        currentSong.pause()
        play.src="play.svg"
    }
  })
  currentSong.addEventListener("timeupdate",()=>{
    document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
    document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%"
  })
  document.querySelector(".seekbar").addEventListener("click",e=>{
    let value=(e.offsetX/e.target.getBoundingClientRect().width)*100
    document.querySelector(".circle").style.left=(value)+"%";
    currentSong.currentTime=((currentSong.duration)*value)/100
  })
}
main();
