<template>
	<view class="chat_chat">
		
		<!-- 聊天内容 -->
		<view class="chat_content">
			<scroll-view id="scrollview" :scroll-x="false" :scroll-y="true" :style="{height: data.style.contentViewHeight + 'px'}" :scroll-with-animation="true" :scroll-top="data.scrollTop">
				<!-- 聊天内容 -->
				<view class="chat_interface_right_content"  ref="myScrollbar">
					<view class="scrollitem" v-for='(v,k) in data.onChat' :key="k">
						<view :class="(data.userInfo.id!=v.sid)?'chat_interface_msg_item':'chat_interface_msg_item me'">
							<view class="chat_interface_msg_avatar">
								<image :src="R.formatUrl(loadInfoBySid(v.sid,v.stype).avatar)||'/static/self/default_avatars.png'" alt="" />
							</view>
							<view :style="(data.userInfo.id!=v.sid)?'float: left;':'float: right;'">
								<view class="chat_interface_msg_time"><text>{{(loadInfoBySid(v.sid,v.stype).nickname)||'-'}}</text> {{v.created_at||'0000-00-00'}}</view>
								<view class="chat_interface_msg">
									<view class="chat_image" v-if="v.content_type=='image'" ><image :src="R.formatUrl(v.content)||''" mode="aspectFit"  /></view>
									<view v-else-if="v.content_type=='text'">{{v.content||''}}</view>
									<view v-else>无法识别！</view>
								</view>
							</view>
						</view>
					</view>
					
		
					
				</view>
			</scroll-view>
		</view>
		
		<!-- 底部输入框 -->
		<view class="chat_bottom">
			<view class="img_btn" @click="upload()">
				<uni-icons type="image" size="24" color="#999"></uni-icons>
			</view>
			<textarea class="inputbox" v-model="data.sendMsg.content" placeholder="输入内容..." placeholder-style="font-size:28rpx" />
			<view class="send_btn" @click="send('text')">发送</view>
		</view>
	</view>
</template>

