<template>
	<view class="qwshop bt_bar">
		<view class="home_top top_bars">
			<view class="top_tit">
				<view class="tit">
					<text class="text">{{'amazon'||'-'}}</text>
					<!-- <uni-icons type="right" color="#fff"></uni-icons> -->
				</view>
				<!-- #ifndef MP -->
				<view class="icon">
					<uni-icons class="scan_icon" type="scan" color="#fff" size="20" @click="scan"></uni-icons>
					<uni-icons type="chat" color="#fff" size="24" @click="R.nav('/pages/chats/index')"></uni-icons>
				</view>
				<!-- #endif -->
				
			</view>
			
			<view class="home_search">
				<view class="search_block" @click="R.nav('/pages/search/index')">
					<uni-icons class="search_icon" type="search" size="20" color="#aaa"></uni-icons>
					<text>快来搜索您喜欢的商品 ~</text>
				</view>
			</view>
		</view>
		<view class="home_mid"></view>
		<view class="home_banner">
			<swiper class="swiper" circular :indicator-dots="true" :autoplay="true">
				<swiper-item v-for="(v,k) in data.banner||[]" key="k">
					<view class="swiper-item">
						<image :src="R.formatUrl(v.image)" mode="aspectFit"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="home_cat ct30">
			<view class="item" v-for="(v,k) in data.classList" :key="k" @click="R.nav('/pages/goods/index?class_id='+v.id+'&deep=1')">
				<image :src="R.formatUrl(v.thumb)" mode="aspectFill"></image>
				<text>{{v.name||'-'}}</text>
			</view>
		</view>
		
		<view class="home_cat_adv ct30" v-if="data.nav_bottom_adv.length>0">
			<image :src="R.formatUrl(data.nav_bottom_adv[0].image)" mode="aspectFill"></image>
		</view>
		
		<view class="home_o ct30">
			<view class="item" @click="R.nav('/pages/goods/seckills')">
				<view class="bgimg">
					<image src="/static/home/crontab01.png" mode=""></image>
				</view>
				<text class="t1">秒杀活动</text>
				<text class="t2">每日精选20款</text>
				<text class="t3">{{dayjs().format('HH')}}:00</text>
			</view>
			<view class="item">
				<view class="items" @click="R.nav('/pages/goods/collectives')">
					<view class="bgimg">
						<image src="/static/home/indextuan01.png" mode=""></image>
					</view>
					<text class="t1">拼团活动</text>
					<text class="t2">多人参与</text>
				</view>
				<view class="items" @click="R.nav('/pages/integrals/index')">
					<view class="bgimg">
						<image src="/static/home/indextuan02.png" mode=""></image>
					</view>
					<text class="t1">积分商城</text>
					<text class="t2">欢乐兑换</text>
				</view>
			</view>
		</view>
		
		<view class="home_goods ct30 mt30">
			<view class="goods_h3">
				<text>推荐精品</text>
				<text>HOT GOODS</text>
			</view>
			<z-paging ref="paging" :auto-scroll-to-top-when-reload="false" use-page-scroll v-model="data.list" @query="upCallback">
				<view class="goods_list">
					<view class="goods_item" v-for="(v,k) in data.list||[]" :key="k"  @click="R.nav('/pages/goods/info?id='+v.id)">
						<view class="goods_thumb">
							<image :src="R.formatUrl(v.goods_master_image)||''" mode="aspectFill" />
						</view>
						<view class="goods_tit">{{v.goods_name}}</view>
						<view class="goods_price" >
							<text>￥{{v.goods_price||'0.00'}}</text>
							<text>销量:{{v.goods_sale||'0.00'}}</text>
						</view>
					</view>
				</view>
			</z-paging>
		</view>
		
	</view>
</template>

<script setup>
	import { reactive, ref } from "vue";
	import {R} from '@/plugins/http.js' // 请求方式中间件
	import dayjs from "dayjs"
	const paging = ref(null)
	const data = reactive({
		params:{
			page:1,
			per_page:10,
		},
		list:[],
		webName:'-',
		classList:[],
		banner:[],
		nav_bottom_adv:[],
		notice:{},
	})

	const upCallback = (pageNo, pageSize)=>{
		data.params.page = pageNo // 页码, 默认从1开始
		data.params.per_page = pageSize // 页长, 默认每页10条
		uni.showLoading({title:'加载中...'})
		R.get('/Wap/home',data.params).then(res=>{
			if(res.code != 200) return paging.value.complete(false)
			if(data.params.page == 1){
				data.webName = res.data.webName
				data.classList = res.data.goods_class 
				data.notice = res.data.notice||{}
				data.banner = res.data.banner||[];
				data.nav_bottom_adv = res.data.nav_bottom_adv||[];
			}
			paging.value.complete(res.data.goods.data)
		}).finally(()=>{
			uni.hideLoading()
		})
	}
	
	const scan = ()=>{
		// #ifdef H5
		R.toast('Wap端无法使用扫码')
		// #endif
		// #ifdef APP
		uni.scanCode({
		    success: function (res) {
		        console.log('条码类型：' + res.scanType);
		        console.log('条码内容：' + res.result);
				uni.setStorageSync('inviter_id',res.result);
				return R.nav('/pages/auth/register?inviter_id='+res.result)
		    }
		})
		// #endif
	}
