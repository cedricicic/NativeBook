// import { useAuth } from '@/contexts/AuthContext';
// import { Ionicons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as AppleAuthentication from 'expo-apple-authentication';
// import * as Google from 'expo-auth-session/providers/google';
// import { makeRedirectUri } from 'expo-auth-session';
// import { useRouter } from 'expo-router';
// import * as WebBrowser from 'expo-web-browser';
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
// } from 'react-native';
// import { TouchableOpacity } from '@/components/ui/debounced-touchable-opacity';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import Svg, { Path } from 'react-native-svg';

// WebBrowser.maybeCompleteAuthSession();

// const TUTORIAL_COMPLETED_KEY = 'tutorial_completed';

// export default function SignInScreen() {
//   const [isGoogleLoading, setIsGoogleLoading] = useState(false);
//   const [isAppleLoading, setIsAppleLoading] = useState(false);
//   const [isEmailLoading, setIsEmailLoading] = useState(false);
//   const isLoading = isGoogleLoading || isAppleLoading || isEmailLoading;
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { isAuthenticated, signIn, isLoading: authLoading } = useAuth();
//   const scrollViewRef = useRef<ScrollView>(null);
//   const emailInputRef = useRef<TextInput>(null);
//   const passwordInputRef = useRef<TextInput>(null);
//   const emailInputY = useRef<number>(0);
//   const passwordInputY = useRef<number>(0);

//   const iosRedirectUri = 'com.googleusercontent.apps.1080752172933-6dofckm82s6kaadnro4volff7h3fnpek:/oauthredirect';
//   const androidRedirectUri = 'com.cordershop.mobile:/oauthredirect';

//   const [request, response, promptAsync] = Google.useAuthRequest({
//     iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS,
//     androidClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID,
//     webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
//     redirectUri: Platform.OS === 'ios' ? iosRedirectUri : androidRedirectUri,
//   });

//   useEffect(() => {
//     if (request?.url) {
//       console.log('[GoogleSignIn] Auth Request URL:', request.url);
//     }
//   }, [request]);

//   const [isAppleAuthAvailable, setIsAppleAuthAvailable] = useState(false);

//   useEffect(() => {
//     AppleAuthentication.isAvailableAsync().then(setIsAppleAuthAvailable);
//   }, []);

//   useEffect(() => {
//     if (response?.type === 'success') {
//       handleGoogleAuthSuccess(response.authentication);
//     } else if (response?.type === 'error') {
//       setError('Failed to sign in. Please try again.');
//       setIsGoogleLoading(false);
//     } else if (response?.type === 'dismiss' || response?.type === 'cancel') {
//       setIsGoogleLoading(false);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [response]);

//   // Redirect after sign-in: show tutorial if not completed, otherwise go home
//   useEffect(() => {
//     if (!isAuthenticated || authLoading) return;

//     const redirect = async () => {
//       const tutorialCompleted = await AsyncStorage.getItem(TUTORIAL_COMPLETED_KEY);
//       if (router.canGoBack()) {
//         router.dismiss();
//       }
//       if (tutorialCompleted === 'true') {
//         router.replace('/' as any);
//       } else {
//         router.replace('/tutorial');
//       }
//     };

//     redirect();
//   }, [isAuthenticated, authLoading, router]);

//   const handleGoogleAuthSuccess = async (authentication: any) => {
//     try {
//       setIsGoogleLoading(true);
//       setError('');

//       // Get user info from Google
//       const userInfoResponse = await fetch(
//         'https://www.googleapis.com/userinfo/v2/me',
//         {
//           headers: { Authorization: `Bearer ${authentication.accessToken}` },
//         }
//       );

//       const userInfo = await userInfoResponse.json();

//       console.log('[GoogleSignIn] Got user info from Google, exchanging for Supabase token...');

//       // Exchange Google ID token for Supabase access token via backend
//       // Try multiple API URLs as fallbacks
//       const apiUrls = [
//         process.env.EXPO_PUBLIC_API_URL,
//         'http://localhost:3000',
//         'https://corder.vercel.app',
//         'https://cord3r.com'
//       ].filter(Boolean);

//       let authSuccess = false;
//       let lastError = '';

//       for (const baseUrl of apiUrls) {
//         try {
//           console.log(`[GoogleSignIn] Trying ${baseUrl}/api/auth/google...`);

