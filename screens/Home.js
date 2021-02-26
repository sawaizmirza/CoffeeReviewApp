import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS, icons, SERVER_URL, SIZES } from '../constants';
import GetLocation from 'react-native-get-location';
import { getDistance } from 'geolib';

const Home = ({ route, navigation }) => {
  const [shops, setShops] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [nearByShops, setNearByShops] = useState([]);
  const [isNearyBy, setIsNearBy] = useState(false);

  useEffect(() => {
    if (route.params && route.params.user) {
      setUserInfo(route.params.user);
    }
  }, []);

  useEffect(() => {
    fetch(`${SERVER_URL}/api/1.0.0/find2`)
      .then((response) => {
        if (response.ok) return response.json();
        else throw response.text();
      })
      .then((result) => {
        setShops(result);
        setIsLoading(false);

        // Calculating the distances of from my location
        GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
        })
          .then((location) => {
            console.log(location);

            var nearByShops = [];
            for (var i = 0; i < result.length; i++) {
              var distance = getDistance(
                { latitude: location.latitude, longitude: location.longitude },
                {
                  latitude: result[i].latitude,
                  longitude: result[i].longitude,
                },
              );

              var distanceInMiles = Math.round(distance * 0.000621371192);
              console.log(
                `Distance in Miles for ${result[i].location_id} is ${distanceInMiles}`,
              );
              if (distanceInMiles <= 4000) {
                console.log('nearby');
                nearByShops.push({
                  ...result[i],
                  distance: distanceInMiles,
                });
              }
            }
            setNearByShops(nearByShops);
          })
          .catch((error) => {
            const { code, message } = error;
            console.log(code, message);
          });
      })
      .catch((error) => {
        alert('Error ' + error);
        setIsLoading(false);
      });
  }, []);

  const handleNearBySearch = () => {
    setIsNearBy(!isNearyBy);
    var nearby = nearByShops;
    var normalShops = shops;
    setNearByShops(normalShops);
    setShops(nearby);
  };

  function renderRestaurantList() {
    const renderItem = ({ item }) => {
      return (
        <TouchableOpacity
          style={{ marginBottom: SIZES.padding * 2 }}
          onPress={() =>
            navigation.navigate('Reviews', {
              item,
              userInfo,
            })
          }>
          <View
            style={{
              marginBottom: SIZES.padding,
            }}>
            <Image
              source={{ uri: item.photo_path }}
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
              <Text style={{ ...FONTS.h4 }}>
                {item.avg_overall_rating.toFixed(1)}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={{ ...FONTS.body2 }}>{item.location_name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={isNearyBy ? icons.distance : icons.location}
                style={{
                  height: 20,
                  width: 20,
                  tintColor: COLORS.primary,
                  marginRight: 10,
                }}
              />
              <Text style={{ ...FONTS.body2 }}>
                {isNearyBy ? `${item.distance} Miles` : item.location_town}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <FlatList
        data={shops}
        keyExtractor={(shop) => shop.location_id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingHorizontal: SIZES.padding * 2,
          paddingBottom: 30,
        }}
      />
    );
  }

  const handleUserClick = () => {
    if (userInfo) {
      navigation.navigate('User', { user: userInfo });
      // var myHeaders = new Headers();
      // myHeaders.append('X-Authorization', JSON.parse(userInfo).token);

      // var raw = '';

      // var requestOptions = {
      //   method: 'POST',
      //   headers: myHeaders,
      //   body: raw,
      // };

      // fetch(`${SERVER_URL}/api/1.0.0/user/logout`, requestOptions)
      //   .then((response) => {
      //     if (response.ok) return response.text();
      //     else throw response.text();
      //   })
      //   .then((result) => {
      //     alert('You are logged out');
      //     navigation.navigate('Login');
      //   })
      //   .catch((error) => alert('Error : ' + error));
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={{ ...FONTS.h1, margin: 20 }}>
          {isNearyBy ? 'Nearby Coffee Shops' : 'Coffee Shops'}
        </Text>

        {/* {userInfo ? (
          <TouchableOpacity onPress={handleUserClick}>
            <Text
              style={{
                height: 30,
                width: 80,
                color: COLORS.black,
                fontSize: 20,
              }}>
              Log Out
            </Text>
          </TouchableOpacity>
        ) : ( */}
        <TouchableOpacity onPress={handleUserClick}>
          <Image
            style={{
              height: 30,
              width: 30,
              tintColor: COLORS.darkgray,
              margin: 20,
            }}
            source={icons.user}
            resizeMode="contain"
          />
        </TouchableOpacity>
        {/* )} */}
      </View>

      {isLoading ? (
        <View style={styles.activityView}>
          <ActivityIndicator
            animating={isLoading}
            size="large"
            color={COLORS.primary}
          />
          <Text style={{ margin: 20 }}>Fetching the Coffee Shops</Text>
        </View>
      ) : shops.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ marginTop: 30, fontSize: SIZES.body2 }}>
            {isNearyBy
              ? 'No Nearby Coffee Shops found'
              : 'No Coffee Shops found'}
          </Text>
        </View>
      ) : (
            renderRestaurantList()
          )}
      <TouchableOpacity
        onPress={handleNearBySearch}
        style={{
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.2)',
          alignItems: 'center',
          justifyContent: 'center',
          width: 70,
          position: 'absolute',
          bottom: 40,
          right: 20,
          height: 70,
          backgroundColor: '#fff',
          borderRadius: 100,
        }}>
        <Image style={{ height: 50, width: 50 }} source={icons.location2} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray4,
  },
  activityView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
