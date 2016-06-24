/**
 * @file sketch.ino
 * @author Brett Lempereur <b.lempereur@outlook.com>
 *
 * Fix for the shaky SL030 interface that uses an external Arduino and
 * PN532 module to read RFID and emit events over serial.
 */

#include <Wire.h>
#include <SPI.h>
#include <Adafruit_PN532.h>

// Adafruit PN532 RFID module over I2C.
Adafruit_PN532 nfc(2, 3);

// Delay between reads.
const uint16_t DELAY = 100;

/**
 * Initialise serial and the PN532 module.
 */
void setup()
{

  // Initialise the RFID board.
  nfc.begin();
  if (!nfc.getFirmwareVersion()) {
    Serial.println("error,Could not initialise PN532 module");
  }
  nfc.setPassiveActivationRetries(0x01);
  nfc.SAMConfig();
  Serial.println("status,Initialised PN532 module");

  // Initialise serial at the standard baud rate.
  Serial.begin(9600);

}

/**
 * Main loop that continuously passively scans for RFID cards and reports
 * their presence or absence over serial.
 */
void loop()
{
  uint8_t uid[] = {0, 0, 0, 0, 0, 0, 0};
  uint8_t n;

  // Report the presence and absence of cards constantly over the serial
  // interface, we rely in a report-by-exception node in Node-RED to notice
  // changes in state.
  bool present = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &n);
  if (present) {
    Serial.print("present,");
    for (uint8_t i = 0; i < n; i++) {
      Serial.print(uid[i], HEX);
    }
    Serial.println("");
  } else {
    Serial.println("removed");
  }

  delay(DELAY);

}
