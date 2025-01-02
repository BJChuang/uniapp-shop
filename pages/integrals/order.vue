<template>
	<view class="order_all_info ct30 br20">
		<view class="pdbg">
			<view class="map">
				<uni-list :border="false">
					<uni-list-item @click="R.nav('/pages/orders/express?id='+data.id+'&integral=1')" clickable showArrow showExtraIcon :extra-icon="{type:'paperplane-filled',size:'22',color:'#00c842'}" :title="data.delivery_info.content" :note="data.delivery_info.time||''" ></uni-list-item>
				    <uni-list-item  showExtraIcon :extra-icon="{type:'location-filled',size:'24',color:'#ea1f22'}" :title="data.orderInfo.receive_name+' '+data.orderInfo.receive_tel" :note="data.orderInfo.receive_area||'-'" ></uni-list-item>
				</uni-list>
			</view>
			<image class="mapbg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAu4AAAAFCAYAAAAaAWmiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Rjk3RjkzMjM2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Rjk3RjkzMjQ2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGOTdGOTMyMTY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGOTdGOTMyMjY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrEOZlQAAAiuSURBVHjazJp7bFvV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"></image>
			<view class="order_item">
				<view class="order-item" >
					<view 
						class="goods-box-single"
						v-for="(goodsItem, goodsIndex) in data.orderInfo.integral_order_goods" :key="goodsIndex"
					>
						<image class="goods-img" :src="R.formatUrl(goodsItem.goods_image)||''" mode="aspectFill"></image>
						<view class="right">
							<text class="title clamp">{{goodsItem.goods_name||'-'}}</text>
							<text class="attr-box">{{goodsItem.sku_name||'-'}}  x {{goodsItem.buy_num||'1'}}</text>
							<text class="price">{{goodsItem.goods_price||'00.00'}}</text>
						</view>
					</view>
					
					
					<view class="price-box">
						共
						<text class="num">{{data.orderInfo.integral_order_goods.length||0}}</text>
						种商品 实付款
						<text class="price">{{data.orderInfo.total_price||'0.00'}}</text> <text style="margin-left: 10rpx;">（{{data.orderInfo.freight_money>0?('运费:'+data.orderInfo.freight_money):'免运费'}}）</text>
					</view>
				</view>
			</view>
			<view class="order_item times">
				<view class="list_item"><text>订单编号：</text>{{data.orderInfo.order_no||'-'}}</view>
				<view class="list_item"><text>支付方式：</text>积分支付</view>
				<view class="list_item"><text>物流单号：</text>{{data.orderInfo.delivery_no||'-'}}</view>
				<view class="list_item"><text>下单时间：</text>{{data.orderInfo.created_at||'-'}}</view>
				<view class="list_item"><text>支付时间：</text>{{data.orderInfo.pay_time||'-'}}</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { reactive } from 'vue'
	import {R} from '@/plugins/http.js' // 请求方式中间件
	import { onLoad } from "@dcloudio/uni-app"
	
	const data = reactive({
		id:0,
		orderInfo:{
			integral_order_goods:[],
			receive_name:'',
			receive_tel:''
		},
		order_goods:[],
		delivery_list:[],
		delivery_info:{content:'暂未发货'},
	})
	
	const loadData = ()=>{
		R.get('/Wap/integral/orders/'+data.id).then(res=>{
			data.orderInfo = res.data;
			data.order_goods = res.data.order_goods
			if(res.data.delivery_list && res.data.delivery_list.status == undefined){
				data.delivery_list = res.data.delivery_list;
				if(data.delivery_list.length>0){
					data.delivery_info.content = data.delivery_list[0].context;
					data.delivery_info.time = data.delivery_list[0].time;
				}else{
					data.delivery_info.content = '暂未发货';
				}
			}
		})
	}
	onLoad((opt)=>{
		data.id = opt.id;
		loadData()
	})
	
</script>

<style lang="scss" scoped>
.order_all_info{
	box-sizing: border-box;
	background: #fff;
	border-radius: 20rpx;
	padding: 20rpx;
	
	.mapbg {
		display: block;
		width: 100%;
		height: 5rpx;
	}
	.order_item{
		margin-top: 20rpx;
		&:last-child{
			margin-top: 0;
		}
		&.times{
			padding: 30rpx 40rpx;
		}
		.list_item{
			font-size: $uni-font-size-base;
			color:#777;
			line-height: 50rpx;
			text{
				margin-right: 20rpx;
			}
		}
	}
	.order-item{
		display: flex;
		flex-direction: column;
		padding:0 30rpx;
		background: #fff;
		margin-top: 16rpx;
		/* 单条商品 */
		.goods-box-single{
			display: flex;
			padding: 20rpx 0;
			border-bottom: 1px solid #efefef;
			.goods-img{
				display: block;
				width: 120rpx;
				height: 120rpx;
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
					line-height: 36rpx;
				}
				.attr-box{
					font-size: calc($uni-font-size-sm + 2rpx);
					color: #999;
					padding: 10rpx 0rpx;
				}
				.price{
					font-size: 28rpx + 2rpx;
					color: $uni-color-error;
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
			justify-content: flex-end;
			align-items: baseline;
			padding: 20rpx 0rpx;
			font-size: calc($uni-font-size-sm + 2rpx);
			border-bottom: 1px solid #efefef;
			color: #999;
			.num{
				margin: 0 8rpx;
				color: #333;
			}
			.price{
				font-size: $uni-font-size-lg;
				color: $uni-color-error;
				&:before{
					content: '积分';
					font-size: $uni-font-size-sm;
					margin: 0 2rpx 0 8rpx;
				}
			}
		}
	}
}
</style>
