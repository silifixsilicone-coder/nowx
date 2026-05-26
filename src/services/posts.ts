import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
  query,
  orderBy,
  DocumentReference
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Post, Comment } from '../data/mockData';

/**
 * Creates a new post in the Firestore 'posts' collection
 */
export const createPost = async (postData: Omit<Post, 'id'>): Promise<DocumentReference> => {
  try {
    const postsRef = collection(db, 'posts');
    return await addDoc(postsRef, {
      ...postData,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in createPost service:', error);
    throw error;
  }
};

/**
 * Fetches all posts from the Firestore 'posts' collection, ordered by creation date
 */
export const getPosts = async (): Promise<Post[]> => {
  try {
    const postsRef = collection(db, 'posts');
    const postsQuery = query(postsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(postsQuery);
    
    const postsList: Post[] = [];
    querySnapshot.forEach((doc) => {
      postsList.push({
        id: doc.id,
        ...doc.data()
      } as Post);
    });
    
    return postsList;
  } catch (error) {
    console.error('Error in getPosts service:', error);
    throw error;
  }
};

/**
 * Appends a comment to an existing post by post ID in Firestore
 */
export const addComment = async (postId: string, commentData: Comment): Promise<void> => {
  try {
    const postDocRef = doc(db, 'posts', postId);
    await updateDoc(postDocRef, {
      comments: arrayUnion(commentData)
    });
  } catch (error) {
    console.error('Error in addComment service:', error);
    throw error;
  }
};
