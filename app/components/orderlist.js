import React, {Component} from 'react';
import { AsyncStorage, StyleSheet, Text, View, Button } from 'react-native';
import { List, ListItem, Icon } from 'react-native-elements';
import update from 'immutability-helper';

import * as firebase from 'firebase';

export default class OrderList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {userId: this.props.userId, type: 'buyer', list: [], locs: []};
  }

  refresh(){
    this.fetchData();
  }
  
  componentWillMount(){
    this.fetchData();
  }

  copy (o) {
     var output, v, key;
     output = Array.isArray(o) ? [] : {};
     for (key in o) {
         v = o[key];
         output[key] = (typeof v === "object") ? this.copy(v) : v;
     }
     return output;
  }
  
  async fetchData() {
    var locList = [];
    var ordList = [];
    
    var userId = this.props.userId;

    //console.log(this.state.userId);

    var rootRef = firebase.database().ref();
    rootRef.child('users/' + userId + '/orders').on('value', (snap) => {
      snap.forEach(function (data) {
        let loc = data.val();
        rootRef.child('locations/' + loc.location).on('value', async (data) => {
          let realLoc = data.val();
          //console.log(realLoc);
          locList.push(realLoc);
        });
        rootRef.child('locations/' + loc.location + '/orders/'+ loc.index + '/').on('value', (snapshot) => {
          let order = snapshot.val();
          ordList.push(order);
        });
      });
      this.setState({list: ordList, locs: locList});
    });
  };

  

  getStatus(order){
    if(order.taken){
      return "Taken by " + order.sellerName;
    } else {
      return "waiting...";
    }
  }

  getStatusColor(taken){
    if (taken) {
      return 'orange';
    } else {
      return 'red';
    }
  }

  getStatusIcon(taken){
    if (taken) {
      return 'check';
    } else {
      return 'clear';
    }
  }

  render() {
    //console.log(this.state);

    this.state.list.map((order, j) => (console.log(this.state.locs[j])));

      return (
        <View style={styles.container}>
        {(!this.state.list.length != 0) ? (
            <Text style={styles.banner}>You have no open orders!</Text>
          ) : (
          <List style={styles.list}>
              {
                this.state.list.map((order, j) => (
                  <ListItem
                    title={order.item}
                    subtitle={order.buyerName}
                    leftIcon={{type:'material-community',
                              name:'food'}}
                    rightIcon={{name:this.getStatusIcon(order.taken),color:this.getStatusColor(order.taken)}}
                    rightTitle={this.getStatus(order)}
                    onPress={() => this.props.goToLocation(this.state.locs[j])}
                    key={j}
                  />
                ))
              }
            </List>
            )
          }
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list:{
    flex:1,
    backgroundColor:'gray'
  },
  banner:{
    alignItems: 'center',
    textAlign: 'center', // <-- the magic
    color: 'dimgrey',
    fontSize:30,
    marginTop:10,
  },
});