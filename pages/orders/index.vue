<template>
	<view class="qwshop">
		<view class="order_index">
			<view class="tab_nav ct30 br20">
				<text :class="data.params.order_status==-1?'item current':'item'" @click="currentClick(-1)">全部订单</text>
				<text :class="data.params.order_status==2?'item current':'item'" @click="currentClick(2)">待发订单</text>
				<text :class="data.params.order_status==5?'item current':'item'" @click="currentClick(5)">派送中订单</text>
				<text :class="data.params.order_status==6?'item current':'item'" @click="currentClick(6)">已完成</text>
			</view>
			<view class="order_index_list">
				<z-paging ref="paging" use-page-scroll v-model="data.list" @query="upCallback">
					<scroll-view scroll-y="true" >
						<swiper :style="'height:'+data.swiperHeight+'px'" @change="swipChange" :current="getCur(data.params.order_status)" class="swiper-box">
							<swiper-item v-for="v in 4" :key="v">
								<view class="item_test_list">
									<view
										v-for="(item,index) in data.list" :key="index"
										class="order-item" @click="orderInfo(item)"
									>
										<view class="i-top">
											<view class="g-header">
												<!-- <image class="logo" :src="R.formatUrl(item.store_logo)||''"></image> -->
												
												<text class="name">{{item.order_no||'-'}}</text>
												<!-- <uni-icons style="margin-left: 15rpx;" type="arrowright" color="#333" size="12"></uni-icons> -->
											</view>
											<text class="state" v-if="item.order_status==0">取消</text>
											<text class="state" v-if="item.order_status==1">等待支付</text>
											<text class="state" v-if="item.order_status==2">等待发货</text>
											<text class="state" v-if="item.order_status==3">确认收货</text>
											<text class="state" v-if="item.order_status==4">等待评论</text>
											<text class="state" v-if="item.order_status==5">订单派送中</text>
											<text class="state" v-if="item.order_status==6">订单完成</text>
										</view>
										
											<!-- <image class="goods-img" :src="R.formatUrl(item.order_image)||''" mode="aspectFill"></image> -->
										<view class="goods-box-single">
											<!-- <image class="goods-img" :src="R.formatUrl(goodsItem.goods_image)||''" mode="aspectFill"></image> -->
											<view class="right">
												<text class="title clamp">{{item.order_name||'-'}}</text>
												<!-- <text class="attr-box">规格:{{goodsItem.sku_name||' -'}}  x {{goodsItem.buy_num||'1'}}</text>
												<text class="price">{{goodsItem.goods_price||'00.00'}}</text> -->
											</view>
											<!-- <text v-if="item.order_status==5" style="color: #007afffc;">物流配送中</text> -->
											
										</view>
										
										<view class="price-box">
											<view>
												进货价
												<text class="price">{{item.order_price||'0.00'}}</text>
											</view>
											<view>
												数量
												<text class="">{{item.order_num}}</text>
											</view>
											<view class="action-box b-t">
												<view>
													利润
													<text class="price">{{item.profile_total||'0.00'}}</text>
												</view>
												<!-- <button class="action-btn" v-if="item.order_status==2"  @click.stop="edit_order_status(item.id)">确认付款</button> -->
												<!-- <button class="action-btn pay" v-if="item.order_status==1" @click="pay_order(item.id)">立即支付</button> -->
												<!-- <button class="action-btn recom" v-if="item.order_status>2" @click="R.nav('/pages/order/info?id='+item.id)">查看物流</button> -->
												<!-- <button class="action-btn pay" v-if="item.order_status==3" @click="edit_order_status(item.id,4)">确定收货</button> -->
												<!-- <button class="action-btn recom" v-if="item.order_status>1 && item.order_status<4 && item.order_status !=5 && item.refund_status!=2" @click="R.nav('/pages/refunds/index?id='+item.id)">申请售后</button> -->
												<!-- <button class="action-btn " v-if="item.order_status==5 || item.refund_status==2" @click="R.nav('/pages/refunds/form?id='+item.id)">查看售后</button> -->
												<!-- <button class="action-btn pay" v-if="item.order_status==4" @click="R.nav('/pages/orders/comment?id='+item.id)">前往评论</button> -->
											</view>
										</view>
										
									</view>
								</view>
							</swiper-item>
						</swiper>
					</scroll-view>
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
			total:0,
			last_page:'1',
			isWith:"store,user,refund",
			store_id:'',
			order_status:""
		},
		list:[],
		swiperHeight:0,
	})
	const orderStatus = ref()
	const refundStatus = ref()
	const currentClick = (e,a)=>{
		data.params.order_status = e;
		

		
		paging.value.reload();
	}
	const swipChange = (e)=>{
		switch(e.detail.current){
			case 0:
				currentClick(-1);
			break;
			case 1:
				currentClick(2);
			break;
			case 2:
				currentClick(5);
			break;
			case 3:
				currentClick(6);
			break;
			
			break;
		}
	}
	const getCur = (e)=>{
		let cur = 0;
		switch(e){
			case -1:
				cur = 0;
			break;
			case 1:
				cur = 2;
			break;
			case 3:
				cur = 5;
			break;
			case 4:
				cur = 6;
			break;
			
			break;
		}
		return cur;
	}
	const getElementHeight = (element)=> {
		setTimeout(()=>{
			let query = uni.createSelectorQuery()
			query.select(element).boundingClientRect()
			query.exec((res) => {
				if (!res) {//如果没获取到，再调一次
					getElementHeight()
				}else {
					data.swiperHeight = res[0].height
				}
			})
		},100)
	}
	const pay_order = (order_id)=>{
		let baseObj = JSON.stringify({order_id:[order_id]});
		var basecode = Base64.encode(unescape(encodeURIComponent(baseObj)))
		R.nav("/pages/orders/pay?params="+basecode);
	}
	const edit_order_status = (id,order_status=0)=>{
		R.put('orders/edit_order_status',{id:id,order_status:order_status}).then(res=>{
			paging.value.refresh()
		})
	}
	const orderInfo = (item)=>{
		uni.navigateTo({
			url:'/pages/orders/info?id='+item.order_no+'&storeId='+item.store_id
		})
	}
	
	const loadData = (pageNo,pageSize)=>{
		data.params.page = pageNo // 页码, 默认从1开始
		data.params.per_page = pageSize // 页长, 默认每页10条
		uni.showLoading({
			title:'加载中...'
		})
		let  params = JSON.parse(JSON.stringify(data.params))
	
		R.get('/Wap/orders/getStoreOrdersList',params).then(res=>{
			if(res.code != 200) return paging.value.complete(false)
			
			paging.value.complete(res.data.data||[])
			console.log(data.list)
			getElementHeight('.item_test_list')
		}).finally(()=>{
			uni.hideLoading()
		})
	}
	
	const upCallback =  (pageNo, pageSize)=>{
		loadData(pageNo, pageSize)
	}
	
	
	onLoad((opt)=>{
		if(!R.isEmpty(opt.order_status)){
			setTimeout(()=>{
				// if(opt.order_status==1){
				// 	currentClick('');
				// }
				// if(opt.order_status==2){
				// 	currentClick(2);
				// }
				// if(opt.order_status==3){
				// 	currentClick(5,0);
				// }
				// if(opt.order_status==4){
				// 	currentClick(5,1);
				// }
				currentClick(opt.order_status);
			},500)
		}
		if(opt.storeId){
			data.params.store_id = opt.storeId
		}
		uni.$on('orders',()=>{
			paging.value.reload()
		})
	})
	
