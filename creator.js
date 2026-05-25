/*
QEMU Command Creator
Copyright (C) 2026  Farofa Playz <FarofaCodez>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

function valueof(id) {
	return document.querySelector(`#${id}`).value;
}

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
				<option value="ide">IDE (slower, supported by most guests)</option>
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
