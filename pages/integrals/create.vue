<template>
	<view class="qwshop">
		<view class="order_create ct30 pd30 br20">
			<view class="map">
				<uni-list :border="false">
				    <uni-list-item @click="choseAddress" clickable showArrow showExtraIcon :extra-icon="{type:'location-filled',size:'24',color:'#ea1f22'}" :title="data.address_id>0?data.address.receive_name+' '+data.address.receive_tel:'立即前往，添加收货地址'" :note="data.address_id>0?data.address.area_info+' '+data.address.address:''" ></uni-list-item>
				</uni-list>
			</view>
			<image class="mapbg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAu4AAAAFCAYAAAAaAWmiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Rjk3RjkzMjM2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Rjk3RjkzMjQ2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGOTdGOTMyMTY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGOTdGOTMyMjY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrEOZlQAAAiuSURBVHjazJp7bFvV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"></image>
			<view class="goods-section">
				<!-- 商品列表 -->
				<view class="g-item" >
					<image :src="R.formatUrl(data.goodsInfo.goods_master_image)||''"></image>
					<view class="right">
						<text class="title clamp">{{data.goodsInfo.goods_name||'-'}}</text>
						<text class="spec">-</text>
						<view class="price-box">
							<text class="price">积分 {{data.goodsInfo.goods_price}}</text>
							<text class="number">x {{data.buy_num}}</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 金额明细 -->
			<view class="yt-list">
				<view class="yt-list-cell">
					<text class="cell-tit clamp">商品积分</text>
					<text class="cell-tip">{{data.goodsInfo.goods_price||0}}</text>
				</view>
				
						
				<view class="yt-list-cell desc-cell"  style="border-bottom: none;">
					<text class="cell-tit clamp">备注</text>
					<input class="desc" type="text" v-model="data.remark" placeholder="请填写备注信息" placeholder-class="placeholder" />
				</view>
			</view>
			
			<!-- 底部 -->
			<view class="footer">
				<view class="price-content">
					<text>预计积分</text>
					<text class="price-tip">￥</text>
					<text class="price">{{data.total||0}}</text>
				</view>
				<text class="submit" @click="createOrder">提交订单</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { reactive } from "vue";
	import Base64 from 'base-64';
	import {onLoad} from "@dcloudio/uni-app"
	import {R} from '@/plugins/http.js' // 请求方式中间件
	const data = reactive({
		address_id:0,
		address:{},
		params:{},
		order:[],
		goodsInfo:{},
		isLoading:false,
		goodsId:0,
		buy_num:1,
		remark:'',
	})

	// 获取地址
	const getAddress = ()=>{
		R.get('/Wap/addresses/default/get').then(res=> {
			if(res.code == 200){
				data.address_id = res.data.id
				data.address = res.data
			}
		});
	}

	const choseAddress = ()=>{
		if(data.address_id>0){
			R.nav('/pages/users/addresses/index')
		}else{
			R.nav('/pages/users/addresses/edit')
		}
	}
	
	// 获取商品信息
	const goods = async ()=>{
		let res = await R.get('integrals/goods/'+data.goodsId)
		if(res.code && res.code == 200){
			data.goodsInfo = res.data
			data.total = res.data.goods_price * data.buy_num
		}
	}
	
	const createOrder = ()=>{
		if(!data.isLoading) R.toast('订单异常无法提交.')
		let params = {
			id:data.goodsId,
			buy_num:data.buy_num,
			address_id:data.address_id,
			remark:data.remark,
		}
		uni.showLoading({
			title:'加载中...'
		})
		
		R.post('/Wap/integrals/pay',params).then(res=> {
			if(res.code == 200){
				R.nav("/pages/integrals/success")
			}else{
				R.toast(res.msg)
			}
			uni.hideLoading()
			uni.$emit('integral_orders')
		})
	}
	
	onLoad((opt)=>{
		data.goodsId = opt.id
		data.buy_num = opt.buy_num||1
		getAddress()
		goods()
	})
	
	uni.$on('addresses',()=>{
		getAddress()
	})
</script>

<style lang="scss" scoped>
.order_create{
	background: #fff;
	.mapbg{
		height: 4rpx;
	}
	.goods-section {
		margin-top: 16rpx;
		background: #fff;
		padding-bottom: 1px;
	
		.g-item {
			display: flex;
			margin: 20rpx 30rpx;
	
			image {
				flex-shrink: 0;
				display: block;
				width: 140rpx;
				height: 140rpx;
				border-radius: 6rpx;
			}
	
			.right {
				flex: 1;
				padding-left: 24rpx;
				overflow: hidden;
			}
	
			.title {
				font-size: 30rpx;
				color: #333;
			}
	
			.spec {
				font-size: 26rpx;
				color: #909399;
			}
	
			.price-box {
				display: flex;
				align-items: center;
				font-size: 32rpx;
				color: #333;
				padding-top: 10rpx;
	
				.price {
					margin-bottom: 4rpx;
					color:#ea1f22;
				}
				.number{
					font-size: 26rpx;
					margin-left: 20rpx;
				}
			}
	
			.step-box {
				position: relative;
			}
		}
	}
	.yt-list {
		margin-top: 16rpx;
		background: #fff;
		
	}
	
	.yt-list-cell {
		display: flex;
		align-items: center;
		margin: 0rpx 30rpx 0rpx 40rpx;
		padding: 20rpx 0;
		line-height: 60rpx;
		position: relative;
		border-bottom: 1px solid #efefef;
		
		.cell-tit {
			flex: 1;
			font-size: 26rpx;
			margin-right: 10rpx;
		}
		.desc {
			flex: 1;
			font-size: 28rpx;
			color: #333;
			text-align: right;
		}
		.cell-tip {
			font-size: 26rpx;
			color: #333;
			
			&.disabled {
				color: #999;
			}
			
			&.active {
				color: $uni-color-error;
			}
			&.red{
				color: $uni-color-error;
			}
		}
	}
	.footer{
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 995;
		display: flex;
		align-items: center;
		width: 100%;
		height: 90rpx;
		justify-content: space-between;
		font-size: 30rpx;
		background-color: #fff;
		z-index: 998;
		box-shadow: 0 -1px 5px rgba(0,0,0,.1);
		.price-content{
			padding-left: 30rpx;
		}
		.price-tip{
			color: $uni-color-error;
			margin-left: 8rpx;
		}
		.price{
			font-size: 36rpx;
			color: $uni-color-error;
		}
		.submit{
			display:flex;
			align-items:center;
			justify-content: center;
			width: 280rpx;
			height: 100%;
			color: #fff;
			font-size: 32rpx;
			background-color: $primary;
		}
	}
}
</style>
