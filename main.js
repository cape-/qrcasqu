/*!
  * QRCasqú - QR pass ticket issuing
  * Copyright (C) 2021 Lautaro Capella <laucape@gmail.com>
  *
  * This program is free software: you can redistribute it and/or modify
  * it under the terms of the GNU General Public License as published by
  * the Free Software Foundation, either version 3 of the License, or
  * (at your option) any later version.
  *
  * This program is distributed in the hope that it will be useful,
  * but WITHOUT ANY WARRANTY; without even the implied warranty of
  * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  * GNU General Public License for more details.
  *
  * You should have received a copy of the GNU General Public License
  * along with this program.  If not, see <https://www.gnu.org/licenses/>.
  */
const _localItemName = 'CASQU-Tickets00';

const _dom = {
    // inputs
    entrada: document.getElementById("entrada"),
    nombre: document.getElementById("nombre"),
    apellido: document.getElementById("apellido"),
    email: document.getElementById("email"),
    telefono: document.getElementById("telefono"),
    inputPlateaMenor: document.getElementById("inputPlateaMenor"),
    inputPlateaMayor: document.getElementById("inputPlateaMayor"),
    inputPreferencialMenor: document.getElementById("inputPreferencialMenor"),
    inputPreferencialMayor: document.getElementById("inputPreferencialMayor"),
    importe: document.getElementById("importe"),
    // btns
    btnPlateaMenor: document.getElementById("btnPlateaMenor"),
    btnPlateaMayor: document.getElementById("btnPlateaMayor"),
    btnPreferencialMenor: document.getElementById("btnPreferencialMenor"),
    btnPreferencialMayor: document.getElementById("btnPreferencialMayor"),
    newTicket: document.getElementById("newTicket"),
    generateTicket: document.getElementById("generateTicket"),
    // other
    WAlink: document.getElementById("WALink"),
    qrcodeContainer: document.getElementById("qrcodeContainer"),
    get QRimg() { return document.querySelector('#qrcodeContainer img') }
};

const _qrcode = new QRCode(_dom.qrcodeContainer, {
    width: PREFERENCIAS.QRCode.width || 260,
    height: PREFERENCIAS.QRCode.height || 260,
    colorDark: PREFERENCIAS.QRCode.colorDark || "#212529",
    colorLight: PREFERENCIAS.QRCode.colorLight || "#ffffff",
    correctLevel: PREFERENCIAS.QRCode.correctLevel || QRCode.CorrectLevel.L
});

var _lastEntrada = null;

function QRgenerate(QRstring) {
    var _QRfeed = QRstring.normalize("NFD").replace(/\p{Diacritic}/gu, "");

    console.log("GENERATING QR|string =", QRstring)
        // console.log("QR feed  ", _QRfeed)
    _qrcode.makeCode(_QRfeed);
}

function getLocalStorage() {
    return JSON.parse(localStorage.getItem(_localItemName) || "[]");
}

function setLocalStorage(ticketData) {
    return localStorage.setItem(_localItemName, JSON.stringify(ticketData));
}

function pushTicketToLocalStorage(ticketData) {
    setLocalStorage([
        ...getLocalStorage(),
        ticketData
    ]);
}

function generateTicket(ticketData) {
    //CIRCO CASQÚ|Entrada:44|Nombre:Luis|Apellido:Perez|Apellido:luis@gmail.com#
    var _QRstring = `CIRCO CASQU|`          +
        `Entrada:${ticketData.entrada}|`    +
        `Nombre:${ticketData.nombre}|`      +
        `Apellido:${ticketData.apellido}|`  +
        `Email:${ticketData.email}|`        +
        `Importe:${ticketData.importe}|`;
    _QRstring += ticketData.plateaMenor ? `Platea Menor:${ticketData.plateaMenor}|` : '';
    _QRstring += ticketData.plateaMayor ? `Platea Mayor:${ticketData.plateaMayor}|` : '';
    _QRstring += ticketData.preferencialMenor ? `Preferencial Menor:${ticketData.preferencialMenor}|` : '';
    _QRstring += ticketData.preferencialMayor ? `Preferencial Mayor:${ticketData.preferencialMayor}|` : '';
    _QRstring += '#';
    QRgenerate(_QRstring);

    pushTicketToLocalStorage(ticketData);
    _dom.btnPlateaMenor.classList.add("disabled");
    _dom.btnPlateaMayor.classList.add("disabled");
    _dom.btnPreferencialMenor.classList.add("disabled");
    _dom.btnPreferencialMayor.classList.add("disabled");
    _dom.inputPlateaMenor.disabled = _dom.inputPlateaMayor.disabled =
        _dom.inputPreferencialMenor.disabled = _dom.inputPreferencialMayor.disabled =
        _dom.nombre.disabled = _dom.apellido.disabled = _dom.email.disabled = true;
    if (_dom.QRimg) _dom.QRimg.classList.remove("visually-hidden");
    _dom.importe.classList.remove("bg-white");
    _dom.newTicket.classList.remove("visually-hidden");
    _dom.generateTicket.classList.add("visually-hidden");

}

