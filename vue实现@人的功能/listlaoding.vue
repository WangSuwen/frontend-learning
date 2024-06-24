<template>
  <div>
    <div class="loadingBox" v-show="showBox"></div>
    <div class="dialogBox" v-show="showBox">
      <div class="triangleBox"></div>
      <div
        style="display: flex; justify-content: space-between; padding-bottom: 5px; border-bottom:1px solid #f5f5f5; margin-bottom: 10px;"
      >
        <div style="font-size: 15px; font-weight: 600;display: flex;width: 96%;font-size: 12px;">
          <div>
            可见{{ pagination.total_count }}条笔记
          </div>
        </div>
        <div
          @click="
            () => {
              ;(showBox = !showBox), (list = []), (page = 1), $emit('closeBj'),
              $refs.commentSend.delComment(),
              pagination.total_count = 0
            }
          "
          style="cursor: pointer;"
        >
          X
        </div>
      </div>
      <div style="height: 320px; overflow-y: auto;" @scroll="scrollHandler" v-loading="loading">
        <div v-if="list.length > 0">
        <div v-for="(item, index) in list" :key="index">
          <commentItemTwo
            :comment="item"
            :chat="item.chat"
            @delComment="delComment"
            :userList="userList"
            :topic_id="item.note_id"
            @setCommentUniqid="setCommentUniqid"
          ></commentItemTwo>
        </div>
      </div>
      <div style="margin-top: 48px;" v-else>
        <notData></notData>
      </div>
      </div>
      <commentSend
        ref="commentSend"
        :isReply="false"
        :bjData="bjData"
        @setCommentUniqid="setCommentUniqid"
        :placeholderText="
          bjData.activeValue !== undefined
            ? `对素材“${
                new Date(+bjData.time.replace('s', '') * 1000).getMinutes() >= 10
                  ? new Date(+bjData.time.replace('s', '') * 1000).getMinutes()
                  : '0' + new Date(+bjData.time.replace('s', '') * 1000).getMinutes()
              }:${
                new Date(+bjData.time.replace('s', '') * 1000).getSeconds() >= 10
                  ? new Date(+bjData.time.replace('s', '') * 1000).getSeconds()
                  : '0' + new Date(+bjData.time.replace('s', '') * 1000).getSeconds()
              }-${field[bjData.activeValue]}${bjData.field_count}”写笔记~`
            : '欢迎评论交流~'
        "
      ></commentSend>
      <!-- 删除对话框 -->
      <delComment
        ref="delCommentRef"
        @setCommentUniqid="setCommentUniqid"
        @delComment="delComment"
      ></delComment>
    </div>
  </div>
</template>

