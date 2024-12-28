<template>
    <div>
        <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="1" tab="RWEME Transactions">
                <div class="transactions">
                    <div class="transactions-body">
                        <a-table :columns="columns" :dataSource="transactions" rowKey="id" />
                    </div>
                </div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="MOMO Transactions">
                <div class="transactions">

                    <div class="transactions-body">
                        <a-table :columns="columns" :dataSource="transactions" rowKey="id" />
                    </div>
                </div>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeKey = ref('1');

const columns = [
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date'
    },
    {
        title: 'Transaction ID',
        dataIndex: 'id',
        key: 'id'
    },
    {
        title: 'Feed request ID',
        dataIndex: 'feedRequestId',
        key: 'feedRequestId'
    },
    {
        title: 'Farmer',
        dataIndex: 'farmerName',
        key: 'farmerName'
    },
    {
        title: 'Supplier',
        dataIndex: 'supplierName',
        key: 'supplierName'
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount'
    },

    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status'
    },
    {
        title: 'Action',
        key: 'action',
        slots: { customRender: 'action' }
    }
]
const transactions = [
    {
        id: 1,
        date: '2023-12-19',
        feedRequestId: 1,
        farmerName: 'John Doe',
        supplierName: 'Jane Doe',
        amount: 1000,
        status: 'Pending'
    },
    {
        id: 2,
        date: '2023-12-20',
        feedRequestId: 2,
        farmerName: 'John Doe',
        supplierName: 'Jane Doe',
        amount: 2000,
        status: 'Completed'
    },
    {
        id: 3,
        date: '2023-12-21',
        feedRequestId: 3,
        farmerName: 'John Doe',
        supplierName: 'Jane Doe',
        amount: 3000,
        status: 'Pending'
    }
]
</script>

<style scoped></style>