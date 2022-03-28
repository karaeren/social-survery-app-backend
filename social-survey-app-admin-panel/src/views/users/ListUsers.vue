<template>
  <div class="main centered-main">
    <el-table
      :data="filteredUsersData"
      :default-sort="{ prop: 'rank' }"
      height="100vh"
      style="width: 100%"
    >
      <el-table-column fixed prop="role" label="Role" sortable width="90" />
      <el-table-column prop="id" label="ID" sortable width="240" />
      <el-table-column prop="name" label="name" sortable width="240" />
      <el-table-column prop="email" label="Email" sortable width="240" />
      <el-table-column prop="gender" label="Gender" width="120" />
      <el-table-column prop="birthdate" label="Birthdate" width="180" />
      <el-table-column
        prop="surveyCount"
        label="# of Submitted Surveys"
        sortable
        width="130"
      />
      <el-table-column fixed="right" align="right" min-width="240">
        <template #header>
          <el-input
            v-model="search"
            size="small"
            placeholder="Type to search"
          />
        </template>
        <template v-slot:default="table">
          <el-button
            type="danger"
            size="small"
            @click="deleteUserById(table.row.id)"
          >
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

import { useAccountStore } from '@/stores/account';
import { useUserApi } from '@/composables/api/user';

import { ElMessageBox, ElMessage } from 'element-plus';

const accountStore = useAccountStore(); // account store
const { getAllUsers, deleteUser } = useUserApi(); // survey api

const usersData = ref([]);
const filteredUsersData = computed(() =>
  usersData.value.filter(
    (data) =>
      !search.value ||
      data.name.toLowerCase().includes(search.value.toLowerCase()) ||
      data.email.toLowerCase().includes(search.value.toLowerCase())
  )
);

const search = ref('');

onMounted(async () => {
  if (!accountStore.access.token) return;
  await updateUsersList();
  console.log(usersData.value);
});

async function updateUsersList() {
  try {
    const temp = await getAllUsers(accountStore.access.token);
    temp.results.forEach((x) => {
      if (x.birthdate)
        x.birthdate = new Date(x.birthdate).toISOString().split('T')[0];

      x.surveyCount = x.submittedSurveys.length;
    });
    usersData.value = temp.results;
  } catch (e) {
    console.error(e);
    return ElMessageBox.alert(
      'An unknown error happened while trying to retrieve users...',
      'Error',
      {
        confirmButtonText: 'OK',
      }
    );
  }
}

function deleteUserById(id) {
  ElMessageBox.confirm(
    'Are you sure you want to delete this user? This is irreversible!',
    'Warning',
    {
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        await deleteUser(accountStore.access.token, id);
        ElMessage({
          type: 'success',
          message: 'Delete completed',
        });
        await updateUsersList();
      } catch (e) {
        console.error(e);
        return ElMessageBox.alert(
          "Couldn't delete user, an unknown error happened...",
          'Error',
          {
            confirmButtonText: 'OK',
          }
        );
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
      });
    });
}
</script>