<script>
import commentItemTwo from '@/components/comment/commentItemTwo.vue'
import commentSend from '@/components/comment/commentSentTwo.vue'
import delComment from '@/components/comment/delComment.vue'
import notData from '@/components/notData.vue'
export default {
  components: {
    commentSend,
    commentItemTwo,
    delComment,
    notData
  },
  data() {
    return {
      loading: false,
      showBox: false,
      listFlag: true,
      list: [],
      userList: [],

      limit: 10,
      page: 1,
      reply_limit: 10,
      bjData: {},
      field: {
        total_click_cnt: '点击数',
        total_user_lose_cnt: '流失数',
        total_dy_like: '点赞数',
        total_dy_comment: '评论数',
        total_dy_follow: '关注数',
        total_dy_share: '分享量',
        total_report_cnt: '举报数',
        total_dislike_cnt: '不感兴趣数'
      },
      pagination: {
        limit: 10,
        page: 1,
        total_count: 0
      },
      material_flag: false,
    }
  },
  methods: {
    // 触底加载
    async scrollHandler(e) {
      if (
        e.currentTarget.scrollTop + e.currentTarget.clientHeight + 70 >=
        e.currentTarget.scrollHeight
      ) {
        if (+this.pagination.total_count <= 10) return false
        this.page++
        await this.getCommentListScroll(this.bjData)
      }
    },
    async setCommentUniqid(val) {
      this.list = []
      this.page = 1
      await this.getCommentListScroll(this.bjData)
      this.$emit('bjNumChange', val)
    },
    // 获取评论列表
    /**
     * e.flag 是否是 素材中心笔记
     */
    async getCommentListScroll(e) {
      try {
        this.loading = true
        let sdList = []
        let params = {
          searchId: e.md5 ? e.md5 : e.file_md5[0],
          searchType: e.flag == 1 ? e.product_parent_type : 10141,
          // product_type: this.product_type,
          // product_parent_type: this.product_parent_type,
          page: this.page,
          limit: 20,
          reply_limit: this.reply_limit,
          platForm: 1,
          searchVideoTag: ''
        }
        if (e.activeValue !== undefined) {
          params.searchVideoTag = `${e.time.replace('s', '')}-${e.activeValue}`
        }
        let sd = await this.$http3.get('/notemanage/note/getNoteList', {
          params: params
        })
        sdList = sd.list
        if (+this.page === 1) {
          this.pagination = sd.pagination
          sd.pagination.total_count === 0 ? (this.listFlag = false) : (this.listFlag = true)
        }
        sdList.forEach(itme => {
          itme.chat = []
          itme.chatFlag = false
        })
        sdList.forEach(async (element, index) => {
          let items = await this.$http3.get('/note/comment/list', {
            params: {
              page: 1,
              limit: 100,
              reply_limit: 100,
              topic_id: element.note_id,
              topic_type: 6
            }
          })
          this.$set(element, 'chat', items.list)
        })
        this.list = [...this.list, ...sdList]

        // let sd = await this.$http2.get('/comment/list', {
        //   params: {
        //     topic_id: this.topic_id,
        //     topic_type: this.topic_type,
        //     page: this.page,
        //     limit: this.limit,
        //     reply_limit: this.reply_limit,
        //     sort: this.sort
        //   }
        // })
        this.loading = false
      } catch (err) {
        this.$message.error(err)
      }
    },
    delComment(data) {
      this.$refs.delCommentRef.delCommentOpenAndDel(data)
    },
    open(e, flag) {
       flag === 'left_material' ? this.material_flag = true : this.material_flag = false
      // this.showLoading(e.e)
      this.bjData = e
      this.showBox = true
      this.setCommentUniqid(e)
      this.$nextTick(() => {
        this.showLoading(e.e)
      })
    },
    showLoading(e) {
      let DOM = document.querySelector('.dialogBox') // 获取弹出框
      let triangleBox = document.querySelector('.triangleBox') // 获取三角box
      let Height = DOM.offsetHeight
      var boxOffsetWidth = DOM.offsetWidth // 获取盒子的高度
      this.boxStyleFun(DOM, { e })
      this.boxStyleFun(triangleBox, {e})
      if (this.$route.path === '/creationIndex/materialCenter' || this.$route.path === '/creationIndex/newMaterialLibrary') {
        triangleBox.style.left = `${e.clientX - 88}px`
        DOM.style.left = `${e.clientX - 60}px`
      } else {
        triangleBox.style.left = `${e.clientX + 31}px`
        DOM.style.left = `${e.clientX + 60}px`
        console.log(e)
      }
      var rect = DOM.getBoundingClientRect() // 获取 div 的边界信息
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop // 获取页面的滚动条顶部偏移量
      var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft // 获取页面的水平滚动条顶部偏移量
      if (rect.bottom > scrollTop + window.innerHeight) {
        this.visibleArrow = false
        // 如果 div 的底部超出可视口底部
        DOM.style.top = +(e.clientY - Height + 20) < 90 ? '90px' : `${+(e.clientY - Height + 50)}px`
      } else {
        this.visibleArrow = true
      }
      if (rect.right > scrollLeft + window.innerWidth) {
        // 如果 div 的右边超出可视口右边
        if ((this.$route.path === '/creationIndex/materialCenter' && this.material_flag) || (this.$route.path === '/creationIndex/newMaterialLibrary' && this.material_flag)) {
          // 素材中心最后一个
        DOM.style.left = `${e.clientX - (boxOffsetWidth - 60)}px`
        triangleBox.style.left = `${e.clientX + 56}px`
      } else if (this.$route.path === '/creationIndex/materialCenter' || this.$route.path === '/creationIndex/newMaterialLibrary') {
        // 素材中心
        DOM.style.left = `${e.clientX - (boxOffsetWidth + 288)}px`
        triangleBox.style.left = `${e.clientX - 293}px`
      } else {
        // 其他地方
        DOM.style.left = `${e.clientX - (boxOffsetWidth + 70)}px`
        triangleBox.style.left = `${e.clientX - 73}px`
      }
        triangleBox.style.transform = 'rotate(180deg)'
        // 进行相应的处理，例如将 div 移动到可视口内或者其他逻辑操作
      } else {
        triangleBox.style.transform = 'rotate(0deg)'
        // 如果没有超出可视口，可以继续进行其他操作
      }
    },
    boxStyleFun(box, data) {
      box.style.top = `${data.e.clientY - 26}px`
      box.style.left =
      data.y >= 1 ? `${data.e.clientX + data.y}px` : `${data.e.clientX - data.y}px`
    }
  },
  mounted() {
    this.$EventBus.$on('commentSend', () => {
      this.page = 1
      this.setCommentUniqid()
    })
  }
}
</script>

<style lang="scss" scoped>
.dialogBox {
  width: 560px;
  max-height: 530px;
  position: fixed;
  background-color: #fff;
  z-index: 9999;
  padding: 15px 15px 0px 15px;
  overflow-y: auto;
  box-shadow: 1px 1px 2px 3px rgba(0,0,0,0.05);
  border-radius: 4px;
  .dialogBox-title {
    flex: 0.8;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: #6D7278;
    margin-right: 10px;
  }

  .triangleBox {
    position: fixed;
    z-index: 990;
    width: 31px;
    height: 61px;
    background-image: url('//cdn.hsuanyuen.com/Fe-public/adsaas-file/a3.png');
    background-size: 100% 100%;
    transform: rotate(90deg);
  }
}
.loadingBox {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 9999;
  background-color: #ffffff00;
}
</style>

<style>
.el-message {
  z-index: 9999 !important;
}
.el-popover {
  z-index: 9999 !important;
}
</style>
