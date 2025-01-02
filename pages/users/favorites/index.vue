<template>
	<view class="qwshop">
		<view class="top_tab ct30 pd10">
			<view class="item" @click="changeType(0)">
				<text :class="data.params.is_type==0?'ck':''">商品</text>
			</view>
			<view class="item" @click="changeType(1)">
				<text :class="data.params.is_type==1?'ck':''">店铺</text>
			</view>
		</view>
		<view class="home_goods ct30 pd10">
			<z-paging ref="paging" :auto-scroll-to-top-when-reload="false" use-page-scroll v-model="data.list" @query="upCallback">
				<view class="goods_list" v-show="data.params.is_type==0">
					<view class="goods_item" v-for="(v,k) in data.list||[]" :key="k" >
						<view class="goods_thumb" @click="R.nav('/pages/goods/info?id='+v.out_id)">
							<!-- R.formatUrl(v.goods_master_image)|| @click="R.nav('/pages/goods/info?id='+v.id)"-->
							<image :src="R.formatUrl(v.goods_master_image)||''" mode="aspectFill" />
						</view>
						<view class="goods_tit">{{v.goods_name}}</view>
						<view class="goods_price" >
							<text>￥{{v.goods_price||'0.00'}}</text>
							<text></text>
						</view>
						<view class="delbtn" @click="del(v.id)"><uni-icons type="trash-filled" color="#e11f27" :size="24"></uni-icons></view>
					</view>
				</view>
				
				<view class="goods_list store" v-show="data.params.is_type==1">
					<view class="goods_item" v-for="(v,k) in data.list||[]" :key="k" >
						<view class="goods_thumb" @click="R.nav('/pages/store/index?id='+v.out_id)">
							<!-- R.formatUrl(v.goods_master_image)|| @click="R.nav('/pages/goods/info?id='+v.id)"-->
							<image :src="R.formatUrl(v.store_logo)||''" mode="aspectFill" />
						</view>
						<view class="goods_tit">{{v.store_name}}</view>
						<view class="area">{{v.area_info}}</view>
						<view class="delbtn"><uni-icons type="trash-filled" color="#e11f27" :size="24" @click="del(v.id)"></uni-icons></view>
					</view>
				</view>
			</z-paging>
			
			
		</view>
		
	</view>
</template>

<script setup>
import { reactive, ref,nextTick } from "vue"
	import {onLoad} from "@dcloudio/uni-app"
	import {R} from '@/plugins/http.js' // 请求方式中间件
	const paging = ref(null)
	const data = reactive({
		params:{
			page:1,
			per_page:10,
			is_type:0,
		},
		list:[],
	})
	const upCallback = (pageNo, pageSize)=>{
		data.params.page = pageNo // 页码, 默认从1开始
		data.params.per_page = pageSize // 页长, 默认每页10条
		uni.showLoading({title:'加载中...'})
		R.get('/Wap/favorites',data.params).then(res=>{
			if(res.code != 200) return paging.value.complete(false)
			paging.value.complete(res.data.data)
		}).finally(()=>{
			uni.hideLoading()
		})
	}
	
	const changeType = (e)=>{
		data.params.is_type = e
		paging.value.reload()
	}
	
	const del = (e)=>{
		R.del('/Wap/favorites/'+e).then(res=>{
			if(res.code && res.code == 200) paging.value.reload()
		})
	}



</script>

<style lang="scss" scoped>
.home_goods .goods_list{
	&.store{
		flex-direction: row;
		display: flex;
		.goods_item{
			margin-bottom: 30rpx;
			display: inline-block;
			height: auto;
			padding: 30rpx;
			flex: 1;
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
