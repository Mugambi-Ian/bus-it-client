/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  BackHandler,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {PulseIndicator} from 'react-native-indicators';
import {
  fadeIn,
  slideInDown,
  slideInDownLess,
  slideInRight,
} from '../../assets/animations';
import {_auth, _database} from '../../assets/config';
import MyInfo from './my-info/my-info';
const style = StyleSheet.create({
  mainContent: {
    height: '100%',
    width: '100%',
  },
  loader: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    top: 0,
    marginTop: '70%',
  },
  loaderText: {
    alignSelf: 'center',
    color: '#ffffff',
    backgroundColor: '#43bf28',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 10,
    marginTop: '150%',
    borderRadius: 50,
    fontSize: 20,
    fontFamily: 'Quicksand-Regular',
  },
  navBar: {
    position: 'absolute',
    borderTopEndRadius: 10,
    borderTopLeftRadius: 10,
    height: 60,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  bgImage: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    elevation: 4,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#fff',
  },
  navItemIcon: {
    height: 25,
    width: 25,
    marginTop: 5,
    marginBottom: 2,
    alignSelf: 'center',
  },
  navItemText: {
    alignSelf: 'center',
    fontFamily: 'Quicksand-Regular',
    color: '#999',
    marginBottom: 5,
  },
});
export default class Home extends Component {
  state = {
    loading: true,
    init: undefined,
    user: {
      userName: '',
      userDp: '',
      phoneNumber: '',
      practice: '',
      title: '',
      idNumber: '',
    },
  };
  async componentDidMount() {
    await _database.ref('doctors/' + _auth.currentUser.uid).on('value', (x) => {
      if (x.hasChild('userName') === false) {
        this.setState({init: true});
      } else {
        const {
          userName,
          userDp,
          phoneNumber,
          practice,
          title,
          idNumber,
        } = x.val();
        const user = {userName, userDp, phoneNumber, practice, title, idNumber};
        this.setState({user: user});
      }
      this.setState({loading: false});
    });
  }
  render() {
    return (
      <Animatable.View animation={fadeIn} style={{backgroundColor: '#fff'}}>
        {this.state.loading === true ? (
          <View style={style.mainContent}>
            <PulseIndicator color={'#43bf28'} style={style.loader} size={100} />
            <Text style={style.loaderText}>Please Hold...</Text>
          </View>
        ) : this.state.init ? (
          <MyInfo
            user={this.state.user}
            openSnack={this.props.openSnack}
            openTimedSnack={this.props.openTimedSnack}
            closeSnack={this.props.closeSnack}
            closeInfo={() => {
              this.setState({init: undefined});
            }}
          />
        ) : (
          <LandingPage
            openSnack={this.props.openSnack}
            openTimedSnack={this.props.openTimedSnack}
            closeSnack={this.props.closeSnack}
            user={this.state.user}
            updateInfo={() => {
              this.setState({init: true});
            }}
            unauthorizeUser={this.props.unauthorizeUser}
          />
        )}
      </Animatable.View>
    );
  }
}

class LandingPage extends Component {
  state = {
    currentscreen: 'home',
  };

  render() {
    return (
      <Animatable.View
        animation={slideInRight}
        style={{...style.mainContent, backgroundColor: '#fff'}}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        {this.state.currentscreen === 'home' ? (
          <Animatable.View animation={slideInDownLess}>
            <TouchableOpacity
              style={{alignSelf: 'flex-end'}}
              onPress={async () => {
                this.props.updateInfo();
              }}>
              <Image
                source={require('../../assets/drawable/icon-profile.png')}
                style={{width: 40, height: 40, margin: 15}}
              />
            </TouchableOpacity>
          </Animatable.View>
        ) : (
          <View style={{display: 'none'}} />
        )}
        {this.state.navOff ? (
          <View style={{display: 'none'}} />
        ) : (
          <Animatable.View
            animation={slideInDown}
            delay={200}
            style={style.navBar}>
            <TouchableOpacity
              style={
                this.state.currentscreen === 'home'
                  ? {
                      ...style.navItem,
                      backgroundColor: '#43bf28',
                      borderTopLeftRadius: 0,
                      marginLeft: 0,
                    }
                  : {
                      ...style.navItem,
                      borderTopLeftRadius: 0,
                      marginLeft: 0,
                    }
              }
              onPress={async () => {
                if (this.state.currentscreen !== 'home') {
                  await setTimeout(() => {
                    this.setState({currentscreen: 'home'});
                  }, 100);
                }
              }}>
              <Image
                source={require('../../assets/drawable/icon-home.png')}
                style={style.navItemIcon}
              />
              <Text
                style={
                  this.state.currentscreen === 'home'
                    ? {
                        ...style.navItemText,
                        color: '#fff',
                        fontFamily: 'Quicksand-Medium',
                      }
                    : style.navItemText
                }>
                Home
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                this.state.currentscreen === 'reciept'
                  ? {
                      ...style.navItem,
                      backgroundColor: '#43bf28',
                      borderTopRightRadius: 0,
                      marginRight: 0,
                    }
                  : {
                      ...style.navItem,
                      borderTopRightRadius: 0,
                      marginRight: 0,
                    }
              }
              onPress={async () => {
                if (this.state.currentscreen !== 'reciept') {
                  await setTimeout(() => {
                    this.setState({currentscreen: 'reciept'});
                  }, 100);
                }
              }}>
              <Image
                source={require('../../assets/drawable/icon-reciept.png')}
                style={style.navItemIcon}
              />
              <Text
                style={
                  this.state.currentscreen === 'reciept'
                    ? {
                        ...style.navItemText,
                        color: '#fff',
                        fontFamily: 'Quicksand-Medium',
                      }
                    : style.navItemText
                }>
                Reciepts
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        )}
      </Animatable.View>
    );
  }
}
