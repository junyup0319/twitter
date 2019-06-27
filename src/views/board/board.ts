import { Vue, Component, Watch } from 'vue-property-decorator';
import { Auth, FirestoreCollection, FirestoreDocument, Storage } from '@/lib/firebase-web';
import { User, Message } from '@/lib/module';
import uuid from 'uuid';
import _ from 'lodash';
import Msg from '@/components/message';

const collection = new FirestoreCollection<Message>('/message');
const userCollection = new FirestoreCollection<User>('/user');


Vue.component('message', Msg);

@Component({})
export default class Board extends Vue {
  public $refs!: {
    textArea: HTMLElement;
    fileInput: HTMLElement;
  };
  private textAreaRows: number = 1;
  private textAreaHeight: number = 40;
  private text: string = '';
  private messages: Message[] = [];

  private isEditingName: boolean = false;
  private changeDisplayName: string = '';

  private twitCount: number = 0;
  private messageData: Array<{message: Message, user: User}> = [];

  private myTwitCount: number = 0;

  get getTagTrend() {
    const recentMessages = _.chain(this.messageData)
      .slice(0, 20).map(md => md.message.tags).flatten().countBy()
      .map((count, key) => {
        return {label: key, count};
      })
      .filter(t => t.label !== 'null')
      .orderBy('count', 'desc')
      .value();

    return recentMessages;
  }

  @Watch('$route.query', {deep: true})
  private async onChangeQuery() {
    console.warn('query change', this.$route.query.searchTag);
    if (!_.isNil(this.$route.query.searchTag) && this.$route.query.searchTag !== '') {
      this.messages = _.map((await collection.createQuery('tags', 'array-contains', '#' + this.$route.query.searchTag)
      .exec(Message)), d => d.data);
      console.log(this.messages);
    } else {
      collection.onChange(Message, async (msg, state) => {
        console.log(msg);
        if (state === 'added') {
          this.messages.push(msg.data);
        }
      });

    }
  }

  @Watch('messages')
  private async onChangeMessages() {
    console.log('change message!!', this.messages);
    this.messageData = [];
    this.twitCount = 0;
    const orderedMessage = _.orderBy(this.messages, 'editedTime', 'desc');

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < orderedMessage.length; i++) {
      const user = (await userCollection.createQuery('uid', '==', orderedMessage[i].uid).exec(User))[0];
      this.messageData.push({message: orderedMessage[i], user: user.data});
      if (this.$store.getters.currentUser !== null && this.$store.getters.currentUser.uid === orderedMessage[i].uid) {
        this.twitCount++;
      }
    }

    this.getMyTwit();

    // const promises: Array<Promise<any>> = [];
    // _.chain(orderedMessage)
    //   .forEach(m => {
    //     promises.push(userCollection.createQuery('uid', '==', m.uid).exec(User));
    //     // const user = (await userCollection.createQuery('uid', '==', m.uid)
    //     //   .exec(User))[0];
    //     // this.messageData.push({message: m, user: user.data});
    //     if (this.$store.getters.currentUser !== null && this.$store.getters.currentUser.uid === m.uid) {
    //       this.twitCount++;
    //     }
    //   })
    //   .value();
    // Promise.all(promises).then(users => {
    //   _.forEach(this.messages, (m, i) => {
    //     this.messageData.push({
    //       message: m,
    //       user: users[i][0].data
    //     });
    //   });
    // }).catch();


  }

  private clickTextArea() {
    console.log('click text area');
    this.textAreaRows = 1;
    this.textAreaHeight = 120;
  }
  private blurTextArea() {
    console.log('blur text area');
    this.textAreaRows = 1;
    this.textAreaHeight = 40;
  }
  private clickTwitButton() {
    console.log('clcik twit button');
    if (this.text.trim() !== '') {
      console.log(this.text);
      const mid = uuid();
      const message = collection.create(Message, mid);
      message.data.text = this.text;
      message.data.id = mid;
      message.data.createdTime = new Date().toISOString();
      message.data.editedTime = new Date().toISOString();
      message.data.uid = this.$store.getters.currentUser.uid;
      message.data.tags = this.text.match(/#\S*/gi);
      message.saveSync();
      this.text = '';
    }
  }

  private countTwit(uid: string) {
    this.twitCount = 0;

    _.forEach(this.messages, m => {
      if (m.uid === uid) {
        this.twitCount++;
      }
    });
  }

  private deleteMessage(message: Message) {
    this.messages = _.filter(this.messages, m => {
      console.log(m.id !== message.id);
      return m.id !== message.id;
    });
    console.log('delete msg', this.messages, message.id);
  }

  private editMessage(message: Message) {
    this.onChangeMessages();
    console.log('change data', this.messageData);
  }

  private clickProfileImage() {
    this.$refs.fileInput.click();
  }

  private async editProfileImage(e) {
    console.log('change profile', e.target.files[0]);
    const storage = new Storage(`/profileImage/${this.$store.getters.currentUser.uid}`);
    await storage.upload(e.target.files[0]);
    const imageSrc = await storage.getDownloadURL();

    const user = await userCollection.load(User, this.$store.getters.currentUser.uid);
    user.data.profileImageSrc = imageSrc;
    user.saveSync();

    // this.$store.commit('setProfileImage', imageSrc);
    this.$router.go(0);

  }

  private clickName() {
    console.log('click');
    this.isEditingName = !this.isEditingName;
  }
  private async editName(e) {
    if (e.key === 'Enter' && this.changeDisplayName !== '') {
      const user = await userCollection.load(User, this.$store.getters.currentUser.uid);
      user.data.displayName = this.changeDisplayName;
      user.saveSync();
      this.changeDisplayName = '';
      this.$router.go(0);
    }
  }

  private async getMyTwit() {
    this.myTwitCount = _.map((
      await collection.createQuery('uid', '==', this.$store.getters.currentUser.uid)
      .exec(Message)), m => m.data).length;
  }

  private async mounted() {
    Auth.addChangeListener('countTwit', u => {
      if (u !== null) {
        // @ts-ignore
        this.countTwit(u.uid);
      }
    });


    if (!_.isNil(this.$route.query.searchTag) && this.$route.query.searchTag !== '') {
      this.messages = _.map((await collection.createQuery('tags', 'array-contains', '#' + this.$route.query.searchTag)
      .exec(Message)), d => d.data);
      console.log(this.messages);
    } else {
      collection.onChange(Message, async (msg, state) => {
        console.log(msg);
        if (state === 'added') {
          this.messages.push(msg.data);
        }
      });

    }
  }
}
