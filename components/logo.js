import React from 'react';
import { View, Image, StyleSheet, Platform } from 'react-native';
import LogoPng from 'testapp/assets/logo.png';

export class LogoTitle extends React.Component {
    render() {
      const {placement} = this.props;
      return (
        <View style={[styles.logoWrap]}>
          <Image source={LogoPng} style={[styles.logoComponent, placement === 'right' ? styles.logoRight : '']} 
            resizeMode={'contain'} />
        </View>
      );
    }
  }

  const styles = StyleSheet.create({
    logoComponent: {
      ...Platform.select({
        ios: {
          height: 25,
        },
        android: {
          height: 30,
        },
      }),
    },
    logoRight: {
      width: 100,
    },
    logoWrap: {
        flex: 1, alignItems: 'center', justifyContent: 'center',
    },
  });