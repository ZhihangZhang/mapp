import React, { Component } from "react";
import { View, ScrollView, AppRegistry } from "react-native";
import { List, ListItem, SearchBar } from "react-native-elements";
import settings from "../config/settings";
import genAlert from "../components/generalComponents/genAlert";
import checkRequestErrors from "../lib/errors";
import { FETCHING_USER_FULFILLED } from "../config/constants";
import _ from "lodash"

class DoctorListScreen extends Component {
  constructor(props) {
    super(props);

    // get patient array
    const doctorIDs = this.props.screenProps.doctors.allIds;
    const doctors = [];
    doctorIDs.forEach(id => {
      doctors.push(this.props.screenProps.doctors.byId[id]);
    });

    this.state = {
      doctors: doctors
      // state used by search bar
      // an array of doctors connected to this doctor
      // invariant: consistent with the patient states in redux store
    };
  }

  componentWillMount() {
    this.props.screenProps.fetchDoctors();
  }

  onPress = id => {
    this.props.navigation.navigate("DoctorInfo", {
      doctor: this.props.screenProps.doctors.byId[id],
      user: this.props.screenProps.user
    });
  };

  // every time props changes update internal state: doctors to
  // conform to the invariant
  componentWillReceiveProps(nextProps) {
    if (_.isEqual(nextProps.screenProps.doctors, this.props.screenProps.doctors))
      console.log("They are equal");
    else{
      const doctorIDs = nextProps.screenProps.doctors.allIds;
      const doctors = [];
      doctorIDs.forEach(id => {
        doctors.push(nextProps.screenProps.doctors.byId[id]);
      });
      this.setState({ doctors: doctors });
    }
  }


  searchFilterFunction = text => {
    const doctorIDs = this.props.screenProps.doctors.allIds;
    const doctors = [];
    doctorIDs.forEach(id => {
      doctors.push(this.props.screenProps.doctors.byId[id]);
    });
    const filteredDoctors = doctors.filter(doctor => {
      const doctorNameData = `${doctor.firstName.toUpperCase()} ${doctor.lastName.toUpperCase()}`;
      const textData = text.toUpperCase();
      return doctorNameData.indexOf(textData) > -1; // check if query text is found inside patient's name
    });
    this.setState({ doctors: filteredDoctors });
  };
  render() {
    const doctors = this.props.screenProps.doctors;
    console.log("Doctors: " + JSON.stringify(doctors))
    return (
      <View style={{flex: 1}}>
        <SearchBar
          round
          placeholder="Type Here..."
          lightTheme
          onChangeText={text => this.searchFilterFunction(text)}
          onClearText={() => this.searchFilterFunction("")}
          autoCorrect={false}
          clearIcon
        />
        <ScrollView style={{flex: 1}}>
          <List>
            {this.state.doctors.map(doctor => (
              <ListItem
                key={doctor.id}
                title={
                  "Dr. " +
                  doctor.firstName +
                  " " +
                  doctor.lastName
                }
                onPress={()=>this.onPress(doctor.id)}
              />
            ))}
          </List>
        </ScrollView>
      </View>
    );
  }
}

export default DoctorListScreen;
AppRegistry.registerComponent("DoctorListScreen", () => DoctorListScreen);
