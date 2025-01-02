<template>
	<view class="hi-columns">
		<view class="pdbg ct30 br20">
			<view class="img_box hi-rows">
				<image src="/static/identity/rz.png" mode=""></image>
			</view>
			<view class="item">
				<text class="t1">真实姓名</text>
				<text class="t2">{{data.info.name}}</text>
			</view>
			<view class="item" >
				<text class="t1">身份证号</text>
				<text class="t2">{{data.info.card_no}}</text>
			</view>
			<view class="item">
				<text class="t1">开户银行</text>
				<text class="t2">{{data.info.bank_name}}</text>
			</view>
			<view class="item" >
				<text class="t1">银行卡号</text>
				<text class="t2">{{data.info.bank_no}}</text>
			</view>
			<view class="item" style="border-bottom: none;">
				<text class="t1">证件审核</text>
				<text class="t2">已通过</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { reactive } from 'vue'
	import {onLoad} from "@dcloudio/uni-app"
	import {R} from '@/plugins/http.js' // 请求方式中间件
	
	const data = reactive({
		info:{},
	})
	
	const check = ()=>{
		R.get('/Wap/users/check',{provider:'users'}).then(res=>{
			if(res.code == 200 && res.data != null){
				data.info = res.data
			}
		})
	}
	
	onLoad(()=>{
		check()
	})
	
	uni.$on('check',()=>{
		check()
	})
	
</script>

<style lang="scss" scoped>
.pdbg{background: #fff;}
.img_box{width: 100%;height: 400rpx;background: $primary;padding-top: 60rpx;border-radius: 20rpx 20rpx 0 0;}
.img_box image{width: 241rpx;height: 279rpx;display:block;margin:0 auto;}
.item{padding: 34rpx 40rpx; box-sizing: border-box;border-bottom: 1px solid #F6F6F6;}
.t1{font-size: 32rpx;color: #333333;margin-right: 15rpx;}
.t2{font-size: 32rpx;color: #999999;float: right;}
</style>
