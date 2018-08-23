import React from 'react';
import { Text, View, Image, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Nav } from './sharedstyles';
import { LogoTitle } from './logo';

class Profile extends React.Component {

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Text>Profile</Text>
      </View>
    );
  }
}


const Routes = createStackNavigator(
  {
    Main: {
      screen: Profile,
      navigationOptions: ({ navigation, screenProps }) => ({
        headerTitle: <LogoTitle />,
      }),
    },
  },
  {
    initialRouteName: 'Main',
    navigationOptions: Nav,
  }
);

export default Routes;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  headline: {
    fontSize: 28,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'whatever-it-takes'
  },
});