<script setup>
	import dayjs from "dayjs"
	import config from "@/plugins/config.js"
	import {R} from '@/plugins/http.js' // 请求方式中间件
	import { reactive,getCurrentInstance } from 'vue'
	import {onLoad,onShow,onHide} from "@dcloudio/uni-app"
	const {proxy} = getCurrentInstance() // 有效  全局
	
	const data = reactive({
		onChat:[],
		friends:[],
		pageParams:{
			page:1,
			per_page:10,
		},
		// 聊天页面时时滚动样式
		style: {
			pageHeight: 0,
			contentViewHeight: 0,
			footViewHeight: 90,
			mitemHeight: 0
		},
		scrollTop:-1,
		socketObj:null,
		sendMsg:{
		    type:'text', // 类型
		    content:'', // 内容
		    uid:0,
		    send_type:0,
		    store_id:0,
		},
		chatParams:{provider:'users',rid:0,rtype:'users'},
		selfData:{},
		isLogin:false,
		userInfo:undefined,
	})
	
	const scrollDown = ()=> {
		let that = this;
		
		let query = uni.createSelectorQuery();
		query.selectAll('.scrollitem').boundingClientRect();
		// query.select('#scrollview').boundingClientRect();
		setTimeout(() => {
			query.exec((res) => {
				data.style.mitemHeight = 0;
				res[0].forEach((rect) => {
					data.style.mitemHeight = data.style.mitemHeight + rect.height + 40
				})   //获取所有内部子元素的高度
				console.log(data.style.mitemHeight,data.style.contentViewHeight)
				if (data.style.mitemHeight > (data.style.contentViewHeight - 100)) {   //判断子元素高度是否大于显示高度
					data.scrollTop = data.style.mitemHeight - data.style.contentViewHeight    //用子元素的高度减去显示的高度就获益获得序言滚动的高度
					console.log(data.scrollTop)
				}
　　　　　　　})
		},50)
		
	}
	
	// 发送心跳
	const setTime = async ()=>{
		if(data.socketObj == null) return
		const heartMsg = JSON.stringify({
				type:'heart',
				data:{
					sid:data.userInfo.id
				}
			})
		data.socketObj.send({
			data:heartMsg,
		})
	}
	const sendHeart = async () =>{
		if(data.socketObj == null) return
		if(data.timer != null) clearInterval(data.timer)
		await setTime()
		data.timer = setInterval(async ()=>{
			await setTime()
		},40000)
	}
	
	const add_friend = ()=>{
		R.post('/Wap/Chat/add',data.chatParams,1).then(res=>{
			if(!res.code){
				data.selfData = res // 得到自己的信息
				sendHeart()
			}
		}).finally(()=>{
			loadFriend()
		})
	}
	
	const loadFriend = ()=>{
		R.post('/Wap/Chat/friends',data.chatParams,1).then(res=>{
			data.friends = res.data
		})
	}
	
	// 获取聊天信息
	const getList = (isOpen=false)=>{
		let params = Object.assign(data.pageParams,data.chatParams)
		R.post('/Wap/Chat/friend_content',params,1).then(res=>{
			if(res.code == 200){
				data.pageParams.page = res.current_page?res.current_page:1
				data.pageParams.last_page = res.last_page?res.last_page:1
				data.pageParams.per_page = res.page?res.page:50
				data.pageParams.total = res.total?res.total:1
				let chatList = res.data.data.reverse()
				data.onChat = []
				chatList.map(item=>{
					data.onChat.push(item)
				})
				// data.chatList = data.chatList.unshift(_.reverse(res.data))
				const sys = uni.getSystemInfoSync();   //获取手机可使用窗口高度     api为获取系统信息同步接口
				　　　	data.style.pageHeight = sys.windowHeight;
				　　　	data.style.contentViewHeight = sys.windowHeight - uni.getSystemInfoSync().screenWidth / 750 * (100) ; //像素   因为给出的是像素高度 然后我们用的是upx  所以换算一下 
				if(isOpen) scrollDown() // 拉到最底部
		
			}
		})
		
	}
	// 根据Sid Rid 比较获取用户信息内容
	const loadInfoBySid = (id,stype)=>{
		if(id == 0) return {}
		let items = {}
		console.log(id,stype)
		data.friends.map(item=>{
			if(item.sid == id && item.stype == stype){
				items = item.sinfo
			}
			if(item.rid == id && item.rtype == stype){
				items = item.rinfo
			}
		})
		return items
	}
	
	const open = async ()=> {
		await sendHeart()
		add_friend()
	}
	
	const error = ()=> {
	    // eslint-disable-next-line no-console
	    console.log("连接错误")
	}
	
	const getMessage = (msg)=>{
		try {
			let obj = JSON.parse(msg.data)
			if(obj.type == 'heart') console.log(obj)
			data.pageParams.page = 1
			data.chatList = []
			getList(data.pageParams.page>1?false:true)
		} catch (error) {
			return console.error(error)
		}
	}
	
	const websocketInit = ()=>{
		if(!data.isLogin){
		    return R.toast('未登陆');
		}
		data.socketObj = uni.connectSocket({
			url:config.ws(),
			success:()=>{
				console.log("socket连接成功")
			},
			fail:()=>{
				console.log("socket连接失败")
			},
		})
		// 监听socket连接
		data.socketObj.onOpen(()=>{
			open();
		})
		
		// 监听socket错误信息
		data.socketObj.onError(()=>{
			 error()
		});
		// 监听socket消息
		data.socketObj.onMessage((e)=>{
			getMessage(e)
		})
	}
	
	// 发送socket信息
	const send = (sendType = 'text')=>{
		let params = {
			provider:data.chatParams.provider,
			rid:data.chatParams.rid,
			rtype:data.chatParams.rtype,
			content_type:sendType,
			content:sendType == 'text' ? data.sendMsg.content : data.sendMsg.file,
		}
		R.post('/Wap/Chat/send',params,1).then(res=>{
			if(!res.code){
				if(sendType == 'text'){
					data.sendMsg.content = ''
				}else{
					data.sendMsg.file = ''
				}
			}
		}).finally(()=>{
			getList(true)
		})
	}
	
	const checkLogin = async ()=>{
		let res = await R.get('/Wap/auth/info',{provider:'users'})
		if(res.code == 200 && res.data != null){
			data.isLogin = true
			data.userInfo = res.data
			console.log(data.userInfo)
			getList()
			setTimeout(()=>{
				scrollDown()
			},300)
			websocketInit()
		}else{
			data.isLogin = false
			data.userInfo = undefined
			R.nav('',3)
		}
	}
	
	
	onLoad((opt)=>{
		data.chatParams = opt
		uni.setNavigationBarTitle({
		　　title:opt.nickname||'神秘人物'
		})
		checkLogin()
		loadFriend()
		const sys = uni.getSystemInfoSync();   //获取手机可使用窗口高度     api为获取系统信息同步接口
　　　	data.style.pageHeight = sys.windowHeight;
　　　	data.style.contentViewHeight = sys.windowHeight - uni.getSystemInfoSync().screenWidth / 750 * (100) ; //像素   因为给出的是像素高度 然后我们用的是upx  所以换算一下 
　　　	console.log(data.style.contentViewHeight)
	})
	
	onHide(()=>{
		data.socketObj.close({
			complete(e) {
				console.log('关闭socket')
			}
		});
	})
	
	const upload = ()=>{
		let token = uni.getStorageSync('token')
		uni.chooseImage({
			count:1,
			success: (res) => {
				uni.showLoading()
				uni.uploadFile({
					url: config.path+'/api/uploads', //地址
					filePath: res.tempFilePaths[0],
					name: 'file',
					header:{
						Authorization:'Bearer ' + token
					},
					formData: {
						'name':'chat'
					},
					success: (item) => {
						let info = JSON.parse(item.data)
						data.sendMsg.file = info.data
						send('image')
					},
					complete: () => {
						uni.hideLoading()
					}
				})
		
			}
		})
	}
	
	
		
