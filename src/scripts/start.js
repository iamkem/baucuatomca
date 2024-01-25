import { StoreManager } from "./store.js";

const { ipcRenderer } = require("electron");

const firebase = require("firebase/compat/app");
require("firebase/compat/firestore");

const db = firebase.firestore();

function checkExistingPlayer() {
  return new Promise((resolve) => {
    const player = StoreManager.get("player");

    if (!player) {
      resolve(false);
    }

    db.collection("users")
      .doc(player.id)
      .get()
      .then((user) => {
        resolve(user.exists);
      });
  });
}

function createPlayer(name) {
  return new Promise((resolve) => {
    const newPlayer = {
      name,
      money: 500000,
    };

    db.collection("users")
      .add(newPlayer)
      .then((docRef) => {
        newPlayer.id = docRef.id;

        console.log("user added ", newPlayer);

        resolve(newPlayer);
      })
      .catch((error) => {
        console.error("Error adding player: ", error);

        resolve(null);
      });
  });
}

function switchToGameMode() {
  document.querySelector(".create-name").style.display = "none";
  document.querySelector(".game-mode").style.display = "flex";
}

window.onload = async () => {
  const isExistingPlayer = await checkExistingPlayer();

  if (isExistingPlayer) {
    switchToGameMode();
  } else {
    document.getElementById("btn_start").addEventListener("click", async () => {
      const name = document.getElementById("player_name").value;

      const loading = document.getElementById("loading");

      if (name.length > 0) {
        loading.style.display = "inline-flex";

        const player = await createPlayer(name);

        StoreManager.set("player", player);

        loading.style.display = "none";

        switchToGameMode();
      }
    });
  }

  document.getElementById("btn_multi").addEventListener("click", () => {
    ipcRenderer.send("room-list");
  });
};
