import React, {Component} from 'react';
import { AsyncStorage, StyleSheet, Text, View, Button } from 'react-native';
import { List, ListItem, Icon } from 'react-native-elements';
import update from 'immutability-helper';

import * as firebase from 'firebase';

export default class LocationList extends React.Component {

  //state = {list:[], userId:'', userName:'', type:'', location: ''}

  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.userId,
      userName: this.props.userName,
      type: this.props.type,
      location: this.props.location,
      list: this.props.location.orders,
    };
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

  async fetchData(){
    var that = this;
    var location = that.state.location;
    var tempList = [];

    var userId = await AsyncStorage.getItem('userId');
    var userName = await AsyncStorage.getItem('userName');
    var type = await AsyncStorage.getItem('userType');

    var locRef = firebase.database().ref('/locations/'+ location.key + '/orders/');
    locRef.once('value', (snap) => {
      snap.forEach(function(data) {
        let result = data.val();
        tempList.push(result);
      });
    }).then(function () {
      if (type == "buyer") {
        var reduced = tempList.reduce(function(filtered, option) {
          if (option.buyerId == userId) {
            var somethingNew = option;
            filtered.push(somethingNew);
          }
          return filtered;
        }, []);
        that.setState({list:reduced});
      } else {
        that.setState({list:tempList});
      }
    }).catch(function(error) {
      console.log(error.message);
    });
  }

  exFunctor(type,order,j) {
    console.log(type);
    console.log((type == 'buyer') ? ("clearOrder") : ("takeOrder"));
    return (type == 'buyer') ? (this.clearOrder(order,j)) : (this.takeOrder(order,j));
  }

  takeOrder(order,j) {
    var location = this.props.location;
    var tempList = this.props.location.orders;
    var index = order.key;
    
    console.log("before:");
    console.log(tempList[index]);

    tempList[index].taken = !(tempList[index].taken);
    tempList[index].sellerId = this.props.userId;
    tempList[index].sellerName = this.props.userName;

    console.log("after:");
    console.log(tempList[index]);

    var takeRef = firebase.database().ref('/locations/' + location.key + '/orders/'+ index + '/');
    takeRef.update(tempList[index]);
     
    this.setState({list:tempList});
    this.refresh();
  };

  clearOrder(order,j) {
    var location = this.props.location;
    var tempList = this.props.location.orders;
    var index = order.key;

    if(order.taken){
      var pointRef = firebase.database().ref('/users/' + order.sellerId + '/orderCount');
      pointRef.once('value', (value) => {
        if(value.exists()){
          var newVal = value.val();
          pointRef.set(newVal + 1);
        } else {
          pointRef.set(1);
        }
      });
    }

    var tempRef = firebase.database().ref('/locations/' + location.key);
    var thing = location.orderCount;
    tempRef.child('orderCount').set(thing-1);
    location.orderCount = (thing-1);
    tempRef.child('orders/' + index).remove();

    var userRef = firebase.database().ref('/users/' + this.props.userId);
    userRef.child('orders/' + order.key.toString()).remove();
    //userRef.child(index).set("test");
    
    this.refresh();
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
    //console.log("THIS.STATE:");
    //console.log(this.state);
    //console.log("END OF STATE:");
    //this.state.list.map((order) => console.log(order));

      return (
        <View style={styles.container}>
          {(this.state.list) ? (
              <List style={styles.list}>
              {
                  Object.keys(this.state.list).map((order, j) => (
                    <ListItem
                      title={this.state.list[order].item}
                      subtitle={this.state.list[order].buyerName}
                      leftIcon={{type:'material-community',
                                name:'food'}}
                      rightIcon={{name:this.getStatusIcon(this.state.list[order].taken),color:this.getStatusColor(this.state.list[order].taken)}}
                      rightTitle={this.getStatus(this.state.list[order])}
                      onPress={() => this.exFunctor(this.props.type,this.state.list[order],j)}
                      key={j}
                    />
                  ))
                
              }
            </List>
          ) : (
            <List></List>
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
  }
});