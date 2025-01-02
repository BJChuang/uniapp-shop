<template>
	<view class="qwshop">
		<z-paging ref="paging" :auto-scroll-to-top-when-reload="false" use-page-scroll v-model="data.list" @query="upCallback">
			<view class="coupons_list ct30 br20" v-for="(v,k) in data.list||[]" :key="k"  >
				<view :class="v.money>0?'left_item':'left_item ck'">
					<text class="t1">{{moneyFormat(v.money)}}</text>
					<text class="t2" v-if="v.is_type==0">我的余额</text>
					<text class="t2" v-if="v.is_type==1">冻结资金</text>
					<text class="t2" v-if="v.is_type==2">我的积分</text>
				</view>
				<view class="right_item">
					<text class="t1">{{v.name||'-'}}</text>
					<!-- <text class="t2">{{v.info||'-'}}</text> -->
					<text class="t3">时间: {{v.created_at}}</text>
					<text class="t4">{{v.money>0?'增加':'扣除'}}</text>
				</view>
			</view>
		</z-paging>
		
	</view>
</template>

<script setup>
	import {R} from '@/plugins/http.js' // 请求方式中间件
	import { reactive,ref,nextTick } from 'vue'
	import {onLoad} from "@dcloudio/uni-app"
	
	const paging = ref(null)
	
	const data = reactive({
		params:{
			page:1,
			per_page:10,
			is_type:0,
		},
		list:[],
	})
	
	const moneyFormat = (money)=>{
		if(-1 == money.indexOf('-')) return money = '+'+money
		money = money.substr(1,money.length-1)
		return money = '-'+money
	}
	
	const upCallback = (pageNo, pageSize)=>{
		data.params.page = pageNo // 页码, 默认从1开始
		data.params.per_page = pageSize // 页长, 默认每页10条
		uni.showLoading({title:'加载中...'})
		R.get('/Wap/users/money_logs',data.params).then(res=>{
			if(res.code != 200) return paging.value.complete(false)
			paging.value.complete(res.data.data)
		}).finally(()=>{
			uni.hideLoading()
		})
	}
	
	onLoad((opt)=>{
		data.params.is_type = opt.is_type
		nextTick(()=>{
			paging.value.reload
		})
	})

</script>

<style lang="scss" scoped>
.coupons_list{
	background: #fff;
	margin-top: 30rpx;
	display: flex;
	.left_item{
		border-radius: 20rpx 0 0 20rpx;
		padding: 20rpx 0;
		
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
		&.ck{
			background: linear-gradient(to left,#00b857,#00c589);
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
