<template>
	<view class="qwshop">
		<view class="person_list ct30 pd10 br20">
			<uni-list :border="false">
				<uni-list-item  title="头像" link @click="choseImg">
					<template #footer>
						<image class="slot-image" :src="R.formatUrl(data.user.avatar)||''"></image>
					</template>
				</uni-list-item>
				<uni-list-item  title="昵称" link @click="openPop" :rightText="data.user.nickname||'-'"></uni-list-item>
			</uni-list>
		</view>

		<uni-popup ref="popup" type="dialog">
		    <uni-popup-dialog style="text-align: center;" type="info" mode="input" title="提示" :value="data.user.nickname" placeholder="请输入昵称" @confirm="dialogInputConfirm" />
		</uni-popup>
	</view>
</template>

<script setup>
	import { reactive,ref } from 'vue'
	import {onLoad} from "@dcloudio/uni-app"
	import {R} from '@/plugins/http.js' // 请求方式中间件
	import config from "@/plugins/config.js"
	
	const popup = ref(null)
	
	const data = reactive({user:{}})
	const loadUser = async ()=>{
		let res = await R.get('auth/info',{provider:'users'})
		if(res.code && res.code == 200) data.user = res.data||{}
	}
	
	const openPop = ()=> popup.value.open()
	const dialogInputConfirm = (done)=>{
		if(done == '') return R.toast('请不要为空')
		R.post('/Wap/auth/edit',{provider:'users',nickname:done}).then(res=>{
			if(res.code == 200 && res.data != null){
				uni.$emit('users')
				loadUser()
			}else{
				R.toast(res.msg)
			}
		})
	}
	const choseImg = ()=>{
		let token = uni.getStorageSync('token')
		uni.chooseImage({
			count:1,
			success: (e) => {
				uni.showLoading()
				uni.uploadFile({
					url: config.requestUrl+'uploads', //地址
					filePath: e.tempFilePaths[0],
					name: 'file',
					header:{
						Authorization:'Bearer ' + token
					},
					formData: {
						'name':'avatar'
					},
					success: (item) => {
						let info = JSON.parse(item.data)
						R.post('/Wap/auth/edit',{provider:'users',avatar:info.data}).then(res=>{
							if(res.code == 200 && res.data != null){
								loadUser()
							}else{
								R.toast(res.msg)
							}
						})
					},
					complete: () => {
						uni.hideLoading()
						uni.$emit('users')
					}
				})
	
			}
		})
	}
	
	onLoad(()=>{
		uni.$on('users',()=>{
			loadUser()
		})
		loadUser()
	})
</script>

<style lang="scss" scoped>
.person_list{
	background: #fff;
	margin-top: 30rpx;
}
.slot-image{
	width: 60rpx;
	height: 60rpx;
	border-radius: 8rpx;
	background-color: #efefef;
}
</style>
