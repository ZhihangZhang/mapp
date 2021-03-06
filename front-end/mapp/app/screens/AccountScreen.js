import React, { Component } from "react";
import settings from "../config/settings";
import { Button, Text } from "react-native-elements";
import { StyleSheet, AppRegistry } from "react-native";
import { View } from "react-native";
import { USER_TYPE } from "../config/constants";
import Spinner from "react-native-loading-spinner-overlay";

class AccountScreen extends Component {
  state = {
    spinner: false
  };

  // polling on server
  componentDidMount() {
    const { email, password, userType } = this.props.screenProps.user;
    const form = { email, password };
    const url = settings.REMOTE_SERVER_URL + settings.LOGIN_RES;

    if (userType === USER_TYPE.PATIENT) {
      this.props.screenProps.fetchDoctors(email, password);
    }

    this.timer = setInterval(() => {
      this.props.screenProps.onSignIn(url, form);
      if (userType === USER_TYPE.PATIENT) {
        this.props.screenProps.fetchDoctors(email, password);
      }
    }, settings.POLLING_RATE);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null; // here...
  }

  render() {
    const firstName = this.props.screenProps.user.firstName;
    const lastName = this.props.screenProps.user.lastName;
    const id = this.props.screenProps.user.id;

    return (
      <View style={styles.buttonContainer}>
        <Spinner
          visible={this.state.spinner}
          textStyle={styles.spinnerTextStyle}
        />
        <Text style={styles.subtitle}>
          {firstName} {lastName}
        </Text>
        <Text style={styles.subtitle}>id: {id}</Text>
        <Button
          buttonStyle={styles.bottomButton}
          backgroundColor={settings.THEME_COLOR}
          title="SIGN OUT"
          onPress={() => {
            this.setState({ spinner: true });
            clearInterval(this.timer);
            this.timer = null; // here...
            setTimeout(() => {
              this.setState(
                { spinner: false },
                this.props.screenProps.onSignOut
              );
            }, 2000);
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 10
  },
  subtitle: {
    backgroundColor: "transparent",
    color: settings.THEME_COLOR,
    fontSize: 20,
    padding: 10
  },
  spinnerTextStyle: {
    color: "#FFF"
  }
});

export default AccountScreen;
AppRegistry.registerComponent("AccountScreen", () => AccountScreen);
