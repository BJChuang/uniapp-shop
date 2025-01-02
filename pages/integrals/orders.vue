<template>
	<view class="qwshop">
		<view class="order_index">
			<view class="order_index_list">
				<z-paging ref="paging" use-page-scroll v-model="data.list" @query="upCallback">
					<view class="item_test_list">
						<view
							v-for="(item,index) in data.list" :key="index"
							class="order-item"
						>
							<view class="i-top">
								<view class="g-header" @click="R.nav('/pages/store/index?id='+item.store.id)">
									<text class="name">订单号: {{item.order_no}}</text>
								</view>
							</view>
							<view 
								class="goods-box-single"
								@click="R.nav('/pages/integrals/order?id='+item.id)"
							>
								<image class="goods-img" :src="R.formatUrl(item.order_image)||''" mode="aspectFill"></image>
								<view class="right">
									<text class="title clamp">{{item.order_name||'-'}}</text>
								</view>
							</view>
							
							<view class="price-box">
								<view>
									实付款
									<text class="price">{{item.total_price||'0.00'}}</text>
								</view>
							</view>
						</view>
					</view>
				</z-paging>
			</view>
		</view>
	</view>
</template>

<script setup>
	import Base64 from 'base-64';
	import { reactive,ref } from 'vue'
	import {R} from '@/plugins/http.js' // 请求方式中间件
	import {onLoad,onShow} from "@dcloudio/uni-app"
	
	const paging = ref(null)
	const data = reactive({
		params:{
			page:1,
			per_page:10,
		},
		list:[],
	})
	
	
	const loadData = (pageNo,pageSize)=>{
		data.params.page = pageNo // 页码, 默认从1开始
		data.params.per_page = pageSize // 页长, 默认每页10条
		 
		R.get('/Wap/integrals/orders',data.params).then(res=>{
			if(res.code != 200) return paging.value.complete(false)
			paging.value.complete(res.data.data||[])
		})
	}
	
	const upCallback =  (pageNo, pageSize)=>{
		loadData(pageNo, pageSize)
	}
	
	
	onLoad((opt)=>{
		uni.$on('integral_orders',()=>{
			paging.value.reload()
		})
	})
	
</script>

<style lang="scss" scoped>
.order-item{
	display: flex;
	flex-direction: column;
	padding:0 30rpx;
	background: #fff;
	margin-top: 16rpx;
	margin:0 30rpx;
	margin-bottom: 20rpx;
	border-radius: 15rpx;
	border-bottom: none;
	.i-top{
		display: flex;
		align-items: center;
		height: 100rpx;
		font-size: 28rpx;
		color: #333;
		position: relative;
		border-bottom: 1px solid #F4F5F9;
		.g-header {
			display: flex;
			flex: 1;
			align-items: center;
			height: 84rpx;
			position: relative;
			// border-bottom: 1px solid #efefef;
		}
		.name {
			font-size: 26rpx;
		}
	
	}

	/* 单条商品 */
	.goods-box-single{
		display: flex;
		padding: 20rpx 0;
		border-bottom: 1px solid #F4F5F9;
		.goods-img{
			display: block;
			width: 80rpx;
			height: 80rpx;
			border-radius: 6rpx;
			background-color: #efefef;
		}
		.right{
			flex: 1;
			display: flex;
			flex-direction: column;
			padding: 0 30rpx 0 24rpx;
			overflow: hidden;
			.title{
				font-size: 28rpx + 2rpx;
				color: #333;
				line-height: 1;
				font-weight: 600;
			}
			.attr-box{
				font-size: calc($uni-font-size-sm + 2rpx);
				color: #999;
				padding: 10rpx 0rpx;
			}
			.price{
				font-size: 28rpx + 2rpx;
				color: #333;
				font-weight: 600;
				&:before{
					content: '积分';
					font-size: $uni-font-size-sm;
					margin: 0 2rpx 0 0rpx;
				}
			}
		}
	}
	
	.price-box{
		display: flex;
		justify-content: left;
		align-items: baseline;
		padding: 20rpx 00rpx;
		justify-content: space-between;
		font-size: calc($uni-font-size-sm + 2rpx);
		// border-bottom: 1px solid #efefef;
		color: #999;
		.num{
			margin: 0 8rpx;
			color: $primary;
			font-weight: 600;
		}
		.price{
			font-size: $uni-font-size-lg;
			color: $primary;
			font-weight: 600;
			&:before{
				content: '积分 ';
				font-size: $uni-font-size-base;
				margin: 0 2rpx 0 8rpx;
			}
		}
	}
}
</style>
