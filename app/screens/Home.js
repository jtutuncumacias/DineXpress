import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, AsyncStorage } from 'react-native';
import { TabNavigator, StackNavigator, DrawerNavigator, DrawerItems, NavigationActions, SwitchNavigator } from 'react-navigation';
import {Icon, Card, ListItem, Button, ButtonGroup } from 'react-native-elements';
import * as firebase from 'firebase';

import Header from '../components/header';
import HomeList from '../components/homelist';

export default class Home extends React.Component {
  
  state = {type: '', typeindex: null,}

  goToLocation(location){
    this.props.navigation.navigate('location', { location: location, refresh: this.refresh, userType: this.state.type })
  }

  goToMenu(){
    this.props.navigation.navigate('DrawerOpen')
  }

  constructor(props) {
    super(props);
    this.refresh = this.refresh.bind(this);
    this._typeAsync();
  }

  refresh(){
    this.refs.homelist.refresh()
  }

  async _typeAsync() {
    await AsyncStorage.getItem('userType').then(async (type) => {
      var index = (type == 'buyer') ? 0 : 1;
      this.setState({
        type:type,
        typeindex:index,
      })
    })
  };

  async updateIndex(index){
    var that = this;
    that.setState({typeindex:index});
    if (index == 0) {
      that.setState({type:'buyer'});
      await AsyncStorage.setItem('userType','buyer');
    } else if (index == 1) {
      that.setState({type:'seller'});
      await AsyncStorage.setItem('userType','seller');
    }
    this.refresh();
  }

  render() {
    return (
      <View style={styles.container}>
        <Header title="Home" showLeft={true} showRight={true} leftPress={()=>this.goToMenu()} rightPress={this.refresh} leftIcon="dehaze" rightIcon="refresh" style={{marginBottom: 20}}/>
          <View style={styles.body}> 
            <View style={{flex:0.15, alignItems: 'center', justifyContent: 'center',}}>
              <ButtonGroup
                selectedButtonStyle={styles.buttonGroup}
                textStyle={styles.headline}
                selectedTextStyle={styles.title}
                onPress={(index) => this.updateIndex(index)}
                selectedIndex={this.state.typeindex}
                buttons={['Buyer', 'Seller']}
                containerStyle={{height: 50, alignItems: 'center'}}
              />
            </View>
            <ScrollView
              contentContainerStyle={{marginTop:-20, marginBottom:-20}}
            >
              <HomeList ref="homelist"
                goToLocation={(location)=>this.goToLocation(location)}
              />
            </ScrollView>
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scroll: {
    //flex: 1,
    marginTop: 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    backgroundColor: '#a9dbfb',
    flexDirection: 'column',
  },
  banner:{
    color: 'dimgrey',
    marginTop: 10,
    fontSize:30,
    textAlign: 'center',
  },
  buttonGroup:{
    backgroundColor: 'dodgerblue', 
    borderColor: 'dodgerblue',
    height: 50,
  },
  title: {
    color: "white",
    fontSize: 18,
  },
  headline: {
      fontWeight: 'bold',
      fontSize: 18,
  },
});

