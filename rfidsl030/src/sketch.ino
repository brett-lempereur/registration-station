/**
 * @file sketch.ino
 * @author Brett lempereur
 *
 *
 */

#include <Wire.h>
#include <SL018.h>

// Interface to the SL030 RFID module.
SL018 rfid;

// Delay between reads.
const uint16_t DELAY = 100;

/**
 * Initialise serial and the SL030 module.
 */
void setup()
{

  // Initialise the I2C interface.
  Wire.begin();

  // Initialise serial at the standard baud rate.
  Serial.begin(9600);

}

/**
 * Main loop that continuously passively scans for RFID cards and reports
 * their presence or absence over serial.
 */
void loop()
{

  // Check if a tag is available.
  rfid.seekTag();
  if (rfid.available()) {
    Serial.print("present,");
    Serial.println(rfid.getTagString());
  } else {
    Serial.println("removed");
  }

  delay(DELAY);

}
