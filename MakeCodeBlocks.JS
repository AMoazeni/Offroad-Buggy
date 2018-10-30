let steering = 0
let steer_right = 0
let steer_left = 0
let steer_straight = 0
let throttle = 0

// Interrupt Function Activated
radio.onReceivedValue(function (name, value) {
    led.toggle(0, 0)
    if (name == "throttle") {
        if (value > 0) {
            kitronik.motorOn(kitronik.Motors.Motor1, kitronik.MotorDirection.Forward, Math.abs(value))
            kitronik.motorOn(kitronik.Motors.Motor2, kitronik.MotorDirection.Forward, Math.abs(value))
        } else if (value < 0) {
            kitronik.motorOn(kitronik.Motors.Motor1, kitronik.MotorDirection.Reverse, Math.abs(value))
            kitronik.motorOn(kitronik.Motors.Motor2, kitronik.MotorDirection.Reverse, Math.abs(value))
        } else {
            kitronik.motorOff(kitronik.Motors.Motor1)
            kitronik.motorOff(kitronik.Motors.Motor2)
        }
    } else if (name == "steering") {
        if (value > 0) {
            pins.servoWritePin(AnalogPin.P1, value)
        } else if (value < 0) {
            pins.servoWritePin(AnalogPin.P1, value)
        } else {
            pins.servoWritePin(AnalogPin.P1, steer_straight)
        }
    }
})

// Adjust Front Wheel Steering Servo Values
radio.setGroup(12)
steer_straight = 122
steer_left = 150
steer_right = 90

// Infinity Loop For Throttle And Steering
// Throttle Is OFF Until Radio Control Message Is Recieved
basic.forever(function () {
    throttle = 0
    if (input.buttonIsPressed(Button.A)) {
        throttle = 100
        basic.showArrow(ArrowNames.North)
    } else if (input.buttonIsPressed(Button.B)) {
        throttle = -100
        basic.showArrow(ArrowNames.South)
    }
    radio.sendValue("throttle", throttle)
    steering = steer_straight
    if (input.acceleration(Dimension.X) < -512) {
        steering = steer_left
        basic.showArrow(ArrowNames.West)
    } else if (input.acceleration(Dimension.X) > 512) {
        steering = steer_right
        basic.showArrow(ArrowNames.East)
    }
    radio.sendValue("steering", steering)
    basic.clearScreen()
})
