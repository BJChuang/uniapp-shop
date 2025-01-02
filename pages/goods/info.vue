<template>
	<view class="qwshop  ">
		<view class="goods_swipe_image ">
			<view class="back_icon" @click="R.nav('',3)">
				<uni-icons type="back" color="#fff" ></uni-icons>
			</view>
			<view @click="favClick" :class="data.isFav?'right_icon sec':'right_icon sec ck'">{{data.isFav?'已':'+ '}}收藏</view>
			<swiper style="height: 650rpx;" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
				<swiper-item v-for="(v,k) in data.goodsInfo.goods_images||[]" :key="k">
					<view class="swiper-item"><image :src="R.formatUrl(v)" mode="aspectFill"></image></view>
				</swiper-item>
			</swiper>
			
		</view>
		
		<view class="goods_title">
			<view class="goods_name">{{data.goodsInfo.goods_name||'加载中...'}}</view>
			<!-- <view class="goods_desc">{{data.goodsInfo.goods_subname||'加载中...'}}</view> -->
			<view class="goods_price">
				<text class="price">￥{{data.goodsInfo.goods_price||'0.00'}}</text>
				<!-- <text class="market_price">￥{{data.goodsInfo['goods_market_price']||'0.00'}}</text> -->
				<text class="tip" v-if="data.goodsInfo.seckills">秒杀</text>
			</view>
			<!-- <view class="stock_num">
				<text class="sale">销量：{{data.goodsInfo.goode_sale||'0'}}</text>
				<text class="sale">库存：{{data.goodsInfo.goods_stock||'0'}}</text>
				<text class="sale">收藏：{{data.goodsInfo.goods_collect||'0'}}</text>
			</view> -->
		</view>
		
		<!-- 属性旋转 -->
		<view class="tuan_list" v-if="data.collectives && data.collective_list.length>0">
			<uni-list :border="false">
				<uni-list-item @click="toggleSpec()" clickable :title="'正在拼团'"  :showArrow="true"></uni-list-item>
			</uni-list>
			<swiper style="background: #fff;border-top: 1px solid #efefef;height: 80rpx;" :vertical="true" :autoplay="true">
				<swiper-item v-for="(v,k) in data.collective_list" :key="k">
						<view class="tuan_item" >
							<image :src="v.avatar?R.formatUrl(v.avatar):'/static/self/self_avatar.png'" />
							<view class="nickname">{{v.nickname}}(团购价￥ {{R.formatFloat(data.goodsInfo.goods_price*(1-data.collectives.discount/100)||'0.00')}})</view>
							<view class="btn" @click="data.collective_id=v.id;data.buyButton=1;toggleSpec()">参团</view>
							<view class="orders_count">参团 {{v.orders_count}} / {{v.need}} 人</view>
						</view>
				</swiper-item>
			</swiper>
		</view>
		
		<!-- 属性旋转 -->
		<view class="info_attr">
			<uni-list :border="false">
				<uni-list-item @click="toggleMask('show')" clickable :showArrow="true" v-if="data.goodsInfo.coupons && data.goodsInfo.coupons.length>0">
					<template #header>
						<text class="yhqicon">券</text>
						<text class="yhq">优惠券</text>
					</template>
					<template #footer>
						<text class="yhqlq">{{data.goodsInfo.coupons.length>0?'点击领取':'暂无'}}</text>
					</template>
				</uni-list-item>
				<uni-list-item @click="toggleSpec()" clickable title="规格属性" :rightText="(data.skuIndex>-1?data.goodsInfo['skuList'][data.skuIndex]['sku_name'].join(' '):'')+' 数量：'+(data.buy_num||0) " :showArrow="true"></uni-list-item>
			</uni-list>
		</view>
		
		<!-- 评价 -->
		<view class="comment">
			<uni-list :border="false">
				<uni-list-item @click="R.nav('/pages/goods/comment?id='+data.goodsId||0)"  :title="'商品评价 ( '+((data.goodsInfo.comment_statistics && data.goodsInfo.comment_statistics.all)||'0')+' )'" clickable :rightText="'好评率 ( '+((data.goodsInfo.comment_statistics && data.goodsInfo.comment_statistics.rate)||'100')+'% )'" :showArrow="true"></uni-list-item>
			</uni-list>
			<view class="comment_content" v-if="data.comments && data.comments.length>0" v-for="(v,k) in data.comments" :key="k">
				<view class="avatar"><image :src="R.formatUrl(v.avatar)||'../../static/self/self_avatar.png'" mode="aspectFit" /></view>
				<view class="comment_info">
					<view class="nickname">{{v.nickname}}</view>
					<view class="desc">{{v.content}}</view>
					<view class="img" v-if="v.image.length>0">
						<image v-for="(val,index) in v.image" :key="index" :src="R.formatUrl(val)" mode="aspectFit" />
					</view>
					<view class="other">{{v.created_at||'0000-00-00 00:00'}}</view>
					<view v-if="v.reply!=''" class="kfrp">商家: {{v.reply}}</view>
				</view>
			</view>
		</view>
		
		<!-- 详情 -->
		<view class="content">
			<view class="c_title">图文详情</view>
			<!-- <view class="m_content" v-html="R.editorHandle(data.goodsInfo.goods_content)||''"></view> -->
			<rich-text class="m_content" :nodes="R.editorHandle(data.goodsInfo.goods_content)||''"></rich-text>
		</view>
		
		<!-- 底部购物按钮 -->
		<uni-goods-nav class="goods-carts" :options="goodsNavOptions" :button-group="goodsNavBtn" @click="iconClick" @buttonClick="buttonClick" />
		
		<!-- 规格-模态层弹窗 :class="specClass" -->
		<view class="popup spec" :class="data.specClass" @click="toggleSpec" >
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<view class="a-t">
					
					<image :src="R.formatUrl(data.goodsInfo.goods_images_thumb_150)?(R.formatUrl(data.goodsInfo.goods_images_thumb_150[0])||''):''"></image>
					<view class="right">
						<text class="price">¥{{data.goodsInfo['goods_price']||'0.00'}}</text>
						<text class="stock">库存：{{data.goodsInfo['goods_stock']||'0'}}件</text>
						<view class="selected">
							已选：
							<text class="selected-text">
								{{(data.skuIndex>-1?data.goodsInfo['skuList'][data.skuIndex]['sku_name'].join(' '):' -')}}
							</text>
						</view>
					</view>
				</view>
				<view v-for="(item,index) in data.goodsInfo.attrList" :key="index" class="attr-list">
					<text>{{item.name||'-'}}</text>
					<view class="item-list">
						<text 
							v-for="(childItem, childIndex) in item.specs" 
							:key="childIndex" class="tit"
							:class="{selected: !(R.isEmpty(childItem.is_chose) || childItem.is_chose==false)}"
							@click="attrClick(index, childIndex)"
						>
							{{childItem.name||'-'}}
						</text>
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
		
		<!-- 优惠券面板 -->
		<view class="mask" :class="data.maskState===0 ? 'none' : data.maskState===1 ? 'show' : ''" @click="toggleMask()">
			<view class="mask-content" @click.stop.prevent="stopPrevent">
				<!-- 优惠券页面，仿mt -->
				<view class="coupon-item" v-for="(item,index) in data.goodsInfo.coupons" :key="index" @click="coupons_receive(item.id)">
					<view class="con">
						<view class="left">
							<text class="title">{{item.name}}</text>
							<text class="time"><text v-if="item.use_money>0">满{{item.use_money}}可用</text></text>
						</view>
						<view class="right">
							<text class="price">{{item.money}}</text>
						</view>
						<view class="circle l"></view>
						<view class="circle r"></view>
					</view>
					<text class="tips">{{item.content||'-'}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { reactive, ref } from "vue";
	import { onLoad } from "@dcloudio/uni-app";
	import Base64 from 'base-64';
	import {R} from '@/plugins/http.js' // 请求方式中间件
	const isShop = ref(0)
	const goodsNavOptions = reactive([
	{
		icon: 'chat',
		text: '客服'
	}
	// , {
	// 	icon: 'shop',
	// 	text: '店铺',
	// 	info: 0,
	// }, {
	// 	icon: 'cart',
	// 	text: '购物车',
	// 	info: 0
	// }
	])
	const goodsNavBtn = reactive([
	// {
	// 	text: '加入购物车',
	// 	backgroundColor: '#444',
	// 	color: '#fff'
	// },
	{
		text: '选择商品',
		backgroundColor: 'linear-gradient(to left, #ef464f, #ff3c46)',
		color: '#fff'
	}
	])
	const store = ref()
	const data = reactive({
		goodsId:0,
		buy_num:1,
		sku_id:0,
		sku_index:-1,
		collective_id:0,
		collectives:false,
		collective_list:[],
		buyButton:0,
		specClass:'none',
		goodsInfo:{},
		comments:[],
		choseSpec:[], // 已经选择的属性ID
		maskState:0,
		isFav:false,
	})
	const user = ref()
	// 页面加载
	onLoad(async(opt)=>{
		data.goodsId = opt.id||0
		if(opt.shop&&opt.shop==1){
			goodsNavBtn[0].text = '已选择商品'
			goodsNavBtn[0].backgroundColor = '#ccc'
			isShop.value = 1
		}else{
			goodsNavBtn[0].text = '选择商品'
			goodsNavBtn[0].backgroundColor = 'linear-gradient(to left, #ef464f, #ff3c46)'
			isShop.value = 0
		}
		let rs = await R.get("/Wap/store",{})
		store.value = rs.data
		
		goods()
		goods_comment()
		cartCount()
		getUser()
	})
	// 获取用户信息
	const getUser = async()=>{
		let res = await R.get('/Wap/auth/info',{provider:'users'})
		if(res.code && res.code == 200) user.value = res.data||{}
		if(user.value.is_seller == 0){
			goodsNavBtn[0].text = '入驻商户'
			goodsNavBtn[0].backgroundColor = 'linear-gradient(to left, #ef464f, #ff3c46)'
		}
	}

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

	// 浮动按钮点击
	const iconClick = (e)=>{
		if(e.index==0){
			return R.nav('/pages/chats/index?id='+data.goodsInfo.store_info.user_id)
		}
		if(e.index==1){
			return R.nav('/pages/store/index?id='+data.goodsInfo.store_id)
		}
		if(e.index==2){
			return R.nav('/pages/index/cart',1)
		}
	}
	
	const buttonClick = async (e)=>{
		// if(!data.collectives){
		// 	if(e.index == 0){
		// 		data.buyButton = 0
		// 	}else{
		// 		data.buyButton = 1
		// 	}
		// }else{
		// 	if(e.index == 0){
		// 		data.buyButton = 1
		// 	}else{
		// 		data.collective_id=-1
		// 		data.buyButton = 1
		// 	}
		// }
		// toggleSpec()
		if(user.value.is_seller==0){
			R.nav('/pages/store/join')
			return false
		}
		if(user.value.is_seller==4){
			if(isShop.value==0){
				uni.showLoading({
					mask:true
				})
				let res = await R.post('/Wap/goodsJoin',{goods_id:data.goodsId,store_id:store.value.id})
				if(res.code==200){
					uni.showModal({
						title:"提示",
						content:'成功加入商品',
						showCancel:false,
						success: (ret) => {
							
							uni.navigateBack()
						}
					})
				}
				uni.hideLoading()
			}
		}else{
			uni.showModal({
				title:"提示",
				content:'未入驻商户成功',
				showCancel:false,
				
			})
		}
		
	
		
		
		
	}
	
	const attrClick = (e,index)=>{
		data.goodsInfo.attrList[e].specs.map((item,key)=>{
			data.goodsInfo.attrList[e].specs[key].is_chose = false
			if(key == index) data.goodsInfo.attrList[e].specs[key].is_chose = true
		})
		// 选择的属性
		let choseSpec = [];
		// 循环获取选择的规格属性
		data.goodsInfo.attrList.map((item,key)=>{
			data.goodsInfo.attrList[key].specs.map(specItem=>{
				if(!R.isEmpty(specItem.is_chose) && specItem.is_chose == true) choseSpec.push(specItem.id)
			})
		})
		data.choseSpec = choseSpec
		// 如果选择数量和规格数量一致则表示选择完所有的规格属性
		if(data.choseSpec.length == data.goodsInfo.attrList.length) setSkuData()
		
	}
	
	// 根据选择的规格属性去获取数据库存在的规格数据 SKU
	const setSkuData = ()=>{
		data.goodsInfo.skuList.map((item,key)=>{
			let a = 0
			data.choseSpec.map(specItem=>{
				item.spec_id.map(specIdItem=>{
					if(specIdItem == specItem) a += 1
				})
			})
			
			if(a == data.goodsInfo.attrList.length){
				// data.skuInfo = item;
				data.sku_id = item.id
				data.skuIndex = key
				return goodsChange(item)
			}
		})
	}
	
	// 修改属性，更新显示商品价格等数据
	const goodsChange = (e)=>{
		data.goodsInfo.goods_price = e.goods_price
		data.goodsInfo.goods_market_price = e.goods_market_price
		data.goodsInfo.goods_stock = e.goods_stock
		if(!R.isEmpty(e.id)) data.sku_id = e.id
	}
	
	const stopPrevent = ()=>{}
	
	const buyNumChange = (e)=> data.buy_num = e
	
	// 完成选择前往
	const buyCom = ()=>{
		toggleSpec()
		if(data.goodsInfo.attrList && data.choseSpec.length < data.goodsInfo.attrList.length) return R.toast('请选择好规格属性值.')
		if(data.buyButton == 0) return addCart()
		return buy()
	}

	// 获取商品信息
	const goods = async ()=>{
		let res = await R.get('/Wap/goods/'+data.goodsId)
		if(res.code && res.code == 200){
			data.goodsInfo = res.data
			data.collectives = res.data.collectives; // 拼团
			data.collective_list = res.data.collective_list; // 拼团
			if(data.collectives){
				// goodsNavBtn[0].text = '直接购买'
				// goodsNavBtn[1].text = '参加拼团'
				// goodsNavBtn[1].backgroundColor = '#67c23a'
			}
			if(data.goodsInfo['skuList'] && data.goodsInfo['skuList'].length>0){
				data.skuIndex = 0;
				goodsChange(data.goodsInfo['skuList'][data.skuIndex])
			}
			is_fav()
		}
	}

	// 获取商品评论
	const goods_comment = async ()=>{
		let res = await R.get('/Wap/goods_comments/'+data.goodsId)
		if(res.code && res.code == 200){
			data.comments = res.data.data
			if(data.comments.length > 3) data.comments = data.comments.slice(0,3)
		}
	}
	
	const coupons_receive = (id)=>{
		R.post('/Wap/coupons/receive',{id:id}).then(res=>{
			R.toast(res.msg);
		})
	}
	//显示优惠券面板
	const toggleMask = (type)=>{
		let timer = type === 'show' ? 10 : 300;
		let	state = type === 'show' ? 1 : 0;
		data.maskState = 2;
		setTimeout(()=>{
			data.maskState = state
		}, timer)
	}
	
	// 收藏
	const favClick = ()=>{
		R.post('/Wap/favorites',{out_id:data.goodsInfo.id,is_type:0}).then(res=>{
			R.toast('操作成功')
			is_fav()
		})
	}
	
	const is_fav = ()=>{
		R.get('/Wap/is_fav/',{out_id:data.goodsInfo.id,is_type:0}).then(res=>{
			data.isFav = res.data
		})
	}
	
	// 获取购物车数据
	const cartCount = async ()=>{
		let res = await R.get('/Wap/carts/cart_count')
		goodsNavOptions[2].info = res.data
	}
	
	// 加入购物车
	const addCart = async ()=>{
		let params = {
			goods_id:data.goodsId, // 商品ID
			sku_id:data.sku_id, // SKUid 没有则为0
			buy_num:data.buy_num, // 购买数量
		};
		let res = await R.post('/Wap/carts',params)
		if(res.code == 200 ) R.toast('操作成功')
		uni.$emit('carts')
		cartCount()
	}
	
	// 直接购买
	const buy = async ()=>{
		let params = {
			order:[
				{
					goods_id:data.goodsId, // 商品ID
					sku_id:data.sku_id, // SKUid 没有则为0
					buy_num:data.buy_num, // 购买数量
					collective_id:data.collective_id, // 拼团ID 非必传
				},
			],
			ifcart:0, // 是否购物车
		};
		
		// 恢复 collective_id
		data.collective_id = 0
		
		let baseObj = JSON.stringify(params)
		var basecode = Base64.encode(unescape(encodeURIComponent(baseObj)))
		R.nav('/pages/orders/create?params='+basecode)
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
	.right_icon{
		position: absolute;background: rgba(#000, 0.4);border-radius: 50%;width: 60rpx;height: 60rpx;text-align: center;box-sizing: border-box;
		padding-top: 6rpx;
		z-index: 999;
		color:#fff;
		right:40rpx;top:calc(var(--status-bar-height) + 40rpx);
		/* #ifdef MP-WEIXIN */
		right: 180rpx;
		/* #endif */
		&.sec{
			width: 130rpx;
			border-radius: 40rpx;
			font-size: $uni-font-size-base;
			line-height: 48rpx;
			right: 40rpx;
			/* #ifdef MP-WEIXIN */
			right: 180rpx;
			/* #endif */
			&.ck{
				background: $uni-color-error;
				color:#fff;
			}
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
	.yhq{font-size: 22rpx;color:$uni-color-error;}
	.yhq2{font-size: 24rpx;color:$uni-color-error;}
	.yhqicon{
		color:#fff;
		background: #f85e52;
		font-size: $uni-font-size-sm;
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

.tuan_list{
	margin-top: 20rpx;
	.tuan_item{
		padding: 20rpx;
		&:after{
			content:'';
			display: block;
			clear: both;
		}
		image{
			width: 50rpx;
			height: 50rpx;
			border:1px solid #efefef;
			border-radius: 50%;
			float: left;
			margin-right: 15rpx;
		}
		.nickname{
			color:#b5621b;
			font-size: $uni-font-size-sm;
			float: left;
			display: block;
			line-height: 50rpx;
		}
		.orders_count{
			color:#b5621b;
			float: right;
			display: block;
			line-height: 50rpx;
			margin-right: 20rpx;
			font-size: $uni-font-size-sm;
		}
		.btn{
			font-size: $uni-font-size-sm;
			cursor: pointer;
			display: block;
			background: #67c23a;
			color:#fff;
			border-radius: 6rpx;
			float: right;
			line-height: 50rpx;
			padding:0 30rpx;
		}
	}
}
/* 优惠券面板 */
.mask{
	display: flex;
	align-items: flex-end;
	position: fixed;
	left: 0;
	top: 0;
	bottom: 0;
	width: 100%;
	background: rgba(0,0,0,0);
	z-index: 5;
	transition: .3s;
	
	.mask-content{
		width: 100%;
		min-height: 30vh;
		max-height: 70vh;
		background: #f3f3f3;
		transform: translateY(100%);
		transition: .3s;
		overflow-y:scroll;
	}
	&.none{
		display: none;
	}
	&.show{
		background: rgba(0,0,0,.4);
		
		.mask-content{
			transform: translateY(0);
		}
	}
}
/* 优惠券列表 */
.coupon-item{
	display: flex;
	flex-direction: column;
	margin: 20rpx 24rpx;
	background: #fff;
	.con{
		display: flex;
		align-items: center;
		position: relative;
		height: 120rpx;
		padding: 0 30rpx;
		&:after{
			position: absolute;
			left: 0;
			bottom: 0;
			content: '';
			width: 100%;
			height: 0;
			border-bottom: 1px dashed #f3f3f3;
			transform: scaleY(50%);
		}
	}
	.left{
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 1;
		overflow: hidden;
		height: 100rpx;
	}
	.title{
		font-size: 32rpx;
		color: #333;
		margin-bottom: 10rpx;
	}
	.time{
		font-size: 24rpx;
		color: #999;
	}
	.right{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 26rpx;
		height: 100rpx;
	}
	.price{
		color:$uni-color-error;
		font-size: 44rpx;
		&:before{
			content: '￥';
			font-size: 34rpx;
		}
	}
	.tips{
		font-size: 24rpx;
		line-height: 60rpx;
		padding-left: 30rpx;
	}
	.circle{
		position: absolute;
		left: -6rpx;
		bottom: -10rpx;
		z-index: 10;
		width: 20rpx;
		height: 20rpx;
		background: #f3f3f3;
		border-radius: 100px;
		&.r{
			left: auto;
			right: -6rpx;
		}
	}
}
</style>
