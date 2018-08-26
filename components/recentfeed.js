import React from 'react';
import { NetInfo, Text, View, Image, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { fetchFromPublicApi, apikey } from 'testapp/utils/request';
import { Nav, container, imagewrap, imageitem, headline } from './sharedstyles';
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
    // check for internet connection
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
    // get 18 recent public flickr images
    let url = `/rest/?method=flickr.photos.getRecent&api_key=${apikey}&per_page=18&`;
    fetchFromPublicApi(url).then(
      response => response.json())
      .then(result => {
        // map response result to image array in state
        for (var i = 0; i < result.photos.photo.length; i++) {
          let photo = result.photos.photo[i];
          // only add image if it is not already in images array
          let index = this.state.images.findIndex(el => el.id == photo.id);
          if (index == -1) {
            // add img to start of image array to "push" older image down in view
            this.setState({
              images: [{
                id: photo.id,
                smalluri: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_m.jpg`,
                biguri: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_h.jpg`
              }, ...this.state.images],
            });
          }
        }
        // stop loading and/or refreshing spinner
        this.setState({
          loading: false,
          refreshing: false,
        });
      });
  }

  _onRefresh = () => {
    this.setState({ refreshing: true, }); // start refreshing spinner
    this._fetchImages();
  }

  render() {
    return (
      this.state.isConnected ?
        this.state.loading ?
          // loading spinner
          <View style={container}>
            <ActivityIndicator size="large" color="#0063DC" />
          </View>
          :
          <View style={container}>
            <Text style={headline}>RECENT PUBLIC PHOTOS</Text>
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                  colors={['#0063DC']}
                  progressBackgroundColor={'#FF0084'} />}
              numColumns={3}
              data={this.state.images}
              keyExtractor={(item) => '' + item.id}
              renderItem={({ item }) => (
                // go to image detail view when image is pressed
                <TouchableOpacity key={'imgwrap_' + item.id}
                  style={imagewrap}
                  onPress={() => this.props.navigation.navigate('Image', { imgurl: item.biguri, imgid: item.id, showfavbtn: true })}>
                  <Image key={'img_' + item.id} style={imageitem} source={{ uri: item.smalluri }} />
                </TouchableOpacity>
              )}
            />
          </View>
        :
        // show msg if no internet connection
        <View style={container}>
          <Text style={headline}>No internet connection</Text>
        </View>
    );
  }
}


const Routes = createStackNavigator(
  {
    Main: {
      screen: RecentFeed,
      navigationOptions: () => ({
        headerTitle: <LogoTitle />,
      }),
    },
    Image: {
      screen: ImageDetails,
      navigationOptions: () => ({
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