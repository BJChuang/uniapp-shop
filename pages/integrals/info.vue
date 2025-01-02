<template>
	<view class="qwshop  ">
		<view class="goods_swipe_image">
			<view class="back_icon" @click="R.nav('',3)">
				<uni-icons type="back" color="#fff" ></uni-icons>
			</view>
			<swiper style="height: 650rpx;" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
				<swiper-item v-for="(v,k) in data.goodsInfo.goods_images||[]" :key="k">
					<view class="swiper-item"><image :src="R.formatUrl(v)" mode="aspectFill"></image></view>
				</swiper-item>
			</swiper>
		</view>
		
		<view class="goods_title">
			<view class="goods_name">{{data.goodsInfo.goods_name||'加载中...'}}</view>
			<view class="goods_desc">{{data.goodsInfo.goods_subname||'加载中...'}}</view>
			<view class="goods_price">
				<text class="price">积分 {{data.goodsInfo.goods_price||'0.00'}}</text>
				<text class="market_price">￥{{data.goodsInfo['goods_market_price']||'0.00'}}</text>
			</view>
			<view class="stock_num">
				<text class="sale">销量：{{data.goodsInfo.goode_sale||'0'}}</text>
				<text class="sale">库存：{{data.goodsInfo.goods_stock||'0'}}</text>
			</view>
		</view>
		
		<!-- 属性旋转 -->
		<view class="info_attr">
			<uni-list :border="false">
				<uni-list-item @click="toggleSpec()" clickable title="规格属性" :rightText="'数量：'+(data.buy_num||0) " :showArrow="true"></uni-list-item>
			</uni-list>
		</view>
		
		<!-- 详情 -->
		<view class="content">
			<view class="c_title">图文详情</view>
			<view class="m_content" v-html="R.editorHandle(data.goodsInfo.goods_content)||''"></view>
		</view>
		
		<!-- 底部购物按钮 -->
		<uni-goods-nav class="goods-carts" :fill="true" :options="null" :button-group="goodsNavBtn" @buttonClick="buttonClick" />
		
		<!-- 规格-模态层弹窗 :class="specClass" -->
		<view class="popup spec" :class="data.specClass" @click="toggleSpec" >
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<view class="a-t">
					<image :src="R.formatUrl(data.goodsInfo.goods_images_thumb_150)?(R.formatUrl(data.goodsInfo.goods_images_thumb_150[0])||''):''"></image>
					<view class="right">
						<text class="price">积分 {{data.goodsInfo['goods_price']||'0.00'}}</text>
						<text class="stock">库存：{{data.goodsInfo['goods_stock']||'0'}}件</text>
					</view>
				</view>
				<!-- 数量 -->
				<view class="attr-list">
					<text style="margin-bottom: 20rpx;">购买数量</text>
					<uni-number-box @change="buyNumChange" :min="1"></uni-number-box>
				</view>
				<button class="btn" @click="buyCom">完成</button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { reactive } from "vue";
	import { onLoad } from "@dcloudio/uni-app";
	import Base64 from 'base-64';
	import {R} from '@/plugins/http.js' // 请求方式中间件
	const goodsNavOptions = reactive([
	
	])
	const goodsNavBtn = reactive([
		{
			text: '立即购买',
			backgroundColor: 'linear-gradient(to left, #ef464f, #ff3c46)',
			color: '#fff'
		}
	])
	const data = reactive({
		goodsId:0,
		buy_num:1,
		specClass:'none',
		goodsInfo:{},
	})

	// 页面加载
	onLoad(opt=>{
		data.goodsId = opt.id||0
		goods()
	})

	// 打开规格属性
	const toggleSpec = ()=>{
		if(data.specClass === 'show'){
			data.specClass = 'hide'
			setTimeout(() => {
				data.specClass = 'none'
			}, 250)
		}else if(data.specClass === 'none'){
			data.specClass = 'show'
		}
	}
	
	const buttonClick = (e)=>{
		toggleSpec()
	}
	
	const stopPrevent = ()=>{}
	
	const buyNumChange = (e)=> data.buy_num = e
	
	// 完成选择前往
	const buyCom = ()=>{
		toggleSpec()
		return buy()
	}

	// 获取商品信息
	const goods = async ()=>{
		let res = await R.get('/Wap/integrals/goods/'+data.goodsId)
		if(res.code && res.code == 200){
			data.goodsInfo = res.data
		}
	}

	// 直接购买
	const buy = async ()=>{
		R.nav('/pages/integrals/create?id='+data.goodsId+'&buy_num='+data.buy_num)
	}
</script>

