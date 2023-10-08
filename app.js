import firebase from "firebase";
import "firebase/storage";
import { upload } from "./upload.js";

const firebaseConfig = {
	apiKey: "AIzaSyCyLdSghz1CouVGqkXLYJtoC2Qi6sx5YvY",
	authDomain: "fe-upload-a201b.firebaseapp.com",
	databaseURL:
		"https://fe-upload-a201b-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "fe-upload-a201b",
	storageBucket: "fe-upload-a201b.appspot.com",
	messagingSenderId: "387821229193",
	appId: "1:387821229193:web:15613a693c32ce9513a258",
};

firebase.initializeApp(firebaseConfig);
let urls = []
const db = firebase.database();
const storage = firebase.storage();
const button = document.getElementById("button");
const title = document.getElementById("title");
const description = document.getElementById("description");
const select = document.getElementById("select");
console.log(title);
upload("#file", {
	multi: true,
	accept: [".png", ".jpg", ".jpeg", ".gif"],
	async onUpload(files, blocks) {
		 files.forEach((file, index) => {
			const ref = storage.ref(`images/${file.name}`);
			const task = ref.put(file);
			
			

			task.on(
				"state_changed",
				(snapshot) => {
					const percentage =
						((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(
							0
						) + "%";
					const block = blocks[index].querySelector(".preview-info-progress");
					block.textContent = percentage;
					block.style.width = percentage;
				},
				(error) => {
					console.log(error);
				},
				() => {
					task.snapshot.ref.getDownloadURL().then((url) => {
						console.log("Download URL", url);
						urls.push(url);
					});
				}
			);
		});
		
	},
});
button.addEventListener('click', ()=>{
	const dbRef = db.ref("name");
	const data = [
		{
			name: title.value,
			description: description.value,
			category: select.value,
			img: urls,
		},
		
		
	];
			dbRef.set(data, function (error) {
				if (error) {
					console.log("Ошибка при отправке данных: " + error);
				} else {
					console.log("Данные успешно отправлены.");
					console.log(title, description, select);
				}
			});
			
			dbRef.once("value", function (snapshot) {
				const data = snapshot.val();
				console.log(data);
			});
	console.log('button clicked' + title.value + description.value + select.value + "тут лежат url " + urls);
})



//const title = document.getElementById("title");
// const description = document.getElementById("description");
// const select = document.getElementById("select");