//           const response = await fetch(`${baseUrl}/api/auth/google`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               idToken: authentication.idToken,
//               userInfo: {
//                 email: userInfo.email,
//                 name: userInfo.name,
//                 picture: userInfo.picture,
//               },
//             }),
//           });

//           // Check if response is JSON
//           const contentType = response.headers.get('content-type');
//           if (!contentType || !contentType.includes('application/json')) {
//             const text = await response.text();
//             console.warn(`[GoogleSignIn] Non-JSON response from ${baseUrl}:`, text.substring(0, 100));
//             throw new Error(`Server returned ${response.status} ${response.statusText}`);
//           }

//           const data = await response.json();

//           if (response.ok && data.success) {
//             console.log('[GoogleSignIn] Successfully exchanged Google token for Supabase token');

//             // Create user object from response
//             const userData = {
//               id: data.user.id,
//               email: data.user.email,
//               name: data.user.name || userInfo.name,
//               picture: data.user.picture || userInfo.picture,
//             };

//             // Use AuthContext to sign in with Supabase access token
//             const expiresIn = data.session.expires_in || 3600;
//             console.log('[GoogleSignIn] Session expires_in:', expiresIn, 'seconds');
//             await signIn(userData, data.session.access_token, data.session.refresh_token, expiresIn, baseUrl);

//             // Add a small delay to ensure AsyncStorage has flushed to disk
//             await new Promise(resolve => setTimeout(resolve, 100));
//             console.log('[GoogleSignIn] Auth data stored successfully');

//             authSuccess = true;

//             // Check if this is a new user (backend uses Supabase auth only, no public user table)
//             let isNewUser = false;
//             try {
//               const checkUserResponse = await fetch(
//                 `${baseUrl}/api/check-user`,
//                 {
//                   method: 'POST',
//                   headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${data.session.access_token}`,
//                   },
//                   body: JSON.stringify({
//                     email: userData.email,
//                   }),
//                 }
//               );

//               if (checkUserResponse.ok) {
//                 const result = await checkUserResponse.json();
//                 isNewUser = result.isNewUser || false;
//               }
//             } catch (error) {
//               console.warn('Failed to check if user is new:', error);
//               isNewUser = false;
//             }

//             // Send welcome email for new users
//             if (isNewUser) {
//               try {
//                 const welcomeEmailResponse = await fetch(
//                   `${baseUrl}/api/send-welcome-email`,
//                   {
//                     method: 'POST',
//                     headers: {
//                       'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({
//                       userEmail: userData.email,
//                       userName: userData.name,
//                       isNewUser: true,
//                     }),
//                   }
//                 );

//                 if (welcomeEmailResponse.ok) {
//                   console.log(`[GoogleSignIn] Welcome email sent successfully via ${baseUrl}`);
//                 } else {
//                   console.warn(`[GoogleSignIn] Failed to send welcome email:`, await welcomeEmailResponse.text());
//                 }
//               } catch (emailError) {
//                 console.error('[GoogleSignIn] Error sending welcome email:', emailError);
//                 // Don't fail the sign-in process if email fails
//               }
//             }

//             break; // Success, exit the API URL loop
//           } else {
//             lastError = data.error || 'Failed to authenticate with Google';
//             console.warn(`[GoogleSignIn] Failed via ${baseUrl}:`, lastError);
//           }
//         } catch (urlError) {
//           console.warn(`[GoogleSignIn] Error with ${baseUrl}:`, urlError);
//           lastError = urlError instanceof Error ? urlError.message : 'Failed to connect to server';
//         }
//       }

