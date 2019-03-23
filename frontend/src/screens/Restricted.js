import React, { Component } from 'react';
import {
  View,
  Text,
  AsyncStorage
} from 'react-native';
import { Button } from '../components';
import { Link } from '../navigation';

export default class Restricted extends Component {
  state = {
    message: 'Loading..',
    loading: false
  }

  async componentDidMount() {
    try {
      const jwt = await this.retrieveItem("JWT_TOKEN");
      const res = await fetch(
        "http://localhost:4000/api/restricted", {
        method: "GET",
        headers: {
          'Authorization': 'Bearer ' + jwt
        }
      });
      if (res) {
        const api = await res.text()
        this.setState({ message:  api})
      }
    } catch (err) {
      console.log('Promise is rejected with error: ' + err);
    }
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

  render() {
    return (
      <View>
       <Link to='/u/settings'>
        <Button
          isLoading = {this.state.loading}
          title='User Settings'
          />
        </Link>
        <Text style={{fontWeight:'bolder', fontSize: 20}}>Restricted Page</Text>

        <Text>{this.state.message}</Text>

      </View>
    );
  }
}
