import React from 'react';
import { NetInfo, Text, View, Image, StyleSheet, TouchableOpacity, FlatList, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { fetchFromPublicApi } from 'testapp/utils/request';
import { Nav, container, imagewrap, imageitem } from './sharedstyles';
import { ImageDetails } from './image/imagedetails';
import { LogoTitle } from './logo';

class RecentFeed extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isConnected: null,
      images: [],
      loading: true,
      refreshing: false,
    };

    this._fetchImages = this._fetchImages.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
  }

  componentDidMount() {
    //check for internet connection
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this._handleConnectivityChange
    );
    NetInfo.isConnected.fetch().done(
      (isConnected) => { this.setState({ isConnected }); }
    );

    this._fetchImages();
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this._handleConnectivityChange
    );
  }

  _handleConnectivityChange = (isConnected) => {
    this.setState({
      isConnected,
    });
  }

  _fetchImages() {
    let url = '/feeds/photos_public.gne?';
    fetchFromPublicApi(url).then(
      response => response.json())
      .then(result => {
        this.setState({
          images: result.items,
          loading: false,
          refreshing: false,
        });
      });
  }

  _onRefresh = () => {
    this.setState({ refreshing: true, });
    this._fetchImages();
  }

  render() {
    return (
      this.state.isConnected ?
        this.state.loading ?
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#0063DC" />
          </View>
          :
          <View style={container}>
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                  colors={['#0063DC']}
                  progressBackgroundColor={'#FF0084'} />}
              numColumns={3}
              data={this.state.images}
              keyExtractor={(item) => '' + item.date_taken}
              renderItem={({ item }) => (
                <TouchableOpacity key={'imgwrap_' + item.date_taken}
                  style={imagewrap}
                  onPress={() => this.props.navigation.navigate('Image', { imgurl: item.media.m })}>
                  <Image key={'img_' + item.date_taken} style={imageitem} source={{ uri: item.media.m }} />

                </TouchableOpacity>
              )}
            />
          </View>

        : <Text>No internet connection</Text>
    );
  }
}


const Routes = createStackNavigator(
  {
    Main: {
      screen: RecentFeed,
      navigationOptions: ({ navigation, screenProps }) => ({
        headerTitle: <LogoTitle />,
      }),
    },
    Image: {
      screen: ImageDetails,
      navigationOptions: ({ navigation, screenProps, props }) => ({
        title: ' ',
        headerRight: (
          <LogoTitle placement='right' />
        ),
      }),
    }
  },
  {
    initialRouteName: 'Main',
    navigationOptions: Nav,
  }
);

export default Routes;