<template>
	<view class="qwshop bt_bar">
		<view class="self_top top_bars">
			<view class="top_tit">
				<view class="tit">
					<text class="text">个人中心</text>
					<!-- <uni-icons type="right" color="#fff"></uni-icons> -->
				</view>
				<!-- #ifndef MP -->
				<!-- <view class="icon">
					<uni-icons class="scan_icon" type="scan" color="#fff" size="20" @click="scan"></uni-icons>
					<uni-icons type="chat" color="#fff" size="24" @click="R.nav('/pages/chats/index')"></uni-icons>
				</view> -->
				<!-- #endif -->
			</view>
			
			<view class="self_person ct30">
				<view class="person_item" @click="checkUser" >
					<view class="avatar">
						<image :src="R.formatUrl(data.user.avatar)||'/static/self/self_avatar.png'" mode=""></image>
					</view>
					<view class="uinfo">
						<view class="t1">{{data.user.nickname||'点击登录'}}</view>
						<view class="t2">邀请码：{{data.user.my_invalid_code }}</view>
					</view>
				</view>
				<view class="money_block">
					<view class="item">
						<text class="t1">￥{{data.user.money||'0.00'}}</text>
						<text class="t2">商户余额</text>
					</view>
					<!-- <view class="item">
						<text class="t1">￥{{data.user.integral||'0.00'}}</text>
						<text class="t2">商户积分</text>
					</view> -->
					<view class="item">
						<text class="t1">￥{{data.user.frozen_money||'0.00'}}</text>
						<text class="t2">冻结资金</text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="self_mid"></view>
		
		<!-- <view class="self_integral" @click="R.nav('/pages/integrals/index')">
			<view class="imgs">
				<image src="../../static/self/jifen_1.png" mode=""></image>
			</view>
			<view class="t1">积分商城</view>
			<view class="t2_item">
				<view class="t2">免费积分兑换产品</view>
				<uni-icons type="right" color="#b7a893"></uni-icons>
			</view>
		</view> -->
		
		<view class="self_order ct30 pd30 br20">
			<view class="title">
				<view class="tname">我的订单</view>
				<view class="sname" @click="R.nav('/pages/orders/index?order_status=-1&storeId='+store.id)">
					<text class="subname">查看更多</text>
					<uni-icons type="right" size="12"></uni-icons>
				</view>
			</view>
			<view class="order_block">
				<view class="item" @click="R.nav('/pages/orders/index?order_status=-1&storeId='+store.id)">
					<view class="imgs">
						<text class="iconfont qworder"></text>
					</view>
					<view class="t1">全部</view>
				</view>
				<view class="item" @click="R.nav('/pages/orders/index?order_status=2&storeId='+store.id)">
					<view class="imgs">
						<text class="iconfont qwshijian"></text>
					</view>
					<view class="t1">待发货</view>
					<uni-badge class="uni-badge-left-margin" :text="orderNum" />

				</view>
				<view class="item" @click="R.nav('/pages/orders/index?order_status=5&storeId='+store.id)">
					<view class="imgs">
						<text class="iconfont qwxiangzi"></text>
					</view>
					<view class="t1">派送中</view>
				</view>
				<view class="item" @click="R.nav('/pages/orders/index?order_status=6&storeId='+store.id)">
					<view class="imgs">
						<text class="iconfont qwdunpai"></text>
					</view>
					<view class="t1">已完成</view>
				</view>
			</view>
		</view>
		
		<view class="self_list ct30 pd10 br20">
			<uni-list :border="false">
				<uni-list-item showExtraIcon :extraIcon="{type:'wallet-filled',size:22,color:'#e11f27'}" title="我的钱包" link to="/pages/users/wallet"  ></uni-list-item>
				<!-- <uni-list-item showExtraIcon :extraIcon="{type:'location-filled',size:22,color:'#009cff'}" title="地址管理" link to="/pages/users/addresses/index"  ></uni-list-item> -->
				<!-- <uni-list-item showExtraIcon :extraIcon="{type:'calendar-filled',size:22,color:'#8717f9'}" title="优惠券" link to="/pages/users/coupons/index"  ></uni-list-item> -->
				<!-- <uni-list-item showExtraIcon :extraIcon="{type:'pyq',size:22,color:'#50bc89'}" title="分销分享" link to="/pages/users/inviters/index" rightText="邀请好友赢积分" ></uni-list-item> -->
				<uni-list-item showExtraIcon :extraIcon="{type:'star-filled',size:22,color:'#ff9000'}" title="我的收藏" link to="/pages/users/favorites/index"  ></uni-list-item>
				<uni-list-item showExtraIcon :extraIcon="{type:'shop-filled',size:22,color:'#1499ff'}" link :title="data.user.is_seller==4?'商户中心':'商户入驻'" @click="goShop"></uni-list-item>
			</uni-list>
		</view>
		<view class="self_list mb30 ct30 pd10 br20">
			<uni-list :border="false">
				<uni-list-item showExtraIcon :extraIcon="{type:'gear-filled',size:22,color:'#000000'}" title="设置中心" link to="/pages/users/settings/index"  ></uni-list-item>
			</uni-list>
		</view>
	</view>
