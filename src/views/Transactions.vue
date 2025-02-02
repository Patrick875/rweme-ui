<template>
  <div>
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="RWEME Transactions">
        <div class="transactions">
          <div class="transactions-body">
            <Table
              :data="transactions"
              :title="'Transactions'"
              :length="String(transactions.length)"
              :user-can-delete="false"
              :loading="loading"
              :handleTableSearch="handleSearch"
              :columns="columns"
              :handle-export="exportToExcell"
            />
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="MOMO Transactions">
        <div class="transactions">
          <div class="transactions-body">
            <a-table
              :columns="columns"
              :dataSource="transactions"
              rowKey="id"
              :handle-export="exportToExcell"
            />
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from "vue";
  import { useEntitiesStore } from "../store/entities.store";
  import * as xlsx from "xlsx";

  const activeKey = ref("1");

  const entitiesStore = useEntitiesStore();
  const loading = computed(() => entitiesStore.loading);
  entitiesStore.getAllTransactions();

  const transactions = computed(() =>
    entitiesStore.transactions.map((el) => ({
      id: el.transactionId,
      date: new Date(el.createdAt).toLocaleString("fr-FR"),
      feedRequestId: el.foodRequestId,
      farmerName: el?.Farmer?.fullName,
      supplierName: el?.Supplier?.User?.fullName,
      amount: el.amount,
      status: el.status,
    }))
  );

  const handleSearch = (q: string) => {
    entitiesStore.getAllTransactions(q);
  };
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Transaction ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Feed request ID",
      dataIndex: "feedRequestId",
      key: "feedRequestId",
    },
    {
      title: "Farmer",
      dataIndex: "farmerName",
      key: "farmerName",
    },
    {
      title: "Supplier",
      dataIndex: "supplierName",
      key: "supplierName",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Actions",
      key: "action",
      slots: { customRender: "action" },
    },
  ];
  const exportToExcell = (data: Array<any>, entity: string) => {
    const headers = columns
      .filter((el) => el.title !== "Actions")
      .map((el) => el.title);
    const excelData = [headers];
    data.forEach((item) => {
      const rowData = [
        item.date || "",
        item.id || "",
        item.feedRequestId || "",
        item.farmerName || "",
        item.supplierName || "",
        item.amount?.toLocaleString() || "",
        item.status || "",
      ];
      excelData.push(rowData);
    });
    const workSheet = xlsx.utils.aoa_to_sheet(excelData);
    const columnWidths = [
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
    ];

    workSheet["!cols"] = columnWidths;
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, workSheet, entity);
    xlsx.writeFile(workbook, `${entity.toLocaleLowerCase()}.xlsx`);
  };
</script>

<style scoped></style>
