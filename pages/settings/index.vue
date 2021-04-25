<template>
  <div class="settings-page">
  <div class="container page">
    <div class="row">

      <div class="col-md-6 offset-md-3 col-xs-12">
        <h1 class="text-xs-center">Your Settings</h1>
        <form>
          <fieldset>
              <fieldset class="form-group">
                <input class="form-control" type="text" placeholder="URL of profile picture" v-model="user.image">
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="text" placeholder="Your Name" v-model="user.bio">
              </fieldset>
              <fieldset class="form-group">
                <textarea class="form-control form-control-lg" rows="8" placeholder="Short bio about you" v-model="user.username"></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="text" placeholder="Email" v-model="user.email">
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="password" placeholder="Password" v-model="user.password">
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right" @click="clickUpdateUser">
                Update Settings
              </button>
          </fieldset>
        </form>
        <hr>
        <button class="btn btn-outline-danger" @click="logout()">
          Or click here to logout.
        </button>
      </div>

    </div>
  </div>
</div>
</template>

<script>
const Cookie = process.client ? require('js-cookie') : undefined
import {getUser,updateUser} from '@/api/user'
export default {
    middleware:'auth',
    name:'SettingIndex',
    async asyncData(){
        const {data} = await getUser();
        return {
          user:data.user
        }
      },
    methods:{
      
      logout(){
        this.$store.commit('setUser',"")
        Cookie.set('user','')
        this.$router.push('/')
      },
      async clickUpdateUser(){
         await updateUser(this.user)

      }
    }
}
</script>

<style>

</style>