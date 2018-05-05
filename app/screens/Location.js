import React, {Component} from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity, ScrollView, Picker, AsyncStorage } from 'react-native';
import { StackNavigator, NavigationActions} from 'react-navigation';
import { FormLabel, FormInput, Icon, Button, ButtonGroup, List, ListItem } from 'react-native-elements';

import Header from '../components/header';
import LocationList from '../components/locationlist';

import * as firebase from 'firebase';

export default class Location extends React.Component {

  state = {userName:'', userId:'', userType:'', ordering: false, keyword: null, }

  constructor(props) {
    super(props);
    this.refresh = this.refresh.bind(this);
    this.orderForm = this.orderForm.bind(this);
    this._Asyncs();
  }

  goToHome(){
    this.props.navigation.dispatch(NavigationActions.back());
    if (this.props.navigation.state.params.refresh) {
      this.props.navigation.state.params.refresh()
    }
  }

  refresh(){
    this.refs.locationlist.refresh()
  }

  _Asyncs = async () => {
    var that = this;

    const userName = await AsyncStorage.getItem('userName');
      that.setState({userName:userName});

    const userType = await AsyncStorage.getItem('userType');
      that.setState({userType:userType});
    
    const userId = await AsyncStorage.getItem('userId');
      that.setState({userId:userId});
  };

  async orderForm () {
    var current = this.state.ordering;
    this.setState({ordering:!current});
    if (current) {
      () => this.refresh();
    }
  }

  makeOrder = (location, key) => {
    var that = this;
    var newKey = new Date().valueOf();

    var newOrder = {
      item: (that.state.keyword) ? (that.state.keyword) : (location.keywords[0]),
      taken: false,
      buyerId: that.state.userId,
      buyerName: that.state.userName,
      key: newKey,
    };

    var newOrderAddress = {
      location: key,
      index: newKey,
    };

    var tempRef = firebase.database().ref('/locations/' + key + '/');
    if (location.orders) {
      var newVal = location.orders;
      newVal[newKey] = newOrder;
      tempRef.child("orders").set(newVal);
      
      var tempThing = location.orderCount;
      tempThing++;
      //console.log(tempThing);
      tempRef.child("orderCount").set(tempThing);

    } else {
      var arr = {};
      arr[newKey] = newOrder;
      tempRef.child("orders").set(arr);
      tempRef.child("orderCount").set(1);
    }

    var anotherRef = firebase.database().ref('/users/' + that.state.userId + '/orders/');
    anotherRef.on('value', (snoop) => {
      if (snoop.exists()) {
        var newAddress = snoop.val();
        newAddress[newKey] = newOrderAddress;
        anotherRef.set(newAddress);
      } else {
        var newOrderObj = {};
        newOrderObj[newKey] = newOrderAddress;
        anotherRef.set(newOrderObj);
      }
    })
  }

  render() {
    const location = this.props.navigation.state.params.location;
    const isSeller = (this.props.navigation.state.params.userType == 'seller');

    return(
      <View style={styles.container}>
        <Header title={location.name} showLeft={true} leftPress={()=>this.goToHome()} leftIcon="arrow-back" showRight={true} rightPress={this.refresh} rightIcon="refresh" />
        <View style={styles.mainContainer}>
          <Text style={styles.text}>
            {location.description}
          </Text>    
          {isSeller ? (
            <ScrollView style={styles.scroll}>
              <LocationList ref="locationlist"
                location={location}
                userId={this.state.userId}
                userName={this.state.userName}
                type={this.state.userType}                
              />
            </ScrollView>
          ) : (
          <View style={{alignItems:'center'}}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.orderForm()}>
              <Text style={styles.title}>
                {!this.state.ordering ? "Place an order" : "Close"}
              </Text>
            </TouchableOpacity>
            {this.state.ordering ? (
            <View ref="form" style={{alignItems: 'center'}}>
              <View style={styles.box}>
                <FormLabel>What would you like to order?</FormLabel>
                <Picker
                  selectedValue={this.state.keyword}
                  style={{ width: 100 }}
                  onValueChange={(itemValue, itemIndex) => this.setState({keyword: itemValue})}>
                  {
                    location.keywords.map((l, i) => 
                      (<Picker.Item
                        label={l}
                        value={l}
                        key={i}
                      />
                    ))
                  }
                </Picker>
                 <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.makeOrder(location,location.key)}>
                    <Text style={styles.title}>
                      Submit!
                    </Text>
                  </TouchableOpacity>
              </View>
            </View>
            ) : (
              <View style={{alignSelf: 'stretch',}}>
                <FormLabel>Your orders</FormLabel>
                <ScrollView style={styles.scroll}
                >
                  <LocationList ref="locationlist"
                    location={location}
                    userId={this.state.userId}
                    userName={this.state.userName}
                    type={this.state.userType}
                  />
                </ScrollView>  
              </View>)}
            </View>)}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  box: {
    //flexDirection: 'column',
    alignItems: 'center',
    //justifyContent: 'space-between',
    width: 350,
    backgroundColor: 'white',
  },
  mainContainer:{
    flex: 1,
    backgroundColor: '#a9dbfb',
    //alignItems:'center'
  },
  text: {
      textAlign: 'center',
      fontSize: 16,
      padding: 10,
  },
  title: {
    color: "white",
    fontSize: 18,
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
    textAlign: 'center', // <-- the magic
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 0,
    width: 250,
  }
});