</script>

<style lang="scss">
.chat_chat{
	.chat_bottom{
		box-shadow: 0px -3px 4px #f1f1f1;
		position: fixed;
		bottom: 0;
		height: 100rpx;
		width: 100%;
		background: #fff;
		padding: 20rpx 30rpx 0 30rpx;
		box-sizing: border-box;
		display: flex;
		.img_btn{
			flex: 0 1 120rpx;
			margin-top: 6rpx;
		}
		.inputbox{
			margin-top: 8rpx;
			flex: 0 1 100%;
			height: 46rpx;
			border-bottom: 1px solid #ddd;
			font-size: 28rpx;
		}
		.send_btn{
			color:#fff;
			background: #00aa00;
			width: 160rpx;
			height: 60rpx;
			border-radius: 6rpx;
			font-size: $uni-font-size-base;
			text-align: center;
			line-height: 60rpx;
			display: block;
			flex: 0 1 160rpx;
			margin-left: 40rpx;
		}
		&:after{
			content:'';
			display: block;
			clear: both;
		}
	}
	
	.chat_interface_right_content{
	    height:auto!important;
	    // padding-bottom: 120rpx;
	    box-sizing: border-box;
	    overflow-y: scroll;
		.chat_image{
			width: 100%;;
			image{width: 100%;height: 300rpx;}
		}
	    .chat_interface_msg_item{
	        padding: 15px 0 0 15px;
			margin-bottom: 20rpx;
			&:after{
				content:'';
				display: block;
				clear: both;
			}
	        .chat_interface_msg_avatar{
	            background-color: #efefef;
	            border-radius: 50%;
	            width: 40px;
	            height: 40px;
	            float: left;
	            margin-right: 15px;
	            image{
	                border-radius: 50%;
	                width: 100%;
	                height: 100%;
	            }
	        }
	        .chat_interface_msg_time{
	            font-size: 12px;
	            color:#666;
	            line-height: 20px;
	            text{
	                float: left;
	                font-size: 14px;
	                color:#333;
	                margin-right: 15px;
	                font-weight: bold;
	            }
	        }
	        .chat_interface_msg_time:after{
	            content:'';
	            display: block;
	            clear: both;
	        }
	        .chat_interface_msg{
	            font-size: 12px;
	            line-height: 20px;
	            padding: 5px 8px;
	            background: #efefef;
	            border-radius: 5px;
	            word-wrap:break-word;
	            // display:inline-block;
	            min-width: 140px;
	            max-width: 250px;
	            height: 100%;
				margin-top: 10rpx;
	        }
	    }
	    .me{
	        .chat_interface_msg_avatar{
	            float: right;
	        }
	        .chat_interface_msg_time{
	            float: right;
	            text{
	                float: right;
	                margin-left: 20px;
	            }
	        }
	        .chat_interface_msg{
	            background: #67C23A;
	            color:#fff;
	            float: right;
	            clear:both;
	            text-align: right;
				margin-right: 26rpx;
	        }
	    }
	    .me:after{
	        content:'';
	        display: block;
	        clear: both;
	    }
	}
}
</style>
