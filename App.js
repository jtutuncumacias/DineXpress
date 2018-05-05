import React, {Component} from 'react';
import { ActivityIndicator, AsyncStorage, StatusBar, ScrollView, SafeAreaView, StyleSheet, Text, View, Button } from 'react-native';
import { SwitchNavigator, TabNavigator, StackNavigator, DrawerNavigator, DrawerItems, NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Login from './app/screens/Login';
import Setup from './app/screens/Setup';
import Home from './app/screens/Home';
import Profile from './app/screens/Profile';
import Location from './app/screens/Location';
import Orders from './app/screens/Orders';
import CustomMenu from './app/screens/CustomMenu';

import * as firebase from 'firebase';

export default class App extends React.Component {
  render() {
    return (
      <AppNavigator/>
    );
  }
}
// Initialize Firebase
var config = {
    apiKey: "AIzaSyBrMifG9JJOJ4D9m87R9cbcy24KmoVNDjw",
    authDomain: "jtutuncu-98320-stuco.firebaseapp.com",
    databaseURL: "https://jtutuncu-98320-stuco.firebaseio.com",
    projectId: "jtutuncu-98320-stuco",
    storageBucket: "jtutuncu-98320-stuco.appspot.com",
    messagingSenderId: "823961623389"
  };
firebase.initializeApp(config);

const HomeStack = StackNavigator({
  home:{
    screen: Home
  },
  location:{
    screen: Location
  },
},
{
  headerMode: 'none'
})

const CustomDrawerContentComponent = (props) => (

  <ScrollView style={styles.scroll}>
    <View style={styles.topView}>
    </View>
    <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
      <DrawerItems {...props} />
    </SafeAreaView>
  </ScrollView>
);

const HomeDrawer = DrawerNavigator({
  Home:{
    screen: HomeStack
  },
  Profile:{
    screen: Profile
  },
  'My Orders':{
    screen: Orders
  }
},
{
  headerMode: 'none',
  contentComponent: CustomDrawerContentComponent
});

const AuthStack = SwitchNavigator({
  login:{
    screen: Login
  },
  setup:{
    screen: Setup
  },
},
{
  initialRouteName: 'login',
});


class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.navigation.navigate('App');
      } else {
        this.props.navigation.navigate('Auth');
      }
    })
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const AppNavigator = SwitchNavigator({
    AuthLoading: AuthLoadingScreen,
    App: HomeDrawer,
    Auth: AuthStack,
},
{
    initialRouteName: 'AuthLoading',
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: 'center',
    justifyContent: 'center',
  },
  topView: {
    height: 200,
    // flex:1,
    // backgroundColor: 'red',
    justifyContent:'center',
    alignItems: 'center'
  },
  scroll:{
    flex:1,
    // backgroundColor:'blue'
  },
  appName:{
    alignSelf:'center',
    paddingBottom: 10
  },
  name: {
    paddingTop:12,
    fontSize: 16,
    fontWeight:'800',
    fontStyle: 'italic'
  }

});