</script>

<style lang="scss" scoped>
.tab_nav{
	display: flex;
	background: #fff;
	font-size: $uni-font-size-base;
	padding: 0 20rpx;
	.item{
		flex: 1;
		text-align: center;
		border-bottom: 2px solid #fff;
		padding: 20rpx 0;
		margin:0 5rpx;
		&.current{
			border-color: $primary;
		}
	}
}
.order_index_list{
	padding-top: 10px; 
	height: 100%;
	.swiper-box{
		// height: calc(100% - 41px);
	}
}
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
			
		.logo {
			display: block;
			width: 34rpx;
			height: 34rpx;
			border-radius: 3px; 
		}
			
		.name {
			font-size: 30rpx;
			// margin-left: 24rpx;
		}
		.time{
			flex: 1;
		}
		.state{
			color: $uni-color-error;
		}
		.del-btn{
			padding: 10rpx 0 10rpx 36rpx;
			font-size: $uni-font-size-lg;
			color: #999;
			position: relative;
			&:after{
				content: '';
				width: 0;
				height: 30rpx;
				border-left: 1px solid #333;
				position: absolute;
				left: 20rpx;
				top: 50%;
				transform: translateY(-50%);
			}
		}
	}
	/* 多条商品 */
	.goods-box{
		height: 160rpx;
		padding: 20rpx 0;
		white-space: nowrap;
		border-bottom: 1px solid #F4F5F9;
		.goods-item{
			width: 120rpx;
			height: 120rpx;
			display: inline-block;
			margin-right: 24rpx;
		}
		.goods-img{
			display: block;
			width: 100%;
			height: 100%;
			background-color: #efefef;
			border-radius: 6rpx;
		}
	}
	/* 单条商品 */
	.goods-box-single{
		display: flex;
		padding: 20rpx 0;
		border-bottom: 1px solid #F4F5F9;
		.goods-img{
			display: block;
			width: 160rpx;
			height: 160rpx;
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
				// font-weight: 600;
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
					content: '￥';
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
				content: '￥';
				font-size: $uni-font-size-sm;
				margin: 0 2rpx 0 8rpx;
			}
		}
	}
	.action-box{
		display: flex;
		justify-content: flex-end;
		align-items: center;
		height: 100rpx;
		position: relative;
		// padding-right: 30rpx;
	}
	.action-btn{
		width: 160rpx;
		height: 60rpx;
		margin: 0;
		margin-left: 24rpx;
		padding: 0;
		text-align: center;
		line-height: 60rpx;
		font-size: calc($uni-font-size-sm + 2rpx);
		color: #333;
		background: #fff;
		&:after{
		}
		&.pay{
			color:#fff;
			background-color: $primary;
		}
		&.recom{
			background: #fff9f9;
			color: $uni-color-error;
			&:after{
				border-color: #f7bcc8;
			}
		}
	}
}
</style>
