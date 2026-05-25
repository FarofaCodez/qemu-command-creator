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

function checkbox(id) {
	const value = document.querySelector("#gl").checked;
	if (value == true) {
		return "on";
	} else {
		return "off";
	}
}

function createCommand() {
	let command = `qemu-system-x86_64 \
-accel ${valueof("accel")} \
-M ${valueof("machine")} \
-m ${valueof("ram")} \
-cpu ${valueof("cpu")} \
-device ${valueof("gpu")} \
-nic user,model=${valueof("nic")} \
-display ${valueof("dBackend")},gl=${checkbox("gl")}`
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

class StorageDrive {
	constructor() {
		this.file = "";
		this.if = "virtio";
	}
}

const storageDrivesDiv = document.querySelector("#storageDrives");
let storageDrives = [];
function newStorageDrive() {
	storageDrives.push(new StorageDrive());
	updateStorageDrives();
}
newStorageDrive();

function removeStorageDrive(drive) {
	storageDrives.splice(drive, 1);
	updateStorageDrives();
}
function updateStorageDrives() {
	let i = 0;
	storageDrivesDiv.innerHTML = "";
	storageDrives.forEach((element) => {
		storageDrivesDiv.innerHTML += `<div class="storageDrive">
			<span>Storage drive</span>
			<br>
			<label>File path</label>
			<input type="text" class="storagePath">
			<br>
			<label>Interface</label>
			<select class="storageInterface">
				<option value="virtio" selected>VirtIO (fast, requires special guest drivers)</option>
				<option value="ide">IDE (slower, supported by most guests)</option>
			</select>
			<button onclick="removeStorageDrive(${i})">Remove drive</button>
			<br><br>
		</div>
		`
		i++;
	});
}

let extraDevices = [];
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
