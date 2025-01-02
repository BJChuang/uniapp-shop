<template>
	<view class="qwshop">
		<view class="person_list ct30 pd10 br20">
			<uni-list :border="false">
				<uni-list-item showExtraIcon :extraIcon="{type:'phone-filled',size:22,color:'#000000'}" title="手机绑定" link  rightText="已绑定"></uni-list-item>
				<uni-list-item @click="bindWechat" showExtraIcon :extraIcon="{type:'weixin',size:22,color:'#50bc89'}" title="微信绑定" link  rightText="已绑定"></uni-list-item>
				<uni-list-item showExtraIcon :extraIcon="{type:'trash-filled',size:22,color:'#e11f27'}" title="删除账号" link  rightText="删除账号信息"></uni-list-item>
			</uni-list>
		</view>
	</view>
</template>

<script setup>
	import {R} from '@/plugins/http.js' // 请求方式中间件
	const bindWechat = ()=>{
		R.toast('暂未开发')
	}
</script>

<style lang="scss" scoped>
.person_list{
	background: #fff;
	margin-top: 30rpx;
}

</style>
