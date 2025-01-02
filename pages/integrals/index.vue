<template>
	<view class="qwshop bt_bar">
		<view class="self_top top_bars">
			<view class="top_tit">
				<view class="tit">
					<text class="text">积分商城</text>
					<uni-icons type="right" color="#fff"></uni-icons>
				</view>
				<view class="icon" @click="R.nav('',3)">
					<uni-icons class="scan_icon" type="undo-filled" color="#fff" size="20"></uni-icons>
					返回
				</view>
			</view>
			
			<view class="self_person ct30">
				<view class="person_item"  >
					<view class="avatar">
						<image :src="R.formatUrl(data.user.avatar)||'/static/self/self_avatar.png'" mode=""></image>
					</view>
					<view class="uinfo">
						<view class="t1">{{data.user.nickname||'点击登录'}}</view>
						<view class="t2" @click="checkUser">我的积分：{{data.user.integral||'0.00'}}</view>
					</view>
					<view class="integral_orders" v-if="data.user.nickname" ><text @click="R.nav('/pages/integrals/orders')">积分订单 ></text></view>
				</view>
				
			</view>
		</view>
		
		<view class="self_mid"></view>
		
		<view class="rnav ct30" >
			<scroll-view v-show="data.params.citem !=5 && data.params.citem != 6" style="height: 65rpx;" :show-scrollbar="false" scroll-x="true" >
				<view @click="choseItem({id:0})" :class="data.params.cid==0?'rnav_item ck':'rnav_item'" >
					<view class="tit">全部</view>
				</view>
				<view @click="choseItem(v)" :class="data.params.cid==v.id?'rnav_item ck':'rnav_item'" v-for="(v,k) in data.classes||[]" :key="k">
					<view class="tit">{{v.name}}</view>
				</view>
			</scroll-view>
		</view>
		
		<view class="home_goods ct30">
	
			<z-paging ref="paging" :auto-scroll-to-top-when-reload="false" use-page-scroll v-model="data.list" @query="upCallback">
				<view class="goods_list">
					<view class="goods_item" v-for="(v,k) in data.list||[]" :key="k"  @click="R.nav('/pages/integrals/info?id='+v.id)">
						<view class="goods_thumb">
							<image :src="R.formatUrl(v.goods_master_image)||''" mode="aspectFill" />
						</view>
						<view class="goods_tit">{{v.goods_name}}</view>
						<view class="goods_price" >
							<text class="t1">积分：{{v.goods_price||'0.00'}}</text>
							<text></text>
						</view>
						<view class="integralbtn" @click="buy(v.id)">兑换</view>
					</view>
				</view>
			</z-paging>
		</view>
	</view>
</template>

<script setup>
	import { reactive,ref } from "vue";
	import {onLoad,onShow} from "@dcloudio/uni-app"
	import Base64 from 'base-64'
	import {R} from '@/plugins/http.js' // 请求方式中间件
	const paging = ref(null)
	const data = reactive({
		params:{
			page:1,
			per_page:10,
			cid:0
		},
		classes:[],
		list:[],
		user:{},
	})
	const loadUser = async ()=>{
		let res = await R.get('/Wap/auth/info',{provider:'users'})
		if(res.code && res.code == 200) data.user = res.data||{}
	}
	
	const loadClasses = ()=>{
		R.get('/Wap/integrals/integral_classes').then(res=>{
			data.classes = res.data
		})
	}
	
	// 点击用户头像
	const checkUser = ()=>{
		if(R.isEmpty(data.user.id)) return R.nav('/pages/auth/login')
		return R.nav('/pages/users/wallet')
	}
	
	const choseItem = (e)=>{
		data.params.cid = e.id
		paging.value.reload()
	}
	
	const upCallback = (pageNo, pageSize)=>{
		data.params.page = pageNo // 页码, 默认从1开始
		data.params.per_page = pageSize // 页长, 默认每页10条
		let params = {...data.params}
		params.params = ''
		let baseObj = JSON.stringify(params);
		var basecode = Base64.encode(unescape(encodeURIComponent(baseObj)))
		data.params.params = basecode
		uni.showLoading({title:'加载中...'})
		R.get('/Wap/integrals',data.params).then(res=>{
			if(res.code != 200) return paging.value.complete(false)
			paging.value.complete(res.data.data)
		}).finally(()=>{
			uni.hideLoading()
		})
	}
	
	onLoad(()=>{
		loadClasses()
		loadUser()
	})
</script>

<style lang="scss" scoped>
.integralbtn{
	position: absolute;
	right: 0;
	bottom: 0rpx;
	font-size: 26rpx;
	color:#fff;
	background: $gradient;
	padding: 10rpx 20rpx;
	border-radius: 20rpx 0 20rpx 0;
	cursor: pointer;
}
.home_goods .goods_list .goods_item .goods_price .t1{
	color:$primary;
	font-size: 30rpx;
}
.icon{
	font-size: $uni-font-size-base;
	/* #ifdef MP-WEIXIN */
	margin-right: 180rpx;
	/* #endif */
}
.self_mid{
	/* #ifdef MP */
	height: calc(280rpx + var(--status-bar-height));
	/* #endif */ 
	/* #ifdef APP */
	height: calc(290rpx + var(--status-bar-height));
	/* #endif */ 
	/* #ifdef H5 */
	height: calc(280rpx + var(--status-bar-height));
	padding-top: var(--status-bar-height);
	/* #endif */
}
.self_top{
	background: linear-gradient(to left,$primary,$gradient);
	width: 100%;
	height: 210rpx;
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
		
	}
	.self_person{
		background: #fff;
		border-radius: $block-radius;
		padding: $block-padding;
		box-sizing: border-box;
		.person_item{
			display: flex;
			flex-direction: row;
			.avatar{
				width: 110rpx;
				height: 110rpx;
				margin-right: 30rpx;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.uinfo{
				font-size: $uni-font-size-base;
				.t1{
					margin-top: 20rpx;
				}
				.t2{
					font-size: $uni-font-size-sm;
					color:#999;
					margin-top: 8rpx;
				}
			}
			.integral_orders{
				flex: 1;
				font-size: 24rpx;
				text-align: right;
				padding-top: 40rpx;
				color: #999;
			}
		}
	}
}
.rnav{
	margin-top: 20rpx;
	white-space: nowrap;
	width: 100%;
	.rnav_item{
		cursor: pointer;
		display: inline-block;
		flex-direction: column;
		text-align: center;
		box-sizing: border-box;
		white-space: nowrap;
		.tit{
			font-size: $uni-font-size-sm;
			margin-top: 5rpx;
			padding:10rpx 20rpx;
			margin-bottom: 10rpx;
		}
		&.ck{
			.tit{
				background: $primary;
				color:#fff;
				border-radius: 15rpx;
			}
		}
	}
}
</style>
