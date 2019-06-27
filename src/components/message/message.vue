<template>
    <v-card class="content" flat>
      <v-layout>
        <div xs1 mr-2 justify-start layout>
          <v-avatar color="grey lighten-4">
            <img :src="user.profileImageSrc" alt="avatar">
          </v-avatar>
        </div>
        <v-layout ml-1 column>
          <v-layout class="info-zone">
            <div class="nickname">{{user.displayName}}</div>
            <div class="email">{{user.email}} ・</div>
            <v-flex class="date">{{message.editedTime}}</v-flex>
            <v-spacer></v-spacer>
            <div v-if="!isEditing && $store.getters.currentUser !== null &&
                $store.getters.currentUser.uid === message.uid" class="button-zone">
              <v-btn ma-0 fab small color="primary" flat
                class="button" @click="clickEdit">
                <v-icon class="icon" ma-0 dark>edit</v-icon>
              </v-btn>
              <v-btn
                @click="deleteMessage(message)"
                fab small color="error" class="button" flat>
                <v-icon class="icon">delete</v-icon>
              </v-btn>
            </div>
            
          </v-layout>
          <div v-if="!isEditing" class="text" v-html="message.text"></div>
          <div v-else>
            <v-textarea pa-0 ma-0 auto-grow solo hide-details flat autofocus
              background-color="#eee"
              rows="1"
              v-model="editText">
            </v-textarea>
            <v-layout justify-end>
              <v-btn @click="clickEdit">취소</v-btn>
              <v-btn @click="editMessage" color="primary">수정</v-btn>
            </v-layout>
          </div>
        </v-layout>
      </v-layout>
    </v-card>
</template>

<script src="./message.ts"/>

<style lang="scss" scoped>
.content {
      padding: 12px;
      border-bottom: solid 1px rgb(224, 231, 237);
      position: relative;
      &:hover {
        background: rgb(246, 248, 250);
        cursor: pointer;
        .button-zone {
          display: inline;
        }
      }
      .nickname {
        font-size: 15px;
        font-weight: 700;
        margin-right: 4px;
      }
      .email {
        font-size: 14px;
        margin-right: 4px;
        color: #777;
      }
      .date {
        font-size: 14px;
        margin-right: 4px;
        color: #777;
        &:hover {
          text-decoration: underline;
        }
      }
      .button-zone {
        display: none;
        position: absolute;
        top: 4px;
        right: 8px;
        .button {
          max-width: 26px;
          max-height: 26px;
          margin: 0 4px !important;   
        }
      }
      .text {
        color: #444;
      }
    }
</style>