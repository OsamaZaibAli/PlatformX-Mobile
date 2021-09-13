import React, {FC, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import CustomTextField from '../../Components/CustomTextField';
import {darkColors} from '../../Constants/Colors';
import {Height, Sizes, Width} from '../../Constants/Size';
import Axios from '../../Utils/Axios';
import Loading from '../../Components/Loading';
import FormHandlers from '../../Utils/FormHandler';
import {ToastAndroid} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useStateValue} from '../../Store/StateProvider';

type props = {
  navigation: any;
};

const SignIn: FC<props> = ({navigation}) => {
  const [signIn, setsignIn] = useState({
    email: {value: 'federerr482@gmail.com', error: ''},
    password: {value: 'code.test', error: ''},
  });

  const [isLoading, setIsLoading] = useState(false);

  // get some handlers
  const {isEmailValid, isEmpty} = FormHandlers();
  // get context state
  const [state, dispatch] = useStateValue();

  const storeTokenLocally = async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      await AsyncStorage.setItem(key, '');
    }
  };

  const handleSignIn = () => {
    // set the loading to true
    let x = signIn;
    let isAllInputsValid = true;
    setIsLoading(true);

    // check's for email
    if (isEmpty(signIn.email.value.trim())) {
      x['email']['error'] = 'Email cannnot be Empty';
    } else {
      if (!isEmailValid(signIn.email.value.trim())) {
        x['email']['error'] = 'Please enter a valid email address';
      }
    }
    if (signIn['email']['error'] !== '') {
      setsignIn(props => {
        return {
          ...props,
          email: {
            value: props.email.value,
            error: props.email.error,
          },
        };
      });
      // make the input validation variable false
      isAllInputsValid = false;
    }

    // check's for password
    if (isEmpty(signIn.password.value.trim())) {
      signIn['password']['error'] = 'Password cannot be empty';
      setsignIn(props => {
        return {
          ...signIn,
        };
      });
      // make the input validation variable false
      isAllInputsValid = false;
    }

    if (isAllInputsValid) {
      Axios.post('/user/signin/', {
        email: signIn.email.value,
        password: signIn.password.value,
      })
        .then(function (response) {
          // handle success
          if (response.status === 200) {
            // user is valid
            // get user token
            if (response.data.access && response.data.refresh) {
              // if access and refresh token exist
              // store them in local storage
              storeTokenLocally('access', response.data.access)
                .then(() => storeTokenLocally('refresh', response.data.refresh))
                .then(() => {
                  // set the local sign in state to true
                  Axios.get('/user/')
                    .then(result => {
                      if (result.status === 200) {
                        // if token is valid
                        if (result.data.student) {
                          dispatch({type: 'SET_USER_TYPE', payload: 'student'});
                          // set user details
                          const userData = {
                            firstName: result.data.first_name,
                            lastName: result.data.last_name,
                            email: result.data.email,
                            userName: result.data.username,
                            profilePic: result.data.user_profile_image.path,
                          };
                          dispatch({type: 'SET_USER', payload: userData});
                        } else if (result.data.organization) {
                          dispatch({
                            type: 'SET_USER_TYPE',
                            payload: 'organization',
                          });
                        }
                        dispatch({type: 'SET_SIGN_IN', payload: true});
                      }
                    })
                    .catch(error => {
                      // set sign in state
                      dispatch({type: 'SET_USER_TYPE', payload: null});
                      return Promise.reject(error);
                    });
                  // set the loading to false
                  setIsLoading(false);
                });
            } else {
              // set the local sign in state to false
              dispatch({type: 'SET_SIGN_IN', payload: false});
              ToastAndroid.show('Error occured while signing in', 500);
            }
          } else {
            // set the local sign in state to false
            dispatch({type: 'SET_SIGN_IN', payload: false});
            ToastAndroid.show(response.data, 1500);
          }
        })
        .catch(function (error) {
          // set the local sign in state to false
          dispatch({type: 'SET_SIGN_IN', payload: false});
          // if there is exist email error
          if (error.response.data.email_error) {
            // set email error
            setsignIn(props => {
              return {
                ...props,
                email: {
                  value: props.email.value,
                  error: error.response.data.email_error,
                },
              };
            });
          } else if (error.response.data.password_error) {
            // set password error
            setsignIn(props => {
              return {
                ...props,
                password: {
                  value: props.password.value,
                  error: error.response.data.password_error,
                },
              };
            });
          }
          // else if there is any other error
          else if (error.response.data.error) {
            ToastAndroid.show(error.response.data.error, 1500);
          }
          // set the loading to false
          setIsLoading(false);
          // throw error;
          return Promise.reject(error);
        });
    } else {
      setIsLoading(false);
    }
  };

  const forgotPassword = () => {
    // clear all the error first
    setsignIn(props => {
      return {
        email: {value: '', error: ''},
        password: {value: '', error: ''},
      };
    });
    navigation.navigate('ResetPassword');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.parent}>
      {/* platformX logo  */}
      <View style={styles.logoContainer}>
        <Text style={styles.bracket}>{'<'}</Text>
        <Text style={styles.logo}>PlatformX</Text>
        <Text style={styles.bracket}>{'/>'}</Text>
      </View>
      <View style={styles.fieldContainer}>
        {/* email field  */}
        <CustomTextField
          placeholder={'Email'}
          defaultValue={signIn.email.value}
          onChangeText={text => {
            setsignIn(props => {
              return {
                ...props,
                email: {
                  value: text,
                  error: '',
                },
              };
            });
          }}
          textContentType={'emailAddress'}
          keyboardType={'email-address'}
          error={signIn.email.error}
        />

        {/* password field  */}
        <CustomTextField
          placeholder={'Password'}
          defaultValue={signIn.password.value}
          onChangeText={text => {
            setsignIn(props => {
              return {
                ...props,
                password: {
                  value: text,
                  error: '',
                },
              };
            });
          }}
          textContentType={'password'}
          keyboardType={'default'}
          error={signIn.password.error}
          rightIcon
          secureTextEntry={true}
        />
        {/* forgot password container  */}
        <View style={styles.forgotContainer}>
          <TouchableWithoutFeedback onPress={() => forgotPassword()}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableWithoutFeedback>
        </View>
      </View>

      {/* submit button container  */}
      <View style={styles.submitButtonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSignIn}>
          {isLoading ? (
            <Loading
              size={'small'}
              color={darkColors.SCREEN_BACKGROUND_COLOR}
            />
          ) : (
            <Text style={styles.submitButtonText}>Sign In</Text>
          )}
        </TouchableOpacity>
        {/* sign up container  */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>
            Don't have an account?{' '}
            <Text
              style={styles.signUp}
              onPress={() => navigation.navigate('SignUp')}>
              {' '}
              Sign Up
            </Text>
            {'  '}
            Now
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: darkColors.SCREEN_BACKGROUND_COLOR,
    flexDirection: 'column',
  },
  logoContainer: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
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
  },
  forgotContainer: {
    // flex: 0.1,
    width: Width * 0.8,
    // flex: 0.2,
    marginVertical: 7,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  forgotText: {
    color: darkColors.TOMATO_COLOR,
    fontSize: Sizes.normal,
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
  signUpContainer: {
    marginVertical: 15,
  },
  signUpText: {
    color: darkColors.TEXT_COLOR,
    fontSize: Sizes.normal * 0.9,
    paddingVertical: 2,
  },
  signUp: {
    color: darkColors.TOMATO_COLOR,
    fontSize: Sizes.normal,
    fontWeight: 'bold',
  },
});
