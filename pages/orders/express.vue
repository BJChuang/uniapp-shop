<template>
	<view class="qwshop ct30">
		<view v-if="data.tracesData.length>0" class="order_express br20 pd20">
			<uni-steps :options="data.tracesData" direction="column" :active="1"></uni-steps>
		</view>
		<z-paging-empty-view v-else></z-paging-empty-view>
	</view>
	
</template>

<script setup>
	import { reactive,getCurrentInstance } from 'vue'
	import {R} from '@/plugins/http.js' // 请求方式中间件
	import { onLoad } from "@dcloudio/uni-app"
	
	const data = reactive({
		tracesData:[],
		integral:false,
	})
	
	const loadData = ()=>{
		let url = '/Wap/order/get_order_info/'+data.id
		if(data.integral) url = '/Wap/integral/orders/'+data.id
		R.get(url,{isResource:'Home'}).then(res=>{
			if(!res.data.delivery_list) return
			res.data.delivery_list.map(item=>{
				data.tracesData.push({title:item.context,desc:item.time})
			})
		})
		
	}
	onLoad((opt)=>{
		data.id = opt.id
		data.integral = R.isEmpty(opt.integral)?false:true
		loadData()
	})
	
</script>

<style lang="scss" scoped>
.order_express{
	background: #fff;
}
</style>
