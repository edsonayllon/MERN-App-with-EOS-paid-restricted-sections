import React, { Component } from 'react';
import {
  View,
  Text,
  AsyncStorage
} from 'react-native';
import { Button, Input } from '../components';
import { Link } from '../navigation';

export default class ActivatePremium extends Component {
  state = {

  }

  async retrieveItem(key) {
    try {
      const retrievedItem =  await AsyncStorage.getItem(key);
      const item = JSON.parse(retrievedItem);
      return item;
    } catch (error) {
      console.log(error.message);
    }
    return
  }

  async componentDidMount() {

  }

  render() {
    return (
      <View>
        <View style = {{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Link to='/u/settings'>
          <Button
            title='<'
            />
        </Link>
        <Text style={{fontWeight:'bolder', fontSize: 20, marginLeft: 5}}>Activate Premium Content</Text>
        </View>
      </View>
    );
  }
}
