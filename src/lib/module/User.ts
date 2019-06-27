import { FirestoreDocumentData } from '../firebase-web';

export default class User extends FirestoreDocumentData {
  public displayName: string = '';
  public email: string = '';
  public lastSignInTime: string = '';
  public uid: string = '';
  public profileImageSrc: string = 'https://vuetifyjs.com/apple-touch-icon-180x180.png';
}
