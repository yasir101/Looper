import React, { useEffect, useState } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';

const App = () => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        console.log('Checking Firebase initialization...');
        if (!firebase.apps.length) {
          console.log('No Firebase apps found, initializing...');
          await firebase.initializeApp({
            clientId:
              '1017529723910-s68nuigb8fog34gb8ktnub0ggtgnbnft.apps.googleusercontent.com',
            appId: '1:1017529723910:ios:fcd05e4bd69488c4b3a787',
            apiKey: 'AIzaSyBK9k8ZOruhR0KrW01ga6CP6FHOtdT6698',
            projectId: 'looper-5981f',
            storageBucket: 'looper-5981f.firebasestorage.app',
            databaseURL: '',
            messagingSenderId: '1017529723910',
          });
          console.log('Firebase initialized successfully');
        } else {
          console.log('Firebase already initialized');
        }

        console.log(
          'Firebase apps:',
          firebase.apps.map(app => app.name),
        );
        console.log('Default app:', firebase.app().name);
        setIsFirebaseInitialized(true);
      } catch (error) {
        console.error('Firebase initialization error:', error);
      }
    };

    initializeFirebase();

    GoogleSignin.configure({
      iosClientId:
        '1017529723910-s68nuigb8fog34gb8ktnub0ggtgnbnft.apps.googleusercontent.com',
      webClientId:
        '1017529723910-s68nuigb8fog34gb8ktnub0ggtgnbnft.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });

    // Check if user is already signed in
    const checkSignInStatus = async () => {
      try {
        const hasUser = await GoogleSignin.getCurrentUser();
        if (hasUser) {
          const userInfo = await GoogleSignin.signInSilently();
          if (userInfo) {
            const { accessToken } = await GoogleSignin.getTokens();
            const credential = await GoogleSignin.getTokens();
            const googleCredential = auth.GoogleAuthProvider.credential(
              credential.idToken,
              accessToken,
            );
            const userCredential = await auth().signInWithCredential(
              googleCredential,
            );
            setUser(userCredential.user);
          }
        }
      } catch (error) {
        console.error('Silent sign-in error:', error);
      }
    };

    checkSignInStatus();
  }, []);

  // Function to handle Google sign-in
  const signInWithGoogle = async () => {
    if (!isFirebaseInitialized) {
      console.error('Firebase not initialized yet');
      return;
    }

    try {
      console.log('Starting Google Sign-In...');

      // Check play services first
      await GoogleSignin.hasPlayServices();
      console.log('Play services check passed');

      // Get the Google Sign-In user details
      const signInResult = await GoogleSignin.signIn();
      console.log('Google Sign-In successful:', signInResult);

      const { accessToken, idToken } = await GoogleSignin.getTokens();
      console.log(
        'Got tokens - accessToken:',
        !!accessToken,
        'idToken:',
        !!idToken,
      );

      // Create a Google credential with the tokens
      const googleCredential = auth.GoogleAuthProvider.credential(
        idToken,
        accessToken,
      );
      console.log('Created Google credential');

      // Sign in with Firebase using the Google credential
      const userCredential = await auth().signInWithCredential(
        googleCredential,
      );
      console.log('Firebase sign in successful');

      // Set user details from Firebase
      setUser(userCredential.user);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the sign-in flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign-in is already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available');
      } else {
        console.error('Google Sign-In Error:', error);
      }
    }
  };

  // Function to handle sign-out
  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      await auth().signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign-out Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {user ? (
        <View>
          <Text>Welcome, {user.displayName}</Text>
          <Button title="Sign Out" onPress={signOut} />
        </View>
      ) : (
        <Button
          title={
            isFirebaseInitialized ? 'Sign in with Google' : 'Initializing...'
          }
          onPress={signInWithGoogle}
          disabled={!isFirebaseInitialized}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default App;
