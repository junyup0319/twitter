import { FirestoreDocumentData } from '../firebase-web';

export default class Message extends FirestoreDocumentData {
  public text: string = '';
  public id: string = '';
  public uid: string = '';
  public createdTime: string = '';
  public editedTime: string = '';
  public tags: string[] | null = null;
}
