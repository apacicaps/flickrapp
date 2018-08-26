import React from 'react';
import { NetInfo, Text, View, Image, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, AsyncStorage } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { fetchFromPublicApi, apikey } from 'testapp/utils/request';
import { Nav, container, imagewrap, imageitem, headline } from './sharedstyles';
import { ImageDetails } from './image/imagedetails';
import { LogoTitle } from './logo';

class FavoritesFeed extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isConnected: null,
      images: [],
      keys: [],
      loading: true,
      refreshing: false,
    };
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

    this._getKeys();
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this._handleConnectivityChange
    );
  }

  async _getKeys() {
    try {
      AsyncStorage.getAllKeys((err, keys) => {
        AsyncStorage.multiGet(keys, (err, stores) => {
          stores.map((result, i, store) => {
            //get img id, that is stored in value of the key value pair
            let value = store[i][1];
            // get img info from img ids
            this._fetchInfoForImg(value);
          });
          this.setState({ loading: false, refreshing: false });
        });
      });
    } catch (error) {
      console.log("Error saving data" + error);
    }
  }

  _handleConnectivityChange = (isConnected) => {
    this.setState({
      isConnected,
    });
  }

  _fetchInfoForImg(id) {
    // only add image if it is not already in images array
    let index = this.state.images.findIndex(el => el.id == id);

    if (index == -1) {
      let url = `/rest/?method=flickr.photos.getInfo&api_key=${apikey}&photo_id=${id}&`;

      fetchFromPublicApi(url).then(
        response => response.json())
        .then(result => {
          let photo = result.photo;
          this.setState({
            images: [{
              id: photo.id,
              title: photo.title._content,
              smalluri: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_m.jpg`,
              biguri: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_h.jpg`
            }, ...this.state.images],
          });
        });
    }
  }

  _onRefresh = () => {
    this.setState({ refreshing: true, });
    this._getKeys();
  }

  render() {
    return (
      this.state.isConnected ?
        this.state.loading ?
          <View style={container}>
            <ActivityIndicator size="large" color="#0063DC" />
          </View>
          :
          <View style={container}>
            <Text style={headline}>YOUR FAVORITES</Text>
            {this.state.images.length > 0 ?
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
                  <TouchableOpacity key={'imgwrap_' + item.id}
                    style={imagewrap}
                    onPress={() => this.props.navigation.navigate('Image', { imgurl: item.biguri, imgid: item.id, showfavbtn: false })}>
                    <Image key={'img_' + item.id} style={imageitem} source={{ uri: item.smalluri }} />

                  </TouchableOpacity>
                )}
              />
              :
              <View style={container}>
                <Text>You have no favorites yet :(</Text>
              </View>
            }
          </View>
        :
        <View style={container}>
          <Text style={headline}>No internet connection</Text>
        </View>
    );
  }
}


const Routes = createStackNavigator(
  {
    Main: {
      screen: FavoritesFeed,
      navigationOptions: ({ }) => ({
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
