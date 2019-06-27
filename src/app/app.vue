<template>
  <v-app>
    <v-toolbar color="#fefefe">
      <v-spacer></v-spacer>
      <div class="input">
        <v-text-field solo label="검색" append-icon="search"
          class="search-bar" @keyup="searchTag" v-model="inputText">
        </v-text-field>
      </div>
      <v-spacer></v-spacer>
      <v-btn v-if="$store.getters.currentUser === null" color="primary" @click="login">로그인</v-btn>
      <v-btn v-else color="error" @click="logout">로그아웃</v-btn>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script src="./app.ts"/>

<style lang="scss" scoped>
.input {
  width: 300px !important;
}
</style>