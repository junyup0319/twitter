<template>
  <v-container pa-0 ma-0 class="container">
    <input type="file" class="file-input" ref="fileInput" @change="editProfileImage">
    <v-layout wrap class="board-zone">
      <v-flex xs12 md1 class="left-empty"></v-flex>
      <v-flex xs12 sm2 md3 class="left-zone content-padding c">
        <v-card flat class="profile-zone" color="white">
          <div v-if="$store.getters.currentUser !== null">
            <div class="profile-upper"></div>
            <v-flex class="profile-image-zone" @click="clickProfileImage">
              <v-avatar v-if="$store.getters.currentUser !== null" class="profile-image">
                <img :src="$store.getters.currentUser.profileImageSrc">
              </v-avatar>
              <v-icon class="icon" ma-0 size="16" color="white">edit</v-icon>
            </v-flex>
            <div v-if="!isEditingName" class="name">{{$store.getters.currentUser.displayName}}
              <v-icon class="icon" ma-0 size="16" @click="clickName">edit</v-icon>
            </div>
            <v-text-field v-else class="inputName"
              :label="$store.getters.currentUser.displayName" solo hide-details rows="1" autofocus
              @blur="isEditingName = false"
              @keyup="editName"
              v-model="changeDisplayName">
            </v-text-field>
            <div class="email">{{$store.getters.currentUser.email}}</div>
            <v-layout class="twit-count-zone">
              <v-flex class="twit-content">
                <div class="twit">트윗</div>
                <div class="twit-count">{{myTwitCount}}</div>
              </v-flex>
              <v-flex class="twit-content">
                <div class="twit">팔로잉</div>
                <div class="twit-count">0</div>
              </v-flex>
              <v-flex class="twit-content">
                <div class="twit">팔로워</div>
                <div class="twit-count">0</div>
              </v-flex>
            </v-layout>
          </div>
          <div v-else>
            <div class="profile-upper"></div>
            <div class="profile-image-zone">
              <v-img class="profile-image"></v-img>
            </div>
            <div class="name">로그인이 필요합니다.</div>
          </div>
        </v-card>
        
        <v-card flat class="tag-trend-zone">
          <div class="title">TAG trend</div>
          <div class="tag" v-for="(tag, i) in getTagTrend" :key="'tagtrend' + i">{{tag.label}}</div>
        </v-card>
      </v-flex>
      <v-flex xs12 sm4 md5>
        <v-layout wrap column class="content-zone content-padding">
          <v-layout pa-3 class="input-zone">
            <v-avatar v-if="$store.getters.currentUser !== null" size="44px" class="profile">
              <img :src="$store.getters.currentUser.profileImageSrc">
            </v-avatar>
            <v-flex>
              <v-textarea class="text-area" ref="textArea"
                pa-0 ma-0 auto-grow solo hide-details
                @mousedown.stop="clickTextArea" @blur="blurTextArea"
                v-model="text"
                label="무슨 일이 일어나고 있나요?" append-icon="photo" rows="1" :height="textAreaHeight" style="border solid 1px">
              </v-textarea>
              <v-btn v-if="textAreaHeight > 100" class="twitButton"
                round color="primary"
                @mousedown="clickTwitButton">트윗하기</v-btn>
            </v-flex>
          </v-layout>
          <message v-for="(m, i) in messageData" :key="'message' + i"
            :message="m.message" :user="m.user"
            @deleteMessage="deleteMessage"
            @editMessage="editMessage">
          </message>
          
          
        </v-layout>
      </v-flex>
      <v-flex xs12 sm1 md3 class="right-empty"></v-flex>
    </v-layout>
  </v-container>
</template>

<script src="./board.ts">
</script>

<style lang="scss" scoped>
.container {
  max-width: 100%;
  background: rgb(224, 231, 237);
  height: calc(100vh - 64px);
  overflow-y: auto;
  .left-empty {
    // max-width: 112px;
  }
  .left-zone {
    min-width: 300px;
    // max-width: 520px;
    .profile-zone {
      width: 100%;
      // height: 200px;
      position: relative;
      .profile-upper {
        height: 92px;
        background: rgb(31, 141, 238);
        border-bottom-right-radius: 0px;
        border-bottom-left-radius: 0px;
      }
      .profile-image-zone {
        position: absolute;
        top: 60px;
        left: 10px;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        border: solid white 4px;
        background: rgb(31, 141, 238);
        &:hover {
          cursor: pointer;
          .icon {
            display: inline;
          }
        }
        .icon {
          position: absolute;
          bottom: 8px;
          right: 8px;
          display: none;
        }
        .profile-image {
          width: 100% !important;
          height: 100% !important;
        }
      }
      .name {
        padding-left: 100px;
        font-size: 18px;
        font-weight: 700;
        &:hover {
          .icon {
            display: inline;
          }
        }
        .icon {
          display: none;
          &:hover {
            cursor: pointer;
          }
        }
      }
      .inputName {
        margin-left: 100px;
        font-size: 12px;
      }
      .email {
        padding-left: 100px;
        font-size: 12px;
        color: #444;
      }
      .twit-count-zone {
        padding: 8px 0 0 16px;
        .twit-content {
          .twit {
            font-size: 14px;
            font-weight: 700;
          }
          .twit-count {
            font-size: 20px;
            font-weight: 800;
            color: rgb(31, 141, 238);
          }
        }
      }
    }
    .tag-trend-zone {
      background: white;
      margin-top: 16px;
      padding: 12px;
      .title {
        font-size: 18px;
        margin-bottom: 12px;
      }
      .tag {
        margin-top: 4px;
        font-size: 16px;
        font-weight: 500;
        color: rgb(31, 141, 238);
      }
    }
  }
  .content-padding {
    padding: 16px 8px 8px 8px;
  }
  .content-zone {
    min-width: 480px;
    .input-zone {
      position: relative;
      background: rgb(234, 244, 252);
      &:focus {
        height: 400px !important;
      }
      .profile {
        margin-right: 12px;
      }
      .text-area {
        font-size: 14px !important;
        text-align: center !important;
        align-items: center;      
      }
      .twitButton {
        margin-left: 400px;
      }
    }
    
  }
}
.file-input {
  display: none;
}
.right-empty {
  // max-width: 512px;
}

</style>