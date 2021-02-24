import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import {COLORS, FONTS, icons, SIZES} from '../constants';

const Home = ({navigation}) => {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    fetch('http://192.168.0.4:3333/api/1.0.0/find2')
      .then((response) => response.json())
      .then((result) => setShops(result))
      .catch((error) => console.log('error', error));
  }, []);

  function renderRestaurantList() {
    const renderItem = ({item}) => {
      return (
        <TouchableOpacity
          style={{marginBottom: SIZES.padding * 2}}
          onPress={() =>
            navigation.navigate('Restaurant', {
              item,
            })
          }>
          <View
            style={{
              marginBottom: SIZES.padding,
            }}>
            <Image
              source={{uri: item.photo_path}}
              resizeMode="cover"
              style={{
                width: '100%',
                height: 200,
                borderRadius: SIZES.radius,
              }}
            />
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                height: 50,
                width: SIZES.width * 0.2,
                backgroundColor: COLORS.white,
                borderTopRightRadius: SIZES.radius,
                borderBottomLeftRadius: SIZES.radius,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                ...styles.shadow,
              }}>
              <Image
                source={icons.star}
                style={{
                  height: 20,
                  width: 20,
                  tintColor: COLORS.primary,
                  marginRight: 10,
                }}
              />
              <Text style={{...FONTS.h4}}>{item.avg_overall_rating}</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={{...FONTS.body2}}>{item.location_name}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={icons.location}
                style={{
                  height: 20,
                  width: 20,
                  tintColor: COLORS.primary,
                  marginRight: 10,
                }}
              />
              <Text style={{...FONTS.body2}}>{item.location_town}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <FlatList
        data={shops}
        keyExtractor={(shop) => shop.location_id}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingHorizontal: SIZES.padding * 2,
          paddingBottom: 30,
        }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{...FONTS.h1, margin: 20}}>Coffee Shops</Text>
      {renderRestaurantList()}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray4,
  },
});
