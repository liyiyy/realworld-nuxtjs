<template>
    <div class="home-page">

  <div class="banner">
    <div class="container">
      <h1 class="logo-font">home page</h1>
      <p>A place to share your knowledge.</p>
    </div>
  </div>

  <div class="container page">
    <div class="row">

      <div class="col-md-9">
        <div class="feed-toggle">
          <ul class="nav nav-pills outline-active">
            <li v-if="user" class="nav-item">
              <nuxt-link class="nav-link"
              :class="{'active':tab==='your_feed'}" 
              exact
              :to="{
                name:'home',
                query:{
                  tab:'your_feed'
                }
              }">Your Feed</nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link class="nav-link"
              :class="{'active':tab==='global_feed'}" 
              exact
              :to="{
                name:'home',
                query:{
                  tab:'global_feed'
                }
              }">Global Feed</nuxt-link>
            </li>
            <li v-if="tag" class="nav-item">
              <nuxt-link class="nav-link"
              :class="{'active':tab==='tag'}" 
              exact
              :to="{
                name:'home',
                query:{
                  tab:'tag',
                  tag:tag
                }
              }">#{{tag}}</nuxt-link>
            </li>
          </ul>
        </div>

        <div 
          class="article-preview"
          v-for="article in articles"
          :key="article.slug">
          <div class="article-meta">
            <nuxt-link :to="{
                name:'profile',
                params:{
                  username:'article.author.username'
                }
              }">
              <img :src="article.author.image" />
            </nuxt-link>
            <div class="info">
              <!-- <a href="" class="author">Eric Simons</a> -->
              <nuxt-link class="author"  :to="{
                name:'profile',
                params:{
                  username:'article.author.username'
                }
              }">
              {{article.author.username}}
            </nuxt-link>
              <span class="date">{{article.updatedAt | date('MMM DD, YYYY')}}</span>
            </div>
            <button 
              class="btn btn-outline-primary btn-sm pull-xs-right"
              :class="{'active':article.favorited}"
              @click="onFavorite(article)"
              :disabled='article.favoriteDisabled'
              >
              <i class="ion-heart"></i> {{article.favoritesCount}}
            </button>
          </div>
          <nuxt-link 
            class="preview-link" 
            :to="{
              name:'article',
              params:{slug:article.slug}
            }"

          >
            <h1>{{article.title}}</h1>
            <p>{{article.description}}</p>
            <span>Read more...</span>
          </nuxt-link>
        </div>

        <!-- 分页 -->
        <nav>
  <ul class="pagination">

    <!-- ngRepeat: pageNumber in $ctrl.pageRange($ctrl.totalPages) -->
    <li class="page-item"
      :class="{active:item===page}"
     v-for="item in totalPage" :key="item">

      <nuxt-link class="page-link" :to="{
        name:'home',
        query:{
          page:item,
          tag:$route.query.tag,
          tab:tab
        }
        }">{{item}}</nuxt-link>

    </li>
  </ul>
</nav>
        <!-- /分页 -->

      </div>

      <div class="col-md-3">
        <div class="sidebar">
          <p>Popular Tags</p>

          <div class="tag-list">
            <nuxt-link 
              :to="{
                  name:'home',
                  query:{
                    tab:'tag',
                    tag:item
                  }
                }"
               class="tag-pill tag-default"
              v-for="item in tags"
              :key="item"
              >{{item}}</nuxt-link>
            
          </div>
        </div>
      </div>

    </div>
  </div>

</div>
</template>


<script>
import { getArticles,getFeedArticles,addfavorite,deletefavorite } from '@/api/article.js'
import { getTags } from '@/api/tag.js'
import { mapState } from 'vuex'
/**
 * 优化前代码
 * 
 * export default {
  name:'HomeIndex',
  watchQuery: ['page'],
  // 在初始化页面前先得到数据
  async asyncData({query}){
    const page = Number.parseInt(query.page)||1;
    const limit = 20;
    const {data} = await getArticles({
      limit:limit,
      offset:(page-1)*limit
    })
    const {data:tagData}=await getTags()
    
    return {
      articles:data.articles,
      articlesCount:data.articlesCount,
      limit,
      page,
      tags:tagData.tags
    }
    console.log(data);
  },
 computed:{
   totalPage(){
     return Math.ceil(this.articlesCount/this.limit)
   }
 }
}
 */
export default {
  name:'HomeIndex',
  // 在初始化页面前先得到数据
  async asyncData({query,store}){
    const page = Number.parseInt(query.page)||1;
    const limit = 20;
    const {tag} = query;
    const tab = query.tab || 'global';
    // const {data} = await 
    // const {data:tagData}=await 
    const loadArticles = store.state.user && tab === 'your_feed'?getFeedArticles:getArticles
// 优化，并发执行
    const [articleRes, tagRes] = await Promise.all([
      loadArticles({
        limit:limit,
        offset:(page-1)*limit,
        tag
      }),
      getTags()
    ])
    const {articles,articlesCount} = articleRes.data;
    const {tags} = tagRes.data;

    articles.forEach(article => article.favoriteDisabled=false);
    return {
      articles,
      articlesCount,
      limit,
      page,
      tags,
      tag,
      tab
    }
  },
  watchQuery: ['page','tag',"tab"],
 computed:{
   ...mapState(['user']),
   totalPage(){
     return Math.ceil(this.articlesCount/this.limit)
   },

 },
 methods:{
  async onFavorite(article){
     article.favoriteDisabled = true;
     if(article.favorited){
      await deletefavorite(article.slug)
       article.favorited = false;
       article.favoritesCount--;
     }else{
      await addfavorite(article.slug)
       article.favorited = true;
       article.favoritesCount++;
     }
     article.favoriteDisabled = false;
   }
 }
}
</script>