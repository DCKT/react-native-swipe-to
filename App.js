/**
 * @flow
 */

import React, { Component } from "react"
import { StyleSheet, View, PanResponder, Animated, Dimensions, Alert, Text } from "react-native"
import moment from "moment"

const { width } = Dimensions.get("window")

const renderBorder = (color: string) => ({
  borderLeftColor: color,
  borderTopColor: color
})

export default class App extends Component<{}> {
  constructor() {
    super()
    this.state = {
      pan: new Animated.ValueXY()
    }
  }

  componentWillMount() {
    // Add a listener for the delta value change
    this._val = { x: 0, y: 0 }
    this.state.pan.addListener(value => (this._val = value))

    // Initialize PanResponder with move handling
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => true,
      onPanResponderMove: (e, gesture) => {
        const position = {
          dx: 0
        }

        if (gesture.moveX >= gesture.x0) {
          position.dx = this.state.pan.x
        }

        if (gesture.dx > width - 120) {
          position.dx = width - 120
        }

        return Animated.event([null, position])(e, gesture)
      },
      onPanResponderRelease: (e, gesture) => {
        if (gesture.dx > width - 120) {
          this._onGestureEnd()
        } else {
          Animated.spring(this.state.pan, {
            toValue: { x: 0, y: 0 },
            friction: 10
          }).start()
        }
      }
    })
  }

  render() {
    const panStyle = {
      transform: this.state.pan.getTranslateTransform()
    }

    return (
      <View>
        <View style={styles.container}>
          <Animated.View {...this.panResponder.panHandlers} style={[panStyle, styles.circle]}>
            <View style={styles.arrowContainer}>
              <View style={[styles.arrow, renderBorder("rgba(28, 190, 210, 0.4)")]} />
              <View style={[styles.arrow, renderBorder("rgba(28, 190, 210, 0.7)")]} />
              <View style={[styles.arrow, renderBorder("rgba(28, 190, 210, 1)")]} />
            </View>
          </Animated.View>
          <Text style={styles.text}>Inside text with animation</Text>
        </View>
        <Text>{moment().format("MMMM Do YYYY, h:mm:ss a")}</Text>
      </View>
    )
  }

  _onGestureEnd = () => {
    Alert.alert("Gesture end")
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: -1,
    height: 80,
    backgroundColor: "#1CBED2",
    padding: 10,
    margin: 10,
    borderRadius: 50,
    elevation: 3
  },
  circle: {
    backgroundColor: "#fff",
    elevation: 3,
    width: 80,
    height: 60,
    borderRadius: 30,
    zIndex: 2
  },
  text: {
    position: "absolute",
    width: "100%",
    zIndex: 1,
    left: 10,
    top: "50%",
    textAlign: "center",
    fontSize: 16,
    transform: [
      {
        translateY: -0.5
      }
    ]
  },
  arrowContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  arrow: {
    borderLeftColor: "red",
    borderTopColor: "red",
    borderLeftWidth: 3,
    borderTopWidth: 3,
    width: 20,
    height: 20,
    marginLeft: -7,
    transform: [
      {
        rotate: "134deg"
      }
    ]
  }
})
