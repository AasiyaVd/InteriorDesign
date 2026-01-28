const roomKeywords = [
  "room","bedroom","living room","kitchen","bathroom",
  "interior","indoor","apartment","studio","wall","floor","ceiling","tile","window","door","curtain",

  // Interior hints
  "interior","indoor","room"
];

let model = null;

async function loadModel() {
  model = await mobilenet.load();
  console.log("AI Model Loaded");
}
loadModel();

async function checkIfRoom(imageElement) {
  if (!model) {
    alert("AI is still loading, please wait.");
    return false;
  }

  const predictions = await model.classify(imageElement);
  const labels = predictions.map(p => p.className.toLowerCase());

  return labels.some(label =>
    roomKeywords.some(word => label.includes(word))
  );
}

function uploadRoom() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
      const allowed = await checkIfRoom(img);

      if (!allowed) {
        alert("❌ This is not a room image. Upload only room images.");
        return;
      }

      const canvas = document.getElementById("canvas");
      canvas.innerHTML = "";
      img.id = "room";
      canvas.appendChild(img);
    };
  };

  input.click();
}
