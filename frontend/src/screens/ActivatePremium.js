import React, { Component } from 'react';
import {
  View,
  Text,
  AsyncStorage
} from 'react-native';
import { Button } from '../components';
import { Link } from '../navigation';
import { Api, JsonRpc, RpcError } from 'eosjs';
import ScatterJS, { Network } from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs2';

const network = Network.fromJson({
    blockchain:'eos',
    protocol:'http',
    host:'127.0.0.1',
    port:8888,
    chainId: process.env.REACT_APP_CHAIN_ID,
    name: 'localhost'
});

const rpc = new JsonRpc(network.fullhost());

export default class ActivatePremium extends Component {
  state = {
    transacted: false
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

  scatterPay = async () => {
    console.log(network)
    ScatterJS.plugins( new ScatterEOS() );
    try {
      const connected = await ScatterJS.scatter.connect('EOS-Restricted-Sections-App-Name');
      if (!connected) return false;
      const scatter = await ScatterJS.scatter;
      const requiredFields = { accounts:[network] };
      const identity = await scatter.getIdentity(requiredFields);
      if (identity) {
        this.setState(identity);
        const account = scatter.identity.accounts.find(x => x.blockchain === 'eos');
        console.log(account)
        const api = scatter.eos(network, Api, { rpc, beta3:true });
        console.log(api);
        try {
          const trx = await api.transact({
            actions: [{
              account: 'eosio.token',
              name: 'transfer',
              authorization: [{
                actor: account.name,
                permission: account.authority,
              }],
              data: {
                from: account.name,
                to: 'james',
                quantity: '3.0000 EOS',
                memo: `from ${account.name}`,
              },
            }]
          }, {
            blocksBehind: 3,
            expireSeconds: 30,
          });
          console.log(trx);

          scatter.forgetIdentity();
          if (trx) {
            this.setState({
              transacted: true
            })
          }
        } catch (e) {
          console.log('\nCaught exception: ' + e);
          if (e instanceof RpcError)
            console.log(JSON.stringify(e.json, null, 2));
        }
      }
    } catch (err) {
      console.log(err);
      this.setState({scatterConnectError: 'Could not connect to Scatter'});
    }
  }

  postTransaction = async (account, trx) => {

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
        {this.state.transacted ?
          <View>
            <Text>Payment sent. Restricted section will be unlocked when the transaction is confirmed.</Text>
            <Link to='/u/settings'>
              <Button
                title='Check account status'
                />
            </Link>
          </View>
        : <View>
            <Text>Place marketing content here</Text>
            <Button title='Pay with Scatter Wallet' onPress={this.scatterPay}/>
          </View>
        }

      </View>
    );
  }
}
