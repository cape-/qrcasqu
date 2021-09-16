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
const 
    PRECIOS = {
        PlateaMenor: 150,
        PlateaMayor: 250,
        PreferencialMenor: 300,
        PreferencialMayor: 500
    },
    PREFERENCIAS = {
        QRCode: {
            width: 260,
            height: 260,
            colorDark: "#212529",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.L
        }
    };
