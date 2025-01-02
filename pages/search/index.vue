<template>
	<view class="qwshop">
		<view class="search_bar">
			<uni-search-bar @input="change" v-model="data.keyword" bgColor="#fff" placeholder="请输入搜索内容" />
			<view class="chose" v-if="data.keyword!='' && !data.isShow">
				<view class="chose_item" @click="confirm(true)">搜索 <text>{{data.keyword}}</text> 商品</view>
				<view class="chose_item" @click="confirm(false)">搜索 <text>{{data.keyword}}</text> 店铺</view>
			</view>
		</view>
		<view class="tips" v-if="data.keyword==''">
			<text v-for="(v,k) in data.history" :key="k" class="name" @click="tipClick(v)">{{v}}</text>
		</view>
		<view class="clear_all_tip" v-if="data.history.length>0 && data.keyword == ''" @click="clearHis">清空历史记录</view>
		
		<view class="home_goods ct30">
			<z-paging ref="paging" :auto-scroll-to-top-when-reload="false" use-page-scroll :auto="false" v-model="data.list" @query="upCallback">
				<view class="goods_list" v-show="data.type">
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
				<view class="goods_list store" v-show="!data.type">
					<view class="goods_item" v-for="(v,k) in data.list||[]" :key="k" @click="R.nav('/pages/store/index?id='+v.id)">
						<view class="goods_thumb">
							<image :src="R.formatUrl(v.store_logo)||''" mode="aspectFill" />
						</view>
						<view class="goods_tit">{{v.store_name}}</view>
						<view class="area">{{v.area_info}}</view>
					</view>
				</view>
			</z-paging>
		</view>
	</view>
</template>

<script setup>
	import { reactive,ref,watch } from 'vue'
	import {R} from '@/plugins/http.js' // 请求方式中间件
	import { onLoad } from "@dcloudio/uni-app"
	import Base64 from 'base-64'
	
	const paging = ref(null)
	
	const data = reactive({
		keyword:'',
		isShow:false,
		params:{
			page:1,
			per_page:10,
		},
		list:[],
		type:true,
		history:[]
	})
	
	const confirm = (e)=>{
		let hasWord = false
		if(data.history.length>0){
			data.history.map(item=>{
				if(item == data.keyword) hasWord = true
			})
		}
		if(!hasWord){
			if(data.history.length>=10){
				data.history.splice(10,1);
			}
			data.history.push(data.keyword);
			uni.setStorageSync('search_keyword',data.history)
		}
		data.type = e;
		data.isShow = true
		paging.value.reload()
		upCallback(1,10)
	}
	
	const change = ()=>{
		data.isShow = false
		if(data.keyword == '') data.list = []
	}
	
	const clearHis = ()=>{
		data.history = [];
		uni.removeStorageSync('search_keyword')
	}
	
	const tipClick = (e)=>{
		data.keyword = e;
	}
	
	const loadData = (pageNo, pageSize,url="goods",method='get')=>{
		if(url == 'goods'){
			if(data.params.store_name) delete data.params.store_name
			let baseObj = JSON.stringify({keywords:data.keyword})
			var basecode = Base64.encode(unescape(encodeURIComponent(baseObj)))
			data.params.params = basecode
		}else{
			if(data.params.params) delete data.params.params
			data.params.store_name = data.keyword+'|like'
		}
		R[method]('/Wap/'+url,data.params).then(res=>{
			if(res.code != 200) return paging.value.complete(false)
			paging.value.complete(res.data.data)
		})
	}
	
	const upCallback = (pageNo, pageSize)=>{
		data.params.page = pageNo // 页码, 默认从1开始
		data.params.per_page = pageSize // 页长, 默认每页10条
		
		if(data.type){
			loadData(pageNo, pageSize)
		}else{
			loadData(pageNo, pageSize,'stores','get')
		}
	}
	
	watch(()=>data.keyword,(e)=>{
		change()
	})
	
	onLoad((opt)=>{
		let history = uni.getStorageSync('search_keyword')
		if(!R.isEmpty(history)){
			data.history = history
		}
	})
</script>

<style lang="scss" scoped>
.search_bar{
	margin-top: 1px;
	.chose{
		padding: 0rpx 30rpx;
		background: #fff;
		padding-bottom: 20rpx;
		.chose_item{
			text{color:$primary;margin:0 10rpx}
			border-bottom: 1px solid #eee;
			&:last-child{border-bottom: none;}
			font-size: $uni-font-size-base;
			padding: 10rpx 0;
		}
	}
}
.tips{
	margin-top: 20rpx;
	padding: 30rpx;
	&:after{
		content:'';
		clear: both;
		display: block;
	}
	.name{
		margin:20rpx 10rpx;
		background: #888;
		color:#fff;
		border-radius: 20rpx;
		font-size: $uni-font-size-base;
		padding: 5rpx 25rpx;
		float: left;
	}
	
}
.clear_all_tip{clear: both;width: 70%;border:1px solid $primary;text-align: center;margin:0 auto;line-height: 60rpx;border-radius: 30rpx;color:$primary;margin-top: 40rpx;}
.home_goods .goods_list{
	&.store{
		flex-direction: column;
		display: flex;
		.goods_item{
			flex: 1;
			width: 92%;
			margin-bottom: 30rpx;
			display: inline-block;
			height: auto;
			padding: 30rpx;
			flex: 1;
			&:nth-child(2n){
				margin-left: 0;
			}
			.goods_thumb{
				width: 100rpx;
				height: 100rpx;
				float: left;
			}
			.goods_tit{
				display: block;
				width: calc(100% - 240rpx);
				height: 44rpx;
				margin-top: 10rpx;
			}
			.area{
				display: block;
				width: calc(100% - 240rpx);
				padding-left: 20rpx;
				font-size: $uni-font-size-sm;
				color:#999;
				overflow: hidden;
			}
			.delbtn{
				top:60rpx;
			}
		}
	}
}
</style>
