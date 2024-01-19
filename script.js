let currentSong=new Audio();
let songs;
let currFolder;
let song;
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
async function getSongs(folder) {
  currFolder=folder
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();
  // console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
   songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3"))
      songs.push(element.href.split(`/${folder}/`)[1]);
  }
  song=songs
  let songUL = document
  .querySelector(".songList")
  .getElementsByTagName("ul")[0];
  songUL.innerHTML=""
for (const song of songs) {
  songUL.innerHTML += `<li>
  <img class="invert" src="img/music.svg" alt="" />
  <div class="info">
    <div>${song.replaceAll("%20", " ")}</div>
    
  </div>
    <div class="playNow">
      <span>Play Now</span>
      <img class="invert" src="img/play.svg" alt="">
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
}
const playMusic = (track,pause=false) => {
    // let audio=new Audio("/songs/"+track)
    currentSong.src=`/${currFolder}/`+track
    if(!pause){
      currentSong.play();
      play.src="img/pause.svg"
    }
    // currentSong.play();
    // play.src="pause.svg"
    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00/00:00"
    
};
async function displayAlbums(){
  let a = await fetch(`http://127.0.0.1:5500/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let ulElement = div.querySelector("ul")
  let anchors=ulElement.querySelectorAll("a")
  let cardContainer=document.querySelector(".cardContainer")
  let array=Array.from(anchors)
  for(let index=0;index<array.length;index++){
    const e=array[index];
    if(e.href.includes("/songs")){
      // console.log(e.href)
      let folder=(e.href.split("/").slice(-2)[1])
      let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
      let response = await a.json();
      // console.log(response)
      cardContainer.innerHTML+=`<div data-folder="${folder}" class="card">
      <div class="play">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 20V4L19 12L5 20Z"
            stroke="#141B34"
            fill="#000"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <img
        src="/songs/${folder}/cover.jpg"
        alt=""
      />
      <h2>${response.title}</h2>
      <p>${response.description}</p>
    </div>`
    }
  }
  Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click",async item=>{
      songs=await getSongs(`songs/${item.currentTarget.dataset.folder}`)
      
    })
  })
  // console.log(anchors)
  // console.log(div)
}
async function main() {
  await getSongs("songs/ncs");
  playMusic(songs[0],true)
  displayAlbums()
  // console.log(songs);

  play.addEventListener("click",()=>{
    if(currentSong.paused){
        currentSong.play()
        play.src="img/pause.svg"
    }
    else{
        currentSong.pause()
        play.src="img/play.svg"
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
  document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left="0"
  })
  document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-100%"
  })
  prev.addEventListener("click",()=>{
    currentSong.pause()
    let index=song.indexOf(currentSong.src.split("/").slice(-1)[0])
    if((index-1)>=0)
    playMusic(song[index-1])
  })
  next.addEventListener("click",()=>{
    currentSong.pause()
    let index=song.indexOf(currentSong.src.split("/").slice(-1)[0])
    if((index+1)<song.length)
    playMusic(song[index+1])
  })
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    currentSong.volume=parseInt(e.target.value)/100;
  })
  document.querySelector(".volume>img").addEventListener("click",e=>{
    if(e.target.src.includes("img/volume.svg")){
      e.target.src=e.target.src.replace("img/volume.svg","img/mute.svg")
      currentSong.volume=0;
      document.querySelector(".range").getElementsByTagName("input")[0].value=0;
    }
    else{
      e.target.src=e.target.src.replace("img/mute.svg","img/volume.svg")
      currentSong.volume=.1;
      document.querySelector(".range").getElementsByTagName("input")[0].value=15
    }
  })
  
  
}
main();
