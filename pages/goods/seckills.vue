<template>
	<view class="qwshop">
		<view class="skill_type ct30 br20">
			<uni-grid :column="4" :show-border="false"  :square="false">
				<uni-grid-item>
					<view :class="data.timeIndex==0?'item ck':'item'" @click="timeChange(0)">
						<view class="title">{{data.timeList[0]||'00'}}:00 场</view>
						<view class="name">已开始</view>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view :class="data.timeIndex==1?'item ck':'item'" @click="timeChange(1)">
						<view class="title">{{data.timeList[1]||'00'}}:00 场</view>
						<view class="name">预约中</view>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view :class="data.timeIndex==2?'item ck':'item'" @click="timeChange(2)">
						<view class="title">{{data.timeList[2]||'00'}}:00 场</view>
						<view class="name">预约中</view>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view :class="data.timeIndex==3?'item ck':'item'" @click="timeChange(3)">
						<view class="title">{{data.timeList[3]||'00'}}:00 场</view>
						<view class="name">预约中</view>
					</view>
				</uni-grid-item>
			</uni-grid>
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
	</view>
</template>

<script setup>
	import dayjs from "dayjs"
	import Base64 from 'base-64'
	import { reactive,ref } from 'vue'
	import {onLoad,onShow} from "@dcloudio/uni-app"
	import {R} from '@/plugins/http.js' // 请求方式中间件
	
	const paging = ref(null)
	const data = reactive({
		timeList:[],
		timeFormat:' 00 : 00 : 00 ',
		timeIndex:0,
		timeObj:null,
		list:[],
		params:{
			page:1,
			per_page:10,
			total:0,
			start_time:0,
		}
	})
	
	const timeChange = (e)=>{
		data.params.start_time = e;
		data.timeIndex = e
		paging.value.reload()
	}
	const timing = ()=>{
		let endTime = dayjs().add(1,'hours').format('YYYY-MM-DD HH')+':00:00'
		if(data.timeObj != null) clearInterval(data.timeObj)
		data.timeObj = setInterval(()=>{
			let timeVal = dayjs(endTime).unix() - dayjs().unix()
			data.timeFormat = R.formatTime(timeVal,false)// 时间戳转换
			if(dayjs(endTime).unix()<dayjs().unix()){
				clearInterval(data.timeObj);
				data.timeList = [dayjs().format('H'),dayjs().add(1,'hours').format('H'),dayjs().add(2,'hours').format('H'),dayjs().add(3,'hours').format('H')]
				timing()
				paging.value.reload()
			}
		},1000)
	}
	
	const loadData = ()=>{
		R.get('/Wap/seckills',data.params).then(res=>{
			if(res.code != 200) return paging.value.complete(false)
			paging.value.complete(res.data.data)
		})
	}
	
	const upCallback = (pageNo, pageSize)=>{
		data.params.page = pageNo // 页码, 默认从1开始
		data.params.per_page = pageSize // 页长, 默认每页10条
		loadData()
	}
	
	
	const downCallback = ()=>{
		paging.value.reload()
	}
	
	onLoad((opt)=>{
		data.timeList = [dayjs().format('H'),dayjs().add(1,'hours').format('H'),dayjs().add(2,'hours').format('H'),dayjs().add(3,'hours').format('H')]
		timing()
	})
	
</script>

<style lang="scss" scoped>
.skill_type{
	// border: 1px solid #efefef;
	line-height: 50rpx;
	font-size: $uni-font-size-lg;
	background-color: #fff;
	.item{
		padding: 15rpx 0;
		cursor: pointer;
		text-align: center;
		.title{
			font-size: $uni-font-size-base;
			font-weight: bold;
			line-height: 50rpx;
			margin-right: 10rpx;
		}
		.name{
			font-size: $uni-font-size-base;
			line-height: 50rpx;
			color:#666;
		}
		&.ck{
			background: $uni-color-error;
			border-radius: 20rpx;
			color:#fff;
			.title{
				font-weight: bold;
				color:#fff;
			}
			.name{
				color:#fff;
			}
		}
	}
}
</style>
