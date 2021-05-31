//FIELDS :TODO:
// first name
// last name
// user name
// email
// password
// confirm password

import React, {FC, useState} from 'react';
import {
  StyleSheet,
  Text,
  Platform,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import CustomTextField from '../../Components/CustomTextField';
import {darkColors} from '../../Constants/Colors';
import {Height, Sizes, Width} from '../../Constants/Size';

type props = {
  navigation: any;
};

const SignUp: FC<props> = ({navigation}) => {
  const [Registration, setRegistration] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const handleSignUp = () => {
    console.log('pressed on sign up');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      // keyboardVerticalOffset={20}
      style={styles.parent}>
      <ScrollView keyboardShouldPersistTaps={'always'}>
        <>
          {/* platformX logo  */}
          <View style={styles.logoContainer}>
            <Text style={styles.bracket}>{'<'}</Text>
            <Text style={styles.logo}>PlatformX</Text>
            <Text style={styles.bracket}>{'/>'}</Text>
          </View>

          <View style={styles.fieldContainer}>
            {/* first name field  */}
            <CustomTextField
              placeholder={'First Name'}
              defaultValue={Registration.first_name}
              onChangeText={text =>
                setRegistration(props => {
                  return {
                    ...props,
                    first_name: text,
                  };
                })
              }
              textContentType={'name'}
              autoFocus
            />
            {/* last name field  */}
            <CustomTextField
              placeholder={'Last Name'}
              defaultValue={Registration.last_name}
              onChangeText={text =>
                setRegistration(props => {
                  return {
                    ...props,
                    last_name: text,
                  };
                })
              }
              textContentType={'name'}
            />
            {/* username field  */}
            <CustomTextField
              placeholder={'User Name'}
              defaultValue={Registration.username}
              onChangeText={text =>
                setRegistration(props => {
                  return {
                    ...props,
                    username: text,
                  };
                })
              }
              textContentType={'username'}
            />
            {/* email field  */}
            <CustomTextField
              placeholder={'Email'}
              defaultValue={Registration.email}
              onChangeText={text =>
                setRegistration(props => {
                  return {
                    ...props,
                    email: text,
                  };
                })
              }
              textContentType={'emailAddress'}
            />

            {/* password field  */}
            <CustomTextField
              placeholder={'Password'}
              defaultValue={Registration.password}
              onChangeText={text =>
                setRegistration(props => {
                  return {
                    ...props,
                    password: text,
                  };
                })
              }
              textContentType={'password'}
              rightIcon
              secureTextEntry={true}
            />

            {/* confirm password  */}
            <CustomTextField
              placeholder={'Confirm Password '}
              defaultValue={Registration.confirm_password}
              onChangeText={text =>
                setRegistration(props => {
                  return {
                    ...props,
                    confirm_password: text,
                  };
                })
              }
              textContentType={'password'}
              rightIcon
              secureTextEntry={true}
            />
          </View>
          {/* submit button container  */}
          <View style={styles.submitButtonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSignUp}>
              <Text style={styles.submitButtonText}>Sign Up</Text>
            </TouchableOpacity>
            {/* sign up container  */}
            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>
                Don't have an account?
                <Text
                  style={styles.signIn}
                  onPress={() => navigation.navigate('SignIn')}>
                  {' '}
                  Sign In
                </Text>
                {'  '}
                Now
              </Text>
            </View>
          </View>
        </>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    flexDirection: 'column',
    // marginTop: Platform.OS === 'android' ? 25 : 0,
  },
  logoContainer: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: Height * 0.04,
  },
  bracket: {
    fontSize: Sizes.large * 2,
    // fontWeight: 'bold',
    fontFamily: 'ComicNeue-Regular',
    color: darkColors.TEXT_COLOR,
  },
  logo: {
    fontSize: Sizes.large * 1.7,
    color: darkColors.TEXT_COLOR,
    fontFamily: 'Comfortaa-SemiBold',
  },
  fieldContainer: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Height * 0.04,
  },
  submitButtonContainer: {
    flex: 0.2,
    marginHorizontal: Width * 0.04,
    marginVertical: 5,
    padding: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: darkColors.SHADOW_COLOR,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'transparent',
    maxHeight: Height * 0.06,
    width: Width * 0.9,
    height: Height * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: darkColors.TEXT_COLOR,
    fontSize: Sizes.normal * 1.1,
    paddingVertical: 2,
  },
  signInContainer: {
    marginVertical: 15,
  },
  signInText: {
    color: darkColors.TEXT_COLOR,
    fontSize: Sizes.normal * 0.9,
    paddingVertical: 2,
  },
  signIn: {
    color: darkColors.TOMATO_COLOR,
    fontSize: Sizes.normal,
    fontWeight: 'bold',
  },
});
