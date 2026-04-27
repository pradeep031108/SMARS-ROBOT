let device, server, service, characteristic;

const SERVICE_UUID = "12345678-1234-1234-1234-1234567890ab";
const CHARACTERISTIC_UUID = "abcd1234-5678-1234-5678-abcdef123456";

async function connect() {
try {
device = await navigator.bluetooth.requestDevice({
acceptAllDevices: true,
optionalServices: [SERVICE_UUID]
});

```
server = await device.gatt.connect();
service = await server.getPrimaryService(SERVICE_UUID);
characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);

document.getElementById("status").innerText = "Connected";

await characteristic.startNotifications();

characteristic.addEventListener('characteristicvaluechanged', (event) => {
  let value = new TextDecoder().decode(event.target.value);
  document.getElementById("distance").innerText = value + " cm";
});
```

} catch (e) {
alert("Connection Failed");
}
}

function send(cmd) {
if (!characteristic) return;
characteristic.writeValue(new TextEncoder().encode(cmd));
}

function press(cmd) {
send(cmd);
}

/* SPEED */
document.getElementById("speed").addEventListener("input", function () {
send("V" + this.value);
});

/* JOYSTICK */
let stick = document.getElementById("stick");
let joystick = document.getElementById("joystick");

joystick.addEventListener("touchmove", (e) => {
let rect = joystick.getBoundingClientRect();
let x = e.touches[0].clientX - rect.left - 120;
let y = e.touches[0].clientY - rect.top - 120;

stick.style.left = (x + 70) + "px";
stick.style.top = (y + 70) + "px";

if (y < -40) send('F');
else if (y > 40) send('B');
else if (x < -40) send('L');
else if (x > 40) send('R');
});

joystick.addEventListener("touchend", () => {
stick.style.left = "70px";
stick.style.top = "70px";
send('S');
});
