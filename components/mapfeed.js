import React from 'react';
import { NetInfo, Text, View, Image, StyleSheet, TouchableOpacity, FlatList, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { MapView } from 'expo';
import { fetchFromPublicApi, apikey } from 'testapp/utils/request';
import { Nav, container, imagewrap, imageitem } from './sharedstyles';
import { ImageDetails } from './image/imagedetails';
import { LogoTitle } from './logo';

class MapFeed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isConnected: null,
      images: [],
      loading: true,
      latitude: 55.405691,
      longitude: 10.3860423,
    };

    this._fetchImages = this._fetchImages.bind(this);
    this.fetchimginfo = this.fetchimginfo.bind(this);

    this.mapImagesForMarkers = this.mapImagesForMarkers.bind(this);
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
    this.setState({ loading: true, });
    let url = `/rest/?method=flickr.photos.search&api_key=${apikey}&accuracy=11&lat=${this.state.latitude}&lon=${this.state.longitude}&per_page=20&`;
    fetchFromPublicApi(url).then(
      response => response.json())
      .then(result => {
        this.setState({
          images: this.mapImagesForMarkers(result.photos.photo),
        });
      });
  }

  async mapImagesForMarkers(images) {
    let mappedImages = [];
    for (var i = 0; i < images.length; i++) {
      var t = await this.fetchimginfo(images[i].id);
      mappedImages.push(t)
    };
    console.log(mappedImages)
    this.setState({loading: false});
    return mappedImages;
  }

  async fetchimginfo(imgid) {
    let url = `/rest/?method=flickr.photos.getInfo&api_key=${apikey}&photo_id=${imgid}&`;
    let tmp = fetchFromPublicApi(url).then(
      response => response.json())
      .then(result => {
        let photo = result.photo;
        var tmpimg = {
          id: photo.id,
          lat: photo.location.latitude,
          lng: photo.location.longitude,
          smalluri: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_m.jpg`,
          biguri: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_h.jpg`
        };
        return tmpimg;
      });

    return tmp;
  }


  render() {

    return (
      this.state.isConnected ?
        this.state.loading ?
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#0063DC" />
          </View>
          :
          <View style={{ flex: 1 }}>
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            />
          </View>
        : <Text>No internet connection</Text>
    );
  }
}


const Routes = createStackNavigator(
  {
    Main: {
      screen: MapFeed,
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
