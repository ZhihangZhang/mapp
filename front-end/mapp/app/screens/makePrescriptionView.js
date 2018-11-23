import * as React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  AppRegistry
} from "react-native";
// or any pure javascript modules available in npm
import { Card, CheckBox } from "react-native-elements"; // 0.19.1
import settings from "../config/settings";
import postData from "../lib/postData";
import genAlert from "../components/generalComponents/genAlert";
import DateTimePicker from "react-native-modal-datetime-picker";
import { Picker, Header, Content, Button, Text } from "native-base";

export default class MakePrescriptionView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      medication: "",
      dosage: 0,
      dosageUnit: "",
      amountInitial: 0,
      startDate: null,
      endDate: null,
      frequency: 0,
      isStartDateTimePickerVisible: false,
      isEndDateTimePickerVisible: false
    };
  }

  // date time picker handlers
  _showStartDateTimePicker = () =>
    this.setState({ isStartDateTimePickerVisible: true });
  _hideStartDateTimePicker = () =>
    this.setState({ isStartDateTimePickerVisible: false });
  _handleStartDatePicked = date => {
    console.log("A start date has been picked: ", date);
    this.setState({ startDate: date });
    this._hideStartDateTimePicker();
  };

  _showEndDateTimePicker = () =>
    this.setState({ isEndDateTimePickerVisible: true });
  _hideEndDateTimePicker = () =>
    this.setState({ isEndDateTimePickerVisible: false });
  _handleEndDatePicked = date => {
    console.log("An end date has been picked: ", date);
    this.setState({ endDate: date });
    this._hideEndDateTimePicker();
  };

  mockOnPress = () => {
    genAlert(JSON.stringify(this.state));
  };

  createPrescriptionOnPress = () => {
    const patient = this.props.navigation.getParam("patient", {});
    const user = this.props.navigation.getParam("user", {});
    const url = settings.REMOTE_SERVER_URL + settings.PRESCRIPTION_RES;

    const json = {
      patient: patient.id,
      doctor: user.id,
      medication: "Amoxicillin",
      dosageUnit: "Gram",
      amountInitial: 20,
      dosageSchedule: [
        {
          // firstDose: new Date(Date.now() + (30 * 1000)),
          // minutesBetweenDoses: 1,
          firstDose: "2018-11-20T17:13:45.725Z",
          minutesBetweenDoses: 1440,
          dosage: 0.5
        }
      ]
    };

    return postData(url, json)
      .then(response => {
        genAlert(
          "Form Input handler has not been implemented",
          "but a mock prescription has been created"
        );
        this.props.navigation.goBack();
      })
      .catch(error => {
        genAlert("Failed to create a new prescription", error.message);
      });
  };

  render() {
    return (
      <ScrollView style={{ padding: 20 }}>
        <Text style={styles.formSection}>Medication Information</Text>
        <TextInput
          style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="Medication Name"
          placeholderTextColor="#009CC6"
          autoCapitalize="none"
          onChangeText={value => this.setState({ medication: value })}
        />
        <TextInput
          keyboardType="numeric"
          style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="Initial Amount"
          placeholderTextColor="#009CC6"
          autoCapitalize="none"
          onChangeText={value => this.setState({ amountInitial: Number(value) })}
        />
        <TextInput
          keyboardType="numeric"
          style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="Frequency (in minutes)"
          placeholderTextColor="#009CC6"
          autoCapitalize="none"
          onChangeText={value => this.setState({ frequency: Number(value) })}
        />
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          underlineColorAndroid="transparent"
          placeholder="Dosage"
          placeholderTextColor="#009CC6"
          autoCapitalize="none"
          onChangeText={value => this.setState({ dosage: Number(value) })}
        />
        <Picker
          mode="dropdown"
          placeholder="Dosage Unit"
          textStyle={{ color: "#009CC6" }}
          itemStyle={{
            backgroundColor: "#d3d3d3",
            marginLeft: 0,
            paddingLeft: 10
          }}
          itemTextStyle={{ color: "#788ad2" }}
          selectedValue={this.state.dosageUnit}
          onValueChange={itemValue => this.setState({ dosageUnit: itemValue })}
        >
          <Picker.Item label="Gram" value="Gram" />
          <Picker.Item label="Liter" value="Liter" />
        </Picker>


        <Button
          bordered
          style={styles.button}
          onPress={this._showStartDateTimePicker}
        >
          <Text style={styles.buttonText}>Choose a start date </Text>
        </Button>
        <DateTimePicker
          mode="datetime"
          isVisible={this.state.isStartDateTimePickerVisible}
          onConfirm={this._handleStartDatePicked}
          onCancel={this._hideStartDateTimePicker}
        />

        <Button
          bordered
          style={styles.button}
          onPress={this._showEndDateTimePicker}
        >
          <Text style={styles.buttonText}>Choose a end date</Text>
        </Button>
        <DateTimePicker
          mode="datetime"
          isVisible={this.state.isEndDateTimePickerVisible}
          onConfirm={this._handleEndDatePicked}
          onCancel={this._hideEndDateTimePicker}
        />

        {/* <Button style={styles.button} onPress={this.createPrescriptionOnPress}> */}
        <Button style={styles.button} onPress={this.mockOnPress}>
          <Text>Create a new prescription</Text>
        </Button>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  formSection: {
    fontSize: 20,
    padding: 5,
    margin: 10,
    color: "black"
  },
  input: {
    margin: 10,
    height: 40,
    padding: 10,
    borderColor: settings.THEME_COLOR,
    borderWidth: 1,
    borderRadius: 7
  },
  button: {
    margin: 10,
    alignItems: "center",
    borderColor: settings.THEME_COLOR
  },
  buttonText: {
    color: settings.THEME_COLOR
  }
});
AppRegistry.registerComponent(
  "MakePrescriptionView",
  () => MakePrescriptionView
);
