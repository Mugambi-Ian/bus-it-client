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
  ScrollView,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {PulseIndicator} from 'react-native-indicators';
import {
  fadeIn,
  slideInDown,
  slideInDownLess,
  slideInRight,
} from '../../assets/animations';
import {idDate, _auth, _database, generateUID, ide} from '../../assets/config';
import MyInfo from './my-info/my-info';
const style = StyleSheet.create({
  editBtn: {
    backgroundColor: '#43bf28',
    elevation: 2,
    borderRadius: 50,
    marginLeft: 5,
    width: 120,
    height: 50,
    marginLeft: 20,
  },
  editBtnText: {
    alignSelf: 'center',
    color: '#fff',
    fontFamily: 'Quicksand-Bold',
    fontSize: 20,
    padding: 10,
  },
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
  tripCard: {
    backgroundColor: '#fff',
    elevation: 2,
    borderRadius: 10,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 10,
    flexDirection: 'row',
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
      phoneNumber: '',
      idNumber: '',
    },
  };
  async componentDidMount() {
    await _database
      .ref('customer/' + _auth.currentUser.uid)
      .on('value', (x) => {
        if (x.hasChild('userName') === false) {
          this.setState({init: true});
        } else {
          const {userName, userDp, phoneNumber} = x.val();
          const user = {
            userName,
            userDp,
            phoneNumber,
          };
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
    routes: [],
    reciepts: [],
  };
  componentDidMount() {
    this.bc = BackHandler.addEventListener('hardwareBackPress', async () => {
      if (this.state.openRoute) {
        this.setState({
          openRoute: undefined,
          currentscreen: 'home',
          navOff: undefined,
          bookTrip: undefined,
        });
        return true;
      } else {
        BackHandler.exitApp();
        return true;
      }
    });
    this.db = _database.ref();
    this.db.child('routes/').on('value', (x) => {
      const z_ = [];
      x.child('data').forEach((d) => {
        const t_ = [];
        const {routeName, routeId} = d.val();
        d.child('trips').forEach((o) => {
          const id = ide();
          const x__ = o.val();
          const xnum = x
            .child('reciepts/' + x__.tripId + '/' + ide())
            .numChildren();
          const tm = new Date().getDay();
          const ava = o.child('avialableOn').val();
          if (ava.includes('' + tm) === true) {
            x.recieptId = id + o.key;
            x__.availableSeats = xnum <= x__.capacity ? x__.capacity - xnum : 0;
            x__.routeName = routeName;
            t_.push(x__);
          }
        });
        z_.push({trips: t_, routeName, routeId});
      });
      this.setState({routes: z_});
    });
    this.db
      .child('customer/' + _auth.currentUser.uid + '/reciepts')
      .on('value', (ds) => {
        const rr = [];
        ds.forEach((x) => {
          const dd = x.key;
          const tit = [];
          x.forEach((v) => {
            tit.push(v.val());
          });
          rr.push({date: dd, r: tit.reverse()});
        });

        this.setState({reciepts: rr.reverse()});
      });
  }

  render() {
    return (
      <Animatable.View
        animation={slideInRight}
        style={{...style.mainContent, backgroundColor: '#fff'}}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        {this.state.currentscreen === 'home' ? (
          <Animatable.View animation={slideInDownLess}>
            <Text
              style={{
                fontFamily: 'Quicksand-Regular',
                marginLeft: 20,
                marginRight: 20,
                marginTop: 20,
                fontSize: 28,
                color: '#43bf28',
                marginBottom: 10,
              }}>
              Availabe Routes
            </Text>
            {this.state.routes.map((d, i) => {
              return (
                <TouchableOpacity
                  key={i}
                  style={style.tripCard}
                  onPress={() => {
                    this.setState({
                      openRoute: d,
                      currentscreen: 'route',
                      navOff: 'kd',
                    });
                  }}>
                  <Image
                    source={require('../../assets/drawable/placeholder.png')}
                    style={{
                      width: 33,
                      height: 30,
                      margin: 20,
                      alignSelf: 'center',
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: 'Quicksand-SemiBold',
                      marginLeft: 20,
                      padding: 10,
                      borderRadius: 10,
                      borderColor: 10,
                      fontSize: 23,
                      color: '#43bf28',
                      alignSelf: 'center',
                    }}>
                    {d.routeName}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <View
              style={{
                alignSelf: 'flex-end',
                position: 'absolute',
                flexDirection: 'row',
                right: 10,
              }}>
              <TouchableOpacity
                onPress={async () => {
                  this.props.updateInfo();
                }}>
                <Image
                  source={require('../../assets/drawable/icon-profile.png')}
                  style={{width: 40, height: 40, margin: 5}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  _auth.signOut().then(() => {
                    this.props.openTimedSnack('Signed out');
                    this.props.unauthorizeUser();
                  });
                }}>
                <Image
                  source={require('../../assets/drawable/icon-logout.png')}
                  style={{width: 40, height: 40, margin: 5}}
                />
              </TouchableOpacity>
            </View>
          </Animatable.View>
        ) : this.state.currentscreen === 'route' ? (
          <Animatable.View animation={fadeIn}>
            <Text
              style={{
                fontFamily: 'Quicksand-Regular',
                marginLeft: 20,
                marginRight: 20,
                marginTop: 20,
                fontSize: 28,
                color: '#43bf28',
                marginBottom: 10,
              }}>
              Schedule Trip
            </Text>
            {this.state.openRoute.trips.map((x, i) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    if (x.availableSeats !== 0) {
                      this.setState({bookTrip: x, currentscreen: 'book'});
                    } else {
                      this.props.openTimedSnack('Trip is currently unavalible');
                    }
                  }}
                  style={{...style.tripCard, flexDirection: 'column'}}>
                  <Image
                    source={require('../../assets/drawable/logo.png')}
                    style={{
                      width: 50,
                      height: 50,
                      alignSelf: 'center',
                      marginTop: 20,
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: 'Quicksand-SemiBold',
                      marginLeft: 20,
                      padding: 10,
                      borderRadius: 10,
                      borderColor: 10,
                      fontSize: 23,
                      color: '#999999',
                      alignSelf: 'center',
                    }}>
                    Depature Time : {x.depature}
                  </Text>
                  <View
                    style={{backgroundColor: '#000', height: 1, margin: 5}}
                  />
                  <Text
                    style={{
                      fontFamily: 'Quicksand-Regular',
                      marginLeft: 20,
                      borderRadius: 10,
                      borderColor: 10,
                      fontSize: 23,
                      color: '#999999',
                      alignSelf: 'center',
                    }}>
                    Availabe Seats {x.availableSeats}
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Quicksand-Regular',
                      marginLeft: 20,
                      marginTop: 5,
                      borderRadius: 10,
                      borderColor: 10,
                      fontSize: 23,
                      color: '#999999',
                      alignSelf: 'center',
                      marginBottom: 20,
                    }}>
                    Ticket Price: {x.price}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </Animatable.View>
        ) : this.state.currentscreen === 'book' ? (
          <Animatable.View animation={slideInDownLess}>
            <Text
              style={{
                fontFamily: 'Quicksand-Regular',
                marginLeft: 20,
                marginRight: 20,
                marginTop: 20,
                fontSize: 28,
                color: '#43bf28',
                marginBottom: 10,
              }}>
              Book Trip
            </Text>
            <Text
              style={{
                fontFamily: 'Quicksand-Regular',
                marginLeft: 20,
                marginRight: 20,
                marginTop: 20,
                fontSize: 28,
                color: '#787878',
                marginBottom: 10,
              }}>
              Number of Tickets
            </Text>
            <View style={{flexDirection: 'row', marginLeft: 20}}>
              <TouchableOpacity
                onPress={() => {
                  const t = this.state.bookTrip;
                  t.ticketCount = t.ticketCount ? t.ticketCount : 0;
                  if (t.ticketCount - 1 !== -1) {
                    t.ticketCount = t.ticketCount - 1;
                    t.totalPrice = t.ticketCount * t.price;
                  }
                  this.setState({bookTrip: t});
                }}>
                <Text
                  style={{
                    backgroundColor: '#fff',
                    padding: 10,
                    fontFamily: 'QuickSand-Regular',
                    borderRadius: 5,
                    elevation: 2,
                    fontSize: 30,
                    margin: 5,
                  }}>
                  -
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  fontFamily: 'Quicksand-Regular',
                  marginLeft: 20,
                  marginRight: 20,
                  marginTop: 20,
                  fontSize: 25,
                  color: '#787878',
                  marginBottom: 10,
                  width: 50,
                  textAlign: 'center',
                }}>
                {this.state.bookTrip.ticketCount
                  ? this.state.bookTrip.ticketCount
                  : 0}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  const t = this.state.bookTrip;
                  t.ticketCount = t.ticketCount ? t.ticketCount : 0;
                  if (t.ticketCount + 1 <= t.availableSeats) {
                    t.ticketCount = t.ticketCount + 1;
                    t.totalPrice = t.ticketCount * t.price;
                  }
                  this.setState({bookTrip: t});
                }}>
                <Text
                  style={{
                    backgroundColor: '#fff',
                    padding: 10,
                    fontFamily: 'QuickSand-Regular',
                    borderRadius: 5,
                    elevation: 2,
                    fontSize: 30,
                    margin: 5,
                  }}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontFamily: 'Quicksand-Regular',
                marginLeft: 20,
                marginTop: 20,
                fontSize: 25,
                color: '#787878',
                marginBottom: 10,
              }}>
              Total Price:
              {this.state.bookTrip.totalPrice
                ? ' ' + this.state.bookTrip.totalPrice + ' Kes'
                : ' 0 kes'}
            </Text>
            <TouchableOpacity
              style={style.editBtn}
              onPress={async () => {
                const t = this.state.bookTrip;
                await setTimeout(async () => {
                  if (t.ticketCount >= 1) {
                    this.props.openTimedSnack('Ticket Saved');
                    for (let i = 0; i < t.ticketCount; i++) {
                      await _database
                        .ref('routes/reciepts/' + t.tripId + '/' + ide())
                        .push(_auth.currentUser.uid);
                    }
                    await _database
                      .ref(
                        'customer/' +
                          _auth.currentUser.uid +
                          '/reciepts/' +
                          idDate(generateUID()),
                      )
                      .set(this.state.bookTrip);
                    this.setState({
                      openRoute: undefined,
                      currentscreen: 'home',
                      navOff: undefined,
                      bookTrip: undefined,
                    });
                  } else {
                    this.props.openTimedSnack('All fields are required!');
                  }
                }, 100);
              }}>
              <Text style={style.editBtnText}>Update</Text>
            </TouchableOpacity>
          </Animatable.View>
        ) : this.state.currentscreen === 'reciept' ? (
          <Animatable.View animation={fadeIn}>
            <Text
              style={{
                fontFamily: 'Quicksand-Regular',
                marginLeft: 20,
                marginRight: 20,
                marginTop: 20,
                fontSize: 28,
                color: '#43bf28',
                marginBottom: 10,
              }}>
              My Reciepts
            </Text>
            <ScrollView style={{maxHeight: '85%'}}>
              {this.state.reciepts.map((d, i) => {
                return (
                  <View>
                    <Text style={{alignSelf: 'center', color: '#78787'}}>
                      {d.date}
                    </Text>
                    {d.r.map((x, ii) => {
                      return (
                        <View
                          key={ii}
                          style={{
                            ...style.tripCard,
                            flexDirection: 'column',
                            margin: 20,
                            padding: 10,
                            marginTop: 10,
                            marginBottom: 0,
                          }}>
                          <Text>Ticket Count: {x.ticketCount}</Text>
                          <Text>Depature Time: {x.ticketCount}</Text>
                          <Text>Total Price: {x.totalPrice}</Text>
                          <Text>Route Name: {x.routeName}</Text>
                        </View>
                      );
                    })}
                  </View>
                );
              })}
            </ScrollView>
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
