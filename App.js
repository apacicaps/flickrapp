import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import Feather from '@expo/vector-icons/Feather';
import GlobalFeed from './components/globalfeed';
import UserFeed from './components/userfeed';
import Profile from './components/profile';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    console.disableYellowBox = true; //don't show warnings on device in development
    return (
      <Routes/>
    );
  }
}

const Routes = createBottomTabNavigator(
  {
    Global: {
      screen: GlobalFeed,
      navigationOptions: ({ navigation }) => ({
        title: 'Global feed',
      })
    },
    User: {
      screen: UserFeed,
      navigationOptions: ({ navigation }) => ({
        title: 'User feed',
      })
    },
    UserProfile: {
      screen: Profile,
      navigationOptions: ({ navigation }) => ({
        title: 'Profile',
      })
    },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Global') {
          iconName = 'globe';
        } else if (routeName === 'User') {
          iconName = 'image';
        } else if (routeName === 'UserProfile') {
          iconName = 'user';
        }

        return <Feather name={iconName} size={25} color={tintColor} />;
      },
    }),
    initialRouteName: 'Global',
    tabBarOptions: {
      activeTintColor: '#FF0084',
      inactiveTintColor: '#333',
    },
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
);

//hex pink #FF0084
//hex blue #0063DC

