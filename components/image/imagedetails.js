import React from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { container, } from '../sharedstyles';
import ImageViewer from 'react-native-image-zoom-viewer';

export class ImageDetails extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const images = [
            {
                url: this.props.navigation.state.params.imgurl,
            },
        ];
        return (
            <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center', backgroundColor: '#fff'
            }}>
                <View style={{ width: 400, height: 400 }}>
                    <ImageViewer imageUrls={images}
                        backgroundColor={'white'}
                        saveToLocalByLongPress={false}
                        loadingRender={() => <ActivityIndicator size="large" color="#0063DC" />}
                        renderIndicator={() => null} />
                    <Text style={styles.zoomtext}>Pinch to zoom</Text>
                </View >
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
});
