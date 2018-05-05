import React, {Component} from 'react';
import { ActivityIndicator, AsyncStorage, StyleSheet, Text, View, StatusBar, TouchableOpacity, ScrollView, Platform, TextInput } from 'react-native';
import { Input, FormLabel, FormInput, Icon } from 'react-native-elements';
import Header from '../components/header';
import * as firebase from 'firebase';

export default class Login extends React.Component {
  
  state = { email: '', password: '', error: '', loading: false };

  constructor(props) {
    super(props);
  }

  goToHome(){
    this.props.navigation.navigate('App');
  }

  goToSetup(userId){
    this.props.navigation.navigate('setup', userId);
  }

  onLoginPress() {
    var that = this;
    var email = this.state.email
    var password = this.state.password
    var userId = /[^@]*/.exec(email)[0];

    this.checkAndrew(userId).then((data) => {
      if (data) {
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(function() {
          return firebase.auth().signInWithEmailAndPassword(email, password).then(async () => {
            firebase.database().ref('/users/' + userId).once('value', (snap) => {
              if (snap.exists()) {
                //console.log(snap.val());
                AsyncStorage.setItem('userId',userId)
                AsyncStorage.setItem('userToken',email)
                AsyncStorage.setItem('userType','buyer')
                AsyncStorage.setItem('userName',snap.val().userName)
                that.goToHome();
              } else {
                that.goToSetup(data);
              }
            }).catch(function(error) {
              that.setState({error:error.message})
            })
          }).catch(function(error) {
              that.setState({error:error.message})
          })
        })
        .catch(function(error) {
          console.log(error.message);
        });
      } else { 
        that.setState({error:'Invalid Andrew ID.'});
      }
    }).catch(function(error) {
        that.setState({error:error.message})
    })
        
  }

  checkAndrew(andrewID){
    var url = 'https://apis.scottylabs.org/directory/v1/andrewID/'+andrewID;
    var data = fetch(url).then((response) => response.json()).catch((error) => null);
    return (data);
  }

  onRegisterPress(){
    var that = this;
    var email = this.state.email;
    var password = this.state.password;
    var userId = /[^@]*/.exec(email)[0];

    if(/@andrew.cmu.edu\s*$/.test(email)){
      this.checkAndrew(userId).then((data) => {
        if(data){
          firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(async () => {
            alert("Account created!")
            this.goToSetup(data);
          }).catch(function(error) { 
            that.setState({error:error.message})
          })
        } else { that.setState({error:'Invalid Andrew ID.'});}
      })
    } else { this.setState({error:'This domain is not authorized.'}); }
  }

  render() {
    return (
      <View style={styles.container}>
          <Header title={'DineXpress'} showLeft={false} showRight={false} navigation={this.props.navigation}/>
          <View style={styles.body}>
            <Text style={styles.banner}>Welcome</Text>
            <FormInput 
                containerStyle={styles.input}
                inputStyle={styles.headline}
                placeholder='you@domain.com'
                value={this.state.email}
                onChangeText={(email) => this.setState({ email:email })}
            />
            <FormInput
                containerStyle={styles.input}
                inputStyle={styles.headline}
                autoCorrect={false}
                placeholder='*******'
                secureTextEntry
                value={this.state.password}
                onChangeText={(password) => this.setState({ password:password })}
            />
            <Text style={styles.errorTextStyle}>{this.state.error}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.onLoginPress()}>
              <Text style={styles.title}>
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.onRegisterPress()}>
              <Text style={styles.title}>
                Register
              </Text>
            </TouchableOpacity>
            
          </View>
        </View>
    );
  }
}

const styles = {
    banner:{
      color: 'dimgrey',
      fontSize:30,
      marginBottom:100,
    },
    container:{
      flex:1,
      justifyContent:'center',
    },
    body:{
      flex:1,
      backgroundColor: '#a9dbfb',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    },
    button:{
      flex: .2,
      backgroundColor: 'dodgerblue',
      height:30,
      width:150,
      justifyContent:'center',
      alignItems:'center',
      margin: 10,
    },
    errorTextStyle: {
        color: '#E64A19',
        alignSelf: 'center',
        paddingTop: 10,
        paddingBottom: 10
    },
    title: {
      color: "white",
      fontSize: 18,
    },
    input: {
      paddingTop: 20,
    },
    headline: {
      textAlign: 'center', // <-- the magic
      fontWeight: 'bold',
      fontSize: 18,
      marginTop: 0,
      width: 250,
    }
  };

