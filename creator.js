// SPDX-License-Identifier: MIT

function valueof(id) {
	return document.querySelector(`#${id}`).value;
}

// This is the function that does everything
function createCommand() {
	let command = `qemu-system-x86_64 -display gtk,gl=on \
-accel ${valueof("accel")} \
-M ${valueof("machine")} \
-m ${valueof("ram")} \
-cpu ${valueof("cpu")} \
-device ${valueof("gpu")}`
	const storage = document.querySelector("#storageDrives");
	storage.childNodes.forEach(element => {
		if (element.className == "storageDrive") {
			const interface = element.querySelector(".storageInterface").value;
			command += ` -drive file="${element.querySelector(".storagePath").value}",if=${interface}`;
		}
	});

	command += " ";

	extraDevices.forEach((device) => {
		command += `-device ${device} `
	});

	document.querySelector("#command").innerText = command;
}

const storageDiv = document.querySelector("#storageDrives");
const storageDriveTemplate = `
		<div id="storageDrive<<<ID>>>" class="storageDrive">
			<span>Storage drive <<<ID>>></span>
			<br>
			<label for="storagePath<<<ID>>>">File path</label>
			<input type="text" name="storagePath<<<ID>>>" id="storagePath<<<ID>>>" class="storagePath">
			<br>
			<label for="storageInterface<<<ID>>>">Interface</label>
			<select name="storageInterface<<<ID>>>" id="storageInterface<<<ID>>>" class="storageInterface">
				<option value="virtio" selected>VirtIO (fast, requires special guest drivers)</option>
				<option value="ide">IDE (slower, supported by most OSes)</option>
			</select>
			
			<br>
		</div>
`;

let storageDrives = 0;

function newStorageDrive() {
	const storageDrive = storageDriveTemplate.replaceAll("<<<ID>>>", String(storageDrives));
	storageDrives++;
	storageDiv.innerHTML += storageDrive;
}
newStorageDrive();

function removeStorageDrive() {
	const element = document.getElementById(`storageDrive${storageDrives - 1}`);
	storageDrives--;
	element.remove();
}

let extraDevices = ["virtio-sound"];
const extraDevicesDiv = document.querySelector("#extraDevices");
function updateExtraDevices() {
	extraDevicesDiv.innerHTML = "";
	extraDevices.forEach((value) => {
		extraDevicesDiv.innerHTML += `<div class="extraDevice"><span>${value}</span><span> </span><button onclick="removeExtraDevice('${value}');">Remove</button></div>`
	});
}
updateExtraDevices();

function removeExtraDevice(device) {
	extraDevices.splice(extraDevices.indexOf(device), 1);
	updateExtraDevices();
}
