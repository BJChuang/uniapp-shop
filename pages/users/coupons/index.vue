<template>
	<view class="qwshop">
		<view class="top_tab ct30 pd10">
			<view class="item">
				<text :class="data.params.status==0?'ck':''" @click="chose(0)">未使用</text>
			</view>
			<view class="item">
				<text :class="data.params.status==1?'ck':''" @click="chose(1)">已使用</text>
			</view>
		</view>
		<z-paging ref="paging" :auto-scroll-to-top-when-reload="false" use-page-scroll v-model="data.list" @query="upCallback">
			<view class="coupons_list ct30 br20" style="margin-top: 20rpx;" v-for="(v,k) in data.list||[]" :key="k">
				<view class="left_item">
					<text class="t1">￥{{v.money||'0.00'}}</text>
					<text class="t2">{{v.use_money>0?'满减优惠券':'普通优惠券'}}</text>
				</view>
				<view class="right_item">
					<text class="t1">{{v.name||'-'}}</text>
					<text class="t2">{{v.content||'-'}}</text>
					<text class="t3">有效期 {{formatTime(v.start_time)}} - {{formatTime(v.end_time)}}</text>
					<text class="t4">{{v.nickname}}</text>
				</view>
			</view>
		</z-paging>
		
	</view>
</template>

<script setup>
	import {R} from '@/plugins/http.js' // 请求方式中间件
	import { reactive,ref,nextTick } from 'vue'
	import {onLoad} from "@dcloudio/uni-app"
	import dayjs from "dayjs"
	
	const paging = ref(null)
	
	const data = reactive({
		params:{
			page:1,
			per_page:10,
			status:0,
		},
		list:[],
	})
	
	const formatTime = (e)=>{
		return dayjs(e).format('YYYY-MM-DD')
	}
	
	const upCallback = (pageNo, pageSize)=>{
		data.params.page = pageNo // 页码, 默认从1开始
		data.params.per_page = pageSize // 页长, 默认每页10条
		uni.showLoading({title:'加载中...'})
		R.get('/Wap/coupons',data.params).then(res=>{
			if(res.code != 200) return paging.value.complete(false)
			paging.value.complete(res.data.data)
		}).finally(()=>{
			uni.hideLoading()
		})
	}
	
	const chose = (e)=>{
		data.params.status = e
		paging.value.reload()
	}
</script>

<style lang="scss" scoped>
.coupons_list{
	background: #fff;
	margin-top: 30rpx;
	display: flex;
	.left_item{
		border-radius: 20rpx 0 0 20rpx;
		padding: 40rpx 0;
		
		flex: 0 0 270rpx;
		color: #fff;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: linear-gradient(to left,$primary,$gradient);
		.t1{
			font-size: 40rpx;
		}
		.t2{
			font-size: $uni-font-size-sm;
			margin-top: 10rpx;
		}
	}
	.right_item{
		box-sizing: border-box;
		position: relative;
		padding: 20rpx;
		display: flex;
		flex-direction: column;
		flex: 1;
		.t1{
			font-size: $uni-font-size-lg;
		}
		.t2{
			font-size: $uni-font-size-base;
			color:#999;
			height: 68rpx;
			border-bottom: 1px dashed #ccc;
		}
		.t3{
			margin-top: 10rpx;
			font-size: $uni-font-size-sm;
			color:#999;
		}
		.t4{
			position: absolute;
			right:0;
			font-size: $uni-font-size-sm;
			top: 0;
			color:#fff;
			background: $uni-color-warning;
			padding: 10rpx 20rpx;
			border-radius: 0 20rpx 0 20rpx;
		}
	}
}


</style>