<style lang="scss" scoped>
.goods_swipe_image{
	position: relative;
	height: 650rpx;
	width: 100%;
	.swiper-item{
		width: 100%;
		height: 650rpx;
		image{
			width: 100%;
			height: 650rpx;
			background-color: #ccc;
		}
	}
	
}
.goods_title{
	background: #fff;padding: 30rpx;
	.stock_num{
		display: flex;margin-top: 30rpx;
		.sale{font-size: $uni-font-size-sm;color:#aaa;flex:1;}
	}
	.goods_name{font-weight: bold;margin-bottom: 10rpx;line-height: 55rpx;}
	.goods_desc{font-size: $uni-font-size-base;color:#aaa}
	.goods_price{
		margin-top: 20rpx;
		.price{color:$uni-color-error;font-size: 40rpx;}
		.market_price{color:#aaa;font-size:$uni-font-size-base;text-decoration: line-through;margin-left: 10rpx;}
		.tip{background: $uni-color-error;color:#fff;border-radius: 10rpx;margin-left: 30rpx;padding: 0 15rpx;font-size: $uni-font-size-sm;}
	}
}
.goods-carts {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	// flex-direction: column;
	position: fixed;
	left: 0;
	right: 0;
	/* #ifdef H5 */
	left: var(--window-left);
	right: var(--window-right);
	/* #endif */
	bottom: 0;
}
.info_attr{
	margin-top: 20rpx;
	.yhq{font-size: 28rpx;color:$uni-color-error;}
	.yhq2{font-size: 24rpx;color:$uni-color-error;}
	.yhqicon{
		color:#fff;
		background: #f85e52;
		font-size: 12rpx;
		border-radius: 4rpx;
		padding: 0 6rpx;
		margin-right: 10rpx;
	} 
	.yhqlq{
		font-size: 24rpx;color:#999;
	}
}
.comment{
	background: #fff;
	margin-top: 1px;
	.comment_content{
		display: flex;
		padding:20rpx 30rpx;
		.comment_info{
			flex: 1;
			font-size: $uni-font-size-base;
			.nickname{margin-bottom: 10rpx;}
			.desc{margin-bottom: 20rpx;color:#666}
			.img{margin-bottom: 20rpx;image{margin-right: 10rpx;background: #eee;width: 130rpx;height: 130rpx;border-radius: 10rpx;}}
			.other{color:#999;font-size: $uni-font-size-sm;}
		}
		.avatar{width: 90rpx;height:90rpx;background: #eee;border-radius: 50%;flex:0 0 90rpx;margin-right: 20rpx;image{width: 90rpx;height: 90rpx;}}
		&:after{
			content:'';clear: both;display: block;
		}
	}
}
.kfrp{
	font-size: 24rpx;
	margin-top: 15rpx;
	padding-top: 15rpx;
	color:rgb(127, 96, 68);
	border-top: 1px solid #efefef;
}
.content{
	background: #fff;
	margin-top: 20rpx;
	padding: 30rpx 30rpx 160rpx 30rpx;
	.c_title{text-align: center;border-bottom: 1px solid #f1f1f1;padding-bottom: 30rpx;margin-bottom: 30rpx;}
}

/*  弹出层 */
.popup {
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	z-index: 99;
	
	&.show {
		display: block;
		.mask{
			animation: showPopup 0.2s linear both;
		}
		.layer {
			animation: showLayer 0.2s linear both;
		}
	}
	&.hide {
		.mask{
			animation: hidePopup 0.2s linear both;
		}
		.layer {
			animation: hideLayer 0.2s linear both;
		}
	}
	&.none {
		display: none;
	}
	.mask{
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		background-color: rgba(0, 0, 0, 0.4);
	}
	.layer {
		position: fixed;
		z-index: 99;
		bottom: 0;
		width: 100%;
		min-height: 40rpx;
		border-radius: 10rpx 10rpx 0 0;
		background-color: #fff;
		.btn{
			height: 76rpx;
			line-height: 76rpx;
			border-radius: 12rpx;
			background:  linear-gradient(to left,$primary 0%,$gradient 80%);
			font-size: 28rpx + 2rpx;
			color: #fff;
			margin: 30rpx auto 20rpx;
		}
	}
	@keyframes showPopup {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	@keyframes hidePopup {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
	@keyframes showLayer {
		0% {
			transform: translateY(120%);
		}
		100% {
			transform: translateY(0%);
		}
	}
	@keyframes hideLayer {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(120%);
		}
	}
}
/* 规格选择弹窗 */
.attr-content{
	padding: 10rpx 30rpx;
	box-sizing: border-box;
	.a-t{
		display: flex;
		image{
			width: 170rpx;
			height: 170rpx;
			flex-shrink: 0;
			margin-top: -40rpx;
			border-radius: 8rpx;
			background-color: #ccc;
		}
		.right{
			display: flex;
			flex-direction: column;
			padding-left: 24rpx;
			font-size: calc($uni-font-size-sm + 2rpx);
			color: #606266;
			line-height: 42rpx;
			.price{
				font-size: $uni-font-size-lg;
				color: $uni-color-error;
				margin-bottom: 10rpx;
			}
			.selected-text{
				margin-right: 10rpx;
			}
		}
	}
	.attr-list{
		display: flex;
		flex-direction: column;
		font-size: 30rpx;
		color: #606266;
		padding-top: 30rpx;
		padding-left: 10rpx;
	}
	.item-list{
		padding: 20rpx 0 0;
		display: flex;
		flex-wrap: wrap;
		text{
			display: flex;
			align-items: center;
			justify-content: center;
			background: #eee;
			margin-right: 20rpx;
			margin-bottom: 20rpx;
			border-radius: 20rpx;
			min-width: 60rpx;
			height: 50rpx;
			padding: 0 20rpx;
			font-size: $uni-font-size-sm;
			color: #333;
		}
		.selected{
			background: $primary;
			color: #fff;
		}
	}
}
</style>