</script>

<style lang="scss" scoped>
.home_top{
	background: linear-gradient(to left,$primary,$gradient);
	width: 100%;
	height: 310rpx;
	position: absolute;
	z-index: 0;
	border-radius:0 0 10% 10%;
	.top_tit{
		color:#fff;
		padding: $block-padding;
		display: flex;
		justify-content: space-between;
		.tit{
			font-size: $uni-font-size-lg2;
			.text{
				margin-right: 40rpx;
			}
		}
		.icon{
			display: flex;
			.scan_icon{
				margin-right: 20rpx;
			}
		}
	}
	.home_search{
		padding: 0 $block-padding 0 $block-padding;
		.search_block{
			display: flex;
			align-items: center;
			width: 100%;
			height: 70rpx;
			background-color: #fff;
			border-radius: 20rpx;
			color:#aaa;
			box-sizing: border-box;
			padding: 10rpx 20rpx;
			font-size: $uni-font-size-base;
			.search_icon{
				margin-right: 12rpx;
				margin-top: 3rpx;
			}
		}
	}
}
.home_mid{
	height: calc(210rpx + var(--status-bar-height));
}
.home_banner{
	position: relative;
	margin:0 $block-margin;
	z-index: 1;
	height: 300rpx;
	border-radius: 30rpx;
	box-shadow: $block-shadow;
	.swiper,.swiper-item{
		background-color: #fff;
		height: 300rpx;
		border-radius: 30rpx;
	}
	image{
		width: 100%;
		height: 100%;
		border-radius: 30rpx;
	}
}
.home_cat{
	margin-top: 40rpx;
	display: flex;
	.item{
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: $uni-font-size-sm;
		image{
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			margin-bottom: 12rpx;
		}
	}
}
.home_cat_adv{
	height: 160rpx;
	margin-top: 30rpx;
	image{
		width: 100%;
		height: 100%;
		border-radius: $block-radius;
	}
}
.home_o{
	display: flex;
	margin-top: 30rpx;
	justify-content: space-between;
	.item{
		flex: 1;
		display: flex;
		flex-direction: column;
		border-radius: 15rpx;
		height: 300rpx;
		background-color: #fff;
		box-sizing: border-box;
		position: relative;
		&:first-child{
			.bgimg{
				width: 100%;
				height: 300rpx;
				position: absolute;
				top: 0;
				left: 0;
				image{
					width: 100%;
					height: 100%;
				}
			}
			// background-image: url("/static/home/crontab01.png");
			height: 300rpx;
			background-repeat: no-repeat;
			background-size: 100%;
			margin-right: 20rpx;
			padding: 20rpx;
		}
		&:last-child{
			background: none;
		}
		.items{
			background-color: #fff;
			border-radius: 15rpx;
			flex: 1;
			padding: 20rpx;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			position: relative;
			.bgimg{
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
				image{
					width: 100%;
					height: 100%;
				}
			}
			&:first-child{
				margin-bottom: 20rpx;
				// background-image: url('/static/home/indextuan01.png');
				background-repeat: no-repeat;
				background-size: 100% 100%;
			}
			&:last-child{
				// background-image: url('/static/home/indextuan02.png');
				background-repeat: no-repeat;
				background-size: 100% 100%;
			}
		}
		.t1{
			font-size: $uni-font-size-lg;
		}
		.t2{
			font-size: $uni-font-size-sm;
			color: $uni-text-color-grey;
			margin-top: 8rpx;
		}
		.t3{
			position: absolute;
			left:170rpx;
			top: 26rpx;
			font-size: $uni-font-size-sm;
			color: #fff;
			background-color: $primary;
			border-radius: 12rpx;
			padding: 2rpx 12rpx;
		}
		// &:last-child{
		// 	background: #fff;
		// }
	}
	
	
}
</style>
