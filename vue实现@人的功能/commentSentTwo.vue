<template>
	<div class="comment">
		<div class="comment-textare" :class="classInner ? 'inner' : ''">
			<Summary :searchName="searchName" @clickUser="clickUser" @userDepartment="userDepartment" ref="SummaryRef"
				:popoverShow="popoverShow"></Summary>
			<div class="editor" contenteditable="true" id="editor" ref="editor" :placeholder="placeholderText"
				@input="writeEditor($event)" @click="clickEditor($event)" @keydown="keydownEditor($event)"
				@paste="pasteEditor($event)" @blur="blur"></div>
			<div class="textNum" :class="classInner ? 'textNumSelect' : ''">
				{{ textNum }} / <span>500</span>
			</div>
		</div>
		<div class="emojiBtn">
			<el-popover placement="bottom" v-model="emojiShow" v-clickout="clickOutEmoji" trigger="manual" width="400"
				class="emoBox">
				<div class="emojiArr" @click="showEmoji">
					<div class="emojiTitle">
						<span>默认</span>
					</div>
					<span v-for="item in emojiList" :key="item.codes" v-html="item.char" class="emojiItem"
						@click="clickEmoji(item)"></span>
				</div>
				<div class="smail-box" slot="reference" @click="showEmoji">
					<i class="smail iconfont icon-biaoqingweixiaoxinpengyou"></i>
					<span>添加表情</span>
				</div>
			</el-popover>
			<div class="comment-uploadImg" @click="uploadImg">
				<i class="iconfont icon-image"></i>
				<span>图片</span>
				<input type="file" style="display:none" ref="files" @change="loadImage" />
			</div>
			<el-button type="primary" style="font-size: 12px;" size="small" v-if="!isReply" @click.stop="sendComment"
				:disabled="textNum === 0">发布</el-button>
			<div v-else class="replyBtns">
				<el-button type="primary" plain @click="cencelComment">取消回复</el-button>
				<el-button type="primary" @click.stop="sendComment" :disabled="textNum === 0">回复</el-button>
			</div>
		</div>
	</div>
</template>
  
