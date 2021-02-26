import React from 'react';
import { useState } from 'react';
import {
  ActivityIndicator,
  Button,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { COLORS, FONTS, icons, SERVER_URL } from '../constants';

const ReviewModal = ({
  showModal,
  userInfo,
  setShowModal,
  item,
  navigation,
  updateLocationReviews,
}) => {
  const [clean, setClean] = useState(0);
  const [price, setPrice] = useState(0);
  const [quality, setQuality] = useState(0);
  const [over, setOver] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWarning, setIsWarning] = useState(false);

  const ratingCompleted = (rating, type) => {
    if (type === 'cleanliness') {
      setClean(rating);
      return;
    }
    if (type === 'price') {
      setPrice(rating);
      return;
    }
    if (type === 'quality') {
      setQuality(rating);
      return;
    }
    if (type === 'overall') {
      setOver(rating);
      return;
    }
  };

  const reset = () => {
    setClean(0);
    setPrice(0);
    setQuality(0);
    setOver(0);
    setReview('');
  };

  const handleReviewSubmit = () => {
    if (isWarning) {
      alert('Review cannot be submitted. Reviews on coffee only permitted');
      return;
    }
    if (
      clean === 0 &&
      price === 0 &&
      quality === 0 &&
      over === 0 &&
      review === ''
    ) {
      return;
    }

    console.log('UserINFO : ' + userInfo);
    setIsSubmitting(true);
    var myHeaders = new Headers();
    myHeaders.append('X-Authorization', userInfo.token);
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      overall_rating: Math.round((price + quality + clean) / 3),
      price_rating: price,
      quality_rating: quality,
      clenliness_rating: clean,
      review_body: review,
    });

    console.log(raw);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };

    fetch(
      `${SERVER_URL}/api/1.0.0/location/${item.location_id}/review`,
      requestOptions,
    )
      .then((response) => {
        if (response.ok) return response.text();
        else throw response.text();
      })
      .then((result) => {
        // let newLocationReviews = [...item.location_reviews, JSON.parse(raw)];
        // let newItem = {
        //   ...item,
        //   location_reviews: newLocationReviews,
        // };
        // console.log(newItem);
        setIsSubmitting(false);
        reset();
        setShowModal(false);
        alert(`Your review for ${item.location_name} has been submitted 😍`);
        navigation.navigate('Home', {
          user: userInfo,
        });
      })
      .catch((error) => {
        setIsSubmitting(false);
        alert('Error ' + JSON.stringify(error));
      });
  };

  return (
    <Modal animationType="slide" transparent={true} visible={showModal}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: 300,
            }}>
            <Text style={{ paddingLeft: 10, fontSize: 20 }}>Add a Review</Text>
            <TouchableOpacity
              onPress={() => {
                if (isSubmitting) {
                  return;
                }
                setShowModal(false);
              }}>
              <Image
                source={icons.close}
                resizeMode="contain"
                style={{ width: 15, height: 15 }}
              />
            </TouchableOpacity>
          </View>
          <TextInput
            multiline={true}
            numberOfLines={2}
            placeholder="Write your thoughts!"
            value={review}
            onChangeText={(text) => {
              setReview(text);
              var lowerCaseText = text.toLowerCase();
              if (
                lowerCaseText.includes('tea') ||
                lowerCaseText.includes('cakes') ||
                lowerCaseText.includes('cake') ||
                lowerCaseText.includes('pastries') ||
                lowerCaseText.includes('pastry') ||
                lowerCaseText.includes('cookie') ||
                lowerCaseText.includes('cookies') ||
                lowerCaseText.includes('shit')
              ) {
                setIsWarning(true);
              } else {
                setIsWarning(false);
              }
            }}
            style={{
              fontSize: 16,
              borderBottomColor: COLORS.lightGray,
              borderBottomWidth: 2,
              width: 250,
            }}
          />
          {isWarning ? (
            <Text style={styles.warningLabel}>
              Please write your review for the coffee. Don't spam with other
              things
            </Text>
          ) : null}

          <View style={styles.rating}>
            <Text style={{ minWidth: 100 }}>Cleanliness</Text>
            <AirbnbRating
              fractions="{2}"
              defaultRating={clean}
              onFinishRating={(rating) =>
                ratingCompleted(rating, 'cleanliness')
              }
              size={20}
            />
          </View>
          <View style={styles.rating}>
            <Text style={{ minWidth: 100 }}>Price</Text>
            <AirbnbRating
              fractions="{1}"
              defaultRating={price}
              onFinishRating={(rating) => ratingCompleted(rating, 'price')}
              size={20}
            />
          </View>
          <View style={styles.rating}>
            <Text style={{ minWidth: 100 }}>Quality</Text>
            <AirbnbRating
              fractions="{1}"
              defaultRating={quality}
              onFinishRating={(rating) => ratingCompleted(rating, 'quality')}
              size={20}
            />
          </View>
          {/* <View style={styles.rating}>
            <Text style={{minWidth: 100}}>Overall Rating</Text>
            <AirbnbRating
              fractions="{1}"
              defaultRating={over}
              onFinishRating={(rating) => ratingCompleted(rating, 'overall')}
              size={20}
            />
          </View> */}

          {isSubmitting ? (
            <ActivityIndicator
              animating={isSubmitting}
              size="large"
              color={COLORS.primary}
              style={{ marginTop: 20, width: 300 }}
            />
          ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={handleReviewSubmit}>
                <Text style={{ color: 'white' }}>Submit</Text>
              </TouchableOpacity>
            )}
        </View>
      </View>
    </Modal>
  );
};

export default ReviewModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: 300,
    marginTop: 30,
    padding: 10,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1,
  },
  warningLabel: {
    color: 'red',
    textAlign: 'center',
  },
});
