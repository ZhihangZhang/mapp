// this file is similar to index.js in older version react-native
// for more info:
import React, { Component } from "react";
import { Root } from "native-base";
import { AppRegistry } from "react-native";
import { SafeAreaView } from "react-navigation";
import AuthStackNavigator from "./app/config/authNavs";
import PatientTabNavigator from "./app/config/patientNavs";
import DoctorTabNavigator from "./app/config/doctorNavs";
import { connect } from "react-redux";
import { fetchUser, fetchDoctors, clearUser } from "./app/actions/actions";
import { USER_TYPE } from "./app/config/constants";
import genAlert from "./app/components/generalComponents/genAlert";

type Props = {};
class App extends Component<Props> {
  render() {
    const isLoggedIn = this.props.isLoggedIn;
    const user = this.props.user;
    let navigator;
    if (isLoggedIn) {
      if (user.userType === USER_TYPE.DOCTOR) {
        navigator = (
          <DoctorTabNavigator
            screenProps={{
              user: user,
              patients: this.props.patients,
              onSignOut: this.props.clearUser,
              onSignIn: this.props.fetchUser,
              pendingRequests: this.props.pendingRequests
            }}
          />
        );
      } else {
        navigator = (
          <PatientTabNavigator
            screenProps={{
              user: user,
              onSignOut: this.props.clearUser,
              pendingRequests: this.props.pendingRequests,
              fetchDoctors: this.props.fetchDoctors,
              doctors: this.props.doctors,
              prescriptions:  { byId:
             { '1':
               { id: 1,
                 doctor: 1,
                 patient: 1,
                 medication: 'Cefixime 400',
                 dosageUnit: 'Pills',
                 amountInitial: 100,
                 amountRemaining: 60 } },
                 allIds: [ 1 ] }
          }
        }
          />
        );
      }
    } else {
      navigator = (
        <AuthStackNavigator screenProps={{ onSignIn: this.props.fetchUser }} />
      );
    }

    return (
      <Root>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
          {navigator}
        </SafeAreaView>
      </Root>
    );
  }
}
function mapStateToProps(state) {
  return {
    isFetchingUser: state.isFetchingUser,
    fetchingUserError: state.fetchingUserError,
    isFetchingDoctors: state.isFetchingDoctors,
    fetchingDoctorError: state.fetchingDoctorError,
    isLoggedIn: state.isLoggedIn,
    user: state.user,
    patients: state.patients,
    doctors: state.doctors,
    pendingRequests: state.pendingRequests
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchUser: (url, form) =>
      dispatch(fetchUser(url, form)).catch(error => {
        genAlert("Failed to fetch user info", error.message);
      }),

    fetchDoctors: () =>
      dispatch(fetchDoctors()).catch(error => {
        genAlert("Failed to fetch doctors' info", error.message);
      }),

    clearUser: () => dispatch(clearUser())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

AppRegistry.registerComponent("App", () => App);