<script>
import emojiArr from './emoji.js';
import Summary from './summary.vue';
import Avator from '@/components/Avator.vue';
export default {
	components: {
		Summary,
		avatar: Avator,
	},
	name: 'commentSend',
	props: {
		isReply: {
			type: Boolean,
			default: false
		},
		placeholderText: {
			type: String,
			default: '欢迎评论交流~'
		},
		md5: {
			type: String
		},
		title: {
			type: String
		},
		bjData: {
			type: Object,
			default: () => { }
		},
		// userList: {
		//   type: Array
		// },
		detail: {
			type: Object,
			default: () => { }
		},
		topic_id: {
			type: [Number, String]
		}
	},
	data() {
		return {
			focus_Node: null,
			offset: 0,
			userRule: /@.+;/,
			popoverShow: false,
			changeUserId: '',
			emojiList: emojiArr,
			textNum: 0,
			classInner: false,
			searchName: '',
			searchNameOld: '',
			emojiShow: false,
			imgsUrl: [],
			auth_sub_type_client_ids: [], // 笔记品牌主相关可见
			auth_sub_type_product_ids: [], // 相关产品可见
			auth_dept_ids: [], // 相关部门
			epartmentList: [], // 部门人员
		};
	},
	created() {
		// this.getTreeList()
	},
	methods: {
		// 获取
		focus() {
			setTimeout(() => {
				// console.log('执行')
			}, 1000);
		},
		// 清空
		delComment() {
			this.$refs['editor'].innerHTML = '';
			window.editorText = '';
			this.editorHtml = '';
			this.textNum = 0;
		},
		// div里写入内容
		writeEditor(evt) {
			const selection = window.getSelection(); // 当前输入元素（光标所在行）
			const { focusNode } = selection;
			console.log(evt.data);
			if (evt.data === '@') {
				// 记录最后一次输入@符号的行节点，作为插入定位符
				this.popoverShow = true;
			}
			if (focusNode.data && focusNode.data.indexOf('@') > -1) {
				const indexNum = focusNode.data.lastIndexOf('@');
				const offset = selection.focusOffset;
				this.searchName = focusNode.data.slice(indexNum + 1, offset);
				this.searchName > 0 && this.searchName < 5 ? this.$refs.SummaryRef.diadingClick(this.searchName) : this.searchName = focusNode.data.slice(indexNum + 1, offset);
			}
			this.focus_Node = focusNode; // 设置focusNode
			this.offset = selection.focusOffset; // 设置光标所在
			this.textNum =
          this.$refs['editor'].innerText.length -
          (this.$refs['editor'].innerText.match(/[\r\n]/g)
          	? this.$refs['editor'].innerText.match(/[\r\n]/g).length
          	: 0);
			if (this.textNum === 0) {
				if (this.$refs['editor'].childNodes.length > 0) {
					this.$refs['editor'].removeChild(this.$refs['editor'].childNodes[0]);
				}
			}
			window.editorText = this.$refs['editor'].innerHTML;
		},
  
		// 点击输入评论框
		clickEditor(event) {
			const selection = window.getSelection();
			const { focusNode } = selection;
			const text = focusNode.nodeValue;
			this.focus_Node = focusNode;
			this.offset = selection.focusOffset;
			// 点击区域内容与规则匹配则选中该区域(选中用户标签)
			if (this.userRule.test(text)) {
				const r = document.createRange();
				r.setStart(focusNode, 0);
				r.setEnd(focusNode, text.length);
				selection.removeAllRanges();
				selection.addRange(r);
			}
			this.popoverShow = false;
			this.classInner = true;
		},
		keydownEditor(event) {
			const selection = window.getSelection();
			const { focusNode } = selection;
			// const text = focusNode.nodeValue
			this.focus_Node = focusNode;
            console.log(this.focus_Node);
			// if (['Delete', 'Backspace'].includes(event.key) && this.userRule.test(text)) {
			//   event.preventDefault()
			//   // focusNode为文本节点，删除后会残留用户标签样式，连同文本节点的父节点一起删除可解决此问题
			//   focusNode.parentNode.parentNode.removeChild(focusNode.parentNode)
			// }
			this.textNum =
          this.$refs['editor'].innerText.length -
          (this.$refs['editor'].innerText.match(/[\r\n]/g)
          	? this.$refs['editor'].innerText.match(/[\r\n]/g).length
          	: 0);
		},
		// 选中@的人
		clickUser(item) {
			if (!this.focus_Node) {
				const r = document.createRange();
				const selection = window.getSelection();
				r.setStart(this.$refs['editor'], this.$refs['editor'].childNodes.length);
				r.collapse(true);
				selection.removeAllRanges();
				selection.addRange(r);
				const test = document.createTextNode('@');
				r.insertNode(test);
				this.focus_Node = test;
			}
			this.insertUser(`@${item.user_name};`, item.user_id, item.type);
			this.popoverShow = false;
			this.searchName = '';
			this.textNum =
          this.$refs['editor'].innerText.length -
          (this.$refs['editor'].innerText.match(/[\r\n]/g)
          	? this.$refs['editor'].innerText.match(/[\r\n]/g).length
          	: 0);
		},
  
		// 插入用户标签
		insertUser(username, uid, type) {
			const selection = window.getSelection();
			if (!this.focus_Node) return;
			let focusNode = null;
			focusNode = this.focus_Node;
			const nodeValue = focusNode.nodeValue;
			// 查找@符号作为定位点
			const start = nodeValue.lastIndexOf('@');
			// 生成用户标签
			const user = document.createElement('span');
			user.contentEditable = false; // 设置用户标签不可编辑解决删除半个标签的问题
			user.className = 'uid';
			user.dataset.uid = uid; // 设置用户的id
			user.dataset.type = type; // @类型
			// 行内样式是笔记修改的时候防止方式丢失
			user.style.color = '#488aff'; // @类型
			user.style.cursor = 'pointer'; // @类型
			user.style.fontSize = '12px'; // @类型
			user.style.padding = '6px'; // @类型
			user.style.fontWeight = 'bold'; // @类型
			user.innerText = username;
			const spanNode = document.createElement('span');
			spanNode.innerHTML = '&nbsp;';
			// 创建一个新的空白的文档片段，拆入对应文本内容
			const frag = document.createDocumentFragment();
			frag.appendChild(spanNode);
			frag.appendChild(user);
			frag.appendChild(spanNode);
			// 选中@符号并删除
			const r = document.createRange();
			r.setStart(focusNode, start);
			// nodeValue.length
			r.setEnd(focusNode, this.offset);
			selection.removeAllRanges();
			selection.addRange(r);
			r.deleteContents();
			// 设置光标选取为空并插入用户标签
			r.collapse(true);
			r.insertNode(frag);
			// 将光标设置到插入标签后
			r.setStartAfter(frag);
			r.collapse(true);
			selection.removeAllRanges();
			selection.addRange(r);
			this.focus_Node = frag.nextSibling;
			this.offset = frag.innerText.length;
			this.textNum =
          this.$refs['editor'].innerText.length -
          (this.$refs['editor'].innerText.match(/[\r\n]/g)
          	? this.$refs['editor'].innerText.match(/[\r\n]/g).length
          	: 0);
			this.classInner = true;
			window.editorText = this.$refs['editor'].innerHTML;
		},
  
		// 点击表情
		clickEmoji(data) {
			const focusNode = this.focus_Node;
			if (!focusNode) {
				const r = document.createRange();
				r.setStart(this.$refs['editor'], this.$refs['editor'].childNodes.length);
				r.collapse(true);
				const selection = window.getSelection();
				selection.removeAllRanges();
				selection.addRange(r);
				this.focus_Node = window.getSelection().focusNode;
			}
			this.insertEmoj(data.char);
			this.textNum =
          this.$refs['editor'].innerText.length -
          (this.$refs['editor'].innerText.match(/[\r\n]/g)
          	? this.$refs['editor'].innerText.match(/[\r\n]/g).length
          	: 0);
		},
		// 插入表情
		insertEmoj(emoji) {
			const selection = window.getSelection();
			const r = document.createRange();
			const len =
          this.focus_Node.nodeType === 3
          	? this.focus_Node.nodeValue.length
          	: this.focus_Node.childNodes.length;
			r.setStart(this.focus_Node, Math.min(this.offset, len));
			r.collapse(true);
			selection.removeAllRanges();
			selection.addRange(r);
			const text = document.createTextNode(emoji);
			r.insertNode(text);
			r.setStartAfter(text);
			r.collapse(true);
			selection.removeAllRanges();
			selection.addRange(r);
			this.focus_Node = text;
			this.offset = text.length;
			this.classInner = true;
			window.editorText = this.$refs['editor'].innerHTML;
		},
		// 显示表情
		showEmoji() {
			this.emojiShow = true;
		},
		clickOutEmoji() {
			if (this.emojiShow) {
				this.emojiShow = false;
			}
		},
		blur() {
			this.classInner = false;
		},
		clickOut() {
			this.popoverShow = false;
		},
		// 重新拿到评论框内容
		insertStr(soure, start, newStr) {
			return soure.slice(0, start) + newStr + soure.slice(start);
		},
		userDepartment(val) {
			this.epartmentList.push(val);
		},
		homeSplit(val) {
			if (val === 0) return '0.00';
			if (isNaN(val)) {
				return '--';
			}
			const pattern = /(?=((?!\b)\d{3})+$)/g;
			const o = Number(val)
				.toString()
				.split('.');
			const z = o[0].replace(pattern, ',');
			let l = o[1];
			if (l) {
				if (l.length === 1) {
					l = l + '0';
				}
			} else {
				l = '00';
			}
			return `${z}.${l}`;
		},
		// 发送评论
		async sendComment() {
			//   auth_user_ids: [], // 部分可见，可见人
			//   auth_sub_type_product_ids: [], // 部分可见，产品相关可见id
			//   auth_sub_type_client_ids: [], // 部分可见，品牌主相关可见id
			//   auth_sub_type_customer_ids: [] // 部分可见，账户相关可见id
			//   auth_dept_ids // 部分团队可见
			const source_type = +this.$route.query.source_type;
			try {
				if (!this.$refs['editor'].innerHTML.trim()) return this.$message.error('评论内容不能为空');
				if (this.textNum > 500) return this.$message.error('评论内容不可超出500字');
				// const uidArr = this.$refs['editor'].querySelectorAll('span[data-uid]')
				const dataType = this.$refs['editor'].querySelectorAll('span[data-type]');
				let ids = [];
				this.auth_sub_type_client_ids = [];
				this.auth_sub_type_product_ids = [];
				this.auth_dept_ids = [];
				// dataType.forEach(())
				dataType.forEach((item) => {
					switch (item.dataset.type) {
					case 'user': // 相关人员可见
						ids.push(item.dataset.uid);
						break;
					case 'client': // 相关品牌主可见
						this.auth_sub_type_client_ids.push(item.dataset.uid);
						break;
					case 'report': // 相关产品
						this.auth_sub_type_product_ids.push(item.dataset.uid);
						break;
					case 'userall': // 相关部门
						this.auth_dept_ids.push(item.dataset.uid);
						this.$refs.SummaryRef.userAll(item.dataset.uid);
						this.$refs.SummaryRef.allUserList();
						break;
					}
				});
				// return false
				// 如果存在所有人 置空人员列表
				if (ids.includes('0')) {
					ids = '所有人';
				}
				// // 判断是否 回复
				if (!this.isReply) {
					// 新版笔记接口参数
					const dataPro = {
						dateTime: this.bjData.startDate,
						level: 'product',
						endDate: '12',
						startDate: '1245',
						name: this.bjData.product_name,
						id: this.bjData.md5 ? this.bjData.md5.toString() : this.bjData.file_md5[0].toString(),
						cost: this.bjData.bill_cost
					};
					const params = {
						anonymous: 0,
						content: this.$refs['editor'].innerHTML,
						product_id: this.bjData.md5 ? this.bjData.md5.toString() : this.bjData.file_md5[0].toString(),
						auth_dept_ids: this.auth_dept_ids,
						auth_sub_type_client_ids: this.auth_sub_type_client_ids,
						auth_sub_type_customer_ids: [],
						auth_sub_type_product_ids: this.auth_sub_type_product_ids,
						auth_user_ids: [...ids, ...this.epartmentList],
						reportwhere: this.$route.meta.title == '产品报表' ? JSON.stringify(dataPro) : '',
						auth_type: ids === '所有人' ? 1 : ids.length > 0 || this.auth_dept_ids.length > 0 || this.auth_sub_type_client_ids.length > 0 || this.auth_sub_type_product_ids.length > 0 ? 2 : 3,
						product_parent_type: this.bjData.flag == 1 && this.$route.meta.title != '素材库' ? this.bjData.product_parent_type : 10141,
						report_where: this.$route.meta.title == '产品报表' ? JSON.stringify(dataPro) : '',
						product_type: this.bjData.flag == 1 && this.$route.meta.title != '素材库' ? this.bjData.product_type : 250,
						tag_ids: [],
						tag_names: [],
						plat_form: this.$route.meta.title == '产品报表' ? this.bjData.platform || 1 : 1
					};
					if (this.bjData.activeValue !== undefined) {
						const field = {
							total_click_cnt: '点击数',
							total_user_lose_cnt: '流失数',
							total_dy_like: '点赞数',
							total_dy_comment: '评论数',
							total_dy_follow: '关注数',
							total_dy_share: '分享量',
							total_report_cnt: '举报数',
							total_dislike_cnt: '不感兴趣数',
						};
						this.$set(params, 'material_video_info', {
							second: +this.bjData.time.replace('s', ''),
							field: this.bjData.activeValue,
							field_count: this.bjData.field_count,
							start_time: this.bjData.start_time,
							end_time: this.bjData.end_time
						});
						params.content = `<p style="color: #999999;">素材时序时间 - ${this.bjData.start_time}~${this.bjData.end_time
						}</p><p style="color: #999999;">素材时序指标 - ${field[this.bjData.activeValue]}：${this.bjData.field_count
						}</p><p style="color: #999999;">素材时序秒数 - ${this.bjData.time.replace('s', '')}秒</p><br><p style="color: #000000;font-size: 12px;">内容：${this.$refs['editor'].innerHTML
						}`;
					}
					// this.bjData.targetScope && this.bjData.targetScope.length > 0 &&
					if (this.$route.meta.title == '目标管理') {
						params.content = `<p style="color: #999999;">指标数据: ${this.bjData.targetScope[0].name}</p><br><p style="color: #000000;font-size: 12px;">${this.$refs['editor'].innerHTML
						}`;
					}
					// console.log(this.$route.meta.title, '获取')
					if (this.$route.meta.title == '产品报表') {
						params.content = `<p style="color: #999999;">时间: ${this.bjData.startDate}</p><p style="color: #999999;">消耗: ￥${this.homeSplit(this.bjData.bill_cost)}</p><br><p style="color: #000000;font-size: 12px;">${this.$refs['editor'].innerHTML
						}`;
					}
					if (source_type) params.source_type = source_type;
					await this.$api.postNoteAdd(params);
				} else {
					if (this.detail.id) {
						const params = {
							comment_id: this.detail.comment_id ? this.detail.comment_id : this.detail.id,
							topic_id: this.topic_id,
							content: this.$refs['editor'].innerHTML,
							remind_list: [...ids, ...this.epartmentList],
							remind_type: ids === '所有人' ? 1 : ids.length > 0 || this.auth_dept_ids.length > 0 || this.auth_sub_type_client_ids.length > 0 || this.auth_sub_type_product_ids.length > 0 ? 2 : 3,
							topic_type: '6',
							to_user_id: this.detail.from_id,
							auth_dept_ids: this.auth_dept_ids,
							auth_sub_type_client_ids: this.auth_sub_type_client_ids,
							auth_sub_type_customer_ids: [],
							auth_sub_type_product_ids: this.auth_sub_type_product_ids,
							// auth_user_ids: [...ids, ...this.epartmentList],
						};
						await this.$api.postNoteCommentReply(params);
					} else {
						const params = {
							topic_id: this.topic_id,
							content: this.$refs['editor'].innerHTML,
							remind_list: [...ids, ...this.epartmentList],
							remind_type: ids === '所有人' ? 1 : ids.length > 0 || this.auth_dept_ids.length > 0 || this.auth_sub_type_client_ids.length > 0 || this.auth_sub_type_product_ids.length > 0 ? 2 : 3,
							topic_type: '6',
							auth_dept_ids: this.auth_dept_ids,
							auth_sub_type_client_ids: this.auth_sub_type_client_ids,
							auth_sub_type_customer_ids: [],
							auth_sub_type_product_ids: this.auth_sub_type_product_ids,
							// auth_user_ids: [...ids, ...this.epartmentList],
						};
						await this.$api.postNoteCommentAdd(params);
					}
				}
				this.$message.success('发布成功');
				this.$bus.$emit('message');
				this.$refs['editor'].innerText = '';
				this.emojiShow = false;
				this.textNum = 0;
				this.$emit('setCommentUniqid', !this.isReply ? 'add' : '');
				this.$emit('setCommentId');
				this.$EventBus.$emit('commentSend');
				this.focus_Node = null;
				window.editorText = '';
				this.epartmentList = [];
			} catch (err) {
				this.$throw(err, this);
				this.$emit('setCommentUniqid');
				this.focus_Node = null;
				this.epartmentList = [];
			}
		},
		// 取消回复
		cencelComment() {
			this.$emit('cencel');
		},
  
		// 上传图片点击
		uploadImg() {
			this.$refs.files.value = '';
			this.$refs.files.click();
		},
		loadImage() {
			const fileSplit = this.$refs.files.files[0].name.split('.');
			if (!['jpg', 'png', 'JPG', 'PNG', 'jpeg', 'JPEG'].includes(fileSplit[fileSplit.length - 1])) {
				this.$refs.files.value = '';
				return this.$message.error('图片支持格式为jpg/png/jpeg');
			}
			const filesArr = this.$refs.files.files;
			// for (var i = 0; i < filesArr.length; i++) {
			this.upload(filesArr[0])
				.then(res => {
					window.editorText = this.$refs['editor'].innerHTML;
					this.editorHtml = this.$refs['editor'].innerHTML;
					this.textNum++;
				})
				.catch(() => {
					this.canPaste = true;
				});
			// }
		},
		/**
       * 上传图片
       */
		async upload(data) {
			try {
				const formData = new FormData();
				formData.append('imageFiles', data);
				formData.append('tk', this.token);
				const res = await this.$http5.post('/upload/upload/uploadfile', formData);
				this.$message.success('上传成功');
				this.innerImg(res.list.imageFiles.data.url);
				this.imgsUrl.push(res.list.imageFiles.data.url);
				this.canPaste = true;
				return res.list.imageFiles.data.url;
			} catch (err) {
				this.canPaste = true;
				this.$message.error(err);
			}
		},
		/**
       * 追加评论框 图片
       */
		innerImg(res) {
			const focusNode = this.focus_Node;
			if (!focusNode) {
				const r = document.createRange();
				r.setStart(this.$refs['editor'], this.$refs['editor'].childNodes.length);
				r.collapse(true);
				const selection = window.getSelection();
				selection.removeAllRanges();
				selection.addRange(r);
				const test = document.createTextNode(' ');
				r.insertNode(test);
				this.focus_Node = test;
				// this.focus_Node = window.getSelection().focusNode
			}
			const imgElement = document.createElement('img');
			imgElement.src = res;
			imgElement.style.width = '80px';
			imgElement.style.height = '40px';
			imgElement.style.objectFit = 'cover';
			imgElement.style.cursor = 'zoom-in';
			imgElement.className = 'commentImg';
			imgElement.addEventListener('click', res => {
				this.modalShow = true;
				const str = this.$refs['editor'].innerHTML;
				const imgReg = /<img.*?(?:>|\/>)/gi;
				// eslint-disable-next-line no-useless-escape
				const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
				const arr = str.match(imgReg);
				const newImgList = [];
				if (arr && arr.length > 0) {
					for (var i = 0; i < arr.length; i++) {
						var src = arr[i].match(srcReg);
						newImgList.push(src[1]);
					}
					this.imgsUrl = newImgList;
				}
				this.currIndex = this.imgsUrl.findIndex(item => item === res.target.currentSrc);
			});
  
			const selection = window.getSelection();
			const r = document.createRange();
			const len =
          this.focus_Node.nodeType === 3
          	? this.focus_Node.nodeValue.length
          	: this.focus_Node.childNodes.length;
			r.setStart(this.focus_Node, Math.min(this.offset, len));
			r.collapse(true);
			selection.removeAllRanges();
			selection.addRange(r);
			r.insertNode(imgElement);
			r.setStartAfter(imgElement);
			r.collapse(true);
			selection.removeAllRanges();
			selection.addRange(r);
			this.focus_Node = imgElement.nextSibling;
			this.offset = imgElement.innerText.length;
			this.editorHtml = this.$refs['editor'].innerHTML;
		}
	}
};
</script>
  <style>
  .el-cascader-node.in-active-path,
  .el-cascader-node.is-selectable.in-checked-path,
  .el-cascader-node.is-active {
    color: #606266 !important;
    font-weight: 400 !important;
  }
  </style>
  <style>
  .userListPopper {
    /* max-height: 200px !important; */
    overflow: auto;
    z-index: 999999 !important;
    min-height: 198px;
    max-height: 200px
      /* transform: scale(.5); */
  }
  
  .userListPopper::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 4px;
    height: 4px;
  }
  </style>
  <style>
  .uid {
    color: #488aff;
    cursor: pointer;
    font-size: 12px;
    padding: 6px;
    font-weight: bold;
  }
  </style>
  <style lang="scss" scoped>
  /deep/ .el-cascader-menu {
    min-width: 107px;
  }
  
  .comment {
    width: 100%;
    height: 155px;
    margin-top: 15px;
  
    .comment-textare {
      // width: 100%;
      height: 70px;
      max-height: 130px;
      padding: 10px;
      border: 1px solid #dddddd;
      background-color: #f7f7f7;
      position: relative;
      border-radius: 6px;
      overflow-y: auto;
  
      .textNum {
        position: absolute;
        right: 10px;
        bottom: 10px;
        font-size: 12px;
        padding: 0 5px;
        background-color: #f7f7f7;
  
        span {
          color: #999;
        }
      }
  
      .textNumSelect {
        background-color: #fff;
      }
  
      .placeholder {
        font-size: 14px;
        color: #666;
        position: absolute;
        top: 10px;
        left: 10px;
      }
    }
  
    .inner {
      background-color: #fff;
    }
  
    .editor {
      width: 100%;
      height: 100%;
      font-size: 14px;
      color: #666666;
      overflow-y: auto;
      position: relative;
      letter-spacing: 2px;
      word-break: break-all;
      font-size: 12px;
  
      &:empty:before {
        content: attr(placeholder);
        color: #666666;
      }
    }
  }
  
  .emojiBtn {
    display: flex;
    margin-top: 20px;
    margin-bottom: 10px;
  
    .emoBox {
      display: flex;
    }
  
    /deep/ .el-button {
      display: block;
      margin-left: auto;
    }
  
    .replyBtns {
      display: flex;
      margin-left: auto;
  
      /deep/ .el-button {
        margin-left: 10px;
      }
    }
  
    .smail-box {
      display: flex;
      line-height: 30px;
      cursor: pointer;
  
      .smail {
        color: #fdb918;
        font-size: 20px;
      }
  
      span {
        font-size: 12px;
        color: #666666;
        margin-left: 10px;
      }
    }
  
    .comment-uploadImg {
      line-height: 30px;
      margin-left: 20px;
      display: flex;
      cursor: pointer;
  
      .iconfont {
        color: #fdb918;
        font-size: 24px;
      }
  
      span {
        font-size: 12px;
        color: #666666;
        margin-left: 10px;
        display: block;
      }
    }
  }
  
  .emojiArr {
    .emojiTitle {
      width: 100%;
      border-bottom: 1px solid #f7f7f7;
      padding-bottom: 10px;
      margin-bottom: 10px;
  
      span {
        padding: 2px 5px;
        background-color: #488aff;
        color: #fff;
        border-radius: 5px;
        font-size: 12px;
      }
    }
  
    .emojiItem {
      margin-right: 6px;
      margin-bottom: 6px;
      cursor: pointer;
      font-size: 16px;
      display: inline-block;
    }
  }
  
  //滚动条样式
  *::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 4px;
    height: 4px;
  }
  
  /deep/ .el-popover {
    padding: 0;
  }
  
  [contenteditable]:focus {
    outline: none;
  }
  </style>
  