import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppLoading, Asset, Font } from 'expo';
import { createBottomTabNavigator } from 'react-navigation';
import Feather from '@expo/vector-icons/Feather';
import RecentFeed from './components/recentfeed';
import MapFeed from './components/mapfeed';
import FavoritesFeed from './components/favoritesfeed';


function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}


export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
    };
  }


  async _loadAssetsAsync() {
    const imageAssets = cacheImages([
      require('./assets/logo.png'),
    ]);

    await Promise.all([...imageAssets]);
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/logo.png'),
      ]),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isReady: true });
  };
  
  render() {

    console.disableYellowBox = true; //don't show warnings on device in development
    if (!this.state.isReady) {
      //show loading until app-images are cached
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      );
    } else{
      return (
        <Routes/>
      );
    }


  }
}

const Routes = createBottomTabNavigator(
  {

    Map: {
      screen: MapFeed,
      navigationOptions: ({ navigation }) => ({
        title: '',
      })
    },
    Recent: {
      screen: RecentFeed,
      navigationOptions: ({ navigation }) => ({
        title: '',
      })
    },
    Favorites: {
      screen: FavoritesFeed,
      navigationOptions: ({ navigation }) => ({
        title: '',
      })
    },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Map') {
          iconName = 'globe';
        } else if (routeName === 'Recent') {
          iconName = 'image';
        } else if (routeName === 'Favorites') {
          iconName = 'star';
        }

        return <Feather name={iconName} size={30} color={tintColor} />;
      },
    }),
    initialRouteName: 'Recent',
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

