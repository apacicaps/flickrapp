import React from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Dimensions, Button, AsyncStorage, Modal } from 'react-native';
import { imgcontainer, headline } from '../sharedstyles';
import ImageViewer from 'react-native-image-zoom-viewer';


export class ImageDetails extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
        };

        this._toggleModal = this._toggleModal.bind(this);
    }

    async _saveFav(imgid) {
        try {
            await AsyncStorage.setItem('@TestAppFav:' + imgid, imgid).then(() => {
                this._toggleModal(true);
            });
        } catch (error) {
            console.log("Error saving data" + error);
        }
    }

    _toggleModal(show) {
        this.setState({
            showModal: show,
        });
    }

    render() {
        const images = [
            {
                url: this.props.navigation.state.params.imgurl,
            },
        ];
        const showAddToFavBtn = this.props.navigation.state.params.showfavbtn;

        return (
            <View style={imgcontainer}>
                <Modal visible={this.state.showModal}
                    transparent={false}
                    animationType={'slide'}
                    onRequestClose={() => this._toggleModal(false)}>
                    <View style={styles.modalContent}>
                        <Text style={headline}>Favorite saved!</Text>
                        <Button
                            onPress={() => this._toggleModal(false)}
                            title="OK"
                            color="#FF0084" />
                    </View>
                </Modal>
                <View style={{ width: Dimensions.get('screen').width - 30, height: Dimensions.get('screen').height - 250, marginTop: 15 }}>
                    <ImageViewer imageUrls={images}
                        backgroundColor={'transparent'}
                        saveToLocalByLongPress={false}
                        loadingRender={() => <ActivityIndicator size="large" color="#0063DC" />}
                        renderIndicator={() => null} />
                    <Text style={styles.zoomtext}>Use two fingers to zoom</Text>
                </View >
                {showAddToFavBtn &&
                    <View style={styles.favoriteswrap}>
                        <Button
                            onPress={() => this._saveFav(this.props.navigation.state.params.imgid)}
                            title="Add to favorites"
                            color="#FF0084"
                        />
                    </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    zoomtext: {
        fontSize: 13,
        color: '#ccc',
        paddingTop: 5,
        paddingBottom: 10,
        textAlign: 'center'
    },
    favoriteswrap: {
        marginTop: 20,
        width: Dimensions.get('screen').width - 50,
    },
    modalContent: {
        padding: 30,
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
