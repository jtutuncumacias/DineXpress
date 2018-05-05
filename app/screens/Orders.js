import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, AsyncStorage } from 'react-native';
import { TabNavigator, StackNavigator, DrawerNavigator, DrawerItems, NavigationActions, SwitchNavigator } from 'react-navigation';
import { FormLabel, FormInput, Icon, Button, ButtonGroup, List, ListItem } from 'react-native-elements';
import * as firebase from 'firebase';

import Header from '../components/header';
import OrderList from '../components/orderlist';

export default class Orders extends React.Component {

  state = {userId:'', userType: 'buyer'}

  goToLocation(location){
    this.props.navigation.navigate('location', { location: location, userType: 'buyer' })
  }

  goToMenu(){
    this.props.navigation.navigate('DrawerOpen');
  }
  
  constructor(props) {
    super(props);
    this.refresh = this.refresh.bind(this);
    this._Async();
  }

  refresh(){
    this.refs.orderlist.refresh();
  }

  _Async = async () => {
    var that = this;
    await AsyncStorage.getItem('userId').then(async (userId) => {
      that.setState({userId:userId});
    })
  };

  render() {
    console.log(this.state);

    return(
      <View style={styles.container}>
        <Header title="My Orders" showLeft={true} showRight={true} leftPress={()=>this.goToMenu()} rightPress={this.refresh} leftIcon="dehaze" rightIcon="refresh"/>
        <View style={styles.mainContainer}>
            <ScrollView>
              <OrderList ref="orderlist"
                goToLocation={(location)=>this.goToLocation(location)}
                userId={this.state.userId}
                userName={this.state.userName}
              />
            </ScrollView>
        </View>
      </View>
    );
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
    justifyContent: 'center',
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
