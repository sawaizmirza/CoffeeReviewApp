import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  Button,
} from 'react-native';
import {COLORS, FONTS, icons, SIZES} from '../constants';

import {Rating} from 'react-native-ratings';
import {useState} from 'react';
import ReviewModal from './ReviewModal';

const Reviews = ({route, navigation}) => {
  const [item, setItem] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [locationReviews, setLocationReviews] = useState([]);

  useEffect(() => {
    if (route.params && route.params.item) {
      setItem(route.params.item);
      setLocationReviews(route.params.item.location_reviews);
    }
    if (route.params && route.params.userInfo) {
      setUserInfo(route.params.userInfo);
    }
  }, []);

  const addReview = () => {
    var user = JSON.parse(userInfo);
    if (user && user.token) {
      setShowModal(true);
    } else {
      navigation.navigate('Login');
    }
  };

  function renderHeader() {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: 50,
          marginTop: 15,
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={{
            width: 45,
            paddingLeft: SIZES.padding * 2,
            justifyContent: 'center',
          }}>
          <Image
            source={icons.back}
            resizeMode="contain"
            style={{width: 30, height: 30}}
          />
        </TouchableOpacity>

        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              width: '70%',
              height: '100%',
              backgroundColor: COLORS.lightGray3,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: SIZES.radius,
            }}>
            <Text style={{...FONTS.h3}}>{item?.location_name}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={addReview}
          style={{
            width: 50,
            paddingRight: SIZES.padding * 2,
            justifyContent: 'center',
          }}>
          <Image
            source={icons.red_pin}
            resizeMode="contain"
            style={{
              height: 30,
              width: 30,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function renderReviews() {
    const renderItem = ({item}) => {
      return (
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 20,
              paddingBottom: 20,
              borderBottomWidth: 3,
              borderBottomColor: COLORS.lightGray,
            }}>
            <Image
              source={icons.user}
              style={{
                height: 50,
                width: 50,
                tintColor: COLORS.primary,
                marginRight: 10,
              }}
            />
            <View>
              {item?.review_body && item?.review_body.length > 0 ? (
                <Text style={styles.userReview}>{item?.review_body}</Text>
              ) : null}

              <View style={[styles.rating, {width: 200}]}>
                <Text>Overall</Text>
                <Rating
                  readonly
                  isDisabled={true}
                  size={10}
                  startingValue={item?.review_overallrating}
                  fractions={2}
                  imageSize={15}
                />
              </View>
              <View style={[styles.rating, {width: 200}]}>
                <Text>Cleanliness</Text>
                <Rating
                  readonly
                  isDisabled={true}
                  size={10}
                  startingValue={item?.review_clenlinessrating}
                  fractions={2}
                  imageSize={15}
                />
              </View>
              <View style={[styles.rating, {width: 200}]}>
                <Text>Price</Text>
                <Rating
                  readonly
                  isDisabled={true}
                  size={10}
                  startingValue={item?.review_pricerating}
                  fractions={2}
                  imageSize={15}
                />
              </View>
              <View style={[styles.rating, {width: 200}]}>
                <Text>Quality</Text>
                <Rating
                  readonly
                  isDisabled={true}
                  size={10}
                  startingValue={item?.review_qualityrating}
                  fractions={2}
                  imageSize={15}
                />
              </View>
            </View>
          </View>
        </View>
      );
    };

    return (
      <FlatList
        data={locationReviews}
        keyExtractor={(item) => item?.location_id}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingHorizontal: SIZES.padding * 2,
          paddingBottom: 30,
        }}
      />
    );
  }

  const updateLocationReviews = (locationReviews) => {
    console.log('Location Reviews: ' + JSON.stringify(locationReviews));
    setLocationReviews(locationReviews);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ReviewModal
        showModal={showModal}
        userInfo={userInfo}
        setShowModal={setShowModal}
        item={item}
        navigation={navigation}
        updateLocationReviews={updateLocationReviews}
      />
      {renderHeader()}
      <Text style={{...FONTS.h2, margin: 20, textAlign: 'center'}}>
        Review Summary
      </Text>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 70,
          color: COLORS.darkgray,
          marginBottom: 20,
        }}>
        {item?.avg_overall_rating}/5
      </Text>
      <View
        style={{
          paddingLeft: 50,
          paddingRight: 50,
          borderBottomWidth: 3,
          borderBottomColor: COLORS.lightGray,
        }}>
        <View style={[styles.rating, {marginBottom: 20}]}>
          <Text style={{...FONTS.body3}}>Cleanliness</Text>
          <Rating
            readonly
            isDisabled={true}
            size={10}
            startingValue={item?.avg_clenliness_rating}
            fractions={2}
            imageSize={23}
          />
        </View>
        <View style={[styles.rating, {marginBottom: 20}]}>
          <Text style={{...FONTS.body3}}>Price</Text>
          <Rating
            readonly
            isDisabled={true}
            size={10}
            startingValue={item?.avg_price_rating}
            fractions={2}
            imageSize={23}
          />
        </View>
        <View style={[styles.rating, {marginBottom: 20}]}>
          <Text style={{...FONTS.body3}}>Quality</Text>
          <Rating
            readonly
            isDisabled={true}
            size={10}
            startingValue={item?.avg_quality_rating}
            fractions={2}
            imageSize={23}
          />
        </View>
      </View>
      {renderReviews()}
    </SafeAreaView>
  );
};

export default Reviews;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfcf8',
  },
  rating: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
  },
  userReview: {
    width: 300,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
});
