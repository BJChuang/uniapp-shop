<template>
	<view class="qwshop">
		<view class="setting_list ct30 pd10 br20">
			<uni-list :border="false">
				<uni-list-item @click="copyId(data.user.id||0)" link title="数字标识" :rightText="data.user.id||'-'"></uni-list-item>
				<uni-list-item  title="个人资料" link to="/pages/users/settings/person"  ></uni-list-item>
				<!-- <uni-list-item  title="收货地址" link to="/pages/users/addresses/index"  ></uni-list-item>
				<uni-list-item  title="账号绑定" link to="/pages/users/settings/bind" rightText="手机微信绑定"></uni-list-item> -->
			</uni-list>
		</view>
		<view class="setting_list ct30 pd10 br20">
			<uni-list :border="false">
				<uni-list-item  title="清除缓存" link @click="clearCache" ></uni-list-item>
				<uni-list-item  title="关于我们" link @click="about" ></uni-list-item>
				<uni-list-item  title="检查更新" link @click="checkVersion" :rightText="data.version"></uni-list-item>
			</uni-list>
		</view>
		
		<view class="list_b_btn ct30 pd10" @click="logout">退出登录</view>
		<qw-updaters ref="updater"  />
	</view>
</template>

<script setup>
	import { reactive,ref } from 'vue'
	import {onLoad} from "@dcloudio/uni-app"
	import {R} from '@/plugins/http.js' // 请求方式中间件
	import config from '@/plugins/config.js' // 请求方式中间件
	
	const updater = ref(null)
	
	const data = reactive({
		user:{},
		version:'1.0.0',
		updateData:{},
	})
	const loadUser = async ()=>{
		let res = await R.get('/Wap/auth/info',{provider:'users'})
		if(res.code && res.code == 200) data.user = res.data||{}
		if(data.user.id) data.user.id += ''
	}
	
	const logout = async ()=>{
		await R.get('/Wap/logout',{provider:'users'}).then(()=>{})
		let token = uni.getStorageSync('token')
		uni.removeStorageSync('token')
		
		uni.switchTab({
			url:'/pages/index/self',
			success() {
				uni.$emit('users')
			}
		})
	}
	
	const clearCache = ()=>{
		uni.showLoading({
			title:'缓存清理...'
		})
		setTimeout(()=>{
			// uni.removeStorageSync('code')
			// uni.removeStorageSync('openid')
			// uni.removeStorageSync('token')
			uni.hideLoading();
			R.toast('缓存清理完成');
		},1500)
	}
	
	const about = ()=>{
		R.toast('QQ:xxxx');
	}
	
	const version = ()=>{
		// #ifdef APP
		data.version = plus.runtime.version
		// #endif
	}
	
	const checkVersion = ()=>{
		let platform = uni.getSystemInfoSync().platform
		R.get('/app_versions',{device:'Android'},1).then(res=>{
			console.log(res)
			if(res.code && res.code == 200){
				data.updateData = res.data
				data.updateData.content = R.editorHandle(data.updateData.content)
				data.updateData.url = config.originPath + data.updateData.url
				updater.value.checkVersion(data.updateData,true)
			}
		})
	}
	
	const copyId = (content)=>{
		// 该方法不支持h5
		//#ifndef H5
		uni.setClipboardData({
			data: String(content), // 必须字符串
			success: function () {
				console.log('success');
			}
		});
		//#endif
	
		// h5端赋值方法，使用创建节点
		// #ifdef H5
		if (!document.queryCommandSupported('copy')) { // 兼容某些浏览器的判断
			console.log('该浏览器不支持')
		}
		let textarea = document.createElement("textarea")
		textarea.value = content
		textarea.readOnly = "readOnly"
		document.body.appendChild(textarea)
		textarea.select() // 选择对象
		textarea.setSelectionRange(0, content.length) // 核心
		let result = document.execCommand("copy") // 执行浏览器复制命令
		if (result) {
			uni.showToast({
				title: '复制成功',
				duration: 2000
			});
		}
		textarea.remove()
		//#endif
	}
	
	onLoad(()=>{
		uni.$on('users',()=>{
			loadUser();
		})
		loadUser();
		version()
	})
</script>

<style lang="scss" scoped>
.setting_list{
	background: #fff;
	margin-top: 30rpx;
}
</style>
