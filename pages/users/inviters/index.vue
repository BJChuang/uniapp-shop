<template>
	<view class="qwshop">
		<view class="inviter_list" @click="save">
			<image src="/static/inviter/inviter.jpg" mode="aspectFill"></image>
			<uqrcode ref="uqrcode" class="uqrcode" :size="sizeRpx(230)" canvas-id="qrcode" :value="qrcodeVal||'0'" :options="{ margin: 4 }"></uqrcode>
		</view>
	</view>
</template>

<script setup>
	import {R} from '@/plugins/http.js' // 请求方式中间件
	import { reactive, ref,getCurrentInstance } from 'vue'
	import {onLoad,onShow} from "@dcloudio/uni-app"
	
	const {proxy} = getCurrentInstance() // 有效  全局
	const qrcodeVal = ref(0)
	// const uqrcode = ref(null)
	
	const data = reactive({user:{}})
	const loadUser = async ()=>{
		let res = await R.get('auth/info',{provider:'users'})
		if(res.code && res.code == 200) data.user = res.data||{}
		// #ifdef APP-PLUS
		qrcodeVal.value = data.user.id||0
		// #endif
		// #ifdef H5 || MP
		qrcodeVal.value = location.protocol + '//' + location.host+'/pages/auth/register?inviter_id='+data.user.id
		// #endif
		// #ifdef MP-WEIXIN
		qrcodeVal.value = config.requestUrl+(data.user.id||0)
		// #endif
		setTimeout(()=>{
			proxy.$refs.uqrcode.remake()
		},1600)
	}
	
	const sizeRpx = ((e)=>{
		return uni.upx2px(e)
	})
	
	const save = ()=>{
		proxy.$refs.uqrcode.save({
		  success: () => {
		    uni.showToast({
		      icon: 'success',
		      title: '保存成功'
		    });
		  }
		});
	}
	
	onShow(()=>{
		loadUser()
	})
</script>

<style lang="scss" scoped>
.qwshop{
	height: 100%;
}
.inviter_list{
	background: #fff;
	background-size:100% ;
	height: 100%;
	width: 100%;
	position: relative;
	image{
		height: 100%;
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}
	.uqrcode{
		position: absolute;
		top: 58%;
		/* #ifdef APP */
		top: 57%;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		top: 58%;
		/* #endif */
		left:calc(50% - 105rpx);
		z-index: 66;
	}
}

</style>
