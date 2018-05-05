import React, {Component} from 'react';
import { AsyncStorage, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { StackNavigator, NavigationActions, } from 'react-navigation';
import {Icon, Card, ListItem, Button } from 'react-native-elements';
import * as firebase from 'firebase';

import Header from '../components/header';

export default class Profile extends React.Component {
  
  constructor(props) {
    super(props);
    this._getAsync();
  }

  state={email: '', name: '', orderCount: 0, }

  onLogoutPress(){
    firebase.auth().signOut().then(function() {
    }).then(async() => {
        await AsyncStorage.clear();
        alert("Logged out!");
        this.props.navigation.navigate('Auth');
    }).catch(function(error) {
      alert(error.message)
    });
  }

  goToMenu(){
    this.props.navigation.navigate('DrawerOpen')
  }

  _getAsync = async () => {
    await AsyncStorage.getItem('userId').then(async (userId) => {
      firebase.database().ref('/users/' + userId).once('value', async (snap) => {
          if (snap.exists()) {
            let count = (snap.val().orderCount) ? (snap.val().orderCount) : (0);
            this.setState({
              email:snap.val().email,
              name:snap.val().userName,
              orderCount:count,
            })
          }
        }).catch(function(error) {
          alert(error.message);
        })
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Header title="Settings" leftPress={()=>this.goToMenu()} leftIcon="dehaze" showLeft={true} showRight={false}/>
        <View style={styles.body}>
          <View style={styles.box}>
            <Card title="My Profile" titleStyle={styles.banner}>
                <Text style={styles.headline}>Name: <Text style={styles.line}>{this.state.name}</Text></Text>
                <Text style={styles.headline}>Email: <Text style={styles.line}>{this.state.email}</Text></Text>
                <Text style={styles.headline}>Orders completed: <Text style={styles.line}>{this.state.orderCount}</Text></Text>
            </Card>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.onLogoutPress()}>
              <Text style={styles.title}>
                Log Out
              </Text>
            </TouchableOpacity>
            
            <View style={{height: 200, backgroundColor: '#a9dbfb'}} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  banner:{
    color: 'dimgrey',
    fontSize:30,
    //marginBottom: 0,
    //textAlign: 'center',
  },
  box: {
    flex: 0.9,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#a9dbfb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button:{
    backgroundColor: 'dodgerblue',
    height:40,
    width:150,
    justifyContent:'center',
    alignItems:'center',
    margin: 10,
  },
  headline: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 18,
      padding: 10,
  },
  line: {
      fontWeight: 'normal',
  },
  title: {
    color: "white",
    fontSize: 18,
  },
});

