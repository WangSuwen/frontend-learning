<template>
	<div v-clickout="clickout">
		<div class="userPopupList" id="userPopup" :style="{ left: left + 'px', top: top + 'px' }" v-if="show">
			<!-- 选择维度 开始 -->
			<div v-show="dimensionId == 0">
				<ul>
					<li v-for="itme in dimensionData" :key="itme.id" style="justify-content: space-between; display: flex;"
						@click.stop="diadingClick(itme.id)">
						<span>{{ itme.name }}</span>
						<span style="color: #6D7278; font-size: 12px; display: inline-block;">{{ itme.value }}</span>
					</li>
				</ul>
			</div>
			<!-- 选择维度 结束 -->
			<!--  @人员  开始 -->
			<div v-show="dimensionId == 1">
				<div class="userList" style="max-height: 250px;">
					<center> <el-input v-model="input_user" ref="userRefTwo" @input="user_all_input"  style="width: 90%; margin: 8px 0px;"
						placeholder="请输入人员名称"></el-input></center>
					<div class="user" v-for="item in userList" :key="item.user_id" :id="item.user_id"
						@click.stop="clickUser({ user_name: item.user_name, user_id: item.user_id, type: 'user' })">
						<!-- <avatar class="avator-item"  :url="item.user_face" :name="item.user_name"></avatar> -->
						<el-tooltip class="item" effect="dark" :content="item.user_name" v-if="item.user_name !== '所有人'"
							placement="top">
							<avatar :url="item.user_face" :name="item.user_name" style="width: 40px;height: 40px;">
                </avatar>
						</el-tooltip>
						<div style="white-space: nowrap; margin-left: 10px;">{{ item.user_name }}</div>
					</div>
					<center>
						<div style="color: #BFBFBF; text-align: center; font-size: 12px; margin-bottom: 6px;" v-show="userList.length == 0">暂无数据</div>
					</center>
					<center>
						<div style="color: #BFBFBF; text-align: center; font-size: 12px; margin-bottom: 6px;" v-show="userList.length != 0">没有更多了</div>
					</center>
				</div>
			</div>
			<!--  @人员  结束 -->
			<!--  团队  开始 -->
			<div v-if="dimensionId == 2">
				<ul>
					<center> <el-input v-model="input_user" @input="user_changeUserall" ref="userRefTwo"
						style="width: 90%; margin-top: 8px;" placeholder="请输入团队名称"></el-input></center>
					<li v-for="itme in  userallData" :key="itme.id"
						@click.stop="clickUser({ user_name: itme.user, user_id: itme.id, type: itme.type })">{{
							itme.user }}</li>
					<center>
						<li style="color: #BFBFBF; text-align: center; font-size: 12px; margin-bottom: 6px;" v-show="userallData.length == 0">暂无数据</li>
					</center>
					<center>
						<li style="color: #BFBFBF; text-align: center; font-size: 12px; margin-bottom: 6px;" v-show="userallData.length != 0">没有更多了</li>
					</center>
				</ul>
			</div>
			<!--  团队  开始 -->
			<!-- 品牌主  开始 -->
			<div v-if="dimensionId == 3">
				<ul @scroll="scrollListClient">
					<center> <el-input v-model="input_user" @input="user_changeClient" style="width: 90%; margin-top: 8px;"
						ref="userRefTwo" placeholder="请输入品牌主名称"></el-input></center>
					<el-tooltip :content="itme.user" :disabled="itme.user.length < 13" v-for="itme in  ClientData" :key="itme.id"
						placement="top">
						<li @click.stop="clickUser({ user_name: itme.user, user_id: itme.id, type: itme.type })">{{
							itme.user }}
						</li>
					</el-tooltip>
					<center>
						<li style="color: #BFBFBF; text-align: center; font-size: 12px; margin-bottom: 6px;" v-show="ClientData.length == 0">暂无数据</li>
					</center>
					<center>
						<li style="color: #BFBFBF; text-align: center; font-size: 12px; margin-bottom: 6px;" v-show="ClientData.length != 0">没有更多了</li>
					</center>
				</ul>
			</div>
			<!-- 品牌主  开始 -->
			<!-- 产品  开始 -->
			<div v-if="dimensionId == 4">
				<ul @scroll="scrollList">
					<center> <el-input v-model="input_user" @input="user_changeRepollList" style="width: 90%; margin-top: 8px;"
						ref="userRefTwo" placeholder="请输入产品名称"></el-input></center>
					<el-tooltip :content="itme.user" v-for="itme in  reportData" ref="projectBar" :enterable="false"
						:disabled="itme.user.length < 12" :key="itme.id" placement="top">
						<li @click.stop="clickUser({ user_name: itme.user, user_id: itme.id, type: itme.type })">
							{{
								itme.user }}
						</li>
					</el-tooltip>
					<center>
						<li style="color: #BFBFBF; text-align: center; font-size: 12px; margin-bottom: 6px;" v-show="reportData.length == 0">暂无数据</li>
					</center>
					<center>
						<li style="color: #BFBFBF; text-align: center; font-size: 12px; margin-bottom: 6px;" v-show="reportData.length != 0">没有更多了</li>
					</center>
				</ul>
			</div>
			<!-- 产品  开始 -->
		</div>
	</div>
