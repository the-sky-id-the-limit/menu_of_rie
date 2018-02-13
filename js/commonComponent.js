
// headerComponent
Vue.component('headers', {

    template : 
        '<div class="header">'+
        '<div class="header-navi">'+
            '<ul>'+
                '<router-link class="header-navi-li" tag="li" id="index" to="/">ホーム</router-link>'+
                '<router-link class="header-navi-li" tag="li" id="list" to="/list">献立リスト</router-link>'+
                '<router-link class="header-navi-li" tag="li" id="regist" :to="{ path: \'regist\', query: { keyName: keyName }}">献立登録</router-link>'+
            '</ul>'+
        '</div>'+
        '</div>',
    data: function () {
        return {
            keyName : ''
        }
    }
})

// footerComponent
Vue.component('footers', {
    template : 
        '<div class="footer">'+
            '<div class="copyright">Copyright © りっちゃんの献立 All Rights Reserved.</div><!-- .copyright -->'+
        '</div>'
})

// contentsPanelComponent
Vue.component('contents', {
    template :
        '<section class="contents-panel-box">'+
          '<div class="contents-panel-box">'+
            '<div v-if="displayObjects.length > 0" v-for="(object, index) in displayObjects" class="contents-panel-detail">'+
              '<figure class="figures">'+
                '<a :href="object.link" class="contents-panel-link" target="_blank">'+
                  '<img :src="object.imgSrc" class="contents-panel-img">'+
                  '<figcaption class="figcaptions">'+
                    '<h4 class="contents-panel-title">{{object.name}}</h4>'+
                    '<div :class="[\'contents-panel-star-\'] + index"></div>'+
                    '<p class="contents-panel-comment">{{object.comment}}</p>'+
                    '<div class="contents-panel-money">{{object.money | addComma}}円</div>'+
                  '</figcaption>'+
                '</a>'+
              '</figure>'+
              // width < 600の場合の表示
              '<div class="figures-min">'+
                '<a :href="object.link" class="contents-panel-link" target="_blank">'+
                  '<img :src="object.imgSrc" class="contents-panel-img">'+
                  '<div class="figcaptions-min">'+
                    '<h4 class="contents-panel-title">{{object.name}}</h4>'+
                    '<p class="contents-panel-comment">{{object.comment}}</p>'+
                    '<div class="contents-panel-money">{{object.money | addComma}}円</div>'+
                  '</div>'+
                '</a>'+
              '</div>'+
            '</div><!-- .contents-panel-detail -->'+
            '<div v-if="displayObjects.length == 0" class="no-data tac">'+
              '<p>該当データがありません</p>'+
            '</div><!-- .no-data -->'+
          '</div><!-- .contents-panel-box -->'+
        '</section>',
    props :  {
        displayFlag : {
            required : false
        },
        limit : {
            required : false
        },
        reagion : {
            required : false
        },
        searchWord : {
            required : false
        }
    },
    data: function () {
        return {
            title : "",
            sharedState : store.state,
            objects : store.state.objects,
            filteredObjects : [],
            displayObjects : []
        }
    },
    methods : {
        displayContents : function() {
            var displayFlag = this.displayFlag;
            this.filteredObjects = this.objects.concat();
            var nowDate = getYYYYMDD(new Date());
            // 未来日付は除外
            for(filtred of this.filteredObjects) {
                if(filtred.date < parseInt(nowDate)){
                    this.displayObjects.push(filtred);
                }
            }

            if(displayFlag == "good") {
                // 高評価
                this.displayObjects.sort(function(a,b){
                    if((a.starCost + a.starCast + a.starDeli) > (b.starCost + b.starCast + b.starDeli)) return -1;
                    if((a.starCost + a.starCast + a.starDeli) < (b.starCost + b.starCast + b.starDeli)) return 1;
                    return 0;
                }); 
            } else if (displayFlag == "latest") {
                // 最新
                this.displayObjects.sort(function(a,b){
                    if(a.date > b.date) return -1;
                    if(a.date < b.date) return 1;
                    return 0;
                });

            } else if (displayFlag == "lowCost") {
                // 安い順
                this.displayObjects.sort(function(a,b){
                    if(a.money < b.money) return -1;
                    if(a.money > b.money) return 1;
                    return 0;
                });
            } else if (displayFlag == "highCost") {
                // 高い順
                this.displayObjects.sort(function(a,b){
                    if(a.money > b.money) return -1;
                    if(a.money < b.money) return 1;
                    return 0;
                });
            } else if (displayFlag == "reagion") {
                // 地域
                var editObjects = this.displayObjects.concat();
                this.displayObjects = [];
                for(editObject of editObjects) {
                    if(this.reagion == editObject.reagion) {
                        this.displayObjects.push(editObject);
                    }
                }
            } else if (displayFlag == "word") {
                // 関連ワード
                //　保留
            } else if (displayFlag == "all") {
                this.displayObjects = this.objects;
            }

            if(this.displayObjects.length > this.limit) {
                this.displayObjects.splice(this.limit, this.displayObjects.length - this.limit);
            }
        }
    },
    /**
     * 表示コンテンツを絞り込みます。
     * 絞り込み条件
     * good : 高評価
     * latest : 最新
     * cost : コスト
     * region : 地域
     * word : 関連ワード
     * all : 全て
     */
    created : function(){
        this.displayContents();
    },
    mounted: function(){

      var createStar = function(index, objetcs){
          
          var object = objetcs[index];
          var aveScore = 0
          if(object == undefined){
             aveScore =  0;
          }
          var totalScore = object.starCost + object.starCast + object.starDeli;
          aveScore = totalScore/3
          $('.contents-panel-star-' + index).raty({ 
            score: aveScore,
            path: './img' 
          });
      }

      for(var i = 0; i < this.displayObjects.length; i++) {
          createStar(i, this.displayObjects);
      }
    },
    watch: {
        displayFlag: function (val) {
            this.displayContents();
        },
        limit : function(val){
            this.displayContents();
        },
        reagion : function(val){
            this.displayContents();
        },
        searchWord : function(val){
            this.displayContents();
        }

    }
})