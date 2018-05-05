import React, {Component} from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, ScrollView, Platform, TextInput, ActivityIndicator, AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { FormLabel, FormInput, Icon, Button, ButtonGroup } from 'react-native-elements';
import Header from '../components/header';
import * as firebase from 'firebase';

export default class Setup extends React.Component {

  constructor(props) {
    super(props);
  }

  state = { error:'', name: '' , index: 0, type:'buyer' };

  goToHome(){
    this.props.navigation.navigate('App');
  }

  writeUserData(userId) {
    firebase.auth().currentUser.updateProfile({
      displayName: this.state.name,
    })

    firebase.database().ref('users/' + userId).set({
      userId: userId,
      email: firebase.auth().currentUser.email,
      userName: firebase.auth().currentUser.displayName,
    }).then(async () => {
      await AsyncStorage.setItem('userId',userId)
      await AsyncStorage.setItem('userToken',firebase.auth().currentUser.email)
      await AsyncStorage.setItem('userType',this.state.type)
      await AsyncStorage.setItem('userName',firebase.auth().currentUser.displayName)
      this.goToHome();
    }).catch((error) => {

      alert(error.message)
    })
  }

  updateName = (newName) => {
    this.setState({name:newName})
  }

  updateIndex = (index) => {
    this.setState({index:index})
    if (index == 0) {
      this.setState({type:'buyer'})
    } else if (index == 1) {
      this.setState({type:'seller'})
    }
  }

  render() {
    data = this.props.navigation.state.params;
    userId = data.andrewID;
    //console.log(data);

    return (
      <View style={styles.container}>
          <Header title={'Set up your account'} showLeft={false} showRight={false}
          navigation={this.props.navigation}/>
          <View style={styles.mainContainer}>
              <View style={{flex:.2}}>
                <FormLabel labelStyle={{textAlign:'center'}}>Please enter your full name</FormLabel>
                <FormInput
                  containerStyle={styles.input}
                  inputStyle={styles.headline} 
                  onChangeText={(name) => this.updateName(name)}
                />
              </View>

              <FormLabel containerStyle={{paddingTop: 50, flex:.1}}>I am a...</FormLabel>
              <ButtonGroup
                selectedButtonStyle={styles.button}
                selectedTextStyle={styles.title}
                onPress={(index) => this.updateIndex(index)}
                selectedIndex={this.state.index}
                buttons={['Buyer', 'Seller']}
                containerStyle={{height: 50, flex:.15}}
                style={{flex:.1,}}
              />
            <Button
              buttonStyle={styles.button}
              style={{flex:.2, paddingTop: 50,width: 150,}}
              title="Get started!"
              onPress={() => this.writeUserData(userId)}
            />
          </View>
        </View>
    );
  }
}
const styles = {
    container:{
      flex:1,
      justifyContent:'center'
    },
    mainContainer:{
      flex:1,
      backgroundColor: '#a9dbfb',
      alignItems: 'center',
      justifyContent: 'center',
    },
    banner:{
      color:'white', 
      fontSize:30,
      marginBottom:100,
    },
    body:{
      flex:1,
      backgroundColor: '#a9dbfb',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    },
    button:{
      backgroundColor: 'dodgerblue', 
      borderColor: 'dodgerblue',
      height: 50,
    },
    errorTextStyle: {
        color: '#E64A19',
        alignSelf: 'center',
        textAlign: 'center', // <-- the magic
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


