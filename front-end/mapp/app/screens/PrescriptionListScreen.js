import React, { Component } from "react";
import {
  Text,
  View,
  TouchableWithoutFeedback,
  AppRegistry,
  ScrollView,
  StyleSheet,
  Platform,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { Card, CardItem, Body } from "native-base";
import settings from "../config/settings";
import ActionButton from "react-native-action-button";
import genAlert from "../components/generalComponents/genAlert"
import PushNotification from "react-native-push-notification";
import ProgressBarAnimated from 'react-native-progress-bar-animated';
class PrescriptionListScreen extends Component {
  prescriptionOnPress = id => {
    this.props.navigation.navigate("PrescriptionInfo", {
      prescription: this.props.screenProps.prescriptions.byId[id]
    });
  };

  componentWillMount(){
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function(token) {
        console.log( 'TOKEN:', token );
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
          console.log( 'NOTIFICATION:', notification );

          // process the notification
          this.props.navigation.navigate("PatientInboxScreen");

          // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
          notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
        * (optional) default: true
        * - Specified if permissions (ios) and token (android and ios) will requested or not,
        * - if not, you must call PushNotificationsHandler.requestPermissions() later
        */
      requestPermissions: true,
    });
  }

  fabOnPress = () => {
    genAlert("Adding a new prescription by patients", "Has not been implemented :(");
  };

  mapPrescriptionToCard = prescription => {
    //console.log(prescription.amountRemaining);
    let amountRemaining = prescription.amountInitial - prescription.dosesTaken.length*prescription.dosageSchedule[0].dosage
    const doctor = this.props.screenProps.doctors.byId[prescription.doctor];
    PushNotification.cancelLocalNotifications({id: prescription.id});
    PushNotification.localNotificationSchedule({
      /* Android Only Properties */
      id: prescription.id, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
      ticker: "Notification to take prescription", // (optional)
      autoCancel: false, // (optional) default: true
      largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
      smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
      bigText: "It is time to take " + prescription.medication + " press to goto inbox screen", // (optional) default: "message" prop
      subText: "Time to take your medicine!", // (optional) default: none
      color: "purple", // (optional) default: system default
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      tag: 'some_tag', // (optional) add tag to message
      group: "group", // (optional) add group to message
      ongoing: true, // (optional) set whether this is an "ongoing" notification
      priority: "high", // (optional) set notification priority, default: high
      visibility: "public", // (optional) set notification visibility, default: private
      importance: "high", // (optional) set notification importance, default: high

      /* iOS and Android properties */
      title: "Time to take your medicine!", // (optional)
      message: "It is time to take " + prescription.medication + " press to goto inbox screen", // (required)
      playSound: true, // (optional) default: true
      soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      number: prescription.amountInitial / prescription.dosageSchedule.dosage, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
      repeatType: 'time', // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
      repeatTime: prescription.dosageSchedule.minutesBetweenDoses * 60000,
      date: new Date(Date.now() + 10000)//prescription.dosageSchedule.firstDose
    });
/*<Card>
  <CardItem header bordered>
    <Text style={styles.text}>{prescription.medication}</Text>
  </CardItem>
  <CardItem bordered>
    <Body>
      <View>
        <Text>Doctor: {doctor.firstName + " " + doctor.lastName}</Text>
        <Text>Dosage Unit: {prescription.dosageUnit}</Text>
        <Text>Amount Initial: {prescription.amountInitial}</Text>
      </View>
    </Body>
  </CardItem>
</Card>*/
    return (
      <ScrollView style={styles.container}>
        <Card>
          <Text style={styles.medfield}>
            Medication: <Text style={styles.fieldValue}>
               {prescription.medication}
            </Text>
          </Text>
          <Text style={styles.medfield}>
            Dosage Unit: <Text style={styles.fieldValue}>
               {prescription.dosageUnit}
            </Text>
          </Text>
          <Text style={styles.medfield}>
            Physician: <Text style={styles.fieldValue}>
              {doctor.firstName + " " + doctor.lastName}
            </Text>
          </Text>
          <Text style={styles.medfield}>
            Frequency: <Text style={styles.fieldValue}>
               Every 8 hours
            </Text>
          </Text>
          <Text style={styles.medfield}>
            Location: <Text style={styles.fieldValue}>
               Kitchen - Under the sink - in the white box
            </Text>
          </Text>
          <View style={{
            alignItems : 'center',
          }}>
              <ProgressBarAnimated
                width={barWidth}
                value={Math.round(amountRemaining / prescription.amountInitial * 100)}
                height = {20}
                backgroundColor="#6CC644"
                barAnimationDuration = {0}
              />
              <View style={styles.buttonContainer}>
                <View style={styles.buttonInner}>
                  <Text style = {styles.remainingPills}>{amountRemaining}/{prescription.amountInitial} {prescription.dosageUnit}s</Text>
                </View>
              </View>
            </View>
            <View style={{
              alignItems : 'center',
              justifyContent : 'center',
              flexDirection: 'row',
              marginLeft: 0
            }}>
            <View style={{width: '40%'}}>
            <TouchableOpacity style={styles.RenewButton}>
              <Text style = {styles.buttonText}>Renew</Text>
            </TouchableOpacity>
            </View>
            <View style={{width: '40%'}}>
            <TouchableOpacity style={styles.EditButton}>
              <Text style = {styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            </View>
          </View>
        </Card>
      </ScrollView>
    );
  };

  render() {
    const prescriptions = this.props.screenProps.prescriptions;
    const prescriptionIDs = this.props.screenProps.user.myPrescriptions;
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          {
            prescriptionIDs.map(id =>
            this.mapPrescriptionToCard(prescriptions.byId[id])
          )}
        </ScrollView>
        <ActionButton
          buttonColor={settings.THEME_COLOR}
          onPress={this.fabOnPress}
        />
      </View>
    );
  }
}

const barWidth = Dimensions.get('screen').width*0.7;

const styles = StyleSheet.create({
  text: {
    color: settings.THEME_COLOR,
    fontSize: 20
  },
  container: {
    flex: 1,
    //alignItems: 'center',
    //justifyContent: 'center',
    padding: 10,
    backgroundColor: '#ecf0f1',
  },
  fieldValue: {
    fontSize: 16,
    fontWeight: "200",
    fontFamily: 'Poppins',
    textAlign: 'center',
    color: 'black',
  },
  medfield: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Circular',
    //textAlign: 'center',
    color: '#009CC6',
    marginTop: 10,
    marginBottom: 20,
    marginLeft: 24,
    marginRight: 24,
  },
  remainingPills: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily:'Circular',
    fontWeight: '400',
    color: 'black',
  },
  button: {
    margin: 24,
    fontSize: 22,
    fontFamily:'Circular',
    fontWeight: '600',
    width:'30%',
    color: 'white'
    //textAlign: 'center',
    //color: '#34495e',
  },
  buttonText: {
    color : 'white',
    fontFamily: 'Circular',
    fontWeight:'500',
    fontSize: 16
  },
  EditButton: { alignItems: 'center',
    backgroundColor: '#009CC6',padding: 6, borderRadius:10 ,margin: 14,
  },
  RenewButton: { alignItems: 'center',
    backgroundColor: '#50BB75',padding: 6, borderRadius:10
  },
});
export default PrescriptionListScreen;
AppRegistry.registerComponent(
  "PrescriptionListScreen",
  () => PrescriptionListScreen
);
