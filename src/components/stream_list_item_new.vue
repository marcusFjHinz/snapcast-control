<template>
  <div class="text-primary stream-card">
      <q-btn
          @click="show_add_stream_dialog = true"
          class="control-button" size="xl"
          style="width: 100%; height: 100%;background-color: rgb(150,150,150)" flat dense
          icon="stream" label="new"></q-btn>
  </div>
  <add_stream_dialog v-model="show_add_stream_dialog"/>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import add_stream_dialog from "@/dialogs/add_stream_dialog.vue";


export default defineComponent({
  name: "stream_list_item_new",
  components:{
    add_stream_dialog
  },
  props: {
  },
  setup() {
    const show_add_stream_dialog = ref(false);

    return {
      show_add_stream_dialog,
    }

  }
});
</script>

<style scoped>

</style>