</template>
  
<script>
export default {
	components: {
    avatar: () => import('@/components/Avator.vue')
  },
	props: {
		searchName: {
			type: String,
			// default: ''
		},
		popoverShow: {
			type: Boolean,
		},
	},
	data() {
		return {
			/** 获取人员列表 */
			userList: [],
			/** 获取人员列表 备份 */
			userLists: [],
			/** 选择维度 */
			dimensionData: [
				{ name: '人员', id: '1', value: '@+1' },
				{ name: '团队', id: '2', value: '@+2' },
				{ name: '品牌主', id: '3', value: '@+3' },
				{ name: '产品', id: '4', value: '@+4' },
			],
			/** 展示范围 */
			dimensionId: 0,
			// 页数
			page: 1,
			// 条数
			limit: 20,
			/** 存储品牌主 */
			ClientData: [],
			/** 总条数 */
			countClient: 0,
			/** input输入value值 */
			input_user: '',
			/** 部门树 */
			userallData: [],
			/** 部门树搜索备份 */
			userallDatas: [],
			/** 部门树过滤备份 */
			userallDatasNo: [],
			/** 产品 */
			reportData: [],
			/** 右 */
			left: 0,
			/** 上 */
			top: 0,
			/** 是否展示 */
			show: false,
			/** 存储部门 */
			all: [],
			/** 品牌主列表数据返回是否为空 */
			countFalg: false,
			/** 产品列表数据返回是否为空 */
			productCountFalg: false,
		};
	},
	watch: {
		popoverShow: {
			// @框状态
			handler(val, old) {
				// 规避 left top 值是0的时候瞬间移动
				setTimeout(() => {
					if (val == true) {
						this.show = val;
					}
				}, 100);
                if (val) {
                    // 获取人员
                    this.getUserList();
                    // 获取品牌主
                    this.gitClient();
                    // 获取团队
                    this.getuserall();
                    // 获取产品
                    this.getNameListByReport();
                }
				if (val == false && old == true) {
					this.reset();
				} else {
					this.getPosition();
				}
			},
			deep: true,
			immediate: true
		},
		show: {
			// @框状态
			handler(val, old) {
				setTimeout(() => {
					if (val == false) {
						this.userallData = this.userallDatas;
						this.page = 1;
						this.ClientData = [];
						this.reportData = [];
						this.gitClient();
						this.getNameListByReport();
					}
				}, 300);
				// if (val == false && old == true) {
				//   this.reset()
				// } else {
				//   this.getPosition()
				// }
			},
		}
	},
	created() {
		
	},
	computed: {
		/** 检索人员 */
		// userListCom() {
		//   return this.userList.filter(item => {
		//     return item.user_name.indexOf(this.input_user) > -1
		//   })
		// }
	},
	methods: {
		// 检索人员
		user_all_input() {
			const list = this.userLists.filter(item => {
				return item.user_name.indexOf(this.input_user) > -1;
			});
			this.userList = list;
		},
		// 点击外部区域
		clickout() {
			this.reset();
			this.show = false;
		},
		// 监测@框是否超出可视区域
		showLoading(e) {
			const DOM = document.querySelector('#userPopup'); // 获取弹出框
			if (DOM) {
				const Height = DOM.offsetHeight;
				var boxOffsetWidth = DOM.offsetWidth; // 获取盒子的高度
				var rect = DOM.getBoundingClientRect(); // 获取 div 的边界信息
				var scrollTop = window.pageYOffset || document.documentElement.scrollTop; // 获取页面的滚动条顶部偏移量
				var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft; // 获取页面的水平滚动条顶部偏移量
				if (rect.bottom > scrollTop + window.innerHeight - 100) {
					// 如果 div 的底部超出可视口底部
					DOM.style.top = +(this.top - Height + 20) < 10 ? '10px' : `${+(this.top - Height + 20)}px`;
				} else {
					// 底部没有超出
				}
				if (rect.right > scrollLeft + window.innerWidth) {
					// 如果 div 的右边超出可视口右边
					// 其他地方
					DOM.style.left = `${this.left - (boxOffsetWidth + 30)}px`;
				}
				// 进行相应的处理，例如将 div 移动到可视口内或者其他逻辑操作
			}
		},
		// 获取当前光标位置
		getPosition() {
			setTimeout(() => {
				const selection = window.getSelection();
				if (selection.rangeCount === 0) {
					return false;
				}
				// 获取选中区域的范围
				const range = selection.getRangeAt(0);
				// 获取选中区域的边界
				const { top, left } = range.getBoundingClientRect();
				// 获取当前光标的位置
				const cursorPosition = {
					x: left,
					y: top + range.getBoundingClientRect().height,
				};
				this.left = cursorPosition.x + 8;
				this.top = cursorPosition.y;
				console.log(this.left, this.top, this.popoverShow);
			});
			setTimeout(() => {
				this.showLoading();
			}, 100);
		},
		/** 获取产品 */
		async getNameListByReport() {
			const params = {
				// searchName: this.input_user,
				limit: 20,
				search_name: this.input_user,
				page: this.page,
			};
			const res = await this.$api.getProductGroupList(params);
			console.log(res);
			if (res.list.length > 0) {
				this.productCountFalg = true;
			} else {
				this.productCountFalg = false;
			}
			const set = res.list.map((itme) => {
				return {
					user: itme.product_name,
					id: itme.product_id,
					type: 'report',
				};
			});
			// if (this.input_user != '' && !this.repollFlag) {
			//   this.reportData = []
			//   this.repollFlag = true
			// }
			this.reportData = [...this.reportData, ...set];
			// console.log(this.reportData, '获取数据')
		},
		/** 产品列表input事件 */
		user_changeRepollList(val) {
			this.page = 1;
			this.reportData = [];
			this.getNameListByReport();
		},
		/** 产品触底加载 */
		scrollList(e) {
			/** 关闭tooltip提示 */
			const list = document.getElementsByClassName('el-tooltip__popper');
			if (list.length > 0) {
				list[list.length - 1].style.display = 'none';
			}
			const bottomDis = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight;
			if (bottomDis < 3 && this.productCountFalg) {
				this.page++;
				this.getNameListByReport();
			}
		},
		/** 获取团队接口 */
		getuserall() {
			this.$http3.get('/user/user/userall', {}).then((res) => {
				this.userallDatasNo = res;
				this.userallDatas = this.userallData = res.map(item => {
					return {
						id: item.dept_id || item.value,
						user: item.dept_name,
						type: 'userall',
						children:
                item.children == undefined ? item.children : this.getTreeData(item.children)
					};
				});
  
				setTimeout(() => {
					this.userallDatas = this.userallData = this.flatArr(this.userallData).filter(
						v => v.children
					);
				}, 500);
			});
		},
		/** 获取品牌主 */
		gitClient() {
			this.$api.getNoteClientList({
				limit: this.limit,
				page: this.page,
				field: 1,
				type: 1,
				search_name: this.input_user
			}).then((res) => {
				res.list.length > 0 ? this.countFalg = true : this.countFalg = false;
				const set = res.list.map((itme) => {
					return {
						user: itme.lable,
						id: itme.value,
						type: 'client',
					};
				});
				// if ((this.searchName != '' && !this.ClientFlag)) {
				//   this.ClientFlag = true
				// }
				this.ClientData = new Set([...this.ClientData, ...set]);
			});
		},
		/** 品牌主搜索input事件 */
		user_changeClient(val) {
			this.page = 1;
			this.ClientData = [];
			this.ClientFlag = false;
			this.gitClient(val);
		},
		/** 品牌主触底加载 */
		scrollListClient(e) {
			/** 关闭tooltip提示 */
			const list = document.getElementsByClassName('el-tooltip__popper');
			if (list.length > 0) {
				list[list.length - 1].style.display = 'none';
			}
			const bottomDis = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight;
			if (bottomDis < 1 && this.countFalg) {
				this.page++;
				this.gitClient();
			}
		},
		/** 维度点击 */
		diadingClick(id) {
			// this.show = true
			// console.log(id)
			this.dimensionId = +id;
			this.page = 1;
			setTimeout(() => {
				this.$refs.userRefTwo.focus();
			}, 200);
			// this.showLoading()
			// this.diading()
			// this.getPosition()
			// this.$nextTick(() => {
			// })
		},
		diading() {
			setTimeout(() => {
				(this.$refs.userRefTwo).focus();
			}, 1030);
		},
		// 点击人员
		clickUser(item) {
			this.$emit('clickUser', item);
			this.show = false;
		},
		// 获取人员列表
		async getUserList() {
			try {
                const sd = await this.$api.getChanUserlist();
                this.userList = sd;
                this.userLists = sd;
                this.userList.unshift({ user_name: '所有人', user_id: '0' });
			} catch (err) {
				console.log(err);
				// this.$message.error(err)
			}
		},
		// 重置
		reset() {
			this.page = 1;
			this.dimensionId = 0;
			this.countClient = 0;
			this.input_user = '';
			// this.gitClient()
			// this.getNameListByReport()
		},
		/** 重新调用map 优化map结构 */
		getTreeData(data) {
			return data.map(item => {
				return {
					id: item.dept_id || item.value,
					user: item.dept_name,
					type: 'userall',
					children:
              item.children == undefined ? item.children : this.getTreeData(item.children)
				};
			});
		},
		/**
       * 扁平数组处理单选树
       * @param {arr} Array
       */
		flatArr(arr) {
			return arr.reduce((a, item) => {
				let flatArr = [...a, item];
				if (item.children) {
					flatArr = [...flatArr, ...this.flatArr(item.children)];
				}
				return flatArr;
			}, []);
		},
		/** 递归循环调用 获取 @部门 */
		userAll(chli, children = this.userallDatasNo) {
			for (const item of children) {
				if (item.dept_id == chli) {
					this.all.push(item);
				} else if (item.children && item.children.length > 0) {
					this.userAll(+chli, item.children);
				}
			}
		},
		/** 获取部门下人员的ID */
		allUserList() {
			this.flatArr(this.all).forEach((element, index) => {
				if (!element.children) {
					// console.log(+element.value, '获取人员')
					this.$emit('userDepartment', +element.value);
					// this.params.auth_user_ids.push()
				}
			});
		},
		/** 团队搜索事件 */
		user_changeUserall(val) {
			if (this.userallData === '') {
				this.userallData = this.userallDatas;
			} else {
				this.userallData = [];
				for (const item of this.userallDatas) {
					if (item.user.includes(val)) {
						this.userallData.push(item);
					}
				}
			}
		},
	}
};
</script>
  
  <style lang="scss" scoped>
  .userPopupList {
    position: fixed;
    z-index: 999999;
    width: 190px;
    // height: 240px;
    // overflow: hidden;
  
    ul {
      max-height: 270px;
      max-width: 200px;
      overflow-y: auto;
      border: 1px solid #dbdada;
      background: #fff;
      border-radius: 3px;
  
      li {
        cursor: pointer;
        display: inline-block;
        white-space: nowrap;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        box-sizing: border-box;
  
        img {
          border-radius: 100%;
          width: 28px;
          height: 28px;
        }
  
        padding-left: 10px;
        padding-right: 10px;
        height: 30px;
        line-height: 30px;
        margin-top: 5px;
  
        &:hover {
          background: #F3F7FF;
        }
      }
    }
  }
  
  .userList {
    max-height: 170px;
    max-width: 200px;
    overflow-y: auto;
    border: 1px solid #dbdada;
    background: #fff;
    border-radius: 3px;
  
    .user {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      justify-content: space-between;
      padding: 0 10px;
      height: 40px;
      cursor: pointer;
  
      span {
        margin-left: 10px;
      }
  
      &:last-child {
        margin-bottom: 0;
      }
  
      &:hover {
        background-color: #f3f7ff;
      }
  
    }
  }
  
  .no-data {
    font-size: 12px;
    text-align: center;
  }</style>
  