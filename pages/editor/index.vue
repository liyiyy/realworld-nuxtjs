<template>
  <div class="editor-page">
  <div class="container page">
    <div class="row">

      <div class="col-md-10 offset-md-1 col-xs-12">
        <form>
          <fieldset>
            <fieldset class="form-group">
                <input type="text" class="form-control form-control-lg" placeholder="Article Title" v-model="article.title">
            </fieldset>
            <fieldset class="form-group">
                <input type="text" class="form-control" placeholder="What's this article about?" v-model="article.description">
            </fieldset>
            <fieldset class="form-group">
                <textarea class="form-control" rows="8" placeholder="Write your article (in markdown)" v-model="article.body"></textarea>
            </fieldset>
            <fieldset class="form-group">
                <input type="text" class="form-control" placeholder="Enter tags"  v-model="taginput" @keyup.enter="addtagList">
                <div class="tag-list">
                  <span  class="tag-default tag-pill" v-for="(item,i) in article.tagList" :key="i">
                  <i class="ion-close-round" @click="removeTagitem(item)"></i>
                  {{item}}
                </span>
                </div>
            </fieldset>
            <button class="btn btn-lg pull-xs-right btn-primary" type="button" @click="publishArticle">
                Publish Article
            </button>
          </fieldset>
        </form>
      </div>

    </div>
  </div>
</div>
</template>

<script>
import {createArticle} from '@/api/article.js'
export default {
    middleware:'auth',
    name:'EditorIndex',
    data(){
      return {
        article:{
          "title": "",
          "description": "",
          "body": "",
          "tagList": []
        },
        taginput:''
      }
    },
    
    methods:{      
      addtagList(){
        this.article.tagList.push(this.taginput);
        this.taginput = ''
      },
      removeTagitem(tag){
        this.article.tagList.map((item,i)=>{
          if(item===tag){
            this.article.tagList.splice(i,1);
          }
        })
      },
      async publishArticle(){
        const {data} = await createArticle(this.article)
        console.log(data);
        this.article = data.article
        this.$router.push(`/article/${this.article.slug}`)
      },
    }
}
</script>

<style>

</style>