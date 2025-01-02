<template>
	<view class="chat_index">
		<z-paging ref="paging" use-page-scroll v-model="data.list" @query="upCallback"  :auto="false">
			<uni-list>
				<uni-list :border="true">
					<uni-list-chat 
					:clickable="true" 
					@click="R.nav('/pages/chats/chat?rid='+(v.rid == data.userInfo.id  ? v.sid : v.rid)+'&rtype='+(v.rid == data.userInfo.id  ? v.stype : v.rtype)+'&nickname='+(v.rid == data.userInfo.id  ? v.sinfo.nickname : v.rinfo.nickname)+'&provider=users')" 
					v-for="(v,k) in data.list" 
					:key="k" :title="v.rid == data.userInfo.id  ? v.sinfo.nickname : v.rinfo.nickname" 
					:avatar="R.formatUrl(v.rid == data.userInfo.id  ? v.sinfo.avatar : v.rinfo.avatar)||'/static/auth/default_avatars.png'" 
					:note="v.lastMsg ? (!v.lastMsg.content?'-':(v.lastMsg.content_type=='text'?v.lastMsg.content:'['+v.lastMsg.content_type+']')):'-'" 
					:time="v.created_at||'0000-00-00'" 
					badge-positon="left" 
					:badge-text="(v.rid == data.userInfo.id  ? v.r_read==0 : v.s_read==0) ?'dot':''">
					</uni-list-chat>
				</uni-list>
			</uni-list>
		</z-paging>
	</view>
</template>
 
<script setup>
	import dayjs from "dayjs"
	import config from "@/plugins/config.js"
	import { reactive,getCurrentInstance } from 'vue'
	import {onLoad,onShow,onHide} from "@dcloudio/uni-app"
	import {R} from '@/plugins/http.js' // 请求方式中间件
	const {proxy} = getCurrentInstance() // 有效  全局
	
	const data = reactive({
		params:{
			page:1,
			per_page:10,
		},
		chatParams:{provider:'users',rid:0,rtype:'users'},
		list:[],
		socketObj:null,
		timer:null,
		store_id:0,
		stype:'',
		isLogin:false,
		userInfo:undefined,
	})
	
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
	
	const open = async ()=> {
		await sendHeart()
	}
	const error = ()=> {
	    // eslint-disable-next-line no-console
	    console.log("连接错误")
	}
	const getMessage = (msg)=> {
		try {
			let obj = JSON.parse(msg.data)
			if(obj.type == 'heart') return console.log(obj)
			proxy.$refs.paging.reload()
		} catch (error) {
			R.toast(error)
			return console.error(error)
		}
	}
	const close = ()=> {
	    // eslint-disable-next-line no-console
	    console.log("socket已经关闭")
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
	
	const add_friend = ()=>{
		R.post('/Wap/Chat/add',data.chatParams,1).then(res=>{
			if(!res.code){
				// data.selfData = res // 得到自己的信息
				sendHeart()
			}
		}).finally(()=>{
			proxy.$refs.paging.reload()
		})
	}
	
	
	const loadData = ()=>{
		let token = uni.getStorageSync('token')
		if(!R.isEmpty(token)){
			data.chatParams.provider = 'users'
		}
		R.post('/Wap/Chat/friends',data.chatParams,1).then(res=>{
			if(res.code != 200) return proxy.$refs.paging.complete(false)
			proxy.$refs.paging.complete(res.data)
		})
	}
	
	const upCallback = (pageNo, pageSize)=>{
		data.params.page = pageNo // 页码, 默认从1开始
		data.params.per_page = pageSize // 页长, 默认每页10条
		loadData()
	}
	const loadUser = async ()=>{
		let res = await R.get('/Wap/auth/info',{provider:'users'})
		if(res.code && res.code == 200){
			data.userInfo = res.data||{}
			data.isLogin = true
			proxy.$refs.paging.reload()
			websocketInit()
		}else{
			data.isLogin = false
			data.userInfo = undefined
			R.nav('/pages/index/self',1)
		}
		proxy.$refs.paging.complete()
	}
	
	const formatTime = (e)=>{
		return dayjs(e).format('yyyy-MM-DD HH:mm:ss');
	}
	
	onLoad( async (opt)=>{
		
		await loadUser()
		if(opt.id){
			data.chatParams.rid = opt.id
			setTimeout(()=>{
				data.isLogin ? add_friend()	: 'return'
			},500)
			
		}
	}) 
	
	onHide(()=>{
		data.socketObj.close({
			complete(e) {
				console.log('关闭socket')
			}
		});
	})
	
</script>

<style lang="scss">

</style>
