<template>
	<view class="qwshop">
		<view class="address_list ct30 pd30 br20">
			<view class="form_data">
				<view class="label">联系人</view>
				<view class="value">
					<input type="text" placeholder="联系人" v-model="data.info.receive_name">
				</view>
			</view>
			<view class="form_data">
				<view class="label">手机号</view>
				<view class="value">
					<input type="text" placeholder="手机号" v-model="data.info.receive_tel">
				</view>
			</view>
			<view class="form_data">
				<view class="label">地区</view>
				<view class="value">
					<view class="area_info">
						<picker mode="multiSelector" :value="data.rangeIndex" @columnchange="columnchange" :range="data.ranges" @change="areaChange">
							<view>{{data.info.area_info||'选择城市'}}</view>
						</picker>
					</view>
					<view class="map">
						<uni-icons type="location-filled" size="22"></uni-icons>
					</view>
				</view>
			</view>
			<view class="form_data">
				<view class="label">详细</view>
				<view class="value">
					<input type="text" placeholder="详细" v-model="data.info.address">
				</view>
			</view>
			<view class="form_data">
				<view class="label lt">默认</view>
				<view class="value">
					<switch :checked="data.info.is_default" color="#e11f27" style="transform:scale(0.6)" @change="switchChange" />
				</view>
			</view>
		</view>
		<view class="list_b_btn ct30 pd10"  @click="confirm">确定编辑</view>
		
	</view>
</template>

<script setup>
	import { reactive } from "vue";
	import {onLoad} from "@dcloudio/uni-app"
	import {R} from '@/plugins/http.js' // 请求方式中间件
	const data = reactive({
		id:0,
		ranges:[[],[],[]],
		rangeIndex:[0,0,0],
		areas:[],
		info:{
			is_default:false,
		}
	})
	
	const switchChange = (e)=> data.info.is_default = e.detail.value
	
	const loadData = async ()=>{
		
		let res = await R.get('/Wap/addresses/'+data.id)
		console.log(res.data)
		if(res.code && res.code == 200){
			data.info = res.data
			if(data.info.is_default == 1) data.info.is_default = true
			if(data.info.is_default == 0) data.info.is_default = false
		}
	}
	
	const loadArea = async ()=>{
		let res = await R.get('/Wap/load_areas',{},1)
		if(res.code && res.code == 200){
			data.areas = res.data
			data.ranges = [[],[],[]]
			data.ranges[0] = await getAreaChildren(data.areas)
			data.ranges[1] = await getAreaChildren(data.areas[0])
			data.ranges[2] = await getAreaChildren(data.areas[0].children[0])
		}
	}
	
	const areaChange = (e)=>{
		let areaIndex = e.detail.value
		data.info.area_info = data.areas[areaIndex[0]].name + ' ' + data.areas[areaIndex[0]].children[areaIndex[1]].name + ' ' + data.areas[areaIndex[0]].children[areaIndex[1]].children[areaIndex[2]].name
		data.info.province_id = data.areas[areaIndex[0]].id
		data.info.city_id = data.areas[areaIndex[0]].children[areaIndex[1]].id
		data.info.region_id = data.areas[areaIndex[0]].children[areaIndex[1]].children[areaIndex[2]].id
	}
	
	// 根据父级数据获取children数据
	const getAreaChildren = async (e)=>{
		let childrens = []
		if(R.isEmpty(e.children)){
			e.map(item=>{
				childrens.push(item.name)
			})
		}else{
			e.children.map(item=>{
				childrens.push(item.name)
			})
		}
		return childrens
	}
	
	const columnchange = async (e)=>{
		data.rangeIndex[e.detail.column] = e.detail.value
		if(e.detail.column == 0){
			data.ranges[1] = await getAreaChildren(data.areas[e.detail.value])
			data.ranges[2] = await getAreaChildren(data.areas[e.detail.value].children[0])
			data.rangeIndex[1] = 0
			data.rangeIndex[2] = 0
		}
		if(e.detail.column == 1){
			data.ranges[2] = await getAreaChildren(data.areas[data.rangeIndex[0]].children[e.detail.value])
			data.rangeIndex[2] = 0
		}
		console.log(data.rangeIndex)
	}
	
	const confirm = ()=>{
		let info = { ...data.info };
		if(R.isEmpty(info.receive_name)) return R.toast('请填写联系人')
		if(R.isEmpty(info.receive_tel)) return R.toast('请填写手机号')
		if(R.isEmpty(info.area_info)) return R.toast('请选择地区')
		info.is_default = data.info.is_default?1:0
		R[data.id >0?'put':'post'](data.id>0?('/Wap/addresses/'+data.id):'/Wap/addresses',info).then(res=>{
			if(res.code && res.code == 200){
				uni.$emit('addresses')
				return R.nav('',3)
			}
		})
	}
	
	onLoad((opt)=>{
		loadArea()
		if(R.isEmpty(opt.id)) return data.id = 0
		data.id = opt.id
		if(opt.id>0) loadData()
	})
</script>
<style>
	.uni-picker-container .uni-picker-action.uni-picker-action-confirm{
		color:#000;
	}
</style>
<style lang="scss" scoped>

.address_list{
	background: #fff;
	margin-top: 30rpx;
	
	.form_data{
		border-bottom: 1px solid #efefef;
		padding-bottom: 40rpx;
		margin-top: 40rpx;
		display: flex;
		&:first-child{
			margin-top: 20rpx;
		}
		&:last-child{
			border:none;
			padding-bottom: 20rpx;
		}
		.label{
			display: flex;
			align-items: center;
			flex: 0 0 120rpx;
			&.lt{
				flex: 0 0 100rpx;
			}
		}
		.value{
			display: flex;
			flex: 1;
			color:#666;
			font-size: $uni-font-size-base;
			align-items: center;
			.area_info{
				flex:0 1 80%
			}
			.map{
				flex:0 1 20rpx;
			}
			input{
				width: 100%;
				font-size: $uni-font-size-base;
			}
		}
	}
}
</style>