</template>

<script setup>
	import { reactive, ref } from "vue";
	import {onLoad,onShow} from "@dcloudio/uni-app"
	import {R} from '@/plugins/http.js' // 请求方式中间件
	const data = reactive({user:{}})
	const store = ref({id:""})
	const orderNum = ref(0)
	const loadUser = async ()=>{
		let res = await R.get('/Wap/auth/info',{provider:'users'})
		if(res.code && res.code == 200) data.user = res.data||{}
		let rs = await R.get("/Wap/store",{})
		store.value = rs.data
		getOrderNumber()
	}
	
	// 点击用户头像
	const checkUser = ()=>{
		if(R.isEmpty(data.user.id)) return R.nav('/pages/auth/login')
		return R.nav('/pages/users/wallet')
	}
	const goShop = ()=>{
		
		if(store.value.store_verify == 2){
			uni.showModal({
				title:'提示',
				content:'审核中',
				showCancel:false
			})
			return false
		}else if(store.value.store_verify == 4){
			R.nav('/pages/store/index?id='+store.value.id)
		}else if(store.value.store_verify == 3){
			uni.showModal({
				title:'提示',
				content:'审核已被拒绝,请核对后重新提交',
				success: (ret) => {
					if(ret.confirm){
						R.nav('/pages/store/join?state=1')
					}
				}
				
			})
		}else{
			R.nav('/pages/store/join')
		}
		
		
		
	}
	onShow(()=>{
		loadUser()
	})
	
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
	// 获取代发货订单数量
	const getOrderNumber=()=>{
		R.get('/Wap/orders/getStoreOrdersList',{page:1,per_page:10,order_status:2,store_id:store.value.id,isWith:'store,user,refund'}).then(res=>{
			
			console.log(res.data.total)
			orderNum.value = res.data.total
		}).finally(()=>{
			uni.hideLoading()
		})
	}
	onLoad((opt)=>{
		uni.$on('users',()=>{
			loadUser()
		})
		
	})
	
</script>

<style lang="scss" scoped>
.self_list{
	background: #fff;
	margin-top: 30rpx;
	&.mb30{
		margin-bottom: 30rpx;
	}
}
.self_order{
	background: #fff;
	margin-top: 30rpx;
	.title{
		border-bottom: 1px solid #efefef;
		padding-bottom: 20rpx;
		display: flex;
		justify-content: space-between;
		.subname{
			font-size: $uni-font-size-sm;
			color:#999;
		}
	}
	.order_block{
		display: flex;
		margin-top: 30rpx;
		.item{
			flex: 1;
			font-size: $uni-font-size-base;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			position: relative;
			.uni-badge-left-margin{
				position:absolute;
				top: -10rpx;
				right: 35rpx;
			}
			.imgs{
				.iconfont{
					font-size: 65rpx;
					color: $primary;
				}
			}
			.t1{
				color: #666;
				margin-top: 15rpx;
			}
			&:nth-child(1){
				.imgs{
					.iconfont{
						font-size: 55rpx;
						margin-bottom: 10rpx;
					}
				}
			}
			&:nth-child(2){
				.imgs{
					.iconfont{
						font-size: 58rpx;
						margin-bottom: 7rpx;
					}
				}
			}
			
		}
	}
}
.self_integral{
	box-sizing: border-box;
	margin:0 $block-margin;
	border-radius: 15rpx;
	padding: 30rpx;
	background: linear-gradient(to right,#212844,#484e64);
	display: flex;
	color:#fcb138;
	align-items: center;
	.t2_item{
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: flex-end;
	}
	.t2{
		color:#d5bfb0;
		font-size: $uni-font-size-base;
		margin-right: 20rpx;
	}
	.imgs{
		width: 50rpx;
		height: 50rpx;
		margin-right: 20rpx;
		image{
			width: 100%;
			height: 100%;
		}
	}
}
.self_mid{
	/* #ifdef MP */
	height: calc(420rpx);
	padding-top: var(--status-bar-height);
	/* #endif */ 
	/* #ifdef APP */
	height: calc(460rpx + var(--status-bar-height));
	/* #endif */ 
	/* #ifdef H5 */
	height: calc(440rpx + var(--status-bar-height));
	padding-top: var(--status-bar-height);
	/* #endif */ 
}
.self_top{
	background: linear-gradient(to left,$primary,$gradient);
	width: 100%;
	height: 260rpx;
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
		}
		.money_block{
			display: flex;
			margin-top: 45rpx;
			justify-content: space-between;
			.item{
				justify-content: center;
				align-items: center;
				flex: 0 0 33.33%;
				display: flex;
				flex-direction: column;
				.t2{
					color:#aaa;
					font-size: $uni-font-size-sm;
					margin-top: 10rpx;
				}
			}
		}
	}
}
</style>
