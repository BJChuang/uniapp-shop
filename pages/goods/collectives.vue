<template>
	<view class="qwshop  ">
		<view class="goods_index_where ct30 br20">
			<view @click="navClick(0)" :class="data.params.sort_type=='id'?'item ck':'item'">综合排序</view>
			<view @click="navClick(1)" :class="data.params.sort_type=='goods_sale'?'item ck':'item'">销量优先</view>
			<view  @click="navClick(2)" :class="data.params.sort_type=='goods_price'?'item ck2':'item'">
				<view class="price">
					<view class="t1">价格</view>
					<view class="ac">
						<view class="c1"><uni-icons type="top" size="12" :color="(data.params.sort_order=='asc' && data.params.sort_type=='goods_price')?'#e11f27':null"></uni-icons></view>
						<view class="c2"><uni-icons type="bottom" size="12" :color="(data.params.sort_order=='desc' && data.params.sort_type=='goods_price')?'#e11f27':null"></uni-icons></view>
					</view>
				</view>
			</view>
			<view class="item x"></view>
			<view class="item" @click="drawerOpen">
				<text class="iconfont qwmenu"></text>
			</view>
		</view>
		
		<view class="home_goods ct30 ">
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
		
		<!-- 抽屉 -->
		<uni-drawer mode="right" ref="drawers" :width="280">
			<view class="drawer_goods">
				<view @click="classClick(v.id)" :class="v.id==data.params.class_id?'class_item ck':'class_item' " v-for="(v,k) in data.classes" :key="k">{{v.name}}</view>
			</view>
		</uni-drawer>
	</view>
</template>

<script setup>
	import { reactive, ref,nextTick } from "vue"
	import {onLoad} from "@dcloudio/uni-app"
	import Base64 from 'base-64'
	import {R} from '@/plugins/http.js' // 请求方式中间件
	const paging = ref(null)
	const drawers = ref(null)
	const data = reactive({
		params:{
			page:1,
			per_page:10,
			sort_type:'id',
			sort_order:'desc',
			is_collective:1,
			deep:1,
		},
		list:[],
		classes:[]
	})
	const upCallback = (pageNo, pageSize)=>{
		data.params.page = pageNo // 页码, 默认从1开始
		data.params.per_page = pageSize // 页长, 默认每页10条
		uni.showLoading({title:'加载中...'})
		let params = {...data.params}
		params.params = ''
		let baseObj = JSON.stringify(params);
		var basecode = Base64.encode(unescape(encodeURIComponent(baseObj)))
		data.params.params = basecode
		R.get('/Wap/goods',data.params).then(res=>{
			if(res.code != 200) return paging.value.complete(false)
			paging.value.complete(res.data.data)
		}).finally(()=>{
			uni.hideLoading()
		})
	}
	
	// 抽屉分类点击
	const classClick = (e)=>{
		data.params.class_id = e
		paging.value.reload()
		drawers.value.close()
	}
	
	// 顶部条件点击
	const navClick = (e)=>{
		if(e==0){
			data.params.sort_type='id'
			data.params.sort_order = 'desc';
		}else if(e==1){
			data.params.sort_type='goods_sale'
			data.params.sort_order = 'desc';
		}else if(e==2){
			data.params.sort_type='goods_price'
			if(data.params.sort_order == 'desc'){
				data.params.sort_order = 'asc';
			}else{
				data.params.sort_order = 'desc';
			}
		}
		console.log(data.params)
		paging.value.reload()
	}
	
	// 抽屉打开
	const drawerOpen = ()=> {
		loadPeerClasses()
		drawers.value.open()
	}
	const loadPeerClasses = ()=>{
		R.get('/Wap/peer_classes/'+data.params.class_id).then(res=>{
			if(res.code == 200) return data.classes = res.data
		})
	}

	onLoad((opt)=>{
		data.params.class_id = opt.class_id||0;
		if(!R.isEmpty(opt.deep)) data.params.deep = opt.deep
		nextTick(()=>{
			paging.value.reload()
		})
	})
</script>

<style lang="scss" scoped>
.goods_index_where{
	background: #fff;
	display: flex;
	padding: 0rpx 20rpx 0 30rpx;
	font-size: $uni-font-size-base;
	text-align: center;
	.item{
		padding-top: 30rpx;
		flex: 1;
		border-bottom: 4rpx solid #fff;
		border-radius: 2rpx;
		box-sizing: border-box;
		padding-bottom: 30rpx;
		margin-right: 20rpx;
		&.ck{
			color:$primary;
			border-bottom: 4rpx solid $primary;
		}
		&.ck2{
			border-bottom: 4rpx solid $primary;
			.t1{
				color:$primary;
			}
		}
		.price{
			display: flex;
			justify-content: center;
			.ac{
				padding-left: 8rpx;
				display: flex;
				flex-direction: column;
				position: relative;
				.c1{
					position: absolute;
					top: -9rpx;
				}
				.c2{
					position: absolute;
					bottom: -6rpx;
				}
			}
		}
		&.x{
			background:#efefef;
			flex:0 1 1px;
			margin-top: 20rpx;
			margin-bottom: 20rpx;
		}
		&:nth-child(3){
			flex: 0 1 100rpx;
			margin-right: 40rpx;
		}
		&:last-child{
			flex:0 1 90rpx;
			margin-right: 0;
			.iconfont{
				font-size: 40rpx;
			}
		}
	}
}
.drawer_goods{
	padding:20rpx 0;background: #fff;
	.class_item{
		border-left: 6rpx solid #fff;
		padding: 20rpx;
		padding-left: 30rpx;
		margin-bottom: 10rpx;
		font-size: $uni-font-size-base;
		&.ck{
			border-left-color: $primary;
			border-radius: 0 3rpx 3rpx 0;
			background-color: #efefef;
		}
	}
}
</style>
