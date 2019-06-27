import { Vue, Component } from 'vue-property-decorator';
import { Auth, FirestoreCollection, FirestoreDocument } from '@/lib/firebase-web';
import { User, Message } from '@/lib/module';
import router from '@/router';

const collection = new FirestoreCollection<User>('/user');
const messageCollection = new FirestoreCollection<Message>('/message');

@Component({})
export default class App extends Vue {
  public $refs!: {
    searchInput: HTMLElement
  };
  private inputText: string = '';

  private async login() {
    Auth.signIn(0);
  }
  private logout() {
    Auth.signOut();
    console.log('logout');
  }

  private async searchTag(e) {
    // console.log(this.inputText);
    if (e.key === 'Enter') {
      this.$router.push({name: 'board', query: {searchTag: this.inputText}});
      this.inputText = '';
    }
  }
  private mounted() {
    Auth.addChangeBeforeListener('user', async u => {
      console.log('change user', u);

      if (u !== null) {
        let user: FirestoreDocument<User>;
        if (await collection.exist(u.uid)) {
          user = await collection.load(User, u.uid);
          user.data.lastSignInTime = new Date().toISOString();
        } else {
          user = collection.create(User, u.uid);
          user.data.displayName = u.displayName ? u.displayName : '';
          user.data.email = u.email ? u.email : '';
          user.data.uid = u.uid;
          // @ts-ignore
          user.data.profileImageSrc = u.profileImageSrc;
          user.data.lastSignInTime = new Date().toISOString();
        }
        user.saveSync();
        this.$store.commit('signIn', user.data);
      } else {
        this.$store.commit('signOut');
      }
      // store에 저장
      console.log('current user', this.$store.getters.currentUser);

    });
  }

}
