import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { User, Message as Msg } from '@/lib/module';
import { FirestoreCollection, FirestoreDocument } from '@/lib/firebase-web';

import _ from 'lodash';


const collection = new FirestoreCollection<Msg>('/message');


@Component({})
export default class Message extends Vue {
  public name: string = 'message';
  @Prop({default: {}}) private message!: Msg;
  @Prop({default: {}}) private user!: User;

  private isEditing: boolean = false;
  private editText: string = this.message.text;

  private clickEdit() {
    if (this.isEditing === true) {
      this.editText = this.message.text;
    }
    this.isEditing = !this.isEditing;
  }

  private editMessage() {
    const message = collection.create(Msg, this.message.id);
    const data = {
      text: this.editText,
      editedTime: new Date().toISOString(),
    };
    message.update(data);
    this.message.text = data.text;
    this.message.editedTime = data.editedTime;

    this.$emit('editMessage', data);
    this.isEditing = !this.isEditing;
  }

  private deleteMessage(message: Msg, user: User) {
    console.log(message);
    const document: FirestoreDocument<Msg> = collection.create(Msg, message.id);
    document.delete();
    this.$emit('deleteMessage', message);

  }

  private mounted() {
    this.message.text = this.message.text.replace(/(#\S*)/gi, '<b>$1</b>');
  }
}
