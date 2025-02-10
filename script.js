console.log("let's write ");
let currentSong = new Audio();
let songUL;
let songs = []; // Declare the songs array globally

function convertSecondsToMinutes(seconds) {
  const minutes = Math.floor(seconds / 60); // Get the whole minutes
  const remainingSeconds = Math.floor(seconds % 60); // Get the remaining seconds as an integer

  // Format the minutes and seconds to ensure they are always two digits
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0"); // Ensure seconds is two digits

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
  let a = await fetch("http://127.0.0.1:3000/songs/"); // Await fetch() response
  let response = await a.text(); // Get response text
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  
  // Reset the songs array
  songs = [];

  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }

  return songs;
}

const playMusic = (track, pause = false) => {
  currentSong.src = "/songs/" + track;
  if (!pause) {
    currentSong.play();
    play.src = "pausebtn.svg"; // Change to pause icon
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function main() {
  let songs = await getSongs();
  playMusic(songs[0], true);

  songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUL.innerHTML +=
      `<li>
        <img class="invert" src="musicsvg.svg" alt="music-logo">
        <div class="info">
          <div class="songname">${song.replaceAll("%20", " ")}</div>
          <div class="songartist">Atharv</div>
        </div>
        <div class="playnow">
          <span>Play Now</span>
          <img class="invert" src="playbtn.svg" alt="">
        </div>
      </li>`;
  }

  // Attach an event listener to each song
  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
}

// Attach an event listener to play, next, and previous
play.addEventListener("click", () => {
  if (currentSong.paused) {
    currentSong.play();
    play.src = "pausebtn.svg";
  } else {
    currentSong.pause();
    play.src = "playbtn.svg";
  }
});

// Listen for timeupdate event
currentSong.addEventListener("timeupdate", () => {
  document.querySelector(".songtime").innerHTML = `${convertSecondsToMinutes(
    currentSong.currentTime
  )}/${convertSecondsToMinutes(currentSong.duration)}`;
  document.querySelector(".circle").style.left =
    (currentSong.currentTime / currentSong.duration) * 100 + "%";
});

// Seekbar click event
document.querySelector(".seekbar").addEventListener("click", (e) => {
  let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
  document.querySelector(".circle").style.left = percent + "%";
  currentSong.currentTime = (currentSong.duration * percent) / 100;
});

// Hamburger menu event
document.querySelector(".hamburger").addEventListener("click", () => {
  document.querySelector(".left").style.left = "0";
});

// Close button event
document.querySelector(".closebtn").addEventListener("click", () => {
  document.querySelector(".left").style.left = "-120%";
});

// Previous button event
previous.addEventListener("click", () => {
  console.log("previous clicked");
  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
  if (index - 1 >= 0) { // Fix the out of bounds issue
    playMusic(songs[index - 1]);
  }
});

// Next button event
next.addEventListener("click", () => {
  console.log("next clicked");
  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
  if (index + 1 < songs.length) { // Fix the out of bounds issue
    playMusic(songs[index + 1]);
  }
});

// Initialize the player
main();
