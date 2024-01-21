import { StoreManager } from "./store.js";
const { ipcRenderer } = require("electron");
const firebase = require("firebase/compat/app");
require("firebase/compat/firestore");

const db = firebase.firestore();

const roomListElement = document.querySelector(".room_list");

function updateRoomList(rooms) {
  roomListElement.innerHTML = "";

  rooms.forEach((room, i) => {
    const roomElement = document.createElement("div");

    roomElement.className = "room";

    roomElement.innerHTML = `
      <span class="room_order">Phòng ${i}</span>
      <span class="room_name">${room.name}</span>
      <span class="room_players">Số người chơi: ${room.players.length}</span>
      <span class="room_password_icon">${room.password ? "🔒" : ""}</span>
      <button class="btn_enter_room">Vào phòng</button>
    `;

    roomListElement.appendChild(roomElement);
  });
}

const createRoom = () => {
  const roomName = document.getElementById("create_name").value;
  // const roomPassword = document.getElementById("create_password").value;

  if (roomName.length > 0) {
    const me = StoreManager.get("player");

    db.collection("rooms")
      .add({
        name: roomName,
        players: [me],
        password: "",
        host: me,
      })
      .then((room) => {
        console.log("Room created");

        StoreManager.set("currentRoomId", room.id);

        ipcRenderer.send("start-game");
      })
      .catch(() => {});
  }
};

window.onload = () => {
  db.collection("rooms").onSnapshot((snapshot) => {
    const rooms = snapshot.docs.map((doc) => doc.data());

    if (rooms.length > 0) {
      updateRoomList(rooms);
    } else {
      roomListElement.innerHTML = "<h4>Trống</h4>";
    }
  });

  document
    .getElementById("btn_create_room")
    .addEventListener("click", createRoom);
};