//       if (!authSuccess) {
//         setError(lastError || 'Failed to sign in with Google. Please try again.');
//         return;
//       }
//     } catch (error) {
//       console.error('[GoogleSignIn] Authentication error:', error);
//       setError('An unexpected error occurred. Please try again.');
//     } finally {
//       setIsGoogleLoading(false);
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     try {
//       setIsGoogleLoading(true);
//       setError('');
//       // showInRecents: true is required for Android to properly handle 
//       // the redirect back from the browser auth window
//       await promptAsync({
//         showInRecents: true
//       });
//     } catch (error) {
//       console.error('Sign in error:', error);
//       setError('Failed to initiate sign in. Please try again.');
//       setIsGoogleLoading(false);
//     }
//   };

//   const handleAppleSignIn = async () => {
//     try {
//       setIsAppleLoading(true);
//       setError('');

//       const credential = await AppleAuthentication.signInAsync({
//         requestedScopes: [
//           AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
//           AppleAuthentication.AppleAuthenticationScope.EMAIL,
//         ],
//       });

//       console.log('[AppleSignIn] Credential received, exchanging for Supabase token...');

//       // Exchange Apple identity token for Supabase access token via backend
//       const apiUrls = [
//         process.env.EXPO_PUBLIC_API_URL,
//         'http://localhost:3000',
//         'https://corder.vercel.app',
//         'https://cord3r.com'
//       ].filter(Boolean);

//       let authSuccess = false;
//       let lastError = '';

//       for (const baseUrl of apiUrls) {
//         try {
//           console.log(`[AppleSignIn] Trying ${baseUrl}/api/auth/apple...`);

//           const response = await fetch(`${baseUrl}/api/auth/apple`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               identityToken: credential.identityToken,
//               user: credential.fullName ? {
//                 name: {
//                   givenName: credential.fullName.givenName,
//                   familyName: credential.fullName.familyName,
//                 },
//                 email: credential.email
//               } : undefined,
//             }),
//           });

//           // Check if response is JSON
//           const contentType = response.headers.get('content-type');
//           if (!contentType || !contentType.includes('application/json')) {
//             const text = await response.text();
//             console.warn(`[AppleSignIn] Non-JSON response from ${baseUrl}:`, text.substring(0, 100));
//             throw new Error(`Server returned ${response.status} ${response.statusText}`);
//           }

//           const data = await response.json();

//           if (response.ok && data.success) {
//             console.log('[AppleSignIn] Successfully exchanged Apple token for Supabase token');

//             const userData = {
//               id: data.user.id,
//               email: data.user.email,
//               name: data.user.name,
//               picture: data.user.picture,
//             };

//             const expiresIn = data.session.expires_in || 3600;
//             await signIn(userData, data.session.access_token, data.session.refresh_token, expiresIn, baseUrl);

//             await new Promise(resolve => setTimeout(resolve, 100));
//             console.log('[AppleSignIn] Auth data stored successfully');

//             authSuccess = true;

//             // Check new user status logic (same as Google) - simplified here as we can potentially refactor, 
//             // but for now keeping it inline to match existing pattern.
//             // ... (welcome email logic could be added here similar to Google flow)

//             break;
//           } else {
//             lastError = data.error || 'Failed to authenticate with Apple';
//             console.warn(`[AppleSignIn] Failed via ${baseUrl}:`, lastError);
//           }
//         } catch (urlError) {
//           console.warn(`[AppleSignIn] Error with ${baseUrl}:`, urlError);
//           lastError = urlError instanceof Error ? urlError.message : 'Failed to connect to server';
//         }
//       }

//       if (!authSuccess) {
//         setError(lastError || 'Failed to sign in with Apple. Please try again.');
//         return;
//       }
//     } catch (e: any) {
//       if (e.code === 'ERR_CANCELED') {
//         // User canceled
//       } else {
//         console.error('[AppleSignIn] Error:', e);
//         setError('Failed to sign in with Apple. Please try again.');
//       }
//     } finally {
//       setIsAppleLoading(false);
//     }
//   };

//   const validateForm = () => {
//     if (!email) {
//       setError('Email is required');
//       return false;
//     }
//     if (!email.trim().includes('@')) {
//       setError('Please enter a valid email address');
//       return false;
//     }
//     if (!password) {
//       setError('Password is required');
//       return false;
//     }
//     return true;
//   };

//   const handleEmailPasswordSignIn = async () => {
//     if (!validateForm()) return;

//     try {
//       setIsEmailLoading(true);
//       setError('');
//       setSuccess('');

//       // Call the API endpoint for email/password sign in
//       const apiUrls = [
//         process.env.EXPO_PUBLIC_API_URL,
//         'https://corder.vercel.app',
//         'https://cord3r.com'
//       ].filter(Boolean);

//       let signInSuccess = false;
//       let lastError = '';

//       for (const baseUrl of apiUrls) {
//         try {
//           console.log(`Attempting sign in via ${baseUrl}/api/auth/signin`);
//           const response = await fetch(`${baseUrl}/api/auth/signin`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               email: email.trim(),
//               password,
//             }),
//           });

//           // Get response text first (can only read once)
//           const responseText = await response.text();

//           // Check if response has content
//           if (!responseText || responseText.trim().length === 0) {
//             console.warn(`Empty response from ${baseUrl}`);
//             lastError = 'Server returned an empty response. Please try again.';
//             continue;
//           }

//           // Check content type
//           const contentType = response.headers.get('content-type');
//           const isJson = contentType && contentType.includes('application/json');

//           if (!isJson) {
//             console.warn(`Non-JSON response from ${baseUrl}:`, responseText.substring(0, 200));
//             lastError = response.status === 404
//               ? 'Sign in endpoint not found. Please check API configuration.'
//               : response.status === 405 || response.status === 401 || response.status === 403
//                 ? 'Wrong password/ User doesn\'t exist. Please try again or create an account.'
//                 : `Server returned an error (${response.status}). Please try again.`;
//             continue;
//           }

//           // Parse JSON response
//           let data;
//           try {
//             data = JSON.parse(responseText);
//           } catch (parseError) {
//             console.warn(`Failed to parse JSON from ${baseUrl}:`, parseError);
//             console.warn(`Response text:`, responseText.substring(0, 200));
//             lastError = 'Invalid response from server. Please try again.';
//             continue;
//           }

//           if (response.ok && data.success) {
//             // Block sign-in if email is not verified
//             if (data.user && !data.user.email_confirmed_at) {
//               console.log('[SignIn] Email not verified, blocking sign-in');
//               setError('Please verify your email before signing in. Check your inbox (and spam folder) for the verification link.');
//               setIsEmailLoading(false);
//               return;
//             }

//             console.log('[SignIn] Sign in successful, storing auth data...');

//             // Create user object from response
//             const userData = {
//               id: data.user.id,
//               email: data.user.email,
//               name: data.user.name || data.user.email?.split('@')[0] || 'User',
//               picture: data.user.picture || undefined,
//             };

//             // Use AuthContext to sign in with access token
//             const expiresIn = data.session.expires_in || 3600;
//             console.log('[SignIn] Session expires_in:', expiresIn, 'seconds');

//             // Wait for signIn to complete before proceeding
//             await signIn(userData, data.session.access_token, data.session.refresh_token, expiresIn, baseUrl);

//             // Add a small delay to ensure AsyncStorage has flushed to disk
//             // This prevents race conditions where the app navigates before data is persisted
//             await new Promise(resolve => setTimeout(resolve, 100));

//             console.log('[SignIn] Auth data stored, proceeding with post-signin actions...');

//             // Check if this is a new user (backend uses Supabase auth only, no public user table)
//             let isNewUser = false;
//             try {
//               const checkUserResponse = await fetch(
//                 `${baseUrl}/api/check-user`,
//                 {
//                   method: 'POST',
//                   headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${data.session.access_token}`,
//                   },
//                   body: JSON.stringify({
//                     email: userData.email,
//                   }),
//                 }
//               );

//               if (checkUserResponse.ok) {
//                 const result = await checkUserResponse.json();
//                 isNewUser = result.isNewUser || false;
//               }
//             } catch (error) {
//               console.warn('Failed to check if user is new, defaulting to false:', error);
//               isNewUser = false;
//             }

//             // Send welcome email for new users
//             if (isNewUser) {
//               try {
//                 const welcomeEmailResponse = await fetch(
//                   `${baseUrl}/api/send-welcome-email`,
//                   {
//                     method: 'POST',
//                     headers: {
//                       'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({
//                       userEmail: userData.email,
//                       userName: userData.name,
//                       isNewUser: true,
//                     }),
//                   }
//                 );

//                 if (welcomeEmailResponse.ok) {
//                   console.log(`Welcome email sent successfully to new mobile user via ${baseUrl}`);
//                 } else {
//                   console.warn(`Failed to send welcome email via ${baseUrl}:`, await welcomeEmailResponse.text());
//                 }
//               } catch (emailError) {
//                 console.error('Error sending welcome email:', emailError);
//                 // Don't fail the sign-in process if email fails
//               }
//             }

//             signInSuccess = true;
//             break;
//           } else {
//             // Check if it's an authentication error (401, 403, 405) or invalid credentials
//             if (response.status === 405 || response.status === 401 || response.status === 403) {
//               lastError = 'wrong password/ user doesn\'t exist';
//             } else {
//               lastError = data.error || 'wrong password/ user doesn\'t exist';
//             }
//           }
//         } catch (urlError) {
//           console.warn(`Error signing in via ${baseUrl}:`, urlError);
//           // More specific error message based on error type
//           if (urlError instanceof TypeError && urlError.message.includes('fetch')) {
//             lastError = 'Network error. Please check your internet connection.';
//           } else {
//             lastError = urlError instanceof Error ? urlError.message : 'Failed to connect to server. Please try again.';
//           }
//         }
//       }

//       if (!signInSuccess) {
//         setError(lastError || 'Failed to sign in. Please try again.');
//       }
//     } catch (error) {
//       console.error('Sign in error:', error);
//       setError('An unexpected error occurred. Please try again.');
//     } finally {
//       setIsEmailLoading(false);
//     }
//   };

//   // Show loading screen while checking authentication
//   if (authLoading) {
//     return (
//       <View style={styles.container}>
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#000000" />
//           <Text style={styles.loadingText}>Loading...</Text>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Main Content */}
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
//       >
//         <ScrollView
//           ref={scrollViewRef}
//           style={styles.content}
//           contentContainerStyle={styles.contentContainer}
//           keyboardShouldPersistTaps="handled"
//           keyboardDismissMode="on-drag"
//           showsVerticalScrollIndicator={false}
//         >
//           {/* Header with Logo */}
//           <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
//             <Text style={styles.logo}>CORDER</Text>
//             {/* Close Button - Top Right */}
//             <TouchableOpacity
//               style={[styles.closeButton, { top: insets.top + 16 }]}
//               onPress={() => {
//                 if (router.canGoBack()) {
//                   router.back();
//                 } else {
//                   router.replace('/');
//                 }
//               }}
//               hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
//             >
//               <Ionicons name="close" size={24} color="#000000" />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.card}>
//             <View style={styles.titleContainer}>
//               <Text style={styles.title}>Sign in to your account</Text>
//               <Text style={styles.subtitle}>Use your email and password to continue</Text>
//             </View>

//             {/* Google Sign In Button */}
//             <TouchableOpacity
//               style={[styles.googleButton, (isLoading || isAuthenticated) && styles.buttonDisabled]}
//               onPress={handleGoogleSignIn}
//               disabled={isLoading || isAuthenticated || !request}
//             >
//               {isGoogleLoading ? (
//                 <ActivityIndicator size="small" color="#666" />
//               ) : (
//                 <>
//                   <GoogleIcon />
//                   <Text style={styles.googleButtonText}>
//                     {isAuthenticated ? 'Already Signed In' : 'Continue with Google'}
//                   </Text>
//                 </>
//               )}
//             </TouchableOpacity>

//             {/* Apple Sign In Button */}
//             {isAppleAuthAvailable && (
//               <View style={{ marginTop: 4 }}>
//                 {isAppleLoading ? (
//                   <View style={styles.appleLoadingContainer}>
//                     <ActivityIndicator size="small" color="#ffffff" />
//                   </View>
//                 ) : (
//                   <AppleAuthentication.AppleAuthenticationButton
//                     buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
//                     buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
//                     cornerRadius={8}
//                     style={{ width: '100%', height: 48 }}
//                     onPress={handleAppleSignIn}
//                   />
//                 )}
//               </View>
//             )}

//             {/* Divider */}
//             <View style={styles.dividerContainer}>
//               <View style={styles.dividerLine} />
//               <Text style={styles.dividerText}>or</Text>
//               <View style={styles.dividerLine} />
//             </View>

//             {/* Email Input */}
//             <View
//               style={styles.inputContainer}
//               onLayout={(event) => {
//                 emailInputY.current = event.nativeEvent.layout.y;
//               }}
//             >
//               <Text style={styles.inputLabel}>Email</Text>
//               <TextInput
//                 ref={emailInputRef}
//                 style={styles.textInput}
//                 placeholder="Enter your email"
//                 placeholderTextColor="#9ca3af"
//                 value={email}
//                 onChangeText={(text) => {
//                   setEmail(text);
//                   if (error) setError('');
//                   if (success) setSuccess('');
//                 }}
//                 onFocus={() => {
//                   setTimeout(() => {
//                     scrollViewRef.current?.scrollTo({
//                       y: emailInputY.current - 20,
//                       animated: true
//                     });
//                   }, 100);
//                 }}
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//                 autoCorrect={false}
//               />
//             </View>

//             {/* Password Input */}
//             <View
//               style={styles.inputContainer}
//               onLayout={(event) => {
//                 passwordInputY.current = event.nativeEvent.layout.y;
//               }}
//             >
//               <Text style={styles.inputLabel}>Password</Text>
//               <View style={styles.passwordContainer}>
//                 <TextInput
//                   ref={passwordInputRef}
//                   style={styles.passwordInput}
//                   placeholder="Enter your password"
//                   placeholderTextColor="#9ca3af"
//                   value={password}
//                   onChangeText={(text) => {
//                     setPassword(text);
//                     if (error) setError('');
//                     if (success) setSuccess('');
//                   }}
//                   onFocus={() => {
//                     setTimeout(() => {
//                       scrollViewRef.current?.scrollTo({
//                         y: passwordInputY.current - 20,
//                         animated: true
//                       });
//                     }, 100);
//                   }}
//                   secureTextEntry={!showPassword}
//                   autoCapitalize="none"
//                   autoCorrect={false}
//                 />
//                 <TouchableOpacity
//                   style={styles.eyeButton}
//                   onPress={() => setShowPassword(!showPassword)}
//                 >
//                   <Ionicons
//                     name={showPassword ? "eye-off" : "eye"}
//                     size={20}
//                     color="#6b7280"
//                   />
//                 </TouchableOpacity>
//               </View>
//             </View>

//             {/* Sign In Button */}
//             <TouchableOpacity
//               style={[styles.signInButton, (isLoading || isAuthenticated) && styles.buttonDisabled]}
//               onPress={handleEmailPasswordSignIn}
//               disabled={isLoading || isAuthenticated}
//             >
//               <Text style={styles.signInButtonText}>
//                 {isEmailLoading ? 'Signing In...' : 'Sign In'}
//               </Text>
//             </TouchableOpacity>

//             {error && (
//               <View style={styles.errorBox}>
//                 <Text style={styles.errorText}>{error}</Text>
//               </View>
//             )}

//             {success && (
//               <View style={styles.successBox}>
//                 <Text style={styles.successText}>{success}</Text>
//               </View>
//             )}

//             {/* Forgot Password Link */}
//             <View style={styles.forgotPasswordContainer}>
//               <TouchableOpacity
//                 onPress={() => router.push('/reset-password')}
//                 disabled={isLoading || isAuthenticated}
//                 activeOpacity={1}
//               >
//                 <Text style={[styles.forgotPasswordText, (isLoading || isAuthenticated) && styles.linkDisabled]}>
//                   Forgot your password?
//                 </Text>
//               </TouchableOpacity>
//             </View>

//             {/* Sign Up Link */}
//             <View style={styles.signUpContainer}>
//               <TouchableOpacity
//                 onPress={() => router.push('/signup')}
//                 disabled={isLoading || isAuthenticated}
//                 activeOpacity={1}
//               >
//                 <Text style={[styles.signUpText, (isLoading || isAuthenticated) && styles.linkDisabled]}>
//                   Don&apos;t have an account?{' '}
//                   <Text style={styles.signUpLinkText}>Create one</Text>
//                 </Text>
//               </TouchableOpacity>
//             </View>

//             {/* Legal Text */}
//             <View style={styles.legalContainer}>
//               <Text style={styles.legalText}>
//                 By signing in, you agree to Corder&apos;s{' '}
//                 <Text style={styles.legalLink} onPress={() => router.push('/help-support/terms')}>Terms of Service</Text>
//                 {' '}and{' '}
//                 <Text style={styles.legalLink} onPress={() => router.push('/help-support/privacy')}>Privacy Policy</Text>.
//               </Text>
//             </View>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>

//     </View>
//   );
// }

// function GoogleIcon() {
//   return (
//     <View style={styles.googleIconContainer}>
//       <View style={styles.googleIcon}>
//         <Svg width="20" height="20" viewBox="0 0 24 24">
//           <Path
//             fill="#4285F4"
//             d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//           />
//           <Path
//             fill="#34A853"
//             d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//           />
//           <Path
//             fill="#FBBC05"
//             d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//           />
//           <Path
//             fill="#EA4335"
//             d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//           />
//         </Svg>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#faf8f6',
//   },
//   header: {
//     alignItems: 'center',
//     paddingBottom: 16,
//     backgroundColor: '#fbbf24',
//     marginHorizontal: -24,
//     paddingHorizontal: 24,
//     marginTop: 0,
//     position: 'relative',
//   },
//   logo: {
//     fontSize: 28,
//     color: '#000000',
//     letterSpacing: 1,
//     fontFamily: 'DelaGothicOne-Regular',
//   },
//   content: {
//     flex: 1,
//   },
//   contentContainer: {
//     paddingTop: 0,
//     paddingHorizontal: 24,
//     paddingBottom: 32,
//   },
//   card: {
//     borderRadius: 8,
//     padding: 24,
//     backgroundColor: '#faf8f6',
//     marginTop: 16,
//   },
//   titleContainer: {
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#000000',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#6b7280',
//     textAlign: 'center',
//   },
//   infoBox: {
//     backgroundColor: '#f9fafb',
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 24,
//     alignItems: 'center',
//   },
//   infoText: {
//     color: '#374151',
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   linkButton: {
//     marginTop: 4,
//   },
//   linkText: {
//     color: '#1f2937',
//     textDecorationLine: 'underline',
//     fontSize: 14,
//   },
//   googleButton: {
//     backgroundColor: '#ffffff',
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 8,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 16,
//     height: 48,
//   },
//   buttonDisabled: {
//     opacity: 0.5,
//   },
//   googleButtonText: {
//     color: '#374151',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   errorBox: {
//     backgroundColor: '#ffffff',
//     borderWidth: 1,
//     borderColor: '#000000',
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 24,
//   },
//   errorText: {
//     color: '#000000',
//     fontSize: 14,
//     textAlign: 'center',
//   },
//   successBox: {
//     backgroundColor: '#ffffff',
//     borderWidth: 1,
//     borderColor: '#000000',
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 16,
//   },
//   successText: {
//     color: '#000000',
//     fontSize: 14,
//     textAlign: 'center',
//   },
//   forgotPasswordContainer: {
//     marginTop: 12,
//     marginBottom: 0,
//     alignItems: 'center',
//   },
//   forgotPasswordText: {
//     fontSize: 14,
//     color: '#6b7280',
//     textDecorationLine: 'underline',
//   },
//   linkDisabled: {
//     opacity: 0.5,
//   },
//   signUpContainer: {
//     marginTop: 12,
//     marginBottom: 0,
//     alignItems: 'center',
//   },
//   signUpText: {
//     fontSize: 14,
//     color: '#6b7280',
//   },
//   signUpLinkText: {
//     textDecorationLine: 'underline',
//   },
//   legalContainer: {
//     marginTop: 24,
//   },
//   legalText: {
//     fontSize: 12,
//     color: '#6b7280',
//     textAlign: 'center',
//     lineHeight: 18,
//   },
//   legalLink: {
//     color: '#6b7280',
//     textDecorationLine: 'underline',
//   },
//   googleIconContainer: {
//     marginRight: 12,
//   },
//   googleIcon: {
//     width: 20,
//     height: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#ffffff',
//   },
//   loadingText: {
//     marginTop: 16,
//     fontSize: 16,
//     color: '#6b7280',
//   },
//   closeButton: {
//     position: 'absolute',
//     right: 24,
//     width: 40,
//     height: 40,
//     alignItems: 'center',
//     justifyContent: 'center',
//     zIndex: 1,
//   },
//   dividerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 16,
//   },
//   dividerLine: {
//     flex: 1,
//     height: 1,
//     backgroundColor: '#e5e7eb',
//   },
//   dividerText: {
//     marginHorizontal: 16,
//     fontSize: 14,
//     color: '#6b7280',
//     fontWeight: '500',
//   },
//   inputContainer: {
//     marginBottom: 16,
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#374151',
//     marginBottom: 8,
//   },
//   textInput: {
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 8,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     fontSize: 16,
//     color: '#000000',
//     backgroundColor: '#ffffff',
//   },
//   passwordContainer: {
//     position: 'relative',
//   },
//   passwordInput: {
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 8,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     paddingRight: 48,
//     fontSize: 16,
//     color: '#000000',
//     backgroundColor: '#ffffff',
//   },
//   eyeButton: {
//     position: 'absolute',
//     right: 16,
//     top: '50%',
//     marginTop: -14, // Half of icon size (20) + padding (4) = 12, but we want to center it properly
//     padding: 4,
//   },
//   signInButton: {
//     backgroundColor: '#000000',
//     borderRadius: 8,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 16,
//     height: 48,
//   },
//   signInButtonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   appleLoadingContainer: {
//     backgroundColor: '#000000',
//     borderRadius: 8,
//     height: 48,
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: '100%',
//   },
// });

