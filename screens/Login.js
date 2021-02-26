import React from 'react';
import { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS, FONTS, SERVER_URL } from '../constants';

const Login = ({ navigation }) => {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const changeMode = (mode) => {
    if (isAuthenticating) {
      return;
    }
    setMode(mode);
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
  };

  const handleLogin = () => {
    setIsAuthenticating(true);
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    var raw = JSON.stringify({ email: email, password: password });
    console.log(raw);
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };
    fetch(`${SERVER_URL}/api/1.0.0/user/login`, requestOptions)
      .then((response) => {
        if (response.ok) return response.text();
        else throw response.text();
      })
      .then((result) => {
        setIsAuthenticating(false);
        navigation.navigate('Home', {
          user: result,
        });
        changeMode('login');
      })
      .catch((error) => {
        alert('Error ' + JSON.stringify(error));
        setIsAuthenticating(false);
      });
  };

  const handleCreate = () => {
    setIsAuthenticating(true);
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
    });
    console.log(raw);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };

    fetch(`${SERVER_URL}/api/1.0.0/user/`, requestOptions)
      .then((response) => {
        if (response.ok) return response.text();
        else throw response.text();
      })
      .then((result) => {
        console.log(result);
        handleLogin();
      })
      .catch((error) => {
        setIsAuthenticating(false);
        alert('Error ' + JSON.stringify(error));
      });
  };

  const skipAuth = () => {
    if (isAuthenticating) {
      return;
    }
    navigation.navigate('Home');
    setMode('login');
  };

  if (mode === 'login') {
    return (
      <SafeAreaView
        style={{
          height: Dimensions.get('window').height,
          justifyContent: 'flex-start',
        }}>
        <Text style={{ ...FONTS.h2, margin: 50, textAlign: 'center' }}>
          LOGIN
        </Text>

        <View style={styles.loginContainer}>
          <TextInput
            style={styles.textInput}
            value={email}
            keyboardType="email-address"
            placeholder="Email"
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            style={styles.textInput}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            onChangeText={(text) => setPassword(text)}
          />
          {isAuthenticating ? (
            <ActivityIndicator
              animating={isAuthenticating}
              size="large"
              color={COLORS.primary}
              style={{ marginTop: 20 }}
            />
          ) : (
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={{ color: 'white' }}>Login</Text>
              </TouchableOpacity>
            )}

          <Text style={{ fontSize: 15, padding: 25, paddingBottom: 20 }}>
            ------------ OR ------------
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: COLORS.lightGray }]}
            onPress={() => changeMode('signup')}>
            <Text style={{ color: COLORS.black }}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginTop: 30 }} onPress={skipAuth}>
            <Text style={{ color: COLORS.primary }}> {'>> SKIP FOR NOW'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView
        style={{
          height: Dimensions.get('window').height,
          justifyContent: 'flex-start',
        }}>
        <Text style={{ ...FONTS.h2, margin: 50, textAlign: 'center' }}>
          SIGN UP
        </Text>
        <View style={styles.loginContainer}>
          <TextInput
            style={styles.textInput}
            value={firstName}
            placeholder="First Name"
            onChangeText={(text) => setFirstName(text)}
          />
          <TextInput
            style={styles.textInput}
            value={lastName}
            placeholder="Last Name"
            onChangeText={(text) => setLastName(text)}
          />
          <TextInput
            style={styles.textInput}
            value={email}
            keyboardType="email-address"
            placeholder="Email"
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            style={styles.textInput}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            onChangeText={(text) => setPassword(text)}
          />
          {isAuthenticating ? (
            <ActivityIndicator
              animating={isAuthenticating}
              size="large"
              color={COLORS.primary}
              style={{ marginTop: 20 }}
            />
          ) : (
              <TouchableOpacity style={styles.button} onPress={handleCreate}>
                <Text style={{ color: 'white' }}>Create Account</Text>
              </TouchableOpacity>
            )}

          <Text style={{ fontSize: 15, padding: 25, paddingBottom: 20 }}>
            ------------ OR ------------
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: COLORS.lightGray }]}
            onPress={() => changeMode('login')}>
            <Text style={{ color: COLORS.black }}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginTop: 30 }} onPress={skipAuth}>
            <Text style={{ color: COLORS.primary }}> {'>> SKIP FOR NOW'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
};

export default Login;

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
  loginContainer: {
    marginBottom: 50,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});