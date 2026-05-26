import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential
} from 'firebase/auth';
import { auth } from '../lib/firebase';

const googleProvider = new GoogleAuthProvider();

/**
 * Sign up a new user using email and password
 */
export const signUp = async (email: string, password: string): Promise<UserCredential> => {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error in signUp service:', error);
    throw error;
  }
};

/**
 * Log in an existing user using email and password
 */
export const login = async (email: string, password: string): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error in login service:', error);
    throw error;
  }
};

/**
 * Log out the currently authenticated user
 */
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error in logout service:', error);
    throw error;
  }
};

/**
 * Log in a user using Google Authentication popup
 */
export const googleLogin = async (): Promise<UserCredential> => {
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error('Error in googleLogin service:', error);
    throw error;
  }
};
