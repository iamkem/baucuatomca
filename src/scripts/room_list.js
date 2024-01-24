import { StoreManager } from "./store.js";
const { ipcRenderer } = require("electron");
const firebase = require("firebase/compat/app");
require("firebase/compat/firestore");

const db = firebase.firestore();

const roomListElement = document.querySelector(".room_list");

function onEnterRoomClick(room) {
  const me = StoreManager.get("player");

  const roomInfo = {
    ...room,
    players: [...room.players, me],
  };

  db.collection("rooms")
    .doc(room.id)
    .update(roomInfo)
    .then(() => {
      console.log("Room updated");

      StoreManager.set("currentRoomId", room.id);

      ipcRenderer.send("start-game", {
        isHost: false,
      });
    });
}

function updateRoomList(rooms) {
  roomListElement.innerHTML = "";

  rooms.forEach((room, i) => {
    if (room.players.length > 0) {
      const roomElement = document.createElement("div");

      roomElement.className = "room";

      roomElement.innerHTML = `
      <span class="room_order">Phòng ${i}</span>
      <span class="room_name">${room.name}</span>
      <span class="room_players">Số người chơi: ${room.players.length}</span>
      <span class="room_password_icon">${room.password ? "🔒" : ""}</span>
      <button class="btn_enter_room" data-room-id="${
        room.id
      }">Vào phòng</button>`;

      roomListElement.appendChild(roomElement);
    } else {
      db.collection("rooms").doc(room.id).delete();
    }
  });

  document.querySelectorAll(".btn_enter_room").forEach((btn) => {
    btn.addEventListener("click", () => {
      const roomId = btn.getAttribute("data-room-id");

      db.collection("rooms")
        .doc(roomId)
        .get()
        .then((doc) => {
          const room = doc.data();

          onEnterRoomClick(room);
        });
    });
  });
}

const createRoom = () => {
  const roomName = document.getElementById("create_name").value;
  // const roomPassword = document.getElementById("create_password").value;

  if (roomName.length > 0) {
    const me = StoreManager.get("player");

    const roomInfo = {
      name: roomName,
      players: [me],
      password: "",
      host: me,
    };

    db.collection("rooms")
      .add(roomInfo)
      .then((room) => {
        console.log("Room created");

        db.collection("rooms")
          .doc(room.id)
          .update({
            id: room.id,
            ...roomInfo,
          })
          .then(() => {
            console.log("Room updated");

            StoreManager.set("currentRoomId", room.id);

            ipcRenderer.send("start-game", {
              isHost: true,
            });
          });
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
