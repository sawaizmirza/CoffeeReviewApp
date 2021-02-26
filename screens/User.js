import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS, FONTS, icons, SERVER_URL, SIZES } from '../constants';

const User = ({ route, navigation }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (route.params && route.params.user) {
      console.log(route.params.user);
      setUserInfo(JSON.parse(route.params.user));
      var localUserInfo = JSON.parse(route.params.user);
      var myHeaders = new Headers();
      myHeaders.append('X-Authorization', localUserInfo.token);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
      };
      fetch(`${SERVER_URL}/api/1.0.0/user/${localUserInfo.id}`, requestOptions)
        .then((resp) => {
          if (resp.ok) return resp.json();
          else throw resp.text();
        })
        .then((success) => {
          console.log(success.first_name);
          setFirstName(success.first_name);
          setLastName(success.last_name);
          setEmail(success.email);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          console.log(
            'Failed to fetch logged in user data : ' + JSON.stringify(error),
          );
        });
    }
  }, []);

  const handleLogOut = () => {
    var myHeaders = new Headers();
    myHeaders.append('X-Authorization', userInfo.token);

    var raw = '';

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };

    fetch(`${SERVER_URL}/api/1.0.0/user/logout`, requestOptions)
      .then((response) => {
        if (response.ok) return response.text();
        else throw response.text();
      })
      .then((result) => {
        alert('Log Out Successful');
        navigation.navigate('Login');
      })
      .catch((error) => alert('Error : ' + error));
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
            <Text style={{ ...FONTS.h3, color: COLORS.primary }}>
              User Profile
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={handleLogOut}>
          <Text
            style={{
              height: 30,
              color: COLORS.darkgray,
              fontSize: 20,
              marginTop: 10,
              marginRight: 10,
            }}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const updateUserData = () => {
    setIsAuthenticating(true);
    var myHeaders = new Headers();
    myHeaders.append('X-Authorization', userInfo.token);
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
    });

    var requestOptions = {
      method: 'PATCH',
      headers: myHeaders,
      body: raw,
    };

    fetch(`${SERVER_URL}/api/1.0.0/user/${userInfo.id}`, requestOptions)
      .then((response) => {
        if (response.ok) return response.text();
        else return response.text();
      })
      .then((result) => {
        setIsAuthenticating(false);
        alert('User Data updated successfully');
      })
      .catch((error) => {
        setIsAuthenticating(false);
        alert('Failed to update user data');
        console.log('error', error);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {renderHeader()}
      {isLoading ? (
        <View style={styles.activityView}>
          <ActivityIndicator
            animating={isLoading}
            size="large"
            color={COLORS.primary}
          />
          <Text style={{ margin: 20 }}>Fetching the User Data</Text>
        </View>
      ) : (
          <View style={styles.loginContainer}>
            <View>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.textInput}
                value={firstName}
                placeholder="First Name"
                onChangeText={(text) => setFirstName(text)}
              />
            </View>
            <View>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.textInput}
                value={lastName}
                placeholder="Last Name"
                onChangeText={(text) => setLastName(text)}
              />
            </View>
            <View>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.textInput}
                value={email}
                keyboardType="email-address"
                placeholder="Email"
                onChangeText={(text) => setEmail(text)}
              />
            </View>
            <View>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.textInput}
                value={password}
                secureTextEntry={true}
                placeholder="Update Password"
                onChangeText={(text) => setPassword(text)}
              />
            </View>

            {isAuthenticating ? (
              <ActivityIndicator
                animating={isAuthenticating}
                size="large"
                color={COLORS.primary}
                style={{ marginTop: 20 }}
              />
            ) : (
                <TouchableOpacity style={styles.button} onPress={updateUserData}>
                  <Text style={{ color: 'white' }}>Update Data</Text>
                </TouchableOpacity>
              )}
          </View>
        )}
    </SafeAreaView>
  );
};

export default User;

const styles = StyleSheet.create({
  textInput: {
    width: 300,
    marginBottom: 20,
    padding: 5,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 16,
  },
  loginContainer: {
    marginTop: 50,
    marginBottom: 50,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    width: 300,
    marginTop: 20,
    padding: 10,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1,
  },
  label: {
    marginBottom: 5,
  },
  activityView: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',
  },
});