function nextEntrada() {
    if(!_lastEntrada)
        _lastEntrada = getLocalStorage().reduce((a, c) => Number(c.entrada) > a ? Number(c.entrada) : a, 0) + 1;
    return ++_lastEntrada;
}

function createTicket() {
    // Next entrada
    _dom.entrada.value = nextEntrada();
    // Initialize fields
    _dom.nombre.value = "";
    _dom.apellido.value = "";
    _dom.email.value = "";
    _dom.telefono.value = "";
    _dom.inputPlateaMenor.value = 0;
    _dom.inputPlateaMayor.value = 0;
    _dom.inputPreferencialMenor.value = 0;
    _dom.inputPreferencialMayor.value = 0;
    updateImporte();
    // Enable controls
    _dom.btnPlateaMenor.classList.remove("disabled");
    _dom.btnPlateaMayor.classList.remove("disabled");
    _dom.btnPreferencialMenor.classList.remove("disabled");
    _dom.btnPreferencialMayor.classList.remove("disabled");
    _dom.inputPlateaMenor.disabled = _dom.inputPlateaMayor.disabled =
        _dom.inputPreferencialMenor.disabled = _dom.inputPreferencialMayor.disabled =
        _dom.nombre.disabled = _dom.apellido.disabled = _dom.email.disabled = false;
    if (_dom.QRimg) _dom.QRimg.classList.add("visually-hidden");
    _dom.importe.classList.add("bg-white");
    _dom.newTicket.classList.add("visually-hidden");
    _dom.generateTicket.classList.remove("visually-hidden");
    return;
}

function processTicket() {
    var _ticketData = {
        entrada: Number(_dom.entrada && _dom.entrada.value),
        nombre: _dom.nombre && _dom.nombre.value && _dom.nombre.value.toUpperCase(),
        apellido: _dom.apellido && _dom.apellido.value && _dom.apellido.value.toUpperCase(),
        email: _dom.email && _dom.email.value,
        plateaMenor: Number(_dom.inputPlateaMenor && _dom.inputPlateaMenor.value),
        plateaMayor: Number(_dom.inputPlateaMayor && _dom.inputPlateaMayor.value),
        preferencialMenor: Number(_dom.inputPreferencialMenor && _dom.inputPreferencialMenor.value),
        preferencialMayor: Number(_dom.inputPreferencialMayor && _dom.inputPreferencialMayor.value),
        importe: calculateTotal(),
        fecha: new Date()
    };

    return !_ticketData.entrada ? _dom.entrada.focus() :
        !_ticketData.nombre ? _dom.nombre.focus() :
        !_ticketData.apellido ? _dom.apellido.focus() :
        !_ticketData.email ? _dom.email.focus() :
        (_ticketData.plateaMenor +
            _ticketData.plateaMayor +
            _ticketData.preferencialMenor +
            _ticketData.preferencialMayor) === 0 ? _dom.inputPlateaMenor.focus() :
        generateTicket(_ticketData);
}

function updateTelefono(e) {
    return (!_dom.telefono.value || _dom.telefono.value.length !== 10) ? updateWALinkHref(null) :
        updateWALinkHref(`+549${_dom.telefono.value}`, "Presentá este código QR en los molinetes de ingreso.\nQué te diviertas!!\n*Circo Casqú*");
}

function updateWALinkHref(telefono, texto) {
    if (telefono) {
        _dom.WAlink.href = `https://web.whatsapp.com/send?phone=${encodeURI(telefono)}&text=${encodeURI(texto)}&app_absent=0`;
        _dom.WAlink.classList.remove("disabled");
    } else {
        _dom.WAlink.href = "";
        _dom.WAlink.classList.add("disabled");
    }
    return;
}

function copyQRtoClipboard() {
    return _dom.QRimg ? navigator.clipboard.write(_dom.QRimg.src) : null; // TODO: Implementar
}

function updateImporte() {
    _dom.importe.value = "$ " + calculateTotal().toFixed(2);
}

function calculateTotal() {
    return (Number(_dom.inputPlateaMenor.value) * PRECIOS.PlateaMenor) +
        (Number(_dom.inputPlateaMayor.value) * PRECIOS.PlateaMayor) +
        (Number(_dom.inputPreferencialMenor.value) * PRECIOS.PreferencialMenor) +
        (Number(_dom.inputPreferencialMayor.value) * PRECIOS.PreferencialMayor);
}

function addTicket(ticketType) {
    if (_dom["input" + ticketType]) {
        _dom["input" + ticketType].value++;
        updateImporte();
        return;
    }
    throw new Error("Unknown ticketType");
}

_dom.inputPlateaMenor.addEventListener("change", updateImporte);
_dom.inputPlateaMayor.addEventListener("change", updateImporte);
_dom.inputPreferencialMenor.addEventListener("change", updateImporte);
_dom.inputPreferencialMayor.addEventListener("change", updateImporte);

// function WAcall(_WAtel) {
//     var _WAurl = `https://wa.me/+549${_WAtel}`;
//     console.log("Open ", _WAurl)
// }

// function sendToWA() {
//     var _telefono = getElementById("telefono");
//     return (!_telefono.value || _telefono.value.length !== 10) ? _telefono.focus() :
//         WAcall(_telefono.value);
// }
