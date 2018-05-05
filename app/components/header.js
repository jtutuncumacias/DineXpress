import React, {Component} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

export default class Header extends React.Component {

  constructor(props) {
    super(props);
  }

  doNothing(){
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.horiz}>
          <TouchableOpacity onPress={this.props.leftPress}>
            <Icon name={this.props.leftIcon ? this.props.leftIcon : "format-color-fill"} size={30} color={this.props.showLeft ? 'white' : 'dodgerblue'}/>
          </TouchableOpacity>
          <Text style={styles.title}>
            {this.props.title ? this.props.title : "Default"}
          </Text>
          <TouchableOpacity onPress={this.props.showRight ? this.props.rightPress : this.doNothing}>
            <Icon name={this.props.rightIcon ? this.props.rightIcon : "format-color-fill"} size={30} color={this.props.showRight ? 'white' : 'dodgerblue'}/>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height:64,
    backgroundColor: 'navy',
  },
  horiz:{
    flex:1,
    backgroundColor: 'dodgerblue',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    paddingHorizontal: 8,
  },
  title:{
    color: "white",
    fontSize: 24,
  }
});
