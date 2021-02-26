import React, { useEffect } from 'react';
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
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { COLORS, FONTS, icons, SERVER_URL, SIZES } from '../constants';

import { Rating } from 'react-native-ratings';
import { useState } from 'react';
import ReviewModal from './ReviewModal';

const Reviews = ({ route, navigation }) => {
  const [item, setItem] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [locationReviews, setLocationReviews] = useState([]);
  const [reviewUserData, setReviewUserData] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  const [likedReviews, setLikedReviews] = useState([]);
  const [reviewImages, setreviewImages] = useState([]);

  useEffect(() => {
    if (route.params) {
      if (route.params.item) {
        if (route.params.userInfo) {
          var userData = JSON.parse(route.params.userInfo);
          var myHeaders = new Headers();
          myHeaders.append('X-Authorization', userData.token);

          var requestOptions = {
            method: 'GET',
            headers: myHeaders,
          };
          fetch(`${SERVER_URL}/api/1.0.0/user/${userData.id}`, requestOptions)
            .then((resp) => {
              if (resp.ok) return resp.json();
              else throw resp.text();
            })
            .then((success) => {
              var liked_reviews = success.liked_reviews;

              var liked = [];
              for (var i = 0; i < liked_reviews.length; i++) {
                if (
                  liked_reviews[i].location.location_id ===
                  route.params.item.location_id
                ) {
                  liked.push(liked_reviews[i].review.review_id);
                }
              }
              console.log('Liked: ' + liked);
              setLikedReviews(liked);
            })
            .catch((error) =>
              console.log('Failed to fetch logged in user data : ' + error),
            );

          fetch(`${SERVER_URL}/api/1.0.0/find2`)
            .then((response) => {
              if (response.ok) return response.json();
              else throw response.text();
            })
            .then((result) => {
              // console.log(JSON.stringify(result));
              console.log('Location ID : ' + route.params.item.location_id);
              var coffeeList = result;
              var newLocation;
              for (var i = 0; i < coffeeList.length; i++) {
                console.log(
                  `LST: ${coffeeList[i].location_id} ROUTE: ${route.params.item.location_id}`,
                );
                if (
                  coffeeList[i].location_id === route.params.item.location_id
                ) {
                  newLocation = coffeeList[i];
                  break;
                }
              }

              setItem(newLocation);
              var locationReviews = newLocation.location_reviews;
              setLocationReviews(locationReviews);
              var userIds = locationReviews.map((review) => {
                return review.review_user_id;
              });
              console.log('User IDS: ' + userIds);
              var reviewUsersData = new Array(Math.max(...userIds)).fill('');
              console.log('Reviews user data ' + reviewUsersData);
              var count = 0;
              userIds.map((user, index) => {
                fetch(`${SERVER_URL}/api/1.0.0/user/${user}`, requestOptions)
                  .then((response) => {
                    if (response.ok) return response.json();
                    else throw response.text();
                  })
                  .then((result) => {
                    count++;
                    // console.log(
                    //   `User DATA: ${user} ----> ${JSON.stringify(result)}`,
                    // );
                    reviewUsersData[
                      user
                    ] = `${result.first_name} ${result.last_name}`;
                    if (count === userIds.length) {
                      setReviewUserData(reviewUsersData);
                      console.log('Setting user data : ' + reviewUsersData);
                      setShowLoading(false);
                    }
                  })
                  .catch((error) => {
                    count++;
                    setShowLoading(false);
                  });
              });

              var reviewIds = locationReviews.map((review) => {
                return review.review_id;
              });
              console.log('Review IDS: ' + reviewIds);
              var reviewImagesLocal = new Array(Math.max(...reviewIds)).fill(
                '',
              );
              console.log('Review images: ' + reviewImagesLocal);
              var imagesCount = 0;
              reviewIds.map((rId) => {
                fetch(
                  `${SERVER_URL}/api/1.0.0/location/${route.params.item.location_id}/review/${rId}/photo`,
                  requestOptions,
                )
                  .then((response) => response.blob())
                  .then((blob) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                      imagesCount++;
                      const data = reader.result.slice(
                        reader.result.indexOf('base64,') + 7,
                      );
                      if (data.length > 20) {
                        var base64Image = `data:image/jpeg;base64,${data}`;
                        reviewImagesLocal[rId] = base64Image;
                      }
                      if (imagesCount === reviewIds.length) {
                        console.log('Final images: ' + reviewImagesLocal);
                        setreviewImages(reviewImagesLocal);
                      }
                    };
                    reader.readAsDataURL(blob);
                  })
                  .catch((error) => {
                    imagesCount++;
                    console.log('error', error);
                  });
              });
            })
            .catch((error) => {
              alert('Error ' + JSON.stringify(error));
              setShowLoading(false);
            });
        } else {
          setItem(route.params.item);
          setLocationReviews(route.params.item.location_reviews);
          setShowLoading(false);
        }
      }
      if (route.params.userInfo) {
        setUserInfo(JSON.parse(route.params.userInfo));
      }
    }
  }, []);

  // console.log('Location Reviews : ' + JSON.stringify(locationReviews));

  const addReview = () => {
    if (userInfo && userInfo.token) {
      setShowModal(true);
    } else {
      alert('You should be logged in to post a review');
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
            style={{ width: 30, height: 30 }}
          />
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={{
              width: '70%',
              height: '100%',
              backgroundColor: COLORS.lightGray3,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: SIZES.radius,
            }}>
            <Text style={{ ...FONTS.h3 }}>{item?.location_name}</Text>
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
    const handleLike = (item) => {
      var myHeaders = new Headers();
      myHeaders.append('X-Authorization', userInfo.token);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
      };
      console.log(
        `${SERVER_URL}/api/1.0.0/location/${route.params.item.location_id}/review/${item.review_id}/like`,
      );
      fetch(
        `${SERVER_URL}/api/1.0.0/location/${route.params.item.location_id}/review/${item.review_id}/like`,
        requestOptions,
      )
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log('error', error));
    };

    const handleDisLike = (item) => {
      var myHeaders = new Headers();
      myHeaders.append('X-Authorization', userInfo.token);

      var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
      };
      fetch(
        `${SERVER_URL}/api/1.0.0/location/${route.params.item.location_id}/review/${item.review_id}/like`,
        requestOptions,
      )
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log('error', error));
    };

    const renderItem = ({ item }) => {
      return (
        <View
          style={{
            paddingBottom: 20,
            borderBottomWidth: 3,
            borderBottomColor: COLORS.lightGray
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Image
              source={icons.user}
              style={{
                height: 50,
                width: 50,
                tintColor: COLORS.darkgray,
                marginRight: 10,
              }}
            />
            <View style={{ marginLeft: 20 }}>
              {typeof (reviewUserData[item?.review_user_id] !== 'undefined') ? (
                <Text style={styles.userName}>
                  {reviewUserData[item?.review_user_id]}
                </Text>
              ) : null}

              {item?.review_body && item?.review_body.length > 0 ? (
                <Text style={styles.userReview}>{item?.review_body}</Text>
              ) : null}

              {/* <View style={[styles.rating, {width: 200}]}>
                <Text>Overall</Text>
                <Rating
                  readonly
                  isDisabled={true}
                  size={10}
                  startingValue={item?.review_overallrating}
                  fractions={2}
                  imageSize={15}
                />
              </View> */}
              <View style={[styles.rating, { width: 200 }]}>
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
              <View style={[styles.rating, { width: 200 }]}>
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
              <View style={[styles.rating, { width: 200 }]}>
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
          {reviewImages[item.review_id] && reviewImages[item.review_id].length > 20 ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                marginVertical: 20,
              }}>
              <Image
                style={{
                  width: Dimensions.get('screen').width - 120,
                  height: 200,
                }}
                source={{ uri: reviewImages[item.review_id] }}
              />
            </View>
          ) : null}


          {userInfo ? (
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 10,
                marginTop: 10,
              }}>
              <TouchableOpacity
                onPress={() => {
                  if (likedReviews.includes(item.review_id)) {
                    console.log('Handle remove like');
                    handleDisLike(item);
                    item.likes--;
                    var index = likedReviews.indexOf(item.review_id);
                    if (index > -1) {
                      console.log('Removing review id ; ' + item.review_id);
                      var newLikedReviews = likedReviews.splice(index, 1);
                      setLikedReviews([...likedReviews.splice(index, 1)]);
                      console.log(likedReviews);
                    }
                  } else {
                    handleLike(item);
                    item.likes++;
                    setLikedReviews([...likedReviews, item.review_id]);
                  }
                }}>
                <Image
                  source={icons.like}
                  style={{
                    height: 20,
                    width: 20,
                    tintColor: likedReviews.includes(item.review_id)
                      ? COLORS.primary
                      : COLORS.darkgray,
                    marginRight: 10,
                  }}
                />
              </TouchableOpacity>

              <Text>{item.likes}</Text>
            </View>
          ) : null}
        </View>
      );
    };

    return (
      <FlatList
        data={locationReviews}
        keyExtractor={(item) => item?.review_id?.toString()}
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

  if (showLoading === true) {
    return (
      <SafeAreaView style={styles.activityView}>
        <ActivityIndicator
          animating={showLoading}
          size="large"
          color={COLORS.primary}
        />
        <Text style={{ margin: 20 }}>Fetching the Reviews</Text>
      </SafeAreaView>
    );
  } else {
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
        <Text style={{ ...FONTS.h2, margin: 20, textAlign: 'center' }}>
          Review Summary
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 70,
            color: COLORS.darkgray,
            marginBottom: 20,
          }}>
          {item?.avg_overall_rating.toFixed(1)}/5
        </Text>
        <View
          style={{
            paddingLeft: 50,
            paddingRight: 50,
            borderBottomWidth: 3,
            borderBottomColor: COLORS.lightGray,
          }}>
          <View style={[styles.rating, { marginBottom: 20 }]}>
            <Text style={{ ...FONTS.body3 }}>Cleanliness</Text>
            <Rating
              readonly
              isDisabled={true}
              size={10}
              startingValue={item?.avg_clenliness_rating}
              fractions={2}
              imageSize={23}
            />
          </View>
          <View style={[styles.rating, { marginBottom: 20 }]}>
            <Text style={{ ...FONTS.body3 }}>Price</Text>
            <Rating
              readonly
              isDisabled={true}
              size={10}
              startingValue={item?.avg_price_rating}
              fractions={2}
              imageSize={23}
            />
          </View>
          <View style={[styles.rating, { marginBottom: 20 }]}>
            <Text style={{ ...FONTS.body3 }}>Quality</Text>
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
  }
};

export default Reviews;

const styles = StyleSheet.create({
  activityView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  userName: {
    width: 300,
    fontSize: 20,
    color: COLORS.primary,
    marginBottom: 5,
  },
});
