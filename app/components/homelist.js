import React, {Component} from 'react';
import { AsyncStorage, StyleSheet, Text, View, Button } from 'react-native';
import { List, ListItem, Icon } from 'react-native-elements';
import update from 'immutability-helper';

import * as firebase from 'firebase';

export default class HomeList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {list:[]};
  }

  refresh(){
    this.fetchData();
  }

  componentWillMount(){
    this.fetchData();
  }

  async fetchData(){
    var that = this;
    var tempList = [];
    var userToken = await AsyncStorage.getItem('userToken');
    var userType = await AsyncStorage.getItem('userType');

    if (userToken) {
      let temp2 = [];
      firebase.database().ref('locations').once('value', (snap)=> {
        var i = 0;
        snap.forEach(function(data) {
          let result = data.val();
          result.key = i;
          temp2.push(result);
          i++;
        });
        tempList = temp2.reduce(function(filtered, option) {
          //console.log(option);

          if (option.keywords.length > 1) {
            var someNewValue = option;
            filtered.push(someNewValue);
          }
          return filtered;
        }, []);
      }).then(function(){
        if (userType == 'seller') {
          var reduced = tempList.reduce(function(filtered, option) {
            if (option.orders) {
              var someNewValue = option;
              filtered.push(someNewValue);
            }
            return filtered;
          }, []);
          that.setState({list:reduced})
        } else {
          that.setState({list:tempList})
        }
      }).catch(function(error) {alert(error.message)})
    }
  };

  getNotifIcon(item){
    if(item.orderCount) {
      if (item.orderCount > 9) {
        return 'numeric-9-plus-box';
      } else {
        return 'numeric-' + item.orderCount + '-box';
      }
    } else {
      return 'numeric-0-box';
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <List style={styles.list}>
          {
            this.state.list.map((item, i) => (
              <ListItem
                title={item.name}
                subtitle={item.location}
                leftIcon={{type:'material-community',
                          name:this.getNotifIcon(item)}}
                onPress={() => this.props.goToLocation(item)}
                key={i}
              />
            ))
          }
        </List>
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